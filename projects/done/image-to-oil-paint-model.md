# Image-to-Oil-Paint Model

**Status:** Done - Deployed · **Score:** 5/5

**Idea:** 2025-01-10   **Started:** 2025-01-17   **Completed:** 2025-01-31

## Description
Converts digital images into an oil-paint-style artwork.

## Skills & Tech
`Python` · `TensorFlow` · `Open-CV` · `Streamlit` · `CSS` · `ML` · `DL`

## Approach
Optimized inference pipeline for real-time use

## Methodology
Filtering, Grayscale, Combination

## Challenges
optimization for real-time use

## Outcomes
Efficient deployment with real-time conversion speed and high-quality output

## Tags
`Other` · `Web`

## Links
- **GitHub:** <https://github.com/Kedhareswer/Image-to-Oil_Paint>
- **Live:** `Image-to-oil-paint` _(name only in source — no URL)_

## 🔬 Research & Enrichment

### Overview
Image-to-Oil-Paint ("Artify") is a web app that converts an uploaded photo into oil-painting-style artwork. The repository (github.com/Kedhareswer/Image-to-Oil_Paint) is a Next.js/React/TypeScript frontend paired with a small Python image-processing backend. Despite the portfolio listing "TensorFlow / ML / DL", the actual `scripts/oil_paint_converter.py` uses **only classical computer vision** (OpenCV + NumPy) — there is no neural network. It exposes upload, brush-size, intensity and color-vibrance controls and a download button.

### Why it matters
Photo-to-painting stylization is a popular non-photorealistic-rendering (NPR) problem with real uses in content creation, social filters, print-on-demand art and design mockups. A classical-CV approach is valuable because it runs cheaply on CPU with no GPU, model weights, or training data — making it easy to deploy and fast enough for near-real-time conversion, which was the project's stated goal.

### How it works / Recommended approach
The pipeline (grounded in `oil_paint_converter.py`) runs six stages: (1) resize/downscale images over ~1000px for speed; (2) `cv2.bilateralFilter()` for edge-preserving smoothing; (3) `cv2.stylization()` for a soft painterly abstraction; (4) `cv2.addWeighted()` to blend the stylized result with the original so structure is preserved; (5) `cv2.kmeans()` color quantization with a vibrance boost for the flat, banded oil-paint palette; (6) canvas texture via `np.random.normal()` plus a glossy finish. The "Filtering, Grayscale, Combination" methodology in the project notes maps onto this filter→quantize→blend chain.

### State of the art & comparable work
- **OpenCV xphoto `oilPainting`** — the library's own histogram-based oil filter, a direct classical baseline ([docs](https://docs.opencv.org/4.x/dd/d8c/tutorial_xphoto_oil_painting_effect.html)).
- **Hertzmann, "Painterly Rendering with Curved Brush Strokes" (SIGGRAPH 1998)** — foundational stroke-based rendering.
- **Gatys et al., "Image Style Transfer Using CNNs" (CVPR 2016)** — neural style transfer ([review](https://ar5iv.labs.arxiv.org/html/1705.04058)).
- **Stylized Neural Painting (CVPR 2021)** — vectorized stroke prediction; an oil model runs on Replicate ([project](https://jiupinjia.github.io/neuralpainter/), [arXiv](https://arxiv.org/abs/2011.08114)).
- **Paint Transformer (ICCV 2021)** — feed-forward stroke prediction, near-real-time 512px ([arXiv](https://arxiv.org/abs/2108.03798)).

### Tech stack
Next.js · React · TypeScript · Tailwind CSS · shadcn/ui (frontend); Python 3.8+, OpenCV (`opencv-python==4.8.1.78`), NumPy `1.26.2` (backend); Dockerfile + serverless dir; deployed on Vercel. GPL-2.0 licensed.

### Key challenges & risks
- Live demo at `artify-ai-ivory.vercel.app` currently returns **HTTP 404** — deployment appears down.
- Skills metadata (TensorFlow/Streamlit/ML/DL) does not match the real classical-CV implementation; worth correcting.
- Calling Python from a serverless Next.js host is fragile (cold starts, missing OpenCV native deps); likely cause of the 404.
- Hand-tuned filter parameters generalize unevenly across image types.

### Suggested next steps
- Restore/redeploy the live demo and verify the Python function on Vercel serverless (or move heavy CV to a separate FastAPI service).
- Correct the portfolio skill tags to "Python, OpenCV, NumPy, Next.js, TypeScript".
- Add an optional neural mode (Paint Transformer or Stylized Neural Painting) behind a toggle for higher fidelity.
- Add before/after sample images and benchmark conversion latency in the README.
- Pin/upgrade OpenCV and add a CI smoke test for the conversion function.

### References
- [Repo: Kedhareswer/Image-to-Oil_Paint](https://github.com/Kedhareswer/Image-to-Oil_Paint)
- [OpenCV oil painting effect](https://docs.opencv.org/4.x/dd/d8c/tutorial_xphoto_oil_painting_effect.html)
- [Non-Photorealistic Rendering with OpenCV (LearnOpenCV)](https://learnopencv.com/non-photorealistic-rendering-using-opencv-python-c/)
- [Stylized Neural Painting (CVPR 2021)](https://arxiv.org/abs/2011.08114)
- [Paint Transformer (ICCV 2021)](https://arxiv.org/abs/2108.03798)
- [Neural Style Transfer: A Review](https://ar5iv.labs.arxiv.org/html/1705.04058)

_Researched via web search · 8 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
