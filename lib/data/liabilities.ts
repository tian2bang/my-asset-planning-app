import { createClient } from "@/lib/supabase/server";
import type { Liability } from "@/lib/types";
import type { Fetched } from "@/lib/data/assets";

export async function getLiabilities(): Promise<Fetched<Liability[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("liabilities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { ok: false, message: error.message };
  return { ok: true, data: (data ?? []) as Liability[] };
}

export async function getLiability(id: string): Promise<Fetched<Liability | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("liabilities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return { ok: false, message: error.message };
  return { ok: true, data: (data ?? null) as Liability | null };
}
