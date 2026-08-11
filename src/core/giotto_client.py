"""Giotto.ai client factory.

This module provides a thin wrapper around the standard OpenAI Python SDK
configured to talk to the Giotto.ai endpoint. Using the OpenAI SDK keeps the
surface area consistent with the rest of the codebase (notably
:mod:`src.core.nebius_client`) and makes it trivial to swap models or endpoints
later.

Environment variables:
    GIOTTO_API_KEY:   Required (for live calls). The Giotto.ai API key.
    GIOTTO_BASE_URL:  Optional. Defaults to ``https://api.giotto.ai/v1/``
                      (TBD — confirm with Daniel Alvarez or giotto.ai docs).

Why Giotto:
    * Free unlimited API access for Future Caribbean participants.
    * OpenAI-compatible SDK → drop-in replacement for Nebius client.
    * Compact reasoning engine — cheaper + faster for per-resident call
      volume than the Nebius DeepSeek-R1 default.
    * Multimodal inputs (text + image) and built-in OCR → lease scans can
      flow through the same client as text queries.
    * Vector RAG + memory for jurisdiction-specific clause indexing.

Example:
    >>> from src.core.giotto_client import get_giotto_client
    >>> client = get_giotto_client()
    >>> response = client.chat.completions.create(
    ...     model="giotto-compact",
    ...     messages=[{"role": "user", "content": "Classify this lease"}],
    ... )

For graceful fallback (e.g. when the key isn't yet provisioned) use
:func:`get_giotto_client_or_none`.
"""

from __future__ import annotations

import os
from typing import Optional

from openai import OpenAI

# Default base URL — TBD pending confirmation from Daniel Alvarez or the
# giotto.ai docs. Overridable via the GIOTTO_BASE_URL environment variable.
DEFAULT_GIOTTO_BASE_URL = "https://api.giotto.ai/v1/"


def get_giotto_client() -> OpenAI:
    """Return a configured Giotto.ai OpenAI client.

    Reads ``GIOTTO_API_KEY`` and ``GIOTTO_BASE_URL`` from the environment
    and constructs an :class:`openai.OpenAI` instance pointed at Giotto's
    OpenAI-compatible endpoint.

    Returns:
        OpenAI: A ready-to-use OpenAI client configured for Giotto.ai.

    Raises:
        RuntimeError: If ``GIOTTO_API_KEY`` is not set in the environment.
    """
    api_key = os.getenv("GIOTTO_API_KEY")
    if not api_key:
        raise RuntimeError("GIOTTO_API_KEY is not set in the environment")

    base_url = os.getenv("GIOTTO_BASE_URL", DEFAULT_GIOTTO_BASE_URL)

    return OpenAI(
        api_key=api_key,
        base_url=base_url,
    )


def get_giotto_client_or_none() -> Optional[OpenAI]:
    """Return a configured Giotto.ai client, or ``None`` if the key is missing.

    Non-raising variant useful for optional integrations where the caller
    wants to gracefully degrade when credentials are absent (e.g. the
    16 Aug demo running on a kiosk without a provisioned key).

    Returns:
        Optional[OpenAI]: The configured client, or ``None`` if the
        ``GIOTTO_API_KEY`` environment variable is not set.
    """
    api_key = os.getenv("GIOTTO_API_KEY")
    if not api_key:
        return None

    base_url = os.getenv("GIOTTO_BASE_URL", DEFAULT_GIOTTO_BASE_URL)

    return OpenAI(
        api_key=api_key,
        base_url=base_url,
    )


def giotto_configured() -> bool:
    """Return ``True`` if a Giotto API key appears to be configured.

    Treats the explicit ``"your_giotto_api_key_here"`` placeholder as
    *not configured* so the test harness and runtime code share the
    same notion of "ready to call".
    """
    api_key = os.getenv("GIOTTO_API_KEY")
    if not api_key:
        return False
    if api_key.strip() in {"", "your_giotto_api_key_here"}:
        return False
    return True
