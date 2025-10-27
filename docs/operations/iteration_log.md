# Iteration Log  
_Version 1.1 — Updated for Gauntlet Mode (Oct 2025)_  

Records UI/UX tweaks, small fixes, and micro-iterations between formal PRD updates.  
Keeps the PRD clean while ensuring visibility into ongoing improvements and experiments.  


## 1. Purpose
- Track small, fast iterations without polluting main documentation.  
- Provide visibility into ongoing UX, layout, and copy changes.  
- Capture design learnings that may later flow back into the PRD or Reflection docs.  
- Ensure Cursor’s visual work is reviewable, explainable, and test-validated.  


## 2. Structure
Each week or phase section should contain:  
- **Date / Phase** – timestamp or phase name.  
- **Focus Area** – which feature, component, or UX flow is being refined.  
- **Change Summary** – short list of what was adjusted and why.  
- **Prompt Used** – reference to literal prompt (if Cursor executed change).  
- **Status** – `completed`, `needs review`, or `merged to PRD`.  

Example format:  
Week 2 – Dashboard Enhancements

Date: Oct 7, 2025
Focus: Navigation & layout clarity
Changes:
	•	Adjusted sidebar collapse behavior
	•	Updated card spacing and color hierarchy
	•	Added hover tooltips for actions

Prompt Used: /prompts/literal/03_building/adjust_existing_code.md
Status: completed

> Use short, clear bullet summaries—think changelog, not journal.  


## 3. Cursor Collaboration Rules
- Never perform UI changes without a corresponding entry in this log.  
- When instructing Cursor for micro-iterations, use the literal prompts under:  
  `/prompts/literal/03_building/` or `/prompts/literal/04_debugging/`.  
- Cursor should provide reasoning for each UI change (expected impact + test).  
- If UI regression occurs, revert to the previous checkpoint and reapply step-by-step.  


## 4. Phase Integration
- At the end of each phase, merge stable iteration results into `prd.md` or `source_of_truth.md`.  
- Log unresolved or experimental items under `/docs/reflections/[phase].md`.  
- Each new phase begins by reviewing prior iteration notes for context.  


## 5. Logging Prompts
When adding to this file, you can use a shorthand Cursor prompt like:  
> “Summarize all UI adjustments made this phase in iteration_log.md format.”  

Cursor will extract the relevant changes from recent code commits or its own memory to update this log cleanly.  


## 6. Active Weeks

### Week 0 – Starter Template  
*(No major iterations logged yet.)*  

### Week 1 – Clone  
*(Begin logging adjustments to the initial cloned app or core features.)*  


---

**Summary:**  
Iteration Log = the living record of evolution between checkpoints.  
PRD defines what to build; Iteration Log captures *how it changed while you built it*.  
In Gauntlet Mode, it’s also a trace of AI-human design collaboration.