# .shogo/runtime/competitor-probe.ps1
$queries = @(
  "https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon",
  "https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/contents",
  "https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/readme",
  "https://raw.githubusercontent.com/jechaviz/future_caribbean_ai_buildathon/main/README.md",
  "https://raw.githubusercontent.com/jechaviz/future_caribbean_ai_buildathon/master/README.md",
  "https://raw.githubusercontent.com/jechaviz/future_caribbean_ai_buildathon/main/README.v",
  "https://raw.githubusercontent.com/jechaviz/future_caribbean_ai_buildathon/main/v.mod",
  "https://api.github.com/search/repositories?q=leasehold+ai",
  "https://api.github.com/search/repositories?q=condo+ai",
  "https://api.github.com/search/repositories?q=buildathon+track+9",
  "https://api.github.com/search/repositories?q=ai+real+estate+agentic",
  "https://api.github.com/search/repositories?q=caribbean+ai",
  "https://api.github.com/search/repositories?q=RTM+leaseholder",
  "https://api.github.com/search/repositories?q=freeholder+ai"
)
$out = ""
foreach ($u in $queries) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 8 -Headers @{"Accept"="application/vnd.github+json"}
    $out += "[OK] $u ($($r.StatusCode), $($r.Content.Length) bytes)`n"
    $body = $r.Content
    if ($body.Length -gt 2500) { $body = $body.Substring(0,2500) + "..." }
    $out += $body + "`n`n"
  } catch {
    $out += "[FAIL] $u - $($_.Exception.Message)`n`n"
  }
}
$out | Out-File -Encoding utf8 .shogo/runtime/competitor-probe-results.txt
Write-Host "DONE"