"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/actions/audit";
import { requireUserId } from "@/lib/actions/require-user";
import type { ActionState } from "@/lib/actions/assets";

export async function markGuideReviewed(assetId: string, guideId: string) {
  const supabase = await createClient();
  await requireUserId(supabase);
  const { error } = await supabase
    .from("beneficiary_guides")
    .update({ guide_text_review_status: "approved" })
    .eq("id", guideId);

  if (error) {
    throw new Error(`Could not mark guide reviewed: ${error.message}`);
  }

  await writeAuditLog(supabase, {
    action: "guide.approved",
    entity_type: "beneficiary_guide",
    entity_id: guideId,
  });

  revalidatePath(`/assets/${assetId}`);
}

export async function overrideGuide(
  assetId: string,
  guideId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const guide_text = String(formData.get("guide_text") ?? "").trim();
  if (!guide_text) return { error: "Guide text cannot be empty." };

  const supabase = await createClient();
  try {
    await requireUserId(supabase);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not signed in." };
  }

  const { error } = await supabase
    .from("beneficiary_guides")
    .update({ guide_text, guide_text_review_status: "overridden" })
    .eq("id", guideId);

  if (error) {
    return { error: `Could not save changes: ${error.message}` };
  }

  await writeAuditLog(supabase, {
    action: "guide.overridden",
    entity_type: "beneficiary_guide",
    entity_id: guideId,
    payload: { after: { guide_text } },
  });

  revalidatePath(`/assets/${assetId}`);
  return {};
}
