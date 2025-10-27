# ClipForge UI Guidelines

Version: 1.0  
Scope: Global product UI system (renderer + design references)

---

## 1) Overview & Philosophy

- Modern, minimal, calm: influenced by Linear, Vercel, Notion, and shadcn/ui.
- Local-first desktop editor: prioritize clarity, fast cognition, minimal chrome.
- Primary goals: legibility, focus on timeline and preview, tactile interactions.
- Implementation: Tailwind with CSS variables for theming; dark mode first with light mode parity.

Design tenets
- Reduce visual noise (muted neutrals, strong hierarchy via type/weight/contrast).
- Use motion for meaning (subtle, consistent transitions; no gratuitous animation).
- Accessibility is non-negotiable (WCAG AA+ targets, keyboard operability).

---

## 2) Color System

Use CSS variables with Tailwind to theme both light and dark modes.

Tokens (CSS variables)
```css
:root {
  /* Brand */
  --color-brand: #6E56CF; /* violet-600 */
  --color-brand-foreground: #ffffff;

  /* Neutrals */
  --color-bg: #0B0B0D;
  --color-bg-elevated: #121216;
  --color-surface: #18181C;
  --color-border: #2A2A31;
  --color-muted: #9CA3AF;
  --color-foreground: #E5E7EB;

  /* States */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger:  #EF4444;
  --color-info:    #3B82F6;
}

.light {
  --color-bg: #F8FAFC;
  --color-bg-elevated: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-border: #E5E7EB;
  --color-muted: #6B7280;
  --color-foreground: #0F172A;
}
```

Tailwind mapping (example)
```js
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
        fg: 'var(--color-foreground)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)'
      },
      borderColor: {
        DEFAULT: 'var(--color-border)'
      }
    }
  }
}
```

Rationale
- Neutral surfaces place attention on video content and timeline.
- Brand used sparingly (primary actions, selection, focus ring).

---

## 3) Typography

Font families
- Inter (primary UI), Monospace for code/timecodes

Scale and usage
- Display (H1): 28–32 px / semibold for top-level headings
- H2: 22–24 px / semibold
- H3: 18–20 px / medium
- Body: 14–16 px / regular
- Caption: 12–13 px / regular, muted

Tailwind examples
```md
- H1: text-[28px] md:text-[32px] font-semibold tracking-[-0.01em]
- H2: text-[24px] font-semibold
- H3: text-[18px] font-medium
- Body: text-[14px] md:text-[16px] text-fg
- Caption: text-[12px] text-muted
```

Line-height guidance
- Headings 1.2, body 1.5, captions 1.4.

---

## 4) Spacing & Layout

Spacing scale
- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Radii and elevation
- Radius: xs 4, sm 6, md 8, lg 12
- Shadows: none, sm, md (soft, low-contrast)

Containers and density
- Content max-widths: narrow 720px, default 960px, wide 1200px
- Density: comfortable by default; compact in timeline grids

Layout grid
- App frame: Sidebar (media) / Main (timeline bottom, preview top-right)
- Use CSS grid with fixed header toolbar; timeline takes remaining height

---

## 5) Interaction States

States per interactive element
- Hover: subtle elevation or border contrast increase
- Focus: 2px focus ring using brand color `outline-[--color-brand]` + offset
- Active: pressed state reduces elevation and slightly darkens surface
- Disabled: reduced opacity (60%), cursor-not-allowed, no hover/active changes

Example (Button)
```css
.btn {
  transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
}
.btn:hover   { filter: brightness(1.05); }
.btn:active  { filter: brightness(0.95); }
.btn:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
```

---

## 6) Motion & Animation

Defaults
- Duration: 150ms (fast interactions), 200–250ms (modals/overlays)
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (standard)
- Transform origin: center for buttons, edge for panels/menus

Accessibility
- Respect `prefers-reduced-motion: reduce` and disable non-essential animations

---

## 7) Accessibility

Contrast
- Minimum AA: text/background ≥ 4.5:1; large text ≥ 3:1
- Interactive components maintain ≥ 3:1 in default and hover

Keyboard
- All interactive elements focusable; order follows visual layout
- Provide visible focus ring; avoid removing outlines

Screen readers
- ARIA labels for icon-only buttons (e.g., play, split, delete)
- Live regions for export progress updates

---

## 8) Component Tokens (Tailwind-oriented)

Button
- Sizes: sm (h-8 px-3), md (h-9 px-4), lg (h-10 px-5)
- Variants:
  - Primary: bg-brand text-white hover:brightness-105 active:brightness-95
  - Secondary: bg-surface text-fg border border-border
  - Ghost: bg-transparent text-fg hover:bg-surface/60
- Radius: md (8)
- Icon button: square h-9 w-9; center icons 16–18px

Card
- Padding: p-4 md:p-6
- Background: surface; Border: border
- Radius: lg (12); Shadow: sm
- Header: mb-3 text-[14px] font-medium text-muted

Input (TextField)
- Height: h-9; Padding: px-3
- Background: bg-elevated; Text: fg; Placeholder: muted
- Border: border; Focus: ring-brand 2px
- Invalid: border-danger; Helper text: caption muted/danger

Modal (Dialog)
- Backdrop: bg-black/50; Blur: md optional
- Panel: bg-surface, p-6, rounded-lg, shadow-md
- Title: H3; Description: body muted
- Motion: opacity/scale 200ms

Additional primitives (brief)
- Tooltip: small, high-contrast surface, 12px text, 4px radius
- Toast: surface with border, title + body, success/warn/danger accents
- Tabs/Segmented: underline/indicator using brand; 8px radius
- Toolbar: sticky header height 48–56px, subtle bottom border
- Sidebar: width 280–320px; resizable edge border

---

## 9) Responsive Breakpoints

Tailwind
- sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px

Behavior
- Typography scales one step up at md
- Sidebar collapses under md; modal becomes full-screen on small screens (if used)
- Controls wrap to second row in toolbar when narrow

---

## 10) Version History

- v1.0 (current): Initial system with tokens and component specs for MVP

(End)
