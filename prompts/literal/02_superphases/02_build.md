**When to use**: When implementing a complete development phase that includes coding, interface verification, and debugging for a new or ongoing supermodule.  
**When not to use**: When performing planning, design, or scoping — use “Plan” instead.

Let’s implement this supermodule. Begin the **Build Phase** for this supermodule using the **Consolidated Implementation Template**. This phase combines **Build**, **UI Review**, and **Debug** steps into one flow. Complete each step first before moving to the next step. Use Coding Rules as a philosophical guide while implementing. We want something that works simply and reliably

Let’s begin the Build Step using the **Build Loop Template**.  
Outline your implementation approach first, then build features step-by-step.  
Verify functionality incrementally — test each major part before moving to the next.  
Pause for confirmation if any interpretation or assumption is unclear. Whenever you pause to update me on your progress, share which development task you’re on ie C3 RAG.

All code or implementation changes must appear between:
`<!-- BEGIN:BUILD_IMPLEMENTATION -->`  
and  
`<!-- END:BUILD_IMPLEMENTATION -->`.

After completing all build steps and testing locally, summarize your implementation report between:
`<!-- BEGIN:BUILD_REPORT -->`  
and  
`<!-- END:BUILD_REPORT -->`.

Then implement the UI Review step using the **UI Review Loop Template**.  
Compare the built interface against the approved design and the global UI Guidelines.  
Check visual, layout, and interaction fidelity — spacing, color, motion, and accessibility.  
Summarize any inconsistencies or needed refinements before moving to Debug.

Then implement the Debug step using the **Debugging Loop Template**.  
Validate that all checklist items from the dev checklist are satisfied and tests pass.  
Run unit, integration, and end-to-end checks to confirm feature completeness.  
Generate a regression checklist referencing prior modules and ensure legacy features remain stable.

Implement all code changes directly in the repository using **Coding Rules** as a philosophy. After completing implementation and testing, summarize the changes and store the build report under `/docs/operations/phases/phase-XX-02-build.md.` New work goes into `/docs/operations/phases/recent/`; move completed artifacts together to `/docs/operations/phases/archive/`. If the current supermodule or module does not have a number, assign it the next available phase number from the development checklist. Once you're done implementing, update the **Source of Truth** document.

**System Template references:**  
- Build Loop Template: `/prompts/system/04_building_loop.md`  
- UI Review Loop Template: `/prompts/system/05_ui_review_loop.md`  
- Debugging Loop Template: `/prompts/system/06_debugging_loop.md`  

**Supporting documentation:**   
- Dev Checklist: `/docs/foundation/dev_checklist.md`  
- UI Guidelines: `/docs/operations/ui-guidelines.md`  
- Regression manifest: `/docs/operations/regression_manifest.md`
- Coding Rules: `/docs/operations/coding_rules.md`
- Source of Truth: `/docs/operations/source_of_truth.md`
