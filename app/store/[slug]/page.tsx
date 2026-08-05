"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./storefront.module.css";

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
  pickup_enabled: boolean;
  order_submission_mode: "phone" | "online" | "both";
  business_name: string;
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
  official_product_photo_url: string | null;
  official_product_thumbnail_url: string | null;
  official_product_photo_url_2: string | null;
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
  return String(value ?? "").replace(/\D/g, "");
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

export default function DarikDirectStorefrontPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = normalizeParam(params?.slug);

  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [publicStatus, setPublicStatus] = useState<PublicStoreStatus | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [onlineCheckoutOpen, setOnlineCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<OnlineCheckoutForm>({
    customerName: "",
    customerPhone: "",
    buildingNumber: "",
    apartmentNumber: "",
    deliveryNote: "",
    paymentMethod: "cash",
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
  } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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
      const currentAllowed =
        (current.paymentMethod === "cash" &&
          storefront.cash_on_delivery_enabled) ||
        (current.paymentMethod === "cliq" && storefront.cliq_enabled);

      if (currentAllowed) return current;

      return {
        ...current,
        paymentMethod: storefront.cash_on_delivery_enabled
          ? "cash"
          : "cliq",
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

  const filteredProducts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      if (
        selectedCategoryId !== "all" &&
        product.direct_store_category_id !== selectedCategoryId
      ) {
        return false;
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
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(cleanSearch));
    });
  }, [products, search, selectedCategoryId]);

  const featuredProducts = useMemo(() => {
    if (selectedCategoryId !== "all" || search.trim()) return [];
    return products.filter((product) => product.storefront_featured).slice(0, 8);
  }, [products, search, selectedCategoryId]);

  const catalogProducts = useMemo(() => {
    if (featuredProducts.length === 0) return filteredProducts;
    const featuredIds = new Set(featuredProducts.map((product) => product.id));
    return filteredProducts.filter((product) => !featuredIds.has(product.id));
  }, [featuredProducts, filteredProducts]);

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, line) => total + line.price * line.quantity, 0),
    [cart]
  );

  const deliveryFee = Number(storefront?.delivery_fee ?? 0);
  const orderTotal = cartSubtotal + deliveryFee;
  const minimumOrder = Number(storefront?.minimum_order ?? 0);
  const minimumReached = cartSubtotal >= minimumOrder;

  function addToCart(product: Product) {
    setOrderConfirmation(null);
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
      checkoutForm.latitude == null ||
      checkoutForm.longitude == null
    ) {
      setCheckoutError("Use exact location before placing the order.");
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

      const result = await supabase.rpc("darik_direct_place_online_order_v2", {
        p_storefront_slug: storefront.slug,
        p_customer_name: customerName,
        p_customer_phone: customerPhone,
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
      } | null;

      setOrderConfirmation({
        orderNumber: response?.order_number || "Order received",
        total: Number(response?.total ?? orderTotal),
        paymentMethod:
          response?.payment_method ?? checkoutForm.paymentMethod,
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

  const themeStyle = {
    "--store-primary": storefront.primary_color || "#111827",
    "--store-accent": storefront.accent_color || "#2563EB",
    "--store-background": storefront.background_color || "#F8FAFC",
  } as CSSProperties;

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
      detail: storefront.business_phone || "",
      href: phoneHref(storefront.business_phone) || "",
      icon: "call",
    },
    {
      label: "WhatsApp",
      labelAr: "واتساب",
      detail: storefront.whatsapp_number || "",
      href: whatsappHref(storefront.whatsapp_number) || "",
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

  const orderMessage = [
    `Hello ${storefront.display_name}, I would like to place this order:`,
    "",
    ...cart.map(
      (line) =>
        `${line.quantity} × ${line.name} — ${money(line.price * line.quantity)}`
    ),
    "",
    `Subtotal: ${money(cartSubtotal)}`,
    `Delivery: ${money(deliveryFee)}`,
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
    orderSubmissionMode === "phone" || orderSubmissionMode === "both";
  const onlinePaymentAvailable =
    storefront.cash_on_delivery_enabled || storefront.cliq_enabled;
  const onlineOrderingEnabled =
    (orderSubmissionMode === "online" || orderSubmissionMode === "both") &&
    onlinePaymentAvailable;

  const selectedCategory = visibleCategories.find(
    (category) => category.id === selectedCategoryId
  );

  function renderProductCard(product: Product) {
    const name = productName(product);
    const photo = productPhoto(product);
    const stock = Number(product.quantity_in_stock ?? 0);
    const inCart = cart.find((line) => line.productId === product.id)?.quantity ?? 0;

    return (
      <article className={styles.productCard} key={product.id}>
        <div className={styles.productImage}>
          {photo ? (
            <img src={photo} alt={name} />
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
            {product.direct_inventory_tracking_enabled && stock <= 3 ? (
              <strong className={styles.stockTag}>Only {stock} left</strong>
            ) : null}
          </div>
        </div>

        <div className={styles.productBody}>
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

          {product.description ? (
            <p className={styles.productDescription}>{product.description}</p>
          ) : null}

          <div className={styles.productFooter}>
            <div>
              <strong>{money(product.app_price)}</strong>
              {inCart > 0 ? <span>{inCart} in cart</span> : null}
            </div>

            <button
              aria-label={`Add ${name} to cart`}
              disabled={!storefront.is_accepting_orders}
              onClick={() => addToCart(product)}
            >
              <Icon name="plus" size={19} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className={styles.page} style={themeStyle}>
      <div className={styles.announcementBar}>
        <span>
          <i className={storefront.is_accepting_orders ? styles.liveDot : styles.pausedDot} />
          {storefront.is_accepting_orders
            ? "This store is accepting orders"
            : "Browse now — ordering is temporarily paused"}
        </span>
        <a href="/">Powered by Darik</a>
      </div>

      <header className={styles.header}>
        <a className={styles.storeIdentity} href={`/store/${storefront.slug}`}>
          <div className={styles.headerLogo}>
            {storefront.logo_url ? (
              <img src={storefront.logo_url} alt="" />
            ) : (
              <span>{storefront.display_name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div>
            <strong>{storefront.display_name}</strong>
            <span>Darik Direct store</span>
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
          <button className={styles.cartButton} onClick={() => setCartOpen(true)}>
            <Icon name="bag" size={19} />
            <span>Cart</span>
            <strong>{cartCount}</strong>
          </button>
        </nav>
      </header>

      <section
        className={`${styles.hero} ${
          storefront.hero_image_url ? styles.heroWithImage : styles.heroWithoutImage
        }`}
        style={heroStyle}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroTexture} />

        <div className={styles.heroContent}>
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
              Independent store on Darik
            </div>
            <h1>{storefront.display_name}</h1>
            {storefront.display_name_ar ? (
              <p className={styles.arabicName} dir="rtl">
                {storefront.display_name_ar}
              </p>
            ) : null}
            <p className={styles.tagline}>
              {storefront.tagline || "Everything you need, delivered from a local store."}
            </p>
            {storefront.tagline_ar ? (
              <p className={styles.arabicTagline} dir="rtl">
                {storefront.tagline_ar}
              </p>
            ) : null}

            <div className={styles.heroButtons}>
              <button className={styles.primaryHeroButton} onClick={jumpToCatalog}>
                Browse products
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
              <i className={storefront.is_accepting_orders ? styles.liveDot : styles.pausedDot} />
              Order status
            </span>
            <strong>
              {storefront.is_accepting_orders ? "Open now" : "Orders paused"}
            </strong>
          </div>

          <div className={styles.snapshotGrid}>
            <div>
              <Icon name="clock" size={20} />
              <span>Estimated delivery</span>
              <strong>
                {storefront.estimated_delivery_minutes
                  ? `${storefront.estimated_delivery_minutes} min`
                  : "Store estimate"}
              </strong>
            </div>
            <div>
              <Icon name="truck" size={20} />
              <span>Delivery fee</span>
              <strong>{money(storefront.delivery_fee)}</strong>
            </div>
            <div>
              <Icon name="bag" size={20} />
              <span>Minimum order</span>
              <strong>
                {minimumOrder > 0 ? money(minimumOrder) : "No minimum"}
              </strong>
            </div>
            <div>
              <Icon name="clock" size={20} />
              <span>Today</span>
              <strong>{currentDayHours || "See store hours"}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.quickInfoStrip}>
        {(storefront.address_text || storefront.address_text_ar) ? (
          <button onClick={() => setDetailsOpen(true)}>
            <span className={styles.quickIcon}>
              <Icon name="location" size={18} />
            </span>
            <span>
              <small>Store location / موقع المتجر</small>
              {storefront.address_text ? (
                <strong>{storefront.address_text}</strong>
              ) : null}
              {storefront.address_text_ar ? (
                <strong dir="rtl">{storefront.address_text_ar}</strong>
              ) : null}
            </span>
          </button>
        ) : null}

        {contactLinks.slice(0, 4).map((link) => (
          <a
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

      {visibleCategories.length > 0 ? (
        <section className={styles.categorySection}>
          <div className={styles.sectionHeading}>
            <div>
              <span>Shop your way</span>
              <h2>Browse categories</h2>
            </div>
            <button onClick={jumpToCatalog}>View all products</button>
          </div>

          <div className={styles.categoryScroller}>
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
              <span>All products</span>
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
                {category.name_ar ? (
                  <em dir="rtl">{category.name_ar}</em>
                ) : (
                  <small>{Number(category.product_count ?? 0)} items</small>
                )}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.catalogShell} id="catalog">
        <div className={styles.catalogTopbar}>
          <div>
            <span>Shop {storefront.display_name}</span>
            <h2>
              {selectedCategory ? selectedCategory.name : "All products"}
            </h2>
          </div>

          <label className={styles.searchBox}>
            <Icon name="search" size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search this store"
            />
            {search ? (
              <button type="button" onClick={() => setSearch("")}>
                <Icon name="close" size={16} />
              </button>
            ) : null}
          </label>
        </div>

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

        {featuredProducts.length > 0 ? (
          <section className={styles.productSection}>
            <div className={styles.productSectionHeading}>
              <div>
                <span>Handpicked by the store</span>
                <h3>Featured products</h3>
              </div>
              <small>{featuredProducts.length} featured</small>
            </div>
            <div className={styles.productGrid}>
              {featuredProducts.map(renderProductCard)}
            </div>
          </section>
        ) : null}

        <section className={styles.productSection}>
          <div className={styles.productSectionHeading}>
            <div>
              <span>{search ? `Results for “${search}”` : "Store catalog"}</span>
              <h3>
                {featuredProducts.length > 0 ? "More to explore" : "Products"}
              </h3>
            </div>
            <small>{filteredProducts.length} available</small>
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
                  }}
                >
                  Clear filters
                </button>
              ) : contactLinks[0] ? (
                <a href={contactLinks[0].href}>Contact the store</a>
              ) : null}
            </div>
          ) : catalogProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {catalogProducts.map(renderProductCard)}
            </div>
          ) : null}
        </section>
      </section>

      <section className={styles.storeStory}>
        <div className={styles.storyCopy}>
          <span>About this store</span>
          <h2>Shop local with confidence</h2>
          <p>
            {storefront.about_text ||
              `${storefront.display_name} is an independent local business serving customers through Darik Direct.`}
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
            <strong>{products.length}</strong>
            <span>Available products</span>
          </article>
          <article>
            <strong>{visibleCategories.length}</strong>
            <span>Store categories</span>
          </article>
          <article>
            <strong>
              {storefront.estimated_delivery_minutes
                ? `${storefront.estimated_delivery_minutes}m`
                : "Local"}
            </strong>
            <span>Delivery estimate</span>
          </article>
          <article>
            <strong>{storefront.pickup_enabled ? "Yes" : "Delivery"}</strong>
            <span>{storefront.pickup_enabled ? "Pickup available" : "Order method"}</span>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
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

      {cartCount > 0 ? (
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

      {detailsOpen ? (
        <div className={styles.modalOverlay} onClick={() => setDetailsOpen(false)}>
          <section
            className={styles.detailsModal}
            onClick={(event) => event.stopPropagation()}
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
                  <strong>{storefront.display_name}</strong>
                </span>
              </div>
              <button onClick={() => setDetailsOpen(false)}>
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
                  {orderConfirmation.paymentMethod === "cliq"
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
                    <span>Delivery</span>
                    <strong>{money(deliveryFee)}</strong>
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
                          <h3>Delivery details</h3>
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
                              <small>Pay on delivery</small>
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

                      <div className={styles.exactLocationBlock}>
                        <div>
                          <strong>Exact delivery location</strong>
                          <small>Required for every online order</small>
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

                      <label>
                        Extra delivery details <small>Optional</small>
                        <textarea
                          value={checkoutForm.deliveryNote}
                          onChange={(event) =>
                            updateCheckoutField(
                              "deliveryNote",
                              event.target.value
                            )
                          }
                          placeholder="Floor, entrance, landmark or delivery instructions"
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
                            ? `Submit CliQ order · ${money(orderTotal)}`
                            : `Place cash order · ${money(orderTotal)}`}
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
                      ? storefront.cash_on_delivery_enabled && storefront.cliq_enabled
                        ? "This store accepts cash on delivery and CliQ for online orders."
                        : storefront.cliq_enabled
                          ? "This store accepts CliQ for online orders."
                          : "This store accepts cash on delivery for online orders."
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
