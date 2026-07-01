# Extraction Pipeline

## Overview

Our extraction pipeline (`extract.py`) uses Docling to convert PDFs into structured JSON with full bounding box data, table cell structure, and text content — with page headers/footers automatically excluded.

## Pipeline Configuration

```python
pipeline_options = PdfPipelineOptions(
    do_table_structure=True,
    table_structure_options=TableStructureOptions(
        do_cell_matching=True,
        mode=TableFormerMode.ACCURATE,
    ),
)
```

- `do_table_structure=True` — Enables TableFormer to detect rows, columns, spans, and headers
- `do_cell_matching=True` — Maps recognized structure to actual PDF text cells (higher quality than model-predicted text)
- `TableFormerMode.ACCURATE` — Best quality table recognition (slower than FAST)

## Running

```bash
python extract.py "test_files/79_293912_35_20251105_293912_34_20250911/new.pdf"
```

Output is saved to `output/<folder_name>/` with both the JSON and a copy of the source PDF:

```
output/
  79_293912_35_.../
    new.json    ← extraction output
    new.pdf     ← copy of source PDF (for the viewer)
```

## JSON Output Structure

```json
{
  "source": "path/to/file.pdf",
  "pages": {
    "1": [
      { "type": "text", "label": "section_header", "text": "...", "bbox": { "l", "t", "r", "b" } },
      { "type": "table", "index": 0, "bbox": { "l", "t", "r", "b" } },
      { "type": "cell", "table_index": 0, "row": 0, "col": 0, "text": "...",
        "col_span": 12, "row_span": 1, "column_header": false,
        "bbox": { "l", "t", "r", "b" }, "bbox_origin": "CoordOrigin.TOPLEFT" }
    ]
  },
  "texts": [ { "label", "level", "text", "provenance": [{ "page", "bbox" }] } ],
  "tables": [ { "index", "num_rows", "num_cols", "markdown", "provenance", "grid": [[cell]] } ],
  "pictures": [],
  "summary": { "total_pages", "total_text_elements", "total_tables", "total_pictures" }
}
```

### Three Layers in the Page Index

| Type | Description | BBox Origin |
|------|-------------|-------------|
| `text` | Body text elements (paragraphs, headers, lists, footnotes) | BOTTOMLEFT |
| `table` | Table bounding box (whole table region) | BOTTOMLEFT |
| `cell` | Individual table cell with row/col/span info | **TOPLEFT** |

### Text Element Labels

| Label | What It Is |
|-------|-----------|
| `section_header` | Section/chapter headings (e.g., "ITEM 4 - SERVICES") |
| `text` | Body paragraphs |
| `list_item` | Bulleted or numbered list items |
| `footnote` | Footnotes |
| `title` | Document title |
| `caption` | Figure/table captions |
| `code` | Code blocks |
| `formula` | Mathematical formulas |

### What's Excluded

Page headers and footers are automatically routed to Docling's `furniture` tree and never appear in the `body` or our output. No manual filtering needed.
