'use client'

import type { PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'
import { useMotion } from './useMotion'

export type MotionWrapperProps = PropsWithChildren<{
    preset?: Parameters<typeof useMotion>[0]['preset']
    className?: string
}>

export function MotionWrapper({ children, preset = 'fadeInUp', className }: MotionWrapperProps) {
    const { motion, variants, transition } = useMotion({ preset })
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        try { el.setAttribute('data-motion', '1'); el.setAttribute('data-motion-active', '1') } catch { }
        return () => { try { el.removeAttribute('data-motion'); el.removeAttribute('data-motion-active') } catch { } }
    }, [])
    return (
        <motion.div
            ref={ref}
            data-motion
            data-motion-active="1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants as any}
            transition={transition}
            onAnimationComplete={() => { try { ref.current?.setAttribute('data-motion-active', '0') } catch { } }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default MotionWrapper
