# Supermodule 2 — Media Library & Import — Plan (Consolidated)

Phase: 02
Date: 2025-10-27
Output Path: `/docs/operations/phases/recent/phase-02-01-plan.md`

---

## Start

### Previous Phase Summary (from Phase 01 — Foundation & Setup)
- Foundation is stable, secure, and verified with a simple IPC roundtrip. The dev environment is resilient after GPU/sandbox tweaks.
- Core deliverables landed: secured `BrowserWindow` (contextIsolation on, nodeIntegration off), typed `preload` bridge, IPC health check wired in renderer, `ENV` and `logger` utilities.
- Risks carried forward: packaging validation (asarUnpack for FFmpeg binaries) deferred; ensure dev-only GPU/sandbox flags do not ship in production.

### Objective for this Phase
Deliver Media Library & Import MVP: drag-and-drop and file picker import, validation (format/size), metadata extraction (duration/resolution/size), and thumbnail generation. Provide a left sidebar library UI feeding Timeline in later phases.

### Dependencies & Alignment Check
- Architecture alignment: Media Library depends on stable Foundation IPC and renderer shell per `architecture.md` (Supermodule Architecture Map, Media Library responsibilities). ✔
- PRD alignment: Matches PRD Media Management requirements (formats MP4/MOV/WebM, 500MB limit, thumbnails, metadata). ✔
- Dev Checklist alignment: Maps to Checklist §3.2 Media Library & Import tasks ([Plan], [Build], [Debug], [Validate]). ✔
- Regression alignment: Must not regress Phase 01 stability/IPC surface; reference Master Regression Manifest (Phase 02 scope and dependencies). ✔

### Scope
- Included:
  - Drag-and-drop import zone in Media Library sidebar
  - File picker import alternative
  - Validation of file type (MP4/MOV/WebM) and size (≤ 500MB)
  - Metadata extraction (duration, resolution, size)
  - Thumbnail generation (first frame or mid-point)
  - Renderer-only UI state with paths stored; file system operations remain in main process via IPC if/when needed
- Explicitly excluded/deferred:
  - Persistent project save/load (deferred)
  - FFprobe integration (optional later if HTMLVideoElement probing insufficient)
  - Advanced metadata (codecs/bitrate), waveform extraction
  - Timeline interactions beyond basic drag from library (handled in Phase 03)

### Deliverables
- Media Library UI (sidebar) with dropzone and list of items (thumbnail + metadata)
- Import service (renderer) + IPC calls to main for any file-system guarded actions (if needed)
- Validation utility and single source of truth for supported formats/size limit in config
- Toasts/errors for invalid files; happy path demo clips visible

### Risks and Assumptions
- Assumptions: HTMLVideoElement probing is adequate for duration/resolution for MVP; thumbnails derivable via `<video>` + canvas without FFprobe.
- Risks: Large files close to 500MB may cause memory spikes during thumbnailing; mitigation: sample mid-frame with lowered canvas resolution and revoke object URLs promptly.
- Security: Maintain context isolation; never expose Node APIs to renderer; pass only file paths through IPC.

### Testing Focus (Phase Start)
- Unit: validator (format/size), metadata parsing helpers
- Integration: drag-drop and picker flows; thumbnail capture pipeline
- E2E: import → library list updates → errors for invalid/oversized files

### Implementation Outline (High-Level)
1) Define supported formats and max size in config (single source of truth)
2) Build Library sidebar shell with dropzone and file picker button
3) Implement validation and rejection reasons with UI feedback
4) Implement metadata extraction and thumbnail generation
5) Wire minimal IPC if main-process assistance is required (e.g., safe path handling)
6) Smoke test and document

### Checkpoint Readiness
- Dependencies satisfied (Phase 01 stable, IPC ready). No blockers identified.
- Proceed to Planning Loop with priority and effort breakdown.

---

## Plan

### Overview
We are entering the Planning Loop to sequence tasks, estimate effort, map to PRD/Checklist, and define regression coverage.

### Task Summary and Effort Estimates
- P1 Define config constants for formats and size limit (0.5h)
  - Maps: PRD §Media Management; Checklist 3.2 [Plan]
- P1 Validation utility (type/size) with tests (1.0h)
  - Maps: PRD import rules; Checklist 3.2 [Build Validation]
- P1 Library UI shell: sidebar + dropzone + empty state (1.5h)
  - Maps: PRD Media Library UI; UI Guidelines tokens
- P1 File picker import (0.5h)
  - Maps: PRD alternate import path; Checklist 3.2 [Build File picker]
- P1 Metadata extraction (duration/resolution/size) via `<video>` + object URL (1.5h)
  - Maps: PRD metadata; Checklist 3.2 [Build Metadata]
- P2 Thumbnail generation (first frame or mid-frame) via canvas (1.0h)
  - Maps: PRD thumbnails; Checklist 3.2 [Build Thumbnails]
- P2 Error handling UI (toast/messages) and invalid state visuals (0.5h)
  - Maps: PRD error guidance; UI Guidelines
- P2 IPC hooks for guarded file ops (only if needed) (0.5h)
  - Maps: Architecture security posture
- P2 E2E import happy path + invalid file tests (1.0h)
  - Maps: Checklist 3.2 [Validate]

Estimated total: ~8.0 hours (including buffer for iteration).

### Dependency Graph (text)
Config → Validation → (Dropzone + Picker) → Metadata → Thumbnail → Error UI → Tests/Validate

### Critical Path
1. Config constants
2. Validation utility
3. Dropzone + Picker
4. Metadata extraction
5. Thumbnail generation
6. Validation/E2E checks

### Risks and Mitigations (Planning)
- Thumbnail performance: downscale canvas captures (≤ 320px width), capture at mid-duration after `loadeddata`.
- Drag-drop file handling: rely on File objects (not raw paths) to avoid Node in renderer; use object URLs.
- Cross-platform codecs: validation by extension list only for MVP to avoid ffprobe dependency; defer deeper codec checks.

### Regression Plan
Reference: `/docs/operations/regression_manifest.md` (Master Regression Manifest)
- Potentially affected prior systems: Foundation & Setup (window creation, preload, IPC surface).
- Must remain stable:
  - App launch <5s; no crashes during multiple imports
  - Renderer remains isolated from Node APIs; all FS ops remain in main
  - IPC health check continues to pass
- Add to Debug plan for this phase:
  - Smoke: 5 sequential imports (valid + invalid mix) without crash
  - Verify `window.electron` surface unchanged; no new direct Node access
  - Lint and type checks remain clean in renderer after UI additions

### Updated Success Criteria (Phase-specific)
- 100% of valid MP4/MOV/WebM ≤ 500MB import successfully and appear with thumbnail + metadata
- Invalid format/oversize produce clear, actionable error messages
- Drag-drop and picker both functional; E2E happy path passes

### Next Steps
- Implement config + validation utilities
- Build sidebar shell and dropzone
- Add picker flow, then metadata + thumbnail
- Wire toasts and E2E tests; run regression smoke

---

## Design

### Phase Context
- Phase 02 — Media Library & Import (UI for import and asset listing)
- References: PRD §Media Management; `architecture.md` Supermodule Map; UI Guidelines v1.0

### Visual Objectives
- Clear, modern, minimal sidebar emphasizing thumbnails and quick scanning
- Consistent tokens (colors/spacing/type) with dark-first theme and AA+ contrast
- Obvious import affordances (dropzone hover, button for picker)

### Layout Description (Textual Wireframe)

App Frame (high level)
- Header toolbar (48–56px) — actions incl. Record, Import, Help
- Main grid (2 columns):
  - Left Sidebar (Media Library) width 280–320px
  - Right Main: Preview (top-right) and Timeline (bottom)

Media Library Sidebar
- Header: "Media Library" (H3) + small "Import" button
- Dropzone surface occupies top area when empty; collapses when items exist
- List of media items (virtualized if needed later)

Wireframe (Markdown)
```
[Toolbar ─────────────────────────────────────────────────────────]
| Sidebar (Media Library) | Preview (top-right)                     |
|  ┌ Dropzone (empty) ┐   |                                         |
|  |  Drag files here |   |                                         |
|  └───────────────┬──┘   |                                         |
|  [Pick files] [ℹ] |     |                                         |
|                   |     |                                         |
|  Item ┌thumb┐     |     |                Timeline                 |
|       |    │ meta |     |  ────────────────────────────────────   |
|  Item └────┘      |     |                                         |
|                   |     |                                         |
```

### Component Specifications
- Dropzone
  - States: idle (dashed border, subtle), hover (brand border + bg-elevated), active (solid border), invalid (danger border)
  - Behavior: highlight on dragenter/over; show rejection messages on drop
- Import Button
  - Variant: Primary (brand) in empty state, Secondary once items exist
  - States: hover (brightness +5%), active (−5%), focus ring 2px brand
- Media Item Card (row)
  - Contents: 64–96px thumbnail (16:9), title (filename), caption (duration • resolution • size)
  - States: hover elevation, selected state if on timeline (badge or subtle left accent)
  - Actions (later): context menu for remove/reveal in Finder (deferred)

### Color & Typography System
- Use UI tokens:
  - Colors: bg, surface, border, muted, fg, brand, danger (from UI Guidelines)
  - Typography: H3 18–20px semibold; Body 14–16px; Caption 12–13px muted
- Spacing: 8px grid (4/8/12/16/24/32); Radius: md (8) for cards and inputs

### Motion & Interaction
- Durations: 150–200ms; Easing: cubic-bezier(0.2, 0.8, 0.2, 1)
- Dropzone hover: subtle scale 1.01 + border color transition
- Item hover: shadow-sm to shadow-md transition; reduced motion respected

### Responsive & Accessibility
- Sidebar remains fixed width ≥280px; content scrolls
- Keyboard: dropzone focusable; Enter opens picker; visible focus ring
- Contrast: text/background ≥ 4.5:1; controls ≥ 3:1
- ARIA: `aria-label` for Import; live region for error toasts

### Design Assets Summary (for Build)
- Tokens: color variables, radius, spacing, type scale
- Components: Dropzone, Button, MediaItemRow (thumb+meta), Toast
- Icons: Lucide `Upload`, `FolderOpen`, `AlertCircle`

### Next Steps / Open Questions
- Thumbnail capture timing: use mid-point by default; fall back to first frame if seek stalls (>300ms)
- Thumbnail max size: cap width at 320px to control memory
- Long filenames: truncate with middle ellipsis
- If any of the above differ from expectations, pause here for adjustment before Build.

---

(End of Consolidated Plan for Phase 02)
