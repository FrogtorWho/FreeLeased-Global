import json
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
