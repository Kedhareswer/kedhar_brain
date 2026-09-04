# GC Minimal Zine Poster

A multi-platform coding-agent skill for turning a theme, sentence, object, mood, article idea, photo, or content brief into a quiet minimal zine-style editorial poster prompt and a generated raster image.

Works with **Codex**, **Cursor**, and **Claude**.

The callable skill name is `gc-minimal-zine-poster-v0-1`.

## Visual Direction

The skill compiles each request into a sparse vertical paper poster with:

- a 3:5 aged-paper canvas
- 70%-90% negative space
- one small imageable subject or visual cluster
- serif, typewriter, or monospaced typography
- one clearly visible high-chroma color anchor
- xerox, risograph, halftone, letterpress, or scanned-paper defects
- a quiet Japanese/Korean indie-zine or minimal editorial mood

It avoids commercial advertising layouts, glossy mockups, cinematic lighting, 3D rendering, neon, dense scrapbooks, and long clean text blocks.

## Examples

| Night Door | Yellow Step |
| --- | --- |
| ![Night Door](examples/night-door.jpeg) | ![Yellow Step](examples/yellow-step.jpeg) |

| Shore Pause | Pause Map |
| --- | --- |
| ![Shore Pause](examples/shore-pause.jpeg) | ![Pause Map](examples/pause-map.jpeg) |

| Typhoon Memory | Moon Tide |
| --- | --- |
| ![Typhoon Memory](examples/typhoon-memory.jpeg) | ![Moon Tide](examples/moon-tide.jpeg) |

## Installation

Upstream repo (Codex-oriented originally):
https://github.com/LiamGvchi/gc-minimal-zine-poster

Install the same skill into every agent you use:

### Codex

```bash
git clone https://github.com/LiamGvchi/gc-minimal-zine-poster.git \
  ~/.codex/skills/gc-minimal-zine-poster-v0-1
```

Restart Codex if the skill does not appear immediately.

### Cursor

Personal skills (all projects):

```bash
git clone https://github.com/LiamGvchi/gc-minimal-zine-poster.git \
  ~/.cursor/skills/gc-minimal-zine-poster-v0-1
```

On Windows PowerShell:

```powershell
git clone https://github.com/LiamGvchi/gc-minimal-zine-poster.git `
  "$env:USERPROFILE\.cursor\skills\gc-minimal-zine-poster-v0-1"
```

Attach the skill in chat, or ask for a minimal zine poster so the agent can load it.

### Claude (Claude Code)

```bash
git clone https://github.com/LiamGvchi/gc-minimal-zine-poster.git \
  ~/.claude/skills/gc-minimal-zine-poster-v0-1
```

On Windows PowerShell:

```powershell
git clone https://github.com/LiamGvchi/gc-minimal-zine-poster.git `
  "$env:USERPROFILE\.claude\skills\gc-minimal-zine-poster-v0-1"
```

## Usage

Invoke the skill by name and provide a theme or brief:

```text
用 $gc-minimal-zine-poster-v0-1 做一张关于雨天旧书店的海报
```

```text
Use gc-minimal-zine-poster-v0-1 for a quiet poster about a rainy old bookstore
```

You can also provide a sentence, article idea, object, mood, or reference image.

## Output

For every generation request, the skill returns:

1. the generated raster poster image
2. the final image-generation prompt
3. the selected variation recipe and a short interpretation note

The workflow uses Standard Mode and generates the image by default. It only stops at prompt-only output when the user explicitly asks for that.

Image generation backends:

| Platform | How the image is made |
| --- | --- |
| Cursor | `GenerateImage` tool |
| Codex | built-in image generation |
| Claude | native image generation when available; otherwise returns the compiled prompt |

## Repository Structure

- `SKILL.md`: the complete skill instructions (platform-agnostic rules + image tool notes)
- `README.md`: overview and install paths for Codex / Cursor / Claude
- `LICENSE`: MIT license
- `examples/`: selected generated posters

## License

MIT. See `LICENSE`.

Original skill by [LiamGvchi](https://github.com/LiamGvchi/gc-minimal-zine-poster).
