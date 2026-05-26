# Kedhar_brain

Portable bundle of Claude Code customisations — every skill, plugin, and marketplace I rely on, packaged so a single clone restores my full environment on a new device.

```
Kedhar_brain/
├── kedhar_skills/      ← 252 agent skills (mirrors ~/.claude/skills/)
└── kedhar_plugins/     ← marketplaces + plugin registry (mirrors ~/.claude/plugins/)
```

Each subfolder has its own `README.md` and `install.ps1` / `install.sh`.

## Restore on a new device

```powershell
# Windows
cd <wherever you cloned Kedhar_brain>
./kedhar_skills/install.ps1
./kedhar_plugins/install.ps1
```

```bash
# macOS / Linux
cd <wherever you cloned Kedhar_brain>
./kedhar_skills/install.sh
./kedhar_plugins/install.sh
```

Then open Claude Code — it'll re-resolve the marketplaces and rebuild the plugin cache on first run.

## What's in here

### `kedhar_skills/` (252 skills)
Categorised catalog covering AI/LLM dev, RAG, ML training, Python, frontend/backend, testing, security, design, animation & motion graphics, docs, research, SEO, doc processing, and more. See [kedhar_skills/SKILLS.md](kedhar_skills/SKILLS.md).

### `kedhar_plugins/` (3 marketplaces, 2 installed plugins)
Snapshot of the three marketplaces I have added (`claude-plugins-official`, `neo-health`, `understand-anything`) plus the install registry. The reproducible 400 MB `cache/` is excluded — Claude Code rebuilds it on first launch.
