import { LiabilityForm } from "@/app/components/LiabilityForm";
import { createLiability } from "@/lib/actions/liabilities";

export default function NewLiabilityPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add Liability</h1>
        <p className="text-sm text-neutral-500">
          Mortgages, loans, or credit — track what you owe alongside what you own.
        </p>
      </div>
      <LiabilityForm action={createLiability} submitLabel="Add Liability" />
    </div>
  );
}
