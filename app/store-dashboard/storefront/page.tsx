"use client";

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
import styles from "../dashboard.module.css";

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
  orderSubmissionMode: OrderSubmissionMode;
  acceptCash: boolean;
  acceptCliq: boolean;
  cliqAccountName: string;
  cliqIdentifier: string;
  customLinks: CustomLink[];
  customInformation: CustomInformation[];
  operatingHours: OperatingHours;
  operatingHoursAr: OperatingHours;
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
  order_submission_mode: OrderSubmissionMode;
  cash_on_delivery_enabled: boolean;
  cliq_enabled: boolean;
  cliq_account_name: string | null;
  cliq_payment_identifier: string | null;
  activation_status?: string | null;
  activation_plan?: string | null;
  activation_expires_at?: string | null;
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
  const [uploadingAsset, setUploadingAsset] = useState<"logo" | "hero" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

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
    orderSubmissionMode: "phone",
    acceptCash: true,
    acceptCliq: false,
    cliqAccountName: "",
    cliqIdentifier: "",
    customLinks: [],
    customInformation: [],
    operatingHours: { ...defaultOperatingHours },
    operatingHoursAr: { ...defaultOperatingHours },
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
              primaryColor: loadedStorefront.primary_color,
              accentColor: loadedStorefront.accent_color,
              backgroundColor: loadedStorefront.background_color,
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
              orderSubmissionMode: "phone",
              acceptCash: true,
              acceptCliq: false,
              cliqAccountName: "",
              cliqIdentifier: "",
              customLinks: [],
              customInformation: [],
              operatingHours: { ...defaultOperatingHours },
              operatingHoursAr: { ...defaultOperatingHours },
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

  async function signOut() {
    await supabase.auth.signOut();
  }

  function updateSetupField<K extends keyof StorefrontForm>(
    field: K,
    value: StorefrontForm[K]
  ) {
    markSetupDirty();
    setSetupForm((current) => ({ ...current, [field]: value }));
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
      setupForm.orderSubmissionMode === "online" ||
      setupForm.orderSubmissionMode === "both";

    if (onlineOrderingSelected && !setupForm.acceptCash && !setupForm.acceptCliq) {
      showSaveError("Select at least one online payment method: Cash or CliQ.");
      return;
    }

    if (setupForm.acceptCliq && !setupForm.cliqAccountName.trim()) {
      showSaveError("Enter the CliQ account holder or business name.");
      return;
    }

    if (setupForm.acceptCliq && !setupForm.cliqIdentifier.trim()) {
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
      primary_color: setupForm.primaryColor,
      accent_color: setupForm.accentColor,
      background_color: setupForm.backgroundColor,
      delivery_fee: Number(setupForm.deliveryFee || 0),
      minimum_order: Number(setupForm.minimumOrder || 0),
      delivery_radius_km: setupForm.deliveryRadiusKm
        ? Number(setupForm.deliveryRadiusKm)
        : null,
      estimated_delivery_minutes: setupForm.estimatedDeliveryMinutes
        ? Number(setupForm.estimatedDeliveryMinutes)
        : null,
    };

    const result = storefront
      ? await supabase
          .from("retailer_storefronts")
          .update(payload)
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
          })
          .select("*")
          .single();

    if (result.error) {
      showSaveError(formatSupabaseSaveError(result.error));
      return;
    }

    const profileStorefront = result.data as StorefrontSettings;

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
    };

    setStorefront(savedStorefront);
    setSetupForm((current) => ({
      ...current,
      slug: savedStorefront.slug,
      displayName: savedStorefront.display_name,
    }));

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
          <button onClick={signOut}>Sign out / تسجيل الخروج</button>
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
                          href={`/store/${storefront.slug}`}
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
                        <span>getdarik.com/store/</span>
                        <input
                          value={setupForm.slug}
                          onChange={(event) =>
                            updateSetupField(
                              "slug",
                              cleanSlug(event.target.value)
                            )
                          }
                          disabled={Boolean(storefront)}
                          required
                        />
                      </div>
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
                      Public store address / عنوان المتجر الظاهر للعملاء
                      <input
                        value={setupForm.addressText}
                        onChange={(event) =>
                          updateSetupField("addressText", event.target.value)
                        }
                      />
                    </label>
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
                          <small>Customer pays the store or driver on delivery / يدفع العميل للمتجر أو السائق عند التوصيل.</small>
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
