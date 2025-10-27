# Distribution System – Gauntlet AI

> Purpose: Define a clear, repeatable publishing and distribution system across platforms. Optimize for consistency, signal, and measurable growth.

---

## 1) Publishing Cadence

### Weekly Rhythm
- Long-form (YouTube): 1–2 per week (Tue/Thu 10am local)
- Reels (IG/YouTube Shorts/TikTok): 3–5 per week (Mon–Fri 12pm local)
- LinkedIn posts: 2–3 per week (Mon/Wed/Fri 9am local)
- X posts: 3–5 per week (stagger across days; 9am/1pm)

### Staggered Release (per long-form)
- T0: YouTube long-form
- T0+2h: Reel #1 (+ LinkedIn post linking to YT)
- T+1d: Reel #2 (+ X post)
- T+3d: Reel #3
- Optional: T+5d: Reel #4–5

> Guideline: Maintain minimum viable cadence (1 long-form + 3 reels/week). Batch record if needed.

---

## 2) UTM Conventions & Analytics

### UTM Parameters
- utm_source: `youtube|instagram|tiktok|linkedin|x|newsletter`
- utm_medium: `social` (default) or `video|reel|short|post`
- utm_campaign: `gauntlet_week_{NN}` (e.g., `gauntlet_week_03`)
- utm_content: `{slug}` or `{slug}_reel_{01}`

Example:
`?utm_source=linkedin&utm_medium=social&utm_campaign=gauntlet_week_03&utm_content=builder-demo`

### Link Policy
- Central link shortener (Bitly/Rebrandly) for consistency
- One canonical destination per piece (repo, PRD, demo) with UTM applied

### Analytics Stack
- Platform analytics (YT/IG/TikTok/LinkedIn/X)
- Link analytics (Bitly/Rebrandly)
- Weekly rollup in tracker: impressions, views, retention, CTR, likes, comments, saves, shares, follower delta
- Outcome metrics: newsletter signups, waitlist joins, demo clicks

---

## 3) Scheduling & Automation

### Tools
- Scheduler: Buffer (free → upgrade if bottleneck)
- Workflow: Zapier/Make (automation)
- Storage: Google Drive/Dropbox
- Tracker: Notion/Airtable/GSheet

### Standard Workflow
1) Assets ready: `{slug}_long.mp4`, `{slug}_reel_{01..05}.mp4`, `{slug}.srt`, `{slug}_thumb.png`, copy blocks.
2) Add UTM links in copy.
3) Schedule in Buffer with platform-specific copy and thumbnails.
4) Stagger using cadence above.

### Automation Phases

- Phase 1 (Manual + Light Automation)
  - Manual: upload assets to Buffer, assign copy/thumbnails
  - Automation: Google Drive folder → create tracker row (Zapier/Make)
  - Template prompts in scheduler notes for QA

- Phase 2 (Semi-automated)
  - Trigger: New folder `content/{date}_{slug}` → auto-create Descript project; fetch transcript
  - Auto-generate draft copy via Cursor and push to Buffer as drafts
  - Pre-fill UTM links by campaign/week

- Phase 3 (Automated)
  - Auto-publish at scheduled times with platform-optimized copy
  - Auto-collect performance metrics nightly to tracker
  - Alert if any post fails to publish or misses thumbnail/captions

---

## 4) Posting QA Checklist

### Global
- Aspect ratio: 16:9 (YT long) / 9:16 (reels)
- Filenames match `{slug}` convention
- Captions: burned on reels; SRT uploaded for YouTube long-form
- Thumbnails: assigned (YouTube long-form, optional for reels)
- Links: canonical + UTM present and tested
- CTA present and appropriate to pillar/goal

### YouTube (Long-form)
- Title ≤70 chars; keywords early
- Description: 2–3 paragraphs, repo/PRD/demo links, chapters if >6m
- Tags: comma-separated
- End screen/cards configured
- SRT uploaded

### Reels (IG/Shorts/TikTok)
- 1080x1920; 30–55s; first-frame hook
- Burned captions; safe margins
- IG: 3–5 curated hashtags; CTA to profile link
- Shorts: title optimized; description light

### LinkedIn
- 5–7 lines; hard breaks; value-forward
- ≤3 hashtags; tag Gauntlet/collabs if relevant
- Link with UTM

### X
- Variant A (single) or mini-thread (2–3)
- Hook + lesson + CTA
- Link with UTM (if applicable)

---

## 5) Delegation Plan

### Phase 1 – Manual (Owner: Matt; Assist: Cursor)
- Matt: recording, final edits, scheduling
- Cursor: topic + hook proposals, platform copy, QA prompts
- Admin: maintain tracker and file structure

### Phase 2 – Semi-automated (Owner: Matt; Assist: VA/Editor + Cursor)
- VA/Editor: reel refinement, thumbnail from template, scheduler uploads, QA pass
- Cursor: copy generation and revisions, weekly analytics rollup
- Automations: Drive → tracker row; Buffer drafts with prefilled UTM; reminders

### Phase 3 – Fully Automated (Owner: Matt; Assist: Cursor + Automations)
- Automations: Descript project creation, Buffer draft creation, scheduled posting, nightly analytics sync
- Cursor: QC exceptions, analytics insights and recommendations
- Matt: weekly review and approvals

### RACI Table (fill-in)
- Recording: A=Matt, R=Matt
- Editing: A=Matt, R=Matt/Editor
- Copy: A=Matt, R=Cursor
- Thumbnails: A=Matt, R=Editor
- Scheduling: A=Matt, R=Editor
- QA: A=Matt, R=Editor/Cursor
- Analytics: A=Matt, R=Cursor

---

## 6) Failure Modes & Recovery

- Missed schedule: post ASAP; adjust future slots; note in tracker
- Bad link/UTM: fix and comment edit; update template to prevent repeats
- Low performance: test new hook format/thumbnail in next cycle
- Tool outage: switch to native platform posting; record in incident log

---

## 7) Templates

### UTM Builder
`?utm_source=<platform>&utm_medium=<social|video|reel|post>&utm_campaign=gauntlet_week_{NN}&utm_content={slug}`

### Buffer Notes Template (per post)
- Title/Copy:
- Link (with UTM):
- Thumbnail: `<path>`
- Hashtags (if IG):
- Schedule time:
- QA: aspect ratio, captions, CTA, links, end screen/cards

### Weekly Analytics Rollup (Tracker fields)
- Impressions, Views, Retention, Likes, Comments, Saves, Shares, CTR, Follower Delta
- Top comments/insights
- Experiments queued next week

---

## 8) Change Log
- v1: Initial distribution system
- v2: Add nightly analytics sync automation
- v3: Add thumbnail automation and exception alerts
