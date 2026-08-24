// DARIK_THREE_REVOLVING_BANNER_CONTROLS_286
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BANNER_LIMIT_286 = 3;

type ActionBody286 = {
  retailer_id?: unknown;
  banner_id?: unknown;
  action?: unknown;
};

function json286(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function text286(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid286(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function bearerToken286(request: NextRequest) {
  return (request.headers.get("authorization") || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
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

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    return json286(
      { ok: false, error: "Darik banner controls are temporarily unavailable." },
      503
    );
  }

  let body: ActionBody286;
  try {
    body = (await request.json()) as ActionBody286;
  } catch {
    return json286({ ok: false, error: "Invalid banner action." }, 400);
  }

  const retailerId = text286(body.retailer_id, 80);
  const bannerId = text286(body.banner_id, 80);
  const action = text286(body.action, 30).toLowerCase();

  if (!validUuid286(retailerId)) {
    return json286({ ok: false, error: "Invalid Darik retailer." }, 400);
  }

  if (!["remove", "disable", "disable_all"].includes(action)) {
    return json286({ ok: false, error: "Invalid banner action." }, 400);
  }

  if (action === "remove" && !validUuid286(bannerId)) {
    return json286({ ok: false, error: "Invalid Darik banner." }, 400);
  }

  const token = bearerToken286(request);
  if (!token) {
    return json286({ ok: false, error: "Retailer login required." }, 401);
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
    return json286(
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
    return json286(
      { ok: false, error: "Could not verify this Darik store." },
      retailerError ? 500 : 404
    );
  }

  if (retailer.account_restricted === true) {
    return json286(
      { ok: false, error: "This Darik account is currently restricted." },
      403
    );
  }

  if (
    text286(retailer.email, 320).toLowerCase() !==
    text286(userData.user.email, 320).toLowerCase()
  ) {
    return json286(
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
    return json286(
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
      return json286(
        { ok: false, error: "Could not turn off the storefront banners." },
        500
      );
    }

    return json286({
      ok: true,
      active_banner: null,
      active_banners: [],
      banner_limit: BANNER_LIMIT_286,
      hero_size: "compact",
    });
  }

  const { data: candidate, error: candidateError } = await admin
    .from("retailer_storefront_banners")
    .select("id,status,storefront_id,retailer_id")
    .eq("id", bannerId)
    .eq("storefront_id", storefront.id)
    .eq("retailer_id", retailerId)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .maybeSingle();

  if (candidateError || !candidate?.id) {
    return json286(
      { ok: false, error: "This banner does not belong to your Darik store." },
      candidateError ? 500 : 404
    );
  }

  const wasActive = candidate.status === "active";

  const archived = await admin
    .from("retailer_storefront_banners")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", candidate.id);

  if (archived.error) {
    return json286({ ok: false, error: "Could not remove this banner." }, 500);
  }

  // The original schema allows exactly one "active" row. If that slot was
  // removed, promote the oldest remaining manual draft so compatibility stays
  // intact while all manual active+draft rows remain live to the rotation API.
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

  const { data: refreshed, error: refreshedError } = await admin
    .from("retailer_storefront_banners")
    .select(
      "id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at"
    )
    .eq("storefront_id", storefront.id)
    .eq("banner_text", "Uploaded storefront banner")
    .in("status", ["active", "draft"])
    .order("created_at", { ascending: true })
    .limit(BANNER_LIMIT_286);

  if (refreshedError) {
    return json286(
      { ok: false, error: "Banner removed, but Darik could not refresh the list." },
      500
    );
  }

  const activeBanners = (refreshed || []).map(mapBanner286);

  return json286({
    ok: true,
    active_banner: activeBanners[0] || null,
    active_banners: activeBanners,
    banner_limit: BANNER_LIMIT_286,
    hero_size: "compact",
    slug: storefront.slug,
  });
}
