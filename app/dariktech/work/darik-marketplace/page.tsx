export const metadata = {
  title: "Darik Marketplace Features | Darik Technologies",
  description:
    "A dedicated Darik Marketplace case-study page showing the customer app, retailer portal, driver app, delivery GPS, support center, and admin operations system.",
};

const modules = [
  {
    title: "Customer App",
    text: "Categories, Best Sellers, cart, order review, delivery location, Free Next-Day, Express Delivery, Darik Promise returns, and Support Center.",
    icon: "bag",
    visual: "customer",
  },
  {
    title: "Retailer Portal",
    text: "Retailer screening, Add New Product, approval workflow, official photo lock, inventory status, ads, payment balance, receipts, and support tickets.",
    icon: "store",
    visual: "retailer",
  },
  {
    title: "Driver App",
    text: "Driver screening, GPS tracking, Go Online, warehouse pickup, active batch stops, route progress, delivery PIN, customer signature, and Mark Delivered.",
    icon: "car",
    visual: "driver",
  },
  {
    title: "Admin Dashboard",
    text: "Customer Orders, Customer Care, Stocker Orders, Dispatcher Screen, Locate Drivers, Returns Center, Support Inbox, AI Queue, P&L, and Admin Users.",
    icon: "settings",
    visual: "admin",
  },
  {
    title: "Delivery Operations",
    text: "Next-Day Delivery Routes, driver locator, route optimization, delivery problems, return-to-warehouse flows, and live map operations.",
    icon: "pin",
    visual: "delivery",
  },
  {
    title: "Finance & Trust",
    text: "Cleared payments, pending payouts, 24-hour clearing, balance receipts, ad fees, fulfillment fees, return credits, and Profit & Loss tracking.",
    icon: "chat",
    visual: "finance",
  },
];

const includes = [
  ["Product Discovery & Best Sellers", "Categories, product browsing, Best Sellers rows, related items, verified stock, search, and customer-friendly product cards."],
  ["Checkout & Delivery Choice", "Cart, saved items, order review, Free Next-Day Delivery, Express Delivery, delivery fee logic, and 8 PM cutoff messaging."],
  ["Location & Live Tracking", "Delivery Location, Search Google Maps Location, selected delivery pin, driver pin, ETA, and location confirmation before checkout."],
  ["Darik Promise Returns", "24-hour return window, Darik Credit from returns, free exact replacement for defective items, pickup fee rules, and return status tracking."],
  ["Retailer Inventory Tools", "Add New Product, approval rule, raw photo review, official photo lock, live products, paused products, archived items, and inventory removal."],
  ["Retailer Money & Ads", "Cleared payment, pending payout, balance receipts, payout ledger, paid ad requests, current live ads, and ad performance insights."],
  ["Driver Warehouse Workflow", "Head to Darik Warehouse, arrived warehouse, order numbers to pick up, dispatcher release, active pickup, and cash / driver summary."],
  ["Delivery Route Execution", "Active Batch Stops, route progress, call/map actions, delivery PIN, receiver name, customer signature, Mark Delivered, and return-to-warehouse problems."],
  ["Admin Operating System", "Customer Orders, Customer Care, Stocker Orders, Dispatcher Screen, Locate Drivers, Returns Center, Support Inbox, AI Queue, accounting, P&L, and permissions."],
];

const includeBadges = [
  ["Categories", "Best Sellers", "Verified Stock"],
  ["Cart", "Next-Day", "Express"],
  ["Maps", "ETA", "Pinned Location"],
  ["24h Window", "Darik Credit", "Replacement"],
  ["Add Product", "Photo Lock", "Approval"],
  ["Cleared payments", "Paid Ads", "Receipts"],
  ["Warehouse", "Pickup", "Cash Summary"],
  ["Delivery PIN", "Signature", "Mark Delivered"],
  ["Orders", "Returns", "P&L"],
];

const previews = [
  {
    title: "Customer App Experience",
    text: "Best Sellers, categories, cart, delivery location, Free Next-Day, Express Delivery, Darik Promise returns, and support.",
    type: "shopping",
    label: "Customer app",
    stat: "Shop + deliver",
  },
  {
    title: "Retailer Portal Experience",
    text: "Retailer dashboard, Add New Product, official photo approval, inventory status, ads, payment balance, receipts, and support tickets.",
    type: "retailer",
    label: "Retailer portal",
    stat: "Inventory + money",
  },
  {
    title: "Driver App Experience",
    text: "Go Online, warehouse pickup, active batch stops, route progress, maps, delivery PIN, signature, and Mark Delivered.",
    type: "driver",
    label: "Driver app",
    stat: "Pickup + route",
  },
  {
    title: "Admin Dashboard Experience",
    text: "Orders, Customer Care, Stocker Orders, Dispatcher Screen, Locate Drivers, Returns Center, Support Inbox, AI Queue, Accounting, and P&L.",
    type: "admin",
    label: "Admin dashboard",
    stat: "Command center",
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === "bag") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 8h10l-1 11H8L7 8z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </svg>
    );
  }

  if (type === "store") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9h16l-1.2-4H5.2L4 9z" />
        <path d="M5 9v10h14V9" />
        <path d="M9 19v-5h6v5" />
      </svg>
    );
  }

  if (type === "car") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12l1.7-4.2A2 2 0 0 1 8.6 6.5h6.8a2 2 0 0 1 1.9 1.3L19 12" />
        <path d="M4 12h16v5H4z" />
        <path d="M7 17.5h.1" />
        <path d="M17 17.5h.1" />
      </svg>
    );
  }

  if (type === "pin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12z" />
        <path d="M12 11.5a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.5h14v9H9l-4 3v-12z" />
        <path d="M8 10h8" />
        <path d="M8 13h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 6.5h15" />
      <path d="M4.5 12h15" />
      <path d="M4.5 17.5h15" />
      <path d="M9 4.8v3.4" />
      <path d="M15 10.3v3.4" />
      <path d="M11.5 15.8v3.4" />
    </svg>
  );
}

function ModuleMiniScreen({ type }: { type: string }) {
  if (type === "customer") {
    return (
      <div className="dm-module-screen dm-module-customer-screen">
        <div className="dm-module-screen-top"><strong>Darik</strong><span>Cart</span></div>
        <div className="dm-module-search">Delivery Location</div>
        <div className="dm-module-cats"><i className="active" /><i /><i /><i /></div>
        <div className="dm-module-title-row"><b>Best Sellers</b><small>See all</small></div>
        <div className="dm-module-products"><i /><i /></div>
        <div className="dm-module-delivery-row"><span>Free Next-Day</span><span>Express</span></div>
      </div>
    );
  }

  if (type === "retailer") {
    return (
      <div className="dm-module-screen dm-module-retailer-screen">
        <div className="dm-module-screen-top"><strong>Retailer Portal</strong><span>Live</span></div>
        <div className="dm-module-retailer-stats"><i /><i /></div>
        <div className="dm-module-form-stack"><i /><i /><i /></div>
        <div className="dm-module-photo-lock">Official photo approval</div>
        <div className="dm-module-submit">Add New Product</div>
      </div>
    );
  }

  if (type === "driver") {
    return (
      <div className="dm-module-screen dm-module-driver-screen">
        <div className="dm-module-screen-top"><strong>Driver App</strong><span>Online</span></div>
        <div className="dm-module-driver-status"><b>Active Batch Stops</b><small>2 delivered • 1 remaining</small></div>
        <div className="dm-module-stop"><span>ORD-3888034B</span><b>Call • Map • PIN</b></div>
        <div className="dm-module-driver-actions"><i /><i /></div>
        <div className="dm-module-delivered">Mark Delivered</div>
      </div>
    );
  }

  if (type === "admin") {
    return (
      <div className="dm-module-screen dm-module-admin-screen">
        <div className="dm-module-screen-top"><strong>Admin Dashboard</strong><span>P&L</span></div>
        <div className="dm-module-admin-tabs"><i /><i /><i /><i /></div>
        <div className="dm-module-admin-kpis"><div /><div /><div /></div>
        <div className="dm-module-admin-lines"><i /><i /><i /></div>
      </div>
    );
  }

  if (type === "delivery") {
    return (
      <div className="dm-module-screen dm-module-delivery-screen">
        <div className="dm-module-screen-top"><strong>Locate Drivers</strong><span>Live</span></div>
        <div className="dm-module-map">
          <i className="pin one" />
          <i className="pin two" />
          <i className="pin three" />
          <span className="road road-one" />
          <span className="road road-two" />
        </div>
        <div className="dm-module-route-bar"><b>Next-Day Route</b><span>Optimized</span></div>
      </div>
    );
  }

  return (
    <div className="dm-module-screen dm-module-finance-screen">
      <div className="dm-module-screen-top"><strong>Finance & Trust</strong><span>payments</span></div>
      <div className="dm-module-money-card"><b>Cleared payments</b><span>Ready to pay</span></div>
      <div className="dm-module-money-card muted"><b>Pending payment</b><span>24-hour rule</span></div>
      <div className="dm-module-finance-bars"><i /><i /><i /></div>
      <div className="dm-module-profit">Profit & Loss</div>
    </div>
  );
}

function MiniScreen({ type }: { type: string }) {
  if (type === "shopping") {
    return (
      <div className="dm-phone-screen dm-action-screen dm-action-customer">
        <div className="dm-action-status"><span>9:41</span><i /></div>

        <div className="dm-action-topbar">
          <div>
            <strong>Darik</strong>
            <span>Customer marketplace</span>
          </div>
          <b>Cart</b>
        </div>

        <div className="dm-action-location">
          <small>Delivery Location</small>
          <b>Search Google Maps Location</b>
        </div>

        <div className="dm-action-category-strip">
          <i className="active" />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="dm-action-title-row">
          <strong>Best Sellers</strong>
          <span>See all</span>
        </div>

        <div className="dm-action-product-grid">
          <div><i /><b /><span>31.25</span></div>
          <div><i /><b /><span>6.25</span></div>
        </div>

        <div className="dm-action-delivery-choice">
          <div><b>Free Next-Day</b><span>0</span></div>
          <div><b>Express</b><span>2</span></div>
        </div>

        <div className="dm-action-bottom-nav"><i /><i /><i /><i /></div>
      </div>
    );
  }

  if (type === "retailer") {
    return (
      <div className="dm-phone-screen dm-action-screen dm-action-retailer">
        <div className="dm-action-status"><span>9:41</span><i /></div>

        <div className="dm-action-topbar">
          <div>
            <strong>LIVE RETAILER PORTAL</strong>
            <span>Inventory, ads, payouts</span>
          </div>
          <b>Live</b>
        </div>

        <div className="dm-action-money-row">
          <div><small>Cleared payments</small><b>Ready</b></div>
          <div><small>Pending payment</small><b>24h</b></div>
        </div>

        <div className="dm-action-tab-row">
          <span className="active">Add Product</span>
          <span>Ads</span>
          <span>Receipts</span>
        </div>

        <div className="dm-action-form">
          <span>Product Information</span>
          <i />
          <i className="short" />
          <i />
        </div>

        <div className="dm-action-photo-lock">
          <b>Official photo approval</b>
          <span>Raw photo locked after review</span>
        </div>

        <div className="dm-action-submit">Submit Product</div>
      </div>
    );
  }

  if (type === "driver") {
    return (
      <div className="dm-phone-screen dm-action-screen dm-action-driver">
        <div className="dm-action-status"><span>9:41</span><i /></div>

        <div className="dm-action-topbar">
          <div>
            <strong>Driver App</strong>
            <span>Warehouse pickup + route</span>
          </div>
          <b>Online</b>
        </div>

        <div className="dm-action-driver-hero">
          <small>Head to Darik Warehouse</small>
          <b>Pickup released by dispatcher</b>
        </div>

        <div className="dm-action-route-progress">
          <i />
          <i />
          <i className="empty" />
        </div>

        <div className="dm-action-stop-card">
          <small>Active Batch Stops</small>
          <b>ORD-3888034B</b>
          <span>Call • Map • Delivery PIN</span>
          <div className="dm-action-driver-buttons"><i /><i /></div>
        </div>

        <div className="dm-action-signature">
          <span>Receiver signature</span>
          <b>Mark Delivered</b>
        </div>
      </div>
    );
  }

  return (
    <div className="dm-phone-screen dm-action-screen dm-action-admin">
      <div className="dm-action-status"><span>9:41</span><i /></div>

      <div className="dm-action-topbar">
        <div>
          <strong>LIVE SUPABASE ADMIN DASHBOARD</strong>
          <span>Operations command center</span>
        </div>
        <b>Admin</b>
      </div>

      <div className="dm-action-admin-tabs">
        <span className="active">Orders</span>
        <span>Care</span>
        <span>Stocker</span>
        <span>Drivers</span>
        <span>Returns</span>
        <span>AI Queue</span>
      </div>

      <div className="dm-action-admin-kpis">
        <div><small>Active Orders</small><b>342</b></div>
        <div><small>Photo Review</small><b>25</b></div>
      </div>

      <div className="dm-action-admin-board">
        <div className="dm-action-admin-list">
          <i />
          <i />
          <i />
        </div>
        <div className="dm-action-admin-map">
          <i className="pin one" />
          <i className="pin two" />
          <span />
        </div>
      </div>

      <div className="dm-action-admin-footer">
        <span>Support Inbox</span>
        <span>Profit & Loss</span>
      </div>
    </div>
  );
}

export default function DarikMarketplacePage() {
  const quoteHref = "/dariktech/quote";

  return (
    <main className="dm-page" data-smart-lang="en">
      <style>{`
        :root {
          --dm-black: #0f1010;
          --dm-ink: #111111;
          --dm-muted: rgba(17, 17, 17, 0.62);
          --dm-line: rgba(17, 17, 17, 0.11);
          --dm-yellow: #ffd83d;
          --dm-yellow-soft: #fff4c2;
          --dm-bg: #f7f7f4;
          --dm-card: #ffffff;
        }

        html,
        body {
          margin: 0;
          background: var(--dm-bg);
        }

        .dm-page {
          min-height: 100vh;
          color: var(--dm-ink);
          background:
            radial-gradient(circle at 8% 4%, rgba(255, 216, 61, 0.18), transparent 28rem),
            radial-gradient(circle at 88% 8%, rgba(0, 0, 0, 0.06), transparent 22rem),
            linear-gradient(180deg, #ffffff 0%, #f7f7f4 42%, #f3f3ef 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }

        .dm-page *,
        .dm-page *::before,
        .dm-page *::after {
          box-sizing: border-box;
        }

        .dm-shell {
          width: min(1180px, calc(100% - 42px));
          margin: 0 auto;
        }

        .dm-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          color: #ffffff;
          background: rgba(15, 16, 16, 0.94);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .dm-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 76px;
        }

        .dm-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
        }

        .dm-logo {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: #000;
          border: 1px solid rgba(255, 216, 61, 0.24);
          box-shadow: 0 18px 42px rgba(255, 216, 61, 0.1);
          overflow: hidden;
        }

        .dm-logo img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .dm-brand strong {
          display: block;
          font-size: 15px;
          line-height: 1;
        }

        .dm-brand span {
          display: block;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.52);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .dm-nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
          font-weight: 800;
        }

        .dm-nav-links a {
          color: inherit;
          text-decoration: none;
        }

        .dm-nav-cta {
          padding: 12px 15px;
          border-radius: 999px;
          color: #0f1010 !important;
          background: var(--dm-yellow);
          font-weight: 950;
        }

        .dm-hero {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
          gap: clamp(30px, 6vw, 74px);
          align-items: center;
          padding: 74px 0 78px;
        }

        .dm-eyebrow {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #5f4a00;
          background: rgba(255, 216, 61, 0.2);
          border: 1px solid rgba(255, 216, 61, 0.48);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dm-eyebrow::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--dm-yellow);
          box-shadow: 0 0 0 5px rgba(255, 216, 61, 0.16);
        }

        .dm-hero h1 {
          margin: 18px 0 18px;
          max-width: 620px;
          color: #111;
          font-size: clamp(50px, 7vw, 86px);
          line-height: 0.92;
          letter-spacing: -0.08em;
        }

        .dm-hero-lede {
          max-width: 600px;
          margin: 0;
          color: rgba(17, 17, 17, 0.72);
          font-size: clamp(20px, 2vw, 26px);
          line-height: 1.28;
          letter-spacing: -0.04em;
          font-weight: 760;
        }

        .dm-hero-copy {
          max-width: 590px;
          margin: 20px 0 0;
          color: var(--dm-muted);
          font-size: 15.5px;
          line-height: 1.72;
        }

        .dm-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 28px;
        }

        .dm-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 50px;
          padding: 0 18px;
          border-radius: 999px;
          color: #111;
          text-decoration: none;
          font-size: 14px;
          font-weight: 950;
        }

        .dm-button-primary {
          background: var(--dm-yellow);
          box-shadow: 0 18px 42px rgba(255, 216, 61, 0.22);
        }

        .dm-button-secondary {
          background: #fff;
          border: 1px solid var(--dm-line);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
        }

        .dm-device-stage {
          position: relative;
          min-height: 430px;
        }

        .dm-laptop {
          position: absolute;
          inset: 16px 0 40px 78px;
          border-radius: 28px;
          padding: 16px;
          background: #111;
          box-shadow: 0 34px 100px rgba(0, 0, 0, 0.24);
        }

        .dm-laptop-screen {
          height: 100%;
          border-radius: 20px;
          padding: 18px;
          background: #f8f8f5;
          overflow: hidden;
        }

        .dm-dashboard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .dm-dashboard-top strong {
          font-size: 17px;
          letter-spacing: -0.03em;
        }

        .dm-dot-row {
          display: flex;
          gap: 6px;
        }

        .dm-dot-row span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--dm-yellow);
        }

        .dm-dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 14px;
        }

        .dm-dash-stat,
        .dm-order-list,
        .dm-map-card {
          border: 1px solid var(--dm-line);
          border-radius: 18px;
          background: #fff;
          padding: 13px;
        }

        .dm-dash-stat span {
          display: block;
          color: var(--dm-muted);
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .dm-dash-stat strong {
          display: block;
          margin-top: 7px;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .dm-dashboard-grid {
          display: grid;
          grid-template-columns: 0.88fr 1.12fr;
          gap: 12px;
        }

        .dm-order-list {
          display: grid;
          gap: 9px;
        }

        .dm-order-list strong,
        .dm-map-card strong {
          font-size: 13px;
        }

        .dm-order-row {
          height: 32px;
          border-radius: 11px;
          background: #f4f4ef;
        }

        .dm-map-card {
          min-height: 156px;
          position: relative;
          background:
            linear-gradient(90deg, rgba(17, 17, 17, 0.04) 1px, transparent 1px),
            linear-gradient(rgba(17, 17, 17, 0.04) 1px, transparent 1px),
            #fff;
          background-size: 28px 28px;
        }

        .dm-map-pin {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 999px 999px 999px 2px;
          background: #ef4444;
          transform: rotate(-45deg);
          box-shadow: 0 10px 22px rgba(239, 68, 68, 0.24);
        }

        .dm-map-pin-one { left: 42%; top: 46%; }
        .dm-map-pin-two { right: 22%; top: 31%; background: #22c55e; }
        .dm-map-pin-three { left: 22%; bottom: 24%; background: var(--dm-yellow); }

        .dm-phone {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 190px;
          height: 350px;
          border-radius: 34px;
          padding: 12px;
          background: #111;
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.24);
        }

        .dm-phone-inner {
          height: 100%;
          border-radius: 26px;
          background: #fff;
          overflow: hidden;
          padding: 16px 13px;
        }

        .dm-phone-inner strong {
          display: block;
          margin: 12px 0 10px;
          font-size: 18px;
          letter-spacing: -0.04em;
        }

        .dm-cat-row {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .dm-cat-row i {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #eee;
          border: 4px solid #fff;
          box-shadow: 0 0 0 1px var(--dm-line);
        }

        .dm-cat-row i:first-child {
          background: #111;
          border-color: var(--dm-yellow);
        }

        .dm-product-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .dm-product {
          min-height: 108px;
          border-radius: 14px;
          background: #f2f2ee;
          padding: 8px;
        }

        .dm-product::before {
          content: "";
          display: block;
          height: 60px;
          border-radius: 10px;
          background: linear-gradient(135deg, #d7e3ef, #fff, #f3c6d9);
        }

        .dm-product span {
          display: block;
          height: 8px;
          margin-top: 8px;
          border-radius: 99px;
          background: #0f4f7b;
        }

        .dm-section {
          padding: 58px 0;
        }

        .dm-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 26px;
          margin-bottom: 26px;
        }

        .dm-section-head h2 {
          margin: 0;
          max-width: 720px;
          font-size: clamp(34px, 5vw, 56px);
          line-height: 0.98;
          letter-spacing: -0.07em;
        }

        .dm-section-head p {
          max-width: 430px;
          margin: 0;
          color: var(--dm-muted);
          font-size: 15px;
          line-height: 1.6;
        }

        .dm-module-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        .dm-module-card {
          min-height: 300px;
          padding: 18px;
          border: 1px solid var(--dm-line);
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.045);
        }

        .dm-module-icon,
        .dm-include-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 15px;
          color: #111;
          background: var(--dm-yellow);
          box-shadow: 0 14px 32px rgba(255, 216, 61, 0.2);
        }

        .dm-module-icon svg,
        .dm-include-icon svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dm-module-card h3 {
          margin: 18px 0 10px;
          font-size: 18px;
          letter-spacing: -0.04em;
        }

        .dm-module-card p {
          margin: 0;
          color: var(--dm-muted);
          font-size: 13px;
          line-height: 1.52;
        }

        .dm-mini-phone {
          height: 132px;
          margin-top: 16px;
          border-radius: 22px 22px 0 0;
          border: 8px solid #111;
          border-bottom: 0;
          background: #fff;
          overflow: hidden;
          padding: 10px;
        }

        .dm-mini-bars {
          display: grid;
          gap: 7px;
        }

        .dm-mini-bars i {
          height: 18px;
          border-radius: 8px;
          background: #f1f1ed;
        }

        .dm-mini-bars i:nth-child(2) {
          width: 74%;
          background: #fff4c2;
        }

        .dm-includes {
          display: grid;
          grid-template-columns: 0.52fr 1fr;
          gap: 38px;
          align-items: start;
        }

        .dm-includes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--dm-line);
          border-left: 1px solid var(--dm-line);
        }

        .dm-include-card {
          min-height: 150px;
          padding: 20px;
          border-right: 1px solid var(--dm-line);
          border-bottom: 1px solid var(--dm-line);
          background: rgba(255, 255, 255, 0.54);
        }

        .dm-include-card h3 {
          margin: 13px 0 7px;
          font-size: 16px;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .dm-include-card p {
          margin: 0;
          color: var(--dm-muted);
          font-size: 12.5px;
          line-height: 1.45;
        }

        .dm-system {
          overflow: hidden;
          padding: 28px;
          border-radius: 34px;
          color: #fff;
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 216, 61, 0.12), transparent 24rem),
            linear-gradient(135deg, #121212, #0a0a0a);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
        }

        .dm-system-grid {
          display: grid;
          grid-template-columns: 0.38fr 1fr;
          gap: 34px;
          align-items: center;
        }

        .dm-system h2 {
          margin: 0;
          max-width: 330px;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .dm-system p {
          max-width: 320px;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.6;
        }

        .dm-system-flow {
          display: grid;
          grid-template-columns: 1fr 1fr 160px 1fr 1fr;
          align-items: center;
          gap: 12px;
        }

        .dm-flow-node {
          min-height: 86px;
          padding: 16px;
          border-radius: 20px;
          color: #111;
          background: #fff;
        }

        .dm-flow-node strong {
          display: block;
          font-size: 13px;
        }

        .dm-flow-node span {
          display: block;
          margin-top: 5px;
          color: rgba(17, 17, 17, 0.58);
          font-size: 11px;
          line-height: 1.3;
        }

        .dm-core {
          display: grid;
          place-items: center;
          width: 144px;
          height: 144px;
          border-radius: 999px;
          background: #0c0c0c;
          border: 1px solid rgba(255, 216, 61, 0.5);
          box-shadow: 0 0 0 10px rgba(255, 216, 61, 0.07), 0 0 52px rgba(255, 216, 61, 0.13);
        }

        .dm-core img {
          width: 72px;
          height: 72px;
          object-fit: contain;
        }

        .dm-previews-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .dm-preview-card {
          overflow: hidden;
          border: 1px solid var(--dm-line);
          border-radius: 30px;
          background: #fff;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.05);
        }

        .dm-preview-phone {
          display: grid;
          place-items: center;
          min-height: 260px;
          padding: 22px 22px 0;
          background: linear-gradient(180deg, #fff, #f5f5f1);
        }

        .dm-phone-screen {
          width: 180px;
          height: 238px;
          border: 9px solid #111;
          border-bottom: 0;
          border-radius: 28px 28px 0 0;
          background: #fff;
          overflow: hidden;
          padding: 15px 12px;
        }

        .dm-mini-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dm-mini-top span {
          font-weight: 950;
          font-size: 12px;
        }

        .dm-mini-top i {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #f1f1ed;
        }

        .dm-category-dots {
          display: flex;
          gap: 7px;
          margin: 13px 0;
        }

        .dm-category-dots i {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: #f1f1ed;
        }

        .dm-shopping-screen strong,
        .dm-support-screen strong,
        .dm-retailer-screen strong,
        .dm-driver-screen strong {
          display: block;
          margin: 8px 0 9px;
          font-size: 16px;
          letter-spacing: -0.04em;
        }

        .dm-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .dm-product-grid div {
          height: 58px;
          border-radius: 12px;
          background: linear-gradient(135deg, #d7e3ef, #fff, #f3c6d9);
        }

        .dm-support-screen span,
        .dm-retailer-screen span {
          display: block;
          color: var(--dm-muted);
          font-size: 11px;
          font-weight: 800;
        }

        .dm-support-choice {
          margin-top: 8px;
          padding: 8px;
          border: 1px solid var(--dm-line);
          border-radius: 10px;
          font-size: 10px;
          font-weight: 900;
        }

        .dm-support-choice-active {
          background: #fff7d6;
          border-color: rgba(255, 216, 61, 0.6);
        }

        .dm-form-line,
        .dm-form-box {
          height: 28px;
          margin-top: 9px;
          border-radius: 10px;
          background: #f3f3ef;
          border: 1px solid var(--dm-line);
        }

        .dm-form-line-short {
          width: 72%;
        }

        .dm-form-box {
          height: 48px;
          background: #fff7d6;
        }

        .dm-chip-row {
          display: flex;
          gap: 7px;
          margin-top: 9px;
        }

        .dm-chip-row i {
          width: 54px;
          height: 24px;
          border-radius: 99px;
          background: #111;
        }

        .dm-chip-row i:nth-child(2) {
          background: #f3f3ef;
          border: 1px solid var(--dm-line);
        }

        .dm-stop-card {
          margin-top: 12px;
          padding: 10px;
          border-radius: 14px;
          background: #f5f5f1;
          border: 1px solid var(--dm-line);
        }

        .dm-stop-card span,
        .dm-stop-card b,
        .dm-stop-card small {
          display: block;
        }

        .dm-stop-card span {
          font-size: 11px;
          font-weight: 950;
        }

        .dm-stop-card b {
          margin-top: 4px;
          font-size: 14px;
        }

        .dm-stop-card small {
          margin-top: 5px;
          color: var(--dm-muted);
          font-size: 10px;
        }

        .dm-driver-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-top: 10px;
        }

        .dm-driver-buttons i {
          height: 24px;
          border-radius: 9px;
          background: #111;
        }

        .dm-driver-buttons i:nth-child(2) {
          background: var(--dm-yellow);
        }

        .dm-preview-content {
          padding: 20px;
        }

        .dm-preview-content h3 {
          margin: 0 0 8px;
          font-size: 20px;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .dm-preview-content p {
          margin: 0;
          color: var(--dm-muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .dm-final {
          margin: 36px 0 72px;
          padding: 38px;
          border-radius: 34px;
          color: #fff;
          background:
            radial-gradient(circle at 92% 20%, rgba(255, 216, 61, 0.22), transparent 18rem),
            linear-gradient(135deg, #111, #070707);
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.22);
        }

        .dm-final-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 28px;
          align-items: center;
        }

        .dm-final h2 {
          margin: 0;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.95;
          letter-spacing: -0.07em;
        }

        .dm-final p {
          max-width: 640px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.7;
        }

        @media (max-width: 1020px) {
          .dm-hero,
          .dm-system-grid,
          .dm-includes,
          .dm-final-grid {
            grid-template-columns: 1fr;
          }

          .dm-module-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .dm-previews-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dm-device-stage {
            max-width: 720px;
          }

          .dm-system-flow {
            grid-template-columns: 1fr;
          }

          .dm-core {
            width: 128px;
            height: 128px;
            margin: 0 auto;
          }
        }

        @media (max-width: 720px) {
          .dm-shell {
            width: min(100% - 26px, 1180px);
          }

          .dm-nav-inner {
            min-height: 68px;
          }

          .dm-nav-links a:not(.dm-nav-cta) {
            display: none;
          }

          .dm-nav-cta {
            padding: 10px 12px;
            font-size: 12px;
          }

          .dm-brand span {
            display: none;
          }

          .dm-hero {
            padding: 46px 0 54px;
          }

          .dm-hero h1 {
            font-size: clamp(48px, 14vw, 68px);
          }

          .dm-hero-lede {
            font-size: 20px;
          }

          .dm-actions {
            display: grid;
          }

          .dm-device-stage {
            min-height: 520px;
          }

          .dm-laptop {
            inset: 0 0 auto 0;
            height: 300px;
          }

          .dm-phone {
            left: 16px;
            bottom: 0;
          }

          .dm-section-head {
            align-items: start;
            flex-direction: column;
          }

          .dm-module-grid,
          .dm-includes-grid,
          .dm-previews-grid {
            grid-template-columns: 1fr;
          }

          .dm-module-card {
            min-height: auto;
          }

          .dm-mini-phone {
            height: 118px;
          }

          .dm-section {
            padding: 46px 0;
          }

          .dm-system,
          .dm-final {
            padding: 24px;
            border-radius: 28px;
          }
        }

        /* Task 7: Darik Marketplace detail page hero polish */
        .dm-nav {
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.14);
        }

        .dm-nav-inner {
          min-height: 82px;
        }

        .dm-nav-links {
          gap: 24px;
        }

        .dm-nav-links a:not(.dm-nav-cta) {
          position: relative;
          transition: color 160ms ease;
        }

        .dm-nav-links a:not(.dm-nav-cta):hover {
          color: #ffffff;
        }

        .dm-nav-links a:not(.dm-nav-cta)::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -10px;
          height: 2px;
          border-radius: 999px;
          background: var(--dm-yellow);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 160ms ease;
        }

        .dm-nav-links a:not(.dm-nav-cta):hover::after {
          transform: scaleX(1);
        }

        .dm-nav-cta {
          box-shadow:
            0 14px 34px rgba(255, 216, 61, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
        }

        .dm-hero {
          position: relative;
          min-height: calc(100vh - 82px);
          padding: clamp(64px, 7vw, 92px) 0 clamp(72px, 8vw, 104px);
          isolation: isolate;
        }

        .dm-hero::before {
          content: "";
          position: absolute;
          inset: -82px calc(50% - 50vw) 0;
          z-index: -2;
          background:
            radial-gradient(circle at 13% 22%, rgba(255, 216, 61, 0.2), transparent 21rem),
            radial-gradient(circle at 82% 22%, rgba(17, 17, 17, 0.09), transparent 28rem),
            linear-gradient(180deg, #ffffff 0%, #f8f8f4 72%, #f2f2ee 100%);
        }

        .dm-hero::after {
          content: "";
          position: absolute;
          left: calc(50% - 50vw);
          right: calc(50% - 50vw);
          bottom: 0;
          z-index: -1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(17, 17, 17, 0.1), transparent);
        }

        .dm-hero h1 {
          max-width: 660px;
          font-size: clamp(58px, 7.8vw, 104px);
          line-height: 0.88;
          letter-spacing: -0.09em;
        }

        .dm-hero-lede {
          max-width: 640px;
          font-size: clamp(23px, 2.4vw, 33px);
          line-height: 1.15;
          letter-spacing: -0.055em;
        }

        .dm-hero-copy {
          max-width: 610px;
          color: rgba(17, 17, 17, 0.66);
          font-size: 16.5px;
        }

        .dm-actions {
          margin-top: 34px;
        }

        .dm-button {
          position: relative;
          overflow: hidden;
          min-height: 54px;
          padding: 0 21px;
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }

        .dm-button:hover {
          transform: translateY(-2px);
        }

        .dm-button-primary {
          border: 1px solid rgba(17, 17, 17, 0.06);
          box-shadow:
            0 22px 54px rgba(255, 216, 61, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.38);
        }

        .dm-button-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.25), transparent 45%, rgba(255, 255, 255, 0.18));
          opacity: 0.64;
          pointer-events: none;
        }

        .dm-button-secondary {
          border-color: rgba(17, 17, 17, 0.18);
        }

        .dm-device-stage {
          min-height: 520px;
          perspective: 1200px;
        }

        .dm-device-stage::before {
          content: "";
          position: absolute;
          inset: 8% 0 3% 18%;
          border-radius: 999px;
          background:
            radial-gradient(circle at 55% 50%, rgba(255, 216, 61, 0.22), transparent 18rem),
            radial-gradient(circle at 70% 44%, rgba(17, 17, 17, 0.16), transparent 24rem);
          filter: blur(18px);
          opacity: 0.76;
          z-index: -1;
        }

        .dm-laptop {
          inset: 36px 0 42px 86px;
          border-radius: 30px;
          padding: 16px 16px 22px;
          background:
            linear-gradient(180deg, #191919, #080808);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow:
            0 38px 100px rgba(0, 0, 0, 0.28),
            0 0 0 1px rgba(255, 216, 61, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transform: rotateY(-4deg) rotateX(1deg);
        }

        .dm-laptop::before {
          content: "";
          position: absolute;
          left: 40px;
          right: 40px;
          bottom: -15px;
          height: 18px;
          border-radius: 0 0 28px 28px;
          background: linear-gradient(180deg, #2a2a2a, #0f0f0f);
          box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
        }

        .dm-laptop-screen {
          border-radius: 22px;
          padding: 20px;
          background:
            radial-gradient(circle at 86% 18%, rgba(255, 216, 61, 0.12), transparent 12rem),
            linear-gradient(180deg, #ffffff, #f7f7f3);
          border: 1px solid rgba(255, 255, 255, 0.72);
        }

        .dm-dashboard-top {
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(17, 17, 17, 0.08);
        }

        .dm-dashboard-top strong {
          font-size: 20px;
        }

        .dm-dot-row span {
          width: 9px;
          height: 9px;
          background: #111;
          opacity: 0.2;
        }

        .dm-dot-row span:first-child {
          background: var(--dm-yellow);
          opacity: 1;
          box-shadow: 0 0 0 5px rgba(255, 216, 61, 0.14);
        }

        .dm-dash-stats {
          gap: 12px;
          margin-bottom: 16px;
        }

        .dm-dash-stat,
        .dm-order-list,
        .dm-map-card {
          border-color: rgba(17, 17, 17, 0.09);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.035);
        }

        .dm-dash-stat {
          min-height: 94px;
          padding: 15px;
        }

        .dm-dash-stat strong {
          font-size: 24px;
        }

        .dm-dash-stat span::after {
          content: " + live";
          color: #15803d;
          font-weight: 950;
          text-transform: none;
          letter-spacing: 0;
        }

        .dm-order-list {
          padding: 15px;
        }

        .dm-order-row {
          position: relative;
          height: 38px;
          background:
            linear-gradient(90deg, #f4f4ef 0 56%, #dcfce7 56% 78%, #f4f4ef 78%);
        }

        .dm-order-row::before {
          content: "";
          position: absolute;
          left: 10px;
          top: 50%;
          width: 54%;
          height: 7px;
          border-radius: 999px;
          transform: translateY(-50%);
          background: rgba(17, 17, 17, 0.16);
        }

        .dm-order-row::after {
          content: "";
          position: absolute;
          right: 10px;
          top: 50%;
          width: 34px;
          height: 12px;
          border-radius: 999px;
          transform: translateY(-50%);
          background: #bbf7d0;
        }

        .dm-map-card {
          min-height: 180px;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(17, 17, 17, 0.045) 1px, transparent 1px),
            linear-gradient(rgba(17, 17, 17, 0.045) 1px, transparent 1px),
            linear-gradient(135deg, #ffffff, #f5f5ef);
          background-size: 30px 30px, 30px 30px, auto;
        }

        .dm-map-card::before,
        .dm-map-card::after {
          content: "";
          position: absolute;
          height: 8px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.1);
          transform: rotate(-28deg);
        }

        .dm-map-card::before {
          left: -18px;
          right: 28px;
          top: 72px;
        }

        .dm-map-card::after {
          left: 76px;
          right: -34px;
          top: 118px;
          transform: rotate(22deg);
        }

        .dm-map-pin {
          z-index: 2;
        }

        .dm-phone {
          left: 6px;
          bottom: 18px;
          width: 210px;
          height: 386px;
          border-radius: 38px;
          padding: 12px;
          background:
            linear-gradient(180deg, #191919, #050505);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 38px 92px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.13);
          transform: rotate(-2deg);
        }

        .dm-phone::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 14px;
          width: 56px;
          height: 7px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.14);
          z-index: 2;
        }

        .dm-phone-inner {
          border-radius: 30px;
          padding: 24px 14px 16px;
        }

        .dm-phone-inner .dm-mini-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dm-phone-inner .dm-mini-top::after {
          content: "";
          width: 25px;
          height: 25px;
          border-radius: 999px;
          background: #f1f1ed;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.07);
        }

        .dm-phone-inner .dm-mini-top strong {
          margin: 0;
          font-size: 16px;
        }

        .dm-cat-row {
          gap: 9px;
          margin: 14px 0 18px;
        }

        .dm-cat-row i {
          width: 35px;
          height: 35px;
          background:
            radial-gradient(circle at 40% 32%, rgba(255, 216, 61, 0.65), transparent 22%),
            #e9e9e4;
        }

        .dm-product-row {
          gap: 10px;
        }

        .dm-product {
          min-height: 124px;
          background: #f6f6f2;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.045);
        }

        .dm-product::before {
          height: 72px;
        }

        .dm-product span {
          background: #0f4f7b;
        }

        .dm-hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .dm-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 8px 11px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.74);
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(17, 17, 17, 0.08);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.045);
          font-size: 12px;
          font-weight: 850;
        }

        .dm-hero-badge::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--dm-yellow);
          box-shadow: 0 0 0 5px rgba(255, 216, 61, 0.14);
        }

        @media (max-width: 1020px) {
          .dm-hero {
            min-height: auto;
          }

          .dm-laptop {
            inset: 10px 0 80px 82px;
          }
        }

        @media (max-width: 720px) {
          .dm-nav-inner {
            min-height: 72px;
          }

          .dm-hero {
            padding: 42px 0 54px;
          }

          .dm-hero h1 {
            font-size: clamp(50px, 14vw, 72px);
          }

          .dm-device-stage {
            min-height: 540px;
          }

          .dm-device-stage::before {
            inset: 8% -10% 0;
          }

          .dm-laptop {
            inset: 0 0 auto 0;
            height: 318px;
            transform: none;
          }

          .dm-laptop::before {
            left: 28px;
            right: 28px;
            bottom: -13px;
          }

          .dm-laptop-screen {
            padding: 14px;
          }

          .dm-dashboard-top strong {
            font-size: 16px;
          }

          .dm-dash-stats {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .dm-dash-stat {
            min-height: auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
          }

          .dm-dash-stat strong {
            margin-top: 0;
            font-size: 17px;
          }

          .dm-dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dm-order-list {
            display: none;
          }

          .dm-map-card {
            min-height: 116px;
          }

          .dm-phone {
            left: 18px;
            bottom: 0;
            width: 202px;
            height: 370px;
          }

          .dm-hero-badges {
            margin-top: 22px;
          }

          .dm-hero-badge {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .dm-device-stage {
            min-height: 500px;
          }

          .dm-laptop {
            height: 286px;
            border-radius: 26px;
          }

          .dm-phone {
            left: 10px;
            width: 184px;
            height: 340px;
            border-radius: 34px;
          }

          .dm-phone-inner {
            border-radius: 27px;
          }

          .dm-product {
            min-height: 106px;
          }

          .dm-product::before {
            height: 62px;
          }
        }


        /* Task 8: module cards section polish */
        .dm-module-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .dm-module-card {
          --module-rgb: 255, 216, 61;
          --module-accent: #ffd83d;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 430px;
          padding: 22px;
          border-radius: 32px;
          border-color: rgba(17, 17, 17, 0.1);
          background:
            radial-gradient(circle at 84% 8%, rgba(var(--module-rgb), 0.18), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.74)),
            #ffffff;
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.78);
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease;
        }

        .dm-module-card:nth-child(2) {
          --module-rgb: 17, 17, 17;
          --module-accent: #111111;
        }

        .dm-module-card:nth-child(3) {
          --module-rgb: 34, 197, 94;
          --module-accent: #22c55e;
        }

        .dm-module-card:nth-child(4) {
          --module-rgb: 59, 130, 246;
          --module-accent: #3b82f6;
        }

        .dm-module-card:nth-child(5) {
          --module-rgb: 168, 85, 247;
          --module-accent: #a855f7;
        }

        .dm-module-card:nth-child(6) {
          --module-rgb: 245, 158, 11;
          --module-accent: #f59e0b;
        }

        .dm-module-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 26px;
          width: 112px;
          height: 4px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--module-accent), transparent);
          box-shadow: 0 0 24px rgba(var(--module-rgb), 0.36);
        }

        .dm-module-card::after {
          content: "";
          position: absolute;
          right: -90px;
          bottom: -110px;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(var(--module-rgb), 0.13), transparent 66%);
          pointer-events: none;
        }

        .dm-module-card:hover {
          transform: translateY(-7px);
          border-color: rgba(var(--module-rgb), 0.26);
          box-shadow:
            0 34px 90px rgba(0, 0, 0, 0.11),
            0 0 0 1px rgba(var(--module-rgb), 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.86);
        }

        .dm-module-icon {
          position: relative;
          z-index: 2;
          width: 48px;
          height: 48px;
          border-radius: 17px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.08)),
            var(--module-accent);
          box-shadow:
            0 18px 42px rgba(var(--module-rgb), 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.34);
        }

        .dm-module-card:nth-child(2) .dm-module-icon {
          color: #ffffff;
        }

        .dm-module-card h3 {
          position: relative;
          z-index: 2;
          margin: 20px 0 10px;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .dm-module-card p {
          position: relative;
          z-index: 2;
          color: rgba(17, 17, 17, 0.64);
          font-size: 14px;
          line-height: 1.55;
        }

        .dm-mini-phone {
          position: relative;
          z-index: 2;
          order: -1;
          height: 188px;
          margin: 0 0 18px;
          padding: 16px;
          border: 10px solid #111111;
          border-bottom: 0;
          border-radius: 30px 30px 0 0;
          background:
            radial-gradient(circle at 72% 10%, rgba(var(--module-rgb), 0.13), transparent 7rem),
            #ffffff;
          box-shadow:
            0 22px 56px rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(17, 17, 17, 0.04);
        }

        .dm-mini-phone::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -3px;
          width: 48px;
          height: 7px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.15);
        }

        .dm-mini-phone::after {
          content: "";
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--module-rgb), 0.34), transparent);
        }

        .dm-mini-bars {
          position: relative;
          height: 100%;
          display: block;
        }

        .dm-mini-bars i {
          position: absolute;
          display: block;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.08);
        }

        .dm-mini-bars i:nth-child(1) {
          left: 0;
          top: 0;
          width: 54%;
          height: 12px;
          background: rgba(17, 17, 17, 0.82);
        }

        .dm-mini-bars i:nth-child(2) {
          right: 0;
          top: 0;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: rgba(var(--module-rgb), 0.2);
        }

        .dm-mini-bars i:nth-child(3) {
          left: 0;
          top: 46px;
          width: 100%;
          height: 72px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 82% 20%, rgba(var(--module-rgb), 0.34), transparent 4rem),
            linear-gradient(135deg, rgba(var(--module-rgb), 0.16), rgba(17, 17, 17, 0.045));
        }

        .dm-mini-bars i:nth-child(4) {
          left: 0;
          right: 0;
          bottom: 0;
          width: auto;
          height: 30px;
          border-radius: 14px;
          background: rgba(17, 17, 17, 0.075);
        }

        .dm-module-card:nth-child(1) .dm-mini-bars::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 30px;
          height: 24px;
          background:
            radial-gradient(circle at 8% 50%, #111 0 10px, transparent 11px),
            radial-gradient(circle at 30% 50%, #f2f2ee 0 10px, transparent 11px),
            radial-gradient(circle at 52% 50%, #f2f2ee 0 10px, transparent 11px),
            radial-gradient(circle at 74% 50%, #f2f2ee 0 10px, transparent 11px);
        }

        .dm-module-card:nth-child(1) .dm-mini-bars i:nth-child(3) {
          top: 70px;
          height: 56px;
          border-radius: 16px;
          background:
            linear-gradient(90deg, #f3f3ef 0 48%, transparent 48% 52%, #f3f3ef 52%),
            linear-gradient(135deg, #d7e3ef, #fff, #f3c6d9);
          background-size: auto, 48% 100%;
        }

        .dm-module-card:nth-child(2) .dm-mini-bars i:nth-child(3) {
          top: 42px;
          height: 34px;
          border-radius: 14px;
          background:
            linear-gradient(90deg, #111 0 26%, #f3f3ef 26% 50%, #fff4c2 50% 74%, #f3f3ef 74%);
        }

        .dm-module-card:nth-child(2) .dm-mini-bars i:nth-child(4) {
          top: 90px;
          bottom: auto;
          height: 50px;
          border-radius: 17px;
          background:
            linear-gradient(90deg, rgba(17,17,17,0.08) 1px, transparent 1px),
            linear-gradient(rgba(17,17,17,0.08) 1px, transparent 1px),
            #ffffff;
          background-size: 16px 16px;
          border: 1px solid rgba(17, 17, 17, 0.08);
        }

        .dm-module-card:nth-child(3) .dm-mini-bars i:nth-child(3) {
          top: 46px;
          height: 64px;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #ffffff, #f3f3ef);
          border: 1px solid rgba(17, 17, 17, 0.08);
        }

        .dm-module-card:nth-child(3) .dm-mini-bars i:nth-child(3)::after {
          content: "";
          position: absolute;
          left: 12px;
          top: 12px;
          right: 12px;
          height: 9px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 20px 0 rgba(17, 17, 17, 0.12), 0 38px 0 rgba(17, 17, 17, 0.08);
        }

        .dm-module-card:nth-child(4) .dm-mini-bars i:nth-child(3) {
          top: 40px;
          height: 92px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 30% 48%, #ef4444 0 5px, transparent 6px),
            radial-gradient(circle at 68% 32%, #22c55e 0 5px, transparent 6px),
            radial-gradient(circle at 52% 72%, #ffd83d 0 5px, transparent 6px),
            linear-gradient(90deg, rgba(17,17,17,0.06) 1px, transparent 1px),
            linear-gradient(rgba(17,17,17,0.06) 1px, transparent 1px),
            #fff;
          background-size: auto, auto, auto, 18px 18px, 18px 18px, auto;
          border: 1px solid rgba(17, 17, 17, 0.08);
        }

        .dm-module-card:nth-child(5) .dm-mini-bars i:nth-child(3) {
          top: 44px;
          height: 82px;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #fff7d6 0 31%, #fff 31% 100%);
          border: 1px solid rgba(17, 17, 17, 0.08);
        }

        .dm-module-card:nth-child(5) .dm-mini-bars i:nth-child(3)::after {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          top: 40px;
          height: 10px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.12);
          box-shadow: 0 18px 0 rgba(17, 17, 17, 0.08);
        }

        .dm-module-card:nth-child(6) .dm-mini-bars i:nth-child(3) {
          top: 40px;
          height: 38px;
          border-radius: 15px;
          background:
            linear-gradient(90deg, #111 0 32%, #fff4c2 32% 64%, #f3f3ef 64%);
        }

        .dm-module-card:nth-child(6) .dm-mini-bars i:nth-child(4) {
          top: 92px;
          bottom: auto;
          height: 44px;
          border-radius: 16px;
          background:
            linear-gradient(90deg, transparent 0 12%, rgba(245, 158, 11, 0.38) 12% 26%, transparent 26% 38%, rgba(245, 158, 11, 0.58) 38% 52%, transparent 52% 64%, rgba(245, 158, 11, 0.26) 64% 78%, transparent 78%),
            #fff;
          border: 1px solid rgba(17, 17, 17, 0.08);
        }

        @media (max-width: 1020px) {
          .dm-module-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .dm-module-card {
            min-height: 410px;
          }
        }

        @media (max-width: 720px) {
          .dm-module-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .dm-module-card {
            min-height: auto;
            padding: 20px;
            border-radius: 28px;
          }

          .dm-mini-phone {
            height: 176px;
            border-radius: 28px 28px 0 0;
          }

          .dm-module-card h3 {
            font-size: 23px;
          }

          .dm-module-card p {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .dm-module-card {
            padding: 18px;
          }

          .dm-mini-phone {
            height: 160px;
            border-width: 9px;
          }
        }


        /* Task 9: What Darik includes feature grid polish */
        .dm-includes {
          position: relative;
          grid-template-columns: minmax(300px, 0.44fr) minmax(0, 1fr);
          gap: 44px;
          align-items: stretch;
        }

        .dm-includes::before {
          content: "";
          position: absolute;
          inset: -24px calc(50% - 50vw);
          z-index: -1;
          background:
            radial-gradient(circle at 10% 12%, rgba(255, 216, 61, 0.12), transparent 22rem),
            radial-gradient(circle at 88% 34%, rgba(17, 17, 17, 0.055), transparent 26rem);
          pointer-events: none;
        }

        .dm-includes-side {
          position: sticky;
          top: 112px;
          align-self: start;
          min-height: 520px;
          padding: 30px;
          border-radius: 34px;
          color: #ffffff;
          background:
            radial-gradient(circle at 14% 0%, rgba(255, 216, 61, 0.25), transparent 12rem),
            linear-gradient(145deg, #151515, #070707);
          box-shadow:
            0 28px 90px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .dm-includes-side::before {
          content: "";
          position: absolute;
          right: -92px;
          top: -92px;
          width: 230px;
          height: 230px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 216, 61, 0.18), transparent 68%);
        }

        .dm-includes-side::after {
          content: "";
          position: absolute;
          left: 30px;
          right: 30px;
          bottom: 0;
          height: 3px;
          border-radius: 999px 999px 0 0;
          background: linear-gradient(90deg, transparent, var(--dm-yellow), transparent);
          box-shadow: 0 0 24px rgba(255, 216, 61, 0.3);
        }

        .dm-includes-side .dm-eyebrow {
          position: relative;
          z-index: 2;
          color: #fff0a1;
          background: rgba(255, 216, 61, 0.12);
          border-color: rgba(255, 216, 61, 0.28);
        }

        .dm-includes-side h2 {
          position: relative;
          z-index: 2;
          margin: 20px 0 0;
          max-width: 410px;
          color: #ffffff;
          font-size: clamp(36px, 4.4vw, 58px);
          line-height: 0.96;
          letter-spacing: -0.075em;
        }

        .dm-includes-side .dm-hero-copy {
          position: relative;
          z-index: 2;
          color: rgba(255, 255, 255, 0.68);
          margin-top: 20px;
        }

        .dm-include-proof-list {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 10px;
          margin-top: 30px;
        }

        .dm-include-proof {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
          align-items: center;
          min-height: 70px;
          padding: 13px;
          border-radius: 20px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035));
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dm-include-proof::before {
          content: "";
          grid-row: 1 / span 2;
          display: block;
          width: 36px;
          height: 36px;
          border-radius: 14px;
          background:
            radial-gradient(circle at 50% 35%, #111 0 4px, transparent 5px),
            var(--dm-yellow);
          box-shadow:
            0 12px 26px rgba(255, 216, 61, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.34);
        }

        .dm-include-proof strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .dm-include-proof span {
          display: block;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
          line-height: 1.35;
        }

        .dm-includes-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          border: 0;
        }

        .dm-include-card {
          --include-rgb: 255, 216, 61;
          --include-accent: #ffd83d;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          min-height: 220px;
          padding: 22px;
          border: 1px solid rgba(17, 17, 17, 0.09);
          border-radius: 28px;
          background:
            radial-gradient(circle at 86% 10%, rgba(var(--include-rgb), 0.16), transparent 10rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.74)),
            #ffffff;
          box-shadow:
            0 18px 54px rgba(0, 0, 0, 0.055),
            inset 0 1px 0 rgba(255, 255, 255, 0.78);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
        }

        .dm-include-card:nth-child(2) {
          --include-rgb: 17, 17, 17;
          --include-accent: #111111;
        }

        .dm-include-card:nth-child(3) {
          --include-rgb: 59, 130, 246;
          --include-accent: #3b82f6;
        }

        .dm-include-card:nth-child(4) {
          --include-rgb: 168, 85, 247;
          --include-accent: #a855f7;
        }

        .dm-include-card:nth-child(5) {
          --include-rgb: 245, 158, 11;
          --include-accent: #f59e0b;
        }

        .dm-include-card:nth-child(6) {
          --include-rgb: 34, 197, 94;
          --include-accent: #22c55e;
        }

        .dm-include-card:nth-child(7) {
          --include-rgb: 20, 184, 166;
          --include-accent: #14b8a6;
        }

        .dm-include-card:nth-child(8) {
          --include-rgb: 239, 68, 68;
          --include-accent: #ef4444;
        }

        .dm-include-card:nth-child(9) {
          --include-rgb: 99, 102, 241;
          --include-accent: #6366f1;
        }

        .dm-include-card::before {
          content: "";
          position: absolute;
          left: 22px;
          right: 22px;
          top: 0;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--include-accent), transparent);
          box-shadow: 0 0 20px rgba(var(--include-rgb), 0.22);
        }

        .dm-include-card::after {
          content: "";
          position: absolute;
          right: -62px;
          bottom: -70px;
          z-index: -1;
          width: 156px;
          height: 156px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(var(--include-rgb), 0.12), transparent 68%);
        }

        .dm-include-card:hover {
          transform: translateY(-5px);
          border-color: rgba(var(--include-rgb), 0.25);
          box-shadow:
            0 28px 72px rgba(0, 0, 0, 0.09),
            0 0 0 1px rgba(var(--include-rgb), 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        .dm-include-icon {
          width: 48px;
          height: 48px;
          border-radius: 17px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.1)),
            var(--include-accent);
          box-shadow:
            0 16px 38px rgba(var(--include-rgb), 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
        }

        .dm-include-card:nth-child(2) .dm-include-icon {
          color: #ffffff;
        }

        .dm-include-card h3 {
          margin: 18px 0 10px;
          font-size: 21px;
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .dm-include-card p {
          color: rgba(17, 17, 17, 0.62);
          font-size: 13.5px;
          line-height: 1.55;
        }

        .dm-include-card p::before {
          content: "";
          display: block;
          width: 38px;
          height: 2px;
          margin-bottom: 12px;
          border-radius: 999px;
          background: rgba(var(--include-rgb), 0.34);
        }

        @media (max-width: 1120px) {
          .dm-includes {
            grid-template-columns: 1fr;
          }

          .dm-includes-side {
            position: relative;
            top: auto;
            min-height: auto;
          }

          .dm-includes-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .dm-includes {
            gap: 22px;
          }

          .dm-includes-side {
            padding: 24px;
            border-radius: 28px;
          }

          .dm-includes-side h2 {
            font-size: clamp(34px, 10vw, 48px);
          }

          .dm-include-proof {
            grid-template-columns: 34px 1fr;
            min-height: 66px;
            padding: 12px;
          }

          .dm-include-proof::before {
            width: 34px;
            height: 34px;
            border-radius: 13px;
          }

          .dm-includes-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .dm-include-card {
            min-height: auto;
            padding: 20px;
            border-radius: 24px;
          }

          .dm-include-card h3 {
            font-size: 20px;
          }
        }


        /* Task 10: connected ecosystem diagram polish */
        .dm-system {
          position: relative;
          padding: clamp(28px, 4vw, 46px);
          border-radius: 38px;
          background:
            radial-gradient(circle at 78% 20%, rgba(255, 216, 61, 0.18), transparent 21rem),
            radial-gradient(circle at 48% 60%, rgba(255, 216, 61, 0.1), transparent 18rem),
            linear-gradient(135deg, #151515, #050505);
          overflow: hidden;
        }

        .dm-system::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(circle at 72% 46%, black, transparent 72%);
          opacity: 0.56;
          pointer-events: none;
        }

        .dm-system::after {
          content: "";
          position: absolute;
          left: 36px;
          right: 36px;
          top: 0;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--dm-yellow), transparent);
          box-shadow: 0 0 30px rgba(255, 216, 61, 0.24);
        }

        .dm-system-grid {
          position: relative;
          z-index: 2;
          grid-template-columns: minmax(260px, 0.35fr) minmax(0, 1fr);
          gap: clamp(28px, 5vw, 56px);
        }

        .dm-system h2 {
          max-width: 390px;
          font-size: clamp(38px, 4vw, 58px);
          letter-spacing: -0.075em;
        }

        .dm-system p {
          max-width: 380px;
          color: rgba(255, 255, 255, 0.65);
        }

        .dm-system .dm-button-primary {
          margin-top: 10px;
        }

        .dm-system-flow {
          position: relative;
          display: grid;
          grid-template-columns: minmax(168px, 1fr) 178px minmax(168px, 1fr);
          grid-template-rows: minmax(120px, auto) 178px minmax(120px, auto);
          gap: 20px;
          align-items: center;
          min-height: 500px;
          padding: 18px;
          border-radius: 34px;
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 216, 61, 0.13), transparent 17rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.075),
            0 24px 80px rgba(0, 0, 0, 0.18);
          overflow: hidden;
        }

        .dm-system-flow::before {
          content: "";
          position: absolute;
          inset: 50% auto auto 50%;
          width: 390px;
          height: 390px;
          border-radius: 999px;
          border: 1px dashed rgba(255, 216, 61, 0.22);
          transform: translate(-50%, -50%);
          opacity: 0.72;
        }

        .dm-system-flow::after {
          content: "";
          position: absolute;
          inset: 50% auto auto 50%;
          width: 230px;
          height: 230px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 80px rgba(255, 216, 61, 0.08);
        }

        .dm-connector {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 1;
          width: 35%;
          height: 2px;
          border-radius: 999px;
          background:
            linear-gradient(90deg, rgba(255, 216, 61, 0), rgba(255, 216, 61, 0.62), rgba(255, 216, 61, 0));
          transform-origin: 0 50%;
          opacity: 0.8;
        }

        .dm-connector::after {
          content: "";
          position: absolute;
          right: 16%;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          transform: translateY(-50%);
          background: var(--dm-yellow);
          box-shadow:
            0 0 0 7px rgba(255, 216, 61, 0.08),
            0 0 24px rgba(255, 216, 61, 0.54);
        }

        .dm-connector-one {
          transform: rotate(-145deg);
        }

        .dm-connector-two {
          transform: rotate(-35deg);
        }

        .dm-connector-three {
          transform: rotate(145deg);
        }

        .dm-connector-four {
          transform: rotate(35deg);
        }

        .dm-core {
          position: relative;
          z-index: 3;
          grid-column: 2;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 178px;
          height: 178px;
          margin: 0 auto;
          border-radius: 999px;
          background:
            radial-gradient(circle at 36% 18%, rgba(255, 255, 255, 0.12), transparent 4rem),
            #0b0b0b;
          border: 1px solid rgba(255, 216, 61, 0.56);
          box-shadow:
            0 0 0 12px rgba(255, 216, 61, 0.055),
            0 0 0 28px rgba(255, 216, 61, 0.025),
            0 0 74px rgba(255, 216, 61, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .dm-core img {
          width: 72px;
          height: 72px;
        }

        .dm-core span {
          color: rgba(255, 255, 255, 0.82);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: -0.01em;
        }

        .dm-flow-node {
          position: relative;
          z-index: 4;
          min-height: 128px;
          padding: 18px;
          border-radius: 24px;
          color: #ffffff;
          background:
            radial-gradient(circle at 86% 8%, rgba(255, 216, 61, 0.12), transparent 8rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.046));
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 22px 58px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(18px);
        }

        .dm-flow-node::before {
          content: "";
          position: absolute;
          left: 18px;
          right: 18px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(255, 216, 61, 0.8), transparent);
        }

        .dm-flow-customer {
          grid-column: 1;
          grid-row: 1;
        }

        .dm-flow-retailer {
          grid-column: 3;
          grid-row: 1;
        }

        .dm-flow-driver {
          grid-column: 1;
          grid-row: 3;
        }

        .dm-flow-admin {
          grid-column: 3;
          grid-row: 3;
        }

        .dm-flow-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 14px;
          border-radius: 15px;
          color: #111111;
          background: var(--dm-yellow);
          box-shadow:
            0 15px 34px rgba(255, 216, 61, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .dm-flow-icon svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dm-flow-node strong {
          color: #ffffff;
          font-size: 16px;
          letter-spacing: -0.035em;
        }

        .dm-flow-node span {
          color: rgba(255, 255, 255, 0.62);
          margin-top: 7px;
          font-size: 12.5px;
          line-height: 1.45;
        }

        @media (max-width: 1020px) {
          .dm-system-grid {
            grid-template-columns: 1fr;
          }

          .dm-system-flow {
            min-height: 470px;
          }
        }

        @media (max-width: 720px) {
          .dm-system {
            border-radius: 30px;
          }

          .dm-system-flow {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: 12px;
            min-height: auto;
            padding: 16px;
            border-radius: 26px;
          }

          .dm-system-flow::before,
          .dm-system-flow::after,
          .dm-connector {
            display: none;
          }

          .dm-core,
          .dm-flow-customer,
          .dm-flow-retailer,
          .dm-flow-driver,
          .dm-flow-admin {
            grid-column: auto;
            grid-row: auto;
          }

          .dm-core {
            order: -1;
            width: 132px;
            height: 132px;
            margin: 4px auto 12px;
          }

          .dm-core img {
            width: 58px;
            height: 58px;
          }

          .dm-flow-node {
            display: grid;
            grid-template-columns: 42px 1fr;
            grid-template-rows: auto auto;
            column-gap: 12px;
            row-gap: 5px;
            min-height: auto;
            padding: 15px;
            border-radius: 20px;
          }

          .dm-flow-icon {
            grid-row: 1 / span 2;
            margin-bottom: 0;
          }

          .dm-flow-node strong,
          .dm-flow-node span {
            display: block;
          }

          .dm-flow-node span {
            margin-top: 0;
          }
        }


        /* Task 11: See Darik in action screenshot cards polish */
        #previews {
          position: relative;
        }

        #previews::before {
          content: "";
          position: absolute;
          inset: -30px calc(50% - 50vw);
          z-index: -1;
          background:
            radial-gradient(circle at 12% 10%, rgba(255, 216, 61, 0.12), transparent 22rem),
            radial-gradient(circle at 88% 52%, rgba(17, 17, 17, 0.06), transparent 28rem);
          pointer-events: none;
        }

        .dm-previews-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
          align-items: stretch;
        }

        .dm-preview-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 560px;
          border-radius: 34px;
          border-color: rgba(17, 17, 17, 0.1);
          background:
            radial-gradient(circle at 86% 10%, rgba(255, 216, 61, 0.16), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.78)),
            #ffffff;
          box-shadow:
            0 26px 76px rgba(0, 0, 0, 0.075),
            inset 0 1px 0 rgba(255, 255, 255, 0.82);
          transition:
            transform 200ms ease,
            box-shadow 200ms ease,
            border-color 200ms ease;
        }

        .dm-preview-card:nth-child(2) {
          background:
            radial-gradient(circle at 86% 10%, rgba(168, 85, 247, 0.14), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.78)),
            #ffffff;
        }

        .dm-preview-card:nth-child(3) {
          background:
            radial-gradient(circle at 86% 10%, rgba(245, 158, 11, 0.14), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.78)),
            #ffffff;
        }

        .dm-preview-card:nth-child(4) {
          background:
            radial-gradient(circle at 86% 10%, rgba(34, 197, 94, 0.14), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.78)),
            #ffffff;
        }

        .dm-preview-card::before {
          content: "";
          position: absolute;
          left: 24px;
          right: 24px;
          top: 0;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--dm-yellow), transparent);
          box-shadow: 0 0 24px rgba(255, 216, 61, 0.28);
        }

        .dm-preview-card::after {
          content: "";
          position: absolute;
          right: -90px;
          bottom: -90px;
          width: 210px;
          height: 210px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 216, 61, 0.12), transparent 68%);
          pointer-events: none;
        }

        .dm-preview-card:hover {
          transform: translateY(-7px);
          border-color: rgba(255, 216, 61, 0.28);
          box-shadow:
            0 36px 94px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(255, 216, 61, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.88);
        }

        .dm-preview-card-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 22px 22px 0;
        }

        .dm-preview-card-top span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          min-height: 30px;
          padding: 7px 10px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.68);
          background: rgba(255, 216, 61, 0.17);
          border: 1px solid rgba(255, 216, 61, 0.36);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .dm-preview-card-top span::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--dm-yellow);
          box-shadow: 0 0 0 5px rgba(255, 216, 61, 0.13);
        }

        .dm-preview-card-top strong {
          color: rgba(17, 17, 17, 0.16);
          font-size: 28px;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .dm-preview-phone {
          position: relative;
          min-height: 330px;
          padding: 24px 22px 0;
          background:
            radial-gradient(circle at 50% 16%, rgba(255, 216, 61, 0.14), transparent 12rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(245, 245, 241, 0.78));
          overflow: hidden;
        }

        .dm-preview-phone::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -54px;
          width: 220px;
          height: 82px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(17, 17, 17, 0.12);
          filter: blur(18px);
        }

        .dm-phone-screen {
          position: relative;
          z-index: 2;
          width: 196px;
          height: 292px;
          border-width: 10px;
          border-radius: 34px 34px 0 0;
          padding: 18px 13px 14px;
          background:
            radial-gradient(circle at 84% 8%, rgba(255, 216, 61, 0.14), transparent 7rem),
            #ffffff;
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.16),
            inset 0 0 0 1px rgba(17, 17, 17, 0.035);
        }

        .dm-phone-screen::before {
          content: "";
          position: absolute;
          top: -3px;
          left: 50%;
          width: 54px;
          height: 7px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.18);
        }

        .dm-screen-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          color: rgba(17, 17, 17, 0.54);
          font-size: 9px;
          font-weight: 950;
        }

        .dm-screen-status i {
          display: block;
          width: 22px;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(90deg, #111 0 38%, rgba(17, 17, 17, 0.18) 38%);
        }

        .dm-search-pill {
          height: 26px;
          margin-top: 10px;
          padding: 7px 10px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.36);
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 10px;
          font-weight: 850;
        }

        .dm-screen-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0 8px;
        }

        .dm-screen-title-row strong {
          margin: 0;
        }

        .dm-screen-title-row small {
          color: #0f4f7b;
          font-size: 9px;
          font-weight: 950;
        }

        .dm-category-dots {
          gap: 8px;
          margin: 12px 0 4px;
        }

        .dm-category-dots i {
          width: 27px;
          height: 27px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 44%, rgba(17, 17, 17, 0.12) 0 5px, transparent 6px),
            #f2f2ee;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.055);
        }

        .dm-category-dots i.active,
        .dm-category-dots i:first-child {
          background:
            radial-gradient(circle at 50% 44%, #111 0 5px, transparent 6px),
            var(--dm-yellow);
        }

        .dm-product-grid {
          gap: 8px;
        }

        .dm-product-grid div {
          position: relative;
          height: 67px;
          background:
            linear-gradient(135deg, #d7e3ef 0%, #ffffff 46%, #f3c6d9 100%);
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.04);
          overflow: hidden;
        }

        .dm-product-grid div span {
          position: absolute;
          left: 8px;
          right: 8px;
          bottom: 8px;
          height: 7px;
          border-radius: 999px;
          background: #0f4f7b;
        }

        .dm-bottom-nav {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 11px;
          display: flex;
          justify-content: space-around;
          padding: 8px;
          border-radius: 16px;
          background: rgba(244, 244, 239, 0.94);
          border: 1px solid rgba(17, 17, 17, 0.05);
        }

        .dm-bottom-nav i {
          width: 13px;
          height: 13px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.18);
        }

        .dm-bottom-nav i:first-child {
          background: #111;
        }

        .dm-support-screen {
          background:
            radial-gradient(circle at 80% 0%, rgba(168, 85, 247, 0.13), transparent 7rem),
            #ffffff;
        }

        .dm-support-screen strong,
        .dm-retailer-screen strong,
        .dm-driver-screen strong {
          margin: 4px 0 10px;
          font-size: 18px;
          line-height: 1;
        }

        .dm-support-screen button {
          width: 100%;
          height: 30px;
          margin-bottom: 12px;
          border: 0;
          border-radius: 999px;
          color: #111;
          background: var(--dm-yellow);
          font-size: 10px;
          font-weight: 950;
        }

        .dm-support-choice {
          margin-top: 9px;
          padding: 10px;
          border-radius: 13px;
          font-size: 10.5px;
          box-shadow: 0 7px 18px rgba(0, 0, 0, 0.035);
        }

        .dm-chat-strip {
          display: flex;
          gap: 7px;
          margin-top: 12px;
        }

        .dm-chat-strip i {
          height: 22px;
          flex: 1;
          border-radius: 999px;
          background: #f3f3ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
        }

        .dm-retailer-screen {
          background:
            radial-gradient(circle at 80% 0%, rgba(245, 158, 11, 0.14), transparent 7rem),
            #ffffff;
        }

        .dm-form-line,
        .dm-form-box {
          height: 31px;
          margin-top: 10px;
          border-radius: 12px;
        }

        .dm-chip-row i {
          height: 26px;
        }

        .dm-submit-line {
          height: 30px;
          margin-top: 11px;
          border-radius: 999px;
          background: #111;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .dm-driver-screen {
          background:
            radial-gradient(circle at 80% 0%, rgba(34, 197, 94, 0.14), transparent 7rem),
            #ffffff;
        }

        .dm-driver-progress {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin: 10px 0 12px;
        }

        .dm-driver-progress span {
          height: 7px;
          border-radius: 999px;
          background: #bbf7d0;
        }

        .dm-driver-progress span:nth-child(3) {
          background: #f3f3ef;
        }

        .dm-stop-card {
          padding: 12px;
          border-radius: 17px;
          background:
            linear-gradient(180deg, #ffffff, #f6f6f2);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.045);
        }

        .dm-driver-buttons i {
          height: 27px;
          border-radius: 10px;
        }

        .dm-delivered-line {
          height: 30px;
          margin-top: 9px;
          border-radius: 999px;
          background: #22c55e;
        }

        .dm-preview-content {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 22px;
        }

        .dm-preview-stat {
          display: inline-flex;
          width: fit-content;
          margin-bottom: 12px;
          padding: 7px 10px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.7);
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.07);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dm-preview-content h3 {
          margin-bottom: 10px;
          font-size: 24px;
          line-height: 0.95;
          letter-spacing: -0.06em;
        }

        .dm-preview-content p {
          color: rgba(17, 17, 17, 0.62);
          font-size: 13.5px;
          line-height: 1.55;
        }

        @media (max-width: 1180px) {
          .dm-previews-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .dm-preview-card {
            min-height: 530px;
          }
        }

        @media (max-width: 720px) {
          .dm-previews-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .dm-preview-card {
            min-height: auto;
            border-radius: 28px;
          }

          .dm-preview-phone {
            min-height: 315px;
          }

          .dm-phone-screen {
            width: 190px;
            height: 282px;
          }

          .dm-preview-card-top {
            padding: 20px 20px 0;
          }

          .dm-preview-content {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .dm-preview-phone {
            min-height: 300px;
            padding-top: 20px;
          }

          .dm-phone-screen {
            width: 180px;
            height: 270px;
            border-width: 9px;
          }

          .dm-preview-content h3 {
            font-size: 22px;
          }
        }


        /* Task 12: final CTA and footer polish */
        .dm-final {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          margin: 44px auto 24px;
          padding: clamp(26px, 4vw, 46px);
          border-radius: 40px;
          color: #ffffff;
          background:
            radial-gradient(circle at 86% 8%, rgba(255, 216, 61, 0.28), transparent 18rem),
            radial-gradient(circle at 12% 84%, rgba(255, 216, 61, 0.1), transparent 18rem),
            linear-gradient(135deg, #171717 0%, #070707 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 34px 100px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .dm-final::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.038) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.038) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(circle at 82% 28%, black, transparent 72%);
          opacity: 0.58;
        }

        .dm-final::after {
          content: "";
          position: absolute;
          left: 38px;
          right: 38px;
          top: 0;
          height: 3px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, var(--dm-yellow), transparent);
          box-shadow: 0 0 34px rgba(255, 216, 61, 0.34);
        }

        .dm-final-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(220px, 0.36fr) minmax(0, 1fr) auto;
          gap: clamp(24px, 4vw, 46px);
          align-items: center;
        }

        .dm-final-brand-card {
          display: grid;
          gap: 18px;
          align-content: center;
          min-height: 270px;
          padding: 24px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 34% 4%, rgba(255, 216, 61, 0.16), transparent 11rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.036));
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 22px 62px rgba(0, 0, 0, 0.2);
        }

        .dm-final-logo {
          display: grid;
          place-items: center;
          width: 74px;
          height: 74px;
          border-radius: 25px;
          background: #050505;
          border: 1px solid rgba(255, 216, 61, 0.34);
          box-shadow:
            0 20px 52px rgba(255, 216, 61, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .dm-final-logo img {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .dm-final-brand-card strong {
          display: block;
          color: #ffffff;
          font-size: 19px;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .dm-final-brand-card span:not(.dm-final-logo) {
          display: block;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.56);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.35;
        }

        .dm-final-copy {
          min-width: 0;
        }

        .dm-final-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin-bottom: 18px;
          padding: 8px 11px;
          border-radius: 999px;
          color: #fff0a1;
          background: rgba(255, 216, 61, 0.12);
          border: 1px solid rgba(255, 216, 61, 0.26);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dm-final-eyebrow::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--dm-yellow);
          box-shadow: 0 0 0 6px rgba(255, 216, 61, 0.1), 0 0 22px rgba(255, 216, 61, 0.44);
        }

        .dm-final h2 {
          max-width: 740px;
          font-size: clamp(42px, 5.6vw, 74px);
          line-height: 0.9;
          letter-spacing: -0.085em;
        }

        .dm-final p {
          max-width: 680px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 16px;
          line-height: 1.68;
        }

        .dm-final-points {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        .dm-final-points span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 8px 11px;
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.76);
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 12px;
          font-weight: 850;
        }

        .dm-final-points span::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--dm-yellow);
          box-shadow: 0 0 18px rgba(255, 216, 61, 0.44);
        }

        .dm-final-actions {
          display: grid;
          justify-items: end;
          gap: 14px;
        }

        .dm-final-actions .dm-button {
          white-space: nowrap;
          min-height: 58px;
          padding: 0 22px;
        }

        .dm-final-back {
          display: inline-flex;
          color: rgba(255, 255, 255, 0.62);
          font-size: 13px;
          font-weight: 850;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .dm-final-back:hover {
          color: #ffffff;
        }

        .dm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 40px;
          padding: 18px 4px;
          color: rgba(17, 17, 17, 0.54);
          font-size: 13px;
          font-weight: 850;
        }

        .dm-footer a {
          color: rgba(17, 17, 17, 0.76);
          text-decoration: none;
          transition: color 160ms ease;
        }

        .dm-footer a:hover {
          color: #111111;
        }

        @media (max-width: 1080px) {
          .dm-final-grid {
            grid-template-columns: 1fr;
          }

          .dm-final-brand-card {
            min-height: auto;
            grid-template-columns: 74px 1fr;
            align-items: center;
          }

          .dm-final-actions {
            justify-items: start;
          }
        }

        @media (max-width: 720px) {
          .dm-final {
            margin-top: 28px;
            border-radius: 30px;
            padding: 24px;
          }

          .dm-final-grid {
            gap: 24px;
          }

          .dm-final-brand-card {
            grid-template-columns: 58px 1fr;
            gap: 14px;
            padding: 16px;
            border-radius: 24px;
          }

          .dm-final-logo {
            width: 58px;
            height: 58px;
            border-radius: 20px;
          }

          .dm-final-logo img {
            width: 42px;
            height: 42px;
          }

          .dm-final h2 {
            font-size: clamp(40px, 12vw, 56px);
          }

          .dm-final-actions {
            width: 100%;
          }

          .dm-final-actions .dm-button {
            width: 100%;
          }

          .dm-final-back {
            width: 100%;
            justify-content: center;
          }

          .dm-footer {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 28px;
          }
        }


        /* Task 13: final mobile polish + back/navigation cleanup */
        .dm-mobile-route-bar,
        .dm-hero-back-link {
          display: none;
        }

        .dm-desktop-back-link {
          color: rgba(255, 255, 255, 0.82) !important;
        }

        .dm-hero-back-link {
          width: fit-content;
          margin-bottom: 18px;
          color: rgba(17, 17, 17, 0.58);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          transition: color 160ms ease, transform 160ms ease;
        }

        .dm-hero-back-link:hover {
          color: #111111;
          transform: translateX(-3px);
        }

        @media (min-width: 721px) {
          .dm-hero-back-link {
            display: inline-flex;
          }
        }

        @media (max-width: 720px) {
          .dm-page {
            scroll-padding-top: 126px;
          }

          .dm-nav {
            position: sticky;
            top: 0;
            z-index: 50;
          }

          .dm-nav-inner {
            gap: 12px;
          }

          .dm-logo {
            width: 44px;
            height: 44px;
            border-radius: 15px;
          }

          .dm-logo img {
            width: 32px;
            height: 32px;
          }

          .dm-brand strong {
            max-width: 132px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
          }

          .dm-nav-cta {
            white-space: nowrap;
            min-height: 40px;
            padding: 0 12px;
            border-radius: 999px;
            font-size: 0;
          }

          .dm-nav-cta::before {
            content: "Quote →";
            font-size: 12px;
            font-weight: 950;
          }

          .dm-mobile-route-bar {
            position: sticky;
            top: 72px;
            z-index: 45;
            display: block;
            background: rgba(247, 247, 244, 0.88);
            border-bottom: 1px solid rgba(17, 17, 17, 0.08);
            backdrop-filter: blur(18px);
          }

          .dm-mobile-route-scroll {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-top: 10px;
            padding-bottom: 10px;
            scrollbar-width: none;
          }

          .dm-mobile-route-scroll::-webkit-scrollbar {
            display: none;
          }

          .dm-mobile-route-scroll a {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            min-height: 36px;
            padding: 0 12px;
            border-radius: 999px;
            color: rgba(17, 17, 17, 0.72);
            background: rgba(255, 255, 255, 0.76);
            border: 1px solid rgba(17, 17, 17, 0.08);
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.045);
            text-decoration: none;
            font-size: 12px;
            font-weight: 900;
          }

          .dm-mobile-route-scroll a:first-child {
            color: #111111;
            background: var(--dm-yellow);
            border-color: rgba(255, 216, 61, 0.7);
            box-shadow: 0 14px 30px rgba(255, 216, 61, 0.18);
          }

          .dm-hero {
            padding-top: 34px;
          }

          .dm-eyebrow {
            font-size: 10px;
          }

          .dm-hero-copy,
          .dm-section-head p,
          .dm-preview-content p,
          .dm-module-card p,
          .dm-include-card p {
            font-size: 14px;
          }

          .dm-section-head h2 {
            font-size: clamp(36px, 11vw, 52px);
          }

          .dm-actions .dm-button {
            width: 100%;
          }

          .dm-hero-badges {
            gap: 9px;
          }

          .dm-section {
            padding: 42px 0;
          }

          .dm-system .dm-button-primary {
            width: 100%;
          }

          .dm-footer {
            padding-bottom: 10px;
          }
        }

        @media (max-width: 430px) {
          .dm-shell {
            width: min(100% - 22px, 1180px);
          }

          .dm-brand strong {
            max-width: 118px;
          }

          .dm-nav-cta::before {
            content: "Quote";
          }

          .dm-mobile-route-scroll {
            gap: 7px;
          }

          .dm-mobile-route-scroll a {
            min-height: 34px;
            padding: 0 11px;
            font-size: 11.5px;
          }

          .dm-hero h1 {
            font-size: clamp(46px, 14vw, 64px);
          }

          .dm-hero-lede {
            font-size: 19px;
          }

          .dm-button {
            min-height: 52px;
          }
        }


        /* Task 14: source-backed Darik app content from uploaded code */
        .dm-source-backed-note {
          display: none;
        }

        .dm-customer-delivery-strip {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 48px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2px;
          padding: 9px 10px;
          border-radius: 15px;
          background:
            linear-gradient(180deg, rgba(255, 216, 61, 0.22), rgba(255, 216, 61, 0.1)),
            #fffaf0;
          border: 1px solid rgba(255, 216, 61, 0.42);
        }

        .dm-customer-delivery-strip b {
          color: #111111;
          font-size: 10px;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .dm-customer-delivery-strip span {
          color: rgba(17, 17, 17, 0.55);
          font-size: 9px;
          font-weight: 850;
        }

        .dm-retailer-metric-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-bottom: 12px;
        }

        .dm-retailer-metric-row div {
          min-height: 47px;
          padding: 8px;
          border-radius: 13px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
        }

        .dm-retailer-metric-row div:nth-child(2) {
          background: #f4f4ef;
          border-color: rgba(17, 17, 17, 0.06);
        }

        .dm-retailer-metric-row b,
        .dm-retailer-metric-row span {
          display: block;
        }

        .dm-retailer-metric-row b {
          color: #111111;
          font-size: 10px;
          line-height: 1.05;
        }

        .dm-retailer-metric-row span {
          margin-top: 4px;
          color: rgba(17, 17, 17, 0.52);
          font-size: 8.5px;
          font-weight: 850;
        }

        .dm-admin-screen {
          background:
            radial-gradient(circle at 80% 0%, rgba(255, 216, 61, 0.13), transparent 7rem),
            #ffffff;
        }

        .dm-admin-screen strong {
          display: block;
          margin: 4px 0 10px;
          font-size: 13px;
          line-height: 1.05;
          letter-spacing: -0.035em;
        }

        .dm-admin-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 7px;
          margin-bottom: 10px;
        }

        .dm-admin-tabs span {
          min-height: 25px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #111111;
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 8.5px;
          font-weight: 950;
        }

        .dm-admin-tabs span:first-child {
          background: #111111;
          color: var(--dm-yellow);
        }

        .dm-admin-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .dm-admin-stats div {
          min-height: 45px;
          padding: 8px;
          border-radius: 13px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
        }

        .dm-admin-stats div:nth-child(2) {
          background: #f4f4ef;
          border-color: rgba(17, 17, 17, 0.06);
        }

        .dm-admin-stats b,
        .dm-admin-stats span {
          display: block;
        }

        .dm-admin-stats b {
          font-size: 17px;
          line-height: 1;
        }

        .dm-admin-stats span {
          margin-top: 4px;
          color: rgba(17, 17, 17, 0.56);
          font-size: 8.5px;
          font-weight: 900;
        }

        .dm-admin-list {
          display: grid;
          gap: 7px;
        }

        .dm-admin-list i {
          height: 22px;
          border-radius: 10px;
          background:
            linear-gradient(90deg, rgba(17,17,17,0.12) 0 58%, rgba(34,197,94,0.28) 58% 80%, rgba(17,17,17,0.08) 80%);
        }

        .dm-admin-bottom {
          height: 28px;
          margin-top: 10px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #ffffff;
          background: #111111;
          font-size: 9px;
          font-weight: 950;
        }

        .dm-preview-card:nth-child(4) {
          background:
            radial-gradient(circle at 86% 10%, rgba(17, 17, 17, 0.1), transparent 12rem),
            radial-gradient(circle at 18% 88%, rgba(255, 216, 61, 0.14), transparent 13rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.78)),
            #ffffff;
        }

        .dm-preview-card:nth-child(4)::before {
          background: linear-gradient(90deg, transparent, #111111, var(--dm-yellow), transparent);
        }

        @media (max-width: 720px) {
          .dm-customer-delivery-strip {
            bottom: 46px;
          }
        }


        /* Task 15: real Darik hero laptop/phone preview */
        .dm-hero-real-stage {
          min-height: 560px;
        }

        .dm-real-admin-laptop {
          inset: 20px 0 34px 66px;
          padding: 15px 15px 23px;
        }

        .dm-real-admin-screen {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background:
            radial-gradient(circle at 88% 12%, rgba(255, 216, 61, 0.16), transparent 13rem),
            linear-gradient(180deg, #ffffff, #f7f7f3);
        }

        .dm-real-admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-bottom: 11px;
          border-bottom: 1px solid rgba(17, 17, 17, 0.08);
        }

        .dm-real-admin-header span {
          display: block;
          margin-bottom: 5px;
          color: rgba(17, 17, 17, 0.46);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dm-real-admin-header strong {
          display: block;
          color: #111111;
          font-size: 19px;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .dm-admin-tab-strip {
          display: flex;
          gap: 7px;
          overflow: hidden;
          padding: 2px 0 1px;
        }

        .dm-admin-tab-strip span {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.56);
          background: #f1f1ed;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 9px;
          font-weight: 950;
          white-space: nowrap;
        }

        .dm-admin-tab-strip .active {
          color: #111111;
          background: var(--dm-yellow);
          border-color: rgba(255, 216, 61, 0.68);
          box-shadow: 0 10px 22px rgba(255, 216, 61, 0.14);
        }

        .dm-real-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
        }

        .dm-real-kpi {
          min-height: 76px;
          padding: 11px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.08);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.035);
        }

        .dm-real-kpi span,
        .dm-real-kpi small {
          display: block;
          color: rgba(17, 17, 17, 0.52);
          font-size: 8.5px;
          font-weight: 900;
          line-height: 1.2;
        }

        .dm-real-kpi strong {
          display: block;
          margin: 6px 0 4px;
          color: #111111;
          font-size: 19px;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .dm-real-kpi:nth-child(1) {
          background: #111111;
        }

        .dm-real-kpi:nth-child(1) span,
        .dm-real-kpi:nth-child(1) small {
          color: rgba(255, 255, 255, 0.58);
        }

        .dm-real-kpi:nth-child(1) strong {
          color: var(--dm-yellow);
        }

        .dm-real-kpi:nth-child(2),
        .dm-real-kpi:nth-child(4) {
          background: #fff7d6;
          border-color: rgba(255, 216, 61, 0.46);
        }

        .dm-real-admin-grid {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 11px;
          min-height: 168px;
        }

        .dm-real-route-panel,
        .dm-real-map-panel {
          position: relative;
          overflow: hidden;
          padding: 13px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.08);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.035);
        }

        .dm-real-panel-title {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 11px;
        }

        .dm-real-panel-title strong {
          color: #111111;
          font-size: 12px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .dm-real-panel-title span {
          color: rgba(17, 17, 17, 0.44);
          font-size: 8px;
          font-weight: 900;
          text-align: right;
        }

        .dm-real-route-progress {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 5px;
          margin-bottom: 10px;
        }

        .dm-real-route-progress i {
          height: 7px;
          border-radius: 999px;
          background: var(--dm-yellow);
        }

        .dm-real-route-progress i:nth-child(3) {
          background: #e5e5df;
        }

        .dm-real-order-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 30px;
          padding: 7px 8px;
          margin-top: 7px;
          border-radius: 11px;
          background: #f5f5f1;
        }

        .dm-real-order-line b {
          color: #111111;
          font-size: 9.5px;
        }

        .dm-real-order-line span {
          color: rgba(17, 17, 17, 0.5);
          font-size: 8.5px;
          font-weight: 850;
        }

        .dm-real-map {
          position: absolute;
          left: 13px;
          right: 13px;
          top: 48px;
          bottom: 13px;
          border-radius: 16px;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(17, 17, 17, 0.055) 1px, transparent 1px),
            linear-gradient(rgba(17, 17, 17, 0.055) 1px, transparent 1px),
            #f8f8f4;
          background-size: 19px 19px;
        }

        .dm-real-map .route {
          position: absolute;
          height: 7px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.09);
          transform-origin: center;
        }

        .dm-real-map .route-one {
          left: -8px;
          right: 20px;
          top: 42px;
          transform: rotate(-20deg);
        }

        .dm-real-map .route-two {
          left: 60px;
          right: -12px;
          bottom: 30px;
          transform: rotate(24deg);
        }

        .dm-real-map .pin {
          position: absolute;
          z-index: 3;
          width: 15px;
          height: 15px;
          border-radius: 999px 999px 999px 2px;
          transform: rotate(-45deg);
          background: #ef4444;
          box-shadow: 0 0 0 7px rgba(239, 68, 68, 0.11), 0 10px 24px rgba(239, 68, 68, 0.22);
        }

        .dm-real-map .pin-one { left: 32%; top: 38%; }
        .dm-real-map .pin-two { right: 25%; top: 24%; background: #22c55e; box-shadow: 0 0 0 7px rgba(34, 197, 94, 0.12), 0 10px 24px rgba(34, 197, 94, 0.2); }
        .dm-real-map .pin-three { left: 54%; bottom: 18%; background: var(--dm-yellow); box-shadow: 0 0 0 7px rgba(255, 216, 61, 0.15), 0 10px 24px rgba(255, 216, 61, 0.2); }

        .dm-real-admin-bottom-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .dm-real-admin-bottom-row span {
          display: grid;
          place-items: center;
          min-height: 28px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.62);
          background: #f1f1ed;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 8.5px;
          font-weight: 950;
        }

        .dm-real-customer-phone {
          left: -2px;
          bottom: 24px;
          width: 218px;
          height: 410px;
        }

        .dm-real-customer-screen {
          position: relative;
          padding: 24px 13px 13px;
          background:
            radial-gradient(circle at 84% 0%, rgba(255, 216, 61, 0.15), transparent 8rem),
            #ffffff;
        }

        .dm-real-phone-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(17, 17, 17, 0.48);
          font-size: 9px;
          font-weight: 950;
          margin-bottom: 10px;
        }

        .dm-real-phone-status i {
          width: 24px;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(90deg, #111 0 45%, rgba(17, 17, 17, 0.18) 45%);
        }

        .dm-real-customer-top,
        .dm-real-screen-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dm-real-customer-top strong {
          color: #111111;
          font-size: 18px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .dm-real-customer-top span {
          display: grid;
          place-items: center;
          min-width: 39px;
          height: 25px;
          border-radius: 999px;
          color: #111111;
          background: var(--dm-yellow);
          font-size: 9px;
          font-weight: 950;
        }

        .dm-real-location-card {
          margin-top: 13px;
          padding: 10px;
          border-radius: 16px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.48);
        }

        .dm-real-location-card small,
        .dm-real-location-card b {
          display: block;
        }

        .dm-real-location-card small {
          color: rgba(17, 17, 17, 0.5);
          font-size: 8.5px;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .dm-real-location-card b {
          margin-top: 4px;
          color: #111111;
          font-size: 10.5px;
          line-height: 1.15;
        }

        .dm-real-category-row {
          display: flex;
          gap: 8px;
          margin: 13px 0;
        }

        .dm-real-category-row i {
          width: 31px;
          height: 31px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 45%, rgba(17, 17, 17, 0.12) 0 6px, transparent 7px),
            #f1f1ed;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.05);
        }

        .dm-real-category-row .active {
          background:
            radial-gradient(circle at 50% 45%, #111 0 6px, transparent 7px),
            var(--dm-yellow);
        }

        .dm-real-screen-title strong {
          color: #111111;
          font-size: 16px;
          letter-spacing: -0.04em;
        }

        .dm-real-screen-title span {
          color: #0f4f7b;
          font-size: 9px;
          font-weight: 950;
        }

        .dm-real-products {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 9px;
        }

        .dm-real-products div {
          height: 78px;
          border-radius: 15px;
          padding: 7px;
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.05);
        }

        .dm-real-products i {
          display: block;
          height: 47px;
          border-radius: 11px;
          background: linear-gradient(135deg, #d7e3ef, #ffffff, #f3c6d9);
        }

        .dm-real-products b {
          display: block;
          width: 72%;
          height: 7px;
          margin-top: 7px;
          border-radius: 999px;
          background: #0f4f7b;
        }

        .dm-real-delivery-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .dm-real-delivery-options div {
          min-height: 48px;
          padding: 9px;
          border-radius: 14px;
          background: #111111;
        }

        .dm-real-delivery-options div:nth-child(2) {
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.48);
        }

        .dm-real-delivery-options b,
        .dm-real-delivery-options span {
          display: block;
        }

        .dm-real-delivery-options b {
          color: var(--dm-yellow);
          font-size: 9px;
          line-height: 1.05;
        }

        .dm-real-delivery-options span {
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 8.5px;
          font-weight: 850;
        }

        .dm-real-delivery-options div:nth-child(2) b {
          color: #111111;
        }

        .dm-real-delivery-options div:nth-child(2) span {
          color: rgba(17, 17, 17, 0.55);
        }

        .dm-real-promise {
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 13px;
          display: grid;
          place-items: center;
          min-height: 31px;
          border-radius: 999px;
          color: #111111;
          background: #f1f1ed;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 8.5px;
          font-weight: 950;
        }

        .dm-hero-float {
          position: absolute;
          z-index: 6;
          width: 210px;
          padding: 14px;
          border-radius: 22px;
          color: #111111;
          background:
            radial-gradient(circle at 86% 0%, rgba(255, 216, 61, 0.2), transparent 8rem),
            rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(17, 17, 17, 0.08);
          box-shadow:
            0 22px 58px rgba(0, 0, 0, 0.13),
            inset 0 1px 0 rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(18px);
        }

        .dm-hero-float span {
          display: inline-flex;
          min-height: 24px;
          align-items: center;
          padding: 0 8px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.62);
          background: #f1f1ed;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .dm-hero-float strong {
          display: block;
          margin-top: 10px;
          color: #111111;
          font-size: 16px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .dm-hero-float small {
          display: block;
          margin-top: 6px;
          color: rgba(17, 17, 17, 0.56);
          font-size: 10.5px;
          line-height: 1.25;
          font-weight: 800;
        }

        .dm-hero-float-retailer {
          right: 10px;
          top: 8px;
        }

        .dm-hero-float-driver {
          right: 34px;
          bottom: 0;
        }

        @media (max-width: 1020px) {
          .dm-hero-real-stage {
            min-height: 610px;
          }

          .dm-real-admin-laptop {
            inset: 10px 0 110px 74px;
          }

          .dm-hero-float-retailer {
            right: 0;
            top: 18px;
          }

          .dm-hero-float-driver {
            right: 14px;
            bottom: 20px;
          }
        }

        @media (max-width: 720px) {
          .dm-hero-real-stage {
            min-height: 640px;
          }

          .dm-real-admin-laptop {
            inset: 0 0 auto 0;
            height: 348px;
            transform: none;
          }

          .dm-real-admin-screen {
            gap: 9px;
            padding: 13px;
          }

          .dm-real-admin-header strong {
            font-size: 15px;
          }

          .dm-admin-tab-strip {
            gap: 5px;
          }

          .dm-admin-tab-strip span {
            min-height: 23px;
            padding: 0 7px;
            font-size: 7.5px;
          }

          .dm-real-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 7px;
          }

          .dm-real-kpi {
            min-height: 58px;
            padding: 9px;
          }

          .dm-real-kpi strong {
            font-size: 15px;
          }

          .dm-real-admin-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .dm-real-map-panel {
            display: none;
          }

          .dm-real-route-panel {
            min-height: 112px;
          }

          .dm-real-admin-bottom-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }

          .dm-real-customer-phone {
            left: 12px;
            bottom: 0;
            width: 200px;
            height: 378px;
          }

          .dm-real-products div {
            height: 64px;
          }

          .dm-real-products i {
            height: 37px;
          }

          .dm-real-delivery-options div {
            min-height: 43px;
          }

          .dm-hero-float {
            width: 180px;
            padding: 12px;
            border-radius: 19px;
          }

          .dm-hero-float-retailer {
            right: 0;
            top: 358px;
          }

          .dm-hero-float-driver {
            right: 0;
            bottom: 22px;
          }
        }

        @media (max-width: 480px) {
          .dm-hero-real-stage {
            min-height: 618px;
          }

          .dm-real-admin-laptop {
            height: 330px;
          }

          .dm-real-admin-bottom-row {
            display: none;
          }

          .dm-real-customer-phone {
            width: 184px;
            height: 348px;
          }

          .dm-real-customer-screen {
            padding-left: 11px;
            padding-right: 11px;
          }

          .dm-real-location-card,
          .dm-real-promise {
            left: 11px;
            right: 11px;
          }

          .dm-real-category-row i {
            width: 28px;
            height: 28px;
          }

          .dm-real-delivery-options {
            gap: 6px;
          }

          .dm-hero-float {
            width: 166px;
          }

          .dm-hero-float strong {
            font-size: 14px;
          }

          .dm-hero-float small {
            font-size: 9.5px;
          }
        }


        /* Task 16: source-backed module preview screens */
        .dm-module-preview {
          position: relative;
          z-index: 2;
          order: -1;
          height: 214px;
          margin: 0 0 18px;
          padding: 10px;
          border-radius: 32px 32px 8px 8px;
          background:
            linear-gradient(180deg, #191919, #050505);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          overflow: hidden;
        }

        .dm-module-preview::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 8px;
          width: 54px;
          height: 7px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.14);
          z-index: 4;
        }

        .dm-module-screen {
          position: relative;
          height: 100%;
          padding: 24px 12px 12px;
          border-radius: 24px 24px 4px 4px;
          background:
            radial-gradient(circle at 86% 4%, rgba(var(--module-rgb), 0.16), transparent 8rem),
            #ffffff;
          overflow: hidden;
        }

        .dm-module-screen-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .dm-module-screen-top strong {
          color: #111111;
          font-size: 13px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .dm-module-screen-top span {
          display: inline-flex;
          align-items: center;
          min-height: 23px;
          padding: 0 8px;
          border-radius: 999px;
          color: #111111;
          background: var(--module-accent);
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .dm-module-card:nth-child(2) .dm-module-screen-top span {
          color: #ffffff;
        }

        .dm-module-search {
          min-height: 28px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.48);
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 9px;
          font-weight: 900;
        }

        .dm-module-cats {
          display: flex;
          gap: 7px;
          margin: 10px 0;
        }

        .dm-module-cats i {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 45%, rgba(17,17,17,0.12) 0 5px, transparent 6px),
            #f1f1ed;
        }

        .dm-module-cats .active {
          background:
            radial-gradient(circle at 50% 45%, #111 0 5px, transparent 6px),
            var(--module-accent);
        }

        .dm-module-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .dm-module-title-row b {
          color: #111111;
          font-size: 12px;
          letter-spacing: -0.03em;
        }

        .dm-module-title-row small {
          color: #0f4f7b;
          font-size: 8px;
          font-weight: 950;
        }

        .dm-module-products {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .dm-module-products i {
          height: 48px;
          border-radius: 13px;
          background:
            linear-gradient(135deg, #d7e3ef, #ffffff, #f3c6d9);
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.04);
        }

        .dm-module-delivery-row {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .dm-module-delivery-row span {
          display: grid;
          place-items: center;
          min-height: 27px;
          border-radius: 999px;
          color: #111111;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-retailer-metric-row,
        .dm-module-retailer-stats,
        .dm-module-admin-kpis {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-bottom: 9px;
        }

        .dm-module-retailer-stats i,
        .dm-module-admin-kpis div {
          height: 46px;
          border-radius: 14px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
        }

        .dm-module-retailer-stats i:nth-child(2),
        .dm-module-admin-kpis div:nth-child(2) {
          background: #f4f4ef;
          border-color: rgba(17, 17, 17, 0.06);
        }

        .dm-module-form-stack {
          display: grid;
          gap: 7px;
        }

        .dm-module-form-stack i {
          height: 25px;
          border-radius: 10px;
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
        }

        .dm-module-form-stack i:nth-child(2) {
          width: 76%;
        }

        .dm-module-photo-lock,
        .dm-module-submit,
        .dm-module-delivered,
        .dm-module-profit {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          display: grid;
          place-items: center;
          min-height: 28px;
          border-radius: 999px;
          color: #111111;
          background: var(--module-accent);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-module-submit {
          color: #ffffff;
          background: #111111;
        }

        .dm-module-photo-lock {
          bottom: 48px;
          color: rgba(17, 17, 17, 0.64);
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
        }

        .dm-module-driver-status {
          padding: 10px;
          border-radius: 15px;
          background: #f0fdf4;
          border: 1px solid rgba(34, 197, 94, 0.22);
        }

        .dm-module-driver-status b,
        .dm-module-driver-status small {
          display: block;
        }

        .dm-module-driver-status b {
          color: #111111;
          font-size: 11px;
        }

        .dm-module-driver-status small {
          margin-top: 4px;
          color: rgba(17, 17, 17, 0.52);
          font-size: 8px;
          font-weight: 900;
        }

        .dm-module-stop {
          margin-top: 8px;
          padding: 10px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.07);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.035);
        }

        .dm-module-stop span,
        .dm-module-stop b {
          display: block;
        }

        .dm-module-stop span {
          color: rgba(17, 17, 17, 0.48);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-module-stop b {
          margin-top: 5px;
          color: #111111;
          font-size: 10px;
        }

        .dm-module-driver-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 8px;
        }

        .dm-module-driver-actions i {
          height: 24px;
          border-radius: 10px;
          background: #111111;
        }

        .dm-module-driver-actions i:nth-child(2) {
          background: var(--module-accent);
        }

        .dm-module-delivered {
          color: #ffffff;
          background: #22c55e;
        }

        .dm-module-admin-screen .dm-module-screen-top span {
          color: #ffffff;
          background: #111111;
        }

        .dm-module-admin-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          margin-bottom: 8px;
        }

        .dm-module-admin-tabs i {
          height: 22px;
          border-radius: 9px;
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
        }

        .dm-module-admin-tabs i:first-child {
          background: #111111;
        }

        .dm-module-admin-kpis {
          grid-template-columns: repeat(3, 1fr);
        }

        .dm-module-admin-kpis div {
          height: 44px;
        }

        .dm-module-admin-lines {
          display: grid;
          gap: 7px;
        }

        .dm-module-admin-lines i {
          height: 21px;
          border-radius: 9px;
          background:
            linear-gradient(90deg, rgba(17,17,17,0.1) 0 58%, rgba(34,197,94,0.28) 58% 78%, rgba(17,17,17,0.06) 78%);
        }

        .dm-module-map {
          position: absolute;
          left: 12px;
          right: 12px;
          top: 58px;
          bottom: 50px;
          border-radius: 17px;
          background:
            linear-gradient(90deg, rgba(17,17,17,0.055) 1px, transparent 1px),
            linear-gradient(rgba(17,17,17,0.055) 1px, transparent 1px),
            #ffffff;
          background-size: 17px 17px;
          border: 1px solid rgba(17, 17, 17, 0.06);
          overflow: hidden;
        }

        .dm-module-map .road {
          position: absolute;
          height: 7px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.09);
        }

        .dm-module-map .road-one {
          left: -8px;
          right: 16px;
          top: 36px;
          transform: rotate(-22deg);
        }

        .dm-module-map .road-two {
          left: 42px;
          right: -16px;
          bottom: 26px;
          transform: rotate(24deg);
        }

        .dm-module-map .pin {
          position: absolute;
          z-index: 2;
          width: 14px;
          height: 14px;
          border-radius: 999px 999px 999px 2px;
          transform: rotate(-45deg);
          background: #ef4444;
          box-shadow: 0 0 0 7px rgba(239,68,68,0.11);
        }

        .dm-module-map .one { left: 29%; top: 36%; }
        .dm-module-map .two { right: 24%; top: 24%; background: #22c55e; box-shadow: 0 0 0 7px rgba(34,197,94,0.12); }
        .dm-module-map .three { left: 52%; bottom: 18%; background: var(--dm-yellow); box-shadow: 0 0 0 7px rgba(255,216,61,0.14); }

        .dm-module-route-bar {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          min-height: 31px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0 10px;
          border-radius: 999px;
          background: #111111;
        }

        .dm-module-route-bar b {
          color: var(--dm-yellow);
          font-size: 8px;
        }

        .dm-module-route-bar span {
          color: rgba(255, 255, 255, 0.58);
          font-size: 8px;
          font-weight: 900;
        }

        .dm-module-money-card {
          padding: 10px;
          border-radius: 15px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
          margin-bottom: 8px;
        }

        .dm-module-money-card.muted {
          background: #f4f4ef;
          border-color: rgba(17, 17, 17, 0.06);
        }

        .dm-module-money-card b,
        .dm-module-money-card span {
          display: block;
        }

        .dm-module-money-card b {
          color: #111111;
          font-size: 11px;
          line-height: 1;
        }

        .dm-module-money-card span {
          margin-top: 6px;
          color: rgba(17, 17, 17, 0.52);
          font-size: 8px;
          font-weight: 900;
        }

        .dm-module-finance-bars {
          display: grid;
          gap: 7px;
          margin-top: 8px;
        }

        .dm-module-finance-bars i {
          height: 17px;
          border-radius: 999px;
          background:
            linear-gradient(90deg, var(--module-accent) 0 62%, #f4f4ef 62%);
        }

        .dm-module-finance-bars i:nth-child(2) {
          background:
            linear-gradient(90deg, #111111 0 42%, #f4f4ef 42%);
        }

        .dm-module-finance-bars i:nth-child(3) {
          background:
            linear-gradient(90deg, #22c55e 0 76%, #f4f4ef 76%);
        }

        .dm-module-profit {
          color: #ffffff;
          background: #111111;
        }

        /* Hide old generic bars if browser still encounters them */
        .dm-mini-phone {
          display: none;
        }

        @media (max-width: 720px) {
          .dm-module-preview {
            height: 220px;
            border-radius: 30px 30px 8px 8px;
          }
        }

        @media (max-width: 480px) {
          .dm-module-preview {
            height: 206px;
          }

          .dm-module-screen {
            padding: 23px 11px 11px;
          }
        }


        /* Task 17: visual badges inside every What Darik includes card */
        .dm-include-card {
          display: flex;
          flex-direction: column;
        }

        .dm-include-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          position: relative;
          z-index: 2;
        }

        .dm-include-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 16px;
          color: rgba(17, 17, 17, 0.26);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.32)),
            rgba(17, 17, 17, 0.035);
          border: 1px solid rgba(17, 17, 17, 0.07);
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .dm-include-badge-row {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 18px;
        }

        .dm-include-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 31px;
          padding: 7px 9px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.68);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.42)),
            rgba(var(--include-rgb), 0.1);
          border: 1px solid rgba(var(--include-rgb), 0.2);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.035);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .dm-include-badge::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--include-accent);
          box-shadow: 0 0 0 5px rgba(var(--include-rgb), 0.08);
        }

        .dm-include-mini-visual {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 0.72fr 0.5fr;
          gap: 7px;
          align-items: end;
          height: 38px;
          margin-top: 16px;
          padding: 8px;
          border-radius: 16px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.26)),
            rgba(17, 17, 17, 0.025);
          border: 1px solid rgba(17, 17, 17, 0.06);
          overflow: hidden;
        }

        .dm-include-mini-visual::before {
          content: "";
          position: absolute;
          left: 8px;
          right: 8px;
          top: 50%;
          height: 1px;
          background: linear-gradient(90deg, rgba(var(--include-rgb), 0.26), transparent);
        }

        .dm-include-mini-visual i {
          position: relative;
          z-index: 2;
          display: block;
          border-radius: 999px;
          background: var(--include-accent);
          box-shadow: 0 0 20px rgba(var(--include-rgb), 0.16);
        }

        .dm-include-mini-visual i:nth-child(1) {
          height: 20px;
        }

        .dm-include-mini-visual i:nth-child(2) {
          height: 14px;
          opacity: 0.72;
        }

        .dm-include-mini-visual i:nth-child(3) {
          height: 24px;
          opacity: 0.42;
        }

        .dm-include-card:nth-child(1) .dm-include-mini-visual {
          grid-template-columns: repeat(4, 1fr);
        }

        .dm-include-card:nth-child(1) .dm-include-mini-visual i {
          height: 22px;
          border-radius: 10px;
        }

        .dm-include-card:nth-child(2) .dm-include-mini-visual {
          grid-template-columns: 1fr 1fr;
        }

        .dm-include-card:nth-child(2) .dm-include-mini-visual i:nth-child(1),
        .dm-include-card:nth-child(2) .dm-include-mini-visual i:nth-child(2) {
          height: 22px;
          border-radius: 999px;
        }

        .dm-include-card:nth-child(2) .dm-include-mini-visual i:nth-child(3) {
          display: none;
        }

        .dm-include-card:nth-child(3) .dm-include-mini-visual {
          background:
            linear-gradient(90deg, rgba(17, 17, 17, 0.055) 1px, transparent 1px),
            linear-gradient(rgba(17, 17, 17, 0.055) 1px, transparent 1px),
            #ffffff;
          background-size: 16px 16px;
        }

        .dm-include-card:nth-child(3) .dm-include-mini-visual i {
          width: 13px;
          height: 13px;
          border-radius: 999px 999px 999px 2px;
          transform: rotate(-45deg);
          justify-self: center;
        }

        .dm-include-card:nth-child(4) .dm-include-mini-visual i {
          height: 23px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 30% 50%, #111 0 3px, transparent 4px),
            var(--include-accent);
        }

        .dm-include-card:nth-child(5) .dm-include-mini-visual {
          grid-template-columns: 1fr;
        }

        .dm-include-card:nth-child(5) .dm-include-mini-visual i {
          height: 9px;
        }

        .dm-include-card:nth-child(6) .dm-include-mini-visual {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .dm-include-card:nth-child(6) .dm-include-mini-visual i {
          height: 20px;
          border-radius: 999px;
        }

        .dm-include-card:nth-child(7) .dm-include-mini-visual {
          grid-template-columns: 1fr 1fr;
        }

        .dm-include-card:nth-child(7) .dm-include-mini-visual i:nth-child(1),
        .dm-include-card:nth-child(7) .dm-include-mini-visual i:nth-child(2) {
          height: 22px;
          border-radius: 12px;
        }

        .dm-include-card:nth-child(7) .dm-include-mini-visual i:nth-child(3) {
          display: none;
        }

        .dm-include-card:nth-child(8) .dm-include-mini-visual {
          grid-template-columns: 0.28fr 1fr 0.28fr;
        }

        .dm-include-card:nth-child(8) .dm-include-mini-visual i {
          height: 6px;
          align-self: center;
        }

        .dm-include-card:nth-child(8) .dm-include-mini-visual i:nth-child(2) {
          height: 24px;
          border-radius: 12px;
        }

        .dm-include-card:nth-child(9) .dm-include-mini-visual {
          grid-template-columns: repeat(3, 1fr);
        }

        .dm-include-card:nth-child(9) .dm-include-mini-visual i {
          height: 22px;
          border-radius: 10px;
          background:
            linear-gradient(180deg, var(--include-accent), rgba(var(--include-rgb), 0.5));
        }

        @media (max-width: 720px) {
          .dm-include-card-head {
            gap: 12px;
          }

          .dm-include-number {
            width: 38px;
            height: 38px;
            border-radius: 14px;
            font-size: 16px;
          }

          .dm-include-badge-row {
            padding-top: 16px;
          }

          .dm-include-badge {
            min-height: 30px;
            font-size: 9.5px;
          }

          .dm-include-mini-visual {
            height: 36px;
          }
        }


        /* Task 18: expanded ecosystem with warehouse, support, accounting, and AI queue */
        .dm-system-proof-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin: 22px 0 16px;
        }

        .dm-system-proof-pills span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 34px;
          padding: 8px 10px;
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.74);
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 11px;
          font-weight: 900;
        }

        .dm-system-proof-pills span::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--dm-yellow);
          box-shadow: 0 0 18px rgba(255, 216, 61, 0.46);
        }

        .dm-system-flow-expanded {
          grid-template-columns: minmax(172px, 1fr) 112px 178px 112px minmax(172px, 1fr);
          grid-template-rows: minmax(112px, auto) 82px 178px 82px minmax(112px, auto);
          min-height: 590px;
          gap: 14px;
          padding: 18px;
        }

        .dm-system-flow-expanded::before {
          width: 460px;
          height: 460px;
        }

        .dm-system-flow-expanded::after {
          width: 286px;
          height: 286px;
        }

        .dm-system-flow-expanded .dm-core {
          grid-column: 3;
          grid-row: 3;
        }

        .dm-system-flow-expanded .dm-flow-customer {
          grid-column: 1 / span 2;
          grid-row: 1 / span 2;
          align-self: start;
        }

        .dm-system-flow-expanded .dm-flow-retailer {
          grid-column: 4 / span 2;
          grid-row: 1 / span 2;
          align-self: start;
        }

        .dm-system-flow-expanded .dm-flow-driver {
          grid-column: 1 / span 2;
          grid-row: 4 / span 2;
          align-self: end;
        }

        .dm-system-flow-expanded .dm-flow-admin {
          grid-column: 4 / span 2;
          grid-row: 4 / span 2;
          align-self: end;
        }

        .dm-ops-ring {
          position: relative;
          z-index: 5;
          display: grid;
          align-content: center;
          min-height: 76px;
          padding: 12px;
          border-radius: 21px;
          color: #ffffff;
          background:
            radial-gradient(circle at 86% 0%, rgba(255, 216, 61, 0.13), transparent 6rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.036));
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow:
            0 20px 52px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.09);
          backdrop-filter: blur(16px);
        }

        .dm-ops-ring::before {
          content: "";
          position: absolute;
          left: 12px;
          top: 12px;
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--dm-yellow);
          box-shadow: 0 0 0 7px rgba(255, 216, 61, 0.08), 0 0 24px rgba(255, 216, 61, 0.5);
        }

        .dm-ops-ring span {
          display: block;
          margin-left: 20px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dm-ops-ring strong {
          display: block;
          margin-top: 7px;
          color: #ffffff;
          font-size: 13px;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        .dm-ops-ring-warehouse {
          grid-column: 3;
          grid-row: 1;
          align-self: start;
        }

        .dm-ops-ring-support {
          grid-column: 5;
          grid-row: 3;
          align-self: center;
        }

        .dm-ops-ring-accounting {
          grid-column: 3;
          grid-row: 5;
          align-self: end;
        }

        .dm-ops-ring-ai {
          grid-column: 1;
          grid-row: 3;
          align-self: center;
        }

        .dm-system-flow-expanded .dm-connector {
          width: 42%;
        }

        .dm-system-flow-expanded .dm-connector-one {
          transform: rotate(-142deg);
        }

        .dm-system-flow-expanded .dm-connector-two {
          transform: rotate(-38deg);
        }

        .dm-system-flow-expanded .dm-connector-three {
          transform: rotate(142deg);
        }

        .dm-system-flow-expanded .dm-connector-four {
          transform: rotate(38deg);
        }

        .dm-system-flow-expanded .dm-connector::before {
          content: "";
          position: absolute;
          left: 26%;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.26);
        }

        .dm-system-flow-expanded .dm-flow-node {
          min-height: 138px;
        }

        .dm-system-flow-expanded .dm-flow-icon {
          margin-bottom: 12px;
        }

        @media (max-width: 1120px) {
          .dm-system-flow-expanded {
            grid-template-columns: minmax(150px, 1fr) 84px 150px 84px minmax(150px, 1fr);
            grid-template-rows: minmax(112px, auto) 76px 150px 76px minmax(112px, auto);
            min-height: 560px;
          }

          .dm-system-flow-expanded .dm-core {
            width: 150px;
            height: 150px;
          }

          .dm-system-flow-expanded .dm-core img {
            width: 62px;
            height: 62px;
          }

          .dm-ops-ring {
            min-height: 70px;
            padding: 11px;
          }
        }

        @media (max-width: 720px) {
          .dm-system-proof-pills {
            margin-top: 18px;
          }

          .dm-system-proof-pills span {
            width: 100%;
          }

          .dm-system-flow-expanded {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            min-height: auto;
            gap: 12px;
          }

          .dm-system-flow-expanded .dm-core,
          .dm-system-flow-expanded .dm-flow-customer,
          .dm-system-flow-expanded .dm-flow-retailer,
          .dm-system-flow-expanded .dm-flow-driver,
          .dm-system-flow-expanded .dm-flow-admin,
          .dm-ops-ring-warehouse,
          .dm-ops-ring-support,
          .dm-ops-ring-accounting,
          .dm-ops-ring-ai {
            grid-column: auto;
            grid-row: auto;
            align-self: auto;
          }

          .dm-ops-ring {
            display: grid;
            grid-template-columns: 1fr;
            min-height: 62px;
            padding: 12px 13px 12px 42px;
            border-radius: 18px;
          }

          .dm-ops-ring::before {
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
          }

          .dm-ops-ring span {
            margin-left: 0;
          }

          .dm-ops-ring-warehouse {
            order: 2;
          }

          .dm-ops-ring-support {
            order: 4;
          }

          .dm-ops-ring-accounting {
            order: 6;
          }

          .dm-ops-ring-ai {
            order: 8;
          }

          .dm-system-flow-expanded .dm-flow-customer {
            order: 1;
          }

          .dm-system-flow-expanded .dm-flow-retailer {
            order: 3;
          }

          .dm-system-flow-expanded .dm-flow-driver {
            order: 5;
          }

          .dm-system-flow-expanded .dm-flow-admin {
            order: 7;
          }

          .dm-system-flow-expanded .dm-core {
            order: 0;
          }
        }


        /* Task 19: stronger real-app screenshot style cards */
        #previews .dm-section-head {
          align-items: flex-end;
          margin-bottom: 32px;
        }

        .dm-previews-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px;
        }

        .dm-preview-card {
          min-height: 690px;
          border-radius: 38px;
        }

        .dm-preview-card-top {
          padding: 24px 24px 0;
        }

        .dm-preview-phone {
          min-height: 430px;
          padding: 28px 24px 0;
          background:
            radial-gradient(circle at 50% 10%, rgba(255, 216, 61, 0.16), transparent 16rem),
            radial-gradient(circle at 80% 40%, rgba(17, 17, 17, 0.08), transparent 18rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(245, 245, 241, 0.86));
        }

        .dm-preview-phone::before {
          width: 310px;
          height: 94px;
          bottom: -62px;
        }

        .dm-phone-screen.dm-action-screen {
          width: 260px;
          height: 390px;
          border-width: 11px;
          border-radius: 40px 40px 0 0;
          padding: 22px 16px 16px;
          background:
            radial-gradient(circle at 86% 0%, rgba(255, 216, 61, 0.15), transparent 9rem),
            #ffffff;
        }

        .dm-action-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          color: rgba(17, 17, 17, 0.48);
          font-size: 10px;
          font-weight: 950;
        }

        .dm-action-status i {
          width: 28px;
          height: 9px;
          border-radius: 999px;
          background: linear-gradient(90deg, #111 0 45%, rgba(17, 17, 17, 0.18) 45%);
        }

        .dm-action-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 13px;
        }

        .dm-action-topbar strong {
          display: block;
          color: #111111;
          font-size: 17px;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .dm-action-topbar span {
          display: block;
          margin-top: 5px;
          color: rgba(17, 17, 17, 0.48);
          font-size: 9px;
          font-weight: 850;
          line-height: 1.2;
        }

        .dm-action-topbar b {
          display: inline-grid;
          place-items: center;
          min-width: 44px;
          height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: #111111;
          background: var(--dm-yellow);
          font-size: 9px;
          font-weight: 950;
        }

        .dm-action-location {
          padding: 11px;
          border-radius: 17px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.48);
        }

        .dm-action-location small,
        .dm-action-location b {
          display: block;
        }

        .dm-action-location small {
          color: rgba(17, 17, 17, 0.5);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dm-action-location b {
          margin-top: 5px;
          color: #111111;
          font-size: 11px;
          line-height: 1.15;
        }

        .dm-action-category-strip {
          display: flex;
          gap: 9px;
          margin: 13px 0;
        }

        .dm-action-category-strip i {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 45%, rgba(17,17,17,0.13) 0 6px, transparent 7px),
            #f1f1ed;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.055);
        }

        .dm-action-category-strip .active {
          background:
            radial-gradient(circle at 50% 45%, #111 0 6px, transparent 7px),
            var(--dm-yellow);
        }

        .dm-action-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 9px;
        }

        .dm-action-title-row strong {
          color: #111111;
          font-size: 15px;
          letter-spacing: -0.04em;
        }

        .dm-action-title-row span {
          color: #0f4f7b;
          font-size: 9px;
          font-weight: 950;
        }

        .dm-action-product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .dm-action-product-grid div {
          min-height: 90px;
          padding: 8px;
          border-radius: 16px;
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.055);
        }

        .dm-action-product-grid i {
          display: block;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, #d7e3ef, #ffffff, #f3c6d9);
        }

        .dm-action-product-grid b {
          display: block;
          width: 76%;
          height: 7px;
          margin-top: 8px;
          border-radius: 999px;
          background: #0f4f7b;
        }

        .dm-action-product-grid span {
          display: block;
          margin-top: 6px;
          color: rgba(17, 17, 17, 0.56);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-action-delivery-choice {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .dm-action-delivery-choice div {
          min-height: 48px;
          padding: 9px;
          border-radius: 14px;
          background: #111111;
        }

        .dm-action-delivery-choice div:nth-child(2) {
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.48);
        }

        .dm-action-delivery-choice b,
        .dm-action-delivery-choice span {
          display: block;
        }

        .dm-action-delivery-choice b {
          color: var(--dm-yellow);
          font-size: 9px;
          line-height: 1.05;
        }

        .dm-action-delivery-choice span {
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 8px;
          font-weight: 900;
        }

        .dm-action-delivery-choice div:nth-child(2) b {
          color: #111111;
        }

        .dm-action-delivery-choice div:nth-child(2) span {
          color: rgba(17, 17, 17, 0.56);
        }

        .dm-action-bottom-nav {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 13px;
          display: flex;
          justify-content: space-around;
          padding: 8px;
          border-radius: 17px;
          background: rgba(244, 244, 239, 0.96);
          border: 1px solid rgba(17, 17, 17, 0.055);
        }

        .dm-action-bottom-nav i {
          width: 13px;
          height: 13px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.18);
        }

        .dm-action-bottom-nav i:first-child {
          background: #111111;
        }

        .dm-action-retailer {
          background:
            radial-gradient(circle at 84% 0%, rgba(245, 158, 11, 0.16), transparent 9rem),
            #ffffff !important;
        }

        .dm-action-money-row,
        .dm-action-admin-kpis {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .dm-action-money-row div,
        .dm-action-admin-kpis div {
          min-height: 54px;
          padding: 9px;
          border-radius: 15px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
        }

        .dm-action-money-row div:nth-child(2),
        .dm-action-admin-kpis div:nth-child(2) {
          background: #f4f4ef;
          border-color: rgba(17, 17, 17, 0.06);
        }

        .dm-action-money-row small,
        .dm-action-money-row b,
        .dm-action-admin-kpis small,
        .dm-action-admin-kpis b {
          display: block;
        }

        .dm-action-money-row small,
        .dm-action-admin-kpis small {
          color: rgba(17, 17, 17, 0.52);
          font-size: 8px;
          font-weight: 900;
        }

        .dm-action-money-row b,
        .dm-action-admin-kpis b {
          margin-top: 6px;
          color: #111111;
          font-size: 15px;
          line-height: 1;
        }

        .dm-action-tab-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }

        .dm-action-tab-row span {
          display: grid;
          place-items: center;
          min-height: 26px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.56);
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-action-tab-row .active {
          color: #111111;
          background: var(--dm-yellow);
          border-color: rgba(255, 216, 61, 0.54);
        }

        .dm-action-form {
          padding: 10px;
          border-radius: 17px;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.06);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.035);
        }

        .dm-action-form span {
          display: block;
          color: rgba(17, 17, 17, 0.54);
          font-size: 8px;
          font-weight: 950;
          margin-bottom: 8px;
        }

        .dm-action-form i {
          display: block;
          height: 24px;
          margin-top: 7px;
          border-radius: 10px;
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.055);
        }

        .dm-action-form .short {
          width: 72%;
        }

        .dm-action-photo-lock {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
          padding: 10px;
          border-radius: 15px;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
        }

        .dm-action-photo-lock b,
        .dm-action-photo-lock span {
          display: block;
        }

        .dm-action-photo-lock b {
          color: #111111;
          font-size: 9px;
          line-height: 1.1;
        }

        .dm-action-photo-lock span {
          max-width: 98px;
          color: rgba(17, 17, 17, 0.52);
          font-size: 8px;
          font-weight: 850;
          line-height: 1.2;
        }

        .dm-action-submit,
        .dm-action-signature b {
          display: grid;
          place-items: center;
          min-height: 31px;
          margin-top: 10px;
          border-radius: 999px;
          color: #ffffff;
          background: #111111;
          font-size: 9px;
          font-weight: 950;
        }

        .dm-action-driver {
          background:
            radial-gradient(circle at 84% 0%, rgba(34, 197, 94, 0.16), transparent 9rem),
            #ffffff !important;
        }

        .dm-action-driver .dm-action-topbar b {
          color: #ffffff;
          background: #22c55e;
        }

        .dm-action-driver-hero {
          padding: 11px;
          border-radius: 17px;
          background: #f0fdf4;
          border: 1px solid rgba(34, 197, 94, 0.23);
        }

        .dm-action-driver-hero small,
        .dm-action-driver-hero b {
          display: block;
        }

        .dm-action-driver-hero small {
          color: rgba(17, 17, 17, 0.52);
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .dm-action-driver-hero b {
          margin-top: 5px;
          color: #111111;
          font-size: 11px;
          line-height: 1.15;
        }

        .dm-action-route-progress {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin: 11px 0;
        }

        .dm-action-route-progress i {
          height: 7px;
          border-radius: 999px;
          background: #22c55e;
        }

        .dm-action-route-progress .empty {
          background: #e5e5df;
        }

        .dm-action-stop-card {
          padding: 12px;
          border-radius: 17px;
          background: #ffffff;
          border: 1px solid rgba(17, 17, 17, 0.07);
          box-shadow: 0 9px 22px rgba(0, 0, 0, 0.04);
        }

        .dm-action-stop-card small,
        .dm-action-stop-card b,
        .dm-action-stop-card span {
          display: block;
        }

        .dm-action-stop-card small {
          color: rgba(17, 17, 17, 0.48);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-action-stop-card b {
          margin-top: 6px;
          color: #111111;
          font-size: 16px;
          line-height: 1;
        }

        .dm-action-stop-card span {
          margin-top: 6px;
          color: rgba(17, 17, 17, 0.56);
          font-size: 9px;
          font-weight: 850;
        }

        .dm-action-driver-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .dm-action-driver-buttons i {
          height: 29px;
          border-radius: 11px;
          background: #111111;
        }

        .dm-action-driver-buttons i:nth-child(2) {
          background: #22c55e;
        }

        .dm-action-signature {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          align-items: center;
          margin-top: 10px;
        }

        .dm-action-signature span {
          display: grid;
          place-items: center;
          min-height: 31px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.56);
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-action-signature b {
          margin-top: 0;
          background: #22c55e;
        }

        .dm-action-admin {
          background:
            radial-gradient(circle at 84% 0%, rgba(17, 17, 17, 0.12), transparent 9rem),
            #ffffff !important;
        }

        .dm-action-admin .dm-action-topbar strong {
          font-size: 13px;
        }

        .dm-action-admin .dm-action-topbar b {
          color: var(--dm-yellow);
          background: #111111;
        }

        .dm-action-admin-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }

        .dm-action-admin-tabs span {
          display: grid;
          place-items: center;
          min-height: 25px;
          border-radius: 999px;
          color: rgba(17, 17, 17, 0.56);
          background: #f4f4ef;
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-action-admin-tabs .active {
          color: var(--dm-yellow);
          background: #111111;
        }

        .dm-action-admin-board {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 8px;
          margin-top: 10px;
        }

        .dm-action-admin-list {
          display: grid;
          gap: 7px;
        }

        .dm-action-admin-list i {
          height: 26px;
          border-radius: 11px;
          background:
            linear-gradient(90deg, rgba(17,17,17,0.12) 0 58%, rgba(34,197,94,0.28) 58% 78%, rgba(17,17,17,0.06) 78%);
        }

        .dm-action-admin-map {
          position: relative;
          min-height: 92px;
          border-radius: 16px;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(17,17,17,0.055) 1px, transparent 1px),
            linear-gradient(rgba(17,17,17,0.055) 1px, transparent 1px),
            #ffffff;
          background-size: 16px 16px;
          border: 1px solid rgba(17,17,17,0.06);
        }

        .dm-action-admin-map span {
          position: absolute;
          left: -12px;
          right: -12px;
          top: 47px;
          height: 7px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.08);
          transform: rotate(-22deg);
        }

        .dm-action-admin-map .pin {
          position: absolute;
          z-index: 2;
          width: 14px;
          height: 14px;
          border-radius: 999px 999px 999px 2px;
          transform: rotate(-45deg);
          background: #ef4444;
          box-shadow: 0 0 0 7px rgba(239, 68, 68, 0.12);
        }

        .dm-action-admin-map .one { left: 30%; top: 38%; }
        .dm-action-admin-map .two { right: 25%; bottom: 22%; background: #22c55e; box-shadow: 0 0 0 7px rgba(34, 197, 94, 0.12); }

        .dm-action-admin-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .dm-action-admin-footer span {
          display: grid;
          place-items: center;
          min-height: 30px;
          border-radius: 999px;
          color: #111111;
          background: #fff7d6;
          border: 1px solid rgba(255, 216, 61, 0.42);
          font-size: 8px;
          font-weight: 950;
        }

        .dm-preview-content {
          padding: 26px;
        }

        .dm-preview-content h3 {
          max-width: 390px;
          font-size: 30px;
        }

        .dm-preview-content p {
          max-width: 480px;
          font-size: 14.5px;
        }

        @media (max-width: 1180px) {
          .dm-preview-card {
            min-height: 650px;
          }

          .dm-phone-screen.dm-action-screen {
            width: 238px;
            height: 372px;
          }
        }

        @media (max-width: 820px) {
          .dm-previews-grid {
            grid-template-columns: 1fr;
          }

          .dm-preview-card {
            min-height: auto;
          }
        }

        @media (max-width: 720px) {
          .dm-preview-phone {
            min-height: 410px;
            padding: 24px 20px 0;
          }

          .dm-phone-screen.dm-action-screen {
            width: 232px;
            height: 365px;
          }

          .dm-preview-content h3 {
            font-size: 27px;
          }
        }

        @media (max-width: 480px) {
          .dm-preview-phone {
            min-height: 386px;
            padding: 20px 18px 0;
          }

          .dm-phone-screen.dm-action-screen {
            width: 210px;
            height: 344px;
            border-width: 10px;
            padding-left: 13px;
            padding-right: 13px;
          }

          .dm-action-category-strip i {
            width: 28px;
            height: 28px;
          }

          .dm-action-product-grid div {
            min-height: 78px;
          }

          .dm-action-product-grid i {
            height: 40px;
          }

          .dm-action-topbar strong {
            font-size: 15px;
          }

          .dm-action-admin .dm-action-topbar strong {
            font-size: 11.5px;
          }

          .dm-action-admin-tabs span {
            font-size: 7px;
          }

          .dm-preview-content {
            padding: 22px;
          }
        }


        /* Task 20: final full-page polish pass */
        html {
          scroll-behavior: smooth;
        }

        .dm-page {
          width: 100%;
          overflow-x: hidden;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        .dm-page a,
        .dm-page button {
          -webkit-tap-highlight-color: transparent;
        }

        .dm-page a:focus-visible,
        .dm-page button:focus-visible {
          outline: 3px solid rgba(255, 216, 61, 0.74);
          outline-offset: 4px;
        }

        .dm-shell {
          position: relative;
        }

        .dm-section {
          position: relative;
          isolation: isolate;
        }

        .dm-section + .dm-section {
          border-top: 1px solid rgba(17, 17, 17, 0.055);
        }

        .dm-section::after {
          content: "";
          position: absolute;
          left: calc(50% - min(590px, calc(50vw - 21px)));
          right: calc(50% - min(590px, calc(50vw - 21px)));
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(17, 17, 17, 0.07), transparent);
          pointer-events: none;
        }

        .dm-section:last-of-type::after {
          display: none;
        }

        .dm-section-head h2,
        .dm-hero h1,
        .dm-final h2,
        .dm-includes-side h2,
        .dm-system h2 {
          text-wrap: balance;
        }

        .dm-hero-copy,
        .dm-section-head p,
        .dm-module-card p,
        .dm-include-card p,
        .dm-preview-content p,
        .dm-final p {
          text-wrap: pretty;
        }

        .dm-button,
        .dm-nav-cta,
        .dm-mobile-route-scroll a,
        .dm-preview-card,
        .dm-module-card,
        .dm-include-card,
        .dm-flow-node,
        .dm-ops-ring {
          will-change: transform;
        }

        .dm-button:active,
        .dm-nav-cta:active,
        .dm-mobile-route-scroll a:active {
          transform: translateY(1px) scale(0.99);
        }

        .dm-hero {
          margin-bottom: 6px;
        }

        .dm-hero-badges {
          max-width: 720px;
        }

        .dm-hero-badge {
          backdrop-filter: blur(14px);
        }

        .dm-device-stage {
          filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.03));
        }

        .dm-hero-float {
          transform: translateZ(0);
        }

        .dm-module-card,
        .dm-include-card,
        .dm-preview-card {
          transform: translateZ(0);
        }

        .dm-module-card h3,
        .dm-include-card h3,
        .dm-preview-content h3 {
          text-wrap: balance;
        }

        .dm-module-card:hover,
        .dm-include-card:hover,
        .dm-preview-card:hover {
          z-index: 3;
        }

        .dm-module-grid,
        .dm-includes-grid,
        .dm-previews-grid {
          align-items: stretch;
        }

        .dm-module-card {
          justify-content: flex-start;
        }

        .dm-module-card .dm-module-preview {
          flex: 0 0 auto;
        }

        .dm-module-card p {
          margin-bottom: 0;
        }

        .dm-include-card p {
          flex: 1;
        }

        .dm-include-badge-row {
          min-height: 78px;
          align-content: flex-start;
        }

        .dm-system {
          margin-top: 6px;
          margin-bottom: 6px;
        }

        .dm-system .dm-button {
          width: fit-content;
        }

        .dm-system-flow-expanded {
          transform: translateZ(0);
        }

        .dm-preview-card-top strong {
          font-variant-numeric: tabular-nums;
        }

        .dm-preview-stat,
        .dm-preview-card-top span,
        .dm-eyebrow,
        .dm-final-eyebrow {
          white-space: nowrap;
        }

        .dm-final {
          margin-top: 54px;
        }

        .dm-footer {
          border-top: 1px solid rgba(17, 17, 17, 0.06);
        }

        @media (hover: none) {
          .dm-module-card:hover,
          .dm-include-card:hover,
          .dm-preview-card:hover,
          .dm-button:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .dm-page *,
          .dm-page *::before,
          .dm-page *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }

        @media (max-width: 1180px) {
          .dm-section::after {
            left: 21px;
            right: 21px;
          }

          .dm-preview-card {
            min-height: auto;
          }
        }

        @media (max-width: 1020px) {
          .dm-hero {
            gap: 38px;
          }

          .dm-device-stage {
            margin-inline: auto;
            width: min(720px, 100%);
          }

          .dm-system .dm-button {
            width: auto;
          }
        }

        @media (max-width: 720px) {
          html {
            scroll-padding-top: 126px;
          }

          .dm-section {
            padding: 44px 0;
          }

          .dm-section + .dm-section {
            border-top-color: rgba(17, 17, 17, 0.045);
          }

          .dm-section::after {
            left: 13px;
            right: 13px;
          }

          .dm-hero {
            gap: 26px;
            margin-bottom: 0;
          }

          .dm-hero-copy {
            line-height: 1.62;
          }

          .dm-hero-badges {
            max-width: 100%;
          }

          .dm-device-stage {
            width: 100%;
            filter: none;
          }

          .dm-hero-float {
            box-shadow:
              0 18px 44px rgba(0, 0, 0, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.72);
          }

          .dm-module-card,
          .dm-include-card,
          .dm-preview-card {
            box-shadow:
              0 18px 52px rgba(0, 0, 0, 0.065),
              inset 0 1px 0 rgba(255, 255, 255, 0.76);
          }

          .dm-module-preview,
          .dm-preview-phone {
            margin-inline: auto;
            width: 100%;
          }

          .dm-include-badge-row {
            min-height: auto;
          }

          .dm-system .dm-button {
            width: 100%;
          }

          .dm-final {
            margin-top: 36px;
          }

          .dm-footer {
            border-top: 0;
          }
        }

        @media (max-width: 480px) {
          .dm-section {
            padding: 40px 0;
          }

          .dm-hero {
            padding-top: 30px;
          }

          .dm-actions {
            gap: 11px;
          }

          .dm-hero-badge {
            min-height: 42px;
          }

          .dm-module-card,
          .dm-include-card {
            border-radius: 24px;
          }

          .dm-preview-card {
            border-radius: 26px;
          }

          .dm-final {
            border-radius: 28px;
          }
        }


        /* Quick fix: mobile top Quote button cleanup */
        @media (max-width: 720px) {
          .dm-nav-cta {
            position: relative;
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            min-width: 76px;
            height: 42px;
            min-height: 42px;
            padding: 0 14px !important;
            border-radius: 16px !important;
            color: #ffd83d !important;
            background:
              radial-gradient(circle at 35% 0%, rgba(255, 216, 61, 0.18), transparent 4rem),
              linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035)),
              rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 216, 61, 0.34) !important;
            box-shadow:
              0 14px 34px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            font-size: 0 !important;
            line-height: 1;
            overflow: hidden;
          }

          .dm-nav-cta::before {
            content: "Quote" !important;
            position: relative;
            z-index: 2;
            color: #ffd83d;
            font-size: 12px !important;
            font-weight: 950;
            letter-spacing: -0.01em;
          }

          .dm-nav-cta::after {
            content: "→";
            position: relative;
            z-index: 2;
            display: grid;
            place-items: center;
            width: 22px;
            height: 22px;
            margin-left: 7px;
            border-radius: 999px;
            color: #111111;
            background: #ffd83d;
            font-size: 13px;
            font-weight: 950;
            line-height: 1;
            box-shadow: 0 0 18px rgba(255, 216, 61, 0.22);
          }

          .dm-nav-cta:active {
            transform: translateY(1px) scale(0.99);
          }
        }

        @media (max-width: 430px) {
          .dm-nav-cta {
            min-width: 70px;
            height: 40px;
            min-height: 40px;
            padding: 0 11px !important;
            border-radius: 15px !important;
          }

          .dm-nav-cta::after {
            width: 20px;
            height: 20px;
            margin-left: 6px;
            font-size: 12px;
          }
        }


        /* Logo cleanup: remove icon boxes and let transparent logo sit flush */
        .dm-logo,
        .dm-final-logo,
        .dm-brand .dm-logo {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          outline: 0 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          overflow: visible !important;
        }

        .dm-logo::before,
        .dm-logo::after,
        .dm-final-logo::before,
        .dm-final-logo::after {
          display: none !important;
          content: none !important;
        }

        .dm-logo img,
        .dm-final-logo img {
          display: block;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.18));
        }

        .dm-logo {
          width: 54px !important;
          height: 54px !important;
          flex: 0 0 54px !important;
        }

        .dm-final-logo {
          width: 64px !important;
          height: 64px !important;
          flex: 0 0 64px !important;
        }

        @media (max-width: 720px) {
          .dm-logo {
            width: 46px !important;
            height: 46px !important;
            flex-basis: 46px !important;
          }

          .dm-final-logo {
            width: 56px !important;
            height: 56px !important;
            flex-basis: 56px !important;
          }
        }


        /* Logo size fix: double the new transparent logo */
        .dm-nav-inner {
          min-height: 122px !important;
        }

        .dm-logo {
          width: 108px !important;
          height: 108px !important;
          flex: 0 0 108px !important;
        }

        .dm-final-logo {
          width: 128px !important;
          height: 128px !important;
          flex: 0 0 128px !important;
        }

        .dm-logo img,
        .dm-final-logo img {
          object-fit: contain !important;
        }

        @media (max-width: 720px) {
          .dm-nav-inner {
            min-height: 106px !important;
          }

          .dm-logo {
            width: 92px !important;
            height: 92px !important;
            flex-basis: 92px !important;
          }

          .dm-final-logo {
            width: 112px !important;
            height: 112px !important;
            flex-basis: 112px !important;
          }
        }

        @media (max-width: 430px) {
          .dm-nav-inner {
            min-height: 96px !important;
          }

          .dm-logo {
            width: 82px !important;
            height: 82px !important;
            flex-basis: 82px !important;
          }
        }


        /* Mobile-only premium signature polish: scanlines, live data, and premium motion */
        @keyframes dm-mobile-aurora-drift {
          0%, 100% { background-position: 0% 50%, 100% 50%, 50% 50%; }
          50% { background-position: 100% 50%, 0% 50%, 50% 60%; }
        }

        @keyframes dm-mobile-scan-sweep {
          0% { transform: translateX(-135%) rotate(10deg); opacity: 0; }
          14% { opacity: 0.62; }
          54% { opacity: 0.22; }
          100% { transform: translateX(135%) rotate(10deg); opacity: 0; }
        }

        @keyframes dm-mobile-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes dm-mobile-data-pulse {
          0%, 100% { opacity: 0.44; filter: drop-shadow(0 0 0 rgba(255, 216, 61, 0)); }
          50% { opacity: 1; filter: drop-shadow(0 0 16px rgba(255, 216, 61, 0.34)); }
        }

        @media (max-width: 720px) {
          .dm-hero,
          .dm-module-card,
          .dm-include-card,
          .dm-preview-card,
          .dm-system,
          .dm-final {
            background-size: 180% 180%, 160% 160%, auto !important;
            animation: dm-mobile-aurora-drift 15s ease-in-out infinite;
          }

          .dm-module-preview,
          .dm-preview-phone,
          .dm-final-action-card,
          .dm-real-admin-screen,
          .dm-real-customer-screen,
          .dm-system-flow-expanded {
            position: relative;
            overflow: hidden;
          }

          .dm-module-preview::after,
          .dm-preview-phone::after,
          .dm-real-admin-screen::after,
          .dm-real-customer-screen::after,
          .dm-system-flow-expanded::after {
            content: "";
            position: absolute;
            top: -30%;
            bottom: -30%;
            width: 42%;
            left: 0;
            z-index: 24;
            background: linear-gradient(90deg, transparent, rgba(255,216,61,0.22), rgba(255,255,255,0.15), transparent);
            transform: translateX(-135%) rotate(10deg);
            animation: dm-mobile-scan-sweep 6.2s ease-in-out infinite;
            pointer-events: none;
            mix-blend-mode: screen;
          }

          .dm-module-card:nth-child(2) .dm-module-preview::after,
          .dm-preview-card:nth-child(2) .dm-preview-phone::after {
            background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.22), rgba(255,255,255,0.15), transparent);
            animation-delay: -2s;
          }

          .dm-module-card:nth-child(3) .dm-module-preview::after,
          .dm-preview-card:nth-child(3) .dm-preview-phone::after {
            background: linear-gradient(90deg, transparent, rgba(34,197,94,0.22), rgba(255,255,255,0.15), transparent);
            animation-delay: -4s;
          }

          .dm-hero-float,
          .dm-ops-ring,
          .dm-preview-stat,
          .dm-include-badge {
            animation: dm-mobile-float 5.4s ease-in-out infinite;
          }

          .dm-hero-float:nth-child(even),
          .dm-ops-ring:nth-child(even),
          .dm-include-badge:nth-child(even) {
            animation-delay: -2.7s;
          }

          .dm-real-map .pin,
          .dm-module-map .pin,
          .dm-action-admin-map .pin,
          .dm-real-kpi,
          .dm-action-category-strip i,
          .dm-real-category-row i,
          .dm-module-cats i,
          .dm-include-mini-visual i,
          .dm-action-route-progress i {
            animation: dm-mobile-data-pulse 4.4s ease-in-out infinite;
          }

          .dm-real-kpi:nth-child(2),
          .dm-action-category-strip i:nth-child(2),
          .dm-real-category-row i:nth-child(2),
          .dm-module-cats i:nth-child(2),
          .dm-include-mini-visual i:nth-child(2),
          .dm-action-route-progress i:nth-child(2) {
            animation-delay: -1.4s;
          }

          .dm-real-kpi:nth-child(3),
          .dm-action-category-strip i:nth-child(3),
          .dm-real-category-row i:nth-child(3),
          .dm-module-cats i:nth-child(3),
          .dm-include-mini-visual i:nth-child(3),
          .dm-action-route-progress i:nth-child(3) {
            animation-delay: -2.8s;
          }

          .dm-button-primary,
          .dm-nav-cta {
            background-size: 220% 220% !important;
            animation: dm-mobile-aurora-drift 8s ease-in-out infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dm-hero,
          .dm-module-card,
          .dm-include-card,
          .dm-preview-card,
          .dm-system,
          .dm-final,
          .dm-module-preview::after,
          .dm-preview-phone::after,
          .dm-real-admin-screen::after,
          .dm-real-customer-screen::after,
          .dm-system-flow-expanded::after,
          .dm-hero-float,
          .dm-ops-ring,
          .dm-preview-stat,
          .dm-include-badge,
          .dm-real-map .pin,
          .dm-module-map .pin,
          .dm-action-admin-map .pin,
          .dm-real-kpi,
          .dm-action-category-strip i,
          .dm-real-category-row i,
          .dm-module-cats i,
          .dm-include-mini-visual i,
          .dm-action-route-progress i,
          .dm-button-primary,
          .dm-nav-cta {
            animation: none !important;
          }
        }

        .dt-smart-lang-switch {
          position: fixed;
          top: 18px;
          right: 18px;
          z-index: 9999;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          min-height: 42px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(6, 16, 29, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 18px 52px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
        }

        .dt-smart-lang-switch button {
          appearance: none;
          border: 0;
          min-height: 32px;
          padding: 0 11px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.75);
          background: transparent;
          cursor: pointer;
          font: inherit;
          font-size: 12px;
          font-weight: 950;
        }

        .dt-smart-lang-switch button[aria-pressed="true"] {
          color: #06101d;
          background: #67e8f9;
        }

        [data-smart-lang="ar"] {
          direction: rtl;
          text-align: right;
        }

        [data-smart-lang="ar"] h1,
        [data-smart-lang="ar"] h2,
        [data-smart-lang="ar"] h3 {
          letter-spacing: -0.035em !important;
          line-height: 1.06 !important;
        }

        [data-smart-lang="ar"] .dt-smart-lang-switch {
          left: 18px;
          right: auto;
          direction: ltr;
        }

        [data-smart-lang="ar"] input,
        [data-smart-lang="ar"] textarea {
          direction: rtl;
          text-align: right;
        }

        @media (max-width: 720px) {
          .dt-smart-lang-switch {
            top: 12px;
            right: 12px;
            min-height: 40px;
          }

          [data-smart-lang="ar"] .dt-smart-lang-switch {
            left: 12px;
            right: auto;
          }

          .dt-smart-lang-switch button {
            min-height: 30px;
            padding: 0 9px;
          }
        }

      `}</style>

      
      <div className="dt-smart-lang-switch" aria-label="Language switch">
        <button type="button" data-smart-lang-button="en" aria-pressed="true">EN</button>
        <button type="button" data-smart-lang-button="ar" aria-pressed="false">عربي</button>
      </div>

<nav className="dm-nav">
        <div className="dm-shell dm-nav-inner">
          <a className="dm-brand" href="/dariktech" aria-label="Back to Darik Technologies">
            <span className="dm-logo" aria-hidden="true">
              <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
            </span>
            <span>
              <strong>Darik Technologies</strong>
              <span>Marketplace case study</span>
            </span>
          </a>

          <div className="dm-nav-links">
            <a className="dm-desktop-back-link" href="/dariktech#work">← Selected work</a>
            <a href="#modules">Platform</a>
            <a href="#includes">Features</a>
            <a href="#system">System</a>
            <a href="#previews">Screens</a>
            <a className="dm-nav-cta" href={quoteHref}>
              Request a build like this →
            </a>
          </div>
        </div>
      </nav>

      <div className="dm-mobile-route-bar" aria-label="Darik Marketplace page navigation">
        <div className="dm-shell dm-mobile-route-scroll">
          <a href="/dariktech#work">← Work</a>
          <a href="#modules">Platform</a>
          <a href="#includes">Features</a>
          <a href="#system">System</a>
          <a href="#previews">Screens</a>
        </div>
      </div>

      <section className="dm-shell dm-hero">
        <div>
          <a className="dm-hero-back-link" href="/dariktech#work">← Back to selected work</a>
          <span className="dm-eyebrow">Features overview</span>
          <h1>Darik Marketplace</h1>
          <p className="dm-hero-lede">A connected multi-app commerce and logistics platform built for scale.</p>
          <p className="dm-hero-copy">
            Darik powers the full commerce and delivery ecosystem in one integrated platform. Customers shop, retailers manage inventory, drivers deliver with precision, and operators keep everything running in real time.
          </p>

          <div className="dm-actions">
            <a className="dm-button dm-button-primary" href={quoteHref}>
              Request a build like this →
            </a>
            <a className="dm-button dm-button-secondary" href="#system">
              View system overview
            </a>
          </div>

          <div className="dm-hero-badges" aria-label="Darik Marketplace platform highlights">
            <span className="dm-hero-badge">Customer, retailer, driver, and admin apps reviewed</span>
            <span className="dm-hero-badge">Orders, delivery, returns, support, ads, payouts, and P&L</span>
            <span className="dm-hero-badge">Screens below are mapped to the real Darik source code</span>
          </div>
        </div>

        <div className="dm-device-stage dm-hero-real-stage" aria-hidden="true">
          <div className="dm-laptop dm-real-admin-laptop">
            <div className="dm-laptop-screen dm-real-admin-screen">
              <div className="dm-real-admin-header">
                <div>
                  <span>Live Supabase Admin Dashboard</span>
                  <strong>Darik Operations Command Center</strong>
                </div>
                <div className="dm-dot-row"><span /><span /><span /></div>
              </div>

              <div className="dm-admin-tab-strip">
                <span className="active">Customer Orders</span>
                <span>Customer Care</span>
                <span>Stocker Orders</span>
                <span>Dispatcher</span>
                <span>Locate Drivers</span>
                <span>Returns Center</span>
                <span>Support Inbox</span>
                <span>AI Queue</span>
              </div>

              <div className="dm-real-kpi-grid">
                <div className="dm-real-kpi"><span>Active Orders</span><strong>342</strong><small>Live marketplace flow</small></div>
                <div className="dm-real-kpi"><span>Cleared payments</span><strong>24h</strong><small>Retailer payout rule</small></div>
                <div className="dm-real-kpi"><span>Returns Center</span><strong>QA</strong><small>Darik Promise workflow</small></div>
                <div className="dm-real-kpi"><span>Profit & Loss</span><strong>P&L</strong><small>Operations accounting</small></div>
              </div>

              <div className="dm-real-admin-grid">
                <div className="dm-real-route-panel">
                  <div className="dm-real-panel-title">
                    <strong>Next-Day Delivery Routes</strong>
                    <span>Route optimization</span>
                  </div>
                  <div className="dm-real-route-progress"><i /><i /><i /></div>
                  <div className="dm-real-order-line"><b>ORD-3888034B</b><span>Ready for dispatcher</span></div>
                  <div className="dm-real-order-line"><b>ORD-76F81064</b><span>Stocker picked</span></div>
                  <div className="dm-real-order-line"><b>ORD-12A9B66C</b><span>Customer Care</span></div>
                </div>

                <div className="dm-real-map-panel">
                  <div className="dm-real-panel-title">
                    <strong>Locate Drivers</strong>
                    <span>Live map operations</span>
                  </div>
                  <div className="dm-real-map">
                    <i className="pin pin-one" />
                    <i className="pin pin-two" />
                    <i className="pin pin-three" />
                    <span className="route route-one" />
                    <span className="route route-two" />
                  </div>
                </div>
              </div>

              <div className="dm-real-admin-bottom-row">
                <span>Support Inbox</span>
                <span>AI Photo Queue</span>
                <span>Retailer Payouts</span>
                <span>Admin Users</span>
              </div>
            </div>
          </div>

          <div className="dm-phone dm-real-customer-phone">
            <div className="dm-phone-inner dm-real-customer-screen">
              <div className="dm-real-phone-status"><span>9:41</span><i /></div>
              <div className="dm-real-customer-top">
                <strong>Darik</strong>
                <span>Cart</span>
              </div>

              <div className="dm-real-location-card">
                <small>Delivery Location</small>
                <b>Search Google Maps Location</b>
              </div>

              <div className="dm-real-category-row">
                <i className="active" />
                <i />
                <i />
                <i />
              </div>

              <div className="dm-real-screen-title">
                <strong>Best Sellers</strong>
                <span>See all</span>
              </div>

              <div className="dm-real-products">
                <div><i /><b /></div>
                <div><i /><b /></div>
              </div>

              <div className="dm-real-delivery-options">
                <div><b>Free Next-Day</b><span>0</span></div>
                <div><b>Express</b><span>2</span></div>
              </div>

              <div className="dm-real-promise">Darik Promise • Returns & credit</div>
            </div>
          </div>

          <div className="dm-hero-float dm-hero-float-retailer">
            <span>Retailer Portal</span>
            <strong>Add New Product</strong>
            <small>Official photo approval • inventory status</small>
          </div>

          <div className="dm-hero-float dm-hero-float-driver">
            <span>Driver App</span>
            <strong>Active Batch Stops</strong>
            <small>Call • Map • Delivery PIN • Signature</small>
          </div>
        </div>
      </section>

      <section className="dm-section" id="modules">
        <div className="dm-shell">
          <div className="dm-section-head">
            <h2>One ecosystem. Every role connected.</h2>
            <p>Darik is not one simple app. It is a multi-role platform where each user type gets the tools they need.</p>
          </div>

          <div className="dm-module-grid">
            {modules.map((item) => (
              <article className="dm-module-card" key={item.title}>
                <div className="dm-module-icon">
                  <FeatureIcon type={item.icon} />
                </div>
                <div className="dm-module-preview">
                  <ModuleMiniScreen type={item.visual} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dm-section" id="includes">
        <div className="dm-shell dm-includes">
          <div className="dm-includes-side">
            <span className="dm-eyebrow">What Darik includes</span>
            <h2>Everything needed to launch and scale a commerce delivery business.</h2>
            <p className="dm-hero-copy">
              From shopping and checkout to drivers, support, payouts, admin controls, and live operational logic.
            </p>

            <div className="dm-include-proof-list" aria-label="Darik included platform capabilities">
              <div className="dm-include-proof">
                <strong>Source-backed</strong>
                <span>Content mapped from the customer, retailer, driver, and admin app code.</span>
              </div>
              <div className="dm-include-proof">
                <strong>Multi-role</strong>
                <span>Customer, retailer, driver, support, warehouse, dispatch, accounting, and admin workflows.</span>
              </div>
              <div className="dm-include-proof">
                <strong>Operational</strong>
                <span>Orders, delivery, returns, payouts, ads, support, review queues, and P&L in one system.</span>
              </div>
            </div>
          </div>

          <div className="dm-includes-grid">
            {includes.map(([title, text], index) => (
              <article className="dm-include-card" key={title}>
                <div className="dm-include-card-head">
                  <div className="dm-include-icon">
                    <FeatureIcon type={modules[index % modules.length].icon} />
                  </div>
                  <span className="dm-include-number">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <h3>{title}</h3>
                <p>{text}</p>

                <div className="dm-include-badge-row" aria-label={`${title} feature highlights`}>
                  {includeBadges[index].map((badge) => (
                    <span className="dm-include-badge" key={badge}>
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="dm-include-mini-visual" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dm-section" id="system">
        <div className="dm-shell">
          <div className="dm-system">
            <div className="dm-system-grid">
              <div>
                <h2>Built as a real operations ecosystem.</h2>
                <p>Darik connects customers, retailers, drivers, warehouse, support, accounting, AI review queues, and admin operators in one secure real-time platform.</p>
                <div className="dm-system-proof-pills" aria-label="Darik operations roles">
                  <span>Warehouse</span>
                  <span>Support Inbox</span>
                  <span>Accounting</span>
                  <span>AI Queue</span>
                </div>
                <a className="dm-button dm-button-primary" href={quoteHref}>Build a system like this →</a>
              </div>

              <div className="dm-system-flow dm-system-flow-expanded" aria-label="Darik connected marketplace ecosystem">
                <div className="dm-connector dm-connector-one" aria-hidden="true" />
                <div className="dm-connector dm-connector-two" aria-hidden="true" />
                <div className="dm-connector dm-connector-three" aria-hidden="true" />
                <div className="dm-connector dm-connector-four" aria-hidden="true" />

                <div className="dm-ops-ring dm-ops-ring-warehouse">
                  <span>Warehouse</span>
                  <strong>Stocker Orders</strong>
                </div>
                <div className="dm-ops-ring dm-ops-ring-support">
                  <span>Support</span>
                  <strong>Support Inbox</strong>
                </div>
                <div className="dm-ops-ring dm-ops-ring-accounting">
                  <span>Accounting</span>
                  <strong>Payments + P&L</strong>
                </div>
                <div className="dm-ops-ring dm-ops-ring-ai">
                  <span>AI Queue</span>
                  <strong>Photo Review</strong>
                </div>

                <div className="dm-core">
                  <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
                  <span>Darik Platform</span>
                </div>

                <article className="dm-flow-node dm-flow-customer">
                  <div className="dm-flow-icon"><FeatureIcon type="bag" /></div>
                  <strong>Customer App</strong>
                  <span>Shop, order, delivery location, returns, and support.</span>
                </article>

                <article className="dm-flow-node dm-flow-retailer">
                  <div className="dm-flow-icon"><FeatureIcon type="store" /></div>
                  <strong>Retailer Portal</strong>
                  <span>Products, inventory, ads, receipts, and payment payouts.</span>
                </article>

                <article className="dm-flow-node dm-flow-driver">
                  <div className="dm-flow-icon"><FeatureIcon type="car" /></div>
                  <strong>Driver App</strong>
                  <span>Warehouse pickup, active stops, PIN, signature, and delivery.</span>
                </article>

                <article className="dm-flow-node dm-flow-admin">
                  <div className="dm-flow-icon"><FeatureIcon type="settings" /></div>
                  <strong>Admin Dashboard</strong>
                  <span>Orders, care, dispatcher, returns, users, P&L, and queues.</span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dm-section" id="previews">
        <div className="dm-shell">
          <div className="dm-section-head">
            <h2>See Darik in action.</h2>
            <p>Each screen is designed around a real operational job, not just a pretty interface.</p>
          </div>

          <div className="dm-previews-grid">
            {previews.map((preview, index) => (
              <article className="dm-preview-card" key={preview.title}>
                <div className="dm-preview-card-top">
                  <span>{preview.label}</span>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                </div>

                <div className="dm-preview-phone">
                  <MiniScreen type={preview.type} />
                </div>

                <div className="dm-preview-content">
                  <span className="dm-preview-stat">{preview.stat}</span>
                  <h3>{preview.title}</h3>
                  <p>{preview.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dm-shell dm-final">
        <div className="dm-final-grid">
          <div className="dm-final-brand-card" aria-hidden="true">
            <span className="dm-final-logo">
              <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
            </span>
            <div>
              <strong>Darik Technologies</strong>
              <span>Marketplace systems • apps • dashboards</span>
            </div>
          </div>

          <div className="dm-final-copy">
            <span className="dm-final-eyebrow">Build your own platform</span>
            <h2>Want a marketplace system like Darik?</h2>
            <p>
              We design and build scalable multi-app platforms that connect customers, businesses, drivers, support, and operations in real time.
            </p>

            <div className="dm-final-points" aria-label="Platform build highlights">
              <span>Mobile apps</span>
              <span>Admin dashboards</span>
              <span>Delivery workflows</span>
              <span>Support systems</span>
            </div>
          </div>

          <div className="dm-final-actions">
            <a className="dm-button dm-button-primary" href={quoteHref}>
              Request a build like this →
            </a>
            <a className="dm-final-back" href="/dariktech">
              Back to Darik Technologies
            </a>
          </div>
        </div>
      </section>

      <footer className="dm-shell dm-footer">
        <a href="/dariktech">Darik Technologies</a>
        <span>Darik Marketplace case study</span>
        <a href={quoteHref}>Free quote →</a>
      </footer>
    
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  const translations = {"← Back to homepage": "العودة للرئيسية ←", "Work": "الأعمال", "System": "النظام", "Modules": "الأقسام", "Included": "المزايا", "Workflow": "مسار العمل", "Screens": "الشاشات", "Premium": "الاشتراك", "Ops": "التشغيل", "Architecture": "البنية التقنية", "Value": "القيمة", "Build yours": "ابنِ منصتك", "Free quote": "عرض مجاني", "PartBid case study": "دراسة حالة PartBid", "PartBid turns auto parts hunting into a": "PartBid يحوّل البحث عن قطع السيارات إلى", "controlled quote system.": "نظام منظم لطلبات وعروض الأسعار.", "Buyers post one structured request. Suppliers respond with real offers, actual part photos, delivery terms, and chat only when the buyer wants to continue.": "ينشر المشتري طلباً منظماً واحداً. يرد المورّدون بعروض حقيقية وصور فعلية للقطعة وشروط التوصيل، وتبدأ المحادثة فقط عندما يرغب المشتري بالمتابعة.", "Start your free quote today": "ابدأ عرضك المجاني اليوم", "See the system foundation": "شاهد أساس النظام", "2-sided": "طرفان", "buyer + supplier marketplace": "سوق يربط المشتري بالمورّد", "Quotes": "عروض أسعار", "price, photos, delivery, warranty": "السعر، الصور، التوصيل، والضمان", "Realtime": "تحديث مباشر", "requests, messages, and profile updates": "طلبات، رسائل، وتحديثات حسابات", "Request a Part": "اطلب قطعة", "Vehicle": "المركبة", "Hyundai Tucson · 2018": "هيونداي توسان · 2018", "Part Needed": "القطعة المطلوبة", "Front bumper": "الصدام الأمامي", "Preference": "التفضيل", "Original OEM · Used ok": "أصلي OEM · مستعمل مقبول", "Request Quotes": "طلب عروض أسعار", "Supplier quote": "عرض المورّد", "120 · Delivery today": "120 · توصيل اليوم", "Actual photo attached": "صورة حقيقية مرفقة", "Garage chat": "محادثة المشتري", "Buyer starts negotiation": "المشتري يبدأ التفاوض", "Safety flow active": "مسار الأمان مفعل", "Live logic": "منطق مباشر", "Requests, quotes, messages, and profiles stay connected.": "الطلبات والعروض والرسائل والحسابات تبقى مترابطة.", "System foundation": "أساس النظام", "The case study now has the right opening.": "دراسة الحالة لديها الآن افتتاحية قوية.", "This page starts with the core PartBid story, then breaks the product into the same kind of real modules a client would expect: buyer flow, supplier flow, quote/chat flow, and backend control.": "تبدأ الصفحة بقصة PartBid الأساسية، ثم تقسّم المنتج إلى وحدات حقيقية يتوقعها العميل: مسار المشتري، مسار المورّد، العروض والمحادثة، والتحكم الخلفي.", "Buyer request": "طلب المشتري", "Vehicle, year, part needed, condition, part type, location, details, and photos.": "بيانات المركبة، السنة، القطعة المطلوبة، الحالة، نوع القطعة، الموقع، التفاصيل، والصور.", "Price, actual part photos, delivery option, warranty, message, and quote status.": "السعر، صور حقيقية للقطعة، خيار التوصيل، الضمان، الملاحظات، وحالة العرض.", "Chat control": "تحكم بالمحادثة", "The buyer starts the conversation, keeping supplier messaging useful instead of spammy.": "المشتري هو من يبدأ المحادثة، حتى تبقى رسائل المورّدين مفيدة ومنظمة بدل الإزعاج العشوائي.", "Task 2 · product modules": "أقسام المنتج", "PartBid is four connected products, not one basic app screen.": "PartBid ليس شاشة بسيطة، بل أربعة منتجات مترابطة.", "This section shows the real product thinking: buyers create demand, suppliers respond with offers, chat stays controlled, and the backend keeps every state synchronized.": "هذا القسم يوضح التفكير الحقيقي للمنتج: المشترون ينشئون الطلب، المورّدون يرسلون العروض، المحادثة تبقى منظمة، والخلفية التقنية تزامن كل حالة.", "Buyer app": "تطبيق المشتري", "A clean request flow for the person who needs the part.": "مسار طلب واضح للشخص الذي يبحث عن القطعة.", "The buyer picks make, model, year, part needed, condition preference, part type preference, adds notes, uploads photos, and sends one request to suppliers.": "يختار المشتري الشركة، الموديل، السنة، القطعة المطلوبة، تفضيل الحالة، نوع القطعة، يضيف ملاحظات، يرفع الصور، ثم يرسل طلباً واحداً للمورّدين.", "Make / model / year": "الشركة / الموديل / السنة", "Part validation": "التحقق من اسم القطعة", "Photo upload": "رفع الصور", "5 active request limit": "حد للطلبات النشطة", "Supplier app": "تطبيق المورّد", "A supplier workspace that turns demand into quotes.": "مساحة عمل للمورّد تحول الطلبات إلى عروض أسعار.", "Suppliers review incoming requests, open details, dismiss parts they do not carry, unlock premium access, upload real part photos, and send structured quotes.": "يراجع المورّدون الطلبات الواردة، يفتحون التفاصيل، يستبعدون القطع غير المتوفرة لديهم، يفعّلون الوصول المدفوع، يرفعون صوراً حقيقية للقطعة، ويرسلون عروضاً منظمة.", "New / quoted tabs": "طلبات جديدة / عروض مرسلة", "Premium unlock": "تفعيل الاشتراك", "Actual part photos": "صور حقيقية للقطعة", "Delivery terms": "شروط التوصيل", "Quote + chat": "العروض والمحادثة", "Negotiation only starts when the buyer wants it.": "التفاوض يبدأ فقط عندما يقرر المشتري ذلك.", "The buyer receives offers, compares price, condition, part type, delivery, warranty, supplier name visibility, and can start chat when there is real interest.": "يستقبل المشتري العروض، يقارن السعر والحالة ونوع القطعة والتوصيل والضمان ووضوح اسم المورّد، ثم يبدأ المحادثة عند وجود اهتمام حقيقي.", "Buyer starts chat": "المشتري يبدأ المحادثة", "Accept quote": "قبول العرض", "Photo messages": "رسائل بالصور", "Payment safety warning": "تنبيه أمان للدفع", "Platform backend": "الخلفية التقنية", "The hidden layer that makes the app feel like a real company.": "الطبقة الخفية التي تجعل التطبيق يعمل كمنصة حقيقية.", "Device IDs, push tokens, presence, payment requests, business verification, reports, and Supabase realtime channels keep the platform controlled.": "معرّفات الأجهزة، رموز الإشعارات، حالة التواجد، طلبات الدفع، توثيق الأعمال، البلاغات، وقنوات التحديث المباشر تجعل المنصة قابلة للإدارة.", "Realtime data": "بيانات مباشرة", "Push setup": "إعداد الإشعارات", "Business verification": "توثيق الأعمال", "Reports + moderation": "بلاغات ومراجعة", "Regional vehicle database": "قاعدة بيانات مركبات مرنة حسب السوق", "The request form can be adapted to any launch market with local makes, models, years, and naming conventions.": "يمكن تكييف نموذج الطلب لأي سوق إطلاق عبر الشركات والموديلات والسنوات وطريقة تسمية القطع المناسبة لذلك السوق.", "Photo upload pipeline": "مسار رفع الصور", "Supplier premium access": "وصول مدفوع للمورّدين", "Device + push setup": "إعداد الأجهزة والإشعارات", "Realtime presence": "حالة تواجد مباشرة", "Safety + reporting": "الأمان والبلاغات", "Arabic + English copy": "محتوى عربي وإنجليزي", "Task 3 · what is included": "ما الذي يتضمنه النظام", "The real value is everything around the screens.": "القيمة الحقيقية في كل ما يدعم الشاشات.", "Trust": "الثقة", "Media": "الوسائط", "Access": "الوصول", "Live app": "تطبيق مباشر", "Task 4 · workflow logic": "منطق مسار العمل", "The app is built around states, not random screens.": "التطبيق مبني حول الحالات، وليس حول شاشات عشوائية.", "Request state machine": "حالات الطلب", "Task 5 · screen previews": "معاينة الشاشات", "Now the case study shows what the app actually feels like.": "الآن توضح دراسة الحالة كيف يبدو التطبيق فعلياً.", "PartBid has a built-in path to make money.": "PartBid يحتوي على مسار واضح لتحقيق الإيرادات.", "Task 7 · operations control layer": "طبقة التحكم التشغيلي", "The backend has admin control points, not just user screens.": "الخلفية التقنية تحتوي على نقاط تحكم إدارية، وليس فقط شاشات للمستخدمين.", "Task 8 · technical architecture": "البنية التقنية", "The page now shows how the app is actually built.": "الصفحة توضّح الآن كيف تم بناء التطبيق فعلياً.", "Task 9 · business value": "القيمة التجارية", "This section explains why PartBid is worth building.": "هذا القسم يشرح لماذا يستحق PartBid البناء.", "Build a quote platform, marketplace, or admin system like this.": "ابنِ منصة عروض أسعار أو سوقاً رقمياً أو نظام إدارة مثل هذا.", "Get a free quote": "احصل على عرض مجاني", "Back to homepage": "العودة للرئيسية", "Mobile apps · web apps · admin dashboards · marketplaces · backend systems": "تطبيقات جوال · تطبيقات ويب · لوحات إدارة · أسواق رقمية · أنظمة خلفية", "← Back to Darik Technologies homepage": "العودة إلى الصفحة الرئيسية لـ Darik Technologies ←", "New request": "طلب جديد", "Buyer creates structured demand": "المشتري ينشئ طلباً منظماً", "Supplier review": "مراجعة المورّد", "Quote sent": "تم إرسال العرض", "Buyer decision": "قرار المشتري", "Closed loop": "إغلاق المسار", "Buyer screen": "شاشة المشتري", "Request creation": "إنشاء الطلب", "Supplier screen": "شاشة المورّد", "Incoming request detail": "تفاصيل الطلب الوارد", "Quote screen": "شاشة العروض", "Compare offers": "مقارنة العروض", "Chat screen": "شاشة المحادثة", "Controlled negotiation": "تفاوض منظم", "Old way": "الطريقة التقليدية", "PartBid way": "طريقة PartBid", "Supplier value": "قيمة المورّد", "Platform value": "قيمة المنصة", "Two-sided marketplace": "سوق بطرفين", "Supplier monetization": "تحقيق إيراد من المورّدين", "Admin operations": "تشغيل إداري", "Production architecture": "بنية جاهزة للتشغيل", "Payment proof": "إثبات الدفع", "Payment receipt": "إثبات الدفع", "payment alias": "اسم حساب الدفع", "Premium requests can be reviewed before unlocking supplier access, using plan name, price, months, payment alias, receipt URL, status, and admin notes.": "يمكن مراجعة طلبات الاشتراك قبل فتح وصول المورّد باستخدام اسم الخطة والسعر والمدة واسم حساب الدفع ورابط الإيصال والحالة وملاحظات الإدارة.", "PartBid | Darik Technologies": "PartBid | Darik Technologies", "Makes": "الشركات", "Models": "الموديلات", "Years": "السنوات", "Request, quote, chat, registration, and payment photos are compressed, uploaded, saved, and attached to the right workflow.": "يتم ضغط صور الطلبات والعروض والمحادثات والتسجيل والدفع ورفعها وحفظها وربطها بالمسار الصحيح.", "Camera": "الكاميرا", "Gallery": "المعرض", "Compression": "ضغط الصور", "Plans": "الخطط", "Activation": "التفعيل", "Business buyers can submit registration photos, show verified status, and give suppliers more confidence.": "يمكن للمشترين من الشركات رفع صور التسجيل، وإظهار حالة التوثيق، ومنح المورّدين ثقة أعلى.", "Buyer trust": "ثقة المشتري", "Registration": "التسجيل", "Review": "المراجعة", "The app stores device IDs, Expo push tokens, platform data, and setup debug logs so notification problems can be diagnosed.": "يحفظ التطبيق معرّفات الأجهزة ورموز إشعارات Expo وبيانات المنصة وسجلات التشخيص حتى يمكن تتبع مشاكل الإشعارات.", "Device ID": "معرّف الجهاز", "Expo push": "إشعارات Expo", "Debug logs": "سجلات تشخيص", "The backend tracks active users and last seen status so the product can behave like a live marketplace.": "تتابع الخلفية التقنية المستخدمين النشطين وآخر ظهور حتى تعمل المنصة كسوق مباشر.", "Presence": "التواجد", "Last seen": "آخر ظهور", "Active state": "حالة النشاط", "Users can report images, buyers, or sellers, while the app keeps reporter device and platform context for admin review.": "يمكن للمستخدمين الإبلاغ عن الصور أو المشترين أو البائعين، مع حفظ بيانات الجهاز والمنصة لمراجعة الإدارة.", "Reports": "تقارير", "Moderation": "مراجعة", "Safety": "أمان", "Buyer, supplier, chat, dropdown, alerts, buttons, and safety messages are structured for both English and Arabic.": "تم تنظيم نصوص المشتري والمورّد والمحادثة والقوائم والتنبيهات والأزرار ورسائل الأمان باللغتين العربية والإنجليزية.", "Bilingual": "ثنائي اللغة", "Arabic": "عربي", "English": "إنجليزي", "The buyer chooses the car, the exact part, preferences, photos, location, and optional notes instead of sending a messy message.": "يحدد المشتري المركبة والقطعة المطلوبة والتفضيلات والصور والموقع والملاحظات الاختيارية بدل إرسال رسالة غير منظمة.", "Part": "القطعة", "Photos": "الصور", "Suppliers see a clean opportunity": "المورّدون يرون فرصة واضحة", "Suppliers open the request, review what the buyer needs, and either quote it or dismiss it if they do not carry the part.": "يفتح المورّدون الطلب، يراجعون ما يحتاجه المشتري، ثم يرسلون عرضاً أو يستبعدون الطلب إذا كانت القطعة غير متوفرة لديهم.", "New tab": "تبويب الجديد", "Open details": "فتح التفاصيل", "Dismiss": "استبعاد", "Offers arrive with real quote data": "العروض تصل ببيانات واضحة", "A quote carries the price, condition, part type, warranty, delivery option, delivery fee, message, and actual part photos.": "يتضمن العرض السعر والحالة ونوع القطعة والضمان وخيار التوصيل ورسومه والملاحظات وصوراً حقيقية للقطعة.", "Price": "السعر", "Delivery": "التوصيل", "Warranty": "الضمان", "Buyer compares and starts chat only if interested": "المشتري يقارن ويبدأ المحادثة عند الاهتمام", "The buyer can compare offers and open chat. Suppliers cannot start the chat first, which keeps the platform cleaner.": "يستطيع المشتري مقارنة العروض وفتح المحادثة. لا يستطيع المورّد بدء المحادثة أولاً، وهذا يحافظ على تنظيم المنصة.", "Compare": "مقارنة", "Chat": "محادثة", "Negotiate": "تفاوض", "The request becomes accepted, withdrawn, unavailable, or closed": "ينتهي الطلب بقبول أو سحب أو إغلاق", "The system keeps tabs clean by moving items out of the wrong screens once a request is accepted, withdrawn, closed, or unavailable.": "يحافظ النظام على ترتيب التبويبات بإزالة العناصر من الشاشات غير المناسبة عند قبول الطلب أو سحبه أو إغلاقه أو عدم توفره.", "Accepted": "مقبول", "Withdrawn": "مسحوب", "Closed": "مغلق", "open": "مفتوح", "quoted": "تم التسعير", "accepted": "مقبول", "closed": "مغلق", "withdrawn": "مسحوب", "unavailable": "غير متاح", "The buyer flow makes the request useful before it ever reaches a supplier: vehicle, part, preferences, location, notes, and photos.": "يجعل مسار المشتري الطلب واضحاً قبل أن يصل للمورّد: المركبة، القطعة، التفضيلات، الموقع، الملاحظات، والصور.", "Condition preference": "تفضيل الحالة", "Part type preference": "تفضيل نوع القطعة", "Suppliers get enough information to decide if they carry the part, then send a quote with price, delivery, warranty, and real photos.": "يحصل المورّد على معلومات كافية لتحديد توفر القطعة، ثم يرسل عرضاً يتضمن السعر والتوصيل والضمان والصور الحقيقية.", "Request details": "تفاصيل الطلب", "Don't carry this": "غير متوفر لدي", "Send quote": "إرسال عرض", "Quotes stay attached to the request so the buyer can compare suppliers, prices, condition, delivery terms, photos, and messages.": "تبقى العروض مرتبطة بالطلب حتى يستطيع المشتري مقارنة المورّدين والأسعار والحالة وشروط التوصيل والصور والرسائل.", "Actual photos": "صور حقيقية", "Delivery option": "خيار التوصيل", "The buyer opens chat only when needed. Safety warnings and photo reporting keep the conversation more controlled.": "يفتح المشتري المحادثة عند الحاجة فقط. تنبيهات الأمان والإبلاغ عن الصور تجعل المحادثة أكثر ضبطاً.", "Payment warning": "تنبيه الدفع", "chat-screen": "شاشة المحادثة", "Supplier sees live buyer demand": "المورّد يرى الطلبات المباشرة", "The supplier can understand what buyers are asking for, but sensitive buyer visibility and quote sending can stay locked.": "يستطيع المورّد فهم ما يبحث عنه المشترون، مع إبقاء البيانات الحساسة وإرسال العروض مقفلة حتى التفعيل.", "Demand visible": "الطلب واضح", "Unlock value": "فتح القيمة", "Supplier submits payment proof": "المورّد يرفع إثبات الدفع", "The supplier uploads a Payment receipt tied to a selected plan, price, duration, and supplier alias.": "يرفع المورّد إيصالاً مرتبطاً بالخطة والسعر والمدة واسم الحساب.", "Admin reviews and activates": "الإدارة تراجع وتفعّل", "Once approved, the supplier account can receive the subscription expiry date and unlock quoting tools.": "بعد الموافقة، يحصل حساب المورّد على تاريخ انتهاء الاشتراك وتُفتح أدوات إرسال العروض.", "Admin approval": "موافقة الإدارة", "Locked": "مقفل", "buyer names before activation": "أسماء المشترين قبل التفعيل", "Receipt": "إيصال", "payment proof upload flow": "مسار رفع إثبات الدفع", "Expiry": "انتهاء", "supplier subscription control": "تحكم باشتراك المورّد", "Payment review queue": "قائمة مراجعة المدفوعات", "Pending": "قيد المراجعة", "Approved": "موافق عليه", "Rejected": "مرفوض", "Business verification review": "مراجعة توثيق الأعمال", "Buyer business verification can be pending, approved, or rejected, with registration photos and rejection messaging tied into the profile.": "يمكن أن يكون توثيق أعمال المشتري قيد المراجعة أو مقبولاً أو مرفوضاً، مع ربط صور التسجيل ورسائل الرفض بالحساب.", "Report moderation": "إدارة البلاغات", "Images, buyers, and sellers can be reported with related request, quote, image URL, role, and user context for admin follow-up.": "يمكن الإبلاغ عن الصور أو المشترين أو البائعين مع ربط البلاغ بالطلب أو العرض أو رابط الصورة أو الدور أو بيانات المستخدم لمتابعة الإدارة.", "Image report": "بلاغ صورة", "Buyer report": "بلاغ مشتري", "Seller report": "بلاغ بائع", "Push setup diagnostics": "تشخيص إعداد الإشعارات", "Push setup logs can save the step, status, message, platform, project ID, and extra debugging data so notification problems are traceable.": "تحفظ سجلات الإشعارات الخطوة والحالة والرسالة والمنصة ومعرّف المشروع وبيانات التشخيص الإضافية حتى يمكن تتبع المشاكل.", "Device": "الجهاز", "Debug": "تشخيص", "supplier_payment_requests": "طلبات دفع المورّدين", "pending review": "قيد المراجعة", "business_registration_url": "رابط تسجيل الأعمال", "verify profile": "توثيق الحساب", "diagnose": "تشخيص", "last seen": "آخر ظهور", "reports": "بلاغات", "moderate": "مراجعة", "Mobile app layer": "طبقة تطبيق الجوال", "Buyer / Supplier": "مشتري / مورّد", "Supabase data layer": "طبقة بيانات Supabase", "Requests, quotes, messages, profiles, presence, devices, push tokens, payments, and debug logs live in structured backend tables.": "تعيش الطلبات والعروض والرسائل والحسابات والتواجد والأجهزة ورموز الإشعارات والمدفوعات وسجلات التشخيص في جداول خلفية منظمة.", "Tables": "جداول", "Storage": "تخزين", "Media pipeline": "مسار الوسائط", "Images are prepared, compressed, uploaded into storage, and attached to request, quote, chat, registration, or payment records.": "تتم تهيئة الصور وضغطها ورفعها للتخزين وربطها بسجلات الطلب أو العرض أو المحادثة أو التسجيل أو الدفع.", "Storage URLs": "روابط تخزين", "Notification layer": "طبقة الإشعارات", "Expo push setup captures device, platform, token, permission status, and debug logs so notification delivery can be traced.": "يسجل إعداد إشعارات Expo الجهاز والمنصة والرمز وحالة الصلاحيات وسجلات التشخيص حتى يمكن تتبع وصول الإشعارات.", "Expo Push": "إشعارات Expo", "Diagnostics": "تشخيص", "part_requests": "طلبات القطع", "buyer demand": "طلب المشتري", "part_quotes": "عروض القطع", "supplier offers": "عروض المورّد", "negotiation": "التفاوض", "user_profiles": "حسابات المستخدمين", "roles + status": "الأدوار والحالات", "notifications": "الإشعارات", "device tracking": "تتبع الأجهزة", "live presence": "التواجد المباشر", "Buyer creates request": "المشتري ينشئ الطلب", "Supabase stores request + photos": "Supabase يحفظ الطلب والصور", "Supplier sees realtime demand": "المورّد يرى الطلب مباشرة", "Supplier submits quote + photos": "المورّد يرسل العرض والصور", "Buyer compares offers": "المشتري يقارن العروض", "Chat opens when buyer starts": "المحادثة تُفتح عند بدء المشتري", "Status updates clean the tabs": "تحديث الحالة ينظف التبويبات", "A buyer calls multiple shops, repeats the same car details, sends photos everywhere, waits for random replies, and loses track of prices.": "يتصل المشتري بعدة محلات، يكرر نفس بيانات السيارة، يرسل الصور في كل مكان، ينتظر ردوداً عشوائية، ثم يضيع بين الأسعار.", "Phone calls": "اتصالات", "Messaging mess": "رسائل مشتتة", "No comparison": "لا توجد مقارنة", "One request creates organized demand. Suppliers quote in one place, and the buyer compares price, delivery, warranty, photos, and chat history.": "طلب واحد ينشئ طلباً منظماً. يرسل المورّدون عروضهم في مكان واحد، ويقارن المشتري السعر والتوصيل والضمان والصور وسجل المحادثة.", "One request": "طلب واحد", "Multiple quotes": "عدة عروض", "Clean decision": "قرار واضح", "Suppliers stop waiting for random foot traffic. They see live part demand and can choose which requests are worth quoting.": "لا ينتظر المورّدون العملاء العشوائيين فقط. يرون الطلبات المباشرة ويختارون ما يستحق إرسال عرض.", "Live demand": "طلب مباشر", "Better leads": "فرص أفضل", "The marketplace owns the workflow: requests, quote activity, supplier subscriptions, moderation, user trust, and operational data.": "تملك المنصة مسار العمل بالكامل: الطلبات، نشاط العروض، اشتراكات المورّدين، المراجعة، ثقة المستخدمين، وبيانات التشغيل.", "Data": "بيانات", "Revenue": "إيرادات", "Control": "تحكم", "1 request": "طلب واحد", "replaces repeated calls": "يستبدل الاتصالات المتكررة", "Many quotes": "عدة عروض", "collected in one workflow": "مجموعة في مسار واحد", "supplier-side revenue path": "مسار إيراد من جهة المورّد", "status, safety, moderation, and ops": "حالات، أمان، مراجعة، وتشغيل", "Auto parts marketplaces": "أسواق قطع السيارات", "Supplier quote platforms": "منصات عروض المورّدين", "B2B request systems": "أنظمة طلبات للشركات", "Garage / workshop tools": "أدوات الورش ومراكز الخدمة", "Marketplace MVPs": "نماذج أولية للأسواق الرقمية", "Internal procurement apps": "تطبيقات مشتريات داخلية", "Buyer demand and supplier quoting are built as one controlled workflow.": "طلب المشتري وعرض المورّد مبنيان كمسار واحد منظم.", "Verification, moderation, diagnostics, presence, and payment review are part of the system.": "التوثيق والمراجعة والتشخيص والتواجد ومراجعة الدفع جزء من النظام.", "Realtime data, storage, push tokens, device IDs, and structured backend tables are included.": "البيانات المباشرة والتخزين ورموز الإشعارات ومعرّفات الأجهزة والجداول الخلفية المنظمة موجودة ضمن النظام.", "This section shows the features that make PartBid feel like a real business platform: trust, moderation, uploads, payment controls, push setup, presence, and bilingual copy.": "هذا القسم يوضح المزايا التي تجعل PartBid منصة أعمال حقيقية: الثقة، المراجعة، الرفع، التحكم بالدفع، إعداد الإشعارات، التواجد، والمحتوى ثنائي اللغة.", "Verification, reports, and safer buyer/supplier behavior.": "توثيق، بلاغات، وسلوك أكثر أماناً بين المشتري والمورّد.", "Photos are part of requests, quotes, chat, payments, and registrations.": "الصور جزء من الطلبات والعروض والمحادثات والمدفوعات والتسجيلات.", "Push tokens, device IDs, presence, and realtime updates support production use.": "رموز الإشعارات ومعرّفات الأجهزة والتواجد والتحديثات المباشرة تدعم الاستخدام الفعلي.", "PartBid has a clear lifecycle: buyer request, supplier review, quote, buyer decision, chat, and closed-loop states. That is what makes it feel like a real marketplace instead of a simple form.": "لدى PartBid دورة واضحة: طلب المشتري، مراجعة المورّد، العرض، قرار المشتري، المحادثة، وحالات الإغلاق. هذا ما يجعله سوقاً حقيقياً وليس نموذجاً بسيطاً.", "Statuses keep the app organized, decide what each role can see, and stop old requests or quotes from staying in the wrong tab.": "الحالات تنظم التطبيق، وتحدد ما يمكن لكل دور رؤيته، وتمنع الطلبات أو العروض القديمة من البقاء في تبويبات غير مناسبة.", "request lifecycle": "دورة الطلب", "Open → Quoted": "مفتوح ← تم التسعير", "supplier action": "إجراء المورّد", "Quoted → Accepted": "تم التسعير ← مقبول", "buyer decision": "قرار المشتري", "Open → Withdrawn": "مفتوح ← مسحوب", "buyer cleanup": "تنظيف من جهة المشتري", "Quoted → Closed": "تم التسعير ← مغلق", "tab cleanup": "تنظيف التبويبات", "These previews are not random decoration. They explain the real screens from the PartBid product: request creation, supplier request detail, quote comparison, and buyer-controlled chat.": "هذه المعاينات ليست مجرد زينة. إنها تشرح الشاشات الحقيقية في PartBid: إنشاء الطلب، تفاصيل طلب المورّد، مقارنة العروض، والمحادثة التي يتحكم بها المشتري.", "This section explains the system behind PartBid: the mobile app, Supabase tables, storage, realtime updates, push notifications, device IDs, and the request-to-quote data flow.": "هذا القسم يشرح النظام خلف PartBid: تطبيق الجوال، جداول Supabase، التخزين، التحديثات المباشرة، الإشعارات، معرّفات الأجهزة، ومسار البيانات من الطلب إلى العرض.", "A client should instantly understand the business problem: part hunting is slow, scattered, and hard to compare. PartBid turns that messy process into organized demand, supplier competition, and a monetizable platform.": "يجب أن يفهم العميل المشكلة التجارية فوراً: البحث عن القطع بطيء ومشتت وصعب المقارنة. يحوّل PartBid هذه الفوضى إلى طلب منظم، وتنافس بين المورّدين، ومنصة قابلة لتحقيق الإيراد.", "This idea can be reused beyond auto parts.": "يمكن استخدام نفس الفكرة خارج مجال قطع السيارات.", "Task 11 · final conversion section": "قسم التحويل النهائي", "PartBid is the example. The same structure can be used for any business where customers request something, suppliers respond, admins control quality, and the platform needs a real backend.": "PartBid هو المثال. يمكن استخدام نفس الهيكل لأي نشاط يرسل فيه العملاء طلبات، يرد فيه المورّدون، تراقب الإدارة الجودة، وتحتاج المنصة إلى خلفية تقنية حقيقية.", "Darik Technologies | Business Apps Built From Idea to Launch": "Darik Technologies | تطبيقات وأنظمة أعمال من الفكرة إلى الإطلاق", "Darik Technologies builds mobile apps, web apps, dashboards, marketplaces, booking systems, ordering platforms, and internal business tools for real companies.": "تبني Darik Technologies تطبيقات جوال، تطبيقات ويب، لوحات تحكم، أسواق رقمية، أنظمة حجوزات، منصات طلبات، وأدوات داخلية للشركات الحقيقية.", "Mobile Apps": "تطبيقات جوال", "Polished iOS and Android apps for customers, staff, drivers, suppliers, bookings, ordering, and daily business workflows.": "تطبيقات iOS وAndroid مصقولة للعملاء والموظفين والسائقين والمورّدين والحجوزات والطلبات وسير العمل اليومي.", "Push Alerts": "تنبيهات فورية", "Clean UX": "تجربة استخدام واضحة", "Web Apps & Dashboards": "تطبيقات ويب ولوحات تحكم", "Clean admin panels and portals for approvals, reports, users, operations, and the controls your team needs every day.": "لوحات إدارة وبوابات واضحة للموافقات والتقارير والمستخدمين والتشغيل وأدوات التحكم التي يحتاجها فريقك يومياً.", "Admin Panels": "لوحات إدارة", "Marketplaces & Platforms": "أسواق ومنصات رقمية", "Multi-sided platforms with customer flows, vendor portals, quote requests, orders, notifications, and backend logic.": "منصات متعددة الأطراف تشمل مسارات العملاء، بوابات المورّدين، طلبات العروض، الطلبات، الإشعارات، والمنطق الخلفي.", "Multi-vendor": "متعدد المورّدين", "MVPs & Product Strategy": "النماذج الأولية واستراتيجية المنتج", "Clear product planning for rough ideas: features, user journeys, launch scope, and what actually makes commercial sense.": "تخطيط واضح للأفكار الأولية: المزايا، رحلات المستخدم، نطاق الإطلاق، وما له قيمة تجارية فعلية.", "MVP Scope": "نطاق النسخة الأولى", "Feature Plan": "خطة المزايا", "User Flow": "مسار المستخدم", "Launch Build": "بناء الإطلاق", "Darik Marketplace": "Darik Marketplace", "Retail marketplace platform": "منصة سوق تجزئة", "A marketplace experience built around product discovery, ordering, delivery flows, retailer operations, driver workflows, returns, and admin control.": "تجربة سوق مبنية حول اكتشاف المنتجات، الطلبات، مسارات التوصيل، عمليات التجار، عمل السائقين، المرتجعات، وتحكم الإدارة.", "Customer App": "تطبيق العميل", "Admin Dashboard": "لوحة الإدارة", "4 apps": "4 تطبيقات", "connected system": "نظام مترابط", "View Darik features": "عرض مزايا Darik", "Auto parts quote-request platform": "منصة طلب عروض لقطع السيارات", "A request-and-quote system that connects garages with suppliers, allowing businesses to receive multiple part offers in one organized workflow.": "نظام طلبات وعروض يربط الورش بالمورّدين، ويسمح للشركات باستقبال عدة عروض للقطع ضمن مسار واحد منظم.", "Supplier Portal": "بوابة المورّد", "quote workflow": "مسار العروض", "View PartBid features": "عرض مزايا PartBid", "Tawleh Manager": "Tawleh Manager", "Restaurant table ordering system": "نظام طلبات الطاولات للمطاعم", "A QR-based dine-in ordering platform designed for restaurants that need table-level ordering, staff visibility, and simple branch operations.": "منصة طلبات داخلية عبر QR للمطاعم التي تحتاج طلبات حسب الطاولة، رؤية للموظفين، وتشغيل بسيط للفروع.", "QR Ordering": "طلبات QR", "Restaurant Tech": "تقنيات المطاعم", "table ordering": "طلبات الطاولات", "Business Operations Tools": "أدوات تشغيل الأعمال", "Internal automation systems": "أنظمة أتمتة داخلية", "Custom dashboards and workflow tools for companies that need cleaner reporting, discrepancy tracking, approvals, and less manual paperwork.": "لوحات مخصصة وأدوات سير عمل للشركات التي تحتاج تقارير أوضح، تتبع اختلافات، موافقات، وتقليل الأعمال الورقية.", "workflow control": "تحكم بسير العمل", "Understand the business": "فهم العمل", "Before building screens, We map the actual problem, users, workflow, money flow, and operational requirements.": "قبل بناء الشاشات، نحدد المشكلة الحقيقية والمستخدمين وسير العمل وحركة المال والمتطلبات التشغيلية.", "Design the product flow": "تصميم مسار المنتج", "We define the core features, user journeys, database needs, admin controls, and what should be included in the launch version.": "نحدد المزايا الأساسية، رحلات المستخدم، احتياجات قاعدة البيانات، أدوات الإدارة، وما يجب أن يدخل نسخة الإطلاق.", "UX Flow": "مسار تجربة المستخدم", "Build the real system": "بناء النظام الحقيقي", "The app, dashboard, backend, authentication, notifications, database, and logic are built as one connected product.": "يتم بناء التطبيق ولوحة التحكم والخلفية التقنية وتسجيل الدخول والإشعارات وقاعدة البيانات والمنطق كمنتج واحد مترابط.", "Prepare for launch": "التحضير للإطلاق", "We focus on testing, cleanup, real-world use cases, and making sure the product is ready for customers or internal teams.": "نركز على الاختبار والتنظيف وحالات الاستخدام الواقعية والتأكد أن المنتج جاهز للعملاء أو الفرق الداخلية.", "Product thinking": "تفكير منتج", "Feature planning, user journeys, MVP scope, and business logic before writing code.": "تخطيط المزايا، رحلات المستخدم، نطاق النسخة الأولى، ومنطق العمل قبل كتابة الكود.", "MVP Planning": "تخطيط النسخة الأولى", "UI/UX Flows": "مسارات UI/UX", "Product Strategy": "استراتيجية المنتج", "Launch Scope": "نطاق الإطلاق", "Mobile & web builds": "بناء الجوال والويب", "Customer apps, staff tools, web apps, dashboards, and responsive business portals.": "تطبيقات عملاء، أدوات موظفين، تطبيقات ويب، لوحات تحكم، وبوابات أعمال متجاوبة.", "Admin Dashboards": "لوحات إدارة", "Backend & data": "الخلفية والبيانات", "Databases, authentication, storage, APIs, roles, permissions, and real workflows.": "قواعد بيانات، تسجيل دخول، تخزين، واجهات API، أدوار، صلاحيات، ومسارات عمل حقيقية.", "Database Design": "تصميم قاعدة البيانات", "Authentication": "تسجيل الدخول", "Operations logic": "منطق التشغيل", "Orders, bookings, marketplaces, notifications, approvals, reports, and automation.": "طلبات، حجوزات، أسواق رقمية، إشعارات، موافقات، تقارير، وأتمتة.", "Push Notifications": "إشعارات فورية", "API Integration": "ربط API", "Marketplace Apps": "تطبيقات أسواق رقمية", "Business Automation": "أتمتة الأعمال", "Start a free quote": "ابدأ عرضاً مجانياً", "Business apps built properly": "تطبيقات أعمال مبنية بشكل صحيح", "Services": "الخدمات", "Process": "العملية", "Quote": "عرض", "Digital products built to move your business.": "منتجات رقمية مبنية لتحريك عملك للأمام.", "Innovate • Build • Scale": "ابتكر • ابنِ • توسّع", "Business app systems": "أنظمة تطبيقات الأعمال", "Business apps built like": "تطبيقات أعمال مبنية كما تستخدمها", "real companies": "الشركات الحقيقية", "use them.": "فعلياً.", "View selected work": "عرض الأعمال المختارة", "Full product systems": "أنظمة منتجات كاملة", "Backend + database": "خلفية تقنية + قاعدة بيانات", "Logic that actually works": "منطق يعمل فعلاً", "Built for real workflows": "مبني لمسارات عمل حقيقية", "Apps people can run daily": "تطبيقات يمكن استخدامها يومياً", "Connect outside systems": "ربط أنظمة خارجية", "Plan": "تخطيط", "Build": "بناء", "App, dashboard, backend, database, and integrations together.": "التطبيق، لوحة التحكم، الخلفية، قاعدة البيانات، والربط معاً.", "Launch": "إطلاق", "Clean handoff, testing, and practical launch support.": "تسليم واضح، اختبار، ودعم عملي للإطلاق.", "System blueprint": "مخطط النظام", "Product Command Center": "مركز قيادة المنتج", "One connected product, not scattered screens.": "منتج واحد مترابط، وليس شاشات متناثرة.", "Apps": "تطبيقات", "Customer & staff": "العملاء والموظفون", "Backend logic": "منطق خلفي", "Admin dashboard": "لوحة إدارة", "What we build": "ما نبنيه", "Complete app": "تطبيقات كاملة", "systems": "أنظمة", ", not unfinished screens.": "، وليس شاشات غير مكتملة.", "A serious app needs more than a pretty interface. It needs the right structure, roles, data, admin controls, notifications, and business logic behind it.": "التطبيق الجاد يحتاج أكثر من واجهة جميلة. يحتاج بنية صحيحة، أدوار، بيانات، أدوات إدارة، إشعارات، ومنطق عمل خلفه.", "Learn more": "اعرف المزيد", "Selected work": "أعمال مختارة", "Built around real business use cases.": "مبنية حول حالات استخدام تجارية حقيقية.", "These projects show the type of thinking I bring to client work: not just coding, but turning a business process into a usable product.": "هذه المشاريع توضح طريقة التفكير التي نقدمها للعميل: ليس مجرد كود، بل تحويل عملية العمل إلى منتج قابل للاستخدام.", "Why it feels different": "لماذا التجربة مختلفة", "We think like founders, not just developers.": "نفكر كمؤسسين، وليس كمطورين فقط.", "We care about how the app will actually be used: who logs in, what each role sees, how orders or requests move, what admins need to control, what notifications matter, and what makes the product valuable after launch.": "نهتم بكيفية استخدام التطبيق فعلياً: من يسجل الدخول، ماذا يرى كل دور، كيف تتحرك الطلبات، ما الذي تحتاج الإدارة للتحكم به، ما الإشعارات المهمة، وما الذي يجعل المنتج ذا قيمة بعد الإطلاق.", "Users": "المستخدمون", "Admin": "إدارة", "Product": "المنتج", "Roles": "الأدوار", "Customer, staff, vendor, admin": "عميل، موظف، مورّد، إدارة", "Logic": "المنطق", "Rules, states, workflows": "قواعد، حالات، مسارات عمل", "Growth": "النمو", "Built with future changes in mind": "مبني مع مراعاة التوسع مستقبلاً", "The stack matters, but the workflow matters more.": "التقنية مهمة، لكن مسار العمل أهم.", "Tools are chosen around the business model, not just what looks good in a portfolio.": "نختار الأدوات حول نموذج العمل، وليس فقط ما يبدو جيداً في معرض الأعمال.", "How we work": "كيف نعمل", "A clear process from idea to launch.": "مسار واضح من الفكرة إلى الإطلاق.", "The goal is to avoid confusion, wasted money, and half-built apps. Every project starts with the business logic and ends with something usable.": "الهدف هو تجنب الفوضى وإهدار المال والتطبيقات نصف المكتملة. كل مشروع يبدأ بمنطق العمل وينتهي بشيء قابل للاستخدام.", "Phase": "مرحلة", "Start here": "ابدأ من هنا", "Have an app idea or business problem?": "لديك فكرة تطبيق أو مشكلة عمل؟", "Send the idea, the business goal, and what the app needs to do. We can help shape it into a real product plan and build the launch version the right way.": "أرسل الفكرة وهدف العمل وما يجب أن يفعله التطبيق. نساعدك في تحويله إلى خطة منتج حقيقية وبناء نسخة الإطلاق بالشكل الصحيح.", "No pressure, just a clear project review": "بدون ضغط، فقط مراجعة واضحة للمشروع", "Free quote flow": "مسار العرض المجاني", "Simple, serious, practical": "بسيط، جاد، وعملي", "Open": "فتح", "Explain the idea": "اشرح الفكرة", "What the app should do and who will use it.": "ما الذي يجب أن يفعله التطبيق ومن سيستخدمه.", "Apps, dashboard, backend, users, data, and workflow.": "تطبيقات، لوحة تحكم، خلفية تقنية، مستخدمون، بيانات، ومسار عمل.", "Get a realistic scope": "احصل على نطاق واقعي", "Clear next steps before spending money on development.": "خطوات واضحة قبل صرف المال على التطوير.", "Business-first": "العمل أولاً", "Built around the workflow, not just the screens.": "مبني حول مسار العمل، وليس الشاشات فقط.", "Launch-minded": "موجّه للإطلاق", "Focused on what can actually go live.": "يركز على ما يمكن إطلاقه فعلياً.", "Start your free quote": "ابدأ عرضك المجاني", "Mobile + Web + Admin Systems | Darik Technologies": "أنظمة جوال + ويب + إدارة | Darik Technologies", "A premium Darik Technologies service page explaining connected mobile apps, web portals, admin dashboards, backend logic, databases, and real business workflows.": "صفحة خدمة احترافية من Darik Technologies تشرح تطبيقات الجوال، بوابات الويب، لوحات الإدارة، المنطق الخلفي، قواعد البيانات، ومسارات العمل الحقيقية.", "Mobile App": "تطبيق جوال", "iOS + Android": "iOS + Android", "A customer, staff, driver, patient, retailer, or internal-team app built around the actual job people need to do.": "تطبيق للعميل أو الموظف أو السائق أو المريض أو التاجر أو الفريق الداخلي، مبني حول المهمة الفعلية التي يحتاجها المستخدم.", "Fast mobile UX": "تجربة جوال سريعة", "Role-based screens": "شاشات حسب الدور", "Real workflow actions": "إجراءات عمل حقيقية", "Web Portal": "بوابة ويب", "Browser access": "وصول من المتصفح", "A clean web experience for customers, employees, vendors, managers, or public visitors who need access from a laptop.": "تجربة ويب واضحة للعملاء أو الموظفين أو المورّدين أو المدراء أو الزوار الذين يحتاجون الوصول من الكمبيوتر.", "Responsive web app": "تطبيق ويب متجاوب", "Landing pages": "صفحات هبوط", "Client portals": "بوابات عملاء", "Desktop workflows": "مسارات عمل مكتبية", "Control center": "مركز التحكم", "The private command center where the business manages orders, users, requests, payouts, reports, approvals, and support.": "مركز قيادة خاص تدير منه الشركة الطلبات والمستخدمين والطلبات المالية والتقارير والموافقات والدعم.", "Manage everything": "إدارة كل شيء", "Operations tools": "أدوات تشغيل", "Backend & Database": "الخلفية وقاعدة البيانات", "Supabase, PostgreSQL-style data structure, authentication, storage, policies, and secure business logic.": "Supabase، بنية بيانات شبيهة بـ PostgreSQL، تسجيل دخول، تخزين، سياسات، ومنطق عمل آمن.", "User Roles & Permissions": "أدوار وصلاحيات المستخدمين", "Customer, staff, manager, admin, driver, vendor, support, accounting, or any role your business needs.": "عميل، موظف، مدير، إدارة، سائق، مورّد، دعم، محاسبة، أو أي دور يحتاجه عملك.", "Real Workflows": "مسارات عمل حقيقية", "Bookings, orders, requests, approvals, quotes, deliveries, support tickets, payouts, billing, and reports.": "حجوزات، طلبات، موافقات، عروض، توصيلات، تذاكر دعم، مدفوعات، فواتير، وتقارير.", "Push notifications, status updates, alerts, reminders, and important operational messages.": "إشعارات فورية، تحديثات حالة، تنبيهات، تذكيرات، ورسائل تشغيل مهمة.", "Payments & Billing": "المدفوعات والفوترة", "Optional payment integrations, invoices, balances, fees, receipts, payouts, and payment status tracking.": "ربط اختياري للمدفوعات، فواتير، أرصدة، رسوم، إيصالات، دفعات، وتتبع حالة الدفع.", "Maps & Location": "الخرائط والموقع", "Saved locations, map search, GPS checks, distance rules, driver tracking, route logic, and location-based actions.": "مواقع محفوظة، بحث خرائط، تحقق GPS، قواعد مسافة، تتبع سائق، منطق مسارات، وإجراءات حسب الموقع.", "Support & Messages": "الدعم والرسائل", "Support center, live chat, issue categories, conversation history, internal notes, and admin replies.": "مركز دعم، محادثة مباشرة، تصنيفات مشاكل، سجل محادثات، ملاحظات داخلية، وردود الإدارة.", "Analytics & Reports": "تحليلات وتقارير", "Sales, orders, activity, performance, payouts, user behavior, operational stats, and export-ready reports.": "مبيعات، طلبات، نشاط، أداء، دفعات، سلوك مستخدم، إحصاءات تشغيل، وتقارير جاهزة للتصدير.", "Security & Audit Logs": "الأمان وسجلات التدقيق", "Admin actions, access control, sensitive data rules, review queues, and accountability across the system.": "إجراءات الإدارة، التحكم بالوصول، قواعد البيانات الحساسة، قوائم المراجعة، والمحاسبة داخل النظام.", "Data model": "نموذج البيانات", "Map the workflow": "رسم مسار العمل", "We define every user role, every screen, and every business rule before touching design.": "نحدد كل دور للمستخدم، كل شاشة، وكل قاعدة عمل قبل البدء بالتصميم.", "Design the product": "تصميم المنتج", "We create a premium mobile/web/admin experience that feels simple even if the system is complex.": "نصمم تجربة جوال/ويب/إدارة احترافية تبدو بسيطة حتى لو كان النظام معقداً.", "Build the backend": "بناء الخلفية التقنية", "We structure the database, auth, storage, permissions, APIs, and operational logic correctly.": "نبني قاعدة البيانات، تسجيل الدخول، التخزين، الصلاحيات، واجهات API، والمنطق التشغيلي بشكل صحيح.", "Connect the apps": "ربط التطبيقات", "Mobile, web, and admin all work off the same live system so the business runs in real time.": "الجوال والويب والإدارة تعمل كلها على نفس النظام المباشر حتى يعمل النشاط في الوقت الحقيقي.", "Test real scenarios": "اختبار سيناريوهات حقيقية", "Orders, bookings, payouts, approvals, support, notifications, and edge cases are tested like a real launch.": "يتم اختبار الطلبات والحجوزات والدفعات والموافقات والدعم والإشعارات والحالات الخاصة كما لو كان إطلاقاً حقيقياً.", "Launch and improve": "الإطلاق والتحسين", "After launch, the system can expand with more roles, features, branches, markets, or dashboards.": "بعد الإطلاق، يمكن توسيع النظام بأدوار ومزايا وفروع وأسواق ولوحات إضافية.", "Edge cases": "الحالات الخاصة", "Launch check": "فحص الإطلاق", "New roles": "أدوار جديدة", "Quote →": "عرض →", "Back to Darik Technologies": "العودة إلى Darik Technologies", "Connected mobile web admin architecture": "بنية متصلة للجوال والويب والإدارة", "Mobile web admin build process": "عملية بناء الجوال والويب والإدارة", "Product design": "تصميم المنتج", "System deliverables": "مخرجات النظام", "Live": "مباشر", "Submit request": "إرسال الطلب", "Client Portal": "بوابة العميل", "Active": "نشط", "Operations Control": "تحكم تشغيلي", "Live system": "نظام مباشر", "Orders": "طلبات", "Tasks": "مهام", "Backend": "الخلفية", "Database + auth + logic": "قاعدة بيانات + دخول + منطق", "Desktop workflows connected": "مسارات مكتبية مترابطة", "Mobile + Web + Admin": "جوال + ويب + إدارة", "API": "API", "Free quote →": "عرض مجاني →", "← Back to Darik Technologies": "العودة إلى Darik Technologies ←", "Connected product systems": "أنظمة منتجات مترابطة", "Built by Darik Technologies": "من تنفيذ Darik Technologies", "Mobile + Web +": "جوال + ويب +", "One business system split into the right tools: a mobile app, a web portal, and an admin dashboard all connected to the same backend.": "نظام أعمال واحد مقسم إلى الأدوات الصحيحة: تطبيق جوال، بوابة ويب، ولوحة إدارة، كلها متصلة بنفس الخلفية.", "This is for businesses that need more than a pretty app. You get the customer-facing experience, the internal tools, the database, the roles, the workflows, and the control panel needed to actually run operations.": "هذا مخصص للشركات التي تحتاج أكثر من تطبيق جميل. تحصل على تجربة العملاء، الأدوات الداخلية، قاعدة البيانات، الأدوار، مسارات العمل، ولوحة التحكم اللازمة لتشغيل العمل فعلياً.", "Request a system like this →": "اطلب نظاماً مثل هذا →", "View system architecture": "عرض بنية النظام", "iPhone and Android experiences for customers or teams.": "تجارب iPhone وAndroid للعملاء أو الفرق.", "Web portal": "بوابة ويب", "Browser-based workflows for users who need desktop access.": "مسارات عمل من المتصفح للمستخدمين الذين يحتاجون الوصول من الكمبيوتر.", "Private control center for managing the whole business.": "مركز تحكم خاص لإدارة العمل بالكامل.", "Three products. One connected system.": "ثلاثة منتجات. نظام واحد مترابط.", "The mobile app, web portal, and admin dashboard should not feel like separate projects. They should feel like one machine.": "يجب ألا تبدو تطبيقات الجوال والويب ولوحة الإدارة كمشاريع منفصلة. يجب أن تعمل كآلة واحدة.", "The backend is what makes it real.": "الخلفية التقنية هي ما يجعله حقيقياً.", "The interface is only half the product. The database, roles, permissions, logic, and admin tools are what make it useful for a real business.": "الواجهة نصف المنتج فقط. قاعدة البيانات والأدوار والصلاحيات والمنطق وأدوات الإدارة هي ما يجعله مفيداً لشركة حقيقية.", "Customers, staff, drivers, vendors, or field teams use the system from iOS and Android.": "العملاء والموظفون والسائقون والمورّدون أو فرق الميدان يستخدمون النظام من iOS وAndroid.", "Push": "إشعارات", "GPS": "GPS", "Actions": "إجراءات", "Desktop-friendly access for clients, managers, employees, retailers, or partners.": "وصول مناسب للكمبيوتر للعملاء والمدراء والموظفين والتجار أو الشركاء.", "Portal": "بوابة", "Forms": "نماذج", "The private control center for orders, users, approvals, support, payouts, and reports.": "مركز تحكم خاص للطلبات والمستخدمين والموافقات والدعم والدفعات والتقارير.", "Live Backend": "خلفية مباشرة", "Database": "قاعدة بيانات", "Auth": "دخول", "One source of truth": "مصدر واحد للحقيقة", "Auth + Roles": "دخول + أدوار", "Who can do what": "من يستطيع فعل ماذا", "Files, images, docs": "ملفات، صور، مستندات", "Notifications": "إشعارات", "Status changes + alerts": "تغييرات حالة + تنبيهات", "Payments": "مدفوعات", "Invoices, fees, payouts": "فواتير، رسوم، دفعات", "Maps + GPS": "خرائط + GPS", "Location-aware workflows": "مسارات عمل حسب الموقع", "Audit Logs": "سجلات تدقيق", "Track important actions": "تتبع الإجراءات المهمة", "What a complete system can include.": "ما الذي يمكن أن يتضمنه النظام الكامل.", "Every business is different, but these are the common pieces that turn an idea into a usable platform.": "كل شركة مختلفة، لكن هذه هي القطع المشتركة التي تحول الفكرة إلى منصة قابلة للاستخدام.", "API integration that connects your business to the outside world.": "ربط API يصل عملك بالعالم الخارجي.", "When your platform needs to talk to payment providers, maps, AI tools, CRMs, accounting systems, WhatsApp, SMS, delivery tools, or internal databases, the API layer is what makes it work cleanly.": "عندما تحتاج منصتك للتواصل مع مزودي الدفع أو الخرائط أو أدوات الذكاء الاصطناعي أو أنظمة CRM أو المحاسبة أو الرسائل أو أدوات التوصيل أو قواعد البيانات الداخلية، فإن طبقة API هي ما يجعل ذلك يعمل بشكل منظم.", "API Layer": "طبقة API", "Connect": "ربط", "Validate": "تحقق", "Sync": "مزامنة", "Maps": "خرائط", "AI": "ذكاء اصطناعي", "WhatsApp": "رسائل", "CRM": "CRM", "Accounting": "المحاسبة", "Third-party services": "خدمات خارجية", "Connect the platform to outside tools like payment gateways, map providers, AI services, messaging platforms, and verification providers.": "اربط المنصة بأدوات خارجية مثل بوابات الدفع ومزودي الخرائط وخدمات الذكاء الاصطناعي ومنصات الرسائل ومزودي التحقق.", "Internal business systems": "أنظمة الأعمال الداخلية", "Link the app to existing company systems, databases, dashboards, spreadsheets, or operational tools without forcing staff to double-enter data.": "اربط التطبيق بأنظمة الشركة الحالية وقواعد البيانات ولوحات التحكم والجداول وأدوات التشغيل دون إجبار الموظفين على إدخال البيانات مرتين.", "Secure data flow": "مسار بيانات آمن", "Use clean rules for what data gets sent, what comes back, who can trigger it, what gets logged, and what happens when an API fails.": "استخدم قواعد واضحة لما يتم إرساله واستقباله، ومن يستطيع تشغيله، وما يتم تسجيله، وما يحدث عند فشل API.", "Webhooks": "Webhooks", "Secure keys": "مفاتيح آمنة", "Retry logic": "منطق إعادة المحاولة", "Audit logs": "سجلات تدقيق", "Rate limits": "حدود معدل الاستخدام", "Error handling": "معالجة الأخطاء", "How we build it without making a mess.": "كيف نبنيه دون فوضى.", "A multi-app system needs planning. The goal is to make complex operations feel simple to the people using it every day.": "النظام متعدد التطبيقات يحتاج تخطيطاً. الهدف أن يشعر المستخدمون اليوميون بأن العمليات المعقدة بسيطة.", "Ready to build": "جاهز للبناء", "Turn your business into a connected product system.": "حوّل عملك إلى نظام منتج مترابط.", "Mobile app, web portal, admin dashboard, backend, roles, permissions, database, reports, notifications, and real workflows — built as one serious platform.": "تطبيق جوال، بوابة ويب، لوحة إدارة، خلفية تقنية، أدوار، صلاحيات، قاعدة بيانات، تقارير، إشعارات، ومسارات عمل حقيقية — مبنية كمنصة جادة واحدة.", "No pressure. Just clarity.": "بدون ضغط. فقط وضوح.", "Start with a free quote →": "ابدأ بعرض مجاني →", "Mobile + Web + Admin Systems": "أنظمة جوال + ويب + إدارة", "Capabilities": "القدرات", "Darik Marketplace Features | Darik Technologies": "مزايا Darik Marketplace | Darik Technologies", "A dedicated Darik Marketplace case-study page showing the customer app, retailer portal, driver app, delivery GPS, support center, and admin operations system.": "صفحة دراسة حالة مخصصة لـ Darik Marketplace تعرض تطبيق العميل، بوابة التاجر، تطبيق السائق، تتبع التوصيل، مركز الدعم، ونظام التشغيل الإداري.", "Categories, Best Sellers, cart, order review, delivery location, Free Next-Day, Express Delivery, Darik Promise returns, and Support Center.": "تصنيفات، الأكثر مبيعاً، السلة، مراجعة الطلب، موقع التوصيل، توصيل اليوم التالي، توصيل سريع، مرتجعات Darik Promise، ومركز الدعم.", "Retailer Portal": "بوابة التاجر", "Retailer screening, Add New Product, approval workflow, official photo lock, inventory status, ads, payment balance, receipts, and support tickets.": "فحص التجار، إضافة منتج جديد، مسار الموافقة، قفل الصورة الرسمية، حالة المخزون، الإعلانات، الرصيد، الإيصالات، وتذاكر الدعم.", "Driver App": "تطبيق السائق", "Driver screening, GPS tracking, Go Online, warehouse pickup, active batch stops, route progress, delivery PIN, customer signature, and Mark Delivered.": "فحص السائقين، تتبع GPS، الدخول أونلاين، استلام من المستودع، نقاط دفعة التوصيل، تقدم المسار، رمز التسليم، توقيع العميل، وتحديد الطلب كمسلّم.", "Customer Orders, Customer Care, Stocker Orders, Dispatcher Screen, Locate Drivers, Returns Center, Support Inbox, AI Queue, P&L, and Admin Users.": "طلبات العملاء، رعاية العملاء، طلبات المخزن، شاشة التوزيع، تحديد مواقع السائقين، مركز المرتجعات، صندوق الدعم، قائمة الذكاء الاصطناعي، الأرباح والخسائر، ومستخدمي الإدارة.", "Delivery Operations": "عمليات التوصيل", "Next-Day Delivery Routes, driver locator, route optimization, delivery problems, return-to-warehouse flows, and live map operations.": "مسارات توصيل اليوم التالي، تحديد مواقع السائقين، تحسين المسارات، مشاكل التوصيل، مسارات الإرجاع للمستودع، وعمليات الخريطة المباشرة.", "Finance & Trust": "المالية والثقة", "Cleared payments, pending payouts, 24-hour clearing, balance receipts, ad fees, fulfillment fees, return credits, and Profit & Loss tracking.": "مدفوعات مصفّاة، دفعات معلقة، تصفية خلال 24 ساعة، إيصالات رصيد، رسوم إعلانات، رسوم تنفيذ، أرصدة مرتجعات، وتتبع الأرباح والخسائر.", "Product Discovery & Best Sellers": "اكتشاف المنتجات والأكثر مبيعاً", "Categories, product browsing, Best Sellers rows, related items, verified stock, search, and customer-friendly product cards.": "تصنيفات، تصفح المنتجات، صفوف الأكثر مبيعاً، منتجات ذات صلة، مخزون موثّق، بحث، وبطاقات منتجات سهلة للعملاء.", "Checkout & Delivery Choice": "الدفع واختيار التوصيل", "Cart, saved items, order review, Free Next-Day Delivery, Express Delivery, delivery fee logic, and 8 PM cutoff messaging.": "السلة، العناصر المحفوظة، مراجعة الطلب، توصيل اليوم التالي، توصيل سريع، منطق رسوم التوصيل، ورسائل وقت الإغلاق.", "Location & Live Tracking": "الموقع والتتبع المباشر", "Delivery Location, Search Google Maps Location, selected delivery pin, driver pin, ETA, and location confirmation before checkout.": "موقع التوصيل، البحث في خرائط Google، نقطة التوصيل المختارة، موقع السائق، وقت الوصول المتوقع، وتأكيد الموقع قبل الدفع.", "Darik Promise Returns": "مرتجعات Darik Promise", "24-hour return window, Darik Credit from returns, free exact replacement for defective items, pickup fee rules, and return status tracking.": "نافذة إرجاع 24 ساعة، رصيد Darik من المرتجعات، استبدال مطابق مجاني للمنتجات المعيبة، قواعد رسوم الاستلام، وتتبع حالة الإرجاع.", "Retailer Inventory Tools": "أدوات مخزون التاجر", "Add New Product, approval rule, raw photo review, official photo lock, live products, paused products, archived items, and inventory removal.": "إضافة منتج جديد، قاعدة الموافقة، مراجعة الصورة الخام، قفل الصورة الرسمية، منتجات مباشرة، منتجات موقوفة، عناصر مؤرشفة، وإزالة المخزون.", "Retailer Money & Ads": "أموال وإعلانات التاجر", "Cleared payment, pending payout, balance receipts, payout ledger, paid ad requests, current live ads, and ad performance insights.": "مدفوعات مصفّاة، دفعات معلقة، إيصالات رصيد، سجل دفعات، طلبات إعلانات مدفوعة، إعلانات نشطة، وتحليلات أداء الإعلانات.", "Driver Warehouse Workflow": "مسار المستودع للسائق", "Head to Darik Warehouse, arrived warehouse, order numbers to pick up, dispatcher release, active pickup, and cash / driver summary.": "التوجه إلى مستودع Darik، الوصول للمستودع، أرقام الطلبات للاستلام، إفراج الموزع، استلام نشط، وملخص النقد والسائق.", "Delivery Route Execution": "تنفيذ مسار التوصيل", "Active Batch Stops, route progress, call/map actions, delivery PIN, receiver name, customer signature, Mark Delivered, and return-to-warehouse problems.": "نقاط دفعة نشطة، تقدم المسار، إجراءات الاتصال/الخريطة، رمز التسليم، اسم المستلم، توقيع العميل، تحديد كمسلم، ومشاكل الإرجاع للمستودع.", "Admin Operating System": "نظام التشغيل الإداري", "Customer Orders, Customer Care, Stocker Orders, Dispatcher Screen, Locate Drivers, Returns Center, Support Inbox, AI Queue, accounting, P&L, and permissions.": "طلبات العملاء، رعاية العملاء، طلبات المخزن، شاشة التوزيع، تحديد السائقين، مركز المرتجعات، صندوق الدعم، قائمة الذكاء الاصطناعي، المحاسبة، الأرباح والخسائر، والصلاحيات.", "Best Sellers": "الأكثر مبيعاً", "Verified Stock": "مخزون موثّق", "Pinned Location": "موقع مثبت", "24h Window": "نافذة 24 ساعة", "Darik Credit": "رصيد Darik", "Add Product": "إضافة منتج", "Photo Lock": "قفل الصورة", "Cleared payments": "مدفوعات مصفّاة", "Paid Ads": "إعلانات مدفوعة", "Cash Summary": "ملخص النقد", "Delivery PIN": "رمز التسليم", "Mark Delivered": "تحديد كمسلم", "P&L": "الأرباح والخسائر", "Customer App Experience": "تجربة تطبيق العميل", "Best Sellers, categories, cart, delivery location, Free Next-Day, Express Delivery, Darik Promise returns, and support.": "الأكثر مبيعاً، التصنيفات، السلة، موقع التوصيل، توصيل اليوم التالي، التوصيل السريع، مرتجعات Darik Promise، والدعم.", "Customer app": "تطبيق العميل", "Shop + deliver": "تسوق + توصيل", "Retailer Portal Experience": "تجربة بوابة التاجر", "Retailer dashboard, Add New Product, official photo approval, inventory status, ads, payment balance, receipts, and support tickets.": "لوحة التاجر، إضافة منتج جديد، موافقة الصورة الرسمية، حالة المخزون، الإعلانات، الرصيد، الإيصالات، وتذاكر الدعم.", "Retailer portal": "بوابة التاجر", "Inventory + money": "مخزون + أموال", "Driver App Experience": "تجربة تطبيق السائق", "Go Online, warehouse pickup, active batch stops, route progress, maps, delivery PIN, signature, and Mark Delivered.": "الدخول أونلاين، استلام من المستودع، نقاط دفعة نشطة، تقدم المسار، الخرائط، رمز التسليم، التوقيع، وتحديد كمسلم.", "Driver app": "تطبيق السائق", "Pickup + route": "استلام + مسار", "Admin Dashboard Experience": "تجربة لوحة الإدارة", "Orders, Customer Care, Stocker Orders, Dispatcher Screen, Locate Drivers, Returns Center, Support Inbox, AI Queue, Accounting, and P&L.": "طلبات، رعاية العملاء، طلبات المخزن، شاشة التوزيع، تحديد السائقين، مركز المرتجعات، صندوق الدعم، قائمة الذكاء الاصطناعي، المحاسبة، والأرباح والخسائر.", "Command center": "مركز قيادة", "Darik Marketplace platform highlights": "أبرز مزايا منصة Darik Marketplace", "Darik included platform capabilities": "قدرات منصة Darik المشمولة", "Darik operations roles": "أدوار تشغيل Darik", "Darik connected marketplace ecosystem": "منظومة Darik Marketplace المترابطة", "Platform build highlights": "أبرز نقاط بناء المنصة", "Cart": "السلة", "Delivery Location": "موقع التوصيل", "See all": "عرض الكل", "Free Next-Day": "توصيل اليوم التالي", "Express": "سريع", "Official photo approval": "اعتماد الصورة الرسمية", "Add New Product": "إضافة منتج جديد", "Online": "متصل", "Active Batch Stops": "نقاط دفعة نشطة", "2 delivered • 1 remaining": "تم تسليم 2 • متبقٍ 1", "Call • Map • PIN": "اتصال • خريطة • رمز", "Locate Drivers": "تحديد السائقين", "Next-Day Route": "مسار اليوم التالي", "Optimized": "محسّن", "Ready to pay": "جاهز للدفع", "Pending payment": "دفعة معلقة", "24-hour rule": "قاعدة 24 ساعة", "Profit & Loss": "الأرباح والخسائر", "Customer marketplace": "سوق العملاء", "Search Google Maps Location": "البحث في خرائط Google", "LIVE RETAILER PORTAL": "بوابة التاجر المباشرة", "Inventory, ads, payouts": "مخزون، إعلانات، دفعات", "Ready": "جاهز", "Ads": "إعلانات", "Receipts": "إيصالات", "Product Information": "معلومات المنتج", "Raw photo locked after review": "الصورة الخام مقفلة بعد المراجعة", "Submit Product": "إرسال المنتج", "Warehouse pickup + route": "استلام من المستودع + المسار", "Head to Darik Warehouse": "التوجه إلى مستودع Darik", "Pickup released by dispatcher": "تم الإفراج عن الاستلام من الموزع", "Call • Map • Delivery PIN": "اتصال • خريطة • رمز التسليم", "Receiver signature": "توقيع المستلم", "LIVE SUPABASE ADMIN DASHBOARD": "لوحة Supabase الإدارية المباشرة", "Operations command center": "مركز قيادة العمليات", "Care": "رعاية العملاء", "Stocker": "المخزن", "Drivers": "السائقون", "Returns": "المرتجعات", "AI Queue": "قائمة الذكاء الاصطناعي", "Active Orders": "طلبات نشطة", "Photo Review": "مراجعة الصور", "Support Inbox": "صندوق الدعم", "Marketplace case study": "دراسة حالة السوق", "← Selected work": "الأعمال المختارة ←", "Platform": "المنصة", "Features": "المزايا", "Request a build like this →": "اطلب بناء نظام مثل هذا →", "← Work": "الأعمال ←", "← Back to selected work": "العودة للأعمال المختارة ←", "Features overview": "نظرة عامة على المزايا", "A connected multi-app commerce and logistics platform built for scale.": "منصة تجارة ولوجستيات مترابطة متعددة التطبيقات مبنية للتوسع.", "Darik powers the full commerce and delivery ecosystem in one integrated platform. Customers shop, retailers manage inventory, drivers deliver with precision, and operators keep everything running in real time.": "تشغّل Darik منظومة التجارة والتوصيل كاملة ضمن منصة واحدة متكاملة. يتسوق العملاء، يدير التجار المخزون، يوصّل السائقون بدقة، وتتابع فرق التشغيل كل شيء مباشرة.", "View system overview": "عرض نظرة النظام", "Customer, retailer, driver, and admin apps reviewed": "تطبيقات العميل والتاجر والسائق والإدارة موضحة", "Orders, delivery, returns, support, ads, payouts, and P&L": "طلبات، توصيل، مرتجعات، دعم، إعلانات، دفعات، وأرباح وخسائر", "Screens below are mapped to the real Darik source code": "الشاشات أدناه مبنية على كود Darik الحقيقي", "Live Supabase Admin Dashboard": "لوحة Supabase الإدارية المباشرة", "Darik Operations Command Center": "مركز قيادة عمليات Darik", "Customer Orders": "طلبات العملاء", "Customer Care": "رعاية العملاء", "Stocker Orders": "طلبات المخزن", "Dispatcher": "الموزع", "Returns Center": "مركز المرتجعات", "Live marketplace flow": "مسار السوق المباشر", "Retailer payout rule": "قاعدة دفعات التاجر", "Darik Promise workflow": "مسار Darik Promise", "Operations accounting": "محاسبة التشغيل", "Next-Day Delivery Routes": "مسارات توصيل اليوم التالي", "Route optimization": "تحسين المسارات", "Ready for dispatcher": "جاهز للموزع", "Stocker picked": "تم تجهيز المخزن", "Live map operations": "عمليات الخريطة المباشرة", "AI Photo Queue": "قائمة صور الذكاء الاصطناعي", "Retailer Payouts": "دفعات التجار", "Admin Users": "مستخدمو الإدارة", "Darik Promise • Returns & credit": "Darik Promise • المرتجعات والرصيد", "Official photo approval • inventory status": "اعتماد الصورة الرسمية • حالة المخزون", "Call • Map • Delivery PIN • Signature": "اتصال • خريطة • رمز تسليم • توقيع", "One ecosystem. Every role connected.": "منظومة واحدة. كل دور متصل.", "Darik is not one simple app. It is a multi-role platform where each user type gets the tools they need.": "Darik ليس تطبيقاً بسيطاً واحداً. إنه منصة متعددة الأدوار يحصل فيها كل نوع مستخدم على الأدوات التي يحتاجها.", "What Darik includes": "ما الذي يتضمنه Darik", "Everything needed to launch and scale a commerce delivery business.": "كل ما يلزم لإطلاق وتوسيع نشاط تجارة وتوصيل.", "From shopping and checkout to drivers, support, payouts, admin controls, and live operational logic.": "من التسوق والدفع إلى السائقين والدعم والدفعات وأدوات الإدارة والمنطق التشغيلي المباشر.", "Source-backed": "مبني على المصدر", "Content mapped from the customer, retailer, driver, and admin app code.": "المحتوى مبني على كود تطبيقات العميل والتاجر والسائق والإدارة.", "Multi-role": "متعدد الأدوار", "Customer, retailer, driver, support, warehouse, dispatch, accounting, and admin workflows.": "مسارات عمل للعميل والتاجر والسائق والدعم والمستودع والتوزيع والمحاسبة والإدارة.", "Operational": "تشغيلي", "Orders, delivery, returns, payouts, ads, support, review queues, and P&L in one system.": "طلبات، توصيل، مرتجعات، دفعات، إعلانات، دعم، قوائم مراجعة، وأرباح وخسائر في نظام واحد.", "Built as a real operations ecosystem.": "مبني كمنظومة تشغيل حقيقية.", "Darik connects customers, retailers, drivers, warehouse, support, accounting, AI review queues, and admin operators in one secure real-time platform.": "يربط Darik العملاء والتجار والسائقين والمستودع والدعم والمحاسبة وقوائم مراجعة الذكاء الاصطناعي ومشغلي الإدارة ضمن منصة آمنة ومباشرة.", "Warehouse": "المستودع", "Build a system like this →": "ابنِ نظاماً مثل هذا →", "Support": "الدعم", "Payments + P&L": "المدفوعات + الأرباح والخسائر", "Darik Platform": "منصة Darik", "Shop, order, delivery location, returns, and support.": "تسوق، طلب، موقع توصيل، مرتجعات، ودعم.", "Products, inventory, ads, receipts, and payment payouts.": "منتجات، مخزون، إعلانات، إيصالات، ودفعات.", "Warehouse pickup, active stops, PIN, signature, and delivery.": "استلام من المستودع، نقاط نشطة، رمز، توقيع، وتوصيل.", "Orders, care, dispatcher, returns, users, P&L, and queues.": "طلبات، رعاية، توزيع، مرتجعات، مستخدمون، أرباح وخسائر، وقوائم.", "See Darik in action.": "شاهد Darik أثناء العمل.", "Each screen is designed around a real operational job, not just a pretty interface.": "كل شاشة مصممة حول مهمة تشغيلية حقيقية، وليس مجرد واجهة جميلة.", "Marketplace systems • apps • dashboards": "أنظمة أسواق رقمية • تطبيقات • لوحات تحكم", "Build your own platform": "ابنِ منصتك الخاصة", "Want a marketplace system like Darik?": "تريد نظام سوق مثل Darik؟", "We design and build scalable multi-app platforms that connect customers, businesses, drivers, support, and operations in real time.": "نصمم ونبني منصات متعددة التطبيقات قابلة للتوسع تربط العملاء والشركات والسائقين والدعم والتشغيل مباشرة.", "Mobile apps": "تطبيقات جوال", "Admin dashboards": "لوحات إدارة", "Delivery workflows": "مسارات التوصيل", "Support systems": "أنظمة الدعم", "Darik Marketplace case study": "دراسة حالة Darik Marketplace", "PartBid": "PartBid"};
  const root = document.querySelector("[data-smart-lang]");
  if (!root) return;

  const originalText = new WeakMap();
  const buttons = Array.from(document.querySelectorAll("[data-smart-lang-button]"));

  function shouldSkip(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    const tag = parent.tagName;
    return tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT";
  }

  function translateNode(node, lang) {
    if (shouldSkip(node)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue || "");
    const original = originalText.get(node) || "";
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = translations[trimmed];
    if (!translated) return;
    node.nodeValue = original.replace(trimmed, lang === "ar" ? translated : trimmed);
  }

  function applyLanguage(lang) {
    const safeLang = lang === "ar" ? "ar" : "en";
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateNode(node, safeLang));

    root.dataset.smartLang = safeLang;
    root.setAttribute("dir", safeLang === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", safeLang === "ar" ? "ar" : "en");
    document.documentElement.setAttribute("dir", safeLang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", safeLang === "ar" ? "ar" : "en");

    buttons.forEach((button) => {
      const active = button.getAttribute("data-smart-lang-button") === safeLang;
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { window.localStorage.setItem("darikSiteLanguage", safeLang); } catch (error) {}
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.getAttribute("data-smart-lang-button") || "en"));
  });

  let initial = "en";
  try {
    const saved = window.localStorage.getItem("darikSiteLanguage");
    if (saved === "ar" || saved === "en") initial = saved;
  } catch (error) {}

  applyLanguage(initial);
})();
          `,
        }}
      />

    </main>
  );
}