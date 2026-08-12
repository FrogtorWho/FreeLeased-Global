#!/usr/bin/env bash
# ============================================================================
# start-public.sh — Expose the FreeLeased dev app to a public URL.
#
# Why this exists:
#   The private Shogo preview tunnel at
#     https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai
#   is reachable but tied to Sam's Shogo workspace. For judges,
#   investors, and the public, we need a stable, public URL.
#
# What it does (in priority order):
#   1. If cloudflared is on PATH and CLOUDFLARE_TUNNEL_TOKEN is set
#      → start a Cloudflare quick tunnel (free, no account needed for
#        *.trycloudflare.com; with token → named tunnel)
#   2. Else if `lt` (localtunnel) is on PATH → start localtunnel
#   3. Else if `ngrok` is on PATH → start ngrok
#   4. Else: print a manual `ssh -R` instruction + fall back to docs-site
#      (which has its own GitHub Pages deploy workflow under
#       .github/workflows/deploy-docs-site.yml)
#
# Usage:
#   # default — exposes port 5173 (Vite dev server)
#   ./scripts/start-public.sh
#
#   # custom port
#   PORT=8000 ./scripts/start-public.sh
#
#   # Cloudflare named tunnel (recommended for stable URL)
#   CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoixxx... ./scripts/start-public.sh
#
# Output:
#   - prints the public URL when ready
#   - appends PUBLIC_URL=<url> to .env (idempotent)
#
# FreeLeased — open-source leasehold governance for UK + Caribbean.
# ============================================================================
set -euo pipefail

PORT="${PORT:-5173}"
ENV_FILE=".env"
LOG_FILE="logs/public-tunnel.log"

mkdir -p logs

note() { printf "\033[1;36m[start-public]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[start-public]\033[0m %s\n" "$*"; }
err()  { printf "\033[1;31m[start-public]\033[0m %s\n" "$*" >&2; }

# Make sure port is up locally before we tunnel to it.
if ! curl -sf -o /dev/null "http://localhost:${PORT}/" 2>/dev/null; then
  warn "Nothing is listening on http://localhost:${PORT} yet."
  warn "In another terminal:  bun dev  (or  PORT=${PORT} bun dev)"
  warn "Re-run this script once the dev server is up."
  exit 2
fi

PUBLIC_URL=""

cleanup_and_write() {
  local url="$1"
  if [[ -n "${url}" ]]; then
    note "Public URL ready: ${url}"
    # Idempotent .env write.
    if grep -qE '^PUBLIC_URL=' "${ENV_FILE}" 2>/dev/null; then
      # cross-platform-ish sed
      if sed --version >/dev/null 2>&1; then
        sed -i.bak "s|^PUBLIC_URL=.*|PUBLIC_URL=${url}|" "${ENV_FILE}" && rm -f "${ENV_FILE}.bak"
      else
        sed -i '' "s|^PUBLIC_URL=.*|PUBLIC_URL=${url}|" "${ENV_FILE}"
      fi
    else
      printf "\nPUBLIC_URL=%s\n" "${url}" >> "${ENV_FILE}"
    fi
    note "Wrote PUBLIC_URL to .env"
  fi
}

# ---------------------------------------------------------------------------
# 1. Cloudflare Tunnel (preferred — free, stable URL via trycloudflare.com)
# ---------------------------------------------------------------------------
if command -v cloudflared >/dev/null 2>&1; then
  if [[ -n "${CLOUDFLARE_TUNNEL_TOKEN:-}" ]]; then
    note "Starting Cloudflare NAMED tunnel (token present) → port ${PORT}"
    cloudflared tunnel run "${CLOUDFLARE_TUNNEL_TOKEN}" >"${LOG_FILE}" 2>&1 &
    # named tunnels — URL comes from your DNS config; we read from log
    sleep 6
    PUBLIC_URL="$(grep -oE 'https://[a-zA-Z0-9.-]+' "${LOG_FILE}" | head -n 1 || true)"
  else
    note "Starting Cloudflare QUICK tunnel (no token) → port ${PORT}"
    note "URL is printed below; it's stable for the lifetime of the process."
    cloudflared tunnel --url "http://localhost:${PORT}" --no-autoupdate >"${LOG_FILE}" 2>&1 &
    # Wait for the *.trycloudflare.com URL to appear in the log.
    for _ in $(seq 1 30); do
      PUBLIC_URL="$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "${LOG_FILE}" 2>/dev/null | head -n 1 || true)"
      [[ -n "${PUBLIC_URL}" ]] && break
      sleep 1
    done
  fi
fi

# ---------------------------------------------------------------------------
# 2. localtunnel (free, npm) — no account needed
# ---------------------------------------------------------------------------
if [[ -z "${PUBLIC_URL}" ]] && command -v lt >/dev/null 2>&1; then
  note "Starting localtunnel → port ${PORT}"
  lt --port "${PORT}" >"${LOG_FILE}" 2>&1 &
  for _ in $(seq 1 20); do
    PUBLIC_URL="$(grep -oE 'https://[a-zA-Z0-9-]+\.loca\.lt' "${LOG_FILE}" 2>/dev/null | head -n 1 || true)"
    [[ -n "${PUBLIC_URL}" ]] && break
    sleep 1
  done
fi

# ---------------------------------------------------------------------------
# 3. ngrok (paid / freemium) — single binary
# ---------------------------------------------------------------------------
if [[ -z "${PUBLIC_URL}" ]] && command -v ngrok >/dev/null 2>&1; then
  note "Starting ngrok → port ${PORT}"
  ngrok http "${PORT}" --log=stdout >"${LOG_FILE}" 2>&1 &
  for _ in $(seq 1 20); do
    PUBLIC_URL="$(grep -oE 'https://[a-zA-Z0-9-]+\.ngrok-free\.app|https://[a-zA-Z0-9-]+\.ngrok\.io' "${LOG_FILE}" 2>/dev/null | head -n 1 || true)"
    [[ -n "${PUBLIC_URL}" ]] && break
    sleep 1
  done
fi

# ---------------------------------------------------------------------------
# 4. Manual ssh -R fallback (works anywhere with ssh + a public host)
# ---------------------------------------------------------------------------
if [[ -z "${PUBLIC_URL}" ]]; then
  err "No tunnel tool found on PATH (cloudflared / lt / ngrok)."
  err "Install one of:"
  err "   brew install cloudflared   # macOS"
  err "   winget install Cloudflare.cloudflared   # Windows"
  err "   npm i -g localtunnel"
  err "   snap install ngrok"
  err ""
  err "Or use the static docs-site deploy instead:"
  err "   docs-site/  →  gh-pages via .github/workflows/deploy-docs-site.yml"
  err ""
  err "Manual ssh fallback (if you have a public host):"
  err "   ssh -R 80:localhost:${PORT} nokey@serveo.net"
  exit 1
fi

cleanup_and_write "${PUBLIC_URL}"
note "Tunnel log: ${LOG_FILE}  (tail -f to watch)"
note "When done:  kill %1  (or Ctrl-C this script's child)"