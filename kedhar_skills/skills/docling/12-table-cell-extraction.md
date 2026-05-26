# Table Cell Extraction

## How It Works

Docling's table extraction is a two-stage process:

1. **Layout Detection** — The Heron model detects TABLE regions on the page (bounding box for the whole table)
2. **TableFormer** — Analyzes each table region to extract the internal grid structure: rows, columns, spanning cells, headers

With `do_cell_matching=True`, each recognized cell is mapped back to the PDF's native text (not OCR/model-predicted text), producing higher quality results.

## Cell Data Model

Each cell from Docling provides:

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Cell text content |
| `bbox` | BoundingBox | Pixel coordinates (TOPLEFT origin) |
| `col_span` | int | Number of columns this cell spans |
| `row_span` | int | Number of rows this cell spans |
| `column_header` | bool | Whether this cell is a column header |
| `row_header` | bool | Whether this cell is a row header |
| `row_section` | bool | Whether this cell is a section divider row |
| `start_row_offset_idx` | int | Starting row index of the cell |
| `start_col_offset_idx` | int | Starting column index of the cell |
| `end_row_offset_idx` | int | Ending row index of the cell |
| `end_col_offset_idx` | int | Ending column index of the cell |

## Coordinate Systems — Critical Detail

Docling uses **two different coordinate origins** depending on the element:

| Element Type | Origin | How `t` and `b` Work |
|-------------|--------|---------------------|
| Page-level text, tables | **BOTTOMLEFT** | `t` = distance from bottom (higher = higher on page) |
| Table cells | **TOPLEFT** | `t` = distance from top (higher = lower on page) |

### Conversion to Screen Coordinates

**BOTTOMLEFT** (text, tables):
```
screen_top = (page_height - bbox.t) * scale
screen_height = (bbox.t - bbox.b) * scale
```

**TOPLEFT** (cells):
```
screen_top = bbox.t * scale
screen_height = (bbox.b - bbox.t) * scale
```

Both use:
```
screen_left = bbox.l * scale
screen_width = (bbox.r - bbox.l) * scale
```

## Spanning Cell Deduplication — Key Finding

### The Problem

Docling's grid stores cells in a `[num_rows][num_cols]` matrix. When a cell spans multiple columns (e.g., `col_span=12`), it appears in **every column position** it covers — same text, same bbox, repeated 12 times.

Example: "FORM ADV PART 2A APPENDIX 1" with `col_span=12`:
- Before dedup: 12 entries (row 0, col 0 through col 11) — all identical
- After dedup: 1 entry (row 0, col 0, col_span=12)

### The Fix

We use Docling's `start_row_offset_idx` and `start_col_offset_idx` to identify the **origin cell** of each span:

```python
start_r = getattr(cell, "start_row_offset_idx", row_idx)
start_c = getattr(cell, "start_col_offset_idx", col_idx)
is_span_origin = (row_idx == start_r and col_idx == start_c)
```

Only span-origin cells are emitted to the page index. The full grid is preserved in `tables[].grid` for rendering.

### Impact

| Table | Before Dedup | After Dedup | Reduction |
|-------|-------------|-------------|-----------|
| Table 0 (cover page, 12-col) | 372 cells | 31 cells | 92% |
| Table 2 (data table, 5-col) | ~25 cells | 21 cells | 16% |

Tables with many spanning rows/columns see the largest reduction.

## Example Output

### Unique cell (no span):
```json
{
  "type": "cell",
  "table_index": 2,
  "text": "Yes",
  "row": 2,
  "col": 1,
  "col_span": 1,
  "row_span": 1,
  "column_header": false,
  "bbox": { "l": 416.88, "t": 487.22, "r": 449.31, "b": 495.78 },
  "bbox_origin": "CoordOrigin.TOPLEFT"
}
```

### Spanning cell (origin only):
```json
{
  "type": "cell",
  "table_index": 2,
  "text": "Available Investments",
  "row": 0,
  "col": 1,
  "col_span": 4,
  "row_span": 1,
  "column_header": true,
  "bbox": { "l": 416.88, "t": 440.62, "r": 500.85, "b": 449.18 },
  "bbox_origin": "CoordOrigin.TOPLEFT"
}
```
