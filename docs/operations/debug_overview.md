# Debug Overview (Foundry Core v2)

A quick guide to the Debug phase orchestration in Foundry Core v2.

---

## Purpose
- Run a single command to compile and verify behavior
- Combine visual verification and Evolvr checks
- Support environment flags for flexible, fast feedback

---

## Command
```bash
pnpm debug
```

This runs:
1. `pnpm build` — silent, non-interactive compile
2. Evolvr loop — route-level capture/verification (unless skipped)
3. Visual loop — screenshots + videos + summary (unless skipped)

---

## Skip Flags
- `SKIP_EVOLVR=1 pnpm debug` — skip Evolvr verification
- `SKIP_VISUAL=1 pnpm debug` — skip Visual verification

Use flags to tailor the run to your current needs (e.g., quick UI-only checks).

---

## Outputs
- Visual verification artifacts: `/docs/evidence/latest/` and `/docs/evidence/archive/`
- Evolvr loop results: console logs and adaptive memory under `tools/evolvr-core/`

---

## Notes
- Defaults target the root route; downstream apps should extend routes/selectors.
- Debug does not enforce motion playback in skeletons; motion results are logged best-effort.
- See also: `docs/operations/verification/` and `docs/operations/showcase_overview.md` for adjacent tooling.
