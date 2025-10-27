export interface VisualConfig {
    baseUrl: string;
    outputDir?: string;
    latestDir?: string;
    timeouts?: {
        goto?: number;
        ready?: number;
    };
    video?: boolean; // allow --video flag
}

export interface VisualHooks {
    routes: string[];
    readinessSelectors: string[];
    ensureChatOpen?: (page: any) => Promise<void>;
}

// Stub for future semantic verification
export async function analyzeVideo(_path: string): Promise<void> {
    return;
}