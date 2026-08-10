from src.core.document_processor import extract_statutory_text
from src.core.title_agent import CadastralAudit, run_title_audit


def process_lease_document(file_path: str) -> CadastralAudit:
    """Run the MiniMax document reader and the Nebius title audit in sequence."""
    condensed_text = extract_statutory_text(file_path)
    return run_title_audit(condensed_text or "No statutory text could be extracted")
