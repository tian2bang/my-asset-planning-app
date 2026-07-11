import Link from "next/link";
import { getAssets } from "@/lib/data/assets";
import { getLiabilities } from "@/lib/data/liabilities";
import { computeCurrencyTotals, computeBreakdown } from "@/lib/data/dashboard";
import { AssetsTable } from "@/app/components/AssetsTable";
import { DashboardSummary } from "@/app/components/DashboardSummary";
import { BreakdownTable } from "@/app/components/BreakdownTable";
import { ErrorNotice, EmptyState } from "@/app/components/ui";

export default async function Home() {
  const [assetsResult, liabilitiesResult] = await Promise.all([
    getAssets(),
    getLiabilities(),
  ]);

  const assets = assetsResult.ok ? assetsResult.data : [];
  const liabilities = liabilitiesResult.ok ? liabilitiesResult.data : [];
  const activeAssets = assets.filter((a) => a.status === "active");

  const totals = computeCurrencyTotals(assets, liabilities);
  const countryBreakdown = computeBreakdown(
    activeAssets,
    (a) => a.country,
    (a) => a.currency,
    (a) => a.current_value,
  );
  const classBreakdown = computeBreakdown(
    activeAssets,
    (a) => a.asset_class,
    (a) => a.currency,
    (a) => a.current_value,
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Net Worth</h1>
        <p className="text-sm text-neutral-500">
          A demo portfolio across Malaysia, the US, and Singapore. Add, edit,
          or retire anything below — every change is saved live.
        </p>
      </div>

      {!assetsResult.ok ? (
        <ErrorNotice message={`Could not load assets: ${assetsResult.message}`} />
      ) : !liabilitiesResult.ok ? (
        <ErrorNotice message={`Could not load liabilities: ${liabilitiesResult.message}`} />
      ) : activeAssets.length === 0 && liabilities.length === 0 ? (
        <EmptyState
          title="No assets yet."
          description="Add your first asset to see your net worth summary."
          actionHref="/assets/new"
          actionLabel="Add your first asset"
        />
      ) : (
        <>
          <DashboardSummary totals={totals} />

          <div className="grid gap-8 sm:grid-cols-2">
            <BreakdownTable
              title="By Country"
              labelHeader="Country"
              rows={countryBreakdown}
              emptyMessage="No active assets yet."
            />
            <BreakdownTable
              title="By Asset Class"
              labelHeader="Class"
              rows={classBreakdown}
              emptyMessage="No active assets yet."
            />
          </div>
        </>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Assets</h2>
          <div className="flex items-center gap-4">
            <Link
              href="/liabilities"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              View Liabilities →
            </Link>
            <Link
              href="/assets/new"
              className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Add Asset
            </Link>
          </div>
        </div>

        {!assetsResult.ok ? (
          <ErrorNotice message={`Could not load assets: ${assetsResult.message}`} />
        ) : (
          <AssetsTable assets={assetsResult.data} />
        )}
      </div>
    </div>
  );
}
