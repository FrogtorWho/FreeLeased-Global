import os
from typing import Optional

from openai import OpenAI


def get_nebius_client() -> OpenAI:
    """Create a configured Nebius client using the OpenAI SDK."""
    api_key = os.getenv("NEBIUS_API_KEY")
    if not api_key:
        raise RuntimeError("NEBIUS_API_KEY is not set")

    return OpenAI(
        api_key=api_key,
        base_url="https://api.tokenfactory.nebius.com/v1/",
    )


def get_nebius_client_or_none() -> Optional[OpenAI]:
    """Return a configured client when the API key is present."""
    api_key = os.getenv("NEBIUS_API_KEY")
    if not api_key:
        return None

    return OpenAI(
        api_key=api_key,
        base_url="https://api.tokenfactory.nebius.com/v1/",
    )
