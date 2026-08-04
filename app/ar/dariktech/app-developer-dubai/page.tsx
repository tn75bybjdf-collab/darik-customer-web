import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://getdarik.com";
const pagePath = "/ar/dariktech/app-developer-dubai";
const pageUrl = `${siteUrl}${pagePath}`;
const englishUrl = `${siteUrl}/dariktech/app-developer-dubai`;

export const metadata: Metadata = {
  title: "شركة تطوير تطبيقات في دبي | تطبيقات جوال وأنظمة أعمال",
  description:
    "Darik Technologies تبني تطبيقات جوال، تطبيقات ويب، لوحات تحكم، أسواق رقمية، قواعد بيانات، وأنظمة أعمال كاملة للشركات التي تستهدف دبي والإمارات.",
  alternates: {
    canonical: pageUrl,
    languages: {
      "ar-AE": pageUrl,
      "en-US": englishUrl,
    },
  },
  openGraph: {
    title: "شركة تطوير تطبيقات في دبي | تطبيقات جوال وأنظمة أعمال",
    description:
      "تطوير تطبيقات جوال وتطبيقات ويب ولوحات تحكم وأسواق رقمية وأنظمة Backend للشركات في دبي والإمارات.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
    locale: "ar_AE",
  },
  keywords: [
    "تطوير تطبيقات في دبي",
    "شركة تطوير تطبيقات في دبي",
    "مبرمج تطبيقات في دبي",
    "مطور تطبيقات في دبي",
    "تطوير تطبيقات جوال في دبي",
    "شركة برمجة تطبيقات في دبي",
    "تطبيقات أعمال في دبي",
    "تطوير تطبيقات في الإمارات",
    "مطور تطبيقات في الإمارات",
    "لوحات تحكم للشركات",
    "تطبيقات أسواق رقمية",
    "تطوير مواقع وتطبيقات في دبي",
  ],
};

const services = [
  {
    title: "تطبيقات جوال للشركات في دبي",
    text: "تطبيقات iOS و Android للعملاء، الموظفين، السائقين، الموردين، الحجوزات، الطلبات، والخدمات اليومية.",
    tags: ["iOS", "Android", "تطبيقات أعمال", "React Native"],
  },
  {
    title: "تطبيقات ويب وبوابات",
    text: "بوابات ويب للعملاء، الموظفين، الموردين، الفروع، الشركاء، والمدراء الذين يحتاجون وصولاً واضحاً من المتصفح.",
    tags: ["Web App", "بوابة عملاء", "بوابة موظفين", "Next.js"],
  },
  {
    title: "لوحات تحكم إدارية",
    text: "لوحات خاصة لإدارة المستخدمين، الطلبات، الحجوزات، العروض، الموافقات، التقارير، الدعم، والصلاحيات.",
    tags: ["Admin", "تقارير", "موافقات", "عمليات"],
  },
  {
    title: "أسواق رقمية ومنصات عروض",
    text: "منصات تربط العملاء بالبائعين أو الموردين، مع طلبات منظمة، عروض أسعار، رسائل، صور، وإدارة من لوحة التحكم.",
    tags: ["Marketplace", "Vendors", "Quotes", "Orders"],
  },
  {
    title: "Backend وقواعد بيانات",
    text: "تسجيل دخول، أدوار مستخدمين، صلاحيات، تخزين ملفات، إشعارات، قواعد بيانات، وتكاملات API حسب حاجة المشروع.",
    tags: ["Database", "Auth", "Storage", "Backend"],
  },
  {
    title: "أتمتة أعمال",
    text: "أنظمة داخلية تستبدل إكسل وواتساب والورق بنظام واضح لإدارة الموافقات، الطلبات، التقارير، وسير العمل.",
    tags: ["Automation", "Workflow", "Internal Tools", "Control"],
  },
];

const industries = [
  "العيادات والمراكز الطبية",
  "المطاعم والضيافة",
  "المتاجر والتجارة الإلكترونية",
  "التوصيل والخدمات اللوجستية",
  "العقارات وخدمات الممتلكات",
  "تأجير السيارات وقطاع السيارات",
  "شركات الخدمات",
  "الأنظمة الداخلية للشركات",
];

const projects = [
  {
    name: "Darik Marketplace",
    type: "منصة تجارة وتوصيل",
    text: "نظام Marketplace كامل فيه تطبيق عملاء، تطبيق تجار، تطبيق سائقين، مخزون، طلبات، مرتجعات، دعم، ولوحة تحكم.",
    href: "/dariktech/work/darik-marketplace",
  },
  {
    name: "PartBid",
    type: "منصة عروض لقطع السيارات",
    text: "منصة منظمة يرسل فيها العميل طلباً واحداً، ثم يستقبل عروضاً من الموردين مع السعر، الصور، التوصيل، والتفاصيل.",
    href: "/dariktech/work/partbid",
  },
  {
    name: "Business Operations Tools",
    type: "أنظمة داخلية للشركات",
    text: "لوحات تحكم وأدوات سير عمل للموافقات، التقارير، متابعة الطلبات، الدعم، وإدارة العمليات اليومية.",
    href: "/dariktech#work",
  },
];

const process = [
  {
    title: "نحدد نموذج العمل",
    text: "نفهم من سيستخدم التطبيق، ما هي الأدوار، كيف تتحرك الطلبات أو الأموال، وما الذي تحتاج الإدارة أن تتحكم به.",
  },
  {
    title: "نخطط بنية النظام",
    text: "نرتب الشاشات، قاعدة البيانات، الصلاحيات، لوحة التحكم، التقارير، الإشعارات، ونطاق نسخة الإطلاق.",
  },
  {
    title: "نبني المنتج المتصل",
    text: "التطبيق، الموقع، لوحة التحكم، Backend، قاعدة البيانات، التخزين، والصلاحيات يتم بناؤها كنظام واحد.",
  },
  {
    title: "نجهز للإطلاق",
    text: "نختبر سيناريوهات حقيقية، نرتب التفاصيل، ونجهز النظام ليكون عملياً للشركة والعملاء بعد الإطلاق.",
  },
];

const faqs = [
  {
    q: "هل تقومون بتطوير تطبيقات للشركات في دبي؟",
    a: "نعم. Darik Technologies تبني تطبيقات جوال، تطبيقات ويب، لوحات تحكم، أسواق رقمية، وأنظمة Backend للشركات التي تستهدف دبي والإمارات.",
  },
  {
    q: "هل يمكن بناء نظام كامل وليس تطبيق جوال فقط؟",
    a: "نعم. كثير من المشاريع تحتاج تطبيق جوال، بوابة ويب، لوحة تحكم، قاعدة بيانات، صلاحيات، إشعارات، تخزين، تقارير، ومنطق تشغيل. لذلك نركز على بناء نظام كامل.",
  },
  {
    q: "هل يجب أن تكون الشركة موجودة فعلياً في دبي؟",
    a: "لا. يمكن تخطيط وبناء النظام عن بعد للشركات التي تستهدف دبي أو الإمارات. المهم هو فهم السوق، المستخدمين، وسير العمل المطلوب.",
  },
  {
    q: "هل تبنون تطبيقات Marketplace في دبي؟",
    a: "نعم. يمكن بناء منصات Marketplace، منصات عروض أسعار، أنظمة حجز، بوابات موردين، أنظمة توصيل، ولوحات تحكم إدارية.",
  },
  {
    q: "كم تكلفة تطوير تطبيق في دبي؟",
    a: "التكلفة تعتمد على نطاق المشروع. تطبيق بسيط يختلف عن نظام كامل فيه قاعدة بيانات، مستخدمين متعددين، لوحة تحكم، إشعارات، تقارير، وتكاملات دفع أو API. أفضل خطوة هي تحديد نطاق العمل ثم إصدار عرض سعر واضح.",
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
        "تطوير تطبيقات جوال",
        "تطوير تطبيقات ويب",
        "لوحات تحكم",
        "أسواق رقمية",
        "أنظمة أعمال",
        "قواعد بيانات",
      ],
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "تطوير تطبيقات في دبي",
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

export default function ArabicAppDeveloperDubaiPage() {
  return (
    <main className="seo-page" dir="rtl" lang="ar-AE">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="nav">
        <Link className="brand" href="/dariktech" aria-label="العودة إلى Darik Technologies">
          <span className="logo-wrap">
            <img src="/dariktech/logo.png" alt="شعار Darik Technologies" />
          </span>
          <span>
            <strong>Darik Technologies</strong>
            <small>أنظمة تطبيقات للشركات</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="أقسام الصفحة">
          <a href="#services">الخدمات</a>
          <a href="#industries">القطاعات</a>
          <a href="#work">الأعمال</a>
          <a href="#process">الطريقة</a>
          <a href="#faq">الأسئلة</a>
          <Link href="/dariktech/app-developer-dubai">English</Link>
          <a
            className="quote-link"
            href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Dubai"
          >
            عرض مجاني
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">شركة تطوير تطبيقات في دبي</p>
          <h1>
            أنظمة تطبيقات كاملة للشركات التي تحتاج أكثر من مجرد تصميم شاشات.
          </h1>
          <p className="hero-text">
            Darik Technologies تبني تطبيقات جوال، تطبيقات ويب، لوحات تحكم،
            أسواق رقمية، قواعد بيانات، أنظمة حجز، منصات عروض، وأدوات تشغيل
            للشركات التي تستهدف دبي والإمارات.
          </p>

          <div className="hero-actions">
            <a
              className="primary"
              href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Dubai"
            >
              اطلب عرض سعر لتطبيقك في دبي
            </a>
            <a className="secondary" href="#work">
              شاهد أمثلة الأعمال
            </a>
          </div>

          <div className="hero-points" aria-label="خدمات تطوير التطبيقات في دبي">
            <span>تطبيقات جوال</span>
            <span>بوابات ويب</span>
            <span>لوحات تحكم</span>
            <span>أسواق رقمية</span>
            <span>Backend</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="نظام تطبيق أعمال في دبي">
          <div className="system-card main-card">
            <span>نظام تطبيق لسوق دبي</span>
            <strong>تطبيق + لوحة تحكم + قاعدة بيانات</strong>
            <p>
              منتج واحد متصل للعملاء، الموظفين، الموردين، الإدارة، والعمليات.
            </p>
          </div>
          <div className="mini-grid">
            <div>
              <small>العميل</small>
              <strong>تجربة جوال ممتازة</strong>
            </div>
            <div>
              <small>الشركة</small>
              <strong>لوحة تحكم واضحة</strong>
            </div>
            <div>
              <small>النظام</small>
              <strong>صلاحيات وقاعدة بيانات</strong>
            </div>
            <div>
              <small>النمو</small>
              <strong>مبني للتوسع</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section">
        <div>
          <p className="eyebrow">تطوير تطبيقات في دبي</p>
          <h2>
            سوق دبي يحتاج تطبيقات مصقولة، واضحة، وقادرة على تشغيل العمليات.
          </h2>
        </div>
        <p>
          الشركات التي تستهدف دبي تحتاج سرعة، مظهر احترافي، إدارة واضحة، ونظام
          قابل للتوسع. التطبيق الجدي ليس واجهة فقط، بل تجربة عميل، لوحة إدارة،
          قاعدة بيانات، صلاحيات، إشعارات، تقارير، ومنطق تشغيل يطابق طريقة
          عمل الشركة.
        </p>
      </section>

      <section className="section" id="services">
        <div className="section-head">
          <p className="eyebrow">الخدمات</p>
          <h2>خدمات تطوير تطبيقات للشركات التي تستهدف دبي والإمارات.</h2>
          <p>
            نبني التطبيق، بوابة الويب، لوحة التحكم، قاعدة البيانات، وسير العمل
            كنظام واحد متصل.
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
          <p className="eyebrow">قطاعات مناسبة</p>
          <h2>أفكار تطبيقات في دبي تحتاج بنية تشغيل واضحة.</h2>
          <p>
            نفس طريقة البناء يمكن استخدامها للخدمات، المطاعم، العيادات،
            الأسواق الرقمية، التوصيل، أنظمة الحجز، الأدوات الداخلية، ومنتجات
            MVP الجاهزة للعرض على المستثمرين.
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
          <p className="eyebrow">أمثلة أعمال</p>
          <h2>أمثلة على أنظمة تستطيع Darik Technologies بناءها.</h2>
          <p>
            هذه المشاريع توضح الفرق بين تطبيق بسيط ونظام أعمال كامل فيه أدوار،
            سير عمل، Backend، بيانات، ولوحة تحكم.
          </p>
        </div>

        <div className="work-grid">
          {projects.map((project) => (
            <Link className="work-card" href={project.href} key={project.name}>
              <span>{project.type}</span>
              <h3>{project.name}</h3>
              <p>{project.text}</p>
              <strong>شاهد المشروع ←</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="section-head">
          <p className="eyebrow">طريقة العمل</p>
          <h2>كيف تتحول فكرة تطبيق لدبي إلى نظام جاهز للإطلاق.</h2>
          <p>
            الهدف هو بناء المنتج الصحيح من البداية، وليس مجموعة ميزات يصعب
            تشغيلها لاحقاً.
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
          <p className="eyebrow">تركيز SEO لدبي</p>
          <h2>صفحة مخصصة للباحثين عن تطوير تطبيقات في دبي.</h2>
          <p>
            هذه الصفحة تستهدف عبارات مثل شركة تطوير تطبيقات في دبي، مبرمج
            تطبيقات في دبي، تطوير تطبيقات جوال في دبي، تطبيقات أعمال، أسواق
            رقمية، لوحات تحكم، وأنظمة Backend للشركات في الإمارات.
          </p>
        </div>
        <div className="keyword-card">
          <strong>عبارات البحث المستهدفة</strong>
          <span>تطوير تطبيقات في دبي</span>
          <span>شركة تطوير تطبيقات في دبي</span>
          <span>مبرمج تطبيقات في دبي</span>
          <span>تطبيقات أعمال في دبي</span>
          <span>تطوير تطبيقات في الإمارات</span>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">أسئلة شائعة</p>
          <h2>أسئلة قبل بناء تطبيق لسوق دبي.</h2>
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
        <p className="eyebrow">عرض سعر مجاني</p>
        <h2>تحتاج شركة تطوير تطبيقات في دبي؟</h2>
        <p>
          أرسل فكرة التطبيق، هدف المشروع، من سيستخدمه، وما الذي يجب أن يفعله
          النظام. Darik Technologies يمكنها تحويل الفكرة إلى نطاق واضح ونسخة
          إطلاق عملية.
        </p>
        <div className="hero-actions">
          <a
            className="primary"
            href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Dubai"
          >
            اطلب عرض سعر لتطبيقك في دبي
          </a>
          <Link className="secondary" href="/dariktech">
            العودة إلى Darik Technologies
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
            radial-gradient(circle at 86% 8%, rgba(245, 158, 11, 0.24), transparent 26rem),
            radial-gradient(circle at 12% 12%, rgba(103, 232, 249, 0.16), transparent 30rem),
            radial-gradient(circle at 40% 100%, rgba(37, 99, 235, 0.22), transparent 34rem),
            linear-gradient(180deg, #050b14 0%, #081827 48%, #050b14 100%);
          font-family: Inter, "Segoe UI", Tahoma, Arial, sans-serif;
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
          letter-spacing: 0.12em;
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
          line-height: 1.02;
          letter-spacing: -0.055em;
          margin-bottom: 22px;
        }

        .hero-text {
          color: rgba(248, 251, 255, 0.72);
          font-size: 18px;
          line-height: 1.9;
          max-width: 690px;
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
            radial-gradient(circle at top left, rgba(251, 191, 36, 0.18), transparent 18rem),
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
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .main-card strong {
          display: block;
          font-size: 40px;
          line-height: 1.05;
          letter-spacing: -0.05em;
          margin: 20px 0 12px;
        }

        .main-card p {
          color: #475467;
          line-height: 1.75;
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
          line-height: 1.08;
          letter-spacing: -0.055em;
          margin-bottom: 14px;
        }

        .intro-section > p,
        .section-head p,
        .industry-copy p,
        .location-card p,
        .final-cta p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.9;
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
          letter-spacing: -0.035em;
          margin-bottom: 12px;
        }

        .service-card p,
        .work-card p,
        .process-list p,
        details p {
          color: rgba(248, 251, 255, 0.66);
          line-height: 1.85;
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
          letter-spacing: 0.08em;
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
          letter-spacing: -0.02em;
        }

        details p {
          margin: 14px 0 0;
        }

        .final-cta {
          width: min(1180px, calc(100% - 32px));
          margin: 20px auto 80px;
          padding: clamp(28px, 5vw, 54px);
          background:
            radial-gradient(circle at top left, rgba(251, 191, 36, 0.18), transparent 22rem),
            rgba(255, 255, 255, 0.08);
          text-align: right;
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