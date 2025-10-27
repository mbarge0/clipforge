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
```

Now here's the narrative system framework:

```markdown:/Users/matthewbarge/Documents/CursorProjects/gauntletstartertemplate/docs/social/narrative_system.md
# Narrative System – Gauntlet AI

> Purpose: Define the overarching storytelling and brand narrative framework that drives all content. Build narrative capital through consistent, resonant storytelling across platforms.

---

## 1) Core Narrative Arcs

### The Builder's Journey (Primary Arc)
**Week 1–3: Foundation**
- "Learning to build at speed"
- "From idea to deployed app in 7 days"
- "The tools that changed everything"

**Week 4–6: Mastery**
- "Building with AI as a co-pilot"
- "The patterns that work"
- "When to break the rules"

**Week 7–10: Scale**
- "From prototype to platform"
- "Building for real users"
- "What I'd do differently"

### The Learning Loop (Secondary Arc)
- Problem → Solution → Insight → Application
- Each week: "This broke, here's how I fixed it, here's what I learned"
- Meta-learning: "How I'm learning to learn faster"

### The Community Arc (Tertiary)
- "The people I'm meeting"
- "Collaborations that worked"
- "Building in public together"

---

## 2) Story Voice & Principles

### Voice Characteristics
- **Direct**: No fluff, straight to value
- **Builder-first**: Technical depth with accessibility
- **Pragmatic optimism**: Realistic about constraints, optimistic about solutions
- **Transparent**: Show the messy process, not just polished results
- **Credible**: Back claims with receipts (code, demos, metrics)

### Core Principles
1. **Show, don't tell**: Demo over description
2. **Progress over perfection**: Ship imperfectly, iterate publicly
3. **Constraints create creativity**: Time pressure as a feature, not a bug
4. **Learning in public**: Share failures as much as successes
5. **Community over competition**: Lift others up, collaborate openly

### Tone Guidelines
- **Confident but not arrogant**: "Here's what worked" vs "I'm the expert"
- **Curious but not naive**: Ask questions, show genuine interest
- **Ambitious but grounded**: Big goals with realistic steps
- **Professional but human**: Technical competence with personal vulnerability

---

## 3) Recurring Themes

### Technical Themes
- **Speed vs Quality**: The eternal tension in rapid development
- **AI as Co-pilot**: How AI changes the building process
- **Architecture Decisions**: Trade-offs and their consequences
- **User-First Development**: Building for real problems, not demos

### Personal Themes
- **Learning in Public**: Vulnerability as strength
- **Building Relationships**: Networking through value creation
- **Time Management**: Productivity under pressure
- **Career Strategy**: Using Gauntlet as a launchpad

### Meta Themes
- **The Future of Work**: How AI changes engineering
- **Platform Building**: From apps to ecosystems
- **Community Building**: Creating value for others
- **Signal vs Noise**: What actually matters in tech

---

## 4) Content Resonance Mapping

### Platform-Specific Story Types

**YouTube (Long-form)**
- Deep dives into technical decisions
- Full build walkthroughs
- "What I learned this week" reflections
- Architecture explanations with demos

**Instagram Reels**
- Quick tips and tricks
- "Before/after" transformations
- Behind-the-scenes moments
- Visual code snippets with explanations

**LinkedIn**
- Professional insights and lessons
- Career strategy discussions
- Industry observations
- Collaboration opportunities

**X/Twitter**
- Real-time thoughts and reactions
- Quick technical insights
- Community engagement
- Thread-based deep dives

**TikTok**
- Entertaining technical content
- "Day in the life" snippets
- Quick problem-solving moments
- Trend-based tech commentary

---

## 5) Narrative Evolution Through Gauntlet Phases

### Phase 1: Foundation (Weeks 1–3)
**Narrative Focus**: Learning and adaptation
- "I'm new to this, here's what I'm discovering"
- "The tools and processes that are working"
- "What I wish I knew before starting"

**Content Mix**: 60% learning, 30% building, 10% community
**Tone**: Curious, humble, determined

### Phase 2: Acceleration (Weeks 4–6)
**Narrative Focus**: Mastery and patterns
- "Here's what I've figured out"
- "The patterns that work consistently"
- "When to break the rules and why"

**Content Mix**: 40% building, 40% insights, 20% community
**Tone**: Confident, insightful, collaborative

### Phase 3: Scale (Weeks 7–10)
**Narrative Focus**: Impact and future
- "Here's what I've built and what it means"
- "What I'd do differently next time"
- "Where this is leading"

**Content Mix**: 50% building, 30% insights, 20% future vision
**Tone**: Accomplished, strategic, forward-looking

---

## 6) Story Frameworks

### The Problem-Solution-Insight Framework
1. **Hook**: "I spent 6 hours debugging this..."
2. **Problem**: What went wrong and why
3. **Solution**: How I fixed it
4. **Insight**: What I learned that applies broadly
5. **CTA**: Try this yourself / follow for more

### The Before-After-Transformation Framework
1. **Before**: "Here's what I was doing wrong"
2. **Process**: "Here's what I changed"
3. **After**: "Here's the result"
4. **Lesson**: "Here's why this matters"

### The Meta-Learning Framework
1. **Context**: "This week I learned..."
2. **Application**: "Here's how I applied it"
3. **Reflection**: "What this means for the future"
4. **Invitation**: "What have you learned about this?"

---

## 7) Brand Narrative DNA

### Core Story Elements
- **Protagonist**: Builder/learner on a mission
- **Conflict**: Time constraints vs quality standards
- **Resolution**: Smart tools + processes + community
- **Theme**: Progress through constraints

### Recurring Characters
- **The AI Co-pilot**: Cursor as collaborative partner
- **The Community**: Gauntlet cohort as support system
- **The Future Self**: Where this journey leads
- **The Audience**: Fellow builders learning together

### Visual Storytelling
- **Code on screen**: Show the work
- **Split screens**: Before/after comparisons
- **Screen recordings**: Live building moments
- **Whiteboard sketches**: Architecture thinking

---

## 8) Content Pillar Alignment

### Build Logs → Technical Narrative
- Focus on process and decisions
- Show the messy middle
- Highlight breakthrough moments

### Learnings → Educational Narrative
- Extract universal principles
- Connect to broader trends
- Provide actionable insights

### Decisions → Strategic Narrative
- Explain trade-offs clearly
- Show reasoning process
- Invite discussion and feedback

### Demos → Proof Narrative
- Show real functionality
- Highlight user value
- Demonstrate technical competence

### People → Community Narrative
- Highlight collaborations
- Show mutual value creation
- Build relationship capital

### Opportunities → Future Narrative
- Connect current work to future goals
- Invite participation
- Signal ambition and direction

---

## 9) Narrative Consistency Checklist

### Before Publishing
- [ ] Does this advance the core narrative arc?
- [ ] Is the voice consistent with brand principles?
- [ ] Does it connect to recurring themes?
- [ ] Is it appropriate for the target platform?
- [ ] Does it serve the audience's needs?
- [ ] Is the CTA aligned with current goals?

### Weekly Review
- [ ] What narrative themes emerged this week?
- [ ] How did the story evolve?
- [ ] What themes need more development?
- [ ] What audience feedback shaped the narrative?
- [ ] How does this week connect to the overall arc?

---

## 10) Narrative Evolution Tracking

### Metrics to Monitor
- **Engagement**: Which story types resonate most?
- **Comments**: What themes generate discussion?
- **Shares**: Which narratives spread organically?
- **Follows**: What attracts new audience members?
- **Collaborations**: What narratives open doors?

### Adaptation Signals
- **Audience questions**: What do they want to know more about?
- **Industry trends**: How do external events affect the narrative?
- **Personal growth**: How is the journey evolving?
- **Opportunities**: What new doors are opening?

---

## 11) Narrative Templates

### Weekly Story Arc Template
- **Monday**: What am I building this week?
- **Wednesday**: What's the biggest challenge?
- **Friday**: What did I learn/ship?

### Monthly Narrative Review
- **What story am I telling?**
- **How is it evolving?**
- **What themes need development?**
- **What opportunities are emerging?**

### Platform-Specific Narrative Adjustments
- **YouTube**: Full story with context and depth
- **Instagram**: Visual story with emotional hooks
- **LinkedIn**: Professional story with business context
- **X**: Real-time story with community engagement

---

## 12) Change Log
- v1: Initial narrative framework
- v2: Add platform-specific story mapping
- v3: Include narrative evolution tracking
```

Both documents are now ready and follow the strategic yet actionable tone of your Content System Operating Document. The distribution system focuses on the mechanics of publishing, while the narrative system defines the storytelling framework that drives all content creation.
