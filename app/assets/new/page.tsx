import { AssetForm } from "@/app/components/AssetForm";
import { createAsset } from "@/lib/actions/assets";

export default function NewAssetPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add Asset</h1>
        <p className="text-sm text-neutral-500">
          Any asset class, any country. It'll show up on your dashboard immediately.
        </p>
      </div>
      <AssetForm action={createAsset} submitLabel="Add Asset" />
    </div>
  );
}
