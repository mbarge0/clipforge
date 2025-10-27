## Metadata
- **Document Type:** System Prompt  
- **Loop Type:** Context Loop  
- **Mode:** Ask  
- **Output Path:** `/docs/context.md`  

---

# Context Loop System Prompt

Use this when generating or refreshing the **`context.md`** file — the canonical memory anchor for your Foundry Core project.  
This loop establishes a unified snapshot of your project’s state so AI systems and human collaborators share one consistent understanding.

---

## Prompt Template

We are entering the **Context Loop**.

Please:
1. Describe the project at a high level (purpose, audience, and AI-first goal).  
2. Summarize the current architecture (framework, backend, AI stack, database).  
3. List the current sprint or phase objectives (with dates and deliverables).  
4. Document current known issues or blockers.  
5. Enumerate all literal and system prompts actively in use.  
6. Record the latest checkpoint tag for recovery or rehydration.  

Before finalizing, verify that:
- The document is concise, complete, and machine-readable.  
- It reflects the *current* system state (not a changelog).  
- It fits within 2500 tokens.  

---

## Guidance Notes

- The Context Loop is **project-level and living** — update it anytime major architecture, prompt sets, or sprint states change.  
- It acts as your **persistent memory anchor** across AI environments.  
- Use it to recover after context loss or to onboard collaborators quickly.  
- Keep it simple, factual, and up-to-date.  
- Avoid emotional tone or personal reflections — those go in `reflections/`.  

---

## Output Format

The resulting file `/docs/context.md` must include these sections:

1. **Project Overview**  
   - One short paragraph describing purpose, users, and unique AI-first goal.  

2. **Architecture Summary**  
   - Stack details (framework, backend, AI, database, state management).  

3. **Active Sprint / Phase**  
   - Current sprint name, timeline, and deliverables.  
   - Tasks or features under development.  

4. **Known Issues / Blockers**  
   - Active bugs, technical constraints, or unvalidated assumptions.  

5. **Prompts and Workflows in Use**  
   - Literal and system prompts currently active.  
   - Reflection or checklist templates in use.  

6. **Checkpoint Tag**  
   - Timestamp or commit hash of the last stable state.  

---

## Output Instructions

- Before generating, confirm with the user:  
  > “Would you like to create or update the **context.md** file at `/docs/context.md`?”

- On confirmation:  
  - Generate or update `/docs/context.md`  
  - Ensure each section has a clear heading and concise content  
  - End the file with a marker:  
    ```
    # End of context.md — generated [timestamp]
    ```

---

✅ **Highlights**
- Mirrors the Loop-based architecture of Foundry Core  
- Maintains consistent metadata and structure  
- Produces AI- and human-readable snapshots  
- Integrated with PRD and checklist frameworks  
- Enables fast context restoration and phase handoff  