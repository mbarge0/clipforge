**When to use**: When a development phase has just been completed and you want to summarize outcomes, capture learnings, and formally close the loop on the phase before moving to the next one.  
**When not to use**: When work is still ongoing or testing is incomplete — use “Build” instead.

Let’s begin the **Reflect Phase** for this supermodule using the **Consolidated Wrap-Up Template**.  
This phase combines the **Reflection** and **Handoff** steps into one continuous flow.  
Complete each step first before moving to the next step.

Let’s begin the Reflection step using the **Reflection Loop Template**.  
Summarize what was built, the challenges encountered, and how they were resolved.  
Highlight key learnings, unexpected discoveries, or changes to assumptions.  
Include what went well and what could be improved for the next iteration.  
Conclude with next-step recommendations and any technical or process insights worth preserving.
 
Then execute the Handoff step using the **Handoff Loop Template**.  
Prepare to transition this work to the next phase, teammate, or environment.  
Summarize the current project state, confirm all documentation is up-to-date, and ensure tests and builds pass.  
Verify deployment readiness and include all relevant instructions or environment variables for smooth transition.  
List all resources (code branches, design specs, logs, etc.) that the next phase or team will need for continuity.

Store the resulting report under `/docs/operations/phases/phase-XX-03-reflect.md`. New work goes into `/docs/operations/phases/recent/`; move completed artifacts together to `/docs/operations/phases/archive/`. If the current supermodule or module does not have a number, assign it the next available phase number from the development checklist.

**System Template references:**  
- Reflection Loop Template: `/prompts/system/07_reflection_loop.md`  
- Handoff Loop Template: `/prompts/system/08_context_summary_template.md`