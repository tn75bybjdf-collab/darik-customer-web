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
    const allowed = await admin.rpc("darik_direct_admin_can_manage_activations", { p_session_token: sessionToken });
    if (allowed.error || allowed.data !== true) {
      return NextResponse.json({ error: "Admin session is invalid or expired." }, { status: 401 });
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
