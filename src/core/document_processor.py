import os
import re
from pathlib import Path
from typing import Any

from openai import OpenAI
from pypdf import PdfReader


class MiniMaxExtractionError(RuntimeError):
    """Raised when MiniMax extraction fails and a fallback path is needed."""


DEFAULT_MINIMAX_BASE_URL = os.getenv("MINIMAX_BASE_URL", "https://api.minimax.chat/v1")


def _read_text_from_path(path: str) -> str:
    """Read text from a PDF or plain-text file path."""
    file_path = Path(path)
    if file_path.suffix.lower() == ".pdf":
        try:
            reader = PdfReader(str(file_path))
            return "\n\n".join(page.extract_text() or "" for page in reader.pages)
        except (OSError, ValueError, RuntimeError):
            return ""

    try:
        return file_path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""


def _extract_relevant_paragraphs(text: str) -> str:
    """Return only paragraphs matching statutory and safety themes."""
    if not text:
        return ""

    paragraphs = [
        paragraph.strip()
        for paragraph in re.split(r"\n\s*\n", text)
        if paragraph.strip()
    ]
    if not paragraphs:
        return ""

    keywords = [
        "unit entitlement",
        "entitlement",
        "voting",
        "vote",
        "fire safety",
        "fire",
        "safety",
        "statutory",
    ]
    relevant = []
    for paragraph in paragraphs:
        lowered = paragraph.lower()
        if any(keyword in lowered for keyword in keywords):
            relevant.append(paragraph)

    if relevant:
        return "\n\n".join(relevant[:8])

    return "\n\n".join(paragraphs[:3])


def get_minimax_client_or_none() -> OpenAI | None:
    """Create an OpenAI-compatible MiniMax client with dual auth headers."""
    api_key = os.getenv("MINIMAX_API_KEY")
    if not api_key:
        return None

    base_url = os.getenv("MINIMAX_BASE_URL", DEFAULT_MINIMAX_BASE_URL)
    return OpenAI(
        api_key=api_key,
        base_url=base_url,
        default_headers={
            "Authorization": f"Bearer {api_key}",
            "X-API-Key": api_key,
            "api-key": api_key,
        },
    )


def _extract_response_text(response: Any) -> str:
    if hasattr(response, "output_text") and response.output_text:
        return response.output_text

    choices = getattr(response, "choices", None)
    if choices:
        first_choice = choices[0]
        message = getattr(first_choice, "message", None)
        if message is not None:
            content = getattr(message, "content", None)
            if isinstance(content, str):
                return content
            if isinstance(content, list):
                fragments = []
                for item in content:
                    if isinstance(item, dict) and "text" in item:
                        fragments.append(item["text"])
                    elif hasattr(item, "text"):
                        fragments.append(item.text)
                if fragments:
                    return "".join(fragments)

    return str(response)


def extract_statutory_text(pdf_path: str) -> str:
    """Extract statutory paragraphs or fall back to heuristics."""
    extracted_text = _read_text_from_path(pdf_path)
    if not extracted_text:
        return ""

    relevance_hint = _extract_relevant_paragraphs(extracted_text)
    client = get_minimax_client_or_none()
    if client is None:
        return relevance_hint

    instructions = (
        "You are reviewing a lease document. Return only the paragraphs that discuss "
        "unit entitlements, voting rights, and fire safety compliance. If no such "
        "paragraphs exist, return the most relevant paragraphs in the document."
    )

    try:
        response = client.responses.create(
            model=os.getenv("MINIMAX_MODEL", "MiniMax-M3"),
            input=extracted_text[:20000],
            instructions=instructions,
            temperature=0.0,
            max_output_tokens=1200,
        )
        extracted = _extract_response_text(response)
        if extracted:
            return _extract_relevant_paragraphs(extracted)
    except (AttributeError, RuntimeError, ValueError, TypeError):
        return relevance_hint

    try:
        response = client.chat.completions.create(
            model=os.getenv("MINIMAX_MODEL", "MiniMax-M3"),
            messages=[
                {"role": "system", "content": instructions},
                {"role": "user", "content": extracted_text[:20000]},
            ],
            temperature=0.0,
            max_tokens=1200,
        )
        extracted = _extract_response_text(response)
        if extracted:
            return _extract_relevant_paragraphs(extracted)
    except (AttributeError, RuntimeError, ValueError, TypeError):
        return relevance_hint

    return relevance_hint
