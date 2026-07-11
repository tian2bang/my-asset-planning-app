export type AssetStatus = "active" | "retired";
export type LiabilityStatus = "active" | "settled";
export type RecordType = "asset" | "liability";
export type ReviewStatus = "unreviewed" | "approved" | "overridden";

export interface Asset {
  id: string;
  user_id: string | null;
  name: string;
  asset_class: string;
  country: string;
  currency: string;
  current_value: number;
  acquisition_date: string | null;
  status: AssetStatus;
  notes: string | null;
  created_at: string;
}

export interface Liability {
  id: string;
  user_id: string | null;
  name: string;
  liability_type: string;
  country: string;
  currency: string;
  outstanding_amount: number;
  original_amount: number | null;
  interest_rate: number | null;
  due_date: string | null;
  status: LiabilityStatus;
  notes: string | null;
  created_at: string;
}

export interface ValueSnapshot {
  id: string;
  user_id: string | null;
  record_id: string;
  record_type: RecordType;
  previous_value: number | null;
  new_value: number;
  currency: string;
  reason: string | null;
  snapshot_date: string;
  created_at: string;
}

export interface Nominee {
  id: string;
  user_id: string | null;
  asset_id: string | null;
  liability_id: string | null;
  full_name: string;
  relationship: string;
  email: string | null;
  phone: string | null;
  share_percent: number;
  notes: string | null;
  created_at: string;
}

export interface BeneficiaryGuide {
  id: string;
  user_id: string | null;
  asset_id: string;
  guide_text: string;
  guide_text_source: string | null;
  guide_text_confidence: number | null;
  guide_text_review_status: ReviewStatus;
  version: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export const ASSET_CLASSES = [
  "property",
  "equities",
  "pension",
  "crypto",
  "cash",
  "other",
] as const;

export const LIABILITY_TYPES = [
  "mortgage",
  "personal_loan",
  "credit_card",
  "other",
] as const;

export const RELATIONSHIPS = ["spouse", "child", "sibling", "other"] as const;

export const CURRENCIES = [
  "USD",
  "MYR",
  "SGD",
  "GBP",
  "EUR",
  "AUD",
  "HKD",
  "JPY",
] as const;
