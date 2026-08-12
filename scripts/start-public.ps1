# ============================================================================
# start-public.ps1 — Windows mirror of start-public.sh
#
# Expose the FreeLeased dev app (default port 5173) to a public URL.
# Tries, in order: cloudflared → localtunnel → ngrok → manual fallback.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts\start-public.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\start-public.ps1 -Port 8000
#   $env:CLOUDFLARE_TUNNEL_TOKEN="..." ; powershell -File scripts\start-public.ps1
#
# Writes PUBLIC_URL=<url> to .env when a tunnel comes up.
# FreeLeased — open-source leasehold governance for UK + Caribbean.
# ============================================================================
[CmdletBinding()]
param(
  [int]$Port = 5173,
  [string]$EnvFile = ".env",
  [string]$LogFile = "logs\public-tunnel.log"
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path (Split-Path $LogFile -Parent) | Out-Null

function Note($msg) { Write-Host "[start-public] $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "[start-public] $msg" -ForegroundColor Yellow }
function Err ($msg) { Write-Host "[start-public] $msg" -ForegroundColor Red }

# Verify a local server is actually running on the port.
try {
  $probe = Invoke-WebRequest -Uri "http://localhost:$Port/" -UseBasicParsing -TimeoutSec 5 -Method Head -ErrorAction Stop
} catch {
  Warn "Nothing is listening on http://localhost:$Port yet."
  Warn "In another shell:  bun dev   (or set PORT=$Port)"
  Warn "Re-run this script once the dev server is up."
  exit 2
}

$PUBLIC_URL = $null

# ---------- 1. cloudflared ----------
if (-not $PUBLIC_URL) {
  $cf = (Get-Command cloudflared -ErrorAction SilentlyContinue)
  if ($cf) {
    if ($env:CLOUDFLARE_TUNNEL_TOKEN) {
      Note "Starting Cloudflare NAMED tunnel → port $Port"
      Start-Process -FilePath $cf.Source -ArgumentList @("tunnel","run",$env:CLOUDFLARE_TUNNEL_TOKEN) -RedirectStandardOutput $LogFile -RedirectStandardError $LogFile -NoNewWindow
    } else {
      Note "Starting Cloudflare QUICK tunnel → port $Port"
      Start-Process -FilePath $cf.Source -ArgumentList @("tunnel","--url","http://localhost:$Port","--no-autoupdate") -RedirectStandardOutput $LogFile -RedirectStandardError $LogFile -NoNewWindow
    }
    for ($i=0; $i -lt 30; $i++) {
      Start-Sleep -Seconds 1
      if (Test-Path $LogFile) {
        $match = Select-String -Path $LogFile -Pattern 'https://[a-zA-Z0-9.-]+\.(trycloudflare\.com|loca\.lt|ngrok(-free)?\.(app|io))' -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($match) { $PUBLIC_URL = $match.Matches[0].Value; break }
      }
    }
  }
}

# ---------- 2. localtunnel ----------
if (-not $PUBLIC_URL) {
  $lt = (Get-Command lt -ErrorAction SilentlyContinue)
  if ($lt) {
    Note "Starting localtunnel → port $Port"
    Start-Process -FilePath $lt.Source -ArgumentList @("--port","$Port") -RedirectStandardOutput $LogFile -RedirectStandardError $LogFile -NoNewWindow
    for ($i=0; $i -lt 20; $i++) {
      Start-Sleep -Seconds 1
      $match = Select-String -Path $LogFile -Pattern 'https://[a-zA-Z0-9-]+\.loca\.lt' -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($match) { $PUBLIC_URL = $match.Matches[0].Value; break }
    }
  }
}

# ---------- 3. ngrok ----------
if (-not $PUBLIC_URL) {
  $ng = (Get-Command ngrok -ErrorAction SilentlyContinue)
  if ($ng) {
    Note "Starting ngrok → port $Port"
    Start-Process -FilePath $ng.Source -ArgumentList @("http","$Port","--log=stdout") -RedirectStandardOutput $LogFile -RedirectStandardError $LogFile -NoNewWindow
    for ($i=0; $i -lt 20; $i++) {
      Start-Sleep -Seconds 1
      $match = Select-String -Path $LogFile -Pattern 'https://[a-zA-Z0-9-]+\.(ngrok-free\.app|ngrok\.io)' -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($match) { $PUBLIC_URL = $match.Matches[0].Value; break }
    }
  }
}

if (-not $PUBLIC_URL) {
  Err "No tunnel tool found (cloudflared / lt / ngrok)."
  Err "Install one:"
  Err "   winget install Cloudflare.cloudflared"
  Err "   npm i -g localtunnel"
  Err "   choco install ngrok"
  Err ""
  Err "Static fallback: docs-site/ deploys via .github/workflows/deploy-docs-site.yml"
  exit 1
}

# Write PUBLIC_URL=<url> to .env (idempotent).
if (Test-Path $EnvFile) {
  $lines = Get-Content $EnvFile
  $found = $false
  for ($i=0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^PUBLIC_URL=') {
      $lines[$i] = "PUBLIC_URL=$PUBLIC_URL"
      $found = $true
    }
  }
  if (-not $found) { $lines += "PUBLIC_URL=$PUBLIC_URL" }
  $lines | Set-Content $EnvFile
} else {
  "PUBLIC_URL=$PUBLIC_URL" | Set-Content $EnvFile
}

Note "Public URL ready: $PUBLIC_URL"
Note "Wrote PUBLIC_URL to $EnvFile"
Note "Tunnel log: $LogFile   (Get-Content $LogFile -Wait to watch)"