import { verifyMotionPlayback } from '../foundry-motion/motion.verify.js'
import { runCapture, runVerify } from './adapters/playwright_local.js'
import { selfHeal } from './heal.js'
import type { EvolvrConfig } from './interfaces.js'
import { loadAdaptiveConfig, updateMemoryAfterRun } from './memory.js'

export async function evolvrLoop(config: EvolvrConfig) {
    // Load adaptive defaults from prior patches/memory
    const { config: adapted, memory } = loadAdaptiveConfig(config)

    await runCapture(adapted)
    let results = await runVerify(adapted)
    // Motion verification (best-effort, does not fail build)
    try {
        const { chromium } = await import('playwright')
        const browser = await chromium.launch({ headless: true })
        const context = await browser.newContext()
        const page = await context.newPage()
        for (const route of adapted.routes) {
            try {
                const url = `${adapted.baseUrl}${route}`
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: adapted.timeouts?.goto || 20000 })
                const mv = await verifyMotionPlayback(page, 1200)
                results.push({ route, motionDetected: mv.motionDetected, motionDurationMs: mv.durationMs, motionSuccess: mv.success, status: 'info' })
            } catch { }
        }
        await browser.close()
    } catch { }
    let allOk = results.every(r => r.status === 'success')
    if (!allOk) {
        const { config: healed, patch } = await selfHeal(adapted)
        if (patch) {
            console.log('🩺 Self-healing pass: adjusting config and re-verifying…')
            await runCapture(healed)
            results = await runVerify(healed)
            allOk = results.every(r => r.status === 'success')
            console.log(allOk ? '🩺 Self-healing pass ✓' : '🩺 Self-healing pass failed')
            updateMemoryAfterRun(memory, healed, allOk, patch.reasons)
        } else {
            updateMemoryAfterRun(memory, adapted, allOk)
        }
    } else {
        updateMemoryAfterRun(memory, adapted, allOk)
    }
    console.log(allOk ? '✅ All checks passed.' : '🚨 Verification failed.')
    process.exit(allOk ? 0 : 1)
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`
if (isDirectRun) {
    (async () => {
        const cfg: EvolvrConfig = {
            baseUrl: process.env.EVOLVR_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            routes: (process.env.EVOLVR_ROUTES ? process.env.EVOLVR_ROUTES.split(',') : ['/']).map(r => r.trim()),
            timeouts: { goto: Number(process.env.EVOLVR_GOTO_MS || 20000), ready: Number(process.env.EVOLVR_READY_MS || 8000) },
            recordSeconds: Number(process.env.EVOLVR_RECORD_S || 10),
            headless: process.env.EVOLVR_HEADLESS ? process.env.EVOLVR_HEADLESS !== '0' : true,
            requireChatVisible: process.env.EVOLVR_REQUIRE_CHAT ? process.env.EVOLVR_REQUIRE_CHAT !== '0' : true,
            retryMs: Number(process.env.EVOLVR_RETRY_MS || 5000),
            maxRetries: Number(process.env.EVOLVR_MAX_RETRIES || 1),
            selectors: {
                loginReady: ['main', 'body'],
                canvasReady: ['main'],
                chatVisible: "[data-testid='chat-drawer'], [aria-label*='chat' i]",
            },
        }
        await evolvrLoop(cfg)
    })()
}

