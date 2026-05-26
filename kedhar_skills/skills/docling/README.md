# Docling Skill Repo

This repository is the source of truth for the `docling` skill.

## What lives here

- `SKILL.md` - the skill entry point used by Codex and Claude Code
- `docs/` - detailed repo-specific reference material

## Install in Codex

Copy or symlink this repository into your Codex skills directory:

```powershell
$repo = "C:\Users\mbkhn\Downloads\Inspired\pdf_comparision\docling"
$target = Join-Path $env:USERPROFILE ".codex\skills\docling"

New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
New-Item -ItemType SymbolicLink -Path $target -Target $repo
```

If symlinks are blocked, copy the folder instead:

```powershell
Copy-Item -Recurse -Force "C:\Users\mbkhn\Downloads\Inspired\pdf_comparision\docling" "$env:USERPROFILE\.codex\skills\docling"
```

## Install in Claude Code

Use the same repo as the Claude Code personal skill:

```powershell
$repo = "C:\Users\mbkhn\Downloads\Inspired\pdf_comparision\docling"
$target = Join-Path $env:USERPROFILE ".claude\skills\docling"

New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
New-Item -ItemType SymbolicLink -Path $target -Target $repo
```

If symlinks are blocked, copy the folder instead:

```powershell
Copy-Item -Recurse -Force "C:\Users\mbkhn\Downloads\Inspired\pdf_comparision\docling" "$env:USERPROFILE\.claude\skills\docling"
```

## Use

- In Codex or Claude Code, ask for Docling work normally.
- The skill triggers for document conversion, extraction, table handling, bbox overlays, viewer issues, chunking, and model selection.
- Keep changes in this repo so the skill and the docs stay aligned.

## Update workflow

1. Edit `SKILL.md` for trigger text and core guidance.
2. Edit or add docs under `docs/` for detailed behavior.
3. Reinstall or resync the skill directory in Codex and Claude Code.
