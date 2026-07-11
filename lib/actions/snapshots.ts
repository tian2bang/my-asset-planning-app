"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/actions/audit";
import type { ActionState } from "@/lib/actions/assets";
import type { RecordType } from "@/lib/types";

export async function logValueChange(
  recordType: RecordType,
  recordId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const new_value = Number(formData.get("new_value"));
  const reason = String(formData.get("reason") ?? "").trim();
  const snapshot_date = String(formData.get("snapshot_date") ?? "").trim();

  if (Number.isNaN(new_value) || new_value < 0) {
    return { error: "New value must be a non-negative number." };
  }

  const supabase = await createClient();
  const table = recordType === "asset" ? "assets" : "liabilities";
  const valueColumn = recordType === "asset" ? "current_value" : "outstanding_amount";

  const { data: record, error: fetchError } = await supabase
    .from(table)
    .select(`${valueColumn}, currency`)
    .eq("id", recordId)
    .single();

  if (fetchError || !record) {
    return { error: `Could not find record: ${fetchError?.message ?? "not found"}` };
  }

  const previous_value = (record as unknown as Record<string, number>)[valueColumn];
  const currency = (record as unknown as { currency: string }).currency;

  const { error: insertError } = await supabase.from("value_snapshots").insert({
    record_id: recordId,
    record_type: recordType,
    previous_value,
    new_value,
    currency,
    reason: reason || null,
    snapshot_date: snapshot_date || new Date().toISOString().slice(0, 10),
  });

  if (insertError) {
    return { error: `Could not log value change: ${insertError.message}` };
  }

  const { error: updateError } = await supabase
    .from(table)
    .update({ [valueColumn]: new_value })
    .eq("id", recordId);

  if (updateError) {
    return { error: `Could not update current value: ${updateError.message}` };
  }

  await writeAuditLog(supabase, {
    action: `${recordType}.value_logged`,
    entity_type: recordType,
    entity_id: recordId,
    payload: { previous_value, new_value, reason: reason || null },
  });

  const basePath = recordType === "asset" ? "/assets" : "/liabilities";
  revalidatePath(basePath);
  revalidatePath(`${basePath}/${recordId}`);
  if (recordType === "asset") revalidatePath("/");

  return {};
}
