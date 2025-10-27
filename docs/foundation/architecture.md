# ClipForge Architecture

Version: 1.0  
Scope: Full stack (Electron main + preload + renderer)

Links: [`prd.md`](./prd.md)

---

## 1) System Overview

ClipForge is a local-first desktop video editor built on Electron. The app integrates recording (screen/webcam), media import, timeline editing, preview, and export into a single native-feeling experience with no backend services in MVP. The architecture prioritizes stability, packaging reliability, and predictable performance on common consumer hardware.

---

## 2) Supermodule Architecture Map

- Foundation & Setup
  - Responsibilities: App bootstrap, window management, preload security bridge, packaging config, environment/logging utilities
  - Components: `main` process (Electron), `preload` bridge, app lifecycle, error boundaries
  - IPC: `app:info:get`, `dialog:open`, `fs:path:validate`
- Media Library & Import
  - Responsibilities: Drag-drop/file-picker import, validation (format/size), basic metadata, thumbnails
  - Components: Media library UI, import/validation services, thumbnailer
  - IPC: `media:validate`, `media:probe` (optional), `media:thumbnail`, `fs:copy-temp`
- Timeline & Playback
  - Responsibilities: Multi-track timeline state, clip manipulation (trim/split/reorder), preview playback, keyboard shortcuts
  - Components: Timeline store (Zustand), timeline UI, player controller, undo stack
  - IPC: `project:autoSave` (optional future), `timeline:exportPlan` (compile export list)
- Recording Engine
  - Responsibilities: Screen, webcam, PiP recording orchestration
  - Components: Capture controller (desktopCapturer/getUserMedia), recorder manager, session tracking
  - IPC: `record:start`, `record:stop`, `record:status`
- Export Pipeline
  - Responsibilities: FFmpeg concat/encode/overlay, progress reporting, cancellation
  - Components: Export planner, FFmpeg runner, progress parser
  - IPC: `export:start`, `export:progress`, `export:cancel`, `export:complete`

---

## 3) System Diagram

```
+------------------------------- Desktop OS -------------------------------+
|                                                                         |
|  Filesystem <----> Electron Main (Node) <----> FFmpeg (ffmpeg-static)   |
|                      ^        ^         \                               |
|                      |        | IPC      \ child_process                |
|                Preload Bridge |           \                             |
|                      |        |            \                            |
|                 Renderer (React+TS) -- HTML5 Video Player               |
|                      |                      ^                           |
|        Media Library | Timeline & Playback  |                           |
|        Import        | Recording Controls   |                           |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 4) Core Entities and Data Model

- Clip
  - id, filePath, durationMs, startMs, endMs, hasAudio, width, height, vCodec, aCodec
- Track
  - id, name, clips: Clip[] (non-overlapping ordered by start time)
- TimelineState
  - id, tracks[2], playheadMs, zoom, snapEnabled, selection: { clipId? }
- RecordingSession
  - id, mode: screen|webcam|pip, startedAt, stoppedAt, files: { screen?, webcam? }
- ExportJob
  - id, clips: { filePath, inMs, outMs }[], resolution: 720p|1080p|source, status, progress
- Project (deferred)
  - version, timelineState, mediaIndex, createdAt, updatedAt

Constraints and indexing
- Keep absolute file paths; avoid duplicating large assets.
- Maintain clip boundaries as integers (ms) to avoid fp precision issues.

---

## 5) Data Flow

- Import Flow
  1) Renderer drag-drop/file-picker → validate (size/format) → store path and metadata
  2) Optional: generate thumbnail via HTMLVideoElement; ffprobe later if needed
- Timeline Edit Flow
  1) User manipulates clips (add/split/trim/move) → Zustand store updates
  2) Undo/redo tracked locally; optional autosave to project file (future)
- Preview Flow
  1) Timeline selection drives `<video>` source and currentTime
  2) Scrubbing seeks; playback dispatches to keep playhead in sync at 30+ fps
- Recording Flow (stable path)
  1) Start: capture screen via desktopCapturer + webcam via getUserMedia
  2) Record screen and webcam to separate files via MediaRecorder
  3) Stop: run FFmpeg overlay (filter_complex) to compose PiP into a single MP4
  4) Add composed file to media library and timeline automatically
- Export Flow
  1) Build concat list from timeline order (respect trims)
  2) If codecs/resolution uniform, use concat demuxer with stream copy; else re-encode
  3) Apply scaling for 720p/1080p; report progress via parsed stderr

---

## 6) Dependencies and Integrations

- Electron (main, preload, renderer), electron-forge makers + fuses
- React + Zustand + Vite + TypeScript for renderer
- FFmpeg via fluent-ffmpeg + ffmpeg-static (optionally ffprobe-static later)
- HTML5 video for preview; MediaRecorder for recording
- No backend services; local filesystem persistence only

Configuration highlights
- `contextIsolation: true`, `nodeIntegration: false` (via preload bridge)
- `asar: true`; ensure FFmpeg binaries are unpacked (`asarUnpack`) for runtime

---

## 7) Security and Performance Considerations

Security
- Enforce context isolation and disable node integration in renderer
- IPC surface: narrow, typed contracts; validate inputs (paths, options)
- File access only in main; pass file paths or handles, not large buffers

Performance targets (from PRD)
- Launch < 5s; 30+ fps timeline; scrubbing < 100ms; 1080p preview cap; export 1–3x realtime

Strategies
- Renderer: memoization, avoid unnecessary re-renders, simple DOM-based UI
- Recording: separate-stream capture reduces live CPU vs canvas compositing
- Export: prefer stream copy when possible; only re-encode when scaling/mismatch

---

## 8) Performance & Scaling

- Single-user desktop workload; focus on UI latency and process stability
- Caching: in-memory indices for media library; no disk cache required
- Rate limiting: debounce scrubbing; bounded progress event frequency (≥1/sec)
- Benchmarks: 10+ clips on timeline at 30+ fps; 2–5 minute export completes in 2–10 minutes on common hardware

---

## 9) Risks & Unknowns

- MediaRecorder variability across platforms (bitrate/codec); mitigation: standardize settings and test short clips
- FFmpeg packaging and ASAR unpack paths; mitigation: explicit `asarUnpack` and binary path validation
- macOS system audio loopback requires third-party driver; out of MVP scope
- Long recording sessions memory pressure; mitigation: chunking/timeslice and early GC
- Codec mismatches breaking stream copy; mitigation: re-encode path with clear UX

---

## 10) Design Notes

- IPC naming: `domain:action` (e.g., `export:start`), all request handlers return `{ success, ... }`
- Error handling: map FFmpeg and IO errors to user-friendly messages
- File conventions: store only paths and derived metadata; avoid copying assets unless needed
- Entities use milliseconds for time; UI converts to human-readable strings
- Keyboard shortcuts: Space, Delete, Cmd+Z, Cmd+B, Cmd+C/V wired in timeline module

---

## 11) Testing Coverage and Strategy

- Unit (renderer)
  - Clip math (trim/split), timeline position calculations, undo stack
- Unit (main)
  - Export plan generation, FFmpeg command builders, IPC validators
- Integration
  - IPC request/response (record, export); export with 2/5/10 clips; recording session lifecycle
- E2E (Playwright)
  - Import → edit → preview → export happy paths
- Performance
  - Timeline fps under 10+ clips; scrubbing latency < 100ms; export progress ≥ 1/sec

---

## 12) Next Steps

- Harden security: enable contextIsolation, disable nodeIntegration, implement preload bridge
- Configure packaging: add `asarUnpack` for `ffmpeg-static` (and `ffprobe-static` if added)
- Implement IPC surfaces for recording and export with progress
- Build timeline core interactions (add/split/trim) and preview synchronization

---

(End)


