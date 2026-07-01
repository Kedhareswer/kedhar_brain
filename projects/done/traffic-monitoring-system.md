# Traffic Monitoring System

**Status:** Done - Deployed · **Score:** 3/5

**Idea:** 2025-02-19   **Started:** 2025-02-22   **Completed:** 2025-02-28

## Description
The Traffic Monitoring System is an advanced computer vision solution that enables real-time monitoring and analysis of traffic flow through multiple video streams. The system leverages state-of-the-art object detection and tracking capabilities to identify vehicles, pedestrians, and other traffic participants, providing valuable insights for traffic management and analysis. It features both a desktop application and a web interface, making it versatile for different deployment scenarios.

## Skills & Tech
`Python` · `Open-CV` · `FastAPI` · `HTML` · `CSS` · `JavaScript`

## Tags
`ML` · `DL` · `Other`

## Links
- **GitHub:** <https://github.com/Kedhareswer/Object-Detection-and-Tracking>

## 🔬 Research & Enrichment

### Overview
The Traffic Monitoring System is a real-time computer-vision application that detects and tracks vehicles and pedestrians across multiple video streams to surface traffic-flow analytics. The matching repository is **github.com/Kedhareswer/Object-Detection-and-Tracking** (its GitHub description is literally "Traffic Monitoring System"). It is built around **YOLOv8 (Ultralytics) + PyTorch + OpenCV**, with object tracking layered on detection for persistent IDs. It ships two front ends: a **PyQt5 desktop app** and a **Flask + Flask-SocketIO web interface** for live, multi-stream visualization (note: the portfolio entry lists FastAPI, but the actual README uses Flask).

### Why it matters
Urban congestion, incident detection, and signal-timing optimization all depend on accurate, real-time vehicle/pedestrian counts. Manual or loop-sensor monitoring is costly and coarse; camera-based CV turns existing CCTV into rich, queryable sensors. Reliable detection-and-tracking pipelines underpin smart-city traffic management, safety analytics, and downstream adaptive signal control.

### How it works / Recommended approach
Per the README, the pipeline is modular: `main.py` launches the desktop UI; `src/` holds detection, tracking, video, and UI modules; `web_app/` holds the Flask server, templates, and static assets. Each frame is run through a pre-trained **YOLOv8** detector tuned for traffic classes; detections are passed to a tracking algorithm to assign persistent IDs across frames, enabling counts and flow statistics. A **multi-threaded video pipeline** supports up to **4 concurrent streams**, and Socket.IO pushes live updates to the browser. To extend it: adopt Ultralytics' built-in **ByteTrack/BoT-SORT** trackers, add line/polygon **region counting** for per-lane counts and speed estimation, and fine-tune YOLO on a traffic dataset rather than relying on COCO weights.

### State of the art & comparable work
Modern systems pair a one-stage detector (YOLOv8/YOLO11) with a tracking-by-detection algorithm. [ByteTrack](https://arxiv.org/pdf/2110.06864) (~80.3 MOTA / 63.1 HOTA on MOT17) associates every detection box including low-confidence ones; [BoT-SORT](https://arxiv.org/pdf/2206.14651) adds camera-motion compensation and ReID (~80.5 MOTA). Both are native in [Ultralytics tracking](https://docs.ultralytics.com/modes/track/). [Roboflow Supervision](https://github.com/roboflow/supervision) provides line-zone counting, annotators, and speed/dwell-time utilities for exactly this use case. Comparable open projects: [DebajyotiTalukder2001/Traffic-Monitoring-System](https://github.com/DebajyotiTalukder2001/Traffic-Monitoring-System) (YOLOv8 counting + speed) and [vietanhlee/Smart-Traffic-Monitoring-System](https://github.com/vietanhlee/Smart-Traffic-Monitoring-System) (YOLO + ByteTrack, dashboards).

### Tech stack
Python 3.7+ · OpenCV · Ultralytics YOLOv8 · PyTorch · PyQt5 (desktop) · Flask + Flask-SocketIO (web) · HTML/CSS/JS · multi-threaded video processing.

### Key challenges & risks
- Detection/tracking degrades under occlusion, night/low-light, rain, and camera blur.
- Hard scaling cap (max 4 streams); memory and GPU pressure with concurrent video.
- Web latency over Socket.IO affects real-time responsiveness.
- COCO-pretrained weights may misclassify region-specific vehicles (autos, trucks) without fine-tuning.
- ID switches across frames bias counts; no documented evaluation/accuracy metrics.

### Suggested next steps
- Fine-tune YOLOv8 on a traffic benchmark ([UA-DETRAC](https://arxiv.org/pdf/1511.04136), [BDD100K](https://www.labellerr.com/blog/bdd100k-a-huge-database-of-diverse-driving-videos/), VisDrone) and report mAP/MOTA.
- Swap ad-hoc tracking for ByteTrack/BoT-SORT via Ultralytics; add line/polygon region counting + speed estimation.
- Reconcile the stack (migrate web layer to FastAPI as the portfolio claims, or correct the entry to Flask).
- Add GPU batching/queueing to lift the 4-stream limit; containerize with Docker.
- Persist counts to a time-series DB and add a historical analytics dashboard; add automated tests + a demo video/GIF.

### References
- [Multi-Object Tracking with Ultralytics YOLO](https://docs.ultralytics.com/modes/track/)
- [Region-Based Object Counting with Ultralytics YOLO11](https://www.ultralytics.com/blog/region-based-object-counting-using-ultralytics-yolo11)
- [ByteTrack: Multi-Object Tracking by Associating Every Detection Box (arXiv)](https://arxiv.org/pdf/2110.06864)
- [BoT-SORT: Robust Associations Multi-Pedestrian Tracking (arXiv)](https://arxiv.org/pdf/2206.14651)
- [Roboflow Supervision (GitHub)](https://github.com/roboflow/supervision)
- [UA-DETRAC: Benchmark for Multi-Object Detection and Tracking (arXiv)](https://arxiv.org/pdf/1511.04136)
- [BDD100K driving video dataset overview](https://www.labellerr.com/blog/bdd100k-a-huge-database-of-diverse-driving-videos/)
- [Comparable: vietanhlee/Smart-Traffic-Monitoring-System](https://github.com/vietanhlee/Smart-Traffic-Monitoring-System)

_Researched via web search · 10 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
