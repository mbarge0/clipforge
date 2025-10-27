// Foundry Core: Lightweight Console Logger
export const logger = {
    info: (...args: any[]) => console.log("ℹ️", ...args),
    warn: (...args: any[]) => console.warn("⚠️", ...args),
    error: (...args: any[]) => console.error("❌", ...args),
    success: (...args: any[]) => console.log("✅", ...args),
};