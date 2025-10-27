# Foundry Core – Documentation Index (v1.2)

Welcome to the documentation system for the **Foundry Core**.  
This repository is both a reusable codebase and an operational framework for building, shipping, and reflecting during the Gauntlet AI program.

---

## Core Context
| File | Description |
|------|--------------|
| **context.md** | Defines what this starter template is, its purpose within the Gauntlet program, and the core design philosophy. |
| **collaboration_protocol.md** | Describes how Matt, Gauntlet Copilot, and Cursor collaborate to plan, code, and reflect each week. |
| **coding_rules.md** | The practical coding standards derived from Gauntlet “Vibe Coding” principles and modern AI development best practices. |
| **context_management_playbook.md** | Operational version that governs phase transitions, context control, testing integration, and reflection workflows. |
| **archive/context_management_playbook_v1.md** | Archived mentor-edition playbook, preserving the conceptual foundations behind the system. |
| **source_of_truth.md** | Living document tracking core components, APIs, and design decisions. The single canonical record of what’s current. |

---

## Templates
Reusable building blocks for weekly Gauntlet projects.

| File | Description |
|------|--------------|
| **templates/PRD_template.md** | Product Requirements Document skeleton for each week’s project. |
| **templates/implementation_checklist_template.md** | Task-level build sequence aligned to the PRD and collaboration protocol. |
| **templates/README_template.md** | Boilerplate for weekly project READMEs. |
| **templates/weekly_report_template.md** | Reflection template for end-of-week summaries. |

---

## Weekly Operations
| File | Description |
|------|--------------|
| **iteration_log.md** | Tracks iterative UI/UX and minor feature changes. |
| **weekly_report.md** | Your active weekly progress report — cloned from the template at the start of each new week. |
| **retrospective.md** | Captures recurring patterns, insights, and process improvements over time. |
| **reflections/** | Contains phase-based reflection outputs and summaries generated during builds. Each file aligns with a corresponding phase literal prompt. |

**Super-Phase Model & Storage Policy**  
Use Plan → Build → Reflect prompts (`/prompts/literal/02_superphases/`).  
Write active outputs to `/docs/operations/phases/recent/`; move completed sets to `/docs/operations/phases/archive/`.

---

## Prompt System
This system defines how you communicate with Cursor — using literal prompts for execution and system templates for structure.

### Literal Prompts
| Directory | Description |
|------------|--------------|
| **/prompts/literal/** | Contains ready-to-copy, plain-language prompts for direct use in Cursor. Use **02_superphases** for the preferred v2 cadence. |

**Phase Folders (legacy granular toolkit)**
1. `01_phase_start`  
2. `02_phase_planning`  
3. `03_phase_building`  
4. `04_phase_debugging`  
5. `05_phase_reflection`  
6. `06_phase_handoff`

### System Templates
| Directory | Description |
|------------|--------------|
| **/prompts/system/** | Defines reusable prompt templates (loop structures) used by literal prompts for planning, building, debugging, reflection, and handoff. |
| **cursor.config.md** | Central configuration rules for Cursor behavior during Gauntlet development. |

---

## Design, Motion & Testing
| File | Description |
|------|--------------|
| **ui_guidelines.md** | Defines the UI/UX design principles, component standards, and interface quality workflow. |
| **motion_system.md** | Operational overview of the Foundry Motion System (defaults, usage, verification notes). |
| **testing_expectations.md** | Specifies your testing philosophy, minimum coverage, validation procedures, and phase-level integration testing expectations. |

---

## Showcase & Verification
| File | Description |
|------|--------------|
| **showcase_overview.md** | Overview for the Foundry Showcase System (config, run flow, outputs). |
| **verification/** | Evidence storage and verification docs (visual/evolvr). |

---

## Social & Signal System
| File | Description |
|------|--------------|
| **social/content_strategy.md** | Overview of your social media goals, cadence, tone, and target audiences. |
| **social/post_templates.md** | Templates for recurring post formats: Gauntlet Logs, threads, reflections, reels. |
| **social/automation_flow.md** | Diagram and explanation of your leveraged content workflow (record → edit → publish). |
| **social/signal_tracker.md** | Spreadsheet-style record of posts, engagement, and growth metrics. |
| **social/highlight_reel.md** | Curated list of your top-performing projects, posts, and lessons. |

---

## Phase Workflow Overview
| Phase | Purpose | Key References |
|--------|----------|----------------|
| **01 – Start** | Establish goals, PRD, and success criteria. | `/prompts/literal/01_phase_start/`, `/prompts/system/01_starting_loop.md` |
| **02 – Planning** | Develop architecture and technical plan. | `/prompts/literal/02_phase_planning/`, `/prompts/system/02_planning_loop.md` |
| **03 – Building** | Implement and validate functional code. | `/prompts/literal/03_phase_building/`, `/prompts/system/03_building_loop.md` |
| **04 – Debugging** | Diagnose and stabilize the build. | `/prompts/literal/04_phase_debugging/`, `/prompts/system/04_debugging_loop.md` |
| **05 – Reflection** | Summarize learning, update docs, prepare next phase. | `/prompts/literal/05_phase_reflection/`, `/prompts/system/05_reflection_loop.md` |
| **06 – Handoff** | Final testing, release prep, and deployment. | `/prompts/literal/06_phase_handoff/`, `/prompts/system/06_handoff_loop.md` |

---

## References
| File | Description |
|------|--------------|
| **legacy_rules_reference.md** | Original “Cursor Rules” from Gauntlet Cohort 1 for historical context. |
| **index.md** | This document — the master index for your repo documentation. |

---

## How to Use This System
1. **Start each Gauntlet week** by copying templates from `/docs/templates/`.  
2. **Load the context** by reading `context.md` and `context_management_playbook.md`.  
3. **Use super-phase prompts** for v2 (Plan → Build → Reflect).  
4. **Track updates** in `iteration_log.md`, `source_of_truth.md`, and `weekly_report.md`.  
5. **Use the phase reports** under `/docs/operations/phases/` (`/recent` during active work; move to `/archive` when done).  
6. **Commit and checkpoint** after every major phase.

This documentation and prompt framework is your operational backbone.  
It keeps builds structured, minimizes refactors, and enables consistent, rapid iteration during the Gauntlet AI program.