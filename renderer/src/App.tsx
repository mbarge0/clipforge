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
    type MediaItemMeta,
} from './lib/media';
import { useTimelineStore } from './store/timeline';

type Toast = { id: string; kind: 'error' | 'info' | 'success'; message: string };

export default function App() {
    const [pong, setPong] = React.useState<string>('');
    const [items, setItems] = React.useState<MediaItemMeta[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [toasts, setToasts] = React.useState<Toast[]>([]);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const playheadMs = useTimelineStore((s) => s.playheadMs);
    const togglePlay = useTimelineStore((s) => s.togglePlay);
    const deleteSelection = useTimelineStore((s) => s.deleteSelection);
    const splitAt = useTimelineStore((s) => s.splitAt);
    const undo = useTimelineStore((s) => s.undo);
    const copySelection = useTimelineStore((s) => s.copySelection);
    const pasteAt = useTimelineStore((s) => s.pasteAt);
    const selectedClipId = useTimelineStore((s) => s.selectedClipId);
    const tracks = useTimelineStore((s) => s.tracks);
    const clipsSourceIds = useTimelineStore((s) => new Set(s.tracks.flatMap((t) => t.clips.map((c) => c.sourceId))));

    // Export UI state
    const [showExport, setShowExport] = React.useState(false);
    const [resolution, setResolution] = React.useState<'720p' | '1080p' | 'source'>('1080p');
    const [destinationPath, setDestinationPath] = React.useState<string | undefined>(undefined);
    const [exportJobId, setExportJobId] = React.useState<string | undefined>(undefined);
    const [exportProgress, setExportProgress] = React.useState<number>(0);
    const [exportStatus, setExportStatus] = React.useState<string>('');

    const mediaIndex = React.useMemo(() => Object.fromEntries(items.map((it) => [it.id, it])), [items]);

    React.useEffect(() => {
        let cancelled = false;
        window.electron
            ?.invoke('app:ping', 'hello')
            .then((res) => {
                if (!cancelled) setPong(res);
            })
            .catch(() => {
                if (!cancelled) setPong('bridge unavailable');
            });
        return () => {
            cancelled = true;
        };
    }, []);

    React.useEffect(() => {
        const offProg = window.electron?.onExportProgress?.((_evt, data) => {
            if (data.jobId !== exportJobId) return;
            setExportProgress(Math.max(0, Math.min(100, data.percent)));
            if (data.status) setExportStatus(data.status);
        });
        const offDone = window.electron?.onExportComplete?.((_evt, data) => {
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
            if (meta && (e.key.toLowerCase() === 'z')) {
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

    async function handleFiles(files: FileList | File[]) {
        const fileArray = Array.from(files);
        for (const file of fileArray) {
            const validation = validateFileBasic(file);
            if (!validation.ok) {
                showToast('error', `${file.name}: ${validation.reason}`);
                continue;
            }
            const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random()
                .toString(36)
                .slice(2)}`;
            const base: MediaItemMeta = {
                id,
                file,
                path: (file as any).path,
                name: file.name,
                sizeBytes: file.size,
            };
            setItems((prev) => [base, ...prev]);
            try {
                const meta = await extractVideoMetadataAndThumbnail(file);
                setItems((prev) =>
                    prev.map((it) => (it.id === id ? { ...it, ...meta } : it)),
                );
            } catch (e: any) {
                setItems((prev) => prev.map((it) => (it.id === id ? { ...it, error: 'Failed to parse metadata' } : it)));
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

    function openPicker() {
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

    const dropBorder = isDragging ? '#6E56CF' : '#2A2A31';
    const dropBg = isDragging ? 'rgba(110, 86, 207, 0.08)' : 'transparent';

    return (
        <div style={{ padding: 16, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #2A2A31' }}>
                <div>
                    <h1 style={{ fontSize: 20, margin: 0 }}>🎬 ClipForge Desktop</h1>
                    <p style={{ margin: 0, color: '#9CA3AF' }}>IPC health: <strong>{pong || '...'}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={openPicker}
                        style={{
                            background: '#6E56CF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 12px',
                            cursor: 'pointer',
                        }}
                        aria-label="Import files"
                    >
                        Import
                    </button>
                    <button
                        onClick={() => setShowExport(true)}
                        style={{
                            background: '#0EA5E9',
                            color: '#0B0C10',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 12px',
                            cursor: 'pointer',
                        }}
                        aria-label="Open export dialog"
                    >
                        Export
                    </button>
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

            <main style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, marginTop: 16 }}>
                <aside>
                    <h3 style={{ marginTop: 0, fontSize: 16 }}>Media Library</h3>
                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        role="button"
                        tabIndex={0}
                        onClick={openPicker}
                        onKeyDown={(e) => (e.key === 'Enter' ? openPicker() : undefined)}
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
                        aria-label="Drag files here or press Enter to pick"
                    >
                        <div style={{ marginBottom: 8, color: '#9CA3AF' }}>Drag files here</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                            Supported: {SUPPORTED_EXTENSIONS.join(', ').toUpperCase()} • Max {formatBytes(MAX_FILE_BYTES)}
                        </div>
                    </div>

                    <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                        {items.length === 0 ? (
                            <div style={{ color: '#9CA3AF', fontSize: 14 }}>No media yet. Import to get started.</div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} draggable onDragStart={(e) => onLibDragStart(e, item.id)} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 12, border: '1px solid #2A2A31', borderRadius: 8, padding: 8, background: '#18181C' }}>
                                    <div style={{ width: 96, height: 54, background: '#0B0B0D', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.thumbnailDataUrl ? (
                                            <img src={item.thumbnailDataUrl} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: '#9CA3AF', fontSize: 12 }}>thumb</span>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <strong style={{ fontSize: 14, color: '#E5E7EB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</strong>
                                            {clipsSourceIds.has(item.id) ? (
                                                <span style={{ fontSize: 10, color: '#6E56CF', border: '1px solid #6E56CF', borderRadius: 999, padding: '0 6px' }}>on timeline</span>
                                            ) : null}
                                        </div>
                                        <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
                                            {item.durationMs != null ? formatDuration(item.durationMs) : '—'}
                                            {' • '}
                                            {item.width && item.height ? `${item.width}×${item.height}` : '—'}
                                            {' • '}
                                            {formatBytes(item.sizeBytes)}
                                        </div>
                                        {item.path ? (
                                            <div style={{ color: '#6B7280', fontSize: 11, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.path}</div>
                                        ) : null}
                                        {item.error ? (
                                            <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{item.error}</div>
                                        ) : null}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                <section>
                    <div style={{ display: 'grid', gap: 12 }}>
                        <Preview mediaIndex={mediaIndex} />
                        <Timeline mediaIndex={mediaIndex} />
                    </div>
                </section>
            </main>

            {/* Export Dialog */}
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
                                    const p = await window.electron?.exportChooseDestination?.('export.mp4');
                                    if (p) setDestinationPath(p);
                                }}
                                    style={{ background: '#111827', color: '#E5E7EB', border: '1px solid #374151', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Choose</button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                            {exportJobId ? (
                                <button onClick={async () => { if (exportJobId) await window.electron?.exportCancel?.(exportJobId); }}
                                    style={{ background: '#B91C1C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Cancel</button>
                            ) : (
                                <button
                                    onClick={async () => {
                                        if (!destinationPath) { showToast('error', 'Choose destination'); return; }
                                        const segments = buildExportSegments(tracks);
                                        if (segments.length === 0) { showToast('error', 'Timeline is empty'); return; }
                                        try {
                                            const res = await window.electron?.exportStart?.({ resolution, destinationPath, segments });
                                            if (res?.jobId) setExportJobId(res.jobId);
                                        } catch (e: any) {
                                            showToast('error', 'Failed to start export');
                                        }
                                    }}
                                    style={{ background: destinationPath ? '#0EA5E9' : '#1F2937', color: '#0B0C10', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: destinationPath ? 'pointer' : 'not-allowed' }}
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
                                    <div style={{ width: `${exportProgress}%`, height: '100%', background: '#0EA5E9' }} />
                                </div>
                                <div style={{ color: '#E5E7EB', fontSize: 12, marginTop: 6 }}>{Math.round(exportProgress)}%</div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {/* Toasts */}
            <div style={{ position: 'fixed', bottom: 16, right: 16, display: 'grid', gap: 8 }}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        style={{
                            background: t.kind === 'error' ? '#2A0F12' : t.kind === 'success' ? '#0F2A19' : '#111827',
                            color: '#E5E7EB',
                            border: `1px solid ${t.kind === 'error' ? '#B91C1C' : t.kind === 'success' ? '#15803D' : '#374151'}`,
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

function buildExportSegments(tracks: ReturnType<typeof useTimelineStore.getState>['tracks']): Array<{ filePath: string; inMs: number; outMs: number }> {
    const clips = tracks.flatMap((t, idx) => t.clips.map((c) => ({ trackIndex: idx, clip: c })));
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
        const filePath = (c.file as any)?.path as string | undefined;
        if (!filePath) continue;
        const relIn = c.inMs + (a - c.startMs);
        const relOut = relIn + (b - a);
        segments.push({ filePath, inMs: relIn, outMs: relOut });
    }
    return segments;
}