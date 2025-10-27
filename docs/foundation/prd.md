# ClipForge - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** October 27, 2025  
**Project Duration:** 56 hours (MVP: 32 hours, Final: 56 hours)  
**Target Platform:** Desktop (Electron-based native application)

---

## 1. Objective

### Product Purpose and Mission
ClipForge is a native desktop video editor that enables content creators, educators, and professionals to record, edit, and export professional-quality videos without leaving a single application. The product eliminates the fragmentation of using separate tools for screen recording, webcam capture, and video editing by providing an integrated workflow optimized for speed and simplicity.

### Problem Being Solved
Current video editing workflows require users to:
- Use separate applications for recording (OBS, Loom) and editing (Premiere, Final Cut)
- Manage file transfers between applications
- Learn complex professional tools for simple editing tasks
- Wait for cloud-based editors to upload/process large files

ClipForge solves this by providing a single desktop application where users can record their screen, arrange clips on a timeline, and export finished videos—all with sub-5-second app launch time and local processing that maintains full quality control.

### Success Definition in Measurable Terms
**MVP Success Criteria (Tuesday, October 28 at 10:59 PM CT):**
- Desktop application launches in under 5 seconds
- Successfully imports MP4/MOV/WebM files under 500MB
- Displays imported clips in visual timeline with playback preview
- Trims clips with adjustable start/end points
- Exports single or multi-clip sequences to MP4
- Packaged as distributable native application (not dev mode)

**Final Submission Success Criteria (Wednesday, October 29 at 10:59 PM CT):**
- Screen recording with window/screen selection working
- Webcam recording with audio capture functional
- Simultaneous screen + webcam (picture-in-picture) operational
- Multi-track timeline (2+ tracks) with drag-and-drop clip arrangement
- Clip splitting and deletion working smoothly
- Export with resolution options (720p/1080p/source, max 1080p output)
- Timeline supports 10+ clips without performance degradation (30+ fps UI)
- Keyboard shortcuts operational (Space, Delete, Cmd+Z, Cmd+B, Cmd+C/V)
- App remains stable during 15+ minute editing sessions (no memory leaks)

---

## 2. Core Features

### Recording Capabilities (P0 - MVP)
**Screen Recording:**
- Window/screen selection UI using native system picker
- Full screen or individual window capture
- Audio capture from microphone
- Recording saved directly to timeline without intermediate save dialog
- Maximum recording duration: 30 minutes (aligned with timeline limit)

**Webcam Recording:**
- System camera access with device selection
- Audio capture from microphone simultaneously
- Recording saved directly to timeline

**Picture-in-Picture (Screen + Webcam):**
- Simultaneous recording of screen and webcam
- Webcam overlay at 20% screen width, fixed bottom-right position
- Composite recording saved as single file to timeline

**Rationale:** Recording capabilities differentiate ClipForge from traditional editors by eliminating the need for separate recording software. Direct-to-timeline saving reduces friction in the creation workflow.

---

### Media Management (P0 - MVP)

**Media Library:**
- Persistent sidebar in top-left area of application
- Displays all imported video clips with thumbnail previews
- Shows basic metadata: filename, duration, resolution, file size
- Drag-and-drop zone for importing new files (MP4/MOV/WebM)
- Visual indication of which clips are currently on timeline

**Import Functionality:**
- Drag-and-drop files into media library area
- File picker dialog as alternative import method
- Supported formats: MP4, MOV, WebM
- File size limit: 500MB per file
- Automatic rejection with error message for unsupported formats or oversized files
- Thumbnail generation on import (first frame or mid-point)

**Rationale:** Media library provides organized workspace for managing source materials. 500MB limit prevents memory issues while accommodating most screen recordings and typical video files.

---

### Timeline Editor (P0 - MVP)

**Multi-Track Timeline:**
- Visual timeline with 2 independently controllable tracks
- Track 1 (default: "Main Video"), Track 2 (default: "Overlay/PiP")
- Tracks are renamable by user
- No source restrictions—any clip type can go on any track
- Playhead indicator showing current time position
- Time ruler showing minutes:seconds markers
- Zoom controls for timeline view (zoom in/out for precision)
- Total timeline limit: 30 minutes of combined clip duration

**Clip Manipulation:**
- Drag clips from media library to timeline
- Drag clips between tracks
- Reorder clips by dragging left/right on timeline
- Select clips by clicking (visual selection highlight)
- Delete selected clips (Delete key or right-click menu)
- Split clips at playhead position (Cmd+B / Ctrl+B)
- Trim clips by dragging clip edges to adjust start/end points
- Copy and paste clips (Cmd+C / Cmd+V, Ctrl+C / Ctrl+V)
- Snap-to-grid assistance for precise alignment

**Visual Feedback:**
- Clip thumbnails showing first frame
- Duration labels on each clip
- Color-coded tracks for visual distinction
- Selected clip highlighted with border
- Audio track indicator (shows if clip contains audio)

**Rationale:** Multi-track timeline enables picture-in-picture workflows where webcam overlays screen recordings. Drag-and-drop manipulation provides intuitive editing without complex menus. Splitting enables users to remove unwanted sections or create chapter breaks.

---

### Preview & Playback (P0 - MVP)

**Real-Time Preview Window:**
- HTML5 video player displaying current timeline composition
- Shows frame at current playhead position
- Updates immediately when user scrubs timeline
- Play/pause controlled via timeline and keyboard (Space bar)
- Audio playback synchronized with video
- Preview resolution matches source (up to 1080p display)

**Playback Controls:**
- Play/pause via Space bar keyboard shortcut
- Scrubbing by clicking anywhere on timeline
- Playhead dragging for fine-tuned positioning
- Multi-clip sequential playback (automatically transitions between clips)
- Preview shows arrangement as it will appear in final export

**Performance Target:**
- Playback maintains 30 fps minimum
- Scrubbing responds within 100ms
- No audio desync during playback

**Rationale:** Real-time preview is essential for editorial decisions. HTML5 video provides native seeking and playback without requiring custom rendering pipelines. Immediate scrubbing feedback enables quick review of edits.

---

### Export & Rendering (P0 - MVP)

**Export Configuration:**
- Resolution dropdown: 720p, 1080p, Source Resolution
- Maximum output resolution: 1080p (4K sources downscaled)
- Format: MP4 (H.264 video codec, AAC audio codec)
- File destination chooser (save location)
- Estimated file size display before export starts

**Export Process:**
- Progress indicator showing percentage complete
- Estimated time remaining
- Cancel button to abort export
- FFmpeg-based rendering for multi-clip concatenation
- Maintains audio sync across clip boundaries
- Applies trim and split edits with frame accuracy

**Quality & Performance:**
- Export completes without crashes
- Output maintains source quality (no excessive compression)
- Progress updates at least once per second
- Export speed: approximately 1x to 3x real-time (depends on hardware)

**Rationale:** Export is the final delivery mechanism. Resolution options accommodate different distribution platforms (Instagram vs YouTube). Progress indication prevents user anxiety during long renders. Frame-accurate trim ensures professional results.

---

### Keyboard Shortcuts (P0 - MVP)

- **Space:** Play/pause timeline
- **Delete / Backspace:** Remove selected clip from timeline
- **Cmd+Z / Ctrl+Z:** Undo last action (supports: delete, move/reorder, split)
- **Cmd+B / Ctrl+B:** Split clip at playhead position
- **Cmd+C / Ctrl+C:** Copy selected clip
- **Cmd+V / Ctrl+V:** Paste copied clip to timeline

**Rationale:** Keyboard shortcuts accelerate workflows for experienced users. These six shortcuts cover 80% of common editing operations without requiring extensive keyboard mapping.

---

## 3. User Stories

### Recording Workflows

**P0:** As a content creator, I want to record my screen with a specific window selected, so that I can create tutorial videos without showing my entire desktop.

**P0:** As an educator, I want to record my webcam while recording my screen, so that I can add a personal presence to my lecture videos.

**P0:** As a professional, I want my screen recordings to automatically appear in my timeline, so that I can immediately start editing without managing files.

### Editing Workflows

**P0:** As a video editor, I want to drag video clips from my media library onto a timeline, so that I can arrange them in the order I want.

**P0:** As a content creator, I want to trim the beginning and end of my clips, so that I can remove dead air and mistakes.

**P0:** As a tutorial maker, I want to split a long recording into segments, so that I can rearrange or remove sections.

**P0:** As a video editor, I want to preview my timeline by pressing play, so that I can see how my edits look before exporting.

**P0:** As a content creator, I want to scrub through my timeline by clicking, so that I can quickly find specific moments.

**P0:** As an editor, I want to use keyboard shortcuts for common actions, so that I can edit faster without constantly using my mouse.

**P0:** As a user, I want to undo mistakes, so that I can experiment with edits without fear of breaking my project.

### Export Workflows

**P0:** As a content creator, I want to export my edited video to MP4, so that I can upload it to YouTube or social media.

**P0:** As a professional, I want to choose my export resolution, so that I can optimize for file size or quality based on my needs.

**P0:** As a user, I want to see export progress, so that I know how long I need to wait.

**P1:** As a content creator, I want to see estimated file size before exporting, so that I can ensure I have enough disk space.

### Multi-Track Workflows

**P0:** As a content creator, I want to place my webcam video on a separate track from my screen recording, so that it appears as a picture-in-picture overlay.

**P0:** As an editor, I want to rename my timeline tracks, so that I can organize my project meaningfully.

**P1:** As an editor, I want to move clips between tracks, so that I can reorganize my layering.

### Quality of Life

**P1:** As a user, I want the app to prevent me from importing files that are too large, so that I don't experience crashes or performance issues.

**P1:** As a user, I want to see thumbnails of my clips, so that I can visually identify content without playing each clip.

**P2:** As a power user, I want to copy and paste clips, so that I can duplicate segments quickly.

---

## 4. Success Criteria

### Quantitative Benchmarks

**Performance:**
- App launch time: < 5 seconds from click to usable UI
- Timeline responsiveness: 30+ fps with 10+ clips on timeline
- Scrubbing latency: < 100ms from timeline click to preview update
- Memory usage: < 1GB RAM with 10 clips loaded
- No memory leaks during 15-minute editing session (stable memory usage)
- Export progress updates: minimum 1 update per second

**Functionality:**
- Successfully imports 100% of valid MP4/MOV/WebM files under 500MB
- Export success rate: 100% for projects under 30-minute timeline limit
- Keyboard shortcuts response time: < 50ms
- Undo functionality: successfully reverts last 10 actions minimum

**Stability:**
- Zero crashes during standard workflows (import → edit → export)
- Graceful error handling for: invalid files, disk full, insufficient permissions
- Packaged app runs identically to dev mode (no ASAR-related failures)

### Qualitative Benchmarks

**Usability:**
- First-time users can complete basic workflow (import → trim → export) within 5 minutes without documentation
- Keyboard shortcuts discoverable through tooltips or help menu
- Error messages provide actionable guidance (e.g., "File too large. Maximum size is 500MB.")

**User Flow Clarity:**
- Clear visual distinction between media library, timeline, and preview areas
- Drag-and-drop workflows feel intuitive (visual feedback during drag)
- Timeline playhead position always visible and synchronized with preview

**Output Quality:**
- Exported videos maintain source quality (no visible artifacts)
- Audio remains synchronized throughout multi-clip exports
- Trim operations are frame-accurate (no unintended frames included)

### Deployment Metrics

**Distribution:**
- Packaged app size: < 200MB per platform
- App installs and launches on fresh machine without additional dependencies
- FFmpeg binaries correctly bundled and executable

**Documentation:**
- README includes setup instructions (< 5 steps)
- README includes build instructions (single command for dev, single command for production build)
- Architecture overview explains main process vs renderer process structure

---

## 5. Supermodule Map

The ClipForge application is organized into **5 core supermodules** that represent vertical slices of functionality. Each supermodule encapsulates related features, UI components, state management, and IPC handlers.

| Supermodule | Description | Key Features | Dependencies |
|------------|-------------|--------------|--------------|
| **1. Foundation & Setup** | Core Electron app structure, window management, and file system access | App initialization, main window creation, IPC setup, file handling utilities, error boundaries | None (base layer) |
| **2. Media Library & Import** | Media file management, thumbnail generation, and import workflows | Drag-and-drop import, file picker, media library UI, thumbnail generation, file validation (format/size), metadata extraction | Foundation |
| **3. Timeline Core** | Multi-track timeline UI, clip manipulation, and state management | 2-track timeline rendering, drag-and-drop clip arrangement, clip selection, trim handles, split functionality, zoom controls, playhead rendering | Foundation, Media Library |
| **4. Preview & Playback** | Video preview window and synchronized playback | HTML5 video player, scrubbing, play/pause controls, multi-clip sequential playback, audio sync, timeline-to-preview synchronization | Timeline Core |
| **5. Recording Engine** | Screen capture, webcam recording, and picture-in-picture composite | Screen/window selection UI, desktopCapturer integration, webcam access, MediaRecorder management, PiP composition, recording-to-timeline pipeline | Foundation, Media Library, Timeline Core |
| **6. Export Pipeline** | Video rendering and export with progress tracking | FFmpeg integration, concat demuxer for multi-clip export, resolution options UI, progress indicator, estimated file size calculation, export queue management | Foundation, Timeline Core |

### Supermodule Dependency Flow
```
Foundation & Setup (Base Layer)
    ↓
Media Library & Import
    ↓
Timeline Core ←→ Preview & Playback
    ↓
Recording Engine → (feeds into) Media Library & Timeline
    ↓
Export Pipeline (reads from Timeline Core)
```

### Development Priority Order
1. **Foundation & Setup** (Hours 0-4): Establish Electron structure, IPC patterns, file access
2. **Media Library & Import** (Hours 4-8): Enable file import and validation
3. **Timeline Core** (Hours 8-16): Build timeline UI and clip manipulation
4. **Preview & Playback** (Hours 16-22): Integrate video preview with timeline
5. **Export Pipeline** (Hours 22-30): Implement FFmpeg rendering (**MVP GATE: Hour 30**)
6. **Recording Engine** (Hours 30-48): Add screen/webcam recording
7. **Polish & Testing** (Hours 48-56): Bug fixes, performance optimization, packaging

### Supermodule Testing Strategy
Each supermodule includes unit tests for core logic, integration tests for IPC communication, and manual QA checklists for user-facing features. Testing occurs within each supermodule development phase before proceeding to dependent modules.

---

## 6. Testing & Quality Infrastructure

### Unit Testing Coverage (Minimum Viable)
- **Foundation:** File path utilities, ASAR unpacking logic, IPC message serialization
- **Media Library:** File validation (format/size checks), metadata extraction
- **Timeline Core:** Clip positioning calculations, trim/split logic, undo stack management
- **Export Pipeline:** FFmpeg command generation, resolution calculation, concat file generation

**Target:** 60%+ code coverage for business logic (not UI components)

**Tools:** Jest for Node.js code, React Testing Library for UI components

### Integration Testing
- **IPC Communication:** Main process ↔ renderer process for file operations
- **FFmpeg Integration:** Verify FFmpeg binaries execute correctly, progress parsing works
- **Multi-Clip Export:** Test concat demuxer with 2, 5, and 10 clips
- **Recording Pipeline:** MediaRecorder → File write → Timeline import flow

**Tools:** Playwright or Spectron for end-to-end Electron testing

### Manual QA Flows

**Import & Preview (15 minutes):**
1. Launch app
2. Drag MP4 file into media library
3. Verify thumbnail appears
4. Drag clip to timeline
5. Click timeline to scrub, verify preview updates
6. Press Space to play, verify smooth playback with audio

**Editing Workflow (20 minutes):**
1. Import 3 different video clips
2. Arrange clips on timeline in specific order
3. Trim clip 1 by dragging edges
4. Split clip 2 at middle using Cmd+B
5. Delete unwanted section using Delete key
6. Undo last deletion with Cmd+Z
7. Copy clip 3, paste to Track 2
8. Verify preview shows all edits correctly

**Recording Workflow (15 minutes):**
1. Click "Record Screen" button
2. Select specific window from picker
3. Record 30-second test clip
4. Stop recording, verify clip appears in timeline
5. Click "Record Webcam" button
6. Record 10-second webcam clip
7. Click "Record Screen + Webcam" button
8. Record 20-second PiP clip, verify overlay position

**Export Workflow (20 minutes):**
1. Create timeline with 3 clips totaling 2 minutes
2. Click Export button
3. Select 1080p resolution
4. Verify estimated file size displays
5. Choose save location
6. Monitor progress indicator during export
7. Verify export completes without errors
8. Open exported file in external player, verify quality and audio sync

**Stress Testing (30 minutes):**
1. Import 10 clips (total ~200MB)
2. Arrange all on timeline
3. Perform 20+ edits (trim, split, move, delete, undo)
4. Play timeline multiple times
5. Monitor memory usage (should remain < 1GB)
6. Export full timeline
7. Verify no crashes or performance degradation

### Deployment Validation Process

**Packaging Verification:**
1. Run `npm run build` (or equivalent) to create distributable
2. Install/extract on fresh machine (not development environment)
3. Launch app, verify no "module not found" or binary errors
4. Test full workflow (import → edit → export) in packaged app
5. Check app bundle size (should be < 200MB)

**Cross-Platform Validation (if time permits):**
- Test on macOS and Windows
- Verify keyboard shortcuts work with platform conventions (Cmd vs Ctrl)
- Check FFmpeg binary paths resolve correctly on both platforms

### Performance Benchmarking

**Timeline Performance:**
- Add 10 clips to timeline, measure FPS (target: 30+ fps)
- Zoom in/out rapidly, verify no lag
- Scrub playhead across entire 30-minute timeline, measure response time

**Memory Leak Detection:**
- Run app for 15 minutes of active editing
- Take memory snapshots every 3 minutes
- Verify memory usage stabilizes (not continuously growing)

**Export Speed:**
- Benchmark: 5-minute timeline export time
- Target: Completes in 5-15 minutes (1x-3x real-time)

---

## 7. Technical Constraints

### Framework & Platform Requirements
- **Desktop Framework:** Electron (latest stable version, currently v27+)
- **Frontend:** React 18+ with hooks
- **State Management:** Zustand (lightweight, minimal boilerplate)
- **Build Tool:** Vite or Create React App (CRA) for fast development iteration
- **Package Manager:** npm or yarn
- **Packaging:** electron-builder (for app distribution)

### Media Processing Requirements
- **FFmpeg Integration:** fluent-ffmpeg (Node.js wrapper) + ffmpeg-static (bundled binaries)
- **Supported Codecs:** H.264 (video), AAC (audio) for output
- **Input Formats:** MP4, MOV, WebM (H.264/VP8/VP9 video, AAC/Opus audio)
- **Recording API:** Electron desktopCapturer + MediaRecorder API
- **Video Player:** HTML5 `<video>` element (native browser support)

### Security & IPC Architecture
- **Context Isolation:** Enabled (Electron security best practice)
- **Node Integration in Renderer:** Disabled
- **IPC Pattern:** `ipcMain.handle()` / `ipcRenderer.invoke()` for request-response
- **File Access:** All file system operations occur in main process only
- **No Direct File Content Over IPC:** Pass file paths as strings, not file contents

### File System & Storage
- **Local Storage Only:** No cloud sync or external databases for MVP
- **Project Format:** JSON-based project file storing timeline state (stretch goal)
- **Temporary Files:** Use OS temp directory for recording/export intermediate files
- **Binary Location:** FFmpeg/FFprobe binaries must be unpacked from ASAR using `asarUnpack` config

### Performance Limitations
- **Maximum Import File Size:** 500MB per file
- **Maximum Timeline Duration:** 30 minutes total
- **Maximum Concurrent Clips:** 20 clips on timeline (tested performance limit)
- **Preview Resolution:** 1080p maximum display (higher resolutions downscaled for preview)
- **Export Resolution:** 1080p maximum output (4K sources automatically downscaled)

### Platform-Specific Constraints
- **macOS:** System audio capture requires third-party virtual audio device (e.g., BlackHole)
- **Windows:** Native system audio loopback supported via desktopCapturer
- **Linux:** Not prioritized for MVP (defer to post-launch)

### Browser/Chromium Constraints
- **MediaRecorder Memory Leaks:** Known Chromium issue causing memory accumulation during long recordings
- **Mitigation Required:** Use timeslice parameter, stream to disk, explicit cleanup
- **Codec Support:** VP9 preferred for recording (better compression), VP8 fallback

---

## 8. Stretch Goals

These features add value but are not required for MVP or final submission. Implement only if core features are stable and time permits.

### Enhanced UI/UX (P1)
- **Audio Waveform Display:** Visual representation of audio amplitude on timeline clips
- **Clip Thumbnails on Timeline:** Show video frames along timeline scrubber (not just at start)
- **Timeline Minimap:** Overview of entire timeline for quick navigation
- **Drag Handles for Playhead:** Large clickable playhead for easier scrubbing

### Advanced Editing (P1)
- **Audio Volume Controls:** Per-clip volume adjustment sliders
- **Fade In/Out:** Audio fade transitions at clip boundaries
- **Text Overlays:** Add customizable text captions to video
- **Transitions:** Fade, dissolve, or slide transitions between clips
- **Filters/Effects:** Brightness, contrast, saturation adjustments

### Recording Enhancements (P2)
- **Recording Countdown Timer:** 3-2-1 countdown before recording starts
- **Recording Hotkey:** Global keyboard shortcut to start/stop recording
- **Recording Pause/Resume:** Pause recording without stopping, resume seamlessly
- **Audio Source Selection:** Choose specific microphone from multiple inputs

### Export & Sharing (P2)
- **Export Presets:** One-click export for YouTube (1080p), Instagram (1080x1920), TikTok
- **Export Queue:** Queue multiple export jobs
- **Cloud Upload:** Direct upload to Google Drive, Dropbox after export
- **Shareable Links:** Generate hosted link for video playback

### Project Management (P2)
- **Save/Load Projects:** Persist timeline state as `.clipforge` project file
- **Auto-Save:** Automatic project saving every 2 minutes
- **Recent Projects:** Quick access to last 5 projects on startup
- **Project Templates:** Pre-built timeline layouts for common use cases

### Performance & Quality (P2)
- **GPU Acceleration:** Hardware-accelerated encoding via FFmpeg NVENC/VideoToolbox
- **Proxy Mode:** Generate low-res proxies for editing, export uses original quality
- **Background Export:** Export in background while continuing to edit

### Keyboard Shortcuts Expansion (P2)
- **Arrow Keys:** Frame-by-frame navigation (left/right arrows)
- **J/K/L:** Rewind/pause/fast-forward (video editing standard)
- **Shift+Delete:** Ripple delete (removes clip and closes gap)
- **Cmd+Shift+Z:** Redo

### AI Features (P2 - Explicitly Deferred)
- **Auto-Transcription:** Generate subtitles via Whisper API
- **Script Generation:** AI-generated video script from transcript
- **Silence Detection:** Automatically detect and remove silent portions
- **Scene Detection:** Auto-split clips at scene changes

---

## 9. Out of Scope

These features will **not** be implemented in this version. They are explicitly excluded to maintain focus on core video editing functionality.

### Advanced Professional Features
- **Color Grading:** LUTs, color wheels, professional color correction
- **Multi-Camera Editing:** Sync and switch between multiple camera angles
- **Motion Graphics:** Animated titles, lower thirds, complex motion paths
- **Chroma Key (Green Screen):** Background replacement functionality
- **3D Effects:** Depth, parallax, or 3D transformations

### Collaboration & Cloud
- **Real-Time Collaboration:** Multiple users editing same project simultaneously
- **Cloud Project Storage:** Projects stored on remote servers
- **Version History:** Track changes, revert to previous versions
- **Comments/Annotations:** Team members leaving feedback on timeline

### Advanced Media Formats
- **RAW Video Support:** ProRes RAW, BRAW, or other professional RAW codecs
- **HDR Support:** HDR10, Dolby Vision, or other high dynamic range formats
- **360° Video:** VR/360 video editing capabilities
- **Multi-Channel Audio:** 5.1 surround sound or higher-channel audio mixing

### Platform Extensions
- **Mobile Apps:** iOS/Android versions of ClipForge
- **Browser Extension:** Capture recordings via browser extension
- **Plugin System:** Third-party plugins or extension API

### Enterprise Features
- **User Authentication:** Login/account system
- **Team Management:** User roles, permissions, project sharing
- **Usage Analytics:** Track editing time, export counts, feature usage
- **License Management:** Subscription or license key validation

### Timeline Complexity
- **Unlimited Tracks:** More than 2 tracks (fixed at 2 for MVP)
- **Nested Sequences:** Timelines within timelines
- **Track Effects:** Apply effects to entire track rather than individual clips
- **Markers/Chapters:** Timeline markers for navigation

---

## 10. Evaluation & Testing Alignment

This section maps ClipForge requirements to Gauntlet AI evaluation criteria to ensure the project meets assessment standards.

### Performance (App runs smoothly under 10+ concurrent users; message latency < 200ms)

**Alignment:**
- ClipForge is single-user desktop app, not multi-user web app
- **Equivalent Metric:** Timeline responsiveness with 10+ clips (30+ fps target)
- **Message Latency Equivalent:** IPC communication latency < 200ms
- **Validation:** Stress test with 10 clips, measure scrubbing response time

**Testing Scenarios:**
- Load 10 clips (mixed resolutions, total ~300MB)
- Perform rapid timeline scrubbing (10 scrubs in 5 seconds)
- Measure: Preview update latency should be < 200ms per scrub
- Measure: Timeline UI should maintain 30+ fps during interactions

**Pass Criteria:**
- ✅ Timeline remains responsive (no freezing) with 10+ clips
- ✅ Scrubbing latency averages < 200ms
- ✅ Playback maintains 30 fps video preview

---

### Features (Functional parity with target clone + AI enhancement)

**Alignment:**
- **Target Clone:** CapCut desktop functionality (screen recording, timeline editing, export)
- **Core Feature Parity:** Import, timeline, preview, export ✅
- **Recording Features:** Screen + webcam recording ✅
- **AI Enhancement:** Explicitly deferred to stretch goals (not required for pass)

**Required Features for Pass:**
1. ✅ Video import (MP4/MOV/WebM)
2. ✅ Multi-track timeline with drag-and-drop
3. ✅ Trim and split clips
4. ✅ Real-time preview with audio
5. ✅ Export to MP4 with resolution options
6. ✅ Screen recording with window selection
7. ✅ Webcam recording
8. ✅ Picture-in-picture (screen + webcam)

**Testing Scenarios:**
- Complete all 5 manual QA flows in Section 6
- Verify each core feature functional end-to-end
- Test recording → editing → export pipeline

**Pass Criteria:**
- ✅ All 8 required features demonstrably functional
- ✅ No blocking bugs in core workflows
- ✅ At least 1 working recording mode (screen, webcam, or PiP)

---

### User Flow (Clear navigation; no dead ends; all features demonstrably accessible)

**Alignment:**
- **Clear Navigation:** Media library → Timeline → Preview → Export workflow
- **No Dead Ends:** All UI actions have clear outcomes (feedback messages, state changes)
- **Accessible Features:** All features reachable within 2 clicks from main window

**User Flow Map:**
```
App Launch
    → Media Library (top-left) - Import files here
        → Timeline (bottom) - Drag clips here
            → Preview (top-right) - See edits here
                → Export Button - Generate final video
    → Recording Controls (toolbar) - Create new content
        → Automatically adds to Timeline
```

**Testing Scenarios:**
- **First-Time User Test:** Can a new user complete import → edit → export within 5 minutes?
- **Feature Discovery:** Are all features visible or discoverable via obvious UI elements?
- **Error Recovery:** If user encounters error, do they know how to fix it?

**Pass Criteria:**
- ✅ All features accessible without consulting documentation
- ✅ No UI states where user is "stuck" with no clear action
- ✅ Error messages provide actionable guidance
- ✅ Workflow progresses logically from recording/import → editing → export

---

### Documentation & Deployment (Code clarity, readiness, reproducibility)

**Alignment:**
- **README:** Setup instructions (< 5 steps), build instructions (single command)
- **Architecture Documentation:** Explains Electron structure, IPC patterns, supermodule organization
- **Live Deployment:** Packaged distributable hosted on GitHub Releases or Google Drive
- **Reproducibility:** Another developer can clone repo, run `npm install`, build and run app

**Required Documentation:**

**README.md Must Include:**
1. Project description (2-3 sentences)
2. Prerequisites (Node.js version, OS requirements)
3. Installation steps:
   ```bash
   git clone <repo>
   cd clipforge
   npm install
   npm run dev  # Start development mode
   npm run build  # Create distributable
   ```
4. Feature list (bullet points)
5. Known limitations (500MB file limit, 30-minute timeline, macOS audio caveat)
6. Download link for packaged app

**Architecture Overview (architecture.md or section in README):**
- Electron main process vs renderer process explanation
- Supermodule structure diagram
- IPC communication patterns
- FFmpeg integration approach
- State management (Zustand store structure)

**Deployment Checklist:**
- ✅ Package app using electron-builder
- ✅ Test packaged app on fresh machine (not dev environment)
- ✅ Upload distributable to GitHub Releases or cloud storage
- ✅ Provide download link in README
- ✅ Verify app launches and completes basic workflow in packaged form

**Pass Criteria:**
- ✅ README exists with all required sections
- ✅ Setup instructions work (tested by running on fresh machine)
- ✅ Packaged app available for download
- ✅ Architecture documentation explains key technical decisions
- ✅ Code includes comments for complex logic (FFmpeg commands, IPC handlers)

---

## Appendix: Technical Reference

### Recommended NPM Packages

**Core Electron:**
- `electron` (v27+)
- `electron-builder` (packaging)

**Frontend:**
- `react` + `react-dom`
- `zustand` (state management)
- `@xzdarcy/react-timeline-editor` (timeline UI component)

**Media Processing:**
- `fluent-ffmpeg` (FFmpeg wrapper)
- `ffmpeg-static` (bundled FFmpeg binaries)
- `ffprobe-static` (bundled FFprobe binaries)

**Utilities:**
- `uuid` (generating unique IDs for clips)
- `date-fns` or `dayjs` (time formatting)

### FFmpeg Command Reference

**Trim Video:**
```bash
ffmpeg -i input.mp4 -ss 00:00:05 -to 00:00:15 -c copy output.mp4
```

**Concatenate Videos (using concat demuxer):**
```bash
# Create concat_list.txt:
# file '/path/to/clip1.mp4'
# file '/path/to/clip2.mp4'

ffmpeg -f concat -safe 0 -i concat_list.txt -c copy output.mp4
```

**Downscale to 1080p:**
```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:a copy output.mp4
```

**Extract Audio for Transcription:**
```bash
ffmpeg -i video.mp4 -vn -acodec pcm_s16le -ar 16000 audio.wav
```

### electron-builder Configuration Example

```json
{
  "build": {
    "appId": "com.clipforge.app",
    "productName": "ClipForge",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "asarUnpack": [
      "node_modules/ffmpeg-static/**/*",
      "node_modules/ffprobe-static/**/*"
    ],
    "mac": {
      "target": "dmg",
      "category": "public.app-category.video"
    },
    "win": {
      "target": "nsis"
    }
  }
}
```

### IPC Handler Example Pattern

**Main Process (main.js):**
```javascript
const { ipcMain } = require('electron');
const ffmpeg = require('fluent-ffmpeg');

ipcMain.handle('export-video', async (event, { clips, outputPath, resolution }) => {
  try {
    // FFmpeg processing logic here
    return { success: true, outputPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**Renderer Process (App.jsx):**
```javascript
const { ipcRenderer } = window.electron;

const handleExport = async () => {
  const result = await ipcRenderer.invoke('export-video', {
    clips: timelineClips,
    outputPath: savePath,
    resolution: selectedResolution
  });
  
  if (result.success) {
    alert('Export complete!');
  } else {
    alert(`Export failed: ${result.error}`);
  }
};
```

---

**End of Product Requirements Document**

**Next Steps:**
1. Review and approve this PRD
2. Proceed to Architecture Loop (define technical implementation details per supermodule)
3. Begin development starting with Foundation & Setup supermodule
4. Track progress against MVP deadline (Tuesday 10:59 PM CT)