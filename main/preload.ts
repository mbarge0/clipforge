import { contextBridge, ipcRenderer } from 'electron';

// Expose a minimal, typed-safe IPC bridge
contextBridge.exposeInMainWorld('electron', {
    // Healthcheck (and generic invoke for optional channels)
    invoke: async (channel: 'app:ping' | string, payload?: any) => {
        const res = await ipcRenderer.invoke(channel, payload);
        // Side-effect: record debug for recording compat channels
        try {
            if (channel === 'recording:start' && res && res.success) {
                (window as any).__RECORD_DEBUG__ = { sessionId: res.sessionId, filePath: res.filePath, state: 'started' };
            }
            if (channel === 'recording:stop' && res) {
                (window as any).__RECORD_DEBUG__ = { ...(window as any).__RECORD_DEBUG__, state: res.success ? 'stopped' : 'error', filePath: res.filePath };
            }
        } catch { }
        return res;
    },

    // Export API
    exportChooseDestination: (suggestedPath?: string) => ipcRenderer.invoke('export:chooseDestination', suggestedPath),
    exportStart: (payload: {
        jobId?: string;
        resolution: '720p' | '1080p' | 'source';
        destinationPath: string;
        segments: Array<{ filePath: string; inMs: number; outMs: number }>;
    }) => ipcRenderer.invoke('export:start', payload),
    exportCancel: (jobId: string) => ipcRenderer.invoke('export:cancel', jobId),
    onExportProgress: (listener: (evt: any, data: { jobId: string; percent: number; status?: string; etaSeconds?: number }) => void) => {
        ipcRenderer.on('export:progress', listener);
        return () => ipcRenderer.removeListener('export:progress', listener);
    },
    onExportComplete: (listener: (evt: any, data: { jobId: string; success: boolean; outputPath?: string; error?: string }) => void) => {
        ipcRenderer.on('export:complete', listener);
        return () => ipcRenderer.removeListener('export:complete', listener);
    },

    // Media helpers
    getPathForFileName: (nameOrPath: string) => ipcRenderer.invoke('media:getPathForFileName', nameOrPath),
    getDesktopSources: (opts?: { types?: ('screen' | 'window')[] }) => ipcRenderer.invoke('desktop:getSources', opts),

    // Recording API
    recordOpenFile: (opts?: { extension?: string }) => ipcRenderer.invoke('record:openFile', opts ?? {}),
    recordAppendChunk: (sessionId: string, chunk: ArrayBuffer | Uint8Array) => {
        const buf = chunk instanceof Uint8Array ? Buffer.from(chunk) : Buffer.from(new Uint8Array(chunk));
        return ipcRenderer.invoke('record:appendChunk', { sessionId, chunk: buf });
    },
    recordCloseFile: (sessionId: string) => ipcRenderer.invoke('record:closeFile', sessionId),
    recordComposePiP: (payload: { screenPath: string; webcamPath: string; outExtension?: string }) => ipcRenderer.invoke('record:composePiP', payload),

    // High-level Recording (compat)
    recordingStart: (opts?: { extension?: string }) => ipcRenderer.invoke('recording:start', opts ?? {}),
    recordingStop: (sessionId: string) => ipcRenderer.invoke('recording:stop', { sessionId }),
});

declare global {
    interface Window {
        electron: {
            // Healthcheck / generic invoke
            invoke: (channel: 'app:ping' | string, payload?: any) => Promise<any>;
            // Export
            exportChooseDestination: (suggestedPath?: string) => Promise<string | undefined>;
            exportStart: (payload: { jobId?: string; resolution: '720p' | '1080p' | 'source'; destinationPath: string; segments: Array<{ filePath: string; inMs: number; outMs: number }> }) => Promise<{ jobId: string }>;
            exportCancel: (jobId: string) => Promise<boolean>;
            onExportProgress: (listener: (evt: any, data: { jobId: string; percent: number; status?: string; etaSeconds?: number }) => void) => () => void;
            onExportComplete: (listener: (evt: any, data: { jobId: string; success: boolean; outputPath?: string; error?: string }) => void) => () => void;

            // Media helpers
            getPathForFileName: (nameOrPath: string) => Promise<string | undefined>;
            getDesktopSources: (opts?: { types?: ('screen' | 'window')[] }) => Promise<Array<any>>;

            // Recording
            recordOpenFile: (opts?: { extension?: string }) => Promise<{ sessionId: string; filePath: string }>;
            recordAppendChunk: (sessionId: string, chunk: ArrayBuffer | Uint8Array) => Promise<boolean>;
            recordCloseFile: (sessionId: string) => Promise<string | undefined>;
            recordComposePiP: (payload: { screenPath: string; webcamPath: string; outExtension?: string }) => Promise<string>;

            // High-level Recording (compat)
            recordingStart: (opts?: { extension?: string }) => Promise<{ success: boolean; sessionId?: string; filePath?: string; error?: string }>;
            recordingStop: (sessionId: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
        };
    }
}

