import fs from 'fs'
import path from 'path'
import type { EvolvrConfig } from './interfaces.js'

export interface EvolvrMemory {
    lastUpdated: string
    defaults: {
        timeouts?: { goto?: number; ready?: number }
        recordSeconds?: number
        requireChatVisible?: boolean
    }
    patterns: {
        login?: Partial<EvolvrConfig>
        canvas?: Partial<EvolvrConfig>
    }
}

function readJsonSafe<T = any>(p: string): T | null {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')) as T } catch { return null }
}

function nowIso(): string { return new Date().toISOString() }

export function loadAdaptiveConfig(base: EvolvrConfig): { config: EvolvrConfig; memory: EvolvrMemory } {
    const baseOut: EvolvrMemory = { lastUpdated: nowIso(), defaults: {}, patterns: {} }
    const fixesDir = path.resolve('auto_fixes')
    const memPath = path.join(fixesDir, 'evolvr_memory.json')

    // Merge prior memory if exists
    const prior = readJsonSafe<EvolvrMemory>(memPath) || baseOut

    // Scan patches to infer stable defaults
    let maxGoto = prior.defaults.timeouts?.goto || 0
    let maxReady = prior.defaults.timeouts?.ready || 0
    let recSeconds = prior.defaults.recordSeconds || 0
    let reqChat: boolean | undefined = prior.defaults.requireChatVisible

    try {
        fs.mkdirSync(fixesDir, { recursive: true })
        for (const f of fs.readdirSync(fixesDir)) {
            if (!f.endsWith('.json')) continue
            const patch = readJsonSafe<any>(path.join(fixesDir, f))
            if (!patch) continue
            const changes = patch.changes || patch // support both shapes
            if (changes?.timeouts?.goto) maxGoto = Math.max(maxGoto, Number(changes.timeouts.goto))
            if (changes?.timeouts?.ready) maxReady = Math.max(maxReady, Number(changes.timeouts.ready))
            if (changes?.recordSeconds) recSeconds = Math.max(recSeconds, Number(changes.recordSeconds))
            if (typeof changes?.requireChatVisible === 'boolean') {
                // prefer relaxed if seen unstable
                reqChat = (reqChat === undefined) ? changes.requireChatVisible : (reqChat && changes.requireChatVisible)
            }
        }
    } catch { }

    const adapted: EvolvrConfig = { ...base }
    adapted.timeouts = {
        goto: Math.max(Number(base.timeouts?.goto || 20000), maxGoto || 0),
        ready: Math.max(Number(base.timeouts?.ready || 8000), maxReady || 0),
    }
    if (recSeconds > 0) adapted.recordSeconds = Math.max(Number(base.recordSeconds || 10), recSeconds)
    if (typeof reqChat === 'boolean') adapted.requireChatVisible = reqChat

    if ((maxGoto || maxReady || recSeconds || typeof reqChat === 'boolean')) {
        const gotoStr = adapted.timeouts.goto
        const readyStr = adapted.timeouts.ready
        console.log(`🧠 Loaded adaptive config: using stable timeouts (${gotoStr} ms/${readyStr} ms)${recSeconds ? `, record ${adapted.recordSeconds}s` : ''}${typeof reqChat === 'boolean' ? `, requireChatVisible=${adapted.requireChatVisible}` : ''}.`)
    }

    return { config: adapted, memory: prior }
}

export function updateMemoryAfterRun(memory: EvolvrMemory, effective: EvolvrConfig, success: boolean, patchReasons?: string[]) {
    const fixesDir = path.resolve('auto_fixes')
    try { fs.mkdirSync(fixesDir, { recursive: true }) } catch { }
    const memPath = path.join(fixesDir, 'evolvr_memory.json')

    // Update defaults to reflect effective stable settings when success
    if (success) {
        memory.defaults.timeouts = {
            goto: Math.max(Number(memory.defaults.timeouts?.goto || 0), Number(effective.timeouts?.goto || 0)),
            ready: Math.max(Number(memory.defaults.timeouts?.ready || 0), Number(effective.timeouts?.ready || 0)),
        }
        if (effective.recordSeconds) memory.defaults.recordSeconds = Math.max(Number(memory.defaults.recordSeconds || 0), Number(effective.recordSeconds))
        if (typeof effective.requireChatVisible === 'boolean') memory.defaults.requireChatVisible = effective.requireChatVisible
    }

    // Persist with metadata
    const out = { ...memory, lastUpdated: nowIso(), lastPatchReasons: patchReasons || [] }
    try { fs.writeFileSync(memPath, JSON.stringify(out, null, 2)) } catch { }
}


