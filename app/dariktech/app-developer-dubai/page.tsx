import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://getdarik.com";
const pagePath = "/dariktech/app-developer-dubai";
const pageUrl = `${siteUrl}${pagePath}`;

export const metadata: Metadata = {
  title: "App Developer in Dubai | Mobile Apps, Web Apps & Admin Systems",
  description:
    "Darik Technologies builds complete app systems for Dubai businesses: mobile apps, web apps, marketplaces, admin dashboards, backend databases, booking platforms, and business automation.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "App Developer in Dubai | Mobile Apps, Web Apps & Admin Systems",
    description:
      "Custom mobile apps, web apps, dashboards, marketplaces, and backend systems built for Dubai businesses and regional companies.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
  },
  keywords: [
    "app developer Dubai",
    "mobile app developer Dubai",
    "app development company Dubai",
    "mobile app development Dubai",
    "business app developer Dubai",
    "marketplace app developer Dubai",
    "admin dashboard developer Dubai",
    "web app developer Dubai",
    "custom software developer Dubai",
    "software development company Dubai",
    "UAE app developer",
  ],
};

const services = [
  {
    title: "Mobile Apps for Dubai Businesses",
    text: "Customer apps, staff apps, driver apps, supplier apps, booking apps, marketplace apps, and business apps built for iOS and Android.",
    tags: ["iOS", "Android", "Business Apps", "React Native"],
  },
  {
    title: "Web Apps + Portals",
    text: "Browser-based portals for clients, employees, vendors, managers, branches, and partners who need clean access from desktop or mobile.",
    tags: ["Next.js", "Client Portals", "Staff Portals", "Web Apps"],
  },
  {
    title: "Admin Dashboards",
    text: "Private control panels for users, orders, quotes, bookings, approvals, payments, reports, support, and internal operations.",
    tags: ["Admin", "Operations", "Reports", "Approvals"],
  },
  {
    title: "Marketplace Platforms",
    text: "Multi-sided platforms where customers submit requests, vendors respond, admins control quality, and the business owns the workflow.",
    tags: ["Marketplace", "Vendors", "Quotes", "Orders"],
  },
  {
    title: "Backend + Database Systems",
    text: "Secure databases, login systems, user roles, permissions, storage, notifications, API integrations, and real business logic.",
    tags: ["Database", "Auth", "Storage", "Backend"],
  },
  {
    title: "Business Automation",
    text: "Custom tools that replace spreadsheets, manual approvals, WhatsApp chaos, and disconnected paperwork with one organized system.",
    tags: ["Automation", "Workflow", "Internal Tools", "Control"],
  },
];

const industries = [
  "Clinics and dental centers",
  "Restaurants and hospitality",
  "Retail and ecommerce",
  "Delivery and logistics",
  "Real estate and property services",
  "Car rental and automotive",
  "Service companies",
  "Internal company operations",
];

const projects = [
  {
    name: "Darik Marketplace",
    type: "Commerce + delivery platform",
    text: "A complete marketplace ecosystem with customer shopping, retailer inventory, driver delivery, returns, support, admin operations, and finance controls.",
    href: "/dariktech/work/darik-marketplace",
  },
  {
    name: "PartBid",
    type: "Quote-request marketplace",
    text: "A structured request-and-quote platform where buyers post one request and suppliers respond with organized offers, photos, warranty, and delivery terms.",
    href: "/dariktech/work/partbid",
  },
  {
    name: "Business Operations Tools",
    type: "Internal company systems",
    text: "Custom dashboards and workflow tools for approvals, reporting, discrepancy tracking, quote requests, support, and daily operational control.",
    href: "/dariktech#work",
  },
];

const process = [
  {
    title: "Define the business model",
    text: "We clarify who uses the app, what each role needs, how the company makes money, and what the system must control.",
  },
  {
    title: "Plan the product structure",
    text: "We map screens, user journeys, database tables, admin actions, notifications, reports, and launch scope before development.",
  },
  {
    title: "Build the connected system",
    text: "Mobile app, web portal, admin dashboard, backend, database, storage, and permissions are built as one product.",
  },
  {
    title: "Prepare for launch",
    text: "We test real workflows, clean up edge cases, prepare the admin side, and make the system practical for daily use.",
  },
];

const faqs = [
  {
    q: "Do you build mobile apps for Dubai businesses?",
    a: "Yes. Darik Technologies builds custom mobile apps, web apps, admin dashboards, marketplaces, and backend systems for businesses targeting Dubai and the wider UAE market.",
  },
  {
    q: "Can you build a full app system, not just the mobile app?",
    a: "Yes. Many business apps need a mobile app, web portal, admin dashboard, database, user roles, notifications, storage, reports, and backend logic. We focus on the full system.",
  },
  {
    q: "Do you need to be physically in Dubai to build the app?",
    a: "No. Most planning, development, testing, and delivery can be handled remotely. If the project requires local launch planning, the workflow can still be structured around the Dubai market.",
  },
  {
    q: "Can you build marketplace apps for Dubai?",
    a: "Yes. We can build marketplaces, quote platforms, booking systems, delivery systems, vendor portals, and admin dashboards for Dubai-focused businesses.",
  },
  {
    q: "How much does app development in Dubai cost?",
    a: "Cost depends on the scope. A basic app is different from a full platform with backend logic, multiple user roles, admin controls, notifications, reports, and payment or API integrations. The best first step is a scope-based quote.",
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
          name: "United Arab Emirates",
        },
        {
          "@type": "City",
          name: "Dubai",
        },
        {
          "@type": "Place",
          name: "Middle East",
        },
      ],
      knowsAbout: [
        "mobile app development",
        "web app development",
        "admin dashboards",
        "marketplace platforms",
        "business automation",
        "backend systems",
        "database design",
      ],
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "App Development in Dubai",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      areaServed: {
        "@type": "City",
        name: "Dubai",
      },
      serviceType: [
        "Mobile app development",
        "Web app development",
        "Admin dashboard development",
        "Marketplace app development",
        "Backend development",
        "Business automation",
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

export default function AppDeveloperDubaiPage() {
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
          <a href="#industries">Industries</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#faq">FAQ</a>
          <a
            className="quote-link"
            href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Dubai"
          >
            Free quote
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">App developer in Dubai</p>
          <h1>
            Complete app systems for Dubai businesses that need more than screens.
          </h1>
          <p className="hero-text">
            Darik Technologies builds mobile apps, web apps, admin dashboards,
            marketplaces, backend databases, booking systems, quote platforms,
            and workflow tools for businesses targeting Dubai and the UAE market.
          </p>

          <div className="hero-actions">
            <a
              className="primary"
              href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Dubai"
            >
              Start your Dubai app quote
            </a>
            <a className="secondary" href="#work">
              View examples
            </a>
          </div>

          <div className="hero-points" aria-label="Dubai app development services">
            <span>Mobile apps</span>
            <span>Web portals</span>
            <span>Admin dashboards</span>
            <span>Marketplaces</span>
            <span>Backend systems</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Dubai business app system preview">
          <div className="system-card main-card">
            <span>Dubai business app build</span>
            <strong>App + Dashboard + Backend</strong>
            <p>
              A complete product system for customers, staff, vendors, admins,
              and operations.
            </p>
          </div>
          <div className="mini-grid">
            <div>
              <small>Customer</small>
              <strong>Mobile experience</strong>
            </div>
            <div>
              <small>Company</small>
              <strong>Admin dashboard</strong>
            </div>
            <div>
              <small>Backend</small>
              <strong>Roles + database</strong>
            </div>
            <div>
              <small>Growth</small>
              <strong>Built to scale</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section">
        <div>
          <p className="eyebrow">Dubai app development</p>
          <h2>
            A premium market needs apps that feel like real operating systems.
          </h2>
        </div>
        <p>
          Dubai businesses often need speed, polish, clear operations, and room
          to scale. A serious app should not be just a front-end design. It
          should include the customer experience, internal controls, backend
          structure, data flow, admin actions, and the business logic that keeps
          everything working.
        </p>
      </section>

      <section className="section" id="services">
        <div className="section-head">
          <p className="eyebrow">Services</p>
          <h2>App development services for Dubai and UAE-focused businesses.</h2>
          <p>
            Build the app, portal, admin dashboard, backend, and operational
            workflow as one connected system.
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

      <section className="section industries-section" id="industries">
        <div className="industry-copy">
          <p className="eyebrow">Built for real businesses</p>
          <h2>Dubai app ideas that need operational structure.</h2>
          <p>
            The same development approach can be used for service businesses,
            restaurants, clinics, marketplaces, logistics, booking platforms,
            internal company tools, and investor-ready MVPs.
          </p>
        </div>

        <div className="industry-list">
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </section>

      <section className="section dark-section" id="work">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2>Examples of systems Darik Technologies can build.</h2>
          <p>
            These projects show the difference between a basic app and a full
            business platform with roles, workflows, backend data, and admin
            control.
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
          <h2>How a Dubai app idea becomes a real launch-ready system.</h2>
          <p>
            The goal is to build the right product from the start, not a pile of
            features that becomes hard to operate later.
          </p>
        </div>

        <div className="process-list">
          {process.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section location-section">
        <div className="location-card">
          <p className="eyebrow">Dubai SEO focus</p>
          <h2>Built for businesses searching for app development in Dubai.</h2>
          <p>
            This page targets app developer Dubai, mobile app development Dubai,
            app development company Dubai, web app developer Dubai, admin
            dashboard developer Dubai, marketplace app developer Dubai, and
            custom software development for UAE-focused businesses.
          </p>
        </div>
        <div className="keyword-card">
          <strong>Target searches</strong>
          <span>app developer Dubai</span>
          <span>mobile app developer Dubai</span>
          <span>app development company Dubai</span>
          <span>marketplace app developer Dubai</span>
          <span>admin dashboard developer Dubai</span>
          <span>UAE app developer</span>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Questions before building an app for Dubai.</h2>
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
        <h2>Need an app developer for Dubai?</h2>
        <p>
          Send the app idea, the business goal, the users, and what the platform
          needs to do. Darik Technologies can help shape the scope and build the
          launch version.
        </p>
        <div className="hero-actions">
          <a
            className="primary"
            href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Dubai"
          >
            Request a Dubai app quote
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
          background: #050b14;
        }

        .seo-page {
          min-height: 100vh;
          color: #f8fbff;
          background:
            radial-gradient(circle at 12% 8%, rgba(245, 158, 11, 0.22), transparent 26rem),
            radial-gradient(circle at 86% 12%, rgba(103, 232, 249, 0.16), transparent 30rem),
            radial-gradient(circle at 60% 100%, rgba(37, 99, 235, 0.22), transparent 34rem),
            linear-gradient(180deg, #050b14 0%, #081827 48%, #050b14 100%);
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
          background: #fbbf24;
          box-shadow: 0 18px 48px rgba(251, 191, 36, 0.16);
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
          color: #fbbf24;
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
            radial-gradient(circle at top right, rgba(251, 191, 36, 0.18), transparent 18rem),
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
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(255, 247, 237, 0.92));
          color: #06101d;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.24);
        }

        .main-card span {
          color: #d97706;
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
        .final-cta,
        .industry-copy,
        .industry-list {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.07);
          border-radius: 24px;
        }

        .mini-grid div {
          padding: 16px;
        }

        .mini-grid small {
          color: #fbbf24;
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

        .intro-section,
        .industries-section,
        .location-section {
          display: grid;
          grid-template-columns: 0.94fr 1.06fr;
          gap: 36px;
          align-items: start;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .intro-section h2,
        .section-head h2,
        .industry-copy h2,
        .location-card h2,
        .final-cta h2 {
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.065em;
          margin-bottom: 14px;
        }

        .intro-section > p,
        .section-head p,
        .industry-copy p,
        .location-card p,
        .final-cta p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.75;
          font-size: 16px;
        }

        .section-head {
          max-width: 780px;
          margin-bottom: 28px;
        }

        .services-grid,
        .work-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .service-card,
        .work-card,
        .industry-copy,
        .industry-list {
          padding: 24px;
          color: #ffffff;
          text-decoration: none;
        }

        .service-card h3,
        .work-card h3,
        .process-list h3 {
          font-size: 25px;
          letter-spacing: -0.045em;
          margin-bottom: 12px;
        }

        .service-card p,
        .work-card p,
        .process-list p,
        details p {
          color: rgba(248, 251, 255, 0.66);
          line-height: 1.65;
        }

        .tag-row {
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .industry-list {
          display: grid;
          gap: 10px;
        }

        .industry-list span,
        .keyword-card span {
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.07);
          color: rgba(248, 251, 255, 0.78);
          font-weight: 850;
        }

        .dark-section {
          width: 100%;
          padding-left: max(16px, calc((100vw - 1180px) / 2));
          padding-right: max(16px, calc((100vw - 1180px) / 2));
          background: rgba(0, 0, 0, 0.2);
        }

        .work-card {
          min-height: 280px;
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
          border-color: rgba(251, 191, 36, 0.36);
          background: rgba(255, 255, 255, 0.1);
        }

        .work-card span {
          color: #fbbf24;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .work-card strong {
          color: #fbbf24;
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
          background: #fbbf24;
          color: #06101d;
          font-weight: 950;
          margin-bottom: 16px;
        }

        .process-list p {
          margin-bottom: 0;
        }

        .location-section {
          grid-template-columns: 1.1fr 0.9fr;
        }

        .location-card,
        .keyword-card {
          padding: 26px;
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
            radial-gradient(circle at top right, rgba(251, 191, 36, 0.18), transparent 22rem),
            rgba(255, 255, 255, 0.08);
          text-align: left;
        }

        @media (max-width: 940px) {
          .nav,
          .hero,
          .intro-section,
          .industries-section,
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