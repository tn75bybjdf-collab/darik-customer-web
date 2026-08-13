"use client";

// DARIK_ROOT_LINKS_027

// DARIK_DISCOVERY_HOME_026
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./home.module.css";

type Language = "en" | "ar";
type CategoryKey =
  | "all"
  | "groceries"
  | "food"
  | "pharmacy"
  | "fashion"
  | "beauty"
  | "technology"
  | "home"
  | "automotive"
  | "lifestyle";

type CustomerLocation = {
  latitude: number;
  longitude: number;
  label: string;
  placeId?: string | null;
  source: "gps" | "google_search";
};

type PlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

type NearbyStore = {
  storefront_id: string;
  slug: string;
  display_name: string | null;
  display_name_ar: string | null;
  tagline: string | null;
  tagline_ar: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  primary_color: string | null;
  accent_color: string | null;
  background_color: string | null;
  retail_field: string | null;
  retail_field_other: string | null;
  public_address: string | null;
  public_address_ar: string | null;
  is_accepting_orders: boolean | null;
  show_ordering: boolean | null;
  minimum_order: number | string | null;
  delivery_fee: number | string | null;
  delivery_radius_km: number | string | null;
  estimated_delivery_minutes: number | null;
  cash_on_delivery_enabled: boolean | null;
  cliq_enabled: boolean | null;
  card_enabled: boolean | null;
  pickup_enabled: boolean | null;
  distance_km: number | string;
};

type IconName =
  | "arrow"
  | "auto"
  | "beauty"
  | "check"
  | "chevron"
  | "clock"
  | "food"
  | "grid"
  | "grocery"
  | "heart"
  | "home"
  | "language"
  | "location"
  | "menu"
  | "pharmacy"
  | "search"
  | "shop"
  | "sparkle"
  | "technology"
  | "user"
  | "fashion";

const STORAGE_LOCATION_KEY = "darik_delivery_location_v1";
// DARIK_FRESH_CUSTOMER_LOCATION_ONE_TIME_HANDOFF_117
const DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117 = "darik_marketplace_location_handoff_117";
const STORAGE_LANGUAGE_KEY = "darik_marketplace_language_v1";

const categoryGroups: Array<{
  key: CategoryKey;
  labelEn: string;
  labelAr: string;
  icon: IconName;
  types: string[];
}> = [
  { key: "all", labelEn: "All stores", labelAr: "كل المتاجر", icon: "grid", types: [] },
  {
    key: "groceries",
    labelEn: "Groceries",
    labelAr: "بقالة وتموين",
    icon: "grocery",
    types: ["supermarket", "grocery", "mini_market", "butcher", "produce", "frozen_food"],
  },
  {
    key: "food",
    labelEn: "Food & cafés",
    labelAr: "مطاعم ومقاهي",
    icon: "food",
    types: ["restaurant", "fast_food", "bakery", "cafe"],
  },
  { key: "pharmacy", labelEn: "Pharmacy", labelAr: "صيدليات", icon: "pharmacy", types: ["pharmacy"] },
  {
    key: "fashion",
    labelEn: "Fashion",
    labelAr: "أزياء",
    icon: "fashion",
    types: ["clothing", "shoes", "jewelry"],
  },
  {
    key: "beauty",
    labelEn: "Beauty",
    labelAr: "جمال وعناية",
    icon: "beauty",
    types: ["cosmetics", "perfume"],
  },
  {
    key: "technology",
    labelEn: "Technology",
    labelAr: "تكنولوجيا",
    icon: "technology",
    types: ["electronics", "computers", "mobile_phones"],
  },
  {
    key: "home",
    labelEn: "Home & tools",
    labelAr: "المنزل والأدوات",
    icon: "home",
    types: [
      "furniture",
      "home_appliances",
      "home_decor",
      "hardware",
      "building_materials",
      "electrical_supplies",
      "plumbing",
      "tools",
    ],
  },
  {
    key: "automotive",
    labelEn: "Automotive",
    labelAr: "السيارات",
    icon: "auto",
    types: ["auto_parts", "tires"],
  },
  {
    key: "lifestyle",
    labelEn: "More",
    labelAr: "المزيد",
    icon: "heart",
    types: ["pet_supplies", "flowers", "gifts", "toys", "books_stationery", "sports", "other"],
  },
];

const businessTypeLabels: Record<string, { en: string; ar: string }> = {
  supermarket: { en: "Supermarket / Hypermarket", ar: "سوبرماركت / هايبرماركت" },
  grocery: { en: "Grocery store", ar: "بقالة" },
  mini_market: { en: "Mini-market", ar: "ميني ماركت / تموينات" },
  restaurant: { en: "Restaurant", ar: "مطعم" },
  fast_food: { en: "Fast food", ar: "وجبات سريعة" },
  bakery: { en: "Bakery / Sweets", ar: "مخبز / حلويات" },
  cafe: { en: "Café", ar: "مقهى / كوفي شوب" },
  butcher: { en: "Butcher", ar: "ملحمة" },
  produce: { en: "Fruit and vegetables", ar: "خضار وفواكه" },
  frozen_food: { en: "Frozen food", ar: "مواد غذائية مجمدة" },
  clothing: { en: "Clothing", ar: "ملابس" },
  shoes: { en: "Shoes", ar: "أحذية" },
  jewelry: { en: "Jewelry", ar: "مجوهرات" },
  cosmetics: { en: "Cosmetics / Beauty", ar: "مستحضرات تجميل / عناية" },
  perfume: { en: "Perfume", ar: "عطور" },
  electronics: { en: "Electronics", ar: "إلكترونيات" },
  computers: { en: "Computers", ar: "كمبيوتر" },
  mobile_phones: { en: "Mobile phones", ar: "هواتف وإكسسوارات" },
  furniture: { en: "Furniture", ar: "أثاث" },
  home_appliances: { en: "Home appliances", ar: "أجهزة منزلية" },
  home_decor: { en: "Home décor", ar: "ديكور منزلي" },
  auto_parts: { en: "Auto parts", ar: "قطع سيارات" },
  tires: { en: "Tires & accessories", ar: "إطارات وإكسسوارات سيارات" },
  hardware: { en: "Hardware store", ar: "عدد وأدوات" },
  building_materials: { en: "Building materials", ar: "مواد بناء" },
  electrical_supplies: { en: "Electrical supplies", ar: "مواد كهربائية" },
  plumbing: { en: "Plumbing supplies", ar: "مواد صحية وسباكة" },
  tools: { en: "Tools and equipment", ar: "أدوات ومعدات" },
  pharmacy: { en: "Pharmacy", ar: "صيدلية" },
  pet_supplies: { en: "Pet supplies", ar: "مستلزمات حيوانات أليفة" },
  flowers: { en: "Flowers", ar: "زهور" },
  gifts: { en: "Gifts", ar: "هدايا" },
  toys: { en: "Toys", ar: "ألعاب" },
  books_stationery: { en: "Books & stationery", ar: "كتب وقرطاسية" },
  sports: { en: "Sports equipment", ar: "معدات رياضية" },
  other: { en: "Local store", ar: "متجر محلي" },
};

const copy = {
  en: {
    stores: "Stores",
    how: "How it works",
    pricing: "Pricing",
    retailerSignup: "Sell on Darik",
    dashboard: "Retailer dashboard",
    eyebrow: "LOCAL SHOPPING, FINALLY CONNECTED",
    heroTitleA: "Everything nearby.",
    heroTitleB: "Delivered.",
    heroBody: "Discover local stores that actually deliver to your address—groceries, pharmacies, fashion, electronics, auto parts, and more.",
    useLocation: "Use my location",
    changeLocation: "Change",
    searchPlaceholder: "Search stores near you",
    locationNeeded: "Set your delivery location to see stores that can reach you.",
    deliveringTo: "Delivering to",
    nearbyStores: "Stores delivering to you",
    nearbyBody: "Only retailers whose configured delivery zone reaches your location are shown.",
    store: "store",
    storesCount: "stores",
    seeAll: "See all",
    open: "Accepting orders",
    closed: "Orders paused",
    showcase: "Website & catalog",
    browseCatalog: "Browse catalog",
    contactStore: "Contact store",
    delivery: "delivery",
    free: "Free",
    min: "min",
    minimum: "minimum",
    away: "away",
    shopStore: "Shop store",
    noStoresTitle: "No stores are reaching this location yet",
    noStoresBody: "Try another nearby address, or check back as more local retailers join Darik.",
    setLocation: "Set delivery location",
    locationTitle: "Where should we deliver?",
    locationBody: "Darik uses your location only to show stores whose delivery range reaches you.",
    currentLocation: "Use current location",
    locating: "Finding your location…",
    orSearch: "or search for an address",
    addressPlaceholder: "Area, street, landmark, or building",
    search: "Search",
    searching: "Searching…",
    privacy: "Your exact location is not displayed to retailers until you place an order.",
    close: "Close",
    invalidLocation: "We could not determine that location. Try searching for your address.",
    browserDenied: "Location access was not granted. Search for your address instead.",
    discovery: "One address. Every store that can reach it.",
    discoveryBody: "Darik checks each retailer’s delivery radius, then organizes eligible stores into simple shopping fields.",
    stepOne: "Share your location",
    stepOneBody: "Use GPS or search for an address anywhere in the retailer’s service area.",
    stepTwo: "Choose a retail field",
    stepTwoBody: "Browse groceries, pharmacies, fashion, technology, automotive, and more.",
    stepThree: "Order from the store",
    stepThreeBody: "Enter the retailer’s own storefront, add products, and complete your order.",
    retailerEyebrow: "BUILT FOR JORDANIAN RETAILERS",
    retailerTitle: "Your store. Your products. Your customers.",
    retailerBody: "Create a branded storefront, define your delivery range, receive orders, and get discovered automatically by nearby customers.",
    startFree: "Create your free store",
    openDashboard: "Open retailer dashboard",
    plansTitle: "Simple plans for serious local businesses",
    plansBody: "Build privately for free. Activate the public storefront after your CliQ payment is reviewed by Darik.",
    monthly: "Monthly",
    sixMonths: "Six months",
    annual: "Annual Basic",
    premium: "Annual Premium",
    perMonth: "per month",
    onePayment: "one payment",
    bestValue: "Best value",
    premiumBadge: "Premium",
    basicFeatures: "Storefront, catalog, delivery range, orders, and dashboard",
    premiumFeatures: "Everything in Basic plus custom-domain preference setup",
    choosePlan: "Start building free",
    footerBody: "Darik connects customers with local stores that deliver to them.",
    retailerLinks: "Retailers",
    platformLinks: "Platform",
    rights: "Darik Technologies. All rights reserved.",
    locationRequired: "Location required",
    locationRequiredBody: "Darik never guesses. We show a store only when your address is inside that retailer’s configured delivery range.",
    loadingStores: "Checking delivery zones near you…",
    loadError: "We could not load nearby stores right now.",
    retry: "Try again",
  },
  ar: {
    stores: "المتاجر",
    how: "كيف تعمل",
    pricing: "الأسعار",
    retailerSignup: "بع على داريك",
    dashboard: "لوحة التاجر",
    eyebrow: "التسوق المحلي صار أسهل",
    heroTitleA: "كل شيء قريب منك.",
    heroTitleB: "يوصل لعندك.",
    heroBody: "اكتشف المتاجر المحلية التي توصل فعلياً إلى عنوانك—بقالة، صيدليات، أزياء، إلكترونيات، قطع سيارات والمزيد.",
    useLocation: "استخدم موقعي",
    changeLocation: "تغيير",
    searchPlaceholder: "ابحث عن متجر قريب",
    locationNeeded: "حدد موقع التوصيل حتى نعرض المتاجر التي تصل إليك.",
    deliveringTo: "التوصيل إلى",
    nearbyStores: "متاجر توصل إلى موقعك",
    nearbyBody: "نعرض فقط المتاجر التي تشمل منطقتك ضمن نطاق التوصيل المحدد لديها.",
    store: "متجر",
    storesCount: "متاجر",
    seeAll: "عرض الكل",
    open: "يستقبل طلبات",
    closed: "الطلبات متوقفة",
    showcase: "موقع وكتالوج",
    browseCatalog: "تصفح الكتالوج",
    contactStore: "تواصل مع المتجر",
    delivery: "توصيل",
    free: "مجاني",
    min: "دقيقة",
    minimum: "حد أدنى",
    away: "منك",
    shopStore: "تسوق من المتجر",
    noStoresTitle: "لا توجد متاجر توصل إلى هذا الموقع حالياً",
    noStoresBody: "جرّب عنواناً قريباً أو ارجع لاحقاً مع انضمام المزيد من المتاجر المحلية إلى داريك.",
    setLocation: "حدد موقع التوصيل",
    locationTitle: "وين بدك التوصيل؟",
    locationBody: "يستخدم داريك موقعك فقط لعرض المتاجر التي يصل نطاق توصيلها إليك.",
    currentLocation: "استخدم موقعي الحالي",
    locating: "جاري تحديد موقعك…",
    orSearch: "أو ابحث عن عنوان",
    addressPlaceholder: "المنطقة، الشارع، معلم أو بناية",
    search: "بحث",
    searching: "جاري البحث…",
    privacy: "لن يظهر موقعك الدقيق للتاجر إلا عند تنفيذ طلب.",
    close: "إغلاق",
    invalidLocation: "تعذر تحديد الموقع. ابحث عن عنوانك يدوياً.",
    browserDenied: "لم يتم السماح بالوصول للموقع. ابحث عن عنوانك بدلاً من ذلك.",
    discovery: "عنوان واحد. كل متجر يقدر يوصل له.",
    discoveryBody: "يفحص داريك نطاق توصيل كل متجر، ثم يرتب المتاجر المؤهلة ضمن مجالات تسوق واضحة.",
    stepOne: "شارك موقعك",
    stepOneBody: "استخدم GPS أو ابحث عن عنوان داخل منطقة خدمة المتجر.",
    stepTwo: "اختر مجال التسوق",
    stepTwoBody: "تصفح البقالة، الصيدليات، الأزياء، التكنولوجيا، السيارات والمزيد.",
    stepThree: "اطلب من المتجر",
    stepThreeBody: "ادخل واجهة المتجر، أضف المنتجات وأكمل طلبك.",
    retailerEyebrow: "مصمم للتجار في الأردن",
    retailerTitle: "متجرك. منتجاتك. زبائنك.",
    retailerBody: "أنشئ واجهة باسم متجرك، حدد نطاق التوصيل، استقبل الطلبات واظهر تلقائياً للزبائن القريبين.",
    startFree: "أنشئ متجرك مجاناً",
    openDashboard: "افتح لوحة التاجر",
    plansTitle: "خطط واضحة للأعمال المحلية الجادة",
    plansBody: "ابنِ متجرك بشكل خاص مجاناً، ثم فعّله للعامة بعد مراجعة دفعة CliQ من داريك.",
    monthly: "شهري",
    sixMonths: "ستة أشهر",
    annual: "أساسي سنوي",
    premium: "بريميوم سنوي",
    perMonth: "شهرياً",
    onePayment: "دفعة واحدة",
    bestValue: "أفضل قيمة",
    premiumBadge: "بريميوم",
    basicFeatures: "واجهة متجر، كتالوج، نطاق توصيل، طلبات ولوحة تحكم",
    premiumFeatures: "كل ميزات الأساسي مع إعداد تفضيلات نطاق مخصص",
    choosePlan: "ابدأ البناء مجاناً",
    footerBody: "داريك يربط الزبائن بالمتاجر المحلية التي توصل إليهم.",
    retailerLinks: "للتجار",
    platformLinks: "المنصة",
    rights: "داريك تكنولوجيز. جميع الحقوق محفوظة.",
    locationRequired: "الموقع مطلوب",
    locationRequiredBody: "داريك لا يخمّن. لا يظهر المتجر إلا عندما يكون عنوانك داخل نطاق التوصيل الذي حدده التاجر.",
    loadingStores: "جاري فحص نطاقات التوصيل القريبة…",
    loadError: "تعذر تحميل المتاجر القريبة حالياً.",
    retry: "إعادة المحاولة",
  },
} as const;

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
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

  if (name === "arrow") return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  if (name === "chevron") return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  if (name === "clock") return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  if (name === "location") return <svg {...common}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></svg>;
  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (name === "language") return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>;
  if (name === "user") return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>;
  if (name === "menu") return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === "grid") return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></svg>;
  if (name === "grocery") return <svg {...common}><path d="M4 9h16l-1 11H5L4 9Z" /><path d="M8 9a4 4 0 0 1 8 0M8 13h.01M12 13h.01M16 13h.01" /></svg>;
  if (name === "food") return <svg {...common}><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3c-2 3-2 7 0 9v9M16 3c4 2 4 7 0 9" /></svg>;
  if (name === "pharmacy") return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 8v8M8 12h8" /></svg>;
  if (name === "fashion") return <svg {...common}><path d="m8 5 4-2 4 2 4 3-3 4-2-2v11H9V10l-2 2-3-4 4-3Z" /></svg>;
  if (name === "beauty") return <svg {...common}><path d="M12 3c4 2 6 5 6 9a6 6 0 0 1-12 0c0-4 2-7 6-9Z" /><path d="M9 14c2 1 4 1 6 0" /></svg>;
  if (name === "technology") return <svg {...common}><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
  if (name === "home") return <svg {...common}><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></svg>;
  if (name === "auto") return <svg {...common}><path d="m5 11 2-5h10l2 5M4 11h16v7H4z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
  if (name === "heart") return <svg {...common}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
  if (name === "shop") return <svg {...common}><path d="M4 10h16l-1 11H5L4 10Z" /><path d="M7 10V7a5 5 0 0 1 10 0v3" /></svg>;
  return <svg {...common}><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></svg>;
}

function safeColor(value: string | null | undefined, fallback: string) {
  const candidate = value?.trim() || "";
  return /^#[0-9a-f]{3,8}$/i.test(candidate) ? candidate : fallback;
}

function safeImageUrl(value: string | null | undefined) {
  const candidate = value?.trim() || "";
  if (!candidate) return "";
  if (candidate.startsWith("/")) return candidate;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? candidate : "";
  } catch {
    return "";
  }
}

function money(value: number | string | null | undefined) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "0.00";
  return numeric.toFixed(numeric % 1 === 0 ? 0 : 2);
}

function storeGroupKey(store: NearbyStore): CategoryKey {
  const type = store.retail_field || "other";
  return categoryGroups.find((group) => group.key !== "all" && group.types.includes(type))?.key || "lifestyle";
}

function categoryLabel(group: (typeof categoryGroups)[number], language: Language) {
  return language === "ar" ? group.labelAr : group.labelEn;
}

function retailFieldLabel(store: NearbyStore, language: Language) {
  const type = store.retail_field || "other";
  if (type === "other" && store.retail_field_other?.trim()) return store.retail_field_other.trim();
  return businessTypeLabels[type]?.[language] || businessTypeLabels.other[language];
}

function displayStoreName(store: NearbyStore, language: Language) {
  if (language === "ar" && store.display_name_ar?.trim()) return store.display_name_ar.trim();
  return store.display_name?.trim() || store.display_name_ar?.trim() || "Darik Store";
}

function displayTagline(store: NearbyStore, language: Language) {
  if (language === "ar" && store.tagline_ar?.trim()) return store.tagline_ar.trim();
  return store.tagline?.trim() || store.tagline_ar?.trim() || retailFieldLabel(store, language);
}

function StoreCard({ store, language }: { store: NearbyStore; language: Language }) {
  const t = copy[language];
  const distance = Number(store.distance_km || 0);
  const deliveryFee = Number(store.delivery_fee || 0);
  const primaryColor = safeColor(store.primary_color, "#101828");
  const accentColor = safeColor(store.accent_color, "#ffcc33");
  const heroImageUrl = safeImageUrl(store.hero_image_url);
  const logoUrl = safeImageUrl(store.logo_url);
  const coverStyle = heroImageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(8,15,29,.03), rgba(8,15,29,.68)), url(${JSON.stringify(heroImageUrl)})`,
      }
    : {
        backgroundImage: `radial-gradient(circle at 78% 16%, ${accentColor}55, transparent 34%), linear-gradient(135deg, ${primaryColor}, #111827)`,
      };

  return (
    <a className={styles.storeCard} href={`/${store.slug}`} aria-label={`${t.shopStore}: ${displayStoreName(store, language)}`}>
      <div className={styles.storeCover} style={coverStyle}>
        <div className={`${styles.orderStatus} ${store.show_ordering === false ? styles.orderStatusShowcase : store.is_accepting_orders ? styles.orderStatusOpen : styles.orderStatusPaused}`}>
          <span />
          {store.show_ordering === false ? t.showcase : store.is_accepting_orders ? t.open : t.closed}
        </div>
        <div className={styles.distanceBadge}>
          <Icon name="location" size={15} />
          {distance < 1 ? `${Math.max(1, Math.round(distance * 1000))} m` : `${distance.toFixed(1)} km`} {t.away}
        </div>
      </div>

      <div className={styles.storeCardBody}>
        <div className={styles.storeIdentityRow}>
          <div className={styles.storeLogo} style={{ borderColor: `${accentColor}70` }}>
            {logoUrl ? <img src={logoUrl} alt="" /> : <span>{displayStoreName(store, language).slice(0, 1)}</span>}
          </div>
          <div className={styles.storeIdentityText}>
            <p>{retailFieldLabel(store, language)}</p>
            <h3>{displayStoreName(store, language)}</h3>
          </div>
          <span className={styles.cardArrow}><Icon name="chevron" size={20} /></span>
        </div>

        <p className={styles.storeTagline}>{displayTagline(store, language)}</p>
        {(language === "ar" ? store.public_address_ar || store.public_address : store.public_address || store.public_address_ar) ? <p className={styles.storeAddress}><Icon name="location" size={16} />{language === "ar" ? store.public_address_ar || store.public_address : store.public_address || store.public_address_ar}</p> : null}

        <div className={styles.storeFacts}>
          {store.show_ordering === false ? (
            <>
              <span><Icon name="shop" size={17} />{t.browseCatalog}</span>
              <span><Icon name="heart" size={17} />{t.contactStore}</span>
              <span>{t.showcase}</span>
            </>
          ) : (
            <>
              <span><Icon name="clock" size={17} />{store.estimated_delivery_minutes ? `${store.estimated_delivery_minutes} ${t.min}` : "—"}</span>
              <span><Icon name="shop" size={17} />{deliveryFee <= 0 ? t.free : `${money(deliveryFee)} JOD`} {t.delivery}</span>
              <span>{money(store.minimum_order)} JOD {t.minimum}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

export default function DarikDiscoveryHome() {
  const [language, setLanguage] = useState<Language>("en");
  const [locationReady, setLocationReady] = useState(false);
  const [location, setLocation] = useState<CustomerLocation | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [searchingPlaces, setSearchingPlaces] = useState(false);
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [storesLoading, setStoresLoading] = useState(false);
  const [storesError, setStoresError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [storeSearch, setStoreSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const t = copy[language];

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_LANGUAGE_KEY);
    const nextLanguage: Language = storedLanguage === "ar" || storedLanguage === "en"
      ? storedLanguage
      : navigator.language.toLowerCase().startsWith("ar")
        ? "ar"
        : "en";
    setLanguage(nextLanguage);

    window.localStorage.removeItem(STORAGE_LOCATION_KEY);
    window.sessionStorage.removeItem(
      DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117
    );
    const storedLocation = null;
    if (!storedLocation) {
      setLocationReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(storedLocation) as CustomerLocation;
      if (Number.isFinite(parsed.latitude) && Number.isFinite(parsed.longitude) && parsed.label) {
        setLocation(parsed);
        setLocationDialogOpen(false);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_LOCATION_KEY);
    } finally {
      setLocationReady(true);
    }
  }, []);

  useEffect(() => {
    const freshMarketplaceOnBack117 = (
      event: PageTransitionEvent
    ) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener(
      "pageshow",
      freshMarketplaceOnBack117
    );

    return () =>
      window.removeEventListener(
        "pageshow",
        freshMarketplaceOnBack117
      );
  }, []);

  useEffect(() => {
    if (!location) return;
    void loadNearbyStores(location);
  }, [location]);

  function toggleLanguage() {
    const next = language === "en" ? "ar" : "en";
    setLanguage(next);
    window.localStorage.setItem(STORAGE_LANGUAGE_KEY, next);
  }

  async function loadNearbyStores(point: CustomerLocation) {
    setStoresLoading(true);
    setStoresError("");

    const result = await supabase.rpc("darik_direct_nearby_storefronts", {
      p_latitude: point.latitude,
      p_longitude: point.longitude,
      p_limit: 180,
    });

    if (result.error) {
      console.error("Darik nearby-store lookup failed", result.error);
      setStores([]);
      setStoresError(result.error.message || t.loadError);
    } else {
      setStores(Array.isArray(result.data) ? (result.data as NearbyStore[]) : []);
    }

    setStoresLoading(false);
  }

  function saveLocation(nextLocation: CustomerLocation) {
    window.localStorage.removeItem(STORAGE_LOCATION_KEY);
    window.sessionStorage.setItem(
      DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117,
      JSON.stringify({
        ...nextLocation,
        capturedAt: Date.now(),
      })
    );
    setLocation(nextLocation);
    setLocationDialogOpen(false);
    setLocationError("");
    setPredictions([]);
    setPlaceQuery("");
    setSelectedCategory("all");
  }

  async function reverseGeocode(latitude: number, longitude: number) {
    try {
      const response = await fetch(`/api/google-places/geocode?lat=${latitude}&lng=${longitude}&language=${language}`);
      const json = await response.json();
      const first = Array.isArray(json.results) ? json.results[0] : null;
      return first?.formatted_address || (language === "ar" ? "موقعك الحالي" : "Your current location");
    } catch {
      return language === "ar" ? "موقعك الحالي" : "Your current location";
    }
  }

  function useCurrentLocation() {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError(t.invalidLocation);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const label = await reverseGeocode(latitude, longitude);
        saveLocation({ latitude, longitude, label, placeId: null, source: "gps" });
        setLocating(false);
      },
      () => {
        setLocationError(t.browserDenied);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  }

  async function searchPlaces(event?: FormEvent) {
    event?.preventDefault();
    const input = placeQuery.trim();
    if (input.length < 3) {
      setLocationError(language === "ar" ? "اكتب ثلاثة أحرف على الأقل للبحث." : "Type at least three characters to search.");
      return;
    }

    setSearchingPlaces(true);
    setLocationError("");
    setPredictions([]);

    try {
      const response = await fetch(`/api/google-places/autocomplete?input=${encodeURIComponent(input)}&language=${language}`);
      const json = await response.json();
      if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
        throw new Error(json.error_message || t.invalidLocation);
      }
      const nextPredictions = Array.isArray(json.predictions) ? json.predictions : [];
      setPredictions(nextPredictions);
      if (!nextPredictions.length) setLocationError(language === "ar" ? "لم نجد هذا العنوان. جرّب وصفاً آخر." : "No matching address found. Try another description.");
    } catch (caught) {
      setLocationError(caught instanceof Error ? caught.message : t.invalidLocation);
    } finally {
      setSearchingPlaces(false);
    }
  }

  async function selectPlace(prediction: PlacePrediction) {
    setSearchingPlaces(true);
    setLocationError("");

    try {
      const response = await fetch(`/api/google-places/details?place_id=${encodeURIComponent(prediction.place_id)}&language=${language}`);
      const json = await response.json();
      const latitude = Number(json.result?.geometry?.location?.lat);
      const longitude = Number(json.result?.geometry?.location?.lng);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error(t.invalidLocation);

      saveLocation({
        latitude,
        longitude,
        label: json.result?.formatted_address || prediction.description,
        placeId: prediction.place_id,
        source: "google_search",
      });
    } catch (caught) {
      setLocationError(caught instanceof Error ? caught.message : t.invalidLocation);
    } finally {
      setSearchingPlaces(false);
    }
  }

  const storeCounts = useMemo(() => {
    const counts = new Map<CategoryKey, number>();
    categoryGroups.forEach((group) => counts.set(group.key, group.key === "all" ? stores.length : 0));
    stores.forEach((store) => {
      const key = storeGroupKey(store);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [stores]);

  const matchingStores = useMemo(() => {
    const normalizedSearch = storeSearch.trim().toLowerCase();
    return stores.filter((store) => {
      const categoryMatch = selectedCategory === "all" || storeGroupKey(store) === selectedCategory;
      if (!categoryMatch) return false;
      if (!normalizedSearch) return true;
      const haystack = [
        store.display_name,
        store.display_name_ar,
        store.tagline,
        store.tagline_ar,
        store.retail_field,
        store.retail_field_other,
        store.public_address,
        store.public_address_ar,
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [selectedCategory, storeSearch, stores]);

  const groupedStores = useMemo(() => {
    if (selectedCategory !== "all" || storeSearch.trim()) {
      const selectedGroup = categoryGroups.find((group) => group.key === selectedCategory) || categoryGroups[0];
      return [{ group: selectedGroup, stores: matchingStores }];
    }

    return categoryGroups
      .filter((group) => group.key !== "all")
      .map((group) => ({ group, stores: stores.filter((store) => storeGroupKey(store) === group.key) }))
      .filter((section) => section.stores.length > 0);
  }, [matchingStores, selectedCategory, storeSearch, stores]);

  const heroCounts = useMemo(() => {
    return ["groceries", "pharmacy", "fashion", "technology"].map((key) => {
      const group = categoryGroups.find((item) => item.key === key)!;
      return { group, count: storeCounts.get(group.key) || 0 };
    });
  }, [storeCounts]);

  return (
    <main className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="/" aria-label="Darik Marketplace home">
            <img className={styles.brandLogo} src="/darik_logo_final_v3.png" alt="Darik Marketplace" />
          </a>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <a href="#stores">{t.stores}</a>
            <a href="/how-it-works">{t.how}</a>
            <a href="/pricing">{t.pricing}</a>
          </nav>

          <div className={styles.headerActions}>
            <button className={styles.languageButton} type="button" onClick={toggleLanguage} aria-label="Change language">
              <Icon name="language" size={18} />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>
            <a className={styles.dashboardLink} href="/store-dashboard"><Icon name="user" size={18} />{t.dashboard}</a>
            <a className={styles.retailerButton} href="/store-signup">{t.retailerSignup}<Icon name="arrow" size={18} /></a>
            <button className={styles.mobileMenuButton} type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Open navigation">
              <Icon name="menu" />
            </button>
          </div>
        </div>

        {mobileNavOpen ? (
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <a href="#stores" onClick={() => setMobileNavOpen(false)}>{t.stores}</a>
            <a href="/how-it-works" onClick={() => setMobileNavOpen(false)}>{t.how}</a>
            <a href="/pricing" onClick={() => setMobileNavOpen(false)}>{t.pricing}</a>
            <a href="/store-dashboard">{t.dashboard}</a>
            <a href="/store-signup">{t.retailerSignup}</a>
          </nav>
        ) : null}
      </header>

      <section className={styles.heroSection}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}><Icon name="sparkle" size={16} />{t.eyebrow}</div>
            <h1><span>{t.heroTitleA}</span><strong>{t.heroTitleB}</strong></h1>
            <p className={styles.heroBody}>{t.heroBody}</p>

            <div className={styles.heroLocationPanel}>
              <button className={styles.locationButton} type="button" onClick={() => setLocationDialogOpen(true)}>
                <span className={styles.locationIcon}><Icon name="location" /></span>
                <span className={styles.locationText}>
                  <small>{location ? t.deliveringTo : t.locationNeeded}</small>
                  <strong>{location?.label || t.useLocation}</strong>
                </span>
                <span className={styles.changeLocation}>{location ? t.changeLocation : <Icon name="chevron" size={20} />}</span>
              </button>

              <label className={styles.heroSearch}>
                <Icon name="search" size={20} />
                <input
                  value={storeSearch}
                  onChange={(event) => setStoreSearch(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  disabled={!location}
                />
              </label>
            </div>

            <div className={styles.heroTrustRow}>
              <span><Icon name="check" size={16} />{language === "ar" ? "فلترة حقيقية حسب نطاق التوصيل" : "Real delivery-range filtering"}</span>
              <span><Icon name="check" size={16} />{language === "ar" ? "متاجر محلية مستقلة" : "Independent local stores"}</span>
              <span><Icon name="check" size={16} />{language === "ar" ? "طلب مباشر من المتجر" : "Order directly from the retailer"}</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.mapSurface}>
              <div className={styles.mapRoadOne} />
              <div className={styles.mapRoadTwo} />
              <div className={styles.mapRoadThree} />
              <div className={styles.deliveryRadius}>
                <div className={styles.deliveryRadiusPulse} />
                <div className={styles.customerPin}><Icon name="location" size={25} /></div>
              </div>

              {heroCounts.map(({ group, count }, index) => (
                <div key={group.key} className={`${styles.floatingCategory} ${styles[`floatingCategory${index + 1}`]}`}>
                  <span><Icon name={group.icon} size={19} /></span>
                  <div>
                    <strong>{categoryLabel(group, language)}</strong>
                    <small>{location ? `${count} ${count === 1 ? t.store : t.storesCount}` : t.locationRequired}</small>
                  </div>
                </div>
              ))}

              <div className={styles.mapCaption}>
                <span><Icon name="sparkle" size={16} /></span>
                <div><small>{language === "ar" ? "فلترة داريك الذكية" : "Darik smart matching"}</small><strong>{location ? t.discovery : t.locationRequiredBody}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.marketSection} id="stores">
        <div className={styles.sectionShell}>
          <div className={styles.marketHeadingRow}>
            <div>
              <span className={styles.sectionKicker}>{location ? t.deliveringTo : t.locationRequired}</span>
              <h2>{t.nearbyStores}</h2>
              <p>{location ? t.nearbyBody : t.locationRequiredBody}</p>
            </div>
            {location ? (
              <button className={styles.currentLocationPill} type="button" onClick={() => setLocationDialogOpen(true)}>
                <Icon name="location" size={18} />
                <span>{location.label}</span>
                <strong>{t.changeLocation}</strong>
              </button>
            ) : null}
          </div>

          <div className={styles.categoryScroller}>
            {categoryGroups.map((group) => {
              const count = storeCounts.get(group.key) || 0;
              return (
                <button
                  key={group.key}
                  className={`${styles.categoryChip} ${selectedCategory === group.key ? styles.categoryChipActive : ""}`}
                  type="button"
                  onClick={() => setSelectedCategory(group.key)}
                  disabled={!location}
                >
                  <span><Icon name={group.icon} size={20} /></span>
                  <strong>{categoryLabel(group, language)}</strong>
                  <small>{count}</small>
                </button>
              );
            })}
          </div>

          {!location ? (
            <div className={styles.locationEmptyState}>
              <div className={styles.emptyIllustration}>
                <span className={styles.emptyPin}><Icon name="location" size={30} /></span>
                <span className={styles.emptyOrbitOne} />
                <span className={styles.emptyOrbitTwo} />
              </div>
              <div>
                <span>{t.locationRequired}</span>
                <h3>{t.discovery}</h3>
                <p>{t.locationRequiredBody}</p>
              </div>
              <button type="button" onClick={() => setLocationDialogOpen(true)}>{t.setLocation}<Icon name="arrow" size={18} /></button>
            </div>
          ) : storesLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingRing} />
              <strong>{t.loadingStores}</strong>
            </div>
          ) : storesError ? (
            <div className={styles.errorState}>
              <span>!</span>
              <div><h3>{t.loadError}</h3><p>{storesError}</p></div>
              <button type="button" onClick={() => location && void loadNearbyStores(location)}>{t.retry}</button>
            </div>
          ) : groupedStores.length ? (
            <div className={styles.storeSections}>
              {groupedStores.map(({ group, stores: sectionStores }) => (
                <section className={styles.storeGroup} key={group.key}>
                  <div className={styles.storeGroupHeading}>
                    <div className={styles.groupTitle}>
                      <span><Icon name={group.icon} size={22} /></span>
                      <div><h3>{categoryLabel(group, language)}</h3><p>{sectionStores.length} {sectionStores.length === 1 ? t.store : t.storesCount}</p></div>
                    </div>
                    {selectedCategory === "all" && !storeSearch.trim() ? (
                      <button type="button" onClick={() => setSelectedCategory(group.key)}>{t.seeAll}<Icon name="chevron" size={17} /></button>
                    ) : null}
                  </div>
                  <div className={styles.storeGrid}>
                    {sectionStores.map((store) => <StoreCard key={store.storefront_id} store={store} language={language} />)}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className={styles.noStoresState}>
              <span><Icon name="location" size={30} /></span>
              <h3>{t.noStoresTitle}</h3>
              <p>{t.noStoresBody}</p>
              <div>
                <button type="button" onClick={() => setLocationDialogOpen(true)}>{t.changeLocation}</button>
                <a href="/store-signup">{t.retailerSignup}<Icon name="arrow" size={17} /></a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.retailerSection}>
        <div className={styles.sectionShell}>
          <div className={styles.retailerPanel}>
            <div className={styles.retailerCopy}>
              <span className={styles.retailerEyebrow}><Icon name="sparkle" size={16} />{t.retailerEyebrow}</span>
              <h2>{t.retailerTitle}</h2>
              <p>{t.retailerBody}</p>
              <div className={styles.retailerActions}>
                <a href="/store-signup">{t.startFree}<Icon name="arrow" size={19} /></a>
                <a href="/store-dashboard"><Icon name="user" size={19} />{t.openDashboard}</a>
              </div>
            </div>

            <div className={styles.retailerDashboardMock} aria-hidden="true">
              <div className={styles.mockTopbar}><span /><span /><span /><strong>Darik Store</strong></div>
              <div className={styles.mockBody}>
                <div className={styles.mockSidebar}><span /><span /><span /><span /></div>
                <div className={styles.mockContent}>
                  <div className={styles.mockWelcome}><div><small>GOOD AFTERNOON</small><strong>Your store is ready.</strong></div><button>+ Product</button></div>
                  <div className={styles.mockMetrics}><span><small>Orders</small><strong>18</strong></span><span><small>Sales</small><strong>JOD 742</strong></span><span><small>Reach</small><strong>8.0 km</strong></span></div>
                  <div className={styles.mockChart}><i /><i /><i /><i /><i /><i /><i /><i /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <a className={styles.brand} href="/" aria-label="Darik Marketplace home"><img className={styles.brandLogo} src="/darik_logo_final_v3.png" alt="Darik Marketplace" /></a>
            <p>{t.footerBody}</p>
          </div>
          <div className={styles.footerLinks}>
            <div><strong>{t.platformLinks}</strong><a href="#stores">{t.stores}</a><a href="/how-it-works">{t.how}</a><a href="/pricing">{t.pricing}</a></div>
            <div><strong>{t.retailerLinks}</strong><a href="/store-signup">{t.retailerSignup}</a><a href="/store-dashboard">{t.dashboard}</a></div>
          </div>
        </div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {t.rights}</span><span>getdarik.com · Jordan</span></div>
      </footer>

      {locationReady && locationDialogOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && location) setLocationDialogOpen(false);
        }}>
          <section className={styles.locationModal} role="dialog" aria-modal="true" aria-labelledby="location-title">
            {location ? <button className={styles.modalClose} type="button" onClick={() => setLocationDialogOpen(false)} aria-label={t.close}>×</button> : null}
            <div className={styles.modalIcon}><Icon name="location" size={29} /></div>
            <span className={styles.modalKicker}>GETDARIK.COM</span>
            <h2 id="location-title">{t.locationTitle}</h2>
            <p>{t.locationBody}</p>

            <button className={styles.gpsButton} type="button" onClick={useCurrentLocation} disabled={locating || searchingPlaces}>
              <span><Icon name="location" size={21} /></span>
              <strong>{locating ? t.locating : t.currentLocation}</strong>
              {!locating ? <Icon name="arrow" size={19} /> : <i className={styles.buttonSpinner} />}
            </button>

            <div className={styles.modalDivider}><span>{t.orSearch}</span></div>

            <form className={styles.addressForm} onSubmit={searchPlaces}>
              <label><Icon name="search" size={19} /><input value={placeQuery} onChange={(event) => setPlaceQuery(event.target.value)} placeholder={t.addressPlaceholder} autoComplete="street-address" autoFocus={Boolean(location)} /></label>
              <button type="submit" disabled={searchingPlaces}>{searchingPlaces ? t.searching : t.search}</button>
            </form>

            {predictions.length ? (
              <div className={styles.predictions}>
                {predictions.map((prediction) => (
                  <button key={prediction.place_id} type="button" onClick={() => void selectPlace(prediction)} disabled={searchingPlaces}>
                    <span><Icon name="location" size={18} /></span>
                    <div><strong>{prediction.structured_formatting?.main_text || prediction.description}</strong><small>{prediction.structured_formatting?.secondary_text || prediction.description}</small></div>
                    <Icon name="chevron" size={18} />
                  </button>
                ))}
              </div>
            ) : null}

            {locationError ? <div className={styles.locationError}><span>!</span>{locationError}</div> : null}
            <div className={styles.privacyNote}><Icon name="check" size={16} />{t.privacy}</div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
