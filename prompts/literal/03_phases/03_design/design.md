> Note: Foundry Core v2 prefers super-phase prompts in `/prompts/literal/02_superphases/` (Plan/Build/Reflect). This file remains available as a granular option.

**When to use**: At the start of a new Supermodule or major visual overhaul (e.g., UI refresh). Use this to define layout, styling, and component design before implementation begins.  
**When not to use**: When code for the design already exists and you’re only refining interactions or fixing minor UI bugs — use a “UI Review” or “Adjust Existing Design” prompt instead.

Let’s begin implementing this **Design Phase** using the **Design Loop Template**.  
Reference the PRD and architecture plan for this phase, and follow the structure in the template.  
Focus on defining **what the interface should look and feel like** — layout, spacing, color, motion, and accessibility — not code yet.  
Include sketches or textual wireframes, component hierarchy, and state descriptions (hover, active, focus, disabled).  
Pause before handing off to Build if any assumption about layout, color system, or responsiveness needs clarification.

**Design Loop Template reference**: `/prompts/system/09_design_loop.md`