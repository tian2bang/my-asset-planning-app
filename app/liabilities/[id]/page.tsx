import Link from "next/link";
import { notFound } from "next/navigation";
import { getLiability } from "@/lib/data/liabilities";
import { getSnapshotsForRecord } from "@/lib/data/assets";
import { Badge, Card, ErrorNotice, formatMoney, statusTone } from "@/app/components/ui";
import { settleLiability, reactivateLiability } from "@/lib/actions/liabilities";
import { logValueChange } from "@/lib/actions/snapshots";
import { ConfirmSubmitButton } from "@/app/components/ConfirmSubmitButton";
import { LogValueChangeForm } from "@/app/components/LogValueChangeForm";
import { ValueHistoryList } from "@/app/components/ValueHistoryList";

export default async function LiabilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, snapshotsResult] = await Promise.all([
    getLiability(id),
    getSnapshotsForRecord(id, "liability"),
  ]);

  if (!result.ok) {
    return <ErrorNotice message={`Could not load liability: ${result.message}`} />;
  }
  if (!result.data) notFound();

  const liability = result.data;
  const boundSettle = settleLiability.bind(null, liability.id);
  const boundReactivate = reactivateLiability.bind(null, liability.id);
  const boundLogValueChange = logValueChange.bind(null, "liability", liability.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{liability.name}</h1>
            <Badge tone={statusTone(liability.status)}>{liability.status}</Badge>
          </div>
          <p className="text-sm text-neutral-500 capitalize">
            {liability.liability_type.replace("_", " ")} · {liability.country}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/liabilities/${liability.id}/edit`}
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Edit
          </Link>
          {liability.status === "active" ? (
            <form action={boundSettle}>
              <ConfirmSubmitButton confirmMessage="Mark this liability as settled?">
                Mark Settled
              </ConfirmSubmitButton>
            </form>
          ) : (
            <form action={boundReactivate}>
              <ConfirmSubmitButton confirmMessage="Reactivate this liability?">
                Reactivate
              </ConfirmSubmitButton>
            </form>
          )}
        </div>
      </div>

      <Card>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-neutral-500">Outstanding Amount</dt>
            <dd className="mt-0.5 font-medium">
              {formatMoney(liability.outstanding_amount, liability.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Original Amount</dt>
            <dd className="mt-0.5 font-medium">
              {liability.original_amount != null
                ? formatMoney(liability.original_amount, liability.currency)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Interest Rate</dt>
            <dd className="mt-0.5 font-medium">
              {liability.interest_rate != null ? `${liability.interest_rate}%` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Due Date</dt>
            <dd className="mt-0.5 font-medium">{liability.due_date ?? "—"}</dd>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <dt className="text-neutral-500">Notes</dt>
            <dd className="mt-0.5 whitespace-pre-wrap">{liability.notes || "—"}</dd>
          </div>
        </dl>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Value History</h2>
          <LogValueChangeForm action={boundLogValueChange} currency={liability.currency} />
        </div>
        {!snapshotsResult.ok ? (
          <ErrorNotice message={`Could not load value history: ${snapshotsResult.message}`} />
        ) : (
          <ValueHistoryList snapshots={snapshotsResult.data} />
        )}
      </section>
    </div>
  );
}
