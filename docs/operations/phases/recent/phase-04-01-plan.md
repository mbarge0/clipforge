## Phase 04 — Export Pipeline — Start · Plan · Design (Consolidated)

### Metadata
- Phase: 04
- Date: 2025-10-28
- Output Path: `/docs/operations/phases/recent/phase-04-01-plan.md`

---

## Start

### Previous Phase Summary (from `phase-03-03-reflect.md`)
- Timeline & Playback reached a stable MVP with multi-track, priority-based playback and robust clip interactions; rAF/rVFC-driven loop achieved smooth scrubbing; object URL lifecycle centralized; system is ready to support Export and Recording.
- Handoff guidance: Export should consume timeline state to build a concat/encode plan, respect track order semantics, and keep preview responsive during exports.

### Objective for this Phase (Supermodule 4 — Export Pipeline)
- Implement an end-to-end export pipeline that reads the timeline, generates an export plan, invokes FFmpeg to concatenate and optionally scale clips, reports progress ≥1/sec, and supports cancel + cleanup.
- Provide an Export UI with resolution options (720p/1080p/Source) and destination picker, aligned with PRD 2.5 “Export & Rendering”.

### Constraints
- Maintain Electron security posture (contextIsolation, no Node in renderer). All filesystem/FFmpeg operations in Main.
- Use fluent-ffmpeg + ffmpeg-static; ensure `asarUnpack` for binaries.
- Prefer stream copy via concat demuxer for homogeneous codecs; re-encode when scaling or codecs mismatch.
- Adhere to repo conventions, coding rules, and Zustand state patterns.

### Proposed Architecture / Component Layout
- Renderer (React): Export Panel/Modal (resolution select, path chooser, estimated size [P1], Export/Cancel); progress overlay during export.
- Preload: typed IPC wrappers `export:start`, `export:progress`, `export:cancel`.
- Main: Export Planner (derive `{filePath, inMs, outMs}` from timeline), FFmpeg Runner (spawn via fluent-ffmpeg), Progress Parser (stderr regex → percentage + ETA), Temp File Manager (concat list, cleanup), Cancel Controller.

### Testing Plan
- Unit (main): export plan generation; command builders for concat/copy vs re-encode; scale filter mapping.
- Integration: invoke export with 2/5/10 clips; parse progress ≥1/sec; cancel mid-run cleans up temps.
- E2E: import → arrange → export happy path; verify output plays and respects trims/order.

### Step-by-Step Implementation Plan
1) Define IPC contracts and types: `export:start`, `export:progress`, `export:cancel`.
2) Implement Export Planner reading current timeline state; generate concat inputs.
3) Implement FFmpeg invocation paths: concat demuxer (copy) and re-encode with scale.
4) Implement progress parsing and event emission throttled to ≥1/sec.
5) Implement cancel handling and temp cleanup.
6) Build Export UI (resolution select, destination chooser, progress/cancel).
7) Add unit/integration tests; wire E2E manual QA scenario.

### Scope
- Included: Export plan, FFmpeg run, progress/cancel, basic Export UI (resolutions), output MP4 (H.264/AAC), scaling to 720p/1080p.
- Excluded/Deferred: Estimated file size (P1), export presets, export queue, background export, cloud upload.

### Risks & Assumptions
- Risk: Codec mismatches preventing stream copy → Mitigation: automatic fallback to re-encode with clear UX note.
- Risk: ASAR packing issues with FFmpeg → Mitigation: ensure `asarUnpack` and binary path validation.
- Assumption: Timeline state exposes precise in/out in ms and ordered clips; 2 tracks with deterministic rules for export composition (Track 1 priority).

### Expected Outcome (Definition of Done)
- User can export a multi-clip sequence to MP4 with chosen resolution; trims/order applied; visible progress; cancel works; validations for 2/5/10 clip cases pass.

### Checkpoint Readiness Summary
- Dependencies align: Timeline MVP complete; PRD and architecture specify Export; regression expectations defined. Ready to proceed to detailed planning.

---

## Plan

### Overview
- Goal: Deliver Export Pipeline per Dev Checklist §3.4 and PRD §2.5.
- Estimate: 8–12 hours (planner 2h, runner 3h, UI 2h, tests 2–3h, buffer 1–2h).

### Task Summary (Priority, Effort, Mapping)
1) Export Policy Decision (concat copy vs re-encode) — P0 — 0.5h — Checklist 3.4 [Plan]
2) Export Planner from Timeline — P0 — 2h — Checklist 3.4 [Build]
3) FFmpeg Invocation (copy/re-encode + scale) — P0 — 3h — Checklist 3.4 [Build]; PRD 2.5
4) Progress Parsing ≥1/sec — P0 — 1h — Checklist 3.4 [Build]; PRD success metrics
5) Cancel + Temp Cleanup — P0 — 1h — Checklist 3.4 [Build]
6) Resolution Options UI — P0 — 2h — Checklist 3.4 [Build]; PRD 2.5
7) Codec Mismatch Fallback UX — P0 — 0.5h — Checklist 3.4 [Debug]
8) Validate 2/5/10 Clip Exports — P0 — 1h — Checklist 3.4 [Validate]

### Dependency Graph
```
[Policy] → [Planner] → [FFmpeg Runner] → [Progress/Cancel] → [Validate]
                          ↘
                           [Resolution UI]
```

### Task Breakdown (Acceptance, Steps, Outputs)
- T1 Export Policy Decision
  - Acceptance: Written decision captured in code comments/docs; criteria: copy when uniform codecs/container and no scaling; else re-encode.
  - Steps: Survey input metadata assumptions; define scale filter mapping; document in main runner.
- T2 Export Planner from Timeline
  - Acceptance: Deterministic list `{ filePath, inMs, outMs }[]` ordered by time respecting trims and split boundaries.
  - Steps: Read Zustand timeline; translate selection rules (Track 1 priority) into linear plan; unit tests.
- T3 FFmpeg Invocation
  - Acceptance: Two paths functional—concat demuxer with `-c copy`, and re-encode with `-vf scale` and H.264/AAC output; errors surfaced.
  - Steps: Write concat list to temp; spawn via fluent-ffmpeg; implement scale mapping for 720p/1080p/source; handle output path.
- T4 Progress Parsing
  - Acceptance: Progress events at least once per second with percentage and ETA.
  - Steps: Parse stderr time markers; compute ratio against total; throttle to ≥1/sec; emit IPC.
- T5 Cancel + Cleanup
  - Acceptance: Mid-export cancel stops process and removes temps; UI reflects cancelled state; no orphaned FFmpeg processes.
  - Steps: Track child process; signal kill; guard cleanup.
- T6 Resolution Options UI
  - Acceptance: Dropdown (720p/1080p/Source), destination chooser, Export button disabled until valid; progress modal with Cancel.
  - Steps: Build React components; hook IPC wrappers; minimal form validation.
- T7 Codec Mismatch Fallback UX
  - Acceptance: On mismatch leading to re-encode, user notified once; no noisy toasts.
  - Steps: Detect decision branch; surface non-blocking info banner.
- T8 Validate 2/5/10 Clips
  - Acceptance: Manual QA completed; exported files play with correct order, trims, and resolution.
  - Steps: Prepare sample timelines; run exports; record times and outcomes.

### Risk Mitigation (Top)
- FFmpeg packaging path errors → Add explicit binary resolution and `asarUnpack` docs.
- Long exports freeze UI → Keep work in Main; progress via IPC; renderer only listens.
- Timebase mismatches → Normalize ms-to-ffmpeg time strings precisely; unit test boundaries.

### Regression Plan (per `/docs/operations/regression_manifest.md`)
- Potentially affected systems: Phase 03 Timeline & Playback (scrubbing/perf), Phase 02 Media Library (file paths), Phase 01 Foundation (IPC stability).
- Required to remain stable:
  - Timeline editing correctness and preview responsiveness during export (manifest Phase 04 scope).
  - Import flows and media paths intact.
  - App remains responsive; no security regressions.
- Add to Debug/Validate checks: Run preview while an export proceeds; verify no stutter beyond acceptable thresholds.

### Updated Success Criteria
- Meets PRD 2.5 metrics: progress ≥1/sec; export succeeds for 2/5/10 clips; trim/order/scale correct; cancel works and cleans up.

### Checkpoint Schedule
- Checkpoint A: Planner + policy decided and tested.
- Checkpoint B: Runner + progress/cancel functional on 2-clip case.
- Checkpoint C: UI integrated; full 10-clip validation done.

### Next Steps
1) Implement IPC and planner.
2) Implement runner with copy/re-encode paths and progress.
3) Build UI and integrate cancel.
4) Run validation set and record outcomes.

---

## Design

### Phase Context
- Phase: 04 — Export Pipeline (UI for configuration and progress)
- References: PRD §2.5, Dev Checklist §3.4, Architecture §Export Flow.

### Visual Objectives
- Clear and minimal export configuration; unobtrusive progress; accessible and responsive; matches app visual system.

### Layout Description (Textual Wireframes)

Export Panel (Modal) — desktop
```markdown
┌ Export Video ────────────────────────────────┐
│ Resolution: [ 1080p ▼ ]                     │
│ Destination: [/Users/…/video.mp4] [Choose]  │
│                                             │
│ [Export]  [Cancel]                          │
└─────────────────────────────────────────────┘
```

Progress Overlay
```markdown
┌ Exporting… (00:01:23 remaining) ────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░ 47%                          │
│ [Cancel]                                     │
└─────────────────────────────────────────────┘
```

Notes
- Spacing uses 8px grid; modal width ~420–480px; buttons right-aligned.

### Component Specifications
- Components: `ExportButton`, `ExportDialog`, `ResolutionSelect`, `DestinationField`, `ProgressBar`, `ProgressDialog`.
- States
  - Buttons: default, hover, focus-visible, disabled (Export disabled until destination set).
  - Select: default, open, focused; keyboard navigable.
  - Progress: indeterminate (startup) → determinate (parsed %); cancel active/disabled.
- Interaction
  - Keyboard: Tab order logical; Enter on Export submits; Esc closes dialog (when idle).
  - Cancel sends `export:cancel`; UI returns to idle with message “Export cancelled”.

### Color & Typography System (Tailwind Tokens)
- Colors: neutral slate/stone palette; primary accent `blue-500/600`; danger `red-500/600` for cancel.
- Focus ring: `ring-2 ring-offset-2 ring-blue-500` with `focus-visible`.
- Typography: Inter/Sans; titles `text-lg font-semibold`; labels `text-sm text-muted-foreground`.
- Spacing: `space-y-3` groups; container `p-6`.

### Motion & Accessibility
- Motion: 120–180ms ease-out for dialog open/close and hover transitions; progress updates smoothly without jank.
- Accessibility: WCAG AA contrasts; all controls keyboard reachable; ARIA labels for progress (`aria-valuenow` etc.).

### Responsive Behavior
- Desktop primary. On narrow widths, modal fills width with `max-w-full` and stacked buttons.

### Design Assets Summary
- Deliver: Component props and tokens ready for Build; icon set via Lucide (folder/file, check, x), shadcn/ui patterns for Dialog/Select where applicable.

### Next Steps / Open Questions
- Optional: show estimated file size (P1) if ffprobe is added; otherwise omit.
- Confirm whether export runs block edits or allow limited timeline edits (assumed: editing allowed; preview should remain responsive).

---

(End)


