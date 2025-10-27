# Showcase System (Technical)

> See `/docs/operations/showcase_overview.md` for the operational overview and usage. This file focuses on technical details and implementation notes.

A reusable capture pipeline for high-quality demonstration videos and summaries. Ideal for Gauntlet submissions and portfolio showcases.

## Purpose
- Automate generation of project demo videos and structured summaries
- Record UI interactions and animations from defined routes
- Store outputs neatly for submission and portfolio reuse

## Files
- `tools/foundry-showcase/showcase.config.ts` — routes, resolution, fps, and options
- `tools/foundry-showcase/showcase.capture.ts` — Playwright capture (video + screenshots)
- `tools/foundry-showcase/showcase.summary.ts` — compiles `showcase_summary.json`
- `tools/foundry-showcase/showcase.cli.ts` — CLI orchestrator for end-to-end runs

## Outputs
- Latest artifacts: `/docs/showcase/latest/`
  - `showcase_log.json`
  - `showcase_summary.json`
  - `screenshots/` and `videos/`
- Previous runs are archived to `/docs/showcase/archive/{timestamp}/` on each new run.

## Configure
Edit `tools/foundry-showcase/showcase.config.ts`:
```ts
export const showcaseConfig = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  routes: [
    { route: '/' },
    // { route: '/login', durationMs: 6000 },
  ],
  resolution: { width: 1280, height: 720 },
  fps: 30,
  archive: true,
}
```

## Run
```bash
pnpm showcase:run          # build → capture → summarize
SHOWCASE_SKIP_VIDEO=1 pnpm showcase:run   # fast dry run (no video)
```

## Notes
- The CLI builds by default; pass `--no-build` in the command string in the CLI if needed.
- For longer demos, set per-route `durationMs`.
- Works alongside Evolvr/Visual verification; does not modify their pipelines.
