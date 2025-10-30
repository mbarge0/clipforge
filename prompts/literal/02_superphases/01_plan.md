**When to use**: When initializing a completely new phase of development that builds on a prior phase or project milestone.
**When not to use**: When continuing an existing phase or revisiting prior work — use “Build” instead.

Let’s begin the **Plan Phase** for Supermodule C — AI Assistant & Smart Replies (Post‑MVP) in the /docs/foundation/dev_checklist.md dev checklist using the **Consolidated Planning Template**.  
This phase combines the **Start**, **Plan**, and **Design** steps into one flow. Complete each step first before moving to the next step.

Let’s begin the Start Step using the **Phase Start Template**.
Reference the previous phase’s summary and confirm that all dependencies, requirements, and objectives are aligned. 
Establish the scope, deliverables, and intended outcomes for this new phase. 
Confirm readiness and assumptions with a short checkpoint summary.

Then execute the Plan step using the **Planning Loop Template**.
Identify priority order, dependencies, and estimated effort for each task.
Confirm that each task directly maps to a specific part of the PRD or checklist.
Perform regression planning referencing `/docs/operations/regression_manifest.md` to confirm regression dependencies and which previously completed phases or systems could be affected by this phase.

Then implement the Design Step using the **Design Loop Template**.  
Describe what the interface should look and feel like — layout, spacing, color system, typography, motion, and accessibility. Use /docs/operations/ui_guidelines.md as a guidelines on color palette and style.
Use textual wireframes or short descriptions of visual hierarchy and component states (hover, focus, disabled).  
Pause if any design or scope assumption needs clarification before build.

Store the resulting report under `/docs/operations/phases/recent/phase-XX-01-plan.md`. New work goes into `/docs/operations/phases/recent/`; move completed artifacts together to `/docs/operations/phases/archive/`. If the current supermodule or module does not have a number, assign it the next available phase number from the development checklist.

**System Template references:**  
- Phase Start Template: `/prompts/system/phases/01_phase_starter.md`  
- Planning Loop Template: `/prompts/system/phases/02_planning_loop.md`  
- Design Loop Template: `/prompts/system/phases/03_design_loop.md`  

**Previous phase documentation:** `/docs/operations/phases/phase-03-03-reflect.md`  
**PRD, architecture, and dev checklist:** `/docs/foundation/`  
**Regression manifest:** `/docs/operations/regression_manifest.md`
**Coding rules**: `/docs/operations/coding_rules.md`