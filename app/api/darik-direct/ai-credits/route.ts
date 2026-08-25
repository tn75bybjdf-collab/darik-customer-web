// DARIK_AI_CREDIT_CLIQ_INFO_305
// DARIK_REAL_AI_CREDITS_304
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PACKS_304 = [
  { key: "credits_500", credits: 500, price_jod: 20 },
  { key: "credits_1000", credits: 1000, price_jod: 35 },
  { key: "credits_2000", credits: 2000, price_jod: 50 },
] as const;

function json304(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function clean304(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid304(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function bearer304(request: NextRequest) {
  return clean304(
    request.headers.get("authorization") || "",
    4000,
  ).replace(/^Bearer\s+/i, "");
}

function admin304() {
  const url304 = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key304 =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!url304 || !key304) {
    throw new Error("Supabase server environment is missing.");
  }

  return createClient(url304, key304, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function verifyRetailer304(
  request: NextRequest,
  retailerId304: string,
) {
  if (!validUuid304(retailerId304)) {
    return {
      error: json304(
        { ok: false, error: "Invalid Darik retailer." },
        400,
      ),
    };
  }

  const token304 = bearer304(request);

  if (!token304) {
    return {
      error: json304(
        { ok: false, error: "Retailer login required." },
        401,
      ),
    };
  }

  const admin = admin304();

  const userResult304 =
    await admin.auth.getUser(token304);

  const user304 = userResult304.data.user;

  if (
    userResult304.error ||
    !user304?.id ||
    !user304.email
  ) {
    return {
      error: json304(
        {
          ok: false,
          error: "Retailer session is invalid or expired.",
        },
        401,
      ),
    };
  }

  const retailerResult304 = await admin
    .from("retailers")
    .select("id,email,account_restricted")
    .eq("id", retailerId304)
    .maybeSingle();

  if (retailerResult304.error) {
    return {
      error: json304(
        {
          ok: false,
          error: "Could not verify this Darik store.",
        },
        500,
      ),
    };
  }

  const retailer304 = retailerResult304.data;

  if (!retailer304?.id) {
    return {
      error: json304(
        { ok: false, error: "Darik retailer was not found." },
        404,
      ),
    };
  }

  if (retailer304.account_restricted === true) {
    return {
      error: json304(
        {
          ok: false,
          error: "This Darik account is currently restricted.",
        },
        403,
      ),
    };
  }

  if (
    clean304(retailer304.email, 320).toLowerCase() !==
    clean304(user304.email, 320).toLowerCase()
  ) {
    return {
      error: json304(
        {
          ok: false,
          error:
            "The signed-in retailer does not match this Darik store.",
        },
        403,
      ),
    };
  }

  return { admin, retailer: retailer304 };
}

function row304(data304: unknown) {
  return Array.isArray(data304) && data304.length > 0
    ? (data304[0] as Record<string, unknown>)
    : null;
}

export async function GET(request: NextRequest) {
  const retailerId304 = clean304(
    request.nextUrl.searchParams.get("retailer_id"),
    80,
  );

  const verified304 =
    await verifyRetailer304(request, retailerId304);

  if ("error" in verified304) {
    return verified304.error;
  }

  const status304 = await verified304.admin.rpc(
    "darik_ai_credit_status_v1",
    { p_retailer_id: retailerId304 },
  );

  if (status304.error) {
    console.error(
      "Darik AI credit status 304 failed:",
      status304.error.message,
    );

    return json304(
      {
        ok: false,
        error: "Could not load AI credit balance.",
      },
      500,
    );
  }

  const current304 = row304(status304.data);

  return json304({
    ok: true,
    balance: Number(current304?.balance ?? 0),
    lifetime_signup_granted: Number(
      current304?.lifetime_signup_granted ?? 0,
    ),
    lifetime_purchased: Number(
      current304?.lifetime_purchased ?? 0,
    ),
    lifetime_spent: Number(
      current304?.lifetime_spent ?? 0,
    ),
    signup_promo_plan: clean304(
      current304?.signup_promo_plan,
      100,
    ),
    signup_promo_granted_at:
      current304?.signup_promo_granted_at ?? null,
    enhancement_cost: 1,
    payment: {
      method: "CliQ",
      name:
        process.env.NEXT_PUBLIC_DARIK_CLIQ_NAME ||
        "DARIK",
      alias:
        process.env.NEXT_PUBLIC_DARIK_CLIQ_ALIAS ||
        "",
    },
    packs: PACKS_304,
  });
}

export async function POST(request: NextRequest) {
  let body304: {
    retailer_id?: unknown;
    action?: unknown;
    pack_key?: unknown;
  };

  try {
    body304 = (await request.json()) as typeof body304;
  } catch {
    return json304(
      { ok: false, error: "Invalid AI credit request." },
      400,
    );
  }

  const retailerId304 = clean304(
    body304.retailer_id,
    80,
  );

  const action304 = clean304(
    body304.action,
    80,
  );

  const verified304 =
    await verifyRetailer304(request, retailerId304);

  if ("error" in verified304) {
    return verified304.error;
  }

  if (action304 !== "request_purchase") {
    return json304(
      { ok: false, error: "Unsupported AI credit action." },
      400,
    );
  }

  const packKey304 = clean304(body304.pack_key, 80);

  const allowed304 = PACKS_304.some(
    (pack304) => pack304.key === packKey304,
  );

  if (!allowed304) {
    return json304(
      { ok: false, error: "Invalid AI credit pack." },
      400,
    );
  }

  const request304 = await verified304.admin.rpc(
    "darik_ai_credit_request_purchase_v1",
    {
      p_retailer_id: retailerId304,
      p_pack_key: packKey304,
    },
  );

  if (request304.error) {
    console.error(
      "Darik AI credit purchase request 304 failed:",
      request304.error.message,
    );

    return json304(
      {
        ok: false,
        error: "Could not create the AI credit purchase request.",
      },
      500,
    );
  }

  const purchase304 = row304(request304.data);

  return json304({
    ok: true,
    request: purchase304,
    packs: PACKS_304,
  });
}
