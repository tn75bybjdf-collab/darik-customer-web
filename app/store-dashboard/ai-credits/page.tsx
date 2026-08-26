"use client";

/* DARIK_RETAILER_WEB_AI_CREDITS_TAB_327M */

import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import DashboardLogoutButton from "../components/DashboardLogoutButton";
import styles from "./ai-credits.module.css";

type RetailerStore327M = {
  retailer_id: string;
  business_name?: string | null;
};

type Context327M = {
  stores?: RetailerStore327M[];
};

type Pack327M = {
  key: "credits_500" | "credits_1000" | "credits_2000";
  credits: number;
  price_jod: number;
};

type Request327M = {
  id: string;
  pack_key?: string | null;
  credits?: number | null;
  price_jod?: number | string | null;
  status?: string | null;
  cliq_reference_number?: string | null;
  cliq_sender_name?: string | null;
  cliq_sender_phone?: string | null;
  submitted_amount_jod?: number | string | null;
  proof_submitted_at?: string | null;
  admin_note?: string | null;
  approved_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type CreditsResponse327M = {
  ok?: boolean;
  error?: string;
  balance?: number;
  lifetime_signup_granted?: number;
  lifetime_purchased?: number;
  lifetime_spent?: number;
  enhancement_cost?: number;
  payment?: {
    method?: string;
    name?: string;
    alias?: string;
  };
  packs?: Pack327M[];
  recent_requests?: Request327M[];
};

const DEFAULT_PACKS_327M: Pack327M[] = [
  { key: "credits_500", credits: 500, price_jod: 20 },
  { key: "credits_1000", credits: 1000, price_jod: 35 },
  { key: "credits_2000", credits: 2000, price_jod: 50 },
];

function money327M(value: unknown) {
  const number327M = Number(value ?? 0);
  return `${Number.isFinite(number327M) ? number327M.toFixed(2) : "0.00"} JOD`;
}

function date327M(value: string | null | undefined) {
  if (!value) return "—";
  const parsed327M = new Date(value);
  if (Number.isNaN(parsed327M.getTime())) return value;
  return parsed327M.toLocaleString();
}

function requestStatus327M(value: string | null | undefined) {
  const normalized327M = String(value || "pending").toLowerCase();
  if (normalized327M === "approved") {
    return { label: "Approved / مقبول", className: styles.approved };
  }
  if (normalized327M === "rejected" || normalized327M === "denied") {
    return { label: "Rejected / مرفوض", className: styles.rejected };
  }
  return { label: "Pending review / قيد المراجعة", className: styles.pending };
}

export default function RetailerAiCreditsPage327M() {
  const [session327M, setSession327M] = useState<Session | null>(null);
  const [authReady327M, setAuthReady327M] = useState(false);
  const [stores327M, setStores327M] = useState<RetailerStore327M[]>([]);
  const [retailerId327M, setRetailerId327M] = useState("");
  const [credits327M, setCredits327M] = useState<CreditsResponse327M | null>(null);
  const [loading327M, setLoading327M] = useState(true);
  const [refreshing327M, setRefreshing327M] = useState(false);
  const [error327M, setError327M] = useState("");
  const [success327M, setSuccess327M] = useState("");

  const [selectedPack327M, setSelectedPack327M] =
    useState<Pack327M["key"]>("credits_500");
  const [senderName327M, setSenderName327M] = useState("");
  const [senderPhone327M, setSenderPhone327M] = useState("");
  const [reference327M, setReference327M] = useState("");
  const [receipt327M, setReceipt327M] = useState<File | null>(null);
  const [submitting327M, setSubmitting327M] = useState(false);
  const receiptInput327M = useRef<HTMLInputElement | null>(null);

  const selectedStore327M = useMemo(
    () =>
      stores327M.find(
        (store327M) => store327M.retailer_id === retailerId327M,
      ) ?? null,
    [stores327M, retailerId327M],
  );

  const packs327M =
    Array.isArray(credits327M?.packs) && credits327M.packs.length
      ? credits327M.packs
      : DEFAULT_PACKS_327M;

  const pack327M =
    packs327M.find((item327M) => item327M.key === selectedPack327M) ??
    packs327M[0] ??
    DEFAULT_PACKS_327M[0];

  const requests327M = Array.isArray(credits327M?.recent_requests)
    ? credits327M.recent_requests
    : [];

  const pendingRequest327M =
    requests327M.find(
      (request327M) =>
        String(request327M.status || "").toLowerCase() === "pending",
    ) ?? null;

  const loadCredits327M = useCallback(
    async (quiet327M = false) => {
      if (!session327M?.access_token || !retailerId327M) return;

      if (quiet327M) {
        setRefreshing327M(true);
      } else {
        setLoading327M(true);
      }

      setError327M("");

      try {
        const response327M = await fetch(
          `/api/darik-direct/ai-credits?retailer_id=${encodeURIComponent(
            retailerId327M,
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session327M.access_token}`,
            },
            cache: "no-store",
          },
        );

        const payload327M =
          (await response327M.json().catch(() => ({}))) as CreditsResponse327M;

        if (!response327M.ok || payload327M.ok === false) {
          throw new Error(
            payload327M.error || "Could not load AI credit account.",
          );
        }

        setCredits327M(payload327M);

        const returnedPacks327M = Array.isArray(payload327M.packs)
          ? payload327M.packs
          : [];

        if (
          returnedPacks327M.length &&
          !returnedPacks327M.some(
            (item327M) => item327M.key === selectedPack327M,
          )
        ) {
          setSelectedPack327M(returnedPacks327M[0].key);
        }
      } catch (caught327M) {
        setError327M(
          caught327M instanceof Error
            ? caught327M.message
            : "Could not load AI credit account.",
        );
      } finally {
        setLoading327M(false);
        setRefreshing327M(false);
      }
    },
    [retailerId327M, selectedPack327M, session327M?.access_token],
  );

  useEffect(() => {
    let alive327M = true;

    async function start327M() {
      const sessionResult327M = await supabase.auth.getSession();
      if (!alive327M) return;

      const nextSession327M = sessionResult327M.data.session;
      setSession327M(nextSession327M);
      setAuthReady327M(true);

      if (!nextSession327M) {
        setLoading327M(false);
        return;
      }

      const contextResult327M = await supabase.rpc(
        "darik_direct_get_my_context",
      );

      if (!alive327M) return;

      if (contextResult327M.error) {
        setError327M(contextResult327M.error.message);
        setLoading327M(false);
        return;
      }

      const context327M = (contextResult327M.data ?? {}) as Context327M;
      const nextStores327M = Array.isArray(context327M.stores)
        ? context327M.stores
        : [];

      setStores327M(nextStores327M);
      setRetailerId327M(nextStores327M[0]?.retailer_id ?? "");
      setSenderName327M(
        String(
          nextSession327M.user.user_metadata?.full_name ??
            nextSession327M.user.user_metadata?.name ??
            "",
        ),
      );

      if (!nextStores327M.length) {
        setLoading327M(false);
      }
    }

    void start327M();

    const {
      data: { subscription: subscription327M },
    } = supabase.auth.onAuthStateChange((_event327M, nextSession327M) => {
      if (!alive327M) return;
      setSession327M(nextSession327M);
      setAuthReady327M(true);
      if (!nextSession327M) {
        setCredits327M(null);
        setStores327M([]);
        setRetailerId327M("");
        setLoading327M(false);
      }
    });

    return () => {
      alive327M = false;
      subscription327M.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session327M?.access_token && retailerId327M) {
      void loadCredits327M(false);
    }
  }, [loadCredits327M, retailerId327M, session327M?.access_token]);

  async function submitProof327M() {
    if (!session327M?.access_token || !retailerId327M || !pack327M) {
      setError327M("Retailer login is required.");
      return;
    }

    const name327M = senderName327M.trim();
    const phone327M = senderPhone327M.trim();

    if (!name327M) {
      setError327M("Enter the CliQ sender name / أدخل اسم مرسل CliQ.");
      return;
    }

    if (!phone327M) {
      setError327M("Enter the sender phone / أدخل رقم هاتف المرسل.");
      return;
    }

    if (!receipt327M) {
      setError327M("Choose a CliQ receipt image / اختر صورة إيصال CliQ.");
      return;
    }

    if (
      receipt327M.size <= 0 ||
      receipt327M.size > 6 * 1024 * 1024
    ) {
      setError327M("Receipt image must be smaller than 6 MB.");
      return;
    }

    const allowed327M = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

    if (receipt327M.type && !allowed327M.has(receipt327M.type)) {
      setError327M("Receipt must be JPG, PNG, or WEBP.");
      return;
    }

    setSubmitting327M(true);
    setError327M("");
    setSuccess327M("");

    try {
      const form327M = new FormData();
      form327M.append("retailer_id", retailerId327M);
      form327M.append("pack_key", pack327M.key);
      form327M.append("cliq_sender_name", name327M);
      form327M.append("cliq_sender_phone", phone327M);
      form327M.append(
        "cliq_reference_number",
        reference327M.trim(),
      );
      form327M.append("receipt", receipt327M);

      const response327M = await fetch(
        "/api/darik-direct/ai-credit-payment-proof",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session327M.access_token}`,
          },
          body: form327M,
        },
      );

      const payload327M = (await response327M
        .json()
        .catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!response327M.ok || payload327M.ok === false) {
        throw new Error(
          payload327M.error ||
            "Could not submit AI credit payment proof.",
        );
      }

      setSuccess327M(
        "Payment proof submitted. Darik will add the credits after Admin approval. / تم إرسال إثبات الدفع، وسيتم إضافة الرصيد بعد موافقة الإدارة.",
      );
      setReceipt327M(null);
      setReference327M("");
      if (receiptInput327M.current) {
        receiptInput327M.current.value = "";
      }
      await loadCredits327M(true);
    } catch (caught327M) {
      setError327M(
        caught327M instanceof Error
          ? caught327M.message
          : "Could not submit AI credit payment proof.",
      );
    } finally {
      setSubmitting327M(false);
    }
  }

  if (!authReady327M || loading327M) {
    return (
      <main className={styles.centerPage}>
        <div className={styles.spinner} />
        <h1>Opening AI Credits… / جار فتح رصيد الذكاء الاصطناعي…</h1>
      </main>
    );
  }

  if (!session327M) {
    return (
      <main className={styles.centerPage}>
        <section className={styles.emptyCard}>
          <h1>Retailer login required / يجب تسجيل الدخول</h1>
          <a href="/store-dashboard">Return to retailer dashboard</a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>Darik</span>
          <h1>Direct</h1>
        </div>

        <nav className={styles.nav}>
          <a href="/store-dashboard">Overview / نظرة عامة</a>
          <a href="/store-dashboard/storefront">
            Storefront / واجهة المتجر
          </a>
          <a href="/store-dashboard/orders">Orders / الطلبات</a>
          <a href="/store-dashboard/products">Products / المنتجات</a>
          <a href="/store-dashboard/categories">Categories / الفئات</a>
          <a href="/store-dashboard/activation">
            Plan &amp; payment / الخطة والدفع
          </a>
          <a className={styles.activeNav} href="/store-dashboard/ai-credits">
            AI Credits / رصيد الذكاء الاصطناعي
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>
            {session327M.user.user_metadata?.darik_retailer_username
              ? `@${session327M.user.user_metadata.darik_retailer_username}`
              : session327M.user.email}
          </span>
          <DashboardLogoutButton />
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p>AI PHOTO TOOLS / أدوات صور الذكاء الاصطناعي</p>
            <h1>AI Credits / رصيد الذكاء الاصطناعي</h1>
            <span>
              Buy credits on the Darik website, submit CliQ proof, and track
              Admin approval. / اشترِ الرصيد من موقع داريك وأرسل إثبات CliQ
              وتابع موافقة الإدارة.
            </span>
          </div>

          <div className={styles.topbarActions}>
            {stores327M.length > 1 ? (
              <select
                value={retailerId327M}
                onChange={(event327M) =>
                  setRetailerId327M(event327M.target.value)
                }
              >
                {stores327M.map((store327M) => (
                  <option
                    key={store327M.retailer_id}
                    value={store327M.retailer_id}
                  >
                    {store327M.business_name || "Darik store"}
                  </option>
                ))}
              </select>
            ) : (
              <strong>
                {selectedStore327M?.business_name || "Darik retailer"}
              </strong>
            )}

            <button
              type="button"
              className={styles.refreshButton}
              disabled={refreshing327M}
              onClick={() => void loadCredits327M(true)}
            >
              {refreshing327M
                ? "Refreshing…"
                : "Refresh / تحديث"}
            </button>
          </div>
        </header>

        {error327M ? (
          <div className={styles.error}>{error327M}</div>
        ) : null}

        {success327M ? (
          <div className={styles.success}>{success327M}</div>
        ) : null}

        <section className={styles.balanceGrid}>
          <article className={styles.balanceHero}>
            <span>CURRENT BALANCE / الرصيد الحالي</span>
            <strong>
              {Number(credits327M?.balance ?? 0).toLocaleString()}
            </strong>
            <p>
              AI credits available / رصيد AI متاح
            </p>
          </article>

          <article className={styles.statCard}>
            <span>Purchased / تم شراؤه</span>
            <strong>
              {Number(
                credits327M?.lifetime_purchased ?? 0,
              ).toLocaleString()}
            </strong>
          </article>

          <article className={styles.statCard}>
            <span>Used / مستخدم</span>
            <strong>
              {Number(
                credits327M?.lifetime_spent ?? 0,
              ).toLocaleString()}
            </strong>
          </article>

          <article className={styles.statCard}>
            <span>Per enhancement / لكل تحسين</span>
            <strong>
              {Number(credits327M?.enhancement_cost ?? 1)} credit
            </strong>
          </article>
        </section>

        {pendingRequest327M ? (
          <section className={styles.pendingNotice}>
            <div>
              <span>PAYMENT UNDER REVIEW / الدفعة قيد المراجعة</span>
              <strong>
                {Number(
                  pendingRequest327M.credits ?? 0,
                ).toLocaleString()}{" "}
                credits · {money327M(pendingRequest327M.price_jod)}
              </strong>
            </div>
            <p>
              Darik Admin has not approved this payment yet. If you submit
              another proof while it is pending, the pending request will be
              updated with the new proof. / لم تتم الموافقة على الدفعة بعد.
            </p>
          </section>
        ) : null}

        <section className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span>1. CHOOSE A CREDIT PACK</span>
              <h2>Buy AI Credits / شراء رصيد AI</h2>
            </div>
            <p>Credits do not expire while the account remains available.</p>
          </div>

          <div className={styles.packGrid}>
            {packs327M.map((item327M) => {
              const selected327M = item327M.key === pack327M.key;
              return (
                <button
                  type="button"
                  key={item327M.key}
                  className={`${styles.packCard} ${
                    selected327M ? styles.packSelected : ""
                  }`}
                  onClick={() => setSelectedPack327M(item327M.key)}
                >
                  <span>
                    {item327M.credits.toLocaleString()} credits
                  </span>
                  <strong>{money327M(item327M.price_jod)}</strong>
                  <small>
                    {selected327M
                      ? "Selected / تم الاختيار"
                      : "Choose pack / اختر الباقة"}
                  </small>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.paymentGrid}>
          <article className={`${styles.panel} ${styles.cliqPanel}`}>
            <div className={styles.sectionHeading}>
              <div>
                <span>2. PAY BY CLIQ</span>
                <h2>CliQ payment details / معلومات الدفع عبر CliQ</h2>
              </div>
            </div>

            <div className={styles.payAmount}>
              <span>Send exactly / حوّل بالضبط</span>
              <strong>{money327M(pack327M.price_jod)}</strong>
            </div>

            <dl className={styles.paymentDetails}>
              <div>
                <dt>Account name / اسم الحساب</dt>
                <dd>{credits327M?.payment?.name || "DARIK"}</dd>
              </div>
              <div>
                <dt>CliQ alias / معرّف CliQ</dt>
                <dd>
                  {credits327M?.payment?.alias ||
                    "Contact Darik Support"}
                </dd>
              </div>
              <div>
                <dt>Credit pack / باقة الرصيد</dt>
                <dd>
                  {pack327M.credits.toLocaleString()} credits
                </dd>
              </div>
            </dl>

            <p className={styles.paymentHint}>
              Make the CliQ payment first, then upload the receipt in the
              form. Credits are added only after Darik Admin verifies the
              payment. / ادفع عبر CliQ أولاً ثم ارفع الإيصال، ويُضاف الرصيد
              بعد التحقق والموافقة.
            </p>
          </article>

          <article className={styles.panel}>
            <div className={styles.sectionHeading}>
              <div>
                <span>3. SUBMIT PAYMENT PROOF</span>
                <h2>Payment proof / إثبات الدفع</h2>
              </div>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>Sender name / اسم المرسل</span>
                <input
                  value={senderName327M}
                  onChange={(event327M) =>
                    setSenderName327M(event327M.target.value)
                  }
                  placeholder="Name shown on CliQ"
                />
              </label>

              <label>
                <span>Sender phone / رقم هاتف المرسل</span>
                <input
                  value={senderPhone327M}
                  onChange={(event327M) =>
                    setSenderPhone327M(event327M.target.value)
                  }
                  placeholder="07XXXXXXXX"
                  inputMode="tel"
                />
              </label>

              <label className={styles.fullField}>
                <span>
                  CliQ reference / مرجع CliQ{" "}
                  <small>Optional / اختياري</small>
                </span>
                <input
                  value={reference327M}
                  onChange={(event327M) =>
                    setReference327M(event327M.target.value)
                  }
                  placeholder="Transaction reference"
                />
              </label>

              <label className={styles.fullField}>
                <span>CliQ receipt / إيصال CliQ</span>
                <input
                  ref={receiptInput327M}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event327M) =>
                    setReceipt327M(
                      event327M.target.files?.[0] ?? null,
                    )
                  }
                />
                <small>
                  JPG, PNG or WEBP · maximum 6 MB
                </small>
              </label>
            </div>

            {receipt327M ? (
              <div className={styles.receiptReady}>
                <span>Receipt selected / تم اختيار الإيصال</span>
                <strong>{receipt327M.name}</strong>
              </div>
            ) : null}

            <button
              type="button"
              className={styles.submitButton}
              disabled={submitting327M}
              onClick={() => void submitProof327M()}
            >
              {submitting327M
                ? "Submitting… / جار الإرسال…"
                : `Submit ${pack327M.credits.toLocaleString()} credit payment proof / إرسال إثبات الدفع`}
            </button>
          </article>
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span>PAYMENT HISTORY</span>
              <h2>AI credit requests / طلبات رصيد AI</h2>
            </div>
            <p>Latest 20 requests / آخر 20 طلب</p>
          </div>

          {requests327M.length ? (
            <div className={styles.historyList}>
              {requests327M.map((request327M) => {
                const status327M = requestStatus327M(
                  request327M.status,
                );

                return (
                  <article
                    className={styles.historyRow}
                    key={request327M.id}
                  >
                    <div>
                      <strong>
                        {Number(
                          request327M.credits ?? 0,
                        ).toLocaleString()}{" "}
                        credits
                      </strong>
                      <span>
                        {money327M(request327M.price_jod)} ·{" "}
                        {date327M(
                          request327M.proof_submitted_at ||
                            request327M.created_at,
                        )}
                      </span>
                      {request327M.admin_note ? (
                        <p>
                          Admin note / ملاحظة الإدارة:{" "}
                          {request327M.admin_note}
                        </p>
                      ) : null}
                    </div>

                    <span
                      className={`${styles.statusBadge} ${status327M.className}`}
                    >
                      {status327M.label}
                    </span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyHistory}>
              No AI credit purchases yet / لا توجد طلبات رصيد AI حتى الآن
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
