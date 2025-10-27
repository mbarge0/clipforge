import type { Page } from 'playwright'

export type MotionVerification = {
    route?: string
    motionDetected: boolean
    durationMs: number
    success: boolean
}

export async function verifyMotionPlayback(page: Page, timeoutMs: number = 1200): Promise<MotionVerification> {
    try {
        const result = await page.evaluate(async (maxMs: number) => {
            const el = document.querySelector('[data-motion]') as HTMLElement | null
            if (!el) {
                return { motionDetected: false, durationMs: 0, success: false }
            }
            let detected = false
            const start = performance.now()
            // Sample initial visual state
            const rect0 = el.getBoundingClientRect()
            const cs0 = getComputedStyle(el)
            const op0 = Number(cs0.opacity || '1')
            const tf0 = cs0.transform || ''

            return await new Promise<MotionVerification>((resolve) => {
                let rafId = 0
                const tick = () => {
                    const active = el.getAttribute('data-motion-active') === '1'
                    if (active) detected = true
                    const now = performance.now()
                    if (!active || (now - start) > maxMs) {
                        const durationMs = Math.round(now - start)
                        // Sample final state
                        const rect1 = el.getBoundingClientRect()
                        const cs1 = getComputedStyle(el)
                        const op1 = Number(cs1.opacity || '1')
                        const tf1 = cs1.transform || ''
                        const moved = Math.abs(rect1.top - rect0.top) > 0.5 || Math.abs(rect1.left - rect0.left) > 0.5
                        const opacityChanged = Math.abs(op1 - op0) > 0.02
                        const transformChanged = tf0 !== tf1
                        const changed = moved || opacityChanged || transformChanged
                        resolve({ motionDetected: detected || changed, durationMs, success: (detected || changed) })
                        return
                    }
                    rafId = requestAnimationFrame(tick)
                }
                rafId = requestAnimationFrame(tick)
                setTimeout(() => {
                    try { cancelAnimationFrame(rafId) } catch { }
                }, maxMs + 50)
            })
        }, timeoutMs)
        return result
    } catch {
        return { motionDetected: false, durationMs: 0, success: false }
    }
}


