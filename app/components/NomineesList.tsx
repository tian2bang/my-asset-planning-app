import type { Nominee } from "@/lib/types";
import { Badge, EmptyState } from "@/app/components/ui";
import { deleteNominee } from "@/lib/actions/nominees";
import { ConfirmSubmitButton } from "@/app/components/ConfirmSubmitButton";

export function NomineesList({
  assetId,
  nominees,
}: {
  assetId: string;
  nominees: Nominee[];
}) {
  if (nominees.length === 0) {
    return <EmptyState title="No nominees added yet." />;
  }

  const total = nominees.reduce((sum, n) => sum + Number(n.share_percent ?? 0), 0);

  return (
    <div className="space-y-2">
      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
        {nominees.map((n) => {
          const boundDelete = deleteNominee.bind(null, assetId, n.id);
          return (
            <li key={n.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">
                  {n.full_name}{" "}
                  <span className="font-normal capitalize text-neutral-500">
                    ({n.relationship})
                  </span>
                </p>
                <p className="text-xs text-neutral-500">
                  {[n.email, n.phone].filter(Boolean).join(" · ") || "No contact info"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="blue">{n.share_percent}%</Badge>
                <form action={boundDelete}>
                  <ConfirmSubmitButton confirmMessage={`Remove ${n.full_name} as a nominee?`}>
                    Remove
                  </ConfirmSubmitButton>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-neutral-500">
        Total allocated: <span className="font-medium">{total}%</span>
        {total < 100 && ` · ${100 - total}% unassigned`}
      </p>
    </div>
  );
}
