const { app, BrowserWindow, desktopCapturer, dialog, ipcMain, protocol, session, systemPreferences } = require('electron');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const os = require('os');
const path = require('path');

// --- Startup switches ---
// NOTE: Do not disable GPU/hardware acceleration; it can cause black video frames on macOS.
// app.disableHardwareAcceleration();
// app.commandLine.appendSwitch('disable-gpu');
// app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('no-sandbox'); // Fixes SIGTRAP GPU sandbox crash

// ✅ Enable screen capture in Chromium (macOS ScreenCaptureKit + display capture)
app.commandLine.appendSwitch('enable-usermedia-screen-capturing');
app.commandLine.appendSwitch('enable-experimental-web-platform-features');
// Merge multiple features in one switch to avoid overriding
app.commandLine.appendSwitch('enable-features', 'ScreenCaptureKitMac,DesktopCapture');

// --- Resolve paths --- (CommonJS provides __dirname)

let win;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// --- macOS Screen Recording Permission ---
async function ensureScreenRecordingAccess() {
    if (process.platform !== 'darwin') return true;
    try {
        // systemPreferences.askForMediaAccess('screen') is not supported on macOS and throws.
        // Rely on the normal Chromium getDisplayMedia / desktopCapturer permission flow instead.
        console.log('[permissions] Skipping askForMediaAccess("screen") — unsupported on macOS.');
        return true;
    } catch (e) {
        console.warn('[permissions] askForMediaAccess(screen) failed', e);
        return true; // do not block if API not available
    }
}
// --- Create BrowserWindow ---
function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 900,
        minWidth: 1120,
        minHeight: 780,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            experimentalFeatures: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            media: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // --- Determine URL based on environment ---
    const isDev = !app.isPackaged || process.env.VITE_DEV === '1';
    console.log(`[main] Launching ClipForge in ${isDev ? 'DEV' : 'PROD'} mode`);

    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools({ mode: 'detach' });
        // Retry if renderer isn't ready yet (Vite warmup)
        win.webContents.on('did-fail-load', () => {
            console.warn('⚠️ Renderer not ready — retrying...');
            setTimeout(() => win.loadURL('http://localhost:5173'), 1000);
        });
    } else {
        const indexPath = path.join(__dirname, '../dist/index.html');
        win.loadFile(indexPath);
    }
}

// --- Electron Lifecycle ---
app.whenReady().then(async () => {
    await ensureScreenRecordingAccess();
    // Grant display capture and media permissions proactively
    try {
        const s = session?.defaultSession;
        if (s?.setPermissionRequestHandler) {
            s.setPermissionRequestHandler((wc, permission, callback, details) => {
                if (permission === 'display-capture' || permission === 'media') {
                    return callback(true);
                }
                return callback(false);
            });
        }
    } catch (e) {
        console.warn('[permissions] setPermissionRequestHandler failed:', e);
    }

    // ---------------- Custom Protocol for Media Streaming ----------------
    try {
        console.log('[protocol] registerStreamProtocol called');
        protocol.registerStreamProtocol('media', (request, callback) => {
            try {
                const reqUrl = new URL(request.url);
                const absPath = reqUrl.searchParams.get('path');
                const ext = absPath ? path.extname(absPath).toLowerCase() : '';
                const mime = ext === '.mp4' ? 'video/mp4' : ext === '.webm' ? 'video/webm' : ext === '.mov' ? 'video/quicktime' : 'application/octet-stream';
                if (!absPath || !fs.existsSync(absPath)) {
                    return callback({ statusCode: 404, headers: { 'Content-Type': 'text/plain' }, data: fs.createReadStream('/dev/null') });
                }
                const stat = fs.statSync(absPath);
                const size = stat.size;
                const range = request.headers?.Range || request.headers?.range;
                if (range && typeof range === 'string') {
                    const m = /bytes=(\d+)-(\d+)?/.exec(range);
                    let start = 0; let end = size - 1;
                    if (m) {
                        start = parseInt(m[1], 10);
                        if (m[2] != null) end = parseInt(m[2], 10);
                    }
                    start = isNaN(start) ? 0 : Math.min(Math.max(0, start), Math.max(0, size - 1));
                    end = isNaN(end) ? size - 1 : Math.min(Math.max(start, end), size - 1);
                    const chunkSize = end - start + 1;
                    callback({
                        statusCode: 206,
                        headers: {
                            'Content-Type': mime,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': String(chunkSize),
                            'Content-Range': `bytes ${start}-${end}/${size}`,
                        },
                        data: fs.createReadStream(absPath, { start, end }),
                    });
                } else {
                    callback({
                        statusCode: 200,
                        headers: {
                            'Content-Type': mime,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': String(size),
                        },
                        data: fs.createReadStream(absPath),
                    });
                }
            } catch (e) {
                console.warn('[media protocol] failed', e);
                callback({ statusCode: 500, headers: { 'Content-Type': 'text/plain' }, data: fs.createReadStream('/dev/null') });
            }
        });
        console.log('[protocol] media:// registered');
    } catch (e) {
        console.warn('[protocol] registerStreamProtocol failed', e);
    }

    createWindow();

    // Grant display-capture and media permissions for this window's session
    try {
        const ses = win.webContents.session;
        ses.setPermissionRequestHandler((_, permission, callback) => {
            if (permission === 'media' || permission === 'display-capture') {
                console.log('[main] granting screen capture permission');
                return callback(true);
            }
            return callback(false);
        });
    } catch (e) {
        console.warn('[main] setPermissionRequestHandler failed', e);
    }

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

// ---------------- Screen Source IPC ----------------
ipcMain.handle('screen:getSource', async () => {
    try {
        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        const pick = sources.find((s) => s.name === 'Entire Screen')
            || sources.find((s) => s.name === 'Screen 1')
            || sources[0];
        try { console.log('[screen:getSource]', sources.map(s => ({ id: s.id, name: s.name })), '→', pick && { id: pick.id, name: pick.name }); } catch { }
        return pick ? pick.id : undefined;
    } catch (e) {
        console.warn('[screen:getSource] failed', e);
        return undefined;
    }
});

// ---------------- Media URL IPC ----------------
ipcMain.handle('toMediaUrl', async (_event, filePath) => {
    try {
        if (!filePath) throw new Error('No filePath provided');
        const abs = path.resolve(String(filePath));
        const isDev = !app.isPackaged;
        const url = isDev
            ? `file://${abs}`
            : `media://file?path=${encodeURIComponent(abs)}`;
        console.log('[ipc] toMediaUrl', { filePath: abs, url });
        return { url };
    } catch {
        return { url: '' };
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
    // Finalize container to ensure seekable metadata (duration/cues)
    try {
        const ext = path.extname(rec.filePath || '').toLowerCase();
        if (ext === '.webm') {
            ffmpeg.setFfmpegPath(ffmpegPath);
            // Re-mux by re-encoding into a single MP4 with faststart for seekability
            const outPath = path.join(path.dirname(rec.filePath), `fixed-${path.basename(rec.filePath, ext)}.mp4`);
            await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(rec.filePath)
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .outputOptions([
                        '-movflags', '+faststart',
                        '-pix_fmt', 'yuv420p',
                        '-preset', 'ultrafast',
                        '-crf', '28',
                        '-y',
                    ])
                    .on('error', (err) => reject(err))
                    .on('end', () => resolve(null))
                    .save(outPath);
            });
            const exists = fs.existsSync(outPath);
            if (exists) {
                console.log('[record] remux: mp4 fixed container written', { outPath });
                return outPath;
            }
        }
    } catch (e) {
        console.warn('[record] remux failed, returning original file', e);
    }
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

// ---------------- High-level Recording IPC (compat) ----------------
ipcMain.handle('recording:start', async (_event, opts) => {
    const extension = (opts && typeof opts.extension === 'string' && opts.extension) || 'webm';
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clipforge-record-'));
    const filePath = path.join(dir, `record-${Date.now()}.${extension}`);
    const stream = fs.createWriteStream(filePath);
    const sessionId = `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    activeRecords.set(sessionId, { stream, filePath, dir });
    console.log('[recording:start]', { sessionId, filePath });
    return { success: true, sessionId, filePath };
});

ipcMain.handle('recording:stop', async (_event, payload) => {
    const sessionId = payload?.sessionId;
    const rec = activeRecords.get(sessionId);
    if (!rec) return { success: false, error: 'invalid_session' };
    await new Promise((resolve) => rec.stream.end(resolve));
    activeRecords.delete(sessionId);
    console.log('[recording:stop]', { sessionId, filePath: rec.filePath });
    return { success: true, filePath: rec.filePath };
});

// ---------------- Desktop sources (screen/window) ----------------
ipcMain.handle('desktop:getSources', async (_event, opts) => {
    return desktopCapturer.getSources(opts ?? { types: ['screen', 'window'] });
});

// ---------------- Media metadata (duration/size/dimensions) ----------------
ipcMain.removeHandler?.('media:getMetadata');
ipcMain.handle('media:getMetadata', async (_event, filePath) => {
    try {
        const abs = path.resolve(String(filePath));
        let sizeBytes = 0;
        try { sizeBytes = fs.statSync(abs).size; } catch { }

        // ffprobe via fluent-ffmpeg
        const probe = await new Promise((resolve) => {
            try {
                ffmpeg.ffprobe(abs, (err, data) => {
                    if (err) return resolve(undefined);
                    resolve(data);
                });
            } catch {
                resolve(undefined);
            }
        });

        let durationMs, width, height;
        try {
            const format = probe?.format;
            const streams = probe?.streams || [];
            durationMs = format?.duration ? Math.max(0, Math.round(format.duration * 1000)) : undefined;
            const v = streams.find((s) => s.codec_type === 'video');
            width = v?.width;
            height = v?.height;
        } catch { }

        return { durationMs, width, height, sizeBytes };
    } catch {
        return { durationMs: undefined, width: undefined, height: undefined, sizeBytes: undefined };
    }
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
                const durationSec = Math.max(0.05, (s.outMs - s.inMs) / 1000);
                await new Promise((resolve, reject) => {
                    const proc = ffmpeg()
                        .input(s.filePath)
                        // Use output-side trim for frame-accurate cuts and avoid black first frames
                        .setStartTime(s.inMs / 1000)
                        .duration(durationSec)
                        .outputOptions(['-y', '-r', '30', '-vsync', 'cfr', '-g', '60'])
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .audioFrequency(48000)
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
            // 2) Concat via filter (decode + re-encode) for smooth, consistent PTS
            await new Promise((resolve, reject) => {
                const proc = ffmpeg();
                tempSegments.forEach((p) => proc.input(p));
                const n = tempSegments.length;
                const inputs = Array.from({ length: n }, (_, i) => `[${i}:v][${i}:a]`).join('');
                const filter = `${inputs}concat=n=${n}:v=1:a=1[v][a]`;
                proc
                    .complexFilter([filter])
                    .outputOptions(['-map', '[v]', '-map', '[a]', '-r', '30', '-vsync', 'cfr', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y'])
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .audioFrequency(48000)
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

// Serve media as base64 data URL (MP4)
ipcMain.handle('media:serve', async (_event, filePath) => {
    try {
        const abs = path.resolve(String(filePath));
        const data = fs.readFileSync(abs);
        const base64 = Buffer.from(data).toString('base64');
        const url = `data:video/mp4;base64,${base64}`;
        try { console.log('[media:serve] success', { path: abs, bytes: data.length }); } catch { }
        return url;
    } catch (err) {
        console.warn('[media:serve] failed', err);
        return undefined;
    }
});