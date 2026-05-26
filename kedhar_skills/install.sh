#!/usr/bin/env bash
# Kedhar Skills installer for macOS / Linux
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/Kedhareswer/Kedhar_skills/main/install.sh | bash
#   # or with category filter:
#   ./install.sh --category rag-and-search
#   # or single skill:
#   ./install.sh --skill rag-engineer

set -euo pipefail

REPO_URL="https://github.com/Kedhareswer/Kedhar_skills.git"
CACHE_DIR="$HOME/.skills-cache"

CATEGORY="all"
SKILL=""
FORCE=0
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --category) CATEGORY="$2"; shift 2;;
    --skill)    SKILL="$2"; shift 2;;
    --force)    FORCE=1; shift;;
    --dry-run)  DRY_RUN=1; shift;;
    -h|--help)
      sed -n '2,11p' "$0"; exit 0;;
    *) echo "Unknown arg: $1" >&2; exit 1;;
  esac
done

step() { printf "\033[36m==> %s\033[0m\n" "$*"; }
ok()   { printf "    \033[32m[OK]\033[0m %s\n" "$*"; }
warn() { printf "    \033[33m[WARN]\033[0m %s\n" "$*"; }
err()  { printf "    \033[31m[ERR]\033[0m %s\n" "$*" >&2; }

# 1. Detect agents
step "Detecting installed agents"
declare -A AGENTS=()

if [[ -d "$HOME/.claude" ]]; then
  AGENTS[claude]="$HOME/.claude/skills"
  ok "Claude Code detected -> ${AGENTS[claude]}"
fi
if [[ -d "$HOME/.codex" ]]; then
  AGENTS[codex]="$HOME/.codex/skills"
  ok "Codex CLI detected -> ${AGENTS[codex]}"
fi
if [[ -d "$HOME/.gemini" ]]; then
  AGENTS[gemini]="$HOME/.gemini/skills"
  ok "Gemini CLI detected -> ${AGENTS[gemini]}"
fi

if [[ ${#AGENTS[@]} -eq 0 ]]; then
  warn "No agents detected. Defaulting to ~/.claude/skills/"
  AGENTS[claude]="$HOME/.claude/skills"
fi

# 2. Sync cache
step "Syncing skills cache at $CACHE_DIR"
if [[ -d "$CACHE_DIR" ]]; then
  if [[ $FORCE -eq 1 ]]; then
    rm -rf "$CACHE_DIR"
    git clone --depth 1 "$REPO_URL" "$CACHE_DIR"
  else
    git -C "$CACHE_DIR" pull --ff-only
  fi
else
  git clone --depth 1 "$REPO_URL" "$CACHE_DIR"
fi
ok "Cache ready"

# 3. Determine skill list
SKILLS_ROOT="$CACHE_DIR/skills"
[[ -d "$SKILLS_ROOT" ]] || SKILLS_ROOT="$CACHE_DIR"

declare -a SKILL_LIST=()
if [[ -n "$SKILL" ]]; then
  if [[ -f "$SKILLS_ROOT/$SKILL/SKILL.md" ]]; then
    SKILL_LIST=("$SKILL")
  else
    err "Skill '$SKILL' not found in $SKILLS_ROOT"; exit 1
  fi
elif [[ "$CATEGORY" == "all" ]]; then
  while IFS= read -r d; do
    [[ -f "$d/SKILL.md" ]] && SKILL_LIST+=("$(basename "$d")")
  done < <(find "$SKILLS_ROOT" -mindepth 1 -maxdepth 1 -type d)
else
  INDEX="$CACHE_DIR/skills.json"
  [[ -f "$INDEX" ]] || { err "skills.json missing; cannot filter by category"; exit 1; }
  if command -v jq >/dev/null 2>&1; then
    mapfile -t SKILL_LIST < <(jq -r --arg c "$CATEGORY" '.skills[] | select(.category==$c) | .name' "$INDEX")
  else
    err "jq not installed and category filter requested. Install jq or use --skill."; exit 1
  fi
  [[ ${#SKILL_LIST[@]} -eq 0 ]] && { err "No skills in category '$CATEGORY'"; exit 1; }
fi

step "Installing ${#SKILL_LIST[@]} skill(s) into ${#AGENTS[@]} agent(s)"

# 4. Install
INSTALLED=0; SKIPPED=0; FAILED=0
for s in "${SKILL_LIST[@]}"; do
  SRC="$SKILLS_ROOT/$s"
  [[ -f "$SRC/SKILL.md" ]] || { warn "Skipping '$s' (no SKILL.md)"; ((SKIPPED++)); continue; }

  for agent in "${!AGENTS[@]}"; do
    AGENT_DIR="${AGENTS[$agent]}"
    mkdir -p "$AGENT_DIR"
    DEST="$AGENT_DIR/$s"

    if [[ -e "$DEST" ]]; then
      if [[ $FORCE -eq 1 ]]; then
        rm -rf "$DEST"
      else
        ((SKIPPED++)); continue
      fi
    fi

    if [[ $DRY_RUN -eq 1 ]]; then
      echo "    [DRY] $agent <- $s"
      continue
    fi

    if ln -s "$SRC" "$DEST" 2>/dev/null; then
      ((INSTALLED++))
    elif cp -R "$SRC" "$DEST"; then
      ((INSTALLED++))
    else
      err "Failed to install $s to $agent"; ((FAILED++))
    fi
  done
done

# 5. Summary
echo
step "Summary"
ok "Installed: $INSTALLED"
[[ $SKIPPED -gt 0 ]] && warn "Skipped (already present): $SKIPPED"
[[ $FAILED  -gt 0 ]] && err  "Failed: $FAILED"

cat <<EOF

Next steps:
  - In Claude Code, type /find-skills
  - See SKILLS.md for the full catalog
  - Re-run with --force to overwrite, --dry-run to preview, --category <name> or --skill <name> to filter
EOF
