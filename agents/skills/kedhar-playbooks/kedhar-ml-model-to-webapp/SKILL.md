---
name: kedhar-ml-model-to-webapp
description: Turn a trained ML/DL model (TensorFlow/Keras/PyTorch/scikit-learn) into a deployable app — a FastAPI inference service plus a lightweight web UI (or Streamlit) — then deploy. Use when shipping a model or notebook as a demo/app for Kedhar — image-to-X, classifiers, computer vision, audio/speech, emotion recognition. Keywords "deploy model, model to app, inference API, FastAPI model serving, streamlit, ML demo, computer vision app, image to".
---

# Kedhar ML Model → Web App

The pattern behind Image-to-Sketch, Image-to-Oil-Paint, Speech/Emotion Recognition, and the digit/traffic CV demos: take a working model and make it a usable, deployed app.

## Two delivery modes
- **Fast demo:** Streamlit single-file app (great for CV/audio showcases, HF Spaces).
- **Productiony:** FastAPI inference service + Next.js front (Kedhar's default web stack).

## FastAPI inference service
```python
# load the model ONCE at startup, not per request
@app.on_event("startup")
def _load(): app.state.model = load_model("model.keras")

@app.post("/predict")
async def predict(file: UploadFile):
    x = preprocess(await file.read())   # MUST mirror training preprocessing exactly
    y = app.state.model.predict(x)
    return {"label": decode(y), "confidence": float(y.max())}
```

## Checklist
- **Preprocessing parity** — inference transforms must match training (resize, normalize, color space, sample rate). #1 cause of "works in notebook, wrong in app".
- Load weights once; keep requests stateless.
- Validate inputs (file type/size); return structured JSON with confidence.
- For images/audio: accept upload, show prediction + the input back in the UI.
- Pin versions (`requirements.txt`); add a `Dockerfile` for reproducible deploy.

## Deploy
- Model API → Render / Railway / **Hugging Face Spaces** (Docker).
- Frontend → Vercel (calls the API; configure CORS — see `kedhar-fastapi-backend`).

## Definition of done
Live demo URL, upload→prediction works, preprocessing matches training, README per `kedhar-project-conventions`.
