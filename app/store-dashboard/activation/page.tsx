"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./activation.module.css";

type StoreContext = {
  retailer_id: string;
  business_name: string;
  storefront_id: string | null;
  storefront_slug: string | null;
  activation_status?: string | null;
  activation_plan?: string | null;
  activation_expires_at?: string | null;
  business_address?: string | null;
  location_locked_at?: string | null;
};

type ContextResult = { stores: StoreContext[] };

type ActivationRequest = {
  id: string;
  plan_code: string;
  amount_expected_jod: number | string;
  sender_name: string;
  request_status: string;
  admin_note: string | null;
  domain_preferences: string[] | null;
  assigned_domain: string | null;
  created_at: string;
  reviewed_at: string | null;
};

type Plan = {
  code: string;
  title: string;
  titleAr: string;
  price: number;
  detail: string;
  detailAr: string;
  premium?: boolean;
};

const plans: readonly Plan[] = [
  {
    code: "basic_monthly",
    title: "Monthly",
    titleAr: "شهري",
    price: 45,
    detail: "45 JOD each month",
    detailAr: "45 دينارًا كل شهر",
  },
  {
    code: "basic_6_month",
    title: "6 months",
    titleAr: "6 أشهر",
    price: 210,
    detail: "35 JOD/month prepaid",
    detailAr: "35 دينارًا شهريًا، مدفوعة مقدمًا",
  },
  {
    code: "basic_12_month",
    title: "12 months",
    titleAr: "12 شهرًا",
    price: 300,
    detail: "25 JOD/month prepaid",
    detailAr: "25 دينارًا شهريًا، مدفوعة مقدمًا",
  },
  {
    code: "premium_annual",
    title: "Premium annual",
    titleAr: "الباقة السنوية المميزة",
    price: 600,
    detail: "Annual plan plus a custom domain",
    detailAr: "الخطة السنوية مع نطاق خاص",
    premium: true,
  },
] as const;

const planByCode = new Map(plans.map((item) => [item.code, item]));

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\.$/, "");
}

function isValidDomain(value: string) {
  const normalized = normalizeDomain(value);
  return (
    normalized.length >= 4 &&
    normalized.length <= 253 &&
    !normalized.includes("/") &&
    !normalized.includes(":") &&
    /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(normalized)
  );
}

function statusLabel(value: string | null | undefined) {
  switch (value || "free_draft") {
    case "active":
      return "ACTIVE / مفعّل";
    case "payment_review":
      return "UNDER REVIEW / قيد المراجعة";
    case "suspended":
      return "SUSPENDED / موقوف";
    case "expired":
      return "EXPIRED / منتهي";
    default:
      return "FREE DRAFT / مسودة مجانية";
  }
}

function requestStatusLabel(value: string) {
  switch (value) {
    case "approved":
      return "APPROVED / مقبول";
    case "rejected":
      return "REJECTED / مرفوض";
    case "needs_new_receipt":
      return "NEW RECEIPT NEEDED / مطلوب إيصال جديد";
    default:
      return "PENDING / قيد المراجعة";
  }
}

function planLabel(code: string) {
  const item = planByCode.get(code);
  return item ? `${item.title} / ${item.titleAr}` : code.replace(/_/g, " ");
}

export default function StoreActivationPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<StoreContext | null>(null);
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [plan, setPlan] = useState("basic_monthly");
  const [senderName, setSenderName] = useState("");
  const [cliqReference, setCliqReference] = useState("");
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [premiumInfoOpen, setPremiumInfoOpen] = useState(false);
  const [domainPreferences, setDomainPreferences] = useState(["", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cliqName = (process.env.NEXT_PUBLIC_DARIK_CLIQ_NAME || "").trim();
  const cliqAlias = (process.env.NEXT_PUBLIC_DARIK_CLIQ_ALIAS || "").trim();
  const paymentDetailsReady = Boolean(cliqName && cliqAlias);
  const selectedPlan = plans.find((item) => item.code === plan) || plans[0];
  const pending = requests.some((request) => request.request_status === "pending");
  const active =
    store?.activation_status === "active" &&
    (!store.activation_expires_at || new Date(store.activation_expires_at) > new Date());

  const loadData = useCallback(async () => {
    const contextResult = await supabase.rpc("darik_direct_get_my_context");

    if (contextResult.error) {
      setError(contextResult.error.message);
      setLoading(false);
      return;
    }

    const context = contextResult.data as ContextResult;
    const nextStore = Array.isArray(context?.stores) ? context.stores[0] ?? null : null;
    setStore(nextStore);

    if (nextStore?.retailer_id) {
      const requestsResult = await supabase
        .from("retailer_store_activation_requests")
        .select(
          "id,plan_code,amount_expected_jod,sender_name,request_status,admin_note,domain_preferences,assigned_domain,created_at,reviewed_at",
        )
        .eq("retailer_id", nextStore.retailer_id)
        .order("created_at", { ascending: false });

      if (!requestsResult.error) {
        setRequests((requestsResult.data ?? []) as ActivationRequest[]);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) {
        router.replace("/store-dashboard");
      } else {
        loadData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) router.replace("/store-dashboard");
    });

    return () => subscription.unsubscribe();
  }, [loadData, router]);

  useEffect(() => {
    if (!receipt) {
      setReceiptPreview("");
      return;
    }

    const url = URL.createObjectURL(receipt);
    setReceiptPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [receipt]);

  function chooseReceipt(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setReceipt(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Upload a JPG, PNG, or WebP receipt image. / حمّل صورة إيصال بصيغة JPG أو PNG أو WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("The receipt image must be 8 MB or smaller. / يجب ألا يتجاوز حجم صورة الإيصال 8 ميجابايت.");
      event.target.value = "";
      return;
    }

    setError("");
    setReceipt(file);
  }

  async function submitActivation() {
    if (!session || !store?.storefront_id || !store.retailer_id) return;

    setError("");
    setMessage("");

    if (!paymentDetailsReady) {
      setError(
        "CliQ payment details are temporarily unavailable. Contact Darik support. / معلومات الدفع عبر كليك غير متاحة مؤقتًا. تواصل مع دعم داريك.",
      );
      return;
    }

    if (senderName.trim().length < 2) {
      setError("Enter the name used to send the CliQ payment. / أدخل الاسم المستخدم لإرسال دفعة كليك.");
      return;
    }

    if (!receipt) {
      setError("Upload the CliQ payment receipt. / حمّل إيصال دفعة كليك.");
      return;
    }

    let normalizedDomains: string[] | null = null;

    if (selectedPlan.premium) {
      normalizedDomains = domainPreferences.map(normalizeDomain);

      if (normalizedDomains.some((value) => !isValidDomain(value))) {
        setError(
          "Enter five valid domain names without https://, www, spaces, or page paths. / أدخل خمسة أسماء نطاقات صحيحة من دون https:// أو www أو مسافات أو روابط صفحات.",
        );
        return;
      }

      if (new Set(normalizedDomains).size !== 5) {
        setError(
          "All five domain choices must be different. / يجب أن تكون خيارات النطاقات الخمسة مختلفة.",
        );
        return;
      }
    }

    setBusy(true);

    if (selectedPlan.premium && normalizedDomains) {
      const domainResult = await supabase.rpc("darik_direct_save_premium_domain_preferences", {
        p_storefront_id: store.storefront_id,
        p_domain_preferences: normalizedDomains,
      });

      if (domainResult.error) {
        setBusy(false);
        setError(domainResult.error.message);
        return;
      }
    }

    const extension = receipt.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${store.retailer_id}/${crypto.randomUUID()}-${safeFileName(
      receipt.name.replace(/\.[^.]+$/, ""),
    )}.${extension}`;

    const upload = await supabase.storage
      .from("darik-store-activation-receipts")
      .upload(path, receipt, {
        cacheControl: "3600",
        upsert: false,
        contentType: receipt.type,
      });

    if (upload.error) {
      setBusy(false);
      setError(upload.error.message);
      return;
    }

    const result = await supabase.rpc("darik_direct_submit_activation_request", {
      p_storefront_id: store.storefront_id,
      p_plan_code: plan,
      p_sender_name: senderName.trim(),
      p_receipt_path: path,
      p_cliq_reference: cliqReference.trim() || null,
      p_retailer_note: note.trim() || null,
    });

    if (result.error) {
      await supabase.storage.from("darik-store-activation-receipts").remove([path]);
      setBusy(false);
      setError(result.error.message);
      return;
    }

    setBusy(false);
    setMessage(
      "Payment submitted. Darik will review the receipt before your public store goes live. / تم إرسال الدفعة. ستراجع داريك الإيصال قبل تفعيل متجرك للعامة.",
    );
    setReceipt(null);
    setSenderName("");
    setCliqReference("");
    setNote("");
    setDomainPreferences(["", "", "", "", ""]);
    await loadData();
  }

  if (loading || !session) {
    return (
      <main className={styles.page}>
        <section className={styles.content}>
          <div className={styles.panel}>Opening activation center… / جارٍ فتح مركز التفعيل…</div>
        </section>
      </main>
    );
  }

  const statusClass = active ? styles.statusActive : pending ? styles.statusPending : "";

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>Darik</span>
          <h1>Direct</h1>
        </div>
        <nav className={styles.nav}>
          <a href="/store-dashboard">Overview / نظرة عامة</a>
          <a href="/store-dashboard/storefront">Storefront / واجهة المتجر</a>
          <a href="/store-dashboard/products">Products / المنتجات</a>
          <a href="/store-dashboard/categories">Categories / الفئات</a>
          <a href="/store-dashboard/orders">Orders / الطلبات</a>
          <a className={styles.active} href="/store-dashboard/activation">
            Go live / تفعيل المتجر
          </a>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p>Store activation / تفعيل المتجر</p>
            <h1>{store?.business_name || "Your Darik store / متجرك على داريك"}</h1>
          </div>
          <span className={`${styles.status} ${statusClass}`}>{statusLabel(store?.activation_status)}</span>
        </header>

        {error ? <div className={`${styles.message} ${styles.error}`}>{error}</div> : null}
        {message ? <div className={`${styles.message} ${styles.success}`}>{message}</div> : null}

        {active ? (
          <section className={styles.panel}>
            <h2>Your store is live / متجرك مفعّل</h2>
            <p>The public storefront is active and can receive orders. / واجهة المتجر العامة مفعّلة ويمكنها استقبال الطلبات.</p>
            <div className={styles.locked}>
              <strong>Public address / رابط المتجر العام</strong>
              <span>getdarik.com/store/{store?.storefront_slug}</span>
              {store?.activation_expires_at ? (
                <span>
                  Active through {new Date(store.activation_expires_at).toLocaleDateString()} / مفعّل حتى{" "}
                  {new Date(store.activation_expires_at).toLocaleDateString("ar-JO")}
                </span>
              ) : null}
            </div>
          </section>
        ) : null}

        {pending ? (
          <section className={styles.panel}>
            <h2>Payment under review / الدفعة قيد المراجعة</h2>
            <p>
              Your public page remains Coming Soon while Darik verifies the CliQ receipt. You can continue editing and
              previewing the store. / ستبقى صفحتك العامة بحالة «قريبًا» حتى تتحقق داريك من إيصال كليك. يمكنك الاستمرار في
              تعديل المتجر ومعاينته.
            </p>
          </section>
        ) : null}

        {!active && !pending ? (
          <>
            <section className={styles.panel}>
              <h2>Choose how you want to activate / اختر طريقة تفعيل متجرك</h2>
              <p>
                The account and private preview stay free. Payment is required only to publish the customer-facing store.
                / يبقى الحساب والمعاينة الخاصة مجانيين. الدفع مطلوب فقط لنشر المتجر للعملاء.
              </p>

              <div className={styles.planGrid}>
                {plans.map((item) => (
                  <div className={styles.planWrap} key={item.code}>
                    <button
                      type="button"
                      className={`${styles.plan} ${plan === item.code ? styles.planSelected : ""}`}
                      onClick={() => setPlan(item.code)}
                      aria-pressed={plan === item.code}
                    >
                      <span className={styles.planTitle}>
                        {item.title} / {item.titleAr}
                      </span>
                      <strong>{item.price} JOD / د.أ</strong>
                      <small>
                        {item.detail}
                        <bdi> / </bdi>
                        {item.detailAr}
                      </small>
                    </button>

                    {item.premium ? (
                      <>
                        <button
                          type="button"
                          className={styles.infoButton}
                          aria-label="Premium plan information / معلومات الباقة المميزة"
                          aria-expanded={premiumInfoOpen}
                          onClick={() => setPremiumInfoOpen((current) => !current)}
                        >
                          i
                        </button>
                        {premiumInfoOpen ? (
                          <div className={styles.premiumInfo} role="note">
                            <strong>What Premium includes / ماذا تشمل الباقة المميزة؟</strong>
                            <p>
                              Premium includes everything in the annual plan plus one eligible custom domain connected to
                              your Darik store.
                            </p>
                            <p dir="rtl">
                              تشمل الباقة المميزة جميع مزايا الخطة السنوية، بالإضافة إلى نطاق خاص مؤهل واحد يتم ربطه بمتجرك
                              على داريك.
                            </p>
                            <div className={styles.domainExample}>
                              <span>Example / مثال</span>
                              <code>getdarik.com/store/fantoushmall</code>
                              <span>becomes / يصبح</span>
                              <code>fantoushmall.com</code>
                            </div>
                            <small>
                              Darik checks your five choices in order and confirms the first eligible domain that is
                              available. / تتحقق داريك من خياراتك الخمسة بالترتيب وتؤكد أول نطاق مؤهل ومتاح.
                            </small>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ))}
              </div>

              {selectedPlan.premium ? (
                <section className={styles.domainPanel}>
                  <div className={styles.domainPanelHead}>
                    <div>
                      <h3>Choose five domain names / اختر خمسة أسماء نطاقات</h3>
                      <p>
                        Enter them from most desired to least desired. Darik will check availability in this order and
                        assign the first eligible domain available. / أدخلها من الأكثر رغبة إلى الأقل رغبة. ستتحقق داريك
                        من التوفر بهذا الترتيب وتخصص أول نطاق مؤهل ومتاح.
                      </p>
                    </div>
                    <span>Required for Premium / مطلوب للباقة المميزة</span>
                  </div>

                  <div className={styles.domainGrid}>
                    {domainPreferences.map((value, index) => (
                      <label className={styles.domainLabel} key={index}>
                        {index + 1}.{" "}
                        {index === 0
                          ? "Most desired / الأكثر رغبة"
                          : index === 4
                            ? "Least desired / الأقل رغبة"
                            : `Choice ${index + 1} / الخيار ${index + 1}`}
                        <input
                          value={value}
                          onChange={(event) =>
                            setDomainPreferences((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? event.target.value : item,
                              ),
                            )
                          }
                          placeholder="yourdomain.com"
                          inputMode="url"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                        />
                      </label>
                    ))}
                  </div>

                  <p className={styles.domainHint}>
                    Enter only the domain name, without https://, www, or a page path. / أدخل اسم النطاق فقط، من دون
                    https:// أو www أو رابط صفحة.
                  </p>

                  <div className={styles.domainTiming} role="note">
                    <strong>Domain readiness / جاهزية النطاق</strong>
                    <span>
                      Your custom domain may take up to 48 hours to become ready after approval. In most cases, it is ready
                      within a few hours. / قد يستغرق تجهيز النطاق الخاص ما يصل إلى 48 ساعة بعد الموافقة، وفي معظم الحالات
                      يصبح جاهزًا خلال بضع ساعات.
                    </span>
                  </div>
                </section>
              ) : null}
            </section>

            <section className={styles.panel}>
              <h2>Pay Darik by CliQ / ادفع لداريك عبر كليك</h2>
              <p>
                Send exactly {selectedPlan.price} JOD, then upload the receipt below. / حوّل مبلغًا قدره{" "}
                {selectedPlan.price} دينارًا، ثم حمّل الإيصال أدناه.
              </p>

              {!paymentDetailsReady ? (
                <div className={styles.configWarning} role="alert">
                  <strong>CliQ payment details are unavailable / معلومات الدفع عبر كليك غير متاحة</strong>
                  <span>
                    Darik must finish configuring the payment account before you can submit an activation payment. / يجب
                    على داريك إكمال إعداد حساب الدفع قبل أن تتمكن من إرسال دفعة التفعيل.
                  </span>
                </div>
              ) : null}

              <div className={styles.paymentBox}>
                <div className={styles.cliqCard}>
                  <div className={styles.cliqHeading}>CliQ payment details / معلومات الدفع عبر كليك</div>

                  <span>CliQ account name / اسم حساب كليك</span>
                  <strong>{paymentDetailsReady ? cliqName : "—"}</strong>

                  <span>CliQ alias or mobile / اسم كليك المستعار أو رقم الهاتف</span>
                  <strong>{paymentDetailsReady ? cliqAlias : "—"}</strong>

                  <span>Store reference / مرجع المتجر</span>
                  <strong>{store?.storefront_slug || store?.storefront_id}</strong>

                  <p className={styles.referenceNote}>
                    Add this store reference to the payment note when possible. / أضف مرجع المتجر في ملاحظة الدفعة إن أمكن.
                  </p>
                </div>

                <div className={styles.form}>
                  <label className={styles.label}>
                    Sender name / اسم المرسل
                    <input
                      value={senderName}
                      onChange={(event) => setSenderName(event.target.value)}
                      placeholder="Name shown on the CliQ payment / الاسم الظاهر في دفعة كليك"
                    />
                  </label>

                  <label className={styles.label}>
                    CliQ reference / مرجع حركة كليك <span>Optional / اختياري</span>
                    <input value={cliqReference} onChange={(event) => setCliqReference(event.target.value)} />
                  </label>

                  <label className={styles.label}>
                    Note / ملاحظة <span>Optional / اختياري</span>
                    <textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
                  </label>

                  <label className={`${styles.label} ${styles.upload}`}>
                    CliQ receipt image / صورة إيصال كليك
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseReceipt} />
                    {receiptPreview ? (
                      <img className={styles.receiptPreview} src={receiptPreview} alt="CliQ receipt preview" />
                    ) : null}
                  </label>

                  <button
                    type="button"
                    className={styles.submit}
                    onClick={submitActivation}
                    disabled={busy || !paymentDetailsReady}
                  >
                    {busy
                      ? "Uploading and submitting… / جارٍ الرفع والإرسال…"
                      : `Submit ${selectedPlan.title} payment / إرسال دفعة ${selectedPlan.titleAr}`}
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : null}

        <section className={styles.panel}>
          <h2>Payment history / سجل الدفعات</h2>
          <p>All activation requests remain attached to this store. / تبقى جميع طلبات التفعيل مرتبطة بهذا المتجر.</p>

          <div className={styles.history}>
            {requests.length ? (
              requests.map((request) => (
                <article className={styles.request} key={request.id}>
                  <div>
                    <h3>
                      {planLabel(request.plan_code)} · {Number(request.amount_expected_jod).toFixed(2)} JOD
                    </h3>
                    <p>
                      Sent by {request.sender_name} on {new Date(request.created_at).toLocaleString()} / أرسلها{" "}
                      {request.sender_name} بتاريخ {new Date(request.created_at).toLocaleString("ar-JO")}
                    </p>
                    {request.domain_preferences?.length ? (
                      <div className={styles.historyDomains}>
                        <strong>Domain choices / خيارات النطاق</strong>
                        <ol>
                          {request.domain_preferences.map((domain) => (
                            <li key={domain}>{domain}</li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                    {request.assigned_domain ? (
                      <p>
                        Assigned domain / النطاق المخصص: <strong>{request.assigned_domain}</strong>
                      </p>
                    ) : null}
                    {request.admin_note ? <p>Darik note / ملاحظة داريك: {request.admin_note}</p> : null}
                  </div>
                  <strong>{requestStatusLabel(request.request_status)}</strong>
                </article>
              ))
            ) : (
              <div className={styles.locked}>
                <strong>No activation payments yet / لا توجد دفعات تفعيل بعد</strong>
                <span>Your free draft remains available. / ستبقى مسودتك المجانية متاحة.</span>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
