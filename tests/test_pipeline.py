import tempfile
import unittest
from pathlib import Path

from src.core.document_processor import extract_statutory_text
from src.core.pipeline import process_lease_document
from src.core.title_agent import CadastralAudit


class PipelineTestCase(unittest.TestCase):
    def test_extract_statutory_text_returns_relevant_paragraphs(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            lease_path = Path(temp_dir) / "sample.txt"
            lease_path.write_text(
                "This lease states that the unit entitlement is 8.33% for the "
                "residential unit.\n\n"
                "Voting rights are restricted to the majority of owners.\n\n"
                "Fire safety compliance is a continuing obligation for the "
                "landlord.\n\n"
                "This paragraph is unrelated and should be ignored.",
                encoding="utf-8",
            )

            text = extract_statutory_text(str(lease_path))

            self.assertIn("unit entitlement", text.lower())
            self.assertIn("voting", text.lower())
            self.assertIn("fire safety", text.lower())

    def test_process_lease_document_returns_cadastral_audit(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            lease_path = Path(temp_dir) / "sample.txt"
            lease_path.write_text(
                "Parcel 104 contains an 8.33% entitlement with voting rights "
                "and fire safety concerns.",
                encoding="utf-8",
            )

            result = process_lease_document(str(lease_path))

            self.assertIsInstance(result, CadastralAudit)
            self.assertIsInstance(result.unit_entitlement_percentage, float)
            self.assertIsInstance(result.statutory_vulnerabilities, list)
            self.assertIsInstance(result.voting_threshold_met, bool)
            self.assertIsInstance(result.compliance_notes, str)


if __name__ == "__main__":
    unittest.main()
