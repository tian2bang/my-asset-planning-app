# Intelligence Layer

## Messy Input
User has an asset (e.g. "EPF account, Malaysia, MYR 310,000") with nominees but no idea how a beneficiary actually accesses it after death — procedures, contacts, legal steps.

## What Gets Structured
Before calling AI, the app assembles:
```json
{
  "asset_name": "EPF (Employees Provident Fund)",
  "asset_class": "pension",
  "country": "Malaysia",
  "currency": "MYR",
  "current_value": 310000,
  "nominees": [
    { "name": "Siti Rahim", "relationship": "Spouse", "share_percent": 100 }
  ]
}
```
This structured payload is the AI prompt context — no free-form guessing.

## Auto-Structured Fields (low risk, auto-applied)
- `guide_text` — plain-language step-by-step access instructions
- `guide_text_source` — model identifier
- `guide_text_confidence` — returned or estimated 0–1
- `guide_text_review_status` — starts at `'unreviewed'`, owner moves to `'approved'`

## Scoring Rules (rule-based, v1)
| Signal | Score impact |
|---|---|
| Has ≥1 nominee | +1 |
| Guide exists and approved | +1 |
| Value snapshot in last 12 months | +1 |
| Status = active | +1 |

Max score 4 → "Asset completeness" badge: 0–1 Incomplete, 2–3 Partial, 4 Complete.

## v1 vs Later
- **v1:** Guide generation + review_status toggle + completeness score badge
- **Later:** Confidence scoring via retrieval-augmented lookup of country-specific probate rules; auto-remind when guide is >12 months old
