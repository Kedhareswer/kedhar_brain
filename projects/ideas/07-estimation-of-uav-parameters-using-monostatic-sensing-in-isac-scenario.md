# Estimation of UAV Parameters Using Monostatic Sensing in ISAC Scenario

**Type:** 💡 Idea · Problem Statement #7   ·   **Status:** Not started

## Problem Statement
Develop an AI-based solution using monostatic integrated sensing and communication (ISAC) to estimate UAV range, velocity, and direction of arrival, leveraging advanced signal processing and machine learning. Utilize the channel model based on 3GPP TR 38.901-j00 (Rel-19) Section 7.9 for ISAC applications. Participants are expected to design models that extract these parameters from ISAC signals under the specified channel conditions.

## 🔬 Research & Enrichment

### Overview
This idea targets estimating an unmanned aerial vehicle's (UAV) range, radial velocity, and direction of arrival (DoA) from a *monostatic* Integrated Sensing and Communication (ISAC) link — a single node whose co-located transmitter and receiver senses reflections of its own OFDM waveform. It is framed as a hackathon/standards challenge grounded in the 3GPP TR 38.901 Rel-19 Section 7.9 ISAC channel model. The task is to design AI/signal-processing models that recover these three kinematic parameters from synthetic ISAC echoes generated under that standardized channel. It sits squarely in the emerging "low-altitude economy" and 6G sensing space.

### Why it matters
Cellular networks are being upgraded to *sense* as well as communicate, turning every base station into a potential radar for drone surveillance, air-traffic safety, and intrusion detection. Consumer UAVs have tiny, partly non-metallic radar cross-sections and fly amid clutter, so robust range/velocity/DoA estimation is a hard, high-value problem. Standardizing on 3GPP TR 38.901 Rel-19 makes solutions directly comparable and deployment-relevant.

### How it works / Recommended approach
Recommended pipeline: (1) Generate data with the Rel-19 model, which decomposes the channel as H_ISAC = H_target + H_background; monostatic mode uses a multi-reference-point superposition and explicit RCS, micro-Doppler, and target geometry terms. (2) Estimate the channel/CIR, then form a range–Doppler map via 2D FFT (range from delay taps, ΔR = c/2B; velocity from per-symbol phase evolution). (3) Apply MUSIC/ESPRIT across the antenna array for DoA. (4) Add an ML head: a complex-valued CNN over the range–Doppler–angle tensor (cf. IFFT-C2VNN) for super-resolution and de-noising, optionally a CFAR detector front-end. Train on simulated echoes; validate against classical baselines.

### State of the art & comparable work
- [OFDM Waveform for Monostatic ISAC in 6G](https://arxiv.org/html/2603.12641) — CIR-based range/Doppler, full-duplex self-interference issues.
- [High-Resolution Sensing in Communication-Centric ISAC (deep learning + parametric)](https://arxiv.org/html/2509.02137) — IFFT-C2VNN vs PARAMING vs MUSIC/ESPRIT.
- [3GPP Rel-19 ISAC Channel Modeling Survey](https://arxiv.org/html/2512.03506v1) — Section 7.9 target/background structure, RCS, micro-Doppler.
- [Cellular ISAC for Low-Altitude UAV](https://arxiv.org/html/2412.19973v1) — range/AoA/velocity, CFAR, micro-Doppler ID.
- [DoA via MUSIC with Range/Doppler Multiplexing (MIMO-OFDM)](https://arxiv.org/pdf/2506.13258) — joint angle + kinematics.

### Tech stack
Python; NumPy/SciPy; PyTorch (complex-valued layers); 3GPP TR 38.901 Rel-19 channel simulator (Sionna RT or MATLAB 5G Toolbox); classical DSP (2D FFT periodogram, MUSIC, ESPRIT, CFAR); scikit-learn for metrics.

### Key challenges & risks
- Low UAV RCS and non-metallic bodies → weak echoes, needing multi-pulse accumulation.
- Monostatic self-interference / full-duplex leakage and RF phase-gain calibration.
- Faithfully reproducing the Rel-19 Section 7.9 model (RCS, multi-RP, micro-Doppler) for training data.
- ML generalization across SNR/clutter; closely spaced or swarming targets; limited labeled real data.

### Suggested next steps
- Obtain TR 38.901 Rel-19 §7.9; reproduce the monostatic target+background channel in a simulator.
- Build a classical baseline (FFT range–Doppler + MUSIC DoA + CFAR) and report RMSE vs SNR.
- Add a complex-valued CNN for super-resolution; compare against the baseline.
- Inject micro-Doppler to enable UAV-vs-clutter discrimination; benchmark on [DroneRF](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6727013/) / [RFUAV](https://arxiv.org/html/2503.09033v2) style data.
- Stress-test multi-target/swarm and low-SNR regimes; document failure modes.

### References
- [OFDM Waveform for Monostatic ISAC in 6G](https://arxiv.org/html/2603.12641)
- [High-Resolution Sensing in Communication-Centric ISAC](https://arxiv.org/html/2509.02137)
- [3GPP Rel-19 ISAC Channel Modeling: A Comprehensive Survey](https://arxiv.org/html/2512.03506v1)
- [An Overview of Cellular ISAC for Low-Altitude UAV](https://arxiv.org/html/2412.19973v1)
- [DoA Estimation using MUSIC with Range/Doppler Multiplexing for MIMO-OFDM Radar](https://arxiv.org/pdf/2506.13258)
- [Modeling Micro-Doppler Signature of Multi-Propeller Drones in Distributed ISAC](https://arxiv.org/html/2504.05168)
- [DroneRF dataset](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6727013/)
- [RFUAV: A Benchmark Dataset for UAV Detection and Identification](https://arxiv.org/html/2503.09033v2)

_Researched via web search · 8 sources · idea_

---
_Source: 'Project Ideas' sheet · generated 2026-06-02 from project.xlsx_
