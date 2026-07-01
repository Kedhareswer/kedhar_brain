# Pillar

**Status:** Done - Deployed · **Score:** 3/5

**Idea:** 2026-02-01   **Started:** 2026-02-01   **Completed:** 2026-02-03

## Description
Dynamic Island for Windows

## Approach
Setup environment with Node.js and Rust, install dependencies, develop using Tauri dev server, then build production Windows executable

## Methodology
Dynamic Island for windows that i can use it to manage notifications, set timers, control media and adjust volume, brightness settings.

## Challenges
Integrating with Windows notification system and media controls
capturing system events without invasive hooks
controlling brightness and volume

## Tags
`Desktop App`

## Links
- **GitHub:** <https://github.com/warpirate/pillar-dynamic-island-for-windows>

## 🔬 Research & Enrichment

### Overview
Pillar is a Windows desktop application that recreates Apple's "Dynamic Island" as a transparent, always-on-top overlay docked to the top-center of the primary display. It is built with Tauri 2.0 (Rust backend) and a React 18 + TypeScript + Tailwind CSS frontend, with Motion driving the expand/collapse animations. The island sits idle with near-zero resource use, expands on hover, repositions on display changes, and hides during fullscreen apps. It also bundles a "Prism AI" assistant that calls the Groq API from the Tauri backend.

### Why it matters
Windows lacks a native, glanceable control surface for media, timers, notifications, and quick system toggles; users juggle the system tray, Action Center, and per-app windows. A Dynamic Island-style overlay consolidates these into one ambient, low-friction UI element. Doing it in Tauri instead of Electron keeps the binary small (the repo is ~73% TypeScript / 23% Rust) and memory low, which matters for an always-running background utility.

### How it works / Recommended approach
Per the README, the Tauri config creates a borderless, transparent, always-on-top window that is hidden from the taskbar and Alt+Tab, is DPI-aware/GPU-accelerated, and stays clickable for hover interactions. The React layer renders the pill and animates state with Motion; hooks manage expansion and system state. The Rust/Tauri backend exposes commands the frontend invokes and hosts the Prism AI feature, which reads a `GROQ_API_KEY` env var and proxies requests to Groq. Structure: `src/` (components, hooks, types, App.tsx), `src-tauri/` (Rust backend), `public/`, `scripts/`; build via `npm run tauri dev` / `tauri build`. For deeper Windows integration, media metadata/transport is best sourced from `Windows.Media.Control` (GlobalSystemMediaTransportControlsSessionManager) via the windows-rs crate.

### State of the art & comparable work
- [DynamicWin](https://github.com/FlorianButz/DynamicWin) — popular C#/.NET Windows island with file tray, widgets, theming (now unmaintained).
- [WindowslandOverlay](https://github.com/FrigonTech/WindowslandOverlay) — overlay showing date and CPU usage, with charge animations.
- [Win Dynamic Island](https://apps.microsoft.com/detail/9pgr4zg2sxw0) — Microsoft Store app targeting Windows 11.
- [Tauri Window Customization](https://v2.tauri.app/learn/window-customization/) and [tauri-plugin-decorum](https://crates.io/crates/tauri-plugin-decorum) — canonical transparent/borderless overlay techniques.

### Tech stack
Tauri 2.0, Rust, React 18, TypeScript, Tailwind CSS, Motion, Vite, PostCSS; Groq API for the Prism AI feature.

### Key challenges & risks
- Transparent + always-on-top + click-through behavior is fiddly on Windows 11 (known Tauri taskbar/fullscreen issues).
- Capturing media/volume/brightness/notification events without invasive hooks requires WinRT/native APIs and per-display DPI handling.
- `GROQ_API_KEY` lives in the backend; key handling, offline fallback, and request cost need care.
- Single-maintainer hobby tooling tends to bit-rot (see DynamicWin); no live demo/distribution channel listed.

### Suggested next steps
- Wire real media controls via the windows-rs [GlobalSystemMediaTransportControlsSessionManager](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssessionmanager) (or the [win-gsmtc](https://docs.rs/win-gsmtc/latest/gsmtc/) wrapper).
- Add brightness/volume via WMI/`IAudioEndpointVolume`; surface timers and Action Center notifications.
- Ship signed installers + auto-update (Tauri updater) and document distribution; add a screenshots/GIF demo to the README.
- Add settings (theme, position, modules) and a file-tray/widget system to match DynamicWin's feature depth.
- Harden Prism AI: secure key storage, streaming responses, graceful offline degradation.

### References
- [Pillar repository](https://github.com/warpirate/pillar-dynamic-island-for-windows)
- [DynamicWin (FlorianButz)](https://github.com/FlorianButz/DynamicWin)
- [WindowslandOverlay (FrigonTech)](https://github.com/FrigonTech/WindowslandOverlay)
- [Win Dynamic Island — Microsoft Store](https://apps.microsoft.com/detail/9pgr4zg2sxw0)
- [Tauri Window Customization](https://v2.tauri.app/learn/window-customization/)
- [tauri-plugin-decorum](https://crates.io/crates/tauri-plugin-decorum)
- [windows-rs GlobalSystemMediaTransportControlsSessionManager](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssessionmanager)
- [win-gsmtc crate](https://docs.rs/win-gsmtc/latest/gsmtc/)

_Researched via web search · 8 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
