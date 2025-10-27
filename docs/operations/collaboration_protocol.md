# Collaboration Protocol – Gauntlet AI Team (Matt · Copilot · Cursor)  
_Version 1.1 — Updated for Gauntlet Mode (Oct 2025)_


## 1. Roles & Responsibilities
| Member | Primary Focus | Description |
|---------|----------------|-------------|
| **Matt** | Vision & Decision-Making | Defines goals, product taste, and final calls. |
| **Gauntlet Copilot** | Strategy & Systems | Shapes context, workflows, and reflection. |
| **Cursor** | Execution & Validation | Writes code, drafts PRDs, implements, tests. |


## 2. Development Phases
1. **Context Phase**  
   - Matt + Copilot establish background, goals, success criteria.  
   - Output → `docs/context.md`.  
   - Cursor is given rich narrative context, *not* step-by-step orders.

2. **Architecture Phase**  
   - Copilot outlines strategic architecture.  
   - Cursor reviews and suggests improvements.  
   - Output → updated PRD + implementation checklist.

3. **Build Phase**  
   - PRD → Implementation Checklist → Cursor executes each phase sequentially.  
   - Each phase defines: *inputs · outputs · validation criteria.*  
   - Cursor produces working code + unit tests + checkpoints.

4. **Reflection Phase**  
   - Matt + Copilot review build quality, workflow friction, and prompt performance.  
   - Lessons flow into updated prompts, templates, and future context files.


## 3. Quality-Control Framework
1. **Reasoning Review** – Ask Cursor to explain design choices and trade-offs.  
2. **Code Scan** – Cursor self-reviews for hardcoding, smells, and unhandled cases.  
3. **Testing Infrastructure** – Unit + integration tests generated and maintained early.  
4. **Run Validation** – Verify behavior via logging and live testing.  

> If localhost or builds fail repeatedly, request:  
> *“Review and strengthen testing and validation coverage for production-grade stability.”*


## 4. Change-Management System
Two lanes for modifications during development:

### Lane A – Structural Changes  
(New features, APIs, data models, user flows)  
→ Update PRD + Checklist formally (new phase or sub-phase).  
→ Instruct Cursor to re-validate downstream dependencies.

### Lane B – Iterative / UI-UX Changes  
(Layout, styling, navigation, copy)  
→ Log in `docs/iteration_log.md` with date and bullet list.  
→ After several iterations, summarize and merge stable UI changes back into PRD.

**Rule of Thumb**

| Change Type | Documentation | Reason |
|--------------|----------------|--------|
| Architecture / Logic | PRD + Checklist | Impacts system integrity |
| Medium UX Enhancements | PRD summary + Iteration Log | Affects flow |
| Minor Tweaks / Bugs | Iteration Log only | Cosmetic |


## 5. Interface Development Guidance
- Treat interface work as a first-class deliverable.  
- Begin with simple **layout sketches or wireframes** (Figma / v0 / Lovable / Windsurf) only if it speeds clarity—avoid tool bloat.  
- Define explicit UI requirements in PRD: component purpose, responsiveness, state behaviors.  
- Use Cursor’s visual reasoning:  
  > “Design a modern, minimal interface consistent with current UI standards for SaaS dashboards.”  
- Maintain an **Iteration Log** to capture cycles of visual refinement.


## 6. Checkpoints & Recovery
- End every completed checklist phase with a saved checkpoint (git branch or zip).  
- If a branch becomes unstable: revert to the last working checkpoint and re-introduce fixes step-by-step.  
- Copilot supports meta-analysis; Cursor focuses only on code correction.


## 7. Retrospective Loop
After each build:
1. What worked well about Cursor’s reasoning and structure?  
2. What required manual correction?  
3. Which prompts or checklists should be updated?  

Store retrospectives in `docs/weekly_report.md`.


## 8. AI Collaboration Protocol (Gauntlet Mode)

AI tools like Cursor and Copilot operate as intelligent collaborators, not passive executors.

**Before Development**
- Always provide context: PRD + Checklist + last phase summary.  
- Use literal prompts referencing system templates in `/prompts/system/`.  
- Confirm understanding before execution.

**During Development**
- Keep work modular within phases.  
- Use phase-specific literal prompts (e.g. `03_building/continue_build.md`).  
- Pause and summarize context whenever completion percentage rises above 85%.  
- Avoid issuing new instructions without confirming Cursor’s interpretation.

**After Development**
- Run Reflection + Handoff loops.  
- Cursor generates a phase summary and verifies test coverage.  
- Log key learnings to `/docs/reflections/[phase].md`.

**Golden Rules**
- Confirm before execute.  
- Never skip summaries.  
- Always use context continuation prompts across tabs.

**Template References**
- AI Collaboration Loop → `/prompts/system/07_ai_collaboration_loop.md`  
- Reflection Loop → `/prompts/system/05_reflection_loop.md`  
- Handoff Loop → `/prompts/system/06_handoff_loop.md`  


## 9. Communication Rhythm
- **Morning:** quick status & priority check-in with Copilot.  
- **Midday:** progress or blocker pulse.  
- **Evening:** brief reflection + checkpoint commit.  

This cadence maintains momentum and prevents silent blockers.


## 10. Gauntlet Mode Integration
This collaboration protocol now integrates directly with:
- `/prompts/literal/` — operational prompts by phase and situation.  
- `/prompts/system/` — reusable structure templates.  
- `/docs/reflections/` — phase summaries, retrospectives, and testing notes.  

**Goal:** create a unified environment where human, AI, and system collaborate seamlessly, following the same rules of structure, reasoning, and accountability.


**Summary:**  
- Context wide → Build narrow.  
- PRD for structure → Iteration Log for creativity.  
- Quality through checkpoints + testing.  
- Continuous reflection → continuous improvement.