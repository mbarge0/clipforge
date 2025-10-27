# Meta System Map

## Overview
Defines how the **Documentation**, **Prompt**, and **Automation** layers interact to create a unified AI-first development framework.

## System Layers
1. `/docs/` – Knowledge and operational structure.
2. `/prompts/` – Execution layer connecting humans and Cursor.
3. `/scripts/automation/` – Future automation layer for phase duplication and deployment.

## Operational Flow
```
/docs/context
    ↓
/prompts/literal
    ↓
Cursor Execution (using system templates)
    ↓
Testing Integration
    ↓
Reflection Output → /docs/reflections
```

## Role Summary
| Role | Responsibility |
|------|----------------|
| **Matt** | Vision, product direction, final decision-making. |
| **Copilot** | Strategic structure, reflection synthesis, and system alignment. |
| **Cursor** | Code generation, validation, and reasoning during execution. |

## Key Interactions
- `/prompts/literal/` drives direct collaboration.
- `/prompts/system/` ensures consistent reasoning and coding structure.
- `/docs/context_management_playbook.md` governs context windows and testing discipline.
- `/docs/reflections/` maintains long-term learning and iteration continuity.

## Guiding Principle
> “Think structurally, build conversationally.”  
This system turns Cursor into a dependable co-developer through modular workflows and contextual rigor.
