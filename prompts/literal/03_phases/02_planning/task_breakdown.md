> Note: Foundry Core v2 prefers super-phase prompts in `/prompts/literal/02_superphases/` (Plan/Build/Reflect). This file remains available as a granular option.

**When to use:** When breaking down a large project or feature into smaller, actionable development tasks.
**When not to use:** When individual tasks are already defined — use “Begin Build” instead.

Let’s break this work into smaller, manageable tasks using the **Planning Loop Template**.
Identify priority order, dependencies, and estimated effort for each task.
Confirm that each task directly maps to a specific part of the PRD or checklist.

Before finalizing, also perform **Regression Planning**:
- Identify which previously completed phases or systems could be affected by this phase.
- Reference `/docs/operations/regression_manifest.md` to confirm regression dependencies.
- Record which features or workflows must continue working after this phase completes.

Pause to review and adjust before assigning work or beginning implementation.

**Planning Loop Template reference:** `/prompts/system/02_planning_loop.md`