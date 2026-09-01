/* DARIK_REAL_PRIVATE_PREVIEW_ALIAS_143 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREVIEW_ALIAS_143 = "_darik-private-store-preview";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function lower(value: unknown) {
  return text(value).toLowerCase();
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const cleaned = text(value);
    if (cleaned) return cleaned;
  }
  return "";
}

function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function directProductBelongsOnStore(row: Record<string, any>) {
  if (row.storefront_visible === false) return false;

  const directStatus = lower(row.direct_product_status);
  if (directStatus && directStatus !== "published") return false;

  if (!directStatus) {
    const legacyStatus = lower(row.product_status);
    if (
      legacyStatus &&
      !["live", "active", "approved", "published"].includes(legacyStatus)
    ) {
      return false;
    }
  }

  return true;
}

function responseHeaders() {
  return {
    "Cache-Control": "private, no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storefrontId = text(url.searchParams.get("storefrontId"));
  const previewKey = text(request.headers.get("x-darik-preview-key"));
  const authorization = request.headers.get("authorization") || "";
  const accessToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (!validUuid(storefrontId)) {
    return NextResponse.json(
      { ok: false, error: "Invalid private storefront preview request." },
      { status: 400, headers: responseHeaders() }
    );
  }

  if (previewKey.length < 32) {
    return NextResponse.json(
      { ok: false, error: "Private preview key is missing." },
      { status: 403, headers: responseHeaders() }
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Retailer login required." },
      { status: 401, headers: responseHeaders() }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Darik private storefront preview 143 is missing Supabase server environment variables."
    );
    return NextResponse.json(
      { ok: false, error: "Private storefront preview is temporarily unavailable." },
      { status: 503, headers: responseHeaders() }
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  const authUser = userData?.user ?? null;

  if (userError || !authUser) {
    return NextResponse.json(
      { ok: false, error: "Retailer session is invalid." },
      { status: 401, headers: responseHeaders() }
    );
  }

  const { data: storefrontData, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("*")
    .eq("id", storefrontId)
    .maybeSingle();

  if (storefrontError) {
    console.error(
      "Darik private storefront preview 143 storefront lookup failed:",
      storefrontError.message
    );
    return NextResponse.json(
      { ok: false, error: "Could not load this storefront preview." },
      { status: 500, headers: responseHeaders() }
    );
  }

  if (!storefrontData) {
    return NextResponse.json(
      { ok: false, error: "Storefront not found." },
      { status: 404, headers: responseHeaders() }
    );
  }

  const retailerId = text(storefrontData.retailer_id);
  if (!retailerId) {
    return NextResponse.json(
      { ok: false, error: "Storefront owner is missing." },
      { status: 404, headers: responseHeaders() }
    );
  }

  /*
    SECURITY BOUNDARY:
      1. Bearer token must be a real authenticated Supabase user.
      2. User must either be an ACTIVE retailer_store_members member for this exact
         retailer OR the exact DARIK 136 username-account owner of this storefront.
      3. The browser-generated preview key is an additional preview-intent guard,
         not the primary authorization boundary.
  */
  const [membershipResult, usernameOwnerResult] = await Promise.all([
    admin
      .from("retailer_store_members")
      .select("id,role,member_status")
      .eq("auth_user_id", authUser.id)
      .eq("retailer_id", retailerId)
      .eq("member_status", "active")
      .limit(1)
      .maybeSingle(),
    admin
      .from("darik_direct_username_accounts")
      .select("auth_user_id,retailer_id,storefront_id")
      .eq("auth_user_id", authUser.id)
      .eq("retailer_id", retailerId)
      .eq("storefront_id", storefrontId)
      .limit(1)
      .maybeSingle(),
  ]);

  const hasExactOwnerAccess = Boolean(
    membershipResult.data || usernameOwnerResult.data
  );

  if (!hasExactOwnerAccess) {
    if (membershipResult.error && usernameOwnerResult.error) {
      console.error(
        "Darik private storefront preview 143 ownership verification failed:",
        membershipResult.error.message,
        usernameOwnerResult.error.message
      );
      return NextResponse.json(
        { ok: false, error: "Could not verify storefront ownership." },
        { status: 500, headers: responseHeaders() }
      );
    }

    return NextResponse.json(
      { ok: false, error: "This private preview belongs to another retailer." },
      { status: 403, headers: responseHeaders() }
    );
  }

  const [retailerResult, productsResult, categoriesResult] = await Promise.all([
    admin
      .from("retailers")
      .select("*")
      .eq("id", retailerId)
      .maybeSingle(),
    admin
      .from("products")
      .select("*")
      .eq("retailer_id", retailerId)
      .order("created_at", { ascending: false }),
    admin
      .from("retailer_store_categories")
      .select("*")
      .eq("retailer_id", retailerId)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (retailerResult.error) {
    console.error(
      "Darik private storefront preview 143 retailer lookup failed:",
      retailerResult.error.message
    );
    return NextResponse.json(
      { ok: false, error: "Could not load retailer preview." },
      { status: 500, headers: responseHeaders() }
    );
  }

  if (productsResult.error) {
    console.error(
      "Darik private storefront preview 143 products lookup failed:",
      productsResult.error.message
    );
    return NextResponse.json(
      { ok: false, error: "Could not load preview products." },
      { status: 500, headers: responseHeaders() }
    );
  }

  if (categoriesResult.error) {
    console.error(
      "Darik private storefront preview 143 categories lookup failed:",
      categoriesResult.error.message
    );
    return NextResponse.json(
      { ok: false, error: "Could not load preview categories." },
      { status: 500, headers: responseHeaders() }
    );
  }

  const retailer = (retailerResult.data ?? {}) as Record<string, any>;
  const storefront = storefrontData as Record<string, any>;
  const rawCategories = (categoriesResult.data ?? []) as Array<Record<string, any>>;

  const categoryById = new Map(
    rawCategories.map((category) => [String(category.id), category])
  );

  const showPrices = storefront.show_prices !== false;

  const products = ((productsResult.data ?? []) as Array<Record<string, any>>)
    .filter(directProductBelongsOnStore)
    .map((product) => {
      const categoryId = text(product.direct_store_category_id);
      const category = categoryId ? categoryById.get(categoryId) : null;
      const pricingMode = lower(product.direct_pricing_mode) || "price";
      const priceVisible = showPrices && pricingMode === "price";
      const displayName = firstText(
        product.direct_name,
        product.official_marketplace_name,
        product.retailer_submitted_name,
        product.name
      );
      const displayNameAr = firstText(
        product.direct_name_ar,
        product.official_marketplace_name_ar
      );
      const description = firstText(
        product.direct_description,
        product.description
      );
      const photo = firstText(
        product.direct_photo_url,
        product.official_product_photo_url,
        product.retailer_raw_photo_url,
        product.official_product_thumbnail_url
      );

      return {
        ...product,

        /*
          NEVER leak the internal setup-* DB slug into the browser preview payload.
          The renderer gets a fixed private alias instead.
        */
        storefront_id: storefront.id,
        storefront_slug: PREVIEW_ALIAS_143,

        name: displayName || "Product",
        retailer_submitted_name:
          firstText(product.retailer_submitted_name, product.name) ||
          displayName ||
          "Product",
        official_marketplace_name: displayName || null,
        official_marketplace_name_ar: displayNameAr || null,
        description: description || null,
        app_price: priceVisible
          ? product.direct_price ??
            product.app_price ??
            product.vendor_price ??
            null
          : null,
        vendor_price: priceVisible ? product.vendor_price ?? null : null,
        official_product_photo_url: photo || null,
        official_product_thumbnail_url:
          firstText(product.official_product_thumbnail_url, photo) || null,
        direct_store_category_id:
          categoryId || product.direct_store_category_id || null,
        direct_store_category_name:
          category?.name ?? product.direct_store_category_name ?? null,
        direct_store_category_name_ar:
          category?.name_ar ?? product.direct_store_category_name_ar ?? null,
        direct_store_category_slug:
          category?.slug ?? product.direct_store_category_slug ?? null,
        storefront_featured: product.storefront_featured === true,
        storefront_sort_order: product.storefront_sort_order ?? 0,
      } as Record<string, any>;
    })
    .sort((a, b) => {
      const featured =
        Number(Boolean(b.storefront_featured)) -
        Number(Boolean(a.storefront_featured));
      if (featured !== 0) return featured;

      const sortOrder =
        Number(a.storefront_sort_order ?? 0) -
        Number(b.storefront_sort_order ?? 0);
      if (sortOrder !== 0) return sortOrder;

      return String(b.created_at ?? "").localeCompare(
        String(a.created_at ?? "")
      );
    });

  const productCountByCategory = new Map<string, number>();
  for (const product of products) {
    const categoryId = text(product.direct_store_category_id);
    if (!categoryId) continue;
    productCountByCategory.set(
      categoryId,
      (productCountByCategory.get(categoryId) ?? 0) + 1
    );
  }

  const categories = rawCategories
    .filter((category) => {
      const status = lower(category.category_status);
      return !status || status === "active";
    })
    .map((category) => ({
      ...category,
      storefront_id: storefront.id,
      storefront_slug: PREVIEW_ALIAS_143,
      product_count:
        productCountByCategory.get(String(category.id)) ?? 0,
    }))
    .filter((category) => Number(category.product_count ?? 0) > 0);

  /*
    SIMULATE PAID/LIVE ONLY IN THIS RESPONSE.
    NO database activation field is written.
  */
  const liveSimulationStorefront: Record<string, any> = {
    ...storefront,

    /* Hide internal or permanent slug from the preview transport itself. */
    slug: PREVIEW_ALIAS_143,

    business_name:
      firstText(retailer.business_name, storefront.display_name) ||
      "Darik retailer",
    business_type:
      firstText(
        retailer.direct_business_type,
        retailer.direct_business_type_other
      ) || "retail",
    business_address: retailer.business_address ?? null,
    business_latitude: retailer.business_latitude ?? null,
    business_longitude: retailer.business_longitude ?? null,

    activation_status: "active",
    activation_expires_at: null,
    storefront_status: "published",
    direct_storefront_enabled: true,
    is_accepting_orders: storefront.show_ordering !== false,
  };

  return NextResponse.json(
    {
      ok: true,
      real_private_storefront_preview_143: true,
      storefront: liveSimulationStorefront,
      products,
      categories,
    },
    {
      status: 200,
      headers: responseHeaders(),
    }
  );
}
