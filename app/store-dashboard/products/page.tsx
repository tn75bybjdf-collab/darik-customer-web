"use client";
// DARIK_MECHANICS_LAB_048
// DARIK_GROCERY_WEIGHT_3_PHOTO_049
// DARIK_RETAIL_FIELDS_SMOKE_SHOP_050
// DARIK_SHOE_SIZES_051
// DARIK_FOOTWEAR_SIZE_DROPDOWNS_052
// DARIK_SHOE_CATEGORY_SIZE_GROUPS_053
// DARIK_AUTO_MATCH_US_SHOE_SIZES_054
// DARIK_SHOES_RETAIL_FINAL_056

// DARIK_AUTOPARTS_FITMENT_FILTERS_033
// Mobile-safe bilingual product form with automatic retail categories.

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
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import {
  mechanicsFieldLabel,
  readMechanicsLabField,
  withMechanicsPreview,
} from "@/lib/darikMechanicsLab";
import { getBusinessCategoryPreset } from "../categories/categoryPresetOverrides";
import DashboardLogoutButton from "../components/DashboardLogoutButton";
import styles from "./products.module.css";

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
};

type ContextResult = {
  ok: boolean;
  auth_user_id: string | null;
  auth_email: string | null;
  stores: StoreContext[];
};

type Category = {
  id: string;
  retailer_id: string;
  name: string;
  name_ar: string | null;
  category_status: "active" | "hidden" | "archived";
  sort_order: number | string;
};

type ShoeSizeOption = {
  eu: string;
  us: string;
};

const EU_SHOE_SIZE_OPTIONS = Array.from({ length: 79 }, (_, index) => {
  const size = 16 + index * 0.5;
  return Number.isInteger(size) ? String(size) : size.toFixed(1);
});

const US_CHILD_SHOE_SIZE_OPTIONS = Array.from({ length: 26 }, (_, index) => {
  const size = 1 + index * 0.5;
  const label = Number.isInteger(size) ? String(size) : size.toFixed(1);
  return `${label}C`;
});

const US_YOUTH_SHOE_SIZE_OPTIONS = Array.from({ length: 13 }, (_, index) => {
  const size = 1 + index * 0.5;
  const label = Number.isInteger(size) ? String(size) : size.toFixed(1);
  return `${label}Y`;
});

const US_ADULT_SHOE_SIZE_OPTIONS = Array.from({ length: 43 }, (_, index) => {
  const size = 1 + index * 0.5;
  return Number.isInteger(size) ? String(size) : size.toFixed(1);
});

type FootwearSizeGroup =
  | "men"
  | "women"
  | "kids"
  | "baby_toddler"
  | "unisex";

const EU_THIRD_SHOE_SIZE_OPTIONS = [
  "35 1/3",
  "35 2/3",
  "36 1/3",
  "36 2/3",
  "37 1/3",
  "37 2/3",
  "38 1/3",
  "38 2/3",
  "39 1/3",
  "39 2/3",
  "40 1/3",
  "40 2/3",
  "41 1/3",
  "41 2/3",
  "42 1/3",
  "42 2/3",
  "43 1/3",
  "43 2/3",
  "44 1/3",
  "44 2/3",
  "45 1/3",
  "45 2/3",
  "46 1/3",
  "46 2/3",
  "47 1/3",
  "47 2/3",
  "48 1/3",
  "48 2/3",
  "49 1/3",
  "49 2/3",
  "50 1/3",
  "50 2/3",
  "51 1/3",
  "51 2/3",
  "52 1/3",
  "52 2/3",
  "53 1/3",
  "53 2/3",
  "54 1/3",
  "54 2/3",
  "55 1/3",
  "55 2/3",
] as const;

const FOOTWEAR_GROUP_LABELS: Record<
  FootwearSizeGroup,
  { en: string; ar: string }
> = {
  men: { en: "Men's Footwear", ar: "أحذية رجالية" },
  women: { en: "Women's Footwear", ar: "أحذية نسائية" },
  kids: { en: "Kids' Footwear", ar: "أحذية أطفال" },
  baby_toddler: {
    en: "Baby & Toddler Footwear",
    ar: "أحذية رضع وصغار",
  },
  unisex: { en: "Unisex Footwear", ar: "أحذية للجنسين" },
};

function footwearSizeGroupFromCategoryName(
  categoryName: string | null | undefined
): FootwearSizeGroup | null {
  const key = normalizedCategoryKey(categoryName);

  if (
    key === "baby & toddler footwear" ||
    key === "baby and toddler footwear" ||
    key.startsWith("baby ") ||
    key.startsWith("toddler ")
  ) {
    return "baby_toddler";
  }

  if (
    key === "kids' footwear" ||
    key === "kids footwear" ||
    key === "children's footwear" ||
    key === "children footwear" ||
    key.startsWith("kids ") ||
    key.startsWith("children ") ||
    key.startsWith("boys ") ||
    key.startsWith("girls ")
  ) {
    return "kids";
  }

  if (
    key === "women's footwear" ||
    key === "womens footwear" ||
    key === "women footwear" ||
    key.startsWith("women's ") ||
    key.startsWith("womens ") ||
    key.startsWith("women ")
  ) {
    return "women";
  }

  if (
    key === "men's footwear" ||
    key === "mens footwear" ||
    key === "men footwear" ||
    key.startsWith("men's ") ||
    key.startsWith("mens ") ||
    key.startsWith("men ")
  ) {
    return "men";
  }

  if (key === "unisex footwear" || key.startsWith("unisex ")) {
    return "unisex";
  }

  return null;
}

function numericShoeSize(value: string) {
  const [wholeText, fractionText] = String(value).trim().split(/s+/, 2);
  const whole = Number.parseFloat(wholeText);
  if (!Number.isFinite(whole)) return 0;

  if (fractionText === "1/3") return whole + 1 / 3;
  if (fractionText === "2/3") return whole + 2 / 3;

  return whole;
}

function euSizesForGroup(group: FootwearSizeGroup) {
  const ranges: Record<FootwearSizeGroup, [number, number]> = {
    baby_toddler: [16, 27],
    kids: [25, 40],
    women: [33.5, 50],
    men: [35.5, 55],
    unisex: [33.5, 55],
  };
  const [min, max] = ranges[group];

  const candidates =
    group === "baby_toddler" || group === "kids"
      ? [...EU_SHOE_SIZE_OPTIONS]
      : [...EU_SHOE_SIZE_OPTIONS, ...EU_THIRD_SHOE_SIZE_OPTIONS];

  return Array.from(new Set(candidates))
    .filter((value) => {
      const size = numericShoeSize(value);
      return size >= min && size <= max;
    })
    .sort((left, right) => numericShoeSize(left) - numericShoeSize(right));
}

function usSizesForGroup(group: FootwearSizeGroup) {
  if (group === "baby_toddler") {
    return US_CHILD_SHOE_SIZE_OPTIONS.filter(
      (value) => numericShoeSize(value) <= 10
    );
  }

  if (group === "kids") {
    return [
      ...US_CHILD_SHOE_SIZE_OPTIONS.filter(
        (value) => numericShoeSize(value) >= 8
      ),
      ...US_YOUTH_SHOE_SIZE_OPTIONS,
    ];
  }

  const max = group === "women" ? 16.5 : 20.5;
  return US_ADULT_SHOE_SIZE_OPTIONS.filter((value) => {
    const size = numericShoeSize(value);
    return size >= 3.5 && size <= max;
  });
}

type ShoeSizeConversionPoint = {
  eu: string;
  us: string;
};

const MEN_US_SIZE_REFERENCE: ShoeSizeConversionPoint[] = [
  ["35.5", "3.5"], ["36", "4"], ["36.5", "4.5"], ["37.5", "5"],
  ["38", "5.5"], ["38.5", "6"], ["39", "6.5"], ["40", "7"],
  ["40.5", "7.5"], ["41", "8"], ["42", "8.5"], ["42.5", "9"],
  ["43", "9.5"], ["44", "10"], ["44.5", "10.5"], ["45", "11"],
  ["45.5", "11.5"], ["46", "12"], ["47", "12.5"], ["47.5", "13"],
  ["48", "13.5"], ["48.5", "14"], ["49", "14.5"], ["49.5", "15"],
  ["50", "15.5"], ["50.5", "16"], ["51", "16.5"], ["51.5", "17"],
  ["52", "17.5"], ["52.5", "18"], ["53", "18.5"], ["53.5", "19"],
  ["54", "19.5"], ["54.5", "20"], ["55", "20.5"],
].map(([eu, us]) => ({ eu, us }));

const WOMEN_US_SIZE_REFERENCE: ShoeSizeConversionPoint[] = [
  ["33.5", "3.5"], ["34.5", "4"], ["35", "4.5"], ["35.5", "5"],
  ["36", "5.5"], ["36.5", "6"], ["37.5", "6.5"], ["38", "7"],
  ["38.5", "7.5"], ["39", "8"], ["40", "8.5"], ["40.5", "9"],
  ["41", "9.5"], ["42", "10"], ["42.5", "10.5"], ["43", "11"],
  ["44", "11.5"], ["44.5", "12"], ["45", "12.5"], ["45.5", "13"],
  ["46", "13.5"], ["47", "14"], ["47.5", "14.5"], ["48", "15"],
  ["48.5", "15.5"], ["49", "16"], ["50", "16.5"],
].map(([eu, us]) => ({ eu, us }));

const BABY_TODDLER_US_SIZE_REFERENCE: ShoeSizeConversionPoint[] = [
  ["16", "1C"], ["17", "2C"], ["18", "3C"], ["19", "4C"],
  ["20", "5C"], ["21", "5.5C"], ["22", "6C"], ["23", "6.5C"],
  ["23.5", "7C"], ["24", "7.5C"], ["25", "8C"], ["25.5", "8.5C"],
  ["26", "9C"], ["26.5", "9.5C"], ["27", "10C"],
].map(([eu, us]) => ({ eu, us }));

const KIDS_US_SIZE_REFERENCE: ShoeSizeConversionPoint[] = [
  ["25", "8C"], ["25.5", "8.5C"], ["26", "9C"], ["26.5", "9.5C"],
  ["27", "10C"], ["28", "10.5C"], ["28.5", "11C"], ["29", "11.5C"],
  ["30", "12C"], ["30.5", "12.5C"], ["31", "13C"], ["31.5", "13.5C"],
  ["32", "1Y"], ["33", "1.5Y"], ["33.5", "2Y"], ["34", "2.5Y"],
  ["35", "3Y"], ["35.5", "3.5Y"], ["36", "4Y"], ["36.5", "4.5Y"],
  ["37", "5Y"], ["37.5", "5.5Y"], ["38", "5.5Y"], ["38.5", "6Y"],
  ["39", "6.5Y"], ["39.5", "7Y"], ["40", "7Y"],
].map(([eu, us]) => ({ eu, us }));

function defaultUsSizeForEu(group: FootwearSizeGroup, euValue: string) {
  if (!euValue.trim()) return "";

  const reference =
    group === "baby_toddler"
      ? BABY_TODDLER_US_SIZE_REFERENCE
      : group === "kids"
        ? KIDS_US_SIZE_REFERENCE
        : group === "women"
          ? WOMEN_US_SIZE_REFERENCE
          : MEN_US_SIZE_REFERENCE;

  const target = numericShoeSize(euValue);
  let closest = reference[0];
  let closestDistance = Math.abs(numericShoeSize(closest.eu) - target);

  for (const point of reference.slice(1)) {
    const distance = Math.abs(numericShoeSize(point.eu) - target);
    if (
      distance < closestDistance ||
      (distance === closestDistance &&
        numericShoeSize(point.eu) > numericShoeSize(closest.eu))
    ) {
      closest = point;
      closestDistance = distance;
    }
  }

  const allowed = new Set(usSizesForGroup(group));
  return allowed.has(closest.us) ? closest.us : "";
}

type RetailSizePreset = {
  key: string;
  label: { en: string; ar: string };
  required: boolean;
  options: readonly string[];
  help: { en: string; ar: string };
};

const CUSTOM_RETAIL_SIZE_VALUE = "__darik_custom_size__";

const ADULT_CLOTHING_SIZE_OPTIONS = [
  "One Size", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL", "6XL",
] as const;

const KIDS_CLOTHING_SIZE_OPTIONS = [
  "XS", "S", "M", "L", "XL",
  "2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "9Y", "10Y", "11Y", "12Y", "13Y", "14Y", "15Y", "16Y",
  "92 cm", "98 cm", "104 cm", "110 cm", "116 cm", "122 cm", "128 cm", "134 cm", "140 cm", "146 cm", "152 cm", "158 cm", "164 cm", "170 cm", "176 cm",
] as const;

const BABY_CLOTHING_SIZE_OPTIONS = [
  "Newborn", "0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2T", "3T", "4T", "5T",
] as const;

const SOCK_SIZE_OPTIONS = [
  "One Size", "XS", "S", "S/M", "M", "M/L", "L", "L/XL", "XL", "XXL",
  "EU 16-18", "EU 19-22", "EU 23-26", "EU 27-30", "EU 31-34", "EU 35-38", "EU 39-42", "EU 43-46", "EU 47-50",
] as const;

const HAT_SIZE_OPTIONS = [
  "Adjustable / One Size", "XS", "S", "S/M", "M", "M/L", "L", "L/XL", "XL", "XXL",
  "6 3/8", "6 1/2", "6 5/8", "6 3/4", "6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8", "7 3/4", "7 7/8", "8", "8 1/8",
  "52 cm", "53 cm", "54 cm", "55 cm", "56 cm", "57 cm", "58 cm", "59 cm", "60 cm", "61 cm", "62 cm", "63 cm", "64 cm",
] as const;

const BAG_SIZE_OPTIONS = [
  "One Size", "Mini", "Small", "Medium", "Large", "XL",
  "10 L", "15 L", "20 L", "25 L", "30 L", "35 L", "40 L", "45 L", "50 L",
] as const;

const BELT_SIZE_OPTIONS = [
  "One Size / Adjustable", "XS", "S", "M", "L", "XL", "XXL", "XXXL",
  ...Array.from({ length: 18 }, (_, index) => String(65 + index * 5) + " cm"),
  ...Array.from({ length: 18 }, (_, index) => String(26 + index * 2) + " in"),
];

const WALLET_SIZE_OPTIONS = ["One Size", "Small", "Medium", "Large"] as const;

const INSOLE_SIZE_OPTIONS = [
  ...EU_SHOE_SIZE_OPTIONS.map((value) => "EU " + value),
  "EU 16-18", "EU 19-21", "EU 22-24", "EU 25-27", "EU 28-30", "EU 31-33", "EU 34-36",
  "EU 35-38", "EU 37-40", "EU 39-42", "EU 41-44", "EU 43-46", "EU 45-48", "EU 47-50",
];

const SHOELACE_SIZE_OPTIONS = [
  "45 cm", "60 cm", "75 cm", "90 cm", "100 cm", "110 cm", "120 cm", "130 cm", "140 cm", "150 cm", "160 cm", "180 cm", "200 cm",
] as const;

function retailSizePresetFromCategoryName(
  categoryName: string | null | undefined
): RetailSizePreset | null {
  const key = normalizedCategoryKey(categoryName);

  if (["men's clothing", "mens clothing", "women's clothing", "womens clothing", "unisex clothing", "clothing"].includes(key)) {
    return {
      key: "adult_clothing",
      label: { en: "Clothing sizes", ar: "مقاسات الملابس" },
      required: true,
      options: ADULT_CLOTHING_SIZE_OPTIONS,
      help: { en: "Standard apparel sizes. Add a custom brand size if needed.", ar: "مقاسات ملابس قياسية، ويمكن إضافة مقاس خاص بالعلامة التجارية عند الحاجة." },
    };
  }

  if (["kids' clothing", "kids clothing", "children's clothing", "children clothing"].includes(key)) {
    return {
      key: "kids_clothing",
      label: { en: "Kids' clothing sizes", ar: "مقاسات ملابس الأطفال" },
      required: true,
      options: KIDS_CLOTHING_SIZE_OPTIONS,
      help: { en: "Age and common height-based kids' sizes are available.", ar: "تتوفر مقاسات الأطفال حسب العمر والطول الشائع." },
    };
  }

  if (["baby & toddler clothing", "baby and toddler clothing", "baby clothing", "toddler clothing"].includes(key)) {
    return {
      key: "baby_clothing",
      label: { en: "Baby & toddler clothing sizes", ar: "مقاسات ملابس الرضع والصغار" },
      required: true,
      options: BABY_CLOTHING_SIZE_OPTIONS,
      help: { en: "Newborn, month ranges, and toddler sizes.", ar: "مقاسات حديثي الولادة والأشهر ومقاسات الصغار." },
    };
  }

  if (key === "socks" || key.endsWith(" socks")) {
    return {
      key: "socks",
      label: { en: "Sock sizes", ar: "مقاسات الجوارب" },
      required: true,
      options: SOCK_SIZE_OPTIONS,
      help: { en: "Choose alpha, one-size, or EU shoe-size ranges.", ar: "اختر المقاس الحرفي أو المقاس الموحد أو نطاق المقاسات الأوروبية." },
    };
  }

  if (["hats & caps", "hats and caps", "hats", "caps"].includes(key)) {
    return {
      key: "hats_caps",
      label: { en: "Hat & cap sizes", ar: "مقاسات القبعات والكابات" },
      required: true,
      options: HAT_SIZE_OPTIONS,
      help: { en: "Includes adjustable, alpha, and head-circumference sizes.", ar: "يشمل المقاس القابل للتعديل والمقاسات الحرفية ومحيط الرأس." },
    };
  }

  if (["bags & backpacks", "bags and backpacks", "bags", "backpacks"].includes(key)) {
    return {
      key: "bags",
      label: { en: "Bag / backpack size", ar: "حجم الحقيبة / حقيبة الظهر" },
      required: false,
      options: BAG_SIZE_OPTIONS,
      help: { en: "Optional. Use physical size or capacity when the product has variants.", ar: "اختياري. استخدم الحجم أو السعة عندما يتوفر المنتج بعدة خيارات." },
    };
  }

  if (key === "belts" || key === "belt") {
    return {
      key: "belts",
      label: { en: "Belt sizes", ar: "مقاسات الأحزمة" },
      required: true,
      options: BELT_SIZE_OPTIONS,
      help: { en: "Alpha, centimeter, and inch belt sizes are supported.", ar: "يدعم المقاسات الحرفية والسنتيمتر والإنش للأحزمة." },
    };
  }

  if (key === "wallets" || key === "wallet") {
    return {
      key: "wallets",
      label: { en: "Wallet size", ar: "حجم المحفظة" },
      required: false,
      options: WALLET_SIZE_OPTIONS,
      help: { en: "Optional for wallets that come in multiple physical sizes.", ar: "اختياري للمحافظ التي تتوفر بأكثر من حجم." },
    };
  }

  if (["insoles & inserts", "insoles and inserts", "insoles", "shoe inserts"].includes(key)) {
    return {
      key: "insoles",
      label: { en: "Insole sizes", ar: "مقاسات الفرشات والنعال الداخلية" },
      required: true,
      options: INSOLE_SIZE_OPTIONS,
      help: { en: "Choose an EU size or a trim-to-fit EU range.", ar: "اختر مقاسًا أوروبيًا أو نطاقًا أوروبيًا للفرشات القابلة للقص." },
    };
  }

  if (["shoelaces", "shoe laces", "laces"].includes(key)) {
    return {
      key: "shoelaces",
      label: { en: "Shoelace lengths", ar: "أطوال أربطة الأحذية" },
      required: true,
      options: SHOELACE_SIZE_OPTIONS,
      help: { en: "Laces are sized by length in centimeters.", ar: "يتم تحديد مقاس الأربطة حسب الطول بالسنتيمتر." },
    };
  }

  return null;
}

type DirectProduct = {
  id: string;
  retailer_id: string;
  category_id: string | null;
  direct_store_category_id: string | null;
  name: string;
  retailer_submitted_name: string | null;
  official_marketplace_name: string | null;
  official_marketplace_name_ar: string | null;
  brand_name: string | null;
  quantity_in_stock: number | string;
  direct_inventory_tracking_enabled: boolean;
  product_status: string;
  marketplace_visible: boolean;
  storefront_visible: boolean;
  storefront_featured: boolean;
  storefront_sort_order: number | string;
  direct_name: string | null;
  direct_name_ar: string | null;
  direct_description: string | null;
  direct_price: number | string | null;
  direct_compare_at_price: number | string | null;
  direct_pricing_mode: "price" | "call" | "whatsapp" | "call_whatsapp" | null;
  direct_availability_status: "available" | "out_of_stock" | null;
  direct_vehicle_year_from: number | string | null;
  direct_vehicle_year_to: number | string | null;
  direct_vehicle_make: string | null;
  direct_vehicle_model: string | null;
  direct_photo_url: string | null;
  retailer_raw_photo_url_2: string | null;
  retailer_raw_photo_url_3: string | null;
  direct_sold_by_weight: boolean;
  direct_weight_unit: string | null;
  direct_weight_step: number | string | null;
  direct_shoe_sizes: Array<{ eu?: string; us?: string | null }> | null;
  direct_shoe_us_sizes_enabled: boolean;
  direct_size_options: Array<{ label?: string }> | null;
  direct_product_status: "draft" | "published" | "paused" | "archived";
  direct_updated_at: string | null;
  created_at: string;
};

type ProductForm = {
  name: string;
  nameAr: string;
  description: string;
  brandName: string;
  directCategoryId: string;
  price: string;
  compareAtPrice: string;
  pricingMode: "price" | "call" | "whatsapp" | "call_whatsapp";
  availabilityStatus: "available" | "out_of_stock";
  vehicleYearFrom: string;
  vehicleYearTo: string;
  vehicleMake: string;
  vehicleModel: string;
  soldByWeight: boolean;
  shoeSizes: ShoeSizeOption[];
  shoeUsSizesEnabled: boolean;
  sizeOptions: string[];
  trackInventory: boolean;
  quantity: string;
  photoUrl: string;
  photoUrl2: string;
  photoUrl3: string;
  status: "draft" | "published" | "paused";
  featured: boolean;
  sortOrder: string;
};

const emptyForm: ProductForm = {
  name: "",
  nameAr: "",
  description: "",
  brandName: "",
  directCategoryId: "",
  price: "",
  compareAtPrice: "",
  pricingMode: "price",
  availabilityStatus: "available",
  vehicleYearFrom: "",
  vehicleYearTo: "",
  vehicleMake: "",
  vehicleModel: "",
  soldByWeight: false,
  shoeSizes: [],
  shoeUsSizesEnabled: false,
  sizeOptions: [],
  trackInventory: false,
  quantity: "0",
  photoUrl: "",
  photoUrl2: "",
  photoUrl3: "",
  status: "published",
  featured: false,
  sortOrder: "1000",
};

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function abbreviateCategoryName(value: string | null, maxLength = 26) {
  const clean = String(value ?? "").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
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

function vehicleFitmentLabel(product: DirectProduct) {
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

function categoryOptionLabel(category: Category, isAutoPartsStore = false) {
  const english = abbreviateCategoryName(category.name);
  const arabic = abbreviateCategoryName(
    isAutoPartsStore ? cleanAutoPartsCategoryArabic(category) : category.name_ar
  );
  const bilingual = arabic ? `${english} / ${arabic}` : english;
  return category.category_status === "hidden"
    ? `${bilingual} (hidden / مخفية)`
    : bilingual;
}

type PhotoField = "photoUrl" | "photoUrl2" | "photoUrl3";

type MechanicsPresetCategory = {
  value: string;
  name: string;
  nameAr: string;
  sortOrder: number;
};

const PRODUCT_PHOTO_SLOTS: Array<{
  field: PhotoField;
  label: string;
  labelAr: string;
  primary: boolean;
}> = [
  { field: "photoUrl", label: "Photo 1", labelAr: "الصورة 1", primary: true },
  { field: "photoUrl2", label: "Photo 2", labelAr: "الصورة 2", primary: false },
  { field: "photoUrl3", label: "Photo 3", labelAr: "الصورة 3", primary: false },
];

const WEIGHT_MECHANICS_FIELDS = new Set([
  "supermarket",
  "bakery",
  "smoke_shop",
]);

function normalizedCategoryKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePresetCategory(value: unknown, index: number): MechanicsPresetCategory | null {
  if (typeof value === "string") {
    const name = value.trim();
    return name
      ? { value: `mechanics:${index}`, name, nameAr: "", sortOrder: (index + 1) * 100 }
      : null;
  }

  if (Array.isArray(value)) {
    const name = String(value[0] ?? "").trim();
    const nameAr = String(value[1] ?? "").trim();
    return name
      ? { value: `mechanics:${index}`, name, nameAr, sortOrder: (index + 1) * 100 }
      : null;
  }

  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const name = String(
    record.name ?? record.label ?? record.nameEn ?? record.name_en ?? record.labelEn ?? record.en ?? ""
  ).trim();
  const nameAr = String(
    record.nameAr ?? record.name_ar ?? record.labelAr ?? record.label_ar ?? record.ar ?? ""
  ).trim();
  const explicitSort = Number(record.sortOrder ?? record.sort_order ?? NaN);
  const sortOrder = Number.isFinite(explicitSort) ? explicitSort : (index + 1) * 100;
  return name ? { value: `mechanics:${index}`, name, nameAr, sortOrder } : null;
}

function productDisplayName(product: DirectProduct) {
  return (
    product.direct_name ||
    product.official_marketplace_name ||
    product.retailer_submitted_name ||
    product.name ||
    "Unnamed product"
  );
}

function BilingualLabel({ en, ar }: { en: string; ar: string }) {
  return (
    <span className={styles.fieldLabel}>
      <span>{en}</span>
      <span dir="rtl">{ar}</span>
    </span>
  );
}

export default function DarikDirectProductsPage() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<DirectProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mechanicsTestField, setMechanicsTestField] = useState("");

  useEffect(() => {
    const syncMechanicsField = () => {
      setMechanicsTestField(readMechanicsLabField());
    };
    syncMechanicsField();
    window.addEventListener("storage", syncMechanicsField);
    return () => window.removeEventListener("storage", syncMechanicsField);
  }, []);
  const modalRef = useRef<HTMLElement | null>(null);

  const selectedStore = useMemo(
    () =>
      context?.stores.find(
        (store) => store.retailer_id === selectedRetailerId
      ) ?? null,
    [context, selectedRetailerId]
  );

  const loadContext = useCallback(async () => {
    const contextResult = await supabase.rpc("darik_direct_get_my_context");

    if (contextResult.error) {
      setError(contextResult.error.message);
      setLoading(false);
      return;
    }

    const nextContext = contextResult.data as ContextResult;
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
  }, []);

  const loadCatalog = useCallback(async () => {
    if (!selectedRetailerId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const ensureResult = await supabase.rpc(
      "darik_direct_ensure_default_categories",
      { p_retailer_id: selectedRetailerId }
    );

    if (ensureResult.error) {
      setError(
        `Could not prepare default departments. / تعذر تجهيز الأقسام الافتراضية. ${ensureResult.error.message}`
      );
    }

    const [productResult, categoryResult] = await Promise.all([
      supabase
        .from("products")
        .select(
          [
            "id",
            "retailer_id",
            "category_id",
            "direct_store_category_id",
            "name",
            "retailer_submitted_name",
            "official_marketplace_name",
            "official_marketplace_name_ar",
            "brand_name",
            "quantity_in_stock",
            "direct_inventory_tracking_enabled",
            "product_status",
            "marketplace_visible",
            "storefront_visible",
            "storefront_featured",
            "storefront_sort_order",
            "direct_name",
            "direct_name_ar",
            "direct_description",
            "direct_price",
            "direct_compare_at_price",
            "direct_pricing_mode",
            "direct_availability_status",
            "direct_vehicle_year_from",
            "direct_vehicle_year_to",
            "direct_vehicle_make",
            "direct_vehicle_model",
            "direct_photo_url",
            "retailer_raw_photo_url_2",
            "retailer_raw_photo_url_3",
            "direct_sold_by_weight",
            "direct_weight_unit",
            "direct_weight_step",
            "direct_shoe_sizes",
            "direct_shoe_us_sizes_enabled",
            "direct_size_options",
            "direct_product_status",
            "direct_updated_at",
            "created_at",
          ].join(",")
        )
        .eq("retailer_id", selectedRetailerId)
        .order("storefront_featured", { ascending: false })
        .order("storefront_sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("retailer_store_categories")
        .select("id,retailer_id,name,name_ar,category_status,sort_order")
        .eq("retailer_id", selectedRetailerId)
        .neq("category_status", "archived")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (productResult.error) {
      setError(productResult.error.message);
      setProducts([]);
    } else {
      setProducts((productResult.data ?? []) as unknown as DirectProduct[]);
    }

    if (!categoryResult.error) {
      setCategories((categoryResult.data ?? []) as unknown as Category[]);
    }

    setLoading(false);
  }, [selectedRetailerId]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);

      if (!data.session) {
        router.replace("/store-dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);

      if (!nextSession) {
        router.replace("/store-dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (session) {
      loadContext();
    }
  }, [session, loadContext]);

  useEffect(() => {
    if (selectedRetailerId) {
      loadCatalog();
    }
  }, [selectedRetailerId, loadCatalog]);

  useEffect(() => {
    if (!formOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      modalRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [formOpen]);

  const filteredProducts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      if (
        statusFilter !== "all" &&
        product.direct_product_status !== statusFilter
      ) {
        return false;
      }

      if (!cleanSearch) return true;

      return [
        productDisplayName(product),
        product.direct_name_ar,
        product.brand_name,
        product.direct_vehicle_make,
        product.direct_vehicle_model,
        product.direct_vehicle_year_from,
        product.direct_vehicle_year_to,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(cleanSearch));
    });
  }, [products, search, statusFilter]);

  const actualBusinessType = String(selectedStore?.business_type || "")
    .trim()
    .toLowerCase();
  const effectiveBusinessType = mechanicsTestField || actualBusinessType;
  const isAutoParts = effectiveBusinessType === "auto_parts";
  const supportsWeightSelling = WEIGHT_MECHANICS_FIELDS.has(effectiveBusinessType);

  const mechanicsPresetCategories = useMemo(() => {
    if (!mechanicsTestField) return [] as MechanicsPresetCategory[];
    const preset = getBusinessCategoryPreset(effectiveBusinessType, null);
    return Array.from(preset.categories as readonly unknown[])
      .map((category, index) => normalizePresetCategory(category, index))
      .filter((category): category is MechanicsPresetCategory => Boolean(category));
  }, [effectiveBusinessType, mechanicsTestField]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const counts = useMemo(() => {
    return {
      total: products.filter(
        (product) => product.direct_product_status !== "archived"
      ).length,
      published: products.filter(
        (product) => product.direct_product_status === "published"
      ).length,
      lowStock: products.filter(
        (product) =>
          product.direct_product_status !== "archived" &&
          product.direct_inventory_tracking_enabled &&
          Number(product.quantity_in_stock ?? 0) > 0 &&
          Number(product.quantity_in_stock ?? 0) <= 3
      ).length,
      outOfStock: products.filter(
        (product) =>
          product.direct_product_status !== "archived" &&
          (product.direct_availability_status === "out_of_stock" ||
            (product.direct_inventory_tracking_enabled &&
              Number(product.quantity_in_stock ?? 0) <= 0))
      ).length,
      featured: products.filter(
        (product) =>
          product.direct_product_status === "published" &&
          product.storefront_featured
      ).length,
    };
  }, [products]);

  function updateForm<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function mechanicsCategoryValueForSavedId(categoryId: string | null) {
    if (!mechanicsTestField || !categoryId) return categoryId || "";
    const savedCategory = categoryById.get(categoryId);
    if (!savedCategory) return "";
    const savedKey = normalizedCategoryKey(savedCategory.name);
    return (
      mechanicsPresetCategories.find(
        (preset) => normalizedCategoryKey(preset.name) === savedKey
      )?.value || ""
    );
  }

  const selectedProductCategoryName = (() => {
    const selectedValue = String(form.directCategoryId || "").trim();
    if (!selectedValue) return "";

    if (selectedValue.startsWith("mechanics:")) {
      return (
        mechanicsPresetCategories.find(
          (category) => category.value === selectedValue
        )?.name || ""
      );
    }

    return (
      categories.find((category) => category.id === selectedValue)?.name || ""
    );
  })();

  const footwearSizeGroup =
    effectiveBusinessType === "shoes"
      ? footwearSizeGroupFromCategoryName(selectedProductCategoryName)
      : null;

  const isFootwearCategory = Boolean(footwearSizeGroup);

  const footwearEuSizeOptions = footwearSizeGroup
    ? euSizesForGroup(footwearSizeGroup)
    : [];

  const footwearUsSizeOptions = footwearSizeGroup
    ? usSizesForGroup(footwearSizeGroup)
    : [];

  const footwearGroupLabel = footwearSizeGroup
    ? FOOTWEAR_GROUP_LABELS[footwearSizeGroup]
    : null;

  const retailSizePreset =
    effectiveBusinessType === "shoes"
      ? retailSizePresetFromCategoryName(selectedProductCategoryName)
      : null;

  useEffect(() => {
    if (!retailSizePreset) return;

    setForm((current) =>
      current.sizeOptions.length > 0
        ? current
        : { ...current, sizeOptions: [""] }
    );
  }, [retailSizePreset?.key]);

  useEffect(() => {
    if (!footwearSizeGroup) return;

    const allowedEu = new Set(euSizesForGroup(footwearSizeGroup));
    const allowedUs = new Set(usSizesForGroup(footwearSizeGroup));

    setForm((current) => {
      const kept = current.shoeSizes
        .filter((size) => !size.eu || allowedEu.has(size.eu))
        .map((size) => ({
          eu: size.eu,
          us: !size.us || allowedUs.has(size.us) ? size.us : "",
        }))
        .filter((size) => Boolean(size.eu) || Boolean(size.us));

      const nextRows = [...kept, { eu: "", us: "" }];

      const unchanged =
        nextRows.length === current.shoeSizes.length &&
        nextRows.every(
          (size, index) =>
            size.eu === current.shoeSizes[index]?.eu &&
            size.us === current.shoeSizes[index]?.us
        );

      return unchanged ? current : { ...current, shoeSizes: nextRows };
    });
  }, [footwearSizeGroup]);

  function updateRetailSize(index: number, value: string) {
    setForm((current) => {
      const sizeOptions = current.sizeOptions.map((size, sizeIndex) =>
        sizeIndex === index ? value : size
      );

      const enteredRealSize =
        Boolean(value.trim()) && value !== CUSTOM_RETAIL_SIZE_VALUE;
      const isLastRow = index === sizeOptions.length - 1;

      if (isLastRow && enteredRealSize) {
        sizeOptions.push("");
      }

      return { ...current, sizeOptions };
    });
  }

  function removeRetailSize(index: number) {
    setForm((current) => {
      const sizeOptions = current.sizeOptions.filter(
        (_, sizeIndex) => sizeIndex !== index
      );

      return {
        ...current,
        sizeOptions:
          retailSizePreset && sizeOptions.length === 0 ? [""] : sizeOptions,
      };
    });
  }

  function updateShoeSize(
    index: number,
    field: keyof ShoeSizeOption,
    value: string
  ) {
    setForm((current) => {
      const currentGroup = footwearSizeGroupFromCategoryName(
        selectedProductCategoryName
      );

      const firstEuropeanSize =
        field === "eu" &&
        Boolean(value.trim()) &&
        current.shoeSizes.every(
          (size) => !size.eu.trim() && !size.us.trim()
        );

      const shoeSizes = current.shoeSizes.map((size, sizeIndex) => {
        if (sizeIndex !== index) return size;

        if (field === "eu") {
          return {
            ...size,
            eu: value,
            us:
              currentGroup && value.trim()
                ? defaultUsSizeForEu(currentGroup, value)
                : "",
          };
        }

        return { ...size, us: value };
      });

      const isLastRow = index === shoeSizes.length - 1;
      const selectedEuropeanSize = field === "eu" && Boolean(value.trim());

      if (isLastRow && selectedEuropeanSize) {
        shoeSizes.push({ eu: "", us: "" });
      }

      return {
        ...current,
        shoeSizes,
        shoeUsSizesEnabled: firstEuropeanSize
          ? true
          : current.shoeUsSizesEnabled,
      };
    });
  }

  function removeShoeSize(index: number) {
    setForm((current) => {
      const shoeSizes = current.shoeSizes.filter(
        (_, sizeIndex) => sizeIndex !== index
      );

      return {
        ...current,
        shoeSizes:
          isFootwearCategory && shoeSizes.length === 0
            ? [{ eu: "", us: "" }]
            : shoeSizes,
      };
    });
  }

  function openCreateForm() {
    setEditingProductId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  function openEditForm(product: DirectProduct) {
    setEditingProductId(product.id);
    setForm({
      name: productDisplayName(product),
      nameAr:
        product.direct_name_ar ||
        product.official_marketplace_name_ar ||
        "",
      description: product.direct_description || "",
      brandName: product.brand_name || "",
      directCategoryId: mechanicsTestField
        ? mechanicsCategoryValueForSavedId(product.direct_store_category_id)
        : product.direct_store_category_id || "",
      price: String(product.direct_price ?? ""),
      compareAtPrice: String(product.direct_compare_at_price ?? ""),
      pricingMode: product.direct_pricing_mode || "price",
      availabilityStatus:
        product.direct_availability_status === "out_of_stock" ||
        (product.direct_inventory_tracking_enabled && Number(product.quantity_in_stock ?? 0) <= 0)
          ? "out_of_stock"
          : "available",
      vehicleYearFrom: String(product.direct_vehicle_year_from ?? ""),
      vehicleYearTo: String(product.direct_vehicle_year_to ?? ""),
      vehicleMake: product.direct_vehicle_make || "",
      vehicleModel: product.direct_vehicle_model || "",
      soldByWeight: Boolean(product.direct_sold_by_weight),
      shoeSizes: Array.isArray(product.direct_shoe_sizes)
        ? product.direct_shoe_sizes
            .map((size) => ({
              eu: String(size?.eu ?? "").trim(),
              us: String(size?.us ?? "").trim(),
            }))
            .filter((size) => Boolean(size.eu))
        : [],
      shoeUsSizesEnabled: Boolean(product.direct_shoe_us_sizes_enabled),
      sizeOptions: Array.isArray(product.direct_size_options)
        ? product.direct_size_options
            .map((size) => String(size?.label ?? "").trim())
            .filter(Boolean)
        : [],
      trackInventory: Boolean(product.direct_inventory_tracking_enabled),
      quantity: String(product.quantity_in_stock ?? 0),
      photoUrl: product.direct_photo_url || "",
      photoUrl2: product.retailer_raw_photo_url_2 || "",
      photoUrl3: product.retailer_raw_photo_url_3 || "",
      status:
        product.direct_product_status === "archived"
          ? "paused"
          : product.direct_product_status,
      featured: Boolean(product.storefront_featured),
      sortOrder: String(product.storefront_sort_order ?? 1000),
    });
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  async function uploadImage(file: File) {
    if (!selectedRetailerId) {
      throw new Error("No retailer is selected / لم يتم اختيار متجر.");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Choose an image file / اختر ملف صورة.");
    }

    if (file.size > 8 * 1024 * 1024) {
      throw new Error("The image must be 8 MB or smaller / يجب ألا يتجاوز حجم الصورة 8 ميجابايت.");
    }

    setUploading(true);

    const extension =
      safeFileName(file.name).split(".").pop() ||
      file.type.split("/").pop() ||
      "jpg";

    const objectPath = `${selectedRetailerId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const uploadResult = await supabase.storage
      .from("darik-direct-products")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    setUploading(false);

    if (uploadResult.error) {
      throw new Error(uploadResult.error.message);
    }

    const publicResult = supabase.storage
      .from("darik-direct-products")
      .getPublicUrl(uploadResult.data.path);

    return publicResult.data.publicUrl;
  }

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
    field: PhotoField
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");
    try {
      const publicUrl = await uploadImage(file);
      updateForm(field, publicUrl);
      setMessage("Product image uploaded / تم رفع صورة المنتج.");
    } catch (uploadError) {
      setUploading(false);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded / تعذر رفع الصورة."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function resolveDirectCategoryId(rawValue: string) {
    const clean = String(rawValue || "").trim();
    if (!clean) return null;
    if (!clean.startsWith("mechanics:")) return clean;

    const preset = mechanicsPresetCategories.find((item) => item.value === clean);
    if (!preset) {
      throw new Error("The selected Mechanics Lab category is no longer available / فئة الاختبار المختارة لم تعد متوفرة.");
    }

    const wantedKey = normalizedCategoryKey(preset.name);
    const existing = categories.find(
      (category) => normalizedCategoryKey(category.name) === wantedKey
    );
    if (existing) return existing.id;

    const createResult = await supabase.rpc("darik_direct_create_store_category", {
      p_retailer_id: selectedRetailerId,
      p_name: preset.name,
      p_name_ar: preset.nameAr || null,
      p_description: null,
      p_image_url: null,
      p_status: "active",
      p_sort_order: preset.sortOrder,
    });

    if (createResult.error) {
      throw new Error(
        `Could not prepare the selected test category. / تعذر تجهيز فئة الاختبار المختارة. ${createResult.error.message}`
      );
    }

    const created = createResult.data as unknown as Category | null;
    if (created?.id) {
      const savedCategory = created;
      setCategories((current) =>
        current.some((category) => category.id === savedCategory.id)
          ? current
          : [...current, savedCategory]
      );
      return savedCategory.id;
    }

    const lookup = await supabase
      .from("retailer_store_categories")
      .select("id,retailer_id,name,name_ar,category_status,sort_order")
      .eq("retailer_id", selectedRetailerId)
      .eq("name", preset.name)
      .neq("category_status", "archived")
      .limit(1)
      .maybeSingle();

    if (lookup.error || !lookup.data?.id) {
      throw new Error("The selected test category could not be resolved / تعذر تحديد فئة الاختبار المختارة.");
    }

    return String(lookup.data.id);
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();

    if (!selectedRetailerId) return;

    const name = form.name.trim();
    const price = Number(form.price);
    const compareAtPrice = form.compareAtPrice
      ? Number(form.compareAtPrice)
      : null;
    const effectiveTrackInventory = form.soldByWeight ? false : form.trackInventory;
    const quantity = effectiveTrackInventory ? Number(form.quantity) : 0;
    const sortOrder = Number(form.sortOrder || 1000);
    const pricingMode = isAutoParts ? form.pricingMode : "price";
    const vehicleYearFrom = form.vehicleYearFrom ? Number(form.vehicleYearFrom) : null;
    const vehicleYearTo = form.vehicleYearTo ? Number(form.vehicleYearTo) : vehicleYearFrom;
    const vehicleMake = form.vehicleMake.trim();
    const vehicleModel = form.vehicleModel.trim();

    if (name.length < 2) {
      setError("Enter a product name / أدخل اسم المنتج.");
      return;
    }

    if (!["price", "call", "whatsapp", "call_whatsapp"].includes(pricingMode)) {
      setError("Choose a valid pricing display option / اختر طريقة عرض سعر صحيحة.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price / أدخل سعر بيع صحيحًا.");
      return;
    }

    if (isAutoParts) {
      if (vehicleYearFrom != null && (!Number.isInteger(vehicleYearFrom) || vehicleYearFrom < 1950 || vehicleYearFrom > 2100)) {
        setError("Enter a valid starting vehicle year between 1950 and 2100 / أدخل سنة بداية صحيحة بين 1950 و2100.");
        return;
      }
      if (vehicleYearTo != null && (!Number.isInteger(vehicleYearTo) || vehicleYearTo < 1950 || vehicleYearTo > 2100)) {
        setError("Enter a valid ending vehicle year between 1950 and 2100 / أدخل سنة نهاية صحيحة بين 1950 و2100.");
        return;
      }
      if (vehicleYearFrom != null && vehicleYearTo != null && vehicleYearTo < vehicleYearFrom) {
        setError("The ending year cannot be before the starting year / لا يمكن أن تكون سنة النهاية قبل سنة البداية.");
        return;
      }
      if (vehicleModel && !vehicleMake) {
        setError("Enter the vehicle make before the model / أدخل نوع السيارة قبل الموديل.");
        return;
      }
    }

    if (
      effectiveTrackInventory &&
      (!Number.isInteger(quantity) || quantity < 0)
    ) {
      setError("Inventory amount must be a whole number of zero or more / يجب أن تكون كمية المخزون رقمًا صحيحًا يساوي صفرًا أو أكثر.");
      return;
    }

    if (
      form.availabilityStatus === "available" &&
      effectiveTrackInventory &&
      quantity <= 0
    ) {
      setError("Increase inventory above zero before marking this product available / ارفع كمية المخزون فوق الصفر قبل تحديد المنتج كمتوفر.");
      return;
    }

    if (
      compareAtPrice != null &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice < price)
    ) {
      setError("Compare-at price must be equal to or higher than the selling price / يجب أن يكون السعر قبل الخصم مساويًا لسعر البيع أو أعلى منه.");
      return;
    }

    const genericSizesForSave = form.sizeOptions
      .map((value) => value.trim())
      .filter(
        (value) => Boolean(value) && value !== CUSTOM_RETAIL_SIZE_VALUE
      );

    if (retailSizePreset) {
      if (retailSizePreset.required && genericSizesForSave.length === 0) {
        setError(
          retailSizePreset.label.en + " require at least one size / " + retailSizePreset.label.ar + " تتطلب مقاسًا واحدًا على الأقل."
        );
        return;
      }

      const normalizedGenericSizes = genericSizesForSave.map((value) =>
        value.toLowerCase()
      );
      if (
        new Set(normalizedGenericSizes).size !== normalizedGenericSizes.length
      ) {
        setError(
          "Product sizes cannot be duplicated / لا يمكن تكرار مقاسات المنتج."
        );
        return;
      }

      if (genericSizesForSave.some((value) => value.length > 40)) {
        setError(
          "A size label is too long / قيمة أحد المقاسات طويلة جدًا."
        );
        return;
      }
    }

    const shoeSizeRows = form.shoeSizes.map((size) => ({
      eu: size.eu.trim(),
      us: size.us.trim(),
    }));

    const shoeSizesForSave = shoeSizeRows.filter(
      (size) => Boolean(size.eu) || Boolean(size.us)
    );

    if (isFootwearCategory) {
      if (shoeSizesForSave.length === 0) {
        setError(
          "Footwear requires at least one European size / منتجات الأحذية تتطلب مقاسًا أوروبيًا واحدًا على الأقل."
        );
        return;
      }

      if (shoeSizesForSave.some((size) => !size.eu)) {
        setError(
          "Every entered shoe-size row needs its own European size / كل صف مقاس مُدخل يحتاج إلى مقاس أوروبي مستقل."
        );
        return;
      }

      const normalizedEuSizes = shoeSizesForSave.map((size) =>
        size.eu.toLowerCase()
      );

      if (new Set(normalizedEuSizes).size !== normalizedEuSizes.length) {
        setError(
          "European shoe sizes cannot be duplicated / لا يمكن تكرار المقاسات الأوروبية."
        );
        return;
      }

      const allowedEuSizes = new Set(footwearEuSizeOptions);
      if (shoeSizesForSave.some((size) => !allowedEuSizes.has(size.eu))) {
        setError(
          "One or more European sizes do not match the selected footwear category / بعض المقاسات الأوروبية لا تتوافق مع فئة الأحذية المختارة."
        );
        return;
      }

      if (form.shoeUsSizesEnabled) {
        const allowedUsSizes = new Set(footwearUsSizeOptions);
        if (
          shoeSizesForSave.some(
            (size) => Boolean(size.us) && !allowedUsSizes.has(size.us)
          )
        ) {
          setError(
            "One or more U.S. sizes do not match the selected footwear category / بعض المقاسات الأمريكية لا تتوافق مع فئة الأحذية المختارة."
          );
          return;
        }
      }
    }

    setSaving(true);
    setError("");
    setMessage("");

    let resolvedCategoryId: string | null = null;
    try {
      resolvedCategoryId = await resolveDirectCategoryId(form.directCategoryId);
    } catch (categoryError) {
      setSaving(false);
      setError(
        categoryError instanceof Error
          ? categoryError.message
          : "Could not prepare the selected category / تعذر تجهيز الفئة المختارة."
      );
      return;
    }

    const result = editingProductId
      ? await supabase.rpc("darik_direct_update_product_v3", {
          p_product_id: editingProductId,
          p_name: name,
          p_name_ar: form.nameAr.trim() || null,
          p_description: form.description.trim() || null,
          p_brand_name: form.brandName.trim() || null,
          p_direct_store_category_id: resolvedCategoryId,
          p_price: price,
          p_compare_at_price: compareAtPrice,
          p_track_inventory: effectiveTrackInventory,
          p_quantity: quantity,
          p_photo_url: form.photoUrl.trim() || null,
          p_status: form.status,
          p_featured: form.featured,
          p_sort_order: Number.isFinite(sortOrder) ? sortOrder : 1000,
        })
      : await supabase.rpc("darik_direct_create_product_v3", {
          p_retailer_id: selectedRetailerId,
          p_name: name,
          p_name_ar: form.nameAr.trim() || null,
          p_description: form.description.trim() || null,
          p_brand_name: form.brandName.trim() || null,
          p_direct_store_category_id: resolvedCategoryId,
          p_price: price,
          p_compare_at_price: compareAtPrice,
          p_track_inventory: effectiveTrackInventory,
          p_quantity: quantity,
          p_photo_url: form.photoUrl.trim() || null,
          p_publish: form.status === "published",
          p_featured: form.featured,
          p_sort_order: Number.isFinite(sortOrder) ? sortOrder : 1000,
        });

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    let savedProductId = editingProductId;
    const resultData = result.data as
      | string
      | { id?: string; product_id?: string }
      | null;

    if (!savedProductId) {
      if (typeof resultData === "string" && /^[0-9a-f-]{36}$/i.test(resultData)) {
        savedProductId = resultData;
      } else if (resultData && typeof resultData === "object") {
        savedProductId = resultData.product_id || resultData.id || null;
      }
    }

    if (!savedProductId) {
      const lookupResult = await supabase
        .from("products")
        .select("id,direct_name,name,retailer_submitted_name")
        .eq("retailer_id", selectedRetailerId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!lookupResult.error && Array.isArray(lookupResult.data)) {
        const matchingProduct = lookupResult.data.find((candidate) =>
          [candidate.direct_name, candidate.retailer_submitted_name, candidate.name]
            .filter(Boolean)
            .some((candidateName) => String(candidateName).trim() === name)
        );
        if (matchingProduct?.id) savedProductId = String(matchingProduct.id);
      }
    }

    if (!savedProductId) {
      setSaving(false);
      setError(
        "The product was saved, but Darik could not attach the pricing display option. Refresh and edit the product again. / تم حفظ المنتج، لكن تعذر حفظ طريقة عرض السعر. حدّث الصفحة وعدّل المنتج مرة أخرى."
      );
      await loadCatalog();
      return;
    }

    const pricingResult = await supabase.rpc(
      "darik_direct_set_product_pricing_mode",
      {
        p_product_id: savedProductId,
        p_pricing_mode: pricingMode,
      }
    );

    if (pricingResult.error) {
      setSaving(false);
      setError(
        `The product was saved, but the pricing display option failed. / تم حفظ المنتج، لكن تعذر حفظ طريقة عرض السعر. ${pricingResult.error.message}`
      );
      await loadCatalog();
      return;
    }

    const availabilityResult = await supabase.rpc(
      "darik_direct_set_product_availability",
      {
        p_product_id: savedProductId,
        p_availability_status: form.availabilityStatus,
      }
    );

    if (availabilityResult.error) {
      setSaving(false);
      setError(
        `The product was saved, but its availability status failed. / تم حفظ المنتج، لكن تعذر حفظ حالة التوفر. ${availabilityResult.error.message}`
      );
      await loadCatalog();
      return;
    }

    const photoResult = await supabase.rpc(
      "darik_direct_set_product_photos_v1",
      {
        p_product_id: savedProductId,
        p_photo_url_1: form.photoUrl.trim() || null,
        p_photo_url_2: form.photoUrl2.trim() || null,
        p_photo_url_3: form.photoUrl3.trim() || null,
      }
    );

    if (photoResult.error) {
      setSaving(false);
      setError(
        `The product was saved, but its photo set failed. / تم حفظ المنتج، لكن تعذر حفظ مجموعة الصور. ${photoResult.error.message}`
      );
      await loadCatalog();
      return;
    }

    const groceryMechanicsResult = await supabase.rpc(
      "darik_direct_set_product_grocery_mechanics_v1",
      {
        p_product_id: savedProductId,
        p_sold_by_weight: form.soldByWeight,
      }
    );

    if (groceryMechanicsResult.error) {
      setSaving(false);
      setError(
        `The product was saved, but the weight mechanic failed. / تم حفظ المنتج، لكن تعذر حفظ خاصية البيع بالوزن. ${groceryMechanicsResult.error.message}`
      );
      await loadCatalog();
      return;
    }

    const shoeSizesResult = await supabase.rpc(
      "darik_direct_set_product_shoe_sizes_v1",
      {
        p_product_id: savedProductId,
        p_sizes: isFootwearCategory ? shoeSizesForSave : [],
        p_include_us:
          isFootwearCategory && form.shoeUsSizesEnabled,
      }
    );

    if (shoeSizesResult.error) {
      setSaving(false);
      setError(
        `The product was saved, but the shoe sizes failed. / تم حفظ المنتج، لكن تعذر حفظ المقاسات. ${shoeSizesResult.error.message}`
      );
      await loadCatalog();
      return;
    }

    const genericSizesResult = await supabase.rpc(
      "darik_direct_set_product_size_options_v1",
      {
        p_product_id: savedProductId,
        p_sizes: retailSizePreset
          ? genericSizesForSave.map((label) => ({ label }))
          : [],
      }
    );

    if (genericSizesResult.error) {
      setSaving(false);
      setError(
        `The product was saved, but its category sizes failed. / تم حفظ المنتج، لكن تعذر حفظ مقاسات الفئة. ${genericSizesResult.error.message}`
      );
      await loadCatalog();
      return;
    }

    if (isAutoParts) {
      const fitmentResult = await supabase.rpc(
        "darik_direct_set_product_vehicle_fitment",
        {
          p_product_id: savedProductId,
          p_year_from: vehicleYearFrom,
          p_year_to: vehicleYearTo,
          p_vehicle_make: vehicleMake || null,
          p_vehicle_model: vehicleModel || null,
        }
      );

      if (fitmentResult.error) {
        setSaving(false);
        setError(
          `The product was saved, but vehicle fitment failed. / تم حفظ المنتج، لكن تعذر حفظ توافق السيارة. ${fitmentResult.error.message}`
        );
        await loadCatalog();
        return;
      }
    }

    setSaving(false);
    setFormOpen(false);
    setEditingProductId(null);
    setForm(emptyForm);
    setMessage(
      editingProductId
        ? "Product updated successfully / تم تحديث المنتج بنجاح."
        : "Product added to the Darik Direct catalog / تمت إضافة المنتج إلى كتالوج داريك دايركت."
    );
    await loadCatalog();
  }

  async function setProductAvailability(
    product: DirectProduct,
    nextStatus: "available" | "out_of_stock"
  ) {
    setError("");
    setMessage("");

    if (
      nextStatus === "available" &&
      product.direct_inventory_tracking_enabled &&
      Number(product.quantity_in_stock ?? 0) <= 0
    ) {
      setError("Increase inventory above zero before marking this product available / ارفع كمية المخزون فوق الصفر قبل تحديد المنتج كمتوفر.");
      return;
    }

    const result = await supabase.rpc(
      "darik_direct_set_product_availability",
      {
        p_product_id: product.id,
        p_availability_status: nextStatus,
      }
    );

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage(
      nextStatus === "available"
        ? `${productDisplayName(product)} is available / المنتج متوفر.`
        : `${productDisplayName(product)} is out of stock / المنتج غير متوفر.`
    );
    await loadCatalog();
  }

  async function setProductState(
    product: DirectProduct,
    nextStatus: "draft" | "published" | "paused" | "archived",
    featured = product.storefront_featured
  ) {
    setError("");
    setMessage("");

    const result = await supabase.rpc("darik_direct_set_product_state", {
      p_product_id: product.id,
      p_status: nextStatus,
      p_featured: featured,
      p_sort_order: Number(product.storefront_sort_order ?? 1000),
    });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage(
      nextStatus === "published"
        ? `${productDisplayName(product)} is live on the storefront.`
        : nextStatus === "archived"
          ? `${productDisplayName(product)} was archived.`
          : `${productDisplayName(product)} is now ${nextStatus}.`
    );

    await loadCatalog();
  }

  if (!authReady || (session && !context)) {
    return (
      <main className={styles.statePage}>
        <div className={styles.spinner} />
        <h1>Opening your product catalog…</h1>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.statePage}>
        <h1>Redirecting to store login…</h1>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.brandEyebrow}>Darik</p>
          <h1>Direct</h1>
        </div>

        <nav>
          <a href="/store-dashboard">Overview</a>
          <a href="/store-dashboard#storefront">Storefront</a>
          <a href="/store-dashboard#orders">Orders</a>
          <a className={styles.activeNav} href="/store-dashboard/products">
            Products
          </a>
          <a href="/store-dashboard/categories">Categories</a>
          <a href="/store-dashboard/mechanics-lab">Mechanics Lab / مختبر الخصائص</a>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>{session.user.email}</span>
          <a href="/store-dashboard">Back to dashboard</a>
          <DashboardLogoutButton />
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p>Direct catalog</p>
            <h2>{selectedStore?.business_name || "Your store"} products</h2>
          </div>

          <div className={styles.topActions}>
            {context && context.stores.length > 1 ? (
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
            ) : null}

            {selectedStore?.storefront_slug ? (
              <a
                className={styles.previewButton}
                href={
                  mechanicsTestField
                    ? withMechanicsPreview(
                        `/${selectedStore.storefront_slug}`,
                        mechanicsTestField
                      )
                    : `/${selectedStore.storefront_slug}`
                }
                target="_blank"
                rel="noreferrer"
              >
                View storefront
              </a>
            ) : null}

            <button className={styles.addButton} onClick={openCreateForm}>
              + Add product / إضافة منتج
            </button>
          </div>
        </header>

        {mechanicsTestField ? (
          <section className={styles.mechanicsLabBanner}>
            <div>
              <span>MECHANICS TEST / اختبار الخصائص</span>
              <strong>{mechanicsFieldLabel(mechanicsTestField)}</strong>
              <small>
                Actual field: {mechanicsFieldLabel(actualBusinessType)}. Saving a product still saves
                to this test store; only the business mechanics are overridden.
              </small>
            </div>
            <a href="/store-dashboard/mechanics-lab">Change field / تغيير النشاط</a>
          </section>
        ) : null}
        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        {!selectedStore ? (
          <section className={styles.emptyState}>
            <h2>No retailer membership was found.</h2>
            <p>Return to the dashboard and verify the retailer login.</p>
          </section>
        ) : (
          <>
            {!selectedStore.storefront_id ? (
              <section className={styles.setupNotice}>
                <div>
                  <strong>Create your storefront first</strong>
                  <p>
                    Products can be prepared now, but customers need a published
                    storefront link before they can see them.
                  </p>
                </div>
                <a href="/store-dashboard#storefront">Set up storefront</a>
              </section>
            ) : null}

            <section className={styles.metrics}>
              <article>
                <span>Total products</span>
                <strong>{counts.total}</strong>
                <p>Direct catalog</p>
              </article>
              <article>
                <span>Published</span>
                <strong>{counts.published}</strong>
                <p>Visible when in stock</p>
              </article>
              <article>
                <span>Low stock</span>
                <strong>{counts.lowStock}</strong>
                <p>Tracked items with three or fewer</p>
              </article>
              <article>
                <span>Featured</span>
                <strong>{counts.featured}</strong>
                <p>Shown first</p>
              </article>
            </section>

            <section className={styles.catalogPanel}>
              <div className={styles.catalogHeader}>
                <div>
                  <p>Store inventory</p>
                  <h2>Manage products</h2>
                </div>

                <div className={styles.filters}>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className={styles.loadingBlock}>
                  <div className={styles.spinner} />
                  <span>Loading products…</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className={styles.emptyCatalog}>
                  <div className={styles.emptyIcon}>+</div>
                  <h3>
                    {products.length === 0
                      ? "Add your first product"
                      : "No products match this filter"}
                  </h3>
                  <p>
                    Create direct-store products without changing the Darik
                    Marketplace approval process.
                  </p>
                  {products.length === 0 ? (
                    <button onClick={openCreateForm}>Add first product / إضافة أول منتج</button>
                  ) : null}
                </div>
              ) : (
                <div className={styles.productGrid}>
                  {filteredProducts.map((product) => {
                    const name = productDisplayName(product);
                    const stock = Number(product.quantity_in_stock ?? 0);
                    const price = Number(product.direct_price ?? 0);
                    const status = product.direct_product_status;
                    const pricingMode = product.direct_pricing_mode || "price";
                    const availabilityStatus =
                      product.direct_availability_status === "out_of_stock" ||
                      (product.direct_inventory_tracking_enabled && stock <= 0)
                        ? "out_of_stock"
                        : "available";
                    const pricingLabel =
                      pricingMode === "call"
                        ? "اتصل لمعرفة السعر / Call for pricing"
                        : pricingMode === "whatsapp"
                          ? "واتساب لمعرفة السعر / WhatsApp for pricing"
                          : pricingMode === "call_whatsapp"
                            ? "اتصال أو واتساب / Call or WhatsApp"
                            : product.direct_sold_by_weight
                              ? `${money(price)} / kg`
                              : money(price);

                    return (
                      <article className={styles.productCard} key={product.id}>
                        <div className={styles.productPhoto}>
                          {product.direct_photo_url ? (
                            <img src={product.direct_photo_url} alt={name} />
                          ) : (
                            <span>{name.slice(0, 1).toUpperCase()}</span>
                          )}

                          <div className={styles.photoBadges}>
                            <strong
                              className={`${styles.statusBadge} ${
                                styles[`status_${status}`]
                              }`}
                            >
                              {status}
                            </strong>

                            <strong
                              style={{
                                background: availabilityStatus === "available" ? "#dcfce7" : "#fee2e2",
                                color: availabilityStatus === "available" ? "#166534" : "#b91c1c",
                                border: `1px solid ${availabilityStatus === "available" ? "#86efac" : "#fecaca"}`,
                                borderRadius: 999,
                                padding: "0.35rem 0.6rem",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                              }}
                            >
                              {availabilityStatus === "available"
                                ? "متوفر / Available"
                                : "غير متوفر / Out of stock"}
                            </strong>

                            {product.storefront_featured ? (
                              <strong className={styles.featuredBadge}>
                                Featured
                              </strong>
                            ) : null}
                          </div>
                        </div>

                        <div className={styles.productBody}>
                          <div className={styles.productHeading}>
                            <div>
                              <p>
                                {categoryById.get(
                                  product.direct_store_category_id || ""
                                )?.name ||
                                  product.brand_name ||
                                  "Uncategorized"}
                              </p>
                              <h3>{name}</h3>
                              {product.direct_name_ar ? (
                                <span dir="rtl">{product.direct_name_ar}</span>
                              ) : null}
                            </div>
                            <strong>{pricingLabel}</strong>
                          </div>

                          {isAutoParts && vehicleFitmentLabel(product) ? (
                            <div className={styles.fitmentSummary}>
                              <span>Vehicle fitment / توافق السيارة</span>
                              <strong>{vehicleFitmentLabel(product)}</strong>
                            </div>
                          ) : null}

                          <div className={styles.productFacts}>
                            <div>
                              <span>Inventory</span>
                              <strong
                                className={
                                  product.direct_inventory_tracking_enabled &&
                                  stock <= 3
                                    ? styles.lowStock
                                    : undefined
                                }
                              >
                                {product.direct_sold_by_weight
                                  ? "By weight / kg"
                                  : product.direct_inventory_tracking_enabled
                                    ? stock
                                    : "Not tracked"}
                              </strong>
                            </div>
                            <div>
                              <span>Sort</span>
                              <strong>
                                {Number(product.storefront_sort_order ?? 1000)}
                              </strong>
                            </div>
                            <div>
                              <span>Marketplace</span>
                              <strong>
                                {product.marketplace_visible &&
                                product.product_status === "live"
                                  ? "Live"
                                  : "Separate"}
                              </strong>
                            </div>
                          </div>

                          <div className={styles.productActions}>
                            <button
                              onClick={() =>
                                setProductAvailability(
                                  product,
                                  availabilityStatus === "available"
                                    ? "out_of_stock"
                                    : "available"
                                )
                              }
                            >
                              {availabilityStatus === "available"
                                ? "Mark out of stock / تحديد غير متوفر"
                                : "Mark available / تحديد متوفر"}
                            </button>

                            <button onClick={() => openEditForm(product)}>
                              Edit
                            </button>

                            {status === "published" ? (
                              <button
                                onClick={() =>
                                  setProductState(product, "paused")
                                }
                              >
                                Pause
                              </button>
                            ) : status !== "archived" ? (
                              <button
                                className={styles.publishAction}
                                onClick={() =>
                                  setProductState(product, "published")
                                }
                              >
                                Publish
                              </button>
                            ) : null}

                            {status !== "archived" ? (
                              <button
                                onClick={() =>
                                  setProductState(
                                    product,
                                    status,
                                    !product.storefront_featured
                                  )
                                }
                              >
                                {product.storefront_featured
                                  ? "Unfeature"
                                  : "Feature"}
                              </button>
                            ) : null}

                            {status !== "archived" ? (
                              <button
                                className={styles.archiveAction}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Archive ${name}? It will disappear from the direct storefront.`
                                    )
                                  ) {
                                    setProductState(product, "archived");
                                  }
                                }}
                              >
                                Archive
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      {formOpen ? (
        <div className={styles.modalOverlay}>
          <section
            ref={modalRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <p>
                  {editingProductId
                    ? "Edit product / تعديل المنتج"
                    : "New product / منتج جديد"}
                </p>
                <h2 id="product-form-title">
                  {editingProductId
                    ? "Update storefront product / تحديث منتج المتجر"
                    : "Add to your direct catalog / إضافة إلى كتالوج متجرك"}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close product form / إغلاق نموذج المنتج"
                onClick={() => {
                  if (!saving && !uploading) {
                    setFormOpen(false);
                    setEditingProductId(null);
                  }
                }}
              >
                ×
              </button>
            </header>

            <form className={styles.productForm} onSubmit={saveProduct}>
              <div className={styles.formMain}>
                <label>
                  <BilingualLabel
                    en="Product name (English)"
                    ar="اسم المنتج بالإنجليزية"
                  />
                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="Enter the product name in English"
                    autoComplete="off"
                    required
                  />
                </label>

                <label>
                  <BilingualLabel
                    en="Product name (Arabic)"
                    ar="اسم المنتج بالعربية"
                  />
                  <input
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(event) =>
                      updateForm("nameAr", event.target.value)
                    }
                    placeholder="أدخل اسم المنتج بالعربية"
                    autoComplete="off"
                  />
                </label>

                <div className={styles.twoColumns}>
                  <label>
                    <BilingualLabel
                      en="Brand"
                      ar="العلامة التجارية"
                    />
                    <input
                      value={form.brandName}
                      onChange={(event) =>
                        updateForm("brandName", event.target.value)
                      }
                      placeholder="Brand name / اسم العلامة التجارية"
                    />
                  </label>

                  <label>
                    <BilingualLabel
                      en="Store category"
                      ar="فئة المتجر"
                    />
                    <select
                      value={form.directCategoryId}
                      onChange={(event) =>
                        updateForm("directCategoryId", event.target.value)
                      }
                    >
                      <option value="">Uncategorized / بدون فئة</option>
                      {mechanicsTestField
                        ? mechanicsPresetCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.name}
                              {category.nameAr ? ` / ${category.nameAr}` : ""}
                            </option>
                          ))
                        : categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {categoryOptionLabel(category, isAutoParts)}
                            </option>
                          ))}
                    </select>
                    {mechanicsTestField ? (
                      <span className={styles.mechanicsCategoryHint}>
                        Showing {mechanicsFieldLabel(mechanicsTestField)} categories for this mechanics test.
                        The selected category is prepared on the test store only when you save the product. /
                        تعرض القائمة أقسام نشاط الاختبار المختار.
                      </span>
                    ) : null}
                    <a
                      className={styles.manageCategoriesLink}
                      href="/store-dashboard/categories"
                    >
                      Create or manage categories / إنشاء أو إدارة الفئات
                    </a>
                  </label>
                </div>

                {isAutoParts ? (
                  <section className={styles.fitmentPanel}>
                    <div className={styles.fitmentHeading}>
                      <div>
                        <strong>Vehicle fitment / توافق السيارة</strong>
                        <span>Customers can filter the catalog by year, make, and model. / يمكن للعملاء تصفية المنتجات حسب السنة والنوع والموديل.</span>
                      </div>
                    </div>
                    <div className={styles.fitmentGrid}>
                      <label>
                        <BilingualLabel en="Year from" ar="من سنة" />
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1950"
                          max="2100"
                          step="1"
                          value={form.vehicleYearFrom}
                          onChange={(event) => updateForm("vehicleYearFrom", event.target.value)}
                          placeholder="Example: 2020"
                        />
                      </label>
                      <label>
                        <BilingualLabel en="Year to" ar="إلى سنة" />
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1950"
                          max="2100"
                          step="1"
                          value={form.vehicleYearTo}
                          onChange={(event) => updateForm("vehicleYearTo", event.target.value)}
                          placeholder="Optional / اختياري"
                        />
                      </label>
                      <label>
                        <BilingualLabel en="Vehicle make" ar="نوع السيارة" />
                        <input
                          value={form.vehicleMake}
                          onChange={(event) => updateForm("vehicleMake", event.target.value)}
                          placeholder="NETA, BYD, Toyota..."
                          autoComplete="off"
                        />
                      </label>
                      <label>
                        <BilingualLabel en="Vehicle model" ar="موديل السيارة" />
                        <input
                          value={form.vehicleModel}
                          onChange={(event) => updateForm("vehicleModel", event.target.value)}
                          placeholder="U, Song L, Corolla..."
                          autoComplete="off"
                        />
                      </label>
                    </div>
                    <p className={styles.fitmentHint}>
                      Leave these fields blank for universal parts. Use the year range when the same part fits several model years. / اترك الحقول فارغة للقطع العامة، واستخدم نطاق السنوات عندما تناسب القطعة أكثر من سنة.
                    </p>
                  </section>
                ) : null}

                <label>
                  <BilingualLabel
                    en="Description"
                    ar="وصف المنتج"
                  />
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    placeholder="Product details, size, fitment or important notes / تفاصيل المنتج أو القياس أو الملاحظات المهمة"
                    rows={4}
                  />
                </label>

                {isAutoParts ? (
                  <label>
                    <BilingualLabel
                      en="Price display on storefront"
                      ar="طريقة عرض السعر في المتجر"
                    />
                    <select
                      value={form.pricingMode}
                      onChange={(event) =>
                        updateForm(
                          "pricingMode",
                          event.target.value as ProductForm["pricingMode"]
                        )
                      }
                    >
                      <option value="price">Show price / عرض السعر</option>
                      <option value="call">Call for pricing / اتصل لمعرفة السعر</option>
                      <option value="whatsapp">WhatsApp for pricing / واتساب لمعرفة السعر</option>
                      <option value="call_whatsapp">Call or WhatsApp / اتصال أو واتساب</option>
                    </select>
                    <span style={{ color: "#667085", fontSize: 12, fontWeight: 600, lineHeight: 1.55 }}>
                      Contact-pricing options hide the public price and cart button. The selling price remains private in your dashboard. / خيارات التواصل تخفي السعر وزر السلة عن العملاء، ويبقى سعر البيع ظاهرًا لك داخل لوحة التحكم فقط.
                    </span>
                  </label>
                ) : null}

                {isFootwearCategory ? (
                  <section className={styles.shoeMechanicPanel}>
                    <div className={styles.shoeMechanicHeading}>
                      <div>
                        <strong>
                          {footwearGroupLabel?.en || "Footwear"} sizes /{" "}
                          {footwearGroupLabel?.ar || "مقاسات الأحذية"}
                        </strong>
                        <span>
                          Sizes are filtered for the selected footwear category. Choose one European size per row and the next row appears automatically. /
                          يتم تصفية المقاسات حسب فئة الأحذية المختارة. اختر مقاسًا أوروبيًا واحدًا في كل صف وستظهر الخانة التالية تلقائيًا.
                        </span>
                      </div>
                    </div>

                    <label className={styles.shoeUsToggle}>
                      <input
                        type="checkbox"
                        checked={form.shoeUsSizesEnabled}
                        onChange={(event) =>
                          updateForm("shoeUsSizesEnabled", event.target.checked)
                        }
                      />
                      <span>
                        <strong>
                          Auto-match U.S. sizes / مطابقة المقاسات الأمريكية تلقائيًا
                        </strong>
                        <small>
                          Darik matches each EU size automatically. You can change the U.S. size for a brand-specific fit. /
                          يقوم داريك بمطابقة كل مقاس أوروبي تلقائيًا، ويمكنك تعديل المقاس الأمريكي إذا اختلفت مقاسات العلامة التجارية.
                        </small>
                      </span>
                    </label>

                    <div className={styles.shoeSizeRows}>
                      {form.shoeSizes.map((size, index) => {
                        const isAutomaticNextRow =
                          index === form.shoeSizes.length - 1 &&
                          !size.eu.trim() &&
                          !size.us.trim();

                        return (
                          <div
                            className={styles.shoeSizeRow}
                            key={`shoe-size-${index}`}
                          >
                            <label>
                              <BilingualLabel
                                en={`European size ${index + 1}`}
                                ar={`المقاس الأوروبي ${index + 1}`}
                              />
                              <select
                                value={size.eu}
                                onChange={(event) =>
                                  updateShoeSize(index, "eu", event.target.value)
                                }
                                aria-label={`European shoe size ${index + 1}`}
                              >
                                <option value="">
                                  Select EU size / اختر المقاس الأوروبي
                                </option>
                                {footwearEuSizeOptions.map((option) => (
                                  <option
                                    key={option}
                                    value={option}
                                    disabled={form.shoeSizes.some(
                                      (otherSize, otherIndex) =>
                                        otherIndex !== index &&
                                        otherSize.eu === option
                                    )}
                                  >
                                    EU {option}
                                  </option>
                                ))}
                              </select>
                            </label>

                            {form.shoeUsSizesEnabled ? (
                              <label>
                                <BilingualLabel
                                  en="U.S. size · auto-matched"
                                  ar="المقاس الأمريكي · مطابق تلقائيًا"
                                />
                                <select
                                  value={size.us}
                                  onChange={(event) =>
                                    updateShoeSize(index, "us", event.target.value)
                                  }
                                  disabled={!size.eu.trim()}
                                >
                                  <option value="">
                                    Select U.S. size / اختر المقاس الأمريكي
                                  </option>
                                  {footwearUsSizeOptions.map((option) => (
                                    <option key={option} value={option}>
                                      US {option}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            ) : null}

                            {isAutomaticNextRow ? (
                              <span className={styles.shoeSizeNextLabel}>
                                Next size / المقاس التالي
                              </span>
                            ) : (
                              <button
                                type="button"
                                className={styles.removeShoeSizeButton}
                                onClick={() => removeShoeSize(index)}
                                disabled={saving}
                              >
                                Remove / حذف
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
                {retailSizePreset ? (
                  <section className={styles.retailSizeMechanicPanel}>
                    <div className={styles.shoeMechanicHeading}>
                      <div>
                        <strong>
                          {retailSizePreset.label.en} / {retailSizePreset.label.ar}
                          {retailSizePreset.required ? " *" : ""}
                        </strong>
                        <span>
                          {retailSizePreset.help.en} / {retailSizePreset.help.ar}
                        </span>
                      </div>
                    </div>

                    <div className={styles.shoeSizeRows}>
                      {form.sizeOptions.map((size, index) => {
                        const normalizedSize = size.trim();
                        const isCustomSize =
                          normalizedSize === CUSTOM_RETAIL_SIZE_VALUE ||
                          (Boolean(normalizedSize) &&
                            !retailSizePreset.options.includes(normalizedSize));
                        const selectValue = isCustomSize
                          ? CUSTOM_RETAIL_SIZE_VALUE
                          : normalizedSize;
                        const isAutomaticNextRow =
                          index === form.sizeOptions.length - 1 &&
                          !normalizedSize;

                        return (
                          <div
                            className={styles.retailSizeRow}
                            key={"retail-size-" + index}
                          >
                            <div className={styles.retailSizeInputs}>
                              <label>
                                <BilingualLabel
                                  en={"Size " + (index + 1)}
                                  ar={"المقاس " + (index + 1)}
                                />
                                <select
                                  value={selectValue}
                                  onChange={(event) =>
                                    updateRetailSize(index, event.target.value)
                                  }
                                >
                                  <option value="">
                                    Select size / اختر المقاس
                                  </option>
                                  {retailSizePreset.options.map((option) => (
                                    <option
                                      key={option}
                                      value={option}
                                      disabled={form.sizeOptions.some(
                                        (otherSize, otherIndex) =>
                                          otherIndex !== index &&
                                          otherSize.trim().toLowerCase() ===
                                            option.toLowerCase()
                                      )}
                                    >
                                      {option}
                                    </option>
                                  ))}
                                  <option value={CUSTOM_RETAIL_SIZE_VALUE}>
                                    Custom size / مقاس مخصص
                                  </option>
                                </select>
                              </label>

                              {isCustomSize ? (
                                <label>
                                  <BilingualLabel
                                    en="Custom size label"
                                    ar="اسم المقاس المخصص"
                                  />
                                  <input
                                    type="text"
                                    maxLength={40}
                                    value={
                                      normalizedSize === CUSTOM_RETAIL_SIZE_VALUE
                                        ? ""
                                        : size
                                    }
                                    onChange={(event) =>
                                      updateRetailSize(index, event.target.value)
                                    }
                                    placeholder="Brand size / مقاس العلامة"
                                  />
                                </label>
                              ) : null}
                            </div>

                            {isAutomaticNextRow ? (
                              <span className={styles.shoeSizeNextLabel}>
                                Next size / المقاس التالي
                              </span>
                            ) : (
                              <button
                                type="button"
                                className={styles.removeShoeSizeButton}
                                onClick={() => removeRetailSize(index)}
                                disabled={saving}
                              >
                                Remove / حذف
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
                {supportsWeightSelling ? (
                  <section className={styles.weightMechanicPanel}>
                    <label className={styles.weightMechanicToggle}>
                      <input
                        type="checkbox"
                        checked={form.soldByWeight}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setForm((current) => ({
                            ...current,
                            soldByWeight: checked,
                            trackInventory: checked ? false : current.trackInventory,
                            quantity: checked ? "0" : current.quantity,
                          }));
                        }}
                      />
                      <span>
                        <strong>This item is sold by weight / هذا المنتج يباع بالوزن</strong>
                        <small>
                          Turn this on for products priced per kilogram, including bakery and tobacco products sold by weight. /
                          فعّل هذا الخيار للمنتجات التي يكون سعرها لكل كيلو، بما فيها منتجات المخبز والتبغ المباعة بالوزن.
                        </small>
                      </span>
                    </label>
                    {form.soldByWeight ? (
                      <div className={styles.weightMechanicActive}>
                        <strong>Weight unit: kg / وحدة الوزن: كيلو</strong>
                        <span>Enter the selling price for 1 kg. Whole-item inventory is disabled for this product.</span>
                      </div>
                    ) : null}
                  </section>
                ) : null}
                <div className={styles.threeColumns}>
                  <label>
                    <BilingualLabel
                      en={form.soldByWeight ? "Price per kilogram" : isAutoParts && form.pricingMode !== "price" ? "Internal selling price" : "Selling price"}
                      ar={form.soldByWeight ? "السعر لكل كيلو" : isAutoParts && form.pricingMode !== "price" ? "سعر البيع الداخلي" : "سعر البيع"}
                    />
                    <div className={styles.moneyInput}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0.01"
                        step="0.01"
                        value={form.price}
                        onChange={(event) =>
                          updateForm("price", event.target.value)
                        }
                        required
                      />
                      <span>{form.soldByWeight ? "JOD / kg" : "JOD"}</span>
                    </div>
                  </label>

                  <label>
                    <BilingualLabel
                      en={form.soldByWeight ? "Compare-at price per kilogram" : "Compare-at price"}
                      ar={form.soldByWeight ? "السعر السابق لكل كيلو" : "السعر قبل الخصم"}
                    />
                    <div className={styles.moneyInput}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={form.compareAtPrice}
                        onChange={(event) =>
                          updateForm("compareAtPrice", event.target.value)
                        }
                        placeholder="Optional / اختياري"
                      />
                      <span>{form.soldByWeight ? "JOD / kg" : "JOD"}</span>
                    </div>
                  </label>

                  <div className={styles.inventoryControl}>
                    <label>
                      <BilingualLabel
                        en="Customer availability"
                        ar="حالة التوفر للعملاء"
                      />
                      <select
                        value={form.availabilityStatus}
                        onChange={(event) =>
                          updateForm(
                            "availabilityStatus",
                            event.target.value as ProductForm["availabilityStatus"]
                          )
                        }
                      >
                        <option value="available">Available / متوفر</option>
                        <option value="out_of_stock">Out of stock / غير متوفر</option>
                      </select>
                      <span style={{
                        display: "block",
                        marginTop: "0.45rem",
                        color: form.availabilityStatus === "available" ? "#166534" : "#b91c1c",
                        fontWeight: 800,
                      }}>
                        {form.availabilityStatus === "available"
                          ? "Customers will see Available in green / سيظهر متوفر باللون الأخضر"
                          : "Customers will see Out of stock in red / سيظهر غير متوفر باللون الأحمر"}
                      </span>
                    </label>

                    {form.soldByWeight ? (
                      <div className={styles.weightInventoryNote}>
                        <strong>Weight item / منتج بالوزن</strong>
                        <span>Use Available / Out of stock for now; whole-item inventory is disabled.</span>
                      </div>
                    ) : null}
                    <label className={styles.inventoryToggle}>
                      <input
                        type="checkbox"
                        checked={form.soldByWeight ? false : form.trackInventory}
                        disabled={form.soldByWeight}
                        onChange={(event) =>
                          updateForm("trackInventory", event.target.checked)
                        }
                      />
                      <span>
                        <strong>Track inventory / تتبّع المخزون</strong>
                        {form.trackInventory
                          ? "Enter the available quantity / أدخل الكمية المتوفرة"
                          : "Leave off for always-available items / اتركه مغلقًا للمنتجات المتوفرة دائمًا"}
                      </span>
                    </label>

                    {form.trackInventory ? (
                      <label className={styles.inventoryAmount}>
                        <BilingualLabel
                          en="Inventory amount"
                          ar="كمية المخزون"
                        />
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          value={form.quantity}
                          onChange={(event) =>
                            updateForm("quantity", event.target.value)
                          }
                          required
                        />
                      </label>
                    ) : (
                      <div className={styles.inventoryNotTracked}>
                        <strong>
                          Inventory not tracked / المخزون غير متتبّع
                        </strong>
                        <span>
                          This item stays available until paused / يبقى المنتج
                          متاحًا حتى تقوم بإيقافه
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.twoColumns}>
                  <label>
                    <BilingualLabel
                      en="Storefront status"
                      ar="حالة الظهور في المتجر"
                    />
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target.value as ProductForm["status"]
                        )
                      }
                    >
                      <option value="published">Published / منشور</option>
                      <option value="draft">Draft / مسودة</option>
                      {editingProductId ? (
                        <option value="paused">Paused / متوقف</option>
                      ) : null}
                    </select>
                  </label>

                  <label>
                    <BilingualLabel
                      en="Display order"
                      ar="ترتيب العرض"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="1"
                      value={form.sortOrder}
                      onChange={(event) =>
                        updateForm("sortOrder", event.target.value)
                      }
                    />
                  </label>
                </div>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateForm("featured", event.target.checked)
                    }
                  />
                  <span>
                    <strong>
                      Feature this product / ميّز هذا المنتج
                    </strong>
                    Show it before normal products / اعرضه قبل المنتجات العادية
                  </span>
                </label>
              </div>

              <aside className={styles.imagePanel}>
                <div className={styles.photoPanelHeading}>
                  <strong>Product photos / صور المنتج</strong>
                  <span>Up to 3 photos. Photo 1 is the main image. / حتى 3 صور، والصورة 1 هي الرئيسية.</span>
                </div>
                <div className={styles.photoSlotGrid}>
                  {PRODUCT_PHOTO_SLOTS.map((slot) => {
                    const photoValue = form[slot.field];
                    return (
                      <section className={styles.photoSlot} key={slot.field}>
                        <div className={styles.photoSlotTitle}>
                          <strong>{slot.label} / {slot.labelAr}</strong>
                          {slot.primary ? <span>Main / الرئيسية</span> : null}
                        </div>
                        <div className={styles.imagePreview}>
                          {photoValue ? (
                            <img src={photoValue} alt={`Product ${slot.label} preview`} />
                          ) : (
                            <div>
                              <strong>{slot.label} / {slot.labelAr}</strong>
                              <span>JPG, PNG, WEBP or GIF</span>
                            </div>
                          )}
                        </div>
                        <label className={styles.uploadButton}>
                          {uploading
                            ? "Uploading… / جارٍ الرفع…"
                            : `Upload ${slot.label} / رفع ${slot.labelAr}`}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(event) => handleImageChange(event, slot.field)}
                            disabled={uploading || saving}
                          />
                        </label>
                        <label>
                          <BilingualLabel en="Or paste image URL" ar="أو الصق رابط الصورة" />
                          <input
                            type="url"
                            value={photoValue}
                            onChange={(event) => updateForm(slot.field, event.target.value)}
                            placeholder="https://..."
                          />
                        </label>
                        {photoValue ? (
                          <button
                            type="button"
                            className={styles.removePhotoButton}
                            onClick={() => updateForm(slot.field, "")}
                            disabled={saving || uploading}
                          >
                            Remove photo / حذف الصورة
                          </button>
                        ) : null}
                      </section>
                    );
                  })}
                </div>
                <div className={styles.channelNote}>
                  <strong>
                    Marketplace remains protected / يبقى سوق داريك محميًا
                  </strong>
                  <p>
                    These photos belong to the Direct product setup. Marketplace approval and official product data remain separate. /
                    صور المنتج المباشر لا تغيّر موافقة السوق أو بيانات المنتج الرسمية.
                  </p>
                </div>
              </aside>
              <footer className={styles.formFooter}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    if (!saving && !uploading) {
                      setFormOpen(false);
                      setEditingProductId(null);
                    }
                  }}
                >
                  Cancel / إلغاء
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving || uploading}
                >
                  {saving
                    ? "Saving… / جارٍ الحفظ…"
                    : editingProductId
                      ? "Save changes / حفظ التغييرات"
                      : "Add product / إضافة المنتج"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
