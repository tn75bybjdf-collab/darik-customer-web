"use client";

// DARIK_PAYMENT_FIRST_YEARLY_PLANS_CATALOG_GATE_190

/* DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136 */

// DARIK_SETUP_FIELD_IDEMPOTENT_ERROR_TRUTH_204

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./setup-field.module.css";

type OnboardingState = {
  managed_account?: boolean;
  retailer_id?: string | null;
  storefront_id?: string | null;
  field_selected?: boolean;
  setup_completed?: boolean;
  getting_started_status?: "pending" | "completed" | "skipped" | string;
};

function onboardingErrorMessage204(caught: unknown) {
  if (caught instanceof Error && caught.message.trim()) {
    return caught.message.trim();
  }

  if (caught && typeof caught === "object") {
    const value = caught as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    const parts = [
      typeof value.message === "string" ? value.message.trim() : "",
      typeof value.details === "string" ? value.details.trim() : "",
      typeof value.hint === "string" ? `Hint: ${value.hint.trim()}` : "",
      typeof value.code === "string" ? `Code: ${value.code.trim()}` : "",
    ].filter(Boolean);

    if (parts.length) return parts.join(" · ");
  }

  if (typeof caught === "string" && caught.trim()) {
    return caught.trim();
  }

  return "Unknown Supabase error.";
}

const RETAIL_FIELDS = [
  ["supermarket", "Supermarket / Hypermarket", "سوبرماركت / هايبرماركت"],
  ["restaurant", "Restaurant / Food Shop", "مطعم / متجر أطعمة"],
  ["bakery", "Bakery / Sweets", "مخبز / حلويات"],
  ["cafe", "Café / Coffee Shop", "مقهى / كوفي شوب"],
  ["butcher", "Butcher / Meat Shop", "ملحمة / متجر لحوم"],
  ["produce", "Fruit & Vegetable Store", "خضار وفواكه"],
  ["clothing", "Clothing", "ملابس"],
  ["shoes", "Shoes", "أحذية"],
  ["jewelry", "Jewelry", "مجوهرات"],
  ["eyeglasses", "Eyeglasses / Optical", "نظارات / بصريات"],
  ["cosmetics", "Cosmetics / Beauty", "مستحضرات تجميل / عناية"],
  ["perfume", "Perfume", "عطور"],
  ["electronics", "Electronics", "إلكترونيات"],
  ["computers", "Computers", "كمبيوتر"],
  ["mobile_phones", "Mobile Phones & Accessories", "هواتف وإكسسوارات"],
  ["furniture", "Furniture", "أثاث"],
  ["home_appliances", "Home Appliances", "أجهزة منزلية"],
  ["home_decor", "Home Décor", "ديكور منزلي"],
  ["auto_parts", "Auto Parts", "قطع سيارات"],
  ["tires", "Tires & Car Accessories", "إطارات وإكسسوارات سيارات"],
  ["hardware", "Hardware Store", "عدد وأدوات"],
  ["building_materials", "Building Materials", "مواد بناء"],
  ["electrical_supplies", "Electrical Supplies", "مواد كهربائية"],
  ["plumbing", "Plumbing Supplies", "مواد صحية وسباكة"],
  ["tools", "Tools & Equipment", "أدوات ومعدات"],
  ["pharmacy", "Pharmacy", "صيدلية"],
  ["pet_supplies", "Pet Supplies", "مستلزمات حيوانات أليفة"],
  ["flowers", "Flowers", "زهور"],
  ["gifts", "Gifts", "هدايا"],
  ["toys", "Toys", "ألعاب"],
  ["books_stationery", "Books & Stationery", "كتب وقرطاسية"],
  ["sports", "Sports Equipment", "معدات رياضية"],
  ["smoke_shop", "Smoke Shop", "دخان ولوازم تدخين"],
  ["other", "Other", "أخرى"],
] as const;

export default function DarikInitialRetailFieldPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [retailerId, setRetailerId] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState("");
  const [otherLabel, setOtherLabel] = useState("");
  const [error, setError] = useState("");

  const canContinue = useMemo(
    () => Boolean(selectedField && (selectedField !== "other" || otherLabel.trim().length >= 2)),
    [otherLabel, selectedField]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!sessionData.session) {
        router.replace("/store-dashboard");
        return;
      }

      const { data, error: onboardingError } = await supabase.rpc("darik_direct_get_my_onboarding_v1");
      if (cancelled) return;

      if (onboardingError) {
        setError(onboardingError.message);
        setLoading(false);
        return;
      }

      const state = (data ?? {}) as OnboardingState;
      if (!state.managed_account) {
        router.replace("/store-dashboard");
        return;
      }

      // FRONTEND 204: a previous failed attempt may have marked field_selected
      // before the payment storefront was actually created. Only leave this
      // page when both pieces of onboarding state exist.
      if (state.field_selected && state.storefront_id) {
        if (!state.setup_completed) {
          router.replace("/store-dashboard/activation?onboarding=1");
        } else {
          router.replace("/store-dashboard");
        }
        return;
      }

      if (!state.retailer_id) {
        setError("Darik could not find the retailer created for this account.");
        setLoading(false);
        return;
      }

      setRetailerId(state.retailer_id);
      // Intentionally leave selectedField blank. FRONTEND 136 never preselects a field.
      setSelectedField("");
      setLoading(false);
    }

    void load();
    return () => { cancelled = true; };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/store-dashboard");
  }

  async function continueToTheme() {
    if (!retailerId || !canContinue || saving) return;
    setSaving(true);
    setError("");

    let saveStage204 = "saving the retail field";

    try {
      const normalizedOther = selectedField === "other" ? otherLabel.trim() : null;

      saveStage204 = "saving the retail field";
      const { error: fieldError } = await supabase.rpc("darik_direct_change_my_retail_field_v1", {
        p_retailer_id: retailerId,
        p_business_type: selectedField,
        p_business_type_other: normalizedOther,
      });
      if (fieldError) throw fieldError;

      // FRONTEND 204: create/verify the storefront BEFORE marking the field as
      // completed. The v190 RPC is idempotent and returns the existing
      // storefront when one already exists, so retrying is safe.
      saveStage204 = "creating the payment storefront";
      const prepareResult190 = await supabase.rpc(
        "darik_direct_prepare_payment_storefront_v190",
        { p_retailer_id: retailerId }
      );
      if (prepareResult190.error) throw prepareResult190.error;

      if (!prepareResult190.data) {
        throw new Error("Darik did not receive a storefront ID from the payment storefront RPC.");
      }

      saveStage204 = "marking the retail field as selected";
      const { error: markerError } = await supabase.rpc("darik_direct_mark_initial_field_selected_v1", {
        p_retailer_id: retailerId,
      });
      if (markerError) throw markerError;

      router.replace("/store-dashboard/activation?onboarding=1");
    } catch (caught) {
      const detail204 = onboardingErrorMessage204(caught);
      setError(
        `Could not finish ${saveStage204}: ${detail204} / تعذر إكمال إعداد المتجر.`
      );
      setSaving(false);
    }
  }

  if (loading) {
    return <main className={styles.statePage}><div className={styles.spinner} /><strong>Opening store setup… / جار فتح إعداد المتجر…</strong></main>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div><span>Darik Direct</span><strong>Store Setup / إعداد المتجر</strong></div>
          <button type="button" onClick={signOut}>Sign out / تسجيل الخروج</button>
        </header>

        <section className={styles.hero}>
          <div className={styles.stepPill}>STEP 1 · REQUIRED / الخطوة ١ · مطلوبة</div>
          <h1>What kind of store is this?</h1>
          <h2 dir="rtl">ما هو مجال متجرك؟</h2>
          <p>
            Your retail field controls product mechanics, sizing, fitment, and category behavior.
            Nothing has been selected for you.
          </p>
          <p dir="rtl">مجال المتجر يحدد خصائص المنتجات والمقاسات والفئات. لم يتم اختيار أي مجال مسبقاً.</p>
        </section>

        <section className={styles.fieldCard}>
          <div className={styles.fieldGrid}>
            {RETAIL_FIELDS.map(([value, en, ar]) => (
              <button
                key={value}
                type="button"
                className={`${styles.fieldOption} ${selectedField === value ? styles.selected : ""}`}
                onClick={() => setSelectedField(value)}
              >
                <strong>{en}</strong>
                <span dir="rtl">{ar}</span>
                <i aria-hidden="true">{selectedField === value ? "✓" : ""}</i>
              </button>
            ))}
          </div>

          {selectedField === "other" ? (
            <label className={styles.otherField}>
              <span>Describe your retail field / اكتب مجال متجرك</span>
              <input value={otherLabel} onChange={(event) => setOtherLabel(event.target.value)} placeholder="Example: Medical equipment" />
            </label>
          ) : null}

          <div className={styles.themeNext}>
            <div>
              <strong>Next: Choose yearly plan & pay by CliQ</strong>
              <span>التالي: اختر الخطة السنوية وادفع عبر CliQ</span>
            </div>
            <button type="button" disabled={!canContinue || saving} onClick={continueToTheme}>
              {saving ? "Saving… / جار الحفظ…" : "Choose yearly plan → / اختر الخطة السنوية"}
            </button>
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}
        </section>
      </div>
    </main>
  );
}
