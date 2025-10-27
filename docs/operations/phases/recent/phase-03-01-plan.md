# Supermodule 3 — Timeline & Playback — Plan (Consolidated Start/Plan/Design)

Phase: 03
Date: 2025-10-27
Output Path: `/docs/operations/phases/recent/phase-03-01-plan.md`

---

## Start

### Previous Phase Summary (from Phase 02 — Media Library & Import)
- Media Library MVP is complete and stable: drag/drop + picker import, validation (MP4/MOV/WebM; ≤500MB), metadata (duration/resolution), thumbnails.
- Security posture intact (contextIsolation, no Node in renderer). Docs current. Ready to proceed to Timeline & Playback with clear next objectives.
- Key dependencies to carry forward: media items expose `filePath`, `durationMs`, `width`, `height`, `thumbnail`.

### Objective for this Phase
Build the Timeline & Playback core so users can arrange clips on a 2-track timeline, trim/split/move/delete clips, and preview the composition with synchronized playback and keyboard shortcuts.

- Direct PRD alignment: PRD §Timeline Editor (Multi-Track Timeline, Clip Manipulation) and §Preview & Playback.
- Dev Checklist alignment: Checklist §3.3 Timeline & Playback ([Plan] types; [Build] timeline UI, DnD, trim, split, reorder, delete, undo, preview sync, shortcuts).

### Constraints
- Maintain architectural consistency (Electron security; no Node APIs in renderer).
- Don’t break Media Library imports; preserve metadata shape and performance.
- Adhere to repository conventions for file structure and naming.

### Proposed Architecture / Component Layout
- State: `Zustand` store for `TimelineState` (ms timebase). Entities: `Clip`, `Track`, `TimelineState` exported from a single source (e.g., `renderer/src/lib/timeline.types.ts`).
- UI: `Timeline` component (ruler, tracks, clips, playhead, selection), `PlayerController` for `<video>` preview sync, `KeyboardShortcuts` layer.
- Interaction: Drag from Media Library → Track drop zones; clip selection; edge trim handles; split at playhead; drag to move/reorder with snap; delete key; undo stack (last ≥10 actions).
- Preview: HTML5 `<video>` using currently selected clip/time; play/pause via Space; scrubbing updates under 100ms.

### Testing Plan (this phase)
- Unit: clip math (trim/split), time formatting, undo stack behavior.
- Integration: drag from library → timeline; split/trim update state; preview sync with play/pause and scrubbing.
- E2E (smoke): create 3-clip sequence, trim/split/move, play preview at 30+ fps.
- Example file paths:
  - `renderer/src/lib/timeline.math.test.ts`
  - `renderer/src/store/timeline.store.test.ts`
  - `renderer/src/components/Timeline.e2e.spec.ts`

### Step-by-Step Implementation Plan
1) Define types and guards for `Clip`, `Track`, `TimelineState` (ms timebase).
2) Create `timeline` store with actions: addClip, trimClip, splitAt, moveClip, deleteSelection, setPlayhead, togglePlay, undo.
3) Implement `Timeline` UI shell: ruler, playhead, two track lanes, empty state.
4) Enable drag-from-library to timeline; render clip blocks with selection + resize handles.
5) Implement trim (edge drag), split (Cmd/Ctrl+B), move/reorder with snap-to-grid, delete selection.
6) Add undo stack (≥10 actions).
7) Implement preview controller: Space toggles play/pause; playhead sync; scrubbing latency <100ms.
8) Wire keyboard shortcuts: Space, Delete/Backspace, Cmd/Ctrl+Z, Cmd/Ctrl+B, Cmd/Ctrl+C/V (copy/paste P2 optional).
9) Validate performance with 10+ clips and measure scrubbing responsiveness.

### Expected Outcome / Definition of Done
- Two-track timeline visible with ruler and playhead.
- Drag from Media Library places clips; trim, split, move/reorder, delete all functional.
- Undo (≥10 actions) works reliably.
- Preview syncs with timeline; Space toggles play/pause; scrubbing responds <100ms; 30+ fps target.

### Checkpoint Readiness & Assumptions
- Assumptions: Media metadata present; no project persistence required this phase; preview can seek within local files directly.
- Ready to proceed. Risks noted below will be mitigated in Plan step.

---

## Plan

### Overview
- Scope: Implement Timeline & Playback core (types, store, UI, interactions, preview sync, shortcuts).
- Estimate: ~8–12 hours for MVP interactions and preview sync.

### Task Summary (Priority, Effort, Mapping)
- P0 — Types and Store (2h)
  - Map: Dev Checklist §3.3 [Plan] Define entities; PRD §Architecture/Data Model.
- P0 — Timeline Shell UI (ruler, playhead, 2 tracks) (2h)
  - Map: Checklist §3.3 [Build] Render timeline; PRD §Timeline Editor.
- P0 — Drag from Library → Timeline (1.5h)
  - Map: Checklist §3.3 [Build] Add clip by drag; PRD §Media Management → Timeline.
- P0 — Trim via edge drag (2h)
  - Map: Checklist §3.3 [Build] Trim; PRD §Clip Manipulation.
- P0 — Split at playhead (1.5h)
  - Map: Checklist §3.3 [Build] Split; PRD §Clip Manipulation.
- P0 — Move/Reorder with snap (1.5h)
  - Map: Checklist §3.3 [Build] Reorder/move; PRD §Clip Manipulation.
- P0 — Delete selection (0.5h)
  - Map: Checklist §3.3 [Build] Delete; PRD §Clip Manipulation.
- P0 — Undo (≥10 actions) (1h)
  - Map: Checklist §3.3 [Build] Undo; PRD §Keyboard Shortcuts.
- P0 — Preview sync + Space play/pause (2h)
  - Map: Checklist §3.3 [Build] Preview sync; PRD §Preview & Playback.
- P1 — Zoom controls (defer if needed)
  - Map: PRD §Timeline Editor (zoom); optional this phase.

### Dependencies
- Upstream: Media Library items and metadata (Phase 02) must remain accessible and performant.
- Internal: Types → Store → UI shell → Interactions → Preview → Shortcuts.

### Dependency Graph (text)
Types/Guards → Store (actions/selectors) → Timeline Shell (ruler, tracks, playhead)
→ DnD from Library → Clip Blocks (selection, handles)
→ Interactions (trim/split/move/delete) → Undo
→ Preview Controller (sync + shortcuts)

### Task Breakdown (IDs, AC, Steps)
- T3-01 Types & Guards
  - AC: `Clip`, `Track`, `TimelineState` exported; timebase in ms; minimal validators.
  - Steps: define interfaces; add type guards; export from `renderer/src/lib/timeline.types.ts`.
- T3-02 Store
  - AC: Zustand store with actions listed; undo stack functional (≥10 actions).
  - Steps: create store; implement pure reducers/utilities; add simple tests.
- T3-03 Timeline Shell
  - AC: Ruler, playhead, 2 tracks render; empty state message.
  - Steps: component scaffold; layout and basic styling tokens.
- T3-04 DnD Add Clip
  - AC: Drag library item to track adds clip block at drop position.
  - Steps: integrate library item source; implement drop targets.
- T3-05 Trim
  - AC: Edge handles adjust in/out; visual feedback; state updates.
  - Steps: pointer events; constraints; update math.
- T3-06 Split
  - AC: Cmd/Ctrl+B splits selected clip at playhead into two clips.
  - Steps: hotkey; state op; selection management.
- T3-07 Move/Reorder
  - AC: Drag within/across tracks with snap-to-grid; no overlaps.
  - Steps: drag logic; collision rules; snap units.
- T3-08 Delete
  - AC: Delete/Backspace removes selection; state and UI update.
  - Steps: hotkey; confirm; update selection.
- T3-09 Undo
  - AC: Undo last ≥10 actions reliably; redo optional.
  - Steps: stack structure; integrate with store ops.
- T3-10 Preview Sync + Shortcuts
  - AC: Space toggles play/pause; scrubbing <100ms; playhead updates; preview reflects edits.
  - Steps: controller; throttle/debounce; event wiring.

### Risks and Mitigations
- Performance under many clips: keep render minimal; memoize; avoid heavy DOM; throttle scrubbing.
- Time math precision: use integers (ms) everywhere; centralize math utils with tests.
- Drag-and-drop edge cases: guard against overlaps; enforce track constraints.
- Undo complexity: confine to last 10 actions; snapshot minimal diffs.

### Regression Planning
- Reference: `/docs/operations/regression_manifest.md` (Phase 03 expectations).
- Must remain stable:
  - Media imports and metadata display (Phase 02).
  - App stability and security flags (Phase 01).
- Potentially affected areas:
  - Media Library drag sources; ensure no change to import flow.
  - Preview performance; ensure 30+ fps and <100ms scrubbing.
- Add to Debug/Validation:
  - Regression checks: import → add to timeline → preview still works.
  - Performance spot-check with 10+ clips.

### Success Metrics
- Functional: All P0 interactions pass acceptance criteria above.
- Performance: 30+ fps timeline; <100ms scrub latency; stable memory during 15-minute session.
- UX: Keyboard shortcuts responsive (<50ms perceived); clear selection/hover/focus states.

### Checkpoint Schedule
- CP1: Types + Store defined and tested.
- CP2: Timeline shell renders; DnD clip add working.
- CP3: Trim/split/move/delete + undo completed.
- CP4: Preview sync + shortcuts verified; performance spot-checks pass.

### Next Steps
- Proceed to Design step assets (tokens, wireframes) and confirm before Build.

---

## Design

### Phase Context
- Phase: 03 — Timeline & Playback (UI/UX for MVP interactions and preview).
- Scope: Timeline area (bottom), Preview (top-right), Media Library (top-left), toolbar/shortcuts references.
- References: PRD §Timeline Editor, §Preview & Playback; Architecture §Data Model; Dev Checklist §3.3.

### Visual Objectives
- Clear, minimal, high-contrast layout using an 8px spacing grid.
- Immediate affordances for selection, trim handles, and playhead visibility.
- Smooth, subtle motion (100–200ms) for selection/hover and playhead updates.

### Layout Description (textual wireframe)
```
[ Toolbar / Shortcuts Hints ]
┌───────────────────────────── App Main Window ─────────────────────────────┐
│  Media Library (top-left)   │              Preview (top-right)            │
│  - thumbnails + metadata    │  - <video> area with 16:9 container        │
│  - drag source              │  - Play/Pause button (mirrors Space)       │
├───────────────────────────────────────────────────────────────────────────┤
│                          Timeline (bottom)                                │
│  Time Ruler 00:00 ─ 00:10 ─ 00:20 ─ …                                     │
│  Playhead ▼ (red)                                                          │
│  Track 1: [■■ Clip A ■■][■ Clip B ■]                                      │
│  Track 2: [■ PiP Clip ■         ]                                         │
│  - Clips show start/end, selection border, trim handles                    │
└───────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications
- Timeline
  - Ruler with tick marks every 1s; stronger marks every 5s.
  - Playhead line (2px, accent color); draggable for scrubbing.
  - Track lanes (2 fixed lanes for MVP); vertical spacing 8–12px.
  - Clip blocks: rounded corners; thumbnail tint optional; show duration label.
  - States: default, hover (elevated border), selected (accent border + focus ring), dragging (opacity 80%), disabled (none for MVP).
  - Handles: left/right trim handles (6–8px width) become visible on hover/selection.
- Preview
  - 16:9 container; letterbox if needed; fit-contain; background neutral 900.
  - Controls: Play/Pause button mirrors Space; time display; optional scrub bar (later).
- Shortcuts Layer
  - Space, Delete/Backspace, Cmd/Ctrl+Z, Cmd/Ctrl+B active when timeline focused.

### Color & Typography System (Tailwind tokens)
- Colors
  - Background: `bg-neutral-950`, panels `bg-neutral-900`.
  - Borders: `border-neutral-700`; focus `ring-2 ring-sky-400`.
  - Accents: `text-sky-300`, playhead `bg-rose-500`.
  - Clips: Track 1 `bg-sky-800/60`, Track 2 `bg-emerald-800/60`.
- Typography
  - Base: `font-sans`; sizes: `text-xs`, `text-sm`, `text-base` for labels.
  - Weights: 500 for labels, 600 for headings.
- Spacing & Radius
  - Grid: 8px scale (`gap-2`, `p-2`, `p-3`), radius `rounded-sm`/`rounded`.

### Motion & Interaction
- Animations: 100–200ms `ease-out` for hover/selection; playhead moves without animation during playback to avoid jitter.
- Snap-to-grid: 0.1s (100ms) time divisions for precise alignment; visual snap hint.

### Responsive & Accessibility
- Breakpoints: Desktop primary; tablet layout stacks preview over library; timeline remains bottom.
- Keyboard: Focusable clip blocks; arrow keys optional later; visible focus ring (`ring-sky-400`).
- Contrast: ≥ WCAG AA; verify playhead and selection visibility on dark theme.
- Hit targets: trim handles ≥ 8px; clip selection area ≥ 24px height.

### Design Assets Summary (handoff to Build)
- Components: `Timeline`, `TrackLane`, `ClipBlock`, `TimeRuler`, `Playhead`, `PreviewPane`, `ShortcutsLayer`.
- Tokens: color palette above; spacing (8px grid); typography scale.
- States: default, hover, selected, dragging, focus, disabled (n/a MVP).

### Next Steps / Open Questions
- Confirm whether zoom controls are P0 or can be deferred to P1.
- Confirm if copy/paste (Cmd/Ctrl+C/V) is P2 this phase (likely defer).
- Validate performance with representative 1080p clips (5–10 items).

---

End of consolidated Start/Plan/Design for Phase 03 — Timeline & Playback.
