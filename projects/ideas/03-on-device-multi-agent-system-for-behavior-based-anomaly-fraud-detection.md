# On-Device Multi-Agent System for Behavior-Based Anomaly & Fraud Detection

**Type:** 💡 Idea · Problem Statement #3   ·   **Status:** Not started

## Problem Statement
Multi-agent system that runs fully on-device, continuously learning and modeling user behaviour patterns to detect anomalies or potential fraud in real-time, without sending sensitive data to external servers. The system can monitor user behaviour patterns (e.g., touch patterns, typing rhythm, app usage, movement) and build local models of “normal” behaviour. It should detect and react to anomalous or suspicious activity (e.g., unauthorized access, bot-like behaviour, spoofing).

## 🔬 Research & Enrichment

### Overview
This idea proposes an on-device, multi-agent system that continuously models a user's behavioral biometrics — touch/swipe dynamics, typing rhythm (keystroke dwell/flight times), app-usage patterns, and motion (accelerometer/gyroscope/gait) — to build a personal baseline of "normal" and flag anomalies, account takeover, bot-like activity, or spoofing in real time. Critically, all sensing, learning, and inference stay local, so raw sensitive signals never leave the device. It sits at the intersection of behavioral biometrics for continuous authentication and edge/privacy-preserving anomaly detection, with a multi-agent layer coordinating per-modality detectors.

### Why it matters
Static credentials and one-shot biometrics (face/fingerprint) are increasingly defeated by phishing, credential stuffing, synthetic identity fraud, and AI-driven bots. Behavioral biometrics adds a continuous, frictionless layer that keeps verifying *who* is using a device even after login, catching account takeover and money-mule activity. Keeping it on-device addresses the central privacy objection to constant behavioral surveillance and reduces latency and cloud cost.

### How it works / Recommended approach
Recommended architecture: (1) lightweight per-modality **agents** (touch, keystroke, motion/gait, app-usage), each running an on-device anomaly model; (2) a **fusion/orchestrator agent** combining per-agent anomaly scores into a session trust score; (3) a **response agent** that steps up auth or locks on sustained low trust. Use one-class/unsupervised models (autoencoder reconstruction error, isolation forest, one-class SVM) so no labeled "attacker" data is needed; for motion, a hybrid CNN/Bi-LSTM with attention works well. Enroll a local baseline, adapt continuously, and optionally use **federated learning** to improve global models without sharing raw data. SentinelAgent's directed interaction-graph monitoring is a useful pattern for watching the agent layer itself.

### State of the art & comparable work
- BioCatch, BehavioSec, Plurilock (AWARE/DEFEND), TypingDNA — commercial continuous-auth/fraud vendors ([MarketsandMarkets](https://www.marketsandmarkets.com/Market-Reports/behavioral-biometrics-market-64844371.html)).
- HMOG hand-movement/grasp features, EER ~7-10% ([arXiv 1501.01199](https://arxiv.org/pdf/1501.01199)).
- Hybrid ViT/attention + Bi-LSTM continuous auth, 97.5% on MotionSense ([PMC12074485](https://pmc.ncbi.nlm.nih.gov/articles/PMC12074485/)).
- FLiForest / FedDetect — federated isolation-forest & autoencoder anomaly detection ([ACM 3702995](https://dl.acm.org/doi/10.1145/3702995)).
- SentinelAgent — graph-based anomaly detection for multi-agent systems ([arXiv 2505.24201](https://arxiv.org/html/2505.24201v1)).

### Tech stack
On-device inference: TensorFlow Lite / LiteRT, ONNX Runtime Mobile, or Core ML (iOS). Models: autoencoders, isolation forest, 1D-CNN + Bi-LSTM (PyTorch/TF training). Sensor APIs: Android SensorManager / iOS Core Motion. Federated layer (optional): Flower or TensorFlow Federated. Agent orchestration: lightweight local message bus.

### Key challenges & risks
- Resource constraints: CPU/RAM/battery cost of continuous sensing and inference.
- Concept drift: legitimate behavior changes (injury, new device, context) cause false rejects.
- Cold start: baseline needs enrollment data before it is reliable.
- Adversarial evasion / replay & spoofing of behavioral signals; mimicry attacks.
- Privacy/consent and regulatory framing even though data stays local.
- No public attacker labels — must rely on unsupervised methods and careful thresholding.

### Suggested next steps
- Prototype one modality (keystroke or touch) with an autoencoder on public data: BB-MAS ([arXiv 1912.02736](https://arxiv.org/abs/1912.02736)), HMOG, Touchalytics, MotionSense.
- Define the trust-score fusion logic and step-up/lockout response policy.
- Convert the trained model to TFLite/ONNX and benchmark latency, battery, and memory on a real phone.
- Add a second modality and the orchestrator agent; measure FAR/FRR and EER on held-out users.
- Evaluate concept-drift adaptation (online updates) and a basic spoof/replay test.
- Prototype an optional federated-learning round (Flower) for global model improvement.

### References
- [Behavioral Biometrics market & vendors — MarketsandMarkets](https://www.marketsandmarkets.com/Market-Reports/behavioral-biometrics-market-64844371.html)
- [HMOG: Behavioral Biometric Features for Continuous Auth (arXiv 1501.01199)](https://arxiv.org/pdf/1501.01199)
- [Hybrid Deep Learning for Continuous User Authentication (PMC12074485)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12074485/)
- [BB-MAS dataset — Typing, Gait, Swipe (arXiv 1912.02736)](https://arxiv.org/abs/1912.02736)
- [Federated Learning Anomaly Detection with Isolation Forest (ACM 3702995)](https://dl.acm.org/doi/10.1145/3702995)
- [SentinelAgent: Graph-Based Anomaly Detection in Multi-Agent Systems (arXiv 2505.24201)](https://arxiv.org/html/2505.24201v1)
- [CrossClassify — Behavioral Biometrics Authentication & Fraud Detection](https://www.crossclassify.com/solutions/behavioral-biometrics/)
- [GeeTest — Behavioral Biometrics for Bot Detection](https://www.geetest.com/en/article/behavioral-biometrics-bot-detection)
- [Edge AI deployment runtimes: TFLite, ONNX Runtime, Core ML](https://cursa.app/en/page/deployment-runtimes-tensorflow-lite-onnx-runtime-and-core-ml)

_Researched via web search · 9 sources · idea_

---
_Source: 'Project Ideas' sheet · generated 2026-06-02 from project.xlsx_
