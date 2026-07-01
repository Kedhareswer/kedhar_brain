# Classify User Application Traffic at the Network in a Multi-UE Connected Scenario

**Type:** 💡 Idea · Problem Statement #8   ·   **Status:** Not started

## Problem Statement
Applications are affected differently under varying traffic conditions, channel states, and coverage scenarios. If the traffic of each UE can be categorized into broader categories, such as Video Streaming, Audio Calls, Video Calls, Gaming, Video Uploads, browsing, texting etc. that can enable the Network to serve a differentiated and curated QoS for each type of traffic. Develop an AI model to analyze a traffic pattern and predict the application category with high accuracy.

## 🔬 Research & Enrichment

### Overview
This idea proposes an AI model that classifies each connected user equipment's (UE) traffic into application categories — video streaming, audio/video calls, gaming, uploads, browsing, texting — so a cellular network can apply differentiated, curated QoS per traffic type in a multi-UE scenario. Because modern traffic is almost entirely encrypted (TLS 1.3, QUIC), classic deep packet inspection (DPI) and port-based signatures fail, so the task reduces to *encrypted traffic classification* (ETC): inferring the app class from observable metadata (packet sizes, directions, inter-arrival times) rather than payload. This is an active, mature research area with strong public datasets and reported accuracies above 90–99% for many setups.

### Why it matters
Different applications have very different network demands: gaming and video calls need low latency, streaming needs sustained throughput with tolerance for buffering, texting is bursty and tiny. Knowing the class early lets the RAN/core map each flow to the right 3GPP 5QI / network slice, improving QoE and using scarce radio resources efficiently across many UEs. Operators cannot read encrypted payloads, so a metadata-driven classifier is the only privacy-respecting way to enable application-aware scheduling and slicing.

### How it works / Recommended approach
Recommended pipeline: (1) capture per-flow features with a flow exporter (e.g., ipfixprobe), (2) build inputs from the first ~30 packets — sequences of packet sizes/directions/inter-packet times — plus per-flow histograms and statistics, (3) train a model. Two proven model families: a 1D-CNN / CNN over the packet-size–time "image" for spatial patterns, or an LSTM/GRU over the packet sequence for temporal patterns; multi-modal fusion of both consistently performs best. For early, low-latency inference, classify on the first few packets. Target labels are coarse traffic *types* (not specific apps), which generalises better across providers.

### State of the art & comparable work
- [CESNET-QUIC22 dataset & methodology (ScienceDirect / PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9851865/) — 153M QUIC flows, 102 services in 17 categories; defines packet-sequence + histogram features.
- [Traffic Classification for Network Slicing in Mobile Networks (MDPI Electronics)](https://www.mdpi.com/2079-9292/11/7/1097) — maps classified traffic to 5G slices.
- [5G/B5G Service Classification Using Supervised Learning (MDPI)](https://www.mdpi.com/2076-3417/11/11/4942).
- [A Novel QUIC Traffic Classifier Based on CNNs](https://www.researchgate.net/publication/331272016_A_Novel_QUIC_Traffic_Classifier_Based_on_Convolutional_Neural_Networks).
- [NLP-inspired multi-label video streaming classifier (arXiv 1906.02679)](https://arxiv.org/pdf/1906.02679).
- [Traffic Classification in an Increasingly Encrypted Web (CACM)](https://cacm.acm.org/research/traffic-classification-in-an-increasingly-encrypted-web/).

### Tech stack
Python; PyTorch/TensorFlow (1D-CNN, LSTM/GRU, multi-modal fusion); scikit-learn (Random Forest/XGBoost baselines); ipfixprobe / nfstream / CICFlowMeter for flow features; pandas/NumPy; datasets ISCXVPN2016, CESNET-QUIC22, UC Davis QUIC, NetML; ONNX/TensorRT for edge deployment.

### Key challenges & risks
- Encrypted payloads + QUIC 0-RTT and traffic padding reduce signal; SNI may be encrypted (ECH).
- Concept drift: app behaviour and protocols change, degrading models over time.
- Class imbalance and noisy/weak labels; need for representative, per-region labeled data.
- Real-time, per-UE inference at line rate on resource-constrained RAN hardware.
- Generalisation across networks, devices, and coverage/channel conditions.

### Suggested next steps
- Reproduce a strong baseline on ISCXVPN2016 (Random Forest on flow stats) to set a reference accuracy.
- Re-label CESNET-QUIC22's 17 categories into your target classes (streaming, calls, gaming, browsing, texting) and train a 1D-CNN.
- Add an LSTM branch and evaluate multi-modal fusion; measure accuracy vs. number-of-packets for early classification.
- Test robustness to drift (train/test on different weeks) and to padding/ECH.
- Prototype mapping from predicted class to a 3GPP 5QI and quantify QoS/QoE gains in a simulator.
- Optimise the best model (quantise, ONNX/TensorRT) for low-latency edge inference.

_Researched via web search · 8 sources · idea_

---
_Source: 'Project Ideas' sheet · generated 2026-06-02 from project.xlsx_
