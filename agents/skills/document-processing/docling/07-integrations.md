# Integrations

## Overview

Docling integrates with major AI/ML frameworks for RAG pipelines, agentic workflows, and vector store ingestion.

---

## RAG Framework Integrations

### LangChain

```python
from docling.document_converter import DocumentConverter
from langchain_core.documents import Document

converter = DocumentConverter()
result = converter.convert("document.pdf")

# Use Docling's chunker, then feed into LangChain
from docling.chunking import HybridChunker

chunker = HybridChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
    max_tokens=512,
)

langchain_docs = []
for chunk in chunker.chunk(result.document):
    langchain_docs.append(
        Document(
            page_content=chunker.contextualize(chunk),
            metadata={"source": "document.pdf"},
        )
    )
```

### LlamaIndex

```python
from docling.document_converter import DocumentConverter
from llama_index.core import Document

converter = DocumentConverter()
result = converter.convert("document.pdf")

# Export to markdown for LlamaIndex ingestion
markdown = result.document.export_to_markdown()
documents = [Document(text=markdown, metadata={"source": "document.pdf"})]
```

### Haystack

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")

# Use with Haystack pipeline components
markdown = result.document.export_to_markdown()
```

### Crew AI

Docling can be used as a tool within Crew AI agent workflows, providing document understanding capabilities to AI agents.

---

## Vector Store Integrations

Docling works with vector stores through its chunking + export capabilities:

| Vector Store | Integration Pattern |
|-------------|-------------------|
| **Milvus** | Chunk → embed → insert via pymilvus |
| **Weaviate** | Chunk → embed → insert via weaviate-client |
| **Qdrant** | Chunk → embed → insert via qdrant-client |
| **Azure AI Search** | Chunk → embed → insert via azure-search |
| **MongoDB Atlas** | Chunk → embed → insert via pymongo |
| **OpenSearch** | Chunk → embed → insert via opensearch-py |

---

## MCP Server (Agentic AI)

Docling provides an MCP (Model Context Protocol) server for integration with AI agents and tools like Claude Code, Cursor, etc.

```bash
# Install and run Docling MCP server
pip install docling-mcp
docling-mcp serve
```

This exposes document conversion capabilities as MCP tools that AI agents can call.

---

## CLI Tool

```bash
# Basic conversion
docling input.pdf

# Specify output format
docling input.pdf --output-format markdown
docling input.pdf --output-format json
docling input.pdf --output-format html

# With custom model path
docling input.pdf --artifacts-path /path/to/models

# Batch conversion
docling *.pdf --output-dir ./output/
```

---

## Docling Serve (API Server)

Deploy Docling as a REST API for production use:

```bash
pip install docling-serve
docling-serve run
```

This starts an HTTP server that accepts document uploads and returns structured output.

---

## Data Prep Kit

IBM's Data Prep Kit includes Docling integration for large-scale document processing pipelines, enabling distributed document conversion across clusters.
