import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query296 = String(
    request.nextUrl.searchParams.get("q") || ""
  ).trim();

  if (query296.length < 2) {
    return NextResponse.json({
      ok: true,
      results: [],
    });
  }

  if (query296.length > 120) {
    return NextResponse.json(
      {
        ok: false,
        error: "Search is too long.",
      },
      { status: 400 }
    );
  }

  const supabaseUrl296 =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey296 =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl296 || !supabaseAnonKey296) {
    return NextResponse.json(
      {
        ok: false,
        error: "Darik search is not configured.",
      },
      { status: 500 }
    );
  }

  const supabase296 = createClient(
    supabaseUrl296,
    supabaseAnonKey296,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const result296 = await supabase296.rpc(
    "darik_jordan_store_item_search_v2",
    {
      p_query: query296,
      p_limit: 60,
    }
  );

  if (result296.error) {
    console.error(
      "Darik store item search 296 failed:",
      result296.error.message
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Could not search Darik right now.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      query: query296,
      results: Array.isArray(result296.data)
        ? result296.data
        : [],
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
