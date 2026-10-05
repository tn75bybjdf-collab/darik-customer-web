// DARIK_BANNER_PRODUCT_LINKS_287
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BANNER_LIMIT_287 = 3;
const PRODUCT_LINK_PREFIX_287 = "banner-product:";

function json287(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function productIdFromPrompt287(value: unknown) {
  const text = String(value || "").trim();
  if (!text.startsWith(PRODUCT_LINK_PREFIX_287)) return null;
  const id = text.slice(PRODUCT_LINK_PREFIX_287.length).trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    ? id
    : null;
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

export async function GET(request: NextRequest) {
  const slug = String(request.nextUrl.searchParams.get("slug") || "")
    .trim()
    .slice(0, 180);

  if (!slug) {
    return json287({ ok: false, error: "Storefront slug is required." }, 400);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    return json287(
      { ok: false, error: "Storefront banner service is unavailable." },
      503
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data: storefront, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("id,slug,logo_url")
    .eq("slug", slug)
    .maybeSingle();

  if (storefrontError || !storefront?.id) {
    return json287({
      ok: true,
      hero_size: "compact",
      logo_url: null,
      active_banner: null,
      active_banners: [],
      banner_limit: BANNER_LIMIT_287,
    });
  }

  // One physical DB row may be status=active and up to two are status=draft.
  // For manual banners, BOTH statuses are storefront-live rotation slots.
  // Old AI drafts are excluded by the manual banner marker.
  const { data: rows, error: bannerError } = await admin
    .from("retailer_storefront_banners")
    .select(
      "id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at,updated_at,ai_prompt"
    )
    .eq("storefront_id", storefront.id)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .order("created_at", { ascending: true })
    .limit(BANNER_LIMIT_287);

  if (bannerError) {
    console.warn("Darik public banners 287 lookup failed:", bannerError.message);
    return json287({
      ok: true,
      hero_size: "compact",
      logo_url: storefront.logo_url || null,
      active_banner: null,
      active_banners: [],
      banner_limit: BANNER_LIMIT_287,
    });
  }

  const activeBanners = (rows || [])
    .filter((row) => row?.id && row?.final_banner_image_url)
    .map(mapBanner287)
    .slice(0, BANNER_LIMIT_287);

  return json287({
    ok: true,
    hero_size: "compact",
    logo_url: storefront.logo_url || null,
    active_banner: activeBanners[0] || null,
    active_banners: activeBanners,
    banner_limit: BANNER_LIMIT_287,
  });
}
