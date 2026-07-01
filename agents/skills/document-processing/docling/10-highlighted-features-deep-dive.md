# Highlighted Features Deep Dive

This document covers the yellow-highlighted features from the Docling feature matrix — what they do, whether they need special setup, and how to use them from code.

---

## Summary: What Needs Setup vs. What's Automatic

| Feature | Special Setup Needed? | Notes |
|---------|----------------------|-------|
| **Reading order** | No — automatic | Built into the core pipeline; determined by layout detection |
| **Table Structure** | No — enabled by default | `do_table_structure=True` by default; can tune mode (FAST/ACCURATE) |
| **Table Cell matching** | No — enabled by default | `do_cell_matching=True` by default; can disable for predicted-text cells |
| **List item detection** | No — automatic | Layout model detects LIST_ITEM labels; grouped via `groups` in DoclingDocument |
| **Header/Footer detection** | No — automatic | Layout model detects PAGE_HEADER/PAGE_FOOTER; stored in `furniture` tree (excluded from body) |
| **Bounding boxes** | No — automatic | Available on all detected elements by default |
| **Chunks** | Requires chunker setup | Import and configure a chunker (HybridChunker, etc.) |

**Bottom line:** All the yellow-highlighted features work out of the box with the default pipeline. No special flags or configuration needed. You only configure them when you want to tune behavior.

---

## 1. Reading Order

### What It Does

Docling determines the correct sequential reading order of all document elements, even in complex multi-column, mixed-content layouts. This is critical for producing coherent Markdown/text output and meaningful chunks.

### How It Works

- The **layout detection model** (Heron/Egret) identifies all page elements and their bounding boxes
- The pipeline applies a **reading order algorithm** that sequences elements based on spatial position, column structure, and document flow
- The result is stored in the `body` tree of the `DoclingDocument` — the **order of children in the tree IS the reading order**

### Setup Required

**None — automatic.** Reading order is determined as part of the core PDF pipeline.

### How to Access

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")
doc = result.document

# The body tree already reflects reading order
# Exporting to markdown/text follows reading order automatically
markdown = doc.export_to_markdown()  # respects reading order

# Iterate elements in reading order via the body tree
for item, level in doc.iterate_items():
    print(f"Level {level}: {item.label} - {item.text[:50] if hasattr(item, 'text') else ''}")
```

### Key Points

- Reading order is embedded in the `body` tree structure (parent-child ordering)
- All export methods (`export_to_markdown()`, `export_to_text()`, `export_to_html()`) follow reading order
- All chunkers respect reading order when producing chunks
- Multi-column layouts are correctly linearized

---

## 2. Table Structure Recognition

### What It Does

Detects the internal structure of tables — rows, columns, spanning cells, multi-level headers, and cell boundaries. This goes beyond just detecting "there is a table here" (layout detection) to understanding the table's grid structure.

### How It Works

- **Layout detection** first identifies TABLE regions on the page
- **TableFormer model** then analyzes each table region to extract:
  - Row and column structure
  - Cell boundaries and spanning (rowspan/colspan)
  - Header rows vs. data rows
  - Multi-level headers

### Setup Required

**None — enabled by default.** `do_table_structure=True` is the default.

### Configuration Options

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    TableFormerMode,
    TableStructureOptions,
)
from docling.datamodel.base_models import InputFormat

pipeline_options = PdfPipelineOptions(
    # Already True by default — shown for clarity
    do_table_structure=True,

    table_structure_options=TableStructureOptions(
        # ACCURATE (default): better quality, slower
        # FAST: quicker, slightly less precise
        mode=TableFormerMode.ACCURATE,
    ),
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)
```

### How to Access Table Data

```python
result = converter.convert("document.pdf")
doc = result.document

# Iterate all tables
for table in doc.tables:
    # Export table as markdown
    print(table.export_to_markdown())

    # Export as pandas DataFrame
    df = table.export_to_dataframe()
    print(df)

    # Access raw structure
    print(f"Rows: {table.data.num_rows}")
    print(f"Cols: {table.data.num_cols}")

    # Iterate cells
    for row_idx, row in enumerate(table.data.grid):
        for col_idx, cell in enumerate(row):
            print(f"  [{row_idx},{col_idx}] = {cell.text}")
```

### When to Tune

- Use `TableFormerMode.FAST` for large batch jobs where speed matters more than perfect accuracy
- Use `TableFormerMode.ACCURATE` (default) for production quality
- If table columns are erroneously merged, try setting `do_cell_matching=False` to use predicted text cells instead of PDF text cells

---

## 3. Table Cell Matching

### What It Does

Maps the recognized table structure (from TableFormer) back to the actual PDF text cells. This produces higher quality text within each cell because it uses the PDF's native text rather than OCR/model-predicted text.

### How It Works

- After TableFormer identifies the grid structure, **cell matching** aligns each structural cell with the corresponding PDF text content
- When enabled (`True`): uses actual PDF text → higher quality
- When disabled (`False`): uses model-predicted text → useful when PDF text cells are malformed

### Setup Required

**None — enabled by default.** `do_cell_matching=True` is the default.

### Configuration

```python
pipeline_options = PdfPipelineOptions(
    do_table_structure=True,
    table_structure_options=TableStructureOptions(
        # Disable cell matching to use predicted text instead
        do_cell_matching=False,
        mode=TableFormerMode.ACCURATE,
    ),
)
```

### When to Change

- **Keep enabled (default):** For most documents — PDF native text is more accurate
- **Disable:** When you see merged or garbled table content — indicates PDF text cells don't align well with the visual table structure

---

## 4. List Item Detection & Grouping

### What It Does

Detects list items (bulleted, numbered, etc.) in the document layout and groups them together as a logical unit.

### How It Works

1. **Layout detection model** identifies elements with the `LIST_ITEM` label
2. Consecutive list items are organized into **groups** in the `DoclingDocument`
3. Groups are non-content container nodes that hold their list item children

### Setup Required

**None — automatic.** The layout model detects list items as part of standard processing.

### How to Access

```python
result = converter.convert("document.pdf")
doc = result.document

# List items appear in the body tree under group nodes
# They are automatically rendered in markdown export
markdown = doc.export_to_markdown()

# Access groups directly
for group in doc.groups:
    print(f"Group: {group.label}")
    # Children of the group are the list items
```

### Chunking Behavior

```python
from docling.chunking import HierarchicalChunker

# By default, list items within a group are MERGED into one chunk
chunker = HierarchicalChunker(merge_list_items=True)  # default

# To keep each list item as a separate chunk:
chunker = HierarchicalChunker(merge_list_items=False)
```

---

## 5. Header & Footer Detection (Page-Level)

### What It Does

Detects running page headers and page footers (e.g., page numbers, document titles repeated on every page) and separates them from the main body content. This prevents repetitive header/footer text from polluting your extracted content.

### How It Works

1. **Layout detection model** identifies elements with `PAGE_HEADER` and `PAGE_FOOTER` labels
2. These elements are stored in the `furniture` tree of DoclingDocument — **NOT** in the `body` tree
3. Export methods and chunkers operate on the `body` tree, so headers/footers are **automatically excluded** from output

### Setup Required

**None — automatic.** The layout model detects headers and footers by default.

### Document Structure

```
DoclingDocument
├── body          ← Main content (paragraphs, tables, sections, lists)
│   ├── SectionHeader: "Introduction"
│   │   ├── TextItem: "First paragraph..."
│   │   └── TableItem: ...
│   └── SectionHeader: "Methods"
│       └── TextItem: "..."
│
├── furniture     ← Headers, footers, page numbers (EXCLUDED from exports)
│   ├── PageHeader: "Company Report 2024"
│   └── PageFooter: "Page 3 of 12"
│
└── groups        ← Containers for lists, chapters
    └── ListGroup
        ├── ListItem: "First point"
        └── ListItem: "Second point"
```

### How to Access (if you need the furniture)

```python
result = converter.convert("document.pdf")
doc = result.document

# Body content (main document — excludes headers/footers)
markdown = doc.export_to_markdown()  # headers/footers already excluded

# If you NEED to access headers/footers explicitly:
# They live in the furniture tree
# Iterate the furniture tree for page headers/footers
```

### Key Points

- `body` = main content (used by exports and chunkers)
- `furniture` = page headers, footers, page numbers (excluded by default)
- `SECTION_HEADER` (e.g., "Chapter 1: Introduction") is **different** — these are part of the body, not furniture
- You get clean output without manually stripping repeated headers/footers

---

## 6. Bounding Boxes

### What It Does

Provides pixel-level spatial coordinates (x, y, width, height) for every detected element on every page. Enables visual grounding — knowing exactly where each element is located on the page.

### How It Works

- The **layout detection model** produces bounding boxes for all detected elements
- Coordinates are stored as **provenance** information on each `DocItem`
- Each item can have provenance from one or more pages (e.g., a paragraph spanning a page break)

### Setup Required

**None — automatic.** Bounding boxes are produced by the layout detection stage.

### How to Access

```python
result = converter.convert("document.pdf")
doc = result.document

# Access bounding boxes via provenance on each item
for item, level in doc.iterate_items():
    if hasattr(item, 'prov') and item.prov:
        for prov in item.prov:
            bbox = prov.bbox
            page = prov.page_no
            print(f"Element '{item.label}' on page {page}: "
                  f"({bbox.l}, {bbox.t}) to ({bbox.r}, {bbox.b})")
```

### Use Cases

- **Visual grounding for RAG** — Show users exactly where in the document an answer came from
- **Selective extraction** — Extract content from specific page regions
- **Document comparison** — Compare element positions across document versions
- **Annotation overlay** — Draw highlights or annotations on the original document

---

## 7. Chunks

### What It Does

Segments the document into "bite-sized" pieces of contiguous text, ready for ingestion by embedding models and vector stores in RAG pipelines.

### Setup Required

**Yes — you must create and configure a chunker.** Chunking is NOT automatic; it's an explicit post-conversion step.

### How to Use

```python
from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker

# Step 1: Convert document
converter = DocumentConverter()
result = converter.convert("document.pdf")

# Step 2: Create chunker (align tokenizer to your embedding model)
chunker = HybridChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=512,
    merge_peers=True,           # merge small adjacent chunks with same headers
)

# Step 3: Chunk
chunks = list(chunker.chunk(result.document))

# Step 4: Get embedding-ready text (enriched with headers/context)
for chunk in chunks:
    text_for_embedding = chunker.contextualize(chunk)
    print(text_for_embedding)
```

### Install Dependencies

```bash
# For HuggingFace tokenizers
pip install 'docling-core[chunking]'

# For OpenAI tiktoken
pip install 'docling-core[chunking-openai]'
```

### Chunking Respects All Other Features

- Follows **reading order** from the body tree
- Handles **tables** intelligently (repeats headers across chunks, respects structure)
- **Excludes** furniture (page headers/footers)
- Groups **list items** together (configurable)
- Attaches **section headers** as context metadata

---

## Layout Detection Labels (Complete List)

The layout model detects these element types:

| Label | Description | Stored In |
|-------|-------------|-----------|
| `TEXT` | Body paragraphs | `body` → `texts` |
| `TABLE` | Tables | `body` → `tables` |
| `PICTURE` | Images/figures | `body` → `pictures` |
| `SECTION_HEADER` | Section/chapter headings | `body` → `texts` |
| `PAGE_HEADER` | Running page header | `furniture` |
| `PAGE_FOOTER` | Running page footer | `furniture` |
| `FORMULA` | Mathematical formulas | `body` → `texts` |
| `CODE` | Code blocks | `body` → `texts` |
| `LIST_ITEM` | Bulleted/numbered list items | `body` → `texts` (grouped) |
| `CAPTION` | Figure/table captions | `body` → `texts` |
| `FOOTNOTE` | Footnotes | `body` → `texts` |
| `TITLE` | Document title | `body` → `texts` |

---

## Complete Working Example

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    TableFormerMode,
    TableStructureOptions,
)
from docling.datamodel.base_models import InputFormat
from docling.chunking import HybridChunker

# --- Configuration (all features work with defaults, but showing tunables) ---
pipeline_options = PdfPipelineOptions(
    do_table_structure=True,                    # default: True
    table_structure_options=TableStructureOptions(
        do_cell_matching=True,                  # default: True
        mode=TableFormerMode.ACCURATE,          # default: ACCURATE
    ),
)

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

# --- Convert ---
result = converter.convert("document.pdf")
doc = result.document

# --- Reading order: exports follow it automatically ---
markdown = doc.export_to_markdown()
print("=== MARKDOWN (reading order) ===")
print(markdown)

# --- Tables: access structured data ---
print("\n=== TABLES ===")
for i, table in enumerate(doc.tables):
    print(f"\nTable {i+1}:")
    print(table.export_to_markdown())
    # Or: df = table.export_to_dataframe()

# --- Bounding boxes: spatial info ---
print("\n=== BOUNDING BOXES ===")
for item, level in doc.iterate_items():
    if hasattr(item, 'prov') and item.prov:
        for prov in item.prov:
            print(f"  {item.label} @ page {prov.page_no}: {prov.bbox}")

# --- Chunking: for RAG ---
print("\n=== CHUNKS ===")
chunker = HybridChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=256,
)
chunks = list(chunker.chunk(doc))
for i, chunk in enumerate(chunks):
    enriched = chunker.contextualize(chunk)
    print(f"Chunk {i+1}: {enriched[:100]}...")
```
