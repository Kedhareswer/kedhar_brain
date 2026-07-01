# On-Device Fine-Tuning Framework for Billion+ Parameter scale LLMs

**Type:** 💡 Idea · Problem Statement #5   ·   **Status:** Not started

## Problem Statement
Efficient framework for the on-device fine-tuning of Billion+ scale Large Language Models on a Galaxy S23-S25 equivalent smartphone/edge device. Enable a typical application to adapt a pre-trained LLM to a user's personal data, all while operating within the tight constraints of a mobile environment.

## 🔬 Research & Enrichment

### Overview
This idea proposes an efficient framework for **on-device fine-tuning of billion-parameter LLMs** on a flagship Android phone (Galaxy S23–S25 class, ~8–12GB RAM). The goal is to let an app privately adapt a pretrained LLM to a user's personal data entirely on the handset, never sending raw data to the cloud. This sits at the frontier of mobile ML: 2024–2026 research shows it is now feasible for sub-1B–1B models, but billion+ scale remains memory-bound and is an active, mostly-unsolved problem. The core challenge is that standard backprop training needs many times more memory than inference (optimizer state, activations, gradients).

### Why it matters
On-device adaptation delivers personalization with strong privacy guarantees — personal data (messages, notes, habits) never leaves the device, sidestepping cloud cost and regulatory exposure. Apple Intelligence already ships swappable LoRA adapters on-device and exposes LoRA fine-tuning to developers via its Foundation Models framework, validating the product direction. A practical training (not just inference) framework would unlock continual, user-owned model improvement on commodity phones.

### How it works / Recommended approach
Recommended architecture: a **4-bit quantized frozen backbone + low-rank LoRA/QLoRA adapters**, trained with a memory-frugal optimizer. Two viable paths emerge from the literature: (1) **first-order, memory-efficient backprop** (MeBP) — recompute/offload activations and shard inactive parameters to flash (ZeRO-style), as MobileFineTuner does in pure C++ via Android NDK; (2) **zeroth-order / forward-only** optimization (MeZO/PocketLLM) that estimates gradients from forward passes alone, eliminating activation and optimizer-state storage at the cost of ~100× more steps. For billion+ scale specifically, a **server-assisted side-tuning** hybrid (MobiLLM) keeps a frozen backbone on-device and offloads only adapter backprop to a server via quantized one-way activations — preserving data privacy while cutting device memory ~75%. Build: pick a 1B base (Gemma 3 1B / Qwen2.5), integrate a 4-bit runtime (llama.cpp/MNN/ExecuTorch), add LoRA + gradient checkpointing + paged optimizer, benchmark peak RSS and battery.

### State of the art & comparable work
- [MobileFineTuner (2025)](https://arxiv.org/html/2512.08211v1) — C++/NDK end-to-end on-device fine-tuning (GPT-2 → Gemma3-1B) on Pixel 8.
- [MeBP: Memory-Efficient Backpropagation (2025)](https://arxiv.org/pdf/2510.03425) — sub-1GB fine-tuning of 0.5B–4B models on iPhone 15 Pro Max; beats zeroth-order baselines.
- [MobiLLM (2025)](https://arxiv.org/abs/2502.20421) — server-assisted side-tuning, ~75% memory cut vs LoRA/BitFit; see also [PAE-MobiLLM](https://arxiv.org/pdf/2507.01216) and [Fed MobiLLM](https://arxiv.org/abs/2508.06765).
- [PocketLLM (2024)](https://arxiv.org/html/2407.01031v1) / [MeZO](https://arxiv.org/abs/2305.17333) — forward-only fine-tuning (OPT-1.3B in ~6.5GB on OPPO Reno6).
- [LowRA (2025)](https://arxiv.org/pdf/2502.08141) — sub-2-bit LoRA fine-tuning.

### Tech stack
C++ / Android NDK (or Kotlin JNI); 4-bit quantized runtime (llama.cpp, MLC-LLM/TVM, Alibaba MNN-LLM, or Meta ExecuTorch); LoRA/QLoRA adapters; gradient checkpointing + ZeRO-style parameter sharding to flash; paged/8-bit Adam; base models Gemma 3 1B or Qwen2.5-0.5B/1.5B.

### Key challenges & risks
- Training memory (optimizer + activations + gradients) far exceeds the ~8–12GB RAM budget at 1B+ scale.
- Thermal throttling, battery drain, and slow wall-clock convergence (acute for zeroth-order).
- Quantization-induced accuracy loss; numerical stability of low-bit gradients.
- No mature Android-native training stack (PyTorch/HF are Python-only); must build primitives in C++.
- Catastrophic forgetting and tiny, noisy personal datasets.

### Suggested next steps
- Prototype LoRA fine-tuning of Gemma3-1B / Qwen2.5-0.5B on a real S23+ via llama.cpp or MNN; measure peak RSS, tokens/s, battery.
- Implement gradient checkpointing + paged optimizer; compare first-order (MeBP-style) vs zeroth-order (MeZO) on the same task.
- Evaluate the MobiLLM server-assisted side-tuning hybrid as a fallback for true billion+ scale.
- Define a personalization benchmark (e.g., user style/email adaptation) with privacy-preserving evaluation.
- Add thermal/battery-aware scheduling and quantify accuracy vs. fp16 baseline.
- Open-source a minimal reproducible harness and dataset loader.

_Researched via web search · 9 sources · idea_

---
_Source: 'Project Ideas' sheet · generated 2026-06-02 from project.xlsx_
