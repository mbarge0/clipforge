import React from 'react';
import type { MediaItemMeta } from '../lib/media';
import { useTimelineStore } from '../store/timeline';

type Props = {
    mediaIndex: Record<string, MediaItemMeta>;
};

export function Preview({ mediaIndex }: Props) {
    const playheadMs = useTimelineStore((s) => s.playheadMs);
    const isPlaying = useTimelineStore((s) => s.isPlaying);
    const selectedClipId = useTimelineStore((s) => s.selectedClipId);
    const tracks = useTimelineStore((s) => s.tracks);
    const setPlayhead = useTimelineStore((s) => s.setPlayhead);
    const togglePlay = useTimelineStore((s) => s.togglePlay);

    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const [srcUrl, setSrcUrl] = React.useState<string | undefined>(undefined);

    // Determine current clip (selected or first on Track 1)
    const currentClip = React.useMemo(() => {
        const clip = tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId) || tracks[0]?.clips[0];
        return clip;
    }, [tracks, selectedClipId]);

    React.useEffect(() => {
        const clip = currentClip;
        if (!clip) return;
        const media = mediaIndex[clip.sourceId];
        if (!media?.file) return;
        const url = URL.createObjectURL(media.file);
        setSrcUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [currentClip, mediaIndex]);

    React.useEffect(() => {
        const v = videoRef.current;
        if (!v || !currentClip) return;
        const rel = Math.max(0, playheadMs - currentClip.startMs) / 1000 + currentClip.inMs / 1000;
        if (Math.abs(v.currentTime - rel) > 0.2) {
            try { v.currentTime = rel; } catch { }
        }
        if (isPlaying && v.paused) v.play().catch(() => { });
        if (!isPlaying && !v.paused) v.pause();
    }, [playheadMs, isPlaying, currentClip]);

    // Advance playhead while playing (simple loop)
    React.useEffect(() => {
        if (!isPlaying) return;
        const id = window.setInterval(() => {
            const clip = currentClip;
            if (!clip) return;
            const next = playheadMs + 100; // 100ms tick
            const clipEnd = clip.startMs + (clip.outMs - clip.inMs);
            if (next >= clipEnd) {
                // stop at clip end for MVP
                togglePlay();
                return;
            }
            setPlayhead(next);
        }, 100);
        return () => window.clearInterval(id);
    }, [isPlaying, playheadMs, currentClip, setPlayhead, togglePlay]);

    return (
        <div style={{ background: '#0B0C10', border: '1px solid #2A2A31', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong style={{ color: '#E5E7EB' }}>Preview</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                        onClick={() => togglePlay()}
                        style={{ background: '#111827', color: '#E5E7EB', border: '1px solid #374151', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
                        aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                    >
                        {isPlaying ? 'Pause' : 'Play'} (Space)
                    </button>
                </div>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#0F172A', borderRadius: 8, overflow: 'hidden' }}>
                {srcUrl ? (
                    <video ref={videoRef} src={srcUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} muted playsInline />
                ) : (
                    <div style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>No clip selected</div>
                )}
            </div>
        </div>
    );
}


