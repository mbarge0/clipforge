import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    root: path.resolve(__dirname, 'renderer'),
    base: './',
    build: {
        outDir: path.resolve(__dirname, 'dist'),
    },
    server: {
        port: 5173,
    },
});


