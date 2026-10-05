"use client";

// DARIK_PRICING_APPROVED_393

import { useEffect, useState } from "react";
import styles from "./pricing-approved-393.module.css";

type Language = "en" | "ar";

const STORAGE_KEY = "darik_marketplace_language_v1";

const COPY = {
  en: {
    nav: { home: "Home", stores: "All Stores", categories: "Categories", about: "About", business: "For Business" },
    dashboard: "Retailer dashboard",
    startStore: "Start your store",
    location: "Amman, Jordan",
    heroEyebrow: "SIMPLE YEARLY PRICING",
    offer: "50% LAUNCH OFFER",
    heroTitleA: "Serious storefronts.",
    heroTitleB: "Simple pricing.",
    heroBody:
      "Everything you need to launch a professional Darik storefront, publish your catalog, appear in product discovery, configure delivery, and manage orders.",
    heroPrimary: "Start your store",
    heroSecondary: "See how Darik works",
    includedTitle: "Every plan includes everything you need to succeed.",
    includedSide: "Same powerful platform. No hidden fees.",
    included: [
      ["store", "Branded Darik storefront", "A professional store page for your business"],
      ["pin", "Jordan-wide store and product discovery", "Get found by customers across Jordan"],
      ["dashboard", "Retailer dashboard and order management", "Manage products, orders and customers with ease"],
      ["truck", "Delivery-zone, fee, and pickup controls", "Set your delivery areas, fees and pickup options"],
      ["tag", "Catalog tools and product publishing", "Easily add and manage your products"],
      ["link", "Customer-facing store link", "getdarik.com/your-store"],
    ],
    plansEyebrow: "CHOOSE YOUR CATALOG SIZE",
    plansTitle: "One platform. Three straightforward plans.",
    plansBody:
      "Every plan has the same core Darik experience. Choose based on how large you want your published catalog to be.",
    regular: "Regular",
    launch: "Launch price",
    paid: "paid up front",
    choose: "Choose this plan",
    plans: [
      {
        name: "Essential",
        limit: "Up to 1,000 products",
        description: "For focused local retailers building a strong searchable catalog.",
        regular: "600",
        price: "300",
        badge: "",
        icon: "cart",
      },
      {
        name: "Growth",
        limit: "Up to 3,000 products",
        description: "For growing stores with broader inventory and multiple categories.",
        regular: "800",
        price: "400",
        badge: "MOST POPULAR",
        icon: "growth",
      },
      {
        name: "Scale",
        limit: "Up to 10,000 products",
        description: "For high-volume retailers that need serious catalog capacity.",
        regular: "1,000",
        price: "500",
        badge: "LARGEST CATALOG",
        icon: "rocket",
      },
    ],
    domainEyebrow: "OPTIONAL ADD-ON",
    domainTitle: "Use your own domain.",
    domainBody:
      "Want customers to visit your storefront through your own web address? Connect your domain to your Darik storefront.",
    domainNote:
      "Your Darik storefront stays connected to the same catalog, dashboard, and order system.",
    domainPrice: "100 JOD",
    domainFee: "one-time setup fee",
    valueEyebrow: "WHAT YOU'RE ACTUALLY BUYING",
    valueTitle: "Not a template. Retail infrastructure.",
    valueBody:
      "Darik gives your business a customer-facing storefront and connects it to a larger discovery network built to help shoppers find local inventory.",
    values: [
      ["search", "Get discovered", "Your store and published products become searchable across Darik."],
      ["shield", "Look established", "Give customers a polished storefront instead of sending product lists through chat."],
      ["truck", "Control delivery", "Set where you deliver, what it costs, and when customers can place orders."],
      ["growth", "Run from one dashboard", "Manage your products, storefront settings, staff, and incoming orders."],
    ],
    faqEyebrow: "STRAIGHT ANSWERS",
    faqTitle: "Questions before you launch.",
    faq: [
      ["Are these monthly prices?", "No. Darik plans are yearly. The displayed launch price is paid once for the year."],
      ["Do different plans remove features?", "No. The core Darik storefront, discovery, delivery configuration, dashboard, and order tools are included. The main difference is catalog size."],
      ["Do I need my own domain?", "No. Your Darik storefront already has a customer-facing Darik URL. A custom domain is optional for a one-time 100 JOD setup fee."],
      ["Can customers find my store outside my delivery area?", "Yes. Darik is also a Jordan-wide store and product directory. Delivery matches are prioritized, but active stores remain discoverable."],
    ],
    finalTitle: "Your customers are already searching.",
    finalBody:
      "Give them somewhere professional to find your business, browse your inventory, and place an order when delivery is available.",
    finalPrimary: "Create retailer account",
    finalSecondary: "Retailer dashboard",
    finalBenefits: [
      ["people", "Connecting customers with active retailers across Jordan"],
      ["search", "Searchable storefronts and product discovery"],
      ["truck", "Delivery-aware shopping for a stronger local economy"],
    ],
    footerIntro:
      "Darik connects customers with active retailers across Jordan through searchable storefronts, product discovery, and delivery-aware shopping.",
    platform: "Platform",
    retailers: "Retailers",
    help: "Help",
    footerLinks: {
      allStores: "All Stores",
      categories: "Categories",
      about: "About Darik",
      business: "For Business",
      start: "Start Your Store",
      dashboard: "Retailer Dashboard",
      pricing: "Pricing",
      support: "Help Center",
      contact: "Contact Us",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
    rights: "Darik Technologies. All rights reserved.",
    handwrittenHero: "Local Stores. Stronger Jordan.",
    handwrittenValue: "Local Business. Real Opportunities.",
    handwrittenFooter: "A Stronger Jordan Together",
  },
  ar: {
    nav: { home: "الرئيسية", stores: "كل المتاجر", categories: "الفئات", about: "عن داريك", business: "للأعمال" },
    dashboard: "لوحة التاجر",
    startStore: "ابدأ متجرك",
    location: "عمّان، الأردن",
    heroEyebrow: "تسعير سنوي واضح",
    offer: "عرض إطلاق بخصم 50%",
    heroTitleA: "واجهة متجر احترافية.",
    heroTitleB: "بسعر بسيط.",
    heroBody:
      "كل ما تحتاجه لإطلاق متجر احترافي على داريك، نشر كتالوجك، الظهور في اكتشاف المنتجات، إعداد التوصيل وإدارة الطلبات.",
    heroPrimary: "ابدأ متجرك",
    heroSecondary: "شاهد كيف يعمل داريك",
    includedTitle: "كل خطة تشمل كل ما تحتاجه للنجاح.",
    includedSide: "نفس المنصة القوية. بدون رسوم مخفية.",
    included: [
      ["store", "واجهة متجر داريك بهويتك", "صفحة احترافية لنشاطك"],
      ["pin", "اكتشاف المتجر والمنتجات في الأردن", "يجدك العملاء في جميع أنحاء الأردن"],
      ["dashboard", "لوحة التاجر وإدارة الطلبات", "إدارة المنتجات والطلبات والعملاء بسهولة"],
      ["truck", "التحكم بالتوصيل والرسوم والاستلام", "حدد مناطق ورسوم وخيارات التوصيل"],
      ["tag", "أدوات الكتالوج ونشر المنتجات", "أضف منتجاتك وأدرها بسهولة"],
      ["link", "رابط متجر للزبائن", "getdarik.com/your-store"],
    ],
    plansEyebrow: "اختر حجم الكتالوج",
    plansTitle: "منصة واحدة. ثلاث خطط واضحة.",
    plansBody: "كل الخطط تعطيك تجربة داريك الأساسية كاملة. اختر حسب حجم الكتالوج الذي تريد نشره.",
    regular: "السعر الأصلي",
    launch: "سعر الإطلاق",
    paid: "تدفع مقدماً",
    choose: "اختر هذه الخطة",
    plans: [
      { name: "أساسي", limit: "حتى 1,000 منتج", description: "للمتاجر المركزة التي تريد بناء كتالوج قوي وقابل للبحث.", regular: "600", price: "300", badge: "", icon: "cart" },
      { name: "نمو", limit: "حتى 3,000 منتج", description: "للمتاجر المتنامية التي لديها مخزون أكبر وفئات متعددة.", regular: "800", price: "400", badge: "الأكثر طلباً", icon: "growth" },
      { name: "توسع", limit: "حتى 10,000 منتج", description: "للتجار ذوي الحجم الكبير الذين يحتاجون سعة كتالوج قوية.", regular: "1,000", price: "500", badge: "أكبر كتالوج", icon: "rocket" },
    ],
    domainEyebrow: "إضافة اختيارية",
    domainTitle: "استخدم نطاقك الخاص.",
    domainBody: "إذا أردت أن يدخل الزبائن إلى متجرك من عنوان ويب خاص بك، نربطه مباشرة بواجهة داريك.",
    domainNote: "تبقى واجهة داريك مرتبطة بنفس الكتالوج ولوحة التحكم ونظام الطلبات.",
    domainPrice: "100 دينار",
    domainFee: "رسوم إعداد لمرة واحدة",
    valueEyebrow: "ما الذي تحصل عليه فعلياً",
    valueTitle: "مش قالب جاهز. بنية رقمية لمتجرك.",
    valueBody: "داريك يعطي نشاطك واجهة احترافية للزبائن ويربطها بشبكة اكتشاف أوسع تساعد الناس على العثور على المخزون المحلي.",
    values: [
      ["search", "خلي الناس تلاقيك", "متجرك ومنتجاتك المنشورة تصبح قابلة للبحث والاكتشاف على داريك."],
      ["shield", "اظهر بشكل احترافي", "اعطِ الزبون واجهة متجر مرتبة بدل إرسال قوائم المنتجات بالمحادثات."],
      ["truck", "تحكم بالتوصيل", "حدد أين توصل، تكلفة التوصيل، ومتى يستطيع الزبون الطلب."],
      ["growth", "أدر كل شيء من لوحة واحدة", "تحكم بالمنتجات وإعدادات المتجر والموظفين والطلبات الواردة."],
    ],
    faqEyebrow: "إجابات واضحة",
    faqTitle: "أسئلة قبل الإطلاق.",
    faq: [
      ["هل هذه أسعار شهرية؟", "لا. خطط داريك سنوية، وسعر الإطلاق الظاهر يُدفع مرة واحدة للسنة."],
      ["هل بعض الخطط تنقص ميزات؟", "لا. واجهة داريك والاكتشاف وإعدادات التوصيل ولوحة التحكم وأدوات الطلبات موجودة في الخطط. الفرق الأساسي هو حجم الكتالوج."],
      ["هل لازم يكون عندي نطاق خاص؟", "لا. متجرك على داريك يأتي برابط مخصص للزبائن. النطاق الخاص اختياري مقابل 100 دينار رسوم إعداد لمرة واحدة."],
      ["هل الناس خارج نطاق توصيلي يقدروا يلاقوا متجري؟", "نعم. داريك أيضاً دليل للمتاجر والمنتجات على مستوى الأردن. نتائج التوصيل تظهر أولاً لكن المتاجر الفعالة تبقى قابلة للاكتشاف."],
    ],
    finalTitle: "زبائنك أصلاً قاعدين يبحثوا.",
    finalBody: "اعطهم مكان احترافي يلاقوا فيه نشاطك ويتصفحوا مخزونك ويطلبوا عندما يكون التوصيل متاحاً.",
    finalPrimary: "أنشئ حساب تاجر",
    finalSecondary: "لوحة التاجر",
    finalBenefits: [
      ["people", "ربط العملاء بالمتاجر الفعالة في الأردن"],
      ["search", "واجهات ومنتجات قابلة للبحث والاكتشاف"],
      ["truck", "تسوق يراعي نطاق التوصيل ويدعم الاقتصاد المحلي"],
    ],
    footerIntro: "داريك يربط الزبائن بالمتاجر الفعالة في الأردن من خلال واجهات قابلة للبحث واكتشاف المنتجات والتسوق حسب نطاق التوصيل.",
    platform: "المنصة",
    retailers: "للتجار",
    help: "المساعدة",
    footerLinks: {
      allStores: "كل المتاجر",
      categories: "الفئات",
      about: "عن داريك",
      business: "للأعمال",
      start: "ابدأ متجرك",
      dashboard: "لوحة التاجر",
      pricing: "الأسعار",
      support: "مركز المساعدة",
      contact: "تواصل معنا",
      terms: "شروط الخدمة",
      privacy: "سياسة الخصوصية",
    },
    rights: "داريك تكنولوجيز. جميع الحقوق محفوظة.",
    handwrittenHero: "متاجر محلية. أردن أقوى.",
    handwrittenValue: "أعمال محلية. فرص حقيقية.",
    handwrittenFooter: "أردن أقوى معاً",
  },
} as const;

function Icon({ name, size = 22 }: { name: string; size?: number }) {
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
  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (name === "pin") return <svg {...common}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></svg>;
  if (name === "cart") return <svg {...common}><path d="M4 10h16l-1 11H5L4 10Z" /><path d="M7 10V7a5 5 0 0 1 10 0v3" /></svg>;
  if (name === "store") return <svg {...common}><path d="M4 10v10h16V10" /><path d="M3 10 5 4h14l2 6" /><path d="M8 20v-6h8v6" /></svg>;
  if (name === "dashboard") return <svg {...common}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
  if (name === "truck") return <svg {...common}><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
  if (name === "tag") return <svg {...common}><path d="M3 12 12 3h7v7l-9 9-7-7Z" /><circle cx="16" cy="7" r="1" /></svg>;
  if (name === "link") return <svg {...common}><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" /></svg>;
  if (name === "growth") return <svg {...common}><path d="M4 20V10M10 20V4M16 20v-7M22 20V8" /></svg>;
  if (name === "rocket") return <svg {...common}><path d="M14 4c3-1 5-1 6-1 0 1 0 3-1 6l-6 6-4-4 5-7Z" /><path d="m9 11-4 1-2 2 5 1M13 15l-1 4-2 2-1-5" /><circle cx="16" cy="7" r="1.5" /></svg>;
  if (name === "shield") return <svg {...common}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></svg>;
  if (name === "people") return <svg {...common}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 7 0" /></svg>;
  if (name === "globe") return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>;
  if (name === "arrow") return <svg {...common}><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></svg>;
  return <svg {...common}><path d="m12 3 1.7 4.4L18 9l-4.3 1.6L12 15l-1.7-4.4L6 9l4.3-1.6L12 3Z" /></svg>;
}

export default function PricingPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") {
      setLanguage(saved);
      return;
    }
    if (navigator.language.toLowerCase().startsWith("ar")) setLanguage("ar");
  }, []);

  const c = COPY[language];
  const rtl = language === "ar";

  function toggleLanguage() {
    const next: Language = language === "en" ? "ar" : "en";
    setLanguage(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <main className={styles.page} dir={rtl ? "rtl" : "ltr"} data-page="pricing" data-darik-pricing-approved-393="true">
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="/" aria-label="Darik home">
            <img src="/darik-approved-header-logo-390c.png" alt="Darik" />
          </a>
          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="/">{c.nav.home}</a>
            <a href="/#stores">{c.nav.stores}</a>
            <a href="/#categories">{c.nav.categories}</a>
            <a href="/#about">{c.nav.about}</a>
            <a className={styles.navActive} href="/pricing">{c.nav.business}</a>
          </nav>
          <div className={styles.headerTools}>
            <a className={styles.roundTool} href="/#stores" aria-label="Search Darik"><Icon name="search" size={18} /></a>
            <a className={styles.locationPill} href="/#stores"><Icon name="pin" size={16} /><span>{c.location}</span><b>⌄</b></a>
            <a className={styles.roundTool} href="/#stores" aria-label="Browse stores"><Icon name="cart" size={18} /></a>
            <button className={styles.languageButton} type="button" onClick={toggleLanguage}>
              {language === "en" ? "العربية" : "English"}
            </button>
            <a className={styles.dashboardButton} href="/store-dashboard">{c.dashboard}</a>
            <a className={styles.startButton} href="/store-signup">{c.startStore}</a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.heroBadges}>
                <span className={styles.eyebrow}>{c.heroEyebrow}</span>
                <span className={styles.offerPill}>{c.offer}</span>
              </div>
              <h1>
                <span>{c.heroTitleA}</span>
                <strong>{c.heroTitleB}</strong>
              </h1>
              <p>{c.heroBody}</p>
              <div className={styles.heroActions}>
                <a className={styles.primaryCta} href="/store-signup">{c.heroPrimary}<Icon name="arrow" size={18} /></a>
                <a className={styles.secondaryCta} href="/how-it-works"><span className={styles.playDot}>▶</span>{c.heroSecondary}</a>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <img src="/darik-pricing-393-hero.jpg" alt="" aria-hidden="true" />
              <span className={styles.heroScribble}>{c.handwrittenHero} ♥</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.includedBand}>
        <div className={styles.shell}>
          <div className={styles.includedHeading}>
            <h2>{c.includedTitle}</h2>
            <span>{c.includedSide}</span>
          </div>
          <div className={styles.includedGrid}>
            {c.included.map(([icon, title, body]) => (
              <article className={styles.includedCard} key={title}>
                <span className={styles.iconBubble}><Icon name={icon} size={26} /></span>
                <strong>{title}</strong>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.pricingSection}>
        <div className={styles.shell}>
          <div className={styles.centerHeading}>
            <span className={styles.eyebrow}>{c.plansEyebrow}</span>
            <h2>{c.plansTitle}</h2>
            <p>{c.plansBody}</p>
          </div>
          <div className={styles.pricingStage}>
            <div className={styles.pricingGrid}>
              {c.plans.map((plan, index) => (
                <article className={`${styles.priceCard} ${index === 1 ? styles.featuredCard : ""}`} key={plan.name}>
                  {plan.badge ? <span className={styles.planBadge}>{plan.badge}</span> : null}
                  <div className={`${styles.planIcon} ${index === 1 ? styles.planIconGreen : ""} ${index === 2 ? styles.planIconGold : ""}`}>
                    <Icon name={plan.icon} size={31} />
                  </div>
                  <h3>{plan.name}</h3>
                  <strong className={styles.productLimit}>{plan.limit}</strong>
                  <p className={styles.planDescription}>{plan.description}</p>
                  <div className={styles.regularPrice}>{c.regular} JOD {plan.regular}</div>
                  <span className={styles.launchChip}>{c.launch}</span>
                  <div className={styles.salePrice}><strong>{plan.price}</strong><span>JOD / year</span></div>
                  <small>{c.paid}</small>
                  <a href="/store-signup">{c.choose}</a>
                </article>
              ))}
            </div>
            <aside className={styles.pricingScribble} aria-hidden="true">
              <strong>{rtl ? "أعمال محلية أكبر" : "Bigger Local Businesses"}</strong>
              <span>{rtl ? "أردن أكثر إشراقاً" : "A Brighter Jordan"} ♥</span>
              <div>🇯🇴</div>
            </aside>
          </div>

          <div className={styles.domainCard}>
            <span className={styles.domainIcon}><Icon name="globe" size={31} /></span>
            <div className={styles.domainCopy}>
              <span className={styles.eyebrow}>{c.domainEyebrow}</span>
              <h3>{c.domainTitle}</h3>
              <p>{c.domainBody}</p>
              <small>{c.domainNote}</small>
            </div>
            <div className={styles.domainExample}>www.yourstore.com <span>✦</span></div>
            <div className={styles.domainPrice}>
              <strong>{c.domainPrice}</strong>
              <span>{c.domainFee}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.valueSection}>
        <div className={styles.shell}>
          <div className={styles.valueLayout}>
            <div>
              <div className={styles.valueIntro}>
                <span className={styles.eyebrow}>{c.valueEyebrow}</span>
                <h2>{c.valueTitle}</h2>
                <p>{c.valueBody}</p>
              </div>
              <div className={styles.valueGrid}>
                {c.values.map(([icon, title, body], index) => (
                  <article className={styles.valueCard} key={title}>
                    <span className={styles.valueNumber}>0{index + 1}</span>
                    <span className={styles.valueIcon}><Icon name={icon} size={20} /></span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className={styles.valueImage}>
              <img src="/darik-pricing-393-value.jpg" alt="" aria-hidden="true" />
              <span>{c.handwrittenValue} ♥</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.shell}>
          <div className={styles.faqHeading}>
            <span className={styles.eyebrow}>{c.faqEyebrow}</span>
            <h2>{c.faqTitle}</h2>
          </div>
          <div className={styles.faqGrid}>
            {c.faq.map(([question, answer], index) => (
              <details className={styles.faqCard} key={question} open={index === 0}>
                <summary><span>{question}</span><b>⌄</b></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCtaSection}>
        <div className={styles.shell}>
          <div className={styles.finalCta}>
            <div className={styles.finalVisual}>
              <img src="/darik-pricing-393-cta.jpg" alt="" aria-hidden="true" />
            </div>
            <div className={styles.finalCopy}>
              <h2>{c.finalTitle}</h2>
              <p>{c.finalBody}</p>
              <div className={styles.finalActions}>
                <a className={styles.primaryCta} href="/store-signup">{c.finalPrimary}<Icon name="arrow" size={18} /></a>
                <a className={styles.secondaryCta} href="/store-dashboard">{c.finalSecondary}</a>
              </div>
            </div>
            <div className={styles.finalBenefits}>
              {c.finalBenefits.map(([icon, text]) => (
                <div key={text}><span><Icon name={icon} size={20} /></span><p>{text}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <a href="/" aria-label="Darik home"><img src="/darik-pricing-footer-logo-vector.svg" alt="Darik" /></a>
              <p>{c.footerIntro}</p>
            </div>
            <div className={styles.footerColumns}>
              <div>
                <strong>{c.platform}</strong>
                <a href="/#stores">{c.footerLinks.allStores}</a>
                <a href="/#categories">{c.footerLinks.categories}</a>
                <a href="/#about">{c.footerLinks.about}</a>
                <a href="/pricing">{c.footerLinks.business}</a>
              </div>
              <div>
                <strong>{c.retailers}</strong>
                <a href="/store-signup">{c.footerLinks.start}</a>
                <a href="/store-dashboard">{c.footerLinks.dashboard}</a>
                <a href="/pricing">{c.footerLinks.pricing}</a>
              </div>
              <div>
                <strong>{c.help}</strong>
                <a href="/support">{c.footerLinks.support}</a>
                <a href="/support">{c.footerLinks.contact}</a>
                <a href="/terms">{c.footerLinks.terms}</a>
                <a href="/privacy">{c.footerLinks.privacy}</a>
              </div>
            </div>
            <div className={styles.footerStatement}>{c.handwrittenFooter} ♥</div>
          </div>
          <div className={styles.footerBottom}>
            <span>© {new Date().getFullYear()} {c.rights}</span>
            <span>getdarik.com · Jordan</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
