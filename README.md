# My Asset Planning App

A retirement asset-planning app for people with money spread across countries and
institutions. Track assets and liabilities, log value changes over time, name
beneficiaries with a share split, and generate an AI-drafted "how to access this
after I'm gone" guide for your family — reviewed and approved by you before it's
trusted.

**Live demo:** https://my-asset-planning-app.vercel.app — no login required, seeded
with a sample portfolio across Malaysia, the US, and Singapore.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Language | TypeScript strict |
| Styles | Tailwind CSS v4 (CSS-first, no config file) |
| Auth + DB | Supabase (Postgres + RLS + Auth via `@supabase/ssr`) |
| AI | OpenAI GPT-4o (server-side only) |
| Deploy | Vercel |

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase + OpenAI keys
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase project settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Same page — safe to expose, protected by RLS |
| `OPENAI_API_KEY` | For guide generation | Server-side only, never sent to the browser |

The database schema lives in `supabase/migrations/`. Apply migrations in order via
the Supabase SQL Editor or the Supabase CLI.

## How it works

- **Demo-first:** anyone can browse the seeded portfolio without an account.
- **Sign up** to add your own assets, liabilities, and beneficiary guides — Row
  Level Security scopes every write to `auth.uid()`, so your data is private.
- **Generate Guide** on an asset page assembles a structured payload (asset +
  nominees) and calls OpenAI server-side; the key never reaches the browser. The
  result is stored with a `review_status` — you mark it reviewed or edit it
  yourself, and every change is written to an append-only `audit_logs` table.

See `docs/` for the full PRD, architecture, and data model this was built from.

## Case Study

**Problem.** People retiring with assets across multiple countries have no single
place to see what they own, log how values change, or tell their family what to
do with each asset when they're gone. Beneficiary access — the actual legal and
procedural steps to claim a pension, a mortgaged property, or a crypto wallet — is
usually undocumented and lost with the owner.

**Decisions.** The app is demo-first: the homepage is the real working product
with seeded data, not a marketing page or a login wall, so it can be evaluated in
under a minute. Money math never crosses currencies — the PRD explicitly excludes
live FX conversion, so totals are grouped per currency rather than silently summed
into a misleading blended number. The AI guide is never trusted blindly: it's
generated server-side (the API key never reaches the browser), stored with a
confidence score and `unreviewed` status, and only becomes authoritative once a
human approves or edits it — with every state change written to an append-only
audit log. Access control was layered in deliberately late: permissive RLS let
the demo ship fast, then a dedicated "Lock-Down" migration replaced it with
owner-scoped policies (`auth.uid() = user_id`) once auth existed, without ever
exposing the service-role key.

**Demo:** https://my-asset-planning-app.vercel.app

**Next steps.** Live FX rates for a true blended net worth figure; PDF export of
approved guides for offline/legal use; scheduled reminders when a guide is over
12 months old; and a rule-based "asset completeness" score (nominees set, guide
approved, recent valuation) surfaced on the dashboard.
