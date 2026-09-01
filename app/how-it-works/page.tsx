"use client";

// DARIK_HELP_FOOTER_335

// DARIK_PREMIUM_MARKETING_REDESIGN_332
import { useEffect, useState } from "react";
import styles from "../marketplace-info.module.css";

type Language = "en" | "ar";
type IconName =
  | "arrow"
  | "check"
  | "delivery"
  | "directory"
  | "search"
  | "shop"
  | "sparkle"
  | "store"
  | "location";

const LANGUAGE_KEY = "darik_marketplace_language_v1";

const copy = {
  en: {
    stores: "Stores",
    how: "How it works",
    pricing: "Pricing",
    dashboard: "Retailer dashboard",
    sell: "Sell on Darik",
    heroEyebrow: "JORDAN'S RETAIL DISCOVERY NETWORK",
    heroTitle: "Search Jordan.",
    heroTitleAccent: "Find the store.",
    heroBody:
      "Darik brings active local retailers into one searchable network. Find what you need, discover who sells it, and instantly see which stores can deliver to your location.",
    browseStores: "Browse stores",
    joinDarik: "Put your store on Darik",
    trustOne: "Jordan-wide discovery",
    trustTwo: "Delivery-aware ranking",
    trustThree: "Direct store catalogs",
    previewSearch: "Search Darik",
    previewQuery: "Neta U mirror",
    previewFound: "Stores carrying this item",
    previewDelivery: "Delivers to your location",
    previewNoDelivery: "No delivery to your location",
    previewBrowse: "Browse catalog",
    introEyebrow: "THE CUSTOMER EXPERIENCE",
    introTitle: "One search. Three simple steps.",
    introBody:
      "The complicated work happens behind the scenes. Customers get a clean path from “I need this” to “I found the store.”",
    steps: [
      {
        number: "01",
        icon: "search" as IconName,
        title: "Search what you need",
        body:
          "Search a product, part, category, or store across active Darik retailers in Jordan.",
      },
      {
        number: "02",
        icon: "directory" as IconName,
        title: "Discover who sells it",
        body:
          "See matching retailers and browse their real storefronts, catalogs, products, and business information.",
      },
      {
        number: "03",
        icon: "delivery" as IconName,
        title: "Know your options",
        body:
          "Stores that deliver to your location appear first. Other active stores remain visible so you never lose a useful result.",
      },
    ],
    directoryEyebrow: "MORE THAN DELIVERY",
    directoryTitle: "A retail directory that stays useful everywhere.",
    directoryBody:
      "Darik does not disappear when a store is outside your delivery area. Every active retailer remains discoverable, which makes the platform useful for product research, store discovery, pickup, contact, and future purchases.",
    directoryPoints: [
      "Find products across stores, not just stores nearby.",
      "See delivery matches first without hiding the rest of Jordan.",
      "Open each retailer's own branded Darik storefront.",
      "Use Darik as the place to answer: “Who sells this?”",
    ],
    directoryCardLabel: "DIRECTORY MODE",
    directoryCardTitle: "100 active stores should look like 100 active stores.",
    directoryCardBody:
      "Location improves ranking. It never makes healthy marketplace inventory look empty.",
    deliveryMatch: "Delivery match",
    directoryListing: "Directory listing",
    retailerEyebrow: "BUILT FOR LOCAL RETAILERS",
    retailerTitle: "Your store becomes discoverable beyond your delivery radius.",
    retailerBody:
      "A Darik storefront is not just an ordering page. It is a searchable digital presence that helps customers find your business and the products you carry.",
    retailerBenefits: [
      {
        icon: "store" as IconName,
        title: "Your own storefront",
        body: "A branded Darik page built around your business, catalog, and identity.",
      },
      {
        icon: "search" as IconName,
        title: "Product discovery",
        body: "Your published products can lead customers directly to your store.",
      },
      {
        icon: "location" as IconName,
        title: "Smart delivery visibility",
        body: "Customers instantly know when you deliver to their selected location.",
      },
      {
        icon: "shop" as IconName,
        title: "Stay discoverable",
        body: "Customers can still find and browse you even when delivery is unavailable.",
      },
    ],
    finalEyebrow: "READY TO GET DISCOVERED?",
    finalTitle: "Put your business where Jordan searches.",
    finalBody:
      "Launch your Darik storefront, publish your catalog, define your delivery area, and become part of a growing retail discovery network.",
    finalPrimary: "Create retailer account",
    finalSecondary: "View pricing",
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
    heroEyebrow: "شبكة داريك لاكتشاف المتاجر في الأردن",
    heroTitle: "ابحث في الأردن.",
    heroTitleAccent: "واعرف مين ببيع.",
    heroBody:
      "داريك يجمع المتاجر المحلية الفعالة ضمن شبكة واحدة قابلة للبحث. ابحث عن المنتج الذي تحتاجه، اعرف مين ببيعه، وشوف مباشرة أي متجر يقدر يوصل لموقعك.",
    browseStores: "تصفح المتاجر",
    joinDarik: "أضف متجرك على داريك",
    trustOne: "اكتشاف على مستوى الأردن",
    trustTwo: "ترتيب ذكي حسب التوصيل",
    trustThree: "كتالوجات المتاجر مباشرة",
    previewSearch: "ابحث في داريك",
    previewQuery: "مراية نيتا U",
    previewFound: "متاجر تبيع هذا المنتج",
    previewDelivery: "يوصل إلى موقعك",
    previewNoDelivery: "لا يوجد توصيل إلى موقعك",
    previewBrowse: "تصفح الكتالوج",
    introEyebrow: "تجربة الزبون",
    introTitle: "بحث واحد. ثلاث خطوات بسيطة.",
    introBody:
      "الشغل المعقد يصير بالخلفية. الزبون يشوف طريق واضح من «بدي هذا المنتج» إلى «لقيت المتجر».",
    steps: [
      {
        number: "01",
        icon: "search" as IconName,
        title: "ابحث عن اللي تحتاجه",
        body:
          "ابحث عن منتج أو قطعة أو فئة أو متجر ضمن متاجر داريك الفعالة في الأردن.",
      },
      {
        number: "02",
        icon: "directory" as IconName,
        title: "اعرف مين ببيعه",
        body:
          "شاهد المتاجر المطابقة وتصفح واجهاتها الحقيقية وكتالوجاتها ومنتجاتها ومعلوماتها.",
      },
      {
        number: "03",
        icon: "delivery" as IconName,
        title: "اعرف خياراتك",
        body:
          "المتاجر التي توصل إلى موقعك تظهر أولاً، وباقي المتاجر الفعالة تبقى ظاهرة حتى ما تخسر أي نتيجة مفيدة.",
      },
    ],
    directoryEyebrow: "أكثر من مجرد توصيل",
    directoryTitle: "دليل متاجر يظل مفيداً في كل مكان.",
    directoryBody:
      "داريك لا يخفي المتجر فقط لأنه خارج نطاق توصيلك. كل متجر فعال يبقى قابلاً للاكتشاف، حتى تستفيد من داريك للبحث عن المنتجات والمتاجر والاستلام والتواصل والشراء مستقبلاً.",
    directoryPoints: [
      "ابحث عن المنتجات بين المتاجر، وليس فقط عن المتاجر القريبة.",
      "شاهد متاجر التوصيل أولاً بدون إخفاء باقي الأردن.",
      "افتح واجهة داريك الخاصة بكل تاجر وتصفح كتالوجه.",
      "استخدم داريك للإجابة على سؤال: «مين ببيع هذا؟»",
    ],
    directoryCardLabel: "وضع الدليل",
    directoryCardTitle: "إذا عندك 100 متجر فعال، لازم الزبون يشوف 100 متجر فعال.",
    directoryCardBody:
      "الموقع يحسن ترتيب النتائج، لكنه لا يجعل المنصة تبدو فارغة.",
    deliveryMatch: "يوصل لموقعك",
    directoryListing: "مدرج في الدليل",
    retailerEyebrow: "مصمم للتجار المحليين",
    retailerTitle: "متجرك يظل قابلاً للاكتشاف حتى خارج نطاق التوصيل.",
    retailerBody:
      "واجهة داريك ليست فقط صفحة طلبات. هي وجود رقمي قابل للبحث يساعد الزبائن على العثور على متجرك والمنتجات التي تبيعها.",
    retailerBenefits: [
      {
        icon: "store" as IconName,
        title: "واجهة متجرك الخاصة",
        body: "صفحة داريك بهوية متجرك وكتالوجك وشكلك الخاص.",
      },
      {
        icon: "search" as IconName,
        title: "اكتشاف المنتجات",
        body: "منتجاتك المنشورة تساعد الزبائن على الوصول مباشرة إلى متجرك.",
      },
      {
        icon: "location" as IconName,
        title: "وضوح التوصيل",
        body: "الزبون يعرف فوراً إذا متجرك يوصل إلى الموقع الذي حدده.",
      },
      {
        icon: "shop" as IconName,
        title: "ابقَ ظاهراً",
        body: "الزبائن يقدروا يلاقوا متجرك ويتصفحوه حتى لو التوصيل غير متاح لهم.",
      },
    ],
    finalEyebrow: "جاهز تخلي الناس تلاقيك؟",
    finalTitle: "حط متجرك بالمكان اللي الأردن يبحث فيه.",
    finalBody:
      "أطلق واجهة متجرك على داريك، انشر كتالوجك، حدد مناطق التوصيل، وكن جزءاً من شبكة اكتشاف التجزئة.",
    finalPrimary: "أنشئ حساب تاجر",
    finalSecondary: "شاهد الأسعار",
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

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    );
  }

  if (name === "location") {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.3" />
      </svg>
    );
  }

  if (name === "delivery") {
    return (
      <svg {...common}>
        <path d="M3 6h11v10H3z" />
        <path d="M14 9h3l4 4v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    );
  }

  if (name === "store") {
    return (
      <svg {...common}>
        <path d="M4 10v10h16V10" />
        <path d="M3 10 5 4h14l2 6" />
        <path d="M8 20v-6h8v6" />
        <path d="M3 10c1.5 2 3.5 2 5 0 1.5 2 3.5 2 5 0 1.5 2 3.5 2 5 0 1 1.4 2 1.8 3 0" />
      </svg>
    );
  }

  if (name === "shop") {
    return (
      <svg {...common}>
        <path d="M5 7h14l-1 13H6L5 7Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    );
  }

  if (name === "directory") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
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
            <a className={styles.navActive} href="/how-it-works">
              {t.how}
            </a>
            <a href="/pricing">{t.pricing}</a>
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

export default function HowItWorksPage() {
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
      data-page="how-it-works"
    >
      <Header language={language} onToggle={toggleLanguage} />

      <section className={styles.howHero}>
        <div className={styles.heroGlow} />
        <div className={styles.shell}>
          <div className={styles.howHeroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <span />
                {t.heroEyebrow}
              </div>

              <h1>
                <span>{t.heroTitle}</span>
                <strong>{t.heroTitleAccent}</strong>
              </h1>

              <p>{t.heroBody}</p>

              <div className={styles.heroActions}>
                <a className={styles.primaryCta} href="/">
                  {t.browseStores}
                  <Icon name="arrow" size={19} />
                </a>
                <a className={styles.secondaryCta} href="/store-signup">
                  {t.joinDarik}
                </a>
              </div>

              <div className={styles.heroProof}>
                {[t.trustOne, t.trustTwo, t.trustThree].map((item) => (
                  <span key={item}>
                    <i>
                      <Icon name="check" size={13} />
                    </i>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.searchShowcase} aria-hidden="true">
              <div className={styles.showcaseTop}>
                <div className={styles.showcaseDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <strong>getdarik.com</strong>
              </div>

              <div className={styles.showcaseBody}>
                <div className={styles.fakeSearch}>
                  <Icon name="search" size={19} />
                  <div>
                    <small>{t.previewSearch}</small>
                    <strong>{t.previewQuery}</strong>
                  </div>
                  <span>
                    <Icon name="arrow" size={16} />
                  </span>
                </div>

                <div className={styles.resultLabel}>{t.previewFound}</div>

                <div className={styles.resultCard}>
                  <div className={styles.fakeStoreLogo}>P</div>
                  <div>
                    <strong>Perfect City Auto Parts</strong>
                    <span className={styles.deliveryYes}>
                      <Icon name="delivery" size={13} />
                      {t.previewDelivery}
                    </span>
                  </div>
                  <b>
                    <Icon name="arrow" size={15} />
                  </b>
                </div>

                <div className={`${styles.resultCard} ${styles.resultCardMuted}`}>
                  <div className={styles.fakeStoreLogo}>A</div>
                  <div>
                    <strong>Auto Parts Store</strong>
                    <span className={styles.deliveryNo}>
                      <Icon name="location" size={13} />
                      {t.previewNoDelivery}
                    </span>
                  </div>
                  <b>
                    <Icon name="arrow" size={15} />
                  </b>
                </div>

                <div className={styles.showcaseFooter}>
                  <span>{t.previewBrowse}</span>
                  <div>
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
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
              {t.introEyebrow}
            </div>
            <h2>{t.introTitle}</h2>
            <p>{t.introBody}</p>
          </div>

          <div className={styles.stepsGrid}>
            {t.steps.map((step) => (
              <article className={styles.stepCard} key={step.number}>
                <div className={styles.stepTop}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <span className={styles.iconTile}>
                    <Icon name={step.icon} size={23} />
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.directorySection}`}>
        <div className={styles.shell}>
          <div className={styles.directoryGrid}>
            <div className={styles.directoryCopy}>
              <div className={styles.eyebrow}>
                <span />
                {t.directoryEyebrow}
              </div>
              <h2>{t.directoryTitle}</h2>
              <p>{t.directoryBody}</p>

              <div className={styles.checkList}>
                {t.directoryPoints.map((point) => (
                  <div key={point}>
                    <span>
                      <Icon name="check" size={15} />
                    </span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.directoryVisual}>
              <div className={styles.directoryVisualHeader}>
                <span>{t.directoryCardLabel}</span>
                <div>
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <h3>{t.directoryCardTitle}</h3>
              <p>{t.directoryCardBody}</p>

              <div className={styles.directoryMetrics}>
                <div>
                  <span className={styles.metricIconGood}>
                    <Icon name="delivery" size={20} />
                  </span>
                  <div>
                    <strong>{t.deliveryMatch}</strong>
                    <small>Priority result</small>
                  </div>
                  <b>01</b>
                </div>

                <div>
                  <span className={styles.metricIconNeutral}>
                    <Icon name="directory" size={20} />
                  </span>
                  <div>
                    <strong>{t.directoryListing}</strong>
                    <small>Still discoverable</small>
                  </div>
                  <b>02+</b>
                </div>
              </div>

              <div className={styles.directoryLine}>
                <span />
                <i />
                <i />
                <i />
                <i />
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
              {t.retailerEyebrow}
            </div>
            <h2>{t.retailerTitle}</h2>
            <p>{t.retailerBody}</p>
          </div>

          <div className={styles.benefitGrid}>
            {t.retailerBenefits.map((benefit) => (
              <article className={styles.benefitCard} key={benefit.title}>
                <span className={styles.iconTile}>
                  <Icon name={benefit.icon} size={22} />
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
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
              <a href="/pricing">{t.finalSecondary}</a>
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </main>
  );
}
