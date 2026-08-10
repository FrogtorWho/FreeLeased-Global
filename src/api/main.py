import os
import tempfile
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from src.core.pipeline import process_lease_document
from src.db.models import LeaseAuditResult, SessionLocal, init_db

app = FastAPI(title="FreeLeased Lease Audit API")
init_db()


@app.get("/")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/upload-lease")
async def upload_lease(
    file: Annotated[UploadFile, File(...)],
) -> dict[str, object]:
    if not file.filename:
        return JSONResponse(status_code=400, content={"detail": "No file provided"})

    suffix = Path(file.filename).suffix or ".txt"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as handle:
        payload = await file.read()
        handle.write(payload)
        temp_path = handle.name

    try:
        result = process_lease_document(temp_path)

        db = SessionLocal()
        try:
            record = LeaseAuditResult(
                source_file_name=file.filename,
                unit_entitlement_percentage=result.unit_entitlement_percentage,
                statutory_vulnerabilities=result.statutory_vulnerabilities,
                voting_threshold_met=result.voting_threshold_met,
                compliance_notes=result.compliance_notes,
            )
            db.add(record)
            db.commit()
            db.refresh(record)
        finally:
            db.close()

        return {
            "id": record.id,
            "file_name": file.filename,
            "result": result.model_dump(),
        }
    finally:
        try:
            os.unlink(temp_path)
        except FileNotFoundError:
            pass
