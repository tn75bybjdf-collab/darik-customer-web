"use client";

/* DARIK_CUSTOMER_SIGNIN_GLOBAL_AND_STORE_SCOPED_HISTORY_339 */
/* DARIK_CUSTOMER_CLICKABLE_ORDER_DETAILS_340 */

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./darikCustomerAccountHub339.module.css";

type DarikAccountScope339 = "all" | "store";
type DarikAccountView339 = "signin" | "menu" | "orders" | "order-details" | "details" | "password";
type DarikLanguage339 = "en" | "ar";

type DarikCustomerProfile339 = {
  id: string;
  auth_user_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type DarikCustomerOrderItem340 = {
  id: string;
  product_id?: string | null;
  product_name?: string | null;
  quantity?: number | string | null;
  app_price?: number | string | null;
  line_total?: number | string | null;
};

type DarikCustomerOrder339 = {
  id: string;
  order_number?: string | number | null;
  order_status?: string | null;
  total?: number | string | null;
  subtotal?: number | string | null;
  delivery_fee?: number | string | null;
  created_at?: string | null;
  storefront_retailer_id?: string | null;
  storefront_name_snapshot?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  direct_fulfillment_method?: string | null;
  delivery_address_details?: string | null;
  delivery_note?: string | null;
  direct_building_number?: string | null;
  direct_apartment_number?: string | null;
  items?: DarikCustomerOrderItem340[];
};

type DarikCustomerAccountHub339Props = {
  scope: DarikAccountScope339;
  retailerId?: string | null;
};

const LANGUAGE_KEY_339 = "darik_marketplace_language_v1";

const copy339 = {
  en: {
    signIn: "Customer sign in",
    signInTitle: "Sign in to Darik",
    signInBody: "Use the same customer account across GetDarik.com and every Darik store.",
    email: "Email",
    password: "Password",
    signingIn: "Signing in...",
    noAccount: "No customer account was found for this login.",
    createNote: "New customer? You can create your Darik account during checkout.",
    account: "Account",
    hello: "Hello",
    orderHistory: "Order history",
    allOrders: "All Darik orders",
    thisStoreOnly: "This store only",
    accountDetails: "Account details",
    accountDetailsSub: "Name, email and phone",
    changePassword: "Change password",
    changePasswordSub: "Update your Darik password",
    signOut: "Sign out",
    signOutSub: "Sign out on this browser/device",
    allOrdersTitle: "All Darik orders",
    storeOrdersTitle: "Orders from this store",
    allOrdersSubtitle: "Every order attached to your Darik customer account.",
    storeOrdersSubtitle: "Only orders placed with this retailer are shown here.",
    noAllOrders: "No past Darik orders yet.",
    noStoreOrders: "No past orders from this store yet.",
    loadingOrders: "Loading orders...",
    viewOrder: "View order",
    loadingOrder: "Loading order details...",
    orderDetailsTitle: "Order details",
    orderDetailsSubtitle: "Everything recorded for this Darik order.",
    backOrders: "← Order history",
    store: "Store",
    orderNumber: "Order",
    status: "Status",
    placed: "Placed",
    products: "Products",
    quantity: "Qty",
    each: "each",
    subtotal: "Products subtotal",
    deliveryFee: "Delivery fee",
    totalLabel: "Order total",
    payment: "Payment",
    paymentStatus: "Payment status",
    fulfillment: "Fulfillment",
    delivery: "Delivery",
    pickup: "Store pickup",
    deliveryAddress: "Delivery address",
    building: "Building",
    apartment: "Apartment",
    deliveryNote: "Delivery note",
    noItems: "No product lines were returned for this order.",
    orderDetailsUnavailable: "Order details could not be loaded.",
    backAccount: "← Account",
    detailsTitle: "Account details",
    detailsBody: "Your Darik customer information.",
    name: "Name",
    phone: "Phone",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    savePassword: "Change password",
    savingPassword: "Changing...",
    passwordChanged: "Password changed successfully.",
    passwordRule: "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
    passwordsMismatch: "Passwords do not match.",
    storeUnknown: "This store could not be identified yet.",
    close: "Close",
  },
  ar: {
    signIn: "تسجيل دخول العميل",
    signInTitle: "تسجيل الدخول إلى داريك",
    signInBody: "استخدم نفس حساب العميل على GetDarik.com وعلى جميع متاجر داريك.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signingIn: "جاري تسجيل الدخول...",
    noAccount: "لم يتم العثور على حساب عميل مرتبط ببيانات الدخول هذه.",
    createNote: "عميل جديد؟ تقدر تنشئ حساب داريك أثناء إتمام الطلب.",
    account: "الحساب",
    hello: "مرحباً",
    orderHistory: "سجل الطلبات",
    allOrders: "كل طلبات داريك",
    thisStoreOnly: "هذا المتجر فقط",
    accountDetails: "بيانات الحساب",
    accountDetailsSub: "الاسم والبريد ورقم الهاتف",
    changePassword: "تغيير كلمة المرور",
    changePasswordSub: "تحديث كلمة مرور داريك",
    signOut: "تسجيل الخروج",
    signOutSub: "تسجيل الخروج من هذا المتصفح",
    allOrdersTitle: "كل طلبات داريك",
    storeOrdersTitle: "طلبات هذا المتجر",
    allOrdersSubtitle: "كل الطلبات المرتبطة بحساب العميل الخاص بك على داريك.",
    storeOrdersSubtitle: "يظهر هنا فقط ما طلبته من هذا المتجر.",
    noAllOrders: "لا يوجد لديك طلبات سابقة على داريك.",
    noStoreOrders: "لا يوجد لديك طلبات سابقة من هذا المتجر.",
    loadingOrders: "جاري تحميل الطلبات...",
    viewOrder: "عرض الطلب",
    loadingOrder: "جاري تحميل تفاصيل الطلب...",
    orderDetailsTitle: "تفاصيل الطلب",
    orderDetailsSubtitle: "كل التفاصيل المسجلة لهذا الطلب على داريك.",
    backOrders: "سجل الطلبات →",
    store: "المتجر",
    orderNumber: "الطلب",
    status: "الحالة",
    placed: "تاريخ الطلب",
    products: "المنتجات",
    quantity: "الكمية",
    each: "للوحدة",
    subtotal: "مجموع المنتجات",
    deliveryFee: "رسوم التوصيل",
    totalLabel: "إجمالي الطلب",
    payment: "الدفع",
    paymentStatus: "حالة الدفع",
    fulfillment: "طريقة الاستلام",
    delivery: "توصيل",
    pickup: "استلام من المتجر",
    deliveryAddress: "عنوان التوصيل",
    building: "المبنى",
    apartment: "الشقة",
    deliveryNote: "ملاحظات التوصيل",
    noItems: "لم يتم إرجاع تفاصيل المنتجات لهذا الطلب.",
    orderDetailsUnavailable: "تعذر تحميل تفاصيل الطلب.",
    backAccount: "الحساب →",
    detailsTitle: "بيانات الحساب",
    detailsBody: "معلومات حساب العميل على داريك.",
    name: "الاسم",
    phone: "رقم الهاتف",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    savePassword: "تغيير كلمة المرور",
    savingPassword: "جاري التغيير...",
    passwordChanged: "تم تغيير كلمة المرور بنجاح.",
    passwordRule: "يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص.",
    passwordsMismatch: "كلمتا المرور غير متطابقتين.",
    storeUnknown: "تعذر تحديد هذا المتجر حالياً.",
    close: "إغلاق",
  },
} as const;

function strongPassword339(value: string) {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

function orderStatusLabel339(status: string | null | undefined) {
  return String(status || "order")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}


function paymentLabel340(value: string | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "cliq") return "CliQ";
  if (normalized === "cash") return "Cash / نقدي";
  return normalized ? normalized.replaceAll("_", " ") : "—";
}

function money340(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

export default function DarikCustomerAccountHub339({
  scope,
  retailerId = null,
}: DarikCustomerAccountHub339Props) {
  const [language, setLanguage] = useState<DarikLanguage339>("en");
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DarikCustomerProfile339 | null>(null);
  const [ready, setReady] = useState(false);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<DarikAccountView339>("signin");
  const [orders, setOrders] = useState<DarikCustomerOrder339[]>([]);
  const [ordersBusy, setOrdersBusy] = useState(false);
  const [selectedOrder340, setSelectedOrder340] =
    useState<DarikCustomerOrder339 | null>(null);
  const [orderDetailBusy340, setOrderDetailBusy340] = useState(false);
  const [message, setMessage] = useState("");

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  const t = copy339[language];

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_KEY_339);
    if (saved === "en" || saved === "ar") {
      setLanguage(saved);
    } else if (navigator.language.toLowerCase().startsWith("ar")) {
      setLanguage("ar");
    }

    const onStorage = (event: StorageEvent) => {
      if (
        event.key === LANGUAGE_KEY_339 &&
        (event.newValue === "en" || event.newValue === "ar")
      ) {
        setLanguage(event.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  async function readCustomerProfile339(nextSession: Session | null) {
    setSession(nextSession);

    if (!nextSession?.user?.id) {
      setProfile(null);
      setView("signin");
      setReady(true);
      return null;
    }

    const result = await supabase
      .from("customers")
      .select("id,auth_user_id,full_name,email,phone")
      .eq("auth_user_id", nextSession.user.id)
      .maybeSingle();

    if (result.error || !result.data) {
      setProfile(null);
      setView("signin");
      setReady(true);
      return null;
    }

    const nextProfile = result.data as DarikCustomerProfile339;
    setProfile(nextProfile);
    setView("menu");
    setReady(true);
    return nextProfile;
  }

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const current = await supabase.auth.getSession();
      if (cancelled) return;
      await readCustomerProfile339(current.data.session);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return;
      void readCustomerProfile339(nextSession);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const firstName = useMemo(() => {
    const raw =
      profile?.full_name?.trim() ||
      String(session?.user?.user_metadata?.full_name || "").trim() ||
      String(profile?.email || session?.user?.email || "").trim();

    if (!raw) return language === "ar" ? "عميل" : "Customer";

    const beforeAt = raw.includes("@") ? raw.split("@")[0] : raw;
    return beforeAt.split(/\s+/)[0] || (language === "ar" ? "عميل" : "Customer");
  }, [language, profile, session]);

  async function signInCustomer339() {
    setMessage("");

    const email = authEmail.trim().toLowerCase();
    if (!email || !authPassword) {
      setMessage(language === "ar" ? "أدخل البريد الإلكتروني وكلمة المرور." : "Enter your email and password.");
      return;
    }

    setAuthBusy(true);

    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password: authPassword,
      });

      if (result.error || !result.data.session) {
        setMessage(result.error?.message || t.noAccount);
        return;
      }

      const customerResult = await supabase
        .from("customers")
        .select("id,auth_user_id,full_name,email,phone")
        .eq("auth_user_id", result.data.session.user.id)
        .maybeSingle();

      if (customerResult.error || !customerResult.data) {
        setMessage(t.noAccount);
        return;
      }

      setSession(result.data.session);
      setProfile(customerResult.data as DarikCustomerProfile339);
      setAuthPassword("");
      setView("menu");
      setOpen(true);
    } finally {
      setAuthBusy(false);
    }
  }

  async function loadOrders339() {
    if (!profile?.id) return;

    if (scope === "store" && !retailerId) {
      setOrders([]);
      setView("orders");
      setMessage(t.storeUnknown);
      return;
    }

    setOrdersBusy(true);
    setMessage("");

    try {
      const pageSize339 = 500;
      let from339 = 0;
      const allOrders339: DarikCustomerOrder339[] = [];

      while (true) {
        let query = supabase
          .from("orders")
          .select(
            "id,order_number,order_status,total,created_at,storefront_retailer_id,storefront_name_snapshot"
          )
          .eq("customer_id", profile.id)
          .order("created_at", { ascending: false })
          .range(from339, from339 + pageSize339 - 1);

        if (scope === "store" && retailerId) {
          query = query.eq("storefront_retailer_id", retailerId);
        }

        const result = await query;

        if (result.error) {
          setMessage(result.error.message);
          return;
        }

        const page339 = (result.data ?? []) as DarikCustomerOrder339[];
        allOrders339.push(...page339);

        if (page339.length < pageSize339) {
          break;
        }

        from339 += pageSize339;
      }

      setOrders(allOrders339);
      setView("orders");
    } finally {
      setOrdersBusy(false);
    }
  }

  async function openOrderDetails340(order: DarikCustomerOrder339) {
    if (!profile?.id) return;

    setOrderDetailBusy340(true);
    setSelectedOrder340({
      ...order,
      items: [],
    });
    setView("order-details");
    setMessage("");

    try {
      const orderResult = await supabase
        .from("orders")
        .select(
          "id,order_number,order_status,total,subtotal,delivery_fee,created_at,storefront_retailer_id,storefront_name_snapshot,customer_name,customer_phone,payment_method,payment_status,direct_fulfillment_method,delivery_address_details,delivery_note,direct_building_number,direct_apartment_number"
        )
        .eq("id", order.id)
        .eq("customer_id", profile.id)
        .maybeSingle();

      if (orderResult.error || !orderResult.data) {
        setMessage(orderResult.error?.message || t.orderDetailsUnavailable);
        return;
      }

      const itemResult = await supabase
        .from("order_items")
        .select("id,product_id,product_name,quantity,app_price,line_total")
        .eq("order_id", order.id)
        .order("id", { ascending: true });

      if (itemResult.error) {
        setMessage(itemResult.error.message);
        return;
      }

      setSelectedOrder340({
        ...(orderResult.data as DarikCustomerOrder339),
        items: (itemResult.data ?? []) as DarikCustomerOrderItem340[],
      });
    } finally {
      setOrderDetailBusy340(false);
    }
  }

  async function signOut339() {
    setMessage("");

    const result = await supabase.auth.signOut();
    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setProfile(null);
    setSession(null);
    setOrders([]);
    setSelectedOrder340(null);
    setView("signin");
    setOpen(false);
    setAuthPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function changePassword339() {
    setMessage("");

    if (!profile?.id || !session?.user?.id) {
      setMessage(language === "ar" ? "سجل الدخول أولاً." : "Sign in first.");
      return;
    }

    if (!strongPassword339(newPassword)) {
      setMessage(t.passwordRule);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(t.passwordsMismatch);
      return;
    }

    setPasswordBusy(true);

    try {
      const result = await supabase.auth.updateUser({ password: newPassword });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setMessage(t.passwordChanged);
    } finally {
      setPasswordBusy(false);
    }
  }

  function openHub339() {
    setMessage("");
    setView(profile ? "menu" : "signin");
    setOpen((current) => !current);
  }

  if (!ready) return null;

  const ordersTitle =
    scope === "store" ? t.storeOrdersTitle : t.allOrdersTitle;

  const ordersSubtitle =
    scope === "store" ? t.storeOrdersSubtitle : t.allOrdersSubtitle;

  return (
    <div
      className={styles.darikAccountHub339}
      data-darik-customer-account-hub339={scope}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {profile ? (
        <div className={styles.darikHello339}>
          <span>{t.hello}</span>
          <strong>{firstName}</strong>
        </div>
      ) : null}

      <button
        type="button"
        className={
          profile
            ? styles.darikAccountIcon339
            : styles.darikCustomerSignIn339
        }
        aria-label={profile ? t.account : t.signIn}
        aria-expanded={open}
        onClick={openHub339}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {!profile ? <span>{t.signIn}</span> : null}
      </button>

      {open ? (
        <div
          className={styles.darikAccountPopover339}
          role="dialog"
          aria-label={profile ? t.account : t.signIn}
        >
          <div className={styles.darikAccountHeader339}>
            <div>
              <small>DARIK ACCOUNT</small>
              <strong>{profile ? `${t.hello} ${firstName}` : t.signInTitle}</strong>
            </div>
            <button
              type="button"
              aria-label={t.close}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          {view === "signin" && !profile ? (
            <div className={styles.darikSignInView339}>
              <p>{t.signInBody}</p>

              <label>
                <span>{t.email}</span>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  autoComplete="email"
                />
              </label>

              <label>
                <span>{t.password}</span>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  autoComplete="current-password"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !authBusy) {
                      void signInCustomer339();
                    }
                  }}
                />
              </label>

              <button
                type="button"
                className={styles.darikSignInSubmit339}
                disabled={authBusy}
                onClick={() => void signInCustomer339()}
              >
                {authBusy ? t.signingIn : t.signIn}
              </button>

              <small className={styles.darikCreateNote339}>{t.createNote}</small>
            </div>
          ) : null}

          {view === "menu" && profile ? (
            <div className={styles.darikAccountMenu339}>
              <button
                type="button"
                disabled={ordersBusy}
                onClick={() => void loadOrders339()}
              >
                <span>↺</span>
                <div>
                  <strong>{t.orderHistory}</strong>
                  <small>{scope === "store" ? t.thisStoreOnly : t.allOrders}</small>
                </div>
              </button>

              <button type="button" onClick={() => setView("details")}>
                <span>◎</span>
                <div>
                  <strong>{t.accountDetails}</strong>
                  <small>{t.accountDetailsSub}</small>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setView("password");
                }}
              >
                <span>⌁</span>
                <div>
                  <strong>{t.changePassword}</strong>
                  <small>{t.changePasswordSub}</small>
                </div>
              </button>

              <button
                type="button"
                className={styles.darikSignOut339}
                onClick={() => void signOut339()}
              >
                <span>↗</span>
                <div>
                  <strong>{t.signOut}</strong>
                  <small>{t.signOutSub}</small>
                </div>
              </button>
            </div>
          ) : null}

          {view === "orders" && profile ? (
            <div className={styles.darikAccountView339}>
              <button
                type="button"
                className={styles.darikBack339}
                onClick={() => {
                  setMessage("");
                  setView("menu");
                }}
              >
                {t.backAccount}
              </button>

              <div className={styles.darikViewHeading339}>
                <h4>{ordersTitle}</h4>
                <p>{ordersSubtitle}</p>
              </div>

              {ordersBusy ? (
                <p className={styles.darikMuted339}>{t.loadingOrders}</p>
              ) : orders.length === 0 ? (
                <p className={styles.darikMuted339}>
                  {scope === "store" ? t.noStoreOrders : t.noAllOrders}
                </p>
              ) : (
                <div className={styles.darikOrderList339}>
                  {orders.map((order) => (
                    <button
                      type="button"
                      className={styles.darikOrderCard340}
                      key={order.id}
                      onClick={() => void openOrderDetails340(order)}
                    >
                      <div>
                        <span>
                          #{String(order.order_number ?? order.id.slice(0, 8))}
                        </span>
                        <strong>{orderStatusLabel339(order.order_status)}</strong>
                      </div>

                      {scope === "all" && order.storefront_name_snapshot ? (
                        <small className={styles.darikStoreName339}>
                          {order.storefront_name_snapshot}
                        </small>
                      ) : null}

                      <div className={styles.darikOrderCardBottom340}>
                        <small>
                          {Number(order.total ?? 0).toFixed(2)} JOD
                          {order.created_at
                            ? ` · ${new Date(order.created_at).toLocaleDateString(
                                language === "ar" ? "ar-JO" : "en-JO"
                              )}`
                            : ""}
                        </small>
                        <b>{t.viewOrder} →</b>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {view === "order-details" && profile ? (
            <div className={styles.darikAccountView339}>
              <button
                type="button"
                className={styles.darikBack339}
                onClick={() => {
                  setMessage("");
                  setView("orders");
                }}
              >
                {t.backOrders}
              </button>

              <div className={styles.darikViewHeading339}>
                <h4>{t.orderDetailsTitle}</h4>
                <p>{t.orderDetailsSubtitle}</p>
              </div>

              {orderDetailBusy340 ? (
                <p className={styles.darikMuted339}>{t.loadingOrder}</p>
              ) : selectedOrder340 ? (
                <div className={styles.darikOrderDetails340}>
                  <section className={styles.darikOrderHero340}>
                    <div>
                      <small>{t.orderNumber}</small>
                      <strong>
                        #
                        {String(
                          selectedOrder340.order_number ??
                            selectedOrder340.id.slice(0, 8)
                        )}
                      </strong>
                    </div>
                    <span>{orderStatusLabel339(selectedOrder340.order_status)}</span>
                  </section>

                  <div className={styles.darikOrderMetaGrid340}>
                    {selectedOrder340.storefront_name_snapshot ? (
                      <label>
                        <span>{t.store}</span>
                        <strong>{selectedOrder340.storefront_name_snapshot}</strong>
                      </label>
                    ) : null}

                    <label>
                      <span>{t.placed}</span>
                      <strong>
                        {selectedOrder340.created_at
                          ? new Date(selectedOrder340.created_at).toLocaleString(
                              language === "ar" ? "ar-JO" : "en-JO"
                            )
                          : "—"}
                      </strong>
                    </label>

                    <label>
                      <span>{t.payment}</span>
                      <strong>
                        {paymentLabel340(selectedOrder340.payment_method)}
                      </strong>
                    </label>

                    <label>
                      <span>{t.paymentStatus}</span>
                      <strong>
                        {orderStatusLabel339(selectedOrder340.payment_status)}
                      </strong>
                    </label>

                    <label>
                      <span>{t.fulfillment}</span>
                      <strong>
                        {String(
                          selectedOrder340.direct_fulfillment_method ?? "delivery"
                        ).toLowerCase() === "pickup"
                          ? t.pickup
                          : t.delivery}
                      </strong>
                    </label>
                  </div>

                  <section className={styles.darikOrderProducts340}>
                    <div className={styles.darikOrderSectionHead340}>
                      <strong>{t.products}</strong>
                      <span>{selectedOrder340.items?.length ?? 0}</span>
                    </div>

                    {(selectedOrder340.items ?? []).length > 0 ? (
                      <div className={styles.darikOrderItems340}>
                        {(selectedOrder340.items ?? []).map((item) => (
                          <article key={item.id}>
                            <div>
                              <strong>{item.product_name || "Product"}</strong>
                              <small>
                                {t.quantity}: {Number(item.quantity ?? 0)}
                                {item.app_price != null
                                  ? ` · ${money340(item.app_price)} ${t.each}`
                                  : ""}
                              </small>
                            </div>
                            <b>{money340(item.line_total)}</b>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.darikMuted339}>{t.noItems}</p>
                    )}
                  </section>

                  <section className={styles.darikOrderTotals340}>
                    <div>
                      <span>{t.subtotal}</span>
                      <strong>{money340(selectedOrder340.subtotal)}</strong>
                    </div>
                    <div>
                      <span>{t.deliveryFee}</span>
                      <strong>{money340(selectedOrder340.delivery_fee)}</strong>
                    </div>
                    <div className={styles.darikOrderGrandTotal340}>
                      <span>{t.totalLabel}</span>
                      <strong>{money340(selectedOrder340.total)}</strong>
                    </div>
                  </section>

                  {String(
                    selectedOrder340.direct_fulfillment_method ?? "delivery"
                  ).toLowerCase() !== "pickup" ? (
                    <section className={styles.darikOrderDelivery340}>
                      <strong>{t.deliveryAddress}</strong>

                      {selectedOrder340.delivery_address_details ? (
                        <p>{selectedOrder340.delivery_address_details}</p>
                      ) : null}

                      <div>
                        <span>
                          {t.building}:{" "}
                          <b>{selectedOrder340.direct_building_number || "—"}</b>
                        </span>
                        <span>
                          {t.apartment}:{" "}
                          <b>{selectedOrder340.direct_apartment_number || "—"}</b>
                        </span>
                      </div>

                      {selectedOrder340.delivery_note ? (
                        <small>
                          {t.deliveryNote}: {selectedOrder340.delivery_note}
                        </small>
                      ) : null}
                    </section>
                  ) : null}
                </div>
              ) : (
                <p className={styles.darikMuted339}>
                  {t.orderDetailsUnavailable}
                </p>
              )}
            </div>
          ) : null}

          {view === "details" && profile ? (
            <div className={styles.darikAccountView339}>
              <button
                type="button"
                className={styles.darikBack339}
                onClick={() => {
                  setMessage("");
                  setView("menu");
                }}
              >
                {t.backAccount}
              </button>

              <div className={styles.darikViewHeading339}>
                <h4>{t.detailsTitle}</h4>
                <p>{t.detailsBody}</p>
              </div>

              <div className={styles.darikDetails339}>
                <label>
                  <span>{t.name}</span>
                  <strong>{profile.full_name || "—"}</strong>
                </label>
                <label>
                  <span>{t.email}</span>
                  <strong>{profile.email || session?.user?.email || "—"}</strong>
                </label>
                <label>
                  <span>{t.phone}</span>
                  <strong>{profile.phone || "—"}</strong>
                </label>
              </div>
            </div>
          ) : null}

          {view === "password" && profile ? (
            <div className={styles.darikAccountView339}>
              <button
                type="button"
                className={styles.darikBack339}
                onClick={() => {
                  setMessage("");
                  setView("menu");
                }}
              >
                {t.backAccount}
              </button>

              <div className={styles.darikViewHeading339}>
                <h4>{t.changePassword}</h4>
                <p>{t.changePasswordSub}</p>
              </div>

              <label className={styles.darikPasswordField339}>
                <span>{t.newPassword}</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </label>

              <label className={styles.darikPasswordField339}>
                <span>{t.confirmPassword}</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </label>

              <button
                type="button"
                className={styles.darikPasswordSave339}
                disabled={passwordBusy}
                onClick={() => void changePassword339()}
              >
                {passwordBusy ? t.savingPassword : t.savePassword}
              </button>
            </div>
          ) : null}

          {message ? (
            <p className={styles.darikMessage339} role="status">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
