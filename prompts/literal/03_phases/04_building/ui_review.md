> Note: Foundry Core v2 prefers super-phase prompts in `/prompts/literal/02_superphases/` (Plan/Build/Reflect). This file remains available as a granular option.

**When to use**: After completing a Build phase and passing functional smoke tests, before entering Testing or Debug.  
**When not to use**: During early development or active building — only use once the UI is implemented and stable.  

Let’s begin the UI Review Phase using the UI Review Loop Template.
Reference the Design Spec (/docs/operations/phases/phase-XX-02-design.md) and the UI Guidelines (/docs/operations/ui-guidelines.md).

Focus on verifying that the implemented interface matches the approved design — layout, spacing, colors, typography, motion, and accessibility.
Identify any visual or behavioral inconsistencies, accessibility violations, or brand mismatches.
Summarize findings in a concise checklist confirming compliance or noting revisions before Debug.

UI Review Loop Template reference: /prompts/system/12_ui_review_loop.md