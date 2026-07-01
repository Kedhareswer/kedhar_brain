# Building the Next OS-Level AI Experience

**Type:** 💡 Idea · Problem Statement #1   ·   **Status:** Not started

## Problem Statement
A single, powerful multimodal foundation model can serve as an unchangeable firmware within edge/mobile operating system, enabling applications to use compact "adapters" (for varied downstream tasks – text, image, audio, video) instead of bundling several large models. Some of the architectural innovations that can be included are - firmware backbone and task-specific adapters, multi-path execution to route tasks efficiently based on complexity, demonstrating system benefits through metrics like latency and battery performance.

## 🔬 Research & Enrichment

### Overview
This idea proposes treating a single multimodal foundation model as immutable OS-level "firmware" on edge/mobile devices, with apps attaching compact task-specific adapters instead of bundling many large models. A shared backbone handles reasoning while a multi-path execution scheme routes each task to only the components it needs (embedding, backbone, generator), trading per-app model bloat for one well-optimized system service. This is exactly the paradigm formalized in the MobiCom'24 paper "Mobile Foundation Model as Firmware" (the M4 system) and now partially shipping commercially as Apple Intelligence's on-device model with swappable LoRA adapters.

### Why it matters
Mobile/edge apps today each ship their own models, fragmenting storage, memory, and NPU operator support, and bloating updates. A shared firmware backbone lets dozens of tasks reuse one cached, hardware-tuned model: M4 reported memory parity beyond ~15 tasks and a 5.1x peak-memory reduction at 50 concurrent tasks. It also shrinks the operator surface the OS/NPU must support (39 vs 156 operators), simplifying hardware co-design and improving battery and latency for always-on, private, offline AI.

### How it works / Recommended approach
Recommended architecture (mirroring M4's "N-1-M" design): (1) Multimodal embedding layer — parallel encoders (ViT for image, CLIP-style text, Whisper-style audio, lightweight transformer for IMU/sensing) projecting into a shared space; (2) Foundation backbone — a quantized LLM (M4 used INT8 LLaMA-7B; a modern build could use a 2–3B model with 2-bit QAT like Apple's) as immutable firmware; (3) Multimodal generators (text, TTS, diffusion for images). Apps attach LoRA/PEFT adapters (~0.025% of params) plus an MLP projector and task prompt. Multi-path routing activates subsets: full pipeline for VQA, backbone+generator for NLP, embedding-only for classification, single-generator for super-resolution/TTS. Layer-wise early-exit / mixture-of-depths can add complexity-adaptive compute.

### State of the art & comparable work
- [Mobile Foundation Model as Firmware (M4), MobiCom'24](https://arxiv.org/abs/2308.14363) — the direct precedent; 38 tasks/50 datasets/5 modalities.
- [Apple On-Device & Server Foundation Models + Tech Report 2025](https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025) — ~3B model, 2-bit QAT, runtime-swappable LoRA adapters; real product validation.
- [Fast On-device LLM Inference with NPUs (llm.npu, ASPLOS'25)](https://xumengwei.github.io/files/ASPLOS25-NPU.pdf) — operator scheduling across CPU/GPU/NPU.
- [Awesome Adaptive Computation (MoD, early-exit)](https://github.com/koayon/awesome-adaptive-computation) — routing/early-exit methods for the multi-path layer.

### Tech stack
- Backbone: quantized 2–3B LLM (INT4/2-bit QAT), LoRA/QLoRA adapters, PEFT.
- Encoders/generators: ViT, CLIP, Whisper, Stable Diffusion, neural TTS.
- Runtimes: [ExecuTorch](https://docs.octomil.com/blog/on-device-llm-inference-2025-2026/) (Core ML, Qualcomm QNN/Hexagon, Arm KleidiAI), MLC-LLM (TVM), llama.cpp; target Snapdragon/Apple NPUs.

### Key challenges & risks
- Generalist accuracy gap: M4 only matched specialists on ~85% of tasks; long tail regresses.
- NPU efficiency: on GPU, M4 showed up to 12x latency / 19x energy vs specialists — NPU offload and int-heavy matmul scheduling are essential.
- Adapter governance, versioning, and security (untrusted app adapters on shared firmware).
- Immutable firmware vs model staleness; OTA update path for the backbone.

### Suggested next steps
- Reproduce a minimal 2-task M4-style prototype (one vision + one NLP task) with a 2–3B INT4 backbone + LoRA on ExecuTorch.
- Benchmark on a real NPU (Snapdragon 8 Elite / Apple silicon) measuring latency, energy, and peak memory vs per-task baselines.
- Implement the 4-path router and add early-exit; measure the accuracy/latency trade-off.
- Define an adapter packaging, sandboxing, and version-compatibility spec.
- Study Apple's adapter framework and the M4 benchmark to scope a defensible niche (e.g., sensing/IMU tasks).

### References
- [Mobile Foundation Model as Firmware (arXiv:2308.14363)](https://arxiv.org/abs/2308.14363)
- [M4 full text (HTML v3)](https://arxiv.org/html/2308.14363v3)
- [Apple Foundation Models Tech Report 2025](https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025)
- [Apple's On-Device & Server Foundation Models (Simon Willison)](https://simonwillison.net/2024/Jun/11/apples-on-device-and-server-foundation-models/)
- [Fast On-device LLM Inference with NPUs (ASPLOS'25)](https://xumengwei.github.io/files/ASPLOS25-NPU.pdf)
- [On-Device LLM Inference 2025–2026 Guide](https://docs.octomil.com/blog/on-device-llm-inference-2025-2026/)
- [Awesome Adaptive Computation](https://github.com/koayon/awesome-adaptive-computation)

_Researched via web search · 7 sources · idea_

---
_Source: 'Project Ideas' sheet · generated 2026-06-02 from project.xlsx_
