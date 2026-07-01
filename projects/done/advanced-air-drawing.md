# Advanced Air Drawing

**Status:** Done · **Score:** 3/5

**Idea:** 2024-11-10   **Started:** 2024-12-09   **Completed:** 2025-01-10

## Description
A real-time hand-tracking drawing application using computer vision and gesture recognition. Users can draw in the air using hand gestures, switch modes, select colors, and adjust brush sizes with intuitive controls. Supports recording, undo/redo, and debug mode for enhanced usability.

## Skills & Tech
`Python` · `Open-CV` · `Scikit-Learn` · `DL` · `ML` · `Other`

## Approach
Used Mediapipe Hands model for real-time hand landmark detection. Fingertip positions were tracked to recognize gestures for drawing. Movements were translated into canvas coordinates, supporting freehand, shape drawing, and eraser modes.

## Methodology
Gesture-based controls allowed seamless mode switching, pausing/resuming drawing, and color selection. Keyboard shortcuts, color palette, and brush size adjustments improved usability. Optimized frame processing ensured smooth performance using NumPy. Enabled saving drawings as images and implemented video recording with OpenCV.

## Challenges
Hand tracking accuracy in different lighting conditions. Gesture misinterpretation (false positives in detection). Latency in drawing and UI responsiveness. Finger movement jitter leading to shaky drawings.Overlapping gestures (e.g., accidental mode switch while drawing).Saving drawings without artifacts

## Tags
`Web` · `Other`

## 🔬 Research & Enrichment

### Overview
Advanced Air Drawing is a real-time, touchless drawing application that turns a standard webcam into a "virtual canvas." It uses computer vision to track the user's hand, recognizes finger configurations as gestures, and maps the fingertip path to strokes on screen. Beyond freehand drawing, it supports shape and eraser modes, color selection, brush-size adjustment, undo/redo, image export, video recording, and a debug overlay. The pipeline is built in Python around MediaPipe Hands, OpenCV, and NumPy.

### Why it matters
Touchless, mid-air interaction is a growing branch of human–computer interaction (HCI): it removes the need for a stylus, touchscreen, or mouse and enables hygienic, hands-free input that is valuable in medical, public-display, and AR/VR contexts. Gesture-driven drawing is also an accessible, intuitive creative tool and a strong demonstration of practical real-time computer vision. The main usability caveat for any such system is "gorilla arm" fatigue from sustained mid-air gesturing.

### How it works / Recommended approach
A webcam feed is processed frame-by-frame. MediaPipe Hands runs a two-stage ML pipeline — a palm-detection model locates the hand, then a landmark model returns 21 3D hand-knuckle keypoints; in video/live-stream mode it reuses the prior frame's bounding box and only re-runs palm detection when tracking confidence drops, keeping latency low (~12–17 ms/frame on mobile-class hardware). The app inspects which fingers are extended to classify gestures (e.g., index finger = draw, multi-finger combos = switch mode/color/brush size, open palm = clear). The active fingertip landmark is rescaled from normalized coordinates to canvas pixels and accumulated into a stroke; NumPy handles fast canvas compositing, and OpenCV renders the UI/palette and writes saved images and recorded video.

### State of the art & comparable work
MediaPipe Hands ([Google AI Edge docs](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)) is the de-facto landmark model; the related [Gesture Recognizer](https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer) adds a trainable classifier head. Comparable open-source "air canvas" projects include [KrShahil/Air-Drawing-System](https://github.com/KrShahil/Air-Drawing-System), [SharvilTalele/Air-Canvas](https://github.com/SharvilTalele/Air-Canvas), and [SakshamShandilya/AirSketch](https://github.com/SakshamShandilya/AirSketch). For the jitter problem, the [1€ Filter](https://gery.casiez.net/1euro/) (Casiez et al., CHI 2012) is the standard speed-adaptive smoother and outperforms Kalman filtering on lag-vs-jitter.

### Tech stack
- Python
- MediaPipe Hands (21-landmark detection)
- OpenCV (capture, rendering, image/video I/O)
- NumPy (canvas math, frame processing)
- scikit-learn / ML utilities (gesture logic)

### Key challenges & risks
- Fingertip jitter producing shaky strokes (needs smoothing/spline fitting).
- Gesture false positives and accidental mode switches from overlapping finger states.
- Tracking robustness across lighting, skin tones, and cluttered backgrounds.
- End-to-end latency hurting drawing responsiveness.
- Saving/export artifacts and arm-fatigue ("gorilla arm") in extended use.

### Suggested next steps
- Add a **1€ Filter** (or Catmull-Rom/Bézier spline) to smooth fingertip paths and remove jitter.
- Replace hand-coded finger heuristics with a trained MediaPipe Gesture Recognizer for more reliable, extensible gestures.
- Add gesture debouncing / dwell-time confirmation to prevent accidental mode switches.
- Push the source to a public GitHub repo with a demo GIF and clear README (no repo currently found under github.com/Kedhareswer).
- Explore a browser port (MediaPipe Tasks Web + Canvas) for zero-install sharing.
- Add layered drawing, pressure-by-speed brushes, and a usability evaluation.

### References
- [MediaPipe Hand Landmarker — Google AI Edge](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)
- [MediaPipe Gesture Recognizer — Google AI Edge](https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer)
- [1€ Filter (Casiez et al., CHI 2012)](https://gery.casiez.net/1euro/)
- [KrShahil/Air-Drawing-System (comparable project)](https://github.com/KrShahil/Air-Drawing-System)
- [SakshamShandilya/AirSketch (comparable project)](https://github.com/SakshamShandilya/AirSketch)
- [Gesture-based Interaction for AR Systems: A Short Review (ACM)](https://dl.acm.org/doi/fullHtml/10.1145/3594806.3594815)

_Researched via web search · 7 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
