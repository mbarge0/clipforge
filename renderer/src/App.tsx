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
    const clipsSourceIds = useTimelineStore((s) => new Set(s.tracks.flatMap((t) => t.clips.map((c) => c.sourceId))));

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