# Supported Formats

## Input Formats

### Rich Document Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | `.pdf` | Full pipeline support — layout, OCR, tables, formulas, images |
| DOCX | `.docx` | Microsoft Word 2007+ (Office Open XML) |
| PPTX | `.pptx` | Microsoft PowerPoint 2007+ (Office Open XML) |
| XLSX | `.xlsx` | Microsoft Excel 2007+ (Office Open XML) |

### Markup Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Markdown | `.md` | Standard markdown parsing |
| HTML | `.html`, `.xhtml` | Web page content extraction |
| AsciiDoc | `.adoc` | Plain-text markup for structured technical content |
| LaTeX | `.tex` | Scientific/academic document format |

### Tabular Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| CSV | `.csv` | Comma-separated values |
| XLSX | `.xlsx` | Also listed under rich documents |

### Image Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| PNG | `.png` | Lossless raster |
| JPEG | `.jpg`, `.jpeg` | Lossy raster |
| TIFF | `.tiff`, `.tif` | Multi-page support |
| BMP | `.bmp` | Bitmap |
| WEBP | `.webp` | Modern web format |

### Audio Formats

Requires the `asr` extra: `pip install 'docling[asr]'`

| Format | Extension |
|--------|-----------|
| WAV | `.wav` |
| MP3 | `.mp3` |
| M4A | `.m4a` |
| AAC | `.aac` |
| OGG | `.ogg` |
| FLAC | `.flac` |

### Video Formats

Requires the `asr` extra AND `ffmpeg` installed: `pip install 'docling[asr]'`

| Format | Extension | Notes |
|--------|-----------|-------|
| MP4 | `.mp4` | Audio extracted for transcription |
| AVI | `.avi` | Audio extracted for transcription |
| MOV | `.mov` | Audio extracted for transcription |

### Schema-Specific XML Formats

| Format | Use Case |
|--------|----------|
| USPTO XML | Patent documents |
| JATS XML | Journal articles |
| XBRL XML | Business and financial reporting |
| Docling JSON | Re-importing serialized DoclingDocument objects |

### Other

| Format | Extension | Notes |
|--------|-----------|-------|
| WebVTT | `.vtt` | Web Video Text Tracks (subtitles/captions) |
| Plain Text | `.txt` | Raw text input |

---

## Output Formats

| Format | Method | Notes |
|--------|--------|-------|
| **Markdown** | `export_to_markdown()` | Human-readable, widely compatible |
| **HTML** | `export_to_html()` | Supports image embedding or referencing |
| **JSON** | `export_to_dict()` | Lossless serialization of DoclingDocument |
| **Plain Text** | `export_to_text()` | Stripped-down text content |
| **DocTags** | `export_to_doctags()` | Structured markup for content + layout characteristics |
| **WebVTT** | `export_to_webvtt()` | Subtitle/caption format |

---

## Format-Specific Installation

```bash
# Core (PDF, DOCX, PPTX, XLSX, HTML, Markdown, CSV, images)
pip install docling

# Audio/video support
pip install 'docling[asr]'

# Chunking with HuggingFace tokenizers
pip install 'docling-core[chunking]'

# Chunking with OpenAI tiktoken
pip install 'docling-core[chunking-openai]'
```
