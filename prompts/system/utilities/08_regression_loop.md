## Metadata
- **Type:** System Prompt  
- **Name:** Regression Checklist Generator  
- **Output Path:** `/docs/operations/regression/phase-{{phase-number}}-regression-checklist.md`

---

# 🧩 Regression Checklist Generation System Prompt

Use this system prompt to **automatically generate the regression checklist** for the current phase.

---

## Purpose
Ensure that all prior modules remain stable and functional after each new phase.  
This checklist will be executed during the **Debugging Loop (Section 7A: Regression Verification)**.

---

## Behavior
When invoked, this prompt should:
1. Identify all **completed prior phases** (1 through {{phase-number - 1}}).  
2. Extract the **core features or modules** from each prior phase’s `phase-XX-summary.md` and `phase-XX-debug.md` at /docs/operations/phases.  
3. Generate a **comprehensive but concise checklist** of key regression verification points.  
4. Include optional manual test steps for critical user flows.  
5. Produce a ready-to-use Markdown document under `/docs/operations/regression/phase-{{phase-number}}-regression-checklist.md`

---

## Structure of Generated Output

```markdown
# 🧩 Regression Verification Checklist — Phase {{phase-number}}

**Date:** {{date}}  
**Tester:** {{user}}  
**Target Phase:** {{phase-number}}  
**Prior Phases Covered:** {{1..(phase-number - 1)}}

---

## ✅ Phase {{phase-number - 1}} Summary
{{Short summary of major features implemented}}

### Regression Items
- [ ] Verify main feature still functional
- [ ] Verify integrations unchanged
- [ ] Check related UI components
- [ ] Validate backend operations or Supabase schema interactions
- [ ] Check for console or network errors

---

## ✅ Phase {{phase-number - 2}} Summary
...

---

## 🔍 Cross-Phase Flow Tests
- [ ] User can complete end-to-end workflow from login → message → channel switch
- [ ] Prior data integrity maintained (no duplicate or missing entries)
- [ ] Realtime sync still functional across browser sessions

---

**Console Errors:**  
(none / list if any)

**Overall Regression Result:**  
✅ All prior phases functional | ⚠️ Partial issues | ❌ Regression found  

**Notes:**  
(Describe any test observations or unexpected behaviors)