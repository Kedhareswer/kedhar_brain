---
name: cursor
description: >
  Enables Claude Code to delegate work to the Cursor Agent CLI (`cursor-agent -p`, resumes,
  and plan/ask modes) for automated code analysis, refactoring, and editing — then supervises
  the result. Triggers on any request to use Cursor — "use Cursor to...", "run Cursor on...",
  "analyze with Cursor", "have Cursor look at...", "let Cursor handle...", "Cursor review...",
  "send this to Cursor", "delegate this to Cursor", etc.
---

# Cursor Agent Integration

Delegates code analysis, refactoring, and editing tasks to the Cursor Agent CLI from within
Claude Code, then supervises and iterates on the output.

## Resolve the binary FIRST

The PATH wrapper (`agent` / `cursor-agent`) is broken on recent installs — its version-dir
regex rejects the timestamped dir name, so it errors `No version directories found`. Always
resolve the real versioned binary instead. Run this once and reuse `$AGENT` for the session:

```powershell
$base = "$env:LOCALAPPDATA\cursor-agent"
$AGENT = (Get-ChildItem "$base\versions" -Directory -ErrorAction SilentlyContinue |
  Sort-Object Name -Descending | Select-Object -First 1).FullName + "\cursor-agent.cmd"
if (-not (Test-Path $AGENT)) { $AGENT = "$base\cursor-agent.cmd" }  # fallback
& $AGENT --version
```

- If neither path exists → tell the user to install it: PowerShell `irm 'https://cursor.com/install?win32=true' | iex` (macOS/Linux: `curl https://cursor.com/install -fsS | bash`).
- Version names sort lexically by date prefix, so `Sort-Object Name -Descending` picks the newest. This survives `cursor-agent update`.

## Workflow

### 1. Check auth

```powershell
& $AGENT status
```

- `Not logged in` → tell the user to run `& $AGENT login` (opens a browser) **themselves** in their own terminal, or to set `$env:CURSOR_API_KEY`. Don't run interactive `login` from inside a tool call — it blocks.
- Logged in → proceed.

### 2. Discover the model (don't hardcode)

```powershell
& $AGENT models
```

Model names change across versions. Examples seen: `gpt-5`, `sonnet-4-thinking`, and
parameterized forms like `claude-opus-4-8[context=1m,effort=high,fast=false]`.

### 3. Ask the user via AskUserQuestion

Two calls in sequence (one question each):

**Call 1 — Model:** options from `models` output; first option = a sensible default
(e.g. `sonnet-4-thinking`). Always allow **Other** for a custom/parameterized name.

**Call 2 — Mode** (this is Cursor's sandbox equivalent — see table below): `agent (writes)`,
`plan (read-only)`, `ask (read-only Q&A)`.

Skip the asks if the user already named a model/mode in their request.

### 4. Pick the mode from the task

Cursor has no `read-only`/`workspace-write`/`full-access` sandbox triad like Codex. Map intent
to `--mode` + permission flags:

| Task keywords | Flags | Confirm? |
|---|---|---|
| analyze, review, check, audit, explain, read, inspect, compare, plan | `--mode plan` (or `--mode ask` for Q&A) | No |
| refactor, edit, write, fix, update, rename, move, add, create | *(default agent mode — no mode flag)* | No |
| run, execute, install, deploy, delete, rm, drop, "do everything" | add `--force` (alias `--yolo`) | **Always confirm** |

- Default `-p` agent mode already has write + shell tools, but prompts before risky commands. `--force`/`--yolo` removes those prompts → only with explicit user OK.
- In headless print mode add `--trust` so it doesn't block on a workspace-trust prompt.

### 5. Build and run the command

Always non-interactive: `-p` (print) + an explicit `--output-format`.

```powershell
& $AGENT -p --output-format text --trust --model "{model}" {modeFlags} "{prompt}"
```

**Prompt enrichment** — prepend project context before the user's request:

```
Project: {repo_name} ({git_branch})
Working directory: {cwd}
---
{user's original request}
```

- `--output-format text` for human-readable; `json` if you need to parse the final result; `stream-json` (+ `--stream-partial-output`) only for live streaming.
- Run via PowerShell; stderr is already captured by the tool — don't add `2>&1` to native exes in PowerShell 5.1 (it wraps lines as errors). Read the result directly.

### 6. Handle output

- Exit 0 → relay output. If it exceeds ~4000 chars, summarize in 5–10 bullets and offer to save the full text to a file.
- Exit non-zero → show the error and diagnose:

| Error pattern | Diagnosis |
|---|---|
| `No version directories found` | You used the broken wrapper — re-resolve `$AGENT` (step 0) |
| `Not logged in` / `auth` / `401` / `403` | User runs `& $AGENT login` or sets `CURSOR_API_KEY` |
| `unknown model` / invalid model | Re-check `& $AGENT models` or ask the user |
| blocks / hangs | An interactive prompt slipped through — ensure `-p` and `--trust` are set |
| permission / command denied | Agent mode blocked a shell command — offer `--force` (confirm first) |

### 7. Supervise (feedback loop)

After relaying output, don't just stop:

- Found issues in plan/ask mode → "Want Cursor to fix these?" (re-run in default agent mode).
- Made edits → review the diff yourself (`git diff`) before telling the user it's done; run their tests if relevant.
- Broad analysis → "Want me to dig into any specific finding?"

### 8. Resume a session

```powershell
& $AGENT ls            # list past chats
& $AGENT resume        # resume latest
& $AGENT --resume "{chatId}" -p --output-format text "{follow-up}"
& $AGENT --continue -p --output-format text "{follow-up}"
```

Trigger on: "continue", "resume", "follow up", "pick up where Cursor left off", "last session".

## Quick reference

| Need | Flag |
|---|---|
| Headless / scriptable | `-p` / `--print` |
| Output format | `--output-format text\|json\|stream-json` |
| Read-only planning | `--mode plan` (or `--plan`) |
| Read-only Q&A | `--mode ask` |
| Pick model | `--model "<name>"` |
| Skip trust prompt (headless) | `--trust` |
| Run shell freely (confirm!) | `--force` / `--yolo` |
| Isolated git worktree | `-w [name]` |
| List models | `& $AGENT models` |
| Auth status | `& $AGENT status` |
