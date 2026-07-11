"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/lib/actions/assets";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ErrorNotice } from "@/app/components/ui";

export function LogValueChangeForm({
  action,
  currency,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  currency: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
      >
        Log Value Change
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      {state.error && <ErrorNotice message={state.error} />}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-neutral-600">
            New Value ({currency})
          </label>
          <input
            name="new_value"
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600">Date</label>
          <input
            name="snapshot_date"
            type="date"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600">Reason</label>
          <input
            name="reason"
            placeholder="e.g. annual revaluation"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <SubmitButton>Save Change</SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
