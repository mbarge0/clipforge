## Metadata
- **Phase:** {{phase-number}}
- **Mode:** Document
- **Merge Mode:** Append
- **Output Path:** `/docs/operations/phases/recent/phase-{{phase-number}}-build.md`

---

# Debugging Loop System Prompt

Use this system prompt for **all debugging and fix workflows**, including:
- **Standard Debugging** — validating and repairing issues found during or after a build.  
- **Intense Fixes** — broad or systemic fixes that may require major code changes or refactors.  
- **Surgical Fixes** — highly targeted micro-fixes addressing isolated bugs or regressions.

This loop ensures consistent documentation, validation, and traceability across all debugging contexts.

---

## Prompt Template

We are entering the **Debugging Loop** for this phase.

Please:
1. Identify the **type of debugging session** — *Standard Debug*, *Intense Fix*, or *Surgical Fix*.  
2. Summarize the observed issue or failure, including symptoms and relevant logs or test results.  
3. Diagnose the likely root cause and define your debugging strategy.  
4. Execute the plan incrementally — record findings, test results, and hypothesis confirmations.  
5. Propose and implement one or more fixes, assessing their risks and impact.  
6. Run post-fix validation tests (unit, integration, E2E).
7. Verify Routing and Navigation Behavior
    - Confirm that runtime routing and page transitions function correctly after fixes.  
    - Specifically validate post-auth redirects (e.g., login → dashboard/canvas), nested routes, and 404 handling.  
    - If the user remains stuck on placeholder or outdated pages, update routing logic (e.g., Next.js `app/page.tsx`, route guards, or redirects).  
    - Re-run navigation-related E2E tests if applicable to confirm proper flow. 
8. Generate a regression checklist for this phase using `/prompts/system/utilities/08_regression_loop.md` as a guide and `/docs/operations/regression_manifest.md` as a data source. Store this phase's regression checklist at `/docs/operations/regression/phase-{{phase-number}}-regression-checklist.md`
9. Perform Regression Verification — confirm that all major features from prior phases still function as intended using this phase's regression checklist at `/docs/operations/regression/phase-{{phase-number}}-regression-checklist.md`. Record outcomes in Section 8 (Regression Verification).    
10. Record all test results, file changes, and lessons learned.  
11. Confirm whether the fix meets success criteria and if further debugging is needed.

---

## Guidance Notes

### Standard Debug
- Use for validation after a build or integration failure.  
- Focus on stability, configuration errors, or logic defects.  
- Usually low to medium impact.

### Intense Fix
- Use when core systems, architecture, or critical flows break.  
- Requires broad inspection and potential refactor.  
- Pause other work until stability is restored.  
- May generate new sub-tasks or architecture updates.

### Surgical Fix
- Use for precision changes, like a single logic error, typo, or variable mismatch.  
- Prioritize speed and isolation — minimize ripple effects.  
- Avoid unrelated edits.

**General Rules:**
- Document *every* debugging step, not just the final fix.  
- Confirm root cause before refactoring or optimizing.  
- Always re-run validation tests after each change.  
- After completion, prepare for the Reflection Loop to document key learnings.

---

## Output Format

Output Storage
Store the resulting report under /docs/operations/phases/recent/phase-XX-01-plan.md (or the relevant file for Build or Reflect).
New work always goes into /docs/operations/phases/recent/.
When a phase is completed or superseded, move the entire set of related artifacts from /recent/ to /archive/.
If the current supermodule or module does not have a number, assign it the next available phase number from the Development Checklist.

If multiple system prompts (like Start, Plan, and Design) are run for the same super phase, they should all append to the same file.
Each should begin with a labeled heading (e.g., ## Start, ## Plan, ## Design, ## Build, etc.).
The combined file serves as the complete report for that super phase.

It should include the following sections:

1. **Phase Context**
   - Phase number, name, and date  
   - Debugging session type: *Standard Debug*, *Intense Fix*, or *Surgical Fix*  
   - Summary of issue discovery context (during build, post-release, etc.)  

2. **Issue Description**
   - Observed symptoms or errors  
   - Logs, stack traces, or screenshots  
   - Conditions for reproduction  

3. **Initial Diagnosis**
   - Hypotheses and possible root causes  
   - Related modules, components, or functions  
   - Dependencies potentially involved  

4. **Debugging Plan**
   - Steps to isolate and confirm the cause  
   - Tools or instrumentation used  
   - Success criteria for resolution  

5. **Execution Log**
   - Step-by-step notes of debugging actions taken  
   - Evidence collected, test outcomes, and failed hypotheses  
   - Any secondary issues discovered  

6. **Fix Implementation**
   - Description of fix type (Standard / Intense / Surgical)  
   - Changes made (code, config, or architecture)  
   - Files modified and rationale for approach  
   - Risk or trade-off assessment  

7. **Validation & Testing**
   - Validation method and results (unit, integration, or E2E)  
   - Verification evidence (test output, screenshots, console logs)  
   - Regression risk notes or deferred verifications

8. **Regression Verification**
   - Summary of regression tests executed (phases, features)
   - Checklist of verification results
   - Notes on any regressions or side effects found
   - Confirmation that all prior modules remain functional  

9. **Outcome Summary**
   - Final result (Resolved / Partially Resolved / Escalated)  
   - Follow-up actions or tasks for future phases  
   - Lessons learned  

10. **Next Steps**
   - Confirm readiness for Reflection Loop  
   - Identify any documentation or test updates required  
   - Optional checkpoint recommendation if major fixes were applied