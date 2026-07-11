"use client";

import { useActionState } from "react";
import type { Asset } from "@/lib/types";
import { ASSET_CLASSES, CURRENCIES } from "@/lib/types";
import type { ActionState } from "@/lib/actions/assets";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ErrorNotice } from "@/app/components/ui";

export function AssetForm({
  action,
  initial,
  submitLabel = "Save Asset",
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: Partial<Asset>;
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
            placeholder="e.g. Kuala Lumpur Condo"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Asset Class
          </label>
          <select
            name="asset_class"
            defaultValue={initial?.asset_class ?? ""}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm capitalize focus:border-neutral-500 focus:outline-none"
          >
            <option value="" disabled>
              Select a class
            </option>
            {ASSET_CLASSES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
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
            Current Value
          </label>
          <input
            name="current_value"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initial?.current_value}
            required
            placeholder="0"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Acquisition Date
          </label>
          <input
            name="acquisition_date"
            type="date"
            defaultValue={initial?.acquisition_date ?? ""}
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
            placeholder="Optional details — account numbers, location of documents, etc."
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
