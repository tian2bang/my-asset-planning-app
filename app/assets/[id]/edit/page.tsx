import { notFound } from "next/navigation";
import { getAsset } from "@/lib/data/assets";
import { ErrorNotice } from "@/app/components/ui";
import { AssetForm } from "@/app/components/AssetForm";
import { updateAsset } from "@/lib/actions/assets";

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAsset(id);

  if (!result.ok) {
    return <ErrorNotice message={`Could not load asset: ${result.message}`} />;
  }
  if (!result.data) notFound();

  const boundUpdate = updateAsset.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Asset</h1>
        <p className="text-sm text-neutral-500">{result.data.name}</p>
      </div>
      <AssetForm action={boundUpdate} initial={result.data} submitLabel="Save Changes" />
    </div>
  );
}
