import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Darik Tech Quote Requests | Darik Admin",
};

type QuoteRequest = {
  id: string;
  created_at: string;
  updated_at: string;
  status: "new" | "reviewing" | "contacted" | "won" | "closed" | string;
  full_name: string;
  company: string | null;
  email: string | null;
  whatsapp: string | null;
  country: string | null;
  preferred_contact: string | null;
  project_type: string | null;
  build_needed: string[] | null;
  budget_range: string | null;
  timeline: string | null;
  reference_link: string | null;
  project_idea: string | null;
  main_users: string | null;
  important_features: string | null;
  extra_notes: string | null;
  source: string | null;
  admin_notes: string | null;
};

type TabKey = "active" | "reviewing" | "closed";

type PageProps = {
  searchParams?:
    | Promise<{ pin?: string | string[]; tab?: string | string[] }>
    | { pin?: string | string[]; tab?: string | string[] };
};

const quoteAccessCookie = "dariktech_quotes_access";

const tabOptions: { value: TabKey; label: string; description: string }[] = [
  {
    value: "active",
    label: "Active",
    description: "New leads and contacted leads that are still alive.",
  },
  {
    value: "reviewing",
    label: "Reviewing",
    description: "Quotes you are currently checking or preparing.",
  },
  {
    value: "closed",
    label: "Closed",
    description: "Finished, won, rejected, or old quote requests.",
  },
];

const statusOptions = [
  { value: "new", label: "Active / New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "contacted", label: "Active / Contacted" },
  { value: "won", label: "Closed / Won" },
  { value: "closed", label: "Closed" },
];

function getAdminPin() {
  return (
    process.env.DARIKTECH_QUOTES_PIN || process.env.ADMIN_QUOTES_PIN || "1414"
  );
}

function quoteAccessToken() {
  const pin = getAdminPin();
  const salt =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "dariktech-local";

  return createHmac("sha256", `${pin}:${salt}`)
    .update("dariktech-quotes-admin-access")
    .digest("hex");
}

function safeCompare(left: string, right: string) {
  try {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) return false;
    return timingSafeEqual(leftBuffer, rightBuffer);
  } catch {
    return false;
  }
}

async function hasQuoteAccess() {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(quoteAccessCookie)?.value || "";

  return safeCompare(currentToken, quoteAccessToken());
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  return { url, serviceKey };
}

async function supabaseFetch(path: string, init?: RequestInit) {
  const { url, serviceKey } = getSupabaseConfig();

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.",
    );
  }

  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

async function getQuotes() {
  const response = await supabaseFetch(
    "dariktech_quote_requests?select=*&order=created_at.desc&limit=200",
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Could not load quote requests. ${details}`);
  }

  return (await response.json()) as QuoteRequest[];
}

async function unlockQuotes(formData: FormData) {
  "use server";

  const pin = String(formData.get("pin") || "").trim();

  if (pin !== getAdminPin()) {
    redirect("/admin/dariktech-quotes?pin=wrong");
  }

  const cookieStore = await cookies();
  cookieStore.set(quoteAccessCookie, quoteAccessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin/dariktech-quotes");
}

async function lockQuotes() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.set(quoteAccessCookie, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });

  redirect("/admin/dariktech-quotes");
}

async function updateQuote(formData: FormData) {
  "use server";

  const allowed = await hasQuoteAccess();

  if (!allowed) {
    redirect("/admin/dariktech-quotes?pin=required");
  }

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "new");
  const adminNotes = String(formData.get("admin_notes") || "").trim();

  if (!id) return;

  const allowedStatuses = new Set(statusOptions.map((option) => option.value));
  const safeStatus = allowedStatuses.has(status) ? status : "new";

  const response = await supabaseFetch(
    `dariktech_quote_requests?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: safeStatus,
        admin_notes: adminNotes || null,
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Could not update quote request. ${details}`);
  }

  revalidatePath("/admin/dariktech-quotes");
  revalidatePath(`/admin/dariktech-quotes/${id}/invoice`);
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusLabel(value: string) {
  return statusOptions.find((option) => option.value === value)?.label || value;
}

function quoteNumber(id: string) {
  return `DTQ-${id.slice(0, 8).toUpperCase()}`;
}

function waLink(value: string | null) {
  if (!value) return "";
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

function emailLink(quote: QuoteRequest) {
  if (!quote.email) return "";
  const subject = encodeURIComponent(
    `Darik Technologies quote request ${quoteNumber(quote.id)}`,
  );
  const body = encodeURIComponent(
    `Hi ${quote.full_name},\n\nThank you for requesting a quote from Darik Technologies.\n\nI am reviewing your project and will follow up with next steps.\n\nBest,\nDarik Technologies`,
  );

  return `mailto:${quote.email}?subject=${subject}&body=${body}`;
}

function invoiceEmailLink(quote: QuoteRequest) {
  const subject = encodeURIComponent(
    `Darik Technologies quote invoice ${quoteNumber(quote.id)}`,
  );
  const body = encodeURIComponent(
    `Hi ${quote.full_name},\n\nAttached is the professional quote PDF for your project.\n\nBest,\nDarik Technologies`,
  );

  return `mailto:${quote.email || ""}?subject=${subject}&body=${body}`;
}

function stat(quotes: QuoteRequest[], tab: TabKey) {
  return quotes.filter((quote) => quoteTab(quote) === tab).length;
}

function quoteTab(quote: QuoteRequest): TabKey {
  const status = String(quote.status || "new").toLowerCase();

  if (status === "reviewing") return "reviewing";
  if (status === "closed" || status === "won") return "closed";

  return "active";
}

function getPinState(params?: { pin?: string | string[] }) {
  const pin = Array.isArray(params?.pin) ? params?.pin[0] : params?.pin;
  return pin || "";
}

function getTabState(params?: { tab?: string | string[] }): TabKey {
  const tab = Array.isArray(params?.tab) ? params?.tab[0] : params?.tab;
  return tab === "reviewing" || tab === "closed" ? tab : "active";
}

export default async function DarikTechAdminQuotesPage({
  searchParams,
}: PageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const pinState = getPinState(resolvedParams);
  const activeTab = getTabState(resolvedParams);
  const unlocked = await hasQuoteAccess();

  if (!unlocked) {
    return <PinGate pinState={pinState} />;
  }

  let quotes: QuoteRequest[] = [];
  let error = "";

  try {
    quotes = await getQuotes();
  } catch (caught) {
    error =
      caught instanceof Error
        ? caught.message
        : "Could not load quote requests.";
  }

  const visibleQuotes = quotes.filter((quote) => quoteTab(quote) === activeTab);
  const currentTab = tabOptions.find((tab) => tab.value === activeTab) || tabOptions[0];

  const stats = [
    { label: "Total requests", value: quotes.length },
    { label: "Active", value: stat(quotes, "active") },
    { label: "Reviewing", value: stat(quotes, "reviewing") },
    { label: "Closed", value: stat(quotes, "closed") },
  ];

  return (
    <main className="admin-page">
      <section className="topbar">
        <div>
          <p className="eyebrow">Darik Technologies</p>
          <h1>Quote Requests</h1>
          <p className="subtitle">
            Review new quote submissions, move them through Active, Reviewing,
            and Closed tabs, then open a professional quote invoice page for PDF
            export and email.
          </p>
        </div>
        <div className="top-actions">
          <a
            className="public-link"
            href="/dariktech/quote"
            target="_blank"
            rel="noreferrer"
          >
            Open quote form
          </a>
          <form action={lockQuotes}>
            <button className="lock-button" type="submit">
              Lock quotes
            </button>
          </form>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      <nav className="quote-tabs" aria-label="Quote status tabs">
        {tabOptions.map((tab) => {
          const count = stat(quotes, tab.value);
          const href =
            tab.value === "active"
              ? "/admin/dariktech-quotes"
              : `/admin/dariktech-quotes?tab=${tab.value}`;

          return (
            <a
              className={`quote-tab ${activeTab === tab.value ? "is-active" : ""}`}
              href={href}
              key={tab.value}
            >
              <span>{tab.label}</span>
              <strong>{count}</strong>
              <small>{tab.description}</small>
            </a>
          );
        })}
      </nav>

      {error ? (
        <section className="error-card">
          <h2>Quote dashboard is not connected yet.</h2>
          <p>{error}</p>
          <p>
            Run the Supabase SQL file first, then add the service role
            environment variable in Vercel or your local .env.local file.
          </p>
        </section>
      ) : quotes.length === 0 ? (
        <section className="empty-card">
          <h2>No quote requests yet.</h2>
          <p>
            When someone submits the Darik Technologies quote form, it will
            appear here.
          </p>
        </section>
      ) : visibleQuotes.length === 0 ? (
        <section className="empty-card">
          <h2>No {currentTab.label.toLowerCase()} quote requests.</h2>
          <p>
            This tab is empty. Move a quote into {currentTab.label} using the
            status selector on any quote card.
          </p>
        </section>
      ) : (
        <section className="quote-list">
          <div className="section-label">
            <div>
              <p className="eyebrow">{currentTab.label} quotes</p>
              <h2>{visibleQuotes.length} request{visibleQuotes.length === 1 ? "" : "s"}</h2>
            </div>
            <p>{currentTab.description}</p>
          </div>

          {visibleQuotes.map((quote) => {
            const whatsappHref = waLink(quote.whatsapp);
            const emailHref = emailLink(quote);
            const invoiceHref = `/admin/dariktech-quotes/${quote.id}/invoice`;
            const invoiceEmailHref = invoiceEmailLink(quote);

            return (
              <article
                className={`quote-card status-${quote.status}`}
                key={quote.id}
              >
                <div className="quote-main">
                  <div className="quote-head">
                    <div>
                      <div className="quote-meta-row">
                        <span className="status-pill">
                          {statusLabel(quote.status)}
                        </span>
                        <span className="quote-number">{quoteNumber(quote.id)}</span>
                      </div>
                      <h2>{quote.full_name}</h2>
                      <p className="muted">
                        {quote.company || "No company listed"} ·{" "}
                        {formatDate(quote.created_at)}
                      </p>
                    </div>
                    <div className="contact-actions">
                      <a className="invoice-link" href={invoiceHref}>
                        Open invoice
                      </a>
                      {quote.email ? (
                        <a href={invoiceEmailHref}>Email PDF</a>
                      ) : null}
                      {whatsappHref ? (
                        <a href={whatsappHref} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      ) : null}
                      {emailHref ? <a href={emailHref}>Email</a> : null}
                    </div>
                  </div>

                  <div className="info-grid">
                    <Info label="WhatsApp" value={quote.whatsapp} />
                    <Info label="Email" value={quote.email} />
                    <Info label="Country" value={quote.country} />
                    <Info
                      label="Preferred contact"
                      value={quote.preferred_contact}
                    />
                    <Info label="Project type" value={quote.project_type} />
                    <Info label="Budget" value={quote.budget_range} />
                    <Info label="Timeline" value={quote.timeline} />
                    <Info
                      label="Reference"
                      value={quote.reference_link}
                      isLink
                    />
                  </div>

                  {quote.build_needed?.length ? (
                    <div className="tag-row">
                      {quote.build_needed.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  ) : null}

                  <Detail title="Project idea" value={quote.project_idea} />
                  <Detail title="Main users" value={quote.main_users} />
                  <Detail
                    title="Important features"
                    value={quote.important_features}
                  />
                  <Detail title="Extra notes" value={quote.extra_notes} />
                </div>

                <form className="admin-panel" action={updateQuote}>
                  <input name="id" type="hidden" value={quote.id} />

                  <div className="invoice-box">
                    <span>Professional PDF</span>
                    <strong>Quote invoice page ready</strong>
                    <p>
                      Open the invoice, print or save as PDF, then attach it to
                      the email.
                    </p>
                    <a href={invoiceHref}>Open invoice page</a>
                  </div>

                  <label>
                    Status
                    <select name="status" defaultValue={quote.status}>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Admin notes
                    <textarea
                      name="admin_notes"
                      defaultValue={quote.admin_notes || ""}
                      placeholder="Example: Asked for screenshots. Wants MVP first. Follow up Monday."
                      rows={7}
                    />
                  </label>
                  <button type="submit">Save admin update</button>
                </form>
              </article>
            );
          })}
        </section>
      )}

      <AdminStyles />
    </main>
  );
}

function PinGate({ pinState }: { pinState: string }) {
  const message =
    pinState === "wrong"
      ? "Wrong PIN. Try again."
      : pinState === "required"
        ? "Enter the admin PIN to continue."
        : "This page is locked before quote requests are shown.";

  return (
    <main className="pin-page">
      <section className="pin-card">
        <div className="pin-logo-wrap">
          <img src="/dariktech/logo.png" alt="Darik Technologies" />
        </div>
        <p className="eyebrow">Darik Admin</p>
        <h1>Quote Requests Locked</h1>
        <p className="pin-subtitle">
          Enter the PIN to view Darik Technologies free quote submissions and
          client contact details.
        </p>

        {pinState ? <div className="pin-error">{message}</div> : null}

        <form className="pin-form" action={unlockQuotes}>
          <label htmlFor="pin">Admin PIN</label>
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Enter PIN"
            autoFocus
            required
          />
          <button type="submit">Unlock quotes</button>
        </form>

        <p className="pin-meta">
          Access stays unlocked on this device for 8 hours. Use “Lock quotes”
          when you are done.
        </p>
      </section>
      <AdminStyles />
    </main>
  );
}

function AdminStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #f4f6fb;
      }

      .admin-page,
      .pin-page {
        min-height: 100vh;
        color: #111827;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.13), transparent 26rem),
          #f4f6fb;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .admin-page {
        padding: 34px;
      }

      .pin-page {
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .pin-card {
        width: min(480px, 100%);
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.94);
        border-radius: 34px;
        box-shadow: 0 30px 90px rgba(15, 23, 42, 0.14);
        padding: 34px;
        text-align: center;
      }

      .pin-logo-wrap {
        width: 74px;
        height: 74px;
        border-radius: 24px;
        display: grid;
        place-items: center;
        margin: 0 auto 18px;
        background: #0b1220;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
        overflow: hidden;
      }

      .pin-logo-wrap img {
        width: 52px;
        height: 52px;
        object-fit: contain;
      }

      .pin-card h1 {
        font-size: clamp(34px, 7vw, 48px);
        line-height: 0.96;
        letter-spacing: -0.06em;
        margin: 0 0 14px;
      }

      .pin-subtitle {
        color: #667085;
        line-height: 1.65;
        margin: 0 auto 20px;
      }

      .pin-error {
        border: 1px solid #fecaca;
        background: #fff1f2;
        color: #be123c;
        border-radius: 18px;
        font-weight: 900;
        padding: 12px 14px;
        margin-bottom: 18px;
      }

      .pin-form {
        display: grid;
        gap: 12px;
        text-align: left;
      }

      .pin-form label {
        color: #344054;
        font-size: 12px;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .pin-form input {
        width: 100%;
        border: 1px solid #d0d5dd;
        border-radius: 18px;
        background: #ffffff;
        color: #111827;
        font: inherit;
        font-size: 20px;
        font-weight: 900;
        outline: none;
        padding: 15px 16px;
        text-align: center;
        letter-spacing: 0.22em;
      }

      .pin-form input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .pin-form button,
      .public-link,
      .contact-actions a,
      .admin-panel button,
      .lock-button,
      .quote-tab,
      .invoice-box a {
        border: 0;
        border-radius: 999px;
        background: #111827;
        color: #ffffff;
        text-decoration: none;
        font-weight: 900;
        padding: 12px 16px;
        white-space: nowrap;
        box-shadow: 0 16px 36px rgba(17, 24, 39, 0.14);
      }

      .pin-form button {
        cursor: pointer;
        font-size: 15px;
        padding: 15px 18px;
        margin-top: 4px;
      }

      .pin-meta {
        color: #98a2b3;
        font-size: 13px;
        line-height: 1.55;
        margin: 18px 0 0;
      }

      .topbar,
      .stats-grid,
      .quote-tabs,
      .quote-list,
      .error-card,
      .empty-card {
        width: min(1240px, 100%);
        margin: 0 auto;
      }

      .topbar {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: flex-start;
        margin-bottom: 26px;
      }

      .top-actions {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .lock-button {
        cursor: pointer;
        background: #ffffff;
        color: #111827;
        border: 1px solid rgba(15, 23, 42, 0.1);
        box-shadow: none;
      }

      .eyebrow {
        color: #2563eb;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        margin: 0 0 10px;
      }

      h1,
      h2,
      p {
        margin-top: 0;
      }

      .admin-page h1 {
        font-size: clamp(36px, 5vw, 58px);
        line-height: 1;
        letter-spacing: -0.06em;
        margin-bottom: 14px;
      }

      .subtitle {
        color: #667085;
        max-width: 790px;
        line-height: 1.65;
        margin-bottom: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 18px;
      }

      .stat-card,
      .quote-card,
      .error-card,
      .empty-card,
      .quote-tab {
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.92);
        border-radius: 26px;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
      }

      .stat-card {
        padding: 20px;
      }

      .stat-card span {
        display: block;
        color: #667085;
        font-size: 13px;
        font-weight: 800;
        margin-bottom: 8px;
      }

      .stat-card strong {
        font-size: 32px;
        letter-spacing: -0.04em;
      }

      .quote-tabs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 24px;
      }

      .quote-tab {
        display: grid;
        gap: 7px;
        color: #111827;
        padding: 18px;
        box-shadow: none;
        transition:
          border-color 160ms ease,
          transform 160ms ease,
          box-shadow 160ms ease;
      }

      .quote-tab:hover {
        transform: translateY(-1px);
        border-color: rgba(37, 99, 235, 0.32);
        box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
      }

      .quote-tab.is-active {
        border-color: rgba(37, 99, 235, 0.44);
        background:
          radial-gradient(circle at top right, rgba(37, 99, 235, 0.13), transparent 13rem),
          #ffffff;
        box-shadow: 0 22px 60px rgba(37, 99, 235, 0.12);
      }

      .quote-tab span {
        color: #344054;
        font-size: 14px;
      }

      .quote-tab strong {
        font-size: 34px;
        line-height: 1;
        letter-spacing: -0.05em;
      }

      .quote-tab small {
        color: #667085;
        line-height: 1.45;
        white-space: normal;
      }

      .section-label {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 14px;
      }

      .section-label h2 {
        margin-bottom: 0;
        font-size: 28px;
        letter-spacing: -0.04em;
      }

      .section-label > p {
        max-width: 440px;
        color: #667085;
        line-height: 1.55;
        margin-bottom: 0;
        text-align: right;
      }

      .quote-list {
        display: grid;
        gap: 18px;
      }

      .quote-card {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 330px;
        gap: 20px;
        padding: 22px;
      }

      .quote-head {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 20px;
      }

      .quote-head h2 {
        font-size: 28px;
        letter-spacing: -0.04em;
        margin: 8px 0 6px;
      }

      .quote-meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .quote-number {
        display: inline-flex;
        align-items: center;
        min-height: 30px;
        padding: 0 10px;
        border-radius: 999px;
        background: #f2f4f7;
        color: #475467;
        font-size: 11px;
        font-weight: 950;
        letter-spacing: 0.08em;
      }

      .muted {
        color: #667085;
        margin-bottom: 0;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        padding: 7px 10px;
        font-size: 12px;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .status-reviewing .status-pill {
        background: #fff7ed;
        color: #c2410c;
      }

      .status-contacted .status-pill {
        background: #ecfeff;
        color: #0e7490;
      }

      .status-won .status-pill {
        background: #ecfdf3;
        color: #067647;
      }

      .status-closed .status-pill {
        background: #f3f4f6;
        color: #4b5563;
      }

      .contact-actions {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .contact-actions a {
        background: #f1f5f9;
        color: #0f172a;
        box-shadow: none;
        padding: 10px 12px;
      }

      .contact-actions .invoice-link {
        background: #111827;
        color: #ffffff;
        box-shadow: 0 14px 32px rgba(17, 24, 39, 0.12);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 16px;
      }

      .info {
        border: 1px solid #edf0f5;
        border-radius: 18px;
        background: #fbfcff;
        padding: 13px;
        min-width: 0;
      }

      .info span {
        display: block;
        color: #667085;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 6px;
      }

      .info strong,
      .info a {
        color: #111827;
        display: block;
        font-size: 13px;
        line-height: 1.45;
        overflow-wrap: anywhere;
        text-decoration: none;
      }

      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0 0 18px;
      }

      .tag-row span {
        color: #344054;
        background: #f2f4f7;
        border-radius: 999px;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 850;
      }

      .detail {
        border-top: 1px solid #edf0f5;
        padding-top: 16px;
        margin-top: 16px;
      }

      .detail h3 {
        font-size: 13px;
        margin: 0 0 8px;
        color: #344054;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .detail p {
        color: #1f2937;
        white-space: pre-wrap;
        line-height: 1.7;
        margin-bottom: 0;
      }

      .admin-panel {
        border: 1px solid #edf0f5;
        border-radius: 24px;
        background: #f8fafc;
        padding: 16px;
        height: fit-content;
        position: sticky;
        top: 16px;
      }

      .invoice-box {
        border: 1px solid #dbeafe;
        border-radius: 22px;
        background:
          radial-gradient(circle at top right, rgba(37, 99, 235, 0.13), transparent 10rem),
          #ffffff;
        padding: 14px;
        margin-bottom: 15px;
      }

      .invoice-box span {
        display: block;
        color: #2563eb;
        font-size: 11px;
        font-weight: 950;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      .invoice-box strong {
        display: block;
        font-size: 16px;
        letter-spacing: -0.03em;
      }

      .invoice-box p {
        color: #667085;
        font-size: 12px;
        line-height: 1.55;
        margin: 7px 0 12px;
      }

      .invoice-box a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 11px 13px;
      }

      .admin-panel label {
        display: grid;
        gap: 8px;
        color: #344054;
        font-size: 12px;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 14px;
      }

      .admin-panel select,
      .admin-panel textarea {
        width: 100%;
        border: 1px solid #d0d5dd;
        border-radius: 16px;
        background: #ffffff;
        color: #111827;
        font: inherit;
        font-size: 14px;
        font-weight: 700;
        outline: none;
        padding: 12px;
        text-transform: none;
        letter-spacing: normal;
      }

      .admin-panel textarea {
        resize: vertical;
        line-height: 1.6;
      }

      .admin-panel button {
        width: 100%;
        cursor: pointer;
      }

      .error-card,
      .empty-card {
        padding: 28px;
      }

      .error-card h2,
      .empty-card h2 {
        letter-spacing: -0.03em;
      }

      @media (max-width: 980px) {
        .admin-page {
          padding: 20px;
        }

        .topbar,
        .quote-head,
        .section-label {
          flex-direction: column;
          align-items: flex-start;
        }

        .section-label > p {
          text-align: left;
        }

        .top-actions,
        .contact-actions {
          justify-content: flex-start;
        }

        .stats-grid,
        .quote-tabs,
        .quote-card,
        .info-grid {
          grid-template-columns: 1fr;
        }

        .admin-panel {
          position: static;
        }
      }
    `}</style>
  );
}

function Info({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value?: string | null;
  isLink?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="info">
      <span>{label}</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}

function Detail({ title, value }: { title: string; value?: string | null }) {
  if (!value) return null;

  return (
    <section className="detail">
      <h3>{title}</h3>
      <p>{value}</p>
    </section>
  );
}