// DARIK_AI_STOREFRONT_BANNER_GENERATOR_274
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const XAI_IMAGE_EDIT_ENDPOINT = "https://api.x.ai/v1/images/edits";
const XAI_IMAGE_GENERATE_ENDPOINT = "https://api.x.ai/v1/images/generations";
const XAI_BANNER_MODEL = process.env.XAI_BANNER_MODEL || "grok-imagine-image";
const PRODUCT_BUCKET = "darik-direct-products";
const XAI_TIMEOUT_MS = 145_000;
const OUTPUT_TIMEOUT_MS = 25_000;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const BANNER_WIDTH = 2400;
const BANNER_HEIGHT = 1200;

type BannerRequestBody = {
  retailer_id?: unknown;
  banner_text?: unknown;
};

type XaiImageResponse = {
  data?: Array<{ url?: unknown; mime_type?: unknown }>;
  error?: unknown;
};

function json(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function text(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function bearerToken(request: NextRequest) {
  return (request.headers.get("authorization") || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function safeMessage(value: unknown) {
  if (typeof value === "string") return value.slice(0, 500);
  if (value && typeof value === "object" && "message" in value) {
    return String((value as { message?: unknown }).message ?? "").slice(0, 500);
  }
  return "";
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isArabic(value: string) {
  return /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/.test(value);
}

function wrapBannerText(value: string, maxChars: number) {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (word.length > maxChars) {
      if (current) {
        lines.push(current);
        current = "";
      }
      for (let i = 0; i < word.length; i += maxChars) {
        lines.push(word.slice(i, i + maxChars));
      }
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

async function fetchImageBytes(url: string, timeoutMs: number, maxBytes: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`Image download failed (${response.status}).`);
    const contentLength = Number(response.headers.get("content-length") || "0");
    if (contentLength > maxBytes) throw new Error("Image is too large.");
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.byteLength || bytes.byteLength > maxBytes) throw new Error("Image is invalid or too large.");
    return { bytes, contentType: response.headers.get("content-type") || "image/png" };
  } finally {
    clearTimeout(timeout);
  }
}

function bannerPrompt(args: {
  message: string;
  storeName: string;
  businessType: string;
  heroSize: "default" | "compact";
  primary: string;
  accent: string;
  rtl: boolean;
  hasLogo: boolean;
}) {
  const safeSide = args.rtl ? "RIGHT" : "LEFT";
  const visualSide = args.rtl ? "LEFT" : "RIGHT";
  return [
    `Create premium storefront promotional banner artwork for ${args.storeName || "a Darik retailer"}.`,
    `Retail category: ${args.businessType || "retail"}.`,
    `Promotion concept: ${args.message}.`,
    `Current storefront hero size: ${args.heroSize.toUpperCase()}.`,
    `Brand palette reference: primary ${args.primary || "not specified"}, accent ${args.accent || "not specified"}.`,
    args.hasLogo
      ? "The supplied image is the retailer's real logo and is provided ONLY as a brand identity/color reference. Do not redraw, duplicate, distort, or place the logo in the artwork. Darik will place the exact original logo afterward."
      : "No logo reference is available; use the store name/category and brand palette only.",
    "DO NOT render any words, letters, numbers, prices, badges, watermarks, fake logos, or marketing copy anywhere in the image.",
    `Reserve the ${safeSide} roughly 48% of the composition as a clean, low-detail safe zone for Darik to place the exact logo and exact promotion text afterward.`,
    `Keep the strongest visual interest on the ${visualSide} side so the safe zone remains readable.`,
    args.heroSize === "compact"
      ? "COMPACT HERO: keep the composition bold, simple, high-contrast, mobile-safe, and readable after aggressive responsive cropping. Avoid important details near the outer edges."
      : "DEFAULT HERO: create a richer premium retail scene while still keeping the safe text zone uncluttered and resilient to responsive cropping.",
    "Aspect ratio must feel like a wide website banner/header. Photorealistic or polished commercial illustration is acceptable depending on the store category.",
    "No people unless genuinely helpful to the category, and never place faces or critical objects in the reserved text safe zone.",
  ].join(" ");
}

async function makeFinalBanner(args: {
  generatedBytes: Uint8Array;
  logoBytes: Uint8Array | null;
  message: string;
  rtl: boolean;
}) {
  const base = await sharp(args.generatedBytes, { failOn: "none" })
    .rotate()
    .resize(BANNER_WIDTH, BANNER_HEIGHT, { fit: "cover", position: "centre" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const rtl = args.rtl;
  const gradient = Buffer.from(`
    <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="${rtl ? "100%" : "0%"}" y1="0%" x2="${rtl ? "0%" : "100%"}" y2="0%">
          <stop offset="0%" stop-color="#030712" stop-opacity="0.82"/>
          <stop offset="48%" stop-color="#030712" stop-opacity="0.56"/>
          <stop offset="72%" stop-color="#030712" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.42"/>
        </filter>
      </defs>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#g)"/>
    </svg>
  `);

  const maxChars = args.message.length <= 42 ? 25 : args.message.length <= 80 ? 30 : 34;
  const lines = wrapBannerText(args.message, maxChars);
  const fontSize = lines.length <= 2 ? 118 : lines.length === 3 ? 96 : 78;
  const lineHeight = Math.round(fontSize * 1.17);
  const startY = Math.max(470, 610 - Math.round(((lines.length - 1) * lineHeight) / 2));
  const x = rtl ? 2240 : 160;
  const anchor = rtl ? "end" : "start";
  const direction = rtl ? "rtl" : "ltr";

  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");

  const copySvg = Buffer.from(`
    <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="copyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#000000" flood-opacity="0.50"/>
        </filter>
      </defs>
      <text x="${x}" y="${startY}" text-anchor="${anchor}" direction="${direction}" unicode-bidi="plaintext"
        fill="#ffffff" font-family="Arial, DejaVu Sans, sans-serif" font-size="${fontSize}" font-weight="900"
        letter-spacing="-2" filter="url(#copyShadow)">${tspans}</text>
    </svg>
  `);

  const composites = [
    { input: gradient, top: 0, left: 0 },
  ];

  if (args.logoBytes?.byteLength) {
    const plateWidth = 330;
    const plateHeight = 190;
    const plateLeft = rtl ? BANNER_WIDTH - 160 - plateWidth : 160;
    const plateTop = 115;
    const plate = Buffer.from(`
      <svg width="${plateWidth}" height="${plateHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${plateWidth}" height="${plateHeight}" rx="34" fill="#ffffff" fill-opacity="0.96"/>
      </svg>
    `);
    composites.push({ input: plate, top: plateTop, left: plateLeft });

    const logo = await sharp(args.logoBytes, { failOn: "none" })
      .rotate()
      .resize(260, 130, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    const logoMeta = await sharp(logo).metadata();
    const logoWidth = Number(logoMeta.width || 0);
    const logoHeight = Number(logoMeta.height || 0);
    composites.push({
      // DARIK_274B_SHARP_BUFFER_TYPE_FIX
      // Sharp returns Buffer<ArrayBufferLike>; clone it so this composite array
      // keeps the concrete Buffer<ArrayBuffer> type inferred from the SVG buffers.
      input: Buffer.from(logo),
      top: plateTop + Math.max(0, Math.round((plateHeight - logoHeight) / 2)),
      left: plateLeft + Math.max(0, Math.round((plateWidth - logoWidth) / 2)),
    });
  }

  composites.push({ input: copySvg, top: 0, left: 0 });

  return sharp(base)
    .composite(composites)
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
  const xaiApiKey = process.env.XAI_API_KEY || "";

  if (!supabaseUrl || !serviceRoleKey || !xaiApiKey) {
    return json({ ok: false, error: "Darik banner generation is temporarily unavailable." }, 503);
  }

  let body: BannerRequestBody;
  try {
    body = (await request.json()) as BannerRequestBody;
  } catch {
    return json({ ok: false, error: "Invalid banner request." }, 400);
  }

  const retailerId = text(body.retailer_id, 80);
  const bannerText = text(body.banner_text, 120);
  if (!validUuid(retailerId)) return json({ ok: false, error: "Invalid Darik retailer." }, 400);
  if (bannerText.length < 3) return json({ ok: false, error: "Enter what you want the banner to say." }, 400);

  const accessToken = bearerToken(request);
  if (!accessToken) return json({ ok: false, error: "Retailer login required." }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  const authUser = userData.user;
  if (userError || !authUser?.id) return json({ ok: false, error: "Retailer session is invalid or expired." }, 401);

  const { data: retailer, error: retailerError } = await admin
    .from("retailers")
    .select("id,email,account_restricted,business_name,direct_business_type,direct_business_type_other")
    .eq("id", retailerId)
    .maybeSingle();

  if (retailerError || !retailer?.id) return json({ ok: false, error: "Could not verify this Darik store." }, retailerError ? 500 : 404);
  if (retailer.account_restricted === true) return json({ ok: false, error: "This Darik account is currently restricted." }, 403);
  if (text(retailer.email, 320).toLowerCase() !== text(authUser.email, 320).toLowerCase()) {
    return json({ ok: false, error: "Only the Darik store owner can generate storefront banners." }, 403);
  }

  const { data: storefront, error: storefrontError } = await admin
    .from("retailer_storefronts")
    .select("id,retailer_id,slug,display_name,display_name_ar,logo_url,direct_hero_size,primary_color,accent_color,background_color")
    .eq("retailer_id", retailerId)
    .maybeSingle();

  // DARIK_BANNER_STOREFRONT_LOOKUP_FIX_278
  if (storefrontError) {
    console.error("Darik banner 278 storefront lookup failed:", storefrontError.message);
    return json({ ok: false, error: "Darik could not load this storefront right now." }, 500);
  }
  if (!storefront?.id) {
    return json({ ok: false, error: "This retailer does not have a Darik storefront yet." }, 404);
  }

  const heroSize: "default" | "compact" = storefront.direct_hero_size === "compact" ? "compact" : "default";
  const rtl = isArabic(bannerText);
  const logoUrl = text(storefront.logo_url, 3000);
  let logoBytes: Uint8Array | null = null;

  if (logoUrl) {
    try {
      logoBytes = (await fetchImageBytes(logoUrl, 25_000, MAX_IMAGE_BYTES)).bytes;
    } catch (error) {
      console.warn("Darik banner 274 could not download retailer logo:", safeMessage(error));
      return json({ ok: false, error: "Your store logo could not be prepared for the banner. No AI credit was used." }, 502);
    }
  }

  const prompt = bannerPrompt({
    message: bannerText,
    storeName: text(storefront.display_name || storefront.display_name_ar || retailer.business_name, 180),
    businessType: text(retailer.direct_business_type || retailer.direct_business_type_other, 120),
    heroSize,
    primary: text(storefront.primary_color, 40),
    accent: text(storefront.accent_color, 40),
    rtl,
    hasLogo: Boolean(logoUrl),
  });

  const xaiController = new AbortController();
  const xaiTimeout = setTimeout(() => xaiController.abort(), XAI_TIMEOUT_MS);
  let xaiResponse: Response;
  let xaiPayload: XaiImageResponse = {};

  try {
    const endpoint = logoUrl ? XAI_IMAGE_EDIT_ENDPOINT : XAI_IMAGE_GENERATE_ENDPOINT;
    const xaiBody: Record<string, unknown> = {
      model: XAI_BANNER_MODEL,
      prompt,
      aspect_ratio: "2:1",
      response_format: "url",
    };
    if (logoUrl) {
      xaiBody.image = { url: logoUrl, type: "image_url" };
    }

    xaiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${xaiApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(xaiBody),
      signal: xaiController.signal,
      cache: "no-store",
    });
    xaiPayload = (await xaiResponse.json().catch(() => ({}))) as XaiImageResponse;
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return json({ ok: false, error: timedOut ? "Banner generation took too long. No AI credit was used." : "Banner generation failed. No AI credit was used." }, 502);
  } finally {
    clearTimeout(xaiTimeout);
  }

  if (!xaiResponse.ok) {
    console.error("Darik banner 274 xAI rejected request:", xaiResponse.status, safeMessage(xaiPayload.error));
    return json({ ok: false, error: "Darik AI could not create this banner. No AI credit was used." }, 502);
  }

  const generatedUrl = text(xaiPayload.data?.[0]?.url, 3000);
  if (!generatedUrl || !generatedUrl.startsWith("https://")) {
    return json({ ok: false, error: "Darik AI returned an invalid banner. No AI credit was used." }, 502);
  }

  const outputController = new AbortController();
  const outputTimeout = setTimeout(() => outputController.abort(), OUTPUT_TIMEOUT_MS);

  try {
    const generatedResponse = await fetch(generatedUrl, { signal: outputController.signal, cache: "no-store" });
    if (!generatedResponse.ok) throw new Error(`Generated banner download failed (${generatedResponse.status}).`);
    const generatedBytes = new Uint8Array(await generatedResponse.arrayBuffer());
    if (!generatedBytes.byteLength || generatedBytes.byteLength > MAX_IMAGE_BYTES) throw new Error("Generated banner is invalid or too large.");

    const backgroundBuffer = await sharp(generatedBytes, { failOn: "none" })
      .rotate()
      .resize(BANNER_WIDTH, BANNER_HEIGHT, { fit: "cover", position: "centre" })
      .jpeg({ quality: 91 })
      .toBuffer();

    const finalBuffer = await makeFinalBanner({ generatedBytes, logoBytes, message: bannerText, rtl });
    const bannerId = crypto.randomUUID();
    const timestamp = Date.now();
    const backgroundPath = `${retailerId}/ai-banners/${timestamp}-${bannerId}-background.jpg`;
    const finalPath = `${retailerId}/ai-banners/${timestamp}-${bannerId}-final.jpg`;

    const backgroundUpload = await admin.storage.from(PRODUCT_BUCKET).upload(backgroundPath, backgroundBuffer, {
      cacheControl: "31536000",
      contentType: "image/jpeg",
      upsert: false,
    });
    if (backgroundUpload.error) throw new Error(backgroundUpload.error.message);

    const finalUpload = await admin.storage.from(PRODUCT_BUCKET).upload(finalPath, finalBuffer, {
      cacheControl: "31536000",
      contentType: "image/jpeg",
      upsert: false,
    });
    if (finalUpload.error) throw new Error(finalUpload.error.message);

    const backgroundUrl = admin.storage.from(PRODUCT_BUCKET).getPublicUrl(backgroundUpload.data.path).data.publicUrl;
    const finalUrl = admin.storage.from(PRODUCT_BUCKET).getPublicUrl(finalUpload.data.path).data.publicUrl;
    if (!backgroundUrl || !finalUrl) throw new Error("Could not create public banner URLs.");

    const { data: inserted, error: insertError } = await admin
      .from("retailer_storefront_banners")
      .insert({
        id: bannerId,
        storefront_id: storefront.id,
        retailer_id: retailerId,
        banner_text: bannerText,
        ai_prompt: prompt,
        hero_size_generated_for: heroSize,
        background_image_url: backgroundUrl,
        final_banner_image_url: finalUrl,
        status: "draft",
        credits_charged: 0,
      })
      .select("id,banner_text,hero_size_generated_for,final_banner_image_url,status,created_at")
      .single();

    if (insertError || !inserted?.id) throw new Error(insertError?.message || "Could not save banner record.");

    return json({
      ok: true,
      banner: {
        id: inserted.id,
        text: inserted.banner_text,
        image_url: inserted.final_banner_image_url,
        hero_size_generated_for: inserted.hero_size_generated_for,
        status: inserted.status,
        created_at: inserted.created_at,
      },
      storefront: {
        id: storefront.id,
        slug: storefront.slug,
        hero_size: heroSize,
        display_name: storefront.display_name,
      },
      credits: { mode: "unlimited_testing", remaining: null, label: "Unlimited — Testing Mode" },
    });
  } catch (error) {
    console.error("Darik banner 274 persistence failed:", safeMessage(error));
    return json({ ok: false, error: "The banner was created but could not be saved. No AI credit was used." }, 502);
  } finally {
    clearTimeout(outputTimeout);
  }
}
