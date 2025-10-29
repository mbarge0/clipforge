import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    reporter: [['line']],
    projects: [
        {
            name: 'electron',
            use: {
                headless: true,
            },
        },
    ],
});


