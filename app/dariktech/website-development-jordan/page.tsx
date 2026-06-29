import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://getdarik.com";
const pagePath = "/dariktech/website-development-jordan";
const pageUrl = `${siteUrl}${pagePath}`;

export const metadata: Metadata = {
  title: "Website Development Jordan | Business Websites & Web Apps",
  description:
    "Darik Technologies builds websites and web apps in Jordan for businesses that need landing pages, company sites, booking systems, portals, dashboards, and backend-connected web platforms.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Website Development in Jordan | Darik Technologies",
    description:
      "Business websites, landing pages, web apps, portals, dashboards, and backend-connected systems for companies in Jordan.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
  },
  keywords: [
    "website development Jordan",
    "website developer Jordan",
    "web developer Jordan",
    "website design Jordan",
    "business website Jordan",
    "web app development Jordan",
    "Next.js developer Jordan",
    "website developer Amman",
    "company website Jordan",
    "landing page development Jordan"
],
};

const sections = [
  {
    "title": "Business Websites",
    "text": "Professional websites for companies, clinics, service businesses, agencies, shops, and local brands.",
    "tags": [
      "Company site",
      "Services",
      "Contact",
      "Trust"
    ]
  },
  {
    "title": "Landing Pages",
    "text": "Focused pages for offers, app launches, ads, client acquisition, service explanations, and quote requests.",
    "tags": [
      "Leads",
      "Offers",
      "Quotes",
      "Campaigns"
    ]
  },
  {
    "title": "Web Apps",
    "text": "Browser-based platforms for users, staff, vendors, managers, or customers who need access from desktop or mobile.",
    "tags": [
      "Portals",
      "Users",
      "Dashboards",
      "Forms"
    ]
  },
  {
    "title": "Booking Systems",
    "text": "Appointment, reservation, request, and scheduling flows connected to a business dashboard.",
    "tags": [
      "Booking",
      "Calendar",
      "Requests",
      "Scheduling"
    ]
  },
  {
    "title": "SEO Structure",
    "text": "Clean page structure, metadata, service pages, internal links, sitemap support, and search-focused content.",
    "tags": [
      "SEO",
      "Metadata",
      "Sitemap",
      "Internal links"
    ]
  },
  {
    "title": "Backend Controls",
    "text": "Admin panels, data management, forms, uploads, role access, and dashboards where needed.",
    "tags": [
      "Admin",
      "Database",
      "Roles",
      "Reports"
    ]
  }
] as const;

const faqs = [
  {
    "q": "Do you build business websites in Jordan?",
    "a": "Yes. Darik Technologies can build business websites, service pages, landing pages, company websites, and web apps for Jordan-based businesses."
  },
  {
    "q": "Can the website include booking or forms?",
    "a": "Yes. A website can include quote forms, booking requests, contact forms, uploads, customer portals, and admin controls."
  },
  {
    "q": "Can you build a website and admin dashboard together?",
    "a": "Yes. The public website can connect to a private admin dashboard for managing leads, requests, bookings, users, and business data."
  },
  {
    "q": "Can you build SEO pages?",
    "a": "Yes. Service pages, location pages, metadata, internal links, and sitemap structure can be planned into the website."
  },
  {
    "q": "How much does a website cost in Jordan?",
    "a": "The price depends on whether it is a simple website, SEO landing page, web app, booking system, portal, or backend-connected business platform."
  }
] as const;

const relatedPages = [
  {
    "label": "Location page",
    "title": "App Developer in Jordan",
    "href": "/dariktech/app-developer-jordan",
    "text": "Main Jordan SEO page for app development, marketplaces, dashboards, backend systems, and business software."
  },
  {
    "label": "Regional page",
    "title": "App Developer in Dubai",
    "href": "/dariktech/app-developer-dubai",
    "text": "Dubai-focused page for businesses that need app systems, admin dashboards, and web platforms."
  },
  {
    "label": "Full service",
    "title": "Mobile + Web + Admin",
    "href": "/dariktech/services/mobile-web-admin",
    "text": "The main service page explaining how Darik Technologies builds connected apps, websites, dashboards, and backend systems."
  },
  {
    "label": "Service page",
    "title": "Mobile App Development Jordan",
    "href": "/dariktech/mobile-app-development-jordan",
    "text": "SEO page focused on iOS, Android, customer apps, staff apps, and connected mobile systems."
  },
  {
    "label": "Service page",
    "title": "Admin Dashboard Development Jordan",
    "href": "/dariktech/admin-dashboard-development-jordan",
    "text": "SEO page focused on dashboards, internal tools, admin panels, and operations software."
  }
] as const;

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
        "web app development",
        "admin dashboards",
        "business software",
        "marketplace platforms",
      ],
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Website Development in Jordan",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      areaServed: {
        "@type": "Country",
        name: "Jordan",
      },
      serviceType: [
        "Website development",
        "Web app development",
        "Business website development",
        "Landing page development",
        "Company portal development"
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
          name: "Website Development Jordan",
          item: pageUrl,
        },
      ],
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

export default function WebsiteDevelopmentJordanPage() {
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
            <small>Business software built properly</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Page sections">
          <a href="#services">Services</a>
          <a href="#why">Why it matters</a>
          <a href="#related">Related pages</a>
          <a href="#faq">FAQ</a>
          <a className="quote-link" href="mailto:jjasaleh14@aol.com?subject=Website%20Development%20Quote%20in%20Jordan">
            Free quote
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Website development Jordan</p>
          <h1>Business websites and web apps built to convert and operate.</h1>
          <p className="hero-text">
            Darik Technologies builds websites and web apps in Jordan for businesses that need a professional online presence, lead capture, booking flows, service pages, admin portals, and backend-connected tools.
          </p>

          <div className="hero-actions">
            <a className="primary" href="mailto:jjasaleh14@aol.com?subject=Website%20Development%20Quote%20in%20Jordan">
              Start your free quote
            </a>
            <Link className="secondary" href="/dariktech/services/mobile-web-admin">
              See full service
            </Link>
          </div>

          <div className="hero-points" aria-label="Website development Jordan focus areas">
            <span>Business websites</span><span>Landing pages</span><span>Web apps</span><span>Portals</span><span>Backend connected</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Website development system preview">
          <div className="system-card main-card">
            <span>Website system</span>
            <strong>Site + Forms + Control</strong>
            <p>Your website should help customers understand, contact, book, request, and trust your business.</p>
          </div>
          <div className="mini-grid">
            <div><small>SEO</small><strong>Service pages</strong></div><div><small>Sales</small><strong>Lead capture</strong></div><div><small>Portal</small><strong>User access</strong></div><div><small>Admin</small><strong>Backend control</strong></div>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="why">
        <div>
          <p className="eyebrow">SEO service page</p>
          <h2>A website should be more than an online business card.</h2>
        </div>
        <p>
          A good business website helps people find you, understand what you offer, trust your work, and take action. For some companies, the website also needs portals, dashboards, forms, booking systems, uploads, and internal controls. This page targets website development in Jordan for businesses that need a site with real purpose.
        </p>
      </section>

      <section className="section" id="services">
        <div className="section-head">
          <p className="eyebrow">What we build</p>
          <h2>Website development services for Jordan-based businesses.</h2>
          <p>
            Build a professional website or web app that supports your business goals, search visibility, and customer flow.
          </p>
        </div>

        <div className="services-grid">
          {sections.map((section) => (
            <article className="service-card" key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
              <div className="tag-row">
                {section.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-section">
        <div className="section-head">
          <p className="eyebrow">Real business systems</p>
          <h2>Built for customers and business operations.</h2>
          <p>
            The goal is a website or web app that supports trust, lead generation, booking, requests, admin control, and the next step in your business workflow.
          </p>
        </div>

        <div className="work-grid">
          <Link className="work-card" href="/dariktech/work/darik-marketplace">
            <span>Marketplace platform</span>
            <h3>Darik Marketplace</h3>
            <p>
              Customer app, retailer inventory app, driver delivery app, admin dashboard, returns, support, and operations.
            </p>
            <strong>View project →</strong>
          </Link>

          <Link className="work-card" href="/dariktech/work/partbid">
            <span>Quote marketplace</span>
            <h3>PartBid</h3>
            <p>
              A structured auto-parts quote platform with buyer requests, supplier offers, photos, delivery details, and chat flow.
            </p>
            <strong>View project →</strong>
          </Link>

          <Link className="work-card" href="/dariktech/services/mobile-web-admin">
            <span>Complete service</span>
            <h3>Mobile + Web + Admin</h3>
            <p>
              One connected service page for businesses that need mobile apps, web portals, dashboards, and backend systems.
            </p>
            <strong>View service →</strong>
          </Link>
        </div>
      </section>

      <section className="section location-section">
        <div className="location-card">
          <p className="eyebrow">Jordan SEO focus</p>
          <h2>Website development for Jordan and Amman businesses.</h2>
          <p>
            This page targets searches around website development in Jordan, website developer in Jordan, web app development in Jordan, business website development, landing pages, and website development in Amman.
          </p>
        </div>
        <div className="keyword-card">
          <strong>Target searches</strong>
          <span>website development Jordan</span><span>website developer Jordan</span><span>web developer Jordan</span><span>business website Jordan</span><span>website developer Amman</span>
        </div>
      </section>

      <section className="section related-section" id="related">
        <div className="section-head">
          <p className="eyebrow">Related pages</p>
          <h2>More Darik Technologies SEO pages.</h2>
          <p>
            These pages connect the main Darik Technologies site, location pages, and service pages together so Google can understand what the business builds.
          </p>
        </div>

        <div className="related-grid">
          {relatedPages.map((page) => (
            <Link className="related-card" href={page.href} key={page.href}>
              <span>{page.label}</span>
              <strong>{page.title}</strong>
              <p>{page.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Questions about website development in Jordan.</h2>
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
        <h2>Need website development in Jordan?</h2>
        <p>
          Send the business type, pages needed, and what customers should do on the website. Darik Technologies can prepare a practical quote and launch plan.
        </p>
        <div className="hero-actions">
          <a className="primary" href="mailto:jjasaleh14@aol.com?subject=Website%20Development%20Quote%20in%20Jordan">
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
          font-size: clamp(46px, 7vw, 82px);
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
          font-size: 40px;
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
        .related-card,
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
          max-width: 780px;
          margin-bottom: 28px;
        }

        .services-grid,
        .work-grid,
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .service-card,
        .work-card,
        .related-card {
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
        .related-card p,
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

        .work-card,
        .related-card {
          min-height: 238px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .work-card:hover,
        .related-card:hover {
          transform: translateY(-3px);
          border-color: rgba(103, 232, 249, 0.35);
          background: rgba(255, 255, 255, 0.1);
        }

        .work-card span,
        .related-card span {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .work-card strong,
        .related-card strong {
          color: #67e8f9;
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
          .related-grid {
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