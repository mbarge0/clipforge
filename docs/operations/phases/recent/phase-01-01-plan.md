# ClipForge — Supermodule 1: Foundation & Setup — Plan File

Phase: 01
Date: 2025-10-27
Owner: Engineering (Cursor + Matt)
Location: `/docs/operations/phases/recent/phase-01-01-plan.md`

---

## Start

### Previous Phase Summary
- This is the first implementation phase. No prior build phases exist. Using `docs/foundation/prd.md`, `docs/foundation/architecture.md`, and `docs/foundation/dev_checklist.md` as the authoritative baseline.

### Objective for this Phase
- Establish a secure, reproducible Electron app foundation with the correct process boundaries (main/preload/renderer), baseline IPC contracts, and working dev/build pipelines.

### Scope (Included)
- App bootstrap with Electron main and `BrowserWindow` configured for security.
- Preload bridge with typed, minimal IPC wrappers; `contextIsolation: true`, `nodeIntegration: false`.
- Renderer shell (React + Vite + TS) loads successfully via preload bridge.
- Environment and logger utilities wired per `config/`.
- Directory structure confirmed and documented (`main/`, `renderer/`, `config/`, `docs/`).

### Out of Scope (Deferred)
- Feature UIs (Media Library, Timeline, Export, Recording).
- Any recording/FFmpeg integration beyond scaffolding.
- Packaging polish and cross-platform verification beyond a basic packaged launch.

### Constraints
- Maintain architectural consistency with `architecture.md`.
- Do not break any tested or working modules (foundation first, then expand).
- Adhere to repo conventions and the Coding Rules in `docs/operations/coding_rules.md`.

### Deliverables
- Secure window creation and preload bridge in place.
- Baseline typed IPC surface established (namespaced, no Node APIs in renderer).
- `ENV` and `logger` utilities available and used without warnings.
- Reproducible installs with `npm ci`; versions documented.
- Dev server and packaged app both launch.

### Testing Plan (for this phase)
- Unit: trivial validators and IPC argument guards (if any).
- Integration: app launches, renderer loads, preload bridge callable; packaged app smoke.
- E2E (smoke): open app, verify renderer UI renders and bridge responds to a test IPC.

### Step-by-Step Implementation (High Level)
1) Confirm Node/Electron/Vite versions and lockfile; document versions in README or `docs`.
2) Validate directory structure; wire Electron main → preload → renderer.
3) Implement preload bridge exposing safe `ipcRenderer.invoke` wrappers only.
4) Configure `BrowserWindow` security flags and CSP where applicable.
5) Add environment and logger helpers; thread through minimal usages.
6) Verify `npm run dev` and create a packaged app; smoke test both.

### Definition of Done (Start Gate)
- App boots in < 5s in dev on reference machine.
- Renderer cannot access Node APIs directly; only via preload.
- Minimal IPC call succeeds end-to-end.

### Risks & Assumptions
- Risk: ASAR/FFmpeg packaging paths later; mitigation: plan `asarUnpack` now.
- Assumption: Local-first design; no backend/services required for MVP.

### Readiness Checkpoint
- PRD, architecture, and dev checklist are aligned on foundation scope and acceptance criteria. Ready to proceed to detailed planning.

---

## Plan

### Phase Context
- Phase: 01 — Supermodule 1: Foundation & Setup
- Date: 2025-10-27 — Initial planning loop

### Task Summary (Priority → Estimate)
- P0 — Confirm Node/Electron/Vite versions; lockfile reproducibility — 0.5h
- P0 — Define/verify directory structure (`main/`, `renderer/`, `config/`) — 0.5h
- P0 — Implement `preload.ts` minimal, typed IPC bridge — 1.5h
- P0 — Set `BrowserWindow` security (`contextIsolation`, `nodeIntegration`) — 0.5h
- P0 — Add environment and logger utilities; thread minimal usage — 1.0h
- P0 — Dev and packaged app smoke tests (launch/sanity IPC) — 1.0h
- P1 — Document versions and quickstart in README/docs — 0.5h

Total estimate: ~5.5 hours

### Dependency Graph (Text)
Confirm versions → Define structure → Preload bridge → Window security → Env/logger → Launch tests → Docs

### Task Breakdown with Mapping
- Confirm versions and lockfile
  - Mapping: Dev Checklist 3.1 [Plan] “Confirm Node/Electron/Vite versions and lockfile checked in”.
  - Acceptance: `npm ci` reproducible; versions documented.
- Define directory structure
  - Mapping: Dev Checklist 3.1 [Plan] “Define directory structure”.
  - Acceptance: imports resolve; dev server and Electron start.
- Implement preload bridge
  - Mapping: Dev Checklist 3.1 [Build] “Implement `preload.ts` with minimal, typed IPC bridge”. PRD Security & IPC constraints.
  - Acceptance: only safe invoke wrappers exposed; no Node globals in renderer.
- Configure `BrowserWindow` security
  - Mapping: Dev Checklist 3.1 [Build] “contextIsolation true, nodeIntegration false”. Architecture §Security.
  - Acceptance: app loads via preload; renderer sandboxed.
- Environment & logger utilities
  - Mapping: Dev Checklist 3.1 [Build] “Add environment and logger utilities”.
  - Acceptance: used without warnings; simple structured logs appear.
- Launch tests (dev + packaged)
  - Mapping: Dev Checklist [Validate] “App boots in <5s in dev on reference machine”. Architecture packaging notes.
  - Acceptance: app launches in both modes; simple IPC round-trip works.

### Issues and Blockers (anticipated)
- Packaging nuances for FFmpeg to be addressed later; ensure config scaffolding anticipates `asarUnpack`.
- Electron version alignment with Vite/TypeScript template.

### Risk Mitigation
- Lock versions early; CI `npm ci` gate.
- Keep preload surface minimal; add Zod or guards before expanding.

### Regression Plan
- Reference file not found: `/docs/operations/regression/00_master_regression_manifest.md`.
  - Action: Generate the master manifest using `/prompts/system/foundation/08_regression_manifest.md` → output to `/docs/operations/regression_manifest.md`.
- For this phase, regression scope is minimal (no prior phases). Guard against regressions in:
  - App launch performance (<5s) and stability in dev and packaged modes.
  - Security posture: renderer cannot access Node APIs directly.
  - IPC baseline call remains functional after subsequent module additions.

### Updated Success Criteria
- Matches Dev Checklist §3.1 Validate and PRD §4 performance targets (launch <5s).

### Next Steps
1) Implement preload bridge and window security.
2) Add env/logger and verify launch in dev and packaged.
3) Create or update README/docs with versions and quickstart.
4) Generate Master Regression Manifest for future phases.

---

## Design

### Phase Context
- Phase: 01 — Design scope limited to foundation shell (no feature UIs yet).
- References: `docs/foundation/prd.md` · `docs/foundation/architecture.md` · `docs/foundation/user_flow.md` · `docs/operations/coding_rules.md`.

### Visual Objectives
- Clear 3-pane app shell (Library, Preview, Timeline) with a top toolbar.
- Modern, minimal, high-contrast UI; accessible defaults; 8px spacing grid.

### Layout Description (Textual Wireframe)
```
┌──────────────────────────────── ClipForge Toolbar ───────────────────────────────┐
│ [Record Screen] [Record Webcam] [PiP] | [Import] | [Export] | [Settings]        │
├─────────────── Sidebar: Media Library ──────────────┬────────── Preview ────────┤
│ - Thumbnails + meta (name, duration, res, size)     │  ┌──────────────────────┐ │
│ - Drag source into timeline                          │  │  <video> player     │ │
│ - Import dropzone / button                           │  │  with controls      │ │
│                                                      │  └──────────────────────┘ │
├────────────────────────────── Timeline (bottom) ─────────────────────────────────┤
│  [Time ruler] | [Track 1] [Track 2] | Playhead | Zoom +/- | Current Time        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

Notes
- Toolbar is always visible; left Sidebar is fixed min-width; Preview flexes.
- Timeline reserves bottom 35–40% height; scroll/zoom within timeline area.

### Component Specifications
- Toolbar: primary buttons with icons and labels; hover (bg subtle), focus (ring), disabled (reduced opacity).
- Sidebar Library Item: default (card), hover (elevate + subtle bg), selected (accent border), disabled (muted text).
- Timeline Clip: default (solid fill per track color), hover (elevate), focus (outline), active-drag (shadow), disabled (muted).
- Buttons: use shadcn/ui patterns; size md; icons via Lucide.

States
- Hover: bg-neutral-800 → bg-neutral-750 (subtle), cursor-pointer.
- Focus: 2px focus ring `ring-accent-500` with offset.
- Disabled: `opacity-50` and no hover.
- Motion: 150–200ms ease-out for hover/press; 200–250ms ease-in-out for layout shifts.

### Color & Typography System (Tailwind tokens)
- Colors
  - Background: `neutral-900`
  - Surface: `neutral-850`
  - Border: `neutral-700`
  - Text-primary: `neutral-100`
  - Text-secondary: `neutral-300`
  - Accent: `indigo-500` (hover `indigo-400`, focus ring `indigo-500`)
  - Danger: `rose-500`
- Typography
  - Font: system-ui / Inter
  - Scale: 12, 14, 16, 18, 20, 24, 32
  - Line-heights: 1.3–1.5; headings semibold, body regular
- Spacing
  - 8px grid (`2`, `3`, `4`, `6`, `8`, `10`, `12`)
  - Radius: `rounded-md` (clip chips `rounded-sm`)

### Responsive & Accessibility Guidelines
- Breakpoints: ≥1280px desktop primary; 1024–1279 compact; below 1024 defer feature UIs (desktop-focused app).
- Keyboard: Tab order — Toolbar → Sidebar → Timeline → Preview controls; Space toggles play in Preview.
- Contrast: WCAG AA on text over surfaces; avoid < 4.5:1.
- Focus: visible ring on all actionable components.

### Design Assets Summary
- Components: ToolbarButton, SidebarList, MediaCard, TimelineTrack, TimelineClip, PreviewPlayer, ZoomControl.
- Icons: Lucide (record, webcam, layout, import, export, settings, zoom, play/pause).
- Motion: Framer Motion for subtle fades/position transitions (100–250ms).

### Next Steps (Design → Build Handoff)
- Confirm shell layout and tokens; proceed to Build implementing Toolbar, Sidebar shell, Preview mount, Timeline area container with static tracks.
- Open questions: None for shell. Feature UIs will be designed in their respective phases.


