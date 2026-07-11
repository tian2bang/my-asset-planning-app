import Link from "next/link";
import type { Asset } from "@/lib/types";
import { Badge, EmptyState, formatMoney, statusTone } from "@/app/components/ui";

export function AssetsTable({ assets }: { assets: Asset[] }) {
  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets yet."
        description="Add your first asset to start tracking your net worth."
        actionHref="/assets/new"
        actionLabel="Add your first asset"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="min-w-full divide-y divide-neutral-200 text-sm">
        <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3 text-right">Value</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <Link
                  href={`/assets/${asset.id}`}
                  className="font-medium text-neutral-900 hover:underline"
                >
                  {asset.name}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize text-neutral-600">
                {asset.asset_class}
              </td>
              <td className="px-4 py-3 text-neutral-600">{asset.country}</td>
              <td className="px-4 py-3 text-right font-medium">
                {formatMoney(asset.current_value, asset.currency)}
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(asset.status)}>{asset.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
