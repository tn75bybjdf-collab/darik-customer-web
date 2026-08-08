"use client";

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

function normalizeSectionOrder(value: unknown): StorefrontSection[] {
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

export default function DarikDirectStorefrontSettingsPage() {
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
  const [uploadingAsset, setUploadingAsset] = useState<"logo" | "hero" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
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

  const authUserId = session?.user.id ?? null;

  const markSetupDirty = useCallback(() => {
    setupFormDirtyRef.current = true;
    setFormDirty(true);
    setError("");
    setMessage("");
  }, []);

  const showSaveError = useCallback((nextError: string) => {
    setSaving(false);
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

        const databaseForm: StorefrontForm = loadedStorefront
          ? {
              slug: loadedStorefront.slug,
              displayName:
                loadedStorefront.display_name ||
                loadedStorefront.display_name_ar ||
                "",
              displayNameAr: "",
              tagline:
                loadedStorefront.tagline ||
                loadedStorefront.tagline_ar ||
                "",
              taglineAr: "",
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
                    draftForm.displayNameAr?.trim() ||
                    databaseForm.displayName,
                  displayNameAr: "",
                  tagline:
                    draftForm.tagline?.trim() ||
                    draftForm.taglineAr?.trim() ||
                    "",
                  taglineAr: "",
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
          setSetupForm(nextForm);

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
          "Current store location captured and locked. Save the storefront profile to publish it. / \u062a\u0645 \u062a\u062d\u062f\u064a\u062f \u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062a\u062c\u0631 \u0627\u0644\u062d\u0627\u0644\u064a \u0648\u0642\u0641\u0644\u0647. \u0627\u062d\u0641\u0638 \u0645\u0644\u0641 \u0627\u0644\u0645\u062a\u062c\u0631 \u0644\u0646\u0634\u0631\u0647."
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
        ? "Logo uploaded. Save the storefront to publish it."
        : "Cover image uploaded. Save the storefront to publish it."
    );
    setUploadingAsset(null);
  }

  async function saveStorefront(event: FormEvent) {
    event.preventDefault();

    if (!selectedStore) return;

    const slug = cleanSlug(setupForm.slug);
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

    if (
      setupForm.showOrdering &&
      setupForm.fulfillmentMode === "delivery" &&
      (!setupForm.deliveryRadiusKm || Number(setupForm.deliveryRadiusKm) <= 0)
    ) {
      showSaveError("Enter a delivery radius, or choose Local pickup only / أدخل نطاق التوصيل أو اختر الاستلام المحلي فقط.");
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
    setError("");
    setMessage("");

    const payload = {
      retailer_id: selectedStore.retailer_id,
      slug,
      display_name: displayName,
      display_name_ar: null,
      tagline: setupForm.tagline.trim() || null,
      tagline_ar: null,
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
      design_draft: {
        ...designFromForm(setupForm),
        primaryColor: setupForm.primaryColor,
        accentColor: setupForm.accentColor,
        backgroundColor: setupForm.backgroundColor,
      },
      delivery_enabled: setupForm.fulfillmentMode === "delivery",
      pickup_enabled: setupForm.fulfillmentMode === "pickup",
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
      pickup_enabled: setupForm.fulfillmentMode === "pickup",
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

    setMessage(
      storefront
        ? "Storefront settings updated."
        : "Draft storefront created. Preview it privately, then submit CliQ activation when ready."
    );
    setSaving(false);
    await loadContext();
  }

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
          <span>{session.user.email}</span>
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
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                    >
                      Preview store / معاينة المتجر
                    </button>

                    {storefront.activation_status === "active" ? (
                      <>
                        <a
                          href={`/${storefront.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open live store / فتح المتجر المباشر
                        </a>
                        <button
                          type="button"
                          onClick={toggleOrders}
                          disabled={saving}
                        >
                          {storefront.is_accepting_orders
                            ? "Pause orders / إيقاف الطلبات"
                            : "Accept orders / استقبال الطلبات"}
                        </button>
                      </>
                    ) : (
                      <a href="/store-dashboard/activation">Pay by CliQ to go live / ادفع عبر كليك لتفعيل المتجر</a>
                    )}
                  </div>
                ) : null}
              </div>

              <form className={styles.setupForm} onSubmit={saveStorefront} noValidate>
                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Identity / الهوية</span>
                      <h3>Store name and link / اسم المتجر والرابط</h3>
                    </div>
                    <p>This is what customers see at the top of your store / هذا ما يراه العملاء في أعلى المتجر.</p>
                  </div>

                  <div className={styles.formGrid}>
                    <label className={styles.wideField}>
                      Permanent store link / رابط المتجر الدائم
                      <div className={styles.slugInput}>
                        <span>getdarik.com/</span>
                        <input
                          value={setupForm.slug}
                          onChange={(event) =>
                            updateSetupField(
                              "slug",
                              cleanSlug(event.target.value)
                            )
                          }
                          inputMode="url"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          required
                        />
                      </div>
                      <span style={{ marginTop: 6, display: "block", fontSize: 12, color: slugState === "taken" ? "#b42318" : slugState === "available" ? "#08745f" : "#667085", fontWeight: 800 }}>
                        {slugState === "checking"
                          ? "Checking availability… / جاري التحقق من توفر الرابط…"
                          : slugState === "taken"
                            ? "Already in use or reserved / الرابط مستخدم أو محجوز"
                            : slugState === "available"
                              ? storefront && setupForm.slug === storefront.slug
                                ? "Current link / الرابط الحالي"
                                : "Available / متاح"
                              : "Use English letters, numbers, and hyphens / استخدم أحرفاً إنجليزية وأرقاماً وشرطات"}
                      </span>
                    </label>

                    <label>
                      Customer-facing name / اسم المتجر الظاهر للعملاء
                      <input
                        value={setupForm.displayName}
                        onChange={(event) =>
                          updateSetupField("displayName", event.target.value)
                        }
                        required
                      />
                    </label>

                    <label>
                      Store tagline / العبارة التعريفية للمتجر
                      <input
                        value={setupForm.tagline}
                        onChange={(event) =>
                          updateSetupField("tagline", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Branding / الهوية البصرية</span>
                      <h3>Logo and storefront cover / الشعار وصورة الغلاف</h3>
                    </div>
                    <p>Upload images or paste a hosted image URL / حمّل الصور أو الصق رابط صورة.</p>
                  </div>

                  <div className={styles.assetGrid}>
                    <article className={styles.assetCard}>
                      <div className={styles.logoPreview}>
                        {setupForm.logoUrl ? (
                          <img src={setupForm.logoUrl} alt="Store logo preview" />
                        ) : (
                          <span>
                            {(setupForm.displayName || "S")
                              .slice(0, 1)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className={styles.assetControls}>
                        <strong>Store logo / شعار المتجر</strong>
                        <p>Square logo recommended / يُفضّل شعار مربع. PNG or JPG, up to 8 MB / حتى 8 ميجابايت.</p>
                        <label className={styles.uploadAssetButton}>
                          {uploadingAsset === "logo"
                            ? "Uploading… / جارٍ التحميل…"
                            : "Upload logo / تحميل الشعار"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(event) =>
                              uploadStorefrontAsset(event, "logo")
                            }
                            disabled={uploadingAsset !== null}
                          />
                        </label>
                        <input
                          type="url"
                          value={setupForm.logoUrl}
                          onChange={(event) =>
                            updateSetupField("logoUrl", event.target.value)
                          }
                          placeholder="Or paste logo URL / أو الصق رابط الشعار"
                        />
                      </div>
                    </article>

                    <article className={styles.assetCard}>
                      <div className={styles.heroPreview}>
                        {setupForm.heroImageUrl ? (
                          <img
                            src={setupForm.heroImageUrl}
                            alt="Store cover preview"
                          />
                        ) : (
                          <span>Cover image / صورة الغلاف</span>
                        )}
                      </div>

                      <div className={styles.assetControls}>
                        <strong>Storefront cover / صورة غلاف المتجر</strong>
                        <p>Wide image recommended / يُفضّل صورة عريضة. It appears behind your store name / تظهر خلف اسم المتجر.</p>
                        <label className={styles.uploadAssetButton}>
                          {uploadingAsset === "hero"
                            ? "Uploading… / جارٍ التحميل…"
                            : "Upload cover / تحميل الغلاف"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(event) =>
                              uploadStorefrontAsset(event, "hero")
                            }
                            disabled={uploadingAsset !== null}
                          />
                        </label>
                        <input
                          type="url"
                          value={setupForm.heroImageUrl}
                          onChange={(event) =>
                            updateSetupField("heroImageUrl", event.target.value)
                          }
                          placeholder="Or paste cover image URL / أو الصق رابط صورة الغلاف"
                        />
                      </div>
                    </article>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Contact / التواصل</span>
                      <h3>How customers reach you / كيف يتواصل العملاء معك</h3>
                    </div>
                    <p>Only completed fields appear publicly / تظهر الحقول المكتملة فقط للعملاء.</p>
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      Store phone / هاتف المتجر
                      <input
                        type="tel"
                        value={setupForm.phone}
                        onChange={(event) =>
                          updateSetupField("phone", event.target.value)
                        }
                        placeholder="07XXXXXXXX"
                      />
                    </label>

                    <label>
                      WhatsApp / واتساب
                      <input
                        type="tel"
                        value={setupForm.whatsapp}
                        onChange={(event) =>
                          updateSetupField("whatsapp", event.target.value)
                        }
                        placeholder="+9627XXXXXXXX"
                      />
                    </label>

                    <label>
                      Public email / البريد الإلكتروني الظاهر للعملاء
                      <input
                        type="email"
                        value={setupForm.publicEmail}
                        onChange={(event) =>
                          updateSetupField("publicEmail", event.target.value)
                        }
                        placeholder="store@example.com"
                      />
                    </label>

                    <label>
                      Website / الموقع الإلكتروني
                      <input
                        type="url"
                        value={setupForm.websiteUrl}
                        onChange={(event) =>
                          updateSetupField("websiteUrl", event.target.value)
                        }
                        placeholder="https://yourstore.com"
                      />
                    </label>

                    <label>
                      Facebook page / صفحة فيسبوك
                      <input
                        type="url"
                        value={setupForm.facebookUrl}
                        onChange={(event) =>
                          updateSetupField("facebookUrl", event.target.value)
                        }
                        placeholder="https://facebook.com/..."
                      />
                    </label>

                    <label>
                      Instagram page / صفحة إنستغرام
                      <input
                        type="url"
                        value={setupForm.instagramUrl}
                        onChange={(event) =>
                          updateSetupField("instagramUrl", event.target.value)
                        }
                        placeholder="https://instagram.com/..."
                      />
                    </label>

                    <label className={styles.wideField}>
                      {"Store location / \u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062a\u062c\u0631"}
                      <input
                        value={setupForm.addressText}
                        onChange={(event) =>
                          updateSetupField("addressText", event.target.value)
                        }
                        disabled={locationLocked || locatingStore}
                        placeholder="Store address or use current location"
                      />
                    </label>
                    <div
                      className={styles.wideField}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {locationLocked ? (
                        <>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.6rem 0.8rem",
                              borderRadius: "0.8rem",
                              background: "#ecfdf5",
                              color: "#166534",
                              fontWeight: 800,
                            }}
                          >
                            {"Location locked / \u0627\u0644\u0645\u0648\u0642\u0639 \u0645\u0642\u0641\u0644"}
                          </span>
                          <button
                            type="button"
                            onClick={unlockStoreLocation}
                            disabled={saving || locatingStore}
                          >
                            {"Unlock location / \u0641\u062a\u062d \u0642\u0641\u0644 \u0627\u0644\u0645\u0648\u0642\u0639"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={getCurrentStoreLocation}
                            disabled={saving || locatingStore}
                          >
                            {locatingStore
                              ? "Getting location... / \u062c\u0627\u0631\u064a \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0645\u0648\u0642\u0639..."
                              : "Get current location / \u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062d\u0627\u0644\u064a"}
                          </button>
                          <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                            {"Use this while you are physically at the store, or type the address manually. / \u0627\u0633\u062a\u062e\u062f\u0645\u0647 \u0648\u0623\u0646\u062a \u0641\u064a \u0627\u0644\u0645\u062a\u062c\u0631 \u0623\u0648 \u0623\u062f\u062e\u0644 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u064a\u062f\u0648\u064a\u0627."}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>About / نبذة</span>
                      <h3>Tell customers about the business / عرّف العملاء بمتجرك</h3>
                    </div>
                    <p>Explain what you sell, your experience, or why customers should choose you / اشرح ما تبيعه وخبرتك ولماذا يختار العملاء متجرك.</p>
                  </div>

                  <div className={styles.formGrid}>
                    <label className={styles.wideField}>
                      About the store / نبذة عن المتجر
                      <textarea
                        rows={5}
                        value={setupForm.aboutText}
                        onChange={(event) =>
                          updateSetupField("aboutText", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Business hours / ساعات العمل</span>
                      <h3>When the store is open / متى يكون المتجر مفتوحًا</h3>
                    </div>
                    <p>Use any wording you prefer, such as 9:00 AM–10:00 PM or Closed / اكتب الساعات بالطريقة التي تفضّلها أو اكتب مغلق.</p>
                  </div>

                  <div className={styles.hoursGrid}>
                    {operatingDays.map(([day, label, labelAr]) => (
                      <div className={styles.hoursRow} key={day}>
                        <div className={styles.hoursDay}>
                          <strong>{label}</strong>
                          <span dir="rtl">{labelAr}</span>
                        </div>
                        <label>
                          Hours / ساعات العمل
                          <input
                            value={setupForm.operatingHours[day] ?? ""}
                            onChange={(event) =>
                              updateOperatingHour(day, event.target.value)
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Custom links / روابط إضافية</span>
                      <h3>Add any links you want / أضف الروابط التي تريدها</h3>
                    </div>
                    <button
                      type="button"
                      className={styles.addRowButton}
                      onClick={addCustomLink}
                    >
                      + Add link / إضافة رابط
                    </button>
                  </div>

                  {setupForm.customLinks.length === 0 ? (
                    <p className={styles.optionalEmpty}>
                      Add TikTok, YouTube, a map pin, a catalog, a warranty page,
                      or any other public link / أضف تيك توك أو يوتيوب أو موقعًا
                      على الخريطة أو كتالوجًا أو صفحة ضمان أو أي رابط عام آخر.
                    </p>
                  ) : (
                    <div className={styles.repeatRows}>
                      {setupForm.customLinks.map((link, index) => (
                        <div
                          className={styles.bilingualLinkRow}
                          key={`link-${index}`}
                        >
                          <label>
                            Link label / اسم الرابط
                            <input
                              value={link.label}
                              onChange={(event) =>
                                updateCustomLink(
                                  index,
                                  "label",
                                  event.target.value
                                )
                              }
                            />
                          </label>
                          <label className={styles.linkUrlField}>
                            Link URL / رابط الصفحة
                            <input
                              type="url"
                              value={link.url}
                              onChange={(event) =>
                                updateCustomLink(
                                  index,
                                  "url",
                                  event.target.value
                                )
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeCustomLink(index)}
                            aria-label="Remove custom link / حذف الرابط"
                          >
                            Remove / حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Custom store information / معلومات إضافية عن المتجر</span>
                      <h3>Add anything else customers should know / أضف أي معلومات أخرى يحتاجها العملاء</h3>
                    </div>
                    <button
                      type="button"
                      className={styles.addRowButton}
                      onClick={addCustomInformation}
                    >
                      + Add information / إضافة معلومات
                    </button>
                  </div>

                  {setupForm.customInformation.length === 0 ? (
                    <p className={styles.optionalEmpty}>
                      Delivery areas, payment options, warranty, installation,
                      parking, or return policy / مناطق التوصيل أو طرق الدفع أو
                      الضمان أو التركيب أو المواقف أو سياسة الإرجاع.
                    </p>
                  ) : (
                    <div className={styles.repeatRows}>
                      {setupForm.customInformation.map((item, index) => (
                        <div
                          className={styles.bilingualInformationRow}
                          key={`info-${index}`}
                        >
                          <label>
                            Heading / العنوان
                            <input
                              value={item.label}
                              onChange={(event) =>
                                updateCustomInformation(
                                  index,
                                  "label",
                                  event.target.value
                                )
                              }
                            />
                          </label>
                          <label>
                            Information / المعلومات
                            <textarea
                              rows={3}
                              value={item.value}
                              onChange={(event) =>
                                updateCustomInformation(
                                  index,
                                  "value",
                                  event.target.value
                                )
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeCustomInformation(index)}
                            aria-label="Remove custom information / حذف المعلومات"
                          >
                            Remove / حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Delivery / التوصيل</span>
                      <h3>Ordering and delivery settings / إعدادات الطلب والتوصيل</h3>
                    </div>
                  </div>

                  <div className={styles.orderMethodChoices}>
                    <button
                      type="button"
                      className={
                        setupForm.fulfillmentMode === "delivery"
                          ? styles.activeOrderMethod
                          : ""
                      }
                      onClick={() =>
                        updateSetupField("fulfillmentMode", "delivery")
                      }
                    >
                      <strong>Delivery / توصيل</strong>
                      <span>
                        Customers order for delivery inside your configured radius
                        / يطلب العملاء للتوصيل ضمن النطاق الذي تحدده.
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        setupForm.fulfillmentMode === "pickup"
                          ? styles.activeOrderMethod
                          : ""
                      }
                      onClick={() =>
                        updateSetupField("fulfillmentMode", "pickup")
                      }
                    >
                      <strong>Local pickup only / استلام محلي فقط</strong>
                      <span>
                        No delivery is offered. Customers collect the order from the store
                        / لا يوجد توصيل ويستلم العميل الطلب من المتجر.
                      </span>
                    </button>
                  </div>

                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Order channel / طريقة إرسال الطلب</span>
                      <h3>How customers submit orders / كيف يرسل العملاء الطلبات</h3>
                    </div>
                  </div>

                  <div className={styles.orderMethodChoices}>
                    <button
                      type="button"
                      className={
                        setupForm.orderSubmissionMode === "phone"
                          ? styles.activeOrderMethod
                          : ""
                      }
                      onClick={() =>
                        updateSetupField("orderSubmissionMode", "phone")
                      }
                    >
                      <strong>Phone orders / طلبات الهاتف</strong>
                      <span>
                        Customers call the store or send the cart through
                        WhatsApp / يتصل العملاء بالمتجر أو يرسلون السلة عبر واتساب.
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        setupForm.orderSubmissionMode === "online"
                          ? styles.activeOrderMethod
                          : ""
                      }
                      onClick={() =>
                        updateSetupField("orderSubmissionMode", "online")
                      }
                    >
                      <strong>Online orders / الطلبات الإلكترونية</strong>
                      <span>
                        Customers enter their delivery details and submit the
                        order directly / يُدخل العملاء بيانات التوصيل ويرسلون
                        الطلب مباشرةً إلى لوحة التحكم.
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        setupForm.orderSubmissionMode === "both"
                          ? styles.activeOrderMethod
                          : ""
                      }
                      onClick={() =>
                        updateSetupField("orderSubmissionMode", "both")
                      }
                    >
                      <strong>Phone + online / الهاتف والإلكتروني</strong>
                      <span>
                        Customers choose whether to call, use WhatsApp, or place
                        the order online / يختار العملاء الاتصال أو واتساب أو
                        تقديم الطلب إلكترونيًا.
                      </span>
                    </button>
                  </div>

                  <div className={styles.onlinePaymentSettings}>
                    <div className={styles.paymentSettingsHeading}>
                      <div>
                        <span>Online payment methods / طرق الدفع الإلكترونية</span>
                        <h4>What can customers use? / ما طرق الدفع المتاحة للعملاء؟</h4>
                      </div>
                      <p>Check one or both / اختر طريقة أو الطريقتين. Cash remains enabled by default / الدفع النقدي مفعّل افتراضيًا.</p>
                    </div>

                    <div className={styles.paymentCheckboxGrid}>
                      <label
                        className={
                          setupForm.acceptCash
                            ? styles.activePaymentCheckbox
                            : ""
                        }
                      >
                        <input
                          type="checkbox"
                          checked={setupForm.acceptCash}
                          onChange={(event) =>
                            updateSetupField("acceptCash", event.target.checked)
                          }
                        />
                        <span>
                          <strong>Accept cash / قبول الدفع نقدًا</strong>
                          <small>
                            {setupForm.fulfillmentMode === "pickup"
                              ? "Customer pays when collecting the order / يدفع العميل عند استلام الطلب من المتجر."
                              : "Customer pays the store or driver on delivery / يدفع العميل للمتجر أو السائق عند التوصيل."}
                          </small>
                        </span>
                      </label>

                      <label
                        className={
                          setupForm.acceptCliq
                            ? styles.activePaymentCheckbox
                            : ""
                        }
                      >
                        <input
                          type="checkbox"
                          checked={setupForm.acceptCliq}
                          onChange={(event) =>
                            updateSetupField("acceptCliq", event.target.checked)
                          }
                        />
                        <span>
                          <strong>Accept CliQ / قبول الدفع عبر كليك</strong>
                          <small>Customer transfers the total before submitting / يحوّل العميل المبلغ قبل إرسال الطلب.</small>
                        </span>
                      </label>
                    </div>

                    {setupForm.acceptCliq ? (
                      <div className={styles.cliqSettingsPanel}>
                        <div className={styles.formGrid}>
                          <label>
                            CliQ account holder or business name / اسم صاحب حساب كليك أو اسم المنشأة
                            <input
                              value={setupForm.cliqAccountName}
                              onChange={(event) =>
                                updateSetupField(
                                  "cliqAccountName",
                                  event.target.value
                                )
                              }
                              placeholder="Al Salam Market"
                            />
                          </label>

                          <label>
                            CliQ alias or registered mobile number / اسم كليك المستعار أو رقم الهاتف المسجل
                            <input
                              value={setupForm.cliqIdentifier}
                              onChange={(event) =>
                                updateSetupField(
                                  "cliqIdentifier",
                                  event.target.value
                                )
                              }
                              placeholder="Store alias or 07XXXXXXXX"
                            />
                          </label>
                        </div>
                        <p>
                          Customers see these details only when they select CliQ
                          / تظهر هذه البيانات للعملاء فقط عند اختيار كليك.
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.formGrid}>
                    {setupForm.fulfillmentMode === "delivery" ? (
                      <>
                        <label>
                          Delivery fee / رسوم التوصيل
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={setupForm.deliveryFee}
                            onChange={(event) =>
                              updateSetupField("deliveryFee", event.target.value)
                            }
                          />
                        </label>

                        <label>
                          Delivery radius (km) / نطاق التوصيل (كم)
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={setupForm.deliveryRadiusKm}
                            onChange={(event) =>
                              updateSetupField(
                                "deliveryRadiusKm",
                                event.target.value
                              )
                            }
                          />
                        </label>

                        <label>
                          Estimated delivery (minutes) / مدة التوصيل المتوقعة (دقيقة)
                          <input
                            type="number"
                            min="1"
                            value={setupForm.estimatedDeliveryMinutes}
                            onChange={(event) =>
                              updateSetupField(
                                "estimatedDeliveryMinutes",
                                event.target.value
                              )
                            }
                          />
                        </label>
                      </>
                    ) : (
                      <div style={{
                        padding: "1rem",
                        borderRadius: "1rem",
                        border: "1px solid #bbf7d0",
                        background: "#f0fdf4",
                        color: "#166534",
                        fontWeight: 800,
                      }}>
                        Local pickup only is enabled. Delivery fee, delivery radius, and delivery time are disabled
                        / تم تفعيل الاستلام المحلي فقط، وتم إيقاف رسوم ونطاق ووقت التوصيل.
                      </div>
                    )}

                    <label>
                      Minimum order / الحد الأدنى للطلب
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={setupForm.minimumOrder}
                        onChange={(event) =>
                          updateSetupField("minimumOrder", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className={`${styles.formSection} ${designStyles.designStudio}`}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Store design / تصميم المتجر</span>
                      <h3>Make the website feel like your business / خلّي الموقع يعكس هوية نشاطك</h3>
                    </div>
                    <p>Choose a professionally controlled theme, preview it, then publish it without changing products or orders.</p>
                  </div>

                  <div className={designStyles.themeGrid}>
                    {themeOptions.map((theme) => (
                      <button
                        type="button"
                        key={theme.value}
                        className={`${designStyles.themeCard} ${
                          setupForm.storefrontTheme === theme.value
                            ? designStyles.themeSelected
                            : ""
                        }`}
                        data-theme-preview={theme.value}
                        onClick={() => updateSetupField("storefrontTheme", theme.value)}
                      >
                        <span className={designStyles.themeMockup}>
                          <i />
                          <b />
                          <em />
                          <small />
                        </span>
                        <strong>{theme.name} / {theme.nameAr}</strong>
                        <small>{theme.description}</small>
                      </button>
                    ))}
                  </div>

                  <div className={designStyles.controlGrid}>
                    <label>
                      Appearance / المظهر
                      <select
                        value={setupForm.appearanceMode}
                        onChange={(event) => updateSetupField("appearanceMode", event.target.value as AppearanceMode)}
                      >
                        <option value="light">Light / فاتح</option>
                        <option value="dark">Dark / داكن</option>
                      </select>
                    </label>
                    <label>
                      Product cards / بطاقات المنتجات
                      <select
                        value={setupForm.productCardStyle}
                        onChange={(event) => updateSetupField("productCardStyle", event.target.value as ProductCardStyle)}
                      >
                        <option value="standard">Standard / قياسي</option>
                        <option value="image_first">Image first / الصورة أولاً</option>
                        <option value="compact">Compact / مضغوط</option>
                      </select>
                    </label>
                    <label>
                      Corners / شكل الزوايا
                      <select
                        value={setupForm.cornerStyle}
                        onChange={(event) => updateSetupField("cornerStyle", event.target.value as CornerStyle)}
                      >
                        <option value="rounded">Rounded / دائرية</option>
                        <option value="soft">Soft / ناعمة</option>
                        <option value="square">Square / مربعة</option>
                      </select>
                    </label>
                    <label>
                      Hero layout / تصميم الغلاف
                      <select
                        value={setupForm.heroLayout}
                        onChange={(event) => updateSetupField("heroLayout", event.target.value as HeroLayout)}
                      >
                        <option value="centered">Centered / وسطي</option>
                        <option value="split">Split / مقسوم</option>
                        <option value="immersive">Immersive / غامر</option>
                      </select>
                    </label>
                  </div>

                  <div className={designStyles.toggleGrid}>
                    {[
                      ["showPrices", "Show prices / إظهار الأسعار", "Turn off for catalog or quote-based businesses"],
                      ["showOrdering", "Enable cart and checkout / تفعيل السلة والطلب", "Turn off for a true showcase-only website"],
                      ["showPhone", "Show phone / إظهار الهاتف", "Customers can tap to call"],
                      ["showWhatsapp", "Show WhatsApp / إظهار واتساب", "Customers can open a WhatsApp conversation"],
                      ["showStoreStory", "Show About section / إظهار قسم عن المتجر", "Display the store story near the bottom"],
                    ].map(([field, label, helper]) => (
                      <label className={designStyles.switchCard} key={field}>
                        <span><strong>{label}</strong><small>{helper}</small></span>
                        <input
                          type="checkbox"
                          checked={Boolean(setupForm[field as keyof StorefrontForm])}
                          onChange={(event) => updateSetupField(field as keyof StorefrontForm, event.target.checked as never)}
                        />
                      </label>
                    ))}
                  </div>

                  <div className={designStyles.sectionOrderBox}>
                    <div>
                      <strong>Homepage section order / ترتيب أقسام الصفحة</strong>
                      <span>Move each section up or down / حرّك كل قسم للأعلى أو الأسفل</span>
                    </div>
                    {setupForm.sectionOrder.map((section, index) => (
                      <div className={designStyles.orderRow} key={section}>
                        <span>{index + 1}</span>
                        <strong>{section === "categories" ? "Categories / الأقسام" : section === "catalog" ? "Products / المنتجات" : "About store / عن المتجر"}</strong>
                        <div>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              const next = [...setupForm.sectionOrder];
                              [next[index - 1], next[index]] = [next[index], next[index - 1]];
                              updateSetupField("sectionOrder", next);
                            }}
                          >↑</button>
                          <button
                            type="button"
                            disabled={index === setupForm.sectionOrder.length - 1}
                            onClick={() => {
                              const next = [...setupForm.sectionOrder];
                              [next[index + 1], next[index]] = [next[index], next[index + 1]];
                              updateSetupField("sectionOrder", next);
                            }}
                          >↓</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={designStyles.designActions}>
                    <button type="button" onClick={() => setPreviewOpen(true)}>
                      Preview current design / معاينة التصميم الحالي
                    </button>
                    <button type="button" onClick={publishStorefrontDesign} disabled={!storefront || saving}>
                      {saving ? "Publishing… / جارٍ النشر…" : "Publish design / نشر التصميم"}
                    </button>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Colors / الألوان</span>
                      <h3>Match the storefront to your brand / طابق ألوان المتجر مع علامتك</h3>
                    </div>
                  </div>

                  <div className={styles.colorRow}>
                    <label>
                      Primary / اللون الأساسي
                      <input
                        type="color"
                        value={setupForm.primaryColor}
                        onChange={(event) =>
                          updateSetupField("primaryColor", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Accent / اللون الثانوي
                      <input
                        type="color"
                        value={setupForm.accentColor}
                        onChange={(event) =>
                          updateSetupField("accentColor", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Background / لون الخلفية
                      <input
                        type="color"
                        value={setupForm.backgroundColor}
                        onChange={(event) =>
                          updateSetupField("backgroundColor", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formSaveBar} ref={saveBarRef}>
                  <div
                    className={`${styles.draftStatus} ${
                      formDirty ? styles.draftStatusUnsaved : ""
                    }`}
                  >
                    <strong>
                      {formDirty
                        ? "Unsaved changes protected / التغييرات غير المحفوظة محمية"
                        : "All changes saved / تم حفظ جميع التغييرات"}
                    </strong>
                    <span>
                      {formDirty
                        ? draftSavedAt
                          ? `Local draft updated at ${new Date(
                              draftSavedAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "Protecting your entries automatically… / جارٍ حماية مدخلاتك تلقائيًا…"
                        : "Background login refreshes will not reset this form / تحديث تسجيل الدخول لن يمسح النموذج."}
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
                      ? "Saving… / جارٍ الحفظ…"
                      : storefront
                        ? "Save storefront profile / حفظ ملف المتجر"
                        : "Create draft storefront / إنشاء مسودة المتجر"}
                  </button>
                </div>
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
