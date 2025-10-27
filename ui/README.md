# Foundry UI Layer

This folder defines universal, tech-agnostic design primitives for all Foundry projects.

## Purpose
- Provide consistent color tokens, typography scales, and spacing.
- Define motion primitives (fade, slide, stagger, spring timing).
- Serve as the neutral foundation for project-specific design layers.

## Structure
core/ui/
├── tokens/              # Universal color, spacing, typography, motion tokens
├── mixins/              # Cross-platform animation and theme utilities
└── README.md

## Next Steps
- Integrate MattBarge Brand Guidelines here.
- Create `tokens/colors.json`, `tokens/motion.json`.
- Add `mixins/motion-primitives.js` to define reusable animation presets.