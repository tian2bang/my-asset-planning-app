"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/actions/audit";
import type { ActionState } from "@/lib/actions/assets";

export async function createNominee(
  assetId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const relationship = String(formData.get("relationship") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const share_percent = Number(formData.get("share_percent"));
  const notes = String(formData.get("notes") ?? "").trim();

  if (!full_name) return { error: "Nominee name is required." };
  if (!relationship) return { error: "Relationship is required." };
  if (Number.isNaN(share_percent) || share_percent <= 0 || share_percent > 100) {
    return { error: "Share percent must be between 1 and 100." };
  }

  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("nominees")
    .select("share_percent")
    .eq("asset_id", assetId);

  if (existingError) {
    return { error: `Could not validate share total: ${existingError.message}` };
  }

  const existingTotal = (existing ?? []).reduce(
    (sum, n) => sum + Number(n.share_percent ?? 0),
    0,
  );

  if (existingTotal + share_percent > 100) {
    return {
      error: `Share total would exceed 100% (existing nominees already hold ${existingTotal}%).`,
    };
  }

  const { data, error } = await supabase
    .from("nominees")
    .insert({
      asset_id: assetId,
      full_name,
      relationship,
      email: email || null,
      phone: phone || null,
      share_percent,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: `Could not save nominee: ${error.message}` };
  }

  await writeAuditLog(supabase, {
    action: "nominee.created",
    entity_type: "nominee",
    entity_id: data.id,
    payload: { after: { asset_id: assetId, full_name, relationship, share_percent } },
  });

  revalidatePath(`/assets/${assetId}`);
  return {};
}

export async function deleteNominee(assetId: string, nomineeId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("nominees").delete().eq("id", nomineeId);

  if (error) {
    throw new Error(`Could not remove nominee: ${error.message}`);
  }

  await writeAuditLog(supabase, {
    action: "nominee.removed",
    entity_type: "nominee",
    entity_id: nomineeId,
    payload: { asset_id: assetId },
  });

  revalidatePath(`/assets/${assetId}`);
}
