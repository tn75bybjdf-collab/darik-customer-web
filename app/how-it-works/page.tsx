import Link from "next/link";
import styles from "./how-it-works-approved-394.module.css";

type IconName =
  | "pin"
  | "truck"
  | "store"
  | "search"
  | "signpost"
  | "bars"
  | "link"
  | "people"
  | "chart"
  | "heart"
  | "bag"
  | "menu"
  | "star";

function Icon({ name, className }: { name: IconName; className?: string }) {
  switch (name) {
    case "pin":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="currentColor"/><circle cx="12" cy="10" r="2.8" fill="white"/></svg>;
    case "truck":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M3 6h10v8H3zM13 9h4l3 3v2h-7z" fill="currentColor"/><circle cx="8" cy="17.5" r="2" fill="currentColor"/><circle cx="18" cy="17.5" r="2" fill="currentColor"/></svg>;
    case "store":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M4 10h16l-1.2 9H5.2L4 10Z" fill="currentColor"/><path d="M6 5h12l2 4H4l2-4Zm4 6v8m4-8v8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case "search":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
    case "signpost":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M12 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 6h7l-2.4 3L19 12h-7V6Zm0 6H5l2.4 3L5 18h7v-6Z" fill="currentColor"/></svg>;
    case "bars":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M5 19h3V9H5v10Zm5 0h3V5h-3v14Zm5 0h3v-7h-3v7Z" fill="currentColor"/></svg>;
    case "link":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M10 14 8 16a3.5 3.5 0 1 1-5-5l3-3a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M14 10l2-2a3.5 3.5 0 1 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="m9 15 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
    case "people":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><circle cx="9" cy="9" r="3" fill="currentColor"/><circle cx="17" cy="10" r="2.6" fill="currentColor" opacity=".8"/><path d="M4 19a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M14 19a4 4 0 0 1 6 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>;
    case "chart":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 16V9m5 7V6m5 10v-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case "heart":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M12 21s-7-4.4-9-9.2C1.8 8.7 4 5 7.8 5c2.1 0 3.4 1 4.2 2.2C12.8 6 14.1 5 16.2 5 20 5 22.2 8.7 21 11.8 19 16.6 12 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "bag":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M6 9h12l-1.1 11H7.1L6 9Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M9 9V7a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
    case "menu":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>;
    default:
      return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="m12 3 2.8 5.6L21 9.5l-4.5 4.3 1 6.2L12 17.1 6.5 20l1-6.2L3 9.5l6.2-.9L12 3Z" fill="currentColor"/></svg>;
  }
}

const heroResults = [
  { thumb: "/darik-how-394-thumb-toaster.jpg", store: "Appliance Hub", meta: "Home Appliances · Amman", rating: "4.8 (320)", badge: "Delivers to you", tone: "green", note: "Usually in 1–2 days" },
  { thumb: "/darik-how-394-thumb-washer.jpg", store: "Al Salam Mall", meta: "Electronics · Amman", rating: "4.6 (512)", badge: "Pickup available", tone: "blue", note: "In-store pickup" },
  { thumb: "/darik-how-394-thumb-ladder.jpg", store: "Al Bayt Al Mateen", meta: "Hardware & Tools · Amman", rating: "4.5 (189)", badge: "Delivers to you", tone: "green", note: "Usually in 1–3 days" },
  { thumb: "/darik-how-394-thumb-airfryer.jpg", store: "Home Essentials", meta: "Home Goods · Amman", rating: "4.4 (267)", badge: "Discoverable across Jordan", tone: "muted", note: "Not in your delivery area" },
];

const steps = [
  { number: "01", icon: "search" as IconName, title: "Search what you need", copy: "Type in a product, brand or category and set your location in Jordan." },
  { number: "02", icon: "store" as IconName, title: "Discover who sells it", copy: "See a list of local stores that match your search, with stores that can deliver to you shown first." },
  { number: "03", icon: "signpost" as IconName, title: "Know your options", copy: "Check delivery, pickup, or visit in person. Even if a store doesn’t deliver to you, you can still find and explore it." },
];

const retailerBenefits = [
  { icon: "store" as IconName, title: "Your own storefront", copy: "Showcase your products, brand and story with a professional store page." },
  { icon: "bars" as IconName, title: "Product discovery", copy: "Get found by new customers across Jordan, even if you don’t deliver to their area." },
  { icon: "truck" as IconName, title: "Smart delivery visibility", copy: "Reach nearby customers with delivery and pickup options that fit your business." },
  { icon: "link" as IconName, title: "Stay discoverable", copy: "Your store remains visible in search across Jordan, so people can always find and explore you." },
];

function Rating({ value }: { value: string }) {
  return <div className={styles.ratingRow}><Icon name="star" className={styles.starIcon} /><span>{value}</span></div>;
}

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>
      <div className={styles.topStrip} />
      <header className={styles.headerWrap}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Link href="/" className={styles.logoLink} aria-label="Darik home"><img src="/darik-approved-header-logo-390c.png" alt="Darik" className={styles.logoImage} /></Link>
            <nav className={styles.nav}>
              <Link href="/">Home</Link><Link href="/#all-stores">All Stores</Link><Link href="/#categories">Categories</Link><Link href="/#about">About</Link><Link href="/pricing" className={styles.activeNav}>For Business</Link>
            </nav>
            <div className={styles.headerActions}>
              <button className={styles.locationButton}><Icon name="pin" className={styles.actionIcon} />Amman, Jordan</button>
              <button className={styles.iconButton} aria-label="Search"><Icon name="search" className={styles.actionIcon} /></button>
              <Link href="/store-dashboard" className={styles.ghostButton}>Sign in</Link>
              <Link href="/store-signup" className={styles.primaryButton}>Create storefront</Link>
            </div>
            <div className={styles.mobileHeaderActions}>
              <button className={styles.mobileSquare} aria-label="Menu"><Icon name="menu" className={styles.actionIcon} /></button>
              <img src="/darik-approved-header-logo-390c.png" alt="Darik" className={styles.mobileLogo} />
              <button className={styles.mobileSquare} aria-label="Account"><Icon name="bag" className={styles.actionIcon} /></button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.heroSection}>
          <div className={styles.heroGlow} />
          <div className={styles.heroSideScene}><img src="/darik-how-394-side-scene.jpg" alt="Jordanian ruins" /></div>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>HOW DARIK WORKS</span>
                <h1 className={styles.heroTitle}><span>Search Jordan.</span><span className={styles.heroAccent}>Find the store.</span></h1>
                <p className={styles.heroText}>Darik helps you search for products and stores across Jordan, shows the stores that can deliver to you first, and keeps other stores discoverable even when they don’t currently deliver to your area.</p>
                <div className={styles.heroButtons}><Link href="/#all-stores" className={styles.primaryButton}>Browse all stores</Link><Link href="/store-signup" className={styles.secondaryButton}>Create your storefront</Link></div>
                <div className={styles.heroFacts}>
                  <div className={styles.heroFact}><Icon name="pin" className={styles.factIcon} /><span>Local stores<br />across Jordan</span></div>
                  <div className={styles.heroFact}><Icon name="truck" className={styles.factIcon} /><span>Delivery &amp; pickup<br />options</span></div>
                  <div className={styles.heroFact}><Icon name="store" className={styles.factIcon} /><span>Support local<br />businesses</span></div>
                </div>
              </div>
              <div className={styles.heroCard}>
                <div className={styles.heroCardBrand}>Darik</div>
                <div className={styles.searchRow}><div className={styles.searchBox}><Icon name="search" className={styles.smallIcon} /><span>toaster</span></div><button className={styles.searchButton}>Search</button></div>
                <div className={styles.filterPills}><span className={`${styles.pill} ${styles.pillActive}`}>All</span><span className={styles.pill}>Delivers to you</span><span className={styles.pill}>Pickup available</span><span className={styles.pill}>All Jordan</span></div>
                <div className={styles.resultsList}>{heroResults.map((item) => <div className={styles.resultCard} key={item.store}><img src={item.thumb} alt={item.store} className={styles.productThumb} /><div className={styles.resultBody}><div className={styles.resultTopRow}><div><h3>{item.store}</h3><p>{item.meta}</p><Rating value={item.rating} /></div><div className={styles.resultRight}><span className={`${styles.statusBadge} ${styles[item.tone as keyof typeof styles] || ""}`}>{item.badge}</span><span className={styles.resultNote}>{item.note}</span></div></div></div></div>)}</div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.section}><div className={styles.container}><div className={styles.sectionHeading}><h2>One search. Three simple steps.</h2><p>From search to store, Darik makes it easy to find what you need in Jordan.</p></div><div className={styles.stepGrid}>{steps.map((step) => <article className={styles.stepCard} key={step.number}><div className={styles.stepTop}><div className={styles.stepNumber}>{step.number}</div><Icon name={step.icon} className={styles.stepIcon} /></div><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div></div></section>
        <section className={styles.sectionTight}><div className={styles.container}><div className={styles.discoveryGrid}><div className={styles.discoveryCopy}><h2>More than delivery</h2><h3>A delivery marketplace and a discovery directory.</h3><p>Stores that can deliver to your location are prioritized first, so you can get what you need, faster.</p><p>But Darik also keeps stores outside your delivery area searchable and visible, so you can still discover great products, compare options, and support local businesses across Jordan.</p><div className={styles.quoteBox}>“ Same search. More stores. A stronger Jordan. ”</div></div><div className={styles.discoveryShowcase}><div className={styles.discoveryToolbar}><div className={styles.searchBoxCompact}><Icon name="search" className={styles.smallIcon} /><span>toaster</span></div><div className={styles.locationChip}><Icon name="pin" className={styles.smallIcon} /><span>Amman, Jordan</span></div></div><div className={`${styles.listPanel} ${styles.deliveryPanel}`}><div className={styles.listPanelTitle}>Delivery match (shown first)</div><div className={styles.miniResult}><img src="/darik-how-394-thumb-toaster.jpg" alt="Toaster" className={styles.productThumb} /><div className={styles.miniBody}><h4>Appliance Hub</h4><p>Home Appliances · Amman</p><Rating value="4.8 (320)" /></div><div className={styles.resultRight}><span className={`${styles.statusBadge} ${styles.green}`}>Delivers to you</span><span className={styles.resultNote}>Usually in 1–2 days</span></div></div></div><div className={styles.listPanel}><div className={styles.listPanelTitle}>Directory listing (still visible)</div><div className={styles.miniResult}><img src="/darik-how-394-thumb-ladder.jpg" alt="Ladder" className={styles.productThumb} /><div className={styles.miniBody}><h4>Al Bayt Al Mateen</h4><p>Hardware &amp; Tools · Amman</p><Rating value="4.5 (189)" /></div><div className={styles.resultRight}><span className={`${styles.statusBadge} ${styles.muted}`}>Discoverable across Jordan</span><span className={styles.resultNote}>Not in your delivery area</span></div></div></div><div className={styles.discoveryAside}><div className={styles.discoveryAsideText}>Same search.<br />More local stores.<br />A stronger Jordan <span>♥</span></div><img src="/darik-how-394-side-scene.jpg" alt="Jordanian landmark" className={styles.discoveryAsideImage} /></div></div></div></div></section>
        <section className={styles.section}><div className={styles.container}><div className={styles.sectionHeading}><h2>Why this matters for retailers</h2><p>More visibility. More customers. A stronger local economy.</p></div><div className={styles.retailerGrid}>{retailerBenefits.map((item) => <article className={styles.benefitCard} key={item.title}><Icon name={item.icon} className={styles.benefitIcon} /><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></div></section>
        <section className={styles.ctaSection}><div className={styles.container}><div className={styles.ctaBand}><div className={styles.ctaImageWrap}><img src="/darik-how-394-cta-man.jpg" alt="Darik delivery representative" className={styles.ctaImage} /></div><div className={styles.ctaContent}><div><h2>Put your business where Jordan searches.</h2><p>Join Darik and be part of a growing local marketplace that connects customers with businesses across the Kingdom.</p></div><div className={styles.ctaButtons}><Link href="/store-signup" className={styles.primaryButton}>Start your storefront</Link><Link href="/pricing" className={styles.whiteButton}>See pricing</Link></div></div><div className={styles.ctaPoints}><div className={styles.ctaPoint}><Icon name="people" className={styles.pointIcon} /><span>Reach more customers across Jordan</span></div><div className={styles.ctaPoint}><Icon name="chart" className={styles.pointIcon} /><span>Grow your business online</span></div><div className={styles.ctaPoint}><Icon name="heart" className={styles.pointIcon} /><span>Be part of a stronger, more connected local economy</span></div></div></div></div></section>
      </main>
      <footer className={styles.footer}><div className={styles.container}><div className={styles.footerGrid}><div className={styles.footerBrand}><div className={styles.footerMarkRow}><div className={styles.footerMark}><span className={styles.footerMarkBack} /><span className={styles.footerMarkFront} /></div><div><div className={styles.footerBrandName}>Darik</div><div className={styles.footerBrandTag}>Local Stores. Closer to You.</div></div></div><p>Darik connects customers with active retailers across Jordan through searchable storefronts, product discovery, and delivery-aware shopping.</p></div><div className={styles.footerLinks}><h4>Platform</h4><a href="/">All Stores</a><a href="/">Categories</a><a href="/">About Darik</a><a href="/pricing">For Business</a></div><div className={styles.footerLinks}><h4>Retailers</h4><a href="/store-signup">Start Your Store</a><a href="/store-dashboard">Retailer Dashboard</a><a href="/pricing">Pricing</a><a href="/how-it-works">Success Stories</a></div><div className={styles.footerLinks}><h4>Help</h4><a href="/support">Help Center</a><a href="/support">Contact Us</a><a href="/terms">Terms of Service</a><a href="/privacy">Privacy Policy</a></div><div className={styles.footerSocial}><h4>Follow Us</h4><div className={styles.socialRow}><span>f</span><span>ig</span><span>in</span><span>yt</span></div></div></div><div className={styles.footerBottom}><span>© 2026 Darik Technologies. All rights reserved.</span><span>getdarik.com  |  Jordan</span></div></div></footer>
    </div>
  );
}
