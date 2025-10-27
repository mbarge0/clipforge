import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// --- DEV STABILITY PATCHES ---
// Disable GPU & hardware acceleration (prevents macOS Electron crash loop)
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('no-sandbox'); // Fixes SIGTRAP GPU sandbox crash

// --- Resolve paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

// --- Create BrowserWindow ---
function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // --- Determine URL based on environment ---
    const isDev = process.env.VITE_DEV?.toString().trim() === '1';
    const startURL = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    console.log(`[main] Launching ClipForge in ${isDev ? 'DEV' : 'PROD'} mode`);
    console.log(`[main] Loading URL → ${startURL}`);

    // Load app
    win.loadURL(startURL);

    // --- Dev-only behavior ---
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });

        // Retry if renderer isn't ready yet (Vite warmup)
        win.webContents.on('did-fail-load', () => {
            console.warn('⚠️ Renderer not ready — retrying...');
            setTimeout(() => win.loadURL(startURL), 1000);
        });
    }
}

// --- Electron Lifecycle ---
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC Bridge Test (health check) ---
ipcMain.handle('app:ping', async (_event, message) => {
    return `pong:${message ?? ''}`;
});