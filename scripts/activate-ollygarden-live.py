"""OllyGarden live activation test (2026-08-11).

Initialises the OTLP exporter using `OLLYGARDEN_API_KEY` from .env,
emits a single test span, and saves a local copy of the OTLP-shaped
payload to `memory/2026-08-11-ollygarden-sample.json`.

The exporter attempts a real POST against the OTLP endpoint
(`https://in.ollygarden.cloud/v1/traces`). When the network is
unreachable or auth fails, the span is captured locally regardless
so the artefact always exists.

Usage:  .venv\\Scripts\\python.exe scripts/activate-ollygarden-live.py
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_env_file() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip()
        if key and key not in os.environ:
            os.environ[key] = val


def mask(value: str | None) -> str:
    if not value:
        return "(unset)"
    return f"{value[:4]}***"


def to_otlp(span: dict) -> dict:
    """Build a minimal OTLP/HTTP JSON envelope around an in-memory span."""
    start_ns = str(int(span["start_unix_nano"]))
    end_ns = str(int(span["end_unix_nano"]))
    trace_id = span["trace_id"].rjust(32, "0")[:32].encode("ascii").hex()
    span_id = span["span_id"].rjust(16, "0")[:16].encode("ascii").hex()
    return {
        "resourceSpans": [
            {
                "resource": {
                    "attributes": [
                        {"key": "service.name", "value": {"stringValue": "freeleased"}},
                        {"key": "service.version", "value": {"stringValue": "0.1.0"}},
                        {
                            "key": "ollygarden.platform",
                            "value": {"stringValue": "freeleased"},
                        },
                    ],
                },
                "scopeSpans": [
                    {
                        "scope": {
                            "name": "freeleased.ollygarden.live-test",
                            "version": "0.1.0",
                        },
                        "spans": [
                            {
                                "traceId": trace_id,
                                "spanId": span_id,
                                "name": span["name"],
                                "kind": 1,  # SPAN_KIND_INTERNAL
                                "startTimeUnixNano": start_ns,
                                "endTimeUnixNano": end_ns,
                                "attributes": [
                                    {"key": k, "value": {"stringValue": str(v)}}
                                    for k, v in span.get("attributes", {}).items()
                                ],
                                "status": {"code": 1},  # OK
                            }
                        ],
                    }
                ],
            }
        ]
    }


def post_otlp(
    endpoint: str, api_key: str, payload: dict, timeout_s: float = 8.0
) -> dict:
    """Send the OTLP payload. Returns a status dict; NEVER raises."""
    started_at = time.time()
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-OllyGarden-Key": api_key,
        },
    )
    result: dict = {
        "attemptedAt": datetime.now(timezone.utc).isoformat(),
        "endpoint": endpoint,
        "elapsedMs": None,
        "httpStatus": None,
        "ok": False,
        "error": None,
        "responseBodyPreview": None,
    }
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            result["httpStatus"] = int(resp.status)
            preview = resp.read(2048).decode("utf-8", errors="replace")
            result["responseBodyPreview"] = preview[:1024]
            result["ok"] = 200 <= resp.status < 300
    except urllib.error.HTTPError as e:
        result["httpStatus"] = int(e.code)
        try:
            result["responseBodyPreview"] = e.read(1024).decode(
                "utf-8", errors="replace"
            )
        except OSError as decode_err:
            result["responseBodyPreview"] = None
            result["error"] = f"HTTPError: {e.code} (decode failed: {decode_err})"
            return result
        result["error"] = f"HTTPError: {e.code}"
    except (TimeoutError, urllib.error.URLError, ConnectionError) as e:
        result["error"] = f"{type(e).__name__}: {e}"
    except OSError as e:
        result["error"] = f"{type(e).__name__}: {e}"
    finally:
        result["elapsedMs"] = int((time.time() - started_at) * 1000)
    return result


def main() -> int:
    load_env_file()
    api_key = os.environ.get("OLLYGARDEN_API_KEY")
    endpoint = (
        os.environ.get("OLLYGARDEN_OTLP_ENDPOINT")
        or "https://in.ollygarden.cloud/v1/traces"
    )
    configured = bool(api_key and api_key.strip())

    now_ns = time.time_ns()
    span = {
        "name": "freeleased.partner_activation_test",
        "trace_id": "activation20260811",
        "span_id": "olly01",
        "start_unix_nano": now_ns,
        "end_unix_nano": now_ns + 12_500_000,  # 12.5 ms
        "attributes": {
            "activation.run": "2026-08-11",
            "activation.partner": "ollygarden",
            "service.name": "freeleased",
            "service.version": "0.1.0",
            "deployment.environment": os.environ.get("DEPLOY_ENV", "development"),
            "test.kind": "live-activation",
        },
    }
    otlp_payload = to_otlp(span)

    post_result: dict = {
        "attemptedAt": None,
        "endpoint": endpoint,
        "ok": False,
        "skippedReason": "OLLYGARDEN_API_KEY not configured",
    }

    if configured:
        post_result = post_otlp(endpoint, api_key, otlp_payload)

    summary = {
        "documentId": f"ollygarden_live_{int(time.time() * 1000)}",
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "finishedAt": datetime.now(timezone.utc).isoformat(),
        "engine": "ollygarden-otlp",
        "ollygardenConfigured": configured,
        "apiKeyMasked": mask(api_key),
        "endpoint": endpoint,
        "otlpPayload": otlp_payload,
        "postResult": post_result,
        "span": {
            "name": span["name"],
            "traceId": span["trace_id"],
            "spanId": span["span_id"],
            "durationMs": 12.5,
            "attributeKeys": sorted(span["attributes"].keys()),
        },
        "scriptSource": "scripts/activate-ollygarden-live.py",
        "wrapperSource": "src/core/ollygarden_observability.py",
        "metadata": {
            "activationRun": "2026-08-11",
            "livePartner": "OllyGarden",
            "notes": [
                (
                    "OLLYGARDEN_API_KEY present — POST attempted."
                    if configured
                    else "OLLYGARDEN_API_KEY missing; POST skipped, span captured."
                ),
                "Local artefact always produced for activation record.",
            ],
        },
    }

    out_path = ROOT / "memory" / "2026-08-11-ollygarden-sample.json"
    out_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(
        "[activate-ollygarden] configured={c} endpoint={e} attempt={a} "
        "ok={ok} http={status} elapsed_ms={ms} -> {out}".format(
            c=configured,
            e=endpoint,
            a=not bool(post_result.get("skippedReason")),
            ok=post_result.get("ok"),
            status=post_result.get("httpStatus"),
            ms=post_result.get("elapsedMs"),
            out=str(out_path.relative_to(ROOT)),
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
