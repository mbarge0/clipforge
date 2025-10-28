# Source of Truth  
_Version 1.2 — Updated for Gauntlet Mode (Oct 2025)_  

Tracks evolving components, APIs, configurations, and design decisions.  
Updated weekly or at the end of each phase to prevent confusion about “what’s current.”  
Acts as the canonical reference for all AI-assisted development.


## 1. Core Technologies
- **Framework:** Electron (Main + Preload) + React 18 + Vite  
- **Language:** TypeScript (renderer) + modern JS (main)  
- **State:** Zustand for Timeline store; local state for Media Library  
- **Styling:** Inline styles for MVP; Tailwind + tokens planned  
- **Media:** HTML5 Video + Canvas; FFmpeg (future export/record phases)  
- **Testing:** Manual QA; Jest/Vitest to be added later  

*Cursor Reference:*  
Use this section to recall project stack before generating new files or updating configuration logic.


## 2. Components
| Category | Path | Description |
|-----------|------|-------------|
| Renderer App | `renderer/src/App.tsx` | Main UI; Media Library, Preview, Timeline integration |
| Media Utils | `renderer/src/lib/media.ts` | Supported formats, validation, formatting, metadata + thumbnail helpers |
| Timeline Types | `renderer/src/lib/timeline.ts` | Entities, grid/scale utils, IDs |
| Timeline Store | `renderer/src/store/timeline.ts` | Zustand store: add/trim/split/move/delete, undo, copy/paste, playhead |
| Timeline UI | `renderer/src/components/Timeline.tsx` | Ruler, tracks, clip blocks, DnD, trim/move/select |
| Preview UI | `renderer/src/components/Preview.tsx` | Selected-clip preview; play/pause and playhead sync |
| Main Process | `main/main.js` | Electron lifecycle, window creation, IPC health check |
| Preload | `main/preload.ts` | Secure bridge exposing `window.electron.invoke` |
| Config | `config/*` | Environment and logger utilities |

*Update Rule:*  
When adding new modules (e.g., Timeline, Export), log the key entry points and responsibilities here.


## 3. Endpoints / IPC
| Channel | Direction | Purpose |
|---------|-----------|---------|
| `app:ping` | renderer → main | Health check used to verify preload/IPC bridge |

Note: No new IPC was required for Media Library MVP; all import/metadata operations are renderer-local using browser APIs. File system operations remain in main for future phases.


## 4. Configurations
| Type | File | Notes |
|------|------|-------|
| Electron Window | `main/main.js` | `contextIsolation: true`, `nodeIntegration: false` |
| Preload Bridge | `main/preload.ts` | Exposes minimal typed `invoke` surface |
| App Env | `config/environment.ts` | Environment helpers |
| Logger | `config/logger.ts` | Structured logging helper |

*Reminder:*  
Maintain preload security posture. Add IPC channels deliberately and validate inputs.


## 5. Phase History (Cumulative Log)
Each phase captures key architectural or design shifts.  

### Phase 01 – Foundation & Setup
- Secured Electron window (`contextIsolation: true`, `nodeIntegration: false`).  
- Preload bridge exposed minimal typed `invoke`; IPC health check (`app:ping`).  
- Dev stability patches for macOS GPU/sandbox in dev only.  
- Docs: Plan, Build, Reflect stored under `/docs/operations/phases/recent/`.

### Phase 02 – Media Library & Import
- Implemented Media Library import in renderer: drag-and-drop + file picker.  
- Validation: formats (MP4/MOV/WebM) and size ≤ 500MB.  
- Metadata extraction: duration, resolution; Thumbnail generation via canvas (max width 320px).  
- UI: Sidebar list with thumbnail, filename, duration, resolution, size; error toasts on invalid files.  
- No new IPC required; security posture preserved.  
- Files added/updated:
  - `renderer/src/lib/media.ts`  
  - `renderer/src/App.tsx`

*(Add new phases here as they complete.)*

### Phase 03 – Timeline & Playback (current)
- Implemented two-track timeline with drag-and-drop from Media Library.  
- Interactions: select, move (snap 100ms), trim in/out, split at playhead, delete, undo (≥10).  
- Copy/Paste added (Cmd/Ctrl+C/V) placing duplicate at playhead.  
- Preview panel plays selected clip; Space toggles play/pause; playhead sync.  
- Files added/updated:
  - `renderer/src/lib/timeline.ts`
  - `renderer/src/store/timeline.ts`
  - `renderer/src/components/Timeline.tsx`
  - `renderer/src/components/Preview.tsx`
  - `renderer/src/App.tsx`


## 6. AI Integration Notes
- Current phase does not use external AI APIs.  
- Prompt templates used to organize planning/build/debug under `prompts/system/` and `prompts/literal/`.

*Testing Guideline:*  
For MVP, validate manually per PRD checklists. Add unit tests for validators in future.


## 7. Cursor Collaboration Notes
Cursor should:  
1. Reference this document before planning new work.  
2. Keep IPC surfaces minimal and typed.  
3. Prefer renderer DOM APIs for media metadata; defer ffprobe until needed.  
4. Update this document after each phase with precise file paths and roles.

**Quick Cursor Prompts:**
- “Update `source_of_truth.md` after completing Media Library phase.”  
- “Scan `renderer/src/` for new modules and summarize here.”  


## 8. Integration References
- **Build Loop Template:** `/prompts/system/phases/04_build_loop.md`  
- **UI Review Loop Template:** `/prompts/system/phases/05_ui_review_loop.md`  
- **Debugging Loop Template:** `/prompts/system/phases/06_debugging_loop.md`  

---

**Summary:**  
`source_of_truth.md` aligns human context and AI memory for ClipForge’s Electron-based architecture.  
It ensures consistency, prevents drift, and keeps the team synchronized across phases.