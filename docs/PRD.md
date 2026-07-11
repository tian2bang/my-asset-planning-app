# Product Requirements — My Asset Planning App

## Problem
People approaching retirement have assets and liabilities scattered across countries, institutions, and asset classes with no single place to track them, log changes, or tell their beneficiaries what to do when they die.

## Target User
A working professional (35–60) with assets in 2+ countries who wants a clear picture of their retirement wealth and a documented handoff plan for their family.

## Core Objects
- **Asset** — name, class (property/equities/pension/crypto/cash/other), country, currency, current value, status
- **Liability** — name, type (mortgage/loan/credit), country, currency, outstanding amount, due date
- **Value Snapshot** — point-in-time value change log for any asset or liability
- **Nominee** — beneficiary linked to an asset, with share % and contact details
- **Beneficiary Guide** — AI-drafted plain-language instructions for accessing an asset after the owner's death

## MVP Must-Haves (v1)
- [ ] Add / edit / retire an asset (any class, any country)
- [ ] Add / edit / retire a liability
- [ ] Log a value change for any asset or liability
- [ ] Add nominees to an asset with share percentages
- [ ] Generate, view, and approve a beneficiary access guide per asset
- [ ] App renders with demo data for anonymous visitors — no login wall

## Non-Goals (v1)
- User authentication and per-user data isolation
- Live FX/currency conversion
- PDF export of guides
- Document file uploads
- Retirement gap / readiness scoring

## Success Criteria
A recruiter opens the live URL, sees a populated dashboard of assets across Malaysia and the US, clicks an asset, views nominees and a generated beneficiary guide, adds a new asset via the form, and the new row appears in the list — all without creating an account.
