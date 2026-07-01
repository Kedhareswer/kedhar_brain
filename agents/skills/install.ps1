# Install agent skills into ~/.claude/skills (flattens categories)
$dest = Join-Path $env:USERPROFILE ".claude\skills"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Get-ChildItem -Path (Join-Path $PSScriptRoot '*') -Directory |
  Where-Object { $_.Name -notin @('node_modules') } |
  ForEach-Object {
    Get-ChildItem -Path $_.FullName -Directory | ForEach-Object {
      Copy-Item -Recurse -Force $_.FullName (Join-Path $dest $_.Name)
    }
  }
Write-Host "Installed agent skills to $dest"
