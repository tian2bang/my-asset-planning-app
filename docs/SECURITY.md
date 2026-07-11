# Security

## Secret Handling
- `OPENAI_API_KEY` lives in Vercel environment variables only — never imported in any client component
- Supabase `service_role` key used only in server-side API routes, never in browser bundles
- Supabase `anon` key is the only key exposed to the client (safe by design with RLS)

## Permission Model
- **v1 (demo):** Permissive RLS — all rows readable and writable by anyone; acceptable for seed-only demo data with no PII
- **Lock-Down sprint:** Replace all v1 policies with `auth.uid() = user_id`; new rows require authenticated user; existing demo rows (user_id = null) remain read-only for unauthenticated visitors
- Agents inherit the session user's permissions — no elevated service-role calls from client paths

## Approved Tools Rule
Only functions explicitly listed in `AGENTIC_LAYER.md` may be called by automated paths. No `run_any`, no `eval`, no dynamic tool construction.

## Audit Principle
Every state-changing action (create, update, retire, AI generate, approve) writes one row to `audit_logs` before the response is returned. Audit rows are append-only — no delete policy exists on `audit_logs`.

## What Requires a Human
- Any permanent record deletion
- Changes to RLS policies
- Adding or changing approved tool list
- Any action involving real financial movement

> If you are unsure whether an action is safe to automate, stop and treat it as human-only.
