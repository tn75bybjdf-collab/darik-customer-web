"use client";

// DARIK_PRICING_HALF_OFF_CUSTOM_DOMAIN_330
// DARIK_PAYMENT_FIRST_YEARLY_PLANS_CATALOG_GATE_190

// DARIK_FRONTEND_PRICING_FREE_SETUP_FIRST_129

// DARIK_PRICING_026
// DARIK_PRICING_EXISTING_PLANS_028
import { useEffect, useState } from "react";
import styles from "../marketplace-info.module.css";

type Language = "en" | "ar";
const LANGUAGE_KEY = "darik_marketplace_language_v1";

const content = {
  en: {
    stores: "Stores",
    how: "How it works",
    pricing: "Pricing",
    dashboard: "Retailer dashboard",
    sell: "Sell on Darik",
    kicker: "YEARLY PLANS · PAID UP FRONT",
    titleA: "Choose the plan before you build the catalog.",
    titleB: "Storefront setup opens as soon as you submit CliQ.",
    lead: "Sign up, choose your retail field, choose one yearly plan, send the CliQ payment, and upload the receipt. While Darik reviews it, you can build the storefront itself. Products, categories, and orders unlock only after approval.",
    start: "Sign up today",
    openDashboard: "Open retailer dashboard",
    activationTitle: "Plan first → storefront setup → approval",
    activationSub: "Every Darik Direct plan is yearly and paid up front.",
    activationSteps: [
      ["01", "Sign up", "Create the retailer login and choose the store’s retail field", "Account"],
      ["02", "Choose & pay", "Choose 1,000, 3,000, or 10,000 items and send CliQ", "Paid"],
      ["03", "Build storefront", "Branding, theme, location, delivery, and store settings are available during review", "Setup"],
      ["04", "Approval", "Darik approves the receipt, unlocks the catalog, and publishes the store", "Live"],
    ],
    activationFoot: "Pending or rejected payments never unlock catalog creation. This keeps abandoned accounts from filling Darik with unused products.",
    plansLabel: "50% OFF YEARLY PLANS · NO MONTHLY PLANS",
    plansTitle: "Choose the catalog size your business needs.",
    plansBody: "All three plans are currently 50% off. Every plan includes the Darik Direct storefront, delivery configuration, marketplace discovery, retailer dashboard, and order workflow. The difference is the number of products your catalog can hold.",
    domainTitle: "Use your own domain",
    domainPrice: "100 JOD",
    domainSuffix: "one-time fee",
    domainBody: "Connect your own domain to your Darik storefront for a one-time 100 JOD setup fee.",
    plans: [
      { name: "Up to 1,000 items", regularPrice: "600", price: "300", discount: "50% OFF", suffix: "per year · paid up front", badge: "", featured: false, premium: false },
      { name: "Up to 3,000 items", regularPrice: "800", price: "400", discount: "50% OFF", suffix: "per year · paid up front", badge: "Most flexible", featured: true, premium: false },
      { name: "Up to 10,000 items", regularPrice: "1000", price: "500", discount: "50% OFF", suffix: "per year · paid up front", badge: "Largest catalog", featured: false, premium: false },
    ],
    standardFeatures: [
      "Branded Darik Direct storefront",
      "Storefront setup while CliQ is under review",
      "Delivery zones, fees, timing, pickup, and payment settings",
      "Location-based marketplace discovery after approval",
      "Retailer dashboard and order workflow after approval",
      "Yearly access from the approval date",
    ],
    premiumExtra: "",
    choose: "Sign up today",
    compareLabel: "WHAT CHANGES BY PLAN",
    compareTitle: "Same platform. Different product limits.",
    compareBody: "There are no monthly plans and no reduced-feature storefront tiers. Choose based on how many products you need.",
    feature: "Feature",
    basicPlans: "300 / 400 JOD yearly",
    premiumPlan: "500 JOD yearly",
    compareRows: [
      ["Yearly billing only", "Yes", "Yes"],
      ["Product limit", "1,000 / 3,000", "10,000"],
      ["Storefront setup during CliQ review", "Included", "Included"],
      ["Catalog unlock after payment approval", "Included", "Included"],
      ["Marketplace discovery after approval", "Included", "Included"],
      ["Orders and delivery operations after approval", "Included", "Included"],
    ],
    faqLabel: "QUESTIONS",
    faqTitle: "Payment comes before catalog creation.",
    faqBody: "You can design the storefront while Darik reviews CliQ, but catalog data stays locked until the payment is approved.",
    faqs: [
      ["When do I pay?", "After creating the retailer account and choosing the retail field, you choose a yearly plan and pay by CliQ before storefront setup continues."],
      ["Can I work while my CliQ receipt is under review?", "Yes. You can build the storefront, branding, location, delivery settings, and other storefront settings. Products, categories, and orders remain locked."],
      ["What happens if the payment is rejected?", "Your storefront setup remains available and you can submit another CliQ receipt, but catalog tools stay locked until Darik approves a payment."],
      ["When does the store go live?", "After Darik approves the CliQ payment. Approval activates the yearly plan, unlocks the catalog tools, and publishes the storefront."],
    ],
    ctaLabel: "CHOOSE YOUR YEARLY PLAN UP FRONT",
    ctaTitle: "Sign up today. Pay once for the year. Then build the storefront.",
    ctaBody: "300 JOD for up to 1,000 items, 400 JOD for up to 3,000 items, or 500 JOD for up to 10,000 items.",
    signupCta: "Sign up today",
    dashboardCta: "Go to dashboard",
    footerBody: "Darik connects customers with local stores that deliver to them.",
    platform: "Platform",
    retailers: "Retailers",
    rights: "Darik Technologies. All rights reserved.",
  },
  ar: {
    stores: "المتاجر",
    how: "كيف تعمل",
    pricing: "الأسعار",
    dashboard: "لوحة التاجر",
    sell: "بع على داريك",
    kicker: "خطط سنوية · الدفع مقدماً",
    titleA: "اختر الخطة قبل بناء الكتالوج.",
    titleB: "يبدأ إعداد الواجهة فور إرسال دفعة كليك.",
    lead: "سجّل، اختر مجال المتجر، اختر خطة سنوية، أرسل دفعة CliQ وارفع الإيصال. أثناء مراجعة داريك يمكنك إعداد واجهة المتجر نفسها، أما المنتجات والفئات والطلبات فتفتح فقط بعد الموافقة.",
    start: "سجّل اليوم",
    openDashboard: "افتح لوحة التاجر",
    activationTitle: "الخطة أولاً ← إعداد الواجهة ← الموافقة",
    activationSub: "جميع خطط داريك دايركت سنوية ومدفوعة مقدماً.",
    activationSteps: [
      ["01", "سجّل", "أنشئ حساب التاجر واختر مجال المتجر", "حساب"],
      ["02", "اختر وادفع", "اختر 1,000 أو 3,000 أو 10,000 منتج وأرسل CliQ", "دفع"],
      ["03", "ابنِ الواجهة", "الهوية والتصميم والموقع والتوصيل وإعدادات المتجر متاحة أثناء المراجعة", "إعداد"],
      ["04", "الموافقة", "توافق داريك على الإيصال وتفتح الكتالوج وتنشر المتجر", "مباشر"],
    ],
    activationFoot: "الدفعة المعلقة أو المرفوضة لا تفتح إنشاء الكتالوج، حتى لا تمتلئ داريك بمنتجات لحسابات متروكة.",
    plansLabel: "خصم 50% على الخطط السنوية · لا توجد خطط شهرية",
    plansTitle: "اختر حجم الكتالوج الذي يحتاجه نشاطك.",
    plansBody: "جميع الخطط الثلاث عليها خصم 50% حالياً. وتشمل كل خطة واجهة داريك دايركت وإعدادات التوصيل والاكتشاف في السوق ولوحة التاجر ومسار الطلبات. الفرق هو عدد المنتجات المسموح به.",
    domainTitle: "استخدم نطاقك الخاص",
    domainPrice: "100 دينار",
    domainSuffix: "رسوم لمرة واحدة",
    domainBody: "اربط نطاقك الخاص بواجهة متجرك على داريك مقابل رسوم إعداد 100 دينار تدفع لمرة واحدة.",
    plans: [
      { name: "حتى 1,000 منتج", regularPrice: "600", price: "300", discount: "خصم 50%", suffix: "سنوياً · الدفع مقدماً", badge: "", featured: false, premium: false },
      { name: "حتى 3,000 منتج", regularPrice: "800", price: "400", discount: "خصم 50%", suffix: "سنوياً · الدفع مقدماً", badge: "الأكثر مرونة", featured: true, premium: false },
      { name: "حتى 10,000 منتج", regularPrice: "1000", price: "500", discount: "خصم 50%", suffix: "سنوياً · الدفع مقدماً", badge: "أكبر كتالوج", featured: false, premium: false },
    ],
    standardFeatures: [
      "واجهة داريك دايركت باسم المتجر",
      "إعداد الواجهة أثناء مراجعة دفعة CliQ",
      "مناطق ورسوم ووقت التوصيل والاستلام وإعدادات الدفع",
      "الظهور حسب موقع الزبون بعد الموافقة",
      "لوحة التاجر ومسار الطلبات بعد الموافقة",
      "اشتراك سنوي يبدأ من تاريخ الموافقة",
    ],
    premiumExtra: "",
    choose: "سجّل اليوم",
    compareLabel: "الفرق بين الخطط",
    compareTitle: "نفس المنصة. حدود منتجات مختلفة.",
    compareBody: "لا توجد خطط شهرية ولا خطط بميزات ناقصة. اختر حسب عدد المنتجات الذي يحتاجه متجرك.",
    feature: "الميزة",
    basicPlans: "300 / 400 دينار سنوياً",
    premiumPlan: "500 دينار سنوياً",
    compareRows: [
      ["فوترة سنوية فقط", "نعم", "نعم"],
      ["حد المنتجات", "1,000 / 3,000", "10,000"],
      ["إعداد الواجهة أثناء مراجعة CliQ", "مشمولة", "مشمولة"],
      ["فتح الكتالوج بعد موافقة الدفع", "مشمولة", "مشمولة"],
      ["الظهور في السوق بعد الموافقة", "مشمولة", "مشمولة"],
      ["الطلبات والتوصيل بعد الموافقة", "مشمولة", "مشمولة"],
    ],
    faqLabel: "أسئلة",
    faqTitle: "الدفع يسبق إنشاء الكتالوج.",
    faqBody: "يمكنك تصميم واجهة المتجر أثناء مراجعة CliQ، لكن بيانات الكتالوج تبقى مقفلة حتى الموافقة على الدفع.",
    faqs: [
      ["متى أدفع؟", "بعد إنشاء حساب التاجر واختيار مجال المتجر تختار خطة سنوية وتدفع عبر CliQ قبل متابعة إعداد الواجهة."],
      ["هل أستطيع العمل أثناء مراجعة إيصال CliQ؟", "نعم. تستطيع إعداد الواجهة والهوية والموقع والتوصيل وباقي إعدادات المتجر، لكن المنتجات والفئات والطلبات تبقى مقفلة."],
      ["ماذا يحدث إذا رُفضت الدفعة؟", "تبقى إعدادات الواجهة متاحة ويمكنك إرسال إيصال CliQ جديد، لكن أدوات الكتالوج تبقى مقفلة حتى توافق داريك على دفعة."],
      ["متى يصبح المتجر مباشراً؟", "بعد موافقة داريك على دفعة CliQ. عندها تتفعّل الخطة السنوية وتفتح أدوات الكتالوج وتنشر الواجهة."],
    ],
    ctaLabel: "اختر خطتك السنوية مقدماً",
    ctaTitle: "سجّل اليوم. ادفع للسنة مرة واحدة. ثم ابنِ واجهة متجرك.",
    ctaBody: "300 دينار حتى 1,000 منتج، 400 دينار حتى 3,000 منتج، أو 500 دينار حتى 10,000 منتج.",
    signupCta: "سجّل اليوم",
    dashboardCta: "اذهب إلى اللوحة",
    footerBody: "داريك يربط الزبائن بالمتاجر المحلية التي توصل إليهم.",
    platform: "المنصة",
    retailers: "للتجار",
    rights: "داريك تكنولوجيز. جميع الحقوق محفوظة.",
  },
} as const;

export default function PricingPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    if (saved === "ar" || saved === "en") setLanguage(saved);
  }, []);

  const t = content[language];
  const toggleLanguage = () => {
    const next: Language = language === "en" ? "ar" : "en";
    setLanguage(next);
    window.localStorage.setItem(LANGUAGE_KEY, next);
  };

  return (
    <main className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.logoLink} href="/" aria-label="Darik Marketplace home">
            <img className={styles.logo} src="/darik_logo_final_v2.png" alt="Darik Marketplace" />
          </a>
          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="/">{t.stores}</a>
            <a href="/how-it-works">{t.how}</a>
            <a className={styles.active} href="/pricing">{t.pricing}</a>
          </nav>
          <div className={styles.actions}>
            <button className={styles.language} type="button" onClick={toggleLanguage}>{language === "en" ? "العربية" : "English"}</button>
            <a className={styles.dashboard} href="/store-dashboard">{t.dashboard}</a>
            <a className={styles.sell} href="/store-signup">{t.sell}</a>
          </div>
        </div>
      </header>

      <section className={`${styles.hero} ${styles.pricingHero}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}><i />{t.kicker}</span>
            <h1>{t.titleA}<strong>{t.titleB}</strong></h1>
            <p className={styles.heroLead}>{t.lead}</p>
            <div className={styles.heroButtons}>
              <a className={styles.primaryButton} href="/store-signup">{t.start} →</a>
              <a className={styles.secondaryButton} href="/store-dashboard">{t.openDashboard}</a>
            </div>
          </div>

          <div className={styles.activationCard}>
            <div className={styles.activationCardTop}><span className={styles.activationIcon}>✓</span><div><strong>{t.activationTitle}</strong><small>{t.activationSub}</small></div></div>
            <div className={styles.activationTimeline}>
              {t.activationSteps.map(([number, title, body, state]) => (
                <div className={styles.activationItem} key={number}><span>{number}</span><div><strong>{title}</strong><small>{body}</small></div><b>{state}</b></div>
              ))}
            </div>
            <div className={styles.activationFoot}>{t.activationFoot}</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>{t.plansLabel}</span>
            <h2>{t.plansTitle}</h2>
            <p>{t.plansBody}</p>
          </div>

          <div className={styles.priceGrid}>
            {t.plans.map((plan) => (
              <article className={`${styles.priceCard} ${plan.featured ? styles.featured : ""} ${plan.premium ? styles.premium : ""}`} key={plan.name}>
                {plan.badge ? <span className={styles.priceBadge}>{plan.badge}</span> : null}
                <p className={styles.planName}>{plan.name}</p>
                <div className={styles.priceSaleRow330}>
                  <span className={styles.discountBadge330}>{plan.discount}</span>
                  <span className={styles.regularPrice330}>JOD {plan.regularPrice}</span>
                </div>
                <div className={styles.planPrice}><span>JOD</span><strong>{plan.price}</strong></div>
                <div className={styles.planSuffix}>{plan.suffix}</div>
                <div className={styles.planRule} />
                <ul className={styles.featureList}>
                  {t.standardFeatures.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
                  {plan.premium ? <li><span>✓</span>{t.premiumExtra}</li> : null}
                </ul>
                <a className={styles.planButton} href="/store-signup">{t.choose}</a>
              </article>
            ))}
          </div>

          <div className={styles.domainOffer330}>
            <div className={styles.domainOfferIcon330}>www</div>
            <div className={styles.domainOfferCopy330}>
              <strong>{t.domainTitle}</strong>
              <p>{t.domainBody}</p>
            </div>
            <div className={styles.domainOfferPrice330}>
              <strong>{t.domainPrice}</strong>
              <span>{t.domainSuffix}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionSoft}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>{t.compareLabel}</span>
            <h2>{t.compareTitle}</h2>
            <p>{t.compareBody}</p>
          </div>
          <div className={styles.compare}>
            <div className={`${styles.compareRow} ${styles.headerRow}`}><strong>{t.feature}</strong><span>{t.basicPlans}</span><span>{t.premiumPlan}</span></div>
            {t.compareRows.map(([feature, basic, premium]) => (
              <div className={styles.compareRow} key={feature}><strong>{feature}</strong><span className={basic === "Included" || basic === "مشمولة" ? styles.yes : ""}>{basic}</span><span className={styles.premiumText}>{premium}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>{t.faqLabel}</span>
            <h2>{t.faqTitle}</h2>
            <p>{t.faqBody}</p>
          </div>
          <div className={styles.faqGrid}>
            {t.faqs.map(([question, answer]) => <article className={styles.faq} key={question}><h3>{question}</h3><p>{answer}</p></article>)}
          </div>
        </div>
      </section>

      <section className={styles.sectionSoft}>
        <div className={styles.shell}>
          <div className={styles.cta}>
            <div><span>{t.ctaLabel}</span><h2>{t.ctaTitle}</h2><p>{t.ctaBody}</p></div>
            <div className={styles.ctaActions}><a href="/store-signup">{t.signupCta}</a><a href="/store-dashboard">{t.dashboardCta}</a></div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}><a className={styles.logoLink} href="/"><img className={styles.logo} src="/darik_logo_final_v2.png" alt="Darik Marketplace" /></a><p>{t.footerBody}</p></div>
          <div className={styles.footerLinks}>
            <div><strong>{t.platform}</strong><a href="/">{t.stores}</a><a href="/how-it-works">{t.how}</a><a href="/pricing">{t.pricing}</a></div>
            <div><strong>{t.retailers}</strong><a href="/store-signup">{t.sell}</a><a href="/store-dashboard">{t.dashboard}</a></div>
          </div>
        </div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {t.rights}</span><span>getdarik.com · Jordan</span></div>
      </footer>
    </main>
  );
}
