"use client";

import { useActionState, useState } from "react";
import type { BeneficiaryGuide } from "@/lib/types";
import type { ActionState } from "@/lib/actions/assets";
import { Badge, Card } from "@/app/components/ui";
import { SubmitButton } from "@/app/components/SubmitButton";
import { ConfirmSubmitButton } from "@/app/components/ConfirmSubmitButton";
import { ErrorNotice } from "@/app/components/ui";
import { GenerateGuideButton } from "@/app/components/GenerateGuideButton";

function reviewTone(status: string) {
  if (status === "approved") return "green" as const;
  if (status === "overridden") return "amber" as const;
  return "neutral" as const;
}

export function GuideCard({
  assetId,
  guide,
  markReviewedAction,
  overrideAction,
}: {
  assetId: string;
  guide: BeneficiaryGuide;
  markReviewedAction: () => Promise<void>;
  overrideAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(overrideAction, {});

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={reviewTone(guide.guide_text_review_status)}>
          {guide.guide_text_review_status}
        </Badge>
        {guide.guide_text_confidence != null && (
          <Badge tone="blue">
            confidence {Math.round(guide.guide_text_confidence * 100)}%
          </Badge>
        )}
        <span className="text-xs text-neutral-400">
          {guide.guide_text_source} · v{guide.version}
        </span>
      </div>

      {editing ? (
        <form action={formAction} className="space-y-3">
          {state.error && <ErrorNotice message={state.error} />}
          <textarea
            name="guide_text"
            defaultValue={guide.guide_text}
            rows={8}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <SubmitButton pendingText="Saving…">Save Changes</SubmitButton>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
            {guide.guide_text}
          </p>
          <div className="flex flex-wrap gap-2">
            {guide.guide_text_review_status === "unreviewed" && (
              <form action={markReviewedAction}>
                <ConfirmSubmitButton confirmMessage="Mark this guide as reviewed and approved?">
                  Mark Reviewed
                </ConfirmSubmitButton>
              </form>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Edit Text
            </button>
            <GenerateGuideButton assetId={assetId} label="Regenerate" />
          </div>
        </>
      )}
    </Card>
  );
}
