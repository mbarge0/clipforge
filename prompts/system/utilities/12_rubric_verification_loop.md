# Unified Rubric Verification & Evidence Integration — System Prompt

## Metadata
- **Phase:** `{{phase-number}}`
- **Mode:** `Ask`
- **Output Path:** `/docs/operations/phases/phase-{{phase-number}}-05-verification.md`

---

## Purpose
To perform a **complete rubric-based verification with automated scoring**, using rubric data dynamically extracted from the project requirements file.  of the deployed or local build — unifying technical validation, rubric comparison, and visual/manual evidence into one QA step.  

This step validates that all rubric categories meet the submission criteria and produces a final structured report.

---

### **Instructions**

1. Identify the deployed URL or local build reference (e.g. `https://collab-canvas.vercel.app` or `localhost:3000`).  
2. Load project requirements file and extract rubric categories.  
3. Verify each category through available data sources:
   - Code inspection (`app`, `components`, `lib`, `pages`)
   - API endpoints (e.g. `/api/openai`)
   - Console logs or test results (if provided)
   - Screenshots or notes for visual confirmation  
4. Record the verification results with evidence links or summaries for each rubric category.  
5. Produce a final rubric table summarizing:
   - Status: ✅ Pass / ⚠️ Needs Review / ❌ Fail  
   - Notes: Description or evidence reference  
6. Append a **Visual Evidence Appendix** listing screenshots, logs, and manual observations.  
7. Conclude with a **Submission Readiness Verdict**:
   - 🟢 Ready for Submission  
   - 🟡 Needs Review  
   - 🔴 Blocked  

---

## **Process**

1. **Load Context**
   - Project requirements file
   - Project source and endpoints
   - Evidence files (screenshots, logs, notes)

2. **Analyze and Verify**
   For each rubric category:
   - Extract rubric requirements
   - Compare against project behavior, implementation, and evidence
   - Record Pass / Needs Review / Fail

3. **Evidence Integration**
   - If screenshots, logs, or notes are provided, link them inline under the relevant rubric section.
   - Example:  
     `Evidence: [Screenshot: /public/screenshots/login.png]`  
     `Evidence: [Console Log: drag latency 12ms avg]`

4. **Analyze Rubric**
   - Extract rubric categories and their point allocations dynamically.  
   - Example (parsed from file):  
     Functionality — 20 pts  
     Performance — 15 pts  
     Accessibility & UX — 10 pts 

5. **Verify and Score**
   - Check each rubric criterion via inspection and testing.  
   - Award points dynamically based on compliance status.  
   - Sum all awarded points and compute percentage.

6. **Generate Structured Output**
   - Context (build type, date, environment)
   - Rubric summary
   - Category-by-category evaluation
   - Visual Evidence Appendix
   - Readiness verdict

---

## **Output Format**

Final Rubric Verification Report

## Verification Context
- Date: {{date}}
- Type: Comprehensive Rubric QA
- Build Reference: https://collab-canvas.vercel.app
- Rubric Source: /docs/requirements/requirements2.md
- Reviewer: Automated + Human Assisted (Cursor QA)

## Rubric Summary
| Category | Status | Evidence | Notes |
|-----------|---------|-----------|-------|
| Functionality | ✅ Pass | [Video + Logs] | All features operational |
| Performance | ⚠️ Needs Review | [Console Log: FPS] | No quantitative data for 500+ shapes |
| Persistence | ✅ Pass | [Reload Test] | State restores successfully |
| Accessibility | ✅ Pass | [axe.json] | No critical violations |
| Visual/Branding | ✅ Pass | [Screenshot: login.png] | Hero visible, colors aligned |
| Scalability | ⚠️ Needs Review | | Multi-user stress not validated |
| Deliverables | ⚠️ Needs Review | | Demo video pending link |

## Visual Evidence Appendix
### Screenshots
- `/public/screenshots/login.png`: Confirms hero visibility on login page
- `/public/screenshots/canvas_perf.png`: Shows smooth drag and zoom

### Logs
- `console_output.txt`: FPS averages 58–61 during drag
- `axe_report.json`: Accessibility AA+ confirmed

### Manual Notes
- Verified left hero image visible; login layout aligned right
- Toolbar functional and left-docked correctly

## Submission Verdict
🟡 **Needs Review**  
- Missing performance metrics for 500+ shapes  
- Demo video link pending  
- Otherwise fully functional and compliant

## Recommendations
1. Record and attach demo video  
2. Add FPS + latency metrics table  
3. Verify scalability under multi-user load  
```

---

## **Integration Notes**
- Store literal under `/literal/verification/unified_rubric_verification.literal.md`
- Store system under `/literal/verification/unified_rubric_verification.system.md`
- Run in Cursor or CLI after full build/deploy
- Optional: add screenshots under `/public/screenshots/` and logs under `/docs/operations/evidence/`
