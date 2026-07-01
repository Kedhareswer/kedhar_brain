> 📦 [Kedhareswer/ObjectDetection](https://github.com/Kedhareswer/ObjectDetection) · ⭐ 0 · TypeScript · updated 2025-06-22  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# Image Classification App with TensorFlow.js

![Vite](https://img.shields.io/badge/Vite-frontend-blue?logo=vite)
![Convex](https://img.shields.io/badge/Convex-backend-purple?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRjZGNkY2IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy02LjYyIDAtMTItNS4zOC0xMi0xMnM1LjM4LTEyIDEyLTEyIDEyIDUuMzggMTIgMTItNS4zOCAxMi0xMiAxMnoiLz48L3N2Zz4=)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-ML-orange?logo=tensorflow)
![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-styling-38B2AC?logo=tailwindcss)

---

## 🚀 Overview

This web app lets you classify images using AI directly in your browser! Built with React, TensorFlow.js (MobileNet), and Convex for a seamless, full-stack experience. Upload an image, get instant in-browser predictions, and view your recent classification history.

---

## ✨ Features

- 🖼️ **Image Upload:** Drag & drop or file picker
- 🤖 **AI Classification:** Fast, in-browser predictions with MobileNet
- 📝 **History:** View your last classifications with images, model, time, and top predictions
- ☁️ **Cloud Storage:** Images and results stored in Convex
- 📊 **Loading Skeletons:** Smooth UX with loading states
- 📱 **Responsive UI:** Built with Tailwind CSS

---

## 🗂️ Project Structure

| Path           | Description                  |
| -------------- | --------------------------- |
| `src/`         | Frontend (React, TS, UI)    |
| `convex/`      | Backend (Convex functions)  |
| `public/`      | Static assets (classes)     |
| `package.json` | Scripts & dependencies      |

---

## 🏗️ Architecture

### System Flow

```mermaid
flowchart TD
  subgraph Frontend
    A["User"]
    B["React App"]
    C["ImageClassifier"]
    D["ClassificationHistory"]
  end
  subgraph Backend
    E["Convex Functions"]
    F["Convex Storage"]
    G["Convex DB"]
    H["Convex Auth"]
  end
  subgraph Assets
    I["imagenet_classes.json"]
  end
  A --> B
  B --> C
  B --> D
  C -->|"Classify Image (TensorFlow.js)"| C
  C -->|"Save Result"| E
  E --> F
  E --> G
  D -->|"Fetch History"| E
  B --> H
  C --> I
```

---

## 🛠️ Technology Stack

| Layer      | Tech/Library                |
| ---------- | -------------------------- |
| Frontend   | React, TypeScript, Vite     |
| Styling    | Tailwind CSS                |
| ML         | TensorFlow.js, MobileNet    |
| Backend    | Convex                      |
| Auth       | Convex Auth (Anonymous)     |
| Storage    | Convex Storage              |

---

## 📦 Main Scripts

| Script         | Description                        |
| -------------- | ---------------------------------- |
| `npm run dev`  | Start frontend & backend (dev)     |
| `npm run lint` | Typecheck & lint all code          |

---

## 🏁 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the app (frontend + backend):**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   The app will open automatically (default: [http://localhost:5173](http://localhost:5173))

---

## 🧠 Model Details

- **Model:** MobileNet v2 (TensorFlow.js)
- **Classes:** 1000+ (from `public/imagenet_classes.json`)
- **Top-5 predictions** shown for each image
- **Processing time** is displayed for each classification

---

## 📚 Further Reading

- [Convex Docs](https://docs.convex.dev/)
- [TensorFlow.js Models](https://www.tensorflow.org/js/models)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
