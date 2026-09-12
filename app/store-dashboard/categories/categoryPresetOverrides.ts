// DARIK_EYEGLASSES_RETAIL_FIELD_MECHANICS_135
// DARIK_RETAIL_FIELDS_SMOKE_SHOP_050
// DARIK_SHOE_CATEGORY_SIZE_GROUPS_053
// DARIK_SHOE_STORE_CATEGORIES_055
// DARIK_SHOES_RETAIL_FINAL_056
// Runtime category-preset overlay for the retail-field system.
// DARIK_HARDWARE_PRESETS_INLINE_CATEGORY_241
// The database preset table remains authoritative for real category provisioning.

import { getBusinessCategoryPreset as getBaseBusinessCategoryPreset } from "./categoryPresets";

type BusinessPreset = ReturnType<typeof getBaseBusinessCategoryPreset>;


const HARDWARE_CATEGORIES_241 = [
  ["Hand Tools", "أدوات يدوية"],
  ["Power Tools", "أدوات كهربائية"],
  ["Drill Bits & Driver Bits", "ريش دريل ولقم مفكات"],
  ["Cutting & Grinding", "قص وجلخ"],
  ["Saw Blades & Cutting Discs", "شفرات مناشير وأقراص قص"],
  ["Abrasives & Sandpaper", "مواد صنفرة وورق زجاج"],
  ["Measuring & Leveling", "قياس وميزان"],
  ["Tool Storage & Boxes", "صناديق وحفظ الأدوات"],
  ["Screws", "براغي"],
  ["Nails", "مسامير"],
  ["Nuts, Bolts & Washers", "صواميل وبراغي وورد"],
  ["Anchors & Wall Plugs", "رول بلاك ومثبتات"],
  ["Other Fasteners", "مثبتات أخرى"],
  ["Plumbing Tools & Supplies", "أدوات ولوازم سباكة"],
  ["Pipes & Fittings", "مواسير ووصلات"],
  ["Faucets & Mixers", "حنفيات وخلاطات"],
  ["Valves", "محابس وصمامات"],
  ["Water Hoses & Accessories", "خراطيم مياه وملحقاتها"],
  ["Electrical Tools & Supplies", "أدوات ولوازم كهرباء"],
  ["Wires & Cables", "أسلاك وكوابل"],
  ["Switches & Sockets", "مفاتيح وأباريز كهرباء"],
  ["Breakers, Fuses & Panels", "قواطع وفيوزات ولوحات"],
  ["Extension Cords & Power Strips", "وصلات كهرباء ومشتركات"],
  ["Lighting & Bulbs", "إنارة ولمبات"],
  ["Paint", "دهانات"],
  ["Painting Tools & Supplies", "أدوات ولوازم دهان"],
  ["Adhesives & Glues", "مواد لاصقة وغراء"],
  ["Silicone, Sealants & Caulk", "سيليكون ومواد سد"],
  ["Locks & Padlocks", "أقفال وأقفال معلقة"],
  ["Door Hardware", "إكسسوارات الأبواب"],
  ["Hinges", "مفصلات"],
  ["Cabinet & Furniture Hardware", "إكسسوارات الخزائن والأثاث"],
  ["Chains, Ropes & Wire", "سلاسل وحبال وأسلاك"],
  ["Welding Tools & Supplies", "أدوات ولوازم لحام"],
  ["Safety & Protective Gear", "معدات سلامة وحماية"],
  ["Ladders & Access Equipment", "سلالم ومعدات وصول"],
  ["Garden Tools & Irrigation", "أدوات حدائق وري"],
  ["Cleaning & Maintenance Supplies", "مواد تنظيف وصيانة"],
  ["Construction Materials", "مواد بناء"],
  ["Cement, Plaster & Mortar", "إسمنت وجبص ومونة"],
  ["Tile & Flooring Tools", "أدوات بلاط وأرضيات"],
  ["Hardware Accessories & Miscellaneous", "إكسسوارات وعدة متنوعة"],
] as const;

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

const SHOES_CATEGORIES = [
  ["Men's Footwear", "أحذية رجالية"],
  ["Women's Footwear", "أحذية نسائية"],
  ["Kids' Footwear", "أحذية أطفال"],
  ["Baby & Toddler Footwear", "أحذية رضع وصغار"],
  ["Unisex Footwear", "أحذية للجنسين"],
  ["Men's Clothing", "ملابس رجالية"],
  ["Women's Clothing", "ملابس نسائية"],
  ["Kids' Clothing", "ملابس أطفال"],
  ["Baby & Toddler Clothing", "ملابس رضع وصغار"],
  ["Unisex Clothing", "ملابس للجنسين"],
  ["Socks", "جوارب"],
  ["Hats & Caps", "قبعات وكابات"],
  ["Bags & Backpacks", "حقائب وحقائب ظهر"],
  ["Belts", "أحزمة"],
  ["Wallets", "محافظ"],
  ["Insoles & Inserts", "فرشات ونعال داخلية"],
  ["Shoelaces", "أربطة أحذية"],
  ["Shoe Care", "العناية بالأحذية"],
  ["Other Accessories", "إكسسوارات أخرى"],
] as const;

const EYEGLASSES_CATEGORIES = [
  ["Prescription Frames", "إطارات طبية"],
  ["Sunglasses", "نظارات شمسية"],
  ["Blue-Light Glasses", "نظارات حماية من الضوء الأزرق"],
  ["Reading Glasses", "نظارات قراءة"],
  ["Kids' Eyewear", "نظارات أطفال"],
  ["Sports Eyewear", "نظارات رياضية"],
  ["Safety & Protective Eyewear", "نظارات حماية"],
  ["Contact Lenses", "عدسات لاصقة"],
  ["Contact Lens Care", "العناية بالعدسات"],
  ["Eyeglass Lenses", "عدسات النظارات"],
  ["Eyewear Accessories", "إكسسوارات النظارات"],
  ["Cases & Cleaning", "حافظات وتنظيف"],
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


  if (
    normalized.includes("hardware") ||
    normalized === "tools" ||
    normalized === "tool_store" ||
    normalized === "tools_store"
  ) {
    return {
      label: "Hardware Store",
      labelAr: "محل عدد وأدوات",
      categories: HARDWARE_CATEGORIES_241.map(([name, nameAr]) => [name, nameAr]),
    } as unknown as BusinessPreset;
  }

  if (normalized === "shoes") {
    return {
      label: "Shoes",
      labelAr: "أحذية",
      categories: SHOES_CATEGORIES.map(([name, nameAr]) => [name, nameAr]),
    } as unknown as BusinessPreset;
  }

  if (normalized === "eyeglasses") {
    return {
      label: "Eyeglasses / Optical Store",
      labelAr: "نظارات / محل بصريات",
      categories: EYEGLASSES_CATEGORIES.map(([name, nameAr]) => [name, nameAr]),
    } as unknown as BusinessPreset;
  }

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
