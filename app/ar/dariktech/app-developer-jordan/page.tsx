import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://getdarik.com";
const pagePath = "/ar/dariktech/app-developer-jordan";
const pageUrl = `${siteUrl}${pagePath}`;
const englishUrl = `${siteUrl}/dariktech/app-developer-jordan`;

export const metadata: Metadata = {
  title: "شركة تطوير تطبيقات في الأردن | تطبيقات أعمال ولوحات تحكم",
  description:
    "Darik Technologies تبني تطبيقات جوال، تطبيقات ويب، لوحات تحكم، أسواق رقمية، أنظمة حجز، قواعد بيانات، وأنظمة أعمال كاملة للشركات في الأردن.",
  alternates: {
    canonical: pageUrl,
    languages: {
      "ar-JO": pageUrl,
      "en-US": englishUrl,
    },
  },
  openGraph: {
    title: "شركة تطوير تطبيقات في الأردن | تطبيقات أعمال ولوحات تحكم",
    description:
      "تطوير تطبيقات جوال وتطبيقات ويب ولوحات تحكم وأسواق رقمية وأنظمة خلفية للشركات في الأردن وعمّان.",
    url: pageUrl,
    siteName: "Darik Technologies",
    type: "website",
    locale: "ar_JO",
  },
  keywords: [
    "تطوير تطبيقات في الأردن",
    "شركة تطوير تطبيقات في الأردن",
    "مبرمج تطبيقات في الأردن",
    "مطور تطبيقات في الأردن",
    "تطوير تطبيقات جوال في الأردن",
    "شركة برمجة تطبيقات في الأردن",
    "تطبيقات أعمال في الأردن",
    "تطوير تطبيقات في عمان",
    "لوحات تحكم للشركات",
    "تطبيقات أسواق رقمية",
    "تطوير مواقع وتطبيقات في الأردن",
  ],
};

const services = [
  {
    title: "تطبيقات جوال",
    text: "تطبيقات iOS و Android للعملاء، الموظفين، السائقين، الموردين، الحجوزات، الطلبات، وإدارة العمليات اليومية.",
    tags: ["iOS", "Android", "تطبيقات أعمال", "تجربة مستخدم"],
  },
  {
    title: "تطبيقات ويب وبوابات",
    text: "بوابات ويب سهلة الاستخدام للعملاء، الموظفين، الإدارة، الموردين، الفروع، والفرق الداخلية.",
    tags: ["Web App", "بوابة عملاء", "بوابة موظفين", "Next.js"],
  },
  {
    title: "لوحات تحكم إدارية",
    text: "لوحات خاصة لإدارة الطلبات، المستخدمين، العروض، الموافقات، التقارير، الدعم، والصلاحيات.",
    tags: ["Admin", "تقارير", "موافقات", "عمليات"],
  },
  {
    title: "أسواق رقمية ومنصات عروض",
    text: "منصات تربط العملاء بالموردين أو البائعين، مع طلبات منظمة، عروض أسعار، رسائل، وإدارة كاملة من لوحة التحكم.",
    tags: ["Marketplace", "موردين", "عروض أسعار", "طلبات"],
  },
  {
    title: "Backend وقواعد بيانات",
    text: "تسجيل دخول، صلاحيات، أدوار مستخدمين، تخزين ملفات، إشعارات، قواعد بيانات، ومنطق عمل مبني حسب طريقة شغلك.",
    tags: ["Database", "Auth", "Storage", "Backend"],
  },
  {
    title: "أنظمة داخلية للشركات",
    text: "أدوات داخلية تقلل العمل اليدوي، تنظم الموافقات، تكشف الأخطاء، وتحول شغل الشركة من واتساب وإكسل إلى نظام واضح.",
    tags: ["Automation", "Workflow", "Internal Tools", "Control"],
  },
];

const projects = [
  {
    name: "Darik Marketplace",
    type: "منصة تجارة وتوصيل",
    text: "نظام Marketplace كامل فيه تطبيق عملاء، تطبيق تجار، تطبيق سائقين، إدارة مخزون، طلبات، مرتجعات، دعم، ولوحة تحكم.",
    href: "/dariktech/work/darik-marketplace",
  },
  {
    name: "PartBid",
    type: "منصة طلب عروض لقطع السيارات",
    text: "منصة يرسل فيها العميل طلب واحد منظم، ويستقبل عروض من الموردين مع السعر، الصور، حالة القطعة، والتوصيل.",
    href: "/dariktech/work/partbid",
  },
  {
    name: "Tawleh Manager",
    type: "نظام طلبات للمطاعم",
    text: "نظام QR للطلبات داخل المطعم، يساعد الإدارة والموظفين على متابعة الطاولات والطلبات بطريقة أوضح.",
    href: "/dariktech#work",
  },
];

const process = [
  {
    title: "نفهم طريقة الشغل",
    text: "نحدد من سيستخدم النظام، ما هي أدوارهم، أين يدخل المال، وما الذي تحتاج الإدارة أن تتحكم به.",
  },
  {
    title: "نخطط النظام",
    text: "نرتب الشاشات، قاعدة البيانات، الصلاحيات، لوحة التحكم، الإشعارات، والتقارير قبل بدء البرمجة.",
  },
  {
    title: "نبني المنتج الكامل",
    text: "التطبيق، الموقع، لوحة التحكم، قاعدة البيانات، التخزين، والصلاحيات يتم بناؤها كنظام واحد متصل.",
  },
  {
    title: "نجهز للإطلاق",
    text: "نختبر سيناريوهات حقيقية، نصلح التفاصيل، ونجهز النظام ليكون عملياً للاستخدام اليومي.",
  },
];

const faqs = [
  {
    q: "هل تقومون بتطوير تطبيقات جوال في الأردن؟",
    a: "نعم. Darik Technologies تبني تطبيقات جوال للشركات في الأردن، مثل تطبيقات العملاء، الموظفين، السائقين، الموردين، الحجوزات، الطلبات، والأسواق الرقمية.",
  },
  {
    q: "هل يمكن بناء لوحة تحكم وقاعدة بيانات مع التطبيق؟",
    a: "نعم. التطبيق الجدي يحتاج أكثر من واجهة جميلة. نستطيع بناء لوحة تحكم، قاعدة بيانات، صلاحيات، إشعارات، تقارير، وتخزين ملفات حسب حاجة المشروع.",
  },
  {
    q: "هل تبنون تطبيقات Marketplace أو منصات عروض أسعار؟",
    a: "نعم. يمكن بناء منصات تربط العملاء بالبائعين أو الموردين، مع طلبات منظمة، عروض أسعار، دردشة، صور، صلاحيات، ولوحة تحكم للإدارة.",
  },
  {
    q: "هل تخدمون الشركات خارج عمّان؟",
    a: "نعم. يمكن تخطيط وبناء النظام عن بعد للشركات في عمّان وباقي محافظات الأردن، وكذلك للشركات التي تستهدف السوق الإقليمي.",
  },
  {
    q: "كم تكلفة تطوير تطبيق في الأردن؟",
    a: "التكلفة تعتمد على حجم المشروع. تطبيق بسيط يختلف عن نظام كامل فيه تطبيق جوال، لوحة تحكم، قاعدة بيانات، إشعارات، صلاحيات، تقارير، وتكاملات. أفضل خطوة هي تحديد نطاق العمل ثم إعطاء عرض سعر واضح.",
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
      name: "تطوير تطبيقات في الأردن",
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

export default function ArabicAppDeveloperJordanPage() {
  return (
    <main className="seo-page" dir="rtl" lang="ar-JO">
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
          <a href="#work">الأعمال</a>
          <a href="#process">الطريقة</a>
          <a href="#faq">الأسئلة</a>
          <Link href="/dariktech/app-developer-jordan">English</Link>
          <a
            className="quote-link"
            href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Jordan"
          >
            عرض مجاني
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">شركة تطوير تطبيقات في الأردن</p>
          <h1>
            تطبيقات أعمال، أسواق رقمية، ولوحات تحكم مبنية لتشغيل الشركة فعلاً.
          </h1>
          <p className="hero-text">
            Darik Technologies تبني أنظمة تطبيقات كاملة للشركات في الأردن:
            تطبيقات جوال، تطبيقات ويب، قواعد بيانات، لوحات تحكم، منصات عروض،
            أنظمة حجز، سير عمل داخلي، وأنظمة تشغيل يومية.
          </p>

          <div className="hero-actions">
            <a
              className="primary"
              href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Jordan"
            >
              اطلب عرض سعر مجاني
            </a>
            <a className="secondary" href="#work">
              شاهد أمثلة الأعمال
            </a>
          </div>

          <div className="hero-points" aria-label="خدمات تطوير التطبيقات في الأردن">
            <span>تطبيقات جوال</span>
            <span>تطبيقات ويب</span>
            <span>لوحات تحكم</span>
            <span>أسواق رقمية</span>
            <span>قواعد بيانات</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="نظام تطبيق أعمال">
          <div className="system-card main-card">
            <span>نظام تطبيق للشركات في الأردن</span>
            <strong>تطبيق + لوحة تحكم + Backend</strong>
            <p>منتج واحد متصل، وليس مجرد شاشات منفصلة.</p>
          </div>
          <div className="mini-grid">
            <div>
              <small>العميل</small>
              <strong>تجربة جوال واضحة</strong>
            </div>
            <div>
              <small>الإدارة</small>
              <strong>تحكم كامل</strong>
            </div>
            <div>
              <small>النظام</small>
              <strong>قاعدة بيانات وصلاحيات</strong>
            </div>
            <div>
              <small>الإطلاق</small>
              <strong>جاهز للاستخدام اليومي</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section">
        <div>
          <p className="eyebrow">لماذا هذه الصفحة؟</p>
          <h2>
            البحث عن مبرمج تطبيقات في الأردن لا يجب أن يعني شخصاً يصمم شاشات فقط.
          </h2>
        </div>
        <p>
          التطبيق الجدي يحتاج طريقة تفكير كاملة: مستخدمين، صلاحيات، قاعدة
          بيانات، لوحة تحكم، إشعارات، تقارير، تخزين، وسير عمل يناسب طريقة
          تشغيل الشركة. الهدف هو بناء نظام يستخدم يومياً، وليس نموذجاً شكله
          جميل لكنه غير عملي.
        </p>
      </section>

      <section className="section" id="services">
        <div className="section-head">
          <p className="eyebrow">الخدمات</p>
          <h2>خدمات تطوير تطبيقات للشركات في الأردن.</h2>
          <p>
            نبني التطبيق، الموقع، لوحة التحكم، قاعدة البيانات، والصلاحيات كنظام
            واحد متصل يخدم طريقة شغل الشركة.
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
          <p className="eyebrow">أمثلة أعمال</p>
          <h2>أمثلة على أنظمة تطبيقات يمكن لـ Darik Technologies بناؤها.</h2>
          <p>
            هذه الأمثلة توضح الفرق بين تطبيق بسيط ونظام أعمال كامل فيه أدوار،
            قواعد بيانات، عمليات، ولوحة تحكم.
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
          <h2>من فكرة تطبيق إلى نظام جاهز للاستخدام.</h2>
          <p>
            الهدف هو تقليل الهدر، ترتيب الفكرة، وبناء شيء عملي يخدم الشركة
            بعد الإطلاق.
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
          <p className="eyebrow">تركيز SEO للأردن وعمّان</p>
          <h2>صفحة مخصصة للباحثين عن تطوير تطبيقات في الأردن.</h2>
          <p>
            هذه الصفحة تستهدف عبارات مثل شركة تطوير تطبيقات في الأردن، مبرمج
            تطبيقات في الأردن، تطوير تطبيقات جوال في عمّان، تطبيقات أعمال،
            لوحات تحكم، أسواق رقمية، وأنظمة Backend للشركات.
          </p>
        </div>
        <div className="keyword-card">
          <strong>عبارات البحث المستهدفة</strong>
          <span>تطوير تطبيقات في الأردن</span>
          <span>شركة تطوير تطبيقات في الأردن</span>
          <span>مبرمج تطبيقات في الأردن</span>
          <span>تطبيقات أعمال في الأردن</span>
          <span>لوحات تحكم للشركات</span>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-head">
          <p className="eyebrow">أسئلة شائعة</p>
          <h2>أسئلة قبل بناء تطبيق للشركة.</h2>
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
        <h2>تحتاج شركة تطوير تطبيقات في الأردن؟</h2>
        <p>
          أرسل فكرة التطبيق، من سيستخدمه، وما الذي يجب أن يفعله النظام. Darik
          Technologies يمكنها تحويل الفكرة إلى خطة واضحة ونسخة إطلاق عملية.
        </p>
        <div className="hero-actions">
          <a
            className="primary"
            href="mailto:jjasaleh14@aol.com?subject=App%20Development%20Quote%20in%20Jordan"
          >
            اطلب عرض سعر مجاني
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
          background: #06101d;
        }

        .seo-page {
          min-height: 100vh;
          color: #f8fbff;
          background:
            radial-gradient(circle at 86% 6%, rgba(37, 99, 235, 0.4), transparent 26rem),
            radial-gradient(circle at 10% 18%, rgba(103, 232, 249, 0.14), transparent 30rem),
            linear-gradient(180deg, #06101d 0%, #081827 48%, #050b13 100%);
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
            radial-gradient(circle at top left, rgba(103, 232, 249, 0.18), transparent 18rem),
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
          line-height: 1.08;
          letter-spacing: -0.055em;
          margin-bottom: 14px;
        }

        .intro-section > p,
        .section-head p,
        .final-cta p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.9;
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
          border-color: rgba(103, 232, 249, 0.35);
          background: rgba(255, 255, 255, 0.1);
        }

        .work-card span {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
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
          line-height: 1.1;
          letter-spacing: -0.055em;
        }

        .location-card p {
          color: rgba(248, 251, 255, 0.68);
          line-height: 1.9;
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
            radial-gradient(circle at top left, rgba(103, 232, 249, 0.18), transparent 22rem),
            rgba(255, 255, 255, 0.08);
          text-align: right;
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