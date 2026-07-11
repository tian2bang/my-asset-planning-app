import Link from "next/link";
import type { Liability } from "@/lib/types";
import { Badge, EmptyState, formatMoney, statusTone } from "@/app/components/ui";

export function LiabilitiesTable({ liabilities }: { liabilities: Liability[] }) {
  if (liabilities.length === 0) {
    return (
      <EmptyState
        title="No liabilities yet."
        description="Add a liability to keep a complete picture of your net worth."
        actionHref="/liabilities/new"
        actionLabel="Add a liability"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table className="min-w-full divide-y divide-neutral-200 text-sm">
        <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3 text-right">Outstanding</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {liabilities.map((l) => (
            <tr key={l.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <Link
                  href={`/liabilities/${l.id}`}
                  className="font-medium text-neutral-900 hover:underline"
                >
                  {l.name}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize text-neutral-600">
                {l.liability_type.replace("_", " ")}
              </td>
              <td className="px-4 py-3 text-neutral-600">{l.country}</td>
              <td className="px-4 py-3 text-right font-medium">
                {formatMoney(l.outstanding_amount, l.currency)}
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(l.status)}>{l.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
