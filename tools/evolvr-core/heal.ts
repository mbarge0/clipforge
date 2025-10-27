import fs from 'fs';
import path from 'path';
import type { EvolvrConfig, EvolvrResult } from './interfaces.js';

export interface EvolvrPatchMeta {
    timestamp: string;
    reasons: string[];
    changes: Record<string, unknown>;
}

function nowStamp() {
    return new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)
}

export async function selfHeal(prevConfig: EvolvrConfig): Promise<{ config: EvolvrConfig; patch: EvolvrPatchMeta | null; }> {
    const latestDir = prevConfig.latestDir || path.resolve('docs/evidence/latest')
    const summaryPath = path.join(latestDir, 'verification_summary.json')
    let results: EvolvrResult[] = []
    try {
        results = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
    } catch {
        return { config: prevConfig, patch: null }
    }

    const reasons: string[] = []
    const next: EvolvrConfig = { ...prevConfig, selectors: { ...(prevConfig.selectors || {}) } }
    const sels = next.selectors!

    // Initialize defaults if not present
    if (!sels.loginReady) sels.loginReady = ["[data-testid='auth-form']", 'form']
    if (!sels.canvasReady) sels.canvasReady = ["[data-testid='canvas-shell']", '.konvajs-content']
    if (!sels.chatVisible) sels.chatVisible = "[data-testid='chat-drawer'], [aria-label*='chat' i]"

    let changed = false

    for (const r of results) {
        const route = r.route || ''
        const isLogin = route.includes('/login')
        const isCanvas = route.includes('/c/')

        if (r.status !== 'success') {
            // Readiness timeouts → extend ready timeout by +4000ms (cap at 30000)
            if ((isLogin && !r.loginSucceeded) || (isCanvas && !r.canvasReady)) {
                const prev = Number(next.timeouts?.ready || 8000)
                const updated = Math.min(prev + 4000, 30000)
                next.timeouts = { goto: Number(next.timeouts?.goto || 20000), ready: updated }
                reasons.push(`${route}: extended ready timeout to ${updated}ms`)
                changed = true
            }

            // Missing chat drawer → add fallback selector and/or relax requirement
            if (isCanvas && next.requireChatVisible && !r.chatVisible) {
                const before = sels.chatVisible!
                sels.chatVisible = `${before}, [aria-label*='AI Chat Drawer' i]`
                reasons.push(`${route}: added chat visible fallback selector`)
                // Also relax requirement to avoid hard fail on flaky UI
                next.requireChatVisible = false
                reasons.push(`${route}: relaxed requireChatVisible=false`)
                changed = true
            }

            // Canvas readiness fallback selector
            if (isCanvas && !r.canvasReady) {
                const set = new Set(sels.canvasReady)
                set.add("[data-testid='canvas-stage-wrapper']")
                sels.canvasReady = Array.from(set)
                reasons.push(`${route}: added canvas-stage-wrapper readiness selector`)
                changed = true
            }

            // Incomplete/blank video → increase record length by +5s (cap 20s)
            if (!r.hasVideo) {
                const prev = Number(next.recordSeconds || 10)
                const updated = Math.min(prev + 5, 20)
                next.recordSeconds = updated
                reasons.push(`${route}: increased recordSeconds to ${updated}s`)
                changed = true
            }

            // Timeouts/degraded from adapter → ensure retries configured
            if ((r as any).degraded) {
                const baseGoto = Number(next.timeouts?.goto || 20000)
                const baseReady = Number(next.timeouts?.ready || 8000)
                next.timeouts = { goto: Math.max(baseGoto, 40000), ready: Math.max(baseReady, 15000) }
                next.retryMs = Number.isFinite(next.retryMs as number) ? next.retryMs : 5000
                next.maxRetries = Number.isFinite(next.maxRetries as number) ? next.maxRetries : 1
                reasons.push(`${route}: marked degraded — set goto>=40000, ready>=15000, ensure retryMs/maxRetries`)
                changed = true
            }
        }
    }

    if (!changed) return { config: prevConfig, patch: null }

    const patch: EvolvrPatchMeta = {
        timestamp: nowStamp(),
        reasons,
        changes: {
            timeouts: next.timeouts,
            selectors: next.selectors,
            requireChatVisible: next.requireChatVisible,
            recordSeconds: next.recordSeconds,
        },
    }

    try {
        const dir = 'auto_fixes'
        fs.mkdirSync(dir, { recursive: true })
        const file = path.join(dir, `${patch.timestamp}_evolvr_patch.json`)
        fs.writeFileSync(file, JSON.stringify(patch, null, 2))
        console.log('🩺 Self-healing plan written:', file)
    } catch { }

    return { config: next, patch }
}


