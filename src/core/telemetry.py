import os
from typing import Optional

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


DEFAULT_OTLP_ENDPOINT = "https://in.ollygarden.cloud/v1/traces"


def configure_telemetry(service_name: str = "freeleased-backend") -> Optional[TracerProvider]:
    """Configure OpenTelemetry tracing for Ollygarden OTLP export."""
    endpoint = os.getenv("OLLYGARDEN_OTLP_ENDPOINT", DEFAULT_OTLP_ENDPOINT)
    api_key = os.getenv("OLLYGARDEN_API_KEY")

    if not api_key:
        return None

    resource = Resource.create({"service.name": service_name})
    provider = TracerProvider(resource=resource)
    # Include the Ollygarden API key in the Authorization header when present.
    headers = {"Authorization": f"Bearer {api_key}"}
    exporter = OTLPSpanExporter(endpoint=endpoint, headers=headers)
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)
    return provider


def get_tracer(name: str = "freeleased"):
    """Return a tracer configured for the active telemetry provider."""
    return trace.get_tracer(name)
