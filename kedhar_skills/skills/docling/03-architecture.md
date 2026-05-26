# Architecture

## Overview

Docling uses a modular pipeline architecture where each document type routes through format-specific backends and processing stages. The design enables extensibility — backends, pipelines, and models can be swapped or subclassed.

## Core Components

### 1. Document Converter

The central orchestrator and primary entry point. It:

- Maintains a mapping of document formats → backends + pipelines
- Accepts file paths, URLs, or binary streams as input
- Coordinates the full conversion flow
- Returns a `ConversionResult` containing the `DoclingDocument`

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")
doc = result.document
```

### 2. Format-Specific Backends

Dedicated parsers for each supported input format. Each backend handles the raw format parsing:

| Backend | Handles |
|---------|---------|
| PDF Backend | PDF parsing, page rasterization |
| DOCX Backend | Word document XML extraction |
| PPTX Backend | PowerPoint slide parsing |
| XLSX Backend | Excel spreadsheet parsing |
| HTML Backend | Web page DOM parsing |
| Markdown Backend | Markdown AST parsing |
| Image Backend | Direct image loading |
| Audio Backend | Audio transcription (ASR) |

### 3. Pipelines

Configurable execution chains that orchestrate ML model stages. The pipeline determines which models run and in what order.

**Standard PDF Pipeline stages:**
1. Layout Detection
2. OCR (if needed)
3. Table Structure Recognition
4. Picture Classification
5. Code/Formula Recognition
6. Picture Description

**VLM Pipeline (alternative):**
Uses a single Vision Language Model for full-page understanding instead of the multi-stage approach.

## Processing Flow

```
Input Document
      │
      ▼
┌─────────────────┐
│ Document        │
│ Converter       │  ← Entry point
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Format          │
│ Recognition     │  ← Identifies input type
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend         │
│ (format-specific│  ← Parses raw document
│  parser)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pipeline        │
│ (ML model       │  ← Runs detection/recognition stages
│  stages)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DoclingDocument  │  ← Unified representation
└────────┬────────┘
         │
    ┌────┼────┬────────┐
    ▼    ▼    ▼        ▼
  Export Chunk Serialize  Enrich
```

## DoclingDocument

The unified intermediate representation that all formats convert into. It contains:

- **Text elements** — Paragraphs, headers, footers, list items
- **Tables** — Structured with rows, columns, cells, and headers
- **Pictures** — Classified images with optional captions/descriptions
- **Formulas** — Mathematical expressions (LaTeX)
- **Code blocks** — With language classification
- **Reading order** — Sequential ordering of all elements
- **Bounding boxes** — Spatial coordinates per element per page
- **Metadata** — Page numbers, element types, hierarchy

## Post-Conversion Operations

From a `DoclingDocument`, you can:

| Operation | Description |
|-----------|-------------|
| `export_to_markdown()` | Render as Markdown text |
| `export_to_html()` | Render as HTML |
| `export_to_dict()` | Lossless JSON serialization |
| `export_to_text()` | Plain text extraction |
| `export_to_doctags()` | Structured DocTags markup |
| Chunking | Segment into chunks for RAG/embeddings |
| Serialization | Save/load DoclingDocument objects |

## Extensibility

The architecture uses inheritance-based extensibility:

- **Custom backends** — Subclass the base backend for new format support
- **Custom pipelines** — Create pipelines with different model combinations
- **Custom enrichments** — Add post-processing steps (PII detection, translation, etc.)
- **Custom chunkers** — Implement `BaseChunker` for specialized segmentation
