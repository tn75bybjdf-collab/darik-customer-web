// DARIK_STOREFRONT_BANNER_ACTIVATION_274
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ActionBody = {
  retailer_id?: unknown;
  banner_id?: unknown;
  action?: unknown;
};

function json(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function text(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function bearerToken(request: NextRequest) {
  return (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) return json({ ok: false, error: "Darik banner controls are temporarily unavailable." }, 503);

  let body: ActionBody;
  try {
    body = (await request.json()) as ActionBody;
  } catch {
    return json({ ok: false, error: "Invalid banner action." }, 400);
  }

  const retailerId = text(body.retailer_id, 80);
  const bannerId = text(body.banner_id, 80);
  const action = text(body.action, 30).toLowerCase();
  if (!validUuid(retailerId)) return json({ ok: false, error: "Invalid Darik retailer." }, 400);
  if (action !== "activate" && action !== "disable") return json({ ok: false, error: "Invalid banner action." }, 400);
  if (action === "activate" && !validUuid(bannerId)) return json({ ok: false, error: "Invalid Darik banner." }, 400);

  const token = bearerToken(request);
  if (!token) return json({ ok: false, error: "Retailer login required." }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user?.id) return json({ ok: false, error: "Retailer session is invalid or expired." }, 401);

  const { data: retailer, error: retailerError } = await admin
    .from("retailers")
    .select("id,email,account_restricted")
    .eq("id", retailerId)
    .maybeSingle();

  if (retailerError || !retailer?.id) return json({ ok: false, error: "Could not verify this Darik store." }, retailerError ? 500 : 404);
  if (retailer.account_restricted === true) return json({ ok: false, error: "This Darik account is currently restricted." }, 403);
  if (text(retailer.email, 320).toLowerCase() !== text(userData.user.email, 320).toLowerCase()) {
    return json({ ok: false, error: "Only the Darik store owner can change storefront banners." }, 403);
  }

  const { data: storefront, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("id,direct_hero_size,slug")
    .eq("retailer_id", retailerId)
    .maybeSingle();

  if (storefrontError || !storefront?.id) return json({ ok: false, error: "This retailer does not have a Darik storefront yet." }, storefrontError ? 500 : 404);

  if (action === "disable") {
    const archive = await admin
      .from("retailer_storefront_banners")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("storefront_id", storefront.id)
      .eq("status", "active");
    if (archive.error) return json({ ok: false, error: "Could not update the current storefront banner." }, 500);
    return json({ ok: true, active_banner: null, hero_size: storefront.direct_hero_size === "compact" ? "compact" : "default" });
  }

  const { data: candidate, error: candidateError } = await admin
    .from("retailer_storefront_banners")
    .select("id,storefront_id,retailer_id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at")
    .eq("id", bannerId)
    .eq("storefront_id", storefront.id)
    .eq("retailer_id", retailerId)
    .maybeSingle();

  if (candidateError || !candidate?.id) return json({ ok: false, error: "This banner does not belong to your Darik store." }, candidateError ? 500 : 404);

  const archive = await admin
    .from("retailer_storefront_banners")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("storefront_id", storefront.id)
    .eq("status", "active");
  if (archive.error) return json({ ok: false, error: "Could not update the current storefront banner." }, 500);

  const { data: activated, error: activateError } = await admin
    .from("retailer_storefront_banners")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", bannerId)
    .select("id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at")
    .single();

  if (activateError || !activated?.id) return json({ ok: false, error: "Could not activate this banner." }, 500);

  return json({
    ok: true,
    active_banner: {
      id: activated.id,
      text: activated.banner_text,
      image_url: activated.final_banner_image_url,
      hero_size_generated_for: activated.hero_size_generated_for,
      status: activated.status,
      created_at: activated.created_at,
    },
    hero_size: storefront.direct_hero_size === "compact" ? "compact" : "default",
    slug: storefront.slug,
  });
}
