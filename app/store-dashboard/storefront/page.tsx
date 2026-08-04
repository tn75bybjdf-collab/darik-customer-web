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
};

type ContextResult = {
  ok: boolean;
  auth_user_id: string | null;
  auth_email: string | null;
  stores: StoreContext[];
};


type CustomLink = {
  label: string;
  url: string;
};

type CustomInformation = {
  label: string;
  value: string;
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
};

const operatingDays = [
  ["sunday", "Sunday"],
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
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
      return {
        label: String(record.label ?? "").trim(),
        url: String(record.url ?? "").trim(),
      };
    })
    .filter((item): item is CustomLink => Boolean(item?.label || item?.url));
}

function normalizeCustomInformation(value: unknown): CustomInformation[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return {
        label: String(record.label ?? "").trim(),
        value: String(record.value ?? "").trim(),
      };
    })
    .filter(
      (item): item is CustomInformation => Boolean(item?.label || item?.value)
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
  about_text: string | null;
  about_text_ar: string | null;
  custom_links: CustomLink[] | null;
  custom_information: CustomInformation[] | null;
  operating_hours: OperatingHours | null;
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
  });

  const [formDirty, setFormDirty] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const setupFormDirtyRef = useRef(false);
  const hydratedRetailerIdRef = useRef<string | null>(null);
  const authUserIdRef = useRef<string | null>(null);

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
              displayName: loadedStorefront.display_name,
              displayNameAr: loadedStorefront.display_name_ar ?? "",
              tagline: loadedStorefront.tagline ?? "",
              taglineAr: loadedStorefront.tagline_ar ?? "",
              logoUrl: loadedStorefront.logo_url ?? "",
              heroImageUrl: loadedStorefront.hero_image_url ?? "",
              phone: loadedStorefront.business_phone ?? "",
              whatsapp: loadedStorefront.whatsapp_number ?? "",
              publicEmail: loadedStorefront.public_email ?? "",
              websiteUrl: loadedStorefront.website_url ?? "",
              facebookUrl: loadedStorefront.facebook_url ?? "",
              instagramUrl: loadedStorefront.instagram_url ?? "",
              addressText: loadedStorefront.address_text ?? "",
              aboutText: loadedStorefront.about_text ?? "",
              aboutTextAr: loadedStorefront.about_text_ar ?? "",
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
              operatingHours: normalizeOperatingHours(
                loadedStorefront.operating_hours
              ),
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
                nextForm = {
                  ...databaseForm,
                  ...parsedDraft.form,
                  customLinks: normalizeCustomLinks(
                    parsedDraft.form.customLinks
                  ),
                  customInformation: normalizeCustomInformation(
                    parsedDraft.form.customInformation
                  ),
                  operatingHours: normalizeOperatingHours(
                    parsedDraft.form.operatingHours
                  ),
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
      customLinks: [...current.customLinks, { label: "", url: "" }],
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
        { label: "", value: "" },
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
      setError("The storefront link must contain at least two characters.");
      return;
    }

    if (!displayName) {
      setError("Storefront display name is required.");
      return;
    }

    if (
      (setupForm.orderSubmissionMode === "phone" ||
        setupForm.orderSubmissionMode === "both") &&
      !setupForm.phone.trim() &&
      !setupForm.whatsapp.trim()
    ) {
      setError(
        "Add a phone or WhatsApp number before enabling phone ordering."
      );
      return;
    }

    const onlineOrderingSelected =
      setupForm.orderSubmissionMode === "online" ||
      setupForm.orderSubmissionMode === "both";

    if (onlineOrderingSelected && !setupForm.acceptCash && !setupForm.acceptCliq) {
      setError("Select at least one online payment method: Cash or CliQ.");
      return;
    }

    if (setupForm.acceptCliq && !setupForm.cliqAccountName.trim()) {
      setError("Enter the CliQ account holder or business name.");
      return;
    }

    if (setupForm.acceptCliq && !setupForm.cliqIdentifier.trim()) {
      setError("Enter the store's CliQ alias or registered mobile number.");
      return;
    }

    setSaving(true);
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
      public_email: setupForm.publicEmail.trim() || null,
      website_url: setupForm.websiteUrl.trim() || null,
      facebook_url: setupForm.facebookUrl.trim() || null,
      instagram_url: setupForm.instagramUrl.trim() || null,
      address_text: setupForm.addressText.trim() || null,
      about_text: setupForm.aboutText.trim() || null,
      about_text_ar: setupForm.aboutTextAr.trim() || null,
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
            direct_storefront_enabled: true,
            marketplace_listing_enabled: true,
            is_accepting_orders: false,
          })
          .select("*")
          .single();

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    const savedStorefront = result.data as StorefrontSettings;

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
        : "Draft storefront created. Publish it when the catalog is ready."
    );
    setSaving(false);
    await loadContext();
  }

  async function publishStorefront() {
    if (!storefront) return;

    setSaving(true);
    setError("");
    setMessage("");

    const result = await supabase
      .from("retailer_storefronts")
      .update({
        storefront_status: "published",
        direct_storefront_enabled: true,
        is_accepting_orders: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", storefront.id)
      .select("*")
      .single();

    if (result.error) {
      setError(result.error.message);
    } else {
      setStorefront(result.data as StorefrontSettings);
      setMessage("Storefront published and accepting orders.");
      await loadContext();
    }

    setSaving(false);
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
              Sign in using the email connected to your existing Darik retailer
              account.
            </p>
          </div>

          <form onSubmit={signIn} className={styles.loginForm}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}
            {message ? <p className={styles.success}>{message}</p> : null}

            <button type="submit">Sign in</button>
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
        </nav>

        <div className={styles.sidebarFooter}>
          <span>{session.user.email}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <section className={styles.dashboardContent}>
        <header className={styles.topbar}>
          <div>
            <p>Storefront management</p>
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
            <span>No retailer membership found</span>
            <h2>This login is not connected to a Darik retailer.</h2>
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
                  <p>Store setup</p>
                  <h2>
                    {storefront
                      ? "Manage your Darik Direct storefront"
                      : "Create your first storefront"}
                  </h2>
                </div>

                {storefront ? (
                  <div className={styles.panelActions}>
                    <a
                      href={`/store/${storefront.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View storefront
                    </a>

                    {storefront.storefront_status !== "published" ? (
                      <button
                        type="button"
                        onClick={publishStorefront}
                        disabled={saving}
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={toggleOrders}
                        disabled={saving}
                      >
                        {storefront.is_accepting_orders
                          ? "Pause orders"
                          : "Accept orders"}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>

              <form className={styles.setupForm} onSubmit={saveStorefront}>
                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Identity</span>
                      <h3>Store name and link</h3>
                    </div>
                    <p>This is what customers see at the top of your store.</p>
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      Store link
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
                          required
                        />
                      </div>
                    </label>

                    <label>
                      Display name
                      <input
                        value={setupForm.displayName}
                        onChange={(event) =>
                          updateSetupField("displayName", event.target.value)
                        }
                        required
                      />
                    </label>

                    <label>
                      Arabic display name
                      <input
                        dir="rtl"
                        value={setupForm.displayNameAr}
                        onChange={(event) =>
                          updateSetupField("displayNameAr", event.target.value)
                        }
                      />
                    </label>

                    <label className={styles.wideField}>
                      Store tagline
                      <input
                        value={setupForm.tagline}
                        onChange={(event) =>
                          updateSetupField("tagline", event.target.value)
                        }
                        placeholder="Local products delivered to your door"
                      />
                    </label>

                    <label className={styles.wideField}>
                      Arabic tagline
                      <input
                        dir="rtl"
                        value={setupForm.taglineAr}
                        onChange={(event) =>
                          updateSetupField("taglineAr", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Branding</span>
                      <h3>Logo and storefront cover</h3>
                    </div>
                    <p>Upload images or paste a hosted image URL.</p>
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
                        <strong>Store logo</strong>
                        <p>Square logo recommended. PNG or JPG, up to 8 MB.</p>
                        <label className={styles.uploadAssetButton}>
                          {uploadingAsset === "logo"
                            ? "Uploading…"
                            : "Upload logo"}
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
                          placeholder="Or paste logo URL"
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
                          <span>Cover image</span>
                        )}
                      </div>

                      <div className={styles.assetControls}>
                        <strong>Storefront cover</strong>
                        <p>Wide image recommended. It appears behind your store name.</p>
                        <label className={styles.uploadAssetButton}>
                          {uploadingAsset === "hero"
                            ? "Uploading…"
                            : "Upload cover"}
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
                          placeholder="Or paste cover image URL"
                        />
                      </div>
                    </article>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Contact</span>
                      <h3>How customers reach you</h3>
                    </div>
                    <p>Only completed fields appear publicly.</p>
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      Store phone
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
                      WhatsApp
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
                      Public email
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
                      Website
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
                      Facebook page
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
                      Instagram page
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
                      Public store address
                      <input
                        value={setupForm.addressText}
                        onChange={(event) =>
                          updateSetupField("addressText", event.target.value)
                        }
                        placeholder="Marka, Amman — next to..."
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>About</span>
                      <h3>Tell customers about the business</h3>
                    </div>
                    <p>Explain what you sell, your experience, or why customers should choose you.</p>
                  </div>

                  <div className={styles.formGrid}>
                    <label className={styles.wideField}>
                      About the store
                      <textarea
                        rows={5}
                        value={setupForm.aboutText}
                        onChange={(event) =>
                          updateSetupField("aboutText", event.target.value)
                        }
                        placeholder="Tell customers about your store."
                      />
                    </label>

                    <label className={styles.wideField}>
                      Arabic About section
                      <textarea
                        dir="rtl"
                        rows={5}
                        value={setupForm.aboutTextAr}
                        onChange={(event) =>
                          updateSetupField("aboutTextAr", event.target.value)
                        }
                        placeholder="اكتب نبذة عن المتجر"
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Business hours</span>
                      <h3>When the store is open</h3>
                    </div>
                    <p>Use any wording you prefer, such as 9:00 AM–10:00 PM or Closed.</p>
                  </div>

                  <div className={styles.hoursGrid}>
                    {operatingDays.map(([day, label]) => (
                      <label key={day}>
                        {label}
                        <input
                          value={setupForm.operatingHours[day] ?? ""}
                          onChange={(event) =>
                            updateOperatingHour(day, event.target.value)
                          }
                          placeholder="9:00 AM – 10:00 PM"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Custom links</span>
                      <h3>Add any links you want</h3>
                    </div>
                    <button
                      type="button"
                      className={styles.addRowButton}
                      onClick={addCustomLink}
                    >
                      + Add link
                    </button>
                  </div>

                  {setupForm.customLinks.length === 0 ? (
                    <p className={styles.optionalEmpty}>
                      Add TikTok, YouTube, a map pin, a catalog, a warranty page,
                      or any other public link.
                    </p>
                  ) : (
                    <div className={styles.repeatRows}>
                      {setupForm.customLinks.map((link, index) => (
                        <div className={styles.repeatRow} key={`link-${index}`}>
                          <input
                            value={link.label}
                            onChange={(event) =>
                              updateCustomLink(
                                index,
                                "label",
                                event.target.value
                              )
                            }
                            placeholder="Link label"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(event) =>
                              updateCustomLink(index, "url", event.target.value)
                            }
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomLink(index)}
                            aria-label="Remove custom link"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Custom store information</span>
                      <h3>Add anything else customers should know</h3>
                    </div>
                    <button
                      type="button"
                      className={styles.addRowButton}
                      onClick={addCustomInformation}
                    >
                      + Add information
                    </button>
                  </div>

                  {setupForm.customInformation.length === 0 ? (
                    <p className={styles.optionalEmpty}>
                      Examples: Delivery areas, payment options, warranty,
                      installation service, parking, or return policy.
                    </p>
                  ) : (
                    <div className={styles.repeatRows}>
                      {setupForm.customInformation.map((item, index) => (
                        <div className={styles.repeatRow} key={`info-${index}`}>
                          <input
                            value={item.label}
                            onChange={(event) =>
                              updateCustomInformation(
                                index,
                                "label",
                                event.target.value
                              )
                            }
                            placeholder="Heading"
                          />
                          <input
                            value={item.value}
                            onChange={(event) =>
                              updateCustomInformation(
                                index,
                                "value",
                                event.target.value
                              )
                            }
                            placeholder="Information shown to customers"
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomInformation(index)}
                            aria-label="Remove custom information"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formSectionHeading}>
                    <div>
                      <span>Delivery</span>
                      <h3>Ordering and delivery settings</h3>
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
                      <strong>Phone orders</strong>
                      <span>
                        Customers call the store or send the cart through
                        WhatsApp. This remains the default.
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
                      <strong>Online orders</strong>
                      <span>
                        Customers enter their delivery details and submit the
                        order directly to this dashboard.
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
                      <strong>Phone + online</strong>
                      <span>
                        Customers choose whether to call, use WhatsApp, or place
                        the order online.
                      </span>
                    </button>
                  </div>

                  <div className={styles.onlinePaymentSettings}>
                    <div className={styles.paymentSettingsHeading}>
                      <div>
                        <span>Online payment methods</span>
                        <h4>What can customers use?</h4>
                      </div>
                      <p>Check one or both. Cash remains enabled by default.</p>
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
                          <strong>Accept cash</strong>
                          <small>Customer pays the store or driver on delivery.</small>
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
                          <strong>Accept CliQ</strong>
                          <small>Customer transfers the total before submitting.</small>
                        </span>
                      </label>
                    </div>

                    {setupForm.acceptCliq ? (
                      <div className={styles.cliqSettingsPanel}>
                        <div className={styles.formGrid}>
                          <label>
                            CliQ account holder / business name
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
                            CliQ alias or registered mobile number
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
                          Customers will see these details only when they select
                          CliQ during online checkout.
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.formGrid}>
                    <label>
                      Delivery fee
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
                      Minimum order
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
                      Delivery radius (km)
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
                      Estimated delivery (minutes)
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
                      <span>Colors</span>
                      <h3>Match the storefront to your brand</h3>
                    </div>
                  </div>

                  <div className={styles.colorRow}>
                    <label>
                      Primary
                      <input
                        type="color"
                        value={setupForm.primaryColor}
                        onChange={(event) =>
                          updateSetupField("primaryColor", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Accent
                      <input
                        type="color"
                        value={setupForm.accentColor}
                        onChange={(event) =>
                          updateSetupField("accentColor", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Background
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

                <div className={styles.formSaveBar}>
                  <div
                    className={`${styles.draftStatus} ${
                      formDirty ? styles.draftStatusUnsaved : ""
                    }`}
                  >
                    <strong>
                      {formDirty ? "Unsaved changes protected" : "All changes saved"}
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
                          : "Protecting your entries automatically…"
                        : "Background login refreshes will not reset this form."}
                    </span>
                  </div>

                  <button
                    className={styles.saveButton}
                    type="submit"
                    disabled={saving || uploadingAsset !== null}
                  >
                    {saving
                      ? "Saving…"
                      : storefront
                        ? "Save storefront profile"
                        : "Create draft storefront"}
                  </button>
                </div>
              </form>
            </section>

          </>
        )}
      </section>
    </main>
  );
}
