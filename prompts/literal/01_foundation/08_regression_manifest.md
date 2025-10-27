**When to use**: When initiating a new product cycle or preparing the baseline before feature phase development begins.
**When not to use**: During active module or feature phases — use “Regression Verification” (in the Debug Loop) instead.

Let’s generate the Master Regression Manifest using the Master Regression Manifest Generator.
Ask clarifying questions about the product architecture, foundation modules, and critical user flows before creating the checklist.
Use the provided structure (Phase references, core modules, user flow validation, and system dependencies).
Ask for confirmation first that all core functional areas have been identified before writing the regression checklist.
When you get confirmation, write the resulting file to:
`/docs/operations/regression_manifest.md`.

**Regression Checklist Generator reference:** `/prompts/system/foundation/08_regression_manifest_loop.md`

PRD, architecture, and dev checklist documents are located in /docs/foundation folder.