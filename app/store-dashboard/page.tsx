"use client";

// DARIK_PAYMENT_FIRST_YEARLY_PLANS_CATALOG_GATE_190

// DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136

// DARIK_MOBILE_DASHBOARD_LOGOUT_035
// DARIK_FRONTEND_OVERVIEW_EDITABLE_RETAIL_FIELD_134
// DARIK_EYEGLASSES_RETAIL_FIELD_MECHANICS_135

import {
  CSSProperties,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseBrowser";
import StorefrontPreviewModal from "./components/StorefrontPreviewModal";
import DashboardLogoutButton from "./components/DashboardLogoutButton";
import styles from "./dashboard.module.css";

type StoreContext = {
  retailer_id: string;
  business_name: string;
  business_type: string | null;
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

type StorefrontSummary = {
  id: string;
  slug: string;
  display_name?: string | null;
  display_name_ar?: string | null;
  tagline?: string | null;
  tagline_ar?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  business_phone?: string | null;
  whatsapp_number?: string | null;
  public_email?: string | null;
  address_text?: string | null;
  address_text_ar?: string | null;
  about_text?: string | null;
  about_text_ar?: string | null;
  primary_color?: string | null;
  accent_color?: string | null;
  background_color?: string | null;
  delivery_fee?: number | string | null;
  minimum_order?: number | string | null;
  delivery_radius_km?: number | string | null;
  estimated_delivery_minutes?: number | string | null;
  order_submission_mode?: string | null;
  cash_on_delivery_enabled?: boolean | null;
  cliq_enabled?: boolean | null;
  storefront_status: string;
  is_accepting_orders: boolean;
  activation_status?: string | null;
  activation_plan?: string | null;
  activation_expires_at?: string | null;
};

type DirectOrder = {
  id: string;
  order_number: string | null;
  customer_name: string;
  total: number | string;
  order_status: string;
  created_at: string;
};

type SetupTask = {
  id: string;
  title: string;
  detail: string;
  href: string;
  action: string;
  complete: boolean;
};

const orderStatusLabels: Record<string, string> = {
  pending: "Pending / قيد الانتظار",
  accepted: "Accepted / مقبول",
  preparing: "Preparing / قيد التجهيز",
  ready_for_driver: "Ready for driver / جاهز للسائق",
  out_for_delivery: "Out for delivery / في الطريق",
  delivered: "Delivered / تم التوصيل",
  cancelled: "Cancelled / ملغي",
};


const RETAIL_FIELD_OPTIONS_134 = [
  {
    "value": "supermarket",
    "label": "Supermarket / Hypermarket",
    "labelAr": "\u0633\u0648\u0628\u0631\u0645\u0627\u0631\u0643\u062a / \u0647\u0627\u064a\u0628\u0631\u0645\u0627\u0631\u0643\u062a"
  },
  {
    "value": "restaurant",
    "label": "Restaurant",
    "labelAr": "\u0645\u0637\u0639\u0645"
  },
  {
    "value": "bakery",
    "label": "Bakery / Sweets",
    "labelAr": "\u0645\u062e\u0628\u0632 / \u062d\u0644\u0648\u064a\u0627\u062a"
  },
  {
    "value": "cafe",
    "label": "Caf\u00e9",
    "labelAr": "\u0645\u0642\u0647\u0649 / \u0643\u0648\u0641\u064a \u0634\u0648\u0628"
  },
  {
    "value": "smoke_shop",
    "label": "Smoke Shop",
    "labelAr": "\u0645\u062d\u0644 \u062f\u062e\u0627\u0646 \u0648\u062a\u0628\u063a"
  },
  {
    "value": "butcher",
    "label": "Butcher",
    "labelAr": "\u0645\u0644\u062d\u0645\u0629"
  },
  {
    "value": "produce",
    "label": "Fruit and vegetable store",
    "labelAr": "\u062e\u0636\u0627\u0631 \u0648\u0641\u0648\u0627\u0643\u0647"
  },
  {
    "value": "clothing",
    "label": "Clothing",
    "labelAr": "\u0645\u0644\u0627\u0628\u0633"
  },
  {
    "value": "shoes",
    "label": "Shoes",
    "labelAr": "\u0623\u062d\u0630\u064a\u0629"
  },
  {
    "value": "jewelry",
    "label": "Jewelry",
    "labelAr": "\u0645\u062c\u0648\u0647\u0631\u0627\u062a"
  },
  {
    "value": "eyeglasses",
    "label": "Eyeglasses / Optical Store",
    "labelAr": "\u0646\u0638\u0627\u0631\u0627\u062a / \u0645\u062d\u0644 \u0628\u0635\u0631\u064a\u0627\u062a"
  },
  {
    "value": "cosmetics",
    "label": "Cosmetics / Beauty",
    "labelAr": "\u0645\u0633\u062a\u062d\u0636\u0631\u0627\u062a \u062a\u062c\u0645\u064a\u0644 / \u0639\u0646\u0627\u064a\u0629"
  },
  {
    "value": "perfume",
    "label": "Perfume",
    "labelAr": "\u0639\u0637\u0648\u0631"
  },
  {
    "value": "electronics",
    "label": "Electronics",
    "labelAr": "\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u062a"
  },
  {
    "value": "computers",
    "label": "Computers",
    "labelAr": "\u0643\u0645\u0628\u064a\u0648\u062a\u0631"
  },
  {
    "value": "mobile_phones",
    "label": "Mobile phones & accessories",
    "labelAr": "\u0647\u0648\u0627\u062a\u0641 \u0648\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062a"
  },
  {
    "value": "furniture",
    "label": "Furniture",
    "labelAr": "\u0623\u062b\u0627\u062b"
  },
  {
    "value": "home_appliances",
    "label": "Home appliances",
    "labelAr": "\u0623\u062c\u0647\u0632\u0629 \u0645\u0646\u0632\u0644\u064a\u0629"
  },
  {
    "value": "home_decor",
    "label": "Home d\u00e9cor",
    "labelAr": "\u062f\u064a\u0643\u0648\u0631 \u0645\u0646\u0632\u0644\u064a"
  },
  {
    "value": "auto_parts",
    "label": "Auto parts",
    "labelAr": "\u0642\u0637\u0639 \u0633\u064a\u0627\u0631\u0627\u062a"
  },
  {
    "value": "tires",
    "label": "Tires & car accessories",
    "labelAr": "\u0625\u0637\u0627\u0631\u0627\u062a \u0648\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062a \u0633\u064a\u0627\u0631\u0627\u062a"
  },
  {
    "value": "hardware",
    "label": "Hardware store",
    "labelAr": "\u0639\u062f\u062f \u0648\u0623\u062f\u0648\u0627\u062a"
  },
  {
    "value": "building_materials",
    "label": "Building materials",
    "labelAr": "\u0645\u0648\u0627\u062f \u0628\u0646\u0627\u0621"
  },
  {
    "value": "electrical_supplies",
    "label": "Electrical supplies",
    "labelAr": "\u0645\u0648\u0627\u062f \u0643\u0647\u0631\u0628\u0627\u0626\u064a\u0629"
  },
  {
    "value": "plumbing",
    "label": "Plumbing supplies",
    "labelAr": "\u0645\u0648\u0627\u062f \u0635\u062d\u064a\u0629 \u0648\u0633\u0628\u0627\u0643\u0629"
  },
  {
    "value": "tools",
    "label": "Tools & equipment",
    "labelAr": "\u0623\u062f\u0648\u0627\u062a \u0648\u0645\u0639\u062f\u0627\u062a"
  },
  {
    "value": "pharmacy",
    "label": "Pharmacy",
    "labelAr": "\u0635\u064a\u062f\u0644\u064a\u0629"
  },
  {
    "value": "pet_supplies",
    "label": "Pet supplies",
    "labelAr": "\u0645\u0633\u062a\u0644\u0632\u0645\u0627\u062a \u062d\u064a\u0648\u0627\u0646\u0627\u062a \u0623\u0644\u064a\u0641\u0629"
  },
  {
    "value": "flowers",
    "label": "Flowers",
    "labelAr": "\u0632\u0647\u0648\u0631"
  },
  {
    "value": "gifts",
    "label": "Gifts",
    "labelAr": "\u0647\u062f\u0627\u064a\u0627"
  },
  {
    "value": "toys",
    "label": "Toys",
    "labelAr": "\u0623\u0644\u0639\u0627\u0628"
  },
  {
    "value": "books_stationery",
    "label": "Books & stationery",
    "labelAr": "\u0643\u062a\u0628 \u0648\u0642\u0631\u0637\u0627\u0633\u064a\u0629"
  },
  {
    "value": "sports",
    "label": "Sports equipment",
    "labelAr": "\u0645\u0639\u062f\u0627\u062a \u0631\u064a\u0627\u0636\u064a\u0629"
  },
  {
    "value": "other",
    "label": "Other",
    "labelAr": "\u0623\u062e\u0631\u0649"
  }
] as const;

function retailFieldLabel134(value: string | null | undefined) {
  const clean = String(value ?? "").trim().toLowerCase();
  const option = RETAIL_FIELD_OPTIONS_134.find((item) => item.value === clean);
  if (option) return `${option.label} / ${option.labelAr}`;
  return clean
    ? clean
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Not selected";
}

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function activationLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    free_draft: "Payment Required / الدفع مطلوب",
    payment_review: "Payment Review / مراجعة الدفع",
    pending_review: "Payment Review / مراجعة الدفع",
    active: "Live / مباشر",
    suspended: "Suspended / موقوف",
    expired: "Expired / منتهي",
    rejected: "Payment Rejected / الدفع مرفوض",
  };
  return labels[value || "free_draft"] || "Payment Required / الدفع مطلوب";
}

function planLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    annual_1000: "300 JOD/year · 1,000 items",
    annual_3000: "400 JOD/year · 3,000 items",
    annual_10000: "500 JOD/year · 10,000 items",
    basic_monthly: "Legacy plan",
    basic_6_month: "Legacy plan",
    basic_12_month: "Legacy plan",
    premium_annual: "Legacy plan",
  };
  return value ? labels[value] || value.replace(/_/g, " ") : "No plan selected / لم يتم اختيار خطة";
}

function orderStatusLabel(value: string) {
  return orderStatusLabels[value] || value.replace(/_/g, " ");
}

export default function DarikDirectOverviewPage() {
  const [retailFieldDrafts134, setRetailFieldDrafts134] = useState<Record<string, string>>({});
  const [retailFieldOtherDrafts134, setRetailFieldOtherDrafts134] = useState<Record<string, string>>({});
  const [retailFieldSaving134, setRetailFieldSaving134] = useState(false);

  async function saveRetailField134() {
    if (!selectedStore) return;

    if (selectedStore.role !== "owner") {
      setError("Only the store owner can change the retail field.");
      return;
    }

    const retailerId = selectedStore.retailer_id;
    const currentField = String(selectedStore.business_type ?? "").trim().toLowerCase();
    const nextField = String(
      retailFieldDrafts134[retailerId] ?? currentField ?? "supermarket"
    )
      .trim()
      .toLowerCase();
    const nextOther = String(retailFieldOtherDrafts134[retailerId] ?? "").trim();

    if (!RETAIL_FIELD_OPTIONS_134.some((option) => option.value === nextField)) {
      setError("Choose a valid Darik retail field.");
      return;
    }

    if (nextField === "other" && (nextOther.length < 2 || nextOther.length > 80)) {
      setError("Describe the retail field using 2 to 80 characters.");
      return;
    }

    const currentLabel = retailFieldLabel134(currentField);
    const nextLabel = retailFieldLabel134(nextField);

    if (
      !window.confirm(
        `Change retail field from "${currentLabel}" to "${nextLabel}"?\n\nThis changes the store's product/category mechanics. Existing products and categories will be preserved. The visual storefront theme is separate and will not be changed.`
      )
    ) {
      return;
    }

    setRetailFieldSaving134(true);
    setError("");
    setMessage("");

    const result = await supabase.rpc("darik_direct_change_my_retail_field_v1", {
      p_retailer_id: retailerId,
      p_business_type: nextField,
      p_business_type_other: nextField === "other" ? nextOther : null,
    });

    if (result.error) {
      setError(result.error.message);
      setRetailFieldSaving134(false);
      return;
    }

    const categoriesAdded = Number(result.data?.categories_added ?? 0);
    setMessage(
      `Retail field changed to ${nextLabel}.${
        categoriesAdded > 0
          ? ` Darik added ${categoriesAdded} missing standard categor${categoriesAdded === 1 ? "y" : "ies"}.`
          : ""
      }`
    );

    setRetailFieldDrafts134((current) => ({
      ...current,
      [retailerId]: nextField,
    }));

    setRetailFieldSaving134(false);
  }


  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [storefront, setStorefront] = useState<StorefrontSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<DirectOrder[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [directOrderCount, setDirectOrderCount] = useState(0);
  const [directRevenue, setDirectRevenue] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [openOrderCount, setOpenOrderCount] = useState(0);
  const [loadingContext, setLoadingContext] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const authUserIdRef = useRef<string | null>(null);

  const selectedStore = useMemo(
    () =>
      context?.stores.find((store) => store.retailer_id === selectedRetailerId) ??
      null,
    [context, selectedRetailerId],
  );

  const loadContext = useCallback(async () => {
    setLoadingContext(true);
    setError("");

    const result = await supabase.rpc("darik_direct_get_my_context");

    if (result.error) {
      setError(result.error.message);
      setLoadingContext(false);
      return;
    }

    const nextContext = result.data as ContextResult;
    const stores = Array.isArray(nextContext?.stores) ? nextContext.stores : [];

    setContext({ ...nextContext, stores });
    setSelectedRetailerId((current) =>
      current && stores.some((store) => store.retailer_id === current)
        ? current
        : stores[0]?.retailer_id ?? "",
    );
    setLoadingContext(false);
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
      const accountChanged = Boolean(
        previousUserId && nextUserId && previousUserId !== nextUserId,
      );

      authUserIdRef.current = nextUserId;
      setSession(nextSession);
      setAuthReady(true);

      if (event === "SIGNED_OUT" || !nextSession || accountChanged) {
        setContext(null);
        setSelectedRetailerId("");
        setStorefront(null);
        setRecentOrders([]);
        setPreviewOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user.id) loadContext();
  }, [session?.user.id, loadContext]);

  useEffect(() => {
    if (!selectedStore) {
      setStorefront(null);
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      setLoadingSummary(true);
      setError("");

      const [
        storefrontResult,
        productResult,
        categoryResult,
        orderResult,
        recentResult,
      ] = await Promise.all([
        supabase
          .from("retailer_storefronts")
          .select("*")
          .eq("retailer_id", selectedStore.retailer_id)
          .maybeSingle(),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("retailer_id", selectedStore.retailer_id)
          .neq("direct_product_status", "archived"),
        supabase
          .from("retailer_store_categories")
          .select("id", { count: "exact", head: true })
          .eq("retailer_id", selectedStore.retailer_id)
          .neq("category_status", "archived"),
        supabase
          .from("orders")
          .select("id,order_number,customer_name,total,order_status,created_at", {
            count: "exact",
          })
          .eq("sales_channel", "direct_storefront")
          .eq("storefront_retailer_id", selectedStore.retailer_id),
        supabase
          .from("orders")
          .select("id,order_number,customer_name,total,order_status,created_at")
          .eq("sales_channel", "direct_storefront")
          .eq("storefront_retailer_id", selectedStore.retailer_id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (cancelled) return;

      if (storefrontResult.error) {
        setError(storefrontResult.error.message);
        setStorefront(null);
      } else {
        setStorefront(
          (storefrontResult.data as StorefrontSummary | null) ?? null,
        );
      }

      if (productResult.error) setError(productResult.error.message);
      if (categoryResult.error) setError(categoryResult.error.message);
      if (orderResult.error) setError(orderResult.error.message);
      if (recentResult.error) setError(recentResult.error.message);

      setProductCount(productResult.count ?? 0);
      setCategoryCount(categoryResult.count ?? 0);

      const rows = (orderResult.data ?? []) as DirectOrder[];
      const nonCancelled = rows.filter(
        (order) => order.order_status !== "cancelled",
      );
      const todayRows = nonCancelled.filter((order) => isToday(order.created_at));

      setDirectOrderCount(orderResult.count ?? rows.length);
      setDirectRevenue(
        nonCancelled.reduce(
          (sum, order) => sum + Number(order.total ?? 0),
          0,
        ),
      );
      setTodayOrderCount(todayRows.length);
      setTodayRevenue(
        todayRows.reduce((sum, order) => sum + Number(order.total ?? 0), 0),
      );
      setOpenOrderCount(
        rows.filter(
          (order) =>
            !["delivered", "cancelled"].includes(order.order_status),
        ).length,
      );
      setRecentOrders((recentResult.data ?? []) as DirectOrder[]);
      setLoadingSummary(false);
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [selectedStore]);

  const activationStatus =
    storefront?.activation_status || selectedStore?.activation_status || "free_draft";
  const isLive =
    activationStatus === "active" &&
    (!storefront?.activation_expires_at ||
      new Date(storefront.activation_expires_at) > new Date());
  const catalogUnlocked190 = isLive;

  const setupTasks = useMemo<SetupTask[]>(() => {
    const paymentReady = Boolean(
      storefront?.cash_on_delivery_enabled || storefront?.cliq_enabled,
    );

    return [
      {
        id: "activation",
        title: "Yearly plan & CliQ / الخطة السنوية وCliQ",
        detail: "Payment approval comes before catalog creation / موافقة الدفع تسبق إنشاء الكتالوج",
        href: "/store-dashboard/activation",
        action:
          activationStatus === "payment_review"
            ? "Payment under review / الدفع قيد المراجعة"
            : isLive
              ? "Plan approved / تمت الموافقة"
              : "Choose plan & pay / اختر الخطة وادفع",
        complete: isLive,
      },
      {
        id: "identity",
        title: "Store identity / هوية المتجر",
        detail: "Name, permanent link and public information / الاسم والرابط والمعلومات العامة",
        href: "/store-dashboard/storefront",
        action: "Review profile / مراجعة الملف",
        complete: Boolean(storefront?.slug && (storefront?.display_name || selectedStore?.business_name)),
      },
      {
        id: "branding",
        title: "Logo and branding / الشعار والهوية البصرية",
        detail: "Add a logo and storefront presentation / أضف الشعار ومظهر الواجهة",
        href: "/store-dashboard/storefront",
        action: "Add branding / إضافة الهوية",
        complete: Boolean(storefront?.logo_url),
      },
      {
        id: "operations",
        title: "Storefront operations / تشغيل الواجهة",
        detail: "Configure ordering, payment and delivery settings / اضبط الطلب والدفع والتوصيل",
        href: "/store-dashboard/storefront",
        action: "Configure storefront / إعداد الواجهة",
        complete: Boolean(storefront?.order_submission_mode && paymentReady),
      },
      {
        id: "categories",
        title: "Catalog structure / هيكلة الكتالوج",
        detail: catalogUnlocked190
          ? "Create customer-facing categories / أنشئ فئات للعملاء"
          : "Locked until yearly payment approval / مقفل حتى موافقة الدفع السنوي",
        href: catalogUnlocked190 ? "/store-dashboard/categories" : "/store-dashboard/activation",
        action: catalogUnlocked190 ? "Create category / إنشاء فئة" : "Locked 🔒 / مقفل",
        complete: catalogUnlocked190 && categoryCount > 0,
      },
      {
        id: "products",
        title: "Products / المنتجات",
        detail: catalogUnlocked190
          ? "Add products within your yearly plan limit / أضف المنتجات ضمن حد خطتك"
          : "Locked until yearly payment approval / مقفل حتى موافقة الدفع السنوي",
        href: catalogUnlocked190 ? "/store-dashboard/products" : "/store-dashboard/activation",
        action: catalogUnlocked190 ? "Add product / إضافة منتج" : "Locked 🔒 / مقفل",
        complete: catalogUnlocked190 && productCount > 0,
      },
    ];
  }, [activationStatus, catalogUnlocked190, categoryCount, isLive, productCount, selectedStore, storefront]);

  const completedSetupTasks = setupTasks.filter((task) => task.complete).length;
  const setupProgress = Math.round(
    (completedSetupTasks / setupTasks.length) * 100,
  );
  const incompleteTasks = setupTasks.filter((task) => !task.complete);
  const nextTask = incompleteTasks[0] ?? setupTasks[setupTasks.length - 1];

  const progressStyle = {
    "--command-progress": `${setupProgress * 3.6}deg`,
  } as CSSProperties;

  const previewForm = {
    displayName:
      storefront?.display_name || selectedStore?.business_name || "Your store",
    displayNameAr: storefront?.display_name_ar || "",
    tagline: storefront?.tagline || storefront?.tagline_ar || "",
    taglineAr: storefront?.tagline_ar || "",
    logoUrl: storefront?.logo_url || "",
    heroImageUrl: storefront?.hero_image_url || "",
    primaryColor: storefront?.primary_color || "#111827",
    accentColor: storefront?.accent_color || "#2563eb",
    backgroundColor: storefront?.background_color || "#f8fafc",
    deliveryFee: String(storefront?.delivery_fee ?? "0"),
    minimumOrder: String(storefront?.minimum_order ?? "0"),
    estimatedDeliveryMinutes: String(
      storefront?.estimated_delivery_minutes ?? "",
    ),
    phone: storefront?.business_phone || "",
    whatsapp: storefront?.whatsapp_number || "",
    addressText: storefront?.address_text || storefront?.address_text_ar || "",
    addressTextAr: storefront?.address_text_ar || "",
    aboutText: storefront?.about_text || storefront?.about_text_ar || "",
    aboutTextAr: storefront?.about_text_ar || "",
  };

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const loginValue136 = email.trim();
    let loginIdentity136 = loginValue136;

    if (loginValue136 && !loginValue136.includes("@")) {
      const identityResult136 = await supabase.rpc(
        "darik_direct_username_login_identity_v1",
        { p_username: loginValue136.toLowerCase() }
      );

      if (
        identityResult136.error ||
        typeof identityResult136.data !== "string" ||
        !identityResult136.data
      ) {
        setError("Username or password is incorrect. / اسم المستخدم أو كلمة المرور غير صحيحة.");
        return;
      }

      loginIdentity136 = identityResult136.data;
    }

    const result = await supabase.auth.signInWithPassword({
      email: loginIdentity136,
      password,
    });

    if (result.error) setError(result.error.message);
    else setMessage("Signed in successfully / تم تسجيل الدخول بنجاح");
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
            <h1>Store dashboard / لوحة المتجر</h1>
            <p>
              Sign in with your username. Older retailer accounts can still use email.
              <br />
              سجل الدخول باسم المستخدم. الحسابات القديمة يمكنها الاستمرار باستخدام البريد الإلكتروني.
            </p>
          </div>
          <form onSubmit={signIn} className={styles.loginForm}>
            <label>
              Username / Email / اسم المستخدم أو البريد الإلكتروني
              <input
                type="text"
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
          <a className={styles.marketplaceLink} href="/store-signup">
            Sign up today / سجّل اليوم
          </a>
          <a className={styles.marketplaceLink} href="/">
            Return to Darik Marketplace / العودة إلى داريك
          </a>
        </section>
      </main>
    );
  }

  if (loadingContext) {
    return (
      <main className={styles.centerPage}>
        <div className={styles.spinner} />
        <h1>Opening your command center…</h1>
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
          <a className={styles.activeNav} href="/store-dashboard">
            Overview
          </a>
          <a href="/store-dashboard/storefront">Storefront</a>
          <a href={catalogUnlocked190 ? "/store-dashboard/orders" : "/store-dashboard/activation"}>
            {catalogUnlocked190 ? "Orders" : "Orders 🔒"}
          </a>
          <a href={catalogUnlocked190 ? "/store-dashboard/products" : "/store-dashboard/activation"}>
            {catalogUnlocked190 ? "Products" : "Products 🔒"}
          </a>
          <a href={catalogUnlocked190 ? "/store-dashboard/categories" : "/store-dashboard/activation"}>
            {catalogUnlocked190 ? "Categories" : "Categories 🔒"}
          </a>
          <a href="/store-dashboard/activation">Plan & payment</a>
        </nav>
        <div className={styles.sidebarFooter}>
          <span>{session.user.user_metadata?.darik_retailer_username ? `@${session.user.user_metadata.darik_retailer_username}` : session.user.email}</span>
          <DashboardLogoutButton />
        </div>
      </aside>

      <section className={`${styles.dashboardContent} ${styles.commandContent}`}>
        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        {!selectedStore ? (
          <section className={styles.emptyState}>
            <span>No retailer membership found</span>
            <h2>This login is not connected to a Darik retailer.</h2>
            <p>
              Contact Darik support or create a new store account.
            </p>
          </section>
        ) : (
          <>
            <header className={styles.commandHero}>
              <div className={styles.commandIdentity}>
                <div className={styles.commandLogo}>
                  {storefront?.logo_url ? (
                    <img src={storefront.logo_url} alt="Store logo" />
                  ) : (
                    (selectedStore.business_name || "D").slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className={styles.commandIdentityCopy}>
                  <div className={styles.commandEyebrowRow}>
                    <span>Store command center / مركز إدارة المتجر</span>
                    <span
                      className={`${styles.commandStatusBadge} ${
                        isLive
                          ? styles.commandStatusLive
                          : styles.commandStatusDraft
                      }`}
                    >
                      {activationLabel(activationStatus)}
                    </span>
                  </div>
                  <h2>{selectedStore.business_name}</h2>
                  <div className={styles.commandLinkRow}>
                    <span>getdarik.com/</span>
                    <strong>{storefront?.slug || selectedStore.storefront_slug || "store"}</strong>
                    <span className={styles.commandLinkState}>
                      {isLive
                        ? "Public / منشور"
                        : "Coming Soon / قريباً"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.commandHeroControls}>
                {context && context.stores.length > 1 ? (
                  <label className={styles.commandStoreSwitcher}>
                    Store / المتجر
                    <select
                      value={selectedRetailerId}
                      onChange={(event) =>
                        setSelectedRetailerId(event.target.value)
                      }
                    >
                      {context.stores.map((store) => (
                        <option key={store.retailer_id} value={store.retailer_id}>
                          {store.business_name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <button
                  type="button"
                  className={styles.commandSecondaryButton}
                  onClick={() => setPreviewOpen(true)}
                  disabled={!storefront}
                >
                  Preview store / معاينة المتجر
                </button>
                <a
                  className={styles.commandSecondaryButton}
                  href={catalogUnlocked190 ? "/store-dashboard/products" : "/store-dashboard/activation"}
                >
                  {catalogUnlocked190 ? "Add product / إضافة منتج" : "Catalog locked 🔒 / الكتالوج مقفل"}
                </a>
                <a
                  className={styles.commandPrimaryButton}
                  href={
                    isLive && storefront?.slug
                      ? `/${storefront.slug}`
                      : "/store-dashboard/activation"
                  }
                  target={isLive && storefront?.slug ? "_blank" : undefined}
                  rel={isLive && storefront?.slug ? "noreferrer" : undefined}
                >
                  {isLive
                    ? "Open live store / فتح المتجر"
                    : "Plan & payment / الخطة والدفع"}
                </a>
              </div>
            </header>

            <section className={styles.commandMetricGrid} aria-label="Store performance summary">
              <article className={styles.commandMetricCard}>
                <div className={styles.commandMetricIcon}>!</div>
                <div>
                  <span>Orders requiring action / طلبات تحتاج إجراء</span>
                  <strong>{loadingSummary ? "—" : openOrderCount}</strong>
                  <p>
                    {openOrderCount > 0
                      ? "Open the orders workspace now / افتح صفحة الطلبات الآن"
                      : "Nothing waiting right now / لا توجد طلبات معلقة"}
                  </p>
                </div>
                <a href="/store-dashboard/orders">Manage / إدارة</a>
              </article>

              <article className={styles.commandMetricCard}>
                <div className={styles.commandMetricIcon}>↗</div>
                <div>
                  <span>Today&apos;s sales / مبيعات اليوم</span>
                  <strong>{loadingSummary ? "—" : money(todayRevenue)}</strong>
                  <p>{todayOrderCount} orders today / {todayOrderCount} طلب اليوم</p>
                </div>
                <a href="/store-dashboard/orders">Details / التفاصيل</a>
              </article>

              <article className={styles.commandMetricCard}>
                <div className={styles.commandMetricIcon}>□</div>
                <div>
                  <span>Published catalog / الكتالوج</span>
                  <strong>{loadingSummary ? "—" : productCount}</strong>
                  <p>{categoryCount} categories / {categoryCount} فئات</p>
                </div>
                <a href="/store-dashboard/products">Catalog / الكتالوج</a>
              </article>

              <article className={`${styles.commandMetricCard} ${styles.commandMetricAccent}`}>
                <div className={styles.commandMetricIcon}>✓</div>
                <div>
                  <span>Store readiness / جاهزية المتجر</span>
                  <strong>{loadingSummary ? "—" : `${setupProgress}%`}</strong>
                  <p>{completedSetupTasks} of {setupTasks.length} complete / اكتمل {completedSetupTasks} من {setupTasks.length}</p>
                </div>
                <a href={nextTask.href}>Continue / متابعة</a>
              </article>
            </section>


          <section className={styles.retailFieldOverviewCard}>
            <div className={styles.retailFieldOverviewHeader}>
              <div>
                <span className={styles.retailFieldOverviewEyebrow}>
                  RETAIL FIELD / نوع النشاط
                </span>
                <h3>What kind of store is this?</h3>
                <p>
                  This controls Darik mechanics such as categories, sizing, fitment,
                  and product behavior. Your visual storefront theme is separate.
                </p>
              </div>
              <span className={styles.retailFieldCurrentBadge}>
                Current: {retailFieldLabel134(
                  retailFieldDrafts134[selectedStore.retailer_id] ??
                    selectedStore.business_type
                )}
              </span>
            </div>

            {selectedStore.role === "owner" ? (
              <div className={styles.retailFieldOverviewControls}>
                <label>
                  Retail field / نوع النشاط
                  <select
                    value={
                      retailFieldDrafts134[selectedStore.retailer_id] ??
                      selectedStore.business_type ??
                      "supermarket"
                    }
                    onChange={(event) =>
                      setRetailFieldDrafts134((current) => ({
                        ...current,
                        [selectedStore.retailer_id]: event.target.value,
                      }))
                    }
                    disabled={retailFieldSaving134}
                  >
                    {!RETAIL_FIELD_OPTIONS_134.some(
                      (option) => option.value === selectedStore.business_type
                    ) && selectedStore.business_type ? (
                      <option value={selectedStore.business_type}>
                        Current legacy field: {retailFieldLabel134(selectedStore.business_type)}
                      </option>
                    ) : null}
                    {RETAIL_FIELD_OPTIONS_134.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label} / {option.labelAr}
                      </option>
                    ))}
                  </select>
                </label>

                {(retailFieldDrafts134[selectedStore.retailer_id] ??
                  selectedStore.business_type) === "other" ? (
                  <label>
                    Describe your retail field / اكتب نوع النشاط
                    <input
                      type="text"
                      maxLength={80}
                      value={
                        retailFieldOtherDrafts134[selectedStore.retailer_id] ?? ""
                      }
                      onChange={(event) =>
                        setRetailFieldOtherDrafts134((current) => ({
                          ...current,
                          [selectedStore.retailer_id]: event.target.value,
                        }))
                      }
                      placeholder="Example: Specialty medical equipment"
                      disabled={retailFieldSaving134}
                    />
                  </label>
                ) : null}

                <div className={styles.retailFieldOverviewActionRow}>
                  <div className={styles.retailFieldOverviewWarning}>
                    <strong>Changing this changes store mechanics.</strong>
                    <span>
                      Existing products/categories stay intact. Missing defaults for
                      the new field are added automatically.
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.retailFieldOverviewSave}
                    onClick={() => void saveRetailField134()}
                    disabled={retailFieldSaving134}
                  >
                    {retailFieldSaving134
                      ? "Saving retail field..."
                      : "Save retail field / حفظ نوع النشاط"}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.retailFieldOverviewOwnerOnly}>
                Only the store owner can change the retail field.
              </div>
            )}
          </section>

          <section className={styles.commandMainGrid}>
              <article className={styles.commandReadinessPanel}>
                <div className={styles.commandPanelHeader}>
                  <div>
                    <p>Store readiness / جاهزية المتجر</p>
                    <h3>Build a store customers trust</h3>
                    <span>أكمل الأساسيات قبل استقبال الطلبات</span>
                  </div>
                  <div className={styles.commandProgressRing} style={progressStyle}>
                    <div>
                      <strong>{setupProgress}%</strong>
                      <span>Complete / مكتمل</span>
                    </div>
                  </div>
                </div>

                <div className={styles.commandProgressTrack} aria-label={`${setupProgress}% complete`}>
                  <span style={{ width: `${setupProgress}%` }} />
                </div>

                <div className={styles.commandTaskList}>
                  {setupTasks.map((task) => (
                    <a
                      className={`${styles.commandTaskRow} ${
                        task.complete ? styles.commandTaskComplete : ""
                      }`}
                      href={task.href}
                      key={task.id}
                    >
                      <span className={styles.commandTaskState}>
                        {task.complete ? "✓" : ""}
                      </span>
                      <span className={styles.commandTaskCopy}>
                        <strong>{task.title}</strong>
                        <small>{task.detail}</small>
                      </span>
                      <span className={styles.commandTaskAction}>
                        {task.complete ? "Complete / مكتمل" : task.action}
                      </span>
                    </a>
                  ))}
                </div>
              </article>

              <aside className={styles.commandPulsePanel}>
                <div className={styles.commandPanelHeaderCompact}>
                  <div>
                    <p>Store pulse / حالة المتجر</p>
                    <h3>Operational snapshot</h3>
                  </div>
                  <span className={isLive ? styles.commandPulseLive : styles.commandPulseDraft}>
                    {isLive ? "LIVE" : "DRAFT"}
                  </span>
                </div>

                <div className={styles.commandPulseList}>
                  <div>
                    <span>Public page / الصفحة العامة</span>
                    <strong>{isLive ? "Visible / ظاهرة" : "Coming Soon / قريباً"}</strong>
                  </div>
                  <div>
                    <span>Ordering / استقبال الطلبات</span>
                    <strong>
                      {storefront?.is_accepting_orders
                        ? "Accepting / يستقبل"
                        : "Paused / متوقف"}
                    </strong>
                  </div>
                  <div>
                    <span>Customer payments / دفع العملاء</span>
                    <strong>
                      {storefront?.cash_on_delivery_enabled && storefront?.cliq_enabled
                        ? "Cash + CliQ / كاش + كليك"
                        : storefront?.cliq_enabled
                          ? "CliQ / كليك"
                          : storefront?.cash_on_delivery_enabled
                            ? "Cash / كاش"
                            : "Not configured / غير معدّ"}
                    </strong>
                  </div>
                  <div>
                    <span>Delivery radius / نطاق التوصيل</span>
                    <strong>
                      {storefront?.delivery_radius_km
                        ? `${storefront.delivery_radius_km} km`
                        : "Not set / غير محدد"}
                    </strong>
                  </div>
                  <div>
                    <span>Activation plan / خطة التفعيل</span>
                    <strong>{planLabel(storefront?.activation_plan || selectedStore.activation_plan)}</strong>
                  </div>
                  <div>
                    <span>All-time direct sales / إجمالي المبيعات</span>
                    <strong>{money(directRevenue)}</strong>
                  </div>
                </div>

                <a className={styles.commandPulseAction} href={nextTask.href}>
                  <span>Recommended next step / الخطوة التالية</span>
                  <strong>{nextTask.title}</strong>
                  <small>{nextTask.action} →</small>
                </a>
              </aside>
            </section>

            <section className={styles.commandActivityPanel}>
              <div className={styles.commandActivityHeader}>
                <div>
                  <p>Recent activity / آخر النشاطات</p>
                  <h3>Orders and store activity</h3>
                  <span>الطلبات وآخر ما يحدث في متجرك</span>
                </div>
                <div className={styles.commandActivityMeta}>
                  <strong>{directOrderCount} total orders / إجمالي الطلبات</strong>
                  <a href="/store-dashboard/orders">View all orders / عرض الكل</a>
                </div>
              </div>

              {loadingSummary ? (
                <div className={styles.commandActivityLoading}>
                  <span />
                  <span />
                  <span />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className={styles.commandActivityEmpty}>
                  <div className={styles.commandEmptyVisual}>
                    <span>01</span>
                    <span>02</span>
                    <span>03</span>
                  </div>
                  <div>
                    <p>YOUR STORE IS IN SETUP MODE / متجرك في مرحلة الإعداد</p>
                    <h4>Your first order starts with a complete storefront.</h4>
                    <span>
                      Finish the recommended steps, preview the customer experience,
                      then activate your store.
                      <br />
                      أكمل الخطوات، عاين تجربة العميل، ثم فعّل متجرك.
                    </span>
                  </div>
                  <div className={styles.commandEmptyActions}>
                    <a href={nextTask.href}>{nextTask.action}</a>
                    <button type="button" onClick={() => setPreviewOpen(true)}>
                      Preview store / معاينة المتجر
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.commandOrderList}>
                  {recentOrders.map((order) => (
                    <a
                      className={styles.commandOrderRow}
                      href="/store-dashboard/orders"
                      key={order.id}
                    >
                      <span className={styles.commandOrderNumber}>
                        {order.order_number || `#${order.id.slice(0, 8)}`}
                      </span>
                      <span className={styles.commandOrderCustomer}>
                        <strong>{order.customer_name}</strong>
                        <small>{new Date(order.created_at).toLocaleString()}</small>
                      </span>
                      <span className={styles.commandOrderStatus}>
                        {orderStatusLabel(order.order_status)}
                      </span>
                      <strong className={styles.commandOrderTotal}>
                        {money(order.total)}
                      </strong>
                      <span className={styles.commandOrderArrow}>→</span>
                    </a>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      {selectedStore && storefront ? (
        <StorefrontPreviewModal
          open={previewOpen}
          retailerId={selectedStore.retailer_id}
          form={previewForm}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </main>
  );
}
