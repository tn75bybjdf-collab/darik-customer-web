/* DARIK_PUBLIC_APP_LEGAL_320 */
/* DARIK_PUBLIC_APP_LEGAL_BILINGUAL_STACK_322 */
/* DARIK_APP_STORE_TERMS_HARDENING_325 */

import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Darik Terms of Service",
  description: "Terms of Service for Darik, GetDarik.com, and Darik Direct for Retailers.",
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
              These Terms govern use of Darik services, including GetDarik.com,
              Darik retailer storefronts, retailer dashboards, and Darik Direct for
              Retailers. By using a Darik service, the user agrees to these Terms and
              any additional terms disclosed for a specific service.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. Darik&apos;s role</h2>
            <p>
              Darik provides marketplace discovery, storefront software, order tools,
              retailer administration, and related technology. Unless Darik expressly
              agrees otherwise in writing, each retailer is an independent business and
              is the seller responsible for the physical products or services it lists,
              its customer relationship, fulfillment, delivery/pickup, returns, and
              legal obligations relating to those goods or services.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. Retailer accounts and authorized users</h2>
            <p>
              Retailer accounts are intended for lawful businesses and their authorized
              personnel. Retailer owners are responsible for protecting credentials,
              limiting access to authorized staff, reviewing staff permissions, and
              keeping account and business information accurate. Activity performed by
              an authorized account may be treated as activity of that retailer.
            </p>
            <p>
              Darik Direct for Retailers on iOS is a companion app for existing business
              accounts. Retailer-owner and new-staff login accounts are provisioned
              outside the iOS app. The iOS app may allow an authorized owner to update
              permissions or remove existing organization-managed staff access.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. Products, prices, orders, and fulfillment</h2>
            <p>
              Retailers are responsible for product descriptions, pricing of physical
              goods, availability, inventory, taxes, legality, quality, warranties,
              customer service, and fulfillment. Customer payment references or CliQ
              receipt records shown in the retailer app relate to customer purchases of
              physical goods and the retailer&apos;s order workflow.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. Darik business-service fees</h2>
            <p>
              Some Darik business services may require activation, subscription, or
              account-credit fees under separate commercial terms. Darik Direct for
              Retailers on iOS does not provide checkout for retailer subscriptions or
              AI-credit purchases and does not direct the user to an alternative payment
              method from inside the iOS app. The iOS app may display existing account
              status, expiration, or an existing AI-credit balance so authorized users
              can understand the business account they are already using.
            </p>
          </section>

          <section className={styles.card}>
            <h2>5. Optional AI product-photo enhancement</h2>
            <p>
              An authorized user may choose an optional AI tool to enhance a product
              photo. The user must review the in-app disclosure and affirmatively agree
              before the selected image is sent to xAI for that request. AI-generated
              output can contain errors. The retailer must review every enhanced image
              before using it and remains responsible for ensuring the published image
              accurately represents the physical product and does not violate third-party
              rights or applicable law.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. Acceptable use</h2>
            <p>You may not use Darik to:</p>
            <ul>
              <li>Violate applicable law, regulation, licensing requirements, or another person&apos;s rights.</li>
              <li>List or facilitate unlawful, counterfeit, stolen, fraudulent, misleading, infringing, malicious, dangerous, or prohibited goods/content.</li>
              <li>Upload content you do not have the right to use or disclose.</li>
              <li>Attempt unauthorized access to another retailer, customer, staff account, driver session, system, API, or data.</li>
              <li>Probe, bypass, disable, overload, scrape, reverse engineer where prohibited, or interfere with Darik security or normal platform operation.</li>
              <li>Use temporary Driver PIN access for any purpose other than the assigned delivery dispatch.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>7. Content and intellectual property</h2>
            <p>
              Retailers retain responsibility for the product information, images,
              videos, logos, trademarks, and other content they submit. By uploading
              content, the retailer confirms it has the rights needed for Darik to host,
              process, display, resize, and otherwise use that content to provide the
              requested service. Darik&apos;s software, branding, design, and platform
              materials remain protected by applicable intellectual-property laws.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. Privacy and data</h2>
            <p>
              Darik&apos;s handling of personal data is described in the Privacy Policy.
              Users must handle customer and staff information available through Darik
              only for legitimate business purposes and must not misuse, disclose, or
              export that information without authorization or a lawful basis.
            </p>
            <Link href="/privacy" className={styles.secondaryButton}>Read Privacy Policy</Link>
          </section>

          <section className={styles.card}>
            <h2>9. Third-party services</h2>
            <p>
              Darik may integrate with services such as mapping, notifications,
              infrastructure/storage, WhatsApp support, and optional AI processing.
              Third-party services may have their own terms and privacy practices. Darik
              is not responsible for a third party&apos;s independent service or outage,
              but Darik remains responsible for its own obligations under applicable law.
            </p>
          </section>

          <section className={styles.card}>
            <h2>10. Availability and updates</h2>
            <p>
              Darik may update, improve, replace, suspend, or discontinue features when
              reasonably necessary for security, reliability, compliance, or product
              development. We aim to keep production services available but cannot
              guarantee uninterrupted or error-free operation.
            </p>
          </section>

          <section className={styles.card}>
            <h2>11. Suspension and termination</h2>
            <p>
              Darik may restrict, suspend, or terminate access when reasonably necessary
              to protect users or the platform, address fraud or abuse, enforce these
              Terms, comply with law, respond to nonpayment under separate business
              terms, or prevent security harm. A retailer may stop using the service and
              contact Darik Support about account closure and data requests.
            </p>
          </section>

          <section className={styles.card}>
            <h2>12. Disclaimers and limitation of responsibility</h2>
            <p>
              To the extent permitted by applicable law, Darik provides the platform on
              an “as available” basis and does not guarantee that retailer listings,
              third-party services, maps, AI output, networks, or devices will always be
              accurate or uninterrupted. Darik is not responsible for losses caused by a
              retailer&apos;s unlawful or inaccurate listing, failure to fulfill a customer
              order, misuse of credentials, unauthorized staff activity, or events beyond
              Darik&apos;s reasonable control. Nothing in these Terms excludes liability
              that cannot lawfully be excluded.
            </p>
          </section>

          <section className={styles.card}>
            <h2>13. Changes to these Terms</h2>
            <p>
              Darik may update these Terms when the service or legal requirements change.
              The current effective date appears at the top of this page. Continued use
              after an updated version takes effect constitutes acceptance to the extent
              permitted by applicable law.
            </p>
          </section>

          <section className={styles.card}>
            <h2>14. Applicable law</h2>
            <p>
              These Terms are intended to operate under the applicable laws of the
              Hashemite Kingdom of Jordan, without limiting any mandatory rights or
              protections that applicable law does not permit the parties to waive.
            </p>
          </section>

          <section className={styles.card}>
            <h2>15. Contact</h2>
            <p>
              Questions about these Terms can be sent to Darik Support on WhatsApp at
              <strong> +962 79 300 9420</strong>.
            </p>
            <Link href="/support" className={styles.secondaryButton}>Open Support</Link>
          </section>
        </section>

        <div className={styles.languageDivider}><span>العربية</span></div>

        <section id="arabic" dir="rtl" className={styles.arabicSection}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>آخر تحديث: 26 أغسطس 2026</p>
            <h1>شروط الاستخدام</h1>
            <p>
              تنظم هذه الشروط استخدام خدمات داريك، بما في ذلك GetDarik.com وواجهات
              المتاجر ولوحات تحكم التجار وتطبيق Darik Direct for Retailers. باستخدام
              أي خدمة من داريك يوافق المستخدم على هذه الشروط وأي شروط إضافية يتم
              توضيحها لخدمة محددة.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. دور داريك</h2>
            <p>
              توفر داريك اكتشاف المتاجر وبرمجيات واجهات المتاجر وأدوات الطلبات
              وإدارة التاجر وتقنيات مرتبطة بذلك. ما لم توافق داريك كتابةً على خلاف
              ذلك، فإن كل متجر هو نشاط تجاري مستقل وهو البائع المسؤول عن السلع أو
              الخدمات المادية التي يعرضها وعن علاقته بالعميل والتنفيذ والتوصيل أو
              الاستلام والمرتجعات والالتزامات القانونية المتعلقة بتلك السلع أو الخدمات.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. حسابات التجار والمستخدمون المصرح لهم</h2>
            <p>
              حسابات التجار مخصصة للأعمال القانونية وموظفيها المصرح لهم. يتحمل مالك
              المتجر مسؤولية حماية بيانات الدخول وقصر الوصول على الموظفين المصرح لهم
              ومراجعة الصلاحيات والمحافظة على دقة معلومات الحساب والنشاط التجاري.
            </p>
            <p>
              تطبيق Darik Direct for Retailers على iOS هو تطبيق مرافق لحسابات أعمال
              موجودة مسبقاً. يتم إنشاء حسابات المالك وحسابات دخول الموظفين الجدد خارج
              تطبيق iOS، ويمكن للمالك المصرح له تعديل صلاحيات الموظفين الحاليين أو
              إزالة وصولهم من داخل التطبيق.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. المنتجات والأسعار والطلبات والتنفيذ</h2>
            <p>
              يتحمل التاجر مسؤولية أوصاف وأسعار السلع المادية والتوفر والمخزون
              والضرائب والقانونية والجودة والضمانات وخدمة العملاء والتنفيذ. مراجع
              الدفع أو سجلات إيصالات CliQ التي تظهر في تطبيق التاجر تتعلق بمشتريات
              العملاء من السلع المادية وبسير عمل طلبات المتجر.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. رسوم خدمات الأعمال في داريك</h2>
            <p>
              قد تتطلب بعض خدمات داريك التجارية رسوماً للتفعيل أو الاشتراك أو رصيد
              الحساب بموجب شروط تجارية منفصلة. لا يوفر تطبيق Darik Direct for
              Retailers على iOS عملية دفع لاشتراكات التجار أو شراء رصيد AI، ولا يوجه
              المستخدم من داخل تطبيق iOS إلى طريقة دفع بديلة. وقد يعرض التطبيق حالة
              الحساب الحالية أو تاريخ الانتهاء أو رصيد AI الموجود مسبقاً حتى يفهم
              المستخدم المصرح له حالة حساب الأعمال الذي يستخدمه.
            </p>
          </section>

          <section className={styles.card}>
            <h2>5. التحسين الاختياري لصور المنتجات بالذكاء الاصطناعي</h2>
            <p>
              يمكن للمستخدم المصرح له اختيار أداة AI لتحسين صورة المنتج. يجب على
              المستخدم مراجعة الإفصاح داخل التطبيق والموافقة صراحةً قبل إرسال الصورة
              المختارة إلى xAI لذلك الطلب. قد تحتوي النتائج المولدة على أخطاء، ويتحمل
              التاجر مسؤولية مراجعة كل صورة قبل نشرها والتأكد من أنها تمثل المنتج
              المادي بدقة ولا تنتهك حقوق الآخرين أو القانون.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. الاستخدام المقبول</h2>
            <p>لا يجوز استخدام داريك من أجل:</p>
            <ul>
              <li>مخالفة القانون أو اللوائح أو متطلبات الترخيص أو حقوق الآخرين.</li>
              <li>عرض أو تسهيل سلع أو محتوى غير قانوني أو مقلد أو مسروق أو احتيالي أو مضلل أو مخالف للحقوق أو ضار أو محظور.</li>
              <li>رفع محتوى لا تملك الحق في استخدامه أو مشاركته.</li>
              <li>محاولة الوصول غير المصرح به إلى تاجر أو عميل أو موظف أو جلسة سائق أو نظام أو API أو بيانات.</li>
              <li>فحص أو تجاوز أو تعطيل أو إغراق أو التدخل في أمان داريك أو التشغيل الطبيعي للمنصة.</li>
              <li>استخدام رمز السائق المؤقت لأي غرض غير الطلبات المخصصة لذلك التوصيل.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>7. المحتوى والملكية الفكرية</h2>
            <p>
              يبقى التاجر مسؤولاً عن معلومات المنتجات والصور والفيديوهات والشعارات
              والعلامات التجارية والمحتوى الذي يقدمه. برفع المحتوى يؤكد التاجر أنه
              يملك الحقوق اللازمة لكي تستضيف داريك المحتوى وتعالجه وتعرضه وتغير حجمه
              بالقدر اللازم لتقديم الخدمة. تبقى برمجيات داريك وعلامتها وتصميمها ومواد
              المنصة محمية بموجب قوانين الملكية الفكرية المعمول بها.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. الخصوصية والبيانات</h2>
            <p>
              توضح سياسة الخصوصية كيفية تعامل داريك مع البيانات الشخصية. يجب على
              المستخدم التعامل مع بيانات العملاء والموظفين المتاحة عبر داريك فقط
              لأغراض تجارية مشروعة وعدم إساءة استخدامها أو مشاركتها دون تصريح أو أساس قانوني.
            </p>
            <Link href="/privacy" className={styles.secondaryButton}>قراءة سياسة الخصوصية</Link>
          </section>

          <section className={styles.card}>
            <h2>9. خدمات الأطراف الأخرى</h2>
            <p>
              قد تتكامل داريك مع الخرائط والإشعارات والبنية التحتية والتخزين وواتساب
              للدعم ومعالجة AI الاختيارية. قد تكون لهذه الخدمات شروط وسياسات خصوصية
              خاصة بها. لا تتحمل داريك مسؤولية الخدمة المستقلة أو الانقطاع لدى طرف آخر،
              مع بقاء داريك مسؤولة عن التزاماتها الخاصة بموجب القانون.
            </p>
          </section>

          <section className={styles.card}>
            <h2>10. توفر الخدمة والتحديثات</h2>
            <p>
              يجوز لداريك تحديث أو تحسين أو استبدال أو تعليق أو إيقاف بعض الميزات
              عندما يكون ذلك ضرورياً بشكل معقول للأمان أو الاعتمادية أو الامتثال أو
              تطوير المنتج. نهدف إلى إبقاء الخدمات الإنتاجية متاحة لكن لا نضمن عملاً
              دون انقطاع أو أخطاء.
            </p>
          </section>

          <section className={styles.card}>
            <h2>11. التعليق والإنهاء</h2>
            <p>
              يجوز لداريك تقييد أو تعليق أو إنهاء الوصول عندما يكون ذلك ضرورياً
              بشكل معقول لحماية المستخدمين أو المنصة أو منع الاحتيال وإساءة الاستخدام
              أو تطبيق هذه الشروط أو الامتثال للقانون أو معالجة عدم الدفع بموجب شروط
              تجارية منفصلة أو منع ضرر أمني. ويمكن للتاجر التوقف عن استخدام الخدمة
              والتواصل مع الدعم بشأن إغلاق الحساب وطلبات البيانات.
            </p>
          </section>

          <section className={styles.card}>
            <h2>12. إخلاء المسؤولية وحدودها</h2>
            <p>
              بالقدر الذي يسمح به القانون، تقدم داريك المنصة بحسب توفرها ولا تضمن
              أن قوائم المتاجر أو خدمات الأطراف الأخرى أو الخرائط أو نتائج AI أو
              الشبكات أو الأجهزة ستكون دائماً دقيقة أو دون انقطاع. لا تتحمل داريك
              المسؤولية عن الخسائر الناتجة عن عرض غير قانوني أو غير دقيق من التاجر
              أو عدم تنفيذ طلب أو إساءة استخدام بيانات الدخول أو نشاط موظف غير مصرح
              به أو أحداث خارجة عن السيطرة المعقولة لداريك. ولا يستبعد أي نص في هذه
              الشروط مسؤولية لا يسمح القانون باستبعادها.
            </p>
          </section>

          <section className={styles.card}>
            <h2>13. التغييرات على الشروط</h2>
            <p>
              يجوز لداريك تحديث هذه الشروط عند تغير الخدمة أو المتطلبات القانونية.
              يظهر تاريخ النسخة الحالية في أعلى الصفحة، ويعد استمرار الاستخدام بعد
              سريان النسخة المحدثة قبولاً بها بالقدر الذي يسمح به القانون.
            </p>
          </section>

          <section className={styles.card}>
            <h2>14. القانون المعمول به</h2>
            <p>
              تهدف هذه الشروط إلى العمل وفق القوانين المعمول بها في المملكة الأردنية
              الهاشمية، دون الحد من أي حقوق أو حماية إلزامية لا يسمح القانون بالتنازل عنها.
            </p>
          </section>

          <section className={styles.card}>
            <h2>15. التواصل</h2>
            <p>
              يمكن إرسال الأسئلة المتعلقة بهذه الشروط إلى دعم داريك عبر واتساب على
              الرقم <strong>+962 79 300 9420</strong>.
            </p>
            <Link href="/support" className={styles.secondaryButton}>فتح صفحة الدعم</Link>
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
