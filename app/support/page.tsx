"use client";

/* DARIK_PUBLIC_APP_LEGAL_320 */
/* DARIK_PUBLIC_APP_LEGAL_BILINGUAL_STACK_322 */

import Link from "next/link";
import styles from "../legal.module.css";

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
            <p className={styles.eyebrow}>DARIK SUPPORT</p>
            <h1>Support</h1>
            <p>
              Need help with the Darik Retailer App, your retailer account,
              storefront, products, orders, delivery settings, or account access?
              Contact Darik Support directly.
            </p>
          </div>

          <div className={styles.card}>
            <h2>WhatsApp support</h2>
            <p>
              Our primary support channel is WhatsApp. Include your store name and
              a short description of the issue so we can help faster.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.primaryButton}
            >
              Open WhatsApp Support
            </a>
            <p className={styles.contactLine}>+962 79 300 9420</p>
          </div>

          <div className={styles.card}>
            <h2>What we can help with</h2>
            <div className={styles.grid}>
              <div>
                <strong>Account access</strong>
                <span>Retailer login, staff access, and account questions.</span>
              </div>
              <div>
                <strong>Storefront & catalog</strong>
                <span>Products, categories, photos, availability, and store setup.</span>
              </div>
              <div>
                <strong>Orders</strong>
                <span>Order status, customer order details, and delivery workflow.</span>
              </div>
              <div>
                <strong>Privacy requests</strong>
                <span>Questions about your data or requests to delete account data.</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.languageDivider}>
          <span>العربية</span>
        </div>

        <section id="arabic" dir="rtl" className={styles.arabicSection}>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>دعم داريك</p>
            <h1>الدعم</h1>
            <p>
              إذا كنت بحاجة إلى مساعدة في تطبيق داريك للتجار، أو حساب المتجر،
              أو واجهة المتجر، أو المنتجات، أو الطلبات، أو إعدادات التوصيل،
              أو تسجيل الدخول، يمكنك التواصل مباشرة مع فريق دعم داريك.
            </p>
          </div>

          <div className={styles.card}>
            <h2>الدعم عبر واتساب</h2>
            <p>
              قناة الدعم الرئيسية لدينا هي واتساب. أرسل اسم متجرك ووصفاً مختصراً
              للمشكلة حتى نتمكن من مساعدتك بشكل أسرع.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.primaryButton}
            >
              فتح دعم واتساب
            </a>
            <p className={styles.contactLine}>+962 79 300 9420</p>
          </div>

          <div className={styles.card}>
            <h2>الأمور التي يمكننا مساعدتك بها</h2>
            <div className={styles.grid}>
              <div>
                <strong>الدخول إلى الحساب</strong>
                <span>تسجيل دخول التاجر، صلاحيات الموظفين، وأسئلة الحساب.</span>
              </div>
              <div>
                <strong>واجهة المتجر والمنتجات</strong>
                <span>المنتجات، الفئات، الصور، التوفر، وإعداد المتجر.</span>
              </div>
              <div>
                <strong>الطلبات</strong>
                <span>حالة الطلب، تفاصيل طلبات العملاء، وآلية التوصيل.</span>
              </div>
              <div>
                <strong>طلبات الخصوصية</strong>
                <span>الأسئلة المتعلقة ببياناتك أو طلب حذف بيانات الحساب.</span>
              </div>
            </div>
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
