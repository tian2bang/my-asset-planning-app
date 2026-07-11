import type { ValueSnapshot } from "@/lib/types";
import { EmptyState, formatMoney } from "@/app/components/ui";

export function ValueHistoryList({ snapshots }: { snapshots: ValueSnapshot[] }) {
  if (snapshots.length === 0) {
    return <EmptyState title="No value history yet." />;
  }

  return (
    <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
      {snapshots.map((s) => (
        <li key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
          <div>
            <p className="font-medium">
              {s.previous_value != null
                ? `${formatMoney(s.previous_value, s.currency)} → ${formatMoney(s.new_value, s.currency)}`
                : formatMoney(s.new_value, s.currency)}
            </p>
            <p className="text-xs text-neutral-500">
              {s.snapshot_date}
              {s.reason ? ` · ${s.reason}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
