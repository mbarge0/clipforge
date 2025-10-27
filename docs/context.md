# ClipForge — Project Context (context.md)

Version: 1.0  
Platforms: macOS (primary), Windows (secondary)

---

## 1) Project Overview
ClipForge is a local-first desktop video editor (Electron) for creators and educators to record screen/webcam, edit on a simple timeline, and export MP4 with speed and reliability. The product removes multi-tool friction (OBS + editor) by integrating recording → editing → export. AI is deferred; the AI-first goal is strong operational context and reproducibility across AI tools to accelerate delivery.

---

## 2) Architecture Summary
- Runtime: Electron 32 (main, preload, renderer) + React 18 + Vite 5 + TypeScript 5 + Zustand 4
- Media: FFmpeg via fluent-ffmpeg + ffmpeg-static; HTML5 <video> for preview
- Security: contextIsolation=true, nodeIntegration=false; IPC via preload bridge
- Storage: local filesystem only (MVP); project file deferred
- Packaging: electron-forge makers + fuses; ASAR with asarUnpack for FFmpeg
- Supermodules: Foundation & Setup; Media Library & Import; Timeline & Playback; Export Pipeline; Recording Engine

References: `/docs/foundation/architecture.md` · `/docs/foundation/tech_stack.md`

---

## 3) Active Sprint / Phase
- Phase: 01 — Supermodule 1: Foundation & Setup (start 2025-10-27)
- Objective: Secure Electron shell, preload IPC bridge, reproducible dev/build, baseline IPC
- In-Progress Tasks (from dev checklist 3.1):
  - Implement `preload.ts` minimal IPC bridge
  - Flip security flags on `BrowserWindow`
  - Wire `ENV` and `logger`; verify `npm run dev` and packaged launch
  - Confirm versions and directory structure; smoke IPC call
- Upcoming Gate: App boots <5s; renderer sandboxed; minimal IPC round-trip works

References: `/docs/operations/phases/recent/phase-01-01-plan.md` · `/docs/foundation/dev_checklist.md`

---

## 4) Known Issues / Blockers
- FFmpeg binaries in packaged app require `asarUnpack` and path validation (to verify later)
- MediaRecorder variability across platforms; standardize bitrates/containers; test short clips
- macOS system audio loopback requires third-party driver (out of MVP scope)
- Performance targets to watch: timeline ≥30 fps with 10+ clips; scrub <100ms; export progress ≥1/sec

References: `/docs/foundation/prd.md` · Architecture Risks section

---

## 5) Prompts and Workflows in Use
- System Prompts (Loops):
  - Tech Stack Loop → `/docs/foundation/tech_stack.md`
  - Architecture Loop → `/docs/foundation/architecture.md`
  - User Flow Loop → `/docs/foundation/user_flow.md`
  - Checklist Loop → `/docs/foundation/dev_checklist.md`
  - UI Guidelines Loop → `/docs/operations/ui-guidelines.md`
  - Regression Manifest Loop → `/docs/operations/regression_manifest.md`
  - Context Loop (this file) → `/docs/context.md`
- Literal Prompts: `prompts/literal/01_foundation/*`
- Operations: Phase plan at `/docs/operations/phases/recent/phase-01-01-plan.md`

---

## 6) Checkpoint Tag
- Last stable snapshot: 2025-10-27T00:00:00Z
- Scope covered: PRD, Tech Stack, Architecture, User Flows, Dev Checklist, UI Guidelines, Regression Manifest generated; Phase 01 plan established

# End of context.md — generated 2025-10-27
