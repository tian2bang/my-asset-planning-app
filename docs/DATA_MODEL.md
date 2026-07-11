# Data Model

## assets
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid nullable | owner scope (set at lock-down) |
| name | text | e.g. "KL Condo" |
| asset_class | text | property, equities, pension, crypto, cash, other |
| country | text | where asset is held |
| currency | text | ISO 4217 |
| current_value | numeric | latest known value |
| acquisition_date | date | |
| status | text | active, retired |
| notes | text | |
| created_at | timestamptz | |

## liabilities
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| name | text | |
| liability_type | text | mortgage, personal_loan, credit_card, other |
| country | text | |
| currency | text | |
| outstanding_amount | numeric | |
| original_amount | numeric | |
| interest_rate | numeric | % |
| due_date | date | |
| status | text | active, settled |
| notes | text | |
| created_at | timestamptz | |

## value_snapshots
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| record_id | uuid | FK to asset or liability |
| record_type | text | 'asset' or 'liability' |
| previous_value | numeric | |
| new_value | numeric | |
| currency | text | |
| reason | text | free text |
| snapshot_date | date | |
| created_at | timestamptz | |

## nominees
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| asset_id | uuid nullable | |
| liability_id | uuid nullable | |
| full_name | text | |
| relationship | text | spouse, child, sibling, other |
| email | text | |
| phone | text | |
| share_percent | numeric | must sum to 100 per asset |
| notes | text | |
| created_at | timestamptz | |

## beneficiary_guides
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| asset_id | uuid | |
| guide_text | text | **AI field** |
| guide_text_source | text | e.g. 'openai-gpt-4o' |
| guide_text_confidence | numeric | 0–1 |
| guide_text_review_status | text | unreviewed / approved / overridden |
| version | integer | increments on regeneration |
| created_at | timestamptz | |

## audit_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| action | text | e.g. 'guide.generated', 'asset.retired' |
| entity_type | text | |
| entity_id | uuid | |
| payload | jsonb | before/after snapshot |
| created_at | timestamptz | |

## RLS
- v1: all tables have permissive SELECT + ALL policies (demo-first)
- Lock-Down sprint: replace with `auth.uid() = user_id` owner policies
