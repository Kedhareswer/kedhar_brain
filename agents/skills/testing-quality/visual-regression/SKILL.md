---
name: visual-regression
description: Measure what actually changed between two screenshots of a page, using content-masked SSIM. Fires when the user makes a CSS/layout/theme change and wants to know whether anything else moved, when verifying a refactor was visually neutral, when reviewing UI work before committing, or when asking "did I break anything" / "does this look the same" / "compare before and after". Produces a number and the coordinates of the biggest differences, instead of eyeballing two screenshots side by side.
---

# Visual regression by measurement

Eyeballing two screenshots catches big breakage and misses everything else — a 4px shift, a
line-height change three sections down, a hover state that stopped working. This skill replaces
that with a number.

## The one thing to understand

The script reports two scores. **Read the content-masked one.**

Full-frame SSIM compares every pixel including empty background. On a real page — mostly flat
background, dark or light — that score is dominated by agreeing about empty space, so it sits
near 1.0 even when something real broke. Two completely different pages still score ~0.55.

Content-masked SSIM only scores 8×8 windows that contain something (local std-dev > 6). Those
same two pages score 0.08. That is the honest number.

## Workflow

1. **Capture "before"** — screenshot the page *before* touching anything. Use whatever browser
   tooling is available (Playwright, the built-in browser/preview tools, headless Chrome). Save
   as PNG.
2. **Make the change.**
3. **Capture "after"** — same URL, same viewport, same scroll position, same theme.
4. **Compare:**

```bash
node scripts/ssim.mjs before.png after.png
```

Both captures must be the same pixel size — the script refuses mismatched dimensions rather than
scaling and reporting a meaningless score.

## Reading the result

| content-masked SSIM | Means |
|---|---|
| `1.0000` | Byte-identical rendering. A refactor that was meant to be visually neutral, verified. |
| `0.98 – 0.999` | Sub-pixel / antialiasing noise, or one small element moved. Check the coordinates. |
| `0.90 – 0.98` | A real, localized change. Expected if you edited that area — investigate if you didn't. |
| `< 0.90` | Something substantial moved. If you only meant to change one colour, you did not. |

The `biggest differences` list gives `x, y` of the worst windows. Go look at those coordinates in
the after-screenshot — that is where to start, and it is usually not where you expected.

**This measures how much changed, not whether the change is good.** A beautiful intentional
redesign scores terribly. The number answers "did anything move that I did not mean to move".

## Flags

```bash
node scripts/ssim.mjs a.png b.png --threshold 0.98   # exits 1 below this (default 0.95) — for CI
node scripts/ssim.mjs a.png b.png --json             # machine-readable, for chaining
node scripts/ssim.mjs --selftest                     # verifies the PNG decoder and SSIM maths
```

Exit code is 0 on pass, 1 on fail, 2 on bad input. Zero dependencies — Node stdlib only.

## Traps that produce false positives

- **Animations and transitions.** Capture after they settle, or disable them:
  `document.querySelectorAll('*').forEach(e => e.style.transition = 'none')`.
- **Webfonts still loading.** Wait for `document.fonts.ready` before capturing, or the "before"
  shot has fallback metrics and everything shifts.
- **Carousels, clocks, random content, `Date.now()` in the UI.** Freeze or stub them first.
- **Scroll position drift.** Scroll to a known offset explicitly; don't trust the default.
- **Different device pixel ratio** between captures — pin the viewport for both.

If a comparison scores badly and the diff coordinates all sit on one of these, it's noise. Fix
the capture, not the CSS.

## When not to use it

Comparing two *intentionally* different designs. The score will be low and it tells you nothing
useful — that is a design review, not a regression check.
