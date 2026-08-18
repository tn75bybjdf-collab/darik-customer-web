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
// DARIK_DELIVERY_STAGES_DAYS_CUTOFF_163
type DarikDeliverySetupStage163 = "location" | "settings";
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
  // Legacy field stays in the form shape for old preview/component compatibility.
  estimatedDeliveryMinutes: string;
  estimatedDeliveryDays: string;
  deliveryCutoffTime: string;
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
  estimated_delivery_days?: number | null;
  delivery_cutoff_time?: string | null;
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
    estimatedDeliveryMinutes: "",
    estimatedDeliveryDays: "0",
    deliveryCutoffTime: "17:00",
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
  // DARIK_CHANGE_THEME_EXITS_FULLSCREEN_156
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
      estimated_delivery_minutes: null,
      estimated_delivery_days: liveBuilderDraftValue(
        "estimatedDeliveryDays",
        "estimated_delivery_days"
      ),
      delivery_cutoff_time: liveBuilderDraftValue(
        "deliveryCutoffTime",
        "delivery_cutoff_time"
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
  // DARIK_DRAG_SCROLL_LOCK_RESET_HERO_LOCK_150C
  // DARIK_PERSISTENT_DRAG_LOGO_BOX_150D
  // DARIK_NO_FLASH_THEME_STABLE_POSITIONS_150E_V2
  // DARIK_DOM_STABILITY_POSITION_REAPPLY_150E_V3
  // DARIK_PINCH_RESIZE_LIGHTER_DRAG_151
  // DARIK_SELECTED_OBJECT_DIRECT_EDITOR_152
  // DARIK_LIVE_TYPOGRAPHY_PREVIEW_153
  // DARIK_NONBLOCKING_TYPOGRAPHY_PANEL_153B
  // DARIK_AUTOCLOSE_FONT_TEXT_COLOR_154_V2
  // DARIK_EDITOR_BLOCK_NATIVE_OBJECT_ACTIONS_155
  // Dashboard-only drag proof.
  // No DB writes and no app/[slug] edits.
  useEffect(() => {
    if (!liveBuilderPreviewOpen) return;

    let iframe150A: HTMLIFrameElement | null = null;
    let boundIframe150B: HTMLIFrameElement | null = null;
    let detachPreview150A = () => {};

    type DarikPoint150D = {
      x: number;
      y: number;
      scale?: number;
      hidden?: boolean;
      label?: string;
    };

    type DarikLayout150D = {
      desktop: Record<string, DarikPoint150D>;
      mobile: Record<string, DarikPoint150D>;
    };

    function defaultLayout150D(): DarikLayout150D {
      return { desktop: {}, mobile: {} };
    }

    function clamp150D(value150D: unknown) {
      const n150D = Number(value150D);
      if (!Number.isFinite(n150D)) return 0;
      return Math.max(
        -1200,
        Math.min(1200, Math.round(n150D))
      );
    }

    function clampScale151(value151: unknown) {
      const numeric151 = Number(value151);

      if (!Number.isFinite(numeric151)) {
        return 1;
      }

      return Math.round(
        Math.max(
          0.5,
          Math.min(2, numeric151)
        ) * 1000
      ) / 1000;
    }

    function safeLocator150D(value150D: unknown) {
      const locator150D = String(value150D ?? "").trim();

      return (
        locator150D.length >= 1 &&
        locator150D.length <= 700 &&
        /^[A-Za-z0-9_#:.() >-]+$/.test(locator150D)
      );
    }

    function normalizeLayout150D(
      value150D: unknown
    ): DarikLayout150D {
      const raw150D =
        value150D &&
        typeof value150D === "object" &&
        !Array.isArray(value150D)
          ? (value150D as Record<string, unknown>)
          : {};

      const result150D = defaultLayout150D();

      for (const device150D of [
        "desktop",
        "mobile",
      ] as const) {
        const rawDevice150D =
          raw150D[device150D] &&
          typeof raw150D[device150D] === "object" &&
          !Array.isArray(raw150D[device150D])
            ? (raw150D[device150D] as Record<
                string,
                unknown
              >)
            : {};

        let accepted150D = 0;

        for (const [
          locator150D,
          rawPoint150D,
        ] of Object.entries(rawDevice150D)) {
          if (accepted150D >= 250) break;
          if (!safeLocator150D(locator150D)) continue;

          if (
            !rawPoint150D ||
            typeof rawPoint150D !== "object" ||
            Array.isArray(rawPoint150D)
          ) {
            continue;
          }

          const point150D =
            rawPoint150D as Record<string, unknown>;

          const label150D =
            typeof point150D.label === "string"
              ? point150D.label.trim().slice(0, 140)
              : undefined;

          const hasScale151 =
            Object.prototype.hasOwnProperty.call(
              point150D,
              "scale"
            );

          const scale151 =
            hasScale151
              ? clampScale151(
                  point150D.scale
                )
              : undefined;

          const hidden152 =
            typeof point150D.hidden ===
              "boolean"
              ? point150D.hidden
              : undefined;

          result150D[device150D][locator150D] = {
            x: clamp150D(point150D.x),
            y: clamp150D(point150D.y),
            ...(scale151 !== undefined
              ? { scale: scale151 }
              : {}),
            ...(hidden152 !== undefined
              ? { hidden: hidden152 }
              : {}),
            ...(label150D ? { label: label150D } : {}),
          };

          accepted150D += 1;
        }
      }

      return result150D;
    }

    function hashSemantic150E(value150E: string) {
      let hash150E = 2166136261;

      for (
        let index150E = 0;
        index150E < value150E.length;
        index150E += 1
      ) {
        hash150E ^= value150E.charCodeAt(index150E);
        hash150E = Math.imul(hash150E, 16777619);
      }

      return (hash150E >>> 0).toString(36);
    }

    function movableSignature150E(
      target150E: Element
    ) {
      const tag150E =
        target150E.tagName.toLowerCase();

      const structural150E = new Set([
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

      if (structural150E.has(tag150E)) {
        return "";
      }

      if (
        tag150E === "div" &&
        target150E.querySelector(
          "h1, h2, h3, h4, p, img, picture, video, button, a, nav, section, article, header, footer"
        )
      ) {
        return "";
      }

      const text150E = (
        target150E.textContent ?? ""
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160);

      const identity150E = [
        tag150E,
        text150E,
        target150E.getAttribute("alt") ?? "",
        target150E.getAttribute("href") ?? "",
        target150E.getAttribute("src") ?? "",
        target150E.getAttribute("title") ?? "",
      ]
        .join("|")
        .toLowerCase();

      if (
        identity150E.replace(/[|\s]/g, "")
          .length < 3
      ) {
        return "";
      }

      return identity150E;
    }

    function assignSemanticClasses150E(
      root150E: Element
    ) {
      const positioned150E = Array.from(
        root150E.querySelectorAll(
          '[class*="builderPositionTarget145"]'
        )
      );

      for (const target150E of positioned150E) {
        const tag150E =
          target150E.tagName.toLowerCase();

        const lowerClass150E = (
          target150E.getAttribute("class") ?? ""
        ).toLowerCase();

        if (tag150E === "h1") {
          target150E.classList.add(
            "darikSemanticDisplayName150E"
          );
          continue;
        }

        if (tag150E === "button") {
          target150E.classList.add(
            "darikSemanticShop150E"
          );
          continue;
        }

        if (
          lowerClass150E.includes(
            "arabicname"
          )
        ) {
          target150E.classList.add(
            "darikSemanticDisplayNameAr150E"
          );
          continue;
        }

        if (
          lowerClass150E.includes(
            "arabictagline"
          )
        ) {
          target150E.classList.add(
            "darikSemanticTaglineAr150E"
          );
          continue;
        }

        if (
          lowerClass150E.includes("tagline")
        ) {
          target150E.classList.add(
            "darikSemanticTagline150E"
          );
        }
      }

      const logoVisuals150E = Array.from(
        root150E.querySelectorAll(
          "img, picture, svg"
        )
      );

      for (const visual150E of logoVisuals150E) {
        const visualIdentity150E = [
          visual150E.getAttribute("id") ?? "",
          visual150E.getAttribute("class") ?? "",
          visual150E.getAttribute("alt") ?? "",
          visual150E.getAttribute(
            "aria-label"
          ) ?? "",
        ]
          .join(" ")
          .toLowerCase();

        if (
          !visualIdentity150E.includes(
            "logo"
          ) &&
          !visualIdentity150E.includes(
            "brand"
          )
        ) {
          continue;
        }

        let box150E: Element | null =
          visual150E.parentElement;

        let depth150E = 0;

        while (
          box150E &&
          box150E !== root150E &&
          depth150E < 4
        ) {
          const tag150E =
            box150E.tagName.toLowerCase();

          const structural150E = [
            "main",
            "header",
            "footer",
            "nav",
            "section",
            "article",
          ].includes(tag150E);

          const rect150E =
            box150E.getBoundingClientRect();

          if (
            !structural150E &&
            rect150E.width > 0 &&
            rect150E.height > 0 &&
            rect150E.width <= 420 &&
            rect150E.height <= 280
          ) {
            box150E.classList.add(
              "darikSemanticLogoBox150E"
            );
            break;
          }

          box150E = box150E.parentElement;
          depth150E += 1;
        }
      }

      const eligible150E = Array.from(
        root150E.querySelectorAll(
          "button, a, img, picture, video, h1, h2, h3, h4, h5, h6, p, label, span, div"
        )
      );

      const signatureMap150E =
        new Map<string, Element[]>();

      for (const target150E of eligible150E) {
        const signature150E =
          movableSignature150E(target150E);

        if (!signature150E) continue;

        const matches150E =
          signatureMap150E.get(
            signature150E
          ) ?? [];

        matches150E.push(target150E);

        signatureMap150E.set(
          signature150E,
          matches150E
        );
      }

      for (const [
        signature150E,
        matches150E,
      ] of signatureMap150E.entries()) {
        if (matches150E.length !== 1) {
          continue;
        }

        matches150E[0].classList.add(
          "darikPersist150E" +
            hashSemantic150E(signature150E)
        );
      }
    }

    function semanticLocator150E(
      root150E: Element,
      target150E: Element
    ) {
      const className150E = Array.from(
        target150E.classList
      ).find(
        (candidate150E) =>
          candidate150E.startsWith(
            "darikSemantic"
          ) ||
          candidate150E.startsWith(
            "darikPersist150E"
          )
      );

      if (!className150E) return "";

      const selector150E =
        "." + className150E;

      try {
        return root150E.querySelectorAll(
          selector150E
        ).length === 1
          ? selector150E
          : "";
      } catch {
        return "";
      }
    }

    function locator150D(
      root150D: Element,
      target150D: Element
    ) {
      if (target150D === root150D) return "";

      const semanticSelector150E =
        semanticLocator150E(
          root150D,
          target150D
        );

      if (semanticSelector150E) {
        return semanticSelector150E;
      }

      const id150D =
        target150D.getAttribute("id")?.trim() ?? "";

      if (/^[A-Za-z][A-Za-z0-9_-]{0,100}$/.test(id150D)) {
        const idLocator150D = `#${id150D}`;

        try {
          if (
            root150D.querySelectorAll(idLocator150D).length ===
            1
          ) {
            return idLocator150D;
          }
        } catch {
          // Fall through.
        }
      }

      const parts150D: string[] = [];
      let current150D: Element | null = target150D;
      let depth150D = 0;

      while (
        current150D &&
        current150D !== root150D &&
        depth150D < 18
      ) {
        const parent150D = current150D.parentElement;
        if (!parent150D) return "";

        const tag150D =
          current150D.tagName.toLowerCase();

        const sameTag150D = Array.from(
          parent150D.children
        ).filter(
          (child150D: Element) =>
            child150D.tagName === current150D?.tagName
        );

        const index150D =
          sameTag150D.indexOf(current150D);

        if (index150D < 0) return "";

        parts150D.unshift(
          `${tag150D}:nth-of-type(${index150D + 1})`
        );

        current150D = parent150D;
        depth150D += 1;
      }

      if (
        current150D !== root150D ||
        parts150D.length === 0
      ) {
        return "";
      }

      const result150D = parts150D.join(" > ");

      return safeLocator150D(result150D)
        ? result150D
        : "";
    }

    function label150D(target150D: Element) {
      const identity150D = [
        target150D.getAttribute("id") ?? "",
        target150D.getAttribute("class") ?? "",
      ]
        .join(" ")
        .toLowerCase();

      if (
        identity150D.includes("logo") ||
        identity150D.includes("brand")
      ) {
        return "Store logo box";
      }

      const text150D = (target150D.textContent ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 90);

      return (
        text150D
          ? `${target150D.tagName.toLowerCase()} · ${text150D}`
          : target150D.tagName.toLowerCase()
      ).slice(0, 140);
    }

    function device150D(
      previewWindow150D?: Window | null
    ): "desktop" | "mobile" {
      const width150D =
        previewWindow150D?.innerWidth ??
        liveBuilderPreviewRef.current?.contentWindow
          ?.innerWidth ??
        window.innerWidth;

      return width150D <= 720
        ? "mobile"
        : "desktop";
    }

    let savedLayout150D: DarikLayout150D =
      defaultLayout150D();

    let iframeSourceObserver150E:
      | MutationObserver
      | null = null;

    let layoutLoaded150D = false;
    let applySavedNow150D = () => {};
    let saveSequence150D = 0;

    async function saveLayout150D() {
      if (!storefront?.id) return;

      const sequence150D = ++saveSequence150D;
      const snapshot150D =
        normalizeLayout150D(savedLayout150D);

      const result150D = await supabase
        .from("retailer_storefronts")
        .update({
          direct_freeform_layout: snapshot150D,
        })
        .eq("id", storefront.id);

      if (
        sequence150D !== saveSequence150D ||
        !result150D.error
      ) {
        return;
      }

      console.error(
        "Darik position save failed:",
        result150D.error.message
      );

      window.alert(
        "Darik could not save that position. Please move the item again."
      );
    }

    void (async () => {
      if (!storefront?.id) {
        layoutLoaded150D = true;
        applySavedNow150D();
        return;
      }

      const result150D = await supabase
        .from("retailer_storefronts")
        .select("direct_freeform_layout")
        .eq("id", storefront.id)
        .maybeSingle();

      if (result150D.error) {
        console.error(
          "Darik saved-position load failed:",
          result150D.error.message
        );

        layoutLoaded150D = true;
        applySavedNow150D();
        return;
      }

      savedLayout150D = normalizeLayout150D(
        result150D.data?.direct_freeform_layout
      );

      layoutLoaded150D = true;
      applySavedNow150D();
    })();

    function attachPreview150A() {
      detachPreview150A();

      const activeIframe150B = iframe150A;
      if (!activeIframe150B) return;

      activeIframe150B.removeAttribute(
        "data-darik-layout-ready150e"
      );

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

      const originalScale151 =
        new Map<Element, string>();

      const originalDisplay152 =
        new Map<Element, string>();

      let domObserver150EV3:
        | MutationObserver
        | null = null;

      let stableTimer150EV3 = 0;
      let rootRetryTimer150EV3 = 0;
      let revealFallbackTimer150EV3 = 0;
      let domSettling150EV3 = false;

      function clearStableTimer150EV3() {
        if (!stableTimer150EV3) return;

        window150A.clearTimeout(
          stableTimer150EV3
        );

        stableTimer150EV3 = 0;
      }

      function clearRootRetry150EV3() {
        if (!rootRetryTimer150EV3) return;

        window150A.clearTimeout(
          rootRetryTimer150EV3
        );

        rootRetryTimer150EV3 = 0;
      }

      function hideUntilStable150EV3() {
        activeIframe150B.removeAttribute(
          "data-darik-layout-ready150e"
        );
      }

      function ensureDomObserver150EV3(
        root150EV3: Element
      ) {
        if (domObserver150EV3) return;

        domObserver150EV3 =
          new MutationObserver(
            (mutations150EV3) => {
              const structuralChange150EV3 =
                mutations150EV3.some(
                  (mutation150EV3) =>
                    mutation150EV3.type ===
                      "childList" &&
                    (
                      mutation150EV3.addedNodes
                        .length > 0 ||
                      mutation150EV3.removedNodes
                        .length > 0
                    )
                );

              if (!structuralChange150EV3) {
                return;
              }

              hideUntilStable150EV3();
              scheduleStableApply150EV3(180);
            }
          );

        domObserver150EV3.observe(
          root150EV3,
          {
            childList: true,
            subtree: true,
          }
        );
      }

      function scheduleStableApply150EV3(
        delay150EV3 = 180
      ) {
        hideUntilStable150EV3();

        clearStableTimer150EV3();
        clearRootRetry150EV3();

        if (!layoutLoaded150D) {
          return;
        }

        const root150EV3 =
          document150A.querySelector(
            "[data-darik-position-builder145]"
          );

        if (!root150EV3) {
          rootRetryTimer150EV3 =
            window150A.setTimeout(
              () =>
                scheduleStableApply150EV3(
                  80
                ),
              80
            );

          return;
        }

        ensureDomObserver150EV3(
          root150EV3
        );

        domSettling150EV3 = true;

        stableTimer150EV3 =
          window150A.setTimeout(
            () => {
              stableTimer150EV3 = 0;

              window150A.requestAnimationFrame(
                () => {
                  window150A.requestAnimationFrame(
                    () => {
                      domSettling150EV3 =
                        false;

                      applySavedLayout150D();
                    }
                  );
                }
              );
            },
            Math.max(
              80,
              delay150EV3
            )
          );
      }

      function applySavedLayout150D() {
        if (!layoutLoaded150D) {
          return;
        }

        const root150D =
          document150A.querySelector(
            "[data-darik-position-builder145]"
          );

        if (!root150D) {
          scheduleStableApply150EV3(80);
          return;
        }

        ensureDomObserver150EV3(root150D);

        assignSemanticClasses150E(
          root150D
        );

        applyTextColors154(
          root150D
        );

        const currentDevice150D =
          device150D(window150A);

        const nextEntries150E = {
          ...savedLayout150D[
            currentDevice150D
          ],
        };

        let migrated150E = false;

        for (const [
          locatorKey150D,
          point150D,
        ] of Object.entries(
          nextEntries150E
        )) {
          if (
            !safeLocator150D(
              locatorKey150D
            )
          ) {
            continue;
          }

          let target150D:
            | Element
            | null = null;

          try {
            target150D =
              root150D.querySelector(
                locatorKey150D
              );
          } catch {
            target150D = null;
          }

          if (!target150D) {
            continue;
          }

          const semanticSelector150E =
            semanticLocator150E(
              root150D,
              target150D
            );

          if (
            semanticSelector150E &&
            semanticSelector150E !==
              locatorKey150D
          ) {
            nextEntries150E[
              semanticSelector150E
            ] = point150D;

            delete nextEntries150E[
              locatorKey150D
            ];

            migrated150E = true;
          }

          const style150D =
            (
              target150D as HTMLElement
            ).style;

          if (
            !originalTranslate150A.has(
              target150D
            )
          ) {
            originalTranslate150A.set(
              target150D,
              style150D.getPropertyValue(
                "translate"
              )
            );
          }

          style150D.setProperty(
            "translate",
            `${clamp150D(
              point150D.x
            )}px ${clamp150D(
              point150D.y
            )}px`,
            "important"
          );

          if (
            point150D.hidden !== undefined
          ) {
            if (
              !originalDisplay152.has(
                target150D
              )
            ) {
              originalDisplay152.set(
                target150D,
                style150D.getPropertyValue(
                  "display"
                )
              );
            }

            if (point150D.hidden) {
              style150D.setProperty(
                "display",
                "none",
                "important"
              );
            } else {
              const originalDisplayValue152 =
                originalDisplay152.get(
                  target150D
                ) ?? "";

              if (originalDisplayValue152) {
                style150D.setProperty(
                  "display",
                  originalDisplayValue152
                );
              } else {
                style150D.removeProperty(
                  "display"
                );
              }
            }
          }

          if (
            point150D.scale !== undefined
          ) {
            if (
              !originalScale151.has(
                target150D
              )
            ) {
              originalScale151.set(
                target150D,
                style150D.getPropertyValue(
                  "scale"
                )
              );
            }

            style150D.setProperty(
              "scale",
              String(
                clampScale151(
                  point150D.scale
                )
              ),
              "important"
            );
          }

          target150D.setAttribute(
            "data-darik-persisted150d",
            "true"
          );
        }

        if (migrated150E) {
          savedLayout150D = {
            ...savedLayout150D,
            [currentDevice150D]:
              nextEntries150E,
          };

          void saveLayout150D();
        }

        if (!domSettling150EV3) {
          activeIframe150B.setAttribute(
            "data-darik-layout-ready150e",
            "true"
          );
        }
      }

      applySavedNow150D = () => {
        scheduleStableApply150EV3(
          180
        );
      };

      revealFallbackTimer150EV3 =
        window150A.setTimeout(
          () => {
            if (
              !activeIframe150B.hasAttribute(
                "data-darik-layout-ready150e"
              )
            ) {
              console.warn(
                "Darik preview DOM-stability wait exceeded 8 seconds; revealing preview as a safety fallback."
              );

              activeIframe150B.setAttribute(
                "data-darik-layout-ready150e",
                "true"
              );
            }
          },
          8000
        );

      let resetButton150C: HTMLButtonElement | null = null;
      let scrollLocked150C = false;
      let iframeRootOverflow150C = "";
      let iframeBodyOverflow150C = "";
      let iframeRootTouchAction150C = "";
      let iframeBodyTouchAction150C = "";
      let parentRootOverflow150C = "";
      let parentBodyOverflow150C = "";
      let parentRootTouchAction150C = "";
      let parentBodyTouchAction150C = "";

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

      let pinching151 = false;
      let pinchTarget151: Element | null = null;
      let pinchStartDistance151 = 0;
      let pinchBaseScale151 = 1;
      let pinchCurrentScale151 = 1;

      let holdTimer150A = 0;
      let blockClickTarget150A: Element | null = null;
      let blockClickUntil150A = 0;

      let selectedTarget152: Element | null = null;
      let selectionToolbar152: HTMLDivElement | null = null;
      let textEditor152: HTMLDivElement | null = null;
      let textEditorDiscard153: (() => void) | null = null;
      let textEditorSave153: (() => void) | null = null;
      let toolbarStatusTimer152 = 0;

      let inlineTypography152 =
        normalizeStorefrontTypography(
          storefrontTypographyDraft
        );

      // FRONTEND 154 V2: scoped inside attachPreview150A so
      // inlineTypography152 is in lexical scope.
      function normalizeTextColor154(
      value154: unknown
    ) {
      const color154 =
        String(value154 ?? "")
          .trim()
          .toUpperCase();

      return /^#[0-9A-F]{6}$/.test(
        color154
      )
        ? color154
        : "";
    }

    function typographyColor154(
      key154:
        | "display_name"
        | "display_name_ar"
        | "tagline"
        | "tagline_ar"
    ) {
      const inlineSetting154 =
        (
          inlineTypography152[
            key154
          ] as {
            color?: unknown;
          }
        );

      const inlineColor154 =
        normalizeTextColor154(
          inlineSetting154?.color
        );

      if (inlineColor154) {
        return inlineColor154;
      }

      const rawStorefront154 =
        storefront as unknown as {
          direct_typography?: Record<
            string,
            {
              color?: unknown;
            }
          > | null;
        };

      return normalizeTextColor154(
        rawStorefront154
          ?.direct_typography
          ?.[key154]
          ?.color
      );
    }

    function withTypographyColor154<
      T extends Record<string, unknown>
    >(
      typography154: T,
      key154:
        | "display_name"
        | "display_name_ar"
        | "tagline"
        | "tagline_ar",
      color154: string
    ) {
      if (!color154) {
        return typography154;
      }

      const current154 =
        (
          typography154[
            key154
          ] ?? {}
        ) as Record<string, unknown>;

      return {
        ...typography154,
        [key154]: {
          ...current154,
          color: color154,
        },
      };
    }

    function applyTextColors154(
      root154: Element
    ) {
      const mappings154 = [
        [
          "display_name",
          ".darikSemanticDisplayName150E",
        ],
        [
          "display_name_ar",
          ".darikSemanticDisplayNameAr150E",
        ],
        [
          "tagline",
          ".darikSemanticTagline150E",
        ],
        [
          "tagline_ar",
          ".darikSemanticTaglineAr150E",
        ],
      ] as const;

      for (const [
        key154,
        selector154,
      ] of mappings154) {
        const target154 =
          root154.querySelector(
            selector154
          );

        if (!target154) continue;

        const color154 =
          typographyColor154(key154);

        const style154 =
          (
            target154 as HTMLElement
          ).style;

        if (color154) {
          style154.setProperty(
            "color",
            color154,
            "important"
          );
        }
      }
    }


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

        [data-darik-pinching151="true"] {
          outline: 2px solid rgba(2, 132, 199, .95) !important;
          outline-offset: 4px !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          touch-action: none !important;
        }

        [data-darik-selected152="true"] {
          outline: 3px solid rgba(37, 99, 235, .98) !important;
          outline-offset: 5px !important;
          box-shadow: 0 0 0 2px rgba(255,255,255,.9) !important;
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

        // When grabbing a logo image, move its small branded wrapper.
        const logoVisual150D = rawElement150A.closest(
          "img, picture, svg"
        );

        if (logoVisual150D) {
          let logoBox150D: Element | null =
            logoVisual150D.parentElement;

          let logoDepth150D = 0;

          while (
            logoBox150D &&
            logoBox150D !== root150A &&
            logoDepth150D < 4
          ) {
            const tag150D =
              logoBox150D.tagName.toLowerCase();

            const identity150D = [
              logoBox150D.getAttribute("id") ?? "",
              logoBox150D.getAttribute("class") ?? "",
              logoBox150D.getAttribute("aria-label") ?? "",
            ]
              .join(" ")
              .toLowerCase();

            const rect150D =
              logoBox150D.getBoundingClientRect();

            const structural150D = [
              "main",
              "header",
              "footer",
              "nav",
              "section",
              "article",
            ].includes(tag150D);

            const branded150D =
              identity150D.includes("logo") ||
              identity150D.includes("brand");

            const smallWrapper150D =
              rect150D.width > 0 &&
              rect150D.height > 0 &&
              rect150D.width <= 420 &&
              rect150D.height <= 280 &&
              logoBox150D.children.length <= 5;

            if (
              !structural150D &&
              (branded150D || smallWrapper150D)
            ) {
              return logoBox150D;
            }

            logoBox150D =
              logoBox150D.parentElement;
            logoDepth150D += 1;
          }
        }

        // Prefer the actual content item. Structural wrappers, especially the
        // storefront hero itself, must never become the drag target.
        const semantic150C = rawElement150A.closest(
          "button, a, img, picture, video, h1, h2, h3, h4, h5, h6, p, label"
        );

        const chosen150A =
          semantic150C && root150A.contains(semantic150C)
            ? semantic150C
            : rawElement150A;

        if (chosen150A === root150A) return null;

        const tag150A = chosen150A.tagName.toLowerCase();
        const structuralTags150C = new Set([
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

        if (structuralTags150C.has(tag150A)) {
          return null;
        }

        // Complex DIVs are layout wrappers. This catches div-based hero shells
        // without blocking the text/logo/buttons inside them.
        if (
          tag150A === "div" &&
          chosen150A.querySelector(
            "h1, h2, h3, h4, p, img, picture, video, button, a, nav, section, article, header, footer"
          )
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

      function preventActiveDragScroll150C(
        event150C: Event
      ) {
        if (
          !dragging150A &&
          !pinching151
        ) {
          return;
        }

        event150C.preventDefault();
      }

      function lockDragScroll150C() {
        if (scrollLocked150C) return;
        scrollLocked150C = true;

        const iframeRoot150C = document150A.documentElement;
        const iframeBody150C = document150A.body;
        const parentRoot150C = document.documentElement;
        const parentBody150C = document.body;

        iframeRootOverflow150C = iframeRoot150C.style.overflow;
        iframeRootTouchAction150C = iframeRoot150C.style.touchAction;
        parentRootOverflow150C = parentRoot150C.style.overflow;
        parentRootTouchAction150C = parentRoot150C.style.touchAction;

        if (iframeBody150C) {
          iframeBodyOverflow150C = iframeBody150C.style.overflow;
          iframeBodyTouchAction150C = iframeBody150C.style.touchAction;
        }

        if (parentBody150C) {
          parentBodyOverflow150C = parentBody150C.style.overflow;
          parentBodyTouchAction150C = parentBody150C.style.touchAction;
        }

        iframeRoot150C.style.overflow = "hidden";
        iframeRoot150C.style.touchAction = "none";
        parentRoot150C.style.overflow = "hidden";
        parentRoot150C.style.touchAction = "none";

        if (iframeBody150C) {
          iframeBody150C.style.overflow = "hidden";
          iframeBody150C.style.touchAction = "none";
        }

        if (parentBody150C) {
          parentBody150C.style.overflow = "hidden";
          parentBody150C.style.touchAction = "none";
        }

        document150A.addEventListener(
          "wheel",
          preventActiveDragScroll150C,
          { capture: true, passive: false }
        );
        document150A.addEventListener(
          "touchmove",
          preventActiveDragScroll150C,
          { capture: true, passive: false }
        );
        document.addEventListener(
          "wheel",
          preventActiveDragScroll150C,
          { capture: true, passive: false }
        );
        document.addEventListener(
          "touchmove",
          preventActiveDragScroll150C,
          { capture: true, passive: false }
        );
      }

      function unlockDragScroll150C() {
        if (!scrollLocked150C) return;
        scrollLocked150C = false;

        const iframeRoot150C = document150A.documentElement;
        const iframeBody150C = document150A.body;
        const parentRoot150C = document.documentElement;
        const parentBody150C = document.body;

        iframeRoot150C.style.overflow = iframeRootOverflow150C;
        iframeRoot150C.style.touchAction = iframeRootTouchAction150C;
        parentRoot150C.style.overflow = parentRootOverflow150C;
        parentRoot150C.style.touchAction = parentRootTouchAction150C;

        if (iframeBody150C) {
          iframeBody150C.style.overflow = iframeBodyOverflow150C;
          iframeBody150C.style.touchAction = iframeBodyTouchAction150C;
        }

        if (parentBody150C) {
          parentBody150C.style.overflow = parentBodyOverflow150C;
          parentBody150C.style.touchAction = parentBodyTouchAction150C;
        }

        document150A.removeEventListener(
          "wheel",
          preventActiveDragScroll150C,
          true
        );
        document150A.removeEventListener(
          "touchmove",
          preventActiveDragScroll150C,
          true
        );
        document.removeEventListener(
          "wheel",
          preventActiveDragScroll150C,
          true
        );
        document.removeEventListener(
          "touchmove",
          preventActiveDragScroll150C,
          true
        );
      }

      function isEditorChrome152(
        eventTarget152: EventTarget | null
      ) {
        const element152 =
          eventTarget152 &&
          typeof (eventTarget152 as Node).nodeType === "number"
            ? (eventTarget152 as Element)
            : null;

        return Boolean(
          element152?.closest(
            '[data-darik-selection-toolbar152="true"], [data-darik-text-editor152="true"], [data-darik-reset-layout150c="true"]'
          )
        );
      }

      function editableTextMeta152(
        target152: Element | null
      ):
        | {
            formField:
              | "displayName"
              | "displayNameAr"
              | "tagline"
              | "taglineAr";
            dbField:
              | "display_name"
              | "display_name_ar"
              | "tagline"
              | "tagline_ar";
            typographyKey:
              | "display_name"
              | "display_name_ar"
              | "tagline"
              | "tagline_ar";
            label: string;
            required: boolean;
          }
        | null {
        if (!target152) return null;

        const classIdentity152 = (
          target152.getAttribute(
            "class"
          ) ?? ""
        ).toLowerCase();

        if (
          target152.classList.contains(
            "darikSemanticDisplayNameAr150E"
          ) ||
          classIdentity152.includes(
            "arabicname"
          )
        ) {
          return {
            formField: "displayNameAr",
            dbField: "display_name_ar",
            typographyKey:
              "display_name_ar",
            label: "Arabic store name",
            required: false,
          };
        }

        if (
          target152.classList.contains(
            "darikSemanticTaglineAr150E"
          ) ||
          classIdentity152.includes(
            "arabictagline"
          )
        ) {
          return {
            formField: "taglineAr",
            dbField: "tagline_ar",
            typographyKey: "tagline_ar",
            label: "Arabic tagline",
            required: false,
          };
        }

        if (
          target152.classList.contains(
            "darikSemanticDisplayName150E"
          )
        ) {
          return {
            formField: "displayName",
            dbField: "display_name",
            typographyKey: "display_name",
            label: "Store name",
            required: true,
          };
        }

        if (
          target152.classList.contains(
            "darikSemanticTagline150E"
          )
        ) {
          return {
            formField: "tagline",
            dbField: "tagline",
            typographyKey: "tagline",
            label: "Tagline",
            required: false,
          };
        }

        return null;
      }

      function positionSelectionUi152() {
        if (
          !selectedTarget152 ||
          !selectionToolbar152
        ) {
          return;
        }

        const rect152 =
          selectedTarget152.getBoundingClientRect();

        const toolbarWidth152 =
          Math.max(
            180,
            selectionToolbar152.offsetWidth ||
              180
          );

        const maxLeft152 =
          Math.max(
            8,
            window150A.innerWidth -
              toolbarWidth152 -
              8
          );

        const left152 =
          Math.max(
            8,
            Math.min(
              maxLeft152,
              rect152.left +
                rect152.width / 2 -
                toolbarWidth152 / 2
            )
          );

        const preferredTop152 =
          rect152.top - 54;

        const top152 =
          preferredTop152 >= 8
            ? preferredTop152
            : Math.min(
                window150A.innerHeight - 54,
                rect152.bottom + 10
              );

        selectionToolbar152.style.left =
          `${Math.round(left152)}px`;

        selectionToolbar152.style.top =
          `${Math.round(
            Math.max(8, top152)
          )}px`;
      }

      function showToolbarStatus152(
        text152: string
      ) {
        if (!selectionToolbar152) {
          return;
        }

        const status152 =
          selectionToolbar152.querySelector(
            '[data-darik-toolbar-status152="true"]'
          );

        if (!status152) {
          return;
        }

        (status152 as HTMLElement).textContent = text152;

        if (toolbarStatusTimer152) {
          window150A.clearTimeout(
            toolbarStatusTimer152
          );
        }

        toolbarStatusTimer152 =
          window150A.setTimeout(
            () => {
              (status152 as HTMLElement).textContent = "";
              toolbarStatusTimer152 = 0;
            },
            1500
          );
      }

      function closeTextEditor152() {
        textEditor152?.remove();
        textEditor152 = null;
        textEditorDiscard153 = null;
        textEditorSave153 = null;
      }

      function hideTextEditorPanel154() {
        // Remove only the visible panel. Keep the DOM node + callbacks
        // in memory so the existing floppy can save the pending preview,
        // and Edit can reopen the same pending controls.
        textEditor152?.remove();

        positionSelectionUi152();
      }

      function discardTextEditorPreview153() {
        const discard153 =
          textEditorDiscard153;

        textEditorDiscard153 = null;
        textEditorSave153 = null;

        discard153?.();

        textEditor152?.remove();
        textEditor152 = null;
      }

      function clearSelection152() {
        selectedTarget152?.removeAttribute(
          "data-darik-selected152"
        );

        selectedTarget152 = null;

        selectionToolbar152?.remove();
        selectionToolbar152 = null;

        discardTextEditorPreview153();

        clearHold150A();
        candidate150A = null;
        dragging150A = false;
        pinching151 = false;
        pinchTarget151 = null;

        unlockDragScroll150C();
      }

      function currentPointForTarget152(
        target152: Element
      ) {
        const root152 =
          document150A.querySelector(
            "[data-darik-position-builder145]"
          );

        if (!root152) return null;

        assignSemanticClasses150E(
          root152
        );

        const locatorKey152 =
          locator150D(
            root152,
            target152
          );

        if (!locatorKey152) {
          return null;
        }

        const currentDevice152 =
          device150D(window150A);

        const existing152 =
          savedLayout150D[
            currentDevice152
          ][locatorKey152];

        const computedTranslate152 =
          parseTranslate150A(
            window150A.getComputedStyle(
              target152
            ).translate
          );

        const computedScale152 =
          parseScale151(
            window150A.getComputedStyle(
              target152
            ).scale
          );

        return {
          root152,
          locatorKey152,
          currentDevice152,
          point152: {
            x:
              existing152?.x ??
              clamp150D(
                computedTranslate152.x
              ),
            y:
              existing152?.y ??
              clamp150D(
                computedTranslate152.y
              ),
            scale:
              existing152?.scale ??
              clampScale151(
                computedScale152
              ),
            hidden:
              existing152?.hidden ??
              false,
            label:
              existing152?.label ??
              label150D(target152),
          },
        };
      }

      function saveSelectedPatch152(
        target152: Element,
        patch152: Partial<
          DarikPoint150D
        >
      ) {
        const resolved152 =
          currentPointForTarget152(
            target152
          );

        if (!resolved152) {
          return false;
        }

        const nextDevice152 = {
          ...savedLayout150D[
            resolved152.currentDevice152
          ],
        };

        nextDevice152[
          resolved152.locatorKey152
        ] = {
          ...resolved152.point152,
          ...patch152,
          x: clamp150D(
            patch152.x ??
              resolved152.point152.x
          ),
          y: clamp150D(
            patch152.y ??
              resolved152.point152.y
          ),
          scale: clampScale151(
            patch152.scale ??
              resolved152.point152.scale
          ),
        };

        savedLayout150D = {
          ...savedLayout150D,
          [resolved152.currentDevice152]:
            nextDevice152,
        };

        target152.setAttribute(
          "data-darik-persisted150d",
          "true"
        );

        void saveLayout150D();

        return true;
      }

      function hideSelected152() {
        if (!selectedTarget152) {
          return;
        }

        const target152 =
          selectedTarget152;

        if (
          !originalDisplay152.has(
            target152
          )
        ) {
          originalDisplay152.set(
            target152,
            (
              target152 as HTMLElement
            ).style.getPropertyValue(
              "display"
            )
          );
        }

        if (
          !saveSelectedPatch152(
            target152,
            { hidden: true }
          )
        ) {
          showToolbarStatus152(
            "Could not hide"
          );
          return;
        }

        (
          target152 as HTMLElement
        ).style.setProperty(
          "display",
          "none",
          "important"
        );

        clearSelection152();
      }

      async function saveInlineText152(
        input152: HTMLInputElement,
        fontSelect152: HTMLSelectElement,
        sizeInput152: HTMLInputElement,
        colorInput154: HTMLInputElement
      ) {
        const target152 =
          selectedTarget152;

        const meta152 =
          editableTextMeta152(
            target152
          );

        if (
          !target152 ||
          !meta152 ||
          !storefront?.id
        ) {
          return;
        }

        const nextText152 =
          input152.value.trim();

        if (
          meta152.required &&
          !nextText152
        ) {
          window.alert(
            "The store name cannot be blank. Use Trash if you want to hide it visually."
          );
          return;
        }

        const fontKey152 =
          String(
            fontSelect152.value ||
              "theme"
          ) as StorefrontTypographyFontKey;

        const rawSize152 =
          Number(sizeInput152.value);

        const size152 =
          rawSize152 === 0
            ? 0
            : Math.max(
                10,
                Math.min(
                  96,
                  Math.round(
                    Number.isFinite(
                      rawSize152
                    )
                      ? rawSize152
                      : 0
                  )
                )
              );

        const existingColor154 =
          typographyColor154(
            meta152.typographyKey
          );

        const chosenColor154 =
          colorInput154.dataset
            .darikColorTouched154 ===
          "true"
            ? normalizeTextColor154(
                colorInput154.value
              )
            : existingColor154;

        const normalizedTypography154 =
          normalizeStorefrontTypography(
            {
              ...inlineTypography152,
              [meta152.typographyKey]: {
                font: fontKey152,
                size: size152,
              },
            }
          );

        const nextTypography152 =
          withTypographyColor154(
            normalizedTypography154,
            meta152.typographyKey,
            chosenColor154
          );

        showToolbarStatus152(
          "Saving..."
        );

        const textResult152 =
          await supabase
            .from(
              "retailer_storefronts"
            )
            .update({
              [meta152.dbField]:
                nextText152 || null,
            })
            .eq(
              "id",
              storefront.id
            );

        if (textResult152.error) {
          window.alert(
            textResult152.error.message
          );

          showToolbarStatus152(
            "Save failed"
          );
          return;
        }

        const typographyResult152 =
          await supabase.rpc(
            "darik_direct_set_storefront_typography",
            {
              p_storefront_id:
                storefront.id,
              p_typography:
                nextTypography152,
            }
          );

        if (
          typographyResult152.error
        ) {
          window.alert(
            typographyResult152.error.message
          );

          showToolbarStatus152(
            "Font save failed"
          );
          return;
        }

        inlineTypography152 =
          nextTypography152;

        setSetupForm((current152) => ({
          ...current152,
          [meta152.formField]:
            nextText152,
        }));

        setStorefrontTypographyDraft(
          nextTypography152
        );

        target152.textContent =
          nextText152;

        textEditorDiscard153 = null;
        textEditorSave153 = null;

        closeTextEditor152();

        showToolbarStatus152(
          "Saved ✓"
        );

        scheduleStableApply150EV3(
          180
        );
      }

      function openTextEditor152() {
        const target152 =
          selectedTarget152;

        const meta152 =
          editableTextMeta152(
            target152
          );

        if (!target152 || !meta152) {
          return;
        }

        if (
          textEditor152 &&
          !textEditor152.isConnected &&
          textEditorSave153
        ) {
          document150A.body.appendChild(
            textEditor152
          );

          positionSelectionUi152();

          const reopenInput154 =
            textEditor152.querySelector(
              'input[type="text"]'
            );

          if (
            reopenInput154 instanceof
              HTMLInputElement
          ) {
            reopenInput154.focus();
          }

          return;
        }

        discardTextEditorPreview153();

        const originalTypography153 =
          withTypographyColor154(
            normalizeStorefrontTypography(
              inlineTypography152
            ),
            meta152.typographyKey,
            typographyColor154(
              meta152.typographyKey
            )
          );

        const originalText153 =
          target152.textContent ?? "";

        const originalInlineColor154 =
          (target152 as HTMLElement).style.getPropertyValue(
            "color"
          );

        const originalInlineColorPriority154 =
          (target152 as HTMLElement).style.getPropertyPriority(
            "color"
          );

        const targetRect153B =
          target152.getBoundingClientRect();

        const dockPanelBottom153B =
          targetRect153B.top <
          window150A.innerHeight * 0.55;

        const panel152 =
          document150A.createElement(
            "div"
          );

        panel152.setAttribute(
          "data-darik-text-editor152",
          "true"
        );

        Object.assign(
          panel152.style,
          {
            position: "fixed",
            left: "50%",
            top:
              dockPanelBottom153B
                ? "auto"
                : "64px",
            bottom:
              dockPanelBottom153B
                ? "86px"
                : "auto",
            transform:
              "translateX(-50%)",
            width:
              "min(350px, calc(100vw - 20px))",
            maxHeight: "38vh",
            overflowY: "auto",
            zIndex: "6400",
            background:
              "rgba(255,255,255,.97)",
            backdropFilter:
              "blur(12px)",
            WebkitBackdropFilter:
              "blur(12px)",
            border:
              "1px solid rgba(15,23,42,.16)",
            borderRadius: "16px",
            padding: "10px",
            boxShadow:
              "0 14px 38px rgba(15,23,42,.22)",
            color: "#0f172a",
            fontFamily:
              "system-ui, -apple-system, sans-serif",
          }
        );

        const heading152 =
          document150A.createElement(
            "div"
          );

        heading152.textContent =
          `Edit ${meta152.label}`;

        Object.assign(
          heading152.style,
          {
            fontSize: "12px",
            fontWeight: "900",
            marginBottom: "7px",
          }
        );

        const input152 =
          document150A.createElement(
            "input"
          );

        input152.type = "text";
        input152.value =
          target152.textContent?.trim() ??
          "";

        Object.assign(
          input152.style,
          {
            width: "100%",
            boxSizing: "border-box",
            border:
              "1px solid rgba(15,23,42,.18)",
            borderRadius: "10px",
            padding: "8px 10px",
            marginBottom: "7px",
            fontSize: "14px",
          }
        );

        const fontRow152 =
          document150A.createElement(
            "div"
          );

        Object.assign(
          fontRow152.style,
          {
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1fr) 78px 48px",
            gap: "7px",
            marginBottom: "7px",
          }
        );

        const fontSelect152 =
          document150A.createElement(
            "select"
          );

        const currentTypography152 =
          inlineTypography152[
            meta152.typographyKey
          ];

        for (
          const group152 of
          storefrontTypographyFontGroups
        ) {
          const optgroup152 =
            document150A.createElement(
              "optgroup"
            );

          optgroup152.label =
            group152.label;

          for (
            const option152 of
            group152.options
          ) {
            const optionElement152 =
              document150A.createElement(
                "option"
              );

            optionElement152.value =
              option152.key;

            optionElement152.textContent =
              option152.label;

            optgroup152.appendChild(
              optionElement152
            );
          }

          fontSelect152.appendChild(
            optgroup152
          );
        }

        fontSelect152.value =
          currentTypography152.font;

        const sizeInput152 =
          document150A.createElement(
            "input"
          );

        sizeInput152.type = "number";
        sizeInput152.min = "0";
        sizeInput152.max = "96";
        sizeInput152.step = "1";
        sizeInput152.value =
          String(
            currentTypography152.size
          );

        const colorInput154 =
          document150A.createElement(
            "input"
          );

        colorInput154.type =
          "color";

        colorInput154.title =
          "Text color";

        const savedColor154 =
          typographyColor154(
            meta152.typographyKey
          );

        colorInput154.value =
          savedColor154 ||
          "#111827";

        colorInput154.dataset
          .darikColorTouched154 =
          "false";

        Object.assign(
          colorInput154.style,
          {
            width: "48px",
            height: "40px",
            boxSizing: "border-box",
            border:
              "1px solid rgba(15,23,42,.18)",
            borderRadius: "12px",
            padding: "3px",
            background: "#fff",
            cursor: "pointer",
          }
        );

        function previewTypography153() {
          const previewFont153 =
            String(
              fontSelect152.value ||
                "theme"
            ) as StorefrontTypographyFontKey;

          const rawPreviewSize153 =
            Number(sizeInput152.value);

          const previewSize153 =
            rawPreviewSize153 === 0
              ? 0
              : Math.max(
                  10,
                  Math.min(
                    96,
                    Math.round(
                      Number.isFinite(
                        rawPreviewSize153
                      )
                        ? rawPreviewSize153
                        : 0
                    )
                  )
                );

          const previewColor154 =
            colorInput154.dataset
              .darikColorTouched154 ===
            "true"
              ? normalizeTextColor154(
                  colorInput154.value
                )
              : typographyColor154(
                  meta152.typographyKey
                );

          const normalizedPreview154 =
            normalizeStorefrontTypography(
              {
                ...inlineTypography152,
                [meta152.typographyKey]: {
                  font: previewFont153,
                  size: previewSize153,
                },
              }
            );

          const nextPreview153 =
            withTypographyColor154(
              normalizedPreview154,
              meta152.typographyKey,
              previewColor154
            );

          inlineTypography152 =
            nextPreview153;

          // This state change is PREVIEW ONLY. We intentionally do not
          // mark typography dirty or call the persistence RPC here.
          // The existing live-builder bridge pushes the draft to the
          // actual private storefront iframe immediately.
          setStorefrontTypographyDraft(
            nextPreview153
          );

          target152.textContent =
            input152.value;

          if (previewColor154) {
            (
              target152 as HTMLElement
            ).style.setProperty(
              "color",
              previewColor154,
              "important"
            );
          }

          const root154 =
            document150A.querySelector(
              "[data-darik-position-builder145]"
            );

          if (root154) {
            window150A.setTimeout(
              () => {
                applyTextColors154(
                  root154
                );
              },
              0
            );
          }

          showToolbarStatus152(
            "Preview — tap 💾 to save"
          );
        }

        textEditorDiscard153 = () => {
          inlineTypography152 =
            originalTypography153;

          setStorefrontTypographyDraft(
            originalTypography153
          );

          target152.textContent =
            originalText153;

          const targetStyle154 =
            (target152 as HTMLElement).style;

          if (originalInlineColor154) {
            targetStyle154.setProperty(
              "color",
              originalInlineColor154,
              originalInlineColorPriority154
            );
          } else {
            targetStyle154.removeProperty(
              "color"
            );
          }

          scheduleStableApply150EV3(
            0
          );
        };

        textEditorSave153 = () => {
          void saveInlineText152(
            input152,
            fontSelect152,
            sizeInput152,
            colorInput154
          );
        };

        fontSelect152.addEventListener(
          "change",
          () => {
            previewTypography153();

            window150A.setTimeout(
              hideTextEditorPanel154,
              0
            );
          }
        );

        colorInput154.addEventListener(
          "input",
          () => {
            colorInput154.dataset
              .darikColorTouched154 =
              "true";

            previewTypography153();
          }
        );

        colorInput154.addEventListener(
          "change",
          () => {
            colorInput154.dataset
              .darikColorTouched154 =
              "true";

            previewTypography153();

            window150A.setTimeout(
              hideTextEditorPanel154,
              0
            );
          }
        );

        sizeInput152.addEventListener(
          "input",
          previewTypography153
        );

        input152.addEventListener(
          "input",
          previewTypography153
        );

        for (const control152 of [
          fontSelect152,
          sizeInput152,
        ]) {
          Object.assign(
            control152.style,
            {
              width: "100%",
              boxSizing:
                "border-box",
              border:
                "1px solid rgba(15,23,42,.18)",
              borderRadius: "12px",
              padding: "10px",
              background: "#fff",
            }
          );
        }

        fontRow152.append(
          fontSelect152,
          sizeInput152,
          colorInput154
        );

        const helper152 =
          document150A.createElement(
            "div"
          );

        helper152.textContent =
          "Pick a font or color and this box closes automatically. Tap ✏️ to reopen. The visible 💾 saves what you are seeing.";

        Object.assign(
          helper152.style,
          {
            fontSize: "10px",
            lineHeight: "1.35",
            color: "#64748b",
            marginBottom: "7px",
          }
        );

        const actions152 =
          document150A.createElement(
            "div"
          );

        Object.assign(
          actions152.style,
          {
            display: "flex",
            gap: "8px",
            justifyContent:
              "flex-end",
          }
        );

        const cancel152 =
          document150A.createElement(
            "button"
          );

        cancel152.type = "button";
        cancel152.textContent =
          "Cancel";

        for (const button152 of [
          cancel152,
        ]) {
          Object.assign(
            button152.style,
            {
              border:
                "1px solid rgba(15,23,42,.16)",
              borderRadius: "999px",
              padding: "7px 11px",
              fontSize: "11px",
              fontWeight: "850",
              cursor: "pointer",
            }
          );
        }

        cancel152.style.background =
          "#fff";

        cancel152.addEventListener(
          "click",
          discardTextEditorPreview153
        );

        actions152.append(
          cancel152
        );

        panel152.append(
          heading152,
          input152,
          fontRow152,
          helper152,
          actions152
        );

        document150A.body.appendChild(
          panel152
        );

        textEditor152 = panel152;

        // Keep the selected-object toolbar visible and above this panel.
        positionSelectionUi152();

        input152.focus();
        input152.select();
      }

      function installSelectionToolbar152() {
        selectionToolbar152?.remove();
        selectionToolbar152 = null;

        if (!selectedTarget152) {
          return;
        }

        const toolbar152 =
          document150A.createElement(
            "div"
          );

        toolbar152.setAttribute(
          "data-darik-selection-toolbar152",
          "true"
        );

        Object.assign(
          toolbar152.style,
          {
            position: "fixed",
            zIndex: "7200",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 8px",
            background:
              "rgba(15,23,42,.96)",
            borderRadius: "14px",
            boxShadow:
              "0 12px 35px rgba(15,23,42,.28)",
            color: "#fff",
            fontFamily:
              "system-ui, -apple-system, sans-serif",
            whiteSpace: "nowrap",
          }
        );

        const makeIcon152 = (
          icon152: string,
          title152: string
        ) => {
          const button152 =
            document150A.createElement(
              "button"
            );

          button152.type = "button";
          button152.textContent =
            icon152;
          button152.title = title152;

          Object.assign(
            button152.style,
            {
              width: "34px",
              height: "34px",
              border: "0",
              borderRadius: "10px",
              background:
                "rgba(255,255,255,.12)",
              color: "#fff",
              fontSize: "17px",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              padding: "0",
            }
          );

          return button152;
        };

        const trash152 =
          makeIcon152(
            "🗑️",
            "Hide this storefront element"
          );

        const save152 =
          makeIcon152(
            "💾",
            "Save position and size"
          );

        const edit152 =
          makeIcon152(
            "✏️",
            "Edit text and font"
          );

        const status152 =
          document150A.createElement(
            "span"
          );

        status152.setAttribute(
          "data-darik-toolbar-status152",
          "true"
        );

        Object.assign(
          status152.style,
          {
            minWidth: "0",
            fontSize: "11px",
            fontWeight: "800",
            color:
              "rgba(255,255,255,.88)",
            paddingInline: "2px",
          }
        );

        trash152.addEventListener(
          "click",
          (event152) => {
            event152.preventDefault();
            event152.stopPropagation();
            hideSelected152();
          }
        );

        save152.addEventListener(
          "click",
          (event152) => {
            event152.preventDefault();
            event152.stopPropagation();

            if (
              textEditorSave153
            ) {
              textEditorSave153();
              return;
            }

            void saveLayout150D();

            showToolbarStatus152(
              "Saved ✓"
            );
          }
        );

        edit152.addEventListener(
          "click",
          (event152) => {
            event152.preventDefault();
            event152.stopPropagation();
            openTextEditor152();
          }
        );

        toolbar152.append(
          trash152,
          save152
        );

        if (
          editableTextMeta152(
            selectedTarget152
          )
        ) {
          toolbar152.append(
            edit152
          );
        }

        toolbar152.append(
          status152
        );

        document150A.body.appendChild(
          toolbar152
        );

        selectionToolbar152 =
          toolbar152;

        positionSelectionUi152();
      }

      function selectTarget152(
        target152: Element
      ) {
        if (
          target152 ===
          selectedTarget152
        ) {
          positionSelectionUi152();
          return;
        }

        selectedTarget152?.removeAttribute(
          "data-darik-selected152"
        );

        discardTextEditorPreview153();

        selectedTarget152 =
          target152;

        // Selection itself is explicit edit mode. Lock scrolling until
        // the retailer taps empty space / clears the selection.
        lockDragScroll150C();

        target152.setAttribute(
          "data-darik-selected152",
          "true"
        );

        installSelectionToolbar152();
      }

      function handleSelectionClick152(
        event152: MouseEvent
      ) {
        if (
          Date.now() <
            blockClickUntil150A &&
          blockClickTarget150A
        ) {
          return;
        }

        if (
          isEditorChrome152(
            event152.target
          )
        ) {
          return;
        }

        const target152 =
          chooseTarget150A(
            event152.target
          );

        if (target152) {
          // Private-preview editor owns this click. Do not let the
          // storefront's real button/link action fire while selecting.
          // This prevents Browse products / Shop / Call / category links
          // from navigating or scrolling the editor away from the object.
          event152.preventDefault();
          event152.stopPropagation();
          event152.stopImmediatePropagation();

          selectTarget152(
            target152
          );
        } else {
          clearSelection152();
        }
      }

      function resetProofLayout150C() {
        clearSelection152();

        clearHold150A();
        unlockDragScroll150C();
        restoreCandidateDecoration150A();

        candidate150A = null;
        dragging150A = false;
        blockClickTarget150A = null;
        blockClickUntil150A = 0;

        for (const [
          target150C,
          originalTranslate150C,
        ] of originalTranslate150A.entries()) {
          const style150C = (target150C as HTMLElement).style;

          if (originalTranslate150C) {
            style150C.setProperty(
              "translate",
              originalTranslate150C
            );
          } else {
            style150C.removeProperty("translate");
          }

          target150C.removeAttribute(
            "data-darik-dragging150a"
          );
        }

        originalTranslate150A.clear();

        for (const [
          target151,
          originalScaleValue151,
        ] of originalScale151.entries()) {
          const style151 =
            (target151 as HTMLElement).style;

          if (originalScaleValue151) {
            style151.setProperty(
              "scale",
              originalScaleValue151
            );
          } else {
            style151.removeProperty(
              "scale"
            );
          }

          target151.removeAttribute(
            "data-darik-pinching151"
          );
        }

        originalScale151.clear();

        for (const [
          target152,
          originalDisplayValue152,
        ] of originalDisplay152.entries()) {
          const style152 =
            (target152 as HTMLElement).style;

          if (originalDisplayValue152) {
            style152.setProperty(
              "display",
              originalDisplayValue152
            );
          } else {
            style152.removeProperty(
              "display"
            );
          }
        }

        originalDisplay152.clear();

        pinching151 = false;
        pinchTarget151 = null;
        pinchStartDistance151 = 0;
        pinchBaseScale151 = 1;
        pinchCurrentScale151 = 1;

        savedLayout150D = defaultLayout150D();

        document150A
          .querySelectorAll(
            '[data-darik-persisted150d="true"]'
          )
          .forEach((target150D) => {
            target150D.removeAttribute(
              "data-darik-persisted150d"
            );
          });

        void saveLayout150D();
      }

      function installResetButton150C() {
        resetButton150C?.remove();

        const button150C = document.createElement("button");
        button150C.type = "button";
        button150C.textContent = "Reset layout / إعادة الضبط";
        button150C.setAttribute(
          "data-darik-reset-layout150c",
          "true"
        );
        button150C.title =
          "Restore moved, resized, or hidden preview elements to their defaults";

        Object.assign(button150C.style, {
          position: "fixed",
          left: "16px",
          right: "auto",
          bottom: "16px",
          zIndex: "4000",
          border: "1px solid rgba(15,23,42,.18)",
          borderRadius: "999px",
          padding: "10px 14px",
          background: "rgba(255,255,255,.97)",
          color: "#0f172a",
          fontSize: "12px",
          fontWeight: "800",
          lineHeight: "1",
          boxShadow: "0 10px 30px rgba(15,23,42,.18)",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
        });

        button150C.addEventListener(
          "click",
          resetProofLayout150C
        );

        document.body.appendChild(button150C);
        resetButton150C = button150C;
      }

      installResetButton150C();
      scheduleStableApply150EV3(180);

      function parseScale151(
        value151: string
      ) {
        const normalized151 = String(
          value151 || ""
        ).trim();

        if (
          !normalized151 ||
          normalized151 === "none"
        ) {
          return 1;
        }

        const numeric151 = Number(
          normalized151
            .split(" ")[0]
        );

        return clampScale151(
          Number.isFinite(numeric151)
            ? numeric151
            : 1
        );
      }

      function pinchDistance151(
        first151: Touch,
        second151: Touch
      ) {
        return Math.hypot(
          second151.clientX -
            first151.clientX,
          second151.clientY -
            first151.clientY
        );
      }

      function sharedPinchTarget151(
        first151: Element | null,
        second151: Element | null
      ) {
        if (!first151 || !second151) {
          return null;
        }

        if (first151 === second151) {
          return first151;
        }

        if (first151.contains(second151)) {
          return first151;
        }

        if (second151.contains(first151)) {
          return second151;
        }

        return null;
      }

      function saveScale151(
        target151: Element,
        scale151: number
      ) {
        const root151 =
          document150A.querySelector(
            "[data-darik-position-builder145]"
          );

        if (!root151) return;

        assignSemanticClasses150E(
          root151
        );

        const locatorKey151 =
          locator150D(
            root151,
            target151
          );

        if (!locatorKey151) return;

        const currentDevice151 =
          device150D(window150A);

        const nextDevice151 = {
          ...savedLayout150D[
            currentDevice151
          ],
        };

        const computedTranslate151 =
          parseTranslate150A(
            window150A.getComputedStyle(
              target151
            ).translate
          );

        const prior151 =
          nextDevice151[
            locatorKey151
          ];

        if (
          !prior151 &&
          Object.keys(
            nextDevice151
          ).length >= 250
        ) {
          const oldest151 =
            Object.keys(
              nextDevice151
            )[0];

          if (oldest151) {
            delete nextDevice151[
              oldest151
            ];
          }
        }

        nextDevice151[
          locatorKey151
        ] = {
          x: prior151?.x ??
            clamp150D(
              computedTranslate151.x
            ),
          y: prior151?.y ??
            clamp150D(
              computedTranslate151.y
            ),
          scale: clampScale151(
            scale151
          ),
          ...(prior151?.hidden !==
          undefined
            ? {
                hidden:
                  prior151.hidden,
              }
            : {}),
          label:
            prior151?.label ??
            label150D(target151),
        };

        savedLayout150D = {
          ...savedLayout150D,
          [currentDevice151]:
            nextDevice151,
        };

        target151.setAttribute(
          "data-darik-persisted150d",
          "true"
        );

        void saveLayout150D();
      }

      function beginPinch151(
        event151: TouchEvent
      ) {
        if (
          event151.touches.length !== 2
        ) {
          return;
        }

        const firstTouch151 =
          event151.touches[0];

        const secondTouch151 =
          event151.touches[1];

        if (
          !selectedTarget152 ||
          isEditorChrome152(
            firstTouch151.target
          ) ||
          isEditorChrome152(
            secondTouch151.target
          )
        ) {
          return;
        }

        const target151 =
          selectedTarget152;

        clearHold150A();

        if (dragging150A) {
          restoreCandidateDecoration150A();
          dragging150A = false;
        }

        candidate150A = null;

        if (
          !originalScale151.has(
            target151
          )
        ) {
          originalScale151.set(
            target151,
            (
              target151 as HTMLElement
            ).style.getPropertyValue(
              "scale"
            )
          );
        }

        pinching151 = true;
        pinchTarget151 = target151;

        pinchStartDistance151 =
          Math.max(
            1,
            pinchDistance151(
              firstTouch151,
              secondTouch151
            )
          );

        pinchBaseScale151 =
          parseScale151(
            window150A.getComputedStyle(
              target151
            ).scale
          );

        pinchCurrentScale151 =
          pinchBaseScale151;

        target151.setAttribute(
          "data-darik-pinching151",
          "true"
        );

        lockDragScroll150C();

        event151.preventDefault();
        event151.stopPropagation();
      }

      function movePinch151(
        event151: TouchEvent
      ) {
        if (
          !pinching151 ||
          !pinchTarget151 ||
          event151.touches.length < 2
        ) {
          return;
        }

        const distance151 =
          pinchDistance151(
            event151.touches[0],
            event151.touches[1]
          );

        const ratio151 =
          distance151 /
          Math.max(
            1,
            pinchStartDistance151
          );

        pinchCurrentScale151 =
          clampScale151(
            pinchBaseScale151 *
              ratio151
          );

        (
          pinchTarget151 as HTMLElement
        ).style.setProperty(
          "scale",
          String(
            pinchCurrentScale151
          ),
          "important"
        );

        positionSelectionUi152();

        event151.preventDefault();
        event151.stopPropagation();
      }

      function finishPinch151(
        event151: TouchEvent
      ) {
        if (!pinching151) return;

        if (
          event151.touches.length >= 2
        ) {
          return;
        }

        event151.preventDefault();
        event151.stopPropagation();

        const completed151 =
          pinchTarget151;

        if (completed151) {
          saveScale151(
            completed151,
            pinchCurrentScale151
          );

          completed151.removeAttribute(
            "data-darik-pinching151"
          );

          blockClickTarget150A =
            completed151;

          blockClickUntil150A =
            Date.now() + 500;
        }

        pinching151 = false;
        pinchTarget151 = null;
        pinchStartDistance151 = 0;
        pinchBaseScale151 = 1;
        pinchCurrentScale151 = 1;

        candidate150A = null;
        dragging150A = false;

        unlockDragScroll150C();
      }

      function cancelPinch151(
        event151: TouchEvent
      ) {
        if (!pinching151) return;

        const completed151 =
          pinchTarget151;

        if (completed151) {
          saveScale151(
            completed151,
            pinchCurrentScale151
          );

          completed151.removeAttribute(
            "data-darik-pinching151"
          );
        }

        pinching151 = false;
        pinchTarget151 = null;
        pinchStartDistance151 = 0;
        pinchBaseScale151 = 1;
        pinchCurrentScale151 = 1;

        candidate150A = null;
        dragging150A = false;

        unlockDragScroll150C();

        event151.preventDefault();
      }

      function beginDrag150A() {
        if (!candidate150A || dragging150A) return;

        clearHold150A();
        dragging150A = true;
        lockDragScroll150C();

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
          pinching151 &&
          event150A.pointerType === "touch"
        ) {
          return;
        }
        const semanticRoot150E =
          document150A.querySelector(
            "[data-darik-position-builder145]"
          );

        if (semanticRoot150E) {
          assignSemanticClasses150E(
            semanticRoot150E
          );
        }

        if (
          event150A.pointerType === "mouse" &&
          event150A.button !== 0
        ) {
          return;
        }

        if (
          !selectedTarget152 ||
          isEditorChrome152(
            event150A.target
          )
        ) {
          return;
        }

        const target150A =
          selectedTarget152;

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

        // Selected-object mode: one finger can move the selected
        // element from anywhere in the preview without a hold delay.
      }

      function moveCandidate150A(event150A: PointerEvent) {
        if (pinching151) {
          return;
        }

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
          candidate150A.pointerType === "touch" &&
          distance150A >= 1
        ) {
          beginDrag150A();
        }

        if (!dragging150A && distance150A >= 1) {
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

        positionSelectionUi152();
      }

      function finishCandidate150A(
        event150A: PointerEvent
      ) {
        if (pinching151) {
          return;
        }

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

        const root150D = document150A.querySelector(
          "[data-darik-position-builder145]"
        );

        if (root150D) {
          const locatorKey150D = locator150D(
            root150D,
            completed150A.target
          );

          if (locatorKey150D) {
            const dx150D =
              event150A.clientX - completed150A.startX;

            const dy150D =
              event150A.clientY - completed150A.startY;

            const x150D = clamp150D(
              completed150A.baseX + dx150D
            );

            const y150D = clamp150D(
              completed150A.baseY + dy150D
            );

            const currentDevice150D =
              device150D(window150A);

            const nextDevice150D = {
              ...savedLayout150D[currentDevice150D],
            };

            if (
              !nextDevice150D[locatorKey150D] &&
              Object.keys(nextDevice150D).length >= 250
            ) {
              const oldest150D =
                Object.keys(nextDevice150D)[0];

              if (oldest150D) {
                delete nextDevice150D[oldest150D];
              }
            }

            const priorPoint151 =
              nextDevice150D[
                locatorKey150D
              ];

            nextDevice150D[locatorKey150D] = {
              x: x150D,
              y: y150D,
              ...(priorPoint151?.scale !==
              undefined
                ? {
                    scale:
                      clampScale151(
                        priorPoint151.scale
                      ),
                  }
                : {}),
              ...(priorPoint151?.hidden !==
              undefined
                ? {
                    hidden:
                      priorPoint151.hidden,
                  }
                : {}),
              label: label150D(
                completed150A.target
              ),
            };

            savedLayout150D = {
              ...savedLayout150D,
              [currentDevice150D]: nextDevice150D,
            };

            completed150A.target.setAttribute(
              "data-darik-persisted150d",
              "true"
            );

            void saveLayout150D();
          }
        }

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
        unlockDragScroll150C();
      }

      function cancelCandidate150A(
        event150A: PointerEvent
      ) {
        if (pinching151) {
          return;
        }

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
        unlockDragScroll150C();
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
        "click",
        handleSelectionClick152,
        true
      );

      document150A.addEventListener(
        "touchstart",
        beginPinch151,
        {
          capture: true,
          passive: false,
        }
      );

      document150A.addEventListener(
        "touchmove",
        movePinch151,
        {
          capture: true,
          passive: false,
        }
      );

      document150A.addEventListener(
        "touchend",
        finishPinch151,
        {
          capture: true,
          passive: false,
        }
      );

      document150A.addEventListener(
        "touchcancel",
        cancelPinch151,
        {
          capture: true,
          passive: false,
        }
      );

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
        unlockDragScroll150C();

        if (resetButton150C) {
          resetButton150C.removeEventListener(
            "click",
            resetProofLayout150C
          );
          resetButton150C.remove();
          resetButton150C = null;
        }

        document150A.removeEventListener(
          "click",
          handleSelectionClick152,
          true
        );

        document150A.removeEventListener(
          "touchstart",
          beginPinch151,
          true
        );

        document150A.removeEventListener(
          "touchmove",
          movePinch151,
          true
        );

        document150A.removeEventListener(
          "touchend",
          finishPinch151,
          true
        );

        document150A.removeEventListener(
          "touchcancel",
          cancelPinch151,
          true
        );

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

          target150A.removeAttribute(
            "data-darik-persisted150d"
          );

          target150A.removeAttribute(
            "data-darik-pinching151"
          );
        }

        for (const [
          target151,
          originalScaleValue151,
        ] of originalScale151.entries()) {
          const style151 =
            (target151 as HTMLElement).style;

          if (originalScaleValue151) {
            style151.setProperty(
              "scale",
              originalScaleValue151
            );
          } else {
            style151.removeProperty(
              "scale"
            );
          }

          target151.removeAttribute(
            "data-darik-pinching151"
          );
        }

        originalScale151.clear();

        for (const [
          target152,
          originalDisplayValue152,
        ] of originalDisplay152.entries()) {
          const style152 =
            (target152 as HTMLElement).style;

          if (originalDisplayValue152) {
            style152.setProperty(
              "display",
              originalDisplayValue152
            );
          } else {
            style152.removeProperty(
              "display"
            );
          }

          target152.removeAttribute(
            "data-darik-selected152"
          );
        }

        originalDisplay152.clear();

        clearSelection152();

        textEditorDiscard153 = null;
        textEditorSave153 = null;

        if (toolbarStatusTimer152) {
          window150A.clearTimeout(
            toolbarStatusTimer152
          );

          toolbarStatusTimer152 = 0;
        }

        pinching151 = false;
        pinchTarget151 = null;
        pinchStartDistance151 = 0;
        pinchBaseScale151 = 1;
        pinchCurrentScale151 = 1;

        domObserver150EV3?.disconnect();
        domObserver150EV3 = null;

        clearStableTimer150EV3();
        clearRootRetry150EV3();

        if (revealFallbackTimer150EV3) {
          window150A.clearTimeout(
            revealFallbackTimer150EV3
          );

          revealFallbackTimer150EV3 = 0;
        }

        domSettling150EV3 = false;
        applySavedNow150D = () => {};
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

          iframeSourceObserver150E?.disconnect();
          iframeSourceObserver150E = null;

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

        iframeSourceObserver150E?.disconnect();
        iframeSourceObserver150E = null;
      }

      iframe150A = nextIframe150B;
      boundIframe150B = nextIframe150B;

      nextIframe150B.removeAttribute(
        "data-darik-layout-ready150e"
      );

      iframeSourceObserver150E?.disconnect();

      iframeSourceObserver150E =
        new MutationObserver(() => {
          nextIframe150B.removeAttribute(
            "data-darik-layout-ready150e"
          );
        });

      iframeSourceObserver150E.observe(
        nextIframe150B,
        {
          attributes: true,
          attributeFilter: ["src"],
        }
      );

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

      iframeSourceObserver150E?.disconnect();
      iframeSourceObserver150E = null;

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
  const [deliverySetupStage163, setDeliverySetupStage163] =
    useState<DarikDeliverySetupStage163>("location");

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
    const visibleStep163 =
      storefrontSetupMode109 === "wizard"
        ? storefrontSetupStep109
        : storefrontSetupTab109;

    if (visibleStep163 !== 9 && deliverySetupStage163 !== "location") {
      setDeliverySetupStage163("location");
    }
  }, [
    storefrontSetupMode109,
    storefrontSetupStep109,
    storefrontSetupTab109,
    deliverySetupStage163,
  ]);

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

  // DARIK_GUIDED_ONBOARDING_PREVIEW_DISCOVERY_157
  const gettingStartedAfterPreviewKey157 =
    "darik-getting-started-after-preview-157";

  // DARIK_ONBOARDING_SCROLL_STABILITY_158
  function darikElementVisible158(element: HTMLElement | null) {
    if (!element) return false;

    const style158 = window.getComputedStyle(element);
    if (
      style158.display === "none" ||
      style158.visibility === "hidden"
    ) {
      return false;
    }

    const rect158 = element.getBoundingClientRect();
    return rect158.width > 0 && rect158.height > 0;
  }

  function darikStableAutoScroll158(
    resolveTarget158: () => HTMLElement | null
  ) {
    if (typeof window === "undefined") return;

    const darikWindow158 = window as Window & {
      __darikAutoScrollSequence158?: number;
    };

    const sequence158 =
      (darikWindow158.__darikAutoScrollSequence158 ?? 0) + 1;

    darikWindow158.__darikAutoScrollSequence158 =
      sequence158;

    const startedAt158 = window.performance.now();
    let lastTop158: number | null = null;
    let stableFrames158 = 0;

    const settle158 = () => {
      if (
        darikWindow158.__darikAutoScrollSequence158 !==
        sequence158
      ) {
        return;
      }

      const target158 = resolveTarget158();
      const elapsed158 =
        window.performance.now() - startedAt158;

      if (
        !target158 ||
        !darikElementVisible158(target158)
      ) {
        if (elapsed158 < 900) {
          window.requestAnimationFrame(settle158);
        }
        return;
      }

      const top158 =
        target158.getBoundingClientRect().top +
        window.scrollY;

      if (
        lastTop158 !== null &&
        Math.abs(top158 - lastTop158) < 0.75
      ) {
        stableFrames158 += 1;
      } else {
        stableFrames158 = 0;
      }

      lastTop158 = top158;

      const layoutSettled158 =
        elapsed158 >= 180 &&
        stableFrames158 >= 4;

      if (layoutSettled158 || elapsed158 >= 900) {
        target158.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      window.requestAnimationFrame(settle158);
    };

    window.requestAnimationFrame(settle158);
  }

  function scrollStorefrontSetupNext157() {
    darikStableAutoScroll158(() =>
      document.querySelector<HTMLElement>(
        '[data-darik-wizard-next157="true"]'
      )
    );
  }

  function retailFieldSetupVisible158() {
    const labels158 = Array.from(
      document.querySelectorAll<HTMLElement>(
        [
          "h1",
          "h2",
          "h3",
          "h4",
          '[role="heading"]',
          "legend",
          "strong",
          "label",
          "p",
        ].join(",")
      )
    )
      .filter((element158) =>
        darikElementVisible158(element158)
      )
      .map((element158) =>
        (element158.textContent ?? "")
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(Boolean)
      .join(" ");

    return (
      /retail\s*(?:field|category)/i.test(labels158) ||
      /مجال\s*(?:المتجر|البيع|التجزئة)/.test(labels158)
    );
  }

  function findRetailFieldNext158() {
    const nextPattern158 =
      /(?:^|\s)(?:next|continue)(?:\s|$)|التالي|متابعة/i;

    return (
      Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          "button"
        )
      ).find((button158) => {
        if (
          button158.disabled ||
          button158.getAttribute("aria-disabled") ===
            "true" ||
          !darikElementVisible158(button158)
        ) {
          return false;
        }

        const text158 = (
          button158.textContent ?? ""
        )
          .replace(/\s+/g, " ")
          .trim();

        return nextPattern158.test(text158);
      }) ?? null
    );
  }

  function clearStorefrontSetupRequired157() {
    document
      .querySelectorAll<HTMLElement>(
        '[data-darik-required-error157="true"]'
      )
      .forEach((element) => {
        element.removeAttribute(
          "data-darik-required-error157"
        );
      });
  }

  function storefrontSetupFirstMissingTarget157(
    step: DarikStorefrontSetupStep109
  ) {
    if (step === 1) {
      return selectedThemeField ? "" : "theme";
    }

    if (step === 2) {
      if (!setupForm.logoUrl.trim()) return "logo";
      if (!setupForm.heroImageUrl.trim()) return "hero";
      return "";
    }

    if (step === 3) {
      if (setupForm.slug.trim().length < 2) return "slug";
      if (setupForm.displayName.trim().length < 2) return "display-name";
      return "";
    }

    if (step === 5) {
      return setupForm.phone.trim() ||
        setupForm.whatsapp.trim() ||
        setupForm.publicEmail.trim()
        ? ""
        : "contact";
    }

    if (step === 9) {
      return storefrontSetupStepReady109(9)
        ? ""
        : "delivery-zones";
    }

    if (step === 10) {
      return storefrontSetupStepReady109(10)
        ? ""
        : "payment-methods";
    }

    return "";
  }

  function revealStorefrontSetupMissing157(
    step: DarikStorefrontSetupStep109
  ) {
    clearStorefrontSetupRequired157();

    const targetKey =
      storefrontSetupFirstMissingTarget157(step);

    if (!targetKey) return;

    const target = document.querySelector<HTMLElement>(
      `[data-darik-required157="${targetKey}"]`
    );

    if (!target) return;

    target.setAttribute(
      "data-darik-required-error157",
      "true"
    );

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const firstControl =
      target.matches("input,select,textarea,button")
        ? target
        : target.querySelector<HTMLElement>(
            "input,select,textarea,button"
          );

    window.setTimeout(() => {
      firstControl?.focus();
    }, 420);

    const clearOnInput157 = () => {
      target.removeAttribute(
        "data-darik-required-error157"
      );
    };

    target.addEventListener(
      "input",
      clearOnInput157,
      { once: true, capture: true }
    );

    target.addEventListener(
      "change",
      clearOnInput157,
      { once: true, capture: true }
    );

    target.addEventListener(
      "click",
      (event) => {
        const clicked =
          event.target instanceof Element
            ? event.target.closest("button")
            : null;

        if (clicked) {
          clearOnInput157();
        }
      },
      { once: true, capture: true }
    );
  }

  function suppressOldPreviewInstructions157(
    root157: Document | null | undefined
  ) {
    if (!root157?.body) return;

    const candidates = Array.from(
      root157.querySelectorAll<HTMLElement>(
        [
          '[role="dialog"]',
          "aside",
          "section",
          "div",
          "p",
          '[class*="instruction" i]',
          '[class*="tutorial" i]',
          '[class*="guide" i]',
          '[class*="hint" i]',
        ].join(",")
      )
    );

    const smallestFirst = candidates
      .filter((element) => {
        if (
          element.hasAttribute(
            "data-darik-selection-toolbar152"
          ) ||
          element.hasAttribute(
            "data-darik-text-editor152"
          ) ||
          element.closest(
            '[data-darik-selection-toolbar152="true"]'
          )
        ) {
          return false;
        }

        if (element.querySelector("iframe")) {
          return false;
        }

        const text = (
          element.textContent ?? ""
        )
          .replace(/\s+/g, " ")
          .trim();

        if (text.length < 20 || text.length > 900) {
          return false;
        }

        const asksToInteract =
          /\b(click|tap|select)\b/i.test(text);

        const mentionsEditableThing =
          /\b(text|store name|tagline|logo|element|object)\b/i.test(
            text
          );

        const explainsEditor =
          /\b(edit|drag|move|pinch|resize|position|save)\b/i.test(
            text
          );

        return (
          asksToInteract &&
          mentionsEditableThing &&
          explainsEditor
        );
      })
      .sort(
        (a, b) =>
          (a.textContent?.length ?? 0) -
          (b.textContent?.length ?? 0)
      );

    const candidate = smallestFirst[0];
    if (!candidate) return;

    const semanticContainer =
      candidate.closest<HTMLElement>(
        [
          '[role="dialog"]',
          '[class*="instruction" i]',
          '[class*="tutorial" i]',
          '[class*="guide" i]',
          '[class*="hint" i]',
        ].join(",")
      ) ?? candidate;

    semanticContainer.setAttribute(
      "data-darik-old-preview-instructions-hidden157",
      "true"
    );

    semanticContainer.style.setProperty(
      "display",
      "none",
      "important"
    );
  }

  function selectStoreNameDiscovery157(
    attempt157 = 0
  ) {
    if (!liveBuilderPreviewExpanded111) return;

    const iframe157 = liveBuilderPreviewRef.current;

    suppressOldPreviewInstructions157(document);
    suppressOldPreviewInstructions157(
      iframe157?.contentDocument
    );

    const storefrontId157 =
      storefront?.id ?? selectedStore?.retailer_id ?? "draft";

    const discoveryKey157 =
      `darik-preview-store-name-discovery-157-${storefrontId157}`;

    try {
      if (
        window.localStorage.getItem(
          discoveryKey157
        ) === "done"
      ) {
        return;
      }
    } catch {
      // Discovery still works if localStorage is unavailable.
    }

    const document157 =
      iframe157?.contentDocument;

    const storeName157 =
      document157?.querySelector<HTMLElement>(
        ".darikSemanticDisplayName150E"
      );

    if (!storeName157) {
      if (attempt157 < 18) {
        window.setTimeout(() => {
          selectStoreNameDiscovery157(
            attempt157 + 1
          );
        }, 120);
      }
      return;
    }

    storeName157.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: iframe157?.contentWindow ?? window,
      })
    );

    storeName157.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    window.setTimeout(() => {
      const selected157 =
        storeName157.getAttribute(
          "data-darik-selected152"
        ) === "true";

      const toolbar157 =
        document157?.querySelector(
          '[data-darik-selection-toolbar152="true"]'
        );

      if (selected157 && toolbar157) {
        try {
          window.localStorage.setItem(
            discoveryKey157,
            "done"
          );
        } catch {
          // No persistence is required for the editor to work.
        }
        return;
      }

      if (attempt157 < 18) {
        selectStoreNameDiscovery157(
          attempt157 + 1
        );
      }
    }, 90);
  }

  useEffect(() => {
    if (
      storefrontSetupMode109 !== "wizard" ||
      !liveBuilderPreviewOpen
    ) {
      return;
    }

    setLiveBuilderPreviewExpanded111(false);
    setLiveBuilderPreviewOpen(false);
  }, [
    storefrontSetupMode109,
    liveBuilderPreviewOpen,
  ]);

  useEffect(() => {
    const handleRetailFieldSelection158 = (
      event158: MouseEvent
    ) => {
      if (!retailFieldSetupVisible158()) return;

      const clicked158 =
        event158.target instanceof Element
          ? event158.target.closest<HTMLElement>(
              [
                "button",
                '[role="button"]',
                "label",
                'input[type="radio"]',
              ].join(",")
            )
          : null;

      if (!clicked158) return;

      const clickedText158 = (
        clicked158.textContent ?? ""
      )
        .replace(/\s+/g, " ")
        .trim();

      if (
        /(?:^|\s)(?:next|continue|back|previous)(?:\s|$)|التالي|متابعة|رجوع|السابق/i.test(
          clickedText158
        )
      ) {
        return;
      }

      window.setTimeout(() => {
        if (!retailFieldSetupVisible158()) return;

        const next158 = findRetailFieldNext158();
        if (!next158) return;

        darikStableAutoScroll158(() => {
          if (
            next158.isConnected &&
            darikElementVisible158(next158) &&
            !next158.disabled
          ) {
            return next158;
          }

          return findRetailFieldNext158();
        });
      }, 40);
    };

    document.addEventListener(
      "click",
      handleRetailFieldSelection158,
      true
    );

    return () => {
      document.removeEventListener(
        "click",
        handleRetailFieldSelection158,
        true
      );
    };
  }, []);

  // DARIK_POST_SETUP_CUSTOMIZE_EDITOR_160
  useEffect(() => {
    const darikWindow160 = window as Window & {
      __darikPreviousForcedWizardStep160?: number;
    };

    if (storefrontSetupMode109 !== "wizard") {
      darikWindow160.__darikPreviousForcedWizardStep160 =
        storefrontSetupStep109;
      return;
    }

    const previousStep160 =
      darikWindow160.__darikPreviousForcedWizardStep160;

    if (storefrontSetupStep109 === 4) {
      const destinationStep160 =
        previousStep160 !== undefined &&
        previousStep160 >= 5
          ? 3
          : 5;

      darikWindow160.__darikPreviousForcedWizardStep160 =
        destinationStep160;
      setStorefrontSetupStep109(destinationStep160);
      return;
    }

    darikWindow160.__darikPreviousForcedWizardStep160 =
      storefrontSetupStep109;
  }, [
    storefrontSetupMode109,
    storefrontSetupStep109,
  ]);

  function setPreviewCustomizeOpen160(
    open160: boolean,
    attempt160 = 0
  ) {
    const panel160 = document.querySelector<HTMLElement>(
      '[data-darik-preview-customize160="true"]'
    );

    if (!panel160) {
      if (open160 && attempt160 < 18) {
        window.setTimeout(() => {
          setPreviewCustomizeOpen160(
            true,
            attempt160 + 1
          );
        }, 70);
      }
      return;
    }

    panel160.hidden = !open160;
    panel160.setAttribute(
      "aria-hidden",
      open160 ? "false" : "true"
    );
  }

  function togglePreviewCustomize160() {
    const panel160 = document.querySelector<HTMLElement>(
      '[data-darik-preview-customize160="true"]'
    );

    if (!panel160) {
      setPreviewCustomizeOpen160(true);
      return;
    }

    setPreviewCustomizeOpen160(
      Boolean(panel160.hidden)
    );
  }

  function selectStoreNameNow160(
    attempt160 = 0
  ) {
    const iframe160 = liveBuilderPreviewRef.current;
    const document160 = iframe160?.contentDocument;
    const storeName160 =
      document160?.querySelector<HTMLElement>(
        ".darikSemanticDisplayName150E"
      );

    if (!storeName160) {
      if (attempt160 < 18) {
        window.setTimeout(() => {
          selectStoreNameNow160(
            attempt160 + 1
          );
        }, 100);
      }
      return;
    }

    storeName160.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: iframe160?.contentWindow ?? window,
      })
    );

    storeName160.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  // DARIK_ABOUT_REQUIRED_SAME_HOURS_161
  useEffect(() => {
    const dayDefinitions161 = [
      { key: "sunday", names: ["sunday", "الأحد", "الاحد"] },
      { key: "monday", names: ["monday", "الاثنين", "الإثنين"] },
      { key: "tuesday", names: ["tuesday", "الثلاثاء"] },
      { key: "wednesday", names: ["wednesday", "الأربعاء", "الاربعاء"] },
      { key: "thursday", names: ["thursday", "الخميس"] },
      { key: "friday", names: ["friday", "الجمعة"] },
      { key: "saturday", names: ["saturday", "السبت"] },
    ];

    function normalize161(value161: string) {
      return value161
        .replace(/\\s+/g, " ")
        .trim()
        .toLowerCase();
    }

    function visible161(element161: HTMLElement | null) {
      if (!element161) return false;

      const style161 =
        window.getComputedStyle(element161);

      if (
        style161.display === "none" ||
        style161.visibility === "hidden"
      ) {
        return false;
      }

      const rect161 =
        element161.getBoundingClientRect();

      return (
        rect161.width > 0 ||
        rect161.height > 0
      );
    }

    function stepRoot161() {
      return (
        Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-darik-exact-step="6"]'
          )
        ).find((candidate161) =>
          visible161(candidate161)
        ) ?? null
      );
    }

    function fieldContext161(
      field161:
        | HTMLInputElement
        | HTMLTextAreaElement
    ) {
      const label161 =
        field161.closest("label");
      const parent161 =
        field161.parentElement;
      const grand161 =
        parent161?.parentElement ?? null;

      return normalize161(
        [
          field161.name,
          field161.id,
          field161.placeholder,
          field161.getAttribute("aria-label"),
          label161?.textContent,
          parent161?.textContent,
          grand161?.textContent,
        ]
          .filter(Boolean)
          .join(" ")
      );
    }

    function aboutFields161(root161: HTMLElement) {
      const candidates161 = Array.from(
        root161.querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement
        >(
          [
            "textarea",
            'input[type="text"]',
            'input:not([type])',
          ].join(",")
        )
      ).filter((field161) =>
        visible161(field161)
      );

      const scored161 = candidates161.map(
        (field161, index161) => {
          const context161 =
            fieldContext161(field161);

          let englishScore161 = 0;
          let arabicScore161 = 0;

          if (
            context161.includes("about") ||
            context161.includes("description")
          ) {
            englishScore161 += 8;
          }

          if (
            context161.includes("english") ||
            /(?:^|[_\\-\\s])en(?:$|[_\\-\\s])/.test(
              context161
            )
          ) {
            englishScore161 += 12;
          }

          if (
            context161.includes("arabic") ||
            context161.includes("العربية") ||
            context161.includes("عربي") ||
            context161.includes("عن المتجر") ||
            context161.includes("وصف المتجر")
          ) {
            arabicScore161 += 12;
          }

          if (
            /[\u0600-\u06FF]/.test(
              context161
            )
          ) {
            arabicScore161 += 4;
          }

          englishScore161 +=
            Math.max(0, 2 - index161) *
            0.1;

          return {
            field: field161,
            englishScore: englishScore161,
            arabicScore: arabicScore161,
          };
        }
      );

      const english161 =
        [...scored161].sort(
          (a161, b161) =>
            b161.englishScore -
            b161.arabicScore -
            (a161.englishScore -
              a161.arabicScore)
        )[0]?.field ??
        candidates161[0] ??
        null;

      const arabic161 =
        [...scored161]
          .filter(
            (item161) =>
              item161.field !== english161
          )
          .sort(
            (a161, b161) =>
              b161.arabicScore -
              b161.englishScore -
              (a161.arabicScore -
                a161.englishScore)
          )[0]?.field ??
        candidates161.find(
          (field161) =>
            field161 !== english161
        ) ??
        null;

      return {
        english: english161,
        arabic: arabic161,
      };
    }

    function ensureFieldHint161(
      field161:
        | HTMLInputElement
        | HTMLTextAreaElement
        | null,
      kind161: "required" | "optional"
    ) {
      if (!field161) return;

      const attr161 =
        kind161 === "required"
          ? "data-darik-about-required-hint161"
          : "data-darik-about-optional-hint161";

      if (
        field161.parentElement?.querySelector(
          `[${attr161}="true"]`
        )
      ) {
        return;
      }

      const hint161 =
        document.createElement("div");

      hint161.setAttribute(
        attr161,
        "true"
      );

      hint161.className =
        kind161 === "required"
          ? "darikAboutRequiredHint161"
          : "darikAboutOptionalHint161";

      hint161.textContent =
        kind161 === "required"
          ? "Required / مطلوب"
          : "Optional / اختياري";

      field161.insertAdjacentElement(
        "beforebegin",
        hint161
      );
    }

    function clearAboutError161(
      field161:
        | HTMLInputElement
        | HTMLTextAreaElement
        | null
    ) {
      if (!field161) return;

      field161.removeAttribute(
        "aria-invalid"
      );
      field161.classList.remove(
        "darikAboutInvalid161"
      );

      field161.parentElement
        ?.querySelectorAll(
          '[data-darik-about-error161="true"]'
        )
        .forEach((error161) =>
          error161.remove()
        );
    }

    function showAboutError161(
      field161:
        | HTMLInputElement
        | HTMLTextAreaElement
        | null
    ) {
      if (!field161) return;

      field161.setAttribute(
        "aria-invalid",
        "true"
      );
      field161.classList.add(
        "darikAboutInvalid161"
      );

      if (
        field161.parentElement &&
        !field161.parentElement.querySelector(
          '[data-darik-about-error161="true"]'
        )
      ) {
        const error161 =
          document.createElement("div");

        error161.setAttribute(
          "data-darik-about-error161",
          "true"
        );
        error161.className =
          "darikAboutError161";
        error161.textContent =
          "About the store in English is required / وصف المتجر بالإنجليزية مطلوب";

        field161.insertAdjacentElement(
          "afterend",
          error161
        );
      }

      field161.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      window.setTimeout(() => {
        field161.focus({
          preventScroll: true,
        });
      }, 260);
    }

    function hourControls161(
      row161: HTMLElement
    ) {
      return Array.from(
        row161.querySelectorAll<
          HTMLInputElement | HTMLSelectElement
        >(
          [
            'input[type="time"]',
            "select",
          ].join(",")
        )
      ).filter((control161) => {
        if (
          control161.hasAttribute(
            "data-darik-same-hours161"
          )
        ) {
          return false;
        }

        return visible161(control161);
      });
    }

    function findDayLabel161(
      root161: HTMLElement,
      names161: string[]
    ) {
      return (
        Array.from(
          root161.querySelectorAll<HTMLElement>(
            [
              "span",
              "label",
              "strong",
              "b",
              "p",
              "div",
              "h4",
              "h5",
              "h6",
            ].join(",")
          )
        )
          .filter((element161) =>
            visible161(element161)
          )
          .map((element161) => ({
            element: element161,
            text: normalize161(
              element161.textContent ?? ""
            ),
          }))
          .filter(({ text }) =>
            names161.some((name161) => {
              const normalizedName161 =
                normalize161(name161);

              return (
                text === normalizedName161 ||
                text.startsWith(
                  normalizedName161 + " "
                ) ||
                text.endsWith(
                  " " + normalizedName161
                )
              );
            })
          )
          .sort(
            (a161, b161) =>
              a161.text.length -
              b161.text.length
          )[0]?.element ?? null
      );
    }

    function findDayRow161(
      root161: HTMLElement,
      names161: string[]
    ) {
      const label161 =
        findDayLabel161(
          root161,
          names161
        );

      if (!label161) return null;

      let current161: HTMLElement | null =
        label161;

      while (
        current161 &&
        current161 !== root161
      ) {
        const controls161 =
          hourControls161(current161);

        if (
          controls161.length >= 2 &&
          controls161.length <= 4
        ) {
          return current161;
        }

        current161 =
          current161.parentElement;
      }

      return null;
    }

    function setNativeValue161(
      control161:
        | HTMLInputElement
        | HTMLSelectElement,
      value161: string
    ) {
      if (
        control161 instanceof
        HTMLInputElement
      ) {
        const descriptor161 =
          Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
          );

        descriptor161?.set?.call(
          control161,
          value161
        );
      } else {
        const descriptor161 =
          Object.getOwnPropertyDescriptor(
            HTMLSelectElement.prototype,
            "value"
          );

        descriptor161?.set?.call(
          control161,
          value161
        );

        control161.value = value161;
      }

      control161.dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );

      control161.dispatchEvent(
        new Event("change", {
          bubbles: true,
        })
      );
    }

    function copyHours161(
      sourceRow161: HTMLElement,
      targetRow161: HTMLElement
    ) {
      const source161 =
        hourControls161(sourceRow161);
      const target161 =
        hourControls161(targetRow161);

      const count161 = Math.min(
        source161.length,
        target161.length
      );

      if (count161 < 2) {
        return false;
      }

      for (
        let index161 = 0;
        index161 < count161;
        index161 += 1
      ) {
        setNativeValue161(
          target161[index161],
          source161[index161].value
        );
      }

      return true;
    }

    function ensureSameHours161(
      root161: HTMLElement
    ) {
      const rows161 =
        dayDefinitions161.map(
          (day161) => ({
            day: day161,
            row: findDayRow161(
              root161,
              day161.names
            ),
          })
        );

      for (
        let index161 = 1;
        index161 < rows161.length;
        index161 += 1
      ) {
        const current161 =
          rows161[index161];
        const previous161 =
          rows161[index161 - 1];

        if (
          !current161.row ||
          !previous161.row
        ) {
          continue;
        }

        current161.row.setAttribute(
          "data-darik-hours-row161",
          current161.day.key
        );

        previous161.row.setAttribute(
          "data-darik-hours-row161",
          previous161.day.key
        );

        if (
          current161.row.querySelector(
            '[data-darik-same-hours-wrap161="true"]'
          )
        ) {
          continue;
        }

        const label161 =
          document.createElement("label");

        label161.setAttribute(
          "data-darik-same-hours-wrap161",
          "true"
        );
        label161.className =
          "darikSameHoursWrap161";

        const checkbox161 =
          document.createElement("input");

        checkbox161.type = "checkbox";
        checkbox161.setAttribute(
          "data-darik-same-hours161",
          "true"
        );
        checkbox161.setAttribute(
          "aria-label",
          "Same hours / نفس الساعات"
        );

        const text161 =
          document.createElement("span");

        text161.textContent =
          "Same hours / نفس الساعات";

        label161.append(
          checkbox161,
          text161
        );

        current161.row.appendChild(
          label161
        );

        checkbox161.addEventListener(
          "change",
          () => {
            if (
              !checkbox161.checked ||
              !previous161.row ||
              !current161.row
            ) {
              return;
            }

            copyHours161(
              previous161.row,
              current161.row
            );
          }
        );
      }
    }

    function applyAboutHours161() {
      const root161 = stepRoot161();

      if (!root161) return;

      const fields161 =
        aboutFields161(root161);

      if (fields161.english) {
        fields161.english.required = true;
        fields161.english.setAttribute(
          "aria-required",
          "true"
        );
        fields161.english.setAttribute(
          "data-darik-about-en-required161",
          "true"
        );

        ensureFieldHint161(
          fields161.english,
          "required"
        );

        if (
          fields161.english.value.trim()
        ) {
          clearAboutError161(
            fields161.english
          );
        }
      }

      if (
        fields161.arabic &&
        fields161.arabic !==
          fields161.english
      ) {
        fields161.arabic.required = false;
        fields161.arabic.setAttribute(
          "aria-required",
          "false"
        );
        fields161.arabic.setAttribute(
          "data-darik-about-ar-optional161",
          "true"
        );

        ensureFieldHint161(
          fields161.arabic,
          "optional"
        );
      }

      ensureSameHours161(root161);
    }

    function nextButtonClicked161(
      event161: MouseEvent
    ) {
      const root161 = stepRoot161();

      if (!root161) return;

      const button161 =
        event161.target instanceof Element
          ? event161.target.closest<
              HTMLButtonElement
            >("button")
          : null;

      if (!button161) return;

      const buttonText161 =
        normalize161(
          button161.textContent ?? ""
        );

      if (
        !/(?:^|\\s)(?:next|continue)(?:\\s|$)|التالي|متابعة/i.test(
          buttonText161
        )
      ) {
        return;
      }

      const fields161 =
        aboutFields161(root161);

      if (
        !fields161.english ||
        fields161.english.value.trim()
      ) {
        return;
      }

      event161.preventDefault();
      event161.stopPropagation();
      event161.stopImmediatePropagation();

      showAboutError161(
        fields161.english
      );
    }

    function inputChanged161(
      event161: Event
    ) {
      const root161 = stepRoot161();

      if (!root161) return;

      const target161 = event161.target;

      if (
        !(
          target161 instanceof
            HTMLInputElement ||
          target161 instanceof
            HTMLTextAreaElement ||
          target161 instanceof
            HTMLSelectElement
        )
      ) {
        return;
      }

      // DARIK_SAME_HOURS_CHECKBOX_FIX_162
      // The Same hours checkbox has its own change listener that copies the
      // previous day's real hour controls. FRONTEND 161's document-level
      // manual-edit listener was also seeing that trusted checkbox change
      // and immediately unchecking the box again. Ignore the checkbox itself;
      // real user edits to time/select controls still clear Same hours.
      if (
        target161 instanceof
          HTMLInputElement &&
        target161.hasAttribute(
          "data-darik-same-hours161"
        )
      ) {
        return;
      }

      const fields161 =
        aboutFields161(root161);

      if (
        fields161.english === target161 &&
        target161.value.trim()
      ) {
        clearAboutError161(
          fields161.english
        );
      }

      const targetRow161 =
        target161.closest<HTMLElement>(
          "[data-darik-hours-row161]"
        );

      if (
        targetRow161 &&
        event161.isTrusted
      ) {
        const same161 =
          targetRow161.querySelector<HTMLInputElement>(
            'input[data-darik-same-hours161="true"]'
          );

        if (same161?.checked) {
          same161.checked = false;
        }
      }

      const sourceRow161 =
        target161.closest<HTMLElement>(
          "[data-darik-hours-row161]"
        );

      if (!sourceRow161) return;

      const sourceKey161 =
        sourceRow161.getAttribute(
          "data-darik-hours-row161"
        );

      const sourceIndex161 =
        dayDefinitions161.findIndex(
          (day161) =>
            day161.key === sourceKey161
        );

      if (
        sourceIndex161 < 0 ||
        sourceIndex161 >=
          dayDefinitions161.length - 1
      ) {
        return;
      }

      const nextKey161 =
        dayDefinitions161[
          sourceIndex161 + 1
        ].key;

      const nextRow161 =
        root161.querySelector<HTMLElement>(
          `[data-darik-hours-row161="${nextKey161}"]`
        );

      const same161 =
        nextRow161?.querySelector<HTMLInputElement>(
          'input[data-darik-same-hours161="true"]'
        );

      if (
        same161?.checked &&
        nextRow161
      ) {
        copyHours161(
          sourceRow161,
          nextRow161
        );
      }
    }

    let scheduled161 = false;

    function scheduleApply161() {
      if (scheduled161) return;

      scheduled161 = true;

      window.requestAnimationFrame(() => {
        scheduled161 = false;
        applyAboutHours161();
      });
    }

    document.addEventListener(
      "click",
      nextButtonClicked161,
      true
    );

    document.addEventListener(
      "input",
      inputChanged161,
      true
    );

    document.addEventListener(
      "change",
      inputChanged161,
      true
    );

    const observer161 =
      new MutationObserver(
        scheduleApply161
      );

    observer161.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      }
    );

    scheduleApply161();

    return () => {
      document.removeEventListener(
        "click",
        nextButtonClicked161,
        true
      );
      document.removeEventListener(
        "input",
        inputChanged161,
        true
      );
      document.removeEventListener(
        "change",
        inputChanged161,
        true
      );
      observer161.disconnect();
    };
  }, []);

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

      const deliveryDays163 = Number(setupForm.estimatedDeliveryDays);
      const cutoff163 = String(setupForm.deliveryCutoffTime ?? "").trim();

      if (
        !Number.isInteger(deliveryDays163) ||
        deliveryDays163 < 0 ||
        deliveryDays163 > 365 ||
        !/^\d{2}:\d{2}$/.test(cutoff163)
      ) {
        return false;
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
      if (deliverySetupStage163 === "location") {
        return deliveryLocation112
          ? "Press Continue to configure delivery. / اضغط متابعة لإعداد التوصيل."
          : "Confirm the exact store location first. / أكد موقع المتجر أولاً.";
      }

      return "Choose a valid delivery promise, cutoff time, and at least one valid delivery zone. / اختر موعد توصيل ووقت إغلاق صالحين وأضف منطقة توصيل واحدة على الأقل.";
    }
    if (step === 10) {
      return "Choose at least one payment method for online orders. / اختر طريقة دفع واحدة على الأقل للطلبات الإلكترونية.";
    }
    return "Complete the required information before continuing. / أكمل المعلومات المطلوبة للمتابعة.";
  }

  async function goToNextStorefrontSetupStep109() {
    const step = storefrontSetupStep109;

    if (step === 9 && deliverySetupStage163 === "location") {
      if (!deliveryLocation112) {
        setStorefrontSetupNotice109(
          "Confirm the exact store location first. / أكد موقع المتجر أولاً."
        );
        revealStorefrontSetupMissing157(step);
        return;
      }

      setStorefrontSetupNotice109("");
      setDeliverySetupStage163("settings");

      window.requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(
            '[data-darik-delivery-settings163="true"]'
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      });
      return;
    }

    if (!storefrontSetupStepReady109(step)) {
      setStorefrontSetupNotice109(storefrontSetupMissingMessage109(step));
      revealStorefrontSetupMissing157(step);
      return;
    }

    clearStorefrontSetupRequired157();

    if (
      step === 9 &&
      setupForm.fulfillmentMode !== "pickup"
    ) {
      const zonesSaved = await saveDeliveryZones109(true);
      if (!zonesSaved) {
        revealStorefrontSetupMissing157(9);
        return;
      }
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
        try {
          window.sessionStorage.setItem(
            gettingStartedAfterPreviewKey157,
            "1"
          );
        } catch {
          // Preview still opens even if sessionStorage is unavailable.
        }
      }

      setStorefrontSetupMode109("tabs");
      setStorefrontSetupTab109(1);
      setLiveBuilderPreviewExpanded111(false);
      setLiveBuilderPreviewOpen(true);

      window.setTimeout(() => {
        setPreviewCustomizeOpen160(true);
      }, 90);
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
              estimatedDeliveryMinutes: "",
              estimatedDeliveryDays:
                loadedStorefront.estimated_delivery_days == null
                  ? "0"
                  : String(loadedStorefront.estimated_delivery_days),
              deliveryCutoffTime: String(
                loadedStorefront.delivery_cutoff_time ?? "17:00"
              ).slice(0, 5),
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
              estimatedDeliveryMinutes: "",
    estimatedDeliveryDays: "0",
    deliveryCutoffTime: "17:00",
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
      estimated_delivery_minutes: null,
      estimated_delivery_days:
        setupForm.fulfillmentMode === "delivery"
          ? Number(setupForm.estimatedDeliveryDays || 0)
          : 0,
      delivery_cutoff_time:
        setupForm.fulfillmentMode === "delivery"
          ? setupForm.deliveryCutoffTime || "17:00"
          : "17:00",
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

      if (
        storefrontSetupMode109 === "wizard" &&
        storefrontSetupStep109 === 1
      ) {
        scrollStorefrontSetupNext157();
      }
      setLiveBuilderPreviewTheme138((current) => current || themeField);
      if (storefrontSetupMode109 !== "wizard") {
        setLiveBuilderPreviewOpen(true);
      }
      return;
    }

    if (!storefront) {
      setSelectedThemeField(themeField);
      setThemePickerOpen(false);

      if (
        storefrontSetupMode109 === "wizard" &&
        storefrontSetupStep109 === 1
      ) {
        scrollStorefrontSetupNext157();
      }

      if (selectedStore?.retailer_id) {
        window.localStorage.setItem(
          `darik-pending-theme-${selectedStore.retailer_id}`,
          themeField
        );
      }

      setLiveBuilderPreviewTheme138(themeField);
      if (storefrontSetupMode109 !== "wizard") {
        setLiveBuilderPreviewOpen(true);
      }
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
    if (storefrontSetupMode109 !== "wizard") {
        setLiveBuilderPreviewOpen(true);
      }
    setThemePickerOpen(false);

      if (
        storefrontSetupMode109 === "wizard" &&
        storefrontSetupStep109 === 1
      ) {
        scrollStorefrontSetupNext157();
      }
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
                        onClick={() => {
                          if (liveBuilderPreviewExpanded111) {
                            setLiveBuilderPreviewExpanded111(false);

                            window.requestAnimationFrame(() => {
                              setThemePickerOpen(true);
                            });

                            return;
                          }

                          setThemePickerOpen(true);
                        }}
                      >
                        Change theme / تغيير القالب
                      </button>
                                            <button
                        type="button"
                        onClick={() => {
                          const nextExpanded157 =
                            !liveBuilderPreviewExpanded111;

                          setLiveBuilderPreviewExpanded111(
                            nextExpanded157
                          );

                          if (nextExpanded157) {
                            window.setTimeout(() => {
                              suppressOldPreviewInstructions157(
                                document
                              );
                              suppressOldPreviewInstructions157(
                                liveBuilderPreviewRef.current
                                  ?.contentDocument
                              );
                              selectStoreNameDiscovery157();
                            }, 100);
                          }
                        }}
                        disabled={!storefront}
                      >
                        {liveBuilderPreviewExpanded111
                          ? "Half screen / نصف الشاشة"
                          : "Full screen / ملء الشاشة"}
                      </button>

                        <button
                          type="button"
                          className={designStyles.previewCustomizeTrigger160}
                          data-darik-preview-customize-trigger160="true"
                          onClick={() => {
                            togglePreviewCustomize160();
                          }}
                        >
                          تخصيص المتجر / Customize Store
                        </button>
<button
                        type="button"
                        className={designStyles.liveBuilderClosePreview107}
                        onClick={() => {
                          setLiveBuilderPreviewExpanded111(false);
                          setLiveBuilderPreviewOpen(false);
                          setPreviewCustomizeOpen160(false);


                          let continueGettingStarted157 = false;

                          try {
                            continueGettingStarted157 =
                              window.sessionStorage.getItem(
                                gettingStartedAfterPreviewKey157
                              ) === "1";

                            if (continueGettingStarted157) {
                              window.sessionStorage.removeItem(
                                gettingStartedAfterPreviewKey157
                              );
                            }
                          } catch {
                            continueGettingStarted157 = false;
                          }

                          if (continueGettingStarted157) {
                            window.location.assign(
                              "/store-dashboard/getting-started"
                            );
                          }
                        }}
                      >
                        Close preview / إغلاق المعاينة
                      </button>
                    </div>
                  </div>


                      <aside
                        className={designStyles.previewCustomizePanel160}
                        data-darik-preview-customize160="true"
                        aria-hidden="true"
                        aria-label="تخصيص المتجر / Customize Store"
                        hidden
                      >
                        <div className={designStyles.previewCustomizeHeader160}>
                          <div>
                            <span className={designStyles.previewCustomizeEyebrow160}>
                              اكتمل إعداد المتجر / Store setup complete
                            </span>
                            <h3>خصّص متجرك / Customize your store</h3>
                            <p>
                              هذه الخيارات اختيارية. عدّل الشكل وأنت تشاهد متجرك مباشرة.
                              <br />
                              These options are optional. Customize while watching your store live.
                            </p>
                          </div>

                          <button
                            type="button"
                            className={designStyles.previewCustomizeClose160}
                            aria-label="Close customization"
                            onClick={() => {
                              setPreviewCustomizeOpen160(false);
                            }}
                          >
                            ×
                          </button>
                        </div>

                        <div className={designStyles.previewCustomizeGrid160}>
                          <button
                            type="button"
                            className={designStyles.previewCustomizeCard160}
                            data-darik-customize-fonts160="true"
                            onClick={() => {
                              setPreviewCustomizeOpen160(false);
                              setLiveBuilderPreviewExpanded111(false);
                              setStorefrontSetupMode109("tabs");
                              setStorefrontSetupTab109(4);

                              window.setTimeout(() => {
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                });
                              }, 60);
                            }}
                          >
                            <strong>الخطوط / Fonts</strong>
                            <span>
                              اختر خطوط المتجر وشاهد النتيجة على المعاينة مباشرة.
                              <br />
                              Choose store fonts and see the result on Preview.
                            </span>
                          </button>

                          <button
                            type="button"
                            className={designStyles.previewCustomizeCard160}
                            data-darik-customize-theme160="true"
                            onClick={() => {
                              setPreviewCustomizeOpen160(false);
                              setLiveBuilderPreviewExpanded111(false);
                              setThemePickerOpen(true);
                            }}
                          >
                            <strong>القالب / Theme</strong>
                            <span>
                              غيّر تصميم المتجر بدون تغيير مجال البيع أو خصائصه.
                              <br />
                              Change the design without changing retail-field mechanics.
                            </span>
                          </button>

                          <button
                            type="button"
                            className={designStyles.previewCustomizeCard160}
                            data-darik-customize-direct160="true"
                            onClick={() => {
                              setPreviewCustomizeOpen160(false);
                              setLiveBuilderPreviewExpanded111(true);

                              window.setTimeout(() => {
                                suppressOldPreviewInstructions157(document);
                                suppressOldPreviewInstructions157(
                                  liveBuilderPreviewRef.current
                                    ?.contentDocument
                                );
                                selectStoreNameNow160();
                              }, 120);
                            }}
                          >
                            <strong>تعديل مباشر / Edit on Preview</strong>
                            <span>
                              اضغط على النصوص والعناصر، ثم حرّكها أو عدّلها أو احفظها.
                              <br />
                              Select real page objects, then edit, move, resize, or save.
                            </span>
                          </button>
                        </div>

                        <div className={designStyles.previewCustomizeTip160}>
                          <strong>بسيطة:</strong> متجرك جاهز الآن. لا تحتاج لتغيير أي شيء هنا للنشر.
                          <br />
                          <strong>Simple:</strong> your store is already set up. Nothing here is required to continue.
                        </div>
                      </aside>
<div className={designStyles.liveBuilderPreviewViewport}>
                    {storefront && liveBuilderPreviewTheme138 && realPrivatePreviewKey143 ? (
                      <iframe
                        className={designStyles.privatePreviewGate150EV2}
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

                      <div
                        className={designStyles.themeGalleryGrid}
                        data-darik-required157="theme"
                      >
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
                        <article
                          className={designStyles.exactWizardAssetCard109V5}
                          data-darik-required157="logo"
                        >
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

                        <article
                          className={designStyles.exactWizardAssetCard109V5}
                          data-darik-required157="hero"
                        >
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
                        <label
                          className={designStyles.exactWizardWide109V5}
                          data-darik-required157="slug"
                        >
                          <span>Permanent store link / رابط المتجر</span>
                          <div className={designStyles.exactWizardSlug109V5}>
                            <b></b>
                            <div
                            className={designStyles.darikLockedStoreLinkField159}
                            data-darik-permanent-link159="true"
                          >
                            <span
                              className={designStyles.darikLockedStoreLinkPrefix159}
                              aria-hidden="true"
                            >
                              getdarik.com/
                            </span>
                            <input
                              value={setupForm.slug}
                              onChange={(event) => updateSetupField("slug", cleanSlug(event.target.value))}
                              required
                            />
                          </div>
                          </div>
                        </label>
                        <label data-darik-required157="display-name">
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
                      <div
                        className={designStyles.exactWizardGrid109V5}
                        data-darik-required157="contact"
                      >
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
                        <p>{deliverySetupStage163 === "location"
                          ? "Confirm your store location first. Nothing else is shown until you continue."
                          : "Choose fulfillment, delivery promise, cutoff time, and delivery zones."}</p>
                      </div>

                      {deliverySetupStage163 === "location" ? (
                        <>
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
                          <div className={designStyles.deliveryLocationContinue163}>
                            <button
                              type="button"
                              disabled={!deliveryLocation112}
                              onClick={() => {
                                if (!deliveryLocation112) {
                                  setStorefrontSetupNotice109(
                                    "Confirm the exact store location first. / أكد موقع المتجر أولاً."
                                  );
                                  return;
                                }

                                setStorefrontSetupNotice109("");
                                setDeliverySetupStage163("settings");

                                window.requestAnimationFrame(() => {
                                  document
                                    .querySelector<HTMLElement>(
                                      '[data-darik-delivery-settings163="true"]'
                                    )
                                    ?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "start",
                                    });
                                });
                              }}
                            >
                              Continue / متابعة
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={designStyles.deliverySettingsIntro163}
                            data-darik-delivery-settings163="true"
                          >
                            <div>
                              <small>DELIVERY SETTINGS / إعدادات التوصيل</small>
                              <strong>How should customers receive orders?</strong>
                              <span>
                                Store location is confirmed. Configure fulfillment,
                                delivery timing, cutoff, and zones below.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setStorefrontSetupNotice109("");
                                setDeliverySetupStage163("location");
                              }}
                            >
                              ← Store location / موقع المتجر
                            </button>
                          </div>


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

                      <section
                        className={designStyles.deliveryTimingCard163}
                        data-darik-delivery-timing163="true"
                      >
                        <div className={designStyles.deliveryTimingHead163}>
                          <div>
                            <small>DELIVERY PROMISE / موعد التوصيل</small>
                            <strong>When will the customer receive the order?</strong>
                            <span>
                              Choose days, not minutes. Orders placed at or after
                              the cutoff automatically move one day later.
                            </span>
                          </div>
                        </div>

                        <div className={designStyles.deliveryTimingChoices163}>
                          <button
                            type="button"
                            aria-pressed={
                              Number(setupForm.estimatedDeliveryDays || 0) === 0
                            }
                            className={
                              Number(setupForm.estimatedDeliveryDays || 0) === 0
                                ? designStyles.deliveryTimingSelected163
                                : ""
                            }
                            onClick={() =>
                              updateSetupField("estimatedDeliveryDays", "0")
                            }
                          >
                            <strong>Same day / نفس اليوم</strong>
                            <span>Customer receives it today before cutoff.</span>
                          </button>

                          <button
                            type="button"
                            aria-pressed={
                              Number(setupForm.estimatedDeliveryDays || 0) === 1
                            }
                            className={
                              Number(setupForm.estimatedDeliveryDays || 0) === 1
                                ? designStyles.deliveryTimingSelected163
                                : ""
                            }
                            onClick={() =>
                              updateSetupField("estimatedDeliveryDays", "1")
                            }
                          >
                            <strong>Next day / اليوم التالي</strong>
                            <span>Customer receives it tomorrow before cutoff.</span>
                          </button>

                          <button
                            type="button"
                            aria-pressed={
                              Number(setupForm.estimatedDeliveryDays || 0) >= 2
                            }
                            className={
                              Number(setupForm.estimatedDeliveryDays || 0) >= 2
                                ? designStyles.deliveryTimingSelected163
                                : ""
                            }
                            onClick={() =>
                              updateSetupField(
                                "estimatedDeliveryDays",
                                String(
                                  Math.max(
                                    2,
                                    Number(setupForm.estimatedDeliveryDays || 2)
                                  )
                                )
                              )
                            }
                          >
                            <strong>Custom days / أيام مخصصة</strong>
                            <span>Choose 2 or more days.</span>
                          </button>
                        </div>

                        {Number(setupForm.estimatedDeliveryDays || 0) >= 2 ? (
                          <label className={designStyles.deliveryCustomDays163}>
                            <span>Number of days / عدد الأيام</span>
                            <div>
                              <input
                                type="number"
                                min="2"
                                max="365"
                                step="1"
                                value={setupForm.estimatedDeliveryDays}
                                onChange={(event) =>
                                  updateSetupField(
                                    "estimatedDeliveryDays",
                                    event.target.value
                                  )
                                }
                              />
                              <b>days / أيام</b>
                            </div>
                          </label>
                        ) : null}

                        <label className={designStyles.deliveryCutoff163}>
                          <span>Cutoff time / وقت الإغلاق</span>
                          <input
                            type="time"
                            value={setupForm.deliveryCutoffTime}
                            onChange={(event) =>
                              updateSetupField(
                                "deliveryCutoffTime",
                                event.target.value
                              )
                            }
                          />
                          <small>
                            Example: Same day + 5:00 PM means orders at/after
                            5:00 PM show Tomorrow. Next day becomes 2 days after
                            cutoff.
                          </small>
                        </label>
                      </section>

                      <div
                        className={designStyles.exactWizardZones109V5}
                        data-darik-required157="delivery-zones"
                      >
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

                        </>
                      )}
</section>
                  ) : null}

{storefrontSetupVisibleStep109 === 10 ? (
                    <section data-darik-exact-step="10" className={designStyles.exactWizardPanel109V5}>
                      <div className={designStyles.exactWizardHeading109V5}>
                        <span>STEP 10 / الخطوة ١٠</span>
                        <h3>Payment methods / طرق الدفع</h3>
                        <p>Payment methods are completely separate from delivery.</p>
                      </div>
                      <div
                        className={designStyles.exactWizardPayments109V5}
                        data-darik-required157="payment-methods"
                      >
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
                          data-darik-wizard-next157="true"
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
