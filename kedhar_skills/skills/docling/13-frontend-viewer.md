# Frontend Viewer

## Overview

A React + Vite + Tailwind frontend that renders the actual PDF with bounding box overlays, linked to a JSON tree panel for interactive exploration.

## Tech Stack

- React 18 + TypeScript
- Vite 6 (dev server on port 5174)
- Tailwind CSS 3 (dark theme)
- pdfjs-dist 3.11.174 (PDF rendering to canvas)
- lucide-react (icons)

## Running

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5174
```

## Usage

1. Click **Open Output Folder**
2. Select an `output/` subfolder (e.g., `output/79_293912_35_.../`)
3. The app auto-detects the `.json` and `.pdf` files — both load together

## Layout

```
┌──────────────────────────────────────────────────────────┐
│ Header: folder name, stats, PDF status     [Open Folder] │
├──────────────┬───────────────────────────────────────────┤
│ Document Tree│  Toolbar: page nav, zoom, layer toggle    │
│              │                                           │
│ ▼ Page 1   9│  ┌──────────────────────────────┐         │
│   ■ HEADER   │  │                              │         │
│   ■ TEXT     │  │  PDF canvas with colored     │         │
│   ■ TABLE  ▶ │  │  bbox overlays               │         │
│     ■ cell   │  │                              │         │
│     ■ hdr    │  │  Solid = text/tables         │         │
│   ■ LIST     │  │  Dashed = table cells        │         │
│ ▼ Page 2  12│  │                              │         │
│   ...        │  └──────────────────────────────┘         │
└──────────────┴───────────────────────────────────────────┘
```

## Two-Way Linking

- **Click tree node** → PDF jumps to that page, bbox glows with shadow
- **Click bbox on PDF** → tree node highlights and scrolls into view
- Table nodes are expandable — click `▶` to reveal individual cells
- Clicking a cell in the tree highlights its dashed bbox on the PDF

## Layer Toggle

The toolbar has three layer buttons:

| Layer | Shows |
|-------|-------|
| **All** | Everything — text, tables, cells |
| **Structure** | Text elements + table outlines only (no cells) |
| **Cells** | Only individual table cells |

## Color Legend

| Color | Element |
|-------|---------|
| Blue | Section headers |
| Green | Body text |
| Yellow | List items |
| Purple (solid) | Table outline |
| Purple (dashed) | Table cell |
| Pink (dashed) | Header cell |
| Gray | Footnotes |

## Coordinate Handling

The PDF viewer handles two coordinate systems:

- **BOTTOMLEFT** entries (text, tables): `screen_top = (pageHeight - bbox.t) * scale`
- **TOPLEFT** entries (cells): `screen_top = bbox.t * scale`

The `bbox_origin` field in the JSON determines which conversion is applied.

## Folder-Based Loading

The file picker uses `webkitdirectory` to select a folder. The app scans for `.json` and `.pdf` files within it — no need to pick them separately. This matches the `extract.py` output structure where JSON and PDF sit side by side in `output/<name>/`.
