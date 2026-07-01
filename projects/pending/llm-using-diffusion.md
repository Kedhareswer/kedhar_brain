# LLM using Diffusion

**Score:** 5/5 · **Owner:** Kedhareswer Naidu

## Approach
Not Feasible

## Methodology
Not Feasible

## Challenges
Not Feasible

## Desired Outcome
Not Feasible

## 🔬 Research & Enrichment

### Overview
"LLM using Diffusion" is a project idea to build a language model that generates text via *diffusion* (iterative denoising / masked-token recovery) rather than the standard autoregressive, left-to-right, one-token-at-a-time approach. Diffusion Language Models (DLMs) corrupt clean text (typically by masking tokens) in a forward process, then train a Transformer to reverse that corruption, optimizing a likelihood lower bound. The project's current markdown marks this "Not Feasible," but as of 2025-2026 this is demonstrably feasible: open 7-8B models (LLaDA, Dream 7B) match LLaMA3-8B, and commercial systems (Inception's Mercury, Google's Gemini Diffusion) ship at production scale.

### Why it matters
Autoregressive decoding is inherently sequential, which caps latency and struggles with global planning and the "reversal curse." DLMs generate/refine tokens in parallel with bidirectional context, enabling far higher throughput (Mercury Coder reports ~1,100 tok/s on H100; Gemini Diffusion ~1,479 tok/s) and natural controllability for constraint-satisfaction, infilling, and planning tasks. This makes them attractive for latency-sensitive applications like code completion and real-time inference.

### How it works / Recommended approach
A realistic build plan: (1) Start by *adapting* an existing autoregressive model rather than pre-training from scratch — e.g. follow DiffuLLaMA-style conversion or fine-tune from LLaDA-8B-Base. (2) Use a **masked (absorbing-state) discrete diffusion** objective (MDLM/RADD style): randomly mask a variable fraction of tokens and train the Transformer to predict them; this is simpler and more stable than continuous-embedding diffusion. (3) Use a bidirectional Transformer (no causal mask). (4) Sample by iterative denoising with confidence-based or semi-autoregressive **block diffusion** decoding to trade quality vs. steps. (5) SFT for instruction-following. Prototype small (e.g. 100-350M) on a single GPU before scaling.

### State of the art & comparable work
- **LLaDA** — 8B masked diffusion LM, rivals LLaMA3-8B: https://arxiv.org/abs/2502.09992 (code: https://github.com/ML-GSAI/LLaDA)
- **Dream 7B** (HKU NLP × Huawei Noah's Ark) — strong open DLM: https://hkunlp.github.io/blog/2025/dream/
- **Mercury** (Inception Labs) — first commercial-scale diffusion LLM: https://arxiv.org/abs/2506.17298
- **Gemini Diffusion** (Google DeepMind): https://deepmind.google/models/gemini-diffusion/
- Foundational: D3PM, SEDD, MDLM, Block Diffusion — surveyed in https://github.com/VILA-Lab/Awesome-DLMs

### Tech stack
PyTorch; HuggingFace Transformers + Accelerate; bidirectional Transformer backbone; absorbing/masked discrete diffusion objective; lm-evaluation-harness for benchmarks; Gradio for demos; LLaDA-8B-Base or a small LLaMA as a starting checkpoint; multi-GPU (DeepSpeed/FSDP) if pre-training.

### Key challenges & risks
- Inference is often *slower per-quality* than AR unless parallel decoding is well-tuned (steps ≈ sequence length for best quality).
- Pre-training from scratch is data- and compute-heavy (LLaDA used ~2.3T tokens); adaptation is far cheaper.
- Fixed/limited context length and KV-cache incompatibility complicate long-context use.
- Optimal token-unmasking order and reasoning/planning quality are open research problems.
- Diffusion-specific safety/jailbreak surfaces are under-studied.

### Suggested next steps
- Re-classify from "Not Feasible": run LLaDA-8B-Instruct inference locally via the official repo to validate the paradigm.
- Build a minimal masked-diffusion LM (100-350M) on a small corpus to learn the training loop.
- Implement confidence-based and semi-autoregressive (block) sampling; measure quality vs. steps/latency.
- Pick a focused use case (code infilling or constrained text) where parallel/bidirectional generation wins.
- Benchmark against an AR baseline with lm-evaluation-harness; report tokens/sec and accuracy.
- Read the DLM survey to choose between MDLM, SEDD, and Block Diffusion formulations.

### References
- [LLaDA: Large Language Diffusion Models (arXiv 2502.09992)](https://arxiv.org/abs/2502.09992)
- [LLaDA official PyTorch implementation (GitHub)](https://github.com/ML-GSAI/LLaDA)
- [Dream 7B — HKU NLP Group](https://hkunlp.github.io/blog/2025/dream/)
- [Mercury: Ultra-Fast Language Models Based on Diffusion (arXiv 2506.17298)](https://arxiv.org/abs/2506.17298)
- [Gemini Diffusion — Google DeepMind](https://deepmind.google/models/gemini-diffusion/)
- [Awesome-DLMs survey repository (VILA-Lab)](https://github.com/VILA-Lab/Awesome-DLMs)

_Researched via web search · 6 sources · pending_

---
_Source: Pending Projects sheet · generated 2026-06-02 from project.xlsx_
