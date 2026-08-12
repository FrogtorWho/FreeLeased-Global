# .shogo/runtime/count-md.ps1
$root = (Get-Location).Path
$exclude = @('node_modules', '.venv', '.shogo', '.cursor', 'dist', '_archive', '_handoff', 'src-rhd-extracted', '.git')
$files = @()
Get-ChildItem -Path $root -Recurse -Filter '*.md' -File -ErrorAction SilentlyContinue | ForEach-Object {
  $skip = $false
  foreach ($ex in $exclude) {
    if ($_.FullName -like "*\$ex\*") { $skip = $true; break }
  }
  if (-not $skip) { $files += $_ }
}
"Total: $($files.Count)"
$files | Sort-Object FullName | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1)
  "{0,8}  {1}" -f $_.Length, $rel
} | Out-File -Encoding utf8 .shogo/runtime/md-inventory.txt
Write-Host "Saved inventory to .shogo/runtime/md-inventory.txt"