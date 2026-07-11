# Agentic Layer

## Risk Levels & Actions

### Low — Auto-execute (no approval needed)
| Action | Trigger | Tool |
|---|---|---|
| Generate beneficiary guide draft | User clicks "Generate" | `generate_beneficiary_guide(asset_id)` |
| Tag asset completeness score | On any asset save | `score_asset_completeness(asset_id)` |

### Medium — Requires user confirmation
| Action | Trigger | Tool |
|---|---|---|
| Retire an asset | User clicks "Retire" | `retire_asset(asset_id)` |
| Overwrite an approved guide | User edits approved text | `override_guide(guide_id, new_text)` |

### High — Always requires explicit approval
| Action | Trigger | Tool |
|---|---|---|
| Share guide via email to nominee | Future feature | `email_guide(nominee_id, guide_id)` |

### Critical — Human only (never agentic)
- Permanent deletion of any record
- Any financial transaction or transfer instruction

## Named Tools (approved list)
- `generate_beneficiary_guide` — calls OpenAI server-side, writes to beneficiary_guides
- `score_asset_completeness` — pure rule-based, no external calls
- `retire_asset` — sets status='retired', writes audit log
- `override_guide` — updates guide_text, sets review_status='overridden', writes audit log

## Audit Log Fields
`action | entity_type | entity_id | user_id | payload (before/after) | created_at`

Every tool call writes one audit_log row before returning.

## v1 vs Later
- **v1:** `generate_beneficiary_guide` + `score_asset_completeness` + `retire_asset`
- **Later:** `email_guide` (high-risk, approval gate), scheduled stale-guide alerts
