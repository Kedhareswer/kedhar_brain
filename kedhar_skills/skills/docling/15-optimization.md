# Optimization Results

## Benchmark Summary

Tested on 35-page Form ADV wrap fee brochure (J.P. Morgan Securities LLC, 657KB), CPU only.

### Pipeline Config Comparison

| Config | Time | Speedup | Quality |
|--------|------|---------|---------|
| **Baseline** (ACCURATE + all enrichments) | 257.6s | 1x | Reference |
| **ACCURATE + no enrichments** | 187s | **1.4x** | Identical |
| FAST tables + no enrichments | 117.7s | 2.2x | **Degraded** |
| No table structure | 103.4s | 2.5x | No cells |

### Layout Model Comparison (OCR=off, TableFormer=ACCURATE)

| Layout Model | Time | Texts | Tables | Pics | Recommendation |
|-------------|------|-------|--------|------|----------------|
| `heron` (default) | **3.79 min** | 576 | 10 | 0 | Slowest on CPU; `std::bad_alloc` errors |
| `egret-medium` | **1.74 min** | 597 | 11 | 0 | Fastest; possible false-positive table |
| `egret-large` | **1.79 min** | 590 | 10 | 2 | Misclassifies regions as pictures |
| `egret-xlarge` | **2.33 min** | 605 | 10 | 0 | **Best choice** — most text, correct tables |

### OCR Impact (with heron)

| Config | Time | Texts | Notes |
|--------|------|-------|-------|
| OCR=on (default) | 218.4s | 562 | OCR loads but barely runs on native PDFs |
| OCR=off | 218.2s | 586 | **0.1% faster** — negligible for native PDFs |

OCR adds negligible time for native-text PDFs but causes `std::bad_alloc` crashes on some pages. Disabled as a safety measure.

## What We Changed (Current Optimized Config)

```python
PdfPipelineOptions(
    do_ocr=False,                         # native PDFs — OCR not needed
    do_table_structure=True,
    table_structure_options=TableStructureOptions(
        do_cell_matching=True,
        mode=TableFormerMode.ACCURATE,    # MUST stay ACCURATE
    ),
    # enrichments disabled — not needed for brochures
    # do_code_enrichment=False,           # (already False by default)
    # do_formula_enrichment=False,        # (already False by default)
    # do_picture_classification=False,    # (already False by default)
    # do_picture_description=False,       # (already False by default)
)
```

### Pending: Switch Layout Model to egret-xlarge

Benchmark shows `egret-xlarge` is **1.6x faster** than `heron` with **better accuracy** (605 vs 576 texts, same 10 tables). Requires local model download on Windows due to HuggingFace symlink issues:

```python
from docling.datamodel.pipeline_options import LayoutOptions
from docling.datamodel.layout_model_specs import DOCLING_LAYOUT_EGRET_XLARGE

pipeline_options = PdfPipelineOptions(
    do_ocr=False,
    layout_options=LayoutOptions(model_spec=DOCLING_LAYOUT_EGRET_XLARGE),
    artifacts_path="path/to/local/models",  # needed on Windows
    ...
)
```

## FAST Mode — NOT Safe for Brochures

We tested `TableFormerMode.FAST` and found it **degrades table structure** on several tables:

| Table | Page | ACCURATE | FAST | Issue |
|-------|------|----------|------|-------|
| 0 (cover) | 1 | 31x12 | **23x1** | Lost all column structure |
| 1 (TOC) | 1 | 28x3 | **27x3** | Lost a row |
| 3 (fees) | 9 | 12x2 | **11x4** | Wrong column count |
| 2, 4-9 | various | Match | Match | OK |

**3 out of 10 tables degraded.** FAST mode cannot be used for brochure extraction where cell-level accuracy matters.

## Time Breakdown (with heron, current default)

| Stage | Time (approx) | % |
|-------|---------------|---|
| Layout detection (Heron RT-DETR) | ~100s | 53% |
| Table structure (ACCURATE TableFormer) | ~75s | 40% |
| PDF parsing + text extraction | ~10s | 5% |
| Other (OCR init, post-processing) | ~3s | 2% |

With `egret-xlarge`, layout detection drops to ~60s, bringing total from ~3.8 min to ~2.3 min.

## What Would Make It Significantly Faster

| Optimization | Expected Impact | Feasibility | Status |
|-------------|----------------|-------------|--------|
| **Switch to egret-xlarge** | **1.6x faster** | Easy | Benchmarked, ready to apply |
| **Disable OCR** | Negligible for native PDFs | Easy | **Done** |
| **GPU (CUDA)** | 5-10x on layout + table stages | Requires NVIDIA GPU | Not available |
| **ONNXRuntime optimization** | 1.5-2x inference | May already be active | Untested |
| **Batch page parallelism** | 2-4x throughput | Higher memory | Untested |
| **Cache layout results** | Skip re-processing | Only for re-runs | Untested |

The two main bottlenecks (layout detection 53% + table structure 40%) are both ML model inference. Switching to egret-xlarge addresses the largest bottleneck. Only GPU acceleration would meaningfully reduce the table structure stage.

## Recommendation

- **Keep ACCURATE** for all brochure extraction — FAST corrupts table structure
- **Disable OCR** — our PDFs have native text; OCR adds nothing but causes `std::bad_alloc` crashes
- **Switch layout model from heron to egret-xlarge** — 1.6x faster, more text extracted, same table accuracy
- **Disable enrichments** (code, formula, picture) — already off by default, confirmed not needed
- **GPU is the only path to further major speedup** — table structure (40% of time) can only be reduced by GPU

## Benchmark Artifacts

Full benchmark outputs (JSON + PDF for each layout model) are in `benchmark/`:

```
benchmark/
├── heron/          new.pdf + new.json
├── egret-medium/   new.pdf + new.json
├── egret-large/    new.pdf + new.json
├── egret-xlarge/   new.pdf + new.json
└── summary.json
```

Each `new.json` includes a `_benchmark` field with timing metadata. Use the frontend viewer to compare bounding box accuracy across models.
