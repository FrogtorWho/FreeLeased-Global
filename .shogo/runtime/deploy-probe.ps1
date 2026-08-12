# .shogo/runtime/deploy-probe.ps1
# Probe deployment / pricing pages
$queries = @(
  "https://render.com/pricing",
  "https://vercel.com/pricing",
  "https://netlify.com/pricing",
  "https://fly.io/pricing",
  "https://railway.app/pricing",
  "https://docs.render.com/static-sites",
  "https://docs.netlify.com/get-started/",
  "https://docs.netlify.com/deploy/create-deploys/deploy-with-git/",
  "https://render.com/docs/static-sites",
  "https://docs.fly.io/getting-started/",
  "https://docs.fly.io/speedrun/",
  "https://pages.cloudflare.com/",
  "https://surge.sh/",
  "https://surge.sh/help/installing-surge",
  "https://www.pythonanywhere.com/pricing/",
  "https://fly.io/docs/launch/"
)
$out = ""
foreach ($u in $queries) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 8 -MaximumRedirection 5
    $out += "[OK] $u ($($r.StatusCode), $($r.Content.Length) bytes)`n"
    $body = ($r.Content -replace '<[^>]+>',' ' -replace '\s+',' ').Trim()
    if ($body.Length -gt 1200) { $body = $body.Substring(0,1200) }
    $out += $body + "`n`n"
  } catch {
    $out += "[FAIL] $u - $($_.Exception.Message)`n`n"
  }
}
$out | Out-File -Encoding utf8 .shogo/runtime/deploy-probe-results.txt
Write-Host "DONE"