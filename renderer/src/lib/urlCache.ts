const cache = new Map<string, string>();

export function getObjectUrl(key: string, file: File): string {
    const existing = cache.get(key);
    if (existing) return existing;
    const url = URL.createObjectURL(file);
    cache.set(key, url);
    return url;
}

export function revokeObjectUrl(key: string): void {
    const url = cache.get(key);
    if (!url) return;
    try { URL.revokeObjectURL(url); } catch { }
    cache.delete(key);
}

export function revokeAllObjectUrls(): void {
    for (const [key, url] of cache.entries()) {
        try { URL.revokeObjectURL(url); } catch { }
        cache.delete(key);
    }
}

// Best-effort cleanup on unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        revokeAllObjectUrls();
    });
}


