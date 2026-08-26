/* DARIK_PUBLIC_APP_LEGAL_320 */
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
          <span className={styles.badge}>Terms / الشروط</span>
        </div>

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

        <nav className={styles.footerLinks} aria-label="Legal links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/support">Support</Link>
          <Link href="/">GetDarik.com</Link>
        </nav>
      </article>
    </main>
  );
}
