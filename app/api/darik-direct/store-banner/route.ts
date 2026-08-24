// DARIK_PUBLIC_STOREFRONT_BANNER_274
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET(request: NextRequest) {
  const slug = String(request.nextUrl.searchParams.get("slug") || "").trim().slice(0, 180);
  if (!slug) return json({ ok: false, error: "Storefront slug is required." }, 400);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) return json({ ok: false, error: "Storefront banner service is unavailable." }, 503);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: storefront, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("id,slug,direct_hero_size,logo_url")
    .eq("slug", slug)
    .maybeSingle();

  if (storefrontError || !storefront?.id) {
    return json({ ok: true, hero_size: "default", active_banner: null });
  }

  const { data: active, error: bannerError } = await admin
    .from("retailer_storefront_banners")
    .select("id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at,updated_at")
    .eq("storefront_id", storefront.id)
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (bannerError) {
    console.warn("Darik public banner 274 lookup failed:", bannerError.message);
    return json({ ok: true, hero_size: storefront.direct_hero_size === "compact" ? "compact" : "default", active_banner: null });
  }

  return json({
    ok: true,
    // DARIK_BANNER_PUBLIC_LOGO_280
    hero_size: storefront.direct_hero_size === "compact" ? "compact" : "default",
    logo_url: storefront.logo_url || null,
    active_banner: active?.id
      ? {
          id: active.id,
          text: active.banner_text,
          image_url: active.final_banner_image_url,
          hero_size_generated_for: active.hero_size_generated_for,
          status: active.status,
          created_at: active.created_at,
        }
      : null,
  });
}
