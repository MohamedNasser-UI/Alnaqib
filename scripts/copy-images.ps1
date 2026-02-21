# Copy brand and product images into public/images so the site can display them.
# Run from project root: powershell -ExecutionPolicy Bypass -File scripts/copy-images.ps1
# If your images are elsewhere, copy them manually into public/images/ with these names:
#   logo.png, mystic-orchid.png, sultan-afghani.png, needs.png

$assets = "$env:USERPROFILE\.cursor\projects\c-Users-mohamed-abdelnaser-Desktop-Moustafa\assets"
$dst = Join-Path $PSScriptRoot "..\public\images"

if (-not (Test-Path $dst)) {
    New-Item -ItemType Directory -Path $dst -Force | Out-Null
}

$mapping = @(
    @{ Pattern = "*Brand_Logo*"; Dest = "logo.png" }
    @{ Pattern = "*Mystic*Orchid*"; Dest = "mystic-orchid.png" }
    @{ Pattern = "*Sultan*Afgani*"; Dest = "sultan-afghani.png" }
    @{ Pattern = "*Needs*"; Dest = "needs.png" }
)

foreach ($m in $mapping) {
    $f = Get-ChildItem -Path $assets -Filter "*.png" -ErrorAction SilentlyContinue | Where-Object { $_.Name -like $m.Pattern.Replace("*", "*") }
    if ($f) {
        Copy-Item $f[0].FullName -Destination (Join-Path $dst $m.Dest) -Force
        Write-Host "Copied: $($m.Dest)"
    }
    else {
        Write-Host "Not found (add manually): $($m.Dest)"
    }
}

Write-Host "Done. Images in: $dst"
