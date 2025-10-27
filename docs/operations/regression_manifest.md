# 🧭 Master Regression Manifest

Version: 1.0  
Scope: macOS (primary), Windows (secondary)

Links: `/docs/foundation/prd.md` · `/docs/foundation/architecture.md` · `/docs/foundation/dev_checklist.md`

---

## Overview
This document defines regression expectations across ClipForge’s lifecycle. For each phase, it lists the features introduced, what must remain stable from prior work, and high-level dependencies. It is a planning reference — not a record of execution results.

---

## Phase Summary Table

| Phase | Core Features Introduced | Regression Scope | Dependencies |
|-------|---------------------------|------------------|--------------|
| Phase 00 – Init | Repo scaffolding, Node/Electron/Vite setup, scripts | N/A | None |
| Phase 01 – Foundation & Setup | Electron app bootstrap, window, preload bridge, security flags | Init stability, dev startup, scripts | Init |
| Phase 02 – Media Library & Import | Drag-drop, file picker, validation, metadata, thumbnails | Foundation intact (window, IPC), app remains stable | Foundation |
| Phase 03 – Timeline & Playback | 2-track timeline, trim/split/reorder/delete, preview sync, shortcuts | Import continues to work; preview at 30+ fps; scrubbing < 100ms | Media Library & Foundation |
| Phase 04 – Export Pipeline | Concat/scaling via FFmpeg, progress ≥1/sec, cancel | Timeline editing/preview remain correct; app stable | Timeline & Foundation |
| Phase 05 – Recording Engine | Screen, webcam, PiP; compose overlay at stop | Export remains stable; timeline operations unaffected | Foundation, Media Library, Timeline |
| Phase 06 – Packaging & Cross-Module QA | electron-forge packaging, fuses, asarUnpack, cross-platform smoke | All prior flows function in packaged app on macOS/Windows | All prior phases |

---

## Phase Details

### Phase 00 – Initialization
**Introduced Features:**
- Project scaffolding, package manager lockfile, baseline scripts (dev/build)
- Vite + Electron integration

**Regression Scope:**
- None (first phase)

**Dependencies:**
- Establishes toolchain versions pinned for all later phases

---

### Phase 01 – Foundation & Setup
**Introduced Features:**
- Electron `BrowserWindow` with `contextIsolation: true`, `nodeIntegration: false`
- `preload` bridge exposing minimal, typed IPC
- App lifecycle, error boundaries, logger/env utils

**Regression Scope:**
- Dev startup consistently works (launch < 5s target)
- Renderer cannot access Node APIs directly; IPC bridge functional

**Dependencies:**
- Init; sets security posture required by all future IPC

---

### Phase 02 – Media Library & Import
**Introduced Features:**
- Drag-drop and file picker import
- Validation (format: MP4/MOV/WebM, size ≤ 500MB)
- Metadata extraction (duration, resolution), thumbnail generation

**Regression Scope:**
- App stable under multiple imports; error toasts for invalid/oversized files
- Foundation IPC intact; no security regressions

**Dependencies:**
- Foundation (IPC, window); provides assets for timeline and export

---

### Phase 03 – Timeline & Playback
**Introduced Features:**
- 2 tracks, time ruler, playhead
- Clip add/trim/split/reorder/delete; undo (≥10 actions)
- Preview using HTML5 `<video>`; Space toggles play/pause; scrubbing < 100ms

**Regression Scope:**
- Media imports remain visible/usable; no corruption of file paths
- Performance: 30+ fps with 10+ clips; memory stable during 15-minute session

**Dependencies:**
- Media Library for sources; Foundation for IPC and app shell

---

### Phase 04 – Export Pipeline
**Introduced Features:**
- Export plan from timeline (respect trims/order)
- FFmpeg concat (stream copy when possible) and scaling (720p/1080p/Source)
- Progress updates ≥ 1/sec; cancel; error handling

**Regression Scope:**
- Timeline edits remain correct post-export
- Preview unaffected by export runs; app responsive during long exports

**Dependencies:**
- Timeline data integrity; Foundation process management

---

### Phase 05 – Recording Engine
**Introduced Features:**
- Screen recording (desktopCapturer + MediaRecorder)
- Webcam recording (getUserMedia + MediaRecorder)
- PiP by recording both streams separately and composing overlay at stop via FFmpeg
- Auto-add composed clip to Media Library and Timeline

**Regression Scope:**
- Export continues to succeed post-record; previously imported media unaffected
- Performance remains within targets; no memory leaks from recording sessions

**Dependencies:**
- Foundation (permissions, IPC), Media Library (asset registration), Timeline (placement)

---

### Phase 06 – Packaging & Cross-Module QA
**Introduced Features:**
- electron-forge makers; fuses; `asarUnpack` for FFmpeg binaries
- Packaged app smoke tests (macOS + Windows)
- README setup/build; basic release checklist

**Regression Scope:**
- End-to-end: Import → Edit → Preview → Export works in packaged app
- Recording modes function; export progress visible; keyboard shortcuts mapped per OS

**Dependencies:**
- All prior phases; validates release readiness

---

## Notes
- This manifest defines expectations; it does not record test outcomes.
- Update only if phases or dependencies change.
- Cross-reference per-phase debug/validation documents for execution results.

(End)
