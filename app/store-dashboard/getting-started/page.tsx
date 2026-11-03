"use client";

/* DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./getting-started.module.css";

type OnboardingState = {
  managed_account?: boolean;
  field_selected?: boolean;
  setup_completed?: boolean;
  getting_started_status?: string;
};

const SLIDES = [
  {
    eyebrow: "WELCOME / أهلاً بك",
    title: "Your store is set up.",
    titleAr: "تم إعداد متجرك.",
    body: "Before you start selling, here are the two things you will use most: adding products and adding categories.",
    bodyAr: "قبل أن تبدأ، سنشرح لك أهم شيئين: إضافة المنتجات وإضافة الفئات.",
    visual: "store",
  },
  {
    eyebrow: "PRODUCTS / المنتجات",
    title: "Add products from Products.",
    titleAr: "أضف منتجاتك من صفحة المنتجات.",
    body: "Open Products, choose Add Product, and follow the product wizard. Darik automatically shows the product options that match your retail field.",
    bodyAr: "افتح صفحة المنتجات ثم اختر إضافة منتج واتبع الخطوات. داريك يعرض الخصائص المناسبة لمجال متجرك تلقائياً.",
    visual: "product",
  },
  {
    eyebrow: "CATEGORIES / الفئات",
    title: "Need another category? Add it anytime.",
    titleAr: "تحتاج فئة إضافية؟ أضفها في أي وقت.",
    body: "Open Categories to see the categories for your retail field. You can add your own category when your store needs something extra.",
    bodyAr: "افتح صفحة الفئات لرؤية فئات مجال متجرك، ويمكنك إضافة فئة خاصة بك عند الحاجة.",
    visual: "category",
  },
  {
    eyebrow: "READY / جاهز",
    title: "You are ready to build your store.",
    titleAr: "أنت جاهز لبناء متجرك.",
    body: "Your dashboard is now unlocked. Add your products, review your categories, and get the store ready for customers.",
    bodyAr: "لوحة التحكم أصبحت مفتوحة بالكامل. أضف منتجاتك وراجع الفئات وجهّز متجرك للعملاء.",
    visual: "ready",
  },
] as const;

export default function DarikGettingStartedPage() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const current = useMemo(() => SLIDES[slide], [slide]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!sessionData.session) { router.replace("/store-dashboard"); return; }

      const { data, error: stateError } = await supabase.rpc("darik_direct_get_my_onboarding_v1");
      if (cancelled) return;
      if (stateError) { setError(stateError.message); setLoading(false); return; }

      const state = (data ?? {}) as OnboardingState;
      if (!state.managed_account) { router.replace("/store-dashboard"); return; }
      if (!state.field_selected) { router.replace("/store-dashboard/setup-field"); return; }
      if (!state.setup_completed) { router.replace("/store-dashboard/storefront"); return; }
      if (state.getting_started_status !== "pending") { router.replace("/store-dashboard"); return; }
      setLoading(false);
    }
    void load();
    return () => { cancelled = true; };
  }, [router]);

  async function finish(status: "completed" | "skipped") {
    if (busy) return;
    setBusy(true);
    setError("");
    const { error: statusError } = await supabase.rpc("darik_direct_set_getting_started_status_v1", { p_status: status });
    if (statusError) {
      setError(statusError.message);
      setBusy(false);
      return;
    }
    router.replace("/store-dashboard");
  }

  if (loading) {
    return <main className={styles.statePage}><div className={styles.spinner} /><strong>Preparing your guide… / جار تجهيز الدليل…</strong></main>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.progress} aria-label="Getting started progress">
          {SLIDES.map((_, index) => <span key={index} className={index <= slide ? styles.active : ""} />)}
        </div>

        <section className={styles.card}>
          <div className={`${styles.visual} ${styles[current.visual]}`} aria-hidden="true">
            <div className={styles.visualTop}><span>Darik Direct</span><i /></div>
            {current.visual === "store" ? <><div className={styles.storeHero}/><div className={styles.miniGrid}><i/><i/><i/></div></> : null}
            {current.visual === "product" ? <><div className={styles.fakeInput}/><div className={styles.fakeInput}/><div className={styles.productDrop}><b>+</b><span>Add Product</span></div></> : null}
            {current.visual === "category" ? <><div className={styles.categoryRows}><i/><i/><i/></div><div className={styles.addCategory}>+ Add Category</div></> : null}
            {current.visual === "ready" ? <><div className={styles.readyCheck}>✓</div><div className={styles.readyLines}><i/><i/></div></> : null}
          </div>

          <div className={styles.copy}>
            <span className={styles.eyebrow}>{current.eyebrow}</span>
            <h1>{current.title}</h1>
            <h2 dir="rtl">{current.titleAr}</h2>
            <p>{current.body}</p>
            <p dir="rtl">{current.bodyAr}</p>

            {error ? <div className={styles.error}>{error}</div> : null}

            <div className={styles.actions}>
              {slide < SLIDES.length - 1 ? (
                <>
                  <button className={styles.skip} type="button" disabled={busy} onClick={() => finish("skipped")}>Skip all instructions / تخطي جميع التعليمات</button>
                  <button className={styles.next} type="button" onClick={() => setSlide((value) => Math.min(value + 1, SLIDES.length - 1))}>Next / التالي →</button>
                </>
              ) : (
                <button className={styles.nextWide} type="button" disabled={busy} onClick={() => finish("completed")}>
                  {busy ? "Opening dashboard…" : "Go to Dashboard / الذهاب إلى لوحة التحكم"}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
