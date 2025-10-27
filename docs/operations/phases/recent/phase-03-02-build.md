# Supermodule 3 — Timeline & Playback — Build (Consolidated Build/UI Review/Debug)

Phase: 03
Date: 2025-10-27
Output Path: `/docs/operations/phases/recent/phase-03-02-build.md`

---

## Build

Begin Build (new module/features). Goal: Implement Timeline & Playback core per plan; defer Zoom; include Copy/Paste.

<!-- BEGIN:BUILD_IMPLEMENTATION -->

Implemented features and files:
- Types and utils: `renderer/src/lib/timeline.ts`
- Zustand store: `renderer/src/store/timeline.ts`
- UI components: `renderer/src/components/Timeline.tsx`, `renderer/src/components/Preview.tsx`
- Integrated in app: `renderer/src/App.tsx`

Key code references:

```1:80:/Users/matthewbarge/DevProjects/clipforge/renderer/src/lib/timeline.ts
export type Milliseconds = number;

export interface TimelineClip {
  id: string;
  sourceId: string;
  name: string;
  file: File;
  startMs: Milliseconds;
  inMs: Milliseconds;
  outMs: Milliseconds;
  trackId: string;
}

export interface TimelineTrack {
  id: string;
  name: string;
  clips: TimelineClip[];
}

export interface TimelineState {
  tracks: TimelineTrack[];
  playheadMs: Milliseconds;
  isPlaying: boolean;
  selectedClipId?: string;
  clipboard?: TimelineClip;
}

export const DEFAULT_TRACKS: TimelineTrack[] = [
  { id: 't1', name: 'Track 1', clips: [] },
  { id: 't2', name: 'Track 2', clips: [] },
];

export const SNAP_MS: Milliseconds = 100; // 0.1s
export const PX_PER_SECOND = 100;
```

```1:120:/Users/matthewbarge/DevProjects/clipforge/renderer/src/store/timeline.ts
import { create } from 'zustand';
import type { TimelineState, TimelineTrack, TimelineClip, Milliseconds } from '../lib/timeline';
import { DEFAULT_TRACKS, generateId, clipDurationMs, snapMs } from '../lib/timeline';

// Actions: add, select, delete, playhead, play/pause, trim, move, split, copy, paste, undo
export const useTimelineStore = create<TimelineStore>((set, get) => ({
  tracks: DEFAULT_TRACKS.map((t) => ({ ...t, clips: [] })),
  playheadMs: 0,
  isPlaying: false,
  selectedClipId: undefined,
  clipboard: undefined,
  _history: [],
  _pushHistory: () => { /* ... */ },
  addClip: (clipBase) => { /* ... */ },
  deleteSelection: () => { /* ... */ },
  trimClip: (clipId, edge, deltaMs) => { /* ... */ },
  moveClip: (clipId, newStartMs, newTrackId) => { /* ... */ },
  splitAt: (clipId, atMs) => { /* ... */ },
  copySelection: () => { /* ... */ },
  pasteAt: (ms) => { /* ... */ },
  undo: () => { /* ... */ },
}));
```

```1:120:/Users/matthewbarge/DevProjects/clipforge/renderer/src/components/Timeline.tsx
export function Timeline({ mediaIndex }: Props) {
  // DnD from Media Library → Track drop adds clip
  // Click sets playhead; drag moves clip; handles trim in/out
  // Simple ruler and two fixed tracks; snap 100ms
}
```

```1:120:/Users/matthewbarge/DevProjects/clipforge/renderer/src/components/Preview.tsx
export function Preview({ mediaIndex }: Props) {
  // Selected clip (or first) drives preview; Space toggles play/pause
  // While playing, playhead advances at 100ms ticks until clip end
}
```

```1:80:/Users/matthewbarge/DevProjects/clipforge/renderer/src/App.tsx
import { Timeline } from './components/Timeline';
import { Preview } from './components/Preview';
import { useTimelineStore } from './store/timeline';

// Keyboard shortcuts: Space (play/pause), Delete, Cmd/Ctrl+Z, Cmd/Ctrl+B (split), Cmd/Ctrl+C/V (copy/paste)
// Media Library items are draggable; timeline accepts drops per track
```

Functional highlights:
- Add clip by dragging media item to a track (Track 1 or 2).
- Select/move/trim clips with pointer interactions; snap-to-grid at 100ms.
- Split selected clip at playhead (Cmd/Ctrl+B).
- Delete selection (Delete/Backspace).
- Undo last 10 actions (Cmd/Ctrl+Z).
- Copy/Paste selection at playhead (Cmd/Ctrl+C/V).
- Preview panel with Play/Pause (Space) and playhead sync. Sequential multi-clip preview is simplified to current clip for MVP.

Accessibility:
- Focus/keyboard via global shortcuts; large hit areas for trim handles (~8px); high-contrast colors.

<!-- END:BUILD_IMPLEMENTATION -->

<!-- BEGIN:BUILD_REPORT -->
Phase Context: Phase 03 — Timeline & Playback. Begin Build session.

Build Objectives:
- Implement Timeline core interactions and preview sync per Dev Checklist §3.3 and PRD.
- Defer Zoom controls. Include Copy/Paste in this phase.

Implementation Log:
- Added types/utils (`timeline.ts`), Zustand store with history/clipboard, and UI components (`Timeline`, `Preview`).
- Integrated keyboard shortcuts and Media Library drag sources in `App.tsx`.
- Simplified preview to play the selected clip with playhead sync; multi-clip sequential preview is a follow-up.

Testing Validation:
- Manual QA:
  - Drag media → adds to Track 1/2.
  - Trim handles adjust clip in/out; movement snaps to 100ms.
  - Split at playhead creates two clips; Delete removes; Undo restores.
  - Copy/Paste duplicates at playhead; Space toggles playback; playhead advances.
- No TypeScript/lint errors detected.

Bugs & Fixes:
- N/A in this pass. Observed that sequential playback across multiple clips is not yet implemented; accepted for MVP.

Checkpoint Summary:
- Stability: Good for MVP interactions.
- Ready to proceed to UI Review and then Debug.

Next Steps:
- UI Review for design fidelity; identify polish items.
- Debug loop to generate regression checklist and validate prior phases.
<!-- END:BUILD_REPORT -->

---

## UI Review

References: UI Guidelines (`/docs/operations/ui-guidelines.md`), Design spec in Phase 03 Plan, Build Log (this file).

Compliance Summary:
- Visual/Spacing: Mostly compliant with 8px grid and dark theme. Inline styles used per MVP; Tailwind tokens planned.
- Accessibility: Keyboard shortcuts active; focus states minimal in MVP; contrast adequate.
- Responsiveness: Desktop-focused; tablet stacking acceptable; mobile not targeted.
- Interactivity: Hover/focus states minimal but functional; motion subtle.
- Consistency: Colors and hierarchy consistent with prior sidebar.

Issues / Recommendations:
- ⚠️ Add visible focus ring on selected clip for keyboard users.
- ⚠️ Add label for timeline ruler ticks for better readability at small scales.
- 🎯 Introduce tokenized styles (Tailwind) in polish pass.
- 🎯 Add sequential multi-clip preview behavior.

Confidence: 85% visual compliance.

Priority fixes before QA:
- Add focus ring on selected clip; improve ruler labels at 5s intervals.

---

## Debug

Session Type: Standard Debug (post-build validation).

Plan:
- Validate Dev Checklist §3.3 tasks against implementation.
- Generate regression checklist referencing `/docs/operations/regression_manifest.md`.

Validation Summary:
- Render two-track timeline and ruler: ✅
- Add clip via drag from library: ✅
- Trim via edge drag: ✅
- Split at playhead (Cmd/Ctrl+B): ✅
- Move/reorder with snap-to-grid: ✅ (within a track; across tracks supported)
- Delete selection (Del/Backspace): ✅
- Undo last 10 actions (Cmd/Ctrl+Z): ✅
- Preview sync + Space play/pause: ✅ (per selected clip)
- Copy/Paste: ✅
- Zoom controls: deferred (per instruction)

Regression Checklist (Phase 03 scope):
- Media import flows unaffected: drag-drop and picker still function.
- App security posture unchanged (renderer-only features).
- Preview performance targets plausible; scrubbing within simple implementation.

Outcome: Ready for integration tests in future pass; no blocking defects.

---

### Post-Build Update (Polish)
- Added visible focus ring on selected clips.
- Improved timeline ruler with container-aware labels and clearer major/minor ticks.
- Implemented sequential preview across Track 1 (auto-advance to next clip).
- Added lightweight Performance HUD in Preview: FPS and last scrub latency.

---

### Debug Updates (Audit & Fixes)

- Prevent premature blob revocation via managed URL cache:
  - Added `renderer/src/lib/urlCache.ts` and switched Preview to use cached URLs.
  - Code refs:
```1:40:/Users/matthewbarge/DevProjects/clipforge/renderer/src/lib/urlCache.ts
const cache = new Map<string, string>();
export function getObjectUrl(key: string, file: File): string { /* ... */ }
export function revokeAllObjectUrls(): void { /* ... */ }
```
```1:40:/Users/matthewbarge/DevProjects/clipforge/renderer/src/components/Preview.tsx
import { getObjectUrl } from '../lib/urlCache';
// ...
const url = getObjectUrl(clip.sourceId, media.file);
setSrcUrl(url);
```

- Replace interval-based playhead with requestAnimationFrame sync:
```120:190:/Users/matthewbarge/DevProjects/clipforge/renderer/src/components/Preview.tsx
React.useEffect(() => {
  if (!isPlaying) return;
  let rafId = 0; let lastTs = performance.now();
  const step = (now: number) => { /* advance using dt; auto-advance next clip */ };
  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}, [isPlaying, playheadMs, currentClip, setPlayhead, togglePlay, primaryTrack, setSelection]);
```

- Delete key removal of selected clip (verified):
```1:120:/Users/matthewbarge/DevProjects/clipforge/renderer/src/App.tsx
if ((e.key === 'Delete' || e.key === 'Backspace') && !meta) { e.preventDefault(); deleteSelection(); }
```

- Move/reorder rerenders correctly (verified continuous updates on mousemove):
```80:140:/Users/matthewbarge/DevProjects/clipforge/renderer/src/components/Timeline.tsx
function onMouseMove(e: MouseEvent) { /* compute delta; moveClip; triggers rerender */ }
```

- Copy/Paste generates new IDs and reuses robust blobs:
```60:120:/Users/matthewbarge/DevProjects/clipforge/renderer/src/store/timeline.ts
copySelection: () => { set({ clipboard: { ...clip } }); },
pasteAt: (ms) => { const dupe: Omit<TimelineClip, 'id'> = { ...data, startMs: snapMs(ms) }; get().addClip(dupe); }
// addClip generates a fresh id and selects it
```

- Performance HUD added for QA (FPS and scrub latency):
```1:80:/Users/matthewbarge/DevProjects/clipforge/renderer/src/components/Preview.tsx
const [fps, setFps] = React.useState<number>(0);
const [scrubLatencyMs, setScrubLatencyMs] = React.useState<number | undefined>(undefined);
```

Outcome: All audit items addressed. Playback and timeline interaction are smoother and safer; URLs managed centrally; copy/paste robust; delete/move confirmed.
