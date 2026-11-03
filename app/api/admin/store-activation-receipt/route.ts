import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { sessionToken, receiptPath } = await request.json() as { sessionToken?: string; receiptPath?: string };
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is missing in Vercel." }, { status: 500 });
    }
    if (!sessionToken || !receiptPath) {
      return NextResponse.json({ error: "Admin session and receipt path are required." }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    // DARIK_MOBILE_ADMIN_ACTIVATION_RECEIPT_AUTH_313B
    const legacyAllowed313B = await admin.rpc(
      "darik_direct_admin_can_manage_activations",
      {
        p_session_token: sessionToken,
      },
    );

    let allowed313B =
      !legacyAllowed313B.error &&
      legacyAllowed313B.data === true;

    if (!allowed313B) {
      const mobileAdmin313B = await admin.rpc(
        "darik_app_admin_session_me_v1",
        {
          p_session_token: sessionToken,
        },
      );

      const mobileRow313B =
        Array.isArray(mobileAdmin313B.data)
          ? mobileAdmin313B.data[0]
          : mobileAdmin313B.data;

      allowed313B =
        !mobileAdmin313B.error &&
        Boolean(
          mobileRow313B &&
          mobileRow313B.is_admin === true,
        );
    }

    if (!allowed313B) {
      return NextResponse.json(
        {
          error:
            "Admin session is invalid or expired.",
        },
        {
          status: 401,
        },
      );
    }

    const signed = await admin.storage.from("darik-store-activation-receipts").createSignedUrl(receiptPath, 300);
    if (signed.error || !signed.data?.signedUrl) {
      return NextResponse.json({ error: signed.error?.message || "Could not open the receipt." }, { status: 404 });
    }

    return NextResponse.json({ signedUrl: signed.data.signedUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not open activation receipt." }, { status: 500 });
  }
}
