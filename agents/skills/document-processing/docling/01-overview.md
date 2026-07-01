# Docling Overview

## What is Docling?

Docling is an open-source Python library that converts unstructured documents into structured, machine-readable data. It simplifies downstream document processing and AI workflows by detecting tables, formulas, reading order, and performing optical character recognition.

## Purpose

- Transform messy, unstructured documents into organized data
- Power RAG (Retrieval-Augmented Generation) applications
- Enable agentic AI workflows with structured document understanding
- Provide a unified document representation across all input formats

## Access Options

| Interface | Description |
|-----------|-------------|
| **Python Library** | `pip install docling` — core programmatic access |
| **CLI Tool** | `docling` command for terminal-based conversion |
| **Docling Serve** | Deployable API server for production environments |
| **Docling MCP** | Model Context Protocol agent integration for AI tools |

## Quick Start

```bash
pip install docling
```

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")

# Export to Markdown
markdown = result.document.export_to_markdown()

# Export to JSON (lossless)
json_data = result.document.export_to_dict()
```

## Key Characteristics

- **Local execution** — Runs entirely on your machine; suitable for sensitive and air-gapped environments
- **Modular pipeline** — Each processing stage (layout, OCR, table recognition, etc.) is independently configurable
- **Unified representation** — All input formats convert to a single `DoclingDocument` object
- **Format agnostic** — Supports PDF, DOCX, PPTX, XLSX, HTML, images, audio, and more
- **AI-ready output** — Export to Markdown, JSON, HTML, DocTags, or chunk directly for embeddings

## Core Capabilities

- Table structure detection (rows, columns, multi-level headers)
- Mathematical formula recognition (LaTeX conversion)
- Image classification and caption generation
- Reading order preservation across complex layouts
- Bounding box detection on all page elements
- Header/footer identification
- Code block detection with language classification
- Paragraph concatenation across page breaks
- PII detection and obfuscation
- Document translation
- Structured information extraction (beta)

## Upcoming Features

- Metadata extraction (title, authors, references, language)
- Chart understanding
- Chemistry structure recognition
