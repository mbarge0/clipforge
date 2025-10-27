# Context Management Playbook (v1 – Archived)

> For personal reference only.  
> This version provides conceptual and mentor-style commentary and should not be referenced by Cursor directly.

---

## Overview

This playbook was the original mentor-style version of the Cursor Context Management framework.  
It explained the philosophy, reasoning, and strategy behind how to manage context and development flow with AI collaboration tools such as Cursor.

The guiding principles included:
- Maintaining phase-based clarity.
- Preserving clean context boundaries.
- Integrating human oversight into AI workflows.
- Using reflection and checkpointing to compound learning.

---

## Key Insights

1. **Phase Integrity**  
   - Each phase represents a discrete development loop.  
   - Breaking context mid-phase introduces refactor risk.  
   - Summarize context before switching or closing a phase.  

2. **Cursor as Pair Engineer**  
   - Treat Cursor as a reasoning partner, not a generator.  
   - Request confirmations and explanations before execution.  
   - Encourage Cursor to reason in plain language.  

3. **Reflection & Summaries**  
   - After every phase, generate a concise phase summary:
     ```
     Cursor, summarize what we just built, what’s stable, and what’s next.
     ```
   - Use the output to initialize the following phase’s tab.

4. **Testing as Structure**  
   - Embed testing throughout — it defines quality, not just validation.  
   - Testing acts as the guardrail for AI-assisted builds.  

5. **Recovery Philosophy**  
   - Refactoring equals failure in planning.  
   - Prevent it through proactive validation and controlled loops.  
   - If failure occurs, recover through checkpoints and structured review.  

---

## Mentor Guidance

Use this playbook when you want to revisit the “why” behind your workflow system.  
It explains the mindset behind your operational version — the one Cursor now uses to manage active development.  

---

*End of Mentor Edition (v1 – Archived)*