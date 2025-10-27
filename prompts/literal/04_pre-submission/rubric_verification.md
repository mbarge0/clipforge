**When to use:** After the application is feature-complete or deployed, to perform a **comprehensive rubric verification**. This step compares the **running app** (local or deployed) directly against the **project rubric** to confirm functionality, performance, persistence, accessibility, scalability, and deliverables.
**When not to use:** During active build or debug phases — this is for **final QA, pre-submission, or scoring simulation**.

Let’s perform a **Comprehensive Rubric Verification Review with Scoring** using the **Unified Rubric QA Loop Template**. Compare the current deployed or local build against the project requirements. Generate a structured verification report that includes:  
1. Rubric-based category validation (Functionality, Performance, Persistence, etc.)  
2. Automated checks using code and endpoint context  
3. Manual/visual evidence integration (screenshots, logs, or notes)
4. Assign points automatically based on project requirements document
5. Output a structured rubric verification report with scores and evidence.  
6. Include a final numeric total (e.g., **Score: 94 / 100 pts (94%)**) and readiness verdict.   
7. Overall submission readiness score and recommendations

Save the result to: /docs/operations/verification/verification.md. If there is already a verification file, create a new file and title it the next available verification number ie /verification2.md

### **Template Reference**
`/prompts/system/12_unified_rubric_verification_loop.md`

Project requirements located at: `/docs/requirements`