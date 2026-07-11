"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/lib/actions/assets";
import { RELATIONSHIPS } from "@/lib/types";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ErrorNotice } from "@/app/components/ui";

export function AddNomineeForm({
  action,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
      >
        Add Nominee
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      {state.error && <ErrorNotice message={state.error} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-neutral-600">Full Name</label>
          <input
            name="full_name"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600">Relationship</label>
          <select
            name="relationship"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm capitalize focus:border-neutral-500 focus:outline-none"
          >
            <option value="" disabled>
              Select
            </option>
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r} className="capitalize">
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600">Email</label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600">Phone</label>
          <input
            name="phone"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600">Share %</label>
          <input
            name="share_percent"
            type="number"
            min="1"
            max="100"
            step="0.01"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <SubmitButton>Add Nominee</SubmitButton>
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
