"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const projectTypes = [
  "Mobile app",
  "Web app",
  "Admin dashboard",
  "Marketplace platform",
  "Booking or ordering system",
  "Internal company tool",
  "MVP / startup idea",
  "Not sure yet",
];

const budgetRanges = [
  "Need guidance",
  "Under $1,000",
  "$1,000 - $3,000",
  "$3,000 - $7,500",
  "$7,500 - $15,000",
  "$15,000+",
];

const timelines = [
  "Need guidance",
  "ASAP",
  "2 - 4 weeks",
  "1 - 2 months",
  "2 - 3 months",
  "Flexible",
];

const contactMethods = ["WhatsApp", "Email", "Phone call", "Video call"];

const buildNeeds = [
  "Customer mobile app",
  "Business/admin dashboard",
  "Database/backend",
  "Payments",
  "Notifications",
  "User accounts/login",
  "Booking/order flow",
  "AI feature",
];

export default function DarikTechQuotePage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      country: String(formData.get("country") || ""),
      preferredContact: String(formData.get("preferredContact") || ""),
      projectType: String(formData.get("projectType") || ""),
      buildNeeded: formData.getAll("buildNeeded").map(String),
      budgetRange: String(formData.get("budgetRange") || ""),
      timeline: String(formData.get("timeline") || ""),
      referenceLink: String(formData.get("referenceLink") || ""),
      projectIdea: String(formData.get("projectIdea") || ""),
      mainUsers: String(formData.get("mainUsers") || ""),
      importantFeatures: String(formData.get("importantFeatures") || ""),
      extraNotes: String(formData.get("extraNotes") || ""),
      website: String(formData.get("website") || ""),
    };

    try {
      const response = await fetch("/api/dariktech/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "The quote request could not be saved.");
      }

      setStatus("sent");
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the quote request."
      );
    }
  }

  return (
    <main className="quote-page">
      <section className="hero">
        <nav className="nav">
          <Link className="brand" href="/dariktech" aria-label="Back to Darik Technologies">
            <span className="brand-mark">
              <img src="/dariktech/logo.png" alt="" />
            </span>
            <span>
              <strong>Darik Technologies</strong>
              <small>Free project quote</small>
            </span>
          </Link>
          <Link className="nav-link" href="/dariktech">
            Back to portfolio
          </Link>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Start your free quote today</p>
            <h1>Tell me what you want to build. I’ll turn it into a real product plan.</h1>
            <p className="lead">
              Share the business idea, contact details, budget, timeline, and features. Your request
              goes straight into the Darik admin dashboard so it can be reviewed properly.
            </p>
            <div className="trust-row">
              <span>No obligation</span>
              <span>Business-focused</span>
              <span>Clear next steps</span>
            </div>
          </div>

          <aside className="side-card">
            <p className="side-label">What happens next?</p>
            <ol>
              <li>Your request is saved securely.</li>
              <li>We review the app idea and main workflow.</li>
              <li>You receive a realistic quote or follow-up questions.</li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="form-shell">
        {status === "sent" ? (
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Your quote request was submitted.</h2>
            <p>
              It is now saved inside the Darik admin dashboard. I’ll review the details and follow up
              using your preferred contact method.
            </p>
            <button className="primary-button" type="button" onClick={() => setStatus("idle")}>
              Submit another request
            </button>
          </div>
        ) : (
          <form className="quote-form" onSubmit={handleSubmit}>
            <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />

            <div className="form-header">
              <p className="eyebrow">Project details</p>
              <h2>Free quote request</h2>
              <p>
                The more detail you give, the more accurate the estimate will be. Required fields are
                marked with an asterisk.
              </p>
            </div>

            {status === "error" && <div className="error-box">{errorMessage}</div>}

            <div className="section-title">Contact information</div>
            <div className="grid two">
              <label>
                Full name *
                <input name="fullName" placeholder="Your name" required />
              </label>
              <label>
                Business / company
                <input name="company" placeholder="Company name" />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="name@example.com" />
              </label>
              <label>
                WhatsApp number *
                <input name="whatsapp" placeholder="+962 7X XXX XXXX" required />
              </label>
              <label>
                Country
                <input name="country" placeholder="Jordan, USA, UAE..." />
              </label>
              <label>
                Preferred contact method
                <select name="preferredContact" defaultValue="WhatsApp">
                  {contactMethods.map((method) => (
                    <option key={method}>{method}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="section-title">Project basics</div>
            <div className="grid two">
              <label>
                Project type
                <select name="projectType" defaultValue="Mobile app">
                  {projectTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Budget range
                <select name="budgetRange" defaultValue="Need guidance">
                  {budgetRanges.map((budget) => (
                    <option key={budget}>{budget}</option>
                  ))}
                </select>
              </label>
              <label>
                Timeline
                <select name="timeline" defaultValue="Need guidance">
                  {timelines.map((timeline) => (
                    <option key={timeline}>{timeline}</option>
                  ))}
                </select>
              </label>
              <label>
                Website or reference link
                <input name="referenceLink" placeholder="Optional link to something similar" />
              </label>
            </div>

            <div className="section-title">What do you need built?</div>
            <div className="checkbox-grid">
              {buildNeeds.map((item) => (
                <label className="check-card" key={item}>
                  <input name="buildNeeded" type="checkbox" value={item} />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <div className="section-title">Product explanation</div>
            <label>
              Describe the app, website, or system you want *
              <textarea
                name="projectIdea"
                placeholder="Example: I need a marketplace where customers request car parts, suppliers send quotes, and admins manage everything from a dashboard."
                required
                rows={6}
              />
            </label>

            <label>
              Who will use it?
              <textarea
                name="mainUsers"
                placeholder="Example: customers, suppliers, drivers, admins, employees, managers..."
                rows={4}
              />
            </label>

            <label>
              Important features
              <textarea
                name="importantFeatures"
                placeholder="Example: login, admin dashboard, payments, push notifications, chat, delivery tracking, reports..."
                rows={5}
              />
            </label>

            <label>
              Extra notes
              <textarea
                name="extraNotes"
                placeholder="Anything else I should know before quoting the project."
                rows={4}
              />
            </label>

            <button className="submit-button" disabled={status === "sending"} type="submit">
              {status === "sending" ? "Submitting request..." : "Submit free quote request"}
            </button>
          </form>
        )}
      </section>

      <footer className="footer">
        <p>© {currentYear} Darik Technologies. Built for real businesses, not just screens.</p>
      </footer>

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #050816;
        }

        .quote-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(57, 100, 255, 0.25), transparent 34rem),
            radial-gradient(circle at 85% 15%, rgba(0, 210, 255, 0.14), transparent 24rem),
            linear-gradient(180deg, #050816 0%, #081020 52%, #050816 100%);
          color: #f7f9ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 28px;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .hero,
        .form-shell,
        .footer {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 72px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.26);
          overflow: hidden;
        }

        .brand-mark img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          font-size: 15px;
          letter-spacing: 0.02em;
        }

        .brand small {
          color: #9ba8c7;
          font-size: 12px;
          margin-top: 3px;
        }

        .nav-link {
          color: #c7d2fe;
          border: 1px solid rgba(199, 210, 254, 0.18);
          padding: 11px 15px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) 380px;
          gap: 34px;
          align-items: end;
          margin-bottom: 42px;
        }

        .eyebrow {
          color: #7dd3fc;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          margin: 0 0 14px;
          text-transform: uppercase;
        }

        h1,
        h2,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 820px;
          font-size: clamp(42px, 7vw, 78px);
          line-height: 0.95;
          letter-spacing: -0.07em;
          margin-bottom: 24px;
        }

        .lead {
          color: #bdc7df;
          font-size: 18px;
          line-height: 1.75;
          max-width: 760px;
        }

        .trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .trust-row span {
          color: #dce6ff;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          padding: 10px 13px;
          font-size: 13px;
          font-weight: 700;
        }

        .side-card,
        .quote-form,
        .success-card {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(24px);
        }

        .side-card {
          border-radius: 30px;
          padding: 28px;
        }

        .side-label {
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .side-card ol {
          color: #c7d2e9;
          margin: 0;
          padding-left: 20px;
          line-height: 1.8;
        }

        .form-shell {
          margin-top: 28px;
        }

        .quote-form,
        .success-card {
          border-radius: 34px;
          padding: clamp(24px, 4vw, 44px);
        }

        .form-header {
          max-width: 760px;
          margin-bottom: 34px;
        }

        .form-header h2,
        .success-card h2 {
          font-size: clamp(30px, 4vw, 46px);
          letter-spacing: -0.04em;
          margin-bottom: 12px;
        }

        .form-header p,
        .success-card p {
          color: #b9c5dc;
          line-height: 1.7;
        }

        .section-title {
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          margin: 34px 0 14px;
          letter-spacing: -0.01em;
        }

        .grid {
          display: grid;
          gap: 18px;
        }

        .grid.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        label {
          display: grid;
          gap: 8px;
          color: #e8eeff;
          font-size: 13px;
          font-weight: 800;
        }

        input,
        select,
        textarea {
          width: 100%;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 18px;
          background: rgba(4, 9, 24, 0.78);
          outline: none;
          padding: 15px 16px;
          font: inherit;
          font-weight: 650;
        }

        textarea {
          line-height: 1.65;
          resize: vertical;
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(201, 210, 232, 0.52);
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(125, 211, 252, 0.62);
          box-shadow: 0 0 0 4px rgba(125, 211, 252, 0.1);
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .check-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #dce6ff;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
          padding: 14px;
          cursor: pointer;
        }

        .check-card input {
          width: 16px;
          height: 16px;
          accent-color: #7dd3fc;
        }

        .submit-button,
        .primary-button {
          border: 0;
          cursor: pointer;
          border-radius: 20px;
          background: linear-gradient(135deg, #ffffff, #bfe8ff);
          color: #05101f;
          font-weight: 950;
          font-size: 15px;
          padding: 17px 22px;
          margin-top: 28px;
          box-shadow: 0 22px 56px rgba(125, 211, 252, 0.2);
        }

        .submit-button {
          width: 100%;
        }

        .submit-button:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .error-box {
          color: #fecaca;
          border: 1px solid rgba(248, 113, 113, 0.28);
          background: rgba(127, 29, 29, 0.3);
          padding: 14px 16px;
          border-radius: 18px;
          margin-bottom: 22px;
          font-weight: 800;
        }

        .success-card {
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          margin: 0 auto 20px;
          color: #05101f;
          background: #86efac;
          border-radius: 999px;
          font-size: 32px;
          font-weight: 950;
        }

        .honeypot {
          position: absolute;
          left: -9999px;
          opacity: 0;
          pointer-events: none;
        }

        .footer {
          color: #7f8ba8;
          padding: 34px 0 10px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .quote-page {
            padding: 18px;
          }

          .nav {
            margin-bottom: 48px;
          }

          .hero-grid,
          .grid.two {
            grid-template-columns: 1fr;
          }

          .checkbox-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .nav {
            align-items: flex-start;
            flex-direction: column;
          }

          .nav-link {
            width: 100%;
            text-align: center;
          }

          h1 {
            font-size: 42px;
          }

          .checkbox-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}