"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/actions/audit";
import { ValidationError } from "@/lib/actions/errors";
import { requireUserId } from "@/lib/actions/require-user";

export interface ActionState {
  error?: string;
  message?: string;
}

interface AssetFields {
  name: string;
  asset_class: string;
  country: string;
  currency: string;
  current_value: number;
  acquisition_date: string | null;
  notes: string | null;
}

function parseAssetForm(formData: FormData): AssetFields {
  const name = String(formData.get("name") ?? "").trim();
  const asset_class = String(formData.get("asset_class") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const currency = String(formData.get("currency") ?? "USD").trim();
  const current_value = Number(formData.get("current_value"));
  const acquisition_date = String(formData.get("acquisition_date") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) throw new ValidationError("Asset name is required.");
  if (!asset_class) throw new ValidationError("Asset class is required.");
  if (!country) throw new ValidationError("Country is required.");
  if (Number.isNaN(current_value) || current_value < 0) {
    throw new ValidationError("Current value must be a non-negative number.");
  }

  return {
    name,
    asset_class,
    country,
    currency: currency || "USD",
    current_value,
    acquisition_date: acquisition_date || null,
    notes: notes || null,
  };
}

export async function createAsset(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let fields: AssetFields;
  try {
    fields = parseAssetForm(formData);
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
    .from("assets")
    .insert({ ...fields, user_id: userId })
    .select("id")
    .single();

  if (error) {
    return { error: `Could not save asset: ${error.message}` };
  }

  await writeAuditLog(supabase, {
    action: "asset.created",
    entity_type: "asset",
    entity_id: data.id,
    payload: { after: fields },
  });

  revalidatePath("/");
  revalidatePath("/assets");
  redirect(`/assets/${data.id}`);
}

export async function updateAsset(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let fields: AssetFields;
  try {
    fields = parseAssetForm(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Invalid input." };
  }

  const supabase = await createClient();
  try {
    await requireUserId(supabase);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not signed in." };
  }

  const { error } = await supabase.from("assets").update(fields).eq("id", id);

  if (error) {
    return { error: `Could not update asset: ${error.message}` };
  }

  await writeAuditLog(supabase, {
    action: "asset.updated",
    entity_type: "asset",
    entity_id: id,
    payload: { after: fields },
  });

  revalidatePath("/");
  revalidatePath("/assets");
  revalidatePath(`/assets/${id}`);
  redirect(`/assets/${id}`);
}

export async function retireAsset(id: string) {
  const supabase = await createClient();
  await requireUserId(supabase);
  const { error } = await supabase
    .from("assets")
    .update({ status: "retired" })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not retire asset: ${error.message}`);
  }

  await writeAuditLog(supabase, {
    action: "asset.retired",
    entity_type: "asset",
    entity_id: id,
  });

  revalidatePath("/");
  revalidatePath("/assets");
  revalidatePath(`/assets/${id}`);
}

export async function reactivateAsset(id: string) {
  const supabase = await createClient();
  await requireUserId(supabase);
  const { error } = await supabase
    .from("assets")
    .update({ status: "active" })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not reactivate asset: ${error.message}`);
  }

  await writeAuditLog(supabase, {
    action: "asset.reactivated",
    entity_type: "asset",
    entity_id: id,
  });

  revalidatePath("/");
  revalidatePath("/assets");
  revalidatePath(`/assets/${id}`);
}
