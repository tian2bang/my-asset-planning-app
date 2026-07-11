import Link from "next/link";
import { getAssets } from "@/lib/data/assets";
import { AssetsTable } from "@/app/components/AssetsTable";
import { ErrorNotice } from "@/app/components/ui";

export default async function AssetsPage() {
  const result = await getAssets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
          <p className="text-sm text-neutral-500">
            Every asset you own, across every country and currency.
          </p>
        </div>
        <Link
          href="/assets/new"
          className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Add Asset
        </Link>
      </div>

      {!result.ok ? (
        <ErrorNotice message={`Could not load assets: ${result.message}`} />
      ) : (
        <AssetsTable assets={result.data} />
      )}
    </div>
  );
}
