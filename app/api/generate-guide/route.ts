import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/actions/audit";

const MODEL = "gpt-4o";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const assetId = body?.asset_id as string | undefined;

  if (!assetId) {
    return NextResponse.json({ error: "asset_id is required" }, { status: 400 });
  }

  const supabase = await createClient();

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI generation is not configured on this server." },
      { status: 503 },
    );
  }

  let guideText: string;
  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You write short, plain-language, numbered step-by-step instructions that help a family member access and claim a specific financial asset after the owner has died. Be concrete about the kind of institution, documents (death certificate, probate/letters of administration, etc.), and contacts based on the asset's country and class. Mention the registered nominees and their share by name. Keep it under 200 words. Do not invent specific account numbers or company names that weren't given to you.",
          },
          {
            role: "user",
            content: JSON.stringify(payload, null, 2),
          },
        ],
      }),
    });

    if (!completion.ok) {
      const errText = await completion.text();
      console.error("[generate-guide] OpenAI error", completion.status, errText);
      return NextResponse.json(
        { error: "Guide generation failed — try again." },
        { status: 502 },
      );
    }

    const json = await completion.json();
    guideText = json.choices?.[0]?.message?.content?.trim();
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
      guide_text: guideText,
      guide_text_source: `openai-${MODEL}`,
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
    payload: { asset_id: assetId, version: nextVersion, source: `openai-${MODEL}` },
  });

  revalidatePath(`/assets/${assetId}`);

  return NextResponse.json({ ok: true, guide_id: guide.id });
}
