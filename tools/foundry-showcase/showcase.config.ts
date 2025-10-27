export type ShowcaseRoute = {
    route: string
    durationMs?: number
}

export type ShowcaseConfig = {
    baseUrl: string
    routes: ShowcaseRoute[]
    resolution: { width: number; height: number }
    fps: number
    archive: boolean
    outputDir?: string
}

export const showcaseConfig: ShowcaseConfig = {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    routes: [
        { route: '/' },
    ],
    resolution: { width: 1280, height: 720 },
    fps: 30,
    archive: true,
    outputDir: undefined,
}
