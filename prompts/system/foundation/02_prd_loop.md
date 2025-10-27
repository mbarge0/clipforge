## Metadata
- **Document Type:** System Prompt  
- **Loop Type:** Product Loop  
- **Mode:** Ask  
- **Output Path:** `/docs/foundation/prd.md`

---

# Product Loop System Prompt

Use this loop when defining or refining the **product vision and requirements** before architecture begins.  
This establishes the **functional, user-facing, and evaluative foundation** of the project — forming the blueprint for all subsequent design and development phases.

---

## Prompt Template

We are entering the **Product Loop**.

Please:
1. Ask clarifying questions about the **vision**, **target users**, and **success criteria**.  
2. Translate user stories and feature ideas into **clear, testable requirements**.  
3. Identify and document **constraints, priorities, and scope boundaries**.  
4. Ensure explicit alignment with **Gauntlet Evaluation Criteria** (below).  
5. Include **success criteria** — both quantitative and qualitative (e.g., performance, clarity of AI feedback, usability, stability).  
6. Generate a **Supermodule Proposal** based on functional and architectural cohesion:  
   - Propose **3–6 supermodules** that group related features and workflows into logical vertical slices.  
   - Each supermodule should:  
     - Represent a coherent user-facing capability (e.g., “Setup & Auth,” “Canvas Core,” “Collaboration Layer,” “AI Agent”).  
     - Share a common data model or UX boundary.  
     - Minimize dependencies on other supermodules.  
   - For each supermodule, provide a short summary (1–2 sentences) describing its purpose and primary components.  
7. Present the proposed supermodules for user review and confirm the **Supermodule Map** before finalizing the PRD.  
8. Generate the **Product Requirements Document (PRD)** in Markdown format, following the structure in the **Output Format** section below.  
9. Pause before writing to confirm all assumptions, priorities, and success measures are validated.

---

## Gauntlet Evaluation Criteria

| Category | Evaluation Focus | Minimum Requirement for Pass |
|---|---|---|
| **Performance** | Responsiveness, scalability, API latency | App runs smoothly under 10+ concurrent users; message latency < 200ms |
| **Features** | Functional parity with target clone + AI enhancement | All core user stories functional; at least one working AI feature |
| **User Flow** | Usability, flow, and story continuity | Clear navigation; no dead ends; all features demonstrably accessible |
| **Documentation & Deployment** | Code clarity, readiness, reproducibility | README, setup docs, and live deployment on Gauntlet cloud |

---

## Guidance Notes

- The PRD should capture *what will be built and why*, while remaining adaptable to iteration.  
- Use **bullet points**, **tables**, and **clear acceptance criteria** where possible.  
- Explicitly mark **stretch goals** and **out-of-scope** items to clarify focus.  
- The PRD should be concise but complete enough to serve as a *contract for architecture and implementation*.  
- Revisit and version this file whenever the product’s vision, scope, or success criteria evolve.  
- The confirmed **Supermodule Map** will guide both the **Architecture Loop** and **Checklist Loop** for cohesive execution.

---

## Output Format

The resulting document should be stored as:  
`/docs/foundation/prd.md`

It should include the following sections:

1. **Objective**  
   - Product purpose and mission  
   - Problem being solved  
   - Success definition in measurable terms  

2. **Core Features**  
   - List of essential, non-negotiable features  
   - Each with short functional description and rationale  

3. **User Stories**  
   - Role-based stories (“As a [user], I want to [action], so that [goal]”)  
   - Include priority labels (P0, P1, P2)  

4. **Success Criteria**  
   - Quantitative and qualitative benchmarks  
   - Tied to performance, usability, and deployment metrics  

5. **Supermodule Map**  
   - Table or list of confirmed supermodules  
   - Each with name, summary, and representative features  
   - **Example:**

     | Supermodule | Description | Key Features |
     |---|---|---|
     | Setup & Auth | Environment config, Firebase setup, login flows | Auth, Routing |
     | Canvas Core | Rendering and manipulation | Shapes, Transforms |
     | Collaboration Layer | Real-time sync, presence, conflict handling | Cursors, Debounce/Locks |
     | AI Agent | Language-to-action layer | Tool schema, command parser, chat UI |

6. **Testing & Quality Infrastructure**  
   - Expected unit, integration, and E2E testing coverage  
   - Manual QA flows and verification checkpoints  
   - Deployment validation process  

7. **Technical Constraints**  
   - Required frameworks, libraries, or hosting providers  
   - Security, compliance, or architectural limitations  

8. **Stretch Goals**  
   - Optional enhancements for post-MVP or secondary phase  

9. **Out of Scope**  
   - Explicitly list excluded features or use cases  

10. **Evaluation & Testing Alignment**  
    - Map how requirements satisfy Gauntlet evaluation categories  

11. **References**  
    - Link to `/docs/foundation/architecture.md` and `/docs/foundation/dev_checklist.md`  
    - Mention `/docs/requirements/evaluation_criteria.md` if applicable  

---

## Output Instructions

- Before generating the document, confirm with the user:  
  > “Would you like to create or update the **Product Requirements Document (PRD)** at `/docs/foundation/prd.md`?”  
  > “Would you like to include the proposed **Supermodule Map** in the PRD for downstream use in architecture and checklist generation?”

- If confirmed, write the Markdown file to:  
  `/docs/foundation/prd.md`

- Standard filenames for project foundation documents:  
  - PRD: `prd.md`  
  - Architecture: `architecture.md`  
  - Checklist: `dev_checklist.md`
