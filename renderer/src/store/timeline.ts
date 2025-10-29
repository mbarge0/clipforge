import { create } from 'zustand';
import type { Milliseconds, TimelineClip, TimelineState, TimelineTrack } from '../lib/timeline';
import { clipDurationMs, DEFAULT_TRACKS, generateId, snapMs } from '../lib/timeline';

type TimelineActions = {
    addClip: (clip: Omit<TimelineClip, 'id'>) => void;
    setSelection: (clipId?: string) => void;
    deleteSelection: () => void;
    setPlayhead: (ms: Milliseconds) => void;
    togglePlay: () => void;
    trimClip: (clipId: string, edge: 'in' | 'out', deltaMs: Milliseconds) => void;
    moveClip: (clipId: string, newStartMs: Milliseconds, newTrackId?: string) => void;
    splitAt: (clipId: string, atMs: Milliseconds) => void;
    copySelection: () => void;
    pasteAt: (ms: Milliseconds) => void;
    undo: () => void;
    markScrubRequest: (ts: number) => void;
};

type TimelineStore = TimelineState & TimelineActions & {
    _history: TimelineState[];
    _pushHistory: () => void;
    _getTrack: (id: string) => TimelineTrack;
};

const MAX_HISTORY = 10;

function cloneState(state: TimelineState): TimelineState {
    return {
        tracks: state.tracks.map((t) => ({ ...t, clips: t.clips.map((c) => ({ ...c })) })),
        playheadMs: state.playheadMs,
        isPlaying: state.isPlaying,
        selectedClipId: state.selectedClipId,
        clipboard: state.clipboard ? { ...state.clipboard } : undefined,
    };
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
    tracks: DEFAULT_TRACKS.map((t) => ({ ...t, clips: [] })),
    playheadMs: 0,
    isPlaying: false,
    selectedClipId: undefined,
    clipboard: undefined,
    lastScrubRequestedAt: undefined,
    _history: [],
    _pushHistory: () => {
        const prev = cloneState({
            tracks: get().tracks,
            playheadMs: get().playheadMs,
            isPlaying: get().isPlaying,
            selectedClipId: get().selectedClipId,
            clipboard: get().clipboard,
            lastScrubRequestedAt: get().lastScrubRequestedAt,
        });
        const history = [...get()._history, prev].slice(-MAX_HISTORY);
        set({ _history: history });
    },
    _getTrack: (id: string) => {
        const track = get().tracks.find((t) => t.id === id);
        if (!track) throw new Error(`Track not found: ${id}`);
        return track;
    },

    addClip: (clipBase) => {
        const id = generateId('clip');
        const clip: TimelineClip = { id, ...clipBase, startMs: Math.max(0, clipBase.startMs) };
        get()._pushHistory();
        set((state) => {
            const tracks = state.tracks.map((t) =>
                t.id === clip.trackId ? { ...t, clips: sortClipsNonOverlap([...t.clips, clip]) } : t,
            );
            return { tracks, selectedClipId: id };
        });
    },

    setSelection: (clipId) => set({ selectedClipId: clipId }),

    deleteSelection: () => {
        const id = get().selectedClipId;
        if (!id) return;
        get()._pushHistory();
        set((state) => ({
            tracks: state.tracks.map((t) => ({ ...t, clips: t.clips.filter((c) => c.id !== id) })),
            selectedClipId: undefined,
        }));
    },

    // diag: The following logging is temporary to diagnose playback/seek timing.
    setPlayhead: (ms) => {
        // eslint-disable-next-line no-console
        try { console.log('[timeline] setPlayhead', ms); } catch { }
        set({ playheadMs: Math.max(0, ms) });
    },
    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

    trimClip: (clipId, edge, deltaMs) => {
        get()._pushHistory();
        set((state) => {
            const tracks = state.tracks.map((t) => ({
                ...t,
                clips: t.clips.map((c) => {
                    if (c.id !== clipId) return c;
                    if (edge === 'in') {
                        const nextIn = snapMs(Math.max(0, Math.min(c.outMs - 50, c.inMs + deltaMs)));
                        const newC = { ...c, inMs: nextIn };
                        return newC;
                    } else {
                        const nextOut = snapMs(Math.max(c.inMs + 50, c.outMs + deltaMs));
                        const newC = { ...c, outMs: nextOut };
                        return newC;
                    }
                }),
            }));
            return { tracks };
        });
    },

    moveClip: (clipId, newStartMs, newTrackId) => {
        get()._pushHistory();
        set((state) => {
            const srcTrack = state.tracks.find((t) => t.clips.some((c) => c.id === clipId));
            if (!srcTrack) return {} as any;
            const clip = srcTrack.clips.find((c) => c.id === clipId)!;
            const targetTrackId = newTrackId ?? srcTrack.id;
            const updated: TimelineClip = { ...clip, startMs: snapMs(Math.max(0, newStartMs)), trackId: targetTrackId };
            const tracks = state.tracks.map((t) => {
                if (t.id === srcTrack.id) {
                    const rest = t.clips.filter((c) => c.id !== clipId);
                    return { ...t, clips: rest };
                }
                return t;
            }).map((t) => {
                if (t.id === targetTrackId) {
                    return { ...t, clips: sortClipsNonOverlap([...t.clips, updated]) };
                }
                return t;
            });
            return { tracks, selectedClipId: clipId };
        });
    },

    splitAt: (clipId, atMs) => {
        // Split timeline clip at a specific timeline time
        get()._pushHistory();
        set((state) => {
            const tracks = state.tracks.map((t) => {
                const idx = t.clips.findIndex((c) => c.id === clipId);
                if (idx === -1) return t;
                const clip = t.clips[idx];
                const relMs = atMs - clip.startMs; // position within the clip on timeline
                const splitPoint = snapMs(Math.max(clip.inMs + 50, Math.min(clip.outMs - 50, clip.inMs + relMs)));
                if (splitPoint <= clip.inMs || splitPoint >= clip.outMs) return t; // no-op
                const left: TimelineClip = { ...clip, outMs: splitPoint };
                const right: TimelineClip = {
                    ...clip,
                    id: generateId('clip'),
                    inMs: splitPoint,
                    startMs: clip.startMs + (splitPoint - clip.inMs),
                };
                const newClips = [...t.clips];
                newClips.splice(idx, 1, left, right);
                return { ...t, clips: newClips };
            });
            return { tracks };
        });
    },

    copySelection: () => {
        const id = get().selectedClipId;
        if (!id) return;
        const clip = get().tracks.flatMap((t) => t.clips).find((c) => c.id === id);
        if (!clip) return;
        set({ clipboard: { ...clip } });
    },

    pasteAt: (ms) => {
        const data = get().clipboard;
        if (!data) return;
        const dupe: Omit<TimelineClip, 'id'> = { ...data, startMs: snapMs(ms) };
        get().addClip(dupe);
    },

    undo: () => {
        const history = get()._history;
        if (history.length === 0) return;
        const last = history[history.length - 1];
        set({
            tracks: last.tracks.map((t) => ({ ...t, clips: t.clips.map((c) => ({ ...c })) })),
            playheadMs: last.playheadMs,
            isPlaying: last.isPlaying,
            selectedClipId: last.selectedClipId,
            clipboard: last.clipboard ? { ...last.clipboard } : undefined,
            lastScrubRequestedAt: last.lastScrubRequestedAt,
            _history: history.slice(0, -1),
        });
    },

    markScrubRequest: (ts) => {
        // eslint-disable-next-line no-console
        try { console.log('[timeline] markScrubRequest', ts); } catch { }
        set({ lastScrubRequestedAt: ts });
    },
}));

function sortClipsNonOverlap(clips: TimelineClip[]): TimelineClip[] {
    const sorted = [...clips].sort((a, b) => a.startMs - b.startMs);
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const cur = sorted[i];
        const prevEnd = prev.startMs + clipDurationMs(prev);
        if (cur.startMs < prevEnd) {
            sorted[i] = { ...cur, startMs: snapMs(prevEnd) };
        }
    }
    return sorted;
}


