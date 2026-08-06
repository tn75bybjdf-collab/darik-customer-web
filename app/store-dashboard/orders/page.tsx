"use client";
// DARIK_UTF8_CLEAN_REBUILD_029_V4

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "../dashboard.module.css";

type StoreContext = {
  retailer_id: string;
  business_name: string;
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

type DirectOrder = {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address_details: string | null;
  delivery_note: string | null;
  delivery_latitude: number | string | null;
  delivery_longitude: number | string | null;
  direct_building_number: string | null;
  direct_apartment_number: string | null;
  payment_method: string;
  payment_status: string;
  direct_cliq_receipt_path: string | null;
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  order_status: string;
  created_at: string;
};

const statusOptions = [
  "accepted",
  "preparing",
  "ready_for_driver",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusLabels: Record<string, string> = {
  accepted: "Accepted / مقبول",
  preparing: "Preparing / قيد التجهيز",
  ready_for_driver: "Ready for driver / جاهز للسائق",
  out_for_delivery: "Out for delivery / في الطريق",
  delivered: "Delivered / تم التوصيل",
  cancelled: "Cancelled / ملغي",
  pending: "Pending / قيد الانتظار",
};

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function titleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function labelStatus(value: string) {
  return statusLabels[value] ?? titleCase(value);
}

function paymentLabel(value: string) {
  const normalized = value?.toLowerCase();
  if (normalized === "cliq") return "CliQ / كليك";
  if (normalized === "cash" || normalized === "cash_on_delivery") {
    return "Cash on delivery / الدفع عند الاستلام";
  }
  return titleCase(value || "Not set");
}

function paymentStatusLabel(value: string) {
  const normalized = value?.toLowerCase();
  if (["paid", "paid_by_cliq", "paid_cliq"].includes(normalized)) {
    return "Confirmed / مؤكد";
  }
  if (["pending", "awaiting_confirmation", "submitted"].includes(normalized)) {
    return "Awaiting confirmation / بانتظار التأكيد";
  }
  return titleCase(value || "Pending");
}

function formatPlacedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-JO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isToday(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function DarikDirectOrdersPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [orders, setOrders] = useState<DirectOrder[]>([]);
  const [receiptUrls, setReceiptUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [confirmingPaymentOrderId, setConfirmingPaymentOrderId] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const selectedStore = useMemo(
    () =>
      context?.stores.find(
        (store) => store.retailer_id === selectedRetailerId,
      ) ?? null,
    [context, selectedRetailerId],
  );

  const storeIsLive = Boolean(
    selectedStore?.direct_storefront_enabled &&
      selectedStore?.storefront_status === "published",
  );

  const loadContext = useCallback(async () => {
    const result = await supabase.rpc("darik_direct_get_my_context");

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    const nextContext = result.data as ContextResult;
    const stores = Array.isArray(nextContext?.stores)
      ? nextContext.stores
      : [];

    setContext({ ...nextContext, stores });
    setSelectedRetailerId((current) =>
      current && stores.some((store) => store.retailer_id === current)
        ? current
        : (stores[0]?.retailer_id ?? ""),
    );
  }, []);

  const loadOrders = useCallback(async () => {
    if (!selectedRetailerId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const result = await supabase
      .from("orders")
      .select(
        "id,order_number,customer_name,customer_phone,delivery_address_details,delivery_note,delivery_latitude,delivery_longitude,direct_building_number,direct_apartment_number,payment_method,payment_status,direct_cliq_receipt_path,subtotal,delivery_fee,total,order_status,created_at",
      )
      .eq("sales_channel", "direct_storefront")
      .eq("storefront_retailer_id", selectedRetailerId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (result.error) {
      setError(result.error.message);
      setReceiptUrls({});
    } else {
      const nextOrders = (result.data ?? []) as unknown as DirectOrder[];
      setOrders(nextOrders);

      const signedReceipts = await Promise.all(
        nextOrders
          .filter((order) => Boolean(order.direct_cliq_receipt_path))
          .map(async (order) => {
            const signed = await supabase.storage
              .from("darik-direct-cliq-receipts")
              .createSignedUrl(order.direct_cliq_receipt_path as string, 3600);

            return [order.id, signed.data?.signedUrl ?? ""] as const;
          }),
      );

      setReceiptUrls(
        Object.fromEntries(
          signedReceipts.filter(([, url]) => Boolean(url)),
        ),
      );
      setLastUpdatedAt(new Date());
    }

    setLoading(false);
  }, [selectedRetailerId]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
      if (!data.session) router.replace("/store-dashboard");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
      if (event === "SIGNED_OUT" || !nextSession) {
        router.replace("/store-dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (session?.user.id) loadContext();
  }, [session?.user.id, loadContext]);

  useEffect(() => {
    if (selectedRetailerId) loadOrders();
  }, [selectedRetailerId, loadOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (
        statusFilter === "open" &&
        ["delivered", "cancelled"].includes(order.order_status)
      ) {
        return false;
      }

      if (
        statusFilter !== "all" &&
        statusFilter !== "open" &&
        order.order_status !== statusFilter
      ) {
        return false;
      }

      if (!term) return true;

      return [
        order.order_number,
        order.customer_name,
        order.customer_phone,
        order.delivery_address_details,
        order.direct_building_number,
        order.direct_apartment_number,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [orders, search, statusFilter]);

  const metrics = useMemo(() => {
    const nonCancelled = orders.filter(
      (order) => order.order_status !== "cancelled",
    );

    return {
      today: orders.filter((order) => isToday(order.created_at)).length,
      open: orders.filter(
        (order) => !["delivered", "cancelled"].includes(order.order_status),
      ).length,
      delivered: orders.filter(
        (order) => order.order_status === "delivered",
      ).length,
      value: nonCancelled.reduce(
        (sum, order) => sum + Number(order.total ?? 0),
        0,
      ),
    };
  }, [orders]);

  function statusTone(status: string) {
    if (status === "delivered") return styles.orderStatusDelivered;
    if (status === "cancelled") return styles.orderStatusCancelled;
    if (status === "out_for_delivery") return styles.orderStatusDelivery;
    if (status === "ready_for_driver") return styles.orderStatusReady;
    if (status === "preparing") return styles.orderStatusPreparing;
    return styles.orderStatusAccepted;
  }

  async function updateStatus(order: DirectOrder, nextStatus: string) {
    setUpdatingOrderId(order.id);
    setError("");
    setMessage("");

    const result = await supabase.rpc(
      "darik_direct_retailer_update_order_status",
      {
        p_order_id: order.id,
        p_new_status: nextStatus,
        p_status_note: null,
      },
    );

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage(
        `Order ${order.order_number || order.id.slice(0, 8)} updated successfully / تم تحديث الطلب بنجاح.`,
      );
      await loadOrders();
    }

    setUpdatingOrderId(null);
  }

  async function confirmCliqPayment(order: DirectOrder) {
    setConfirmingPaymentOrderId(order.id);
    setError("");
    setMessage("");

    const result = await supabase.rpc(
      "darik_direct_retailer_confirm_cliq_payment",
      {
        p_order_id: order.id,
        p_received: true,
        p_note: null,
      },
    );

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage(
        `CliQ payment confirmed for order ${order.order_number || order.id.slice(0, 8)} / تم تأكيد دفعة كليك.`,
      );
      await loadOrders();
    }

    setConfirmingPaymentOrderId(null);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (!authReady || (session && !context)) {
    return (
      <main className={styles.centerPage}>
        <div className={styles.spinner} />
        <h1>Opening order center / جاري فتح مركز الطلبات…</h1>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.centerPage}>
        <h1>Redirecting to store login / جاري التحويل لتسجيل الدخول…</h1>
      </main>
    );
  }

  return (
    <main className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.brandEyebrow}>Darik</p>
          <h1>Direct</h1>
        </div>
        <nav>
          <a href="/store-dashboard">Overview</a>
          <a href="/store-dashboard/storefront">Storefront</a>
          <a className={styles.activeNav} href="/store-dashboard/orders">
            Orders
          </a>
          <a href="/store-dashboard/products">Products</a>
          <a href="/store-dashboard/categories">Categories</a>
          <a href="/store-dashboard/activation">Go live</a>
        </nav>
        <div className={styles.sidebarFooter}>
          <span>{session.user.email}</span>
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>

      <section className={styles.dashboardContent}>
        <header className={styles.ordersHero}>
          <div className={styles.ordersHeroCopy}>
            <p className={styles.ordersHeroEyebrow}>
              Order operations / إدارة الطلبات
            </p>
            <div className={styles.ordersHeroTitleRow}>
              <h2>{selectedStore?.business_name || "Your store"}</h2>
              <span
                className={`${styles.storeStatusChip} ${
                  storeIsLive
                    ? styles.storeStatusLive
                    : styles.storeStatusDraft
                }`}
              >
                {storeIsLive ? "Live / مباشر" : "Free draft / مسودة مجانية"}
              </span>
            </div>
            <p className={styles.ordersHeroSubtitle}>
              Review new orders, confirm payments, and move every delivery
              forward from one place.
              <span>
                راجع الطلبات الجديدة، أكد الدفعات، وتابع كل عملية توصيل من مكان
                واحد.
              </span>
            </p>
          </div>

          <div className={styles.ordersHeroActions}>
            {context && context.stores.length > 1 ? (
              <label className={styles.storeSwitcher}>
                <span>Store / المتجر</span>
                <select
                  value={selectedRetailerId}
                  onChange={(event) =>
                    setSelectedRetailerId(event.target.value)
                  }
                >
                  {context.stores.map((store) => (
                    <option
                      key={store.retailer_id}
                      value={store.retailer_id}
                    >
                      {store.business_name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <button
              className={styles.refreshOrdersButton}
              type="button"
              onClick={loadOrders}
              disabled={loading}
            >
              <span aria-hidden="true">↻</span>
              {loading ? "Refreshing…" : "Refresh / تحديث"}
            </button>
          </div>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        <section className={styles.premiumMetrics}>
          <article className={styles.premiumMetricCard}>
            <div className={styles.metricIcon} aria-hidden="true">
              ↗
            </div>
            <div className={styles.metricCopy}>
              <span>Orders today / طلبات اليوم</span>
              <strong>{metrics.today}</strong>
              <p>New activity since midnight / النشاط منذ منتصف الليل</p>
            </div>
          </article>

          <article
            className={`${styles.premiumMetricCard} ${styles.metricAttention}`}
          >
            <div className={styles.metricIcon} aria-hidden="true">
              !
            </div>
            <div className={styles.metricCopy}>
              <span>Open orders / الطلبات المفتوحة</span>
              <strong>{metrics.open}</strong>
              <p>Needs store action / تحتاج إجراء من المتجر</p>
            </div>
          </article>

          <article className={styles.premiumMetricCard}>
            <div className={styles.metricIcon} aria-hidden="true">
              ✓
            </div>
            <div className={styles.metricCopy}>
              <span>Delivered / تم التوصيل</span>
              <strong>{metrics.delivered}</strong>
              <p>Completed direct orders / طلبات مكتملة</p>
            </div>
          </article>

          <article className={styles.premiumMetricCard}>
            <div className={styles.metricIcon} aria-hidden="true">
              J
            </div>
            <div className={styles.metricCopy}>
              <span>Order value / قيمة الطلبات</span>
              <strong className={styles.metricMoney}>{money(metrics.value)}</strong>
              <p>Excludes cancelled orders / لا يشمل الطلبات الملغاة</p>
            </div>
          </article>
        </section>

        <section className={styles.ordersWorkspace}>
          <div className={styles.workspaceHeader}>
            <div>
              <p>Order queue / قائمة الطلبات</p>
              <h2>Customer orders / طلبات العملاء</h2>
            </div>
            <div className={styles.workspaceMeta}>
              <span>{filteredOrders.length} visible / ظاهر</span>
              <small>
                {lastUpdatedAt
                  ? `Updated ${lastUpdatedAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Waiting for first refresh"}
              </small>
            </div>
          </div>

          <div className={styles.ordersControlBar}>
            <label className={styles.orderSearchControl}>
              <span className={styles.srOnly}>
                Search orders / البحث في الطلبات
              </span>
              <span className={styles.searchGlyph} aria-hidden="true">
                ⌕
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order, customer, phone or address / ابحث بالطلب أو العميل أو الهاتف أو العنوان"
              />
            </label>

            <label className={styles.orderFilterControl}>
              <span>Status / الحالة</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All orders / جميع الطلبات</option>
                <option value="open">Open orders / الطلبات المفتوحة</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {labelStatus(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <div className={styles.orderSkeletonList} aria-label="Loading orders">
              {[0, 1, 2].map((item) => (
                <div className={styles.orderSkeletonCard} key={item}>
                  <span />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.ordersEmptyState}>
              <div className={styles.emptyOrderIcon} aria-hidden="true">
                <span>✓</span>
              </div>
              <p className={styles.emptyOrderEyebrow}>
                {orders.length === 0
                  ? "Order center ready / مركز الطلبات جاهز"
                  : "No matching orders / لا توجد طلبات مطابقة"}
              </p>
              <h3>
                {orders.length > 0
                  ? "Try a different search or status"
                  : storeIsLive
                    ? "Your first customer order will appear here"
                    : "Finish your storefront, then start taking orders"}
              </h3>
              <p className={styles.emptyOrderDescription}>
                {orders.length > 0
                  ? "Clear the search or choose All orders to return to the full queue. / امسح البحث أو اختر جميع الطلبات للعودة إلى القائمة الكاملة."
                  : storeIsLive
                    ? "The queue is live. New orders will arrive here with customer, payment, and delivery details. / القائمة مفعلة، وستظهر الطلبات الجديدة هنا مع بيانات العميل والدفع والتوصيل."
                    : "Add products, preview the customer experience, and activate the store when you are ready. / أضف المنتجات، عاين تجربة العميل، ثم فعّل المتجر عندما تكون جاهزاً."}
              </p>

              {orders.length === 0 ? (
                <>
                  <div className={styles.emptyOrderActions}>
                    <a href="/store-dashboard/products">
                      Add products / إضافة منتجات
                    </a>
                    <a
                      className={styles.emptyOrderPrimaryAction}
                      href={
                        storeIsLive
                          ? `/${selectedStore?.storefront_slug || ""}`
                          : "/store-dashboard/activation"
                      }
                    >
                      {storeIsLive
                        ? "View store / عرض المتجر"
                        : "Go live / تفعيل المتجر"}
                    </a>
                  </div>

                  <div className={styles.emptyOrderSteps}>
                    <article>
                      <span>01</span>
                      <strong>Build catalog / جهّز المنتجات</strong>
                      <p>Add clear photos, prices, and stock.</p>
                    </article>
                    <article>
                      <span>02</span>
                      <strong>Preview store / عاين المتجر</strong>
                      <p>Check the exact customer experience.</p>
                    </article>
                    <article>
                      <span>03</span>
                      <strong>Receive orders / استقبل الطلبات</strong>
                      <p>Manage payment and delivery here.</p>
                    </article>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className={styles.premiumOrderQueue}>
              {filteredOrders.map((order) => {
                const latitude = Number(order.delivery_latitude);
                const longitude = Number(order.delivery_longitude);
                const hasExactLocation =
                  Number.isFinite(latitude) && Number.isFinite(longitude);
                const mapUrl = hasExactLocation
                  ? `https://www.google.com/maps?q=${latitude},${longitude}`
                  : "";
                const cliqConfirmed = [
                  "paid",
                  "paid_by_cliq",
                  "paid_cliq",
                ].includes(order.payment_status?.toLowerCase());

                return (
                  <article className={styles.premiumOrderCard} key={order.id}>
                    <header className={styles.premiumOrderHeader}>
                      <div className={styles.orderIdentityBlock}>
                        <span className={styles.orderNumberBadge}>
                          #{order.order_number || order.id.slice(0, 8)}
                        </span>
                        <div>
                          <h3>{order.customer_name}</h3>
                          <p>{formatPlacedAt(order.created_at)}</p>
                        </div>
                      </div>

                      <div className={styles.orderHeadlineRight}>
                        <span
                          className={`${styles.premiumStatusBadge} ${statusTone(
                            order.order_status,
                          )}`}
                        >
                          {labelStatus(order.order_status)}
                        </span>
                        <strong>{money(order.total)}</strong>
                      </div>
                    </header>

                    <div className={styles.orderInformationGrid}>
                      <section className={styles.orderInformationPanel}>
                        <p className={styles.orderSectionEyebrow}>
                          Customer / العميل
                        </p>
                        <a
                          className={styles.orderPrimaryDetail}
                          href={`tel:${order.customer_phone}`}
                        >
                          {order.customer_phone}
                        </a>
                        <p className={styles.orderSecondaryDetail}>
                          {order.delivery_address_details ||
                            "Address details not provided / لم تتم إضافة تفاصيل العنوان"}
                        </p>
                        <div className={styles.inlineDetailGrid}>
                          <div>
                            <span>Building / المبنى</span>
                            <strong>
                              {order.direct_building_number || "—"}
                            </strong>
                          </div>
                          <div>
                            <span>Apartment / الشقة</span>
                            <strong>
                              {order.direct_apartment_number || "—"}
                            </strong>
                          </div>
                        </div>
                      </section>

                      <section className={styles.orderInformationPanel}>
                        <p className={styles.orderSectionEyebrow}>
                          Delivery / التوصيل
                        </p>
                        <strong className={styles.orderPrimaryDetail}>
                          {hasExactLocation
                            ? "Exact pin received / تم استلام الموقع الدقيق"
                            : "Location unavailable / الموقع غير متوفر"}
                        </strong>
                        {hasExactLocation ? (
                          <code className={styles.coordinateCode}>
                            {latitude.toFixed(6)}, {longitude.toFixed(6)}
                          </code>
                        ) : null}
                        {order.delivery_note ? (
                          <p className={styles.deliveryNotePremium}>
                            {order.delivery_note}
                          </p>
                        ) : (
                          <p className={styles.orderSecondaryDetail}>
                            No delivery note / لا توجد ملاحظة للتوصيل
                          </p>
                        )}
                        {mapUrl ? (
                          <a
                            className={styles.mapActionLink}
                            href={mapUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Google Maps / فتح خرائط جوجل ↗
                          </a>
                        ) : null}
                      </section>

                      <section className={styles.orderInformationPanel}>
                        <p className={styles.orderSectionEyebrow}>
                          Payment / الدفع
                        </p>
                        <strong className={styles.orderPrimaryDetail}>
                          {paymentLabel(order.payment_method)}
                        </strong>
                        <span
                          className={`${styles.paymentStateBadge} ${
                            cliqConfirmed
                              ? styles.paymentStateConfirmed
                              : styles.paymentStatePending
                          }`}
                        >
                          {paymentStatusLabel(order.payment_status)}
                        </span>
                        <dl className={styles.orderAmountList}>
                          <div>
                            <dt>Subtotal / المجموع</dt>
                            <dd>{money(order.subtotal)}</dd>
                          </div>
                          <div>
                            <dt>Delivery / التوصيل</dt>
                            <dd>{money(order.delivery_fee)}</dd>
                          </div>
                          <div>
                            <dt>Total / الإجمالي</dt>
                            <dd>{money(order.total)}</dd>
                          </div>
                        </dl>
                      </section>
                    </div>

                    {order.payment_method === "cliq" ? (
                      <div className={styles.premiumCliqPanel}>
                        <div className={styles.premiumCliqHeading}>
                          <div>
                            <span>CliQ payment proof / إثبات دفعة كليك</span>
                            <strong>
                              {paymentStatusLabel(order.payment_status)}
                            </strong>
                          </div>
                          {!cliqConfirmed ? (
                            <button
                              type="button"
                              disabled={
                                confirmingPaymentOrderId === order.id
                              }
                              onClick={() => confirmCliqPayment(order)}
                            >
                              {confirmingPaymentOrderId === order.id
                                ? "Confirming…"
                                : "Confirm received / تأكيد الاستلام"}
                            </button>
                          ) : null}
                        </div>

                        {receiptUrls[order.id] ? (
                          <details className={styles.receiptDisclosure}>
                            <summary>
                              View receipt / عرض الإيصال
                            </summary>
                            <a
                              href={receiptUrls[order.id]}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={receiptUrls[order.id]}
                                alt={`CliQ receipt for ${order.order_number || order.id}`}
                              />
                            </a>
                          </details>
                        ) : (
                          <p className={styles.receiptUnavailablePremium}>
                            Receipt preview is unavailable. Refresh the page. /
                            معاينة الإيصال غير متوفرة، حدّث الصفحة.
                          </p>
                        )}
                      </div>
                    ) : null}

                    <footer className={styles.premiumOrderFooter}>
                      <label className={styles.statusUpdateControl}>
                        <span>Update order / تحديث الطلب</span>
                        <select
                          disabled={updatingOrderId === order.id}
                          value={order.order_status}
                          onChange={(event) =>
                            updateStatus(order, event.target.value)
                          }
                        >
                          {!statusOptions.includes(order.order_status) ? (
                            <option value={order.order_status}>
                              {labelStatus(order.order_status)}
                            </option>
                          ) : null}
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {labelStatus(status)}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className={styles.orderQuickActions}>
                        <a href={`tel:${order.customer_phone}`}>
                          Call customer / اتصال
                        </a>
                        {mapUrl ? (
                          <a href={mapUrl} target="_blank" rel="noreferrer">
                            Navigate / توجيه
                          </a>
                        ) : null}
                      </div>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
