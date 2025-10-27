/**
 * Example hooks file for CollabCanvas.
 * Copy this into your main project under `scripts/visual_hooks.ts`
 * and adjust routes or selectors as needed.
 */

import type { Page } from "playwright";

export const visualHooks = {
    // Routes to capture
    routes: ["/c/test-canvas?auto=dev", "/c/default?auto=dev"],

    // Selectors that confirm canvas has loaded
    readinessSelectors: [
        "[data-testid='canvas-shell']",
        ".konvajs-content",
        "[data-testid='canvas-header']"
    ],

    /**
     * Ensure the chat drawer (AI assistant) is open before capturing.
     * This runs in browser context, so we use DOM APIs instead of Playwright selectors.
     */
    async ensureChatOpen(page: Page): Promise<void> {
        console.log("💬 Ensuring chat drawer is open...");

        // 1️⃣ Try to find and click the chat toggle button
        await page.evaluate(() => {
            const candidates = Array.from(document.querySelectorAll("button, [data-testid]"));
            const chatButton = candidates.find(el => {
                const text = (el.textContent || "").toLowerCase();
                const label = (el.getAttribute("aria-label") || "").toLowerCase();
                const testid = (el.getAttribute("data-testid") || "").toLowerCase();
                return (
                    text.includes("chat") ||
                    text.includes("assistant") ||
                    label.includes("chat") ||
                    label.includes("assistant") ||
                    testid.includes("chat-toggle")
                );
            });

            if (chatButton) {
                console.log("🖱️ Clicking chat toggle button...");
                (chatButton as HTMLElement).click();
            } else {
                console.warn("⚠️ No chat toggle found in DOM.");
            }
        });

        // 2️⃣ Wait up to 2 seconds for chat drawer to appear
        try {
            await page.waitForSelector('[data-testid="chat-drawer"]', { timeout: 2000 });
            console.log("✅ Chat drawer visible!");
        } catch {
            console.warn("⚠️ Chat drawer did not appear — continuing capture anyway.");
        }
    }
};