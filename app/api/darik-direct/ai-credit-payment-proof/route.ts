// DARIK_AI_CREDIT_CLIQ_PROOF_API_305
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECEIPT_BUCKET_305 =
  "darik-ai-credit-payment-proofs";

const PACKS_305 = {
  credits_500: { credits: 500, price_jod: 20 },
  credits_1000: { credits: 1000, price_jod: 35 },
  credits_2000: { credits: 2000, price_jod: 50 },
} as const;

function json305(
  payload: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function clean305(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid305(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function bearer305(request: NextRequest) {
  return clean305(
    request.headers.get("authorization") || "",
    4000,
  ).replace(/^Bearer\s+/i, "");
}

function admin305() {
  const url305 =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const key305 =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!url305 || !key305) {
    throw new Error(
      "Supabase server environment is missing.",
    );
  }

  return createClient(url305, key305, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function verifyRetailer305(
  request: NextRequest,
  retailerId305: string,
) {
  if (!validUuid305(retailerId305)) {
    return {
      error: json305(
        { ok: false, error: "Invalid Darik retailer." },
        400,
      ),
    };
  }

  const token305 = bearer305(request);

  if (!token305) {
    return {
      error: json305(
        { ok: false, error: "Retailer login required." },
        401,
      ),
    };
  }

  const admin = admin305();

  const userResult305 =
    await admin.auth.getUser(token305);

  const user305 = userResult305.data.user;

  if (
    userResult305.error ||
    !user305?.id ||
    !user305.email
  ) {
    return {
      error: json305(
        {
          ok: false,
          error:
            "Retailer session is invalid or expired.",
        },
        401,
      ),
    };
  }

  const retailerResult305 = await admin
    .from("retailers")
    .select("id,email,account_restricted")
    .eq("id", retailerId305)
    .maybeSingle();

  if (retailerResult305.error) {
    return {
      error: json305(
        {
          ok: false,
          error: "Could not verify this Darik store.",
        },
        500,
      ),
    };
  }

  const retailer305 = retailerResult305.data;

  if (!retailer305?.id) {
    return {
      error: json305(
        {
          ok: false,
          error: "Darik retailer was not found.",
        },
        404,
      ),
    };
  }

  if (retailer305.account_restricted === true) {
    return {
      error: json305(
        {
          ok: false,
          error:
            "This Darik account is currently restricted.",
        },
        403,
      ),
    };
  }

  if (
    clean305(retailer305.email, 320).toLowerCase() !==
    clean305(user305.email, 320).toLowerCase()
  ) {
    return {
      error: json305(
        {
          ok: false,
          error:
            "The signed-in retailer does not match this Darik store.",
        },
        403,
      ),
    };
  }

  return { admin };
}

function safeExt305(
  name305: string,
  type305: string,
) {
  const lower305 = name305.toLowerCase();

  if (
    type305 === "image/png" ||
    lower305.endsWith(".png")
  ) {
    return "png";
  }

  if (
    type305 === "image/webp" ||
    lower305.endsWith(".webp")
  ) {
    return "webp";
  }

  return "jpg";
}

export async function POST(request: NextRequest) {
  let form305: FormData;

  try {
    form305 = await request.formData();
  } catch {
    return json305(
      {
        ok: false,
        error: "Invalid payment-proof submission.",
      },
      400,
    );
  }

  const retailerId305 = clean305(
    form305.get("retailer_id"),
    80,
  );

  const packKey305 = clean305(
    form305.get("pack_key"),
    80,
  ) as keyof typeof PACKS_305;

  const cliqReference305 = clean305(
    form305.get("cliq_reference_number"),
    150,
  );

  const senderName305 = clean305(
    form305.get("cliq_sender_name"),
    200,
  );

  const senderPhone305 = clean305(
    form305.get("cliq_sender_phone"),
    80,
  );

  const receipt305 = form305.get("receipt");

  const verified305 =
    await verifyRetailer305(
      request,
      retailerId305,
    );

  if ("error" in verified305) {
    return verified305.error;
  }

  const pack305 = PACKS_305[packKey305];

  if (!pack305) {
    return json305(
      {
        ok: false,
        error: "Invalid AI credit pack.",
      },
      400,
    );
  }

  if (!cliqReference305) {
    return json305(
      {
        ok: false,
        error: "CliQ reference number is required.",
      },
      400,
    );
  }

  if (!senderName305) {
    return json305(
      {
        ok: false,
        error: "CliQ sender name is required.",
      },
      400,
    );
  }

  if (!senderPhone305) {
    return json305(
      {
        ok: false,
        error: "CliQ sender phone is required.",
      },
      400,
    );
  }

  if (!(receipt305 instanceof File)) {
    return json305(
      {
        ok: false,
        error: "Receipt screenshot is required.",
      },
      400,
    );
  }

  const allowedTypes305 = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

  if (
    receipt305.type &&
    !allowedTypes305.has(receipt305.type)
  ) {
    return json305(
      {
        ok: false,
        error:
          "Receipt must be a JPG, PNG, or WEBP image.",
      },
      400,
    );
  }

  if (
    receipt305.size <= 0 ||
    receipt305.size > 6 * 1024 * 1024
  ) {
    return json305(
      {
        ok: false,
        error:
          "Receipt image must be smaller than 6 MB.",
      },
      400,
    );
  }

  const ext305 = safeExt305(
    receipt305.name || "receipt.jpg",
    receipt305.type || "image/jpeg",
  );

  const storagePath305 =
    retailerId305 +
    "/" +
    new Date().toISOString().slice(0, 10) +
    "/" +
    crypto.randomUUID() +
    "." +
    ext305;

  const upload305 =
    await verified305.admin.storage
      .from(RECEIPT_BUCKET_305)
      .upload(
        storagePath305,
        Buffer.from(
          await receipt305.arrayBuffer(),
        ),
        {
          contentType:
            receipt305.type || "image/jpeg",
          cacheControl: "0",
          upsert: false,
        },
      );

  if (upload305.error) {
    console.error(
      "Darik AI receipt upload 305 failed:",
      upload305.error.message,
    );

    return json305(
      {
        ok: false,
        error:
          "Could not upload the CliQ receipt.",
      },
      500,
    );
  }

  const submit305 =
    await verified305.admin.rpc(
      "darik_ai_credit_submit_purchase_proof_v1",
      {
        p_retailer_id: retailerId305,
        p_pack_key: packKey305,
        p_cliq_reference_number:
          cliqReference305,
        p_cliq_sender_name: senderName305,
        p_cliq_sender_phone:
          senderPhone305,
        p_receipt_storage_path:
          storagePath305,
      },
    );

  if (submit305.error) {
    await verified305.admin.storage
      .from(RECEIPT_BUCKET_305)
      .remove([storagePath305]);

    console.error(
      "Darik AI payment proof 305 failed:",
      submit305.error.message,
    );

    return json305(
      {
        ok: false,
        error:
          "Could not submit the AI credit payment proof.",
      },
      500,
    );
  }

  const row305 =
    Array.isArray(submit305.data) &&
    submit305.data.length > 0
      ? submit305.data[0]
      : null;

  return json305({
    ok: true,
    request: row305,
    message:
      "CliQ payment proof submitted for review.",
  });
}
