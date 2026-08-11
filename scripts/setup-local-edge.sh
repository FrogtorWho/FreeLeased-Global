#!/usr/bin/env bash
# setup-local-edge.sh — install Ollama + the recommended FreeLeased local model.
#
# Idempotent: safe to re-run. Downloads are skipped if the model is already
# pulled. Prompts before any state change (install, large download).
#
# Usage:
#   ./scripts/setup-local-edge.sh                 # full recommended setup
#   OLLAMA_MODEL=phi3.5:3.8b-mini-instruct-q4_K_M ./scripts/setup-local-edge.sh
#   ./scripts/setup-local-edge.sh --skip-test     # don't run the hello prompt
#
# Companion: scripts/setup-local-edge.ps1 (Windows PowerShell).
# Docs:       docs/local-edge-llm.md
# Research:   project/research/edge-llm-research.md

set -euo pipefail

SKIP_TEST=0
if [[ "${1:-}" == "--skip-test" ]]; then
  SKIP_TEST=1
fi

MODEL="${OLLAMA_MODEL:-llama3.3:70b-instruct-q4_K_M}"
BASE_URL="${OLLAMA_BASE_URL:-http://localhost:11434/v1}"
BASE_NATIVE_URL="${BASE_URL%/v1}"   # strip /v1 → http://localhost:11434

# Colours (only if stdout is a TTY)
if [[ -t 1 ]]; then
  C_BOLD="\033[1m"; C_GRN="\033[32m"; C_YEL="\033[33m"; C_RED="\033[31m"; C_OFF="\033[0m"
else
  C_BOLD=""; C_GRN=""; C_YEL=""; C_RED=""; C_OFF=""
fi

echo -e "${C_BOLD}┌──────────────────────────────────────────────┐${C_OFF}"
echo -e "${C_BOLD}│ FreeLeased local edge setup                   │${C_OFF}"
echo -e "${C_BOLD}│   Model:  ${MODEL}${C_OFF}"
echo -e "${C_BOLD}│   URL:    ${BASE_URL}${C_OFF}"
echo -e "${C_BOLD}└──────────────────────────────────────────────┘"
echo

# 1. Detect / install Ollama.
if command -v ollama >/dev/null 2>&1; then
  OLLAMA_BIN="$(command -v ollama)"
  OLLAMA_VER="$(${OLLAMA_BIN} --version 2>/dev/null | head -n 1 || echo unknown)"
  echo -e "${C_GRN}✓ Ollama already installed${C_OFF}: ${OLLAMA_BIN}  (${OLLAMA_VER})"
else
  echo -e "${C_YEL}⚠ Ollama not found on PATH.${C_OFF}"
  echo
  echo "Install options:"
  echo "  • macOS / Linux — official one-liner:"
  echo -e "      ${C_BOLD}curl -fsSL https://ollama.com/install.sh | sh${C_OFF}"
  echo "  • macOS — Homebrew:"
  echo -e "      ${C_BOLD}brew install ollama${C_OFF}"
  echo "  • Windows (use the PS1 script or): https://ollama.com/download"
  echo "  • Docker — docker run -d -p 11434:11434 --name ollama ollama/ollama"
  echo
  read -r -p "Run the official installer now? [y/N] " REPLY
  REPLY="${REPLY:-N}"
  if [[ "${REPLY}" =~ ^[Yy]$ ]]; then
    curl -fsSL https://ollama.com/install.sh | sh
  else
    echo -e "${C_RED}✗ Aborted.${C_OFF} Install Ollama manually, then re-run this script."
    exit 1
  fi
fi

# 2. Start the daemon (best-effort; idempotent).
start_daemon() {
  if curl -sf "${BASE_NATIVE_URL}/api/tags" >/dev/null 2>&1; then
    return 0
  fi
  if command -v systemctl >/dev/null 2>&1; then
    systemctl is-active --quiet ollama.service || systemctl start ollama.service || true
  fi
  # macOS 'brew services' / plain foreground fallback
  if pgrep -x ollama >/dev/null 2>&1; then
    return 0
  fi
  nohup ollama serve >/tmp/ollama-serve.log 2>&1 &
  echo "Started 'ollama serve' in background (PID $!), logs at /tmp/ollama-serve.log"
  sleep 3
}

echo
echo -e "${C_BOLD}→${C_OFF} Starting daemon if needed..."
start_daemon

# 3. Probe.
for i in 1 2 3 4 5; do
  if curl -sf "${BASE_NATIVE_URL}/api/tags" >/dev/null 2>&1; then
    echo -e "${C_GRN}✓ Daemon reachable${C_OFF} at ${BASE_NATIVE_URL}"
    break
  fi
  echo "  waiting... attempt ${i}/5"
  sleep 2
done

if ! curl -sf "${BASE_NATIVE_URL}/api/tags" >/dev/null 2>&1; then
  echo -e "${C_RED}✗ Ollama daemon is not responding.${C_OFF}"
  echo "  Try:  ollama serve    (foreground)"
  echo "  Then: ./scripts/setup-local-edge.sh"
  exit 1
fi

# 4. Pull the model.
echo
echo -e "${C_BOLD}→${C_OFF} Pulling model: ${MODEL}"
echo "  (this may take a few minutes; first-time pulls are GBs.)"
if ollama pull "${MODEL}"; then
  echo -e "${C_GRN}✓ Model pulled${C_OFF}"
else
  echo -e "${C_RED}✗ Pull failed.${C_OFF} Check internet / try again."
  exit 1
fi

# 5. Smoke test the OpenAI-compatible endpoint (optional).
if [[ "${SKIP_TEST}" == "1" ]]; then
  echo
  echo -e "${C_GRN}✓ Setup complete (skip-test mode)${C_OFF}"
  exit 0
fi

echo
echo -e "${C_BOLD}→${C_OFF} Running hello-from-FreeLeased smoke test..."
HELLO_PROMPT='Respond with the JSON {"ok": true, "msg": "hello from FreeLeased"}. No other text.'
HELLO_JSON=$(curl -sf "${BASE_URL}/chat/completions" \
  -H "Content-Type: application/json" \
  -d "$(printf '{"model":"%s","messages":[{"role":"user","content":"%s"}],"stream":false,"max_tokens":80}' "${MODEL}" "${HELLO_PROMPT}")" \
  || echo "")
if [[ -z "${HELLO_JSON}" ]]; then
  echo -e "${C_RED}✗ Smoke test failed (non-JSON response or transport error).${C_OFF}"
  exit 1
fi
HELLO_TEXT=$(printf "%s" "${HELLO_JSON}" | grep -o '"content":"[^"]*"' | head -n 1 | sed 's/^"content":"//;s/"$//' || true)
if [[ "${HELLO_TEXT}" == *"hello from FreeLeased"* ]] || [[ "${HELLO_TEXT}" == *'"ok"'* ]]; then
  echo -e "${C_GRN}✓ Smoke test passed${C_OFF}"
  echo "  first 80 chars of reply: ${HELLO_TEXT:0:80}..."
else
  echo -e "${C_YEL}⚠ Smoke test returned an unexpected payload but the daemon replied.${C_OFF}"
  echo "  payload (first 200 chars): ${HELLO_TEXT:0:200}"
fi

echo
echo -e "${C_BOLD}┌──────────────────────────────────────────────┐${C_OFF}"
echo -e "${C_BOLD}│ ✓ FreeLeased local edge ready                 │${C_OFF}"
echo -e "${C_BOLD}│   Add to your .env (defaults in .env.example): │${C_OFF}"
echo -e "${C_BOLD}│     OLLAMA_BASE_URL=${BASE_URL}${C_OFF}"
echo -e "${C_BOLD}│     OLLAMA_MODEL=${MODEL}${C_OFF}"
echo -e "${C_BOLD}│     USE_LOCAL_EDGE=1                           │${C_OFF}"
echo -e "${C_BOLD}└──────────────────────────────────────────────┘${C_OFF}"
