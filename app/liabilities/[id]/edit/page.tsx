import { notFound } from "next/navigation";
import { getLiability } from "@/lib/data/liabilities";
import { ErrorNotice } from "@/app/components/ui";
import { LiabilityForm } from "@/app/components/LiabilityForm";
import { updateLiability } from "@/lib/actions/liabilities";

export default async function EditLiabilityPage({
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

  const boundUpdate = updateLiability.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Liability</h1>
        <p className="text-sm text-neutral-500">{result.data.name}</p>
      </div>
      <LiabilityForm action={boundUpdate} initial={result.data} submitLabel="Save Changes" />
    </div>
  );
}
