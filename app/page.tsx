"use client";

import DarikJordanDirectorySearch295 from "./components/DarikJordanDirectorySearch295";
// DARIK_PAYMENT_FIRST_YEARLY_PLANS_CATALOG_GATE_190


import DarikCustomerAccountHub175 from "./components/DarikCustomerAccountHub175";
// DARIK_FRONTEND_132_HOME_FREE_RETAILER_ACCOUNT_CTA

// DARIK_ROOT_LINKS_027

// DARIK_DISCOVERY_HOME_026
// DARIK_MARKETPLACE_REDESIGN_CHECKPOINT1_246A
// DARIK_MARKETPLACE_REDESIGN_CHECKPOINT1_MOBILE_ALIGNMENT_246A4
// DARIK_MARKETPLACE_REDESIGN_CHECKPOINT2_STORE_LIST_246B
// DARIK_MARKETPLACE_REDESIGN_CHECKPOINT3_CATEGORIES_BROWSER_246C
// DARIK_MARKETPLACE_REDESIGN_CHECKPOINT3_ENTRY_FIX_246C4
// DARIK_MARKETPLACE_REDESIGN_CHECKPOINT4_STORE_PREVIEW_246D
// DARIK_MARKETPLACE_REDESIGN_CHECKPOINT5_FINAL_POLISH_246E
// DARIK_MARKETPLACE_RESTORE_FULL_SITE_SHELL_246F
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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

// DARIK_HOME_STORE_SHELVES_TRUE_BESTSELLERS_186
type DarikHomeSpecialDelivery186 = {
  enabled: boolean;
  maxKm: number;
  minimumQualifyingJod: number;
};

// DARIK_HOME_STORE_CARD_BESTSELLER_VISUALS_249
type DarikHomeBestSellerProduct249 = {
  id: string;
  imageUrl: string;
};

type IconName =
  | "arrow"
  | "auto"
  | "beauty"
  | "check"
  | "chevron"
  | "clock"
  | "food"
  | "filter"
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
// DARIK_SESSION_LOCATION_AND_PREVIEW_BYPASS_120
const DARIK_CUSTOMER_LOCATION_SESSION_KEY_120 =
  "darik_customer_location_session_120";
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

const retailFieldShelfLabels186: Record<string, { en: string; ar: string }> = {
  smoke_shop: { en: "Smoke shops", ar: "محلات التدخين" },
  supermarket: { en: "Supermarkets", ar: "سوبرماركت" },
  grocery: { en: "Grocery stores", ar: "بقالات" },
  mini_market: { en: "Mini-markets", ar: "ميني ماركت" },
  pharmacy: { en: "Pharmacies", ar: "صيدليات" },
  restaurant: { en: "Restaurants", ar: "مطاعم" },
  fast_food: { en: "Fast food", ar: "وجبات سريعة" },
  bakery: { en: "Bakeries & sweets", ar: "مخابز وحلويات" },
  cafe: { en: "Cafés", ar: "مقاهي" },
  butcher: { en: "Butchers", ar: "ملاحم" },
  produce: { en: "Fruit & vegetables", ar: "خضار وفواكه" },
  frozen_food: { en: "Frozen food", ar: "مواد غذائية مجمدة" },
  clothing: { en: "Clothing stores", ar: "محلات ملابس" },
  shoes: { en: "Shoe stores", ar: "محلات أحذية" },
  jewelry: { en: "Jewelry stores", ar: "محلات مجوهرات" },
  cosmetics: { en: "Cosmetics & beauty", ar: "تجميل وعناية" },
  perfume: { en: "Perfume stores", ar: "محلات عطور" },
  electronics: { en: "Electronics", ar: "إلكترونيات" },
  computers: { en: "Computer stores", ar: "محلات كمبيوتر" },
  mobile_phones: { en: "Mobile phone stores", ar: "محلات هواتف" },
  furniture: { en: "Furniture stores", ar: "محلات أثاث" },
  home_appliances: { en: "Home appliances", ar: "أجهزة منزلية" },
  home_decor: { en: "Home décor", ar: "ديكور منزلي" },
  auto_parts: { en: "Auto parts", ar: "قطع سيارات" },
  tires: { en: "Tires & accessories", ar: "إطارات وإكسسوارات" },
  hardware: { en: "Hardware stores", ar: "عدد وأدوات" },
  building_materials: { en: "Building materials", ar: "مواد بناء" },
  electrical_supplies: { en: "Electrical supplies", ar: "مواد كهربائية" },
  plumbing: { en: "Plumbing supplies", ar: "مواد صحية وسباكة" },
  tools: { en: "Tools & equipment", ar: "أدوات ومعدات" },
  pet_supplies: { en: "Pet supplies", ar: "مستلزمات حيوانات" },
  flowers: { en: "Flower shops", ar: "محلات زهور" },
  gifts: { en: "Gift shops", ar: "محلات هدايا" },
  toys: { en: "Toy stores", ar: "محلات ألعاب" },
  books_stationery: { en: "Books & stationery", ar: "كتب وقرطاسية" },
  sports: { en: "Sports stores", ar: "محلات رياضية" },
  other: { en: "Local stores", ar: "متاجر محلية" },
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
    startFree: "Sign up today",
    openDashboard: "Open retailer dashboard",
    plansTitle: "Simple plans for serious local businesses",
    plansBody: "Choose a yearly plan and pay up front. Storefront setup opens during CliQ review; catalog tools unlock after approval.",
    monthly: "Up to 1,000 items",
    sixMonths: "Up to 3,000 items",
    annual: "Up to 10,000 items",
    premium: "Yearly plans",
    perMonth: "per year",
    onePayment: "paid up front",
    bestValue: "Most flexible",
    premiumBadge: "Largest catalog",
    basicFeatures: "Storefront, delivery, dashboard, and catalog after approval",
    premiumFeatures: "Yearly plans differ only by product limit",
    choosePlan: "Sign up today",
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
    startFree: "سجّل اليوم",
    openDashboard: "افتح لوحة التاجر",
    plansTitle: "خطط واضحة للأعمال المحلية الجادة",
    plansBody: "اختر خطة سنوية وادفع مقدماً. يفتح إعداد الواجهة أثناء مراجعة CliQ وتفتح أدوات الكتالوج بعد الموافقة.",
    monthly: "حتى 1,000 منتج",
    sixMonths: "حتى 3,000 منتج",
    annual: "حتى 10,000 منتج",
    premium: "خطط سنوية",
    perMonth: "سنوياً",
    onePayment: "الدفع مقدماً",
    bestValue: "الأكثر مرونة",
    premiumBadge: "أكبر كتالوج",
    basicFeatures: "واجهة وتوصيل ولوحة وكتالوج بعد الموافقة",
    premiumFeatures: "الخطط السنوية تختلف فقط بحد المنتجات",
    choosePlan: "سجّل اليوم",
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
  if (name === "filter") return <svg {...common}><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg>;
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

function retailFieldShelfKey186(store: NearbyStore) {
  return String(store.retail_field || "other").trim().toLowerCase() || "other";
}

function retailFieldShelfLabel186(field: string, language: Language) {
  const exact = retailFieldShelfLabels186[field];
  if (exact) return exact[language];
  const known = businessTypeLabels[field];
  if (known) return known[language];
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function storeDeliveryFee186(store: NearbyStore) {
  const value = Number(store.delivery_fee ?? 0);
  return Number.isFinite(value) ? Math.max(0, value) : Number.POSITIVE_INFINITY;
}

function normalizeHomeSpecialDelivery186(
  value: unknown
): DarikHomeSpecialDelivery186 | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const maxKm = Number(row.max_km ?? 0);
  const threshold = Number(row.minimum_qualifying_jod ?? 0);
  if (row.enabled !== true || !Number.isFinite(maxKm) || maxKm <= 0) return null;
  if (!Number.isFinite(threshold) || threshold <= 0) return null;
  return { enabled: true, maxKm, minimumQualifyingJod: threshold };
}

async function loadHomeBestSellerProducts249(
  slug: string
): Promise<DarikHomeBestSellerProduct249[]> {
  const normalizedSlug249 = slug.trim().toLowerCase();
  if (!normalizedSlug249) return [];

  const selected249: DarikHomeBestSellerProduct249[] = [];
  const selectedIds249 = new Set<string>();

  function absorbProduct249(raw249: unknown) {
    if (!raw249 || typeof raw249 !== "object" || selected249.length >= 4) return;
    const row249 = raw249 as Record<string, unknown>;
    const id249 = String(row249.id ?? "").trim();
    if (!id249 || selectedIds249.has(id249)) return;

    const image249 =
      safeImageUrl(String(row249.official_product_thumbnail_url ?? "")) ||
      safeImageUrl(String(row249.official_product_photo_url ?? ""));

    if (!image249) return;

    selectedIds249.add(id249);
    selected249.push({ id: id249, imageUrl: image249 });
  }

  // Use the exact same real sales source already used by each retailer storefront.
  const salesResult249 = await supabase.rpc(
    "darik_direct_public_bestseller_sales_v186",
    { p_slug: normalizedSlug249 }
  );

  const unitsByProduct249 = new Map<string, number>();

  if (!salesResult249.error) {
    for (const raw249 of Array.isArray(salesResult249.data)
      ? salesResult249.data
      : []) {
      if (!raw249 || typeof raw249 !== "object") continue;
      const row249 = raw249 as Record<string, unknown>;
      const productId249 = String(row249.product_id ?? "").trim();
      const units249 = Number(row249.units_sold ?? 0);

      if (
        productId249 &&
        Number.isFinite(units249) &&
        units249 > 0
      ) {
        unitsByProduct249.set(productId249, units249);
      }
    }
  }

  const rankedIds249 = Array.from(unitsByProduct249.entries())
    .sort((a249, b249) => b249[1] - a249[1])
    .map(([productId249]) => productId249)
    .slice(0, 12);

  if (rankedIds249.length > 0) {
    const rankedProducts249 = await supabase
      .from("public_storefront_products")
      .select(
        "id,official_product_thumbnail_url,official_product_photo_url"
      )
      .eq("storefront_slug", normalizedSlug249)
      .in("id", rankedIds249);

    if (!rankedProducts249.error) {
      const rowsById249 = new Map<string, unknown>();

      for (const row249 of Array.isArray(rankedProducts249.data)
        ? rankedProducts249.data
        : []) {
        if (!row249 || typeof row249 !== "object") continue;
        const id249 = String(
          (row249 as Record<string, unknown>).id ?? ""
        ).trim();
        if (id249) rowsById249.set(id249, row249);
      }

      for (const productId249 of rankedIds249) {
        absorbProduct249(rowsById249.get(productId249));
        if (selected249.length >= 4) break;
      }
    }
  }

  // New stores may not have sales history yet. Fill remaining visual slots using
  // the same public storefront order the store itself uses.
  if (selected249.length < 4) {
    const fallbackProducts249 = await supabase
      .from("public_storefront_products")
      .select(
        "id,official_product_thumbnail_url,official_product_photo_url,storefront_featured,storefront_sort_order,created_at"
      )
      .eq("storefront_slug", normalizedSlug249)
      .order("storefront_featured", { ascending: false })
      .order("storefront_sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(12);

    if (!fallbackProducts249.error) {
      for (const row249 of Array.isArray(fallbackProducts249.data)
        ? fallbackProducts249.data
        : []) {
        absorbProduct249(row249);
        if (selected249.length >= 4) break;
      }
    }
  }

  return selected249.slice(0, 4);
}

function HomeStoreCard186({
  store,
  language,
  special,
  bestSellers249,
}: {
  store: NearbyStore;
  language: Language;
  special: DarikHomeSpecialDelivery186 | null;
  bestSellers249: DarikHomeBestSellerProduct249[] | undefined;
}) {
  const t = copy[language];
  const distance = Number(store.distance_km || 0);
  const deliveryFee = storeDeliveryFee186(store);
  const primaryColor = safeColor(store.primary_color, "#101828");
  const accentColor = safeColor(store.accent_color, "#ffcc33");
  const heroImageUrl = safeImageUrl(store.hero_image_url);
  const logoUrl = safeImageUrl(store.logo_url);
  const specialAtLocation = Boolean(
    special?.enabled &&
      Number.isFinite(distance) &&
      distance <= special.maxKm + 0.0001
  );

  return (
    <a
      className="darikHomeStoreCard186"
      href={`/${store.slug}`}
      aria-label={`${t.shopStore}: ${displayStoreName(store, language)}`}
      onClick={(event) => {
        // DARIK_BESTSELLER_EXACT_PRODUCT_OPEN_250
        const clickedProduct250 = (
          event.target as HTMLElement
        ).closest<HTMLElement>("[data-darik-product-id249]");

        try {
          const storageKey188 = `darik:opening-store-logo:188:${store.slug.toLowerCase()}`;
          if (logoUrl) {
            window.sessionStorage.setItem(storageKey188, logoUrl);
          } else {
            window.sessionStorage.removeItem(storageKey188);
          }
        } catch {
          // Store opening still works if browser storage is unavailable.
        }

        if (clickedProduct250) {
          const productId250 =
            clickedProduct250.dataset.darikProductId249?.trim();

          if (productId250) {
            event.preventDefault();
            window.location.assign(
              `/${store.slug}?product=${encodeURIComponent(productId250)}`
            );
          }
        }
      }}
    >
      <div
        className="darikHomeStoreCover186"
        style={
          heroImageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(8,15,29,.02), rgba(8,15,29,.16)), url(${JSON.stringify(heroImageUrl)})`,
              }
            : {
                backgroundImage: `radial-gradient(circle at 75% 18%, ${accentColor}5c, transparent 35%), linear-gradient(145deg, ${primaryColor}, #111827)`,
              }
        }
      >
        {/* DARIK_HOME_STORE_LOGO_DEAD_CENTER_187 */}
        {logoUrl ? (
          <span className="darikHomeStoreLogoStage187" aria-hidden="true">
            <img className="darikHomeStoreCoverLogo186" src={logoUrl} alt="" />
          </span>
        ) : null}
        <span
          className={`darikHomeStoreStatus186 ${
            store.show_ordering === false
              ? "darikHomeStoreStatusShowcase186"
              : store.is_accepting_orders
                ? "darikHomeStoreStatusOpen186"
                : "darikHomeStoreStatusClosed186"
          }`}
        >
          {store.show_ordering === false
            ? t.showcase
            : store.is_accepting_orders
              ? t.open
              : t.closed}
        </span>
      </div>

      <div className="darikHomeStoreBody186">
        <span
          className={`darikHomeStoreInlineStatus246B ${
            store.show_ordering === false
              ? "darikHomeStoreInlineStatusShowcase246B"
              : store.is_accepting_orders
                ? "darikHomeStoreInlineStatusOpen246B"
                : "darikHomeStoreInlineStatusClosed246B"
          }`}
        >
          <Icon
            name={
              store.show_ordering === false
                ? "shop"
                : store.is_accepting_orders
                  ? "check"
                  : "clock"
            }
            size={12}
          />
          {store.show_ordering === false
            ? t.showcase
            : store.is_accepting_orders
              ? t.open
              : t.closed}
        </span>

        <h3>{displayStoreName(store, language)}</h3>

        <strong className="darikHomeStoreFee186">
          {deliveryFee <= 0
            ? "Free delivery"
            : `${money(deliveryFee)} JOD delivery`}
        </strong>

        {specialAtLocation && deliveryFee > 0 ? (
          <span className="darikHomeStoreSpecial186">
            Free delivery over {money(special!.minimumQualifyingJod)} JOD
          </span>
        ) : null}

        <div className="darikHomeStoreMeta246B">
          <small className="darikHomeStoreDistance186">
            {distance < 1
              ? `${Math.max(1, Math.round(distance * 1000))} m away`
              : `${distance.toFixed(1)} km away`}
          </small>

          {Number(store.estimated_delivery_minutes || 0) > 0 ? (
            <>
              <span aria-hidden="true">•</span>
              <small>
                ~{Math.round(Number(store.estimated_delivery_minutes))} min
              </small>
            </>
          ) : null}
        </div>
      </div>

      <span className="darikHomeStoreArrow246B" aria-hidden="true">
        <Icon name="chevron" size={18} />
      </span>

      {bestSellers249 === undefined ? (
        <div
          className="darikHomeStoreProducts249 darikHomeStoreProductsLoading249"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((slot249) => (
            <span key={`product-loading-${slot249}`} />
          ))}
        </div>
      ) : bestSellers249.length > 0 ? (
        <div className="darikHomeStoreProducts249" aria-hidden="true">
          {bestSellers249.map((product249) => (
            <span
              key={product249.id}
              data-darik-product-id249={product249.id}
              title={
                language === "ar"
                  ? "فتح هذا المنتج"
                  : "Open this product"
              }
            >
              <img
                src={product249.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
          ))}
        </div>
      ) : null}
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
  const [storeSearch, setStoreSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [filterOpen246, setFilterOpen246] = useState(false);
  const [selectedCategory246, setSelectedCategory246] =
    useState<CategoryKey>("all");
  const [categoryBrowserOpen246C, setCategoryBrowserOpen246C] =
    useState(false);
  const [sortMode246E, setSortMode246E] =
    useState<"recommended" | "nearest" | "delivery">("recommended");
  const [openOnly246E, setOpenOnly246E] = useState(false);
  const [freeDeliveryOnly246E, setFreeDeliveryOnly246E] = useState(false);

  const [specialDeliveryBySlug186, setSpecialDeliveryBySlug186] = useState<
    Record<string, DarikHomeSpecialDelivery186>
  >({});

  const [bestSellerProductsBySlug249, setBestSellerProductsBySlug249] =
    useState<Record<string, DarikHomeBestSellerProduct249[]>>({});
  const bestSellerRequestedSlugs249 = useRef<Set<string>>(new Set());
  const [storeShelfState186, setStoreShelfState186] = useState<
    Record<string, { canGoBack: boolean; canGoForward: boolean }>
  >({});

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
    const storedLocation = window.sessionStorage.getItem(
      DARIK_CUSTOMER_LOCATION_SESSION_KEY_120
    );
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

  useEffect(() => {
    const slugs186 = Array.from(
      new Set(stores.map((store) => store.slug.trim()).filter(Boolean))
    );

    if (slugs186.length === 0) {
      setSpecialDeliveryBySlug186({});
      return;
    }

    let cancelled186 = false;

    void (async () => {
      const result186 = await supabase.rpc(
        "darik_direct_public_special_delivery_zones_v186",
        { p_slugs: slugs186 }
      );

      if (cancelled186) return;

      if (result186.error) {
        console.warn(
          "Darik homepage Special Zone badges unavailable:",
          result186.error.message
        );
        setSpecialDeliveryBySlug186({});
        return;
      }

      const payload186 =
        result186.data && typeof result186.data === "object"
          ? (result186.data as Record<string, unknown>)
          : {};
      const next186: Record<string, DarikHomeSpecialDelivery186> = {};

      for (const [slug186, raw186] of Object.entries(payload186)) {
        const normalized186 = normalizeHomeSpecialDelivery186(raw186);
        if (normalized186) next186[slug186.toLowerCase()] = normalized186;
      }

      setSpecialDeliveryBySlug186(next186);
    })();

    return () => {
      cancelled186 = true;
    };
  }, [stores]);

  function saveLocation(nextLocation: CustomerLocation) {
    window.localStorage.removeItem(STORAGE_LOCATION_KEY);
    window.sessionStorage.setItem(
      DARIK_MARKETPLACE_LOCATION_HANDOFF_KEY_117,
      JSON.stringify({
        ...nextLocation,
        capturedAt: Date.now(),
      })
    );
    window.sessionStorage.setItem(
      DARIK_CUSTOMER_LOCATION_SESSION_KEY_120,
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
      if (
        selectedCategory246 !== "all" &&
        storeGroupKey(store) !== selectedCategory246
      ) {
        return false;
      }

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
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [selectedCategory246, storeSearch, stores]);

  const visibleStores246B = useMemo(() => {
    const filtered246E = matchingStores.filter((store) => {
      if (
        openOnly246E &&
        (store.show_ordering === false || !store.is_accepting_orders)
      ) {
        return false;
      }

      if (
        freeDeliveryOnly246E &&
        storeDeliveryFee186(store) > 0
      ) {
        return false;
      }

      return true;
    });

    return [...filtered246E].sort((a, b) => {
      if (sortMode246E === "nearest") {
        const distanceDifference246E =
          Number(a.distance_km ?? 0) - Number(b.distance_km ?? 0);

        if (distanceDifference246E !== 0) return distanceDifference246E;
      }

      if (sortMode246E === "delivery") {
        const feeDifference246E =
          storeDeliveryFee186(a) - storeDeliveryFee186(b);

        if (feeDifference246E !== 0) return feeDifference246E;

        const distanceDifference246E =
          Number(a.distance_km ?? 0) - Number(b.distance_km ?? 0);

        if (distanceDifference246E !== 0) return distanceDifference246E;
      }

      if (sortMode246E === "recommended") {
        const openDifference246E =
          Number(b.show_ordering !== false && b.is_accepting_orders) -
          Number(a.show_ordering !== false && a.is_accepting_orders);

        if (openDifference246E !== 0) return openDifference246E;

        const distanceDifference246E =
          Number(a.distance_km ?? 0) - Number(b.distance_km ?? 0);

        if (distanceDifference246E !== 0) return distanceDifference246E;

        const feeDifference246E =
          storeDeliveryFee186(a) - storeDeliveryFee186(b);

        if (feeDifference246E !== 0) return feeDifference246E;
      }

      return displayStoreName(a, language).localeCompare(
        displayStoreName(b, language),
        language === "ar" ? "ar" : "en"
      );
    });
  }, [
    matchingStores,
    language,
    sortMode246E,
    openOnly246E,
    freeDeliveryOnly246E,
  ]);

  // DARIK_NEAREST_FOUR_PROGRESSIVE_STORES_318D
  const STORE_BATCH_SIZE_318D = 4;

  const nearestCategoryStores318D = useMemo(() => {
    const categoryFiltered318D =
      selectedCategory246 === "all"
        ? visibleStores246B
        : visibleStores246B.filter(
            (store318D) =>
              storeGroupKey(
                store318D
              ) ===
              selectedCategory246
          );

    return [
      ...categoryFiltered318D,
    ].sort(
      (a318D, b318D) => {
        const distanceA318D =
          Number(
            a318D.distance_km
          );

        const distanceB318D =
          Number(
            b318D.distance_km
          );

        const safeDistanceA318D =
          Number.isFinite(
            distanceA318D
          )
            ? distanceA318D
            : Number.POSITIVE_INFINITY;

        const safeDistanceB318D =
          Number.isFinite(
            distanceB318D
          )
            ? distanceB318D
            : Number.POSITIVE_INFINITY;

        const difference318D =
          safeDistanceA318D -
          safeDistanceB318D;

        if (
          difference318D !== 0
        ) {
          return difference318D;
        }

        return String(
          a318D.display_name ?? ""
        ).localeCompare(
          String(
            b318D.display_name ?? ""
          )
        );
      }
    );
  }, [
    visibleStores246B,
    selectedCategory246,
  ]);

  const [
    visibleStoreCount318D,
    setVisibleStoreCount318D,
  ] = useState(
    STORE_BATCH_SIZE_318D
  );

  const renderedStores318D = useMemo(
    () =>
      nearestCategoryStores318D.slice(
        0,
        visibleStoreCount318D
      ),
    [
      nearestCategoryStores318D,
      visibleStoreCount318D,
    ]
  );

  const hasMoreStores318D =
    renderedStores318D.length <
    nearestCategoryStores318D.length;

  useEffect(() => {
    setVisibleStoreCount318D(
      STORE_BATCH_SIZE_318D
    );
  }, [
    selectedCategory246,
    location?.latitude,
    location?.longitude,
    storeSearch,
    openOnly246E,
    freeDeliveryOnly246E,
  ]);

  useEffect(() => {
    if (
      !hasMoreStores318D
    ) {
      return;
    }

    let loadingMore318D =
      false;

    const onScroll318D = () => {
      if (
        loadingMore318D
      ) {
        return;
      }

      const list318D =
        document.querySelector(
          ".darikMarketplaceStoreList246B"
        );

      if (!list318D) {
        return;
      }

      const bounds318D =
        list318D.getBoundingClientRect();

      const passedCurrentBatch318D =
        bounds318D.bottom <=
        window.innerHeight + 16;

      if (
        !passedCurrentBatch318D
      ) {
        return;
      }

      loadingMore318D =
        true;

      setVisibleStoreCount318D(
        (current318D) =>
          Math.min(
            current318D +
              STORE_BATCH_SIZE_318D,
            nearestCategoryStores318D.length
          )
      );

      window.setTimeout(
        () => {
          loadingMore318D =
            false;
        },
        100
      );
    };

    window.addEventListener(
      "scroll",
      onScroll318D,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll318D
      );
    };
  }, [
    hasMoreStores318D,
    nearestCategoryStores318D.length,
  ]);


  useEffect(() => {
    const slugs249 = Array.from(
      new Set(
        renderedStores318D
          .map((store249) => store249.slug.trim().toLowerCase())
          .filter(Boolean)
      )
    ).filter(
      (slug249) => !bestSellerRequestedSlugs249.current.has(slug249)
    );

    if (slugs249.length === 0) return;

    for (const slug249 of slugs249) {
      bestSellerRequestedSlugs249.current.add(slug249);
    }

    let cursor249 = 0;

    async function worker249() {
      while (cursor249 < slugs249.length) {
        const index249 = cursor249;
        cursor249 += 1;
        const slug249 = slugs249[index249];
        if (!slug249) continue;

        try {
          const products249 = await loadHomeBestSellerProducts249(slug249);
          setBestSellerProductsBySlug249((current249) => ({
            ...current249,
            [slug249]: products249,
          }));
        } catch (error249) {
          console.warn(
            `Darik homepage bestseller visuals unavailable for ${slug249}:`,
            error249
          );
          setBestSellerProductsBySlug249((current249) => ({
            ...current249,
            [slug249]: [],
          }));
        }
      }
    }

    const workerCount249 = Math.min(4, slugs249.length);
    void Promise.all(
      Array.from({ length: workerCount249 }, () => worker249())
    );
  }, [renderedStores318D]);

  // DARIK_HOME_STORE_SHELVES_TRUE_BESTSELLERS_186
  const groupedStores = useMemo(() => {
    const buckets186 = new Map<string, NearbyStore[]>();

    for (const store of matchingStores) {
      const field186 = retailFieldShelfKey186(store);
      const bucket186 = buckets186.get(field186) ?? [];
      bucket186.push(store);
      buckets186.set(field186, bucket186);
    }

    return Array.from(buckets186.entries())
      .map(([field, fieldStores]) => {
        const sortedStores = [...fieldStores].sort((a, b) => {
          const feeDifference = storeDeliveryFee186(a) - storeDeliveryFee186(b);
          if (feeDifference !== 0) return feeDifference;

          const distanceDifference =
            Number(a.distance_km ?? 0) - Number(b.distance_km ?? 0);
          if (distanceDifference !== 0) return distanceDifference;

          return displayStoreName(a, language).localeCompare(
            displayStoreName(b, language),
            language === "ar" ? "ar" : "en"
          );
        });

        return {
          field,
          label: retailFieldShelfLabel186(field, language),
          stores: sortedStores,
          cheapestFee: sortedStores.length
            ? storeDeliveryFee186(sortedStores[0])
            : Number.POSITIVE_INFINITY,
        };
      })
      .sort((a, b) => {
        const feeDifference = a.cheapestFee - b.cheapestFee;
        if (feeDifference !== 0) return feeDifference;
        return a.label.localeCompare(b.label, language === "ar" ? "ar" : "en");
      });
  }, [matchingStores, language]);

  function updateStoreShelfState186(field186: string, element: HTMLDivElement) {
    const maxScroll186 = Math.max(0, element.scrollWidth - element.clientWidth);
    const scroll186 = Math.abs(element.scrollLeft);
    const next186 = {
      canGoBack: scroll186 > 4,
      canGoForward: maxScroll186 - scroll186 > 4,
    };

    setStoreShelfState186((current) => {
      const previous = current[field186];
      if (
        previous?.canGoBack === next186.canGoBack &&
        previous?.canGoForward === next186.canGoForward
      ) {
        return current;
      }
      return { ...current, [field186]: next186 };
    });
  }

  function scrollStoreShelf186(field186: string) {
    const shelf186 = Array.from(
      document.querySelectorAll<HTMLDivElement>(
        "[data-darik-home-store-shelf-186]"
      )
    ).find(
      (element) => element.dataset.darikHomeStoreShelf186 === field186
    );

    if (!shelf186) return;
    const card186 = shelf186.querySelector<HTMLElement>(
      ".darikHomeStoreCard186"
    );
    const cardWidth186 = card186?.getBoundingClientRect().width ?? 184;
    const computed186 = window.getComputedStyle(shelf186);
    const gap186 =
      Number.parseFloat(computed186.columnGap || computed186.gap || "0") || 0;
    const main186 = shelf186.closest("main");
    const rtl186 = main186?.getAttribute("dir") === "rtl";
    const amount186 = Math.max(
      cardWidth186 + gap186,
      shelf186.clientWidth * 0.72
    );

    shelf186.scrollBy({
      left: rtl186 ? -amount186 : amount186,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const shelves186 = Array.from(
      document.querySelectorAll<HTMLDivElement>(
        "[data-darik-home-store-shelf-186]"
      )
    );
    if (shelves186.length === 0) return;

    const sync186 = () => {
      for (const shelf186 of shelves186) {
        const field186 = shelf186.dataset.darikHomeStoreShelf186;
        if (field186) updateStoreShelfState186(field186, shelf186);
      }
    };

    const frame186 = window.requestAnimationFrame(sync186);
    const observer186 =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(sync186)
        : null;
    shelves186.forEach((shelf186) => observer186?.observe(shelf186));
    window.addEventListener("resize", sync186);

    return () => {
      window.cancelAnimationFrame(frame186);
      observer186?.disconnect();
      window.removeEventListener("resize", sync186);
    };
  }, [groupedStores]);
  const heroCounts = useMemo(() => {
    return ["groceries", "pharmacy", "fashion", "technology"].map((key) => {
      const group = categoryGroups.find((item) => item.key === key)!;
      return { group, count: storeCounts.get(group.key) || 0 };
    });
  }, [storeCounts]);

  return (
    <main
      className={styles.page}
      dir={language === "ar" ? "rtl" : "ltr"}
      data-location-selected={location ? "true" : "false"}
    >
      {/* DARIK_SHARED_PERSISTENT_CUSTOMER_ACCOUNT_HUB_175_V2 */}
      <DarikCustomerAccountHub175 scope="all" />

      {/* DARIK_REAL_LOGO_POPUP_AND_HOME_174 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            className={[styles.mobileMenuButton, styles.headerMenu246].join(" ")}
            type="button"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label="Open navigation"
            aria-expanded={mobileNavOpen}
          >
            <Icon name="menu" />
          </button>

          <a className={styles.brand} href="/" aria-label="Darik Marketplace home">
            <img
              className={styles.brandLogo}
              src="/darik_logo_final_v2.png"
              alt="Darik Marketplace"
            />
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

      <section className={styles.discoveryToolbar246}>
        <div className={styles.discoveryToolbarInner246}>
          <button
            className={styles.discoveryLocation246}
            type="button"
            onClick={() => setLocationDialogOpen(true)}
          >
            <span className={styles.discoveryLocationIcon246}>
              <Icon name="location" size={24} />
            </span>

            <span className={styles.discoveryLocationText246}>
              <small>
                {location ? t.deliveringTo : t.locationRequired}
              </small>
              <strong>
                {location?.label || t.useLocation}
              </strong>
            </span>

            <span className={styles.discoveryLocationChange246}>
              <strong>{t.changeLocation}</strong>
              <small>{language === "ar" ? "تغيير الموقع" : "Change"}</small>
            </span>
          </button>

          <div className={styles.discoverySearchRow246}>
            <DarikJordanDirectorySearch295
                className={styles.discoverySearch246}
              />

            <button
              className={[
                styles.discoveryFilterButton246,
                filterOpen246 || selectedCategory246 !== "all"
                  ? styles.discoveryFilterButtonActive246
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              type="button"
              onClick={() => setFilterOpen246((open) => !open)}
              aria-label={
                language === "ar"
                  ? "فلترة المتاجر"
                  : "Filter stores"
              }
              aria-expanded={filterOpen246}
              disabled={!location}
            >
              <Icon name="filter" size={22} />
            </button>
          </div>

          {filterOpen246 && location ? (
            <div className={styles.discoveryFilterPanel246}>
              <div className={styles.filterSheetHandle246E} />

              <div className={styles.discoveryFilterHeading246}>
                <div>
                  <strong>
                    {language === "ar" ? "رتّب وفلتر المتاجر" : "Sort & filter stores"}
                  </strong>
                  <small>
                    {language === "ar"
                      ? "اعرض النتائج بالطريقة الأنسب لك."
                      : "Refine the stores that deliver to your location."}
                  </small>
                </div>

                {sortMode246E !== "recommended" ||
                openOnly246E ||
                freeDeliveryOnly246E ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSortMode246E("recommended");
                      setOpenOnly246E(false);
                      setFreeDeliveryOnly246E(false);
                    }}
                  >
                    {language === "ar" ? "إعادة" : "Reset"}
                  </button>
                ) : null}
              </div>

              <div className={styles.filterSection246E}>
                <span className={styles.filterLabel246E}>
                  {language === "ar" ? "الترتيب" : "Sort by"}
                </span>

                <div className={styles.filterSortGrid246E}>
                  <button
                    type="button"
                    aria-pressed={sortMode246E === "recommended"}
                    className={
                      sortMode246E === "recommended"
                        ? styles.filterChoiceActive246E
                        : ""
                    }
                    onClick={() => setSortMode246E("recommended")}
                  >
                    <Icon name="sparkle" size={17} />
                    <strong>
                      {language === "ar" ? "مقترح" : "Recommended"}
                    </strong>
                  </button>

                  <button
                    type="button"
                    aria-pressed={sortMode246E === "nearest"}
                    className={
                      sortMode246E === "nearest"
                        ? styles.filterChoiceActive246E
                        : ""
                    }
                    onClick={() => setSortMode246E("nearest")}
                  >
                    <Icon name="location" size={17} />
                    <strong>
                      {language === "ar" ? "الأقرب" : "Nearest"}
                    </strong>
                  </button>

                  <button
                    type="button"
                    aria-pressed={sortMode246E === "delivery"}
                    className={
                      sortMode246E === "delivery"
                        ? styles.filterChoiceActive246E
                        : ""
                    }
                    onClick={() => setSortMode246E("delivery")}
                  >
                    <Icon name="shop" size={17} />
                    <strong>
                      {language === "ar" ? "أقل توصيل" : "Lowest delivery"}
                    </strong>
                  </button>
                </div>
              </div>

              <div className={styles.filterSection246E}>
                <span className={styles.filterLabel246E}>
                  {language === "ar" ? "خيارات" : "Options"}
                </span>

                <button
                  type="button"
                  className={styles.filterToggleRow246E}
                  aria-pressed={openOnly246E}
                  onClick={() => setOpenOnly246E((current) => !current)}
                >
                  <span className={styles.filterToggleIcon246E}>
                    <Icon name="check" size={16} />
                  </span>
                  <span>
                    <strong>
                      {language === "ar"
                        ? "يستقبل الطلبات الآن"
                        : "Accepting orders now"}
                    </strong>
                    <small>
                      {language === "ar"
                        ? "إخفاء المتاجر المغلقة أو العرض فقط."
                        : "Hide closed and showcase-only stores."}
                    </small>
                  </span>
                  <i
                    className={
                      openOnly246E
                        ? styles.filterSwitchActive246E
                        : ""
                    }
                  />
                </button>

                <button
                  type="button"
                  className={styles.filterToggleRow246E}
                  aria-pressed={freeDeliveryOnly246E}
                  onClick={() =>
                    setFreeDeliveryOnly246E((current) => !current)
                  }
                >
                  <span className={styles.filterToggleIcon246E}>
                    <Icon name="shop" size={16} />
                  </span>
                  <span>
                    <strong>
                      {language === "ar"
                        ? "توصيل مجاني"
                        : "Free delivery"}
                    </strong>
                    <small>
                      {language === "ar"
                        ? "إظهار المتاجر ذات رسوم التوصيل صفر."
                        : "Only stores with a zero delivery fee."}
                    </small>
                  </span>
                  <i
                    className={
                      freeDeliveryOnly246E
                        ? styles.filterSwitchActive246E
                        : ""
                    }
                  />
                </button>
              </div>

              <button
                className={styles.filterDone246E}
                type="button"
                onClick={() => setFilterOpen246(false)}
              >
                <span>
                  {language === "ar"
                    ? `عرض ${visibleStores246B.length} متجر`
                    : `Show ${visibleStores246B.length} ${
                        visibleStores246B.length === 1 ? "store" : "stores"
                      }`}
                </span>
                <Icon name="arrow" size={17} />
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {categoryBrowserOpen246C ? (
        <div
          className={styles.categoryBrowserBackdrop246C}
          role="dialog"
          aria-modal="true"
          aria-label={
            language === "ar"
              ? "تصفح فئات المتاجر"
              : "Browse store categories"
          }
        >
          <section className={styles.categoryBrowser246C}>
            <header className={styles.categoryBrowserHeader246C}>
              <button
                type="button"
                onClick={() => setCategoryBrowserOpen246C(false)}
                aria-label={language === "ar" ? "إغلاق" : "Close"}
              >
                <Icon name="chevron" size={20} />
              </button>

              <div>
                <strong>
                  {language === "ar" ? "الفئات" : "Categories"}
                </strong>
                <small>
                  {language === "ar"
                    ? "اختر نوع المتاجر التي تريدها"
                    : "Choose the kind of stores you want"}
                </small>
              </div>

              <span className={styles.categoryBrowserSearchIcon246C}>
                <Icon name="search" size={20} />
              </span>
            </header>

            <div className={styles.categoryBrowserGrid246C}>
              {categoryGroups
                .filter((group) => group.key !== "all")
                .map((group) => {
                  const previewStore246C = stores.find(
                    (store) => storeGroupKey(store) === group.key
                  );
                  const previewImage246C = safeImageUrl(
                    previewStore246C?.hero_image_url
                  );
                  const count246C = storeCounts.get(group.key) || 0;
                  const primary246C = safeColor(
                    previewStore246C?.primary_color,
                    "#101828"
                  );
                  const accent246C = safeColor(
                    previewStore246C?.accent_color,
                    "#ffcc33"
                  );

                  return (
                    <button
                      type="button"
                      key={group.key}
                      className={styles.categoryBrowserCard246C}
                      onClick={() => {
                        setSelectedCategory246(group.key);
                        setCategoryBrowserOpen246C(false);
                      }}
                    >
                      <span
                        className={styles.categoryBrowserImage246C}
                        style={
                          previewImage246C
                            ? {
                                backgroundImage: `linear-gradient(180deg, rgba(8,15,29,.03), rgba(8,15,29,.18)), url(${JSON.stringify(previewImage246C)})`,
                              }
                            : {
                                backgroundImage: `radial-gradient(circle at 72% 18%, ${accent246C}85, transparent 34%), linear-gradient(145deg, ${primary246C}, #111827)`,
                              }
                        }
                      >
                        {!previewImage246C ? (
                          <span>
                            <Icon name={group.icon} size={28} />
                          </span>
                        ) : null}
                      </span>

                      <span className={styles.categoryBrowserCardBody246C}>
                        <strong>{categoryLabel(group, language)}</strong>
                        <small>
                          {count246C}{" "}
                          {count246C === 1 ? t.store : t.storesCount}
                        </small>
                      </span>
                    </button>
                  );
                })}
            </div>
          </section>
        </div>
      ) : null}

      <section className={styles.heroSection}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}><Icon name="sparkle" size={16} />{t.eyebrow}</div>
            <h1><span>{t.heroTitleA}</span><strong>{t.heroTitleB}</strong></h1>
            <p className={styles.heroBody}>{t.heroBody}</p>

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
              <strong className={styles.storeCount246B}>
                {visibleStores246B.length}{" "}
                {visibleStores246B.length === 1 ? t.store : t.storesCount}
              </strong>
            ) : null}
          </div>

          {location ? (
            <div className={styles.categoryTabs246B} aria-label="Store categories">
              {categoryGroups.map((group) => {
                const active246B = selectedCategory246 === group.key;
                const count246B = storeCounts.get(group.key) || 0;

                return (
                  <button
                    type="button"
                    key={group.key}
                    className={
                      active246B
                        ? styles.categoryTabActive246B
                        : ""
                    }
                    onClick={() => setSelectedCategory246(group.key)}
                  >
                    <span>
                      <Icon name={group.icon} size={15} />
                    </span>
                    <strong>{categoryLabel(group, language)}</strong>
                    <small>{count246B}</small>
                  </button>
                );
              })}

            </div>
          ) : null}

          {location ? (
            <button
              type="button"
              className={styles.categoryBrowseStandalone246C4}
              onClick={() => setCategoryBrowserOpen246C(true)}
            >
              <span className={styles.categoryBrowseStandaloneIcon246C4}>
                <Icon name="grid" size={17} />
              </span>

              <span className={styles.categoryBrowseStandaloneText246C4}>
                <strong>
                  {language === "ar" ? "تصفح جميع الفئات" : "Browse all categories"}
                </strong>
                <small>
                  {language === "ar"
                    ? "شاهد المتاجر حسب النوع"
                    : "See stores grouped by type"}
                </small>
              </span>

              <span className={styles.categoryBrowseStandaloneArrow246C4}>
                <Icon name="chevron" size={16} />
              </span>
            </button>
          ) : null}

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
          ) : visibleStores246B.length ? (
            <div className="darikMarketplaceStoreList246B">
              {renderedStores318D.map((store) => (
                <HomeStoreCard186
                  key={store.storefront_id}
                  store={store}
                  language={language}
                  special={
                    specialDeliveryBySlug186[store.slug.toLowerCase()] ?? null
                  }
                  bestSellers249={
                    bestSellerProductsBySlug249[
                      store.slug.trim().toLowerCase()
                    ]
                  }
                />
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
                <a href="/store-signup">
                  {t.startFree}
                  <Icon name="arrow" size={19} />
                </a>

                <a href="/store-dashboard">
                  <Icon name="user" size={19} />
                  {t.openDashboard}
                </a>

                <a href="/pricing">
                  <Icon name="sparkle" size={19} />
                  {t.pricing}
                </a>
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
            <a className={styles.brand} href="/" aria-label="Darik Marketplace home"><img className={styles.brandLogo} src="/darik_logo_final_v2.png" alt="Darik Marketplace" /></a>
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
