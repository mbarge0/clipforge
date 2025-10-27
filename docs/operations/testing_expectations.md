# Testing Expectations  
_Version 1.1 — Updated for Gauntlet Mode (Oct 2025)_


## 1. Philosophy
- Testing is part of the build, not an afterthought.  
- Every feature must be verifiable through at least one automated test.  
- Focus on correctness, stability, and confidence, not 100% coverage.  
- Super-phase cadence: **Plan → Build → Reflect** with debug and verification between as needed.


## 2. Levels of Testing
- **Unit Tests:** Validate isolated functions, hooks, and utilities.  
- **Integration Tests:** Test components with real data and context.  
- **End-to-End (Optional):** For complex user flows (Playwright, Cypress, etc.).  


## 3. Tools
- Jest or Vitest for units/integration.  
- React Testing Library for components.  
- Emulators or mocks for backend calls (e.g., Firebase, Supabase).  


## 4. Expectations per Phase
| Phase | Requirement |
|--------|--------------|
| Core Functionality | 80% unit coverage |
| AI Integration | Test model responses + error handling |
| UI | Snapshot and interaction tests |
| Deployment | Smoke test main routes |


## 5. Validation Prompts
> “Cursor, review test coverage and generate any missing tests before checkpoint.”  
> “Run all tests and verify functional correctness for core flows.”  


## 6. AI-Driven Testing Automation (Gauntlet Mode)

Testing is embedded into the build process via structured prompts and automation.

**Folder Expectations**
/tests/unit/        → function, utility, and hook tests
/tests/integration/ → component + data layer tests
/tests/e2e/         → complete flow tests (e.g., Playwright)

**Automated Testing Flow**
- Each super-phase should include test generation or expansion before marking a feature “complete.”  
- Cursor references the appropriate templates (system + literal prompts) to handle test verification and regeneration.  
- During handoff, confirm all critical paths are tested.

**Key Template Reference**  
`/prompts/system/08_context_summary_template.md`

**Behavior Notes**
- During new feature implementation, Cursor should:  
  1. Propose appropriate test types (unit/integration/e2e).  
  2. Implement or expand coverage within that phase.  
  3. Confirm results pass before code promotion or checkpoint.  
- If tests fail, Cursor pauses and requests developer confirmation before retrying.  


## 7. Testing Philosophy in Gauntlet Mode

Testing is part of every build cycle and not a separate workflow.  
Reflections and test logs should capture:
- What test coverage was added or improved during each super-phase.  
- What gaps remain for follow-up.  
- Any automated retries or interventions triggered by failed tests.  

All results are stored in phase reports under `/docs/operations/phases/` (use `/recent/` during active work, move to `/archive/` upon completion).