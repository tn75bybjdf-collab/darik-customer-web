/* DARIK_STOREFRONT_METADATA_405 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

const DARIK_ORIGIN = "https://www.getdarik.com";

type PublicStorefrontMetadata = {
  slug?: string | null;
  display_name?: string | null;
  display_name_ar?: string | null;
  tagline?: string | null;
  tagline_ar?: string | null;
  about_text?: string | null;
  about_text_ar?: string | null;
  hero_image_url?: string | null;
  logo_url?: string | null;
  public_status?: string | null;
};

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function truncate(value: string, max = 190): string {
  const text = clean(value);
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
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

async function fetchPublicRow(
  view: "public_retailer_storefronts" | "public_retailer_storefront_status",
  slug: string
): Promise<PublicStorefrontMetadata | null> {
  const supabaseUrl = clean(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  ).replace(/\/+$/, "");
  const anonKey = clean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY
  );
  if (!supabaseUrl || !anonKey) {
    console.warn("Darik storefront metadata: Supabase public environment is unavailable.");
    return null;
  }

  const fields = view === "public_retailer_storefronts"
    ? "slug,display_name,display_name_ar,tagline,tagline_ar,about_text,about_text_ar,hero_image_url,logo_url"
    : "slug,display_name,display_name_ar,logo_url,public_status";

  const url = `${supabaseUrl}/rest/v1/${view}?select=${encodeURIComponent(fields)}&slug=eq.${encodeURIComponent(slug)}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(`Darik storefront metadata: ${view} returned HTTP ${response.status} for ${slug}.`);
      return null;
    }

    const data = (await response.json()) as PublicStorefrontMetadata[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.warn("Darik storefront metadata lookup failed:", error);
    return null;
  }
}

async function getStorefrontMetadata(slug: string): Promise<PublicStorefrontMetadata | null> {
  const live = await fetchPublicRow("public_retailer_storefronts", slug);
  if (live) return live;
  return fetchPublicRow("public_retailer_storefront_status", slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = clean(rawSlug).toLowerCase();

  if (!slug || slug === "_darik-private-store-preview") {
    return {
      title: "Darik Marketplace",
      description: "Anything you need from local retailers, delivered by Darik.",
      robots: { index: false, follow: false },
    };
  }

  const store = await getStorefrontMetadata(slug);
  if (!store) {
    return {
      title: "Darik Marketplace",
      description: "Anything you need from local retailers, delivered by Darik.",
      alternates: { canonical: `${DARIK_ORIGIN}/${encodeURIComponent(slug)}` },
    };
  }

  const name = clean(store.display_name) || clean(store.display_name_ar) || "Darik Store";
  const description = truncate(
    clean(store.tagline) || clean(store.tagline_ar) || clean(store.about_text) || clean(store.about_text_ar) ||
      `Shop ${name} online on Darik, Jordan's local marketplace.`,
    190
  );
  const canonicalUrl = `${DARIK_ORIGIN}/${encodeURIComponent(slug)}`;
  const hero = absoluteHttpUrl(store.hero_image_url);
  const logo = absoluteHttpUrl(store.logo_url);
  // DARIK_STOREFRONT_SHARE_JPEG_405F
  // Social crawlers get a first-party compressed JPEG rather than the raw retailer upload.
  const shareSource = hero || logo;
  const shareVersion = shareSource
    ? encodeURIComponent(shareSource.split("/").pop() || "1")
    : "1";
  const shareImage = shareSource
    ? `${DARIK_ORIGIN}/api/store-share-image/${encodeURIComponent(slug)}?v=${shareVersion}`
    : null;

  return {
    title: `${name} | Darik`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "Darik",
      title: name,
      description,
      ...(shareImage ? { images: [{ url: shareImage,
                width: 1200,
                height: 630, alt: name }] } : {}),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title: name,
      description,
      ...(shareImage ? { images: [shareImage] } : {}),
    },
  };
}

export default function StorefrontMetadataLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
