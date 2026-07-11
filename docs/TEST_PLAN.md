# Test Plan

## V1 Success Scenario (manual, end-to-end)

1. Open live URL in incognito — demo assets list renders within 3 s
2. Confirm 4 seeded assets appear (KL Condo, S&P 500, EPF, Bitcoin)
3. Click "KL Condo" → detail page shows field values, 2 nominees, 1 snapshot
4. Click **Add Asset** → fill all fields → submit → new row appears in list
5. Click new asset → click **Log Value Change** → enter new value + reason → submit → snapshot appears in history
6. Click **Add Nominee** → fill name/relationship/share% → submit → nominee appears
7. Click **Generate Guide** → loading spinner shows → guide card appears with 'unreviewed' badge
8. Click **Mark Reviewed** → badge changes to 'approved'
9. Hard-reload page → approved guide still shown (DB-persisted, not state-only)
10. Open Supabase table editor → confirm new rows exist in assets, nominees, value_snapshots, beneficiary_guides, audit_logs

## Empty State Tests
| Screen | Action | Expected |
|---|---|---|
| Asset list | Delete all demo assets | "No assets yet. Add your first one." CTA visible |
| Value history | New asset, no snapshots | "No value history yet." message |
| Nominees | New asset, no nominees | "No nominees added yet." message |
| Beneficiary guide | No guide generated | "Generate a guide for your nominees" prompt |

## Error State Tests
| Scenario | Expected |
|---|---|
| Submit Add Asset with empty name | Inline validation error, no DB write |
| Nominee shares exceed 100% | Validation error shown before submit |
| OpenAI API unreachable | Toast: "Guide generation failed — try again"; no partial row written |
| Supabase unreachable | Asset list shows error state, not blank screen |

## Security Smoke Tests
- Open browser DevTools → Network tab → trigger Generate Guide → confirm no request contains `OPENAI_API_KEY`
- Inspect JS bundles → grep for `service_role` → must return zero results
- (Post Sprint 5) Log in as User A, copy asset URL, log in as User B → URL returns 404 or empty
