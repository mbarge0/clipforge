import type { EvolvrConfig, EvolvrResult } from '../interfaces.js'

export async function runCapture(_config: EvolvrConfig): Promise<void> {
    console.log('🧪 MCP stub: capture not implemented — using local Playwright adapter expected.')
}

export async function runVerify(_config: EvolvrConfig): Promise<EvolvrResult[]> {
    console.log('🧪 MCP stub: verify not implemented — using local Playwright adapter expected.')
    return []
}

