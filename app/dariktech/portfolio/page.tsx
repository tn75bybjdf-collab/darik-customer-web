import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://getdarik.com";
const pagePath = "/dariktech/portfolio";
const pageUrl = `${siteUrl}${pagePath}`;

export const metadata: Metadata = {
  title: "Darik Technologies Portfolio | Apps, Marketplaces & Business Systems",
  description:
    "Portfolio proof from Darik Technologies: marketplace apps, quote platforms, restaurant ordering systems, admin dashboards, internal tools, and business software built for Jordan and the region.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Darik Technologies Portfolio | Real App & Dashboard Work",
    description:
      "See examples of Darik Technologies work: Darik Marketplace, PartBid, Tawleh Manager, admin dashboards, and custom business software systems.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
  },
  keywords: [
    "Darik Technologies portfolio",
    "app development portfolio Jordan",
    "software company portfolio Jordan",
    "mobile app portfolio Jordan",
    "marketplace app development Jordan",
    "admin dashboard portfolio Jordan",
    "business software Jordan",
    "custom software portfolio",
    "web app development Jordan",
    "startup app development Jordan",
  ],
};

const portfolioCases = [
  {
    "label": "Marketplace platform",
    "title": "Darik Marketplace",
    "href": "/dariktech/work/darik-marketplace",
    "summary": "A Jordan-first essentials marketplace designed around customer ordering, retailer inventory, delivery operations, returns, credits, admin control, and warehouse workflows.",
    "stack": [
      "Customer app",
      "Retailer app",
      "Driver app",
      "Admin dashboard",
      "Warehouse flow"
    ],
    "proof": [
      "Multi-role platform with separate customer, retailer, driver, and admin experiences.",
      "Built around real marketplace operations: inventory, delivery choice, returns, credits, support, and dispatch.",
      "Designed for expansion from Amman to other regional markets."
    ],
    "metrics": [
      {
        "k": "4",
        "v": "connected apps"
      },
      {
        "k": "Admin",
        "v": "operations control"
      },
      {
        "k": "Jordan",
        "v": "launch market"
      }
    ]
  },
  {
    "label": "Quote marketplace",
    "title": "PartBid",
    "href": "/dariktech/work/partbid",
    "summary": "A wholesale auto-parts request and quote platform where garages submit part requests and suppliers respond with structured offers, photos, pricing, and delivery details.",
    "stack": [
      "Garage flow",
      "Supplier flow",
      "Quote system",
      "Chat",
      "Notifications"
    ],
    "proof": [
      "Solves a real market problem: garages calling many suppliers manually to check availability and price.",
      "Creates a structured request flow with car details, part photos, condition preference, and supplier offers.",
      "Designed for business-to-business use with request limits, supplier quote tabs, and closed request states."
    ],
    "metrics": [
      {
        "k": "B2B",
        "v": "marketplace"
      },
      {
        "k": "Quotes",
        "v": "supplier offers"
      },
      {
        "k": "Jordan",
        "v": "auto parts"
      }
    ]
  },
  {
    "label": "Restaurant ordering system",
    "title": "Tawleh Manager",
    "href": "/dariktech",
    "summary": "A QR table ordering and restaurant management system where customers order from the table and staff manage items, tables, payments, reports, and branch-level operations.",
    "stack": [
      "QR ordering",
      "Table labels",
      "Waiter flow",
      "Reports",
      "Branch control"
    ],
    "proof": [
      "Built for restaurants that need faster table ordering without forcing customers to download an app.",
      "Supports branch-based management, menu control, reporting, and operational staff workflows.",
      "Designed as a recurring software product with onboarding, support, and updates."
    ],
    "metrics": [
      {
        "k": "QR",
        "v": "table ordering"
      },
      {
        "k": "Staff",
        "v": "operations"
      },
      {
        "k": "SaaS",
        "v": "monthly model"
      }
    ]
  },
  {
    "label": "Private internal tools",
    "title": "Business Dashboards",
    "href": "/dariktech/admin-dashboard-development-jordan",
    "summary": "Custom admin dashboards and internal tools for businesses that need data entry, approvals, discrepancy checks, reports, commissions, fees, and workflow control.",
    "stack": [
      "Admin panels",
      "Reports",
      "Approvals",
      "Roles",
      "Internal workflows"
    ],
    "proof": [
      "Useful for companies that need to replace paper, manual spreadsheets, repeated WhatsApp messages, or scattered approvals.",
      "Can support two-person entry control, discrepancy detection, branch reporting, and management summaries.",
      "Built around the actual team workflow instead of forcing the company into a generic template."
    ],
    "metrics": [
      {
        "k": "Ops",
        "v": "dashboards"
      },
      {
        "k": "Reports",
        "v": "management"
      },
      {
        "k": "Custom",
        "v": "workflow logic"
      }
    ]
  }
] as const;

const serviceLinks = [
  {
    title: "Mobile App Development Jordan",
    href: "/dariktech/mobile-app-development-jordan",
    text: "iOS and Android apps for customers, staff, suppliers, drivers, and business workflows.",
  },
  {
    title: "Website Development Jordan",
    href: "/dariktech/website-development-jordan",
    text: "Business websites, landing pages, web apps, portals, and SEO-focused pages.",
  },
  {
    title: "Admin Dashboard Development Jordan",
    href: "/dariktech/admin-dashboard-development-jordan",
    text: "Dashboards, internal tools, reports, approvals, inventory, support, and operations panels.",
  },
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
        "mobile app development",
        "website development",
        "admin dashboards",
        "business software",
        "marketplace platforms",
        "internal tools",
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#portfolio`,
      name: "Darik Technologies Portfolio",
      url: pageUrl,
      description:
        "Portfolio examples from Darik Technologies including marketplace systems, quote platforms, restaurant ordering, admin dashboards, and internal tools.",
      isPartOf: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#portfolio-list`,
      name: "Darik Technologies software portfolio",
      itemListElement: portfolioCases.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${item.href}`,
        name: item.title,
        description: item.summary,
      })),
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
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function DarikTechPortfolioPage() {
  return (
    <main className="portfolio-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="nav">
        <Link className="brand" href="/dariktech" aria-label="Darik Technologies home">
          <span className="logo-wrap">
            <img src="/dariktech/logo.png" alt="Darik Technologies logo" />
          </span>
          <span>
            <strong>Darik Technologies</strong>
            <small>Apps, dashboards, marketplaces</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Portfolio navigation">
          <a href="#portfolio">Work</a>
          <a href="#proof">Proof</a>
          <a href="#services">Services</a>
          <Link href="/dariktech/app-developer-jordan">Jordan</Link>
          <a className="quote-link" href="mailto:jjasaleh14@aol.com?subject=Darik%20Technologies%20Portfolio%20Quote">
            Free quote
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Darik Technologies portfolio</p>
          <h1>Real app systems, not just website screenshots.</h1>
          <p className="hero-text">
            Darik Technologies builds complete business software: mobile apps, admin dashboards, marketplaces, quote systems,
            restaurant ordering systems, internal tools, and backend workflows. This portfolio page shows the kind of work
            that separates a serious software build from a basic design project.
          </p>

          <div className="hero-actions">
            <a className="primary" href="mailto:jjasaleh14@aol.com?subject=Darik%20Technologies%20Portfolio%20Quote">
              Request a free quote
            </a>
            <a className="secondary" href="#portfolio">
              View portfolio
            </a>
          </div>

          <div className="hero-points">
            <span>Mobile apps</span>
            <span>Admin dashboards</span>
            <span>Marketplaces</span>
            <span>Internal tools</span>
            <span>Business workflows</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Darik Technologies portfolio preview">
          <div className="system-card">
            <span>Portfolio proof</span>
            <strong>Products with workflows</strong>
            <p>
              Customer apps, staff apps, supplier tools, dashboards, reports, requests, approvals, dispatch, and support.
            </p>
          </div>

          <div className="mini-grid">
            <div>
              <small>Marketplace</small>
              <strong>Darik</strong>
            </div>
            <div>
              <small>Quote platform</small>
              <strong>PartBid</strong>
            </div>
            <div>
              <small>Restaurant SaaS</small>
              <strong>Tawleh</strong>
            </div>
            <div>
              <small>Operations</small>
              <strong>Dashboards</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="proof">
        <div>
          <p className="eyebrow">Why this matters</p>
          <h2>Good software is judged by the workflow behind the screen.</h2>
        </div>
        <p>
          A normal agency can show a nice landing page. Darik Technologies focuses on what happens after the customer taps a
          button: who receives the request, who approves it, what dashboard controls it, what notification is sent, what status
          changes, what report management sees, and how the business keeps operating.
        </p>
      </section>

      <section className="section portfolio-section" id="portfolio">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2>Portfolio examples built around real business problems.</h2>
          <p>
            These examples show product thinking, not just page design: multiple user roles, admin control, database logic,
            support flows, and day-to-day operational use.
          </p>
        </div>

        <div className="case-list">
          {portfolioCases.map((item, index) => (
            <article className="case-card" key={item.title}>
              <div className="case-top">
                <div>
                  <p className="case-label">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>

                <div className="metric-grid" aria-label={`${item.title} highlights`}>
                  {item.metrics.map((metric) => (
                    <div key={`${item.title}-${metric.k}`}>
                      <strong>{metric.k}</strong>
                      <span>{metric.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="case-body">
                <div>
                  <h4>What it proves</h4>
                  <ul>
                    {item.proof.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>System parts</h4>
                  <div className="tag-row">
                    {item.stack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="case-footer">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Link href={item.href}>
                  View related page →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-section">
        <div className="section-head">
          <p className="eyebrow">Better than a generic agency pitch</p>
          <h2>Darik Technologies is positioned around business systems.</h2>
          <p>
            The strongest selling point is simple: the work is not limited to websites. The focus is building software that
            connects users, employees, admins, suppliers, drivers, management, and data into one working product.
          </p>
        </div>

        <div className="proof-grid">
          <article>
            <span>01</span>
            <h3>Multiple user roles</h3>
            <p>Customer, admin, supplier, driver, manager, staff, and support flows can each be designed separately.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Backend logic</h3>
            <p>Business rules, statuses, approvals, reports, notifications, data storage, and workflow actions are planned early.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Operational control</h3>
            <p>The business gets dashboards and tools to manage what is happening after launch.</p>
          </article>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-head">
          <p className="eyebrow">Service links</p>
          <h2>Turn the portfolio into a project.</h2>
          <p>
            These service pages explain the main ways Darik Technologies can build a similar system for another business.
          </p>
        </div>

        <div className="service-grid">
          {serviceLinks.map((service) => (
            <Link className="service-card" href={service.href} key={service.href}>
              <span>Service page</span>
              <strong>{service.title}</strong>
              <p>{service.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section comparison-section">
        <div className="comparison-card">
          <p className="eyebrow">Positioning</p>
          <h2>For clients, this page should answer one question: can this team build my actual system?</h2>
          <p>
            The portfolio is structured to show practical software depth: marketplace logic, quote flows, restaurant ordering,
            admin dashboards, internal tools, and business controls. That helps Darik Technologies compete against normal web
            design agencies by showing deeper product capability.
          </p>
        </div>

        <div className="keyword-card">
          <strong>SEO targets</strong>
          <span>app development portfolio Jordan</span>
          <span>software company portfolio Jordan</span>
          <span>mobile app portfolio Jordan</span>
          <span>marketplace app development Jordan</span>
          <span>admin dashboard portfolio Jordan</span>
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow">Free quote</p>
        <h2>Need software like this for your business?</h2>
        <p>
          Send the idea, the user roles, and what your team needs to control. Darik Technologies can help turn it into a practical
          mobile app, website, dashboard, marketplace, or internal tool plan.
        </p>
        <div className="hero-actions">
          <a className="primary" href="mailto:jjasaleh14@aol.com?subject=Darik%20Technologies%20Portfolio%20Quote">
            Request a free quote
          </a>
          <Link className="secondary" href="/dariktech">
            Back to Darik Technologies
          </Link>
        </div>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #050b13;
        }

        .portfolio-page {
          min-height: 100vh;
          color: #f8fbff;
          background:
            radial-gradient(circle at 16% 8%, rgba(37, 99, 235, 0.42), transparent 28rem),
            radial-gradient(circle at 88% 18%, rgba(103, 232, 249, 0.16), transparent 30rem),
            linear-gradient(180deg, #06101d 0%, #081827 48%, #050b13 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }

        .nav {
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

        .brand,
        .nav-links,
        .hero-actions,
        .hero-points,
        .tag-row {
          display: flex;
          align-items: center;
        }

        .brand {
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
        }

        .logo-wrap {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .logo-wrap img {
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
          letter-spacing: -0.02em;
        }

        .brand small {
          color: rgba(248, 251, 255, 0.58);
          font-size: 12px;
          margin-top: 2px;
        }

        .nav-links {
          gap: 6px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .nav-links a,
        .nav-links a:visited,
        .nav-links a:any-link,
        .primary,
        .secondary {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 15px;
          color: rgba(248, 251, 255, 0.76);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          border: 1px solid transparent;
        }

        .nav-links a:hover,
        .secondary:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.07);
        }

        .nav-links .quote-link,
        .primary {
          color: #06101d;
          background: #67e8f9;
          box-shadow: 0 18px 48px rgba(103, 232, 249, 0.16);
        }

        .secondary {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.07);
        }

        .hero {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.04fr 0.96fr;
          align-items: center;
          gap: 42px;
          padding: 44px 0 70px;
        }

        .eyebrow {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        h1,
        h2,
        h3,
        h4,
        p {
          margin-top: 0;
        }

        h1 {
          font-size: clamp(46px, 7vw, 82px);
          line-height: 0.92;
          letter-spacing: -0.075em;
          margin-bottom: 22px;
        }

        .hero-text {
          color: rgba(248, 251, 255, 0.72);
          font-size: 18px;
          line-height: 1.72;
          max-width: 710px;
        }

        .hero-actions {
          gap: 10px;
          flex-wrap: wrap;
          margin: 28px 0 18px;
        }

        .hero-points {
          gap: 8px;
          flex-wrap: wrap;
        }

        .hero-points span,
        .tag-row span {
          color: rgba(248, 251, 255, 0.72);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 850;
        }

        .hero-visual {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            radial-gradient(circle at top right, rgba(103, 232, 249, 0.18), transparent 18rem),
            rgba(255, 255, 255, 0.07);
          border-radius: 42px;
          padding: 24px;
          min-height: 520px;
          box-shadow: 0 40px 110px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }

        .system-card {
          margin: 34px auto 26px;
          width: min(390px, 100%);
          min-height: 250px;
          border-radius: 34px;
          padding: 28px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(226, 240, 255, 0.92));
          color: #06101d;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.24);
        }

        .system-card span {
          color: #2563eb;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .system-card strong {
          display: block;
          font-size: 40px;
          line-height: 0.95;
          letter-spacing: -0.06em;
          margin: 20px 0 12px;
        }

        .system-card p {
          color: #475467;
          line-height: 1.55;
          margin-bottom: 0;
        }

        .mini-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .mini-grid div,
        .case-card,
        .proof-grid article,
        .service-card,
        .comparison-card,
        .keyword-card,
        .final-cta {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.07);
          border-radius: 24px;
        }

        .mini-grid div {
          padding: 16px;
        }

        .mini-grid small {
          color: #67e8f9;
          display: block;
          font-weight: 950;
          margin-bottom: 8px;
        }

        .mini-grid strong {
          display: block;
          font-size: 17px;
        }

        .section {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 76px 0;
        }

        .intro-section {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 36px;
          align-items: start;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .intro-section h2,
        .section-head h2,
        .final-cta h2,
        .comparison-card h2 {
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.065em;
          margin-bottom: 14px;
        }

        .intro-section > p,
        .section-head p,
        .final-cta p,
        .comparison-card p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.75;
          font-size: 16px;
        }

        .section-head {
          max-width: 790px;
          margin-bottom: 28px;
        }

        .case-list {
          display: grid;
          gap: 18px;
        }

        .case-card {
          padding: clamp(20px, 3vw, 34px);
          overflow: hidden;
          position: relative;
        }

        .case-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 8% 0%, rgba(103, 232, 249, 0.12), transparent 18rem),
            radial-gradient(circle at 100% 40%, rgba(37, 99, 235, 0.12), transparent 18rem);
          pointer-events: none;
        }

        .case-card > * {
          position: relative;
          z-index: 1;
        }

        .case-top {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 26px;
          align-items: start;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .case-label {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .case-card h3 {
          font-size: clamp(32px, 4vw, 56px);
          line-height: 0.98;
          letter-spacing: -0.065em;
          margin-bottom: 12px;
        }

        .case-card p,
        .case-card li,
        .service-card p,
        .proof-grid p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.65;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .metric-grid div {
          min-height: 96px;
          border-radius: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metric-grid strong {
          display: block;
          color: #ffffff;
          font-size: 26px;
          letter-spacing: -0.05em;
          margin-bottom: 6px;
        }

        .metric-grid span {
          color: rgba(248, 251, 255, 0.62);
          font-size: 13px;
          font-weight: 850;
        }

        .case-body {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 26px;
          padding: 24px 0;
        }

        .case-body h4 {
          color: #ffffff;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .case-body ul {
          margin: 0;
          padding-left: 20px;
        }

        .case-body li + li {
          margin-top: 8px;
        }

        .tag-row {
          gap: 8px;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .case-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 18px;
        }

        .case-footer span {
          color: rgba(248, 251, 255, 0.42);
          font-size: 13px;
          font-weight: 950;
        }

        .case-footer a {
          color: #67e8f9;
          font-weight: 950;
          text-decoration: none;
        }

        .dark-section {
          width: 100%;
          padding-left: max(16px, calc((100vw - 1180px) / 2));
          padding-right: max(16px, calc((100vw - 1180px) / 2));
          background: rgba(0, 0, 0, 0.22);
        }

        .proof-grid,
        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .proof-grid article,
        .service-card {
          padding: 24px;
        }

        .proof-grid span,
        .service-card span {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .proof-grid h3 {
          font-size: 25px;
          letter-spacing: -0.045em;
          margin: 16px 0 10px;
        }

        .service-card {
          display: flex;
          min-height: 230px;
          color: #ffffff;
          text-decoration: none;
          flex-direction: column;
          justify-content: space-between;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .service-card:hover {
          transform: translateY(-3px);
          border-color: rgba(103, 232, 249, 0.35);
          background: rgba(255, 255, 255, 0.1);
        }

        .service-card strong {
          color: #ffffff;
          display: block;
          font-size: 26px;
          line-height: 1.05;
          letter-spacing: -0.045em;
          margin: 18px 0 10px;
        }

        .comparison-section {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 16px;
        }

        .comparison-card,
        .keyword-card {
          padding: 28px;
        }

        .keyword-card {
          display: grid;
          gap: 10px;
          align-content: start;
        }

        .keyword-card strong {
          font-size: 22px;
          margin-bottom: 4px;
        }

        .keyword-card span {
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.07);
          color: rgba(248, 251, 255, 0.78);
          font-weight: 850;
        }

        .final-cta {
          width: min(1180px, calc(100% - 32px));
          margin: 20px auto 80px;
          padding: clamp(28px, 5vw, 54px);
          background:
            radial-gradient(circle at top right, rgba(103, 232, 249, 0.18), transparent 22rem),
            rgba(255, 255, 255, 0.08);
          text-align: left;
        }

        @media (max-width: 940px) {
          .nav,
          .hero,
          .intro-section,
          .case-top,
          .case-body,
          .comparison-section {
            grid-template-columns: 1fr;
          }

          .nav {
            align-items: flex-start;
            flex-direction: column;
          }

          .nav-links {
            justify-content: flex-start;
          }

          .hero {
            min-height: auto;
            padding-top: 28px;
          }

          .hero-visual {
            min-height: auto;
          }

          .proof-grid,
          .service-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .metric-grid,
          .mini-grid {
            grid-template-columns: 1fr;
          }

          .case-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .nav-links a,
          .primary,
          .secondary {
            width: 100%;
          }

          .hero-actions,
          .nav-links {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}