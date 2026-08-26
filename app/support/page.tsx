/* DARIK_PUBLIC_APP_LEGAL_320 */
"use client";

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
          <span className={styles.badge}>Support / الدعم</span>
        </div>

        <div className={styles.hero}>
          <p className={styles.eyebrow}>DARIK SUPPORT</p>
          <h1>Support / الدعم</h1>
          <p>
            Need help with the Darik Retailer App, your retailer account,
            storefront, products, orders, delivery settings, or account access?
            Contact Darik Support directly.
          </p>
          <p dir="rtl" className={styles.arabic}>
            إذا كنت بحاجة للمساعدة في تطبيق داريك للتجار، حساب المتجر،
            المنتجات، الطلبات، إعدادات التوصيل أو تسجيل الدخول، تواصل مباشرة
            مع دعم داريك.
          </p>
        </div>

        <div className={styles.card}>
          <h2>WhatsApp support / دعم واتساب</h2>
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

        <nav className={styles.footerLinks} aria-label="Legal links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/">GetDarik.com</Link>
        </nav>
      </section>
    </main>
  );
}
