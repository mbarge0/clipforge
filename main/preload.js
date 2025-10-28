"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose a minimal, typed-safe IPC bridge
electron_1.contextBridge.exposeInMainWorld('electron', {
    // Healthcheck
    invoke: (channel, payload) => electron_1.ipcRenderer.invoke(channel, payload),
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
});
