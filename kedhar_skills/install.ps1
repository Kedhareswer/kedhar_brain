# Kedhar Skills installer for Windows (PowerShell)
# Usage:
#   iwr -useb https://raw.githubusercontent.com/Kedhareswer/Kedhar_skills/main/install.ps1 | iex
#   # or with category filter:
#   .\install.ps1 -Category rag-and-search

param(
    [string]$Category = "all",
    [string]$Skill = "",
    [switch]$Force,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/Kedhareswer/Kedhar_skills.git"
$CacheDir = Join-Path $env:USERPROFILE ".skills-cache"

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "    [WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "    [ERR] $msg" -ForegroundColor Red }

# 1. Detect installed agents
Write-Step "Detecting installed agents"
$Agents = @{}

$ClaudeDir = Join-Path $env:USERPROFILE ".claude\skills"
if (Test-Path (Join-Path $env:USERPROFILE ".claude")) {
    $Agents["claude"] = $ClaudeDir
    Write-Ok "Claude Code detected -> $ClaudeDir"
}

$CodexDir = Join-Path $env:USERPROFILE ".codex\skills"
if (Test-Path (Join-Path $env:USERPROFILE ".codex")) {
    $Agents["codex"] = $CodexDir
    Write-Ok "Codex CLI detected -> $CodexDir"
}

$GeminiDir = Join-Path $env:USERPROFILE ".gemini\skills"
if (Test-Path (Join-Path $env:USERPROFILE ".gemini")) {
    $Agents["gemini"] = $GeminiDir
    Write-Ok "Gemini CLI detected -> $GeminiDir"
}

if ($Agents.Count -eq 0) {
    Write-Warn "No agents detected. Installing to ~/.claude/skills/ as default."
    $Agents["claude"] = $ClaudeDir
}

# 2. Clone or update cache
Write-Step "Syncing skills cache at $CacheDir"
if (Test-Path $CacheDir) {
    if ($Force) {
        Remove-Item -Recurse -Force $CacheDir
        git clone --depth 1 $RepoUrl $CacheDir
    } else {
        Push-Location $CacheDir
        git pull --ff-only
        Pop-Location
    }
} else {
    git clone --depth 1 $RepoUrl $CacheDir
}
Write-Ok "Cache ready"

# 3. Determine which skills to install
$SkillsRoot = Join-Path $CacheDir "skills"
if (-not (Test-Path $SkillsRoot)) {
    # Fall back: treat root-level skill dirs as the source
    $SkillsRoot = $CacheDir
}

$SkillList = @()
if ($Skill) {
    $SkillPath = Join-Path $SkillsRoot $Skill
    if (Test-Path (Join-Path $SkillPath "SKILL.md")) {
        $SkillList = @($Skill)
    } else {
        Write-Err "Skill '$Skill' not found in $SkillsRoot"
        exit 1
    }
} elseif ($Category -eq "all") {
    $SkillList = Get-ChildItem $SkillsRoot -Directory |
        Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") } |
        ForEach-Object { $_.Name }
} else {
    # Load category mapping from skills.json
    $IndexPath = Join-Path $CacheDir "skills.json"
    if (-not (Test-Path $IndexPath)) {
        Write-Err "skills.json not found in cache. Cannot filter by category."
        exit 1
    }
    $Index = Get-Content $IndexPath -Raw | ConvertFrom-Json
    $SkillList = $Index.skills | Where-Object { $_.category -eq $Category } | ForEach-Object { $_.name }
    if ($SkillList.Count -eq 0) {
        Write-Err "No skills found in category '$Category'"
        exit 1
    }
}

Write-Step ("Installing {0} skill(s) into {1} agent(s)" -f $SkillList.Count, $Agents.Count)

# 4. Install (symlink) each skill to each agent
$Installed = 0
$Skipped = 0
$Failed = 0

foreach ($s in $SkillList) {
    $Src = Join-Path $SkillsRoot $s
    if (-not (Test-Path (Join-Path $Src "SKILL.md"))) {
        Write-Warn "Skipping '$s' — no SKILL.md"
        $Skipped++
        continue
    }

    foreach ($agent in $Agents.Keys) {
        $AgentDir = $Agents[$agent]
        if (-not (Test-Path $AgentDir)) {
            New-Item -ItemType Directory -Path $AgentDir -Force | Out-Null
        }

        $Dest = Join-Path $AgentDir $s
        if (Test-Path $Dest) {
            if ($Force) {
                Remove-Item -Recurse -Force $Dest
            } else {
                $Skipped++
                continue
            }
        }

        if ($DryRun) {
            Write-Host "    [DRY] $agent <- $s"
            continue
        }

        try {
            New-Item -ItemType SymbolicLink -Path $Dest -Target $Src -ErrorAction Stop | Out-Null
            $Installed++
        } catch {
            # Fall back to copy if symlinks need elevation
            try {
                Copy-Item -Recurse -Path $Src -Destination $Dest -Force
                $Installed++
            } catch {
                Write-Err "Failed to install $s to $agent : $_"
                $Failed++
            }
        }
    }
}

# 5. Summary
Write-Host ""
Write-Step "Summary"
Write-Ok ("Installed: {0}" -f $Installed)
if ($Skipped -gt 0) { Write-Warn ("Skipped (already present): {0}" -f $Skipped) }
if ($Failed -gt 0)  { Write-Err  ("Failed: {0}" -f $Failed) }

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  - In Claude Code, type /find-skills"
Write-Host "  - See SKILLS.md for the full catalog"
Write-Host "  - Re-run with -Force to overwrite, -DryRun to preview, -Category <name> to filter"
