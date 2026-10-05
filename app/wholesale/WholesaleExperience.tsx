// DARIK_WHOLESALE_FRONTEND_V001
"use client";

import { useMemo, useState } from "react";
import styles from "./wholesale.module.css";

type View = "home" | "deal" | "commit" | "confirmed" | "commitments" | "supplier";

type Deal = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  badge: string;
  badgeTone: "green" | "red";
  moq: number;
  committed: number;
  landed: number;
  localRange: string;
  closes: string;
};

const deals: Deal[] = [
  {
    id: "byd-dolphin-headlamp-rh",
    name: "BYD Dolphin Headlamp (RH)",
    subtitle: "High quality OEM factory part",
    image: "/wholesale/headlamp_card.jpg",
    badge: "Popular",
    badgeTone: "green",
    moq: 500,
    committed: 347,
    landed: 48,
    localRange: "65–75 JOD",
    closes: "Closes in 5 days",
  },
  {
    id: "commercial-blender-2l",
    name: "Commercial Blender 2L",
    subtitle: "For restaurants and cafés",
    image: "/wholesale/blender.jpg",
    badge: "Almost There",
    badgeTone: "red",
    moq: 300,
    committed: 218,
    landed: 28.5,
    localRange: "39–45 JOD",
    closes: "Closes in 3 days",
  },
  {
    id: "modern-pendant-light",
    name: "Modern Pendant Light",
    subtitle: "Premium design, multiple colors",
    image: "/wholesale/pendant.jpg",
    badge: "New",
    badgeTone: "green",
    moq: 1000,
    committed: 624,
    landed: 12.4,
    localRange: "18–22 JOD",
    closes: "Closes in 7 days",
  },
];

const categories = [
  ["🚘", "Auto Parts"],
  ["☕", "Restaurant & Café"],
  ["🏠", "Home & Kitchen"],
  ["💡", "Lighting & Décor"],
  ["🛠", "Tools & Hardware"],
  ["📦", "Packaging"],
  ["🪑", "Furniture"],
  ["🔌", "Electronics"],
];

function pct(committed: number, moq: number) {
  return Math.min(100, Math.round((committed / moq) * 100));
}

function money(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

function DarikMark() {
  return (
    <div className={styles.brand} aria-label="Darik Wholesale">
      <img
        className={styles.brandLogo}
        src="/wholesale/darik-wholesale-logo.png"
        alt="Darik Wholesale"
      />
    </div>
  );
}

function Header({ setView }: { setView: (view: View) => void }) {
  return (
    <header className={styles.header}>
      <button className={styles.brandButton} onClick={() => setView("home")}>
        <DarikMark />
      </button>
      <nav className={styles.nav}>
        <button onClick={() => setView("home")}>Deals</button>
        <button onClick={() => setView("home")}>Categories</button>
        <button onClick={() => setView("home")}>How It Works</button>
        <button onClick={() => setView("supplier")}>For Suppliers</button>
        <button onClick={() => setView("home")}>About</button>
      </nav>
      <div className={styles.headerActions}>
        <button className={styles.iconButton} aria-label="Search">⌕</button>
        <button className={styles.linkButton} onClick={() => setView("commitments")}>Login</button>
        <button className={styles.primarySmall} onClick={() => setView("commitments")}>Sign Up</button>
      </div>
    </header>
  );
}

function Progress({ committed, moq }: { committed: number; moq: number }) {
  const percent = pct(committed, moq);
  return (
    <>
      <div className={styles.progressRow}>
        <span>MOQ: {moq.toLocaleString()} units</span>
        <strong>{percent}%</strong>
      </div>
      <div className={styles.progressTrack}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.progressMeta}>
        <span>{committed.toLocaleString()} committed</span>
        <span>{Math.max(0, moq - committed).toLocaleString()} remaining</span>
      </div>
    </>
  );
}

function DealCard({ deal, onOpen }: { deal: Deal; onOpen: () => void }) {
  return (
    <article className={styles.dealCard}>
      <div className={styles.dealImageWrap}>
        <img src={deal.image} alt="" className={styles.dealImage} />
        <span className={deal.badgeTone === "red" ? styles.badgeRed : styles.badgeGreen}>{deal.badge}</span>
      </div>
      <div className={styles.dealBody}>
        <h3>{deal.name}</h3>
        <p className={styles.muted}>{deal.subtitle}</p>
        <Progress committed={deal.committed} moq={deal.moq} />
        <p className={styles.mutedLabel}>Estimated landed price</p>
        <div className={styles.price}>{money(deal.landed)} JOD</div>
        <p className={styles.localMarket}>Local market price: ~{deal.localRange}</p>
        <div className={styles.closeRow}>◷ {deal.closes}</div>
        <button className={styles.primaryFull} onClick={onOpen}>View Deal</button>
      </div>
    </article>
  );
}

function Home({ setView }: { setView: (view: View) => void }) {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroMedia} aria-hidden="true" />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>BUY TOGETHER. BUY DIRECT.</p>
          <h1>
            Better Products.<br />
            Lower Prices.<br />
            <span>Stronger Businesses.</span>
          </h1>
          <p className={styles.heroCopy}>
            Join Jordan&apos;s largest business buying network. We help retailers and wholesalers access
            factory-direct products from trusted suppliers in China — by pooling orders, reaching MOQs,
            and lowering costs for everyone.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryHero} onClick={() => document.getElementById("live-deals")?.scrollIntoView({ behavior: "smooth" })}>Browse Deals</button>
            <button className={styles.secondaryHero} onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>◉ How It Works</button>
          </div>
        </div>
        <div className={styles.heroSideMessage}>
          <span>From China</span>
          <span>to Jordan.</span>
          <strong>Together.</strong>
        </div>
        <div className={styles.heroBenefits}>
          <div><b>⚙</b><span>Verified Suppliers</span></div>
          <div><b>◉</b><span>Pooled Orders</span></div>
          <div><b>◌</b><span>Better Prices</span></div>
          <div><b>▥</b><span>Business Growth</span></div>
        </div>
      </section>

      <section className={styles.categoryStrip}>
        {categories.map(([icon, label]) => (
          <button key={label} className={styles.categoryCard}>
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
        <button className={styles.categoryCard}><span>•••</span><small>View All</small></button>
      </section>

      <section className={styles.section} id="live-deals">
        <div className={styles.sectionTitleRow}>
          <h2>Live Wholesale Deals</h2>
          <button className={styles.viewAll}>View All Deals →</button>
        </div>
        <div className={styles.dealGrid}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onOpen={() => setView("deal")} />
          ))}
        </div>
      </section>

      <section className={styles.how} id="how-it-works">
        <div>
          <p className={styles.eyebrowDark}>HOW DARIK WHOLESALE WORKS</p>
          <h2>One factory MOQ. Many Jordanian buyers.</h2>
          <p>Commit the quantity your business needs. When the pooled order reaches the factory MOQ, payment opens and Darik coordinates the consolidated order.</p>
        </div>
        <div className={styles.howSteps}>
          <article><b>1</b><h3>Commit</h3><p>Reserve the quantity your business wants. No payment yet.</p></article>
          <article><b>2</b><h3>Reach MOQ</h3><p>Commitments from Jordanian businesses combine toward the factory minimum.</p></article>
          <article><b>3</b><h3>Pay</h3><p>When the MOQ is reached, buyers receive a payment window to secure their units.</p></article>
          <article><b>4</b><h3>Ship</h3><p>Darik places the consolidated purchase order and coordinates delivery into Jordan.</p></article>
        </div>
      </section>
    </>
  );
}

function DealDetail({ setView }: { setView: (view: View) => void }) {
  return (
    <main className={styles.detailPage}>
      <div className={styles.breadcrumbs}>Deals › Auto Parts › BYD Dolphin Headlamp (RH)</div>
      <div className={styles.detailGrid}>
        <section className={styles.galleryPane}>
          <div className={styles.mainProductImage}><img src="/wholesale/headlamp.jpg" alt="BYD Dolphin headlamp" /></div>
          <div className={styles.thumbs}>
            {["/wholesale/headlamp.jpg", "/wholesale/headlamp_card.jpg", "/wholesale/headlamp.jpg", "/wholesale/headlamp_card.jpg"].map((src, index) => (
              <button key={index}><img src={src} alt="" /></button>
            ))}
          </div>
          <div className={styles.tabs}><b>Product Details</b><span>Specifications</span><span>Supplier</span><span>Shipping & Delivery</span></div>
          <p className={styles.detailText}>High quality OEM headlamp for BYD Dolphin. Direct from certified manufacturer in China. Perfect fit, excellent light output and durability.</p>
          <ul className={styles.detailList}>
            <li>Fits BYD Dolphin 2023+</li>
            <li>OEM quality, factory direct</li>
            <li>Multiple certification standards</li>
            <li>Carton quantity: 4 units</li>
            <li>Estimated production time: 15–20 days</li>
            <li>Shipping to Jordan: 25–30 days</li>
            <li>HS code: 851220</li>
          </ul>
        </section>

        <aside className={styles.orderPane}>
          <h1>BYD Dolphin Headlamp (RH)</h1>
          <p>OEM quality • For BYD Dolphin 2023+</p>
          <div className={styles.badges}><span>✓ Verified Supplier</span><span>◈ OEM Quality</span><span>↻ 1 Year Warranty</span></div>

          <div className={styles.progressCard}>
            <div className={styles.cardHeading}><strong>Group Order Progress</strong><b>69%</b></div>
            <div className={styles.progressTrackLarge}><span style={{ width: "69%" }} /></div>
            <div className={styles.cardStats}><b>347 committed</b><span>153 remaining</span></div>
            <p><strong>MOQ:</strong> 500 units</p>
            <div className={styles.deadline}>◷ Closes in 5 days</div>
          </div>

          <div className={styles.priceBreakCard}>
            <strong>The more we buy, the lower the price!</strong>
            <table>
              <thead><tr><th>Quantity</th><th>500</th><th>1,000</th><th>2,000</th></tr></thead>
              <tbody>
                <tr><td>Factory price (FOB)</td><td>$58</td><td>$52</td><td>$46</td></tr>
                <tr><td>Estimated landed price (JOD)</td><td>48.00</td><td>43.20</td><td>38.50</td></tr>
              </tbody>
            </table>
          </div>

          <button className={styles.commitButton} onClick={() => setView("commit")}>Commit Your Quantity</button>
          <div className={styles.secondaryActions}><button>♡ Add to Watchlist</button><button>↗ Share</button></div>

          <div className={styles.whyCard}>
            <h3>Why buy with Darik Wholesale?</h3>
            {["Factory-direct pricing", "Pooled orders reach better prices", "Estimated landed cost to Amman", "Verified suppliers", "Secure and transparent process", "Support in Arabic and English"].map((item) => <p key={item}>✓ {item}</p>)}
          </div>
        </aside>
      </div>
    </main>
  );
}

function CommitView({ setView }: { setView: (view: View) => void }) {
  const [qty, setQty] = useState(50);
  const orderValue = useMemo(() => qty * 48, [qty]);
  return (
    <main className={styles.centerStage}>
      <section className={styles.mobileLikeCard}>
        <div className={styles.mobileTop}><DarikMark /><button onClick={() => setView("home")}>☰</button></div>
        <div className={styles.mobileContent}>
          <h1>Commit Your Quantity</h1>
          <p className={styles.centerMuted}>You&apos;re one step closer to better prices. Commit your quantity now. You&apos;ll only be charged if the deal reaches the MOQ.</p>
          <div className={styles.productMini}><img src="/wholesale/headlamp_card.jpg" alt="" /><div><b>BYD Dolphin Headlamp (RH)</b><span>Estimated landed price: 48.00 JOD</span></div></div>
          <label className={styles.fieldLabel}>Select Quantity</label>
          <div className={styles.quantityGrid}>
            <div className={styles.stepper}><button onClick={() => setQty(Math.max(1, qty - 10))}>−</button><strong>{qty}</strong><button onClick={() => setQty(qty + 10)}>+</button></div>
            <div className={styles.orderValue}><span>Order Value</span><strong>{money(orderValue)} JOD</strong><small>You won&apos;t be charged yet.</small></div>
          </div>
          <div className={styles.infoBox}><b>ⓘ No payment required now</b><span>You&apos;re making a commitment. If the deal reaches the MOQ, you&apos;ll have 48 hours to complete your payment.</span></div>
          <button className={styles.primaryFullTall} onClick={() => setView("confirmed")}>Confirm Commitment</button>
          <p className={styles.terms}>By continuing, you agree to the Darik Wholesale <u>Terms & Conditions</u>.</p>
        </div>
      </section>
    </main>
  );
}

function Confirmed({ setView }: { setView: (view: View) => void }) {
  return (
    <main className={styles.centerStage}>
      <section className={styles.mobileLikeCard}>
        <div className={styles.mobileTop}><DarikMark /><button onClick={() => setView("home")}>☰</button></div>
        <div className={styles.mobileContent}>
          <div className={styles.successIcon}>✓</div>
          <h1>You&apos;re In!</h1>
          <p className={styles.centerMuted}>Your commitment has been recorded.</p>
          <div className={styles.summaryCard}>
            <div className={styles.productMini}><img src="/wholesale/headlamp_card.jpg" alt="" /><b>BYD Dolphin Headlamp (RH)</b></div>
            <div className={styles.summaryRow}><span>Your commitment</span><b>50 units</b></div>
            <div className={styles.summaryRow}><span>Estimated value</span><b>2,400 JOD</b></div>
            <div className={styles.summaryRow}><span>Status</span><mark>Pending (no payment yet)</mark></div>
          </div>
          <div className={styles.infoBox}><b>ⓘ What happens next?</b><span>You&apos;ll be notified immediately if the deal reaches the MOQ. You&apos;ll then have 48 hours to complete your payment.</span></div>
          <button className={styles.primaryFullTall} onClick={() => setView("deal")}>View Deal</button>
          <button className={styles.textAction} onClick={() => setView("home")}>Browse More Deals</button>
        </div>
      </section>
    </main>
  );
}

function Commitments({ setView }: { setView: (view: View) => void }) {
  return (
    <main className={styles.centerStageWide}>
      <section className={styles.commitmentsPanel}>
        <div className={styles.mobileTop}><DarikMark /><button onClick={() => setView("home")}>☰</button></div>
        <div className={styles.accountTabs}><span>My Orders</span><b>My Commitments</b><span>Saved</span><span>Profile</span></div>
        <div className={styles.accountContent}>
          <h1>My Commitments</h1>
          <div className={styles.statusTabs}><b>Active (2)</b><span>Awaiting Payment (0)</span><span>Completed (3)</span></div>
          <article className={styles.commitmentCard}>
            <img src="/wholesale/headlamp_card.jpg" alt="" />
            <div className={styles.commitmentMain}><strong>BYD Dolphin Headlamp (RH)</strong><span>50 units · ~2,400 JOD</span><div className={styles.progressTrack}><span style={{width:"69%"}} /></div><small>347 / 500</small></div>
            <div className={styles.commitmentAside}><b>69%</b><button onClick={() => setView("deal")}>View Deal</button></div>
          </article>
          <article className={styles.commitmentCard}>
            <img src="/wholesale/blender.jpg" alt="" />
            <div className={styles.commitmentMain}><strong>Commercial Blender 2L</strong><span>20 units · ~570 JOD</span><div className={styles.progressTrack}><span style={{width:"73%"}} /></div><small>218 / 300</small></div>
            <div className={styles.commitmentAside}><b>73%</b><button onClick={() => setView("home")}>View Deal</button></div>
          </article>
        </div>
      </section>
    </main>
  );
}

function Supplier({ setView }: { setView: (view: View) => void }) {
  return (
    <main className={styles.supplierPage}>
      <section className={styles.supplierHero}>
        <div className={styles.supplierOverlay} />
        <div className={styles.supplierHeroContent}>
          <h1>Grow Your Business<br />in Jordan</h1>
          <p>Connect with hundreds of verified retailers and wholesalers in Jordan. We help you reach new markets through pooled orders, secure transactions, and long-term partnerships.</p>
          <button className={styles.primaryHero}>Become a Supplier</button>
        </div>
      </section>
      <section className={styles.supplierBenefits}>
        <div><b>▥</b><span>Access Jordan&apos;s Market</span></div>
        <div><b>⬡</b><span>Larger Order Volumes</span></div>
        <div><b>◆</b><span>Secure & Transparent</span></div>
        <div><b>◉</b><span>Dedicated Support</span></div>
      </section>
      <section className={styles.manufacturers}>
        <h2>Trusted by Manufacturers Across China</h2>
        <div className={styles.fakeLogos}><b>BYD</b><b>Midea</b><b>SUNGROW</b><b>Haier</b><b>TCL</b><b>CHiNT</b></div>
        <blockquote>“Darik Wholesale has helped us reach serious buyers in Jordan. The process is professional and efficient.”<br /><span>— Supplier, Guangzhou</span></blockquote>
      </section>
      <button className={styles.backButton} onClick={() => setView("home")}>← Back to Wholesale</button>
    </main>
  );
}

export default function WholesaleExperience() {
  const [view, setView] = useState<View>("home");

  return (
    <div className={styles.shell}>
      {(view === "home" || view === "deal") && <Header setView={setView} />}
      {view === "home" && <Home setView={setView} />}
      {view === "deal" && <DealDetail setView={setView} />}
      {view === "commit" && <CommitView setView={setView} />}
      {view === "confirmed" && <Confirmed setView={setView} />}
      {view === "commitments" && <Commitments setView={setView} />}
      {view === "supplier" && <Supplier setView={setView} />}
    </div>
  );
}
