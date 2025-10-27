// Foundry Core: Universal Environment Configuration
export const ENV = {
    APP_NAME: process.env.APP_NAME || "FoundryApp",
    ENVIRONMENT: process.env.NODE_ENV || "development",
    VERSION: process.env.APP_VERSION || "1.0.0",
    DEBUG: process.env.DEBUG === "true",
};