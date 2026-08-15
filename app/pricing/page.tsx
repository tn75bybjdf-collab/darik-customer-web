"use client";

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
    kicker: "FREE TO CREATE & SET UP",
    titleA: "Create your Darik store for 0 JOD.",
    titleB: "Choose a paid plan only when you’re ready to go live.",
    lead: "No plan selection. No payment. Create your retailer account, build the storefront, configure delivery, add categories and products, and preview everything privately for 0 JOD.",
    start: "Create free retailer account",
    openDashboard: "Open retailer dashboard",
    activationTitle: "0 JOD setup first → paid activation later",
    activationSub: "Creating the account and setting up the entire private store costs 0 JOD.",
    activationSteps: [
      ["01", "Build", "Storefront, delivery settings, categories, and products", "Free"],
      ["02", "Choose", "Only after the store is ready, choose how long you want to activate it", "Ready"],
      ["03", "Pay", "Pay only after you decide to publish the finished store", "Review"],
      ["04", "Launch", "Darik activates the public storefront after approval", "Live"],
    ],
    activationFoot: "You do NOT choose or pay for a plan when creating your account. The paid options below are only for making the finished store public.",
    plansLabel: "ONLY WHEN YOU’RE READY TO GO LIVE",
    plansTitle: "These are activation options — not signup plans.",
    plansBody: "Start for 0 JOD first. Build and preview the store. Come back to these prices only when you want Darik to publish it.",
    plans: [
      { name: "Monthly", price: "45", suffix: "per month", badge: "", featured: false, premium: false },
      { name: "Six months", price: "210", suffix: "one payment", badge: "", featured: false, premium: false },
      { name: "Annual Basic", price: "300", suffix: "one payment", badge: "Best value", featured: true, premium: false },
      { name: "Annual Premium", price: "600", suffix: "one payment", badge: "Premium", featured: false, premium: true },
    ],
    standardFeatures: [
      "Branded public storefront",
      "Products, categories, and store dashboard",
      "Delivery radius, fee, minimum, and timing",
      "Location-based marketplace discovery",
      "Order receiving and status workflow",
      "Build and preview privately before activation",
    ],
    premiumExtra: "Custom-domain preference setup",
    choose: "Create free account first",
    compareLabel: "AFTER YOUR FREE SETUP",
    compareTitle: "Payment starts only when you activate the public store.",
    compareBody: "Your account, private storefront setup, catalog, delivery configuration, and preview come first for 0 JOD. These paid terms begin only when you go live.",
    feature: "Feature",
    basicPlans: "Monthly / 6 mo / Annual Basic",
    premiumPlan: "Annual Premium",
    compareRows: [
      ["Public Darik storefront", "Included", "Included"],
      ["Marketplace delivery-range discovery", "Included", "Included"],
      ["Retailer dashboard and catalog", "Included", "Included"],
      ["Orders and delivery settings", "Included", "Included"],
      ["Private build and preview before activation", "Included", "Included"],
      ["Custom-domain preference setup", "Not included", "Included"],
    ],
    faqLabel: "QUESTIONS",
    faqTitle: "Free first. Activation later.",
    faqBody: "Account creation and private setup are free. Payment is only for activating the finished store publicly.",
    faqs: [
      ["Do I choose or pay for a plan when I create my account?", "No. Creating the retailer account and setting up the private store costs 0 JOD. Choose an activation option only after the store is ready and you decide to publish it."],
      ["When does the store become public?", "After a plan is selected, the required CliQ payment proof is submitted, and Darik reviews and approves the activation request."],
      ["Do the lower plans lose core store features?", "No. The core storefront, dashboard, catalog, delivery settings, discovery eligibility, and order workflow are included across the activation terms."],
      ["What is the Premium difference?", "Annual Premium includes the custom-domain preference setup in addition to the core Darik Direct platform."],
    ],
    ctaLabel: "0 JOD TO CREATE YOUR RETAILER ACCOUNT",
    ctaTitle: "Do not choose a plan yet. Create your account and build the store first.",
    ctaBody: "Set up the business, branding, delivery zones, categories, and products for free. Choose an activation term only when you are ready to launch.",
    signupCta: "Create free retailer account",
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
    kicker: "إنشاء وإعداد مجاني",
    titleA: "أنشئ متجر داريك بـ 0 دينار.",
    titleB: "اختر خطة مدفوعة فقط عندما تكون جاهزاً للنشر.",
    lead: "لا اختيار خطة ولا دفع عند البداية. أنشئ حساب التاجر وابنِ الواجهة واضبط التوصيل وأضف الأقسام والمنتجات وعاين كل شيء بشكل خاص مقابل 0 دينار.",
    start: "أنشئ حساب تاجر مجاناً",
    openDashboard: "افتح لوحة التاجر",
    activationTitle: "إعداد بـ 0 دينار أولاً ← تفعيل مدفوع لاحقاً",
    activationSub: "إنشاء الحساب وإعداد المتجر الخاص بالكامل يكلف 0 دينار.",
    activationSteps: [
      ["01", "ابنِ", "الواجهة وإعدادات التوصيل والأقسام والمنتجات", "مجاني"],
      ["02", "اختر", "بعد تجهيز المتجر فقط اختر مدة التفعيل المناسبة لك", "جاهز"],
      ["03", "ادفع", "ادفع فقط بعد أن تقرر نشر المتجر الجاهز", "مراجعة"],
      ["04", "انطلق", "يفعّل داريك الواجهة العامة بعد الموافقة", "مباشر"],
    ],
    activationFoot: "لا تختار ولا تدفع لأي خطة عند إنشاء الحساب. الخيارات المدفوعة أدناه هي فقط لنشر المتجر الجاهز للعامة.",
    plansLabel: "فقط عندما تكون جاهزاً للنشر",
    plansTitle: "هذه خيارات تفعيل وليست خطط تسجيل.",
    plansBody: "ابدأ أولاً مقابل 0 دينار وابنِ وعاين متجرك. ارجع لهذه الأسعار فقط عندما تريد نشر المتجر على داريك.",
    plans: [
      { name: "شهري", price: "45", suffix: "شهرياً", badge: "", featured: false, premium: false },
      { name: "ستة أشهر", price: "210", suffix: "دفعة واحدة", badge: "", featured: false, premium: false },
      { name: "أساسي سنوي", price: "300", suffix: "دفعة واحدة", badge: "أفضل قيمة", featured: true, premium: false },
      { name: "بريميوم سنوي", price: "600", suffix: "دفعة واحدة", badge: "بريميوم", featured: false, premium: true },
    ],
    standardFeatures: [
      "واجهة عامة باسم المتجر",
      "منتجات وأقسام ولوحة تحكم",
      "نطاق ورسوم وحد أدنى ووقت التوصيل",
      "اكتشاف حسب موقع الزبون",
      "استقبال الطلبات ومسار حالتها",
      "بناء ومعاينة خاصة قبل التفعيل",
    ],
    premiumExtra: "إعداد تفضيلات نطاق مخصص",
    choose: "أنشئ حسابك المجاني أولاً",
    compareLabel: "بعد الإعداد المجاني",
    compareTitle: "الدفع يبدأ فقط عند تفعيل المتجر للعامة.",
    compareBody: "الحساب وإعداد الواجهة الخاصة والكتالوج والتوصيل والمعاينة تأتي أولاً مقابل 0 دينار. مدد التفعيل المدفوعة تبدأ فقط عند النشر.",
    feature: "الميزة",
    basicPlans: "شهري / 6 أشهر / سنوي أساسي",
    premiumPlan: "سنوي بريميوم",
    compareRows: [
      ["واجهة داريك عامة", "مشمولة", "مشمولة"],
      ["اكتشاف حسب نطاق التوصيل", "مشمولة", "مشمولة"],
      ["لوحة التاجر والكتالوج", "مشمولة", "مشمولة"],
      ["الطلبات وإعدادات التوصيل", "مشمولة", "مشمولة"],
      ["بناء ومعاينة خاصة قبل التفعيل", "مشمولة", "مشمولة"],
      ["إعداد تفضيلات نطاق مخصص", "غير مشمولة", "مشمولة"],
    ],
    faqLabel: "أسئلة",
    faqTitle: "مجاني أولاً. التفعيل لاحقاً.",
    faqBody: "إنشاء الحساب والإعداد الخاص مجانيان. الدفع يكون فقط لتفعيل المتجر الجاهز ونشره للعامة.",
    faqs: [
      ["هل أختار أو أدفع لخطة عند إنشاء الحساب؟", "لا. إنشاء حساب التاجر وإعداد المتجر الخاص يكلف 0 دينار. اختر خيار التفعيل فقط بعد تجهيز المتجر وقرارك بنشره."],
      ["متى يصبح المتجر عاماً؟", "بعد اختيار الخطة وإرسال إثبات دفعة CliQ المطلوبة ومراجعة طلب التفعيل والموافقة عليه من داريك."],
      ["هل الخطط الأقل تفقد ميزات المتجر الأساسية؟", "لا. أساس الواجهة ولوحة التحكم والكتالوج وإعدادات التوصيل وأهلية الاكتشاف ومسار الطلبات مشمول ضمن مدد التفعيل."],
      ["ما الفرق في بريميوم؟", "الخطة السنوية بريميوم تشمل إعداد تفضيلات النطاق المخصص إضافة إلى منصة داريك الأساسية."],
    ],
    ctaLabel: "0 دينار لإنشاء حساب التاجر",
    ctaTitle: "لا تختار خطة الآن. أنشئ حسابك وابنِ المتجر أولاً.",
    ctaBody: "اضبط النشاط والهوية ونطاقات التوصيل والأقسام والمنتجات مجاناً. اختر مدة التفعيل فقط عندما تكون جاهزاً للنشر.",
    signupCta: "أنشئ حساب تاجر",
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
            <img className={styles.logo} src="/darik_logo_final_v3.png" alt="Darik Marketplace" />
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
          <div className={styles.footerBrand}><a className={styles.logoLink} href="/"><img className={styles.logo} src="/darik_logo_final_v3.png" alt="Darik Marketplace" /></a><p>{t.footerBody}</p></div>
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
