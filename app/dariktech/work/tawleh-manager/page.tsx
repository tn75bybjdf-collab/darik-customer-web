import type { Metadata } from "next";
import Link from "next/link";

const quoteHref =
  "mailto:jjasaleh14@aol.com?subject=Tawleh%20Manager%20Style%20System%20Quote&body=Hi%20Jihad%2C%0A%0AI%20want%20a%20free%20quote%20for%20a%20restaurant%20ordering%20system%20or%20business%20software.%0A%0ABusiness%20type%3A%0ABranches%3A%0AImportant%20features%3A%0ATimeline%3A%0A";

const siteUrl = "https://getdarik.com";
const pagePath = "/dariktech/work/tawleh-manager";
const pageUrl = `${siteUrl}${pagePath}`;

export const metadata: Metadata = {
  title: "Tawleh Manager Case Study | QR Restaurant Ordering System",
  description:
    "Tawleh Manager case study by Darik Technologies — a QR table ordering, digital menu, restaurant dashboard, service request, billing, and branch operations system.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Tawleh Manager | Professional QR Restaurant Ordering Case Study",
    description:
      "A polished Darik Technologies case study for a QR table ordering system with customer menus, guest names, staff context, service requests, billing status, and dashboard controls.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
  },
  keywords: [
    "Tawleh Manager",
    "QR restaurant ordering system Jordan",
    "restaurant ordering app Jordan",
    "QR menu system Jordan",
    "digital menu Jordan",
    "restaurant dashboard Jordan",
    "restaurant SaaS Jordan",
    "table ordering system Jordan",
    "waiter service request system",
    "Darik Technologies portfolio",
  ],
};

const heroStats = [
  {
    value: "QR",
    label: "table and location ordering",
  },
  {
    value: "Guest",
    label: "name, order, bill, service",
  },
  {
    value: "Dashboard",
    label: "menu, QR, billing, branches",
  },
];

const modules = [
  {
    eyebrow: "Customer menu",
    title: "Scan the table QR and order without downloading an app.",
    text:
      "The guest lands on a clean customer menu attached to the exact table or location. They enter their name, browse categories, add items, view the bill, and request service.",
    chips: ["QR scan", "Guest name", "Menu categories", "Bill tab"],
    visual: "customer",
  },
  {
    eyebrow: "Manager dashboard",
    title: "Restaurants control menus, QR locations, account status, and onboarding.",
    text:
      "The business dashboard is designed for restaurant profile setup, menu management, location/table links, QR printing, branch details, service status, and subscription visibility.",
    chips: ["Menu control", "QR print", "Branch setup", "Billing state"],
    visual: "dashboard",
  },
  {
    eyebrow: "Service flow",
    title: "Customers can request waiter, water, napkins, charcoal, or help.",
    text:
      "Tawleh Manager is not just a digital menu. It creates service moments that staff can act on, giving restaurants cleaner context than a customer waving across the room.",
    chips: ["Waiter", "Water", "Napkins", "Charcoal"],
    visual: "service",
  },
  {
    eyebrow: "Restaurant SaaS",
    title: "Built like a repeatable product, not a one-off restaurant website.",
    text:
      "The structure supports onboarding, approval, service expiry, payment due messaging, branch information, business settings, and a reusable product model for restaurants and cafes.",
    chips: ["SaaS", "Approval", "Subscription", "Multi-branch"],
    visual: "backend",
  },
];

const features = [
  {
    title: "Public QR menu",
    text: "A customer-facing menu optimized for phone screens, table context, and fast ordering.",
    tags: ["Mobile first", "No download"],
  },
  {
    title: "Table/location context",
    text: "Orders can be tied to table labels or locations so the restaurant knows where the request came from.",
    tags: ["Tables", "Locations"],
  },
  {
    title: "Guest name capture",
    text: "The system asks who is ordering so staff can connect the order to the right customer at the table.",
    tags: ["Customer name", "Order context"],
  },
  {
    title: "Menu categories",
    text: "Food and drink categories can be presented visually with photos, pricing, details, and availability.",
    tags: ["Categories", "Photos"],
  },
  {
    title: "Service requests",
    text: "Customers can ask for waiter, water, napkins, charcoal, or help directly from the QR menu.",
    tags: ["Service", "Staff action"],
  },
  {
    title: "Bill screen",
    text: "A clean bill view helps guests understand the current order before sending or asking for service.",
    tags: ["Bill", "Total"],
  },
  {
    title: "QR printing flow",
    text: "The dashboard can support printable QR cards for each table or location.",
    tags: ["Print", "QR links"],
  },
  {
    title: "Business profile",
    text: "Restaurant name, branch, logo, welcome copy, contact info, and location information can be managed.",
    tags: ["Profile", "Branding"],
  },
  {
    title: "Subscription status",
    text: "Billing and access logic can show active, due, expired, or suspended service states.",
    tags: ["Billing", "Expiry"],
  },
];

const timeline = [
  {
    step: "01",
    title: "Restaurant creates its account",
    text: "The business profile is set up with restaurant details, branch, logo, contact info, welcome copy, and operating context.",
  },
  {
    step: "02",
    title: "Menu and QR locations are prepared",
    text: "Managers add menu categories and items, then create table or location QR links that can be printed and placed in the restaurant.",
  },
  {
    step: "03",
    title: "Customer scans and enters name",
    text: "The customer opens the public menu from the QR, confirms the table or location, enters their name, and begins ordering.",
  },
  {
    step: "04",
    title: "Order and service context reaches staff",
    text: "The business gets clearer context: which table, which customer, what they ordered, and what service they requested.",
  },
  {
    step: "05",
    title: "Restaurant manages the system",
    text: "Owners or staff can adjust menu content, QR locations, account info, branch settings, billing state, and service availability.",
  },
];

const businessValue = [
  {
    title: "Less waiter pressure",
    text: "Customers can start orders and service requests from the table, reducing the amount of repeated manual waiter interaction.",
  },
  {
    title: "Cleaner table context",
    text: "The system gives staff table/location and customer-name context instead of vague requests.",
  },
  {
    title: "Faster menu updates",
    text: "Restaurants can change items, prices, photos, and availability without reprinting full physical menus.",
  },
  {
    title: "Productized revenue",
    text: "Tawleh Manager can be sold as a monthly restaurant SaaS product, not only as a custom one-time build.",
  },
];

function ModuleVisual({ visual }: { visual: string }) {
  if (visual === "customer") {
    return (
      <div className="tm-visual tm-customer-visual" aria-hidden="true">
        <div className="tm-phone">
          <div className="tm-phone-head">
            <span>Table 7</span>
            <strong>Tawleh</strong>
          </div>
          <div className="tm-welcome">
            <i>Welcome</i>
            <strong>Start ordering</strong>
            <span>Enter your name to continue.</span>
          </div>
          <div className="tm-name-pill">
            <span>👤</span>
            <strong>Jihad</strong>
            <em>→</em>
          </div>
          <div className="tm-category-grid">
            <div>🥘<strong>Mains</strong></div>
            <div>🥗<strong>Salads</strong></div>
            <div>☕<strong>Drinks</strong></div>
            <div>🍰<strong>Dessert</strong></div>
          </div>
          <div className="tm-tabs">
            <span>Menu</span>
            <span>Bill</span>
            <span>Service</span>
          </div>
        </div>
        <div className="tm-float tm-float-one">
          <strong>No app download</strong>
          <span>customer opens from QR</span>
        </div>
      </div>
    );
  }

  if (visual === "dashboard") {
    return (
      <div className="tm-visual tm-dashboard-visual" aria-hidden="true">
        <div className="tm-dashboard">
          <div className="tm-dashboard-head">
            <span>Restaurant Admin</span>
            <strong>Live</strong>
          </div>
          <div className="tm-dashboard-card">
            <strong>QR Locations</strong>
            <span>Table 1 • Table 2 • Garden • Rooftop</span>
          </div>
          <div className="tm-dashboard-row">
            <i>Menu</i>
            <i>Orders</i>
            <i>Billing</i>
          </div>
          <div className="tm-qr-card">
            <div />
            <strong>Print QR card</strong>
          </div>
        </div>
      </div>
    );
  }

  if (visual === "service") {
    return (
      <div className="tm-visual tm-service-visual" aria-hidden="true">
        <div className="tm-service-panel">
          <div className="tm-service-title">
            <span>Service request</span>
            <strong>Table 7</strong>
          </div>
          <div className="tm-request-grid">
            <div><span>🙋</span><strong>Waiter</strong></div>
            <div><span>💧</span><strong>Water</strong></div>
            <div><span>🧻</span><strong>Napkins</strong></div>
            <div><span>🔥</span><strong>Charcoal</strong></div>
          </div>
          <div className="tm-staff-alert">
            <span>New request</span>
            <strong>Water for Jihad — Table 7</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-visual tm-backend-visual" aria-hidden="true">
      <div className="tm-hub">
        <strong>Tawleh</strong>
        <span>Restaurant SaaS</span>
      </div>
      <div className="tm-ring tm-ring-one" />
      <div className="tm-ring tm-ring-two" />
      <div className="tm-node tm-node-one">QR</div>
      <div className="tm-node tm-node-two">Menu</div>
      <div className="tm-node tm-node-three">Orders</div>
      <div className="tm-node tm-node-four">Service</div>
      <div className="tm-node tm-node-five">Billing</div>
      <div className="tm-node tm-node-six">Branches</div>
    </div>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Darik Technologies",
      url: `${siteUrl}/dariktech`,
      logo: `${siteUrl}/dariktech/logo.png`,
      email: "jjasaleh14@aol.com",
      areaServed: [
        {
          "@type": "Country",
          name: "Jordan",
        },
        {
          "@type": "City",
          name: "Amman",
        },
      ],
      knowsAbout: [
        "QR restaurant ordering systems",
        "digital menu systems",
        "restaurant dashboards",
        "mobile app development",
        "admin dashboards",
        "business software",
      ],
    },
    {
      "@type": "CreativeWork",
      "@id": `${pageUrl}#case-study`,
      name: "Tawleh Manager Case Study",
      url: pageUrl,
      creator: {
        "@id": `${siteUrl}/#organization`,
      },
      about: [
        "QR restaurant ordering",
        "restaurant dashboard",
        "table ordering",
        "digital menus",
        "service requests",
        "restaurant SaaS",
      ],
      description:
        "A Darik Technologies case study for Tawleh Manager, a QR table ordering and restaurant management system.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${pageUrl}#software`,
      name: "Tawleh Manager",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      creator: {
        "@id": `${siteUrl}/#organization`,
      },
      featureList: [
        "QR table ordering",
        "Customer name entry",
        "Digital menu categories",
        "Restaurant service requests",
        "Bill screen",
        "QR printing",
        "Restaurant dashboard",
        "Billing status",
      ],
      url: pageUrl,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Darik Technologies",
          item: `${siteUrl}/dariktech`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Portfolio",
          item: `${siteUrl}/dariktech/portfolio`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Tawleh Manager",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function TawlehManagerCaseStudyPage() {
  const year = new Date().getFullYear();

  return (
    <main className="tm-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        :root {
          --tm-brown: #bd5338;
          --tm-brown-2: #d36d47;
          --tm-cream: #f4c99f;
          --tm-gold: #ffd27a;
          --tm-green: #22c55e;
          --tm-ink: #170d09;
          --tm-deep: #0f0907;
          --tm-text: #fffaf4;
          --tm-muted: rgba(255, 250, 244, 0.68);
          --tm-faint: rgba(255, 250, 244, 0.48);
          --tm-line: rgba(255, 255, 255, 0.11);
          --tm-card: rgba(255, 255, 255, 0.066);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--tm-deep);
        }

        .tm-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--tm-text);
          background:
            radial-gradient(circle at 11% 3%, rgba(211, 109, 71, 0.36), transparent 27rem),
            radial-gradient(circle at 92% 12%, rgba(255, 210, 122, 0.14), transparent 29rem),
            radial-gradient(circle at 50% 92%, rgba(244, 201, 159, 0.12), transparent 34rem),
            linear-gradient(180deg, #170d09 0%, #24120d 48%, #0f0907 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .tm-grid-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          opacity: 0.24;
          background-image:
            linear-gradient(rgba(255,255,255,0.052) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.052) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
          pointer-events: none;
        }

        .tm-shell {
          position: relative;
          z-index: 1;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .tm-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          min-height: 88px;
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          backdrop-filter: blur(16px);
        }

        .tm-brand,
        .tm-nav-links,
        .tm-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .tm-brand,
        .tm-footer-brand {
          color: #ffffff;
          text-decoration: none;
        }

        .tm-logo {
          display: grid;
          place-items: center;
          width: 82px;
          height: 82px;
          flex: 0 0 82px;
        }

        .tm-logo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 14px 32px rgba(211, 109, 71, 0.22));
        }

        .tm-brand strong,
        .tm-footer-brand strong {
          display: block;
          font-size: 14px;
          line-height: 1;
        }

        .tm-brand span,
        .tm-footer-brand span {
          display: block;
          margin-top: 4px;
          color: rgba(255, 250, 244, 0.52);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .tm-nav-links a {
          color: rgba(255, 250, 244, 0.72);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          transition: color 180ms ease, transform 180ms ease;
        }

        .tm-nav-links a:hover {
          color: #ffffff;
          transform: translateY(-1px);
        }

        .tm-nav-cta {
          position: relative;
          isolation: isolate;
          min-height: 38px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          color: #24120d !important;
          background: linear-gradient(135deg, #fff5e8, #f4c99f 48%, #d36d47);
          box-shadow: 0 18px 48px rgba(244, 201, 159, 0.18);
          overflow: visible;
        }

        .tm-nav-cta::before {
          content: "";
          position: absolute;
          inset: -7px;
          z-index: -1;
          border-radius: 999px;
          background: conic-gradient(from 0deg, transparent, rgba(244, 201, 159, 0.72), rgba(211, 109, 71, 0.56), transparent 42%, transparent);
          animation: tm-spin 4.2s linear infinite;
        }

        .tm-hero {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(400px, 0.76fr);
          gap: clamp(34px, 6vw, 78px);
          align-items: center;
          padding: 42px 0 86px;
        }

        .tm-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          min-height: 42px;
          padding: 0 15px;
          border-radius: 999px;
          color: rgba(255, 250, 244, 0.78);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.035)),
            rgba(255,255,255,0.05);
          border: 1px solid rgba(244, 201, 159, 0.2);
          box-shadow: 0 18px 50px rgba(0,0,0,0.18);
          font-size: 12px;
          font-weight: 950;
        }

        .tm-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--tm-green);
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
        }

        .tm-hero h1 {
          max-width: 780px;
          margin: 20px 0 0;
          font-size: clamp(52px, 6.4vw, 92px);
          line-height: 0.92;
          letter-spacing: -0.078em;
        }

        .tm-gradient {
          color: transparent;
          background: linear-gradient(135deg, #fff5e8, #f4c99f 46%, #d36d47);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .tm-hero-copy {
          max-width: 680px;
          margin: 22px 0 0;
          color: rgba(255, 250, 244, 0.72);
          font-size: 18px;
          line-height: 1.62;
        }

        .tm-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .tm-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 950;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .tm-button:hover {
          transform: translateY(-2px);
        }

        .tm-button-primary {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          color: #24120d;
          background: linear-gradient(135deg, #fff5e8, #f4c99f 45%, #d36d47);
          box-shadow: 0 24px 70px rgba(244, 201, 159, 0.24);
          animation: tm-cta-glow 4.8s ease-in-out infinite;
        }

        .tm-button-primary::after {
          content: "";
          position: absolute;
          top: -42%;
          bottom: -42%;
          left: 0;
          width: 38%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.48), transparent);
          transform: translateX(-145%) skewX(-18deg);
          animation: tm-shine 5.2s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .tm-button-secondary {
          color: rgba(255, 250, 244, 0.86);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.11);
        }

        .tm-proof-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          max-width: 760px;
          margin-top: 30px;
        }

        .tm-proof {
          min-height: 104px;
          padding: 18px;
          border-radius: 26px;
          background:
            radial-gradient(circle at 86% 8%, rgba(244, 201, 159, 0.16), transparent 9rem),
            linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.035));
          border: 1px solid rgba(255,255,255,0.105);
          box-shadow: 0 20px 58px rgba(0,0,0,0.18);
        }

        .tm-proof strong {
          display: block;
          font-size: 24px;
          letter-spacing: -0.06em;
        }

        .tm-proof span {
          display: block;
          margin-top: 7px;
          color: rgba(255, 250, 244, 0.58);
          font-size: 12px;
          font-weight: 780;
          line-height: 1.35;
        }

        .tm-hero-stage {
          position: relative;
          min-height: 620px;
          border-radius: 42px;
          background:
            radial-gradient(circle at 70% 18%, rgba(244, 201, 159, 0.2), transparent 15rem),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.032));
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow: 0 42px 120px rgba(0,0,0,0.28);
          overflow: hidden;
        }

        .tm-stage-grid {
          position: absolute;
          inset: 0;
          opacity: 0.24;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(circle at center, black, transparent 78%);
        }

        .tm-main-phone {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 302px;
          min-height: 544px;
          transform: translate(-50%, -50%) rotate(-2deg);
          border-radius: 42px;
          padding: 15px;
          background:
            linear-gradient(180deg, rgba(255, 250, 242, 0.96), rgba(242, 223, 203, 0.96)),
            #f3dfc9;
          color: #35251d;
          box-shadow: 0 34px 90px rgba(0,0,0,0.34);
          border: 1px solid rgba(255,255,255,0.4);
        }

        .tm-main-phone::before {
          content: "";
          display: block;
          width: 78px;
          height: 7px;
          border-radius: 999px;
          background: rgba(53, 37, 29, 0.16);
          margin: 4px auto 16px;
        }

        .tm-table-card,
        .tm-menu-card,
        .tm-order-card,
        .tm-mini-admin {
          border: 1px solid rgba(157, 117, 82, 0.14);
          background: rgba(255,255,255,0.78);
          box-shadow: 0 15px 34px rgba(73, 49, 30, 0.1);
        }

        .tm-table-card {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          border-radius: 24px;
          padding: 12px;
        }

        .tm-table-icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, var(--tm-brown-2), var(--tm-brown));
          font-weight: 950;
        }

        .tm-table-card span {
          display: block;
          color: rgba(53,37,29,0.58);
          font-size: 11px;
          font-weight: 850;
        }

        .tm-table-card strong {
          display: block;
          margin-top: 2px;
          color: #35251d;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .tm-table-card b {
          color: var(--tm-brown);
          font-size: 24px;
          line-height: 1;
        }

        .tm-menu-card {
          margin-top: 12px;
          border-radius: 26px;
          padding: 14px;
        }

        .tm-menu-card h3 {
          margin: 0 0 10px;
          color: #35251d;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .tm-mini-cats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .tm-mini-cats div {
          min-height: 82px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px;
          border-radius: 18px;
          background: #fff8ef;
          border: 1px solid rgba(157, 117, 82, 0.1);
        }

        .tm-mini-cats span {
          font-size: 24px;
        }

        .tm-mini-cats strong {
          color: #35251d;
          font-size: 13px;
        }

        .tm-order-card {
          margin-top: 12px;
          border-radius: 24px;
          padding: 12px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
        }

        .tm-order-card strong {
          display: block;
          color: #35251d;
          font-size: 14px;
        }

        .tm-order-card span {
          display: block;
          margin-top: 2px;
          color: rgba(53,37,29,0.58);
          font-size: 11px;
        }

        .tm-order-card button {
          border: 0;
          border-radius: 999px;
          padding: 10px 12px;
          color: #fff;
          background: linear-gradient(135deg, var(--tm-brown-2), var(--tm-brown));
          font-weight: 950;
        }

        .tm-mini-admin {
          position: absolute;
          right: 28px;
          bottom: 38px;
          width: 245px;
          border-radius: 26px;
          padding: 16px;
          background: rgba(17, 12, 9, 0.86);
          color: #fffaf4;
          border-color: rgba(255,255,255,0.12);
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.32);
        }

        .tm-mini-admin small {
          display: block;
          color: var(--tm-cream);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .tm-mini-admin-row {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .tm-mini-admin-row i {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(244, 201, 159, 0.13);
          font-style: normal;
        }

        .tm-mini-admin-row strong {
          display: block;
          font-size: 13px;
        }

        .tm-mini-admin-row span {
          color: rgba(255,250,244,0.56);
          font-size: 11px;
        }

        .tm-mini-admin-row b {
          color: var(--tm-green);
          font-size: 11px;
        }

        .tm-float {
          position: absolute;
          display: grid;
          gap: 4px;
          min-width: 188px;
          padding: 16px;
          border-radius: 24px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.13);
          backdrop-filter: blur(18px);
          box-shadow: 0 22px 70px rgba(0,0,0,0.24);
        }

        .tm-float strong {
          color: #ffffff;
          font-size: 14px;
        }

        .tm-float span {
          color: rgba(255,250,244,0.58);
          font-size: 11px;
          font-weight: 850;
        }

        .tm-float-a {
          top: 96px;
          right: 34px;
        }

        .tm-float-b {
          left: 32px;
          bottom: 92px;
        }

        .tm-hero-ring {
          position: absolute;
          width: 520px;
          height: 520px;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(244,201,159,0.18);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: tm-orbit 18s linear infinite;
        }

        .tm-section {
          padding: 78px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .tm-section-head {
          display: grid;
          grid-template-columns: minmax(0, 0.74fr) minmax(300px, 0.62fr);
          gap: 30px;
          align-items: end;
          margin-bottom: 28px;
        }

        .tm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px;
          color: var(--tm-cream);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .tm-eyebrow::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--tm-brown-2);
          box-shadow: 0 0 22px rgba(211, 109, 71, 0.62);
        }

        .tm-section-head h2,
        .tm-value-copy h2,
        .tm-architecture-copy h2,
        .tm-cta h2 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(36px, 4.6vw, 64px);
          line-height: 0.96;
          letter-spacing: -0.068em;
        }

        .tm-section-head p,
        .tm-value-copy p,
        .tm-architecture-copy p,
        .tm-cta p {
          margin: 0;
          color: var(--tm-muted);
          font-size: 16px;
          line-height: 1.72;
        }

        .tm-module-grid {
          display: grid;
          gap: 18px;
        }

        .tm-module {
          display: grid;
          grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.72fr);
          gap: 22px;
          min-height: 450px;
          padding: clamp(18px, 3vw, 30px);
          border-radius: 34px;
          background:
            radial-gradient(circle at 92% 12%, rgba(244, 201, 159, 0.13), transparent 18rem),
            linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.035));
          border: 1px solid rgba(255,255,255,0.105);
          box-shadow: 0 28px 80px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .tm-module-copy {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
          padding: 8px;
        }

        .tm-module h3 {
          max-width: 640px;
          margin: 0;
          color: #ffffff;
          font-size: clamp(32px, 4vw, 54px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .tm-module p {
          max-width: 620px;
          margin: 16px 0 0;
          color: var(--tm-muted);
          line-height: 1.68;
          font-size: 16px;
        }

        .tm-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tm-chip-row span {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0 11px;
          color: rgba(255,250,244,0.72);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 12px;
          font-weight: 850;
        }

        .tm-visual {
          position: relative;
          min-height: 390px;
          display: grid;
          place-items: center;
          border-radius: 28px;
          background:
            radial-gradient(circle at 50% 10%, rgba(244,201,159,0.14), transparent 15rem),
            rgba(0,0,0,0.18);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .tm-phone {
          width: min(292px, 88%);
          min-height: 350px;
          padding: 14px;
          border-radius: 34px;
          color: #35251d;
          background: linear-gradient(180deg, #fffaf2, #f3dfc9);
          box-shadow: 0 30px 72px rgba(0,0,0,0.34);
          transform: rotate(-2deg);
        }

        .tm-phone-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 12px;
          color: #8e6648;
          font-weight: 950;
        }

        .tm-welcome,
        .tm-name-pill {
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(157,117,82,0.12);
          border-radius: 22px;
          padding: 13px;
          box-shadow: 0 14px 34px rgba(73,49,30,0.08);
        }

        .tm-welcome i {
          color: var(--tm-brown);
          font-style: normal;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .tm-welcome strong {
          display: block;
          margin-top: 6px;
          font-size: 26px;
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .tm-welcome span {
          display: block;
          margin-top: 6px;
          color: rgba(53,37,29,0.58);
          font-size: 12px;
        }

        .tm-name-pill {
          margin-top: 9px;
          display: grid;
          grid-template-columns: 30px minmax(0, 1fr) auto;
          align-items: center;
          gap: 9px;
        }

        .tm-name-pill strong {
          font-size: 16px;
        }

        .tm-name-pill em {
          color: var(--tm-brown);
          font-style: normal;
          font-weight: 950;
        }

        .tm-category-grid {
          margin-top: 9px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .tm-category-grid div,
        .tm-request-grid div {
          min-height: 72px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 18px;
          padding: 10px;
          background: #fff8ef;
          border: 1px solid rgba(157,117,82,0.1);
        }

        .tm-category-grid strong,
        .tm-request-grid strong {
          font-size: 12px;
        }

        .tm-tabs {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 7px;
        }

        .tm-tabs span {
          min-height: 36px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #fff;
          color: #4a3227;
          font-size: 11px;
          font-weight: 950;
        }

        .tm-float-one {
          right: 26px;
          bottom: 32px;
          min-width: 170px;
          background: rgba(20,12,8,0.76);
        }

        .tm-dashboard {
          width: min(360px, 90%);
          border-radius: 28px;
          padding: 18px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 30px 84px rgba(0,0,0,0.26);
          backdrop-filter: blur(18px);
        }

        .tm-dashboard-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .tm-dashboard-head span {
          color: rgba(255,250,244,0.58);
          font-size: 12px;
          font-weight: 850;
        }

        .tm-dashboard-head strong {
          min-height: 28px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          color: #10321f;
          background: #bbf7d0;
          font-size: 11px;
          font-weight: 950;
        }

        .tm-dashboard-card,
        .tm-qr-card,
        .tm-staff-alert {
          border-radius: 22px;
          padding: 15px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .tm-dashboard-card strong,
        .tm-staff-alert strong {
          display: block;
          color: #ffffff;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .tm-dashboard-card span,
        .tm-staff-alert span {
          display: block;
          margin-top: 5px;
          color: rgba(255,250,244,0.56);
          font-size: 12px;
        }

        .tm-dashboard-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 8px;
          margin: 10px 0;
        }

        .tm-dashboard-row i {
          min-height: 50px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,250,244,0.72);
          font-size: 12px;
          font-style: normal;
          font-weight: 900;
        }

        .tm-qr-card {
          display: grid;
          grid-template-columns: 58px minmax(0,1fr);
          align-items: center;
          gap: 12px;
        }

        .tm-qr-card div {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          background:
            linear-gradient(90deg, #fff 8px, transparent 8px 14px, #fff 14px 22px, transparent 22px),
            linear-gradient(#fff 8px, transparent 8px 14px, #fff 14px 22px, transparent 22px),
            rgba(244,201,159,0.22);
          background-size: 28px 28px;
        }

        .tm-qr-card strong {
          color: #fff;
        }

        .tm-service-panel {
          width: min(360px, 90%);
          border-radius: 30px;
          padding: 18px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 30px 84px rgba(0,0,0,0.26);
        }

        .tm-service-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .tm-service-title span {
          color: var(--tm-cream);
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .tm-service-title strong {
          font-size: 22px;
          letter-spacing: -0.04em;
        }

        .tm-request-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 10px;
        }

        .tm-request-grid div {
          background: rgba(255,255,255,0.09);
          color: #fff;
          border-color: rgba(255,255,255,0.1);
        }

        .tm-request-grid span {
          font-size: 26px;
        }

        .tm-staff-alert {
          margin-top: 12px;
        }

        .tm-backend-visual {
          min-height: 420px;
        }

        .tm-hub {
          position: relative;
          z-index: 3;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          text-align: center;
          background: linear-gradient(135deg, #fff5e8, #f4c99f 48%, #d36d47);
          color: #24120d;
          box-shadow: 0 32px 80px rgba(244,201,159,0.22);
        }

        .tm-hub strong,
        .tm-hub span {
          display: block;
        }

        .tm-hub strong {
          font-size: 24px;
          letter-spacing: -0.04em;
        }

        .tm-hub span {
          font-size: 11px;
          font-weight: 900;
          margin-top: -34px;
        }

        .tm-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(244,201,159,0.2);
        }

        .tm-ring-one {
          width: 290px;
          height: 290px;
          animation: tm-orbit 18s linear infinite;
        }

        .tm-ring-two {
          width: 410px;
          height: 410px;
          animation: tm-orbit 28s linear reverse infinite;
        }

        .tm-node {
          position: absolute;
          min-height: 34px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: rgba(255,255,255,0.11);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,250,244,0.8);
          font-size: 12px;
          font-weight: 950;
          box-shadow: 0 18px 42px rgba(0,0,0,0.16);
        }

        .tm-node-one { left: 12%; top: 25%; }
        .tm-node-two { right: 13%; top: 23%; }
        .tm-node-three { left: 15%; bottom: 25%; }
        .tm-node-four { right: 14%; bottom: 27%; }
        .tm-node-five { top: 8%; left: 50%; transform: translateX(-50%); }
        .tm-node-six { bottom: 8%; left: 50%; transform: translateX(-50%); }

        .tm-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .tm-feature-card,
        .tm-timeline-item,
        .tm-value-card,
        .tm-architecture-card,
        .tm-footer {
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.082), rgba(255,255,255,0.034));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 58px rgba(0,0,0,0.16);
        }

        .tm-feature-card {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 22px;
        }

        .tm-feature-card h3 {
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 25px;
          letter-spacing: -0.048em;
        }

        .tm-feature-card p {
          color: var(--tm-muted);
          line-height: 1.62;
          margin: 0;
        }

        .tm-timeline {
          display: grid;
          gap: 12px;
        }

        .tm-timeline-item {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          padding: 22px;
        }

        .tm-timeline-item span {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          color: #24120d;
          background: linear-gradient(135deg, #fff5e8, #f4c99f 48%, #d36d47);
          font-size: 15px;
          font-weight: 1000;
          box-shadow: 0 16px 44px rgba(244,201,159,0.18);
        }

        .tm-timeline-item h3 {
          margin: 0;
          color: #fff;
          font-size: 25px;
          letter-spacing: -0.05em;
        }

        .tm-timeline-item p {
          margin: 8px 0 0;
          color: var(--tm-muted);
          line-height: 1.62;
        }

        .tm-value-section,
        .tm-architecture-section {
          display: grid;
          grid-template-columns: minmax(0, 0.7fr) minmax(300px, 0.7fr);
          gap: 22px;
          align-items: start;
        }

        .tm-value-copy,
        .tm-architecture-copy {
          position: sticky;
          top: 112px;
        }

        .tm-value-grid {
          display: grid;
          gap: 12px;
        }

        .tm-value-card {
          padding: 22px;
        }

        .tm-value-card h3 {
          margin: 0;
          color: #fff;
          font-size: 24px;
          letter-spacing: -0.05em;
        }

        .tm-value-card p {
          margin: 10px 0 0;
          color: var(--tm-muted);
          line-height: 1.62;
        }

        .tm-architecture-card {
          padding: 24px;
          overflow: hidden;
        }

        .tm-stack-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }

        .tm-stack-box {
          min-height: 108px;
          padding: 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .tm-stack-box strong {
          display: block;
          color: #fff;
          font-size: 18px;
          letter-spacing: -0.035em;
        }

        .tm-stack-box span {
          display: block;
          margin-top: 7px;
          color: rgba(255,250,244,0.56);
          font-size: 12px;
          line-height: 1.4;
        }

        .tm-stack-arrow {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #24120d;
          background: var(--tm-cream);
          font-weight: 950;
        }

        .tm-cta {
          position: relative;
          isolation: isolate;
          margin: 18px 0 78px;
          padding: clamp(28px, 5vw, 56px);
          border-radius: 38px;
          background:
            radial-gradient(circle at 88% 8%, rgba(244, 201, 159, 0.17), transparent 20rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.038));
          border: 1px solid rgba(255,255,255,0.11);
          overflow: hidden;
          box-shadow: 0 28px 84px rgba(0,0,0,0.22);
        }

        .tm-cta p {
          max-width: 760px;
          margin-top: 16px;
        }

        .tm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 34px;
          padding: 18px;
        }

        .tm-footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 12px;
        }

        .tm-footer-links a {
          color: rgba(255,250,244,0.68);
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
        }

        @keyframes tm-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes tm-shine {
          0%, 52%, 100% {
            transform: translateX(-145%) skewX(-18deg);
          }
          64% {
            transform: translateX(335%) skewX(-18deg);
          }
        }

        @keyframes tm-cta-glow {
          0%, 100% {
            box-shadow: 0 24px 70px rgba(244, 201, 159, 0.22);
          }
          50% {
            box-shadow: 0 30px 90px rgba(211, 109, 71, 0.32);
          }
        }

        @keyframes tm-orbit {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @media (max-width: 980px) {
          .tm-shell {
            width: min(100% - 28px, 760px);
          }

          .tm-nav {
            align-items: flex-start;
            flex-direction: column;
          }

          .tm-nav-links {
            flex-wrap: wrap;
          }

          .tm-hero,
          .tm-section-head,
          .tm-module,
          .tm-value-section,
          .tm-architecture-section {
            grid-template-columns: 1fr;
          }

          .tm-hero-stage {
            min-height: 590px;
          }

          .tm-feature-grid {
            grid-template-columns: 1fr;
          }

          .tm-value-copy,
          .tm-architecture-copy {
            position: static;
          }

          .tm-module {
            min-height: auto;
          }

          .tm-visual {
            min-height: 360px;
          }

          .tm-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .tm-footer-links {
            justify-content: flex-start;
          }
        }

        @media (max-width: 620px) {
          .tm-nav-links a,
          .tm-button {
            width: 100%;
          }

          .tm-nav-links,
          .tm-hero-actions {
            width: 100%;
          }

          .tm-logo {
            width: 70px;
            height: 70px;
            flex-basis: 70px;
          }

          .tm-hero h1 {
            font-size: clamp(46px, 14vw, 64px);
          }

          .tm-proof-row {
            grid-template-columns: 1fr;
          }

          .tm-hero-stage {
            min-height: 560px;
            border-radius: 30px;
          }

          .tm-main-phone {
            width: 270px;
            min-height: 500px;
          }

          .tm-mini-admin,
          .tm-float {
            display: none;
          }

          .tm-module {
            padding: 16px;
            border-radius: 28px;
          }

          .tm-timeline-item {
            grid-template-columns: 1fr;
          }

          .tm-stack-row {
            grid-template-columns: 1fr;
          }

          .tm-stack-arrow {
            transform: rotate(90deg);
            margin: 0 auto;
          }

          .tm-node {
            display: none;
          }

          .tm-ring-one {
            width: 250px;
            height: 250px;
          }

          .tm-ring-two {
            width: 340px;
            height: 340px;
          }
        }
      `}</style>

      <div className="tm-grid-bg" />

      <div className="tm-shell">
        <header className="tm-nav">
          <Link className="tm-brand" href="/dariktech" aria-label="Darik Technologies home">
            <span className="tm-logo">
              <img src="/dariktech/logo.png" alt="Darik Technologies logo" />
            </span>
            <span>
              <strong>Darik Technologies</strong>
              <span>Portfolio case study</span>
            </span>
          </Link>

          <nav className="tm-nav-links" aria-label="Tawleh Manager navigation">
            <Link href="/dariktech/portfolio">Portfolio</Link>
            <a href="#modules">System</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#value">Value</a>
            <a className="tm-nav-cta" href={quoteHref}>
              Free quote
            </a>
          </nav>
        </header>

        <section className="tm-hero">
          <div>
            <div className="tm-kicker">QR restaurant ordering system</div>
            <h1>
              Tawleh Manager is a <span className="tm-gradient">restaurant operating flow</span>, not a basic QR menu.
            </h1>
            <p className="tm-hero-copy">
              A polished QR table ordering system for restaurants, cafes, lounges, and food businesses. Customers scan, enter
              their name, browse the live menu, send orders, check the bill, and request service. The business gets dashboard
              controls for menus, QR locations, branch setup, subscription status, and operations.
            </p>

            <div className="tm-hero-actions">
              <a className="tm-button tm-button-primary" href={quoteHref}>
                Build something like this
              </a>
              <Link className="tm-button tm-button-secondary" href="/dariktech/portfolio">
                Back to portfolio
              </Link>
            </div>

            <div className="tm-proof-row">
              {heroStats.map((stat) => (
                <div className="tm-proof" key={stat.value}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="tm-hero-stage" aria-hidden="true">
            <div className="tm-stage-grid" />
            <div className="tm-hero-ring" />

            <div className="tm-main-phone">
              <div className="tm-table-card">
                <div className="tm-table-icon">7</div>
                <div>
                  <span>You are ordering from</span>
                  <strong>Table 7</strong>
                </div>
                <b>›</b>
              </div>

              <div className="tm-menu-card">
                <h3>Explore menu</h3>
                <div className="tm-mini-cats">
                  <div>
                    <span>🥘</span>
                    <strong>Daily Meals</strong>
                  </div>
                  <div>
                    <span>🍗</span>
                    <strong>Grills</strong>
                  </div>
                  <div>
                    <span>☕</span>
                    <strong>Drinks</strong>
                  </div>
                  <div>
                    <span>🍰</span>
                    <strong>Desserts</strong>
                  </div>
                </div>
              </div>

              <div className="tm-order-card">
                <div>
                  <strong>2 items • 14.50 JOD</strong>
                  <span>Ready to send to staff</span>
                </div>
                <button>Send</button>
              </div>
            </div>

            <div className="tm-mini-admin">
              <small>Restaurant control</small>
              <div className="tm-mini-admin-row">
                <i>□</i>
                <div>
                  <strong>QR Locations</strong>
                  <span>Tables and branch areas</span>
                </div>
                <b>Live</b>
              </div>
              <div className="tm-mini-admin-row">
                <i>☰</i>
                <div>
                  <strong>Menu Items</strong>
                  <span>Photos, prices, categories</span>
                </div>
                <b>Ready</b>
              </div>
              <div className="tm-mini-admin-row">
                <i>₪</i>
                <div>
                  <strong>Billing</strong>
                  <span>Subscription and access state</span>
                </div>
                <b>Active</b>
              </div>
            </div>

            <div className="tm-float tm-float-a">
              <strong>Service request</strong>
              <span>Waiter • water • napkins • charcoal</span>
            </div>

            <div className="tm-float tm-float-b">
              <strong>Guest context</strong>
              <span>Customer name + table location</span>
            </div>
          </div>
        </section>

        <section className="tm-section" id="modules">
          <div className="tm-section-head">
            <div>
              <p className="tm-eyebrow">System modules</p>
              <h2>Every part is designed around a real restaurant workflow.</h2>
            </div>
            <p>
              Tawleh Manager is stronger as a portfolio page when it shows the complete system: customer menu, restaurant
              dashboard, service requests, QR printing, billing state, and a SaaS-ready operating model.
            </p>
          </div>

          <div className="tm-module-grid">
            {modules.map((module) => (
              <article className="tm-module" key={module.title}>
                <div className="tm-module-copy">
                  <div>
                    <p className="tm-eyebrow">{module.eyebrow}</p>
                    <h3>{module.title}</h3>
                    <p>{module.text}</p>
                  </div>

                  <div className="tm-chip-row">
                    {module.chips.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>
                </div>

                <ModuleVisual visual={module.visual} />
              </article>
            ))}
          </div>
        </section>

        <section className="tm-section" id="features">
          <div className="tm-section-head">
            <div>
              <p className="tm-eyebrow">Included features</p>
              <h2>Built with the details restaurants actually need.</h2>
            </div>
            <p>
              The best proof is not just that the UI looks clean. The proof is that the product understands tables, guests,
              service requests, ordering, menu control, QR printing, subscription status, and business settings.
            </p>
          </div>

          <div className="tm-feature-grid">
            {features.map((feature) => (
              <article className="tm-feature-card" key={feature.title}>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
                <div className="tm-chip-row">
                  {feature.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="tm-section" id="workflow">
          <div className="tm-section-head">
            <div>
              <p className="tm-eyebrow">Workflow logic</p>
              <h2>From setup to scan to staff action.</h2>
            </div>
            <p>
              This page positions Tawleh Manager as a proper system by explaining the full chain of actions, not just showing
              a few design screenshots.
            </p>
          </div>

          <div className="tm-timeline">
            {timeline.map((item) => (
              <article className="tm-timeline-item" key={item.step}>
                <span>{item.step}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="tm-section tm-value-section" id="value">
          <div className="tm-value-copy">
            <p className="tm-eyebrow">Business value</p>
            <h2>Why a restaurant would pay for this.</h2>
            <p>
              Tawleh Manager is easier to sell when it is framed as a restaurant workflow product: fewer repeated questions,
              cleaner table context, faster menu updates, and a monthly software model.
            </p>
          </div>

          <div className="tm-value-grid">
            {businessValue.map((item) => (
              <article className="tm-value-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tm-section tm-architecture-section">
          <div className="tm-architecture-copy">
            <p className="tm-eyebrow">Architecture thinking</p>
            <h2>Not a template. A connected software system.</h2>
            <p>
              The value of Tawleh Manager is in how the customer screen, table QR code, restaurant dashboard, menu database,
              service request flow, and billing status work together.
            </p>
          </div>

          <div className="tm-architecture-card">
            <div className="tm-stack-row">
              <div className="tm-stack-box">
                <strong>Customer QR menu</strong>
                <span>Phone-first menu, guest name, categories, bill, service requests.</span>
              </div>
              <div className="tm-stack-arrow">→</div>
              <div className="tm-stack-box">
                <strong>Restaurant dashboard</strong>
                <span>Menu, locations, QR cards, branch details, account state.</span>
              </div>
            </div>

            <div className="tm-stack-row">
              <div className="tm-stack-box">
                <strong>Database logic</strong>
                <span>Business profiles, items, tables, requests, status, and settings.</span>
              </div>
              <div className="tm-stack-arrow">→</div>
              <div className="tm-stack-box">
                <strong>Operations control</strong>
                <span>Clearer staff context, service status, onboarding, and subscriptions.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tm-cta">
          <p className="tm-eyebrow">Free quote</p>
          <h2>Need a QR ordering system or restaurant dashboard?</h2>
          <p>
            Send the restaurant type, number of branches, what customers should do, and what staff need to control.
            Darik Technologies can turn the idea into a clean build plan.
          </p>

          <div className="tm-hero-actions">
            <a className="tm-button tm-button-primary" href={quoteHref}>
              Request a free quote
            </a>
            <Link className="tm-button tm-button-secondary" href="/dariktech/admin-dashboard-development-jordan">
              Admin dashboard service
            </Link>
            <Link className="tm-button tm-button-secondary" href="/dariktech/mobile-app-development-jordan">
              Mobile app service
            </Link>
          </div>
        </section>

        <footer className="tm-footer">
          <Link className="tm-footer-brand" href="/dariktech">
            <span className="tm-logo">
              <img src="/dariktech/logo.png" alt="Darik Technologies logo" />
            </span>
            <span>
              <strong>Darik Technologies</strong>
              <span>Business software systems</span>
            </span>
          </Link>

          <div className="tm-footer-links">
            <Link href="/dariktech/portfolio">Portfolio</Link>
            <Link href="/dariktech/work/darik-marketplace">Darik Marketplace</Link>
            <Link href="/dariktech/work/partbid">PartBid</Link>
            <Link href="/dariktech/work/tawleh-manager">Tawleh Manager</Link>
            <span>© {year}</span>
          </div>
        </footer>
      </div>
    </main>
  );
}