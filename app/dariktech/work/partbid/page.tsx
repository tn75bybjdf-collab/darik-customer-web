import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PartBid | Darik Technologies",
  description:
    "PartBid case study by Darik Technologies — a two-sided auto parts quote platform for buyers, suppliers, requests, quotes, chat, photos, and premium supplier access.",
};

const quoteHref =
  "mailto:jjasaleh14@aol.com?subject=Darik%20Technologies%20Free%20Quote&body=Hi%20Jihad%2C%0A%0AI%20want%20a%20free%20quote%20for%20an%20app%20or%20business%20system.%0A%0AProject%20idea%3A%0ABusiness%20type%3A%0AImportant%20features%3A%0ATimeline%3A%0A";

const heroStats = [
  {
    value: "2-sided",
    label: "buyer + supplier marketplace",
  },
  {
    value: "Quotes",
    label: "price, photos, delivery, warranty",
  },
  {
    value: "Realtime",
    label: "requests, messages, and profile updates",
  },
];

const systemCards = [
  {
    title: "Buyer request",
    text: "Vehicle, year, part needed, condition, part type, location, details, and photos.",
  },
  {
    title: "Supplier quote",
    text: "Price, actual part photos, delivery option, warranty, message, and quote status.",
  },
  {
    title: "Chat control",
    text: "The buyer starts the conversation, keeping supplier messaging useful instead of spammy.",
  },
];

const moduleCards = [
  {
    eyebrow: "Buyer app",
    title: "A clean request flow for the person who needs the part.",
    text:
      "The buyer picks make, model, year, part needed, condition preference, part type preference, adds notes, uploads photos, and sends one request to suppliers.",
    points: ["Make / model / year", "Part validation", "Photo upload", "5 active request limit"],
    visual: "buyer",
  },
  {
    eyebrow: "Supplier app",
    title: "A supplier workspace that turns demand into quotes.",
    text:
      "Suppliers review incoming requests, open details, dismiss parts they do not carry, unlock premium access, upload real part photos, and send structured quotes.",
    points: ["New / quoted tabs", "Premium unlock", "Actual part photos", "Delivery terms"],
    visual: "supplier",
  },
  {
    eyebrow: "Quote + chat",
    title: "Negotiation only starts when the buyer wants it.",
    text:
      "The buyer receives offers, compares price, condition, part type, delivery, warranty, supplier name visibility, and can start chat when there is real interest.",
    points: ["Buyer starts chat", "Accept quote", "Photo messages", "Payment safety warning"],
    visual: "chat",
  },
  {
    eyebrow: "Platform backend",
    title: "The hidden layer that makes the app feel like a real company.",
    text:
      "Device IDs, push tokens, presence, payment requests, business verification, reports, and Supabase realtime channels keep the platform controlled.",
    points: ["Realtime data", "Push setup", "Business verification", "Reports + moderation"],
    visual: "backend",
  },
];

const includedFeatures = [
  {
    number: "01",
    title: "Regional vehicle database",
    text:
      "The request form can be adapted to any launch market with local makes, models, years, and naming conventions.",
    tags: ["Makes", "Models", "Years"],
    accent: "cyan",
  },
  {
    number: "02",
    title: "Photo upload pipeline",
    text:
      "Request, quote, chat, registration, and payment photos are compressed, uploaded, saved, and attached to the right workflow.",
    tags: ["Camera", "Gallery", "Compression"],
    accent: "blue",
  },
  {
    number: "03",
    title: "Supplier premium access",
    text:
      "Premium suppliers can unlock buyer visibility and quote sending through a plan and Payment receipt approval flow.",
    tags: ["Plans", "Payment receipt", "Activation"],
    accent: "yellow",
  },
  {
    number: "04",
    title: "Business verification",
    text:
      "Business buyers can submit registration photos, show verified status, and give suppliers more confidence.",
    tags: ["Buyer trust", "Registration", "Review"],
    accent: "green",
  },
  {
    number: "05",
    title: "Device + push setup",
    text:
      "The app stores device IDs, Expo push tokens, platform data, and setup debug logs so notification problems can be diagnosed.",
    tags: ["Device ID", "Expo push", "Debug logs"],
    accent: "cyan",
  },
  {
    number: "06",
    title: "Realtime presence",
    text:
      "The backend tracks active users and last seen status so the product can behave like a live marketplace.",
    tags: ["Presence", "Last seen", "Active state"],
    accent: "blue",
  },
  {
    number: "07",
    title: "Safety + reporting",
    text:
      "Users can report images, buyers, or sellers, while the app keeps reporter device and platform context for admin review.",
    tags: ["Reports", "Moderation", "Safety"],
    accent: "orange",
  },
  {
    number: "08",
    title: "Arabic + English copy",
    text:
      "Buyer, supplier, chat, dropdown, alerts, buttons, and safety messages are structured for both English and Arabic.",
    tags: ["Bilingual", "Arabic", "English"],
    accent: "green",
  },
];


const workflowSteps = [
  {
    step: "01",
    status: "New request",
    title: "Buyer creates structured demand",
    text:
      "The buyer chooses the car, the exact part, preferences, photos, location, and optional notes instead of sending a messy WhatsApp message.",
    pills: ["Vehicle", "Part", "Photos"],
  },
  {
    step: "02",
    status: "Supplier review",
    title: "Suppliers see a clean opportunity",
    text:
      "Suppliers open the request, review what the buyer needs, and either quote it or dismiss it if they do not carry the part.",
    pills: ["New tab", "Open details", "Dismiss"],
  },
  {
    step: "03",
    status: "Quote sent",
    title: "Offers arrive with real quote data",
    text:
      "A quote carries the price, condition, part type, warranty, delivery option, delivery fee, message, and actual part photos.",
    pills: ["Price", "Delivery", "Warranty"],
  },
  {
    step: "04",
    status: "Buyer decision",
    title: "Buyer compares and starts chat only if interested",
    text:
      "The buyer can compare offers and open chat. Suppliers cannot start the chat first, which keeps the platform cleaner.",
    pills: ["Compare", "Chat", "Negotiate"],
  },
  {
    step: "05",
    status: "Closed loop",
    title: "The request becomes accepted, withdrawn, unavailable, or closed",
    text:
      "The system keeps tabs clean by moving items out of the wrong screens once a request is accepted, withdrawn, closed, or unavailable.",
    pills: ["Accepted", "Withdrawn", "Closed"],
  },
];

const workflowStates = [
  "open",
  "quoted",
  "accepted",
  "closed",
  "withdrawn",
  "unavailable",
];


const screenPreviews = [
  {
    eyebrow: "Buyer screen",
    title: "Request creation",
    text:
      "The buyer flow makes the request useful before it ever reaches a supplier: vehicle, part, preferences, location, notes, and photos.",
    highlights: ["Make / model / year", "Condition preference", "Part type preference", "Photo upload"],
    visual: "request",
  },
  {
    eyebrow: "Supplier screen",
    title: "Incoming request detail",
    text:
      "Suppliers get enough information to decide if they carry the part, then send a quote with price, delivery, warranty, and real photos.",
    highlights: ["Request details", "Don't carry this", "Send quote", "Premium access"],
    visual: "supplier",
  },
  {
    eyebrow: "Quote screen",
    title: "Compare offers",
    text:
      "Quotes stay attached to the request so the buyer can compare suppliers, prices, condition, delivery terms, photos, and messages.",
    highlights: ["Price", "Actual photos", "Delivery option", "Warranty"],
    visual: "quotes",
  },
  {
    eyebrow: "Chat screen",
    title: "Controlled negotiation",
    text:
      "The buyer opens chat only when needed. Safety warnings and photo reporting keep the conversation more controlled.",
    highlights: ["Buyer starts chat", "Photo messages", "Accept quote", "Payment warning"],
    visual: "chat-screen",
  },
];


const premiumSteps = [
  {
    number: "01",
    title: "Supplier sees live buyer demand",
    text:
      "The supplier can understand what buyers are asking for, but sensitive buyer visibility and quote sending can stay locked.",
    label: "Demand visible",
  },
  {
    number: "02",
    title: "Premium access explains the value",
    text:
      "The app makes it clear that premium unlocks buyer names and the ability to send quotes.",
    label: "Unlock value",
  },
  {
    number: "03",
    title: "Supplier submits payment proof",
    text:
      "The supplier uploads a Payment receipt tied to a selected plan, price, duration, and supplier alias.",
    label: "Payment receipt",
  },
  {
    number: "04",
    title: "Admin reviews and activates",
    text:
      "Once approved, the supplier account can receive the subscription expiry date and unlock quoting tools.",
    label: "Admin approval",
  },
];

const premiumMetrics = [
  {
    value: "Locked",
    label: "buyer names before activation",
  },
  {
    value: "Receipt",
    label: "payment proof upload flow",
  },
  {
    value: "Expiry",
    label: "supplier subscription control",
  },
  {
    value: "Quotes",
    label: "premium action unlocked",
  },
];

function PremiumEngineVisual() {
  return (
    <div className="pb-premium-visual" aria-hidden="true">
      <div className="pb-premium-core">
        <strong>Premium</strong>
        <span>supplier engine</span>
      </div>

      <div className="pb-premium-ring pb-premium-ring-one" />
      <div className="pb-premium-ring pb-premium-ring-two" />

      <div className="pb-premium-node pb-premium-node-one">
        <strong>Supplier plan</strong>
        <span>1 month / custom plan</span>
      </div>
      <div className="pb-premium-node pb-premium-node-two">
        <strong>Payment receipt</strong>
        <span>payment proof</span>
      </div>
      <div className="pb-premium-node pb-premium-node-three">
        <strong>Admin review</strong>
        <span>approve / reject</span>
      </div>
      <div className="pb-premium-node pb-premium-node-four">
        <strong>Quote unlock</strong>
        <span>buyer visibility</span>
      </div>

      <div className="pb-premium-phone">
        <div className="pb-premium-phone-top">
          <strong>Supplier Premium</strong>
          <span>LOCKED</span>
        </div>
        <div className="pb-premium-lock-card">
          <small>Premium required</small>
          <b>Unlock to send quotes</b>
          <em>Buyer names and clear photos open after activation.</em>
        </div>
        <div className="pb-premium-receipt">
          <i />
          <div>
            <strong>Upload receipt</strong>
            <span>Payment proof</span>
          </div>
        </div>
        <div className="pb-premium-button">Submit payment request</div>
      </div>
    </div>
  );
}


const opsControls = [
  {
    title: "Payment review queue",
    text:
      "Premium requests can be reviewed before unlocking supplier access, using plan name, price, months, payment alias, receipt URL, status, and admin notes.",
    tags: ["Pending", "Approved", "Rejected"],
  },
  {
    title: "Business verification review",
    text:
      "Buyer business verification can be pending, approved, or rejected, with registration photos and rejection messaging tied into the profile.",
    tags: ["Registration", "Trust", "Review"],
  },
  {
    title: "Report moderation",
    text:
      "Images, buyers, and sellers can be reported with related request, quote, image URL, role, and user context for admin follow-up.",
    tags: ["Image report", "Buyer report", "Seller report"],
  },
  {
    title: "Push setup diagnostics",
    text:
      "Push setup logs can save the step, status, message, platform, project ID, and extra debugging data so notification problems are traceable.",
    tags: ["Expo", "Device", "Debug"],
  },
];

const opsRows = [
  {
    label: "supplier_payment_requests",
    status: "pending review",
  },
  {
    label: "business_registration_url",
    status: "verify profile",
  },
  {
    label: "partbid_push_setup_debug",
    status: "diagnose",
  },
  {
    label: "partbid_user_presence",
    status: "last seen",
  },
  {
    label: "reports",
    status: "moderate",
  },
];

function OpsControlVisual() {
  return (
    <div className="pb-ops-visual" aria-hidden="true">
      <div className="pb-ops-dashboard">
        <div className="pb-ops-dashboard-top">
          <div>
            <strong>PartBid Ops Control</strong>
            <span>admin-side platform layer</span>
          </div>
          <i>LIVE</i>
        </div>

        <div className="pb-ops-kpi-row">
          <div>
            <strong>12</strong>
            <span>payment requests</span>
          </div>
          <div>
            <strong>4</strong>
            <span>verification reviews</span>
          </div>
          <div>
            <strong>8</strong>
            <span>reports</span>
          </div>
        </div>

        <div className="pb-ops-table">
          {opsRows.map((row) => (
            <div className="pb-ops-row" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.status}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-ops-float pb-ops-float-one">
        <strong>Payment receipt</strong>
        <span>review before unlock</span>
      </div>

      <div className="pb-ops-float pb-ops-float-two">
        <strong>Push debug</strong>
        <span>step-by-step logs</span>
      </div>

      <div className="pb-ops-float pb-ops-float-three">
        <strong>Moderation</strong>
        <span>reports with context</span>
      </div>
    </div>
  );
}


const architectureLayers = [
  {
    title: "Mobile app layer",
    text:
      "Buyer and supplier screens handle role-based navigation, bilingual copy, uploads, chat, quotes, request forms, and premium locks.",
    tags: ["React Native", "Expo", "Buyer / Supplier"],
  },
  {
    title: "Supabase data layer",
    text:
      "Requests, quotes, messages, profiles, presence, devices, push tokens, payments, and debug logs live in structured backend tables.",
    tags: ["Tables", "Storage", "Realtime"],
  },
  {
    title: "Media pipeline",
    text:
      "Images are prepared, compressed, uploaded into storage, and attached to request, quote, chat, registration, or payment records.",
    tags: ["Compression", "Storage URLs", "Photos"],
  },
  {
    title: "Notification layer",
    text:
      "Expo push setup captures device, platform, token, permission status, and debug logs so notification delivery can be traced.",
    tags: ["Expo Push", "Device ID", "Diagnostics"],
  },
];

const dataTables = [
  {
    name: "part_requests",
    label: "buyer demand",
  },
  {
    name: "part_quotes",
    label: "supplier offers",
  },
  {
    name: "partbid_chat_messages",
    label: "negotiation",
  },
  {
    name: "user_profiles",
    label: "roles + status",
  },
  {
    name: "supplier_payment_requests",
    label: "premium review",
  },
  {
    name: "partbid_push_tokens",
    label: "notifications",
  },
  {
    name: "partbid_devices",
    label: "device tracking",
  },
  {
    name: "partbid_user_presence",
    label: "live presence",
  },
];

const architectureFlow = [
  "Buyer creates request",
  "Supabase stores request + photos",
  "Supplier sees realtime demand",
  "Supplier submits quote + photos",
  "Buyer compares offers",
  "Chat opens when buyer starts",
  "Status updates clean the tabs",
];

function ArchitectureVisual() {
  return (
    <div className="pb-architecture-visual" aria-hidden="true">
      <div className="pb-architecture-core">
        <strong>Supabase</strong>
        <span>PartBid backend</span>
      </div>

      <div className="pb-architecture-ring pb-architecture-ring-one" />
      <div className="pb-architecture-ring pb-architecture-ring-two" />

      <div className="pb-architecture-node pb-arch-node-one">
        <strong>Requests</strong>
        <span>buyer demand</span>
      </div>
      <div className="pb-architecture-node pb-arch-node-two">
        <strong>Quotes</strong>
        <span>supplier offers</span>
      </div>
      <div className="pb-architecture-node pb-arch-node-three">
        <strong>Chat</strong>
        <span>buyer-started</span>
      </div>
      <div className="pb-architecture-node pb-arch-node-four">
        <strong>Storage</strong>
        <span>photos</span>
      </div>
      <div className="pb-architecture-node pb-arch-node-five">
        <strong>Push</strong>
        <span>tokens</span>
      </div>
      <div className="pb-architecture-node pb-arch-node-six">
        <strong>Presence</strong>
        <span>last seen</span>
      </div>

      <div className="pb-architecture-panel">
        <div className="pb-architecture-panel-top">
          <div>
            <strong>Data flow</strong>
            <span>request → quote → chat → close</span>
          </div>
          <i>LIVE</i>
        </div>
        <div className="pb-architecture-flow">
          {architectureFlow.map((item, index) => (
            <div className="pb-architecture-flow-row" key={item}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const valuePoints = [
  {
    title: "Old way",
    text:
      "A buyer calls multiple shops, repeats the same car details, sends photos everywhere, waits for random replies, and loses track of prices.",
    tags: ["Phone calls", "WhatsApp mess", "No comparison"],
    tone: "bad",
  },
  {
    title: "PartBid way",
    text:
      "One request creates organized demand. Suppliers quote in one place, and the buyer compares price, delivery, warranty, photos, and chat history.",
    tags: ["One request", "Multiple quotes", "Clean decision"],
    tone: "good",
  },
  {
    title: "Supplier value",
    text:
      "Suppliers stop waiting for random foot traffic. They see live part demand and can choose which requests are worth quoting.",
    tags: ["Live demand", "Better leads", "Premium access"],
    tone: "good",
  },
  {
    title: "Platform value",
    text:
      "The marketplace owns the workflow: requests, quote activity, supplier subscriptions, moderation, user trust, and operational data.",
    tags: ["Data", "Revenue", "Control"],
    tone: "good",
  },
];

const businessMetrics = [
  {
    value: "1 request",
    label: "replaces repeated calls",
  },
  {
    value: "Many quotes",
    label: "collected in one workflow",
  },
  {
    value: "Premium",
    label: "supplier-side revenue path",
  },
  {
    value: "Control",
    label: "status, safety, moderation, and ops",
  },
];

const clientFit = [
  "Auto parts marketplaces",
  "Supplier quote platforms",
  "B2B request systems",
  "Garage / workshop tools",
  "Marketplace MVPs",
  "Internal procurement apps",
];

function ValueVisual() {
  return (
    <div className="pb-value-visual" aria-hidden="true">
      <div className="pb-value-before">
        <div className="pb-value-mini-top">
          <strong>Old way</strong>
          <span>messy</span>
        </div>
        <div className="pb-value-call-list">
          <i>Call shop 1</i>
          <i>Send photo again</i>
          <i>Wait for price</i>
          <i>Call shop 2</i>
          <i>Compare manually</i>
        </div>
      </div>

      <div className="pb-value-arrow">→</div>

      <div className="pb-value-after">
        <div className="pb-value-mini-top">
          <strong>PartBid</strong>
          <span>organized</span>
        </div>
        <div className="pb-value-request-card">
          <small>Request</small>
          <b>2018 Tucson · Front bumper</b>
          <em>Photos + preferences attached</em>
        </div>
        <div className="pb-value-quotes">
          <div>
            <strong>120</strong>
            <span>Free delivery</span>
          </div>
          <div>
            <strong>95</strong>
            <span>Pickup only</span>
          </div>
          <div>
            <strong>140</strong>
            <span>Warranty included</span>
          </div>
        </div>
      </div>

      <div className="pb-value-floating pb-value-floating-one">
        <strong>Buyer saves time</strong>
        <span>one request, organized replies</span>
      </div>

      <div className="pb-value-floating pb-value-floating-two">
        <strong>Supplier gets leads</strong>
        <span>real demand, not guessing</span>
      </div>

      <div className="pb-value-floating pb-value-floating-three">
        <strong>Platform earns</strong>
        <span>premium supplier access</span>
      </div>
    </div>
  );
}


const finalProof = [
  {
    title: "Two-sided marketplace",
    text: "Buyer demand and supplier quoting are built as one controlled workflow.",
  },
  {
    title: "Supplier monetization",
    text: "Premium access, payment proof, and approval logic give the platform a revenue path.",
  },
  {
    title: "Admin operations",
    text: "Verification, moderation, diagnostics, presence, and payment review are part of the system.",
  },
  {
    title: "Production architecture",
    text: "Realtime data, storage, push tokens, device IDs, and structured backend tables are included.",
  },
];

function ScreenPreviewMockup({ visual }: { visual: string }) {
  if (visual === "request") {
    return (
      <div className="pb-screen-phone">
        <div className="pb-screen-top">
          <strong>Request a Part</strong>
          <span>Buyer</span>
        </div>
        <div className="pb-screen-field">
          <small>Make</small>
          <b>Hyundai</b>
        </div>
        <div className="pb-screen-grid-two">
          <div className="pb-screen-field">
            <small>Model</small>
            <b>Tucson</b>
          </div>
          <div className="pb-screen-field">
            <small>Year</small>
            <b>2018</b>
          </div>
        </div>
        <div className="pb-screen-field pb-screen-field-strong">
          <small>Part Needed</small>
          <b>Front bumper</b>
        </div>
        <div className="pb-screen-photo-strip">
          <i />
          <i />
          <i />
        </div>
        <div className="pb-screen-submit">Request Quotes</div>
      </div>
    );
  }

  if (visual === "supplier") {
    return (
      <div className="pb-screen-phone pb-screen-dark">
        <div className="pb-screen-top">
          <strong>Incoming Requests</strong>
          <span>NEW</span>
        </div>
        <div className="pb-screen-request-card">
          <small>A part is requested</small>
          <b>2018 Hyundai Tucson</b>
          <em>Tap to open details</em>
        </div>
        <div className="pb-screen-detail-list">
          <i>Vehicle</i>
          <i>Part Needed</i>
          <i>Photos</i>
          <i>Location</i>
        </div>
        <div className="pb-screen-actions-row">
          <span>Don’t carry</span>
          <strong>Send quote</strong>
        </div>
      </div>
    );
  }

  if (visual === "quotes") {
    return (
      <div className="pb-screen-phone">
        <div className="pb-screen-top">
          <strong>Quotes Received</strong>
          <span>3</span>
        </div>
        <div className="pb-quote-card-demo pb-quote-card-best">
          <small>AutoParts Pro</small>
          <b>120</b>
          <em>Free delivery · Used · OEM</em>
        </div>
        <div className="pb-quote-card-demo">
          <small>Supplier hidden</small>
          <b>95</b>
          <em>Pickup only · Aftermarket</em>
        </div>
        <div className="pb-quote-photo-demo">
          <i />
          <i />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-screen-phone">
      <div className="pb-screen-top">
        <strong>Chat with Supplier</strong>
        <span>Safe</span>
      </div>
      <div className="pb-screen-warning">
        <b>Important payment warning</b>
        <small>Do not send payment before receiving parts.</small>
      </div>
      <div className="pb-screen-bubble pb-screen-bubble-left">Is this original OEM?</div>
      <div className="pb-screen-bubble pb-screen-bubble-right">Yes. Delivery today.</div>
      <div className="pb-screen-chat-input">
        <span>Ask supplier...</span>
        <strong>Send</strong>
      </div>
    </div>
  );
}


function ModuleVisual({ visual }: { visual: string }) {
  if (visual === "buyer") {
    return (
      <div className="pb-module-visual pb-module-buyer" aria-hidden="true">
        <div className="pb-module-phone">
          <div className="pb-module-phone-head">
            <strong>Request a Part</strong>
            <span>Buyer</span>
          </div>
          <div className="pb-module-selects">
            <i>Toyota</i>
            <i>Prius</i>
            <i>2017</i>
          </div>
          <div className="pb-module-field">
            <small>Part Needed</small>
            <b>Headlight assembly</b>
          </div>
          <div className="pb-module-photos">
            <i />
            <i />
            <i />
          </div>
          <div className="pb-module-button">Request Quotes</div>
        </div>
        <div className="pb-module-float pb-module-float-left">
          <strong>5</strong>
          <span>active requests max</span>
        </div>
      </div>
    );
  }

  if (visual === "supplier") {
    return (
      <div className="pb-module-visual pb-module-supplier" aria-hidden="true">
        <div className="pb-supplier-board">
          <div className="pb-supplier-board-top">
            <span>Incoming Requests</span>
            <strong>NEW</strong>
          </div>
          <div className="pb-supplier-request">
            <div>
              <strong>A part is requested</strong>
              <span>2018 Hyundai Tucson</span>
            </div>
            <i>Open</i>
          </div>
          <div className="pb-supplier-lock">
            <span>Premium required</span>
            <strong>Unlock to send quotes</strong>
          </div>
          <div className="pb-supplier-quote">
            <strong>120</strong>
            <span>Actual part photos required</span>
          </div>
        </div>
      </div>
    );
  }

  if (visual === "chat") {
    return (
      <div className="pb-module-visual pb-module-chat" aria-hidden="true">
        <div className="pb-chat-card">
          <div className="pb-chat-alert">
            <strong>Payment warning</strong>
            <span>Do not send payment before receiving parts.</span>
          </div>
          <div className="pb-chat-bubble pb-chat-left">Is this Original OEM?</div>
          <div className="pb-chat-bubble pb-chat-right">Yes. Delivery today.</div>
          <div className="pb-chat-send-row">
            <span>Ask supplier...</span>
            <strong>Send</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-module-visual pb-module-backend" aria-hidden="true">
      <div className="pb-backend-core">
        <strong>PartBid</strong>
        <span>Realtime system</span>
      </div>
      <div className="pb-backend-orbit pb-backend-orbit-one" />
      <div className="pb-backend-orbit pb-backend-orbit-two" />
      <div className="pb-backend-node pb-node-one">Requests</div>
      <div className="pb-backend-node pb-node-two">Quotes</div>
      <div className="pb-backend-node pb-node-three">Messages</div>
      <div className="pb-backend-node pb-node-four">Profiles</div>
      <div className="pb-backend-node pb-node-five">Push</div>
      <div className="pb-backend-node pb-node-six">Payments</div>
    </div>
  );
}

export default function PartBidCaseStudyTaskOne() {
  return (
    <main className="pb-page" data-smart-lang="en">
      <style>{`
        :root {
          --pb-bg: #06101d;
          --pb-card: rgba(255, 255, 255, 0.075);
          --pb-card-strong: rgba(255, 255, 255, 0.12);
          --pb-line: rgba(255, 255, 255, 0.12);
          --pb-text: #f7fbff;
          --pb-muted: rgba(247, 251, 255, 0.7);
          --pb-faint: rgba(247, 251, 255, 0.5);
          --pb-blue: #0b63f6;
          --pb-cyan: #67e8f9;
          --pb-yellow: #ffd83d;
          --pb-green: #22c55e;
          --pb-orange: #f59e0b;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--pb-bg);
        }

        .pb-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--pb-text);
          background:
            radial-gradient(circle at 12% 5%, rgba(11, 99, 246, 0.32), transparent 30rem),
            radial-gradient(circle at 90% 10%, rgba(255, 216, 61, 0.15), transparent 28rem),
            radial-gradient(circle at 55% 100%, rgba(103, 232, 249, 0.12), transparent 36rem),
            linear-gradient(180deg, #06101d 0%, #08182a 44%, #050b14 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .pb-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        .pb-shell {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .pb-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          min-height: 98px;
          padding: 16px 0;
        }

        .pb-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
          min-width: 0;
        }

        .pb-logo {
          display: grid;
          place-items: center;
          width: 86px;
          height: 86px;
          flex: 0 0 86px;
        }

        .pb-logo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 16px 34px rgba(103, 232, 249, 0.18));
        }

        .pb-brand strong {
          display: block;
          font-size: 14px;
          line-height: 1;
        }

        .pb-brand span {
          display: block;
          margin-top: 5px;
          color: rgba(247, 251, 255, 0.52);
          font-size: 10px;
          font-weight: 850;
        }

        .pb-nav-links {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }

        .pb-nav-links a {
          color: rgba(247, 251, 255, 0.72);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          transition: color 180ms ease, transform 180ms ease;
        }

        .pb-nav-links a:hover {
          color: #fff;
          transform: translateY(-1px);
        }

        .pb-nav-home {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          color: rgba(247, 251, 255, 0.9) !important;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }

        .pb-nav-home:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(103, 232, 249, 0.24);
        }

        .pb-nav-cta {
          position: relative;
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 15px;
          border-radius: 999px;
          color: #06101d !important;
          background:
            radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.9), transparent 4rem),
            linear-gradient(135deg, #e8fbff 0%, var(--pb-cyan) 45%, var(--pb-yellow) 100%);
          box-shadow: 0 18px 52px rgba(103, 232, 249, 0.18);
        }

        .pb-nav-cta::before {
          content: "";
          position: absolute;
          inset: -7px;
          z-index: -1;
          border-radius: 999px;
          background:
            conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(103, 232, 249, 0.75) 70deg,
              rgba(255, 216, 61, 0.55) 105deg,
              transparent 145deg,
              transparent 360deg
            );
          animation: pb-spin 4.3s linear infinite;
          pointer-events: none;
        }

        .pb-hero {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(420px, 0.72fr);
          gap: clamp(34px, 6vw, 78px);
          align-items: center;
          padding: 42px 0 94px;
        }

        .pb-hero h1 {
          max-width: 780px;
          margin: 0;
          font-size: clamp(52px, 6.5vw, 94px);
          line-height: 0.9;
          letter-spacing: -0.08em;
        }

        .pb-gradient {
          color: transparent;
          background: linear-gradient(135deg, #67e8f9 0%, #4aa3ff 44%, #ffd83d 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .pb-copy {
          max-width: 650px;
          margin: 24px 0 0;
          color: var(--pb-muted);
          font-size: 18px;
          line-height: 1.62;
        }

        .pb-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .pb-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 950;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .pb-button:hover {
          transform: translateY(-2px);
        }

        .pb-button-primary {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          color: #06101d;
          background:
            radial-gradient(circle at 18% 0%, rgba(255,255,255,0.82), transparent 4.4rem),
            linear-gradient(135deg, #e7fbff 0%, #67e8f9 45%, #ffd83d 100%);
          box-shadow: 0 26px 78px rgba(103, 232, 249, 0.22);
          animation: pb-cta-glow 4.8s ease-in-out infinite;
        }

        .pb-button-primary::after {
          content: "";
          position: absolute;
          top: -44%;
          bottom: -44%;
          left: 0;
          width: 38%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.46), transparent);
          transform: translateX(-145%) skewX(-18deg);
          animation: pb-shine 5.2s ease-in-out infinite;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .pb-button-secondary {
          color: rgba(247, 251, 255, 0.86);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.11);
        }

        .pb-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          max-width: 790px;
          margin-top: 32px;
        }

        .pb-stat {
          min-height: 112px;
          padding: 18px;
          border-radius: 26px;
          background:
            radial-gradient(circle at 82% 0%, rgba(103,232,249,0.14), transparent 8rem),
            linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.032));
          border: 1px solid rgba(255,255,255,0.105);
          box-shadow: 0 22px 64px rgba(0,0,0,0.17);
        }

        .pb-stat strong {
          display: block;
          font-size: 25px;
          letter-spacing: -0.06em;
        }

        .pb-stat span {
          display: block;
          margin-top: 8px;
          color: var(--pb-faint);
          font-size: 12px;
          line-height: 1.34;
          font-weight: 850;
        }

        .pb-stage {
          position: relative;
          min-height: 650px;
          padding: 24px;
          border-radius: 42px;
          background:
            radial-gradient(circle at 36% 0%, rgba(103, 232, 249, 0.18), transparent 18rem),
            radial-gradient(circle at 100% 78%, rgba(255, 216, 61, 0.13), transparent 18rem),
            linear-gradient(180deg, rgba(255,255,255,0.096), rgba(255,255,255,0.032));
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 34px 100px rgba(0,0,0,0.29),
            inset 0 1px 0 rgba(255,255,255,0.1);
          overflow: hidden;
        }

        .pb-stage::before {
          content: "";
          position: absolute;
          inset: -30%;
          background:
            conic-gradient(
              from 120deg,
              transparent,
              rgba(103,232,249,0.16),
              transparent,
              rgba(255,216,61,0.1),
              transparent
            );
          animation: pb-slow-spin 30s linear infinite;
          opacity: 0.8;
        }

        .pb-main-phone {
          position: relative;
          z-index: 2;
          width: min(315px, 74%);
          margin: 0 auto;
          border-radius: 38px;
          padding: 16px;
          background: #f8fafc;
          color: #111827;
          box-shadow:
            0 32px 94px rgba(0,0,0,0.4),
            inset 0 0 0 1px rgba(2, 6, 23, 0.08);
        }

        .pb-phone-status,
        .pb-phone-top,
        .pb-mini-panel-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pb-phone-status {
          color: #64748b;
          font-size: 11px;
          font-weight: 900;
        }

        .pb-phone-top {
          margin-top: 16px;
        }

        .pb-phone-top h3 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .pb-language {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: var(--pb-blue);
          background: #eff6ff;
          font-size: 11px;
          font-weight: 950;
        }

        .pb-form-stack {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .pb-field {
          min-height: 50px;
          padding: 10px 12px;
          border-radius: 16px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-field span {
          display: block;
          color: #64748b;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .pb-field strong {
          display: block;
          margin-top: 4px;
          color: #0f172a;
          font-size: 13px;
        }

        .pb-photo-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 13px;
        }

        .pb-photo-row span {
          height: 54px;
          border-radius: 15px;
          background:
            linear-gradient(135deg, rgba(11,99,246,0.12), rgba(103,232,249,0.12)),
            #e0f2fe;
          border: 1px dashed rgba(11,99,246,0.34);
        }

        .pb-submit {
          display: grid;
          place-items: center;
          min-height: 48px;
          margin-top: 15px;
          border-radius: 999px;
          color: #ffffff;
          background: linear-gradient(135deg, var(--pb-blue), #2563eb);
          box-shadow: 0 16px 36px rgba(11, 99, 246, 0.22);
          font-size: 13px;
          font-weight: 950;
        }

        .pb-mini-stack {
          position: absolute;
          z-index: 3;
          right: 18px;
          bottom: 26px;
          width: 250px;
          display: grid;
          gap: 10px;
        }

        .pb-mini-panel {
          padding: 14px;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(6,16,29,0.9), rgba(6,16,29,0.66));
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 20px 60px rgba(0,0,0,0.32);
          backdrop-filter: blur(18px);
        }

        .pb-mini-panel small {
          color: rgba(247, 251, 255, 0.48);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .pb-mini-panel strong {
          display: block;
          margin-top: 7px;
          font-size: 15px;
          letter-spacing: -0.03em;
        }

        .pb-mini-panel i {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          margin-top: 10px;
          padding: 0 9px;
          border-radius: 999px;
          color: #06101d;
          background: #67e8f9;
          font-style: normal;
          font-size: 10px;
          font-weight: 950;
        }

        .pb-floating-note {
          position: absolute;
          z-index: 4;
          left: 18px;
          bottom: 50px;
          width: 170px;
          padding: 14px;
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.045)),
            rgba(6,16,29,0.7);
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow: 0 20px 60px rgba(0,0,0,0.28);
          backdrop-filter: blur(18px);
          animation: pb-float 5.4s ease-in-out infinite;
        }

        .pb-floating-note strong {
          display: block;
          font-size: 22px;
          letter-spacing: -0.05em;
        }

        .pb-floating-note span {
          display: block;
          margin-top: 5px;
          color: var(--pb-faint);
          font-size: 11px;
          font-weight: 850;
          line-height: 1.35;
        }

        .pb-foundation {
          padding: 0 0 82px;
        }

        .pb-foundation-card {
          display: grid;
          grid-template-columns: minmax(0, 0.72fr) minmax(360px, 0.42fr);
          gap: 18px;
          padding: 20px;
          border-radius: 38px;
          background:
            radial-gradient(circle at 10% 10%, rgba(103,232,249,0.13), transparent 18rem),
            radial-gradient(circle at 90% 80%, rgba(255,216,61,0.1), transparent 18rem),
            linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.105);
          box-shadow: 0 30px 100px rgba(0,0,0,0.22);
        }

        .pb-foundation-copy {
          padding: 18px;
        }

        .pb-eyebrow {
          display: block;
          color: #67e8f9;
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .pb-foundation-copy h2 {
          max-width: 690px;
          margin: 11px 0 0;
          font-size: clamp(38px, 5vw, 66px);
          line-height: 0.95;
          letter-spacing: -0.07em;
        }

        .pb-foundation-copy p {
          max-width: 690px;
          margin: 16px 0 0;
          color: rgba(247, 251, 255, 0.64);
          font-size: 15px;
          line-height: 1.66;
        }

        .pb-system-list {
          display: grid;
          gap: 12px;
          padding: 18px;
          border-radius: 30px;
          background: rgba(6,16,29,0.44);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .pb-system-item {
          padding: 15px;
          border-radius: 22px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.075);
        }

        .pb-system-item strong {
          display: block;
          font-size: 17px;
          letter-spacing: -0.04em;
        }

        .pb-system-item span {
          display: block;
          margin-top: 7px;
          color: rgba(247,251,255,0.55);
          font-size: 12px;
          line-height: 1.45;
          font-weight: 850;
        }


        .pb-modules {
          position: relative;
          z-index: 2;
          padding: 0 0 92px;
        }

        .pb-section-head {
          display: grid;
          grid-template-columns: minmax(0, 0.72fr) minmax(320px, 0.42fr);
          gap: 26px;
          align-items: end;
          margin-bottom: 28px;
        }

        .pb-section-head h2 {
          max-width: 760px;
          margin: 11px 0 0;
          font-size: clamp(40px, 5.4vw, 72px);
          line-height: 0.93;
          letter-spacing: -0.075em;
        }

        .pb-section-head p {
          margin: 0;
          color: rgba(247, 251, 255, 0.64);
          font-size: 15px;
          line-height: 1.66;
        }

        .pb-module-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .pb-module-card {
          position: relative;
          overflow: hidden;
          min-height: 650px;
          padding: 22px;
          border-radius: 36px;
          background:
            radial-gradient(circle at 86% 0%, rgba(103,232,249,0.16), transparent 13rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.032));
          border: 1px solid rgba(255,255,255,0.105);
          box-shadow:
            0 30px 92px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-module-card:nth-child(2) {
          background:
            radial-gradient(circle at 86% 0%, rgba(255,216,61,0.14), transparent 13rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.032));
        }

        .pb-module-card:nth-child(3) {
          background:
            radial-gradient(circle at 86% 0%, rgba(34,197,94,0.13), transparent 13rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.032));
        }

        .pb-module-card:nth-child(4) {
          background:
            radial-gradient(circle at 86% 0%, rgba(74,163,255,0.16), transparent 13rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.032));
        }

        .pb-module-card::before {
          content: "";
          position: absolute;
          left: 22px;
          right: 22px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(103,232,249,0.9), transparent);
          box-shadow: 0 0 26px rgba(103,232,249,0.18);
        }

        .pb-module-card:nth-child(2)::before {
          background: linear-gradient(90deg, transparent, rgba(255,216,61,0.9), transparent);
          box-shadow: 0 0 26px rgba(255,216,61,0.18);
        }

        .pb-module-card:nth-child(3)::before {
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.9), transparent);
          box-shadow: 0 0 26px rgba(34,197,94,0.18);
        }

        .pb-module-card h3 {
          max-width: 560px;
          margin: 10px 0 0;
          font-size: 34px;
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .pb-module-card p {
          max-width: 580px;
          margin: 12px 0 0;
          color: rgba(247, 251, 255, 0.62);
          font-size: 14px;
          line-height: 1.62;
        }

        .pb-module-points {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .pb-module-points span {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          color: rgba(247,251,255,0.76);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 11px;
          font-weight: 900;
        }

        .pb-module-visual {
          position: relative;
          min-height: 350px;
          margin-top: 24px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 50% 18%, rgba(103,232,249,0.14), transparent 17rem),
            rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .pb-module-card:nth-child(2) .pb-module-visual {
          background:
            radial-gradient(circle at 50% 18%, rgba(255,216,61,0.13), transparent 17rem),
            rgba(255,255,255,0.045);
        }

        .pb-module-card:nth-child(3) .pb-module-visual {
          background:
            radial-gradient(circle at 50% 18%, rgba(34,197,94,0.12), transparent 17rem),
            rgba(255,255,255,0.045);
        }

        .pb-module-visual::after {
          content: "";
          position: absolute;
          top: -30%;
          bottom: -30%;
          left: 0;
          z-index: 20;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), rgba(103,232,249,0.2), transparent);
          transform: translateX(-140%) skewX(-16deg);
          animation: pb-scan 6.2s ease-in-out infinite;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .pb-module-card:nth-child(2) .pb-module-visual::after {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(255,216,61,0.2), transparent);
          animation-delay: -1.5s;
        }

        .pb-module-card:nth-child(3) .pb-module-visual::after {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(34,197,94,0.2), transparent);
          animation-delay: -3s;
        }

        .pb-module-card:nth-child(4) .pb-module-visual::after {
          animation-delay: -4.5s;
        }

        .pb-module-phone {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 220px;
          transform: translate(-50%, -50%);
          padding: 14px;
          border-radius: 30px;
          color: #111827;
          background: #f8fafc;
          box-shadow: 0 26px 74px rgba(0,0,0,0.36);
        }

        .pb-module-phone-head,
        .pb-supplier-board-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pb-module-phone-head strong {
          color: #0f172a;
          font-size: 15px;
          letter-spacing: -0.035em;
        }

        .pb-module-phone-head span,
        .pb-supplier-board-top strong {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          color: #ffffff;
          background: var(--pb-blue);
          font-size: 10px;
          font-weight: 950;
        }

        .pb-module-selects {
          display: grid;
          grid-template-columns: 1fr 1fr 0.8fr;
          gap: 6px;
          margin-top: 12px;
        }

        .pb-module-selects i {
          display: grid;
          place-items: center;
          min-height: 31px;
          border-radius: 11px;
          color: #1e40af;
          background: #dbeafe;
          font-size: 9px;
          font-style: normal;
          font-weight: 900;
        }

        .pb-module-field {
          margin-top: 10px;
          padding: 10px;
          border-radius: 15px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-module-field small {
          display: block;
          color: #64748b;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pb-module-field b {
          display: block;
          margin-top: 4px;
          color: #0f172a;
          font-size: 12px;
        }

        .pb-module-photos {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 10px;
        }

        .pb-module-photos i {
          height: 39px;
          border-radius: 11px;
          background: linear-gradient(135deg, #dbeafe, #cffafe);
          border: 1px dashed rgba(11,99,246,0.28);
        }

        .pb-module-button {
          display: grid;
          place-items: center;
          min-height: 35px;
          margin-top: 10px;
          border-radius: 999px;
          color: #fff;
          background: var(--pb-blue);
          font-size: 11px;
          font-weight: 950;
        }

        .pb-module-float {
          position: absolute;
          right: 22px;
          bottom: 26px;
          padding: 12px;
          border-radius: 18px;
          background: rgba(6,16,29,0.74);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.25);
          animation: pb-float 5.2s ease-in-out infinite;
        }

        .pb-module-float strong {
          display: block;
          font-size: 20px;
        }

        .pb-module-float span {
          display: block;
          margin-top: 4px;
          color: var(--pb-faint);
          font-size: 10px;
          font-weight: 850;
        }

        .pb-supplier-board,
        .pb-chat-card {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 280px;
          transform: translate(-50%, -50%);
          display: grid;
          gap: 10px;
          padding: 14px;
          border-radius: 28px;
          background: rgba(6,16,29,0.78);
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow: 0 26px 74px rgba(0,0,0,0.32);
          backdrop-filter: blur(18px);
        }

        .pb-supplier-board-top span {
          color: var(--pb-faint);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .pb-supplier-board-top strong {
          color: #06101d;
          background: var(--pb-yellow);
        }

        .pb-supplier-request,
        .pb-supplier-lock,
        .pb-supplier-quote {
          padding: 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .pb-supplier-request {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pb-supplier-request strong,
        .pb-supplier-lock strong,
        .pb-supplier-quote strong {
          display: block;
          font-size: 13px;
        }

        .pb-supplier-request span,
        .pb-supplier-lock span,
        .pb-supplier-quote span {
          display: block;
          margin-top: 4px;
          color: var(--pb-faint);
          font-size: 10px;
          font-weight: 850;
        }

        .pb-supplier-request i {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: #06101d;
          background: var(--pb-yellow);
          font-size: 10px;
          font-style: normal;
          font-weight: 950;
        }

        .pb-chat-card {
          color: #111827;
          background: #f8fafc;
        }

        .pb-chat-alert {
          padding: 12px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
        }

        .pb-chat-alert strong {
          display: block;
          color: #9a3412;
          font-size: 12px;
        }

        .pb-chat-alert span {
          display: block;
          margin-top: 4px;
          color: #c2410c;
          font-size: 10px;
          font-weight: 800;
        }

        .pb-chat-bubble {
          max-width: 82%;
          padding: 10px 12px;
          border-radius: 18px;
          font-size: 12px;
          font-weight: 850;
        }

        .pb-chat-left {
          background: #e2e8f0;
          color: #0f172a;
        }

        .pb-chat-right {
          justify-self: end;
          color: #ffffff;
          background: var(--pb-blue);
        }

        .pb-chat-send-row {
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 0 10px;
          border-radius: 999px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-chat-send-row span {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 850;
        }

        .pb-chat-send-row strong {
          color: var(--pb-blue);
          font-size: 11px;
        }

        .pb-backend-core {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 4;
          display: grid;
          place-items: center;
          width: 150px;
          height: 150px;
          padding: 16px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          text-align: center;
          color: #06101d;
          background:
            radial-gradient(circle at 35% 20%, #ffffff, transparent 4rem),
            linear-gradient(135deg, #67e8f9, #ffd83d);
          box-shadow: 0 28px 82px rgba(103,232,249,0.2);
        }

        .pb-backend-core strong {
          display: block;
          font-size: 23px;
          letter-spacing: -0.06em;
        }

        .pb-backend-core span {
          display: block;
          margin-top: 3px;
          font-size: 10px;
          font-weight: 950;
        }

        .pb-backend-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          border: 1px dashed rgba(247,251,255,0.16);
          transform: translate(-50%, -50%);
        }

        .pb-backend-orbit-one {
          width: 240px;
          height: 240px;
        }

        .pb-backend-orbit-two {
          width: 310px;
          height: 310px;
          border-color: rgba(255,216,61,0.16);
        }

        .pb-backend-node {
          position: absolute;
          z-index: 5;
          display: grid;
          place-items: center;
          min-width: 88px;
          min-height: 36px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(18px);
          color: var(--pb-text);
          font-size: 10px;
          font-weight: 950;
        }

        .pb-node-one { left: 50%; top: 24px; transform: translateX(-50%); }
        .pb-node-two { right: 18px; top: 35%; }
        .pb-node-three { right: 38px; bottom: 44px; }
        .pb-node-four { left: 36px; bottom: 46px; }
        .pb-node-five { left: 16px; top: 35%; }
        .pb-node-six { left: 50%; bottom: 20px; transform: translateX(-50%); }

        @keyframes pb-scan {
          0% { transform: translateX(-140%) skewX(-16deg); opacity: 0; }
          16% { opacity: 0.72; }
          52% { opacity: 0.24; }
          100% { transform: translateX(145%) skewX(-16deg); opacity: 0; }
        }

        @keyframes pb-backend-orbit-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateY(-120px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateY(-120px) rotate(-360deg); }
        }

        @keyframes pb-backend-orbit-2 {
          from { transform: translate(-50%, -50%) rotate(58deg) translateY(-155px) rotate(-58deg); }
          to { transform: translate(-50%, -50%) rotate(418deg) translateY(-155px) rotate(-418deg); }
        }

        @keyframes pb-backend-orbit-3 {
          from { transform: translate(-50%, -50%) rotate(118deg) translateY(-155px) rotate(-118deg); }
          to { transform: translate(-50%, -50%) rotate(478deg) translateY(-155px) rotate(-478deg); }
        }

        @keyframes pb-backend-orbit-4 {
          from { transform: translate(-50%, -50%) rotate(180deg) translateY(-120px) rotate(-180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg) translateY(-120px) rotate(-540deg); }
        }

        @keyframes pb-backend-orbit-5 {
          from { transform: translate(-50%, -50%) rotate(242deg) translateY(-155px) rotate(-242deg); }
          to { transform: translate(-50%, -50%) rotate(602deg) translateY(-155px) rotate(-602deg); }
        }

        @keyframes pb-backend-orbit-6 {
          from { transform: translate(-50%, -50%) rotate(302deg) translateY(-155px) rotate(-302deg); }
          to { transform: translate(-50%, -50%) rotate(662deg) translateY(-155px) rotate(-662deg); }
        }


        .pb-included {
          position: relative;
          z-index: 2;
          padding: 0 0 98px;
        }

        .pb-included-wrap {
          position: relative;
          overflow: hidden;
          padding: 22px;
          border-radius: 40px;
          background:
            radial-gradient(circle at 12% 0%, rgba(103,232,249,0.16), transparent 20rem),
            radial-gradient(circle at 88% 100%, rgba(255,216,61,0.11), transparent 20rem),
            linear-gradient(180deg, rgba(255,255,255,0.086), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.105);
          box-shadow:
            0 34px 110px rgba(0,0,0,0.24),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-included-wrap::before {
          content: "";
          position: absolute;
          inset: -30%;
          z-index: 0;
          background:
            conic-gradient(
              from 90deg,
              transparent,
              rgba(103,232,249,0.09),
              transparent,
              rgba(255,216,61,0.075),
              transparent
            );
          animation: pb-slow-spin 34s linear infinite;
          pointer-events: none;
        }

        .pb-included-wrap > * {
          position: relative;
          z-index: 1;
        }

        .pb-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 24px;
        }

        .pb-feature-card {
          position: relative;
          overflow: hidden;
          min-height: 288px;
          padding: 18px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 85% 0%, rgba(103,232,249,0.13), transparent 9rem),
            linear-gradient(180deg, rgba(255,255,255,0.074), rgba(255,255,255,0.028));
          border: 1px solid rgba(255,255,255,0.092);
          box-shadow:
            0 20px 64px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.075);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .pb-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(103,232,249,0.22);
          box-shadow:
            0 28px 78px rgba(103,232,249,0.09),
            0 20px 64px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .pb-feature-card::before {
          content: "";
          position: absolute;
          left: 18px;
          right: 18px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(103,232,249,0.9), transparent);
          box-shadow: 0 0 24px rgba(103,232,249,0.16);
        }

        .pb-feature-card::after {
          content: "";
          position: absolute;
          right: 18px;
          top: 18px;
          width: 52px;
          height: 52px;
          border-radius: 999px;
          border: 1px dashed rgba(103,232,249,0.25);
          box-shadow: 0 0 26px rgba(103,232,249,0.08);
          animation: pb-spin 16s linear infinite;
          pointer-events: none;
        }

        .pb-feature-yellow {
          background:
            radial-gradient(circle at 85% 0%, rgba(255,216,61,0.13), transparent 9rem),
            linear-gradient(180deg, rgba(255,255,255,0.074), rgba(255,255,255,0.028));
        }

        .pb-feature-yellow::before {
          background: linear-gradient(90deg, transparent, rgba(255,216,61,0.9), transparent);
          box-shadow: 0 0 24px rgba(255,216,61,0.16);
        }

        .pb-feature-yellow::after {
          border-color: rgba(255,216,61,0.25);
          box-shadow: 0 0 26px rgba(255,216,61,0.08);
        }

        .pb-feature-green {
          background:
            radial-gradient(circle at 85% 0%, rgba(34,197,94,0.13), transparent 9rem),
            linear-gradient(180deg, rgba(255,255,255,0.074), rgba(255,255,255,0.028));
        }

        .pb-feature-green::before {
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.9), transparent);
          box-shadow: 0 0 24px rgba(34,197,94,0.16);
        }

        .pb-feature-green::after {
          border-color: rgba(34,197,94,0.25);
          box-shadow: 0 0 26px rgba(34,197,94,0.08);
          animation-direction: reverse;
        }

        .pb-feature-blue {
          background:
            radial-gradient(circle at 85% 0%, rgba(74,163,255,0.14), transparent 9rem),
            linear-gradient(180deg, rgba(255,255,255,0.074), rgba(255,255,255,0.028));
        }

        .pb-feature-blue::before {
          background: linear-gradient(90deg, transparent, rgba(74,163,255,0.9), transparent);
          box-shadow: 0 0 24px rgba(74,163,255,0.16);
        }

        .pb-feature-orange {
          background:
            radial-gradient(circle at 85% 0%, rgba(245,158,11,0.13), transparent 9rem),
            linear-gradient(180deg, rgba(255,255,255,0.074), rgba(255,255,255,0.028));
        }

        .pb-feature-orange::before {
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.92), transparent);
          box-shadow: 0 0 24px rgba(245,158,11,0.16);
        }

        .pb-feature-number {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          color: #06101d;
          background:
            radial-gradient(circle at 28% 15%, rgba(255,255,255,0.95), transparent 3rem),
            linear-gradient(135deg, #67e8f9, #4aa3ff);
          font-size: 12px;
          font-weight: 1000;
          box-shadow: 0 16px 36px rgba(103,232,249,0.12);
        }

        .pb-feature-yellow .pb-feature-number {
          background:
            radial-gradient(circle at 28% 15%, rgba(255,255,255,0.95), transparent 3rem),
            linear-gradient(135deg, #ffd83d, #f59e0b);
        }

        .pb-feature-green .pb-feature-number {
          background:
            radial-gradient(circle at 28% 15%, rgba(255,255,255,0.95), transparent 3rem),
            linear-gradient(135deg, #67e8f9, #22c55e);
        }

        .pb-feature-orange .pb-feature-number {
          background:
            radial-gradient(circle at 28% 15%, rgba(255,255,255,0.95), transparent 3rem),
            linear-gradient(135deg, #ffd83d, #f59e0b);
        }

        .pb-feature-card h3 {
          margin: 18px 0 0;
          font-size: 23px;
          line-height: 1.04;
          letter-spacing: -0.048em;
        }

        .pb-feature-card p {
          margin: 11px 0 0;
          color: rgba(247,251,255,0.6);
          font-size: 13px;
          line-height: 1.56;
        }

        .pb-feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 15px;
        }

        .pb-feature-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247,251,255,0.72);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.075);
          font-size: 10px;
          font-weight: 900;
        }

        .pb-included-summary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .pb-included-mini {
          min-height: 96px;
          padding: 15px;
          border-radius: 24px;
          background: rgba(6,16,29,0.44);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .pb-included-mini strong {
          display: block;
          font-size: 20px;
          letter-spacing: -0.05em;
        }

        .pb-included-mini span {
          display: block;
          margin-top: 6px;
          color: var(--pb-faint);
          font-size: 11px;
          font-weight: 850;
          line-height: 1.35;
        }


        .pb-workflow {
          position: relative;
          z-index: 2;
          padding: 0 0 104px;
        }

        .pb-workflow-panel {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 0.76fr) minmax(360px, 0.42fr);
          gap: 20px;
          padding: 22px;
          border-radius: 42px;
          background:
            radial-gradient(circle at 8% 0%, rgba(103,232,249,0.16), transparent 22rem),
            radial-gradient(circle at 95% 88%, rgba(255,216,61,0.11), transparent 20rem),
            linear-gradient(180deg, rgba(255,255,255,0.087), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.108);
          box-shadow:
            0 36px 118px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-workflow-panel::before {
          content: "";
          position: absolute;
          inset: -30%;
          background:
            conic-gradient(
              from 130deg,
              transparent,
              rgba(103,232,249,0.1),
              transparent,
              rgba(255,216,61,0.075),
              transparent
            );
          opacity: 0.9;
          animation: pb-slow-spin 38s linear infinite;
          pointer-events: none;
        }

        .pb-workflow-panel > * {
          position: relative;
          z-index: 1;
        }

        .pb-flow-list {
          display: grid;
          gap: 12px;
        }

        .pb-flow-card {
          position: relative;
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 16px;
          align-items: start;
          min-height: 132px;
          padding: 16px;
          border-radius: 26px;
          background:
            radial-gradient(circle at 88% 0%, rgba(103,232,249,0.11), transparent 10rem),
            rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.082);
          box-shadow:
            0 20px 64px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.07);
          overflow: hidden;
        }

        .pb-flow-card::after {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: 0;
          width: 34%;
          background:
            linear-gradient(90deg, transparent, rgba(103,232,249,0.17), rgba(255,255,255,0.12), transparent);
          transform: translateX(-150%) skewX(-18deg);
          animation: pb-flow-scan 7s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .pb-flow-card:nth-child(2)::after {
          animation-delay: -1.4s;
          background:
            linear-gradient(90deg, transparent, rgba(255,216,61,0.16), rgba(255,255,255,0.11), transparent);
        }

        .pb-flow-card:nth-child(3)::after {
          animation-delay: -2.8s;
          background:
            linear-gradient(90deg, transparent, rgba(34,197,94,0.15), rgba(255,255,255,0.11), transparent);
        }

        .pb-flow-card:nth-child(4)::after {
          animation-delay: -4.2s;
          background:
            linear-gradient(90deg, transparent, rgba(74,163,255,0.16), rgba(255,255,255,0.11), transparent);
        }

        .pb-flow-card:nth-child(5)::after {
          animation-delay: -5.6s;
          background:
            linear-gradient(90deg, transparent, rgba(245,158,11,0.15), rgba(255,255,255,0.11), transparent);
        }

        .pb-flow-number {
          position: relative;
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          border-radius: 18px;
          color: #06101d;
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 3.2rem),
            linear-gradient(135deg, #67e8f9, #4aa3ff);
          box-shadow: 0 16px 38px rgba(103,232,249,0.13);
          font-size: 12px;
          font-weight: 1000;
        }

        .pb-flow-number::after {
          content: "";
          position: absolute;
          inset: -7px;
          border-radius: 22px;
          border: 1px dashed rgba(103,232,249,0.28);
          animation: pb-spin 15s linear infinite;
          pointer-events: none;
        }

        .pb-flow-copy small {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          color: #06101d;
          background: #67e8f9;
          font-size: 10px;
          font-weight: 1000;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .pb-flow-card:nth-child(2) .pb-flow-copy small,
        .pb-flow-card:nth-child(2) .pb-flow-number {
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 3.2rem),
            linear-gradient(135deg, #ffd83d, #f59e0b);
        }

        .pb-flow-card:nth-child(3) .pb-flow-copy small,
        .pb-flow-card:nth-child(3) .pb-flow-number {
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 3.2rem),
            linear-gradient(135deg, #67e8f9, #22c55e);
        }

        .pb-flow-card:nth-child(4) .pb-flow-copy small,
        .pb-flow-card:nth-child(4) .pb-flow-number {
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 3.2rem),
            linear-gradient(135deg, #4aa3ff, #67e8f9);
        }

        .pb-flow-card:nth-child(5) .pb-flow-copy small,
        .pb-flow-card:nth-child(5) .pb-flow-number {
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 3.2rem),
            linear-gradient(135deg, #ffd83d, #f59e0b);
        }

        .pb-flow-copy h3 {
          margin: 11px 0 0;
          font-size: 23px;
          line-height: 1.02;
          letter-spacing: -0.052em;
        }

        .pb-flow-copy p {
          margin: 8px 0 0;
          color: rgba(247,251,255,0.6);
          font-size: 13px;
          line-height: 1.55;
        }

        .pb-flow-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 12px;
        }

        .pb-flow-pills span {
          display: inline-flex;
          align-items: center;
          min-height: 27px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247,251,255,0.72);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.075);
          font-size: 10px;
          font-weight: 900;
        }

        .pb-state-machine {
          position: sticky;
          top: 110px;
          min-height: 100%;
          padding: 20px;
          border-radius: 32px;
          background:
            radial-gradient(circle at 50% 0%, rgba(255,216,61,0.12), transparent 15rem),
            rgba(6,16,29,0.48);
          border: 1px solid rgba(255,255,255,0.09);
          overflow: hidden;
        }

        .pb-state-machine h3 {
          margin: 0;
          font-size: 31px;
          line-height: 0.98;
          letter-spacing: -0.064em;
        }

        .pb-state-machine p {
          margin: 12px 0 0;
          color: rgba(247,251,255,0.6);
          font-size: 13.5px;
          line-height: 1.58;
        }

        .pb-state-map {
          position: relative;
          min-height: 360px;
          margin-top: 22px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 50% 50%, rgba(103,232,249,0.1), transparent 12rem),
            rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.075);
          overflow: hidden;
        }

        .pb-state-core {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 3;
          display: grid;
          place-items: center;
          width: 132px;
          height: 132px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          color: #06101d;
          text-align: center;
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 4rem),
            linear-gradient(135deg, #67e8f9, #ffd83d);
          box-shadow: 0 28px 82px rgba(103,232,249,0.2);
        }

        .pb-state-core strong {
          display: block;
          font-size: 18px;
          letter-spacing: -0.055em;
        }

        .pb-state-core span {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          font-weight: 1000;
        }

        .pb-state-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          border: 1px dashed rgba(255,255,255,0.16);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .pb-state-ring-one {
          width: 230px;
          height: 230px;
        }

        .pb-state-ring-two {
          width: 300px;
          height: 300px;
          border-color: rgba(255,216,61,0.16);
        }

        .pb-state-chip {
          position: absolute;
          z-index: 4;
          display: grid;
          place-items: center;
          min-width: 88px;
          min-height: 36px;
          padding: 0 10px;
          border-radius: 999px;
          color: rgba(247,251,255,0.84);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04)),
            rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 18px 50px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          font-size: 10px;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .pb-state-chip-one { left: 50%; top: 24px; transform: translateX(-50%); }
        .pb-state-chip-two { right: 18px; top: 35%; }
        .pb-state-chip-three { right: 38px; bottom: 42px; }
        .pb-state-chip-four { left: 38px; bottom: 42px; }
        .pb-state-chip-five { left: 16px; top: 35%; }
        .pb-state-chip-six { left: 50%; bottom: 18px; transform: translateX(-50%); }

        .pb-status-legend {
          display: grid;
          gap: 9px;
          margin-top: 16px;
        }

        .pb-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 48px;
          padding: 10px 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.075);
        }

        .pb-status-row strong {
          color: rgba(247,251,255,0.88);
          font-size: 12px;
          text-transform: uppercase;
        }

        .pb-status-row span {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          color: #06101d;
          background: #ffd83d;
          font-size: 10px;
          font-weight: 1000;
        }

        @keyframes pb-flow-scan {
          0% { transform: translateX(-150%) skewX(-18deg); opacity: 0; }
          16% { opacity: 0.68; }
          52% { opacity: 0.24; }
          100% { transform: translateX(155%) skewX(-18deg); opacity: 0; }
        }

        @keyframes pb-state-orbit-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateY(-115px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateY(-115px) rotate(-360deg); }
        }

        @keyframes pb-state-orbit-2 {
          from { transform: translate(-50%, -50%) rotate(58deg) translateY(-150px) rotate(-58deg); }
          to { transform: translate(-50%, -50%) rotate(418deg) translateY(-150px) rotate(-418deg); }
        }

        @keyframes pb-state-orbit-3 {
          from { transform: translate(-50%, -50%) rotate(118deg) translateY(-150px) rotate(-118deg); }
          to { transform: translate(-50%, -50%) rotate(478deg) translateY(-150px) rotate(-478deg); }
        }

        @keyframes pb-state-orbit-4 {
          from { transform: translate(-50%, -50%) rotate(180deg) translateY(-115px) rotate(-180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg) translateY(-115px) rotate(-540deg); }
        }

        @keyframes pb-state-orbit-5 {
          from { transform: translate(-50%, -50%) rotate(242deg) translateY(-150px) rotate(-242deg); }
          to { transform: translate(-50%, -50%) rotate(602deg) translateY(-150px) rotate(-602deg); }
        }

        @keyframes pb-state-orbit-6 {
          from { transform: translate(-50%, -50%) rotate(302deg) translateY(-150px) rotate(-302deg); }
          to { transform: translate(-50%, -50%) rotate(662deg) translateY(-150px) rotate(-662deg); }
        }


        .pb-screens-section {
          position: relative;
          z-index: 2;
          padding: 0 0 108px;
        }

        .pb-screens-wrap {
          position: relative;
          overflow: hidden;
          padding: 22px;
          border-radius: 42px;
          background:
            radial-gradient(circle at 10% 0%, rgba(103,232,249,0.15), transparent 22rem),
            radial-gradient(circle at 92% 92%, rgba(255,216,61,0.1), transparent 21rem),
            linear-gradient(180deg, rgba(255,255,255,0.087), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.108);
          box-shadow:
            0 36px 118px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-screens-wrap::before {
          content: "";
          position: absolute;
          inset: -35%;
          z-index: 0;
          background:
            conic-gradient(
              from 160deg,
              transparent,
              rgba(103,232,249,0.095),
              transparent,
              rgba(255,216,61,0.07),
              transparent
            );
          animation: pb-slow-spin 40s linear infinite;
          pointer-events: none;
        }

        .pb-screens-wrap > * {
          position: relative;
          z-index: 1;
        }

        .pb-screen-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-top: 26px;
        }

        .pb-screen-card {
          position: relative;
          overflow: hidden;
          min-height: 640px;
          padding: 18px;
          border-radius: 32px;
          background:
            radial-gradient(circle at 84% 0%, rgba(103,232,249,0.13), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.096);
          box-shadow:
            0 24px 82px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .pb-screen-card:nth-child(2) {
          background:
            radial-gradient(circle at 84% 0%, rgba(255,216,61,0.13), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
        }

        .pb-screen-card:nth-child(3) {
          background:
            radial-gradient(circle at 84% 0%, rgba(34,197,94,0.12), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
        }

        .pb-screen-card:nth-child(4) {
          background:
            radial-gradient(circle at 84% 0%, rgba(74,163,255,0.13), transparent 12rem),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
        }

        .pb-screen-card::before {
          content: "";
          position: absolute;
          left: 18px;
          right: 18px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(103,232,249,0.9), transparent);
          box-shadow: 0 0 24px rgba(103,232,249,0.16);
        }

        .pb-screen-card:nth-child(2)::before {
          background: linear-gradient(90deg, transparent, rgba(255,216,61,0.9), transparent);
        }

        .pb-screen-card:nth-child(3)::before {
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.9), transparent);
        }

        .pb-screen-card:nth-child(4)::before {
          background: linear-gradient(90deg, transparent, rgba(74,163,255,0.9), transparent);
        }

        .pb-screen-card::after {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: 0;
          z-index: 2;
          width: 38%;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(103,232,249,0.16), transparent);
          transform: translateX(-150%) skewX(-17deg);
          animation: pb-flow-scan 7.4s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .pb-screen-card:nth-child(2)::after {
          animation-delay: -1.8s;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.13), rgba(255,216,61,0.16), transparent);
        }

        .pb-screen-card:nth-child(3)::after {
          animation-delay: -3.6s;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.13), rgba(34,197,94,0.15), transparent);
        }

        .pb-screen-card:nth-child(4)::after {
          animation-delay: -5.4s;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.13), rgba(74,163,255,0.16), transparent);
        }

        .pb-screen-mock-area {
          position: relative;
          display: grid;
          place-items: center;
          min-height: 355px;
          margin-bottom: 18px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 50% 15%, rgba(103,232,249,0.13), transparent 16rem),
            rgba(255,255,255,0.042);
          border: 1px solid rgba(255,255,255,0.078);
          overflow: hidden;
        }

        .pb-screen-mock-area::before {
          content: "";
          position: absolute;
          inset: 32px;
          border-radius: 999px;
          border: 1px dashed rgba(103,232,249,0.18);
          animation: pb-spin 19s linear infinite;
          pointer-events: none;
        }

        .pb-screen-phone {
          position: relative;
          z-index: 1;
          width: 218px;
          min-height: 310px;
          padding: 14px;
          border-radius: 30px;
          background: #f8fafc;
          color: #111827;
          box-shadow:
            0 28px 78px rgba(0,0,0,0.34),
            inset 0 0 0 1px rgba(2, 6, 23, 0.08);
        }

        .pb-screen-dark {
          color: #f7fbff;
          background:
            radial-gradient(circle at 30% 0%, rgba(103,232,249,0.12), transparent 9rem),
            #06101d;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .pb-screen-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pb-screen-top strong {
          font-size: 14px;
          letter-spacing: -0.035em;
        }

        .pb-screen-top span {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          color: #ffffff;
          background: var(--pb-blue);
          font-size: 10px;
          font-weight: 950;
        }

        .pb-screen-dark .pb-screen-top span {
          color: #06101d;
          background: var(--pb-yellow);
        }

        .pb-screen-field {
          min-height: 47px;
          margin-top: 10px;
          padding: 10px;
          border-radius: 15px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-screen-field-strong {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .pb-screen-field small,
        .pb-screen-request-card small {
          display: block;
          color: #64748b;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pb-screen-field b,
        .pb-screen-request-card b {
          display: block;
          margin-top: 4px;
          color: #0f172a;
          font-size: 12px;
        }

        .pb-screen-grid-two {
          display: grid;
          grid-template-columns: 1fr 0.74fr;
          gap: 8px;
        }

        .pb-screen-photo-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 10px;
        }

        .pb-screen-photo-strip i,
        .pb-quote-photo-demo i {
          min-height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #dbeafe, #cffafe);
          border: 1px dashed rgba(11,99,246,0.28);
        }

        .pb-screen-submit {
          display: grid;
          place-items: center;
          min-height: 34px;
          margin-top: 11px;
          border-radius: 999px;
          color: #ffffff;
          background: var(--pb-blue);
          font-size: 11px;
          font-weight: 950;
        }

        .pb-screen-request-card,
        .pb-screen-detail-list,
        .pb-screen-actions-row {
          margin-top: 12px;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .pb-screen-request-card small,
        .pb-screen-request-card b {
          color: rgba(247,251,255,0.9);
        }

        .pb-screen-request-card em {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          margin-top: 8px;
          padding: 0 8px;
          border-radius: 999px;
          color: #06101d;
          background: var(--pb-yellow);
          font-size: 10px;
          font-style: normal;
          font-weight: 950;
        }

        .pb-screen-detail-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .pb-screen-detail-list i {
          display: grid;
          place-items: center;
          min-height: 29px;
          border-radius: 11px;
          color: rgba(247,251,255,0.72);
          background: rgba(255,255,255,0.06);
          font-size: 9px;
          font-style: normal;
          font-weight: 900;
        }

        .pb-screen-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .pb-screen-actions-row span,
        .pb-screen-actions-row strong {
          display: grid;
          place-items: center;
          min-height: 32px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
        }

        .pb-screen-actions-row span {
          color: rgba(247,251,255,0.7);
          background: rgba(255,255,255,0.06);
        }

        .pb-screen-actions-row strong {
          color: #06101d;
          background: var(--pb-yellow);
        }

        .pb-quote-card-demo {
          margin-top: 12px;
          padding: 12px;
          border-radius: 18px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-quote-card-best {
          background: #ecfeff;
          border-color: #a5f3fc;
        }

        .pb-quote-card-demo small {
          display: block;
          color: #64748b;
          font-size: 9px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .pb-quote-card-demo b {
          display: block;
          margin-top: 5px;
          color: #0f172a;
          font-size: 20px;
          letter-spacing: -0.055em;
        }

        .pb-quote-card-demo em {
          display: block;
          margin-top: 5px;
          color: #475569;
          font-size: 10px;
          font-style: normal;
          font-weight: 850;
        }

        .pb-quote-photo-demo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 10px;
        }

        .pb-screen-warning {
          margin-top: 13px;
          padding: 12px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
        }

        .pb-screen-warning b {
          display: block;
          color: #9a3412;
          font-size: 12px;
        }

        .pb-screen-warning small {
          display: block;
          margin-top: 4px;
          color: #c2410c;
          font-size: 10px;
          font-weight: 800;
        }

        .pb-screen-bubble {
          max-width: 84%;
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 18px;
          font-size: 11px;
          font-weight: 850;
        }

        .pb-screen-bubble-left {
          background: #e2e8f0;
          color: #0f172a;
        }

        .pb-screen-bubble-right {
          justify-self: end;
          margin-left: auto;
          color: #ffffff;
          background: var(--pb-blue);
        }

        .pb-screen-chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 38px;
          margin-top: 12px;
          padding: 0 10px;
          border-radius: 999px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-screen-chat-input span {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 850;
        }

        .pb-screen-chat-input strong {
          color: var(--pb-blue);
          font-size: 11px;
        }

        .pb-screen-card h3 {
          margin: 10px 0 0;
          font-size: 26px;
          line-height: 0.98;
          letter-spacing: -0.058em;
        }

        .pb-screen-card p {
          margin: 10px 0 0;
          color: rgba(247,251,255,0.6);
          font-size: 13px;
          line-height: 1.55;
        }

        .pb-screen-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 15px;
        }

        .pb-screen-highlights span {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247,251,255,0.72);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.075);
          font-size: 10px;
          font-weight: 900;
        }


        .pb-premium-section {
          position: relative;
          z-index: 2;
          padding: 0 0 110px;
        }

        .pb-premium-wrap {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 0.58fr) minmax(440px, 0.62fr);
          gap: 22px;
          align-items: stretch;
          padding: 22px;
          border-radius: 44px;
          background:
            radial-gradient(circle at 8% 0%, rgba(255,216,61,0.14), transparent 22rem),
            radial-gradient(circle at 95% 92%, rgba(103,232,249,0.13), transparent 22rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 38px 122px rgba(0,0,0,0.26),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-premium-wrap::before {
          content: "";
          position: absolute;
          inset: -35%;
          background:
            conic-gradient(
              from 210deg,
              transparent,
              rgba(255,216,61,0.1),
              transparent,
              rgba(103,232,249,0.095),
              transparent
            );
          animation: pb-slow-spin 42s linear infinite;
          pointer-events: none;
        }

        .pb-premium-wrap > * {
          position: relative;
          z-index: 1;
        }

        .pb-premium-copy {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          padding: 14px;
        }

        .pb-premium-copy h2 {
          max-width: 660px;
          margin: 11px 0 0;
          font-size: clamp(40px, 5.4vw, 72px);
          line-height: 0.93;
          letter-spacing: -0.075em;
        }

        .pb-premium-copy p {
          max-width: 640px;
          margin: 16px 0 0;
          color: rgba(247,251,255,0.64);
          font-size: 15px;
          line-height: 1.66;
        }

        .pb-premium-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 24px;
        }

        .pb-premium-metric {
          min-height: 112px;
          padding: 16px;
          border-radius: 24px;
          background:
            radial-gradient(circle at 88% 0%, rgba(255,216,61,0.12), transparent 8rem),
            rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 18px 54px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .pb-premium-metric strong {
          display: block;
          font-size: 25px;
          letter-spacing: -0.055em;
        }

        .pb-premium-metric span {
          display: block;
          margin-top: 7px;
          color: var(--pb-faint);
          font-size: 11px;
          font-weight: 850;
          line-height: 1.35;
        }

        .pb-premium-steps {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .pb-premium-step {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 12px;
          align-items: center;
          min-height: 78px;
          padding: 12px;
          border-radius: 22px;
          background: rgba(6,16,29,0.42);
          border: 1px solid rgba(255,255,255,0.075);
        }

        .pb-premium-step-number {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 15px;
          color: #06101d;
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 3rem),
            linear-gradient(135deg, #ffd83d, #f59e0b);
          font-size: 12px;
          font-weight: 1000;
        }

        .pb-premium-step strong {
          display: block;
          font-size: 15px;
          letter-spacing: -0.035em;
        }

        .pb-premium-step p {
          margin: 5px 0 0;
          color: rgba(247,251,255,0.55);
          font-size: 12px;
          line-height: 1.38;
        }

        .pb-premium-step-label {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: #06101d;
          background: #67e8f9;
          font-size: 10px;
          font-weight: 1000;
          white-space: nowrap;
        }

        .pb-premium-visual {
          position: relative;
          min-height: 690px;
          border-radius: 36px;
          background:
            radial-gradient(circle at 50% 18%, rgba(255,216,61,0.14), transparent 18rem),
            radial-gradient(circle at 50% 82%, rgba(103,232,249,0.12), transparent 18rem),
            rgba(255,255,255,0.042);
          border: 1px solid rgba(255,255,255,0.082);
          overflow: hidden;
        }

        .pb-premium-visual::after {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: 0;
          z-index: 20;
          width: 38%;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(255,216,61,0.17), transparent);
          transform: translateX(-150%) skewX(-17deg);
          animation: pb-flow-scan 7.2s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .pb-premium-core {
          position: absolute;
          left: 50%;
          top: 42%;
          z-index: 4;
          display: grid;
          place-items: center;
          width: 168px;
          height: 168px;
          padding: 18px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          text-align: center;
          color: #06101d;
          background:
            radial-gradient(circle at 30% 14%, rgba(255,255,255,0.96), transparent 4.2rem),
            linear-gradient(135deg, #ffd83d, #67e8f9);
          box-shadow:
            0 30px 88px rgba(255,216,61,0.16),
            0 18px 58px rgba(103,232,249,0.13);
        }

        .pb-premium-core strong {
          display: block;
          font-size: 24px;
          letter-spacing: -0.06em;
        }

        .pb-premium-core span {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          font-weight: 1000;
        }

        .pb-premium-ring {
          position: absolute;
          left: 50%;
          top: 42%;
          border-radius: 999px;
          border: 1px dashed rgba(255,255,255,0.16);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .pb-premium-ring-one {
          width: 300px;
          height: 300px;
        }

        .pb-premium-ring-two {
          width: 410px;
          height: 410px;
          border-color: rgba(255,216,61,0.16);
        }

        .pb-premium-node {
          position: absolute;
          z-index: 5;
          width: 160px;
          padding: 12px;
          border-radius: 20px;
          color: rgba(247,251,255,0.88);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.04)),
            rgba(6,16,29,0.48);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 20px 58px rgba(0,0,0,0.24),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
        }

        .pb-premium-node strong {
          display: block;
          font-size: 13px;
          letter-spacing: -0.035em;
        }

        .pb-premium-node span {
          display: block;
          margin-top: 4px;
          color: var(--pb-faint);
          font-size: 10px;
          font-weight: 850;
        }

        .pb-premium-node-one {
          left: 50%;
          top: 38px;
          transform: translateX(-50%);
        }

        .pb-premium-node-two {
          right: 26px;
          top: 33%;
        }

        .pb-premium-node-three {
          left: 26px;
          top: 33%;
        }

        .pb-premium-node-four {
          left: 50%;
          top: 370px;
          transform: translateX(-50%);
        }

        .pb-premium-phone {
          position: absolute;
          left: 50%;
          bottom: 28px;
          z-index: 6;
          width: 280px;
          padding: 14px;
          transform: translateX(-50%);
          border-radius: 30px;
          color: #111827;
          background: #f8fafc;
          box-shadow:
            0 28px 86px rgba(0,0,0,0.36),
            inset 0 0 0 1px rgba(2, 6, 23, 0.08);
        }

        .pb-premium-phone-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pb-premium-phone-top strong {
          font-size: 15px;
          letter-spacing: -0.035em;
        }

        .pb-premium-phone-top span {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          color: #06101d;
          background: #ffd83d;
          font-size: 10px;
          font-weight: 1000;
        }

        .pb-premium-lock-card {
          margin-top: 12px;
          padding: 12px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
        }

        .pb-premium-lock-card small {
          display: block;
          color: #c2410c;
          font-size: 9px;
          font-weight: 1000;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pb-premium-lock-card b {
          display: block;
          margin-top: 5px;
          color: #9a3412;
          font-size: 13px;
        }

        .pb-premium-lock-card em {
          display: block;
          margin-top: 5px;
          color: #c2410c;
          font-size: 10px;
          font-style: normal;
          font-weight: 850;
          line-height: 1.35;
        }

        .pb-premium-receipt {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 10px;
          align-items: center;
          margin-top: 10px;
          padding: 10px;
          border-radius: 16px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-premium-receipt i {
          display: block;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background:
            linear-gradient(135deg, rgba(255,216,61,0.22), rgba(103,232,249,0.18)),
            #e0f2fe;
          border: 1px dashed rgba(11,99,246,0.25);
        }

        .pb-premium-receipt strong {
          display: block;
          color: #0f172a;
          font-size: 12px;
        }

        .pb-premium-receipt span {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 10px;
          font-weight: 850;
        }

        .pb-premium-button {
          display: grid;
          place-items: center;
          min-height: 38px;
          margin-top: 10px;
          border-radius: 999px;
          color: #fff;
          background: linear-gradient(135deg, var(--pb-blue), #2563eb);
          box-shadow: 0 16px 34px rgba(11, 99, 246, 0.18);
          font-size: 11px;
          font-weight: 1000;
        }

        @keyframes pb-premium-orbit-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateY(-150px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateY(-150px) rotate(-360deg); }
        }

        @keyframes pb-premium-orbit-2 {
          from { transform: translate(-50%, -50%) rotate(90deg) translateY(-205px) rotate(-90deg); }
          to { transform: translate(-50%, -50%) rotate(450deg) translateY(-205px) rotate(-450deg); }
        }

        @keyframes pb-premium-orbit-3 {
          from { transform: translate(-50%, -50%) rotate(270deg) translateY(-205px) rotate(-270deg); }
          to { transform: translate(-50%, -50%) rotate(630deg) translateY(-205px) rotate(-630deg); }
        }

        @keyframes pb-premium-orbit-4 {
          from { transform: translate(-50%, -50%) rotate(180deg) translateY(-150px) rotate(-180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg) translateY(-150px) rotate(-540deg); }
        }


        .pb-ops-section {
          position: relative;
          z-index: 2;
          padding: 0 0 112px;
        }

        .pb-ops-wrap {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(420px, 0.58fr) minmax(0, 0.62fr);
          gap: 22px;
          align-items: stretch;
          padding: 22px;
          border-radius: 44px;
          background:
            radial-gradient(circle at 8% 0%, rgba(74,163,255,0.16), transparent 23rem),
            radial-gradient(circle at 94% 96%, rgba(34,197,94,0.11), transparent 22rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 38px 122px rgba(0,0,0,0.26),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-ops-wrap::before {
          content: "";
          position: absolute;
          inset: -36%;
          background:
            conic-gradient(
              from 250deg,
              transparent,
              rgba(74,163,255,0.1),
              transparent,
              rgba(34,197,94,0.085),
              transparent
            );
          animation: pb-slow-spin 44s linear infinite;
          pointer-events: none;
        }

        .pb-ops-wrap > * {
          position: relative;
          z-index: 1;
        }

        .pb-ops-visual {
          position: relative;
          min-height: 700px;
          border-radius: 36px;
          background:
            radial-gradient(circle at 50% 18%, rgba(74,163,255,0.14), transparent 18rem),
            radial-gradient(circle at 50% 82%, rgba(34,197,94,0.11), transparent 18rem),
            rgba(255,255,255,0.042);
          border: 1px solid rgba(255,255,255,0.082);
          overflow: hidden;
        }

        .pb-ops-visual::before {
          content: "";
          position: absolute;
          inset: 38px;
          border-radius: 999px;
          border: 1px dashed rgba(74,163,255,0.18);
          animation: pb-spin 26s linear infinite;
          pointer-events: none;
        }

        .pb-ops-visual::after {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: 0;
          z-index: 20;
          width: 38%;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(74,163,255,0.18), transparent);
          transform: translateX(-150%) skewX(-17deg);
          animation: pb-flow-scan 7.6s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .pb-ops-dashboard {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 4;
          width: min(420px, calc(100% - 52px));
          padding: 18px;
          transform: translate(-50%, -50%);
          border-radius: 30px;
          color: #f7fbff;
          background:
            radial-gradient(circle at 22% 0%, rgba(74,163,255,0.16), transparent 12rem),
            linear-gradient(180deg, rgba(6,16,29,0.92), rgba(6,16,29,0.74));
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow:
            0 30px 96px rgba(0,0,0,0.38),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
        }

        .pb-ops-dashboard-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .pb-ops-dashboard-top strong {
          display: block;
          font-size: 22px;
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .pb-ops-dashboard-top span {
          display: block;
          margin-top: 6px;
          color: rgba(247,251,255,0.5);
          font-size: 11px;
          font-weight: 850;
        }

        .pb-ops-dashboard-top i {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          color: #06101d;
          background: #22c55e;
          font-size: 10px;
          font-style: normal;
          font-weight: 1000;
        }

        .pb-ops-kpi-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .pb-ops-kpi-row div {
          min-height: 98px;
          padding: 13px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 80% 0%, rgba(74,163,255,0.12), transparent 7rem),
            rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.078);
        }

        .pb-ops-kpi-row strong {
          display: block;
          font-size: 28px;
          letter-spacing: -0.06em;
        }

        .pb-ops-kpi-row span {
          display: block;
          margin-top: 6px;
          color: rgba(247,251,255,0.5);
          font-size: 10px;
          font-weight: 850;
          line-height: 1.3;
        }

        .pb-ops-table {
          display: grid;
          gap: 9px;
          margin-top: 16px;
        }

        .pb-ops-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 48px;
          padding: 10px 12px;
          border-radius: 17px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .pb-ops-row span {
          min-width: 0;
          overflow: hidden;
          color: rgba(247,251,255,0.78);
          font-size: 11px;
          font-weight: 900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pb-ops-row strong {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          color: #06101d;
          background: #67e8f9;
          font-size: 9px;
          font-weight: 1000;
          white-space: nowrap;
        }

        .pb-ops-row:nth-child(2) strong {
          background: #22c55e;
        }

        .pb-ops-row:nth-child(3) strong {
          background: #ffd83d;
        }

        .pb-ops-row:nth-child(5) strong {
          background: #f59e0b;
        }

        .pb-ops-float {
          position: absolute;
          z-index: 5;
          width: 168px;
          padding: 13px;
          border-radius: 20px;
          color: rgba(247,251,255,0.9);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04)),
            rgba(6,16,29,0.52);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 22px 62px rgba(0,0,0,0.26),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          animation: pb-float 5.7s ease-in-out infinite;
        }

        .pb-ops-float strong {
          display: block;
          font-size: 13px;
          letter-spacing: -0.035em;
        }

        .pb-ops-float span {
          display: block;
          margin-top: 5px;
          color: var(--pb-faint);
          font-size: 10px;
          font-weight: 850;
        }

        .pb-ops-float-one {
          left: 24px;
          top: 72px;
        }

        .pb-ops-float-two {
          right: 24px;
          top: 112px;
          animation-delay: -1.9s;
        }

        .pb-ops-float-three {
          right: 34px;
          bottom: 86px;
          animation-delay: -3.6s;
        }

        .pb-ops-copy {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          padding: 14px;
        }

        .pb-ops-copy h2 {
          max-width: 660px;
          margin: 11px 0 0;
          font-size: clamp(40px, 5.4vw, 72px);
          line-height: 0.93;
          letter-spacing: -0.075em;
        }

        .pb-ops-copy > p {
          max-width: 650px;
          margin: 16px 0 0;
          color: rgba(247,251,255,0.64);
          font-size: 15px;
          line-height: 1.66;
        }

        .pb-ops-control-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 24px;
        }

        .pb-ops-control-card {
          position: relative;
          overflow: hidden;
          min-height: 236px;
          padding: 16px;
          border-radius: 25px;
          background:
            radial-gradient(circle at 84% 0%, rgba(74,163,255,0.12), transparent 8rem),
            rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.082);
          box-shadow:
            0 18px 58px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .pb-ops-control-card::before {
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(74,163,255,0.9), transparent);
          box-shadow: 0 0 24px rgba(74,163,255,0.16);
        }

        .pb-ops-control-card:nth-child(2)::before {
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.9), transparent);
          box-shadow: 0 0 24px rgba(34,197,94,0.16);
        }

        .pb-ops-control-card:nth-child(3)::before {
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.9), transparent);
          box-shadow: 0 0 24px rgba(245,158,11,0.16);
        }

        .pb-ops-control-card:nth-child(4)::before {
          background: linear-gradient(90deg, transparent, rgba(103,232,249,0.9), transparent);
          box-shadow: 0 0 24px rgba(103,232,249,0.16);
        }

        .pb-ops-control-card h3 {
          margin: 0;
          font-size: 21px;
          line-height: 1.04;
          letter-spacing: -0.05em;
        }

        .pb-ops-control-card p {
          margin: 10px 0 0;
          color: rgba(247,251,255,0.6);
          font-size: 13px;
          line-height: 1.55;
        }

        .pb-ops-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }

        .pb-ops-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247,251,255,0.72);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.075);
          font-size: 10px;
          font-weight: 900;
        }


        .pb-architecture-section {
          position: relative;
          z-index: 2;
          padding: 0 0 114px;
        }

        .pb-architecture-wrap {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 0.58fr) minmax(440px, 0.62fr);
          gap: 22px;
          align-items: stretch;
          padding: 22px;
          border-radius: 44px;
          background:
            radial-gradient(circle at 8% 0%, rgba(103,232,249,0.16), transparent 23rem),
            radial-gradient(circle at 95% 92%, rgba(74,163,255,0.13), transparent 22rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 38px 122px rgba(0,0,0,0.26),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-architecture-wrap::before {
          content: "";
          position: absolute;
          inset: -36%;
          background:
            conic-gradient(
              from 290deg,
              transparent,
              rgba(103,232,249,0.105),
              transparent,
              rgba(74,163,255,0.09),
              transparent
            );
          animation: pb-slow-spin 46s linear infinite;
          pointer-events: none;
        }

        .pb-architecture-wrap > * {
          position: relative;
          z-index: 1;
        }

        .pb-architecture-copy {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          padding: 14px;
        }

        .pb-architecture-copy h2 {
          max-width: 700px;
          margin: 11px 0 0;
          font-size: clamp(40px, 5.4vw, 72px);
          line-height: 0.93;
          letter-spacing: -0.075em;
        }

        .pb-architecture-copy > p {
          max-width: 650px;
          margin: 16px 0 0;
          color: rgba(247,251,255,0.64);
          font-size: 15px;
          line-height: 1.66;
        }

        .pb-architecture-layer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 24px;
        }

        .pb-architecture-layer {
          min-height: 250px;
          padding: 16px;
          border-radius: 25px;
          background:
            radial-gradient(circle at 84% 0%, rgba(103,232,249,0.12), transparent 8rem),
            rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.082);
          box-shadow:
            0 18px 58px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .pb-architecture-layer:nth-child(2) {
          background:
            radial-gradient(circle at 84% 0%, rgba(74,163,255,0.13), transparent 8rem),
            rgba(255,255,255,0.055);
        }

        .pb-architecture-layer:nth-child(3) {
          background:
            radial-gradient(circle at 84% 0%, rgba(255,216,61,0.11), transparent 8rem),
            rgba(255,255,255,0.055);
        }

        .pb-architecture-layer:nth-child(4) {
          background:
            radial-gradient(circle at 84% 0%, rgba(34,197,94,0.11), transparent 8rem),
            rgba(255,255,255,0.055);
        }

        .pb-architecture-layer h3 {
          margin: 0;
          font-size: 21px;
          line-height: 1.04;
          letter-spacing: -0.05em;
        }

        .pb-architecture-layer p {
          margin: 10px 0 0;
          color: rgba(247,251,255,0.6);
          font-size: 13px;
          line-height: 1.55;
        }

        .pb-architecture-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }

        .pb-architecture-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247,251,255,0.72);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.075);
          font-size: 10px;
          font-weight: 900;
        }

        .pb-data-table-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 16px;
        }

        .pb-data-table-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 44px;
          padding: 10px 11px;
          border-radius: 17px;
          background: rgba(6,16,29,0.42);
          border: 1px solid rgba(255,255,255,0.072);
        }

        .pb-data-table-chip strong {
          min-width: 0;
          overflow: hidden;
          color: rgba(247,251,255,0.84);
          font-size: 10px;
          font-weight: 950;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pb-data-table-chip span {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          min-height: 23px;
          padding: 0 7px;
          border-radius: 999px;
          color: #06101d;
          background: #67e8f9;
          font-size: 9px;
          font-weight: 1000;
          white-space: nowrap;
        }

        .pb-data-table-chip:nth-child(3n + 2) span {
          background: #ffd83d;
        }

        .pb-data-table-chip:nth-child(3n + 3) span {
          background: #22c55e;
        }

        .pb-architecture-visual {
          position: relative;
          min-height: 760px;
          border-radius: 36px;
          background:
            radial-gradient(circle at 50% 18%, rgba(103,232,249,0.15), transparent 19rem),
            radial-gradient(circle at 50% 82%, rgba(74,163,255,0.12), transparent 19rem),
            rgba(255,255,255,0.042);
          border: 1px solid rgba(255,255,255,0.082);
          overflow: hidden;
        }

        .pb-architecture-visual::before {
          content: "";
          position: absolute;
          inset: 38px;
          border-radius: 999px;
          border: 1px dashed rgba(103,232,249,0.18);
          animation: pb-spin 28s linear infinite;
          pointer-events: none;
        }

        .pb-architecture-visual::after {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: 0;
          z-index: 20;
          width: 38%;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(103,232,249,0.18), transparent);
          transform: translateX(-150%) skewX(-17deg);
          animation: pb-flow-scan 7.8s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .pb-architecture-core {
          position: absolute;
          left: 50%;
          top: 37%;
          z-index: 5;
          display: grid;
          place-items: center;
          width: 174px;
          height: 174px;
          padding: 18px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          text-align: center;
          color: #06101d;
          background:
            radial-gradient(circle at 30% 14%, rgba(255,255,255,0.96), transparent 4.2rem),
            linear-gradient(135deg, #67e8f9, #4aa3ff);
          box-shadow:
            0 30px 88px rgba(103,232,249,0.17),
            0 18px 58px rgba(74,163,255,0.14);
        }

        .pb-architecture-core strong {
          display: block;
          font-size: 24px;
          letter-spacing: -0.06em;
        }

        .pb-architecture-core span {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          font-weight: 1000;
        }

        .pb-architecture-ring {
          position: absolute;
          left: 50%;
          top: 37%;
          border-radius: 999px;
          border: 1px dashed rgba(255,255,255,0.16);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .pb-architecture-ring-one {
          width: 310px;
          height: 310px;
        }

        .pb-architecture-ring-two {
          width: 430px;
          height: 430px;
          border-color: rgba(103,232,249,0.18);
        }

        .pb-architecture-node {
          position: absolute;
          z-index: 6;
          width: 150px;
          padding: 12px;
          border-radius: 20px;
          color: rgba(247,251,255,0.9);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04)),
            rgba(6,16,29,0.52);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 22px 62px rgba(0,0,0,0.26),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
        }

        .pb-architecture-node strong {
          display: block;
          font-size: 13px;
          letter-spacing: -0.035em;
        }

        .pb-architecture-node span {
          display: block;
          margin-top: 5px;
          color: var(--pb-faint);
          font-size: 10px;
          font-weight: 850;
        }

        .pb-arch-node-one {
          left: 50%;
          top: 34px;
          transform: translateX(-50%);
        }

        .pb-arch-node-two {
          right: 24px;
          top: 25%;
        }

        .pb-arch-node-three {
          right: 42px;
          top: 48%;
        }

        .pb-arch-node-four {
          left: 42px;
          top: 48%;
        }

        .pb-arch-node-five {
          left: 24px;
          top: 25%;
        }

        .pb-arch-node-six {
          left: 50%;
          top: 314px;
          transform: translateX(-50%);
        }

        .pb-architecture-panel {
          position: absolute;
          left: 50%;
          bottom: 28px;
          z-index: 7;
          width: min(430px, calc(100% - 50px));
          padding: 16px;
          transform: translateX(-50%);
          border-radius: 30px;
          background:
            radial-gradient(circle at 20% 0%, rgba(103,232,249,0.14), transparent 10rem),
            linear-gradient(180deg, rgba(6,16,29,0.92), rgba(6,16,29,0.72));
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow:
            0 28px 86px rgba(0,0,0,0.36),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
        }

        .pb-architecture-panel-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .pb-architecture-panel-top strong {
          display: block;
          font-size: 22px;
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .pb-architecture-panel-top span {
          display: block;
          margin-top: 6px;
          color: rgba(247,251,255,0.5);
          font-size: 11px;
          font-weight: 850;
        }

        .pb-architecture-panel-top i {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          color: #06101d;
          background: #67e8f9;
          font-size: 10px;
          font-style: normal;
          font-weight: 1000;
        }

        .pb-architecture-flow {
          display: grid;
          gap: 8px;
          margin-top: 14px;
        }

        .pb-architecture-flow-row {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 10px;
          align-items: center;
          min-height: 42px;
          padding: 8px 10px;
          border-radius: 16px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .pb-architecture-flow-row b {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 10px;
          color: #06101d;
          background: #67e8f9;
          font-size: 10px;
          font-weight: 1000;
        }

        .pb-architecture-flow-row span {
          color: rgba(247,251,255,0.78);
          font-size: 11px;
          font-weight: 850;
        }

        @keyframes pb-architecture-orbit-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateY(-155px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateY(-155px) rotate(-360deg); }
        }

        @keyframes pb-architecture-orbit-2 {
          from { transform: translate(-50%, -50%) rotate(58deg) translateY(-215px) rotate(-58deg); }
          to { transform: translate(-50%, -50%) rotate(418deg) translateY(-215px) rotate(-418deg); }
        }

        @keyframes pb-architecture-orbit-3 {
          from { transform: translate(-50%, -50%) rotate(118deg) translateY(-215px) rotate(-118deg); }
          to { transform: translate(-50%, -50%) rotate(478deg) translateY(-215px) rotate(-478deg); }
        }

        @keyframes pb-architecture-orbit-4 {
          from { transform: translate(-50%, -50%) rotate(180deg) translateY(-155px) rotate(-180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg) translateY(-155px) rotate(-540deg); }
        }

        @keyframes pb-architecture-orbit-5 {
          from { transform: translate(-50%, -50%) rotate(242deg) translateY(-215px) rotate(-242deg); }
          to { transform: translate(-50%, -50%) rotate(602deg) translateY(-215px) rotate(-602deg); }
        }

        @keyframes pb-architecture-orbit-6 {
          from { transform: translate(-50%, -50%) rotate(302deg) translateY(-215px) rotate(-302deg); }
          to { transform: translate(-50%, -50%) rotate(662deg) translateY(-215px) rotate(-662deg); }
        }


        .pb-value-section {
          position: relative;
          z-index: 2;
          padding: 0 0 116px;
        }

        .pb-value-wrap {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(440px, 0.62fr) minmax(0, 0.58fr);
          gap: 22px;
          align-items: stretch;
          padding: 22px;
          border-radius: 44px;
          background:
            radial-gradient(circle at 8% 0%, rgba(255,216,61,0.14), transparent 23rem),
            radial-gradient(circle at 95% 92%, rgba(34,197,94,0.12), transparent 22rem),
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.11);
          box-shadow:
            0 38px 122px rgba(0,0,0,0.26),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .pb-value-wrap::before {
          content: "";
          position: absolute;
          inset: -36%;
          background:
            conic-gradient(
              from 330deg,
              transparent,
              rgba(255,216,61,0.1),
              transparent,
              rgba(34,197,94,0.085),
              transparent
            );
          animation: pb-slow-spin 48s linear infinite;
          pointer-events: none;
        }

        .pb-value-wrap > * {
          position: relative;
          z-index: 1;
        }

        .pb-value-visual {
          position: relative;
          min-height: 720px;
          border-radius: 36px;
          background:
            radial-gradient(circle at 50% 18%, rgba(255,216,61,0.13), transparent 19rem),
            radial-gradient(circle at 50% 82%, rgba(34,197,94,0.11), transparent 19rem),
            rgba(255,255,255,0.042);
          border: 1px solid rgba(255,255,255,0.082);
          overflow: hidden;
        }

        .pb-value-visual::before {
          content: "";
          position: absolute;
          inset: 40px;
          border-radius: 999px;
          border: 1px dashed rgba(255,216,61,0.18);
          animation: pb-spin 30s linear infinite;
          pointer-events: none;
        }

        .pb-value-visual::after {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: 0;
          z-index: 20;
          width: 38%;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.14), rgba(255,216,61,0.17), transparent);
          transform: translateX(-150%) skewX(-17deg);
          animation: pb-flow-scan 8s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .pb-value-before,
        .pb-value-after {
          position: absolute;
          z-index: 4;
          width: 260px;
          padding: 14px;
          border-radius: 28px;
          box-shadow:
            0 28px 86px rgba(0,0,0,0.36),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .pb-value-before {
          left: 28px;
          top: 70px;
          color: rgba(247,251,255,0.9);
          background:
            radial-gradient(circle at 30% 0%, rgba(239,68,68,0.12), transparent 9rem),
            rgba(6,16,29,0.68);
          border: 1px solid rgba(239,68,68,0.18);
          transform: rotate(-2deg);
        }

        .pb-value-after {
          right: 28px;
          top: 230px;
          color: #111827;
          background: #f8fafc;
          border: 1px solid rgba(255,255,255,0.14);
          transform: rotate(2deg);
        }

        .pb-value-mini-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pb-value-mini-top strong {
          font-size: 16px;
          letter-spacing: -0.04em;
        }

        .pb-value-mini-top span {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 0 8px;
          border-radius: 999px;
          color: #06101d;
          background: #ffd83d;
          font-size: 10px;
          font-weight: 1000;
        }

        .pb-value-before .pb-value-mini-top span {
          color: #fff;
          background: #ef4444;
        }

        .pb-value-call-list {
          display: grid;
          gap: 8px;
          margin-top: 14px;
        }

        .pb-value-call-list i {
          display: flex;
          align-items: center;
          min-height: 36px;
          padding: 0 10px;
          border-radius: 14px;
          color: rgba(247,251,255,0.66);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.07);
          font-size: 11px;
          font-style: normal;
          font-weight: 850;
        }

        .pb-value-call-list i::before {
          content: "";
          width: 7px;
          height: 7px;
          margin-right: 8px;
          border-radius: 999px;
          background: #ef4444;
          box-shadow: 0 0 14px rgba(239,68,68,0.5);
        }

        .pb-value-request-card {
          margin-top: 13px;
          padding: 12px;
          border-radius: 18px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .pb-value-request-card small {
          display: block;
          color: #64748b;
          font-size: 9px;
          font-weight: 1000;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pb-value-request-card b {
          display: block;
          margin-top: 5px;
          color: #0f172a;
          font-size: 13px;
        }

        .pb-value-request-card em {
          display: block;
          margin-top: 5px;
          color: #475569;
          font-size: 10px;
          font-style: normal;
          font-weight: 850;
        }

        .pb-value-quotes {
          display: grid;
          gap: 8px;
          margin-top: 11px;
        }

        .pb-value-quotes div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 43px;
          padding: 10px;
          border-radius: 15px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .pb-value-quotes strong {
          color: #0f172a;
          font-size: 13px;
        }

        .pb-value-quotes span {
          color: #64748b;
          font-size: 10px;
          font-weight: 850;
        }

        .pb-value-arrow {
          position: absolute;
          left: 50%;
          top: 48%;
          z-index: 5;
          display: grid;
          place-items: center;
          width: 74px;
          height: 74px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          color: #06101d;
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.95), transparent 3.8rem),
            linear-gradient(135deg, #ffd83d, #22c55e);
          box-shadow:
            0 26px 78px rgba(255,216,61,0.16),
            0 18px 58px rgba(34,197,94,0.13);
          font-size: 32px;
          font-weight: 1000;
        }

        .pb-value-arrow::after {
          content: "";
          position: absolute;
          inset: -12px;
          border-radius: 999px;
          border: 1px dashed rgba(255,216,61,0.28);
          animation: pb-spin 16s linear infinite;
          pointer-events: none;
        }

        .pb-value-floating {
          position: absolute;
          z-index: 6;
          width: 174px;
          padding: 13px;
          border-radius: 20px;
          color: rgba(247,251,255,0.9);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04)),
            rgba(6,16,29,0.54);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 22px 62px rgba(0,0,0,0.26),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          animation: pb-float 5.8s ease-in-out infinite;
        }

        .pb-value-floating strong {
          display: block;
          font-size: 13px;
          letter-spacing: -0.035em;
        }

        .pb-value-floating span {
          display: block;
          margin-top: 5px;
          color: var(--pb-faint);
          font-size: 10px;
          font-weight: 850;
        }

        .pb-value-floating-one {
          left: 40px;
          bottom: 100px;
        }

        .pb-value-floating-two {
          right: 38px;
          top: 88px;
          animation-delay: -2s;
        }

        .pb-value-floating-three {
          right: 48px;
          bottom: 74px;
          animation-delay: -3.8s;
        }

        .pb-value-copy {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          padding: 14px;
        }

        .pb-value-copy h2 {
          max-width: 700px;
          margin: 11px 0 0;
          font-size: clamp(40px, 5.4vw, 72px);
          line-height: 0.93;
          letter-spacing: -0.075em;
        }

        .pb-value-copy > p {
          max-width: 650px;
          margin: 16px 0 0;
          color: rgba(247,251,255,0.64);
          font-size: 15px;
          line-height: 1.66;
        }

        .pb-value-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
        }

        .pb-value-metric {
          min-height: 104px;
          padding: 14px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 84% 0%, rgba(255,216,61,0.12), transparent 8rem),
            rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 18px 58px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .pb-value-metric strong {
          display: block;
          font-size: 22px;
          letter-spacing: -0.055em;
        }

        .pb-value-metric span {
          display: block;
          margin-top: 7px;
          color: var(--pb-faint);
          font-size: 10.5px;
          font-weight: 850;
          line-height: 1.35;
        }

        .pb-value-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .pb-value-card {
          position: relative;
          overflow: hidden;
          min-height: 236px;
          padding: 16px;
          border-radius: 25px;
          background:
            radial-gradient(circle at 84% 0%, rgba(34,197,94,0.12), transparent 8rem),
            rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.082);
          box-shadow:
            0 18px 58px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .pb-value-card-bad {
          background:
            radial-gradient(circle at 84% 0%, rgba(239,68,68,0.11), transparent 8rem),
            rgba(255,255,255,0.052);
        }

        .pb-value-card::before {
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          top: 0;
          height: 2px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.9), transparent);
          box-shadow: 0 0 24px rgba(34,197,94,0.16);
        }

        .pb-value-card-bad::before {
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.85), transparent);
          box-shadow: 0 0 24px rgba(239,68,68,0.14);
        }

        .pb-value-card h3 {
          margin: 0;
          font-size: 21px;
          line-height: 1.04;
          letter-spacing: -0.05em;
        }

        .pb-value-card p {
          margin: 10px 0 0;
          color: rgba(247,251,255,0.6);
          font-size: 13px;
          line-height: 1.55;
        }

        .pb-value-tags,
        .pb-fit-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }

        .pb-value-tags span,
        .pb-fit-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          color: rgba(247,251,255,0.72);
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.075);
          font-size: 10px;
          font-weight: 900;
        }

        .pb-fit-box {
          margin-top: 18px;
          padding: 18px;
          border-radius: 26px;
          background:
            radial-gradient(circle at 90% 0%, rgba(103,232,249,0.12), transparent 9rem),
            rgba(6,16,29,0.42);
          border: 1px solid rgba(255,255,255,0.078);
        }

        .pb-fit-box strong {
          display: block;
          font-size: 21px;
          letter-spacing: -0.05em;
        }

        .pb-fit-box p {
          margin: 8px 0 0;
          color: rgba(247,251,255,0.58);
          font-size: 13px;
          line-height: 1.5;
        }


        .pb-final-section {
          position: relative;
          z-index: 2;
          padding: 0 0 72px;
        }

        .pb-final-wrap {
          position: relative;
          overflow: hidden;
          padding: clamp(26px, 5vw, 52px);
          border-radius: 46px;
          background:
            radial-gradient(circle at 12% 0%, rgba(103,232,249,0.18), transparent 24rem),
            radial-gradient(circle at 92% 95%, rgba(255,216,61,0.13), transparent 24rem),
            linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.035));
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 40px 128px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .pb-final-wrap::before {
          content: "";
          position: absolute;
          inset: -38%;
          background:
            conic-gradient(
              from 25deg,
              transparent,
              rgba(103,232,249,0.12),
              transparent,
              rgba(255,216,61,0.09),
              transparent
            );
          animation: pb-slow-spin 50s linear infinite;
          pointer-events: none;
        }

        .pb-final-wrap::after {
          content: "";
          position: absolute;
          top: -35%;
          bottom: -35%;
          left: 0;
          z-index: 2;
          width: 34%;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.16), rgba(103,232,249,0.18), transparent);
          transform: translateX(-150%) skewX(-17deg);
          animation: pb-flow-scan 8.2s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .pb-final-wrap > * {
          position: relative;
          z-index: 3;
        }

        .pb-final-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 38px;
          padding: 0 13px;
          border-radius: 999px;
          color: rgba(247,251,255,0.86);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.11);
          font-size: 11px;
          font-weight: 1000;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .pb-final-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 18px rgba(34,197,94,0.7);
        }

        .pb-final-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.76fr) minmax(360px, 0.42fr);
          gap: 28px;
          align-items: end;
          margin-top: 18px;
        }

        .pb-final-copy h2 {
          max-width: 850px;
          margin: 0;
          font-size: clamp(44px, 6.5vw, 88px);
          line-height: 0.89;
          letter-spacing: -0.085em;
        }

        .pb-final-copy p {
          max-width: 760px;
          margin: 20px 0 0;
          color: rgba(247,251,255,0.66);
          font-size: 17px;
          line-height: 1.65;
        }

        .pb-final-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .pb-final-side {
          display: grid;
          gap: 12px;
        }

        .pb-final-mini {
          min-height: 102px;
          padding: 16px;
          border-radius: 24px;
          background:
            radial-gradient(circle at 86% 0%, rgba(103,232,249,0.13), transparent 8rem),
            rgba(6,16,29,0.42);
          border: 1px solid rgba(255,255,255,0.085);
          box-shadow:
            0 20px 62px rgba(0,0,0,0.17),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .pb-final-mini strong {
          display: block;
          font-size: 17px;
          letter-spacing: -0.045em;
        }

        .pb-final-mini span {
          display: block;
          margin-top: 7px;
          color: rgba(247,251,255,0.56);
          font-size: 12px;
          line-height: 1.4;
          font-weight: 850;
        }

        .pb-final-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 34px;
          padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.09);
        }

        .pb-final-foot strong {
          display: block;
          font-size: 14px;
        }

        .pb-final-foot span {
          display: block;
          margin-top: 5px;
          color: rgba(247,251,255,0.5);
          font-size: 11px;
          font-weight: 850;
        }

        .pb-final-foot a {
          color: rgba(247,251,255,0.74);
          text-decoration: none;
          font-size: 12px;
          font-weight: 950;
        }

        .pb-final-foot a:hover {
          color: #fff;
        }

        @keyframes pb-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pb-slow-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pb-shine {
          0% { transform: translateX(-145%) skewX(-18deg); opacity: 0; }
          16% { opacity: 0.82; }
          52% { opacity: 0.24; }
          100% { transform: translateX(145%) skewX(-18deg); opacity: 0; }
        }

        @keyframes pb-cta-glow {
          0%, 100% {
            box-shadow:
              0 26px 78px rgba(103, 232, 249, 0.22),
              0 0 0 0 rgba(103, 232, 249, 0);
          }
          50% {
            box-shadow:
              0 34px 96px rgba(103, 232, 249, 0.32),
              0 0 0 9px rgba(103, 232, 249, 0.07);
          }
        }

        @media (max-width: 1080px) {
          .pb-hero,
          .pb-foundation-card {
            grid-template-columns: 1fr;
          }

          .pb-stage {
            min-height: 610px;
          }

          .pb-section-head,
          .pb-module-grid {
            grid-template-columns: 1fr;
          }

          .pb-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pb-included-summary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pb-workflow-panel {
            grid-template-columns: 1fr;
          }

          .pb-screen-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pb-premium-wrap {
            grid-template-columns: 1fr;
          }

          .pb-ops-wrap {
            grid-template-columns: 1fr;
          }

          .pb-architecture-wrap {
            grid-template-columns: 1fr;
          }

          .pb-value-wrap {
            grid-template-columns: 1fr;
          }

          .pb-final-grid {
            grid-template-columns: 1fr;
          }

          .pb-value-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pb-state-machine {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 720px) {
          .pb-shell {
            width: min(100% - 24px, 620px);
          }

          .pb-nav {
            min-height: 86px;
          }

          .pb-logo {
            width: 74px;
            height: 74px;
            flex-basis: 74px;
          }

          .pb-brand span {
            display: none;
          }

          .pb-nav-links a:not(.pb-nav-cta):not(.pb-nav-home) {
            display: none;
          }

          .pb-nav-links {
            gap: 8px;
          }

          .pb-nav-home,
          .pb-nav-cta {
            min-height: 42px;
            padding: 0 12px;
            font-size: 12px !important;
          }

          .pb-hero {
            padding: 22px 0 60px;
          }

          .pb-hero h1 {
            font-size: clamp(46px, 13.5vw, 68px);
          }

          .pb-copy {
            font-size: 15.5px;
          }

          .pb-actions {
            display: grid;
          }

          .pb-stat-grid {
            grid-template-columns: 1fr;
          }

          .pb-stage {
            min-height: 620px;
            padding: 16px;
            border-radius: 32px;
          }

          .pb-main-phone {
            width: 260px;
          }

          .pb-mini-stack {
            right: 12px;
            bottom: 18px;
            width: min(222px, calc(100% - 26px));
          }

          .pb-floating-note {
            left: 12px;
            bottom: 216px;
          }

          .pb-foundation {
            padding-bottom: 60px;
          }

          .pb-foundation-card {
            padding: 14px;
            border-radius: 32px;
          }

          .pb-foundation-copy h2,
          .pb-section-head h2 {
            font-size: clamp(38px, 11vw, 56px);
          }

          .pb-modules {
            padding-bottom: 60px;
          }

          .pb-module-card {
            min-height: 590px;
            padding: 18px;
            border-radius: 30px;
          }

          .pb-module-card h3 {
            font-size: 30px;
          }

          .pb-module-visual {
            min-height: 330px;
          }

          .pb-backend-node {
            left: 50%;
            top: 50%;
            right: auto;
            bottom: auto;
            transform: translate(-50%, -50%);
            will-change: transform;
          }

          .pb-node-one { animation: pb-backend-orbit-1 20s linear infinite; }
          .pb-node-two { animation: pb-backend-orbit-2 26s linear infinite; }
          .pb-node-three { animation: pb-backend-orbit-3 30s linear infinite reverse; }
          .pb-node-four { animation: pb-backend-orbit-4 22s linear infinite; }
          .pb-node-five { animation: pb-backend-orbit-5 28s linear infinite reverse; }
          .pb-node-six { animation: pb-backend-orbit-6 24s linear infinite; }

          .pb-included {
            padding-bottom: 62px;
          }

          .pb-included-wrap {
            padding: 16px;
            border-radius: 32px;
          }

          .pb-feature-grid,
          .pb-included-summary {
            grid-template-columns: 1fr;
          }

          .pb-feature-card {
            min-height: 250px;
            border-radius: 26px;
          }

          .pb-workflow {
            padding-bottom: 64px;
          }

          .pb-workflow-panel {
            padding: 16px;
            border-radius: 32px;
          }

          .pb-flow-card {
            grid-template-columns: 1fr;
            min-height: auto;
            border-radius: 24px;
          }

          .pb-state-map {
            min-height: 330px;
          }

          .pb-state-chip {
            left: 50%;
            top: 50%;
            right: auto;
            bottom: auto;
            transform: translate(-50%, -50%);
            will-change: transform;
          }

          .pb-state-chip-one { animation: pb-state-orbit-1 21s linear infinite; }
          .pb-state-chip-two { animation: pb-state-orbit-2 27s linear infinite; }
          .pb-state-chip-three { animation: pb-state-orbit-3 31s linear infinite reverse; }
          .pb-state-chip-four { animation: pb-state-orbit-4 23s linear infinite; }
          .pb-state-chip-five { animation: pb-state-orbit-5 29s linear infinite reverse; }
          .pb-state-chip-six { animation: pb-state-orbit-6 25s linear infinite; }

          .pb-screens-section {
            padding-bottom: 64px;
          }

          .pb-screens-wrap {
            padding: 16px;
            border-radius: 32px;
          }

          .pb-screen-grid {
            grid-template-columns: 1fr;
          }

          .pb-screen-card {
            min-height: auto;
            border-radius: 28px;
          }

          .pb-screen-mock-area {
            min-height: 340px;
          }

          .pb-premium-section {
            padding-bottom: 66px;
          }

          .pb-premium-wrap {
            padding: 16px;
            border-radius: 32px;
          }

          .pb-premium-copy {
            padding: 4px;
          }

          .pb-premium-copy h2 {
            font-size: clamp(38px, 11vw, 56px);
          }

          .pb-premium-metrics {
            grid-template-columns: 1fr;
          }

          .pb-premium-step {
            grid-template-columns: 42px 1fr;
          }

          .pb-premium-step-label {
            grid-column: 2;
            width: fit-content;
          }

          .pb-premium-visual {
            min-height: 660px;
            border-radius: 30px;
          }

          .pb-premium-core,
          .pb-premium-ring {
            top: 38%;
          }

          .pb-premium-node {
            left: 50%;
            top: 38%;
            right: auto;
            bottom: auto;
            width: 140px;
            transform: translate(-50%, -50%);
            will-change: transform;
          }

          .pb-premium-node-one { animation: pb-premium-orbit-1 22s linear infinite; }
          .pb-premium-node-two { animation: pb-premium-orbit-2 28s linear infinite; }
          .pb-premium-node-three { animation: pb-premium-orbit-3 28s linear infinite reverse; }
          .pb-premium-node-four { animation: pb-premium-orbit-4 24s linear infinite; }

          .pb-premium-phone {
            width: min(280px, calc(100% - 24px));
          }

          .pb-ops-section {
            padding-bottom: 66px;
          }

          .pb-ops-wrap {
            padding: 16px;
            border-radius: 32px;
          }

          .pb-ops-copy {
            padding: 4px;
          }

          .pb-ops-copy h2 {
            font-size: clamp(38px, 11vw, 56px);
          }

          .pb-ops-control-grid {
            grid-template-columns: 1fr;
          }

          .pb-ops-visual {
            min-height: 640px;
            border-radius: 30px;
          }

          .pb-ops-dashboard {
            width: min(400px, calc(100% - 28px));
          }

          .pb-ops-kpi-row {
            grid-template-columns: 1fr;
          }

          .pb-ops-kpi-row div {
            min-height: 74px;
          }

          .pb-ops-float {
            width: 150px;
          }

          .pb-ops-float-one {
            left: 12px;
            top: 38px;
          }

          .pb-ops-float-two {
            right: 12px;
            top: 50px;
          }

          .pb-ops-float-three {
            right: 12px;
            bottom: 34px;
          }

          .pb-architecture-section {
            padding-bottom: 66px;
          }

          .pb-architecture-wrap {
            padding: 16px;
            border-radius: 32px;
          }

          .pb-architecture-copy {
            padding: 4px;
          }

          .pb-architecture-copy h2 {
            font-size: clamp(38px, 11vw, 56px);
          }

          .pb-architecture-layer-grid,
          .pb-data-table-grid {
            grid-template-columns: 1fr;
          }

          .pb-architecture-layer {
            min-height: auto;
          }

          .pb-architecture-visual {
            min-height: 740px;
            border-radius: 30px;
          }

          .pb-architecture-core,
          .pb-architecture-ring {
            top: 34%;
          }

          .pb-architecture-node {
            left: 50%;
            top: 34%;
            right: auto;
            bottom: auto;
            width: 132px;
            transform: translate(-50%, -50%);
            will-change: transform;
          }

          .pb-arch-node-one { animation: pb-architecture-orbit-1 21s linear infinite; }
          .pb-arch-node-two { animation: pb-architecture-orbit-2 27s linear infinite; }
          .pb-arch-node-three { animation: pb-architecture-orbit-3 31s linear infinite reverse; }
          .pb-arch-node-four { animation: pb-architecture-orbit-4 23s linear infinite; }
          .pb-arch-node-five { animation: pb-architecture-orbit-5 29s linear infinite reverse; }
          .pb-arch-node-six { animation: pb-architecture-orbit-6 25s linear infinite; }

          .pb-architecture-panel {
            width: min(430px, calc(100% - 24px));
            bottom: 18px;
          }

          .pb-value-section {
            padding-bottom: 66px;
          }

          .pb-value-wrap {
            padding: 16px;
            border-radius: 32px;
          }

          .pb-value-copy {
            padding: 4px;
          }

          .pb-value-copy h2 {
            font-size: clamp(38px, 11vw, 56px);
          }

          .pb-value-visual {
            min-height: 690px;
            border-radius: 30px;
          }

          .pb-value-before,
          .pb-value-after {
            width: min(250px, calc(100% - 36px));
          }

          .pb-value-before {
            left: 18px;
            top: 48px;
          }

          .pb-value-after {
            right: 18px;
            top: 270px;
          }

          .pb-value-arrow {
            top: 45%;
            width: 62px;
            height: 62px;
          }

          .pb-value-floating {
            width: 150px;
          }

          .pb-value-floating-one {
            left: 14px;
            bottom: 46px;
          }

          .pb-value-floating-two {
            right: 14px;
            top: 170px;
          }

          .pb-value-floating-three {
            right: 14px;
            bottom: 30px;
          }

          .pb-value-metrics,
          .pb-value-grid {
            grid-template-columns: 1fr;
          }

          .pb-final-section {
            padding-bottom: 42px;
          }

          .pb-final-wrap {
            border-radius: 32px;
          }

          .pb-final-copy h2 {
            font-size: clamp(42px, 12vw, 64px);
          }

          .pb-final-copy p {
            font-size: 15px;
          }

          .pb-final-actions {
            display: grid;
          }

          .pb-final-foot {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pb-nav-cta::before,
          .pb-button-primary,
          .pb-button-primary::after,
          .pb-stage::before,
          .pb-floating-note,
          .pb-module-visual::after,
          .pb-module-float,
          .pb-included-wrap::before,
          .pb-feature-card::after,
          .pb-workflow-panel::before,
          .pb-screens-wrap::before,
          .pb-premium-wrap::before,
          .pb-ops-wrap::before,
          .pb-architecture-wrap::before,
          .pb-value-wrap::before,
          .pb-final-wrap::before,
          .pb-final-wrap::after,
          .pb-value-visual::before,
          .pb-value-visual::after,
          .pb-value-arrow::after,
          .pb-value-floating,
          .pb-architecture-visual::before,
          .pb-architecture-visual::after,
          .pb-arch-node-one,
          .pb-arch-node-two,
          .pb-arch-node-three,
          .pb-arch-node-four,
          .pb-arch-node-five,
          .pb-arch-node-six,
          .pb-ops-visual::before,
          .pb-ops-visual::after,
          .pb-ops-float,
          .pb-premium-visual::after,
          .pb-premium-node-one,
          .pb-premium-node-two,
          .pb-premium-node-three,
          .pb-premium-node-four,
          .pb-screen-card::after,
          .pb-screen-mock-area::before,
          .pb-flow-card::after,
          .pb-flow-number::after,
          .pb-state-chip-one,
          .pb-state-chip-two,
          .pb-state-chip-three,
          .pb-state-chip-four,
          .pb-state-chip-five,
          .pb-state-chip-six,
          .pb-node-one,
          .pb-node-two,
          .pb-node-three,
          .pb-node-four,
          .pb-node-five,
          .pb-node-six {
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

<div className="pb-grid" aria-hidden="true" />

      <div className="pb-shell">
        <nav className="pb-nav" aria-label="PartBid case study navigation">
          <a className="pb-brand" href="/dariktech" aria-label="Back to Darik Technologies homepage">
            <span className="pb-logo" aria-hidden="true">
              <img src="/dariktech/logo.png?v=dt-logo-v2" alt="" />
            </span>
            <span>
              <strong>Darik Technologies</strong>
              <span>PartBid case study</span>
            </span>
          </a>

          <div className="pb-nav-links">
            <a className="pb-nav-home" href="/dariktech">← Back to homepage</a>
            <a href="/dariktech#work">Work</a>
            <a href="#foundation">System</a>
            <a href="#modules">Modules</a>
            <a href="#included">Included</a>
            <a href="#workflow">Workflow</a>
            <a href="#screens">Screens</a>
            <a href="#premium">Premium</a>
            <a href="#ops">Ops</a>
            <a href="#architecture">Architecture</a>
            <a href="#value">Value</a>
            <a href="#quote">Build yours</a>
            <a className="pb-nav-cta" href={quoteHref}>Free quote</a>
          </div>
        </nav>

        <section className="pb-hero">
          <div>
            <h1>
              PartBid turns auto parts hunting into a <span className="pb-gradient">controlled quote system.</span>
            </h1>

            <p className="pb-copy">
              Buyers post one structured request. Suppliers respond with real offers, actual part photos, delivery terms, and chat only when the buyer wants to continue.
            </p>

            <div className="pb-actions">
              <a className="pb-button pb-button-primary" href={quoteHref}>
                Start your free quote today
              </a>
              <a className="pb-button pb-button-secondary" href="#foundation">
                See the system foundation
              </a>
            </div>

            <div className="pb-stat-grid" aria-label="PartBid platform highlights">
              {heroStats.map((item) => (
                <div className="pb-stat" key={item.value}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pb-stage" aria-hidden="true">
            <div className="pb-main-phone">
              <div className="pb-phone-status">
                <span>PartBid</span>
                <span>9:41</span>
              </div>

              <div className="pb-phone-top">
                <h3>Request a Part</h3>
                <span className="pb-language">عربي</span>
              </div>

              <div className="pb-form-stack">
                <div className="pb-field">
                  <span>Vehicle</span>
                  <strong>Hyundai Tucson · 2018</strong>
                </div>
                <div className="pb-field">
                  <span>Part Needed</span>
                  <strong>Front bumper</strong>
                </div>
                <div className="pb-field">
                  <span>Preference</span>
                  <strong>Original OEM · Used ok</strong>
                </div>
              </div>

              <div className="pb-photo-row">
                <span />
                <span />
                <span />
              </div>

              <div className="pb-submit">Request Quotes</div>
            </div>

            <div className="pb-mini-stack">
              <div className="pb-mini-panel">
                <small>Supplier quote</small>
                <strong>120 · Delivery today</strong>
                <i>Actual photo attached</i>
              </div>
              <div className="pb-mini-panel">
                <small>Garage chat</small>
                <strong>Buyer starts negotiation</strong>
                <i>Safety flow active</i>
              </div>
            </div>

            <div className="pb-floating-note">
              <strong>Live logic</strong>
              <span>Requests, quotes, messages, and profiles stay connected.</span>
            </div>
          </div>
        </section>
      </div>

      <section className="pb-shell pb-foundation" id="foundation">
        <div className="pb-foundation-card">
          <div className="pb-foundation-copy">
            <span className="pb-eyebrow">System foundation</span>
            <h2>The case study now has the right opening.</h2>
            <p>
              This page starts with the core PartBid story, then breaks the product into the same kind of real modules a client would expect: buyer flow, supplier flow, quote/chat flow, and backend control.
            </p>
          </div>

          <div className="pb-system-list" aria-label="PartBid system foundation">
            {systemCards.map((item) => (
              <div className="pb-system-item" key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-shell pb-modules" id="modules">
        <div className="pb-section-head">
          <div>
            <span className="pb-eyebrow">Task 2 · product modules</span>
            <h2>PartBid is four connected products, not one basic app screen.</h2>
          </div>
          <p>
            This section shows the real product thinking: buyers create demand, suppliers respond with offers, chat stays controlled, and the backend keeps every state synchronized.
          </p>
        </div>

        <div className="pb-module-grid">
          {moduleCards.map((module) => (
            <article className="pb-module-card" key={module.title}>
              <span className="pb-eyebrow">{module.eyebrow}</span>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
              <div className="pb-module-points">
                {module.points.map((point) => (
                  <span key={point}>{point}</span>
                ))}
              </div>
              <ModuleVisual visual={module.visual} />
            </article>
          ))}
        </div>
      </section>

      <section className="pb-shell pb-included" id="included">
        <div className="pb-included-wrap">
          <div className="pb-section-head">
            <div>
              <span className="pb-eyebrow">Task 3 · what is included</span>
              <h2>The real value is everything around the screens.</h2>
            </div>
            <p>
              This section shows the features that make PartBid feel like a real business platform: trust, moderation, uploads, payment controls, push setup, presence, and bilingual copy.
            </p>
          </div>

          <div className="pb-included-summary" aria-label="PartBid included system summary">
            <div className="pb-included-mini">
              <strong>Trust</strong>
              <span>Verification, reports, and safer buyer/supplier behavior.</span>
            </div>
            <div className="pb-included-mini">
              <strong>Media</strong>
              <span>Photos are part of requests, quotes, chat, payments, and registrations.</span>
            </div>
            <div className="pb-included-mini">
              <strong>Access</strong>
              <span>Premium supplier unlocks and payment request review are built in.</span>
            </div>
            <div className="pb-included-mini">
              <strong>Live app</strong>
              <span>Push tokens, device IDs, presence, and realtime updates support production use.</span>
            </div>
          </div>

          <div className="pb-feature-grid">
            {includedFeatures.map((feature) => (
              <article className={`pb-feature-card pb-feature-${feature.accent}`} key={feature.title}>
                <div className="pb-feature-number">{feature.number}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <div className="pb-feature-tags">
                  {feature.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-shell pb-workflow" id="workflow">
        <div className="pb-section-head">
          <div>
            <span className="pb-eyebrow">Task 4 · workflow logic</span>
            <h2>The app is built around states, not random screens.</h2>
          </div>
          <p>
            PartBid has a clear lifecycle: buyer request, supplier review, quote, buyer decision, chat, and closed-loop states. That is what makes it feel like a real marketplace instead of a simple form.
          </p>
        </div>

        <div className="pb-workflow-panel">
          <div className="pb-flow-list">
            {workflowSteps.map((item) => (
              <article className="pb-flow-card" key={item.step}>
                <div className="pb-flow-number">{item.step}</div>
                <div className="pb-flow-copy">
                  <small>{item.status}</small>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="pb-flow-pills">
                    {item.pills.map((pill) => (
                      <span key={pill}>{pill}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="pb-state-machine" aria-label="PartBid workflow state machine">
            <h3>Request state machine</h3>
            <p>
              Statuses keep the app organized, decide what each role can see, and stop old requests or quotes from staying in the wrong tab.
            </p>

            <div className="pb-state-map" aria-hidden="true">
              <div className="pb-state-core">
                <div>
                  <strong>PartBid</strong>
                  <span>request lifecycle</span>
                </div>
              </div>
              <div className="pb-state-ring pb-state-ring-one" />
              <div className="pb-state-ring pb-state-ring-two" />
              {workflowStates.map((state, index) => (
                <div className={`pb-state-chip pb-state-chip-${["one", "two", "three", "four", "five", "six"][index]}`} key={state}>
                  {state}
                </div>
              ))}
            </div>

            <div className="pb-status-legend">
              <div className="pb-status-row">
                <strong>Open → Quoted</strong>
                <span>supplier action</span>
              </div>
              <div className="pb-status-row">
                <strong>Quoted → Accepted</strong>
                <span>buyer decision</span>
              </div>
              <div className="pb-status-row">
                <strong>Open → Withdrawn</strong>
                <span>buyer cleanup</span>
              </div>
              <div className="pb-status-row">
                <strong>Quoted → Closed</strong>
                <span>tab cleanup</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-shell pb-screens-section" id="screens">
        <div className="pb-screens-wrap">
          <div className="pb-section-head">
            <div>
              <span className="pb-eyebrow">Task 5 · screen previews</span>
              <h2>Now the case study shows what the app actually feels like.</h2>
            </div>
            <p>
              These previews are not random decoration. They explain the real screens from the PartBid product: request creation, supplier request detail, quote comparison, and buyer-controlled chat.
            </p>
          </div>

          <div className="pb-screen-grid">
            {screenPreviews.map((screen) => (
              <article className="pb-screen-card" key={screen.title}>
                <div className="pb-screen-mock-area">
                  <ScreenPreviewMockup visual={screen.visual} />
                </div>
                <span className="pb-eyebrow">{screen.eyebrow}</span>
                <h3>{screen.title}</h3>
                <p>{screen.text}</p>
                <div className="pb-screen-highlights">
                  {screen.highlights.map((highlight) => (
                    <span key={highlight}>{highlight}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-shell pb-premium-section" id="premium">
        <div className="pb-premium-wrap">
          <div className="pb-premium-copy">
            <span className="pb-eyebrow">Task 6 · premium supplier engine</span>
            <h2>PartBid has a built-in path to make money.</h2>
            <p>
              The supplier side is not just a free quote form. It has a premium access model where supplier visibility, buyer names, clear photos, and quote actions can be controlled through plan payment and approval.
            </p>

            <div className="pb-premium-metrics" aria-label="Premium supplier metrics">
              {premiumMetrics.map((metric) => (
                <div className="pb-premium-metric" key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="pb-premium-steps">
              {premiumSteps.map((step) => (
                <article className="pb-premium-step" key={step.number}>
                  <div className="pb-premium-step-number">{step.number}</div>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                  <span className="pb-premium-step-label">{step.label}</span>
                </article>
              ))}
            </div>
          </div>

          <PremiumEngineVisual />
        </div>
      </section>

      <section className="pb-shell pb-ops-section" id="ops">
        <div className="pb-ops-wrap">
          <OpsControlVisual />

          <div className="pb-ops-copy">
            <span className="pb-eyebrow">Task 7 · operations control layer</span>
            <h2>The backend has admin control points, not just user screens.</h2>
            <p>
              PartBid needs operational controls behind the app: premium payment review, business verification review, moderation, push diagnostics, device context, and user presence. This is the layer that makes the product manageable after launch.
            </p>

            <div className="pb-ops-control-grid">
              {opsControls.map((control) => (
                <article className="pb-ops-control-card" key={control.title}>
                  <h3>{control.title}</h3>
                  <p>{control.text}</p>
                  <div className="pb-ops-tags">
                    {control.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-shell pb-architecture-section" id="architecture">
        <div className="pb-architecture-wrap">
          <div className="pb-architecture-copy">
            <span className="pb-eyebrow">Task 8 · technical architecture</span>
            <h2>The page now shows how the app is actually built.</h2>
            <p>
              This section explains the system behind PartBid: the mobile app, Supabase tables, storage, realtime updates, push notifications, device IDs, and the request-to-quote data flow.
            </p>

            <div className="pb-architecture-layer-grid">
              {architectureLayers.map((layer) => (
                <article className="pb-architecture-layer" key={layer.title}>
                  <h3>{layer.title}</h3>
                  <p>{layer.text}</p>
                  <div className="pb-architecture-tags">
                    {layer.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="pb-data-table-grid" aria-label="PartBid backend table examples">
              {dataTables.map((table) => (
                <div className="pb-data-table-chip" key={table.name}>
                  <strong>{table.name}</strong>
                  <span>{table.label}</span>
                </div>
              ))}
            </div>
          </div>

          <ArchitectureVisual />
        </div>
      </section>

      <section className="pb-shell pb-value-section" id="value">
        <div className="pb-value-wrap">
          <ValueVisual />

          <div className="pb-value-copy">
            <span className="pb-eyebrow">Task 9 · business value</span>
            <h2>This section explains why PartBid is worth building.</h2>
            <p>
              A client should instantly understand the business problem: part hunting is slow, scattered, and hard to compare. PartBid turns that messy process into organized demand, supplier competition, and a monetizable platform.
            </p>

            <div className="pb-value-metrics" aria-label="PartBid business value metrics">
              {businessMetrics.map((metric) => (
                <div className="pb-value-metric" key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="pb-value-grid">
              {valuePoints.map((point) => (
                <article className={`pb-value-card ${point.tone === "bad" ? "pb-value-card-bad" : ""}`} key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                  <div className="pb-value-tags">
                    {point.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="pb-fit-box">
              <strong>This idea can be reused beyond auto parts.</strong>
              <p>
                The same request-and-quote engine can power other supplier marketplaces, B2B sourcing tools, internal procurement systems, and service quote platforms.
              </p>
              <div className="pb-fit-tags">
                {clientFit.map((fit) => (
                  <span key={fit}>{fit}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-shell pb-final-section" id="quote">
        <div className="pb-final-wrap">
          <span className="pb-final-kicker">Task 11 · final conversion section</span>

          <div className="pb-final-grid">
            <div className="pb-final-copy">
              <h2>Build a quote platform, marketplace, or admin system like this.</h2>
              <p>
                PartBid is the example. The same structure can be used for any business where customers request something, suppliers respond, admins control quality, and the platform needs a real backend.
              </p>

              <div className="pb-final-actions">
                <a className="pb-button pb-button-primary" href={quoteHref}>
                  Get a free quote
                </a>
                <a className="pb-button pb-button-secondary" href="/dariktech">
                  Back to homepage
                </a>
              </div>
            </div>

            <div className="pb-final-side">
              {finalProof.map((item) => (
                <div className="pb-final-mini" key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pb-final-foot">
            <div>
              <strong>Darik Technologies</strong>
              <span>Mobile apps · web apps · admin dashboards · marketplaces · backend systems</span>
            </div>
            <a href="/dariktech">← Back to Darik Technologies homepage</a>
          </div>
        </div>
      </section>
    
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