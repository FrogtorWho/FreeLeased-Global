"""Wire-format / endpoint probe for OllyGarden + MiniMax 401 root cause.

This is the audit script that proves WHICH host/header the partner actually
accepts. Three hypotheses:

  H1 (OllyGarden): the partner accepts ONLY `X-OllyGarden-Key`,
     NOT `Authorization: Bearer`. The 401 from `activate-ollygarden-live.py`
     used `X-OllyGarden-Key` per the `ollygarden_observability.py` contract.
     We re-probe with both header styles to confirm which one is canonical.

  H2 (MiniMax host): the partner endpoint is `api.minimax.io` per
     `src/lib/llm.server.ts` (default), not `api.minimax.chat` per
     `src/lib/minimax.ts` + `.env.example`. We probe both.

  H3 (MiniMax model): `minimax-default` is rejected; the canonical model
     name might be `MiniMax-Text-01` (as `llm.server.ts` uses). We probe both.

Output: scripts/proof-probe-result.json - fully masked, with http status
for each combination. Idempotent; never raises.

Usage:
  .venv\\Scripts\\python.exe scripts\\proof-probe-endpoints.py
"""

from __future__ import annotations

import json
import os
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


REDACTED_HEADERS = ("authorization", "x-ollygarden-key")


def http_probe(
    url: str, headers: dict, body: bytes | None = None, timeout_s: float = 8.0
) -> dict:
    started_at = time.time()
    headers_sent = {
        k: ("<redacted>" if k.lower() in REDACTED_HEADERS else v)
        for k, v in headers.items()
    }
    result = {
        "url": url,
        "headersSent": headers_sent,
        "method": "POST" if body is not None else "GET",
        "httpStatus": None,
        "ok": False,
        "elapsedMs": None,
        "error": None,
        "responseBodyPreview": None,
    }
    req = urllib.request.Request(
        url, data=body, method=result["method"], headers=headers
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            result["httpStatus"] = int(resp.status)
            preview = resp.read(2048).decode("utf-8", errors="replace")
            result["responseBodyPreview"] = preview[:600]
            result["ok"] = 200 <= resp.status < 300
    except urllib.error.HTTPError as e:
        result["httpStatus"] = int(e.code)
        try:
            result["responseBodyPreview"] = e.read(1024).decode(
                "utf-8", errors="replace"
            )
        except Exception:
            pass
        result["error"] = f"HTTPError: {e.code}"
    except Exception as e:
        result["error"] = f"{type(e).__name__}: {e}"
    finally:
        result["elapsedMs"] = int((time.time() - started_at) * 1000)
    return result


# Contract provenance strings (extracted to module-level constants to keep
# ruff E501 happy and to make the audit table self-documenting).
CONTRACT_OLLY_X = (
    "src/core/ollygarden_observability.py:62 - verbatim X-OllyGarden-Key header"
)
CONTRACT_OLLY_BEARER = (
    "src/core/telemetry.py:91 + src/lib/ollygarden.ts:172 - " "Authorization: Bearer"
)
CONTRACT_MINIMAX_CHAT = (
    ".env.example:12 + src/lib/llm.server.ts:34 - " "api.minimax.chat + MiniMax-Text-01"
)
CONTRACT_MINIMAX_IO = (
    "src/lib/llm.server.ts:29 default base URL - api.minimax.io + MiniMax-Text-01"
)
CONTRACT_MINIMAX_DEFAULT = (
    "src/lib/minimax.ts:21 default model - api.minimax.chat + minimax-default"
)


def _olly_x_probe(endpoint: str, key: str, body: bytes) -> dict:
    return {
        "probe": "ollygarden_x_key_header",
        "contract": CONTRACT_OLLY_X,
        **http_probe(
            endpoint,
            headers={
                "Content-Type": "application/json",
                "X-OllyGarden-Key": key,
            },
            body=body,
        ),
    }


def _olly_bearer_probe(endpoint: str, key: str, body: bytes) -> dict:
    return {
        "probe": "ollygarden_bearer_header",
        "contract": CONTRACT_OLLY_BEARER,
        **http_probe(
            endpoint,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {key}",
            },
            body=body,
        ),
    }


def _minimax_probe(probe: str, contract: str, url: str, key: str, body: bytes) -> dict:
    return {
        "probe": probe,
        "contract": contract,
        **http_probe(
            url,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {key}",
            },
            body=body,
        ),
    }


def main() -> int:
    load_env_file()

    olly_key = os.environ.get("OLLYGARDEN_API_KEY", "")
    olly_endpoint = os.environ.get(
        "OLLYGARDEN_OTLP_ENDPOINT", "https://in.ollygarden.cloud/v1/traces"
    )
    minimax_key = os.environ.get("MINIMAX_API_KEY", "")

    # Minimal OTLP payload - same shape as activate-ollygarden-live.py.
    otlp_body = json.dumps(
        {
            "resourceSpans": [
                {
                    "resource": {
                        "attributes": [
                            {
                                "key": "service.name",
                                "value": {"stringValue": "freeleased-probe"},
                            }
                        ]
                    },
                    "scopeSpans": [
                        {
                            "scope": {
                                "name": "freeleased.probe",
                                "version": "0.1.0",
                            },
                            "spans": [
                                {
                                    "traceId": "70726f6265" + "0" * 27,
                                    "spanId": "0" * 15 + "1",
                                    "name": "freeleased.wire_format_probe",
                                    "kind": 1,
                                    "startTimeUnixNano": str(int(time.time() * 1e9)),
                                    "endTimeUnixNano": str(
                                        int(time.time() * 1e9) + 1_000_000
                                    ),
                                    "status": {"code": 1},
                                }
                            ],
                        }
                    ],
                }
            ]
        }
    ).encode("utf-8")

    chat_body_text01 = json.dumps(
        {
            "model": "MiniMax-Text-01",
            "messages": [
                {"role": "system", "content": "Reply with the single word: pong"},
                {"role": "user", "content": "ping"},
            ],
            "max_tokens": 16,
            "temperature": 0,
        }
    ).encode("utf-8")

    chat_body_default = json.dumps(
        {
            "model": "minimax-default",
            "messages": [
                {"role": "system", "content": "Reply with the single word: pong"},
                {"role": "user", "content": "ping"},
            ],
            "max_tokens": 16,
            "temperature": 0,
        }
    ).encode("utf-8")

    probes: list[dict] = []

    # --- OllyGarden: try both wire formats ---
    if olly_key:
        probes.append(_olly_x_probe(olly_endpoint, olly_key, otlp_body))
        probes.append(_olly_bearer_probe(olly_endpoint, olly_key, otlp_body))

    # --- MiniMax: try both hosts + both model names ---
    if minimax_key:
        probes.append(
            _minimax_probe(
                "minimax_chat_text01",
                CONTRACT_MINIMAX_CHAT,
                "https://api.minimax.chat/v1/chat/completions",
                minimax_key,
                chat_body_text01,
            )
        )
        probes.append(
            _minimax_probe(
                "minimax_io_text01",
                CONTRACT_MINIMAX_IO,
                "https://api.minimax.io/v1/chat/completions",
                minimax_key,
                chat_body_text01,
            )
        )
        probes.append(
            _minimax_probe(
                "minimax_chat_default_model",
                CONTRACT_MINIMAX_DEFAULT,
                "https://api.minimax.chat/v1/chat/completions",
                minimax_key,
                chat_body_default,
            )
        )

    summary = {
        "documentId": f"proof_probe_{int(time.time() * 1000)}",
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "ollygardenKeyMasked": mask(olly_key),
        "minimaxKeyMasked": mask(minimax_key),
        "ollyEndpoint": olly_endpoint,
        "probeCount": len(probes),
        "probes": probes,
        "scriptSource": "scripts/proof-probe-endpoints.py",
        "purpose": (
            "Test H1 (OllyGarden header) + H2 (MiniMax host) + H3 "
            "(MiniMax model) to determine which combination the partner "
            "actually accepts."
        ),
    }

    out_path = ROOT / "scripts" / "proof-probe-result.json"
    out_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    print(
        f"[proof-probe] olly_key_set={bool(olly_key)} "
        f"minimax_key_set={bool(minimax_key)} "
        f"probe_count={len(probes)} -> {out_path.relative_to(ROOT)}"
    )
    for p in probes:
        print(
            f"  probe={p['probe']:38s} status={p.get('httpStatus')} "
            f"ok={p.get('ok')} elapsed_ms={p.get('elapsedMs')}"
        )
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main())
