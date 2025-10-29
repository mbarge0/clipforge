## Phase 05 — Recording Engine — Start · Plan · Design (Consolidated)

### Metadata
- Phase: 05
- Date: 2025-10-29
- Output Path: `/docs/operations/phases/recent/phase-05-01-plan.md`

---

## Start

### Previous Phase Summary (Phase 04 — Export Pipeline)
- Built end-to-end Export Pipeline with IPC surfaces (`export:start`, `export:progress`, `export:complete`, `export:cancel`, `export:chooseDestination`).
- Implemented FFmpeg flow: per-segment encode (trim/scale) → concat demuxer; absolute output path with `-y`; verified output exists before success.
- Progress updates derived from `timemark` (~5/sec); cancel cleans up temp files.
- Media path resolution added (`media:getPathForFileName`); timeline clips now store `sourcePath` at creation; planner prefers it.
- E2E Playwright flow green: import → drag to timeline → export 1s segment → assert output exists.

References: `/docs/operations/phases/recent/phase-04-01-plan.md`, `/docs/operations/phases/recent/phase-04-02-build.md`, `/docs/operations/phases/recent/phase-04-03-reflect.md`.

### Objective for this Phase
Deliver Recording Engine across three modes per PRD §2 (Recording Capabilities) and Dev Checklist §3.5:
- Screen recording (desktopCapturer + MediaRecorder) with window/screen picker.
- Webcam recording (getUserMedia + MediaRecorder) with mic audio.
- Picture-in-Picture (PiP): record screen + webcam separately and compose overlay via FFmpeg at stop; auto-add composed clip to Media Library and Timeline.

### Constraints
- Maintain architectural consistency (Electron main ↔ preload ↔ renderer; typed IPC; contextIsolation true; nodeIntegration false).
- Do not regress Timeline, Import, or Export functionality (see Regression Manifest).
- Keep performance and stability targets from PRD (30+ fps UI, scrubbing <100ms, no memory leaks).

### Scope
Included (Phase 05):
- IPC for `record:start`, `record:stop`, `record:status`.
- Screen selection via Electron system picker; webcam/mic device selection basic.
- Recording to disk using MediaRecorder with timeslice/chunking; cleanup on stop.
- FFmpeg overlay composition for PiP at fixed 20% width, bottom-right.
- Auto-register output in Media Library; optional auto-place on Timeline Track 1.

Explicitly deferred (future):
- System audio loopback on macOS (requires third-party driver).
- Countdown, pause/resume, global hotkeys; advanced device routing.
- Rich device settings UI beyond simple selectors.

### Risks and Assumptions
- MediaRecorder variability across platforms; mitigate with standardized codecs/bitrates and short validation clips.
- Memory pressure during long sessions; mitigate via timeslice chunking and explicit blob disposal.
- Permissions prompts (camera/microphone/screen); provide clear UX fallbacks.
- Assume ffmpeg-static available at runtime; packaging `asarUnpack` handled in a later Packaging phase.

### Testing Focus
- Integration: short screen/webcam recordings create valid MP4 files and are playable; PiP FFmpeg overlay produces correct placement (20% width bottom-right).
- E2E: “Record Screen 5s → auto-add to timeline → export 1s snippet” remains green.
- Regression: Import, Timeline edits, Export progress unchanged.

### High-Level Implementation Plan (overview)
1) Renderer UI: add Recording controls (Screen, Webcam, Screen+Webcam) and minimal status indicator.
2) Preload bridge: expose typed `record:start`, `record:stop`, `record:status` invokes.
3) Main: orchestrate desktopCapturer/getUserMedia channels; stream to MediaRecorder; persist to temp file.
4) On stop: if PiP, run FFmpeg overlay composition; else use direct file.
5) Register output in Media Library and optionally place on Timeline.
6) Tests: integration checks for each mode; add targeted E2E for a screen-record happy path.

### Expected Outcome
- All three recording modes function; composed PiP meets placement spec; clips appear in library and can be placed/auto-placed on timeline; no regressions.

### Checkpoint Preparation
- Verify dev runbook unchanged; ffmpeg available; test assets intact.
- Suggested commit message: `checkpoint: Phase 05 Start — Recording Engine plan established`

---

## Plan

### Phase Context
- Phase: 05 — Recording Engine (entering planning loop to sequence tasks and align with PRD/Checklist).
- Date: 2025-10-29.

### Current Status
- Export pipeline stable (Phase 04); Import, Timeline & Preview functional; E2E export flow green.

### Issues and Blockers (anticipated)
- OS permissions for screen/camera/mic; ensure user guidance and retry flows.
- MediaRecorder memory behavior; mitigate via `timeslice` and early cleanup.
- Packaging of FFmpeg handled later; for dev, rely on `ffmpeg-static`.

### Scope Adjustments
- Keep device selection minimal; defer advanced routing.
- Auto-add to library mandatory; auto-place on timeline configurable.

### Risk Assessment & Mitigations
- Memory pressure during recording → chunked writes; bounded buffers; explicit URL revocation.
- Codec/container mismatch → normalize via FFmpeg as needed when composing PiP.
- User cancels midway → partial files cleaned safely.

### Task Summary (priority, deps, estimate)
- RC-01: Device & permission flow spec (P0) — deps: none — 1h  [Dev Checklist §3.5 Plan]
- RC-02: IPC contracts `record:*` (P0) — deps: Foundation — 1h  [Architecture §Recording]
- RC-03: Screen recording to file (P0) — deps: RC-02 — 2h  [PRD §Recording]
- RC-04: Webcam recording to file (P0) — deps: RC-02 — 2h  [PRD §Recording]
- RC-05: PiP composition via FFmpeg (P0) — deps: RC-03/04 — 2h  [Checklist §3.5 Build]
- RC-06: Auto-register to Media Library (+ optional auto-timeline) (P0) — deps: RC-03/04/05 — 1h  [Checklist §3.5 Build]
- RC-07: Integration tests (short clips per mode) (P0) — deps: RC-03..06 — 1h  [Testing Map]
- RC-08: E2E: record→timeline→export happy path (P0) — deps: RC-06/Export — 1h  [Testing Map]

### Dependency Graph (text)
```
RC-01
  ↓
RC-02 → RC-03 →
           \       
            → RC-05 → RC-06 → RC-07 → RC-08
           /
RC-04 →
```

### Task Breakdown (IDs, acceptance, implementation, outputs)
- RC-01 — Device & Permission Flows
  - Acceptance: documented flows for macOS/Windows; UX copy for denial/retry; fallback notes.
  - Steps: enumerate pickers/permissions; write UX strings; add to docs and code constants.
  - Output: section in docs; constants in renderer for prompts.

- RC-02 — IPC Contracts `record:start|stop|status`
  - Acceptance: typed preload bridge; handlers in main; returns `{ success, sessionId }` and status updates.
  - Steps: define types; implement preload; wire `ipcMain.handle` in main.
  - Output: updated `preload.ts`, `main/main.js` handlers, type defs.

- RC-03 — Screen Recording
  - Acceptance: select source → 5s test → MP4 saved; file exists and plays.
  - Steps: use `desktopCapturer` + `getUserMedia` with chosen source; MediaRecorder with timeslice; write to file.
  - Output: temp file path; event logs.

- RC-04 — Webcam Recording
  - Acceptance: choose camera+mic → 5s test → MP4 saved; file exists and plays.
  - Steps: `navigator.mediaDevices.getUserMedia({ video, audio })`; MediaRecorder; write to file.
  - Output: temp file path; event logs.

- RC-05 — PiP Composition
  - Acceptance: overlay at 20% width bottom-right; composed MP4 exists; visual check passes.
  - Steps: record screen+webcam to separate files; FFmpeg `filter_complex` overlay; verify dimensions.
  - Output: composed MP4 path.

- RC-06 — Auto-Register to Library/Timeline
  - Acceptance: new recording appears in Media Library; optional auto-add to Timeline Track 1.
  - Steps: invoke existing import/register function with output path; dispatch timeline add if enabled.
  - Output: UI shows item; timeline updated.

- RC-07 — Integration Tests
  - Acceptance: programmatic 3× short-mode runs pass; files cleaned between runs.
  - Steps: write tests using Playwright or Jest-electron; stub durations.
  - Output: green tests.

- RC-08 — E2E Record→Export
  - Acceptance: E2E flow passes: record 5s screen → auto-add → export 1s; assert output exists.
  - Steps: extend `export-flow.spec.ts` or add new spec guarded by flag.
  - Output: green E2E.

### Regression Plan (per `/docs/operations/regression_manifest.md`)
- Affected prior systems: Phase 02 Import (library indexing), Phase 03 Timeline (add/trim/split), Phase 04 Export (planner/ffmpeg runner).
- Must remain stable:
  - Importing external files; media path resolution.
  - Timeline interactions and preview fps; scrubbing latency.
  - Export progress, cancel, and output verification.
- Checks to add:
  - After each recording, perform quick export of 1s segment to confirm no export regressions.
  - Verify newly recorded clips follow same path resolution rules as imports.

### Updated Success Criteria
- Screen, Webcam, PiP all functional; clips appear in library and (optionally) on timeline.
- PiP overlay meets 20% width bottom-right spec; quick export works post-record.
- No measurable regression in preview FPS or scrubbing latency.

### Next Steps
1. Implement RC-02 → RC-03/04 → RC-05 → RC-06.
2. Add RC-07/08 tests; wire quick regression checks.
3. Prepare Build phase checklist.

---

## Design

### Phase Context
- Phase: 05 — Recording Engine
- Design scope: Recording controls (toolbar), source selection, status indicators; minimal settings.
- References: PRD §2 (Recording Capabilities), Architecture §Recording, Dev Checklist §3.5.

### Visual Objectives
- Clear, discoverable recording controls integrated into existing toolbar.
- Minimal friction from click to capture; obvious state (recording/idle/stopped).
- Accessible, responsive, and visually consistent with current UI.

### Layout Description (textual wireframe)
```
┌──────────────────────────────── App Toolbar ───────────────────────────────┐
│ [Import] [Export] | [Record Screen] [Record Webcam] [Screen+Webcam] | ◉ • │
│                                                                00:05  ⏹  │
└───────────────────────────────────────────────────────────────────────────┘
┌────────────── Media Library ──────────────┐  ┌────────────── Preview ──────┐
│ [thumb][thumb][thumb] ...                 │  │  live/last frame preview    │
│                                           │  │                              │
└───────────────────────────────────────────┘  └──────────────────────────────┘
┌────────────────────────────── Timeline (2 tracks) ─────────────────────────┐
│ Track 1: [==== clip ====]           Track 2: [ overlay ]                  │
└───────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Toolbar gains three primary buttons with icons (Lucide: Monitor, Camera, PictureInPicture2).
- Right side shows recording status dot (◉), elapsed timer, and stop button while recording.
- If Screen mode: clicking opens system source picker; Webcam mode: simple device dropdown.

### Component Specifications
- Buttons (Primary): Screen, Webcam, Screen+Webcam
  - States: default, hover, active (pressed), disabled (while other recording active).
  - Icons: Lucide; labels visible; tooltip with shortcut (future).
- Source Selectors
  - Screen: Electron system picker dialog.
  - Webcam/Mic: inline dropdowns (default to system default); basic list only.
- Status Indicator
  - Red dot + mm:ss timer while recording; neutral when idle; focus-visible ring.
- Stop Control
  - Prominent square icon; confirmation on accidental double-click prevented via debounce.
- Toasts/Errors
  - Permission denied; device not found; disk full; provide retry CTA.

### Color & Typography System (Tailwind tokens)
- Colors: `bg-neutral-900` app chrome; `text-neutral-100`; accents `primary-500` for buttons; `red-500` for recording dot.
- Typography: Inter or system stack; `text-sm` labels; `text-xs` metadata; weights 500/600 for buttons.
- Spacing: 8px grid (`space-x-2`, `p-2`, `px-3 py-2` for buttons); `rounded-md` controls.

### Motion & Interaction
- Button hover: subtle scale/opacity, 150–200ms `ease-out`.
- Status dot pulsing at 1s interval while recording.
- Dialogs fade/scale in 150ms; respect reduced motion preference.

### Responsive & Accessibility Guidelines
- Breakpoints: ≥1024px desktop primary; 768–1024 tablet collapses labels to icons; <768 stacks toolbar items in two rows.
- Keyboard: Tab order covers toolbar; Space/Enter activates focused control; Esc closes picker dialogs.
- Focus: high-contrast ring (`ring-2 ring-primary-500`); color contrast AA.

### Design Assets Summary (for Build)
- Components: `RecordingToolbar`, `RecordButton`, `StatusIndicator`, `DeviceDropdown`.
- Icons: Lucide Monitor, Camera, PictureInPicture2, Square (stop).
- Tokens: color and spacing as above; duration curves standardized.

### Next Steps (Design → Build)
- Confirm toolbar placement and labels; confirm auto-place-to-timeline default.
- Validate accessibility copy for permission errors.
- Open questions: do we auto-place recordings on Timeline by default? (proposed: enabled, can be toggled in settings later).

---

(End)


