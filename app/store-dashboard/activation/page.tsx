"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./activation.module.css";

type StoreContext = {
  retailer_id: string; business_name: string; storefront_id: string | null; storefront_slug: string | null;
  activation_status?: string | null; activation_plan?: string | null; activation_expires_at?: string | null;
  business_address?: string | null; location_locked_at?: string | null;
};
type ContextResult = { stores: StoreContext[] };
type ActivationRequest = {
  id: string; plan_code: string; amount_expected_jod: number | string; sender_name: string;
  request_status: string; admin_note: string | null; created_at: string; reviewed_at: string | null;
};

const plans = [
  { code: "basic_monthly", title: "Monthly", price: 45, detail: "45 JOD each month" },
  { code: "basic_6_month", title: "6 months", price: 210, detail: "35 JOD/month prepaid" },
  { code: "basic_12_month", title: "12 months", price: 300, detail: "25 JOD/month prepaid" },
  { code: "premium_annual", title: "Premium annual", price: 600, detail: "Includes custom-domain entitlement" },
] as const;

function safeFileName(name: string) { return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-"); }
function statusLabel(value: string | null | undefined) { return (value || "free_draft").replace(/_/g, " "); }

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
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cliqName = process.env.NEXT_PUBLIC_DARIK_CLIQ_NAME || "Darik activation account";
  const cliqAlias = process.env.NEXT_PUBLIC_DARIK_CLIQ_ALIAS || "Set NEXT_PUBLIC_DARIK_CLIQ_ALIAS in Vercel";
  const selectedPlan = plans.find((item) => item.code === plan) || plans[0];
  const pending = requests.some((request) => request.request_status === "pending");
  const active = store?.activation_status === "active" && (!store.activation_expires_at || new Date(store.activation_expires_at) > new Date());

  const loadData = useCallback(async () => {
    const contextResult = await supabase.rpc("darik_direct_get_my_context");
    if (contextResult.error) { setError(contextResult.error.message); setLoading(false); return; }
    const context = contextResult.data as ContextResult;
    const nextStore = Array.isArray(context?.stores) ? context.stores[0] ?? null : null;
    setStore(nextStore);
    if (nextStore?.retailer_id) {
      const requestsResult = await supabase.from("retailer_store_activation_requests")
        .select("id,plan_code,amount_expected_jod,sender_name,request_status,admin_note,created_at,reviewed_at")
        .eq("retailer_id", nextStore.retailer_id).order("created_at", { ascending: false });
      if (!requestsResult.error) setRequests((requestsResult.data ?? []) as ActivationRequest[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => { setSession(data.session); if (!data.session) router.replace("/store-dashboard"); else loadData(); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); if (!next) router.replace("/store-dashboard"); });
    return () => subscription.unsubscribe();
  }, [loadData, router]);

  useEffect(() => {
    if (!receipt) { setReceiptPreview(""); return; }
    const url = URL.createObjectURL(receipt); setReceiptPreview(url); return () => URL.revokeObjectURL(url);
  }, [receipt]);

  function chooseReceipt(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (!file) { setReceipt(null); return; }
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { setError("Upload a JPG, PNG, or WebP receipt image."); event.target.value = ""; return; }
    if (file.size > 8 * 1024 * 1024) { setError("The receipt image must be 8 MB or smaller."); event.target.value = ""; return; }
    setError(""); setReceipt(file);
  }

  async function submitActivation() {
    if (!session || !store?.storefront_id || !store.retailer_id) return;
    setError(""); setMessage("");
    if (senderName.trim().length < 2) { setError("Enter the name used to send the CliQ payment."); return; }
    if (!receipt) { setError("Upload the CliQ payment receipt."); return; }
    setBusy(true);
    const extension = receipt.name.split('.').pop()?.toLowerCase() || "jpg";
    const path = `${store.retailer_id}/${crypto.randomUUID()}-${safeFileName(receipt.name.replace(/\.[^.]+$/, ""))}.${extension}`;
    const upload = await supabase.storage.from("darik-store-activation-receipts").upload(path, receipt, { cacheControl: "3600", upsert: false, contentType: receipt.type });
    if (upload.error) { setBusy(false); setError(upload.error.message); return; }
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
      setBusy(false); setError(result.error.message); return;
    }
    setBusy(false); setMessage("Payment submitted. Darik will review the receipt before your public store goes live.");
    setReceipt(null); setSenderName(""); setCliqReference(""); setNote(""); await loadData();
  }

  if (loading || !session) return <main className={styles.page}><section className={styles.content}><div className={styles.panel}>Opening activation center…</div></section></main>;

  const statusClass = active ? styles.statusActive : pending ? styles.statusPending : "";
  return <main className={styles.page}>
    <aside className={styles.sidebar}><div className={styles.brand}><span>Darik</span><h1>Direct</h1></div><nav className={styles.nav}><a href="/store-dashboard">Overview</a><a href="/store-dashboard/storefront">Storefront</a><a href="/store-dashboard/products">Products</a><a href="/store-dashboard/categories">Categories</a><a href="/store-dashboard/orders">Orders</a><a className={styles.active} href="/store-dashboard/activation">Go live</a></nav></aside>
    <section className={styles.content}>
      <header className={styles.topbar}><div><p>Store activation</p><h1>{store?.business_name || "Your Darik store"}</h1></div><span className={`${styles.status} ${statusClass}`}>{statusLabel(store?.activation_status)}</span></header>
      {error ? <div className={`${styles.message} ${styles.error}`}>{error}</div> : null}{message ? <div className={`${styles.message} ${styles.success}`}>{message}</div> : null}

      {active ? <section className={styles.panel}><h2>Your store is live</h2><p>The public storefront is active and can receive orders.</p><div className={styles.locked}><strong>Public address</strong><span>getdarik.com/store/{store?.storefront_slug}</span>{store?.activation_expires_at ? <span>Active through {new Date(store.activation_expires_at).toLocaleDateString()}</span> : null}</div></section> : null}
      {pending ? <section className={styles.panel}><h2>Payment under review</h2><p>Your public page remains Coming Soon while Darik verifies the CliQ receipt. You can continue editing and previewing the store.</p></section> : null}

      {!active && !pending ? <>
        <section className={styles.panel}><h2>Choose how you want to activate</h2><p>The account and private preview stay free. Payment is required only to publish the customer-facing store.</p><div className={styles.planGrid}>{plans.map((item) => <button type="button" key={item.code} className={`${styles.plan} ${plan === item.code ? styles.planSelected : ""}`} onClick={() => setPlan(item.code)}><span>{item.title}</span><strong>{item.price} JOD</strong><small>{item.detail}</small></button>)}</div></section>
        <section className={styles.panel}><h2>Pay Darik by CliQ</h2><p>Send exactly {selectedPlan.price} JOD, then upload the receipt below.</p><div className={styles.paymentBox}>
          <div className={styles.cliqCard}><span>CliQ account name</span><strong>{cliqName}</strong><span>CliQ alias / mobile</span><strong>{cliqAlias}</strong><span>Store reference</span><strong>{store?.storefront_slug || store?.storefront_id}</strong></div>
          <div className={styles.form}><label className={styles.label}>Sender name<input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Name shown on the CliQ payment" /></label><label className={styles.label}>CliQ reference <span>Optional</span><input value={cliqReference} onChange={(e) => setCliqReference(e.target.value)} /></label><label className={styles.label}>Note <span>Optional</span><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></label><label className={`${styles.label} ${styles.upload}`}>CliQ receipt image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseReceipt}/>{receiptPreview ? <img className={styles.receiptPreview} src={receiptPreview} alt="CliQ receipt preview"/> : null}</label><button type="button" className={styles.submit} onClick={submitActivation} disabled={busy}>{busy ? "Uploading and submitting…" : `Submit ${selectedPlan.title} payment`}</button></div>
        </div></section>
      </> : null}

      <section className={styles.panel}><h2>Payment history</h2><p>All activation requests remain attached to this store.</p><div className={styles.history}>{requests.length ? requests.map((request) => <article className={styles.request} key={request.id}><div><h3>{request.plan_code.replace(/_/g," ")} · {Number(request.amount_expected_jod).toFixed(2)} JOD</h3><p>Sent by {request.sender_name} on {new Date(request.created_at).toLocaleString()}</p>{request.admin_note ? <p>Darik note: {request.admin_note}</p> : null}</div><strong>{request.request_status.replace(/_/g," ")}</strong></article>) : <div className={styles.locked}><strong>No activation payments yet</strong><span>Your free draft remains available.</span></div>}</div></section>
    </section>
  </main>;
}
