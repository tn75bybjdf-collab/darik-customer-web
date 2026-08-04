import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://getdarik.com";
const pagePath = "/dariktech/app-developer-jordan";
const pageUrl = `${siteUrl}${pagePath}`;

export const metadata: Metadata = {
  title:
    "App Developer in Jordan | Business Apps, Marketplaces & Admin Dashboards",
  description:
    "Darik Technologies builds complete business app systems in Jordan: mobile apps, web apps, admin dashboards, marketplaces, booking systems, quote platforms, and backend databases.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title:
      "App Developer in Jordan | Business Apps, Marketplaces & Admin Dashboards",
    description:
      "Mobile apps, web apps, dashboards, marketplaces, and backend systems built for real business operations in Jordan.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
  },
  keywords: [
    "app developer Jordan",
    "mobile app developer Jordan",
    "app development company Jordan",
    "app developer Amman",
    "business app developer Jordan",
    "marketplace app developer Jordan",
    "admin dashboard developer Jordan",
    "web app developer Jordan",
    "custom software developer Jordan",
    "software company Jordan",
  ],
};

const services = [
  {
    title: "Mobile Apps",
    text: "iOS and Android apps for customers, staff, drivers, suppliers, clinics, restaurants, retailers, and internal teams.",
    tags: ["iOS", "Android", "Expo", "React Native"],
  },
  {
    title: "Web Apps",
    text: "Fast browser-based portals for customers, employees, vendors, managers, and public users who need desktop access.",
    tags: ["Next.js", "Portals", "Dashboards", "Forms"],
  },
  {
    title: "Admin Dashboards",
    text: "Private control panels for orders, approvals, users, payouts, reports, support, quote requests, and daily operations.",
    tags: ["Admin", "Reports", "Approvals", "Operations"],
  },
  {
    title: "Marketplaces",
    text: "Two-sided and multi-vendor platforms where customers request, suppliers respond, admins control quality, and data stays organized.",
    tags: ["Vendors", "Quotes", "Orders", "Revenue"],
  },
  {
    title: "Backend + Database",
    text: "Authentication, roles, permissions, storage, real-time data, notifications, and business logic built around your workflow.",
    tags: ["Supabase", "Database", "Storage", "Auth"],
  },
  {
    title: "Business Automation",
    text: "Internal tools that reduce manual work, track discrepancies, organize approvals, and make company operations easier to run.",
    tags: ["Workflow", "Automation", "Internal Tools", "Control"],
  },
];

const projects = [
  {
    name: "Darik Marketplace",
    type: "Retail marketplace platform",
    text: "A multi-app marketplace system with customer shopping, retailer inventory, driver delivery, returns, support, admin operations, and finance controls.",
    href: "/dariktech/work/darik-marketplace",
  },
  {
    name: "PartBid",
    type: "Auto parts quote platform",
    text: "A quote-request marketplace where buyers submit one structured request and suppliers send organized offers with price, delivery, warranty, and photos.",
    href: "/dariktech/work/partbid",
  },
  {
    name: "Tawleh Manager",
    type: "Restaurant ordering system",
    text: "A QR-based dine-in ordering system built around tables, orders, waiter visibility, and branch operations.",
    href: "/dariktech#work",
  },
];

const process = [
  "Understand the business workflow, users, roles, and money flow.",
  "Plan the screens, database, admin controls, and launch scope.",
  "Build the mobile app, web app, backend, and dashboard as one connected system.",
  "Test real scenarios before launch, then improve based on how people actually use it.",
];

const faqs = [
  {
    q: "Do you build mobile apps in Jordan?",
    a: "Yes. Darik Technologies builds mobile apps for Jordan-based businesses, including customer apps, staff apps, supplier apps, driver apps, booking apps, ordering systems, and internal tools.",
  },
  {
    q: "Can you build the backend and admin dashboard too?",
    a: "Yes. A serious business app usually needs more than screens. We can build the backend, database, user roles, permissions, storage, notifications, reports, and admin dashboard.",
  },
  {
    q: "Do you build marketplace apps?",
    a: "Yes. We build marketplace platforms where customers, vendors, suppliers, drivers, admins, or support teams each have their own workflows.",
  },
  {
    q: "Can you work with businesses outside Amman?",
    a: "Yes. The system can be planned remotely, and the product can be built for businesses across Jordan and the wider region.",
  },
  {
    q: "How much does an app cost in Jordan?",
    a: "The price depends on the scope. A simple app is very different from a full system with mobile apps, dashboards, backend logic, database, notifications, and admin controls. The first step is a clear quote based on what the business needs.",
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
        "web app development",
        "admin dashboards",
        "marketplace apps",
        "business automation",
        "backend systems",
      ],
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "App Development in Jordan",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      areaServed: {
        "@type": "Country",
        name: "Jordan",
      },
      serviceType: [
        "Mobile app development",
        "Web app development",
        "Admin dashboard development",
        "Marketplace app development",
        "Backend development",
      ],
      url: pageUrl,
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ],
};

export default function AppDeveloperJordanPage() {
  return (
    <main className="seo-page">
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
            <small>Business apps built properly</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Page sections">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#faq">FAQ</a>
          <a className="quote-link" href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Jordan">
            Free quote
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">App developer in Jordan</p>
          <h1>
            Business apps, marketplaces, and admin dashboards built for real
            operations.
          </h1>
          <p className="hero-text">
            Darik Technologies builds complete app systems for businesses in
            Jordan: mobile apps, web apps, backend databases, admin dashboards,
            quote platforms, booking systems, delivery workflows, and internal
            company tools.
          </p>

          <div className="hero-actions">
            <a className="primary" href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Jordan">
              Start your free quote
            </a>
            <a className="secondary" href="#work">
              View examples
            </a>
          </div>

          <div className="hero-points" aria-label="App development services in Jordan">
            <span>Mobile apps</span>
            <span>Web apps</span>
            <span>Admin dashboards</span>
            <span>Marketplaces</span>
            <span>Backend systems</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Business app system preview">
          <div className="system-card main-card">
            <span>Jordan business app system</span>
            <strong>Mobile + Web + Admin</strong>
            <p>One connected product, not scattered screens.</p>
          </div>
          <div className="mini-grid">
            <div>
              <small>App</small>
              <strong>Customer flow</strong>
            </div>
            <div>
              <small>Dashboard</small>
              <strong>Admin control</strong>
            </div>
            <div>
              <small>Backend</small>
              <strong>Database logic</strong>
            </div>
            <div>
              <small>Launch</small>
              <strong>Real workflow</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section">
        <div>
          <p className="eyebrow">Why this page exists</p>
          <h2>Looking for an app developer in Jordan should not mean hiring someone who only makes screens.</h2>
        </div>
        <p>
          A serious business app needs user roles, database structure, backend
          logic, admin controls, notifications, files, reports, and a workflow
          that matches how the company actually operates. Darik Technologies
          focuses on complete business app systems, not unfinished prototypes.
        </p>
      </section>

      <section className="section" id="services">
        <div className="section-head">
          <p className="eyebrow">Services</p>
          <h2>App development services for Jordan-based businesses.</h2>
          <p>
            Build the customer-facing app, internal dashboard, backend database,
            and operational logic as one connected system.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="tag-row">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-section" id="work">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2>Examples of business app systems Darik Technologies can build.</h2>
          <p>
            Use these case studies to understand the level of product thinking,
            backend logic, and admin control that can go into your project.
          </p>
        </div>

        <div className="work-grid">
          {projects.map((project) => (
            <Link className="work-card" href={project.href} key={project.name}>
              <span>{project.type}</span>
              <h3>{project.name}</h3>
              <p>{project.text}</p>
              <strong>View project →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="section-head">
          <p className="eyebrow">Process</p>
          <h2>How we turn an app idea into a real product.</h2>
          <p>
            The goal is to avoid wasted money, confusing features, and apps that
            look nice but cannot run daily business operations.
          </p>
        </div>

        <div className="process-list">
          {process.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section location-section">
        <div className="location-card">
          <p className="eyebrow">Jordan + Amman SEO focus</p>
          <h2>Built for businesses searching for app development in Jordan.</h2>
          <p>
            This page is intentionally focused on app development in Jordan,
            mobile app development in Jordan, web app development in Jordan,
            admin dashboard development, marketplace apps, and business
            automation for local and regional companies.
          </p>
        </div>
        <div className="keyword-card">
          <strong>Target searches</strong>
          <span>app developer Jordan</span>
          <span>mobile app developer Jordan</span>
          <span>app development company Jordan</span>
          <span>admin dashboard developer Jordan</span>
          <span>marketplace app developer Jordan</span>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Questions businesses ask before building an app.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow">Free quote</p>
        <h2>Need an app developer in Jordan?</h2>
        <p>
          Send the business idea, who will use the app, and what the system
          needs to do. Darik Technologies can help shape it into a real launch
          plan.
        </p>
        <div className="hero-actions">
          <a className="primary" href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Jordan">
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
          background: #06101d;
        }

        .seo-page {
          min-height: 100vh;
          color: #f8fbff;
          background:
            radial-gradient(circle at 14% 6%, rgba(37, 99, 235, 0.4), transparent 26rem),
            radial-gradient(circle at 90% 18%, rgba(103, 232, 249, 0.14), transparent 30rem),
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
        p {
          margin-top: 0;
        }

        h1 {
          font-size: clamp(48px, 7vw, 86px);
          line-height: 0.92;
          letter-spacing: -0.075em;
          margin-bottom: 22px;
        }

        .hero-text {
          color: rgba(248, 251, 255, 0.72);
          font-size: 18px;
          line-height: 1.72;
          max-width: 680px;
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

        .main-card {
          margin: 34px auto 26px;
          width: min(390px, 100%);
          min-height: 250px;
          border-radius: 34px;
          padding: 28px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(226, 240, 255, 0.92));
          color: #06101d;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.24);
        }

        .main-card span {
          color: #2563eb;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .main-card strong {
          display: block;
          font-size: 42px;
          line-height: 0.95;
          letter-spacing: -0.06em;
          margin: 20px 0 12px;
        }

        .main-card p {
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
        .service-card,
        .work-card,
        .process-list article,
        .location-card,
        .keyword-card,
        details,
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
        .final-cta h2 {
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.065em;
          margin-bottom: 14px;
        }

        .intro-section > p,
        .section-head p,
        .final-cta p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.75;
          font-size: 16px;
        }

        .section-head {
          max-width: 760px;
          margin-bottom: 28px;
        }

        .services-grid,
        .work-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .service-card,
        .work-card {
          padding: 24px;
          color: #ffffff;
          text-decoration: none;
        }

        .service-card h3,
        .work-card h3 {
          font-size: 25px;
          letter-spacing: -0.045em;
          margin-bottom: 12px;
        }

        .service-card p,
        .work-card p,
        details p {
          color: rgba(248, 251, 255, 0.66);
          line-height: 1.65;
        }

        .tag-row {
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .dark-section {
          width: 100%;
          padding-left: max(16px, calc((100vw - 1180px) / 2));
          padding-right: max(16px, calc((100vw - 1180px) / 2));
          background: rgba(0, 0, 0, 0.2);
        }

        .work-card {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .work-card:hover {
          transform: translateY(-3px);
          border-color: rgba(103, 232, 249, 0.35);
          background: rgba(255, 255, 255, 0.1);
        }

        .work-card span {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .work-card strong {
          color: #67e8f9;
        }

        .process-list {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .process-list article {
          padding: 20px;
        }

        .process-list span {
          display: inline-flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #67e8f9;
          color: #06101d;
          font-weight: 950;
          margin-bottom: 16px;
        }

        .process-list p {
          color: rgba(248, 251, 255, 0.72);
          line-height: 1.62;
          margin-bottom: 0;
        }

        .location-section {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 16px;
        }

        .location-card,
        .keyword-card {
          padding: 26px;
        }

        .location-card h2 {
          font-size: clamp(32px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .location-card p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.75;
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

        .faq-list {
          display: grid;
          gap: 12px;
        }

        details {
          padding: 18px 20px;
        }

        summary {
          cursor: pointer;
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        details p {
          margin: 14px 0 0;
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
          .location-section {
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

          .services-grid,
          .work-grid,
          .process-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .nav-links a,
          .primary,
          .secondary {
            width: 100%;
          }

          .hero-actions,
          .nav-links {
            width: 100%;
          }

          .mini-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}