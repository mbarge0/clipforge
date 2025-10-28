import { contextBridge, ipcRenderer } from 'electron';

// Expose a minimal, typed-safe IPC bridge
contextBridge.exposeInMainWorld('electron', {
    // Healthcheck
    invoke: (channel: 'app:ping', payload?: string) => ipcRenderer.invoke(channel, payload),

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
});

declare global {
    interface Window {
        electron: {
            // Healthcheck
            invoke: (channel: 'app:ping', payload?: string) => Promise<string>;
            // Export
            exportChooseDestination: (suggestedPath?: string) => Promise<string | undefined>;
            exportStart: (payload: { jobId?: string; resolution: '720p' | '1080p' | 'source'; destinationPath: string; segments: Array<{ filePath: string; inMs: number; outMs: number }> }) => Promise<{ jobId: string }>;
            exportCancel: (jobId: string) => Promise<boolean>;
            onExportProgress: (listener: (evt: any, data: { jobId: string; percent: number; status?: string; etaSeconds?: number }) => void) => () => void;
            onExportComplete: (listener: (evt: any, data: { jobId: string; success: boolean; outputPath?: string; error?: string }) => void) => () => void;
        };
    }
}

