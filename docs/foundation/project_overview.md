# ClipForge Project Overview

## I. Project Purpose & Summary

Build a production-grade desktop video editor in 72 hours that enables creators to record their screen, import video clips, arrange them on a timeline, and export professional-quality videos—all within a native desktop application. This project demonstrates the ability to ship a complex, performant media application under extreme time constraints while handling real-time video processing, native desktop APIs, and multi-track timeline editing.

## II. Core Goals

- **Ship a working MVP by Tuesday, October 28th at 10:59 PM CT** with import, timeline, preview, trim, and export functionality
- **Deliver final application by Wednesday, October 29th at 10:59 PM CT** with screen/webcam recording, multi-track editing, and reliable export pipeline
- **Maintain responsive UI performance** with 10+ clips on timeline (30+ fps playback)
- **Ensure IPC safety** between main/renderer processes with secure media file handling
- **Package as distributable native app** that launches in under 5 seconds and runs on macOS/Windows
- **Build functional recording pipeline** for screen capture, webcam, and simultaneous screen+webcam modes

## III. Target Audience

Content creators, educators, and professionals who need a fast, reliable desktop video editor for screen recordings, tutorials, and multi-clip video projects without the complexity of professional tools like Premiere Pro or the limitations of browser-based editors.

## IV. Loose Feature Set

**MVP Features (Due Tuesday Night)**
- Desktop app launch (Electron or Tauri)
- Video import (MP4/MOV via drag-drop or file picker)
- Timeline view with imported clips
- Video preview player
- Basic trim functionality (in/out points)
- MP4 export
- Native app packaging

**Final Submission Features (Due Wednesday Night)**
- Screen recording (full screen/window selection)
- Webcam recording with system camera access
- Simultaneous screen + webcam (picture-in-picture)
- Microphone audio capture
- Media library panel with thumbnails
- Multi-track timeline (2+ tracks)
- Clip arrangement and sequencing
- Split clips at playhead
- Zoom and snap-to-grid on timeline
- Real-time preview with audio sync
- Export with resolution options (720p/1080p)
- Progress indicator during export

**Stretch Goals (If Time Permits)**
- Text overlays
- Transitions (fade, slide)
- Audio volume controls
- Filters and effects
- Keyboard shortcuts
- Auto-save and undo/redo

## V. High-Level Phases

**Phase 1: MVP Foundation (Monday Evening → Tuesday 10:59 PM)**
- Set up Electron/Tauri project structure with IPC architecture
- Implement video import and file system access
- Build basic timeline UI component
- Create HTML5 video preview player
- Integrate FFmpeg for single-clip trim and export
- Package and test distributable build

**Phase 2: Recording & Multi-Track (Tuesday Night → Wednesday Morning)**
- Implement screen recording with desktopCapturer/native APIs
- Add webcam capture via getUserMedia
- Build simultaneous screen+webcam recording
- Extend timeline to support multiple tracks
- Add media library and thumbnail generation

**Phase 3: Polish & Export Pipeline (Wednesday Afternoon → 10:59 PM)**
- Implement clip splitting and advanced timeline operations
- Build robust multi-clip export with FFmpeg encoding
- Add zoom, snap-to-grid, and timeline scrubbing
- Performance optimization and memory leak testing
- Final packaging, demo video recording, and submission prep