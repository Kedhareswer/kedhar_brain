# Installation Guide

Skills install differently per agent. Pick your platform below.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Claude Code](#claude-code)
3. [Codex CLI (OpenAI)](#codex-cli-openai)
4. [GitHub Copilot CLI](#github-copilot-cli)
5. [Gemini CLI](#gemini-cli)
6. [Cursor / Windsurf / Other AGENTS.md agents](#cursor--windsurf--agents-using-agentsmd)
7. [Bulk install from this repo](#bulk-install-from-this-repo)
8. [Verifying installation](#verifying-installation)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Required for | Install |
|---|---|---|
| Node.js ≥ 18 | `npx skills` CLI | https://nodejs.org |
| Git | cloning skills | https://git-scm.com |
| The agent CLI itself | obvious | see each section |

---

## Claude Code

**Skills location:** `~/.claude/skills/<skill-name>/SKILL.md`
**Windows path:** `C:\Users\<you>\.claude\skills\<skill-name>\SKILL.md`

### Option A — Skills CLI (recommended)

```bash
# Install one skill globally
npx skills add Kedhareswer/Kedhar_skills@rag-engineer -g -y

# Search interactively
npx skills find rag

# Check for updates
npx skills check

# Update everything
npx skills update
```

Flags:
- `-g` → user-level install (`~/.claude/skills/`)
- `-y` → skip confirmation prompts
- omit `-g` → project-level install (`.claude/skills/` in current repo)

### Option B — Manual

```bash
# Clone the entire repo
git clone https://github.com/Kedhareswer/Kedhar_skills.git ~/Kedhar_skills

# Symlink or copy individual skills
ln -s ~/Kedhar_skills/skills/rag-engineer ~/.claude/skills/rag-engineer
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/Kedhareswer/Kedhar_skills.git $env:USERPROFILE\Kedhar_skills
New-Item -ItemType SymbolicLink `
  -Path "$env:USERPROFILE\.claude\skills\rag-engineer" `
  -Target "$env:USERPROFILE\Kedhar_skills\skills\rag-engineer"
```

### Invoking a skill in Claude Code

Once installed, the skill is auto-discovered. Invoke it three ways:

1. **Natural language:** Just describe your task — Claude reads the description fields and loads matching skills.
2. **Slash command:** `/<skill-name>` (e.g. `/find-skills`, `/brainstorming`).
3. **Explicit:** Use the `Skill` tool with `skill: "<name>"`.

---

## Codex CLI (OpenAI)

**Skills location:** `~/.codex/skills/<skill-name>/SKILL.md`
**Windows path:** `%USERPROFILE%\.codex\skills\<skill-name>\SKILL.md`

```bash
# Verify Codex
codex --version

# Install via Skills CLI (Codex auto-discovers ~/.codex/skills/)
SKILLS_TARGET=codex npx skills add Kedhareswer/Kedhar_skills@<skill-name> -g -y

# Or manual
git clone https://github.com/Kedhareswer/Kedhar_skills.git
cp -r Kedhar_skills/skills/<skill-name> ~/.codex/skills/
```

Codex reads `AGENTS.md` at session start for skill discovery. Add this to your project root:
```markdown
# AGENTS.md
Skills are available in ~/.codex/skills/. Load them when their description matches the task.
```

See the `codex` skill (already installed) for the `codex exec` workflow that lets Claude Code delegate to Codex.

---

## GitHub Copilot CLI

**Skills location:** Skills are auto-discovered from installed plugins.

```bash
# Install Copilot CLI
gh extension install github/gh-copilot

# Install a skill
gh copilot skill install Kedhareswer/Kedhar_skills@<skill-name>

# List installed
gh copilot skill list
```

Copilot uses the `skill` tool (same semantics as Claude's `Skill` tool). See `references/copilot-tools.md` in the `using-superpowers` skill for the full tool-name mapping.

---

## Gemini CLI

**Skills location:** `~/.gemini/skills/<skill-name>/SKILL.md`

```bash
# Install
gemini skill install Kedhareswer/Kedhar_skills@<skill-name>

# List
gemini skill list

# Update
gemini skill update
```

Gemini loads skill metadata at session start, then activates full content on demand via the `activate_skill` tool. A `GEMINI.md` file in your project root tells Gemini where to look:

```markdown
# GEMINI.md
Skills are in ~/.gemini/skills/ and use Claude Code tool names — see the tool-mapping reference.
```

---

## Cursor / Windsurf / Agents using AGENTS.md

Any agent that reads `AGENTS.md` (Cursor, Windsurf, Aider, Roo, Cline, etc.) can use skills via reference:

1. Clone the repo somewhere stable:
   ```bash
   git clone https://github.com/Kedhareswer/Kedhar_skills.git ~/Kedhar_skills
   ```

2. Add to your project's `AGENTS.md`:
   ```markdown
   # AGENTS.md

   ## Skills Library
   Reference skills at ~/Kedhar_skills/skills/<name>/SKILL.md when their description
   matches the current task. See ~/Kedhar_skills/SKILLS.md for the full catalog.
   ```

3. The agent reads the relevant `SKILL.md` when its description matches your prompt.

---

## Bulk Install from this Repo

### Install **all** skills at once

**Windows (PowerShell):**
```powershell
iwr -useb https://raw.githubusercontent.com/Kedhareswer/Kedhar_skills/main/install.ps1 | iex
```

**macOS / Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/Kedhareswer/Kedhar_skills/main/install.sh | bash
```

Both scripts:
1. Detect installed agents (Claude, Codex, Copilot, Gemini)
2. Clone this repo to `~/.skills-cache/`
3. Symlink every skill into each detected agent's skills directory
4. Print a summary of what was installed where

### Install **one category** only

```bash
# bash
./install.sh --category rag-and-search

# powershell
./install.ps1 -Category rag-and-search
```

Available categories: `ai-and-llm`, `rag-and-search`, `ml-training`, `python`, `frontend-web`, `backend-api`, `database-data`, `testing-quality`, `devops`, `security`, `design-ui-ux`, `docs-writing`, `workflow-meta`, `research-scraping`, `seo-marketing`, `document-processing`, `media-content`, `specialized`.

---

## Verifying Installation

After install, verify the skill is discoverable:

**Claude Code:**
```bash
ls ~/.claude/skills/<skill-name>/SKILL.md
# Or open Claude Code and type: /find-skills
```

**Codex:**
```bash
ls ~/.codex/skills/<skill-name>/SKILL.md
codex exec "list available skills"
```

**Inside the agent**, ask:
> *"What skills do you have for X?"*

The agent will list matching skills from its skills directory.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `npx skills: command not found` | Node not installed | Install Node ≥ 18 |
| Skill installed but agent doesn't load it | Description doesn't match query | Try `/find-skills` to see what's available, or invoke explicitly via `Skill` tool |
| Permission denied on `~/.claude/skills/` | Directory perms wrong | `chmod -R u+rw ~/.claude/skills` |
| Skill loads but errors on referenced files | Symlink broken / partial install | Re-run installer or clone repo directly |
| Multiple agents share skills | Same `~/.claude/skills/` symlinked everywhere | Intentional — single source of truth |
| Windows symlinks fail | Developer mode off | Settings → Privacy & Security → For Developers → On, then re-run installer |

---

## Uninstalling

```bash
# Single skill
npx skills remove <skill-name> -g

# All skills from this repo
rm -rf ~/.skills-cache
# Then manually remove symlinks from each agent's skills dir
```

Or just delete the skill's directory from the agent's skills folder — that's the only state.
