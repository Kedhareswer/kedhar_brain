# Building the Untethered, Always-On AI Companion

**Type:** 💡 Idea · Problem Statement #2   ·   **Status:** Not started

## Problem Statement
Reimagine a smartphone that doesn't just run apps, but truly understands and assists user. An agent that sees what you see, hears what you hear, and remembers your experiences to provide contextual, real-time help, all without a constant connection to the cloud.

## 🔬 Research & Enrichment

### Overview
This idea proposes an untethered, always-on AI companion: a device (phone or wearable) that perceives the user's world through a first-person ("egocentric") camera and microphone, builds a persistent memory of their experiences, and provides contextual, real-time assistance largely on-device without depending on the cloud. It sits at the intersection of three fast-moving fields: on-device small language models (SLMs), egocentric multimodal perception, and personal long-term memory for agents. The core promise is privacy-preserving, low-latency, ambient intelligence that "remembers" for you. As of 2026, every major piece exists in research or shipping products, but integrating them into a reliable, battery-friendly always-on system remains unsolved.

### Why it matters
Cloud assistants leak sensitive audio/visual data, add latency, and fail offline. A local, memory-equipped companion keeps personal data on the device (a meaningful trust signal for health, finance, and journaling) and works anywhere. Early consumer wearables like Limitless and Brilliant Labs' Halo show real demand for "lifelogging" memory augmentation that recalls conversations and people you meet.

### How it works / Recommended approach
A concrete architecture: (1) **Sensing** — egocentric camera + always-listening mic with on-device VAD and wake-word gating to control power. (2) **Perception** — a multimodal SLM (e.g., Gemma 3n E2B/E4B, which accepts text, image, and audio and runs in ~2 GB RAM) for captioning, ASR, and intent. (3) **Memory** — an on-device RAG/episodic store: embed events with local embeddings (e.g., FastEmbed), index in a mobile vector DB, and layer a fact/episodic memory (Mem0-style) keyed by time, place, and entity. (4) **Reasoning/Agent** — retrieve relevant memories, inject into the SLM context, and act via tools. (5) **Hybrid offload** — Apple-Intelligence-style routing: handle routine inference locally, optionally escalate hard queries to a private cloud with explicit consent.

### State of the art & comparable work
- [Gemma 3n / Google AI Edge LLM Inference](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/android) — multimodal on-device inference (now migrating to LiteRT-LM).
- [Meta Ego-Exo4D + Project Aria](https://ai.meta.com/blog/ego-exo4d-video-learning-perception/) — foundational egocentric datasets and research glasses.
- [TeleEgo benchmark (arXiv 2510.23981)](https://arxiv.org/html/2510.23981v4) — evaluates memory, understanding, and cross-memory reasoning for always-on egocentric assistants.
- [MobileRAG (arXiv 2507.01079)](https://arxiv.org/pdf/2507.01079) — fully on-device RAG optimized for latency, memory, and energy.
- [Limitless](https://www.limitless.ai/) and Brilliant Labs Halo — shipping wearable memory companions.

### Tech stack
- Inference: Gemma 3n / Gemini Nano / LiteRT-LM / MLC LLM / llama.cpp; NPU/GPU acceleration.
- Memory: on-device vector search (MobileRAG-style), Mem0/episodic memory, FastEmbed local embeddings.
- Perception: on-device ASR (Whisper-class), VAD, lightweight vision captioning.
- Platform: Android (AICore) or iOS (Foundation Models); optional private-cloud fallback.

### Key challenges & risks
- Battery/thermals: continuous capture + inference can drain ~50% battery in under 90 minutes.
- Long-context memory vs. real-time responsiveness — streaming models degrade as KV cache grows (TeleEgo finding).
- Memory retrieval accuracy, staleness, and cross-session evolution.
- Privacy, consent, and bystander recording; encrypted, deletable personal data.
- SLMs underperform GPT-class reasoning; temporal grounding is weak.

### Suggested next steps
- Prototype the perception→memory loop on a phone with Gemma 3n + a local vector store; measure latency/battery.
- Build a small egocentric eval set (or use TeleEgo) to test recall and real-time QA.
- Implement power gating (wake-word/VAD, duty-cycled capture) before adding always-on vision.
- Add a consent + encryption + deletion layer for the memory store early.
- Design a hybrid local/private-cloud router for hard queries.
- Validate one killer use case (meeting recall or "where did I leave X") end-to-end.

### References
- [Google AI Edge LLM Inference (Android)](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/android)
- [Gemini Nano | Android Developers](https://developer.android.com/ai/gemini-nano)
- [Meta Ego-Exo4D dataset](https://ai.meta.com/blog/ego-exo4d-video-learning-perception/)
- [Project Aria](https://www.projectaria.com/)
- [TeleEgo: Benchmarking Egocentric AI Assistants (arXiv)](https://arxiv.org/html/2510.23981v4)
- [MobileRAG (arXiv)](https://arxiv.org/pdf/2507.01079)
- [State of AI Agent Memory 2026 (Mem0)](https://mem0.ai/blog/state-of-ai-agent-memory-2026)
- [Limitless](https://www.limitless.ai/)

_Researched via web search · 8 sources · idea_

---
_Source: 'Project Ideas' sheet · generated 2026-06-02 from project.xlsx_
