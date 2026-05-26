---
name: docling
description: "Use when working with Docling document conversion, PDF extraction, table and cell structure, bbox overlays, chunking, model selection, or the repo's viewer and benchmark outputs."
---

# Docling

## Overview

Use this skill for Docling document conversion and extraction work in this repository. The repo is the source of truth for the pipeline example, model notes, extraction output format, and viewer behavior.

## Core Defaults

- Native PDFs: `do_ocr=False`
- Brochure-style tables: `do_table_structure=True`, `do_cell_matching=True`, `TableFormerMode.ACCURATE`
- CPU layout model: prefer `egret-xlarge` when available
- Chunking for RAG: use `HybridChunker` and `contextualize()`
- Viewer overlays: respect `bbox_origin` (`BOTTOMLEFT` for page-level items, `TOPLEFT` for table cells)
- Spanning cells: emit only the span origin via `start_row_offset_idx` and `start_col_offset_idx`

## Pipeline Pattern

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    TableFormerMode,
    TableStructureOptions,
)
from docling.datamodel.base_models import InputFormat

pipeline_options = PdfPipelineOptions(
    do_ocr=False,
    do_table_structure=True,
    do_cell_matching=True,
    table_structure_options=TableStructureOptions(
        mode=TableFormerMode.ACCURATE,
    ),
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("document.pdf")
doc = result.document
```

## Repo References

- [Overview](docs/01-overview.md)
- [Architecture](docs/03-architecture.md)
- [Model Catalog](docs/04-model-catalog.md)
- [Advanced Options](docs/05-advanced-options.md)
- [Chunking](docs/06-chunking.md)
- [Integrations](docs/07-integrations.md)
- [Examples](docs/08-examples.md)
- [Features](docs/09-features.md)
- [Highlighted Features Deep Dive](docs/10-highlighted-features-deep-dive.md)
- [Extraction Pipeline](docs/11-extraction-pipeline.md)
- [Table Cell Extraction](docs/12-table-cell-extraction.md)
- [Frontend Viewer](docs/13-frontend-viewer.md)
- [Findings and Observations](docs/14-findings-and-observations.md)
- [Optimization Results](docs/15-optimization.md)

## Common Mistakes

- Leaving OCR on for native-text PDFs.
- Using FAST table mode for brochure-style tables.
- Drawing table cells with page-level coordinate math.
- Emitting every repeated span cell instead of only the span origin.
- Treating page furniture as body content.
- Breaking the `output/<folder>/new.json` + `new.pdf` contract that the viewer expects.

