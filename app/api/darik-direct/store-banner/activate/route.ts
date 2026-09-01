// DARIK_BANNER_PRODUCT_LINK_CONTROLS_287
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BANNER_LIMIT_287 = 3;
const PRODUCT_LINK_PREFIX_287 = "banner-product:";

type ActionBody287 = {
  retailer_id?: unknown;
  banner_id?: unknown;
  product_id?: unknown;
  action?: unknown;
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

function bearerToken287(request: NextRequest) {
  return (request.headers.get("authorization") || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function productIdFromPrompt287(value: unknown) {
  const prompt = String(value || "").trim();
  if (!prompt.startsWith(PRODUCT_LINK_PREFIX_287)) return null;
  const id = prompt.slice(PRODUCT_LINK_PREFIX_287.length).trim();
  return validUuid287(id) ? id : null;
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

async function refreshedBanners287(admin: any, storefrontId: string) {
  const { data, error } = await admin
    .from("retailer_storefront_banners")
    .select(
      "id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at,ai_prompt"
    )
    .eq("storefront_id", storefrontId)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .order("created_at", { ascending: true })
    .limit(BANNER_LIMIT_287);

  if (error) throw error;
  return (data || []).map(mapBanner287);
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    return json287(
      { ok: false, error: "Darik banner controls are temporarily unavailable." },
      503
    );
  }

  let body: ActionBody287;
  try {
    body = (await request.json()) as ActionBody287;
  } catch {
    return json287({ ok: false, error: "Invalid banner action." }, 400);
  }

  const retailerId = text287(body.retailer_id, 80);
  const bannerId = text287(body.banner_id, 80);
  const productId = text287(body.product_id, 80);
  const action = text287(body.action, 40).toLowerCase();

  if (!validUuid287(retailerId)) {
    return json287({ ok: false, error: "Invalid Darik retailer." }, 400);
  }

  if (
    !["remove", "disable", "disable_all", "link_product", "unlink_product"].includes(
      action
    )
  ) {
    return json287({ ok: false, error: "Invalid banner action." }, 400);
  }

  if (
    ["remove", "link_product", "unlink_product"].includes(action) &&
    !validUuid287(bannerId)
  ) {
    return json287({ ok: false, error: "Invalid Darik banner." }, 400);
  }

  if (action === "link_product" && !validUuid287(productId)) {
    return json287({ ok: false, error: "Choose a valid product." }, 400);
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
        error: "Only the Darik store owner can change storefront banners.",
      },
      403
    );
  }

  const { data: storefront, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("id,slug")
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

  if (action === "disable" || action === "disable_all") {
    const archiveAll = await admin
      .from("retailer_storefront_banners")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("storefront_id", storefront.id)
      .eq("banner_text", "Uploaded storefront banner")
      .in("status", ["active", "draft"]);

    if (archiveAll.error) {
      return json287(
        { ok: false, error: "Could not turn off the storefront banners." },
        500
      );
    }

    return json287({
      ok: true,
      active_banner: null,
      active_banners: [],
      banner_limit: BANNER_LIMIT_287,
      hero_size: "compact",
    });
  }

  const { data: candidate, error: candidateError } = await admin
    .from("retailer_storefront_banners")
    .select("id,status,storefront_id,retailer_id,ai_prompt")
    .eq("id", bannerId)
    .eq("storefront_id", storefront.id)
    .eq("retailer_id", retailerId)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .maybeSingle();

  if (candidateError || !candidate?.id) {
    return json287(
      { ok: false, error: "This banner does not belong to your Darik store." },
      candidateError ? 500 : 404
    );
  }

  if (action === "link_product") {
    // Verify the chosen item is actually visible on THIS storefront.
    const { data: product, error: productError } = await admin
      .from("public_storefront_products")
      .select("id,storefront_slug")
      .eq("storefront_slug", storefront.slug)
      .eq("id", productId)
      .maybeSingle();

    if (productError || !product?.id) {
      return json287(
        { ok: false, error: "That product is not available on this storefront." },
        productError ? 500 : 404
      );
    }

    const linked = await admin
      .from("retailer_storefront_banners")
      .update({
        ai_prompt: `${PRODUCT_LINK_PREFIX_287}${productId}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bannerId);

    if (linked.error) {
      return json287(
        { ok: false, error: "Could not link this banner to the product." },
        500
      );
    }

    const activeBanners = await refreshedBanners287(admin, storefront.id);
    return json287({
      ok: true,
      active_banner: activeBanners[0] || null,
      active_banners: activeBanners,
      banner_limit: BANNER_LIMIT_287,
      hero_size: "compact",
    });
  }

  if (action === "unlink_product") {
    const unlinked = await admin
      .from("retailer_storefront_banners")
      .update({
        ai_prompt: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bannerId);

    if (unlinked.error) {
      return json287(
        { ok: false, error: "Could not remove the product link." },
        500
      );
    }

    const activeBanners = await refreshedBanners287(admin, storefront.id);
    return json287({
      ok: true,
      active_banner: activeBanners[0] || null,
      active_banners: activeBanners,
      banner_limit: BANNER_LIMIT_287,
      hero_size: "compact",
    });
  }

  // remove
  const wasActive = candidate.status === "active";

  const archived = await admin
    .from("retailer_storefront_banners")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", candidate.id);

  if (archived.error) {
    return json287({ ok: false, error: "Could not remove this banner." }, 500);
  }

  if (wasActive) {
    const { data: nextDraft } = await admin
      .from("retailer_storefront_banners")
      .select("id")
      .eq("storefront_id", storefront.id)
      .eq("banner_text", "Uploaded storefront banner")
      .eq("status", "draft")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextDraft?.id) {
      await admin
        .from("retailer_storefront_banners")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", nextDraft.id);
    }
  }

  const activeBanners = await refreshedBanners287(admin, storefront.id);

  return json287({
    ok: true,
    active_banner: activeBanners[0] || null,
    active_banners: activeBanners,
    banner_limit: BANNER_LIMIT_287,
    hero_size: "compact",
    slug: storefront.slug,
  });
}
