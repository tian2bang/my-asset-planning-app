# Tasks & Sprints

## Sprint 1 — Database & Core CRUD Engine
**Goal:** Assets and liabilities can be created, viewed, and edited against a live database. Demo data visible without login.

- [ ] Apply migration SQL to Supabase (all tables + RLS v1 policies + seed data)
- [ ] `/` home page shows asset list — loading / empty / error / partial / ready states
- [ ] Add Asset form: name, class, country, currency, value → writes to `assets` table
- [ ] Asset detail page: shows all fields
- [ ] Liability list page — all five UI states
- [ ] Add Liability form → writes to `liabilities` table
- [ ] Edit and Retire actions for assets and liabilities (soft-delete via `status`)
- [ ] Confirm every form persists to Supabase and list refreshes without a manual reload

**Definition of Done:** A new asset added via the form appears in the list on the same browser session AND on a fresh incognito tab — proving it is in the database.

---

## Sprint 2 — Value History & Nominees
**Goal:** Value changes are logged over time; each asset has named beneficiaries.

- [ ] Log Value Change form per asset/liability → writes to `value_snapshots`
- [ ] Value history timeline on asset detail (chronological list of snapshots)
- [ ] Add Nominee form (name, relationship, email, phone, share%) → writes to `nominees`
- [ ] Nominee list on asset detail page
- [ ] Validate that share % across nominees for one asset ≤ 100
- [ ] Empty states: "No value history yet" / "No nominees yet"

**Definition of Done:** Log a value change, reload the page — snapshot is visible. Add two nominees summing to 100% — both appear on reload.

---

## Sprint 3 — Beneficiary Access Guide (AI + Review) ★ v1 functional milestone
**Goal:** The end-to-end success scenario is fully usable.

- [ ] "Generate Guide" button on asset detail → POST to `/api/generate-guide`
- [ ] Server-side API route assembles structured asset + nominee payload, calls OpenAI
- [ ] Response stored in `beneficiary_guides` (guide_text, source, confidence, review_status='unreviewed')
- [ ] Audit log row written on generation
- [ ] Guide card renders with confidence badge and review_status label
- [ ] "Mark Reviewed" button → sets review_status='approved', writes audit log
- [ ] Manual text edit → sets review_status='overridden', writes audit log
- [ ] Guide survives page refresh (fetched from DB, not component state)
- [ ] OpenAI key confirmed absent from browser network tab

**Definition of Done:** Open demo asset page in incognito → click Generate Guide → guide appears with 'unreviewed' badge → click Mark Reviewed → badge changes to 'approved' → reload → approved guide still shown.

---

## Sprint 4 — Net Worth Dashboard
**Goal:** Instant financial summary across all assets and liabilities.

- [ ] Summary cards: Total Assets, Total Liabilities, Net Worth (assets − liabilities)
- [ ] Country breakdown table (group by country, sum values)
- [ ] Asset class breakdown table
- [ ] Empty state with "Add your first asset" CTA
- [ ] All figures re-fetched from DB on load (no stale client cache)

**Definition of Done:** Add a new asset → return to dashboard → totals have updated.

---

## Sprint 5 — Lock It Down (Auth + RLS)
**Goal:** Each user sees only their own data; no cross-user leakage.

- [ ] Enable Supabase Auth (email/password)
- [ ] Sign-up and login pages
- [ ] On write actions, populate `user_id` with `auth.uid()`
- [ ] Replace v1 permissive policies with owner-scoped RLS on all tables
- [ ] Demo seed rows (user_id = null) remain readable to anonymous visitors
- [ ] Test: User A cannot read User B's assets (test with two Supabase sessions)

**Definition of Done:** Two test accounts created; User A's assets are invisible to User B in both UI and direct Supabase queries.

---

## Sprint 6 — Polish & Deploy
**Goal:** Deployable portfolio piece a recruiter can evaluate in 30 seconds.

- [ ] Responsive layout (mobile + desktop)
- [ ] Consistent empty-state copy and error toasts across all pages
- [ ] README: local setup, env vars, demo URL
- [ ] Deploy to Vercel with production env vars set
- [ ] 300-word written case study (problem → decisions → demo link → next steps)

**Definition of Done:** Live URL opens in mobile Chrome, displays demo assets, form submits successfully, no console errors.

---

## Gantt (sprint → feature)
```
Sprint 1  [DB schema] [Asset CRUD] [Liability CRUD]
Sprint 2             [Value history] [Nominees]
Sprint 3                            [AI Guide] ← v1 functional
Sprint 4                                      [Dashboard]
Sprint 5                                                 [Auth + RLS]
Sprint 6                                                             [Polish + Deploy]
```
