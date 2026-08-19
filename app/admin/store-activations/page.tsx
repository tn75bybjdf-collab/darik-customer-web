"use client";

// DARIK_PAYMENT_FIRST_YEARLY_PLANS_CATALOG_GATE_190

// DARIK_FRONTEND_ADMIN_MEMBERSHIP_CONTROL_CENTER_133

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

const TOKEN_KEY = "darik-admin-session-token";

type AdminUser = {
  id?: string;
  full_name: string;
  role: string;
  session_token: string;
  is_active?: boolean;
};

type ActivationRequestRow = {
  id: string;
  retailer_id: string;
  storefront_id: string;
  store_name: string;
  store_name_ar?: string | null;
  slug: string;
  business_type?: string | null;
  owner_name?: string | null;
  email?: string | null;
  phone?: string | null;
  business_address?: string | null;
  business_latitude?: number | null;
  business_longitude?: number | null;
  location_locked_at?: string | null;
  plan_code: string;
  amount_expected_jod: number | string;
  sender_name: string;
  cliq_reference?: string | null;
  receipt_path: string;
  request_status: string;
  retailer_note?: string | null;
  admin_note?: string | null;
  created_at: string;
  reviewed_at?: string | null;
  product_count: number;
  active_category_count: number;
};

type MembershipRow = {
  retailer_id: string;
  storefront_id: string;
  business_name: string;
  store_name: string;
  store_name_ar?: string | null;
  slug: string;
  retailer_number?: string | null;
  owner_name?: string | null;
  email?: string | null;
  phone?: string | null;
  business_type?: string | null;

  account_restricted: boolean;
  restriction_reason?: string | null;
  restriction_note?: string | null;
  restricted_at?: string | null;
  restricted_by_staff_name?: string | null;

  stored_activation_status: string;
  effective_status: string;
  activation_plan?: string | null;
  activation_started_at?: string | null;
  activation_expires_at?: string | null;
  activation_approved_at?: string | null;
  days_remaining?: number | null;

  storefront_status?: string | null;
  direct_storefront_enabled?: boolean | null;
  is_accepting_orders?: boolean | null;

  product_count: number;
  active_category_count: number;

  latest_paid_plan?: string | null;
  latest_paid_amount_jod?: number | string | null;
  latest_payment_approved_at?: string | null;
  access_source?: string | null;
};

type PreviewPayload = {
  storefront: {
    activation_status: string;
    primary_color?: string | null;
    accent_color?: string | null;
    background_color?: string | null;
    logo_url?: string | null;
    display_name: string;
    display_name_ar?: string | null;
    hero_image_url?: string | null;
    tagline?: string | null;
    tagline_ar?: string | null;
    delivery_fee?: number | string | null;
    minimum_order?: number | string | null;
    estimated_delivery_minutes?: number | null;
  };
  retailer?: {
    direct_business_type?: string | null;
    business_address?: string | null;
  } | null;
  categories: Array<{
    id: string;
    name: string;
    name_ar?: string | null;
  }>;
  products: Array<{
    id: string;
    name: string;
    direct_name?: string | null;
    direct_name_ar?: string | null;
    direct_photo_url?: string | null;
    official_product_thumbnail_url?: string | null;
    direct_price?: number | string | null;
    app_price?: number | string | null;
    storefront_visible?: boolean | null;
  }>;
};

type ReceiptPreview = {
  signedUrl: string;
  storeName: string;
  receiptPath: string;
  isPdf: boolean;
};

type ViewMode = "requests" | "members";
type RequestFilter =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_new_receipt"
  | "all";
type MembershipFilter =
  | "active"
  | "restricted"
  | "expired"
  | "suspended"
  | "draft"
  | "all";

function cleanStatus(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .replace(/_/g, " ");
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "No end date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString();
}

function dateInputValue(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function endOfLocalDayIso(value: string) {
  const clean = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) return null;

  const date = new Date(`${clean}T23:59:59.999`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function futureAccessIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

function membershipPlanLabel(row: MembershipRow) {
  const plan = row.activation_plan || row.latest_paid_plan || "";

  if (!plan) {
    if (row.access_source === "manual_or_trial") {
      return "Manual / free trial";
    }
    return "No paid plan";
  }

  const labels: Record<string, string> = {
    annual_1000: "300 JOD/year · up to 1,000 items",
    annual_3000: "400 JOD/year · up to 3,000 items",
    annual_10000: "500 JOD/year · up to 10,000 items",
    basic_monthly: "Legacy plan",
    basic_6_month: "Legacy plan",
    basic_12_month: "Legacy plan",
    premium_annual: "Legacy plan",
  };

  return labels[plan] || cleanStatus(plan);
}

function activationRequestPlanLabel190(code: string) {
  const labels: Record<string, string> = {
    annual_1000: "300 JOD/year · 1,000 items",
    annual_3000: "400 JOD/year · 3,000 items",
    annual_10000: "500 JOD/year · 10,000 items",
  };
  return labels[code] || cleanStatus(code);
}

function daysRemainingLabel(row: MembershipRow) {
  if (!row.activation_expires_at) return "No end date";

  const days = Number(row.days_remaining);
  if (!Number.isFinite(days)) return "End date set";

  if (days > 1) return `${days} days left`;
  if (days === 1) return "1 day left";
  if (days === 0) return "Expires today";
  if (days === -1) return "Expired 1 day ago";
  return `Expired ${Math.abs(days)} days ago`;
}

function membershipStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "active") return `${styles.memberStatus} ${styles.memberStatusActive}`;
  if (normalized === "restricted") {
    return `${styles.memberStatus} ${styles.memberStatusRestricted}`;
  }
  if (normalized === "expired") {
    return `${styles.memberStatus} ${styles.memberStatusExpired}`;
  }
  if (normalized === "suspended") {
    return `${styles.memberStatus} ${styles.memberStatusSuspended}`;
  }

  return `${styles.memberStatus} ${styles.memberStatusDraft}`;
}

export default function StoreActivationsAdminPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [viewMode, setViewMode] = useState<ViewMode>("requests");
  const [status, setStatus] = useState<RequestFilter>("pending");
  const [rows, setRows] = useState<ActivationRequestRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const [memberFilter, setMemberFilter] = useState<MembershipFilter>("active");
  const [memberRows, setMemberRows] = useState<MembershipRow[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberEndDates, setMemberEndDates] = useState<Record<string, string>>({});
  const [restrictionReasons, setRestrictionReasons] = useState<Record<string, string>>({});
  const [restrictionNotes, setRestrictionNotes] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [preview, setPreview] = useState<PreviewPayload | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<ReceiptPreview | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadRows = useCallback(
    async (sessionToken: string, nextStatus: RequestFilter) => {
      setLoading(true);
      setError("");

      const result = await supabase.rpc("darik_direct_admin_list_activation_requests", {
        p_session_token: sessionToken,
        p_status: nextStatus,
      });

      if (result.error) {
        setError(result.error.message);
        setRows([]);
      } else {
        setRows(
          Array.isArray(result.data)
            ? (result.data as ActivationRequestRow[])
            : []
        );
      }

      setLoading(false);
    },
    []
  );

  const loadMembers = useCallback(
    async (sessionToken: string, nextFilter: MembershipFilter) => {
      setLoading(true);
      setError("");

      const result = await supabase.rpc(
        "darik_direct_admin_list_store_memberships_v1",
        {
          p_session_token: sessionToken,
          p_filter: nextFilter,
        }
      );

      if (result.error) {
        setError(result.error.message);
        setMemberRows([]);
        setLoading(false);
        return;
      }

      const nextRows = Array.isArray(result.data)
        ? (result.data as MembershipRow[])
        : [];

      setMemberRows(nextRows);
      setMemberEndDates((current) => {
        const next = { ...current };
        nextRows.forEach((row) => {
          if (!(row.storefront_id in next)) {
            next[row.storefront_id] = dateInputValue(row.activation_expires_at);
          }
        });
        return next;
      });

      setRestrictionReasons((current) => {
        const next = { ...current };
        nextRows.forEach((row) => {
          if (!(row.storefront_id in next)) {
            next[row.storefront_id] = row.restriction_reason || "";
          }
        });
        return next;
      });

      setRestrictionNotes((current) => {
        const next = { ...current };
        nextRows.forEach((row) => {
          if (!(row.storefront_id in next)) {
            next[row.storefront_id] = row.restriction_note || "";
          }
        });
        return next;
      });

      setLoading(false);
    },
    []
  );

  async function login(event: FormEvent<HTMLFormElement>) {
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
    setViewMode("requests");
    setStatus("pending");
    await loadRows(next.session_token, "pending");
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
    setRows([]);
    setMemberRows([]);
    setPreview(null);
    setReceiptPreview(null);
    setMessage("");
    setError("");
  }

  async function changeRequestFilter(next: RequestFilter) {
    setStatus(next);
    if (admin) await loadRows(admin.session_token, next);
  }

  async function changeMemberFilter(next: MembershipFilter) {
    setMemberFilter(next);
    if (admin) await loadMembers(admin.session_token, next);
  }

  async function switchMode(nextMode: ViewMode) {
    setViewMode(nextMode);
    setError("");
    setMessage("");

    if (!admin) return;

    if (nextMode === "requests") {
      await loadRows(admin.session_token, status);
    } else {
      await loadMembers(admin.session_token, memberFilter);
    }
  }

  async function refreshCurrentView() {
    if (!admin) return;

    if (viewMode === "requests") {
      await loadRows(admin.session_token, status);
    } else {
      await loadMembers(admin.session_token, memberFilter);
    }
  }

  async function openReceipt(row: ActivationRequestRow) {
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

    const payload = (await response.json()) as {
      signedUrl?: string;
      error?: string;
    };

    setBusyId("");

    if (!response.ok || !payload.signedUrl) {
      setError(payload.error || "Could not open receipt.");
      return;
    }

    const cleanPath = String(row.receipt_path || "")
      .split("?")[0]
      .toLowerCase();

    setReceiptPreview({
      signedUrl: String(payload.signedUrl),
      storeName: row.store_name,
      receiptPath: row.receipt_path,
      isPdf: cleanPath.endsWith(".pdf"),
    });
  }

  async function openPrivatePreview(row: ActivationRequestRow) {
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

    const payload = (await response.json()) as {
      storefront?: PreviewPayload["storefront"];
      retailer?: PreviewPayload["retailer"];
      categories?: PreviewPayload["categories"];
      products?: PreviewPayload["products"];
      error?: string;
    };

    setBusyId("");

    if (!response.ok || !payload.storefront) {
      setError(payload.error || "Could not open the private storefront preview.");
      return;
    }

    setPreview({
      storefront: payload.storefront,
      retailer: payload.retailer || null,
      categories: Array.isArray(payload.categories) ? payload.categories : [],
      products: Array.isArray(payload.products) ? payload.products : [],
    });
  }

  async function reviewActivation(
    row: ActivationRequestRow,
    decision: "approve" | "reject" | "needs_new_receipt"
  ) {
    if (!admin) return;

    setBusyId(row.id);
    setError("");
    setMessage("");

    const reviewRpc190 = row.plan_code.startsWith("annual_")
      ? "darik_direct_admin_review_activation_v190"
      : "darik_direct_admin_review_activation";

    const result = await supabase.rpc(reviewRpc190, {
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
        : `${row.store_name} activation was returned to the retailer.`
    );

    await loadRows(admin.session_token, status);
  }

  async function runMembershipAction(
    row: MembershipRow,
    action: "set_end_date" | "expire_now" | "restrict" | "unrestrict",
    options?: {
      expiresAt?: string | null;
      reason?: string | null;
      note?: string | null;
      successMessage?: string;
    }
  ) {
    if (!admin) return;

    setBusyId(row.storefront_id);
    setError("");
    setMessage("");

    const result = await supabase.rpc(
      "darik_direct_admin_update_store_membership_v1",
      {
        p_session_token: admin.session_token,
        p_storefront_id: row.storefront_id,
        p_action: action,
        p_expires_at: options?.expiresAt || null,
        p_reason: options?.reason || null,
        p_note: options?.note || null,
      }
    );

    setBusyId("");

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage(
      options?.successMessage ||
        `${row.store_name || row.business_name} membership updated.`
    );

    await loadMembers(admin.session_token, memberFilter);
  }

  async function saveMemberEndDate(row: MembershipRow) {
    const dateValue = memberEndDates[row.storefront_id] || "";
    const expiresAt = endOfLocalDayIso(dateValue);

    if (!expiresAt) {
      setError("Choose a valid end date first.");
      return;
    }

    const pretty = new Date(expiresAt).toLocaleString();
    const confirmed = window.confirm(
      `Set ${row.store_name || row.business_name} access end date to ${pretty}?\n\nIf the date is in the future, Darik will activate/re-activate the storefront immediately. No payment request is created.`
    );

    if (!confirmed) return;

    await runMembershipAction(row, "set_end_date", {
      expiresAt,
      note: "Custom membership end date set from Darik activation admin.",
      successMessage: `${row.store_name || row.business_name} now ends ${pretty}.`,
    });
  }

  async function grantTrial(row: MembershipRow, days: number) {
    const expiresAt = futureAccessIso(days);
    const pretty = new Date(expiresAt).toLocaleString();

    const confirmed = window.confirm(
      `Grant ${days} days of access to ${row.store_name || row.business_name}?\n\nThis activates the storefront immediately through ${pretty} without creating a payment request.`
    );

    if (!confirmed) return;

    await runMembershipAction(row, "set_end_date", {
      expiresAt,
      reason: "Complimentary access",
      note: `${days}-day manual/free access granted by Darik admin.`,
      successMessage: `${days}-day access granted to ${row.store_name || row.business_name}.`,
    });
  }

  async function expireMemberNow(row: MembershipRow) {
    const confirmed = window.confirm(
      `Expire ${row.store_name || row.business_name} now?\n\nThe public storefront will stop being available immediately.`
    );

    if (!confirmed) return;

    await runMembershipAction(row, "expire_now", {
      reason: "Expired by admin",
      note: "Membership ended immediately from Darik activation admin.",
      successMessage: `${row.store_name || row.business_name} expired now.`,
    });
  }

  async function restrictMember(row: MembershipRow) {
    const reason = (restrictionReasons[row.storefront_id] || "").trim();
    const note = (restrictionNotes[row.storefront_id] || "").trim();

    if (!reason) {
      setError("Enter a restriction reason before restricting this account.");
      return;
    }

    const confirmed = window.confirm(
      `Restrict ${row.store_name || row.business_name}?\n\nTheir storefront will stop accepting orders and will be removed from public Darik storefront results. Their current end date is preserved.`
    );

    if (!confirmed) return;

    await runMembershipAction(row, "restrict", {
      reason,
      note: note || null,
      successMessage: `${row.store_name || row.business_name} is restricted.`,
    });
  }

  async function unrestrictMember(row: MembershipRow) {
    const confirmed = window.confirm(
      `Remove the restriction from ${row.store_name || row.business_name}?\n\nIf their access end date is still valid, the storefront will become available again.`
    );

    if (!confirmed) return;

    await runMembershipAction(row, "unrestrict", {
      reason: "Restriction removed",
      note: "Restriction removed from Darik activation admin.",
      successMessage: `${row.store_name || row.business_name} restriction removed.`,
    });
  }

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_KEY);

    if (!savedToken) {
      setLoading(false);
      return;
    }

    supabase
      .rpc("darik_admin_get_user_by_session", {
        p_session_token: savedToken,
      })
      .then(async (result) => {
        const user = Array.isArray(result.data) ? result.data[0] : null;

        if (!user) {
          window.localStorage.removeItem(TOKEN_KEY);
          setLoading(false);
          return;
        }

        const next = user as AdminUser;
        setAdmin(next);
        setViewMode("requests");
        await loadRows(savedToken, "pending");
      });
  }, [loadRows]);

  useEffect(() => {
    if (!preview && !receiptPreview) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (receiptPreview) setReceiptPreview(null);
      else setPreview(null);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = oldOverflow;
    };
  }, [preview, receiptPreview]);

  const expectedCliqTotal = useMemo(
    () =>
      rows.reduce(
        (total, row) => total + Number(row.amount_expected_jod || 0),
        0
      ),
    [rows]
  );

  const visibleMemberRows = useMemo(() => {
    const search = memberSearch.trim().toLowerCase();
    if (!search) return memberRows;

    return memberRows.filter((row) =>
      [
        row.store_name,
        row.business_name,
        row.slug,
        row.email,
        row.phone,
        row.retailer_number,
        row.owner_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [memberRows, memberSearch]);

  const activeMemberCount = useMemo(
    () =>
      memberRows.filter(
        (row) =>
          row.effective_status === "active" && !row.account_restricted
      ).length,
    [memberRows]
  );

  const restrictedMemberCount = useMemo(
    () => memberRows.filter((row) => row.account_restricted).length,
    [memberRows]
  );

  const expiringSoonCount = useMemo(
    () =>
      memberRows.filter((row) => {
        const days = Number(row.days_remaining);
        return (
          row.effective_status === "active" &&
          Number.isFinite(days) &&
          days >= 0 &&
          days <= 7
        );
      }).length,
    [memberRows]
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
              {loading ? "Signing in..." : "Sign in"}
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
            <h1>Store activation & memberships</h1>
            <p>
              Signed in as {admin.full_name} · {admin.role}
            </p>
          </div>

          <div className={styles.headerActions}>
            <button type="button" onClick={() => void refreshCurrentView()}>
              Refresh
            </button>
            <button type="button" onClick={logout}>
              Sign out
            </button>
          </div>
        </header>

        <section className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeTab} ${
              viewMode === "requests" ? styles.modeTabActive : ""
            }`}
            onClick={() => void switchMode("requests")}
          >
            Payment requests
          </button>
          <button
            type="button"
            className={`${styles.modeTab} ${
              viewMode === "members" ? styles.modeTabActive : ""
            }`}
            onClick={() => void switchMode("members")}
          >
            Members & trials
          </button>
        </section>

        {error ? <div className={styles.error}>{error}</div> : null}
        {message ? <div className={styles.success}>{message}</div> : null}

        {viewMode === "requests" ? (
          <>
            <section className={styles.metrics}>
              <article className={styles.metric}>
                <span>Requests shown</span>
                <strong>{rows.length}</strong>
              </article>
              <article className={styles.metric}>
                <span>Expected CliQ total</span>
                <strong>{expectedCliqTotal.toFixed(2)} JOD</strong>
              </article>
              <article className={styles.metric}>
                <span>Current filter</span>
                <strong>{cleanStatus(status)}</strong>
              </article>
            </section>

            <section className={styles.filters}>
              <strong>Show</strong>
              <select
                value={status}
                onChange={(event) =>
                  void changeRequestFilter(event.target.value as RequestFilter)
                }
              >
                <option value="pending">Pending review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_new_receipt">Needs new receipt</option>
                <option value="all">All requests</option>
              </select>
            </section>

            <section className={styles.list}>
              {loading ? (
                <div className={styles.empty}>Loading activation requests...</div>
              ) : rows.length ? (
                rows.map((row) => (
                  <article className={styles.card} key={row.id}>
                    <header className={styles.cardHead}>
                      <div>
                        <h2>{row.store_name}</h2>
                        <p>
                          getdarik.com/{row.slug} · submitted{" "}
                          {new Date(row.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={styles.badge}>
                        {cleanStatus(row.request_status)}
                      </span>
                    </header>

                    <div className={styles.body}>
                      <div className={styles.details}>
                        <div className={styles.detail}>
                          <span>Plan / amount</span>
                          <strong>
                            {activationRequestPlanLabel190(row.plan_code)} ·{" "}
                            {Number(row.amount_expected_jod).toFixed(2)} JOD
                          </strong>
                        </div>

                        <div className={styles.detail}>
                          <span>CliQ sender</span>
                          <strong>
                            {row.sender_name}
                            {row.cliq_reference
                              ? ` · ${row.cliq_reference}`
                              : ""}
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
                          <strong>
                            {row.business_type
                              ? cleanStatus(row.business_type)
                              : "Other"}
                          </strong>
                        </div>

                        <div className={styles.detail}>
                          <span>Setup</span>
                          <strong>
                            {row.product_count} products ·{" "}
                            {row.active_category_count} categories
                          </strong>
                        </div>

                        <div className={styles.detail}>
                          <span>Locked location</span>
                          <strong>{row.business_address || "—"}</strong>
                        </div>

                        <div className={styles.detail}>
                          <span>Coordinates</span>
                          <strong>
                            {row.business_latitude ?? "—"},{" "}
                            {row.business_longitude ?? "—"}
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
                          type="button"
                          className={styles.receipt}
                          onClick={() => void openPrivatePreview(row)}
                          disabled={busyId === row.id}
                        >
                          {busyId === row.id
                            ? "Opening..."
                            : "Preview private storefront"}
                        </button>

                        <button
                          type="button"
                          className={styles.receipt}
                          onClick={() => void openReceipt(row)}
                          disabled={busyId === row.id}
                        >
                          {busyId === row.id
                            ? "Opening..."
                            : "View receipt picture"}
                        </button>

                        {row.business_latitude != null &&
                        row.business_longitude != null ? (
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
                          href={`/${row.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View public Coming Soon page
                        </a>

                        {row.request_status === "pending" ? (
                          <>
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
                              type="button"
                              className={styles.approve}
                              onClick={() =>
                                void reviewActivation(row, "approve")
                              }
                              disabled={busyId === row.id}
                            >
                              Approve and publish
                            </button>

                            <button
                              type="button"
                              className={styles.reject}
                              onClick={() =>
                                void reviewActivation(row, "needs_new_receipt")
                              }
                              disabled={busyId === row.id}
                            >
                              Request new receipt
                            </button>

                            <button
                              type="button"
                              className={styles.reject}
                              onClick={() =>
                                void reviewActivation(row, "reject")
                              }
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
                <div className={styles.empty}>
                  No activation requests match this filter.
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <section className={`${styles.metrics} ${styles.membershipMetrics}`}>
              <article className={styles.metric}>
                <span>Members shown</span>
                <strong>{memberRows.length}</strong>
              </article>
              <article className={styles.metric}>
                <span>Active now</span>
                <strong>{activeMemberCount}</strong>
              </article>
              <article className={styles.metric}>
                <span>Expiring in 7 days</span>
                <strong>{expiringSoonCount}</strong>
              </article>
              <article className={styles.metric}>
                <span>Restricted</span>
                <strong>{restrictedMemberCount}</strong>
              </article>
            </section>

            <section className={`${styles.filters} ${styles.memberFilters}`}>
              <div className={styles.memberFilterGroup}>
                <strong>Show</strong>
                <select
                  value={memberFilter}
                  onChange={(event) =>
                    void changeMemberFilter(
                      event.target.value as MembershipFilter
                    )
                  }
                >
                  <option value="active">Active members</option>
                  <option value="restricted">Restricted</option>
                  <option value="expired">Expired</option>
                  <option value="suspended">Suspended</option>
                  <option value="draft">Free / not activated</option>
                  <option value="all">All retailer accounts</option>
                </select>
              </div>

              <label className={styles.memberSearch}>
                Search
                <input
                  type="search"
                  value={memberSearch}
                  onChange={(event) => setMemberSearch(event.target.value)}
                  placeholder="Store, owner, email, phone, slug..."
                />
              </label>
            </section>

            <section className={styles.memberList}>
              {loading ? (
                <div className={styles.empty}>Loading memberships...</div>
              ) : visibleMemberRows.length ? (
                visibleMemberRows.map((row) => {
                  const isBusy = busyId === row.storefront_id;

                  return (
                    <article className={styles.memberCard} key={row.storefront_id}>
                      <header className={styles.memberCardHead}>
                        <div>
                          <div className={styles.memberTitleRow}>
                            <h2>{row.store_name || row.business_name}</h2>
                            <span
                              className={membershipStatusClass(
                                row.effective_status
                              )}
                            >
                              {cleanStatus(row.effective_status)}
                            </span>
                          </div>
                          <p>
                            getdarik.com/{row.slug}
                            {row.retailer_number
                              ? ` · Retailer ${row.retailer_number}`
                              : ""}
                          </p>
                        </div>

                        <a
                          className={styles.memberOpenStore}
                          href={`/${row.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open store
                        </a>
                      </header>

                      <div className={styles.memberGrid}>
                        <section className={styles.memberInfoPanel}>
                          <h3>Membership</h3>

                          <div className={styles.memberFact}>
                            <span>Access</span>
                            <strong>{membershipPlanLabel(row)}</strong>
                          </div>

                          <div className={styles.memberFact}>
                            <span>Ends</span>
                            <strong>
                              {formatDateTime(row.activation_expires_at)}
                            </strong>
                          </div>

                          <div className={styles.memberFact}>
                            <span>Time remaining</span>
                            <strong>{daysRemainingLabel(row)}</strong>
                          </div>

                          <div className={styles.memberFact}>
                            <span>Started</span>
                            <strong>
                              {row.activation_started_at
                                ? formatDateTime(row.activation_started_at)
                                : "—"}
                            </strong>
                          </div>

                          <div className={styles.memberFact}>
                            <span>Owner</span>
                            <strong>{row.owner_name || "—"}</strong>
                          </div>

                          <div className={styles.memberFact}>
                            <span>Contact</span>
                            <strong>
                              {row.email || "—"}
                              <br />
                              {row.phone || "—"}
                            </strong>
                          </div>

                          <div className={styles.memberFact}>
                            <span>Catalog</span>
                            <strong>
                              {row.product_count} products ·{" "}
                              {row.active_category_count} categories
                            </strong>
                          </div>

                          {row.latest_payment_approved_at ? (
                            <div className={styles.memberFact}>
                              <span>Latest paid activation</span>
                              <strong>
                                {row.latest_paid_amount_jod != null
                                  ? `${Number(
                                      row.latest_paid_amount_jod
                                    ).toFixed(2)} JOD · `
                                  : ""}
                                {formatDateTime(
                                  row.latest_payment_approved_at
                                )}
                              </strong>
                            </div>
                          ) : null}
                        </section>

                        <section className={styles.memberAccessPanel}>
                          <div>
                            <span className={styles.memberPanelKicker}>
                              ACCESS END DATE
                            </span>
                            <h3>Change end date</h3>
                            <p>
                              A future date activates the store immediately.
                              This can be used for free trials, complimentary
                              access, or manual extensions without a fake payment.
                            </p>
                          </div>

                          <label className={styles.memberDateField}>
                            End date
                            <input
                              type="date"
                              value={
                                memberEndDates[row.storefront_id] ||
                                dateInputValue(row.activation_expires_at)
                              }
                              onChange={(event) =>
                                setMemberEndDates((current) => ({
                                  ...current,
                                  [row.storefront_id]: event.target.value,
                                }))
                              }
                            />
                          </label>

                          <button
                            type="button"
                            className={styles.memberPrimaryButton}
                            disabled={isBusy}
                            onClick={() => void saveMemberEndDate(row)}
                          >
                            Save end date
                          </button>

                          <div className={styles.trialButtons}>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void grantTrial(row, 7)}
                            >
                              7-day trial
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void grantTrial(row, 14)}
                            >
                              14-day trial
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void grantTrial(row, 30)}
                            >
                              30-day trial
                            </button>
                          </div>

                          <button
                            type="button"
                            className={styles.memberExpireButton}
                            disabled={isBusy}
                            onClick={() => void expireMemberNow(row)}
                          >
                            Expire now
                          </button>
                        </section>

                        <section className={styles.memberRestrictionPanel}>
                          <div>
                            <span className={styles.memberPanelKicker}>
                              ACCOUNT CONTROL
                            </span>
                            <h3>
                              {row.account_restricted
                                ? "Account restricted"
                                : "Restrict account"}
                            </h3>
                            <p>
                              Restriction preserves the membership end date but
                              removes the store from public Darik access and stops
                              order acceptance.
                            </p>
                          </div>

                          {row.account_restricted ? (
                            <>
                              <div className={styles.restrictionSummary}>
                                <span>Reason</span>
                                <strong>
                                  {row.restriction_reason || "Admin restriction"}
                                </strong>
                                {row.restriction_note ? (
                                  <p>{row.restriction_note}</p>
                                ) : null}
                                {row.restricted_by_staff_name ? (
                                  <small>
                                    By {row.restricted_by_staff_name}
                                    {row.restricted_at
                                      ? ` · ${formatDateTime(row.restricted_at)}`
                                      : ""}
                                  </small>
                                ) : null}
                              </div>

                              <button
                                type="button"
                                className={styles.memberRestoreButton}
                                disabled={isBusy}
                                onClick={() => void unrestrictMember(row)}
                              >
                                Remove restriction
                              </button>
                            </>
                          ) : (
                            <>
                              <label className={styles.memberTextField}>
                                Restriction reason
                                <input
                                  type="text"
                                  value={
                                    restrictionReasons[row.storefront_id] || ""
                                  }
                                  onChange={(event) =>
                                    setRestrictionReasons((current) => ({
                                      ...current,
                                      [row.storefront_id]: event.target.value,
                                    }))
                                  }
                                  placeholder="Example: payment issue"
                                />
                              </label>

                              <label className={styles.memberTextField}>
                                Admin note
                                <textarea
                                  rows={3}
                                  value={
                                    restrictionNotes[row.storefront_id] || ""
                                  }
                                  onChange={(event) =>
                                    setRestrictionNotes((current) => ({
                                      ...current,
                                      [row.storefront_id]: event.target.value,
                                    }))
                                  }
                                  placeholder="Optional internal note"
                                />
                              </label>

                              <button
                                type="button"
                                className={styles.memberRestrictButton}
                                disabled={isBusy}
                                onClick={() => void restrictMember(row)}
                              >
                                Restrict account
                              </button>
                            </>
                          )}
                        </section>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={styles.empty}>
                  No retailer memberships match this filter.
                </div>
              )}
            </section>
          </>
        )}

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
                } as CSSProperties & Record<string, string>
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
                  ADMIN PREVIEW —{" "}
                  {cleanStatus(preview.storefront.activation_status)}
                </div>

                <header className={styles.previewStoreHead}>
                  <div className={styles.previewLogo}>
                    {preview.storefront.logo_url ? (
                      <img
                        src={preview.storefront.logo_url}
                        alt="Store logo"
                      />
                    ) : (
                      preview.storefront.display_name.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2>{preview.storefront.display_name}</h2>
                    <p>
                      {preview.storefront.display_name_ar ||
                        preview.retailer?.direct_business_type?.replace(
                          /_/g,
                          " "
                        ) ||
                        "Darik Direct store"}
                    </p>
                  </div>
                </header>

                <section
                  className={styles.previewHero}
                  style={
                    preview.storefront.hero_image_url
                      ? {
                          backgroundImage: `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.45)),url(${JSON.stringify(
                            preview.storefront.hero_image_url
                          )})`,
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
                      {Number(
                        preview.storefront.delivery_fee || 0
                      ).toFixed(2)}{" "}
                      JOD
                    </strong>
                  </div>
                  <div>
                    <span>Minimum</span>
                    <strong>
                      {Number(
                        preview.storefront.minimum_order || 0
                      ).toFixed(2)}{" "}
                      JOD
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
                    <strong>
                      {preview.retailer?.business_address || "Not set"}
                    </strong>
                  </div>
                </section>

                {preview.categories.length ? (
                  <div className={styles.previewCategories}>
                    {preview.categories.slice(0, 8).map((category) => (
                      <span key={category.id}>
                        {category.name_ar || category.name}
                      </span>
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
                            {image ? (
                              <img src={image} alt="" />
                            ) : (
                              <span>No image</span>
                            )}
                          </div>
                          <h3>{product.direct_name || product.name}</h3>
                          {product.direct_name_ar ? (
                            <p dir="rtl">{product.direct_name_ar}</p>
                          ) : null}
                          <strong>
                            {Number(
                              product.direct_price ?? product.app_price ?? 0
                            ).toFixed(2)}{" "}
                            JOD
                          </strong>
                        </article>
                      );
                    })}
                </section>

                {preview.products.length ? null : (
                  <div className={styles.previewEmpty}>
                    No products have been added to this draft yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : null}

        {receiptPreview ? (
          <div
            className={styles.receiptBackdrop}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setReceiptPreview(null);
              }
            }}
          >
            <section
              className={styles.receiptModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="receipt-preview-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <header className={styles.receiptToolbar}>
                <div>
                  <strong id="receipt-preview-title">
                    CliQ receipt · {receiptPreview.storeName}
                  </strong>
                  <span>Private activation document</span>
                </div>

                <div className={styles.receiptToolbarActions}>
                  <a
                    href={receiptPreview.signedUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in new tab
                  </a>
                  <button
                    type="button"
                    onClick={() => setReceiptPreview(null)}
                  >
                    Close
                  </button>
                </div>
              </header>

              <div className={styles.receiptViewer}>
                {receiptPreview.isPdf ? (
                  <iframe
                    src={receiptPreview.signedUrl}
                    title={`CliQ receipt for ${receiptPreview.storeName}`}
                  />
                ) : (
                  <img
                    src={receiptPreview.signedUrl}
                    alt={`CliQ receipt for ${receiptPreview.storeName}`}
                  />
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
