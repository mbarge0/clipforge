# 🧭 Daily Gauntlet Routine  
*Version 1.0 – Cognitive & Operational Rhythm*

This document defines the daily rhythm used during the Gauntlet AI program.  
It integrates energy management, operational checkpoints, and reflection loops designed to sustain velocity, prevent burnout, and evolve the AI Engineering Framework (AEF) in real time.

---

## 1. Daily Structure Overview
Each Gauntlet day follows three main loops:

| Loop | Timing | Core Intent |
|------|---------|-------------|
| **Morning – Setup Loop** | Start of day | Align focus, load context, and define the daily target |
| **Midday – Flow Loop** | Mid-session | Check pace, identify blockers, recalibrate prompts |
| **Evening – Closure Loop** | End of day | Reflect on output quality, capture insights, checkpoint the day |

---

## 2. Morning – Setup Loop
**Purpose:** Establish mental clarity and contextual grounding before engaging Cursor.

1. Review yesterday’s **reflection** or **phase summary**.
2. Re-open relevant **phase folder** and review current literal prompt(s).
3. Define today’s **focus statement**:  
   > “By the end of today, I will have completed ______ and verified it with tests.”
4. Confirm current **Gauntlet week** and **app challenge** progress.
5. Load or restate **phase summary** to Cursor to restore context.
6. Begin first prompt (e.g., “New Phase Initialization” or “Continue Build”).

*Cursor Check-In – Morning*  
> “What’s your focus today, how far along are you in your weekly challenge, and what part of the app are you working on?”

---

## 3. Midday – Flow Loop
**Purpose:** Ensure pacing, accuracy, and engagement remain strong through the work block.

1. Quick operational status:
   - % complete for current phase
   - Number of commits or checkpoints completed
   - Any blockers or decision fatigue
2. Evaluate prompt & workflow usage:
   - Which literal prompt did you use most today?
   - Did it produce efficient, clean work?
3. Self-calibrate your **pace**:
   - On track → maintain rhythm  
   - Behind → simplify objectives  
   - Ahead → extend scope or optimize quality
4. Capture brief *one-line* insight in `docs/reflections/daily_notes.md`.

*Cursor Check-In – Midday*  
> “Where are you in your current build phase? How is the prompt + workflow system performing? Are you on pace for your goal today?”

---

## 4. Evening – Closure Loop
**Purpose:** Transition from output to insight. Convert the day’s progress into learning.

1. Summarize key actions completed:
   - Phases closed  
   - Features implemented  
   - Tests validated  
2. Evaluate Cursor performance:
   - Did Cursor execute prompts efficiently?  
   - Were there context losses or refactoring issues?
3. Note system-level improvements:
   - Prompts that need revision  
   - Workflow friction points  
   - Testing coverage gaps
4. Create a **checkpoint commit**:
   ```bash
   git add .
   git commit -m "checkpoint: end of day [date]"
   ```
5. Write a short *evening reflection* (5 minutes max):
   - What worked?  
   - What didn’t?  
   - What to adjust tomorrow?

*Cursor Check-In – Evening*  
> “How did your build go today? What did you complete, what blocked you, and what part of the system should we improve before tomorrow?”

---

## 5. Weekly Integration
At the end of each week:
- Review your **daily reflections** and summarize recurring patterns.
- Update `docs/retrospective.md` with high-level insights.
- Adjust your **phase prompts** or **context templates** as needed.
- Log the week’s outcomes in `weekly_report.md`.

---

## 6. Types of Checkpoints
**Operational Checkpoints**  
Used within the day to track progress, verify pace, and correct course.  
- Focus on *what’s in front of you* (tasks, commits, active phase).  
- Triggered by **morning** and **midday** loops.  

**Reflective Checkpoints**  
Used to improve systems, habits, and AI collaboration quality.  
- Focus on *how you’re working* and *why it’s working*.  
- Triggered by **evening** loop or end-of-week reviews.  

---

## 7. Automatic Copilot Check-In Schedule
Your Copilot (that’s me) will automatically prompt you to reflect at consistent intervals.

| Timing | Focus | Prompt |
|--------|--------|--------|
| **Mid-Morning** | Setup confirmation | “What phase are you in, and what’s your main goal for today?” |
| **Mid-Afternoon** | Progress calibration | “Are you on pace? Any blockers or confusion in the workflow?” |
| **Evening** | Reflection and checkpoint | “Summarize today’s progress, system performance, and next focus.” |

*Note:* These check-ins exist to prevent drift and burnout — not to add overhead.  
You can reply naturally; I’ll interpret and adapt your rhythm day by day.

---

## 8. Energy & Recovery Guidelines
- **Short resets:** 3–5 minute breaks between major Cursor loops.  
- **Block fatigue triggers:** If Cursor’s context rises above 90% or logic starts looping, stop for 5 minutes, review context, and reset tab.  
- **Night cutoff:** Never end the day mid-phase — always checkpoint or summarize progress before shutting down.  
- **Reflection over perfection:** Progress > polish; insight > output.

---

## 9. End-of-Day Summary Template
Copy or automate this block into your reflection doc.

```
### Daily Summary – [Date]
**Phase:** [Name]  
**Progress:** [Complete / Partial / Blocked]  
**Cursor Performance:** [1–10]  
**Prompt + Workflow Fit:** [1–10]  
**System Friction / Insights:** [Notes]  
**Next Focus:** [Short statement]
```

---

*This rhythm ensures that every day of Gauntlet compounds meaningfully — not just in code, but in clarity, consistency, and confidence.*

---

## 🔄 Check-In Role Map  
*Clarifying who each checkpoint is with — and why.*

This section defines the collaboration rhythm between **Matt**, **Copilot**, and **Cursor** during the Gauntlet program.  
Each check-in serves a different purpose within the overall readiness framework.

---

### 1. Morning – Strategic Alignment (with Copilot)
**Purpose:**  
Establish clarity, focus, and pacing before entering the work session.

**Flow:**  
- Review current Gauntlet week and project.  
- Define today’s focus statement and measurable goal.  
- Sync mindset and pacing with Copilot.  

**Example Check-In:**  
> “What’s your main objective today, and what part of the system will you focus on?”  

**Outcome:**  
Aligned priorities, confident plan, calm mental setup.

---

### 2. Midday – Operational Sync (with Cursor)
**Purpose:**  
Recalibrate execution quality, progress, and code rhythm.

**Flow:**  
- Confirm current phase progress (% done, blockers, testing).  
- Evaluate prompt & workflow effectiveness.  
- Adjust build plan or testing strategy as needed.  

**Example Prompt to Cursor:**  
> “Cursor, review our current phase progress and list any incomplete or untested modules.  
> Summarize blockers and suggest next implementation steps.”  

**Outcome:**  
Cursor regains full context. Technical focus stays tight and forward-moving.

---

### 3. Evening – Reflective Integration (with Copilot)
**Purpose:**  
Convert the day’s technical work into insight and improvement.

**Flow:**  
- Summarize what was completed and tested.  
- Evaluate prompt system fit and overall momentum.  
- Identify system or workflow friction for improvement.  

**Example Check-In:**  
> “How did today’s build go overall?  
> Were there any recurring blockers or unclear moments with Cursor?”  

**Outcome:**  
Captured learnings → updated workflow → mental closure for the day.

---

### 4. Ad Hoc Check-Ins
At any point during the day, you may initiate:
- **Copilot Conversations** for reflection, debugging strategy, or context restructuring.  
- **Cursor Prompts** for operational or technical assistance.

There’s no penalty for pausing to recalibrate — only value in awareness.

---

**Summary Principle**  
> *Copilot keeps you steady. Cursor keeps you fast.*  
Use both at their natural strengths to stay aligned, build clean, and finish strong.
