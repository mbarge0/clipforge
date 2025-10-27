## Metadata
- **Document Type:** System Prompt  
- **Loop Type:** Checklist Loop  
- **Mode:** Ask  
- **Output Path:** `/docs/foundation/dev_checklist.md`

---

# Checklist Loop System Prompt

Use this loop to **generate or review operational development checklists** that translate the PRD and Architecture into a clear, actionable execution plan.  
This document defines **what will be built**, **in what order**, and **how success will be verified** — forming the bridge between planning and coding.

---

## Prompt Template

We are entering the **Checklist Loop**.

Please:
1. Read the current **PRD** and **Architecture** documents.  
2. Extract the **Supermodule Map** from the PRD and use it to structure the checklist.  
3. Within each Supermodule, identify every major feature or module described.  
4. Translate each feature into **actionable, testable tasks**.  
5. For each task, specify:
   - Dependencies (prerequisite modules or setup)
   - Acceptance criteria (definition of done)
   - Testing expectations (unit, integration, E2E)
6. Ensure that every build-phase task produces a *verifiable, visible result* — e.g., a rendered UI, a testable endpoint, or a working route. If functionality exists only in code but is not accessible in the app or through tests, treat it as **incomplete** until it can be visually or programmatically verified.
7. Tag each task by phase: `[Plan]`, `[Build]`, `[Debug]`, `[Validate]`.  
   - Where applicable, link validation tasks to regression IDs from `/docs/foundation/00_master_regression_manifest.md`.  
8. Organize tasks hierarchically — by **Supermodule → Module → Phase → Task**.  
9. Ensure dependencies between Supermodules are reflected in order of appearance.  
10. Produce a Markdown checklist suitable for iterative tracking and validation.  
11. Pause before writing to confirm completeness, clarity, and traceability with the user.

---

## Guidance Notes

- The **Supermodule Map** anchors the structure: each Supermodule should contain related modules and their sub-tasks.  
- Each task should be **independently verifiable** — ideally testable or demoable.  
- Use **~80–100 sub-tasks** for a full project-level checklist (roughly 4–6 Supermodules).  
- Cross-reference PRD features and Architecture entities to ensure complete coverage.  
- Keep dependencies clear: a developer should be able to pick any task and know what comes before it.  
- Group testing tasks within their Supermodule unless the project requires a dedicated QA section.  
- Use concise, action-oriented phrasing (“Implement,” “Add,” “Test,” “Deploy,” etc.).  
- Reference associated files or directories (e.g., `app/api/`, `lib/hooks/`, `config/env.ts`).  
- If the PRD defines AI-based workflows or tool interactions, include validation tasks for those explicitly.

---

## Output Format

The resulting document should be stored as:  
`/docs/foundation/dev_checklist.md`

It should include the following sections:

1. **Overview**  
   - Brief description of the checklist’s scope and objectives  
   - Estimated total number of tasks  
   - Relation to current PRD and Architecture documents  

2. **Structure (Supermodule Overview)**  
   - Organized according to the **Supermodule Map** from the PRD  
   - Each section labeled with the Supermodule name, contained modules, and related milestones  
   - Example: “Supermodule 1 – Environment & Tooling”, “Supermodule 2 – Canvas & Realtime”, etc.

3. **Supermodule Sections**  
   For each Supermodule:
   - **Supermodule Title and Description**  
   - List of contained modules and their purpose  
   - Tasks grouped by phase (`[Plan]`, `[Build]`, `[Debug]`, `[Validate]`)  
   - Each task includes:  
     - Acceptance Criteria  
     - Dependencies  
     - Testing Expectations  
     - Linked Regression IDs (if applicable)

4. **Cross-Module & Shared Tasks**  
   - Shared responsibilities like deployment, documentation, error handling, observability, and QA

5. **Testing Coverage Map**  
   - Summary of where testing occurs across the checklist  
   - Identify any gaps or deferred QA tasks  

6. **Validation Mapping**  
   - Summarize how implementation tasks correspond to regression manifest items.  
   - Each row maps a functional or integration feature to a regression ID and test type.  

   Example:

   | Task | Regression ID | Test Type | Status |
   |------|----------------|-----------|--------|
   | Implement Real-Time Sync | R-001 | Functional | ☐ |
   | AI Agent Command Parser | R-010 | Integration | ☐ |

7. **Completion Definition**  
   - Criteria for checklist completion (e.g., 100% task coverage, 90% test pass rate)  
   - Include qualitative goals (smooth UX, AI clarity, performance stability)

8. **References**  
   - Link back to `/docs/foundation/prd.md` and `/docs/foundation/architecture.md`  
   - Mention `/docs/schema.sql` and `/docs/foundation/00_master_regression_manifest.md` if relevant  
   - Note the next phase to begin after checklist completion

---

## Output Instructions

- Before generating the document, confirm with the user:  
  > “Would you like to create or update the **development checklist** at `/docs/foundation/dev_checklist.md`?”  
  > “Would you like to structure the checklist based on the **Supermodule Map** from the PRD?”

- If confirmed, write the Markdown file to:  
  `/docs/foundation/dev_checklist.md`

- Standard filenames for foundation documents:  
  - PRD: `prd.md`  
  - Architecture: `architecture.md`  
  - Checklist: `dev_checklist.md`

---

✅ **Highlights**
- Integrates directly with the **Supermodule Map** from the PRD  
- Creates **hierarchical structure**: Supermodule → Module → Task  
- Adds **phase tagging** and **regression linking** for traceability  
- Harmonized with PRD and Architecture loops for complete foundation alignment  
- Enables AI to plan and group work at the **supermodule level**, improving scalability and consistency  
