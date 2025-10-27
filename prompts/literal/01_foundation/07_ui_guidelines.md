**When to use**: At the **beginning of a new project** or when performing a **major visual redesign** that affects all modules and phases.  
**When not to use**: During a single-phase design or build process — this defines global design rules, not per-feature styles.  

Use this prompt to **generate the foundational UI Guidelines document** for the entire product.  
It should establish a consistent visual and interaction language that future Design, Build, and UI Review phases will reference.  

The generated document will be stored in:  
`/docs/operations/ui-guidelines.md`

This document should:
- Define a cohesive, scalable design system inspired by modern, minimal product interfaces (Linear, Vercel, Notion, shadcn/ui).  
- Include global tokens for color, typography, spacing, motion, and accessibility.  
- Provide component-level tokens (e.g., Button, Card, Modal, Input) for consistent implementation in Tailwind.  
- Serve as the *single source of truth* for all design and UI review phases going forward.

**System Prompt reference:** `/prompts/system/foundation/07_ui_guidelines_loop.md`