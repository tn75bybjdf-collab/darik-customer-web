"use client";

// DARIK_RETAIL_FIELDS_SMOKE_SHOP_050

export const DARIK_MECHANICS_LAB_STORAGE_KEY = "darik:mechanics-lab:field";

export const darikMechanicsFieldOptions = [
  { value: "supermarket", label: "Supermarket / Hypermarket", labelAr: "سوبرماركت / هايبرماركت" },
  { value: "restaurant", label: "Restaurant", labelAr: "مطعم" },
  { value: "bakery", label: "Bakery / Sweets", labelAr: "مخبز / حلويات" },
  { value: "cafe", label: "Café", labelAr: "مقهى / كوفي شوب" },
  { value: "smoke_shop", label: "Smoke Shop", labelAr: "محل دخان وتبغ" },
  { value: "butcher", label: "Butcher", labelAr: "ملحمة" },
  { value: "produce", label: "Fruit and vegetable store", labelAr: "خضار وفواكه" },
  { value: "clothing", label: "Clothing", labelAr: "ملابس" },
  { value: "shoes", label: "Shoes", labelAr: "أحذية" },
  { value: "jewelry", label: "Jewelry", labelAr: "مجوهرات" },
  { value: "cosmetics", label: "Cosmetics / Beauty", labelAr: "مستحضرات تجميل / عناية" },
  { value: "perfume", label: "Perfume", labelAr: "عطور" },
  { value: "electronics", label: "Electronics", labelAr: "إلكترونيات" },
  { value: "computers", label: "Computers", labelAr: "كمبيوتر" },
  { value: "mobile_phones", label: "Mobile phones & accessories", labelAr: "هواتف وإكسسوارات" },
  { value: "furniture", label: "Furniture", labelAr: "أثاث" },
  { value: "home_appliances", label: "Home appliances", labelAr: "أجهزة منزلية" },
  { value: "home_decor", label: "Home décor", labelAr: "ديكور منزلي" },
  { value: "auto_parts", label: "Auto parts", labelAr: "قطع سيارات" },
  { value: "tires", label: "Tires & car accessories", labelAr: "إطارات وإكسسوارات سيارات" },
  { value: "hardware", label: "Hardware store", labelAr: "عدد وأدوات" },
  { value: "building_materials", label: "Building materials", labelAr: "مواد بناء" },
  { value: "electrical_supplies", label: "Electrical supplies", labelAr: "مواد كهربائية" },
  { value: "plumbing", label: "Plumbing supplies", labelAr: "مواد صحية وسباكة" },
  { value: "tools", label: "Tools & equipment", labelAr: "أدوات ومعدات" },
  { value: "pharmacy", label: "Pharmacy", labelAr: "صيدلية" },
  { value: "pet_supplies", label: "Pet supplies", labelAr: "مستلزمات حيوانات أليفة" },
  { value: "flowers", label: "Flowers", labelAr: "زهور" },
  { value: "gifts", label: "Gifts", labelAr: "هدايا" },
  { value: "toys", label: "Toys", labelAr: "ألعاب" },
  { value: "books_stationery", label: "Books & stationery", labelAr: "كتب وقرطاسية" },
  { value: "sports", label: "Sports equipment", labelAr: "معدات رياضية" },
  { value: "other", label: "Other", labelAr: "أخرى" },
] as const;

const validMechanicsFields = new Set(
  darikMechanicsFieldOptions.map((option) => option.value)
);

export function normalizeMechanicsField(value: string | null | undefined) {
  const normalized = String(value || "").trim().toLowerCase();
  return validMechanicsFields.has(
    normalized as (typeof darikMechanicsFieldOptions)[number]["value"]
  )
    ? normalized
    : "";
}

export function mechanicsFieldLabel(value: string | null | undefined) {
  const normalized = normalizeMechanicsField(value);
  const option = darikMechanicsFieldOptions.find((item) => item.value === normalized);
  return option ? `${option.label} / ${option.labelAr}` : "Not selected / غير محدد";
}

export function readMechanicsLabField() {
  if (typeof window === "undefined") return "";
  const fromUrl = normalizeMechanicsField(
    new URLSearchParams(window.location.search).get("previewMechanicsField")
  );
  if (fromUrl) return fromUrl;
  try {
    return normalizeMechanicsField(
      window.localStorage.getItem(DARIK_MECHANICS_LAB_STORAGE_KEY)
    );
  } catch {
    return "";
  }
}

export function writeMechanicsLabField(value: string) {
  const normalized = normalizeMechanicsField(value);
  if (!normalized || typeof window === "undefined") return "";
  window.localStorage.setItem(DARIK_MECHANICS_LAB_STORAGE_KEY, normalized);
  return normalized;
}

export function clearMechanicsLabField() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DARIK_MECHANICS_LAB_STORAGE_KEY);
}

export function withMechanicsPreview(pathname: string, field: string) {
  const normalized = normalizeMechanicsField(field);
  if (!normalized) return pathname;
  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}previewMechanicsField=${encodeURIComponent(
    normalized
  )}&mechanicsLab=1`;
}
