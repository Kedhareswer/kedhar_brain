# A website Using OSINT Tools

**Status:** BrainStroming · **Score:** 4/5 · **Owner:** Kedhareswer Naidu

**Idea:** 2025-02-10

## Description
By harnessing OSINT techniques, this project validates news stories’ authenticity and prevents misinformation. Reverse image search, metadata analysis, and domain scrutiny are employed to detect anomalies, verify sources, and identify potential manipulation. Accurate reporting is preserved, safeguarding public trust in media by systematically countering the proliferation of deceptive narratives worldwide.

## Skills & Tech
`FastAPI` · `Python` · `TensorFlow` · `Keras` · `Open-CV` · `CNN/R-CNN` · `Streamlit` · `Librosa` · `LSTM` · `HTML` · `CSS` · `JavaScript` · `KeyBERT` · `Other` · `ML` · `NLTK` · `DL`

## Approach
Collect suspicious news via OSINT analysis

## Methodology
Collect & analyze OSINT sources continuously

## Challenges
Data overload: Too much real-time information processing

## Desired Outcome
Reduce misinformation & improve accuracy

## 🔬 Research & Enrichment

### Overview
This is a brainstorming-stage concept for a web application that fuses OSINT (Open-Source Intelligence) techniques with ML/DL to assess the authenticity of news stories and curb misinformation. The intended signals span reverse image search, EXIF/metadata analysis, and domain/WHOIS scrutiny to flag anomalies, verify sources, and surface likely manipulation (including AI-generated or out-of-context media). In effect it is a multimodal verification assistant for journalists, fact-checkers, and ordinary readers. The proposed skill set (FastAPI, OpenCV, CNN/R-CNN, LSTM, KeyBERT, NLTK) maps onto image forensics, temporal/video analysis, and text/claim processing.

### Why it matters
Online misinformation erodes public trust, distorts elections, and spreads faster than manual fact-checkers can respond, a gap widened by cheap generative-AI media. Verification today is largely manual and tab-juggling; automation that triages content can multiply analyst throughput. The problem is real and current: established outlets (BBC Verify, AFP) and EU research programs invest heavily here, signaling durable demand.

### How it works / Recommended approach
Recommended architecture: a modular, agentic verification pipeline orchestrated by a FastAPI backend, mirroring the decomposed design in recent research (MIRAGE). Stages: (1) ingest a URL/image/claim; (2) visual veracity — OpenCV pre-processing plus a CNN deepfake/manipulation detector; (3) provenance — reverse image search (Google Lens, Bing, TinEye, Yandex) and EXIF/metadata extraction; (4) domain trust — WHOIS, registration age, DNS, source-history checks; (5) claim grounding — KeyBERT/NLTK to extract claims, then retrieval-augmented checks against the Google Fact Check Tools (ClaimReview) API and reputable outlets; (6) a calibrated aggregator that returns a score with citation-linked rationale. Keep humans in the loop; surface evidence, not just a verdict.

### State of the art & comparable work
- MIRAGE — agentic multimodal misinformation detection with web-grounded reasoning ([arxiv.org/abs/2510.17590](https://arxiv.org/abs/2510.17590)).
- InVID & WeVerify verification plugin — the de-facto OSINT "Swiss army knife" for image/video verification ([weverify.eu](https://weverify.eu/verification-plugin/)).
- Google Fact Check Tools / ClaimReview API ([newsinitiative.withgoogle.com](https://newsinitiative.withgoogle.com/resources/trainings/verification/google-fact-check-tools/)).
- Multi-Tool LLM agent for verifiable misinformation detection ([arxiv.org/pdf/2508.03092](https://arxiv.org/pdf/2508.03092)).
- Deepfake-Eval-2024 in-the-wild benchmark ([arxiv.org/pdf/2503.02857](https://arxiv.org/pdf/2503.02857)).

### Tech stack
Recommended: Python, FastAPI (API/orchestration), OpenCV + TensorFlow/Keras CNN for image forensics, LSTM/CNN-LSTM for video temporal analysis, KeyBERT + NLTK for claim/keyword extraction, ExifTool for metadata, python-whois for domains, a reverse-image-search API (SerpAPI/Google Lens) or self-hosted, optional Streamlit/React + HTML/CSS/JS frontend, vector store for RAG evidence.

### Key challenges & risks
- LLM hallucination and fabricated citations giving false confidence ([securityium.com](https://www.securityium.com/llm-misinformation-challenges-risks-trends-solutions/)).
- Source-credibility scoring is hard; satire/opinion are easily misclassified.
- Academic detectors degrade sharply on real-world deepfakes (AUC drops ~45-50% per Deepfake-Eval-2024).
- Reverse-image and WHOIS APIs carry rate limits, cost, and ToS constraints.
- Data overload, multilingual generalization, and adversarial evasion.

### Suggested next steps
- Scope an MVP: single image-claim verification (reverse search + EXIF + ClaimReview lookup) before adding video.
- Wire FastAPI endpoints to InVID-style reverse search and the Google Fact Check API; return evidence + confidence.
- Fine-tune/evaluate a CNN detector against FakeNewsNet, Fakeddit, and Deepfake-Eval-2024.
- Add a calibrated aggregator and human-review UI; log decisions for audit.
- Build eval harness measuring F1, false-positive rate, and citation correctness.
- Address rate limits with caching and graceful degradation.

### References
- [MIRAGE: Agentic Framework for Multimodal Misinformation Detection](https://arxiv.org/abs/2510.17590)
- [Toward Verifiable Misinformation Detection: A Multi-Tool LLM Agent Framework](https://arxiv.org/pdf/2508.03092)
- [Deepfake-Eval-2024 benchmark](https://arxiv.org/pdf/2503.02857)
- [InVID & WeVerify verification plugin](https://weverify.eu/verification-plugin/)
- [Google Fact Check Tools (ClaimReview)](https://newsinitiative.withgoogle.com/resources/trainings/verification/google-fact-check-tools/)
- [r/Fakeddit multimodal benchmark dataset](https://ar5iv.labs.arxiv.org/html/1911.03854)
- [LIAR benchmark dataset](https://arxiv.org/pdf/1705.00648)
- [A Guide to Misinformation Detection Datasets](https://arxiv.org/html/2411.05060v1)
- [LLM Misinformation Challenges: Risks, Trends & Solutions](https://www.securityium.com/llm-misinformation-challenges-risks-trends-solutions/)
- [Fake News: How OSINT can help (Blackdot Solutions)](https://blackdotsolutions.com/blog/fake-news-how-osint-can-help-you-untangle-fact-from-fiction)

_Researched via web search · 10 sources · pending_

---
_Source: Pending Projects sheet · generated 2026-06-02 from project.xlsx_
