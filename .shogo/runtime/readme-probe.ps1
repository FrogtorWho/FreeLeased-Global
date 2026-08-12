# .shogo/runtime/readme-probe.ps1
$queries = @(
  "https://raw.githubusercontent.com/svtgrig-truest/Leasehold-buddy/main/README.md",
  "https://raw.githubusercontent.com/svtgrig-truest/Leasehold-buddy/master/README.md",
  "https://raw.githubusercontent.com/brightdata/real-estate-ai-agent/main/README.md",
  "https://raw.githubusercontent.com/drivendataorg/open-ai-caribbean/main/README.md",
  "https://raw.githubusercontent.com/hummingbot/condor/main/README.md",
  "https://raw.githubusercontent.com/jechaviz/future_caribbean_ai_buildathon/main/cmd/fcbuild.v",
  "https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/contents/cmd",
  "https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents",
  "https://api.github.com/repos/brightdata/real-estate-ai-agent/contents"
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
$out | Out-File -Encoding utf8 .shogo/runtime/readme-probe-results.txt
Write-Host "DONE"