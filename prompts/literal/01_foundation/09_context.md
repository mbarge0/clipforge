**When to use:**  
When starting a new project, beginning a new week, or reaching a major checkpoint (MVP, feature completion, post-refactor). Use this to generate or refresh the canonical `context.md` file that summarizes your project’s current state and architecture.

**When not to use:**  
When performing small documentation edits (update the file manually instead).  
When debugging — use the “Debugging Loop” instead.

---

Let’s create a project context document using the Context Loop Template.
Your goal is to generate or update `/docs/context.md`, the single source of truth for project context across AI tools (Cursor, ChatGPT, Gemini).

Use the Context Loop Template to:
1. Summarize the project’s purpose, architecture, and current sprint.  
2. List all active features, tasks, and prompts in use.  
3. Document current blockers, known issues, and checkpoint status.  
4. Validate that the structure follows the 6-section context format before finalizing.

When the context snapshot feels complete and accurate, write the result to `/docs/context.md`.

**Context Loop Template reference:** `/prompts/system/foundation/09_context_loop.md`

All foundation documents (PRD, Architecture, Dev Checklist) are located in the `/docs/foundation` folder.