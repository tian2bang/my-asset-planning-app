import { createClient } from "@/lib/supabase/server";
import type { Asset, Nominee, ValueSnapshot, BeneficiaryGuide } from "@/lib/types";

export type Fetched<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export async function getAssets(): Promise<Fetched<Asset[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { ok: false, message: error.message };
  return { ok: true, data: (data ?? []) as Asset[] };
}

export async function getAsset(id: string): Promise<Fetched<Asset | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return { ok: false, message: error.message };
  return { ok: true, data: (data ?? null) as Asset | null };
}

export async function getNomineesForAsset(
  assetId: string,
): Promise<Fetched<Nominee[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nominees")
    .select("*")
    .eq("asset_id", assetId)
    .order("created_at", { ascending: true });

  if (error) return { ok: false, message: error.message };
  return { ok: true, data: (data ?? []) as Nominee[] };
}

export async function getSnapshotsForRecord(
  recordId: string,
  recordType: "asset" | "liability",
): Promise<Fetched<ValueSnapshot[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("value_snapshots")
    .select("*")
    .eq("record_id", recordId)
    .eq("record_type", recordType)
    .order("snapshot_date", { ascending: false });

  if (error) return { ok: false, message: error.message };
  return { ok: true, data: (data ?? []) as ValueSnapshot[] };
}

export async function getGuideForAsset(
  assetId: string,
): Promise<Fetched<BeneficiaryGuide | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("beneficiary_guides")
    .select("*")
    .eq("asset_id", assetId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { ok: false, message: error.message };
  return { ok: true, data: (data ?? null) as BeneficiaryGuide | null };
}
