# ClipForge User Flows

Version: 1.0  
Platforms: macOS (primary), Windows (secondary)  
Links: [`prd.md`](./prd.md) · [`architecture.md`](./architecture.md)

---

## 1) Overview

Defines end-to-end flows for core scenarios: app launch, media import, timeline editing, preview, recording (screen/webcam/PiP), and export. Flows align to PRD user stories and target measurable outcomes (launch <5s, timeline 30+ fps, scrubbing <100ms, export progress ≥1/sec).

---

## 2) Primary User Journeys

A. App Launch & First-Run
1. User launches app → Splash or immediate main window
2. System initializes renderer and loads default layout (Media Library, Timeline, Preview)
3. On first-run: show brief tips (import area, recording buttons) [optional]
4. Outcome: User can import or record immediately

B. Import Media (Drag-and-Drop or File Picker)
1. Entry: User drags files into Media Library zone or clicks Import
2. Decision: File type supported? (MP4/MOV/WebM)
   - No → Show error: unsupported format
3. Decision: File size ≤ 500MB?
   - No → Show error: "Maximum size is 500MB"
4. System reads metadata, generates thumbnail, registers clip in library
5. Outcome: Clip(s) visible in Media Library; ready to add to timeline

C. Timeline Editing (Add, Trim, Split, Reorder, Delete)
1. Entry: User drags clip from Media Library to Track 1/2
2. User actions:
   - Trim: drag clip edges to set start/end
   - Split: place playhead → Cmd/Ctrl+B → clip splits at playhead
   - Reorder: drag within or across tracks (snap-to-grid assists)
   - Delete: Delete/Backspace removes selection
   - Copy/Paste: Cmd/Ctrl+C/V duplicates selection (P2)
3. State: Zustand store updates timeline and selection; undo stack records actions
4. Outcome: Updated timeline reflects desired sequence and durations

D. Preview & Playback
1. Entry: User clicks timeline or presses Space
2. System sets `<video>` source to current clip and seeks to playhead
3. Play: updates playhead; ensures audio/video sync
4. Scrub: clicking or dragging timeline moves playhead; preview updates <100ms
5. Outcome: Real-time feedback for editorial review (30+ fps target)

E. Recording (Screen / Webcam / PiP)
1. Entry: User clicks Record Screen, Record Webcam, or Record PiP
2. For Screen: show OS picker (window/screen) → confirm microphone device
3. For Webcam: request camera/mic permissions → show preview [optional]
4. For PiP: start screen and webcam parallel capture
5. Recording in progress: show timer, stop button, and disk space checks
6. Stop: save files; compose PiP via FFmpeg overlay to single MP4
7. Outcome: New clip automatically appears in Media Library and Timeline

F. Export Video
1. Entry: User clicks Export button
2. Choose resolution: 720p, 1080p, Source (cap 1080p)
3. System builds export plan (respect trims and order)
4. Show estimated file size (P1) and target path picker
5. Start: show progress (≥1 update/sec); allow cancel
6. Complete: show success with path; open-in-finder option
7. Outcome: MP4 with H.264/AAC ready for sharing

---

## 3) Flow Diagrams (ASCII)

Import → Timeline → Preview → Export
```
[App Launch]
   ↓
[Import Files] --unsupported/too-large--> [Error Toast]
   ↓
[Media Library] --drag--> [Timeline]
   ↓                 ↘ split/trim/reorder ↙
               [Timeline Updated]
   ↓                            ↘
[Preview/Playback] <---- scrubbing -----> [Playhead]
   ↓
[Export Configure] → [Export Running] → [Export Complete]
```

Recording (Screen/Webcam/PiP)
```
[Record Start] → [Permissions/Picker] → [Capturing]
      ↓                               ↘ cancel
 [Stop] → [Compose PiP (if needed)] → [Add to Library & Timeline]
```

---

## 4) Edge Cases & Error States

- Import
  - Unsupported format or >500MB → toast with guidance
  - Disk full when copying/thumbnailing → cancel and prompt for space
- Recording
  - Permissions denied (camera/mic/screen) → instructions to enable in OS settings
  - Mac system audio capture unavailable → note external driver requirement (BlackHole)
  - Device not found (no camera/mic) → disable relevant mode with tooltip
- Preview
  - Codec not hardware-accelerated → warn about playback performance
- Export
  - Path invalid or write failure → retry prompt and choose new location
  - Codec mismatch prevents stream copy → fallback to re-encode with notice

---

## 5) System Interactions (IPC/API)

- Import
  - `media:validate` (format/size)
  - `media:thumbnail` (thumbnail generation)
- Timeline
  - Local store updates; optional `project:autoSave` (future)
- Preview
  - Renderer-only HTML5 `<video>`; no heavy IPC
- Recording
  - `record:start` (mode, devices)
  - `record:status` (elapsed, file paths)
  - `record:stop`
- Export
  - `export:start` (clips, resolution, outputPath)
  - `export:progress` (percent, eta)
  - `export:cancel`
  - `export:complete` (success, path | error)

---

## 6) UX Considerations

- Always-visible playhead and time ruler; snap-to-grid for precision
- Keyboard shortcuts: Space (play/pause), Delete, Cmd/Ctrl+Z (undo), Cmd/Ctrl+B (split), Cmd/Ctrl+C/V (copy/paste)
- Non-blocking feedback: toasts for errors; inline hints for constraints (500MB limit, formats)
- Accessibility: focus states on timeline items; keyboard operability for selection and delete
- Loading & progress: spinners for thumbnails, deterministic export progress

---

## 7) Risks & Unknowns

- MediaRecorder behavior variability across platforms; validate default bitrates and container
- Long recordings may increase memory → consider timeslice or chunked writes
- PiP composition time scales with duration; ensure user feedback and cancelability
- FFmpeg binary execution on packaged apps across OS versions; verify paths

---

## 8) Next Steps

- Validate flows against interactive prototype or wireframes
- Finalize IPC contracts per `architecture.md`
- Implement import → timeline → preview happy path first; follow with export, then recording

(End)
