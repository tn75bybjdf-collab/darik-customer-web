// DARIK_THREE_REVOLVING_BANNERS_286
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json286(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function mapBanner286(row: any) {
  return {
    id: String(row.id || ""),
    text: String(row.banner_text || "Uploaded storefront banner"),
    image_url: String(row.final_banner_image_url || ""),
    hero_size_generated_for: "compact" as const,
    status: String(row.status || ""),
    created_at: row.created_at || null,
  };
}

export async function GET(request: NextRequest) {
  const slug = String(request.nextUrl.searchParams.get("slug") || "")
    .trim()
    .slice(0, 180);

  if (!slug) {
    return json286({ ok: false, error: "Storefront slug is required." }, 400);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    return json286(
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
    .select("id,slug,direct_hero_size,logo_url")
    .eq("slug", slug)
    .maybeSingle();

  if (storefrontError || !storefront?.id) {
    return json286({
      ok: true,
      hero_size: "compact",
      logo_url: null,
      active_banner: null,
      active_banners: [],
    });
  }

  // Internal implementation note:
  // The original 274 table has a unique partial index allowing only one row
  // whose status is "active". Manual uploads use one active row + up to two
  // draft rows. For the manual-banner feature, BOTH statuses are live slots.
  // We filter by the manual-upload banner marker so old AI drafts never appear.
  const { data: rows, error: bannerError } = await admin
    .from("retailer_storefront_banners")
    .select(
      "id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at,updated_at"
    )
    .eq("storefront_id", storefront.id)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .order("created_at", { ascending: true })
    .limit(3);

  if (bannerError) {
    console.warn("Darik public banners 286 lookup failed:", bannerError.message);
    return json286({
      ok: true,
      hero_size: "compact",
      logo_url: storefront.logo_url || null,
      active_banner: null,
      active_banners: [],
    });
  }

  const activeBanners = (rows || [])
    .filter((row) => row?.id && row?.final_banner_image_url)
    .map(mapBanner286)
    .slice(0, 3);

  return json286({
    ok: true,
    hero_size: "compact",
    logo_url: storefront.logo_url || null,
    // Backward compatibility for any old client still expecting one banner.
    active_banner: activeBanners[0] || null,
    active_banners: activeBanners,
    banner_limit: 3,
  });
}
