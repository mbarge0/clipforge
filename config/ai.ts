// Foundry Core: AI Configuration (agnostic, safe defaults)
export const AI_CONFIG = {
    PROVIDER: process.env.AI_PROVIDER || "openai",
    MODEL: process.env.AI_MODEL || "gpt-4.1",
    TEMPERATURE: Number(process.env.AI_TEMPERATURE) || 0.7,
    MAX_TOKENS: Number(process.env.AI_MAX_TOKENS) || 2048,
};