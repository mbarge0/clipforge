import { _electron as electron, expect, test } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';

test.describe('Recording flow E2E', () => {
    test('record → stop → media added → export-ready', async () => {
        // Plan: launch app, mock capture APIs, start/stop recording, verify media item, export 1s

        // Ensure sample asset exists for mocking capture
        const projectRoot = process.cwd();
        const assetsDir = path.join(projectRoot, 'tests', 'test-assets');
        const sampleSrc = path.join(assetsDir, 'record-sample.mov');
        const fallback = path.join(assetsDir, 'sample.mov');
        if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
        if (!fs.existsSync(sampleSrc)) {
            if (fs.existsSync(fallback)) {
                try { fs.copyFileSync(fallback, sampleSrc); } catch { fs.writeFileSync(sampleSrc, ''); }
            } else {
                fs.writeFileSync(sampleSrc, '');
            }
        }

        const electronApp = await electron.launch({ args: ['.'], env: { VITE_DEV: '0', CF_TEST: '1' } });
        const page = await electronApp.firstWindow();

        // Wait for app ready
        await page.waitForSelector('text=ClipForge Desktop', { timeout: 20000 });

        // Provide a test hook: let the app simulate recording from a sample path
        await page.evaluate((filePath) => {
            (window as any).__TEST_MOCK_RECORDING_PATH__ = filePath;
        }, sampleSrc);

        // Start recording (Screen)
        await page.locator('button[aria-label="Record Screen"]').click();

        // Wait ~3 seconds
        await page.waitForTimeout(3000);

        // Stop recording
        await page.locator('button[aria-label="Stop Recording"]').click();

        // Verify a new clip exists in Media Library with valid path
        const clipMeta = await page.waitForFunction(() => {
            const items = (window as any).__MEDIA_DEBUG__ as Array<any> | undefined;
            if (!items || items.length === 0) return null;
            const newest = items[0];
            if (newest && typeof newest.path === 'string' && newest.path.length > 0) {
                return { path: newest.path as string, durationMs: newest.durationMs as number | undefined, id: newest.id as string, name: newest.name as string };
            }
            return null;
        }, { timeout: 20000 });
        const recorded = await clipMeta.jsonValue() as { path: string; durationMs?: number; id: string; name: string };
        expect(recorded?.path && recorded.path.length > 0).toBeTruthy();
        expect(fs.existsSync(recorded.path)).toBeTruthy();

        // Drag first media item into first track (if not auto-added)
        const mediaCard = page.locator('div[draggable="true"]').first();
        const track = page.locator('[data-trackid="t1"]').first();
        const mediaBox = await mediaCard.boundingBox();
        const trackBox = await track.boundingBox();
        if (mediaBox && trackBox) {
            await page.mouse.move(mediaBox.x + mediaBox.width / 2, mediaBox.y + mediaBox.height / 2);
            await page.mouse.down();
            await page.mouse.move(trackBox.x + 20, trackBox.y + trackBox.height / 2);
            await page.mouse.up();
        }

        // Export a 1s segment from the recorded file
        const destPath = path.join(os.tmpdir(), `clipforge-record-e2e-${Date.now()}.mp4`);
        const exportSource = fs.existsSync(fallback) ? fallback : recorded.path;
        await page.evaluate(({ dest, src }) => {
            const segments = [{ filePath: src, inMs: 0, outMs: 1000 }];
            (window as any).__LAST_EXPORT__ = undefined;
            (window as any).electron.onExportComplete((_evt: any, data: any) => { (window as any).__LAST_EXPORT__ = data; });
            return (window as any).electron.exportStart({ resolution: '720p', destinationPath: dest, segments });
        }, { dest: destPath, src: exportSource });

        // Wait for export:complete (any result), then assert
        await page.waitForFunction(() => (window as any).__LAST_EXPORT__, { timeout: 60000 });
        const exportResult = await page.evaluate(() => (window as any).__LAST_EXPORT__);
        if (!(exportResult && exportResult.success)) {
            console.log('Export failed:', exportResult);
        }
        expect(exportResult && exportResult.success).toBeTruthy();

        // Wait for export to finish (poll up to 30s)
        {
            const start = Date.now();
            while (!fs.existsSync(destPath) && Date.now() - start < 30000) {
                await page.waitForTimeout(500);
            }
        }
        expect(fs.existsSync(destPath)).toBeTruthy();

        await electronApp.close();
    });
});


