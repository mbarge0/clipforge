// Foundry Motion System — motion.config.ts
// Centralized presets for durations, easings, and stagger timings.

export const foundryMotion = {
    duration: {
        fast: 120,
        base: 200,
        slow: 300,
    },
    ease: {
        inOut: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
        out: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
        in: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
    },
    stagger: {
        small: 0.04,
        medium: 0.08,
        large: 0.12,
    },
    variants: {
        fadeInUp: {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 8 },
        },
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1.0 },
            exit: { opacity: 0, scale: 0.98 },
        },
    },
} as const

export type FoundryMotionConfig = typeof foundryMotion

// Export a simple function used by motion:test
export function printFoundryMotionSummary() {
    console.log('✅ Foundry Motion loaded:', JSON.stringify({
        duration: foundryMotion.duration,
        ease: foundryMotion.ease,
        stagger: foundryMotion.stagger,
        variants: Object.keys(foundryMotion.variants),
    }, null, 2))
}
