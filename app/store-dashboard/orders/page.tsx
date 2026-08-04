"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
type ContextResult = { ok: boolean; auth_user_id: string | null; auth_email: string | null; stores: StoreContext[] };
type DirectOrder = {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address_details: string | null;
  payment_method: string;
  payment_status: string;
  direct_payment_reference: string | null;
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  order_status: string;
  created_at: string;
};

const statusOptions = ["accepted", "preparing", "ready_for_driver", "out_for_delivery", "delivered", "cancelled"];
function money(value: number | string | null | undefined) { const amount = Number(value ?? 0); return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`; }
function labelStatus(value: string) { return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }

export default function DarikDirectOrdersPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [orders, setOrders] = useState<DirectOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [confirmingPaymentOrderId, setConfirmingPaymentOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const authUserIdRef = useRef<string | null>(null);

  const selectedStore = useMemo(() => context?.stores.find((store) => store.retailer_id === selectedRetailerId) ?? null, [context, selectedRetailerId]);

  const loadContext = useCallback(async () => {
    const result = await supabase.rpc("darik_direct_get_my_context");
    if (result.error) { setError(result.error.message); setLoading(false); return; }
    const nextContext = result.data as ContextResult;
    const stores = Array.isArray(nextContext?.stores) ? nextContext.stores : [];
    setContext({ ...nextContext, stores });
    setSelectedRetailerId((current) => current && stores.some((store) => store.retailer_id === current) ? current : stores[0]?.retailer_id ?? "");
  }, []);

  const loadOrders = useCallback(async () => {
    if (!selectedRetailerId) { setOrders([]); setLoading(false); return; }
    setLoading(true); setError("");
    const result = await supabase.from("orders").select("id,order_number,customer_name,customer_phone,delivery_address_details,payment_method,payment_status,direct_payment_reference,subtotal,delivery_fee,total,order_status,created_at").eq("sales_channel", "direct_storefront").eq("storefront_retailer_id", selectedRetailerId).order("created_at", { ascending: false }).limit(200);
    if (result.error) setError(result.error.message);
    else setOrders((result.data ?? []) as unknown as DirectOrder[]);
    setLoading(false);
  }, [selectedRetailerId]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { authUserIdRef.current = data.session?.user.id ?? null; setSession(data.session); setAuthReady(true); if (!data.session) router.replace("/store-dashboard"); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      authUserIdRef.current = nextSession?.user.id ?? null; setSession(nextSession); setAuthReady(true);
      if (event === "SIGNED_OUT" || !nextSession) router.replace("/store-dashboard");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => { if (session?.user.id) loadContext(); }, [session?.user.id, loadContext]);
  useEffect(() => { if (selectedRetailerId) loadOrders(); }, [selectedRetailerId, loadOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.order_status !== statusFilter) return false;
      if (!term) return true;
      return [order.order_number, order.customer_name, order.customer_phone, order.delivery_address_details].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
    });
  }, [orders, search, statusFilter]);

  const metrics = useMemo(() => ({
    total: orders.length,
    open: orders.filter((order) => !["delivered", "cancelled"].includes(order.order_status)).length,
    delivered: orders.filter((order) => order.order_status === "delivered").length,
    value: orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0),
  }), [orders]);

  async function updateStatus(order: DirectOrder, nextStatus: string) {
    setUpdatingOrderId(order.id); setError(""); setMessage("");
    const result = await supabase.rpc("darik_direct_retailer_update_order_status", { p_order_id: order.id, p_new_status: nextStatus, p_status_note: null });
    if (result.error) setError(result.error.message);
    else { setMessage(`Order ${order.order_number || order.id.slice(0, 8)} updated to ${labelStatus(nextStatus)}.`); await loadOrders(); }
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
      }
    );

    if (result.error) setError(result.error.message);
    else {
      setMessage(
        `CliQ payment confirmed for order ${
          order.order_number || order.id.slice(0, 8)
        }.`
      );
      await loadOrders();
    }

    setConfirmingPaymentOrderId(null);
  }

  async function signOut() { await supabase.auth.signOut(); }

  if (!authReady || (session && !context)) return <main className={styles.centerPage}><div className={styles.spinner} /><h1>Opening direct orders…</h1></main>;
  if (!session) return <main className={styles.centerPage}><h1>Redirecting to store login…</h1></main>;

  return (
    <main className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div><p className={styles.brandEyebrow}>Darik</p><h1>Direct</h1></div>
        <nav>
          <a href="/store-dashboard">Overview</a>
          <a href="/store-dashboard/storefront">Storefront</a>
          <a className={styles.activeNav} href="/store-dashboard/orders">Orders</a>
          <a href="/store-dashboard/products">Products</a>
          <a href="/store-dashboard/categories">Categories</a>
        </nav>
        <div className={styles.sidebarFooter}><span>{session.user.email}</span><button onClick={signOut}>Sign out</button></div>
      </aside>
      <section className={styles.dashboardContent}>
        <header className={styles.topbar}>
          <div><p>Direct order management</p><h2>{selectedStore?.business_name || "Your store"} orders</h2></div>
          {context && context.stores.length > 1 ? <select value={selectedRetailerId} onChange={(event) => setSelectedRetailerId(event.target.value)}>{context.stores.map((store) => <option key={store.retailer_id} value={store.retailer_id}>{store.business_name}</option>)}</select> : null}
        </header>
        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}
        <section className={styles.metrics}>
          <article><span>Total orders</span><strong>{metrics.total}</strong><p>Darik Direct only</p></article>
          <article><span>Open orders</span><strong>{metrics.open}</strong><p>Needs store action</p></article>
          <article><span>Delivered</span><strong>{metrics.delivered}</strong><p>Completed orders</p></article>
          <article><span>Order value</span><strong>{money(metrics.value)}</strong><p>All direct orders</p></article>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelHeader}><div><p>Storefront channel</p><h2>Manage customer orders</h2></div><button className={styles.catalogButton} onClick={loadOrders}>Refresh orders</button></div>
          <div className={styles.ordersToolbar}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, phone or address" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{statusOptions.map((status) => <option key={status} value={status}>{labelStatus(status)}</option>)}</select>
          </div>
          {loading ? <div className={styles.tableEmpty}>Loading direct orders…</div> : filteredOrders.length === 0 ? <div className={styles.tableEmpty}>No direct orders match this view.</div> : (
            <div className={styles.ordersPageGrid}>
              {filteredOrders.map((order) => <article className={styles.orderCard} key={order.id}>
                <div className={styles.orderCardHeader}><div><span>{order.order_number || order.id.slice(0, 8)}</span><h3>{order.customer_name}</h3></div><strong>{money(order.total)}</strong></div>
                <div className={styles.orderMetaGrid}><div><span>Phone</span><strong>{order.customer_phone}</strong></div><div><span>Payment</span><strong>{labelStatus(order.payment_method)}</strong></div><div><span>Status</span><strong className={styles.statusPill}>{labelStatus(order.order_status)}</strong></div><div><span>Placed</span><strong>{new Date(order.created_at).toLocaleString()}</strong></div></div>
                {order.delivery_address_details ? <p className={styles.orderAddress}>{order.delivery_address_details}</p> : null}
                {order.payment_method === "cliq" ? (
                  <div className={styles.cliqOrderPanel}>
                    <span>CliQ payment</span>
                    <strong>{labelStatus(order.payment_status)}</strong>
                    {order.direct_payment_reference ? (
                      <code>{order.direct_payment_reference}</code>
                    ) : null}
                    {!["paid", "paid_by_cliq", "paid_cliq"].includes(
                      order.payment_status
                    ) ? (
                      <div className={styles.cliqOrderActions}>
                        <button
                          type="button"
                          disabled={confirmingPaymentOrderId === order.id}
                          onClick={() => confirmCliqPayment(order)}
                        >
                          {confirmingPaymentOrderId === order.id
                            ? "Confirming…"
                            : "Mark CliQ received"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className={styles.orderStatusActions}><span>Update status</span><select disabled={updatingOrderId === order.id} value={order.order_status} onChange={(event) => updateStatus(order, event.target.value)}><option value={order.order_status}>{labelStatus(order.order_status)}</option>{statusOptions.filter((status) => status !== order.order_status).map((status) => <option key={status} value={status}>{labelStatus(status)}</option>)}</select></div>
              </article>)}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
