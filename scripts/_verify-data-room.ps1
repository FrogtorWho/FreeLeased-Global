# Data Room verification script (writes results to a file so the cmd shell can display them)
$targetRoot = "G:\My Drive\Development\Future Caribbean\Data Room"
$outFile = "g:\My Drive\Development\Future Caribbean\Shogo\FreeLeased-Global\workspace\scripts\_verify-output.txt"

$files = Get-ChildItem $targetRoot -Recurse -File
$totalFiles = $files.Count
$totalBytes = ($files | Measure-Object -Length -Sum).Sum

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("TOTAL_FILES=$totalFiles")
$lines.Add("TOTAL_BYTES=$totalBytes")
$lines.Add("---")

$files | Sort-Object FullName | ForEach-Object {
  $rel = $_.FullName.Substring($targetRoot.Length + 1)
  $lines.Add(("{0,-12}  {1}" -f $_.Length, $rel))
}
$lines.Add("---")
$lines.Add("EMPTY_SUBFOLDERS:")
Get-ChildItem $targetRoot -Recurse -Directory | Where-Object { (Get-ChildItem $_.FullName -File -ErrorAction SilentlyContinue).Count -eq 0 } | ForEach-Object {
  $rel = $_.FullName.Substring($targetRoot.Length + 1)
  $lines.Add("  $rel")
}

$lines | Out-File -FilePath $outFile -Encoding UTF8
Write-Host "WROTE_OUTPUT_TO: $outFile"
Write-Host "TOTAL_FILES=$totalFiles"
Write-Host "TOTAL_BYTES=$totalBytes"