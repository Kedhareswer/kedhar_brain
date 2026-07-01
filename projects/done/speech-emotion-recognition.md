# Speech Emotion Recognition

**Status:** Done · **Score:** 3/5

**Idea:** 2024-04-28   **Started:** 2024-05-19   **Completed:** 2024-10-27

## Description
Detects emotions from voice recordings using deep learning.

## Skills & Tech
`Python` · `TensorFlow` · `Keras` · `Librosa` · `LSTM` · `CNN/R-CNN` · `ML` · `DL`

## Approach
Feature extraction, emotion classification through deep learning

## Methodology
RNN/LSTM models for emotion detection from voice

## Challenges
Noise in audio data, real-time processing constraints

## Outcomes
Real-time, high-accuracy emotion detection in speech

## Links
- **GitHub:** <https://github.com/Kedhareswer/Speech-Emotion-Recognition>

## 🔬 Research & Enrichment

### Overview
Speech Emotion Recognition (SER) classifies the emotional state of a speaker (e.g. happy, sad, angry, neutral, fearful) directly from raw audio rather than text. This project trains a deep neural network on four standard acted corpora — RAVDESS, TESS, SAVEE and CREMA-D — using hand-crafted acoustic features (Zero Crossing Rate, RMS energy, and MFCCs) and data augmentation (noise injection, pitch shift, time-stretch). It is implemented in Python with TensorFlow/Keras and librosa, and evaluated with accuracy, precision, recall and F1.

### Why it matters
Emotion carries meaning that words alone miss, so SER unlocks more natural human-computer interaction: empathetic voice assistants, call-center quality and escalation analytics, mental-health and tele-therapy screening, automotive driver-state monitoring, and accessibility tools. Because it relies on prosody (pitch, tone, rhythm, intensity) rather than the spoken words, it works across phrasings and is largely language-agnostic.

### How it works / Recommended approach
Per the README, audio is loaded with librosa and converted into feature vectors (MFCCs, ZCR, RMS), expanded via augmentation to improve robustness. These features feed a convolutional neural network ("a deep neural network tailored for emotion recognition") whose layer depth and hyperparameters were tuned experimentally, with the model reporting high classification accuracy. The pipeline is: preprocess + extract features → train → evaluate → predict on new clips. A natural extension is to add temporal modeling (CNN→BiLSTM with attention) or swap hand-crafted features for self-supervised embeddings.

### State of the art & comparable work
Current SER leaders use hybrid and self-supervised models. Time-Distributed [CNN-LSTM with attention](https://dl.acm.org/doi/10.1145/3705927.3705939) and [attention-enhanced CNN-LSTM](https://www.mdpi.com/2624-6120/6/2/22) report strong RAVDESS results; [emotion2vec (ACL 2024)](https://github.com/ddlBoJack/emotion2vec) provides universal SSL emotion embeddings. The [wav2vec2/HuBERT benchmark (arXiv 2111.02735)](https://arxiv.org/abs/2111.02735) shows fine-tuned SSL models beat MFCC baselines. Ready-to-use comparables: [SpeechBrain wav2vec2-IEMOCAP](https://huggingface.co/speechbrain/emotion-recognition-wav2vec2-IEMOCAP) (~78.7%), [SUPERB wav2vec2-large-superb-er](https://huggingface.co/superb/wav2vec2-large-superb-er), and [audEERING w2v2 dimensional model](https://github.com/audeering/w2v2-how-to).

### Tech stack
Python 3.x · TensorFlow / Keras · librosa · NumPy · scikit-learn · CNN (with LSTM/RNN variants). Recommended additions: PyTorch + Hugging Face Transformers / SpeechBrain for wav2vec2/HuBERT fine-tuning.

### Key challenges & risks
- Poor cross-dataset generalization: acted corpora overfit; real conversational emotion differs ([benchmark, arXiv 2406.09933](https://arxiv.org/html/2406.09933v1)).
- Small, demographically narrow datasets (SAVEE male-only; TESS two speakers) inflate accuracy and bias models.
- Real-time/noisy-environment robustness and latency constraints noted in the project.
- Class imbalance and ambiguous/blended emotions; subjective labels reduce ceiling.

### Suggested next steps
- Run a held-out, cross-corpus (speaker-independent) evaluation to expose true generalization.
- Add a CNN→BiLSTM-with-attention head over log-mel spectrograms as a stronger baseline.
- Fine-tune a wav2vec2/HuBERT (or emotion2vec) encoder and compare against the MFCC pipeline.
- Benchmark on IEMOCAP/MSP-Podcast for more natural emotion and dimensional (valence/arousal) targets.
- Add a real-time inference demo (streaming + ONNX/TF-Lite) and a confusion-matrix error analysis.

### References
- [CNN-LSTM vs Attention-Enhanced CNN-LSTM (MDPI Signals 2025)](https://www.mdpi.com/2624-6120/6/2/22)
- [Time-Distributed CNN-LSTM with Attention (ACM DMIP 2024)](https://dl.acm.org/doi/10.1145/3705927.3705939)
- [wav2vec2/HuBERT SER Benchmark (arXiv 2111.02735)](https://arxiv.org/abs/2111.02735)
- [Generalizing SER Across Datasets (arXiv 2406.09933)](https://arxiv.org/html/2406.09933v1)
- [emotion2vec: SSL Speech Emotion Representation (ACL 2024)](https://github.com/ddlBoJack/emotion2vec)
- [SpeechBrain wav2vec2 IEMOCAP model](https://huggingface.co/speechbrain/emotion-recognition-wav2vec2-IEMOCAP)
- [Deep Learning for SER: Databases to Models (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7916477/)

_Researched via web search · 7 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
