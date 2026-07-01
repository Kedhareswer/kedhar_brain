# Image-to-Sketch Model

**Status:** Done - Deployed · **Score:** 4/5

**Idea:** 2024-09-29   **Started:** 2025-01-01   **Completed:** 2025-01-10

## Description
Converts digital images into realistic, hand-drawn sketches using deep learning techniques.

## Skills & Tech
`Python` · `TensorFlow` · `Keras` · `Open-CV` · `ML` · `DL`

## Approach
Conversion of images into sketch style using deep learning models

## Methodology
GAN-based architecture to convert images to sketches

## Challenges
Difficulty in capturing fine details, ensuring realism in sketches

## Outcomes
High-quality, realistic sketches generated with fine detail and minimal artifacts

## Tags
`Other` · `Web` · `AI` · `ML`

## Links
- **GitHub:** <https://github.com/Kedhareswer/MLGeneFunction>
- **Live:** <https://image-to-sketch-wine.vercel.app/>

## 🔬 Research & Enrichment

### Overview
Image-to-Sketch (repo `Kedhareswer/MLGeneFunction`) converts photographs into hand-drawn-style sketches. The repository actually contains two layers: a deep-learning research prototype (a single Jupyter notebook, ~95% of the repo) that trains a TensorFlow/Keras convolutional encoder–decoder on paired photo/sketch data, and a deployed Next.js web product (on Vercel) offering pencil, charcoal, and detailed sketch styles with adjustable line strength, detail, and shading. The notebook learns the photo→sketch mapping from the CUHK Face Sketch Database (CUFS). Note: the README describes the shipped front end as client-side Canvas/Web-Worker processing, so the live demo and the trained model may not be the same pipeline.

### Why it matters
Automated photo-to-sketch conversion is a long-studied non-photorealistic-rendering and image-to-image-translation problem with uses in digital art, avatars, character design, forensic/portrait sketching, and creative tooling. It is a clean, well-bounded paired-translation task that demonstrates the full ML lifecycle—data prep, augmentation, an encoder–decoder model, and deployment behind a polished UI.

### How it works / Recommended approach
The notebook loads 188 photo/sketch pairs from CUFS, resizes to 256×256, normalizes to [0,1], and augments 8× (horizontal/vertical flips and 90° rotations) to ~1,504 paired samples. It uses OpenCV for I/O and preprocessing and imports Keras layers (`Conv2D`, `MaxPool2D`, `UpSampling2D`, `Dropout`, `Dense`, `Input`)—a convolutional encoder–decoder / U-Net-style network that regresses a sketch from a photo (the project notes call it "GAN-based," but the visible code is a supervised CNN autoencoder rather than an adversarial GAN). To strengthen results, migrate to a proper **Pix2Pix** conditional GAN (U-Net generator + PatchGAN discriminator, loss = adversarial + λ·L1, λ≈100), which is the standard high-quality approach for this exact task.

### State of the art & comparable work
- [Im2Pencil (CVPR 2019)](https://arxiv.org/abs/1903.08682) — controllable pencil illustration with separate outline/shading branches.
- [APDrawingGAN (CVPR 2019)](https://github.com/yiranran/APDrawingGAN) — hierarchical GANs for artistic portrait line drawings.
- [Pix2Pix (Isola et al.)](https://www.tensorflow.org/tutorials/generative/pix2pix) — paired image-to-image translation baseline.
- [SketchyGAN (CVPR 2018)](https://openaccess.thecvf.com/content_cvpr_2018/papers/Chen_SketchyGAN_Towards_Diverse_CVPR_2018_paper.pdf) — sketch↔image synthesis.
- [OpenCV "dodge" pencil sketch](https://www.analyticsvidhya.com/blog/2021/07/build-sketches-from-photographs-using-opencv/) — the classical non-ML baseline.

### Tech stack
Model: Python, TensorFlow/Keras, OpenCV, NumPy, Matplotlib, tqdm (trained on Kaggle). Product: Next.js 15 / React 19, TypeScript, Tailwind CSS, Radix UI, Canvas API + Web Workers; deployed on Vercel.

### Key challenges & risks
- Tiny, domain-narrow dataset (CUFS = frontal faces); poor generalization to scenes, objects, or full bodies.
- Encoder–decoder + L1 alone tends to produce blurry, over-smoothed sketches; fine line detail is hard to preserve.
- Notebook↔product mismatch: the live demo may be a classical filter, not the trained net—unclear which actually ships.
- No quantitative evaluation (SSIM/FSIM/FID) reported, so quality is only assessed visually.

### Suggested next steps
- Adopt Pix2Pix (U-Net + PatchGAN, adversarial + L1) or CycleGAN to sharpen edges and tonal shading.
- Add quantitative metrics: SSIM, FSIM, and FID on a held-out CUFS/CUFSF split.
- Expand/diversify data beyond faces (sketch datasets, augmentation, synthetic pairs) for general photos.
- Clarify and unify the pipeline—serve the trained model via an inference API (ONNX/TF.js) so the demo reflects the DL model.
- Add perceptual (VGG) loss and try diffusion-based stylization for higher fidelity.

### References
- [Im2Pencil: Controllable Pencil Illustration (CVPR 2019)](https://arxiv.org/abs/1903.08682)
- [APDrawingGAN (GitHub)](https://github.com/yiranran/APDrawingGAN)
- [Pix2Pix — TensorFlow tutorial](https://www.tensorflow.org/tutorials/generative/pix2pix)
- [SketchyGAN (CVPR 2018 PDF)](https://openaccess.thecvf.com/content_cvpr_2018/papers/Chen_SketchyGAN_Towards_Diverse_CVPR_2018_paper.pdf)
- [CUHK Face Sketch Database (CUFS) — Kaggle](https://www.kaggle.com/datasets/arbazkhan971/cuhk-face-sketch-database-cufs/code)
- [CUHK Face Sketch FERET Database (CUFSF)](http://mmlab.ie.cuhk.edu.hk/cufsf/)
- [Pencil sketch with OpenCV (dodge technique)](https://www.analyticsvidhya.com/blog/2021/07/build-sketches-from-photographs-using-opencv/)

_Researched via web search · 7 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
