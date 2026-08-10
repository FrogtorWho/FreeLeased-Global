import unittest

from src.core.title_agent import CadastralAudit, run_title_audit


class TitleAgentTestCase(unittest.TestCase):
    def test_run_title_audit_returns_cadastral_audit(self):
        sample_text = (
            "Parcel 104, Barbados Cap 224A: Residential unit with 8.33% "
            "statutory entitlement, missing fire safety certificate."
        )
        result = run_title_audit(sample_text)
        self.assertIsInstance(result, CadastralAudit)
        self.assertIsInstance(result.unit_entitlement_percentage, float)
        self.assertIsInstance(result.statutory_vulnerabilities, list)
        self.assertIsInstance(result.voting_threshold_met, bool)
        self.assertIsInstance(result.compliance_notes, str)
        print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    unittest.main()
