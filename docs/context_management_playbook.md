# Cursor Context Management Playbook – Version 2 (Operational Edition)

> This file defines the active context-handoff and phase-management procedures 
> for Gauntlet AI builds. Cursor must reference this document when initializing, 
> switching, or closing development phases.

---

## Addendum for Foundry Core v2
- Replace legacy “Planning/Building Loop” phrasing with the super-phase cadence: **Plan → Build → Reflect**.
- Storage policy: **Write all in-progress phase outputs to `/docs/operations/phases/recent/` and move completed/superseded artifacts to `/docs/operations/phases/archive/`**.

---

## 1. Purpose and Philosophy

This playbook governs how Cursor manages context, phase transitions, testing, and reflection during development.

Cursor operates as a co-engineer within a structured system. Each phase follows a controlled prompt protocol, references a defined template, and concludes with testing and reflection checkpoints.

The core philosophy:
- Preserve **context clarity** — never start a phase without grounding in purpose and previous results.  
- Prioritize **testing and reflection** — no phase closes without validation.  
- Maintain **consistency across builds** — always use literal prompts and system templates for structure.

---

## 2. Context Window Management

1. Keep context within 75–85% of Cursor’s visible window.  
2. When nearing 90%, summarize the current work:  
Cursor, create a phase summary of what we just completed, ending in what we should do next.
3. Begin new work in a fresh tab referencing the summary:  
Cursor, load this context summary to initialize the next phase.
4. Always confirm understanding before proceeding.  
5. Never continue code in a context window above 90% utilization — start a new phase tab instead.

---

## 3. Phase Workflow Overview

### **Phase 01 – Start**
Initialize the project or new feature set. Define objectives, scope, and success criteria.

Reference:
- /prompts/literal/01_phase_start/
- /prompts/system/01_starting_loop.md

Inline action:
Cursor, confirm the PRD, success criteria, and constraints before any implementation begins.

---

### **Phase 02 – Plan (Super-Phase)**
Develop architecture, flow diagrams, and technical decisions.

Reference:
- /prompts/literal/02_superphases/01_plan.md
- /prompts/system/02_planning_loop.md

Inline action:
Cursor, generate the architecture diagram and confirm file organization before proceeding.
Cursor, verify all external dependencies are clearly defined and listed in source_of_truth.md.

---

### **Phase 03 – Build (Super-Phase)**
Implement the defined feature or phase deliverable.

Reference:
- /prompts/literal/02_superphases/02_build.md
- /prompts/system/04_build_loop.md

Inline action:
Cursor, let’s begin implementing this phase using the Build Loop Template.
Reference the PRD and checklist for this phase, and follow the structure in the template.
Include a concise outline of the implementation plan first, then start writing code step by step.
Verify each key part works before moving to the next.
Pause before full execution to confirm your interpretation if any assumption is unclear.

At phase closure, run:
“Cursor, verify all implemented features through automated and integration tests before checkpoint commit.
Use /prompts/literal/04_pre-submission/rubric_verification.md for structure.”

---

### **Phase 04 – Debug**
Stabilize the build, identify and fix defects, and confirm reliability.

Reference:
- /prompts/literal/03_phases/05_debugging/* (legacy granular prompts)
- /prompts/system/06_debugging_loop.md

Inline action:
Cursor, analyze test results and error logs for regressions.
If two fixes fail consecutively, revert to the previous checkpoint and start a focused recovery tab.
After resolving bugs, confirm with:
“Cursor, rerun full tests using /prompts/literal/04_pre-submission/rubric_verification.md to validate stability.”

---

### **Phase 05 – Reflect (Super-Phase)**
Capture learnings, summarize progress, and prepare for next-phase handoff.

Reference:
- /prompts/literal/02_superphases/03_reflect.md
- /prompts/system/07_reflection_loop.md

Inline action:
Cursor, create a reflection summary outlining what worked, what didn’t, and what should change next phase.
Use the Reflection Loop Template to structure insights and update docs/weekly_report.md accordingly.
Then verify test coverage and confirm readiness for handoff.

---

### **Phase 06 – Handoff**
Finalize and stabilize deliverables for deployment or next project cycle.

Reference:
- /prompts/literal/04_pre-submission/rubric_verification.md
- /prompts/system/08_context_summary_template.md

Inline action:
Cursor, perform final QA on all features, confirm passing test suite, and create the release checklist.
Validate version integrity and generate the final checkpoint commit.
Confirm project completion by summarizing the build in docs/source_of_truth.md.

---

## 4. Refactor Prevention and Recovery

- **Refactor Prevention:**  
  - Cursor should always validate assumptions before implementing.  
  - Request architecture confirmation at each new build stage.  
  - Example:
    ```
    Cursor, explain the plan for the following implementation and confirm all dependencies before coding.
    ```

- **Recovery Protocol:**  
  - If repeated errors occur, revert to last stable checkpoint.  
  - Reinitialize context using:
    ```
    Cursor, load the last working context summary and reanalyze for causes of failure.
    ```

---

## 5. Testing Integration

Testing is continuous, not an afterthought.  

Key expectations per phase:
- **Build (Super-Phase):** Generate unit + integration tests alongside implementation.  
- **Debug:** Confirm all failing tests pass before proceeding.  
- **Reflect (Super-Phase):** Run full test suite and summarize metrics.  
- **Handoff:** Perform regression tests and smoke checks.

Inline universal testing prompt:
Cursor, review test coverage and generate missing tests for all critical paths before phase closure.

---

## 6. Reflection and Handoff Guidelines

At the end of each phase:
1. Run the reflection prompt:
Cursor, create a phase summary of what we just completed, ending in what we should do next.

2. Use the summary to initialize the next tab.
3. Always confirm PRD, checklist, and current state alignment before starting new work.

Final handoff:
- Update `source_of_truth.md`  
- Record insights in `weekly_report.md`  
- Commit changes as `checkpoint:`  
- Confirm testing completion  

---

*End of Operational Edition (v2)*