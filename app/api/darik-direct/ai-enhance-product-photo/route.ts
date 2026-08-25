// DARIK_REAL_AI_CREDIT_ENFORCEMENT_304
// DARIK_GROK_AI_PRODUCT_PHOTO_BACKEND_231
// DARIK_GROK_AI_STANDARD_IMAGE_MODEL_232
// DARIK_GROK_TIMEOUT_CATALOG_STYLE_233
// DARIK_GROK_STRICT_PROPORTIONS_234
// DARIK_GROK_DYNAMIC_FRAMING_235
// DARIK_GROK_PREPAD_SQUARE_236
// DARIK_GROK_LIVE_SQUARE_ACTUAL_CROP_237
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const XAI_IMAGE_EDIT_ENDPOINT = "https://api.x.ai/v1/images/edits";
const XAI_IMAGE_MODEL = "grok-imagine-image";
const PRODUCT_BUCKET = "darik-direct-products";
const SOURCE_STAGE_PREFIX = "ai-source-square";
const SOURCE_FETCH_TIMEOUT_MS = 25_000;
const XAI_TIMEOUT_MS = 145_000;
const OUTPUT_TIMEOUT_MS = 25_000;
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 15 * 1024 * 1024;
const PREPAD_BACKGROUND = { r: 248, g: 248, b: 246, alpha: 1 };

const ENHANCEMENT_PROMPT = [
  "Create a premium ecommerce studio product image from this exact source product photo.",
  "The provided source image is already the retailer-selected square composition. Preserve that crop and make the product feel confidently sized within it without changing its proportions.",
  "STRICT PRODUCT PRESERVATION: keep the exact same product identity, packaging, container type, visible condition, logos, brand marks, printed wording and spelling, labels, colors, quantity, and physical details.",
  "Preserve the exact physical form, size, dimensions, proportions, scale, silhouette, and height-to-width ratio of the product exactly as shown in the source.",
  "Never squash, stretch, compress, widen, slim, fatten, shorten, lengthen, round, straighten, or otherwise distort the product in order to make it fit the square frame.",
  "Do not make the product more symmetrical, more perfect, or more idealized than the source. Preserve the real shape exactly.",
  "Preserve the exact edges, curves, corners, lid shape, cap shape, trigger shape, base shape, and overall container structure.",
  "For cans, bottles, jars, boxes, pouches, trigger bottles, and similar packages, preserve the exact original proportions and structure. Do not reinterpret the form factor.",
  "FRAMING RULE: the square canvas must adapt to the product; the product must never adapt its shape to the square canvas.",
  "If the product is tall or narrow, keep extra empty background above, below, and/or beside it so the whole product fits naturally at its original proportions.",
  "If the product is wide, keep extra empty background on the left and right so the whole product fits naturally at its original proportions.",
  "Use the available square efficiently: keep the full product visible, preserve its exact proportions, and aim for the product plus intentional foreground props to occupy roughly 82 to 90 percent of the dominant canvas dimension when that can be done without cropping.",
  "Do not crop the top, bottom, trigger, cap, corners, edges, or any other part of the product. The complete original silhouette must remain visible.",
  "Do not invent, remove, replace, rewrite, stylize, or redesign any part of the product, packaging, logo, label, or printed text.",
  "If any printed text cannot be reproduced safely and exactly, keep that printed area visually unchanged from the source rather than inventing or correcting text.",
  "PHOTO IMPROVEMENT ONLY: improve lighting, exposure, white balance, clarity, sharpness, background cleanliness, and realistic soft contact shadows.",
  "COMPOSITION: use a square 1:1 catalog image with a very light gray or near-white studio background. Center the product naturally without forcing it to fill the canvas.",
  "If the source contains exactly one product item, output exactly one product item only. Do not duplicate, add, remove, or merge product pieces.",
  "If the source clearly communicates a flavor or ingredient such as fruit, coffee, flowers, spices, or ice, you may add a small tasteful arrangement of only those clearly supported ingredients along the lower foreground. Do not guess ingredients that are not evident from the source.",
  "Optional top-left logo is allowed only if it exactly matches the brand visible in the source. If exact reproduction is uncertain, leave that area empty.",
  "No people, hands, unrelated props, extra marketing copy, badges, watermarks, or invented accessories.",
  "The finished result should look like a professional catalog photo while remaining an accurate representation of the original product with unchanged physical proportions, shape, and scale.",
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
    cost_in_usd_tickets?: unknown;
  };
  error?: unknown;
};

type FramedSourceResult = {
  bytes: Uint8Array;
  mime: string;
};

function json(payload: Record<string, unknown>, status = 200) {
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

async function fetchImageBytes(url: string, timeoutMs: number, maxBytes: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Image download failed (${response.status}).`);
    }

    const contentLength = Number(response.headers.get("content-length") || "0");
    if (contentLength > maxBytes) {
      throw new Error("Image is too large.");
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength === 0) {
      throw new Error("Image was empty.");
    }
    if (bytes.byteLength > maxBytes) {
      throw new Error("Image is too large.");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    return { bytes, contentType };
  } finally {
    clearTimeout(timeout);
  }
}

async function frameSourceToSquare(imageUrl: string): Promise<FramedSourceResult> {
  const { bytes } = await fetchImageBytes(
    imageUrl,
    SOURCE_FETCH_TIMEOUT_MS,
    MAX_SOURCE_BYTES,
  );

  // APP 040 shows the retailer a centered live square while composing.
  // Use that same centered square as the REAL source crop. Cropping changes
  // canvas boundaries only; it never changes X/Y scale or product proportions.
  const orientedBytes = await sharp(bytes, { failOn: "none" })
    .rotate()
    .png()
    .toBuffer();

  const oriented = sharp(orientedBytes, { failOn: "none" });
  const metadata = await oriented.metadata();
  const width = Number(metadata.width || 0);
  const height = Number(metadata.height || 0);

  if (!width || !height) {
    throw new Error("Could not read source image dimensions.");
  }

  const side = Math.min(width, height);
  const left = Math.max(0, Math.round((width - side) / 2));
  const top = Math.max(0, Math.round((height - side) / 2));
  const outputSize = Math.max(1400, Math.min(2200, side));

  const framedBuffer = await oriented
    .extract({
      left,
      top,
      width: side,
      height: side,
    })
    .resize(outputSize, outputSize, {
      fit: "fill",
    })
    .png()
    .toBuffer();

  return {
    bytes: new Uint8Array(framedBuffer),
    mime: "image/png",
  };
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";
  const xaiApiKey = process.env.XAI_API_KEY || "";

  const logStage = (stage: string, extra?: unknown) => {
    const elapsed = Date.now() - startedAt;
    if (typeof extra === "undefined") {
      console.log(`[DARIK AI 236] ${stage} (${elapsed}ms)`);
    } else {
      console.log(`[DARIK AI 236] ${stage} (${elapsed}ms)`, extra);
    }
  };

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Darik AI 236 is missing Supabase server environment variables.",
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
    console.error("Darik AI 236 is missing XAI_API_KEY.");
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

  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
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
    console.error("Darik AI 236 retailer lookup failed:", retailerError.message);
    return json({ ok: false, error: "Could not verify this Darik store." }, 500);
  }

  if (!retailer?.id) {
    return json({ ok: false, error: "Darik retailer was not found." }, 404);
  }

  if (retailer.account_restricted === true) {
    return json(
      { ok: false, error: "This Darik account is currently restricted." },
      403,
    );
  }

  if (text(retailer.email, 320).toLowerCase() !== text(authUser.email, 320).toLowerCase()) {
    return json(
      {
        ok: false,
        error: "The signed-in retailer does not match this Darik store.",
      },
      403,
    );
  }

  logStage("request accepted");

  let stagedSquareUrl = "";
  try {
    logStage("source pre-pad start");
    const framed = await frameSourceToSquare(imageUrl);
    const stagePath = `${retailerId}/${SOURCE_STAGE_PREFIX}/${Date.now()}-${crypto.randomUUID()}.png`;

    const stageUpload = await admin.storage
      .from(PRODUCT_BUCKET)
      .upload(stagePath, framed.bytes, {
        cacheControl: "3600",
        contentType: framed.mime,
        upsert: false,
      });

    if (stageUpload.error) {
      throw new Error(stageUpload.error.message);
    }

    stagedSquareUrl = admin.storage
      .from(PRODUCT_BUCKET)
      .getPublicUrl(stageUpload.data.path).data.publicUrl;

    if (!stagedSquareUrl) {
      throw new Error("Could not create the framed source image URL.");
    }

    logStage("source pre-pad complete", stagedSquareUrl);
  } catch (error) {
    console.error(
      "Darik AI 236 could not pre-frame the source image:",
      safeMessage(error),
    );
    return json(
      {
        ok: false,
        error:
          "The source photo could not be prepared for enhancement. Your original photo is safe.",
      },
      502,
    );
  }

  // DARIK_REAL_AI_CREDIT_ENFORCEMENT_304
  const creditReference304 = crypto.randomUUID();

  const creditSpend304 = await admin.rpc(
    "darik_ai_credit_spend_v1",
    {
      p_retailer_id: retailerId,
      p_reference: creditReference304,
      p_amount: 1,
    },
  );

  if (creditSpend304.error) {
    console.error(
      "Darik AI credit spend 304 failed:",
      creditSpend304.error.message,
    );

    return json(
      {
        ok: false,
        error: "Could not verify AI credit balance.",
      },
      500,
    );
  }

  const creditRow304 =
    Array.isArray(creditSpend304.data) &&
    creditSpend304.data.length > 0
      ? (creditSpend304.data[0] as {
          ok?: unknown;
          remaining?: unknown;
          error_code?: unknown;
        })
      : null;

  const creditOk304 = creditRow304?.ok === true;
  let creditRemaining304 = Number(
    creditRow304?.remaining ?? 0,
  );

  if (!creditOk304) {
    return json(
      {
        ok: false,
        error:
          "You do not have enough AI credits. Buy more credits to continue.",
        error_code:
          String(
            creditRow304?.error_code ||
              "insufficient_credits",
          ),
        credits: {
          mode: "metered",
          remaining: creditRemaining304,
          cost: 1,
          packs: [
            {
              key: "credits_500",
              credits: 500,
              price_jod: 20,
            },
            {
              key: "credits_1000",
              credits: 1000,
              price_jod: 35,
            },
            {
              key: "credits_2000",
              credits: 2000,
              price_jod: 50,
            },
          ],
        },
      },
      402,
    );
  }

  let creditFinalized304 = false;
  let creditRefunded304 = false;

  const refundCredit304 = async () => {
    if (
      creditFinalized304 ||
      creditRefunded304
    ) {
      return;
    }

    creditRefunded304 = true;

    const refund304 = await admin.rpc(
      "darik_ai_credit_refund_v1",
      {
        p_retailer_id: retailerId,
        p_reference: creditReference304,
        p_amount: 1,
      },
    );

    if (refund304.error) {
      console.error(
        "Darik AI credit refund 304 failed:",
        refund304.error.message,
      );
      return;
    }

    if (
      Array.isArray(refund304.data) &&
      refund304.data.length > 0
    ) {
      creditRemaining304 = Number(
        refund304.data[0]?.remaining ??
          creditRemaining304,
      );
    }
  };

  const failWithRefund304 = async (
    payload304: Record<string, unknown>,
    status304 = 500,
  ) => {
    await refundCredit304();

    return await failWithRefund304(
      {
        ...payload304,
        credits: {
          mode: "metered",
          remaining: creditRemaining304,
          cost: 1,
        },
      },
      status304,
    );
  };

  let xaiResponse: Response;
  let xaiPayload: XaiEditResponse = {};
  const xaiController = new AbortController();
  const xaiTimeout = setTimeout(() => xaiController.abort(), XAI_TIMEOUT_MS);

  try {
    logStage("xAI request start");
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
          url: stagedSquareUrl,
          type: "image_url",
        },
        aspect_ratio: "1:1",
        response_format: "url",
      }),
      signal: xaiController.signal,
      cache: "no-store",
    });

    xaiPayload = (await xaiResponse.json().catch(() => ({}))) as XaiEditResponse;
    logStage("xAI request complete", { status: xaiResponse.status });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error(
      "Darik AI 236 xAI request failed:",
      timedOut ? "timeout" : safeMessage(error),
    );
    return await failWithRefund304(
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
      "Darik AI 236 xAI rejected request:",
      xaiResponse.status,
      safeMessage(xaiPayload.error),
    );
    return await failWithRefund304(
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
    console.error("Darik AI 236 xAI response did not include an image URL.");
    return await failWithRefund304(
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
    return await failWithRefund304(
      {
        ok: false,
        error:
          "Grok returned an invalid enhanced image. Your original photo is safe.",
      },
      502,
    );
  }

  if (generatedUrlObject.protocol !== "https:") {
    return await failWithRefund304(
      {
        ok: false,
        error:
          "Grok returned an unsupported enhanced image URL. Your original photo is safe.",
      },
      502,
    );
  }

  const outputController = new AbortController();
  const outputTimeout = setTimeout(() => outputController.abort(), OUTPUT_TIMEOUT_MS);

  try {
    logStage("enhanced output download start");
    const generatedResponse = await fetch(generatedUrl, {
      signal: outputController.signal,
      cache: "no-store",
    });

    if (!generatedResponse.ok) {
      throw new Error(`Enhanced image download failed (${generatedResponse.status}).`);
    }

    const contentLength = Number(
      generatedResponse.headers.get("content-length") || "0",
    );
    if (contentLength > MAX_OUTPUT_BYTES) {
      throw new Error("Enhanced image is too large.");
    }

    const outputBytes = new Uint8Array(await generatedResponse.arrayBuffer());
    if (outputBytes.byteLength === 0) {
      throw new Error("Enhanced image was empty.");
    }
    if (outputBytes.byteLength > MAX_OUTPUT_BYTES) {
      throw new Error("Enhanced image is too large.");
    }

    const contentType =
      generatedMime || generatedResponse.headers.get("content-type") || "image/jpeg";
    const outputType = extensionForMime(contentType);
    const outputPath = `${retailerId}/ai-enhanced/${Date.now()}-${crypto.randomUUID()}.${outputType.ext}`;

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

    logStage("enhanced output saved", enhancedUrl);

    creditFinalized304 = true;

    return json({
      ok: true,
      enhanced_url: enhancedUrl,
      staged_square_url: stagedSquareUrl,
      credits: {
        mode: "metered",
        remaining: creditRemaining304,
        cost: 1,
        label:
          String(creditRemaining304) +
          " AI credits remaining",
      },
    });
  } catch (error) {
    console.error(
      "Darik AI 236 could not persist enhanced image:",
      safeMessage(error),
    );
    return await failWithRefund304(
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
