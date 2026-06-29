import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Darik Technologies Fillable Quote Invoice",
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

type InvoicePageProps = {
  params: Promise<{ id: string }> | { id: string };
};

const quoteAccessCookie = "dariktech_quotes_access";

const statusLabels: Record<string, string> = {
  new: "Active / New",
  reviewing: "Reviewing",
  contacted: "Active / Contacted",
  won: "Closed / Won",
  closed: "Closed",
};

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

async function getQuote(id: string) {
  const response = await supabaseFetch(
    `dariktech_quote_requests?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Could not load quote request. ${details}`);
  }

  const rows = (await response.json()) as QuoteRequest[];
  return rows[0] || null;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function dateInputValue(value: string) {
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function validUntilValue() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

function quoteNumber(id: string) {
  return `DTQ-${id.slice(0, 8).toUpperCase()}`;
}

function statusLabel(value: string) {
  return statusLabels[value] || value;
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || value;
}

function invoiceEmailLink(quote: QuoteRequest) {
  const subject = encodeURIComponent(
    `Darik Technologies quote invoice ${quoteNumber(quote.id)}`,
  );
  const body = encodeURIComponent(
    `Hi ${firstName(quote.full_name)},\n\nAttached is the professional quote PDF for your project.\n\nBest,\nDarik Technologies`,
  );

  return `mailto:${quote.email || ""}?subject=${subject}&body=${body}`;
}

function defaultLineItems(quote: QuoteRequest) {
  const buildNeeded = quote.build_needed?.length
    ? quote.build_needed.join(", ")
    : "Mobile app, web app, admin dashboard, backend, and database as needed.";

  return [
    {
      item: "Product planning + system scope",
      description:
        "Review business model, users, workflow, screens, admin controls, launch requirements, and final project structure.",
      qty: "1",
      price: "",
    },
    {
      item: quote.project_type || "Custom app / platform build",
      description: buildNeeded,
      qty: "1",
      price: "",
    },
    {
      item: "Backend + admin operations",
      description:
        "Database, roles, permissions, operational workflow, reporting, notifications, storage, and admin controls as required.",
      qty: "1",
      price: "",
    },
  ];
}

export default async function DarikTechQuoteInvoicePage({
  params,
}: InvoicePageProps) {
  const allowed = await hasQuoteAccess();

  if (!allowed) {
    redirect("/admin/dariktech-quotes?pin=required");
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;

  let quote: QuoteRequest | null = null;
  let error = "";

  try {
    quote = await getQuote(id);
  } catch (caught) {
    error =
      caught instanceof Error ? caught.message : "Could not load quote request.";
  }

  if (error || !quote) {
    return (
      <main className="invoice-page">
        <section className="invoice-shell">
          <div className="screen-actions">
            <a href="/admin/dariktech-quotes">Back to quotes</a>
          </div>
          <div className="error-box">
            <h1>Quote invoice unavailable</h1>
            <p>{error || "This quote request could not be found."}</p>
          </div>
        </section>
        <InvoiceStyles />
      </main>
    );
  }

  const quoteId = quoteNumber(quote.id);
  const emailHref = invoiceEmailLink(quote);
  const defaultItems = defaultLineItems(quote);
  const backTab =
    quote.status === "reviewing"
      ? "reviewing"
      : quote.status === "closed" || quote.status === "won"
        ? "closed"
        : "active";

  return (
    <main className="invoice-page" data-invoice-id={quote.id}>
      <section className="screen-actions">
        <a href="/admin/dariktech-quotes">Back to admin</a>
        <a href={`/admin/dariktech-quotes?tab=${backTab}`}>Back to tab</a>
        <a href={emailHref}>Open email</a>
        <button data-add-row type="button">Add line item</button>
        <button data-reset-invoice type="button">Reset saved edits</button>
        <button data-print-button type="button">Save PDF</button>
      </section>

      <section className="invoice-shell">
        <header className="invoice-header">
          <div className="brand-block">
            <div className="logo-box">
              <img src="/dariktech/logo.png" alt="Darik Technologies" />
            </div>
            <div>
              <input
                className="brand-name editable-input plain-input"
                data-save-key="companyName"
                defaultValue="Darik Technologies"
                aria-label="Company name"
              />
              <textarea
                className="brand-subtitle editable-textarea plain-textarea"
                data-save-key="companySubtitle"
                defaultValue="Mobile apps · web apps · dashboards · backend systems"
                aria-label="Company subtitle"
                rows={2}
              />
            </div>
          </div>

          <div className="invoice-title">
            <input
              className="label-input editable-input plain-input"
              data-save-key="invoiceLabel"
              defaultValue="Professional Quote Invoice"
              aria-label="Invoice label"
            />
            <input
              className="invoice-number editable-input plain-input"
              data-save-key="invoiceNumber"
              defaultValue={quoteId}
              aria-label="Invoice number"
            />
            <select
              className="status-select editable-input"
              data-save-key="invoiceStatus"
              defaultValue={statusLabel(quote.status)}
              aria-label="Invoice status"
            >
              <option>Draft Quote</option>
              <option>Professional Quote</option>
              <option>Final Quote</option>
              <option>Approved Quote</option>
              <option>{statusLabel(quote.status)}</option>
            </select>
          </div>
        </header>

        <section className="invoice-grid">
          <div className="panel">
            <p className="label">Prepared for</p>
            <label className="field-label">
              Client name
              <input
                className="editable-input"
                data-save-key="clientName"
                defaultValue={quote.full_name}
              />
            </label>
            <label className="field-label">
              Company
              <input
                className="editable-input"
                data-save-key="clientCompany"
                defaultValue={quote.company || ""}
                placeholder="Company name"
              />
            </label>
            <label className="field-label">
              Email
              <input
                className="editable-input"
                data-save-key="clientEmail"
                defaultValue={quote.email || ""}
                placeholder="client@email.com"
              />
            </label>
            <label className="field-label">
              WhatsApp / phone
              <input
                className="editable-input"
                data-save-key="clientWhatsapp"
                defaultValue={quote.whatsapp || ""}
                placeholder="+000000000"
              />
            </label>
            <label className="field-label">
              Country
              <input
                className="editable-input"
                data-save-key="clientCountry"
                defaultValue={quote.country || ""}
                placeholder="Country"
              />
            </label>
          </div>

          <div className="panel">
            <p className="label">Quote details</p>
            <label className="field-label">
              Project type
              <input
                className="editable-input"
                data-save-key="projectType"
                defaultValue={quote.project_type || "App / business system"}
              />
            </label>
            <label className="field-label">
              Quote date
              <input
                className="editable-input"
                data-save-key="quoteDate"
                defaultValue={dateInputValue(quote.created_at)}
                type="date"
              />
            </label>
            <label className="field-label">
              Valid until
              <input
                className="editable-input"
                data-save-key="validUntil"
                defaultValue={validUntilValue()}
                type="date"
              />
            </label>
            <label className="field-label">
              Currency
              <input
                className="editable-input"
                data-save-key="currency"
                defaultValue="USD"
                placeholder="USD"
              />
            </label>
            <label className="field-label">
              Timeline
              <input
                className="editable-input"
                data-save-key="timeline"
                defaultValue={quote.timeline || ""}
                placeholder="Example: 4-8 weeks"
              />
            </label>
          </div>
        </section>

        <section className="summary-card">
          <p className="label">Project summary</p>
          <textarea
            className="editable-textarea summary-textarea"
            data-save-key="projectSummary"
            defaultValue={
              quote.project_idea ||
              "Project details to be confirmed after review."
            }
            rows={5}
          />
        </section>

        <section className="line-items">
          <div className="line-head">
            <span>Item</span>
            <span>Description</span>
            <span>Qty</span>
            <span>Unit price</span>
            <span>Total</span>
            <span className="screen-only">Action</span>
          </div>

          <div data-line-items>
            {defaultItems.map((item, index) => (
              <div className="line-row" data-line-row key={`${item.item}-${index}`}>
                <input
                  className="editable-input"
                  data-line-field="item"
                  defaultValue={item.item}
                  aria-label="Line item name"
                />
                <textarea
                  className="editable-textarea"
                  data-line-field="description"
                  defaultValue={item.description}
                  rows={3}
                  aria-label="Line item description"
                />
                <input
                  className="editable-input number-input"
                  data-line-field="qty"
                  defaultValue={item.qty}
                  inputMode="decimal"
                  aria-label="Quantity"
                />
                <input
                  className="editable-input number-input"
                  data-line-field="price"
                  defaultValue={item.price}
                  inputMode="decimal"
                  placeholder="0"
                  aria-label="Unit price"
                />
                <output data-line-total>0.00</output>
                <button className="remove-row screen-only" data-remove-row type="button">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="totals-grid">
          <div className="terms-card">
            <p className="label">Scope notes</p>
            <label className="field-label">
              Main users
              <textarea
                className="editable-textarea"
                data-save-key="mainUsers"
                defaultValue={quote.main_users || ""}
                placeholder="Who will use the system?"
                rows={3}
              />
            </label>
            <label className="field-label">
              Important features
              <textarea
                className="editable-textarea"
                data-save-key="importantFeatures"
                defaultValue={quote.important_features || ""}
                placeholder="Important features and workflows"
                rows={4}
              />
            </label>
            <label className="field-label">
              Extra notes
              <textarea
                className="editable-textarea"
                data-save-key="extraNotes"
                defaultValue={quote.extra_notes || quote.admin_notes || ""}
                placeholder="Payment terms, milestones, exclusions, support terms, etc."
                rows={4}
              />
            </label>
          </div>

          <div className="totals-card">
            <label className="field-label">
              Discount %
              <input
                className="editable-input number-input"
                data-save-key="discountPercent"
                data-total-input="discountPercent"
                defaultValue="0"
                inputMode="decimal"
                placeholder="Example: 10"
              />
            </label>
            <label className="field-label">
              Tax / VAT
              <input
                className="editable-input number-input"
                data-save-key="tax"
                data-total-input="tax"
                defaultValue="0"
                inputMode="decimal"
              />
            </label>
            <label className="field-label">
              Annual maintenance fee
              <input
                className="editable-input number-input"
                data-save-key="annualMaintenance"
                data-total-input="annualMaintenance"
                defaultValue="1000"
                inputMode="decimal"
                placeholder="Adjust by project size"
              />
            </label>
            <label className="field-label">
              Deposit required
              <input
                className="editable-input number-input"
                data-save-key="deposit"
                data-total-input="deposit"
                defaultValue="0"
                inputMode="decimal"
              />
            </label>

            <div className="total-row">
              <span>Subtotal</span>
              <strong data-subtotal>0.00</strong>
            </div>
            <div className="total-row">
              <span>Discount %</span>
              <strong data-discount-percent-display>0%</strong>
            </div>
            <div className="total-row">
              <span>Discount amount</span>
              <strong data-discount-display>0.00</strong>
            </div>
            <div className="total-row">
              <span>Tax / VAT</span>
              <strong data-tax-display>0.00</strong>
            </div>
            <div className="total-row final-total">
              <span>Final quote</span>
              <strong data-grand-total>0.00</strong>
            </div>
            <div className="total-row maintenance-total">
              <span>Annual maintenance fee</span>
              <strong data-annual-maintenance-display>0.00</strong>
            </div>
            <div className="total-row">
              <span>Balance after deposit</span>
              <strong data-balance>0.00</strong>
            </div>
          </div>
        </section>

        <section className="payment-terms">
          <div>
            <p className="label">Ownership + yearly maintenance fine print</p>
            <textarea
              className="editable-textarea"
              data-save-key="maintenanceTerms"
              defaultValue={
                "Darik Technologies owns the application, source code, backend structure, database design, and operating system unless a separate ownership transfer agreement is signed. The annual maintenance fee is adjustable based on project size, storage usage, database usage, and expected operating load. The yearly fee includes data storage and database coverage, 1 free scheduled app update every quarter (4 updates per year), and 2 free emergency updates per year. Any extra emergency update is $100 each. Third-party fees such as app store accounts, SMS, WhatsApp, maps, AI, payment gateways, or unusual storage overages may be billed separately if required."
              }
              rows={6}
            />
          </div>
          <div>
            <p className="label">Payment + client approval</p>
            <textarea
              className="editable-textarea"
              data-save-key="approvalText"
              defaultValue={
                "To approve this quote, the client may reply by email confirming the accepted scope, final price, yearly maintenance fee, and payment schedule. Project start, milestones, and delivery dates are confirmed after the required deposit is received."
              }
              rows={6}
            />
          </div>
        </section>

        <footer className="invoice-footer">
          <div>
            <input
              className="footer-company editable-input plain-input"
              data-save-key="footerCompany"
              defaultValue="Darik Technologies"
              aria-label="Footer company"
            />
            <textarea
              className="footer-note editable-textarea plain-textarea"
              data-save-key="footerNote"
              defaultValue="This professional quote invoice is generated from the submitted quote request. Final build price, yearly maintenance fee, payment terms, and delivery timeline are confirmed after reviewing the full scope."
              rows={3}
            />
          </div>
          <div className="footer-meta">
            <span>{quoteId}</span>
            <span>{formatDate(quote.created_at)}</span>
          </div>
        </footer>
      </section>

      <p className="print-note">
        Fill the invoice, click “Save PDF”, choose Save as PDF in the browser print window, then attach the saved file to your email. The print layout is compact and designed to fit a professional quote into 1–2 pages.
      </p>

      <Script id={`darik-invoice-tools-${quote.id}`} strategy="afterInteractive">
        {`(function () {
  function bootInvoiceTools() {
    const root = document.querySelector("[data-invoice-id]");
    if (!root) return;

    const invoiceId = root.getAttribute("data-invoice-id") || "quote";
    const storageKey = "dariktech_invoice_edits_" + invoiceId;

    function rawNumber(value) {
      const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
      const number = Number(cleaned);
      return Number.isFinite(number) ? number : 0;
    }

    function money(value) {
      return Number(value || 0).toLocaleString("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    function getInputValue(field) {
      if (!field) return "";
      return field.value || "";
    }

    function setInputValue(field, value) {
      if (!field) return;
      field.value = value || "";
    }

    function getCurrency() {
      const input = root.querySelector('[data-save-key="currency"]');
      const value = getInputValue(input).trim();
      return value || "";
    }

    function formatMoney(value) {
      const currency = getCurrency();
      return currency ? currency + " " + money(value) : money(value);
    }

    function calculateTotals() {
      let subtotal = 0;

      root.querySelectorAll("[data-line-row]").forEach(function (row) {
        const qty = rawNumber(getInputValue(row.querySelector('[data-line-field="qty"]')));
        const price = rawNumber(getInputValue(row.querySelector('[data-line-field="price"]')));
        const total = qty * price;
        subtotal += total;

        const output = row.querySelector("[data-line-total]");
        if (output) output.textContent = formatMoney(total);
      });

      const discountPercent = Math.max(
        0,
        rawNumber(getInputValue(root.querySelector('[data-total-input="discountPercent"]')))
      );
      const discountAmount = subtotal * (discountPercent / 100);
      const tax = rawNumber(getInputValue(root.querySelector('[data-total-input="tax"]')));
      const annualMaintenance = rawNumber(
        getInputValue(root.querySelector('[data-total-input="annualMaintenance"]'))
      );
      const deposit = rawNumber(getInputValue(root.querySelector('[data-total-input="deposit"]')));
      const grandTotal = Math.max(0, subtotal - discountAmount + tax);
      const balance = Math.max(0, grandTotal - deposit);

      const subtotalEl = root.querySelector("[data-subtotal]");
      const discountPercentEl = root.querySelector("[data-discount-percent-display]");
      const discountEl = root.querySelector("[data-discount-display]");
      const taxEl = root.querySelector("[data-tax-display]");
      const annualMaintenanceEl = root.querySelector("[data-annual-maintenance-display]");
      const grandTotalEl = root.querySelector("[data-grand-total]");
      const balanceEl = root.querySelector("[data-balance]");

      if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
      if (discountPercentEl) {
        discountPercentEl.textContent = discountPercent.toFixed(2).replace(/\.00$/, "") + "%";
      }
      if (discountEl) discountEl.textContent = formatMoney(discountAmount);
      if (taxEl) taxEl.textContent = formatMoney(tax);
      if (annualMaintenanceEl) {
        annualMaintenanceEl.textContent = formatMoney(annualMaintenance) + " / year";
      }
      if (grandTotalEl) grandTotalEl.textContent = formatMoney(grandTotal);
      if (balanceEl) balanceEl.textContent = formatMoney(balance);
    }

    function createLineRow(line) {
      const row = document.createElement("div");
      row.className = "line-row";
      row.setAttribute("data-line-row", "");

      row.innerHTML =
        '<input class="editable-input" data-line-field="item" aria-label="Line item name" />' +
        '<textarea class="editable-textarea" data-line-field="description" rows="3" aria-label="Line item description"></textarea>' +
        '<input class="editable-input number-input" data-line-field="qty" inputmode="decimal" aria-label="Quantity" />' +
        '<input class="editable-input number-input" data-line-field="price" inputmode="decimal" placeholder="0" aria-label="Unit price" />' +
        '<output data-line-total>0.00</output>' +
        '<button class="remove-row screen-only" data-remove-row type="button">Remove</button>';

      setInputValue(row.querySelector('[data-line-field="item"]'), line && line.item ? line.item : "");
      setInputValue(row.querySelector('[data-line-field="description"]'), line && line.description ? line.description : "");
      setInputValue(row.querySelector('[data-line-field="qty"]'), line && line.qty ? line.qty : "1");
      setInputValue(row.querySelector('[data-line-field="price"]'), line && line.price ? line.price : "");

      return row;
    }

    function serialize() {
      const fields = {};

      root.querySelectorAll("[data-save-key]").forEach(function (field) {
        const key = field.getAttribute("data-save-key");
        if (!key) return;
        fields[key] = getInputValue(field);
      });

      const lines = Array.from(root.querySelectorAll("[data-line-row]")).map(function (row) {
        return {
          item: getInputValue(row.querySelector('[data-line-field="item"]')),
          description: getInputValue(row.querySelector('[data-line-field="description"]')),
          qty: getInputValue(row.querySelector('[data-line-field="qty"]')),
          price: getInputValue(row.querySelector('[data-line-field="price"]'))
        };
      });

      return { fields: fields, lines: lines };
    }

    function save() {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(serialize()));
      } catch (error) {}
    }

    function syncPrintTextValues() {
      root.querySelectorAll("textarea.editable-textarea").forEach(function (textarea) {
        let mirror = textarea.nextElementSibling;

        if (!mirror || !mirror.classList || !mirror.classList.contains("print-text-value")) {
          mirror = document.createElement("div");
          mirror.className = "print-text-value";
          textarea.insertAdjacentElement("afterend", mirror);
        }

        mirror.textContent = textarea.value || "";
      });
    }

    function autoResizeTextareas() {
      root.querySelectorAll("textarea.editable-textarea").forEach(function (textarea) {
        textarea.style.height = "auto";
        const nextHeight = Math.max(textarea.scrollHeight + 6, 54);
        textarea.style.height = nextHeight + "px";
      });
    }

    function refreshInvoiceView() {
      autoResizeTextareas();
      syncPrintTextValues();
      calculateTotals();
    }

    function load() {
      try {
        const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
        if (!saved) return;

        Object.entries(saved.fields || {}).forEach(function (entry) {
          const key = entry[0];
          const value = entry[1];
          setInputValue(root.querySelector('[data-save-key="' + key + '"]'), value);
        });

        if (Array.isArray(saved.lines) && saved.lines.length) {
          const container = root.querySelector("[data-line-items]");
          if (container) {
            container.innerHTML = "";
            saved.lines.forEach(function (line) {
              container.appendChild(createLineRow(line));
            });
          }
        }
      } catch (error) {}
    }

    function handleInput() {
      refreshInvoiceView();
      save();
    }

    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleInput);

    root.addEventListener("click", function (event) {
      const target = event.target;
      if (!target || !target.matches || !target.matches("[data-remove-row]")) return;

      const rows = root.querySelectorAll("[data-line-row]");
      if (rows.length > 1) {
        const row = target.closest("[data-line-row]");
        if (row) row.remove();
        refreshInvoiceView();
        save();
      }
    });

    const addButton = document.querySelector("[data-add-row]");
    const resetButton = document.querySelector("[data-reset-invoice]");
    const printButton = document.querySelector("[data-print-button]");

    if (addButton) {
      addButton.addEventListener("click", function () {
        const container = root.querySelector("[data-line-items]");
        if (!container) return;

        container.appendChild(createLineRow({
          item: "New line item",
          description: "Describe the work included.",
          qty: "1",
          price: ""
        }));

        refreshInvoiceView();
        save();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        if (!window.confirm("Reset saved invoice edits for this quote?")) return;
        try {
          window.localStorage.removeItem(storageKey);
        } catch (error) {}
        window.location.reload();
      });
    }

    function prepareForPdf() {
      refreshInvoiceView();
      save();
      root.classList.add("pdf-compact-mode");
      document.body.classList.add("pdf-compact-mode");
    }

    window.addEventListener("afterprint", function () {
      root.classList.remove("pdf-compact-mode");
      document.body.classList.remove("pdf-compact-mode");
    });

    if (printButton) {
      printButton.addEventListener("click", function () {
        prepareForPdf();
        setTimeout(function () {
          window.print();
        }, 100);
      });
    }

    load();
    refreshInvoiceView();

    window.addEventListener("beforeprint", function () {
      refreshInvoiceView();
    });

    window.darikInvoiceRecalculate = refreshInvoiceView;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootInvoiceTools);
  } else {
    bootInvoiceTools();
  }
})();`}
      </Script>


      <InvoiceStyles />
    </main>
  );
}

function InvoiceStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #e5e7eb;
      }

      .invoice-page {
        min-height: 100vh;
        padding: 28px;
        color: #111827;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.13), transparent 28rem),
          #e5e7eb;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .screen-actions {
        width: min(1100px, 100%);
        margin: 0 auto 18px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        flex-wrap: wrap;
      }

      .screen-actions a,
      .screen-actions button {
        border: 0;
        border-radius: 999px;
        background: #111827;
        color: #ffffff;
        text-decoration: none;
        font: inherit;
        font-size: 13px;
        font-weight: 900;
        padding: 11px 15px;
        cursor: pointer;
        box-shadow: 0 16px 36px rgba(17, 24, 39, 0.14);
      }

      .screen-actions a:first-child,
      .screen-actions a:nth-child(2),
      .screen-actions button[data-reset-invoice] {
        background: #ffffff;
        color: #111827;
        border: 1px solid rgba(15, 23, 42, 0.1);
        box-shadow: none;
      }

      .invoice-shell {
        width: min(1100px, 100%);
        margin: 0 auto;
        background: #ffffff;
        border-radius: 30px;
        padding: 38px;
        box-shadow: 0 30px 100px rgba(15, 23, 42, 0.16);
        border: 1px solid rgba(15, 23, 42, 0.08);
      }

      .invoice-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 28px;
        padding-bottom: 26px;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 26px;
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 0;
        flex: 1;
      }

      .logo-box {
        width: 78px;
        height: 78px;
        border-radius: 24px;
        display: grid;
        place-items: center;
        overflow: hidden;
        background: #0b1220;
        flex: 0 0 78px;
      }

      .logo-box img {
        width: 58px;
        height: 58px;
        object-fit: contain;
      }

      .invoice-title {
        text-align: right;
        width: min(360px, 100%);
      }

      .editable-input,
      .editable-textarea,
      .status-select {
        width: 100%;
        border: 1px solid #d0d5dd;
        border-radius: 14px;
        background: #ffffff;
        color: #111827;
        font: inherit;
        outline: none;
        padding: 10px 12px;
      }

      .editable-input:focus,
      .editable-textarea:focus,
      .status-select:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }

      .print-text-value {
        display: none;
      }

      .plain-input,
      .plain-textarea {
        border-color: transparent;
        background: transparent;
        padding: 0;
        border-radius: 10px;
      }

      .brand-name {
        display: block;
        font-size: 22px;
        font-weight: 950;
        letter-spacing: -0.04em;
      }

      .brand-subtitle {
        color: #667085;
        font-size: 13px;
        line-height: 1.45;
        resize: none;
        margin-top: 4px;
      }

      .label-input,
      .label {
        color: #2563eb;
        font-size: 11px;
        font-weight: 950;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .invoice-number {
        margin-top: 6px;
        font-size: 42px;
        font-weight: 950;
        line-height: 0.95;
        letter-spacing: -0.06em;
        text-align: right;
      }

      .status-select {
        margin-top: 10px;
        display: inline-flex;
        width: auto;
        min-width: 180px;
        background: #eff6ff;
        color: #1d4ed8;
        border-color: #bfdbfe;
        font-size: 11px;
        font-weight: 950;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .invoice-grid,
      .totals-grid,
      .payment-terms {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }

      .panel,
      .summary-card,
      .terms-card,
      .totals-card,
      .payment-terms > div,
      .error-box {
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        background: #fbfcff;
        padding: 20px;
      }

      .label {
        display: block;
        margin: 0 0 12px;
      }

      .field-label {
        display: grid;
        gap: 7px;
        color: #344054;
        font-size: 12px;
        font-weight: 900;
        margin-bottom: 12px;
      }

      .field-label:last-child {
        margin-bottom: 0;
      }

      .summary-textarea {
        min-height: 140px;
      }

      .editable-textarea {
        resize: vertical;
        line-height: 1.6;
      }

      .line-items {
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        overflow: hidden;
        margin-bottom: 16px;
        background: #ffffff;
      }

      .line-head,
      .line-row {
        display: grid;
        grid-template-columns: 1fr 1.6fr 0.35fr 0.55fr 0.65fr 0.42fr;
        gap: 10px;
        align-items: start;
      }

      .line-head {
        background: #111827;
        color: #ffffff;
        padding: 14px 18px;
        font-size: 12px;
        font-weight: 950;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .line-row {
        padding: 14px 18px;
        border-top: 1px solid #eef2f7;
      }

      .line-row output {
        display: flex;
        align-items: center;
        min-height: 42px;
        color: #111827;
        font-size: 13px;
        font-weight: 950;
      }

      .number-input {
        text-align: right;
      }

      .remove-row {
        border: 0;
        border-radius: 999px;
        background: #fef2f2;
        color: #b91c1c;
        cursor: pointer;
        font: inherit;
        font-size: 12px;
        font-weight: 900;
        padding: 10px 12px;
      }

      .totals-card {
        background:
          radial-gradient(circle at top right, rgba(37, 99, 235, 0.11), transparent 16rem),
          #f8fafc;
      }

      .total-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-top: 1px solid #e5e7eb;
        padding: 12px 0;
      }

      .total-row span {
        color: #667085;
        font-size: 13px;
        font-weight: 900;
      }

      .total-row strong {
        color: #111827;
        font-size: 18px;
        letter-spacing: -0.03em;
        text-align: right;
      }

      .final-total {
        margin-top: 6px;
        border-top: 2px solid #111827;
      }

      .final-total span,
      .final-total strong {
        color: #111827;
        font-size: 26px;
      }

      .maintenance-total {
        margin-top: 3px;
        padding: 11px 0;
        border-top: 1px dashed #cbd5e1;
      }

      .maintenance-total span,
      .maintenance-total strong {
        color: #1d4ed8;
      }

      .payment-terms {
        align-items: stretch;
      }

      .invoice-footer {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding-top: 22px;
        border-top: 1px solid #e5e7eb;
      }

      .footer-company {
        display: block;
        font-size: 18px;
        font-weight: 950;
        letter-spacing: -0.035em;
      }

      .footer-note {
        max-width: 720px;
        color: #667085;
        font-size: 12px;
        line-height: 1.65;
        resize: none;
        margin-top: 6px;
      }

      .footer-meta {
        display: grid;
        gap: 6px;
        align-content: start;
        text-align: right;
        color: #667085;
        font-size: 12px;
        font-weight: 900;
        white-space: nowrap;
      }

      .print-note {
        width: min(1100px, 100%);
        margin: 14px auto 0;
        color: #667085;
        font-size: 13px;
        text-align: center;
      }

      .error-box h1 {
        margin: 0 0 10px;
        letter-spacing: -0.04em;
      }

      .error-box p {
        margin: 0;
        color: #667085;
        line-height: 1.6;
      }

      @media (max-width: 960px) {
        .invoice-page {
          padding: 14px;
        }

        .screen-actions {
          justify-content: flex-start;
        }

        .invoice-shell {
          padding: 22px;
          border-radius: 24px;
        }

        .invoice-header,
        .invoice-footer {
          flex-direction: column;
        }

        .invoice-title,
        .footer-meta {
          text-align: left;
          width: 100%;
        }

        .invoice-number {
          text-align: left;
        }

        .invoice-grid,
        .totals-grid,
        .payment-terms,
        .line-head,
        .line-row {
          grid-template-columns: 1fr;
        }

        .line-head .screen-only {
          display: none;
        }

        .line-row output {
          justify-content: flex-start;
        }

        .number-input {
          text-align: left;
        }
      }

      @media print {
        @page {
          size: A4;
          margin: 6mm;
        }

        html,
        body {
          width: 210mm;
          background: #ffffff !important;
        }

        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .invoice-page {
          min-height: auto;
          padding: 0 !important;
          background: #ffffff !important;
          font-size: 10px;
        }

        .screen-actions,
        .print-note,
        .screen-only {
          display: none !important;
        }

        .invoice-shell {
          width: 100%;
          max-width: none;
          box-shadow: none;
          border: 0;
          border-radius: 0;
          padding: 0;
          background: #ffffff !important;
        }

        textarea::-webkit-scrollbar {
          display: none;
        }

        .invoice-header {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 12px;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid #d9dee8;
        }

        .brand-block {
          gap: 10px;
        }

        .logo-box {
          width: 50px;
          height: 50px;
          flex-basis: 50px;
          border-radius: 14px;
        }

        .logo-box img {
          width: 36px;
          height: 36px;
        }

        .brand-name {
          font-size: 17px;
          line-height: 1;
        }

        .brand-subtitle {
          height: 30px !important;
          max-height: 30px !important;
          margin-top: 2px;
          font-size: 9.5px;
          line-height: 1.25;
          overflow: hidden;
        }

        .invoice-title {
          width: 100%;
        }

        .label-input,
        .label {
          margin-bottom: 5px;
          font-size: 8px;
          letter-spacing: 0.11em;
        }

        .invoice-number {
          margin-top: 0;
          font-size: 28px;
          line-height: 1;
        }

        .status-select {
          min-width: 0;
          margin-top: 5px;
          padding: 2px 0;
          font-size: 8px;
        }

        .invoice-grid,
        .totals-grid,
        .payment-terms {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
          margin-bottom: 7px;
        }

        .panel,
        .summary-card,
        .terms-card,
        .totals-card,
        .payment-terms > div,
        .error-box {
          padding: 8px 10px;
          border-radius: 12px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .field-label {
          gap: 2px;
          margin-bottom: 5px;
          font-size: 8px;
          line-height: 1.1;
        }

        .editable-input,
        .editable-textarea,
        .status-select {
          appearance: none !important;
          -webkit-appearance: none !important;
          border-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          resize: none !important;
          padding: 1px 3px !important;
          min-height: 0 !important;
          color: #111827 !important;
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 9.5px !important;
          line-height: 1.28 !important;
          text-indent: 0 !important;
          overflow: visible !important;
          white-space: pre-wrap !important;
        }

        .plain-input,
        .plain-textarea {
          padding: 1px 2px !important;
        }

        .editable-textarea {
          display: none !important;
        }

        .print-text-value {
          display: block !important;
          min-height: 10px;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          line-height: 1.28;
          white-space: pre-wrap;
          overflow: visible;
          overflow-wrap: anywhere;
          word-break: normal;
          padding: 1px 3px;
        }

        .summary-card .print-text-value,
        .terms-card .print-text-value {
          font-size: 8.7px;
          line-height: 1.22;
        }

        .payment-terms .print-text-value {
          font-size: 7.2px;
          line-height: 1.16;
          padding: 1px 4px;
        }

        .footer-note + .print-text-value,
        .brand-subtitle + .print-text-value {
          color: #667085;
          font-size: 8.4px;
          font-weight: 700;
          line-height: 1.2;
        }

        .line-row > *,
        .panel > *,
        .summary-card > *,
        .terms-card > *,
        .payment-terms > div > * {
          min-width: 0;
        }

        .line-row .editable-input {
          padding-left: 4px !important;
          padding-right: 4px !important;
        }

        .line-row .print-text-value {
          padding-left: 4px;
          padding-right: 4px;
          font-size: 8.8px;
          line-height: 1.2;
        }

        .summary-card {
          margin-bottom: 7px;
        }

        .line-items {
          margin-bottom: 7px;
          border-radius: 12px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .line-head,
        .line-row {
          grid-template-columns: 0.9fr 1.65fr 0.28fr 0.46fr 0.58fr;
          gap: 5px;
          align-items: start;
        }

        .line-head {
          padding: 5px 8px;
          font-size: 7px;
          letter-spacing: 0.07em;
        }

        .line-row {
          padding: 6px 9px;
        }

        .line-row output {
          min-height: 0;
          font-size: 9px;
          line-height: 1.22;
        }

        .totals-card {
          padding: 8px 10px;
        }

        .totals-card .field-label {
          grid-template-columns: 1fr 0.95fr;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .totals-card .number-input {
          text-align: right;
        }

        .total-row {
          padding: 4px 0;
        }

        .total-row span {
          font-size: 9px;
        }

        .total-row strong {
          font-size: 10.5px;
        }

        .final-total {
          margin-top: 3px;
          border-top: 1px solid #111827;
        }

        .final-total span,
        .final-total strong {
          font-size: 15px;
        }

        .maintenance-total {
          padding: 4px 0;
        }

        .maintenance-total span,
        .maintenance-total strong {
          font-size: 10px;
        }

        .payment-terms {
          margin-bottom: 8px;
          align-items: start;
        }

        .invoice-footer {
          gap: 14px;
          padding-top: 8px;
          border-top: 1px solid #d9dee8;
        }

        .footer-company {
          font-size: 13px;
        }

        .footer-note {
          max-width: 620px;
          margin-top: 2px;
          font-size: 8.5px !important;
          line-height: 1.24 !important;
        }

        .footer-meta {
          gap: 2px;
          font-size: 8px;
        }
      }
    `}</style>
  );
}