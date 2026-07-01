# PDFChatBot

**Status:** Done - Deployed · **Score:** 3/5

**Idea:** 2024-12-24   **Started:** 2025-01-02   **Completed:** 2025-01-17

## Description
A browser-based chatbot that processes PDF documents, answers questions, and provides summaries/keywords.

## Skills & Tech
`HTML` · `CSS` · `JavaScript` · `HuggingFace` · `FAISS` · `KeyBERT` · `DL` · `ML`

## Approach
Preprocessing PDFs, embedding for search, QA model for answers

## Methodology
Text extraction from PDFs followed by question-answering model for responses

## Challenges
Limited understanding of context, processing large PDFs, keyword matching limitations

## Outcomes
Basic document interaction, with future plans for enhanced AI-driven capabilities

## Tags
`Web` · `AI` · `ML` · `Other`

## Links
- **GitHub:** <https://github.com/Kedhareswer/PDFChatBot>
- **Live:** <https://kedhareswer.github.io/PDFChatBot/>

## 🔬 Research & Enrichment

### Overview
PDFChatBot is a document question-answering project that lets users upload a PDF, ask questions, and get summaries plus extracted keywords. It exists in two flavors in the repo: the **deployed GitHub Pages site** (`index.html` + `main.js` + PDF.js) is a lightweight, browser-only version using keyword matching with no server, while the **Python backends** (`fun.py`, `app.py`) implement the real ML pipeline. `fun.py` is a Streamlit app built on LangChain + FAISS + HuggingFace, and `app.py` is a Flask variant that augments answers with Google search. The author frames it explicitly as a learning exercise, not final work.

### Why it matters
Knowledge workers spend large amounts of time hunting through long PDFs (papers, manuals, contracts). Letting users converse with a document collapses that search-and-read loop into direct Q&A, and is the canonical entry project for learning Retrieval-Augmented Generation (RAG) — now the dominant pattern for grounding LLMs on private documents and reducing hallucination and knowledge cut-off limitations.

### How it works / Recommended approach
The full pipeline in `fun.py`: **PyPDFLoader** ingests the PDF, then **RecursiveCharacterTextSplitter** (chunk_size=1000, overlap=200) splits it. Chunks are embedded with **sentence-transformers/all-MiniLM-L6-v2** (384-dim) and indexed in a **FAISS** vector store. On a query, FAISS retrieves similar chunks; an extractive QA pipeline (**deepset/roberta-base-squad2**) returns the answer with a confidence score. **facebook/bart-large-cnn** produces chunked summaries and **KeyBERT** extracts keywords. `app.py` is a simpler Flask path (PyPDF2 + BART + RoBERTa) that also scrapes Google results via `newspaper`. The deployed web demo, by contrast, does plain in-browser keyword matching.

### State of the art & comparable work
Modern systems replace extractive QA with generative RAG and add hybrid (dense + BM25) retrieval plus cross-encoder reranking, which can lift retrieval MRR@10 by ~27% ([Analytics Vidhya](https://www.analyticsvidhya.com/blog/2024/12/contextual-rag-systems-with-hybrid-search-and-reranking/), [ChunkRAG](https://arxiv.org/pdf/2410.19572)). Comparable tools: [PrivateGPT](https://github.com/zylon-ai/private-gpt) (offline LlamaIndex RAG), [LlamaIndex PDF QA](https://github.com/bhattbhavesh91/pdf-q-a-llamaindex-llama2), and [local Ollama+LangChain PDF chat](https://github.com/SonicWarrior1/pdfchat). A reference build is the [freeCodeCamp RAG-over-PDF guide](https://www.freecodecamp.org/news/how-to-chat-with-your-pdf-using-retrieval-augmented-generation/).

### Tech stack
Python, Streamlit (and Flask variant), LangChain, FAISS, HuggingFace Transformers, sentence-transformers (all-MiniLM-L6-v2), RoBERTa-SQuAD2, BART-large-CNN, KeyBERT, PyPDF2/PyPDFLoader; web demo: HTML/CSS/vanilla JS + PDF.js.

### Key challenges & risks
- Extractive RoBERTa-SQuAD2 only spans-out existing text — no synthesis or multi-chunk reasoning.
- Naive fixed-size chunking loses cross-chunk context and hurts retrieval ([ChunkRAG](https://arxiv.org/pdf/2410.19572)).
- The deployed demo's keyword matching has no semantic understanding (acknowledged in README).
- Heavy local models make latency/memory a concern for large PDFs; scanned PDFs need OCR.

### Suggested next steps
- Unify on the `fun.py` RAG path; retire keyword-only logic from the public demo.
- Swap extractive QA for a generative LLM (e.g. Llama 3 via Ollama, or an API) over retrieved chunks.
- Add a cross-encoder reranker and hybrid BM25 + dense retrieval.
- Add conversational memory (LangChain ConversationBufferMemory) and citations to source pages.
- Add a RAG eval harness (RAGAS) for faithfulness/answer-relevance before extending.

### References
- [freeCodeCamp: Chat with your PDF using RAG](https://www.freecodecamp.org/news/how-to-chat-with-your-pdf-using-retrieval-augmented-generation/)
- [Contextual RAG with Hybrid Search and Reranking](https://www.analyticsvidhya.com/blog/2024/12/contextual-rag-systems-with-hybrid-search-and-reranking/)
- [ChunkRAG: LLM-Chunk Filtering for RAG (arXiv)](https://arxiv.org/pdf/2410.19572)
- [sentence-transformers/all-MiniLM-L6-v2 (Hugging Face)](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [PrivateGPT (GitHub)](https://github.com/zylon-ai/private-gpt)
- [Local PDF Chat with Mistral 7B + LangChain + Ollama (GitHub)](https://github.com/SonicWarrior1/pdfchat)

_Researched via web search · 7 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
