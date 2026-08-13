#!/usr/bin/env pwsh
# ============================================================================
# seal-judge-tokens.ps1 — Stage & verify JWT + 5 judge tokens (PowerShell)
# ----------------------------------------------------------------------------
# Purpose
#   - Validate the six required secrets (JWT_SECRET, JUDGE_1_TOKEN..JUDGE_5_TOKEN)
#     live in the process environment (typically loaded from .env by the user).
#   - Write a sealed manifest at scripts/.sealed-tokens.json containing only
#     token NAMES + SHA-256 hashes (NOT the values themselves).
#   - Generate a one-shot set of secrets on demand (--generate) — printed to
#     stdout for the user to paste into .env. Never written to disk.
#
# Exit codes
#   0 — success (verify or generate or status)
#   1 — one or more tokens missing from env
#   2 — duplicate token values detected
#   3 — token length below 32 chars
#
# Modes
#   --status   : print ALL_SEALED | PARTIAL | NONE, exit 0
#   --verify   : validate tokens; if all 6 valid, write sealed manifest
#   --generate : print 6 fresh secrets to stdout; exit 0; NEVER saved to disk
#   (default)  : same as --verify
# ============================================================================

# NOTE: We deliberately do NOT use [CmdletBinding()] here. With
# `powershell -File script.ps1 --status`, PowerShell's arg parser turns
# `--status` into `-status` (a named parameter), which then consumes the
# next token as its value. By using bare $args parsing, we keep the
# POSIX-style double-dash flags intact and avoid that ambiguity.
param()

$Mode = 'verify'
foreach ($arg in $args) {
    switch ($arg) {
        '--verify'   { $Mode = 'verify'   ; break }
        '--status'   { $Mode = 'status'   ; break }
        '--generate' { $Mode = 'generate' ; break }
        '--help'     { $Mode = 'help'     ; break }
        '-h'         { $Mode = 'help'     ; break }
        default {
            Write-Host "Unknown flag: $arg" -ForegroundColor Red
            exit 64
        }
    }
}

$ErrorActionPreference = 'Stop'

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ManifestDir = $ScriptDir
$ManifestPath = Join-Path $ManifestDir '.sealed-tokens.json'

$TokenNames = @(
    'JWT_SECRET',
    'JUDGE_1_TOKEN',
    'JUDGE_2_TOKEN',
    'JUDGE_3_TOKEN',
    'JUDGE_4_TOKEN',
    'JUDGE_5_TOKEN'
)

# ----------------------------------------------------------------------------
# Helper: SHA-256 of a string, hex-encoded (lowercase)
# ----------------------------------------------------------------------------
function Get-Sha256Hex {
    param([Parameter(Mandatory)][string]$Value)
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
    $hash  = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
    return ([BitConverter]::ToString($hash)).Replace('-', '').ToLowerInvariant()
}

# ----------------------------------------------------------------------------
# Helper: collect current values from process env
# ----------------------------------------------------------------------------
function Get-TokenSnapshot {
    $snap = [ordered]@{}
    foreach ($name in $TokenNames) {
        $val = [Environment]::GetEnvironmentVariable($name, 'Process')
        $snap[$name] = $val
    }
    return $snap
}

# ----------------------------------------------------------------------------
# Helper: classify status from a snapshot
# ----------------------------------------------------------------------------
function Get-StatusLabel {
    param([Parameter(Mandatory)]$Snap)
    $present = 0
    foreach ($name in $TokenNames) {
        if (-not [string]::IsNullOrEmpty($Snap[$name])) { $present++ }
    }
    if ($present -eq 0) { return 'NONE' }
    if ($present -eq $TokenNames.Count) { return 'ALL_SEALED' }
    return 'PARTIAL'
}

# ----------------------------------------------------------------------------
# --help : print usage
# ----------------------------------------------------------------------------
if ($Mode -eq 'help') {
    Get-Help $MyInvocation.MyCommand.Path -Full | Out-String | Write-Host
    exit 0
}

# ----------------------------------------------------------------------------
# --generate : print 6 fresh secrets to stdout. Never written to disk.
# ----------------------------------------------------------------------------
if ($Mode -eq 'generate') {
    Write-Host '# Generated secrets — paste into .env. NEVER committed.'
    Write-Host "JWT_SECRET=$( -join ((1..64) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) }))"
    for ($i = 1; $i -le 5; $i++) {
        # 32 random bytes -> base64url. We approximate base64url with a hex of
        # 32 bytes (64 chars) which exceeds the 32-char minimum. For exact
        # base64url parity we still use a 32-byte pool: this matches the Node
        # output length contractually (>32 chars, URL-safe charset).
        $raw = -join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
        Write-Host "JUDGE_${i}_TOKEN=$([Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($raw)).TrimEnd('=').Replace('+','-').Replace('/','_'))"
    }
    Write-Host '# After pasting into .env, re-run this script with --verify'
    exit 0
}

# ----------------------------------------------------------------------------
# --status : just classify and exit
# ----------------------------------------------------------------------------
if ($Mode -eq 'status') {
    $snap   = Get-TokenSnapshot
    $status = Get-StatusLabel -Snap $snap
    $present = 0
    foreach ($name in $TokenNames) {
        if (-not [string]::IsNullOrEmpty($snap[$name])) { $present++ }
    }
    Write-Host "STATUS=$status  PRESENT=$present/$($TokenNames.Count)  MANIFEST=$([System.IO.File]::Exists($ManifestPath))"
    exit 0
}

# ----------------------------------------------------------------------------
# --verify : validate + seal
# ----------------------------------------------------------------------------
$snap = Get-TokenSnapshot

# 1. presence
$missing = @()
foreach ($name in $TokenNames) {
    if ([string]::IsNullOrEmpty($snap[$name])) { $missing += $name }
}
if ($missing.Count -gt 0) {
    Write-Host "TOKENS_SEALED: no" -ForegroundColor Yellow
    Write-Host "MISSING: $($missing -join ', ')"
    Write-Host "HINT: run 'node -e ...' (one-liner) or 'pwsh scripts/seal-judge-tokens.ps1 --generate' and paste into .env"
    exit 1
}

# 2. length
$tooShort = @()
foreach ($name in $TokenNames) {
    if ($snap[$name].Length -lt 32) { $tooShort += $name }
}
if ($tooShort.Count -gt 0) {
    Write-Host "TOKENS_SEALED: no" -ForegroundColor Yellow
    Write-Host "TOO_SHORT: $($tooShort -join ', ')"
    exit 3
}

# 3. uniqueness
$seen = @{}
$dups = @()
foreach ($name in $TokenNames) {
    $v = $snap[$name]
    if ($seen.ContainsKey($v)) { $dups += "$name (dup of $($seen[$v]))" }
    else { $seen[$v] = $name }
}
if ($dups.Count -gt 0) {
    Write-Host "TOKENS_SEALED: no" -ForegroundColor Red
    Write-Host "DUPLICATES: $($dups -join '; ')"
    exit 2
}

# 4. build manifest (names + hashes only — values are NEVER written)
$entries = [ordered]@{}
foreach ($name in $TokenNames) {
    $entries[$name] = [ordered]@{
        sha256 = (Get-Sha256Hex -Value $snap[$name])
        length = $snap[$name].Length
    }
}

$manifest = [ordered]@{
    sealed_at      = (Get-Date).ToUniversalTime().ToString('o')
    schema_version = 1
    mode           = 'verify'
    count          = $TokenNames.Count
    tokens         = $entries
}

# Use a forward-friendly JSON; -Depth ensures nested ordered dicts serialize.
$json = $manifest | ConvertTo-Json -Depth 10

# Ensure the manifest path is gitignored implicitly by dotfile prefix; do not
# force overwrite without a stamp.
Set-Content -Path $ManifestPath -Value $json -Encoding UTF8

Write-Host "TOKENS_SEALED: yes" -ForegroundColor Green
Write-Host "MANIFEST: $ManifestPath"
Write-Host "SEALED_AT: $($manifest.sealed_at)"
exit 0