import React from 'react';
import type { MediaItemMeta } from '../lib/media';
import { clipDurationMs, msToPx, pxToMs, SNAP_MS } from '../lib/timeline';
import { useTimelineStore } from '../store/timeline';

type Props = {
    mediaIndex: Record<string, MediaItemMeta>;
};

export function Timeline({ mediaIndex }: Props) {
    const tracks = useTimelineStore((s) => s.tracks);
    const playheadMs = useTimelineStore((s) => s.playheadMs);
    const selectedClipId = useTimelineStore((s) => s.selectedClipId);
    const setPlayhead = useTimelineStore((s) => s.setPlayhead);
    const setSelection = useTimelineStore((s) => s.setSelection);
    const addClip = useTimelineStore((s) => s.addClip);
    const trimClip = useTimelineStore((s) => s.trimClip);
    const moveClip = useTimelineStore((s) => s.moveClip);
    const markScrubRequest = useTimelineStore((s) => s.markScrubRequest);

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = React.useState<number>(1200);

    React.useEffect(() => {
        if (!containerRef.current) return;
        const el = containerRef.current;
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = Math.floor(entry.contentRect.width);
                if (w > 0) setContainerWidth(w);
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    function onDrop(e: React.DragEvent, trackId: string) {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData('text/sourceId');
        if (!sourceId) return;
        const media = mediaIndex[sourceId];
        if (!media || !media.durationMs) return;
        const rect = containerRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0);
        const startMs = Math.max(0, pxToMs(x));
        const inMs = 0;
        const outMs = media.durationMs;
        addClip({ sourceId, name: media.name, file: media.file, startMs, inMs, outMs, trackId });
    }

    function onDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    function onTimelineClick(e: React.MouseEvent) {
        const rect = containerRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0);
        const ms = pxToMs(x);
        markScrubRequest(Date.now());
        setPlayhead(ms);
        setSelection(undefined);
    }

    // Clip drag state
    const dragRef = React.useRef<{ clipId: string; startMs: number; originX: number; trackId: string } | null>(null);

    function onClipMouseDown(e: React.MouseEvent, clipId: string, trackId: string) {
        if ((e.target as HTMLElement).dataset?.handle) return; // trim handles handled separately
        const rect = containerRef.current?.getBoundingClientRect();
        dragRef.current = { clipId, startMs: pxToMs(e.clientX - (rect?.left || 0)), originX: e.clientX, trackId };
        setSelection(clipId);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        const ctx = dragRef.current;
        if (!ctx) return;
        const deltaPx = e.clientX - ctx.originX;
        const deltaMs = pxToMs(deltaPx);
        const newStart = Math.max(0, ctx.startMs + deltaMs);
        moveClip(ctx.clipId, newStart, ctx.trackId);
    }

    function onMouseUp() {
        dragRef.current = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    // Trim handlers
    const trimRef = React.useRef<{ clipId: string; edge: 'in' | 'out'; originX: number } | null>(null);
    function onTrimDown(e: React.MouseEvent, clipId: string, edge: 'in' | 'out') {
        e.stopPropagation();
        trimRef.current = { clipId, edge, originX: e.clientX };
        window.addEventListener('mousemove', onTrimMove);
        window.addEventListener('mouseup', onTrimUp);
    }
    function onTrimMove(e: MouseEvent) {
        const t = trimRef.current;
        if (!t) return;
        const deltaPx = e.clientX - t.originX;
        const deltaMs = pxToMs(deltaPx);
        if (Math.abs(deltaMs) >= SNAP_MS / 2) {
            trimClip(t.clipId, t.edge, deltaMs);
            trimRef.current = { ...t, originX: e.clientX };
        }
    }
    function onTrimUp() {
        trimRef.current = null;
        window.removeEventListener('mousemove', onTrimMove);
        window.removeEventListener('mouseup', onTrimUp);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#9CA3AF', fontSize: 12 }}>
                <div>Playhead: {Math.round(playheadMs / 1000)}s</div>
                <div>Grid: {SNAP_MS}ms • Scale: {100} px/s</div>
            </div>
            <div ref={containerRef} onClick={onTimelineClick} style={{ border: '1px solid #2A2A31', borderRadius: 8, background: '#111216', padding: 8 }}>
                {/* Ruler */}
                <div style={{ position: 'relative', height: 28, background: '#0B0C10', borderRadius: 6, overflow: 'hidden' }}>
                    <Ruler playheadMs={playheadMs} width={containerWidth} />
                </div>
                {/* Tracks */}
                <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                    {tracks.map((track) => (
                        <div key={track.id} onDrop={(e) => onDrop(e, track.id)} onDragOver={onDragOver} style={{ position: 'relative', height: 64, background: '#0F1015', border: '1px solid #1F2430', borderRadius: 6 }}>
                            {track.clips.map((clip) => {
                                const left = msToPx(clip.startMs);
                                const width = msToPx(clipDurationMs(clip));
                                const isSelected = selectedClipId === clip.id;
                                return (
                                    <div
                                        key={clip.id}
                                        onMouseDown={(e) => onClipMouseDown(e, clip.id, track.id)}
                                        onDoubleClick={() => setSelection(clip.id)}
                                        style={{
                                            position: 'absolute',
                                            left,
                                            top: 8,
                                            height: 48,
                                            width,
                                            background: track.id === 't1' ? '#0EA5E9' : '#10B981',
                                            opacity: 0.85,
                                            border: isSelected ? '2px solid #F59E0B' : '1px solid #0C4A6E',
                                            boxShadow: isSelected ? '0 0 0 2px #38BDF8' : undefined, // focus ring
                                            borderRadius: 6,
                                            color: '#0B1220',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 8px',
                                            boxSizing: 'border-box',
                                            cursor: 'grab',
                                            userSelect: 'none',
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Clip ${clip.name}`}
                                    >
                                        <span style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clip.name}</span>
                                        {/* Trim handles */}
                                        <div
                                            data-handle
                                            onMouseDown={(e) => onTrimDown(e, clip.id, 'in')}
                                            style={{ position: 'absolute', left: -4, top: 0, width: 8, height: '100%', background: '#0B1220', opacity: 0.7, cursor: 'ew-resize', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
                                            aria-label="Trim in"
                                        />
                                        <div
                                            data-handle
                                            onMouseDown={(e) => onTrimDown(e, clip.id, 'out')}
                                            style={{ position: 'absolute', right: -4, top: 0, width: 8, height: '100%', background: '#0B1220', opacity: 0.7, cursor: 'ew-resize', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}
                                            aria-label="Trim out"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Ruler({ playheadMs, width }: { playheadMs: number; width: number }) {
    const marks: React.ReactNode[] = [];
    const totalPx = Math.max(300, width - 16); // account for padding
    const seconds = Math.ceil(totalPx / 100);
    for (let s = 0; s <= seconds; s++) {
        const left = s * 100;
        const isMajor = s % 5 === 0;
        const tickHeight = isMajor ? '100%' : '60%';
        marks.push(
            <div key={`tick-${s}`} style={{ position: 'absolute', left, bottom: 0, height: tickHeight, width: 1, background: isMajor ? '#334155' : '#1F2937' }} />,
        );
        if (isMajor) {
            const mm = String(Math.floor(s / 60)).padStart(2, '0');
            const ss = String(s % 60).padStart(2, '0');
            marks.push(
                <div key={`label-${s}`} style={{ position: 'absolute', left: left + 4, top: 4, fontSize: 11, color: '#9CA3AF', textShadow: '0 1px 0 #0B0C10' }}>{`${mm}:${ss}`}</div>,
            );
        }
    }
    const playheadLeft = msToPx(playheadMs);
    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {marks}
            <div style={{ position: 'absolute', left: playheadLeft, top: 0, height: '100%', width: 2, background: '#EF4444' }} />
        </div>
    );
}


