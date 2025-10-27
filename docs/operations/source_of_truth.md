# Source of Truth  
_Version 1.1 — Updated for Gauntlet Mode (Oct 2025)_  

Tracks evolving components, APIs, configurations, and design decisions.  
Updated weekly or at the end of each phase to prevent confusion about “what’s current.”  
Acts as the canonical reference for all AI-assisted development.


## 1. Core Technologies
- **Framework:** Next.js 14 (App Router)  
- **Database:** Firebase Firestore  
- **Auth:** Firebase Auth  
- **AI API:** OpenAI GPT-4o (via `lib/ai/openai.ts`)  
- **Styling:** Tailwind CSS + shadcn/ui  
- **Testing:** Jest / React Testing Library  

*Cursor Reference:*  
Use this section to recall project tech stack before generating new files or updating configuration logic.


## 2. Components
| Category | Path | Description |
|-----------|------|-------------|
| Shared UI | `/components/ui/` | Common reusable interface elements |
| Layout | `/components/layout/` | Page shells, navbars, responsive wrappers |
| AI Chat | `/components/ai/chat-interface.tsx` | Core interactive chat system |
| Dashboard | `/components/dashboard/` | Main user workspace views |
| Auth | `/components/auth/` | Login, signup, session handlers |
| Utils | `/lib/utils/` | Helper functions and constants |

*Update Rule:*  
Every time a new major component folder is added or renamed, log it here with one-line context.


## 3. Endpoints
| Route | Method | Purpose |
|--------|---------|----------|
| `/api/ai/chat` | POST | Handles chat message requests |
| `/api/auth/signup` | POST | Registers new user |
| `/api/data/[id]` | GET/POST | CRUD for primary entities |
| `/api/health` | GET | Health check endpoint for deployment |
| `/api/test` | GET | Integration testing validation |

*Cursor Note:*  
Each endpoint should include validation middleware and test coverage.  
If adding new endpoints, Cursor should update this table automatically and validate with a smoke test.


## 4. Configurations
| Type | File | Notes |
|------|------|-------|
| Env Variables | `.env.local` | Store all secrets here. Never commit. |
| Model Config | `config/ai.ts` | Defines model version and temperature. |
| DB Config | `config/database.ts` | Sets Firebase/Supabase client. |
| Cursor Config | `cursor.config.md` | Defines dev behavior and phase flow. |

*Reminder:*  
Always confirm environment variables are loaded correctly before running `pnpm dev`.  
Cursor should verify configs automatically in new sessions.


## 5. Phase History (Cumulative Log)
Each phase captures key architectural or design shifts.  

### Phase 0 – Starter Template
- Initialized Next.js app with Firebase + OpenAI integration.  
- Basic chat interface connected to `/api/ai/chat`.  
- Verified environment variable loading.  

### Phase 1 – Clone (Enterprise App Example)
- Replicated baseline enterprise functionality (e.g. Slack clone).  
- Integrated auth, workspaces, and message persistence.  
- Defined testing coverage for UI interactions and message flow.  

*(Add new phases here as they complete.)*


## 6. AI Integration Notes
- Model: GPT-4o (OpenAI)  
- Role: backend logic + frontend interaction layer generation  
- Key files:  
  - `lib/ai/openai.ts` (core API handler)  
  - `prompts/system/` (prompt templates for AI collaboration)  
  - `prompts/literal/` (phase-specific literal prompts)

*Testing Guideline:*  
Each AI feature requires at least one mock-response test for validation under Jest or Vitest.


## 7. Cursor Collaboration Notes
Cursor should:  
1. Always review this document at the start of each session.  
2. Cross-reference changes to ensure accuracy before refactoring.  
3. Add or update entries automatically after structural changes using the Handoff Loop Template (`/prompts/system/06_handoff_loop.md`).  
4. Confirm that each endpoint or component logged here has corresponding tests.

**Quick Cursor Prompts:**
- “Update `source_of_truth.md` based on files added in this phase.”  
- “Scan `/components` and `/api` directories and summarize new or modified items in `source_of_truth.md` format.”  


## 8. Integration References
- **Testing Loop Template:** `/prompts/system/06_handoff_loop.md`  
- **Reflection Loop Template:** `/prompts/system/05_reflection_loop.md`  
- **Debugging Loop Template:** `/prompts/system/04_debugging_loop.md`  


---

**Summary:**  
`source_of_truth.md` = single point of alignment between human context and AI memory.  
It ensures consistency, prevents drift, and lets you and Cursor operate as synchronized engineers.