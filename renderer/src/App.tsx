import React from 'react';
import { Preview } from './components/Preview';
import { Timeline } from './components/Timeline';
import {
    extractVideoMetadataAndThumbnail,
    formatBytes,
    formatDuration,
    MAX_FILE_BYTES,
    SUPPORTED_EXTENSIONS,
    validateFileBasic,
    type MediaItemMeta
} from './lib/media';
import { generateId } from './lib/timeline';
import { useMediaStore } from './store/media';
import { useTimelineStore } from './store/timeline';

type Toast = { id: string; kind: 'error' | 'info' | 'success'; message: string };

export default function App() {
    const electron = (window as any).electron;

    const [pong, setPong] = React.useState<string>('');
    const items = useMediaStore((s) => s.items);
    const addItem = useMediaStore((s) => s.addItem);
    const updateItem = useMediaStore((s) => s.updateItem);
    const [isDragging, setIsDragging] = React.useState(false);
    const [toasts, setToasts] = React.useState<Toast[]>([]);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [recordMode, setRecordMode] = React.useState<undefined | 'screen' | 'webcam' | 'pip'>(undefined);
    const [recordElapsedMs, setRecordElapsedMs] = React.useState<number>(0);
    const recordTimerRef = React.useRef<number | null>(null);
    const recordersRef = React.useRef<{
        kind: 'single' | 'pip';
        rec1?: MediaRecorder;
        rec2?: MediaRecorder;
        session1?: string;
        session2?: string;
        pending1?: Promise<any>[];
        pending2?: Promise<any>[];
        bytes1?: number;
        bytes2?: number;
        stopping1?: boolean;
    } | null>(null);

    // Live capture debug previews
    const debugScreenRef = React.useRef<HTMLVideoElement | null>(null);
    const debugCamRef = React.useRef<HTMLVideoElement | null>(null);
    const [screenError, setScreenError] = React.useState<string | undefined>(undefined);
    const [camError, setCamError] = React.useState<string | undefined>(undefined);

    const playheadMs = useTimelineStore((s) => s.playheadMs);
    const togglePlay = useTimelineStore((s) => s.togglePlay);
    const deleteSelection = useTimelineStore((s) => s.deleteSelection);
    const splitAt = useTimelineStore((s) => s.splitAt);
    const undo = useTimelineStore((s) => s.undo);
    const copySelection = useTimelineStore((s) => s.copySelection);
    const pasteAt = useTimelineStore((s) => s.pasteAt);
    const selectedClipId = useTimelineStore((s) => s.selectedClipId);
    const tracks = useTimelineStore((s) => s.tracks);
    const clipsSourceIds = useTimelineStore(
        (s) => new Set(s.tracks.flatMap((t) => t.clips.map((c) => c.sourceId)))
    );

    // Bridge diagnostics (one-time)
    React.useEffect(() => {
        try {
            console.log('[bridge:keys]', Object.keys((window as any).electron || {}));
            if (typeof (window as any).electron?.getDesktopSources !== 'function') {
                console.error('[bridge] getDesktopSources STILL missing');
            }
        } catch { }
    }, []);

    // Export UI state
    const [showExport, setShowExport] = React.useState(false);
    const [resolution, setResolution] = React.useState<'720p' | '1080p' | 'source'>('1080p');
    const [destinationPath, setDestinationPath] = React.useState<string | undefined>(undefined);
    const [exportJobId, setExportJobId] = React.useState<string | undefined>(undefined);
    const [exportProgress, setExportProgress] = React.useState<number>(0);
    const [exportStatus, setExportStatus] = React.useState<string>('');

    const mediaIndex = React.useMemo(() => Object.fromEntries(items.map((it) => [it.id, it])), [items]);

    // --- Debug exposure (media + timeline state) ---
    React.useEffect(() => {
        try {
            (window as any).__MEDIA_DEBUG__ = items;
            (window as any).__TL_DEBUG__ = useTimelineStore.getState();
        } catch {
            // ignore debug exposure errors
        }
    }, [items]);

    // --- IPC Health Check ---
    React.useEffect(() => {
        let cancelled = false;
        electron
            ?.invoke('app:ping', 'hello')
            .then((res: string) => {
                if (!cancelled) setPong(res);
            })
            .catch(() => {
                if (!cancelled) setPong('bridge unavailable');
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // --- Export Progress Listeners ---
    React.useEffect(() => {
        const offProg = electron?.onExportProgress?.((_evt: unknown, data: { jobId: string; percent: number; status?: string }) => {
            if (data.jobId !== exportJobId) return;
            setExportProgress(Math.max(0, Math.min(100, data.percent)));
            if (data.status) setExportStatus(data.status);
        });
        const offDone = electron?.onExportComplete?.((_evt: unknown, data: { jobId: string; success: boolean; outputPath?: string; error?: string }) => {
            if (data.jobId !== exportJobId) return;
            if (data.success) {
                showToast('success', 'Export complete');
            } else {
                if (data.error === 'cancelled') {
                    showToast('info', 'Export cancelled');
                } else {
                    showToast('error', 'Export failed: ' + (data.error ?? 'Unknown error'));
                }
            }
            setExportJobId(undefined);
            setExportProgress(0);
            setExportStatus('');
            setShowExport(false);
        });
        return () => {
            offProg && offProg();
            offDone && offDone();
        };
    }, [exportJobId]);

    // --- Keyboard Shortcuts ---
    React.useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            const meta = e.ctrlKey || e.metaKey;
            if (e.key === ' ' && !meta) {
                e.preventDefault();
                togglePlay();
                return;
            }
            if ((e.key === 'Delete' || e.key === 'Backspace') && !meta) {
                e.preventDefault();
                deleteSelection();
                return;
            }
            if (meta && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
                return;
            }
            if (meta && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                if (selectedClipId != null) splitAt(selectedClipId, playheadMs);
                return;
            }
            if (meta && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                copySelection();
                return;
            }
            if (meta && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                pasteAt(playheadMs);
                return;
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [togglePlay, deleteSelection, undo, splitAt, copySelection, pasteAt, playheadMs, selectedClipId]);

    function showToast(kind: Toast['kind'], message: string) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setToasts((t) => [...t, { id, kind, message }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    }

    // --- File Handling ---
    async function handleFiles(files: FileList | File[]) {
        const fileArray = Array.from(files);
        for (const file of fileArray) {
            const validation = validateFileBasic(file);
            if (!validation.ok) {
                showToast('error', `${file.name}: ${validation.reason}`);
                continue;
            }

            // Try to get a reliable path
            let filePath = (file as any).path;
            if (!filePath && window.electron?.getPathForFileName) {
                try {
                    const result = await window.electron.getPathForFileName(file.name);
                    if (typeof result === 'string' && result.length > 0) {
                        filePath = result;
                        console.log('[media] resolved via IPC', { name: file.name, path: filePath });
                    }
                } catch (err) {
                    console.warn('[media] failed to resolve file path via IPC', err);
                }
            }

            const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
            const base: MediaItemMeta = {
                id,
                file,
                path: filePath,
                name: file.name,
                sizeBytes: file.size,
            };

            console.log('[media] add', { id, name: base.name, path: base.path, sizeBytes: base.sizeBytes });
            addItem(base);

            try {
                const meta = await extractVideoMetadataAndThumbnail(file);
                updateItem(id, { ...meta, path: filePath });
            } catch {
                updateItem(id, { error: 'Failed to parse metadata' });
                showToast('error', `${file.name}: failed to read metadata`);
            }
        }
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer?.files?.length) {
            void handleFiles(e.dataTransfer.files);
        }
    }

    function onDragOver(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(true);
    }

    function onDragLeave(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
    }

    async function openPicker() {
        // Try IPC-based import if implemented; otherwise fallback to hidden input
        try {
            const picked = await electron?.invoke?.('media:import');
            if (picked && picked.length) {
                for (const item of picked) {
                    const filePath = item.path;
                    const fileName = item.name;
                    const fakeFile = new File([], fileName);
                    const id = `${fileName}-${item.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
                    const base: MediaItemMeta = {
                        id,
                        file: fakeFile,
                        path: filePath,
                        name: fileName,
                        sizeBytes: item.size,
                    };
                    addItem(base);
                    try {
                        const meta = await electron?.invoke?.('media:getMetadata', filePath);
                        if (meta) updateItem(id, { ...meta, path: filePath });
                    } catch {
                        updateItem(id, { error: 'Failed to read metadata', path: filePath });
                    }
                }
                return;
            }
        } catch { }
        inputRef.current?.click();
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length) {
            void handleFiles(e.target.files);
            e.currentTarget.value = '';
        }
    }

    function onLibDragStart(e: React.DragEvent, id: string) {
        e.dataTransfer.setData('text/sourceId', id);
        e.dataTransfer.effectAllowed = 'copy';
    }

    const dropBorder = isDragging ? 'var(--navy)' : '#2A2A31';
    const dropBg = isDragging ? 'rgba(15, 23, 42, 0.35)' : 'transparent';

    // --- Recording implementation ---
    async function startScreenRecording() {
        if (recordMode) return;
        try {
            console.log('[record] startScreenRecording: begin');
            const mockPath = (window as any).__TEST_MOCK_RECORDING_PATH__ as string | undefined;
            if (mockPath) {
                // Test-mode: simulate recording session; actual file provided by test
                recordersRef.current = { kind: 'single', session1: mockPath };
                startTimer('screen');
                console.log('[record] startScreenRecording: test-mode mock active', { mockPath });
                return;
            }
            // Use preload bridge to obtain desktop sources
            if (typeof (window as any).electron?.getDesktopSources !== 'function') {
                console.warn('[record] getDesktopSources missing from bridge');
                showToast('error', 'Bridge missing getDesktopSources. Relaunch app.');
                throw new Error('no_bridge_getDesktopSources');
            }
            const sources: any[] = await (window as any).electron.getDesktopSources({ types: ['screen'] });
            const source = sources.find((s: any) => s.name === 'Entire Screen') || sources[0];
            if (!source) {
                console.warn('[record] No screen sources detected');
                showToast('error', 'No screens detected. Enable Screen Recording and relaunch.');
                throw new Error('no_screen_source');
            }
            console.log('[record] selected source:', { id: source.id, name: source.name });
            const display: MediaStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id,
                        maxFrameRate: 30,
                    },
                },
            } as any);
            const vCount = (display.getVideoTracks?.() || []).length;
            try { console.log('[record] got screen stream', vCount, 'video tracks'); } catch { }
            if (vCount === 0) {
                console.warn('[record] no video track detected — Screen Recording permission may be missing');
                showToast('error', 'No video track. Enable Screen Recording in System Settings and relaunch.');
                setScreenError('Screen capture failed');
            } else {
                setScreenError(undefined);
            }

            // Attach live screen preview
            try {
                const sv = debugScreenRef.current;
                if (sv) {
                    (sv as any).srcObject = display;
                    await sv.play().catch(() => { });
                    console.log('[record] attached screen preview');
                }
            } catch { }

            // Acquire webcam preview in parallel
            try {
                console.log('[record] requesting webcam…');
                const cam = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                console.log('[record] getUserMedia success (webcam):', { v: cam.getVideoTracks().length, a: cam.getAudioTracks().length });
                const cv = debugCamRef.current;
                if (cv) { (cv as any).srcObject = cam; await cv.play().catch(() => { }); console.log('[record] attached webcam preview'); }
                setCamError(undefined);
            } catch (e) {
                console.warn('[record] webcam capture failed', e);
                setCamError('Webcam capture failed');
            }

            const stream = await combineWithMic(display);
            console.log('[record] combineWithMic resolved: tracks=', stream?.getTracks?.().length, stream?.getTracks?.().map((t: MediaStreamTrack) => ({ kind: t.kind, enabled: t.enabled })));
            const mimeType = pickMimeType();
            console.log('[record] mimeType selected:', mimeType);
            const { sessionId, filePath } = await electron.recordOpenFile({ extension: 'webm' });
            console.log('[record] recordOpenFile response:', { sessionId, filePath });
            let rec: MediaRecorder;
            try {
                rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            } catch (err: any) {
                console.error('[record] MediaRecorder ctor threw:', { name: err?.name, message: err?.message, stack: err?.stack });
                throw err;
            }
            const pending: Promise<any>[] = [];
            let totalBytes = 0;
            let finalResolved = false;
            let finalResolve: () => void = () => { };
            const final = new Promise<void>((res) => { finalResolve = res; });
            rec.ondataavailable = async (evt: BlobEvent) => {
                if (evt.data && evt.data.size) {
                    const p = (async () => {
                        const buf = await evt.data.arrayBuffer();
                        totalBytes += buf.byteLength;
                        console.log('[record] chunk', { size: buf.byteLength, totalBytes });
                        await electron.recordAppendChunk(sessionId, buf);
                    })();
                    pending.push(p);
                    await p.catch(() => { });
                    // If stop() triggered a final dataavailable, resolve after its append completes
                    if (recordersRef.current?.rec1 === rec && recordersRef.current?.stopping1 && !finalResolved) {
                        finalResolved = true;
                        try { await p; } catch { }
                        try { finalResolve(); } catch { }
                    }
                }
            };
            rec.onstop = async () => {
                try {
                    console.log('[record] onstop: waiting pending', { count: pending.length, totalBytes });
                    // Ensure the final dataavailable (triggered by stop/requestData) is flushed
                    try { await final; } catch { }
                    await Promise.allSettled(pending);
                    // Small post-stop delay to allow encoder to finish header/cues
                    await new Promise((r) => setTimeout(r, 150));
                    console.log('[record] onstop: finalize complete', { totalBytes });
                    const closedPath = await electron.recordCloseFile(sessionId);
                    const finalPath = (typeof closedPath === 'string' && closedPath) ? closedPath : filePath;
                    console.log('[record] onstop: close result', { closedPath, finalPath });
                    await addRecordedToLibrary(finalPath, 'screen');
                    cleanupTimer();
                    setRecordMode(undefined);
                    console.log('[record] onstop: session closed and media added', { sessionId, finalPath });
                } catch (e) {
                    console.error('[record] finalize failed', e);
                }
            };
            console.log('[record] starting MediaRecorder with timeslice=1000ms');
            rec.start(1000);
            recordersRef.current = { kind: 'single', rec1: rec, session1: sessionId, pending1: pending, bytes1: totalBytes, stopping1: false } as any;
            startTimer('screen');
            console.log('[record] startScreenRecording: recorder active');
        } catch (err) {
            console.error('[record] startScreenRecording failed:', { name: (err as any)?.name, message: (err as any)?.message, stack: (err as any)?.stack });
            showToast('error', 'Failed to start screen recording');
        }
    }

    async function startWebcamRecording() {
        if (recordMode) return;
        try {
            console.log('[record] startWebcamRecording: begin');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log('[record] webcam tracks:', { v: stream.getVideoTracks().length, a: stream.getAudioTracks().length });
            // Attach live webcam preview
            try {
                const cv = debugCamRef.current; if (cv) { (cv as any).srcObject = stream; await cv.play().catch(() => { }); console.log('[record] attached webcam live preview'); }
            } catch { }

            const mimeType = pickMimeType();
            const { sessionId, filePath } = await electron.recordOpenFile({ extension: 'webm' });
            console.log('[record] webcam recordOpenFile response:', { sessionId, filePath });
            const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

            const pending: Promise<any>[] = [];
            let totalBytes = 0;
            let finalResolved = false;
            let finalResolve: () => void = () => { };
            const final = new Promise<void>((res) => { finalResolve = res; });

            rec.ondataavailable = async (evt: BlobEvent) => {
                if (evt.data && evt.data.size) {
                    const p = (async () => {
                        const buf = await evt.data.arrayBuffer(); totalBytes += buf.byteLength;
                        console.log('[record:webcam] chunk', { size: buf.byteLength, totalBytes });
                        await electron.recordAppendChunk(sessionId, buf);
                    })();
                    pending.push(p);
                    await p.catch(() => { });
                    if (recordersRef.current?.rec1 === rec && (recordersRef.current as any)?.stopping1 && !finalResolved) {
                        finalResolved = true; try { await p; } catch { }; try { finalResolve(); } catch { }
                    }
                }
            };
            rec.onstop = async () => {
                try {
                    console.log('[record:webcam] onstop: waiting pending', { count: pending.length, totalBytes });
                    try { await final; } catch { }
                    await Promise.allSettled(pending);
                    await new Promise((r) => setTimeout(r, 150));
                    console.log('[record:webcam] finalize complete', { totalBytes });
                    const closedPath = await electron.recordCloseFile(sessionId);
                    const finalPath = (typeof closedPath === 'string' && closedPath) ? closedPath : filePath;
                    console.log('[record:webcam] close result', { closedPath, finalPath });
                    await addRecordedToLibrary(finalPath, 'webcam');
                    cleanupTimer(); setRecordMode(undefined);
                } catch (e) {
                    console.error('[record:webcam] finalize failed', e);
                }
            };
            console.log('[record:webcam] starting MediaRecorder with timeslice=1000ms');
            rec.start(1000);
            recordersRef.current = { kind: 'single', rec1: rec, session1: sessionId, pending1: pending, bytes1: totalBytes, stopping1: false } as any;
            startTimer('webcam');
        } catch {
            showToast('error', 'Failed to start webcam recording');
        }
    }

    // --- Picture-in-Picture (PiP) Recording ---
    async function startPiPRecording() {
        if (recordMode) return;
        try {
            console.log('[record] startPiPRecording: begin');

            // ✅ REPLACEMENT: Use Electron desktopCapturer instead of getDisplayMedia
            const { desktopCapturer } = (window as any).electron || require('electron');
            const sources = await desktopCapturer.getSources({ types: ['screen'] });
            if (!sources.length) throw new Error('no_screen_sources');
            console.log('[record] desktopCapturer sources:', sources.map((s: any) => s.name));

            const screenStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sources[0].id,
                    },
                },
            } as any);

            // Combine with mic input for PiP audio
            const combinedScreenStream = await combineWithMic(screenStream);
            const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const mimeType = pickMimeType();

            const f1 = await electron.recordOpenFile({ extension: 'webm' });
            const f2 = await electron.recordOpenFile({ extension: 'webm' });

            const rec1 = new MediaRecorder(combinedScreenStream, mimeType ? { mimeType } : undefined);
            const rec2 = new MediaRecorder(camStream, mimeType ? { mimeType } : undefined);
            const pending1: Promise<any>[] = [];
            const pending2: Promise<any>[] = [];
            let bytes1 = 0, bytes2 = 0;
            rec1.ondataavailable = async (evt: BlobEvent) => {
                if (evt.data && evt.data.size) {
                    const p = (async () => {
                        const buf = await evt.data.arrayBuffer(); bytes1 += buf.byteLength; console.log('[record:pip] screen chunk', { size: buf.byteLength, bytes1 }); await electron.recordAppendChunk(f1.sessionId, buf);
                    })(); pending1.push(p); await p.catch(() => { });
                }
            };
            rec2.ondataavailable = async (evt: BlobEvent) => {
                if (evt.data && evt.data.size) {
                    const p = (async () => {
                        const buf = await evt.data.arrayBuffer(); bytes2 += buf.byteLength; console.log('[record:pip] cam chunk', { size: buf.byteLength, bytes2 }); await electron.recordAppendChunk(f2.sessionId, buf);
                    })(); pending2.push(p); await p.catch(() => { });
                }
            };

            let stoppedCount = 0;
            const onStop = async () => {
                stoppedCount++;
                if (stoppedCount < 2) return;
                console.log('[record:pip] onstop: waiting pending', { pending1: pending1.length, pending2: pending2.length, bytes1, bytes2 });
                await Promise.allSettled(pending1);
                await Promise.allSettled(pending2);
                // Small post-stop delay to allow encoder to finish header/cues
                await new Promise((r) => setTimeout(r, 150));
                console.log('[record:pip] onstop: finalize complete', { bytes1, bytes2 });
                await electron.recordCloseFile(f1.sessionId);
                await electron.recordCloseFile(f2.sessionId);
                const outPath = await electron.recordComposePiP({
                    screenPath: f1.filePath,
                    webcamPath: f2.filePath,
                    outExtension: 'mp4',
                });
                await addRecordedToLibrary(outPath, 'pip');
                cleanupTimer();
                setRecordMode(undefined);
            };

            rec1.onstop = onStop;
            rec2.onstop = onStop;

            rec1.start(1000);
            rec2.start(1000);
            recordersRef.current = {
                kind: 'pip',
                rec1,
                rec2,
                session1: f1.sessionId,
                session2: f2.sessionId,
                pending1,
                pending2,
                bytes1,
                bytes2,
            };

            startTimer('pip');
            console.log('[record] startPiPRecording: recorder active');
        } catch (err) {
            console.error('[record] startPiPRecording failed:', err);
            showToast('error', 'Failed to start PiP recording');
        }
    }

    async function stopRecording() {
        const ref = recordersRef.current;
        if (!ref) return;
        try {
            // Mock path mode: no rec1/rec2 present; add provided path directly
            const mockPath = (!ref.rec1 && !ref.rec2) ? ref.session1 : undefined;
            if (mockPath) {
                await addRecordedToLibrary(mockPath, recordMode || 'screen');
                cleanupTimer();
                setRecordMode(undefined);
                recordersRef.current = null;
                return;
            }
            if (ref.rec1 && ref.rec1.state !== 'inactive') {
                (ref as any).stopping1 = true;
                try { ref.rec1.requestData(); } catch { }
                ref.rec1.stop();
            }
            if (ref.rec2 && ref.rec2.state !== 'inactive') {
                try { ref.rec2.requestData(); } catch { }
                ref.rec2.stop();
            }
        } catch { }
    }

    function startTimer(mode: 'screen' | 'webcam' | 'pip') {
        setRecordMode(mode);
        setRecordElapsedMs(0);
        if (recordTimerRef.current) cancelAnimationFrame(recordTimerRef.current);
        let start = performance.now();
        const step = (now: number) => {
            setRecordElapsedMs(Math.max(0, Math.round(now - start)));
            recordTimerRef.current = requestAnimationFrame(step);
        };
        recordTimerRef.current = requestAnimationFrame(step);
    }

    function cleanupTimer() {
        if (recordTimerRef.current) cancelAnimationFrame(recordTimerRef.current);
        recordTimerRef.current = null;
        setRecordElapsedMs(0);
    }

    async function addRecordedToLibrary(filePath: string, kind: 'screen' | 'webcam' | 'pip') {
        const baseName = filePath.split(/[/\\]/).pop() || `${kind}-${Date.now()}.webm`;
        const id = generateId('rec');
        const base: MediaItemMeta = {
            id,
            file: new File([], baseName),
            path: filePath,
            // ensure both fields point to finalized path for preview/export consumers
            // @ts-ignore - tolerate extra field if not in type
            finalPath: filePath,
            name: baseName,
            sizeBytes: 0,
        };
        addItem(base);
        try {
            const meta = await (window as any).electron.invoke('media:getMetadata', filePath);
            try { console.log('[record] media:getMetadata result', { id, filePath, meta }); } catch { }
            // propagate finalized path into both path and finalPath
            updateItem(id, { ...(meta || {}), path: filePath, ...({ finalPath: filePath } as any) });
            // Generate lightweight thumbnail from a seeked frame (avoid black first frame)
            try {
                const dataUrl = await (window as any).electron?.getMediaDataUrl?.(filePath);
                if (dataUrl) {
                    const v = document.createElement('video');
                    v.muted = true; v.playsInline = true; v.src = dataUrl;
                    await new Promise((res) => v.addEventListener('loadedmetadata', res, { once: true }));
                    const target = Math.min(0.5, Math.max(0, (v.duration || 1) - 0.1));
                    await new Promise<void>((res) => {
                        const onSeek = () => { v.removeEventListener('seeked', onSeek); res(); };
                        v.addEventListener('seeked', onSeek, { once: true });
                        try { v.currentTime = target; } catch { res(); }
                    });
                    const canvas = document.createElement('canvas');
                    const w = 160; const h = Math.round((v.videoHeight || 1) * (w / (v.videoWidth || 1)));
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    if (ctx) { ctx.drawImage(v, 0, 0, w, h); const thumb = canvas.toDataURL('image/jpeg', 0.75); updateItem(id, { thumbnailDataUrl: thumb }); }
                }
            } catch { }
            const duration = (meta?.durationMs ?? 0);
            const startMs = useTimelineStore.getState().playheadMs;
            useTimelineStore.getState().addClip({
                sourceId: id,
                name: baseName,
                file: base.file,
                startMs,
                inMs: 0,
                outMs: Math.max(1000, duration || 1000),
                trackId: 't1',
                sourcePath: filePath,
            });
            showToast('success', `Added ${kind} recording`);
        } catch (e) {
            showToast('error', 'Failed to read recorded metadata');
        }
    }

    // --- UI Render ---
    return (
        <div style={{ padding: 16, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', ['--color-brand' as any]: '#D0A866', ['--color-brand-foreground' as any]: '#0B0C10', ['--navy' as any]: '#0F172A' }}>
            {/* HEADER */}
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                    borderBottom: '1px solid #2A2A31',
                }}
            >
                <div>
                    <h1 style={{ fontSize: 20, margin: 0, color: 'var(--color-brand)' }}>🎬 ClipForge Desktop</h1>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={openPicker}
                        style={{
                            background: 'var(--color-brand)',
                            color: 'var(--color-brand-foreground)',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 12px',
                            cursor: 'pointer',
                        }}
                    >
                        Import
                    </button>
                    <button
                        onClick={() => setShowExport(true)}
                        style={{
                            background: 'var(--color-brand)',
                            color: 'var(--color-brand-foreground)',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 12px',
                            cursor: 'pointer',
                        }}
                    >
                        Export
                    </button>
                    {/* Recording Controls */}
                    <button
                        onClick={() => void startScreenRecording()}
                        disabled={!!recordMode}
                        aria-label="Record Screen"
                        style={{ background: recordMode ? '#1F2937' : 'var(--color-brand)', color: 'var(--color-brand-foreground)', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: recordMode ? 'not-allowed' : 'pointer' }}
                    >
                        Record Screen
                    </button>
                    <button
                        onClick={() => void startWebcamRecording()}
                        disabled={!!recordMode}
                        aria-label="Record Webcam"
                        style={{ background: recordMode ? '#1F2937' : 'var(--color-brand)', color: 'var(--color-brand-foreground)', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: recordMode ? 'not-allowed' : 'pointer' }}
                    >
                        Record Webcam
                    </button>
                    <button
                        onClick={() => void startPiPRecording()}
                        disabled={!!recordMode}
                        aria-label="Record Screen + Webcam"
                        style={{ background: recordMode ? '#1F2937' : 'var(--color-brand)', color: 'var(--color-brand-foreground)', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: recordMode ? 'not-allowed' : 'pointer' }}
                    >
                        Screen+Webcam
                    </button>
                    {recordMode ? (
                        <button
                            onClick={() => void stopRecording()}
                            aria-label="Stop Recording"
                            style={{ background: '#B91C1C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
                        >
                            Stop
                        </button>
                    ) : null}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(',')}
                    multiple
                    onChange={onInputChange}
                    style={{ display: 'none' }}
                />
            </header>
            {/* Recording status */}
            {recordMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8, color: '#E5E7EB' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#EF4444', display: 'inline-block' }} />
                    <span style={{ fontSize: 12 }}>{recordMode.toUpperCase()} • {formatDuration(recordElapsedMs)}</span>
                </div>
            ) : null}

            {/* MAIN */}
            <main style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, marginTop: 16 }}>
                <aside>
                    <h3 style={{ marginTop: 0, fontSize: 16, color: '#E5E7EB' }}>Media Library</h3>
                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        role="button"
                        tabIndex={0}
                        onClick={openPicker}
                        onKeyDown={(e) => e.key === 'Enter' && openPicker()}
                        style={{
                            border: `2px dashed ${dropBorder}`,
                            background: dropBg,
                            borderRadius: 12,
                            padding: 16,
                            textAlign: 'center',
                            color: '#E5E7EB',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <div style={{ marginBottom: 8, color: '#9CA3AF' }}>Drag files here</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                            Supported: {SUPPORTED_EXTENSIONS.join(', ').toUpperCase()} • Max{' '}
                            {formatBytes(MAX_FILE_BYTES)}
                        </div>
                    </div>

                    {/* Media Items */}
                    <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                        {items.length === 0 ? (
                            <div style={{ color: '#9CA3AF', fontSize: 14 }}>
                                No media yet. Import to get started.
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => onLibDragStart(e, item.id)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '96px 1fr',
                                        gap: 12,
                                        border: '1px solid #243047',
                                        borderRadius: 8,
                                        padding: 8,
                                        background: 'var(--navy)',
                                        maxWidth: '100%',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 96,
                                            height: 54,
                                            background: '#0B1220',
                                            borderRadius: 6,
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.thumbnailDataUrl ? (
                                            <img
                                                src={item.thumbnailDataUrl}
                                                alt="thumbnail"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span style={{ color: '#9CA3AF', fontSize: 12 }}>thumb</span>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <strong
                                                style={{
                                                    fontSize: 14,
                                                    color: '#E5E7EB',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.name}
                                            </strong>
                                            {clipsSourceIds.has(item.id) && (
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        color: 'var(--color-brand)',
                                                        border: '1px solid var(--color-brand)',
                                                        borderRadius: 999,
                                                        padding: '0 6px',
                                                    }}
                                                >
                                                    on timeline
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
                                            {item.durationMs != null ? formatDuration(item.durationMs) : '—'} •{' '}
                                            {item.width && item.height
                                                ? `${item.width}×${item.height}`
                                                : '—'} • {formatBytes(item.sizeBytes)}
                                        </div>
                                        {item.path && (
                                            <div
                                                style={{
                                                    color: '#6B7280',
                                                    fontSize: 11,
                                                    marginTop: 4,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.path}
                                            </div>
                                        )}
                                        {item.error && (
                                            <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
                                                {item.error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* TIMELINE + PREVIEW */}
                <section>
                    <div style={{ display: 'grid', gap: 12 }}>
                        {/* Live capture debug preview row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ position: 'relative', background: '#0F172A', border: '1px solid #2A2A31', borderRadius: 8, overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 6, left: 8, color: '#9CA3AF', fontSize: 12 }}>Screen (live)</div>
                                <video ref={debugScreenRef} muted playsInline style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                                {screenError ? (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                                        {screenError}
                                    </div>
                                ) : null}
                            </div>
                            <div style={{ position: 'relative', background: '#0F172A', border: '1px solid #2A2A31', borderRadius: 8, overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 6, left: 8, color: '#9CA3AF', fontSize: 12 }}>Webcam (live)</div>
                                <video ref={debugCamRef} muted playsInline style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                                {camError ? (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                                        {camError}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <Preview mediaIndex={mediaIndex} />
                        <Timeline mediaIndex={mediaIndex} />
                    </div>
                </section>
            </main>

            {showExport ? (
                <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#0B0C10', border: '1px solid #374151', borderRadius: 12, padding: 16, width: 420 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <strong style={{ color: '#E5E7EB' }}>Export Video</strong>
                            <button onClick={() => (exportJobId ? undefined : setShowExport(false))} aria-label="Close"
                                style={{ background: 'transparent', color: '#9CA3AF', border: 'none', cursor: exportJobId ? 'not-allowed' : 'pointer' }}>✕</button>
                        </div>
                        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                            <label style={{ color: '#9CA3AF', fontSize: 12 }}>Resolution</label>
                            <select value={resolution} onChange={(e) => setResolution(e.target.value as any)}
                                style={{ background: '#111827', color: '#E5E7EB', border: '1px solid #374151', borderRadius: 6, padding: '6px 10px' }}>
                                <option value="720p">720p</option>
                                <option value="1080p">1080p</option>
                                <option value="source">Source</option>
                            </select>
                            <label style={{ color: '#9CA3AF', fontSize: 12 }}>Destination</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input readOnly value={destinationPath ?? ''} placeholder="Choose path…" style={{ flex: 1, background: '#111827', color: '#E5E7EB', border: '1px solid #374151', borderRadius: 6, padding: '6px 10px' }} />
                                <button onClick={async () => {
                                    const p = await electron?.exportChooseDestination?.('export.mp4');
                                    if (p) setDestinationPath(p);
                                }}
                                    style={{ background: '#111827', color: '#E5E7EB', border: '1px solid #374151', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Choose</button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                            {exportJobId ? (
                                <button onClick={async () => { if (exportJobId) await electron?.exportCancel?.(exportJobId); }}
                                    style={{ background: '#B91C1C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Cancel</button>
                            ) : (
                                <button
                                    onClick={async () => {
                                        if (!destinationPath) { showToast('error', 'Choose destination'); return; }
                                        try {
                                            const snapshot = useTimelineStore.getState().tracks.flatMap((t) => t.clips);
                                            console.log('[export] clip snapshot', snapshot.map((c) => ({ id: c.id, sourceId: c.sourceId, startMs: c.startMs, inMs: c.inMs, outMs: c.outMs, filePath: (c.file as any)?.path })));
                                        } catch { }
                                        const segments = buildExportSegments(tracks, mediaIndex, (msg) => showToast('error', msg));
                                        if (segments.length === 0) {
                                            console.warn('[export] planner produced 0 segments');
                                        }
                                        if (segments.length === 0) { showToast('error', 'Timeline is empty'); return; }
                                        try {
                                            const res = await electron?.exportStart?.({ resolution, destinationPath, segments });
                                            if (res?.jobId) setExportJobId(res.jobId);
                                        } catch (e: any) {
                                            showToast('error', 'Failed to start export');
                                        }
                                    }}
                                    style={{ background: destinationPath ? 'var(--color-brand)' : '#1F2937', color: 'var(--color-brand-foreground)', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: destinationPath ? 'pointer' : 'not-allowed' }}
                                    aria-label="Start export"
                                    disabled={!destinationPath}
                                >
                                    Export
                                </button>
                            )}
                        </div>

                        {exportJobId ? (
                            <div style={{ marginTop: 16 }}>
                                <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 6 }}>{exportStatus || 'Exporting…'}</div>
                                <div style={{ height: 10, background: '#111827', border: '1px solid #374151', borderRadius: 999, overflow: 'hidden' }}>
                                    <div style={{ width: `${exportProgress}%`, height: '100%', background: 'var(--color-brand)' }} />
                                </div>
                                <div style={{ color: '#E5E7EB', fontSize: 12, marginTop: 6 }}>{Math.round(exportProgress)}%</div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {/* TOASTS */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: 'grid',
                    gap: 8,
                }}
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        style={{
                            background:
                                t.kind === 'error'
                                    ? '#2A0F12'
                                    : t.kind === 'success'
                                        ? '#0F2A19'
                                        : '#111827',
                            color: '#E5E7EB',
                            border: `1px solid ${t.kind === 'error'
                                ? '#B91C1C'
                                : t.kind === 'success'
                                    ? '#15803D'
                                    : '#374151'
                                }`,
                            borderRadius: 8,
                            padding: '10px 12px',
                            minWidth: 240,
                        }}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

/** --- Helper for export segment building --- */
function buildExportSegments(
    tracks: ReturnType<typeof useTimelineStore.getState>['tracks'],
    mediaIndex: Record<string, MediaItemMeta>,
    onError?: (msg: string) => void,
): Array<{ filePath: string; inMs: number; outMs: number }> {
    const clips = tracks.flatMap((t, idx) =>
        t.clips.map((c) => ({ trackIndex: idx, clip: c }))
    );
    if (clips.length === 0) return [];
    const boundaries = new Set<number>();
    for (const { clip } of clips) {
        const start = clip.startMs;
        const end = clip.startMs + (clip.outMs - clip.inMs);
        boundaries.add(start);
        boundaries.add(end);
    }
    const sorted = Array.from(boundaries).sort((a, b) => a - b);
    const segments: Array<{ filePath: string; inMs: number; outMs: number }> = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        const a = sorted[i];
        const b = sorted[i + 1];
        if (b <= a) continue;
        // pick active clip by priority (track 1 over 2)
        let active: { trackIndex: number; clip: any } | undefined;
        for (let tIdx = 0; tIdx < 2; tIdx++) {
            const hit = clips.find(({ trackIndex, clip }) => trackIndex === tIdx && a >= clip.startMs && b <= clip.startMs + (clip.outMs - clip.inMs));
            if (hit) { active = hit; break; }
        }
        if (!active) continue; // gap
        const c = active.clip;
        const explicitPath = c.sourcePath as string | undefined;
        const indexPath = mediaIndex[c.sourceId]?.path as string | undefined;
        const candidatePath = (c.file as any)?.path as string | undefined;
        const filePath = explicitPath || indexPath || candidatePath;
        if (!filePath) {
            console.warn('[export] clip has no file path', { sourceId: c.sourceId, explicitPath, indexPath, candidatePath, name: c.name });
            onError?.('Clip missing file path');
            continue;
        }
        const relIn = c.inMs + (a - c.startMs);
        const relOut = relIn + (b - a);
        segments.push({ filePath, inMs: relIn, outMs: relOut });
    }
    return segments;
}

/** --- Recording Helpers --- */
function pickMimeType(): string | undefined {
    // Prefer VP8 to improve container finalization (cues/duration in Chromium)
    const candidates = [
        'video/webm; codecs=vp8,opus',
        'video/webm; codecs=vp9,opus',
        'video/webm',
    ];
    for (const m of candidates) {
        if ((window as any).MediaRecorder?.isTypeSupported?.(m)) return m;
    }
    return undefined;
}

async function combineWithMic(stream: MediaStream): Promise<MediaStream> {
    try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        const out = new MediaStream([...stream.getVideoTracks(), ...mic.getAudioTracks()]);
        return out;
    } catch {
        return stream;
    }
}

