/* DARIK_PUBLIC_APP_LEGAL_320 */
/* DARIK_PUBLIC_APP_LEGAL_BILINGUAL_STACK_322 */
/* DARIK_APP_STORE_SUPPORT_HARDENING_325 */

import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Darik Support",
  description: "Official support for GetDarik.com and Darik Direct for Retailers.",
};

const SUPPORT_PHONE = "+962 79 300 9420";
const SUPPORT_PHONE_HREF = "tel:+962793009420";
const SUPPORT_EMAIL = "jjasaleh14@aol.com";
const SUPPORT_EMAIL_HREF = "mailto:jjasaleh14@aol.com";
const WHATSAPP_URL =
  "https://wa.me/962793009420?text=" +
  encodeURIComponent("Hello Darik Support / مرحباً دعم داريك");

export default function DarikSupportPage() {
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand}>Darik</Link>
          <span className={styles.badge}>Support</span>
        </div>

        <section id="english">
          <div className={styles.hero}>
            <p className={styles.eyebrow}>DARIK SUPPORT — JORDAN</p>
            <h1>Support</h1>
            <p>
              This is the official support page for GetDarik.com and Darik Direct for
              Retailers. Support covers retailer access, storefronts, products, orders,
              staff permissions, delivery/driver workflows, privacy requests, and
              technical problems with the service.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Contact Darik Support</h2>
            <p>
              Contact Darik Support by WhatsApp, phone, or email. Include your store
              name, the username/email used for the retailer account, and a short
              description of the issue. Never send your password.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={styles.primaryButton}>
              Open WhatsApp Support
            </a>
            <p className={styles.contactLine}>
              Call: <a href={SUPPORT_PHONE_HREF}>{SUPPORT_PHONE}</a>
            </p>
            <p className={styles.contactLine}>
              Email: <a href={SUPPORT_EMAIL_HREF}>{SUPPORT_EMAIL}</a>
            </p>
          </div>

          <div className={styles.card}>
            <h2>Before contacting support</h2>
            <ul>
              <li>For login issues, include the store name and username/email, but not the password.</li>
              <li>For an order issue, include the Darik order identifier and store name.</li>
              <li>For a product/media issue, include the product name and a screenshot if useful.</li>
              <li>For notification issues, confirm iPhone notifications are enabled for Darik Direct.</li>
              <li>For a privacy or deletion request, clearly state that the message is a privacy request and identify the relevant account/store.</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h2>What we can help with</h2>
            <div className={styles.grid}>
              <div><strong>Account access</strong><span>Retailer login, existing staff access, permissions, and account status.</span></div>
              <div><strong>Storefront & catalog</strong><span>Products, categories, product media, availability, and storefront setup.</span></div>
              <div><strong>Orders & delivery</strong><span>Order status, physical-goods payment records, dispatch, and temporary Driver PIN access.</span></div>
              <div><strong>AI product photos</strong><span>Questions about optional AI enhancement, AI credits already available to the account, or image-processing errors.</span></div>
              <div><strong>Privacy requests</strong><span>Access, correction, closure, and deletion requests where applicable.</span></div>
              <div><strong>Technical problems</strong><span>App errors, media uploads, notification problems, and other production issues.</span></div>
            </div>
          </div>

          <div className={styles.card}>
            <h2>iOS retailer-app account model</h2>
            <p>
              Darik Direct for Retailers is a companion app for existing Darik business
              accounts. The iOS app does not create retailer-owner accounts or new staff
              login accounts and does not offer retailer subscription or AI-credit
              purchase checkout. Existing authorized staff can be managed or removed by
              an authorized owner.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Security</h2>
            <p>
              Darik Support will not ask you to send your password. If you believe an
              account or device is compromised, contact support promptly and stop using
              any credentials you believe have been exposed.
            </p>
          </div>
        </section>

        <div className={styles.languageDivider}><span>العربية</span></div>

        <section id="arabic" dir="rtl" className={styles.arabicSection}>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>دعم داريك — الأردن</p>
            <h1>الدعم</h1>
            <p>
              هذه هي صفحة الدعم الرسمية لـ GetDarik.com وتطبيق Darik Direct for
              Retailers. يشمل الدعم الدخول لحساب التاجر وواجهة المتجر والمنتجات
              والطلبات وصلاحيات الموظفين والتوصيل والسائقين وطلبات الخصوصية والمشاكل التقنية.
            </p>
          </div>

          <div className={styles.card}>
            <h2>التواصل مع دعم داريك</h2>
            <p>
              تواصل مع دعم داريك عبر واتساب أو الاتصال الهاتفي أو البريد الإلكتروني.
              أرسل اسم المتجر واسم المستخدم أو البريد الإلكتروني ووصفاً مختصراً للمشكلة.
              لا ترسل كلمة المرور.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={styles.primaryButton}>
              فتح دعم واتساب
            </a>
            <p className={styles.contactLine}>
              اتصال: <a href={SUPPORT_PHONE_HREF}>{SUPPORT_PHONE}</a>
            </p>
            <p className={styles.contactLine}>
              البريد الإلكتروني: <a href={SUPPORT_EMAIL_HREF}>{SUPPORT_EMAIL}</a>
            </p>
          </div>

          <div className={styles.card}>
            <h2>قبل التواصل مع الدعم</h2>
            <ul>
              <li>لمشاكل الدخول أرسل اسم المتجر واسم المستخدم أو البريد الإلكتروني فقط، ولا ترسل كلمة المرور.</li>
              <li>لمشكلة متعلقة بطلب أرسل رقم الطلب واسم المتجر.</li>
              <li>لمشكلة منتج أو وسائط أرسل اسم المنتج ولقطة شاشة عند الحاجة.</li>
              <li>لمشاكل الإشعارات تأكد من السماح بإشعارات Darik Direct على iPhone.</li>
              <li>لطلب خصوصية أو حذف بيانات اذكر بوضوح أنه طلب خصوصية وحدد الحساب أو المتجر المعني.</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h2>الأمور التي يمكننا مساعدتك بها</h2>
            <div className={styles.grid}>
              <div><strong>الدخول للحساب</strong><span>دخول التاجر، وصول الموظفين الحاليين، الصلاحيات، وحالة الحساب.</span></div>
              <div><strong>واجهة المتجر والكتالوج</strong><span>المنتجات والفئات ووسائط المنتجات والتوفر وإعداد المتجر.</span></div>
              <div><strong>الطلبات والتوصيل</strong><span>حالة الطلب وسجلات دفع السلع المادية والتوزيع ورمز السائق المؤقت.</span></div>
              <div><strong>صور المنتجات بالذكاء الاصطناعي</strong><span>الاستفسارات عن التحسين الاختياري أو الرصيد الموجود بالحساب أو أخطاء المعالجة.</span></div>
              <div><strong>طلبات الخصوصية</strong><span>طلبات الوصول والتصحيح والإغلاق والحذف عندما يكون ذلك متاحاً.</span></div>
              <div><strong>المشاكل التقنية</strong><span>أخطاء التطبيق ورفع الوسائط ومشاكل الإشعارات وغيرها من مشاكل التشغيل.</span></div>
            </div>
          </div>

          <div className={styles.card}>
            <h2>نموذج الحساب في تطبيق iOS</h2>
            <p>
              تطبيق Darik Direct for Retailers هو تطبيق مرافق لحسابات أعمال داريك
              الموجودة مسبقاً. لا ينشئ تطبيق iOS حسابات ملاك متاجر أو حسابات دخول
              موظفين جدد ولا يتيح دفع اشتراك التاجر أو شراء رصيد AI من داخل التطبيق.
              ويمكن للمالك المصرح له إدارة أو إزالة الموظفين الحاليين.
            </p>
          </div>

          <div className={styles.card}>
            <h2>الأمان</h2>
            <p>
              لن يطلب منك دعم داريك إرسال كلمة المرور. إذا كنت تعتقد أن الحساب أو
              الجهاز تعرض للاختراق، تواصل مع الدعم بسرعة وتوقف عن استخدام أي بيانات
              دخول تعتقد أنها انكشفت.
            </p>
          </div>
        </section>

        <nav className={styles.footerLinks} aria-label="Legal links">
          <Link href="/privacy">Privacy / الخصوصية</Link>
          <Link href="/terms">Terms / الشروط</Link>
          <Link href="/">GetDarik.com</Link>
        </nav>
      </section>
    </main>
  );
}
