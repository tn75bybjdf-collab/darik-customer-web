import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://getdarik.com";
const pagePath = "/dariktech/work/tawleh-manager";
const pageUrl = `${siteUrl}${pagePath}`;

export const metadata: Metadata = {
  title: "Tawleh Manager Case Study | QR Restaurant Ordering System",
  description:
    "Tawleh Manager is a QR restaurant ordering and table management system by Darik Technologies, built around table QR codes, customer menus, staff visibility, service requests, billing, and branch operations.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Tawleh Manager | QR Restaurant Ordering Case Study",
    description:
      "A restaurant ordering system case study showing QR menus, table/location ordering, customer names, service requests, billing, QR printing, and restaurant dashboard controls.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
  },
  keywords: [
    "Tawleh Manager",
    "QR restaurant ordering system Jordan",
    "restaurant ordering app Jordan",
    "QR menu system Jordan",
    "restaurant table ordering system",
    "restaurant dashboard Jordan",
    "restaurant SaaS Jordan",
    "digital menu Jordan",
    "waiter ordering system Jordan",
    "Darik Technologies portfolio",
  ],
};

const highlights = [
  {
    title: "QR table ordering",
    text:
      "Restaurants can create printable QR codes for tables or locations. When a customer scans, the menu opens already attached to the correct table or location.",
    tags: ["QR codes", "Table flow", "Printable cards"],
  },
  {
    title: "Customer name flow",
    text:
      "Guests enter their name before ordering so the kitchen or staff can see the table/location and the person attached to the order.",
    tags: ["Guest names", "Cleaner tickets", "Staff visibility"],
  },
  {
    title: "Menu control",
    text:
      "The restaurant controls categories, item photos, item details, prices, availability, Arabic/English labels, and the public customer menu experience.",
    tags: ["Menu builder", "Photos", "Arabic + English"],
  },
  {
    title: "Service requests",
    text:
      "Customers can request service items like waiter, water, napkins, or charcoal without needing to flag staff manually.",
    tags: ["Waiter", "Water", "Napkins", "Charcoal"],
  },
  {
    title: "Billing and subscription logic",
    text:
      "The system includes account billing status, service expiry, payment due dates, and suspension screens if service expires.",
    tags: ["Subscription", "Payment due", "Service status"],
  },
  {
    title: "Branch-ready dashboard",
    text:
      "The product is planned around business profile, branch name, locations, QR links, staff flows, account approval, and onboarding.",
    tags: ["Branches", "Locations", "Approval"],
  },
];

const workflow = [
  {
    number: "01",
    title: "Restaurant sets up profile",
    text:
      "The business adds its name, branch, logo, contact info, locations, welcome message, and account details.",
  },
  {
    number: "02",
    title: "Manager creates QR locations",
    text:
      "The dashboard creates QR links for tables or locations, with optional display names and an auto-print/reset mode.",
  },
  {
    number: "03",
    title: "Customer scans QR",
    text:
      "The public customer menu opens for the correct table/location. The customer enters their name and starts ordering.",
  },
  {
    number: "04",
    title: "Staff receives clear order context",
    text:
      "Orders and requests are tied to the business, branch, table/location, and customer name so staff can act quickly.",
  },
];

const proofPoints = [
  "This is not a basic QR menu. It is a table/location ordering workflow with restaurant controls behind it.",
  "The product includes customer-facing UI, manager controls, menu logic, QR generation, service requests, billing status, and branch details.",
  "The workflow is designed for real restaurant operations: scan, identify table, enter customer name, order, request service, and staff sees context.",
  "It can be sold as a SaaS product, restaurant onboarding system, or custom ordering platform for food businesses.",
];

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
        "restaurant ordering systems",
        "QR menu systems",
        "mobile app development",
        "admin dashboards",
        "business software",
        "SaaS platforms",
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
      ],
      description:
        "A Darik Technologies case study for Tawleh Manager, a QR restaurant ordering and table management system.",
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
        "Menu management",
        "Service requests",
        "Billing status",
        "Restaurant dashboard",
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
  return (
    <main className="tm-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="tm-nav">
        <Link className="tm-brand" href="/dariktech" aria-label="Darik Technologies home">
          <span className="tm-logo-wrap">
            <img src="/dariktech/logo.png" alt="Darik Technologies logo" />
          </span>
          <span>
            <strong>Darik Technologies</strong>
            <small>Portfolio case study</small>
          </span>
        </Link>

        <nav className="tm-nav-links" aria-label="Tawleh Manager page navigation">
          <Link href="/dariktech/portfolio">Portfolio</Link>
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <a href="#proof">Proof</a>
          <a className="tm-quote-link" href="mailto:jjasaleh14@aol.com?subject=Tawleh%20Manager%20Style%20System%20Quote">
            Free quote
          </a>
        </nav>
      </header>

      <section className="tm-hero">
        <div className="tm-hero-copy">
          <p className="tm-eyebrow">Restaurant ordering system</p>
          <h1>Tawleh Manager turns restaurant tables into ordering points.</h1>
          <p className="tm-hero-text">
            Tawleh Manager is a QR-based restaurant ordering and table management system. Customers scan a table QR code,
            enter their name, browse the menu, send orders, request service, and stay connected to the correct table or location.
            The restaurant gets the dashboard controls needed to manage menus, QR codes, billing, branches, and operations.
          </p>

          <div className="tm-actions">
            <a className="tm-primary" href="mailto:jjasaleh14@aol.com?subject=Tawleh%20Manager%20Style%20System%20Quote">
              Build something like this
            </a>
            <Link className="tm-secondary" href="/dariktech/portfolio">
              Back to portfolio
            </Link>
          </div>

          <div className="tm-chip-row">
            <span>QR ordering</span>
            <span>Digital menus</span>
            <span>Service requests</span>
            <span>Restaurant dashboard</span>
            <span>SaaS logic</span>
          </div>
        </div>

        <div className="tm-visual" aria-label="Tawleh Manager product preview">
          <div className="tm-phone">
            <div className="tm-phone-top">
              <span />
              <strong>Tawleh</strong>
              <em>Table 5</em>
            </div>

            <div className="tm-welcome-card">
              <small>Welcome</small>
              <h3>Start ordering</h3>
              <p>Enter your name and browse the live menu for this table.</p>
            </div>

            <div className="tm-menu-grid">
              <div>
                <span>🍔</span>
                <strong>Burgers</strong>
              </div>
              <div>
                <span>🥗</span>
                <strong>Salads</strong>
              </div>
              <div>
                <span>☕</span>
                <strong>Drinks</strong>
              </div>
              <div>
                <span>🍰</span>
                <strong>Dessert</strong>
              </div>
            </div>

            <div className="tm-bottom-tabs">
              <span>Menu</span>
              <span>Bill</span>
              <span>Service</span>
            </div>
          </div>

          <div className="tm-floating-card tm-floating-one">
            <span>QR</span>
            <strong>Print table card</strong>
          </div>

          <div className="tm-floating-card tm-floating-two">
            <span>Staff</span>
            <strong>Table + customer name</strong>
          </div>
        </div>
      </section>

      <section className="tm-section tm-intro">
        <div>
          <p className="tm-eyebrow">Problem solved</p>
          <h2>Restaurants do not just need a menu. They need order context.</h2>
        </div>
        <p>
          A normal QR menu only shows food. Tawleh Manager is built around the actual restaurant workflow: which table scanned,
          who is ordering, what items were sent, whether the customer needs service, and what the manager controls behind the scenes.
        </p>
      </section>

      <section className="tm-section" id="workflow">
        <div className="tm-section-head">
          <p className="tm-eyebrow">Workflow</p>
          <h2>From table QR to staff action.</h2>
          <p>
            The product is built around a clean sequence that makes ordering easier for customers and more organized for restaurant staff.
          </p>
        </div>

        <div className="tm-workflow-grid">
          {workflow.map((step) => (
            <article className="tm-workflow-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tm-section tm-dark-section" id="features">
        <div className="tm-section-head">
          <p className="tm-eyebrow">Product depth</p>
          <h2>The case study shows dashboard logic, not just UI screens.</h2>
          <p>
            Tawleh Manager has the kind of details that make a software product actually usable in a restaurant: setup, QR generation,
            public menu, customer names, table context, service buttons, billing state, and subscription control.
          </p>
        </div>

        <div className="tm-feature-grid">
          {highlights.map((feature) => (
            <article className="tm-feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <div className="tm-chip-row">
                {feature.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tm-section tm-proof-section" id="proof">
        <div className="tm-proof-copy">
          <p className="tm-eyebrow">Why this helps Darik Technologies sell</p>
          <h2>This proves business software depth.</h2>
          <p>
            Tawleh Manager is a strong portfolio piece because it is a real operating system concept. It shows that Darik Technologies
            can design products with customers, employees, managers, QR flows, billing logic, and admin controls working together.
          </p>
        </div>

        <div className="tm-proof-list">
          {proofPoints.map((point) => (
            <div key={point}>
              <span>✓</span>
              <p>{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tm-section tm-build-section">
        <div className="tm-section-head">
          <p className="tm-eyebrow">Build options</p>
          <h2>This same structure can be reused for other businesses.</h2>
          <p>
            Tawleh Manager can be explained to clients as a restaurant system, QR ordering product, cafe ordering flow, home-chef menu system,
            hotel service request flow, shisha lounge service system, or any table/location-based request platform.
          </p>
        </div>

        <div className="tm-build-grid">
          <Link href="/dariktech/mobile-app-development-jordan">
            <span>Service page</span>
            <strong>Mobile App Development Jordan</strong>
            <p>Customer apps, staff apps, and connected ordering systems.</p>
          </Link>

          <Link href="/dariktech/admin-dashboard-development-jordan">
            <span>Service page</span>
            <strong>Admin Dashboard Development Jordan</strong>
            <p>Manager dashboards, reports, roles, and internal controls.</p>
          </Link>

          <Link href="/dariktech/website-development-jordan">
            <span>Service page</span>
            <strong>Website Development Jordan</strong>
            <p>Web apps, portals, booking flows, and business websites.</p>
          </Link>
        </div>
      </section>

      <section className="tm-final-cta">
        <p className="tm-eyebrow">Free quote</p>
        <h2>Want a QR ordering system or restaurant dashboard?</h2>
        <p>
          Send the restaurant type, number of branches, what customers should do, and what staff need to see. Darik Technologies
          can shape it into a practical system plan.
        </p>
        <div className="tm-actions">
          <a className="tm-primary" href="mailto:jjasaleh14@aol.com?subject=Tawleh%20Manager%20Style%20System%20Quote">
            Request a free quote
          </a>
          <Link className="tm-secondary" href="/dariktech/portfolio">
            View more portfolio work
          </Link>
        </div>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #130b08;
        }

        .tm-page {
          min-height: 100vh;
          color: #fffaf4;
          background:
            radial-gradient(circle at 12% 6%, rgba(211, 109, 71, 0.34), transparent 30rem),
            radial-gradient(circle at 92% 14%, rgba(245, 198, 146, 0.16), transparent 32rem),
            linear-gradient(180deg, #170d09 0%, #24120d 42%, #0f0907 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }

        .tm-nav {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 5;
        }

        .tm-brand,
        .tm-nav-links,
        .tm-actions,
        .tm-chip-row {
          display: flex;
          align-items: center;
        }

        .tm-brand {
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
        }

        .tm-logo-wrap {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .tm-logo-wrap img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .tm-brand strong,
        .tm-brand small {
          display: block;
        }

        .tm-brand strong {
          font-size: 15px;
          letter-spacing: -0.02em;
        }

        .tm-brand small {
          color: rgba(255, 250, 244, 0.58);
          font-size: 12px;
          margin-top: 2px;
        }

        .tm-nav-links {
          gap: 6px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .tm-nav-links a,
        .tm-primary,
        .tm-secondary {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 15px;
          color: rgba(255, 250, 244, 0.76);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          border: 1px solid transparent;
        }

        .tm-nav-links a:hover,
        .tm-secondary:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.07);
        }

        .tm-nav-links .tm-quote-link,
        .tm-primary {
          color: #24120d;
          background: #f4c99f;
          box-shadow: 0 18px 48px rgba(244, 201, 159, 0.14);
        }

        .tm-secondary {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.07);
        }

        .tm-hero {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          min-height: 680px;
          display: grid;
          grid-template-columns: 1.06fr 0.94fr;
          align-items: center;
          gap: 42px;
          padding: 44px 0 76px;
        }

        .tm-eyebrow {
          color: #f4c99f;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          font-size: clamp(46px, 7vw, 82px);
          line-height: 0.92;
          letter-spacing: -0.075em;
          margin-bottom: 22px;
        }

        .tm-hero-text {
          color: rgba(255, 250, 244, 0.72);
          font-size: 18px;
          line-height: 1.72;
          max-width: 720px;
        }

        .tm-actions {
          gap: 10px;
          flex-wrap: wrap;
          margin: 28px 0 18px;
        }

        .tm-chip-row {
          gap: 8px;
          flex-wrap: wrap;
        }

        .tm-chip-row span {
          color: rgba(255, 250, 244, 0.72);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 850;
        }

        .tm-visual {
          position: relative;
          min-height: 560px;
          border-radius: 44px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            radial-gradient(circle at top right, rgba(244, 201, 159, 0.22), transparent 18rem),
            rgba(255, 255, 255, 0.07);
          box-shadow: 0 40px 110px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 28px;
        }

        .tm-phone {
          width: min(330px, 88%);
          margin: 18px auto;
          min-height: 520px;
          border-radius: 38px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255, 250, 242, 0.92), rgba(243, 226, 207, 0.96)),
            #f6eadb;
          box-shadow: 0 28px 78px rgba(0, 0, 0, 0.32);
          color: #3e2d26;
          position: relative;
        }

        .tm-phone-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: #8e6648;
          font-size: 12px;
          font-weight: 950;
          margin-bottom: 18px;
        }

        .tm-phone-top span {
          width: 38px;
          height: 8px;
          border-radius: 999px;
          background: #d8c2ad;
        }

        .tm-phone-top em {
          font-style: normal;
          color: #bd5338;
        }

        .tm-welcome-card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(157, 117, 82, 0.14);
          border-radius: 26px;
          padding: 18px;
          margin-bottom: 12px;
          box-shadow: 0 18px 42px rgba(73, 49, 30, 0.1);
        }

        .tm-welcome-card small {
          color: #bd5338;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .tm-welcome-card h3 {
          color: #3e2d26;
          font-size: 34px;
          line-height: 0.95;
          letter-spacing: -0.06em;
          margin: 10px 0 8px;
        }

        .tm-welcome-card p {
          color: #786a5f;
          line-height: 1.45;
          margin-bottom: 0;
        }

        .tm-menu-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .tm-menu-grid div {
          min-height: 112px;
          border-radius: 22px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(157, 117, 82, 0.14);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .tm-menu-grid span {
          font-size: 28px;
        }

        .tm-menu-grid strong {
          color: #3e2d26;
          font-size: 15px;
        }

        .tm-bottom-tabs {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .tm-bottom-tabs span {
          min-height: 42px;
          border-radius: 16px;
          background: #fff;
          display: grid;
          place-items: center;
          color: #4a3227;
          font-size: 12px;
          font-weight: 950;
          border: 1px solid rgba(157, 117, 82, 0.12);
        }

        .tm-floating-card {
          position: absolute;
          border-radius: 20px;
          padding: 15px 16px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.24);
          color: #3e2d26;
          box-shadow: 0 20px 54px rgba(0, 0, 0, 0.22);
        }

        .tm-floating-card span {
          display: block;
          color: #bd5338;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 6px;
        }

        .tm-floating-card strong {
          display: block;
          font-size: 14px;
        }

        .tm-floating-one {
          left: 28px;
          top: 88px;
        }

        .tm-floating-two {
          right: 26px;
          bottom: 98px;
        }

        .tm-section {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 76px 0;
        }

        .tm-intro {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 36px;
          align-items: start;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tm-intro h2,
        .tm-section-head h2,
        .tm-proof-copy h2,
        .tm-final-cta h2 {
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.065em;
          margin-bottom: 14px;
        }

        .tm-intro > p,
        .tm-section-head p,
        .tm-proof-copy p,
        .tm-final-cta p {
          color: rgba(255, 250, 244, 0.68);
          line-height: 1.75;
          font-size: 16px;
        }

        .tm-section-head {
          max-width: 820px;
          margin-bottom: 28px;
        }

        .tm-workflow-grid,
        .tm-feature-grid,
        .tm-build-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .tm-feature-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .tm-build-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .tm-workflow-card,
        .tm-feature-card,
        .tm-build-grid a,
        .tm-proof-list div,
        .tm-final-cta {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.07);
          border-radius: 24px;
        }

        .tm-workflow-card,
        .tm-feature-card,
        .tm-build-grid a {
          padding: 24px;
        }

        .tm-workflow-card span,
        .tm-build-grid a span {
          color: #f4c99f;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .tm-workflow-card h3,
        .tm-feature-card h3 {
          font-size: 24px;
          line-height: 1.05;
          letter-spacing: -0.045em;
          margin: 16px 0 10px;
        }

        .tm-workflow-card p,
        .tm-feature-card p,
        .tm-build-grid a p {
          color: rgba(255, 250, 244, 0.66);
          line-height: 1.65;
        }

        .tm-dark-section {
          width: 100%;
          padding-left: max(16px, calc((100vw - 1180px) / 2));
          padding-right: max(16px, calc((100vw - 1180px) / 2));
          background: rgba(0, 0, 0, 0.18);
        }

        .tm-proof-section {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 18px;
          align-items: start;
        }

        .tm-proof-list {
          display: grid;
          gap: 12px;
        }

        .tm-proof-list div {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          align-items: start;
          gap: 12px;
          padding: 18px;
        }

        .tm-proof-list span {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #24120d;
          background: #f4c99f;
          font-weight: 950;
        }

        .tm-proof-list p {
          color: rgba(255, 250, 244, 0.68);
          line-height: 1.65;
          margin: 0;
        }

        .tm-build-grid a {
          min-height: 230px;
          color: #ffffff;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .tm-build-grid a:hover {
          transform: translateY(-3px);
          border-color: rgba(244, 201, 159, 0.36);
          background: rgba(255, 255, 255, 0.1);
        }

        .tm-build-grid strong {
          display: block;
          font-size: 26px;
          line-height: 1.05;
          letter-spacing: -0.05em;
          margin: 16px 0 10px;
        }

        .tm-final-cta {
          width: min(1180px, calc(100% - 32px));
          margin: 20px auto 80px;
          padding: clamp(28px, 5vw, 54px);
          background:
            radial-gradient(circle at top right, rgba(244, 201, 159, 0.16), transparent 22rem),
            rgba(255, 255, 255, 0.08);
          text-align: left;
        }

        @media (max-width: 980px) {
          .tm-nav,
          .tm-hero,
          .tm-intro,
          .tm-proof-section {
            grid-template-columns: 1fr;
          }

          .tm-nav {
            align-items: flex-start;
            flex-direction: column;
          }

          .tm-nav-links {
            justify-content: flex-start;
          }

          .tm-hero {
            min-height: auto;
            padding-top: 28px;
          }

          .tm-workflow-grid,
          .tm-feature-grid,
          .tm-build-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .tm-nav-links a,
          .tm-primary,
          .tm-secondary {
            width: 100%;
          }

          .tm-actions,
          .tm-nav-links {
            width: 100%;
          }

          .tm-visual {
            min-height: auto;
            padding: 18px;
          }

          .tm-phone {
            width: 100%;
            min-height: 500px;
          }

          .tm-floating-card {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}