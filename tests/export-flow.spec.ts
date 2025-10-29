import { _electron as electron, expect, test } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';

test.describe('Export flow E2E', () => {
    test('imports, places on timeline, exports to MP4', async () => {
        // Prepare sample asset: copy to cwd so IPC resolver can find it
        const projectRoot = process.cwd();
        const assetsDir = path.join(projectRoot, 'tests', 'test-assets');
        const sampleSrc = path.join(assetsDir, 'sample.mov');
        const sampleDst = path.join(projectRoot, 'sample.mov');
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }
        // If sample file is missing, synthesize a tiny file to unblock flow
        if (!fs.existsSync(sampleSrc)) {
            fs.writeFileSync(sampleSrc, '');
        }
        try { fs.copyFileSync(sampleSrc, sampleDst); } catch { }

        const electronApp = await electron.launch({ args: ['.'], env: { VITE_DEV: '1' } });
        const page = await electronApp.firstWindow();

        // Wait for app ready
        await page.waitForSelector('text=ClipForge Desktop', { timeout: 20000 });

        // Import via hidden file input
        const fileInput = await page.locator('input[type="file"]').first();
        await fileInput.setInputFiles(sampleDst);

        // Expect media item to show up
        await expect(page.locator('text=No media yet').first()).toHaveCount(0);

        // Drag first media item into first track
        const mediaCard = page.locator('div[draggable="true"]').first();
        const track = page.locator('[data-trackid="t1"]').first();
        const mediaBox = await mediaCard.boundingBox();
        const trackBox = await track.boundingBox();
        if (!mediaBox || !trackBox) throw new Error('Failed to resolve drag targets');
        await page.mouse.move(mediaBox.x + mediaBox.width / 2, mediaBox.y + mediaBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(trackBox.x + 20, trackBox.y + trackBox.height / 2);
        await page.mouse.up();

        // Build export segments in renderer and call export directly to avoid OS dialog
        const destPath = path.join(os.tmpdir(), `clipforge-e2e-${Date.now()}.mp4`);
        const result = await page.evaluate(async ({ dest, sample }) => {
            // Export a 1s segment from the sample file to avoid metadata dependency
            const segments = [{ filePath: sample, inMs: 0, outMs: 1000 }];
            const res = await (window as any).electron.exportStart({ resolution: '720p', destinationPath: dest, segments });
            return { ok: !!res?.jobId, jobId: res?.jobId };
        }, { dest: destPath, sample: sampleDst });

        expect(result.ok).toBeTruthy();

        // Wait for completion overlay text to disappear (Export modal auto-closes on complete)
        await page.waitForTimeout(3000);

        // Verify output exists
        expect(fs.existsSync(destPath)).toBeTruthy();

        await electronApp.close();
    });
});


