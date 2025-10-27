"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose a minimal, typed-safe IPC bridge
electron_1.contextBridge.exposeInMainWorld('electron', {
    invoke: (channel, payload) => electron_1.ipcRenderer.invoke(channel, payload),
});
