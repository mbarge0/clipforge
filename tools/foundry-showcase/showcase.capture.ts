import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
import { showcaseConfig } from './showcase.config'

function ensureDirs(baseLatest: string, doArchive: boolean) {
    const latest = path.resolve(baseLatest)
    const archiveRoot = path.resolve('docs/showcase/archive')
    fs.mkdirSync(path.dirname(latest), { recursive: true })
    if (doArchive && fs.existsSync(latest)) {
        const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)
        const dest = path.join(archiveRoot, stamp)
        fs.mkdirSync(dest, { recursive: true })
        for (const entry of fs.readdirSync(latest)) {
            fs.renameSync(path.join(latest, entry), path.join(dest, entry))
        }
    }
    fs.mkdirSync(latest, { recursive: true })
    return latest
}

export async function runShowcaseCapture() {
    const latest = ensureDirs('docs/showcase/latest', showcaseConfig.archive)
    const logPath = path.join(latest, 'showcase_log.json')
    const shotsDir = path.join(latest, 'screenshots')
    const vidsDir = path.join(latest, 'videos')
    fs.mkdirSync(shotsDir, { recursive: true })
    fs.mkdirSync(vidsDir, { recursive: true })

    const skipVideo = process.env.SHOWCASE_SKIP_VIDEO === '1'
    const browser = await chromium.launch({ headless: true })
    const summary: any[] = []

    for (const r of showcaseConfig.routes) {
        const url = `${showcaseConfig.baseUrl}${r.route}`
        const context = await browser.newContext({
            recordVideo: skipVideo ? undefined : { dir: vidsDir, size: showcaseConfig.resolution },
            viewport: showcaseConfig.resolution,
        })
        const page = await context.newPage()
        const startedAt = Date.now()
        let videoPath: string | null = null
        let screenshotPath: string | null = null
        let ok = true
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
            await page.waitForTimeout(r.durationMs ?? 4000)
            screenshotPath = path.join(shotsDir, `${encodeURIComponent(r.route)}.png`)
            await page.screenshot({ path: screenshotPath, fullPage: true })
        } catch (e: any) {
            ok = false
        }
        try {
            const v = await page.video()
            const raw = v ? await v.path() : undefined
            await context.close()
            if (raw && fs.existsSync(raw) && !skipVideo) {
                const dest = path.join(vidsDir, `${encodeURIComponent(r.route)}.webm`)
                fs.copyFileSync(raw, dest)
                videoPath = dest
            }
        } catch { }
        const endedAt = Date.now()
        summary.push({ route: r.route, url, ok, durationMs: endedAt - startedAt, screenshotPath, videoPath })
    }

    await browser.close()
    fs.writeFileSync(logPath, JSON.stringify(summary, null, 2))
    return { latest, logPath, summary }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    runShowcaseCapture().then(() => {
        console.log('✅ Showcase capture complete.')
    }).catch((e) => {
        console.error('❌ Showcase capture failed:', e?.message || e)
        process.exit(1)
    })
}
