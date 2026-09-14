/* DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type CreateRetailerBody = {
  username?: unknown;
  contactEmail?: unknown;
  password?: unknown;
};

function normalizeUsername(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function strongPassword(value: string) {
  return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export async function POST(request: Request) {
  let body: CreateRetailerBody;
  try {
    body = (await request.json()) as CreateRetailerBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid signup request." }, { status: 400 });
  }

  const username = normalizeUsername(body.username);
  const contactEmail = normalizeEmail(body.contactEmail);
  const password = typeof body.password === "string" ? body.password : "";

  if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(username)) {
    return NextResponse.json({ ok: false, error: "Choose a valid username." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) || contactEmail.length > 320) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (!strongPassword(password)) {
    return NextResponse.json({ ok: false, error: "Password does not meet Darik requirements." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Darik retailer username signup is missing Supabase server environment variables.");
    return NextResponse.json({ ok: false, error: "Darik signup is temporarily unavailable." }, { status: 503 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: availabilityData, error: availabilityError } = await admin.rpc(
    "darik_direct_username_available_v1",
    { p_username: username }
  );

  if (availabilityError) {
    console.error("Darik username availability failed:", availabilityError.message);
    return NextResponse.json({ ok: false, error: "Could not verify that username right now." }, { status: 503 });
  }

  const availability = (availabilityData ?? {}) as { available?: boolean; valid?: boolean };
  if (!availability.available) {
    return NextResponse.json({ ok: false, error: "That username is already in use." }, { status: 409 });
  }

  const internalAuthEmail = `${username}@retailer-auth.getdarik.com`;

  const { data, error } = await admin.auth.admin.createUser({
    email: internalAuthEmail,
    password,
    email_confirm: true,
    user_metadata: {
      account_type: "darik_direct_username_store",
      darik_retailer_username: username,
      contact_email: contactEmail,
    },
  });

  if (error || !data.user) {
    const message = error?.message?.toLowerCase() || "";
    const conflict = message.includes("username") || message.includes("duplicate") || message.includes("already");
    console.error("Darik username retailer createUser failed:", error?.message || "missing user");
    return NextResponse.json(
      { ok: false, error: conflict ? "That username is already in use." : "Could not create the Darik retailer account." },
      { status: conflict ? 409 : 500 }
    );
  }

  return NextResponse.json({ ok: true, username });
}
