# .shogo/runtime/web-probe.ps1
# Probes a set of URLs and returns first 1500 chars of any successful response.
$urls = @(
  "https://futurecaribbean.dev",
  "https://futurecaribbean.dev/buildathon",
  "https://www.futurecaribbean.dev",
  "https://www.futurecaribbean.dev/buildathon",
  "https://futurecaribbean.dev/judging",
  "https://futurecaribbean.dev/tracks",
  "https://futurecaribbean.dev/about",
  "https://www.futurecaribbean.dev/about",
  "https://docs.futurecaribbean.dev",
  "https://github.com/futurecaribbean",
  "https://www.futurecaribbean.dev/track-9",
  "https://www.futurecaribbean.dev/ai-real-estate",
  "https://www.futurecaribbean.dev/scoring",
  "https://www.futurecaribbean.dev/rubric"
)
$out = ""
foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 6 -MaximumRedirection 8
    $out += "[OK] $u ($($r.StatusCode), $($r.Content.Length) bytes)`n"
    $out += "  TITLE: " + ($r.ParsedHtml.title | Out-String).Trim() + "`n"
    # extract first 1500 chars of body text
    $body = ($r.Content -replace '<[^>]+>',' ' -replace '\s+',' ').Trim()
    $body = $body.Substring(0, [Math]::Min(1200, $body.Length))
    $out += "  BODY:`n  " + ($body -replace "`n","`n  ") + "`n`n"
  } catch {
    $out += "[FAIL] $u - $($_.Exception.Message)`n`n"
  }
}
$out | Out-File -Encoding utf8 .shogo/runtime/web-probe-results.txt
Write-Host "DONE - results in .shogo/runtime/web-probe-results.txt"