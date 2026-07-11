import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAsset,
  getNomineesForAsset,
  getSnapshotsForRecord,
} from "@/lib/data/assets";
import { Badge, Card, ErrorNotice, formatMoney, statusTone } from "@/app/components/ui";
import { retireAsset, reactivateAsset } from "@/lib/actions/assets";
import { logValueChange } from "@/lib/actions/snapshots";
import { createNominee } from "@/lib/actions/nominees";
import { ConfirmSubmitButton } from "@/app/components/ConfirmSubmitButton";
import { LogValueChangeForm } from "@/app/components/LogValueChangeForm";
import { ValueHistoryList } from "@/app/components/ValueHistoryList";
import { AddNomineeForm } from "@/app/components/AddNomineeForm";
import { NomineesList } from "@/app/components/NomineesList";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, snapshotsResult, nomineesResult] = await Promise.all([
    getAsset(id),
    getSnapshotsForRecord(id, "asset"),
    getNomineesForAsset(id),
  ]);

  if (!result.ok) {
    return <ErrorNotice message={`Could not load asset: ${result.message}`} />;
  }
  if (!result.data) notFound();

  const asset = result.data;
  const boundRetire = retireAsset.bind(null, asset.id);
  const boundReactivate = reactivateAsset.bind(null, asset.id);
  const boundLogValueChange = logValueChange.bind(null, "asset", asset.id);
  const boundCreateNominee = createNominee.bind(null, asset.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{asset.name}</h1>
            <Badge tone={statusTone(asset.status)}>{asset.status}</Badge>
          </div>
          <p className="text-sm text-neutral-500 capitalize">
            {asset.asset_class} · {asset.country}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/assets/${asset.id}/edit`}
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Edit
          </Link>
          {asset.status === "active" ? (
            <form action={boundRetire}>
              <ConfirmSubmitButton confirmMessage="Retire this asset? It will be marked retired but kept in history.">
                Retire
              </ConfirmSubmitButton>
            </form>
          ) : (
            <form action={boundReactivate}>
              <ConfirmSubmitButton confirmMessage="Reactivate this asset?">
                Reactivate
              </ConfirmSubmitButton>
            </form>
          )}
        </div>
      </div>

      <Card>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-neutral-500">Current Value</dt>
            <dd className="mt-0.5 font-medium">
              {formatMoney(asset.current_value, asset.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Currency</dt>
            <dd className="mt-0.5 font-medium">{asset.currency}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Acquisition Date</dt>
            <dd className="mt-0.5 font-medium">
              {asset.acquisition_date ?? "—"}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <dt className="text-neutral-500">Notes</dt>
            <dd className="mt-0.5 whitespace-pre-wrap">{asset.notes || "—"}</dd>
          </div>
        </dl>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Value History</h2>
          <LogValueChangeForm action={boundLogValueChange} currency={asset.currency} />
        </div>
        {!snapshotsResult.ok ? (
          <ErrorNotice message={`Could not load value history: ${snapshotsResult.message}`} />
        ) : (
          <ValueHistoryList snapshots={snapshotsResult.data} />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Nominees</h2>
          <AddNomineeForm action={boundCreateNominee} />
        </div>
        {!nomineesResult.ok ? (
          <ErrorNotice message={`Could not load nominees: ${nomineesResult.message}`} />
        ) : (
          <NomineesList assetId={asset.id} nominees={nomineesResult.data} />
        )}
      </section>
    </div>
  );
}
