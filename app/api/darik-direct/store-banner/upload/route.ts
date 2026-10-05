// DARIK_BANNER_PRODUCT_LINKS_UPLOAD_287
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_BUCKET_287 = "darik-direct-products";
const BANNER_LIMIT_287 = 3;
const PRODUCT_LINK_PREFIX_287 = "banner-product:";

type UploadBody287 = {
  retailer_id?: unknown;
  image_url?: unknown;
  image_width?: unknown;
  image_height?: unknown;
};

function json287(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function text287(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid287(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function productIdFromPrompt287(value: unknown) {
  const prompt = String(value || "").trim();
  if (!prompt.startsWith(PRODUCT_LINK_PREFIX_287)) return null;
  const id = prompt.slice(PRODUCT_LINK_PREFIX_287.length).trim();
  return validUuid287(id) ? id : null;
}

function bearerToken287(request: NextRequest) {
  return (request.headers.get("authorization") || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function mapBanner287(row: any) {
  return {
    id: String(row.id || ""),
    text: String(row.banner_text || "Uploaded storefront banner"),
    image_url: String(row.final_banner_image_url || ""),
    hero_size_generated_for: "compact" as const,
    status: String(row.status || ""),
    created_at: row.created_at || null,
    product_id: productIdFromPrompt287(row.ai_prompt),
  };
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    return json287(
      { ok: false, error: "Darik banner upload is temporarily unavailable." },
      503
    );
  }

  let body: UploadBody287;
  try {
    body = (await request.json()) as UploadBody287;
  } catch {
    return json287({ ok: false, error: "Invalid banner upload." }, 400);
  }

  const retailerId = text287(body.retailer_id, 80);
  const imageUrl = text287(body.image_url, 1600);
  const imageWidth = Number(body.image_width);
  const imageHeight = Number(body.image_height);

  if (!validUuid287(retailerId)) {
    return json287({ ok: false, error: "Invalid Darik retailer." }, 400);
  }

  if (
    !imageUrl ||
    !Number.isFinite(imageWidth) ||
    !Number.isFinite(imageHeight)
  ) {
    return json287(
      { ok: false, error: "Banner image information is incomplete." },
      400
    );
  }

  if (imageWidth !== 1600 || imageHeight !== 450) {
    return json287(
      {
        ok: false,
        error:
          "Darik must receive the final auto-fitted banner at exactly 1600 × 450 px.",
      },
      400
    );
  }

  const token = bearerToken287(request);
  if (!token) {
    return json287({ ok: false, error: "Retailer login required." }, 401);
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
    return json287(
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
    return json287(
      { ok: false, error: "Could not verify this Darik store." },
      retailerError ? 500 : 404
    );
  }

  if (retailer.account_restricted === true) {
    return json287(
      { ok: false, error: "This Darik account is currently restricted." },
      403
    );
  }

  if (
    text287(retailer.email, 320).toLowerCase() !==
    text287(userData.user.email, 320).toLowerCase()
  ) {
    return json287(
      {
        ok: false,
        error: "Only the Darik store owner can upload storefront banners.",
      },
      403
    );
  }

  const { data: storefront, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("id,retailer_id,slug")
    .eq("retailer_id", retailerId)
    .maybeSingle();

  if (storefrontError || !storefront?.id) {
    return json287(
      {
        ok: false,
        error: "This retailer does not have a Darik storefront yet.",
      },
      storefrontError ? 500 : 404
    );
  }

  const publicBase =
    `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/` +
    `${PRODUCT_BUCKET_287}/${retailerId}/storefront-banners/`;

  if (!imageUrl.startsWith(publicBase)) {
    return json287(
      {
        ok: false,
        error: "This banner image was not uploaded by your Darik store.",
      },
      400
    );
  }

  const { data: current, error: currentError } = await admin
    .from("retailer_storefront_banners")
    .select("id,status,created_at")
    .eq("storefront_id", storefront.id)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .order("created_at", { ascending: true })
    .limit(BANNER_LIMIT_287);

  if (currentError) {
    return json287(
      { ok: false, error: "Could not read the current storefront banners." },
      500
    );
  }

  const currentLive = current || [];
  if (currentLive.length >= BANNER_LIMIT_287) {
    return json287(
      {
        ok: false,
        error:
          "This store already has 3 banners. Remove one before adding another.",
      },
      409
    );
  }

  const now = new Date().toISOString();
  const status = currentLive.some((row) => row.status === "active")
    ? "draft"
    : "active";

  const { data: created, error: createError } = await admin
    .from("retailer_storefront_banners")
    .insert({
      storefront_id: storefront.id,
      retailer_id: retailerId,
      banner_text: "Uploaded storefront banner",
      ai_prompt: null,
      hero_size_generated_for: "compact",
      background_image_url: imageUrl,
      final_banner_image_url: imageUrl,
      status,
      credits_charged: 0,
      created_at: now,
      updated_at: now,
    })
    .select(
      "id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at,ai_prompt"
    )
    .single();

  if (createError || !created?.id) {
    console.error("Darik banner 287 insert:", createError?.message);
    return json287(
      { ok: false, error: "Could not save this storefront banner." },
      500
    );
  }

  const { data: refreshed, error: refreshedError } = await admin
    .from("retailer_storefront_banners")
    .select(
      "id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at,ai_prompt"
    )
    .eq("storefront_id", storefront.id)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .order("created_at", { ascending: true })
    .limit(BANNER_LIMIT_287);

  const activeBanners = refreshedError
    ? [mapBanner287(created)]
    : (refreshed || []).map(mapBanner287);

  return json287({
    ok: true,
    active_banner: activeBanners[0] || null,
    active_banners: activeBanners,
    banner_limit: BANNER_LIMIT_287,
    hero_size: "compact",
    slug: storefront.slug,
  });
}
