# ClipForge Development Checklist

Version: 1.0  
Scope: Full stack (Electron main + preload + renderer)

References: [`prd.md`](./prd.md) · [`architecture.md`](./architecture.md)

---

## 1) Overview

This checklist translates the PRD and Architecture into actionable, testable tasks grouped by supermodule. Each task includes phase tags, dependencies, acceptance criteria, and testing expectations.

Estimated tasks: ~75–100 items (MVP through final submission).

---

## 2) Structure (Supermodule Overview)

1. Foundation & Setup
2. Media Library & Import
3. Timeline & Playback
4. Export Pipeline
5. Recording Engine

Additional section: Cross-Module & Shared Tasks (Security, Packaging, Docs, QA) — not a supermodule

---

## 3) Supermodule Sections

### 3.1 Foundation & Setup
- Description: Electron app bootstrap, window creation, tooling, IPC baseline.
- Modules: App lifecycle, Preload bridge, IPC contracts, Env/logging, Build tooling.

[Plan]
- [ ] Confirm Node/Electron/Vite versions and lockfile checked in
  - Dependencies: none
  - Acceptance: `npm ci` reproducible; `electron -v` and `node -v` documented
  - Testing: CI or local install succeeds
- [ ] Define directory structure (`main/`, `renderer/`, `config/`)
  - Acceptance: structure matches docs; imports resolve
  - Testing: dev server and Electron can start

[Build]
- [ ] Implement `preload.ts` with minimal, typed IPC bridge
  - Dependencies: Electron app bootstrap
  - Acceptance: `contextBridge` exposes `ipcRenderer.invoke` wrappers only
  - Testing: unit tests for input validation; renderer cannot access Node APIs
- [ ] Update `BrowserWindow` to `contextIsolation: true`, `nodeIntegration: false`
  - Dependencies: preload in place
  - Acceptance: app loads; renderer features work via bridge
  - Testing: manual launch; smoke E2E
- [ ] Add environment and logger utilities
  - Acceptance: `ENV` and `logger` used without warnings
  - Testing: unit tests trivial

[Debug]
- [ ] Fix any preload-bridge regressions (renderer access)
  - Testing: manual flows run

[Validate]
- [ ] App boots in <5s in dev on reference machine
  - Testing: manual timing; optional script

---

### 3.2 Media Library & Import
- Description: Import via drag-drop/picker, validation, metadata, thumbnails.
- Modules: Import service, Validation, Thumbnail generation, Library UI.

[Plan]
- [ ] Specify supported formats/extensions and 500MB limit
  - Acceptance: single source of truth in config
  - Testing: unit tests for validator

[Build]
- [ ] Drag-and-drop import zone UI
  - Dependencies: renderer shell
  - Acceptance: visual dropzone; hover feedback
  - Testing: E2E drag-drop adds files
- [ ] File picker import
  - Acceptance: picker opens; selection populates library
  - Testing: E2E
- [ ] Validation (type/size)
  - Acceptance: invalid shows toast; valid proceeds
  - Testing: unit + E2E
- [ ] Metadata extraction (duration/resolution)
  - Acceptance: library shows filename, duration, resolution, file size
  - Testing: integration with HTMLVideoElement; stub if headless
- [ ] Thumbnail generation
  - Acceptance: thumbnails visible in library
  - Testing: integration; golden image optional

[Debug]
- [ ] Handle disk full / permission errors gracefully
  - Testing: simulate failures

[Validate]
- [ ] Import PRD flow passes (drag-drop and picker)
  - Testing: manual QA scenario

---

### 3.3 Timeline & Playback
- Description: Two-track timeline, clip manipulation, preview, keyboard shortcuts.
- Modules: Timeline store, Timeline UI, Player controller, Undo stack.

[Plan]
- [ ] Define entities: Clip, Track, TimelineState; millisecond timebase
  - Acceptance: types exported; used across components
  - Testing: unit for type guards/validators

[Build]
- [ ] Render timeline with 2 tracks and time ruler
  - Acceptance: tracks visible; playhead visible
  - Testing: E2E visual assertion
- [ ] Add clip to timeline by drag from library
  - Testing: E2E
- [ ] Trim via edge drag (update in/out)
  - Testing: unit math + E2E interaction
- [ ] Split at playhead (Cmd/Ctrl+B)
  - Testing: unit split math + E2E
- [ ] Reorder/move across tracks with snap-to-grid
  - Testing: E2E
- [ ] Delete selection (Delete/Backspace)
  - Testing: E2E
- [ ] Undo last 10 actions (Cmd/Ctrl+Z)
  - Testing: unit for stack + E2E
- [ ] Preview player sync with playhead; Space toggles play/pause
  - Testing: E2E; FPS target check manual

[Debug]
- [ ] Smooth scrubbing under 100ms latency
  - Testing: manual measurement

[Validate]
- [ ] Timeline PRD checks (10+ clips, 30+ fps target)
  - Testing: performance scenario

---

### 3.4 Export Pipeline
- Description: FFmpeg concat, scaling to 720p/1080p, progress, cancel.
- Modules: Export planner, FFmpeg runner, Progress parser, UI.

[Plan]
- [ ] Decide concat demuxer vs re-encode policy; scale filter mapping
  - Acceptance: documented in code comments
  - Testing: unit for command generation

[Build]
- [ ] Build export plan from timeline (respect trims/order)
  - Testing: unit
- [ ] Implement FFmpeg invocation via fluent-ffmpeg and ffmpeg-static
  - Testing: integration; stub in CI if needed
- [ ] Progress parsing and eventing ≥1/sec
  - Testing: integration with mocked stderr
- [ ] Cancel export and cleanup temp files
  - Testing: integration
- [ ] Resolution options UI (720p/1080p/Source)
  - Testing: E2E

[Debug]
- [ ] Handle codec mismatch fallback to re-encode with user notice
  - Testing: integration

[Validate]
- [ ] Export success for 2/5/10 clip timelines
  - Testing: manual QA scenario

---

### 3.5 Recording Engine
- Description: Screen, webcam, PiP capture; compose PiP post-record.
- Modules: Capture controller, Recorder manager, PiP composer, UI.

[Plan]
- [ ] Enumerate device/permission flows per OS
  - Acceptance: UX text and fallbacks documented
  - Testing: manual

[Build]
- [ ] Screen recording: desktopCapturer + MediaRecorder
  - Testing: integration (short clip)
- [ ] Webcam recording: getUserMedia + MediaRecorder
  - Testing: integration
- [ ] PiP: record screen+webcam separately; compose overlay via FFmpeg
  - Testing: integration; verify overlay position (20% width bottom-right)
- [ ] Auto-add composed clip to library and timeline
  - Testing: E2E

[Debug]
- [ ] Memory pressure mitigation (timeslice/chunk)
  - Testing: long-run session

[Validate]
- [ ] Recording PRD checks (screen, webcam, PiP all functional)
  - Testing: manual QA scenario

---

### 3.6 Cross-Module & Shared Tasks (not a supermodule)

[Build]
- [ ] Configure electron-forge makers and fuses (as in repo)
  - Testing: packaged app launches
- [ ] Add `asarUnpack` for `ffmpeg-static` (and `ffprobe-static` if added)
  - Testing: packaged export runs
- [ ] README with setup/build instructions (<5 steps, single commands)
  - Testing: fresh machine reproducibility

[Validate]
- [ ] Packaged bundle <200MB; launch works on fresh machine
  - Testing: packaging verification checklist
- [ ] Cross-platform: macOS + Windows smoke tests; shortcut mapping
  - Testing: manual

---

## 4) Testing Coverage Map

- Unit: validators, clip math, export plan, IPC contracts
- Integration: IPC flows (record/export), FFmpeg run, timeline interactions
- E2E (Playwright): import → edit → preview → export; recording happy paths
- Performance: 10+ clips FPS, <100ms scrub latency, export ≥1/sec progress

---

## 5) Validation Mapping (examples)

| Task | Regression ID | Test Type | Status |
|------|----------------|-----------|--------|
| Import validation (size/format) | R-IM-001 | Unit/E2E | ☐ |
| Timeline trim/split correctness | R-TL-010 | Unit/E2E | ☐ |
| Export progress and cancel | R-EX-005 | Integration | ☐ |
| Recording PiP composition | R-RC-003 | Integration | ☐ |

---

## 6) Completion Definition

- 100% of MVP tasks checked, all Validate steps pass
- E2E happy path passes on macOS and Windows
- Packaged build available and verified on fresh machine

---

## 7) References

- `/docs/foundation/prd.md`
- `/docs/foundation/architecture.md`
- `/docs/foundation/tech_stack.md`

(End)
