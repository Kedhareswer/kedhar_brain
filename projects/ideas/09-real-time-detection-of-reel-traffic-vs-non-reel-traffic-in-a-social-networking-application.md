# Real-time Detection of Reel Traffic vs Non-reel Traffic in a Social-networking Application

**Type:** 💡 Idea · Problem Statement #9   ·   **Status:** Not started

## Problem Statement
SNS applications (such as Facebook and YouTube), transmit both video (short videos, reels, etc.) and non-video traffic (feeds, suggestions, etc.) through the same data pipeline. Develop an AI model to differentiate reel / video traffic versus non-reel/video traffic in real-time, enabling user equipment (UE) to optimize performance dynamically. The model should also ensure accuracy under varying network congestion and coverage conditions.

## 🔬 Research & Enrichment

### Overview
This idea proposes an on-device AI model that classifies a smartphone's encrypted network traffic in real time as "reel/short-video" versus "non-video" (feeds, suggestions, chat). Because apps like Instagram, Facebook and YouTube multiplex all content over the same TLS-encrypted pipes, the user equipment (UE) cannot read payloads and must infer content type from *traffic-shape* metadata — packet sizes, directions, inter-arrival times and burst patterns. The detected class can then drive dynamic UE-side optimizations (prefetch/buffer sizing, radio scheduling hints, power management). A core requirement is robustness across varying congestion and coverage.

### Why it matters
Short-form video now dominates mobile data: Ericsson reports that social-media video is ~70–80% of all smartphone video traffic, with TikTok alone driving 20–40% of video traffic on European networks. Reels and Shorts have a distinctive "scroll-and-autoplay" pattern where each swipe triggers a new download burst. Knowing in real time whether the user is in a video burst vs. browsing feeds lets the UE pre-buffer the next reel, smooth playback under weak coverage, and avoid wasting radio/battery on idle feed scrolling — directly improving QoE and energy efficiency.

### How it works / Recommended approach
Recommended pipeline: (1) **On-device flow capture** — aggregate packets into short unidirectional flow windows (e.g., 1–5 s) per 5-tuple. (2) **Feature extraction** — packet-size histograms, up/down byte ratios, inter-arrival-time statistics, and burst (on/off) descriptors, which capture the ABR segment-download signature of reels vs. the small, sporadic requests of feeds. (3) **Lightweight model** — a quantized 1D-CNN over the packet-length/timing sequence (best accuracy/latency trade-off) or a Random Forest/XGBoost over handcrafted statistics for an interpretable baseline. (4) **Real-time inference** — INT8-quantized model on a sliding window with hysteresis to avoid flapping. (5) **Robustness** — train with congestion/coverage augmentation and per-RAT (4G/5G) normalization so throughput shifts don't break the classifier.

### State of the art & comparable work
- [Traffic Pattern Plot: Video Identification in Encrypted Traffic](https://www.researchgate.net/publication/362761222_Traffic_Pattern_Plot_Video_Identification_in_Encrypted_Network_Traffic) — renders flows as images, CNN reaches ~94% with 120 s of traffic.
- [ITP-KNN: Encrypted Video Flow Identification](https://pmc.ncbi.nlm.nih.gov/articles/PMC7302816/) — exploits the intermittent (bursty) ABR pattern with KNN.
- [Energy-Efficient DL Traffic Classification on Microcontrollers](https://arxiv.org/pdf/2506.10851) — HW-NAS 1D-CNN, 96.59% on ISCX VPN-nonVPN, INT8, ~31 ms latency on MCUs (proves on-UE feasibility).
- [ML Classifiers for QoE Prediction in Video Streaming over 5G](https://www.techscience.com/cmc/v75n1/51521) — QoE estimation from QoS features in 5G.
- [Encrypted Traffic Analysis survey (MDPI Sensors)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11175201/) — methods, features, limitations overview.

### Tech stack
Python, scikit-learn / XGBoost (baseline), PyTorch or TensorFlow + 1D-CNN (deep model), TensorFlow Lite / ONNX Runtime + INT8 quantization for UE deployment; packet capture via libpcap/tcpdump, feature extraction with CICFlowMeter or nDPI; evaluation on ISCX VPN-nonVPN.

### Key challenges & risks
- Encryption (TLS 1.3, QUIC/HTTP3) hides payload; only metadata is usable, and padding can blur signatures.
- Concept drift: app updates, ABR algorithm changes, and CDN behavior degrade models over time.
- Robustness under congestion/poor coverage — throughput collapse can mimic non-video bursts.
- On-device constraints: latency, memory and battery budgets on the UE.
- Mixed/multiplexed flows (reel + ads + feed over one connection) and ground-truth labeling difficulty.

### Suggested next steps
- Collect a labeled reel-vs-feed dataset by scripting Instagram/YouTube sessions and capturing pcaps with content labels; augment with ISCX VPN-nonVPN streaming class.
- Build an XGBoost baseline on flow statistics; measure accuracy and per-class F1.
- Train a quantized 1D-CNN on packet-size/timing sequences; benchmark latency on a phone (TFLite).
- Add congestion/coverage augmentation and evaluate generalization across 4G/5G and RSSI bands.
- Prototype a UE feedback loop (e.g., adaptive prefetch) and measure QoE/energy gains.
- Compare against an nDPI-based DPI baseline to quantify the ML uplift on encrypted flows.

### References
- [Short-form dominates video traffic — Ericsson Mobility Report](https://www.ericsson.com/en/reports-and-papers/mobility-report/articles/short-form-dominates-video-traffic)
- [Encrypted Network Traffic Analysis and Classification Utilizing ML (MDPI Sensors)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11175201/)
- [Energy-Efficient DL for Traffic Classification on Microcontrollers (arXiv)](https://arxiv.org/pdf/2506.10851)
- [ITP-KNN: Encrypted Video Flow Identification (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7302816/)
- [Traffic Pattern Plot: Video Identification in Encrypted Traffic](https://www.researchgate.net/publication/362761222_Traffic_Pattern_Plot_Video_Identification_in_Encrypted_Network_Traffic)
- [ML Classifiers for QoE Prediction over 5G (TechScience CMC)](https://www.techscience.com/cmc/v75n1/51521)
- [ISCX VPN-nonVPN (ISCXVPN2016) dataset — UNB CIC](https://www.unb.ca/cic/datasets/vpn.html)
- [nDPI: Open-Source Deep Packet Inspection (ntop)](https://github.com/ntop/nDPI)

_Researched via web search · 8 sources · idea_

---
_Source: 'Project Ideas' sheet · generated 2026-06-02 from project.xlsx_
