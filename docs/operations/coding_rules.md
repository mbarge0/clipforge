# Coding Rules – Gauntlet AI Starter Template  
_Version 1.1 — Updated for Gauntlet Mode (Oct 2025)_


## 1. Core Principles
1. **Plan before you code.**  
   - PRD → Checklist → Implementation.  
   - Never begin coding before the product definition is explicit and validated.  
   - Each new phase starts with its respective literal prompt under `/prompts/literal/[phase]/`.

2. **Anti-refactor mindset.**  
   - Assume refactoring under time pressure is failure.  
   - Plan deep, execute cleanly once.  
   - Use the *Phase Closure* and *Context Summary* prompts from the Cursor Context Management Playbook to prevent drift.

3. **AI as collaborator, not tool.**  
   - Treat Cursor as a developer partner.  
   - Explain reasoning, ask for validation, request self-review.  
   - Cursor must confirm interpretation before executing significant code changes.

4. **Checkpoint discipline.**  
   - End every phase with a saved checkpoint (`git commit` or zip).  
   - If debugging fails twice, revert to the last stable checkpoint.  
   - Use literal prompts under `/prompts/literal/04_debugging/` for controlled recovery.

5. **Context continuity.**  
   - Every session begins with loading the relevant docs:  
     - `context.md`  
     - `collaboration_protocol.md`  
     - `cursor.config.md`  
     - and this file.  
   - Maintain full awareness of the repo’s purpose before executing new code.


## 2. Coding Standards
- **Language & Framework:**  
  TypeScript + React (Next.js). Prefer functional components.

- **Styling:**  
  Tailwind CSS + shadcn/ui. UIs must be *modern, clean, responsive, minimal*.

- **File Structure:**  
  Follow `/app/`, `/components/`, `/lib/`, `/config/`, `/docs/` conventions.  
  Keep components modular and single-purpose.  

- **Data:**  
  Use Firebase (Auth + Firestore) or Supabase for persistence.  
  Never hard-code secrets or IDs. Always read from `.env.local`.  

- **Testing:**  
  Maintain active unit + integration tests.  
  Use Jest or Vitest with React Testing Library.  
  Tests are generated *alongside* features, not afterward.  
  Reference `/prompts/system/06_handoff_loop.md` for final validation flow.

- **Logging & Errors:**  
  Console.log only for local debugging; use structured error handling in production.  
  Cursor should describe how errors are caught, surfaced, and logged.

- **Commits:**  
  Use clear prefixes:  
  `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `checkpoint:`.  
  Each confirmed phase ends with a `checkpoint:` commit and phase summary.


## 3. Interface Development
- Treat UI as part of each build phase, not an afterthought.  
- Define expected UI behavior and layout before coding.  
- Prioritize clarity, information hierarchy, and intuitive navigation.  
- Always preview live; never approve blind code.  
- Log all visual iterations to `/docs/iteration_log.md`.  


## 4. AI Interaction Discipline
- Use the **Prompt Glossary** shorthand for speed (e.g. `-s`, `-trace`, `-review`).  
- When generating or modifying code:  
  1. Ask Cursor to explain its reasoning.  
  2. Confirm understanding.  
  3. Execute plan step-by-step.  
  4. Run the **Testing Loop Template** to validate results.

- Cursor must:  
  - Self-score output (1–10) on correctness and maintainability.  
  - Suggest at least one improvement post-build.  
  - Reference templates explicitly when executing complex workflows.

**Template References:**  
- Building Loop: `/prompts/system/03_building_loop.md`  
- Testing Loop: `/prompts/system/06_handoff_loop.md`  
- Reflection Loop: `/prompts/system/05_reflection_loop.md`  


## 5. Debugging Workflow
1. Run the code.  
2. Copy console errors or logs into Cursor.  
3. Use `04_debugging` literal prompts for clarity (`diagnose_issue.md`, `surgical_fix.md`).  
4. If not resolved after two repair loops → revert to last stable checkpoint.  
5. Document all findings in `/docs/reflections/[phase].md`.


## 6. Documentation Expectations
- Update `source_of_truth.md` with new features, endpoints, and data models.  
- Log all UI changes in `iteration_log.md`.  
- Summarize weekly outcomes in `weekly_report.md`.  
- Reflect after each phase — short and specific is best.  


## 7. AI Collaboration Rules (Gauntlet Mode)
AI operates as a co-engineer with structured authority levels.  

**1. Pre-Build:**  
- Cursor must confirm interpretation of goals and context.  
- Use literal prompt → validate → begin execution only after confirmation.

**2. During Build:**  
- Follow the Building Loop structure strictly.  
- Reference the PRD and phase checklist every 2–3 turns.  
- Request mid-phase checkpoints if context window exceeds 85%.  

**3. Post-Build:**  
- Use Reflection Loop Template to summarize learnings.  
- Verify tests with Testing Loop Template.  
- Confirm documentation updates are complete.

**4. Behavior Discipline:**  
- Cursor never proceeds without confirmation after presenting a plan.  
- Always reason explicitly about dependencies, data flow, and test scope.  
- Reflective learning captured in `/docs/reflections/` informs future prompts.


## 8. Ethos
> “Think slowly, code quickly.”  
Clarity beats cleverness.  
Clean, boring, and functional is always preferred over complex and elegant.  

---  
**System Integration Summary:**  
- Literal prompts connect this file to actionable execution.  
- Cursor Context Management Playbook governs continuity and reflection.  
- Gauntlet Mode ensures structured automation and clarity under pressure.