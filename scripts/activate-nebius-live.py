"""Nebius DeepSeek-R1 live activation test (2026-08-11).

Calls `run_title_audit_safe()` from
[`src/core/title_agent.py`](src/core/title_agent.py:132) using the
NEBIUS_API_KEY from .env against a cadastral text fixture, then saves
the result to `project/demo/nebius-extraction.live.json`.

Idempotent. Falls back gracefully to the deterministic stub when NEBIUS_API_KEY
is missing or the live call fails.

Usage:  .venv\\Scripts\\python.exe scripts/activate-nebius-live.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_env_file() -> None:
    """Lightweight .env loader (no python-dotenv dependency)."""
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


CADASTRAL_FIXTURE = """
Flat 12, Harbour View Residences, Bridgetown, St. Michael, Barbados.
Registered under the Land Registration Act (Cap. 229) of Barbados.
Unit entitlement: 1.42% of the building (Schedule II, paragraph 4).
Service charge accounts: contributions per service charge year, vote at AGM.
Voting threshold for extraordinary resolutions: 75% (per Schedule III).
Pet clause: "The Tenant shall not keep any pet without the prior written
consent of the Landlord, such consent not to be unreasonably withheld."
Section 20 consultation thresholds may apply for major works.
Beneficial ownership disclosure required under the Companies Act 1981, Cap. 308.
Statutory vulnerabilities observed:
  - Cap. 229 §31 (non-compliance with required forms risks registration void)
  - Building Code §4.3 (fire safety equipment missing on 3rd floor)
  - Data Protection Act 2019 (Section 6) basis missing on tenant card
"""


def main() -> int:
    load_env_file()
    # Ensure `src.*` imports resolve when the script is run directly.
    sys.path.insert(0, str(ROOT))
    api_key = os.environ.get("NEBIUS_API_KEY")
    configured = bool(
        api_key and api_key.strip() and api_key != "your_nebius_api_key_here"
    )

    started_at = _iso_now()
    result: dict = {
        "documentId": f"nebius_live_{int(__import__('time').time() * 1000)}",
        "startedAt": started_at,
        "finishedAt": None,
        "engine": "nebius-deepseek-r1",
        "nebiusConfigured": configured,
        "apiKeyMasked": mask(api_key),
        "model": "deepseek-ai/DeepSeek-V4-Pro",
        "modelOriginalName": (
            "deepseek-ai/DeepSeek-R1 (no longer on Token Factory 2026-08-11;"
            " switched to V4-Pro successor)"
        ),
        "endpoint": os.environ.get(
            "NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1/"
        ),
        "fixture": "cadastral-residential-flat",
        "fixtureSource": "scripts/activate-nebius-live.py (inline)",
        "audit": None,
        "liveCallError": None,
        "scriptSource": "scripts/activate-nebius-live.py",
        "wrapperSource": "src/core/title_agent.py",
        "metadata": {
            "activationRun": "2026-08-11",
            "livePartner": "Nebius Token Factory",
            "notes": [],
        },
    }

    if not configured:
        result["liveCallError"] = "NEBIUS_API_KEY not configured"
        result["metadata"]["notes"].append(
            "NEBIUS_API_KEY missing or placeholder. Returning deterministic fallback."
        )
        result["audit"] = {
            "unit_entitlement_percentage": 0.0,
            "statutory_vulnerabilities": [],
            "voting_threshold_met": False,
            "compliance_notes": (
                "Nebius client not configured. Extraction not performed."
            ),
        }
    else:
        try:
            # Import lazily so a missing venv doesn't kill the script outright.
            from src.core.title_agent import (
                nebius_live_path_active,
                run_title_audit_safe,
            )

            result["metadata"]["notes"].append(
                "nebius_live_path_active=" + str(nebius_live_path_active())
            )
            audit = run_title_audit_safe(CADASTRAL_FIXTURE)
            result["audit"] = {
                "unit_entitlement_percentage": audit.unit_entitlement_percentage,
                "statutory_vulnerabilities": list(audit.statutory_vulnerabilities),
                "voting_threshold_met": audit.voting_threshold_met,
                "compliance_notes": audit.compliance_notes,
            }
            if (
                "[engine: deepseek-r1]" in (audit.compliance_notes or "").lower()
                or "deepseek-r1" in (audit.compliance_notes or "").lower()
                or "[engine: deepseek-v4-pro]" in (audit.compliance_notes or "").lower()
            ):
                result["engine"] = "nebius-deepseek-v4-pro"
        except Exception as exc:  # noqa: BLE001
            result["liveCallError"] = f"{type(exc).__name__}: {exc}"
            result["metadata"]["notes"].append("Live call raised; capturing error.")
            result["audit"] = {
                "unit_entitlement_percentage": 0.0,
                "statutory_vulnerabilities": [],
                "voting_threshold_met": False,
                "compliance_notes": (
                    f"Nebius DeepSeek-R1 call failed: {exc}. "
                    "Falling back to deterministic placeholder."
                ),
            }

    result["finishedAt"] = _iso_now()

    out_path = ROOT / "project" / "demo" / "nebius-extraction.live.json"
    out_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(
        "[activate-nebius] configured={conf} engine={eng} "
        "uep={uep} vulnerabilities={vuln} voting={vote} "
        "notes={notes} -> {out}".format(
            conf=configured,
            eng=result["engine"],
            uep=result["audit"]["unit_entitlement_percentage"],
            vuln=len(result["audit"]["statutory_vulnerabilities"]),
            vote=result["audit"]["voting_threshold_met"],
            notes=str((result["audit"]["compliance_notes"] or "")[:60]).replace(
                "\n", " "
            ),
            out=str(out_path.relative_to(ROOT)),
        )
    )
    return 0


def _iso_now() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).isoformat()


if __name__ == "__main__":
    sys.exit(main())
