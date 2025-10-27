import fs from 'fs'
import path from 'path'

export function summarizeShowcase(latestDir = 'docs/showcase/latest') {
    const logPath = path.join(latestDir, 'showcase_log.json')
    if (!fs.existsSync(logPath)) throw new Error('No showcase_log.json found; run capture first')
    const entries: any[] = JSON.parse(fs.readFileSync(logPath, 'utf-8'))
    const startedAt = Date.now()
    const totalRoutes = entries.length
    const okCount = entries.filter(e => e.ok).length
    const failed = entries.filter(e => !e.ok)
    const videos = entries.filter(e => e.videoPath)
    const screenshots = entries.filter(e => e.screenshotPath)

    const summary = {
        runAt: new Date().toISOString(),
        totalRoutes,
        okCount,
        failedRoutes: failed.map(f => ({ route: f.route, url: f.url })),
        videos: videos.map(v => ({ route: v.route, file: path.relative(latestDir, v.videoPath) })),
        screenshots: screenshots.map(s => ({ route: s.route, file: path.relative(latestDir, s.screenshotPath) })),
        estimatedMs: Date.now() - startedAt,
    }

    const out = path.join(latestDir, 'showcase_summary.json')
    fs.writeFileSync(out, JSON.stringify(summary, null, 2))
    return { out, summary }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        const { out } = summarizeShowcase()
        console.log('✅ Showcase summary written:', out)
    } catch (e: any) {
        console.error('❌ Showcase summary failed:', e?.message || e)
        process.exit(1)
    }
}
