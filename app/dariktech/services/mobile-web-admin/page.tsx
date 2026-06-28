export const metadata = {
  title: "Mobile + Web + Admin Systems | Darik Technologies",
  description:
    "A premium Darik Technologies service page explaining connected mobile apps, web portals, admin dashboards, backend logic, databases, and real business workflows.",
};

const serviceModules = [
  {
    title: "Mobile App",
    label: "iOS + Android",
    text: "A customer, staff, driver, patient, retailer, or internal-team app built around the actual job people need to do.",
    points: ["Fast mobile UX", "Push notifications", "Role-based screens", "Real workflow actions"],
    type: "mobile",
  },
  {
    title: "Web Portal",
    label: "Browser access",
    text: "A clean web experience for customers, employees, vendors, managers, or public visitors who need access from a laptop.",
    points: ["Responsive web app", "Landing pages", "Client portals", "Desktop workflows"],
    type: "web",
  },
  {
    title: "Admin Dashboard",
    label: "Control center",
    text: "The private command center where the business manages orders, users, requests, payouts, reports, approvals, and support.",
    points: ["Manage everything", "Permissions", "Reports", "Operations tools"],
    type: "admin",
  },
];

const included = [
  ["Backend & Database", "Supabase, PostgreSQL-style data structure, authentication, storage, policies, and secure business logic."],
  ["User Roles & Permissions", "Customer, staff, manager, admin, driver, vendor, support, accounting, or any role your business needs."],
  ["Real Workflows", "Bookings, orders, requests, approvals, quotes, deliveries, support tickets, payouts, billing, and reports."],
  ["Notifications", "Push notifications, status updates, alerts, reminders, and important operational messages."],
  ["Payments & Billing", "Optional payment integrations, invoices, balances, fees, receipts, payouts, and payment status tracking."],
  ["Maps & Location", "Saved locations, map search, GPS checks, distance rules, driver tracking, route logic, and location-based actions."],
  ["Support & Messages", "Support center, live chat, issue categories, conversation history, internal notes, and admin replies."],
  ["Analytics & Reports", "Sales, orders, activity, performance, payouts, user behavior, operational stats, and export-ready reports."],
  ["Security & Audit Logs", "Admin actions, access control, sensitive data rules, review queues, and accountability across the system."],
];

const capabilityTags = [
  ["Data model", "Auth", "Policies"],
  ["Roles", "Permissions", "Access"],
  ["Requests", "Approvals", "Status"],
  ["Push", "Reminders", "Alerts"],
  ["Invoices", "Fees", "Payouts"],
  ["GPS", "Maps", "Distance"],
  ["Tickets", "Chat", "Replies"],
  ["Reports", "KPIs", "Exports"],
  ["Audit", "Logs", "Reviews"],
];

const capabilityTypes = [
  "database",
  "admin",
  "workflow",
  "mobile",
  "database",
  "workflow",
  "admin",
  "database",
  "admin",
];

const process = [
  ["01", "Map the workflow", "We define every user role, every screen, and every business rule before touching design."],
  ["02", "Design the product", "We create a premium mobile/web/admin experience that feels simple even if the system is complex."],
  ["03", "Build the backend", "We structure the database, auth, storage, permissions, APIs, and operational logic correctly."],
  ["04", "Connect the apps", "Mobile, web, and admin all work off the same live system so the business runs in real time."],
  ["05", "Test real scenarios", "Orders, bookings, payouts, approvals, support, notifications, and edge cases are tested like a real launch."],
  ["06", "Launch and improve", "After launch, the system can expand with more roles, features, branches, markets, or dashboards."],
];

const processDetails = [
  ["Roles", "Rules", "Data"],
  ["UX", "Screens", "Prototype"],
  ["Auth", "Database", "APIs"],
  ["Mobile", "Web", "Admin"],
  ["QA", "Edge cases", "Launch check"],
  ["Scale", "New roles", "Reports"],
];

function LineIcon({ type }: { type: string }) {
  if (type === "mobile") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3.8h8a2 2 0 0 1 2 2v12.4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2z" />
        <path d="M10 6.7h4" />
        <path d="M10.5 17.4h3" />
      </svg>
    );
  }

  if (type === "web") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6.2h16v11.6H4z" />
        <path d="M4 9.3h16" />
        <path d="M7 7.8h.1" />
        <path d="M9.2 7.8h.1" />
        <path d="M7.2 12.1h5.8" />
        <path d="M7.2 14.7h9.6" />
      </svg>
    );
  }

  if (type === "admin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.5h15" />
        <path d="M4.5 12h15" />
        <path d="M4.5 17.5h15" />
        <path d="M9 4.8v3.4" />
        <path d="M15 10.3v3.4" />
        <path d="M11.5 15.8v3.4" />
      </svg>
    );
  }

  if (type === "database") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z" />
        <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
        <path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6.5h4.2v4.2H6z" />
      <path d="M13.8 6.5H18v4.2h-4.2z" />
      <path d="M9.8 15.2H14v4.2H9.8z" />
      <path d="M10.2 8.6h3.6" />
      <path d="m15.9 10.7-2.1 4.5" />
      <path d="m8.1 10.7 2.1 4.5" />
    </svg>
  );
}

function ModulePreview({ type }: { type: string }) {
  if (type === "mobile") {
    return (
      <div className="mw-module-preview mw-module-preview-mobile" aria-hidden="true">
        <div className="mw-preview-phone">
          <div className="mw-preview-status"><span>9:41</span><i /></div>
          <div className="mw-preview-top"><strong>Mobile App</strong><span>Live</span></div>
          <div className="mw-preview-hero-card" />
          <div className="mw-preview-chip-row"><i /><i /><i /></div>
          <div className="mw-preview-list"><span /><span /><span /></div>
          <div className="mw-preview-action">Submit request</div>
        </div>
      </div>
    );
  }

  if (type === "web") {
    return (
      <div className="mw-module-preview mw-module-preview-web" aria-hidden="true">
        <div className="mw-preview-browser">
          <div className="mw-preview-browser-top">
            <span /><span /><span />
            <b>Web Portal</b>
          </div>
          <div className="mw-preview-browser-grid">
            <aside><i /><i /><i /><i /></aside>
            <main>
              <div className="mw-preview-web-title"><strong>Client Portal</strong><span>Active</span></div>
              <div className="mw-preview-web-kpis"><i /><i /><i /></div>
              <div className="mw-preview-web-table"><span /><span /><span /></div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mw-module-preview mw-module-preview-admin" aria-hidden="true">
      <div className="mw-preview-admin">
        <div className="mw-preview-admin-top"><strong>Admin Dashboard</strong><span>Control</span></div>
        <div className="mw-preview-admin-tabs"><i /><i /><i /><i /></div>
        <div className="mw-preview-admin-body">
          <div className="mw-preview-admin-kpis"><span /><span /></div>
          <div className="mw-preview-admin-list"><i /><i /><i /></div>
          <div className="mw-preview-admin-map"><b /><b /><em /></div>
        </div>
      </div>
    </div>
  );
}

function HeroSystemVisual() {
  return (
    <div className="mw-hero-visual" aria-hidden="true">
      <div className="mw-web-window">
        <div className="mw-window-top">
          <div><i /><i /><i /></div>
          <span>Admin Dashboard</span>
        </div>

        <div className="mw-dashboard">
          <div className="mw-side-nav">
            <b />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="mw-dashboard-main">
            <div className="mw-dash-title">
              <strong>Operations Control</strong>
              <span>Live system</span>
            </div>
            <div className="mw-kpis">
              <div><span>Orders</span><strong>342</strong></div>
              <div><span>Users</span><strong>8.6k</strong></div>
              <div><span>Tasks</span><strong>25</strong></div>
            </div>
            <div className="mw-table">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>

      <div className="mw-phone">
        <div className="mw-phone-screen">
          <div className="mw-phone-status"><span>9:41</span><i /></div>
          <div className="mw-phone-top"><strong>Mobile App</strong><span>Live</span></div>
          <div className="mw-phone-card" />
          <div className="mw-phone-grid"><i /><i /><i /><i /></div>
          <div className="mw-phone-action">Submit request</div>
        </div>
      </div>

      <div className="mw-floating-card mw-float-one">
        <span>Backend</span>
        <strong>Database + auth + logic</strong>
      </div>

      <div className="mw-floating-card mw-float-two">
        <span>Web Portal</span>
        <strong>Desktop workflows connected</strong>
      </div>
    </div>
  );
}

export default function MobileWebAdminPage() {
  const quoteHref = "/dariktech/quote";

  return (
    <main className="mw-page">
      <style>{`
        :root {
          --mw-bg: #06101d;
          --mw-card: rgba(255, 255, 255, 0.055);
          --mw-line: rgba(255, 255, 255, 0.1);
          --mw-text: #f7fbff;
          --mw-muted: rgba(247, 251, 255, 0.62);
          --mw-cyan: #62d6ff;
          --mw-violet: #b8a8ff;
          --mw-green: #7df7e7;
        }

        html,
        body {
          margin: 0;
          background: var(--mw-bg);
        }

        .mw-page {
          min-height: 100vh;
          color: var(--mw-text);
          background:
            radial-gradient(circle at 14% 6%, rgba(98, 214, 255, 0.18), transparent 27rem),
            radial-gradient(circle at 86% 12%, rgba(184, 168, 255, 0.16), transparent 25rem),
            radial-gradient(circle at 50% 92%, rgba(125, 247, 231, 0.08), transparent 25rem),
            linear-gradient(180deg, #06101d 0%, #081425 48%, #050b14 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        .mw-page *,
        .mw-page *::before,
        .mw-page *::after {
          box-sizing: border-box;
        }

        .mw-shell {
          width: min(1180px, calc(100% - 42px));
          margin: 0 auto;
        }

        .mw-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(6, 16, 29, 0.82);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(22px);
        }

        .mw-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 82px;
        }

        .mw-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
        }

        .mw-logo {
          display: grid;
          place-items: center;
          width: 50px;
          height: 50px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 35% 18%, rgba(98, 214, 255, 0.2), transparent 3rem),
            rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(98, 214, 255, 0.22);
          box-shadow: 0 18px 44px rgba(98, 214, 255, 0.1);
        }

        .mw-logo img {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .mw-brand strong {
          display: block;
          font-size: 15px;
          line-height: 1;
        }

        .mw-brand span {
          display: block;
          margin-top: 5px;
          color: rgba(247, 251, 255, 0.45);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .mw-nav-links {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .mw-nav-links a {
          color: rgba(247, 251, 255, 0.7);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .mw-nav-links .mw-quote {
          display: inline-flex;
          align-items: center;
          min-height: 42px;
          padding: 0 15px;
          border-radius: 999px;
          color: #06101d;
          background: linear-gradient(135deg, #9be9ff, #62d6ff 48%, #b8a8ff);
          box-shadow: 0 18px 42px rgba(98, 214, 255, 0.18);
          font-weight: 950;
        }

        .mw-hero {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(440px, 1.08fr);
          gap: clamp(34px, 6vw, 76px);
          align-items: center;
          min-height: calc(100vh - 82px);
          padding: clamp(58px, 7vw, 96px) 0;
        }

        .mw-back {
          display: inline-flex;
          width: fit-content;
          margin-bottom: 18px;
          color: rgba(247, 251, 255, 0.58);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .mw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 36px;
          padding: 8px 11px;
          border-radius: 999px;
          color: #bdefff;
          background: rgba(98, 214, 255, 0.1);
          border: 1px solid rgba(98, 214, 255, 0.22);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mw-eyebrow::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--mw-cyan);
          box-shadow: 0 0 0 6px rgba(98, 214, 255, 0.09), 0 0 22px rgba(98, 214, 255, 0.54);
        }

        .mw-hero h1 {
          margin: 20px 0 20px;
          max-width: 760px;
          color: #ffffff;
          font-size: clamp(56px, 8vw, 104px);
          line-height: 0.88;
          letter-spacing: -0.09em;
          text-wrap: balance;
        }

        .mw-hero h1 span {
          background: linear-gradient(90deg, #62d6ff, #7df7e7 45%, #b8a8ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .mw-hero-lede {
          max-width: 650px;
          margin: 0;
          color: rgba(247, 251, 255, 0.78);
          font-size: clamp(21px, 2.3vw, 32px);
          line-height: 1.18;
          letter-spacing: -0.05em;
          font-weight: 780;
          text-wrap: balance;
        }

        .mw-hero-copy {
          max-width: 640px;
          margin: 20px 0 0;
          color: var(--mw-muted);
          font-size: 16px;
          line-height: 1.74;
        }

        .mw-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 32px;
        }

        .mw-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 54px;
          padding: 0 19px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 950;
          transition: transform 160ms ease;
        }

        .mw-button:hover {
          transform: translateY(-2px);
        }

        .mw-button-primary {
          color: #06101d;
          background: linear-gradient(135deg, #9be9ff, #62d6ff 48%, #b8a8ff);
          box-shadow: 0 22px 56px rgba(98, 214, 255, 0.22);
        }

        .mw-button-secondary {
          color: rgba(247, 251, 255, 0.88);
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.11);
        }

        .mw-hero-points {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 28px;
          max-width: 720px;
        }

        .mw-point {
          padding: 13px;
          border-radius: 19px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
          color: rgba(247, 251, 255, 0.78);
          font-size: 12px;
          font-weight: 850;
          line-height: 1.35;
        }

        .mw-point strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          line-height: 1;
          margin-bottom: 6px;
        }

        .mw-hero-visual {
          position: relative;
          min-height: 560px;
          perspective: 1200px;
        }

        .mw-hero-visual::before {
          content: "";
          position: absolute;
          inset: 8% 0 5% 10%;
          border-radius: 999px;
          background:
            radial-gradient(circle at 48% 42%, rgba(98, 214, 255, 0.24), transparent 18rem),
            radial-gradient(circle at 66% 58%, rgba(184, 168, 255, 0.18), transparent 20rem);
          filter: blur(20px);
          opacity: 0.82;
        }

        .mw-web-window {
          position: absolute;
          right: 0;
          top: 34px;
          width: 86%;
          min-height: 395px;
          border-radius: 30px;
          padding: 15px;
          background: linear-gradient(180deg, #17263a, #071120);
          border: 1px solid rgba(255, 255, 255, 0.13);
          box-shadow:
            0 38px 110px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: rotateY(-5deg) rotateX(1deg);
          overflow: hidden;
        }

        .mw-window-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 34px;
          color: rgba(247, 251, 255, 0.52);
          font-size: 11px;
          font-weight: 850;
        }

        .mw-window-top div {
          display: flex;
          gap: 7px;
        }

        .mw-window-top i {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: rgba(247, 251, 255, 0.24);
        }

        .mw-window-top i:first-child {
          background: var(--mw-cyan);
          box-shadow: 0 0 18px rgba(98, 214, 255, 0.5);
        }

        .mw-dashboard {
          display: grid;
          grid-template-columns: 96px 1fr;
          gap: 13px;
          min-height: 330px;
          padding: 14px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 84% 10%, rgba(98, 214, 255, 0.11), transparent 11rem),
            #f7fbff;
        }

        .mw-side-nav {
          display: grid;
          align-content: start;
          gap: 10px;
          padding: 12px;
          border-radius: 18px;
          background: #071120;
        }

        .mw-side-nav b {
          width: 42px;
          height: 42px;
          border-radius: 15px;
          background: var(--mw-cyan);
        }

        .mw-side-nav span {
          height: 25px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
        }

        .mw-side-nav span:nth-child(2) {
          background: rgba(98, 214, 255, 0.28);
        }

        .mw-dashboard-main {
          min-width: 0;
        }

        .mw-dash-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .mw-dash-title strong {
          color: #071120;
          font-size: 21px;
          letter-spacing: -0.05em;
        }

        .mw-dash-title span {
          padding: 7px 9px;
          border-radius: 999px;
          color: #071120;
          background: #dff8ff;
          font-size: 10px;
          font-weight: 950;
        }

        .mw-kpis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .mw-kpis div {
          min-height: 86px;
          padding: 13px;
          border-radius: 17px;
          background: #ffffff;
          border: 1px solid rgba(7, 17, 32, 0.08);
          box-shadow: 0 10px 26px rgba(7, 17, 32, 0.04);
        }

        .mw-kpis span {
          display: block;
          color: rgba(7, 17, 32, 0.52);
          font-size: 10px;
          font-weight: 950;
        }

        .mw-kpis strong {
          display: block;
          margin-top: 9px;
          color: #071120;
          font-size: 25px;
          letter-spacing: -0.05em;
        }

        .mw-table {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        .mw-table i {
          height: 44px;
          border-radius: 15px;
          background:
            linear-gradient(90deg, rgba(7, 17, 32, 0.1) 0 56%, rgba(98, 214, 255, 0.18) 56% 78%, rgba(7, 17, 32, 0.055) 78%);
        }

        .mw-phone {
          position: absolute;
          left: 2px;
          bottom: 18px;
          width: 220px;
          height: 420px;
          border-radius: 40px;
          padding: 12px;
          background: linear-gradient(180deg, #17263a, #071120);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 38px 100px rgba(0, 0, 0, 0.32);
          transform: rotate(-2deg);
        }

        .mw-phone::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 15px;
          width: 58px;
          height: 7px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.14);
          z-index: 3;
        }

        .mw-phone-screen {
          position: relative;
          height: 100%;
          padding: 26px 14px 14px;
          border-radius: 31px;
          background: #f7fbff;
          overflow: hidden;
        }

        .mw-phone-status,
        .mw-phone-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mw-phone-status {
          color: rgba(7, 17, 32, 0.5);
          font-size: 9px;
          font-weight: 950;
          margin-bottom: 12px;
        }

        .mw-phone-status i {
          width: 25px;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(90deg, #071120 0 45%, rgba(7, 17, 32, 0.18) 45%);
        }

        .mw-phone-top strong {
          color: #071120;
          font-size: 18px;
          letter-spacing: -0.045em;
        }

        .mw-phone-top span {
          display: grid;
          place-items: center;
          min-width: 40px;
          height: 25px;
          border-radius: 999px;
          color: #06101d;
          background: var(--mw-cyan);
          font-size: 9px;
          font-weight: 950;
        }

        .mw-phone-card {
          height: 92px;
          margin-top: 14px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 80% 14%, rgba(98, 214, 255, 0.36), transparent 4rem),
            linear-gradient(135deg, rgba(98, 214, 255, 0.2), rgba(184, 168, 255, 0.16));
          border: 1px solid rgba(7, 17, 32, 0.08);
        }

        .mw-phone-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 12px;
        }

        .mw-phone-grid i {
          height: 62px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(7, 17, 32, 0.07);
          box-shadow: 0 10px 24px rgba(7, 17, 32, 0.04);
        }

        .mw-phone-action {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          display: grid;
          place-items: center;
          min-height: 42px;
          border-radius: 999px;
          color: #06101d;
          background: linear-gradient(135deg, #9be9ff, #62d6ff);
          font-size: 12px;
          font-weight: 950;
        }

        .mw-floating-card {
          position: absolute;
          z-index: 4;
          width: 220px;
          padding: 15px;
          border-radius: 23px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.13);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.26);
          backdrop-filter: blur(18px);
        }

        .mw-floating-card span {
          display: block;
          color: var(--mw-cyan);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .mw-floating-card strong {
          display: block;
          margin-top: 8px;
          color: #ffffff;
          font-size: 15px;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .mw-float-one {
          right: 18px;
          bottom: 30px;
        }

        .mw-float-two {
          left: 220px;
          top: 0;
        }

        .mw-section {
          position: relative;
          padding: 66px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .mw-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .mw-section-head h2 {
          margin: 0;
          max-width: 760px;
          color: #ffffff;
          font-size: clamp(36px, 5vw, 62px);
          line-height: 0.95;
          letter-spacing: -0.075em;
          text-wrap: balance;
        }

        .mw-section-head p {
          max-width: 460px;
          margin: 0;
          color: var(--mw-muted);
          font-size: 15px;
          line-height: 1.7;
        }

        .mw-module-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .mw-module-card {
          position: relative;
          overflow: hidden;
          min-height: 430px;
          padding: 22px;
          border-radius: 32px;
          background:
            radial-gradient(circle at 84% 8%, rgba(98, 214, 255, 0.13), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.032));
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .mw-module-card:nth-child(2) {
          background:
            radial-gradient(circle at 84% 8%, rgba(125, 247, 231, 0.11), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.032));
        }

        .mw-module-card:nth-child(3) {
          background:
            radial-gradient(circle at 84% 8%, rgba(184, 168, 255, 0.13), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.032));
        }

        .mw-module-icon {
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          border-radius: 18px;
          color: var(--mw-cyan);
          background: rgba(98, 214, 255, 0.08);
          border: 1px solid rgba(98, 214, 255, 0.2);
          box-shadow: 0 18px 42px rgba(98, 214, 255, 0.08);
        }

        .mw-module-icon svg,
        .mw-include-icon svg {
          width: 25px;
          height: 25px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .mw-module-label {
          display: inline-flex;
          margin-top: 20px;
          min-height: 30px;
          align-items: center;
          padding: 0 10px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.72);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .mw-module-card h3 {
          margin: 18px 0 12px;
          color: #ffffff;
          font-size: 32px;
          line-height: 0.95;
          letter-spacing: -0.065em;
        }

        .mw-module-card p {
          margin: 0;
          color: var(--mw-muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .mw-module-card ul {
          display: grid;
          gap: 10px;
          margin: 22px 0 0;
          padding: 0;
          list-style: none;
        }

        .mw-module-card li {
          display: flex;
          align-items: center;
          gap: 9px;
          color: rgba(247, 251, 255, 0.76);
          font-size: 13px;
          font-weight: 850;
        }

        .mw-module-card li::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--mw-cyan);
          box-shadow: 0 0 18px rgba(98, 214, 255, 0.44);
        }

        .mw-architecture {
          padding: 28px;
          border-radius: 38px;
          background:
            radial-gradient(circle at 50% 40%, rgba(98, 214, 255, 0.14), transparent 24rem),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025));
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 90px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .mw-architecture-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 170px 1fr 1fr;
          align-items: center;
          gap: 14px;
          min-height: 260px;
        }

        .mw-arch-node {
          min-height: 120px;
          padding: 17px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.11);
        }

        .mw-arch-node strong {
          display: block;
          color: #ffffff;
          font-size: 17px;
          letter-spacing: -0.035em;
        }

        .mw-arch-node span {
          display: block;
          margin-top: 8px;
          color: rgba(247, 251, 255, 0.58);
          font-size: 12px;
          line-height: 1.4;
        }

        .mw-arch-core {
          display: grid;
          place-items: center;
          width: 170px;
          height: 170px;
          border-radius: 999px;
          color: #06101d;
          background: linear-gradient(135deg, #9be9ff, #62d6ff, #b8a8ff);
          box-shadow: 0 0 0 14px rgba(98, 214, 255, 0.055), 0 0 80px rgba(98, 214, 255, 0.18);
          font-size: 15px;
          font-weight: 950;
          text-align: center;
          line-height: 1.15;
        }

        .mw-include-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .mw-include-card {
          min-height: 210px;
          padding: 20px;
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.028));
          border: 1px solid rgba(255,255,255,0.09);
        }

        .mw-include-icon {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 16px;
          color: var(--mw-cyan);
          background: rgba(98, 214, 255, 0.08);
          border: 1px solid rgba(98, 214, 255, 0.18);
        }

        .mw-include-card h3 {
          margin: 16px 0 9px;
          color: #ffffff;
          font-size: 20px;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .mw-include-card p {
          margin: 0;
          color: var(--mw-muted);
          font-size: 13.5px;
          line-height: 1.55;
        }

        .mw-process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .mw-process-card {
          min-height: 190px;
          padding: 20px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .mw-process-card span {
          display: inline-flex;
          min-height: 32px;
          align-items: center;
          padding: 0 10px;
          border-radius: 999px;
          color: #06101d;
          background: var(--mw-cyan);
          font-size: 12px;
          font-weight: 950;
        }

        .mw-process-card h3 {
          margin: 16px 0 8px;
          color: #ffffff;
          font-size: 21px;
          letter-spacing: -0.045em;
        }

        .mw-process-card p {
          margin: 0;
          color: var(--mw-muted);
          font-size: 13.5px;
          line-height: 1.55;
        }

        .mw-final {
          margin: 30px auto 60px;
          padding: clamp(28px, 5vw, 54px);
          border-radius: 40px;
          background:
            radial-gradient(circle at 84% 12%, rgba(98, 214, 255, 0.22), transparent 20rem),
            radial-gradient(circle at 14% 80%, rgba(184, 168, 255, 0.15), transparent 18rem),
            linear-gradient(135deg, rgba(255,255,255,0.095), rgba(255,255,255,0.032));
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.22);
        }

        .mw-final-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 28px;
          align-items: center;
        }

        .mw-final h2 {
          margin: 0;
          max-width: 760px;
          color: #ffffff;
          font-size: clamp(38px, 5.5vw, 72px);
          line-height: 0.92;
          letter-spacing: -0.085em;
          text-wrap: balance;
        }

        .mw-final p {
          max-width: 680px;
          margin: 16px 0 0;
          color: var(--mw-muted);
          font-size: 16px;
          line-height: 1.7;
        }

        @media (max-width: 1080px) {
          .mw-hero,
          .mw-final-grid {
            grid-template-columns: 1fr;
          }

          .mw-hero-visual {
            max-width: 740px;
            margin: 0 auto;
            width: 100%;
          }

          .mw-module-grid,
          .mw-include-grid,
          .mw-process-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .mw-architecture-grid {
            grid-template-columns: 1fr;
          }

          .mw-arch-core {
            margin: 0 auto;
          }
        }

        @media (max-width: 720px) {
          .mw-shell {
            width: min(100% - 26px, 1180px);
          }

          .mw-nav-inner {
            min-height: 72px;
          }

          .mw-brand span span,
          .mw-nav-links a:not(.mw-quote) {
            display: none;
          }

          .mw-logo {
            width: 44px;
            height: 44px;
            border-radius: 16px;
          }

          .mw-logo img {
            width: 32px;
            height: 32px;
          }

          .mw-nav-links .mw-quote {
            min-height: 40px;
            padding: 0 12px;
            font-size: 12px;
          }

          .mw-hero {
            min-height: auto;
            padding: 42px 0 56px;
          }

          .mw-hero h1 {
            font-size: clamp(48px, 14vw, 72px);
          }

          .mw-hero-lede {
            font-size: 20px;
          }

          .mw-actions {
            display: grid;
          }

          .mw-hero-points {
            grid-template-columns: 1fr;
          }

          .mw-hero-visual {
            min-height: 650px;
          }

          .mw-web-window {
            left: 0;
            right: 0;
            top: 0;
            width: 100%;
            min-height: 335px;
            transform: none;
          }

          .mw-dashboard {
            grid-template-columns: 1fr;
            min-height: 270px;
          }

          .mw-side-nav {
            display: none;
          }

          .mw-kpis {
            grid-template-columns: 1fr;
          }

          .mw-kpis div {
            min-height: 58px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .mw-kpis strong {
            margin-top: 0;
            font-size: 19px;
          }

          .mw-table i {
            height: 32px;
          }

          .mw-phone {
            left: 14px;
            bottom: 0;
            width: 196px;
            height: 374px;
          }

          .mw-float-one {
            right: 0;
            bottom: 58px;
          }

          .mw-float-two {
            left: auto;
            right: 0;
            top: 346px;
          }

          .mw-floating-card {
            width: 176px;
            padding: 12px;
            border-radius: 20px;
          }

          .mw-section {
            padding: 46px 0;
          }

          .mw-section-head {
            flex-direction: column;
            align-items: start;
          }

          .mw-module-grid,
          .mw-include-grid,
          .mw-process-grid {
            grid-template-columns: 1fr;
          }

          .mw-module-card {
            min-height: auto;
          }

          .mw-architecture {
            padding: 20px;
            border-radius: 30px;
          }

          .mw-arch-core {
            width: 140px;
            height: 140px;
          }

          .mw-final {
            border-radius: 30px;
          }
        }

        @media (max-width: 450px) {
          .mw-hero-visual {
            min-height: 620px;
          }

          .mw-web-window {
            min-height: 315px;
          }

          .mw-phone {
            width: 178px;
            height: 340px;
          }

          .mw-phone-grid i {
            height: 48px;
          }

          .mw-floating-card {
            width: 160px;
          }

          .mw-float-two {
            top: 326px;
          }
        }

        /* Task 23: OpenAI-level hero and navigation polish */
        .mw-nav {
          background:
            linear-gradient(180deg, rgba(6, 16, 29, 0.92), rgba(6, 16, 29, 0.72));
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.16);
        }

        .mw-nav-inner {
          min-height: 86px;
        }

        .mw-brand {
          transition: opacity 160ms ease, transform 160ms ease;
        }

        .mw-brand:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }

        .mw-nav-links a:not(.mw-quote) {
          position: relative;
          transition: color 160ms ease;
        }

        .mw-nav-links a:not(.mw-quote)::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -9px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, var(--mw-cyan), transparent);
          transform: scaleX(0);
          transition: transform 160ms ease;
        }

        .mw-nav-links a:not(.mw-quote):hover {
          color: #ffffff;
        }

        .mw-nav-links a:not(.mw-quote):hover::after {
          transform: scaleX(1);
        }

        .mw-nav-links .mw-quote {
          position: relative;
          overflow: hidden;
          color: #06101d;
          background:
            radial-gradient(circle at 24% 0%, rgba(255, 255, 255, 0.72), transparent 4rem),
            linear-gradient(135deg, #d9f7ff 0%, #62d6ff 42%, #b8a8ff 100%);
          border: 1px solid rgba(255, 255, 255, 0.26);
          box-shadow:
            0 18px 46px rgba(98, 214, 255, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.42);
        }

        .mw-nav-links .mw-quote::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.26), transparent 48%, rgba(255, 255, 255, 0.2));
          opacity: 0.7;
          pointer-events: none;
        }

        .mw-hero {
          position: relative;
          isolation: isolate;
        }

        .mw-hero::before {
          content: "";
          position: absolute;
          inset: -86px calc(50% - 50vw) 0;
          z-index: -2;
          background:
            radial-gradient(circle at 12% 18%, rgba(98, 214, 255, 0.2), transparent 28rem),
            radial-gradient(circle at 82% 8%, rgba(184, 168, 255, 0.18), transparent 28rem),
            radial-gradient(circle at 48% 88%, rgba(125, 247, 231, 0.09), transparent 28rem),
            linear-gradient(180deg, #06101d 0%, #071323 58%, #050b14 100%);
        }

        .mw-hero::after {
          content: "";
          position: absolute;
          left: calc(50% - 50vw);
          right: calc(50% - 50vw);
          bottom: 0;
          z-index: -1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(247, 251, 255, 0.12), transparent);
        }

        .mw-hero-pretitle-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .mw-created-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 36px;
          padding: 8px 11px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.76);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.082), rgba(255, 255, 255, 0.032));
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .mw-created-badge::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--mw-violet);
          box-shadow: 0 0 0 6px rgba(184, 168, 255, 0.08), 0 0 22px rgba(184, 168, 255, 0.48);
        }

        .mw-hero h1 {
          max-width: 860px;
          margin-top: 24px;
          font-size: clamp(64px, 8.8vw, 118px);
          line-height: 0.84;
          letter-spacing: -0.105em;
        }

        .mw-hero h1 span {
          background:
            linear-gradient(90deg, #62d6ff 0%, #7df7e7 38%, #b8a8ff 78%, #ffffff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 24px rgba(98, 214, 255, 0.11));
        }

        .mw-hero-lede {
          max-width: 740px;
          color: rgba(247, 251, 255, 0.84);
          font-size: clamp(23px, 2.6vw, 36px);
          line-height: 1.12;
        }

        .mw-hero-copy {
          max-width: 710px;
          color: rgba(247, 251, 255, 0.64);
          font-size: 16.5px;
        }

        .mw-actions {
          margin-top: 36px;
        }

        .mw-button {
          position: relative;
          overflow: hidden;
          min-height: 58px;
          padding: 0 22px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09);
        }

        .mw-button-primary {
          background:
            radial-gradient(circle at 24% 0%, rgba(255, 255, 255, 0.78), transparent 5rem),
            linear-gradient(135deg, #d9f7ff 0%, #62d6ff 44%, #b8a8ff 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow:
            0 26px 70px rgba(98, 214, 255, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.42);
        }

        .mw-button-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.24), transparent 48%, rgba(255, 255, 255, 0.16));
          pointer-events: none;
        }

        .mw-button-secondary {
          color: rgba(247, 251, 255, 0.9);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035));
          border: 1px solid rgba(255, 255, 255, 0.13);
          box-shadow:
            0 18px 54px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.09);
        }

        .mw-hero-points {
          gap: 12px;
          margin-top: 32px;
        }

        .mw-point {
          position: relative;
          overflow: hidden;
          min-height: 112px;
          padding: 16px;
          border-radius: 24px;
          background:
            radial-gradient(circle at 84% 0%, rgba(98, 214, 255, 0.12), transparent 8rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.028));
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow:
            0 18px 54px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .mw-point::before {
          content: "";
          display: block;
          width: 34px;
          height: 3px;
          margin-bottom: 14px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--mw-cyan), transparent);
          box-shadow: 0 0 20px rgba(98, 214, 255, 0.28);
        }

        .mw-point:nth-child(2)::before {
          background: linear-gradient(90deg, var(--mw-green), transparent);
        }

        .mw-point:nth-child(3)::before {
          background: linear-gradient(90deg, var(--mw-violet), transparent);
        }

        .mw-point strong {
          font-size: 15px;
        }

        .mw-point span {
          display: block;
          color: rgba(247, 251, 255, 0.56);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.42;
        }

        .mw-hero-visual {
          min-height: 610px;
        }

        .mw-web-window {
          right: -8px;
          top: 54px;
          width: 90%;
          min-height: 420px;
          border-radius: 34px;
          background:
            radial-gradient(circle at 26% 0%, rgba(98, 214, 255, 0.14), transparent 12rem),
            linear-gradient(180deg, #1b2e45, #071120);
          box-shadow:
            0 46px 130px rgba(0, 0, 0, 0.38),
            0 0 0 1px rgba(98, 214, 255, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .mw-web-window::after {
          content: "";
          position: absolute;
          left: 50px;
          right: 50px;
          bottom: -14px;
          height: 18px;
          border-radius: 0 0 28px 28px;
          background: linear-gradient(180deg, #1c2e42, #071120);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
        }

        .mw-dashboard {
          min-height: 354px;
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow: inset 0 0 0 1px rgba(7, 17, 32, 0.035);
        }

        .mw-phone {
          bottom: 30px;
          width: 232px;
          height: 438px;
          border-radius: 43px;
        }

        .mw-floating-card {
          background:
            radial-gradient(circle at 80% 0%, rgba(98, 214, 255, 0.14), transparent 6rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.115), rgba(255, 255, 255, 0.046));
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .mw-float-one {
          right: 0;
          bottom: 40px;
        }

        .mw-float-two {
          left: 218px;
          top: 10px;
        }

        @media (max-width: 1080px) {
          .mw-hero h1 {
            font-size: clamp(58px, 12vw, 104px);
          }

          .mw-hero-visual {
            max-width: 780px;
          }
        }

        @media (max-width: 720px) {
          .mw-nav-inner {
            min-height: 74px;
          }

          .mw-hero {
            padding-top: 38px;
          }

          .mw-hero-pretitle-row {
            gap: 8px;
          }

          .mw-created-badge,
          .mw-eyebrow {
            min-height: 34px;
            font-size: 9.5px;
          }

          .mw-hero h1 {
            margin-top: 20px;
            font-size: clamp(52px, 15vw, 76px);
          }

          .mw-hero-lede {
            font-size: 21px;
          }

          .mw-button {
            width: 100%;
          }

          .mw-point {
            min-height: auto;
          }

          .mw-hero-visual {
            min-height: 674px;
          }

          .mw-web-window {
            top: 0;
            right: 0;
            min-height: 348px;
            border-radius: 30px;
          }

          .mw-web-window::after {
            left: 34px;
            right: 34px;
          }

          .mw-phone {
            left: 12px;
            width: 202px;
            height: 384px;
          }

          .mw-float-two {
            top: 360px;
          }

          .mw-float-one {
            bottom: 42px;
          }
        }

        @media (max-width: 450px) {
          .mw-created-badge {
            order: 3;
          }

          .mw-hero-visual {
            min-height: 638px;
          }

          .mw-web-window {
            min-height: 318px;
          }

          .mw-phone {
            width: 184px;
            height: 350px;
          }

          .mw-float-two {
            top: 330px;
          }
        }


        /* Task 24: premium module cards for Mobile + Web + Admin */
        .mw-module-grid {
          gap: 22px;
        }

        .mw-module-card {
          position: relative;
          min-height: 620px;
          padding: 22px;
          border-radius: 36px;
          background:
            radial-gradient(circle at 86% 9%, rgba(98, 214, 255, 0.18), transparent 14rem),
            radial-gradient(circle at 16% 92%, rgba(184, 168, 255, 0.1), transparent 13rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.035));
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 34px 96px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.11);
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .mw-module-card:nth-child(2) {
          background:
            radial-gradient(circle at 86% 9%, rgba(125, 247, 231, 0.16), transparent 14rem),
            radial-gradient(circle at 16% 92%, rgba(98, 214, 255, 0.1), transparent 13rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.035));
        }

        .mw-module-card:nth-child(3) {
          background:
            radial-gradient(circle at 86% 9%, rgba(184, 168, 255, 0.18), transparent 14rem),
            radial-gradient(circle at 16% 92%, rgba(98, 214, 255, 0.08), transparent 13rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.035));
        }

        .mw-module-card::before {
          content: "";
          position: absolute;
          left: 28px;
          right: 28px;
          top: 0;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--mw-cyan), transparent);
          box-shadow: 0 0 30px rgba(98, 214, 255, 0.3);
        }

        .mw-module-card:nth-child(2)::before {
          background: linear-gradient(90deg, transparent, var(--mw-green), transparent);
          box-shadow: 0 0 30px rgba(125, 247, 231, 0.25);
        }

        .mw-module-card:nth-child(3)::before {
          background: linear-gradient(90deg, transparent, var(--mw-violet), transparent);
          box-shadow: 0 0 30px rgba(184, 168, 255, 0.25);
        }

        .mw-module-card:hover {
          transform: translateY(-8px);
          border-color: rgba(98, 214, 255, 0.26);
          box-shadow:
            0 44px 116px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(98, 214, 255, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .mw-module-card-head {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .mw-module-card-head .mw-module-label {
          margin-top: 0;
        }

        .mw-module-icon {
          width: 54px;
          height: 54px;
          border-radius: 19px;
          color: var(--mw-cyan);
          background:
            radial-gradient(circle at 50% 0%, rgba(98, 214, 255, 0.2), transparent 4rem),
            rgba(98, 214, 255, 0.085);
          box-shadow:
            0 18px 44px rgba(98, 214, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .mw-module-card:nth-child(2) .mw-module-icon {
          color: var(--mw-green);
          background:
            radial-gradient(circle at 50% 0%, rgba(125, 247, 231, 0.17), transparent 4rem),
            rgba(125, 247, 231, 0.07);
          border-color: rgba(125, 247, 231, 0.18);
        }

        .mw-module-card:nth-child(3) .mw-module-icon {
          color: var(--mw-violet);
          background:
            radial-gradient(circle at 50% 0%, rgba(184, 168, 255, 0.18), transparent 4rem),
            rgba(184, 168, 255, 0.07);
          border-color: rgba(184, 168, 255, 0.18);
        }

        .mw-module-label {
          color: rgba(247, 251, 255, 0.7);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.086), rgba(255, 255, 255, 0.032));
          border-color: rgba(255, 255, 255, 0.11);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .mw-module-preview {
          position: relative;
          z-index: 2;
          height: 232px;
          margin-bottom: 24px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 50% 0%, rgba(98, 214, 255, 0.14), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.028));
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.09);
          overflow: hidden;
        }

        .mw-module-preview::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.5;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 76%);
        }

        .mw-preview-phone {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 132px;
          height: 212px;
          padding: 9px;
          border-radius: 27px 27px 0 0;
          background: linear-gradient(180deg, #182941, #071120);
          border: 1px solid rgba(255, 255, 255, 0.14);
          transform: translateX(-50%);
          box-shadow: 0 24px 58px rgba(0, 0, 0, 0.28);
        }

        .mw-preview-phone::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 10px;
          width: 38px;
          height: 5px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.16);
          z-index: 3;
        }

        .mw-preview-phone > * {
          position: relative;
          z-index: 2;
        }

        .mw-preview-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 18px 0 8px;
          color: rgba(7, 17, 32, 0.44);
          font-size: 7px;
          font-weight: 950;
        }

        .mw-preview-status i {
          width: 18px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, #071120 0 45%, rgba(7, 17, 32, 0.16) 45%);
        }

        .mw-preview-phone::after {
          content: "";
          position: absolute;
          inset: 9px;
          border-radius: 20px 20px 0 0;
          background: #f7fbff;
        }

        .mw-preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 7px;
        }

        .mw-preview-top strong {
          color: #071120;
          font-size: 11px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .mw-preview-top span {
          display: grid;
          place-items: center;
          min-width: 28px;
          height: 18px;
          border-radius: 999px;
          color: #06101d;
          background: var(--mw-cyan);
          font-size: 6px;
          font-weight: 950;
        }

        .mw-preview-hero-card {
          height: 48px;
          margin-top: 10px;
          border-radius: 14px;
          background:
            radial-gradient(circle at 80% 10%, rgba(98, 214, 255, 0.34), transparent 3rem),
            linear-gradient(135deg, rgba(98, 214, 255, 0.2), rgba(184, 168, 255, 0.14));
          border: 1px solid rgba(7, 17, 32, 0.06);
        }

        .mw-preview-chip-row {
          display: flex;
          gap: 6px;
          margin-top: 9px;
        }

        .mw-preview-chip-row i {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #eef6f9;
        }

        .mw-preview-chip-row i:first-child {
          background: var(--mw-cyan);
        }

        .mw-preview-list {
          display: grid;
          gap: 6px;
          margin-top: 10px;
        }

        .mw-preview-list span {
          height: 8px;
          border-radius: 999px;
          background: rgba(7, 17, 32, 0.1);
        }

        .mw-preview-list span:nth-child(2) {
          width: 72%;
        }

        .mw-preview-action {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 12px;
          z-index: 3;
          display: grid;
          place-items: center;
          min-height: 24px;
          border-radius: 999px;
          color: #06101d;
          background: var(--mw-cyan);
          font-size: 7px;
          font-weight: 950;
        }

        .mw-preview-browser {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          height: 176px;
          border-radius: 22px;
          padding: 10px;
          background: linear-gradient(180deg, #182941, #071120);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 24px 58px rgba(0, 0, 0, 0.24);
        }

        .mw-preview-browser-top {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 22px;
          color: rgba(247, 251, 255, 0.54);
          font-size: 8px;
          font-weight: 850;
        }

        .mw-preview-browser-top span {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(247, 251, 255, 0.22);
        }

        .mw-preview-browser-top span:first-child {
          background: var(--mw-green);
        }

        .mw-preview-browser-top b {
          margin-left: auto;
          font-weight: 850;
        }

        .mw-preview-browser-grid {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 8px;
          height: 134px;
          padding: 9px;
          border-radius: 16px;
          background: #f7fbff;
        }

        .mw-preview-browser-grid aside {
          display: grid;
          gap: 7px;
          align-content: start;
          padding: 8px;
          border-radius: 13px;
          background: #071120;
        }

        .mw-preview-browser-grid aside i {
          height: 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
        }

        .mw-preview-browser-grid aside i:first-child {
          height: 22px;
          border-radius: 9px;
          background: var(--mw-green);
        }

        .mw-preview-web-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mw-preview-web-title strong {
          color: #071120;
          font-size: 10px;
          letter-spacing: -0.03em;
        }

        .mw-preview-web-title span {
          padding: 4px 6px;
          border-radius: 999px;
          color: #06101d;
          background: #dffcf7;
          font-size: 6px;
          font-weight: 950;
        }

        .mw-preview-web-kpis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          margin-top: 8px;
        }

        .mw-preview-web-kpis i {
          height: 34px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid rgba(7, 17, 32, 0.06);
        }

        .mw-preview-web-table {
          display: grid;
          gap: 6px;
          margin-top: 8px;
        }

        .mw-preview-web-table span {
          height: 18px;
          border-radius: 8px;
          background:
            linear-gradient(90deg, rgba(7,17,32,0.1) 0 58%, rgba(125,247,231,0.22) 58% 78%, rgba(7,17,32,0.055) 78%);
        }

        .mw-preview-admin {
          position: absolute;
          inset: 18px;
          padding: 13px;
          border-radius: 24px;
          background: #f7fbff;
          border: 10px solid #071120;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
        }

        .mw-preview-admin-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .mw-preview-admin-top strong {
          color: #071120;
          font-size: 12px;
          line-height: 1;
          letter-spacing: -0.035em;
        }

        .mw-preview-admin-top span {
          display: grid;
          place-items: center;
          min-width: 40px;
          height: 22px;
          border-radius: 999px;
          color: #06101d;
          background: var(--mw-violet);
          font-size: 7px;
          font-weight: 950;
        }

        .mw-preview-admin-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          margin-bottom: 9px;
        }

        .mw-preview-admin-tabs i {
          height: 18px;
          border-radius: 999px;
          background: #eef1f5;
        }

        .mw-preview-admin-tabs i:first-child {
          background: #071120;
        }

        .mw-preview-admin-body {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 8px;
        }

        .mw-preview-admin-kpis {
          display: grid;
          gap: 7px;
        }

        .mw-preview-admin-kpis span {
          height: 44px;
          border-radius: 12px;
          background: #efeaff;
          border: 1px solid rgba(184, 168, 255, 0.3);
        }

        .mw-preview-admin-list {
          display: grid;
          gap: 6px;
        }

        .mw-preview-admin-list i {
          height: 25px;
          border-radius: 10px;
          background:
            linear-gradient(90deg, rgba(7,17,32,0.1) 0 58%, rgba(184,168,255,0.24) 58% 78%, rgba(7,17,32,0.055) 78%);
        }

        .mw-preview-admin-map {
          position: relative;
          grid-column: 1 / span 2;
          min-height: 52px;
          border-radius: 14px;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(7,17,32,0.055) 1px, transparent 1px),
            linear-gradient(rgba(7,17,32,0.055) 1px, transparent 1px),
            #ffffff;
          background-size: 14px 14px;
          border: 1px solid rgba(7, 17, 32, 0.06);
        }

        .mw-preview-admin-map b {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 999px 999px 999px 2px;
          transform: rotate(-45deg);
          background: var(--mw-violet);
          box-shadow: 0 0 0 6px rgba(184, 168, 255, 0.12);
        }

        .mw-preview-admin-map b:first-child {
          left: 30%;
          top: 35%;
        }

        .mw-preview-admin-map b:nth-child(2) {
          right: 25%;
          bottom: 20%;
          background: var(--mw-cyan);
          box-shadow: 0 0 0 6px rgba(98, 214, 255, 0.12);
        }

        .mw-preview-admin-map em {
          position: absolute;
          left: -10px;
          right: -10px;
          top: 27px;
          height: 6px;
          border-radius: 999px;
          background: rgba(7, 17, 32, 0.08);
          transform: rotate(-16deg);
        }

        .mw-module-card h3 {
          margin-top: 0;
          font-size: 34px;
        }

        .mw-module-card p {
          font-size: 14.5px;
        }

        .mw-module-card ul {
          padding: 15px;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 1080px) {
          .mw-module-card {
            min-height: 590px;
          }
        }

        @media (max-width: 720px) {
          .mw-module-card {
            min-height: auto;
            padding: 20px;
            border-radius: 30px;
          }

          .mw-module-preview {
            height: 220px;
          }

          .mw-preview-browser {
            left: 14px;
            right: 14px;
          }

          .mw-module-card h3 {
            font-size: 30px;
          }
        }

        @media (max-width: 450px) {
          .mw-module-card {
            padding: 18px;
          }

          .mw-module-preview {
            height: 210px;
          }

          .mw-preview-phone {
            width: 124px;
            height: 204px;
          }

          .mw-preview-browser {
            left: 10px;
            right: 10px;
          }

          .mw-preview-admin {
            inset: 14px;
          }
        }


        /* Task 25: premium connected backend architecture diagram */
        .mw-architecture-pro {
          position: relative;
          overflow: hidden;
          padding: 24px;
          border-radius: 44px;
          background:
            radial-gradient(circle at 50% 48%, rgba(98, 214, 255, 0.2), transparent 26rem),
            radial-gradient(circle at 18% 18%, rgba(125, 247, 231, 0.1), transparent 20rem),
            radial-gradient(circle at 86% 82%, rgba(184, 168, 255, 0.13), transparent 22rem),
            linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.026));
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 38px 110px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .mw-architecture-pro::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 76%);
          opacity: 0.7;
          pointer-events: none;
        }

        .mw-architecture-pro::after {
          content: "";
          position: absolute;
          left: 8%;
          right: 8%;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--mw-cyan), var(--mw-green), var(--mw-violet), transparent);
          box-shadow: 0 0 34px rgba(98, 214, 255, 0.28);
        }

        .mw-arch-pro-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 120px minmax(220px, 0.8fr) 120px minmax(0, 1fr);
          grid-template-rows: 126px 88px 230px 88px 126px;
          gap: 14px;
          min-height: 690px;
        }

        .mw-arch-beam {
          position: absolute;
          z-index: 1;
          left: 50%;
          top: 50%;
          width: 62%;
          height: 2px;
          transform-origin: center;
          background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.44), rgba(247, 251, 255, 0.12), transparent);
          filter: drop-shadow(0 0 12px rgba(98, 214, 255, 0.18));
          pointer-events: none;
        }

        .mw-arch-beam-one {
          transform: translate(-50%, -50%) rotate(-28deg);
        }

        .mw-arch-beam-two {
          transform: translate(-50%, -50%) rotate(28deg);
        }

        .mw-arch-beam-three {
          width: 54%;
          transform: translate(-50%, -50%) rotate(90deg);
          background: linear-gradient(90deg, transparent, rgba(125, 247, 231, 0.34), rgba(247, 251, 255, 0.11), transparent);
        }

        .mw-arch-beam-four {
          width: 72%;
          transform: translate(-50%, -50%);
          background: linear-gradient(90deg, transparent, rgba(184, 168, 255, 0.36), rgba(98, 214, 255, 0.32), transparent);
        }

        .mw-arch-app-node,
        .mw-arch-service,
        .mw-arch-core-pro {
          position: relative;
          z-index: 3;
          backdrop-filter: blur(18px);
        }

        .mw-arch-app-node {
          min-height: 166px;
          padding: 20px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 84% 8%, rgba(98, 214, 255, 0.13), transparent 10rem),
            linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.038));
          border: 1px solid rgba(255, 255, 255, 0.13);
          box-shadow:
            0 28px 80px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .mw-arch-app-node > span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 14px;
          color: #06101d;
          background: var(--mw-cyan);
          box-shadow: 0 0 28px rgba(98, 214, 255, 0.25);
          font-size: 12px;
          font-weight: 950;
        }

        .mw-arch-web > span {
          background: var(--mw-green);
          box-shadow: 0 0 28px rgba(125, 247, 231, 0.2);
        }

        .mw-arch-admin > span {
          background: var(--mw-violet);
          box-shadow: 0 0 28px rgba(184, 168, 255, 0.2);
        }

        .mw-arch-app-node strong {
          display: block;
          margin-top: 14px;
          color: #ffffff;
          font-size: 26px;
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .mw-arch-app-node p {
          margin: 10px 0 0;
          color: rgba(247, 251, 255, 0.62);
          font-size: 13.5px;
          line-height: 1.5;
        }

        .mw-arch-node-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 15px;
        }

        .mw-arch-node-pills b {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.72);
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.09);
          font-size: 10px;
          font-weight: 950;
        }

        .mw-arch-mobile {
          grid-column: 1 / span 2;
          grid-row: 1 / span 2;
          align-self: start;
        }

        .mw-arch-web {
          grid-column: 4 / span 2;
          grid-row: 1 / span 2;
          align-self: start;
          background:
            radial-gradient(circle at 84% 8%, rgba(125, 247, 231, 0.13), transparent 10rem),
            linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.038));
        }

        .mw-arch-admin {
          grid-column: 4 / span 2;
          grid-row: 4 / span 2;
          align-self: end;
          background:
            radial-gradient(circle at 84% 8%, rgba(184, 168, 255, 0.15), transparent 10rem),
            linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.038));
        }

        .mw-arch-core-pro {
          grid-column: 3;
          grid-row: 3;
          display: grid;
          place-items: center;
          align-self: center;
          justify-self: center;
          width: 220px;
          height: 220px;
          border-radius: 999px;
          text-align: center;
          color: #06101d;
          background:
            radial-gradient(circle at 35% 22%, rgba(255,255,255,0.92), transparent 4.5rem),
            linear-gradient(135deg, #d9f7ff, #62d6ff 44%, #b8a8ff);
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow:
            0 0 0 16px rgba(98, 214, 255, 0.06),
            0 0 0 32px rgba(98, 214, 255, 0.025),
            0 34px 100px rgba(98, 214, 255, 0.24),
            inset 0 1px 0 rgba(255,255,255,0.55);
        }

        .mw-arch-core-ring {
          position: absolute;
          inset: -24px;
          border-radius: 999px;
          border: 1px dashed rgba(247, 251, 255, 0.18);
          animation: mw-arch-spin 26s linear infinite;
        }

        @keyframes mw-arch-spin {
          to { transform: rotate(360deg); }
        }

        .mw-arch-core-pro span {
          display: block;
          color: rgba(6, 16, 29, 0.66);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mw-arch-core-pro strong {
          display: block;
          margin: 9px 0;
          color: #06101d;
          font-size: 31px;
          line-height: 0.88;
          letter-spacing: -0.075em;
        }

        .mw-arch-core-pro small {
          display: block;
          color: rgba(6, 16, 29, 0.6);
          font-size: 11px;
          font-weight: 950;
        }

        .mw-arch-service {
          min-height: 88px;
          display: grid;
          align-content: center;
          padding: 15px;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.03));
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow:
            0 20px 58px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .mw-arch-service::before {
          content: "";
          position: absolute;
          left: 14px;
          top: 14px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--mw-cyan);
          box-shadow: 0 0 20px rgba(98, 214, 255, 0.42);
        }

        .mw-arch-service span {
          display: block;
          margin-left: 16px;
          color: rgba(247, 251, 255, 0.48);
          font-size: 8.5px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mw-arch-service strong {
          display: block;
          margin-top: 7px;
          color: #ffffff;
          font-size: 13.5px;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .mw-service-auth {
          grid-column: 1;
          grid-row: 3;
          align-self: center;
        }

        .mw-service-storage {
          grid-column: 2;
          grid-row: 5;
          align-self: end;
        }

        .mw-service-notify {
          grid-column: 3;
          grid-row: 1;
          align-self: start;
        }

        .mw-service-payments {
          grid-column: 5;
          grid-row: 3;
          align-self: center;
        }

        .mw-service-maps {
          grid-column: 2;
          grid-row: 3;
          align-self: center;
        }

        .mw-service-audit {
          grid-column: 3;
          grid-row: 5;
          align-self: end;
        }

        .mw-service-storage::before,
        .mw-service-maps::before {
          background: var(--mw-green);
          box-shadow: 0 0 20px rgba(125, 247, 231, 0.34);
        }

        .mw-service-payments::before,
        .mw-service-audit::before {
          background: var(--mw-violet);
          box-shadow: 0 0 20px rgba(184, 168, 255, 0.34);
        }

        @media (max-width: 1080px) {
          .mw-arch-pro-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            min-height: auto;
          }

          .mw-arch-beam {
            display: none;
          }

          .mw-arch-mobile,
          .mw-arch-web,
          .mw-arch-admin,
          .mw-arch-core-pro,
          .mw-service-auth,
          .mw-service-storage,
          .mw-service-notify,
          .mw-service-payments,
          .mw-service-maps,
          .mw-service-audit {
            grid-column: auto;
            grid-row: auto;
            align-self: stretch;
          }

          .mw-arch-core-pro {
            grid-column: 1 / -1;
            order: -1;
            margin: 12px auto 18px;
          }

          .mw-arch-admin {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 720px) {
          .mw-architecture-pro {
            padding: 16px;
            border-radius: 32px;
          }

          .mw-arch-pro-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .mw-arch-core-pro {
            width: 176px;
            height: 176px;
            margin-bottom: 10px;
          }

          .mw-arch-core-pro strong {
            font-size: 25px;
          }

          .mw-arch-core-ring {
            inset: -18px;
          }

          .mw-arch-app-node {
            min-height: auto;
            padding: 18px;
            border-radius: 26px;
          }

          .mw-arch-app-node strong {
            font-size: 24px;
          }

          .mw-arch-service {
            min-height: 76px;
            border-radius: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mw-arch-core-ring {
            animation: none;
          }
        }


        /* Task 26: premium capability grid */
        #included {
          position: relative;
          isolation: isolate;
        }

        #included::before {
          content: "";
          position: absolute;
          inset: 0 calc(50% - 50vw);
          z-index: -1;
          background:
            radial-gradient(circle at 12% 8%, rgba(98, 214, 255, 0.12), transparent 25rem),
            radial-gradient(circle at 88% 42%, rgba(184, 168, 255, 0.11), transparent 25rem),
            linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.018), transparent);
          pointer-events: none;
        }

        .mw-capability-grid {
          gap: 18px;
        }

        .mw-capability-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 320px;
          padding: 22px;
          overflow: hidden;
          border-radius: 32px;
          background:
            radial-gradient(circle at 84% 8%, rgba(98, 214, 255, 0.12), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 28px 86px rgba(0, 0, 0, 0.19),
            inset 0 1px 0 rgba(255,255,255,0.09);
          transition:
            transform 200ms ease,
            border-color 200ms ease,
            box-shadow 200ms ease;
        }

        .mw-capability-card:nth-child(3n + 2) {
          background:
            radial-gradient(circle at 84% 8%, rgba(125, 247, 231, 0.11), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
        }

        .mw-capability-card:nth-child(3n) {
          background:
            radial-gradient(circle at 84% 8%, rgba(184, 168, 255, 0.12), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
        }

        .mw-capability-card::before {
          content: "";
          position: absolute;
          left: 22px;
          right: 22px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.86), transparent);
          box-shadow: 0 0 28px rgba(98, 214, 255, 0.24);
        }

        .mw-capability-card:nth-child(3n + 2)::before {
          background: linear-gradient(90deg, transparent, rgba(125, 247, 231, 0.86), transparent);
          box-shadow: 0 0 28px rgba(125, 247, 231, 0.18);
        }

        .mw-capability-card:nth-child(3n)::before {
          background: linear-gradient(90deg, transparent, rgba(184, 168, 255, 0.86), transparent);
          box-shadow: 0 0 28px rgba(184, 168, 255, 0.18);
        }

        .mw-capability-card:hover {
          transform: translateY(-7px);
          border-color: rgba(98, 214, 255, 0.22);
          box-shadow:
            0 38px 104px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .mw-capability-head {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .mw-capability-icon {
          width: 50px;
          height: 50px;
          border-radius: 18px;
          color: var(--mw-cyan);
          background:
            radial-gradient(circle at 50% 0%, rgba(98, 214, 255, 0.18), transparent 4rem),
            rgba(98, 214, 255, 0.08);
          border-color: rgba(98, 214, 255, 0.18);
          box-shadow:
            0 18px 44px rgba(98, 214, 255, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .mw-capability-card:nth-child(3n + 2) .mw-capability-icon {
          color: var(--mw-green);
          background:
            radial-gradient(circle at 50% 0%, rgba(125, 247, 231, 0.16), transparent 4rem),
            rgba(125, 247, 231, 0.07);
          border-color: rgba(125, 247, 231, 0.18);
        }

        .mw-capability-card:nth-child(3n) .mw-capability-icon {
          color: var(--mw-violet);
          background:
            radial-gradient(circle at 50% 0%, rgba(184, 168, 255, 0.16), transparent 4rem),
            rgba(184, 168, 255, 0.07);
          border-color: rgba(184, 168, 255, 0.18);
        }

        .mw-capability-number {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 17px;
          color: rgba(247, 251, 255, 0.35);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.09);
          font-size: 17px;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .mw-capability-visual {
          position: relative;
          z-index: 2;
          height: 74px;
          margin-bottom: 20px;
          padding: 12px;
          border-radius: 22px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            rgba(255, 255, 255, 0.04);
          background-size: 18px 18px;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .mw-capability-visual::before {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          top: 50%;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(98, 214, 255, 0.52), rgba(255,255,255,0.08), transparent);
        }

        .mw-capability-card:nth-child(3n + 2) .mw-capability-visual::before {
          background: linear-gradient(90deg, rgba(125, 247, 231, 0.52), rgba(255,255,255,0.08), transparent);
        }

        .mw-capability-card:nth-child(3n) .mw-capability-visual::before {
          background: linear-gradient(90deg, rgba(184, 168, 255, 0.52), rgba(255,255,255,0.08), transparent);
        }

        .mw-capability-visual i {
          position: absolute;
          z-index: 2;
          display: block;
          border-radius: 999px;
          background: var(--mw-cyan);
          box-shadow: 0 0 24px rgba(98, 214, 255, 0.2);
        }

        .mw-capability-card:nth-child(3n + 2) .mw-capability-visual i {
          background: var(--mw-green);
          box-shadow: 0 0 24px rgba(125, 247, 231, 0.16);
        }

        .mw-capability-card:nth-child(3n) .mw-capability-visual i {
          background: var(--mw-violet);
          box-shadow: 0 0 24px rgba(184, 168, 255, 0.16);
        }

        .mw-capability-visual i:nth-child(1) {
          left: 16px;
          top: 18px;
          width: 34px;
          height: 34px;
        }

        .mw-capability-visual i:nth-child(2) {
          left: 50%;
          top: 27px;
          width: 20px;
          height: 20px;
          transform: translateX(-50%);
          opacity: 0.72;
        }

        .mw-capability-visual i:nth-child(3) {
          right: 18px;
          top: 22px;
          width: 28px;
          height: 28px;
          opacity: 0.52;
        }

        .mw-capability-card:nth-child(1) .mw-capability-visual i {
          border-radius: 12px;
        }

        .mw-capability-card:nth-child(2) .mw-capability-visual i {
          border-radius: 999px 999px 999px 4px;
          transform: rotate(-45deg);
        }

        .mw-capability-card:nth-child(2) .mw-capability-visual i:nth-child(2) {
          transform: translateX(-50%) rotate(-45deg);
        }

        .mw-capability-card:nth-child(3) .mw-capability-visual i {
          height: 10px;
          border-radius: 999px;
        }

        .mw-capability-card:nth-child(3) .mw-capability-visual i:nth-child(1) {
          top: 22px;
          width: 78px;
        }

        .mw-capability-card:nth-child(3) .mw-capability-visual i:nth-child(2) {
          top: 38px;
          width: 58px;
        }

        .mw-capability-card:nth-child(3) .mw-capability-visual i:nth-child(3) {
          top: 26px;
          width: 44px;
        }

        .mw-capability-card:nth-child(4) .mw-capability-visual i {
          border-radius: 999px 999px 999px 4px;
          transform: rotate(-45deg);
        }

        .mw-capability-card:nth-child(4) .mw-capability-visual i:nth-child(2) {
          transform: translateX(-50%) rotate(-45deg);
        }

        .mw-capability-card:nth-child(5) .mw-capability-visual i,
        .mw-capability-card:nth-child(8) .mw-capability-visual i {
          height: 32px;
          border-radius: 10px 10px 999px 999px;
        }

        .mw-capability-card:nth-child(6) .mw-capability-visual {
          background:
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            rgba(255, 255, 255, 0.04);
          background-size: 15px 15px;
        }

        .mw-capability-card:nth-child(6) .mw-capability-visual i {
          border-radius: 999px 999px 999px 4px;
          transform: rotate(-45deg);
        }

        .mw-capability-card:nth-child(6) .mw-capability-visual i:nth-child(2) {
          transform: translateX(-50%) rotate(-45deg);
        }

        .mw-capability-card:nth-child(7) .mw-capability-visual i {
          width: 58px;
          height: 26px;
          border-radius: 13px 13px 13px 4px;
        }

        .mw-capability-card:nth-child(9) .mw-capability-visual i {
          height: 22px;
          border-radius: 8px;
        }

        .mw-capability-card h3 {
          position: relative;
          z-index: 2;
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 23px;
          line-height: 0.98;
          letter-spacing: -0.055em;
          text-wrap: balance;
        }

        .mw-capability-card p {
          position: relative;
          z-index: 2;
          flex: 1;
          margin: 0;
          color: rgba(247, 251, 255, 0.62);
          font-size: 13.5px;
          line-height: 1.58;
        }

        .mw-capability-tags {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 18px;
        }

        .mw-capability-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 29px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.72);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.09);
          font-size: 10px;
          font-weight: 950;
        }

        .mw-capability-tags span:first-child {
          color: #06101d;
          background: var(--mw-cyan);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 0 24px rgba(98, 214, 255, 0.16);
        }

        .mw-capability-card:nth-child(3n + 2) .mw-capability-tags span:first-child {
          background: var(--mw-green);
          box-shadow: 0 0 24px rgba(125, 247, 231, 0.13);
        }

        .mw-capability-card:nth-child(3n) .mw-capability-tags span:first-child {
          background: var(--mw-violet);
          box-shadow: 0 0 24px rgba(184, 168, 255, 0.13);
        }

        @media (max-width: 1080px) {
          .mw-capability-card {
            min-height: 300px;
          }
        }

        @media (max-width: 720px) {
          .mw-capability-grid {
            gap: 13px;
          }

          .mw-capability-card {
            min-height: auto;
            padding: 20px;
            border-radius: 28px;
          }

          .mw-capability-visual {
            height: 66px;
            margin-bottom: 18px;
          }

          .mw-capability-card h3 {
            font-size: 22px;
          }
        }


        /* Task 27: premium build timeline */
        #process {
          position: relative;
          isolation: isolate;
        }

        #process::before {
          content: "";
          position: absolute;
          inset: 0 calc(50% - 50vw);
          z-index: -1;
          background:
            radial-gradient(circle at 16% 16%, rgba(125, 247, 231, 0.09), transparent 25rem),
            radial-gradient(circle at 78% 54%, rgba(98, 214, 255, 0.1), transparent 27rem),
            radial-gradient(circle at 50% 100%, rgba(184, 168, 255, 0.08), transparent 26rem);
          pointer-events: none;
        }

        .mw-process-timeline {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px 28px;
          padding: 22px;
          border-radius: 42px;
          background:
            radial-gradient(circle at 50% 44%, rgba(98, 214, 255, 0.12), transparent 28rem),
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow:
            0 34px 106px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .mw-process-timeline::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 78%);
          pointer-events: none;
        }

        .mw-process-timeline::after {
          content: "";
          position: absolute;
          left: 9%;
          right: 9%;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--mw-green), var(--mw-cyan), var(--mw-violet), transparent);
          box-shadow: 0 0 34px rgba(98, 214, 255, 0.22);
        }

        .mw-process-spine {
          position: absolute;
          z-index: 1;
          left: 50%;
          top: 42px;
          bottom: 42px;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(98, 214, 255, 0.48), rgba(184, 168, 255, 0.4), transparent);
          box-shadow: 0 0 24px rgba(98, 214, 255, 0.16);
        }

        .mw-timeline-card {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 16px;
          min-height: 260px;
          padding: 0;
          border: 0;
          background: transparent;
        }

        .mw-timeline-card:nth-child(even) {
          margin-top: 54px;
        }

        .mw-timeline-marker {
          position: relative;
          display: grid;
          place-items: start center;
          padding-top: 22px;
        }

        .mw-timeline-marker::before {
          content: "";
          position: absolute;
          top: 48px;
          bottom: 18px;
          width: 1px;
          background: linear-gradient(180deg, rgba(98, 214, 255, 0.45), transparent);
        }

        .mw-timeline-marker span {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border-radius: 21px;
          color: #06101d;
          background:
            radial-gradient(circle at 34% 14%, rgba(255,255,255,0.78), transparent 3rem),
            linear-gradient(135deg, #d9f7ff, var(--mw-cyan));
          border: 1px solid rgba(255,255,255,0.36);
          box-shadow:
            0 20px 50px rgba(98, 214, 255, 0.22),
            0 0 0 9px rgba(98, 214, 255, 0.06),
            inset 0 1px 0 rgba(255,255,255,0.5);
          font-size: 15px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .mw-timeline-card:nth-child(4n + 1) .mw-timeline-marker span {
          background:
            radial-gradient(circle at 34% 14%, rgba(255,255,255,0.78), transparent 3rem),
            linear-gradient(135deg, #e2fff9, var(--mw-green));
          box-shadow:
            0 20px 50px rgba(125, 247, 231, 0.17),
            0 0 0 9px rgba(125, 247, 231, 0.055),
            inset 0 1px 0 rgba(255,255,255,0.5);
        }

        .mw-timeline-card:nth-child(4n + 3) .mw-timeline-marker span {
          background:
            radial-gradient(circle at 34% 14%, rgba(255,255,255,0.78), transparent 3rem),
            linear-gradient(135deg, #eeeaff, var(--mw-violet));
          box-shadow:
            0 20px 50px rgba(184, 168, 255, 0.17),
            0 0 0 9px rgba(184, 168, 255, 0.055),
            inset 0 1px 0 rgba(255,255,255,0.5);
        }

        .mw-timeline-content {
          position: relative;
          overflow: hidden;
          min-height: 260px;
          padding: 22px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 86% 10%, rgba(98, 214, 255, 0.13), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.032));
          border: 1px solid rgba(255,255,255,0.115);
          box-shadow:
            0 28px 86px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255,255,255,0.09);
          transition:
            transform 200ms ease,
            border-color 200ms ease,
            box-shadow 200ms ease;
        }

        .mw-timeline-content::before {
          content: "";
          position: absolute;
          left: 22px;
          right: 22px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.78), transparent);
          box-shadow: 0 0 28px rgba(98, 214, 255, 0.22);
        }

        .mw-timeline-card:nth-child(4n + 1) .mw-timeline-content::before {
          background: linear-gradient(90deg, transparent, rgba(125, 247, 231, 0.78), transparent);
        }

        .mw-timeline-card:nth-child(4n + 3) .mw-timeline-content::before {
          background: linear-gradient(90deg, transparent, rgba(184, 168, 255, 0.78), transparent);
        }

        .mw-timeline-card:hover .mw-timeline-content {
          transform: translateY(-6px);
          border-color: rgba(98, 214, 255, 0.22);
          box-shadow:
            0 38px 106px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .mw-timeline-topline {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .mw-timeline-topline span {
          display: inline-flex;
          align-items: center;
          min-height: 31px;
          padding: 0 10px;
          border-radius: 999px;
          color: #06101d;
          background: var(--mw-cyan);
          box-shadow: 0 0 24px rgba(98, 214, 255, 0.16);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .mw-timeline-card:nth-child(4n + 1) .mw-timeline-topline span {
          background: var(--mw-green);
          box-shadow: 0 0 24px rgba(125, 247, 231, 0.12);
        }

        .mw-timeline-card:nth-child(4n + 3) .mw-timeline-topline span {
          background: var(--mw-violet);
          box-shadow: 0 0 24px rgba(184, 168, 255, 0.12);
        }

        .mw-timeline-topline b {
          color: rgba(247, 251, 255, 0.44);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: right;
        }

        .mw-timeline-content h3 {
          position: relative;
          z-index: 2;
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 29px;
          line-height: 0.98;
          letter-spacing: -0.065em;
          text-wrap: balance;
        }

        .mw-timeline-content p {
          position: relative;
          z-index: 2;
          margin: 0;
          color: rgba(247, 251, 255, 0.62);
          font-size: 14px;
          line-height: 1.6;
        }

        .mw-timeline-tags {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 18px;
        }

        .mw-timeline-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 29px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.72);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.09);
          font-size: 10px;
          font-weight: 950;
        }

        .mw-timeline-tags span:first-child {
          color: #06101d;
          background: var(--mw-cyan);
          border-color: rgba(255,255,255,0.18);
        }

        .mw-timeline-card:nth-child(4n + 1) .mw-timeline-tags span:first-child {
          background: var(--mw-green);
        }

        .mw-timeline-card:nth-child(4n + 3) .mw-timeline-tags span:first-child {
          background: var(--mw-violet);
        }

        .mw-timeline-visual {
          position: absolute;
          right: 18px;
          bottom: 18px;
          display: grid;
          grid-template-columns: 1fr 0.7fr 0.42fr;
          align-items: end;
          gap: 6px;
          width: 92px;
          height: 54px;
          padding: 9px;
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.058), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.075);
          opacity: 0.9;
        }

        .mw-timeline-visual i {
          display: block;
          border-radius: 999px;
          background: var(--mw-cyan);
          box-shadow: 0 0 22px rgba(98, 214, 255, 0.18);
        }

        .mw-timeline-visual i:nth-child(1) {
          height: 29px;
        }

        .mw-timeline-visual i:nth-child(2) {
          height: 20px;
          opacity: 0.7;
        }

        .mw-timeline-visual i:nth-child(3) {
          height: 36px;
          opacity: 0.45;
        }

        .mw-timeline-card:nth-child(4n + 1) .mw-timeline-visual i {
          background: var(--mw-green);
          box-shadow: 0 0 22px rgba(125, 247, 231, 0.14);
        }

        .mw-timeline-card:nth-child(4n + 3) .mw-timeline-visual i {
          background: var(--mw-violet);
          box-shadow: 0 0 22px rgba(184, 168, 255, 0.14);
        }

        .mw-process-grid {
          display: none;
        }

        @media (max-width: 1080px) {
          .mw-process-timeline {
            grid-template-columns: 1fr;
          }

          .mw-process-spine {
            left: 54px;
          }

          .mw-timeline-card:nth-child(even) {
            margin-top: 0;
          }
        }

        @media (max-width: 720px) {
          .mw-process-timeline {
            gap: 14px;
            padding: 16px;
            border-radius: 32px;
          }

          .mw-process-spine {
            display: none;
          }

          .mw-timeline-card {
            grid-template-columns: 1fr;
            gap: 10px;
            min-height: auto;
          }

          .mw-timeline-marker {
            place-items: center start;
            padding-top: 0;
          }

          .mw-timeline-marker::before {
            display: none;
          }

          .mw-timeline-marker span {
            width: 48px;
            height: 48px;
            border-radius: 18px;
          }

          .mw-timeline-content {
            min-height: auto;
            padding: 20px;
            border-radius: 26px;
          }

          .mw-timeline-topline {
            flex-wrap: wrap;
          }

          .mw-timeline-content h3 {
            font-size: 26px;
          }

          .mw-timeline-visual {
            position: relative;
            right: auto;
            bottom: auto;
            width: 100%;
            height: 42px;
            margin-top: 16px;
          }
        }


        /* Task 28: final CTA and footer polish */
        .mw-final-pro {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          margin-top: 44px;
          margin-bottom: 28px;
          padding: clamp(28px, 5vw, 58px);
          border-radius: 46px;
          background:
            radial-gradient(circle at 16% 14%, rgba(98, 214, 255, 0.22), transparent 22rem),
            radial-gradient(circle at 86% 18%, rgba(184, 168, 255, 0.2), transparent 22rem),
            radial-gradient(circle at 50% 100%, rgba(125, 247, 231, 0.1), transparent 22rem),
            linear-gradient(135deg, rgba(255,255,255,0.11), rgba(255,255,255,0.034));
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow:
            0 40px 120px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .mw-final-pro::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 78%);
          opacity: 0.72;
          pointer-events: none;
        }

        .mw-final-pro::after {
          content: "";
          position: absolute;
          left: 9%;
          right: 9%;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--mw-cyan), var(--mw-green), var(--mw-violet), transparent);
          box-shadow: 0 0 38px rgba(98, 214, 255, 0.26);
        }

        .mw-final-glow {
          position: absolute;
          right: -90px;
          top: -120px;
          width: 360px;
          height: 360px;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(98, 214, 255, 0.22), transparent 68%);
          filter: blur(18px);
          opacity: 0.78;
          pointer-events: none;
        }

        .mw-final-pro-grid {
          position: relative;
          z-index: 2;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
          gap: clamp(28px, 5vw, 58px);
        }

        .mw-final-copy {
          max-width: 780px;
        }

        .mw-final-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 36px;
          padding: 8px 11px;
          border-radius: 999px;
          color: #bdefff;
          background: rgba(98, 214, 255, 0.1);
          border: 1px solid rgba(98, 214, 255, 0.22);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mw-final-eyebrow::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--mw-cyan);
          box-shadow: 0 0 0 6px rgba(98, 214, 255, 0.09), 0 0 22px rgba(98, 214, 255, 0.54);
        }

        .mw-final-pro h2 {
          margin-top: 18px;
          max-width: 860px;
          font-size: clamp(42px, 6.2vw, 84px);
          line-height: 0.88;
          letter-spacing: -0.095em;
        }

        .mw-final-pro p {
          max-width: 760px;
          color: rgba(247, 251, 255, 0.66);
          font-size: 17px;
          line-height: 1.68;
        }

        .mw-final-proof-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 26px;
        }

        .mw-final-proof-row span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 35px;
          padding: 0 11px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.76);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
          font-size: 11px;
          font-weight: 950;
        }

        .mw-final-proof-row span::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--mw-cyan);
          box-shadow: 0 0 18px rgba(98, 214, 255, 0.38);
        }

        .mw-final-proof-row span:nth-child(2)::before {
          background: var(--mw-green);
          box-shadow: 0 0 18px rgba(125, 247, 231, 0.3);
        }

        .mw-final-proof-row span:nth-child(3)::before {
          background: var(--mw-violet);
          box-shadow: 0 0 18px rgba(184, 168, 255, 0.3);
        }

        .mw-final-action-card {
          position: relative;
          overflow: hidden;
          padding: 22px;
          border-radius: 34px;
          background:
            radial-gradient(circle at 80% 0%, rgba(98, 214, 255, 0.18), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04));
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow:
            0 32px 94px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.11);
          backdrop-filter: blur(18px);
        }

        .mw-final-action-card::before {
          content: "";
          position: absolute;
          left: 22px;
          right: 22px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.82), transparent);
          box-shadow: 0 0 28px rgba(98, 214, 255, 0.22);
        }

        .mw-final-action-top span {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 10px;
          border-radius: 999px;
          color: #06101d;
          background: var(--mw-cyan);
          box-shadow: 0 0 26px rgba(98, 214, 255, 0.18);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .mw-final-action-top strong {
          display: block;
          margin-top: 15px;
          color: #ffffff;
          font-size: 29px;
          line-height: 0.98;
          letter-spacing: -0.065em;
          text-wrap: balance;
        }

        .mw-final-mini-stack {
          display: grid;
          gap: 10px;
          margin: 24px 0;
          padding: 16px;
          border-radius: 24px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            rgba(255,255,255,0.045);
          background-size: 18px 18px;
          border: 1px solid rgba(255,255,255,0.09);
        }

        .mw-final-mini-stack i {
          display: block;
          height: 42px;
          border-radius: 15px;
          background:
            linear-gradient(90deg, rgba(98, 214, 255, 0.28) 0 22%, rgba(255,255,255,0.08) 22% 62%, rgba(184, 168, 255, 0.24) 62% 82%, rgba(255,255,255,0.05) 82%);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .mw-final-mini-stack i:nth-child(2) {
          background:
            linear-gradient(90deg, rgba(125, 247, 231, 0.24) 0 34%, rgba(255,255,255,0.08) 34% 74%, rgba(98, 214, 255, 0.24) 74%);
        }

        .mw-final-mini-stack i:nth-child(3) {
          background:
            linear-gradient(90deg, rgba(184, 168, 255, 0.24) 0 48%, rgba(255,255,255,0.08) 48% 78%, rgba(125, 247, 231, 0.2) 78%);
        }

        .mw-final-main-button {
          width: 100%;
          min-height: 58px;
        }

        .mw-final-secondary-link {
          display: inline-flex;
          justify-content: center;
          width: 100%;
          margin-top: 14px;
          color: rgba(247, 251, 255, 0.56);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          transition: color 160ms ease;
        }

        .mw-final-secondary-link:hover {
          color: #ffffff;
        }

        .mw-footer {
          padding: 26px 0 34px;
          border-top: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.012), rgba(255,255,255,0.03));
        }

        .mw-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .mw-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
        }

        .mw-footer-logo {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 17px;
          background:
            radial-gradient(circle at 35% 18%, rgba(98, 214, 255, 0.18), transparent 3rem),
            rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(98, 214, 255, 0.18);
        }

        .mw-footer-logo img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .mw-footer-brand strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          line-height: 1;
        }

        .mw-footer-brand small {
          display: block;
          margin-top: 5px;
          color: rgba(247, 251, 255, 0.42);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .mw-footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .mw-footer-links a {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 0 11px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.62);
          text-decoration: none;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 12px;
          font-weight: 900;
          transition:
            color 160ms ease,
            background 160ms ease,
            border-color 160ms ease;
        }

        .mw-footer-links a:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.07);
          border-color: rgba(98, 214, 255, 0.22);
        }

        @media (max-width: 1080px) {
          .mw-final-pro-grid {
            grid-template-columns: 1fr;
          }

          .mw-final-action-card {
            max-width: 520px;
          }
        }

        @media (max-width: 720px) {
          .mw-final-pro {
            margin-top: 26px;
            padding: 24px;
            border-radius: 32px;
          }

          .mw-final-pro h2 {
            font-size: clamp(42px, 12vw, 62px);
          }

          .mw-final-pro p {
            font-size: 15.5px;
          }

          .mw-final-proof-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .mw-final-proof-row span {
            justify-content: center;
          }

          .mw-final-action-card {
            padding: 20px;
            border-radius: 28px;
          }

          .mw-final-action-top strong {
            font-size: 25px;
          }

          .mw-footer-inner {
            flex-direction: column;
            align-items: flex-start;
          }

          .mw-footer-links {
            justify-content: flex-start;
          }
        }

        @media (max-width: 450px) {
          .mw-final-proof-row {
            grid-template-columns: 1fr;
          }

          .mw-final-main-button {
            font-size: 13px;
          }

          .mw-footer-links {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }

          .mw-footer-links a {
            justify-content: center;
          }
        }


        /* Task 29: final full-page polish pass */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 110px;
        }

        .mw-page {
          width: 100%;
          overflow-x: hidden;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        .mw-page a,
        .mw-page button {
          -webkit-tap-highlight-color: transparent;
        }

        .mw-page a:focus-visible,
        .mw-page button:focus-visible {
          outline: 3px solid rgba(98, 214, 255, 0.72);
          outline-offset: 4px;
        }

        .mw-shell {
          position: relative;
        }

        .mw-section {
          isolation: isolate;
        }

        .mw-section + .mw-section {
          border-top-color: rgba(255, 255, 255, 0.06);
        }

        .mw-section::after {
          content: "";
          position: absolute;
          left: calc(50% - min(590px, calc(50vw - 21px)));
          right: calc(50% - min(590px, calc(50vw - 21px)));
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(247, 251, 255, 0.095), transparent);
          pointer-events: none;
        }

        .mw-section:last-of-type::after {
          display: none;
        }

        .mw-hero h1,
        .mw-section-head h2,
        .mw-module-card h3,
        .mw-capability-card h3,
        .mw-timeline-content h3,
        .mw-final-pro h2 {
          text-wrap: balance;
        }

        .mw-hero-copy,
        .mw-section-head p,
        .mw-module-card p,
        .mw-capability-card p,
        .mw-timeline-content p,
        .mw-final-pro p {
          text-wrap: pretty;
        }

        .mw-button,
        .mw-nav-links .mw-quote,
        .mw-module-card,
        .mw-capability-card,
        .mw-timeline-content,
        .mw-final-action-card {
          will-change: transform;
        }

        .mw-button:active,
        .mw-nav-links .mw-quote:active,
        .mw-footer-links a:active {
          transform: translateY(1px) scale(0.99);
        }

        .mw-nav {
          z-index: 100;
        }

        .mw-nav-inner {
          width: min(1180px, calc(100% - 42px));
          margin: 0 auto;
        }

        .mw-nav-links {
          min-width: 0;
        }

        .mw-nav-links a {
          white-space: nowrap;
        }

        .mw-back {
          transition: color 160ms ease, transform 160ms ease;
        }

        .mw-back:hover {
          color: #ffffff;
          transform: translateX(-2px);
        }

        .mw-hero {
          gap: clamp(34px, 6vw, 82px);
        }

        .mw-hero-pretitle-row {
          max-width: 720px;
        }

        .mw-actions {
          align-items: center;
        }

        .mw-button {
          white-space: nowrap;
        }

        .mw-hero-points {
          align-items: stretch;
        }

        .mw-point {
          display: flex;
          flex-direction: column;
        }

        .mw-point span {
          flex: 1;
        }

        .mw-hero-visual,
        .mw-module-preview,
        .mw-architecture-pro,
        .mw-capability-card,
        .mw-process-timeline,
        .mw-final-pro {
          transform: translateZ(0);
        }

        .mw-web-window,
        .mw-phone,
        .mw-floating-card {
          backface-visibility: hidden;
        }

        .mw-section-head {
          margin-bottom: 34px;
        }

        .mw-section-head p {
          color: rgba(247, 251, 255, 0.66);
        }

        .mw-module-card,
        .mw-capability-card {
          height: 100%;
        }

        .mw-module-card ul,
        .mw-capability-tags,
        .mw-timeline-tags,
        .mw-final-proof-row {
          align-content: flex-start;
        }

        .mw-module-card li {
          min-height: 22px;
        }

        .mw-architecture-pro {
          margin-top: 4px;
        }

        .mw-arch-pro-grid {
          align-items: stretch;
        }

        .mw-arch-app-node,
        .mw-arch-service {
          transform: translateZ(0);
        }

        .mw-capability-tags {
          min-height: 65px;
        }

        .mw-process-timeline {
          margin-top: 4px;
        }

        .mw-final-pro {
          margin-top: 58px;
        }

        .mw-final-main-button {
          justify-content: center;
        }

        .mw-footer {
          margin-top: 0;
        }

        @media (hover: none) {
          .mw-button:hover,
          .mw-module-card:hover,
          .mw-capability-card:hover,
          .mw-timeline-card:hover .mw-timeline-content {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .mw-page *,
          .mw-page *::before,
          .mw-page *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }

        @media (max-width: 1180px) {
          .mw-section::after {
            left: 21px;
            right: 21px;
          }

          .mw-nav-inner {
            width: min(100% - 42px, 1180px);
          }
        }

        @media (max-width: 1080px) {
          .mw-section {
            padding: 58px 0;
          }

          .mw-hero {
            padding-top: 52px;
          }

          .mw-hero-visual {
            order: 2;
          }

          .mw-module-card,
          .mw-capability-card {
            min-height: auto;
          }

          .mw-capability-tags {
            min-height: auto;
          }

          .mw-final-action-card {
            width: min(100%, 520px);
          }
        }

        @media (max-width: 840px) {
          .mw-nav-links a:not(.mw-quote) {
            display: none;
          }

          .mw-nav-inner {
            min-height: 74px;
          }
        }

        @media (max-width: 720px) {
          html {
            scroll-padding-top: 92px;
          }

          .mw-shell,
          .mw-nav-inner {
            width: min(100% - 26px, 1180px);
          }

          .mw-section {
            padding: 46px 0;
          }

          .mw-section::after {
            left: 13px;
            right: 13px;
          }

          .mw-brand strong {
            font-size: 14px;
          }

          .mw-brand > span:last-child > span {
            display: none;
          }

          .mw-nav-links .mw-quote {
            min-height: 40px;
            padding: 0 12px;
            border-radius: 999px;
            font-size: 12px;
          }

          .mw-back {
            margin-bottom: 16px;
          }

          .mw-hero {
            gap: 32px;
            padding-bottom: 48px;
          }

          .mw-hero-copy {
            line-height: 1.68;
          }

          .mw-actions {
            margin-top: 28px;
          }

          .mw-button {
            min-height: 54px;
            white-space: normal;
            text-align: center;
          }

          .mw-hero-points {
            margin-top: 24px;
          }

          .mw-hero-visual {
            margin-top: 4px;
            width: 100%;
          }

          .mw-floating-card {
            box-shadow:
              0 24px 68px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }

          .mw-section-head {
            gap: 14px;
            margin-bottom: 24px;
          }

          .mw-section-head h2 {
            font-size: clamp(36px, 11vw, 54px);
          }

          .mw-section-head p {
            font-size: 14.5px;
          }

          .mw-module-grid,
          .mw-capability-grid,
          .mw-process-timeline {
            gap: 14px;
          }

          .mw-module-card,
          .mw-capability-card,
          .mw-timeline-content {
            box-shadow:
              0 22px 68px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.09);
          }

          .mw-architecture-pro,
          .mw-process-timeline,
          .mw-final-pro {
            box-shadow:
              0 28px 86px rgba(0, 0, 0, 0.24),
              inset 0 1px 0 rgba(255, 255, 255, 0.09);
          }

          .mw-final-pro {
            margin-top: 34px;
            margin-bottom: 20px;
          }

          .mw-footer {
            padding-bottom: 28px;
          }
        }

        @media (max-width: 520px) {
          .mw-logo,
          .mw-footer-logo {
            flex: 0 0 auto;
          }

          .mw-nav-links .mw-quote {
            font-size: 0;
            min-width: 78px;
          }

          .mw-nav-links .mw-quote::after {
            content: "Quote →";
            position: relative;
            z-index: 2;
            font-size: 12px;
          }

          .mw-created-badge,
          .mw-eyebrow,
          .mw-final-eyebrow {
            letter-spacing: 0.08em;
          }

          .mw-hero h1 {
            letter-spacing: -0.095em;
          }

          .mw-hero-pretitle-row {
            align-items: stretch;
          }

          .mw-hero-pretitle-row > span {
            width: fit-content;
          }

          .mw-actions {
            grid-template-columns: 1fr;
          }

          .mw-module-card-head,
          .mw-capability-head,
          .mw-timeline-topline {
            gap: 10px;
          }

          .mw-module-label,
          .mw-capability-number {
            flex: 0 0 auto;
          }

          .mw-capability-tags span,
          .mw-timeline-tags span {
            font-size: 9.5px;
          }

          .mw-final-proof-row span {
            min-height: 38px;
          }
        }

        @media (max-width: 420px) {
          .mw-shell,
          .mw-nav-inner {
            width: min(100% - 22px, 1180px);
          }

          .mw-brand {
            gap: 9px;
          }

          .mw-logo {
            width: 42px;
            height: 42px;
          }

          .mw-brand strong {
            font-size: 13px;
          }

          .mw-hero {
            padding-top: 34px;
          }

          .mw-hero h1 {
            font-size: clamp(48px, 16vw, 68px);
          }

          .mw-hero-lede {
            font-size: 19px;
          }

          .mw-hero-copy {
            font-size: 15px;
          }

          .mw-section {
            padding: 42px 0;
          }

          .mw-module-card,
          .mw-capability-card,
          .mw-timeline-content,
          .mw-final-action-card {
            border-radius: 24px;
          }

          .mw-architecture-pro,
          .mw-process-timeline,
          .mw-final-pro {
            border-radius: 28px;
          }

          .mw-footer-links {
            gap: 8px;
          }

          .mw-footer-links a {
            min-height: 38px;
            font-size: 11.5px;
          }
        }


        /* Service-card anchor fixes for direct Learn More links */
        #mobile-app,
        #web-portal,
        #admin-dashboard,
        #process {
          scroll-margin-top: 112px;
        }

        @media (max-width: 720px) {
          #mobile-app,
          #web-portal,
          #admin-dashboard,
          #process {
            scroll-margin-top: 92px;
          }
        }


        /* New: dedicated API Integration section */
        #api-integration {
          position: relative;
          isolation: isolate;
        }

        #api-integration::before {
          content: "";
          position: absolute;
          inset: 0 calc(50% - 50vw);
          z-index: -1;
          background:
            radial-gradient(circle at 18% 12%, rgba(255, 216, 61, 0.09), transparent 25rem),
            radial-gradient(circle at 82% 48%, rgba(98, 214, 255, 0.11), transparent 27rem),
            radial-gradient(circle at 50% 100%, rgba(184, 168, 255, 0.08), transparent 25rem);
          pointer-events: none;
        }

        .mw-api-section {
          display: grid;
          grid-template-columns: minmax(360px, 0.92fr) minmax(0, 1.08fr);
          gap: 24px;
          align-items: stretch;
          padding: 24px;
          border-radius: 44px;
          background:
            radial-gradient(circle at 42% 45%, rgba(255, 216, 61, 0.12), transparent 25rem),
            radial-gradient(circle at 78% 15%, rgba(98, 214, 255, 0.12), transparent 22rem),
            linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.026));
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 36px 110px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255,255,255,0.09);
          overflow: hidden;
        }

        .mw-api-visual {
          position: relative;
          min-height: 480px;
          border-radius: 34px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(98, 214, 255, 0.12), transparent 18rem),
            rgba(255,255,255,0.04);
          background-size: 28px 28px, 28px 28px, auto, auto;
          border: 1px solid rgba(255,255,255,0.09);
          overflow: hidden;
        }

        .mw-api-core {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 4;
          display: grid;
          place-items: center;
          width: 210px;
          height: 210px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          text-align: center;
          color: #06101d;
          background:
            radial-gradient(circle at 35% 18%, rgba(255,255,255,0.88), transparent 4rem),
            linear-gradient(135deg, #fff1a8, #ffd83d 42%, #62d6ff 100%);
          border: 1px solid rgba(255,255,255,0.42);
          box-shadow:
            0 0 0 16px rgba(255, 216, 61, 0.055),
            0 0 0 32px rgba(98, 214, 255, 0.025),
            0 34px 100px rgba(255, 216, 61, 0.16),
            inset 0 1px 0 rgba(255,255,255,0.58);
        }

        .mw-api-core span {
          display: block;
          color: rgba(6, 16, 29, 0.66);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mw-api-core strong {
          display: block;
          margin-top: 9px;
          color: #06101d;
          font-size: 33px;
          line-height: 0.86;
          letter-spacing: -0.075em;
        }

        .mw-api-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          border: 1px dashed rgba(247, 251, 255, 0.16);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .mw-api-orbit-one {
          width: 330px;
          height: 330px;
        }

        .mw-api-orbit-two {
          width: 420px;
          height: 420px;
          border-color: rgba(255, 216, 61, 0.14);
        }

        .mw-api-node {
          position: absolute;
          z-index: 5;
          display: grid;
          place-items: center;
          min-width: 104px;
          min-height: 50px;
          padding: 0 12px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.86);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.038));
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow:
            0 24px 70px rgba(0,0,0,0.24),
            inset 0 1px 0 rgba(255,255,255,0.09);
          backdrop-filter: blur(16px);
          font-size: 12px;
          font-weight: 950;
        }

        .mw-api-node::before {
          content: "";
          width: 7px;
          height: 7px;
          margin-right: 7px;
          border-radius: 999px;
          background: #ffd83d;
          box-shadow: 0 0 18px rgba(255,216,61,0.4);
        }

        .mw-api-node span {
          display: inline-flex;
          align-items: center;
        }

        .mw-api-node-one { left: 50%; top: 30px; transform: translateX(-50%); }
        .mw-api-node-two { right: 28px; top: 35%; }
        .mw-api-node-three { right: 62px; bottom: 64px; }
        .mw-api-node-four { left: 44px; bottom: 66px; }
        .mw-api-node-five { left: 26px; top: 35%; }
        .mw-api-node-six { left: 50%; bottom: 28px; transform: translateX(-50%); }

        .mw-api-content {
          display: grid;
          gap: 14px;
        }

        .mw-api-card {
          position: relative;
          overflow: hidden;
          min-height: 142px;
          padding: 20px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 86% 8%, rgba(255, 216, 61, 0.1), transparent 11rem),
            linear-gradient(180deg, rgba(255,255,255,0.092), rgba(255,255,255,0.032));
          border: 1px solid rgba(255,255,255,0.105);
          box-shadow:
            0 24px 76px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .mw-api-card::before {
          content: "";
          position: absolute;
          left: 20px;
          right: 20px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, #ffd83d, transparent);
          box-shadow: 0 0 26px rgba(255,216,61,0.2);
        }

        .mw-api-card span {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 10px;
          border-radius: 999px;
          color: #06101d;
          background: #ffd83d;
          box-shadow: 0 0 22px rgba(255,216,61,0.16);
          font-size: 11px;
          font-weight: 950;
        }

        .mw-api-card strong {
          display: block;
          margin-top: 14px;
          color: #ffffff;
          font-size: 25px;
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .mw-api-card p {
          margin: 10px 0 0;
          color: rgba(247, 251, 255, 0.62);
          font-size: 13.5px;
          line-height: 1.58;
        }

        .mw-api-checks {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 18px;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.09);
        }

        .mw-api-checks span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 32px;
          padding: 0 10px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.75);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 11px;
          font-weight: 950;
        }

        .mw-api-checks span::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #ffd83d;
          box-shadow: 0 0 16px rgba(255,216,61,0.35);
        }

        #api-integration,
        #architecture,
        #process {
          scroll-margin-top: 112px;
        }

        @media (max-width: 1080px) {
          .mw-api-section {
            grid-template-columns: 1fr;
          }

          .mw-api-visual {
            min-height: 440px;
          }
        }

        @media (max-width: 720px) {
          .mw-api-section {
            padding: 16px;
            border-radius: 32px;
            gap: 14px;
          }

          .mw-api-visual {
            min-height: 360px;
            border-radius: 26px;
          }

          .mw-api-core {
            width: 168px;
            height: 168px;
          }

          .mw-api-core strong {
            font-size: 27px;
          }

          .mw-api-orbit-one {
            width: 250px;
            height: 250px;
          }

          .mw-api-orbit-two {
            width: 320px;
            height: 320px;
          }

          .mw-api-node {
            min-width: 82px;
            min-height: 42px;
            font-size: 10px;
          }

          .mw-api-node-one { top: 18px; }
          .mw-api-node-two { right: 12px; }
          .mw-api-node-three { right: 24px; bottom: 46px; }
          .mw-api-node-four { left: 20px; bottom: 46px; }
          .mw-api-node-five { left: 10px; }
          .mw-api-node-six { bottom: 14px; }

          .mw-api-card {
            min-height: auto;
            padding: 18px;
            border-radius: 24px;
          }

          #api-integration,
          #architecture,
          #process {
            scroll-margin-top: 92px;
          }
        }


        /* Logo cleanup: remove icon boxes and let transparent logo sit flush */
        .mw-logo,
        .mw-footer-logo {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          outline: 0 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          overflow: visible !important;
        }

        .mw-logo::before,
        .mw-logo::after,
        .mw-footer-logo::before,
        .mw-footer-logo::after {
          display: none !important;
          content: none !important;
        }

        .mw-logo img,
        .mw-footer-logo img {
          display: block;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.18));
        }

        .mw-logo {
          width: 54px !important;
          height: 54px !important;
          flex: 0 0 54px !important;
        }

        .mw-footer-logo {
          width: 50px !important;
          height: 50px !important;
          flex: 0 0 50px !important;
        }

        @media (max-width: 720px) {
          .mw-logo {
            width: 46px !important;
            height: 46px !important;
            flex-basis: 46px !important;
          }

          .mw-footer-logo {
            width: 46px !important;
            height: 46px !important;
            flex-basis: 46px !important;
          }
        }


        /* Logo size fix: double the new transparent logo */
        .mw-nav-inner {
          min-height: 122px !important;
        }

        .mw-logo {
          width: 108px !important;
          height: 108px !important;
          flex: 0 0 108px !important;
        }

        .mw-footer-logo {
          width: 100px !important;
          height: 100px !important;
          flex: 0 0 100px !important;
        }

        .mw-logo img,
        .mw-footer-logo img {
          object-fit: contain !important;
        }

        @media (max-width: 720px) {
          .mw-nav-inner {
            min-height: 106px !important;
          }

          .mw-logo {
            width: 92px !important;
            height: 92px !important;
            flex-basis: 92px !important;
          }

          .mw-footer-logo {
            width: 88px !important;
            height: 88px !important;
            flex-basis: 88px !important;
          }
        }

        @media (max-width: 430px) {
          .mw-nav-inner {
            min-height: 96px !important;
          }

          .mw-logo {
            width: 82px !important;
            height: 82px !important;
            flex-basis: 82px !important;
          }
        }


        /* Mobile-only ChatGPT signature polish: smart motion, scans, pulses, and live data */
        @keyframes mw-mobile-aurora-drift {
          0%, 100% { background-position: 0% 50%, 100% 50%, 50% 50%; }
          50% { background-position: 100% 50%, 0% 50%, 50% 60%; }
        }

        @keyframes mw-mobile-scan-sweep {
          0% { transform: translateX(-135%) rotate(10deg); opacity: 0; }
          14% { opacity: 0.62; }
          54% { opacity: 0.22; }
          100% { transform: translateX(135%) rotate(10deg); opacity: 0; }
        }

        @keyframes mw-mobile-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes mw-mobile-orbit-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateY(-124px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateY(-124px) rotate(-360deg); }
        }

        @keyframes mw-mobile-orbit-2 {
          from { transform: translate(-50%, -50%) rotate(58deg) translateY(-160px) rotate(-58deg); }
          to { transform: translate(-50%, -50%) rotate(418deg) translateY(-160px) rotate(-418deg); }
        }

        @keyframes mw-mobile-orbit-3 {
          from { transform: translate(-50%, -50%) rotate(118deg) translateY(-160px) rotate(-118deg); }
          to { transform: translate(-50%, -50%) rotate(478deg) translateY(-160px) rotate(-478deg); }
        }

        @keyframes mw-mobile-orbit-4 {
          from { transform: translate(-50%, -50%) rotate(180deg) translateY(-124px) rotate(-180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg) translateY(-124px) rotate(-540deg); }
        }

        @keyframes mw-mobile-orbit-5 {
          from { transform: translate(-50%, -50%) rotate(242deg) translateY(-160px) rotate(-242deg); }
          to { transform: translate(-50%, -50%) rotate(602deg) translateY(-160px) rotate(-602deg); }
        }

        @keyframes mw-mobile-orbit-6 {
          from { transform: translate(-50%, -50%) rotate(302deg) translateY(-160px) rotate(-302deg); }
          to { transform: translate(-50%, -50%) rotate(662deg) translateY(-160px) rotate(-662deg); }
        }

        @keyframes mw-mobile-data-pulse {
          0%, 100% { opacity: 0.42; filter: drop-shadow(0 0 0 rgba(98, 214, 255, 0)); }
          50% { opacity: 1; filter: drop-shadow(0 0 16px rgba(98, 214, 255, 0.38)); }
        }

        @media (max-width: 720px) {
          .mw-hero,
          .mw-module-card,
          .mw-capability-card,
          .mw-timeline-content,
          .mw-api-section,
          .mw-final-pro {
            background-size: 180% 180%, 160% 160%, auto !important;
            animation: mw-mobile-aurora-drift 15s ease-in-out infinite;
          }

          .mw-module-preview,
          .mw-api-visual,
          .mw-final-action-card,
          .mw-web-window,
          .mw-phone {
            position: relative;
            overflow: hidden;
          }

          .mw-module-preview::after,
          .mw-api-visual::after,
          .mw-final-action-card::after,
          .mw-web-window::before,
          .mw-phone::after {
            content: "";
            position: absolute;
            top: -28%;
            bottom: -28%;
            width: 42%;
            left: 0;
            z-index: 20;
            background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.24), rgba(255,255,255,0.16), transparent);
            transform: translateX(-135%) rotate(10deg);
            animation: mw-mobile-scan-sweep 6.2s ease-in-out infinite;
            pointer-events: none;
            mix-blend-mode: screen;
          }

          .mw-module-card:nth-child(2) .mw-module-preview::after {
            background: linear-gradient(90deg, transparent, rgba(125, 247, 231, 0.24), rgba(255,255,255,0.16), transparent);
            animation-delay: -2s;
          }

          .mw-module-card:nth-child(3) .mw-module-preview::after {
            background: linear-gradient(90deg, transparent, rgba(184, 168, 255, 0.24), rgba(255,255,255,0.16), transparent);
            animation-delay: -4s;
          }

          .mw-api-visual::after,
          .mw-final-action-card::after {
            background: linear-gradient(90deg, transparent, rgba(255, 216, 61, 0.24), rgba(255,255,255,0.16), transparent);
          }

          .mw-api-orbit-one {
            animation: mw-mobile-spin-around 32s linear infinite;
          }

          .mw-api-orbit-two {
            animation: mw-mobile-spin-around 44s linear infinite reverse;
          }

          @keyframes mw-mobile-spin-around {
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }

          .mw-floating-card,
          .mw-final-proof-row span,
          .mw-created-badge {
            animation: mw-mobile-float 5.4s ease-in-out infinite;
          }

          .mw-final-proof-row span:nth-child(even) {
            animation-delay: -2.7s;
          }

          .mw-api-node {
            left: 50%;
            top: 50%;
            right: auto;
            bottom: auto;
            transform: translate(-50%, -50%);
            transform-origin: center center;
            will-change: transform;
          }

          .mw-api-node-one {
            animation: mw-mobile-orbit-1 20s linear infinite;
          }

          .mw-api-node-two {
            animation: mw-mobile-orbit-2 26s linear infinite;
          }

          .mw-api-node-three {
            animation: mw-mobile-orbit-3 30s linear infinite reverse;
          }

          .mw-api-node-four {
            animation: mw-mobile-orbit-4 22s linear infinite;
          }

          .mw-api-node-five {
            animation: mw-mobile-orbit-5 28s linear infinite reverse;
          }

          .mw-api-node-six {
            animation: mw-mobile-orbit-6 24s linear infinite;
          }

          .mw-preview-chip-row i,
          .mw-preview-web-kpis i,
          .mw-preview-admin-tabs i,
          .mw-capability-visual i,
          .mw-timeline-visual i,
          .mw-final-mini-stack i,
          .mw-api-checks span::before {
            animation: mw-mobile-data-pulse 4.4s ease-in-out infinite;
          }

          .mw-preview-chip-row i:nth-child(2),
          .mw-preview-web-kpis i:nth-child(2),
          .mw-preview-admin-tabs i:nth-child(2),
          .mw-capability-visual i:nth-child(2),
          .mw-timeline-visual i:nth-child(2),
          .mw-final-mini-stack i:nth-child(2) {
            animation-delay: -1.4s;
          }

          .mw-preview-chip-row i:nth-child(3),
          .mw-preview-web-kpis i:nth-child(3),
          .mw-preview-admin-tabs i:nth-child(3),
          .mw-capability-visual i:nth-child(3),
          .mw-timeline-visual i:nth-child(3),
          .mw-final-mini-stack i:nth-child(3) {
            animation-delay: -2.8s;
          }

          .mw-button-primary,
          .mw-nav-links .mw-quote {
            background-size: 220% 220% !important;
            animation: mw-mobile-aurora-drift 8s ease-in-out infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mw-hero,
          .mw-module-card,
          .mw-capability-card,
          .mw-timeline-content,
          .mw-api-section,
          .mw-final-pro,
          .mw-module-preview::after,
          .mw-api-visual::after,
          .mw-final-action-card::after,
          .mw-web-window::before,
          .mw-phone::after,
          .mw-api-orbit-one,
          .mw-api-orbit-two,
          .mw-floating-card,
          .mw-api-node,
          .mw-final-proof-row span,
          .mw-created-badge,
          .mw-preview-chip-row i,
          .mw-preview-web-kpis i,
          .mw-preview-admin-tabs i,
          .mw-capability-visual i,
          .mw-timeline-visual i,
          .mw-final-mini-stack i,
          .mw-api-checks span::before,
          .mw-button-primary,
          .mw-nav-links .mw-quote {
            animation: none !important;
          }
        }


        /* CTA attention polish: premium comet halo for free quote buttons */
        @keyframes mw-cta-comet-orbit {
          to { transform: rotate(360deg); }
        }

        @keyframes mw-cta-breathing-glow {
          0%, 100% {
            box-shadow:
              0 26px 70px rgba(98, 214, 255, 0.26),
              0 0 0 0 rgba(98, 214, 255, 0.0),
              inset 0 1px 0 rgba(255, 255, 255, 0.42);
          }
          50% {
            box-shadow:
              0 34px 86px rgba(98, 214, 255, 0.34),
              0 0 0 9px rgba(98, 214, 255, 0.075),
              inset 0 1px 0 rgba(255, 255, 255, 0.52);
          }
        }

        @keyframes mw-cta-shine-pass {
          0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
          18% { opacity: 0.78; }
          52% { opacity: 0.22; }
          100% { transform: translateX(140%) skewX(-18deg); opacity: 0; }
        }

        @keyframes mw-cta-arrow-nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }

        .mw-button-primary,
        .mw-nav-links .mw-quote,
        .mw-final-main-button {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          animation: mw-cta-breathing-glow 4.8s ease-in-out infinite;
        }

        .mw-button-primary::after,
        .mw-nav-links .mw-quote::after,
        .mw-final-main-button::after {
          content: "";
          position: absolute;
          top: -42%;
          bottom: -42%;
          left: 0;
          z-index: 3;
          width: 38%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.46),
              rgba(255, 255, 255, 0.16),
              transparent
            );
          transform: translateX(-140%) skewX(-18deg);
          animation: mw-cta-shine-pass 5.2s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .mw-final-action-card {
          position: relative;
          isolation: isolate;
        }

        .mw-final-action-card .mw-final-main-button {
          overflow: visible;
        }

        .mw-final-action-card .mw-final-main-button::before {
          content: "";
          position: absolute;
          inset: -10px;
          z-index: -1;
          border-radius: 999px;
          background:
            conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(98, 214, 255, 0.0) 40deg,
              rgba(98, 214, 255, 0.8) 72deg,
              rgba(125, 247, 231, 0.72) 100deg,
              transparent 132deg,
              transparent 360deg
            );
          filter: blur(0.2px);
          opacity: 0.86;
          animation: mw-cta-comet-orbit 3.8s linear infinite;
          pointer-events: none;
        }

        .mw-final-action-card .mw-final-main-button span,
        .mw-button-primary span {
          position: relative;
          z-index: 4;
        }

        .mw-final-main-button {
          transform: translateZ(0);
        }

        .mw-final-main-button:hover,
        .mw-button-primary:hover,
        .mw-nav-links .mw-quote:hover {
          animation-duration: 2.6s;
        }

        .mw-final-main-button:hover::after,
        .mw-button-primary:hover::after,
        .mw-nav-links .mw-quote:hover::after {
          animation-duration: 2.2s;
        }

        .mw-final-main-button {
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.24);
        }

        .mw-final-main-button::first-letter {
          letter-spacing: -0.02em;
        }

        @media (max-width: 720px) {
          .mw-button-primary,
          .mw-nav-links .mw-quote,
          .mw-final-main-button {
            animation-duration: 4.2s;
          }

          .mw-final-action-card .mw-final-main-button::before {
            inset: -8px;
            opacity: 0.92;
            animation-duration: 3.2s;
          }

          .mw-final-main-button {
            min-height: 62px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mw-button-primary,
          .mw-nav-links .mw-quote,
          .mw-final-main-button,
          .mw-button-primary::after,
          .mw-nav-links .mw-quote::after,
          .mw-final-main-button::after,
          .mw-final-action-card .mw-final-main-button::before {
            animation: none !important;
          }
        }

      `}</style>

      <nav className="mw-nav">
        <div className="mw-shell mw-nav-inner">
          <a className="mw-brand" href="/dariktech" aria-label="Back to Darik Technologies">
            <span className="mw-logo" aria-hidden="true">
              <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
            </span>
            <span>
              <strong>Darik Technologies</strong>
              <span>Mobile + Web + Admin</span>
            </span>
          </a>

          <div className="mw-nav-links">
            <a href="#modules">Modules</a>
            <a href="#architecture">Architecture</a>
            <a href="#included">Included</a>
            <a href="#api-integration">API</a>
            <a href="#process">Process</a>
            <a className="mw-quote" href={quoteHref}>Free quote →</a>
          </div>
        </div>
      </nav>

      <section className="mw-shell mw-hero">
        <div>
          <a className="mw-back" href="/dariktech">← Back to Darik Technologies</a>

          <div className="mw-hero-pretitle-row">
            <span className="mw-eyebrow">Connected product systems</span>
            <span className="mw-created-badge">Created with ChatGPT</span>
          </div>

          <h1>Mobile + Web + <span>Admin</span></h1>
          <p className="mw-hero-lede">
            One business system split into the right tools: a mobile app, a web portal, and an admin dashboard all connected to the same backend.
          </p>
          <p className="mw-hero-copy">
            This is for businesses that need more than a pretty app. You get the customer-facing experience, the internal tools, the database, the roles, the workflows, and the control panel needed to actually run operations.
          </p>

          <div className="mw-actions">
            <a className="mw-button mw-button-primary" href={quoteHref}>Request a system like this →</a>
            <a className="mw-button mw-button-secondary" href="#architecture">View system architecture</a>
          </div>

          <div className="mw-hero-points">
            <div className="mw-point"><strong>Mobile app</strong><span>iPhone and Android experiences for customers or teams.</span></div>
            <div className="mw-point"><strong>Web portal</strong><span>Browser-based workflows for users who need desktop access.</span></div>
            <div className="mw-point"><strong>Admin dashboard</strong><span>Private control center for managing the whole business.</span></div>
          </div>
        </div>

        <HeroSystemVisual />
      </section>

      <section className="mw-section" id="modules">
        <div className="mw-shell">
          <div className="mw-section-head">
            <h2>Three products. One connected system.</h2>
            <p>The mobile app, web portal, and admin dashboard should not feel like separate projects. They should feel like one machine.</p>
          </div>

          <div className="mw-module-grid">
            {serviceModules.map((item) => (
              <article
                className="mw-module-card"
                id={item.type === "mobile" ? "mobile-app" : item.type === "web" ? "web-portal" : "admin-dashboard"}
                key={item.title}
              >
                <div className="mw-module-card-head">
                  <div className="mw-module-icon"><LineIcon type={item.type} /></div>
                  <span className="mw-module-label">{item.label}</span>
                </div>

                <ModulePreview type={item.type} />

                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mw-section" id="architecture">
        <div className="mw-shell">
          <div className="mw-section-head">
            <h2>The backend is what makes it real.</h2>
            <p>The interface is only half the product. The database, roles, permissions, logic, and admin tools are what make it useful for a real business.</p>
          </div>

          <div className="mw-architecture mw-architecture-pro">
            <div className="mw-arch-pro-grid" aria-label="Connected mobile web admin architecture">
              <div className="mw-arch-beam mw-arch-beam-one" aria-hidden="true" />
              <div className="mw-arch-beam mw-arch-beam-two" aria-hidden="true" />
              <div className="mw-arch-beam mw-arch-beam-three" aria-hidden="true" />
              <div className="mw-arch-beam mw-arch-beam-four" aria-hidden="true" />

              <article className="mw-arch-app-node mw-arch-mobile">
                <span>01</span>
                <strong>Mobile App</strong>
                <p>Customers, staff, drivers, vendors, or field teams use the system from iOS and Android.</p>
                <div className="mw-arch-node-pills"><b>Push</b><b>GPS</b><b>Actions</b></div>
              </article>

              <article className="mw-arch-app-node mw-arch-web">
                <span>02</span>
                <strong>Web Portal</strong>
                <p>Desktop-friendly access for clients, managers, employees, retailers, or partners.</p>
                <div className="mw-arch-node-pills"><b>Portal</b><b>Forms</b><b>Reports</b></div>
              </article>

              <article className="mw-arch-app-node mw-arch-admin">
                <span>03</span>
                <strong>Admin Dashboard</strong>
                <p>The private control center for orders, users, approvals, support, payouts, and reports.</p>
                <div className="mw-arch-node-pills"><b>Roles</b><b>Ops</b><b>Control</b></div>
              </article>

              <div className="mw-arch-core-pro">
                <div className="mw-arch-core-ring" aria-hidden="true" />
                <span>Live Backend</span>
                <strong>Database<br />Auth<br />Logic</strong>
                <small>One source of truth</small>
              </div>

              <article className="mw-arch-service mw-service-auth">
                <span>Auth + Roles</span>
                <strong>Who can do what</strong>
              </article>

              <article className="mw-arch-service mw-service-storage">
                <span>Storage</span>
                <strong>Files, images, docs</strong>
              </article>

              <article className="mw-arch-service mw-service-notify">
                <span>Notifications</span>
                <strong>Status changes + alerts</strong>
              </article>

              <article className="mw-arch-service mw-service-payments">
                <span>Payments</span>
                <strong>Invoices, fees, payouts</strong>
              </article>

              <article className="mw-arch-service mw-service-maps">
                <span>Maps + GPS</span>
                <strong>Location-aware workflows</strong>
              </article>

              <article className="mw-arch-service mw-service-audit">
                <span>Audit Logs</span>
                <strong>Track important actions</strong>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mw-section" id="included">
        <div className="mw-shell">
          <div className="mw-section-head">
            <h2>What a complete system can include.</h2>
            <p>Every business is different, but these are the common pieces that turn an idea into a usable platform.</p>
          </div>

          <div className="mw-include-grid mw-capability-grid">
            {included.map(([title, body], index) => (
              <article className="mw-include-card mw-capability-card" key={title}>
                <div className="mw-capability-head">
                  <div className="mw-include-icon mw-capability-icon">
                    <LineIcon type={capabilityTypes[index]} />
                  </div>
                  <span className="mw-capability-number">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="mw-capability-visual" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>

                <h3>{title}</h3>
                <p>{body}</p>

                <div className="mw-capability-tags" aria-label={`${title} capability tags`}>
                  {capabilityTags[index].map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="mw-section" id="api-integration">
        <div className="mw-shell">
          <div className="mw-section-head">
            <h2>API integration that connects your business to the outside world.</h2>
            <p>When your platform needs to talk to payment providers, maps, AI tools, CRMs, accounting systems, WhatsApp, SMS, delivery tools, or internal databases, the API layer is what makes it work cleanly.</p>
          </div>

          <div className="mw-api-section">
            <div className="mw-api-visual" aria-hidden="true">
              <div className="mw-api-core">
                <span>API Layer</span>
                <strong>Connect<br />Validate<br />Sync</strong>
              </div>

              <div className="mw-api-orbit mw-api-orbit-one" />
              <div className="mw-api-orbit mw-api-orbit-two" />

              <div className="mw-api-node mw-api-node-one"><span>Payments</span></div>
              <div className="mw-api-node mw-api-node-two"><span>Maps</span></div>
              <div className="mw-api-node mw-api-node-three"><span>AI</span></div>
              <div className="mw-api-node mw-api-node-four"><span>WhatsApp</span></div>
              <div className="mw-api-node mw-api-node-five"><span>CRM</span></div>
              <div className="mw-api-node mw-api-node-six"><span>Accounting</span></div>
            </div>

            <div className="mw-api-content">
              <article className="mw-api-card">
                <span>01</span>
                <strong>Third-party services</strong>
                <p>Connect the platform to outside tools like payment gateways, map providers, AI services, messaging platforms, and verification providers.</p>
              </article>

              <article className="mw-api-card">
                <span>02</span>
                <strong>Internal business systems</strong>
                <p>Link the app to existing company systems, databases, dashboards, spreadsheets, or operational tools without forcing staff to double-enter data.</p>
              </article>

              <article className="mw-api-card">
                <span>03</span>
                <strong>Secure data flow</strong>
                <p>Use clean rules for what data gets sent, what comes back, who can trigger it, what gets logged, and what happens when an API fails.</p>
              </article>

              <div className="mw-api-checks">
                <span>Webhooks</span>
                <span>Secure keys</span>
                <span>Retry logic</span>
                <span>Audit logs</span>
                <span>Rate limits</span>
                <span>Error handling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mw-section" id="process">
        <div className="mw-shell">
          <div className="mw-section-head">
            <h2>How we build it without making a mess.</h2>
            <p>A multi-app system needs planning. The goal is to make complex operations feel simple to the people using it every day.</p>
          </div>

          <div className="mw-process-timeline" aria-label="Mobile web admin build process">
            <div className="mw-process-spine" aria-hidden="true" />
            {process.map(([number, title, body], index) => (
              <article className="mw-process-card mw-timeline-card" key={title}>
                <div className="mw-timeline-marker">
                  <span>{number}</span>
                </div>

                <div className="mw-timeline-content">
                  <div className="mw-timeline-topline">
                    <span>Phase {number}</span>
                    <b>{index === 0 ? "Discovery" : index === 1 ? "Product design" : index === 2 ? "Engineering" : index === 3 ? "Integration" : index === 4 ? "Validation" : "Growth"}</b>
                  </div>

                  <h3>{title}</h3>
                  <p>{body}</p>

                  <div className="mw-timeline-tags" aria-label={`${title} checkpoints`}>
                    {processDetails[index].map((detail) => (
                      <span key={detail}>{detail}</span>
                    ))}
                  </div>

                  <div className="mw-timeline-visual" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mw-shell mw-final mw-final-pro">
        <div className="mw-final-glow" aria-hidden="true" />

        <div className="mw-final-grid mw-final-pro-grid">
          <div className="mw-final-copy">
            <span className="mw-final-eyebrow">Ready to build</span>
            <h2>Turn your business into a connected product system.</h2>
            <p>
              Mobile app, web portal, admin dashboard, backend, roles, permissions, database, reports, notifications, and real workflows — built as one serious platform.
            </p>

            <div className="mw-final-proof-row" aria-label="System deliverables">
              <span>Mobile app</span>
              <span>Web portal</span>
              <span>Admin dashboard</span>
              <span>Backend logic</span>
            </div>
          </div>

          <div className="mw-final-action-card">
            <div className="mw-final-action-top">
              <span>Free quote</span>
              <strong>No pressure. Just clarity.</strong>
            </div>

            <div className="mw-final-mini-stack" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            <a className="mw-button mw-button-primary mw-final-main-button" href={quoteHref}>Start with a free quote →</a>
            <a className="mw-final-secondary-link" href="/dariktech">← Back to Darik Technologies</a>
          </div>
        </div>
      </section>

      <footer className="mw-footer">
        <div className="mw-shell mw-footer-inner">
          <a className="mw-footer-brand" href="/dariktech">
            <span className="mw-footer-logo" aria-hidden="true">
              <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
            </span>
            <span>
              <strong>Darik Technologies</strong>
              <small>Mobile + Web + Admin Systems</small>
            </span>
          </a>

          <div className="mw-footer-links">
            <a href="#modules">Modules</a>
            <a href="#architecture">Architecture</a>
            <a href="#included">Capabilities</a>
            <a href="#api-integration">API</a>
            <a href="#process">Process</a>
          </div>
        </div>
      </footer>
    </main>
  );
}