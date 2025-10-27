# Visual Verification Core

A reusable Playwright-based visual verification package.

## Features
- 🎯 Captures only defined routes
- 💬 Supports project-level hooks (e.g., open chat, modals, toolbars)
- ⚡ Fast (under 60s total)
- ✅ Writes both archived and latest evidence snapshots
- 🧩 Works across any app via `visual_hooks.ts`

---

## Setup

### 1. Add to your repo
Place this folder at:
tools/visual-verification-core/

### 2. In your main project
Install Playwright (if not already):
```bash
npm install -D playwright

3. Add to package.json
{
  "scripts": {
    "capture:visual": "tsx tools/visual-verification-core/src/capture.ts",
    "verify:visual": "tsx tools/visual-verification-core/src/verify.ts"
  }
}

4. Run
npm run capture:visual
npm run verify:visual

Output:
docs/evidence/latest/
├── your_screenshots.png
├── verification.json
└── criteria.json (optional for verification)

Reuse in Other Projects

To add visual verification to a new app:
	1.	Copy /tools/visual-verification-core/
	2.	Create a new scripts/visual_hooks.ts describing your routes and readiness selectors
	3.	Add the same npm scripts
	4.	Run npm run capture:visual
