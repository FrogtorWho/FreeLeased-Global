"""Lease Audit API.

24/7 asynchronous lease ingestion pipeline. Receives a lease document,
schedules the dual-agent extraction (document reader + title audit) in
a background task, persists the structured result to the audit database,
and exposes status and result endpoints for the React frontend to poll.

Pipeline:
    HTTP POST /upload-lease  -> enqueue background task
    background task:
        1. Run document extraction (MiniMax) to isolate statutory text
        2. Run title audit (Nebius DeepSeek-R1) to structure the output
        3. Persist the structured result to LeaseAuditResult
    HTTP GET  /audit-status/{job_id}  -> poll the in-memory status
    HTTP GET  /audit-results/{db_id}   -> fetch a persisted record by id

OllyGarden observability (V187, Day 14 of 21, Mavis canonical):
    * The FastAPI startup event initialises the OllyGarden OTLP tracer
      when ``OLLYGARDEN_API_KEY`` is set in the environment. When the
      key is absent, telemetry is disabled and a warning is logged;
      the host application is never crashed by an observability failure.
    * Two test traces are emitted on startup so the OllyGarden UI
      surfaces the FreeLeased service as soon as it boots.
    * The dual-agent extraction and the structured audit write are
      each wrapped in a span so the OTLP exporter ships a span tree
      for every uploaded lease.
    * The existing BackgroundTasks + dedicated-session pattern is
      preserved; the OllyGarden wire-in is read-only with respect to
      the worker and the database session.
"""

from __future__ import annotations

import logging
import os
import tempfile
import uuid
from pathlib import Path
from typing import Annotated, Any

from fastapi import BackgroundTasks, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from src.core.ollygarden_observability import (
    init_ollygarden,
    is_ollygarden_configured,
    record_metric,
    shutdown_ollygarden,
    start_span,
)
from src.core.pipeline import process_lease_document
from src.db.models import LeaseAuditResult, SessionLocal, init_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Lease Audit API")
init_db()


@app.on_event("startup")
def _startup_event() -> None:
    """Initialise OllyGarden telemetry on FastAPI startup.

    Emits two test traces so the OllyGarden UI surfaces the FreeLeased
    service as soon as it boots. The test traces are guarded by the
    ``OLLYGARDEN_API_KEY`` env var: when the key is absent, the
    ``start_span`` context manager yields ``None`` and the boot
    completes without crash.
    """
    provider = init_ollygarden()
    if provider is None:
        logger.warning(
            "OllyGarden telemetry disabled (no OLLYGARDEN_API_KEY). "
            "The service is healthy; only the observability export is offline.",
        )
        return

    with start_span(
        "freeleased.startup",
        attributes={
            "freeleased.component": "api",
            "ollygarden.configured": is_ollygarden_configured(),
        },
    ):
        logger.info("OllyGarden startup test trace 1/2 emitted.")

    with start_span(
        "freeleased.startup.healthcheck",
        attributes={"freeleased.component": "api"},
    ):
        logger.info("OllyGarden startup test trace 2/2 emitted.")

    record_metric("freeleased.startup.ollygarden_initialised", 1.0)


@app.on_event("shutdown")
def _shutdown_event() -> None:
    """Flush the OllyGarden exporter buffer on FastAPI shutdown."""
    shutdown_ollygarden()


# In-memory job status store. Persistent across the API process lifetime;
# cleared on restart. The React frontend polls this for live status. The
# structured audit result is written to the audit database by the worker
# and is the canonical record; the in-memory copy is for instant polling.
audit_jobs: dict[str, dict[str, Any]] = {}


def automated_extraction_worker(
    job_id: str, file_path: str, original_filename: str
) -> None:
    """Run the AI pipeline in a background thread and persist the result.

    FastAPI BackgroundTasks executes the worker in the threadpool after
    the HTTP response has already been sent to the client. The worker
    therefore opens its own dedicated SQLAlchemy session and commits
    before releasing the connection. The in-memory status store is
    updated so the frontend can poll the result without touching the
    database directly.
    """
    try:
        logger.info(
            "[Job %s] Phase 1: extraction (MiniMax) + audit (Nebius)",
            job_id,
        )
        with start_span(
            "process_lease_document",
            attributes={
                "freeleased.job_id": job_id,
                "freeleased.source_file": original_filename,
            },
        ) as span:
            result = process_lease_document(file_path)
            if span is not None:
                span.set_attribute(
                    "freeleased.unit_entitlement_percentage",
                    float(result.unit_entitlement_percentage),
                )
                span.set_attribute(
                    "freeleased.voting_threshold_met",
                    bool(result.voting_threshold_met),
                )
                span.set_attribute(
                    "freeleased.statutory_vulnerabilities_count",
                    len(result.statutory_vulnerabilities or []),
                )

        logger.info("[Job %s] Phase 2: persisting structured audit to database", job_id)
        with start_span(
            "lease_audit_result.write",
            attributes={
                "freeleased.job_id": job_id,
                "freeleased.db_model": "LeaseAuditResult",
            },
        ) as span:
            db = SessionLocal()
            try:
                record = LeaseAuditResult(
                    source_file_name=original_filename,
                    unit_entitlement_percentage=result.unit_entitlement_percentage,
                    statutory_vulnerabilities=list(
                        result.statutory_vulnerabilities or []
                    ),
                    voting_threshold_met=bool(result.voting_threshold_met),
                    compliance_notes=result.compliance_notes or "",
                )
                db.add(record)
                db.commit()
                db.refresh(record)
                db_id = int(record.id)
            finally:
                db.close()
            if span is not None:
                span.set_attribute("freeleased.lease_audit_id", db_id)

        audit_jobs[job_id] = {
            "status": "completed",
            "db_id": db_id,
            "result": result.model_dump(),
        }
        record_metric("freeleased.lease_audit.completed", 1.0)
        logger.info(
            "[Job %s] Pipeline complete. Persisted to audit DB id=%s", job_id, db_id
        )
    except Exception as exc:  # pylint: disable=broad-except  # noqa: BLE001
        logger.error("[Job %s] Pipeline failed: %r", job_id, exc)
        audit_jobs[job_id] = {
            "status": "failed",
            "error": str(exc),
            "error_type": type(exc).__name__,
        }
        record_metric("freeleased.lease_audit.failed", 1.0)
    finally:
        # Remove the temp file we wrote when the upload landed. The worker
        # is the last place that holds a reference to the file path.
        try:
            os.unlink(file_path)
        except OSError:
            pass


@app.get("/")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/upload-lease")
async def upload_lease(
    background_tasks: BackgroundTasks,
    file: Annotated[UploadFile, File(...)],
) -> dict[str, object]:
    """Accept a lease document, schedule the AI pipeline, return job_id."""
    if not file.filename:
        return JSONResponse(status_code=400, content={"detail": "No file provided"})

    suffix = Path(file.filename).suffix or ".txt"
    job_id = str(uuid.uuid4())

    # Persist the upload to a temp file because the worker runs in a
    # separate thread and the UploadFile stream is closed by the time
    # the worker executes. A temp path is the simplest hand-off.
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as handle:
        payload = await file.read()
        handle.write(payload)
        temp_path = handle.name

    audit_jobs[job_id] = {
        "status": "processing",
        "filename": file.filename,
    }
    background_tasks.add_task(
        automated_extraction_worker, job_id, temp_path, file.filename
    )

    return {
        "message": "Lease accepted for processing.",
        "job_id": job_id,
    }


@app.get("/audit-status/{job_id}")
async def get_audit_status(job_id: str) -> dict[str, Any]:
    """Poll the status of a previously submitted job.

    Returns one of:
        {"status": "processing", "filename": ...}   while the worker runs
        {"status": "completed", "db_id": ..., "result": {...}}  on success
        {"status": "failed", "error": ..., "error_type": ...}      on failure
        {"status": "not_found", "job_id": ...}                    if unknown
    """
    return audit_jobs.get(job_id, {"status": "not_found", "job_id": job_id})


@app.get("/audit-results/{db_id}")
async def get_audit_result(db_id: int) -> dict[str, Any]:
    """Fetch a persisted audit record by its database id."""
    db = SessionLocal()
    try:
        record = db.query(LeaseAuditResult).filter(LeaseAuditResult.id == db_id).first()
        if record is None:
            raise HTTPException(
                status_code=404,
                detail=f"Audit record {db_id} not found",
            )
        return {
            "id": int(record.id),
            "source_file_name": record.source_file_name,
            "unit_entitlement_percentage": float(record.unit_entitlement_percentage),
            "statutory_vulnerabilities": list(record.statutory_vulnerabilities or []),
            "voting_threshold_met": bool(record.voting_threshold_met),
            "compliance_notes": record.compliance_notes or "",
            "created_at": record.created_at.isoformat() if record.created_at else None,
        }
    finally:
        db.close()
