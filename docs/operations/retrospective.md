# Retrospective Notes  
_Version 1.1 — Gauntlet Mode (Oct 2025)_  

Captures cumulative insights, improvements, and systemic adjustments over time.  
Updated weekly after completing the Weekly Report.  
Acts as the *meta-log* of how your thinking, workflow, and AI collaboration evolve.


## 1. Retrospective Structure
Each week’s entry should include:  
- **Key Realizations:** what you learned technically or strategically.  
- **Prompt Quality:** what improved or needs adjustment in communication with Cursor.  
- **Testing Confidence:** how strong your testing coverage felt this week.  
- **Workflow Adjustments:** what process refinements you’ll apply next.  
- **Meta Insight:** what this week taught you about your overall approach or mindset.  

> Use `/prompts/system/05_reflection_loop.md` to generate or summarize weekly retrospectives automatically.  
> Example prompt:  
> “Cursor, summarize our week’s key learnings and improvement areas in retrospective format.”


## 2. Week-by-Week Retrospectives

### Week 0 — Starter Template
**Key Realizations:**  
- Over-specified PRD details early → Cursor performed better with conceptual context first.  
- Early checkpointing avoided major rework.  
- Need a stronger early-stage UI design workflow.  

**Prompt Quality (1–10):** 6  
**Testing Confidence (1–10):** 7  
**Workflow Adjustments:**  
- Start each phase with a Context Summary prompt.  
- Add a dedicated UI planning checklist before build phases.  

**Meta Insight:**  
Cursor collaboration improves dramatically when you prioritize narrative context before detail.

---

### Week 1 — Clone Phase
**Key Realizations:**  
- Cursor followed structure well, but mid-phase adjustments caused minor confusion.  
- Adding the Phase Summary prompt before transitions improved continuity.  
- Incremental testing per feature gave faster error feedback.  

**Prompt Quality (1–10):**  
**Testing Confidence (1–10):**  
**Workflow Adjustments:**  
**Meta Insight:**  

*(To be filled after Week 1 completion.)*

---

### Week 2 — AI Feature Integration
**Key Realizations:**  
*(Focus on balancing complexity and modularity — how AI logic integrates with stable code.)*  

**Prompt Quality (1–10):**  
**Testing Confidence (1–10):**  
**Workflow Adjustments:**  
**Meta Insight:**  

---

*(Continue adding weeks as program progresses.)*  


## 3. Cross-Week Themes (Updated Monthly)
Use this section to capture overarching patterns.  
Cursor can help summarize these using reflection data from multiple weeks.  

**Example format:**  
- Consistent improvement in code quality when following full Build → Test → Reflect loops.  
- Prompt length correlates with reasoning clarity up to ~400 tokens; longer prompts reduce focus.  
- Most stable results came when tests were written before AI feature generation.

> Prompt: “Cursor, summarize recurring themes across all retrospectives to date.”  


## 4. Reflection References
- **Weekly Report Template:** `/docs/weekly_report.md`  
- **Reflection Loop Template:** `/prompts/system/05_reflection_loop.md`  
- **Cursor Context Management Playbook:** `/docs/context_management_playbook.md`  


---

**Summary:**  
`retrospective.md` = meta-reflection file — your “engineering journal.”  
Where weekly reports describe *what happened*, retrospectives capture *why it happened and how to grow from it*.  
By Week 10, this will be your clearest record of Gauntlet transformation — technically, cognitively, and strategically.