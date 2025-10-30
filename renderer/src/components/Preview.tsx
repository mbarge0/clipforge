import React from 'react';
import type { MediaItemMeta } from '../lib/media';
import { getObjectUrl } from '../lib/urlCache';
import { useTimelineStore } from '../store/timeline';

function isRecordedClip(media: any, clip: any): boolean {
    const p = media?.finalPath ?? media?.path;
    if (p && (p.includes('clipforge-record-') || p.includes('fixed-record-'))) return true;
    if (clip?.sourceId?.startsWith?.('rec-')) return true;
    return false;
}

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
    const objectUrlRef = React.useRef<string | undefined>(undefined);
    const [fps, setFps] = React.useState<number>(0);
    const [scrubLatencyMs, setScrubLatencyMs] = React.useState<number | undefined>(undefined);
    const [hasMetadata, setHasMetadata] = React.useState<boolean>(false);
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

    const currentMedia = React.useMemo(() => {
        return currentClip ? mediaIndex[currentClip.sourceId] : undefined;
    }, [currentClip, mediaIndex]);

    React.useEffect(() => {
        const clip = currentClip;
        let revoked = false;
        (async () => {
            if (!clip) return setSrcUrl(undefined);
            const media = mediaIndex[clip.sourceId];
            if (!media) return setSrcUrl(undefined);

            let recorded = false;
            try {
                recorded = isRecordedClip(media as any, clip as any);
                console.log('[preview.detect]', { clipId: clip?.id, name: (media as any)?.name, path: (media as any)?.path, finalPath: (media as any)?.finalPath, recorded });
            } catch { }

            // Recorded URL resolution handled in dedicated effect below

            // Imported files: use the provided File blob (skip for recorded items)
            if (!recorded && media.file) {
                const url = getObjectUrl(clip.sourceId, media.file);
                try { console.log('[preview] source=file-blob', { clipId: clip.id, name: media.name, url }); } catch { }
                setHasMetadata(false);
                setSrcUrl(url);
                objectUrlRef.current = undefined;
                return;
            }

            setHasMetadata(false);
            setSrcUrl(undefined);
            objectUrlRef.current = undefined;
        })();
        return () => {
            revoked = true;
            const u = objectUrlRef.current;
            if (u && (window as any).electron?.revokeObjectUrl) {
                try { (window as any).electron.revokeObjectUrl(u); } catch { }
            }
            try { console.log('[preview] revoke object url (cleanup)', { url: u }); } catch { }
            objectUrlRef.current = undefined;
        };
    }, [currentClip, mediaIndex]);

    // Resolve file-based URL for recorded clips after mount and when media path changes
    React.useEffect(() => {
        const clip = currentClip;
        const media = currentMedia as any;
        if (!clip || !media) return;
        const path = media?.finalPath || media?.path;
        const recorded = media?.recorded === true || (typeof path === 'string' && path.includes('/clipforge-record-'));
        if (!recorded || !path || !(window as any).electron?.getMediaDataUrl) return;
        let cancelled = false;
        (async () => {
            try {
                try { console.log('[preview.dataurl] requesting base64 data', { path }); } catch { }
                const dataUrl = await (window as any).electron.getMediaDataUrl(String(path));
                if (!cancelled && dataUrl) {
                    try { console.log('[preview.dataurl] using base64 data URL'); } catch { }
                    setHasMetadata(false);
                    setSrcUrl(dataUrl);
                    objectUrlRef.current = dataUrl;
                }
            } catch (err) {
                try { console.warn('[preview.dataurl] failed toMediaUrl', err); } catch { }
            }
        })();
        return () => { cancelled = true; };
    }, [currentClip, currentMedia?.path, currentMedia?.finalPath]);

    // Attach detailed listeners for diagnostics on src changes
    React.useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onLoadedMetadata = () => {
            try { console.log('[preview] loadedmetadata', { duration: v.duration, videoWidth: v.videoWidth, videoHeight: v.videoHeight, readyState: v.readyState }); } catch { }
            setHasMetadata(true);
        };
        const onCanPlay = () => { try { console.log('[preview] canplay'); } catch { } };
        const onCanPlayThrough = () => { try { console.log('[preview] canplaythrough'); } catch { } };
        const onError = () => { try { console.log('[preview] error', { error: (v as any).error }); } catch { } };
        const onPlaying = () => { try { console.log('[preview] playing'); } catch { } };
        const onPause = () => { try { console.log('[preview] pause'); } catch { } };
        const onSeeked = () => { try { console.log('[preview] seeked', { currentTime: v.currentTime }); } catch { } };
        v.addEventListener('loadedmetadata', onLoadedMetadata);
        v.addEventListener('canplay', onCanPlay);
        v.addEventListener('canplaythrough', onCanPlayThrough);
        v.addEventListener('error', onError);
        v.addEventListener('playing', onPlaying);
        v.addEventListener('pause', onPause);
        v.addEventListener('seeked', onSeeked);
        return () => {
            v.removeEventListener('loadedmetadata', onLoadedMetadata);
            v.removeEventListener('canplay', onCanPlay);
            v.removeEventListener('canplaythrough', onCanPlayThrough);
            v.removeEventListener('error', onError);
            v.removeEventListener('playing', onPlaying);
            v.removeEventListener('pause', onPause);
            v.removeEventListener('seeked', onSeeked);
        };
    }, [srcUrl]);

    React.useEffect(() => {
        const v = videoRef.current;
        if (!v || !currentClip || !hasMetadata) return;
        const rel = Math.max(0, playheadMs - currentClip.startMs) / 1000 + currentClip.inMs / 1000;
        if (Math.abs(v.currentTime - rel) > 0.05) {
            try { console.log('[preview] programmatic seek', { rel }); } catch { }
            try { v.currentTime = rel; } catch { }
        }
        if (isPlaying && v.paused) {
            try { console.log('[preview] calling play()'); } catch { }
            v.play().catch(() => { });
        }
        if (!isPlaying && !v.paused) {
            try { console.log('[preview] calling pause()'); } catch { }
            v.pause();
        }
    }, [playheadMs, isPlaying, currentClip, hasMetadata]);

    // Advance playhead while playing (simple loop)
    React.useEffect(() => {
        if (!isPlaying) return;
        const v = videoRef.current;
        if (!v || !currentClip) return;
        let rafId = 0;
        const inSec = currentClip.inMs / 1000;
        const endSec = (currentClip.outMs - currentClip.inMs) / 1000 + inSec;
        const lastTimelineEnd = sortedTracks.flatMap((t) => t.clips).reduce((acc, c) => Math.max(acc, c.startMs + (c.outMs - c.inMs)), 0);
        const step = () => {
            // Drive timeline from the video's actual time for stability
            const tSec = Math.min(endSec, Math.max(inSec, v.currentTime));
            const tlMs = currentClip.startMs + Math.max(0, (tSec - inSec) * 1000);
            if (Math.abs(playheadRef.current - tlMs) > 15) {
                playheadRef.current = tlMs;
                setPlayhead(tlMs);
            }
            // Auto-advance to next clip if crossing boundary
            let active: typeof currentClip | undefined;
            for (let ti = 0; ti < sortedTracks.length; ti++) {
                const t = sortedTracks[ti];
                const hit = t.clips.find((c) => tlMs >= c.startMs && tlMs < c.startMs + (c.outMs - c.inMs));
                if (hit) { active = hit; break; }
            }
            if (active && active.id !== currentClip?.id) setSelection(active.id);
            if (tlMs > lastTimelineEnd + 50) { togglePlay(); return; }
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
        <div style={{ background: 'var(--navy)', border: '1px solid #243047', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong style={{ color: 'var(--color-brand)' }}>Preview</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#E5E7EB', fontSize: 12 }}>
                    <div>FPS: <span style={{ color: '#E5E7EB' }}>{fps}</span></div>
                    <div>Scrub: <span style={{ color: '#E5E7EB' }}>{scrubLatencyMs != null ? `${scrubLatencyMs}ms` : '—'}</span></div>
                    <button
                        onClick={() => togglePlay()}
                        style={{ background: 'var(--color-brand)', color: 'var(--color-brand-foreground)', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
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


