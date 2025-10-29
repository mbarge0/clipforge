"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose a minimal, typed-safe IPC bridge
electron_1.contextBridge.exposeInMainWorld('electron', {
    // Healthcheck (and generic invoke for optional channels)
    invoke: async (channel, payload) => {
        const res = await electron_1.ipcRenderer.invoke(channel, payload);
        // Side-effect: record debug for recording compat channels
        try {
            if (channel === 'recording:start' && res && res.success) {
                window.__RECORD_DEBUG__ = { sessionId: res.sessionId, filePath: res.filePath, state: 'started' };
            }
            if (channel === 'recording:stop' && res) {
                window.__RECORD_DEBUG__ = { ...window.__RECORD_DEBUG__, state: res.success ? 'stopped' : 'error', filePath: res.filePath };
            }
        }
        catch { }
        return res;
    },
    // Export API
    exportChooseDestination: (suggestedPath) => electron_1.ipcRenderer.invoke('export:chooseDestination', suggestedPath),
    exportStart: (payload) => electron_1.ipcRenderer.invoke('export:start', payload),
    exportCancel: (jobId) => electron_1.ipcRenderer.invoke('export:cancel', jobId),
    onExportProgress: (listener) => {
        electron_1.ipcRenderer.on('export:progress', listener);
        return () => electron_1.ipcRenderer.removeListener('export:progress', listener);
    },
    onExportComplete: (listener) => {
        electron_1.ipcRenderer.on('export:complete', listener);
        return () => electron_1.ipcRenderer.removeListener('export:complete', listener);
    },
    // Media helpers
    getPathForFileName: (nameOrPath) => electron_1.ipcRenderer.invoke('media:getPathForFileName', nameOrPath),
    getDesktopSources: (opts) => electron_1.ipcRenderer.invoke('desktop:getSources', opts),
    // Recording API
    recordOpenFile: (opts) => electron_1.ipcRenderer.invoke('record:openFile', opts ?? {}),
    recordAppendChunk: (sessionId, chunk) => {
        const buf = chunk instanceof Uint8Array ? Buffer.from(chunk) : Buffer.from(new Uint8Array(chunk));
        return electron_1.ipcRenderer.invoke('record:appendChunk', { sessionId, chunk: buf });
    },
    recordCloseFile: (sessionId) => electron_1.ipcRenderer.invoke('record:closeFile', sessionId),
    recordComposePiP: (payload) => electron_1.ipcRenderer.invoke('record:composePiP', payload),
    // High-level Recording (compat)
    recordingStart: (opts) => electron_1.ipcRenderer.invoke('recording:start', opts ?? {}),
    recordingStop: (sessionId) => electron_1.ipcRenderer.invoke('recording:stop', { sessionId }),
});
