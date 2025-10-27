import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const startURL =
        process.env.VITE_DEV === '1'
            ? 'http://localhost:5173'
            : `file://${path.join(__dirname, '../dist/index.html')}`;

    win.loadURL(startURL);

    // 👇 DEV-ONLY FEATURES
    if (process.env.VITE_DEV === '1') {
        // Open Chrome DevTools in detached window
        win.webContents.openDevTools({ mode: 'detach' });

        // Handle Vite refresh crashes gracefully
        win.webContents.on('did-fail-load', () => {
            console.log('🔄 Renderer not ready yet — retrying load...');
            setTimeout(() => win.loadURL(startURL), 1000);
        });
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});