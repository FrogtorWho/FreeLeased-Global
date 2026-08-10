# AI Journal

## 2026-08-09 Detailed Configuration Journal

- **Setting/Configuration:** .vscode/settings.json — python.formatting.provider = black
- **Justification:** Black enforces a single, well-known formatter for Python which makes diffs readable and reduces stylistic review cycles during the Buildathon.
- **Replication Ease:** Install the "black" package (pip install black) and the VS Code Python extension; the settings file ensures VS Code uses Black on save.
- **Alternative/Fallback:** If Black cannot be used, configure "python.formatting.provider": "autopep8" or run pre-commit with autopep8; however Black is preferred for consistency.

- **Setting/Configuration:** .vscode/settings.json — ruff linting enabled (python.linting.ruffEnabled = true)
- **Justification:** Ruff is a fast, modern linter/formatter that supports linting and many autofixes. It reduces CI time and enforces code quality.
- **Replication Ease:** Install ruff (pip install ruff) and ensure the VS Code ruff extension or the Python extension picks it up; the settings include ruffArgs to run fixes on save.
- **Alternative/Fallback:** Use flake8 or pylint if ruff is not available. Configure the linter to run in CI instead of locally.

- **Setting/Configuration:** .vscode/settings.json — python.analysis.typeCheckingMode = strict
- **Justification:** Strict type checking via Pylance helps catch API and data model mismatches early, crucial for AI agent integrations and pydantic models.
- **Replication Ease:** Install Microsoft Pylance extension; the setting enables strict checks in the workspace.
- **Alternative/Fallback:** Set to "basic" or "off" if strict mode produces too many legacy errors; require a migration plan to increase strictness gradually.

- **Setting/Configuration:** .vscode/settings.json — python.analysis.extraPaths = ["src"]
- **Justification:** Ensures the language server resolves in-repo imports (app code under src) for accurate diagnostics and completions.
- **Replication Ease:** No code change required; new developers clone and open the workspace and the path is already configured.
- **Alternative/Fallback:** Use PYTHONPATH in launch configurations or virtual environment activation scripts.

- **Setting/Configuration:** .vscode/settings.json — editor.codeActionsOnSave: source.organizeImports, source.fixAll
- **Justification:** Keeps imports tidy and applies auto-fixes (ruff / black) automatically; reduces style drift and review noise.
- **Replication Ease:** Ensure the Python extension and Ruff/Black are installed; actions run on file save.
- **Alternative/Fallback:** Use pre-commit hooks to enforce organizing imports and fixes during commits instead of on-save.

- **Setting/Configuration:** .vscode/settings.json — files.exclude & search.exclude for .env, DBs, PDFs
- **Justification:** Prevents accidental opening/searching of secrets and large binary artifacts; reduces accidental commits and speeds editor search.
- **Replication Ease:** Provided in settings.json; new developers opening the workspace inherit these exclusions automatically.
- **Alternative/Fallback:** Use global git excludes and CI-level scanning for accidental secrets.

- **Setting/Configuration:** .vscode/settings.json — pydantic.enable and pydantic.showValidationErrorsInProblems
- **Justification:** Highlights pydantic model issues in the Problems panel so schema issues are visible early; critical for AI input validation and safe outputs.
- **Replication Ease:** Install a pydantic helper extension if available (or rely on Pylance + pydantic library) and the setting toggles the behavior.
- **Alternative/Fallback:** Use runtime tests for schemas or rely on unit tests that exercise validation paths.

- **Setting/Configuration:** .github/copilot-instructions.md — Immutable estate facts and library requirements
- **Justification:** Ensures all AI agents and human contributors share canonical facts about company, property, and required core libraries (openai, pydantic, python-dotenv). This prevents contradictory agent outputs or accidental use of non-standard SDKs.
- **Replication Ease:** Any AI agent or human reading repository contents will read .github/copilot-instructions.md; enforcement can be added to pre-commit checks or AI prompt wrappers.
- **Alternative/Fallback:** If Copilot ignores repo instructions, add a CI step that scans for contradictory claims or missing required imports.

- **Setting/Configuration:** .gitignore — ignore .env, .env.*, *.db, *.sqlite, *.pdf
- **Justification:** Prevents accidental commit of environment secrets, local databases, and potentially sensitive exported documents. This is a baseline DevSecOps control.
- **Replication Ease:** File is at repo root; any clone gets the ignore rules. Developers should also add local excludes if desired.
- **Alternative/Fallback:** Use a pre-commit hook that prevents committing secrets and large binary files if .gitignore is misconfigured.

- **Setting/Configuration:** .env.example — placeholders for NEBIUS_API_KEY, MINIMAX_API_KEY, OLLYGARDEN_API_KEY, OLLYGARDEN_OTLP_ENDPOINT, BOARD_AI_API_KEY, BOARD_AI_ENDPOINT
- **Justification:** Provides a safe template for required secrets and endpoints for local development without exposing real credentials.
- **Replication Ease:** Copy .env.example to .env and fill in secrets; documented in README or onboarding scripts.
- **Alternative/Fallback:** Use secret management systems (Vault, GitHub Secrets, AWS Secrets Manager) and populate environment variables in CI/CD instead of local .env files.

- **Setting/Configuration:** Use of standard libraries: openai, pydantic, python-dotenv (documented in copilot-instructions.md)
- **Justification:** Consistency across all agent code and human contributors reduces integration issues and simplifies security audits and dependency management.
- **Replication Ease:** Add these to requirements.txt or pyproject.toml (pip install openai pydantic python-dotenv) and activate the virtualenv.
- **Alternative/Fallback:** If a different SDK is necessary, open an RFC and document reasons; the default remains the standard openai SDK.


---

End of configuration journal for Step 1-3.

## 2026-08-10 Title Agent Schema and Pre-commit Hooks

- **Setting/Configuration:** .pre-commit-config.yaml — Black & Ruff hooks
- **Justification:** Enforces local developer consistency before commits; prevents style drift and reduces CI failures.
- **Replication Ease:** Install pre-commit (`pip install pre-commit`) and run `pre-commit install` to enable the hooks locally.
- **Alternative/Fallback:** Run `black .` and `ruff check .` manually or enforce in CI only.

- **Setting/Configuration:** src/core/title_agent.py — CadastralAudit Pydantic model and run_title_audit stub
- **Justification:** Provides a strict schema contract for title/cadastral extraction so downstream code and agents can rely on typed data.
- **Replication Ease:** The model is importable as `from src.core.title_agent import CadastralAudit` after installing dependencies and ensures validation via Pydantic.
- **Alternative/Fallback:** Use plain dataclasses or dictionaries temporarily, but Pydantic is preferred for validation and serialization.

## 2026-08-10 Nebius DeepSeek-R1 Activation

- **Setting/Configuration:** src/core/title_agent.py — live Nebius DeepSeek-R1 integration
- **Justification:** Implements real extraction of cadastral title data into a strict Pydantic schema, enabling the Title Agent to provide structured audit output.
- **Replication Ease:** Requires NEBIUS_API_KEY in environment and the configured Nebius client; run the test script or integrate the model into the application pipeline.
- **Alternative/Fallback:** If Nebius is unavailable, the function falls back to a safe placeholder CadastralAudit instance and logs the environment configuration issue.

## 2026-08-10 Live Nebius Extraction Implementation

- **Setting/Configuration:** src/core/title_agent.py — DeepSeek-R1 extraction implementation
- **Justification:** Enables the title audit agent to convert cadastral text into a validated JSON object consistent with the CadastralAudit schema.
- **Replication Ease:** Requires a Nebius API key in NEBIUS_API_KEY and the existing Nebius client configuration; run the test suite or call run_title_audit directly.
- **Alternative/Fallback:** If Nebius is unavailable, the function safely returns a placeholder CadastralAudit instance and indicates the extraction was skipped.
