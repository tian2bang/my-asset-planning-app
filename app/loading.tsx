import { ListSkeleton } from "@/app/components/ui";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 animate-pulse rounded bg-neutral-100" />
      <ListSkeleton rows={4} />
    </div>
  );
}
