"use client";

import {
  CSSProperties,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./admin.module.css";

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  tab_permissions: string[];
  session_token: string;
};

type RequestRow = {
  id: string;
  storefront_id: string;
  store_name: string;
  store_name_ar: string | null;
  slug: string;
  business_type: string | null;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  business_address: string | null;
  business_latitude: number | string | null;
  business_longitude: number | string | null;
  plan_code: string;
  amount_expected_jod: number | string;
  sender_name: string;
  cliq_reference: string | null;
  receipt_path: string;
  request_status: string;
  retailer_note: string | null;
  admin_note: string | null;
  domain_preferences: string[] | null;
  assigned_domain: string | null;
  created_at: string;
  product_count: number;
  active_category_count: number;
};

type PreviewData = {
  storefront: {
    id: string;
    slug: string;
    display_name: string;
    display_name_ar: string | null;
    tagline: string | null;
    tagline_ar: string | null;
    logo_url: string | null;
    hero_image_url: string | null;
    primary_color: string;
    accent_color: string;
    background_color: string;
    minimum_order: number | string;
    delivery_fee: number | string;
    estimated_delivery_minutes: number | null;
    business_phone: string | null;
    whatsapp_number: string | null;
    activation_status: string;
  };
  retailer: {
    business_name: string;
    business_address: string | null;
    direct_business_type: string | null;
  } | null;
  categories: Array<{
    id: string;
    name: string;
    name_ar: string | null;
    image_url: string | null;
  }>;
  products: Array<{
    id: string;
    name: string;
    direct_name: string | null;
    direct_name_ar: string | null;
    direct_price: number | string | null;
    app_price: number | string | null;
    direct_photo_url: string | null;
    official_product_thumbnail_url: string | null;
    storefront_visible: boolean | null;
  }>;
};

const TOKEN_KEY = "darik-admin-session-token";

export default function StoreActivationsAdminPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("pending");
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [assignedDomains, setAssignedDomains] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRows = useCallback(async (token: string, filter: string) => {
    setLoading(true);
    setError("");
    const result = await supabase.rpc(
      "darik_direct_admin_list_activation_requests",
      { p_session_token: token, p_status: filter },
    );
    if (result.error) {
      setError(result.error.message);
      setRows([]);
    } else {
      const nextRows = Array.isArray(result.data) ? (result.data as RequestRow[]) : [];
      setRows(nextRows);
      setAssignedDomains((current) => {
        const next = { ...current };
        nextRows.forEach((row) => {
          if (row.plan_code === "premium_annual" && !next[row.id]) {
            next[row.id] = row.assigned_domain || row.domain_preferences?.[0] || "";
          }
        });
        return next;
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    supabase
      .rpc("darik_admin_get_user_by_session", { p_session_token: token })
      .then((result) => {
        const user = Array.isArray(result.data) ? result.data[0] : null;
        if (!user) {
          window.localStorage.removeItem(TOKEN_KEY);
          setLoading(false);
          return;
        }
        setAdmin(user as AdminUser);
        void loadRows(token, "pending");
      });
  }, [loadRows]);

  useEffect(() => {
    if (!preview) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [preview]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await supabase.rpc("darik_admin_login", {
      p_email: email.trim(),
      p_password: password,
    });
    const user = Array.isArray(result.data) ? result.data[0] : null;
    if (result.error || !user) {
      setError(result.error?.message || "Admin login failed.");
      setLoading(false);
      return;
    }
    const next = user as AdminUser;
    window.localStorage.setItem(TOKEN_KEY, next.session_token);
    setAdmin(next);
    setPassword("");
    await loadRows(next.session_token, "pending");
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
    setRows([]);
    setPreview(null);
  }

  async function changeFilter(next: string) {
    setStatus(next);
    if (admin) await loadRows(admin.session_token, next);
  }

  async function openReceipt(row: RequestRow) {
    if (!admin) return;
    setBusyId(row.id);
    setError("");
    const response = await fetch("/api/admin/store-activation-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionToken: admin.session_token,
        receiptPath: row.receipt_path,
      }),
    });
    const json = await response.json();
    setBusyId("");
    if (!response.ok || !json.signedUrl) {
      setError(json.error || "Could not open receipt.");
      return;
    }
    window.open(json.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function openDraftPreview(row: RequestRow) {
    if (!admin) return;
    setBusyId(row.id);
    setError("");
    const response = await fetch("/api/admin/store-activation-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionToken: admin.session_token,
        storefrontId: row.storefront_id,
      }),
    });
    const json = await response.json();
    setBusyId("");
    if (!response.ok || !json.storefront) {
      setError(json.error || "Could not open the private storefront preview.");
      return;
    }
    setPreview(json as PreviewData);
  }

  async function review(
    row: RequestRow,
    decision: "approve" | "reject" | "needs_new_receipt",
  ) {
    if (!admin) return;
    setBusyId(row.id);
    setError("");
    setMessage("");

    if (decision === "approve" && row.plan_code === "premium_annual") {
      const assignedDomain = assignedDomains[row.id]?.trim() || "";

      if (!assignedDomain) {
        setBusyId("");
        setError("Choose the available domain before approving the Premium activation.");
        return;
      }

      const domainResult = await supabase.rpc("darik_direct_admin_assign_activation_domain", {
        p_session_token: admin.session_token,
        p_request_id: row.id,
        p_assigned_domain: assignedDomain,
      });

      if (domainResult.error) {
        setBusyId("");
        setError(domainResult.error.message);
        return;
      }
    }

    const result = await supabase.rpc("darik_direct_admin_review_activation", {
      p_session_token: admin.session_token,
      p_request_id: row.id,
      p_decision: decision,
      p_admin_note: notes[row.id]?.trim() || null,
    });
    setBusyId("");
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setMessage(
      decision === "approve"
        ? `${row.store_name} is now live.`
        : `${row.store_name} activation was returned to the retailer.`,
    );
    await loadRows(admin.session_token, status);
  }

  const totalExpected = useMemo(
    () => rows.reduce((sum, row) => sum + Number(row.amount_expected_jod || 0), 0),
    [rows],
  );

  if (!admin) {
    return (
      <main className={styles.page}>
        <section className={styles.login}>
          <span>Darik administration</span>
          <h1>Store activations</h1>
          <p>Use an existing Darik admin login with activation permission.</p>
          <form className={styles.form} onSubmit={login}>
            <label className={styles.label}>
              Admin email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className={styles.label}>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error ? <div className={styles.error}>{error}</div> : null}
            <button className={styles.primary} disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p>Darik admin backend</p>
            <h1>Store activation payments</h1>
            <p>Signed in as {admin.full_name} · {admin.role}</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => void loadRows(admin.session_token, status)}>
              Refresh
            </button>
            <button onClick={logout}>Sign out</button>
          </div>
        </header>

        {error ? <div className={styles.error}>{error}</div> : null}
        {message ? <div className={styles.success}>{message}</div> : null}

        <section className={styles.metrics}>
          <article className={styles.metric}>
            <span>Requests shown</span>
            <strong>{rows.length}</strong>
          </article>
          <article className={styles.metric}>
            <span>Expected CliQ total</span>
            <strong>{totalExpected.toFixed(2)} JOD</strong>
          </article>
          <article className={styles.metric}>
            <span>Current filter</span>
            <strong>{status.replace(/_/g, " ")}</strong>
          </article>
        </section>

        <section className={styles.filters}>
          <strong>Show</strong>
          <select value={status} onChange={(event) => void changeFilter(event.target.value)}>
            <option value="pending">Pending review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_new_receipt">Needs new receipt</option>
            <option value="all">All requests</option>
          </select>
        </section>

        <section className={styles.list}>
          {loading ? (
            <div className={styles.empty}>Loading activation requests…</div>
          ) : rows.length ? (
            rows.map((row) => (
              <article className={styles.card} key={row.id}>
                <header className={styles.cardHead}>
                  <div>
                    <h2>{row.store_name}</h2>
                    <p>
                      getdarik.com/store/{row.slug} · submitted{" "}
                      {new Date(row.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={styles.badge}>
                    {row.request_status.replace(/_/g, " ")}
                  </span>
                </header>

                <div className={styles.body}>
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <span>Plan / amount</span>
                      <strong>
                        {row.plan_code.replace(/_/g, " ")} ·{" "}
                        {Number(row.amount_expected_jod).toFixed(2)} JOD
                      </strong>
                    </div>
                    <div className={styles.detail}>
                      <span>CliQ sender</span>
                      <strong>
                        {row.sender_name}
                        {row.cliq_reference ? ` · ${row.cliq_reference}` : ""}
                      </strong>
                    </div>
                    <div className={styles.detail}>
                      <span>Owner</span>
                      <strong>{row.owner_name || "—"}</strong>
                    </div>
                    <div className={styles.detail}>
                      <span>Contact</span>
                      <strong>
                        {row.email || "—"}
                        <br />
                        {row.phone || "—"}
                      </strong>
                    </div>
                    <div className={styles.detail}>
                      <span>Business type</span>
                      <strong>{row.business_type?.replace(/_/g, " ") || "Other"}</strong>
                    </div>
                    <div className={styles.detail}>
                      <span>Setup</span>
                      <strong>
                        {row.product_count} products · {row.active_category_count} categories
                      </strong>
                    </div>
                    {row.plan_code === "premium_annual" ? (
                      <div className={`${styles.detail} ${styles.domainDetail}`}>
                        <span>Domain preferences · most to least desired</span>
                        {row.domain_preferences?.length ? (
                          <ol className={styles.domainList}>
                            {row.domain_preferences.map((domain) => (
                              <li key={domain}>{domain}</li>
                            ))}
                          </ol>
                        ) : (
                          <strong>Missing — retailer must submit five choices</strong>
                        )}
                        {row.assigned_domain ? (
                          <strong className={styles.assignedDomain}>
                            Assigned domain: {row.assigned_domain}
                          </strong>
                        ) : null}
                      </div>
                    ) : null}
                    <div className={styles.detail}>
                      <span>Locked location</span>
                      <strong>{row.business_address || "—"}</strong>
                    </div>
                    <div className={styles.detail}>
                      <span>Coordinates</span>
                      <strong>
                        {row.business_latitude}, {row.business_longitude}
                      </strong>
                    </div>
                    {row.retailer_note ? (
                      <div className={styles.detail}>
                        <span>Retailer note</span>
                        <strong>{row.retailer_note}</strong>
                      </div>
                    ) : null}
                  </div>

                  <aside className={styles.actions}>
                    <button
                      className={styles.receipt}
                      onClick={() => void openDraftPreview(row)}
                      disabled={busyId === row.id}
                    >
                      {busyId === row.id ? "Opening…" : "Preview private storefront"}
                    </button>
                    <button
                      className={styles.receipt}
                      onClick={() => void openReceipt(row)}
                      disabled={busyId === row.id}
                    >
                      {busyId === row.id ? "Opening…" : "Open private receipt"}
                    </button>
                    {row.business_latitude != null && row.business_longitude != null ? (
                      <a
                        className={styles.receipt}
                        href={`https://www.google.com/maps?q=${row.business_latitude},${row.business_longitude}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open locked location
                      </a>
                    ) : null}
                    <a
                      className={styles.receipt}
                      href={`/store/${row.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View public Coming Soon page
                    </a>
                    {row.request_status === "pending" ? (
                      <>
                        {row.plan_code === "premium_annual" ? (
                          <div className={styles.domainAssignment}>
                            <label>
                              Available domain to assign
                              <select
                                value={assignedDomains[row.id] || ""}
                                onChange={(event) =>
                                  setAssignedDomains((current) => ({
                                    ...current,
                                    [row.id]: event.target.value,
                                  }))
                                }
                                disabled={!row.domain_preferences?.length}
                              >
                                <option value="">Choose after checking availability</option>
                                {(row.domain_preferences || []).map((domain, index) => (
                                  <option value={domain} key={domain}>
                                    {index + 1}. {domain}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <p>
                              Check availability outside Darik, then select the first eligible choice available. The
                              retailer has been told setup may take up to 48 hours and is usually ready within a few
                              hours.
                            </p>
                          </div>
                        ) : null}
                        <textarea
                          className={styles.note}
                          rows={3}
                          placeholder="Admin note (required when rejecting)"
                          value={notes[row.id] || ""}
                          onChange={(event) =>
                            setNotes((current) => ({
                              ...current,
                              [row.id]: event.target.value,
                            }))
                          }
                        />
                        <button
                          className={styles.approve}
                          onClick={() => void review(row, "approve")}
                          disabled={busyId === row.id}
                        >
                          Approve and publish
                        </button>
                        <button
                          className={styles.reject}
                          onClick={() => void review(row, "needs_new_receipt")}
                          disabled={busyId === row.id}
                        >
                          Request new receipt
                        </button>
                        <button
                          className={styles.reject}
                          onClick={() => void review(row, "reject")}
                          disabled={busyId === row.id}
                        >
                          Reject payment
                        </button>
                      </>
                    ) : null}
                  </aside>
                </div>
              </article>
            ))
          ) : (
            <div className={styles.empty}>No activation requests match this filter.</div>
          )}
        </section>

        {preview ? (
          <div
            className={styles.previewBackdrop}
            role="dialog"
            aria-modal="true"
            aria-label="Admin private storefront preview"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setPreview(null);
            }}
          >
            <section
              className={styles.previewModal}
              style={
                {
                  "--admin-preview-primary":
                    preview.storefront.primary_color || "#111827",
                  "--admin-preview-accent":
                    preview.storefront.accent_color || "#167d50",
                  "--admin-preview-bg":
                    preview.storefront.background_color || "#f8fafc",
                } as CSSProperties
              }
            >
              <header className={styles.previewToolbar}>
                <div>
                  <strong>Private draft preview</strong>
                  <span>Admin view · not exposed on the public store link</span>
                </div>
                <button type="button" onClick={() => setPreview(null)}>
                  Close
                </button>
              </header>

              <div className={styles.previewCanvas}>
                <div className={styles.previewBanner}>
                  ADMIN PREVIEW — {preview.storefront.activation_status.replace(/_/g, " ")}
                </div>
                <header className={styles.previewStoreHead}>
                  <div className={styles.previewLogo}>
                    {preview.storefront.logo_url ? (
                      <img src={preview.storefront.logo_url} alt="Store logo" />
                    ) : (
                      preview.storefront.display_name.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2>{preview.storefront.display_name}</h2>
                    <p>
                      {preview.storefront.display_name_ar ||
                        preview.retailer?.direct_business_type?.replace(/_/g, " ") ||
                        "Darik Direct store"}
                    </p>
                  </div>
                </header>
                <section
                  className={styles.previewHero}
                  style={
                    preview.storefront.hero_image_url
                      ? {
                          backgroundImage: `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.45)),url(${JSON.stringify(preview.storefront.hero_image_url)})`,
                        }
                      : undefined
                  }
                >
                  <h1>{preview.storefront.display_name}</h1>
                  <p>
                    {preview.storefront.tagline ||
                      preview.storefront.tagline_ar ||
                      "Storefront tagline has not been added yet."}
                  </p>
                </section>
                <section className={styles.previewStats}>
                  <div>
                    <span>Delivery</span>
                    <strong>
                      {Number(preview.storefront.delivery_fee || 0).toFixed(2)} JOD
                    </strong>
                  </div>
                  <div>
                    <span>Minimum</span>
                    <strong>
                      {Number(preview.storefront.minimum_order || 0).toFixed(2)} JOD
                    </strong>
                  </div>
                  <div>
                    <span>Timing</span>
                    <strong>
                      {preview.storefront.estimated_delivery_minutes
                        ? `${preview.storefront.estimated_delivery_minutes} min`
                        : "Not set"}
                    </strong>
                  </div>
                  <div>
                    <span>Location</span>
                    <strong>{preview.retailer?.business_address || "Not set"}</strong>
                  </div>
                </section>
                {preview.categories.length ? (
                  <div className={styles.previewCategories}>
                    {preview.categories.slice(0, 8).map((category) => (
                      <span key={category.id}>{category.name_ar || category.name}</span>
                    ))}
                  </div>
                ) : null}
                <section className={styles.previewProducts}>
                  {preview.products
                    .filter((product) => product.storefront_visible !== false)
                    .slice(0, 12)
                    .map((product) => {
                      const image =
                        product.direct_photo_url ||
                        product.official_product_thumbnail_url;
                      return (
                        <article key={product.id}>
                          <div>
                            {image ? <img src={image} alt="" /> : <span>No image</span>}
                          </div>
                          <h3>{product.direct_name || product.name}</h3>
                          {product.direct_name_ar ? (
                            <p dir="rtl">{product.direct_name_ar}</p>
                          ) : null}
                          <strong>
                            {Number(
                              product.direct_price ?? product.app_price ?? 0,
                            ).toFixed(2)}{" "}
                            JOD
                          </strong>
                        </article>
                      );
                    })}
                </section>
                {!preview.products.length ? (
                  <div className={styles.previewEmpty}>
                    No products have been added to this draft yet.
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
