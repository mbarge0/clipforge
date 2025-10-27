## Metadata
- **Phase:** {{phase-number}}
- **Mode:** Ask
- **Merge Mode:** Append
- **Output Path:** `/docs/operations/phases/recent/phase-{{phase-number}}-plan.md`

---

# Planning Loop System Prompt

Use this when revisiting or refining a phase’s plan for development.  
This is not for system architecture design — use the **Architecture Loop System Prompt** for that.

---

## Prompt Template

We are entering a **Planning Loop** within the current phase.  
The goal is to realign on scope, strategy, and direction before continuing implementation.

Please:
1. Review current progress and summarize completed work so far.  
2. Identify blockers, technical unknowns, or workflow friction points.  
3. Adjust or clarify scope, priorities, or sequencing if needed.  
4. Update risk assessment and mitigation strategies.  
5. Perform Regression Planning:
   - Identify which previously completed phases could be impacted by this phase’s work.  
   - Reference `/docs/operations/regression_manifest.md` to determine relevant dependencies.  
   - List specific features, flows, or modules that must remain functional after this phase.  
   - Add regression checks to this phase’s debugging plan.
6. Reconfirm success criteria for the remainder of the phase.  
7. Propose the next set of clear, actionable steps to resume execution.
8. (Optional) If there is environment or third-party tool set up required before or during build phase execution, generate an Environment & Dependency Checklist using the Environment & Dependency Checklist rubric outlined below.

---

## Guidance Notes
- Keep this focused on short-term planning and tactical clarity.  
- Avoid re-architecting or rewriting — those belong in the **Architecture Loop**.  
- Use this prompt to ensure development stays aligned with PRD, architecture, and checklist expectations.  
- Document regression dependencies early — this ensures the **Debugging Loop** will automatically test prior functionality during regression verification.  
- Capture any course corrections or decisions that should inform future phases.

---

## Detailed Planning Mode (Optional)

When entering a **major feature phase** (e.g., Module 2 Authentication), expand this loop into a *Detailed Phase Plan* with granular, implementation-ready tasks.

### Output Expectations
The resulting document should mirror the following structure:

- **Overview** — describe the phase, goals, and time estimate  
- **Task Summary** — total tasks, priorities, and effort breakdown  
- **Dependency Graph** — ASCII or text visualization of task dependencies  
- **Task Breakdown** — each task with ID, description, acceptance criteria, implementation steps, and outputs  
- **Critical Path** — ordered chain of blocking tasks  
- **Risk Mitigation** — top risks and mitigations per task or feature  
- **Regression Plan** — list of prior systems or features that must remain functional, based on the Master Regression Manifest  
- **Success Metrics** — measurable outcomes and definition of done  
- **Checkpoint Schedule** — planned commit points and timing  
- **Next Steps** — what happens immediately after planning  

This mode is ideal for complex modules that require step-by-step coordination across components or systems.

--

### Optional Output: Environment & Dependency Checklist

After completing the Plan phase report, generate an additional checklist file:

**File Path:** `/docs/operations/phases/phase-{{phase-number}}-02-dependencies.md`

This file should list all manual setup actions required before or during Build phase execution.  
Include both environment configuration and third-party tool setup.

**Checklist Sections:**
- Environment Variables (`.env.local` or platform secrets)
- Dependency Installs (npm, brew, CLI tools, etc.)
- Account Setup (Firebase, OpenAI, external APIs)
- Billing / Plan Requirements (e.g., Firebase Blaze)
- Local Testing Setup (Ports, emulators, mock data)
- Deployment Prep (hosting config, function paths)
- Authentication / Security configuration (if needed)

The checklist should be actionable — explicit commands, URLs, or steps to verify readiness.  
Mark optional steps with `(Optional)` and blockers with `(Required before Build)`.

**Output file:** `/docs/operations/phases/phase-{{phase-number}}-02-dependencies.md`

---

## Output Format

Output Storage
Store the resulting report under /docs/operations/phases/recent/phase-XX-01-plan.md (or the relevant file for Build or Reflect).
New work always goes into /docs/operations/phases/recent/.
When a phase is completed or superseded, move the entire set of related artifacts from /recent/ to /archive/.
If the current supermodule or module does not have a number, assign it the next available phase number from the Development Checklist.

If multiple system prompts (like Start, Plan, and Design) are run for the same super phase, they should all append to the same file.
Each should begin with a labeled heading (e.g., ## Start, ## Plan, ## Design, ## Build, etc.).
The combined file serves as the complete report for that super phase.

It should include the following sections:

1. **Phase Context**
   - Phase number, name, and current progress summary  
   - Date and reason for entering this planning loop  

2. **Current Status**
   - Summary of work completed so far  
   - Progress toward goals and deliverables  

3. **Issues and Blockers**
   - Technical or workflow blockers identified  
   - Proposed resolutions or workarounds  

4. **Scope Adjustments**
   - Any updates to goals, deliverables, or timelines  
   - Newly added or deferred tasks  

5. **Risk Assessment**
   - New or evolving risks discovered mid-phase  
   - Mitigation strategies and responsible parties  

6. **Regression Plan**
   - Previously built systems this phase may affect  
   - Regression risks identified  
   - Features that must remain stable post-phase  
   - Reference entries from `/docs/operations/regression_manifest.md`

7. **Updated Success Criteria**
   - What “done” looks like after this replan  
   - Key measurable outcomes  

8. **Next Steps**
   - Ordered action list to continue development  
   - Dependencies or checkpoints to confirm before resuming