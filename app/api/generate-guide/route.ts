import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/actions/audit";
import { requireUserId, AuthRequiredError } from "@/lib/actions/require-user";

const MODEL = "gemini-flash-latest";

const SYSTEM_INSTRUCTION =
  "You write short, plain-language, numbered step-by-step instructions that help a family member access and claim a specific financial asset after the owner has died. Be concrete about the kind of institution, documents (death certificate, probate/letters of administration, etc.), and contacts based on the asset's country and class. Mention the registered nominees and their share by name. Keep it under 200 words. Do not invent specific account numbers or company names that weren't given to you.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const assetId = body?.asset_id as string | undefined;

  if (!assetId) {
    return NextResponse.json({ error: "asset_id is required" }, { status: 400 });
  }

  const supabase = await createClient();

  let userId: string;
  try {
    userId = await requireUserId(supabase);
  } catch (err) {
    if (err instanceof AuthRequiredError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }

  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .select("*")
    .eq("id", assetId)
    .maybeSingle();

  if (assetError || !asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const { data: nominees, error: nomineesError } = await supabase
    .from("nominees")
    .select("full_name, relationship, share_percent")
    .eq("asset_id", assetId);

  if (nomineesError) {
    return NextResponse.json({ error: nomineesError.message }, { status: 500 });
  }

  const payload = {
    asset_name: asset.name,
    asset_class: asset.asset_class,
    country: asset.country,
    currency: asset.currency,
    current_value: asset.current_value,
    nominees: (nominees ?? []).map((n) => ({
      name: n.full_name,
      relationship: n.relationship,
      share_percent: n.share_percent,
    })),
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI generation is not configured on this server." },
      { status: 503 },
    );
  }

  let guideText: string;
  try {
    const completion = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: JSON.stringify(payload, null, 2) }] }],
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          generationConfig: { temperature: 0.4, thinkingConfig: { thinkingBudget: 0 } },
        }),
      },
    );

    if (!completion.ok) {
      const errText = await completion.text();
      console.error("[generate-guide] Gemini error", completion.status, errText);
      return NextResponse.json(
        { error: "Guide generation failed — try again." },
        { status: 502 },
      );
    }

    const json = await completion.json();
    guideText = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!guideText) {
      throw new Error("Empty response from model");
    }
  } catch (err) {
    console.error("[generate-guide] request failed", err);
    return NextResponse.json(
      { error: "Guide generation failed — try again." },
      { status: 502 },
    );
  }

  const { data: latest } = await supabase
    .from("beneficiary_guides")
    .select("version")
    .eq("asset_id", assetId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latest?.version ?? 0) + 1;
  const confidence = payload.nominees.length > 0 ? 0.85 : 0.6;

  const { data: guide, error: insertError } = await supabase
    .from("beneficiary_guides")
    .insert({
      asset_id: assetId,
      user_id: userId,
      guide_text: guideText,
      guide_text_source: `google-${MODEL}`,
      guide_text_confidence: confidence,
      guide_text_review_status: "unreviewed",
      version: nextVersion,
    })
    .select("id")
    .single();

  if (insertError || !guide) {
    return NextResponse.json(
      { error: `Could not save guide: ${insertError?.message}` },
      { status: 500 },
    );
  }

  await writeAuditLog(supabase, {
    action: "guide.generated",
    entity_type: "beneficiary_guide",
    entity_id: guide.id,
    payload: { asset_id: assetId, version: nextVersion, source: `google-${MODEL}` },
  });

  revalidatePath(`/assets/${assetId}`);

  return NextResponse.json({ ok: true, guide_id: guide.id });
}
