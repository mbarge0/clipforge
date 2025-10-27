import { execSync } from 'child_process'
import { runShowcaseCapture } from './showcase.capture'
import { summarizeShowcase } from './showcase.summary'

async function main() {
    try {
        if (!process.argv.includes('--no-build')) {
            console.log('🏗️ Building project…')
            execSync('pnpm -s build', { stdio: 'inherit' })
        }
        console.log('🎬 Running showcase capture…')
        const { latest, logPath } = await runShowcaseCapture()
        console.log('🧾 Writing summary…')
        const { out } = summarizeShowcase(latest)
        console.log('✅ Showcase completed.')
        console.log('   latest:', latest)
        console.log('   log:', logPath)
        console.log('   summary:', out)
        process.exit(0)
    } catch (e: any) {
        console.error('❌ Showcase run failed:', e?.message || e)
        process.exit(1)
    }
}

main()
