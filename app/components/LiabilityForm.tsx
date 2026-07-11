"use client";

import { useActionState } from "react";
import type { Liability } from "@/lib/types";
import { LIABILITY_TYPES, CURRENCIES } from "@/lib/types";
import type { ActionState } from "@/lib/actions/assets";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ErrorNotice } from "@/app/components/ui";

export function LiabilityForm({
  action,
  initial,
  submitLabel = "Save Liability",
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: Partial<Liability>;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <ErrorNotice message={state.error} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700">
            Name
          </label>
          <input
            name="name"
            defaultValue={initial?.name}
            required
            placeholder="e.g. KL Condo Mortgage"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Type
          </label>
          <select
            name="liability_type"
            defaultValue={initial?.liability_type ?? ""}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm capitalize focus:border-neutral-500 focus:outline-none"
          >
            <option value="" disabled>
              Select a type
            </option>
            {LIABILITY_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Country
          </label>
          <input
            name="country"
            defaultValue={initial?.country}
            required
            placeholder="e.g. Malaysia"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Currency
          </label>
          <select
            name="currency"
            defaultValue={initial?.currency ?? "USD"}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Outstanding Amount
          </label>
          <input
            name="outstanding_amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initial?.outstanding_amount}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Original Amount
          </label>
          <input
            name="original_amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initial?.original_amount ?? ""}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Interest Rate (%)
          </label>
          <input
            name="interest_rate"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initial?.interest_rate ?? ""}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Due Date
          </label>
          <input
            name="due_date"
            type="date"
            defaultValue={initial?.due_date ?? ""}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700">
            Notes
          </label>
          <textarea
            name="notes"
            defaultValue={initial?.notes ?? ""}
            rows={3}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
