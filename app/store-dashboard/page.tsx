"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./dashboard.module.css";

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
  activation_status?: string | null;
  activation_plan?: string | null;
  activation_expires_at?: string | null;
};

type ContextResult = {
  ok: boolean;
  auth_user_id: string | null;
  auth_email: string | null;
  stores: StoreContext[];
};

type StorefrontSummary = {
  id: string;
  slug: string;
  storefront_status: string;
  is_accepting_orders: boolean;
  activation_status?: string | null;
  activation_plan?: string | null;
  activation_expires_at?: string | null;
};

type RecentOrder = {
  id: string;
  order_number: string | null;
  customer_name: string;
  total: number | string;
  order_status: string;
  created_at: string;
};

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

export default function DarikDirectOverviewPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [storefront, setStorefront] = useState<StorefrontSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [directOrderCount, setDirectOrderCount] = useState(0);
  const [directRevenue, setDirectRevenue] = useState(0);
  const [loadingContext, setLoadingContext] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const authUserIdRef = useRef<string | null>(null);

  const selectedStore = useMemo(
    () => context?.stores.find((store) => store.retailer_id === selectedRetailerId) ?? null,
    [context, selectedRetailerId]
  );

  const loadContext = useCallback(async () => {
    setLoadingContext(true);
    const result = await supabase.rpc("darik_direct_get_my_context");
    if (result.error) {
      setError(result.error.message);
      setLoadingContext(false);
      return;
    }
    const nextContext = result.data as ContextResult;
    const stores = Array.isArray(nextContext?.stores) ? nextContext.stores : [];
    setContext({ ...nextContext, stores });
    setSelectedRetailerId((current) =>
      current && stores.some((store) => store.retailer_id === current)
        ? current
        : stores[0]?.retailer_id ?? ""
    );
    setLoadingContext(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      authUserIdRef.current = data.session?.user.id ?? null;
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      const previousUserId = authUserIdRef.current;
      const nextUserId = nextSession?.user.id ?? null;
      const accountChanged = Boolean(previousUserId && nextUserId && previousUserId !== nextUserId);
      authUserIdRef.current = nextUserId;
      setSession(nextSession);
      setAuthReady(true);
      if (event === "SIGNED_OUT" || !nextSession || accountChanged) {
        setContext(null);
        setSelectedRetailerId("");
        setStorefront(null);
        setRecentOrders([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user.id) loadContext();
  }, [session?.user.id, loadContext]);

  useEffect(() => {
    if (!selectedStore) return;
    let cancelled = false;
    async function loadSummary() {
      setError("");
      const [storefrontResult, productResult, orderResult, recentResult] = await Promise.all([
        supabase.from("retailer_storefronts").select("id,slug,storefront_status,is_accepting_orders,activation_status,activation_plan,activation_expires_at").eq("retailer_id", selectedStore.retailer_id).maybeSingle(),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("retailer_id", selectedStore.retailer_id).neq("direct_product_status", "archived"),
        supabase.from("orders").select("id,total", { count: "exact" }).eq("sales_channel", "direct_storefront").eq("storefront_retailer_id", selectedStore.retailer_id),
        supabase.from("orders").select("id,order_number,customer_name,total,order_status,created_at").eq("sales_channel", "direct_storefront").eq("storefront_retailer_id", selectedStore.retailer_id).order("created_at", { ascending: false }).limit(5),
      ]);
      if (cancelled) return;
      if (storefrontResult.error) setError(storefrontResult.error.message);
      else setStorefront((storefrontResult.data as StorefrontSummary | null) ?? null);
      setProductCount(productResult.count ?? 0);
      if (!orderResult.error) {
        const rows = (orderResult.data ?? []) as unknown as Array<{ total: number | string }>;
        setDirectOrderCount(orderResult.count ?? rows.length);
        setDirectRevenue(rows.reduce((sum, row) => sum + Number(row.total ?? 0), 0));
      }
      if (!recentResult.error) setRecentOrders((recentResult.data ?? []) as unknown as RecentOrder[]);
    }
    loadSummary();
    return () => { cancelled = true; };
  }, [selectedStore]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (result.error) setError(result.error.message);
    else setMessage("Signed in successfully.");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (!authReady) {
    return <main className={styles.centerPage}><div className={styles.spinner} /><h1>Loading Darik Direct…</h1></main>;
  }

  if (!session) {
    return (
      <main className={styles.loginPage}>
        <section className={styles.loginCard}>
          <div className={styles.loginBrand}><span>Darik Direct</span><h1>Store dashboard</h1><p>Sign in using the email connected to your Darik retailer account.</p></div>
          <form onSubmit={signIn} className={styles.loginForm}>
            <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            {error ? <p className={styles.error}>{error}</p> : null}
            {message ? <p className={styles.success}>{message}</p> : null}
            <button type="submit">Sign in</button>
          </form>
          <a className={styles.marketplaceLink} href="/store-signup">Create a store for free</a>
          <a className={styles.marketplaceLink} href="/">Return to Darik Marketplace</a>
        </section>
      </main>
    );
  }

  if (loadingContext) {
    return <main className={styles.centerPage}><div className={styles.spinner} /><h1>Opening your dashboard…</h1></main>;
  }

  return (
    <main className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div><p className={styles.brandEyebrow}>Darik</p><h1>Direct</h1></div>
        <nav>
          <a className={styles.activeNav} href="/store-dashboard">Overview</a>
          <a href="/store-dashboard/storefront">Storefront</a>
          <a href="/store-dashboard/orders">Orders</a>
          <a href="/store-dashboard/products">Products</a>
          <a href="/store-dashboard/categories">Categories</a>
          <a href="/store-dashboard/activation">Go live</a>
        </nav>
        <div className={styles.sidebarFooter}><span>{session.user.email}</span><button onClick={signOut}>Sign out</button></div>
      </aside>

      <section className={styles.dashboardContent}>
        <header className={styles.topbar}>
          <div><p>Store owner dashboard</p><h2>{selectedStore?.business_name || "Darik retailer"}</h2></div>
          {context && context.stores.length > 1 ? (
            <select value={selectedRetailerId} onChange={(event) => setSelectedRetailerId(event.target.value)}>
              {context.stores.map((store) => <option key={store.retailer_id} value={store.retailer_id}>{store.business_name}</option>)}
            </select>
          ) : null}
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        {!selectedStore ? (
          <section className={styles.emptyState}><span>No retailer membership found</span><h2>This login is not connected to a Darik retailer.</h2></section>
        ) : (
          <>
            <section className={styles.metrics}>
              <article><span>Products</span><strong>{productCount}</strong><p>Direct catalog items</p></article>
              <article><span>Direct orders</span><strong>{directOrderCount}</strong><p>Storefront channel only</p></article>
              <article><span>Total direct value</span><strong>{money(directRevenue)}</strong><p>All direct orders</p></article>
              <article><span>Activation</span><strong>{(storefront?.activation_status || selectedStore.activation_status || "free_draft").replace(/_/g, " ")}</strong><p>{storefront?.activation_status === "active" ? "Public store is live" : "Public page shows Coming Soon"}</p></article>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><p>Manage your store</p><h2>Choose where to work</h2></div></div>
              <div className={styles.quickActionGrid}>
                <a className={styles.quickActionCard} href="/store-dashboard/storefront"><span>01</span><strong>Storefront</strong><p>Branding, store details, delivery settings, hours and private preview.</p></a>
                <a className={styles.quickActionCard} href="/store-dashboard/orders"><span>02</span><strong>Orders</strong><p>Review and manage Darik Direct customer orders.</p></a>
                <a className={styles.quickActionCard} href="/store-dashboard/products"><span>03</span><strong>Products</strong><p>Add products, prices, photos and optional inventory.</p></a>
                <a className={styles.quickActionCard} href="/store-dashboard/categories"><span>04</span><strong>Categories</strong><p>Create this store’s own English and Arabic category structure.</p></a>
                <a className={styles.quickActionCard} href="/store-dashboard/activation"><span>05</span><strong>Go live</strong><p>Choose a plan, submit CliQ proof, and wait for Darik approval.</p></a>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><p>Latest activity</p><h2>Recent direct orders</h2></div><a className={styles.catalogButton} href="/store-dashboard/orders">View all orders</a></div>
              {recentOrders.length === 0 ? <div className={styles.tableEmpty}>No Darik Direct orders yet.</div> : (
                <div className={styles.orderTable}>
                  <div className={styles.tableHead}><span>Order</span><span>Customer</span><span>Status</span><span>Total</span></div>
                  {recentOrders.map((order) => <div className={styles.tableRow} key={order.id}><strong>{order.order_number || order.id.slice(0, 8)}</strong><span>{order.customer_name}</span><span className={styles.statusPill}>{order.order_status}</span><strong>{money(order.total)}</strong></div>)}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
