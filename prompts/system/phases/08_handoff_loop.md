## Metadata
- **Phase:** {{phase-number}}
- **Mode:** Ask
- **Merge Mode:** Append
- **Output Path:** `/docs/operations/phases/recent/phase-{{phase-number}}-reflect.md`

---

# Context Summary (Handoff Loop) System Prompt

Use this prompt to **summarize and close a phase**, transferring full project context, outcomes, and next objectives into a concise, reusable document for the next phase.  
This ensures that each handoff — whether to a new developer, a new mode (Ask → Plan → Agent), or a new environment — happens with complete continuity.

---

## Prompt Template

We are entering the **Handoff Loop (Context Summary)** for this phase.

Please:
1. Summarize the **phase outcome** — what was accomplished and validated.  
2. Identify **key components and deliverables** produced during this phase.  
3. Record **testing and verification results** (successes, failures, deferrals).  
4. Note any **open issues**, technical debt, or deferred work.  
5. Document **current stability status** and known risks.  
6. Define **next-phase objectives** clearly and concisely.  
7. Format the output as a single, easily readable summary document for the next phase to reference.  

This document will act as the **source context** for the next Phase Starter prompt.

---

## Guidance Notes

- Keep it **short, structured, and factual** — this is the “bridge” between major stages.  
- Treat it as the *executive summary* of your entire phase.  
- Focus on actionable continuity — what’s stable, what’s pending, what’s next.  
- Every new phase should begin by reading the **previous phase’s handoff summary**.  
- Include direct file references for easy traceability (e.g., `/docs/architecture.md`, `/docs/schema.sql`).  
- Use consistent terminology: *Phase Outcome*, *Testing Status*, *Next Objectives*.  

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

1. **Phase Summary**
   - **Phase Name:** (e.g., “Module 1 — Environment Setup”)  
   - **Date Completed:**  
   - **Duration:**  
   - **Phase Outcome:** Brief summary of what was achieved  
   - **Stability Rating:** High / Medium / Low  

2. **Core Deliverables**
   - List of main outputs (e.g., schema, configuration files, components)  
   - Links or paths to corresponding files  
   - Any generated documentation relevant to this phase  

3. **Testing Status**
   - Overview of validation and QA outcomes  
   - Key metrics (tests passed, deferred tests, known issues)  
   - Verification summary (e.g., “Database connection verified; RLS deferred to Module 6”)  

4. **Risks and Limitations**
   - Known technical debt or issues not yet fixed  
   - Performance, architectural, or process concerns  
   - Mitigation or follow-up plan  

5. **Next Objectives**
   - Clear next steps for the upcoming phase  
   - Dependencies or prerequisites needed before starting  
   - Milestones to achieve (e.g., “Implement Supabase Auth,” “Verify RLS with real users”)  

6. **References**
   - Key documents and their paths  
   - Phase checkpoint tag (e.g., `ckpt-2025-10-10_1125`)  
   - Relevant commits or branch names  
   - Associated test results or performance benchmarks  

7. **Summary Statement**
   - A short paragraph (2–4 sentences) summarizing the overall phase health and readiness for the next step  
   - Tone: factual, forward-looking, and confident  

---

✅ **Highlights**
- Matches the unified structure of all other system prompts  
- Defines a *clear, scannable output structure* for continuity  
- Works both for solo dev work and team handoffs  
- Feeds seamlessly into the **next phase starter**  
- Makes checkpoints and documentation traceable across the full project lifecycle