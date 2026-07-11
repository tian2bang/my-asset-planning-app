# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) — Vercel deploy
- **Database + Auth:** Supabase (Postgres + RLS + Auth added in Lock-Down sprint)
- **AI:** OpenAI GPT-4o via secure server-side API route
- **Styling:** Tailwind CSS + shadcn/ui

## Now vs Later
| Now (v1) | Later |
|---|---|
| Asset / Liability CRUD | Auth + per-user RLS |
| Value history log | Live FX rates |
| Nominees per asset | PDF export |
| AI beneficiary guide | Retirement score |
| Net worth summary | Document uploads |

## Key Action Flow — "Generate Beneficiary Guide"
1. User clicks **Generate Guide** on an asset detail page
2. Next.js API route receives asset + nominee data (server-side only)
3. Route calls OpenAI with a structured prompt; OpenAI key never leaves the server
4. Response stored in `beneficiary_guides` with `source`, `confidence`, `review_status='unreviewed'`
5. Guide card renders on the page with confidence badge
6. User clicks **Mark Reviewed** → `review_status` updates to `'approved'`; audit log written
7. On any refresh the guide is re-fetched from Supabase — no client-side state dependency

## Layer Plan
1. **Data layer** — Supabase tables + RLS policies (v1 permissive, locked down later)
2. **App logic** — CRUD actions, value snapshot writes, nominee management (works without AI)
3. **Intelligence** — Beneficiary guide generation layered on top; core app runs if AI is off
