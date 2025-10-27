'use client'

import { motion, useAnimationControls, type Transition } from 'framer-motion'
import { useMemo } from 'react'
import { foundryMotion } from './motion.config'

export type UseMotionOptions = {
    preset?: keyof typeof foundryMotion.variants
    transition?: Partial<Transition>
}

export function useMotion(options: UseMotionOptions = {}) {
    const controls = useAnimationControls()
    const preset = options.preset || 'fadeIn'
    const base: Transition = {
        duration: (foundryMotion.duration.base / 1000),
        ease: foundryMotion.ease.inOut,
        ...options.transition,
    }

    const variants = useMemo(() => foundryMotion.variants[preset], [preset])

    return {
        motion,
        controls,
        variants,
        transition: base,
        staggerChildren: (delay: number = foundryMotion.stagger.small) => ({
            transition: { staggerChildren: delay }
        }),
    }
}
