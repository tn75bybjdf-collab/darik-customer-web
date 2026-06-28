export const metadata = {
  title: "Darik Technologies | Business Apps Built From Idea to Launch",
  description:
    "Darik Technologies builds mobile apps, web apps, dashboards, marketplaces, booking systems, ordering platforms, and internal business tools for real companies.",
};

type ServiceVisual = "mobile" | "dashboard" | "marketplace" | "strategy";

type Service = {
  eyebrow: string;
  title: string;
  text: string;
  visual: ServiceVisual;
  chips: string[];
  href: string;
};

const services: Service[] = [
  {
    eyebrow: "01",
    title: "Mobile Apps",
    text: "Polished iOS and Android apps for customers, staff, drivers, suppliers, bookings, ordering, and daily business workflows.",
    visual: "mobile",
    chips: ["iOS", "Android", "Push Alerts", "Clean UX", "Expo"],
    href: "/dariktech/services/mobile-web-admin#mobile-app",
  },
  {
    eyebrow: "02",
    title: "Web Apps & Dashboards",
    text: "Clean admin panels and portals for approvals, reports, users, operations, and the controls your team needs every day.",
    visual: "dashboard",
    chips: ["Admin Panels", "Analytics", "Approvals", "Reports", "Roles"],
    href: "/dariktech/services/mobile-web-admin#web-portal",
  },
  {
    eyebrow: "03",
    title: "Marketplaces & Platforms",
    text: "Multi-sided platforms with customer flows, vendor portals, quote requests, orders, notifications, and backend logic.",
    visual: "marketplace",
    chips: ["Multi-vendor", "Orders", "Tracking", "Portals", "Payments"],
    href: "/dariktech/work/darik-marketplace",
  },
  {
    eyebrow: "04",
    title: "MVPs & Product Strategy",
    text: "Clear product planning for rough ideas: features, user journeys, launch scope, and what actually makes commercial sense.",
    visual: "strategy",
    chips: ["MVP Scope", "Feature Plan", "User Flow", "Launch Build", "Roadmap"],
    href: "/dariktech/services/mobile-web-admin#process",
  },
];

function ServiceIllustration({ visual }: { visual: ServiceVisual }) {
  if (visual === "mobile") {
    return (
      <div className="dt-service-visual dt-visual-mobile" aria-hidden="true">
        <div className="dt-phone-orbit dt-orbit-one" />
        <div className="dt-phone-orbit dt-orbit-two" />
        <div className="dt-phone-device">
          <div className="dt-phone-speaker" />
          <div className="dt-phone-screen-grid">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="dt-phone-bottom-card" />
        </div>
        <div className="dt-visual-bubble dt-bubble-ios">iOS</div>
        <div className="dt-visual-bubble dt-bubble-android">A</div>
      </div>
    );
  }

  if (visual === "dashboard") {
    return (
      <div className="dt-service-visual dt-visual-dashboard" aria-hidden="true">
        <div className="dt-laptop-base">
          <div className="dt-laptop-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="dt-dashboard-layout">
            <div className="dt-dashboard-sidebar" />
            <div className="dt-dashboard-main">
              <div className="dt-chart-bars">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="dt-chart-line" />
            </div>
          </div>
        </div>
        <div className="dt-floating-metric">
          <strong>92%</strong>
          <span>Ready</span>
        </div>
      </div>
    );
  }

  if (visual === "marketplace") {
    return (
      <div className="dt-service-visual dt-visual-marketplace" aria-hidden="true">
        <div className="dt-market-platform" />
        <div className="dt-storefront">
          <div className="dt-store-awning">
            <span />
            <span />
            <span />
          </div>
          <div className="dt-store-window" />
          <div className="dt-store-door" />
        </div>
        <div className="dt-market-cart">
          <div className="dt-cart-basket" />
          <span />
          <span />
        </div>
        <div className="dt-user-node dt-node-one" />
        <div className="dt-user-node dt-node-two" />
      </div>
    );
  }

  return (
    <div className="dt-service-visual dt-visual-strategy" aria-hidden="true">
      <div className="dt-launch-rings">
        <span />
        <span />
      </div>
      <div className="dt-rocket">
        <div className="dt-rocket-window" />
        <div className="dt-rocket-flame" />
      </div>
      <div className="dt-plan-card">
        <span />
        <span />
        <span />
      </div>
      <div className="dt-idea-dot">✦</div>
    </div>
  );
}

const projects = [
  {
    name: "Darik Marketplace",
    type: "Retail marketplace platform",
    summary:
      "A marketplace experience built around product discovery, ordering, delivery flows, retailer operations, driver workflows, returns, and admin control.",
    tags: ["Marketplace", "Customer App", "Admin Dashboard", "Operations"],
    metric: "4 apps",
    metricLabel: "connected system",
    visual: "marketplace",
    href: "/dariktech/work/darik-marketplace",
  },
  {
    name: "PartBid",
    type: "Auto parts quote-request platform",
    summary:
      "A request-and-quote system that connects garages with suppliers, allowing businesses to receive multiple part offers in one organized workflow.",
    tags: ["B2B", "Quotes", "Supplier Portal", "Chat"],
    metric: "B2B",
    metricLabel: "quote workflow",
    visual: "quotes",
  },
  {
    name: "Tawleh Manager",
    type: "Restaurant table ordering system",
    summary:
      "A QR-based dine-in ordering platform designed for restaurants that need table-level ordering, staff visibility, and simple branch operations.",
    tags: ["QR Ordering", "Restaurant Tech", "SaaS", "Reports"],
    metric: "QR",
    metricLabel: "table ordering",
    visual: "restaurant",
  },
  {
    name: "Business Operations Tools",
    type: "Internal automation systems",
    summary:
      "Custom dashboards and workflow tools for companies that need cleaner reporting, discrepancy tracking, approvals, and less manual paperwork.",
    tags: ["Automation", "Dashboards", "Reporting", "Databases"],
    metric: "Ops",
    metricLabel: "workflow control",
    visual: "operations",
  },
];


function ProjectVisual({ visual }: { visual: string }) {
  if (visual === "marketplace") {
    return (
      <div className="dt-project-visual dt-project-marketplace" aria-hidden="true">
        <div className="dt-project-phone">
          <span />
          <span />
          <span />
        </div>
        <div className="dt-project-route">
          <i />
          <i />
          <i />
        </div>
        <div className="dt-project-box dt-project-box-one" />
        <div className="dt-project-box dt-project-box-two" />
      </div>
    );
  }

  if (visual === "quotes") {
    return (
      <div className="dt-project-visual dt-project-quotes" aria-hidden="true">
        <div className="dt-quote-stack">
          <span />
          <span />
          <span />
        </div>
        <div className="dt-bid-bubble dt-bid-one">$</div>
        <div className="dt-bid-bubble dt-bid-two">✓</div>
      </div>
    );
  }

  if (visual === "restaurant") {
    return (
      <div className="dt-project-visual dt-project-restaurant" aria-hidden="true">
        <div className="dt-qr-card">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="dt-table-dot dt-table-one" />
        <div className="dt-table-dot dt-table-two" />
        <div className="dt-order-ticket">
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }

  return (
    <div className="dt-project-visual dt-project-operations" aria-hidden="true">
      <div className="dt-ops-panel">
        <span />
        <span />
        <span />
      </div>
      <div className="dt-ops-chart">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

const process = [
  {
    phase: "01",
    title: "Understand the business",
    text: "Before building screens, We map the actual problem, users, workflow, money flow, and operational requirements.",
    chips: ["Problem", "Users", "Workflow"],
    visual: "discover",
  },
  {
    phase: "02",
    title: "Design the product flow",
    text: "We define the core features, user journeys, database needs, admin controls, and what should be included in the launch version.",
    chips: ["UX Flow", "Features", "Admin"],
    visual: "flow",
  },
  {
    phase: "03",
    title: "Build the real system",
    text: "The app, dashboard, backend, authentication, notifications, database, and logic are built as one connected product.",
    chips: ["App", "Backend", "Database"],
    visual: "build",
  },
  {
    phase: "04",
    title: "Prepare for launch",
    text: "We focus on testing, cleanup, real-world use cases, and making sure the product is ready for customers or internal teams.",
    chips: ["Testing", "Launch", "Support"],
    visual: "launch",
  },
];

function ProcessVisual({ visual }: { visual: string }) {
  if (visual === "discover") {
    return (
      <div className="dt-process-visual dt-process-discover" aria-hidden="true">
        <div className="dt-process-magnifier" />
        <div className="dt-process-note dt-process-note-one" />
        <div className="dt-process-note dt-process-note-two" />
        <div className="dt-process-pulse" />
      </div>
    );
  }

  if (visual === "flow") {
    return (
      <div className="dt-process-visual dt-process-flow" aria-hidden="true">
        <div className="dt-flow-node dt-flow-node-one">A</div>
        <div className="dt-flow-node dt-flow-node-two">B</div>
        <div className="dt-flow-node dt-flow-node-three">C</div>
        <div className="dt-flow-line dt-flow-line-one" />
        <div className="dt-flow-line dt-flow-line-two" />
      </div>
    );
  }

  if (visual === "build") {
    return (
      <div className="dt-process-visual dt-process-build" aria-hidden="true">
        <div className="dt-code-window">
          <span />
          <span />
          <span />
        </div>
        <div className="dt-build-cube dt-build-cube-one" />
        <div className="dt-build-cube dt-build-cube-two" />
      </div>
    );
  }

  return (
    <div className="dt-process-visual dt-process-launch" aria-hidden="true">
      <div className="dt-launch-ring" />
      <div className="dt-mini-rocket">
        <span />
      </div>
      <div className="dt-launch-checklist">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

const capabilityGroups = [
  {
    title: "Product thinking",
    text: "Feature planning, user journeys, MVP scope, and business logic before writing code.",
    items: ["MVP Planning", "UI/UX Flows", "Product Strategy", "Launch Scope"],
  },
  {
    title: "Mobile & web builds",
    text: "Customer apps, staff tools, web apps, dashboards, and responsive business portals.",
    items: ["React Native", "Expo", "Next.js", "Admin Dashboards"],
  },
  {
    title: "Backend & data",
    text: "Databases, authentication, storage, APIs, roles, permissions, and real workflows.",
    items: ["Supabase", "Firebase", "Database Design", "Authentication"],
  },
  {
    title: "Operations logic",
    text: "Orders, bookings, marketplaces, notifications, approvals, reports, and automation.",
    items: ["Push Notifications", "API Integration", "Marketplace Apps", "Business Automation"],
  },
];

export default function DarikTechPage() {
  const quoteHref = "/dariktech/quote";
  const year = new Date().getFullYear();

  return (
    <main className="dt-page">
      <style>{`

        /* SAFE FIX: only prevent exposed body/bottom area from showing white */
        html,
        body {
          margin: 0;
          background: #07111f !important;
          overflow-x: hidden;
        }

        body {
          min-height: 100%;
        }

        :root {
          --dt-bg: #07111f;
          --dt-bg-soft: #0d1b2e;
          --dt-card: rgba(255, 255, 255, 0.08);
          --dt-card-strong: rgba(255, 255, 255, 0.12);
          --dt-border: rgba(255, 255, 255, 0.14);
          --dt-text: #f7fbff;
          --dt-muted: rgba(247, 251, 255, 0.72);
          --dt-faint: rgba(247, 251, 255, 0.52);
          --dt-accent: #62d6ff;
          --dt-accent-2: #7c5cff;
          --dt-accent-3: #22c55e;
          --dt-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
        }

        .dt-page {
          min-height: 100vh;
          color: var(--dt-text);
          background:
            radial-gradient(circle at 12% 8%, rgba(98, 214, 255, 0.22), transparent 32rem),
            radial-gradient(circle at 90% 10%, rgba(124, 92, 255, 0.24), transparent 34rem),
            radial-gradient(circle at 65% 95%, rgba(34, 197, 94, 0.16), transparent 30rem),
            linear-gradient(180deg, #07111f 0%, #091526 42%, #06101d 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }

        .dt-page *,
        .dt-page *::before,
        .dt-page *::after {
          box-sizing: border-box;
        }

        .dt-shell {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .dt-grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.23;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 58px 58px;
          mask-image: linear-gradient(to bottom, black, transparent 78%);
        }

        .dt-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 26px 0;
        }

        .dt-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--dt-text);
          min-width: 0;
        }

        .dt-logo-mark {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          padding: 7px;
          background:
            linear-gradient(135deg, rgba(98, 214, 255, 0.22), rgba(124, 92, 255, 0.2)),
            rgba(255, 255, 255, 0.08);
          border: 1px solid var(--dt-border);
          box-shadow: 0 16px 40px rgba(98, 214, 255, 0.14);
          overflow: hidden;
        }

        .dt-logo-mark img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 8px 18px rgba(98, 214, 255, 0.18));
        }

        .dt-logo-mark-large {
          width: 66px;
          height: 66px;
          flex-basis: 66px;
          border-radius: 22px;
          padding: 10px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(98, 214, 255, 0.14)),
            rgba(255, 255, 255, 0.1);
          box-shadow: 0 18px 60px rgba(98, 214, 255, 0.22);
        }

        .dt-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .dt-brand-text strong {
          font-size: 15px;
          letter-spacing: 0.01em;
        }

        .dt-brand-text span {
          margin-top: 4px;
          font-size: 12px;
          color: var(--dt-faint);
        }

        .dt-nav-links {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 14px;
          color: var(--dt-muted);
        }

        .dt-nav-links a {
          color: inherit;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .dt-nav-links a:hover {
          color: var(--dt-text);
        }

        .dt-pill-link {
          padding: 10px 14px;
          border: 1px solid var(--dt-border);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
        }

        .dt-hero {
          display: grid;
          grid-template-columns: 1.07fr 0.93fr;
          gap: 42px;
          align-items: center;
          padding: 52px 0 76px;
        }

        .dt-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          padding: 8px 12px;
          border: 1px solid var(--dt-border);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
          color: var(--dt-muted);
          font-size: 13px;
          backdrop-filter: blur(18px);
        }

        .dt-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--dt-accent-3);
          box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
        }

        .dt-hero h1 {
          margin: 20px 0 20px;
          max-width: 760px;
          font-size: clamp(42px, 7vw, 86px);
          line-height: 0.94;
          letter-spacing: -0.07em;
        }

        .dt-gradient-text {
          background: linear-gradient(90deg, #ffffff, #a8ecff 46%, #c8bdff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .dt-hero-copy {
          max-width: 660px;
          margin: 0;
          color: var(--dt-muted);
          font-size: clamp(17px, 2vw, 21px);
          line-height: 1.65;
        }

        .dt-hero-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 32px;
        }

        .dt-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 750;
          font-size: 14px;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .dt-button:hover {
          transform: translateY(-2px);
        }

        .dt-button-primary {
          color: #06101d;
          background: linear-gradient(135deg, #ffffff 0%, #9be9ff 52%, #bdb2ff 100%);
          box-shadow: 0 16px 46px rgba(98, 214, 255, 0.24);
        }

        .dt-button-secondary {
          color: var(--dt-text);
          border: 1px solid var(--dt-border);
          background: rgba(255, 255, 255, 0.07);
        }

        .dt-trust-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 36px;
          max-width: 720px;
        }

        .dt-stat {
          padding: 18px;
          border: 1px solid var(--dt-border);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
        }

        .dt-stat strong {
          display: block;
          font-size: 28px;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .dt-stat span {
          display: block;
          margin-top: 8px;
          font-size: 13px;
          line-height: 1.4;
          color: var(--dt-faint);
        }

        .dt-hero-card-wrap {
          position: relative;
        }

        .dt-hero-card-wrap::before {
          content: "";
          position: absolute;
          inset: 8% -8% -8% 8%;
          border-radius: 36px;
          background: linear-gradient(135deg, rgba(98, 214, 255, 0.22), rgba(124, 92, 255, 0.2));
          filter: blur(34px);
          opacity: 0.8;
        }

        .dt-product-card {
          position: relative;
          padding: 22px;
          border: 1px solid var(--dt-border);
          border-radius: 34px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.06)),
            rgba(7, 17, 31, 0.86);
          box-shadow: var(--dt-shadow);
          backdrop-filter: blur(24px);
          overflow: hidden;
        }

        .dt-product-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .dt-product-dots {
          display: flex;
          gap: 7px;
        }

        .dt-product-dots span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.24);
        }

        .dt-product-status {
          color: rgba(247, 251, 255, 0.78);
          font-size: 12px;
          border: 1px solid var(--dt-border);
          border-radius: 999px;
          padding: 7px 10px;
          background: rgba(255, 255, 255, 0.06);
        }

        .dt-dashboard {
          display: grid;
          gap: 14px;
        }

        .dt-dash-hero {
          padding: 22px;
          min-height: 178px;
          border-radius: 26px;
          background:
            radial-gradient(circle at 88% 20%, rgba(98, 214, 255, 0.36), transparent 11rem),
            linear-gradient(135deg, rgba(98, 214, 255, 0.2), rgba(124, 92, 255, 0.2));
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .dt-dash-brand {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .dt-dash-brand-copy {
          min-width: 0;
        }

        .dt-dash-hero span,
        .dt-mini-card span,
        .dt-work-card span {
          color: var(--dt-faint);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dt-dash-hero h2 {
          max-width: 360px;
          margin: 12px 0 0;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .dt-mini-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .dt-mini-card {
          min-height: 122px;
          padding: 18px;
          border-radius: 24px;
          border: 1px solid var(--dt-border);
          background: rgba(255, 255, 255, 0.07);
        }

        .dt-mini-card strong {
          display: block;
          margin-top: 18px;
          font-size: 25px;
          letter-spacing: -0.05em;
        }

        .dt-screen-list {
          display: grid;
          gap: 10px;
          padding: 16px;
          border-radius: 24px;
          border: 1px solid var(--dt-border);
          background: rgba(255, 255, 255, 0.055);
        }

        .dt-screen-row {
          display: grid;
          grid-template-columns: 38px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 11px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.06);
        }

        .dt-screen-icon {
          width: 38px;
          height: 38px;
          border-radius: 13px;
          background: rgba(98, 214, 255, 0.14);
          display: grid;
          place-items: center;
          color: #b9f1ff;
          font-weight: 800;
        }

        .dt-screen-row strong {
          display: block;
          font-size: 14px;
        }

        .dt-screen-row small {
          display: block;
          margin-top: 3px;
          color: var(--dt-faint);
        }

        .dt-chip {
          color: #b8f7cc;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.22);
          border-radius: 999px;
          padding: 6px 9px;
          font-size: 12px;
        }


        .dt-hero {
          grid-template-columns: minmax(0, 0.9fr) minmax(460px, 0.82fr);
          gap: clamp(34px, 6vw, 76px);
          align-items: center;
          padding: 46px 0 94px;
        }

        .dt-hero-left {
          position: relative;
        }

        .dt-hero-brand-chip {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          width: fit-content;
          padding: 10px 14px 10px 10px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.82);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.045)),
            rgba(8, 20, 35, 0.74);
          border: 1px solid rgba(98, 214, 255, 0.2);
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(18px);
        }

        .dt-hero-brand-chip .dt-logo-mark {
          width: 36px;
          height: 36px;
          flex-basis: 36px;
          border-radius: 13px;
          padding: 5px;
        }

        .dt-hero-brand-chip strong {
          display: block;
          color: #ffffff;
          font-size: 13px;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .dt-hero-brand-chip span {
          display: block;
          margin-top: 5px;
          color: rgba(247, 251, 255, 0.5);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dt-hero-title {
          margin: 26px 0 22px;
          max-width: 780px;
          font-size: clamp(50px, 6.2vw, 86px);
          line-height: 0.92;
          letter-spacing: -0.083em;
          text-wrap: balance;
        }

        .dt-hero-title-mark {
          display: inline-block;
          color: #62d6ff;
          text-shadow:
            0 0 30px rgba(98, 214, 255, 0.24),
            0 0 70px rgba(98, 214, 255, 0.1);
        }

        .dt-hero-copy {
          max-width: 640px;
          color: rgba(247, 251, 255, 0.76);
          font-size: clamp(17px, 1.45vw, 20px);
          line-height: 1.72;
        }

        .dt-hero-proof-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .dt-hero-proof {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.8);
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.095);
          font-size: 12px;
          font-weight: 850;
        }

        .dt-hero-proof::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #62d6ff;
          box-shadow: 0 0 14px rgba(98, 214, 255, 0.7);
        }

        .dt-trust-row {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          max-width: 740px;
          margin-top: 30px;
        }

        .dt-stat {
          min-height: 118px;
          border-radius: 24px;
          background:
            radial-gradient(circle at 88% 0%, rgba(98, 214, 255, 0.12), transparent 8rem),
            rgba(255, 255, 255, 0.055);
          border-color: rgba(255, 255, 255, 0.105);
        }

        .dt-stat strong {
          font-size: 25px;
        }

        .dt-hero-card-wrap {
          align-self: stretch;
          display: flex;
          align-items: center;
        }

        .dt-hero-card-wrap::before {
          inset: 9% -5% 2% 5%;
          background:
            radial-gradient(circle at 62% 42%, rgba(98, 214, 255, 0.23), transparent 20rem),
            radial-gradient(circle at 84% 74%, rgba(124, 92, 255, 0.18), transparent 17rem);
          filter: blur(38px);
        }

        .dt-product-card {
          width: 100%;
          min-height: 620px;
          padding: 24px;
          border-radius: 38px;
          border-color: rgba(98, 214, 255, 0.18);
          background:
            radial-gradient(circle at 92% 12%, rgba(98, 214, 255, 0.14), transparent 15rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.115), rgba(255, 255, 255, 0.045)),
            rgba(8, 20, 35, 0.78);
          box-shadow:
            0 38px 120px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.13);
        }

        .dt-product-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 36px;
          width: 160px;
          height: 4px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, #62d6ff, transparent);
          box-shadow: 0 0 28px rgba(98, 214, 255, 0.68);
        }

        .dt-product-card::after {
          content: "";
          position: absolute;
          inset: 22px;
          border-radius: 30px;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 76%);
          opacity: 0.56;
        }

        .dt-hero-blueprint {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 14px;
        }

        .dt-blueprint-hero {
          position: relative;
          overflow: hidden;
          min-height: 205px;
          padding: 24px;
          border-radius: 28px;
          border: 1px solid rgba(98, 214, 255, 0.22);
          background:
            radial-gradient(circle at 84% 18%, rgba(98, 214, 255, 0.28), transparent 10rem),
            linear-gradient(135deg, rgba(98, 214, 255, 0.16), rgba(124, 92, 255, 0.12)),
            rgba(255, 255, 255, 0.055);
        }

        .dt-blueprint-hero h2 {
          max-width: 420px;
          margin: 14px 0 0;
          font-size: clamp(34px, 3.5vw, 52px);
          line-height: 0.95;
          letter-spacing: -0.07em;
        }

        .dt-blueprint-hero span {
          color: rgba(247, 251, 255, 0.55);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .dt-blueprint-logo {
          position: absolute;
          right: 20px;
          top: 20px;
          display: grid;
          place-items: center;
          width: 66px;
          height: 66px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.18);
        }

        .dt-blueprint-logo img {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }

        .dt-blueprint-flow {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .dt-blueprint-node {
          min-height: 124px;
          padding: 18px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          background: rgba(255, 255, 255, 0.055);
        }

        .dt-blueprint-node strong {
          display: block;
          margin-top: 16px;
          color: #ffffff;
          font-size: 22px;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .dt-blueprint-node span {
          display: block;
          color: rgba(247, 251, 255, 0.48);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dt-blueprint-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 15px;
          color: #f7fbff;
          background: rgba(98, 214, 255, 0.14);
          border: 1px solid rgba(98, 214, 255, 0.22);
          font-weight: 950;
        }

        .dt-blueprint-list {
          display: grid;
          gap: 10px;
          padding: 14px;
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.045);
        }

        .dt-blueprint-row {
          display: grid;
          grid-template-columns: 42px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.062);
        }

        .dt-blueprint-row-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 15px;
          color: #b9f1ff;
          background: rgba(98, 214, 255, 0.14);
          font-weight: 950;
        }

        .dt-blueprint-row strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          line-height: 1;
        }

        .dt-blueprint-row small {
          display: block;
          margin-top: 5px;
          color: rgba(247, 251, 255, 0.52);
          font-size: 12px;
        }

        .dt-blueprint-pill {
          padding: 7px 10px;
          border-radius: 999px;
          color: #b8f7cc;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.2);
          font-size: 12px;
          font-weight: 900;
        }

        .dt-section {
          padding: 72px 0;
          position: relative;
        }

        .dt-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .dt-section-head h2 {
          margin: 0;
          max-width: 720px;
          font-size: clamp(32px, 5vw, 58px);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .dt-section-head p {
          max-width: 420px;
          margin: 0;
          color: var(--dt-muted);
          line-height: 1.65;
          font-size: 15px;
        }

        .dt-build-section {
          padding: 88px 0 96px;
          background:
            radial-gradient(circle at 16% 20%, rgba(98, 214, 255, 0.16), transparent 24rem),
            radial-gradient(circle at 74% 16%, rgba(124, 92, 255, 0.13), transparent 26rem),
            linear-gradient(180deg, rgba(4, 13, 25, 0.3), rgba(4, 13, 25, 0.02));
        }

        .dt-build-shell {
          position: relative;
        }

        .dt-build-shell::before {
          content: "";
          position: absolute;
          inset: -34px -32px -40px;
          border-radius: 42px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
          pointer-events: none;
        }

        .dt-build-head {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr);
          align-items: center;
          gap: clamp(28px, 7vw, 110px);
          margin-bottom: 38px;
        }

        .dt-build-title {
          max-width: 830px;
          margin: 0;
          font-size: clamp(48px, 6.55vw, 84px);
          line-height: 0.91;
          letter-spacing: -0.082em;
          text-wrap: balance;
        }

        .dt-build-accent {
          color: #62d6ff;
          text-shadow:
            0 0 28px rgba(98, 214, 255, 0.24),
            0 0 62px rgba(98, 214, 255, 0.12);
        }

        .dt-build-copy {
          max-width: 540px;
          margin: 0;
          color: rgba(247, 251, 255, 0.86);
          font-size: clamp(18px, 1.72vw, 22px);
          line-height: 1.58;
          letter-spacing: -0.018em;
          text-wrap: balance;
        }

        .dt-build-underline {
          width: 54px;
          height: 4px;
          margin-top: 22px;
          border-radius: 999px;
          background: linear-gradient(90deg, #62d6ff, rgba(98, 214, 255, 0.1));
          box-shadow: 0 0 24px rgba(98, 214, 255, 0.34);
        }

        .dt-eyebrow {
          display: block;
          margin-bottom: 14px;
          color: var(--dt-accent);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .dt-service-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
          isolation: isolate;
        }

        .dt-service-card,
        .dt-work-card,
        .dt-process-card,
        .dt-quote {
          border: 1px solid var(--dt-border);
          background: rgba(255, 255, 255, 0.065);
          box-shadow: 0 16px 60px rgba(0, 0, 0, 0.16);
          backdrop-filter: blur(18px);
        }

        .dt-service-card {
          --card-rgb: 98, 214, 255;
          --card-accent: #62d6ff;
          --card-accent-soft: rgba(98, 214, 255, 0.18);
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 610px;
          padding: 108px 26px 30px;
          border-radius: 30px;
          overflow: hidden;
          border-color: rgba(var(--card-rgb), 0.42);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.125), rgba(255, 255, 255, 0.045) 42%, rgba(255, 255, 255, 0.025)),
            radial-gradient(circle at 50% 0%, rgba(var(--card-rgb), 0.26), transparent 15rem),
            radial-gradient(circle at 92% 14%, rgba(var(--card-rgb), 0.16), transparent 11rem),
            rgba(8, 20, 35, 0.86);
          box-shadow:
            0 30px 88px rgba(0, 0, 0, 0.34),
            0 0 0 1px rgba(var(--card-rgb), 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05);
          transform: translateZ(0);
          transition:
            transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 240ms ease,
            box-shadow 240ms ease,
            background 240ms ease,
            filter 240ms ease;
          will-change: transform;
          cursor: default;
        }

        .dt-card-01 {
          --card-rgb: 50, 166, 255;
          --card-accent: #35c9ff;
          --card-accent-soft: rgba(50, 166, 255, 0.18);
        }

        .dt-card-02 {
          --card-rgb: 166, 102, 255;
          --card-accent: #b16cff;
          --card-accent-soft: rgba(166, 102, 255, 0.18);
        }

        .dt-card-03 {
          --card-rgb: 33, 214, 202;
          --card-accent: #2ee9db;
          --card-accent-soft: rgba(33, 214, 202, 0.17);
        }

        .dt-card-04 {
          --card-rgb: 255, 166, 52;
          --card-accent: #ffad3d;
          --card-accent-soft: rgba(255, 166, 52, 0.17);
        }

        .dt-service-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          width: 46%;
          height: 5px;
          border-radius: 0 0 999px 999px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
          box-shadow:
            0 0 18px rgba(var(--card-rgb), 0.76),
            0 0 42px rgba(var(--card-rgb), 0.46);
          z-index: 3;
          transition: width 240ms ease, opacity 240ms ease, box-shadow 240ms ease;
        }

        .dt-service-card:hover::before,
        .dt-service-card:focus-within::before {
          width: 68%;
          opacity: 1;
          box-shadow:
            0 0 24px rgba(var(--card-rgb), 0.86),
            0 0 64px rgba(var(--card-rgb), 0.58);
        }

        .dt-service-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(var(--card-rgb), 0.18), transparent 30%, transparent 62%, rgba(var(--card-rgb), 0.11)),
            radial-gradient(circle at 50% -18%, rgba(var(--card-rgb), 0.34), transparent 28%);
          opacity: 0.78;
          mix-blend-mode: screen;
          transition: opacity 240ms ease, transform 240ms ease;
        }

        .dt-service-card:hover::after,
        .dt-service-card:focus-within::after {
          opacity: 1;
          transform: scale(1.03);
        }

        .dt-service-card:hover,
        .dt-service-card:focus-within {
          transform: translateY(-10px) scale(1.012);
          border-color: rgba(var(--card-rgb), 0.78);
          filter: saturate(1.1);
          box-shadow:
            0 46px 120px rgba(0, 0, 0, 0.46),
            0 0 0 1px rgba(var(--card-rgb), 0.2),
            0 0 68px rgba(var(--card-rgb), 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(255, 255, 255, 0.06);
        }

        .dt-service-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          right: 22px;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 14px;
          pointer-events: none;
        }

        .dt-service-badge::before {
          content: "SERVICE";
          position: absolute;
          top: 7px;
          left: 78px;
          color: rgba(247, 251, 255, 0.48);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .dt-service-number {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 66px;
          height: 66px;
          flex: 0 0 66px;
          border-radius: 22px;
          color: #f7fbff;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.04)),
            linear-gradient(145deg, rgba(var(--card-rgb), 0.92), rgba(var(--card-rgb), 0.26));
          border: 1px solid rgba(var(--card-rgb), 0.62);
          box-shadow:
            0 18px 50px rgba(var(--card-rgb), 0.28),
            0 0 0 6px rgba(var(--card-rgb), 0.085),
            inset 0 1px 0 rgba(255, 255, 255, 0.32),
            inset 0 -14px 26px rgba(0, 0, 0, 0.16);
          font-weight: 1000;
          font-size: 22px;
          letter-spacing: -0.06em;
          text-shadow: 0 8px 18px rgba(0, 0, 0, 0.34);
        }

        .dt-service-number::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 28px;
          border: 1px solid rgba(var(--card-rgb), 0.18);
          background: linear-gradient(145deg, rgba(var(--card-rgb), 0.1), transparent 52%);
          z-index: -1;
        }

        .dt-service-number::after {
          content: "";
          position: absolute;
          top: 12px;
          left: 12px;
          width: 18px;
          height: 2px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          filter: blur(0.2px);
          transform: rotate(-28deg);
        }

        .dt-service-badge-line {
          position: relative;
          flex: 1;
          height: 1px;
          min-width: 72px;
          margin-top: 32px;
          background: linear-gradient(90deg, rgba(var(--card-rgb), 0.78), rgba(var(--card-rgb), 0.18), transparent);
          box-shadow: 0 0 18px rgba(var(--card-rgb), 0.2);
        }

        .dt-service-badge-line::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          transform: translateY(-50%);
          background: var(--card-accent);
          box-shadow: 0 0 18px rgba(var(--card-rgb), 0.72);
        }

        .dt-service-number,
        .dt-service-badge-line,
        .dt-service-badge::before {
          transition: transform 240ms ease, opacity 240ms ease, box-shadow 240ms ease, color 240ms ease;
        }

        .dt-service-card:hover .dt-service-number,
        .dt-service-card:focus-within .dt-service-number {
          transform: translateY(-2px) rotate(-2deg);
          box-shadow:
            0 22px 62px rgba(var(--card-rgb), 0.36),
            0 0 0 7px rgba(var(--card-rgb), 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.38),
            inset 0 -14px 26px rgba(0, 0, 0, 0.16);
        }

        .dt-service-card:hover .dt-service-badge-line,
        .dt-service-card:focus-within .dt-service-badge-line {
          transform: scaleX(1.08);
          transform-origin: left center;
        }

        .dt-service-card:hover .dt-service-badge::before,
        .dt-service-card:focus-within .dt-service-badge::before {
          color: rgba(247, 251, 255, 0.68);
        }

        .dt-service-card h3,
        .dt-work-card h3,
        .dt-process-card h3 {
          margin: 36px 0 14px;
          font-size: 25px;
          line-height: 1.07;
          letter-spacing: -0.047em;
        }

        .dt-service-card h3 {
          position: relative;
          z-index: 4;
          max-width: 265px;
          margin-top: 0;
          margin-bottom: 18px;
          font-size: clamp(28px, 2.25vw, 35px);
          line-height: 0.98;
          letter-spacing: -0.065em;
          text-wrap: balance;
          text-shadow:
            0 18px 34px rgba(0, 0, 0, 0.32),
            0 0 28px rgba(var(--card-rgb), 0.08);
          transition: color 220ms ease, text-shadow 220ms ease, transform 220ms ease;
        }

        .dt-service-card:hover h3,
        .dt-service-card:focus-within h3 {
          color: #ffffff;
          transform: translateY(-2px);
          text-shadow:
            0 20px 40px rgba(0, 0, 0, 0.36),
            0 0 34px rgba(var(--card-rgb), 0.18);
        }

        .dt-service-card h3::after {
          content: "";
          display: block;
          width: 42px;
          height: 4px;
          margin-top: 16px;
          border-radius: 999px;
          background: var(--card-accent);
          box-shadow: 0 0 20px rgba(var(--card-rgb), 0.56);
          transition: width 220ms ease, box-shadow 220ms ease;
        }

        .dt-service-card:hover h3::after,
        .dt-service-card:focus-within h3::after {
          width: 68px;
          box-shadow: 0 0 28px rgba(var(--card-rgb), 0.72);
        }

        .dt-service-card p,
        .dt-work-card p,
        .dt-process-card p {
          margin: 0;
          color: var(--dt-muted);
          line-height: 1.65;
          font-size: 15px;
        }

        .dt-service-card p {
          position: relative;
          z-index: 4;
          max-width: 265px;
          color: rgba(247, 251, 255, 0.84);
          font-size: clamp(15.5px, 1.07vw, 17px);
          line-height: 1.54;
          letter-spacing: -0.012em;
          transition: color 220ms ease, transform 220ms ease;
        }

        .dt-service-card:hover p,
        .dt-service-card:focus-within p {
          color: rgba(247, 251, 255, 0.9);
          transform: translateY(-1px);
        }

        .dt-service-chip-row {
          position: relative;
          z-index: 4;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: auto;
          padding-top: 26px;
        }

        .dt-service-chip {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 8px 11px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.88);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.055)),
            rgba(var(--card-rgb), 0.105);
          border: 1px solid rgba(var(--card-rgb), 0.28);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 10px 24px rgba(0, 0, 0, 0.14);
          font-size: 12px;
          font-weight: 850;
          line-height: 1;
          letter-spacing: -0.01em;
          white-space: nowrap;
          transition:
            transform 210ms ease,
            border-color 210ms ease,
            background 210ms ease,
            box-shadow 210ms ease;
        }

        .dt-service-chip::before {
          content: "";
          width: 6px;
          height: 6px;
          margin-right: 7px;
          border-radius: 999px;
          background: var(--card-accent);
          box-shadow: 0 0 12px rgba(var(--card-rgb), 0.7);
        }

        .dt-service-card:hover .dt-service-chip,
        .dt-service-card:focus-within .dt-service-chip {
          transform: translateY(-2px);
          border-color: rgba(var(--card-rgb), 0.44);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.145), rgba(255, 255, 255, 0.065)),
            rgba(var(--card-rgb), 0.13);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            0 14px 32px rgba(0, 0, 0, 0.18),
            0 0 20px rgba(var(--card-rgb), 0.08);
        }

        .dt-service-card:hover .dt-service-chip:nth-child(2),
        .dt-service-card:focus-within .dt-service-chip:nth-child(2) {
          transition-delay: 25ms;
        }

        .dt-service-card:hover .dt-service-chip:nth-child(3),
        .dt-service-card:focus-within .dt-service-chip:nth-child(3) {
          transition-delay: 50ms;
        }

        .dt-service-card:hover .dt-service-chip:nth-child(4),
        .dt-service-card:focus-within .dt-service-chip:nth-child(4) {
          transition-delay: 75ms;
        }

        .dt-service-card:hover .dt-service-chip:nth-child(5),
        .dt-service-card:focus-within .dt-service-chip:nth-child(5) {
          transition-delay: 100ms;
        }

        .dt-service-visual {
          position: relative;
          z-index: 4;
          height: 176px;
          margin: -4px 0 28px;
          border-radius: 25px;
          overflow: hidden;
          border: 1px solid rgba(var(--card-rgb), 0.24);
          background:
            radial-gradient(circle at 72% 18%, rgba(var(--card-rgb), 0.32), transparent 7.6rem),
            radial-gradient(circle at 20% 85%, rgba(255, 255, 255, 0.08), transparent 8rem),
            linear-gradient(145deg, rgba(var(--card-rgb), 0.16), rgba(255, 255, 255, 0.045));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05),
            0 18px 48px rgba(var(--card-rgb), 0.13);
          transition:
            transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 240ms ease,
            box-shadow 240ms ease,
            background 240ms ease;
        }

        .dt-service-card:hover .dt-service-visual,
        .dt-service-card:focus-within .dt-service-visual {
          transform: translateY(-4px);
          border-color: rgba(var(--card-rgb), 0.42);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(255, 255, 255, 0.07),
            0 24px 62px rgba(var(--card-rgb), 0.2);
        }

        .dt-service-visual::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 21px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(circle at 55% 45%, black, transparent 78%);
          opacity: 0.62;
        }

        .dt-service-visual::after {
          content: "";
          position: absolute;
          top: 16px;
          left: 18px;
          width: 46px;
          height: 4px;
          border-radius: 999px;
          background: var(--card-accent);
          box-shadow: 0 0 22px rgba(var(--card-rgb), 0.66);
          opacity: 0.88;
          transition: width 230ms ease, box-shadow 230ms ease;
        }

        .dt-service-card:hover .dt-service-visual::after,
        .dt-service-card:focus-within .dt-service-visual::after {
          width: 74px;
          box-shadow: 0 0 30px rgba(var(--card-rgb), 0.84);
        }

        .dt-phone-device,
        .dt-laptop-base,
        .dt-storefront,
        .dt-market-cart,
        .dt-rocket,
        .dt-plan-card,
        .dt-idea-dot,
        .dt-floating-metric,
        .dt-visual-bubble,
        .dt-user-node {
          transition:
            transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 240ms ease,
            opacity 240ms ease;
        }

        .dt-service-card:hover .dt-phone-device,
        .dt-service-card:focus-within .dt-phone-device {
          transform: translateX(-50%) translateY(-5px) rotate(-3deg);
          box-shadow:
            0 30px 72px rgba(0, 0, 0, 0.32),
            0 0 42px rgba(var(--card-rgb), 0.34);
        }

        .dt-service-card:hover .dt-visual-bubble,
        .dt-service-card:focus-within .dt-visual-bubble,
        .dt-service-card:hover .dt-user-node,
        .dt-service-card:focus-within .dt-user-node {
          transform: translateY(-4px);
        }

        .dt-service-card:hover .dt-laptop-base,
        .dt-service-card:focus-within .dt-laptop-base {
          transform: translateY(-5px) scale(1.015);
        }

        .dt-service-card:hover .dt-floating-metric,
        .dt-service-card:focus-within .dt-floating-metric {
          transform: translateY(-7px) rotate(2deg);
        }

        .dt-service-card:hover .dt-storefront,
        .dt-service-card:focus-within .dt-storefront {
          transform: translateY(-6px);
        }

        .dt-service-card:hover .dt-market-cart,
        .dt-service-card:focus-within .dt-market-cart {
          transform: translate(4px, -5px);
        }

        .dt-service-card:hover .dt-rocket,
        .dt-service-card:focus-within .dt-rocket {
          transform: translateX(-50%) translateY(-10px) rotate(7deg);
        }

        .dt-service-card:hover .dt-plan-card,
        .dt-service-card:focus-within .dt-plan-card {
          transform: translateY(-5px) rotate(-2deg);
        }

        .dt-service-card:hover .dt-idea-dot,
        .dt-service-card:focus-within .dt-idea-dot {
          transform: translateY(-5px) rotate(6deg);
        }

        .dt-phone-device {
          position: absolute;
          left: 50%;
          top: 18px;
          width: 88px;
          height: 140px;
          border-radius: 22px;
          transform: translateX(-50%) rotate(-7deg);
          border: 1px solid rgba(255, 255, 255, 0.24);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.035)),
            rgba(4, 12, 23, 0.82);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.28),
            0 0 34px rgba(var(--card-rgb), 0.22);
        }

        .dt-phone-speaker {
          position: absolute;
          top: 10px;
          left: 50%;
          width: 26px;
          height: 4px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.34);
        }

        .dt-phone-screen-grid {
          position: absolute;
          inset: 28px 13px auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 7px;
        }

        .dt-phone-screen-grid span {
          height: 28px;
          border-radius: 9px;
          background: linear-gradient(145deg, rgba(var(--card-rgb), 0.8), rgba(255, 255, 255, 0.12));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
        }

        .dt-phone-bottom-card {
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 16px;
          height: 28px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .dt-phone-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          border: 1px solid rgba(var(--card-rgb), 0.42);
          transform: translate(-50%, -50%) rotate(-18deg);
          box-shadow: 0 0 28px rgba(var(--card-rgb), 0.16);
        }

        .dt-orbit-one {
          width: 168px;
          height: 86px;
        }

        .dt-orbit-two {
          width: 118px;
          height: 54px;
          transform: translate(-50%, -50%) rotate(22deg);
          opacity: 0.76;
        }

        .dt-visual-bubble {
          position: absolute;
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.12);
          color: #f7fbff;
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.2);
        }

        .dt-bubble-ios {
          right: 30px;
          top: 34px;
        }

        .dt-bubble-android {
          left: 30px;
          bottom: 28px;
        }

        .dt-laptop-base {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 23px;
          height: 112px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(5, 12, 24, 0.76);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
        }

        .dt-laptop-topbar {
          display: flex;
          gap: 5px;
          height: 22px;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.09);
        }

        .dt-laptop-topbar span {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.42);
        }

        .dt-dashboard-layout {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 10px;
          height: calc(100% - 22px);
          padding: 10px;
        }

        .dt-dashboard-sidebar {
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(var(--card-rgb), 0.38), rgba(255, 255, 255, 0.07));
        }

        .dt-dashboard-main {
          position: relative;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.07);
          overflow: hidden;
        }

        .dt-chart-bars {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          display: flex;
          align-items: end;
          gap: 8px;
          height: 52px;
        }

        .dt-chart-bars span {
          flex: 1;
          border-radius: 7px 7px 3px 3px;
          background: linear-gradient(180deg, rgba(var(--card-rgb), 0.92), rgba(var(--card-rgb), 0.22));
        }

        .dt-chart-bars span:nth-child(1) { height: 36%; }
        .dt-chart-bars span:nth-child(2) { height: 76%; }
        .dt-chart-bars span:nth-child(3) { height: 54%; }
        .dt-chart-bars span:nth-child(4) { height: 90%; }

        .dt-chart-line {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 18px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.22), var(--card-accent), rgba(255, 255, 255, 0.16));
          box-shadow: 0 0 18px rgba(var(--card-rgb), 0.5);
          transform: rotate(-5deg);
        }

        .dt-floating-metric {
          position: absolute;
          top: 28px;
          right: 26px;
          display: grid;
          place-items: center;
          width: 74px;
          height: 74px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 52px rgba(0, 0, 0, 0.24);
        }

        .dt-floating-metric strong {
          display: block;
          font-size: 21px;
          line-height: 1;
        }

        .dt-floating-metric span {
          margin-top: 4px;
          color: rgba(247, 251, 255, 0.58);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .dt-market-platform {
          position: absolute;
          left: 34px;
          right: 34px;
          bottom: 24px;
          height: 26px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(var(--card-rgb), 0.14), rgba(var(--card-rgb), 0.55), rgba(var(--card-rgb), 0.14));
          filter: blur(0.2px);
          box-shadow: 0 0 34px rgba(var(--card-rgb), 0.22);
        }

        .dt-storefront {
          position: absolute;
          left: 62px;
          bottom: 44px;
          width: 112px;
          height: 82px;
          border-radius: 18px 18px 14px 14px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(5, 12, 24, 0.76);
          box-shadow: 0 22px 58px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }

        .dt-store-awning {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          height: 26px;
          overflow: hidden;
        }

        .dt-store-awning span {
          background: rgba(var(--card-rgb), 0.72);
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        .dt-store-awning span:nth-child(2) {
          background: rgba(255, 255, 255, 0.16);
        }

        .dt-store-window {
          position: absolute;
          left: 14px;
          bottom: 14px;
          width: 38px;
          height: 30px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.12);
        }

        .dt-store-door {
          position: absolute;
          right: 16px;
          bottom: 0;
          width: 28px;
          height: 44px;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(180deg, rgba(var(--card-rgb), 0.44), rgba(255, 255, 255, 0.06));
        }

        .dt-market-cart {
          position: absolute;
          right: 44px;
          bottom: 46px;
          width: 58px;
          height: 52px;
        }

        .dt-cart-basket {
          width: 46px;
          height: 28px;
          transform: skewX(-12deg);
          border-radius: 7px;
          border: 2px solid rgba(247, 251, 255, 0.76);
          border-top: 0;
          box-shadow: 0 0 20px rgba(var(--card-rgb), 0.2);
        }

        .dt-market-cart span {
          position: absolute;
          bottom: 3px;
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--card-accent);
          box-shadow: 0 0 14px rgba(var(--card-rgb), 0.6);
        }

        .dt-market-cart span:nth-of-type(1) { left: 10px; }
        .dt-market-cart span:nth-of-type(2) { left: 36px; }

        .dt-user-node {
          position: absolute;
          width: 34px;
          height: 34px;
          border-radius: 14px;
          background:
            radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.9) 0 5px, transparent 6px),
            radial-gradient(circle at 50% 96%, rgba(255, 255, 255, 0.66) 0 12px, transparent 13px),
            rgba(var(--card-rgb), 0.28);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
        }

        .dt-node-one {
          top: 34px;
          right: 46px;
        }

        .dt-node-two {
          left: 34px;
          top: 48px;
          opacity: 0.82;
        }

        .dt-launch-rings {
          position: absolute;
          left: 50%;
          bottom: 26px;
          width: 132px;
          height: 48px;
          transform: translateX(-50%);
          border-radius: 50%;
          border: 1px solid rgba(var(--card-rgb), 0.38);
          box-shadow: 0 0 38px rgba(var(--card-rgb), 0.22);
        }

        .dt-launch-rings span {
          position: absolute;
          inset: 9px 18px;
          border-radius: 50%;
          border: 1px solid rgba(var(--card-rgb), 0.34);
        }

        .dt-launch-rings span:nth-child(2) {
          inset: 18px 40px;
        }

        .dt-rocket {
          position: absolute;
          left: 50%;
          top: 35px;
          width: 46px;
          height: 88px;
          transform: translateX(-50%) rotate(12deg);
          border-radius: 50% 50% 16px 16px;
          background:
            radial-gradient(circle at 50% 28%, rgba(255, 255, 255, 0.9) 0 8px, transparent 9px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(var(--card-rgb), 0.44));
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 20px 58px rgba(0, 0, 0, 0.26), 0 0 32px rgba(var(--card-rgb), 0.24);
        }

        .dt-rocket::before,
        .dt-rocket::after {
          content: "";
          position: absolute;
          bottom: 8px;
          width: 18px;
          height: 30px;
          border-radius: 12px 12px 6px 6px;
          background: rgba(var(--card-rgb), 0.42);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .dt-rocket::before {
          left: -12px;
          transform: rotate(-20deg);
        }

        .dt-rocket::after {
          right: -12px;
          transform: rotate(20deg);
        }

        .dt-rocket-window {
          position: absolute;
          left: 50%;
          top: 23px;
          width: 15px;
          height: 15px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(8, 20, 35, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.28);
        }

        .dt-rocket-flame {
          position: absolute;
          left: 50%;
          bottom: -22px;
          width: 24px;
          height: 34px;
          transform: translateX(-50%);
          border-radius: 999px 999px 999px 999px;
          background: linear-gradient(180deg, #ffffff, var(--card-accent), rgba(var(--card-rgb), 0.12));
          filter: blur(0.2px);
          box-shadow: 0 0 26px rgba(var(--card-rgb), 0.62);
        }

        .dt-plan-card {
          position: absolute;
          right: 23px;
          top: 34px;
          width: 58px;
          height: 70px;
          padding: 13px 10px;
          border-radius: 17px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.11);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);
        }

        .dt-plan-card span {
          display: block;
          height: 6px;
          margin-bottom: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.62);
        }

        .dt-plan-card span:nth-child(2) {
          width: 70%;
          background: rgba(var(--card-rgb), 0.76);
        }

        .dt-plan-card span:nth-child(3) {
          width: 48%;
        }

        .dt-idea-dot {
          position: absolute;
          left: 26px;
          top: 38px;
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 16px;
          color: #fff6df;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 0 32px rgba(var(--card-rgb), 0.24);
          font-size: 22px;
        }

        .dt-service-link {
          position: relative;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          width: fit-content;
          margin-top: 22px;
          color: #f7fbff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: -0.01em;
          opacity: 0.82;
          transition: opacity 220ms ease, transform 220ms ease, color 220ms ease;
        }

        .dt-service-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -7px;
          height: 1px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--card-accent), transparent);
          transform: scaleX(0.5);
          transform-origin: left center;
          opacity: 0.72;
          transition: transform 220ms ease, opacity 220ms ease;
        }

        .dt-service-link span {
          display: inline-block;
          transition: transform 220ms ease;
        }

        .dt-service-card:hover .dt-service-link,
        .dt-service-card:focus-within .dt-service-link {
          opacity: 1;
          color: var(--card-accent);
          transform: translateY(-1px);
        }

        .dt-service-card:hover .dt-service-link span,
        .dt-service-card:focus-within .dt-service-link span {
          transform: translateX(4px);
        }

        .dt-service-card:hover .dt-service-link::after,
        .dt-service-card:focus-within .dt-service-link::after {
          transform: scaleX(1);
          opacity: 1;
        }

        .dt-work-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .dt-work-card {
          --work-rgb: 98, 214, 255;
          --work-accent: #62d6ff;
          position: relative;
          overflow: hidden;
          min-height: 360px;
          padding: 28px;
          border-radius: 34px;
          border-color: rgba(var(--work-rgb), 0.26);
          background:
            radial-gradient(circle at 86% 0%, rgba(var(--work-rgb), 0.22), transparent 13rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.045) 52%, rgba(255, 255, 255, 0.025)),
            rgba(8, 20, 35, 0.82);
          box-shadow:
            0 28px 90px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition:
            transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 240ms ease,
            box-shadow 240ms ease,
            background 240ms ease;
        }

        .dt-work-card:nth-child(2) {
          --work-rgb: 166, 102, 255;
          --work-accent: #b16cff;
        }

        .dt-work-card:nth-child(3) {
          --work-rgb: 255, 185, 75;
          --work-accent: #ffbf55;
        }

        .dt-work-card:nth-child(4) {
          --work-rgb: 33, 214, 202;
          --work-accent: #2ee9db;
        }

        .dt-work-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 34px;
          width: 126px;
          height: 4px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--work-accent), transparent);
          box-shadow:
            0 0 22px rgba(var(--work-rgb), 0.72),
            0 0 48px rgba(var(--work-rgb), 0.34);
          transition: width 240ms ease, box-shadow 240ms ease;
        }

        .dt-work-card::after {
          content: "";
          position: absolute;
          inset: auto -80px -110px auto;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(var(--work-rgb), 0.24), transparent 66%);
          filter: blur(8px);
          opacity: 0.78;
          pointer-events: none;
          transition: opacity 240ms ease, transform 240ms ease;
        }

        .dt-work-card:hover {
          transform: translateY(-8px);
          border-color: rgba(var(--work-rgb), 0.48);
          box-shadow:
            0 38px 110px rgba(0, 0, 0, 0.38),
            0 0 52px rgba(var(--work-rgb), 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
        }

        .dt-work-card:hover::before {
          width: 190px;
          box-shadow:
            0 0 26px rgba(var(--work-rgb), 0.82),
            0 0 62px rgba(var(--work-rgb), 0.42);
        }

        .dt-work-card:hover::after {
          opacity: 1;
          transform: scale(1.08);
        }

        .dt-work-content {
          position: relative;
          z-index: 3;
          max-width: 620px;
        }

        .dt-work-topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
        }

        .dt-work-type {
          color: rgba(247, 251, 255, 0.54);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .dt-work-metric {
          display: grid;
          place-items: center;
          min-width: 86px;
          min-height: 66px;
          padding: 10px 13px;
          border-radius: 22px;
          border: 1px solid rgba(var(--work-rgb), 0.3);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.055)),
            rgba(var(--work-rgb), 0.12);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.13),
            0 16px 42px rgba(0, 0, 0, 0.18);
          text-align: center;
        }

        .dt-work-metric strong {
          display: block;
          color: #ffffff;
          font-size: 18px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .dt-work-metric span {
          display: block;
          margin-top: 6px;
          color: rgba(247, 251, 255, 0.54);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dt-project-visual {
          position: relative;
          z-index: 3;
          height: 132px;
          margin: 0 0 22px;
          border-radius: 25px;
          overflow: hidden;
          border: 1px solid rgba(var(--work-rgb), 0.2);
          background:
            radial-gradient(circle at 80% 25%, rgba(var(--work-rgb), 0.28), transparent 8rem),
            linear-gradient(145deg, rgba(var(--work-rgb), 0.13), rgba(255, 255, 255, 0.04));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .dt-project-visual::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 20px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 26px 26px;
          opacity: 0.55;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent 80%);
        }

        .dt-project-phone {
          position: absolute;
          left: 32px;
          top: 20px;
          width: 66px;
          height: 94px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(5, 12, 24, 0.74);
          transform: rotate(-6deg);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
        }

        .dt-project-phone span {
          position: absolute;
          left: 13px;
          right: 13px;
          height: 10px;
          border-radius: 999px;
          background: rgba(var(--work-rgb), 0.5);
        }

        .dt-project-phone span:nth-child(1) { top: 22px; }
        .dt-project-phone span:nth-child(2) { top: 42px; right: 24px; }
        .dt-project-phone span:nth-child(3) { top: 64px; }

        .dt-project-route {
          position: absolute;
          left: 120px;
          right: 34px;
          top: 56px;
          height: 2px;
          background: linear-gradient(90deg, rgba(var(--work-rgb), 0.18), var(--work-accent), rgba(var(--work-rgb), 0.12));
          box-shadow: 0 0 18px rgba(var(--work-rgb), 0.4);
        }

        .dt-project-route i {
          position: absolute;
          top: 50%;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          transform: translateY(-50%);
          background: var(--work-accent);
          box-shadow: 0 0 18px rgba(var(--work-rgb), 0.68);
        }

        .dt-project-route i:nth-child(1) { left: 0; }
        .dt-project-route i:nth-child(2) { left: 46%; }
        .dt-project-route i:nth-child(3) { right: 0; }

        .dt-project-box {
          position: absolute;
          width: 36px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(145deg, rgba(var(--work-rgb), 0.74), rgba(255, 255, 255, 0.14));
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.18);
        }

        .dt-project-box-one { right: 74px; bottom: 26px; }
        .dt-project-box-two { right: 34px; bottom: 44px; opacity: 0.72; }

        .dt-quote-stack {
          position: absolute;
          left: 34px;
          top: 26px;
          display: grid;
          gap: 10px;
          width: 170px;
        }

        .dt-quote-stack span {
          height: 26px;
          border-radius: 11px;
          background:
            linear-gradient(90deg, rgba(var(--work-rgb), 0.44), rgba(255, 255, 255, 0.08)),
            rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .dt-quote-stack span:nth-child(2) { width: 82%; }
        .dt-quote-stack span:nth-child(3) { width: 62%; }

        .dt-bid-bubble {
          position: absolute;
          display: grid;
          place-items: center;
          width: 50px;
          height: 50px;
          border-radius: 18px;
          color: #fff;
          background: rgba(var(--work-rgb), 0.28);
          border: 1px solid rgba(var(--work-rgb), 0.28);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
          font-size: 21px;
          font-weight: 950;
        }

        .dt-bid-one { right: 82px; top: 24px; }
        .dt-bid-two { right: 34px; bottom: 24px; }

        .dt-qr-card {
          position: absolute;
          left: 38px;
          top: 22px;
          width: 82px;
          height: 82px;
          padding: 14px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          border-radius: 22px;
          background: rgba(5, 12, 24, 0.74);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
        }

        .dt-qr-card span {
          border-radius: 7px;
          background: var(--work-accent);
          box-shadow: 0 0 14px rgba(var(--work-rgb), 0.42);
        }

        .dt-table-dot {
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: rgba(var(--work-rgb), 0.38);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .dt-table-one { left: 145px; top: 35px; }
        .dt-table-two { left: 190px; bottom: 28px; opacity: 0.7; }

        .dt-order-ticket {
          position: absolute;
          right: 34px;
          top: 30px;
          width: 94px;
          height: 72px;
          padding: 15px 13px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .dt-order-ticket i {
          display: block;
          height: 7px;
          margin-bottom: 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.58);
        }

        .dt-order-ticket i:nth-child(2) {
          width: 70%;
          background: rgba(var(--work-rgb), 0.76);
        }

        .dt-order-ticket i:nth-child(3) { width: 48%; }

        .dt-ops-panel {
          position: absolute;
          left: 34px;
          top: 24px;
          width: 160px;
          height: 84px;
          padding: 16px;
          border-radius: 22px;
          background: rgba(5, 12, 24, 0.74);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
        }

        .dt-ops-panel span {
          display: block;
          height: 9px;
          margin-bottom: 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.58);
        }

        .dt-ops-panel span:nth-child(2) {
          width: 74%;
          background: rgba(var(--work-rgb), 0.72);
        }

        .dt-ops-panel span:nth-child(3) { width: 54%; }

        .dt-ops-chart {
          position: absolute;
          right: 38px;
          bottom: 24px;
          display: flex;
          align-items: end;
          gap: 8px;
          height: 80px;
        }

        .dt-ops-chart i {
          width: 22px;
          border-radius: 9px 9px 3px 3px;
          background: linear-gradient(180deg, rgba(var(--work-rgb), 0.9), rgba(var(--work-rgb), 0.18));
          box-shadow: 0 0 18px rgba(var(--work-rgb), 0.22);
        }

        .dt-ops-chart i:nth-child(1) { height: 48px; }
        .dt-ops-chart i:nth-child(2) { height: 72px; }
        .dt-ops-chart i:nth-child(3) { height: 38px; }

        .dt-work-card h3 {
          position: relative;
          z-index: 3;
          margin: 0 0 14px;
          font-size: clamp(28px, 3.1vw, 42px);
          line-height: 0.98;
          letter-spacing: -0.065em;
        }

        .dt-work-card p {
          position: relative;
          z-index: 3;
          max-width: 660px;
          color: rgba(247, 251, 255, 0.78);
          font-size: 16px;
          line-height: 1.62;
        }

        .dt-tag-row {
          position: relative;
          z-index: 3;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 24px;
        }

        .dt-tag {
          padding: 9px 11px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.82);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.055)),
            rgba(var(--work-rgb), 0.08);
          border: 1px solid rgba(var(--work-rgb), 0.2);
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .dt-proof {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 22px;
          align-items: stretch;
        }

        .dt-proof-card {
          position: relative;
          overflow: hidden;
          min-height: 520px;
          padding: 34px;
          border-radius: 36px;
          border: 1px solid rgba(98, 214, 255, 0.28);
          background:
            radial-gradient(circle at 20% 10%, rgba(98, 214, 255, 0.22), transparent 18rem),
            radial-gradient(circle at 82% 72%, rgba(124, 92, 255, 0.18), transparent 18rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.045)),
            rgba(8, 20, 35, 0.82);
          box-shadow:
            0 34px 100px rgba(0, 0, 0, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .dt-proof-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 34px;
          width: 140px;
          height: 4px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, #62d6ff, transparent);
          box-shadow: 0 0 30px rgba(98, 214, 255, 0.72);
        }

        .dt-proof-card::after {
          content: "";
          position: absolute;
          right: -90px;
          bottom: -100px;
          width: 280px;
          height: 280px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(98, 214, 255, 0.2), transparent 66%);
          filter: blur(8px);
        }

        .dt-proof-content {
          position: relative;
          z-index: 3;
        }

        .dt-proof-card h2 {
          margin: 0;
          max-width: 620px;
          font-size: clamp(36px, 4.6vw, 64px);
          line-height: 0.96;
          letter-spacing: -0.072em;
          text-wrap: balance;
        }

        .dt-proof-card p {
          max-width: 570px;
          margin: 20px 0 0;
          color: rgba(247, 251, 255, 0.78);
          font-size: 16px;
          line-height: 1.72;
        }

        .dt-proof-system {
          position: relative;
          z-index: 3;
          min-height: 188px;
          margin-top: 34px;
          border-radius: 28px;
          border: 1px solid rgba(98, 214, 255, 0.18);
          background:
            radial-gradient(circle at 50% 50%, rgba(98, 214, 255, 0.18), transparent 11rem),
            rgba(255, 255, 255, 0.045);
          overflow: hidden;
        }

        .dt-proof-system::before {
          content: "";
          position: absolute;
          inset: 16px;
          border-radius: 24px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.54;
          mask-image: radial-gradient(circle, black, transparent 82%);
        }

        .dt-system-core {
          position: absolute;
          left: 50%;
          top: 50%;
          display: grid;
          place-items: center;
          width: 108px;
          height: 108px;
          border-radius: 34px;
          transform: translate(-50%, -50%);
          color: #06101d;
          background: linear-gradient(135deg, #ffffff, #9be9ff 55%, #bdb2ff);
          box-shadow:
            0 24px 70px rgba(98, 214, 255, 0.26),
            0 0 0 10px rgba(98, 214, 255, 0.08);
          font-size: 16px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .dt-system-node {
          position: absolute;
          display: grid;
          place-items: center;
          width: 62px;
          height: 62px;
          border-radius: 22px;
          color: rgba(247, 251, 255, 0.9);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.22);
          font-weight: 950;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .dt-system-node-one { left: 28px; top: 30px; }
        .dt-system-node-two { right: 30px; top: 30px; }
        .dt-system-node-three { left: 30px; bottom: 28px; }
        .dt-system-node-four { right: 28px; bottom: 28px; }

        .dt-system-line {
          position: absolute;
          left: 86px;
          right: 86px;
          top: 50%;
          height: 1px;
          transform: translateY(-50%);
          background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.55), transparent);
          box-shadow: 0 0 20px rgba(98, 214, 255, 0.34);
        }

        .dt-system-line-vertical {
          position: absolute;
          top: 48px;
          bottom: 48px;
          left: 50%;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(124, 92, 255, 0.54), transparent);
          box-shadow: 0 0 20px rgba(124, 92, 255, 0.28);
        }

        .dt-proof-mini-row {
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .dt-proof-mini {
          min-height: 78px;
          padding: 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.055);
        }

        .dt-proof-mini strong {
          display: block;
          color: #ffffff;
          font-size: 18px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .dt-proof-mini span {
          display: block;
          margin-top: 7px;
          color: rgba(247, 251, 255, 0.52);
          font-size: 11px;
          line-height: 1.32;
          text-transform: uppercase;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .dt-capability-panel {
          position: relative;
          overflow: hidden;
          padding: 26px;
          border-radius: 36px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            radial-gradient(circle at 92% 10%, rgba(98, 214, 255, 0.16), transparent 16rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.035)),
            rgba(8, 20, 35, 0.72);
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .dt-capability-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: linear-gradient(to bottom, black, transparent 78%);
          opacity: 0.52;
        }

        .dt-capability-head {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .dt-capability-head h3 {
          max-width: 520px;
          margin: 0;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 0.98;
          letter-spacing: -0.062em;
        }

        .dt-capability-head p {
          max-width: 330px;
          margin: 0;
          color: rgba(247, 251, 255, 0.58);
          font-size: 14px;
          line-height: 1.55;
        }

        .dt-capability-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .dt-capability-card {
          --cap-rgb: 98, 214, 255;
          --cap-accent: #62d6ff;
          position: relative;
          overflow: hidden;
          min-height: 198px;
          padding: 20px;
          border-radius: 26px;
          border: 1px solid rgba(var(--cap-rgb), 0.22);
          background:
            radial-gradient(circle at 88% 10%, rgba(var(--cap-rgb), 0.18), transparent 10rem),
            rgba(255, 255, 255, 0.055);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 18px 48px rgba(0, 0, 0, 0.16);
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .dt-capability-card:nth-child(2) {
          --cap-rgb: 166, 102, 255;
          --cap-accent: #b16cff;
        }

        .dt-capability-card:nth-child(3) {
          --cap-rgb: 33, 214, 202;
          --cap-accent: #2ee9db;
        }

        .dt-capability-card:nth-child(4) {
          --cap-rgb: 255, 185, 75;
          --cap-accent: #ffbf55;
        }

        .dt-capability-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 20px;
          width: 74px;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--cap-accent), transparent);
          box-shadow: 0 0 18px rgba(var(--cap-rgb), 0.58);
        }

        .dt-capability-card:hover {
          transform: translateY(-5px);
          border-color: rgba(var(--cap-rgb), 0.42);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.13),
            0 24px 66px rgba(0, 0, 0, 0.22),
            0 0 34px rgba(var(--cap-rgb), 0.12);
        }

        .dt-capability-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 17px;
          color: #ffffff;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.04)),
            rgba(var(--cap-rgb), 0.2);
          border: 1px solid rgba(var(--cap-rgb), 0.28);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.18);
          font-size: 18px;
          font-weight: 950;
        }

        .dt-capability-card h4 {
          margin: 18px 0 9px;
          color: #ffffff;
          font-size: 21px;
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .dt-capability-card p {
          margin: 0;
          color: rgba(247, 251, 255, 0.66);
          font-size: 13.5px;
          line-height: 1.52;
        }

        .dt-capability-items {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 17px;
        }

        .dt-capability-item {
          padding: 7px 9px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.82);
          background: rgba(255, 255, 255, 0.075);
          border: 1px solid rgba(var(--cap-rgb), 0.18);
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
        }

        .dt-process-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          isolation: isolate;
        }

        .dt-process-grid::before {
          content: "";
          position: absolute;
          left: 9%;
          right: 9%;
          top: 74px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.42), rgba(124, 92, 255, 0.38), transparent);
          box-shadow: 0 0 28px rgba(98, 214, 255, 0.18);
          z-index: 0;
        }

        .dt-process-card {
          --process-rgb: 124, 92, 255;
          --process-accent: #9b87ff;
          position: relative;
          z-index: 1;
          overflow: hidden;
          min-height: 430px;
          padding: 24px;
          border-radius: 30px;
          border-color: rgba(var(--process-rgb), 0.3);
          background:
            radial-gradient(circle at 72% 0%, rgba(var(--process-rgb), 0.22), transparent 13rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.04)),
            rgba(8, 20, 35, 0.82);
          box-shadow:
            0 28px 84px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition:
            transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 240ms ease,
            box-shadow 240ms ease;
        }

        .dt-process-card:nth-child(1) {
          --process-rgb: 98, 214, 255;
          --process-accent: #62d6ff;
        }

        .dt-process-card:nth-child(2) {
          --process-rgb: 166, 102, 255;
          --process-accent: #b16cff;
        }

        .dt-process-card:nth-child(3) {
          --process-rgb: 33, 214, 202;
          --process-accent: #2ee9db;
        }

        .dt-process-card:nth-child(4) {
          --process-rgb: 255, 185, 75;
          --process-accent: #ffbf55;
        }

        .dt-process-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 24px;
          width: 88px;
          height: 4px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--process-accent), transparent);
          box-shadow:
            0 0 20px rgba(var(--process-rgb), 0.68),
            0 0 46px rgba(var(--process-rgb), 0.28);
          transition: width 240ms ease, box-shadow 240ms ease;
        }

        .dt-process-card::after {
          content: "";
          position: absolute;
          right: -90px;
          bottom: -100px;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(var(--process-rgb), 0.2), transparent 66%);
          filter: blur(8px);
          opacity: 0.75;
          pointer-events: none;
          transition: opacity 240ms ease, transform 240ms ease;
        }

        .dt-process-card:hover {
          transform: translateY(-8px);
          border-color: rgba(var(--process-rgb), 0.5);
          box-shadow:
            0 38px 104px rgba(0, 0, 0, 0.38),
            0 0 46px rgba(var(--process-rgb), 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .dt-process-card:hover::before {
          width: 136px;
          box-shadow:
            0 0 26px rgba(var(--process-rgb), 0.8),
            0 0 58px rgba(var(--process-rgb), 0.36);
        }

        .dt-process-card:hover::after {
          opacity: 1;
          transform: scale(1.08);
        }

        .dt-process-top {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 20px;
        }

        .dt-process-number {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border-radius: 20px;
          color: #ffffff;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.04)),
            rgba(var(--process-rgb), 0.24);
          border: 1px solid rgba(var(--process-rgb), 0.36);
          box-shadow:
            0 18px 46px rgba(var(--process-rgb), 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          font-size: 20px;
          font-weight: 1000;
          letter-spacing: -0.05em;
        }

        .dt-process-label {
          color: rgba(247, 251, 255, 0.48);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .dt-process-visual {
          position: relative;
          z-index: 3;
          height: 118px;
          margin-bottom: 24px;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(var(--process-rgb), 0.2);
          background:
            radial-gradient(circle at 74% 22%, rgba(var(--process-rgb), 0.28), transparent 8rem),
            linear-gradient(145deg, rgba(var(--process-rgb), 0.13), rgba(255, 255, 255, 0.04));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: transform 240ms ease, border-color 240ms ease;
        }

        .dt-process-visual::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 20px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.5;
          mask-image: radial-gradient(circle, black, transparent 80%);
        }

        .dt-process-card:hover .dt-process-visual {
          transform: translateY(-4px);
          border-color: rgba(var(--process-rgb), 0.38);
        }

        .dt-process-magnifier {
          position: absolute;
          left: 34px;
          top: 28px;
          width: 52px;
          height: 52px;
          border: 4px solid rgba(247, 251, 255, 0.78);
          border-radius: 999px;
          box-shadow: 0 0 24px rgba(var(--process-rgb), 0.26);
        }

        .dt-process-magnifier::after {
          content: "";
          position: absolute;
          right: -22px;
          bottom: -18px;
          width: 30px;
          height: 6px;
          border-radius: 999px;
          background: rgba(247, 251, 255, 0.78);
          transform: rotate(45deg);
        }

        .dt-process-note {
          position: absolute;
          width: 64px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .dt-process-note-one {
          right: 24px;
          top: 28px;
        }

        .dt-process-note-two {
          right: 58px;
          bottom: 22px;
          opacity: 0.72;
        }

        .dt-process-pulse {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          transform: translate(-50%, -50%);
          background: var(--process-accent);
          box-shadow: 0 0 0 18px rgba(var(--process-rgb), 0.09), 0 0 28px rgba(var(--process-rgb), 0.72);
        }

        .dt-flow-node {
          position: absolute;
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          border-radius: 18px;
          color: #fff;
          background: rgba(var(--process-rgb), 0.24);
          border: 1px solid rgba(var(--process-rgb), 0.34);
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.2);
          font-weight: 950;
        }

        .dt-flow-node-one { left: 24px; top: 34px; }
        .dt-flow-node-two { left: 50%; top: 20px; transform: translateX(-50%); }
        .dt-flow-node-three { right: 24px; top: 34px; }

        .dt-flow-line {
          position: absolute;
          top: 60px;
          height: 2px;
          background: linear-gradient(90deg, rgba(var(--process-rgb), 0.18), var(--process-accent), rgba(var(--process-rgb), 0.18));
          box-shadow: 0 0 20px rgba(var(--process-rgb), 0.32);
        }

        .dt-flow-line-one { left: 76px; right: 50%; margin-right: 26px; }
        .dt-flow-line-two { left: 50%; margin-left: 26px; right: 76px; }

        .dt-code-window {
          position: absolute;
          left: 22px;
          right: 50px;
          top: 25px;
          height: 72px;
          padding: 17px;
          border-radius: 20px;
          background: rgba(5, 12, 24, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.13);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
        }

        .dt-code-window span {
          display: block;
          height: 8px;
          margin-bottom: 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.62);
        }

        .dt-code-window span:nth-child(2) {
          width: 74%;
          background: rgba(var(--process-rgb), 0.76);
        }

        .dt-code-window span:nth-child(3) { width: 52%; }

        .dt-build-cube {
          position: absolute;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(145deg, rgba(var(--process-rgb), 0.82), rgba(255, 255, 255, 0.14));
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
        }

        .dt-build-cube-one { right: 22px; bottom: 24px; }
        .dt-build-cube-two { right: 54px; top: 28px; opacity: 0.7; }

        .dt-launch-ring {
          position: absolute;
          left: 50%;
          bottom: 20px;
          width: 122px;
          height: 38px;
          border-radius: 50%;
          transform: translateX(-50%);
          border: 1px solid rgba(var(--process-rgb), 0.4);
          box-shadow: 0 0 30px rgba(var(--process-rgb), 0.2);
        }

        .dt-mini-rocket {
          position: absolute;
          left: 50%;
          top: 23px;
          width: 38px;
          height: 70px;
          transform: translateX(-50%) rotate(12deg);
          border-radius: 50% 50% 13px 13px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(var(--process-rgb), 0.48));
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.2), 0 0 26px rgba(var(--process-rgb), 0.22);
        }

        .dt-mini-rocket span {
          position: absolute;
          left: 50%;
          bottom: -17px;
          width: 20px;
          height: 28px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(180deg, #fff, var(--process-accent), transparent);
          box-shadow: 0 0 22px rgba(var(--process-rgb), 0.56);
        }

        .dt-launch-checklist {
          position: absolute;
          right: 22px;
          top: 24px;
          width: 54px;
          height: 64px;
          padding: 13px 10px;
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.11);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .dt-launch-checklist i {
          display: block;
          height: 6px;
          margin-bottom: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.6);
        }

        .dt-launch-checklist i:nth-child(2) {
          width: 70%;
          background: rgba(var(--process-rgb), 0.78);
        }

        .dt-launch-checklist i:nth-child(3) {
          width: 48%;
        }

        .dt-process-card h3 {
          position: relative;
          z-index: 3;
          margin: 0 0 13px;
          font-size: clamp(24px, 2.55vw, 34px);
          line-height: 1;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .dt-process-card p {
          position: relative;
          z-index: 3;
          margin: 0;
          color: rgba(247, 251, 255, 0.74);
          font-size: 15px;
          line-height: 1.62;
        }

        .dt-process-chip-row {
          position: relative;
          z-index: 3;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }

        .dt-process-chip {
          padding: 8px 10px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.82);
          background: rgba(255, 255, 255, 0.075);
          border: 1px solid rgba(var(--process-rgb), 0.2);
          font-size: 11px;
          font-weight: 850;
          line-height: 1;
        }

        .dt-quote-section {
          padding-top: 88px;
          padding-bottom: 64px;
        }

        .dt-quote {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(330px, 0.72fr);
          align-items: stretch;
          gap: 30px;
          padding: clamp(24px, 5vw, 48px);
          border-radius: 42px;
          border-color: rgba(98, 214, 255, 0.22);
          background:
            radial-gradient(circle at 92% 18%, rgba(98, 214, 255, 0.26), transparent 22rem),
            radial-gradient(circle at 18% 88%, rgba(124, 92, 255, 0.22), transparent 22rem),
            linear-gradient(135deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.04)),
            rgba(8, 20, 35, 0.82);
          box-shadow:
            0 38px 120px rgba(0, 0, 0, 0.38),
            0 0 70px rgba(98, 214, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
          isolation: isolate;
        }

        .dt-quote::before {
          content: "";
          position: absolute;
          top: 0;
          left: 44px;
          width: 170px;
          height: 4px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, #62d6ff, transparent);
          box-shadow:
            0 0 26px rgba(98, 214, 255, 0.72),
            0 0 64px rgba(98, 214, 255, 0.34);
          z-index: 3;
        }

        .dt-quote::after {
          content: "";
          position: absolute;
          right: -110px;
          bottom: -140px;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(98, 214, 255, 0.2), transparent 66%);
          filter: blur(10px);
          z-index: 0;
        }

        .dt-quote-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 330px;
        }

        .dt-quote h2 {
          margin: 0;
          max-width: 780px;
          font-size: clamp(40px, 5.65vw, 76px);
          line-height: 0.92;
          letter-spacing: -0.075em;
          text-wrap: balance;
        }

        .dt-quote p {
          max-width: 720px;
          margin: 22px 0 0;
          color: rgba(247, 251, 255, 0.78);
          font-size: clamp(16px, 1.25vw, 19px);
          line-height: 1.72;
        }

        .dt-quote-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 30px;
        }

        .dt-quote-note {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: rgba(247, 251, 255, 0.64);
          font-size: 13px;
          font-weight: 800;
        }

        .dt-quote-note::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.11);
        }

        .dt-quote-panel {
          position: relative;
          z-index: 3;
          overflow: hidden;
          min-height: 330px;
          padding: 22px;
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background:
            radial-gradient(circle at 68% 10%, rgba(98, 214, 255, 0.19), transparent 13rem),
            rgba(255, 255, 255, 0.06);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 24px 70px rgba(0, 0, 0, 0.22);
        }

        .dt-quote-panel::before {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: 26px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.54;
          mask-image: radial-gradient(circle at 50% 40%, black, transparent 82%);
        }

        .dt-quote-panel-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .dt-quote-panel-title {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .dt-quote-icon {
          display: grid;
          place-items: center;
          width: 54px;
          height: 54px;
          border-radius: 19px;
          color: #06101d;
          background: linear-gradient(135deg, #ffffff, #9be9ff 55%, #bdb2ff);
          box-shadow: 0 18px 50px rgba(98, 214, 255, 0.22);
          font-weight: 1000;
          font-size: 20px;
        }

        .dt-quote-panel-title strong {
          display: block;
          color: #ffffff;
          font-size: 18px;
          line-height: 1;
          letter-spacing: -0.035em;
        }

        .dt-quote-panel-title span {
          display: block;
          margin-top: 5px;
          color: rgba(247, 251, 255, 0.52);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .dt-quote-status {
          padding: 8px 11px;
          border-radius: 999px;
          color: #b8f7cc;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.2);
          font-size: 12px;
          font-weight: 900;
        }

        .dt-quote-steps {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 12px;
        }

        .dt-quote-step {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          align-items: center;
          padding: 13px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.065);
        }

        .dt-quote-step-number {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 15px;
          color: #f7fbff;
          background: rgba(98, 214, 255, 0.15);
          border: 1px solid rgba(98, 214, 255, 0.24);
          font-size: 14px;
          font-weight: 950;
        }

        .dt-quote-step strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          line-height: 1.15;
        }

        .dt-quote-step span {
          display: block;
          margin-top: 4px;
          color: rgba(247, 251, 255, 0.56);
          font-size: 12px;
          line-height: 1.35;
        }

        .dt-quote-mini-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 14px;
        }

        .dt-quote-mini {
          padding: 13px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.05);
        }

        .dt-quote-mini strong {
          display: block;
          color: #ffffff;
          font-size: 15px;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .dt-quote-mini span {
          display: block;
          margin-top: 6px;
          color: rgba(247, 251, 255, 0.52);
          font-size: 11px;
          line-height: 1.3;
        }

        .dt-footer {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 28px;
          padding: 28px 0 46px;
          color: var(--dt-faint);
          font-size: 14px;
        }

        .dt-footer::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.3), rgba(255, 255, 255, 0.1), transparent);
        }

        .dt-footer-left {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .dt-footer-brand-copy strong {
          display: block;
          color: rgba(247, 251, 255, 0.88);
          font-size: 14px;
          line-height: 1.1;
        }

        .dt-footer-brand-copy span {
          display: block;
          margin-top: 4px;
          color: rgba(247, 251, 255, 0.5);
          font-size: 13px;
        }

        .dt-footer .dt-logo-mark {
          width: 40px;
          height: 40px;
          flex-basis: 40px;
          border-radius: 14px;
          padding: 6px;
        }

        .dt-footer-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 14px;
        }

        .dt-footer a {
          color: rgba(247, 251, 255, 0.82);
          text-decoration: none;
          font-weight: 800;
          transition: color 160ms ease;
        }

        .dt-footer a:hover {
          color: #ffffff;
        }

        .dt-footer-quote {
          padding: 10px 13px;
          border-radius: 999px;
          border: 1px solid rgba(98, 214, 255, 0.2);
          background: rgba(98, 214, 255, 0.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .dt-page *,
          .dt-page *::before,
          .dt-page *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }

        @media (max-width: 980px) {
          .dt-hero,
          .dt-proof,
          .dt-quote {
            grid-template-columns: 1fr;
          }

          .dt-hero {
            padding-top: 26px;
          }

          .dt-hero-card-wrap {
            max-width: 620px;
          }

          .dt-service-grid,
          .dt-process-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dt-service-card {
            min-height: 585px;
          }

          .dt-section-head {
            align-items: start;
            flex-direction: column;
          }

          .dt-build-head {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .dt-build-copy {
            max-width: 720px;
          }
        }

        @media (max-width: 720px) {
          .dt-shell {
            width: min(100% - 28px, 1180px);
          }

          .dt-nav {
            align-items: flex-start;
          }

          .dt-nav-links {
            display: none;
          }

          .dt-hero h1 {
            letter-spacing: -0.055em;
          }

          .dt-trust-row,
          .dt-service-grid,
          .dt-work-grid,
          .dt-process-grid,
          .dt-mini-grid {
            grid-template-columns: 1fr;
          }

          .dt-service-card {
            min-height: auto;
          }

          .dt-service-visual {
            height: 178px;
          }

          .dt-service-chip-row {
            margin-top: 24px;
            padding-top: 0;
          }

          .dt-service-link {
            margin-top: 20px;
          }

          .dt-build-section {
            padding: 62px 0 68px;
          }

          .dt-build-shell::before {
            inset: -22px -14px -24px;
            border-radius: 30px;
          }

          .dt-build-title {
            font-size: clamp(42px, 12vw, 64px);
            letter-spacing: -0.07em;
          }

          .dt-service-card h3 {
            font-size: 31px;
          }

          .dt-section {
            padding: 54px 0;
          }

          .dt-quote {
            border-radius: 28px;
          }

          .dt-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 1180px) and (min-width: 981px) {
          .dt-service-grid {
            gap: 18px;
          }

          .dt-service-card {
            min-height: 620px;
            padding-left: 22px;
            padding-right: 22px;
          }

          .dt-service-visual {
            height: 166px;
          }

          .dt-service-card h3 {
            font-size: clamp(25px, 2.45vw, 32px);
          }

          .dt-service-card p {
            font-size: 15px;
          }

          .dt-service-chip {
            min-height: 32px;
            padding: 8px 10px;
            font-size: 11.5px;
          }
        }

        @media (max-width: 980px) {
          .dt-page {
            overflow-x: hidden;
          }

          .dt-build-section {
            padding: 74px 0 78px;
          }

          .dt-build-shell::before {
            inset: -28px -20px -32px;
          }

          .dt-build-head {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 30px;
          }

          .dt-build-copy {
            max-width: 760px;
          }

          .dt-service-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .dt-service-card {
            min-height: 585px;
            border-radius: 28px;
          }

          .dt-service-visual {
            height: 170px;
          }

          .dt-service-chip-row {
            gap: 8px;
          }
        }

        @media (max-width: 720px) {
          .dt-page {
            overflow-x: clip;
          }

          .dt-shell {
            width: min(100% - 28px, 1180px);
          }

          .dt-nav {
            padding: 20px 0;
          }

          .dt-brand {
            gap: 10px;
          }

          .dt-logo-mark {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
            border-radius: 14px;
          }

          .dt-brand-text strong {
            font-size: 14px;
          }

          .dt-brand-text span {
            font-size: 11px;
          }

          .dt-hero {
            padding: 24px 0 58px;
            gap: 30px;
          }

          .dt-kicker {
            font-size: 12px;
            padding: 8px 11px;
          }

          .dt-hero h1 {
            margin-top: 18px;
            font-size: clamp(42px, 13vw, 62px);
            line-height: 0.96;
            letter-spacing: -0.06em;
          }

          .dt-hero-copy {
            font-size: 16px;
            line-height: 1.62;
          }

          .dt-hero-actions {
            align-items: stretch;
            flex-direction: column;
            margin-top: 26px;
          }

          .dt-button {
            width: 100%;
            min-height: 50px;
          }

          .dt-trust-row {
            gap: 10px;
            margin-top: 28px;
          }

          .dt-stat {
            padding: 16px;
            border-radius: 18px;
          }

          .dt-stat strong {
            font-size: 23px;
          }

          .dt-hero-card-wrap {
            max-width: 100%;
          }

          .dt-product-card {
            padding: 16px;
            border-radius: 26px;
          }

          .dt-dash-hero {
            min-height: 156px;
            padding: 18px;
            border-radius: 22px;
          }

          .dt-dash-hero h2 {
            font-size: clamp(25px, 8vw, 38px);
          }

          .dt-logo-mark-large {
            width: 54px;
            height: 54px;
            flex-basis: 54px;
            border-radius: 18px;
            padding: 8px;
          }

          .dt-build-section {
            padding: 62px 0 68px;
          }

          .dt-build-shell::before {
            inset: -22px -14px -24px;
            border-radius: 30px;
          }

          .dt-build-head {
            gap: 20px;
            margin-bottom: 26px;
          }

          .dt-eyebrow {
            margin-bottom: 12px;
            font-size: 11px;
            letter-spacing: 0.16em;
          }

          .dt-build-title {
            font-size: clamp(40px, 12.2vw, 58px);
            line-height: 0.96;
            letter-spacing: -0.068em;
          }

          .dt-build-copy {
            font-size: 16px;
            line-height: 1.62;
            text-wrap: auto;
          }

          .dt-build-underline {
            margin-top: 18px;
          }

          .dt-service-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .dt-service-card {
            min-height: auto;
            padding: 98px 22px 26px;
            border-radius: 28px;
          }

          .dt-service-badge {
            top: 20px;
            left: 20px;
            right: 18px;
          }

          .dt-service-number {
            width: 58px;
            height: 58px;
            flex-basis: 58px;
            border-radius: 20px;
            font-size: 20px;
          }

          .dt-service-badge::before {
            top: 5px;
            left: 70px;
            font-size: 9px;
          }

          .dt-service-badge-line {
            min-width: 40px;
            margin-top: 28px;
          }

          .dt-service-visual {
            height: 176px;
            margin-bottom: 24px;
            border-radius: 23px;
          }

          .dt-service-card h3 {
            max-width: 100%;
            font-size: clamp(30px, 9vw, 38px);
            line-height: 1;
          }

          .dt-service-card p {
            max-width: 100%;
            font-size: 16px;
            line-height: 1.58;
          }

          .dt-service-chip-row {
            margin-top: 24px;
            padding-top: 0;
            gap: 8px;
          }

          .dt-service-chip {
            min-height: 33px;
            padding: 8px 10px;
            font-size: 11.5px;
          }

          .dt-service-link {
            margin-top: 20px;
            font-size: 13px;
          }

          .dt-section {
            padding: 54px 0;
          }

          .dt-section-head h2 {
            font-size: clamp(34px, 10vw, 50px);
            line-height: 1.02;
          }

          .dt-section-head p {
            font-size: 15px;
          }

          .dt-work-grid,
          .dt-process-grid,
          .dt-mini-grid,
          .dt-trust-row {
            grid-template-columns: 1fr;
          }

          .dt-work-card,
          .dt-process-card {
            border-radius: 26px;
          }

          .dt-quote {
            grid-template-columns: 1fr;
            border-radius: 28px;
            text-align: left;
          }

          .dt-quote h2 {
            font-size: clamp(34px, 10vw, 52px);
          }

          .dt-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .dt-shell {
            width: min(100% - 22px, 1180px);
          }

          .dt-hero h1 {
            font-size: clamp(38px, 12.5vw, 54px);
          }

          .dt-hero-card-wrap::before {
            inset: 10% 0 -6% 0;
            filter: blur(28px);
          }

          .dt-screen-row {
            grid-template-columns: 34px 1fr auto;
            gap: 9px;
            padding: 9px;
          }

          .dt-screen-icon {
            width: 34px;
            height: 34px;
            border-radius: 12px;
          }

          .dt-screen-row strong {
            font-size: 13px;
          }

          .dt-screen-row small,
          .dt-chip {
            font-size: 11px;
          }

          .dt-build-title {
            font-size: clamp(37px, 12vw, 49px);
          }

          .dt-build-copy {
            font-size: 15.5px;
          }

          .dt-build-shell::before {
            inset: -18px -10px -20px;
            border-radius: 26px;
          }

          .dt-service-card {
            padding: 92px 18px 22px;
          }

          .dt-service-badge {
            top: 18px;
            left: 18px;
            right: 16px;
          }

          .dt-service-number {
            width: 54px;
            height: 54px;
            flex-basis: 54px;
            border-radius: 18px;
            font-size: 19px;
          }

          .dt-service-badge::before {
            left: 66px;
            letter-spacing: 0.15em;
          }

          .dt-service-visual {
            height: 158px;
            border-radius: 21px;
          }

          .dt-phone-device {
            width: 78px;
            height: 126px;
          }

          .dt-orbit-one {
            width: 142px;
            height: 76px;
          }

          .dt-orbit-two {
            width: 104px;
            height: 48px;
          }

          .dt-visual-bubble {
            width: 38px;
            height: 38px;
            border-radius: 13px;
            font-size: 11px;
          }

          .dt-bubble-ios {
            right: 18px;
          }

          .dt-bubble-android {
            left: 18px;
          }

          .dt-laptop-base {
            left: 16px;
            right: 16px;
            height: 104px;
          }

          .dt-floating-metric {
            width: 62px;
            height: 62px;
            border-radius: 20px;
            top: 24px;
            right: 18px;
          }

          .dt-floating-metric strong {
            font-size: 18px;
          }

          .dt-storefront {
            left: 42px;
            width: 100px;
            height: 76px;
          }

          .dt-market-cart {
            right: 28px;
          }

          .dt-node-one {
            right: 28px;
          }

          .dt-node-two {
            left: 22px;
          }

          .dt-rocket {
            height: 80px;
            width: 42px;
          }

          .dt-plan-card {
            right: 16px;
            width: 54px;
            height: 64px;
          }

          .dt-idea-dot {
            left: 18px;
            width: 38px;
            height: 38px;
          }

          .dt-service-card h3 {
            font-size: 30px;
          }

          .dt-service-card p {
            font-size: 15px;
          }

          .dt-service-chip {
            font-size: 11px;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .dt-service-card:hover,
          .dt-service-card:focus-within {
            transform: none;
            filter: none;
          }

          .dt-service-card:hover .dt-service-visual,
          .dt-service-card:focus-within .dt-service-visual,
          .dt-service-card:hover h3,
          .dt-service-card:focus-within h3,
          .dt-service-card:hover p,
          .dt-service-card:focus-within p,
          .dt-service-card:hover .dt-service-chip,
          .dt-service-card:focus-within .dt-service-chip,
          .dt-service-card:hover .dt-service-link,
          .dt-service-card:focus-within .dt-service-link {
            transform: none;
          }

          .dt-service-card:hover .dt-phone-device,
          .dt-service-card:focus-within .dt-phone-device {
            transform: translateX(-50%) rotate(-7deg);
          }

          .dt-service-card:hover .dt-rocket,
          .dt-service-card:focus-within .dt-rocket {
            transform: translateX(-50%) rotate(12deg);
          }
        }


        @media (max-width: 980px) {
          .dt-work-grid {
            grid-template-columns: 1fr;
          }

          .dt-work-card {
            min-height: 340px;
          }

          .dt-project-visual {
            height: 124px;
          }
        }

        @media (max-width: 720px) {
          .dt-work-card {
            min-height: auto;
            padding: 22px;
            border-radius: 28px;
          }

          .dt-work-topline {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .dt-work-metric {
            min-width: 0;
            width: fit-content;
            min-height: 58px;
            grid-auto-flow: column;
            column-gap: 10px;
            padding: 10px 12px;
          }

          .dt-work-metric span {
            margin-top: 0;
            text-align: left;
          }

          .dt-project-visual {
            height: 118px;
            border-radius: 22px;
          }

          .dt-work-card h3 {
            font-size: clamp(30px, 9vw, 38px);
          }

          .dt-work-card p {
            font-size: 15.5px;
          }
        }

        @media (max-width: 480px) {
          .dt-work-card {
            padding: 20px;
          }

          .dt-project-visual {
            height: 108px;
          }

          .dt-project-phone {
            left: 24px;
            width: 56px;
            height: 82px;
          }

          .dt-project-route {
            left: 96px;
            right: 24px;
          }

          .dt-quote-stack {
            left: 22px;
            width: 138px;
          }

          .dt-bid-one {
            right: 62px;
          }

          .dt-bid-two {
            right: 22px;
          }

          .dt-qr-card {
            left: 24px;
            width: 70px;
            height: 70px;
          }

          .dt-table-one {
            left: 116px;
          }

          .dt-table-two {
            left: 158px;
          }

          .dt-order-ticket {
            right: 22px;
            width: 76px;
          }

          .dt-ops-panel {
            left: 22px;
            width: 130px;
          }

          .dt-ops-chart {
            right: 24px;
          }

          .dt-tag {
            font-size: 11px;
            padding: 8px 10px;
          }
        }


        @media (max-width: 980px) {
          .dt-proof {
            grid-template-columns: 1fr;
          }

          .dt-proof-card {
            min-height: auto;
          }

          .dt-capability-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .dt-capability-head p {
            max-width: 620px;
          }
        }

        @media (max-width: 720px) {
          .dt-proof-card,
          .dt-capability-panel {
            padding: 22px;
            border-radius: 28px;
          }

          .dt-proof-card h2 {
            font-size: clamp(34px, 10vw, 52px);
          }

          .dt-proof-card p {
            font-size: 15.5px;
          }

          .dt-proof-system {
            min-height: 168px;
            margin-top: 28px;
            border-radius: 24px;
          }

          .dt-system-core {
            width: 90px;
            height: 90px;
            border-radius: 28px;
            font-size: 14px;
          }

          .dt-system-node {
            width: 54px;
            height: 54px;
            border-radius: 18px;
            font-size: 9.5px;
          }

          .dt-proof-mini-row,
          .dt-capability-grid {
            grid-template-columns: 1fr;
          }

          .dt-proof-mini {
            min-height: auto;
          }

          .dt-capability-head h3 {
            font-size: clamp(30px, 9vw, 42px);
          }

          .dt-capability-card {
            min-height: auto;
          }
        }

        @media (max-width: 480px) {
          .dt-proof-card,
          .dt-capability-panel {
            padding: 20px;
          }

          .dt-proof-system {
            min-height: 150px;
          }

          .dt-system-node-one { left: 16px; top: 22px; }
          .dt-system-node-two { right: 16px; top: 22px; }
          .dt-system-node-three { left: 16px; bottom: 20px; }
          .dt-system-node-four { right: 16px; bottom: 20px; }

          .dt-system-line {
            left: 64px;
            right: 64px;
          }

          .dt-system-line-vertical {
            top: 38px;
            bottom: 38px;
          }

          .dt-capability-items {
            gap: 6px;
          }

          .dt-capability-item {
            font-size: 10.5px;
          }
        }


        @media (max-width: 1180px) and (min-width: 981px) {
          .dt-process-grid {
            gap: 16px;
          }

          .dt-process-card {
            min-height: 438px;
            padding: 20px;
          }

          .dt-process-card h3 {
            font-size: clamp(23px, 2.25vw, 30px);
          }

          .dt-process-visual {
            height: 108px;
          }
        }

        @media (max-width: 980px) {
          .dt-process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .dt-process-grid::before {
            display: none;
          }

          .dt-process-card {
            min-height: 410px;
          }
        }

        @media (max-width: 720px) {
          .dt-process-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .dt-process-card {
            min-height: auto;
            padding: 22px;
            border-radius: 28px;
          }

          .dt-process-top {
            margin-bottom: 18px;
          }

          .dt-process-number {
            width: 54px;
            height: 54px;
            border-radius: 18px;
            font-size: 19px;
          }

          .dt-process-visual {
            height: 116px;
            border-radius: 22px;
          }

          .dt-process-card h3 {
            font-size: clamp(30px, 9vw, 38px);
          }

          .dt-process-card p {
            font-size: 15.5px;
          }
        }

        @media (max-width: 480px) {
          .dt-process-card {
            padding: 20px;
          }

          .dt-process-visual {
            height: 104px;
          }

          .dt-process-magnifier {
            left: 24px;
            width: 44px;
            height: 44px;
          }

          .dt-process-note-one {
            right: 18px;
          }

          .dt-process-note-two {
            right: 44px;
          }

          .dt-flow-node {
            width: 44px;
            height: 44px;
            border-radius: 15px;
          }

          .dt-flow-node-one { left: 18px; }
          .dt-flow-node-three { right: 18px; }
          .dt-flow-line-one { left: 62px; }
          .dt-flow-line-two { right: 62px; }

          .dt-code-window {
            left: 18px;
            right: 44px;
            height: 64px;
          }

          .dt-launch-checklist {
            right: 18px;
            width: 48px;
            height: 58px;
          }

          .dt-mini-rocket {
            width: 34px;
            height: 62px;
          }

          .dt-process-chip {
            font-size: 10.5px;
          }
        }


        @media (max-width: 980px) {
          .dt-quote {
            grid-template-columns: 1fr;
          }

          .dt-quote-content {
            min-height: auto;
          }

          .dt-quote-panel {
            min-height: auto;
          }
        }

        @media (max-width: 720px) {
          .dt-quote-section {
            padding-top: 54px;
            padding-bottom: 42px;
          }

          .dt-quote {
            gap: 22px;
            padding: 22px;
            border-radius: 30px;
          }

          .dt-quote::before {
            left: 24px;
            width: 120px;
          }

          .dt-quote h2 {
            font-size: clamp(36px, 11vw, 56px);
            line-height: 0.96;
          }

          .dt-quote p {
            font-size: 15.5px;
          }

          .dt-quote-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .dt-quote-note {
            justify-content: center;
            text-align: center;
          }

          .dt-quote-panel {
            padding: 18px;
            border-radius: 26px;
          }

          .dt-quote-panel-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .dt-quote-status {
            width: fit-content;
          }

          .dt-quote-step {
            grid-template-columns: 38px 1fr;
            padding: 12px;
            border-radius: 18px;
          }

          .dt-quote-step-number {
            width: 38px;
            height: 38px;
            border-radius: 14px;
          }

          .dt-quote-mini-grid {
            grid-template-columns: 1fr;
          }

          .dt-footer {
            grid-template-columns: 1fr;
            align-items: flex-start;
            gap: 20px;
            padding-bottom: 34px;
          }

          .dt-footer-links {
            justify-content: flex-start;
            width: 100%;
          }

          .dt-footer-quote {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .dt-quote {
            padding: 20px;
            border-radius: 28px;
          }

          .dt-quote h2 {
            font-size: clamp(34px, 10.8vw, 48px);
          }

          .dt-quote-panel-title {
            align-items: flex-start;
          }

          .dt-quote-icon {
            width: 48px;
            height: 48px;
            border-radius: 17px;
          }

          .dt-footer-left {
            align-items: flex-start;
          }

          .dt-footer-links {
            gap: 10px;
          }

          .dt-footer-links a:not(.dt-footer-quote) {
            padding: 8px 0;
          }
        }


        @media (max-width: 980px) {
          .dt-hero {
            grid-template-columns: 1fr;
            padding-top: 34px;
          }

          .dt-hero-title {
            font-size: clamp(48px, 10vw, 76px);
          }

          .dt-hero-card-wrap {
            max-width: 720px;
          }

          .dt-product-card {
            min-height: auto;
          }
        }

        @media (max-width: 720px) {
          .dt-hero {
            padding: 24px 0 64px;
          }

          .dt-hero-title {
            margin-top: 22px;
            font-size: clamp(40px, 12vw, 60px);
            line-height: 0.96;
          }

          .dt-hero-copy {
            font-size: 16px;
            line-height: 1.62;
          }

          .dt-hero-proof-row {
            margin-top: 22px;
          }

          .dt-blueprint-flow {
            grid-template-columns: 1fr;
          }

          .dt-blueprint-node {
            min-height: auto;
            display: grid;
            grid-template-columns: 42px 1fr;
            gap: 12px;
            align-items: center;
          }

          .dt-blueprint-node strong {
            margin-top: 0;
          }

          .dt-blueprint-row {
            grid-template-columns: 38px 1fr;
          }

          .dt-blueprint-pill {
            grid-column: 2;
            width: fit-content;
          }

          .dt-blueprint-hero {
            min-height: 184px;
            padding: 20px;
          }

          .dt-blueprint-hero h2 {
            max-width: 320px;
            font-size: clamp(31px, 9vw, 43px);
          }

          .dt-blueprint-logo {
            width: 56px;
            height: 56px;
            border-radius: 20px;
          }

          .dt-blueprint-logo img {
            width: 38px;
            height: 38px;
          }
        }

        @media (max-width: 480px) {
          .dt-hero-brand-chip {
            padding: 9px 12px 9px 9px;
          }

          .dt-hero-title {
            font-size: clamp(38px, 11.2vw, 50px);
          }

          .dt-product-card {
            padding: 16px;
            border-radius: 30px;
          }

          .dt-product-card::after {
            inset: 16px;
            border-radius: 24px;
          }

          .dt-blueprint-hero {
            border-radius: 24px;
          }

          .dt-blueprint-list {
            padding: 12px;
            border-radius: 22px;
          }

          .dt-blueprint-row {
            padding: 10px;
          }
        }


        /* Task 14: compact the header so it feels premium without taking over the page */
        .dt-hero {
          grid-template-columns: minmax(0, 0.92fr) minmax(390px, 0.7fr);
          gap: clamp(30px, 4.6vw, 58px);
          padding: 30px 0 70px;
        }

        .dt-hero-brand-chip {
          padding: 8px 12px 8px 8px;
        }

        .dt-hero-brand-chip .dt-logo-mark {
          width: 32px;
          height: 32px;
          flex-basis: 32px;
          border-radius: 12px;
        }

        .dt-hero-title {
          max-width: 700px;
          margin: 22px 0 18px;
          font-size: clamp(44px, 5.3vw, 72px);
          line-height: 0.94;
          letter-spacing: -0.078em;
        }

        .dt-hero-copy {
          max-width: 590px;
          font-size: clamp(16px, 1.23vw, 18.5px);
          line-height: 1.65;
        }

        .dt-hero-actions {
          margin-top: 26px;
        }

        .dt-hero-proof-row {
          margin-top: 22px;
        }

        .dt-hero-proof {
          padding: 8px 10px;
          font-size: 11.5px;
        }

        .dt-trust-row {
          gap: 10px;
          margin-top: 24px;
          max-width: 650px;
        }

        .dt-stat {
          min-height: 94px;
          padding: 15px;
          border-radius: 20px;
        }

        .dt-stat strong {
          font-size: 22px;
        }

        .dt-stat span {
          margin-top: 7px;
          font-size: 12px;
        }

        .dt-product-card {
          min-height: 500px;
          padding: 19px;
          border-radius: 32px;
        }

        .dt-product-card::before {
          left: 30px;
          width: 130px;
        }

        .dt-product-card::after {
          inset: 18px;
          border-radius: 26px;
          background-size: 36px 36px;
        }

        .dt-product-top {
          margin-bottom: 13px;
        }

        .dt-product-status {
          padding: 6px 9px;
          font-size: 11px;
        }

        .dt-hero-blueprint {
          gap: 11px;
        }

        .dt-blueprint-hero {
          min-height: 155px;
          padding: 20px;
          border-radius: 24px;
        }

        .dt-blueprint-hero h2 {
          max-width: 340px;
          margin-top: 10px;
          font-size: clamp(30px, 2.75vw, 42px);
          line-height: 0.97;
        }

        .dt-blueprint-hero span {
          font-size: 10.5px;
        }

        .dt-blueprint-logo {
          width: 54px;
          height: 54px;
          border-radius: 19px;
          right: 16px;
          top: 16px;
        }

        .dt-blueprint-logo img {
          width: 36px;
          height: 36px;
        }

        .dt-blueprint-flow {
          gap: 10px;
        }

        .dt-blueprint-node {
          min-height: 96px;
          padding: 14px;
          border-radius: 20px;
        }

        .dt-blueprint-icon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          font-size: 13px;
        }

        .dt-blueprint-node strong {
          margin-top: 12px;
          font-size: 19px;
        }

        .dt-blueprint-node span {
          font-size: 9.5px;
        }

        .dt-blueprint-list {
          gap: 8px;
          padding: 11px;
          border-radius: 22px;
        }

        .dt-blueprint-row {
          grid-template-columns: 36px 1fr auto;
          gap: 10px;
          padding: 10px;
          border-radius: 16px;
        }

        .dt-blueprint-row-icon {
          width: 36px;
          height: 36px;
          border-radius: 13px;
          font-size: 12px;
        }

        .dt-blueprint-row strong {
          font-size: 13px;
        }

        .dt-blueprint-row small {
          margin-top: 4px;
          font-size: 11px;
        }

        .dt-blueprint-pill {
          padding: 6px 9px;
          font-size: 11px;
        }

        @media (max-width: 1180px) and (min-width: 981px) {
          .dt-hero {
            grid-template-columns: minmax(0, 1fr) minmax(360px, 0.72fr);
          }

          .dt-hero-title {
            font-size: clamp(42px, 5vw, 66px);
          }

          .dt-product-card {
            min-height: 480px;
          }
        }

        @media (max-width: 980px) {
          .dt-hero {
            grid-template-columns: 1fr;
            padding: 28px 0 58px;
          }

          .dt-hero-title {
            font-size: clamp(42px, 8vw, 64px);
          }

          .dt-product-card {
            max-width: 650px;
            min-height: auto;
          }
        }

        @media (max-width: 720px) {
          .dt-hero {
            padding: 22px 0 54px;
          }

          .dt-hero-title {
            font-size: clamp(38px, 10.8vw, 54px);
          }

          .dt-trust-row {
            margin-top: 22px;
          }

          .dt-blueprint-hero {
            min-height: 150px;
          }

          .dt-blueprint-flow {
            grid-template-columns: 1fr;
          }

          .dt-blueprint-node {
            min-height: auto;
          }
        }


        /* Task 15: make 100% browser zoom feel like the 67% zoom view on desktop */
        @media (min-width: 981px) {
          .dt-page {
            --dt-desktop-scale: 0.78;
            width: calc(100% / var(--dt-desktop-scale));
            min-height: calc(100vh / var(--dt-desktop-scale));
            transform: scale(var(--dt-desktop-scale));
            transform-origin: top left;
            overflow-x: hidden;
          }

          .dt-shell {
            width: min(1420px, calc(100% - 72px));
          }

          .dt-hero {
            grid-template-columns: minmax(0, 0.92fr) minmax(430px, 0.72fr);
            gap: clamp(34px, 5vw, 74px);
            padding: 34px 0 78px;
          }

          .dt-hero-title {
            max-width: 760px;
            font-size: clamp(48px, 5.55vw, 78px);
          }

          .dt-product-card {
            max-width: 650px;
            margin-left: auto;
          }

          .dt-service-grid,
          .dt-process-grid {
            gap: 24px;
          }

          .dt-work-grid {
            gap: 24px;
          }
        }

        @media (min-width: 1500px) {
          .dt-page {
            --dt-desktop-scale: 0.72;
          }

          .dt-shell {
            width: min(1520px, calc(100% - 96px));
          }
        }

        @media (min-width: 1800px) {
          .dt-page {
            --dt-desktop-scale: 0.67;
          }

          .dt-shell {
            width: min(1660px, calc(100% - 120px));
          }
        }

        @media (max-width: 980px) {
          .dt-page {
            width: 100%;
            min-height: 100vh;
            transform: none;
          }
        }


        /* Task 19: header/page-1 only, 10% more zoomed in, centered safely */
        @media (min-width: 981px) {
          .dt-hero {
            zoom: 1.1;
            width: calc(100% / 1.1);
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 980px) {
          .dt-hero {
            zoom: 1;
            width: 100%;
          }
        }


        /* Mobile header task 1: premium icon tabs, no letter icons */
        .dt-mobile-tabs {
          display: none;
        }

        @media (max-width: 720px) {
          .dt-mobile-tabs {
            position: relative;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 9px;
            margin: 4px 0 20px;
            padding: 10px;
            border-radius: 28px;
            border: 1px solid rgba(98, 214, 255, 0.2);
            background:
              radial-gradient(circle at 18% 10%, rgba(98, 214, 255, 0.18), transparent 8rem),
              radial-gradient(circle at 92% 8%, rgba(124, 92, 255, 0.16), transparent 8rem),
              linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.035)),
              rgba(7, 17, 31, 0.72);
            box-shadow:
              0 22px 70px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(22px);
            overflow: hidden;
          }

          .dt-mobile-tabs::before {
            content: "";
            position: absolute;
            left: 18px;
            right: 18px;
            bottom: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.62), rgba(124, 92, 255, 0.46), transparent);
            box-shadow: 0 0 26px rgba(98, 214, 255, 0.34);
          }

          .dt-mobile-tab {
            position: relative;
            z-index: 2;
            display: flex;
            min-width: 0;
            min-height: 86px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 9px;
            padding: 12px 7px 11px;
            border-radius: 22px;
            border: 1px solid rgba(255, 255, 255, 0.095);
            color: rgba(247, 251, 255, 0.72);
            text-decoration: none;
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.03)),
              rgba(255, 255, 255, 0.035);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              0 12px 30px rgba(0, 0, 0, 0.16);
          }

          .dt-mobile-tab svg {
            width: 27px;
            height: 27px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.75;
            stroke-linecap: round;
            stroke-linejoin: round;
            opacity: 0.92;
          }

          .dt-mobile-tab span {
            display: block;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            color: inherit;
            font-size: 11.5px;
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.02em;
            white-space: nowrap;
          }

          .dt-mobile-tab-active {
            color: #62d6ff;
            border-color: rgba(98, 214, 255, 0.56);
            background:
              radial-gradient(circle at 50% 0%, rgba(98, 214, 255, 0.28), transparent 5.8rem),
              linear-gradient(180deg, rgba(98, 214, 255, 0.18), rgba(255, 255, 255, 0.04)),
              rgba(98, 214, 255, 0.055);
            box-shadow:
              0 0 0 1px rgba(98, 214, 255, 0.1),
              0 16px 46px rgba(98, 214, 255, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }

          .dt-mobile-tab-active::after {
            content: "";
            position: absolute;
            left: 22%;
            right: 22%;
            bottom: -1px;
            height: 3px;
            border-radius: 999px 999px 0 0;
            background: #62d6ff;
            box-shadow: 0 0 20px rgba(98, 214, 255, 0.88);
          }
        }

        @media (max-width: 480px) {
          .dt-mobile-tabs {
            gap: 7px;
            padding: 8px;
            border-radius: 24px;
          }

          .dt-mobile-tab {
            min-height: 76px;
            border-radius: 19px;
            gap: 8px;
            padding: 10px 5px;
          }

          .dt-mobile-tab svg {
            width: 24px;
            height: 24px;
          }

          .dt-mobile-tab span {
            font-size: 10.5px;
          }
        }


        /* Mobile header task 2: premium brand row + menu button */
        .dt-mobile-menu-button {
          display: none;
        }

        @media (max-width: 720px) {
          .dt-nav {
            position: relative;
            align-items: center;
            padding: 22px 0 14px;
          }

          .dt-nav::before {
            content: "";
            position: absolute;
            left: -18px;
            right: -18px;
            top: 2px;
            height: 94px;
            border-radius: 0 0 32px 32px;
            background:
              radial-gradient(circle at 18% 30%, rgba(98, 214, 255, 0.18), transparent 10rem),
              radial-gradient(circle at 92% 18%, rgba(124, 92, 255, 0.14), transparent 9rem);
            opacity: 0.9;
            pointer-events: none;
            z-index: -1;
          }

          .dt-brand {
            gap: 12px;
            min-width: 0;
          }

          .dt-brand .dt-logo-mark {
            width: 52px;
            height: 52px;
            flex-basis: 52px;
            border-radius: 18px;
            padding: 7px;
            border-color: rgba(98, 214, 255, 0.32);
            background:
              radial-gradient(circle at 35% 22%, rgba(255, 255, 255, 0.2), transparent 2rem),
              linear-gradient(145deg, rgba(98, 214, 255, 0.24), rgba(124, 92, 255, 0.16)),
              rgba(255, 255, 255, 0.075);
            box-shadow:
              0 0 0 1px rgba(98, 214, 255, 0.08),
              0 18px 46px rgba(98, 214, 255, 0.14),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }

          .dt-brand-text strong {
            font-size: 15px;
            line-height: 1;
            letter-spacing: -0.02em;
          }

          .dt-brand-text span {
            margin-top: 6px;
            color: rgba(247, 251, 255, 0.52);
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .dt-mobile-menu-button {
            display: inline-flex;
            position: relative;
            flex: 0 0 50px;
            width: 50px;
            height: 50px;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 6px;
            border-radius: 18px;
            border: 1px solid rgba(98, 214, 255, 0.24);
            background:
              radial-gradient(circle at 50% 0%, rgba(98, 214, 255, 0.16), transparent 4rem),
              linear-gradient(180deg, rgba(255, 255, 255, 0.095), rgba(255, 255, 255, 0.035)),
              rgba(255, 255, 255, 0.045);
            box-shadow:
              0 18px 46px rgba(0, 0, 0, 0.24),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);
            text-decoration: none;
            overflow: hidden;
          }

          .dt-mobile-menu-button::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(98, 214, 255, 0.12), transparent 45%, rgba(124, 92, 255, 0.11));
            opacity: 0.92;
          }

          .dt-mobile-menu-button span {
            position: relative;
            z-index: 2;
            display: block;
            width: 19px;
            height: 2px;
            border-radius: 999px;
            background: rgba(247, 251, 255, 0.88);
            box-shadow: 0 0 16px rgba(98, 214, 255, 0.26);
          }

          .dt-mobile-menu-button span:nth-child(2) {
            width: 23px;
            background: #62d6ff;
            box-shadow: 0 0 20px rgba(98, 214, 255, 0.62);
          }

          .dt-mobile-tabs {
            margin-top: 8px;
          }
        }

        @media (max-width: 480px) {
          .dt-nav {
            padding: 18px 0 12px;
          }

          .dt-brand {
            gap: 10px;
          }

          .dt-brand .dt-logo-mark {
            width: 46px;
            height: 46px;
            flex-basis: 46px;
            border-radius: 16px;
          }

          .dt-brand-text strong {
            font-size: 13.5px;
          }

          .dt-brand-text span {
            font-size: 9px;
            letter-spacing: 0.1em;
          }

          .dt-mobile-menu-button {
            width: 46px;
            height: 46px;
            flex-basis: 46px;
            border-radius: 16px;
          }
        }


        /* Mobile task 3: hero intro polish under the new tabs */
        .dt-mobile-hero-strip,
        .dt-mobile-hero-kicker {
          display: none;
        }

        @media (max-width: 720px) {
          .dt-hero {
            padding-top: 12px;
            gap: 24px;
          }

          .dt-hero-left {
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }

          .dt-hero-brand-chip {
            display: none;
          }

          .dt-mobile-hero-strip {
            position: relative;
            display: grid;
            grid-template-columns: 34px 1fr auto;
            align-items: center;
            gap: 12px;
            min-height: 62px;
            margin: 2px 0 24px;
            padding: 12px 13px;
            border-radius: 21px;
            color: rgba(247, 251, 255, 0.86);
            text-decoration: none;
            background:
              radial-gradient(circle at 18% 35%, rgba(98, 214, 255, 0.16), transparent 7rem),
              linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.032)),
              rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(98, 214, 255, 0.16);
            box-shadow:
              0 18px 48px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.09);
            overflow: hidden;
          }

          .dt-mobile-hero-strip::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(98, 214, 255, 0.08), transparent 50%, rgba(124, 92, 255, 0.08));
            pointer-events: none;
          }

          .dt-mobile-hero-strip-icon {
            position: relative;
            z-index: 2;
            display: grid;
            place-items: center;
            width: 34px;
            height: 34px;
            border-radius: 13px;
            color: #62d6ff;
            background: rgba(98, 214, 255, 0.105);
            border: 1px solid rgba(98, 214, 255, 0.22);
            box-shadow: 0 0 22px rgba(98, 214, 255, 0.13);
          }

          .dt-mobile-hero-strip-icon svg {
            width: 19px;
            height: 19px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.7;
            stroke-linecap: round;
            stroke-linejoin: round;
          }

          .dt-mobile-hero-strip span:not(.dt-mobile-hero-strip-icon):not(.dt-mobile-hero-strip-arrow) {
            position: relative;
            z-index: 2;
            min-width: 0;
            color: rgba(247, 251, 255, 0.86);
            font-size: 14px;
            font-weight: 750;
            line-height: 1.25;
            letter-spacing: -0.02em;
          }

          .dt-mobile-hero-strip span:not(.dt-mobile-hero-strip-icon):not(.dt-mobile-hero-strip-arrow)::first-letter {
            color: #ffffff;
          }

          .dt-mobile-hero-strip-arrow {
            position: relative;
            z-index: 2;
            color: #62d6ff;
            font-size: 22px;
            font-weight: 850;
            line-height: 1;
            text-shadow: 0 0 18px rgba(98, 214, 255, 0.5);
          }

          .dt-mobile-hero-kicker {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            width: fit-content;
            margin-bottom: 15px;
            padding: 8px 11px;
            border-radius: 999px;
            color: rgba(247, 251, 255, 0.76);
            background:
              linear-gradient(90deg, rgba(98, 214, 255, 0.12), rgba(124, 92, 255, 0.08)),
              rgba(255, 255, 255, 0.045);
            border: 1px solid rgba(98, 214, 255, 0.14);
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 0.13em;
            text-transform: uppercase;
          }

          .dt-mobile-hero-kicker span {
            color: #62d6ff;
            font-size: 13px;
            line-height: 1;
            text-shadow: 0 0 14px rgba(98, 214, 255, 0.58);
          }

          .dt-hero-title {
            margin: 0 0 17px;
            max-width: 100%;
            font-size: clamp(41px, 11.5vw, 58px);
            line-height: 0.98;
            letter-spacing: -0.065em;
            text-wrap: balance;
          }

          .dt-hero-title-mark {
            display: inline;
            background: linear-gradient(90deg, #62d6ff, #7bb8ff 52%, #b16cff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: none;
          }

          .dt-hero-copy {
            max-width: 100%;
            color: rgba(247, 251, 255, 0.72);
            font-size: 16px;
            line-height: 1.62;
          }

          .dt-hero-actions {
            margin-top: 24px;
          }

          .dt-hero-proof-row {
            gap: 8px;
            margin-top: 18px;
          }

          .dt-hero-proof {
            padding: 8px 10px;
            font-size: 11px;
            line-height: 1;
          }
        }

        @media (max-width: 480px) {
          .dt-mobile-hero-strip {
            grid-template-columns: 32px 1fr auto;
            gap: 10px;
            min-height: 58px;
            margin-bottom: 21px;
            padding: 11px;
            border-radius: 19px;
          }

          .dt-mobile-hero-strip-icon {
            width: 32px;
            height: 32px;
            border-radius: 12px;
          }

          .dt-mobile-hero-strip span:not(.dt-mobile-hero-strip-icon):not(.dt-mobile-hero-strip-arrow) {
            font-size: 13px;
          }

          .dt-mobile-hero-kicker {
            margin-bottom: 13px;
            font-size: 10px;
            letter-spacing: 0.11em;
          }

          .dt-hero-title {
            font-size: clamp(38px, 11.7vw, 51px);
          }
        }


        /* Mobile task 4: premium CTA buttons and proof chips */
        @media (max-width: 720px) {
          .dt-hero-actions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 25px;
          }

          .dt-hero-actions .dt-button {
            position: relative;
            width: 100%;
            min-height: 58px;
            justify-content: space-between;
            padding: 0 18px;
            border-radius: 20px;
            overflow: hidden;
            font-size: 14px;
            letter-spacing: -0.015em;
            box-shadow:
              0 18px 48px rgba(0, 0, 0, 0.22),
              inset 0 1px 0 rgba(255, 255, 255, 0.14);
          }

          .dt-hero-actions .dt-button::after {
            content: "→";
            display: grid;
            place-items: center;
            width: 34px;
            height: 34px;
            flex: 0 0 34px;
            border-radius: 999px;
            font-size: 20px;
            font-weight: 900;
            line-height: 1;
            transition: transform 160ms ease;
          }

          .dt-hero-actions .dt-button-primary {
            color: #06101d;
            background:
              radial-gradient(circle at 16% 0%, rgba(255, 255, 255, 0.88), transparent 8rem),
              linear-gradient(135deg, #9be9ff 0%, #62d6ff 42%, #8f7bff 100%);
            border: 1px solid rgba(255, 255, 255, 0.34);
            box-shadow:
              0 22px 58px rgba(98, 214, 255, 0.24),
              0 0 44px rgba(124, 92, 255, 0.13),
              inset 0 1px 0 rgba(255, 255, 255, 0.45);
          }

          .dt-hero-actions .dt-button-primary::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.25), transparent 42%, rgba(255, 255, 255, 0.18));
            opacity: 0.7;
            pointer-events: none;
          }

          .dt-hero-actions .dt-button-primary::after {
            color: #06101d;
            background: rgba(255, 255, 255, 0.42);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.38);
          }

          .dt-hero-actions .dt-button-secondary {
            color: rgba(247, 251, 255, 0.9);
            border: 1px solid rgba(98, 214, 255, 0.18);
            background:
              radial-gradient(circle at 16% 0%, rgba(98, 214, 255, 0.13), transparent 8rem),
              linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025)),
              rgba(255, 255, 255, 0.035);
          }

          .dt-hero-actions .dt-button-secondary::after {
            color: #62d6ff;
            background: rgba(98, 214, 255, 0.105);
            border: 1px solid rgba(98, 214, 255, 0.18);
            text-shadow: 0 0 16px rgba(98, 214, 255, 0.6);
          }

          .dt-hero-actions .dt-button:hover::after {
            transform: translateX(3px);
          }

          .dt-hero-proof-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 9px;
            margin-top: 18px;
          }

          .dt-hero-proof {
            position: relative;
            justify-content: flex-start;
            min-height: 42px;
            padding: 10px 12px;
            border-radius: 16px;
            color: rgba(247, 251, 255, 0.84);
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.074), rgba(255, 255, 255, 0.03)),
              rgba(255, 255, 255, 0.035);
            border: 1px solid rgba(255, 255, 255, 0.09);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.07),
              0 12px 32px rgba(0, 0, 0, 0.14);
            font-size: 12px;
            font-weight: 850;
            letter-spacing: -0.01em;
          }

          .dt-hero-proof::before {
            width: 8px;
            height: 8px;
            margin-right: 2px;
            background: #62d6ff;
            box-shadow: 0 0 0 6px rgba(98, 214, 255, 0.08), 0 0 18px rgba(98, 214, 255, 0.64);
          }

          .dt-hero-proof::after {
            content: "";
            position: absolute;
            right: 12px;
            top: 50%;
            width: 6px;
            height: 6px;
            border-top: 1.5px solid rgba(98, 214, 255, 0.75);
            border-right: 1.5px solid rgba(98, 214, 255, 0.75);
            transform: translateY(-50%) rotate(45deg);
            opacity: 0.72;
          }
        }

        @media (max-width: 480px) {
          .dt-hero-actions .dt-button {
            min-height: 56px;
            padding: 0 16px;
            border-radius: 18px;
            font-size: 13.5px;
          }

          .dt-hero-actions .dt-button::after {
            width: 32px;
            height: 32px;
            flex-basis: 32px;
          }

          .dt-hero-proof {
            min-height: 40px;
            font-size: 11.5px;
          }
        }


        /* Mobile task 5: premium blueprint card, no letter-based icons */
        .dt-blueprint-icon svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dt-blueprint-icon-apps {
          color: #62d6ff;
        }

        .dt-blueprint-icon-data {
          color: #7df7e7;
        }

        .dt-blueprint-icon-control {
          color: #b8a8ff;
        }

        @media (max-width: 720px) {
          .dt-hero-card-wrap {
            margin-top: 2px;
          }

          .dt-product-card {
            position: relative;
            padding: 17px;
            border-radius: 30px;
            border-color: rgba(98, 214, 255, 0.22);
            background:
              radial-gradient(circle at 88% 8%, rgba(98, 214, 255, 0.2), transparent 12rem),
              radial-gradient(circle at 14% 96%, rgba(124, 92, 255, 0.18), transparent 12rem),
              linear-gradient(180deg, rgba(255, 255, 255, 0.095), rgba(255, 255, 255, 0.035)),
              rgba(7, 17, 31, 0.72);
            box-shadow:
              0 28px 78px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);
          }

          .dt-product-card::before {
            left: 24px;
            width: 118px;
            height: 3px;
          }

          .dt-product-top {
            margin-bottom: 13px;
          }

          .dt-product-dots span {
            width: 8px;
            height: 8px;
          }

          .dt-product-status {
            color: rgba(247, 251, 255, 0.8);
            padding: 6px 9px;
            font-size: 10.5px;
            font-weight: 850;
            letter-spacing: -0.01em;
          }

          .dt-blueprint-hero {
            min-height: 156px;
            padding: 19px;
            border-radius: 24px;
            background:
              radial-gradient(circle at 88% 18%, rgba(98, 214, 255, 0.24), transparent 8rem),
              linear-gradient(135deg, rgba(98, 214, 255, 0.15), rgba(124, 92, 255, 0.12)),
              rgba(255, 255, 255, 0.045);
          }

          .dt-blueprint-hero span {
            font-size: 10px;
            letter-spacing: 0.13em;
          }

          .dt-blueprint-hero h2 {
            max-width: 290px;
            margin-top: 11px;
            font-size: clamp(29px, 8vw, 40px);
            line-height: 0.98;
            letter-spacing: -0.07em;
          }

          .dt-blueprint-logo {
            width: 52px;
            height: 52px;
            border-radius: 18px;
            right: 15px;
            top: 15px;
          }

          .dt-blueprint-logo img {
            width: 35px;
            height: 35px;
          }

          .dt-blueprint-flow {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .dt-blueprint-node {
            min-height: auto;
            display: grid;
            grid-template-columns: 46px 1fr;
            grid-template-rows: auto auto;
            column-gap: 12px;
            row-gap: 4px;
            align-items: center;
            padding: 13px;
            border-radius: 20px;
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.032)),
              rgba(255, 255, 255, 0.035);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .dt-blueprint-icon {
            grid-row: 1 / span 2;
            width: 46px;
            height: 46px;
            border-radius: 16px;
            background:
              radial-gradient(circle at 50% 0%, rgba(98, 214, 255, 0.16), transparent 3.5rem),
              rgba(98, 214, 255, 0.08);
            border-color: rgba(98, 214, 255, 0.2);
            box-shadow:
              0 13px 34px rgba(0, 0, 0, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
            font-size: 0;
          }

          .dt-blueprint-icon svg {
            width: 23px;
            height: 23px;
          }

          .dt-blueprint-node strong {
            margin-top: 0;
            font-size: 20px;
            line-height: 1;
          }

          .dt-blueprint-node span {
            font-size: 10px;
            line-height: 1.15;
          }

          .dt-blueprint-list {
            gap: 9px;
            padding: 12px;
            border-radius: 22px;
          }

          .dt-blueprint-row {
            grid-template-columns: 38px 1fr auto;
            gap: 10px;
            padding: 10px;
            border-radius: 17px;
          }

          .dt-blueprint-row-icon {
            width: 38px;
            height: 38px;
            border-radius: 14px;
          }

          .dt-blueprint-row strong {
            font-size: 13px;
          }

          .dt-blueprint-row small {
            font-size: 11px;
            line-height: 1.25;
          }

          .dt-blueprint-pill {
            padding: 6px 8px;
            font-size: 10.5px;
          }
        }

        @media (max-width: 480px) {
          .dt-product-card {
            padding: 15px;
            border-radius: 28px;
          }

          .dt-blueprint-hero {
            min-height: 148px;
            padding: 17px;
          }

          .dt-blueprint-hero h2 {
            max-width: 250px;
            font-size: clamp(27px, 7.8vw, 36px);
          }

          .dt-blueprint-logo {
            width: 46px;
            height: 46px;
            border-radius: 16px;
          }

          .dt-blueprint-logo img {
            width: 31px;
            height: 31px;
          }

          .dt-blueprint-node {
            grid-template-columns: 42px 1fr;
            padding: 11px;
          }

          .dt-blueprint-icon {
            width: 42px;
            height: 42px;
            border-radius: 15px;
          }

          .dt-blueprint-icon svg {
            width: 21px;
            height: 21px;
          }

          .dt-blueprint-node strong {
            font-size: 18px;
          }

          .dt-blueprint-row {
            grid-template-columns: 36px 1fr;
          }

          .dt-blueprint-pill {
            grid-column: 2;
            width: fit-content;
          }
        }


        /* Task 6: make Darik Marketplace selected-work card clickable */
        .dt-work-card-link {
          display: block;
          color: inherit;
          text-decoration: none;
          cursor: pointer;
        }

        .dt-work-open {
          position: relative;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin-top: 22px;
          padding: 10px 12px;
          border-radius: 999px;
          color: #06101d;
          background: linear-gradient(135deg, #ffffff, #ffd83d);
          box-shadow:
            0 16px 42px rgba(255, 216, 61, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.34);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: -0.01em;
        }

        .dt-work-open span {
          color: inherit;
          font-size: 13px;
          letter-spacing: 0;
          text-transform: none;
          transition: transform 160ms ease;
        }

        .dt-work-card-link:hover .dt-work-open span {
          transform: translateX(3px);
        }

        @media (max-width: 720px) {
          .dt-work-open {
            width: 100%;
            justify-content: center;
            min-height: 44px;
            margin-top: 20px;
          }
        }


        /* Quick fix: selected-work Darik features button contrast */
        .dt-work-open {
          color: #ffd83d !important;
          background:
            radial-gradient(circle at 20% 0%, rgba(255, 216, 61, 0.18), transparent 4rem),
            linear-gradient(135deg, #141414, #050505) !important;
          border: 1px solid rgba(255, 216, 61, 0.42);
          box-shadow:
            0 18px 46px rgba(0, 0, 0, 0.18),
            0 0 28px rgba(255, 216, 61, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
          text-shadow: none !important;
        }

        .dt-work-open span {
          color: #ffffff !important;
          text-shadow: none !important;
        }

        .dt-work-card-link:hover .dt-work-open {
          border-color: rgba(255, 216, 61, 0.72);
          box-shadow:
            0 22px 56px rgba(0, 0, 0, 0.22),
            0 0 34px rgba(255, 216, 61, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.11) !important;
        }

        @media (max-width: 720px) {
          .dt-work-open {
            min-height: 46px;
            font-size: 12.5px;
          }
        }


        /* Task 21: clickable hero system tabs */
        .dt-hero-proof-nav {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          max-width: 820px;
          margin-top: 30px;
        }

        .dt-proof-link {
          position: relative;
          min-height: 74px;
          justify-content: flex-start;
          gap: 12px;
          padding: 12px 13px;
          border-radius: 23px;
          color: rgba(247, 251, 255, 0.92);
          text-decoration: none;
          background:
            radial-gradient(circle at 18% 0%, rgba(98, 214, 255, 0.13), transparent 7rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.03)),
            rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(98, 214, 255, 0.16);
          box-shadow:
            0 18px 52px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .dt-proof-link::before {
          display: none;
        }

        .dt-proof-link::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(98, 214, 255, 0.08), transparent 48%, rgba(124, 92, 255, 0.08));
          opacity: 0.85;
          pointer-events: none;
        }

        .dt-proof-link:hover {
          transform: translateY(-4px);
          border-color: rgba(98, 214, 255, 0.38);
          box-shadow:
            0 26px 70px rgba(0, 0, 0, 0.24),
            0 0 44px rgba(98, 214, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .dt-proof-link:active {
          transform: translateY(-1px) scale(0.99);
        }

        .dt-proof-backend {
          background:
            radial-gradient(circle at 18% 0%, rgba(125, 247, 231, 0.13), transparent 7rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.03)),
            rgba(255, 255, 255, 0.04);
          border-color: rgba(125, 247, 231, 0.15);
        }

        .dt-proof-workflow {
          background:
            radial-gradient(circle at 18% 0%, rgba(177, 108, 255, 0.15), transparent 7rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.03)),
            rgba(255, 255, 255, 0.04);
          border-color: rgba(177, 108, 255, 0.17);
        }

        .dt-proof-icon {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          flex: 0 0 44px;
          width: 44px;
          height: 44px;
          border-radius: 16px;
          color: #62d6ff;
          background:
            radial-gradient(circle at 50% 0%, rgba(98, 214, 255, 0.18), transparent 3.5rem),
            rgba(98, 214, 255, 0.08);
          border: 1px solid rgba(98, 214, 255, 0.2);
          box-shadow:
            0 14px 34px rgba(0, 0, 0, 0.16),
            0 0 24px rgba(98, 214, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .dt-proof-backend .dt-proof-icon {
          color: #7df7e7;
          background:
            radial-gradient(circle at 50% 0%, rgba(125, 247, 231, 0.16), transparent 3.5rem),
            rgba(125, 247, 231, 0.07);
          border-color: rgba(125, 247, 231, 0.18);
        }

        .dt-proof-workflow .dt-proof-icon {
          color: #b8a8ff;
          background:
            radial-gradient(circle at 50% 0%, rgba(184, 168, 255, 0.17), transparent 3.5rem),
            rgba(184, 168, 255, 0.07);
          border-color: rgba(184, 168, 255, 0.18);
        }

        .dt-proof-icon svg {
          width: 23px;
          height: 23px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dt-proof-copy {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 5px;
          min-width: 0;
        }

        .dt-proof-copy strong {
          display: block;
          color: rgba(247, 251, 255, 0.94);
          font-size: 13px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .dt-proof-copy small {
          display: block;
          color: rgba(247, 251, 255, 0.48);
          font-size: 10.5px;
          font-weight: 850;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        .dt-proof-arrow {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          flex: 0 0 28px;
          width: 28px;
          height: 28px;
          margin-left: auto;
          border-radius: 999px;
          color: #06101d;
          background: #62d6ff;
          box-shadow: 0 0 22px rgba(98, 214, 255, 0.24);
          font-size: 15px;
          font-weight: 950;
          line-height: 1;
          transition: transform 180ms ease;
        }

        .dt-proof-backend .dt-proof-arrow {
          background: #7df7e7;
          box-shadow: 0 0 22px rgba(125, 247, 231, 0.2);
        }

        .dt-proof-workflow .dt-proof-arrow {
          background: #b8a8ff;
          box-shadow: 0 0 22px rgba(184, 168, 255, 0.2);
        }

        .dt-proof-link:hover .dt-proof-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 980px) {
          .dt-hero-proof-nav {
            grid-template-columns: 1fr;
            max-width: 620px;
          }

          .dt-proof-link {
            min-height: 68px;
          }

          .dt-proof-copy strong {
            white-space: normal;
          }
        }

        @media (max-width: 720px) {
          .dt-hero-proof-nav {
            gap: 10px;
            margin-top: 18px;
          }

          .dt-proof-link {
            min-height: 66px;
            padding: 11px;
            border-radius: 21px;
          }

          .dt-proof-icon {
            flex-basis: 42px;
            width: 42px;
            height: 42px;
            border-radius: 15px;
          }

          .dt-proof-arrow {
            flex-basis: 26px;
            width: 26px;
            height: 26px;
          }
        }


        /* Fix: hero quick links now route to exact service-page sections + API card */
        .dt-hero-proof-nav {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1120px;
        }

        .dt-proof-api {
          background:
            radial-gradient(circle at 18% 0%, rgba(255, 216, 61, 0.15), transparent 7rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.03)),
            rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 216, 61, 0.18);
        }

        .dt-proof-api .dt-proof-icon {
          color: #ffd83d;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 216, 61, 0.18), transparent 3.5rem),
            rgba(255, 216, 61, 0.07);
          border-color: rgba(255, 216, 61, 0.2);
        }

        .dt-proof-api .dt-proof-arrow {
          background: #ffd83d;
          box-shadow: 0 0 22px rgba(255, 216, 61, 0.22);
        }

        @media (max-width: 1180px) {
          .dt-hero-proof-nav {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            max-width: 760px;
          }
        }

        @media (max-width: 720px) {
          .dt-hero-proof-nav {
            grid-template-columns: 1fr;
            max-width: 100%;
          }
        }


        /* Logo cleanup: remove icon boxes and let transparent logo sit flush */
        .dt-logo-mark,
        .dt-logo-mark-large,
        .dt-blueprint-logo,
        .dt-hero-brand-chip .dt-logo-mark,
        .dt-footer .dt-logo-mark,
        .dt-brand .dt-logo-mark {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          outline: 0 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          overflow: visible !important;
        }

        .dt-logo-mark::before,
        .dt-logo-mark::after,
        .dt-logo-mark-large::before,
        .dt-logo-mark-large::after,
        .dt-blueprint-logo::before,
        .dt-blueprint-logo::after {
          display: none !important;
          content: none !important;
        }

        .dt-logo-mark img,
        .dt-logo-mark-large img,
        .dt-blueprint-logo img {
          display: block;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.18));
        }

        .dt-brand .dt-logo-mark {
          width: 52px !important;
          height: 52px !important;
          flex: 0 0 52px !important;
        }

        .dt-hero-brand-chip .dt-logo-mark {
          width: 42px !important;
          height: 42px !important;
          flex: 0 0 42px !important;
        }

        .dt-footer .dt-logo-mark {
          width: 48px !important;
          height: 48px !important;
          flex: 0 0 48px !important;
        }

        @media (max-width: 720px) {
          .dt-brand .dt-logo-mark {
            width: 46px !important;
            height: 46px !important;
            flex-basis: 46px !important;
          }

          .dt-hero-brand-chip .dt-logo-mark {
            width: 38px !important;
            height: 38px !important;
            flex-basis: 38px !important;
          }
        }


        /* Logo size fix: double the new transparent logo */
        .dt-nav {
          padding-top: 18px !important;
          padding-bottom: 18px !important;
        }

        .dt-brand .dt-logo-mark {
          width: 104px !important;
          height: 104px !important;
          flex: 0 0 104px !important;
        }

        .dt-logo-mark-large {
          width: 132px !important;
          height: 132px !important;
          flex: 0 0 132px !important;
        }

        .dt-hero-brand-chip .dt-logo-mark {
          width: 84px !important;
          height: 84px !important;
          flex: 0 0 84px !important;
        }

        .dt-blueprint-logo {
          width: 132px !important;
          height: 132px !important;
        }

        .dt-footer .dt-logo-mark {
          width: 96px !important;
          height: 96px !important;
          flex: 0 0 96px !important;
        }

        .dt-logo-mark img,
        .dt-logo-mark-large img,
        .dt-blueprint-logo img {
          object-fit: contain !important;
        }

        @media (max-width: 720px) {
          .dt-nav {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }

          .dt-brand .dt-logo-mark {
            width: 92px !important;
            height: 92px !important;
            flex-basis: 92px !important;
          }

          .dt-logo-mark-large {
            width: 112px !important;
            height: 112px !important;
            flex-basis: 112px !important;
          }

          .dt-hero-brand-chip .dt-logo-mark {
            width: 76px !important;
            height: 76px !important;
            flex-basis: 76px !important;
          }

          .dt-blueprint-logo {
            width: 104px !important;
            height: 104px !important;
          }

          .dt-footer .dt-logo-mark {
            width: 86px !important;
            height: 86px !important;
            flex-basis: 86px !important;
          }
        }

        @media (max-width: 480px) {
          .dt-brand .dt-logo-mark {
            width: 82px !important;
            height: 82px !important;
            flex-basis: 82px !important;
          }

          .dt-hero-brand-chip .dt-logo-mark {
            width: 70px !important;
            height: 70px !important;
            flex-basis: 70px !important;
          }
        }


        /* Mobile-only ChatGPT signature polish: not just rings */
        @keyframes dt-mobile-aurora-drift {
          0%, 100% { background-position: 0% 50%, 100% 50%, 50% 50%; }
          50% { background-position: 100% 50%, 0% 50%, 50% 60%; }
        }

        @keyframes dt-mobile-scan-sweep {
          0% { transform: translateX(-130%) rotate(10deg); opacity: 0; }
          14% { opacity: 0.7; }
          54% { opacity: 0.22; }
          100% { transform: translateX(130%) rotate(10deg); opacity: 0; }
        }

        @keyframes dt-mobile-data-pulse {
          0%, 100% { opacity: 0.42; filter: drop-shadow(0 0 0 rgba(98, 214, 255, 0)); }
          50% { opacity: 1; filter: drop-shadow(0 0 14px rgba(98, 214, 255, 0.38)); }
        }

        @keyframes dt-mobile-card-breathe {
          0%, 100% { box-shadow: 0 18px 52px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255,255,255,0.1); }
          50% { box-shadow: 0 24px 66px rgba(98, 214, 255, 0.13), inset 0 1px 0 rgba(255,255,255,0.14); }
        }

        @media (max-width: 720px) {
          .dt-hero,
          .dt-service-card,
          .dt-process-card,
          .dt-work-card {
            background-size: 180% 180%, 160% 160%, auto !important;
            animation: dt-mobile-aurora-drift 14s ease-in-out infinite;
          }

          .dt-service-visual,
          .dt-hero-blueprint,
          .dt-work-visual,
          .dt-process-rail {
            position: relative;
            overflow: hidden;
          }

          .dt-service-visual::after,
          .dt-hero-blueprint::after,
          .dt-work-visual::after {
            content: "";
            position: absolute;
            top: -30%;
            bottom: -30%;
            width: 42%;
            left: 0;
            z-index: 8;
            background: linear-gradient(90deg, transparent, rgba(98, 214, 255, 0.26), rgba(255, 255, 255, 0.18), transparent);
            transform: translateX(-130%) rotate(10deg);
            animation: dt-mobile-scan-sweep 5.8s ease-in-out infinite;
            pointer-events: none;
            mix-blend-mode: screen;
          }

          .dt-service-card:nth-child(2) .dt-service-visual::after {
            background: linear-gradient(90deg, transparent, rgba(125, 247, 231, 0.24), rgba(255, 255, 255, 0.16), transparent);
            animation-delay: -1.4s;
          }

          .dt-service-card:nth-child(3) .dt-service-visual::after {
            background: linear-gradient(90deg, transparent, rgba(184, 168, 255, 0.24), rgba(255, 255, 255, 0.16), transparent);
            animation-delay: -2.8s;
          }

          .dt-service-card:nth-child(4) .dt-service-visual::after {
            background: linear-gradient(90deg, transparent, rgba(255, 216, 61, 0.24), rgba(255, 255, 255, 0.16), transparent);
            animation-delay: -4.2s;
          }

          .dt-proof-link,
          .dt-step-card,
          .dt-work-card {
            animation: dt-mobile-card-breathe 6s ease-in-out infinite;
          }

          .dt-proof-link:nth-child(2),
          .dt-step-card:nth-child(2),
          .dt-work-card:nth-child(2) {
            animation-delay: -2s;
          }

          .dt-proof-link:nth-child(3),
          .dt-step-card:nth-child(3),
          .dt-work-card:nth-child(3) {
            animation-delay: -4s;
          }

          .dt-proof-arrow,
          .dt-visual-bubble,
          .dt-floating-metric,
          .dt-status-pill,
          .dt-idea-dot {
            animation: dt-mobile-data-pulse 3.4s ease-in-out infinite;
          }

          .dt-dashboard-layout span,
          .dt-chart-bars span,
          .dt-phone-screen-grid span,
          .dt-plan-card span {
            animation: dt-mobile-data-pulse 4.4s ease-in-out infinite;
          }

          .dt-dashboard-layout span:nth-child(2),
          .dt-chart-bars span:nth-child(2),
          .dt-phone-screen-grid span:nth-child(2),
          .dt-plan-card span:nth-child(2) {
            animation-delay: -1.4s;
          }

          .dt-dashboard-layout span:nth-child(3),
          .dt-chart-bars span:nth-child(3),
          .dt-phone-screen-grid span:nth-child(3),
          .dt-plan-card span:nth-child(3) {
            animation-delay: -2.8s;
          }

          .dt-pill-link,
          .dt-button-primary,
          .dt-work-open {
            background-size: 220% 220% !important;
            animation: dt-mobile-aurora-drift 8s ease-in-out infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dt-hero,
          .dt-service-card,
          .dt-process-card,
          .dt-work-card,
          .dt-service-visual::after,
          .dt-hero-blueprint::after,
          .dt-work-visual::after,
          .dt-proof-link,
          .dt-step-card,
          .dt-proof-arrow,
          .dt-visual-bubble,
          .dt-floating-metric,
          .dt-status-pill,
          .dt-idea-dot,
          .dt-dashboard-layout span,
          .dt-chart-bars span,
          .dt-phone-screen-grid span,
          .dt-plan-card span,
          .dt-pill-link,
          .dt-button-primary,
          .dt-work-open {
            animation: none !important;
          }
        }


        /* Header quote CTA attention polish */
        @keyframes dt-header-cta-glow {
          0%, 100% {
            box-shadow:
              0 18px 48px rgba(98, 214, 255, 0.18),
              0 0 0 0 rgba(98, 214, 255, 0),
              inset 0 1px 0 rgba(255, 255, 255, 0.18);
          }
          50% {
            box-shadow:
              0 24px 66px rgba(98, 214, 255, 0.3),
              0 0 0 8px rgba(98, 214, 255, 0.07),
              inset 0 1px 0 rgba(255, 255, 255, 0.28);
          }
        }

        @keyframes dt-header-cta-shine {
          0% { transform: translateX(-145%) skewX(-18deg); opacity: 0; }
          16% { opacity: 0.82; }
          52% { opacity: 0.24; }
          100% { transform: translateX(145%) skewX(-18deg); opacity: 0; }
        }

        @keyframes dt-header-cta-comet {
          to { transform: rotate(360deg); }
        }

        @keyframes dt-mobile-menu-dot {
          0%, 100% { transform: scale(0.92); opacity: 0.55; }
          50% { transform: scale(1.14); opacity: 1; }
        }

        .dt-pill-link {
          position: relative;
          isolation: isolate;
          overflow: visible;
          color: #06101d !important;
          background:
            radial-gradient(circle at 22% 0%, rgba(255, 255, 255, 0.8), transparent 4.5rem),
            linear-gradient(135deg, #d9f7ff 0%, #62d6ff 46%, #b8a8ff 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.26) !important;
          animation: dt-header-cta-glow 4.6s ease-in-out infinite;
        }

        .dt-pill-link::before {
          content: "";
          position: absolute;
          inset: -8px;
          z-index: -1;
          border-radius: 999px;
          background:
            conic-gradient(
              from 0deg,
              transparent 0deg,
              transparent 48deg,
              rgba(98, 214, 255, 0.82) 76deg,
              rgba(125, 247, 231, 0.72) 104deg,
              transparent 138deg,
              transparent 360deg
            );
          opacity: 0.82;
          animation: dt-header-cta-comet 3.9s linear infinite;
          pointer-events: none;
        }

        .dt-pill-link::after {
          content: "";
          position: absolute;
          top: -42%;
          bottom: -42%;
          left: 0;
          z-index: 2;
          width: 38%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.48),
              rgba(255, 255, 255, 0.16),
              transparent
            );
          transform: translateX(-145%) skewX(-18deg);
          animation: dt-header-cta-shine 5.1s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .dt-pill-link:hover {
          transform: translateY(-2px);
          animation-duration: 2.8s;
        }

        .dt-pill-link:hover::after {
          animation-duration: 2.2s;
        }

        .dt-mobile-menu-button {
          position: relative;
          isolation: isolate;
          overflow: visible !important;
          border: 1px solid rgba(98, 214, 255, 0.26) !important;
          background:
            radial-gradient(circle at 22% 0%, rgba(98, 214, 255, 0.2), transparent 4rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.045)) !important;
          box-shadow:
            0 18px 44px rgba(98, 214, 255, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        }

        .dt-mobile-menu-button::before {
          content: "";
          position: absolute;
          inset: -7px;
          z-index: -1;
          border-radius: 999px;
          background:
            conic-gradient(
              from 0deg,
              transparent,
              rgba(98, 214, 255, 0.75),
              rgba(184, 168, 255, 0.58),
              transparent 42%,
              transparent
            );
          animation: dt-header-cta-comet 4.2s linear infinite;
          opacity: 0.76;
          pointer-events: none;
        }

        .dt-mobile-menu-button::after {
          content: "Quote";
          position: absolute;
          left: 50%;
          bottom: -19px;
          transform: translateX(-50%);
          color: rgba(247, 251, 255, 0.72);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .dt-mobile-menu-button span {
          background: #62d6ff !important;
          box-shadow: 0 0 14px rgba(98, 214, 255, 0.38);
          animation: dt-mobile-menu-dot 2.8s ease-in-out infinite;
        }

        .dt-mobile-menu-button span:nth-child(2) {
          animation-delay: -0.9s;
          background: #7df7e7 !important;
        }

        .dt-mobile-menu-button span:nth-child(3) {
          animation-delay: -1.8s;
          background: #b8a8ff !important;
        }

        @media (max-width: 720px) {
          .dt-pill-link {
            display: none;
          }

          .dt-mobile-menu-button {
            width: 50px !important;
            height: 50px !important;
            border-radius: 999px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dt-pill-link,
          .dt-pill-link::before,
          .dt-pill-link::after,
          .dt-mobile-menu-button::before,
          .dt-mobile-menu-button span {
            animation: none !important;
          }
        }

      `}</style>

      <div className="dt-grid-bg" aria-hidden="true" />

      <div className="dt-shell">
        <nav className="dt-nav" aria-label="Darik Technologies navigation">
          <a className="dt-brand" href="#top" aria-label="Darik Technologies home">
            <span className="dt-logo-mark" aria-hidden="true">
              <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
            </span>
            <span className="dt-brand-text">
              <strong>Darik Technologies</strong>
              <span>Business apps built properly</span>
            </span>
          </a>

          <div className="dt-nav-links">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a className="dt-pill-link" href={quoteHref}>
              Free quote
            </a>
          </div>

          <a className="dt-mobile-menu-button" href={quoteHref} aria-label="Start a free quote">
            <span />
            <span />
            <span />
          </a>
        </nav>

          <div className="dt-mobile-tabs" aria-label="Mobile quick navigation">
            <a className="dt-mobile-tab dt-mobile-tab-active" href="#services">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5.5h6.5v6.5H4z" />
                <path d="M13.5 5.5H20v6.5h-6.5z" />
                <path d="M4 15h6.5v3.5H4z" />
                <path d="M13.5 15H20v3.5h-6.5z" />
              </svg>
              <span>Services</span>
            </a>

            <a className="dt-mobile-tab" href="#work">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.5 7V5.8c0-1 0.8-1.8 1.8-1.8h3.4c1 0 1.8 0.8 1.8 1.8V7" />
                <path d="M4.8 7h14.4c1 0 1.8 0.8 1.8 1.8v8.4c0 1-0.8 1.8-1.8 1.8H4.8c-1 0-1.8-0.8-1.8-1.8V8.8C3 7.8 3.8 7 4.8 7z" />
                <path d="M3 11.2h18" />
                <path d="M10 12.5h4" />
              </svg>
              <span>Work</span>
            </a>

            <a className="dt-mobile-tab" href="#process">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path d="M17 21.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path d="M17 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path d="M9.8 6h4.4" />
                <path d="M8.9 9.9 15.1 15.6" />
              </svg>
              <span>Process</span>
            </a>

            <a className="dt-mobile-tab" href={quoteHref}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 4h8.2L19 8.3v10.2c0 0.8-0.7 1.5-1.5 1.5h-11c-0.8 0-1.5-0.7-1.5-1.5v-13C5 4.7 5.7 4 6.5 4z" />
                <path d="M14.5 4v4.5H19" />
                <path d="M8 12h8" />
                <path d="M8 15h5" />
              </svg>
              <span>Quote</span>
            </a>
          </div>

        <section className="dt-hero" id="top">
          <div className="dt-hero-left">
            <a className="dt-mobile-hero-strip" href={quoteHref} aria-label="Start a free quote">
              <span className="dt-mobile-hero-strip-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12.8 3.7c3.4.5 6 3.1 6.6 6.5l-4.1 4.1-4.7-.9-.9-4.7 3.1-5z" />
                  <path d="M9.2 9.2 5.5 11l3 1.5" />
                  <path d="M14.8 14.8 13 18.5l-1.5-3" />
                  <path d="M8.7 15.3 6.4 17.6" />
                </svg>
              </span>
              <span>Digital products built to move your business.</span>
              <span className="dt-mobile-hero-strip-arrow" aria-hidden="true">→</span>
            </a>

            <div className="dt-mobile-hero-kicker">
              <span aria-hidden="true">✦</span>
              Innovate • Build • Scale
            </div>

            <div className="dt-hero-brand-chip">
              <span className="dt-logo-mark" aria-hidden="true">
                <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
              </span>
              <div>
                <strong>Darik Technologies</strong>
                <span>Business app systems</span>
              </div>
            </div>

            <h1 className="dt-hero-title">
              Business apps built like <span className="dt-hero-title-mark">real companies</span> use them.
            </h1>

            <p className="dt-hero-copy">
              Mobile apps, dashboards, marketplaces, portals, databases, and backend logic built around the way your business actually works.
            </p>

            <div className="dt-hero-actions">
              <a className="dt-button dt-button-primary" href={quoteHref}>
                Start your free quote today
              </a>
              <a className="dt-button dt-button-secondary" href="#work">
                View selected work
              </a>
            </div>

            <div className="dt-hero-proof-row dt-hero-proof-nav" aria-label="Darik Technologies quick links">
              <a className="dt-hero-proof dt-proof-link dt-proof-mobile" href="/dariktech/services/mobile-web-admin">
                <span className="dt-proof-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7.2 4.5h6.4c1 0 1.8.8 1.8 1.8v11.4c0 1-.8 1.8-1.8 1.8H7.2c-1 0-1.8-.8-1.8-1.8V6.3c0-1 .8-1.8 1.8-1.8z" />
                    <path d="M8.6 7.5h3.8" />
                    <path d="M9.2 16.6h3.2" />
                    <path d="M17.2 8.2h2.2c.8 0 1.4.6 1.4 1.4v7c0 .8-.6 1.4-1.4 1.4h-2.2" />
                  </svg>
                </span>
                <span className="dt-proof-copy">
                  <strong>Mobile + web + admin</strong>
                  <small>Full product systems</small>
                </span>
                <span className="dt-proof-arrow" aria-hidden="true">→</span>
              </a>

              <a className="dt-hero-proof dt-proof-link dt-proof-backend" href="/dariktech/services/mobile-web-admin#architecture">
                <span className="dt-proof-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z" />
                    <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
                    <path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
                  </svg>
                </span>
                <span className="dt-proof-copy">
                  <strong>Backend + database</strong>
                  <small>Logic that actually works</small>
                </span>
                <span className="dt-proof-arrow" aria-hidden="true">→</span>
              </a>

              <a className="dt-hero-proof dt-proof-link dt-proof-workflow" href="/dariktech/services/mobile-web-admin#process">
                <span className="dt-proof-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M6 6.5h4.2v4.2H6z" />
                    <path d="M13.8 6.5H18v4.2h-4.2z" />
                    <path d="M9.8 15.2H14v4.2H9.8z" />
                    <path d="M10.2 8.6h3.6" />
                    <path d="m15.9 10.7-2.1 4.5" />
                    <path d="m8.1 10.7 2.1 4.5" />
                  </svg>
                </span>
                <span className="dt-proof-copy">
                  <strong>Built for real workflows</strong>
                  <small>Apps people can run daily</small>
                </span>
                <span className="dt-proof-arrow" aria-hidden="true">→</span>
              </a>

              <a className="dt-hero-proof dt-proof-link dt-proof-api" href="/dariktech/services/mobile-web-admin#api-integration">
                <span className="dt-proof-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8.2 9.2 5.4 12l2.8 2.8" />
                    <path d="m15.8 9.2 2.8 2.8-2.8 2.8" />
                    <path d="m13.4 7.2-2.8 9.6" />
                    <path d="M4.7 5.4h14.6c.8 0 1.5.7 1.5 1.5v10.2c0 .8-.7 1.5-1.5 1.5H4.7c-.8 0-1.5-.7-1.5-1.5V6.9c0-.8.7-1.5 1.5-1.5z" />
                  </svg>
                </span>
                <span className="dt-proof-copy">
                  <strong>API Integration</strong>
                  <small>Connect outside systems</small>
                </span>
                <span className="dt-proof-arrow" aria-hidden="true">→</span>
              </a>
            </div>

            <div className="dt-trust-row" aria-label="Darik Technologies approach">
              <div className="dt-stat">
                <strong>Plan</strong>
                <span>Map the idea, users, roles, and workflow before building.</span>
              </div>
              <div className="dt-stat">
                <strong>Build</strong>
                <span>App, dashboard, backend, database, and integrations together.</span>
              </div>
              <div className="dt-stat">
                <strong>Launch</strong>
                <span>Clean handoff, testing, and practical launch support.</span>
              </div>
            </div>
          </div>

          <div className="dt-hero-card-wrap" aria-hidden="true">
            <div className="dt-product-card">
              <div className="dt-product-top">
                <div className="dt-product-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="dt-product-status">System blueprint</div>
              </div>

              <div className="dt-hero-blueprint">
                <div className="dt-blueprint-hero">
                  <span>Product Command Center</span>
                  <h2>One connected product, not scattered screens.</h2>
                  <div className="dt-blueprint-logo">
                    <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
                  </div>
                </div>

                <div className="dt-blueprint-flow">
                  <div className="dt-blueprint-node">
                    <div className="dt-blueprint-icon dt-blueprint-icon-apps" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M7 4.5h10a1.8 1.8 0 0 1 1.8 1.8v11.4a1.8 1.8 0 0 1-1.8 1.8H7a1.8 1.8 0 0 1-1.8-1.8V6.3A1.8 1.8 0 0 1 7 4.5z" />
                        <path d="M9.4 7.5h5.2" />
                        <path d="M9 16.5h6" />
                        <path d="M10 10.5h4v3.2h-4z" />
                      </svg>
                    </div>
                    <strong>Apps</strong>
                    <span>Customer & staff</span>
                  </div>
                  <div className="dt-blueprint-node">
                    <div className="dt-blueprint-icon dt-blueprint-icon-data" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z" />
                        <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
                        <path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
                      </svg>
                    </div>
                    <strong>Data</strong>
                    <span>Backend logic</span>
                  </div>
                  <div className="dt-blueprint-node">
                    <div className="dt-blueprint-icon dt-blueprint-icon-control" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M4.5 6.5h15" />
                        <path d="M4.5 12h15" />
                        <path d="M4.5 17.5h15" />
                        <path d="M9 4.8v3.4" />
                        <path d="M15 10.3v3.4" />
                        <path d="M11.5 15.8v3.4" />
                      </svg>
                    </div>
                    <strong>Control</strong>
                    <span>Admin dashboard</span>
                  </div>
                </div>

                <div className="dt-blueprint-list">
                  {[
                    ["01", "Business workflow", "How users, orders, requests, and data move"],
                    ["02", "Admin operations", "The controls needed to manage the business"],
                    ["03", "Launch structure", "Clean product scope built to go live"],
                  ].map(([number, title, sub]) => (
                    <div className="dt-blueprint-row" key={title}>
                      <div className="dt-blueprint-row-icon">{number}</div>
                      <div>
                        <strong>{title}</strong>
                        <small>{sub}</small>
                      </div>
                      <div className="dt-blueprint-pill">Ready</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="dt-section dt-build-section" id="services">
        <div className="dt-shell dt-build-shell">
          <div className="dt-build-head">
            <div>
              <span className="dt-eyebrow">What we build</span>
              <h2 className="dt-build-title">
                Complete app <span className="dt-build-accent">systems</span>, not unfinished screens.
              </h2>
              <div className="dt-build-underline" aria-hidden="true" />
            </div>
            <p className="dt-build-copy">
              A serious app needs more than a pretty interface. It needs the right structure, roles, data, admin controls, notifications, and business logic behind it.
            </p>
          </div>

          <div className="dt-service-grid">
            {services.map((service) => (
              <article className={`dt-service-card dt-card-${service.eyebrow}`} key={service.title}>
                <div className="dt-service-badge" aria-label={`Service ${service.eyebrow}`}>
                  <div className="dt-service-number">{service.eyebrow}</div>
                  <div className="dt-service-badge-line" aria-hidden="true" />
                </div>
                <ServiceIllustration visual={service.visual} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="dt-service-chip-row" aria-label={`${service.title} features`}>
                  {service.chips.map((chip) => (
                    <span className="dt-service-chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
                <a className="dt-service-link" href={service.href}>
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dt-section" id="work">
        <div className="dt-shell">
          <div className="dt-section-head">
            <div>
              <span className="dt-eyebrow">Selected work</span>
              <h2>Built around real business use cases.</h2>
            </div>
            <p>
              These projects show the type of thinking I bring to client work: not just coding, but turning a business process into a usable product.
            </p>
          </div>

          <div className="dt-work-grid">
            {projects.map((project) => {
              const cardContent = (
                <div className="dt-work-content">
                  <div className="dt-work-topline">
                    <span className="dt-work-type">{project.type}</span>
                    <div className="dt-work-metric">
                      <strong>{project.metric}</strong>
                      <span>{project.metricLabel}</span>
                    </div>
                  </div>
                  <ProjectVisual visual={project.visual} />
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <div className="dt-tag-row">
                    {project.tags.map((tag) => (
                      <span className="dt-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.href ? (
                    <span className="dt-work-open">View Darik features <span aria-hidden="true">→</span></span>
                  ) : null}
                </div>
              );

              return project.href ? (
                <a className="dt-work-card dt-work-card-link" href={project.href} key={project.name}>
                  {cardContent}
                </a>
              ) : (
                <article className="dt-work-card" key={project.name}>
                  {cardContent}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dt-section">
        <div className="dt-shell">
          <div className="dt-proof">
            <div className="dt-proof-card">
              <div className="dt-proof-content">
                <span className="dt-eyebrow">Why it feels different</span>
                <h2>We think like founders, not just developers.</h2>
                <p>
                  We care about how the app will actually be used: who logs in, what each role sees, how orders or requests move, what admins need to control, what notifications matter, and what makes the product valuable after launch.
                </p>
              </div>

              <div className="dt-proof-system" aria-hidden="true">
                <div className="dt-system-line" />
                <div className="dt-system-line-vertical" />
                <div className="dt-system-node dt-system-node-one">Users</div>
                <div className="dt-system-node dt-system-node-two">Data</div>
                <div className="dt-system-node dt-system-node-three">Admin</div>
                <div className="dt-system-node dt-system-node-four">Launch</div>
                <div className="dt-system-core">Product</div>
              </div>

              <div className="dt-proof-mini-row">
                <div className="dt-proof-mini">
                  <strong>Roles</strong>
                  <span>Customer, staff, vendor, admin</span>
                </div>
                <div className="dt-proof-mini">
                  <strong>Logic</strong>
                  <span>Rules, states, workflows</span>
                </div>
                <div className="dt-proof-mini">
                  <strong>Growth</strong>
                  <span>Built with future changes in mind</span>
                </div>
              </div>
            </div>

            <div className="dt-capability-panel" aria-label="Capabilities and technology stack">
              <div className="dt-capability-head">
                <h3>The stack matters, but the workflow matters more.</h3>
                <p>Tools are chosen around the business model, not just what looks good in a portfolio.</p>
              </div>

              <div className="dt-capability-grid">
                {capabilityGroups.map((group, index) => (
                  <article className="dt-capability-card" key={group.title}>
                    <div className="dt-capability-icon">{String(index + 1).padStart(2, "0")}</div>
                    <h4>{group.title}</h4>
                    <p>{group.text}</p>
                    <div className="dt-capability-items">
                      {group.items.map((item) => (
                        <span className="dt-capability-item" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dt-section" id="process">
        <div className="dt-shell">
          <div className="dt-section-head">
            <div>
              <span className="dt-eyebrow">How we work</span>
              <h2>A clear process from idea to launch.</h2>
            </div>
            <p>
              The goal is to avoid confusion, wasted money, and half-built apps. Every project starts with the business logic and ends with something usable.
            </p>
          </div>

          <div className="dt-process-grid">
            {process.map((step) => (
              <article className="dt-process-card" key={step.title}>
                <div className="dt-process-top">
                  <div className="dt-process-number">{step.phase}</div>
                  <div className="dt-process-label">Phase</div>
                </div>
                <ProcessVisual visual={step.visual} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="dt-process-chip-row" aria-label={`${step.title} details`}>
                  {step.chips.map((chip) => (
                    <span className="dt-process-chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dt-section dt-quote-section" id="contact">
        <div className="dt-shell">
          <div className="dt-quote">
            <div className="dt-quote-content">
              <span className="dt-eyebrow">Start here</span>
              <h2>Have an app idea or business problem?</h2>
              <p>
                Send the idea, the business goal, and what the app needs to do. We can help shape it into a real product plan and build the launch version the right way.
              </p>

              <div className="dt-quote-actions">
                <a className="dt-button dt-button-primary" href={quoteHref}>
                  Start your free quote today
                </a>
                <span className="dt-quote-note">No pressure, just a clear project review</span>
              </div>
            </div>

            <div className="dt-quote-panel" aria-label="Free quote process">
              <div className="dt-quote-panel-top">
                <div className="dt-quote-panel-title">
                  <div className="dt-quote-icon">→</div>
                  <div>
                    <strong>Free quote flow</strong>
                    <span>Simple, serious, practical</span>
                  </div>
                </div>
                <div className="dt-quote-status">Open</div>
              </div>

              <div className="dt-quote-steps">
                <div className="dt-quote-step">
                  <div className="dt-quote-step-number">01</div>
                  <div>
                    <strong>Explain the idea</strong>
                    <span>What the app should do and who will use it.</span>
                  </div>
                </div>
                <div className="dt-quote-step">
                  <div className="dt-quote-step-number">02</div>
                  <div>
                    <strong>Map the system</strong>
                    <span>Apps, dashboard, backend, users, data, and workflow.</span>
                  </div>
                </div>
                <div className="dt-quote-step">
                  <div className="dt-quote-step-number">03</div>
                  <div>
                    <strong>Get a realistic scope</strong>
                    <span>Clear next steps before spending money on development.</span>
                  </div>
                </div>
              </div>

              <div className="dt-quote-mini-grid">
                <div className="dt-quote-mini">
                  <strong>Business-first</strong>
                  <span>Built around the workflow, not just the screens.</span>
                </div>
                <div className="dt-quote-mini">
                  <strong>Launch-minded</strong>
                  <span>Focused on what can actually go live.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="dt-shell dt-footer">
        <div className="dt-footer-left">
          <span className="dt-logo-mark" aria-hidden="true">
            <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
          </span>
          <div className="dt-footer-brand-copy">
            <strong>Darik Technologies</strong>
            <span>© {year}. Built for practical business apps.</span>
          </div>
        </div>

        <div className="dt-footer-links">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a className="dt-footer-quote" href={quoteHref}>
            Start your free quote
          </a>
        </div>
      </footer>
    </main>
  );
}