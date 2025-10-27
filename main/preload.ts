import { contextBridge, ipcRenderer } from 'electron';

// Expose a minimal, typed-safe IPC bridge
contextBridge.exposeInMainWorld('electron', {
    invoke: (channel: 'app:ping', payload?: string) => ipcRenderer.invoke(channel, payload),
});

declare global {
    interface Window {
        electron: {
            invoke: (channel: 'app:ping', payload?: string) => Promise<string>;
        };
    }
}

