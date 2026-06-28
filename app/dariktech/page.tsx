export const metadata = {
  title: "Darik Technologies | Business Apps Built From Idea to Launch",
  description:
    "Darik Technologies builds mobile apps, web apps, dashboards, marketplaces, booking systems, ordering platforms, and internal business tools for real companies.",
};

const services = [
  {
    eyebrow: "01",
    title: "Mobile Apps",
    text: "Clean iOS and Android experiences for customers, staff, drivers, suppliers, bookings, ordering, and business workflows.",
  },
  {
    eyebrow: "02",
    title: "Web Apps & Dashboards",
    text: "Admin panels, operations portals, reporting tools, approval systems, user management, and internal company software.",
  },
  {
    eyebrow: "03",
    title: "Marketplaces & Platforms",
    text: "Multi-sided apps with customer flows, seller portals, quote requests, order tracking, notifications, and backend logic.",
  },
  {
    eyebrow: "04",
    title: "MVPs & Product Strategy",
    text: "I help turn rough ideas into clear feature plans, launch versions, user journeys, and products that make sense commercially.",
  },
];

const projects = [
  {
    name: "Darik Marketplace",
    type: "Retail marketplace platform",
    summary:
      "A marketplace experience built around product discovery, ordering, delivery flows, retailer operations, driver workflows, returns, and admin control.",
    tags: ["Marketplace", "Customer App", "Admin Dashboard", "Operations"],
  },
  {
    name: "PartBid",
    type: "Auto parts quote-request platform",
    summary:
      "A request-and-quote system that connects garages with suppliers, allowing businesses to receive multiple part offers in one organized workflow.",
    tags: ["B2B", "Quotes", "Supplier Portal", "Chat"],
  },
  {
    name: "Tawleh Manager",
    type: "Restaurant table ordering system",
    summary:
      "A QR-based dine-in ordering platform designed for restaurants that need table-level ordering, staff visibility, and simple branch operations.",
    tags: ["QR Ordering", "Restaurant Tech", "SaaS", "Reports"],
  },
  {
    name: "Business Operations Tools",
    type: "Internal automation systems",
    summary:
      "Custom dashboards and workflow tools for companies that need cleaner reporting, discrepancy tracking, approvals, and less manual paperwork.",
    tags: ["Automation", "Dashboards", "Reporting", "Databases"],
  },
];

const process = [
  {
    title: "Understand the business",
    text: "Before building screens, I map the actual problem, users, workflow, money flow, and operational requirements.",
  },
  {
    title: "Design the product flow",
    text: "I define the core features, user journeys, database needs, admin controls, and what should be included in the launch version.",
  },
  {
    title: "Build the real system",
    text: "The app, dashboard, backend, authentication, notifications, database, and logic are built as one connected product.",
  },
  {
    title: "Prepare for launch",
    text: "I focus on testing, cleanup, real-world use cases, and making sure the product is ready for customers or internal teams.",
  },
];

const capabilities = [
  "React Native",
  "Expo",
  "Next.js",
  "Supabase",
  "Firebase",
  "Admin Dashboards",
  "Database Design",
  "Authentication",
  "Push Notifications",
  "API Integration",
  "Marketplace Apps",
  "Booking Systems",
  "Ordering Systems",
  "Business Automation",
  "MVP Planning",
  "UI/UX Flows",
];

export default function DarikTechPage() {
  const quoteHref = "/dariktech/quote";
  const year = new Date().getFullYear();

  return (
    <main className="dt-page">
      <style>{`
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

        .dt-eyebrow {
          display: block;
          margin-bottom: 12px;
          color: var(--dt-accent);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .dt-service-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
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
          min-height: 265px;
          padding: 22px;
          border-radius: 28px;
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
        }

        .dt-service-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(98, 214, 255, 0.34);
        }

        .dt-service-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          color: #c9f4ff;
          background: rgba(98, 214, 255, 0.12);
          border: 1px solid rgba(98, 214, 255, 0.18);
          font-weight: 800;
        }

        .dt-service-card h3,
        .dt-work-card h3,
        .dt-process-card h3 {
          margin: 26px 0 10px;
          font-size: 21px;
          letter-spacing: -0.03em;
        }

        .dt-service-card p,
        .dt-work-card p,
        .dt-process-card p {
          margin: 0;
          color: var(--dt-muted);
          line-height: 1.62;
          font-size: 14px;
        }

        .dt-work-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .dt-work-card {
          position: relative;
          overflow: hidden;
          min-height: 304px;
          padding: 24px;
          border-radius: 30px;
        }

        .dt-work-card::before {
          content: "";
          position: absolute;
          inset: -120px -90px auto auto;
          width: 220px;
          height: 220px;
          border-radius: 999px;
          background: rgba(98, 214, 255, 0.13);
          filter: blur(6px);
        }

        .dt-work-card h3 {
          position: relative;
          margin-top: 14px;
          font-size: 28px;
        }

        .dt-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .dt-tag {
          padding: 8px 10px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.76);
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 12px;
        }

        .dt-proof {
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 18px;
          align-items: stretch;
        }

        .dt-proof-card {
          padding: 28px;
          border-radius: 32px;
          border: 1px solid rgba(98, 214, 255, 0.2);
          background:
            radial-gradient(circle at 20% 10%, rgba(98, 214, 255, 0.18), transparent 18rem),
            rgba(255, 255, 255, 0.065);
          box-shadow: var(--dt-shadow);
        }

        .dt-proof-card h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .dt-proof-card p {
          margin: 18px 0 0;
          color: var(--dt-muted);
          line-height: 1.7;
        }

        .dt-capability-grid {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          gap: 10px;
          padding: 24px;
          border-radius: 32px;
          border: 1px solid var(--dt-border);
          background: rgba(255, 255, 255, 0.055);
        }

        .dt-capability {
          padding: 11px 13px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          background: rgba(255, 255, 255, 0.07);
          color: rgba(247, 251, 255, 0.82);
          font-size: 13px;
        }

        .dt-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          counter-reset: process;
        }

        .dt-process-card {
          position: relative;
          min-height: 230px;
          padding: 22px;
          border-radius: 28px;
          counter-increment: process;
        }

        .dt-process-card::before {
          content: counter(process, decimal-leading-zero);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          border: 1px solid rgba(124, 92, 255, 0.24);
          background: rgba(124, 92, 255, 0.13);
          color: #d9d2ff;
          font-weight: 900;
        }

        .dt-process-card h3 {
          margin-top: 26px;
        }

        .dt-quote {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 28px;
          padding: clamp(24px, 5vw, 48px);
          border-radius: 36px;
          background:
            radial-gradient(circle at 90% 20%, rgba(98, 214, 255, 0.19), transparent 18rem),
            radial-gradient(circle at 18% 80%, rgba(124, 92, 255, 0.18), transparent 18rem),
            rgba(255, 255, 255, 0.075);
        }

        .dt-quote h2 {
          margin: 0;
          max-width: 780px;
          font-size: clamp(32px, 5vw, 62px);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .dt-quote p {
          max-width: 700px;
          margin: 18px 0 0;
          color: var(--dt-muted);
          line-height: 1.7;
        }

        .dt-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          padding: 34px 0 46px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--dt-faint);
          font-size: 14px;
        }

        .dt-footer-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .dt-footer .dt-logo-mark {
          width: 34px;
          height: 34px;
          flex-basis: 34px;
          border-radius: 12px;
          padding: 5px;
        }

        .dt-footer a {
          color: var(--dt-text);
          text-decoration: none;
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

          .dt-section-head {
            align-items: start;
            flex-direction: column;
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
      `}</style>

      <div className="dt-grid-bg" aria-hidden="true" />

      <div className="dt-shell">
        <nav className="dt-nav" aria-label="Darik Technologies navigation">
          <a className="dt-brand" href="#top" aria-label="Darik Technologies home">
            <span className="dt-logo-mark" aria-hidden="true">
              <img src="/dariktech/logo.png" alt="" />
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
        </nav>

        <section className="dt-hero" id="top">
          <div>
            <div className="dt-kicker">Founder-led app development studio</div>
            <h1>
              I build business apps that feel like <span className="dt-gradient-text">real products.</span>
            </h1>
            <p className="dt-hero-copy">
              Darik Technologies is not just code-for-hire. I help businesses turn rough ideas into polished mobile apps, web apps, dashboards, marketplaces, and internal tools with the flow, backend, and launch details thought through from day one.
            </p>

            <div className="dt-hero-actions">
              <a className="dt-button dt-button-primary" href={quoteHref}>
                Start your free quote today
              </a>
              <a className="dt-button dt-button-secondary" href="#work">
                View selected work
              </a>
            </div>

            <div className="dt-trust-row" aria-label="Darik Technologies highlights">
              <div className="dt-stat">
                <strong>End-to-end</strong>
                <span>Planning, app, backend, dashboard, database, and launch flow.</span>
              </div>
              <div className="dt-stat">
                <strong>Business-first</strong>
                <span>Built around operations, revenue, users, and real workflows.</span>
              </div>
              <div className="dt-stat">
                <strong>Launch-ready</strong>
                <span>Designed for real customers, staff, suppliers, and admins.</span>
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
                <div className="dt-product-status">Live product thinking</div>
              </div>

              <div className="dt-dashboard">
                <div className="dt-dash-hero">
                  <div className="dt-dash-brand">
                    <div className="dt-dash-brand-copy">
                      <span>Product Command Center</span>
                      <h2>Apps, dashboards, and operations in one system.</h2>
                    </div>
                    <div className="dt-logo-mark dt-logo-mark-large">
                      <img src="/dariktech/logo.png" alt="" />
                    </div>
                  </div>
                </div>

                <div className="dt-mini-grid">
                  <div className="dt-mini-card">
                    <span>Customer Flow</span>
                    <strong>Clean UX</strong>
                  </div>
                  <div className="dt-mini-card">
                    <span>Backend Logic</span>
                    <strong>Real Data</strong>
                  </div>
                </div>

                <div className="dt-screen-list">
                  {[
                    ["A", "Admin Dashboard", "Manage the business"],
                    ["M", "Mobile App", "Customer and staff flows"],
                    ["D", "Database", "Structured for growth"],
                  ].map(([letter, title, sub]) => (
                    <div className="dt-screen-row" key={title}>
                      <div className="dt-screen-icon">{letter}</div>
                      <div>
                        <strong>{title}</strong>
                        <small>{sub}</small>
                      </div>
                      <div className="dt-chip">Ready</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="dt-section" id="services">
        <div className="dt-shell">
          <div className="dt-section-head">
            <div>
              <span className="dt-eyebrow">What I build</span>
              <h2>Complete app systems, not unfinished screens.</h2>
            </div>
            <p>
              A serious app needs more than a pretty interface. It needs the right structure, roles, data, admin controls, notifications, and business logic behind it.
            </p>
          </div>

          <div className="dt-service-grid">
            {services.map((service) => (
              <article className="dt-service-card" key={service.title}>
                <div className="dt-service-number">{service.eyebrow}</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
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
            {projects.map((project) => (
              <article className="dt-work-card" key={project.name}>
                <span>{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <div className="dt-tag-row">
                  {project.tags.map((tag) => (
                    <span className="dt-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dt-section">
        <div className="dt-shell">
          <div className="dt-proof">
            <div className="dt-proof-card">
              <span className="dt-eyebrow">Why it feels different</span>
              <h2>I think like a founder, not just a developer.</h2>
              <p>
                I care about how the app will actually be used: who logs in, what each role sees, how orders or requests move, what admins need to control, what notifications matter, and what makes the product valuable after launch.
              </p>
            </div>

            <div className="dt-capability-grid" aria-label="Capabilities and technology stack">
              {capabilities.map((capability) => (
                <span className="dt-capability" key={capability}>
                  {capability}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dt-section" id="process">
        <div className="dt-shell">
          <div className="dt-section-head">
            <div>
              <span className="dt-eyebrow">How I work</span>
              <h2>A clear process from idea to launch.</h2>
            </div>
            <p>
              The goal is to avoid confusion, wasted money, and half-built apps. Every project starts with the business logic and ends with something usable.
            </p>
          </div>

          <div className="dt-process-grid">
            {process.map((step) => (
              <article className="dt-process-card" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dt-section" id="contact">
        <div className="dt-shell">
          <div className="dt-quote">
            <div>
              <span className="dt-eyebrow">Start here</span>
              <h2>Have an app idea or business problem?</h2>
              <p>
                Send the idea, the business goal, and what the app needs to do. I can help shape it into a real product plan and build the launch version the right way.
              </p>
            </div>
            <a className="dt-button dt-button-primary" href={quoteHref}>
              Start your free quote today
            </a>
          </div>
        </div>
      </section>

      <footer className="dt-shell dt-footer">
        <div className="dt-footer-left">
          <span className="dt-logo-mark" aria-hidden="true">
            <img src="/dariktech/logo.png" alt="" />
          </span>
          <div>© {year} Darik Technologies. Built for practical business apps.</div>
        </div>
        <a href={quoteHref}>Start your free quote</a>
      </footer>
    </main>
  );
}