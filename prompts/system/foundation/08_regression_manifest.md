## Metadata
- **Type:** System Prompt  
- **Category:** Utilities → Regression Management  
- **Output Path:** `/docs/operations/regression_manifest.md`
- **Mode:** Ask  
- **Trigger Phase:** Product Initialization (Phase 00)

---

# Master Regression Manifest Generator — System Prompt

Use this system prompt to generate the **Master Regression Manifest**, a project-wide document defining all regression coverage expectations across development phases.

This manifest provides a structured overview of:
- Each development phase in the project  
- Core features introduced during that phase  
- Prior functionality that must remain stable (regression scope)  
- Dependencies between phases  

The goal is to create a **permanent reference** for regression planning — not a record of test outcomes.  
Actual regression results will be captured in per-phase debug documents.

---

## Prompt Template

We are generating the **Master Regression Manifest** for this project.

Please:
1. Review the foundation documents of the project's PRD, architecture, and dev checklist under `/docs/foundation/`.
2. Identify all planned phases in chronological order.
3. For each phase, define:
   - **Phase Number and Name**
   - **Core Features Introduced**
   - **Regression Scope** — prior features that must continue working after this phase
   - **Dependencies** — other phases or systems this phase relies on
4. Summarize the relationships between phases and their regression responsibilities.
5. Create a Markdown table summarizing all phases.
6. Provide individual subsections for each phase with concise regression expectations.
7. Do **not** include execution results, test statuses, or validation logs — this document defines structure, not outcomes.

---

## Guidance Notes

### When to Use
- At **project initialization** (Phase 00) to define the full regression coverage map.
- Whenever a **new major phase** or module is added to the roadmap.
- During **architecture or testing audits**, to verify coverage completeness.

### When Not to Use
- Do not update this manifest during phase debugging or reflection.
- Do not record test results here; those belong in phase-specific debug reports.

### Relationship to Other Documents
- Each **per-phase regression checklist** should reference this manifest to confirm dependencies.
- Each **debug document** should link back to this manifest when performing regression verification.
- The manifest remains **static** except when new phases are introduced.

---

## Output Format

The resulting document should be stored as:  
`/docs/operations/regression_manifest.md`

It should follow this structure:

---

# 🧭 Master Regression Manifest

## Overview
This document defines all regression testing expectations across the project lifecycle.  
It identifies the features introduced by each phase and specifies which prior systems must remain functional after new development.

---

## Phase Summary Table 
Each phase is listed with its respective core features, regression scope, and dependencies at a high level

| Phase | Core Features Introduced | Regression Scope | Dependencies |
|-------|---------------------------|------------------|---------------|

---

## Phase Details for each phase

### Phase #
**Introduced Features:**  
- Project initialization  
- Dependency configuration  
- Base environment setup  

**Regression Scope:**  
Prior features that must continue working after this phase

**Dependencies:**  
What features in this phase that are required by all later phases.

---

## Notes
- This manifest defines *what must be verified*, not *what was verified*.  
- Regression outcomes are documented per-phase in the corresponding debug files.  
- Update this manifest only when the project’s phase structure or dependencies change.

---