"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/assets";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ErrorNotice, InfoNotice } from "@/app/components/ui";

export function AuthForm({
  action,
  submitLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

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
      <div>
        <label className="block text-sm font-medium text-neutral-700">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>
      <SubmitButton className="w-full">{submitLabel}</SubmitButton>
    </form>
  );
}
