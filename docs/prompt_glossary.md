# Prompt Glossary — Foundry Core Edition

**Version:** v2.1  
**Last Updated:** 2025-10-11  
**Maintainer:** Matthew Barge  
**Location:** `/docs/prompt-glossary.md`

---

## Overview

This glossary defines the Foundry Command Language — a shared shorthand between you and your AI tools (Cursor, ChatGPT, Claude).  
It standardizes the language you use for planning, building, debugging, regression, and reflection.

**Goal:**  
Keep your workflow predictable, modular, and fast, especially during the Gauntlet program.

---

## 0. System Context Commands

| Shorthand | Name | Purpose |
|------------|------|----------|
| `-phase` | Phase Sync | Aligns the conversation with the current Foundry phase (Plan / Build / Debug / Reflect). |
| `-loop` | Operational Loop | Invokes the correct system loop prompt (Planning, Build, Debug, Reflection). |
| `-system` | System Context Refresh | Reloads Foundry Core context (architecture, phase docs, and active project). |
| `-env` | Environment Check | Verifies that all required files, .env vars, and dependencies are ready. |
| `-init` | Initialize Context | Reintroduces the current project, branch, and active phase at session start. |

---

## 1. Core Command Prompts

| Shorthand | Name | Purpose |
|------------|------|----------|
| `-s` | Surgical Fix | Repair a local issue without rewriting structure or logic. |
| `-trace` | Traceback Debug | Explain the full call stack and root cause before proposing fixes. |
| `-review-code` | Code Review | Evaluate code quality (1–10), explain weaknesses, and propose one improvement. |
| `-score` | Output Scoring | Rate output for readability, performance, and maintainability. |
| `-refine-pass` | Refinement Pass | Re-analyze recent output for clarity, duplication, or simplification. |
| `-docs` | Doc Sync | Update or create relevant documentation entries automatically. |
| `-style` | UI Styling Pass | Polish layout, Tailwind, or CSS design to Foundry standards. |
| `-expand` | Feature Expansion | Suggest realistic next-phase improvements or adjacent features. |
| `-handoff` | Handoff Prep | Summarize project state, known issues, and next-step guidance. |

---

## 2. Conversation Patterns

Use these phrases to guide AI collaboration effectively.

| Phrase | Effect |
|---------|---------|
| "Walk me through your reasoning before you code." | Enforces deliberate planning and prevents blind generation. |
| "Explain your design decisions and trade-offs." | Surfaces implicit reasoning and architecture. |
| "What hidden dependencies might this create?" | Reveals coupling or integration risks. |
| "Review this implementation for brittle or hard-coded logic." | Strengthens long-term maintainability. |
| "Simulate a user’s flow through this feature." | Tests for UX and flow gaps. |
| "Run a reasoning trace — where could this break under scale?" | Anticipates future edge cases or bottlenecks. |
| "Give me a one-paragraph summary of what we just accomplished." | Creates lightweight progress checkpoints. |

---

## 3. Quality Control Prompts

| Shorthand | Description |
|------------|-------------|
| `-audit` | Perform a full code audit for maintainability, naming consistency, and clarity. |
| `-testgen` | Generate missing unit and integration tests. |
| `-validate` | Re-run all tests and confirm end-to-end stability. |
| `-perf` | Review for performance bottlenecks or unnecessary renders. |
| `-cleanup` | Remove unused imports, redundant components, and stale files. |

---

## 4. Regression and Continuity Prompts

| Shorthand | Name | Purpose |
|------------|------|----------|
| `-regress` | Regression Plan/Test | Generate or validate a regression checklist before reflection or handoff. |
| `-manifest` | Regression Manifest | Create or update the master regression manifest listing all features to re-test. |
| `-verify` | Regression Verification | Run regression tests or confirm all prior features still function. |
| `-continuity` | Continuity Review | Ensure consistent logic and experience across phases or modules. |

---

## 5. Reflection and Meta-Learning

| Shorthand | Purpose |
|------------|----------|
| `-reflect` | Generate reflection summary with key learnings, simplifications, and improvements. |
| "Summarize what I learned and how I could improve next time." | Capture phase-level insights. |
| "What part of this build could have been simplified?" | Enforces simplicity mindset. |
| "How would another engineer interpret this code?" | Forces clarity and external readability. |

---

## 6. Collaboration and Prompt Patterns

| Command | Purpose |
|----------|----------|
| "Checkpoint here." | Save current state and summary before switching context. |
| "Translate this phase into next action tasks." | Converts planning output into implementable checklist. |
| "Generate system + literal prompt pair for this task." | Creates prompt infrastructure automatically. |
| "Show me regression impact for this module." | Identifies dependencies and test scope. |

---

## 7. Usage Notes

- Keep shorthand commands lowercase to avoid naming conflicts.  
- Use only one shorthand per prompt to preserve intent clarity.  
- Combine with Foundry’s Collaboration Protocol:  
  - Planning → natural conversation.  
  - Build → direct, procedural prompts + shorthands.  
  - Debug → use `-trace`, `-s`, `-review-code`.  
  - Reflect → use `-reflect`, `-handoff`, `-continuity`.  
- Record important context switches using the checkpoint ritual (commit + summary).

---

## 8. Versioning

| Field | Value |
|--------|--------|
| Glossary Version | v2.1 (Foundry Core Edition) |
| Date | 2025-10-11 |
| Maintainer | Matthew Barge |
| Purpose | Establish consistent prompt interface across Foundry Core and all Gauntlet projects. |

---

**End of File – `/docs/prompt-glossary.md`**