"""Nebius Token Factory client factory.

This module provides a thin wrapper around the standard OpenAI Python SDK
configured to talk to the Nebius Token Factory endpoint. Using the OpenAI
SDK keeps the surface area consistent with the rest of the codebase and
makes it trivial to swap models or endpoints later.

Environment variables:
    NEBIUS_API_KEY: Required. The Nebius Token Factory API key.

Example:
    >>> from src.core.nebius_client import get_nebius_client
    >>> client = get_nebius_client()
    >>> response = client.chat.completions.create(
    ...     model="deepseek-ai/DeepSeek-R1",
    ...     messages=[{"role": "user", "content": "Hello"}],
    ... )
"""

from __future__ import annotations

import os
from typing import Optional

from openai import OpenAI


NEBIUS_BASE_URL = "https://api.tokenfactory.nebius.com/v1/"


def get_nebius_client() -> OpenAI:
    """Return a configured Nebius OpenAI client.

    Reads ``NEBIUS_API_KEY`` from the environment and constructs an
    :class:`openai.OpenAI` instance pointed at the Nebius Token Factory
    base URL.

    Returns:
        OpenAI: A ready-to-use OpenAI client configured for Nebius.

    Raises:
        RuntimeError: If ``NEBIUS_API_KEY`` is not set in the environment.
    """
    api_key = os.getenv("NEBIUS_API_KEY")
    if not api_key:
        raise RuntimeError("NEBIUS_API_KEY is not set in the environment")

    return OpenAI(
        api_key=api_key,
        base_url=NEBIUS_BASE_URL,
    )


def get_nebius_client_or_none() -> Optional[OpenAI]:
    """Return a configured Nebius client, or ``None`` if the key is missing.

    This is a non-raising variant useful for optional integrations where
    the caller wants to gracefully degrade when credentials are absent.

    Returns:
        Optional[OpenAI]: The configured client, or ``None`` if the
        ``NEBIUS_API_KEY`` environment variable is not set.
    """
    api_key = os.getenv("NEBIUS_API_KEY")
    if not api_key:
        return None

    return OpenAI(
        api_key=api_key,
        base_url=NEBIUS_BASE_URL,
    )
