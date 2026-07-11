import type { BreakdownRow } from "@/lib/data/dashboard";
import { EmptyState, formatMoney } from "@/app/components/ui";

export function BreakdownTable({
  title,
  labelHeader,
  rows,
  emptyMessage,
}: {
  title: string;
  labelHeader: string;
  rows: BreakdownRow[];
  emptyMessage: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {rows.length === 0 ? (
        <EmptyState title={emptyMessage} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">{labelHeader}</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row) => (
                <tr key={`${row.label}-${row.currency}`}>
                  <td className="px-4 py-3 capitalize">{row.label}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatMoney(row.total, row.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
