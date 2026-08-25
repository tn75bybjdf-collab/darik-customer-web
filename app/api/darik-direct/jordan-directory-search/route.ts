import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type DirectoryResult295 = {
  result_type?: string;
  storefront_slug?: string | null;
  storefront_name?: string | null;
  storefront_name_ar?: string | null;
  storefront_logo_url?: string | null;
  product_id?: string | null;
  product_name?: string | null;
  product_name_ar?: string | null;
  product_image_url?: string | null;
  price_text?: string | null;
  pricing_mode?: string | null;
  availability_status?: string | null;
  category_name?: string | null;
  score?: number | null;
};

export async function GET(request: NextRequest) {
  const query295 = String(
    request.nextUrl.searchParams.get("q") || ""
  ).trim();

  if (query295.length < 2) {
    return NextResponse.json({
      ok: true,
      results: [],
    });
  }

  if (query295.length > 120) {
    return NextResponse.json(
      {
        ok: false,
        error: "Search is too long.",
      },
      { status: 400 }
    );
  }

  const supabaseUrl295 =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey295 =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl295 || !supabaseAnonKey295) {
    return NextResponse.json(
      {
        ok: false,
        error: "Darik search is not configured.",
      },
      { status: 500 }
    );
  }

  const supabase295 = createClient(
    supabaseUrl295,
    supabaseAnonKey295,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const result295 = await supabase295.rpc(
    "darik_jordan_directory_search_v1",
    {
      p_query: query295,
      p_limit: 80,
    }
  );

  if (result295.error) {
    console.error(
      "Darik Jordan directory search 295 failed:",
      result295.error.message
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Could not search Darik right now.",
      },
      { status: 500 }
    );
  }

  const rows295 = Array.isArray(result295.data)
    ? (result295.data as DirectoryResult295[])
    : [];

  return NextResponse.json(
    {
      ok: true,
      query: query295,
      results: rows295,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
