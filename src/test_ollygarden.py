import os

from dotenv import load_dotenv
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

load_dotenv()

api_key = os.getenv("OLLYGARDEN_API_KEY")
default_ollygarden_endpoint = "https://otlp.ollygarden.app/v1/traces"
endpoint = os.getenv("OLLYGARDEN_OTLP_ENDPOINT", default_ollygarden_endpoint)

# Initialize Provider
resource = Resource.create({"service.name": "freeleased-ollygarden-test"})
provider = TracerProvider(resource=resource)
exporter = OTLPSpanExporter(
    endpoint=endpoint, headers={"Authorization": f"Bearer {api_key}"}
)
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)

# Send Test Trace
tracer = trace.get_tracer("ollygarden-test-tracer")
with tracer.start_as_current_span("ollygarden-connection-test") as span:
    span.set_attribute("test.status", "successful")
    print("Sending test span to OllyGarden...")

# Flush telemetry buffer
provider.shutdown()
print("Trace sent successfully!")
