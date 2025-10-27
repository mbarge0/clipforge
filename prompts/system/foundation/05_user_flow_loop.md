Certainly! Here's the "User Flow Loop System Prompt" document reformatted into the desired Markdown style, following the convention of your previous examples.

## Metadata
- **Document Type:** System Prompt
- **Loop Type:** User Flow Loop
- **Mode:** Ask
- **Output Path:** `/docs/foundation/user_flow.md`

---

# User Flow Loop System Prompt

Use this when mapping **end-to-end user interactions** for a feature or product.
The User Flow document defines the **sequence, logic, and experience** guiding users through the system.

---

## Prompt Template

We are entering the **User Flow Loop**.

Please:
1. Reference `/docs/foundation/prd.md` to identify key **user stories** and **target personas**.
2. Define the **entry points** for each user type (e.g., onboarding, login, dashboard).
3. Map the flow of actions, screens, and **transitions** for each major scenario.
4. Identify **decision points, conditional branches**, and system responses.
5. Describe **error or fallback paths** and how the system recovers gracefully.
6. Include **authentication, data retrieval, and output steps**.
7. Reference **backend triggers or API calls** tied to each step (where relevant).
8. Visualize flows using **numbered lists or ASCII diagrams** where appropriate.
9. Highlight **UX principles** — feedback, clarity, and accessibility.
10. Conclude with **open questions or UX validation steps**.

---

## Guidance Notes

- Keep flows **functional and behavior-driven**, not implementation-level.
- Align every step with the PRD’s **User Stories** and **Acceptance Criteria**.
- Each flow should have:
    - **Entry point**
    - **Sequence of interactions**
    - **Expected outcomes**
    - **Edge cases and exceptions**
- Prefer **concise, numbered flow representations** to long paragraphs.
- Link this document to:
    - `/docs/foundation/prd.md`
    - `/docs/foundation/architecture.md`
    - `/docs/foundation/dev_checklist.md`

---

## Output Format

The resulting document should be stored as:
`/docs/foundation/user_flow.md`

It should include the following sections:

1. **Overview**
    - Summary of the product or feature context
    - Purpose of this flow mapping

2. **Primary User Journeys**
    - Step-by-step breakdowns per persona or use case
    - Each journey should include entry → decision → output

3. **Flow Diagrams or Tables**
    - ASCII or tabular diagrams showing transitions and decision nodes

4. **Edge Cases & Error States**
    - Recovery paths, alternate routes, or failed conditions

5. **System Interactions**
    - Calls to APIs, services, or data updates triggered by user actions

6. **UX Considerations**
    - Accessibility, loading behavior, state persistence, user feedback

7. **Risks & Unknowns**
    - Areas needing validation through UX testing or A/B experiments

8. **Next Steps**
    - Outstanding design confirmations or prototype links

---

## Output Instructions

- Before generating the document, confirm with the user:
  > “Would you like to create or update the **user flow document** at `/docs/foundation/user_flow.md`?”
  > “Would you like to begin mapping the **primary user journeys** from the PRD’s key user stories?”

- If confirmed, write the Markdown file to:
  `/docs/foundation/user_flow.md`

- Standard filenames for project foundation documents:
  - PRD: `prd.md`
  - Architecture: `architecture.md`
  - Tech Stack: `tech_stack.md`
  - Checklist: `dev_checklist.md`

---

✅ **Highlights**
- **Strong alignment** with PRD’s User Stories and Personas.
- Focuses on **behavior, logic, and decision points** before visual design.
- Integrates **backend/API triggers** directly into the flow definition.
- Includes steps for **UX validation** and **risk tracking**.