#Requires -Version 5.1
<#
.SYNOPSIS
  Restores the kedhar_plugins snapshot into ~/.claude/plugins/.

.DESCRIPTION
  Copies marketplaces/ and the two registry JSON files into the current
  user's Claude Code plugins directory. The cache is rebuilt by Claude
  Code itself on next run.
#>

[CmdletBinding()]
param(
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$here       = Split-Path -Parent $MyInvocation.MyCommand.Path
$claudeRoot = Join-Path $env:USERPROFILE ".claude\plugins"

Write-Host "Installing kedhar_plugins -> $claudeRoot" -ForegroundColor Cyan

if (-not (Test-Path $claudeRoot)) {
    New-Item -ItemType Directory -Path $claudeRoot -Force | Out-Null
    Write-Host "  created $claudeRoot"
}

# 1. Marketplaces
$srcMarkets = Join-Path $here "marketplaces"
$dstMarkets = Join-Path $claudeRoot "marketplaces"

if (Test-Path $dstMarkets) {
    if (-not $Force) {
        Write-Host ""
        Write-Host "  WARNING: $dstMarkets already exists." -ForegroundColor Yellow
        $answer = Read-Host "  Overwrite? (y/N)"
        if ($answer -notmatch '^(y|yes)$') {
            Write-Host "Aborted." -ForegroundColor Red
            exit 1
        }
    }
}

Get-ChildItem $srcMarkets -Directory | ForEach-Object {
    $target = Join-Path $dstMarkets $_.Name
    Write-Host "  marketplace: $($_.Name)"
    robocopy $_.FullName $target /E /NFL /NDL /NJH /NJS /NP /R:1 /W:1 | Out-Null
}

# 2. Registry JSON files
Copy-Item (Join-Path $here "installed_plugins.json")   (Join-Path $claudeRoot "installed_plugins.json")   -Force
Copy-Item (Join-Path $here "known_marketplaces.json")  (Join-Path $claudeRoot "known_marketplaces.json")  -Force
Write-Host "  copied installed_plugins.json + known_marketplaces.json"

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Next step: open Claude Code (or run 'claude plugin update --all') so the cache rebuilds."
