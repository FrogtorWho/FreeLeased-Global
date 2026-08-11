# setup-local-edge.ps1 — install Ollama + the recommended FreeLeased local model on Windows.
#
# Idempotent: safe to re-run. Skips downloads when the model is already pulled.
# Prompts before any state change.
#
# Usage:
#   pwsh -File scripts/setup-local-edge.ps1
#   $env:OLLAMA_MODEL='phi3.5:3.8b-mini-instruct-q4_K_M'; pwsh -File scripts/setup-local-edge.ps1
#   pwsh -File scripts/setup-local-edge.ps1 -SkipTest
#
# Companion: scripts/setup-local-edge.sh (macOS / Linux / WSL).
# Docs:       docs/local-edge-llm.md
# Research:   project/research/edge-llm-research.md

[CmdletBinding()]
param(
    [switch]$SkipTest
)

$ErrorActionPreference = 'Stop'

$Model      = if ($env:OLLAMA_MODEL) { $env:OLLAMA_MODEL } else { 'llama3.3:70b-instruct-q4_K_M' }
$BaseUrl    = if ($env:OLLAMA_BASE_URL) { $env:OLLAMA_BASE_URL } else { 'http://localhost:11434/v1' }
$BaseNative = $BaseUrl -replace '/v1/?$', ''

function Write-Banner {
    param([string]$Text, [string]$Color = 'Cyan')
    Write-Host "── $Text ──" -ForegroundColor $Color
}

Write-Host ""
Write-Banner "FreeLeased local edge setup" Magenta
Write-Host ("  Model: {0}" -f $Model)
Write-Host ("  URL:   {0}" -f $BaseUrl)
Write-Host ""

# 1. Detect / install Ollama.
$ollamaBin = (Get-Command ollama -ErrorAction SilentlyContinue)
if ($ollamaBin) {
    $version = (& ollama --version 2>$null | Select-Object -First 1)
    if (-not $version) { $version = 'unknown' }
    Write-Host ("✓ Ollama already installed: {0}  ({1})" -f $ollamaBin.Path, $version) -ForegroundColor Green
} else {
    Write-Host "⚠ Ollama not found on PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Install options:"
    Write-Host "  • Official MSI:  https://ollama.com/download/OllamaSetup.exe"
    Write-Host "  • winget:        winget install Ollama.Ollama"
    Write-Host "  • Chocolatey:    choco install ollama"
    Write-Host "  • WSL:           use scripts/setup-local-edge.sh inside your WSL distro"
    Write-Host "  • Docker:        docker run -d -p 11434:11434 --name ollama ollama/ollama"
    Write-Host ""
    $reply = Read-Host "Open the download page now? (will launch your browser) [y/N]"
    if ($reply -match '^[Yy]$') {
        Start-Process 'https://ollama.com/download'
        Write-Host "After installing, re-run this script." -ForegroundColor Yellow
        exit 0
    } else {
        Write-Host "✗ Aborted. Install Ollama manually, then re-run this script." -ForegroundColor Red
        exit 1
    }
}

# 2. Start the daemon (best-effort).
function Test-DaemonAlive {
    param([string]$Url)
    try {
        $null = Invoke-RestMethod -Uri "$Url/api/tags" -TimeoutSec 2 -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

Write-Host ""
Write-Host ("→ Starting daemon if needed...")
if (-not (Test-DaemonAlive -Url $BaseNative)) {
    # Try to start as a background job (the standard 'ollama serve' foreground call).
    try {
        $proc = Start-Process -FilePath 'ollama' -ArgumentList 'serve' -WindowStyle Hidden -PassThru -ErrorAction Stop
        Write-Host ("  Started 'ollama serve' (PID {0})" -f $proc.Id)
    } catch {
        Write-Host ("  Could not launch 'ollama serve' automatically: {0}" -f $_.Exception.Message) -ForegroundColor Yellow
    }
    for ($i = 1; $i -le 5; $i++) {
        if (Test-DaemonAlive -Url $BaseNative) { break }
        Write-Host "  waiting... attempt $i/5"
        Start-Sleep -Seconds 2
    }
}

if (-not (Test-DaemonAlive -Url $BaseNative)) {
    Write-Host "✗ Ollama daemon is not responding." -ForegroundColor Red
    Write-Host "  Try:  ollama serve    (foreground, in another window)"
    Write-Host "  Then: pwsh -File scripts/setup-local-edge.ps1"
    exit 1
}
Write-Host ("✓ Daemon reachable at {0}" -f $BaseNative) -ForegroundColor Green

# 3. Pull the model.
Write-Host ""
Write-Host ("→ Pulling model: {0}" -f $Model)
Write-Host "  (this may take a few minutes; first-time pulls are GBs.)"
$pull = & ollama pull $Model 2>&1
$pullExit = $LASTEXITCODE
if ($pull) { Write-Host $pull }
if ($pullExit -ne 0) {
    Write-Host "✗ Pull failed." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Model pulled" -ForegroundColor Green

# 4. Smoke test the OpenAI-compatible endpoint.
if ($SkipTest) {
    Write-Host ""
    Write-Host "✓ Setup complete (skip-test mode)" -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "→ Running hello-from-FreeLeased smoke test..."
$body = @{
    model    = $Model
    messages = @(@{ role = 'user'; content = 'Respond with the JSON {"ok": true, "msg": "hello from FreeLeased"}. No other text.' })
    stream   = $false
    max_tokens = 80
} | ConvertTo-Json -Depth 5 -Compress

try {
    $resp = Invoke-RestMethod -Uri "$BaseUrl/chat/completions" -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 120
    $text = ($resp.choices[0].message.content -as [string])
    if ($text -and ($text -match 'hello from FreeLeased' -or $text -match '"ok"')) {
        Write-Host "✓ Smoke test passed" -ForegroundColor Green
        Write-Host ("  first 80 chars of reply: {0}..." -f ($text.Substring(0, [Math]::Min(80, $text.Length))))
    } else {
        Write-Host "⚠ Smoke test returned an unexpected payload but the daemon replied." -ForegroundColor Yellow
        Write-Host ("  payload (first 200 chars): {0}" -f ($text.Substring(0, [Math]::Min(200, $text.Length))))
    }
} catch {
    Write-Host "✗ Smoke test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Banner "✓ FreeLeased local edge ready" Green
Write-Host "  Add to your .env (defaults in .env.example):"
Write-Host ("    OLLAMA_BASE_URL={0}" -f $BaseUrl)
Write-Host ("    OLLAMA_MODEL={0}" -f $Model)
Write-Host "    USE_LOCAL_EDGE=1"
