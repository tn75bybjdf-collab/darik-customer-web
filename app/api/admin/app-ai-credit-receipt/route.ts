// DARIK_APP_ADMIN_AI_CREDIT_RECEIPT_311B
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECEIPT_BUCKET_311 =
  "darik-ai-credit-payment-proofs";

function json311(
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

function clean311(
  value: unknown,
  max = 4000,
) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function validUuid311(
  value: string,
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function bearer311(
  request: NextRequest,
) {
  return clean311(
    request.headers.get(
      "authorization",
    ) || "",
  ).replace(
    /^Bearer\s+/i,
    "",
  );
}

function admin311() {
  const url311 =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";

  const key311 =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";

  if (!url311 || !key311) {
    throw new Error(
      "Supabase server environment is missing.",
    );
  }

  return createClient(
    url311,
    key311,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const token311 =
      bearer311(request);

    if (!token311) {
      return json311(
        {
          ok: false,
          error:
            "Admin session required.",
        },
        401,
      );
    }

    const requestId311 =
      clean311(
        request.nextUrl.searchParams.get(
          "request_id",
        ),
        100,
      );

    if (
      !validUuid311(
        requestId311,
      )
    ) {
      return json311(
        {
          ok: false,
          error:
            "Invalid AI-credit request.",
        },
        400,
      );
    }

    const admin =
      admin311();

    const adminSession311 =
      await admin.rpc(
        "darik_app_admin_session_me_v1",
        {
          p_session_token:
            token311,
        },
      );

    const adminRow311 =
      Array.isArray(
        adminSession311.data,
      )
        ? adminSession311.data[0]
        : adminSession311.data;

    if (
      adminSession311.error ||
      !adminRow311 ||
      adminRow311.is_admin !== true
    ) {
      return json311(
        {
          ok: false,
          error:
            "Admin session is invalid or expired.",
        },
        401,
      );
    }

    const purchase311 =
      await admin
        .from(
          "darik_ai_credit_purchase_requests",
        )
        .select(
          "id,receipt_storage_path,status",
        )
        .eq(
          "id",
          requestId311,
        )
        .maybeSingle();

    if (
      purchase311.error ||
      !purchase311.data?.id
    ) {
      return json311(
        {
          ok: false,
          error:
            "AI-credit payment request was not found.",
        },
        404,
      );
    }

    const receiptPath311 =
      clean311(
        purchase311.data
          .receipt_storage_path,
        1200,
      );

    if (!receiptPath311) {
      return json311(
        {
          ok: false,
          error:
            "No receipt is attached to this request.",
        },
        404,
      );
    }

    const signed311 =
      await admin.storage
        .from(
          RECEIPT_BUCKET_311,
        )
        .createSignedUrl(
          receiptPath311,
          300,
        );

    if (
      signed311.error ||
      !signed311.data?.signedUrl
    ) {
      return json311(
        {
          ok: false,
          error:
            "Could not open the payment receipt.",
        },
        404,
      );
    }

    return json311({
      ok: true,
      signed_url:
        signed311.data.signedUrl,
      expires_in_seconds: 300,
    });
  } catch (error311) {
    console.error(
      "Darik mobile admin AI-credit receipt 311 failed:",
      error311,
    );

    return json311(
      {
        ok: false,
        error:
          "Could not open the AI-credit receipt.",
      },
      500,
    );
  }
}
