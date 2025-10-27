# Foundry Showcase Overview

A concise guide to generating high-quality demonstration captures (videos, screenshots, and summaries) for Foundry-based projects. The Showcase System complements reflection and submission by producing portable artifacts for Gauntlet submissions and portfolios.

---

## Purpose and Context
- Capture clean, consistent demo videos and screenshots that represent the current state of the project
- Produce structured summaries for quick review and submission packaging
- Complement phase reflections: use showcases to illustrate outcomes; reference summaries in handoffs/submissions

---

## System Components
- `tools/foundry-showcase/showcase.config.ts` — defines routes, resolution, fps, archive behavior
- `tools/foundry-showcase/showcase.capture.ts` — Playwright-driven capture (records videos and screenshots)
- `tools/foundry-showcase/showcase.summary.ts` — compiles a machine-readable summary from the capture log
- `tools/foundry-showcase/showcase.cli.ts` — CLI orchestrator (build → capture → summarize)

Outputs
- Latest artifacts: `/docs/showcase/latest/`
  - `showcase_log.json` — per-route results (paths, durations, ok/fail)
  - `showcase_summary.json` — consolidated summary (counts, file lists)
  - `screenshots/` and `videos/` — media assets
- Archive: `/docs/showcase/archive/{timestamp}/` — previous run contents are moved here automatically on new runs

---

## How It Works
- Command: `pnpm showcase:run`
  1) Builds the project (unless you later extend to pass `--no-build` in the CLI)
  2) Runs capture for configured routes
  3) Generates the summary JSON
- Fast dry-run flag: `SHOWCASE_SKIP_VIDEO=1 pnpm showcase:run` (skips video while keeping screenshots and summaries)
- Configure routes, resolution, and duration per route in `showcase.config.ts`

---

## When to Use It
- Typical triggers: post-Debug or post-Reflection, prior to submission
- Use during Review for Submission to ensure media and summaries match rubric expectations
- Re-run after major UI/flow changes to refresh videos and screenshots

---

## Future Integration Notes
- Optional CI hooks can auto-archive showcases for tagged releases
- Routes can be extended to include scripted interactions before capture
- Showcase outputs can be referenced in PRs, READMEs, or demo pages

---

Title/Format
- This file follows the `/docs/operations/` documentation style used throughout Foundry Core v2
