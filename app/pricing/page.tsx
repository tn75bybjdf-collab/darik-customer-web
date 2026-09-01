"use client";

// DARIK_HELP_FOOTER_335

// DARIK_PREMIUM_MARKETING_REDESIGN_332
import { useEffect, useState } from "react";
import styles from "../marketplace-info.module.css";

type Language = "en" | "ar";
type IconName =
  | "arrow"
  | "check"
  | "domain"
  | "sparkle"
  | "store"
  | "support";

const LANGUAGE_KEY = "darik_marketplace_language_v1";

const copy = {
  en: {
    stores: "Stores",
    how: "How it works",
    pricing: "Pricing",
    dashboard: "Retailer dashboard",
    sell: "Sell on Darik",
    heroEyebrow: "SIMPLE YEARLY PRICING",
    heroTitle: "Serious storefronts.",
    heroTitleAccent: "Simple pricing.",
    heroBody:
      "Everything you need to launch a professional Darik storefront, publish your catalog, appear in product discovery, configure delivery, and manage orders.",
    offerBadge: "50% LAUNCH OFFER",
    annualOnly: "Yearly plans · paid once",
    heroPrimary: "Start your store",
    heroSecondary: "See how Darik works",
    includedLabel: "EVERY PLAN INCLUDES",
    included: [
      "Branded Darik storefront",
      "Jordan-wide store and product discovery",
      "Retailer dashboard and order management",
      "Delivery-zone, fee, and pickup controls",
      "Catalog tools and product publishing",
      "Customer-facing store link",
    ],
    plansEyebrow: "CHOOSE YOUR CATALOG SIZE",
    plansTitle: "One platform. Three straightforward plans.",
    plansBody:
      "Every plan has the same core Darik experience. Choose based on how large you want your published catalog to be.",
    plans: [
      {
        name: "Essential",
        limit: "Up to 1,000 products",
        regular: "600",
        price: "300",
        badge: "",
        featured: false,
        description: "For focused local retailers building a strong searchable catalog.",
      },
      {
        name: "Growth",
        limit: "Up to 3,000 products",
        regular: "800",
        price: "400",
        badge: "MOST POPULAR",
        featured: true,
        description: "For growing stores with broader inventory and multiple categories.",
      },
      {
        name: "Scale",
        limit: "Up to 10,000 products",
        regular: "1,000",
        price: "500",
        badge: "LARGEST CATALOG",
        featured: false,
        description: "For high-volume retailers that need serious catalog capacity.",
      },
    ],
    regularPrice: "Regular",
    launchPrice: "Launch price",
    perYear: "JOD / year",
    paidOnce: "paid up front",
    choosePlan: "Choose this plan",
    domainEyebrow: "OPTIONAL ADD-ON",
    domainTitle: "Use your own domain.",
    domainBody:
      "Want customers to visit your storefront through your own web address? Connect your domain to your Darik storefront.",
    domainPrice: "100 JOD",
    domainFee: "one-time setup fee",
    domainExample: "yourstore.com",
    domainNote: "Your Darik storefront stays connected to the same catalog, dashboard, and order system.",
    valueEyebrow: "WHAT YOU'RE ACTUALLY BUYING",
    valueTitle: "Not a template. Retail infrastructure.",
    valueBody:
      "Darik gives your business a customer-facing storefront and connects it to a larger discovery network built to help shoppers find local inventory.",
    valueCards: [
      {
        title: "Get discovered",
        body: "Your store and published products become searchable across Darik.",
      },
      {
        title: "Look established",
        body: "Give customers a polished storefront instead of sending product lists through chat.",
      },
      {
        title: "Control delivery",
        body: "Set where you deliver, what it costs, and when customers can place orders.",
      },
      {
        title: "Run from one dashboard",
        body: "Manage your products, storefront settings, staff, and incoming orders.",
      },
    ],
    faqEyebrow: "STRAIGHT ANSWERS",
    faqTitle: "Questions before you launch.",
    faq: [
      {
        q: "Are these monthly prices?",
        a: "No. Darik plans are yearly. The displayed launch price is paid once for the year.",
      },
      {
        q: "Do different plans remove features?",
        a: "No. The core Darik storefront, discovery, delivery configuration, dashboard, and order tools are included. The main difference is catalog size.",
      },
      {
        q: "Do I need my own domain?",
        a: "No. Your Darik storefront already has a customer-facing Darik URL. A custom domain is optional for a one-time 100 JOD setup fee.",
      },
      {
        q: "Can customers find my store outside my delivery area?",
        a: "Yes. Darik is also a Jordan-wide store and product directory. Delivery matches are prioritized, but active stores remain discoverable.",
      },
    ],
    finalEyebrow: "BUILD YOUR DIGITAL STOREFRONT",
    finalTitle: "Your customers are already searching.",
    finalBody:
      "Give them somewhere professional to find your business, browse your inventory, and place an order when delivery is available.",
    finalPrimary: "Create retailer account",
    finalSecondary: "Retailer dashboard",
    footerBody:
      "Darik connects customers with active retailers across Jordan through searchable storefronts, product discovery, and delivery-aware shopping.",
    platform: "Platform",
    retailers: "Retailers",
    help: "Help",
    termsLink: "Terms",
    privacyLink: "Privacy",
    promiseLink: "Darik Promise",
    supportLink: "Contact / Support",
    rights: "Darik Technologies. All rights reserved.",
  },
  ar: {
    stores: "المتاجر",
    how: "كيف تعمل",
    pricing: "الأسعار",
    dashboard: "لوحة التاجر",
    sell: "بع على داريك",
    heroEyebrow: "تسعير سنوي واضح",
    heroTitle: "واجهة متجر احترافية.",
    heroTitleAccent: "بسعر بسيط.",
    heroBody:
      "كل ما تحتاجه لإطلاق متجر احترافي على داريك، نشر كتالوجك، الظهور في البحث عن المنتجات، تحديد التوصيل وإدارة الطلبات.",
    offerBadge: "عرض إطلاق بخصم 50%",
    annualOnly: "خطط سنوية · دفعة واحدة",
    heroPrimary: "ابدأ متجرك",
    heroSecondary: "شاهد كيف يعمل داريك",
    includedLabel: "كل خطة تشمل",
    included: [
      "واجهة متجر داريك بهويتك",
      "اكتشاف المتجر والمنتجات على مستوى الأردن",
      "لوحة التاجر وإدارة الطلبات",
      "التحكم بمناطق ورسوم التوصيل والاستلام",
      "أدوات الكتالوج ونشر المنتجات",
      "رابط متجر مخصص للزبائن",
    ],
    plansEyebrow: "اختر حجم الكتالوج",
    plansTitle: "منصة واحدة. ثلاث خطط واضحة.",
    plansBody:
      "كل الخطط تعطيك تجربة داريك الأساسية كاملة. اختر الخطة حسب عدد المنتجات التي تريد نشرها.",
    plans: [
      {
        name: "أساسي",
        limit: "حتى 1,000 منتج",
        regular: "600",
        price: "300",
        badge: "",
        featured: false,
        description: "للمتاجر المركزة التي تريد بناء كتالوج قوي وقابل للبحث.",
      },
      {
        name: "نمو",
        limit: "حتى 3,000 منتج",
        regular: "800",
        price: "400",
        badge: "الأكثر طلباً",
        featured: true,
        description: "للمتاجر المتنامية التي لديها مخزون أكبر وفئات متعددة.",
      },
      {
        name: "توسع",
        limit: "حتى 10,000 منتج",
        regular: "1,000",
        price: "500",
        badge: "أكبر كتالوج",
        featured: false,
        description: "للتجار ذوي الحجم الكبير الذين يحتاجون سعة كتالوج قوية.",
      },
    ],
    regularPrice: "السعر الأصلي",
    launchPrice: "سعر الإطلاق",
    perYear: "دينار / سنة",
    paidOnce: "تدفع مقدماً",
    choosePlan: "اختر هذه الخطة",
    domainEyebrow: "إضافة اختيارية",
    domainTitle: "استخدم نطاقك الخاص.",
    domainBody:
      "إذا بدك الزبائن يدخلوا متجرك من عنوان ويب خاص فيك، نربط نطاقك مباشرة مع واجهة داريك.",
    domainPrice: "100 دينار",
    domainFee: "رسوم إعداد لمرة واحدة",
    domainExample: "yourstore.com",
    domainNote: "تبقى واجهة داريك مرتبطة بنفس الكتالوج ولوحة التحكم ونظام الطلبات.",
    valueEyebrow: "شو فعلياً بتاخذ",
    valueTitle: "مش قالب جاهز. بنية رقمية لمتجرك.",
    valueBody:
      "داريك يعطي نشاطك واجهة احترافية للزبائن ويربطها بشبكة اكتشاف أوسع تساعد الناس على العثور على المتاجر والمخزون المحلي.",
    valueCards: [
      {
        title: "خلي الناس تلاقيك",
        body: "متجرك ومنتجاتك المنشورة تصبح قابلة للبحث والاكتشاف على داريك.",
      },
      {
        title: "اظهر بشكل احترافي",
        body: "اعطِ الزبون واجهة متجر مرتبة بدل إرسال قوائم وصور المنتجات بالمحادثات.",
      },
      {
        title: "تحكم بالتوصيل",
        body: "حدد وين بتوصل، تكلفة التوصيل، ومتى يقدر الزبون يطلب.",
      },
      {
        title: "أدر كل شيء من لوحة واحدة",
        body: "تحكم بالمنتجات وإعدادات المتجر والموظفين والطلبات الواردة.",
      },
    ],
    faqEyebrow: "إجابات واضحة",
    faqTitle: "أسئلة قبل الإطلاق.",
    faq: [
      {
        q: "هل هذه أسعار شهرية؟",
        a: "لا. خطط داريك سنوية، وسعر الإطلاق الظاهر يُدفع مرة واحدة للسنة.",
      },
      {
        q: "هل بعض الخطط تنقص ميزات؟",
        a: "لا. واجهة داريك والاكتشاف وإعدادات التوصيل ولوحة التحكم وأدوات الطلبات موجودة في الخطط. الفرق الأساسي هو حجم الكتالوج.",
      },
      {
        q: "هل لازم يكون عندي نطاق خاص؟",
        a: "لا. متجرك على داريك يأتي برابط مخصص للزبائن. النطاق الخاص اختياري مقابل 100 دينار رسوم إعداد لمرة واحدة.",
      },
      {
        q: "هل الناس خارج نطاق توصيلي يقدروا يلاقوا متجري؟",
        a: "نعم. داريك أيضاً دليل للمتاجر والمنتجات على مستوى الأردن. متاجر التوصيل تظهر أولاً لكن المتاجر الفعالة تبقى قابلة للاكتشاف.",
      },
    ],
    finalEyebrow: "ابنِ واجهة متجرك الرقمية",
    finalTitle: "زبائنك أصلاً قاعدين يبحثوا.",
    finalBody:
      "اعطهم مكان احترافي يلاقوا فيه نشاطك ويتصفحوا مخزونك ويطلبوا لما يكون التوصيل متاح.",
    finalPrimary: "أنشئ حساب تاجر",
    finalSecondary: "لوحة التاجر",
    footerBody:
      "داريك يربط الزبائن بالمتاجر الفعالة في الأردن من خلال واجهات قابلة للبحث واكتشاف المنتجات وتجربة تسوق تراعي نطاق التوصيل.",
    platform: "المنصة",
    retailers: "للتجار",
    help: "المساعدة",
    termsLink: "الشروط",
    privacyLink: "الخصوصية",
    promiseLink: "وعد داريك",
    supportLink: "التواصل / الدعم",
    rights: "داريك تكنولوجيز. جميع الحقوق محفوظة.",
  },
} as const;

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "domain") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.6 2.5 4 5.5 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.5-4-9s1.4-6.5 4-9Z" />
      </svg>
    );
  }

  if (name === "store") {
    return (
      <svg {...common}>
        <path d="M4 10v10h16V10" />
        <path d="M3 10 5 4h14l2 6" />
        <path d="M8 20v-6h8v6" />
      </svg>
    );
  }

  if (name === "support") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.5 2.5 0 1 1 4.7 1.2c-.6 1-1.7 1.4-2.5 2.1-.4.4-.5.8-.5 1.2" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m12 3 1.7 4.4L18 9l-4.3 1.6L12 15l-1.7-4.4L6 9l4.3-1.6L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function Header({
  language,
  onToggle,
}: {
  language: Language;
  onToggle: () => void;
}) {
  const t = copy[language];

  return (
    <header className={styles.siteHeader}>
      <div className={styles.shell}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="/" aria-label="Darik home">
            <img src="/darik_logo_final_v2.png" alt="Darik" />
          </a>

          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="/">{t.stores}</a>
            <a href="/how-it-works">{t.how}</a>
            <a className={styles.navActive} href="/pricing">
              {t.pricing}
            </a>
          </nav>

          <div className={styles.headerActions}>
            <button
              className={styles.languageButton}
              type="button"
              onClick={onToggle}
            >
              {language === "en" ? "العربية" : "English"}
            </button>
            <a className={styles.dashboardButton} href="/store-dashboard">
              {t.dashboard}
            </a>
            <a className={styles.primaryHeaderButton} href="/store-signup">
              {t.sell}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <footer className={styles.siteFooter}>
      <div className={styles.shell}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <a className={styles.brand} href="/">
              <img src="/darik_logo_final_v2.png" alt="Darik" />
            </a>
            <p>{t.footerBody}</p>
          </div>

          <div className={styles.footerColumns}>
            <div>
              <strong>{t.platform}</strong>
              <a href="/">{t.stores}</a>
              <a href="/how-it-works">{t.how}</a>
              <a href="/pricing">{t.pricing}</a>
            </div>
            <div>
              <strong>{t.retailers}</strong>
              <a href="/store-signup">{t.sell}</a>
              <a href="/store-dashboard">{t.dashboard}</a>
            </div>
            <div>
              <strong>{t.help}</strong>
              <a href="/terms">{t.termsLink}</a>
              <a href="/privacy">{t.privacyLink}</a>
              <a href="/darik-promise">{t.promiseLink}</a>
              <a href="/support">{t.supportLink}</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} {t.rights}</span>
          <span>getdarik.com · Jordan</span>
        </div>
      </div>
    </footer>
  );
}

export default function PricingPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    if (stored === "ar" || stored === "en") {
      setLanguage(stored);
      return;
    }

    if (navigator.language.toLowerCase().startsWith("ar")) {
      setLanguage("ar");
    }
  }, []);

  function toggleLanguage() {
    const next: Language = language === "en" ? "ar" : "en";
    setLanguage(next);
    window.localStorage.setItem(LANGUAGE_KEY, next);
  }

  const t = copy[language];

  return (
    <main
      className={styles.page}
      dir={language === "ar" ? "rtl" : "ltr"}
      data-page="pricing"
    >
      <Header language={language} onToggle={toggleLanguage} />

      <section className={styles.pricingHero}>
        <div className={styles.pricingHeroGlow} />
        <div className={styles.shell}>
          <div className={styles.pricingHeroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <span />
                {t.heroEyebrow}
              </div>

              <div className={styles.offerPill}>
                <Icon name="sparkle" size={15} />
                {t.offerBadge}
              </div>

              <h1>
                <span>{t.heroTitle}</span>
                <strong>{t.heroTitleAccent}</strong>
              </h1>

              <p>{t.heroBody}</p>

              <div className={styles.heroActions}>
                <a className={styles.primaryCta} href="/store-signup">
                  {t.heroPrimary}
                  <Icon name="arrow" size={19} />
                </a>
                <a className={styles.secondaryCta} href="/how-it-works">
                  {t.heroSecondary}
                </a>
              </div>

              <div className={styles.annualNote}>
                <span>
                  <Icon name="check" size={14} />
                </span>
                {t.annualOnly}
              </div>
            </div>

            <div className={styles.includedPanel}>
              <div className={styles.includedPanelTop}>
                <span className={styles.iconTileDark}>
                  <Icon name="store" size={22} />
                </span>
                <div>
                  <small>{t.includedLabel}</small>
                  <strong>Darik Direct</strong>
                </div>
              </div>

              <div className={styles.includedList}>
                {t.included.map((item) => (
                  <div key={item}>
                    <span>
                      <Icon name="check" size={13} />
                    </span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className={styles.includedFooter}>
                <span>getdarik.com/your-store</span>
                <i />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div className={styles.eyebrow}>
              <span />
              {t.plansEyebrow}
            </div>
            <h2>{t.plansTitle}</h2>
            <p>{t.plansBody}</p>
          </div>

          <div className={styles.pricingGrid}>
            {t.plans.map((plan) => (
              <article
                className={`${styles.priceCard} ${
                  plan.featured ? styles.priceCardFeatured : ""
                }`}
                key={plan.name}
              >
                {plan.badge ? (
                  <div className={styles.planBadge}>{plan.badge}</div>
                ) : null}

                <div className={styles.priceCardTop}>
                  <span>{plan.name}</span>
                  <h3>{plan.limit}</h3>
                  <p>{plan.description}</p>
                </div>

                <div className={styles.priceBlock}>
                  <div className={styles.regularPrice}>
                    <span>{t.regularPrice}</span>
                    <strong>JOD {plan.regular}</strong>
                  </div>

                  <small>{t.launchPrice}</small>

                  <div className={styles.salePrice}>
                    <strong>{plan.price}</strong>
                    <span>{t.perYear}</span>
                  </div>

                  <p>{t.paidOnce}</p>
                </div>

                <div className={styles.cardFeatureList}>
                  {t.included.slice(0, 4).map((item) => (
                    <div key={item}>
                      <span>
                        <Icon name="check" size={12} />
                      </span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>

                <a href="/store-signup">
                  {t.choosePlan}
                  <Icon name="arrow" size={17} />
                </a>
              </article>
            ))}
          </div>

          <div className={styles.domainCard}>
            <div className={styles.domainIcon}>
              <Icon name="domain" size={28} />
            </div>

            <div className={styles.domainCopy}>
              <div className={styles.eyebrow}>
                <span />
                {t.domainEyebrow}
              </div>
              <h3>{t.domainTitle}</h3>
              <p>{t.domainBody}</p>
              <small>{t.domainNote}</small>
            </div>

            <div className={styles.domainPrice}>
              <div className={styles.domainBrowser}>
                <i />
                <span>{t.domainExample}</span>
              </div>
              <strong>{t.domainPrice}</strong>
              <span>{t.domainFee}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.valueSection}`}>
        <div className={styles.shell}>
          <div className={styles.valueIntro}>
            <div className={styles.eyebrow}>
              <span />
              {t.valueEyebrow}
            </div>
            <h2>{t.valueTitle}</h2>
            <p>{t.valueBody}</p>
          </div>

          <div className={styles.valueGrid}>
            {t.valueCards.map((card, index) => (
              <article className={styles.valueCard} key={card.title}>
                <span>0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.faqLayout}>
            <div className={styles.faqIntro}>
              <div className={styles.eyebrow}>
                <span />
                {t.faqEyebrow}
              </div>
              <h2>{t.faqTitle}</h2>
              <div className={styles.faqSupport}>
                <span className={styles.iconTile}>
                  <Icon name="support" size={21} />
                </span>
                <div>
                  <strong>Need help?</strong>
                  <a href="/support">Darik Support</a>
                </div>
              </div>
            </div>

            <div className={styles.faqList}>
              {t.faq.map((item, index) => (
                <details className={styles.faqItem} key={item.q} open={index === 0}>
                  <summary>
                    <span>{item.q}</span>
                    <i>+</i>
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalCtaSection}>
        <div className={styles.shell}>
          <div className={styles.finalCta}>
            <div>
              <div className={styles.eyebrowLight}>
                <span />
                {t.finalEyebrow}
              </div>
              <h2>{t.finalTitle}</h2>
              <p>{t.finalBody}</p>
            </div>

            <div className={styles.finalCtaActions}>
              <a href="/store-signup">
                {t.finalPrimary}
                <Icon name="arrow" size={18} />
              </a>
              <a href="/store-dashboard">{t.finalSecondary}</a>
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </main>
  );
}
