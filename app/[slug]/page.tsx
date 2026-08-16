"use client";

// DARIK_REAL_PRIVATE_PREVIEW_ALIAS_143



// DARIK_FURNITURE_OPTIONAL_ITEM_VIDEO_068
// DARIK_HOME_APPLIANCES_SHORT_ITEM_VIDEO_071
// DARIK_DUAL_SIZE_PRODUCT_PHOTOS_078
// DARIK_CUSTOMER_PRODUCT_DETAIL_BEAUTY_079
// DARIK_STOREFRONT_PORTFOLIO_COMPOSITION_089
// DARIK_MECHANICS_LAB_048

// DARIK_DETAILS_MODAL_SCROLL_FIX_034

// DARIK_AUTOPARTS_FITMENT_FILTERS_033

import { useRef, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import { mechanicsFieldLabel, readMechanicsLabField } from "@/lib/darikMechanicsLab";
import styles from "./storefront.module.css";
import portfolioStyles from "./storefrontPortfolio089.module.css";
import ProductDetailExperience from "./ProductDetailExperience";

type Storefront = {
  id: string;
  retailer_id: string;
  slug: string;
  display_name: string;
  display_name_ar: string | null;
  tagline: string | null;
  tagline_ar: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  business_phone: string | null;
  whatsapp_number: string | null;
  public_email: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  address_text: string | null;
  address_text_ar: string | null;
  about_text: string | null;
  about_text_ar: string | null;
  custom_links: Array<{
    label: string;
    label_ar?: string | null;
    url: string;
  }> | null;
  custom_information: Array<{
    label: string;
    label_ar?: string | null;
    value: string;
    value_ar?: string | null;
  }> | null;
  operating_hours: Record<string, string> | null;
  operating_hours_ar: Record<string, string> | null;
  primary_color: string;
  accent_color: string;
  background_color: string;
  is_accepting_orders: boolean;
  minimum_order: number | string;
  delivery_fee: number | string;
  estimated_delivery_minutes: number | null;
  cash_on_delivery_enabled: boolean;
  cliq_enabled: boolean;
  cliq_account_name: string | null;
  cliq_payment_identifier: string | null;
  card_enabled: boolean;
  delivery_enabled: boolean | null;
  pickup_enabled: boolean;
  order_submission_mode: "phone" | "online" | "both";
  storefront_theme: "modern_market" | "boutique" | "auto_pro" | "minimal" | "premium" | "menu" | null;
  appearance_mode: "light" | "dark" | null;
  product_card_style: "standard" | "image_first" | "compact" | null;
  corner_style: "rounded" | "soft" | "square" | null;
  hero_layout: "centered" | "split" | "immersive" | null;
  section_order: Array<"categories" | "catalog" | "story"> | null;
  show_prices: boolean | null;
  show_ordering: boolean | null;
  show_phone: boolean | null;
  show_whatsapp: boolean | null;
  show_store_story: boolean | null;
  business_name: string;
  business_type: string | null;
};

type PublicStoreStatus = {
  slug: string;
  display_name: string;
  display_name_ar: string | null;
  logo_url: string | null;
  primary_color: string | null;
  accent_color: string | null;
  business_type: string | null;
  public_status: "live" | "coming_soon" | "unavailable";
};

type Product = {
  storefront_id: string;
  storefront_slug: string;
  id: string;
  retailer_id: string;
  category_id: string | null;
  direct_store_category_id: string | null;
  direct_store_category_name: string | null;
  direct_store_category_name_ar: string | null;
  direct_store_category_slug: string | null;
  subcategory_name: string | null;
  name: string;
  official_marketplace_name: string | null;
  official_marketplace_name_ar: string | null;
  brand_name: string | null;
  description: string | null;
  app_price: number | string | null;
  quantity_in_stock: number | string | null;
  direct_inventory_tracking_enabled: boolean;
  direct_availability_status: "available" | "out_of_stock" | null;
  direct_pricing_mode: "price" | "call" | "whatsapp" | "call_whatsapp" | null;
  direct_vehicle_year_from: number | string | null;
  direct_vehicle_year_to: number | string | null;
  direct_vehicle_make: string | null;
  direct_vehicle_model: string | null;
  official_product_photo_url: string | null;
  official_product_thumbnail_url: string | null;
  official_product_photo_url_2: string | null;
  direct_compare_at_price?: number | string | null;
  direct_sold_by_weight?: boolean | null;
  direct_weight_unit?: string | null;
  direct_weight_step?: number | string | null;
  direct_size_options?: Array<{ label?: string | null }> | null;
  direct_shoe_sizes?: Array<{ eu?: string | null; us?: string | null }> | null;
  storefront_featured: boolean;
  storefront_sort_order: number | string;
};

type Category = {
  id: string;
  retailer_id: string;
  storefront_id: string;
  storefront_slug: string;
  name: string;
  name_ar: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | string;
  product_count: number | string;
};

type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photoUrl: string | null;
};

type OnlineCheckoutForm = {
  customerName: string;
  customerPhone: string;
  buildingNumber: string;
  apartmentNumber: string;
  deliveryNote: string;
  paymentMethod: "cash" | "cliq";
  fulfillmentMethod: "delivery" | "pickup";
  latitude: number | null;
  longitude: number | null;
};

type IconName =
  | "arrow"
  | "bag"
  | "call"
  | "clock"
  | "close"
  | "email"
  | "facebook"
  | "globe"
  | "info"
  | "instagram"
  | "location"
  | "minus"
  | "plus"
  | "search"
  | "store"
  | "truck"
  | "whatsapp";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 8h12l1 12H5L6 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
      );
    case "call":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );
    case "email":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1Z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21" />
          <path d="M12 3c-2.4 2.5-3.6 5.5-3.6 9S9.6 18.5 12 21" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </svg>
      );
    case "location":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "minus":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );
    case "store":
      return (
        <svg {...common}>
          <path d="M4 10v10h16V10" />
          <path d="M3 4h18l-2 6H5L3 4Z" />
          <path d="M8 20v-6h8v6" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
          <path d="M9 8.5c.3 2.5 2 4.2 4.5 4.8" />
          <path d="m8.7 8.2.8-.4 1 1.7-.6.7" />
          <path d="m13.2 13.1.7-.6 1.7 1-.4.8" />
        </svg>
      );
  }
}

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

function normalizeExternalUrl(value: string | null | undefined) {
  const clean = String(value ?? "").trim();
  if (!clean) return null;

  try {
    const candidate = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function phoneHref(value: string | null | undefined) {
  const clean = String(value ?? "").trim();
  if (!clean) return null;
  const normalized = clean.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

function whatsappDigits(value: string | null | undefined) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) digits = `962${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) digits = `962${digits}`;
  return digits;
}

function whatsappHref(value: string | null | undefined) {
  const digits = whatsappDigits(value);
  return digits ? `https://wa.me/${digits}` : null;
}

function emailHref(value: string | null | undefined) {
  const clean = String(value ?? "").trim();
  return clean && clean.includes("@") ? `mailto:${clean}` : null;
}

function productName(product: Product) {
  return product.official_marketplace_name || product.name || "Product";
}

function productPhoto(product: Product) {
  return (
    product.official_product_thumbnail_url ||
    product.official_product_photo_url ||
    product.official_product_photo_url_2
  );
}

function todayHours(operatingHours: Record<string, string> | null) {
  const keys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const key = keys[new Date().getDay()];
  return String(operatingHours?.[key] ?? "").trim();
}

const AUTO_PARTS_CATEGORY_AR_BY_ENGLISH: Record<string, string> = {
  "body parts": "قطع بودي",
  lighting: "إضاءة",
  suspension: "تعليق",
  steering: "توجيه",
  brakes: "فرامل",
  "engine parts": "قطع محرك",
  "cooling system": "نظام تبريد",
  "air conditioning": "تكييف",
  "electrical parts": "قطع كهرباء",
  "filters & maintenance": "فلاتر وصيانة",
  "interior & exterior": "داخلي وخارجي",
  "used parts": "قطع مستعملة",
};

function cleanAutoPartsCategoryArabic(category: Category) {
  return (
    AUTO_PARTS_CATEGORY_AR_BY_ENGLISH[category.name.trim().toLowerCase()] ||
    category.name_ar ||
    ""
  );
}

function productVehicleFitment(product: Product) {
  const yearFrom = Number(product.direct_vehicle_year_from ?? 0);
  const yearTo = Number(product.direct_vehicle_year_to ?? 0);
  const yearLabel = yearFrom
    ? yearTo && yearTo !== yearFrom
      ? `${yearFrom}–${yearTo}`
      : String(yearFrom)
    : "";
  return [yearLabel, product.direct_vehicle_make, product.direct_vehicle_model]
    .filter(Boolean)
    .join(" ");
}

function normalizeSectionOrder(value: Storefront["section_order"]) {
  const allowed = ["categories", "catalog", "story"] as const;
  const input = Array.isArray(value) ? value : [];
  const next = input.filter(
    (item, index): item is (typeof allowed)[number] =>
      allowed.includes(item as (typeof allowed)[number]) && input.indexOf(item) === index
  );
  for (const item of allowed) if (!next.includes(item)) next.push(item);
  return next;
}


type LockedRetailFieldDesign = {
  storefrontTheme: NonNullable<Storefront["storefront_theme"]>;
  appearanceMode: NonNullable<Storefront["appearance_mode"]>;
  productCardStyle: NonNullable<Storefront["product_card_style"]>;
  cornerStyle: NonNullable<Storefront["corner_style"]>;
  heroLayout: NonNullable<Storefront["hero_layout"]>;
  sectionOrder: Array<"categories" | "catalog" | "story">;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
};

function lockedRetailFieldDesign(
  rawField: string | null | undefined
): LockedRetailFieldDesign {
  const field = String(rawField || "retail").trim().toLowerCase();

  if (field === "auto_parts") {
    return {
      storefrontTheme: "premium",
      appearanceMode: "dark",
      productCardStyle: "image_first",
      cornerStyle: "rounded",
      heroLayout: "immersive",
      sectionOrder: ["catalog", "categories", "story"],
      primaryColor: "#071426",
      accentColor: "#2F66FF",
      backgroundColor: "#061426",
    };
  }

  if (
    [
      "supermarket",
      "grocery",
      "mini_market",
      "butcher",
      "produce",
      "frozen_food",
    ].includes(field)
  ) {
    return {
      storefrontTheme: "modern_market",
      appearanceMode: "light",
      productCardStyle: "image_first",
      cornerStyle: "rounded",
      heroLayout: "immersive",
      sectionOrder: ["categories", "catalog", "story"],
      primaryColor: "#12372A",
      accentColor: "#16A34A",
      backgroundColor: "#F7FAF7",
    };
  }

  if (["restaurant", "fast_food", "bakery", "cafe"].includes(field)) {
    return {
      storefrontTheme: "menu",
      appearanceMode: "light",
      productCardStyle: "image_first",
      cornerStyle: "soft",
      heroLayout: "immersive",
      sectionOrder: ["categories", "catalog", "story"],
      primaryColor: "#431407",
      accentColor: "#EA580C",
      backgroundColor: "#FFF9F3",
    };
  }

  if (
    ["clothing", "shoes", "jewelry", "cosmetics", "perfume"].includes(field)
  ) {
    return {
      storefrontTheme: "boutique",
      appearanceMode: "light",
      productCardStyle: "image_first",
      cornerStyle: "soft",
      heroLayout: "immersive",
      sectionOrder: ["categories", "catalog", "story"],
      primaryColor: "#18111B",
      accentColor: "#A855F7",
      backgroundColor: "#FCFAFC",
    };
  }

  if (["electronics", "computers", "mobile_phones"].includes(field)) {
    return {
      storefrontTheme: "minimal",
      appearanceMode: "light",
      productCardStyle: "standard",
      cornerStyle: "soft",
      heroLayout: "split",
      sectionOrder: ["categories", "catalog", "story"],
      primaryColor: "#0F172A",
      accentColor: "#2563EB",
      backgroundColor: "#F8FAFC",
    };
  }

  if (["furniture", "home_appliances", "home_decor"].includes(field)) {
    return {
      storefrontTheme: "premium",
      appearanceMode: "light",
      productCardStyle: "image_first",
      cornerStyle: "soft",
      heroLayout: "immersive",
      sectionOrder: ["categories", "catalog", "story"],
      primaryColor: "#2B2118",
      accentColor: "#A16207",
      backgroundColor: "#FBFAF7",
    };
  }

  if (
    [
      "tires",
      "hardware",
      "building_materials",
      "electrical_supplies",
      "plumbing",
      "tools",
    ].includes(field)
  ) {
    return {
      storefrontTheme: "auto_pro",
      appearanceMode: "dark",
      productCardStyle: "compact",
      cornerStyle: "soft",
      heroLayout: "immersive",
      sectionOrder: ["categories", "catalog", "story"],
      primaryColor: "#111827",
      accentColor: "#F59E0B",
      backgroundColor: "#F8FAFC",
    };
  }

  if (field === "pharmacy") {
    return {
      storefrontTheme: "minimal",
      appearanceMode: "light",
      productCardStyle: "standard",
      cornerStyle: "soft",
      heroLayout: "split",
      sectionOrder: ["categories", "catalog", "story"],
      primaryColor: "#0F766E",
      accentColor: "#14B8A6",
      backgroundColor: "#F7FFFD",
    };
  }

  return {
    storefrontTheme: "modern_market",
    appearanceMode: "light",
    productCardStyle: "standard",
    cornerStyle: "rounded",
    heroLayout: "centered",
    sectionOrder: ["categories", "catalog", "story"],
    primaryColor: "#111827",
    accentColor: "#2563EB",
    backgroundColor: "#F8FAFC",
  };
}
type StorefrontTypographyKey =
  | "page"
  | "display_name"
  | "display_name_ar"
  | "tagline"
  | "tagline_ar";

// DARIK_TYPOGRAPHY_FONT_LIBRARY_105_V5
type StorefrontTypographyFontKey =
  | "theme"
  | "playfair"
  | "cormorant"
  | "dm_serif"
  | "bodoni_moda"
  | "prata"
  | "cinzel"
  | "marcellus"
  | "libre_baskerville"
  | "lora"
  | "eb_garamond"
  | "fraunces"
  | "spectral"
  | "crimson_pro"
  | "yeseva"
  | "abril"
  | "inter"
  | "manrope"
  | "montserrat"
  | "poppins"
  | "raleway"
  | "outfit"
  | "plus_jakarta"
  | "urbanist"
  | "space_grotesk"
  | "work_sans"
  | "nunito_sans"
  | "roboto"
  | "quicksand"
  | "josefin"
  | "sora"
  | "oswald"
  | "bebas"
  | "anton"
  | "barlow_condensed"
  | "archivo_black"
  | "league_spartan"
  | "dancing_script"
  | "great_vibes"
  | "allura"
  | "sacramento"
  | "parisienne"
  | "caveat"
  | "pacifico"
  | "cairo"
  | "tajawal"
  | "almarai"
  | "changa"
  | "el_messiri"
  | "amiri"
  | "noto_kufi_ar"
  | "noto_naskh_ar"
  | "ibm_plex_sans_ar"
  | "reem_kufi"
  | "aref_ruqaa"
  | "lateef"
  | "scheherazade_new"
  | "markazi_text"
  | "lemonada"
  | "segoe"
  | "arial"
  | "verdana"
  | "tahoma"
  | "trebuchet"
  | "georgia"
  | "times"
  | "palatino"
  | "garamond"
  | "courier"
  | "impact";

type StorefrontTypographySetting = {
  font: StorefrontTypographyFontKey;
  size: number;
};

type StorefrontTypographyState = Record<
  StorefrontTypographyKey,
  StorefrontTypographySetting
>;

const storefrontTypographyKeys: StorefrontTypographyKey[] = [
  "page",
  "display_name",
  "display_name_ar",
  "tagline",
  "tagline_ar",
];

const storefrontTypographyFontFamilies: Record<
  Exclude<StorefrontTypographyFontKey, "theme">,
  string
> = {
  playfair: '"Playfair Display", Georgia, "Times New Roman", serif',
  cormorant: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
  dm_serif: '"DM Serif Display", Georgia, "Times New Roman", serif',
  bodoni_moda: '"Bodoni Moda", Georgia, "Times New Roman", serif',
  prata: '"Prata", Georgia, "Times New Roman", serif',
  cinzel: '"Cinzel", Georgia, "Times New Roman", serif',
  marcellus: '"Marcellus", Georgia, "Times New Roman", serif',
  libre_baskerville: '"Libre Baskerville", Georgia, "Times New Roman", serif',
  lora: '"Lora", Georgia, "Times New Roman", serif',
  eb_garamond: '"EB Garamond", Georgia, "Times New Roman", serif',
  fraunces: '"Fraunces", Georgia, "Times New Roman", serif',
  spectral: '"Spectral", Georgia, "Times New Roman", serif',
  crimson_pro: '"Crimson Pro", Georgia, "Times New Roman", serif',
  yeseva: '"Yeseva One", Georgia, "Times New Roman", serif',
  abril: '"Abril Fatface", Georgia, "Times New Roman", serif',
  inter: '"Inter", "Segoe UI", Arial, sans-serif',
  manrope: '"Manrope", "Segoe UI", Arial, sans-serif',
  montserrat: '"Montserrat", "Segoe UI", Arial, sans-serif',
  poppins: '"Poppins", "Segoe UI", Arial, sans-serif',
  raleway: '"Raleway", "Segoe UI", Arial, sans-serif',
  outfit: '"Outfit", "Segoe UI", Arial, sans-serif',
  plus_jakarta: '"Plus Jakarta Sans", "Segoe UI", Arial, sans-serif',
  urbanist: '"Urbanist", "Segoe UI", Arial, sans-serif',
  space_grotesk: '"Space Grotesk", "Segoe UI", Arial, sans-serif',
  work_sans: '"Work Sans", "Segoe UI", Arial, sans-serif',
  nunito_sans: '"Nunito Sans", "Segoe UI", Arial, sans-serif',
  roboto: '"Roboto", "Segoe UI", Arial, sans-serif',
  quicksand: '"Quicksand", "Segoe UI", Arial, sans-serif',
  josefin: '"Josefin Sans", "Segoe UI", Arial, sans-serif',
  sora: '"Sora", "Segoe UI", Arial, sans-serif',
  oswald: '"Oswald", "Segoe UI", Arial, sans-serif',
  bebas: '"Bebas Neue", "Segoe UI", Arial, sans-serif',
  anton: '"Anton", "Segoe UI", Arial, sans-serif',
  barlow_condensed: '"Barlow Condensed", "Segoe UI", Arial, sans-serif',
  archivo_black: '"Archivo Black", "Segoe UI", Arial, sans-serif',
  league_spartan: '"League Spartan", "Segoe UI", Arial, sans-serif',
  dancing_script: '"Dancing Script", "Segoe Script", cursive',
  great_vibes: '"Great Vibes", "Segoe Script", cursive',
  allura: '"Allura", "Segoe Script", cursive',
  sacramento: '"Sacramento", "Segoe Script", cursive',
  parisienne: '"Parisienne", "Segoe Script", cursive',
  caveat: '"Caveat", "Segoe Script", cursive',
  pacifico: '"Pacifico", "Segoe Script", cursive',
  cairo: '"Cairo", Tahoma, Arial, sans-serif',
  tajawal: '"Tajawal", Tahoma, Arial, sans-serif',
  almarai: '"Almarai", Tahoma, Arial, sans-serif',
  changa: '"Changa", Tahoma, Arial, sans-serif',
  el_messiri: '"El Messiri", Tahoma, Arial, sans-serif',
  amiri: '"Amiri", "Times New Roman", Tahoma, serif',
  noto_kufi_ar: '"Noto Kufi Arabic", Tahoma, Arial, sans-serif',
  noto_naskh_ar: '"Noto Naskh Arabic", "Times New Roman", Tahoma, serif',
  ibm_plex_sans_ar: '"IBM Plex Sans Arabic", Tahoma, Arial, sans-serif',
  reem_kufi: '"Reem Kufi", Tahoma, Arial, sans-serif',
  aref_ruqaa: '"Aref Ruqaa", "Times New Roman", Tahoma, serif',
  lateef: '"Lateef", "Times New Roman", Tahoma, serif',
  scheherazade_new: '"Scheherazade New", "Times New Roman", Tahoma, serif',
  markazi_text: '"Markazi Text", "Times New Roman", Tahoma, serif',
  lemonada: '"Lemonada", Tahoma, Arial, sans-serif',
  segoe: '"Segoe UI", Tahoma, Arial, sans-serif',
  arial: 'Arial, "Segoe UI", Tahoma, sans-serif',
  verdana: 'Verdana, "Segoe UI", Tahoma, sans-serif',
  tahoma: 'Tahoma, "Segoe UI", Arial, sans-serif',
  trebuchet: '"Trebuchet MS", "Segoe UI", Tahoma, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  times: '"Times New Roman", Times, serif',
  palatino: '"Palatino Linotype", Palatino, "Times New Roman", serif',
  garamond: 'Garamond, Georgia, "Times New Roman", serif',
  courier: '"Courier New", Courier, monospace',
  impact: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
};

const storefrontTypographyFontKeys: StorefrontTypographyFontKey[] = [
  "theme",
  "playfair",
  "cormorant",
  "dm_serif",
  "bodoni_moda",
  "prata",
  "cinzel",
  "marcellus",
  "libre_baskerville",
  "lora",
  "eb_garamond",
  "fraunces",
  "spectral",
  "crimson_pro",
  "yeseva",
  "abril",
  "inter",
  "manrope",
  "montserrat",
  "poppins",
  "raleway",
  "outfit",
  "plus_jakarta",
  "urbanist",
  "space_grotesk",
  "work_sans",
  "nunito_sans",
  "roboto",
  "quicksand",
  "josefin",
  "sora",
  "oswald",
  "bebas",
  "anton",
  "barlow_condensed",
  "archivo_black",
  "league_spartan",
  "dancing_script",
  "great_vibes",
  "allura",
  "sacramento",
  "parisienne",
  "caveat",
  "pacifico",
  "cairo",
  "tajawal",
  "almarai",
  "changa",
  "el_messiri",
  "amiri",
  "noto_kufi_ar",
  "noto_naskh_ar",
  "ibm_plex_sans_ar",
  "reem_kufi",
  "aref_ruqaa",
  "lateef",
  "scheherazade_new",
  "markazi_text",
  "lemonada",
  "segoe",
  "arial",
  "verdana",
  "tahoma",
  "trebuchet",
  "georgia",
  "times",
  "palatino",
  "garamond",
  "courier",
  "impact"
];

const DARIK_TYPOGRAPHY_FONT_STYLESHEET_105_V5 =
  'https://fonts.googleapis.com/css2?family=Playfair+Display&family=Cormorant+Garamond&family=DM+Serif+Display&family=Bodoni+Moda&family=Prata&family=Cinzel&family=Marcellus&family=Libre+Baskerville&family=Lora&family=EB+Garamond&family=Fraunces&family=Spectral&family=Crimson+Pro&family=Yeseva+One&family=Abril+Fatface&family=Inter&family=Manrope&family=Montserrat&family=Poppins&family=Raleway&family=Outfit&family=Plus+Jakarta+Sans&family=Urbanist&family=Space+Grotesk&family=Work+Sans&family=Nunito+Sans&family=Roboto&family=Quicksand&family=Josefin+Sans&family=Sora&family=Oswald&family=Bebas+Neue&family=Anton&family=Barlow+Condensed&family=Archivo+Black&family=League+Spartan&family=Dancing+Script&family=Great+Vibes&family=Allura&family=Sacramento&family=Parisienne&family=Caveat&family=Pacifico&family=Cairo&family=Tajawal&family=Almarai&family=Changa&family=El+Messiri&family=Amiri&family=Noto+Kufi+Arabic&family=Noto+Naskh+Arabic&family=IBM+Plex+Sans+Arabic&family=Reem+Kufi&family=Aref+Ruqaa&family=Lateef&family=Scheherazade+New&family=Markazi+Text&family=Lemonada&display=swap';

function useDarikTypographyFontLibrary105V5() {
  useEffect(() => {
    const linkId = "darik-typography-font-library-105-v5";
    if (document.getElementById(linkId)) return;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = DARIK_TYPOGRAPHY_FONT_STYLESHEET_105_V5;
    document.head.appendChild(link);
  }, []);
}

// DARIK_PAGE_WIDE_TYPOGRAPHY_106
const darikGlobalTypographyCss106 = Object.entries(
  storefrontTypographyFontFamilies
)
  .map(
    ([fontKey, fontFamily]) => `
[data-darik-page-font="${fontKey}"] :is(
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  span,
  strong,
  small,
  a,
  button,
  label,
  input,
  textarea,
  select,
  option,
  li
) {
  font-family: ${fontFamily} !important;
}

[data-darik-page-font] [data-darik-font-override="${fontKey}"] {
  font-family: ${fontFamily} !important;
}
`
  )
  .join("\n");

// DARIK_CLICK_PREVIEW_POSITIONING_145
// DARIK_FREEFORM_DRAG_EDITOR_146
type StorefrontFreeformPoint146 = {
  x: number;
  y: number;
  label?: string;
};

type StorefrontFreeformDevice146 = Record<
  string,
  StorefrontFreeformPoint146
>;

type StorefrontFreeformLayout146 = {
  desktop: StorefrontFreeformDevice146;
  mobile: StorefrontFreeformDevice146;
};

function clampStorefrontFreeform146(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(-1200, Math.min(1200, Math.round(numeric)));
}

// DARIK_PARENT_AUTH_HANDOFF_148
async function requestPrivatePreviewParentToken148(
  storefrontId: string,
  previewKey: string
) {
  if (typeof window === "undefined") return "";
  if (window.parent === window) return "";
  if (!storefrontId || !previewKey) return "";

  const requestId148 =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `darik-preview-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return await new Promise<string>((resolve) => {
    let finished148 = false;

    function finish148(token = "") {
      if (finished148) return;
      finished148 = true;
      window.removeEventListener(
        "message",
        handleParentToken148
      );
      window.clearTimeout(timeout148);
      resolve(token);
    }

    function handleParentToken148(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.parent) return;
      if (
        event.data?.type !==
        "DARIK_PRIVATE_PREVIEW_AUTH_RESPONSE_148"
      ) {
        return;
      }
      if (event.data?.requestId !== requestId148) return;
      if (event.data?.storefrontId !== storefrontId) return;

      const accessToken148 =
        typeof event.data?.accessToken === "string"
          ? event.data.accessToken.trim()
          : "";

      finish148(accessToken148);
    }

    const timeout148 = window.setTimeout(
      () => finish148(""),
      1800
    );

    window.addEventListener(
      "message",
      handleParentToken148
    );

    window.parent.postMessage(
      {
        type: "DARIK_PRIVATE_PREVIEW_AUTH_REQUEST_148",
        requestId: requestId148,
        storefrontId,
        previewKey,
      },
      window.location.origin
    );
  });
}

function storefrontDefaultFreeformLayout146(): StorefrontFreeformLayout146 {
  return {
    desktop: {},
    mobile: {},
  };
}

function isSafeStorefrontFreeformLocator146(value: unknown) {
  const locator = String(value ?? "").trim();
  return (
    locator.length >= 1 &&
    locator.length <= 700 &&
    /^[A-Za-z0-9_#:.() >-]+$/.test(locator)
  );
}

function normalizeStorefrontFreeformLayout146(
  value: unknown
): StorefrontFreeformLayout146 {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const result = storefrontDefaultFreeformLayout146();

  for (const device of ["desktop", "mobile"] as const) {
    const rawDevice =
      raw[device] &&
      typeof raw[device] === "object" &&
      !Array.isArray(raw[device])
        ? (raw[device] as Record<string, unknown>)
        : {};

    let count146 = 0;

    for (const [locator, rawPoint] of Object.entries(rawDevice)) {
      if (count146 >= 250) break;
      if (!isSafeStorefrontFreeformLocator146(locator)) continue;
      if (
        !rawPoint ||
        typeof rawPoint !== "object" ||
        Array.isArray(rawPoint)
      ) {
        continue;
      }

      const point = rawPoint as Record<string, unknown>;
      const label =
        typeof point.label === "string"
          ? point.label.trim().slice(0, 140)
          : undefined;

      result[device][locator] = {
        x: clampStorefrontFreeform146(point.x),
        y: clampStorefrontFreeform146(point.y),
        ...(label ? { label } : {}),
      };

      count146 += 1;
    }
  }

  return result;
}

function storefrontFreeformElementLabel146(element: Element) {
  const tag = element.tagName.toLowerCase();
  const aria = element.getAttribute("aria-label")?.trim();
  const title = element.getAttribute("title")?.trim();
  const text = (element.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 72);

  const detail = aria || title || text;
  return detail ? `${tag} · ${detail}`.slice(0, 140) : tag;
}

function storefrontFreeformLocator146(
  root: Element,
  target: Element
) {
  if (target === root) return "";

  const id = target.getAttribute("id")?.trim() ?? "";
  if (/^[A-Za-z][A-Za-z0-9_-]{0,100}$/.test(id)) {
    const locator = `#${id}`;
    try {
      if (root.querySelectorAll(locator).length === 1) {
        return locator;
      }
    } catch {
      // Fall through to structural locator.
    }
  }

  const segments: string[] = [];
  let current: Element | null = target;
  let depth = 0;

  while (current && current !== root && depth < 18) {
    const parent = current.parentElement;
    if (!parent) return "";

    const tag = current.tagName.toLowerCase();
    const sameTag = Array.from(parent.children).filter(
      (child) => child.tagName === current?.tagName
    );
    const index = sameTag.indexOf(current);

    if (index < 0) return "";

    segments.unshift(`${tag}:nth-of-type(${index + 1})`);

    current = parent;
    depth += 1;
  }

  if (current !== root || segments.length === 0) return "";

  const locator = segments.join(" > ");
  return isSafeStorefrontFreeformLocator146(locator) ? locator : "";
}

function storefrontFreeformTranslate146(value: string) {
  const normalized = String(value || "").trim();

  if (!normalized || normalized === "none") {
    return { x: 0, y: 0 };
  }

  const matches = normalized.match(/-?[0-9.]+/g) ?? [];
  return {
    x: clampStorefrontFreeform146(matches[0] ?? 0),
    y: clampStorefrontFreeform146(matches[1] ?? 0),
  };
}

type StorefrontPositionKey145 =
  | "display_name"
  | "display_name_ar"
  | "tagline"
  | "tagline_ar"
  | "shop";

type StorefrontPositionPoint145 = {
  x: number;
  y: number;
};

type StorefrontPositionDevice145 = {
  desktop: StorefrontPositionPoint145;
  mobile: StorefrontPositionPoint145;
};

type StorefrontContentPositioning145 = Record<
  StorefrontPositionKey145,
  StorefrontPositionDevice145
>;

const storefrontPositionKeys145: StorefrontPositionKey145[] = [
  "display_name",
  "display_name_ar",
  "tagline",
  "tagline_ar",
  "shop",
];

function clampStorefrontPosition145(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(-240, Math.min(240, Math.round(numeric)));
}

function storefrontDefaultContentPositioning145(): StorefrontContentPositioning145 {
  return {
    display_name: {
      desktop: { x: 0, y: 0 },
      mobile: { x: 0, y: 0 },
    },
    display_name_ar: {
      desktop: { x: 0, y: 0 },
      mobile: { x: 0, y: 0 },
    },
    tagline: {
      desktop: { x: 0, y: 0 },
      mobile: { x: 0, y: 0 },
    },
    tagline_ar: {
      desktop: { x: 0, y: 0 },
      mobile: { x: 0, y: 0 },
    },
    shop: {
      desktop: { x: 0, y: 0 },
      mobile: { x: 0, y: 0 },
    },
  };
}

function normalizeStorefrontContentPositioning145(
  value: unknown
): StorefrontContentPositioning145 {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const next = storefrontDefaultContentPositioning145();

  for (const key of storefrontPositionKeys145) {
    const rawElement =
      raw[key] && typeof raw[key] === "object" && !Array.isArray(raw[key])
        ? (raw[key] as Record<string, unknown>)
        : {};

    for (const device of ["desktop", "mobile"] as const) {
      const rawPoint =
        rawElement[device] &&
        typeof rawElement[device] === "object" &&
        !Array.isArray(rawElement[device])
          ? (rawElement[device] as Record<string, unknown>)
          : {};

      next[key][device] = {
        x: clampStorefrontPosition145(rawPoint.x),
        y: clampStorefrontPosition145(rawPoint.y),
      };
    }
  }

  return next;
}

function storefrontPositionStyle145(
  positioning: StorefrontContentPositioning145,
  key: StorefrontPositionKey145
) {
  const position = positioning[key];

  return {
    "--darik-position-desktop-x-145": `${position.desktop.x}px`,
    "--darik-position-desktop-y-145": `${position.desktop.y}px`,
    "--darik-position-mobile-x-145": `${position.mobile.x}px`,
    "--darik-position-mobile-y-145": `${position.mobile.y}px`,
  } as any;
}

function storefrontTypographyDefaultState(): StorefrontTypographyState {
  return {
    page: { font: "theme", size: 0 },
    display_name: { font: "theme", size: 0 },
    display_name_ar: { font: "theme", size: 0 },
    tagline: { font: "theme", size: 0 },
    tagline_ar: { font: "theme", size: 0 },
  };
}

function isStorefrontTypographyFontKey(
  value: unknown
): value is StorefrontTypographyFontKey {
  const candidate = String(value || "");
  return storefrontTypographyFontKeys.some((fontKey) => fontKey === candidate);
}

function normalizeStorefrontTypography(
  value: unknown
): StorefrontTypographyState {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const next = storefrontTypographyDefaultState();

  for (const key of storefrontTypographyKeys) {
    const rawSetting =
      raw[key] && typeof raw[key] === "object" && !Array.isArray(raw[key])
        ? (raw[key] as Record<string, unknown>)
        : {};

    const font = isStorefrontTypographyFontKey(rawSetting.font)
      ? rawSetting.font
      : "theme";

    const numericSize = Number(rawSetting.size ?? 0);
    const size =
      Number.isInteger(numericSize) &&
      (numericSize === 0 || (numericSize >= 10 && numericSize <= 96))
        ? numericSize
        : 0;

    next[key] = { font, size };
  }

  return next;
}

function storefrontTypographyInlineStyle(
  typography: StorefrontTypographyState,
  key: StorefrontTypographyKey
) {
  const setting = typography[key];
  const style: { fontFamily?: string; fontSize?: string } = {};

  if (setting.font !== "theme") {
    style.fontFamily = storefrontTypographyFontFamilies[setting.font];
  }

  if (setting.size > 0) {
    style.fontSize = `${setting.size}px`;
  }

  return style;
}

// DARIK_REAL_BUSINESS_HOURS_NEXT_DAY_DELIVERY_115
type DarikStoreHoursPhase115 =
  | "unknown"
  | "open"
  | "before_open"
  | "after_close"
  | "closed_day";

type DarikStoreHoursState115 = {
  hasHours: boolean;
  isOpen: boolean;
  phase: DarikStoreHoursPhase115;
  openLabel: string;
};

function darikParseStoreTime115(value: string) {
  const match = value
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(A\.?M\.?|P\.?M\.?)$/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? "0");
  const meridiem = match[3].replace(/\./g, "").toUpperCase();

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  if (hour === 12) hour = 0;
  if (meridiem === "PM") hour += 12;

  return hour * 60 + minute;
}

function darikStoreHoursState115(
  operatingHoursValue: unknown,
  timestamp: number
): DarikStoreHoursState115 {
  if (!timestamp) {
    return {
      hasHours: false,
      isOpen: false,
      phase: "unknown",
      openLabel: "",
    };
  }

  let operatingHours = operatingHoursValue;

  if (typeof operatingHoursValue === "string") {
    try {
      operatingHours = JSON.parse(operatingHoursValue);
    } catch {
      operatingHours = null;
    }
  }

  if (
    !operatingHours ||
    typeof operatingHours !== "object" ||
    Array.isArray(operatingHours)
  ) {
    return {
      hasHours: false,
      isOpen: false,
      phase: "unknown",
      openLabel: "",
    };
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Amman",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(timestamp));

  const weekday = String(
    parts.find((part) => part.type === "weekday")?.value ?? ""
  )
    .trim()
    .toLowerCase();

  const hour = Number(
    parts.find((part) => part.type === "hour")?.value ?? "0"
  );
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0"
  );

  const rows = operatingHours as Record<string, unknown>;
  const matchingEntry = Object.entries(rows).find(
    ([key]) => key.trim().toLowerCase() === weekday
  );
  const raw = String(matchingEntry?.[1] ?? "").trim();

  if (!raw) {
    return {
      hasHours: false,
      isOpen: false,
      phase: "unknown",
      openLabel: "",
    };
  }

  if (
    raw.toLowerCase() === "closed" ||
    raw.includes("مغلق")
  ) {
    return {
      hasHours: true,
      isOpen: false,
      phase: "closed_day",
      openLabel: "",
    };
  }

  const timeMatches = Array.from(
    raw.matchAll(
      /(\d{1,2}(?::\d{2})?\s*(?:A\.?M\.?|P\.?M\.?))/gi
    )
  ).map((match) => match[1].trim());

  if (timeMatches.length < 2) {
    return {
      hasHours: false,
      isOpen: false,
      phase: "unknown",
      openLabel: "",
    };
  }

  const openMinutes = darikParseStoreTime115(timeMatches[0]);
  const closeMinutes = darikParseStoreTime115(timeMatches[1]);

  if (openMinutes === null || closeMinutes === null) {
    return {
      hasHours: false,
      isOpen: false,
      phase: "unknown",
      openLabel: "",
    };
  }

  const nowMinutes = hour * 60 + minute;

  // Same-day hours, e.g. 9:30 AM - 6:00 PM.
  if (closeMinutes > openMinutes) {
    if (nowMinutes < openMinutes) {
      return {
        hasHours: true,
        isOpen: false,
        phase: "before_open",
        openLabel: timeMatches[0],
      };
    }

    if (nowMinutes >= closeMinutes) {
      return {
        hasHours: true,
        isOpen: false,
        phase: "after_close",
        openLabel: timeMatches[0],
      };
    }

    return {
      hasHours: true,
      isOpen: true,
      phase: "open",
      openLabel: timeMatches[0],
    };
  }

  // Overnight hours, e.g. 8:00 PM - 2:00 AM.
  const overnightOpen =
    nowMinutes >= openMinutes || nowMinutes < closeMinutes;

  return {
    hasHours: true,
    isOpen: overnightOpen,
    phase: overnightOpen ? "open" : "before_open",
    openLabel: timeMatches[0],
  };
}

// DARIK_FRESH_CUSTOMER_LOCATION_ONE_TIME_HANDOFF_117
type DarikCustomerLocation117 = {
  latitude: number;
  longitude: number;
  label: string;
  source: "gps" | "google_search" | "marketplace";
};

type DarikNearbyStoreMatch117 = {
  slug?: string | null;
  delivery_fee?: number | string | null;
  minimum_order?: number | string | null;
  delivery_radius_km?: number | string | null;
  distance_km?: number | string | null;
};

type DarikGooglePrediction117 = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

const DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117 =
  "darik_marketplace_location_handoff_117";

// DARIK_SESSION_LOCATION_AND_PREVIEW_BYPASS_120
const DARIK_CUSTOMER_LOCATION_SESSION_KEY_120 =
  "darik_customer_location_session_120";
const DARIK_PICKUP_BROWSE_SESSION_PREFIX_120 =
  "darik_pickup_browse_session_120:";

function readDarikCustomerLocationSession120():
  | DarikCustomerLocation117
  | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(
      DARIK_CUSTOMER_LOCATION_SESSION_KEY_120
    );

    if (!raw) return null;

    return normalizeDarikCustomerLocation117(
      JSON.parse(raw)
    );
  } catch {
    return null;
  }
}

function writeDarikCustomerLocationSession120(
  location: DarikCustomerLocation117
) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      DARIK_CUSTOMER_LOCATION_SESSION_KEY_120,
      JSON.stringify({
        ...location,
        capturedAt: Date.now(),
      })
    );
  } catch {
    // Session storage can be unavailable in restrictive browser modes.
  }
}

function darikPickupBrowseSessionKey120(slug: string) {
  return (
    DARIK_PICKUP_BROWSE_SESSION_PREFIX_120 +
    slug.trim().toLowerCase()
  );
}

function darikIsBuilderPreview120() {
  if (typeof window === "undefined") return false;

  return (
    new URLSearchParams(window.location.search).get(
      "builderPreview"
    ) === "1"
  );
}

function normalizeDarikCustomerLocation117(
  value: unknown
): DarikCustomerLocation117 | null {
  if (!value || typeof value !== "object") return null;

  const row = value as Record<string, unknown>;
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  const label = String(row.label ?? "").trim();

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  const sourceRaw = String(row.source ?? "").trim();

  return {
    latitude,
    longitude,
    label:
      label ||
      `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    source:
      sourceRaw === "gps"
        ? "gps"
        : sourceRaw === "marketplace"
          ? "marketplace"
          : "google_search",
  };
}

function darikMarketplaceReferrerIsRoot117() {
  if (typeof window === "undefined") return false;
  if (!document.referrer) return false;

  try {
    const referrer = new URL(document.referrer);

    return (
      referrer.origin === window.location.origin &&
      referrer.pathname === "/"
    );
  } catch {
    return false;
  }
}

export default function DarikDirectStorefrontPage() {
  // DARIK_REAL_BUSINESS_HOURS_NEXT_DAY_DELIVERY_115_V3_HOOK_ORDER_FIX
  const [storeClock115, setStoreClock115] = useState(0);

  useEffect(() => {
    const updateStoreClock115 = () => {
      setStoreClock115(Date.now());
    };

    updateStoreClock115();

    const timer = window.setInterval(
      updateStoreClock115,
      30_000
    );

    return () => window.clearInterval(timer);
  }, []);


  useDarikTypographyFontLibrary105V5();
  const params = useParams<{ slug: string | string[] }>();
  const slug = normalizeParam(params?.slug);
  const [previewRetailField, setPreviewRetailField] = useState("");
  useEffect(() => {
    const field = new URLSearchParams(window.location.search)
      .get("previewField")
      ?.trim();
    setPreviewRetailField(field || "");
  }, []);

  // DARIK_RETAILER_THEME_GALLERY_102
  const [savedThemeField, setSavedThemeField] = useState("");

  // DARIK_INDEPENDENT_STOREFRONT_TYPOGRAPHY_105
  const [savedStorefrontTypography, setSavedStorefrontTypography] =
    useState<StorefrontTypographyState>(() => storefrontTypographyDefaultState());

  useEffect(() => {
    if (!slug) {
      setSavedStorefrontTypography(storefrontTypographyDefaultState());
      return;
    }

    let cancelled = false;

    void (async () => {
      const result = await supabase.rpc("darik_direct_public_typography", {
        p_slug: slug,
      });

      if (cancelled || result.error) return;

      setSavedStorefrontTypography(
        normalizeStorefrontTypography(result.data)
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const [savedContentPositioning145, setSavedContentPositioning145] =
    useState<StorefrontContentPositioning145>(() =>
      storefrontDefaultContentPositioning145()
    );

  const [builderSelectedPosition145, setBuilderSelectedPosition145] =
    useState<StorefrontPositionKey145 | null>(null);

  const [isBuilderPositionPreview145, setIsBuilderPositionPreview145] =
    useState(false);

  useEffect(() => {
    setIsBuilderPositionPreview145(darikIsBuilderPreview120());
  }, []);

  useEffect(() => {
    if (!slug) {
      setSavedContentPositioning145(
        storefrontDefaultContentPositioning145()
      );
      return;
    }

    let cancelled = false;

    void (async () => {
      const result = await supabase.rpc(
        "darik_direct_public_content_positioning_v1",
        { p_slug: slug }
      );

      if (cancelled || result.error) return;

      setSavedContentPositioning145(
        normalizeStorefrontContentPositioning145(result.data)
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);


  useEffect(() => {
    if (!slug) {
      setSavedThemeField("");
      return;
    }

    let cancelled = false;

    void (async () => {
      const result = await supabase.rpc("darik_direct_public_theme_field", {
        p_slug: slug,
      });

      if (cancelled || result.error) return;

      setSavedThemeField(String(result.data ?? "").trim().toLowerCase());
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const [previewMechanicsField, setPreviewMechanicsField] = useState("");
  useEffect(() => {
    setPreviewMechanicsField(readMechanicsLabField());
  }, []);

  useEffect(() => {
    const syncProductFromUrl = () => {
      const productId = new URLSearchParams(window.location.search)
        .get("product")
        ?.trim();
      setActiveProductId(productId || "");
    };

    syncProductFromUrl();
    window.addEventListener("popstate", syncProductFromUrl);
    return () => window.removeEventListener("popstate", syncProductFromUrl);
  }, []);

  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [publicStatus, setPublicStatus] = useState<PublicStoreStatus | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("BestSellers");
  const [search, setSearch] = useState("");
  const [selectedVehicleMake, setSelectedVehicleMake] = useState("all");
  const [selectedVehicleModel, setSelectedVehicleModel] = useState("all");
  const [selectedVehicleYear, setSelectedVehicleYear] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [activeProductId, setActiveProductId] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [onlineCheckoutOpen, setOnlineCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<OnlineCheckoutForm>({
    customerName: "",
    customerPhone: "",
    buildingNumber: "",
    apartmentNumber: "",
    deliveryNote: "",
    paymentMethod: "cash",
    fulfillmentMethod: "delivery",
    latitude: null,
    longitude: null,
  });
  const [cliqReceiptFile, setCliqReceiptFile] = useState<File | null>(null);
  const [cliqReceiptPreview, setCliqReceiptPreview] = useState("");
  const [cliqReceiptPath, setCliqReceiptPath] = useState("");
  const [locatingCustomer, setLocatingCustomer] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderNumber: string;
    total: number;
    paymentMethod: "cash" | "cliq";
    fulfillmentMethod: "delivery" | "pickup";
  } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mobileContactDockVisible, setMobileContactDockVisible] = useState(false);

  useEffect(() => {
    const updateMobileContactDock = () => {
      setMobileContactDockVisible(window.scrollY > 620);
    };

    updateMobileContactDock();
    window.addEventListener("scroll", updateMobileContactDock, { passive: true });
    return () => window.removeEventListener("scroll", updateMobileContactDock);
  }, []);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");


  useEffect(() => {
    if (!detailsOpen && !cartOpen && !onlineCheckoutOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (onlineCheckoutOpen) setOnlineCheckoutOpen(false);
      else if (cartOpen) setCartOpen(false);
      else if (detailsOpen) setDetailsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [cartOpen, detailsOpen, onlineCheckoutOpen]);

  useEffect(() => {
    if (!slug) return;

    const storageKey = `darik-direct-cart:${slug}`;

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setCart(JSON.parse(saved) as CartLine[]);
    } catch {
      setCart([]);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    const storageKey = `darik-direct-cart:${slug}`;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // Cart persistence is optional.
    }
  }, [cart, slug]);

  useEffect(() => {
    if (!storefront) return;

    setCheckoutForm((current) => {
      const currentPaymentAllowed =
        (current.paymentMethod === "cash" &&
          storefront.cash_on_delivery_enabled) ||
        (current.paymentMethod === "cliq" && storefront.cliq_enabled);
      const deliveryEnabled = storefront.delivery_enabled !== false;
      const pickupEnabled = storefront.pickup_enabled === true;
      const currentFulfillmentAllowed =
        (current.fulfillmentMethod === "delivery" && deliveryEnabled) ||
        (current.fulfillmentMethod === "pickup" && pickupEnabled);

      return {
        ...current,
        paymentMethod: currentPaymentAllowed
          ? current.paymentMethod
          : storefront.cash_on_delivery_enabled
            ? "cash"
            : "cliq",
        fulfillmentMethod: currentFulfillmentAllowed
          ? current.fulfillmentMethod
          : deliveryEnabled
            ? "delivery"
            : "pickup",
      };
    });
  }, [storefront]);

  useEffect(() => {
    if (!cliqReceiptFile) {
      setCliqReceiptPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(cliqReceiptFile);
    setCliqReceiptPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [cliqReceiptFile]);

  useEffect(() => {
    if (checkoutForm.paymentMethod === "cliq") return;
    setCliqReceiptFile(null);
    setCliqReceiptPath("");
  }, [checkoutForm.paymentMethod]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function loadStorefront() {
      setLoading(true);
      setLoadError("");

      const privatePreviewParams143 = new URLSearchParams(window.location.search);
      const privateAliasPreview143 =
        slug === "_darik-private-store-preview" &&
        privatePreviewParams143.get("builderPreview") === "1";

      if (privateAliasPreview143) {
        const privateStorefrontId143 =
          privatePreviewParams143.get("storefrontId") ?? "";
        const privatePreviewKey143 =
          privatePreviewParams143.get("previewKey") ?? "";

        const privatePreviewRequestValid143 =
          /^[0-9a-f-]{36}$/i.test(privateStorefrontId143) &&
          privatePreviewKey143.length >= 32;

        if (!privatePreviewRequestValid143) {
          setPublicStatus(null);
          setStorefront(null);
          setProducts([]);
          setCategories([]);
          setLoading(false);
          return;
        }

        const parentAccessToken148 =
  await requestPrivatePreviewParentToken148(
    privateStorefrontId143,
    privatePreviewKey143
  );

const { data: privateSessionData143 } =
  await supabase.auth.getSession();

const privateAccessToken143 =
  parentAccessToken148 ||
  privateSessionData143.session?.access_token ||
  "";

if (!privateAccessToken143) {
          setPublicStatus(null);
          setStorefront(null);
          setProducts([]);
          setCategories([]);
          setLoading(false);
          return;
        }

        try {
          const privateResponse143 = await fetch(
            `/api/retailer-storefront-preview-143?storefrontId=${encodeURIComponent(
              privateStorefrontId143
            )}`,
            {
              method: "GET",
              cache: "no-store",
              headers: {
                Authorization: `Bearer ${privateAccessToken143}`,
                "X-Darik-Preview-Key": privatePreviewKey143,
              },
            }
          );

          const privatePayload143 =
            (await privateResponse143.json().catch(() => ({}))) as {
              ok?: boolean;
              error?: string;
              storefront?: Storefront | null;
              products?: Product[];
              categories?: Category[];
            };

          if (cancelled) return;

          if (
            privateResponse143.ok &&
            privatePayload143.ok &&
            privatePayload143.storefront
          ) {
            setPublicStatus(null);
            setStorefront(privatePayload143.storefront);
            setProducts(privatePayload143.products ?? []);
            setCategories(privatePayload143.categories ?? []);
            setLoading(false);
            return;
          }

          console.warn(
            "Darik real private storefront preview 143 was rejected.",
            privatePayload143.error || privateResponse143.status
          );
        } catch (privatePreviewError143) {
          console.warn(
            "Darik real private storefront preview 143 failed.",
            privatePreviewError143
          );
        }

        setPublicStatus(null);
        setStorefront(null);
        setProducts([]);
        setCategories([]);
        setLoading(false);
        return;
      }
      const storefrontResult = await supabase
        .from("public_retailer_storefronts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;

      if (storefrontResult.error || !storefrontResult.data) {
        const statusResult = await supabase
          .from("public_retailer_storefront_status")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (cancelled) return;

        setStorefront(null);
        setProducts([]);
        setCategories([]);

        if (!statusResult.error && statusResult.data) {
          setPublicStatus(statusResult.data as PublicStoreStatus);
          setLoadError("");
        } else {
          setPublicStatus(null);
          setLoadError(
            storefrontResult.error?.message ||
              statusResult.error?.message ||
              "This Darik Direct storefront could not be found."
          );
        }

        setLoading(false);
        return;
      }

      const currentStorefront = storefrontResult.data as Storefront;
      setPublicStatus(null);
      setStorefront(currentStorefront);

      const [productResult, categoryResult] = await Promise.all([
        supabase
          .from("public_storefront_products")
          .select("*")
          .eq("storefront_slug", slug)
          .order("storefront_featured", { ascending: false })
          .order("storefront_sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("public_storefront_categories")
          .select("*")
          .eq("storefront_slug", slug)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
      ]);

      if (cancelled) return;

      if (productResult.error) {
        setLoadError(productResult.error.message);
      } else {
        setProducts((productResult.data ?? []) as unknown as Product[]);
      }

      if (!categoryResult.error) {
        setCategories((categoryResult.data ?? []) as unknown as Category[]);
      }

      setLoading(false);
    }

    loadStorefront();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const visibleCategories = useMemo(
    () =>
      categories.filter((category) => Number(category.product_count ?? 0) > 0),
    [categories]
  );

  // DARIK_LIVE_STOREFRONT_BUILDER_103
  useEffect(() => {
    const builderMode =
      new URLSearchParams(window.location.search).get("builderPreview") === "1";

    if (!builderMode) return;

    const allowedKeys = new Set([
      "display_name",
      "display_name_ar",
      "tagline",
      "tagline_ar",
      "direct_typography",
      "direct_content_positioning",
      "direct_freeform_layout",
      "logo_url",
      "hero_image_url",
      "business_phone",
      "whatsapp_number",
      "public_email",
      "website_url",
      "facebook_url",
      "instagram_url",
      "address_text",
      "address_text_ar",
      "about_text",
      "about_text_ar",
      "operating_hours",
      "minimum_order",
      "delivery_fee",
      "delivery_radius_km",
      "estimated_delivery_minutes",
      "show_prices",
      "show_ordering",
      "show_phone",
      "show_whatsapp",
      "show_store_story",
      "pickup_enabled",
      "is_accepting_orders",
    ]);

    function receiveBuilderDraft(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "DARIK_STOREFRONT_BUILDER_DRAFT_103") return;

      const raw =
        event.data && typeof event.data.payload === "object" && event.data.payload
          ? (event.data.payload as Record<string, unknown>)
          : {};

      const clean: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(raw)) {
        if (!allowedKeys.has(key) || value === undefined) continue;
        clean[key] = value;
      }

      setStorefront((current) =>
        current ? ({ ...current, ...clean } as Storefront) : current
      );
    }

    window.addEventListener("message", receiveBuilderDraft);

    return () => {
      window.removeEventListener("message", receiveBuilderDraft);
    };
  }, []);

  useEffect(() => {
    if (!storefront?.id) return;

    const builderMode =
      new URLSearchParams(window.location.search).get("builderPreview") === "1";

    if (!builderMode || window.parent === window) return;

    window.parent.postMessage(
      { type: "DARIK_STOREFRONT_BUILDER_READY_103" },
      window.location.origin
    );
  }, [storefront?.id]);

  const actualBusinessType = String(
    storefront?.business_type ||
    publicStatus?.business_type ||
    "retail"
  )
    .trim()
    .toLowerCase();
  const effectiveBusinessType = String(
    previewMechanicsField ||
    actualBusinessType ||
    "retail"
  )
    .trim()
    .toLowerCase();
  const effectiveThemeField = String(
    previewRetailField ||
    savedThemeField ||
    actualBusinessType ||
    "retail"
  )
    .trim()
    .toLowerCase();
  const isAutoParts = effectiveBusinessType === "auto_parts";
  const isGroceryStore = [
    "supermarket",
    "grocery",
    "mini_market",
    "butcher",
    "produce",
    "frozen_food",
  ].includes(effectiveBusinessType);
  const isAutoPartsTheme = effectiveThemeField === "auto_parts";

  const vehicleMakes = useMemo(() => {
    if (!isAutoParts) return [];
    return Array.from(
      new Set(
        products
          .map((product) => String(product.direct_vehicle_make ?? "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [isAutoParts, products]);

  const vehicleModels = useMemo(() => {
    if (!isAutoParts) return [];
    const selectedMakeLower = selectedVehicleMake.toLowerCase();
    return Array.from(
      new Set(
        products
          .filter((product) =>
            selectedVehicleMake === "all"
              ? true
              : String(product.direct_vehicle_make ?? "").trim().toLowerCase() === selectedMakeLower
          )
          .map((product) => String(product.direct_vehicle_model ?? "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [isAutoParts, products, selectedVehicleMake]);

  const vehicleYears = useMemo(() => {
    if (!isAutoParts) return [];
    const years = new Set<number>();
    for (const product of products) {
      const from = Number(product.direct_vehicle_year_from ?? 0);
      const to = Number(product.direct_vehicle_year_to ?? from);
      if (!Number.isInteger(from) || from < 1950 || from > 2100) continue;
      const safeTo = Number.isInteger(to) && to >= from && to <= 2100 ? to : from;
      for (let year = from; year <= safeTo; year += 1) years.add(year);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [isAutoParts, products]);

  const hasVehicleFitment =
    isAutoParts && (vehicleMakes.length > 0 || vehicleModels.length > 0 || vehicleYears.length > 0);

  useEffect(() => {
    if (selectedVehicleModel === "all") return;
    if (!vehicleModels.some((model) => model.toLowerCase() === selectedVehicleModel.toLowerCase())) {
      setSelectedVehicleModel("all");
    }
  }, [selectedVehicleModel, vehicleModels]);

  const filteredProducts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      if (
        selectedCategoryId !== "BestSellers" &&
        selectedCategoryId !== "all" &&
        product.direct_store_category_id !== selectedCategoryId
      ) {
        return false;
      }

      if (selectedVehicleMake !== "all" &&
          String(product.direct_vehicle_make ?? "").trim().toLowerCase() !== selectedVehicleMake.toLowerCase()) {
        return false;
      }

      if (selectedVehicleModel !== "all" &&
          String(product.direct_vehicle_model ?? "").trim().toLowerCase() !== selectedVehicleModel.toLowerCase()) {
        return false;
      }

      if (selectedVehicleYear !== "all") {
        const year = Number(selectedVehicleYear);
        const from = Number(product.direct_vehicle_year_from ?? 0);
        const to = Number(product.direct_vehicle_year_to ?? from);
        if (!from || year < from || year > (to || from)) return false;
      }

      if (!cleanSearch) return true;

      return [
        product.name,
        product.official_marketplace_name,
        product.official_marketplace_name_ar,
        product.brand_name,
        product.direct_store_category_name,
        product.direct_store_category_name_ar,
        product.subcategory_name,
        product.description,
        product.direct_vehicle_make,
        product.direct_vehicle_model,
        product.direct_vehicle_year_from,
        product.direct_vehicle_year_to,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(cleanSearch));
    });
  }, [
    products,
    search,
    selectedCategoryId,
    selectedVehicleMake,
    selectedVehicleModel,
    selectedVehicleYear,
  ]);

  const availableProductCount = useMemo(
    () =>
      products.filter(
        (product) =>
          product.direct_availability_status !== "out_of_stock" &&
          (!product.direct_inventory_tracking_enabled ||
            Number(product.quantity_in_stock ?? 0) > 0)
      ).length,
    [products]
  );

  const featuredProducts = useMemo(() => {
    if (
      selectedCategoryId !== "all" ||
      search.trim() ||
      selectedVehicleMake !== "all" ||
      selectedVehicleModel !== "all" ||
      selectedVehicleYear !== "all"
    ) return [];
    return products.filter((product) => product.storefront_featured).slice(0, 8);
  }, [
    products,
    search,
    selectedCategoryId,
    selectedVehicleMake,
    selectedVehicleModel,
    selectedVehicleYear,
  ]);

  const catalogProducts = useMemo(() => {
    if (featuredProducts.length === 0) return filteredProducts;
    const featuredIds = new Set(featuredProducts.map((product) => product.id));
    return filteredProducts.filter((product) => !featuredIds.has(product.id));
  }, [featuredProducts, filteredProducts]);


  // DARIK_DIRECT_MARKETPLACE_CATALOG_091
  // Darik Marketplace parity: Best Sellers is the default and is grouped by
  // the store's real categories. Search and field-specific filters are already
  // reflected in filteredProducts.
  const marketplaceBestSellerGroups = useMemo(() => {
    if (selectedCategoryId !== "BestSellers") return [];

    return visibleCategories
      .map((category) => ({
        category,
        products: filteredProducts.filter((product) => product.direct_store_category_id === category.id),
      }))
      .filter((group) => group.products.length > 0);
  }, [filteredProducts, selectedCategoryId, visibleCategories]);

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, line) => total + line.price * line.quantity, 0),
    [cart]
  );

  useEffect(() => {
    const unavailableIds = new Set(
      products
        .filter(
          (product) =>
            (product.direct_pricing_mode || "price") !== "price" ||
            product.direct_availability_status === "out_of_stock" ||
            (product.direct_inventory_tracking_enabled &&
              Number(product.quantity_in_stock ?? 0) <= 0)
        )
        .map((product) => product.id)
    );
    if (unavailableIds.size === 0) return;
    setCart((current) =>
      current.filter((line) => !unavailableIds.has(line.productId))
    );
  }, [products]);



  const [customerLocation117, setCustomerLocation117] =
    useState<DarikCustomerLocation117 | null>(null);
  const [deliveryMatch117, setDeliveryMatch117] =
    useState<DarikNearbyStoreMatch117 | null>(null);
  const [locationGateOpen117, setLocationGateOpen117] =
    useState(false);
  const [locationGateBusy117, setLocationGateBusy117] =
    useState(false);
  const [locationGateError117, setLocationGateError117] =
    useState("");
  const [locationSearch117, setLocationSearch117] =
    useState("");
  const [locationPredictions117, setLocationPredictions117] =
    useState<DarikGooglePrediction117[]>([]);
  const [locationSearchBusy117, setLocationSearchBusy117] =
    useState(false);

  useEffect(() => {
    if (!storefront || !slug) return;

    /*
      Retailer builder preview is not a customer visit. Never block setup or
      preview rendering behind a customer delivery-location question.
    */
    if (darikIsBuilderPreview120()) {
      setLocationGateOpen117(false);
      setLocationGateBusy117(false);
      setLocationGateError117("");
      setLocationPredictions117([]);
      return;
    }

    const storeDeliveryEnabled117 =
      storefront.delivery_enabled !== false;

    if (!storeDeliveryEnabled117) {
      setLocationGateOpen117(false);
      setCustomerLocation117(null);
      setDeliveryMatch117(null);

      try {
        window.sessionStorage.removeItem(
          DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117
        );
      } catch {
        // No delivery location is required for pickup-only stores.
      }

      return;
    }

    /*
      If this customer explicitly chose pickup browsing for this store during
      the current tab/session, a full storefront navigation must honor it.
    */
    try {
      const pickupForThisStore120 =
        window.sessionStorage.getItem(
          darikPickupBrowseSessionKey120(slug)
        ) === "1";

      if (pickupForThisStore120) {
        browseStoreForPickup118();
        return;
      }
    } catch {
      // Fall through to the normal session-location path.
    }

    /*
      Main path: reuse the customer's location for this browser tab/session.
      No GPS/browser permission request is repeated on product navigation,
      storefront reloads, or a return from the marketplace.
    */
    const sessionLocation120 =
      readDarikCustomerLocationSession120();

    if (sessionLocation120) {
      void applyCustomerLocation117(
        sessionLocation120,
        true
      );
      return;
    }

    /*
      Compatibility path for a marketplace page that was already open before
      FRONTEND 120 deployed. Consume FRONTEND 117's old one-time handoff once,
      then promote it to the new session-only location.
    */
    let marketplaceLocation117:
      | DarikCustomerLocation117
      | null = null;

    try {
      const raw = window.sessionStorage.getItem(
        DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117
      );

      window.sessionStorage.removeItem(
        DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117
      );

      if (
        raw &&
        darikMarketplaceReferrerIsRoot117()
      ) {
        const parsed = JSON.parse(raw) as
          Record<string, unknown>;

        const capturedAt = Number(
          parsed.capturedAt ?? 0
        );

        const stillFresh =
          Number.isFinite(capturedAt) &&
          capturedAt > 0 &&
          Date.now() - capturedAt <
            60 * 60 * 1000;

        if (stillFresh) {
          marketplaceLocation117 =
            normalizeDarikCustomerLocation117({
              ...parsed,
              source: "marketplace",
            });
        }
      }
    } catch {
      marketplaceLocation117 = null;
    }

    if (marketplaceLocation117) {
      writeDarikCustomerLocationSession120(
        marketplaceLocation117
      );
      void applyCustomerLocation117(
        marketplaceLocation117,
        true
      );
      return;
    }

    setCustomerLocation117(null);
    setDeliveryMatch117(null);
    setLocationGateError117("");
    setLocationPredictions117([]);
    setLocationSearch117("");
    setLocationGateOpen117(true);
  }, [
    storefront?.id,
    storefront?.delivery_enabled,
    storefront?.pickup_enabled,
    slug,
  ]);

  async function applyCustomerLocation117(
    location: DarikCustomerLocation117,
    fromMarketplace: boolean
  ) {
    if (!slug) return false;

    writeDarikCustomerLocationSession120(location);

    try {
      window.sessionStorage.removeItem(
        darikPickupBrowseSessionKey120(slug)
      );
    } catch {
      // Session pickup override is best-effort only.
    }

    setLocationGateBusy117(true);
    setLocationGateError117("");

    try {
      const result = await supabase.rpc(
        "darik_direct_nearby_storefronts",
        {
          p_latitude: location.latitude,
          p_longitude: location.longitude,
          p_limit: 200,
        }
      );

      if (result.error) throw result.error;

      const rows = Array.isArray(result.data)
        ? (result.data as DarikNearbyStoreMatch117[])
        : [];

      const match =
        rows.find(
          (row) =>
            String(row.slug ?? "")
              .trim()
              .toLowerCase() ===
            slug.trim().toLowerCase()
        ) ?? null;

      if (!match) {
        setCustomerLocation117(location);
        setDeliveryMatch117(null);
        setLocationGateOpen117(true);
        setLocationGateError117(
          "This location is outside this store's delivery zones. Choose another location. / هذا الموقع خارج مناطق توصيل المتجر. اختر موقعاً آخر."
        );

        return false;
      }

      setCustomerLocation117(location);
      setDeliveryMatch117(match);
      setPickupBrowse118(false);
      setLocationGateOpen117(false);
      setLocationGateError117("");
      setLocationPredictions117([]);
      setLocationSearch117(location.label);

      setCheckoutForm((current) => ({
        ...current,
        fulfillmentMethod: "delivery",
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      return true;
    } catch (caught) {
      setLocationGateError117(
        darikCheckoutErrorMessage122(caught)
      );

      if (fromMarketplace) {
        setLocationGateOpen117(true);
      }

      return false;
    } finally {
      setLocationGateBusy117(false);
    }
  }

  function useFreshCurrentLocation117() {
    if (locationGateBusy117) return;

    if (!navigator.geolocation) {
      setLocationGateError117(
        "Location access is not available in this browser. Search Google instead."
      );
      return;
    }

    setLocationGateBusy117(true);
    setLocationGateError117("");
    setLocationPredictions117([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let label =
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        try {
          const params = new URLSearchParams({
            lat: String(latitude),
            lng: String(longitude),
            language: "en",
          });

          const response = await fetch(
            `/api/google-places/geocode?${params.toString()}`,
            { cache: "no-store" }
          );

          const json = await response.json();
          const first =
            Array.isArray(json.results)
              ? json.results[0]
              : null;

          label = String(
            first?.formatted_address || label
          ).trim();
        } catch {
          // GPS coordinates remain authoritative.
        }

        setLocationGateBusy117(false);

        await applyCustomerLocation117(
          {
            latitude,
            longitude,
            label,
            source: "gps",
          },
          false
        );
      },
      (error) => {
        setLocationGateBusy117(false);
        setLocationGateError117(
          error.message ||
            "Could not get your current location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 20_000,
        maximumAge: 0,
      }
    );
  }

  async function searchCustomerLocation117() {
    const query = locationSearch117.trim();

    if (query.length < 3) {
      setLocationGateError117(
        "Type at least 3 characters to search Google Maps."
      );
      return;
    }

    setLocationSearchBusy117(true);
    setLocationGateError117("");

    try {
      const params = new URLSearchParams({
        input: query,
        language: "en",
      });

      const response = await fetch(
        `/api/google-places/autocomplete?${params.toString()}`,
        { cache: "no-store" }
      );

      const json = await response.json();

      if (
        json.status !== "OK" &&
        json.status !== "ZERO_RESULTS"
      ) {
        throw new Error(
          json.error_message ||
            "Google Maps search failed."
        );
      }

      const predictions =
        Array.isArray(json.predictions)
          ? json.predictions
              .slice(0, 6)
              .map((item: unknown) => {
                const row =
                  item &&
                  typeof item === "object"
                    ? (item as Record<
                        string,
                        unknown
                      >)
                    : {};

                const structured =
                  row.structured_formatting &&
                  typeof row.structured_formatting ===
                    "object"
                    ? (row.structured_formatting as Record<
                        string,
                        unknown
                      >)
                    : {};

                return {
                  place_id: String(
                    row.place_id ?? ""
                  ),
                  description: String(
                    row.description ?? ""
                  ),
                  structured_formatting: {
                    main_text: String(
                      structured.main_text ?? ""
                    ),
                    secondary_text: String(
                      structured.secondary_text ?? ""
                    ),
                  },
                };
              })
              .filter(
                (
                  prediction: DarikGooglePrediction117
                ) =>
                  prediction.place_id &&
                  prediction.description
              )
          : [];

      setLocationPredictions117(predictions);

      if (!predictions.length) {
        setLocationGateError117(
          "No matching Google Maps locations found."
        );
      }
    } catch (caught) {
      setLocationPredictions117([]);
      setLocationGateError117(
        caught instanceof Error
          ? caught.message
          : "Google Maps search failed."
      );
    } finally {
      setLocationSearchBusy117(false);
    }
  }

  async function chooseCustomerPlace117(
    prediction: DarikGooglePrediction117
  ) {
    setLocationSearchBusy117(true);
    setLocationGateError117("");

    try {
      const params = new URLSearchParams({
        place_id: prediction.place_id,
        language: "en",
      });

      const response = await fetch(
        `/api/google-places/details?${params.toString()}`,
        { cache: "no-store" }
      );

      const json = await response.json();
      const point =
        json.result?.geometry?.location;

      if (
        json.status !== "OK" ||
        !point
      ) {
        throw new Error(
          json.error_message ||
            "Google Maps did not return this location."
        );
      }

      const latitude = Number(point.lat);
      const longitude = Number(point.lng);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        throw new Error(
          "Google Maps returned invalid coordinates."
        );
      }

      const label = String(
        json.result?.formatted_address ||
          prediction.description ||
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      ).trim();

      setLocationSearch117(label);
      setLocationPredictions117([]);

      await applyCustomerLocation117(
        {
          latitude,
          longitude,
          label,
          source: "google_search",
        },
        false
      );
    } catch (caught) {
      setLocationGateError117(
        caught instanceof Error
          ? caught.message
          : "Could not use this Google Maps location."
      );
    } finally {
      setLocationSearchBusy117(false);
    }
  }
  // DARIK_BROWSE_STORE_FOR_PICKUP_118
  const [pickupBrowse118, setPickupBrowse118] =
    useState(false);

  // DARIK_STICKY_PICKUP_AND_ADD_TO_BAG_FEEDBACK_119
  useEffect(() => {
    if (!pickupBrowse118) {
      return;
    }

    /*
      Pickup browsing is an explicit customer choice for this store visit.
      Product-detail/cart code must not silently flip them back to delivery.
      Only switchPickupBrowseToDelivery118() is allowed to leave pickup mode.
    */
    setLocationGateOpen117(false);

    if (
      checkoutForm.fulfillmentMethod !== "pickup" ||
      checkoutForm.latitude !== null ||
      checkoutForm.longitude !== null
    ) {
      setCheckoutForm((current) => {
        if (
          current.fulfillmentMethod === "pickup" &&
          current.latitude === null &&
          current.longitude === null
        ) {
          return current;
        }

        return {
          ...current,
          fulfillmentMethod: "pickup",
          latitude: null,
          longitude: null,
        };
      });
    }
  }, [
    pickupBrowse118,
    checkoutForm.fulfillmentMethod,
    checkoutForm.latitude,
    checkoutForm.longitude,
  ]);

  function browseStoreForPickup118() {
    try {
      if (slug) {
        window.sessionStorage.setItem(
          darikPickupBrowseSessionKey120(slug),
          "1"
        );
      }
    } catch {
      // Pickup browsing still works even if session storage is unavailable.
    }

    setPickupBrowse118(true);
    setCustomerLocation117(null);
    setDeliveryMatch117(null);
    setLocationGateError117("");
    setLocationPredictions117([]);
    setLocationSearch117("");
    setLocationGateOpen117(false);

    setCheckoutForm((current) => ({
      ...current,
      fulfillmentMethod: "pickup",
      latitude: null,
      longitude: null,
    }));
  }

  function switchPickupBrowseToDelivery118() {
    try {
      if (slug) {
        window.sessionStorage.removeItem(
          darikPickupBrowseSessionKey120(slug)
        );
      }
    } catch {
      // Continue with delivery selection.
    }

    const existingSessionLocation120 =
      readDarikCustomerLocationSession120();

    if (existingSessionLocation120) {
      setPickupBrowse118(false);
      setLocationGateOpen117(false);
      void applyCustomerLocation117(
        existingSessionLocation120,
        true
      );
      return;
    }

    setPickupBrowse118(false);
    setCustomerLocation117(null);
    setDeliveryMatch117(null);
    setLocationGateError117("");
    setLocationPredictions117([]);
    setLocationSearch117("");
    setLocationGateOpen117(true);

    setCheckoutForm((current) => ({
      ...current,
      fulfillmentMethod: "delivery",
      latitude: null,
      longitude: null,
    }));
  }



  // DARIK_DARIK_ACCOUNT_OR_GUEST_CHECKOUT_121
  type DarikCheckoutIdentity121 = "choice" | "guest" | "login" | "signup" | "account";
  type DarikSignupStep121 = "details" | "email_code" | "phone_code";
  type DarikCustomerProfile121 = {
    id: string;
    auth_user_id?: string | null;
    email?: string | null;
    full_name?: string | null;
    phone?: string | null;
  };

  const [darikCheckoutIdentity121, setDarikCheckoutIdentity121] =
    useState<DarikCheckoutIdentity121>("choice");
  const [darikCustomerUser121, setDarikCustomerUser121] = useState<any>(null);
  const [darikCustomerProfile121, setDarikCustomerProfile121] =
    useState<DarikCustomerProfile121 | null>(null);
  const [darikNonCustomerSession121, setDarikNonCustomerSession121] =
    useState(false);
  const [darikAuthBusy121, setDarikAuthBusy121] = useState(false);
  const [darikAuthMessage121, setDarikAuthMessage121] = useState("");

  const [darikLoginEmail121, setDarikLoginEmail121] = useState("");
  const [darikLoginPassword121, setDarikLoginPassword121] = useState("");

  const [darikSignupName121, setDarikSignupName121] = useState("");
  const [darikSignupPhone121, setDarikSignupPhone121] = useState("");
  const [darikSignupEmail121, setDarikSignupEmail121] = useState("");
  const [darikSignupPassword121, setDarikSignupPassword121] = useState("");
  const [darikSignupPasswordConfirm121, setDarikSignupPasswordConfirm121] =
    useState("");
  const [darikSignupEmailCode121, setDarikSignupEmailCode121] = useState("");
  const [darikSignupPhoneCode121, setDarikSignupPhoneCode121] = useState("");
  const [darikSignupStep121, setDarikSignupStep121] =
    useState<DarikSignupStep121>("details");
  const [darikPendingPhoneSession121, setDarikPendingPhoneSession121] =
    useState<any>(null);

  function normalizeDarikCustomerPhone121(rawPhone: string) {
    const digits = String(rawPhone ?? "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("962")) return "+" + digits;
    if (digits.startsWith("0") && digits.length >= 9) {
      return "+962" + digits.slice(1);
    }
    if (digits.length === 9 && digits.startsWith("7")) {
      return "+962" + digits;
    }
    if (String(rawPhone ?? "").trim().startsWith("+")) {
      return String(rawPhone ?? "").trim();
    }
    return "+" + digits;
  }

  function validateStrongDarikCustomerPassword121(password: string) {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  function prefillCheckoutFromDarikCustomer121(
    profile: DarikCustomerProfile121,
    fallbackName = "",
    fallbackPhone = ""
  ) {
    setCheckoutForm((current) => ({
      ...current,
      customerName:
        current.customerName.trim() ||
        String(profile.full_name ?? fallbackName ?? "").trim(),
      customerPhone:
        current.customerPhone.trim() ||
        String(profile.phone ?? fallbackPhone ?? "").trim(),
    }));
  }

  async function readDarikCustomerProfile121(user: any) {
    if (!user?.id) return null;

    const result = await supabase
      .from("customers")
      .select("id,auth_user_id,email,full_name,phone")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (result.error) {
      setDarikAuthMessage121(result.error.message);
      return null;
    }

    return (result.data as DarikCustomerProfile121 | null) ?? null;
  }

  async function ensureDarikCustomerProfile121(
    user: any,
    fallbackName = "",
    fallbackPhone = ""
  ) {
    const existing = await readDarikCustomerProfile121(user);
    if (existing?.id) {
      setDarikCustomerProfile121(existing);
      setDarikNonCustomerSession121(false);
      setDarikCheckoutIdentity121("account");
      prefillCheckoutFromDarikCustomer121(existing, fallbackName, fallbackPhone);
      return existing;
    }

    const phone = normalizeDarikCustomerPhone121(
      fallbackPhone || String(user?.user_metadata?.phone ?? "")
    );
    const name = String(
      fallbackName || user?.user_metadata?.full_name || user?.email || ""
    ).trim();

    if (!phone) {
      setDarikAuthMessage121(
        "This Darik login does not have a customer phone profile yet. You can continue as guest or finish customer signup."
      );
      return null;
    }

    const rpcResult = await supabase.rpc("customer_ensure_profile_v1", {
      p_email: String(user?.email ?? "").trim().toLowerCase(),
      p_full_name: name,
      p_phone: phone,
    });

    if (rpcResult.error || !rpcResult.data) {
      setDarikAuthMessage121(
        rpcResult.error?.message || "Could not finish the Darik customer profile."
      );
      return null;
    }

    const rpcRow = Array.isArray(rpcResult.data)
      ? rpcResult.data[0]
      : rpcResult.data;
    const profile = ((rpcRow as any)?.profile ?? rpcRow) as DarikCustomerProfile121;

    if (!profile?.id) {
      setDarikAuthMessage121("Darik customer profile was not returned.");
      return null;
    }

    setDarikCustomerProfile121(profile);
    setDarikNonCustomerSession121(false);
    setDarikCheckoutIdentity121("account");
    prefillCheckoutFromDarikCustomer121(profile, name, phone);
    return profile;
  }

  async function inspectDarikSession121(user: any) {
    setDarikCustomerUser121(user ?? null);

    if (!user?.id) {
      setDarikCustomerProfile121(null);
      setDarikNonCustomerSession121(false);
      setDarikCheckoutIdentity121((current) =>
        current === "guest" || current === "login" || current === "signup"
          ? current
          : "choice"
      );
      return;
    }

    const profile = await readDarikCustomerProfile121(user);
    if (profile?.id) {
      setDarikCustomerProfile121(profile);
      setDarikNonCustomerSession121(false);
      setDarikCheckoutIdentity121("account");
      prefillCheckoutFromDarikCustomer121(profile);
      return;
    }

    // Retailer/staff sessions can exist on the same getdarik.com origin.
    // Do not silently turn those users into customer accounts.
    setDarikCustomerProfile121(null);
    setDarikNonCustomerSession121(true);
    setDarikCheckoutIdentity121((current) =>
      current === "guest" || current === "login" || current === "signup"
        ? current
        : "choice"
    );
  }

  useEffect(() => {
    if (darikIsBuilderPreview120()) return;

    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      void inspectDarikSession121(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        window.setTimeout(() => {
          if (active) void inspectDarikSession121(session?.user ?? null);
        }, 0);
      }
    );

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function clearNonCustomerAuthBeforeCustomerAction121() {
    if (darikCustomerUser121 && !darikCustomerProfile121) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setDarikCustomerUser121(null);
      setDarikNonCustomerSession121(false);
    }
  }

  async function chooseDarikGuestCheckout121() {
    setDarikAuthMessage121("");

    if (darikCustomerProfile121) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setDarikAuthMessage121(error.message);
        return;
      }
      setDarikCustomerUser121(null);
      setDarikCustomerProfile121(null);
    }

    setDarikCheckoutIdentity121("guest");
  }

  async function signInDarikCustomer121() {
    const email = darikLoginEmail121.trim().toLowerCase();
    if (!email || darikLoginPassword121.length < 6) {
      setDarikAuthMessage121("Enter your Darik account email and password.");
      return;
    }

    setDarikAuthBusy121(true);
    setDarikAuthMessage121("");

    try {
      await clearNonCustomerAuthBeforeCustomerAction121();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: darikLoginPassword121,
      });

      if (error || !data.user) {
        throw error ?? new Error("Could not sign in to this Darik account.");
      }

      setDarikCustomerUser121(data.user);
      const profile = await ensureDarikCustomerProfile121(
        data.user,
        String(data.user.user_metadata?.full_name ?? ""),
        String(data.user.user_metadata?.phone ?? "")
      );

      if (!profile?.id) {
        throw new Error(
          "This login is valid, but Darik could not load the customer profile. You can continue as guest."
        );
      }

      setDarikLoginPassword121("");
      setDarikAuthMessage121(
        "Signed in. This Darik account works across every Darik-powered store."
      );
    } catch (error) {
      setDarikAuthMessage121(
        error instanceof Error ? error.message : "Darik sign-in failed."
      );
    } finally {
      setDarikAuthBusy121(false);
    }
  }

  function validateDarikSignup121() {
    const name = darikSignupName121.trim();
    const phone = normalizeDarikCustomerPhone121(darikSignupPhone121);
    const email = darikSignupEmail121.trim().toLowerCase();

    if (name.length < 2 || phone.length < 8 || !email || !darikSignupPassword121) {
      setDarikAuthMessage121("Enter your name, phone, email, and password.");
      return null;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setDarikAuthMessage121("Enter a valid email address.");
      return null;
    }

    if (!validateStrongDarikCustomerPassword121(darikSignupPassword121)) {
      setDarikAuthMessage121(
        "Password must be at least 8 characters with a capital letter, number, and special character."
      );
      return null;
    }

    if (darikSignupPassword121 !== darikSignupPasswordConfirm121) {
      setDarikAuthMessage121("Passwords do not match.");
      return null;
    }

    return { name, phone, email };
  }

  async function startDarikCustomerSignup121() {
    const details = validateDarikSignup121();
    if (!details) return;

    setDarikAuthBusy121(true);
    setDarikAuthMessage121("");

    try {
      await clearNonCustomerAuthBeforeCustomerAction121();

      const availability = await supabase.rpc("customer_can_signup_v37", {
        p_email: details.email,
        p_phone: details.phone,
      });

      if (availability.error) throw availability.error;

      const availabilityRow = Array.isArray(availability.data)
        ? availability.data[0]
        : availability.data;

      if ((availabilityRow as any)?.allowed === false) {
        throw new Error(
          String(
            (availabilityRow as any)?.reason ||
              "This email or phone number is already registered."
          )
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: darikSignupPassword121,
        options: {
          data: {
            full_name: details.name,
            phone: details.phone,
          },
        },
      });

      if (error || !data.user) {
        throw error ?? new Error("Could not create the Darik account.");
      }

      if (data.session?.user) {
        setDarikPendingPhoneSession121(data.session);
        setDarikCustomerUser121(data.session.user);

        const phoneResult = await supabase.auth.updateUser({ phone: details.phone });
        if (phoneResult.error) throw phoneResult.error;

        setDarikSignupStep121("phone_code");
        setDarikAuthMessage121(
          "Email is ready. Enter the SMS code sent to your phone to finish your Darik account."
        );
        return;
      }

      setDarikSignupStep121("email_code");
      setDarikAuthMessage121(
        "We sent a confirmation code to your email. Enter it below, then Darik will confirm your phone."
      );
    } catch (error) {
      setDarikAuthMessage121(
        error instanceof Error ? error.message : "Darik signup failed."
      );
    } finally {
      setDarikAuthBusy121(false);
    }
  }

  async function confirmDarikSignupEmail121() {
    const details = validateDarikSignup121();
    if (!details) return;
    const token = darikSignupEmailCode121.trim();

    if (token.length < 4) {
      setDarikAuthMessage121("Enter the confirmation code sent to your email.");
      return;
    }

    setDarikAuthBusy121(true);
    setDarikAuthMessage121("");

    try {
      let verifyResult = await supabase.auth.verifyOtp({
        email: details.email,
        token,
        type: "signup",
      });

      if (verifyResult.error || !verifyResult.data.session?.user) {
        verifyResult = await supabase.auth.verifyOtp({
          email: details.email,
          token,
          type: "email" as any,
        });
      }

      if (verifyResult.error || !verifyResult.data.session?.user) {
        throw (
          verifyResult.error ?? new Error("Could not confirm this email code.")
        );
      }

      const session = verifyResult.data.session;
      setDarikPendingPhoneSession121(session);
      setDarikCustomerUser121(session.user);

      const phoneResult = await supabase.auth.updateUser({ phone: details.phone });
      if (phoneResult.error) throw phoneResult.error;

      setDarikSignupStep121("phone_code");
      setDarikAuthMessage121(
        "Email confirmed. Enter the SMS code sent to your phone to finish the account."
      );
    } catch (error) {
      setDarikAuthMessage121(
        error instanceof Error ? error.message : "Email confirmation failed."
      );
    } finally {
      setDarikAuthBusy121(false);
    }
  }

  async function confirmDarikSignupPhone121() {
    const details = validateDarikSignup121();
    if (!details) return;
    const token = darikSignupPhoneCode121.trim();

    if (token.length < 4) {
      setDarikAuthMessage121("Enter the SMS code sent to your phone.");
      return;
    }

    setDarikAuthBusy121(true);
    setDarikAuthMessage121("");

    try {
      const verifyResult = await supabase.auth.verifyOtp({
        phone: details.phone,
        token,
        type: "phone_change" as any,
      });

      if (verifyResult.error) throw verifyResult.error;

      const activeSession =
        verifyResult.data.session ?? darikPendingPhoneSession121;
      const activeUser = verifyResult.data.user ?? activeSession?.user;

      if (!activeUser) {
        throw new Error(
          "Phone was confirmed, but Darik could not finish the account session. Sign in with your email and password."
        );
      }

      setDarikCustomerUser121(activeUser);
      const profile = await ensureDarikCustomerProfile121(
        activeUser,
        details.name,
        details.phone
      );

      if (!profile?.id) {
        throw new Error("Darik could not finish the customer profile.");
      }

      setDarikSignupPassword121("");
      setDarikSignupPasswordConfirm121("");
      setDarikSignupEmailCode121("");
      setDarikSignupPhoneCode121("");
      setDarikSignupStep121("details");
      setDarikPendingPhoneSession121(null);
      setDarikAuthMessage121(
        "Darik account created. You are signed in across Darik storefronts."
      );
    } catch (error) {
      setDarikAuthMessage121(
        error instanceof Error ? error.message : "Phone confirmation failed."
      );
    } finally {
      setDarikAuthBusy121(false);
    }
  }

  async function signOutDarikCustomer121() {
    setDarikAuthBusy121(true);
    setDarikAuthMessage121("");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setDarikCustomerUser121(null);
      setDarikCustomerProfile121(null);
      setDarikNonCustomerSession121(false);
      setDarikCheckoutIdentity121("guest");
      setDarikAuthMessage121("Signed out. Continuing as guest.");
    } catch (error) {
      setDarikAuthMessage121(
        error instanceof Error ? error.message : "Could not sign out."
      );
    } finally {
      setDarikAuthBusy121(false);
    }
  }



  // DARIK_CHECKOUT_GOOGLE_MAP_PIN_AND_ORDER_ERRORS_122
  const [checkoutLocationDraft122, setCheckoutLocationDraft122] =
    useState<DarikCustomerLocation117 | null>(null);
  const [checkoutLocationQuery122, setCheckoutLocationQuery122] =
    useState("");
  const [checkoutLocationPredictions122, setCheckoutLocationPredictions122] =
    useState<DarikGooglePrediction117[]>([]);
  const [checkoutLocationSearchBusy122, setCheckoutLocationSearchBusy122] =
    useState(false);
  const [checkoutLocationBusy122, setCheckoutLocationBusy122] =
    useState(false);
  const [checkoutLocationError122, setCheckoutLocationError122] =
    useState("");
  const [checkoutLocationConfirmed122, setCheckoutLocationConfirmed122] =
    useState(false);
  const [checkoutMapDragOffset122, setCheckoutMapDragOffset122] =
    useState({ x: 0, y: 0 });
  const checkoutMapDragRef122 = useRef<{
    pointerId: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  function darikCheckoutErrorMessage122(caught: unknown) {
    if (
      caught instanceof Error &&
      String(caught.message ?? "").trim()
    ) {
      return caught.message.trim();
    }

    if (caught && typeof caught === "object") {
      const row = caught as Record<string, unknown>;
      const message = String(row.message ?? "").trim();
      const details = String(row.details ?? "").trim();
      const hint = String(row.hint ?? "").trim();
      const code = String(row.code ?? "").trim();

      const useful = [message, details, hint].filter(
        (value) => value && value !== "null"
      );

      if (useful.length) {
        return useful.join(" ");
      }

      if (code) {
        return `Order error ${code}.`;
      }
    }

    const text = String(caught ?? "").trim();

    if (text && text !== "[object Object]") {
      return text;
    }

    return "The order could not be submitted.";
  }

  function stageCheckoutLocation122(
    location: DarikCustomerLocation117
  ) {
    setCheckoutLocationDraft122(location);
    setCheckoutLocationQuery122(location.label);
    setCheckoutLocationPredictions122([]);
    setCheckoutLocationError122("");
    setCheckoutLocationConfirmed122(false);
    setCheckoutMapDragOffset122({ x: 0, y: 0 });

    setCheckoutForm((current) =>
      current.fulfillmentMethod === "delivery"
        ? {
            ...current,
            latitude: null,
            longitude: null,
          }
        : current
    );
  }

  useEffect(() => {
    if (!customerLocation117) return;

    setCheckoutLocationDraft122(customerLocation117);
    setCheckoutLocationQuery122(customerLocation117.label);

    const sameLatitude =
      checkoutForm.latitude !== null &&
      Math.abs(
        Number(checkoutForm.latitude) -
          customerLocation117.latitude
      ) < 0.0000001;
    const sameLongitude =
      checkoutForm.longitude !== null &&
      Math.abs(
        Number(checkoutForm.longitude) -
          customerLocation117.longitude
      ) < 0.0000001;

    setCheckoutLocationConfirmed122(
      sameLatitude && sameLongitude && Boolean(deliveryMatch117)
    );
  }, [
    customerLocation117?.latitude,
    customerLocation117?.longitude,
    customerLocation117?.label,
    customerLocation117?.source,
    deliveryMatch117?.slug,
  ]);

  async function reverseGeocodeCheckoutLocation122(
    latitude: number,
    longitude: number,
    fallbackLabel: string
  ) {
    try {
      const params = new URLSearchParams({
        lat: String(latitude),
        lng: String(longitude),
        language: "en",
      });

      const response = await fetch(
        `/api/google-places/geocode?${params.toString()}`,
        { cache: "no-store" }
      );
      const json = await response.json();
      const first =
        Array.isArray(json.results) && json.results.length
          ? json.results[0]
          : null;

      return String(
        first?.formatted_address || fallbackLabel
      ).trim();
    } catch {
      return fallbackLabel;
    }
  }

  function useCheckoutCurrentLocation122() {
    if (checkoutLocationBusy122) return;

    if (!navigator.geolocation) {
      setCheckoutLocationError122(
        "Location access is not available in this browser. Search Google instead. / خدمة الموقع غير متاحة. ابحث في جوجل."
      );
      return;
    }

    setCheckoutLocationBusy122(true);
    setCheckoutLocationError122("");
    setCheckoutLocationPredictions122([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const fallback =
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        const label = await reverseGeocodeCheckoutLocation122(
          latitude,
          longitude,
          fallback
        );

        stageCheckoutLocation122({
          latitude,
          longitude,
          label,
          source: "gps",
        });

        setCheckoutLocationBusy122(false);
      },
      (error) => {
        setCheckoutLocationBusy122(false);
        setCheckoutLocationError122(
          error.message ||
            "Could not get your current location. / تعذر تحديد موقعك الحالي."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 20_000,
        maximumAge: 0,
      }
    );
  }

  async function searchCheckoutLocation122() {
    const query = checkoutLocationQuery122.trim();

    if (query.length < 3) {
      setCheckoutLocationError122(
        "Type at least 3 characters to search Google Maps. / اكتب 3 أحرف على الأقل للبحث."
      );
      return;
    }

    setCheckoutLocationSearchBusy122(true);
    setCheckoutLocationError122("");

    try {
      const params = new URLSearchParams({
        input: query,
        language: "en",
      });

      const response = await fetch(
        `/api/google-places/autocomplete?${params.toString()}`,
        { cache: "no-store" }
      );
      const json = await response.json();

      if (
        json.status !== "OK" &&
        json.status !== "ZERO_RESULTS"
      ) {
        throw new Error(
          json.error_message || "Google Maps search failed."
        );
      }

      const predictions: DarikGooglePrediction117[] =
        Array.isArray(json.predictions)
          ? json.predictions
              .slice(0, 6)
              .map((item: unknown) => {
                const row =
                  item && typeof item === "object"
                    ? (item as Record<string, unknown>)
                    : {};
                const structured =
                  row.structured_formatting &&
                  typeof row.structured_formatting === "object"
                    ? (row.structured_formatting as Record<
                        string,
                        unknown
                      >)
                    : {};

                return {
                  place_id: String(row.place_id ?? ""),
                  description: String(row.description ?? ""),
                  structured_formatting: {
                    main_text: String(
                      structured.main_text ?? ""
                    ),
                    secondary_text: String(
                      structured.secondary_text ?? ""
                    ),
                  },
                };
              })
              .filter(
                (prediction: DarikGooglePrediction117) =>
                  Boolean(
                    prediction.place_id &&
                      prediction.description
                  )
              )
          : [];

      setCheckoutLocationPredictions122(predictions);

      if (!predictions.length) {
        setCheckoutLocationError122(
          "No matching Google Maps locations found. / لم يتم العثور على موقع مطابق."
        );
      }
    } catch (caught) {
      setCheckoutLocationPredictions122([]);
      setCheckoutLocationError122(
        darikCheckoutErrorMessage122(caught)
      );
    } finally {
      setCheckoutLocationSearchBusy122(false);
    }
  }

  async function chooseCheckoutPlace122(
    prediction: DarikGooglePrediction117
  ) {
    setCheckoutLocationSearchBusy122(true);
    setCheckoutLocationError122("");

    try {
      const params = new URLSearchParams({
        place_id: prediction.place_id,
        language: "en",
      });

      const response = await fetch(
        `/api/google-places/details?${params.toString()}`,
        { cache: "no-store" }
      );
      const json = await response.json();
      const point = json.result?.geometry?.location;

      if (json.status !== "OK" || !point) {
        throw new Error(
          json.error_message ||
            "Google Maps did not return this location."
        );
      }

      const latitude = Number(point.lat);
      const longitude = Number(point.lng);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        throw new Error(
          "Google Maps returned invalid coordinates."
        );
      }

      const label = String(
        json.result?.formatted_address ||
          prediction.description ||
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      ).trim();

      stageCheckoutLocation122({
        latitude,
        longitude,
        label,
        source: "google_search",
      });
    } catch (caught) {
      setCheckoutLocationError122(
        darikCheckoutErrorMessage122(caught)
      );
    } finally {
      setCheckoutLocationSearchBusy122(false);
    }
  }

  function darikCheckoutMapUrl122(
    location: DarikCustomerLocation117
  ) {
    const point =
      `${location.latitude},${location.longitude}`;

    return (
      "https://www.google.com/maps?q=" +
      encodeURIComponent(point) +
      "&z=17&output=embed"
    );
  }

  function shiftCheckoutLocationByPixels122(
    location: DarikCustomerLocation117,
    dx: number,
    dy: number
  ): DarikCustomerLocation117 {
    const zoom = 17;
    const worldSize = 256 * Math.pow(2, zoom);
    const safeLatitude = Math.max(
      -85.05112878,
      Math.min(85.05112878, location.latitude)
    );
    const latitudeRadians =
      (safeLatitude * Math.PI) / 180;
    const sinLatitude = Math.sin(latitudeRadians);

    const worldX =
      ((location.longitude + 180) / 360) * worldSize;
    const worldY =
      (0.5 -
        Math.log(
          (1 + sinLatitude) / (1 - sinLatitude)
        ) /
          (4 * Math.PI)) *
      worldSize;

    const nextX = worldX + dx;
    const nextY = worldY + dy;
    const longitude =
      (nextX / worldSize) * 360 - 180;
    const mercatorN =
      Math.PI - (2 * Math.PI * nextY) / worldSize;
    const latitude =
      (180 / Math.PI) *
      Math.atan(Math.sinh(mercatorN));

    return {
      latitude: Math.max(-90, Math.min(90, latitude)),
      longitude:
        ((longitude + 540) % 360) - 180,
      label:
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      source: "google_search",
    };
  }

  function checkoutMapPointerOffset122(
    event: any
  ) {
    const drag = checkoutMapDragRef122.current;
    if (!drag) return { x: 0, y: 0 };

    const centerX = drag.left + drag.width / 2;
    const centerY = drag.top + drag.height / 2;
    const halfWidth = Math.max(1, drag.width / 2 - 8);
    const halfHeight = Math.max(1, drag.height / 2 - 8);

    return {
      x: Math.max(
        -halfWidth,
        Math.min(
          halfWidth,
          Number(event.clientX) - centerX
        )
      ),
      y: Math.max(
        -halfHeight,
        Math.min(
          halfHeight,
          Number(event.clientY) - centerY
        )
      ),
    };
  }

  function startCheckoutMapPinMove122(event: any) {
    if (!checkoutLocationDraft122) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    checkoutMapDragRef122.current = {
      pointerId: event.pointerId,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    try {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is best effort.
    }

    setCheckoutMapDragOffset122(
      checkoutMapPointerOffset122(event)
    );
  }

  function moveCheckoutMapPin122(event: any) {
    const drag = checkoutMapDragRef122.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setCheckoutMapDragOffset122(
      checkoutMapPointerOffset122(event)
    );
  }

  async function finishCheckoutMapPinMove122(
    event: any
  ) {
    const drag = checkoutMapDragRef122.current;

    if (
      !drag ||
      drag.pointerId !== event.pointerId ||
      !checkoutLocationDraft122
    ) {
      return;
    }

    const offset = checkoutMapPointerOffset122(event);
    const previous = checkoutLocationDraft122;

    checkoutMapDragRef122.current = null;
    setCheckoutMapDragOffset122({ x: 0, y: 0 });

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Nothing to release.
    }

    const moved = shiftCheckoutLocationByPixels122(
      previous,
      offset.x,
      offset.y
    );
    const fallback =
      `${moved.latitude.toFixed(6)}, ${moved.longitude.toFixed(6)}`;
    const label = await reverseGeocodeCheckoutLocation122(
      moved.latitude,
      moved.longitude,
      fallback
    );

    stageCheckoutLocation122({
      ...moved,
      label,
      source: "google_search",
    });
  }

  function cancelCheckoutMapPinMove122() {
    checkoutMapDragRef122.current = null;
    setCheckoutMapDragOffset122({ x: 0, y: 0 });
  }

  async function confirmCheckoutLocation122() {
    const location = checkoutLocationDraft122;

    if (!location || !slug) {
      setCheckoutLocationError122(
        "Choose a delivery location first. / اختر موقع التوصيل أولاً."
      );
      return;
    }

    setCheckoutLocationBusy122(true);
    setCheckoutLocationError122("");

    try {
      const result = await supabase.rpc(
        "darik_direct_nearby_storefronts",
        {
          p_latitude: location.latitude,
          p_longitude: location.longitude,
          p_limit: 200,
        }
      );

      if (result.error) {
        throw result.error;
      }

      const rows = Array.isArray(result.data)
        ? (result.data as DarikNearbyStoreMatch117[])
        : [];
      const match =
        rows.find(
          (row) =>
            String(row.slug ?? "")
              .trim()
              .toLowerCase() ===
            slug.trim().toLowerCase()
        ) ?? null;

      if (!match) {
        setDeliveryMatch117(null);
        setCheckoutLocationConfirmed122(false);
        setCheckoutForm((current) => ({
          ...current,
          fulfillmentMethod: "delivery",
          latitude: null,
          longitude: null,
        }));
        setCheckoutLocationError122(
          "This pin is outside this store's delivery zones. Move the pin or search another location. / هذا الموقع خارج مناطق توصيل المتجر. حرّك العلامة أو اختر موقعاً آخر."
        );
        return;
      }

      writeDarikCustomerLocationSession120(location);

      try {
        window.sessionStorage.removeItem(
          darikPickupBrowseSessionKey120(slug)
        );
      } catch {
        // Session pickup override is best effort only.
      }

      setPickupBrowse118(false);
      setCustomerLocation117(location);
      setDeliveryMatch117(match);
      setLocationGateOpen117(false);
      setLocationGateBusy117(false);
      setLocationGateError117("");
      setLocationPredictions117([]);
      setLocationSearch117(location.label);
      setCheckoutForm((current) => ({
        ...current,
        fulfillmentMethod: "delivery",
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      setCheckoutLocationConfirmed122(true);
      setCheckoutLocationError122("");
    } catch (caught) {
      setCheckoutLocationConfirmed122(false);
      setCheckoutLocationError122(
        darikCheckoutErrorMessage122(caught)
      );
    } finally {
      setCheckoutLocationBusy122(false);
    }
  }

  const deliveryEnabled = storefront?.delivery_enabled !== false;
  const pickupEnabled = storefront?.pickup_enabled === true;
  const pickupOnly = Boolean(storefront && !deliveryEnabled && pickupEnabled);
  const selectedPickup = checkoutForm.fulfillmentMethod === "pickup";
  const matchedDeliveryFee117 = Number(
    deliveryMatch117?.delivery_fee ??
      storefront?.delivery_fee ??
      0
  );
  const matchedMinimumOrder117 = Number(
    deliveryMatch117?.minimum_order ??
      storefront?.minimum_order ??
      0
  );
  const deliveryFee =
    deliveryEnabled && !selectedPickup
      ? matchedDeliveryFee117
      : 0;
  const orderTotal = cartSubtotal + deliveryFee;
  const minimumOrder = matchedMinimumOrder117;
  const minimumReached = cartSubtotal >= minimumOrder;
  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) ?? null,
    [activeProductId, products]
  );

  function openProductDetail(product: Product) {
    setActiveProductId(product.id);

    const url = new URL(window.location.href);
    url.searchParams.set("product", product.id);
    window.history.replaceState(window.history.state, "", url.toString());
  }

  function closeProductDetail() {
    setActiveProductId("");

    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.replaceState(window.history.state, "", url.toString());
  }

  function addToCart(product: Product) {
    setOrderConfirmation(null);
    if ((product.direct_pricing_mode || "price") !== "price") return;
    if (
      product.direct_availability_status === "out_of_stock" ||
      (product.direct_inventory_tracking_enabled &&
        Number(product.quantity_in_stock ?? 0) <= 0)
    ) return;
    const price = Number(product.app_price ?? 0);
    if (!Number.isFinite(price) || price <= 0) return;

    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id);

      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name: productName(product),
          price,
          quantity: 1,
          photoUrl: productPhoto(product),
        },
      ];
    });
  }

  function changeQuantity(productId: string, change: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + change }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  function jumpToCatalog() {
    document.getElementById("catalog")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function updateCheckoutField<K extends keyof OnlineCheckoutForm>(
    field: K,
    value: OnlineCheckoutForm[K]
  ) {
    setCheckoutError("");
    setCheckoutForm((current) => ({ ...current, [field]: value }));
  }

  function captureExactLocation() {
    setCheckoutError("");

    if (!navigator.geolocation) {
      setCheckoutError(
        "Location access is not available in this browser. Call the store to order instead."
      );
      return;
    }

    setLocatingCustomer(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCheckoutForm((current) => ({
          ...current,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocatingCustomer(false);
      },
      () => {
        setCheckoutError(
          "We could not capture your exact location. Allow location access and try again."
        );
        setLocatingCustomer(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  function selectCliqReceipt(file: File | null) {
    setCheckoutError("");
    setCliqReceiptPath("");

    if (!file) {
      setCliqReceiptFile(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setCliqReceiptFile(null);
      setCheckoutError("Upload the CliQ receipt as a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setCliqReceiptFile(null);
      setCheckoutError("The CliQ receipt image must be smaller than 8 MB.");
      return;
    }

    setCliqReceiptFile(file);
  }

  async function uploadCliqReceipt() {
    if (!storefront || !cliqReceiptFile) {
      throw new Error("Upload the CliQ receipt before submitting the order.");
    }

    if (cliqReceiptPath) return cliqReceiptPath;

    const extension =
      cliqReceiptFile.type === "image/png"
        ? "png"
        : cliqReceiptFile.type === "image/webp"
          ? "webp"
          : "jpg";
    const receiptPath = `${storefront.retailer_id}/${crypto.randomUUID()}/receipt.${extension}`;
    const uploadResult = await supabase.storage
      .from("darik-direct-cliq-receipts")
      .upload(receiptPath, cliqReceiptFile, {
        cacheControl: "3600",
        contentType: cliqReceiptFile.type,
        upsert: false,
      });

    if (uploadResult.error) throw uploadResult.error;

    setCliqReceiptPath(receiptPath);
    return receiptPath;
  }

  async function placeOnlineOrder() {
    if (window.location.pathname === "/_darik-private-store-preview") {
      setCheckoutError(
        "Private storefront preview only - checkout cannot submit a real order."
      );
      return;
    }
    if (!storefront || placingOrder) return;

    const customerName = checkoutForm.customerName.trim();
    const customerPhone = checkoutForm.customerPhone.trim();
    const buildingNumber = checkoutForm.buildingNumber.trim();
    const apartmentNumber = checkoutForm.apartmentNumber.trim();
    const deliveryNote = checkoutForm.deliveryNote.trim();

    if (customerName.length < 2) {
      setCheckoutError("Enter your name.");
      return;
    }

    if (customerPhone.length < 7) {
      setCheckoutError("Enter a valid phone number.");
      return;
    }

    if (
      checkoutForm.fulfillmentMethod === "delivery" &&
      (checkoutForm.latitude == null || checkoutForm.longitude == null)
    ) {
      setCheckoutError("Use exact location before placing the delivery order.");
      return;
    }

    if (
      checkoutForm.paymentMethod === "cash" &&
      !storefront.cash_on_delivery_enabled
    ) {
      setCheckoutError("Cash is not available for this store.");
      return;
    }

    if (checkoutForm.paymentMethod === "cliq") {
      if (!storefront.cliq_enabled) {
        setCheckoutError("CliQ is not available for this store.");
        return;
      }

      if (!cliqReceiptFile && !cliqReceiptPath) {
        setCheckoutError("Upload the CliQ receipt before submitting the order.");
        return;
      }
    }

    if (buildingNumber.length > 60) {
      setCheckoutError("Building number is too long.");
      return;
    }

    if (apartmentNumber.length > 60) {
      setCheckoutError("Apartment number is too long.");
      return;
    }

    if (deliveryNote.length > 500) {
      setCheckoutError("Extra delivery details must be 500 characters or less.");
      return;
    }

    setPlacingOrder(true);
    setCheckoutError("");

    try {
      const receiptPath =
        checkoutForm.paymentMethod === "cliq"
          ? await uploadCliqReceipt()
          : null;

      const result = await supabase.rpc("darik_direct_place_online_order_v3", {
        p_storefront_slug: storefront.slug,
        p_customer_name: customerName,
        p_customer_phone: customerPhone,
        p_fulfillment_method: checkoutForm.fulfillmentMethod,
        p_delivery_latitude: checkoutForm.latitude,
        p_delivery_longitude: checkoutForm.longitude,
        p_items: cart.map((line) => ({
          product_id: line.productId,
          quantity: line.quantity,
        })),
        p_payment_method: checkoutForm.paymentMethod,
        p_cliq_receipt_path: receiptPath,
        p_building_number: buildingNumber || null,
        p_apartment_number: apartmentNumber || null,
        p_delivery_note: deliveryNote || null,
      });

      if (result.error) throw result.error;

      const response = result.data as {
        ok?: boolean;
        order_number?: string;
        total?: number | string;
        payment_method?: "cash" | "cliq";
        fulfillment_method?: "delivery" | "pickup";
      } | null;

      setOrderConfirmation({
        orderNumber: response?.order_number || "Order received",
        total: Number(response?.total ?? orderTotal),
        paymentMethod:
          response?.payment_method ?? checkoutForm.paymentMethod,
        fulfillmentMethod:
          response?.fulfillment_method ?? checkoutForm.fulfillmentMethod,
      });
      setCart([]);
      setOnlineCheckoutOpen(false);
      setCliqReceiptFile(null);
      setCliqReceiptPath("");
      setCheckoutForm((current) => ({
        ...current,
        customerName: "",
        customerPhone: "",
        buildingNumber: "",
        apartmentNumber: "",
        deliveryNote: "",
        latitude: null,
        longitude: null,
      }));
    } catch (error) {
      setCheckoutError(
        darikCheckoutErrorMessage122(error)
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <main className={styles.statePage}>
        <div className={styles.loadingBrand}>
          <div className={styles.spinner} />
          <span>Darik Direct</span>
        </div>
        <h1>Opening the store…</h1>
      </main>
    );
  }

  if (!storefront) {
    if (publicStatus) {
      const comingSoonTheme = {
        "--coming-primary": publicStatus.primary_color || "#111827",
        "--coming-accent": publicStatus.accent_color || "#178456",
      } as CSSProperties;

      return (
        <main className={styles.comingSoonPage} style={comingSoonTheme}>
          <section className={styles.comingSoonCard}>
            <a className={styles.comingSoonBrand} href="/">Darik Direct</a>
            <div className={styles.comingSoonLogo}>
              {publicStatus.logo_url ? (
                <img src={publicStatus.logo_url} alt={`${publicStatus.display_name} logo`} />
              ) : (
                <span>{publicStatus.display_name.slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <span className={styles.comingSoonType}>
              {(publicStatus.business_type || "local_store").replace(/_/g, " ")}
            </span>
            <h1>{publicStatus.display_name}</h1>
            {publicStatus.display_name_ar ? <h2 dir="rtl">{publicStatus.display_name_ar}</h2> : null}
            <p>
              {publicStatus.public_status === "unavailable"
                ? "This Darik store is temporarily unavailable."
                : "Coming soon on Darik. The store is preparing its catalog and delivery experience."}
            </p>
            <div className={styles.comingSoonLine} />
            <a className={styles.comingSoonHome} href="/">Explore Darik</a>
          </section>
        </main>
      );
    }

    return (
      <main className={styles.statePage}>
        <div className={styles.stateCard}>
          <span className={styles.stateBadge}>Darik Direct</span>
          <h1>Storefront unavailable</h1>
          <p>{loadError || "This storefront could not be found."}</p>
          <a href="/">Return to Darik</a>
        </div>
      </main>
    );
  }

  const effectiveStorefrontTypography =
    normalizeStorefrontTypography(
      (storefront as unknown as { direct_typography?: unknown }).direct_typography ??
        savedStorefrontTypography
    );

  // DARIK_CUSTOMER_FACING_NAME_FONT_PRIORITY_144
  const customerFacingNameFontKey144 =
    effectiveStorefrontTypography.display_name.font !== "theme"
      ? effectiveStorefrontTypography.display_name.font
      : effectiveStorefrontTypography.page.font;

  const customerFacingNameFontFamily144 =
    customerFacingNameFontKey144 !== "theme"
      ? storefrontTypographyFontFamilies[customerFacingNameFontKey144]
      : "";

  const customerFacingNameCss144 = customerFacingNameFontFamily144
    ? `#darik-customer-facing-store-name-144 {
        font-family: ${customerFacingNameFontFamily144} !important;
      }`
    : "";

  const [savedFreeformLayout146, setSavedFreeformLayout146] =
    useState<StorefrontFreeformLayout146>(() =>
      storefrontDefaultFreeformLayout146()
    );

  const [freeformMoveMode146, setFreeformMoveMode146] = useState(false);

  useEffect(() => {
    if (!isBuilderPositionPreview145) {
      setFreeformMoveMode146(false);
      return;
    }

    setFreeformMoveMode146(true);
  }, [isBuilderPositionPreview145]);

  useEffect(() => {
    if (!slug) {
      setSavedFreeformLayout146(storefrontDefaultFreeformLayout146());
      return;
    }

    let cancelled = false;

    void (async () => {
      const result = await supabase.rpc(
        "darik_direct_public_freeform_layout_v1",
        { p_slug: slug }
      );

      if (cancelled || result.error) return;

      setSavedFreeformLayout146(
        normalizeStorefrontFreeformLayout146(result.data)
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const storefrontFreeformRaw146 = (
    storefront as unknown as {
      direct_freeform_layout?: unknown;
    }
  ).direct_freeform_layout;

  const effectiveFreeformLayout146 = useMemo(
    () =>
      normalizeStorefrontFreeformLayout146(
        storefrontFreeformRaw146 ?? savedFreeformLayout146
      ),
    [storefrontFreeformRaw146, savedFreeformLayout146]
  );

  useEffect(() => {
    function handleFreeformModeMessage146(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "DARIK_FREEFORM_MOVE_MODE_146") return;
      if (!isBuilderPositionPreview145) return;

      setFreeformMoveMode146(Boolean(event.data?.enabled));
    }

    window.addEventListener("message", handleFreeformModeMessage146);

    if (isBuilderPositionPreview145) {
      window.parent.postMessage(
        { type: "DARIK_FREEFORM_EDITOR_READY_146" },
        window.location.origin
      );
    }

    return () =>
      window.removeEventListener(
        "message",
        handleFreeformModeMessage146
      );
  }, [isBuilderPositionPreview145]);

  useEffect(() => {
    const root = document.querySelector(
      '[data-darik-freeform-root146="true"]'
    );

    if (!(root instanceof HTMLElement)) return;

    let applyFrame146 = 0;

    function clearAppliedFreeform146() {
      root
        .querySelectorAll('[data-darik-freeform-applied146="true"]')
        .forEach((element) => {
          if (
            element instanceof HTMLElement ||
            element instanceof SVGElement
          ) {
            element.style.removeProperty("translate");
            element.removeAttribute("data-darik-freeform-applied146");
          }
        });
    }

    function applyFreeform146() {
      window.cancelAnimationFrame(applyFrame146);

      applyFrame146 = window.requestAnimationFrame(() => {
        clearAppliedFreeform146();

        const device =
          window.innerWidth <= 720 ? "mobile" : "desktop";

        const entries = effectiveFreeformLayout146[device];

        for (const [locator, point] of Object.entries(entries)) {
          if (!isSafeStorefrontFreeformLocator146(locator)) continue;

          let element: Element | null = null;

          try {
            element = root.querySelector(locator);
          } catch {
            element = null;
          }

          if (
            !element ||
            !(
              element instanceof HTMLElement ||
              element instanceof SVGElement
            )
          ) {
            continue;
          }

          element.style.setProperty(
            "translate",
            `${clampStorefrontFreeform146(point.x)}px ${clampStorefrontFreeform146(point.y)}px`,
            "important"
          );
          element.setAttribute(
            "data-darik-freeform-applied146",
            "true"
          );
        }
      });
    }

    applyFreeform146();

    const observer = new MutationObserver(() => applyFreeform146());
    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("resize", applyFreeform146);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyFreeform146);
      window.cancelAnimationFrame(applyFrame146);
    };
  }, [effectiveFreeformLayout146]);

  useEffect(() => {
    const root = document.querySelector(
      '[data-darik-freeform-root146="true"]'
    );

    if (!(root instanceof HTMLElement)) return;
    if (!isBuilderPositionPreview145 || !freeformMoveMode146) {
      root
        .querySelectorAll(
          '[data-darik-freeform-hover146="true"], [data-darik-freeform-dragging146="true"]'
        )
        .forEach((element) => {
          element.removeAttribute("data-darik-freeform-hover146");
          element.removeAttribute("data-darik-freeform-dragging146");
        });
      return;
    }

    type DragState146 = {
      target: HTMLElement | SVGElement;
      locator: string;
      label: string;
      device: "desktop" | "mobile";
      pointerId: number;
      startClientX: number;
      startClientY: number;
      baseX: number;
      baseY: number;
      x: number;
      y: number;
    };

    let drag146: DragState146 | null = null;
    let hover146: Element | null = null;

    function clearHover146() {
      if (hover146) {
        hover146.removeAttribute("data-darik-freeform-hover146");
      }
      hover146 = null;
    }

    function clearSelected146() {
      root
        .querySelectorAll('[data-darik-freeform-selected146="true"]')
        .forEach((element) =>
          element.removeAttribute("data-darik-freeform-selected146")
        );
    }

    function targetFromEvent146(event: Event) {
      const rawTarget = event.target;

      if (!(rawTarget instanceof Element)) return null;
      if (!root.contains(rawTarget)) return null;
      if (rawTarget === root) return null;

      const tag = rawTarget.tagName.toLowerCase();
      if (
        tag === "html" ||
        tag === "body" ||
        tag === "script" ||
        tag === "style"
      ) {
        return null;
      }

      if (
        rawTarget.closest(
          '[data-darik-freeform-ignore146="true"]'
        )
      ) {
        return null;
      }

      if (
        !(
          rawTarget instanceof HTMLElement ||
          rawTarget instanceof SVGElement
        )
      ) {
        return null;
      }

      return rawTarget;
    }

    function handlePointerOver146(event: PointerEvent) {
      if (drag146) return;

      const target = targetFromEvent146(event);
      clearHover146();

      if (!target) return;

      hover146 = target;
      target.setAttribute("data-darik-freeform-hover146", "true");
    }

    function handlePointerDown146(event: PointerEvent) {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const target = targetFromEvent146(event);
      if (!target) return;

      const locator = storefrontFreeformLocator146(root, target);
      if (!locator) return;

      event.preventDefault();
      event.stopPropagation();

      clearHover146();
      clearSelected146();

      target.setAttribute("data-darik-freeform-selected146", "true");
      target.setAttribute("data-darik-freeform-dragging146", "true");

      const device =
        window.innerWidth <= 720 ? "mobile" : "desktop";

      const saved = effectiveFreeformLayout146[device][locator];
      const computed = storefrontFreeformTranslate146(
        window.getComputedStyle(target).translate
      );

      const baseX = saved?.x ?? computed.x;
      const baseY = saved?.y ?? computed.y;
      const label =
        saved?.label || storefrontFreeformElementLabel146(target);

      drag146 = {
        target,
        locator,
        label,
        device,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        baseX,
        baseY,
        x: baseX,
        y: baseY,
      };

      try {
        target.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is best effort.
      }

      window.parent.postMessage(
        {
          type: "DARIK_FREEFORM_DRAG_START_146",
          locator,
          label,
          device,
          x: baseX,
          y: baseY,
        },
        window.location.origin
      );
    }

    function handlePointerMove146(event: PointerEvent) {
      if (!drag146 || event.pointerId !== drag146.pointerId) return;

      event.preventDefault();
      event.stopPropagation();

      const x = clampStorefrontFreeform146(
        drag146.baseX + event.clientX - drag146.startClientX
      );
      const y = clampStorefrontFreeform146(
        drag146.baseY + event.clientY - drag146.startClientY
      );

      drag146.x = x;
      drag146.y = y;

      drag146.target.style.setProperty(
        "translate",
        `${x}px ${y}px`,
        "important"
      );
      drag146.target.setAttribute(
        "data-darik-freeform-applied146",
        "true"
      );

      window.parent.postMessage(
        {
          type: "DARIK_FREEFORM_DRAG_MOVE_146",
          locator: drag146.locator,
          label: drag146.label,
          device: drag146.device,
          x,
          y,
        },
        window.location.origin
      );
    }

    function finishDrag146(event: PointerEvent) {
      if (!drag146 || event.pointerId !== drag146.pointerId) return;

      event.preventDefault();
      event.stopPropagation();

      const completed = drag146;
      completed.target.removeAttribute(
        "data-darik-freeform-dragging146"
      );

      try {
        completed.target.releasePointerCapture(event.pointerId);
      } catch {
        // Best effort.
      }

      drag146 = null;

      window.parent.postMessage(
        {
          type: "DARIK_FREEFORM_DRAG_END_146",
          locator: completed.locator,
          label: completed.label,
          device: completed.device,
          x: completed.x,
          y: completed.y,
        },
        window.location.origin
      );
    }

    function cancelDrag146(event: PointerEvent) {
      if (!drag146 || event.pointerId !== drag146.pointerId) return;

      const cancelled = drag146;

      cancelled.target.style.setProperty(
        "translate",
        `${cancelled.baseX}px ${cancelled.baseY}px`,
        "important"
      );
      cancelled.target.removeAttribute(
        "data-darik-freeform-dragging146"
      );

      drag146 = null;
    }

    function blockClick146(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    function blockNativeDrag146(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
    }

    root.addEventListener("pointerover", handlePointerOver146, true);
    root.addEventListener("pointerdown", handlePointerDown146, true);
    root.addEventListener("pointermove", handlePointerMove146, true);
    root.addEventListener("pointerup", finishDrag146, true);
    root.addEventListener("pointercancel", cancelDrag146, true);
    root.addEventListener("click", blockClick146, true);
    root.addEventListener("dragstart", blockNativeDrag146, true);

    return () => {
      root.removeEventListener("pointerover", handlePointerOver146, true);
      root.removeEventListener("pointerdown", handlePointerDown146, true);
      root.removeEventListener("pointermove", handlePointerMove146, true);
      root.removeEventListener("pointerup", finishDrag146, true);
      root.removeEventListener("pointercancel", cancelDrag146, true);
      root.removeEventListener("click", blockClick146, true);
      root.removeEventListener("dragstart", blockNativeDrag146, true);
      clearHover146();
    };
  }, [
    effectiveFreeformLayout146,
    freeformMoveMode146,
    isBuilderPositionPreview145,
  ]);

  const effectiveContentPositioning145 =
    normalizeStorefrontContentPositioning145(
      (
        storefront as unknown as {
          direct_content_positioning?: unknown;
        }
      ).direct_content_positioning ?? savedContentPositioning145
    );

  function selectBuilderPositionTarget145(
    event: { preventDefault: () => void; stopPropagation: () => void },
    key: StorefrontPositionKey145
  ) {
    if (!isBuilderPositionPreview145) return;

    event.preventDefault();
    event.stopPropagation();
    setBuilderSelectedPosition145(key);

    window.parent.postMessage(
      {
        type: "DARIK_PREVIEW_POSITION_SELECT_145",
        key,
        viewport: window.innerWidth <= 720 ? "mobile" : "desktop",
      },
      window.location.origin
    );
  }

  const fieldDesign = lockedRetailFieldDesign(effectiveThemeField);
  const themeStyle = {
    "--store-primary": fieldDesign.primaryColor,
    "--store-accent": fieldDesign.accentColor,
    "--store-background": fieldDesign.backgroundColor,
  } as CSSProperties;
  const storefrontTheme = fieldDesign.storefrontTheme;
  const appearanceMode = fieldDesign.appearanceMode;
  const productCardStyle = fieldDesign.productCardStyle;
  const cornerStyle = fieldDesign.cornerStyle;
  const heroLayout = fieldDesign.heroLayout;
  const sectionOrder = fieldDesign.sectionOrder;
  const showPrices = storefront.show_prices !== false;
  const showOrdering = storefront.show_ordering !== false;
  const showPhone = storefront.show_phone !== false;
  const showWhatsapp = storefront.show_whatsapp !== false;
  const showStoreStory = storefront.show_store_story !== false;

  const heroStyle = storefront.hero_image_url
    ? ({
        backgroundImage: `url(${JSON.stringify(storefront.hero_image_url)})`,
      } as CSSProperties)
    : undefined;

  const contactLinkCandidates: Array<{
    label: string;
    labelAr?: string;
    detail: string;
    href: string;
    icon: IconName;
  }> = [
    {
      label: "Call",
      labelAr: "اتصال",
      detail: showPhone ? storefront.business_phone || "" : "",
      href: showPhone ? phoneHref(storefront.business_phone) || "" : "",
      icon: "call",
    },
    {
      label: "WhatsApp",
      labelAr: "واتساب",
      detail: showWhatsapp ? storefront.whatsapp_number || "" : "",
      href: showWhatsapp ? whatsappHref(storefront.whatsapp_number) || "" : "",
      icon: "whatsapp",
    },
    {
      label: "Email",
      labelAr: "البريد الإلكتروني",
      detail: storefront.public_email || "",
      href: emailHref(storefront.public_email) || "",
      icon: "email",
    },
    {
      label: "Website",
      labelAr: "الموقع الإلكتروني",
      detail: "Visit website",
      href: normalizeExternalUrl(storefront.website_url) || "",
      icon: "globe",
    },
    {
      label: "Facebook",
      labelAr: "فيسبوك",
      detail: "Facebook",
      href: normalizeExternalUrl(storefront.facebook_url) || "",
      icon: "facebook",
    },
    {
      label: "Instagram",
      labelAr: "إنستغرام",
      detail: "Instagram",
      href: normalizeExternalUrl(storefront.instagram_url) || "",
      icon: "instagram",
    },
    ...(Array.isArray(storefront.custom_links)
      ? storefront.custom_links.map((link) => ({
          label:
            String(link.label ?? "").trim() ||
            String(link.label_ar ?? "").trim(),
          labelAr: String(link.label_ar ?? "").trim(),
          detail:
            String(link.label ?? "").trim() ||
            String(link.label_ar ?? "").trim(),
          href: normalizeExternalUrl(link.url) || "",
          icon: "globe" as IconName,
        }))
      : []),
  ];

  const contactLinks = contactLinkCandidates.filter((link) =>
    Boolean(link.label && link.detail && link.href)
  );

  const customInformation = Array.isArray(storefront.custom_information)
    ? storefront.custom_information.filter(
        (item) =>
          String(item?.label ?? "").trim() &&
          String(item?.value ?? "").trim()
      )
    : [];

  const operatingHours = storefront.operating_hours ?? {};
  const operatingHoursAr = storefront.operating_hours_ar ?? {};
  const visibleHours = [
    ["sunday", "Sunday", "الأحد"],
    ["monday", "Monday", "الاثنين"],
    ["tuesday", "Tuesday", "الثلاثاء"],
    ["wednesday", "Wednesday", "الأربعاء"],
    ["thursday", "Thursday", "الخميس"],
    ["friday", "Friday", "الجمعة"],
    ["saturday", "Saturday", "السبت"],
  ].filter(
    ([day]) =>
      String(operatingHours[day] ?? "").trim() ||
      String(operatingHoursAr[day] ?? "").trim()
  );

  const currentDayHours =
    todayHours(storefront.operating_hours) ||
    todayHours(storefront.operating_hours_ar);
  const whatsapp = whatsappDigits(storefront.whatsapp_number);
  const phone = phoneHref(storefront.business_phone);
  const storeWhatsappHref = whatsappHref(storefront.whatsapp_number);
  const hasDirectPurchaseProducts = products.some(
    (product) => (product.direct_pricing_mode || "price") === "price"
  );
  const partsHelpMessage = [
    `Hello ${storefront.display_name}, I need help finding the correct auto part.`,
    "\u0645\u0631\u062d\u0628\u0627\u060c \u0628\u062f\u064a \u0645\u0633\u0627\u0639\u062f\u0629 \u0628\u0625\u064a\u062c\u0627\u062f \u0642\u0637\u0639\u0629 \u0627\u0644\u063a\u064a\u0627\u0631 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629.",
    "",
    "Vehicle model / VIN:",
  ].join("\n");
  const partsHelpWhatsappHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(partsHelpMessage)}`
    : null;

  const orderMessage = [
    `Hello ${storefront.display_name}, I would like to place this order:`,
    "",
    ...cart.map(
      (line) =>
        `${line.quantity} × ${line.name} — ${money(line.price * line.quantity)}`
    ),
    "",
    `Fulfillment: ${pickupOnly ? "Local pickup" : "Delivery"}`,
    `Subtotal: ${money(cartSubtotal)}`,
    pickupOnly ? "Pickup fee: 0.00 JOD" : `Delivery: ${money(deliveryFee)}`,
    `Total: ${money(orderTotal)}`,
  ].join("\n");

  const phoneOrderHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(orderMessage)}`
    : phone;

  const phoneOrderLabel = whatsapp
    ? "Order on WhatsApp"
    : phone
      ? "Call store to order"
      : "Phone ordering unavailable";

  const orderSubmissionMode = storefront.order_submission_mode ?? "phone";
  const phoneOrderingEnabled =
    showOrdering && (orderSubmissionMode === "phone" || orderSubmissionMode === "both");
  const onlinePaymentAvailable =
    storefront.cash_on_delivery_enabled || storefront.cliq_enabled;
  const onlineOrderingEnabled =
    showOrdering &&
    (orderSubmissionMode === "online" || orderSubmissionMode === "both") &&
    onlinePaymentAvailable;
  const effectiveAcceptingOrders = showOrdering && storefront.is_accepting_orders;
  const storeHoursState115 = darikStoreHoursState115(
    (
      storefront as unknown as {
        operating_hours?: unknown;
      }
    ).operating_hours,
    storeClock115
  );

  // DARIK_CLOSED_STATUS_NEXT_DAY_DELIVERY_PLACEMENT_116
  const storeIsOpenNow115 =
    !storeClock115 || !storeHoursState115.hasHours
      ? effectiveAcceptingOrders
      : storeHoursState115.isOpen;

  const selectedCategory = visibleCategories.find(
    (category) => category.id === selectedCategoryId
  );

  function productThumbnailPhotoUrl(
    photoUrl: string | null | undefined
  ) {
    const clean = String(photoUrl || "").trim();
    if (!clean) return "";

    return clean.replace(
      /-full\.(jpe?g|png|webp)(\?.*)?$/i,
      "-thumb.$1$2"
    );
  }

  function renderProductCard(product: Product) {
    const name = productName(product);
    const photo = productPhoto(product);
    const thumbnailPhoto = productThumbnailPhotoUrl(photo);
    const stock = Number(product.quantity_in_stock ?? 0);
    const pricingMode = product.direct_pricing_mode || "price";
    const contactPricing = pricingMode !== "price";
    const fitment = productVehicleFitment(product);
    const availabilityStatus =
      product.direct_availability_status === "out_of_stock" ||
      (product.direct_inventory_tracking_enabled && stock <= 0)
        ? "out_of_stock"
        : "available";
    const productAvailable = availabilityStatus === "available";
    const inCart = cart.find((line) => line.productId === product.id)?.quantity ?? 0;
    const productLink =
      typeof window !== "undefined"
        ? `${window.location.origin}/${storefront.slug}?product=${encodeURIComponent(product.id)}#catalog`
        : `https://getdarik.com/${storefront.slug}`;
    const pricingMessage = [
      `مرحبا، بدي أعرف سعر ${name}`,
      `Hello, I would like the price for ${name}.`,
      fitment ? `Vehicle fitment: ${fitment}` : "",
      productLink,
    ].join("\n");
    const pricingWhatsappHref = whatsapp
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(pricingMessage)}`
      : null;
    const pricingCallHref = phone;
    const canCallForPrice =
      (pricingMode === "call" || pricingMode === "call_whatsapp") && Boolean(pricingCallHref);
    const canWhatsappForPrice =
      (pricingMode === "whatsapp" || pricingMode === "call_whatsapp") && Boolean(pricingWhatsappHref);
    const hasSelectedPricingContact = canCallForPrice || canWhatsappForPrice;
    const pricingLabel =
      pricingMode === "call" ||
      pricingMode === "whatsapp" ||
      pricingMode === "call_whatsapp"
        ? "Price on request / \u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062f \u0627\u0644\u0637\u0644\u0628"
        : showPrices
          ? money(product.app_price)
          : "Contact for price / \u062a\u0648\u0627\u0635\u0644 \u0644\u0644\u0633\u0639\u0631";
    return (
      <article
        className={`${styles.productCard} ${isAutoPartsTheme ? styles.autoPartsProductCard : ""} ${portfolioStyles.productCardPolish}`}
        key={product.id}
        role="button"
        tabIndex={0}
        aria-label={`Open ${name} product details`}
        style={{ cursor: "pointer" }}
        onClick={(event) => {
          const target = event.target;
          if (target instanceof Element && target.closest("button,a")) return;
          openProductDetail(product);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          openProductDetail(product);
        }}
      >
        <div className={`${styles.productImage} ${portfolioStyles.productImagePolish}`}>
          {photo ? (
            <img
              src={thumbnailPhoto || photo}
              alt={name}
              loading="lazy"
              decoding="async"
              title="Open product / افتح المنتج"
              onError={(event) => {
                if (photo && event.currentTarget.src !== photo) {
                  event.currentTarget.src = photo;
                }
              }}
            />
          ) : (
            <div className={styles.productPlaceholder}>
              <Icon name="store" size={30} />
              <span>Image coming soon</span>
            </div>
          )}

          <div className={styles.productBadges}>
            {product.storefront_featured ? (
              <strong className={styles.featuredTag}>Featured</strong>
            ) : null}
            <strong
              className={
                productAvailable
                  ? styles.availableTag
                  : styles.outOfStockTag
              }
            >
              {productAvailable
                ? "متوفر / Available"
                : "غير متوفر / Out of stock"}
            </strong>
            {productAvailable &&
            product.direct_inventory_tracking_enabled &&
            stock > 0 &&
            stock <= 3 ? (
              <strong className={styles.stockTag}>Only {stock} left</strong>
            ) : null}
          </div>
        </div>

        <div className={`${styles.productBody} ${portfolioStyles.productBodyPolish}`}>
          <p className={styles.productMeta}>
            {product.direct_store_category_name ||
              product.brand_name ||
              "Available now"}
          </p>

          <h3>{name}</h3>

          {product.official_marketplace_name_ar ? (
            <p className={styles.productArabic} dir="rtl">
              {product.official_marketplace_name_ar}
            </p>
          ) : null}

          {fitment ? (
            <div className={styles.productFitment}>
              <span>Fits / يناسب</span>
              <strong>{fitment}</strong>
            </div>
          ) : null}

          {product.description ? (
            <p className={styles.productDescription}>{product.description}</p>
          ) : null}

          <div className={styles.productFooter}>
            <div>
              <strong>{pricingLabel}</strong>
              {!contactPricing && showOrdering && inCart > 0 ? <span>{inCart} in cart</span> : null}
            </div>

            {contactPricing ? (
              <div className={styles.pricingActions}>
                {canCallForPrice && pricingCallHref ? (
                  <a className={styles.pricingCallButton} href={pricingCallHref}>
                    <Icon name="call" size={17} />
                    <span>{"Call / \u0627\u062a\u0635\u0627\u0644"}</span>
                  </a>
                ) : null}
                {canWhatsappForPrice && pricingWhatsappHref ? (
                  <a
                    className={styles.pricingWhatsappButton}
                    href={pricingWhatsappHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="whatsapp" size={17} />
                    <span>{"WhatsApp / \u0648\u0627\u062a\u0633\u0627\u0628"}</span>
                  </a>
                ) : null}
                {!hasSelectedPricingContact && contactLinks[0] ? (
                  <a className={styles.productContactButton} href={contactLinks[0].href}>
                    Contact
                  </a>
                ) : null}
              </div>
            ) : showOrdering ? (
              <button
                aria-label={
                  productAvailable
                    ? `Add ${name} to cart`
                    : `${name} is out of stock`
                }
                disabled={!effectiveAcceptingOrders || !productAvailable}
                onClick={() => addToCart(product)}
              >
                {productAvailable ? <Icon name="plus" size={19} /> : null}
                <span>{productAvailable ? "Add" : "Out of stock"}</span>
              </button>
            ) : contactLinks[0] ? (
              <a className={styles.productContactButton} href={contactLinks[0].href}>
                Contact
              </a>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  const hasActiveVehicleFilter =
    selectedVehicleMake !== "all" ||
    selectedVehicleModel !== "all" ||
    selectedVehicleYear !== "all";
  const activeVehicleLabel = [
    selectedVehicleYear !== "all" ? selectedVehicleYear : "",
    selectedVehicleMake !== "all" ? selectedVehicleMake : "",
    selectedVehicleModel !== "all" ? selectedVehicleModel : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <main
      className={`${styles.page} ${portfolioStyles.pagePolish}`}
      style={themeStyle}
      data-theme={storefrontTheme}
      data-appearance={appearanceMode}
      data-card-style={productCardStyle}
      data-corners={cornerStyle}
      data-hero={heroLayout}
      data-business={effectiveBusinessType}
      data-theme-field={effectiveThemeField}
      data-darik-page-font={effectiveStorefrontTypography.page.font}
      data-darik-position-builder145={isBuilderPositionPreview145 ? "true" : "false"}
      data-darik-freeform-root146="true"
      data-darik-freeform-mode146={freeformMoveMode146 ? "true" : "false"}
      data-field-preview={previewRetailField ? "yes" : "no"}
      data-mechanics-preview={previewMechanicsField ? "yes" : "no"}
      data-category-count={String(visibleCategories.length)}
      data-direct-purchase={hasDirectPurchaseProducts ? "yes" : "no"}
    >
      {locationGateOpen117 &&
      deliveryEnabled &&
      !pickupOnly ? (
        <div
          className={styles.customerLocationGate117}
          role="dialog"
          aria-modal="true"
          aria-labelledby="darik-location-title-117"
        >
          <section
            className={styles.customerLocationCard117}
          >
            <div
              className={
                styles.customerLocationBrand117
              }
            >
              <span>DARIK DELIVERY / توصيل داريك</span>
              <strong
                id="darik-location-title-117"
              >
                Where should we deliver? / وين التوصيل؟
              </strong>
              <p>
                We use your fresh location only to
                calculate this store&apos;s delivery
                zone, fee, and minimum order. Darik
                does not save this location for your
                next visit.
              </p>
            </div>

            <button
              type="button"
              className={
                styles.customerLocationGps117
              }
              onClick={useFreshCurrentLocation117}
              disabled={
                locationGateBusy117 ||
                locationSearchBusy117
              }
            >
              {locationGateBusy117
                ? "Getting fresh location... / جارٍ تحديد الموقع..."
                : "Use my current location / استخدم موقعي الحالي"}
            </button>

            <div
              className={
                styles.customerLocationDivider117
              }
            >
              <span>OR / أو</span>
            </div>

            <div
              className={
                styles.customerLocationSearch117
              }
            >
              <label>
                <span>
                  Search Google Maps / البحث في Google
                  Maps
                </span>

                <div>
                  <input
                    value={locationSearch117}
                    onChange={(event) =>
                      setLocationSearch117(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void searchCustomerLocation117();
                      }
                    }}
                    placeholder="Store, street, building or landmark"
                    autoComplete="off"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      void searchCustomerLocation117()
                    }
                    disabled={
                      locationSearchBusy117 ||
                      locationGateBusy117
                    }
                  >
                    {locationSearchBusy117
                      ? "Searching..."
                      : "Search"}
                  </button>
                </div>
              </label>

              {locationPredictions117.length > 0 ? (
                <div
                  className={
                    styles.customerLocationResults117
                  }
                >
                  {locationPredictions117.map(
                    (prediction) => (
                      <button
                        type="button"
                        key={prediction.place_id}
                        onClick={() =>
                          void chooseCustomerPlace117(
                            prediction
                          )
                        }
                      >
                        <strong>
                          {prediction
                            .structured_formatting
                            ?.main_text ||
                            prediction.description}
                        </strong>
                        <span>
                          {prediction
                            .structured_formatting
                            ?.secondary_text ||
                            prediction.description}
                        </span>
                      </button>
                    )
                  )}
                </div>
              ) : null}
            </div>

            {locationGateError117 ? (
              <div
                className={
                  styles.customerLocationError117
                }
              >
                {locationGateError117}
              </div>
            ) : null}

                        <div
              className={
                styles.customerLocationPickupBreak118
              }
            >
              <span>OR PICKUP / أو الاستلام</span>
            </div>

            <button
              type="button"
              className={
                styles.customerLocationPickupBrowse118
              }
              onClick={browseStoreForPickup118}
              disabled={
                locationGateBusy117 ||
                locationSearchBusy117
              }
            >
              <strong>
                Browse store for pickup / تصفح المتجر للاستلام
              </strong>
              <span>
                No delivery location needed. Browse, add items, and collect from the store.
              </span>
            </button>

<small
              className={
                styles.customerLocationPrivacy117
              }
            >
              Session only • cleared when this browser tab/session ends • never saved permanently
            </small>
          </section>
        </div>
      ) : null}

      {pickupBrowse118 ? (
        <div
          className={styles.pickupBrowseTab118}
          role="status"
        >
          <div>
            <strong>
              Browse store for pickup / تصفح المتجر للاستلام
            </strong>
            <span>
              Pickup mode • no delivery location required
            </span>
          </div>

          <button
            type="button"
            onClick={switchPickupBrowseToDelivery118}
          >
            Check delivery / تحقق من التوصيل
          </button>
        </div>
      ) : null}
      <style>{darikGlobalTypographyCss106}</style>
      <style>{customerFacingNameCss144}</style>
      <ProductDetailExperience
        open={Boolean(activeProduct)}
        product={activeProduct}
        storeName={storefront.display_name}
        storeSlug={storefront.slug}
        primaryColor={fieldDesign.primaryColor}
        accentColor={fieldDesign.accentColor}
        phoneHref={phone}
        whatsappNumber={storefront.whatsapp_number}
        showPrices={showPrices}
        showOrdering={showOrdering}
        acceptingOrders={effectiveAcceptingOrders}
        deliveryEnabled={deliveryEnabled}
        pickupEnabled={pickupEnabled}
        estimatedDeliveryMinutes={storefront.estimated_delivery_minutes}
        inCart={
          activeProduct
            ? cart.find((line) => line.productId === activeProduct.id)?.quantity ?? 0
            : 0
        }
        onClose={closeProductDetail}
        onAddToCart={() => {
          if (!activeProduct) return;
          addToCart(activeProduct);
        }}
      />

      {previewMechanicsField ? (
        <div className={styles.mechanicsPreviewBanner}>
          <strong>MECHANICS TEST / اختبار الخصائص</strong>
          <span>{mechanicsFieldLabel(previewMechanicsField)}</span>
          <small>
            Visual theme stays separate: {mechanicsFieldLabel(effectiveThemeField)}
          </small>
        </div>
      ) : null}
      <div className={styles.announcementBar}>
        <span>
          <i className={effectiveAcceptingOrders && storeIsOpenNow115 ? styles.liveDot : styles.pausedDot} />
          {!showOrdering
            ? "Catalog open / \u0627\u0644\u0643\u062a\u0627\u0644\u0648\u062c \u0645\u062a\u0627\u062d"
            : effectiveAcceptingOrders
              ? pickupOnly
                ? "Open for pickup / \u0645\u062a\u0627\u062d \u0644\u0644\u0627\u0633\u062a\u0644\u0627\u0645"
                : "Open for orders / \u0645\u062a\u0627\u062d \u0644\u0644\u0637\u0644\u0628"
              : "Ordering paused / \u0627\u0644\u0637\u0644\u0628 \u0645\u062a\u0648\u0642\u0641 \u0645\u0624\u0642\u062a\u0627"}
        </span>
        <a href="/">Powered by Darik</a>
      </div>

      <header className={`${styles.header} ${portfolioStyles.headerPolish}`}>
        <a className={styles.storeIdentity} href={`/${storefront.slug}`}>
          <div className={styles.headerLogo}>
            {storefront.logo_url ? (
              <img src={storefront.logo_url} alt="" />
            ) : (
              <span>{storefront.display_name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div>
            <strong>{storefront.display_name}</strong>
            <span>{isAutoParts ? "Auto parts / \u0642\u0637\u0639 \u063a\u064a\u0627\u0631" : isGroceryStore ? "Grocery store / \u0645\u062a\u062c\u0631 \u0645\u0648\u0627\u062f \u063a\u0630\u0627\u0626\u064a\u0629" : "Darik Direct store"}</span>
          </div>
        </a>

        <nav className={styles.headerActions}>
          <button
            className={[
              styles.builderPositionTarget145,
              builderSelectedPosition145 === "shop"
                ? styles.builderPositionSelected145
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={storefrontPositionStyle145(
              effectiveContentPositioning145,
              "shop"
            )}
            onClick={(event) => {
              if (isBuilderPositionPreview145) {
                selectBuilderPositionTarget145(event, "shop");
                return;
              }
              jumpToCatalog();
            }}
          >
            <Icon name="search" size={18} />
            <span>Shop</span>
          </button>
          <button onClick={() => setDetailsOpen(true)}>
            <Icon name="info" size={18} />
            <span>Store info</span>
          </button>
          {isAutoParts && !hasDirectPurchaseProducts && partsHelpWhatsappHref ? (
            <a
              className={styles.headerWhatsappButton}
              href={partsHelpWhatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp store"
            >
              <Icon name="whatsapp" size={19} />
              <span>WhatsApp</span>
            </a>
          ) : null}
          {showOrdering && hasDirectPurchaseProducts ? (
            <button className={styles.cartButton} onClick={() => setCartOpen(true)}>
              <Icon name="bag" size={19} />
              <span>Cart</span>
              <strong>{cartCount}</strong>
            </button>
          ) : null}
        </nav>
      </header>

      <section
        className={`${styles.hero} ${portfolioStyles.heroPolish} ${
          storefront.hero_image_url ? styles.heroWithImage : styles.heroWithoutImage
        }`}
        style={heroStyle}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroTexture} />

        <div className={styles.heroContent}>
          {isAutoParts || isGroceryStore ? (
            <div className={styles.heroExperienceRail}>
              <span className={styles.heroLiveStatus}>
                <i className={effectiveAcceptingOrders && storeIsOpenNow115 ? styles.liveDot : styles.pausedDot} />
                {effectiveAcceptingOrders
                  ? storeIsOpenNow115
                    ? "Open now / مفتوح الآن"
                    : storeHoursState115.phase === "before_open"
                      ? `Opens today at ${storeHoursState115.openLabel} / يفتح اليوم الساعة ${storeHoursState115.openLabel}`
                      : "Closed now / مغلق الآن"
                  : isAutoParts
                    ? "Browse catalog / \u062a\u0635\u0641\u062d \u0627\u0644\u0643\u062a\u0627\u0644\u0648\u062c"
                    : "Fresh groceries / \u0645\u0646\u062a\u062c\u0627\u062a \u0637\u0627\u0632\u062c\u0629"}
              </span>
              {currentDayHours ? (
                <span className={styles.heroHoursChip}>
                  <Icon name="clock" size={14} />
                  {currentDayHours}
                </span>
              ) : null}
            </div>
          ) : null}
          <div className={styles.heroLogo}>
            {storefront.logo_url ? (
              <img
                src={storefront.logo_url}
                alt={`${storefront.display_name} logo`}
              />
            ) : (
              <span>{storefront.display_name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>

          <div className={styles.heroCopy}>
            <div className={styles.heroLabel}>
              <Icon name="store" size={15} />
              {isAutoParts ? "Auto parts / \u0642\u0637\u0639 \u063a\u064a\u0627\u0631" : isGroceryStore ? "Hypermarket / \u0647\u0627\u064a\u0628\u0631\u0645\u0627\u0631\u0643\u062a" : "Official store / \u0627\u0644\u0645\u062a\u062c\u0631 \u0627\u0644\u0631\u0633\u0645\u064a"}
            </div>
            <h1
              onClick={(event) =>
                selectBuilderPositionTarget145(event, "display_name")
              }
              className={[styles.builderPositionTarget145, builderSelectedPosition145 === "display_name" ? styles.builderPositionSelected145 : ""].filter(Boolean).join(" ")} id="darik-customer-facing-store-name-144"
              data-darik-font-override={
                effectiveStorefrontTypography.display_name.font !== "theme"
                  ? effectiveStorefrontTypography.display_name.font
                  : undefined
              }
style={{
                ...storefrontTypographyInlineStyle(
                  effectiveStorefrontTypography,
                  "display_name"
                ),
                ...storefrontPositionStyle145(
                  effectiveContentPositioning145,
                  "display_name"
                ),
              }}
            >
              {storefront.display_name}
            </h1>
            {storefront.display_name_ar ? (
              <p
              onClick={(event) =>
                selectBuilderPositionTarget145(event, "display_name_ar")
              }
                className={[styles.arabicName, styles.builderPositionTarget145, builderSelectedPosition145 === "display_name_ar" ? styles.builderPositionSelected145 : ""].filter(Boolean).join(" ")}
                dir="rtl"
                data-darik-font-override={
                effectiveStorefrontTypography.display_name_ar.font !== "theme"
                  ? effectiveStorefrontTypography.display_name_ar.font
                  : undefined
              }
style={{
                ...storefrontTypographyInlineStyle(
                  effectiveStorefrontTypography,
                  "display_name_ar"
                ),
                ...storefrontPositionStyle145(
                  effectiveContentPositioning145,
                  "display_name_ar"
                ),
              }}
              >
                {storefront.display_name_ar}
              </p>
            ) : null}
            <p
              onClick={(event) =>
                selectBuilderPositionTarget145(event, "tagline")
              }
              className={[styles.tagline, styles.builderPositionTarget145, builderSelectedPosition145 === "tagline" ? styles.builderPositionSelected145 : ""].filter(Boolean).join(" ")}
              data-darik-font-override={
                effectiveStorefrontTypography.tagline.font !== "theme"
                  ? effectiveStorefrontTypography.tagline.font
                  : undefined
              }
style={{
                ...storefrontTypographyInlineStyle(
                  effectiveStorefrontTypography,
                  "tagline"
                ),
                ...storefrontPositionStyle145(
                  effectiveContentPositioning145,
                  "tagline"
                ),
              }}
            >
              {storefront.tagline || (pickupOnly ? "Browse online and collect from this local store." : isGroceryStore ? "Fresh groceries and daily essentials from your neighborhood market." : "Everything you need, delivered from a local store.")}
            </p>
            {storefront.tagline_ar ? (
              <p
              onClick={(event) =>
                selectBuilderPositionTarget145(event, "tagline_ar")
              }
                className={[styles.arabicTagline, styles.builderPositionTarget145, builderSelectedPosition145 === "tagline_ar" ? styles.builderPositionSelected145 : ""].filter(Boolean).join(" ")}
                dir="rtl"
                data-darik-font-override={
                effectiveStorefrontTypography.tagline_ar.font !== "theme"
                  ? effectiveStorefrontTypography.tagline_ar.font
                  : undefined
              }
style={{
                ...storefrontTypographyInlineStyle(
                  effectiveStorefrontTypography,
                  "tagline_ar"
                ),
                ...storefrontPositionStyle145(
                  effectiveContentPositioning145,
                  "tagline_ar"
                ),
              }}
              >
                {storefront.tagline_ar}
              </p>
            ) : null}

            <div className={styles.heroButtons}>
              <button className={styles.primaryHeroButton} onClick={jumpToCatalog}>
                {isAutoParts ? "Find a part / \u0627\u0628\u062d\u062b \u0639\u0646 \u0642\u0637\u0639\u0629" : isGroceryStore ? "Shop groceries / \u062a\u0633\u0648\u0642 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a" : "Browse products"}
                <Icon name="arrow" size={18} />
              </button>
              <button
                className={styles.secondaryHeroButton}
                onClick={() => setDetailsOpen(true)}
              >
                Store details
              </button>
            </div>
          </div>
        </div>

        <aside className={styles.orderSnapshot}>
          <div className={styles.snapshotStatus}>
            <span>
              <i className={effectiveAcceptingOrders && storeIsOpenNow115 ? styles.liveDot : styles.pausedDot} />
              {showOrdering ? "Order status" : "Website mode"}
            </span>
            <strong>
              {effectiveAcceptingOrders
                ? storeIsOpenNow115
                  ? "Open now"
                  : "Closed now"
                : "Orders paused"}
</strong>
          </div>

          <div className={styles.snapshotGrid}>
            {showOrdering ? (
              <>
                <div>
                  <Icon name="clock" size={20} />
                  <span>{(pickupOnly || selectedPickup) ? "Pickup method" : "Estimated delivery"}</span>
                  <strong>
                {(pickupOnly || selectedPickup) ? "Collect from store"
                  : !storeIsOpenNow115 && effectiveAcceptingOrders
                    ? storeHoursState115.phase === "before_open"
                      ? `Delivery after ${storeHoursState115.openLabel}`
                      : "Next-day delivery"
                    : storefront.estimated_delivery_minutes
                      ? `${storefront.estimated_delivery_minutes} min`
                      : "Store estimate"}
</strong>
                </div>
                <div>
                  <Icon name={pickupOnly ? "store" : "truck"} size={20} />
                  <span>{(pickupOnly || selectedPickup) ? "Pickup fee" : "Delivery fee"}</span>
                  <strong>{(pickupOnly || selectedPickup) ? "Free" : money(matchedDeliveryFee117)}</strong>
                </div>
                <div>
                  <Icon name="bag" size={20} />
                  <span>Minimum order</span>
                  <strong>
                    {minimumOrder > 0 ? money(minimumOrder) : "No minimum"}
                  </strong>
                </div>
              </>
            ) : (
              <div>
                <Icon name="store" size={20} />
                <span>Catalog</span>
                <strong>{products.length} products</strong>
              </div>
            )}
            <div>
              <Icon name="clock" size={20} />
              <span>Today</span>
              <strong>{currentDayHours || "See store hours"}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className={`${styles.quickInfoStrip} ${portfolioStyles.quickInfoPolish}`}>
        {(storefront.address_text || storefront.address_text_ar) ? (
          <a
            className={styles.locationQuickLink}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              storefront.address_text || storefront.address_text_ar || ""
            )}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open store location in Google Maps"
          >
            <span className={styles.quickIcon}>
              <Icon name="location" size={18} />
            </span>
            <span>
              <small>{"Store location / \u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062a\u062c\u0631"}</small>
              {storefront.address_text ? (
                <strong>{storefront.address_text}</strong>
              ) : null}
              {storefront.address_text_ar ? (
                <strong dir="rtl">{storefront.address_text_ar}</strong>
              ) : null}
            </span>
          </a>
        ) : null}
        {(isAutoParts || isGroceryStore
          ? contactLinks
              .filter((link) => link.icon === "call" || link.icon === "whatsapp")
              .slice(0, 2)
          : contactLinks.slice(0, 4)
        ).map((link) => (
          <a
            className={styles.contactQuickLink}
            key={`quick-${link.label}-${link.href}`}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
          >
            <span className={styles.quickIcon}>
              <Icon name={link.icon} size={18} />
            </span>
            <span>
              <small>
                {link.label}
                {link.labelAr ? ` / ${link.labelAr}` : ""}
              </small>
              <strong>{link.detail}</strong>
            </span>
          </a>
        ))}
      </section>

      <div className={`${styles.reorderableSections} ${portfolioStyles.sectionsPolish}`}>
      {isGroceryStore ? (
        <section className={styles.grocerySearchPanel}>
          <label className={styles.grocerySearchBox}>
            <Icon name="search" size={21} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={"Search groceries / \u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a"}
            />
            {search ? (
              <button type="button" onClick={() => setSearch("")}>
                <Icon name="close" size={16} />
              </button>
            ) : null}
          </label>
        </section>
      ) : null}
      {visibleCategories.length > 0 ? (
        <section
          className={`${styles.categorySection} ${isGroceryStore ? styles.groceryCategorySection : ""} ${portfolioStyles.categoriesPolish}`}
          style={{ order: sectionOrder.indexOf("categories") }}
        >
          <div className={styles.sectionHeading}>
            <div>
              <span>{isGroceryStore ? "Shop by department / \u062a\u0633\u0648\u0642 \u062d\u0633\u0628 \u0627\u0644\u0642\u0633\u0645" : "Shop by category / \u062a\u0633\u0648\u0642 \u062d\u0633\u0628 \u0627\u0644\u0642\u0633\u0645"}</span>
              <h2>{isGroceryStore ? "Browse aisles / \u062a\u0635\u0641\u062d \u0627\u0644\u0623\u0642\u0633\u0627\u0645" : "Browse categories / \u0627\u0644\u0623\u0642\u0633\u0627\u0645"}</h2>
            </div>
            <button onClick={jumpToCatalog}>{isGroceryStore ? "All groceries / \u0643\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a" : "All products / \u0643\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a"}</button>
          </div>

          <div className={`${styles.categoryScroller} ${portfolioStyles.categoryScrollerPolish}`}>
            <button
              className={`${styles.categoryCard} ${
                selectedCategoryId === "all" ? styles.activeCategoryCard : ""
              }`}
              onClick={() => {
                setSelectedCategoryId("all");
                jumpToCatalog();
              }}
            >
              <div className={styles.allCategoryVisual}>
                <Icon name="store" size={34} />
              </div>
              <span>{isGroceryStore ? "All groceries" : "All products"}</span>
              <small>{products.length} items</small>
            </button>

            {visibleCategories.map((category) => (
              <button
                className={`${styles.categoryCard} ${
                  selectedCategoryId === category.id
                    ? styles.activeCategoryCard
                    : ""
                }`}
                key={category.id}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  window.setTimeout(jumpToCatalog, 0);
                }}
              >
                <div className={styles.categoryVisual}>
                  {category.image_url ? (
                    <img src={category.image_url} alt="" />
                  ) : (
                    <span>{category.name.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <span>{category.name}</span>
                {(isAutoParts ? cleanAutoPartsCategoryArabic(category) : category.name_ar) ? (
                  <em dir="rtl">
                    {isAutoParts ? cleanAutoPartsCategoryArabic(category) : category.name_ar}
                  </em>
                ) : (
                  <small>{Number(category.product_count ?? 0)} items</small>
                )}
              </button>
            ))}
          </div>
        </section>
      ) : null}

            {isGroceryStore ? (
        <section className={styles.groceryPromoBanner}>
          <div className={styles.groceryPromoCopy}>
            <span>{"Weekly picks / \u0645\u062e\u062a\u0627\u0631\u0627\u062a \u0627\u0644\u0623\u0633\u0628\u0648\u0639"}</span>
            <h2>{"Fresh picks, family essentials, and fast shopping."}</h2>
            <p>
              {"Explore what the store is featuring this week, then add what you need straight to your basket. / \u062a\u0635\u0641\u062d \u0645\u062e\u062a\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u062a\u062c\u0631 \u0644\u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0648\u0623\u0636\u0641 \u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a\u0643 \u0644\u0644\u0633\u0644\u0629 \u0645\u0628\u0627\u0634\u0631\u0629."}
            </p>
            <button type="button" onClick={jumpToCatalog}>
              {"Shop groceries / \u062a\u0633\u0648\u0642 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a"}
              <Icon name="arrow" size={18} />
            </button>
          </div>
          <div className={styles.groceryPromoBadge}>
            <Icon name="bag" size={28} />
            <strong>{"Fresh / \u0637\u0627\u0632\u062c"}</strong>
            <span>{"Local shopping made easy / \u062a\u0633\u0648\u0642 \u0645\u062d\u0644\u064a \u0623\u0633\u0647\u0644"}</span>
          </div>
        </section>
      ) : null}
<section
        className={`${styles.catalogShell} ${portfolioStyles.catalogPolish}`}
        id="catalog"
        style={{ order: sectionOrder.indexOf("catalog") }}
      >
        <div className={`${styles.catalogTopbar} ${isGroceryStore ? styles.groceryCatalogTopbar : ""} ${portfolioStyles.catalogTopbarPolish}`}>
          <div>
            <span>Shop {storefront.display_name}</span>
            <h2>
              {selectedCategory ? selectedCategory.name : "All products"}
            </h2>
          </div>

          <label className={`${styles.searchBox} ${portfolioStyles.searchBoxPolish}`}>
            <Icon name="search" size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={isAutoParts ? "Search parts / \u0627\u0628\u062d\u062b \u0639\u0646 \u0642\u0637\u0639\u0629" : "Search this store"}
            />
            {search ? (
              <button type="button" onClick={() => setSearch("")}>
                <Icon name="close" size={16} />
              </button>
            ) : null}
          </label>
        </div>

        {hasVehicleFitment ? (
          <section className={styles.vehicleFilterPanel}>
            <div className={styles.vehicleFilterHeading}>
              <div>
                <span>{"Find the right part / \u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0642\u0637\u0639\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629"}</span>
                <strong>{"Select your vehicle / \u0627\u062e\u062a\u0631 \u0633\u064a\u0627\u0631\u062a\u0643"}</strong>
              </div>
              {(selectedVehicleMake !== "all" || selectedVehicleModel !== "all" || selectedVehicleYear !== "all") ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVehicleMake("all");
                    setSelectedVehicleModel("all");
                    setSelectedVehicleYear("all");
                  }}
                >
                  Clear vehicle filters / مسح
                </button>
              ) : null}
            </div>
            <div className={styles.vehicleFilterGrid}>
              <label>
                <span>Make / النوع</span>
                <select
                  value={selectedVehicleMake}
                  onChange={(event) => {
                    setSelectedVehicleMake(event.target.value);
                    setSelectedVehicleModel("all");
                  }}
                >
                  <option value="all">All makes / كل الأنواع</option>
                  {vehicleMakes.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Model / الموديل</span>
                <select
                  value={selectedVehicleModel}
                  onChange={(event) => setSelectedVehicleModel(event.target.value)}
                >
                  <option value="all">All models / كل الموديلات</option>
                  {vehicleModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Year / السنة</span>
                <select
                  value={selectedVehicleYear}
                  onChange={(event) => setSelectedVehicleYear(event.target.value)}
                >
                  <option value="all">All years / كل السنوات</option>
                  {vehicleYears.map((year) => (
                    <option key={year} value={String(year)}>{year}</option>
                  ))}
                </select>
              </label>
            </div>
                      <div className={`${styles.vehicleMatchSummary} ${hasActiveVehicleFilter ? styles.vehicleMatchActive : ""}`}>
              <span className={styles.vehicleMatchIcon}>
                <Icon name="search" size={17} />
              </span>
              <div>
                <small>
                  {hasActiveVehicleFilter
                    ? "Vehicle selected / \u062a\u0645 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u0633\u064a\u0627\u0631\u0629"
                    : "Fitment finder / \u0628\u062d\u062b \u0627\u0644\u062a\u0648\u0627\u0641\u0642"}
                </small>
                <strong>
                  {hasActiveVehicleFilter
                    ? activeVehicleLabel
                    : "Make + model + year / \u0627\u0644\u0646\u0648\u0639 + \u0627\u0644\u0645\u0648\u062f\u064a\u0644 + \u0627\u0644\u0633\u0646\u0629"}
                </strong>
              </div>
              {hasActiveVehicleFilter ? <b>{filteredProducts.length}</b> : null}
      {isGroceryStore && (storeWhatsappHref || phone) ? (
        <section className={styles.groceryAssistance}>
          <div className={styles.groceryAssistanceCopy}>
            <span>{"Need something special? / \u0628\u062f\u0643 \u0637\u0644\u0628 \u062e\u0627\u0635\u061f"}</span>
            <h2>{"Let the store help you complete the basket."}</h2>
            <p>
              {"Use WhatsApp or call for special requests, missing products, or larger household orders. / \u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u0645\u062a\u062c\u0631 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628 \u0623\u0648 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0644\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062e\u0627\u0635\u0629 \u0623\u0648 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u063a\u064a\u0631 \u0627\u0644\u0638\u0627\u0647\u0631\u0629."}
            </p>
          </div>
          <div className={styles.groceryAssistanceActions}>
            {storeWhatsappHref ? (
              <a
                className={styles.groceryAssistanceWhatsapp}
                href={storeWhatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={18} />
                <span>{"WhatsApp / \u0648\u0627\u062a\u0633\u0627\u0628"}</span>
              </a>
            ) : null}
            {phone ? (
              <a className={styles.groceryAssistanceCall} href={phone}>
                <Icon name="call" size={18} />
                <span>{"Call us / \u0627\u062a\u0635\u0644 \u0628\u0646\u0627"}</span>
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
            </div></section>
        ) : null}

        {visibleCategories.length > 0 ? (
          <div className={styles.categoryPills}>
            <button
              className={selectedCategoryId === "all" ? styles.activePill : ""}
              onClick={() => setSelectedCategoryId("all")}
            >
              All
            </button>
            {visibleCategories.map((category) => (
              <button
                className={
                  selectedCategoryId === category.id ? styles.activePill : ""
                }
                key={`pill-${category.id}`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                {category.name}
                <span>{Number(category.product_count ?? 0)}</span>
              </button>
            ))}
          </div>
        ) : null}

        {loadError ? <p className={styles.notice}>{loadError}</p> : null}

        {visibleCategories.length > 0 ? (
          <section className={styles.marketplaceCategoryNav} aria-label="Store categories">
            <div className={styles.marketplaceCategoryNavLabel}>
              {"Categories / \u0627\u0644\u0623\u0642\u0633\u0627\u0645"}
            </div>

            <div className={styles.marketplaceCategoryScroller}>
              <button
                type="button"
                className={`${styles.marketplaceCategoryItem} ${styles.marketplaceCategoryBestSellers} ${selectedCategoryId === "BestSellers" ? styles.marketplaceCategoryItemActive : ""}`}
                onClick={() => setSelectedCategoryId("BestSellers")}
              >
                <span className={styles.marketplaceCategoryCircle}>
                  <span className={styles.marketplaceCategoryStar}>★</span>
                  {selectedCategoryId === "BestSellers" ? (
                    <span className={styles.marketplaceCategorySelectedDot} />
                  ) : null}
                </span>
                <strong>Best Sellers</strong>
                <small dir="rtl">{"\u0627\u0644\u0623\u0643\u062b\u0631 \u0645\u0628\u064a\u0639\u0627\u064b"}</small>
              </button>

              {visibleCategories.map((category) => {
                const categoryArabic = isAutoParts
                  ? cleanAutoPartsCategoryArabic(category)
                  : category.name_ar;
                const active = selectedCategoryId === category.id;

                return (
                  <button
                    type="button"
                    key={`marketplace-category-${category.id}`}
                    className={`${styles.marketplaceCategoryItem} ${active ? styles.marketplaceCategoryItemActive : ""}`}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <span className={styles.marketplaceCategoryCircle}>
                      {category.image_url ? (
                        <img src={category.image_url} alt="" />
                      ) : (
                        <span>{category.name.slice(0, 1).toUpperCase()}</span>
                      )}
                      {active ? (
                        <span className={styles.marketplaceCategorySelectedDot} />
                      ) : null}
                    </span>
                    <strong>{category.name}</strong>
                    {categoryArabic ? <small dir="rtl">{categoryArabic}</small> : null}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className={styles.marketplaceListingHeader}>
          <div>
            <span>
              {selectedCategoryId === "BestSellers"
                ? "CURATED FOR THIS STORE"
                : "STORE CATEGORY"}
            </span>
            <h3>
              {selectedCategoryId === "BestSellers"
                ? "Best Sellers / \u0627\u0644\u0623\u0643\u062b\u0631 \u0645\u0628\u064a\u0639\u0627\u064b"
                : selectedCategory?.name || "Products"}
            </h3>
          </div>
          <small>
            {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
          </small>
        </div>

        {featuredProducts.length > 0 && selectedCategoryId === "__legacy_featured_disabled__" ? (
          <section className={`${styles.productSection} ${isGroceryStore ? styles.groceryFeaturedProducts : ""} ${portfolioStyles.productSectionPolish}`}>
            <div className={styles.productSectionHeading}>
              <div>
                <span>{isGroceryStore ? "Featured products / \u0645\u0646\u062a\u062c\u0627\u062a \u0645\u0645\u064a\u0632\u0629" : "Handpicked by the store"}</span>
                <h3>{isGroceryStore ? "Fresh favorites / \u0627\u0644\u0645\u0641\u0636\u0644\u0629" : "Featured products"}</h3>
              </div>
              <small>{featuredProducts.length} featured</small>
            </div>
            <div className={`${styles.productGrid} ${portfolioStyles.productGridPolish}`}>
              {featuredProducts.map(renderProductCard)}
            </div>
          </section>
        ) : null}

        <section className={`${styles.productSection} ${isGroceryStore ? styles.groceryCatalogProducts : ""} ${portfolioStyles.productSectionPolish}`}>
          <div className={styles.productSectionHeading}>
            <div>
              <span>{isAutoParts ? "Parts catalog / \u0643\u062a\u0627\u0644\u0648\u062c \u0627\u0644\u0642\u0637\u0639" : isGroceryStore ? "Store catalog / \u0643\u062a\u0627\u0644\u0648\u062c \u0627\u0644\u0645\u062a\u062c\u0631" : search ? `Results for “${search}”` : "Store catalog"}</span>
              <h3>
                {isAutoParts ? (hasActiveVehicleFilter ? "Matches / \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629" : "Parts / \u0627\u0644\u0642\u0637\u0639") : isGroceryStore ? (featuredProducts.length > 0 ? "More groceries / \u0645\u0646\u062a\u062c\u0627\u062a \u0625\u0636\u0627\u0641\u064a\u0629" : "Products / \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a") : featuredProducts.length > 0 ? "More to explore" : "Products"}
              </h3>
            </div>
            <small>{filteredProducts.length} {isAutoParts ? (filteredProducts.length === 1 ? "part" : "parts") : (filteredProducts.length === 1 ? "item" : "items")}</small>
          </div>

          {filteredProducts.length === 0 ? (
            <div className={styles.emptyCatalog}>
              <div>
                <Icon name="search" size={28} />
              </div>
              <h3>{products.length === 0 ? "Products are coming soon" : "Nothing matched"}</h3>
              <p>
                {products.length === 0
                  ? `${storefront.display_name} is preparing its online catalog. Check back shortly or contact the store directly.`
                  : "Try another category or a different search term."}
              </p>
              {products.length > 0 ? (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategoryId("all");
                    setSelectedVehicleMake("all");
                    setSelectedVehicleModel("all");
                    setSelectedVehicleYear("all");
                  }}
                >
                  Clear filters
                </button>
              ) : contactLinks[0] ? (
                <a href={contactLinks[0].href}>Contact the store</a>
              ) : null}
            </div>
          ) : filteredProducts.length > 0 ? (
            selectedCategoryId === "BestSellers" ? (
              <div className={styles.marketplaceBestSellerStack}>
                {marketplaceBestSellerGroups.map(({ category, products: categoryProducts }) => (
                  <section
                    key={`best-sellers-${category.id}`}
                    className={styles.marketplaceBestSellerDepartment}
                  >
                    <button
                      type="button"
                      className={styles.marketplaceBestSellerDepartmentTitle}
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      {"Best Sellers in " + category.name + " →"}
                    </button>

                    <div className={styles.marketplaceBestSellerCarousel}>
                      {categoryProducts.map((product) => (
                        <div
                          key={`best-seller-${product.id}`}
                          className={styles.marketplaceBestSellerItem}
                        >
                          {renderProductCard(product)}
                          <a
                            className={styles.marketplaceBestSellerTapTarget}
                            href={`/${storefront.slug}?product=${encodeURIComponent(product.id)}#catalog`}
                            aria-label={`View ${productName(product)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className={`${styles.productGrid} ${styles.marketplaceCategoryProductList}`}>
                {filteredProducts.map(renderProductCard)}
              </div>
            )
          ) : null}
        </section>
      </section>

      {showStoreStory ? (
      <section
        className={`${styles.storeStory} ${portfolioStyles.storyPolish}`}
        style={{ order: sectionOrder.indexOf("story") }}
      >
        <div className={styles.storyCopy}>
          <span>About this store</span>
          <h2>About {storefront.display_name}</h2>
          <p>
            {storefront.about_text ||
              `${storefront.display_name} makes it easy to browse available products, check fitment, and contact the store directly for help.`}
          </p>
          {storefront.about_text_ar ? (
            <p className={styles.storyArabic} dir="rtl">
              {storefront.about_text_ar}
            </p>
          ) : null}
          <button onClick={() => setDetailsOpen(true)}>
            View store information
            <Icon name="arrow" size={17} />
          </button>
        </div>

        <div className={styles.storyStats}>
          <article>
            <strong>{availableProductCount}</strong>
            <span>Available products</span>
          </article>
          <article>
            <strong>{visibleCategories.length}</strong>
            <span>Store categories</span>
          </article>
          <article>
            <strong>
              {pickupOnly
                ? "Pickup"
                : storefront.estimated_delivery_minutes
                  ? `${storefront.estimated_delivery_minutes}m`
                  : "Local"}
            </strong>
            <span>{pickupOnly ? "Local pickup" : "Delivery estimate"}</span>
          </article>
          <article>
            <strong>
              {!showOrdering ? "Catalog" : pickupOnly ? "Pickup only" : "Delivery"}
            </strong>
            <span>
              {!showOrdering
                ? "Showcase website"
                : (pickupOnly || selectedPickup) ? "Collect from store"
                  : "Order method"}
            </span>
          </article>
        </div>
      </section>
      ) : null}
      </div>

      {isAutoParts && (partsHelpWhatsappHref || phone) ? (
        <section className={`${styles.partsConcierge} ${portfolioStyles.conciergePolish}`}>
          <div className={styles.partsConciergeIcon}>
            <Icon name="store" size={24} />
          </div>
          <div className={styles.partsConciergeCopy}>
            <span>{"Parts support / \u0645\u0633\u0627\u0639\u062f\u0629 \u0628\u0627\u0644\u0642\u0637\u0639"}</span>
            <h2>{"Can't find the part? / \u0645\u0634 \u0644\u0627\u0642\u064a \u0627\u0644\u0642\u0637\u0639\u0629\u061f"}</h2>
            <p>
              {"Send your vehicle model or VIN and contact the store directly for help matching the correct part. / \u0623\u0631\u0633\u0644 \u0645\u0648\u062f\u064a\u0644 \u0627\u0644\u0633\u064a\u0627\u0631\u0629 \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0634\u0627\u0635\u064a \u0644\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0641\u064a \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0642\u0637\u0639\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629."}
            </p>
          </div>
          <div className={styles.partsConciergeActions}>
            {partsHelpWhatsappHref ? (
              <a
                className={styles.partsConciergeWhatsapp}
                href={partsHelpWhatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={18} />
                <span>{"WhatsApp / \u0648\u0627\u062a\u0633\u0627\u0628"}</span>
              </a>
            ) : null}
            {phone ? (
              <a className={styles.partsConciergeCall} href={phone}>
                <Icon name="call" size={18} />
                <span>{"Call / \u0627\u062a\u0635\u0627\u0644"}</span>
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
      <footer className={`${styles.footer} ${portfolioStyles.footerPolish}`}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            {storefront.logo_url ? (
              <img src={storefront.logo_url} alt="" />
            ) : (
              <span>{storefront.display_name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div>
            <strong>{storefront.display_name}</strong>
            <span>
              {storefront.address_text ||
                storefront.address_text_ar ||
                "Darik Direct storefront"}
            </span>
          </div>
        </div>

        <div className={styles.footerSocials}>
          {contactLinks.slice(0, 8).map((link) => (
            <a
              aria-label={link.label}
              key={`footer-${link.label}-${link.href}`}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <Icon name={link.icon} size={17} />
            </a>
          ))}
        </div>

        <a className={styles.poweredBy} href="/">
          Powered by <strong>Darik</strong>
        </a>
      </footer>

      {showOrdering && cartCount > 0 ? (
        <button className={styles.mobileCartBar} onClick={() => setCartOpen(true)}>
          <span>
            <Icon name="bag" size={19} />
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </span>
          <strong>{money(orderTotal)}</strong>
          <span>
            View cart
            <Icon name="arrow" size={16} />
          </span>
        </button>
      ) : null}

      {isAutoParts &&
      mobileContactDockVisible &&
      !detailsOpen &&
      !cartOpen &&
      !onlineCheckoutOpen &&
      (partsHelpWhatsappHref || phone) ? (
        <div className={styles.mobileContactDock}>
          <div className={styles.mobileDockIdentity}>
            <div>
              {storefront.logo_url ? (
                <img src={storefront.logo_url} alt="" />
              ) : (
                <span>{storefront.display_name.slice(0, 1)}</span>
              )}
            </div>
            <p>
              <strong>{"Need a part? / \u0628\u062f\u0643 \u0642\u0637\u0639\u0629\u061f"}</strong>
              <small>{"Ask the store directly / \u0627\u0633\u0623\u0644 \u0627\u0644\u0645\u062a\u062c\u0631 \u0645\u0628\u0627\u0634\u0631\u0629"}</small>
            </p>
          </div>
          <div className={styles.mobileDockActions}>
            {phone ? (
              <a href={phone} aria-label="Call store">
                <Icon name="call" size={18} />
              </a>
            ) : null}
            {partsHelpWhatsappHref ? (
              <a
                className={styles.mobileDockWhatsapp}
                href={partsHelpWhatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp store"
              >
                <Icon name="whatsapp" size={19} />
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
      {detailsOpen ? (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetailsOpen(false);
          }}
        >
          <section
            className={styles.detailsModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-details-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <div className={styles.modalStoreTitle}>
                <div>
                  {storefront.logo_url ? (
                    <img src={storefront.logo_url} alt="" />
                  ) : (
                    <span>{storefront.display_name.slice(0, 1)}</span>
                  )}
                </div>
                <span>
                  <small>Store information</small>
                  <strong id="store-details-title">{storefront.display_name}</strong>
                </span>
              </div>
              <button type="button" aria-label="Close store details" onClick={() => setDetailsOpen(false)}>
                <Icon name="close" size={20} />
              </button>
            </header>

            <div className={styles.modalBody}>
              {(storefront.about_text || storefront.about_text_ar) ? (
                <article className={styles.detailSection}>
                  <span className={styles.detailSectionIcon}>
                    <Icon name="store" size={19} />
                  </span>
                  <div>
                    <h3>About the store</h3>
                    {storefront.about_text ? <p>{storefront.about_text}</p> : null}
                    {storefront.about_text_ar ? (
                      <p className={styles.modalArabic} dir="rtl">
                        {storefront.about_text_ar}
                      </p>
                    ) : null}
                  </div>
                </article>
              ) : null}

              {(storefront.address_text || storefront.address_text_ar) ? (
                <article className={styles.detailSection}>
                  <span className={styles.detailSectionIcon}>
                    <Icon name="location" size={19} />
                  </span>
                  <div>
                    <h3>Address / العنوان</h3>
                    {storefront.address_text ? (
                      <p>{storefront.address_text}</p>
                    ) : null}
                    {storefront.address_text_ar ? (
                      <p className={styles.modalArabic} dir="rtl">
                        {storefront.address_text_ar}
                      </p>
                    ) : null}
                  </div>
                </article>
              ) : null}

              {contactLinks.length > 0 ? (
                <article className={styles.detailGroup}>
                  <h3>Contact and social links</h3>
                  <div className={styles.contactGrid}>
                    {contactLinks.map((link) => (
                      <a
                        key={`modal-${link.label}-${link.href}`}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      >
                        <span>
                          <Icon name={link.icon} size={18} />
                        </span>
                        <div>
                          <small>
                            {link.label}
                            {link.labelAr ? ` / ${link.labelAr}` : ""}
                          </small>
                          <strong>{link.detail}</strong>
                        </div>
                        <Icon name="arrow" size={16} />
                      </a>
                    ))}
                  </div>
                </article>
              ) : null}

              {visibleHours.length > 0 ? (
                <article className={styles.detailGroup}>
                  <h3>Business hours</h3>
                  <div className={styles.hoursGrid}>
                    {visibleHours.map(([day, label, labelAr]) => (
                      <div key={day}>
                        <span>
                          {label} / <b dir="rtl">{labelAr}</b>
                        </span>
                        {operatingHours[day] ? (
                          <strong>{operatingHours[day]}</strong>
                        ) : null}
                        {operatingHoursAr[day] ? (
                          <strong dir="rtl">{operatingHoursAr[day]}</strong>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}

              {customInformation.length > 0 ? (
                <article className={styles.detailGroup}>
                  <h3>More information</h3>
                  <div className={styles.customInfoGrid}>
                    {customInformation.map((item, index) => (
                      <div key={`${item.label}-${index}`}>
                        {item.label ? <span>{item.label}</span> : null}
                        {item.label_ar ? (
                          <span dir="rtl">{item.label_ar}</span>
                        ) : null}
                        {item.value ? <strong>{item.value}</strong> : null}
                        {item.value_ar ? (
                          <strong dir="rtl">{item.value_ar}</strong>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {cartOpen ? (
        <div className={styles.cartOverlay} onClick={() => setCartOpen(false)}>
          <aside
            className={styles.cartDrawer}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.cartHeader}>
              <div>
                <p>{storefront.display_name}</p>
                <h2>Your cart</h2>
              </div>
              <button
                onClick={() => {
                  setCartOpen(false);
                  setOnlineCheckoutOpen(false);
                  setOrderConfirmation(null);
                  setCheckoutError("");
                }}
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {orderConfirmation ? (
              <div className={styles.orderConfirmation}>
                <span>
                  <Icon name="bag" size={30} />
                </span>
                <p>Order sent successfully</p>
                <h2>{orderConfirmation.orderNumber}</h2>
                <strong>{money(orderConfirmation.total)}</strong>
                <small>
                  {orderConfirmation.fulfillmentMethod === "pickup"
                    ? orderConfirmation.paymentMethod === "cliq"
                      ? "Your CliQ receipt was submitted. The store will contact you when the pickup order is ready."
                      : "The store received your pickup order and will contact you when it is ready to collect."
                    : orderConfirmation.paymentMethod === "cliq"
                      ? "Your CliQ receipt was submitted for store verification. The store will contact you to confirm delivery."
                      : "The store received your cash-on-delivery order and will contact you to confirm delivery."}
                </small>
                <button
                  onClick={() => {
                    setOrderConfirmation(null);
                    setCartOpen(false);
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`${styles.cartLines} ${
                    onlineCheckoutOpen ? styles.cartLinesCheckoutHidden : ""
                  }`}
                >
                  {cart.length === 0 ? (
                    <div className={styles.emptyCart}>
                      <span>
                        <Icon name="bag" size={30} />
                      </span>
                      <h3>Your cart is empty</h3>
                      <p>Add something from {storefront.display_name}.</p>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          jumpToCatalog();
                        }}
                      >
                        Start shopping
                      </button>
                    </div>
                  ) : (
                    cart.map((line) => (
                      <div className={styles.cartLine} key={line.productId}>
                        <div className={styles.cartThumb}>
                          {line.photoUrl ? (
                            <img src={line.photoUrl} alt={line.name} />
                          ) : (
                            <span>{line.name.slice(0, 1)}</span>
                          )}
                        </div>
                        <div className={styles.cartLineInfo}>
                          <h3>{line.name}</h3>
                          <p>{money(line.price)}</p>
                        </div>
                        <div className={styles.quantity}>
                          <button
                            onClick={() => changeQuantity(line.productId, -1)}
                          >
                            <Icon name="minus" size={15} />
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            onClick={() => changeQuantity(line.productId, 1)}
                          >
                            <Icon name="plus" size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div
                  className={`${styles.cartSummary} ${
                    onlineCheckoutOpen ? styles.checkoutSummaryOpen : ""
                  }`}
                >
                  <div>
                    <span>Subtotal</span>
                    <strong>{money(cartSubtotal)}</strong>
                  </div>
                  <div>
                    <span>{selectedPickup ? "Pickup" : "Delivery"}</span>
                    <strong>{selectedPickup ? "Free" : money(deliveryFee)}</strong>
                  </div>
                  <div className={styles.cartTotal}>
                    <span>Total</span>
                    <strong>{money(orderTotal)}</strong>
                  </div>

                  {!minimumReached ? (
                    <div className={styles.minimumProgress}>
                      <div>
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              minimumOrder > 0
                                ? (cartSubtotal / minimumOrder) * 100
                                : 100
                            )}%`,
                          }}
                        />
                      </div>
                      <p>
                        Add {money(minimumOrder - cartSubtotal)} to reach the
                        minimum order.
                      </p>
                    </div>
                  ) : null}

                  {onlineCheckoutOpen &&
                  onlineOrderingEnabled &&
                  cart.length > 0 &&
                  minimumReached &&
                  storefront.is_accepting_orders ? (
                    <div className={styles.onlineCheckoutForm}>
              {!darikIsBuilderPreview120() ? (
                <section className={styles.darikCheckoutIdentity121}>
                  <div className={styles.darikCheckoutIdentityHeader121}>
                    <div>
                      <span>حساب داريك / Darik account</span>
                      <strong>One account. Every Darik store.</strong>
                    </div>
                    {darikCustomerProfile121 ? (
                      <span className={styles.darikAccountBadge121}>SIGNED IN</span>
                    ) : darikCheckoutIdentity121 === "guest" ? (
                      <span className={styles.darikGuestBadge121}>GUEST</span>
                    ) : null}
                  </div>

                  <p className={styles.darikCheckoutIdentityCopy121}>
                    Create one Darik customer account and use the same login on any
                    Darik-powered retailer storefront. Or place this order as a guest.
                  </p>

                  {darikCustomerProfile121 ? (
                    <div className={styles.darikAccountSigned121}>
                      <div>
                        <small>Signed in as / مسجل الدخول</small>
                        <strong>
                          {darikCustomerProfile121.full_name ||
                            darikCustomerUser121?.email ||
                            "Darik customer"}
                        </strong>
                        <span>{darikCustomerUser121?.email || ""}</span>
                      </div>
                      <div className={styles.darikAccountSignedActions121}>
                        <span>
                          This order will be saved to your Darik account / سيتم حفظ الطلب
                          في حساب داريك
                        </span>
                        <button
                          type="button"
                          onClick={() => void signOutDarikCustomer121()}
                          disabled={darikAuthBusy121}
                        >
                          Sign out & use guest / تسجيل الخروج والمتابعة كضيف
                        </button>
                      </div>
                    </div>
                  ) : darikCheckoutIdentity121 === "choice" ? (
                    <div className={styles.darikAccountChoiceActions121}>
                      <button
                        type="button"
                        className={styles.darikAccountPrimary121}
                        onClick={() => {
                          setDarikAuthMessage121("");
                          setDarikCheckoutIdentity121("login");
                        }}
                      >
                        Sign in / تسجيل الدخول
                      </button>
                      <button
                        type="button"
                        className={styles.darikAccountSecondary121}
                        onClick={() => {
                          setDarikAuthMessage121("");
                          setDarikSignupStep121("details");
                          setDarikCheckoutIdentity121("signup");
                        }}
                      >
                        Create Darik account / إنشاء حساب داريك
                      </button>
                      <button
                        type="button"
                        className={styles.darikAccountGuest121}
                        onClick={() => void chooseDarikGuestCheckout121()}
                      >
                        Continue as guest / المتابعة كضيف
                      </button>
                    </div>
                  ) : darikCheckoutIdentity121 === "guest" ? (
                    <div className={styles.darikAccountGuestState121}>
                      <div>
                        <strong>Guest checkout / طلب كضيف</strong>
                        <span>
                          No Darik account required. This order will use the name and
                          phone entered below.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDarikAuthMessage121("");
                          setDarikCheckoutIdentity121("choice");
                        }}
                      >
                        Use a Darik account instead
                      </button>
                    </div>
                  ) : darikCheckoutIdentity121 === "login" ? (
                    <div className={styles.darikAccountForm121}>
                      <div className={styles.darikAccountFormHeading121}>
                        <strong>Sign in to Darik / تسجيل الدخول إلى داريك</strong>
                        <span>Your login works across Darik-powered stores.</span>
                      </div>
                      {darikNonCustomerSession121 ? (
                        <p className={styles.darikAccountSessionNotice121}>
                          Another Darik staff/retailer session is active in this browser.
                          Signing in here will switch this browser to your customer account.
                        </p>
                      ) : null}
                      <label>
                        Email / البريد الإلكتروني
                        <input
                          type="email"
                          value={darikLoginEmail121}
                          onChange={(event) => setDarikLoginEmail121(event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                        />
                      </label>
                      <label>
                        Password / كلمة المرور
                        <input
                          type="password"
                          value={darikLoginPassword121}
                          onChange={(event) => setDarikLoginPassword121(event.target.value)}
                          placeholder="Your Darik password"
                          autoComplete="current-password"
                        />
                      </label>
                      <div className={styles.darikAccountFormActions121}>
                        <button
                          type="button"
                          className={styles.darikAccountPrimary121}
                          onClick={() => void signInDarikCustomer121()}
                          disabled={darikAuthBusy121}
                        >
                          {darikAuthBusy121 ? "Signing in..." : "Sign in / تسجيل الدخول"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDarikCheckoutIdentity121("choice")}
                          disabled={darikAuthBusy121}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => void chooseDarikGuestCheckout121()}
                          disabled={darikAuthBusy121}
                        >
                          Continue as guest
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.darikAccountForm121}>
                      <div className={styles.darikAccountFormHeading121}>
                        <strong>Create your Darik account / أنشئ حساب داريك</strong>
                        <span>
                          Use this same email and password later at any Darik store.
                        </span>
                      </div>

                      {darikSignupStep121 === "details" ? (
                        <div className={styles.darikAccountFormGrid121}>
                          <label>
                            Full name / الاسم الكامل
                            <input
                              value={darikSignupName121}
                              onChange={(event) =>
                                setDarikSignupName121(event.target.value)
                              }
                              placeholder="Your full name"
                              autoComplete="name"
                            />
                          </label>
                          <label>
                            Phone / رقم الهاتف
                            <input
                              type="tel"
                              value={darikSignupPhone121}
                              onChange={(event) =>
                                setDarikSignupPhone121(event.target.value)
                              }
                              placeholder="07XXXXXXXX"
                              autoComplete="tel"
                            />
                          </label>
                          <label>
                            Email / البريد الإلكتروني
                            <input
                              type="email"
                              value={darikSignupEmail121}
                              onChange={(event) =>
                                setDarikSignupEmail121(event.target.value)
                              }
                              placeholder="you@example.com"
                              autoComplete="email"
                            />
                          </label>
                          <label>
                            Password / كلمة المرور
                            <input
                              type="password"
                              value={darikSignupPassword121}
                              onChange={(event) =>
                                setDarikSignupPassword121(event.target.value)
                              }
                              placeholder="8+ chars, capital, number, special"
                              autoComplete="new-password"
                            />
                          </label>
                          <label>
                            Confirm password / تأكيد كلمة المرور
                            <input
                              type="password"
                              value={darikSignupPasswordConfirm121}
                              onChange={(event) =>
                                setDarikSignupPasswordConfirm121(event.target.value)
                              }
                              placeholder="Repeat password"
                              autoComplete="new-password"
                            />
                          </label>
                        </div>
                      ) : null}

                      {darikSignupStep121 === "email_code" ? (
                        <div className={styles.darikAccountCode121}>
                          <span>Email confirmation / تأكيد البريد</span>
                          <strong>{darikSignupEmail121.trim().toLowerCase()}</strong>
                          <input
                            inputMode="numeric"
                            value={darikSignupEmailCode121}
                            onChange={(event) =>
                              setDarikSignupEmailCode121(event.target.value)
                            }
                            placeholder="Email code"
                            autoComplete="one-time-code"
                          />
                        </div>
                      ) : null}

                      {darikSignupStep121 === "phone_code" ? (
                        <div className={styles.darikAccountCode121}>
                          <span>Phone confirmation / تأكيد الهاتف</span>
                          <strong>
                            {normalizeDarikCustomerPhone121(darikSignupPhone121)}
                          </strong>
                          <input
                            inputMode="numeric"
                            value={darikSignupPhoneCode121}
                            onChange={(event) =>
                              setDarikSignupPhoneCode121(event.target.value)
                            }
                            placeholder="SMS code"
                            autoComplete="one-time-code"
                          />
                        </div>
                      ) : null}

                      <div className={styles.darikAccountFormActions121}>
                        {darikSignupStep121 === "details" ? (
                          <button
                            type="button"
                            className={styles.darikAccountPrimary121}
                            onClick={() => void startDarikCustomerSignup121()}
                            disabled={darikAuthBusy121}
                          >
                            {darikAuthBusy121
                              ? "Creating..."
                              : "Create Darik account / إنشاء الحساب"}
                          </button>
                        ) : darikSignupStep121 === "email_code" ? (
                          <button
                            type="button"
                            className={styles.darikAccountPrimary121}
                            onClick={() => void confirmDarikSignupEmail121()}
                            disabled={darikAuthBusy121}
                          >
                            {darikAuthBusy121
                              ? "Confirming..."
                              : "Confirm email & send SMS"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.darikAccountPrimary121}
                            onClick={() => void confirmDarikSignupPhone121()}
                            disabled={darikAuthBusy121}
                          >
                            {darikAuthBusy121
                              ? "Confirming..."
                              : "Confirm phone & finish account"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setDarikAuthMessage121("");
                            setDarikSignupStep121("details");
                            setDarikCheckoutIdentity121("choice");
                          }}
                          disabled={darikAuthBusy121}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => void chooseDarikGuestCheckout121()}
                          disabled={darikAuthBusy121}
                        >
                          Continue as guest
                        </button>
                      </div>
                    </div>
                  )}

                  {darikAuthMessage121 ? (
                    <p className={styles.darikAccountStatus121} role="status">
                      {darikAuthMessage121}
                    </p>
                  ) : null}
                </section>
              ) : null}

                      <div className={styles.onlineCheckoutHeading}>
                        <div>
                          <span>Online order</span>
                          <h3>{selectedPickup ? "Pickup details" : "Delivery details"}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOnlineCheckoutOpen(false);
                            setCheckoutError("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className={styles.paymentMethodSection}>
                        <span>Fulfillment method</span>
                        <div className={styles.paymentMethodChoices}>
                          {deliveryEnabled ? (
                            <button
                              type="button"
                              className={
                                checkoutForm.fulfillmentMethod === "delivery"
                                  ? styles.activePaymentMethod
                                  : ""
                              }
                              onClick={() =>
                                updateCheckoutField("fulfillmentMethod", "delivery")
                              }
                            >
                              <strong>Delivery</strong>
                              <small>Delivered to your exact location</small>
                            </button>
                          ) : null}
                          {pickupEnabled ? (
                            <button
                              type="button"
                              className={
                                checkoutForm.fulfillmentMethod === "pickup"
                                  ? styles.activePaymentMethod
                                  : ""
                              }
                              onClick={() =>
                                updateCheckoutField("fulfillmentMethod", "pickup")
                              }
                            >
                              <strong>Local pickup</strong>
                              <small>Collect from the store</small>
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className={styles.paymentMethodSection}>
                        <span>Payment method</span>
                        <div className={styles.paymentMethodChoices}>
                          {storefront.cash_on_delivery_enabled ? (
                            <button
                              type="button"
                              className={
                                checkoutForm.paymentMethod === "cash"
                                  ? styles.activePaymentMethod
                                  : ""
                              }
                              onClick={() =>
                                updateCheckoutField("paymentMethod", "cash")
                              }
                            >
                              <strong>Cash</strong>
                              <small>{selectedPickup ? "Pay at pickup" : "Pay on delivery"}</small>
                            </button>
                          ) : null}

                          {storefront.cliq_enabled ? (
                            <button
                              type="button"
                              className={
                                checkoutForm.paymentMethod === "cliq"
                                  ? styles.activePaymentMethod
                                  : ""
                              }
                              onClick={() =>
                                updateCheckoutField("paymentMethod", "cliq")
                              }
                            >
                              <strong>CliQ</strong>
                              <small>Transfer before submitting</small>
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {checkoutForm.paymentMethod === "cliq" ? (
                        <div className={styles.cliqPaymentPanel}>
                          <span>Send exactly {money(orderTotal)} by CliQ</span>
                          <div>
                            <small>Account name</small>
                            <strong>
                              {storefront.cliq_account_name ||
                                storefront.display_name}
                            </strong>
                          </div>
                          <div>
                            <small>CliQ alias / mobile</small>
                            <strong>
                              {storefront.cliq_payment_identifier}
                            </strong>
                          </div>
                          <label className={styles.receiptUploadField}>
                            CliQ receipt image <strong>Required</strong>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(event) =>
                                selectCliqReceipt(event.target.files?.[0] ?? null)
                              }
                            />
                          </label>
                          {cliqReceiptPreview ? (
                            <div className={styles.receiptPreview}>
                              <img src={cliqReceiptPreview} alt="CliQ receipt preview" />
                              <div>
                                <strong>Receipt ready</strong>
                                <small>{cliqReceiptFile?.name}</small>
                                <button
                                  type="button"
                                  onClick={() => selectCliqReceipt(null)}
                                >
                                  Remove receipt
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className={styles.receiptRequirement}>
                              Upload the transfer receipt before submitting. A
                              reference number is not required.
                            </p>
                          )}
                          <p>
                            The store will review the receipt before preparing
                            the order.
                          </p>
                        </div>
                      ) : null}

                      <label>
                        Name
                        <input
                          value={checkoutForm.customerName}
                          onChange={(event) =>
                            updateCheckoutField(
                              "customerName",
                              event.target.value
                            )
                          }
                          placeholder="Your full name"
                        />
                      </label>

                      <label>
                        Phone
                        <input
                          type="tel"
                          value={checkoutForm.customerPhone}
                          onChange={(event) =>
                            updateCheckoutField(
                              "customerPhone",
                              event.target.value
                            )
                          }
                          placeholder="07XXXXXXXX"
                        />
                      </label>

                      {selectedPickup ? (
                        <div className={styles.exactLocationBlock}>
                          <div>
                            <strong>Local pickup only</strong>
                            <small>Collect your order from the store address after confirmation.</small>
                          </div>
                          <strong>{storefront.address_text || "Store address shown in store information"}</strong>
                        </div>
                      ) : (
                        <>
                          <div className={styles.darikCheckoutLocation122}>
                    <div className={styles.darikCheckoutLocationHeading122}>
                      <div>
                        <strong>
                          Delivery location / موقع التوصيل
                        </strong>
                        <small>
                          Use your location or search Google, then confirm the pin.
                          / استخدم موقعك أو ابحث في جوجل ثم أكد العلامة.
                        </small>
                      </div>
                      {checkoutLocationConfirmed122 ? (
                        <span className={styles.darikCheckoutLocationConfirmed122}>
                          Confirmed / مؤكد
                        </span>
                      ) : null}
                    </div>

                    <div className={styles.darikCheckoutLocationActions122}>
                      <button
                        type="button"
                        className={styles.darikCheckoutGps122}
                        onClick={useCheckoutCurrentLocation122}
                        disabled={
                          checkoutLocationBusy122 ||
                          checkoutLocationSearchBusy122
                        }
                      >
                        {checkoutLocationBusy122
                          ? "Locating… / جاري تحديد الموقع…"
                          : "Use current location / استخدم موقعي الحالي"}
                      </button>

                      <div className={styles.darikCheckoutSearchRow122}>
                        <input
                          value={checkoutLocationQuery122}
                          onChange={(event) =>
                            setCheckoutLocationQuery122(
                              event.target.value
                            )
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void searchCheckoutLocation122();
                            }
                          }}
                          placeholder="Search Google Maps / ابحث في خرائط جوجل"
                          aria-label="Search Google Maps for delivery location"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            void searchCheckoutLocation122()
                          }
                          disabled={
                            checkoutLocationSearchBusy122 ||
                            checkoutLocationBusy122
                          }
                        >
                          {checkoutLocationSearchBusy122
                            ? "Searching…"
                            : "Search / بحث"}
                        </button>
                      </div>
                    </div>

                    {checkoutLocationPredictions122.length ? (
                      <div className={styles.darikCheckoutPredictions122}>
                        {checkoutLocationPredictions122.map(
                          (prediction) => (
                            <button
                              type="button"
                              key={prediction.place_id}
                              onClick={() =>
                                void chooseCheckoutPlace122(
                                  prediction
                                )
                              }
                            >
                              <strong>
                                {prediction.structured_formatting
                                  ?.main_text ||
                                  prediction.description}
                              </strong>
                              <span>
                                {prediction.structured_formatting
                                  ?.secondary_text ||
                                  prediction.description}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    ) : null}

                    {checkoutLocationDraft122 ? (
                      <div className={styles.darikCheckoutMapSection122}>
                        <div
                          className={styles.darikCheckoutMap122}
                          onPointerDown={startCheckoutMapPinMove122}
                          onPointerMove={moveCheckoutMapPin122}
                          onPointerUp={(event) =>
                            void finishCheckoutMapPinMove122(
                              event
                            )
                          }
                          onPointerCancel={
                            cancelCheckoutMapPinMove122
                          }
                          role="application"
                          aria-label="Google map delivery pin. Tap or drag to adjust the delivery location."
                        >
                          <iframe
                            key={`${checkoutLocationDraft122.latitude.toFixed(
                              6
                            )}:${checkoutLocationDraft122.longitude.toFixed(
                              6
                            )}`}
                            src={darikCheckoutMapUrl122(
                              checkoutLocationDraft122
                            )}
                            title="Delivery location Google Map"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                          <div
                            className={styles.darikCheckoutMapPin122}
                            style={{
                              transform: `translate(calc(-50% + ${checkoutMapDragOffset122.x}px), calc(-100% + ${checkoutMapDragOffset122.y}px))`,
                            }}
                            aria-hidden="true"
                          >
                            <span />
                          </div>
                          <div
                            className={styles.darikCheckoutMapCrosshair122}
                            aria-hidden="true"
                          />
                        </div>

                        <p className={styles.darikCheckoutMapHelp122}>
                          Tap the exact spot or drag the pin to correct it.
                          / اضغط على المكان الصحيح أو حرّك العلامة لتعديل الموقع.
                        </p>

                        <div className={styles.darikCheckoutLocationSummary122}>
                          <strong>
                            {checkoutLocationDraft122.label}
                          </strong>
                          <span>
                            {checkoutLocationDraft122.latitude.toFixed(
                              6
                            )}
                            ,{" "}
                            {checkoutLocationDraft122.longitude.toFixed(
                              6
                            )}
                          </span>
                          {checkoutLocationConfirmed122 &&
                          deliveryMatch117 ? (
                            <small>
                              Delivery fee / رسوم التوصيل:{" "}
                              {money(
                                Number(
                                  deliveryMatch117.delivery_fee ?? 0
                                )
                              )}
                              {" · "}
                              Minimum / الحد الأدنى:{" "}
                              {money(
                                Number(
                                  deliveryMatch117.minimum_order ?? 0
                                )
                              )}
                            </small>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          className={
                            checkoutLocationConfirmed122
                              ? styles.darikCheckoutConfirmLocationDone122
                              : styles.darikCheckoutConfirmLocation122
                          }
                          onClick={() =>
                            void confirmCheckoutLocation122()
                          }
                          disabled={checkoutLocationBusy122}
                        >
                          {checkoutLocationBusy122
                            ? "Checking delivery zone… / جاري التحقق…"
                            : checkoutLocationConfirmed122
                              ? "Location confirmed ✓ / تم تأكيد الموقع ✓"
                              : "Confirm delivery location / تأكيد موقع التوصيل"}
                        </button>
                      </div>
                    ) : (
                      <p className={styles.darikCheckoutLocationEmpty122}>
                        Choose current location or search Google Maps to set
                        the delivery pin. / اختر موقعك الحالي أو ابحث في خرائط
                        جوجل لتحديد موقع التوصيل.
                      </p>
                    )}

                    {checkoutLocationError122 ? (
                      <p className={styles.darikCheckoutLocationError122}>
                        {checkoutLocationError122}
                      </p>
                    ) : null}
                  </div>

                          <div className={styles.addressDetailsGrid}>
                            <label>
                              Building number <small>Optional</small>
                              <input
                                value={checkoutForm.buildingNumber}
                                onChange={(event) =>
                                  updateCheckoutField(
                                    "buildingNumber",
                                    event.target.value
                                  )
                                }
                                placeholder="Example: 18"
                              />
                            </label>

                            <label>
                              Apartment number <small>Optional</small>
                              <input
                                value={checkoutForm.apartmentNumber}
                                onChange={(event) =>
                                  updateCheckoutField(
                                    "apartmentNumber",
                                    event.target.value
                                  )
                                }
                                placeholder="Example: 4B"
                              />
                            </label>
                          </div>
                        </>
                      )}

                      <label>
                        {selectedPickup ? "Pickup note" : "Extra delivery details"} <small>Optional</small>
                        <textarea
                          value={checkoutForm.deliveryNote}
                          onChange={(event) =>
                            updateCheckoutField(
                              "deliveryNote",
                              event.target.value
                            )
                          }
                          placeholder={
                            selectedPickup
                              ? "Anything the store should know before pickup"
                              : "Floor, entrance, landmark or delivery instructions"
                          }
                          rows={3}
                        />
                      </label>

                      {checkoutError ? (
                        <p className={styles.checkoutError}>{checkoutError}</p>
                      ) : null}

                      <button
                        type="button"
                        className={styles.checkoutButton}
                        onClick={placeOnlineOrder}
                        disabled={placingOrder}
                      >
                        {placingOrder
                          ? "Sending order…"
                          : checkoutForm.paymentMethod === "cliq"
                            ? `Submit CliQ ${selectedPickup ? "pickup" : "delivery"} order · ${money(orderTotal)}`
                            : `Place cash ${selectedPickup ? "pickup" : "delivery"} order · ${money(orderTotal)}`}
                        {!placingOrder ? <Icon name="arrow" size={18} /> : null}
                      </button>
                    </div>
                  ) : null}

                  {!storefront.is_accepting_orders ||
                  cart.length === 0 ||
                  !minimumReached ? (
                    <button className={styles.checkoutButton} disabled>
                      {!storefront.is_accepting_orders
                        ? "Store is not accepting orders"
                        : cart.length === 0
                          ? "Add products to continue"
                          : "Minimum order not reached"}
                    </button>
                  ) : (
                    <div className={styles.orderMethodButtons}>
                      {onlineOrderingEnabled && !onlineCheckoutOpen ? (
                        <button
                          type="button"
                          className={styles.checkoutButton}
                          onClick={() => {
                            setOnlineCheckoutOpen(true);
                            setCheckoutError("");
                          }}
                        >
                          Place order online
                          <Icon name="arrow" size={18} />
                        </button>
                      ) : null}

                      {phoneOrderingEnabled && phoneOrderHref ? (
                        <a
                          className={`${styles.checkoutButton} ${
                            onlineOrderingEnabled
                              ? styles.secondaryCheckoutButton
                              : ""
                          }`}
                          href={phoneOrderHref}
                          target={
                            phoneOrderHref.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            phoneOrderHref.startsWith("http")
                              ? "noreferrer"
                              : undefined
                          }
                        >
                          {phoneOrderLabel}
                          <Icon
                            name={whatsapp ? "whatsapp" : "call"}
                            size={18}
                          />
                        </a>
                      ) : null}

                      {phoneOrderingEnabled && !phoneOrderHref ? (
                        <button
                          className={`${styles.checkoutButton} ${
                            onlineOrderingEnabled
                              ? styles.secondaryCheckoutButton
                              : ""
                          }`}
                          disabled
                        >
                          Phone ordering unavailable
                        </button>
                      ) : null}
                    </div>
                  )}

                  <p className={styles.checkoutNote}>
                    {onlineOrderingEnabled
                      ? selectedPickup
                        ? "This is a local pickup order. The store will confirm when it is ready to collect."
                        : storefront.cash_on_delivery_enabled && storefront.cliq_enabled
                          ? "This store accepts cash on delivery and CliQ for online orders."
                          : storefront.cliq_enabled
                            ? "This store accepts CliQ for online orders."
                            : "This store accepts cash on delivery for online orders."
                      : pickupOnly
                        ? "The store will confirm product availability and pickup timing."
                        : "The store will confirm product availability, address and final delivery details."}
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      ) : null}
    </main>
  );
}
