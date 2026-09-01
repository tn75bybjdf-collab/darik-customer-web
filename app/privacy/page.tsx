/* DARIK_PUBLIC_APP_LEGAL_320 */
/* DARIK_PUBLIC_APP_LEGAL_BILINGUAL_STACK_322 */
/* DARIK_APPLE_PRIVACY_XAI_DISCLOSURE_325 */

import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Darik Privacy Policy",
  description: "Privacy policy for Darik, GetDarik.com, and the Darik Direct for Retailers app.",
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
              This Privacy Policy explains how Darik handles information across
              GetDarik.com, Darik retailer storefronts, retailer dashboards, and
              Darik Direct for Retailers. Darik provides marketplace and business
              software that connects customers with independent retailers.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. Information we process</h2>
            <p>Depending on the service and how it is used, Darik may process:</p>
            <ul>
              <li><strong>Retailer and staff account data:</strong> name, email address, username, role, user ID, retailer ID, authentication/session information, and organization permissions.</li>
              <li><strong>Business and storefront data:</strong> store name, business contact details, storefront settings, categories, products, prices for physical goods, inventory, delivery settings, and other information entered by the retailer.</li>
              <li><strong>Product media and user content:</strong> product photos, supported short product videos, descriptions, colors, sizes, fitment details, and other catalog content uploaded or created by an authorized business user.</li>
              <li><strong>Customer and order data:</strong> customer name, phone or other contact information, delivery address or delivery coordinates, ordered products, order status, fulfillment information, and payment-method or payment-confirmation records required to fulfill purchases of physical goods.</li>
              <li><strong>Device and app data:</strong> app platform/version, an app-generated device identifier, push-notification token, and related operational identifiers used to keep sessions and order alerts working.</li>
              <li><strong>Location information:</strong> on customer-facing web services, a customer may choose browser location or search for an address so Darik can determine which retailers can deliver there. The retailer iOS app does not request the retailer device&apos;s precise location for its core functions. Existing order coordinates may be displayed to authorized users and opened in a maps application for delivery.</li>
              <li><strong>Payment proof and business records:</strong> where applicable outside the iOS retailer-app purchase flow, Darik may retain retailer-submitted payment references or receipt images used to verify business-service activation or account credits. Customer CliQ receipt records for physical-goods orders may also be displayed to authorized retailer users.</li>
              <li><strong>Support communications:</strong> messages, store/account identifiers, attachments, and other information a user chooses to send to Darik Support.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>2. How information is collected</h2>
            <ul>
              <li>Directly from customers, retailers, staff, or drivers when they enter information, upload content, place or manage an order, or contact support.</li>
              <li>From the device when an optional app permission is granted or when the app creates operational identifiers needed for authentication or notifications.</li>
              <li>From Darik&apos;s servers when an authorized user signs in and retrieves store, catalog, order, staff, or delivery information already associated with the account.</li>
              <li>From service providers used to authenticate users, host the service, store files, deliver notifications, provide mapping/address tools, or perform an explicitly requested AI image enhancement.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>3. How we use information</h2>
            <ul>
              <li>Authenticate users, maintain sessions, enforce roles and permissions, and protect accounts.</li>
              <li>Operate retailer storefronts, catalog tools, physical-goods orders, fulfillment, pickup, and delivery workflows.</li>
              <li>Determine whether a customer address falls inside a retailer&apos;s configured delivery area.</li>
              <li>Send operational notifications such as new-order alerts when notification permission is granted.</li>
              <li>Provide support, investigate errors, prevent fraud or abuse, secure the service, and maintain reliability.</li>
              <li>Process an AI image-enhancement request only after the authorized user affirmatively chooses that feature and gives the disclosure/consent described below.</li>
              <li>Maintain records reasonably necessary for business operations, dispute resolution, security, fraud prevention, and legal obligations.</li>
            </ul>
          </section>

          <section id="ai-processing" className={styles.card}>
            <h2>4. AI image processing and explicit consent</h2>
            <p>
              Darik offers an optional product-photo enhancement feature. The current
              service uses <strong>xAI&apos;s image service</strong> as the third-party AI
              processor. The feature is not automatic.
            </p>
            <p>
              Before a selected product image is sent to xAI, the app identifies xAI,
              explains that the selected image will be transferred for image
              enhancement, and requires an affirmative user action for that request.
              Darik sends the selected product image and an image-enhancement prompt to
              xAI only to generate the requested enhanced product image. Users should
              not submit photos containing personal or sensitive information.
            </p>
            <p>
              Darik creates a temporary square processing copy before the xAI request.
              The temporary processing copy is deleted after the xAI request completes. The
              original retailer product image and any enhanced image the retailer keeps
              may remain in Darik storage as part of the retailer&apos;s catalog until
              removed or otherwise deleted under Darik&apos;s retention practices.
            </p>
          </section>

          <section className={styles.card}>
            <h2>5. Service providers and data sharing</h2>
            <p>
              Darik does not sell personal information to advertisers and does not use
              the retailer app for cross-app tracking or third-party targeted advertising.
              Darik shares information only when needed to operate the service, fulfill
              a user request, protect the platform, comply with law, or complete a
              business transaction such as a merger or acquisition subject to applicable law.
            </p>
            <p>Current service-provider categories include:</p>
            <ul>
              <li><strong>Supabase</strong> for authentication, database services, and file storage.</li>
              <li><strong>Vercel</strong> for GetDarik.com and Darik server/API hosting.</li>
              <li><strong>Expo and Apple Push Notification service</strong> for mobile application delivery and operational push notifications.</li>
              <li><strong>Google Maps / Google Places</strong> when a user chooses mapping, address search, or navigation features.</li>
              <li><strong>xAI</strong> only for an AI product-image enhancement that the user explicitly requests.</li>
              <li><strong>WhatsApp</strong> when a user chooses to open Darik&apos;s WhatsApp support channel; WhatsApp then handles that communication under its own terms and privacy practices.</li>
            </ul>
            <p>
              Darik requires third parties and service providers that receive personal data on Darik&apos;s
              behalf to provide the same or an equivalent level of protection for that data
              as described in this Policy and required by applicable law, consistent with the
              service they provide. Some providers may process information in countries outside Jordan.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. Device permissions</h2>
            <ul>
              <li><strong>Camera:</strong> requested when a retailer chooses to take a product photo or record a supported silent product video.</li>
              <li><strong>Photo library:</strong> requested when a retailer chooses product media from the device.</li>
              <li><strong>Notifications:</strong> requested so the retailer can receive operational alerts such as new orders. Core account access does not require notification permission.</li>
              <li><strong>Precise device location:</strong> not requested by the retailer iOS app for its core retailer functions.</li>
            </ul>
            <p>
              Optional permissions can be changed later in the device&apos;s system settings.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. Authentication and local device storage</h2>
            <p>
              Darik uses authenticated sessions to keep authorized business users signed
              in. If a user chooses “Keep me signed in,” the app may retain the username
              or email and session-related information on the device. The iOS app does
              not persist the user&apos;s password for autofill as part of Darik&apos;s own
              Remember Me storage.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. Data retention and deletion</h2>
            <p>
              Darik retains information only for as long as reasonably necessary for the
              purposes described in this Policy, including operating the service,
              maintaining retailer/customer transaction records, protecting accounts,
              resolving disputes, preventing fraud, and meeting legal or accounting
              obligations. Different records can require different retention periods.
            </p>
            <p>
              Retailer owner accounts for Darik Direct for Retailers are provisioned
              outside the iOS app. The iOS app does not provide owner or new-staff account
              creation. Authorized owners can remove existing organization-managed staff
              access from the Users area. A retailer or customer may also contact Darik
              Support to request access, correction, closure, or deletion of information
              where applicable. Darik may retain specific records when required by law or
              reasonably necessary for security, fraud prevention, financial records, or
              dispute resolution.
            </p>
          </section>

          <section className={styles.card}>
            <h2>9. Security</h2>
            <p>
              Darik uses administrative and technical safeguards designed to protect
              account, business, customer, and order information, including authenticated
              access controls and role-based permissions. No internet service can
              guarantee absolute security. Users should protect their devices and account
              credentials and should promptly report suspected unauthorized access.
            </p>
          </section>

          <section className={styles.card}>
            <h2>10. Your choices and privacy requests</h2>
            <ul>
              <li>Choose whether to grant optional camera, photo-library, and notification permissions.</li>
              <li>Do not use the AI enhancement feature if you do not want the selected image sent to xAI.</li>
              <li>Ask Darik Support to review or correct account information where applicable.</li>
              <li>Request account/data deletion or closure where applicable, subject to records Darik must or is permitted to retain.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>11. Children</h2>
            <p>
              Darik Direct for Retailers is a business application intended for
              authorized retailer personnel and delivery users, not for children.
            </p>
          </section>

          <section className={styles.card}>
            <h2>12. Changes to this Policy</h2>
            <p>
              Darik may update this Policy when the service, providers, legal
              requirements, or data practices change. The current effective date appears
              at the top of this page. Material changes will be reflected in the
              published Policy before or when they take effect as appropriate.
            </p>
          </section>

          <section className={styles.card}>
            <h2>13. Contact Darik</h2>
            <p>
              Privacy, access, correction, and deletion requests can be sent to Darik
              Support on WhatsApp at <strong>+962 79 300 9420</strong>. Include the store
              name or account identifier needed to locate the correct account, but do not
              send passwords or unnecessary sensitive information.
            </p>
            <Link href="/support" className={styles.secondaryButton}>Open Support</Link>
          </section>
        </section>

        <div className={styles.languageDivider}><span>العربية</span></div>

        <section id="arabic" dir="rtl" className={styles.arabicSection}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>آخر تحديث: 26 أغسطس 2026</p>
            <h1>سياسة الخصوصية</h1>
            <p>
              توضح هذه السياسة كيفية تعامل داريك مع المعلومات عبر GetDarik.com
              وواجهات متاجر داريك ولوحات تحكم التجار وتطبيق Darik Direct for Retailers.
              توفر داريك منصة وأدوات أعمال تربط العملاء بمتاجر مستقلة.
            </p>
          </header>

          <section className={styles.card}>
            <h2>1. المعلومات التي نقوم بمعالجتها</h2>
            <p>بحسب الخدمة وطريقة استخدامها، قد تقوم داريك بمعالجة ما يلي:</p>
            <ul>
              <li><strong>بيانات حساب التاجر والموظفين:</strong> الاسم، البريد الإلكتروني، اسم المستخدم، الدور، معرف المستخدم، معرف التاجر، معلومات المصادقة والجلسة، وصلاحيات المؤسسة.</li>
              <li><strong>بيانات النشاط التجاري وواجهة المتجر:</strong> اسم المتجر، معلومات التواصل التجارية، إعدادات المتجر، الفئات، المنتجات، أسعار السلع المادية، المخزون، وإعدادات التوصيل.</li>
              <li><strong>وسائط المنتجات والمحتوى:</strong> صور المنتجات، مقاطع الفيديو القصيرة المدعومة، الأوصاف، الألوان، المقاسات، معلومات التوافق، وغيرها من بيانات الكتالوج.</li>
              <li><strong>بيانات العميل والطلب:</strong> اسم العميل، رقم الهاتف أو معلومات التواصل، عنوان أو إحداثيات التوصيل، المنتجات المطلوبة، حالة الطلب، معلومات التنفيذ، وسجلات طريقة الدفع أو تأكيد الدفع اللازمة لتنفيذ مشتريات السلع المادية.</li>
              <li><strong>بيانات الجهاز والتطبيق:</strong> نوع المنصة وإصدار التطبيق، معرف جهاز ينشئه التطبيق، رمز إشعارات الدفع، ومعرفات تشغيلية مرتبطة بعمل الجلسات والإشعارات.</li>
              <li><strong>الموقع:</strong> في خدمات العملاء على الويب يمكن للعميل اختيار مشاركة موقع المتصفح أو البحث عن عنوان لمعرفة المتاجر التي تصل إليه. تطبيق التاجر على iOS لا يطلب الموقع الدقيق لجهاز التاجر لوظائفه الأساسية. ويمكن عرض إحداثيات طلب موجودة مسبقاً للمستخدم المصرح له وفتحها في تطبيق خرائط لأغراض التوصيل.</li>
              <li><strong>إثباتات الدفع والسجلات التجارية:</strong> عند الحاجة خارج مسار الشراء داخل تطبيق iOS، قد تحتفظ داريك بمراجع دفع أو صور إيصالات يقدمها التاجر للتحقق من تفعيل خدمة تجارية أو رصيد حساب. وقد تظهر أيضاً سجلات إيصالات CliQ الخاصة بطلبات السلع المادية للمستخدمين المصرح لهم.</li>
              <li><strong>مراسلات الدعم:</strong> الرسائل ومعرفات المتجر أو الحساب والمرفقات وأي معلومات يختار المستخدم إرسالها إلى دعم داريك.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>2. كيفية جمع المعلومات</h2>
            <ul>
              <li>مباشرة من العميل أو التاجر أو الموظف أو السائق عندما يقوم بإدخال البيانات أو رفع المحتوى أو تنفيذ أو إدارة طلب أو التواصل مع الدعم.</li>
              <li>من الجهاز عند منح إذن اختياري أو عندما ينشئ التطبيق معرفاً تشغيلياً ضرورياً للمصادقة أو الإشعارات.</li>
              <li>من خوادم داريك عندما يسجل المستخدم المصرح له الدخول ويسترجع بيانات المتجر أو الكتالوج أو الطلبات أو الموظفين أو التوصيل المرتبطة مسبقاً بالحساب.</li>
              <li>من مزودي الخدمات المستخدمين للمصادقة والاستضافة والتخزين والإشعارات والخرائط والبحث عن العناوين أو تنفيذ طلب تحسين صورة بالذكاء الاصطناعي يختاره المستخدم صراحةً.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>3. كيفية استخدام المعلومات</h2>
            <ul>
              <li>التحقق من هوية المستخدمين، المحافظة على الجلسات، تطبيق الصلاحيات، وحماية الحسابات.</li>
              <li>تشغيل واجهات المتاجر والكتالوج وطلبات السلع المادية والاستلام والتوصيل.</li>
              <li>تحديد ما إذا كان عنوان العميل يقع ضمن نطاق توصيل المتجر.</li>
              <li>إرسال إشعارات تشغيلية مثل إشعارات الطلبات الجديدة عند منح إذن الإشعارات.</li>
              <li>تقديم الدعم، التحقيق في الأخطاء، منع الاحتيال وإساءة الاستخدام، وتأمين الخدمة.</li>
              <li>معالجة طلب تحسين صورة بالذكاء الاصطناعي فقط بعد اختيار المستخدم المصرح له لهذه الميزة وموافقته الصريحة كما هو موضح أدناه.</li>
              <li>الاحتفاظ بسجلات لازمة بشكل معقول للتشغيل وتسوية النزاعات والأمان ومنع الاحتيال والالتزامات القانونية.</li>
            </ul>
          </section>

          <section id="ai-processing-ar" className={styles.card}>
            <h2>4. معالجة الصور بالذكاء الاصطناعي والموافقة الصريحة</h2>
            <p>
              توفر داريك ميزة اختيارية لتحسين صورة المنتج. تستخدم الخدمة الحالية
              <strong> خدمة الصور التابعة لـ xAI</strong> كمزود ذكاء اصطناعي خارجي.
              ولا تعمل الميزة تلقائياً.
            </p>
            <p>
              قبل إرسال صورة المنتج المختارة إلى xAI، يوضح التطبيق اسم xAI وأن
              الصورة ستُرسل لإجراء التحسين ويطلب من المستخدم إجراءً صريحاً للموافقة
              على ذلك الطلب. ترسل داريك الصورة المختارة وتعليمات تحسين الصورة إلى
              xAI فقط لإنشاء النسخة المحسّنة المطلوبة. يجب عدم إرسال صور تحتوي على
              معلومات شخصية أو حساسة.
            </p>
            <p>
              تنشئ داريك نسخة مربعة مؤقتة للمعالجة قبل إرسال الطلب إلى xAI ويتم
              حذف هذه النسخة المؤقتة بعد اكتمال طلب xAI. وقد تبقى صورة المنتج الأصلية
              وأي نسخة محسّنة يحتفظ بها التاجر في تخزين داريك كجزء من الكتالوج إلى
              أن تتم إزالتها أو حذفها وفق ممارسات الاحتفاظ لدى داريك.
            </p>
          </section>

          <section className={styles.card}>
            <h2>5. مزودو الخدمة ومشاركة البيانات</h2>
            <p>
              لا تبيع داريك المعلومات الشخصية للمعلنين ولا تستخدم تطبيق التاجر
              للتتبع عبر التطبيقات أو للإعلانات الموجهة من أطراف أخرى. تتم مشاركة
              المعلومات فقط بالقدر اللازم لتشغيل الخدمة أو تنفيذ طلب المستخدم أو
              حماية المنصة أو الامتثال للقانون أو إتمام معاملة تجارية مشروعة وفق القانون.
            </p>
            <ul>
              <li><strong>Supabase:</strong> للمصادقة وقواعد البيانات وتخزين الملفات.</li>
              <li><strong>Vercel:</strong> لاستضافة GetDarik.com وخوادم وواجهات API التابعة لداريك.</li>
              <li><strong>Expo وخدمة Apple Push Notification:</strong> لتشغيل تطبيق الهاتف وإرسال الإشعارات التشغيلية.</li>
              <li><strong>Google Maps / Google Places:</strong> عندما يختار المستخدم ميزات الخرائط أو البحث عن عنوان أو التنقل.</li>
              <li><strong>xAI:</strong> فقط عندما يطلب المستخدم صراحةً تحسين صورة منتج بالذكاء الاصطناعي.</li>
              <li><strong>WhatsApp:</strong> عندما يختار المستخدم فتح قناة دعم داريك عبر واتساب، وعندها تخضع المحادثة أيضاً لشروط وسياسة خصوصية واتساب.</li>
            </ul>
            <p>
              تطلب داريك من الأطراف الأخرى ومزودي الخدمات الذين يستلمون بيانات شخصية بالنيابة عنها
              توفير مستوى الحماية نفسه أو مستوى حماية مكافئاً لما هو موضح في هذه السياسة
              وما يقتضيه القانون المعمول به، وبما يتوافق مع الخدمة التي يقدمونها. وقد تتم
              معالجة بعض البيانات خارج الأردن.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. أذونات الجهاز</h2>
            <ul>
              <li><strong>الكاميرا:</strong> عند اختيار التاجر التقاط صورة منتج أو تسجيل فيديو منتج صامت ومدعوم.</li>
              <li><strong>مكتبة الصور:</strong> عند اختيار التاجر وسائط منتج من الجهاز.</li>
              <li><strong>الإشعارات:</strong> لإرسال تنبيهات تشغيلية مثل الطلبات الجديدة عند منح الإذن. لا يتطلب الدخول الأساسي للحساب الموافقة على الإشعارات.</li>
              <li><strong>الموقع الدقيق للجهاز:</strong> لا يطلبه تطبيق التاجر على iOS لوظائف التاجر الأساسية.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>7. المصادقة والتخزين المحلي</h2>
            <p>
              تستخدم داريك جلسات مصادق عليها للمحافظة على دخول مستخدمي النشاط
              التجاري المصرح لهم. عند اختيار “ابقني مسجلاً” قد يحتفظ التطبيق باسم
              المستخدم أو البريد الإلكتروني ومعلومات مرتبطة بالجلسة على الجهاز.
              تطبيق iOS لا يحفظ كلمة مرور المستخدم ضمن تخزين “تذكرني” الخاص بداريك.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. الاحتفاظ بالبيانات وحذفها</h2>
            <p>
              تحتفظ داريك بالمعلومات فقط للمدة المعقولة اللازمة للأغراض الموضحة في
              هذه السياسة، ومنها تشغيل الخدمة، حفظ سجلات معاملات التاجر والعميل،
              حماية الحسابات، حل النزاعات، منع الاحتيال، والالتزامات القانونية أو
              المحاسبية. وقد تختلف مدة الاحتفاظ باختلاف نوع السجل.
            </p>
            <p>
              يتم إنشاء حسابات مالكي المتاجر لتطبيق Darik Direct for Retailers خارج
              تطبيق iOS. ولا يتيح تطبيق iOS إنشاء حساب مالك أو حساب موظف جديد. ويمكن
              للمالك المصرح له إزالة وصول الموظفين الحاليين التابعين للمؤسسة من قسم
              المستخدمين. كما يمكن للتاجر أو العميل التواصل مع دعم داريك لطلب الوصول
              إلى البيانات أو تصحيحها أو إغلاقها أو حذفها عندما يكون ذلك متاحاً، مع
              إمكانية احتفاظ داريك بسجلات محددة عندما يفرض القانون ذلك أو تكون لازمة
              بشكل معقول للأمان أو منع الاحتيال أو السجلات المالية أو حل النزاعات.
            </p>
          </section>

          <section className={styles.card}>
            <h2>9. الأمان</h2>
            <p>
              تستخدم داريك ضوابط إدارية وتقنية تهدف إلى حماية معلومات الحساب
              والنشاط التجاري والعملاء والطلبات، بما في ذلك المصادقة والصلاحيات حسب
              الدور. لا يمكن لأي خدمة عبر الإنترنت ضمان الأمان المطلق، لذلك يجب على
              المستخدم حماية جهازه وبيانات الدخول والإبلاغ عن أي وصول غير مصرح به.
            </p>
          </section>

          <section className={styles.card}>
            <h2>10. خياراتك وطلبات الخصوصية</h2>
            <ul>
              <li>اختيار منح أو رفض أذونات الكاميرا ومكتبة الصور والإشعارات.</li>
              <li>عدم استخدام ميزة تحسين AI إذا كنت لا تريد إرسال الصورة المختارة إلى xAI.</li>
              <li>طلب مراجعة أو تصحيح معلومات الحساب من دعم داريك عندما يكون ذلك متاحاً.</li>
              <li>طلب إغلاق الحساب أو حذف البيانات عندما يكون ذلك متاحاً، مع مراعاة السجلات التي يجب أو يجوز لداريك الاحتفاظ بها.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>11. الأطفال</h2>
            <p>
              تطبيق Darik Direct for Retailers هو تطبيق أعمال مخصص لموظفي المتاجر
              والمستخدمين المصرح لهم بالتوصيل، وليس موجهاً للأطفال.
            </p>
          </section>

          <section className={styles.card}>
            <h2>12. التغييرات على السياسة</h2>
            <p>
              قد تقوم داريك بتحديث هذه السياسة عند تغير الخدمة أو مزودي الخدمات أو
              المتطلبات القانونية أو ممارسات البيانات. يظهر تاريخ النسخة الحالية
              في أعلى الصفحة.
            </p>
          </section>

          <section className={styles.card}>
            <h2>13. التواصل مع داريك</h2>
            <p>
              يمكن إرسال طلبات الخصوصية أو الوصول أو التصحيح أو الحذف إلى دعم داريك
              عبر واتساب على الرقم <strong>+962 79 300 9420</strong>. أرسل اسم المتجر
              أو معرف الحساب اللازم لتحديد الحساب الصحيح، ولا ترسل كلمات المرور أو
              معلومات حساسة غير ضرورية.
            </p>
            <Link href="/support" className={styles.secondaryButton}>فتح صفحة الدعم</Link>
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
