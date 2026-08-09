// DARIK_RETAIL_FIELDS_SMOKE_SHOP_050
// Runtime category-preset overlay for the retail-field system.
// The database preset table remains authoritative for real category provisioning.

import { getBusinessCategoryPreset as getBaseBusinessCategoryPreset } from "./categoryPresets";

type BusinessPreset = ReturnType<typeof getBaseBusinessCategoryPreset>;

const SMOKE_SHOP_CATEGORIES = [
  ["Cigarettes", "سجائر"],
  ["Cigars", "سيجار"],
  ["Tobacco", "تبغ"],
  ["Rolling Tobacco", "تبغ لف"],
  ["Pipe Tobacco", "تبغ غليون"],
  ["Shisha Tobacco", "معسل"],
  ["Vapes & E-Cigarettes", "فيب وسجائر إلكترونية"],
  ["Disposable Vapes", "فيب استخدام مرة واحدة"],
  ["E-Liquids", "سوائل فيب"],
  ["Pods & Cartridges", "بودات وكارتردج"],
  ["Coils & Vape Accessories", "كويلات وإكسسوارات فيب"],
  ["Nicotine Pouches", "أكياس نيكوتين"],
  ["Rolling Papers & Wraps", "ورق لف ولفائف"],
  ["Filters & Tips", "فلاتر ورؤوس"],
  ["Lighters & Torches", "ولاعات وشعلات"],
  ["Hookahs & Shisha Accessories", "أراجيل وإكسسوارات"],
  ["Charcoal", "فحم"],
  ["Ashtrays", "طفايات"],
  ["Smoking Accessories", "إكسسوارات التدخين"]
] as const;

function categoryEnglishName(value: unknown) {
  if (typeof value === "string") return value.trim();

  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;
  return String(
    record.name ??
      record.label ??
      record.nameEn ??
      record.name_en ??
      record.labelEn ??
      record.en ??
      ""
  ).trim();
}

export function getBusinessCategoryPreset(
  businessType: string | null | undefined,
  businessTypeOther: string | null | undefined
): BusinessPreset {
  const normalized = String(businessType || "")
    .trim()
    .toLowerCase();

  if (normalized === "smoke_shop") {
    return {
      label: "Smoke Shop",
      labelAr: "محل دخان وتبغ",
      categories: SMOKE_SHOP_CATEGORIES.map(([name, nameAr]) => [name, nameAr]),
    } as unknown as BusinessPreset;
  }

  const base = getBaseBusinessCategoryPreset(businessType, businessTypeOther);

  if (normalized !== "supermarket") return base;

  const categories = Array.from(base.categories as readonly unknown[]);
  const hasTobacco = categories.some(
    (category) => categoryEnglishName(category).toLowerCase() === "tobacco"
  );

  if (hasTobacco) return base;

  return {
    ...base,
    categories: [...categories, ["Tobacco", "تبغ"]],
  } as unknown as BusinessPreset;
}
