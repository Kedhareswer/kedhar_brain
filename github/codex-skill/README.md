> 📦 [Kedhareswer/codex-skill](https://github.com/Kedhareswer/codex-skill) · ⭐ 1 · — · updated 2026-03-17  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# codex-skill

**Stop switching terminals. Let Claude run your Codex.**

You're already in Claude. You've got a plan. Now you just want Codex to execute it — without opening a second terminal, re-typing model names, or losing your context.

This skill makes that happen. One conversation. Both tools.

---

## The problem

![before-after](./before-after.gif)

You love both. Using both manually is painful.

**Codex CLI** — precise, disciplined executor. But barebones. You're re-approving the same commands every run, guessing flags, losing context the moment you switch windows.

**Claude Code** — best orchestrator alive. But expensive at scale, and there's no native path to hand off execution to something more focused.

**Using both without a bridge?** Two terminals. Re-typing model names. Context gone every time you switch. Every. Single. Time.

---

## The solution

![demo](./demo.gif)

Install this skill and just say what you want. Claude reads your Codex config, pops up a model + reasoning selector, builds the exact command, runs it — and then asks if you want it to act on what Codex found.

```
you  →  Claude  →  Codex CLI  →  your codebase
        plans       executes       gets better
```

No flags to remember. No terminal switching. No re-explaining context.

---

## What Claude handles for you

- Reads `~/.codex/config.toml` live — never hardcodes a model name
- Shows an interactive selector for model + reasoning effort before every run
- Picks the right sandbox automatically (`read-only` for analysis, `workspace-write` for edits)
- Captures errors and tells you exactly what went wrong (no silent failures)
- Injects project context — repo name, branch, working directory — into every Codex prompt
- Relays output verbatim, then asks "Want me to fix these?" to close the loop
- Resumes sessions with `--last` or by ID when you want to continue where Codex left off
- Always confirms before touching anything with `danger-full-access`
- Enables experimental multi-agent mode (`--enable multi_agent`) for parallel workstreams
- Suggests `AGENTS.md` setup for project-level Codex instructions

---

## How it feels to use

Just talk to Claude the way you normally do. The skill activates on anything that sounds like Codex work:

| You say | What happens |
|---------|-------------|
| `use Codex to analyze src/App.tsx` | Model selector → analysis, `read-only` sandbox |
| `have Codex refactor the auth module` | Model selector → edits, `workspace-write` sandbox |
| `let Codex do a security audit on src/api/` | Runs analysis, offers to fix findings |
| `send this to Codex with high reasoning` | Deep analysis with extended thinking |
| `resume the last Codex session` | `codex exec resume --last`, picks up right where you left off |
| `use Codex with subagents to audit all files` | Enables `multi_agent` mode for parallel analysis |

No magic words required — Claude will recognize "use Codex", "run Codex", "let Codex", "have Codex", "send to Codex", and more.

---

## Claude vs Codex — why you want both

| | Claude Code | Codex CLI |
|---|---|---|
| Best at | Planning, orchestration, big picture | Focused execution, precise edits |
| Tooling | Rich — skills, MCP, plan mode | Barebones by design |
| Token cost | Higher at scale | Leaner |
| Stays on task | Can drift | Rarely drifts |
| Open source | No | Apache 2.0 |
| Sweet spot | Thinking through the problem | Executing the solution |

Together they're better than either alone. This skill is the bridge.

---

## Install

**The lazy way — just tell Claude:**
```
Install the codex skill from https://github.com/Kedhareswer/codex-skill
```
Claude will handle it.

**One-liner:**
```bash
mkdir -p ~/.claude/skills/codex && curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

**Clone and copy:**
```bash
git clone https://github.com/Kedhareswer/codex-skill
cp -r codex-skill/skills/codex ~/.claude/skills/codex
```

**Verify it's working:** Tell Claude `use Codex to say hello` — the model selector should appear and Codex should respond. If it does, you're live.

---

## Prerequisites

You'll need both CLIs installed and authenticated:

```bash
claude --version && codex --version && codex login
```

- [Install Claude Code](https://docs.anthropic.com/claude-code)
- [Install Codex CLI](https://github.com/openai/codex) — `npm i -g @openai/codex`

---

## Optional: AGENTS.md

Codex reads `AGENTS.md` files from your project root (and `~/.codex/AGENTS.md` globally) to pick up project-specific instructions — coding conventions, test commands, forbidden patterns, and more.

Drop one in your repo and every Codex run automatically respects it — no need to re-explain context in every prompt.

---

## The full loop — meet claude-skill

This repo handles **Claude → Codex**. There's a companion skill that closes the other direction.

**[claude-skill](https://github.com/Kedhareswer/claude-skill)** lets Codex call Claude on demand — from inside a Codex session. Same idea, reversed.

Install both and you get a real two-way bridge:

```
Claude  ──→  Codex     (this skill — delegate execution to Codex)
Codex   ──→  Claude    (claude-skill — escalate planning to Claude)
```

With claude-skill installed in Codex, you get seven slash commands inside any Codex session:

| Command | What it does |
|---|---|
| `/claude-plan` | Architecture and phased implementation planning |
| `/claude-spec` | Decision-complete implementation specs |
| `/claude-review` | Code review with risk assessment |
| `/claude-debug` | Structured root-cause analysis |
| `/claude-exec` | Explicit work execution by Claude |
| `/claude-resume` | Continue an existing Claude thread |
| `/claude-config` | Check installation and configuration |

Install it: [github.com/Kedhareswer/claude-skill](https://github.com/Kedhareswer/claude-skill)

---

## Repo

```
codex-skill/
├── skills/codex/SKILL.md     ← the only file you need
├── demo.gif
├── before-after.gif
└── README.md
```

---

## Keeping it up to date

```bash
curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

Or just tell Claude: `update my codex skill`.

---

## If something feels off

This is a living skill — it evolves as Codex and Claude both do.

If the selector didn't appear, a sandbox was wrong, or Codex ran something it shouldn't have — **open an issue**. Even a one-liner is enough to go on.

Ideas for how the skill should behave differently? **Open a discussion or PR**. The `SKILL.md` is just a markdown file — contributions take minutes.

And if this saved you even one terminal switch today — **please star the repo.** It genuinely helps others find it, and it motivates keeping it sharp.

---

MIT License — built by [Kedhareswer](https://github.com/Kedhareswer)

> Two great tools. One conversation. Go ship something.
