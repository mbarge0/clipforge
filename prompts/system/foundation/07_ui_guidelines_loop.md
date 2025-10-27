## Metadata
- **Category:** Foundation
- **Mode:** Designer
- **Output Path:** `/docs/operations/ui-guidelines.md`

---

# Foundation System Prompt — UI Guidelines

Use this prompt to generate a **comprehensive design system foundation** for the product.  
This serves as the authoritative global reference for all UI and UX standards across every phase and module.

---

## Prompt Template

We are creating the **UI Guidelines Foundation Document** for this project.

Please:
1. Establish a consistent design language aligned with modern minimalist SaaS interfaces (e.g., Linear, Vercel, Notion, shadcn/ui).  
2. Define and document the following categories clearly and concisely:

   ### 1. Color Palette
   - Use the color palette from Matt's personal brand at `/docs/operations/personal_brand.md`.
   - Include Tailwind-style tokens (`--color-primary`, `--color-bg`, etc.).
   - Provide both light and dark mode examples.

   ### 2. Typography
   - Font families, scale, weights, and usage guidelines (headings, body, captions).  
   - Include example Tailwind classes and line heights.

   ### 3. Spacing & Layout
   - Grid scale, spacing increments, border radius levels, and shadow tokens.  
   - Define layout density (compact, comfortable) and container breakpoints.

   ### 4. Interaction States
   - Define hover, focus, active, and disabled visual states for interactive elements.  
   - Include motion guidelines (e.g., transitions for hover/focus).

   ### 5. Motion & Animation
   - Specify default transition durations, easing curves, and motion accessibility rules.

   ### 6. Accessibility
   - Define minimum contrast ratios (WCAG AA/AAA).
   - Include keyboard navigation standards and focus ring guidelines.

   ### 7. Component Tokens
   - Provide base token specs for key UI primitives: **Button, Card, Input, Modal**.  
   - Include structure, padding, colors, and interactive state examples.

   ### 8. Responsive Design
   - Define standard Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).  
   - Describe how typography, spacing, and components adapt across screen sizes.

3. Output format:
   - Markdown document with clear section headers.
   - Use code blocks and tables where appropriate for tokens.
   - Include brief design rationale notes for each section.

---

## Guidance Notes
- This document will serve as the **foundation** for all design and UI Review phases.  
- Subsequent design specs (`/docs/operations/phases/phase-XX-02-design.md`) must reference these guidelines.  
- Keep the tone **professional, minimal, and product-driven** — prioritize clarity and usability.  
- This file can be updated version-by-version as design language evolves.

---

## Output Format

The resulting file should be stored as:

`/docs/operations/ui-guidelines.md`

and include the following top-level structure:

1. **Overview & Philosophy**
2. **Color System**
3. **Typography**
4. **Spacing & Layout**
5. **Interaction States**
6. **Motion & Animation**
7. **Accessibility**
8. **Component Tokens**
9. **Responsive Breakpoints**
10. **Version History**