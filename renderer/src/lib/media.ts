export const SUPPORTED_EXTENSIONS = ["mp4", "mov", "webm"] as const;
export const MAX_FILE_BYTES = 500 * 1024 * 1024; // 500MB

export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number];

export function getFileExtension(filename: string): string {
    const idx = filename.lastIndexOf(".");
    return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : "";
}

export function isSupportedExtension(ext: string): ext is SupportedExtension {
    return SUPPORTED_EXTENSIONS.includes(ext as SupportedExtension);
}

export type ValidationResult =
    | { ok: true }
    | { ok: false; reason: string };

export function validateFileBasic(file: File): ValidationResult {
    const ext = getFileExtension(file.name);
    if (!isSupportedExtension(ext)) {
        return { ok: false, reason: `Unsupported format .${ext}. Allowed: ${SUPPORTED_EXTENSIONS.join(", ")}` };
    }
    if (file.size > MAX_FILE_BYTES) {
        return { ok: false, reason: `File too large (${formatBytes(file.size)}). Max 500MB.` };
    }
    return { ok: true };
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
    return `${val} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export interface MediaItemMeta {
    id: string;
    file: File;
    path?: string; // Electron provides File.path in drop/picker contexts
    name: string;
    sizeBytes: number;
    width?: number;
    height?: number;
    durationMs?: number;
    thumbnailDataUrl?: string;
    onTimeline?: boolean;
    error?: string;
}

export async function extractVideoMetadataAndThumbnail(file: File): Promise<Pick<MediaItemMeta, 'width' | 'height' | 'durationMs' | 'thumbnailDataUrl'>> {
    const url = URL.createObjectURL(file);
    try {
        const video = document.createElement('video');
        video.src = url;
        video.crossOrigin = 'anonymous';
        video.muted = true;

        await waitForEvent(video, 'loadedmetadata', 5000);

        const duration = isFinite(video.duration) ? video.duration : 0;
        const targetTime = duration && duration > 1 ? Math.min(duration / 2, duration - 0.1) : 0;
        if (targetTime > 0) {
            try {
                await seekVideo(video, targetTime, 500);
            } catch {
                // fallback: continue with current frame
            }
        }

        const maxThumbWidth = 320;
        const scale = Math.min(1, maxThumbWidth / Math.max(1, video.videoWidth));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.floor(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.floor(video.videoHeight * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unsupported');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        return {
            width: video.videoWidth || undefined,
            height: video.videoHeight || undefined,
            durationMs: Math.max(0, Math.round(duration * 1000)) || undefined,
            thumbnailDataUrl: dataUrl,
        };
    } finally {
        URL.revokeObjectURL(url);
    }
}

function waitForEvent(el: HTMLMediaElement, event: string, timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const onOk = () => cleanup(resolve);
        const onErr = () => cleanup(() => reject(new Error('media error')));
        const onTimeout = setTimeout(() => cleanup(() => reject(new Error('timeout'))), timeoutMs);
        const cleanup = (fn: () => void) => {
            clearTimeout(onTimeout);
            el.removeEventListener(event, onOk);
            el.removeEventListener('error', onErr);
            fn();
        };
        el.addEventListener(event, onOk);
        el.addEventListener('error', onErr);
    });
}

function seekVideo(video: HTMLVideoElement, time: number, timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const onSeeked = () => cleanup(resolve);
        const onTimeout = setTimeout(() => cleanup(() => reject(new Error('seek timeout'))), timeoutMs);
        const cleanup = (fn: () => void) => {
            clearTimeout(onTimeout);
            video.removeEventListener('seeked', onSeeked);
            fn();
        };
        video.addEventListener('seeked', onSeeked);
        try {
            video.currentTime = Math.max(0, Math.min(time, Math.max(0, video.duration - 0.05)));
        } catch {
            cleanup(() => reject(new Error('seek error')));
        }
    });
}


