import type { SupabaseClient } from "@supabase/supabase-js";

export async function writeAuditLog(
  supabase: SupabaseClient,
  params: {
    action: string;
    entity_type: string;
    entity_id: string | null;
    payload?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from("audit_logs").insert({
    action: params.action,
    entity_type: params.entity_type,
    entity_id: params.entity_id,
    payload: params.payload ?? null,
  });
  if (error) {
    console.error("[audit_log] failed to write", params.action, error.message);
  }
}
