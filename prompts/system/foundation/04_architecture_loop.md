## Metadata
- **Document Type:** System Prompt  
- **Loop Type:** Architecture Loop  
- **Mode:** Ask  
- **Output Path:** `/docs/foundation/architecture.md`

---

# Architecture Loop System Prompt

Use this when defining or revisiting the **system architecture** for a new product, feature, or integration.  
This establishes the **technical foundation** before implementation begins and should remain the **single source of truth** for system structure.

---

## Prompt Template

We are entering the **Architecture Loop**.

Please:
1. Reference the **Supermodule Map** from the PRD (`/docs/foundation/prd.md`) to align architecture with functional groupings.  
2. Define the overall system structure and how each **Supermodule** maps to core components or services.  
3. Describe how components, APIs, and services interact within and between Supermodules.  
4. Specify core entities, their fields, and relationships.  
5. Map key data flows (input → processing → output) across Supermodules.  
6. Identify dependencies, integrations, and libraries.  
7. Note architectural risks, trade-offs, or assumptions.  
8. Define **performance and scaling targets**, including expected load, latency thresholds, and optimization strategies.  
9. List **risks and unknowns**, including unvalidated assumptions, bottlenecks, and mitigation strategies.  
10. Outline **security, testing, and observability** considerations.  
11. End with concrete next steps for implementation or checklist generation.

---

## Guidance Notes

- Keep the document **project-level** — not phase-specific.  
- Use the PRD’s **Supermodule Map** to ensure the architecture mirrors functional groupings.  
- Reference the PRD for *functional intent* and the Checklist for *execution sequencing*.  
- Maintain clarity and traceability: link directly to `/docs/foundation/prd.md` and `/docs/foundation/dev_checklist.md`.  
- Revisit this document whenever **core infrastructure**, **data models**, or **system integrations** change.  
- Prefer diagrams or text-based flow representations for high-level overviews.  
- Where applicable, identify **inter-supermodule dependencies** (shared services, APIs, or data models).  

---

## Output Format

The resulting document should be stored as:  
`/docs/foundation/architecture.md`

It should include the following sections:

1. **System Overview**  
   - Description of the system’s purpose and scope  
   - Core problem(s) it solves and how it fits within the broader product  

2. **Supermodule Architecture Map**  
   - Visual or tabular mapping of Supermodules to their architectural components  
   - Describe communication pathways or integration points between Supermodules  

3. **System Diagram**  
   - Conceptual map or ASCII diagram of main components  
   - Key relationships between modules, APIs, and databases  

4. **Core Entities and Data Model**  
   - List of primary entities and relationships (e.g., Users, Messages, Canvases)  
   - Summary of data constraints and indexing strategy  

5. **Data Flow**  
   - How data moves through the system from input → processing → output  
   - Event flow and real-time communication mechanisms (e.g., Firebase RTDB/Firestore listeners)  

6. **Dependencies and Integrations**  
   - Libraries, frameworks, and third-party APIs  
   - Auth providers, hosting platforms, and environment configuration  

7. **Security and Performance Considerations**  
   - Access control rules (RLS or Firestore rules)  
   - Performance expectations, latency goals, and caching strategy  
   - Known trade-offs or performance bottlenecks  

8. **Performance & Scaling**  
   - Target frame rates, latency thresholds, and concurrent user limits  
   - Caching, batching, or rate-limiting strategies ensuring stability under load  
   - Expected performance benchmarks at MVP and production stages  

9. **Risks & Unknowns**  
   - List unvalidated assumptions, dependencies, or potential bottlenecks  
   - Describe mitigation strategies or future validation plans  

10. **Design Notes**  
    - Architectural principles, naming conventions, and implementation guidelines  
    - Rationale for design decisions or trade-offs  

11. **Next Steps**  
    - 1–3 actionable steps for moving into implementation or checklist creation  
    - References to related documents (`prd.md`, `dev_checklist.md`, `schema.sql`, etc.)

---

## Output Instructions

- Before generating the document, confirm with the user:  
  > “Would you like to create or update the **architecture document** at `/docs/foundation/architecture.md`?”  
  > “Would you like to map architecture directly to the confirmed **Supermodule Map** from the PRD?”

- If confirmed, write the Markdown file to:  
  `/docs/foundation/architecture.md`

- Standard filenames for project foundation documents:  
  - PRD: `prd.md`  
  - Architecture: `architecture.md`  
  - Checklist: `dev_checklist.md`

---

✅ **Highlights**
- Now directly **references and extends the PRD’s Supermodule Map**  
- Enforces **architectural traceability** from requirements → design → implementation  
- Includes **performance & scaling targets** and **risk tracking**  
- Fully harmonized with PRD and Checklist loops for consistent Cursor integration  
