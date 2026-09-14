/* DARIK_STOREFRONT_SHARE_JPEG_405C */
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DARIK_ORIGIN = "https://www.getdarik.com";
const WIDTH = 1200;
const HEIGHT = 630;
const TARGET_BYTES = 350 * 1024;

type ShareStore = {
  display_name?: string | null;
  display_name_ar?: string | null;
  hero_image_url?: string | null;
  logo_url?: string | null;
};

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function absoluteHttpUrl(value: unknown): string | null {
  const text = clean(value);
  if (!text) return null;

  try {
    const url = new URL(text, DARIK_ORIGIN);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchStore(slug: string): Promise<ShareStore | null> {
  const supabaseUrl = clean(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  ).replace(/\/+$/, "");

  const anonKey = clean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY
  );

  if (!supabaseUrl || !anonKey) return null;

  const select = "display_name,display_name_ar,hero_image_url,logo_url";
  const url =
    `${supabaseUrl}/rest/v1/public_retailer_storefronts` +
    `?select=${encodeURIComponent(select)}` +
    `&slug=eq.${encodeURIComponent(slug)}` +
    "&limit=1";

  try {
    const response = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const rows = (await response.json()) as ShareStore[];
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "image/jpeg,image/png,image/webp,image/avif,image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) return null;

    const contentType = clean(response.headers.get("content-type")).toLowerCase();
    if (!contentType.startsWith("image/")) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length || buffer.length > 15 * 1024 * 1024) return null;

    return buffer;
  } catch {
    return null;
  }
}

async function compressPhoto(input: Buffer): Promise<Buffer> {
  const qualities = [72, 64, 56, 48, 42, 36];

  let best: Buffer | null = null;

  for (const quality of qualities) {
    const output = await sharp(input)
      .rotate()
      .resize(WIDTH, HEIGHT, {
        fit: "cover",
        position: "centre",
        withoutEnlargement: false,
      })
      .flatten({ background: "#ffffff" })
      .jpeg({
        quality,
        progressive: true,
        mozjpeg: true,
        chromaSubsampling: "4:2:0",
      })
      .toBuffer();

    best = output;

    if (output.length <= TARGET_BYTES) {
      return output;
    }
  }

  return best as Buffer;
}

async function compressLogo(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(WIDTH, HEIGHT, {
      fit: "contain",
      position: "centre",
      background: "#ffffff",
      withoutEnlargement: true,
    })
    .flatten({ background: "#ffffff" })
    .jpeg({
      quality: 72,
      progressive: true,
      mozjpeg: true,
      chromaSubsampling: "4:2:0",
    })
    .toBuffer();
}

async function fallbackCard(name: string): Promise<Buffer> {
  const safeName = name
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const svg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f8f5ee"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="600" y="315"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="76"
        font-weight="700"
        fill="#071a38">${safeName}</text>
    </svg>
  `);

  return sharp(svg)
    .jpeg({
      quality: 75,
      progressive: true,
      mozjpeg: true,
    })
    .toBuffer();
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await context.params;
  const slug = clean(rawSlug).toLowerCase();

  const store = slug ? await fetchStore(slug) : null;

  const name =
    clean(store?.display_name) ||
    clean(store?.display_name_ar) ||
    "Darik Store";

  const heroUrl = absoluteHttpUrl(store?.hero_image_url);
  const logoUrl = absoluteHttpUrl(store?.logo_url);

  let jpeg: Buffer | null = null;
  let source: "hero" | "logo" | "fallback" = "fallback";

  if (heroUrl) {
    const hero = await fetchImage(heroUrl);
    if (hero) {
      jpeg = await compressPhoto(hero);
      source = "hero";
    }
  }

  if (!jpeg && logoUrl) {
    const logo = await fetchImage(logoUrl);
    if (logo) {
      jpeg = await compressLogo(logo);
      source = "logo";
    }
  }

  if (!jpeg) {
    jpeg = await fallbackCard(name);
  }

  return new Response(new Uint8Array(jpeg), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(jpeg.length),
      "Cache-Control":
        "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
      "X-Darik-Share-Source": source,
      "X-Darik-Share-Bytes": String(jpeg.length),
    },
  });
}
