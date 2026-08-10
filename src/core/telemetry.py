"""OpenTelemetry configuration for OllyGarden observability.

This module wires up the OpenTelemetry OTLP HTTP exporter so that traces
from the FreeLeased backend are shipped to the OllyGarden observability
platform. All telemetry failures are swallowed so that observability
problems never crash the host application.

Environment variables:
    OLLYGARDEN_OTLP_ENDPOINT: Optional. Override the OTLP endpoint.
        Defaults to ``https://in.ollygarden.cloud/v1/traces``.
    OLLYGARDEN_API_KEY: Optional. Bearer token sent in the
        ``Authorization`` header. If absent, telemetry is disabled and
        ``init_telemetry`` returns ``None``.

Example:
    >>> from src.core.telemetry import init_telemetry, get_tracer
    >>> init_telemetry(service_name="freeleased-backend")
    >>> tracer = get_tracer("freeleased.pipeline")
    >>> with tracer.start_as_current_span("process-lease"):
    ...     ...
"""

from __future__ import annotations

import logging
import os

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

logger = logging.getLogger(__name__)

DEFAULT_OTLP_ENDPOINT = "https://in.ollygarden.cloud/v1/traces"
DEFAULT_SERVICE_NAME = "freeleased-backend"


def _build_resource(service_name: str) -> Resource:
    """Build an OpenTelemetry Resource with OllyGarden attributes.

    Args:
        service_name: Logical service name to attach to every span.

    Returns:
        Resource: A Resource populated with service identification
        attributes suitable for OllyGarden ingestion.
    """
    return Resource.create(
        {
            "service.name": service_name,
            "service.namespace": "freeleased",
            "deployment.environment": os.getenv("DEPLOY_ENV", "development"),
            "telemetry.sdk.language": "python",
            "ollygarden.platform": "freeleased",
        }
    )


def init_telemetry(
    service_name: str = DEFAULT_SERVICE_NAME,
) -> TracerProvider | None:
    """Initialise OpenTelemetry tracing for OllyGarden export.

    This is the canonical entry point. It is safe to call multiple times;
    only the first call wires up the global tracer provider. If the
    ``OLLYGARDEN_API_KEY`` is not set, the function logs a warning and
    returns ``None`` without raising.

    Args:
        service_name: Logical service name to attach to every span.

    Returns:
        TracerProvider | None: The configured provider, or ``None`` if
        telemetry was disabled because credentials are missing.
    """
    endpoint = os.getenv("OLLYGARDEN_OTLP_ENDPOINT", DEFAULT_OTLP_ENDPOINT)
    api_key = os.getenv("OLLYGARDEN_API_KEY")

    if not api_key:
        logger.warning(
            "OLLYGARDEN_API_KEY not set; telemetry disabled (endpoint=%s)",
            endpoint,
        )
        return None

    try:
        resource = _build_resource(service_name)
        provider = TracerProvider(resource=resource)
        headers = {"Authorization": f"Bearer {api_key}"}
        exporter = OTLPSpanExporter(endpoint=endpoint, headers=headers)
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)
        logger.info("Telemetry initialised for OllyGarden endpoint=%s", endpoint)
        return provider
    except Exception as exc:  # pragma: no cover - defensive  # noqa: BLE001
        # Telemetry must never crash the host application.
        logger.error("Failed to initialise telemetry: %s", exc)
        return None


def configure_telemetry(
    service_name: str = DEFAULT_SERVICE_NAME,
) -> TracerProvider | None:
    """Backward-compatible alias for :func:`init_telemetry`.

    Args:
        service_name: Logical service name to attach to every span.

    Returns:
        TracerProvider | None: The configured provider, or ``None`` if
        telemetry was disabled because credentials are missing.
    """
    return init_telemetry(service_name=service_name)


def get_tracer(name: str = "freeleased"):
    """Return a tracer bound to the active telemetry provider.

    Args:
        name: Instrument名称, typically the dotted path of the calling
            module (e.g. ``"freeleased.pipeline"``).

    Returns:
        Tracer: An OpenTelemetry tracer. Always returns a tracer even
        when telemetry is disabled (it will simply be a no-op tracer).
    """
    return trace.get_tracer(name)
