# Model Catalog

## Pipeline Stages Overview

The PDF pipeline consists of 6 main stages, each with pluggable models. Models are configured through preset identifiers with optional engine specification.

---

## Stage 1: Layout Detection

Detects document elements (paragraphs, tables, figures, headers, etc.) and produces bounding boxes with element labels.

| Model | Type | Engine | Notes |
|-------|------|--------|-------|
| `docling-layout-heron` | RT-DETR | Transformers / ONNXRuntime | Default — but **slowest on CPU** (see benchmark) |
| `docling-layout-egret-medium` | RT-DETR | Transformers / ONNXRuntime | Good speed, may detect extra tables |
| `docling-layout-egret-large` | RT-DETR | Transformers / ONNXRuntime | Fast, but can misidentify regions as pictures |
| `docling-layout-egret-xlarge` | RT-DETR | Transformers / ONNXRuntime | **Best accuracy/speed balance on CPU** |
| `v2` (legacy) | RT-DETR | ONNXRuntime | Legacy model |

**Output labels:** TEXT, TABLE, PICTURE, SECTION_HEADER, PAGE_HEADER, PAGE_FOOTER, FORMULA, CODE, LIST_ITEM, CAPTION, FOOTNOTE

### Layout Model Benchmark (Our Results)

Benchmarked on a 35-page Form ADV wrap fee brochure (657KB), CPU only, OCR=off, TableFormer=ACCURATE.

| Model | Time | Texts | Tables | Pics | Section Headers | Notes |
|-------|------|-------|--------|------|-----------------|-------|
| `heron` | **3.79 min** | 576 | 10 | 0 | 148 | Slowest; `std::bad_alloc` on some pages |
| `egret-medium` | **1.74 min** | 597 | **11** | 0 | 150 | Fastest; 1 extra table (possible false positive) |
| `egret-large` | **1.79 min** | 590 | 10 | **2** | 156 | Misidentified 2 regions as pictures |
| `egret-xlarge` | **2.33 min** | **605** | 10 | 0 | 155 | Most text, correct tables, no errors |

**Key findings:**
- **Heron is the slowest on CPU** despite being documented as "faster" — this may differ on GPU
- **egret-xlarge is the recommended choice** for our brochure pipeline: 1.6x faster than heron, most text extracted (605 vs 576), correct table count (10), and detected a caption others missed
- **egret-large has accuracy issues** — it only found 6 tables in one run (missed 4) and misidentified 2 regions as pictures. Not reliable for financial documents
- **egret-medium** is the fastest but detected an extra table (11 vs 10) that may be a false positive

**Configuration:**
```python
from docling.datamodel.pipeline_options import LayoutOptions
from docling.datamodel.layout_model_specs import DOCLING_LAYOUT_EGRET_XLARGE

pipeline_options = PdfPipelineOptions(
    layout_options=LayoutOptions(model_spec=DOCLING_LAYOUT_EGRET_XLARGE),
)
```

> **Note (Windows):** egret-large and egret-xlarge require downloading models manually via `huggingface_hub.snapshot_download(local_dir=...)` due to Windows symlink permission errors with the default HuggingFace cache. Use `artifacts_path` in `PdfPipelineOptions` to point to the local download directory.

---

## Stage 2: OCR (Text Recognition)

Extracts text from images and scanned document pages.

| Engine | Language Support | Notes |
|--------|-----------------|-------|
| **Auto** | Varies | Automatically selects best available engine |
| **Tesseract** | 100+ languages | Most widely available; install via system package |
| **EasyOCR** | 80+ languages | GPU-accelerated; `pip install easyocr` |
| **RapidOCR** | Multilingual | Lightweight; supports custom models |
| **SuryaOCR** | 90+ languages | Modern; supports custom models |
| **macOS Vision** | System-dependent | macOS only; uses Apple's Vision framework |

**Configuration:**
```python
from docling.datamodel.pipeline_options import PdfPipelineOptions, OcrOptions

pipeline_options = PdfPipelineOptions(
    ocr_options=OcrOptions(
        engine="tesseract",        # or "easyocr", "rapidocr", "surya", etc.
        lang=["eng", "deu"],       # Language codes
    )
)
```

---

## Stage 3: Table Structure Recognition

Recognizes table structure — rows, columns, cells, spanning cells, and header relationships.

| Model | Engine | Modes | Notes |
|-------|--------|-------|-------|
| **TableFormer** | docling-ibm-models | `FAST`, `ACCURATE` | Primary table model |

**Features:**
- `do_table_structure` — Enable/disable table recognition
- `do_cell_matching` — Map recognized structure back to PDF text cells (vs. using predicted text)
- `TableFormerMode.FAST` — Quicker processing, slightly lower accuracy
- `TableFormerMode.ACCURATE` — Higher quality, slower

```python
from docling.datamodel.pipeline_options import TableFormerMode, TableStructureOptions

pipeline_options = PdfPipelineOptions(
    do_table_structure=True,
    do_cell_matching=True,
    table_structure_options=TableStructureOptions(
        mode=TableFormerMode.ACCURATE
    ),
)
```

---

## Stage 4: Picture Classification

Classifies detected images into categories.

| Model | Engine | Notes |
|-------|--------|-------|
| **DocumentFigureClassifier-v2.0** | Transformers (ViT) | Vision Transformer-based |

**Categories:** Chart, Diagram, Natural Image, Logo, Signature, Map, Screenshot, etc.

---

## Stage 5: VLM Convert (Full Page)

Vision Language Models that can process entire pages for document understanding. This is an **alternative** to the standard multi-stage pipeline — it uses a single model for full-page conversion.

| Model | Size | Output Format | Engine Options |
|-------|------|--------------|----------------|
| **Granite-Docling-258M** | 258M | DocTags | Transformers, MLX, API |
| **SmolDocling-256M** | 256M | DocTags | Transformers, MLX |
| **DeepSeek-OCR-3B** | 3B | Markdown | Transformers, vLLM |
| **Phi-4-Multimodal** | Large | Markdown | Transformers, vLLM |

**Output formats:**
- **DocTags** — Structured markup preserving layout semantics (recommended)
- **Markdown** — Human-readable but less structured

---

## Stage 6: Picture Description & Code/Formula

### Picture Description Models

Generate natural language descriptions of detected images.

| Model | Size | Engine |
|-------|------|--------|
| **SmolVLM-256M** | 256M | Transformers |
| **Granite-Vision-3.3-2B** | 2B | Transformers, API |
| **Pixtral-12B** | 12B | API |

### Code & Formula Models

Extract code blocks and mathematical formulas from document regions.

| Model | Engine | Notes |
|-------|--------|-------|
| **CodeFormulaV2** | docling-ibm-models | Dedicated code/formula extractor |
| **Granite-Docling-258M** | Transformers | Can also handle code/formula enrichment |

---

## Model Configuration Pattern

Models are configured through `PdfPipelineOptions` and format options:

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.datamodel.base_models import InputFormat

pipeline_options = PdfPipelineOptions(
    # Configure specific stages...
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)
```

## Model Download & Caching

```bash
# Prefetch all models for offline use
docling-tools models download

# Or programmatically
from docling.utils.model_downloader import download_models
download_models()
```

**Cache location control:**
```python
pipeline_options = PdfPipelineOptions(
    artifacts_path="/local/path/to/models"
)
```

Or via environment variable:
```bash
export DOCLING_ARTIFACTS_PATH="/local/path/to/models"
```
