import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { sessionToken, storefrontId } = await request.json() as {
      sessionToken?: string;
      storefrontId?: string;
    };
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is missing in Vercel." },
        { status: 500 },
      );
    }
    if (!sessionToken || !storefrontId) {
      return NextResponse.json(
        { error: "Admin session and storefront are required." },
        { status: 400 },
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const allowed = await admin.rpc("darik_direct_admin_can_manage_activations", {
      p_session_token: sessionToken,
    });
    if (allowed.error || allowed.data !== true) {
      return NextResponse.json(
        { error: "Admin session is invalid or expired." },
        { status: 401 },
      );
    }

    const storefrontResult = await admin
      .from("retailer_storefronts")
      .select("id,retailer_id,slug,display_name,display_name_ar,tagline,tagline_ar,logo_url,hero_image_url,primary_color,accent_color,background_color,minimum_order,delivery_fee,estimated_delivery_minutes,business_phone,whatsapp_number,activation_status")
      .eq("id", storefrontId)
      .maybeSingle();

    if (storefrontResult.error || !storefrontResult.data) {
      return NextResponse.json(
        { error: storefrontResult.error?.message || "Storefront not found." },
        { status: 404 },
      );
    }

    const retailerId = storefrontResult.data.retailer_id;
    const [retailerResult, categoriesResult, productsResult] = await Promise.all([
      admin
        .from("retailers")
        .select("business_name,business_address,direct_business_type")
        .eq("id", retailerId)
        .maybeSingle(),
      admin
        .from("retailer_store_categories")
        .select("id,name,name_ar,image_url,category_status,sort_order")
        .eq("retailer_id", retailerId)
        .neq("category_status", "archived")
        .order("sort_order", { ascending: true }),
      admin
        .from("products")
        .select("id,name,direct_name,direct_name_ar,direct_price,app_price,direct_photo_url,official_product_thumbnail_url,direct_product_status,storefront_visible,storefront_sort_order")
        .eq("retailer_id", retailerId)
        .neq("direct_product_status", "archived")
        .order("storefront_sort_order", { ascending: true })
        .limit(50),
    ]);

    const queryError = retailerResult.error || categoriesResult.error || productsResult.error;
    if (queryError) {
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    return NextResponse.json({
      storefront: storefrontResult.data,
      retailer: retailerResult.data,
      categories: categoriesResult.data || [],
      products: productsResult.data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load the private storefront preview." },
      { status: 500 },
    );
  }
}
