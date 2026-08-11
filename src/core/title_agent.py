import json
import os
from typing import Any

from pydantic import BaseModel, Field

from .nebius_client import get_nebius_client_or_none


class CadastralAudit(BaseModel):
    """Schema capturing cadastral/title audit results extracted from text."""

    unit_entitlement_percentage: float = Field(
        ..., description="Unit entitlement as a percentage"
    )
    statutory_vulnerabilities: list[str] = Field(
        default_factory=list, description="List of statutory vulnerabilities or flags"
    )
    voting_threshold_met: bool = Field(
        ..., description="Whether the required voting threshold has been met"
    )
    compliance_notes: str = Field(
        "", description="Human-readable compliance and notes section"
    )


def _extract_response_text(response: Any) -> str:
    if hasattr(response, "output_text") and response.output_text:
        return response.output_text

    output = getattr(response, "output", None)
    if output:
        try:
            first = output[0]
            content = getattr(first, "content", None)
            if content:
                if isinstance(content, str):
                    return content
                if isinstance(content, (list, tuple)):
                    fragments = []
                    for item in content:
                        if isinstance(item, dict) and "text" in item:
                            fragments.append(item["text"])
                        elif hasattr(item, "text"):
                            fragments.append(item.text)
                    return "".join(fragments)
        except (AttributeError, IndexError, TypeError):
            pass

    if hasattr(response, "to_dict"):
        try:
            raw = response.to_dict()
            output_data = raw.get("output")
            if output_data and isinstance(output_data, list):
                first = output_data[0]
                if isinstance(first, dict):
                    content = first.get("content")
                    if isinstance(content, list):
                        for item in content:
                            if (
                                isinstance(item, dict)
                                and item.get("type") == "output_text"
                            ):
                                return item.get("text", "")
                            if isinstance(item, dict) and "text" in item:
                                return item.get("text", "")
        except (AttributeError, IndexError, TypeError):
            pass
    raise ValueError("Unable to extract textual output from Nebius response")


def run_title_audit(cadastral_text: str) -> CadastralAudit:
    """Run a title/cadastral audit over freeform cadastral_text.

    Uses Nebius DeepSeek-R1 to extract the values needed for the CadastralAudit
    schema from the provided description.

    Partners brainstorm pick #5: when ``NEBIUS_API_KEY`` is set, this
    hits the live DeepSeek-R1 endpoint. Otherwise it returns the
    deterministic fallback (zeroed fields + "not configured" note).
    Live calls may raise — callers that want to remain crash-free
    should use :func:`run_title_audit_safe` instead.
    """

    client = get_nebius_client_or_none()
    if client is None:
        return CadastralAudit(
            unit_entitlement_percentage=0.0,
            statutory_vulnerabilities=[],
            voting_threshold_met=False,
            compliance_notes="Nebius client not configured. Extraction not performed.",
        )

    instructions = (
        "Return only valid JSON that maps exactly to the CadastralAudit schema. "
        "Do not include any explanatory text, markdown, or comments. "
        "The JSON object must contain the keys: unit_entitlement_percentage, "
        "statutory_vulnerabilities, voting_threshold_met, and compliance_notes. "
        "Provide unit_entitlement_percentage as a float, "
        "statutory_vulnerabilities as a list of strings, "
        "voting_threshold_met as a boolean, "
        "and compliance_notes as a string."
    )

    response = client.responses.create(
        model="deepseek-ai/DeepSeek-R1",
        input=cadastral_text,
        instructions=instructions,
        temperature=0.0,
        max_output_tokens=800,
        user="title-audit-extraction",
    )

    output_text = _extract_response_text(response)
    try:
        parsed = json.loads(output_text)
    except json.JSONDecodeError as exc:
        raise ValueError(
            "Nebius DeepSeek-R1 response did not contain valid JSON. "
            f"Raw output was: {output_text!r}"
        ) from exc

    if not isinstance(parsed, dict):
        raise TypeError(
            "Nebius DeepSeek-R1 response must deserialize to a JSON object "
            "matching CadastralAudit"
        )

    return CadastralAudit.parse_obj(parsed)


def run_title_audit_safe(cadastral_text: str) -> CadastralAudit:
    """Crash-free variant of :func:`run_title_audit`.

    Always returns a populated :class:`CadastralAudit`. When ``NEBIUS_API_KEY``
    is unset, OR the live call fails for any reason (network, JSON parse,
    schema mismatch), the returned audit reflects the failure mode in
    ``compliance_notes`` and uses safe defaults for the numeric fields.

    This is the variant the demo-day paths should use — it never raises.
    The non-safe ``run_title_audit`` is for code paths that *want* to
    surface the failure (e.g. the test harness).
    """

    key_set = bool((os.getenv("NEBIUS_API_KEY") or "").strip())
    try:
        result = run_title_audit(cadastral_text)
        if not key_set:
            # The deterministic fallback already populated
            # compliance_notes with "not configured" — leave as-is.
            return result
        # Live call succeeded — annotate the audit so callers can tell.
        if "compliance_notes" in result.dict():
            note = result.compliance_notes or ""
            if "deepseek-r1" not in note.lower():
                result.compliance_notes = f"[engine: deepseek-r1] {note}".strip()
        return result
    except Exception as exc:  # noqa: BLE001 — we deliberately swallow all errors
        return CadastralAudit(
            unit_entitlement_percentage=0.0,
            statutory_vulnerabilities=[],
            voting_threshold_met=False,
            compliance_notes=(
                f"Nebius DeepSeek-R1 call failed: {exc}. "
                "Falling back to deterministic placeholder."
            ),
        )


def nebius_live_path_active() -> bool:
    """Return True when :func:`run_title_audit` will hit the live endpoint.

    This is the env-guard used by the demo script and the test harness
    to decide whether to record the run as a "live" extraction or a
    "fallback" extraction. It is the single source of truth for the
    Partners brainstorm pick #5 wiring.
    """

    key = (os.getenv("NEBIUS_API_KEY") or "").strip()
    if not key:
        return False
    if key == "your_nebius_api_key_here":
        return False
    return True
