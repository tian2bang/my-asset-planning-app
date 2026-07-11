import Link from "next/link";
import { notFound } from "next/navigation";
import { getLiability } from "@/lib/data/liabilities";
import { Badge, Card, ErrorNotice, formatMoney, statusTone } from "@/app/components/ui";
import { settleLiability, reactivateLiability } from "@/lib/actions/liabilities";
import { ConfirmSubmitButton } from "@/app/components/ConfirmSubmitButton";

export default async function LiabilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLiability(id);

  if (!result.ok) {
    return <ErrorNotice message={`Could not load liability: ${result.message}`} />;
  }
  if (!result.data) notFound();

  const liability = result.data;
  const boundSettle = settleLiability.bind(null, liability.id);
  const boundReactivate = reactivateLiability.bind(null, liability.id);

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
    </div>
  );
}
