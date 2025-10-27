## Metadata
- **Document Type:** System Prompt
- **Loop Type:** Tech Stack Loop
- **Mode:** Ask
- **Output Path:** `/docs/foundation/tech_stack.md`

---

# Tech Stack Loop System Prompt

Use this when defining or revisiting the **technical foundation** of the product — **frameworks, languages, SDKs, APIs, tools**, and **hosting infrastructure**.
This document ensures **consistency and reproducibility** across environments and serves as the **single source of truth** for project technologies.

---

## Prompt Template

We are entering the **Tech Stack Loop**.

Please:
1. Reference `/docs/foundation/prd.md` to ensure alignment with the PRD’s functional scope and **Supermodule Map**.
2. Define the core technologies for each **Supermodule** — e.g., frontend frameworks, backend services, database technologies.
3. Specify key **SDKs, APIs, and libraries** — including their **version, purpose, and integration point**.
4. Document **hosting, CI/CD, and deployment infrastructure** (e.g., Firebase, Vercel, GCP, Cloud Functions).
5. Identify **environment configuration files** and **secrets management strategies**.
6. Explain how **dev, staging, and production environments differ**.
7. Note **compatibility constraints** and **interdependencies** between stack components.
8. Outline any **migration plans** or **deprecation warnings**.
9. Include **performance trade-offs, security implications**, and **scalability considerations**.
10. Summarize the **technology rationale** and trade-offs made during selection.
11. End with a concise summary of the stack’s **upgrade strategy** and **next review checkpoint**.

---

## Guidance Notes

- Keep this document **project-level and declarative** — it should describe *what is* and *why*, not code-level setup.
- Each **Supermodule** should map to specific technologies, packages, or APIs.
- **Version-lock critical dependencies** and note upgrade policies.
- Where possible, include example **configuration snippets** (Firebase config, `package.json` dependencies, Xcode `project.yml` SDK versions).
- Link to related foundation docs:
    - `/docs/foundation/prd.md`
    - `/docs/foundation/architecture.md`
    - `/docs/foundation/dev_checklist.md`

---

## Output Format

The resulting document should be stored as:
`/docs/foundation/tech_stack.md`

It should include the following sections:

1. **Overview**
    - Summary of stack philosophy and technical goals
    - Overview of supported platforms

2. **Frontend Stack**
    - Frameworks, build tools, and runtime environment
    - Web (React/Vite) or iOS (SwiftUI, XcodeGen) technologies

3. **Backend Stack**
    - Core services, hosting, and API frameworks (e.g., Firebase Functions, Express, or custom Node services)
    - Key dependencies and integrations

4. **Database & Storage**
    - Firestore/Realtime DB structure, Cloud Storage, or other persistence layers
    - Indexing and query optimization strategies

5. **CI/CD & Deployment**
    - Tools and pipelines for build, testing, and deployment
    - Versioning and environment sync policies

6. **Security & Config**
    - Auth providers, rules, and secrets management strategy
    - Environment config conventions and validation approach

7. **Performance & Scalability Notes**
    - Caching, rate limiting, and load balancing strategies
    - Known trade-offs or upcoming upgrades

8. **Risks, Constraints & Future Plans**
    - Technical debt, unvalidated dependencies, or toolchain risks
    - Planned upgrades or migrations

9. **Summary & Next Steps**
    - Key takeaways
    - Checklist items for DevOps or testing alignment

---

## Output Instructions

- Before generating the document, confirm with the user:
  > “Would you like to create or update the **tech stack document** at `/docs/foundation/tech_stack.md`?”
  > “Would you like to define the technology for each **Supermodule** outlined in the PRD?”

- If confirmed, write the Markdown file to:
  `/docs/foundation/tech_stack.md`

- Standard filenames for project foundation documents:
  - PRD: `prd.md`
  - Architecture: `architecture.md`
  - Checklist: `dev_checklist.md`

---

✅ **Highlights**
- Enforces **version control** and **dependency tracking** for stability.
- Directly integrates **security, performance, and environment concerns** into the foundation.
- Links **technology choices** back to the PRD's **functional Supermodules**.