// DARIK_AI_STOREFRONT_BANNER_GENERATOR_274
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

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

// DARIK_BANNER_CREATIVE_OVERHAUL_279
function normalizeBrandColor(value: string, fallback: string) {
  const color = value.trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function splitPromotionCopy(value: string, rtl: boolean) {
  let working = value.replace(/\s+/g, " ").trim();
  let badge = "";

  if (!rtl) {
    const onlyMatch = working.match(/\b([A-Za-z][A-Za-z.'â€™-]*(?:\s+[A-Za-z][A-Za-z.'â€™-]*){0,2})\s+only\s*$/i);
    if (onlyMatch) {
      const stopWords = new Set(["and", "or", "above", "over", "orders", "order", "for", "on", "with", "in", "at", "from", "of", "the"]);
      const tokens = onlyMatch[1].trim().split(/\s+/);
      while (tokens.length > 1 && stopWords.has(tokens[0].toLowerCase())) tokens.shift();
      if (tokens.length && !stopWords.has(tokens[0].toLowerCase())) {
        badge = `${tokens.join(" ")} only`;
        working = working.slice(0, Math.max(0, working.length - badge.length)).trim();
      }
    }
  } else {
    const arabicOnly = working.match(/([\u0600-\u06ff]+(?:\s+[\u0600-\u06ff]+){0,2})\s+ظپظ‚ط·\s*$/);
    if (arabicOnly) {
      badge = `${arabicOnly[1].trim()} ظپظ‚ط·`;
      working = working.slice(0, Math.max(0, working.length - badge.length)).trim();
    }
  }

  let headline = working;
  let detail = "";

  if (!rtl) {
    const connector = working.match(/\s+(for|with|on|when|while|if|in|at)\s+/i);
    if (connector?.index && connector.index >= 4 && connector.index <= 36) {
      headline = working.slice(0, connector.index).trim();
      detail = working.slice(connector.index).trim();
    }
  }

  if (!detail) {
    const words = working.split(/\s+/).filter(Boolean);
    if (words.length > 4 || working.length > 34) {
      let take = 0;
      let length = 0;
      for (let i = 0; i < words.length && i < 5; i += 1) {
        const next = length + (i ? 1 : 0) + words[i].length;
        if (i >= 2 && next > 30) break;
        take = i + 1;
        length = next;
      }
      take = Math.max(2, take);
      headline = words.slice(0, take).join(" ");
      detail = words.slice(take).join(" ");
    }
  }

  return {
    headline: headline || value,
    detail,
    badge,
  };
}

async function renderPangoText(args: {
  value: string;
  width: number;
  height: number;
  align: "left" | "right" | "center";
  bold?: boolean;
  color?: string;
  spacing?: number;
}) {
  const weightOpen = args.bold === false ? "" : "<b>";
  const weightClose = args.bold === false ? "" : "</b>";
  const markup = `<span foreground="${args.color || "#ffffff"}">${weightOpen}${escapeXml(args.value)}${weightClose}</span>`;

  return sharp({
    text: {
      text: markup,
      font: "sans",
      width: args.width,
      height: args.height,
      align: args.align,
      rgba: true,
      spacing: args.spacing ?? 6,
      wrap: "word-char",
    },
  })
    .png()
    .toBuffer();
}

// DARIK_BANNER_RESPONSIVE_HTML_OVERLAY_280
function promotionVisualConcept(message: string, businessType: string) {
  const lower = message.toLowerCase();
  const category = businessType || "local retail";

  if (/deliver|delivery|طھظˆطµظٹظ„|طھظˆطµظٹظ„ط©|طھظˆطµظٹظ„ظ‡/.test(lower)) {
    return `A premium ${category} order handoff and local last-mile delivery moment in Jordan: a professional courier with an unbranded delivery bag or parcel, a tasteful scooter or delivery cue, real products from the retail category, and a warm trustworthy store-to-customer feeling.`;
  }
  if (/discount|sale|off|ط®طµظ…|طھظ†ط²ظٹظ„|ط¹ط±ط¶/.test(lower)) {
    return `A premium ${category} promotional shopping scene with desirable products, energetic but elegant retail styling, and a clear sense of a limited special offer without showing any written sale signage.`;
  }
  if (/new|arrival|just in|ط¬ط¯ظٹط¯|ظˆطµظ„|طھط´ظƒظٹظ„ط©/.test(lower)) {
    return `A premium ${category} new-arrival campaign scene with freshly presented products, refined merchandising, beautiful lighting, and a sense of discovery.`;
  }
  if (/buy|free|gift|ظ‡ط¯ظٹط©|ظ…ط¬ط§ظ†ط§|ظ…ط¬ط§ظ†ط§ظ‹/.test(lower)) {
    return `A premium ${category} value-promotion scene with a tasteful product bundle or customer order, polished ecommerce advertising energy, and no written offer graphics.`;
  }

  return `A premium ${category} ecommerce campaign scene in Jordan, professionally art-directed around the retailer's current promotion with attractive products, natural human context where appropriate, polished commercial lighting, and no written promotional graphics.`;
}

function bannerPrompt(args: {
  visualConcept: string;
  businessType: string;
  heroSize: "default" | "compact";
  primary: string;
  accent: string;
  rtl: boolean;
}) {
  const copySide = args.rtl ? "RIGHT" : "LEFT";
  const subjectSide = args.rtl ? "LEFT-CENTER" : "RIGHT-CENTER";
  return [
    `Create a premium commercial campaign background for a ${args.businessType || "local retail"} storefront in Jordan.`,
    `Visual concept: ${args.visualConcept}`,
    `Brand palette reference only: primary ${args.primary || "not specified"}, accent ${args.accent || "not specified"}.`,
    "Darik will render the retailer's real logo and exact promotion text as responsive HTML on top of this image afterward.",
    "DO NOT render the retailer name, store name, logo, promotion wording, prices, numbers, letters, captions, badges, labels, watermarks, UI, or readable packaging text inside the image.",
    "Avoid storefront fascia signs, signboards, menu boards, price boards, license plates, or any surface that invites fake readable text. If an exterior is shown, crop or angle it so signage is absent or naturally out of focus.",
    "Use ONE cohesive full-bleed photographic advertising scene across the entire canvas. No split screen, no blank half, no text panel, no template mockup.",
    `Keep the main photographic subject in the ${subjectSide} safe zone, while the ${copySide} side has calm natural image detail suitable for a responsive text overlay.`,
    "Keep all essential photographic subjects inside the central 50% of the canvas so the image remains strong when a mobile storefront crops the wide image toward a square.",
    "Premium agency art direction: believable Jordan-appropriate retail environment, cinematic but realistic lighting, crisp product detail, clean depth, no clutter, no stock-photo cheesiness.",
    args.heroSize === "compact"
      ? "COMPACT HERO: simple bold composition, fewer objects, strong center-safe focal subject, excellent under a short wide mobile crop."
      : "DEFAULT HERO: rich premium composition that still survives a centered near-square mobile crop without losing the focal subject.",
    "Wide 2:1 source image. Edge-to-edge photography only.",
  ].join(" ");
}

async function makeFinalBanner(args: {
  generatedBytes: Uint8Array;
  logoBytes: Uint8Array | null;
  message: string;
  rtl: boolean;
  accent: string;
}) {
  const base = await sharp(args.generatedBytes, { failOn: "none" })
    .rotate()
    .resize(BANNER_WIDTH, BANNER_HEIGHT, { fit: "cover", position: "centre" })
    .modulate({ saturation: 1.04, brightness: 0.98 })
    .jpeg({ quality: 93, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const rtl = args.rtl;
  const accent = normalizeBrandColor(args.accent, "#38BDF8");
  const contentWidth = 980;
  const contentLeft = rtl ? BANNER_WIDTH - 150 - contentWidth : 150;
  const align: "left" | "right" = rtl ? "right" : "left";
  const copy = splitPromotionCopy(args.message, rtl);

  const overlay = Buffer.from(`
    <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="copyFade" x1="${rtl ? "100%" : "0%"}" y1="0%" x2="${rtl ? "0%" : "100%"}" y2="0%">
          <stop offset="0%" stop-color="#020617" stop-opacity="0.72"/>
          <stop offset="28%" stop-color="#020617" stop-opacity="0.52"/>
          <stop offset="52%" stop-color="#020617" stop-opacity="0.18"/>
          <stop offset="72%" stop-color="#020617" stop-opacity="0.03"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="bottomFade" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#020617" stop-opacity="0.24"/>
          <stop offset="42%" stop-color="#020617" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#copyFade)"/>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#bottomFade)"/>
      <rect x="${contentLeft}" y="340" width="150" height="12" rx="6" fill="${accent}"/>
    </svg>
  `);

  const composites = [{ input: overlay, top: 0, left: 0 }];

  const hasLogo = Boolean(args.logoBytes?.byteLength);
  if (hasLogo && args.logoBytes) {
    const plateWidth = 360;
    const plateHeight = 188;
    const plateLeft = rtl ? BANNER_WIDTH - 150 - plateWidth : 150;
    const plateTop = 92;
    const plate = Buffer.from(`
      <svg width="${plateWidth}" height="${plateHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="s" x="-20%" y="-25%" width="140%" height="150%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#000000" flood-opacity="0.24"/>
          </filter>
        </defs>
        <rect x="8" y="8" width="${plateWidth - 16}" height="${plateHeight - 16}" rx="34"
          fill="#ffffff" fill-opacity="0.96" filter="url(#s)"/>
      </svg>
    `);
    composites.push({ input: plate, top: plateTop, left: plateLeft });

    const logo = await sharp(args.logoBytes, { failOn: "none" })
      .rotate()
      .resize(286, 128, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    const logoMeta = await sharp(logo).metadata();
    const logoWidth = Number(logoMeta.width || 0);
    const logoHeight = Number(logoMeta.height || 0);
    composites.push({
      input: Buffer.from(logo),
      top: plateTop + Math.max(0, Math.round((plateHeight - logoHeight) / 2)),
      left: plateLeft + Math.max(0, Math.round((plateWidth - logoWidth) / 2)),
    });
  }

  const headlineTop = hasLogo ? 392 : 180;
  const headlineHeight = copy.detail ? 270 : 390;
  const headlineImage = await renderPangoText({
    value: copy.headline,
    width: contentWidth,
    height: headlineHeight,
    align,
    bold: true,
    spacing: 4,
  });
  composites.push({ input: Buffer.from(headlineImage), top: headlineTop, left: contentLeft });

  let nextTop = headlineTop + headlineHeight + 28;

  if (copy.detail) {
    const detailImage = await renderPangoText({
      value: copy.detail,
      width: contentWidth,
      height: 190,
      align,
      bold: false,
      color: "#F8FAFC",
      spacing: 4,
    });
    composites.push({ input: Buffer.from(detailImage), top: nextTop, left: contentLeft });
    nextTop += 218;
  }

  if (copy.badge) {
    const badgeWidth = Math.min(520, Math.max(270, 150 + copy.badge.length * 18));
    const badgeLeft = rtl ? BANNER_WIDTH - 150 - badgeWidth : 150;
    const badgeTop = Math.min(1040, nextTop + 18);
    const badgePlate = Buffer.from(`
      <svg width="${badgeWidth}" height="98" xmlns="http://www.w3.org/2000/svg">
        <rect width="${badgeWidth}" height="98" rx="49" fill="${accent}" fill-opacity="0.98"/>
      </svg>
    `);
    composites.push({ input: badgePlate, top: badgeTop, left: badgeLeft });

    const badgeText = await renderPangoText({
      value: copy.badge,
      width: badgeWidth - 44,
      height: 60,
      align: "center",
      bold: true,
      color: "#071018",
      spacing: 2,
    });
    composites.push({
      input: Buffer.from(badgeText),
      top: badgeTop + 19,
      left: badgeLeft + 22,
    });
  }

  return sharp(base)
    .composite(composites)
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
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
  const businessType = text(retailer.direct_business_type || retailer.direct_business_type_other, 120);
  const visualConcept = promotionVisualConcept(bannerText, businessType);

  const prompt = bannerPrompt({
    visualConcept,
    businessType,
    heroSize,
    primary: text(storefront.primary_color, 40),
    accent: text(storefront.accent_color, 40),
    rtl,
  });

  const xaiController = new AbortController();
  const xaiTimeout = setTimeout(() => xaiController.abort(), XAI_TIMEOUT_MS);
  let xaiResponse: Response;
  let xaiPayload: XaiImageResponse = {};

  try {
    // DARIK_279_GENERATE_BACKGROUND_FROM_SCRATCH
    // The retailer logo is composited exactly afterward. Using the logo as an
    // image-edit source was biasing the model toward awkward template/split layouts.
    const xaiBody: Record<string, unknown> = {
      model: XAI_BANNER_MODEL,
      prompt,
      aspect_ratio: "2:1",
      response_format: "url",
    };

    xaiResponse = await fetch(XAI_IMAGE_GENERATE_ENDPOINT, {
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

    // DARIK_280_BACKGROUND_ONLY_AI
    // Exact logo + promotion copy are rendered responsively by the storefront UI.
    const finalBuffer = Buffer.from(backgroundBuffer);
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
        logo_url: storefront.logo_url || null,
      },
      credits: { mode: "unlimited_testing", remaining: null, label: "Unlimited â€” Testing Mode" },
    });
  } catch (error) {
    console.error("Darik banner 274 persistence failed:", safeMessage(error));
    return json({ ok: false, error: "The banner was created but could not be saved. No AI credit was used." }, 502);
  } finally {
    clearTimeout(outputTimeout);
  }
}
