# Foundry Motion System

A lightweight, reusable animation scaffold for Foundry-based projects. It standardizes durations, easing, and common variants while staying framework-agnostic inside Next.js.

## Purpose
- Provide consistent, professional motion across apps
- Offer presets for common transitions (fade, fade-up, scale-in)
- Keep APIs simple via a small hook and wrapper component

## Files
- `tools/foundry-motion/motion.config.ts` — durations, easings, stagger, and variants
- `tools/foundry-motion/useMotion.ts` — hook that wraps Framer Motion with defaults
- `tools/foundry-motion/MotionWrapper.tsx` — simple page/section wrapper
- `tools/foundry-motion/motion.verify.ts` — motion playback verification utility

## Installation
- Already included in Foundry Core v2. Ensure `framer-motion` is installed (dependency in `package.json`).
- Optional validation: `pnpm motion:test` to load config.

## Usage
### Wrap a page or section
```tsx
import MotionWrapper from '@/tools/foundry-motion/MotionWrapper'

export default function Page() {
  return (
    <MotionWrapper preset="fadeInUp">
      <section>Content</section>
    </MotionWrapper>
  )
}
```

### Hook usage for custom components
```tsx
import { useMotion } from '@/tools/foundry-motion/useMotion'

export function Card({ children }: { children: React.ReactNode }) {
  const { motion, variants, transition } = useMotion({ preset: 'scaleIn' })
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={variants as any} transition={transition}>
      {children}
    </motion.div>
  )
}
```

### Animate on mount
```tsx
import { useEffect } from 'react'
import { useMotion } from '@/tools/foundry-motion/useMotion'

export function Notice({ text }: { text: string }) {
  const { motion, controls, variants, transition } = useMotion({ preset: 'fadeIn' })
  useEffect(() => { controls.start('animate') }, [controls])
  return (
    <motion.div initial="initial" animate={controls} variants={variants as any} transition={transition}>
      {text}
    </motion.div>
  )
}
```

## Behavioral Verification
- Motion elements are tagged via `MotionWrapper` with `data-motion` and `data-motion-active` attributes during playback.
- Visual/Evolvr loops call `verifyMotionPlayback(page)` which:
  - Polls for active playback up to ~1.2s
  - Returns `{ motionDetected, durationMs, success }`
- Results are appended to verification summaries (best-effort). Absence of motion does not fail verification.

## Defaults
- Durations: 120ms (fast), 200ms (base), 300ms (slow)
- Easing: custom cubic-bezier in/out tuned for modern, smooth motion
- Variants: `fadeIn`, `fadeInUp`, `scaleIn`

## Notes
- Keep animations subtle (100–300ms) and accessible
- Prefer motion for clarifying state changes, not decoration
