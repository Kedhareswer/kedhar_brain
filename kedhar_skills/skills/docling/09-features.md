# Features

## Complete Feature List

### Document Parsing

- **Multi-format support** — PDF, DOCX, PPTX, XLSX, HTML, Markdown, AsciiDoc, LaTeX, CSV, images, audio, video, WebVTT, USPTO/JATS/XBRL XML
- **Unified representation** — All formats convert to a single `DoclingDocument` object
- **Local execution** — Runs entirely offline; suitable for sensitive and air-gapped environments

### PDF Analysis (Advanced)

- **Page layout detection** — Identifies paragraphs, tables, figures, headers, footers, formulas, code blocks, list items, captions, footnotes
- **Reading order** — Determines the correct reading sequence across complex multi-column layouts
- **Table structure recognition** — Rows, columns, spanning cells, multi-level headers (FAST and ACCURATE modes)
- **Cell matching** — Maps recognized table structure back to actual PDF text cells
- **Mathematical formula recognition** — Converts formulas to LaTeX
- **Code block detection** — With language classification
- **Image classification** — Chart, diagram, natural image, logo, signature, etc.
- **Image captioning/description** — Generate natural language descriptions of figures
- **Header/footer identification** — Separates running headers/footers from body content
- **Paragraph concatenation** — Joins paragraphs split across page breaks
- **Bounding boxes** — Spatial coordinates for every detected element

### OCR

- **Multiple engines** — Tesseract, EasyOCR, RapidOCR, SuryaOCR, macOS Vision
- **Auto engine selection** — Picks the best available engine automatically
- **Multi-language support** — 80-100+ languages depending on engine
- **Automatic language detection** — With Tesseract
- **Force full-page OCR** — Treat all pages as scanned images
- **Custom OCR models** — Supported for RapidOCR and SuryaOCR

### Vision Language Models (VLM)

- **Full-page VLM conversion** — Single-model alternative to multi-stage pipeline
- **Multiple models** — Granite-Docling-258M, SmolDocling-256M, DeepSeek-OCR-3B, Phi-4-Multimodal
- **Multiple engines** — Transformers, MLX, vLLM, API
- **DocTags output** — Structured markup preserving layout semantics
- **VLM comparison** — Tools for comparing model outputs

### Audio/Video

- **Automatic Speech Recognition** — Whisper-based transcription
- **Multi-format audio** — WAV, MP3, M4A, AAC, OGG, FLAC
- **Video audio extraction** — MP4, AVI, MOV (extracts audio track for transcription)
- **WebVTT parsing** — Subtitle/caption file support

### Export

- **Markdown** — Human-readable export
- **HTML** — With embedded or referenced images
- **JSON** — Lossless serialization of full DoclingDocument
- **Plain Text** — Stripped text content
- **DocTags** — Structured markup for content + layout
- **WebVTT** — Subtitle format
- **Application-specific XML** — USPTO patents, JATS articles, XBRL financial reports

### Chunking

- **HybridChunker** — Token-aware + structure-aware (recommended for RAG)
- **HierarchicalChunker** — One chunk per element
- **LineBasedTokenChunker** — Preserves line boundaries (tables, code)
- **Contextualization** — Metadata-enriched text for embedding models
- **Tokenizer alignment** — Match chunking to your embedding model's tokenizer

### Enrichments

- **PII detection and obfuscation** — Mask personally identifiable information
- **Translation** — Translate document content
- **Code/formula enrichment** — Enhanced extraction using GraniteDocling
- **Picture annotation** — Local or remote VLM-based image descriptions
- **Custom enrichments** — Extensible enrichment pipeline

### Integrations

- **LangChain** — Document loader / splitter
- **LlamaIndex** — Document reader / node parser
- **Haystack** — Pipeline component
- **Crew AI** — Agent tool
- **Vector stores** — Milvus, Weaviate, Qdrant, Azure AI Search, MongoDB, OpenSearch
- **MCP server** — For agentic AI applications
- **Data Prep Kit** — Large-scale distributed processing

### Deployment

- **Python library** — `pip install docling`
- **CLI tool** — `docling` command
- **Docling Serve** — REST API server
- **Docling MCP** — Model Context Protocol server
- **GPU acceleration** — CUDA, MPS support
- **Air-gapped operation** — Prefetch models, run fully offline

### Schema-Specific Parsing

- **USPTO XML** — Patent document parsing
- **JATS XML** — Journal article parsing
- **XBRL XML** — Financial/business report parsing (new)

---

## Recent Additions

- Heron layout model (new default — faster PDF parsing)
- XBRL document parsing for financial reports
- WebVTT file parsing
- LaTeX and plain-text file support
- LineBasedTokenChunker

## Upcoming Features

- Metadata extraction (title, authors, references, language)
- Chart understanding
- Chemistry structure recognition
