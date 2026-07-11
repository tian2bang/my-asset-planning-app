import type { SupabaseClient } from "@supabase/supabase-js";

export class AuthRequiredError extends Error {
  constructor() {
    super("You must be signed in to do this.");
  }
}

export async function requireUserId(supabase: SupabaseClient): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new AuthRequiredError();
  return user.id;
}
