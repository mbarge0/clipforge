🎬 ClipForge Desktop

ClipForge is a cross-platform Electron-based desktop app for screen, webcam, and picture-in-picture recording — complete with timeline editing, metadata extraction, and export built around an integrated FFmpeg pipeline.

⸻

🚀 Features
	•	Screen Recording (macOS, Windows, Linux)
Capture your desktop using the system screen-recording APIs.
Automatically merges microphone input with display audio.
	•	Webcam & PiP Recording
Record webcam video alone or combined with a screen capture in a PiP layout.
	•	Integrated FFmpeg Export
Uses fluent-ffmpeg with static ffmpeg-static binary for local rendering.
Supports trimming, segment concatenation, and export to MP4.
	•	Media Library + Timeline Editing
Each recording automatically imports into the local media library.
Drag and drop to arrange clips on the timeline before export.
	•	Offline-First Architecture
100% local — no cloud dependencies.
All recordings, metadata, and temporary files remain on your device.

⸻

🧠 Technical Overview

Layer	Tech	Responsibilities
Main Process	Electron (main/main.js)	Window creation, IPC bridge, FFmpeg export pipeline, recording file I/O
Preload	Electron context bridge (main/preload.ts)	Secure exposure of APIs for recording, file metadata, and blob URL creation
Renderer	React + TypeScript (renderer/src/)	UI, state management, timeline, recording control
Media Engine	MediaRecorder API + FFmpeg	Record to .webm, compose PiP, transcode exports


⸻

🧩 Key IPC Channels

Channel	Description
record:openFile / record:appendChunk / record:closeFile	Chunked recording pipeline
record:composePiP	Merge webcam + screen into PiP video
media:getPathForFileName	Resolve absolute paths for user files
media:getMetadata	Returns duration, width/height, and size using ffprobe
desktop:getSources	Enumerates screen/window capture sources (Electron desktopCapturer)
export:start / export:progress / export:complete	FFmpeg export orchestration


⸻

🧱 Build & Packaging Instructions

📦 Prerequisites

Before building, ensure you have:
	•	Node.js 18+
	•	npm 9+ or pnpm 8+
	•	macOS or Windows (Linux also works)
	•	FFmpeg binaries (auto-installed via ffmpeg-static)

Clone and install:
git clone https://github.com/<your-username>/clipforge.git
cd clipforge
npm install

git clone https://github.com/<your-username>/clipforge.git
cd clipforge
npm install

This starts:
	•	Electron main process
	•	Vite dev server for the React renderer
	•	Hot reload for both main and renderer code

Open the DevTools console to monitor [record] and [preview] logs during recording.

⸻

🏗️ Production Build (Distributable)

Package the app into a native binary:
npm run build
npm run dist

This will:
	•	Build the renderer bundle (Vite)
	•	Package Electron using electron-builder
	•	Generate a distributable under dist/ClipForge-<platform>-x64/

Typical output paths:
	•	macOS: dist/mac/ClipForge.app
	•	Windows: dist/win-unpacked/ClipForge.exe

You can compress and upload these for submission.
or double-click the generated ClipForge.app / ClipForge.exe.

macOS Permissions
If recording fails on first launch:
	1.	Go to System Settings → Privacy & Security → Screen Recording
	2.	Enable permissions for ClipForge (or Electron in dev mode).
	3.	Relaunch the app.

⸻

🧪 Local Test (Packaged App)

To verify that packaging succeeded:
npm run start:prod


--

⚙️ Setup

# 1. Install dependencies
npm install

# 2. Start the dev environment (Vite + Electron)
npm run dev

# 3. Build production package
npm run build

Note: On macOS, you must manually grant screen recording and microphone access to the Electron runtime or your compiled app:

System Settings → Privacy & Security → Screen & System Audio Recording
Then enable permissions for Electron (development) or ClipForge (production).

⸻

🧪 Recording Test Workflow (TDD Mode)
	1.	Run build phase and ensure IPC passes health check (pong:hello).
	2.	Execute the test case: startScreenRecording() → stop after 5s → verify recorded file in media library.
	3.	Check for console logs:
	•	[record] getDisplayMedia resolved
	•	[record] startScreenRecording: recorder active
	•	[record] onstop: session closed and media added
	4.	Confirm video preview playback and valid metadata (duration, width, height).

⸻

🧰 Troubleshooting

Symptom	Likely Cause	Fix
“Failed to start screen recording”	macOS permission not granted or getDisplayMedia unsupported	Allow Screen Recording for the current Electron binary or switch to desktopCapturer
Black preview / ERR_REQUEST_RANGE_NOT_SATISFIABLE	Duration not loaded before playback	Wait for loadedmetadata or refresh the library
App won’t launch after patch	Syntax error in preload (ESM import order)	Revert last patch, run npm run dev again
0 B recordings	MediaRecorder not starting properly	Check if mimeType is supported and timeslice > 0


⸻

🧩 Folder Structure

clipforge/
├── main/
│   ├── main.js           # Electron main process
│   ├── preload.ts        # Secure context bridge
│   └── ...               # IPC and FFmpeg handlers
├── renderer/
│   ├── src/
│   │   ├── App.tsx       # Core UI
│   │   ├── components/   # Timeline, Preview, etc.
│   │   └── ...           
│   └── index.html
└── package.json


⸻

🧱 Stack
	•	Electron 32+
	•	React 18 + Vite
	•	TypeScript
	•	FFmpeg (via fluent-ffmpeg + ffmpeg-static)
	•	TailwindCSS / shadcn/ui

⸻

🧑‍💻 Development Notes
	•	Uses contextIsolation: true and a minimal preload bridge for security.
	•	Avoids direct file:// access in the renderer — uses blob URLs created in preload.
	•	Temporary recordings are written under your system temp directory (os.tmpdir()).

⸻

🪄 License

MIT © 2025 — ClipForge Project