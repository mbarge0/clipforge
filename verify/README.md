# Foundry Verify System

The `verify` folder contains lightweight scripts and tools for automated validation
of Foundry-built projects during local development.

## Purpose
- Confirm that core setup (Firebase, API keys, etc.) completes successfully.
- Provide visual or CLI feedback to ensure modules initialize correctly.
- Eventually connect to Evolvr or Playwright for real-time validation.

## Structure
core/verify/
├── verify-core.js        # Baseline environment + dependency checks
├── verify-ui.js          # UI animation and layout verification hooks
└── telemetry.json        # Schema for collecting timing + response data

## Next Steps
- Implement a minimal verification script that checks `.env` and Firebase init.
- Add timing hooks to monitor AI agent latency (optional).