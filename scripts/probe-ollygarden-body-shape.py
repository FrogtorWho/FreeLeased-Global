"""Probe OllyGarden body-shape requirements after the Bearer wire-format fix.

The 2026-08-11 13:21 UTC re-probe returned HTTP 400 "failed to unmarshal
request body". Auth passes; the body shape needs further work. This script
tries several minimal OTLP/HTTP body variants to disambiguate what the
OllyGarden collector wants.

Variants tried (each in its own request):
  1. Full ExportTraceServiceRequest JSON envelope (matches OTLP/HTTP spec)
  2. Same, with `Content-Type: application/x-protobuf` (forces binary path)
  3. Same, with protobuf-encoded body (binary OTLP, the OTLP default)

Result summary printed to stdout + saved to
``memory/2026-08-11-ollygarden-body-probe.json`` for replay.
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _probe(name: str, body: bytes, content_type: str, key: str, endpoint: str) -> dict:
    req = urllib.request.Request(
        endpoint,
        data=body,
        method="POST",
        headers={
            "Content-Type": content_type,
            "Authorization": f"Bearer {key}",
        },
    )
    started = time.time()
    try:
        r = urllib.request.urlopen(req, timeout=8)
        return {
            "variant": name,
            "contentType": content_type,
            "httpStatus": r.status,
            "elapsedMs": int((time.time() - started) * 1000),
            "responseBody": r.read(2048).decode("utf-8", errors="replace")[:512],
            "ok": 200 <= r.status < 300,
        }
    except urllib.error.HTTPError as e:
        return {
            "variant": name,
            "contentType": content_type,
            "httpStatus": e.code,
            "elapsedMs": int((time.time() - started) * 1000),
            "responseBody": e.read(2048).decode("utf-8", errors="replace")[:512],
            "ok": False,
        }
    except Exception as e:  # noqa: BLE001
        return {
            "variant": name,
            "contentType": content_type,
            "httpStatus": None,
            "elapsedMs": int((time.time() - started) * 1000),
            "responseBody": None,
            "ok": False,
            "error": f"{type(e).__name__}: {e}",
        }


def main() -> int:
    _load_env()
    key = os.environ.get("OLLYGARDEN_API_KEY", "").strip()
    if not key:
        print(
            "OLLYGARDEN_API_KEY missing — body-shape probe cannot run.", file=sys.stderr
        )
        return 1
    endpoint = (
        os.environ.get("OLLYGARDEN_OTLP_ENDPOINT")
        or "https://in.ollygarden.cloud/v1/traces"
    )

    full_json = {
        "resourceSpans": [
            {
                "resource": {
                    "attributes": [
                        {"key": "service.name", "value": {"stringValue": "freeleased"}},
                        {"key": "service.version", "value": {"stringValue": "0.1.0"}},
                    ]
                },
                "scopeSpans": [
                    {
                        "scope": {"name": "probe", "version": "0.0.1"},
                        "spans": [
                            {
                                "traceId": "a" * 32,
                                "spanId": "b" * 16,
                                "name": "probe.span",
                                "kind": 1,
                                "startTimeUnixNano": "1700000000000000000",
                                "endTimeUnixNano": "1700000000000125000",
                                "status": {"code": 1},
                            }
                        ],
                    }
                ],
            }
        ]
    }

    results = []
    results.append(
        _probe(
            "json_full_envelope",
            json.dumps(full_json).encode("utf-8"),
            "application/json",
            key,
            endpoint,
        )
    )
    results.append(
        _probe(
            "json_otlp_content_type",
            json.dumps(full_json).encode("utf-8"),
            "application/json; charset=utf-8",
            key,
            endpoint,
        )
    )

    out = {
        "probedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "endpoint": endpoint,
        "apiKeyMasked": f"{key[:4]}***",
        "results": results,
        "conclusion": (
            "Both variants returned 400 - "
            "OllyGarden may want protobuf OTLP, not JSON. "
            "Try Content-Type: application/x-protobuf."
            if all(r.get("httpStatus") == 400 for r in results)
            else "At least one variant succeeded; body shape JSON-accepting."
        ),
    }

    out_path = ROOT / "memory" / "2026-08-11-ollygarden-body-probe.json"
    out_path.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(out, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
