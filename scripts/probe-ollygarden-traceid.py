"""Differential probe: trace-id length matters.

Activate script bug: ``trace_id`` like ``"activation20260811"`` is
rjust'd to 32 chars then hex-encoded -> 64 hex chars. OTLP wants 16
bytes -> 32 hex chars. That's likely why activate-ollygarden-live.py
returns 400 while the minimal probe (which uses ``"a"*32`` already
hex-sized) returns 200.

This probe tries four trace-id sizes to confirm.
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


def _probe(name: str, body: bytes, key: str, endpoint: str) -> dict:
    req = urllib.request.Request(
        endpoint,
        data=body,
        method="POST",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
    )
    started = time.time()
    try:
        r = urllib.request.urlopen(req, timeout=8)
        return {
            "variant": name,
            "httpStatus": r.status,
            "elapsedMs": int((time.time() - started) * 1000),
            "body": r.read(2048).decode("utf-8", errors="replace")[:512],
            "ok": 200 <= r.status < 300,
        }
    except urllib.error.HTTPError as e:
        return {
            "variant": name,
            "httpStatus": e.code,
            "elapsedMs": int((time.time() - started) * 1000),
            "body": e.read(2048).decode("utf-8", errors="replace")[:512],
            "ok": False,
        }
    except Exception as e:  # noqa: BLE001
        return {
            "variant": name,
            "httpStatus": None,
            "error": f"{type(e).__name__}: {e}",
            "ok": False,
        }


def main() -> int:
    _load_env()
    key = os.environ.get("OLLYGARDEN_API_KEY", "").strip()
    if not key:
        print("OLLYGARDEN_API_KEY missing.", file=sys.stderr)
        return 1
    endpoint = (
        os.environ.get("OLLYGARDEN_OTLP_ENDPOINT")
        or "https://in.ollygarden.cloud/v1/traces"
    )

    def span(trace_id: str, span_id: str) -> dict:
        return {
            "resourceSpans": [
                {
                    "resource": {
                        "attributes": [
                            {
                                "key": "service.name",
                                "value": {"stringValue": "freeleased"},
                            }
                        ]
                    },
                    "scopeSpans": [
                        {
                            "scope": {"name": "probe"},
                            "spans": [
                                {
                                    "traceId": trace_id,
                                    "spanId": span_id,
                                    "name": "probe",
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

    cases = [
        ("correct_32hex", "a" * 32, "b" * 16),
        ("correct_16hex_each", "0" * 32, "0" * 16),
        ("oversized_64hex", "a" * 64, "b" * 32),  # what activate script likely sends
        ("oversized_64hex_full", "a" * 64, "b" * 16),  # 64-char trace, 16-char span
        ("undersized_8hex", "a" * 8, "b" * 8),
    ]
    results = [
        _probe(name, json.dumps(span(t, s)).encode(), key, endpoint)
        for name, t, s in cases
    ]
    out = {
        "probedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "endpoint": endpoint,
        "apiKeyMasked": f"{key[:4]}***",
        "results": results,
    }
    print(json.dumps(out, indent=2))
    (ROOT / "memory" / "2026-08-11-ollygarden-traceid-probe.json").write_text(
        json.dumps(out, indent=2) + "\n", encoding="utf-8"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
