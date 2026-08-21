// DARIK_GROK_AI_PRODUCT_PHOTO_BACKEND_231
// DARIK_GROK_AI_STANDARD_IMAGE_MODEL_232
// DARIK_GROK_AI_TIMEOUT_CATALOG_STYLE_233
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const XAI_IMAGE_EDIT_ENDPOINT = "https://api.x.ai/v1/images/edits";
const XAI_IMAGE_MODEL = "grok-imagine-image";
const PRODUCT_BUCKET = "darik-direct-products";

const ENHANCEMENT_PROMPT = [
  "Create a premium ecommerce studio product image from this exact source product photo, matching the polished reference style used by top retail catalogs.",
  "STRICT PRODUCT PRESERVATION: keep the exact same product identity, packaging, bottle or container shape, logos, brand marks, printed wording and spelling, labels, colors, proportions, quantity, visible condition, and physical details.",
  "Do not invent, remove, replace, rewrite, stylize, or redesign any part of the product, packaging, logo, label, or printed text.",
  "If any printed text cannot be reproduced safely and exactly, keep that printed area visually unchanged from the source rather than inventing or correcting text.",
  "COMPOSITION: square 1:1 catalog image, very light gray or near-white studio background, main product centered and large, entire product fully visible, no cropped edges, approximately 10 to 14 percent clean breathing room around the outermost product elements.",
  "LIGHTING: clean professional commercial studio lighting, crisp natural detail, corrected exposure and white balance, realistic soft contact shadows, no harsh glare, no fake plastic look.",
  "REFERENCE-STYLE LAYOUT: when the source clearly includes a package plus a matching bottle or secondary product piece, keep the main package centered and place the matching secondary piece naturally in the front-right, without changing either item.",
  "If the source clearly communicates a flavor or ingredient such as fruit, coffee, flowers, spices, or ice, you may add a small tasteful arrangement of only those clearly supported ingredients along the lower foreground. Do not guess ingredients that are not evident from the source.",
  "If an exact brand logo is clearly readable in the source, you may place the same exact logo once in the upper-left as a clean brand mark. If exact reproduction is uncertain, leave the upper-left empty rather than inventing a logo or text.",
  "No people, hands, unrelated props, badges, extra marketing copy, watermarks, duplicate products, or invented accessories.",
  "The finished result should look like a professionally designed high-end retail product listing while remaining an accurate representation of the original product.",
].join(" ");

type EnhanceRequestBody = {
  retailer_id?: unknown;
  image_url?: unknown;
};

type XaiEditResponse = {
  data?: Array<{
    url?: unknown;
    mime_type?: unknown;
    revised_prompt?: unknown;
  }>;
  usage?: {
    cost_in_usd_ticks?: unknown;
  };
  error?: unknown;
};

function json(
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

function text(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  return authorization.replace(/^Bearer\s+/i, "").trim();
}

function safeMessage(value: unknown) {
  if (typeof value === "string") return value.slice(0, 500);
  if (
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  ) {
    return String((value as { message: string }).message).slice(0, 500);
  }
  return "";
}

function extensionForMime(mimeType: string) {
  const clean = mimeType.toLowerCase().split(";")[0].trim();
  if (clean === "image/png") return { ext: "png", mime: "image/png" };
  if (clean === "image/webp") return { ext: "webp", mime: "image/webp" };
  return { ext: "jpg", mime: "image/jpeg" };
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";
  const xaiApiKey = process.env.XAI_API_KEY || "";

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Darik AI 231 is missing Supabase server environment variables.",
    );
    return json(
      {
        ok: false,
        error: "Darik AI photo enhancement is temporarily unavailable.",
      },
      503,
    );
  }

  if (!xaiApiKey) {
    console.error("Darik AI 231 is missing XAI_API_KEY.");
    return json(
      {
        ok: false,
        error:
          "AI photo enhancement is not configured yet. Add XAI_API_KEY to the Darik server environment.",
      },
      503,
    );
  }

  let body: EnhanceRequestBody;
  try {
    body = (await request.json()) as EnhanceRequestBody;
  } catch {
    return json({ ok: false, error: "Invalid AI enhancement request." }, 400);
  }

  const retailerId = text(body.retailer_id, 80);
  const imageUrl = text(body.image_url, 3000);

  if (!validUuid(retailerId)) {
    return json({ ok: false, error: "Invalid Darik retailer." }, 400);
  }

  if (!imageUrl) {
    return json({ ok: false, error: "Source product photo is required." }, 400);
  }

  const accessToken = bearerToken(request);
  if (!accessToken) {
    return json({ ok: false, error: "Retailer login required." }, 401);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data: userData, error: userError } =
    await admin.auth.getUser(accessToken);
  const authUser = userData.user;

  if (userError || !authUser?.id) {
    return json(
      { ok: false, error: "Retailer session is invalid or expired." },
      401,
    );
  }

  const { data: retailer, error: retailerError } = await admin
    .from("retailers")
    .select("id,email,account_restricted")
    .eq("id", retailerId)
    .maybeSingle();

  if (retailerError) {
    console.error("Darik AI 231 retailer lookup failed:", retailerError.message);
    return json({ ok: false, error: "Could not verify this Darik store." }, 500);
  }

  if (!retailer?.id) {
    return json({ ok: false, error: "Darik retailer was not found." }, 404);
  }

  if (retailer.account_restricted === true) {
    return json(
      { ok: false, error: "This retailer account is currently restricted." },
      403,
    );
  }

  const [membershipResult, usernameOwnerResult] = await Promise.all([
    admin
      .from("retailer_store_members")
      .select("id,member_status")
      .eq("auth_user_id", authUser.id)
      .eq("retailer_id", retailerId)
      .eq("member_status", "active")
      .limit(1)
      .maybeSingle(),
    admin
      .from("darik_direct_username_accounts")
      .select("auth_user_id,retailer_id")
      .eq("auth_user_id", authUser.id)
      .eq("retailer_id", retailerId)
      .limit(1)
      .maybeSingle(),
  ]);

  if (membershipResult.error) {
    console.error(
      "Darik AI 231 membership lookup failed:",
      membershipResult.error.message,
    );
  }
  if (usernameOwnerResult.error) {
    console.error(
      "Darik AI 231 username owner lookup failed:",
      usernameOwnerResult.error.message,
    );
  }

  const emailOwner =
    Boolean(retailer.email) &&
    Boolean(authUser.email) &&
    String(retailer.email).trim().toLowerCase() ===
      String(authUser.email).trim().toLowerCase();

  const authorized =
    emailOwner ||
    Boolean(membershipResult.data?.id) ||
    Boolean(usernameOwnerResult.data?.auth_user_id);

  if (!authorized) {
    return json(
      { ok: false, error: "You do not have access to this Darik store." },
      403,
    );
  }

  let sourceUrl: URL;
  let supabaseOrigin: URL;
  try {
    sourceUrl = new URL(imageUrl);
    supabaseOrigin = new URL(supabaseUrl);
  } catch {
    return json({ ok: false, error: "Invalid source product photo URL." }, 400);
  }

  const expectedPathPrefix =
    `/storage/v1/object/public/${PRODUCT_BUCKET}/${retailerId}/`;

  if (
    sourceUrl.protocol !== "https:" ||
    sourceUrl.origin !== supabaseOrigin.origin ||
    !sourceUrl.pathname.startsWith(expectedPathPrefix)
  ) {
    return json(
      {
        ok: false,
        error:
          "AI enhancement only accepts photos uploaded by this Darik retailer.",
      },
      400,
    );
  }

  const xaiStartedAt = Date.now();
  console.info("Darik AI 233 starting xAI image edit", {
    retailerId,
    model: XAI_IMAGE_MODEL,
  });
  const xaiController = new AbortController();
  const xaiTimeout = setTimeout(() => xaiController.abort(), 145_000);

  let xaiResponse: Response;
  let xaiPayload: XaiEditResponse;

  try {
    xaiResponse = await fetch(XAI_IMAGE_EDIT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${xaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: XAI_IMAGE_MODEL,
        prompt: ENHANCEMENT_PROMPT,
        image: {
          url: imageUrl,
          type: "image_url",
        },
        aspect_ratio: "1:1",
        response_format: "url",
      }),
      signal: xaiController.signal,
      cache: "no-store",
    });

    xaiPayload = (await xaiResponse.json().catch(() => ({}))) as XaiEditResponse;
    console.info("Darik AI 233 xAI image edit returned", {
      status: xaiResponse.status,
      elapsedMs: Date.now() - xaiStartedAt,
    });
  } catch (error) {
    const timedOut =
      error instanceof Error && error.name === "AbortError";
    console.error(
      "Darik AI 231 xAI request failed:",
      timedOut ? "timeout" : safeMessage(error),
    );
    return json(
      {
        ok: false,
        error: timedOut
          ? "AI enhancement took too long. Your original photo is safe."
          : "AI enhancement could not be completed. Your original photo is safe.",
      },
      502,
    );
  } finally {
    clearTimeout(xaiTimeout);
  }

  if (!xaiResponse.ok) {
    console.error(
      "Darik AI 231 xAI rejected request:",
      xaiResponse.status,
      safeMessage(xaiPayload.error),
    );
    return json(
      {
        ok: false,
        error:
          "Grok could not enhance this photo. Your original photo is still available.",
      },
      502,
    );
  }

  const generatedUrl = text(xaiPayload.data?.[0]?.url, 3000);
  const generatedMime = text(xaiPayload.data?.[0]?.mime_type, 100);

  if (!generatedUrl) {
    console.error("Darik AI 231 xAI response did not include an image URL.");
    return json(
      {
        ok: false,
        error:
          "Grok returned no enhanced image. Your original photo is still available.",
      },
      502,
    );
  }

  let generatedUrlObject: URL;
  try {
    generatedUrlObject = new URL(generatedUrl);
  } catch {
    return json(
      {
        ok: false,
        error:
          "Grok returned an invalid enhanced image. Your original photo is safe.",
      },
      502,
    );
  }

  if (generatedUrlObject.protocol !== "https:") {
    return json(
      {
        ok: false,
        error:
          "Grok returned an unsupported enhanced image URL. Your original photo is safe.",
      },
      502,
    );
  }

  const outputController = new AbortController();
  const outputTimeout = setTimeout(() => outputController.abort(), 25_000);

  try {
    const generatedResponse = await fetch(generatedUrl, {
      signal: outputController.signal,
      cache: "no-store",
    });

    if (!generatedResponse.ok) {
      throw new Error(
        `Enhanced image download failed (${generatedResponse.status}).`,
      );
    }

    const contentLength = Number(
      generatedResponse.headers.get("content-length") || "0",
    );
    if (contentLength > 15 * 1024 * 1024) {
      throw new Error("Enhanced image is too large.");
    }

    const outputBytes = new Uint8Array(await generatedResponse.arrayBuffer());
    if (outputBytes.byteLength === 0) {
      throw new Error("Enhanced image was empty.");
    }
    if (outputBytes.byteLength > 15 * 1024 * 1024) {
      throw new Error("Enhanced image is too large.");
    }

    const contentType =
      generatedMime ||
      generatedResponse.headers.get("content-type") ||
      "image/jpeg";
    const outputType = extensionForMime(contentType);
    const outputPath =
      `${retailerId}/ai-enhanced/${Date.now()}-${crypto.randomUUID()}.${outputType.ext}`;

    const uploadResult = await admin.storage
      .from(PRODUCT_BUCKET)
      .upload(outputPath, outputBytes, {
        cacheControl: "31536000",
        contentType: outputType.mime,
        upsert: false,
      });

    if (uploadResult.error) {
      throw new Error(uploadResult.error.message);
    }

    const enhancedUrl = admin.storage
      .from(PRODUCT_BUCKET)
      .getPublicUrl(uploadResult.data.path).data.publicUrl;

    if (!enhancedUrl) {
      throw new Error("Could not create the enhanced Darik image URL.");
    }

    console.info("Darik AI 233 enhancement saved", {
      elapsedMs: Date.now() - xaiStartedAt,
      retailerId,
    });

    return json({
      ok: true,
      enhanced_url: enhancedUrl,
      credits: {
        mode: "unlimited_testing",
        remaining: null,
        label: "Unlimited — Testing Mode",
      },
    });
  } catch (error) {
    console.error(
      "Darik AI 231 could not persist enhanced image:",
      safeMessage(error),
    );
    return json(
      {
        ok: false,
        error:
          "The enhanced photo could not be saved. Your original photo is safe.",
      },
      502,
    );
  } finally {
    clearTimeout(outputTimeout);
  }
}
