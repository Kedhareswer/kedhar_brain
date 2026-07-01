# Advanced Options

## Pipeline Configuration

All PDF pipeline options flow through the `PdfPipelineOptions` class, which is passed to `PdfFormatOption` and then into the `DocumentConverter`.

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    TableFormerMode,
    TableStructureOptions,
)
from docling.datamodel.base_models import InputFormat

pipeline_options = PdfPipelineOptions(
    do_table_structure=True,
    do_cell_matching=True,
    table_structure_options=TableStructureOptions(
        mode=TableFormerMode.ACCURATE,  # or TableFormerMode.FAST
    ),
    max_num_pages=100,
    max_file_size=20_000_000,  # 20 MB
    artifacts_path="/local/path/to/models",
    enable_remote_services=False,
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)
```

---

## Model Management

### Prefetching for Offline / Air-Gapped Use

Download all models ahead of time:

```bash
# CLI
docling-tools models download

# With custom path
docling-tools models download --artifacts-path /path/to/models
```

```python
# Programmatic
from docling.utils.model_downloader import download_models
download_models()
```

### Local Model Cache

Point the pipeline to a local model directory:

```python
pipeline_options = PdfPipelineOptions(
    artifacts_path="/local/path/to/models"
)
```

**Environment variable alternative:**
```bash
export DOCLING_ARTIFACTS_PATH="/local/path/to/models"
```

**CLI flag:**
```bash
docling --artifacts-path /local/path/to/models input.pdf
```

---

## Remote Services

Remote services (API-based VLMs, cloud OCR, hosted LLMs) are **disabled by default**. You must explicitly opt in:

```python
pipeline_options = PdfPipelineOptions(
    enable_remote_services=True,
)
```

Without this flag, any remote operation raises `OperationNotAllowed()`. This applies to:
- `PictureDescriptionApiOptions` for API-based vision models
- Cloud OCR engines
- Hosted LLM services

---

## Table Extraction Control

```python
pipeline_options = PdfPipelineOptions(
    # Enable/disable table structure recognition
    do_table_structure=True,

    # Cell matching: map recognized structure to PDF text cells
    # When True: uses actual PDF text (higher quality)
    # When False: uses model-predicted text
    do_cell_matching=True,

    table_structure_options=TableStructureOptions(
        mode=TableFormerMode.ACCURATE,  # Higher quality, slower
        # mode=TableFormerMode.FAST,    # Quicker, slightly lower accuracy
    ),
)
```

---

## Resource Limits

```python
pipeline_options = PdfPipelineOptions(
    max_num_pages=100,          # Skip documents exceeding this page count
    max_file_size=20_000_000,   # Skip files exceeding this size in bytes
)
```

**CPU thread control:**
```bash
export OMP_NUM_THREADS=4  # Default is 4
```

---

## Binary PDF Streams

Convert PDFs from memory (bytes) instead of file paths:

```python
from docling.datamodel.document import DocumentStream
from io import BytesIO

# From bytes
pdf_bytes = b"..."  # your PDF bytes
stream = DocumentStream(name="document.pdf", stream=BytesIO(pdf_bytes))
result = converter.convert(stream)
```

This works with the standard `converter.convert()` method — no special handling needed beyond wrapping in `DocumentStream`.

---

## OCR Configuration

```python
from docling.datamodel.pipeline_options import PdfPipelineOptions, OcrOptions

# Tesseract with specific languages
pipeline_options = PdfPipelineOptions(
    ocr_options=OcrOptions(
        engine="tesseract",
        lang=["eng", "deu", "fra"],
    )
)

# Force full-page OCR (treat every page as scanned)
pipeline_options = PdfPipelineOptions(
    ocr_options=OcrOptions(
        engine="tesseract",
        force_full_page_ocr=True,
    )
)
```

---

## Batch Conversion

Convert multiple documents in a single call:

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
input_paths = ["doc1.pdf", "doc2.pdf", "doc3.docx"]

results = converter.convert_all(input_paths)

for result in results:
    print(result.document.export_to_markdown())
```

---

## Accelerator / GPU Options

Configure hardware acceleration for model inference:

```python
from docling.datamodel.pipeline_options import AcceleratorOptions

pipeline_options = PdfPipelineOptions(
    accelerator_options=AcceleratorOptions(
        device="cuda",       # "cpu", "cuda", "mps"
        num_threads=4,
    )
)
```

---

## Full Configuration Example

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    TableFormerMode,
    TableStructureOptions,
    OcrOptions,
    AcceleratorOptions,
)
from docling.datamodel.base_models import InputFormat

pipeline_options = PdfPipelineOptions(
    # Table settings
    do_table_structure=True,
    do_cell_matching=True,
    table_structure_options=TableStructureOptions(
        mode=TableFormerMode.ACCURATE,
    ),
    # OCR settings
    ocr_options=OcrOptions(
        engine="tesseract",
        lang=["eng"],
    ),
    # Resource limits
    max_num_pages=200,
    max_file_size=50_000_000,
    # Model cache
    artifacts_path="/models/docling",
    # Remote services
    enable_remote_services=False,
    # Hardware
    accelerator_options=AcceleratorOptions(
        device="cuda",
        num_threads=8,
    ),
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("complex_document.pdf")
markdown = result.document.export_to_markdown()
```
