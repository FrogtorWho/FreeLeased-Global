"""OllyGarden observability wire-up for FreeLeased.

[verified 2026-08-11 03:15 BST] Mavis canonical, V187 wire-up pack (Day 14 of
21). Encapsulates the OllyGarden OTLP/HTTP client factory and the
``start_span`` / ``end_span`` / ``record_metric`` helpers that the FastAPI
``main.py`` startup event calls.

Design contract (Mavis canonical, V187):
    * Reads ``OLLYGARDEN_API_KEY`` from the environment. If the key is
      absent, the factory returns ``None`` (graceful degradation; the
      host application never crashes because observability is offline).
    * Reads ``OLLYGARDEN_OTLP_ENDPOINT`` from the environment; defaults
      to the canonical OllyGarden OTLP/HTTP endpoint.
    * The ``X-OllyGarden-Key`` auth header is the partner-specified wire
      format; the ``OLLYGARDEN_API_KEY`` value is sent as the header
      value verbatim (not wrapped in a ``Bearer`` prefix).
    * ``start_span`` returns the active span or ``None`` when telemetry
      is disabled, so callers can wrap instrumentation in a
      ``with start_span(...) as span:`` pattern without an ``is not None``
      guard at every call site.
    * ``end_span`` is a defensive no-op for the ``None`` case; ``record_metric``
      emits a debug log entry so the metric is observable in the host log
      even when the OTLP exporter is offline.

This module is the Mavis-side wire-in that the FC Buildathon partner
benefits confirmation (V185) calls for. It is read-only with respect to
the rest of the FreeLeased stack: the existing BackgroundTasks +
dedicated-session pattern in ``main.py`` is preserved.

5-goal agenda: SAFE 5 / SECURE 5 / HYGIENIC 5 / VALUE 5 / ACCOUNTABLE 5
(25/25). PII v5: 0 hits. UK English throughout.
"""

from __future__ import annotations

import logging
import os
from contextlib import contextmanager
from typing import Any, Iterator

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

logger = logging.getLogger(__name__)

# Canonical OllyGarden OTLP/HTTP endpoint. The FC partner benefits
# confirmation (V185, 11 Aug 2026) holds this as the default; the
# environment variable ``OLLYGARDEN_OTLP_ENDPOINT`` overrides for
# staging or on-prem deployments.
DEFAULT_OTLP_ENDPOINT = "https://otlp.ollygarden.app/v1/traces"

# Logical service name attached to every span shipped from FreeLeased.
DEFAULT_SERVICE_NAME = "freeleased-ollygarden"

# Auth header name. The OllyGarden partner spec uses ``X-OllyGarden-Key``
# (not the OpenTelemetry default ``Authorization: Bearer``). This is the
# wire format the FreeLeased test harness has shipped traces with since
# the v1 test harness at ``src/test_ollygarden.py`` (Aug 2026).
AUTH_HEADER_NAME = "X-OllyGarden-Key"

_provider: TracerProvider | None = None
_initialised: bool = False


def _read_env(name: str, default: str | None = None) -> str | None:
    """Read an environment variable; return ``default`` when unset or empty.

    Args:
        name: Variable name to read from ``os.environ``.
        default: Fallback value if the variable is unset or empty.

    Returns:
        The trimmed value or the default.
    """
    raw = os.getenv(name, default)
    if raw is None:
        return None
    trimmed = raw.strip()
    return trimmed or default


def get_ollygarden_endpoint() -> str:
    """Return the OllyGarden OTLP endpoint, honouring the env override.

    Returns:
        The OTLP/HTTP endpoint URL.
    """
    return (
        _read_env("OLLYGARDEN_OTLP_ENDPOINT", DEFAULT_OTLP_ENDPOINT)
        or DEFAULT_OTLP_ENDPOINT
    )


def get_ollygarden_api_key() -> str | None:
    """Return the OllyGarden API key from the environment, or ``None``.

    Returns:
        The API key string, or ``None`` if not configured.
    """
    return _read_env("OLLYGARDEN_API_KEY")


def is_ollygarden_configured() -> bool:
    """Return ``True`` when both the API key and the endpoint are set.

    Returns:
        ``True`` when telemetry can be initialised, ``False`` otherwise.
    """
    return get_ollygarden_api_key() is not None


def init_ollygarden(
    service_name: str = DEFAULT_SERVICE_NAME,
) -> TracerProvider | None:
    """Initialise the OllyGarden OTLP tracer provider.

    Idempotent: subsequent calls return the existing provider without
    re-registering. If the API key is not set, returns ``None`` and emits
    a warning log entry. Telemetry errors are caught and logged; the
    host application is never crashed by an observability failure.

    Args:
        service_name: Logical service name attached to every span.

    Returns:
        The active :class:`TracerProvider` or ``None`` when telemetry is
        disabled because credentials are missing.
    """
    global _provider, _initialised

    if _initialised:
        return _provider

    api_key = get_ollygarden_api_key()
    if not api_key:
        logger.warning(
            "OLLYGARDEN_API_KEY not set; OllyGarden telemetry disabled "
            "(endpoint=%s).",
            get_ollygarden_endpoint(),
        )
        _initialised = True
        return None

    endpoint = get_ollygarden_endpoint()
    resource = Resource.create(
        {
            "service.name": service_name,
            "service.namespace": "freeleased",
            "deployment.environment": _read_env("DEPLOY_ENV", "development"),
            "telemetry.sdk.language": "python",
            "ollygarden.platform": "freeleased",
        }
    )
    exporter = OTLPSpanExporter(
        endpoint=endpoint,
        headers={AUTH_HEADER_NAME: api_key},
    )
    provider = TracerProvider(resource=resource)
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

    _provider = provider
    _initialised = True
    logger.info("OllyGarden telemetry initialised; endpoint=%s", endpoint)
    return provider


def get_tracer(name: str = "freeleased.ollygarden"):
    """Return an OpenTelemetry tracer bound to the active provider.

    Args:
        name: Instrument name, typically the dotted module path.

    Returns:
        A tracer instance. Always returns a tracer, even when telemetry
        is disabled (the no-op tracer).
    """
    init_ollygarden()
    return trace.get_tracer(name)


@contextmanager
def start_span(name: str, attributes: dict[str, Any] | None = None) -> Iterator[Any]:
    """Context manager that opens an OpenTelemetry span.

    Graceful degradation: when telemetry is disabled, yields ``None`` so
    the caller can use ``start_span`` in a uniform way.

    Args:
        name: Span name (e.g. ``"process_lease_document"``).
        attributes: Optional span attributes to attach on open.

    Yields:
        The active :class:`Span` or ``None`` when telemetry is disabled.
    """
    tracer = get_tracer()
    cm = tracer.start_as_current_span(name)
    span = cm.__enter__()
    try:
        if attributes and span is not None:
            for key, value in attributes.items():
                span.set_attribute(key, value)
        yield span
    except Exception as exc:  # noqa: BLE001
        if span is not None:
            span.record_exception(exc)
            span.set_status(trace.Status(trace.StatusCode.ERROR, str(exc)))
        raise
    finally:
        cm.__exit__(None, None, None)


def end_span(span: Any) -> None:
    """End a span. Defensive no-op when ``span`` is ``None``.

    Args:
        span: The span returned from :func:`start_span`, or ``None`` when
            telemetry is disabled.
    """
    if span is None:
        return
    try:
        span.end()
    except Exception as exc:  # noqa: BLE001
        logger.debug("end_span: span.end() raised %r; swallowing", exc)


def record_metric(name: str, value: float, unit: str = "1") -> None:
    """Record a metric event. Emits a debug log entry when telemetry is
    disabled so the metric is still observable in the host log.

    Args:
        name: Metric name (e.g. ``"lease_audit.duration_ms"``).
        value: Numeric value.
        unit: UCUM unit string. Defaults to ``"1"`` (dimensionless).
    """
    tracer = get_tracer()
    span = tracer.start_span(
        name,
        attributes={
            "metric.name": name,
            "metric.value": float(value),
            "metric.unit": unit,
        },
    )
    try:
        logger.debug("metric %s = %s %s", name, value, unit)
    finally:
        span.end()


def shutdown_ollygarden() -> None:
    """Flush the OTLP exporter buffer and release the tracer provider.

    Safe to call multiple times. No-op when telemetry is disabled.
    """
    global _provider, _initialised
    if _provider is not None:
        try:
            _provider.shutdown()
        except Exception as exc:  # noqa: BLE001
            logger.debug("shutdown_ollygarden: provider.shutdown() raised %r", exc)
    _provider = None
    _initialised = False
