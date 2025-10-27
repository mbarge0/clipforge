# 🧱 Foundry Core Config

This folder defines environment-agnostic configuration modules
that every Foundry project inherits automatically.

### Design Rules
- No imports from frameworks (React, Node SDKs, etc.)
- No side effects or network calls
- Only safe, universal exports

### Included Modules
- `environment.ts`: App-level constants and mode flags
- `ai.ts`: Default AI configuration
- `logger.ts`: Lightweight cross-template console logger