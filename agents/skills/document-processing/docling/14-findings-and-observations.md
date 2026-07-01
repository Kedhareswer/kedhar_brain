# Findings and Observations

## Key Findings from Our Implementation

### 1. All Core Features Are Automatic — No Special Setup

Every highlighted Docling feature works out of the box with the default pipeline:

| Feature | Setup? | How It Works |
|---------|--------|-------------|
| Reading order | Automatic | Layout model determines it; stored in `body` tree ordering |
| Table structure | Automatic | `do_table_structure=True` by default |
| Cell matching | Automatic | `do_cell_matching=True` by default |
| List item detection | Automatic | Layout model detects `LIST_ITEM` labels |
| Header/footer exclusion | Automatic | Stored in `furniture` tree, excluded from `body` |
| Bounding boxes | Automatic | Available on all elements via provenance |

### 2. Two Different Coordinate Origins

This was the most important technical discovery. Docling uses **different coordinate systems** for different elements:

- **Page-level elements** (text, tables) use **BOTTOMLEFT** origin — `t` is distance from the bottom of the page
- **Table cells** use **TOPLEFT** origin — `t` is distance from the top of the page

Failing to account for this results in bboxes rendering in the wrong vertical position. Our frontend detects the origin via `bbox_origin` and applies the correct conversion.

### 3. Spanning Cells Create Massive Duplication

Docling's internal grid is a `[rows][cols]` matrix. A cell spanning 12 columns appears 12 times — once per column slot — with identical text and bbox. For the cover page table (Table 0) with many full-width rows, this produced **372 entries** from only **31 unique cells** (92% duplication).

**Fix:** Use `start_row_offset_idx` and `start_col_offset_idx` to identify span origins. Only emit the origin cell to the page index; carry span dimensions (`col_span`, `row_span`) for the viewer.

### 4. Table 0 Is Often Not a "Real" Table

The first table detected on many Form ADV brochures is the cover page — it's structured as a table in the PDF but contains title text, firm name, date, and address. Docling correctly identifies the grid structure, but the content is non-tabular. This is expected behavior — Docling detects the PDF structure faithfully.

### 5. DoclingDocument Has Two Trees

| Tree | Contains | Used By |
|------|----------|---------|
| `body` | Main document content in reading order | Exports, chunkers, our extraction |
| `furniture` | Page headers, footers, page numbers | Nothing (auto-excluded) |

This separation means you get clean output without manually stripping repeated headers/footers. The `iterate_items()` method only traverses `body`.

### 6. Cell BBoxes Require `do_cell_matching=True`

Cell-level bounding boxes are only available when cell matching is enabled. Without it, you get the grid structure (text, spans, headers) but no spatial coordinates per cell. Cell matching is enabled by default.

### 7. Export Methods Need `doc` Argument

As of Docling 2.82.0, `table.export_to_markdown()` without the `doc` argument triggers a deprecation warning. Pass `doc=doc` to silence it:

```python
table.export_to_markdown(doc=doc)
```

## Observations on Output Quality

### What Works Well

- **Reading order** is reliable even for multi-column layouts
- **Table structure** correctly identifies spanning cells, multi-level headers, and data rows
- **Header/footer exclusion** cleanly separates running headers from body content
- **Section headers** are correctly classified — useful for downstream structuring

### What to Watch For

- **Cover page "tables"** — The cover page is often detected as a large table. Not a bug, but downstream consumers should be aware.
- **OCR on scanned pages** — The default RapidOCR engine works on CPU. For scanned-heavy PDFs, processing time increases significantly.
- **Large tables spanning pages** — Tables that cross page boundaries may be split into separate table elements.

### 8. Layout Model Choice Matters More Than Expected

The default `heron` model is labeled as "faster" in Docling's docs, but on CPU it is consistently the **slowest** (3.8 min vs 1.7-2.3 min for egret models). This was verified across multiple runs.

| Model | Time | Texts | Tables | Verdict |
|-------|------|-------|--------|---------|
| heron | 3.79m | 576 | 10 | Slowest, memory errors |
| egret-medium | 1.74m | 597 | 11 | Fast but extra table |
| egret-large | 1.79m | 590 | 10 | Misclassifies regions |
| egret-xlarge | 2.33m | 605 | 10 | **Best overall** |

`egret-xlarge` extracts the most text (605 vs 576), finds the correct number of tables, and runs 1.6x faster than heron on CPU.

### 9. OCR Is On by Default — Disable for Native PDFs

Docling enables OCR (`do_ocr=True`) by default. For native-text PDFs this adds no value and occasionally triggers `std::bad_alloc` memory errors (observed on pages 21, 27, 28, 31, 32 across runs). Setting `do_ocr=False` eliminates these errors with zero text loss.

### 10. Larger Models Can Misdetect Elements

`egret-large` sometimes misidentifies table regions as pictures (found 2 pictures where others found 0) and in one run only detected 6 out of 10 tables. `egret-medium` occasionally detects an extra table (11 vs 10). These are non-deterministic — results can vary slightly between runs.

## Test Results

Tested on 35-page Form ADV wrap fee brochure (J.P. Morgan Securities LLC, 657KB):

| Metric | heron (default) | egret-xlarge (recommended) |
|--------|-----------------|---------------------------|
| Pages | 35 | 35 |
| Text elements | 576 | 605 |
| Tables detected | 10 | 10 |
| Pictures | 0 | 0 |
| Section headers | 148 | 155 |
| List items | 26 | 29 |
| Footnotes | 4 | 3 |
| Processing time (CPU) | ~3.8 min | ~2.3 min |
