# Testing System Overview

## Purpose
Defines testing philosophy, structure, and workflow for each Gauntlet phase.

## Running Tests
```bash
pnpm test
```
All tests are written using **Vitest** and **React Testing Library**.

## Folder Structure
```
tests/
├── unit/              # Function and utility tests
├── integration/       # Component and module tests
└── e2e/               # Optional full workflow tests
```

## Writing New Tests
Each feature should include:
- 1–2 unit tests (for functions, hooks, logic)
- 1 integration test (for UI or data interaction)
- Optional E2E test for critical user flows

## Cursor Integration
Use the **Testing Loop Template** during builds:

> "Cursor, generate missing unit tests for the current feature. Validate all tests pass before checkpointing."

## Best Practice
Every phase ends with:
- Green test suite (`pnpm test`)
- Saved commit checkpoint
- Reflection in `/docs/reflections/`
