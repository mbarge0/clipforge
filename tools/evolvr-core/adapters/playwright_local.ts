import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
import type { EvolvrConfig, EvolvrResult } from '../interfaces.js'

function semanticName(route: string): string {
    if (route.includes('/login')) return 'login_screen'
    if (route.includes('/c/')) return 'canvas_app'
    return route.replace(/[/?=&]/g, '_').replace(/_+/g, '_').replace(/^_/, '') || 'route_custom'
}

export async function runCapture(config: EvolvrConfig): Promise<void> {
    const outDir = config.outputDir || path.resolve(`docs/evidence/archive/${Date.now()}`)
    const latestDir = config.latestDir || path.resolve('docs/evidence/latest')
    fs.mkdirSync(outDir, { recursive: true })
    fs.mkdirSync(latestDir, { recursive: true })
    try { for (const e of fs.readdirSync(latestDir)) fs.rmSync(path.join(latestDir, e), { recursive: true, force: true }) } catch { }

    const shotsDir = path.join(outDir, 'screenshots')
    const vidsDir = path.join(outDir, 'videos')
    const latestShots = path.join(latestDir, 'screenshots')
    const latestVids = path.join(latestDir, 'videos')
    fs.mkdirSync(shotsDir, { recursive: true })
    fs.mkdirSync(vidsDir, { recursive: true })
    fs.mkdirSync(latestShots, { recursive: true })
    fs.mkdirSync(latestVids, { recursive: true })

    const browser = await chromium.launch({ headless: config.headless ?? true })
    const results: any[] = []
    const maxRetries = Number.isFinite(config.maxRetries as number) ? Number(config.maxRetries) : 1
    const retryMs = Number.isFinite(config.retryMs as number) ? Number(config.retryMs) : 5000
    for (const route of config.routes) {
        const url = `${config.baseUrl}${route}`
        const name = semanticName(route)
        let hasVideo = false
        let canvasReady = false
        let loginSucceeded = false
        let chatVisible = false

        let attempt = 0
        let degraded = false
        let gotoTimeoutMs = Number(config.timeouts?.goto || 20000)
        let readyTimeoutMs = Number(config.timeouts?.ready || 8000)
        let lastError: any = null

        while (attempt <= maxRetries) {
            attempt++
            const context = await browser.newContext({ recordVideo: { dir: vidsDir, size: { width: 1280, height: 720 } } })
            const page = await context.newPage()
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: gotoTimeoutMs })
                const sels = config.selectors || {}
                if (route.includes('/login')) {
                    const list = (sels.loginReady && sels.loginReady.length ? sels.loginReady : ["[data-testid='auth-form']", 'form'])
                    await Promise.race(list.map(sel => page.waitForSelector(sel, { timeout: readyTimeoutMs })))
                    loginSucceeded = true
                } else {
                    const list = (sels.canvasReady && sels.canvasReady.length ? sels.canvasReady : ["[data-testid='canvas-shell']", '.konvajs-content'])
                    await Promise.race(list.map(sel => page.waitForSelector(sel, { timeout: readyTimeoutMs })))
                    canvasReady = true
                    const chatSel = sels.chatVisible || "[data-testid='chat-drawer'], [aria-label*='chat' i]"
                    if (config.requireChatVisible) {
                        try { chatVisible = await page.locator(chatSel).isVisible() } catch { chatVisible = false }
                    }
                }

                // Screenshot
                const shot = path.join(shotsDir, `${name}.png`)
                await page.screenshot({ path: shot, fullPage: true })
                fs.copyFileSync(shot, path.join(latestShots, `${name}.png`))
                await page.waitForTimeout(3000)
                await page.waitForTimeout((config.recordSeconds || 10) * 1000)
                const v = await page.video()
                const vPath = v ? await v.path() : undefined
                await context.close()
                await new Promise(r => setTimeout(r, 500))

                if (vPath && fs.existsSync(vPath)) {
                    const st = fs.statSync(vPath)
                    if (st.size > 10 * 1024) {
                        fs.copyFileSync(vPath, path.join(latestVids, `${name}.webm`))
                        hasVideo = true
                    }
                }

                // Success path → break out of retry loop
                lastError = null
                break
            } catch (e: any) {
                lastError = e
                // Timeout or readiness failure → adjust and retry once
                if (attempt <= maxRetries) {
                    gotoTimeoutMs = Math.max(gotoTimeoutMs, 40000)
                    readyTimeoutMs = Math.max(readyTimeoutMs, 15000)
                    console.log(`🩺 Self-healing: increased goto timeout to ${gotoTimeoutMs} ms and ready timeout to ${readyTimeoutMs} ms for ${route} — retrying…`)
                } else {
                    // Degraded path: take whatever screenshot possible and continue
                    try {
                        const shot = path.join(shotsDir, `${name}.png`)
                        await page.screenshot({ path: shot, fullPage: true }).catch(() => { })
                        fs.copyFileSync(shot, path.join(latestShots, `${name}.png`))
                    } catch { }
                    degraded = true
                }
                try { await context.close() } catch { }
            }
        }

        const status = (route.includes('/login') ? (loginSucceeded && hasVideo) : (canvasReady && hasVideo)) ? 'success' : (hasVideo ? 'partial' : 'fail')
        results.push({ route, name, canvasReady, loginSucceeded, chatVisible, hasVideo, degraded, status })
    }

    fs.writeFileSync(path.join(outDir, 'verification.json'), JSON.stringify(results, null, 2))
    fs.copyFileSync(path.join(outDir, 'verification.json'), path.join(latestDir, 'verification.json'))
    await browser.close()
}

export async function runVerify(_config: EvolvrConfig): Promise<EvolvrResult[]> {
    const latestDir = path.resolve('docs/evidence/latest')
    const manifest = path.join(latestDir, 'verification.json')
    const raw = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) : []
    const out: EvolvrResult[] = raw.map((r: any) => ({
        route: r.route,
        canvasReady: !!r.canvasReady,
        chatVisible: !!r.chatVisible,
        loginSucceeded: !!r.loginSucceeded,
        hasVideo: !!r.hasVideo,
        status: r.status || 'fail',
    }))
    fs.writeFileSync(path.join(latestDir, 'verification_summary.json'), JSON.stringify(out, null, 2))
    fs.writeFileSync(path.join(latestDir, 'summary_min.json'), JSON.stringify(out.map(o => ({ route: o.route, canvasReady: !!o.canvasReady, chatVisible: !!o.chatVisible, hasVideo: !!o.hasVideo, status: o.status })), null, 2))
    return out
}

