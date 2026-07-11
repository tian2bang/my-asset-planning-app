"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/actions/audit";
import { ValidationError } from "@/lib/actions/errors";
import { requireUserId } from "@/lib/actions/require-user";
import type { ActionState } from "@/lib/actions/assets";

interface LiabilityFields {
  name: string;
  liability_type: string;
  country: string;
  currency: string;
  outstanding_amount: number;
  original_amount: number | null;
  interest_rate: number | null;
  due_date: string | null;
  notes: string | null;
}

function parseLiabilityForm(formData: FormData): LiabilityFields {
  const name = String(formData.get("name") ?? "").trim();
  const liability_type = String(formData.get("liability_type") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const currency = String(formData.get("currency") ?? "USD").trim();
  const outstanding_amount = Number(formData.get("outstanding_amount"));
  const original_amountRaw = formData.get("original_amount");
  const interest_rateRaw = formData.get("interest_rate");
  const due_date = String(formData.get("due_date") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) throw new ValidationError("Liability name is required.");
  if (!liability_type) throw new ValidationError("Liability type is required.");
  if (!country) throw new ValidationError("Country is required.");
  if (Number.isNaN(outstanding_amount) || outstanding_amount < 0) {
    throw new ValidationError("Outstanding amount must be a non-negative number.");
  }

  const original_amount =
    original_amountRaw && String(original_amountRaw).trim() !== ""
      ? Number(original_amountRaw)
      : null;
  const interest_rate =
    interest_rateRaw && String(interest_rateRaw).trim() !== ""
      ? Number(interest_rateRaw)
      : null;

  return {
    name,
    liability_type,
    country,
    currency: currency || "USD",
    outstanding_amount,
    original_amount,
    interest_rate,
    due_date: due_date || null,
    notes: notes || null,
  };
}

export async function createLiability(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let fields: LiabilityFields;
  try {
    fields = parseLiabilityForm(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Invalid input." };
  }

  const supabase = await createClient();
  let userId: string;
  try {
    userId = await requireUserId(supabase);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not signed in." };
  }

  const { data, error } = await supabase
    .from("liabilities")
    .insert({ ...fields, user_id: userId })
    .select("id")
    .single();

  if (error) {
    return { error: `Could not save liability: ${error.message}` };
  }

  await writeAuditLog(supabase, {
    action: "liability.created",
    entity_type: "liability",
    entity_id: data.id,
    payload: { after: fields },
  });

  revalidatePath("/liabilities");
  redirect(`/liabilities/${data.id}`);
}

export async function updateLiability(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let fields: LiabilityFields;
  try {
    fields = parseLiabilityForm(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Invalid input." };
  }

  const supabase = await createClient();
  try {
    await requireUserId(supabase);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not signed in." };
  }

  const { error } = await supabase.from("liabilities").update(fields).eq("id", id);

  if (error) {
    return { error: `Could not update liability: ${error.message}` };
  }

  await writeAuditLog(supabase, {
    action: "liability.updated",
    entity_type: "liability",
    entity_id: id,
    payload: { after: fields },
  });

  revalidatePath("/liabilities");
  revalidatePath(`/liabilities/${id}`);
  redirect(`/liabilities/${id}`);
}

export async function settleLiability(id: string) {
  const supabase = await createClient();
  await requireUserId(supabase);
  const { error } = await supabase
    .from("liabilities")
    .update({ status: "settled" })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not settle liability: ${error.message}`);
  }

  await writeAuditLog(supabase, {
    action: "liability.settled",
    entity_type: "liability",
    entity_id: id,
  });

  revalidatePath("/liabilities");
  revalidatePath(`/liabilities/${id}`);
}

export async function reactivateLiability(id: string) {
  const supabase = await createClient();
  await requireUserId(supabase);
  const { error } = await supabase
    .from("liabilities")
    .update({ status: "active" })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not reactivate liability: ${error.message}`);
  }

  await writeAuditLog(supabase, {
    action: "liability.reactivated",
    entity_type: "liability",
    entity_id: id,
  });

  revalidatePath("/liabilities");
  revalidatePath(`/liabilities/${id}`);
}
