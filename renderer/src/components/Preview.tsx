import React from 'react';
import type { MediaItemMeta } from '../lib/media';
import { getObjectUrl } from '../lib/urlCache';
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
    const setSelection = useTimelineStore((s) => s.setSelection);

    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const [srcUrl, setSrcUrl] = React.useState<string | undefined>(undefined);
    const [fps, setFps] = React.useState<number>(0);
    const [scrubLatencyMs, setScrubLatencyMs] = React.useState<number | undefined>(undefined);
    const playheadRef = React.useRef<number>(playheadMs);
    React.useEffect(() => { playheadRef.current = playheadMs; }, [playheadMs]);
    const lastScrubRequestedAt = useTimelineStore((s) => s.lastScrubRequestedAt);

    // Determine current clip (selected or first on Track 1)
    const sortedTracks = React.useMemo(() => tracks.map((t) => ({ ...t, clips: [...t.clips].sort((a, b) => a.startMs - b.startMs) })), [tracks]);

    const currentClip = React.useMemo(() => {
        // Track priority: prefer Track 1 (index 0), then Track 2 (index 1), etc.
        for (let ti = 0; ti < sortedTracks.length; ti++) {
            const t = sortedTracks[ti];
            const at = t.clips.find((c) => playheadMs >= c.startMs && playheadMs < c.startMs + (c.outMs - c.inMs));
            if (at) return at;
        }
        // Fallback: selected clip
        const selected = sortedTracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId);
        if (selected) return selected;
        // Fallback: first clip on Track 1 if available, else any first
        return sortedTracks[0]?.clips[0] || sortedTracks[1]?.clips[0];
    }, [sortedTracks, selectedClipId, playheadMs]);

    React.useEffect(() => {
        const clip = currentClip;
        if (!clip) return;
        const media = mediaIndex[clip.sourceId];
        if (!media?.file) return;
        const url = getObjectUrl(clip.sourceId, media.file);
        setSrcUrl(url);
    }, [currentClip, mediaIndex]);

    React.useEffect(() => {
        const v = videoRef.current;
        if (!v || !currentClip) return;
        const rel = Math.max(0, playheadMs - currentClip.startMs) / 1000 + currentClip.inMs / 1000;
        if (Math.abs(v.currentTime - rel) > 0.05) {
            try { v.currentTime = rel; } catch { }
        }
        if (isPlaying && v.paused) v.play().catch(() => { });
        if (!isPlaying && !v.paused) v.pause();
    }, [playheadMs, isPlaying, currentClip]);

    // Advance playhead while playing (simple loop)
    React.useEffect(() => {
        if (!isPlaying) return;
        let rafId = 0;
        let lastTs = performance.now();
        const lastTimelineEnd = sortedTracks.flatMap((t) => t.clips).reduce((acc, c) => Math.max(acc, c.startMs + (c.outMs - c.inMs)), 0);
        const step = (now: number) => {
            const dt = now - lastTs;
            lastTs = now;
            const next = playheadRef.current + dt;
            // Determine active by track priority: Track 1 first, then Track 2
            let active: typeof currentClip | undefined;
            for (let ti = 0; ti < sortedTracks.length; ti++) {
                const t = sortedTracks[ti];
                const hit = t.clips.find((c) => next >= c.startMs && next < c.startMs + (c.outMs - c.inMs));
                if (hit) { active = hit; break; }
            }
            if (active && active.id !== currentClip?.id) {
                setSelection(active.id);
            }
            if (next > lastTimelineEnd + 50) {
                togglePlay();
                return;
            }
            playheadRef.current = next;
            setPlayhead(next);
            rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [isPlaying, sortedTracks, currentClip, setSelection, setPlayhead, togglePlay]);

    // FPS meter via requestAnimationFrame
    React.useEffect(() => {
        let frame = 0;
        let last = performance.now();
        let rafId: number;
        const loop = () => {
            frame++;
            const now = performance.now();
            if (now - last >= 1000) {
                setFps(frame);
                frame = 0;
                last = now;
            }
            rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Scrub latency: measure time from requested scrub to first timeupdate after seek
    React.useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        function onTimeUpdate() {
            if (lastScrubRequestedAt) {
                const dt = Date.now() - lastScrubRequestedAt;
                if (dt < 2000) setScrubLatencyMs(dt);
            }
        }
        v.addEventListener('timeupdate', onTimeUpdate);
        return () => v.removeEventListener('timeupdate', onTimeUpdate);
    }, [lastScrubRequestedAt]);

    return (
        <div style={{ background: '#0B0C10', border: '1px solid #2A2A31', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong style={{ color: '#E5E7EB' }}>Preview</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#9CA3AF', fontSize: 12 }}>
                    <div>FPS: <span style={{ color: '#E5E7EB' }}>{fps}</span></div>
                    <div>Scrub: <span style={{ color: '#E5E7EB' }}>{scrubLatencyMs != null ? `${scrubLatencyMs}ms` : '—'}</span></div>
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


