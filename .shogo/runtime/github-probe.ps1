# .shogo/runtime/github-probe.ps1
# Probe GitHub for Future Caribbean buildathon artefacts
$queries = @(
  "https://api.github.com/orgs/futurecaribbean/repos",
  "https://api.github.com/orgs/future-caribbean/repos",
  "https://api.github.com/orgs/FutureCaribbean/repos",
  "https://api.github.com/repos/futurecaribbean/buildathon",
  "https://api.github.com/repos/futurecaribbean/.github",
  "https://api.github.com/users/futurecaribbean",
  "https://github.com/futurecaribbean/futurecaribbean.github.io",
  "https://api.github.com/repos/futurecaribbean/futurecaribbean.github.io",
  "https://api.github.com/repos/futurecaribbean/website",
  "https://api.github.com/repos/futurecaribbean/docs",
  "https://api.github.com/search/repositories?q=freeleased",
  "https://api.github.com/search/repositories?q=future+caribbean+buildathon",
  "https://api.github.com/search/repositories?q=leasehold+RTM",
  "https://api.github.com/search/code?q=leasehold+RTM+repo:futurecaribbean"
)
$out = ""
foreach ($u in $queries) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 8 -Headers @{"Accept"="application/vnd.github+json"}
    $out += "[OK] $u ($($r.StatusCode), $($r.Content.Length) bytes)`n"
    $body = $r.Content
    if ($body.Length -gt 1500) { $body = $body.Substring(0,1500) + "..." }
    $out += $body + "`n`n"
  } catch {
    $out += "[FAIL] $u - $($_.Exception.Message)`n`n"
  }
}
$out | Out-File -Encoding utf8 .shogo/runtime/github-probe-results.txt
Write-Host "DONE"