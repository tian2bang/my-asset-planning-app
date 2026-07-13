"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/assets";
import { requestPasswordReset } from "@/lib/actions/auth";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ErrorNotice, InfoNotice } from "@/app/components/ui";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    requestPasswordReset,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <ErrorNotice message={state.error} />}
      {state.message && <InfoNotice message={state.message} />}
      <div>
        <label className="block text-sm font-medium text-neutral-700">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>
      <SubmitButton className="w-full">Send Reset Link</SubmitButton>
    </form>
  );
}
