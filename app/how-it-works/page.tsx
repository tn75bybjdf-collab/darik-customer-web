"use client";
// DARIK_UTF8_CLEAN_REBUILD_029_V4

// DARIK_HOW_IT_WORKS_026
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
    kicker: "THE DARIK DELIVERY NETWORK",
    titleA: "One location.",
    titleB: "Every store that can reach it.",
    lead: "Darik connects customers to local retailers based on the retailer’s real delivery range—not a random city list or a guessed neighborhood.",
    findStores: "Find stores near me",
    startStore: "Create a retailer store",
    liveCheck: "Live delivery-zone check",
    eligibleOnly: "Eligible stores only",
    flowLocation: "Customer location",
    flowLocationBody: "GPS or searched address",
    flowMatch: "Delivery-range matching",
    flowMatchBody: "Distance checked against each active store",
    flowStore: "Retailer storefront",
    flowStoreBody: "Customer shops directly from the selected store",
    customerLabel: "FOR CUSTOMERS",
    customerTitle: "From opening Darik to entering a store in four clear steps.",
    customerBody: "The marketplace homepage handles discovery. Each retailer’s own storefront handles products, cart, checkout, and the final order.",
    steps: [
      ["01", "⌖", "Set the delivery location", "Allow browser location access or search for an address manually."],
      ["02", "◎", "Darik checks every delivery zone", "Only active stores whose configured radius reaches the customer are eligible."],
      ["03", "▦", "Browse by retail field", "Filter grocery, pharmacy, fashion, technology, automotive, food, and more."],
      ["04", "→", "Enter the retailer’s storefront", "Open /[store-name], choose products, and complete the order directly with that business."],
    ],
    trustLabel: "DISCOVERY LOGIC",
    trustTitle: "A store appears because it can actually deliver—not because it paid for a random listing.",
    trustBody: "Darik uses the customer’s location as a matching input and returns only the public storefront information needed for discovery.",
    checks: [
      ["Published storefront", "Draft or private storefronts are not included in customer discovery."],
      ["Active delivery radius", "The store must have a valid location and a positive configured delivery range."],
      ["Distance eligibility", "The customer’s address must fall inside that store’s delivery radius."],
      ["Retail-field organization", "Eligible stores are grouped into useful shopping fields instead of one crowded feed."],
    ],
    logicTitle: "Marketplace eligibility check",
    active: "Active",
    rowOne: ["Store is public", "Published storefront"],
    rowTwo: ["Delivery range reaches customer", "Distance ≤ store radius"],
    rowThree: ["Safe public data only", "No retailer coordinates returned"],
    rowFour: ["Store opens directly", "Existing /[store-name] route"],
    privateTitle: "Location privacy is built into discovery",
    privateBody: "The public nearby-store result does not expose a retailer’s latitude or longitude. The customer’s exact location is not shown to a retailer just for browsing.",
    retailerLabel: "FOR RETAILERS",
    retailerTitle: "Build once. Get discovered automatically whenever a nearby customer qualifies.",
    retailerBody: "Retailers control their storefront, catalog, delivery settings, and order availability from the existing Darik dashboard.",
    retailerSteps: [
      ["01", "Create the store", "Sign up and build the storefront privately before activation."],
      ["02", "Configure delivery", "Set the store location, public address, radius, fee, minimum, and timing."],
      ["03", "Add the catalog", "Create categories and products from the retailer dashboard."],
      ["04", "Go public", "After Darik activation, qualifying customers can discover and enter the store."],
    ],
    retailerCta: "Start building free",
    ctaLabel: "READY TO USE DARIK?",
    ctaTitle: "Choose your side of the marketplace.",
    ctaBody: "Customers discover stores by delivery range. Retailers build their own storefront and become visible to nearby shoppers.",
    customerCta: "Browse nearby stores",
    dashboardCta: "Open retailer dashboard",
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
    kicker: "شبكة توصيل داريك",
    titleA: "موقع واحد.",
    titleB: "كل متجر يقدر يوصل له.",
    lead: "يربط داريك الزبون بالمتاجر المحلية حسب نطاق التوصيل الحقيقي لكل متجر، وليس حسب قائمة عشوائية أو تخمين للمنطقة.",
    findStores: "اعثر على متاجر قريبة",
    startStore: "أنشئ متجر تاجر",
    liveCheck: "فحص مباشر لنطاق التوصيل",
    eligibleOnly: "متاجر مؤهلة فقط",
    flowLocation: "موقع الزبون",
    flowLocationBody: "GPS أو عنوان تم البحث عنه",
    flowMatch: "مطابقة نطاق التوصيل",
    flowMatchBody: "فحص المسافة مقابل كل متجر فعال",
    flowStore: "واجهة متجر التاجر",
    flowStoreBody: "يتسوق الزبون مباشرة من المتجر المختار",
    customerLabel: "للزبائن",
    customerTitle: "من فتح داريك إلى دخول المتجر بأربع خطوات واضحة.",
    customerBody: "الصفحة الرئيسية تتولى اكتشاف المتاجر، وواجهة كل تاجر تتولى المنتجات والسلة والدفع والطلب النهائي.",
    steps: [
      ["01", "⌖", "حدد موقع التوصيل", "اسمح للموقع من المتصفح أو ابحث عن العنوان يدوياً."],
      ["02", "◎", "داريك يفحص كل نطاقات التوصيل", "لا يظهر إلا المتجر الفعال الذي يصل نطاقه إلى موقع الزبون."],
      ["03", "▦", "تصفح حسب مجال البيع", "فلتر البقالة والصيدليات والأزياء والتكنولوجيا والسيارات والطعام والمزيد."],
      ["04", "←", "ادخل واجهة التاجر", "افتح رابط المتجر، اختر المنتجات وأكمل الطلب مباشرة مع ذلك النشاط."],
    ],
    trustLabel: "منطق الاكتشاف",
    trustTitle: "يظهر المتجر لأنه فعلياً يقدر يوصل، وليس لأنه موجود ضمن قائمة عامة.",
    trustBody: "يستخدم داريك موقع الزبون فقط للمطابقة ويعيد معلومات الواجهة العامة اللازمة لعرض المتجر.",
    checks: [
      ["واجهة منشورة", "المتاجر المسودة أو الخاصة لا تدخل ضمن اكتشاف الزبائن."],
      ["نطاق توصيل فعال", "يجب أن يكون للمتجر موقع صحيح ونطاق توصيل أكبر من صفر."],
      ["المسافة مؤهلة", "يجب أن يكون عنوان الزبون داخل نصف قطر توصيل المتجر."],
      ["تنظيم حسب المجال", "يتم ترتيب المتاجر المؤهلة ضمن مجالات تسوق واضحة بدل قائمة مزدحمة."],
    ],
    logicTitle: "فحص أهلية المتجر",
    active: "فعال",
    rowOne: ["المتجر عام", "واجهة منشورة"],
    rowTwo: ["نطاق التوصيل يصل للزبون", "المسافة ≤ نطاق المتجر"],
    rowThree: ["بيانات عامة آمنة فقط", "لا يتم إرجاع إحداثيات التاجر"],
    rowFour: ["فتح المتجر مباشرة", "رابط واجهة المتجر الحالي"],
    privateTitle: "خصوصية الموقع جزء من نظام الاكتشاف",
    privateBody: "نتيجة المتاجر القريبة العامة لا تكشف خط العرض أو الطول الخاص بالتاجر، ولا يظهر موقع الزبون الدقيق للتاجر لمجرد التصفح.",
    retailerLabel: "للتجار",
    retailerTitle: "ابنِ متجرك مرة واحدة واظهر تلقائياً لكل زبون قريب مؤهل.",
    retailerBody: "يتحكم التاجر بواجهته وكتالوجه وإعدادات التوصيل وحالة استقبال الطلبات من لوحة داريك الحالية.",
    retailerSteps: [
      ["01", "أنشئ المتجر", "سجل وابنِ الواجهة بشكل خاص قبل التفعيل."],
      ["02", "اضبط التوصيل", "حدد موقع المتجر والعنوان العام والنطاق والرسوم والحد الأدنى والوقت."],
      ["03", "أضف الكتالوج", "أنشئ الأقسام والمنتجات من لوحة التاجر."],
      ["04", "انشر المتجر", "بعد تفعيل داريك يظهر المتجر للزبائن الذين يشملهم نطاق التوصيل."],
    ],
    retailerCta: "ابدأ البناء مجاناً",
    ctaLabel: "جاهز تستخدم داريك؟",
    ctaTitle: "اختر جانبك من السوق.",
    ctaBody: "الزبائن يكتشفون المتاجر حسب نطاق التوصيل، والتجار يبنون واجهاتهم ويظهرون للمتسوقين القريبين.",
    customerCta: "تصفح المتاجر القريبة",
    dashboardCta: "افتح لوحة التاجر",
    footerBody: "داريك يربط الزبائن بالمتاجر المحلية التي توصل إليهم.",
    platform: "المنصة",
    retailers: "للتجار",
    rights: "داريك تكنولوجيز. جميع الحقوق محفوظة.",
  },
} as const;

export default function HowItWorksPage() {
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
            <a className={styles.active} href="/how-it-works">{t.how}</a>
            <a href="/pricing">{t.pricing}</a>
          </nav>
          <div className={styles.actions}>
            <button className={styles.language} type="button" onClick={toggleLanguage}>{language === "en" ? "العربية" : "English"}</button>
            <a className={styles.dashboard} href="/store-dashboard">{t.dashboard}</a>
            <a className={styles.sell} href="/store-signup">{t.sell}</a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}><i />{t.kicker}</span>
            <h1>{t.titleA}<strong>{t.titleB}</strong></h1>
            <p className={styles.heroLead}>{t.lead}</p>
            <div className={styles.heroButtons}>
              <a className={styles.primaryButton} href="/">{t.findStores} →</a>
              <a className={styles.secondaryButton} href="/store-signup">{t.startStore}</a>
            </div>
          </div>

          <div className={styles.heroPanel} aria-hidden="true">
            <div className={styles.panelTop}><span><i />{t.liveCheck}</span><b>{t.eligibleOnly}</b></div>
            <div className={styles.flow}>
              <div className={styles.flowCard}><span>1</span><div><strong>{t.flowLocation}</strong><small>{t.flowLocationBody}</small></div><b>↓</b></div>
              <div className={styles.flowLine} />
              <div className={styles.flowCard}><span>2</span><div><strong>{t.flowMatch}</strong><small>{t.flowMatchBody}</small></div><b>↓</b></div>
              <div className={styles.flowLine} />
              <div className={styles.flowCard}><span>3</span><div><strong>{t.flowStore}</strong><small>{t.flowStoreBody}</small></div><b>✓</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>{t.customerLabel}</span>
            <h2>{t.customerTitle}</h2>
            <p>{t.customerBody}</p>
          </div>
          <div className={styles.steps}>
            {t.steps.map(([number, icon, title, body]) => (
              <article className={styles.step} key={number}>
                <span className={styles.stepNumber}>{number}</span>
                <span className={styles.stepIcon}>{icon}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionSoft}>
        <div className={styles.shell}>
          <div className={styles.split}>
            <div className={styles.splitCopy}>
              <span className={styles.sectionLabel}>{t.trustLabel}</span>
              <h2>{t.trustTitle}</h2>
              <p>{t.trustBody}</p>
              <div className={styles.checks}>
                {t.checks.map(([title, body]) => (
                  <div className={styles.check} key={title}><span>✓</span><div><strong>{title}</strong><small>{body}</small></div></div>
                ))}
              </div>
            </div>

            <div className={styles.logicPanel}>
              <div className={styles.logicHeader}><strong>{t.logicTitle}</strong><span>{t.active}</span></div>
              <div className={styles.logicRows}>
                {[t.rowOne, t.rowTwo, t.rowThree, t.rowFour].map(([title, body]) => (
                  <div className={styles.logicRow} key={title}><div><strong>{title}</strong><small>{body}</small></div><b>✓</b></div>
                ))}
              </div>
              <div className={styles.privacyNote}><span>⌖</span><div><strong>{t.privateTitle}</strong><small>{t.privateBody}</small></div></div>
            </div>
          </div>

          <div className={styles.retailerFlow}>
            <div className={styles.retailerFlowTop}>
              <div><span>{t.retailerLabel}</span><h3>{t.retailerTitle}</h3><p>{t.retailerBody}</p></div>
              <a href="/store-signup">{t.retailerCta} →</a>
            </div>
            <div className={styles.retailerSteps}>
              {t.retailerSteps.map(([number, title, body]) => (
                <div className={styles.retailerStep} key={number}><span>{number}</span><strong>{title}</strong><small>{body}</small></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.cta}>
            <div><span>{t.ctaLabel}</span><h2>{t.ctaTitle}</h2><p>{t.ctaBody}</p></div>
            <div className={styles.ctaActions}><a href="/">{t.customerCta}</a><a href="/store-dashboard">{t.dashboardCta}</a></div>
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
