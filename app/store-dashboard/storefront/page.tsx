"use client";

// DARIK_REAL_PRIVATE_PREVIEW_ALIAS_143

// DARIK_INTERNAL_SETUP_SLUG_PRIVACY_142_V3
function isInternalSetupSlug142(value: unknown) {
  return /^setup-/i.test(String(value ?? "").trim());
}



// DARIK_THEME_STEP_GALLERY_STABLE_AUTO_PREVIEW_138

// DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136

// DARIK_RETAIL_FIELDS_SMOKE_SHOP_050

// DARIK_PICKUP_ONLY_FULFILLMENT_032
// DARIK_CUSTOM_STORE_LINKS_035

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseBrowser";
import StorefrontPreviewModal from "../components/StorefrontPreviewModal";
import DashboardLogoutButton from "../components/DashboardLogoutButton";
import styles from "../dashboard.module.css";
import designStyles from "./storefront-design.module.css";

type StoreContext = {
  retailer_id: string;
  business_name: string;
  retailer_number: string | null;
  retailer_status: string | null;
  account_restricted: boolean;
  role: string;
  member_status: string;
  storefront_id: string | null;
  storefront_slug: string | null;
  storefront_status: string | null;
  direct_storefront_enabled: boolean | null;
  is_accepting_orders: boolean | null;
  activation_status?: string | null;
  activation_plan?: string | null;
  activation_expires_at?: string | null;
};

type ContextResult = {
  ok: boolean;
  auth_user_id: string | null;
  auth_email: string | null;
  stores: StoreContext[];
};


type CustomLink = {
  label: string;
  labelAr: string;
  url: string;
};

type CustomInformation = {
  label: string;
  labelAr: string;
  value: string;
  valueAr: string;
};

type OperatingHours = Record<string, string>;

type OrderSubmissionMode = "phone" | "online" | "both";
type FulfillmentMode = "delivery" | "pickup";
type StorefrontTheme =
  | "modern_market"
  | "boutique"
  | "auto_pro"
  | "minimal"
  | "premium"
  | "menu";
type AppearanceMode = "light" | "dark";
type ProductCardStyle = "standard" | "image_first" | "compact";
type CornerStyle = "rounded" | "soft" | "square";
type HeroLayout = "centered" | "split" | "immersive";
type StorefrontSection = "categories" | "catalog" | "story";

type StorefrontDesign = {
  storefrontTheme: StorefrontTheme;
  appearanceMode: AppearanceMode;
  productCardStyle: ProductCardStyle;
  cornerStyle: CornerStyle;
  heroLayout: HeroLayout;
  sectionOrder: StorefrontSection[];
  showPrices: boolean;
  showOrdering: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showStoreStory: boolean;
};

const defaultStorefrontDesign: StorefrontDesign = {
  storefrontTheme: "modern_market",
  appearanceMode: "light",
  productCardStyle: "standard",
  cornerStyle: "rounded",
  heroLayout: "centered",
  sectionOrder: ["categories", "catalog", "story"],
  showPrices: true,
  showOrdering: true,
  showPhone: true,
  showWhatsapp: true,
  showStoreStory: true,
};

const themeOptions: Array<{
  value: StorefrontTheme;
  name: string;
  nameAr: string;
  description: string;
}> = [
  { value: "modern_market", name: "Modern Market", nameAr: "السوق العصري", description: "Clean, bright, and product focused" },
  { value: "boutique", name: "Boutique", nameAr: "بوتيك", description: "Editorial presentation for fashion and beauty" },
  { value: "auto_pro", name: "Auto Pro", nameAr: "أوتو برو", description: "Bold industrial styling for parts and tools" },
  { value: "minimal", name: "Minimal", nameAr: "بسيط", description: "Quiet, fast, and distraction free" },
  { value: "premium", name: "Premium", nameAr: "فاخر", description: "Dark luxury styling with strong imagery" },
  { value: "menu", name: "Menu", nameAr: "قائمة", description: "Warm, friendly layout for food and bakeries" },
];


// DARIK_RETAILER_THEME_GALLERY_102
const storefrontThemeOptions = [
  { key: 'supermarket', name: 'Verde Market', vibe: 'Fresh / Refined / Welcoming', palette: ['#12372A', '#16A34A', '#F7FAF7'] },
  { key: 'restaurant', name: 'Ember', vibe: 'Warm / Bold / Dining', palette: ['#431407', '#EA580C', '#FFF9F3'] },
  { key: 'bakery', name: 'Patisserie', vibe: 'Elegant / Crafted / Inviting', palette: ['#2A1720', '#B83262', '#F8F0E2'] },
  { key: 'cafe', name: 'Roast & Oak', vibe: 'Rich / Modern / Cozy', palette: ['#211713', '#5F7A61', '#F3ECE4'] },
  { key: 'smoke_shop', name: 'Noir Brass', vibe: 'Dark / Premium / Distinctive', palette: ['#111315', '#B68A45', '#F3EFE8'] },
  { key: 'butcher', name: 'Heritage', vibe: 'Traditional / Confident / Crafted', palette: ['#721C24', '#2D2B2A', '#F8F3EB'] },
  { key: 'produce', name: 'Harvest', vibe: 'Fresh / Lively / Natural', palette: ['#228B45', '#F2B436', '#FBFFF7'] },
  { key: 'clothing', name: 'Editorial', vibe: 'Clean / Fashion-forward / Refined', palette: ['#111318', '#3157D8', '#F7F5F1'] },
  { key: 'shoes', name: 'Velocity', vibe: 'Energetic / Modern / Athletic', palette: ['#15171C', '#2457FF', '#F3F0E8'] },
  { key: 'jewelry', name: 'Aurelia', vibe: 'Refined / Elegant / Luxurious', palette: ['#17151C', '#C8A96B', '#F7F1E7'] },
  { key: 'cosmetics', name: 'Blush Studio', vibe: 'Soft / Modern / Beauty-led', palette: ['#5C3348', '#C17891', '#FCF9F8'] },
  { key: 'perfume', name: 'Velvet', vibe: 'Dark / Luxurious / Atmospheric', palette: ['#151113', '#C6A66A', '#50172A'] },
  { key: 'electronics', name: 'Pulse', vibe: 'Clean / Modern / Technical', palette: ['#0C1320', '#2563EB', '#F7FAFC'] },
  { key: 'computers', name: 'Core', vibe: 'Precise / Professional / Powerful', palette: ['#101318', '#635BFF', '#62D98B'] },
  { key: 'mobile_phones', name: 'Titanium', vibe: 'Sleek / Polished / Flagship', palette: ['#14161A', '#6D5DFC', '#F5F6F8'] },
  { key: 'furniture', name: 'Haven', vibe: 'Warm / Calm / Considered', palette: ['#6B4935', '#7D8B72', '#F5F0E8'] },
  { key: 'home_appliances', name: 'Lumin', vibe: 'Bright / Polished / Practical', palette: ['#21313C', '#27B9C6', '#F3F7FA'] },
  { key: 'home_decor', name: 'Terracotta', vibe: 'Artistic / Warm / Curated', palette: ['#3C312A', '#BE7652', '#F3ECE3'] },
  { key: 'auto_parts', name: 'Redline', vibe: 'Bold / Performance / Industrial', palette: ['#0F1216', '#E24F34', '#F6912D'] },
  { key: 'tires', name: 'Apex', vibe: 'Sharp / Energetic / Automotive', palette: ['#0D1012', '#B6FF3B', '#20262A'] },
  { key: 'hardware', name: 'Craft', vibe: 'Practical / Warm / Dependable', palette: ['#26352D', '#315F4D', '#D79D4A'] },
  { key: 'building_materials', name: 'Foundry', vibe: 'Architectural / Rugged / Grounded', palette: ['#2F3234', '#A65335', '#C9A773'] },
  { key: 'electrical_supplies', name: 'Voltage', vibe: 'Electric / Technical / Bold', palette: ['#171525', '#FFD43B', '#8E7DFF'] },
  { key: 'plumbing', name: 'Aquaform', vibe: 'Clean / Fresh / Professional', palette: ['#153A43', '#167A8B', '#B87333'] },
  { key: 'tools', name: 'Forge', vibe: 'Rugged / Industrial / Powerful', palette: ['#20221D', '#F29934', '#A7B36E'] },
  { key: 'pharmacy', name: 'Clarity', vibe: 'Clean / Trusted / Clinical', palette: ['#16324A', '#2867C7', '#55B9A8'] },
  { key: 'pet_supplies', name: 'Companion', vibe: 'Friendly / Warm / Approachable', palette: ['#4A3327', '#3F7FA6', '#C78155'] },
  { key: 'flowers', name: 'Botanica', vibe: 'Natural / Elegant / Romantic', palette: ['#203C32', '#A85068', '#58765C'] },
  { key: 'gifts', name: 'Celebration', vibe: 'Polished / Joyful / Expressive', palette: ['#3A264A', '#7447B9', '#E06F72'] },
  { key: 'toys', name: 'Playhouse', vibe: 'Bright / Fun / Energetic', palette: ['#17354A', '#F5C542', '#E84F5F'] },
  { key: 'books_stationery', name: 'Manuscript', vibe: 'Literary / Thoughtful / Classic', palette: ['#25364A', '#8A3D4D', '#E5DAC7'] },
  { key: 'sports', name: 'Momentum', vibe: 'Athletic / Focused / Dynamic', palette: ['#0B2A32', '#28D493', '#F1CF62'] },
] as const;function normalizeSectionOrder(value: unknown): StorefrontSection[] {
  const allowed: StorefrontSection[] = ["categories", "catalog", "story"];
  const input = Array.isArray(value) ? value : [];
  const next = input.filter(
    (item, index): item is StorefrontSection =>
      allowed.includes(item as StorefrontSection) && input.indexOf(item) === index
  );
  for (const item of allowed) if (!next.includes(item)) next.push(item);
  return next;
}

function normalizeDesignDraft(value: unknown): Partial<StorefrontDesign> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const record = value as Record<string, unknown>;
  return {
    storefrontTheme: themeOptions.some((item) => item.value === record.storefrontTheme)
      ? (record.storefrontTheme as StorefrontTheme)
      : undefined,
    appearanceMode: record.appearanceMode === "dark" || record.appearanceMode === "light"
      ? record.appearanceMode
      : undefined,
    productCardStyle: ["standard", "image_first", "compact"].includes(String(record.productCardStyle))
      ? (record.productCardStyle as ProductCardStyle)
      : undefined,
    cornerStyle: ["rounded", "soft", "square"].includes(String(record.cornerStyle))
      ? (record.cornerStyle as CornerStyle)
      : undefined,
    heroLayout: ["centered", "split", "immersive"].includes(String(record.heroLayout))
      ? (record.heroLayout as HeroLayout)
      : undefined,
    sectionOrder: normalizeSectionOrder(record.sectionOrder),
    showPrices: typeof record.showPrices === "boolean" ? record.showPrices : undefined,
    showOrdering: typeof record.showOrdering === "boolean" ? record.showOrdering : undefined,
    showPhone: typeof record.showPhone === "boolean" ? record.showPhone : undefined,
    showWhatsapp: typeof record.showWhatsapp === "boolean" ? record.showWhatsapp : undefined,
    showStoreStory: typeof record.showStoreStory === "boolean" ? record.showStoreStory : undefined,
  };
}

function draftDesignString(value: unknown, key: string, fallback: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const candidate = String((value as Record<string, unknown>)[key] ?? "").trim();
  return candidate || fallback;
}

function designFromForm(form: StorefrontForm): StorefrontDesign {
  return {
    storefrontTheme: form.storefrontTheme,
    appearanceMode: form.appearanceMode,
    productCardStyle: form.productCardStyle,
    cornerStyle: form.cornerStyle,
    heroLayout: form.heroLayout,
    sectionOrder: normalizeSectionOrder(form.sectionOrder),
    showPrices: form.showPrices,
    showOrdering: form.showOrdering,
    showPhone: form.showPhone,
    showWhatsapp: form.showWhatsapp,
    showStoreStory: form.showStoreStory,
  };
}

type StorefrontForm = {
  slug: string;
  displayName: string;
  displayNameAr: string;
  tagline: string;
  taglineAr: string;
  logoUrl: string;
  heroImageUrl: string;
  phone: string;
  whatsapp: string;
  publicEmail: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  addressText: string;
  addressTextAr: string;
  aboutText: string;
  aboutTextAr: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  deliveryFee: string;
  minimumOrder: string;
  deliveryRadiusKm: string;
  estimatedDeliveryMinutes: string;
  fulfillmentMode: FulfillmentMode;
  orderSubmissionMode: OrderSubmissionMode;
  acceptCash: boolean;
  acceptCliq: boolean;
  cliqAccountName: string;
  cliqIdentifier: string;
  customLinks: CustomLink[];
  customInformation: CustomInformation[];
  operatingHours: OperatingHours;
  operatingHoursAr: OperatingHours;
  storefrontTheme: StorefrontTheme;
  appearanceMode: AppearanceMode;
  productCardStyle: ProductCardStyle;
  cornerStyle: CornerStyle;
  heroLayout: HeroLayout;
  sectionOrder: StorefrontSection[];
  showPrices: boolean;
  showOrdering: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showStoreStory: boolean;
};

const operatingDays = [
  ["sunday", "Sunday", "الأحد"],
  ["monday", "Monday", "الاثنين"],
  ["tuesday", "Tuesday", "الثلاثاء"],
  ["wednesday", "Wednesday", "الأربعاء"],
  ["thursday", "Thursday", "الخميس"],
  ["friday", "Friday", "الجمعة"],
  ["saturday", "Saturday", "السبت"],
] as const;

const defaultOperatingHours: OperatingHours = Object.fromEntries(
  operatingDays.map(([key]) => [key, ""])
);

function normalizeCustomLinks(value: unknown): CustomLink[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const primaryLabel = String(record.label ?? "").trim();
      const legacyArabicLabel = String(
        record.label_ar ?? record.labelAr ?? ""
      ).trim();

      return {
        label: primaryLabel || legacyArabicLabel,
        labelAr: "",
        url: String(record.url ?? "").trim(),
      };
    })
    .filter(
      (item): item is CustomLink =>
        Boolean(item?.label || item?.url)
    );
}

function normalizeCustomInformation(value: unknown): CustomInformation[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const primaryLabel = String(record.label ?? "").trim();
      const legacyArabicLabel = String(
        record.label_ar ?? record.labelAr ?? ""
      ).trim();
      const primaryValue = String(record.value ?? "").trim();
      const legacyArabicValue = String(
        record.value_ar ?? record.valueAr ?? ""
      ).trim();

      return {
        label: primaryLabel || legacyArabicLabel,
        labelAr: "",
        value: primaryValue || legacyArabicValue,
        valueAr: "",
      };
    })
    .filter(
      (item): item is CustomInformation =>
        Boolean(item?.label || item?.value)
    );
}

function normalizeOperatingHours(value: unknown): OperatingHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaultOperatingHours };
  }

  const source = value as Record<string, unknown>;

  return Object.fromEntries(
    operatingDays.map(([key]) => [key, String(source[key] ?? "")])
  );
}

function mergeLegacyOperatingHours(
  primaryValue: unknown,
  arabicValue: unknown
): OperatingHours {
  const primary = normalizeOperatingHours(primaryValue);
  const arabic = normalizeOperatingHours(arabicValue);

  return Object.fromEntries(
    operatingDays.map(([key]) => [
      key,
      primary[key]?.trim() || arabic[key]?.trim() || "",
    ])
  );
}

function safeAssetFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type StorefrontSettings = {
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
  custom_links: CustomLink[] | null;
  custom_information: CustomInformation[] | null;
  operating_hours: OperatingHours | null;
  operating_hours_ar: OperatingHours | null;
  primary_color: string;
  accent_color: string;
  background_color: string;
  storefront_status: string;
  direct_storefront_enabled: boolean;
  marketplace_listing_enabled: boolean;
  is_accepting_orders: boolean;
  minimum_order: number | string;
  delivery_fee: number | string;
  delivery_radius_km: number | string | null;
  estimated_delivery_minutes: number | null;
  delivery_enabled: boolean | null;
  pickup_enabled: boolean | null;
  order_submission_mode: OrderSubmissionMode;
  cash_on_delivery_enabled: boolean;
  cliq_enabled: boolean;
  cliq_account_name: string | null;
  cliq_payment_identifier: string | null;
  activation_status?: string | null;
  activation_plan?: string | null;
  activation_expires_at?: string | null;
  storefront_theme?: StorefrontTheme | null;
  appearance_mode?: AppearanceMode | null;
  product_card_style?: ProductCardStyle | null;
  corner_style?: CornerStyle | null;
  hero_layout?: HeroLayout | null;
  section_order?: StorefrontSection[] | null;
  show_prices?: boolean | null;
  show_ordering?: boolean | null;
  show_phone?: boolean | null;
  show_whatsapp?: boolean | null;
  show_store_story?: boolean | null;
  design_draft?: Partial<StorefrontDesign> | null;
  design_published_at?: string | null;
  updated_at?: string | null;
};

type RecentOrder = {
  id: string;
  order_number: string | null;
  customer_name: string;
  total: number | string;
  order_status: string;
  created_at: string;
};

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function cleanSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeOptionalWebUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function formatSupabaseSaveError(error: {
  message: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
}) {
  return [error.message, error.details, error.hint, error.code]
    .filter(Boolean)
    .join(" | ");
}

function storefrontDraftKey(retailerId: string) {
  return `darik-direct-storefront-draft:${retailerId}`;
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

const storefrontTypographyFontGroups = [
  {
    label: 'Theme',
    options: [
      { key: "theme" as StorefrontTypographyFontKey, label: 'Theme default' },
    ],
  },
  {
    label: 'Elegant & Luxury',
    options: [
      { key: "playfair" as StorefrontTypographyFontKey, label: 'Playfair Display' },
      { key: "cormorant" as StorefrontTypographyFontKey, label: 'Cormorant Garamond' },
      { key: "dm_serif" as StorefrontTypographyFontKey, label: 'DM Serif Display' },
      { key: "bodoni_moda" as StorefrontTypographyFontKey, label: 'Bodoni Moda' },
      { key: "prata" as StorefrontTypographyFontKey, label: 'Prata' },
      { key: "cinzel" as StorefrontTypographyFontKey, label: 'Cinzel' },
      { key: "marcellus" as StorefrontTypographyFontKey, label: 'Marcellus' },
      { key: "libre_baskerville" as StorefrontTypographyFontKey, label: 'Libre Baskerville' },
      { key: "lora" as StorefrontTypographyFontKey, label: 'Lora' },
      { key: "eb_garamond" as StorefrontTypographyFontKey, label: 'EB Garamond' },
      { key: "fraunces" as StorefrontTypographyFontKey, label: 'Fraunces' },
      { key: "spectral" as StorefrontTypographyFontKey, label: 'Spectral' },
      { key: "crimson_pro" as StorefrontTypographyFontKey, label: 'Crimson Pro' },
      { key: "yeseva" as StorefrontTypographyFontKey, label: 'Yeseva One' },
      { key: "abril" as StorefrontTypographyFontKey, label: 'Abril Fatface' },
    ],
  },
  {
    label: 'Modern & Clean',
    options: [
      { key: "inter" as StorefrontTypographyFontKey, label: 'Inter' },
      { key: "manrope" as StorefrontTypographyFontKey, label: 'Manrope' },
      { key: "montserrat" as StorefrontTypographyFontKey, label: 'Montserrat' },
      { key: "poppins" as StorefrontTypographyFontKey, label: 'Poppins' },
      { key: "raleway" as StorefrontTypographyFontKey, label: 'Raleway' },
      { key: "outfit" as StorefrontTypographyFontKey, label: 'Outfit' },
      { key: "plus_jakarta" as StorefrontTypographyFontKey, label: 'Plus Jakarta Sans' },
      { key: "urbanist" as StorefrontTypographyFontKey, label: 'Urbanist' },
      { key: "space_grotesk" as StorefrontTypographyFontKey, label: 'Space Grotesk' },
      { key: "work_sans" as StorefrontTypographyFontKey, label: 'Work Sans' },
      { key: "nunito_sans" as StorefrontTypographyFontKey, label: 'Nunito Sans' },
      { key: "roboto" as StorefrontTypographyFontKey, label: 'Roboto' },
      { key: "quicksand" as StorefrontTypographyFontKey, label: 'Quicksand' },
      { key: "josefin" as StorefrontTypographyFontKey, label: 'Josefin Sans' },
      { key: "sora" as StorefrontTypographyFontKey, label: 'Sora' },
    ],
  },
  {
    label: 'Bold & Editorial',
    options: [
      { key: "oswald" as StorefrontTypographyFontKey, label: 'Oswald' },
      { key: "bebas" as StorefrontTypographyFontKey, label: 'Bebas Neue' },
      { key: "anton" as StorefrontTypographyFontKey, label: 'Anton' },
      { key: "barlow_condensed" as StorefrontTypographyFontKey, label: 'Barlow Condensed' },
      { key: "archivo_black" as StorefrontTypographyFontKey, label: 'Archivo Black' },
      { key: "league_spartan" as StorefrontTypographyFontKey, label: 'League Spartan' },
    ],
  },
  {
    label: 'Handwritten & Script',
    options: [
      { key: "dancing_script" as StorefrontTypographyFontKey, label: 'Dancing Script' },
      { key: "great_vibes" as StorefrontTypographyFontKey, label: 'Great Vibes' },
      { key: "allura" as StorefrontTypographyFontKey, label: 'Allura' },
      { key: "sacramento" as StorefrontTypographyFontKey, label: 'Sacramento' },
      { key: "parisienne" as StorefrontTypographyFontKey, label: 'Parisienne' },
      { key: "caveat" as StorefrontTypographyFontKey, label: 'Caveat' },
      { key: "pacifico" as StorefrontTypographyFontKey, label: 'Pacifico' },
    ],
  },
  {
    label: 'Arabic & Bilingual',
    options: [
      { key: "cairo" as StorefrontTypographyFontKey, label: 'Cairo' },
      { key: "tajawal" as StorefrontTypographyFontKey, label: 'Tajawal' },
      { key: "almarai" as StorefrontTypographyFontKey, label: 'Almarai' },
      { key: "changa" as StorefrontTypographyFontKey, label: 'Changa' },
      { key: "el_messiri" as StorefrontTypographyFontKey, label: 'El Messiri' },
      { key: "amiri" as StorefrontTypographyFontKey, label: 'Amiri' },
      { key: "noto_kufi_ar" as StorefrontTypographyFontKey, label: 'Noto Kufi Arabic' },
      { key: "noto_naskh_ar" as StorefrontTypographyFontKey, label: 'Noto Naskh Arabic' },
      { key: "ibm_plex_sans_ar" as StorefrontTypographyFontKey, label: 'IBM Plex Sans Arabic' },
      { key: "reem_kufi" as StorefrontTypographyFontKey, label: 'Reem Kufi' },
      { key: "aref_ruqaa" as StorefrontTypographyFontKey, label: 'Aref Ruqaa' },
      { key: "lateef" as StorefrontTypographyFontKey, label: 'Lateef' },
      { key: "scheherazade_new" as StorefrontTypographyFontKey, label: 'Scheherazade New' },
      { key: "markazi_text" as StorefrontTypographyFontKey, label: 'Markazi Text' },
      { key: "lemonada" as StorefrontTypographyFontKey, label: 'Lemonada' },
    ],
  },
  {
    label: 'Classic & System',
    options: [
      { key: "segoe" as StorefrontTypographyFontKey, label: 'Segoe UI' },
      { key: "arial" as StorefrontTypographyFontKey, label: 'Arial' },
      { key: "verdana" as StorefrontTypographyFontKey, label: 'Verdana' },
      { key: "tahoma" as StorefrontTypographyFontKey, label: 'Tahoma' },
      { key: "trebuchet" as StorefrontTypographyFontKey, label: 'Trebuchet MS' },
      { key: "georgia" as StorefrontTypographyFontKey, label: 'Georgia' },
      { key: "times" as StorefrontTypographyFontKey, label: 'Times New Roman' },
      { key: "palatino" as StorefrontTypographyFontKey, label: 'Palatino' },
      { key: "garamond" as StorefrontTypographyFontKey, label: 'Garamond' },
      { key: "courier" as StorefrontTypographyFontKey, label: 'Courier New' },
      { key: "impact" as StorefrontTypographyFontKey, label: 'Impact' },
    ],
  },
];

const storefrontTypographyFontOptions = storefrontTypographyFontGroups.flatMap(
  (group) => group.options
);

const storefrontTypographySizeOptions = [
  0,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  28,
  32,
  36,
  42,
  48,
  56,
  64,
  72,
  80,
  96,
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
  return storefrontTypographyFontOptions.some(
    (option) => option.key === String(value || "")
  );
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

function storefrontTypographyPreviewStyle(
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

// DARIK_FIRST_TIME_STOREFRONT_WIZARD_109
type DarikStorefrontSetupStep109 =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type DarikDeliveryZone109 = {
  id: string;
  maxKm: string;
  deliveryFeeJod: string;
  minimumOrderJod: string;
};

// DARIK_CONFIRMED_DELIVERY_LOCATION_PASSWORD_LOCK_112
type DarikDeliveryLocation112 = {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  source: "gps" | "google_search";
  confirmedAt: string;
};

type DarikGooglePlacePrediction112 = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

function normalizeDarikDeliveryLocation112(
  value: unknown
): DarikDeliveryLocation112 | null {
  const row =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const address = String(row.address ?? "").trim();
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);

  if (
    !address ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    address,
    latitude,
    longitude,
    placeId: String(row.place_id ?? "").trim(),
    source:
      String(row.source ?? "").toLowerCase() === "gps"
        ? "gps"
        : "google_search",
    confirmedAt: String(row.confirmed_at ?? "").trim(),
  };
}

function darikDeliveryLocationMapUrl112(
  location: DarikDeliveryLocation112
) {
  const point = `${location.latitude},${location.longitude}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(
    point
  )}&z=17&output=embed`;
}

const darikStorefrontSetupSteps109: Array<{
  step: DarikStorefrontSetupStep109;
  en: string;
  ar: string;
  optional?: boolean;
}> = [
  { step: 1, en: "Theme", ar: "القالب" },
  { step: 2, en: "Logo & cover", ar: "الشعار والواجهة" },
  { step: 3, en: "Name & link", ar: "الاسم والرابط" },
  { step: 4, en: "Fonts", ar: "الخطوط" },
  { step: 5, en: "Contact", ar: "التواصل" },
  { step: 6, en: "About & hours", ar: "عن المتجر والساعات" },
  { step: 7, en: "Custom links", ar: "روابط إضافية", optional: true },
  { step: 8, en: "Store info", ar: "معلومات إضافية", optional: true },
  { step: 9, en: "Delivery", ar: "التوصيل" },
  { step: 10, en: "Payments", ar: "الدفع" },
  { step: 11, en: "Features", ar: "الخصائص" },
];

const darikStorefrontTimeOptions109 = Array.from(
  { length: 48 },
  (_, index) => {
    const totalMinutes = index * 30;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  }
);

// DARIK_BUSINESS_HOURS_TIME_SELECTION_FIX_110
function parseDarikOperatingHours109(rawValue: string | null | undefined) {
  const raw = String(rawValue ?? "").trim();

  if (!raw) {
    return { open: "", close: "", closed: false };
  }

  if (raw.toLowerCase() === "closed") {
    return { open: "Closed", close: "", closed: true };
  }

  const normalizeTime109 = (value: string) =>
    value.toUpperCase().replace(/\s+/g, " ").trim();

  /*
    While the retailer is choosing business hours, the first dropdown saves
    an opening time before the closing time exists. That partial value is
    intentional and must remain visible on the next render.
  */
  const singleTimeMatch = raw.match(
    /^(\d{1,2}:\d{2}\s*(?:AM|PM))$/i
  );

  if (singleTimeMatch) {
    return {
      open: normalizeTime109(singleTimeMatch[1]),
      close: "",
      closed: false,
    };
  }

  const match = raw.match(
    /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*(?:-|–|—)\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i
  );

  if (!match) {
    return { open: "", close: "", closed: false };
  }

  return {
    open: normalizeTime109(match[1]),
    close: normalizeTime109(match[2]),
    closed: false,
  };
}

function normalizeDarikDeliveryZones109(value: unknown): DarikDeliveryZone109[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const row =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};

      return {
        id: `saved-${index}-${String(row.max_km ?? "")}`,
        maxKm: String(row.max_km ?? ""),
        deliveryFeeJod: String(row.delivery_fee_jod ?? "0"),
        minimumOrderJod:
          row.minimum_order_jod === null ||
          row.minimum_order_jod === undefined
            ? ""
            : String(row.minimum_order_jod),
      };
    })
    .filter((zone) => zone.maxKm.trim() !== "");
}

// DARIK_CLICK_PREVIEW_POSITIONING_145
type StorefrontPositionKey145 =
  | "display_name"
  | "display_name_ar"
  | "tagline"
  | "tagline_ar"
  | "shop";

type StorefrontPositionDevice145 = "desktop" | "mobile";

type StorefrontPositionPoint145 = {
  x: number;
  y: number;
};

type StorefrontPositionElement145 = {
  desktop: StorefrontPositionPoint145;
  mobile: StorefrontPositionPoint145;
};

type StorefrontContentPositioning145 = Record<
  StorefrontPositionKey145,
  StorefrontPositionElement145
>;

const storefrontPositionKeys145: StorefrontPositionKey145[] = [
  "display_name",
  "display_name_ar",
  "tagline",
  "tagline_ar",
  "shop",
];

const storefrontPositionLabels145: Record<
  StorefrontPositionKey145,
  string
> = {
  display_name: "Customer-facing store name",
  display_name_ar: "Arabic store name",
  tagline: "Store tagline",
  tagline_ar: "Arabic tagline",
  shop: "Shop tab",
};

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

function isStorefrontPositionKey145(
  value: unknown
): value is StorefrontPositionKey145 {
  return storefrontPositionKeys145.includes(
    String(value || "") as StorefrontPositionKey145
  );
}

export default function DarikDirectStorefrontSettingsPage() {
  useDarikTypographyFontLibrary105V5();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [storefront, setStorefront] = useState<StorefrontSettings | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [directOrderCount, setDirectOrderCount] = useState(0);
  const [directRevenue, setDirectRevenue] = useState(0);
  const [loadingContext, setLoadingContext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locationLocked, setLocationLocked] = useState(false);
  const [locatingStore, setLocatingStore] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "waiting" | "saving" | "saved" | "error"
  >("idle");
  const [showDesktopLocationHint, setShowDesktopLocationHint] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState<"logo" | "hero" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedThemeField, setSelectedThemeField] = useState("");
  const [themeSaveState, setThemeSaveState] = useState<
    "idle" | "loading" | "saving" | "saved" | "error"
  >("idle");
  const [slugState, setSlugState] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [setupForm, setSetupForm] = useState<StorefrontForm>({
    slug: "",
    displayName: "",
    displayNameAr: "",
    tagline: "",
    taglineAr: "",
    logoUrl: "",
    heroImageUrl: "",
    phone: "",
    whatsapp: "",
    publicEmail: "",
    websiteUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    addressText: "",
    addressTextAr: "",
    aboutText: "",
    aboutTextAr: "",
    primaryColor: "#111827",
    accentColor: "#2563EB",
    backgroundColor: "#F8FAFC",
    deliveryFee: "2.00",
    minimumOrder: "0.00",
    deliveryRadiusKm: "",
    estimatedDeliveryMinutes: "45",
    fulfillmentMode: "delivery",
    orderSubmissionMode: "phone",
    acceptCash: true,
    acceptCliq: false,
    cliqAccountName: "",
    cliqIdentifier: "",
    customLinks: [],
    customInformation: [],
    operatingHours: { ...defaultOperatingHours },
    operatingHoursAr: { ...defaultOperatingHours },
    ...defaultStorefrontDesign,
  });

  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const liveBuilderPreviewRef = useRef<HTMLIFrameElement | null>(null);

  const [storefrontContentPositioning145, setStorefrontContentPositioning145] =
    useState<StorefrontContentPositioning145>(() =>
      storefrontDefaultContentPositioning145()
    );
  const [selectedPreviewPosition145, setSelectedPreviewPosition145] =
    useState<StorefrontPositionKey145 | null>(null);
  const [previewPositionDevice145, setPreviewPositionDevice145] =
    useState<StorefrontPositionDevice145>("desktop");
  const [previewPositionSaveState145, setPreviewPositionSaveState145] =
    useState<"idle" | "waiting" | "saving" | "saved" | "error">("idle");
  const positioningDirtyRef145 = useRef(false);
  const positioningRevisionRef145 = useRef(0);

  // DARIK_PREVIEW_CONTROLS_CLEANUP_107
  const [liveBuilderPreviewOpen, setLiveBuilderPreviewOpen] = useState(true);
  // DARIK_THEME_STEP_GALLERY_STABLE_AUTO_PREVIEW_138: iframe theme changes only after a completed theme save.
  const [liveBuilderPreviewTheme138, setLiveBuilderPreviewTheme138] = useState("");
  const [realPrivatePreviewKey143, setRealPrivatePreviewKey143] = useState("");

  useEffect(() => {
    const bytes143 = new Uint8Array(32);
    window.crypto.getRandomValues(bytes143);
    setRealPrivatePreviewKey143(
      Array.from(bytes143, (value) => value.toString(16).padStart(2, "0")).join("")
    );
  }, []);
  // DARIK_DASHBOARD_FULLSCREEN_PREVIEW_STEP_SCROLL_FIX_111
  const [liveBuilderPreviewExpanded111, setLiveBuilderPreviewExpanded111] = useState(false);
  const storefrontSetupLastVisibleStep111 = useRef<number>(0);
  // DARIK_INDEPENDENT_STOREFRONT_TYPOGRAPHY_105
  const [storefrontTypographyDraft, setStorefrontTypographyDraft] =
    useState<StorefrontTypographyState>(() => storefrontTypographyDefaultState());
  const [typographyDirty, setTypographyDirty] = useState(false);
  const [typographySaveState, setTypographySaveState] = useState<
    "idle" | "loading" | "waiting" | "saving" | "saved" | "error"
  >("idle");
  const typographyDirtyRef = useRef(false);

  function updateStorefrontTypography(
    key: StorefrontTypographyKey,
    patch: Partial<StorefrontTypographySetting>
  ) {
    setStorefrontTypographyDraft((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...patch,
      },
    }));
    typographyDirtyRef.current = true;
    setTypographyDirty(true);
    setTypographySaveState("waiting");
  }

  function resetStorefrontTypography(key: StorefrontTypographyKey) {
    updateStorefrontTypography(key, { font: "theme", size: 0 });
  }




  const selectedThemeOption =
    storefrontThemeOptions.find((theme) => theme.key === selectedThemeField) ?? null;

  function liveBuilderDraftValue(...keys: string[]) {
    const draft = setupForm as unknown as Record<string, unknown>;
    for (const key of keys) {
      const value = draft[key];
      if (value !== undefined && value !== null) return value;
    }
    return undefined;
  }

  function liveBuilderDraftText(...keys: string[]) {
    const value = liveBuilderDraftValue(...keys);
    return typeof value === "string" ? value : "";
  }

  function getLiveBuilderDraftPayload() {
    return {
      display_name: liveBuilderDraftValue("displayName", "display_name"),
      display_name_ar: liveBuilderDraftValue("displayNameAr", "display_name_ar"),
      tagline: liveBuilderDraftValue("tagline"),
      tagline_ar: liveBuilderDraftValue("taglineAr", "tagline_ar"),
      direct_typography: storefrontTypographyDraft,
      direct_content_positioning: storefrontContentPositioning145,
      logo_url: liveBuilderDraftValue("logoUrl", "logo_url"),
      hero_image_url: liveBuilderDraftValue("heroImageUrl", "hero_image_url"),
      business_phone: liveBuilderDraftValue("phone", "businessPhone", "business_phone"),
      whatsapp_number: liveBuilderDraftValue("whatsapp", "whatsappNumber", "whatsapp_number"),
      public_email: liveBuilderDraftValue("publicEmail", "public_email"),
      website_url: liveBuilderDraftValue("websiteUrl", "website_url"),
      facebook_url: liveBuilderDraftValue("facebookUrl", "facebook_url"),
      instagram_url: liveBuilderDraftValue("instagramUrl", "instagram_url"),
      address_text: liveBuilderDraftValue("addressText", "address_text"),
      address_text_ar: liveBuilderDraftValue("addressTextAr", "address_text_ar"),
      about_text: liveBuilderDraftValue("aboutText", "about_text"),
      about_text_ar: liveBuilderDraftValue("aboutTextAr", "about_text_ar"),
      operating_hours: liveBuilderDraftValue("operatingHours", "operating_hours"),
      minimum_order: liveBuilderDraftValue("minimumOrder", "minimum_order"),
      delivery_fee: liveBuilderDraftValue("deliveryFee", "delivery_fee"),
      delivery_radius_km: liveBuilderDraftValue("deliveryRadiusKm", "delivery_radius_km"),
      estimated_delivery_minutes: liveBuilderDraftValue(
        "estimatedDeliveryMinutes",
        "estimated_delivery_minutes"
      ),
      show_prices: liveBuilderDraftValue("showPrices", "show_prices"),
      show_ordering: liveBuilderDraftValue("showOrdering", "show_ordering"),
      show_phone: liveBuilderDraftValue("showPhone", "show_phone"),
      show_whatsapp: liveBuilderDraftValue("showWhatsapp", "show_whatsapp"),
      show_store_story: liveBuilderDraftValue("showStoreStory", "show_store_story"),
      pickup_enabled: liveBuilderDraftValue("pickupEnabled", "pickup_enabled"),
      is_accepting_orders: liveBuilderDraftValue(
        "isAcceptingOrders",
        "is_accepting_orders"
      ),
    };
  }

  function pushLiveBuilderDraft() {
    const target = liveBuilderPreviewRef.current?.contentWindow;
    if (!target || !selectedThemeField) return;

    target.postMessage(
      {
        type: "DARIK_STOREFRONT_BUILDER_DRAFT_103",
        payload: getLiveBuilderDraftPayload(),
      },
      window.location.origin
    );
  }

  useEffect(() => {
    if (!selectedThemeField) return;

    const animation = window.requestAnimationFrame(() => {
      pushLiveBuilderDraft();
    });

    return () => window.cancelAnimationFrame(animation);
  }, [setupForm, storefrontTypographyDraft, selectedThemeField, storefront?.slug]);

  useEffect(() => {
    function handleBuilderReady(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "DARIK_STOREFRONT_BUILDER_READY_103") return;
      pushLiveBuilderDraft();
    }

    window.addEventListener("message", handleBuilderReady);
    return () => window.removeEventListener("message", handleBuilderReady);
  }, [setupForm, storefrontTypographyDraft, storefrontContentPositioning145, selectedThemeField, storefront?.slug]);

  useEffect(() => {
    positioningDirtyRef145.current = false;
    setStorefrontContentPositioning145(
      normalizeStorefrontContentPositioning145(
        (
          storefront as unknown as {
            direct_content_positioning?: unknown;
          } | null
        )?.direct_content_positioning
      )
    );
    setPreviewPositionSaveState145("idle");
  }, [storefront?.id]);

  function updatePreviewPosition145(
    key: StorefrontPositionKey145,
    device: StorefrontPositionDevice145,
    nextX: number,
    nextY: number
  ) {
    positioningDirtyRef145.current = true;
    positioningRevisionRef145.current += 1;
    setPreviewPositionSaveState145(storefront?.id ? "waiting" : "idle");

    setStorefrontContentPositioning145((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [device]: {
          x: clampStorefrontPosition145(nextX),
          y: clampStorefrontPosition145(nextY),
        },
      },
    }));
  }

  function nudgePreviewPosition145(deltaX: number, deltaY: number) {
    if (!selectedPreviewPosition145) return;

    const point =
      storefrontContentPositioning145[selectedPreviewPosition145][
        previewPositionDevice145
      ];

    updatePreviewPosition145(
      selectedPreviewPosition145,
      previewPositionDevice145,
      point.x + deltaX,
      point.y + deltaY
    );
  }

  function resetSelectedPreviewPosition145() {
    if (!selectedPreviewPosition145) return;

    updatePreviewPosition145(
      selectedPreviewPosition145,
      previewPositionDevice145,
      0,
      0
    );
  }

  function resetAllPreviewPositions145() {
    positioningDirtyRef145.current = true;
    positioningRevisionRef145.current += 1;
    setPreviewPositionSaveState145(storefront?.id ? "waiting" : "idle");
    setStorefrontContentPositioning145(
      storefrontDefaultContentPositioning145()
    );
  }

  useEffect(() => {
    if (!storefront?.id || !positioningDirtyRef145.current) return;

    const revision = positioningRevisionRef145.current;
    const snapshot = storefrontContentPositioning145;

    const timer = window.setTimeout(() => {
      void (async () => {
        setPreviewPositionSaveState145("saving");

        const result = await supabase
          .from("retailer_storefronts")
          .update({
            direct_content_positioning: snapshot,
          })
          .eq("id", storefront.id)
          .select("id,direct_content_positioning")
          .single();

        if (revision !== positioningRevisionRef145.current) return;

        if (result.error) {
          setPreviewPositionSaveState145("error");
          return;
        }

        positioningDirtyRef145.current = false;
        setPreviewPositionSaveState145("saved");
      })();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [storefrontContentPositioning145, storefront?.id]);

  // DARIK_DASHBOARD_ONLY_DRAG_PROOF_150A
  // DARIK_LIVE_IFRAME_BINDING_FIX_150B
  // Dashboard-only drag proof.
  // No DB writes and no app/[slug] edits.
  useEffect(() => {
    if (!liveBuilderPreviewOpen) return;

    let iframe150A: HTMLIFrameElement | null = null;
    let boundIframe150B: HTMLIFrameElement | null = null;
    let detachPreview150A = () => {};

    function attachPreview150A() {
      detachPreview150A();

      const activeIframe150B = iframe150A;
      if (!activeIframe150B) return;

      let document150A: Document | null = null;
      let window150A: Window | null = null;

      try {
        document150A = activeIframe150B.contentDocument;
        window150A = activeIframe150B.contentWindow;
      } catch {
        document150A = null;
        window150A = null;
      }

      if (!document150A || !window150A) return;

      const originalTranslate150A =
        new Map<Element, string>();

      let candidate150A:
        | {
            target: Element;
            pointerId: number;
            pointerType: string;
            startX: number;
            startY: number;
            baseX: number;
            baseY: number;
            originalOutline: string;
            originalOutlineOffset: string;
            originalCursor: string;
            originalUserSelect: string;
            originalTouchAction: string;
          }
        | null = null;

      let dragging150A = false;
      let holdTimer150A = 0;
      let blockClickTarget150A: Element | null = null;
      let blockClickUntil150A = 0;

      const old145Neutralizer150A =
        document150A.createElement("style");

      old145Neutralizer150A.id =
        "darik-old-145-neutralizer-150a";

      old145Neutralizer150A.textContent = `
        [data-darik-position-builder145="true"]
          [class*="builderPositionTarget145"] {
          cursor: inherit !important;
          outline: none !important;
          box-shadow: none !important;
        }

        [data-darik-position-builder145="true"]
          [class*="builderPositionSelected145"] {
          outline: none !important;
          box-shadow: none !important;
        }

        [data-darik-dragging150a="true"] {
          outline: 2px solid rgba(2, 132, 199, .95) !important;
          outline-offset: 4px !important;
          cursor: grabbing !important;
          user-select: none !important;
          -webkit-user-select: none !important;
        }
      `;

      document150A.head?.appendChild(
        old145Neutralizer150A
      );

      function clearHold150A() {
        if (!holdTimer150A) return;

        window150A.clearTimeout(holdTimer150A);
        holdTimer150A = 0;
      }

      function parseTranslate150A(value150A: string) {
        const normalized150A = String(value150A || "").trim();

        if (!normalized150A || normalized150A === "none") {
          return { x: 0, y: 0 };
        }

        const values150A =
          normalized150A.match(/-?[0-9]+(?:\.[0-9]+)?/g) ??
          [];

        return {
          x: Number(values150A[0] ?? 0) || 0,
          y: Number(values150A[1] ?? 0) || 0,
        };
      }

      function chooseTarget150A(
        rawTarget150A: EventTarget | null
      ) {
        const rawElement150A = rawTarget150A as Element | null;

        if (
          !rawElement150A ||
          rawElement150A.nodeType !== 1
        ) {
          return null;
        }

        const root150A = document150A.querySelector(
          "[data-darik-position-builder145]"
        );

        if (!root150A || !root150A.contains(rawElement150A)) {
          return null;
        }

        const semantic150A = rawElement150A.closest(
          "button, a, img, video, h1, h2, h3, h4, p, li, nav, section, article, header, footer"
        );

        const chosen150A =
          semantic150A &&
          root150A.contains(semantic150A)
            ? semantic150A
            : rawElement150A;

        if (chosen150A === root150A) return null;

        const tag150A = chosen150A.tagName.toLowerCase();

        if (
          tag150A === "html" ||
          tag150A === "body" ||
          tag150A === "script" ||
          tag150A === "style"
        ) {
          return null;
        }

        return chosen150A;
      }

      function restoreCandidateDecoration150A() {
        if (!candidate150A) return;

        const style150A =
          (candidate150A.target as HTMLElement).style;

        style150A.outline =
          candidate150A.originalOutline;
        style150A.outlineOffset =
          candidate150A.originalOutlineOffset;
        style150A.cursor =
          candidate150A.originalCursor;
        style150A.userSelect =
          candidate150A.originalUserSelect;
        style150A.touchAction =
          candidate150A.originalTouchAction;

        candidate150A.target.removeAttribute(
          "data-darik-dragging150a"
        );
      }

      function beginDrag150A() {
        if (!candidate150A || dragging150A) return;

        clearHold150A();
        dragging150A = true;

        const style150A =
          (candidate150A.target as HTMLElement).style;

        style150A.cursor = "grabbing";
        style150A.userSelect = "none";

        if (candidate150A.pointerType === "touch") {
          style150A.touchAction = "none";
        }

        candidate150A.target.setAttribute(
          "data-darik-dragging150a",
          "true"
        );

        try {
          candidate150A.target.setPointerCapture(
            candidate150A.pointerId
          );
        } catch {
          // Best effort.
        }

        window150A.getSelection()?.removeAllRanges();
      }

      function startCandidate150A(event150A: PointerEvent) {
        if (
          event150A.pointerType === "mouse" &&
          event150A.button !== 0
        ) {
          return;
        }

        const target150A = chooseTarget150A(
          event150A.target
        );

        if (!target150A) return;

        const computed150A = parseTranslate150A(
          window150A.getComputedStyle(target150A).translate
        );

        const style150A =
          (target150A as HTMLElement).style;

        if (!originalTranslate150A.has(target150A)) {
          originalTranslate150A.set(
            target150A,
            style150A.getPropertyValue("translate")
          );
        }

        candidate150A = {
          target: target150A,
          pointerId: event150A.pointerId,
          pointerType: event150A.pointerType,
          startX: event150A.clientX,
          startY: event150A.clientY,
          baseX: computed150A.x,
          baseY: computed150A.y,
          originalOutline: style150A.outline,
          originalOutlineOffset: style150A.outlineOffset,
          originalCursor: style150A.cursor,
          originalUserSelect: style150A.userSelect,
          originalTouchAction: style150A.touchAction,
        };

        if (event150A.pointerType === "touch") {
          holdTimer150A = window150A.setTimeout(
            () => beginDrag150A(),
            340
          );
        }
      }

      function moveCandidate150A(event150A: PointerEvent) {
        if (
          !candidate150A ||
          event150A.pointerId !== candidate150A.pointerId
        ) {
          return;
        }

        const dx150A =
          event150A.clientX - candidate150A.startX;
        const dy150A =
          event150A.clientY - candidate150A.startY;
        const distance150A = Math.hypot(dx150A, dy150A);

        if (
          !dragging150A &&
          candidate150A.pointerType === "touch"
        ) {
          if (distance150A > 9) {
            clearHold150A();
            candidate150A = null;
          }

          return;
        }

        if (!dragging150A && distance150A >= 5) {
          beginDrag150A();
        }

        if (!dragging150A || !candidate150A) return;

        event150A.preventDefault();
        event150A.stopPropagation();

        const x150A =
          candidate150A.baseX + dx150A;
        const y150A =
          candidate150A.baseY + dy150A;

        (candidate150A.target as HTMLElement).style.setProperty(
          "translate",
          `${Math.round(x150A)}px ${Math.round(y150A)}px`,
          "important"
        );
      }

      function finishCandidate150A(
        event150A: PointerEvent
      ) {
        if (
          !candidate150A ||
          event150A.pointerId !== candidate150A.pointerId
        ) {
          return;
        }

        clearHold150A();

        const completed150A = candidate150A;

        if (!dragging150A) {
          candidate150A = null;
          return;
        }

        event150A.preventDefault();
        event150A.stopPropagation();

        blockClickTarget150A = completed150A.target;
        blockClickUntil150A = Date.now() + 500;

        try {
          completed150A.target.releasePointerCapture(
            completed150A.pointerId
          );
        } catch {
          // Best effort.
        }

        restoreCandidateDecoration150A();

        candidate150A = null;
        dragging150A = false;
      }

      function cancelCandidate150A(
        event150A: PointerEvent
      ) {
        if (
          !candidate150A ||
          event150A.pointerId !== candidate150A.pointerId
        ) {
          return;
        }

        clearHold150A();
        restoreCandidateDecoration150A();
        candidate150A = null;
        dragging150A = false;
      }

      function suppressPostDragClick150A(
        event150A: MouseEvent
      ) {
        if (Date.now() > blockClickUntil150A) return;
        if (!blockClickTarget150A) return;

        const clickTarget150A = event150A.target as Node | null;

        if (
          clickTarget150A &&
          (clickTarget150A === blockClickTarget150A ||
            blockClickTarget150A.contains(clickTarget150A))
        ) {
          event150A.preventDefault();
          event150A.stopPropagation();
          event150A.stopImmediatePropagation();
        }
      }

      document150A.addEventListener(
        "pointerdown",
        startCandidate150A,
        true
      );

      document150A.addEventListener(
        "pointermove",
        moveCandidate150A,
        { capture: true, passive: false }
      );

      document150A.addEventListener(
        "pointerup",
        finishCandidate150A,
        true
      );

      document150A.addEventListener(
        "pointercancel",
        cancelCandidate150A,
        true
      );

      document150A.addEventListener(
        "click",
        suppressPostDragClick150A,
        true
      );

      detachPreview150A = () => {
        clearHold150A();
        restoreCandidateDecoration150A();

        document150A.removeEventListener(
          "pointerdown",
          startCandidate150A,
          true
        );

        document150A.removeEventListener(
          "pointermove",
          moveCandidate150A,
          true
        );

        document150A.removeEventListener(
          "pointerup",
          finishCandidate150A,
          true
        );

        document150A.removeEventListener(
          "pointercancel",
          cancelCandidate150A,
          true
        );

        document150A.removeEventListener(
          "click",
          suppressPostDragClick150A,
          true
        );

        old145Neutralizer150A.remove();

        for (const [
          target150A,
          original150A,
        ] of originalTranslate150A.entries()) {
          const style150A =
            (target150A as HTMLElement).style;

          if (original150A) {
            style150A.setProperty(
              "translate",
              original150A
            );
          } else {
            style150A.removeProperty("translate");
          }

          target150A.removeAttribute(
            "data-darik-dragging150a"
          );
        }
      };
    }

    function bindLivePreview150B() {
      const nextIframe150B = liveBuilderPreviewRef.current;

      if (!nextIframe150B) {
        if (boundIframe150B) {
          boundIframe150B.removeEventListener(
            "load",
            attachPreview150A
          );
          detachPreview150A();
          boundIframe150B = null;
          iframe150A = null;
        }
        return;
      }

      if (nextIframe150B === boundIframe150B) {
        return;
      }

      if (boundIframe150B) {
        boundIframe150B.removeEventListener(
          "load",
          attachPreview150A
        );
        detachPreview150A();
      }

      iframe150A = nextIframe150B;
      boundIframe150B = nextIframe150B;

      nextIframe150B.addEventListener(
        "load",
        attachPreview150A
      );

      attachPreview150A();
    }

    bindLivePreview150B();

    const livePreviewRetry150B = window.setInterval(
      bindLivePreview150B,
      180
    );

    return () => {
      window.clearInterval(livePreviewRetry150B);

      if (boundIframe150B) {
        boundIframe150B.removeEventListener(
          "load",
          attachPreview150A
        );
      }

      detachPreview150A();
      boundIframe150B = null;
      iframe150A = null;
    };
  }, [liveBuilderPreviewOpen, storefront?.id]);

  const [formDirty, setFormDirty] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const setupFormDirtyRef = useRef(false);
  const hydratedRetailerIdRef = useRef<string | null>(null);
  const authUserIdRef = useRef<string | null>(null);
  const saveBarRef = useRef<HTMLDivElement | null>(null);

  const selectedStore = useMemo(
    () =>
      context?.stores.find(
        (store) => store.retailer_id === selectedRetailerId
      ) ?? null,
    [context, selectedRetailerId]
  );


  useEffect(() => {
    const retailerId = selectedStore?.retailer_id;
    if (!retailerId) return;

    const pendingKey = `darik-pending-typography-${retailerId}`;
    const pendingRaw = window.localStorage.getItem(pendingKey);

    if (pendingRaw) {
      try {
        const pending = normalizeStorefrontTypography(JSON.parse(pendingRaw));
        setStorefrontTypographyDraft(pending);
        typographyDirtyRef.current = true;
        setTypographyDirty(true);
        setTypographySaveState(storefront?.id ? "waiting" : "idle");
        return;
      } catch {
        window.localStorage.removeItem(pendingKey);
      }
    }

    if (!storefront?.slug) {
      typographyDirtyRef.current = false;
      setTypographyDirty(false);
      setStorefrontTypographyDraft(storefrontTypographyDefaultState());
      setTypographySaveState("idle");
      return;
    }

    let cancelled = false;
    setTypographySaveState("loading");

    void (async () => {
      const result = await supabase.rpc("darik_direct_public_typography", {
        p_slug: storefront.slug,
      });

      if (cancelled || typographyDirtyRef.current) return;

      if (result.error) {
        setTypographySaveState("error");
        return;
      }

      setStorefrontTypographyDraft(
        normalizeStorefrontTypography(result.data)
      );
      setTypographySaveState("idle");
    })();

    return () => {
      cancelled = true;
    };
  }, [
    selectedStore?.retailer_id,
    storefront?.id,
    storefront?.slug,
  ]);

  useEffect(() => {
    const retailerId = selectedStore?.retailer_id;

    if (!typographyDirty || !retailerId) return;

    const pendingKey = `darik-pending-typography-${retailerId}`;
    window.localStorage.setItem(
      pendingKey,
      JSON.stringify(storefrontTypographyDraft)
    );

    if (!storefront?.id) {
      setTypographySaveState("idle");
      return;
    }

    setTypographySaveState("waiting");

    const timer = window.setTimeout(() => {
      setTypographySaveState("saving");

      void (async () => {
        const result = await supabase.rpc(
          "darik_direct_set_storefront_typography",
          {
            p_storefront_id: storefront.id,
            p_typography: storefrontTypographyDraft,
          }
        );

        if (result.error) {
          setTypographySaveState("error");
          return;
        }

        typographyDirtyRef.current = false;
        setTypographyDirty(false);
        window.localStorage.removeItem(pendingKey);
        setTypographySaveState("saved");

        window.setTimeout(() => {
          setTypographySaveState((current) =>
            current === "saved" ? "idle" : current
          );
        }, 1600);
      })();
    }, 650);

    return () => window.clearTimeout(timer);
  }, [
    selectedStore?.retailer_id,
    storefront?.id,
    storefrontTypographyDraft,
    typographyDirty,
  ]);

  const authUserId = session?.user.id ?? null;

  const [storefrontSetupMode109, setStorefrontSetupMode109] = useState<
    "loading" | "wizard" | "tabs"
  >("loading");
  const [storefrontSetupStep109, setStorefrontSetupStep109] =
    useState<DarikStorefrontSetupStep109>(1);
  const [storefrontSetupTab109, setStorefrontSetupTab109] =
    useState<DarikStorefrontSetupStep109>(1);
  const [storefrontSetupNotice109, setStorefrontSetupNotice109] = useState("");
  const [storefrontSetupBusy109, setStorefrontSetupBusy109] = useState(false);
  const [deliveryZones109, setDeliveryZones109] = useState<DarikDeliveryZone109[]>([]);
  const [deliveryZonesLoaded109, setDeliveryZonesLoaded109] = useState(false);
  const [deliveryZonesSaveState109, setDeliveryZonesSaveState109] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const storefrontSetupLoadedId109 = useRef("");
  const deliveryZonesSaveTimer109 = useRef<number | null>(null);
  const [deliveryLocation112, setDeliveryLocation112] =
    useState<DarikDeliveryLocation112 | null>(null);
  const [deliveryLocationCandidate112, setDeliveryLocationCandidate112] =
    useState<DarikDeliveryLocation112 | null>(null);
  const [deliveryLocationUnlocked112, setDeliveryLocationUnlocked112] =
    useState(false);
  const [deliveryLocationLocating112, setDeliveryLocationLocating112] =
    useState(false);
  const [deliveryLocationSearch112, setDeliveryLocationSearch112] =
    useState("");
  const [
    deliveryLocationPredictions112,
    setDeliveryLocationPredictions112,
  ] = useState<DarikGooglePlacePrediction112[]>([]);
  const [deliveryLocationSearching112, setDeliveryLocationSearching112] =
    useState(false);
  const [deliveryLocationSaving112, setDeliveryLocationSaving112] =
    useState(false);
  const [deliveryLocationError112, setDeliveryLocationError112] =
    useState("");
  const [deliveryLocationUnlockOpen112, setDeliveryLocationUnlockOpen112] =
    useState(false);
  const [
    deliveryLocationUnlockPassword112,
    setDeliveryLocationUnlockPassword112,
  ] = useState("");
  const [deliveryLocationUnlockBusy112, setDeliveryLocationUnlockBusy112] =
    useState(false);
  const [
    deliveryLocationUnlockError112,
    setDeliveryLocationUnlockError112,
  ] = useState("");

  const deliveryLocationLocked112 =
    Boolean(deliveryLocation112) && !deliveryLocationUnlocked112;
  const deliveryLocationMap112 =
    deliveryLocationCandidate112 ?? deliveryLocation112;

  const storefrontSetupVisibleStep109: DarikStorefrontSetupStep109 | 0 =
    storefrontSetupMode109 === "tabs"
      ? storefrontSetupTab109
      : storefrontSetupMode109 === "wizard"
        ? storefrontSetupStep109
        : 0;


  useEffect(() => {
    if (!liveBuilderPreviewExpanded111) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handlePreviewEscape111 = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLiveBuilderPreviewExpanded111(false);
      }
    };

    window.addEventListener("keydown", handlePreviewEscape111);

    return () => {
      window.removeEventListener("keydown", handlePreviewEscape111);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [liveBuilderPreviewExpanded111]);

  useEffect(() => {
    const step = storefrontSetupVisibleStep109;

    if (!step) return;

    const previousStep = storefrontSetupLastVisibleStep111.current;

    /*
      Do not move the page on the first render. After that, every actual
      wizard/tab change is aligned immediately below the fixed preview.
    */
    if (previousStep === 0) {
      storefrontSetupLastVisibleStep111.current = step;
      return;
    }

    if (previousStep === step) return;

    storefrontSetupLastVisibleStep111.current = step;

    let secondFrame = 0;

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const panel = document.querySelector<HTMLElement>(
          `[data-darik-exact-step="${step}"]`
        );

        if (!panel) return;

        const fixedPreviewOffset =
          liveBuilderPreviewOpen && !liveBuilderPreviewExpanded111
            ? Math.round(window.innerHeight * 0.5)
            : 0;

        const panelTop =
          window.scrollY + panel.getBoundingClientRect().top;

        window.scrollTo({
          top: Math.max(0, panelTop - fixedPreviewOffset - 14),
          behavior: "auto",
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) {
        window.cancelAnimationFrame(secondFrame);
      }
    };
  }, [
    storefrontSetupVisibleStep109,
    liveBuilderPreviewOpen,
    liveBuilderPreviewExpanded111,
  ]);

  useEffect(() => {
    if (!storefront?.id) {
      if (!storefront) {
        setStorefrontSetupMode109("wizard");
        setDeliveryZonesLoaded109(true);
      }
      return;
    }

    if (storefrontSetupLoadedId109.current === storefront.id) return;

    storefrontSetupLoadedId109.current = storefront.id;
    let cancelled = false;

    void (async () => {
      setStorefrontSetupMode109("loading");
      setDeliveryZonesLoaded109(false);

      const result = await supabase.rpc("darik_direct_storefront_setup_state", {
        p_storefront_id: storefront.id,
      });

      if (cancelled) return;

      if (result.error) {
        setStorefrontSetupMode109("wizard");
        setDeliveryZonesLoaded109(true);
        setError(
          result.error.message ||
            "Could not load the storefront setup state. Run the FRONTEND 109 SQL migration first."
        );
        return;
      }

      const payload =
        result.data && typeof result.data === "object"
          ? (result.data as Record<string, unknown>)
          : {};

      setDeliveryZones109(
        normalizeDarikDeliveryZones109(payload.delivery_zones)
      );

      const savedDeliveryLocation112 =
        normalizeDarikDeliveryLocation112(payload.delivery_location);
      setDeliveryLocation112(savedDeliveryLocation112);
      setDeliveryLocationCandidate112(savedDeliveryLocation112);
      setDeliveryLocationUnlocked112(false);
      setDeliveryLocationSearch112(
        savedDeliveryLocation112?.address ?? ""
      );
      setDeliveryLocationPredictions112([]);
      setDeliveryLocationError112("");

      setDeliveryZonesLoaded109(true);

      if (payload.setup_completed === true) {
        setStorefrontSetupMode109("tabs");
        setStorefrontSetupTab109(1);
      } else {
        setStorefrontSetupMode109("wizard");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [storefront?.id]);

  // DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136: keep Theme visible until the retailer explicitly presses Next.


  useEffect(() => {
    if (deliveryLocationLocked112) {
      setDeliveryLocationPredictions112([]);
      return;
    }

    const query = deliveryLocationSearch112.trim();

    if (query.length < 3) {
      setDeliveryLocationPredictions112([]);
      return;
    }

    const timer = window.setTimeout(() => {
      void searchDeliveryLocationPlaces112(query);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [deliveryLocationSearch112, deliveryLocationLocked112]);

  async function searchDeliveryLocationPlaces112(query: string) {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 3 || deliveryLocationLocked112) return;

    setDeliveryLocationSearching112(true);
    setDeliveryLocationError112("");

    try {
      const params = new URLSearchParams({
        input: cleanQuery,
        language: "en",
      });
      const response = await fetch(
        `/api/google-places/autocomplete?${params.toString()}`,
        { cache: "no-store" }
      );
      const json = await response.json();

      if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
        throw new Error(
          json.error_message ||
            `Google Places error: ${String(json.status || "UNKNOWN")}`
        );
      }

      const predictions: DarikGooglePlacePrediction112[] =
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
                    ? (row.structured_formatting as Record<string, unknown>)
                    : {};

                return {
                  place_id: String(row.place_id ?? ""),
                  description: String(row.description ?? ""),
                  structured_formatting: {
                    main_text: String(structured.main_text ?? ""),
                    secondary_text: String(structured.secondary_text ?? ""),
                  },
                };
              })
              .filter((item) => item.place_id && item.description)
          : [];

      setDeliveryLocationPredictions112(predictions);

      if (!predictions.length) {
        setDeliveryLocationError112(
          "No matching locations found. / لم يتم العثور على موقع مطابق."
        );
      }
    } catch (caught) {
      setDeliveryLocationPredictions112([]);
      setDeliveryLocationError112(
        caught instanceof Error
          ? caught.message
          : "Could not search Google Maps."
      );
    } finally {
      setDeliveryLocationSearching112(false);
    }
  }

  async function chooseDeliveryGooglePlace112(
    prediction: DarikGooglePlacePrediction112
  ) {
    if (deliveryLocationLocked112) return;

    setDeliveryLocationSearching112(true);
    setDeliveryLocationError112("");

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
          json.error_message || "Google did not return this location."
        );
      }

      const latitude = Number(point.lat);
      const longitude = Number(point.lng);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error("Google did not return valid GPS coordinates.");
      }

      const placeName = String(
        json.result?.name ||
          prediction.structured_formatting?.main_text ||
          ""
      ).trim();
      const formattedAddress = String(
        json.result?.formatted_address ||
          prediction.description ||
          ""
      ).trim();
      const address =
        placeName &&
        formattedAddress &&
        !formattedAddress.toLowerCase().includes(placeName.toLowerCase())
          ? `${placeName} | ${formattedAddress}`
          : formattedAddress ||
            placeName ||
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      const candidate: DarikDeliveryLocation112 = {
        address,
        latitude,
        longitude,
        placeId: prediction.place_id,
        source: "google_search",
        confirmedAt: "",
      };

      setDeliveryLocationCandidate112(candidate);
      setDeliveryLocationSearch112(address);
      setDeliveryLocationPredictions112([]);
    } catch (caught) {
      setDeliveryLocationError112(
        caught instanceof Error
          ? caught.message
          : "Could not select this Google location."
      );
    } finally {
      setDeliveryLocationSearching112(false);
    }
  }

  function getMyDeliveryLocation112() {
    if (deliveryLocationLocked112 || deliveryLocationLocating112) return;

    if (!navigator.geolocation) {
      setDeliveryLocationError112(
        "This browser does not support location access. Use Google search instead."
      );
      return;
    }

    setDeliveryLocationLocating112(true);
    setDeliveryLocationError112("");
    setDeliveryLocationPredictions112([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        let placeId = "";

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
          const first = Array.isArray(json.results) ? json.results[0] : null;
          address = String(first?.formatted_address || address).trim();
          placeId = String(first?.place_id || "").trim();
        } catch {
          // Coordinate fallback remains valid.
        }

        const candidate: DarikDeliveryLocation112 = {
          address,
          latitude,
          longitude,
          placeId,
          source: "gps",
          confirmedAt: "",
        };

        setDeliveryLocationCandidate112(candidate);
        setDeliveryLocationSearch112(address);
        setDeliveryLocationLocating112(false);
      },
      (geoError) => {
        setDeliveryLocationLocating112(false);
        setDeliveryLocationError112(
          geoError.message ||
            "Could not get your current location. Try Google search."
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }

  async function resolveStorefrontIdForLocation112() {
    if (storefront?.id) return storefront.id;
    if (!selectedStore?.retailer_id) return null;

    const lookup = await supabase
      .from("retailer_storefronts")
      .select("id")
      .eq("retailer_id", selectedStore.retailer_id)
      .limit(1)
      .maybeSingle();

    if (lookup.error) throw lookup.error;
    return String(lookup.data?.id ?? "") || null;
  }

  async function confirmDeliveryLocation112() {
    if (!deliveryLocationCandidate112 || deliveryLocationSaving112) return;

    setDeliveryLocationSaving112(true);
    setDeliveryLocationError112("");

    try {
      const storefrontId = await resolveStorefrontIdForLocation112();

      if (!storefrontId) {
        throw new Error(
          "Your storefront is still being created. Wait a moment and try again."
        );
      }

      const candidate = deliveryLocationCandidate112;
      const result = await supabase.rpc(
        "darik_direct_set_delivery_location",
        {
          p_storefront_id: storefrontId,
          p_address: candidate.address,
          p_latitude: candidate.latitude,
          p_longitude: candidate.longitude,
          p_place_id: candidate.placeId || null,
          p_source: candidate.source,
        }
      );

      if (result.error) throw result.error;

      const payload =
        result.data && typeof result.data === "object"
          ? (result.data as Record<string, unknown>)
          : {};
      const saved =
        normalizeDarikDeliveryLocation112(payload.delivery_location) ?? {
          ...candidate,
          confirmedAt: new Date().toISOString(),
        };

      setDeliveryLocation112(saved);
      setDeliveryLocationCandidate112(saved);
      setDeliveryLocationUnlocked112(false);
      setDeliveryLocationPredictions112([]);
      setDeliveryLocationSearch112(saved.address);
      updateSetupField("addressText", saved.address);
      setMessage(
        "Store location confirmed and locked. / تم تأكيد موقع المتجر وقفله."
      );
    } catch (caught) {
      setDeliveryLocationError112(
        caught instanceof Error
          ? caught.message
          : "Could not confirm this store location."
      );
    } finally {
      setDeliveryLocationSaving112(false);
    }
  }

  function openDeliveryLocationUnlock112() {
    if (!deliveryLocation112) return;
    setDeliveryLocationUnlockPassword112("");
    setDeliveryLocationUnlockError112("");
    setDeliveryLocationUnlockOpen112(true);
  }

  async function verifyDeliveryLocationUnlock112() {
    const password = deliveryLocationUnlockPassword112;

    if (!password) {
      setDeliveryLocationUnlockError112(
        "Enter your Darik login password. / أدخل كلمة مرور تسجيل الدخول."
      );
      return;
    }

    setDeliveryLocationUnlockBusy112(true);
    setDeliveryLocationUnlockError112("");

    try {
      const userResult = await supabase.auth.getUser();
      if (userResult.error) throw userResult.error;

      const email = String(userResult.data.user?.email ?? "").trim();
      if (!email) {
        throw new Error("Your signed-in account has no email address.");
      }

      const verifyResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (verifyResult.error) {
        throw new Error(
          "Incorrect password. Location remains locked. / كلمة المرور غير صحيحة. الموقع ما زال مقفلاً."
        );
      }

      setDeliveryLocationUnlocked112(true);
      setDeliveryLocationCandidate112(deliveryLocation112);
      setDeliveryLocationSearch112(deliveryLocation112?.address ?? "");
      setDeliveryLocationUnlockPassword112("");
      setDeliveryLocationUnlockOpen112(false);
      setMessage(
        "Location unlocked. Choose and confirm the replacement pin. / تم فتح الموقع. اختر الموقع الجديد ثم أكده."
      );
    } catch (caught) {
      setDeliveryLocationUnlockError112(
        caught instanceof Error
          ? caught.message
          : "Could not verify your password."
      );
    } finally {
      setDeliveryLocationUnlockBusy112(false);
    }
  }

  function serializeDeliveryZones109() {
    const normalized = deliveryZones109
      .map((zone) => {
        const maxKm = Number(zone.maxKm);
        const deliveryFeeJod = Number(zone.deliveryFeeJod);
        const minimumOrderJod =
          zone.minimumOrderJod.trim() === ""
            ? null
            : Number(zone.minimumOrderJod);

        if (
          !Number.isFinite(maxKm) ||
          maxKm <= 0 ||
          !Number.isFinite(deliveryFeeJod) ||
          deliveryFeeJod < 0 ||
          (minimumOrderJod !== null &&
            (!Number.isFinite(minimumOrderJod) || minimumOrderJod < 0))
        ) {
          return null;
        }

        return {
          max_km: Number(maxKm.toFixed(2)),
          delivery_fee_jod: Number(deliveryFeeJod.toFixed(2)),
          minimum_order_jod:
            minimumOrderJod === null
              ? null
              : Number(minimumOrderJod.toFixed(2)),
        };
      });

    if (normalized.some((zone) => zone === null)) return null;

    const clean = normalized
      .filter(
        (zone): zone is {
          max_km: number;
          delivery_fee_jod: number;
          minimum_order_jod: number | null;
        } => zone !== null
      )
      .sort((a, b) => a.max_km - b.max_km);

    for (let index = 1; index < clean.length; index += 1) {
      if (clean[index].max_km <= clean[index - 1].max_km) {
        return null;
      }
    }

    return clean;
  }

  async function saveDeliveryZones109(showError = false) {
    if (!storefront?.id || !deliveryZonesLoaded109) return true;

    const payload = serializeDeliveryZones109();

    if (!payload) {
      if (showError) {
        setStorefrontSetupNotice109(
          "Check your delivery zones. Distance must be above 0 and each fee/minimum must be 0 or higher. / تحقق من مناطق التوصيل."
        );
      }
      return false;
    }

    setDeliveryZonesSaveState109("saving");

    const result = await supabase.rpc("darik_direct_set_delivery_zones", {
      p_storefront_id: storefront.id,
      p_zones: payload,
    });

    if (result.error) {
      setDeliveryZonesSaveState109("error");
      if (showError) {
        setStorefrontSetupNotice109(
          result.error.message || "Could not save delivery zones."
        );
      }
      return false;
    }

    setDeliveryZonesSaveState109("saved");
    window.setTimeout(() => {
      setDeliveryZonesSaveState109((current) =>
        current === "saved" ? "idle" : current
      );
    }, 1600);
    return true;
  }

  useEffect(() => {
    if (!storefront?.id || !deliveryZonesLoaded109) return;

    const payload = serializeDeliveryZones109();
    if (!payload) return;

    if (deliveryZonesSaveTimer109.current) {
      window.clearTimeout(deliveryZonesSaveTimer109.current);
    }

    deliveryZonesSaveTimer109.current = window.setTimeout(() => {
      void saveDeliveryZones109(false);
    }, 750);

    return () => {
      if (deliveryZonesSaveTimer109.current) {
        window.clearTimeout(deliveryZonesSaveTimer109.current);
      }
    };
  }, [deliveryZones109, deliveryZonesLoaded109, storefront?.id]);

  function addDeliveryZone109() {
    const lastMax = deliveryZones109.reduce((highest, zone) => {
      const value = Number(zone.maxKm);
      return Number.isFinite(value) ? Math.max(highest, value) : highest;
    }, 0);

    setDeliveryZones109((current) => [
      ...current,
      {
        id: `zone-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        maxKm: String(lastMax > 0 ? Number((lastMax + 1).toFixed(1)) : 1),
        deliveryFeeJod: "0",
        minimumOrderJod: "",
      },
    ]);
  }

  function updateDeliveryZone109(
    id: string,
    field: "maxKm" | "deliveryFeeJod" | "minimumOrderJod",
    value: string
  ) {
    setDeliveryZones109((current) =>
      current.map((zone) =>
        zone.id === id ? { ...zone, [field]: value } : zone
      )
    );
  }

  function removeDeliveryZone109(id: string) {
    setDeliveryZones109((current) =>
      current.filter((zone) => zone.id !== id)
    );
  }

  function updateOperatingHourDropdown109(
    day: string,
    part: "open" | "close",
    value: string
  ) {
    const current = parseDarikOperatingHours109(
      setupForm.operatingHours[day] ?? ""
    );

    if (part === "open" && value === "Closed") {
      updateOperatingHour(day, "Closed");
      return;
    }

    const nextOpen = part === "open" ? value : current.open;
    const nextClose = part === "close" ? value : current.close;

    if (!nextOpen && !nextClose) {
      updateOperatingHour(day, "");
      return;
    }

    if (nextOpen === "Closed") {
      updateOperatingHour(day, "Closed");
      return;
    }

    updateOperatingHour(
      day,
      nextOpen && nextClose ? `${nextOpen} – ${nextClose}` : nextOpen || ""
    );
  }

  function storefrontSetupStepReady109(step: DarikStorefrontSetupStep109) {
    if (step === 1) return Boolean(selectedThemeField);
    if (step === 2) {
      return Boolean(
        setupForm.logoUrl.trim() && setupForm.heroImageUrl.trim()
      );
    }
    if (step === 3) {
      return Boolean(
        setupForm.slug.trim().length >= 2 &&
          setupForm.displayName.trim().length >= 2
      );
    }
    if (step === 5) {
      return Boolean(
        setupForm.phone.trim() ||
          setupForm.whatsapp.trim() ||
          setupForm.publicEmail.trim()
      );
    }
    // DARIK_PICKUP_ONLY_DELIVERY_TAB_114
    if (step === 9) {
      if (!deliveryLocation112) return false;

      const fulfillmentMode = String(
        (setupForm as StorefrontForm & { fulfillmentMode?: string })
          .fulfillmentMode ?? "delivery"
      );
      const orderingEnabled = Boolean(
        (setupForm as StorefrontForm & { showOrdering?: boolean }).showOrdering
      );

      if (!orderingEnabled || fulfillmentMode === "pickup") {
        return true;
      }

      return (
        deliveryZones109.length > 0 &&
        serializeDeliveryZones109() !== null
      );
    }
    if (step === 10) {
      const orderMode = String(setupForm.orderSubmissionMode ?? "phone");
      if (orderMode === "phone") return true;
      return Boolean(setupForm.acceptCash || setupForm.acceptCliq);
    }

    return true;
  }

  function storefrontSetupMissingMessage109(
    step: DarikStorefrontSetupStep109
  ) {
    if (step === 1) {
      return "Choose a storefront theme first. / اختر قالب واجهة المتجر أولاً.";
    }
    if (step === 2) {
      return "Upload both your logo and storefront cover to continue. / حمّل الشعار وصورة واجهة المتجر للمتابعة.";
    }
    if (step === 3) {
      return "Enter a store link and customer-facing store name. / أدخل رابط المتجر واسم المتجر للعملاء.";
    }
    if (step === 5) {
      return "Add at least one customer contact method. / أضف وسيلة تواصل واحدة على الأقل.";
    }
    if (step === 9) {
      return "Confirm the exact store location first. If delivery is enabled, also add at least one valid delivery zone. / أكد موقع المتجر أولاً، وإذا كان التوصيل مفعلاً أضف منطقة توصيل صالحة.";
    }
    if (step === 10) {
      return "Choose at least one payment method for online orders. / اختر طريقة دفع واحدة على الأقل للطلبات الإلكترونية.";
    }
    return "Complete the required information before continuing. / أكمل المعلومات المطلوبة للمتابعة.";
  }

  async function goToNextStorefrontSetupStep109() {
    const step = storefrontSetupStep109;

    if (!storefrontSetupStepReady109(step)) {
      setStorefrontSetupNotice109(storefrontSetupMissingMessage109(step));
      return;
    }

    if (
      step === 9 &&
      setupForm.fulfillmentMode !== "pickup"
    ) {
      const zonesSaved = await saveDeliveryZones109(true);
      if (!zonesSaved) return;
    }

    setStorefrontSetupNotice109("");
    setStorefrontSetupStep109(
      Math.min(11, step + 1) as DarikStorefrontSetupStep109
    );
  }

  function goToPreviousStorefrontSetupStep109() {
    setStorefrontSetupNotice109("");
    setStorefrontSetupStep109(
      Math.max(1, storefrontSetupStep109 - 1) as DarikStorefrontSetupStep109
    );
  }

  async function finishStorefrontSetup109() {
    if (storefrontSetupBusy109) return;

    setStorefrontSetupBusy109(true);
    setStorefrontSetupNotice109("");

    try {
            const permanentStoreSlug142 = cleanSlug(setupForm.slug);
      if (
        permanentStoreSlug142.length < 2 ||
        isInternalSetupSlug142(permanentStoreSlug142)
      ) {
        throw new Error(
          "Choose your real permanent Darik Store Link before finishing setup."
        );
      }

await saveStorefront(undefined, "manual");

      const permanentSlugCheck142 = await supabase
        .from("retailer_storefronts")
        .select("slug")
        .eq("retailer_id", selectedStore?.retailer_id ?? "")
        .limit(1)
        .maybeSingle();

      if (permanentSlugCheck142.error) {
        throw permanentSlugCheck142.error;
      }

      const savedPermanentSlug142 = cleanSlug(
        String(permanentSlugCheck142.data?.slug ?? "")
      );
      if (
        savedPermanentSlug142 !== permanentStoreSlug142 ||
        isInternalSetupSlug142(savedPermanentSlug142)
      ) {
        throw new Error(
          "Save your real permanent Darik Store Link before finishing setup."
        );
      }

      let storefrontId = storefront?.id ?? null;

      if (!storefrontId && selectedStore?.retailer_id) {
        const lookup = await supabase
          .from("retailer_storefronts")
          .select("id")
          .eq("retailer_id", selectedStore.retailer_id)
          .limit(1)
          .maybeSingle();

        if (lookup.error) {
          throw lookup.error;
        }

        storefrontId = String(lookup.data?.id ?? "") || null;
      }

      if (!storefrontId) {
        throw new Error(
          "Your storefront draft is still being created. Save once more, then finish setup."
        );
      }

      if (setupForm.fulfillmentMode !== "pickup") {
        const zonesPayload = serializeDeliveryZones109();

        if (!zonesPayload) {
          throw new Error("Check your delivery-zone values before finishing.");
        }

        const zonesResult = await supabase.rpc(
          "darik_direct_set_delivery_zones",
          {
            p_storefront_id: storefrontId,
            p_zones: zonesPayload,
          }
        );

        if (zonesResult.error) {
          throw zonesResult.error;
        }
      }

      const onboardingResult136 = await supabase.rpc(
        "darik_direct_get_my_onboarding_v1"
      );

      if (onboardingResult136.error) {
        throw onboardingResult136.error;
      }

      const onboardingState136 =
        onboardingResult136.data && typeof onboardingResult136.data === "object"
          ? (onboardingResult136.data as Record<string, unknown>)
          : {};
      const managedUsernameOnboarding136 =
        onboardingState136.managed_account === true;

      if (managedUsernameOnboarding136) {
        const finalizeResult136 = await supabase.rpc(
          "darik_direct_finalize_username_store_setup_v1",
          { p_storefront_id: storefrontId }
        );

        if (finalizeResult136.error) {
          throw finalizeResult136.error;
        }
      }
      const completeResult = await supabase.rpc(
        "darik_direct_complete_storefront_setup",
        {
          p_storefront_id: storefrontId,
        }
      );

      if (completeResult.error) {
        throw completeResult.error;
      }

      if (managedUsernameOnboarding136) {
        window.location.assign("/store-dashboard/getting-started");
        return;
      }

      setStorefrontSetupMode109("tabs");
      setStorefrontSetupTab109(1);
      setMessage(
        "Storefront setup complete. You can now edit every section from the tabs. / اكتمل إعداد المتجر ويمكنك تعديل أي قسم من التبويبات."
      );
    } catch (finishError) {
      setStorefrontSetupNotice109(
        finishError instanceof Error
          ? finishError.message
          : "Could not finish storefront setup."
      );
    } finally {
      setStorefrontSetupBusy109(false);
    }
  }

  const markSetupDirty = useCallback(() => {
    setupFormDirtyRef.current = true;
    setFormDirty(true);
    setError("");
    setMessage("");
  }, []);

  const showSaveError = useCallback((nextError: string) => {
    setSaving(false);
    setAutoSaveStatus("error");
    setMessage("");
    setError(nextError);

    window.setTimeout(() => {
      saveBarRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  }, []);

  const loadContext = useCallback(async () => {
    if (!authUserId) return;

    setLoadingContext(true);
    setError("");

    const result = await supabase.rpc("darik_direct_get_my_context");

    if (result.error) {
      setContext(null);
      setError(result.error.message);
      setLoadingContext(false);
      return;
    }

    const nextContext = result.data as ContextResult;
    const stores = Array.isArray(nextContext?.stores)
      ? nextContext.stores
      : [];

    setContext({ ...nextContext, stores });

    setSelectedRetailerId((current) => {
      if (current && stores.some((store) => store.retailer_id === current)) {
        return current;
      }
      return stores[0]?.retailer_id ?? "";
    });

    setLoadingContext(false);
  }, [authUserId]);

  useEffect(() => {
    const updateDesktopLocationHint = () => {
      setShowDesktopLocationHint(
        window.innerWidth >= 768 &&
          window.matchMedia("(pointer: fine)").matches
      );
    };

    updateDesktopLocationHint();
    window.addEventListener("resize", updateDesktopLocationHint);
    return () => window.removeEventListener("resize", updateDesktopLocationHint);
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      authUserIdRef.current = data.session?.user.id ?? null;
      setSession(data.session);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      const previousUserId = authUserIdRef.current;
      const nextUserId = nextSession?.user.id ?? null;
      const accountChanged =
        Boolean(previousUserId) &&
        Boolean(nextUserId) &&
        previousUserId !== nextUserId;

      authUserIdRef.current = nextUserId;
      setSession(nextSession);
      setAuthReady(true);

      // Supabase emits TOKEN_REFRESHED and INITIAL_SESSION in the background.
      // Those events must never clear or reload an in-progress storefront form.
      if (event === "SIGNED_OUT" || !nextSession || accountChanged) {
        setContext(null);
        setStorefront(null);
        setRecentOrders([]);
        setSelectedRetailerId("");
        hydratedRetailerIdRef.current = null;
        setupFormDirtyRef.current = false;
        setFormDirty(false);
        setDraftSavedAt(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authUserId) loadContext();
  }, [authUserId, loadContext]);

  useEffect(() => {
    if (!selectedStore) {
      setStorefront(null);
      return;
    }

    let cancelled = false;
    const retailerChanged =
      hydratedRetailerIdRef.current !== selectedStore.retailer_id;

    if (retailerChanged) {
      hydratedRetailerIdRef.current = selectedStore.retailer_id;
      setupFormDirtyRef.current = false;
      setFormDirty(false);
      setDraftSavedAt(null);
    }

    async function loadStoreData() {
      setError("");

      const [storefrontResult, productResult, orderCountResult, recentResult] =
        await Promise.all([
          supabase
            .from("retailer_storefronts")
            .select("*")
            .eq("retailer_id", selectedStore.retailer_id)
            .maybeSingle(),
          supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("retailer_id", selectedStore.retailer_id),
          supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("sales_channel", "direct_storefront")
            .eq("storefront_retailer_id", selectedStore.retailer_id),
          supabase
            .from("orders")
            .select(
              "id,order_number,customer_name,total,order_status,created_at"
            )
            .eq("sales_channel", "direct_storefront")
            .eq("storefront_retailer_id", selectedStore.retailer_id)
            .order("created_at", { ascending: false })
            .limit(8),
        ]);

      if (cancelled) return;

      if (storefrontResult.error) {
        setError(storefrontResult.error.message);
        setStorefront(null);
      } else {
        const loadedStorefront =
          (storefrontResult.data as StorefrontSettings | null) ?? null;
        setStorefront(loadedStorefront);

        // DARIK_ARABIC_STOREFRONT_TEXT_PERSISTENCE_125
        const databaseForm: StorefrontForm = loadedStorefront
          ? {
              slug: isInternalSetupSlug142(loadedStorefront.slug) ? "" : loadedStorefront.slug,
              displayName: loadedStorefront.display_name || "",
              displayNameAr: loadedStorefront.display_name_ar || "",
              tagline: loadedStorefront.tagline || "",
              taglineAr: loadedStorefront.tagline_ar || "",
              logoUrl: loadedStorefront.logo_url ?? "",
              heroImageUrl: loadedStorefront.hero_image_url ?? "",
              phone: loadedStorefront.business_phone ?? "",
              whatsapp: loadedStorefront.whatsapp_number ?? "",
              publicEmail: loadedStorefront.public_email ?? "",
              websiteUrl: loadedStorefront.website_url ?? "",
              facebookUrl: loadedStorefront.facebook_url ?? "",
              instagramUrl: loadedStorefront.instagram_url ?? "",
              addressText:
                loadedStorefront.address_text ||
                loadedStorefront.address_text_ar ||
                "",
              addressTextAr: "",
              aboutText:
                loadedStorefront.about_text ||
                loadedStorefront.about_text_ar ||
                "",
              aboutTextAr: "",
              primaryColor: draftDesignString(loadedStorefront.design_draft, "primaryColor", loadedStorefront.primary_color),
              accentColor: draftDesignString(loadedStorefront.design_draft, "accentColor", loadedStorefront.accent_color),
              backgroundColor: draftDesignString(loadedStorefront.design_draft, "backgroundColor", loadedStorefront.background_color),
              deliveryFee: String(loadedStorefront.delivery_fee ?? "0"),
              minimumOrder: String(loadedStorefront.minimum_order ?? "0"),
              deliveryRadiusKm:
                loadedStorefront.delivery_radius_km == null
                  ? ""
                  : String(loadedStorefront.delivery_radius_km),
              estimatedDeliveryMinutes:
                loadedStorefront.estimated_delivery_minutes == null
                  ? ""
                  : String(loadedStorefront.estimated_delivery_minutes),
              fulfillmentMode:
                loadedStorefront.delivery_enabled === false &&
                loadedStorefront.pickup_enabled === true
                  ? "pickup"
                  : "delivery",
              orderSubmissionMode:
                loadedStorefront.order_submission_mode ?? "phone",
              acceptCash: loadedStorefront.cash_on_delivery_enabled ?? true,
              acceptCliq: loadedStorefront.cliq_enabled ?? false,
              cliqAccountName: loadedStorefront.cliq_account_name ?? "",
              cliqIdentifier: loadedStorefront.cliq_payment_identifier ?? "",
              customLinks: normalizeCustomLinks(loadedStorefront.custom_links),
              customInformation: normalizeCustomInformation(
                loadedStorefront.custom_information
              ),
              operatingHours: mergeLegacyOperatingHours(
                loadedStorefront.operating_hours,
                loadedStorefront.operating_hours_ar
              ),
              operatingHoursAr: { ...defaultOperatingHours },
              ...defaultStorefrontDesign,
              storefrontTheme: loadedStorefront.storefront_theme ?? defaultStorefrontDesign.storefrontTheme,
              appearanceMode: loadedStorefront.appearance_mode ?? defaultStorefrontDesign.appearanceMode,
              productCardStyle: loadedStorefront.product_card_style ?? defaultStorefrontDesign.productCardStyle,
              cornerStyle: loadedStorefront.corner_style ?? defaultStorefrontDesign.cornerStyle,
              heroLayout: loadedStorefront.hero_layout ?? defaultStorefrontDesign.heroLayout,
              sectionOrder: normalizeSectionOrder(loadedStorefront.section_order),
              showPrices: loadedStorefront.show_prices ?? true,
              showOrdering: loadedStorefront.show_ordering ?? true,
              showPhone: loadedStorefront.show_phone ?? true,
              showWhatsapp: loadedStorefront.show_whatsapp ?? true,
              showStoreStory: loadedStorefront.show_store_story ?? true,
              ...normalizeDesignDraft(loadedStorefront.design_draft),
            }
          : {
              slug: cleanSlug(selectedStore.business_name),
              displayName: selectedStore.business_name,
              displayNameAr: "",
              tagline: "",
              taglineAr: "",
              logoUrl: "",
              heroImageUrl: "",
              phone: "",
              whatsapp: "",
              publicEmail: "",
              websiteUrl: "",
              facebookUrl: "",
              instagramUrl: "",
              addressText: "",
              addressTextAr: "",
              aboutText: "",
              aboutTextAr: "",
              primaryColor: "#111827",
              accentColor: "#2563EB",
              backgroundColor: "#F8FAFC",
              deliveryFee: "2.00",
              minimumOrder: "0.00",
              deliveryRadiusKm: "",
              estimatedDeliveryMinutes: "45",
              fulfillmentMode: "delivery",
              orderSubmissionMode: "phone",
              acceptCash: true,
              acceptCliq: false,
              cliqAccountName: "",
              cliqIdentifier: "",
              customLinks: [],
              customInformation: [],
              operatingHours: { ...defaultOperatingHours },
              operatingHoursAr: { ...defaultOperatingHours },
              ...defaultStorefrontDesign,
            };

        let nextForm = databaseForm;
        let restoredDraftAt: string | null = null;

        if (typeof window !== "undefined") {
          const draftKey = storefrontDraftKey(selectedStore.retailer_id);

          try {
            const rawDraft = window.localStorage.getItem(draftKey);

            if (rawDraft) {
              const parsedDraft = JSON.parse(rawDraft) as {
                retailerId?: string;
                savedAt?: string;
                form?: Partial<StorefrontForm>;
              };

              if (
                parsedDraft.retailerId === selectedStore.retailer_id &&
                parsedDraft.form
              ) {
                const draftForm = {
                  ...databaseForm,
                  ...parsedDraft.form,
                } as StorefrontForm;

                nextForm = {
                  ...draftForm,
                  displayName:
                    draftForm.displayName?.trim() ||
                    databaseForm.displayName,
                  displayNameAr:
                    draftForm.displayNameAr?.trim() ||
                    databaseForm.displayNameAr,
                  tagline:
                    draftForm.tagline?.trim() ||
                    databaseForm.tagline,
                  taglineAr:
                    draftForm.taglineAr?.trim() ||
                    databaseForm.taglineAr,
                  addressText:
                    draftForm.addressText?.trim() ||
                    draftForm.addressTextAr?.trim() ||
                    "",
                  addressTextAr: "",
                  aboutText:
                    draftForm.aboutText?.trim() ||
                    draftForm.aboutTextAr?.trim() ||
                    "",
                  aboutTextAr: "",
                  customLinks: normalizeCustomLinks(
                    parsedDraft.form.customLinks
                  ),
                  customInformation: normalizeCustomInformation(
                    parsedDraft.form.customInformation
                  ),
                  operatingHours: mergeLegacyOperatingHours(
                    parsedDraft.form.operatingHours,
                    parsedDraft.form.operatingHoursAr
                  ),
                  operatingHoursAr: { ...defaultOperatingHours },
                };
                restoredDraftAt = parsedDraft.savedAt ?? new Date().toISOString();
              }
            }
          } catch {
            window.localStorage.removeItem(draftKey);
          }
        }

        // Never replace fields while the retailer has unsaved changes.
        if (retailerChanged || !setupFormDirtyRef.current) {
          setLocationLocked(Boolean(databaseForm.addressText.trim()));
          setLocatingStore(false);
          setSetupForm({
            ...nextForm,
            slug: isInternalSetupSlug142(nextForm.slug) ? "" : nextForm.slug,
          });

          const draftWasRestored = Boolean(restoredDraftAt);
          setupFormDirtyRef.current = draftWasRestored;
          setFormDirty(draftWasRestored);
          setDraftSavedAt(restoredDraftAt);

          if (draftWasRestored) {
            setMessage(
              "Your unsaved storefront changes were restored automatically."
            );
          }
        }
      }

      setProductCount(productResult.count ?? 0);
      setDirectOrderCount(orderCountResult.count ?? 0);

      if (!recentResult.error) {
        const orders = (recentResult.data ?? []) as RecentOrder[];
        setRecentOrders(orders);
        setDirectRevenue(
          orders.reduce((total, order) => total + Number(order.total ?? 0), 0)
        );
      }
    }

    loadStoreData();

    return () => {
      cancelled = true;
    };
  }, [selectedStore]);

  useEffect(() => {
    if (!selectedStore || !formDirty) return;

    const timer = window.setTimeout(() => {
      const savedAt = new Date().toISOString();

      window.localStorage.setItem(
        storefrontDraftKey(selectedStore.retailer_id),
        JSON.stringify({
          version: 1,
          retailerId: selectedStore.retailer_id,
          savedAt,
          form: setupForm,
        })
      );

      setDraftSavedAt(savedAt);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [selectedStore, setupForm, formDirty]);

  useEffect(() => {
    if (!formDirty) return;

    const protectUnsavedForm = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", protectUnsavedForm);

    return () => {
      window.removeEventListener("beforeunload", protectUnsavedForm);
    };
  }, [formDirty]);

  useEffect(() => {
    if (!selectedStore) {
      setSlugState("idle");
      return;
    }

    const slug = cleanSlug(setupForm.slug);
    if (slug.length < 2) {
      setSlugState("idle");
      return;
    }

    if (storefront && slug === storefront.slug) {
      setSlugState("available");
      return;
    }

    let cancelled = false;
    setSlugState("checking");
    const timer = window.setTimeout(async () => {
      const result = storefront
        ? await supabase.rpc("darik_direct_slug_available_for_store", {
            p_retailer_id: selectedStore.retailer_id,
            p_slug: slug,
          })
        : await supabase.rpc("darik_direct_slug_available", { p_slug: slug });

      if (cancelled) return;
      setSlugState(!result.error && result.data === true ? "available" : "taken");
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [selectedStore, storefront, setupForm.slug]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const result = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage("Signed in successfully.");
  }

  function updateSetupField<K extends keyof StorefrontForm>(
    field: K,
    value: StorefrontForm[K]
  ) {
    markSetupDirty();
    setSetupForm((current) => ({ ...current, [field]: value }));
  }

  function unlockStoreLocation() {
    if (!locationLocked) return;

    const confirmed = window.confirm(
      "Unlock the store location? Customers may be sent to the wrong place if this is changed by mistake. / \u0647\u0644 \u062a\u0631\u064a\u062f \u0641\u062a\u062d \u0642\u0641\u0644 \u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062a\u062c\u0631\u061f \u0642\u062f \u064a\u062a\u0645 \u062a\u0648\u062c\u064a\u0647 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0625\u0644\u0649 \u0645\u0643\u0627\u0646 \u062e\u0627\u0637\u0626 \u0625\u0630\u0627 \u062a\u0645 \u062a\u063a\u064a\u064a\u0631\u0647 \u0628\u0627\u0644\u062e\u0637\u0623."
    );

    if (!confirmed) return;

    setLocationLocked(false);
    setError("");
    setMessage(
      "Store location unlocked. Update it, then save the storefront profile. / \u062a\u0645 \u0641\u062a\u062d \u0642\u0641\u0644 \u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062a\u062c\u0631. \u0639\u062f\u0644 \u0627\u0644\u0645\u0648\u0642\u0639 \u062b\u0645 \u0627\u062d\u0641\u0638 \u0645\u0644\u0641 \u0627\u0644\u0645\u062a\u062c\u0631."
    );
  }

  function getCurrentStoreLocation() {
    if (locationLocked || locatingStore) return;

    if (!navigator.geolocation) {
      setError(
        "This browser does not support location access. Enter the store address manually. / \u0647\u0630\u0627 \u0627\u0644\u0645\u062a\u0635\u0641\u062d \u0644\u0627 \u064a\u062f\u0639\u0645 \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0645\u0648\u0642\u0639. \u0623\u062f\u062e\u0644 \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0645\u062a\u062c\u0631 \u064a\u062f\u0648\u064a\u0627."
      );
      return;
    }

    setLocatingStore(true);
    setError("");
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coordinateFallback = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        let address = coordinateFallback;

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
          const formattedAddress = String(
            json?.results?.[0]?.formatted_address ?? ""
          ).trim();

          if (formattedAddress) {
            address = formattedAddress;
          }
        } catch {
          // Coordinate fallback remains usable by Google Maps.
        }

        markSetupDirty();
        setSetupForm((current) => ({
          ...current,
          addressText: address,
          addressTextAr: "",
        }));
        setLocationLocked(true);
        setLocatingStore(false);
        setMessage(
          "Current store location captured and locked. Darik will save it automatically. / \u062a\u0645 \u062a\u062d\u062f\u064a\u062f \u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062a\u062c\u0631 \u0627\u0644\u062d\u0627\u0644\u064a \u0648\u0642\u0641\u0644\u0647. \u0627\u062d\u0641\u0638 \u0645\u0644\u0641 \u0627\u0644\u0645\u062a\u062c\u0631 \u0644\u0646\u0634\u0631\u0647."
        );
      },
      (geolocationError) => {
        setLocatingStore(false);

        const permissionDenied = geolocationError.code === 1;
        setError(
          permissionDenied
            ? "Location permission was denied. Allow location access in the browser, or enter the address manually. / \u062a\u0645 \u0631\u0641\u0636 \u0625\u0630\u0646 \u0627\u0644\u0645\u0648\u0642\u0639. \u0627\u0633\u0645\u062d \u0644\u0644\u0645\u062a\u0635\u0641\u062d \u0628\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0648\u0642\u0639 \u0623\u0648 \u0623\u062f\u062e\u0644 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u064a\u062f\u0648\u064a\u0627."
            : "Could not get the current location. Try again from the store, or enter the address manually. / \u062a\u0639\u0630\u0631 \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062d\u0627\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0645\u0646 \u0627\u0644\u0645\u062a\u062c\u0631 \u0623\u0648 \u0623\u062f\u062e\u0644 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u064a\u062f\u0648\u064a\u0627."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }
  function updateOperatingHour(day: string, value: string) {
    markSetupDirty();

    setSetupForm((current) => ({
      ...current,
      operatingHours: {
        ...current.operatingHours,
        [day]: value,
      },
    }));
  }

  function addCustomLink() {
    markSetupDirty();
    setSetupForm((current) => ({
      ...current,
      customLinks: [
        ...current.customLinks,
        { label: "", labelAr: "", url: "" },
      ],
    }));
  }

  function updateCustomLink(
    index: number,
    field: keyof CustomLink,
    value: string
  ) {
    markSetupDirty();
    setSetupForm((current) => ({
      ...current,
      customLinks: current.customLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link
      ),
    }));
  }

  function removeCustomLink(index: number) {
    markSetupDirty();
    setSetupForm((current) => ({
      ...current,
      customLinks: current.customLinks.filter(
        (_link, linkIndex) => linkIndex !== index
      ),
    }));
  }

  function addCustomInformation() {
    markSetupDirty();
    setSetupForm((current) => ({
      ...current,
      customInformation: [
        ...current.customInformation,
        { label: "", labelAr: "", value: "", valueAr: "" },
      ],
    }));
  }

  function updateCustomInformation(
    index: number,
    field: keyof CustomInformation,
    value: string
  ) {
    markSetupDirty();
    setSetupForm((current) => ({
      ...current,
      customInformation: current.customInformation.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function removeCustomInformation(index: number) {
    markSetupDirty();
    setSetupForm((current) => ({
      ...current,
      customInformation: current.customInformation.filter(
        (_item, itemIndex) => itemIndex !== index
      ),
    }));
  }

  async function uploadStorefrontAsset(
    event: ChangeEvent<HTMLInputElement>,
    assetType: "logo" | "hero"
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !selectedStore) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("The image must be 8 MB or smaller.");
      return;
    }

    setUploadingAsset(assetType);
    setError("");
    setMessage("");

    const safeName = safeAssetFileName(file.name);
    const extension =
      safeName.split(".").pop() ||
      file.type.split("/").pop() ||
      "jpg";

    const objectPath = `${selectedStore.retailer_id}/${assetType}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const uploadResult = await supabase.storage
      .from("darik-direct-storefront-assets")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadResult.error) {
      setError(uploadResult.error.message);
      setUploadingAsset(null);
      return;
    }

    const publicResult = supabase.storage
      .from("darik-direct-storefront-assets")
      .getPublicUrl(uploadResult.data.path);

    const publicUrl = publicResult.data.publicUrl;

    markSetupDirty();
    setSetupForm((current) => ({
      ...current,
      [assetType === "logo" ? "logoUrl" : "heroImageUrl"]: publicUrl,
    }));

    setMessage(
      assetType === "logo"
        ? "Logo uploaded. Darik will save it automatically."
        : "Cover image uploaded. Darik will save it automatically."
    );
    setUploadingAsset(null);
  }

  async function saveStorefront(
    event?: FormEvent,
    mode: "manual" | "auto" = "manual"
  ) {
    event?.preventDefault();

    if (!selectedStore) return;

    const slug = cleanSlug(setupForm.slug);
    if (isInternalSetupSlug142(slug)) {
      showSaveError(
        "Choose your real permanent Darik store link. setup-* addresses are internal only."
      );
      return;
    }
    const displayName = setupForm.displayName.trim();

    if (slug.length < 2) {
      showSaveError("The storefront link must contain at least two characters.");
      return;
    }

    if (slugState === "checking") {
      showSaveError("Wait a moment while Darik checks the store link / انتظر قليلاً حتى يتم التحقق من الرابط.");
      return;
    }

    if (slugState === "taken") {
      showSaveError("That Darik store link is already in use or reserved / رابط المتجر مستخدم أو محجوز.");
      return;
    }

    if (!displayName) {
      showSaveError("Storefront display name is required.");
      return;
    }

    const publicEmail = setupForm.publicEmail.trim();
    if (publicEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publicEmail)) {
      showSaveError("Enter a valid public email address or leave it blank.");
      return;
    }

    if (
      setupForm.showOrdering &&
      (setupForm.orderSubmissionMode === "phone" ||
        setupForm.orderSubmissionMode === "both") &&
      !setupForm.phone.trim() &&
      !setupForm.whatsapp.trim()
    ) {
      showSaveError(
        "Add a phone or WhatsApp number before enabling phone ordering."
      );
      return;
    }


    const onlineOrderingSelected =
      setupForm.showOrdering &&
      (setupForm.orderSubmissionMode === "online" ||
        setupForm.orderSubmissionMode === "both");

    if (onlineOrderingSelected && !setupForm.acceptCash && !setupForm.acceptCliq) {
      showSaveError("Select at least one online payment method: Cash or CliQ.");
      return;
    }

    if (setupForm.showOrdering && setupForm.acceptCliq && !setupForm.cliqAccountName.trim()) {
      showSaveError("Enter the CliQ account holder or business name.");
      return;
    }

    if (setupForm.showOrdering && setupForm.acceptCliq && !setupForm.cliqIdentifier.trim()) {
      showSaveError("Enter the store's CliQ alias or registered mobile number.");
      return;
    }

    setSaving(true);
    if (mode === "auto") {
      setAutoSaveStatus("saving");
    }
    setError("");
    setMessage("");

    const payload = {
      retailer_id: selectedStore.retailer_id,
      slug,
      display_name: displayName,
      display_name_ar: setupForm.displayNameAr.trim() || null,
      tagline: setupForm.tagline.trim() || null,
      tagline_ar: setupForm.taglineAr.trim() || null,
      logo_url: setupForm.logoUrl.trim() || null,
      hero_image_url: setupForm.heroImageUrl.trim() || null,
      business_phone: setupForm.phone.trim() || null,
      whatsapp_number: setupForm.whatsapp.trim() || null,
      public_email: publicEmail || null,
      website_url: normalizeOptionalWebUrl(setupForm.websiteUrl),
      facebook_url: normalizeOptionalWebUrl(setupForm.facebookUrl),
      instagram_url: normalizeOptionalWebUrl(setupForm.instagramUrl),
      address_text: setupForm.addressText.trim() || null,
      address_text_ar: null,
      about_text: setupForm.aboutText.trim() || null,
      about_text_ar: null,
      custom_links: setupForm.customLinks
        .map((link) => ({
          label: link.label.trim(),
          url: link.url.trim(),
        }))
        .filter((link) => link.label && link.url),
      custom_information: setupForm.customInformation
        .map((item) => ({
          label: item.label.trim(),
          value: item.value.trim(),
        }))
        .filter((item) => item.label && item.value),
      operating_hours: Object.fromEntries(
        operatingDays.map(([day]) => [
          day,
          setupForm.operatingHours[day]?.trim() || "",
        ])
      ),
      operating_hours_ar: {},
      direct_content_positioning: storefrontContentPositioning145,
      design_draft: {
        ...designFromForm(setupForm),
        primaryColor: setupForm.primaryColor,
        accentColor: setupForm.accentColor,
        backgroundColor: setupForm.backgroundColor,
      },
      delivery_enabled: setupForm.fulfillmentMode === "delivery",
      pickup_enabled: true,
      delivery_fee:
        setupForm.fulfillmentMode === "delivery"
          ? Number(setupForm.deliveryFee || 0)
          : 0,
      minimum_order: Number(setupForm.minimumOrder || 0),
      delivery_radius_km:
        setupForm.fulfillmentMode === "delivery" && setupForm.deliveryRadiusKm
          ? Number(setupForm.deliveryRadiusKm)
          : 0.1,
      estimated_delivery_minutes:
        setupForm.fulfillmentMode === "delivery" &&
        setupForm.estimatedDeliveryMinutes
          ? Number(setupForm.estimatedDeliveryMinutes)
          : null,
    };

    const { slug: _payloadSlug, ...existingStorePayload } = payload;
    const slugChanged = Boolean(storefront && slug !== storefront.slug);

    const result = storefront
      ? await supabase
          .from("retailer_storefronts")
          .update(existingStorePayload)
          .eq("id", storefront.id)
          .select("*")
          .single()
      : await supabase
          .from("retailer_storefronts")
          .insert({
            ...payload,
            storefront_status: "draft",
            direct_storefront_enabled: false,
            marketplace_listing_enabled: true,
            is_accepting_orders: false,
            primary_color: setupForm.primaryColor,
            accent_color: setupForm.accentColor,
            background_color: setupForm.backgroundColor,
            storefront_theme: setupForm.storefrontTheme,
            appearance_mode: setupForm.appearanceMode,
            product_card_style: setupForm.productCardStyle,
            corner_style: setupForm.cornerStyle,
            hero_layout: setupForm.heroLayout,
            section_order: setupForm.sectionOrder,
            show_prices: setupForm.showPrices,
            show_ordering: setupForm.showOrdering,
            show_phone: setupForm.showPhone,
            show_whatsapp: setupForm.showWhatsapp,
            show_store_story: setupForm.showStoreStory,
          })
          .select("*")
          .single();

    if (result.error) {
      showSaveError(formatSupabaseSaveError(result.error));
      return;
    }

    let profileStorefront = result.data as StorefrontSettings;

    if (storefront && slugChanged) {
      const slugResult = await supabase.rpc("darik_direct_update_store_slug", {
        p_retailer_id: selectedStore.retailer_id,
        p_slug: slug,
      });

      if (slugResult.error) {
        showSaveError(
          `The storefront settings saved, but the store link could not be changed: ${formatSupabaseSaveError(slugResult.error)}`
        );
        return;
      }

      profileStorefront = { ...profileStorefront, slug };
    }

    const paymentResult = await supabase.rpc(
      "darik_direct_save_payment_preferences",
      {
        p_storefront_id: profileStorefront.id,
        p_order_submission_mode: setupForm.orderSubmissionMode,
        p_cash_on_delivery_enabled: setupForm.acceptCash,
        p_cliq_enabled: setupForm.acceptCliq,
        p_cliq_account_name: setupForm.acceptCliq
          ? setupForm.cliqAccountName.trim()
          : null,
        p_cliq_payment_identifier: setupForm.acceptCliq
          ? setupForm.cliqIdentifier.trim()
          : null,
      }
    );

    if (paymentResult.error) {
      showSaveError(
        `The storefront profile saved, but the payment options did not: ${formatSupabaseSaveError(
          paymentResult.error
        )}`
      );
      return;
    }

    const savedStorefront: StorefrontSettings = {
      ...profileStorefront,
      order_submission_mode: setupForm.orderSubmissionMode,
      cash_on_delivery_enabled: setupForm.acceptCash,
      cliq_enabled: setupForm.acceptCliq,
      cliq_account_name: setupForm.acceptCliq
        ? setupForm.cliqAccountName.trim()
        : null,
      cliq_payment_identifier: setupForm.acceptCliq
        ? setupForm.cliqIdentifier.trim()
        : null,
      delivery_enabled: setupForm.fulfillmentMode === "delivery",
      pickup_enabled: true,
    };

    setStorefront(savedStorefront);
    setSetupForm((current) => ({
      ...current,
      slug: savedStorefront.slug,
      displayName: savedStorefront.display_name,
    }));

    setLocationLocked(Boolean(setupForm.addressText.trim()));
    setLocatingStore(false);

    setupFormDirtyRef.current = false;
    setFormDirty(false);
    setDraftSavedAt(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(
        storefrontDraftKey(selectedStore.retailer_id)
      );
    }

    setAutoSaveStatus("saved");
    if (mode === "manual") {
      setMessage(
        storefront
          ? "Storefront settings updated."
          : "Draft storefront created. Preview it privately, then submit CliQ activation when ready."
      );
    } else {
      setMessage("");
    }
    setSaving(false);
    if (mode === "manual") {
      await loadContext();
    }
  }

  useEffect(() => {
    if (
      !formDirty ||
      !selectedStore ||
      saving ||
      uploadingAsset !== null ||
      slugState === "checking" ||
      slugState === "taken"
    ) {
      return;
    }

    const slug = cleanSlug(setupForm.slug);
    const displayName = setupForm.displayName.trim();
    const publicEmail = setupForm.publicEmail.trim();
    const onlineOrderingSelected =
      setupForm.showOrdering &&
      (setupForm.orderSubmissionMode === "online" ||
        setupForm.orderSubmissionMode === "both");

    const formIsReady =
      slug.length >= 2 &&
      Boolean(displayName) &&
      (!publicEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publicEmail)) &&
      (!setupForm.showOrdering ||
        (setupForm.orderSubmissionMode !== "phone" &&
          setupForm.orderSubmissionMode !== "both") ||
        Boolean(setupForm.phone.trim() || setupForm.whatsapp.trim())) &&
      (!onlineOrderingSelected ||
        setupForm.acceptCash ||
        setupForm.acceptCliq) &&
      (!setupForm.showOrdering ||
        !setupForm.acceptCliq ||
        Boolean(setupForm.cliqAccountName.trim())) &&
      (!setupForm.showOrdering ||
        !setupForm.acceptCliq ||
        Boolean(setupForm.cliqIdentifier.trim()));

    if (!formIsReady) {
      setAutoSaveStatus("waiting");
      return;
    }

    setAutoSaveStatus("waiting");
    const timer = window.setTimeout(() => {
      void saveStorefront(undefined, "auto");
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    formDirty,
    saving,
    selectedStore,
    setupForm,
    slugState,
    uploadingAsset,
  ]);

  async function publishStorefrontDesign() {
    if (!storefront || !selectedStore) {
      setError("Create and save the storefront before publishing its design.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const design = designFromForm(setupForm);
    const result = await supabase
      .from("retailer_storefronts")
      .update({
        storefront_theme: design.storefrontTheme,
        appearance_mode: design.appearanceMode,
        product_card_style: design.productCardStyle,
        corner_style: design.cornerStyle,
        hero_layout: design.heroLayout,
        section_order: design.sectionOrder,
        show_prices: design.showPrices,
        show_ordering: design.showOrdering,
        show_phone: design.showPhone,
        show_whatsapp: design.showWhatsapp,
        show_store_story: design.showStoreStory,
        primary_color: setupForm.primaryColor,
        accent_color: setupForm.accentColor,
        background_color: setupForm.backgroundColor,
        design_draft: null,
        design_published_at: new Date().toISOString(),
      })
      .eq("id", storefront.id)
      .select("*")
      .single();

    setSaving(false);

    if (result.error) {
      showSaveError(formatSupabaseSaveError(result.error));
      return;
    }

    setStorefront(result.data as StorefrontSettings);
    setMessage(
      formDirty
        ? "Design published. Other storefront changes are still unsaved—press Save storefront profile when ready. / تم نشر التصميم، وما زالت هناك تغييرات أخرى غير محفوظة."
        : "Design published / تم نشر تصميم المتجر"
    );
  }

  async function toggleOrders() {
    if (!storefront) return;

    setSaving(true);
    setError("");
    setMessage("");

    const result = await supabase
      .from("retailer_storefronts")
      .update({ is_accepting_orders: !storefront.is_accepting_orders })
      .eq("id", storefront.id)
      .select("*")
      .single();

    if (result.error) {
      setError(result.error.message);
    } else {
      setStorefront(result.data as StorefrontSettings);
      setMessage(
        result.data.is_accepting_orders
          ? "Storefront is accepting orders."
          : "New direct orders are paused."
      );
    }

    setSaving(false);
  }

  useEffect(() => {
    if (!storefront?.slug) {
      setSelectedThemeField("");
      setThemeSaveState("idle");
      return;
    }

    let cancelled = false;

    void (async () => {
      setThemeSaveState("loading");
      const result = await supabase.rpc("darik_direct_public_theme_field", {
        p_slug: storefront.slug,
      });

      if (cancelled) return;

      if (result.error) {
        setThemeSaveState("error");
        return;
      }

      setSelectedThemeField(String(result.data ?? "").trim().toLowerCase());
      setThemeSaveState("idle");
    })();

    return () => {
      cancelled = true;
    };
  }, [storefront?.id, storefront?.slug]);

  useEffect(() => {
    if (!selectedThemeField || themeSaveState === "saving") return;
    setLiveBuilderPreviewTheme138((current) => current || selectedThemeField);
  }, [selectedThemeField, themeSaveState]);
  async function chooseStorefrontTheme(themeField: string) {
    if (themeSaveState === "saving") {
      return;
    }

    if (themeField === selectedThemeField) {
      setThemePickerOpen(false);
      setLiveBuilderPreviewTheme138((current) => current || themeField);
      setLiveBuilderPreviewOpen(true);
      return;
    }

    if (!storefront) {
      setSelectedThemeField(themeField);
      setThemePickerOpen(false);

      if (selectedStore?.retailer_id) {
        window.localStorage.setItem(
          `darik-pending-theme-${selectedStore.retailer_id}`,
          themeField
        );
      }

      setLiveBuilderPreviewTheme138(themeField);
      setLiveBuilderPreviewOpen(true);
      return;
    }

    const previousTheme = selectedThemeField;
    setSelectedThemeField(themeField);
    setThemeSaveState("saving");
    setError("");

    const result = await supabase.rpc("darik_direct_set_storefront_theme", {
      p_storefront_id: storefront.id,
      p_theme_field: themeField,
    });

    if (result.error) {
      setSelectedThemeField(previousTheme);
      setThemeSaveState("error");
      setError(result.error.message || "Could not save the storefront theme.");
      return;
    }

    setLiveBuilderPreviewTheme138(themeField);
    setLiveBuilderPreviewOpen(true);
    setThemePickerOpen(false);
    if (selectedStore?.retailer_id) {
      window.localStorage.removeItem(`darik-pending-theme-${selectedStore.retailer_id}`);
    }
    setThemeSaveState("saved");
    window.setTimeout(() => {
      setThemeSaveState((current) => (current === "saved" ? "idle" : current));
    }, 1800);
  }

  useEffect(() => {
    if (!storefront?.id || !selectedStore?.retailer_id) return;

    const pending = window.localStorage.getItem(
      `darik-pending-theme-${selectedStore.retailer_id}`
    );

    if (!pending) return;

    const valid = storefrontThemeOptions.some((theme) => theme.key === pending);
    if (!valid) {
      window.localStorage.removeItem(`darik-pending-theme-${selectedStore.retailer_id}`);
      return;
    }

    setSelectedThemeField(pending);

    void (async () => {
      const result = await supabase.rpc("darik_direct_set_storefront_theme", {
        p_storefront_id: storefront.id,
        p_theme_field: pending,
      });

      if (!result.error) {
        window.localStorage.removeItem(`darik-pending-theme-${selectedStore.retailer_id}`);
      }
    })();
  }, [storefront?.id, selectedStore?.retailer_id]);

  function previewSelectedTheme() {
    if (!storefront || !selectedThemeField) return;

    const path = `/${storefront.slug}?previewField=${encodeURIComponent(
      selectedThemeField
    )}&fieldLab=1`;

    window.open(path, "_blank", "noopener,noreferrer");
  }

  if (!authReady) {
    return (
      <main className={styles.centerPage}>
        <div className={styles.spinner} />
        <h1>Loading Darik Direct…</h1>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.loginPage}>
        <section className={styles.loginCard}>
          <div className={styles.loginBrand}>
            <span>Darik Direct</span>
            <h1>Store dashboard</h1>
            <p>
              Sign in / تسجيل الدخول using the email connected to your existing Darik retailer
              account.
            </p>
          </div>

          <form onSubmit={signIn} className={styles.loginForm}>
            <label>
              Email / البريد الإلكتروني
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password / كلمة المرور
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}
            {message ? <p className={styles.success}>{message}</p> : null}

            <button type="submit">Sign in / تسجيل الدخول</button>
          </form>

          <a className={styles.marketplaceLink} href="/">
            Return to Darik Marketplace
          </a>
        </section>
      </main>
    );
  }

  if (loadingContext) {
    return (
      <main className={styles.centerPage}>
        <div className={styles.spinner} />
        <h1>Opening your store dashboard…</h1>
      </main>
    );
  }

  return (
    <main className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.brandEyebrow}>Darik</p>
          <h1>Direct</h1>
        </div>

        <nav>
          <a href="/store-dashboard">Overview</a>
          <a className={styles.activeNav} href="/store-dashboard/storefront">
            Storefront
          </a>
          <a href="/store-dashboard/orders">Orders</a>
          <a href="/store-dashboard/products">Products</a>
          <a href="/store-dashboard/categories">Categories</a>
          <a href="/store-dashboard/activation">Go live</a>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>{session.user.user_metadata?.darik_retailer_username ? `@${session.user.user_metadata.darik_retailer_username}` : session.user.email}</span>
          <DashboardLogoutButton />
        </div>
      </aside>

      <section className={styles.dashboardContent}>
        <header className={styles.topbar}>
          <div>
            <p>Storefront management / إدارة واجهة المتجر</p>
            <h2>{selectedStore?.business_name || "Darik retailer"}</h2>
          </div>

          {context && context.stores.length > 1 ? (
            <select
              value={selectedRetailerId}
              onChange={(event) => setSelectedRetailerId(event.target.value)}
            >
              {context.stores.map((store) => (
                <option key={store.retailer_id} value={store.retailer_id}>
                  {store.business_name}
                </option>
              ))}
            </select>
          ) : null}
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        {!selectedStore ? (
          <section className={styles.emptyState}>
            <span>No retailer membership found / لم يتم العثور على عضوية متجر</span>
            <h2>This login is not connected to a Darik retailer / هذا الحساب غير مرتبط بمتجر على داريك.</h2>
            <p>
              The Auth email must match an existing retailer email, or the user
              must be added to retailer_store_members.
            </p>
          </section>
        ) : (
          <>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <p>Store setup / إعداد المتجر</p>
                  <h2>
                    {storefront
                      ? "Manage your Darik Direct storefront / إدارة واجهة متجرك"
                      : "Create your first storefront / أنشئ واجهة متجرك الأولى"}
                  </h2>
                </div>

                {storefront ? (
                  <div className={styles.panelActions}>

                    {storefront.activation_status === "active" ? (
                      <>
                      </>
                    ) : (
                      <a href="/store-dashboard/activation">Pay by CliQ to go live / ادفع عبر كليك لتفعيل المتجر</a>
                    )}
                  </div>
                ) : null}
              </div>

              <form className={styles.setupForm} onSubmit={saveStorefront} noValidate>
                  <section className={designStyles.storefrontSetupController109}>
                    <div className={designStyles.storefrontSetupControllerTop109}>
                      <div>
                        <span>
                          {storefrontSetupMode109 === "tabs"
                            ? "STOREFRONT SETTINGS / إعدادات واجهة المتجر"
                            : "FIRST-TIME STOREFRONT SETUP / إعداد واجهة المتجر لأول مرة"}
                        </span>
                        <h3>
                          {storefrontSetupMode109 === "tabs"
                            ? "Edit your storefront / عدّل واجهة متجرك"
                            : `Step ${storefrontSetupStep109} of 11 / الخطوة ${storefrontSetupStep109} من 11`}
                        </h3>
                        <p>
                          {storefrontSetupMode109 === "tabs"
                            ? "Your initial setup is complete. Jump directly to any section."
                            : "We will build the storefront one clean step at a time. Your live preview stays above you."}
                        </p>
                      </div>
                      {storefrontSetupMode109 === "wizard" ? (
                        <b>{Math.round((storefrontSetupStep109 / 11) * 100)}%</b>
                      ) : (
                        <b>EDIT</b>
                      )}
                    </div>

                    <div
                      className={
                        storefrontSetupMode109 === "tabs"
                          ? designStyles.storefrontSetupTabs109
                          : designStyles.storefrontSetupSteps109
                      }
                    >
                      {darikStorefrontSetupSteps109.map((item) => {
                        const active =
                          storefrontSetupMode109 === "tabs"
                            ? storefrontSetupTab109 === item.step
                            : storefrontSetupStep109 === item.step;
                        const completed =
                          storefrontSetupMode109 === "wizard" &&
                          item.step < storefrontSetupStep109;

                        return (
                          <button
                            type="button"
                            key={item.step}
                            className={`${designStyles.storefrontSetupStepChip109} ${
                              active
                                ? designStyles.storefrontSetupStepChipActive109
                                : ""
                            } ${
                              completed
                                ? designStyles.storefrontSetupStepChipDone109
                                : ""
                            }`}
                            disabled={
                              storefrontSetupMode109 === "loading" ||
                              (storefrontSetupMode109 === "wizard" &&
                                item.step > storefrontSetupStep109)
                            }
                            onClick={() => {
                              setStorefrontSetupNotice109("");
                              if (storefrontSetupMode109 === "tabs") {
                                setStorefrontSetupTab109(item.step);
                              } else if (item.step <= storefrontSetupStep109) {
                                setStorefrontSetupStep109(item.step);
                              }
                            }}
                          >
                            <i>{item.step}</i>
                            <span>
                              <strong>{item.en}</strong>
                              <small>{item.ar}</small>
                            </span>
                            {item.optional ? <em>Optional</em> : null}
                          </button>
                        );
                      })}
                    </div>

                    {storefrontSetupNotice109 ? (
                      <div className={designStyles.storefrontSetupNotice109}>
                        {storefrontSetupNotice109}
                      </div>
                    ) : null}
                  </section>

                  {storefrontSetupVisibleStep109 === 1 ? (
                    <section
                      data-darik-setup-step="1"
                      className={designStyles.storefrontSetupTheme109}
                    >
                      <div>
                        <span>STEP 1 / الخطوة ١</span>
                        <h3>Choose your storefront theme / اختر قالب متجرك</h3>
                        <p>
                          Theme controls the visual personality only. Your retail
                          field continues to control product and ordering mechanics.
                        </p>
                      </div>
                      <div className={designStyles.storefrontSetupThemeCurrent109}>
                        <div>
                          <small>Current theme / القالب الحالي</small>
                          <strong>
                            {selectedThemeOption?.name || "Choose a theme"}
                          </strong>
                          <span>
                            {selectedThemeOption?.vibe ||
                              "Pick the design that best represents your business."}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setThemePickerOpen(true)}
                        >
                          Change theme / تغيير القالب
                        </button>
                      </div>
                    </section>
                  ) : null}
              {!selectedThemeField || themePickerOpen ? (
                <section className={designStyles.themeFirstStepScreen}>
                  <div className={designStyles.themeFirstStepHeader}>
                    <div>
                      <span className={designStyles.themeStepBadge}>STEP 1</span>
                      <span className={designStyles.themeFirstEyebrow}>
                        STOREFRONT THEMES / قوالب واجهة المتجر
                      </span>
                      <h2>Choose your look / اختر تصميم متجرك</h2>
                      <p>
                        Pick the storefront style that feels right for your business.
                        <strong> You can change this at any time.</strong>
                        {" / اختر التصميم الأنسب لمتجرك. يمكنك تغيير القالب في أي وقت."}
                      </p>
                    </div>
                    {selectedThemeField ? (
                      <button
                        type="button"
                        className={designStyles.themeKeepCurrentButton}
                        onClick={() => setThemePickerOpen(false)}
                      >
                        Keep current theme / الاحتفاظ بالقالب الحالي
                      </button>
                    ) : null}
                  </div>

                  <div className={designStyles.themeGalleryGrid}>
                    {storefrontThemeOptions.map((theme) => {
                      const selected = selectedThemeField === theme.key;

                      return (
                        <button
                          type="button"
                          className={`${designStyles.themeCard} ${
                            selected ? designStyles.themeCardSelected : ""
                          }`}
                          key={theme.key}
                          aria-pressed={selected}
                          disabled={themeSaveState === "saving"}
                          onClick={() => void chooseStorefrontTheme(theme.key)}
                        >
                          <div
                            className={designStyles.themeMiniBrowser}
                            style={{ background: theme.palette[2] }}
                          >
                            <div className={designStyles.themeMiniTopbar}>
                              <i style={{ background: theme.palette[0] }} />
                              <span style={{ background: theme.palette[0] }} />
                              <span style={{ background: theme.palette[1] }} />
                            </div>
                            <div
                              className={designStyles.themeMiniHero}
                              style={{
                                background: `linear-gradient(135deg, ${theme.palette[0]}, ${theme.palette[1]})`,
                              }}
                            >
                              <span />
                              <strong />
                            </div>
                            <div className={designStyles.themeMiniCatalog}>
                              <i style={{ borderColor: theme.palette[1] }} />
                              <i style={{ borderColor: theme.palette[1] }} />
                              <i style={{ borderColor: theme.palette[1] }} />
                            </div>
                          </div>

                          <div className={designStyles.themeCardTop}>
                            <div>
                              <strong className={designStyles.themeCardName}>
                                {theme.name}
                              </strong>
                              <small className={designStyles.themeCardVibe}>
                                {theme.vibe}
                              </small>
                            </div>
                            {selected ? (
                              <span className={designStyles.themeSelectedPill}>
                                Selected / مختار
                              </span>
                            ) : null}
                          </div>

                          <div className={designStyles.themeSwatches} aria-hidden="true">
                            {theme.palette.map((color) => (
                              <i key={color} style={{ background: color }} />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className={designStyles.themeFirstStepFoot}>
                    <strong>
                      Theme changes appearance only.
                    </strong>
                    <span>
                      Your real retail field still controls sizes, fitment, category mechanics,
                      product behavior, ordering features, and every field-specific function.
                    </span>
                  </div>
                </section>
              ) : (
                <>
                {!liveBuilderPreviewOpen ? (
                  <button
                    type="button"
                    className={designStyles.liveBuilderOpenPreviewTab107}
                    onClick={() => setLiveBuilderPreviewOpen(true)}
                  >
                    Open preview / فتح المعاينة
                  </button>
                ) : null}
                <section
                  className={`${designStyles.liveBuilderPreviewShell} ${
                    !liveBuilderPreviewOpen
                      ? designStyles.liveBuilderPreviewShellClosed107
                      : ""
                  }`}

                  data-darik-preview-expanded={
                    liveBuilderPreviewExpanded111 ? "true" : "false"
                  }
                >
                  <div className={designStyles.liveBuilderPreviewBar}>
                    <div className={designStyles.liveBuilderPreviewIdentity}>
                      <span className={designStyles.liveBuilderLiveDot} />
                      <div>
                        <strong>LIVE STOREFRONT PREVIEW</strong>
                        <small>
                          {selectedThemeOption?.name || "Darik Theme"} · Scroll inside the preview
                        </small>
                      </div>
                    </div>

                    <div className={designStyles.liveBuilderPreviewActions}>
                      <button
                        type="button"
                        onClick={() => setThemePickerOpen(true)}
                      >
                        Change theme / تغيير القالب
                      </button>
                                            <button
                        type="button"
                        onClick={() =>
                          setLiveBuilderPreviewExpanded111((current) => !current)
                        }
                        disabled={!storefront}
                      >
                        {liveBuilderPreviewExpanded111
                          ? "Half screen / نصف الشاشة"
                          : "Full screen / ملء الشاشة"}
                      </button>
                      <button
                        type="button"
                        className={designStyles.liveBuilderClosePreview107}
                        onClick={() => {
                          setLiveBuilderPreviewExpanded111(false);
                          setLiveBuilderPreviewOpen(false);
                        }}
                      >
                        Close preview / إغلاق المعاينة
                      </button>
                    </div>
                  </div>

                  <div className={designStyles.liveBuilderPreviewViewport}>
                    {storefront && liveBuilderPreviewTheme138 && realPrivatePreviewKey143 ? (
                      <iframe
                        ref={liveBuilderPreviewRef}
                        title="Live Darik storefront preview"
                        src={`/_darik-private-store-preview?storefrontId=${encodeURIComponent(
                          storefront.id
                        )}&previewField=${encodeURIComponent(
                          liveBuilderPreviewTheme138
                        )}&fieldLab=1&builderPreview=1&previewKey=${encodeURIComponent(
                          realPrivatePreviewKey143
                        )}`}
                        onLoad={pushLiveBuilderDraft}
                      />
                    ) : (
                      <div
                        className={designStyles.liveBuilderLocalPreview}
                        style={{
                          background: selectedThemeOption?.palette[2] || "#F8FAFC",
                        }}
                      >
                        <div
                          className={designStyles.liveBuilderLocalHero}
                          style={{
                            background: `linear-gradient(135deg, ${
                              selectedThemeOption?.palette[0] || "#111827"
                            }, ${selectedThemeOption?.palette[1] || "#2563EB"})`,
                          }}
                        >
                          <span>LIVE DRAFT</span>
                          <strong
                            style={storefrontTypographyPreviewStyle(
                              storefrontTypographyDraft,
                              "display_name"
                            )}
                          >
                            {liveBuilderDraftText("displayName") || "Your Store"}
                          </strong>
                          <p
                            style={storefrontTypographyPreviewStyle(
                              storefrontTypographyDraft,
                              "tagline"
                            )}
                          >
                            {liveBuilderDraftText("tagline") ||
                              "Your storefront will come alive here as you enter your information."}
                          </p>
                        </div>
                        <div className={designStyles.liveBuilderLocalCatalog}>
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                        <small>
                          Opening your real private storefront preview...
                        </small>
                      </div>
                    )}
                  </div>
                </section>
                  <div
                    className={`${designStyles.liveBuilderPreviewSpacer} ${
                      !liveBuilderPreviewOpen
                        ? designStyles.liveBuilderPreviewSpacerClosed107
                        : ""
                    }`}
                    aria-hidden="true"
                  />
                  <div className={designStyles.liveBuilderEditorPane}>
                    {/* DARIK_CLICK_PREVIEW_POSITIONING_145 */}
                    {liveBuilderPreviewOpen ? (
                      <aside
                        className={designStyles.previewPositionPanel145}
                        data-selected={
                          selectedPreviewPosition145 ? "true" : "false"
                        }
                      >
                        {selectedPreviewPosition145 ? (
                          <>
                            <div
                              className={
                                designStyles.previewPositionPanelHeader145
                              }
                            >
                              <div>
                                <span>
                                  POSITION SELECTED ELEMENT / موضع العنصر
                                </span>
                                <strong>
                                  {
                                    storefrontPositionLabels145[
                                      selectedPreviewPosition145
                                    ]
                                  }
                                </strong>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPreviewPosition145(null)
                                }
                                aria-label="Close positioning controls"
                              >
                                Close
                              </button>
                            </div>

                            <div
                              className={
                                designStyles.previewPositionDeviceTabs145
                              }
                            >
                              <button
                                type="button"
                                data-active={
                                  previewPositionDevice145 === "desktop"
                                    ? "true"
                                    : "false"
                                }
                                onClick={() =>
                                  setPreviewPositionDevice145("desktop")
                                }
                              >
                                Desktop
                              </button>
                              <button
                                type="button"
                                data-active={
                                  previewPositionDevice145 === "mobile"
                                    ? "true"
                                    : "false"
                                }
                                onClick={() =>
                                  setPreviewPositionDevice145("mobile")
                                }
                              >
                                Mobile
                              </button>
                            </div>

                            <div
                              className={
                                designStyles.previewPositionPad145
                              }
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  nudgePreviewPosition145(0, -2)
                                }
                                aria-label="Move up"
                              >
                                Up
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  nudgePreviewPosition145(-2, 0)
                                }
                                aria-label="Move left"
                              >
                                Left
                              </button>
                              <button
                                type="button"
                                className={
                                  designStyles.previewPositionReset145
                                }
                                onClick={resetSelectedPreviewPosition145}
                              >
                                Center
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  nudgePreviewPosition145(2, 0)
                                }
                                aria-label="Move right"
                              >
                                Right
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  nudgePreviewPosition145(0, 2)
                                }
                                aria-label="Move down"
                              >
                                Down
                              </button>
                            </div>

                            <div
                              className={
                                designStyles.previewPositionNumbers145
                              }
                            >
                              <label>
                                <span>X / أفقي</span>
                                <input
                                  type="number"
                                  min={-240}
                                  max={240}
                                  value={
                                    storefrontContentPositioning145[
                                      selectedPreviewPosition145
                                    ][previewPositionDevice145].x
                                  }
                                  onChange={(event) => {
                                    const point =
                                      storefrontContentPositioning145[
                                        selectedPreviewPosition145
                                      ][previewPositionDevice145];
                                    updatePreviewPosition145(
                                      selectedPreviewPosition145,
                                      previewPositionDevice145,
                                      Number(event.target.value),
                                      point.y
                                    );
                                  }}
                                />
                              </label>
                              <label>
                                <span>Y / عمودي</span>
                                <input
                                  type="number"
                                  min={-240}
                                  max={240}
                                  value={
                                    storefrontContentPositioning145[
                                      selectedPreviewPosition145
                                    ][previewPositionDevice145].y
                                  }
                                  onChange={(event) => {
                                    const point =
                                      storefrontContentPositioning145[
                                        selectedPreviewPosition145
                                      ][previewPositionDevice145];
                                    updatePreviewPosition145(
                                      selectedPreviewPosition145,
                                      previewPositionDevice145,
                                      point.x,
                                      Number(event.target.value)
                                    );
                                  }}
                                />
                              </label>
                            </div>

                            <div
                              className={
                                designStyles.previewPositionPanelFooter145
                              }
                            >
                              <span>
                                Arrow keys = 1px. Shift + arrow = 8px.
                              </span>
                              <strong
                                data-state={previewPositionSaveState145}
                              >
                                {previewPositionSaveState145 === "saving"
                                  ? "Saving..."
                                  : previewPositionSaveState145 === "waiting"
                                    ? "Waiting to save..."
                                    : previewPositionSaveState145 === "error"
                                      ? "Save failed"
                                      : previewPositionSaveState145 === "saved"
                                        ? "Saved"
                                        : storefront?.id
                                          ? "Ready"
                                          : "Saves when storefront exists"}
                              </strong>
                            </div>

                            <button
                              type="button"
                              className={
                                designStyles.previewPositionResetAll145
                              }
                              onClick={resetAllPreviewPositions145}
                            >
                              Reset all positions to theme defaults
                            </button>
                          </>
                        ) : (
                          <div
                            className={
                              designStyles.previewPositionHint145
                            }
                          >
                            <strong>
                              Click text inside the preview to position it
                            </strong>
                            <span>
                              Store name, Arabic name, tagline, Arabic
                              tagline, or Shop tab.
                            </span>
                          </div>
                        )}
                      </aside>
                    ) : null}


{/* DARIK_EXACT_STOREFRONT_WIZARD_109_V6 */}
                <div className={designStyles.exactWizardStage109V5}>
                  {storefrontSetupVisibleStep109 === 1 ? (
                    <section data-darik-exact-step="1" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 1 / الخطوة ١</span>
                        <h3>Choose a theme / اختر القالب</h3>
                        <p>Select the storefront design you want. To change it later, simply select a different theme here.</p>
                      </div>

                      <div className={designStyles.themeGalleryGrid}>
                        {storefrontThemeOptions.map((theme) => {
                          const selected = selectedThemeField === theme.key;

                          return (
                            <button
                              type="button"
                              className={`${designStyles.themeCard} ${
                                selected ? designStyles.themeCardSelected : ""
                              }`}
                              key={theme.key}
                              aria-pressed={selected}
                              disabled={themeSaveState === "saving"}
                              onClick={() => void chooseStorefrontTheme(theme.key)}
                            >
                              <div
                                className={designStyles.themeMiniBrowser}
                                style={{ background: theme.palette[2] }}
                              >
                                <div className={designStyles.themeMiniTopbar}>
                                  <i style={{ background: theme.palette[0] }} />
                                  <span style={{ background: theme.palette[0] }} />
                                  <span style={{ background: theme.palette[1] }} />
                                </div>
                                <div
                                  className={designStyles.themeMiniHero}
                                  style={{
                                    background: `linear-gradient(135deg, ${theme.palette[0]}, ${theme.palette[1]})`,
                                  }}
                                >
                                  <span />
                                  <strong />
                                </div>
                                <div className={designStyles.themeMiniCatalog}>
                                  <i style={{ borderColor: theme.palette[1] }} />
                                  <i style={{ borderColor: theme.palette[1] }} />
                                  <i style={{ borderColor: theme.palette[1] }} />
                                </div>
                              </div>

                              <div className={designStyles.themeCardTop}>
                                <div>
                                  <strong className={designStyles.themeCardName}>
                                    {theme.name}
                                  </strong>
                                  <small className={designStyles.themeCardVibe}>
                                    {theme.vibe}
                                  </small>
                                </div>
                                {selected ? (
                                  <span className={designStyles.themeSelectedPill}>
                                    Selected / مختار
                                  </span>
                                ) : null}
                              </div>

                              <div className={designStyles.themeSwatches} aria-hidden="true">
                                {theme.palette.map((color) => (
                                  <i key={color} style={{ background: color }} />
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className={designStyles.themeFirstStepFoot}>
                        <strong>Theme changes appearance only.</strong>
                        <span>
                          Your retail field still controls product mechanics, categories, sizing, fitment, and store functions.
                        </span>
                      </div>
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 2 ? (
                    <section data-darik-exact-step="2" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 2 / الخطوة ٢</span>
                        <h3>Logo & storefront image / الشعار وصورة واجهة المتجر</h3>
                        <p>This step contains only your logo and storefront image.</p>
                      </div>
                      <div className={designStyles.exactWizardAssetGrid109V5}>
                        <article className={designStyles.exactWizardAssetCard109V5}>
                          <div className={designStyles.exactWizardLogo109V5}>
                            {setupForm.logoUrl ? (
                              <img src={setupForm.logoUrl} alt="Store logo preview" />
                            ) : (
                              <span>{(setupForm.displayName || "S").slice(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <strong>Store logo / شعار المتجر</strong>
                            <p>Square image recommended.</p>
                            <label className={designStyles.exactWizardUpload109V5}>
                              {uploadingAsset === "logo" ? "Uploading... / جارٍ الرفع..." : "Upload logo / رفع الشعار"}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={(event) => uploadStorefrontAsset(event, "logo")}
                                disabled={uploadingAsset !== null}
                              />
                            </label>
                            <input
                              type="url"
                              value={setupForm.logoUrl}
                              onChange={(event) => updateSetupField("logoUrl", event.target.value)}
                              placeholder="Or paste logo URL"
                            />
                          </div>
                        </article>

                        <article className={designStyles.exactWizardAssetCard109V5}>
                          <div className={designStyles.exactWizardCover109V5}>
                            {setupForm.heroImageUrl ? (
                              <img src={setupForm.heroImageUrl} alt="Storefront preview" />
                            ) : (
                              <span>Storefront image / صورة الواجهة</span>
                            )}
                          </div>
                          <div>
                            <strong>Storefront image / صورة واجهة المتجر</strong>
                            <p>Wide image recommended.</p>
                            <label className={designStyles.exactWizardUpload109V5}>
                              {uploadingAsset === "hero" ? "Uploading... / جارٍ الرفع..." : "Upload storefront / رفع صورة الواجهة"}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={(event) => uploadStorefrontAsset(event, "hero")}
                                disabled={uploadingAsset !== null}
                              />
                            </label>
                            <input
                              type="url"
                              value={setupForm.heroImageUrl}
                              onChange={(event) => updateSetupField("heroImageUrl", event.target.value)}
                              placeholder="Or paste storefront image URL"
                            />
                          </div>
                        </article>
                      </div>
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 3 ? (
                    <section data-darik-exact-step="3" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 3 / الخطوة ٣</span>
                        <h3>Store name & link / اسم المتجر والرابط</h3>
                        <p>English and Arabic customer-facing identity stay together in this step.</p>
                      </div>
                      <div className={designStyles.exactWizardGrid109V5}>
                        <label className={designStyles.exactWizardWide109V5}>
                          <span>Permanent store link / رابط المتجر</span>
                          <div className={designStyles.exactWizardSlug109V5}>
                            <b>getdarik.com/store/</b>
                            <input
                              value={setupForm.slug}
                              onChange={(event) => updateSetupField("slug", cleanSlug(event.target.value))}
                              required
                            />
                          </div>
                        </label>
                        <label>
                          <span>Customer-facing name / اسم المتجر للعملاء</span>
                          <input
                            value={setupForm.displayName}
                            onChange={(event) => updateSetupField("displayName", event.target.value)}
                            required
                          />
                        </label>
                        <label dir="rtl">
                          <span>اسم المتجر بالعربية / Arabic customer-facing name</span>
                          <input
                            dir="rtl"
                            value={setupForm.displayNameAr}
                            onChange={(event) => updateSetupField("displayNameAr", event.target.value)}
                          />
                        </label>
                        <label>
                          <span>Store tagline / شعار المتجر</span>
                          <input
                            value={setupForm.tagline}
                            onChange={(event) => updateSetupField("tagline", event.target.value)}
                          />
                        </label>
                        <label dir="rtl">
                          <span>الشعار بالعربية / Arabic store tagline</span>
                          <input
                            dir="rtl"
                            value={setupForm.taglineAr}
                            onChange={(event) => updateSetupField("taglineAr", event.target.value)}
                          />
                        </label>
                      </div>
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 4 ? (
                    <section data-darik-exact-step="4" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 4 / الخطوة ٤</span>
                        <h3>Fonts / الخطوط</h3>
                        <p>Choose the entire-page font first, then optionally override only a name or tagline.</p>
                      </div>

                      <div className={designStyles.exactWizardGlobalFont109V5}>
                        <div>
                          <small>ENTIRE STOREFRONT / المتجر بالكامل</small>
                          <strong>Whole-page font / خط الصفحة بالكامل</strong>
                          <span>Everything follows this font unless you override an identity item below.</span>
                        </div>
                        <select
                          value={storefrontTypographyDraft.page.font}
                          onChange={(event) =>
                            updateStorefrontTypography("page", {
                              font: isStorefrontTypographyFontKey(event.target.value)
                                ? event.target.value
                                : "theme",
                              size: 0,
                            })
                          }
                        >
                          {storefrontTypographyFontGroups.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                              {group.options.map((option) => (
                                <option key={option.key} value={option.key}>{option.label}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <button type="button" onClick={() => resetStorefrontTypography("page")}>
                          Theme default / خط القالب
                        </button>
                      </div>

                      <div className={designStyles.exactWizardOptionalTitle109V5}>
                        <strong>Optional individual overrides / تعديلات فردية اختيارية</strong>
                        <span>Change only the text you want; everything else keeps the whole-page font.</span>
                      </div>

                      <div className={designStyles.exactWizardFontGrid109V5}>
                        {[
                          ["display_name", "Customer-facing name", "اسم المتجر للعملاء"],
                          ["display_name_ar", "Arabic customer-facing name", "اسم المتجر بالعربية"],
                          ["tagline", "Store tagline", "شعار المتجر"],
                          ["tagline_ar", "Arabic store tagline", "الشعار بالعربية"],
                        ].map(([key, en, ar]) => {
                          const typographyKey = key as
                            | "display_name"
                            | "display_name_ar"
                            | "tagline"
                            | "tagline_ar";
                          const setting = storefrontTypographyDraft[typographyKey];

                          return (
                            <article key={key} className={designStyles.exactWizardFontCard109V5}>
                              <div><strong>{en}</strong><span>{ar}</span></div>
                              <label>
                                <span>Font / الخط</span>
                                <select
                                  value={setting.font}
                                  onChange={(event) =>
                                    updateStorefrontTypography(typographyKey, {
                                      ...setting,
                                      font: isStorefrontTypographyFontKey(event.target.value)
                                        ? event.target.value
                                        : "theme",
                                    })
                                  }
                                >
                                  {storefrontTypographyFontGroups.map((group) => (
                                    <optgroup key={group.label} label={group.label}>
                                      {group.options.map((option) => (
                                        <option key={option.key} value={option.key}>{option.label}</option>
                                      ))}
                                    </optgroup>
                                  ))}
                                </select>
                              </label>
                              <label>
                                <span>Size / الحجم</span>
                                <select
                                  value={setting.size}
                                  onChange={(event) =>
                                    updateStorefrontTypography(typographyKey, {
                                      ...setting,
                                      size: Number(event.target.value),
                                    })
                                  }
                                >
                                  <option value={0}>Theme default / تلقائي</option>
                                  {[12,14,16,18,20,22,24,28,32,36,40,48,56,64,72,80,88,96].map((size) => (
                                    <option key={size} value={size}>{size}px</option>
                                  ))}
                                </select>
                              </label>
                              <button type="button" onClick={() => resetStorefrontTypography(typographyKey)}>
                                Reset / إعادة
                              </button>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 5 ? (
                    <section data-darik-exact-step="5" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 5 / الخطوة ٥</span>
                        <h3>Contact information / معلومات التواصل</h3>
                        <p>Only customer contact information belongs here. The physical store location is confirmed under Delivery.</p>
                      </div>
                      <div className={designStyles.exactWizardGrid109V5}>
                        <label><span>Store phone / هاتف المتجر</span><input type="tel" value={setupForm.phone} onChange={(event) => updateSetupField("phone", event.target.value)} /></label>
                        <label><span>WhatsApp / واتساب</span><input type="tel" value={setupForm.whatsapp} onChange={(event) => updateSetupField("whatsapp", event.target.value)} /></label>
                        <label><span>Public email / البريد الإلكتروني</span><input type="email" value={setupForm.publicEmail} onChange={(event) => updateSetupField("publicEmail", event.target.value)} /></label>
                        <label><span>Website / الموقع الإلكتروني</span><input type="url" value={setupForm.websiteUrl} onChange={(event) => updateSetupField("websiteUrl", event.target.value)} /></label>
                        <label><span>Facebook / فيسبوك</span><input type="url" value={setupForm.facebookUrl} onChange={(event) => updateSetupField("facebookUrl", event.target.value)} /></label>
                        <label><span>Instagram / إنستغرام</span><input type="url" value={setupForm.instagramUrl} onChange={(event) => updateSetupField("instagramUrl", event.target.value)} /></label>
                      </div>
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 6 ? (
                    <section data-darik-exact-step="6" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 6 / الخطوة ٦</span>
                        <h3>About the store & business hours / عن المتجر وساعات العمل</h3>
                        <p>About the store and every day's hours stay together here.</p>
                      </div>
                      <div className={designStyles.exactWizardAbout109V5}>
                        <label>
                          <span>About the store / عن المتجر</span>
                          <textarea rows={6} value={setupForm.aboutText} onChange={(event) => updateSetupField("aboutText", event.target.value)} />
                        </label>
                        <label dir="rtl">
                          <span>عن المتجر بالعربية / Arabic about the store</span>
                          <textarea dir="rtl" rows={6} value={setupForm.aboutTextAr} onChange={(event) => updateSetupField("aboutTextAr", event.target.value)} />
                        </label>
                      </div>

                      <div className={designStyles.exactWizardHoursTitle109V5}>
                        <strong>Business hours / ساعات العمل</strong>
                        <span>Select Closed from Open to automatically close that day.</span>
                      </div>
                      <div className={designStyles.exactWizardHours109V5}>
                        {operatingDays.map(([day, label]) => {
                          const parsed = parseDarikOperatingHours109(setupForm.operatingHours[day] ?? "");
                          return (
                            <article key={day}>
                              <strong>{label}</strong>
                              <label>
                                <span>Open / فتح</span>
                                <select
                                  value={parsed.open}
                                  onChange={(event) => updateOperatingHourDropdown109(day, "open", event.target.value)}
                                >
                                  <option value="">Choose time / اختر الوقت</option>
                                  <option value="Closed">Closed / مغلق</option>
                                  {darikStorefrontTimeOptions109.map((time) => <option value={time} key={`${day}-v5-open-${time}`}>{time}</option>)}
                                </select>
                              </label>
                              <label>
                                <span>Close / إغلاق</span>
                                <select
                                  value={parsed.close}
                                  disabled={parsed.closed}
                                  onChange={(event) => updateOperatingHourDropdown109(day, "close", event.target.value)}
                                >
                                  <option value="">Choose time / اختر الوقت</option>
                                  {darikStorefrontTimeOptions109.map((time) => <option value={time} key={`${day}-v5-close-${time}`}>{time}</option>)}
                                </select>
                              </label>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 7 ? (
                    <section data-darik-exact-step="7" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeadingRow109V5}>
                        <div className={designStyles.exactWizardHeading109V5}>
                          <span>STEP 7 · OPTIONAL / الخطوة ٧ · اختياري</span>
                          <h3>Custom links / روابط إضافية</h3>
                          <p>Add only the extra links your store needs.</p>
                        </div>
                        <button type="button" onClick={addCustomLink}>+ Add link / إضافة رابط</button>
                      </div>
                      {setupForm.customLinks.length === 0 ? (
                        <div className={designStyles.exactWizardEmpty109V5}>No custom links yet / لا توجد روابط إضافية</div>
                      ) : (
                        <div className={designStyles.exactWizardRows109V5}>
                          {setupForm.customLinks.map((link, index) => (
                            <article key={`v5-link-${index}`}>
                              <input value={link.label} onChange={(event) => updateCustomLink(index, "label", event.target.value)} placeholder="Link label / اسم الرابط" />
                              <input type="url" value={link.url} onChange={(event) => updateCustomLink(index, "url", event.target.value)} placeholder="https://..." />
                              <button type="button" onClick={() => removeCustomLink(index)}>Remove / حذف</button>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 8 ? (
                    <section data-darik-exact-step="8" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeadingRow109V5}>
                        <div className={designStyles.exactWizardHeading109V5}>
                          <span>STEP 8 · OPTIONAL / الخطوة ٨ · اختياري</span>
                          <h3>Custom store information / معلومات إضافية</h3>
                          <p>Add anything unique customers should know.</p>
                        </div>
                        <button type="button" onClick={addCustomInformation}>+ Add information / إضافة معلومة</button>
                      </div>
                      {setupForm.customInformation.length === 0 ? (
                        <div className={designStyles.exactWizardEmpty109V5}>No custom information yet / لا توجد معلومات إضافية</div>
                      ) : (
                        <div className={designStyles.exactWizardRows109V5}>
                          {setupForm.customInformation.map((item, index) => (
                            <article key={`v5-info-${index}`}>
                              <input value={item.label} onChange={(event) => updateCustomInformation(index, "label", event.target.value)} placeholder="Heading / العنوان" />
                              <input value={item.value} onChange={(event) => updateCustomInformation(index, "value", event.target.value)} placeholder="Information / المعلومة" />
                              <button type="button" onClick={() => removeCustomInformation(index)}>Remove / حذف</button>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 9 ? (
                    <section data-darik-exact-step="9" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 9 / الخطوة ٩</span>
                        <h3>Delivery / التوصيل</h3>
                        <p>Confirm the store location first, then choose delivery or pickup only. Delivery settings appear only when delivery is enabled.</p>
                      </div>

                      <section className={designStyles.deliveryLocationCard112}>
                        <div className={designStyles.deliveryLocationHead112}>
                          <div>
                            <small>DELIVERY ORIGIN / نقطة انطلاق التوصيل</small>
                            <strong>Store location / موقع المتجر</strong>
                            <span>
                              Delivery zones are measured from this confirmed pin.
                              For best GPS accuracy, use your phone while at the store.
                            </span>
                          </div>
                          <b
                            className={
                              deliveryLocationLocked112
                                ? designStyles.deliveryLocationLockedBadge112
                                : deliveryLocation112
                                  ? designStyles.deliveryLocationUnlockedBadge112
                                  : designStyles.deliveryLocationRequiredBadge112
                            }
                          >
                            {deliveryLocationLocked112
                              ? "Locked / مقفل"
                              : deliveryLocation112
                                ? "Unlocked / مفتوح"
                                : "Required / مطلوب"}
                          </b>
                        </div>

                        {!deliveryLocationLocked112 ? (
                          <div className={designStyles.deliveryLocationChooser112}>
                            <button
                              type="button"
                              className={designStyles.deliveryLocationGps112}
                              onClick={getMyDeliveryLocation112}
                              disabled={
                                deliveryLocationLocating112 ||
                                deliveryLocationSearching112 ||
                                deliveryLocationSaving112
                              }
                            >
                              {deliveryLocationLocating112
                                ? "Getting location... / جارٍ تحديد الموقع..."
                                : "Get my location / تحديد موقعي"}
                            </button>

                            <span className={designStyles.deliveryLocationOr112}>
                              OR / أو
                            </span>

                            <div className={designStyles.deliveryLocationSearch112}>
                              <label>
                                <span>Search Google / البحث في Google</span>
                                <input
                                  value={deliveryLocationSearch112}
                                  onChange={(event) =>
                                    setDeliveryLocationSearch112(
                                      event.target.value
                                    )
                                  }
                                  placeholder="Store name, street or landmark"
                                  autoComplete="off"
                                />
                              </label>

                              {deliveryLocationPredictions112.length > 0 ? (
                                <div className={designStyles.deliveryLocationResults112}>
                                  {deliveryLocationPredictions112.map(
                                    (prediction) => (
                                      <button
                                        type="button"
                                        key={prediction.place_id}
                                        onClick={() =>
                                          void chooseDeliveryGooglePlace112(
                                            prediction
                                          )
                                        }
                                      >
                                        <strong>
                                          {prediction.structured_formatting?.main_text ||
                                            prediction.description}
                                        </strong>
                                        <span>
                                          {prediction.structured_formatting?.secondary_text ||
                                            prediction.description}
                                        </span>
                                      </button>
                                    )
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        {deliveryLocationError112 ? (
                          <div className={designStyles.deliveryLocationError112}>
                            {deliveryLocationError112}
                          </div>
                        ) : null}

                        {deliveryLocationMap112 ? (
                          <div className={designStyles.deliveryLocationMapCard112}>
                            <iframe
                              title="Store location map"
                              src={darikDeliveryLocationMapUrl112(
                                deliveryLocationMap112
                              )}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />

                            <div className={designStyles.deliveryLocationMapFoot112}>
                              <div>
                                <small>
                                  {deliveryLocationLocked112
                                    ? "CONFIRMED / مؤكد"
                                    : "CONFIRM THIS PIN / أكد هذا الموقع"}
                                </small>
                                <strong>{deliveryLocationMap112.address}</strong>
                                <span>
                                  {deliveryLocationMap112.latitude.toFixed(6)},
                                  {" "}
                                  {deliveryLocationMap112.longitude.toFixed(6)}
                                </span>
                              </div>

                              {deliveryLocationLocked112 ? (
                                <button
                                  type="button"
                                  className={designStyles.deliveryLocationUnlock112}
                                  onClick={openDeliveryLocationUnlock112}
                                >
                                  Unlock location / فتح الموقع
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className={designStyles.deliveryLocationConfirm112}
                                  onClick={() =>
                                    void confirmDeliveryLocation112()
                                  }
                                  disabled={deliveryLocationSaving112}
                                >
                                  {deliveryLocationSaving112
                                    ? "Confirming... / جارٍ التأكيد..."
                                    : "Confirm this location / تأكيد هذا الموقع"}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className={designStyles.deliveryLocationEmpty112}>
                            <strong>Choose the exact store location</strong>
                            <span>
                              Use GPS or Google search. A map appears here before
                              the location can be confirmed.
                            </span>
                          </div>
                        )}

                        {deliveryLocationUnlockOpen112 ? (
                          <div
                            className={designStyles.deliveryLocationPasswordOverlay112}
                            role="dialog"
                            aria-modal="true"
                          >
                            <div className={designStyles.deliveryLocationPasswordCard112}>
                              <div>
                                <small>SECURITY CHECK / تحقق أمني</small>
                                <strong>
                                  Unlock store location / فتح موقع المتجر
                                </strong>
                                <p>
                                  Enter the password you use to log into Darik.
                                </p>
                              </div>

                              <label>
                                <span>Login password / كلمة مرور الدخول</span>
                                <input
                                  type="password"
                                  value={deliveryLocationUnlockPassword112}
                                  onChange={(event) =>
                                    setDeliveryLocationUnlockPassword112(
                                      event.target.value
                                    )
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault();
                                      void verifyDeliveryLocationUnlock112();
                                    }
                                  }}
                                  autoComplete="current-password"
                                  autoFocus
                                />
                              </label>

                              {deliveryLocationUnlockError112 ? (
                                <div className={designStyles.deliveryLocationPasswordError112}>
                                  {deliveryLocationUnlockError112}
                                </div>
                              ) : null}

                              <div className={designStyles.deliveryLocationPasswordActions112}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeliveryLocationUnlockPassword112("");
                                    setDeliveryLocationUnlockError112("");
                                    setDeliveryLocationUnlockOpen112(false);
                                  }}
                                  disabled={deliveryLocationUnlockBusy112}
                                >
                                  Cancel / إلغاء
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    void verifyDeliveryLocationUnlock112()
                                  }
                                  disabled={deliveryLocationUnlockBusy112}
                                >
                                  {deliveryLocationUnlockBusy112
                                    ? "Verifying... / جارٍ التحقق..."
                                    : "Verify & unlock / تحقق وافتح"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </section>

                                            <section className={designStyles.pickupOnlyChoice114}>
                        <div className={designStyles.pickupOnlyChoiceCopy114}>
                          <small>FULFILLMENT / طريقة الاستلام</small>
                        {/* DARIK_BROWSE_STORE_FOR_PICKUP_118 */}
                          <strong>Pickup only? / استلام من المتجر فقط؟</strong>
                          <span>
                            Choose Yes only when customers must collect from your
                            confirmed store location. Choose No when you deliver.
                          </span>
                        </div>

                        <div className={designStyles.pickupOnlyChoiceActions114}>
                          <button
                            type="button"
                            aria-pressed={setupForm.fulfillmentMode !== "pickup"}
                            className={
                              setupForm.fulfillmentMode !== "pickup"
                                ? designStyles.pickupOnlyChoiceSelected114
                                : ""
                            }
                            onClick={() =>
                              updateSetupField("fulfillmentMode", "delivery")
                            }
                          >
                            <b>No / لا</b>
                            <span>Delivery + pickup / توصيل + استلام</span>
                          </button>

                          <button
                            type="button"
                            aria-pressed={setupForm.fulfillmentMode === "pickup"}
                            className={
                              setupForm.fulfillmentMode === "pickup"
                                ? designStyles.pickupOnlyChoiceSelected114
                                : ""
                            }
                            onClick={() =>
                              updateSetupField("fulfillmentMode", "pickup")
                            }
                          >
                            <b>Yes / نعم</b>
                            <span>Pickup only / استلام فقط</span>
                          </button>
                        </div>
                      </section>

                      {setupForm.fulfillmentMode === "delivery" ? (
                        <>
<div className={designStyles.exactWizardOrderModes109V5}>
                        <button type="button" className={setupForm.orderSubmissionMode === "phone" ? designStyles.exactWizardSelected109V5 : ""} onClick={() => updateSetupField("orderSubmissionMode", "phone")}><strong>Phone / WhatsApp</strong><span>هاتف / واتساب</span></button>
                        <button type="button" className={setupForm.orderSubmissionMode === "online" ? designStyles.exactWizardSelected109V5 : ""} onClick={() => updateSetupField("orderSubmissionMode", "online")}><strong>Online orders</strong><span>طلبات إلكترونية</span></button>
                        <button type="button" className={setupForm.orderSubmissionMode === "both" ? designStyles.exactWizardSelected109V5 : ""} onClick={() => updateSetupField("orderSubmissionMode", "both")}><strong>Phone + online</strong><span>هاتف + إلكتروني</span></button>
                      </div>

                      <label className={designStyles.exactWizardDeliveryTime109V5}>
                        <span>Estimated delivery time / وقت التوصيل المتوقع</span>
                        <div>
                          <input
                            type="number"
                            min="1"
                            value={setupForm.estimatedDeliveryMinutes}
                            onChange={(event) => updateSetupField("estimatedDeliveryMinutes", event.target.value)}
                          />
                          <b>minutes / دقيقة</b>
                        </div>
                      </label>

                      <div className={designStyles.exactWizardZones109V5}>
                        <div className={designStyles.exactWizardZonesHead109V5}>
                          <div>
                            <small>DELIVERY ZONES / مناطق التوصيل</small>
                            <strong>Add as many zones as you want / أضف أي عدد من المناطق</strong>
                            <span>Example: up to 1 km free; up to 5 km for 2 JOD; up to 10 km for another fee. Minimum order is optional per zone.</span>
                          </div>
                          <button type="button" onClick={addDeliveryZone109}>+ Add zone / إضافة منطقة</button>
                        </div>
                        {deliveryZones109.length === 0 ? (
                          <div className={designStyles.exactWizardEmpty109V5}>No delivery zones yet / لا توجد مناطق توصيل</div>
                        ) : (
                          <div className={designStyles.exactWizardZoneList109V5}>
                            {deliveryZones109.map((zone, index) => (
                              <article key={zone.id}>
                                <div className={designStyles.exactWizardZoneNumber109V5}><span>ZONE</span><strong>{index + 1}</strong></div>
                                <label><span>Up to / حتى</span><div><input type="number" min="0.1" step="0.1" value={zone.maxKm} onChange={(event) => updateDeliveryZone109(zone.id, "maxKm", event.target.value)} /><b>km</b></div></label>
                                <label><span>Delivery fee / رسوم التوصيل</span><div><input type="number" min="0" step="0.01" value={zone.deliveryFeeJod} onChange={(event) => updateDeliveryZone109(zone.id, "deliveryFeeJod", event.target.value)} /><b>JOD</b></div></label>
                                <label><span>Minimum order / الحد الأدنى</span><div><input type="number" min="0" step="0.01" value={zone.minimumOrderJod} onChange={(event) => updateDeliveryZone109(zone.id, "minimumOrderJod", event.target.value)} placeholder="Optional" /><b>JOD</b></div></label>
                                <button type="button" onClick={() => removeDeliveryZone109(zone.id)}>Remove / حذف</button>
                              </article>
                            ))}
                          </div>
                        )}
                        <small className={designStyles.exactWizardZoneStatus109V5}>
                          {deliveryZonesSaveState109 === "saving" ? "Saving... / جارٍ الحفظ..." : deliveryZonesSaveState109 === "saved" ? "Zones saved / تم الحفظ" : deliveryZonesSaveState109 === "error" ? "Could not save / تعذر الحفظ" : "Zones save automatically / حفظ تلقائي"}
                        </small>
                      </div>
                        </>
                      ) : null}
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 10 ? (
                    <section data-darik-exact-step="10" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 10 / الخطوة ١٠</span>
                        <h3>Payment methods / طرق الدفع</h3>
                        <p>Payment methods are completely separate from delivery.</p>
                      </div>
                      <div className={designStyles.exactWizardPayments109V5}>
                        <label className={setupForm.acceptCash ? designStyles.exactWizardSelected109V5 : ""}>
                          <input type="checkbox" checked={setupForm.acceptCash} onChange={(event) => updateSetupField("acceptCash", event.target.checked)} />
                          <span><strong>Cash / نقداً</strong><small>Pay on collection or delivery.</small></span>
                        </label>
                        <label className={setupForm.acceptCliq ? designStyles.exactWizardSelected109V5 : ""}>
                          <input type="checkbox" checked={setupForm.acceptCliq} onChange={(event) => updateSetupField("acceptCliq", event.target.checked)} />
                          <span><strong>CliQ / كليك</strong><small>Transfer before submitting.</small></span>
                        </label>
                      </div>
                      {setupForm.acceptCliq ? (
                        <div className={designStyles.exactWizardGrid109V5}>
                          <label><span>CliQ account holder / اسم صاحب الحساب</span><input value={setupForm.cliqAccountName} onChange={(event) => updateSetupField("cliqAccountName", event.target.value)} /></label>
                          <label><span>CliQ alias or mobile / اسم كليك أو رقم الهاتف</span><input value={setupForm.cliqIdentifier} onChange={(event) => updateSetupField("cliqIdentifier", event.target.value)} /></label>
                        </div>
                      ) : null}
                    </section>
                  ) : null}

                  {storefrontSetupVisibleStep109 === 11 ? (
                    <section data-darik-exact-step="11" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 11 / الخطوة ١١</span>
                        <h3>Store features & functions / خصائص ووظائف المتجر</h3>
                        <p>These controls change storefront functions, not the selected visual theme.</p>
                      </div>
                      <div className={designStyles.exactWizardFeatures109V5}>
                        {[
                          ["showPrices", "Show prices", "إظهار الأسعار", "Useful for normal retail; turn off for quote/catalog stores."],
                          ["showOrdering", "Enable cart & checkout", "تفعيل السلة والطلب", "Turn off for a showcase-only storefront."],
                          ["showPhone", "Show phone", "إظهار الهاتف", "Customers can tap to call."],
                          ["showWhatsapp", "Show WhatsApp", "إظهار واتساب", "Customers can open WhatsApp."],
                          ["showStoreStory", "Show About section", "إظهار قسم عن المتجر", "Show the store story publicly."],
                        ].map(([field, en, ar, helper]) => (
                          <label key={field}>
                            <span><strong>{en}</strong><b>{ar}</b><small>{helper}</small></span>
                            <input
                              type="checkbox"
                              checked={Boolean(setupForm[field as keyof StorefrontForm])}
                              onChange={(event) => updateSetupField(field as keyof StorefrontForm, event.target.checked as never)}
                            />
                          </label>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>

                {storefrontSetupMode109 === "wizard" ? (
                  <div className={designStyles.storefrontSetupWizardActions109}>
                    <button
                      type="button"
                      className={designStyles.storefrontSetupBack109}
                      onClick={goToPreviousStorefrontSetupStep109}
                      disabled={
                        storefrontSetupStep109 <= 2 || storefrontSetupBusy109
                      }
                    >
                      Back / رجوع
                    </button>

                    <div>
                      <small>
                        {storefrontSetupStep109 === 7 ||
                        storefrontSetupStep109 === 8
                          ? "Optional step / خطوة اختيارية"
                          : "Your progress is saved as you go / يتم حفظ تقدمك تلقائياً"}
                      </small>

                      {storefrontSetupStep109 < 11 ? (
                        <button
                          type="button"
                          className={designStyles.storefrontSetupNext109}
                          onClick={() => void goToNextStorefrontSetupStep109()}
                          disabled={storefrontSetupBusy109}
                        >
                          {storefrontSetupStep109 === 7 ||
                          storefrontSetupStep109 === 8
                            ? "Continue / متابعة"
                            : "Next step / الخطوة التالية"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={designStyles.storefrontSetupFinish109}
                          onClick={() => void finishStorefrontSetup109()}
                          disabled={storefrontSetupBusy109}
                        >
                          {storefrontSetupBusy109
                            ? "Finishing setup... / جارٍ الإكمال..."
                            : "Finish storefront setup / إنهاء إعداد المتجر"}
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}

<div
                  className={storefrontSetupMode109 === "wizard" ? styles.formSaveBar + " " + designStyles.storefrontSetupSaveBarHidden109 : styles.formSaveBar}
                >
                  <div
                    className={`${styles.draftStatus} ${
                      formDirty ? styles.draftStatusUnsaved : ""
                    }`}
                  >
                    <strong>
                      {autoSaveStatus === "saving"
                        ? "Saving automatically... / جار الحفظ تلقائيا..."
                        : formDirty
                          ? "Autosave pending / الحفظ التلقائي قيد الانتظار"
                          : "All changes saved automatically / تم حفظ جميع التغييرات تلقائيا"}
                    </strong>
                    <span>
                      {autoSaveStatus === "saving"
                        ? "Your changes are being saved to Darik now. / يتم الآن حفظ تغييراتك في داريك."
                        : formDirty
                          ? autoSaveStatus === "waiting"
                            ? "Darik saves automatically about one second after you stop editing. / يحفظ داريك تلقائيا بعد حوالي ثانية من توقفك عن التعديل."
                            : draftSavedAt
                              ? `Local draft updated at ${new Date(
                                  draftSavedAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`
                              : "Protecting your entries automatically..."
                          : "No Save button is required for normal edits. / لا تحتاج إلى الضغط على زر الحفظ للتعديلات العادية."}
                    </span>
                  </div>

                  {error ? (
                    <div className={styles.saveErrorInline} role="alert">
                      <strong>Could not save / تعذر الحفظ</strong>
                      <span>{error}</span>
                    </div>
                  ) : null}

                  <button
                    className={styles.saveButton}
                    type="submit"
                    disabled={saving || uploadingAsset !== null}
                  >
                    {saving
                      ? "Saving... / جار الحفظ..."
                      : storefront
                        ? "Save now / حفظ الآن"
                        : "Create now / إنشاء الآن"}
                  </button>
                </div>

                  </div>
                </>
              )}
</form>
            </section>

          </>
        )}
      </section>
      <StorefrontPreviewModal
        open={previewOpen}
        retailerId={selectedStore?.retailer_id ?? ""}
        form={setupForm}
        onClose={() => setPreviewOpen(false)}
      />
    </main>
  );
}
