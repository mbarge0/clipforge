# ClipForge Tech Stack

Version: 1.0  
Scope: Full stack (Electron main + renderer + tooling)

---

## 1) Overview

- **Philosophy**: Local-first, offline-capable, zero-backend MVP with fast iteration, strong packaging discipline, and minimal dependencies. Prefer battle-tested media tooling (FFmpeg) and Electron platform primitives for capture and playback.
- **Supported platforms**: macOS (primary), Windows (secondary). Linux deprioritized for MVP.
- **Primary runtime**: Electron 32.x (Chromium + Node runtime).

---

## 2) Frontend Stack (Renderer)

- **Framework**: React 18.3.x
  - Purpose: UI composition for media library, timeline, and preview panes.
  - Key packages: `react`, `react-dom`.
- **State management**: Zustand 4.5.x
  - Purpose: Local, minimal state for timeline clips, selection, and UI controls.
- **Language**: TypeScript 5.3.x
  - Purpose: Type safety across UI and IPC message types.
- **Build tool**: Vite 5.x with `@vitejs/plugin-react`
  - Config: `renderer/` as root; output to `dist/`; dev server at `:5173`.
- **Playback**: HTML5 `<video>` element
  - Purpose: Real-time preview, scrubbing, and playback.
- **Recording (renderer side)**: `MediaDevices.getUserMedia`, `MediaRecorder`
  - Purpose: Webcam capture and potential client-side stream composition.

Versioning and configuration
- React: ^18.3.1
- Zustand: ^4.5.0
- TypeScript: ^5.3.3
- Vite: ^5.0.0, `@vitejs/plugin-react`: ^5.1.0
- Dev URL: `http://localhost:5173`; prod served from `dist/index.html`.

Dependencies and integration points
- Communicates via IPC with main process for file operations and export.
- Consumes FFmpeg-export status events (progress, completion) from main.

---

## 3) Backend Stack (Main Process)

- **Platform**: Electron 32.x
  - Contains Node 20.x runtime; used for filesystem access and process orchestration.
- **Media processing**: `fluent-ffmpeg` + `ffmpeg-static` (and `ffprobe-static` if needed later)
  - Purpose: Concatenate clips, trim, scale, encode MP4 (H.264/AAC).
  - Binary packaging: Requires unpack from ASAR for runtime execution.
- **Packaging**: electron-forge 7.10.x
  - Makers: Squirrel (Windows), ZIP/DMG (macOS), DEB/RPM (Linux as needed).
  - Fuses: Harden runtime via `@electron-forge/plugin-fuses`.
- **Language**: JavaScript/TypeScript hybrid
  - Current `main/main.js` is JS; preload and stricter IPC can be added in TS.

Versioning and configuration
- Electron: ^32.3.3
- electron-forge CLI/plugins/makers: ^7.10.2
- @electron/fuses: ^1.8.0
- fluent-ffmpeg: ^2.1.2, ffmpeg-static: ^5.1.0
- Packager: ASAR enabled. Add `asarUnpack` entries for FFmpeg/FFprobe bins.

Dependencies and integration points
- Receives renderer IPC requests for export and filesystem ops.
- Spawns FFmpeg processes via `fluent-ffmpeg` (uses `ffmpeg-static` path).
- Emits progress back to renderer.

---

## 4) Database & Storage

- **Persistence**: Local filesystem only (MVP)
  - Imported media: referenced by absolute path.
  - Temp/intermediate: OS temp directory.
  - Project files: JSON-based format (stretch goal), not required for MVP.
- **No cloud DB/services**: No Firestore or server-hosted persistence in MVP.

Indexing and performance
- Rely on in-memory indices (Zustand) for library/timeline views.
- Avoid duplicating large media; store paths/metadata only.

---

## 5) CI/CD & Deployment

- **Build/dev**: Vite for renderer; Electron dev with `concurrently`, `wait-on`, and `cross-env`.
- **Packaging**: electron-forge makers
  - Windows: `@electron-forge/maker-squirrel`
  - macOS: `@electron-forge/maker-zip` (DMG optional later)
  - Linux: `maker-deb`, `maker-rpm` available
- **Security fuses**: `@electron-forge/plugin-fuses` enabling: cookie encryption, disable RunAsNode/Node inspect, ASAR integrity, only load from ASAR.
- **Release**: Manual distribution via GitHub Releases or cloud storage (PRD). Code signing optional for MVP.
- **Version policy**: Tag releases; lock critical runtime versions (Electron major/minor) per milestone.

Environment sync
- Dev uses Vite server; production uses `file://` loaded `dist/index.html`.
- Node/Electron versions pinned by package.json; CI should use matching Node for tooling.

---

## 6) Security & Configuration

- **Security target (PRD)**
  - contextIsolation: true
  - nodeIntegration: false
  - IPC: `ipcMain.handle` / `ipcRenderer.invoke` pattern
  - File access: main process only; pass paths not raw bytes
- **Current code delta**
  - `main/main.js` sets `nodeIntegration: true`, `contextIsolation: false`. Migration required to meet PRD.
- **Preload strategy**
  - Expose minimal, typed IPC bridge via `contextBridge` in `preload.ts`.
- **Secrets & config**
  - `config/environment.ts` provides safe defaults (`APP_NAME`, `ENVIRONMENT`, etc.). No secret material required for MVP.
  - No third-party API keys needed.

Compatibility & packaging
- FFmpeg binaries must be unpacked from ASAR to execute. Configure `asarUnpack` for `ffmpeg-static` (and `ffprobe-static` if added).
- Windows loopback audio supported; macOS system audio capture requires third-party device (e.g., BlackHole) — out of MVP scope.

---

## 7) Performance & Scalability Notes

- **Renderer performance**
  - Target 30+ fps on timeline interactions; limit preview to 1080p.
  - Use memoization and virtualization where needed; avoid large re-renders.
- **Recording strategy**
  - Use `desktopCapturer` + `MediaRecorder` for screen; `getUserMedia` for webcam.
  - For PiP single-file output, consider composing streams via `<canvas>` and `captureStream()`; trade-off is higher CPU.
- **Export pipeline**
  - Prefer concat demuxer for lossless joins; scale filter for 720p/1080p.
  - Emit periodic progress events for UI.
- **Resource limits (PRD)**
  - Max file size: 500MB; Max timeline duration: 30 minutes; Max output: 1080p.

---

## 8) Supermodule ↔ Technology Mapping

1. Foundation & Setup
   - Electron 32.x main process, electron-forge packaging, Fuses plugin; Vite config; environment/logger utilities.
2. Media Library & Import
   - React UI + Zustand state; file drag/drop; Node `fs/promises` in main; metadata extraction (basic via HTMLVideoElement or ffprobe later).
3. Timeline Core
   - React components; Zustand store; keyboard handlers; optional third-party timeline component (future).
4. Preview & Playback
   - HTML5 `<video>`; React-controlled scrubbing; synchronization with Zustand playhead.
5. Recording Engine
   - Electron `desktopCapturer`; `MediaDevices.getUserMedia`; `MediaRecorder`; optional `<canvas>` compositor for PiP.
6. Export Pipeline
   - `fluent-ffmpeg` + `ffmpeg-static`; concat demuxer; scale filter; progress IPC.

---

## 9) Trade-offs, Alternatives, Compatibility

Trade-offs
- Electron vs Tauri: Electron chosen for fastest path to mature media APIs and packaging; Tauri lighter but media/IPC maturity and FFmpeg packaging overhead risk schedule.
- HTML5 video preview vs custom WebGL renderer: Simplicity and speed favored; custom renderers deferred.
- `fluent-ffmpeg` wrapper vs raw `child_process`: Wrapper reduces boilerplate; raw control deferred unless needed for advanced filters.

Alternatives considered
- Packaging: `electron-builder` is common; `electron-forge` is already integrated and sufficient for MVP.
- State: Redux Toolkit vs Zustand — Zustand selected for minimalism and speed.
- Timeline UI: Custom from scratch vs library; start custom for control and performance; evaluate libraries later.

Compatibility notes
- Electron 32 runtime implies Node 20.x; ensure native addons (if any) match ABI.
- FFmpeg licensing: `ffmpeg-static` bundles GPL/LGPL binaries; review distribution implications before public release.
- Platform specifics: macOS audio loopback requires third-party driver; Windows supports loopback via Electron.

---

## 10) Migration Plans & Deprecation

- Security migration: Flip to `contextIsolation: true`, `nodeIntegration: false`; add `preload.ts` IPC bridge; audit renderer for Node usage.
- Packaging hardening: Add `asarUnpack` for FFmpeg/FFprobe; verify binaries at runtime.
- Optional: Move `main` to TypeScript for typesafe IPC contracts.

---

## 11) Rationale & Upgrade Strategy

- Rationale: Optimize for delivery under time constraints using stable tooling; minimize backend to reduce risk; leverage Electron’s battle-tested ecosystem for media workflows.
- Upgrade policy: Pin Electron minor for each milestone; monthly review of React/Vite/Zustand; upgrade FFmpeg binaries only when export pipeline is stable.
- Next review checkpoint: After MVP export pipeline passes manual QA, revisit security settings and packaging configuration.

---

## 12) Environment & Examples

Environment configuration
- `config/environment.ts` centralizes non-secret app settings.

Packaging snippet (forge)

```json
{
  "packagerConfig": { "asar": true },
  "makers": [
    { "name": "@electron-forge/maker-squirrel" },
    { "name": "@electron-forge/maker-zip", "platforms": ["darwin"] },
    { "name": "@electron-forge/maker-deb" },
    { "name": "@electron-forge/maker-rpm" }
  ],
  "plugins": [
    { "name": "@electron-forge/plugin-auto-unpack-natives" }
  ]
}
```

Note: Add `asarUnpack` for `ffmpeg-static` (and `ffprobe-static` if used) in packaging config.

---

## 13) Summary & Next Steps

- Electron 32 + React 18 + Vite 5 + TS 5 + Zustand 4 form the core.
- Export via FFmpeg (fluent-ffmpeg + ffmpeg-static) with 1080p max output.
- No backend; local filesystem only. Packaging via electron-forge with fuses.
- Immediate next steps: tighten Electron security settings; configure FFmpeg ASAR unpack; implement IPC bridge; finalize export IPC flow.


