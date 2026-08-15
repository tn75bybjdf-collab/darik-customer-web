// DARIK_FRONTEND_RETAILER_STAFF_USER_API_126
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const PERMISSION_KEYS = [
  "orders",
  "products",
  "dispatch",
  "payments",
  "reports",
  "settings",
] as const;

type PermissionKey = (typeof PERMISSION_KEYS)[number];
type Permissions = Record<PermissionKey, boolean>;

type StaffRequestBody = {
  retailer_id?: unknown;
  member_id?: unknown;
  display_name?: unknown;
  email?: unknown;
  password?: unknown;
  permissions?: unknown;
};

function json(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function adminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on the Darik server.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function text(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizeEmail(value: unknown) {
  return text(value, 320).toLowerCase();
}

function normalizePermissions(value: unknown): Permissions {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const permissions = Object.fromEntries(
    PERMISSION_KEYS.map((key) => [key, input[key] === true]),
  ) as Permissions;

  if (permissions.dispatch || permissions.payments) {
    permissions.orders = true;
  }

  if (!permissions.orders) {
    permissions.dispatch = false;
    permissions.payments = false;
  }

  return permissions;
}

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return authorization.replace(/^Bearer\s+/i, "").trim();
}

async function requireStoreOwner(request: NextRequest, retailerId: string) {
  const admin = adminClient();
  const token = bearerToken(request);

  if (!token) {
    throw new Error("Retailer login required.");
  }

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  const user = userData.user;

  if (userError || !user?.id) {
    throw new Error("Retailer session is invalid or expired.");
  }

  const { data: retailer, error: retailerError } = await admin
    .from("retailers")
    .select("id,email,account_restricted")
    .eq("id", retailerId)
    .maybeSingle();

  if (retailerError) throw new Error(retailerError.message);
  if (!retailer?.id) throw new Error("Darik retailer was not found.");
  if (retailer.account_restricted === true) {
    throw new Error("This retailer account is currently restricted.");
  }

  const emailOwner =
    Boolean(retailer.email) &&
    Boolean(user.email) &&
    String(retailer.email).trim().toLowerCase() === String(user.email).trim().toLowerCase();

  let membershipOwner = false;
  if (!emailOwner) {
    const { data: membership, error: membershipError } = await admin
      .from("retailer_store_members")
      .select("id")
      .eq("retailer_id", retailerId)
      .eq("auth_user_id", user.id)
      .eq("role", "owner")
      .eq("member_status", "active")
      .maybeSingle();

    if (membershipError) throw new Error(membershipError.message);
    membershipOwner = Boolean(membership?.id);
  }

  if (!emailOwner && !membershipOwner) {
    throw new Error("Only the store owner can manage staff users.");
  }

  return { admin, user };
}

async function readBody(request: NextRequest): Promise<StaffRequestBody> {
  const length = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(length) && length > 16_384) {
    throw new Error("Request is too large.");
  }

  const body = (await request.json().catch(() => null)) as StaffRequestBody | null;
  if (!body || typeof body !== "object") {
    throw new Error("Invalid staff request.");
  }
  return body;
}

function validateRetailerId(value: unknown) {
  const retailerId = text(value, 80);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(retailerId)) {
    throw new Error("Invalid retailer ID.");
  }
  return retailerId;
}

function validateMemberId(value: unknown) {
  const memberId = text(value, 80);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(memberId)) {
    throw new Error("Invalid staff member ID.");
  }
  return memberId;
}

function statusForMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("login") || lower.includes("session")) return 401;
  if (lower.includes("only the store owner") || lower.includes("restricted")) return 403;
  if (lower.includes("maximum of 3") || lower.includes("already has a darik account")) return 409;
  if (lower.includes("not found")) return 404;
  return 400;
}

export async function POST(request: NextRequest) {
  let createdAuthUserId: string | null = null;

  try {
    const body = await readBody(request);
    const retailerId = validateRetailerId(body.retailer_id);
    const { admin, user } = await requireStoreOwner(request, retailerId);

    const displayName = text(body.display_name, 120);
    const email = normalizeEmail(body.email);
    const password = String(body.password ?? "");
    const permissions = normalizePermissions(body.permissions);

    if (displayName.length < 2) throw new Error("Enter the staff user's name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid staff email address.");
    if (password.length < 8 || password.length > 128) {
      throw new Error("Temporary staff password must be 8 to 128 characters.");
    }

    const { count, error: countError } = await admin
      .from("retailer_store_members")
      .select("id", { count: "exact", head: true })
      .eq("retailer_id", retailerId)
      .eq("role", "staff")
      .in("member_status", ["invited", "active"]);

    if (countError) throw new Error(countError.message);
    if ((count ?? 0) >= 3) {
      throw new Error("This Darik store already has the maximum of 3 staff users.");
    }

    // A previously removed Darik-created staff account for this same store can be reactivated.
    const { data: removedMembership, error: removedError } = await admin
      .from("retailer_store_members")
      .select("id,auth_user_id,email_snapshot,member_status,role")
      .eq("retailer_id", retailerId)
      .eq("role", "staff")
      .eq("member_status", "removed")
      .ilike("email_snapshot", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (removedError) throw new Error(removedError.message);

    if (removedMembership?.id && removedMembership.auth_user_id) {
      const { data: existingAuth, error: existingAuthError } = await admin.auth.admin.getUserById(
        removedMembership.auth_user_id,
      );
      if (existingAuthError) throw new Error(existingAuthError.message);

      const metadata = (existingAuth.user?.user_metadata || {}) as Record<string, unknown>;
      if (
        metadata.darik_direct_staff !== true ||
        String(metadata.darik_direct_retailer_id || "") !== retailerId
      ) {
        throw new Error("This email already has a Darik account. Use a different staff email.");
      }

      const { error: passwordError } = await admin.auth.admin.updateUserById(
        removedMembership.auth_user_id,
        {
          password,
          user_metadata: {
            ...metadata,
            darik_direct_staff: true,
            darik_direct_retailer_id: retailerId,
          },
        },
      );
      if (passwordError) throw new Error(passwordError.message);

      const { error: reactivateError } = await admin
        .from("retailer_store_members")
        .update({
          member_status: "active",
          display_name: displayName,
          email_snapshot: email,
          invited_by_auth_user_id: user.id,
          permissions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", removedMembership.id)
        .eq("retailer_id", retailerId)
        .eq("role", "staff");

      if (reactivateError) throw new Error(reactivateError.message);

      return json({
        ok: true,
        message: "Staff user reactivated.",
        member_id: removedMembership.id,
      });
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        darik_direct_staff: true,
        darik_direct_retailer_id: retailerId,
      },
    });

    if (createError || !created.user?.id) {
      const message = String(createError?.message || "Could not create staff login.");
      if (/already|registered|exists|duplicate/i.test(message)) {
        throw new Error("This email already has a Darik account. Use a different staff email.");
      }
      throw new Error(message);
    }

    createdAuthUserId = created.user.id;

    const { data: membership, error: membershipError } = await admin
      .from("retailer_store_members")
      .insert({
        retailer_id: retailerId,
        auth_user_id: created.user.id,
        role: "staff",
        member_status: "active",
        display_name: displayName,
        email_snapshot: email,
        invited_by_auth_user_id: user.id,
        permissions,
      })
      .select("id")
      .single();

    if (membershipError || !membership?.id) {
      await admin.auth.admin.deleteUser(created.user.id).catch(() => undefined);
      createdAuthUserId = null;
      throw new Error(membershipError?.message || "Could not attach staff login to this store.");
    }

    createdAuthUserId = null;
    return json({ ok: true, message: "Staff user created.", member_id: membership.id }, 201);
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Could not create staff user.";

    if (createdAuthUserId) {
      try {
        const admin = adminClient();
        await admin.auth.admin.deleteUser(createdAuthUserId);
      } catch {
        // Best-effort rollback only. The membership insert never succeeded.
      }
    }

    return json({ ok: false, message }, statusForMessage(message));
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await readBody(request);
    const retailerId = validateRetailerId(body.retailer_id);
    const memberId = validateMemberId(body.member_id);
    const { admin } = await requireStoreOwner(request, retailerId);

    const { data: member, error: memberError } = await admin
      .from("retailer_store_members")
      .select("id,auth_user_id,role,member_status")
      .eq("id", memberId)
      .eq("retailer_id", retailerId)
      .eq("role", "staff")
      .neq("member_status", "removed")
      .maybeSingle();

    if (memberError) throw new Error(memberError.message);
    if (!member?.id) throw new Error("Staff user was not found.");

    const update: Record<string, unknown> = {
      permissions: normalizePermissions(body.permissions),
      updated_at: new Date().toISOString(),
    };

    if (body.display_name !== undefined) {
      const displayName = text(body.display_name, 120);
      if (displayName.length < 2) throw new Error("Enter the staff user's name.");
      update.display_name = displayName;
    }

    const { error: updateError } = await admin
      .from("retailer_store_members")
      .update(update)
      .eq("id", memberId)
      .eq("retailer_id", retailerId)
      .eq("role", "staff");

    if (updateError) throw new Error(updateError.message);

    if (body.password !== undefined) {
      const password = String(body.password ?? "");
      if (password.length < 8 || password.length > 128) {
        throw new Error("Staff password must be 8 to 128 characters.");
      }
      const { error: passwordError } = await admin.auth.admin.updateUserById(member.auth_user_id, {
        password,
      });
      if (passwordError) throw new Error(passwordError.message);
    }

    return json({ ok: true, message: "Staff permissions updated." });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Could not update staff user.";
    return json({ ok: false, message }, statusForMessage(message));
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await readBody(request);
    const retailerId = validateRetailerId(body.retailer_id);
    const memberId = validateMemberId(body.member_id);
    const { admin } = await requireStoreOwner(request, retailerId);

    const { data: member, error: memberError } = await admin
      .from("retailer_store_members")
      .select("id")
      .eq("id", memberId)
      .eq("retailer_id", retailerId)
      .eq("role", "staff")
      .neq("member_status", "removed")
      .maybeSingle();

    if (memberError) throw new Error(memberError.message);
    if (!member?.id) throw new Error("Staff user was not found.");

    const { error: removeError } = await admin
      .from("retailer_store_members")
      .update({
        member_status: "removed",
        permissions: {},
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId)
      .eq("retailer_id", retailerId)
      .eq("role", "staff");

    if (removeError) throw new Error(removeError.message);

    return json({ ok: true, message: "Staff access removed." });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Could not remove staff user.";
    return json({ ok: false, message }, statusForMessage(message));
  }
}
