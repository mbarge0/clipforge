/**
 * tools/visual-verification-core/src/verify_visual.ts
 *
 * Hybrid visual verification:
 * - Reopens routes from verification.json
 * - Checks readiness selectors and chat drawer visibility
 * - Performs optional lightweight pixel difference check
 * - Writes verification_summary.json
 */

import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { verifyMotionPlayback } from "../../../tools/foundry-motion/motion.verify.js";
import { compareImages } from "./image_utils.js";
import type { VisualHooks } from "./interfaces.js";

const latestDir = path.resolve("docs/evidence/latest");
const manifestPath = path.join(latestDir, "verification.json");
const summaryPath = path.join(latestDir, "verification_summary.json");

(async () => {
    if (!fs.existsSync(manifestPath)) {
        console.error("❌ No verification.json found — run capture first.");
        process.exit(1);
    }

    const results = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const hooksModule: any = await import("../../../scripts/visual_hooks.js");
    const visualHooks: VisualHooks = hooksModule.default || hooksModule.visualHooks;

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const summary: Array<Record<string, any>> = [];

    for (const entry of results) {
        const { route, screenshot, name, canvasReady: capCanvasReady, chatVisible: capChatVisible, loginSucceeded: capLoginSucceeded, shapeCreated: capShapeCreated, chatResponded: capChatResponded, chatLatencyMs: capChatLatencyMs, hasVideo: capHasVideo, motionDetected: capMotionDetected, motionDurationMs: capMotionDurationMs, motionSuccess: capMotionSuccess } = entry;
        console.log(`🧠 Verifying route ${route}...`);

        let canvasReady = !!capCanvasReady;
        let chatVisible = !!capChatVisible;
        let loginSucceeded = capLoginSucceeded;
        let shapeCreated = capShapeCreated;
        let chatResponded = capChatResponded;
        let chatLatencyMs = capChatLatencyMs;

        try {
            const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${route}`;
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

            // Check readiness selectors
            if (!canvasReady) {
                try {
                    await Promise.race(
                        visualHooks.readinessSelectors.map(sel =>
                            page.waitForSelector(sel, { timeout: 8000 })
                        )
                    );
                    canvasReady = true;
                } catch {
                    console.warn(`⚠️ Canvas readiness failed for ${route}`);
                }
            }

            // Check chat drawer visibility (testid preferred; fallback aria-label)
            if (!chatVisible) {
                try {
                    chatVisible = await page.locator('[data-testid="chat-drawer"], [aria-label*="chat" i]').isVisible();
                } catch { chatVisible = false }
            }

            // Motion playback verification (best-effort)
            let motionDetected = !!capMotionDetected;
            let motionDurationMs = capMotionDurationMs ?? 0;
            let motionSuccess = !!capMotionSuccess;
            if (!motionDetected) {
                try {
                    const mv = await verifyMotionPlayback(page, 1200);
                    motionDetected = !!mv.motionDetected;
                    motionDurationMs = mv.durationMs;
                    motionSuccess = !!mv.success;
                } catch { }
            }

            // Optional: Compare against baseline
            const baselinePath = path.join("docs/evidence/baseline", path.basename(screenshot));
            let visualDiff = null;
            if (fs.existsSync(baselinePath)) {
                visualDiff = await compareImages(screenshot, baselinePath);
            }

            // Video check: route name converted to semantic file name
            const videoName = `${(name || route.replace(/[/?=&]/g, "_").replace(/_+/g, "_").replace(/^_/, ""))}.webm`;
            const videoPath = path.join(path.resolve("docs/evidence/latest/videos"), videoName);
            let hasVideo = !!capHasVideo;
            if (!hasVideo) {
                try {
                    const st = fs.statSync(videoPath);
                    hasVideo = st.size > 10 * 1024;
                } catch { hasVideo = false }
            }

            // Assistant text sanity: detect mismatch circle vs square
            let chatWrongType = false;
            const notes: string[] = [];
            try {
                if (route.includes('/c/')) {
                    const drawer = page.locator('[data-testid="chat-drawer"], [aria-label*="AI Chat Drawer" i]');
                    // Pull recent text from chat drawer if present
                    const textBlob = await drawer.first().innerText().catch(() => '');
                    const saysCircle = /\bcircle\b/i.test(textBlob || '')
                    const saysSquare = /\bsquare\b/i.test(textBlob || '')
                    if (saysCircle && !saysSquare) {
                        chatWrongType = true;
                        notes.push('assistant said circle');
                    }
                }
            } catch { }

            // Behavioral pass criteria
            let status = 'partial';
            if (route.includes('/login')) {
                status = loginSucceeded && hasVideo ? 'success' : (hasVideo ? 'partial' : 'fail');
            } else if (route.includes('/c/')) {
                status = canvasReady && chatVisible && hasVideo ? 'success' : ((canvasReady && hasVideo) ? 'partial' : 'fail');
                if (chatWrongType) status = 'fail';
            }

            summary.push({
                route,
                canvasReady,
                chatVisible,
                loginSucceeded: !!loginSucceeded,
                shapeCreated: !!shapeCreated,
                chatResponded: !!chatResponded,
                chatLatencyMs: chatLatencyMs ?? null,
                motionDetected,
                motionDurationMs,
                motionSuccess,
                chatWrongType,
                hasVideo,
                status,
                notes,
            });

            const latencyStr = chatLatencyMs ? (Math.round((chatLatencyMs / 10)) / 100).toFixed(2) : 'n/a';
            const motionStr = motionDetected ? `motion:true(${motionDurationMs}ms)` : 'motion:false';
            console.log(`✅ ${route} → ready:${canvasReady}, chat:${chatVisible}, video:${hasVideo}, login:${!!loginSucceeded}, shape:${!!shapeCreated}, reply:${!!chatResponded} ${chatResponded ? `(💬 ${latencyStr} s)` : ''} ${motionStr}${chatWrongType ? ' ⚠️ mismatch (circle vs square)' : ''}`);
        } catch (err: any) {
            summary.push({
                route,
                error: err.message,
                status: "fail",
            });
            console.warn(`❌ Verification failed for ${route}: ${err.message}`);
        }
    }

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`\n📄 Verification summary written to ${summaryPath}`);

    // Write minimal summary for fast consumers
    try {
        const summaryMin = summary.map((s: any) => ({
            route: s.route,
            canvasReady: !!s.canvasReady,
            chatVisible: !!s.chatVisible,
            hasVideo: !!s.hasVideo,
            status: s.status || 'fail',
        }))
        const minPath = path.join(latestDir, 'summary_min.json')
        fs.writeFileSync(minPath, JSON.stringify(summaryMin, null, 2))
        console.log(`📄 Minimal summary written to ${minPath}`)
    } catch { }

    await browser.close();
})();