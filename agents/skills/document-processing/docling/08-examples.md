# Examples

## Conversion Examples

### Simple Conversion

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")
print(result.document.export_to_markdown())
```

### Custom Conversion with Pipeline Options

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
        mode=TableFormerMode.ACCURATE,
    ),
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("document.pdf")
```

### Batch Conversion

```python
converter = DocumentConverter()
input_files = ["doc1.pdf", "doc2.docx", "doc3.html"]

results = converter.convert_all(input_files)
for result in results:
    print(f"--- {result.input.file} ---")
    print(result.document.export_to_markdown())
```

### Multi-Format Conversion

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()

# PDF
pdf_result = converter.convert("report.pdf")

# Word
docx_result = converter.convert("document.docx")

# PowerPoint
pptx_result = converter.convert("slides.pptx")

# Excel
xlsx_result = converter.convert("data.xlsx")

# HTML
html_result = converter.convert("page.html")

# Image
img_result = converter.convert("scan.png")
```

---

## VLM Pipeline Examples

### GraniteDocling VLM Pipeline

Use a Vision Language Model for full-page document understanding:

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import VlmPipelineOptions
from docling.datamodel.base_models import InputFormat

pipeline_options = VlmPipelineOptions(
    model="granite-docling",
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("document.pdf")
print(result.document.export_to_markdown())
```

---

## OCR Examples

### Force Full-Page OCR

Treat every page as a scanned image (useful for scanned PDFs):

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions, OcrOptions
from docling.datamodel.base_models import InputFormat

pipeline_options = PdfPipelineOptions(
    ocr_options=OcrOptions(
        engine="tesseract",
        force_full_page_ocr=True,
    )
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("scanned_document.pdf")
```

### Automatic OCR Language Detection (Tesseract)

```python
pipeline_options = PdfPipelineOptions(
    ocr_options=OcrOptions(
        engine="tesseract",
        lang=["eng", "deu", "fra"],  # Specify candidate languages
    )
)
```

---

## Export Examples

### Figure Export

```python
result = converter.convert("document.pdf")

for element in result.document.pictures:
    # Access image data, classification, bounding box
    print(f"Type: {element.classification}")
    print(f"BBox: {element.bounding_box}")
    # Save or process the image
```

### Table Export

```python
result = converter.convert("document.pdf")

for table in result.document.tables:
    # Export individual table as markdown
    print(table.export_to_markdown())

    # Or as a pandas DataFrame
    df = table.export_to_dataframe()
    print(df)
```

### Multimodal Export

```python
result = converter.convert("document.pdf")

# HTML with embedded images
html = result.document.export_to_html(image_mode="embedded")

# HTML with referenced images
html = result.document.export_to_html(image_mode="referenced")
```

---

## Chunking Examples

### Hybrid Chunking for RAG

```python
from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker

converter = DocumentConverter()
result = converter.convert("report.pdf")

chunker = HybridChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=512,
    merge_peers=True,
)

chunks = list(chunker.chunk(result.document))

for i, chunk in enumerate(chunks):
    enriched = chunker.contextualize(chunk)
    print(f"Chunk {i}: {enriched[:100]}...")
```

### Line-Based Token Chunking

```python
from docling.chunking import LineBasedTokenChunker

chunker = LineBasedTokenChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=256,
)

chunks = list(chunker.chunk(result.document))
```

---

## Binary Stream Conversion

```python
from docling.document_converter import DocumentConverter
from docling.datamodel.document import DocumentStream
from io import BytesIO

converter = DocumentConverter()

# From bytes (e.g., downloaded PDF, API response)
pdf_bytes = open("document.pdf", "rb").read()
stream = DocumentStream(name="document.pdf", stream=BytesIO(pdf_bytes))
result = converter.convert(stream)
```

---

## PII Detection and Obfuscation

```python
# Detect and mask personally identifiable information
result = converter.convert("document.pdf")
# Use enrichment pipeline to detect and obfuscate PII
# See Docling's PII example for full implementation
```

---

## Translation

```python
# Translate document content
result = converter.convert("document.pdf")
# Use enrichment pipeline for translation
# See Docling's translation example for full implementation
```

---

## Audio/Speech Recognition

```python
# Requires: pip install 'docling[asr]'
converter = DocumentConverter()
result = converter.convert("recording.mp3")
text = result.document.export_to_text()
```

---

## CSV Conversion

```python
converter = DocumentConverter()
result = converter.convert("data.csv")
markdown = result.document.export_to_markdown()
```

---

## GPU Acceleration

```python
from docling.datamodel.pipeline_options import PdfPipelineOptions, AcceleratorOptions

pipeline_options = PdfPipelineOptions(
    accelerator_options=AcceleratorOptions(
        device="cuda",       # Use GPU
        num_threads=8,
    ),
)
```

---

## Example Categories Reference

| Category | Examples Available |
|----------|------------------|
| **Conversion** | Simple, custom, batch, multi-format, CSV, custom XML, XBRL |
| **VLM** | GraniteDocling, remote model, VLM comparison |
| **OCR** | Full-page OCR, auto language detection, RapidOCR, SuryaOCR |
| **Export** | Figure export, table export, multimodal export |
| **Chunking** | Hybrid, line-based token, advanced chunking + serialization |
| **RAG** | Haystack, LangChain, LlamaIndex, visual grounding |
| **Enrichment** | Code/formula, picture annotation (local/remote VLM) |
| **Privacy** | PII detection and obfuscation |
| **GPU** | Standard pipeline, VLM pipeline, Parquet benchmark |
| **Audio** | ASR with Whisper |

For complete runnable examples, see the [official Docling examples](https://docling-project.github.io/docling/examples/).
