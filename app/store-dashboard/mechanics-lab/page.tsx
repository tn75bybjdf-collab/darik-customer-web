"use client";


/* DARIK_RETAILER_DASHBOARD_HIDE_MECHANICS_TAB_347 */
// DARIK_EYEGLASSES_RETAIL_FIELD_MECHANICS_135

// DARIK_SHOE_CATEGORY_SIZE_GROUPS_053

// DARIK_RETAIL_FIELDS_SMOKE_SHOP_050

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import {
  clearMechanicsLabField,
  darikMechanicsFieldOptions,
  mechanicsFieldLabel,
  readMechanicsLabField,
  withMechanicsPreview,
  writeMechanicsLabField,
} from "@/lib/darikMechanicsLab";
import DashboardLogoutButton from "../components/DashboardLogoutButton";
import styles from "./mechanics-lab.module.css";

type StoreContext = {
  retailer_id: string;
  business_name: string;
  business_type: string | null;
  storefront_slug: string | null;
};

type ContextResult = {
  stores: StoreContext[];
};

function mechanicsSummary(field: string) {
  if (field === "auto_parts") {
    return [
      "Year / Make / Model fitment",
      "Auto-parts pricing modes",
      "Call / WhatsApp quote flow",
    ];
  }
  if (["supermarket", "bakery", "smoke_shop"].includes(field)) {
    return [
      "Sold per item or by weight",
      "Kilogram pricing",
      "Customer weight/cart rules — next mechanic",
    ];
  }
  if (field === "shoes") {
    return [
      "Footwear, apparel, bags, belts, insoles, laces, care, and accessories",
      "Category-specific required or optional size presets with custom override",
      "Footwear keeps EU-first sizing with automatic U.S. matching",
    ];
  }
  if (field === "smoke_shop") {
    return [
      "Smoke Shop category system",
      "Sold per item or by weight",
      "Age / ID verification — next mechanic",
    ];
  }
  if (field === "eyeglasses") {
    return [
      "Optical-store departments for frames, sunglasses, lenses, care, and accessories",
      "Brand -> optional model/style hierarchy with retailer-added custom brands",
      "Single or multiple frame colors plus dimensions, fit, material, and lens features",
    ];
  }
  return [
    "Base Darik product flow",
    "Field-specific mechanics will be added and tested here",
    "No mechanics are inherited from the visual theme",
  ];
}

export default function DarikMechanicsLabPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [stores, setStores] = useState<StoreContext[]>([]);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [selectedField, setSelectedField] = useState("supermarket");
  const [activeField, setActiveField] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedStore = useMemo(
    () => stores.find((store) => store.retailer_id === selectedRetailerId) || null,
    [stores, selectedRetailerId]
  );

  useEffect(() => {
    setActiveField(readMechanicsLabField());

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
    if (!session) return;

    let cancelled = false;
    async function loadContext() {
      setLoading(true);
      const result = await supabase.rpc("darik_direct_get_my_context");
      if (cancelled) return;

      if (result.error) {
        setError(result.error.message);
        setStores([]);
        setLoading(false);
        return;
      }

      const nextStores = Array.isArray((result.data as ContextResult | null)?.stores)
        ? ((result.data as ContextResult).stores || [])
        : [];
      setStores(nextStores);
      setSelectedRetailerId((current) =>
        current && nextStores.some((store) => store.retailer_id === current)
          ? current
          : nextStores[0]?.retailer_id || ""
      );
      setLoading(false);
    }

    loadContext();
    return () => {
      cancelled = true;
    };
  }, [session]);

  function activateMechanicsLab() {
    const next = writeMechanicsLabField(selectedField);
    setActiveField(next);
    setMessage(
      `Mechanics Lab active: ${mechanicsFieldLabel(next)}. The real retail field was not changed.`
    );
    setError("");
  }

  function stopMechanicsLab() {
    clearMechanicsLabField();
    setActiveField("");
    setMessage("Mechanics Lab stopped. Pages now use the store's real retail field.");
    setError("");
  }

  function openInternal(pathname: string) {
    activateMechanicsLab();
    window.location.href = withMechanicsPreview(pathname, selectedField);
  }

  function openStorefront() {
    if (!selectedStore?.storefront_slug) {
      setError("This test store does not have a storefront slug yet.");
      return;
    }
    activateMechanicsLab();
    window.open(
      withMechanicsPreview(`/${selectedStore.storefront_slug}`, selectedField),
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (!authReady || loading) {
    return (
      <main className={styles.statePage}>
        <div className={styles.spinner} />
        <h1>Opening Mechanics Lab… / جارٍ فتح مختبر الخصائص…</h1>
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

  const selectedSummary = mechanicsSummary(selectedField);

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div>
          <p>Darik</p>
          <h1>Direct</h1>
        </div>
        <nav>
          <a href="/store-dashboard">Overview / نظرة عامة</a>
          <a href="/store-dashboard/storefront">Storefront / واجهة المتجر</a>
          <a href="/store-dashboard/products">Products / المنتجات</a>
          <a href="/store-dashboard/categories">Categories / الأقسام</a>

        </nav>
        <div className={styles.sidebarFooter}>
          <span>{session.user.email}</span>
          <DashboardLogoutButton />
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p>DARIK DEVELOPMENT TOOL / أداة اختبار داريك</p>
            <h2>Mechanics Lab / مختبر خصائص النشاط</h2>
          </div>
          {stores.length > 1 ? (
            <select
              value={selectedRetailerId}
              onChange={(event) => setSelectedRetailerId(event.target.value)}
            >
              {stores.map((store) => (
                <option key={store.retailer_id} value={store.retailer_id}>
                  {store.business_name}
                </option>
              ))}
            </select>
          ) : null}
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        <section className={styles.heroCard}>
          <div>
            <span>MECHANICS ≠ THEME</span>
            <h1>Test the business rules without changing the real store.</h1>
            <p>
              Choose any retail field below. Product forms, category presets, storefront
              mechanics, and future checkout rules can use that field while the store keeps
              its real retail field and its visual theme stays separate.
            </p>
          </div>
          <div className={styles.statusCard}>
            <small>Active mechanics test / اختبار الخصائص الحالي</small>
            <strong>
              {activeField
                ? mechanicsFieldLabel(activeField)
                : "OFF — using real retail field / متوقف"}
            </strong>
          </div>
        </section>

        <section className={styles.compareGrid}>
          <article>
            <span>Actual retail field / النشاط الحقيقي</span>
            <strong>{mechanicsFieldLabel(selectedStore?.business_type)}</strong>
            <p>This value stays in Supabase and is never changed by Mechanics Lab.</p>
          </article>
          <article className={styles.testCard}>
            <span>Test mechanics as / اختبر الخصائص كنشاط</span>
            <strong>{mechanicsFieldLabel(selectedField)}</strong>
            <p>This is a browser-only development override.</p>
          </article>
        </section>

        <section className={styles.controlPanel}>
          <div className={styles.controlHeading}>
            <div>
              <span>TEST RETAIL FIELD / نشاط الاختبار</span>
              <h2>Choose the mechanics you want to work on</h2>
            </div>
            <b>TESTING ONLY</b>
          </div>

          <label className={styles.fieldSelect}>
            Retail field mechanics / خصائص النشاط
            <select
              value={selectedField}
              onChange={(event) => {
                setSelectedField(event.target.value);
                setMessage("");
              }}
            >
              {darikMechanicsFieldOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} / {option.labelAr}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.mechanicsPreview}>
            <span>What this test field currently exposes / ما يتم اختباره حالياً</span>
            <div>
              {selectedSummary.map((item) => (
                <p key={item}>✓ {item}</p>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.activateButton} onClick={activateMechanicsLab}>
              Activate mechanics test / تفعيل الاختبار
            </button>
            <button type="button" onClick={() => openInternal("/store-dashboard/products")}>
              Test Add Product / اختبار إضافة منتج
            </button>
            <button type="button" onClick={() => openInternal("/store-dashboard/categories")}>
              Test Categories / اختبار الأقسام
            </button>
            <button type="button" onClick={openStorefront} disabled={!selectedStore?.storefront_slug}>
              Test Customer Storefront / اختبار واجهة العميل
            </button>
            <button
              type="button"
              className={styles.stopButton}
              onClick={stopMechanicsLab}
              disabled={!activeField}
            >
              Stop test / إيقاف الاختبار
            </button>
          </div>

          <p className={styles.safetyNote}>
            Mechanics Lab never updates the retailer's real business_type. It only stores the
            selected test field in this browser and adds previewMechanicsField to test URLs.
            / مختبر الخصائص لا يغيّر نوع النشاط الحقيقي في قاعدة البيانات.
          </p>
        </section>

        <section className={styles.nextBuild}>
          <span>NEXT SUPERMARKET MECHANIC / الخاصية التالية للسوبرماركت</span>
          <h2>Sold per item vs. sold by weight</h2>
          <p>
            The next build will use this lab to test the entire flow: product setup → unit /
            weight price → customer quantity → cart math → checkout → retailer order.
          </p>
        </section>
      </section>
    </main>
  );
}
