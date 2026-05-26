# kedhar_plugins

Mirror of `~/.claude/plugins/` (sans the reproducible cache) so you can clone `Kedhar_brain` on a fresh device and restore the same plugin set you have on the source machine.

## What's inside

```
kedhar_plugins/
├── marketplaces/                 # Source repos for each marketplace (no .git history)
│   ├── claude-plugins-official/
│   ├── neo-health/
│   └── understand-anything/
├── installed_plugins.json        # Registry of installed plugins (snapshot)
├── known_marketplaces.json       # Registry of known marketplaces (snapshot)
├── install.ps1                   # Windows installer
└── install.sh                    # macOS/Linux installer
```

The `cache/` folder (~400 MB of unpacked plugin versions) is intentionally excluded — it is reproduced automatically the first time Claude Code resolves the marketplaces.

## What is *not* mirrored

- Per-plugin runtime data under `~/.claude/plugins/data/` (was empty at snapshot time).
- The `cache/` folder — rebuilt by Claude Code on first use.
- `.git` history inside each marketplace repo — cuts ~21 MB and Claude Code does not need it.

## Marketplaces snapshotted

| Marketplace | Upstream repo |
| --- | --- |
| claude-plugins-official | github.com/anthropics/claude-plugins-official |
| neo-health | github.com/neohealth-org/claude-config (ref: dev) |
| understand-anything | github.com/Lum1104/Understand-Anything |

## Plugins installed (from snapshot)

- `neo-core@neo-health` v1.0.0 (project-scoped)
- `understand-anything@understand-anything` v2.7.4 (user-scoped)

## Restore on a new device

### Windows (PowerShell)
```powershell
cd <wherever you cloned Kedhar_brain>\kedhar_plugins
./install.ps1
```

### macOS / Linux
```bash
cd <wherever you cloned Kedhar_brain>/kedhar_plugins
chmod +x install.sh
./install.sh
```

The script copies `marketplaces/`, `installed_plugins.json`, and `known_marketplaces.json` into `~/.claude/plugins/` (creating it if missing).

## Important notes

- `installed_plugins.json` contains **absolute install paths from the source machine**. After restoring, run `claude plugin update --all` (or open Claude Code and let it re-resolve) so the cache is rebuilt with the correct local paths.
- The project-scoped `neo-core` plugin is tied to the original `c:\Users\mbkhn\Downloads\neo-health\neo-monorepo` directory. If that project doesn't exist on the new device, re-install the plugin from inside the new project location.
- If you want fresh marketplace history (e.g., for upstream updates), delete `~/.claude/plugins/marketplaces/<name>` and run `claude plugin marketplace add <repo>`.
