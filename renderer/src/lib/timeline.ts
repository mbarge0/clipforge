export type Milliseconds = number;

export interface TimelineClip {
    id: string; // unique per timeline instance
    sourceId: string; // id from Media Library
    name: string;
    file: File;
    startMs: Milliseconds; // position on timeline
    inMs: Milliseconds; // trim in within source
    outMs: Milliseconds; // trim out within source (exclusive)
    trackId: string;
}

export interface TimelineTrack {
    id: string;
    name: string;
    clips: TimelineClip[]; // non-overlapping, sorted by startMs
}

export interface TimelineState {
    tracks: TimelineTrack[]; // fixed 2 lanes for MVP
    playheadMs: Milliseconds;
    isPlaying: boolean;
    selectedClipId?: string;
    clipboard?: TimelineClip; // used for copy/paste (shallow copy)
}

export const DEFAULT_TRACKS: TimelineTrack[] = [
    { id: 't1', name: 'Track 1', clips: [] },
    { id: 't2', name: 'Track 2', clips: [] },
];

export const SNAP_MS: Milliseconds = 100; // 0.1s grid
export const PX_PER_SECOND = 100; // simple scale for MVP

export function msToPx(ms: Milliseconds): number {
    return (ms / 1000) * PX_PER_SECOND;
}

export function pxToMs(px: number): Milliseconds {
    return Math.max(0, Math.round((px / PX_PER_SECOND) * 1000));
}

export function snapMs(ms: Milliseconds, step: Milliseconds = SNAP_MS): Milliseconds {
    return Math.round(ms / step) * step;
}

export function clipDurationMs(clip: Pick<TimelineClip, 'inMs' | 'outMs'>): Milliseconds {
    return Math.max(0, clip.outMs - clip.inMs);
}

export function ensureNonOverlap(clips: TimelineClip[], updated: TimelineClip): TimelineClip {
    // Basic non-overlap enforcement: if overlap detected, push to the end of previous
    const others = clips.filter((c) => c.id !== updated.id).sort((a, b) => a.startMs - b.startMs);
    let start = updated.startMs;
    const dur = clipDurationMs(updated);
    for (const c of others) {
        const cEnd = c.startMs + clipDurationMs(c);
        const updatedEnd = start + dur;
        const overlap = !(updatedEnd <= c.startMs || start >= cEnd);
        if (overlap) {
            start = snapMs(cEnd);
        }
    }
    return { ...updated, startMs: start };
}

export function generateId(prefix: string = 'id'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}


