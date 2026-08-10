$root = 'G:\My Drive\Development\Future Caribbean\Data Room\'

Write-Host "=== SHOW ALL (including hidden) AT TOP LEVEL ==="
Get-ChildItem -Path $root -Force | Select-Object Name, PSIsContainer, Length, Extension, Attributes | Format-Table -AutoSize -Wrap

Write-Host ""
Write-Host "=== SHOGO FOLDER CONTENTS ==="
Get-ChildItem -Path (Join-Path $root 'Shogo') -Force -Recurse | Select-Object FullName, PSIsContainer, Length, Extension | Format-Table -AutoSize -Wrap

Write-Host ""
Write-Host "=== 00_README FOLDER CONTENTS ==="
Get-ChildItem -Path (Join-Path $root '00_README - Index and TRL Map') -Force -Recurse | Select-Object FullName, PSIsContainer, Length, Extension | Format-Table -AutoSize -Wrap

Write-Host ""
Write-Host "=== TEST: ARE FILES SYNCED? - LOOK FOR ANY FILE TYPE AT ALL ==="
$root2 = 'G:\My Drive\Development\Future Caribbean\'
Get-ChildItem -Path $root2 -Recurse -File -ErrorAction SilentlyContinue | Select-Object FullName, Length, Extension | Format-Table -AutoSize -Wrap