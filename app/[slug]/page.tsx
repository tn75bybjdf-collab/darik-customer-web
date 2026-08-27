"use client";

// DARIK_GLOBAL_SIZE_SELECTION_AVAILABILITY_245
// DARIK_FURNITURE_IKEA_COLOR_VARIANTS_216


import DarikCustomerAccountHub339 from "../components/DarikCustomerAccountHub339";
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
  estimated_delivery_days?: number | null;
  delivery_cutoff_time?: string | null;
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
  direct_hero_size?: "default" | "compact" | null;
  section_order: Array<"categories" | "catalog" | "story"> | null;
  show_prices: boolean | null;
  show_ordering: boolean | null;
  show_phone: boolean | null;
  show_whatsapp: boolean | null;
  show_store_story: boolean | null;
  business_name: string;
  business_type: string | null;
};

type HeroSize254 = "default" | "compact";

// DARIK_PUBLIC_HERO_BANNER_ROTATION_274
type ActiveStoreBanner274 = {
  id: string;
  text: string;
  image_url: string;
  hero_size_generated_for: HeroSize254;
  product_id?: string | null;
};

function normalizeHeroSize254(value: unknown): HeroSize254 {
  const candidate =
    value && typeof value === "object" && !Array.isArray(value)
      ? String((value as Record<string, unknown>).size ?? "").trim()
      : String(value ?? "").trim();

  return candidate === "compact" ? "compact" : "default";
}

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

type FurnitureColorSelection216 = {
  id: string;
  name: string;
  nameAr: string;
  photoUrl: string | null;
  isPrimary: boolean;
};

type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photoUrl: string | null;
  colorVariantId: string | null;
  colorName: string | null;
  colorNameAr: string | null;
  sizeKey: string | null;
  sizeLabel: string | null;
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

function useDarikTypographyFontLibrary105V5() {  /* DARIK_291B_OLD_SEARCH_EFFECT_REMOVED */

// DARIK_SMOOTH_SEARCH_LOCK_292
  useEffect(() => {
    let frame292 = 0;
    let retry292 = 0;
    let mounted292 = true;

    let shell292: HTMLElement | null = null;
    let input292: HTMLInputElement | null = null;
    let sentinel292: HTMLDivElement | null = null;
    let placeholder292: HTMLDivElement | null = null;

    let originalShellStyle292 = "";
    let originalInputStyle292 = "";

    let locked292 = false;
    let lockedTop292 = 0;
    let lastBannerVisible292 = false;

    const getBannerPosition292 = () => {
      const selectors292 = [
        '[data-darik-sticky-banner="287"]',
        '[data-darik-sticky-banner="286"]',
        '[data-darik-sticky-banner="283"]'
      ];

      let bottom292 = 0;
      let visible292 = false;

      for (const selector292 of selectors292) {
        const banner292 =
          document.querySelector<HTMLElement>(selector292);

        if (!banner292) continue;

        const rect292 = banner292.getBoundingClientRect();
        const style292 = window.getComputedStyle(banner292);

        const isVisible292 =
          banner292.getAttribute("aria-hidden") !== "true" &&
          style292.display !== "none" &&
          style292.visibility !== "hidden" &&
          Number(style292.opacity || "1") > 0.05 &&
          rect292.height > 1 &&
          rect292.bottom > 0;

        if (isVisible292) {
          visible292 = true;
          bottom292 = Math.max(
            bottom292,
            Math.round(rect292.bottom)
          );
        }
      }

      return {
        visible: visible292,
        bottom: Math.max(0, bottom292),
      };
    };

    const findSearch292 = () => {
      const inputs292 = Array.from(
        document.querySelectorAll<HTMLInputElement>("input")
      );

      input292 =
        inputs292.find((item292) => item292.type === "search") ||
        inputs292.find((item292) =>
          /search/i.test(
            (item292.placeholder || "") +
              " " +
              (item292.getAttribute("aria-label") || "")
          )
        ) ||
        null;

      if (!input292) return false;

      const inputRect292 = input292.getBoundingClientRect();

      const rawCandidates292 = [
        input292.closest<HTMLElement>(
          '[class*="search"], [class*="Search"]'
        ),
        input292.closest<HTMLElement>("form"),
        input292.parentElement,
        input292.parentElement?.parentElement || null,
      ].filter(Boolean) as HTMLElement[];

      const candidates292 =
        Array.from(new Set(rawCandidates292))
          .filter((node292) => {
            const rect292 = node292.getBoundingClientRect();

            return (
              rect292.height >= inputRect292.height &&
              rect292.height <=
                Math.max(190, inputRect292.height + 110) &&
              rect292.width >= inputRect292.width * 0.72
            );
          })
          .sort((a292, b292) => {
            const ar292 = a292.getBoundingClientRect();
            const br292 = b292.getBoundingClientRect();

            return (
              ar292.width * ar292.height -
              br292.width * br292.height
            );
          });

      shell292 =
        candidates292[0] ||
        input292.parentElement ||
        input292;

      if (!shell292 || !shell292.parentNode) {
        shell292 = null;
        input292 = null;
        return false;
      }

      originalShellStyle292 =
        shell292.getAttribute("style") || "";

      originalInputStyle292 =
        input292.getAttribute("style") || "";

      shell292.setAttribute(
        "data-darik-search-shell",
        "292"
      );

      input292.setAttribute(
        "data-darik-search-input",
        "292"
      );

      sentinel292 = document.createElement("div");
      sentinel292.setAttribute(
        "data-darik-search-sentinel",
        "292"
      );
      sentinel292.setAttribute("aria-hidden", "true");
      sentinel292.style.cssText =
        "display:block;width:100%;height:0;margin:0;padding:0;border:0;pointer-events:none;";

      placeholder292 = document.createElement("div");
      placeholder292.setAttribute(
        "data-darik-search-placeholder",
        "292"
      );
      placeholder292.setAttribute("aria-hidden", "true");
      placeholder292.style.cssText =
        "display:none;width:100%;height:0;margin:0;padding:0;border:0;pointer-events:none;";

      shell292.parentNode.insertBefore(
        sentinel292,
        shell292
      );

      shell292.parentNode.insertBefore(
        placeholder292,
        shell292
      );

      return true;
    };

    const unlock292 = () => {
      if (!shell292 || !input292) return;

      locked292 = false;

      shell292.removeAttribute(
        "data-darik-search-locked"
      );

      shell292.style.cssText =
        originalShellStyle292;

      input292.style.cssText =
        originalInputStyle292;

      if (placeholder292) {
        placeholder292.style.display = "none";
        placeholder292.style.height = "0px";
      }
    };

    const lock292 = (
      desiredTop292: number,
      bannerVisible292: boolean
    ) => {
      if (
        !shell292 ||
        !placeholder292
      ) {
        return;
      }

      const measuredHeight292 =
        shell292.getBoundingClientRect().height;

      const existingHeight292 =
        placeholder292.style.display !== "none"
          ? placeholder292.getBoundingClientRect().height
          : 0;

      const height292 =
        existingHeight292 ||
        measuredHeight292;

      placeholder292.style.display = "block";
      placeholder292.style.height =
        String(Math.max(1, Math.ceil(height292))) + "px";

      locked292 = true;
      lockedTop292 = Math.round(desiredTop292);
      lastBannerVisible292 = bannerVisible292;

      shell292.setAttribute(
        "data-darik-search-locked",
        "292"
      );

      shell292.style.setProperty(
        "--darik-search-top-292",
        String(lockedTop292) + "px"
      );
    };

    const update292 = () => {
      if (
        !mounted292 ||
        !shell292 ||
        !input292 ||
        !sentinel292 ||
        !placeholder292
      ) {
        return;
      }

      if (frame292) {
        window.cancelAnimationFrame(frame292);
      }

      frame292 = window.requestAnimationFrame(() => {
        if (
          !shell292 ||
          !sentinel292 ||
          !placeholder292
        ) {
          return;
        }

        const banner292 =
          getBannerPosition292();

        const sentinelTop292 =
          sentinel292.getBoundingClientRect().top;

        // Hysteresis:
        // Lock slightly BEFORE the threshold.
        // Unlock only after moving meaningfully back ABOVE it.
        // This removes tiny iOS viewport/bounce fluctuations.
        const lockThreshold292 =
          banner292.bottom + 2;

        const unlockThreshold292 =
          banner292.bottom + 18;

        if (!locked292) {
          if (sentinelTop292 <= lockThreshold292) {
            lock292(
              banner292.bottom,
              banner292.visible
            );
          }
          return;
        }

        if (sentinelTop292 > unlockThreshold292) {
          unlock292();
          return;
        }

        // While locked, DO NOT chase tiny pixel changes on every scroll.
        // Only refresh the top if banner visibility itself changed, or if
        // the measured banner bottom changed materially.
        const topDelta292 =
          Math.abs(
            Math.round(banner292.bottom) -
            lockedTop292
          );

        const bannerStateChanged292 =
          banner292.visible !== lastBannerVisible292;

        if (
          bannerStateChanged292 ||
          topDelta292 >= 12
        ) {
          lock292(
            banner292.bottom,
            banner292.visible
          );
        }
      });
    };

    const setup292 = (attempt292 = 0) => {
      if (!mounted292) return;

      if (findSearch292()) {
        update292();
        return;
      }

      if (attempt292 >= 40) return;

      retry292 = window.setTimeout(
        () => setup292(attempt292 + 1),
        100
      );
    };

    setup292();

    window.addEventListener("scroll", update292, {
      passive: true
    });

    window.addEventListener("resize", () => {
      if (locked292) {
        const banner292 =
          getBannerPosition292();

        lock292(
          banner292.bottom,
          banner292.visible
        );
      }

      update292();
    });

    return () => {
      mounted292 = false;

      if (frame292) {
        window.cancelAnimationFrame(frame292);
      }

      if (retry292) {
        window.clearTimeout(retry292);
      }

      window.removeEventListener("scroll", update292);

      if (shell292) {
        shell292.style.cssText =
          originalShellStyle292;

        shell292.removeAttribute(
          "data-darik-search-shell"
        );

        shell292.removeAttribute(
          "data-darik-search-locked"
        );
      }

      if (input292) {
        input292.style.cssText =
          originalInputStyle292;

        input292.removeAttribute(
          "data-darik-search-input"
        );
      }

      sentinel292?.remove();
      placeholder292?.remove();
    };
  }, []);



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
// DARIK_PUBLIC_EDITOR_LAYOUT_PARITY_BRIDGE_166
// Public storefront PASSIVE renderer for the saved dashboard editor layout.
// No drag/edit handlers are installed on the customer storefront.

type DarikPublicLayoutPoint166 = {
  x: number;
  y: number;
  scale?: number;
  hidden?: boolean;
  label?: string;
};

type DarikPublicLayoutDevice166 = Record<
  string,
  DarikPublicLayoutPoint166
>;

type DarikPublicLayout166 = {
  desktop: DarikPublicLayoutDevice166;
  mobile: DarikPublicLayoutDevice166;
};

function darikClampLayoutOffset166(value: unknown) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) return 0;

  return Math.max(
    -1200,
    Math.min(1200, Math.round(numeric))
  );
}

function darikClampLayoutScale166(value: unknown) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) return 1;

  return (
    Math.round(
      Math.max(0.5, Math.min(2, numeric)) * 1000
    ) / 1000
  );
}

function darikDefaultPublicLayout166(): DarikPublicLayout166 {
  return {
    desktop: {},
    mobile: {},
  };
}

function darikSafeLayoutLocator166(value: unknown) {
  const locator = String(value ?? "").trim();

  return (
    locator.length >= 1 &&
    locator.length <= 700 &&
    /^[A-Za-z0-9_#:.() >-]+$/.test(locator)
  );
}

function darikNormalizePublicLayout166(
  value: unknown
): DarikPublicLayout166 {
  const raw =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const result = darikDefaultPublicLayout166();

  for (const device of ["desktop", "mobile"] as const) {
    const rawDevice =
      raw[device] &&
      typeof raw[device] === "object" &&
      !Array.isArray(raw[device])
        ? (raw[device] as Record<string, unknown>)
        : {};

    let accepted = 0;

    for (const [locator, rawPoint] of Object.entries(
      rawDevice
    )) {
      if (accepted >= 250) break;
      if (!darikSafeLayoutLocator166(locator)) continue;

      if (
        !rawPoint ||
        typeof rawPoint !== "object" ||
        Array.isArray(rawPoint)
      ) {
        continue;
      }

      const point = rawPoint as Record<string, unknown>;

      const hasScale =
        Object.prototype.hasOwnProperty.call(
          point,
          "scale"
        );

      const hidden =
        typeof point.hidden === "boolean"
          ? point.hidden
          : undefined;

      const label =
        typeof point.label === "string"
          ? point.label.trim().slice(0, 140)
          : undefined;

      result[device][locator] = {
        x: darikClampLayoutOffset166(point.x),
        y: darikClampLayoutOffset166(point.y),
        ...(hasScale
          ? {
              scale:
                darikClampLayoutScale166(point.scale),
            }
          : {}),
        ...(hidden !== undefined
          ? { hidden }
          : {}),
        ...(label ? { label } : {}),
      };

      accepted += 1;
    }
  }

  return result;
}

function darikHashSemantic166(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function darikMovableSignature166(target: Element) {
  const tag = target.tagName.toLowerCase();

  const structural = new Set([
    "html",
    "body",
    "main",
    "header",
    "footer",
    "nav",
    "section",
    "article",
    "form",
    "ul",
    "ol",
    "script",
    "style",
  ]);

  if (structural.has(tag)) return "";

  if (
    tag === "div" &&
    target.querySelector(
      "h1, h2, h3, h4, p, img, picture, video, button, a, nav, section, article, header, footer"
    )
  ) {
    return "";
  }

  const text = (target.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const identity = [
    tag,
    text,
    target.getAttribute("alt") ?? "",
    target.getAttribute("href") ?? "",
    target.getAttribute("src") ?? "",
    target.getAttribute("title") ?? "",
  ]
    .join("|")
    .toLowerCase();

  if (identity.replace(/[|\s]/g, "").length < 3) {
    return "";
  }

  return identity;
}

function darikAssignPublicSemanticClasses166(
  root: Element
) {
  const positioned = Array.from(
    root.querySelectorAll(
      '[class*="builderPositionTarget145"]'
    )
  );

  for (const target of positioned) {
    const tag = target.tagName.toLowerCase();

    const lowerClass = (
      target.getAttribute("class") ?? ""
    ).toLowerCase();

    if (tag === "h1") {
      target.classList.add(
        "darikSemanticDisplayName150E"
      );
      continue;
    }

    if (tag === "button") {
      target.classList.add(
        "darikSemanticShop150E"
      );
      continue;
    }

    if (lowerClass.includes("arabicname")) {
      target.classList.add(
        "darikSemanticDisplayNameAr150E"
      );
      continue;
    }

    if (lowerClass.includes("arabictagline")) {
      target.classList.add(
        "darikSemanticTaglineAr150E"
      );
      continue;
    }

    if (lowerClass.includes("tagline")) {
      target.classList.add(
        "darikSemanticTagline150E"
      );
    }
  }

  const logoVisuals = Array.from(
    root.querySelectorAll("img, picture, svg")
  );

  for (const visual of logoVisuals) {
    const identity = [
      visual.getAttribute("id") ?? "",
      visual.getAttribute("class") ?? "",
      visual.getAttribute("alt") ?? "",
      visual.getAttribute("aria-label") ?? "",
    ]
      .join(" ")
      .toLowerCase();

    if (
      !identity.includes("logo") &&
      !identity.includes("brand")
    ) {
      continue;
    }

    let box: Element | null = visual.parentElement;
    let depth = 0;

    while (
      box &&
      box !== root &&
      depth < 4
    ) {
      const tag = box.tagName.toLowerCase();

      const structural = [
        "main",
        "header",
        "footer",
        "nav",
        "section",
        "article",
      ].includes(tag);

      const rect = box.getBoundingClientRect();

      if (
        !structural &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.width <= 420 &&
        rect.height <= 280
      ) {
        box.classList.add(
          "darikSemanticLogoBox150E"
        );
        break;
      }

      box = box.parentElement;
      depth += 1;
    }
  }

  const eligible = Array.from(
    root.querySelectorAll(
      "button, a, img, picture, video, h1, h2, h3, h4, h5, h6, p, label, span, div"
    )
  );

  const signatureMap =
    new Map<string, Element[]>();

  for (const target of eligible) {
    const signature =
      darikMovableSignature166(target);

    if (!signature) continue;

    const matches =
      signatureMap.get(signature) ?? [];

    matches.push(target);
    signatureMap.set(signature, matches);
  }

  for (const [
    signature,
    matches,
  ] of signatureMap.entries()) {
    if (matches.length !== 1) continue;

    matches[0].classList.add(
      "darikPersist150E" +
        darikHashSemantic166(signature)
    );
  }
}

type StorefrontPositionKey145 =
  | "display_name"
  | "display_name_ar"
  | "tagline"
  | "tagline_ar"
  | "shop"
  | "hero_logo"
  | "hero_label"
  | "primary_button";

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
  "hero_logo",
  "hero_label",
  "primary_button",
];

function clampStorefrontPosition145(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(-1200, Math.min(1200, Math.round(numeric)));
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
    hero_logo: {
      desktop: { x: 0, y: 0 },
      mobile: { x: 0, y: 0 },
    },
    hero_label: {
      desktop: { x: 0, y: 0 },
      mobile: { x: 0, y: 0 },
    },
    primary_button: {
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

// DARIK_SPECIAL_FREE_DELIVERY_ZONE_185
type DarikSpecialDeliveryZone185 = {
  enabled: boolean;
  maxKm: number;
  minimumQualifyingJod: number;
  excludedCategoryIds: string[];
};

function normalizeDarikSpecialDeliveryZone185(
  value: unknown
): DarikSpecialDeliveryZone185 {
  const row =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    enabled: row.enabled === true,
    maxKm: Math.max(0, Number(row.max_km ?? 0) || 0),
    minimumQualifyingJod: Math.max(
      0,
      Number(row.minimum_qualifying_jod ?? 0) || 0
    ),
    excludedCategoryIds: Array.isArray(row.excluded_category_ids)
      ? row.excluded_category_ids
          .map((item) => String(item ?? "").trim())
          .filter(Boolean)
      : [],
  };
}

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

// DARIK_APPROVED_ONLY_ACTUAL_LIVE_STORE_EDITOR_196
// Approved retailer editor mode is the ACTUAL public storefront route.
// builderPreview enables editor interaction; darikLiveEditor196 prevents the
// data layer from falling back to the old private/draft preview behavior.
function darikIsActualLiveEditor196() {
  if (typeof window === "undefined") return false;

  return (
    new URLSearchParams(window.location.search).get(
      "darikLiveEditor196"
    ) === "1"
  );
}

// DARIK_DELIVERY_STAGES_DAYS_CUTOFF_163
function darikJordanClockMinutes163(nowMs: number) {
  const parts163 = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Amman",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(nowMs || Date.now()));

  const hour163 = Number(
    parts163.find((part163) => part163.type === "hour")?.value ?? 0
  );
  const minute163 = Number(
    parts163.find((part163) => part163.type === "minute")?.value ?? 0
  );

  return hour163 * 60 + minute163;
}

function darikDeliveryPromise163(
  rawDays163: unknown,
  rawCutoff163: unknown,
  nowMs163: number
) {
  // DARIK_DELIVERY_TRUTH_SPECIAL_ZONE_COUNTDOWN_191
  const hasExplicitDays191 =
    rawDays163 !== null &&
    rawDays163 !== undefined &&
    String(rawDays163).trim() !== "";

  if (!hasExplicitDays191) {
    return {
      baseDays: null,
      effectiveDays: null,
      afterCutoff: false,
      customerLabel: "Checking delivery time…",
      shortLabel: "…",
    };
  }

  const numericDays163 = Number(rawDays163);
  const baseDays163 =
    Number.isInteger(numericDays163) && numericDays163 >= 0
      ? Math.min(365, numericDays163)
      : 0;

  const cutoffMatch163 = String(rawCutoff163 ?? "23:59").match(
    /^(\d{1,2}):(\d{2})/
  );
  const cutoffHour163 = Math.min(
    23,
    Math.max(0, Number(cutoffMatch163?.[1] ?? 17))
  );
  const cutoffMinute163 = Math.min(
    59,
    Math.max(0, Number(cutoffMatch163?.[2] ?? 0))
  );
  const cutoffTotal163 = cutoffHour163 * 60 + cutoffMinute163;
  const afterCutoff163 =
    darikJordanClockMinutes163(nowMs163) >= cutoffTotal163;
  const effectiveDays163 =
    baseDays163 + (afterCutoff163 ? 1 : 0);

  return {
    baseDays: baseDays163,
    effectiveDays: effectiveDays163,
    afterCutoff: afterCutoff163,
    customerLabel:
      effectiveDays163 === 0
        ? "Today"
        : effectiveDays163 === 1
          ? "Tomorrow"
          : "In " + effectiveDays163 + " days",
    shortLabel:
      effectiveDays163 === 0
        ? "Today"
        : effectiveDays163 === 1
          ? "Tomorrow"
          : String(effectiveDays163) + "d",
  };
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
  // DARIK_COMPARE_AT_PRICE_PUBLIC_171
  // Compare-at prices are intentionally fetched through a tiny public companion
  // RPC so the mature public_storefront_products view never has to be rebuilt.
  const [darikCompareAtByProduct171, setDarikCompareAtByProduct171] =
    useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled171 = false;

    if (!slug || slug === "_darik-private-store-preview") {
      setDarikCompareAtByProduct171({});
      return () => {
        cancelled171 = true;
      };
    }

    void (async () => {
      const result171 = await supabase.rpc(
        "darik_direct_public_compare_at_prices_v1",
        { p_slug: slug }
      );

      if (cancelled171) return;

      // SQL 171 may be installed after this frontend deploy. Until then,
      // storefront browsing continues normally without compare-at prices.
      if (result171.error) {
        setDarikCompareAtByProduct171({});
        return;
      }

      const next171: Record<string, number> = {};

      for (const raw171 of Array.isArray(result171.data)
        ? result171.data
        : []) {
        const row171 = raw171 as {
          product_id?: unknown;
          direct_compare_at_price?: unknown;
        };

        const productId171 = String(
          row171.product_id ?? ""
        ).trim();
        const compareAt171 = Number(
          row171.direct_compare_at_price
        );

        if (
          productId171 &&
          Number.isFinite(compareAt171) &&
          compareAt171 > 0
        ) {
          next171[productId171] = compareAt171;
        }
      }

      setDarikCompareAtByProduct171(next171);
    })();

    return () => {
      cancelled171 = true;
    };
  }, [slug]);

  const [previewRetailField, setPreviewRetailField] = useState("");
  useEffect(() => {
    const field = new URLSearchParams(window.location.search)
      .get("previewField")
      ?.trim();
    setPreviewRetailField(field || "");
  }, []);

  // DARIK_STOREFRONT_VISUAL_TRUTH_194
  type DarikStorefrontVisualTruth194 = {
    freeform_layout?: unknown;
    typography?: unknown;
    content_positioning?: unknown;
    updated_at?: unknown;
  };

  const [darikStorefrontVisualTruth194, setDarikStorefrontVisualTruth194] =
    useState<DarikStorefrontVisualTruth194 | null>(null);

  // DARIK_REAL_HERO_SIZE_COLUMN_260
  // DARIK_REAL_COMPACT_BANNER_HERO_261
  const [heroSize260, setHeroSize260] =
    useState<HeroSize254>("default");

  // DARIK_PUBLIC_HERO_BANNER_ROTATION_274
  const [activeStoreBanner274, setActiveStoreBanner274] =
    useState<ActiveStoreBanner274 | null>(null);
  // DARIK_STICKY_SCROLL_BANNER_283
  const [showStickyBanner283, setShowStickyBanner283] = useState(false);
  const [stickyBannerTop283, setStickyBannerTop283] = useState(0);

  useEffect(() => {
    if (!activeStoreBanner274?.image_url) {
      setShowStickyBanner283(false);
      return;
    }

    let frame283 = 0;

    const updateStickyBanner283 = () => {
      if (frame283) window.cancelAnimationFrame(frame283);

      frame283 = window.requestAnimationFrame(() => {
        const pageRoot283 = document.querySelector('[data-hero-size]');
        const mode283 =
          pageRoot283?.getAttribute("data-hero-size") === "compact"
            ? "compact"
            : "default";

        const header283 = document.querySelector("header");
        const headerRect283 = header283?.getBoundingClientRect();
        const headerBottom283 =
          headerRect283 && headerRect283.bottom > 0 && headerRect283.top <= 8
            ? Math.max(0, Math.round(headerRect283.bottom))
            : 0;

        setStickyBannerTop283(headerBottom283);

        const heroCandidates283 = Array.from(
          document.querySelectorAll<HTMLElement>('[class*="hero"], [class*="Hero"]')
        )
          .filter((element283) => {
            if (element283.closest('[data-darik-sticky-banner="283"]')) return false;
            const rect283 = element283.getBoundingClientRect();
            return (
              rect283.height >= 140 &&
              rect283.width >= Math.min(280, window.innerWidth * 0.7) &&
              rect283.top < Math.max(420, window.innerHeight * 0.55)
            );
          })
          .sort((a283, b283) => {
            const aRect283 = a283.getBoundingClientRect();
            const bRect283 = b283.getBoundingClientRect();
            const aScore283 = Math.abs(aRect283.top) - aRect283.height * 0.05;
            const bScore283 = Math.abs(bRect283.top) - bRect283.height * 0.05;
            return aScore283 - bScore283;
          });

        const hero283 = heroCandidates283[0];
        let shouldShow283 = false;

        if (hero283) {
          shouldShow283 =
            hero283.getBoundingClientRect().bottom <= headerBottom283 + 6;
        } else {
          // Safe fallback if a future CSS-module rename removes "hero" from
          // generated class names.
          const estimatedHeroHeight283 =
            mode283 === "compact"
              ? window.innerWidth * 0.5625
              : window.innerWidth;
          shouldShow283 =
            window.scrollY >
            Math.max(180, estimatedHeroHeight283 + headerBottom283 - 24);
        }

        setShowStickyBanner283(shouldShow283);
      });
    };

    updateStickyBanner283();
    window.addEventListener("scroll", updateStickyBanner283, { passive: true });
    window.addEventListener("resize", updateStickyBanner283);

    return () => {
      if (frame283) window.cancelAnimationFrame(frame283);
      window.removeEventListener("scroll", updateStickyBanner283);
      window.removeEventListener("resize", updateStickyBanner283);
    };
  }, [activeStoreBanner274?.image_url]);
  const [showStoreBanner274, setShowStoreBanner274] = useState(false);

  // DARIK_THREE_BANNER_ROTATION_286
  const [activeStoreBanners286, setActiveStoreBanners286] =
    useState<ActiveStoreBanner274[]>([]);
  const [activeStoreBannerIndex286, setActiveStoreBannerIndex286] =
    useState(0);
  useEffect(() => {
    if (!slug || slug === "_darik-private-store-preview") {
      setActiveStoreBanners286([]);
      setActiveStoreBannerIndex286(0);
      setActiveStoreBanner274(null);
      setShowStoreBanner274(false);
      return;
    }

    let cancelled286 = false;

    void (async () => {
      try {
        const response286 = await fetch(
          `/api/darik-direct/store-banner?slug=${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        const payload286 = (await response286.json().catch(() => ({}))) as {
          ok?: boolean;
          active_banner?: ActiveStoreBanner274 | null;
          active_banners?: ActiveStoreBanner274[];
        };

        if (cancelled286) return;

        const list286 =
          response286.ok && payload286.ok
            ? Array.isArray(payload286.active_banners)
              ? payload286.active_banners
                  .filter((banner286) => Boolean(banner286?.image_url))
                  .slice(0, 3)
              : payload286.active_banner?.image_url
                ? [payload286.active_banner]
                : []
            : [];

        setActiveStoreBanners286(list286);
        setActiveStoreBannerIndex286(0);
        setActiveStoreBanner274(list286[0] || null);
        // Hero NEVER participates in the rotation.
        setShowStoreBanner274(false);
      } catch {
        if (!cancelled286) {
          setActiveStoreBanners286([]);
          setActiveStoreBannerIndex286(0);
          setActiveStoreBanner274(null);
          setShowStoreBanner274(false);
        }
      }
    })();

    return () => {
      cancelled286 = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!activeStoreBanners286.length) {
      setActiveStoreBanner274(null);
      setActiveStoreBannerIndex286(0);
      return;
    }

    const safeIndex286 =
      activeStoreBannerIndex286 % activeStoreBanners286.length;

    setActiveStoreBanner274(
      activeStoreBanners286[safeIndex286] || activeStoreBanners286[0] || null
    );
  }, [activeStoreBanners286, activeStoreBannerIndex286]);

  useEffect(() => {
    if (activeStoreBanners286.length <= 1) return;

    const timer286 = window.setInterval(() => {
      setActiveStoreBannerIndex286(
        (current286) => (current286 + 1) % activeStoreBanners286.length
      );
    }, 6000);

    return () => window.clearInterval(timer286);
  }, [activeStoreBanners286.length]);

  /* DARIK_283_ROTATION_REMOVED: Hero never auto-swaps with Banner. */


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
    if (
      !slug ||
      slug === "_darik-private-store-preview" ||
      (isBuilderPositionPreview145 &&
        !darikIsActualLiveEditor196())
    ) {
      setDarikStorefrontVisualTruth194(null);
      return;
    }

    let cancelled194 = false;
    setDarikStorefrontVisualTruth194(null);

    void (async () => {
      const result194 = await supabase.rpc(
        "darik_direct_public_storefront_visual_v194",
        { p_slug: slug }
      );

      if (cancelled194) return;

      if (result194.error) {
        console.warn(
          "Darik live visual truth could not load:",
          result194.error.message
        );
        return;
      }

      const raw194 =
        result194.data &&
        typeof result194.data === "object" &&
        !Array.isArray(result194.data)
          ? (result194.data as DarikStorefrontVisualTruth194)
          : null;

      setDarikStorefrontVisualTruth194(raw194);
    })();

    return () => {
      cancelled194 = true;
    };
  }, [slug, isBuilderPositionPreview145]);

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

  useEffect(() => {
    if (!slug) {
      setHeroSize260("default");
      return;
    }

    let cancelled261 = false;

    void (async () => {
      if (slug === "_darik-private-store-preview") {
        const embedded261 = storefront?.direct_hero_size;

        if (embedded261 === "compact" || embedded261 === "default") {
          setHeroSize260(embedded261);
          return;
        }

        if (!storefront?.id) {
          setHeroSize260("default");
          return;
        }

        const privateResult261 = await supabase
          .from("retailer_storefronts")
          .select("direct_hero_size")
          .eq("id", storefront.id)
          .maybeSingle();

        if (cancelled261) return;

        if (privateResult261.error) {
          console.warn(
            "Darik private-preview Hero Size could not load:",
            privateResult261.error.message
          );
          setHeroSize260("default");
          return;
        }

        setHeroSize260(
          privateResult261.data?.direct_hero_size === "compact"
            ? "compact"
            : "default"
        );
        return;
      }

      const result261 = await supabase.rpc(
        "darik_direct_public_hero_size_v260",
        { p_slug: slug }
      );

      if (cancelled261) return;

      if (result261.error) {
        console.warn(
          "Darik Hero Size could not load:",
          result261.error.message
        );
        setHeroSize260("default");
        return;
      }

      setHeroSize260(
        result261.data === "compact" ? "compact" : "default"
      );
    })();

    return () => {
      cancelled261 = true;
    };
  }, [slug, storefront?.id, storefront?.direct_hero_size]);

  const [publicStatus, setPublicStatus] = useState<PublicStoreStatus | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("BestSellers");

  // DARIK_HOME_STORE_SHELVES_TRUE_BESTSELLERS_186
  const [bestSellerUnits186, setBestSellerUnits186] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!slug) {
      setBestSellerUnits186({});
      return;
    }

    let cancelled186 = false;

    void (async () => {
      const result186 = await supabase.rpc(
        "darik_direct_public_bestseller_sales_v186",
        { p_slug: slug }
      );

      if (cancelled186) return;

      if (result186.error) {
        console.warn(
          "Darik true Best Sellers ranking unavailable:",
          result186.error.message
        );
        setBestSellerUnits186({});
        return;
      }

      const next186: Record<string, number> = {};
      const rows186 = Array.isArray(result186.data) ? result186.data : [];

      for (const raw186 of rows186) {
        if (!raw186 || typeof raw186 !== "object") continue;
        const row186 = raw186 as Record<string, unknown>;
        const productId186 = String(row186.product_id ?? "").trim();
        const units186 = Number(row186.units_sold ?? 0);
        if (productId186 && Number.isFinite(units186) && units186 > 0) {
          next186[productId186] = units186;
        }
      }

      setBestSellerUnits186(next186);
    })();

    return () => {
      cancelled186 = true;
    };
  }, [slug]);
  const [search, setSearch] = useState("");
  const [selectedVehicleMake, setSelectedVehicleMake] = useState("all");
  const [selectedVehicleModel, setSelectedVehicleModel] = useState("all");
  const [selectedVehicleYear, setSelectedVehicleYear] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [activeProductId, setActiveProductId] = useState("");

  // DARIK_PRODUCT_PARENT_SCROLL_RETURN_183
  // Parent-level browse position is authoritative because some product entry
  // points used to navigate the page before ProductDetailExperience mounted.
  const productReturnPosition183Ref = useRef<{
    x: number;
    y: number;
  } | null>(null);
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
  // DARIK_STORE_OPENING_CENTER_LOGO_188
  const [openingStoreLogo188, setOpeningStoreLogo188] = useState("");

  useEffect(() => {
    setOpeningStoreLogo188("");
    if (!slug) return;

    try {
      const cached188 = window.sessionStorage.getItem(`darik:opening-store-logo:188:${slug.toLowerCase()}`);
      const normalized188 = String(cached188 ?? "").trim();
      if (/^https?:\/\//i.test(normalized188)) {
        setOpeningStoreLogo188(normalized188);
      }
    } catch {
      // Loading screen falls back to Darik branding if storage is unavailable.
    }
  }, [slug]);


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
      if (saved) {
        const parsed216 = JSON.parse(saved) as Array<Partial<CartLine> & { productId?: string }>;
        if (Array.isArray(parsed216)) {
          setCart(
            parsed216
              .filter((line) => Boolean(line?.productId))
              .map((line) => {
                const productId216 = String(line.productId || "");
                const colorVariantId216 =
                  typeof line.colorVariantId === "string" && line.colorVariantId
                    ? line.colorVariantId
                    : null;
                return {
                  lineId:
                    typeof line.lineId === "string" && line.lineId
                      ? line.lineId
                      : cartLineId216(
                          productId216,
                          colorVariantId216,
                          typeof line.sizeKey === "string" ? line.sizeKey : null
                        ),
                  productId: productId216,
                  name: String(line.name || "Product"),
                  price: Number(line.price || 0),
                  quantity: Math.max(1, Number(line.quantity || 1)),
                  photoUrl: typeof line.photoUrl === "string" ? line.photoUrl : null,
                  colorVariantId: colorVariantId216,
                  colorName: typeof line.colorName === "string" ? line.colorName : null,
                  colorNameAr: typeof line.colorNameAr === "string" ? line.colorNameAr : null,
                  sizeKey: typeof line.sizeKey === "string" ? line.sizeKey : null,
                  sizeLabel: typeof line.sizeLabel === "string" ? line.sizeLabel : null,
                };
              })
          );
        }
      }
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

        const { data: privateSessionData143 } = await supabase.auth.getSession();
        const privateAccessToken143 =
          privateSessionData143.session?.access_token ?? "";

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
        // DARIK_PUBLIC_CARD_SIZE_OPTIONS_294
        const baseProducts294 =
          (productResult.data ?? []) as unknown as Product[];

        const sizeResult294 = await supabase.rpc(
          "darik_direct_public_product_required_options_v1",
          { p_slug: slug }
        );

        if (cancelled) return;

        if (sizeResult294.error) {
          console.warn(
            "Darik public product size options 294 could not load:",
            sizeResult294.error.message
          );

          setProducts(baseProducts294);
        } else {
          const rows294 =
            (sizeResult294.data ?? []) as Array<{
              product_id?: string | null;
              direct_size_options?: unknown;
              direct_shoe_sizes?: unknown;
            }>;

          const optionsByProduct294 = new Map(
            rows294
              .filter((row294) =>
                Boolean(String(row294.product_id || "").trim())
              )
              .map((row294) => [
                String(row294.product_id),
                {
                  direct_size_options: Array.isArray(
                    row294.direct_size_options
                  )
                    ? row294.direct_size_options
                    : null,
                  direct_shoe_sizes: Array.isArray(
                    row294.direct_shoe_sizes
                  )
                    ? row294.direct_shoe_sizes
                    : null,
                },
              ])
          );

          setProducts(
            baseProducts294.map((product294) => {
              const options294 =
                optionsByProduct294.get(String(product294.id));

              return options294
                ? {
                    ...product294,
                    ...options294,
                  }
                : product294;
            })
          );
        }
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
      "estimated_delivery_days",
      "delivery_cutoff_time",
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

    const originalOrder186 = new Map(
      filteredProducts.map((product, index) => [product.id, index] as const)
    );

    return visibleCategories
      .map((category) => ({
        category,
        products: filteredProducts
          .filter(
            (product) => product.direct_store_category_id === category.id
          )
          .sort((a, b) => {
            const salesDifference186 =
              (bestSellerUnits186[b.id] ?? 0) -
              (bestSellerUnits186[a.id] ?? 0);
            if (salesDifference186 !== 0) return salesDifference186;

            return (
              (originalOrder186.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
              (originalOrder186.get(b.id) ?? Number.MAX_SAFE_INTEGER)
            );
          }),
      }))
      .filter((group) => group.products.length > 0);
  }, [
    bestSellerUnits186,
    filteredProducts,
    selectedCategoryId,
    visibleCategories,
  ]);

  // DARIK_BEST_SELLER_CONTINUATION_AFFORDANCE_182
  const [bestSellerShelfState182, setBestSellerShelfState182] = useState<
    Record<string, { canGoBack: boolean; canGoForward: boolean }>
  >({});

  function updateBestSellerShelfState182(
    categoryId: string,
    element: HTMLDivElement
  ) {
    const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
    const currentScroll = Math.max(0, element.scrollLeft);
    const nextState = {
      canGoBack: currentScroll > 4,
      canGoForward: maxScroll - currentScroll > 4,
    };

    setBestSellerShelfState182((current) => {
      const previous = current[categoryId];

      if (
        previous?.canGoBack === nextState.canGoBack &&
        previous?.canGoForward === nextState.canGoForward
      ) {
        return current;
      }

      return {
        ...current,
        [categoryId]: nextState,
      };
    });
  }

  function scrollBestSellerShelf182(categoryId: string) {
    const carousel = Array.from(
      document.querySelectorAll<HTMLDivElement>(
        "[data-darik-best-seller-carousel-182]"
      )
    ).find(
      (element) =>
        element.dataset.darikBestSellerCarousel182 === categoryId
    );

    if (!carousel) return;

    const firstItem = carousel.querySelector<HTMLElement>(
      "[data-darik-best-seller-item-182]"
    );
    const itemWidth = firstItem?.getBoundingClientRect().width ?? 154;
    const computed = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || "0") || 0;
    const step = Math.max(itemWidth + gap, carousel.clientWidth * 0.72);

    carousel.scrollBy({
      left: step,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (selectedCategoryId !== "BestSellers") return;

    const carousels = Array.from(
      document.querySelectorAll<HTMLDivElement>(
        "[data-darik-best-seller-carousel-182]"
      )
    );

    if (carousels.length === 0) return;

    const syncAll = () => {
      for (const carousel of carousels) {
        const categoryId = carousel.dataset.darikBestSellerCarousel182;
        if (!categoryId) continue;
        updateBestSellerShelfState182(categoryId, carousel);
      }
    };

    const frame = window.requestAnimationFrame(syncAll);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncAll)
        : null;

    for (const carousel of carousels) {
      observer?.observe(carousel);
    }

    window.addEventListener("resize", syncAll);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", syncAll);
    };
  }, [marketplaceBestSellerGroups, selectedCategoryId]);

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

  const [specialDeliveryZone185, setSpecialDeliveryZone185] =
    useState<DarikSpecialDeliveryZone185>({
      enabled: false,
      maxKm: 0,
      minimumQualifyingJod: 0,
      excludedCategoryIds: [],
    });

  const [deliveryTruth191, setDeliveryTruth191] = useState<{
    loaded: boolean;
    estimatedDeliveryDays: number | null;
    deliveryCutoffTime: string | null;
  }>({
    loaded: false,
    estimatedDeliveryDays: null,
    deliveryCutoffTime: null,
  });

  useEffect(() => {
    if (!slug) {
      setSpecialDeliveryZone185({
        enabled: false,
        maxKm: 0,
        minimumQualifyingJod: 0,
        excludedCategoryIds: [],
      });
      setDeliveryTruth191({
        loaded: false,
        estimatedDeliveryDays: null,
        deliveryCutoffTime: null,
      });
      return;
    }

    if (darikIsBuilderPreview120() || slug === "_darik-private-store-preview") {
      setDeliveryTruth191({
        loaded: false,
        estimatedDeliveryDays: null,
        deliveryCutoffTime: null,
      });
      return;
    }

    let cancelled191 = false;
    setDeliveryTruth191({
      loaded: false,
      estimatedDeliveryDays: null,
      deliveryCutoffTime: null,
    });

    void (async () => {
      const [specialResult191, truthResult191] = await Promise.all([
        supabase.rpc("darik_direct_public_special_delivery_zone_v185", {
          p_slug: slug,
        }),
        supabase.rpc("darik_direct_public_delivery_truth_v191", {
          p_slug: slug,
        }),
      ]);

      if (cancelled191) return;

      if (specialResult191.error) {
        console.warn(
          "Darik Special Zone could not load:",
          specialResult191.error.message
        );
      } else {
        setSpecialDeliveryZone185(
          normalizeDarikSpecialDeliveryZone185(specialResult191.data)
        );
      }

      if (truthResult191.error) {
        console.error(
          "Darik live delivery truth could not load:",
          truthResult191.error.message
        );
        setDeliveryTruth191({
          loaded: true,
          estimatedDeliveryDays: null,
          deliveryCutoffTime: null,
        });
      } else {
        const truth191 =
          truthResult191.data && typeof truthResult191.data === "object"
            ? (truthResult191.data as Record<string, unknown>)
            : {};
        const rawDays191 = truth191.estimated_delivery_days;
        const parsedDays191 = Number(rawDays191);
        const cutoff191 = String(truth191.delivery_cutoff_time ?? "").slice(0, 5);

        setDeliveryTruth191({
          loaded: true,
          estimatedDeliveryDays:
            Number.isInteger(parsedDays191) && parsedDays191 >= 0
              ? parsedDays191
              : null,
          deliveryCutoffTime: /^\d{2}:\d{2}$/.test(cutoff191)
            ? cutoff191
            : null,
        });
      }
    })();

    return () => {
      cancelled191 = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!storefront || !slug) return;

    /*
      Retailer builder preview is not a customer visit. Never block setup or
      preview rendering behind a customer delivery-location question.
    */
    if (
      darikIsBuilderPreview120() &&
      !darikIsActualLiveEditor196()
    ) {
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

  // DARIK_GUEST_CHECKOUT_ACCOUNT_NUDGE_SIGNUP_CONFIRM_173
  const [darikSignupFirstName173, setDarikSignupFirstName173] = useState("");
  const [darikSignupLastName173, setDarikSignupLastName173] = useState("");
  const [darikSignupPhone121, setDarikSignupPhone121] = useState("");
  const [darikSignupPhoneConfirm173, setDarikSignupPhoneConfirm173] = useState("");
  const [darikSignupEmail121, setDarikSignupEmail121] = useState("");
  const [darikSignupEmailConfirm173, setDarikSignupEmailConfirm173] = useState("");
  const [darikSignupPassword121, setDarikSignupPassword121] = useState("");
  const [darikSignupPasswordConfirm121, setDarikSignupPasswordConfirm121] =
    useState("");
  const [darikSignupEmailCode121, setDarikSignupEmailCode121] = useState("");
  const [darikSignupPhoneCode121, setDarikSignupPhoneCode121] = useState("");
  const [darikSignupStep121, setDarikSignupStep121] =
    useState<DarikSignupStep121>("details");
  const [darikPendingPhoneSession121, setDarikPendingPhoneSession121] =
    useState<any>(null);
  const [darikGuestCheckoutNudgeOpen173, setDarikGuestCheckoutNudgeOpen173] =
    useState(false);

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

  // DARIK_REAL_LOGO_POPUP_AND_HOME_174
  const darikBrandLogoSrc174 = "/darik_logo_final_v2.png";

  function handleCheckoutWithAccountNudge173() {
    if (darikCustomerProfile121) {
      void placeOnlineOrder();
      return;
    }

    if (darikCheckoutIdentity121 === "guest") {
      setDarikGuestCheckoutNudgeOpen173(true);
      return;
    }

    void placeOnlineOrder();
  }

  function continueGuestCheckoutAfterNudge173() {
    setDarikGuestCheckoutNudgeOpen173(false);
    void placeOnlineOrder();
  }

  function openDarikSignInFromCheckoutNudge173() {
    setDarikGuestCheckoutNudgeOpen173(false);
    setDarikAuthMessage121("");
    setDarikCheckoutIdentity121("login");

    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>("[data-darik-customer-account='checkout']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function chooseDarikGuestCheckout121() {
    setDarikAuthMessage121("");

    // DARIK_SHARED_PERSISTENT_CUSTOMER_ACCOUNT_HUB_175_V2: guest checkout does not destroy the remembered Darik login.
    // DARIK_CUSTOMER_SIGNIN_GLOBAL_AND_STORE_SCOPED_HISTORY_339: guest checkout preserves the shared customer session.
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
    const firstName = darikSignupFirstName173.trim();
    const lastName = darikSignupLastName173.trim();
    const name = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
    const phone = normalizeDarikCustomerPhone121(darikSignupPhone121);
    const phoneConfirm = normalizeDarikCustomerPhone121(
      darikSignupPhoneConfirm173
    );
    const email = darikSignupEmail121.trim().toLowerCase();
    const emailConfirm = darikSignupEmailConfirm173.trim().toLowerCase();

    if (!firstName || !lastName) {
      setDarikAuthMessage121("Enter your first name and last name.");
      return null;
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      setDarikAuthMessage121("Enter a valid email address.");
      return null;
    }

    if (email !== emailConfirm) {
      setDarikAuthMessage121("Email addresses do not match.");
      return null;
    }

    if (phone.length < 8) {
      setDarikAuthMessage121("Enter a valid phone number.");
      return null;
    }

    if (phone !== phoneConfirm) {
      setDarikAuthMessage121("Phone numbers do not match.");
      return null;
    }

    if (!darikSignupPassword121) {
      setDarikAuthMessage121("Enter a password.");
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

    return { firstName, lastName, name, phone, email };
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
            first_name: details.firstName,
            last_name: details.lastName,
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

  // DARIK_SPECIAL_FREE_DELIVERY_ZONE_185
  const usePublicDeliveryTruth191 =
    !darikIsBuilderPreview120() && slug !== "_darik-private-store-preview";
  const deliveryPromiseDays191 = usePublicDeliveryTruth191
    ? deliveryTruth191.loaded
      ? deliveryTruth191.estimatedDeliveryDays
      : null
    : storefront?.estimated_delivery_days;
  const deliveryPromiseCutoff191 = usePublicDeliveryTruth191
    ? deliveryTruth191.loaded
      ? deliveryTruth191.deliveryCutoffTime
      : null
    : storefront?.delivery_cutoff_time;

  const specialExcludedCategories185 = new Set(
    specialDeliveryZone185.excludedCategoryIds
  );
  const specialProductById185 = new Map(
    products.map((product) => [product.id, product] as const)
  );
  const specialQualifyingSubtotal185 = cart.reduce((total185, line185) => {
    const product185 = specialProductById185.get(line185.productId);
    const categoryId185 = String(
      product185?.direct_store_category_id ?? ""
    ).trim();
    if (categoryId185 && specialExcludedCategories185.has(categoryId185)) {
      return total185;
    }
    return total185 + line185.price * line185.quantity;
  }, 0);
  const specialDistanceKm185 = Number(deliveryMatch117?.distance_km ?? NaN);
  const specialOfferAtLocation185 = Boolean(
    specialDeliveryZone185.enabled &&
      deliveryMatch117 &&
      Number.isFinite(specialDistanceKm185) &&
      specialDistanceKm185 <= specialDeliveryZone185.maxKm + 0.0001
  );
  const specialDeliveryFree185 = Boolean(
    deliveryEnabled &&
      !selectedPickup &&
      specialOfferAtLocation185 &&
      specialDeliveryZone185.minimumQualifyingJod > 0 &&
      specialQualifyingSubtotal185 + 0.0001 >=
        specialDeliveryZone185.minimumQualifyingJod
  );
  const specialDeliveryRemaining185 = Math.max(
    0,
    specialDeliveryZone185.minimumQualifyingJod -
      specialQualifyingSubtotal185
  );

  const specialOfferConfigured191 = Boolean(
    deliveryEnabled &&
      specialDeliveryZone185.enabled &&
      specialDeliveryZone185.maxKm > 0 &&
      specialDeliveryZone185.minimumQualifyingJod > 0
  );
  const specialLocationKnown191 = Boolean(
    deliveryMatch117 && Number.isFinite(specialDistanceKm185)
  );
  const specialCountdownEligible191 = Boolean(
    specialOfferConfigured191 &&
      (!specialLocationKnown191 || specialOfferAtLocation185)
  );
  const specialThresholdLabel191 = money(
    specialDeliveryZone185.minimumQualifyingJod
  );
  const specialRadiusLabel191 =
    specialDeliveryZone185.maxKm % 1 === 0
      ? String(specialDeliveryZone185.maxKm)
      : specialDeliveryZone185.maxKm.toFixed(1);
  const specialCartCountdown191 = specialDeliveryFree185
    ? `FREE delivery unlocked — you save ${money(matchedDeliveryFee117)} JOD`
    : specialCountdownEligible191
      ? `Add ${money(specialDeliveryRemaining185)} JOD more and get FREE delivery`
      : `Free delivery over ${specialThresholdLabel191} JOD is available within ${specialRadiusLabel191} km`;
  const deliveryFee =
    deliveryEnabled && !selectedPickup
      ? specialDeliveryFree185
        ? 0
        : matchedDeliveryFee117
      : 0;
  const orderTotal = cartSubtotal + deliveryFee;
  const minimumOrder = matchedMinimumOrder117;
  const minimumReached = cartSubtotal >= minimumOrder;
  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) ?? null,
    [activeProductId, products]
  );

  function openProductDetail(product: Product) {
    productReturnPosition183Ref.current = {
      x: window.scrollX,
      y: window.scrollY,
    };

    setActiveProductId(product.id);

    const url = new URL(window.location.href);
    url.searchParams.set("product", product.id);
    window.history.replaceState(window.history.state, "", url.toString());
  }

  function closeProductDetail() {
    const returnPosition183 = productReturnPosition183Ref.current;

    setActiveProductId("");

    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.replaceState(window.history.state, "", url.toString());

    if (returnPosition183) {
      productReturnPosition183Ref.current = null;

      const restore183 = () => {
        window.scrollTo({
          left: returnPosition183.x,
          top: returnPosition183.y,
          behavior: "auto",
        });
      };

      window.requestAnimationFrame(() => {
        restore183();
        window.requestAnimationFrame(() => {
          restore183();
          window.setTimeout(restore183, 80);
        });
      });
    }
  }

  function cartLineId216(
    productId: string,
    colorVariantId: string | null | undefined,
    sizeKey245: string | null | undefined = null
  ) {
    return `${productId}:${colorVariantId || "default"}:${sizeKey245 || "default"}`;
  }

  function productCartQuantities216(productId: string) {
    return cart.reduce<Record<string, number>>((result, line) => {
      if (line.productId !== productId) return result;
      const key216 =
        `${line.colorVariantId || "default"}|${line.sizeKey || "default"}`;
      result[key216] = (result[key216] || 0) + line.quantity;
      return result;
    }, {});
  }

  function addToCart(
    product: Product,
    colorVariant216: FurnitureColorSelection216 | null = null,
    sizeSelection245: { key: string; label: string } | null = null
  ) {
    setOrderConfirmation(null);
    if ((product.direct_pricing_mode || "price") !== "price") return;
    if (
      product.direct_availability_status === "out_of_stock" ||
      (product.direct_inventory_tracking_enabled &&
        Number(product.quantity_in_stock ?? 0) <= 0)
    ) return;
    const price = Number(product.app_price ?? 0);
    if (!Number.isFinite(price) || price <= 0) return;

    const hasSizes245 =
      (Array.isArray(product.direct_size_options) &&
        product.direct_size_options.some((size) =>
          Boolean(String(size?.label || "").trim())
        )) ||
      (Array.isArray(product.direct_shoe_sizes) &&
        product.direct_shoe_sizes.some((size) =>
          Boolean(String(size?.eu || "").trim())
        ));

    if (hasSizes245 && !sizeSelection245?.key) {
      setActiveProductId(product.id);
      return;
    }

    const lineId216 = cartLineId216(
      product.id,
      colorVariant216?.id || null,
      sizeSelection245?.key || null
    );

    setCart((current) => {
      const existing = current.find((line) => line.lineId === lineId216);

      if (existing) {
        return current.map((line) =>
          line.lineId === lineId216
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }

      return [
        ...current,
        {
          lineId: lineId216,
          productId: product.id,
          name: productName(product),
          price,
          quantity: 1,
          photoUrl: colorVariant216?.photoUrl || productPhoto(product),
          colorVariantId: colorVariant216?.id || null,
          colorName: colorVariant216?.name || null,
          colorNameAr: colorVariant216?.nameAr || null,
          sizeKey: sizeSelection245?.key || null,
          sizeLabel: sizeSelection245?.label || null,
        },
      ];
    });
  }

  function changeQuantity(lineId: string, change: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.lineId === lineId
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

      const result = await supabase.rpc("darik_direct_place_online_order_v5", {
        p_storefront_slug: storefront.slug,
        p_customer_name: customerName,
        p_customer_phone: customerPhone,
        p_fulfillment_method: checkoutForm.fulfillmentMethod,
        p_delivery_latitude: checkoutForm.latitude,
        p_delivery_longitude: checkoutForm.longitude,
        p_items: cart.map((line) => ({
          product_id: line.productId,
          quantity: line.quantity,
          color_variant_id: line.colorVariantId,
          size_key: line.sizeKey,
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
        total: specialDeliveryFree185
          ? orderTotal
          : Number(response?.total ?? orderTotal),
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

  // DARIK_PREVIEW_LIVE_FRESH_LAYOUT_SOURCE_167
  // The dedicated public-layout RPC is the freshest source of truth.
  // Embedded storefront layout remains only a pre-fetch/error fallback.
  const [darikPublicLayout166, setDarikPublicLayout166] =
    useState<DarikPublicLayout166 | null>(null);

  useEffect(() => {
    if (
      !slug ||
      slug === "_darik-private-store-preview" ||
      (isBuilderPositionPreview145 &&
        !darikIsActualLiveEditor196())
    ) {
      setDarikPublicLayout166(null);
      return;
    }

    // Clear any prior slug result while the fresh RPC resolves.
    setDarikPublicLayout166(null);

    let cancelled166 = false;

    void (async () => {
      const result166 = await supabase.rpc(
        "darik_direct_public_freeform_layout_v1",
        { p_slug: slug }
      );

      if (cancelled166) return;

      if (result166.error) {
        console.warn(
          "Darik live storefront layout could not load:",
          result166.error.message
        );
        return;
      }

      setDarikPublicLayout166(
        darikNormalizePublicLayout166(
          result166.data
        )
      );
    })();

    return () => {
      cancelled166 = true;
    };
  }, [slug, isBuilderPositionPreview145]);

  const darikStorefrontLayoutRaw166 = (
    storefront as unknown as {
      direct_freeform_layout?: unknown;
    } | null
  )?.direct_freeform_layout;

  const darikEffectivePublicLayout166 = useMemo(
    () =>
      darikNormalizePublicLayout166(
        darikStorefrontVisualTruth194?.freeform_layout ??
          darikPublicLayout166 ??
          darikStorefrontLayoutRaw166
      ),
    [
      darikStorefrontLayoutRaw166,
      darikPublicLayout166,
      darikStorefrontVisualTruth194,
    ]
  );

  useEffect(() => {
    if (
      (isBuilderPositionPreview145 &&
        !darikIsActualLiveEditor196()) ||
      slug === "_darik-private-store-preview"
    ) {
      return;
    }

    const root = document.querySelector(
      "[data-darik-position-builder145]"
    );

    if (!root) return;

    type Original166 = {
      translateValue: string;
      translatePriority: string;
      scaleValue: string;
      scalePriority: string;
      displayValue: string;
      displayPriority: string;
    };

    const originals166 =
      new Map<HTMLElement, Original166>();

    let stableTimer166 = 0;
    let frameOne166 = 0;
    let frameTwo166 = 0;

    function restore166() {
      for (const [
        target,
        original,
      ] of originals166.entries()) {
        const style = target.style;

        if (original.translateValue) {
          style.setProperty(
            "translate",
            original.translateValue,
            original.translatePriority
          );
        } else {
          style.removeProperty("translate");
        }

        if (original.scaleValue) {
          style.setProperty(
            "scale",
            original.scaleValue,
            original.scalePriority
          );
        } else {
          style.removeProperty("scale");
        }

        if (original.displayValue) {
          style.setProperty(
            "display",
            original.displayValue,
            original.displayPriority
          );
        } else {
          style.removeProperty("display");
        }

        target.removeAttribute(
          "data-darik-live-layout166"
        );
      }

      originals166.clear();
    }

    function remember166(target: HTMLElement) {
      if (originals166.has(target)) return;

      originals166.set(target, {
        translateValue:
          target.style.getPropertyValue(
            "translate"
          ),
        translatePriority:
          target.style.getPropertyPriority(
            "translate"
          ),
        scaleValue:
          target.style.getPropertyValue(
            "scale"
          ),
        scalePriority:
          target.style.getPropertyPriority(
            "scale"
          ),
        displayValue:
          target.style.getPropertyValue(
            "display"
          ),
        displayPriority:
          target.style.getPropertyPriority(
            "display"
          ),
      });
    }

    function applyNow166() {
      restore166();

      darikAssignPublicSemanticClasses166(
        root
      );

      const device =
        window.innerWidth <= 720
          ? "mobile"
          : "desktop";

      for (const [
        locator,
        point,
      ] of Object.entries(
        darikEffectivePublicLayout166[device]
      )) {
        if (
          !darikSafeLayoutLocator166(locator)
        ) {
          continue;
        }

        let target: Element | null = null;

        try {
          target = root.querySelector(locator);
        } catch {
          target = null;
        }

        if (!(target instanceof HTMLElement)) {
          continue;
        }

        remember166(target);

        target.style.setProperty(
          "translate",
          `${darikClampLayoutOffset166(
            point.x
          )}px ${darikClampLayoutOffset166(
            point.y
          )}px`,
          "important"
        );

        if (point.scale !== undefined) {
          target.style.setProperty(
            "scale",
            String(
              darikClampLayoutScale166(
                point.scale
              )
            ),
            "important"
          );
        }

        if (point.hidden === true) {
          target.style.setProperty(
            "display",
            "none",
            "important"
          );
        }

        target.setAttribute(
          "data-darik-live-layout166",
          "true"
        );
      }
    }

    function schedule166(delay = 120) {
      window.clearTimeout(stableTimer166);
      window.cancelAnimationFrame(
        frameOne166
      );
      window.cancelAnimationFrame(
        frameTwo166
      );

      stableTimer166 =
        window.setTimeout(() => {
          frameOne166 =
            window.requestAnimationFrame(() => {
              frameTwo166 =
                window.requestAnimationFrame(
                  applyNow166
                );
            });
        }, delay);
    }

    schedule166(0);

    const observer166 =
      new MutationObserver(
        (mutations) => {
          const structuralChange =
            mutations.some(
              (mutation) =>
                mutation.type === "childList" &&
                (
                  mutation.addedNodes.length > 0 ||
                  mutation.removedNodes.length > 0
                )
            );

          if (structuralChange) {
            schedule166(120);
          }
        }
      );

    observer166.observe(root, {
      childList: true,
      subtree: true,
    });

    const onResize166 = () =>
      schedule166(40);

    window.addEventListener(
      "resize",
      onResize166
    );

    return () => {
      observer166.disconnect();
      window.removeEventListener(
        "resize",
        onResize166
      );
      window.clearTimeout(stableTimer166);
      window.cancelAnimationFrame(
        frameOne166
      );
      window.cancelAnimationFrame(
        frameTwo166
      );
      restore166();
    };
  }, [
    darikEffectivePublicLayout166,
    isBuilderPositionPreview145,
    slug,
    storefront?.id,
  ]);

  if (loading) {
    return (
      <main className={styles.statePage}>
        {openingStoreLogo188 ? (
          <div className="darikStoreOpeningLogo188" aria-hidden="true">
            <img src={openingStoreLogo188} alt="" />
          </div>
        ) : null}
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
      darikStorefrontVisualTruth194?.typography ??
        (storefront as unknown as { direct_typography?: unknown }).direct_typography ??
        savedStorefrontTypography
    );

  // DARIK_CANONICAL_HERO_POSITION_BRIDGE_202
  // Core hero movement now uses canonical React-rendered positioning.
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

  const effectiveContentPositioning145 =
    normalizeStorefrontContentPositioning145(
      darikStorefrontVisualTruth194?.content_positioning ??
        (
          storefront as unknown as {
            direct_content_positioning?: unknown;
          }
        ).direct_content_positioning ??
        savedContentPositioning145
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
  // DARIK_GLOBAL_PRODUCT_CARD_SHAPE_TOGGLE_271
  const productCardCorners271 =
    storefront.corner_style === "square" ? "square" : "rounded";
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
        `${line.quantity} × ${line.name}${line.colorName ? ` — ${line.colorName}${line.colorNameAr ? ` / ${line.colorNameAr}` : ""}` : ""}${line.sizeLabel ? ` — Size: ${line.sizeLabel}` : ""} — ${money(line.price * line.quantity)}`
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
    const currentPrice171 = Number(
      product.app_price ?? 0
    );
    const compareAtPrice171 = Number(
      product.direct_compare_at_price ??
        darikCompareAtByProduct171[product.id] ??
        0
    );
    const showCompareAtPrice171 =
      pricingMode === "price" &&
      showPrices &&
      Number.isFinite(currentPrice171) &&
      Number.isFinite(compareAtPrice171) &&
      currentPrice171 > 0 &&
      compareAtPrice171 > currentPrice171;
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
              <strong>{showCompareAtPrice171 ? (
              <span className={styles.darikSalePrice171}>
                <span
                  className={styles.darikCompareAtPrice171}
                  aria-label={`Was ${money(compareAtPrice171)}`}
                >
                  {money(compareAtPrice171)}
                </span>
                <span className={styles.darikCurrentPrice171}>
                  {money(currentPrice171)}
                </span>
              </span>
            ) : (
              pricingLabel
            )}</strong>
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

  const heroSize254: HeroSize254 = heroSize260;

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
      data-product-card-corners={productCardCorners271}
      data-corners={cornerStyle}
      data-hero={heroLayout}
      data-hero-size={heroSize254}
      data-banner-active="no"
      data-business={effectiveBusinessType}
      data-theme-field={effectiveThemeField}
      data-darik-page-font={effectiveStorefrontTypography.page.font}
      data-darik-position-builder145={isBuilderPositionPreview145 ? "true" : "false"}
      data-field-preview={previewRetailField ? "yes" : "no"}
      data-mechanics-preview={previewMechanicsField ? "yes" : "no"}
      data-category-count={String(visibleCategories.length)}
      data-direct-purchase={hasDirectPurchaseProducts ? "yes" : "no"}
    >
      {activeStoreBanner274?.image_url ? (
        <div
          data-darik-sticky-banner="283"
          className={`${styles.stickyBanner283} ${
            showStickyBanner283 ? styles.stickyBannerVisible283 : ""
          }`}
          style={{ top: stickyBannerTop283 }}
          aria-hidden={!showStickyBanner283}
        >
          <div
              className={`${styles.stickyBannerInner283} ${
                activeStoreBanner274.product_id ? styles.stickyBannerLinked287 : ""
              }`}
              role={activeStoreBanner274.product_id ? "link" : undefined}
              tabIndex={activeStoreBanner274.product_id ? 0 : undefined}
              aria-label={activeStoreBanner274.product_id ? "Open featured product" : undefined}
              onClick={() => {
                if (!activeStoreBanner274.product_id) return;
                window.location.assign(
                  `/${storefront.slug}?product=${encodeURIComponent(
                    activeStoreBanner274.product_id
                  )}#catalog`
                );
              }}
              onKeyDown={(event) => {
                if (!activeStoreBanner274.product_id) return;
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                window.location.assign(
                  `/${storefront.slug}?product=${encodeURIComponent(
                    activeStoreBanner274.product_id
                  )}#catalog`
                );
              }}
            >
            <img
              key={activeStoreBanner274.id}
              className={styles.stickyBannerImage283}
              src={activeStoreBanner274.image_url}
              alt="Store promotion banner"
              onError={() => setActiveStoreBanner274(null)}
            />
          </div>
        </div>
      ) : null}

      {/* DARIK_SHARED_PERSISTENT_CUSTOMER_ACCOUNT_HUB_175_V2 */}
      {!isBuilderPositionPreview145 &&
      slug !== "_darik-private-store-preview" ? (
        <DarikCustomerAccountHub339
          scope="store"
          retailerId={storefront?.retailer_id ?? null}
        />
      ) : null}

      {/* DARIK_LIVE_EDITOR_LOCATION_INTERACTION_ZONE_197 */}
      {/* DARIK_DIRECT_OBJECT_DRAG_SAVE_TO_LIVE_198 */}
      {/* DARIK_LOCATION_FULL_INTERACTION_MODE_200 */}
      {locationGateOpen117 &&
      deliveryEnabled &&
      !pickupOnly ? (
        <div
          className={styles.customerLocationGate117}
          data-darik-live-editor-interaction197="true"
          data-darik-live-editor-interaction198="true"
          data-darik-live-editor-interaction200="location"
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
        product={
          activeProduct
            ? {
                ...activeProduct,
                direct_compare_at_price:
                  activeProduct.direct_compare_at_price ??
                  darikCompareAtByProduct171[
                    activeProduct.id
                  ] ??
                  null,
              }
            : null
        }
        storeName={storefront.display_name}
        storeSlug={storefront.slug}
        primaryColor={fieldDesign.primaryColor}
        accentColor={fieldDesign.accentColor}
        backgroundColor={fieldDesign.backgroundColor}
        appearanceMode={appearanceMode}
        phoneHref={phone}
        whatsappNumber={storefront.whatsapp_number}
        showPrices={showPrices}
        showOrdering={showOrdering}
        acceptingOrders={effectiveAcceptingOrders}
        deliveryEnabled={deliveryEnabled}
        pickupEnabled={pickupEnabled}
        estimatedDeliveryMinutes={storefront.estimated_delivery_minutes}
        deliveryPromiseLabel={
          darikDeliveryPromise163(
            deliveryPromiseDays191,
            deliveryPromiseCutoff191,
            storeClock115
          ).customerLabel
        }
        inCart={
          activeProduct
            ? cart.find((line) => line.productId === activeProduct.id)?.quantity ?? 0
            : 0
        }
        cartQuantitiesByVariant216={
          activeProduct ? productCartQuantities216(activeProduct.id) : {}
        }
        cartCount={cartCount}
        onClose={closeProductDetail}
        onAddToCart={(colorVariant216, sizeSelection245) => {
          if (!activeProduct) return;
          addToCart(activeProduct, colorVariant216, sizeSelection245);
        }}
        onDecreaseCart={(colorVariant216, sizeSelection245) => {
          if (!activeProduct) return;
          changeQuantity(
            cartLineId216(
              activeProduct.id,
              colorVariant216?.id || null,
              sizeSelection245?.key || null
            ),
            -1
          );
        }}
        onOpenCart={() => {
          // DARIK_PRODUCT_CART_QUANTITY_THEME_PARITY_180: match Customer App behavior.
          // Leave the product screen first, then open the shared cart.
          closeProductDetail();
          window.setTimeout(() => setCartOpen(true), 120);
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

      {activeStoreBanner274?.image_url && showStoreBanner274 ? (
        <section
          className={`${styles.hero} ${portfolioStyles.heroPolish} ${styles.storeBannerHero274}`}
          aria-label="Store promotion / عرض المتجر"
        >
          <img
            className={styles.storeBannerImage274}
            src={activeStoreBanner274.image_url}
            alt={activeStoreBanner274.text || "Store promotion"}
            onError={() => setActiveStoreBanner274(null)}
          />
          {/* DARIK_MANUAL_BANNER_IMAGE_ONLY_282: uploaded artwork renders exactly as supplied. */}
        </section>
      ) : (
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
          <div
            id="darik-layout-hero-logo-202"
            className={[
              styles.heroLogo,
              styles.builderPositionTarget145,
              builderSelectedPosition145 === "hero_logo"
                ? styles.builderPositionSelected145
                : "",
            ].filter(Boolean).join(" ")}
            style={storefrontPositionStyle145(
              effectiveContentPositioning145,
              "hero_logo"
            )}
            onClick={(event) =>
              selectBuilderPositionTarget145(event, "hero_logo")
            }
          >
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
            <div
              id="darik-layout-hero-label-202"
              className={[
                styles.heroLabel,
                styles.builderPositionTarget145,
                builderSelectedPosition145 === "hero_label"
                  ? styles.builderPositionSelected145
                  : "",
              ].filter(Boolean).join(" ")}
              style={storefrontPositionStyle145(
                effectiveContentPositioning145,
                "hero_label"
              )}
              onClick={(event) =>
                selectBuilderPositionTarget145(event, "hero_label")
              }
            >
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
              <button
                id="darik-layout-primary-button-202"
                className={[
                  styles.primaryHeroButton,
                  styles.builderPositionTarget145,
                  builderSelectedPosition145 === "primary_button"
                    ? styles.builderPositionSelected145
                    : "",
                ].filter(Boolean).join(" ")}
                style={storefrontPositionStyle145(
                  effectiveContentPositioning145,
                  "primary_button"
                )}
                onClick={(event) => {
                  if (isBuilderPositionPreview145) {
                    selectBuilderPositionTarget145(
                      event,
                      "primary_button"
                    );
                    return;
                  }
                  jumpToCatalog();
                }}
              >
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
                {(pickupOnly || selectedPickup)
                  ? "Collect from store"
                  : (() => {
                      const promise163 = darikDeliveryPromise163(
                        deliveryPromiseDays191,
                        deliveryPromiseCutoff191,
                        storeClock115
                      );

                      // DARIK_DELIVERY_PROMISE_CUTOFF_SOURCE_OF_TRUTH_165
// DARIK_DELIVERY_DEFAULT_END_OF_DAY_CUTOFF_168
                      // Delivery timing is controlled by the retailer's configured
                      // delivery days + cutoff. Store business hours still control
                      // the Open/Closed UI, but must not silently rewrite Today
                      // into Tomorrow before the retailer's delivery cutoff.
                      return promise163.customerLabel;
                    })()}
</strong>
                </div>
                <div>
                  <Icon name={pickupOnly ? "store" : "truck"} size={20} />
                  <span>{(pickupOnly || selectedPickup) ? "Pickup fee" : "Delivery fee"}</span>
                  <strong>{(pickupOnly || selectedPickup) ? "Free" : specialDeliveryFree185 ? "Free" : money(deliveryFee)}</strong>
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

          {specialOfferConfigured191 && !pickupOnly ? (
            <div className={styles.specialDeliverySnapshot191}>
              <div>
                <small>FREE DELIVERY OFFER</small>
                <strong>Free delivery over {specialThresholdLabel191} JOD</strong>
                <span>
                  {specialOfferAtLocation185
                    ? specialDeliveryFree185
                      ? `Unlocked now • normal fee ${money(matchedDeliveryFee117)} JOD`
                      : `${money(matchedDeliveryFee117)} JOD normal delivery until ${specialThresholdLabel191} JOD qualifying`
                    : `${money(matchedDeliveryFee117)} JOD normal delivery • offer available within ${specialRadiusLabel191} km`}
                </span>
              </div>
              <b>FREE</b>
            </div>
          ) : null}
        </aside>
      </section>
      )}

      {/* DARIK_286_NO_BANNER_INDICATORS */}

      {/* DARIK_MOBILE_DELIVERY_PROMISE_FEE_185 */}
      {showOrdering && deliveryEnabled && !selectedPickup ? (
        <section
          className={styles.mobileDeliverySummary185}
          aria-label="Delivery summary"
        >
          <div>
            <Icon name="clock" size={18} />
            <span>Delivery</span>
            <strong>
              {darikDeliveryPromise163(
                deliveryPromiseDays191,
                deliveryPromiseCutoff191,
                storeClock115
              ).customerLabel}
            </strong>
          </div>
          <div>
            <Icon name="truck" size={18} />
            <span>Delivery fee</span>
            <strong>
              {specialDeliveryFree185 ? "Free" : money(deliveryFee)}
            </strong>
          </div>
          {specialOfferConfigured191 ? (
            <div className={styles.mobileSpecialDelivery185}>
              <span>
                {specialDeliveryFree185
                  ? "FREE delivery unlocked"
                  : `Free delivery over ${specialThresholdLabel191} JOD`}
              </span>
              <small>
                {specialDeliveryFree185
                  ? `Saved ${money(matchedDeliveryFee117)} JOD delivery`
                  : specialOfferAtLocation185
                    ? `Add ${money(specialDeliveryRemaining185)} JOD more`
                    : `Within ${specialRadiusLabel191} km • otherwise ${money(matchedDeliveryFee117)} JOD`}
              </small>
            </div>
          ) : null}
        </section>
      ) : null}

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

                    <div
                      className={styles.marketplaceBestSellerCarouselShell182}
                      data-can-forward={
                        bestSellerShelfState182[category.id]?.canGoForward
                          ? "true"
                          : "false"
                      }
                      data-can-back={
                        bestSellerShelfState182[category.id]?.canGoBack
                          ? "true"
                          : "false"
                      }
                    >
                      <div
                        className={styles.marketplaceBestSellerCarousel}
                        data-darik-best-seller-carousel-182={category.id}
                        onScroll={(event) =>
                          updateBestSellerShelfState182(
                            category.id,
                            event.currentTarget
                          )
                        }
                      >
                        {categoryProducts.map((product) => (
                          <div
                            key={`best-seller-${product.id}`}
                            className={styles.marketplaceBestSellerItem}
                            data-darik-best-seller-item-182="true"
                          >
                            {renderProductCard(product)}
                            <button
                              type="button"
                              className={styles.marketplaceBestSellerTapTarget}
                              onClick={() => openProductDetail(product)}
                              aria-label={`View ${productName(product)}`}
                            />
                          </div>
                        ))}
                      </div>

                      {bestSellerShelfState182[category.id]?.canGoForward ? (
                        <button
                          type="button"
                          className={styles.marketplaceBestSellerContinue182}
                          onClick={() => scrollBestSellerShelf182(category.id)}
                          aria-label={`Show more ${category.name} best sellers`}
                        >
                          <svg viewBox="0 0 20 20" aria-hidden="true">
                            <path
                              d="m7.5 4.75 5.25 5.25-5.25 5.25"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      ) : null}
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
                : darikDeliveryPromise163(
                    deliveryPromiseDays191,
                    deliveryPromiseCutoff191,
                    storeClock115
                  ).shortLabel}
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

            {!orderConfirmation && cart.length > 0 && specialOfferConfigured191 && !selectedPickup ? (
              <div className={`${styles.specialDeliveryCountdown191} ${
                specialDeliveryFree185 ? styles.specialDeliveryCountdownUnlocked191 : ""
              }`}>
                <div className={styles.specialDeliveryCountdownTop191}>
                  <span>{specialDeliveryFree185 ? "✓" : "FREE"}</span>
                  <div>
                    <strong>{specialCartCountdown191}</strong>
                    <small>
                      {specialDeliveryFree185
                        ? `Qualifying subtotal: ${money(specialQualifyingSubtotal185)} JOD`
                        : specialCountdownEligible191
                          ? `${money(specialQualifyingSubtotal185)} of ${specialThresholdLabel191} JOD qualifying`
                          : `Offer radius: ${specialRadiusLabel191} km from the store`}
                    </small>
                  </div>
                </div>
                {!specialDeliveryFree185 && specialCountdownEligible191 ? (
                  <div className={styles.specialDeliveryCountdownTrack191}>
                    <span style={{ width: `${Math.min(
                      100,
                      specialDeliveryZone185.minimumQualifyingJod > 0
                        ? (specialQualifyingSubtotal185 / specialDeliveryZone185.minimumQualifyingJod) * 100
                        : 100
                    )}%` }} />
                  </div>
                ) : null}
                {specialDeliveryZone185.excludedCategoryIds.length > 0 ? (
                  <small className={styles.specialDeliveryCountdownExclusion191}>
                    Excluded categories do not count toward the free-delivery minimum.
                  </small>
                ) : null}
              </div>
            ) : null}

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
                      <div className={styles.cartLine} key={line.lineId}>
                        <div className={styles.cartThumb}>
                          {line.photoUrl ? (
                            <img src={line.photoUrl} alt={line.name} />
                          ) : (
                            <span>{line.name.slice(0, 1)}</span>
                          )}
                        </div>
                        <div className={styles.cartLineInfo}>
                          <h3>{line.name}</h3>
                          {line.colorName ? (
                            <small className={styles.cartColor216}>
                              {line.colorName}
                              {line.colorNameAr ? (
                                <span dir="rtl"> / {line.colorNameAr}</span>
                              ) : null}
                            </small>
                          ) : null}
                          {line.sizeLabel ? (
                            <small className={styles.cartSize245}>
                              Size / المقاس: <strong>{line.sizeLabel}</strong>
                            </small>
                          ) : null}
                          <p>{money(line.price)}</p>
                        </div>
                        <div className={styles.quantity}>
                          <button
                            onClick={() => changeQuantity(line.lineId, -1)}
                          >
                            <Icon name="minus" size={15} />
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            onClick={() => changeQuantity(line.lineId, 1)}
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
                    <strong>{selectedPickup ? "Free" : specialDeliveryFree185 ? "Free" : money(deliveryFee)}</strong>
                  </div>
                  {!selectedPickup && specialOfferConfigured191 ? (
                    <div
                      className={`${styles.specialDeliveryProgress185} ${
                        specialDeliveryFree185
                          ? styles.specialDeliveryUnlocked185
                          : ""
                      }`}
                    >
                      <div>
                        <span>
                          {specialDeliveryFree185
                            ? "FREE delivery unlocked"
                            : specialCountdownEligible191
                              ? `Add ${money(specialDeliveryRemaining185)} JOD more and get FREE delivery`
                              : `Free delivery over ${specialThresholdLabel191} JOD within ${specialRadiusLabel191} km`}
                        </span>
                        <strong>
                          {money(specialQualifyingSubtotal185)} / {money(
                            specialDeliveryZone185.minimumQualifyingJod
                          )}
                        </strong>
                      </div>
                      {!specialDeliveryFree185 ? (
                        <div className={styles.specialDeliveryTrack185}>
                          <span
                            style={{
                              width: `${Math.min(
                                100,
                                specialDeliveryZone185.minimumQualifyingJod > 0
                                  ? (specialQualifyingSubtotal185 /
                                      specialDeliveryZone185.minimumQualifyingJod) *
                                    100
                                  : 100
                              )}%`,
                            }}
                          />
                        </div>
                      ) : null}
                      <small>
                        {specialDeliveryFree185
                          ? "Excluded-category items can ride along without removing this benefit."
                          : `${money(specialDeliveryRemaining185)} more in qualifying categories. Excluded categories do not count.`}
                      </small>
                    </div>
                  ) : null}
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
                {darikGuestCheckoutNudgeOpen173 ? (
                  <div
                    className={styles.darikGuestCheckoutNudgeOverlay173}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="darik-guest-nudge-title-173"
                  >
                    <div className={styles.darikGuestCheckoutNudgeCard173}>
                      <div className={styles.darikGuestCheckoutNudgeLogoWrap174}>
                        <img
                          src={darikBrandLogoSrc174}
                          alt="Darik"
                          className={styles.darikGuestCheckoutNudgeLogo174}
                        />
                      </div>
                      <div className={styles.darikGuestCheckoutNudgeHeading173}>
                        <span>ONE QUICK THING</span>
                        <h3 id="darik-guest-nudge-title-173">
                          Are you sure you don’t want to sign in?
                        </h3>
                        <p>هل أنت متأكد أنك لا تريد تسجيل الدخول قبل إكمال الطلب؟</p>
                      </div>

                      <p className={styles.darikGuestCheckoutNudgeCopy173}>
                        A Darik account makes every order easier. Sign in before checkout
                        and keep your shopping history connected in one place.
                      </p>

                      <div className={styles.darikGuestCheckoutBenefits173}>
                        <div><strong>✉</strong><span>Emailed receipts<small>إيصالات عبر البريد الإلكتروني</small></span></div>
                        <div><strong>↺</strong><span>See past orders<small>عرض طلباتك السابقة</small></span></div>
                        <div><strong>⌖</strong><span>Save locations<small>حفظ مواقع التوصيل</small></span></div>
                        <div><strong>●</strong><span>Track orders<small>تتبع حالة الطلب</small></span></div>
                      </div>

                      <div className={styles.darikGuestCheckoutNudgeActions173}>
                        <button
                          type="button"
                          className={styles.darikGuestCheckoutNudgeSignIn173}
                          onClick={openDarikSignInFromCheckoutNudge173}
                        >
                          Sign in / تسجيل الدخول
                        </button>
                        <button
                          type="button"
                          className={styles.darikGuestCheckoutNudgeNoThanks173}
                          onClick={continueGuestCheckoutAfterNudge173}
                        >
                          No thanks, checkout as guest / لا شكراً
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

              {!darikIsBuilderPreview120() ? (
                <section
                  className={styles.darikCheckoutIdentity121}
                  data-darik-customer-account="checkout"
                >
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
                            First name / الاسم الأول
                            <input
                              value={darikSignupFirstName173}
                              onChange={(event) =>
                                setDarikSignupFirstName173(event.target.value)
                              }
                              placeholder="First name"
                              autoComplete="given-name"
                            />
                          </label>
                          <label>
                            Last name / اسم العائلة
                            <input
                              value={darikSignupLastName173}
                              onChange={(event) =>
                                setDarikSignupLastName173(event.target.value)
                              }
                              placeholder="Last name"
                              autoComplete="family-name"
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
                            Confirm email / تأكيد البريد الإلكتروني
                            <input
                              type="email"
                              value={darikSignupEmailConfirm173}
                              onChange={(event) =>
                                setDarikSignupEmailConfirm173(event.target.value)
                              }
                              placeholder="Repeat email"
                              autoComplete="off"
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
                            Confirm phone / تأكيد رقم الهاتف
                            <input
                              type="tel"
                              value={darikSignupPhoneConfirm173}
                              onChange={(event) =>
                                setDarikSignupPhoneConfirm173(event.target.value)
                              }
                              placeholder="Repeat phone"
                              autoComplete="off"
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
                              {specialDeliveryFree185
                                ? "Free"
                                : money(deliveryFee)}
                              {" · "}
                              Minimum / الحد الأدنى:{" "}
                              {money(
                                Number(
                                  deliveryMatch117.minimum_order ?? 0
                                )
                              )}
                              {specialOfferAtLocation185 ? (
                                <>
                                  {" · "}
                                  Special Zone / المنطقة الخاصة:{" "}
                                  {specialDeliveryFree185
                                    ? "Unlocked"
                                    : `${money(specialDeliveryRemaining185)} qualifying to go`}
                                </>
                              ) : null}
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
                        onClick={() => void handleCheckoutWithAccountNudge173()}
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
