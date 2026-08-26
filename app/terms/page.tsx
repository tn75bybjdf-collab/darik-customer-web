/* DARIK_PUBLIC_APP_LEGAL_320 */
/* DARIK_PUBLIC_APP_LEGAL_BILINGUAL_STACK_322 */

import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Darik Terms of Service",
  description: "Terms of Service for Darik and the Darik Retailer App.",
};

export default function DarikTermsPage() {
  return (
    <main className={styles.page}>
      <article className={styles.shell}>
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand}>Darik</Link>
          <span className={styles.badge}>Terms</span>
        </div>

        <section id="english">
          <header className={styles.hero}>
            <p className={styles.eyebrow}>LAST UPDATED AUGUST 26, 2026</p>
            <h1>Terms of Service</h1>
            <p>
              These Terms govern use of Darik services, including the Darik Retailer
              App, retailer dashboard, marketplace, and retailer storefront tools.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. Using Darik</h2>
            <p>
              You may use Darik only for lawful business activity and in accordance
              with these Terms. Retailer accounts are intended for businesses and
              authorized staff managing storefronts, products, orders, customers, and
              related operations.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. Account responsibility</h2>
            <p>
              Retailers are responsible for keeping login credentials secure, limiting
              staff access to authorized users, and keeping business information
              accurate. Activity performed through an authorized retailer account may
              be treated as activity of that retailer.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. Products, orders, and fulfillment</h2>
            <p>
              Retailers are responsible for the accuracy, legality, pricing,
              availability, quality, and fulfillment of the physical products or
              services they list. Retailers are also responsible for delivery,
              pickup, refunds, and customer service obligations unless Darik
              explicitly agrees otherwise in writing.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. Acceptable use</h2>
            <p>You may not use Darik to:</p>
            <ul>
              <li>Break applicable law or violate another person&apos;s rights.</li>
              <li>Upload fraudulent, misleading, infringing, malicious, or unsafe content.</li>
              <li>Attempt unauthorized access to another retailer, user, system, or account.</li>
              <li>Interfere with Darik security, availability, or normal platform operation.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>5. Platform availability and changes</h2>
            <p>
              Darik may update, improve, replace, suspend, or discontinue features when
              reasonably necessary for security, reliability, legal compliance, or
              product development. We aim to keep the service available but do not
              guarantee uninterrupted operation.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. Fees and retailer services</h2>
            <p>
              Some Darik retailer services may require activation, subscription, or
              other fees disclosed before purchase. Retailers remain responsible for
              applicable taxes, customer transactions, and charges associated with
              their own business operations.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. Suspension and termination</h2>
            <p>
              Darik may restrict or suspend access when necessary to protect users,
              prevent fraud or abuse, enforce these Terms, or comply with law. A
              retailer may stop using the service and may contact Darik Support about
              account closure or data requests.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. Limitation of responsibility</h2>
            <p>
              To the extent permitted by applicable law, Darik is not responsible for
              losses caused by a retailer&apos;s inaccurate listings, unlawful products,
              failure to fulfill orders, misuse of credentials, third-party services,
              or events outside Darik&apos;s reasonable control.
            </p>
          </section>

          <section className={styles.card}>
            <h2>9. Contact</h2>
            <p>
              Questions about these Terms can be sent through Darik Support on
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
            <h1>شروط الاستخدام</h1>
            <p>
              تنظم هذه الشروط استخدام خدمات داريك، بما في ذلك تطبيق داريك
              للتجار، ولوحة تحكم التاجر، والسوق الإلكتروني، وأدوات واجهة المتجر.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. استخدام داريك</h2>
            <p>
              يجوز لك استخدام داريك فقط للأنشطة التجارية القانونية ووفقاً لهذه
              الشروط. حسابات التجار مخصصة للأنشطة التجارية والموظفين المصرح لهم
              بإدارة واجهات المتاجر والمنتجات والطلبات والعملاء والعمليات ذات
              الصلة.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. مسؤولية الحساب</h2>
            <p>
              يتحمل التاجر مسؤولية حماية بيانات تسجيل الدخول، وقصر وصول الموظفين
              على الأشخاص المصرح لهم، والمحافظة على دقة معلومات النشاط التجاري.
              وقد يتم اعتبار النشاط المنفذ من خلال حساب تاجر مصرح به نشاطاً تابعاً
              لذلك التاجر.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. المنتجات والطلبات والتنفيذ</h2>
            <p>
              يتحمل التاجر مسؤولية دقة وقانونية وتسعير وتوفر وجودة وتنفيذ المنتجات
              أو الخدمات التي يعرضها. كما يتحمل التاجر مسؤولية التوصيل والاستلام
              والاسترداد وخدمة العملاء ما لم توافق داريك صراحة على خلاف ذلك
              كتابةً.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. الاستخدام المقبول</h2>
            <p>لا يجوز استخدام داريك من أجل:</p>
            <ul>
              <li>مخالفة القوانين المعمول بها أو انتهاك حقوق أي شخص آخر.</li>
              <li>رفع محتوى احتيالي أو مضلل أو مخالف للحقوق أو ضار أو غير آمن.</li>
              <li>محاولة الوصول غير المصرح به إلى تاجر أو مستخدم أو نظام أو حساب آخر.</li>
              <li>التدخل في أمان داريك أو توفر الخدمة أو التشغيل الطبيعي للمنصة.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>5. توفر المنصة والتغييرات</h2>
            <p>
              يجوز لداريك تحديث أو تحسين أو استبدال أو تعليق أو إيقاف بعض الميزات
              عندما يكون ذلك ضرورياً بشكل معقول للأمان أو الاعتمادية أو الامتثال
              القانوني أو تطوير المنتج. ونهدف إلى إبقاء الخدمة متاحة، ولكننا لا
              نضمن استمرارها دون انقطاع.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. الرسوم وخدمات التجار</h2>
            <p>
              قد تتطلب بعض خدمات داريك للتجار رسوماً للتفعيل أو الاشتراك أو رسوماً
              أخرى يتم توضيحها قبل الدفع. ويظل التاجر مسؤولاً عن الضرائب المطبقة
              ومعاملات العملاء والتكاليف المرتبطة بتشغيل نشاطه التجاري.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. التعليق والإنهاء</h2>
            <p>
              يجوز لداريك تقييد أو تعليق الوصول عندما يكون ذلك ضرورياً لحماية
              المستخدمين أو منع الاحتيال أو إساءة الاستخدام أو تطبيق هذه الشروط
              أو الامتثال للقانون. ويمكن للتاجر التوقف عن استخدام الخدمة والتواصل
              مع دعم داريك بشأن إغلاق الحساب أو طلبات البيانات.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. حدود المسؤولية</h2>
            <p>
              بالقدر الذي يسمح به القانون المعمول به، لا تتحمل داريك المسؤولية عن
              الخسائر الناتجة عن معلومات متجر غير دقيقة، أو منتجات غير قانونية،
              أو عدم تنفيذ الطلبات، أو إساءة استخدام بيانات الدخول، أو خدمات
              الأطراف الأخرى، أو الأحداث الخارجة عن السيطرة المعقولة لداريك.
            </p>
          </section>

          <section className={styles.card}>
            <h2>9. التواصل</h2>
            <p>
              يمكن إرسال الأسئلة المتعلقة بهذه الشروط إلى دعم داريك عبر واتساب
              على الرقم <strong>+962 79 300 9420</strong>.
            </p>
            <Link href="/support" className={styles.secondaryButton}>
              فتح صفحة الدعم
            </Link>
          </section>
        </section>

        <nav className={styles.footerLinks} aria-label="Legal links">
          <Link href="/privacy">Privacy / الخصوصية</Link>
          <Link href="/support">Support / الدعم</Link>
          <Link href="/">GetDarik.com</Link>
        </nav>
      </article>
    </main>
  );
}
