# Content System Operating Document
Gauntlet AI – Long-form → Multi-platform Content Engine

> Purpose: Standardize and delegate a repeatable, high-signal content system that shows work, builds narrative capital, and amplifies proof of progress.

---

## 1) Purpose & Outcomes
- North Star: show work, build narrative capital, amplify proof of progress.
- Primary outcome: consistent, multi-platform distribution from one long-form source.
- Secondaries: network-building in Gauntlet, credibility with employers/customers, audience growth for future launches.

### Success Targets (fill-in)
- Cadence: <e.g., 2 long-form + 5 reels/week>
- Platforms: <YouTube, IG Reels, YT Shorts, LinkedIn, X, TikTok>
- Metrics: <impressions, avg view duration, saves, comments, CTR, follower delta>
- Business KPIs: <newsletter signups, waitlist joins, demo clicks>

---

## 2) Roles & RACI
- Matt: on-camera creator, final editorial approval (A/R).
- Cursor: topic ideation, hooks, copy, QA checklists, analytics synthesis (R).
- Editor/VA (optional): reel refinement, thumbnail creation, scheduling (R).
- Tools: Descript (editing/captions), Buffer (scheduling), Notion/Airtable/GSheet (tracker).

> RACI per step (Responsible/Accountable/Consulted/Informed): <define if delegating>

---

## 3) Source of Truth & Taxonomy
- Tracker: <Notion/Airtable/GSheet> with fields:
  - ID | Title | Status (Idea/Drafting/Recorded/Edited/Scheduled/Published)
  - Pillar (Build/Insight/Decision/Demo/People/Opportunity)
  - Primary Goal (credibility/engagement/lead gen)
  - Source Video ID | Hook | CTA | Platforms | Links | Owner | Notes
- Folder structure:
  - `content/{YYYY-MM-DD}_{slug}/raw/` (3 angles)
  - `content/{YYYY-MM-DD}_{slug}/edit/` (long-form, reels, captions, thumbnails)
  - `content/{YYYY-MM-DD}_{slug}/pub/` (final uploads + copy)
- File naming:
  - `{slug}_{angle-A|B|C}.mp4`, `{slug}_long.mp4`, `{slug}_reel_{01..05}.mp4`, `{slug}_thumb.png`, `{slug}.srt`

---

## 4) Content Pillars, Topics & Hooks
### Pillars
- Build logs (proof), Learnings (insight), Decisions (trade-offs), Demos (outcomes), People (collabs), Opportunities (asks).

### Topic Prompts (use daily)
- What shipped in `gauntlet-week-{n}`?
- One blocker and the 10-min lesson that solved it.
- A trade-off I made today and why.
- 60s demo of X feature; what problem it solves.
- One unexpected insight from building with <tech/tool>.

### Hook Libraries (pick/iterate)
- Problem-first: “I wasted 6 hours on X. Here’s the 10-minute fix.”
- Curiosity gap: “Everyone says do Y. Here’s why I did Z.”
- Metric-led: “0→1 users in 48 hours using this build step.”
- Narrative: “I joined Gauntlet to build faster. Today I learned…”
- Credibility: “Ship every day. Here’s what shipped today.”
- Anti-Pattern: “Stop doing this in your AI app. Do this instead.”

> CTA options: subscribe for build logs, try demo, DM for collab, join waitlist.

---

## 5) Standard Operating Workflows

### A) Ideation (Daily 10–15m)
- Inputs: today’s build/insight/demo.
- Steps:
  - Cursor proposes 3 topics + hooks; pick 1; finalize CTA.
  - Update tracker row with topic, hook, CTA, pillar, goal.
- Output: 1 chosen topic with Hook + CTA.

### B) Recording (5–10m)
- Prep: 3 bullets (setup → insight → takeaway), check lighting/audio.
- Shoot 3 angles: DSLR (A), iPhone (B), laptop (C); clap sync.
- Output: 3 synced video files + optional timecodes.

### C) Editing (Descript)
- Ingest 3 angles → multitrack → auto camera switching.
- Long-form cut (5–10m). Clean stutters; subtle lower-thirds.
- Reels: auto-detect highlights → manually refine; burn captions; 3–5 clips.
- Outputs: 1 long-form, 3–5 reels (9:16), burned captions (reels), SRT (long-form, optional).

### D) Copy & Packaging (Cursor)
- YouTube: title (≤70 chars), 2–3 para description (links, chapters), tags (comma-separated), thumbnail text.
- IG Reels: 1–2 hook lines + 3 bullets + CTA + curated hashtags.
- LinkedIn: narrative + insight + CTA (≤3 hashtags).
- X: 1–2 variants (hook + lesson + CTA) or a 2–3 tweet thread.
- Outputs: platform-specific copy blocks + thumbnail text.

### E) Artwork
- Thumbnail rules: close-up face, 3–5 words, large/high-contrast text, brand colors.
- Tools: Figma/Canva templates. Optional automation: Bannerbear/Canva API later.

### F) Scheduling (Buffer or alternative)
- Long-form: YouTube (T0).
- Reels: IG/Shorts/TikTok at T0+2h, T+1d, T+3d.
- LinkedIn: T0; X: T0, T+1d.
- Add UTM params: `utm_source=<platform>&utm_campaign=gauntlet_week_{n}`.

### G) Engagement & Follow-ups
- 24h sweep: reply to comments, log leads/opps, DM warm connections.
- Track questions to answer next.

### H) Review & Retrospective (Weekly)
- Metrics: views, retention, saves, comments, shares, CTR, follower delta.
- Qualitative: top comments, objections, requested topics.
- Decide next experiments: hook style, runtime, #reels, posting windows.

---

## 6) Platform-Specific Rules

### YouTube (Long-form)
- 5–10 min; chapters (>6m); end screen CTA.
- Captions: upload SRT recommended.
- Description: repo/PRD links; “Next steps” bullets; tags (comma-separated).

### YouTube Shorts
- 9:16; 30–55s; hook in first 2s; burned captions; thumbnail optional.

### Instagram Reels
- 9:16; bold first frame; burned captions; 3–5 branded hashtags; CTA to profile link.

### LinkedIn
- 5–7 lines; hard line breaks; value-forward; tag Gauntlet/collabs; ≤3 hashtags.

### X
- 1–2 variants; hook + actionable insight + CTA; consider mini-thread (2–3 tweets).

> Hashtag library: <maintain a short brand set by pillar>.

---

## 7) Brand System
- Voice: direct, builder-first, pragmatic optimism, show receipts.
- Story DNA: proof of progress, lessons from constraints, speed + quality, trade-offs.
- Visual: brand colors, fonts, lower-third style, caption styling, thumbnail pattern.
- CTAs: subscribe (build logs), try demo, collab invite, follow daily Gauntlet recaps.

---

## 8) Automation & Delegation Plan

### Phase 1 (now)
- Manual refine reels in Descript; Cursor generates copy; Buffer schedules.

### Phase 2 (near-term)
- Zapier/Make:
  - New folder in `content/{date}_{slug}` → create tracker row.
  - Create Descript project from template.
  - Push draft posts to Buffer with copy placeholders.

### Phase 3 (later)
- Auto reel scoring via LLM + transcript chunks.
- Auto-thumbnail via template API (Bannerbear/Canva).
- Analytics ingestion → single dashboard.

### Delegation Table (fill-in)
- Editor/VA owns: reels refine, thumbnails, scheduling, first-pass engagement replies.
- SOP links per task: <link to SOP sections below>.

---

## 9) SOPs & Checklists

### Recording Checklist
- Batteries charged; mic paired; clap sync; framing/lighting; background clean.
- Laptop cam on; iPhone on tripod; filenames set to `{slug}_{angle}.mp4`.

### Descript Export Checklist
- Long-form: 1080p, 24/30fps; audio loudness normalized; light noise reduction.
- Reels: 1080x1920; burned captions; safe text margins; 30–55s; high-motion cuts.
- Export: `{slug}_long.mp4`, `{slug}_reel_{01..05}.mp4`, `{slug}.srt`.

### Copy QA Checklist
- YouTube: title ≤70 chars, keywords present; description links; tags formatted.
- IG/LinkedIn/X: strong first line; no clickbait; CTA included; hashtags curated.

### Publishing QA
- Correct aspect ratios; platform targets; scheduled times; thumbnails assigned.
- Links use UTM params; end screen/links verified.

### Engagement Checklist
- First-hour replies; 24h sweep; DM follow-ups; log leads/opportunities.

### Privacy & Legal
- No secrets/keys on screen; no customer data; licensed music/assets only.

---

## 10) Analytics & Learning Loop
- Metrics per post: impressions, views/retention, likes/comments/saves, CTR, watch time, shares, follower delta.
- Qualitative: top comments, FAQs, collab invites, inbound leads.
- Cadence: daily micro-review; weekly retro; monthly theme analysis.
- Experiments backlog: hook styles, runtime, reel count, posting windows, thumbnail text patterns.

---

## 11) Cadence & Capacity
- Minimum viable: 1 long-form + 3 reels/week.
- Ideal (Gauntlet): 2 long-form + 5 reels/week.
- Timeboxes: 15m ideation, 15m setup, 10m recording, 45m edit, 15m copy/package, 10m schedule, 10m engagement.

---

## 12) Risks & Mitigations
- Time overrun → strict timeboxes; publish imperfectly; batch record.
- Descript highlight misses → reel shortlist rubric; manual pass ≤20m.
- Consistency dips → evergreen topics list; tracker reminders; schedule buffer.
- Tool limits (Buffer free) → upgrade if scheduler is bottleneck.

---

## 13) Templates & Snippets (Copy/Paste)

### Reel Selection Rubric (score 0–2 each; keep ≥6)
- Hook clarity, concrete value, emotional charge, visual change, shareability.

### Hook Starters
- “I thought X. I was wrong. Here’s what worked.”
- “If you’re building with <tech>, do this first.”
- “I shipped X in 24 hours. Here’s how I cut the time in half.”

### Copy Frameworks
- YouTube Description:
  - Line 1 hook
  - 2–3 paragraph narrative/value
  - Links: repo/PRD/demo
  - Chapters (if any)
  - Tags (comma-separated)
- LinkedIn:
  - 1–2 line hook
  - 3 bullets (lesson, trade-off, outcome)
  - CTA + ≤3 hashtags
- Instagram:
  - Hook + 3 bullets + CTA
  - Hashtags: 3–5 curated
- X:
  - Variant A (single): Hook + lesson + CTA
  - Variant B (thread): 1) Hook, 2) detail, 3) takeaway/CTA

---

## 14) Daily Ops – One-Pager (Print/Pin)
1) Ideate (Cursor: 3 topics + hooks → pick 1)  
2) Record (3 angles; 5–10m; clap sync)  
3) Edit (Descript: long-form + 3–5 reels; captions)  
4) Copy (Cursor: platform packages)  
5) Thumbnail (template)  
6) Schedule (Buffer: staggered posts + UTM)  
7) Engage (first hour + 24h sweep)  
8) Log (metrics + notes); queue tomorrow’s topic

---

## 15) Setup & Tools (current)
- Descript (editing/captions), Buffer (scheduling; consider upgrade), Figma/Canva (thumbnails), Notion/Airtable/GSheet (tracker), Google Drive/Dropbox (storage).
- Optional: Zapier/Make, Bannerbear/Canva API, Typefully/Hypefury (X scheduling), TubeBuddy/VidIQ (YT SEO).

---

## 16) Open Questions / Next Improvements
- Auto-transcript → LLM highlight selection scoring?
- Thumbnail automation: which API + template spec?
- Which metrics actually correlate to collab invites and leads?
- When to add a VA/editor to own reels + scheduling?

---