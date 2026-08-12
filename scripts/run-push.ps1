cd "g:/My Drive/Development/Future Caribbean/Shogo/FreeLeased-Global/workspace"
# Reset the workflow file (it requires the workflow scope).
git reset HEAD .github/workflows/deploy-docs-site.yml
git rm --cached .github/workflows/deploy-docs-site.yml 2>$null
git commit -m "feat(rbac): 5-role access governance + secret slice + 10 overlooked-system catch-ups (post-reset)"
Write-Host "EXIT=$LASTEXITCODE"
git log -1 --oneline
