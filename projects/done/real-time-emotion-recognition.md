# Real-Time Emotion Recognition

**Status:** Done - Deployed · **Score:** 4/5

**Idea:** 2024-12-31   **Started:** 2025-02-10   **Completed:** 2025-02-22

## Description
Detects emotions in real-time using computer vision, similar to object detection for face emotion analysis.

## Skills & Tech
`Python` · `Open-CV` · `FastAPI` · `HTML` · `CSS` · `JavaScript` · `Keras` · `TensorFlow` · `Other`

## Outcomes
Real-time emotion classification based on detected facial expressions, with high detection accuracy.

## Tags
`ML` · `DL` · `Other`

## 🔬 Research & Enrichment

### Overview
Real-Time Emotion Recognition is a computer-vision web app that detects faces in a live camera/video stream and classifies each face's expression into discrete emotions (typically the 7 FER classes: angry, disgust, fear, happy, neutral, sad, surprise). It treats emotion analysis like object detection: locate the face, then label it. The stack (Python, OpenCV, Keras/TensorFlow, FastAPI + HTML/CSS/JS) indicates a CNN classifier served behind a FastAPI backend with a browser front-end for the webcam feed. No public repository was found under github.com/Kedhareswer (the account hosts AI-agent and a digit/alphabet classifier project, but nothing emotion-related), so implementation details below are inferred from the declared tech stack and standard FER pipelines.

### Why it matters
Affective computing powers driver-drowsiness/attention monitoring, UX and ad testing, telehealth and mental-wellness screening, e-learning engagement, and human-robot interaction. A real-time, browser-deployable detector lowers the barrier to these use cases without specialized hardware. It is also a strong end-to-end portfolio piece, spanning model training, OpenCV video processing, and full-stack API deployment.

### How it works / Recommended approach
The standard pipeline this project follows: (1) capture frames from the webcam via the browser, sending them to FastAPI (or run OpenCV `VideoCapture` server-side); (2) detect faces per frame using OpenCV Haar cascades or a DNN/SSD face detector; (3) crop, convert to grayscale, resize to 48x48, and normalize each face; (4) run a Keras/TensorFlow CNN that outputs softmax probabilities over the emotion classes; (5) overlay the top-scoring label and bounding box, streaming results back to the front-end. Models are usually trained on FER2013. Improvements: swap Haar for a more robust detector (RetinaFace/MediaPipe), and replace a shallow CNN with a pretrained EfficientNet/ResNet backbone for higher accuracy.

### State of the art & comparable work
- [DeepFace](https://github.com/serengil/deepface) - pip-installable Python library doing emotion + age/gender/race with many detector backends (OpenCV, MTCNN, RetinaFace, YOLO).
- [HSEmotion / EmotiEffLib](https://github.com/av-savchenko/hsemotion) - lightweight EfficientNet models (AffectNet-trained), 8 classes, PyTorch/ONNX for fast real-time inference.
- [atulapra/Emotion-detection](https://github.com/atulapra/Emotion-detection) - canonical 4-layer CNN on FER2013 (~63% acc) with Haar-cascade real-time loop.
- SOTA: [Khaireddin & Chen, "SOTA on FER2013"](https://arxiv.org/abs/2105.03588) reports 73.28% single-network (VGGNet); recent EmoNeXt/ConvNeXt variants reach ~76-78%.

### Tech stack
Python · OpenCV (face detection + video) · Keras/TensorFlow (CNN) · FastAPI (inference API) · HTML/CSS/JavaScript (webcam UI) · FER2013 dataset (training)

### Key challenges & risks
- FER2013 has noisy/mislabeled images, non-faces, and severe class imbalance (disgust/fear rare), capping accuracy and per-class recall.
- Sensitivity to lighting, pose, occlusion; Haar cascades miss off-angle faces.
- Demographic and annotator bias raises fairness concerns; discrete labels ignore mixed/subtle affect.
- Real-time latency: per-frame inference must stay fast; webcam privacy must be handled responsibly.

### Suggested next steps
- Publish and link the GitHub repo + a live demo (HF Spaces / Render) so the "Done - Deployed" status is verifiable.
- Replace Haar with RetinaFace/MediaPipe and the CNN with a pretrained EfficientNet/ResNet; report a confusion matrix.
- Add class-weighting or augmentation (and consider AffectNet) to fix imbalance on disgust/fear.
- Export to ONNX/TF-Lite and quantize for low-latency, multi-face inference.
- Add a documented `/predict` API endpoint, accuracy metrics, and an ethics/privacy note in the README.

### References
- [DeepFace library](https://github.com/serengil/deepface)
- [HSEmotion / EmotiEffLib](https://github.com/av-savchenko/hsemotion)
- [atulapra/Emotion-detection (FER2013 CNN)](https://github.com/atulapra/Emotion-detection)
- [SOTA Performance on FER2013 (arXiv 2105.03588)](https://arxiv.org/abs/2105.03588)
- [Weaknesses of Facial Emotion Recognition Systems (arXiv 2601.12402)](https://arxiv.org/html/2601.12402)
- [Faces of Fairness: Bias in FER Datasets and Models (arXiv 2502.11049)](https://arxiv.org/html/2502.11049v1)

_Researched via web search · 8 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
