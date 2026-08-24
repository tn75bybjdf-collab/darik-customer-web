// DARIK_MANUAL_STOREFRONT_BANNER_UPLOAD_282
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_BUCKET_282 = "darik-direct-products";

type UploadBody282 = {
  retailer_id?: unknown;
  image_url?: unknown;
  image_width?: unknown;
  image_height?: unknown;
};

function json282(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function text282(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid282(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function bearerToken282(request: NextRequest) {
  return (request.headers.get("authorization") || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    return json282(
      { ok: false, error: "Darik banner upload is temporarily unavailable." },
      503
    );
  }

  let body: UploadBody282;
  try {
    body = (await request.json()) as UploadBody282;
  } catch {
    return json282({ ok: false, error: "Invalid banner upload." }, 400);
  }

  const retailerId = text282(body.retailer_id, 80);
  const imageUrl = text282(body.image_url, 1600);
  const imageWidth = Number(body.image_width);
  const imageHeight = Number(body.image_height);

  if (!validUuid282(retailerId)) {
    return json282({ ok: false, error: "Invalid Darik retailer." }, 400);
  }
  if (!imageUrl || !Number.isFinite(imageWidth) || !Number.isFinite(imageHeight)) {
    return json282({ ok: false, error: "Banner image information is incomplete." }, 400);
  }

  const token = bearerToken282(request);
  if (!token) {
    return json282({ ok: false, error: "Retailer login required." }, 401);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user?.id) {
    return json282(
      { ok: false, error: "Retailer session is invalid or expired." },
      401
    );
  }

  const { data: retailer, error: retailerError } = await admin
    .from("retailers")
    .select("id,email,account_restricted")
    .eq("id", retailerId)
    .maybeSingle();

  if (retailerError || !retailer?.id) {
    return json282(
      { ok: false, error: "Could not verify this Darik store." },
      retailerError ? 500 : 404
    );
  }

  if (retailer.account_restricted === true) {
    return json282(
      { ok: false, error: "This Darik account is currently restricted." },
      403
    );
  }

  if (
    text282(retailer.email, 320).toLowerCase() !==
    text282(userData.user.email, 320).toLowerCase()
  ) {
    return json282(
      { ok: false, error: "Only the Darik store owner can upload storefront banners." },
      403
    );
  }

  const { data: storefront, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("id,retailer_id,slug,direct_hero_size")
    .eq("retailer_id", retailerId)
    .maybeSingle();

  if (storefrontError) {
    console.error("Darik manual banner 282 storefront lookup:", storefrontError.message);
    return json282(
      { ok: false, error: "Darik could not load this storefront right now." },
      500
    );
  }

  if (!storefront?.id) {
    return json282(
      { ok: false, error: "This retailer does not have a Darik storefront yet." },
      404
    );
  }

  const heroSize = storefront.direct_hero_size === "compact" ? "compact" : "default";
  const expected =
    heroSize === "compact"
      ? { width: 1600, height: 900 }
      : { width: 1200, height: 1200 };

  if (imageWidth !== expected.width || imageHeight !== expected.height) {
    return json282(
      {
        ok: false,
        error: `This ${heroSize} Hero requires a ${expected.width} × ${expected.height} px banner.`,
      },
      400
    );
  }

  const publicBase =
    `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/` +
    `${PRODUCT_BUCKET_282}/${retailerId}/storefront-banners/`;

  if (!imageUrl.startsWith(publicBase)) {
    return json282(
      { ok: false, error: "This banner image was not uploaded by your Darik store." },
      400
    );
  }

  const now = new Date().toISOString();

  const { data: previousActive, error: previousError } = await admin
    .from("retailer_storefront_banners")
    .select("id")
    .eq("storefront_id", storefront.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (previousError) {
    return json282({ ok: false, error: "Could not read the current storefront banner." }, 500);
  }

  const { data: created, error: createError } = await admin
    .from("retailer_storefront_banners")
    .insert({
      storefront_id: storefront.id,
      retailer_id: retailerId,
      banner_text: "Uploaded storefront banner",
      ai_prompt: null,
      hero_size_generated_for: heroSize,
      background_image_url: imageUrl,
      final_banner_image_url: imageUrl,
      status: "draft",
      credits_charged: 0,
      created_at: now,
      updated_at: now,
    })
    .select("id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at")
    .single();

  if (createError || !created?.id) {
    console.error("Darik manual banner 282 insert:", createError?.message);
    return json282({ ok: false, error: "Could not save this storefront banner." }, 500);
  }

  if (previousActive?.id) {
    const archive = await admin
      .from("retailer_storefront_banners")
      .update({ status: "archived", updated_at: now })
      .eq("id", previousActive.id);

    if (archive.error) {
      await admin.from("retailer_storefront_banners").delete().eq("id", created.id);
      return json282({ ok: false, error: "Could not replace the current storefront banner." }, 500);
    }
  }

  const { data: activated, error: activateError } = await admin
    .from("retailer_storefront_banners")
    .update({ status: "active", updated_at: now })
    .eq("id", created.id)
    .select("id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at")
    .single();

  if (activateError || !activated?.id) {
    if (previousActive?.id) {
      await admin
        .from("retailer_storefront_banners")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", previousActive.id);
    }
    await admin.from("retailer_storefront_banners").delete().eq("id", created.id);
    return json282({ ok: false, error: "Could not activate this storefront banner." }, 500);
  }

  return json282({
    ok: true,
    active_banner: {
      id: activated.id,
      text: activated.banner_text,
      image_url: activated.final_banner_image_url,
      hero_size_generated_for: activated.hero_size_generated_for,
      status: activated.status,
      created_at: activated.created_at,
    },
    hero_size: heroSize,
    slug: storefront.slug,
    required_size: expected,
  });
}
