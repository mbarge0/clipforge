File: `/docs/setup_checklist.md`

# Setup Checklist

Complete this checklist before beginning the Planning Loop.

---

## Environment
- [ ] Create `.env` and `.env.example` files.
- [ ] Add API keys for OpenAI, Supabase, etc.
- [ ] Verify `.gitignore` excludes `.env`.

## Dependencies
- [ ] Run `pnpm install`.
- [ ] Ensure all dependencies install successfully.

## Verification
- [ ] Run `pnpm dev` and open http://localhost:3000.
- [ ] Log `process.env.NEXT_PUBLIC_SUPABASE_URL` and confirm load.
- [ ] Confirm Supabase connection and dummy message retrieval.

## Commit Checkpoint
```bash
git add .
git commit -m "Verified environment setup"