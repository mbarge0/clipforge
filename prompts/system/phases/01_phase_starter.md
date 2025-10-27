## Metadata
- **Phase:** {{phase-number}}
- **Mode:** Ask
- **Merge Mode:** Append
- **Output Path:** `/docs/operations/phases/recent/phase-{{phase-number}}-plan.md`

---

# Phase Starter System Prompt

Use this when beginning a new phase of development to establish clarity, context, and stability.

---

## Prompt Template

I’m starting a new phase of this project. Here’s the setup:

**Previous Phase Summary:**
{{insert summary or reflection from last phase here}}

**Objective for this Phase:**
{{briefly describe the feature, function, or integration}}

**Constraints:**
- Maintain architectural consistency.
- Don’t break any tested or working modules.
- Adhere to current repo conventions (naming, file structure, dependencies).

**Include in Your Response:**
1. A concise restatement of goals and tasks for this phase.  
2. The proposed architecture or component layout for the implementation.  
3. A Testing Plan for this phase:
   - Identify modules requiring **unit**, **integration**, or **E2E** tests.  
   - Suggest test file paths.  
   - Outline what success looks like in each test category.  
4. A step-by-step implementation plan for execution.

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

1. **Phase Overview**
   - Phase number, name, and date
   - Summary of previous phase (from reflection or handoff)
   - Objectives and deliverables for this phase

2. **Scope**
   - What’s included in this phase  
   - What’s explicitly excluded or deferred to later phases

3. **Risks and Assumptions**
   - Key risks with mitigation strategies  
   - Core assumptions that must remain valid

4. **Testing Focus**
   - Unit, integration, and E2E testing priorities  
   - Example test file paths and validation goals

5. **Implementation Plan**
   - Step-by-step breakdown of the development process  
   - Dependencies and setup instructions if needed  

6. **Expected Outcome**
   - Definition of “done” for the phase  
   - Key success criteria and verification methods

7. **Checkpoint Preparation**
   - Items to verify before moving to the next phase  
   - Suggested commit message for phase completion