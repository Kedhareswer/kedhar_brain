# Chunking

## Overview

Docling provides native chunking strategies that operate directly on `DoclingDocument` objects. This is superior to the common approach of exporting to Markdown and splitting with generic text splitters, because Docling's chunkers understand document structure (headers, tables, captions, hierarchy).

A **chunker** accepts a `DoclingDocument` and returns a stream of chunks, each with associated metadata.

## Chunker Hierarchy

All chunkers inherit from `BaseChunker`, which defines:

```python
class BaseChunker:
    def chunk(self, dl_doc: DoclingDocument, **kwargs) -> Iterator[BaseChunk]:
        """Produces document chunks."""
        ...

    def contextualize(self, chunk: BaseChunk) -> str:
        """Returns metadata-enriched serialization for embedding models."""
        ...
```

The `contextualize()` method is key — it prepends relevant headers, captions, and structural context to the chunk text, producing a better representation for embedding models.

---

## Chunking Strategies

### 1. HybridChunker (Recommended for RAG)

Combines tokenization-aware refinement with hierarchical document structure. Best general-purpose chunker.

**How it works:**
1. Starts with hierarchical document chunks
2. Splits oversized chunks based on token count
3. Merges undersized successive chunks that share the same headers/captions

**Key parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `tokenizer` | required | Tokenizer name or instance (align to your embedding model) |
| `max_tokens` | 512 | Maximum tokens per chunk |
| `merge_peers` | `True` | Merge small adjacent chunks sharing headers/captions |
| `repeat_table_header` | `True` | Repeat table headers when tables span multiple chunks |
| `omit_header_on_overflow` | `False` | Omit headers for rows that overflow with headers but fit without |

```python
from docling.chunking import HybridChunker

chunker = HybridChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=512,
    merge_peers=True,
)

result = converter.convert("document.pdf")
chunks = list(chunker.chunk(result.document))

for chunk in chunks:
    # Raw chunk text
    print(chunk.text)

    # Metadata-enriched text (better for embeddings)
    enriched = chunker.contextualize(chunk)
    print(enriched)
```

---

### 2. HierarchicalChunker

Creates one chunk per document element, preserving the document's natural structure. Simplest approach.

**How it works:**
- Each document element (paragraph, table, image, etc.) becomes one chunk
- Metadata (headers, captions) is attached to each chunk
- List items are merged by default

**Key parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `merge_list_items` | `True` | Combine consecutive list items into a single chunk |

```python
from docling.chunking import HierarchicalChunker

chunker = HierarchicalChunker(merge_list_items=True)
chunks = list(chunker.chunk(result.document))
```

---

### 3. LineBasedTokenChunker

Preserves line boundaries within chunks. Ideal for structured content like tables, code blocks, logs, and lists.

**How it works:**
- Splits on line boundaries (never breaks mid-line)
- Supports repeated prefixes per chunk (e.g., table headers)
- Token-aware sizing

**Key parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `tokenizer` | required | Tokenizer name or instance |
| `max_tokens` | 512 | Maximum tokens per chunk |
| `omit_prefix_on_overflow` | `False` | Drop prefix if a single line + prefix exceeds max_tokens |

```python
from docling.chunking import LineBasedTokenChunker

chunker = LineBasedTokenChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=512,
)
chunks = list(chunker.chunk(result.document))
```

---

## Installation

```bash
# For HuggingFace tokenizers (sentence-transformers, etc.)
pip install 'docling-core[chunking]'

# For OpenAI tiktoken tokenizers
pip install 'docling-core[chunking-openai]'
```

---

## Integration with RAG Frameworks

All chunkers implement the `BaseChunker` interface, making them compatible with:

- **LangChain** — Use as a custom document splitter
- **LlamaIndex** — Use as a custom node parser
- **Haystack** — Use as a pipeline component

### Example: Chunking for Vector Store Ingestion

```python
from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker

# Convert document
converter = DocumentConverter()
result = converter.convert("report.pdf")

# Chunk with embedding-model-aligned tokenizer
chunker = HybridChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=256,
)

chunks = list(chunker.chunk(result.document))

# Prepare for vector store
documents = []
for chunk in chunks:
    documents.append({
        "text": chunker.contextualize(chunk),  # enriched with headers/context
        "metadata": {
            "source": "report.pdf",
            # chunk metadata is also available
        }
    })

# Feed `documents` into your vector store / embedding pipeline
```

---

## Choosing a Chunker

| Chunker | Best For | Preserves Structure | Token-Aware |
|---------|----------|-------------------|-------------|
| **HybridChunker** | General RAG, mixed content | Yes (merges/splits intelligently) | Yes |
| **HierarchicalChunker** | Simple use cases, element-level granularity | Yes (1:1 element mapping) | No |
| **LineBasedTokenChunker** | Tables, code, logs, structured text | Yes (line boundaries) | Yes |
