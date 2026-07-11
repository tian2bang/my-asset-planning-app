import Link from "next/link";
import { getLiabilities } from "@/lib/data/liabilities";
import { LiabilitiesTable } from "@/app/components/LiabilitiesTable";
import { ErrorNotice } from "@/app/components/ui";

export default async function LiabilitiesPage() {
  const result = await getLiabilities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Liabilities</h1>
          <p className="text-sm text-neutral-500">
            Mortgages, loans, and credit obligations across every country.
          </p>
        </div>
        <Link
          href="/liabilities/new"
          className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Add Liability
        </Link>
      </div>

      {!result.ok ? (
        <ErrorNotice message={`Could not load liabilities: ${result.message}`} />
      ) : (
        <LiabilitiesTable liabilities={result.data} />
      )}
    </div>
  );
}
