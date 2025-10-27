export interface EvolvrSelectors {
    loginReady?: string[]; // e.g., ["[data-testid='auth-form']", "form"]
    canvasReady?: string[]; // e.g., ["[data-testid='canvas-shell']", ".konvajs-content"]
    chatVisible?: string; // e.g., "[data-testid='chat-drawer'], [aria-label*='chat' i]"
}

export interface EvolvrConfig {
    baseUrl: string;
    routes: string[];
    outputDir?: string;
    latestDir?: string;
    recordSeconds?: number;
    timeouts?: { goto: number; ready: number };
    selectors?: EvolvrSelectors;
    requireChatVisible?: boolean; // default true for canvas routes
    headless?: boolean; // default true for CI
    retryMs?: number; // additional ms to add on retry (optional)
    maxRetries?: number; // total attempts per route (default 1 retry => 2 attempts)
}

export interface EvolvrResult {
    route: string;
    canvasReady?: boolean;
    chatVisible?: boolean;
    loginSucceeded?: boolean;
    hasVideo?: boolean;
    status: "success" | "partial" | "fail";
    notes?: string[];
    degraded?: boolean;
}

