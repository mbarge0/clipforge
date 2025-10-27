/**
 * tools/visual-verification-core/src/capture.ts
 *
 * Unified visual evidence capture script for ESM environments.
 * Works with project-level hooks (scripts/visual_hooks.ts)
 * to take targeted screenshots of key routes.
 */

import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import type { VisualConfig, VisualHooks } from "./interfaces.js";

/**
 * Main capture function (called by auto-run block below)
 */
export async function captureVisuals(config: VisualConfig, hooks: VisualHooks) {
    const phase = process.argv[2] || "build";
    const outDir =
        config.outputDir ||
        path.resolve(`docs/evidence/archive/${new Date().toISOString().replace(/[:T]/g, "-")}_${phase}`);
    const latestDir = config.latestDir || path.resolve("docs/evidence/latest");

    fs.mkdirSync(outDir, { recursive: true });
    // Clean latest folder to keep only newest evidence
    fs.mkdirSync(latestDir, { recursive: true });
    try {
        for (const entry of fs.readdirSync(latestDir)) {
            const p = path.join(latestDir, entry);
            try { fs.rmSync(p, { recursive: true, force: true }); } catch { }
        }
    } catch { }

    const browser = await chromium.launch({ headless: true });
    const videoDirArchive = path.join(outDir, "videos");
    const videoDirLatest = path.join(latestDir, "videos");
    fs.mkdirSync(videoDirArchive, { recursive: true });
    fs.mkdirSync(videoDirLatest, { recursive: true });

    const results: Array<Record<string, any>> = [];

    const screenshotsDir = path.join(outDir, "screenshots");
    const latestShots = path.join(latestDir, "screenshots");
    const latestVids = videoDirLatest;
    fs.mkdirSync(screenshotsDir, { recursive: true });
    fs.mkdirSync(latestShots, { recursive: true });
    fs.mkdirSync(latestVids, { recursive: true });

    const startAll = Date.now();

    function deriveName(url: string, routePath: string): string {
        if (url.includes('/login')) return 'login_screen';
        if (url.includes('/c/')) return 'canvas_app';
        const slug = routePath.replace(/[/?=&]/g, '_').replace(/_+/g, '_').replace(/^_/, '');
        return slug || 'route_custom';
    }

    for (const route of hooks.routes) {
        const url = `${config.baseUrl}${route}`;
        const name = deriveName(url, route);
        if (name === 'login_screen') console.log('🔐 Capturing Login Screen...');
        else if (name === 'canvas_app') console.log('🎨 Capturing Canvas Application...');
        else console.log(`➡️ Navigating to ${url}`);

        try {
            // Per-route context and page with 10s video recording
            let attempt = 0;
            let hasVideo = false;
            let videoBytes = 0;
            let ready = false;
            let loginSucceeded = false;
            let canvasReady = false;
            let chatVisible = false;

            while (attempt < 2 && !hasVideo) {
                attempt++;
                const context = await browser.newContext({
                    recordVideo: { dir: videoDirArchive, size: { width: 1280, height: 720 } },
                });
                const page = await context.newPage();

                await page.goto(url, { waitUntil: "networkidle", timeout: config.timeouts?.goto ?? 20000 });

                // Route-specific readiness
                try {
                    if (url.includes('/login')) {
                        await page.waitForSelector("[data-testid='auth-form'], form", { timeout: config.timeouts?.ready ?? 8000 });
                        ready = true;
                    } else {
                        await Promise.race([
                            page.waitForSelector("[data-testid='canvas-shell']", { timeout: config.timeouts?.ready ?? 8000 }),
                            page.waitForSelector(".konvajs-content", { timeout: config.timeouts?.ready ?? 8000 }),
                        ]);
                        ready = true;
                    }
                } catch {
                    ready = false;
                }

                // Canvas-only: ensure chat open via hooks
                if (name === 'canvas_app' && hooks.ensureChatOpen) {
                    try { await hooks.ensureChatOpen(page); } catch { }
                    try {
                        chatVisible = await page.locator('[data-testid="chat-drawer"], [aria-label*="AI Chat Drawer" i]').isVisible();
                    } catch { chatVisible = false }
                }

                // Screenshot
                const screenshotPath = path.join(screenshotsDir, `${name}.png`);
                await page.screenshot({ path: screenshotPath, fullPage: true });
                fs.copyFileSync(screenshotPath, path.join(latestShots, `${name}.png`));
                console.log(`📸 Captured screenshot for ${name}`);

                // 3s preroll, then 10s record
                await page.waitForTimeout(3000);
                console.log(`🎥 Started 10 s video for ${name}`);
                await page.waitForTimeout(10000);
                const v = await page.video();
                const vPathPre = v ? await v.path() : undefined;
                await context.close();
                await new Promise(r => setTimeout(r, 500));

                if (vPathPre && fs.existsSync(vPathPre)) {
                    try {
                        const st = fs.statSync(vPathPre);
                        videoBytes = st.size;
                        if (st.size > 10 * 1024) {
                            const dest = path.join(latestVids, `${name}.webm`);
                            fs.copyFileSync(vPathPre, dest);
                            hasVideo = true;
                            const mb = (st.size / (1024 * 1024)).toFixed(1);
                            console.log(`🎥 Video flushed ✓ (${mb} MB)`);
                        } else {
                            console.warn(`⚠️ Incomplete video for ${name} (skipping copy).`);
                        }
                    } catch { hasVideo = false }
                }

                if (!hasVideo && attempt < 2) console.log(`🔁 Retrying capture for ${name} due to incomplete video...`);

                // Record simple flags
                if (name === 'login_screen') loginSucceeded = ready;
                if (name === 'canvas_app') canvasReady = ready;
            }

            const status = (() => {
                if (name === 'login_screen') return (loginSucceeded && hasVideo) ? 'success' : (hasVideo ? 'partial' : 'fail');
                if (name === 'canvas_app') return (canvasReady && (chatVisible) && hasVideo) ? 'success' : ((canvasReady && hasVideo) ? 'partial' : 'fail');
                return (ready && hasVideo) ? 'success' : (hasVideo ? 'partial' : 'fail');
            })();

            results.push({ route, url, name, screenshot: path.join(latestShots, `${name}.png`), loginSucceeded, canvasReady, chatVisible, hasVideo, videoBytes, status });
            console.log(`📸 Captured ${route} (${status})`);
        } catch (err: any) {
            results.push({ route, url, status: "fail", error: err.message });
            console.warn(`❌ Failed to capture ${route}: ${err.message}`);
        }
    }

    const manifest = path.join(outDir, "verification.json");
    fs.writeFileSync(manifest, JSON.stringify(results, null, 2));
    fs.copyFileSync(manifest, path.join(latestDir, "verification.json"));

    console.log(`✅ Done — Evidence saved to ${latestDir} (runtime ${Math.round((Date.now() - startAll) / 1000)}s)`);
    await browser.close();
}

/**
 * ------------------------------------------------------------
 * 🧠 Auto-run if executed directly via `npm run capture:visual`
 * ------------------------------------------------------------
 * Compatible with ESM (no require.main)
 */
const isDirectRun = import.meta.url === `file://${process.argv[1]}`;

if (isDirectRun) {
    (async () => {
        try {
            console.log("🧠 Running visual capture via project hooks...");

            // Dynamically import project-specific hooks
            const hooksModule: any = await import("../../../scripts/visual_hooks.js");

            // ✅ Fix: Explicitly resolve hook export safely
            const visualHooks: VisualHooks =
                (hooksModule.default as VisualHooks) ||
                (hooksModule.visualHooks as VisualHooks) ||
                (() => {
                    throw new Error("No valid export found in scripts/visual_hooks.js");
                })();

            const config: VisualConfig = {
                baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                outputDir: undefined, // default /docs/evidence/archive
                latestDir: undefined, // default /docs/evidence/latest
                timeouts: { goto: 20000, ready: 8000 },
            };

            await captureVisuals(config, visualHooks);
            console.log("✅ Visual capture run complete.");
        } catch (err: any) {
            console.error("❌ Visual capture failed:", err);
            process.exit(1);
        }
    })();
}