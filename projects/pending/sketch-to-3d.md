# Sketch to 3d

**Score:** 5/5 · **Owner:** Kedhareswer Naidu

## 🔬 Research & Enrichment

### Overview
"Sketch to 3D" is a planned project to turn a 2D freehand drawing (a single line sketch) into a 3D shape — typically a watertight, textured mesh usable in game engines or CAD. It sits at the intersection of sketch-based modeling and modern single-image 3D reconstruction. The core difficulty is that a sketch is sparse, abstract, and view-ambiguous, so the system must hallucinate plausible geometry and texture from very little signal. Today this is feasible with pretrained vision features plus learned 3D generators, rather than training a bespoke network from scratch.

### Why it matters
Manual 3D modeling (box-modeling, sculpting, retopology, UV unwrap) is slow and skill-intensive, gating asset creation for games, product design, VR/AR, and e-commerce. Letting a designer "draw in 2D" and get an editable 3D model collapses days of work into minutes and lowers the barrier for non-experts. Commercial demand is real: tools like [Kaedim](https://www.kaedim3d.com/) productized exactly this 2D-to-3D pipeline for studios.

### How it works / Recommended approach
A pragmatic, modern pipeline avoids training a sketch→mesh net directly and instead bridges to the strong image→3D ecosystem:
1. **Sketch → colored reference image** using a sketch-conditioned diffusion model (ControlNet on SDXL) guided by an optional text prompt — the approach taken by [Sketch3D](https://arxiv.org/abs/2404.01843).
2. **Reference image → 3D** via a single-image reconstruction model: a multi-view diffusion step (Zero123++) feeding a sparse-view Large Reconstruction Model, e.g. [InstantMesh](https://arxiv.org/abs/2404.07191) or [LRM](https://arxiv.org/abs/2311.04400) (triplane NeRF, DINO encoder). InstantMesh adds FlexiCubes iso-surface extraction to emit a textured mesh in ~10s.
3. **Refinement** by optimizing projected silhouettes/contours against the sketch with a 2D Chamfer loss, as in [Sketch2Mesh](https://arxiv.org/abs/2104.00482).
For a leaner, category-specific MVP, the classic [Sketch2Model](https://arxiv.org/abs/2105.06663) (view-aware mesh deformation + SoftRas differentiable rendering) or zero-shot [Sketch-A-Shape](https://arxiv.org/abs/2307.03869) (condition a 3D generator on frozen CLIP features, train only on renders) are simpler starting points.

### State of the art & comparable work
- [InstantMesh](https://arxiv.org/abs/2404.07191) — Zero123++ + sparse-view LRM + FlexiCubes; fast, high-quality textured meshes.
- [LRM](https://arxiv.org/abs/2311.04400) — transformer regresses a triplane NeRF from one image (~5s).
- [Sketch-A-Shape](https://arxiv.org/abs/2307.03869) — zero-shot, no paired sketch-3D data needed.
- [Sketch2Mesh](https://arxiv.org/abs/2104.00482) (ICCV'21) — MeshSDF + differentiable contour refinement & editing.
- [Sketch2Model](https://arxiv.org/abs/2105.06663) (CVPR'21) — view-aware single-sketch modeling.
- [High-fidelity 3D mesh from a single sketch (SS2M)](https://www.nature.com/articles/s41598-025-30843-3) — 2025 encoder-decoder with shape constraints.

### Tech stack
Python, PyTorch; Stable Diffusion XL + ControlNet (sketch conditioning); Zero123++ / InstantMesh / Shap-E; differentiable rendering (nvdiffrast, SoftRas); FlexiCubes/Marching Cubes; 3D Gaussian Splatting (optional); trimesh/Open3D/PyTorch3D; Gradio demo; NVIDIA GPU (RTX 4090-class).

### Key challenges & risks
- Sketch-to-render **domain gap**: freehand strokes differ sharply from synthetic line renders; needs domain adaptation or feature-space bridging.
- **View ambiguity**: a single sketch underconstrains pose/depth — condition on an explicit viewpoint.
- Back-side / occluded geometry is hallucinated and often degraded.
- Mesh quality for production (clean topology, UVs) usually still needs retopology.
- Compute and latency for diffusion + reconstruction stages.

### Suggested next steps
- Define scope: pick a few object categories and target output (mesh vs. point cloud vs. Gaussian splat).
- Build a baseline by chaining ControlNet → InstantMesh on a Gradio app; evaluate qualitatively.
- Assemble data: ShapeNet-Sketch / ProSketch / AmateurSketch (SketchX) and Objaverse renders; generate synthetic sketches.
- Add a sketch-contour Chamfer refinement loop for fidelity to the drawing.
- Evaluate with Chamfer Distance, F-score, and CLIP similarity vs. baselines.
- Add export (FBX/OBJ/GLB) and optional auto-retopology.

### References
- [InstantMesh (arXiv 2404.07191)](https://arxiv.org/abs/2404.07191)
- [LRM: Large Reconstruction Model (arXiv 2311.04400)](https://arxiv.org/abs/2311.04400)
- [Sketch3D (arXiv 2404.01843)](https://arxiv.org/abs/2404.01843)
- [Sketch-A-Shape (arXiv 2307.03869)](https://arxiv.org/abs/2307.03869)
- [Sketch2Mesh, ICCV 2021 (arXiv 2104.00482)](https://arxiv.org/abs/2104.00482)
- [Sketch2Model, CVPR 2021 (arXiv 2105.06663)](https://arxiv.org/abs/2105.06663)
- [High-fidelity 3D mesh from a single sketch, Nature Sci. Reports 2025](https://www.nature.com/articles/s41598-025-30843-3)
- [3D Shape Reconstruction from Sketches via Multi-view CNNs, 3DV 2017 (arXiv 1707.06375)](https://arxiv.org/abs/1707.06375)
- [Kaedim — production 2D-to-3D tool](https://www.kaedim3d.com/)

_Researched via web search · 9 sources · pending_

---
_Source: Pending Projects sheet · generated 2026-06-02 from project.xlsx_
