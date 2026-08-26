/* DARIK_PUBLIC_APP_LEGAL_320 */
/* DARIK_PUBLIC_APP_LEGAL_BILINGUAL_STACK_322 */

import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Darik Privacy Policy",
  description: "Privacy policy for Darik and the Darik Retailer App.",
};

export default function DarikPrivacyPage() {
  return (
    <main className={styles.page}>
      <article className={styles.shell}>
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand}>Darik</Link>
          <span className={styles.badge}>Privacy</span>
        </div>

        <section id="english">
          <header className={styles.hero}>
            <p className={styles.eyebrow}>LAST UPDATED AUGUST 26, 2026</p>
            <h1>Privacy Policy</h1>
            <p>
              This Privacy Policy explains how Darik handles information when
              retailers and authorized staff use Darik services, including the
              Darik Retailer App and retailer dashboard.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. Information we collect</h2>
            <p>Depending on how you use Darik, we may process:</p>
            <ul>
              <li>Account information such as email, username, role, and user ID.</li>
              <li>Business and storefront information entered by the retailer.</li>
              <li>Product and catalog information, including uploaded photos or videos.</li>
              <li>Order information needed to operate retailer order workflows.</li>
              <li>Device or app identifiers used for app functionality, such as push-notification tokens.</li>
              <li>Support communications and information you voluntarily send to Darik Support.</li>
            </ul>
            <p>
              The Darik Retailer App does not need to collect the retailer device&apos;s
              precise location to provide its core retailer functions. Delivery
              location information already attached to customer orders may be displayed
              to authorized retailer or delivery users when needed to fulfill an order.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. How we use information</h2>
            <ul>
              <li>Authenticate users and protect retailer accounts.</li>
              <li>Operate storefronts, catalogs, orders, staff permissions, and delivery workflows.</li>
              <li>Send operational notifications requested by or necessary for the service.</li>
              <li>Provide support, investigate errors, prevent abuse, and improve reliability.</li>
              <li>Maintain records required for security, fraud prevention, and legal obligations.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>3. Service providers and third parties</h2>
            <p>
              Darik may use trusted infrastructure, database, storage, hosting,
              notification, and other service providers to operate the platform.
              These providers process information only as needed to provide their
              services to Darik. Darik does not sell retailer personal information
              to advertisers.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. Data retention and deletion</h2>
            <p>
              We retain information for as long as reasonably necessary to operate
              the service, protect accounts, resolve disputes, maintain business
              records, and meet legal obligations. Retailers may request deletion of
              account-related information through Darik Support. Some records may be
              retained when required for security, fraud prevention, financial
              records, dispute resolution, or applicable law.
            </p>
          </section>

          <section className={styles.card}>
            <h2>5. Security</h2>
            <p>
              Darik uses reasonable administrative and technical safeguards designed
              to protect account and business information. No online service can
              guarantee absolute security, so users should also protect passwords,
              devices, and account credentials.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. Your choices</h2>
            <p>
              You may contact Darik Support to ask about your information, correct
              inaccurate account details, or request deletion where applicable. You
              can also control optional device permissions through your device settings.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. Contact us</h2>
            <p>
              Privacy questions and requests can be sent through Darik Support on
              WhatsApp at <strong>+962 79 300 9420</strong>.
            </p>
            <Link href="/support" className={styles.secondaryButton}>
              Open Support
            </Link>
          </section>
        </section>

        <div className={styles.languageDivider}>
          <span>العربية</span>
        </div>

        <section id="arabic" dir="rtl" className={styles.arabicSection}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>آخر تحديث: 26 أغسطس 2026</p>
            <h1>سياسة الخصوصية</h1>
            <p>
              توضح سياسة الخصوصية هذه كيفية تعامل داريك مع المعلومات عند استخدام
              التجار والموظفين المصرح لهم لخدمات داريك، بما في ذلك تطبيق داريك
              للتجار ولوحة تحكم التاجر.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. المعلومات التي نجمعها</h2>
            <p>اعتماداً على طريقة استخدامك لداريك، قد نقوم بمعالجة المعلومات التالية:</p>
            <ul>
              <li>معلومات الحساب مثل البريد الإلكتروني، اسم المستخدم، الصلاحية، ومعرف المستخدم.</li>
              <li>معلومات النشاط التجاري وواجهة المتجر التي يقوم التاجر بإدخالها.</li>
              <li>معلومات المنتجات والكتالوج، بما في ذلك الصور أو مقاطع الفيديو المرفوعة.</li>
              <li>معلومات الطلبات اللازمة لتشغيل وإدارة طلبات المتجر.</li>
              <li>معرفات الجهاز أو التطبيق المستخدمة لوظائف التطبيق، مثل رموز إشعارات الدفع.</li>
              <li>مراسلات الدعم والمعلومات التي ترسلها طوعاً إلى فريق دعم داريك.</li>
            </ul>
            <p>
              لا يحتاج تطبيق داريك للتجار إلى جمع الموقع الدقيق لجهاز التاجر
              لتشغيل وظائفه الأساسية. وقد يتم عرض معلومات موقع التوصيل المرتبطة
              أصلاً بطلب العميل للمستخدمين المصرح لهم من التاجر أو السائق عند
              الحاجة لتنفيذ الطلب.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. كيفية استخدام المعلومات</h2>
            <ul>
              <li>التحقق من هوية المستخدمين وحماية حسابات التجار.</li>
              <li>تشغيل واجهات المتاجر والكتالوج والطلبات وصلاحيات الموظفين وآلية التوصيل.</li>
              <li>إرسال الإشعارات التشغيلية المطلوبة أو الضرورية لتقديم الخدمة.</li>
              <li>تقديم الدعم، والتحقيق في الأخطاء، ومنع إساءة الاستخدام، وتحسين الاعتمادية.</li>
              <li>الاحتفاظ بالسجلات اللازمة للأمان ومنع الاحتيال والالتزامات القانونية.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>3. مزودو الخدمة والأطراف الأخرى</h2>
            <p>
              قد تستخدم داريك مزودي خدمات موثوقين للبنية التحتية وقواعد البيانات
              والتخزين والاستضافة والإشعارات وغيرها من الخدمات اللازمة لتشغيل
              المنصة. ويقوم هؤلاء المزودون بمعالجة المعلومات فقط بالقدر اللازم
              لتقديم خدماتهم لداريك. ولا تقوم داريك ببيع المعلومات الشخصية
              الخاصة بالتجار للمعلنين.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. الاحتفاظ بالبيانات وحذفها</h2>
            <p>
              نحتفظ بالمعلومات للمدة المعقولة اللازمة لتشغيل الخدمة، وحماية
              الحسابات، وحل النزاعات، والاحتفاظ بالسجلات التجارية، والوفاء
              بالالتزامات القانونية. ويمكن للتاجر طلب حذف المعلومات المتعلقة
              بالحساب من خلال دعم داريك. وقد نحتفظ ببعض السجلات عندما يكون ذلك
              مطلوباً لأسباب أمنية أو لمنع الاحتيال أو للسجلات المالية أو لحل
              النزاعات أو بموجب القانون المعمول به.
            </p>
          </section>

          <section className={styles.card}>
            <h2>5. الأمان</h2>
            <p>
              تستخدم داريك إجراءات إدارية وتقنية معقولة تهدف إلى حماية معلومات
              الحساب والنشاط التجاري. ولا يمكن لأي خدمة إلكترونية أن تضمن الأمان
              المطلق، لذلك يجب على المستخدمين أيضاً حماية كلمات المرور والأجهزة
              وبيانات الدخول الخاصة بهم.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. خياراتك</h2>
            <p>
              يمكنك التواصل مع دعم داريك للاستفسار عن معلوماتك أو تصحيح بيانات
              الحساب غير الدقيقة أو طلب الحذف عندما يكون ذلك متاحاً. ويمكنك أيضاً
              التحكم في أذونات الجهاز الاختيارية من خلال إعدادات جهازك.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. التواصل معنا</h2>
            <p>
              يمكن إرسال الأسئلة والطلبات المتعلقة بالخصوصية إلى دعم داريك عبر
              واتساب على الرقم <strong>+962 79 300 9420</strong>.
            </p>
            <Link href="/support" className={styles.secondaryButton}>
              فتح صفحة الدعم
            </Link>
          </section>
        </section>

        <nav className={styles.footerLinks} aria-label="Legal links">
          <Link href="/support">Support / الدعم</Link>
          <Link href="/terms">Terms / الشروط</Link>
          <Link href="/">GetDarik.com</Link>
        </nav>
      </article>
    </main>
  );
}
