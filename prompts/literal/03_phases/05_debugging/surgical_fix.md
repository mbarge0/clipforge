> Note: Foundry Core v2 prefers super-phase prompts in `/prompts/literal/02_superphases/` (Plan/Build/Reflect). This file remains available as a granular option.

**When to use**: When a small, well-defined issue or bug needs to be fixed without affecting the rest of the system.
**When not to use**: When the underlying architecture needs major revision — use “Refactor” instead.

Let’s perform a surgical fix using the Debugging Loop Template.
Isolate the affected section of code and confirm the conditions that reproduce the issue.
Apply minimal, targeted changes, verify with tests, and document what was fixed.
Pause to confirm that the surrounding functionality remains unaffected.
**Debugging Loop Template reference**: /prompts/system/04_debugging_loop.md
