import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// --- DEV STABILITY PATCHES ---
// Disable GPU & hardware acceleration (prevents macOS Electron crash loop)
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('no-sandbox'); // Fixes SIGTRAP GPU sandbox crash

// --- Resolve paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
// --- Create BrowserWindow ---
function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // --- Determine URL based on environment ---
    const isDev = process.env.VITE_DEV?.toString().trim() === '1';
    const startURL = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    console.log(`[main] Launching ClipForge in ${isDev ? 'DEV' : 'PROD'} mode`);
    console.log(`[main] Loading URL → ${startURL}`);

    // Load app
    win.loadURL(startURL);

    // --- Dev-only behavior ---
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });

        // Retry if renderer isn't ready yet (Vite warmup)
        win.webContents.on('did-fail-load', () => {
            console.warn('⚠️ Renderer not ready — retrying...');
            setTimeout(() => win.loadURL(startURL), 1000);
        });
    }
}

// --- Electron Lifecycle ---
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC Bridge Test (health check) ---
ipcMain.handle('app:ping', async (_event, message) => {
    return `pong:${message ?? ''}`;
});

// ---------------- Export Pipeline IPC ----------------
const activeJobs = new Map();

// Resolve a file path by name from common locations
ipcMain.handle('media:getPathForFileName', async (_event, nameOrPath) => {
    try {
        if (!nameOrPath || typeof nameOrPath !== 'string') {
            console.log('[media:getPathForFileName]', nameOrPath, '→ not found');
            return undefined;
        }

        // 1) Exact (absolute or relative) provided path
        const asProvided = path.resolve(nameOrPath);
        if (fs.existsSync(asProvided)) {
            console.log('[media:getPathForFileName]', nameOrPath, '→', asProvided);
            return asProvided;
        }

        // 2) Search common user locations
        const baseName = path.basename(nameOrPath);
        const home = os.homedir();
        const candidates = [
            path.join(home, 'Downloads', baseName),
            path.join(home, 'Movies', baseName),
            path.join(home, 'Documents', baseName),
            path.join(home, 'Desktop', baseName),
            path.join(process.cwd(), baseName),
        ];
        for (const p of candidates) {
            if (fs.existsSync(p)) {
                console.log('[media:getPathForFileName]', nameOrPath, '→', p);
                return p;
            }
        }
        console.log('[media:getPathForFileName]', nameOrPath, '→ not found');
        return undefined;
    } catch (err) {
        console.log('[media:getPathForFileName]', nameOrPath, '→ error:', err?.message || err);
        return undefined;
    }
});

// ---------------- Recording Engine IPC ----------------
const activeRecords = new Map(); // sessionId -> { stream, filePath, dir }

ipcMain.handle('record:openFile', async (_event, opts) => {
    const extension = (opts && typeof opts.extension === 'string' && opts.extension) || 'webm';
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clipforge-record-'));
    const filePath = path.join(dir, `record-${Date.now()}.${extension}`);
    const stream = fs.createWriteStream(filePath);
    const sessionId = `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    activeRecords.set(sessionId, { stream, filePath, dir });
    console.log('[record:openFile]', { sessionId, filePath });
    return { sessionId, filePath };
});

ipcMain.handle('record:appendChunk', async (_event, payload) => {
    try {
        const { sessionId, chunk } = payload || {};
        const rec = activeRecords.get(sessionId);
        if (!rec || !chunk) return false;
        await new Promise((resolve, reject) => {
            try {
                rec.stream.write(Buffer.from(chunk), (err) => (err ? reject(err) : resolve(null)));
            } catch (err) {
                reject(err);
            }
        });
        return true;
    } catch {
        return false;
    }
});

ipcMain.handle('record:closeFile', async (_event, sessionId) => {
    const rec = activeRecords.get(sessionId);
    if (!rec) return undefined;
    await new Promise((resolve) => rec.stream.end(resolve));
    activeRecords.delete(sessionId);
    console.log('[record:closeFile]', { sessionId, filePath: rec.filePath });
    return rec.filePath;
});

ipcMain.handle('record:composePiP', async (_event, payload) => {
    const { screenPath, webcamPath, outExtension } = payload || {};
    if (!screenPath || !webcamPath) throw new Error('missing_inputs');
    ffmpeg.setFfmpegPath(ffmpegPath);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clipforge-pip-'));
    const outPath = path.join(dir, `pip-${Date.now()}.${outExtension || 'mp4'}`);
    await new Promise((resolve, reject) => {
        // Overlay webcam (scaled to 20% of main width) at bottom-right with 20px margin
        const filter = '[1:v]scale=iw*0.2:-1[cam];[0:v][cam]overlay=W-w-20:H-h-20:format=auto';
        const proc = ffmpeg()
            .input(screenPath)
            .input(webcamPath)
            .complexFilter(filter)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y'])
            .on('error', (err) => reject(err))
            .on('end', () => resolve(null))
            .save(outPath);
    });
    const exists = fs.existsSync(outPath);
    if (!exists) throw new Error('compose_failed');
    console.log('[record:composePiP] wrote', outPath);
    return outPath;
});

ipcMain.handle('export:chooseDestination', async () => {
    const result = await dialog.showSaveDialog({
        title: 'Choose export destination',
        defaultPath: path.join(os.homedir(), 'Movies', 'export.mp4'),
        filters: [{ name: 'MP4', extensions: ['mp4'] }],
    });
    if (result.canceled) return undefined;
    return result.filePath;
});

ipcMain.handle('export:start', (event, payload) => {
    const jobId = payload.jobId ?? `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const wc = event.sender;
    // Kick off export asynchronously so we can return jobId immediately
    (async () => {
        try {
            const { resolution, destinationPath, segments } = payload;
            if (!Array.isArray(segments) || segments.length === 0) {
                throw new Error('No segments provided');
            }
            if (!destinationPath) throw new Error('No destination path');

            ffmpeg.setFfmpegPath(ffmpegPath);

            const absOutputPath = path.resolve(String(destinationPath));
            console.log(`[export ${jobId}] outputPath (abs):`, absOutputPath);
            console.log(`[export ${jobId}] cwd:`, process.cwd());

            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clipforge-export-'));
            const tempSegments = [];
            let cancelled = false;
            activeJobs.set(jobId, {
                cancel: () => {
                    cancelled = true;
                    const cur = activeJobs.get(jobId)?.currentProc;
                    try { cur && cur.kill('SIGKILL'); } catch { }
                },
            });

            const totalDurationMs = segments.reduce((acc, s) => acc + Math.max(0, s.outMs - s.inMs), 0);
            let completedMs = 0;
            let lastEmit = 0;

            const emitProgress = (percent, status, etaSeconds) => {
                const now = Date.now();
                if (now - lastEmit < 200) return; // throttle ~5/sec
                lastEmit = now;
                try { wc.send('export:progress', { jobId, percent, status, etaSeconds }); } catch { }
            };

            const parseTimemarkMs = (tm) => {
                if (!tm || typeof tm !== 'string') return 0;
                const parts = tm.split(':');
                if (parts.length < 3) return 0;
                const h = parseInt(parts[0] || '0', 10) || 0;
                const m = parseInt(parts[1] || '0', 10) || 0;
                const s = parseFloat(parts[2] || '0') || 0;
                return Math.max(0, Math.floor(((h * 60 + m) * 60 + s) * 1000));
            };

            const scaleFilterFor = (res) => {
                if (res === '720p') return 'scale=1280:720:flags=bicubic,setsar=1';
                if (res === '1080p') return 'scale=1920:1080:flags=bicubic,setsar=1';
                return 'scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1';
            };

            // 1) Encode segments
            for (let i = 0; i < segments.length; i++) {
                if (cancelled) throw new Error('CANCELLED');
                const s = segments[i];
                const tmpOut = path.join(tempDir, `seg-${String(i).padStart(3, '0')}.mp4`);
                tempSegments.push(tmpOut);
                const durationSec = Math.max(0, (s.outMs - s.inMs) / 1000);
                await new Promise((resolve, reject) => {
                    const proc = ffmpeg()
                        .input(s.filePath)
                        .inputOptions([`-ss ${s.inMs / 1000}`])
                        .outputOptions(['-t', String(durationSec), '-y'])
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .outputOptions(['-pix_fmt', 'yuv420p'])
                        .videoFilters(scaleFilterFor(resolution))
                        .on('start', () => {
                            activeJobs.set(jobId, { ...activeJobs.get(jobId), currentProc: proc.ffmpegProc });
                            emitProgress(Math.min(99, (completedMs / totalDurationMs) * 100), `encoding segment ${i + 1}/${segments.length}`);
                        })
                        .on('progress', (p) => {
                            const ms = parseTimemarkMs(p?.timemark);
                            const segMs = Math.min(ms, Math.floor(durationSec * 1000));
                            const curMs = completedMs + segMs;
                            const percent = totalDurationMs > 0 ? Math.min(99, Math.max(0, Math.floor((curMs / totalDurationMs) * 100))) : 0;
                            emitProgress(percent, `encoding segment ${i + 1}/${segments.length}`);
                        })
                        .on('error', (err) => reject(err))
                        .on('end', () => {
                            completedMs += Math.max(0, s.outMs - s.inMs);
                            emitProgress(Math.min(99, (completedMs / totalDurationMs) * 100), `encoded ${i + 1}/${segments.length}`);
                            resolve(null);
                        })
                        .save(tmpOut);
                });
            }

            if (cancelled) throw new Error('CANCELLED');

            // 2) Concat
            const listPath = path.join(tempDir, 'concat_list.txt');
            const listContent = tempSegments.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
            fs.writeFileSync(listPath, listContent, 'utf8');

            await new Promise((resolve, reject) => {
                const proc = ffmpeg()
                    .input(listPath)
                    .inputOptions(['-f', 'concat', '-safe', '0'])
                    .outputOptions(['-c', 'copy', '-y'])
                    .on('start', () => {
                        activeJobs.set(jobId, { ...activeJobs.get(jobId), currentProc: proc.ffmpegProc });
                        emitProgress(99, 'finalizing');
                    })
                    .on('error', (err) => reject(err))
                    .on('end', () => resolve(null))
                    .save(absOutputPath);
            });

            const exists = fs.existsSync(absOutputPath);
            console.log(`[export ${jobId}] write complete: exists=${exists} path=${absOutputPath}`);
            if (!exists) {
                console.error(`[export ${jobId}] expected output missing. cwd=${process.cwd()}`);
                try { wc.send('export:complete', { jobId, success: false, error: 'output_missing', outputPath: absOutputPath }); } catch { }
            } else {
                emitProgress(100, 'done', 0);
                try { wc.send('export:complete', { jobId, success: true, outputPath: absOutputPath }); } catch { }
            }
        } catch (err) {
            if (String(err?.message || err) === 'CANCELLED') {
                try { wc.send('export:complete', { jobId, success: false, error: 'cancelled' }); } catch { }
            } else {
                try { wc.send('export:complete', { jobId, success: false, error: String(err?.message || err) }); } catch { }
            }
        } finally {
            // cleanup
            // tempDir and tempSegments are scoped inside; re-create to scan and remove
            // (no-op if already removed)
        }
    })();

    return { jobId };
});

ipcMain.handle('export:cancel', async (_event, jobId) => {
    const job = activeJobs.get(jobId);
    if (job) {
        try { job.cancel(); return true; } catch { return false; }
    }
    return false;
});