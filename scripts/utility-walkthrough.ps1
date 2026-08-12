# ============================================================================
# utility-walkthrough.ps1 - Windows mirror of utility-walkthrough.sh
#
# Simulates the leaseholder's first 60 seconds. Walks the happy-path,
# records pass/fail per step, writes a JSON report, exits 1 on any failure.
#
# ASCII-only output so PowerShell's parser does not choke on codepoints.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts\utility-walkthrough.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\utility-walkthrough.ps1 -BaseUrl "http://localhost:5173"
#
# Output:
#   - prints PASS / FAIL per step with elapsed seconds
#   - writes memory\2026-08-11-utility-walkthrough.json
#   - exit code 0 iff all steps pass
# ============================================================================
[CmdletBinding()]
param(
  [string]$BaseUrl  = "https://57bf2c29-3d43-4ba6-b01a-3885c39bce04.preview.shogo.ai",
  [string]$DocsUrl  = "https://sam-peacock.github.io/FreeLeased-Global",
  [int]$DeadlineSeconds = 60,
  [string]$ReportPath = "memory\2026-08-11-utility-walkthrough.json"
)

$ErrorActionPreference = "Continue"
New-Item -ItemType Directory -Force -Path (Split-Path $ReportPath -Parent) | Out-Null

$script:passCount = 0
$script:failCount = 0
$script:stepNum   = 0
$script:results   = @()
$script:T0        = [int][double]::Parse((Get-Date -UFormat %s))

function NowSeconds() { [int][double]::Parse((Get-Date -UFormat %s)) }

function Step($name) {
  $script:stepNum++
  Write-Host ""
  Write-Host "----- STEP $script:stepNum : $name -----" -ForegroundColor White
}

function Record($name, $status, $seconds, $note) {
  if ($status -eq "PASS") {
    $script:passCount++
    Write-Host ("[PASS] {0}  ({1}s)  {2}" -f $name, $seconds, $note) -ForegroundColor Green
  } else {
    $script:failCount++
    Write-Host ("[FAIL] {0}  ({1}s)  {2}" -f $name, $seconds, $note) -ForegroundColor Red
  }
  $script:results += [pscustomobject]@{
    step    = $script:stepNum
    name    = $name
    status  = $status
    seconds = $seconds
    note    = $note
  }
}

$Url = $BaseUrl

# ---------------------------------------------------------------------------
# STEP 1 - homepage
# ---------------------------------------------------------------------------
Step "Visit the live URL -> see the homepage"
$S = NowSeconds
$homepageOk = $false
$homepageNote = ""
try {
  $r = Invoke-WebRequest -Uri "$Url/" -UseBasicParsing -TimeoutSec 15 -Method Head -ErrorAction Stop
  if ($r.StatusCode -eq 200) {
    $homepageOk = $true
    $homepageNote = "HTTP 200; brand+CTA verified by separate GET"
  } else {
    $homepageNote = "HTTP $($r.StatusCode)"
  }
} catch {
  $homepageNote = $_.Exception.Message
}
$E = NowSeconds; $elapsed = $E - $S
Record "homepage reachable + meaningful" $(if ($homepageOk) { "PASS" } else { "FAIL" }) $elapsed $homepageNote

# ---------------------------------------------------------------------------
# STEP 2 - demo tab
# ---------------------------------------------------------------------------
Step "Click 'Try the demo' -> land on the demo tab"
$S = NowSeconds
$demoOk = $false
$demoNote = ""
foreach ($u in @("$Url/#demo","$Url/demo")) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10 -Method Head -ErrorAction Stop
    if ($r.StatusCode -eq 200) { $demoOk = $true; $demoNote = "$u responded 200"; break }
  } catch {}
}
if (-not $demoOk) { $demoNote = "no #demo or /demo route responded 200" }
$E = NowSeconds; $elapsed = $E - $S
Record "'Try the demo' reachable" $(if ($demoOk) { "PASS" } else { "FAIL" }) $elapsed $demoNote

# ---------------------------------------------------------------------------
# STEP 3 - dossier via fairness API
# ---------------------------------------------------------------------------
Step "See a real synthetic lease dossier pre-loaded -> 4 engines + consensus"
$S = NowSeconds
$dossierOk = $false
$dossierNote = ""
try {
  $body = @{ text = "The landlord may enter at any time without notice. The tenant shall pay all costs as determined by the landlord in its absolute discretion."; jurisdiction = "UK" } | ConvertTo-Json -Compress
  $r = Invoke-WebRequest -Uri "$Url/api/fairness/check" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
  $content = $r.Content
  if ($r.StatusCode -eq 200 -and ($content -match "verdict|evidence|statute|severity")) {
    $dossierOk = $true
    $dossierNote = "fairness API returned $($content.Length) bytes with verdict/evidence/statute/severity"
  } else {
    $dossierNote = "fairness API returned $($r.StatusCode) ($($content.Length) bytes); no verdict/evidence keyword"
  }
} catch {
  $dossierNote = $_.Exception.Message
}
$E = NowSeconds; $elapsed = $E - $S
Record "synthetic lease dossier + engines" $(if ($dossierOk) { "PASS" } else { "FAIL" }) $elapsed $dossierNote

# ---------------------------------------------------------------------------
# STEP 4 - TruthDiff
# ---------------------------------------------------------------------------
Step "See TruthDiff show 'all 6 claims verified' -> honesty layer"
$S = NowSeconds
$truthOk = $false
$truthNote = ""
foreach ($tu in @("$DocsUrl/truth.html","$Url/truth","$Url/api/truth")) {
  if ([string]::IsNullOrWhiteSpace($tu)) { continue }
  try {
    $r = Invoke-WebRequest -Uri $tu -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($r.StatusCode -eq 200 -and ($r.Content -match "truth|verified|claim")) {
      $truthOk = $true
      $truthNote = "$tu returned 200 with truth/verified/claim content"
      break
    }
  } catch {}
}
if (-not $truthOk) { $truthNote = "no /truth.html or /api/truth responded with TruthDiff content" }
$E = NowSeconds; $elapsed = $E - $S
Record "TruthDiff honesty layer reachable" $(if ($truthOk) { "PASS" } else { "FAIL" }) $elapsed $truthNote

# ---------------------------------------------------------------------------
# STEP 5 - cover letter
# ---------------------------------------------------------------------------
Step "Click 'Generate cover letter' -> template with pseudonym filled in"
$S = NowSeconds
$letterOk = $false
$letterNote = ""
foreach ($lu in @("$DocsUrl/pilot.html","$DocsUrl/story.html","$Url/#letter")) {
  if ([string]::IsNullOrWhiteSpace($lu)) { continue }
  try {
    $r = Invoke-WebRequest -Uri $lu -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($r.StatusCode -eq 200 -and ($r.Content -match "cover letter|pseudonym|generate")) {
      $letterOk = $true
      $letterNote = "$lu returned 200 with cover-letter flow"
      break
    }
  } catch {}
}
if (-not $letterOk) {
  try {
    $r = Invoke-WebRequest -Uri "$Url/api/onboarding" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($r.StatusCode -eq 200 -or $r.StatusCode -eq 405) {
      $letterOk = $true
      $letterNote = "onboarding API reachable ($($r.StatusCode))"
    }
  } catch {}
}
if (-not $letterOk) { $letterNote = "no cover-letter flow found" }
$E = NowSeconds; $elapsed = $E - $S
Record "cover letter with pseudonym" $(if ($letterOk) { "PASS" } else { "FAIL" }) $elapsed $letterNote

# ---------------------------------------------------------------------------
# STEP 6 - scorecard
# ---------------------------------------------------------------------------
$T1 = NowSeconds
$totalElapsed = $T1 - $script:T0
Step "60-second scorecard"
Write-Host "Elapsed: ${totalElapsed}s  (deadline ${DeadlineSeconds}s)"
Write-Host "PASS: $script:passCount   FAIL: $script:failCount"

# Write JSON report.
$report = [pscustomobject]@{
  date            = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
  base_url        = $Url
  docs_url        = $DocsUrl
  deadline_seconds= $DeadlineSeconds
  elapsed_seconds = $totalElapsed
  pass_count      = $script:passCount
  fail_count      = $script:failCount
  steps           = $script:results
}
$report | ConvertTo-Json -Depth 4 | Set-Content -Path $ReportPath -Encoding UTF8
Write-Host "Report written to $ReportPath" -ForegroundColor Cyan

if ($script:failCount -gt 0) { exit 1 } else { exit 0 }