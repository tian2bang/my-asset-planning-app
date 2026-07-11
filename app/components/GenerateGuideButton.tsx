"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ErrorNotice } from "@/app/components/ui";

export function GenerateGuideButton({
  assetId,
  label = "Generate Guide",
}: {
  assetId: string;
  label?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/generate-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asset_id: assetId }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Guide generation failed — try again.");
          return;
        }
        router.refresh();
      } catch {
        setError("Guide generation failed — try again.");
      }
    });
  };

  return (
    <div className="space-y-2">
      {error && <ErrorNotice message={error} />}
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Generating…" : label}
      </button>
    </div>
  );
}
