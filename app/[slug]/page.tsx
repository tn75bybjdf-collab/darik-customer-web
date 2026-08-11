"use client";

// DARIK_FURNITURE_OPTIONAL_ITEM_VIDEO_068
// DARIK_HOME_APPLIANCES_SHORT_ITEM_VIDEO_071
// DARIK_DUAL_SIZE_PRODUCT_PHOTOS_078
// DARIK_CUSTOMER_PRODUCT_DETAIL_BEAUTY_079
// DARIK_STOREFRONT_PORTFOLIO_COMPOSITION_089
// DARIK_MECHANICS_LAB_048

// DARIK_DETAILS_MODAL_SCROLL_FIX_034

// DARIK_AUTOPARTS_FITMENT_FILTERS_033

import { useEffect, useMemo, useState } from "react";
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
export default function DarikDirectStorefrontPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = normalizeParam(params?.slug);
  const [previewRetailField, setPreviewRetailField] = useState("");
  useEffect(() => {
    const field = new URLSearchParams(window.location.search)
      .get("previewField")
      ?.trim();
    setPreviewRetailField(field || "");
  }, []);

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

  const deliveryEnabled = storefront?.delivery_enabled !== false;
  const pickupEnabled = storefront?.pickup_enabled === true;
  const pickupOnly = Boolean(storefront && !deliveryEnabled && pickupEnabled);
  const selectedPickup = checkoutForm.fulfillmentMethod === "pickup";
  const deliveryFee =
    deliveryEnabled && !selectedPickup ? Number(storefront?.delivery_fee ?? 0) : 0;
  const orderTotal = cartSubtotal + deliveryFee;
  const minimumOrder = Number(storefront?.minimum_order ?? 0);
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
        maximumAge: 60000,
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
        error instanceof Error ? error.message : "The order could not be submitted."
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
      data-field-preview={previewRetailField ? "yes" : "no"}
      data-mechanics-preview={previewMechanicsField ? "yes" : "no"}
      data-category-count={String(visibleCategories.length)}
      data-direct-purchase={hasDirectPurchaseProducts ? "yes" : "no"}
    >
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
          <i className={effectiveAcceptingOrders ? styles.liveDot : styles.pausedDot} />
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
          <button onClick={jumpToCatalog}>
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
                <i className={effectiveAcceptingOrders ? styles.liveDot : styles.pausedDot} />
                {effectiveAcceptingOrders
                  ? "Open now / \u0645\u0641\u062a\u0648\u062d \u0627\u0644\u0622\u0646"
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
            <h1>{storefront.display_name}</h1>
            {storefront.display_name_ar ? (
              <p className={styles.arabicName} dir="rtl">
                {storefront.display_name_ar}
              </p>
            ) : null}
            <p className={styles.tagline}>
              {storefront.tagline || (pickupOnly ? "Browse online and collect from this local store." : isGroceryStore ? "Fresh groceries and daily essentials from your neighborhood market." : "Everything you need, delivered from a local store.")}
            </p>
            {storefront.tagline_ar ? (
              <p className={styles.arabicTagline} dir="rtl">
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
              <i className={effectiveAcceptingOrders ? styles.liveDot : styles.pausedDot} />
              {showOrdering ? "Order status" : "Website mode"}
            </span>
            <strong>
              {!showOrdering ? "Showcase only" : effectiveAcceptingOrders ? "Open now" : "Orders paused"}
            </strong>
          </div>

          <div className={styles.snapshotGrid}>
            {showOrdering ? (
              <>
                <div>
                  <Icon name="clock" size={20} />
                  <span>{pickupOnly ? "Pickup method" : "Estimated delivery"}</span>
                  <strong>
                    {pickupOnly
                      ? "Collect from store"
                      : storefront.estimated_delivery_minutes
                        ? `${storefront.estimated_delivery_minutes} min`
                        : "Store estimate"}
                  </strong>
                </div>
                <div>
                  <Icon name={pickupOnly ? "store" : "truck"} size={20} />
                  <span>{pickupOnly ? "Pickup fee" : "Delivery fee"}</span>
                  <strong>{pickupOnly ? "Free" : money(storefront.delivery_fee)}</strong>
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
                : pickupOnly
                  ? "Collect from store"
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
                          <div className={styles.exactLocationBlock}>
                            <div>
                              <strong>Exact delivery location</strong>
                              <small>Required for every delivery order</small>
                            </div>
                            <button
                              type="button"
                              className={`${styles.locationButton} ${
                                checkoutForm.latitude != null &&
                                checkoutForm.longitude != null
                                  ? styles.locationCaptured
                                  : ""
                              }`}
                              onClick={captureExactLocation}
                              disabled={locatingCustomer}
                            >
                              <Icon name="location" size={18} />
                              {locatingCustomer
                                ? "Capturing location…"
                                : checkoutForm.latitude != null &&
                                    checkoutForm.longitude != null
                                  ? "Exact location captured"
                                  : "Use my exact location"}
                            </button>
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
