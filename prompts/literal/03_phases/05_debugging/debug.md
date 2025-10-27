> Note: Foundry Core v2 prefers super-phase prompts in `/prompts/literal/02_superphases/` (Plan/Build/Reflect). This file remains available as a granular option.

**When to use**: After completing a module’s build phase to verify functionality, stability, and completeness before reflection or handoff.  
**When not to use**: During active development or while addressing a critical production bug — use “Intense Fix” or “Surgical Fix” instead.

Let’s perform a **Post-Build Debugging Review** using the Debugging Loop Template.  
Validate that all checklist items from `/docs/foundation/dev_checklist.md` have been satisfied, run relevant unit and integration tests, and manually verify key flows.
Generate a regression checklist for this phase based on `/docs/operations/00_regression-checklist.md` and perform a regression verification to confirm that all major features from prior phases still function as intended.    
Summarize results clearly — list ✅ working features, ⚠️ issues discovered (with severity), and 🧩 fixes applied or deferred.  
Conclude with a stability confidence rating (High / Medium / Low) and confirm readiness to proceed to the Reflection phase.  
Store the resulting debug report under:  
`/docs/operations/phases/phase-XX-04-debug.md`

**Debugging Loop Template reference**: `/prompts/system/04_debugging_loop.md`