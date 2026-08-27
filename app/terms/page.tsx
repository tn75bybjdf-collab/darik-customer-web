/* DARIK_PLATFORM_INTERMEDIARY_TERMS_333 */
/* DARIK_PLATFORM_INTERMEDIARY_TERMS_BILINGUAL_333 */

import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Darik Terms of Use | Platform & Marketplace Terms",
  description:
    "Terms governing GetDarik.com, Darik storefronts, customers, retailers, orders, delivery, platform services, and marketplace transactions.",
};

type TermsSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  note?: string;
};

const englishSections: readonly TermsSection[] = [
  {
    id: "agreement",
    title: "1. Agreement to these Terms",
    paragraphs: [
      "These Terms of Use (the “Terms”) form a binding agreement between you and Darik Technologies, the operator of GetDarik.com and the Darik platform (“Darik,” “we,” “us,” or “our”). They govern access to and use of GetDarik.com, Darik retailer storefronts, the Darik Retailer App, retailer dashboards, customer ordering tools, product-discovery tools, support services, and other Darik technology or services that reference these Terms (collectively, the “Platform”).",
      "By accessing the Platform, creating an account, publishing a storefront or product, submitting or accepting an order, purchasing a Darik platform service, clicking an acceptance control, or otherwise using the Platform, you agree to these Terms and any policies expressly incorporated by reference.",
      "If applicable law gives you rights that cannot lawfully be waived or limited by contract, nothing in these Terms removes those rights. Any provision that conflicts with mandatory law applies only to the maximum extent permitted by that law.",
    ],
  },
  {
    id: "definitions",
    title: "2. Key definitions",
    paragraphs: [
      "For purposes of these Terms, the following definitions help explain the separate roles of Darik, retailers, and customers.",
    ],
    bullets: [
      "“Customer” means a person who browses, searches, contacts, orders from, or purchases from a Retailer through or after using the Platform.",
      "“Retailer” or “Store” means an independent business, merchant, seller, supplier, or authorized business user operating or appearing through a Darik storefront.",
      "“Product” means any physical good, service, offer, listing, catalog item, or other merchandise offered by a Retailer.",
      "“Order” means a customer request or transaction submitted to a Retailer using Platform tools.",
      "“Retail Transaction” means the underlying purchase, sale, fulfillment, delivery, pickup, return, refund, warranty, or other commercial transaction between a Customer and a Retailer.",
      "“Darik Services” means technology and services Darik provides directly, including storefront software, retailer subscriptions, digital tools, AI credits, custom-domain setup, advertising, or other services identified as being sold by Darik.",
      "“Retailer Content” means information, photos, logos, trademarks, descriptions, prices, product data, messages, payment instructions, and other material supplied by or on behalf of a Retailer.",
    ],
  },
  {
    id: "platform-role",
    title: "3. Darik is a technology platform — not the seller",
    paragraphs: [
      "Darik provides technology that helps Customers discover independent Retailers, search products, browse storefronts, transmit Orders, identify delivery availability, and communicate or interact with Retailers. Darik is a marketplace and technology intermediary.",
      "Unless Darik expressly identifies itself in writing as the seller or provider of a specific item or service, Darik does not manufacture, own, purchase, stock, warehouse, possess, inspect, package, label, import, export, distribute, offer for sale, or sell the Products listed by Retailers.",
      "The fact that a Product appears on GetDarik.com, a Darik-branded page, the Darik app, a Darik URL, search results, marketing materials, or a Retailer storefront does not make Darik the seller of that Product.",
    ],
    bullets: [
      "Darik is not the merchant of record for Retailer Products unless a specific checkout expressly states otherwise.",
      "Darik does not take title to Retailer Products merely because an Order is submitted through the Platform.",
      "Darik is not a manufacturer, importer, distributor, wholesaler, reseller, bailee, insurer, guarantor, franchisee, franchisor, employer, or partner of a Retailer solely because the Retailer uses Darik.",
      "Darik is not responsible for a Retailer’s legal status, licenses, taxes, employees, drivers, contractors, inventory, or business operations.",
    ],
    note:
      "CORE TRANSACTION RULE: A Customer purchasing a Retailer Product is purchasing from that Retailer, not from Darik.",
  },
  {
    id: "retail-transaction",
    title: "4. The purchase contract is between Customer and Retailer",
    paragraphs: [
      "A Retail Transaction is solely between the Customer and the applicable Retailer. Darik supplies the technical environment through which the parties may discover each other, exchange information, submit an Order, upload payment proof, coordinate fulfillment, or perform related functions.",
      "An Order submitted through Darik is transmitted to the Retailer. The Retailer remains responsible for accepting, rejecting, confirming, preparing, fulfilling, cancelling, refunding, or otherwise handling that Order subject to applicable law and the Retailer’s lawful policies.",
      "The Retailer is the party responsible for supplying the Product and satisfying seller, supplier, warranty, tax, invoicing, consumer-protection, product-safety, and fulfillment duties that apply to the Retailer.",
    ],
  },
  {
    id: "no-agency",
    title: "5. No agency, partnership, employment, or endorsement",
    paragraphs: [
      "Retailers are independent businesses. Nothing in these Terms creates an agency, partnership, joint venture, employment, fiduciary, franchise, distributorship, or representative relationship between Darik and any Retailer or Customer.",
      "A Retailer has no authority to bind Darik, make promises on Darik’s behalf, incur obligations for Darik, or represent that Darik guarantees the Retailer or its Products.",
      "Darik’s approval, activation, display, ranking, verification step, badge, account status, or decision to allow a Retailer to use the Platform means only that the Retailer has been permitted to access or appear on the Platform. It is not a government approval, product certification, safety certification, authenticity guarantee, credit review, financial guarantee, licensing opinion, or endorsement.",
    ],
  },
  {
    id: "retailer-eligibility",
    title: "6. Retailer authority, licensing, and legal compliance",
    paragraphs: [
      "Each Retailer represents and warrants that it is legally permitted to operate its business, list its Products, enter into Retail Transactions, collect customer payments, issue required invoices or receipts, and perform delivery or pickup services it offers.",
      "Retailers are solely responsible for obtaining and maintaining all registrations, permits, professional approvals, product approvals, tax registrations, customs permissions, health or safety approvals, age-restricted-sales permissions, and other licenses required for their business or Products.",
      "Darik may request documentation, reject activation, limit functionality, remove listings, or suspend a Retailer if Darik reasonably believes additional verification is appropriate, but Darik has no general duty to independently verify every legal requirement applicable to every Retailer.",
    ],
  },
  {
    id: "listings",
    title: "7. Retailer listings, descriptions, prices, and inventory",
    paragraphs: [
      "Retailers are solely responsible for all Retailer Content and for ensuring that listings are current, complete, accurate, lawful, non-misleading, and consistent with the Product actually offered.",
      "Retailers determine their own Product prices, availability, promotions, variants, quantities, conditions, warranties, delivery fees, minimum orders, and other sales terms unless Darik expressly provides a separate Darik-controlled promotion.",
      "Darik may format, resize, translate, categorize, index, cache, or technically process Retailer Content to operate the Platform. Automated formatting does not transfer responsibility for the underlying information to Darik.",
    ],
    bullets: [
      "A Retailer must not publish false prices, fake stock, misleading discounts, fabricated specifications, deceptive photos, undisclosed conditions, or materially incomplete information.",
      "A Retailer must promptly update unavailable, discontinued, recalled, expired, unsafe, or materially changed Products.",
      "Darik does not guarantee that inventory status, pricing, delivery estimates, descriptions, translations, or catalog data supplied by a Retailer are error-free or current.",
    ],
  },
  {
    id: "product-responsibility",
    title: "8. Product quality, safety, legality, authenticity, and recalls",
    paragraphs: [
      "The Retailer is solely responsible for the quality, condition, conformity, fitness, safety, legality, authenticity, origin, labeling, packaging, storage, expiry status, instructions, warnings, and regulatory compliance of its Products.",
      "Darik does not routinely inspect, test, authenticate, certify, or take physical possession of Retailer Products. Customers should evaluate Products and Retailers as appropriate before completing a purchase.",
      "Retailers must immediately remove or disable any Product they know or reasonably should know is defective, unsafe, counterfeit, recalled, expired, unlawfully marketed, improperly labeled, or otherwise unsuitable for lawful sale.",
    ],
    bullets: [
      "Product-defect claims are the responsibility of the Retailer that sold the Product, subject to mandatory law.",
      "Product recalls, safety notices, repair obligations, replacement duties, warranty performance, and other post-sale obligations remain the Retailer’s responsibility.",
      "Darik may remove a listing or Retailer without prior notice when safety, fraud, infringement, regulatory, or consumer-protection concerns arise.",
    ],
  },
  {
    id: "regulated-products",
    title: "9. Regulated, restricted, and age-sensitive Products",
    paragraphs: [
      "Retailers must comply with all laws and Platform rules applicable to regulated, restricted, licensed, age-sensitive, health-related, safety-sensitive, or otherwise controlled Products.",
      "The availability of a listing field or Retailer category on Darik is not a representation that a Product may lawfully be sold, advertised, delivered, imported, or supplied in a particular circumstance.",
      "Retailers are responsible for required age checks, identity checks, professional review, prescriptions or authorizations where legally required, and any restrictions on advertising, distance sales, delivery, or possession.",
    ],
  },
  {
    id: "customers",
    title: "10. Customer responsibilities",
    paragraphs: [
      "Customers must provide accurate contact, location, delivery, and payment-related information when placing an Order and must use the Platform lawfully and in good faith.",
      "Customers are responsible for reviewing the Retailer, Product description, price, delivery terms, warranty information, and other Retailer terms before completing a Retail Transaction.",
      "A Customer may not submit fraudulent Orders, falsified payment proof, abusive chargeback claims, knowingly incorrect delivery information, or use Darik to harass, deceive, impersonate, or harm a Retailer or another person.",
    ],
  },
  {
    id: "orders",
    title: "11. Orders, acceptance, cancellation, and availability",
    paragraphs: [
      "Submitting an Order through Darik does not guarantee acceptance or fulfillment. Products may become unavailable, prices may contain errors, a Retailer may pause orders, or fulfillment may become impossible.",
      "The Retailer is responsible for determining whether it accepts an Order and for communicating or implementing cancellation, substitution, preparation, and fulfillment decisions.",
      "Darik may block, cancel, hold, or flag an Order for security, fraud prevention, technical reliability, legal compliance, abuse prevention, or Platform-integrity reasons. This technical action does not make Darik the seller.",
    ],
  },
  {
    id: "payments",
    title: "12. Customer payments and payment proof",
    paragraphs: [
      "Unless Darik expressly states otherwise for a specific transaction, money paid for a Retailer Product is payment to or for the applicable Retailer and is consideration for the Customer’s purchase from that Retailer — not consideration for a purchase of merchandise from Darik.",
      "Darik may provide technical tools for displaying payment instructions, transmitting CliQ information, uploading payment screenshots or receipts, recording payment status, or allowing a Retailer or administrator to review payment evidence. These functions are communication, workflow, or verification tools and do not by themselves make Darik a bank, money transmitter, escrow provider, payment institution, guarantor, or merchant of record for the Retailer Product.",
      "A payment screenshot, receipt upload, status label, or Platform notification is not a guarantee that funds were validly transferred, finally settled, non-reversible, or received in the correct account. The Retailer is responsible for verifying its own receipt of funds before fulfillment when appropriate.",
    ],
    note:
      "Fees paid directly to Darik for Darik subscriptions, AI credits, advertising, custom-domain setup, or other Darik Services are separate transactions from a Customer’s purchase of Retailer Products.",
  },
  {
    id: "refunds",
    title: "13. Returns, refunds, exchanges, cancellations, and warranties",
    paragraphs: [
      "The Retailer that sells a Product is responsible for legally required returns, refunds, exchanges, repairs, replacements, warranties, after-sales service, and remedies relating to that Product.",
      "Darik may provide messaging, order-status, complaint, or support tools that help a Customer and Retailer communicate, but Darik’s voluntary assistance does not make Darik responsible for the Retailer’s underlying obligation.",
      "Nothing in these Terms limits a Customer’s mandatory rights under applicable consumer-protection law. Retailers may not use Darik or their own store policies to unlawfully eliminate rights that cannot be waived.",
    ],
  },
  {
    id: "delivery",
    title: "14. Delivery, pickup, drivers, and couriers",
    paragraphs: [
      "Unless a specific Order expressly identifies Darik as the delivery provider under separate terms, delivery or pickup is arranged, performed, or controlled by the Retailer and/or the Retailer’s selected driver, employee, courier, contractor, or logistics provider.",
      "Retailers are responsible for delivery personnel they engage, delivery timing, safe handling, route decisions, vehicle compliance, driver conduct, delivery charges, failed deliveries, proof of delivery, and other fulfillment matters.",
      "Darik may provide technology that calculates zones, displays fees, generates driver PINs, transmits addresses, shows route information, or coordinates delivery workflow. Providing those tools does not create an employment or agency relationship between Darik and a Retailer’s driver or courier.",
    ],
  },
  {
    id: "location",
    title: "15. Maps, location, delivery zones, distance, and estimates",
    paragraphs: [
      "Darik may use device location, customer-selected locations, geocoding, mapping providers, coordinates, retailer-defined delivery zones, radius calculations, and other data to organize stores and estimate delivery availability.",
      "Location, distance, fee, ETA, route, and delivery-eligibility outputs are estimates generated from available information and Retailer settings. They may be affected by inaccurate pins, map errors, road conditions, device settings, retailer configuration, third-party services, or other factors.",
      "A display stating that a Retailer delivers to a location is not a guarantee that a specific Order can or will be delivered. Final fulfillment remains subject to Retailer acceptance, operational conditions, and applicable law.",
    ],
  },
  {
    id: "directory",
    title: "16. Directory, product search, ranking, and discovery",
    paragraphs: [
      "Darik is designed to help Customers discover active Retailers and Products across Jordan. A Retailer may remain visible even when it does not deliver to a Customer’s selected location.",
      "Search and directory ranking may consider relevance, delivery availability, distance, store category, product matches, availability, data quality, Platform integrity, promotions, sponsorship, customer preferences, or other factors Darik may change over time.",
      "Darik does not guarantee any Retailer a particular ranking, traffic level, number of impressions, search placement, customer conversion, revenue, Google indexing, or business result.",
    ],
  },
  {
    id: "retailer-fees",
    title: "17. Retailer subscriptions, activation, and Darik Services",
    paragraphs: [
      "Retailers may purchase subscriptions, catalog capacity, digital credits, advertising, setup services, or other Darik Services directly from Darik. Those fees compensate Darik for technology or services and are legally separate from Retail Transactions between Customers and Retailers.",
      "Plan duration, catalog limits, prices, payment timing, included features, renewal rules, promotional pricing, and other commercial terms are those disclosed by Darik at the time of purchase or activation.",
      "Except where mandatory law or written Darik terms require otherwise, Darik Services do not guarantee sales, revenue, search placement, customer traffic, continuous availability, or any specific commercial outcome.",
      "Darik may change future pricing or plans. Changes ordinarily apply prospectively, including at renewal or a new purchase, unless a different effective date is lawfully disclosed.",
    ],
  },
  {
    id: "domains",
    title: "18. Custom-domain services",
    paragraphs: [
      "Where Darik offers to connect a Retailer’s own domain to a Darik storefront, the custom-domain fee covers only the setup or service expressly described by Darik.",
      "Unless Darik explicitly states otherwise, the Retailer is responsible for owning or lawfully controlling the domain, paying registrar and renewal fees, maintaining accurate registrar information, and complying with the domain registrar’s terms.",
      "Darik does not guarantee third-party registrar, DNS, certificate, browser, internet, or hosting-provider availability. A domain issue does not transfer ownership of the Retailer’s Product transactions to Darik.",
    ],
  },
  {
    id: "ai",
    title: "19. AI tools, image enhancement, and digital credits",
    paragraphs: [
      "Darik may provide optional AI-assisted tools, including product-image enhancement or related features. AI functionality may use third-party AI providers and may require Retailer consent before content is transmitted for processing.",
      "Retailers must not submit personal, confidential, sensitive, unlawful, or third-party-protected material to AI tools unless they have all necessary rights and a lawful basis to do so.",
      "AI output may be inaccurate, incomplete, altered, unexpected, or unsuitable. The Retailer must review every AI-generated or AI-modified output before publishing or relying on it and remains responsible for the final listing.",
      "AI credits or similar digital balances purchased from Darik are Darik Services, not payments for Retailer Products. Credit consumption, expiration, refund eligibility, and availability are governed by the terms shown with that feature and mandatory law.",
    ],
  },
  {
    id: "content",
    title: "20. Retailer Content and license to Darik",
    paragraphs: [
      "Retailers retain ownership of rights they lawfully hold in Retailer Content. By uploading, publishing, transmitting, or providing Retailer Content to Darik, the Retailer grants Darik a worldwide, non-exclusive, royalty-free, sublicensable license to host, store, reproduce, resize, crop, format, adapt, translate, index, cache, transmit, display, distribute, and otherwise use that content as reasonably necessary to operate, secure, market, promote, improve, and provide the Platform and the Retailer’s storefront.",
      "The Retailer represents that it owns or has all permissions necessary for Darik to use Retailer Content in that manner and that the content does not infringe intellectual-property, privacy, publicity, confidentiality, consumer, or other rights.",
      "The license continues for as long as reasonably necessary to operate the service and may continue for backups, cached pages, transaction records, fraud prevention, legal compliance, dispute evidence, and other legitimate retention purposes after content is removed.",
    ],
  },
  {
    id: "ip",
    title: "21. Darik intellectual property and infringement complaints",
    paragraphs: [
      "The Platform, Darik name, logos, software, source code, layouts, designs, databases, workflows, documentation, and other Darik-owned materials are protected by applicable intellectual-property laws and remain the property of Darik or its licensors.",
      "Except for ordinary use of the Platform, users may not copy, reproduce, sell, sublicense, reverse engineer, scrape, extract, circumvent, create derivative services from, or commercially exploit Darik technology without written authorization.",
      "Darik may remove or restrict content when it receives a credible infringement complaint or reasonably believes content violates another party’s intellectual-property rights. Retailers are responsible for disputes arising from their brands, images, descriptions, product names, or other content.",
    ],
  },
  {
    id: "communications",
    title: "22. Communications, customer data, and retailer contact",
    paragraphs: [
      "Darik may enable Customers and Retailers to exchange order details, telephone numbers, addresses, notes, WhatsApp communications, or other information needed for discovery, customer service, payment verification, delivery, or fulfillment.",
      "A Retailer that receives Customer information must use it only for lawful purposes connected to the Retail Transaction or another lawful purpose for which the Customer has been properly informed or has consented where required.",
      "Retailers may not sell Customer information, use it for harassment, disclose it without lawful basis, or retain it longer than legally or operationally necessary. Each Retailer is independently responsible for its handling of personal data it receives.",
    ],
  },
  {
    id: "privacy",
    title: "23. Privacy and personal data",
    paragraphs: [
      "Darik’s collection and processing of personal data is also governed by the Darik Privacy Policy and applicable data-protection law, including Jordan’s Personal Data Protection Law No. 24 of 2023 as amended or replaced.",
      "Users acknowledge that location, account, order, device, storefront, support, security, and related information may be processed where necessary to provide the Platform, prevent fraud, comply with law, fulfill user requests, or pursue other lawful purposes described in the Privacy Policy.",
      "Where the law grants data-subject rights, users may exercise those rights through the channels described in the Privacy Policy or Support page.",
    ],
  },
  {
    id: "third-parties",
    title: "24. Third-party technology and external services",
    paragraphs: [
      "Darik relies on or may integrate third-party infrastructure and services such as cloud hosting, databases, maps, geocoding, messaging, analytics, domain services, app stores, artificial-intelligence providers, payment networks, telecommunications, and other technology providers.",
      "Examples may include services provided by Google, WhatsApp/Meta, Supabase, Vercel, xAI, Apple, domain registrars, or other providers. These providers may have their own terms and privacy practices.",
      "Darik is not responsible for an outage, map error, blocked message, DNS problem, telecommunications failure, third-party account restriction, or other event originating in a third-party system except to the extent liability cannot lawfully be excluded or the event was directly caused by Darik’s own legally actionable conduct.",
    ],
  },
  {
    id: "prohibited-use",
    title: "25. Prohibited conduct",
    paragraphs: [
      "Users may not misuse Darik, interfere with the Platform, or use it in a way that creates legal, safety, fraud, security, reputational, or operational risk.",
    ],
    bullets: [
      "Do not list stolen, counterfeit, infringing, unsafe, recalled, expired, illegal, deceptively described, or unlawfully regulated Products.",
      "Do not falsify payment proof, identity information, ratings, store information, inventory, delivery information, or transaction records.",
      "Do not impersonate another person or business or falsely claim affiliation with Darik.",
      "Do not introduce malware, probe security, bypass access controls, scrape at abusive scale, reverse engineer restricted systems, or interfere with Platform availability.",
      "Do not manipulate rankings, search results, promotions, credits, delivery calculations, account limits, or Platform fees by fraudulent or automated means.",
      "Do not use Customer information for spam, harassment, unrelated marketing, sale, profiling, or disclosure without a lawful basis.",
      "Do not use Darik to facilitate fraud, money laundering, sanctions evasion, unlawful financing, or any activity prohibited by applicable law.",
    ],
  },
  {
    id: "accounts",
    title: "26. Accounts, staff access, and security",
    paragraphs: [
      "Account holders are responsible for safeguarding passwords, PINs, devices, sessions, staff credentials, and other authentication methods.",
      "Retailers are responsible for people they authorize to access their account and for promptly removing access when a staff member is no longer authorized.",
      "Darik may treat actions performed through valid credentials as authorized account activity unless Darik has received sufficient notice of compromise or applicable law requires a different result.",
      "Users must promptly report suspected unauthorized access, credential theft, account takeover, or other security incidents to Darik Support.",
    ],
  },
  {
    id: "monitoring",
    title: "27. Moderation, investigation, and Platform integrity",
    paragraphs: [
      "Darik may, but is not obligated to, review listings, investigate complaints, analyze Platform activity, request documents, preserve evidence, restrict visibility, reject content, pause functionality, or cooperate with competent authorities.",
      "Darik may use automated or manual tools to detect fraud, unsafe products, abuse, duplicate accounts, suspicious payment proof, security threats, or violations of these Terms.",
      "A decision to review one Retailer, Product, or transaction does not create a duty to monitor all Retailers, Products, or transactions.",
    ],
  },
  {
    id: "suspension",
    title: "28. Suspension, removal, and termination",
    paragraphs: [
      "Darik may immediately restrict, hide, suspend, deactivate, or terminate an account, storefront, Product, Order feature, digital service, or other Platform access when Darik reasonably believes action is necessary for security, fraud prevention, user safety, legal compliance, intellectual-property protection, consumer protection, nonpayment of Darik fees, abuse prevention, or enforcement of these Terms.",
      "Where practical and appropriate, Darik may provide notice or an opportunity to correct an issue. Darik may act without advance notice where delay could create legal, financial, safety, fraud, security, or reputational risk.",
      "Termination does not eliminate accrued payment obligations, indemnity obligations, transaction records, legal retention requirements, or provisions that by their nature should survive termination.",
    ],
  },
  {
    id: "availability",
    title: "29. Platform availability, maintenance, and changes",
    paragraphs: [
      "The Platform is provided using evolving technology. Darik may add, remove, redesign, replace, suspend, limit, or discontinue features, interfaces, integrations, APIs, categories, search methods, delivery tools, pricing plans, or other functionality.",
      "Darik aims to provide a reliable service but does not promise uninterrupted, error-free, secure, or permanently available operation. Maintenance, cyber incidents, internet failures, third-party outages, demand spikes, force majeure, software defects, or other events may cause downtime or data delays.",
      "Users are responsible for maintaining reasonable independent business records and should not rely on Darik as their only copy of legally or operationally important information.",
    ],
  },
  {
    id: "warranties",
    title: "30. Disclaimer of warranties",
    paragraphs: [
      "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM AND DARIK SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” DARIK DISCLAIMS IMPLIED WARRANTIES OR CONDITIONS TO THE EXTENT THEY MAY LAWFULLY BE DISCLAIMED.",
      "Darik does not warrant or guarantee any Retailer, Product, transaction, listing, price, inventory level, delivery promise, driver, warranty, product quality, product safety, authenticity, legality, fitness for purpose, merchantability, search result, ranking, translation, map result, AI output, third-party service, or business outcome.",
      "Nothing in this section excludes any warranty or legal responsibility that applicable law expressly prohibits Darik from excluding.",
    ],
  },
  {
    id: "liability",
    title: "31. Limitation of Darik liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, Darik is responsible only for its own legally actionable acts or omissions and is not responsible for acts or omissions of independent Retailers, Customers, drivers, couriers, manufacturers, suppliers, payment networks, telecommunications providers, or other third parties.",
      "To the maximum extent permitted by law, Darik will not be liable for indirect, incidental, special, exemplary, punitive, or consequential loss; lost profits; lost revenue; lost opportunity; loss of goodwill; business interruption; loss of anticipated savings; or loss caused by a Retailer’s Product, non-delivery, delay, defect, refund refusal, warranty issue, misconduct, inaccurate listing, or illegal act.",
      "To the maximum extent permitted by law, Darik’s total aggregate liability to a claimant arising from or relating to the Platform, Darik Services, these Terms, or a Retail Transaction will not exceed the greater of: (a) JOD 100; or (b) the amount of fees the claimant paid directly to Darik for Darik Services during the twelve months immediately preceding the event giving rise to the claim.",
      "For clarity, money a Customer paid to a Retailer for a Retailer Product is not a fee paid to Darik and is not included when calculating Darik’s liability cap.",
      "Nothing in these Terms excludes or limits liability for fraud, willful misconduct, gross negligence where it cannot lawfully be excluded, death or personal injury where exclusion is prohibited, or any other liability that mandatory law does not permit the parties to exclude or limit.",
    ],
  },
  {
    id: "release",
    title: "32. Retailer–Customer disputes and release of Darik",
    paragraphs: [
      "Customers and Retailers are expected to resolve disputes concerning the Retail Transaction directly with each other, including disputes about Product condition, description, price, delivery, damage, missing items, warranty, return, refund, authenticity, quality, or service.",
      "Darik may voluntarily provide support, evidence, communication tools, account actions, or other assistance. Such assistance does not make Darik a party to the Retail Transaction and does not create a duty to mediate, arbitrate, guarantee payment, force a refund, or compensate either party.",
      "To the maximum extent permitted by law, each Customer and Retailer releases Darik from claims, demands, and damages arising solely from the acts, omissions, Products, promises, or Retail Transaction obligations of the other party or another independent third party, except to the extent the claim is based on Darik’s own non-excludable legal responsibility.",
    ],
  },
  {
    id: "indemnity-retailer",
    title: "33. Retailer indemnification of Darik",
    paragraphs: [
      "To the maximum extent permitted by applicable law, each Retailer agrees to defend, indemnify, and hold harmless Darik and its affiliates, owners, directors, officers, employees, contractors, service providers, and agents from and against third-party claims, proceedings, investigations, liabilities, judgments, penalties, fines, losses, damages, costs, and reasonable legal fees arising out of or relating to the Retailer’s business, Products, Retailer Content, personnel, drivers, fulfillment, or breach of these Terms.",
    ],
    bullets: [
      "Product defects, injury, property damage, safety issues, recalls, expiry, contamination, mislabeling, or missing warnings.",
      "Counterfeit, stolen, infringing, unauthorized, illegally imported, or unlawfully sold Products.",
      "False advertising, inaccurate pricing, misleading descriptions, stock errors, undisclosed terms, or unlawful promotions.",
      "Failure to deliver, late delivery, delivery accidents, driver misconduct, loss, theft, damage, wrong items, or failed pickup.",
      "Refunds, returns, warranties, repairs, replacements, invoices, taxes, consumer complaints, or contractual obligations owed by the Retailer.",
      "Violation of licensing, tax, customs, employment, data-protection, intellectual-property, consumer-protection, health, safety, product, advertising, or other applicable law.",
      "Retailer misuse of Customer information or any act or omission of the Retailer’s owners, staff, drivers, couriers, contractors, or agents.",
    ],
    note:
      "This indemnity is intended to allocate Retailer-caused risk to the Retailer and applies only to the extent enforceable under applicable law.",
  },
  {
    id: "indemnity-user",
    title: "34. User indemnification for unlawful misuse",
    paragraphs: [
      "To the maximum extent permitted by applicable law, a user who causes loss to Darik through fraud, intentional misconduct, unlawful use, infringement, falsified payment evidence, security attacks, unauthorized scraping, impersonation, or a material breach of these Terms agrees to indemnify Darik against resulting third-party claims, liabilities, and reasonable enforcement costs to the extent caused by that user.",
    ],
  },
  {
    id: "force-majeure",
    title: "35. Events beyond reasonable control",
    paragraphs: [
      "Darik will not be responsible for delay, interruption, or failure caused by events beyond its reasonable control, including internet or telecommunications failures, utility outages, cyberattacks, natural disasters, severe weather, war, civil disturbance, governmental action, strikes, epidemics, third-party infrastructure failure, domain or DNS failure, payment-network disruption, app-store action, or other force-majeure events, except where applicable law requires otherwise.",
    ],
  },
  {
    id: "electronic",
    title: "36. Electronic communications, records, and notices",
    paragraphs: [
      "Users consent to receive Platform-related communications and notices electronically through the Platform, account interfaces, email, SMS, WhatsApp, push notification, or other contact information supplied to Darik, subject to applicable communications and marketing laws.",
      "Electronic records, account logs, order records, payment-proof submissions, consent records, timestamps, device records, messages, and other Platform records may be retained and used as evidence of Platform activity to the extent permitted by law.",
      "These Terms are intended to operate consistently with applicable electronic-transactions law, including Jordan’s Electronic Transactions Law No. 15 of 2015 as amended or replaced.",
    ],
  },
  {
    id: "consumer-law",
    title: "37. Mandatory consumer rights",
    paragraphs: [
      "Jordanian consumer-protection law and other applicable laws may give Customers mandatory rights concerning accurate information, safe Products, proof of purchase, warranties, defects, misleading advertising, contractual obligations, remedies, and complaints.",
      "Retailers remain responsible for complying with seller or supplier obligations applicable to their Retail Transactions, including Jordan’s Consumer Protection Law No. 7 of 2017 and related regulations or instructions, as amended or replaced.",
      "No clause in these Terms is intended to waive a mandatory consumer right that cannot legally be waived. If a limitation in these Terms is unenforceable against a particular Customer or claim, the remaining Terms continue to apply.",
    ],
  },
  {
    id: "law-enforcement",
    title: "38. Legal process and cooperation with authorities",
    paragraphs: [
      "Darik may preserve or disclose information where reasonably necessary to comply with a valid legal request, court order, regulatory requirement, law-enforcement request, safety emergency, fraud investigation, intellectual-property complaint, or other lawful obligation.",
      "Darik may also take protective action where reasonably necessary to protect users, the public, Darik, or third parties, subject to applicable data-protection and other laws.",
    ],
  },
  {
    id: "changes",
    title: "39. Changes to these Terms",
    paragraphs: [
      "Darik may update these Terms to reflect changes in law, Platform functionality, business models, security practices, third-party services, or risk allocation.",
      "Updated Terms will be posted on the Platform with a revised effective or last-updated date. Where applicable law requires additional notice or consent for a material change, Darik will provide it.",
      "Continued use after an effective update constitutes acceptance to the extent permitted by law. If you do not agree to updated Terms, you must stop using the affected services and may contact Support regarding account closure.",
    ],
  },
  {
    id: "governing-law",
    title: "40. Governing law and disputes",
    paragraphs: [
      "These Terms and disputes relating to the Platform are governed by the laws of the Hashemite Kingdom of Jordan, without prejudice to mandatory legal protections that apply regardless of contractual choice.",
      "Before commencing formal proceedings, the parties are encouraged, where practical, to contact Darik Support and attempt good-faith resolution. This informal step does not prevent a person from seeking urgent relief, contacting a regulator or consumer-protection authority, or exercising a legal right that cannot be delayed or waived.",
      "Subject to mandatory jurisdiction rules, the competent courts of Amman, Jordan will have jurisdiction over disputes involving Darik.",
    ],
  },
  {
    id: "misc",
    title: "41. Miscellaneous legal terms",
    paragraphs: [
      "If any provision of these Terms is held invalid or unenforceable, that provision will be enforced to the maximum lawful extent or severed if necessary, and the remaining provisions will remain effective.",
      "Darik’s failure to enforce a provision immediately is not a waiver of that provision or any later breach.",
      "Users may not assign or transfer their account or rights under these Terms without Darik’s written consent. Darik may assign these Terms as part of a merger, restructuring, financing, sale of business or assets, corporate reorganization, or transfer of the Platform, subject to applicable law.",
      "Section headings are for convenience and do not limit the meaning of the Terms. Provisions concerning intellectual property, payment obligations, liability limits, releases, indemnity, records, disputes, and any provision that by its nature should survive will survive account closure or termination.",
      "These Terms, together with policies and specific service terms expressly incorporated by reference, constitute the agreement governing the Platform and supersede prior general Platform terms on the same subject.",
    ],
  },
  {
    id: "language",
    title: "42. English and Arabic versions",
    paragraphs: [
      "Darik may provide these Terms in English and Arabic for accessibility. Both versions are intended to communicate the same agreement.",
      "If there is an inconsistency between language versions, the Arabic version will prevail to the extent permitted by applicable law, unless a mandatory rule requires otherwise.",
    ],
  },
  {
    id: "contact",
    title: "43. Contact and legal notices",
    paragraphs: [
      "Questions, complaints, legal notices, privacy requests, or reports concerning these Terms may be submitted through the Darik Support page or Darik’s published support channels.",
      "Current primary support channel: WhatsApp +962 79 300 9420.",
      "When contacting Darik about a Retail Transaction, include the relevant store name, Order information, a description of the issue, and supporting evidence where appropriate. Do not send passwords or unnecessary sensitive information.",
    ],
  },
];

const arabicSections: readonly TermsSection[] = [
  {
    id: "agreement",
    title: "1. الموافقة على هذه الشروط",
    paragraphs: [
      "تشكل شروط الاستخدام هذه («الشروط») اتفاقية ملزمة بينك وبين داريك تكنولوجيز، المشغّل لموقع GetDarik.com ومنصة داريك («داريك» أو «نحن»). وتنظم الوصول إلى واستخدام GetDarik.com وواجهات متاجر داريك وتطبيق داريك للتجار ولوحات تحكم التجار وأدوات طلب العملاء وأدوات اكتشاف المنتجات وخدمات الدعم وأي تقنية أو خدمة أخرى من داريك تشير إلى هذه الشروط (ويشار إليها مجتمعة بـ«المنصة»).",
      "من خلال الدخول إلى المنصة أو إنشاء حساب أو نشر متجر أو منتج أو تقديم طلب أو قبوله أو شراء خدمة من خدمات داريك أو الضغط على زر الموافقة أو استخدام المنصة بأي شكل آخر، فإنك توافق على هذه الشروط وعلى السياسات التي يتم إدماجها فيها صراحة بالإحالة.",
      "إذا منحك القانون المعمول به حقوقاً لا يجوز التنازل عنها أو تقييدها تعاقدياً، فلا يوجد في هذه الشروط ما يلغي تلك الحقوق. وأي حكم يتعارض مع قاعدة قانونية آمرة يطبق فقط بالقدر الذي يسمح به القانون.",
    ],
  },
  {
    id: "definitions",
    title: "2. التعريفات الأساسية",
    paragraphs: [
      "لغايات هذه الشروط، توضح التعريفات التالية الأدوار المنفصلة لداريك والتجار والعملاء.",
    ],
    bullets: [
      "«العميل» يعني أي شخص يتصفح أو يبحث أو يتواصل أو يطلب أو يشتري من تاجر من خلال المنصة أو بعد استخدامها.",
      "«التاجر» أو «المتجر» يعني نشاطاً تجارياً مستقلاً أو بائعاً أو مورداً أو مستخدماً تجارياً مخولاً يدير أو يظهر من خلال واجهة متجر على داريك.",
      "«المنتج» يعني أي سلعة مادية أو خدمة أو عرض أو إدراج أو عنصر في الكتالوج أو بضاعة أخرى يقدمها التاجر.",
      "«الطلب» يعني طلب شراء أو معاملة يرسلها العميل إلى التاجر باستخدام أدوات المنصة.",
      "«معاملة البيع» تعني عملية الشراء والبيع والتنفيذ والتوصيل والاستلام والإرجاع والاسترداد والضمان أو أي معاملة تجارية أساسية بين العميل والتاجر.",
      "«خدمات داريك» تعني التقنية والخدمات التي تبيعها أو تقدمها داريك مباشرة، بما في ذلك برامج واجهات المتاجر والاشتراكات والأدوات الرقمية وائتمانات الذكاء الاصطناعي وربط النطاقات والإعلانات أو غيرها من الخدمات التي تحددها داريك.",
      "«محتوى التاجر» يعني المعلومات والصور والشعارات والعلامات والأوصاف والأسعار وبيانات المنتجات والرسائل وتعليمات الدفع وأي مواد أخرى يقدمها التاجر أو تقدم نيابة عنه.",
    ],
  },
  {
    id: "platform-role",
    title: "3. داريك منصة تقنية وليست بائع المنتجات",
    paragraphs: [
      "توفر داريك تقنية تساعد العملاء على اكتشاف التجار المستقلين والبحث عن المنتجات وتصفح واجهات المتاجر وإرسال الطلبات ومعرفة توفر التوصيل والتواصل أو التفاعل مع التجار. وداريك وسيط تقني ومنصة سوق.",
      "ما لم تحدد داريك صراحة وكتابة أنها البائع أو مقدم سلعة أو خدمة محددة، فإن داريك لا تصنع ولا تملك ولا تشتري ولا تخزن ولا تحوز ولا تفحص ولا تعبئ ولا تضع بطاقات ولا تستورد ولا تصدر ولا توزع ولا تعرض للبيع ولا تبيع المنتجات التي يدرجها التجار.",
      "ظهور المنتج على GetDarik.com أو على صفحة تحمل علامة داريك أو في تطبيق داريك أو على رابط تابع لداريك أو ضمن نتائج البحث أو المواد التسويقية أو واجهة التاجر لا يجعل داريك بائع ذلك المنتج.",
    ],
    bullets: [
      "داريك ليست التاجر المسجل أو البائع القانوني لمنتجات التجار ما لم تنص صفحة دفع محددة صراحة على خلاف ذلك.",
      "لا تنتقل ملكية منتجات التاجر إلى داريك لمجرد إرسال طلب عبر المنصة.",
      "داريك ليست مصنعاً أو مستورداً أو موزعاً أو تاجر جملة أو بائعاً أو حائزاً أو مؤمناً أو ضامناً أو صاحب امتياز أو مانح امتياز أو صاحب عمل أو شريكاً للتاجر لمجرد استخدامه داريك.",
      "داريك غير مسؤولة عن الوضع القانوني للتاجر أو تراخيصه أو ضرائبه أو موظفيه أو سائقيه أو مقاوليـه أو مخزونه أو عملياته التجارية.",
    ],
    note:
      "القاعدة الأساسية للمعاملة: عندما يشتري العميل منتجاً من أحد التجار فهو يشتريه من ذلك التاجر وليس من داريك.",
  },
  {
    id: "retail-transaction",
    title: "4. عقد الشراء يكون بين العميل والتاجر",
    paragraphs: [
      "تتم معاملة البيع حصراً بين العميل والتاجر المعني. وتوفر داريك البيئة التقنية التي تساعد الطرفين على اكتشاف بعضهما وتبادل المعلومات وإرسال الطلب ورفع إثبات الدفع وتنسيق التنفيذ أو استخدام الوظائف ذات الصلة.",
      "الطلب المرسل عبر داريك يصل إلى التاجر، ويبقى التاجر مسؤولاً عن قبوله أو رفضه أو تأكيده أو تجهيزه أو تنفيذه أو إلغائه أو إعادة الأموال أو التعامل معه بأي شكل آخر، مع مراعاة القانون والسياسات القانونية للتاجر.",
      "التاجر هو الطرف المسؤول عن توريد المنتج والوفاء بالتزامات البائع أو المورد والضمان والضرائب والفواتير وحماية المستهلك وسلامة المنتج والتنفيذ التي تنطبق عليه.",
    ],
  },
  {
    id: "no-agency",
    title: "5. لا وكالة ولا شراكة ولا علاقة عمل ولا اعتماد",
    paragraphs: [
      "التجار أنشطة مستقلة. ولا تنشئ هذه الشروط علاقة وكالة أو شراكة أو مشروع مشترك أو عمل أو علاقة ائتمانية أو امتياز أو توزيع أو تمثيل بين داريك وأي تاجر أو عميل.",
      "لا يملك التاجر صلاحية إلزام داريك أو تقديم وعود نيابة عنها أو إنشاء التزامات عليها أو الادعاء بأن داريك تضمن التاجر أو منتجاته.",
      "موافقة داريك على تاجر أو تفعيله أو عرضه أو ترتيبه أو إجراء تحقق معين أو إظهار شارة أو حالة حساب تعني فقط السماح له باستخدام المنصة أو الظهور عليها. ولا تعني موافقة حكومية أو شهادة منتج أو اعتماد سلامة أو ضمان أصالة أو فحصاً ائتمانياً أو ضماناً مالياً أو رأياً حول التراخيص أو توصية من داريك.",
    ],
  },
  {
    id: "retailer-eligibility",
    title: "6. أهلية التاجر والتراخيص والامتثال",
    paragraphs: [
      "يقر كل تاجر ويضمن أنه مخول قانوناً لتشغيل نشاطه وإدراج منتجاته والدخول في معاملات البيع واستلام دفعات العملاء وإصدار الفواتير أو الإيصالات المطلوبة وتنفيذ خدمات التوصيل أو الاستلام التي يعرضها.",
      "يتحمل التاجر وحده مسؤولية الحصول على جميع التسجيلات والتصاريح والموافقات المهنية وموافقات المنتجات والتسجيلات الضريبية والموافقات الجمركية والصحية أو المتعلقة بالسلامة وتصاريح بيع المنتجات المقيدة بالعمر وغيرها من التراخيص اللازمة.",
      "يجوز لداريك طلب مستندات أو رفض التفعيل أو تقييد وظائف أو إزالة إدراجات أو تعليق تاجر إذا رأت بصورة معقولة أن التحقق الإضافي مناسب، إلا أن داريك ليست ملزمة بشكل عام بالتحقق المستقل من كل متطلب قانوني يخص كل تاجر.",
    ],
  },
  {
    id: "listings",
    title: "7. الإدراجات والأوصاف والأسعار والمخزون",
    paragraphs: [
      "يتحمل التاجر وحده مسؤولية محتوى التاجر وعن أن تكون الإدراجات محدثة وكاملة ودقيقة وقانونية وغير مضللة ومتوافقة مع المنتج المعروض فعلياً.",
      "يحدد التاجر أسعار منتجاته وتوفرها وعروضها ومتغيراتها وكمياتها وحالتها وضماناتها ورسوم التوصيل والحد الأدنى للطلب وغيرها من شروط البيع، إلا إذا قدمت داريك صراحة عرضاً مستقلاً تتحكم به داريك.",
      "يجوز لداريك تنسيق أو تغيير حجم أو ترجمة أو تصنيف أو فهرسة أو تخزين مؤقت أو معالجة محتوى التاجر تقنياً لتشغيل المنصة. ولا تنقل هذه المعالجة التقنية مسؤولية المعلومات الأساسية إلى داريك.",
    ],
    bullets: [
      "لا يجوز نشر أسعار كاذبة أو مخزون وهمي أو خصومات مضللة أو مواصفات مختلقة أو صور خادعة أو شروط غير معلنة أو معلومات ناقصة بشكل جوهري.",
      "يجب تحديث أو إزالة المنتجات غير المتوفرة أو المتوقفة أو المسحوبة أو المنتهية أو غير الآمنة أو المتغيرة بشكل جوهري فوراً.",
      "لا تضمن داريك خلو بيانات المخزون أو الأسعار أو التوصيل أو الأوصاف أو الترجمات أو بيانات الكتالوج المقدمة من التاجر من الأخطاء أو أنها محدثة دائماً.",
    ],
  },
  {
    id: "product-responsibility",
    title: "8. جودة المنتج وسلامته وقانونيته وأصالته والاستدعاءات",
    paragraphs: [
      "يتحمل التاجر وحده مسؤولية جودة منتجاته وحالتها ومطابقتها وصلاحيتها وسلامتها وقانونيتها وأصالتها ومنشئها وبياناتها وتعبئتها وتخزينها وتاريخ صلاحيتها وتعليماتها وتحذيراتها والامتثال التنظيمي المتعلق بها.",
      "لا تقوم داريك بصورة اعتيادية بفحص أو اختبار أو توثيق أصالة أو اعتماد منتجات التجار ولا تحوزها مادياً. وينبغي للعميل تقييم المنتج والتاجر بالشكل المناسب قبل إتمام الشراء.",
      "يجب على التاجر فوراً إزالة أو تعطيل أي منتج يعلم أو ينبغي بصورة معقولة أن يعلم أنه معيب أو غير آمن أو مقلد أو مسحوب أو منتهي الصلاحية أو مسوق بصورة غير قانونية أو موسوم بشكل خاطئ أو غير صالح للبيع القانوني.",
    ],
    bullets: [
      "مطالبات عيوب المنتجات تقع على عاتق التاجر الذي باع المنتج، مع مراعاة القواعد القانونية الآمرة.",
      "الاستدعاءات وإشعارات السلامة والإصلاح والاستبدال والضمان وخدمات ما بعد البيع تبقى مسؤولية التاجر.",
      "يجوز لداريك إزالة إدراج أو تاجر دون إشعار مسبق عند وجود مخاوف تتعلق بالسلامة أو الاحتيال أو التعدي على الحقوق أو التنظيم أو حماية المستهلك.",
    ],
  },
  {
    id: "regulated-products",
    title: "9. المنتجات المنظمة أو المقيدة أو الحساسة للعمر",
    paragraphs: [
      "يجب على التجار الالتزام بجميع القوانين وقواعد المنصة المتعلقة بالمنتجات المنظمة أو المقيدة أو المرخصة أو الحساسة للعمر أو الصحة أو السلامة.",
      "وجود خانة إدراج أو فئة معينة على داريك لا يعني أن المنتج يجوز قانوناً بيعه أو الإعلان عنه أو توصيله أو استيراده أو توريده في جميع الظروف.",
      "يتحمل التاجر مسؤولية التحقق من العمر أو الهوية والمراجعات المهنية والوصفات أو الموافقات المطلوبة قانوناً وأي قيود على الإعلان أو البيع عن بعد أو التوصيل أو الحيازة.",
    ],
  },
  {
    id: "customers",
    title: "10. مسؤوليات العميل",
    paragraphs: [
      "يجب على العميل تقديم معلومات صحيحة عن التواصل والموقع والتوصيل والدفع عند إرسال طلب، واستخدام المنصة بصورة قانونية وبحسن نية.",
      "يتحمل العميل مسؤولية مراجعة التاجر ووصف المنتج والسعر وشروط التوصيل ومعلومات الضمان وشروط التاجر الأخرى قبل إتمام معاملة البيع.",
      "لا يجوز للعميل إرسال طلبات احتيالية أو إثباتات دفع مزورة أو اعتراضات دفع مسيئة أو معلومات توصيل يعلم أنها غير صحيحة أو استخدام داريك لمضايقة أو خداع أو انتحال صفة أو الإضرار بتاجر أو شخص آخر.",
    ],
  },
  {
    id: "orders",
    title: "11. الطلبات والقبول والإلغاء والتوفر",
    paragraphs: [
      "إرسال طلب عبر داريك لا يضمن قبوله أو تنفيذه. فقد ينفد المنتج أو يوجد خطأ بالسعر أو يوقف التاجر استقبال الطلبات أو يصبح التنفيذ غير ممكن.",
      "يتحمل التاجر مسؤولية تحديد قبول الطلب وتنفيذ قرارات الإلغاء أو الاستبدال أو التجهيز أو التنفيذ والتواصل بشأنها.",
      "يجوز لداريك حظر أو إلغاء أو تعليق أو وضع علامة على طلب لأسباب أمنية أو لمنع الاحتيال أو لضمان الموثوقية التقنية أو الامتثال القانوني أو منع الإساءة أو حماية المنصة. ولا يجعل هذا الإجراء التقني داريك بائعاً.",
    ],
  },
  {
    id: "payments",
    title: "12. دفعات العملاء وإثبات الدفع",
    paragraphs: [
      "ما لم تنص داريك صراحة على خلاف ذلك لمعاملة محددة، فإن المبلغ المدفوع مقابل منتج تاجر هو دفعة للتاجر المعني أو لصالحه ومقابل شراء العميل من ذلك التاجر، وليس مقابل شراء بضائع من داريك.",
      "قد توفر داريك أدوات تقنية لعرض تعليمات الدفع أو نقل معلومات CliQ أو رفع لقطات شاشة أو إيصالات الدفع أو تسجيل حالة الدفع أو تمكين التاجر أو المسؤول من مراجعة دليل الدفع. وهذه وظائف تواصل أو سير عمل أو تحقق ولا تجعل داريك بحد ذاتها بنكاً أو ناقل أموال أو مزود ضمان حساب أو مؤسسة دفع أو ضامناً أو بائعاً قانونياً لمنتج التاجر.",
      "لقطة شاشة الدفع أو الإيصال المرفوع أو حالة الدفع أو إشعار المنصة ليست ضماناً بأن الأموال تم تحويلها بصورة صحيحة أو نهائية أو غير قابلة للعكس أو وصلت إلى الحساب الصحيح. ويتحمل التاجر مسؤولية التحقق من استلامه الفعلي للأموال عندما يكون ذلك مناسباً قبل التنفيذ.",
    ],
    note:
      "الرسوم المدفوعة مباشرة لداريك مقابل الاشتراكات أو أرصدة الذكاء الاصطناعي أو الإعلانات أو ربط النطاقات أو غيرها من خدمات داريك هي معاملات منفصلة عن شراء العميل لمنتجات التاجر.",
  },
  {
    id: "refunds",
    title: "13. الإرجاع والاسترداد والاستبدال والإلغاء والضمان",
    paragraphs: [
      "التاجر الذي يبيع المنتج هو المسؤول عن الإرجاع والاسترداد والاستبدال والإصلاح والضمان وخدمة ما بعد البيع والمعالجات التي يفرضها القانون بشأن ذلك المنتج.",
      "يجوز لداريك تقديم أدوات للرسائل أو حالة الطلب أو الشكاوى أو الدعم تساعد العميل والتاجر على التواصل، إلا أن مساعدة داريك الاختيارية لا تجعلها مسؤولة عن الالتزام الأساسي الواقع على التاجر.",
      "لا يوجد في هذه الشروط ما يحد من حقوق العميل الآمرة بموجب قوانين حماية المستهلك. ولا يجوز للتاجر استخدام داريك أو سياساته لإلغاء حقوق لا يجوز قانوناً التنازل عنها.",
    ],
  },
  {
    id: "delivery",
    title: "14. التوصيل والاستلام والسائقون وشركات النقل",
    paragraphs: [
      "ما لم يحدد طلب معين صراحة أن داريك هي مزود التوصيل بموجب شروط منفصلة، فإن التوصيل أو الاستلام يتم ترتيبه أو تنفيذه أو التحكم به من قبل التاجر و/أو السائق أو الموظف أو الناقل أو المقاول أو مزود الخدمات اللوجستية الذي يختاره التاجر.",
      "يتحمل التاجر مسؤولية موظفي التوصيل الذين يستعين بهم ومواعيد التوصيل والتعامل الآمن واختيار الطرق والامتثال المتعلق بالمركبات وسلوك السائق ورسوم التوصيل والطلبات الفاشلة وإثبات التسليم وغيرها من مسائل التنفيذ.",
      "قد توفر داريك تقنية لحساب المناطق أو عرض الرسوم أو إنشاء رموز PIN للسائق أو نقل العناوين أو عرض معلومات المسار أو تنسيق سير عمل التوصيل. ولا تنشئ هذه الأدوات علاقة عمل أو وكالة بين داريك وسائق أو ناقل تابع للتاجر.",
    ],
  },
  {
    id: "location",
    title: "15. الخرائط والموقع ومناطق التوصيل والمسافة والتقديرات",
    paragraphs: [
      "قد تستخدم داريك موقع الجهاز أو المواقع التي يحددها العميل أو خدمات تحديد المواقع الجغرافية أو الخرائط أو الإحداثيات أو مناطق التوصيل التي يحددها التاجر أو حسابات النطاق أو بيانات أخرى لترتيب المتاجر وتقدير توفر التوصيل.",
      "الموقع والمسافة والرسوم ووقت الوصول والمسار وأهلية التوصيل هي تقديرات مبنية على المعلومات المتوفرة وإعدادات التاجر، وقد تتأثر بأخطاء الخريطة أو الدبوس أو الطرق أو الجهاز أو إعدادات التاجر أو خدمات الأطراف الأخرى.",
      "ظهور عبارة تفيد بأن المتجر يوصل إلى موقع معين لا يضمن إمكانية أو حصول توصيل طلب محدد. ويبقى التنفيذ النهائي خاضعاً لقبول التاجر وظروف التشغيل والقانون.",
    ],
  },
  {
    id: "directory",
    title: "16. الدليل والبحث عن المنتجات والترتيب والاكتشاف",
    paragraphs: [
      "صممت داريك لمساعدة العملاء على اكتشاف المتاجر والمنتجات الفعالة في الأردن. وقد يبقى المتجر ظاهراً حتى عندما لا يقدم التوصيل إلى الموقع المحدد للعميل.",
      "قد يأخذ البحث والترتيب في الاعتبار الصلة وتوفر التوصيل والمسافة وفئة المتجر وتطابق المنتجات والتوفر وجودة البيانات وسلامة المنصة والعروض والرعاية وتفضيلات العميل أو عوامل أخرى قد تغيرها داريك مع الوقت.",
      "لا تضمن داريك لأي تاجر ترتيباً أو عدد زيارات أو مرات ظهور أو موقعاً في البحث أو معدل تحويل أو إيراداً أو فهرسة في Google أو نتيجة تجارية محددة.",
    ],
  },
  {
    id: "retailer-fees",
    title: "17. اشتراكات التجار والتفعيل وخدمات داريك",
    paragraphs: [
      "يجوز للتاجر شراء اشتراكات أو سعة كتالوج أو أرصدة رقمية أو إعلانات أو خدمات إعداد أو خدمات أخرى من داريك مباشرة. وهذه الرسوم مقابل تقنية أو خدمات داريك وهي منفصلة قانونياً عن معاملات البيع بين العملاء والتجار.",
      "مدة الخطة وحدود الكتالوج والأسعار وموعد الدفع والميزات المشمولة وقواعد التجديد وأسعار العروض وغيرها من الشروط التجارية هي ما يتم الإفصاح عنه من داريك عند الشراء أو التفعيل.",
      "باستثناء ما يفرضه القانون أو شروط داريك المكتوبة، لا تضمن خدمات داريك مبيعات أو إيرادات أو ترتيباً في البحث أو زيارات العملاء أو توفر الخدمة بشكل مستمر أو نتيجة تجارية محددة.",
      "يجوز لداريك تغيير الأسعار أو الخطط المستقبلية، وتطبق التغييرات عادة بصورة مستقبلية مثل وقت التجديد أو الشراء الجديد ما لم يتم الإفصاح قانوناً عن تاريخ آخر.",
    ],
  },
  {
    id: "domains",
    title: "18. خدمات النطاق المخصص",
    paragraphs: [
      "عندما تعرض داريك ربط نطاق خاص بالتاجر بواجهة متجر داريك، فإن رسوم النطاق المخصص تغطي فقط خدمة الإعداد أو الخدمة التي تصفها داريك صراحة.",
      "ما لم تنص داريك صراحة على خلاف ذلك، يتحمل التاجر مسؤولية ملكية النطاق أو السيطرة القانونية عليه ودفع رسوم التسجيل والتجديد والمحافظة على بيانات المسجل الصحيحة والالتزام بشروط مسجل النطاق.",
      "لا تضمن داريك توفر المسجل أو DNS أو الشهادات أو المتصفح أو الإنترنت أو مزود الاستضافة من الأطراف الأخرى. ولا تؤدي مشكلة النطاق إلى نقل ملكية معاملات منتجات التاجر إلى داريك.",
    ],
  },
  {
    id: "ai",
    title: "19. أدوات الذكاء الاصطناعي وتحسين الصور والأرصدة الرقمية",
    paragraphs: [
      "قد تقدم داريك أدوات اختيارية مدعومة بالذكاء الاصطناعي، بما فيها تحسين صور المنتجات أو ميزات مرتبطة. وقد تستخدم هذه الوظائف مزودي ذكاء اصطناعي من أطراف أخرى وقد تتطلب موافقة التاجر قبل إرسال المحتوى للمعالجة.",
      "لا يجوز للتاجر إرسال بيانات شخصية أو سرية أو حساسة أو غير قانونية أو مواد محمية للغير إلى أدوات الذكاء الاصطناعي ما لم يملك الحقوق والأساس القانوني اللازمين.",
      "قد تكون مخرجات الذكاء الاصطناعي غير دقيقة أو ناقصة أو متغيرة أو غير متوقعة أو غير مناسبة. ويجب على التاجر مراجعة كل مخرج يتم إنشاؤه أو تعديله بالذكاء الاصطناعي قبل نشره أو الاعتماد عليه، ويبقى التاجر مسؤولاً عن الإدراج النهائي.",
      "ائتمانات الذكاء الاصطناعي أو الأرصدة الرقمية المشابهة المشتراة من داريك هي خدمات داريك وليست دفعات مقابل منتجات التجار. ويخضع الاستهلاك والانتهاء والاسترداد والتوفر للشروط الظاهرة مع الميزة وللقانون الآمر.",
    ],
  },
  {
    id: "content",
    title: "20. محتوى التاجر والترخيص الممنوح لداريك",
    paragraphs: [
      "يحتفظ التاجر بملكية الحقوق التي يملكها بصورة قانونية في محتوى التاجر. ومن خلال رفع أو نشر أو إرسال أو تقديم المحتوى إلى داريك، يمنح التاجر داريك ترخيصاً عالمياً وغير حصري وخالياً من الرسوم وقابلاً للترخيص من الباطن لاستضافة المحتوى وتخزينه واستنساخه وتغيير حجمه واقتصاصه وتنسيقه وتكييفه وترجمته وفهرسته وتخزينه مؤقتاً ونقله وعرضه وتوزيعه واستخدامه بالشكل المعقول لتشغيل المنصة وحمايتها وتسويقها وتطويرها وتقديم واجهة التاجر.",
      "يقر التاجر بأنه يملك أو حصل على جميع الأذونات اللازمة لاستخدام داريك للمحتوى بهذا الشكل وأن المحتوى لا ينتهك حقوق الملكية الفكرية أو الخصوصية أو الصورة أو السرية أو المستهلك أو أي حقوق أخرى.",
      "يستمر الترخيص للمدة اللازمة بصورة معقولة لتشغيل الخدمة وقد يستمر للنسخ الاحتياطية والصفحات المخزنة وسجلات المعاملات ومنع الاحتيال والامتثال القانوني وأدلة النزاعات وأغراض الاحتفاظ المشروعة الأخرى بعد إزالة المحتوى.",
    ],
  },
  {
    id: "ip",
    title: "21. ملكية داريك الفكرية وشكاوى التعدي",
    paragraphs: [
      "المنصة واسم داريك وشعاراتها وبرامجها وكودها وتصاميمها وقواعد بياناتها وسير العمل والوثائق وغيرها من المواد المملوكة لداريك محمية بقوانين الملكية الفكرية وتبقى ملكاً لداريك أو لمرخصيها.",
      "باستثناء الاستخدام العادي للمنصة، لا يجوز نسخ أو استنساخ أو بيع أو ترخيص أو إجراء هندسة عكسية أو كشط أو استخراج أو تجاوز القيود أو إنشاء خدمات مشتقة أو استغلال تقنية داريك تجارياً دون إذن كتابي.",
      "يجوز لداريك إزالة أو تقييد محتوى عند استلام شكوى معقولة بشأن التعدي أو إذا اعتقدت بصورة معقولة أن المحتوى ينتهك حقوق الملكية الفكرية للغير. ويتحمل التاجر مسؤولية النزاعات الناشئة عن علاماته أو صوره أو أوصافه أو أسماء المنتجات أو غيرها من محتواه.",
    ],
  },
  {
    id: "communications",
    title: "22. الاتصالات وبيانات العملاء وتواصل التاجر",
    paragraphs: [
      "قد تمكن داريك العملاء والتجار من تبادل تفاصيل الطلب وأرقام الهاتف والعناوين والملاحظات ورسائل WhatsApp وغيرها من المعلومات اللازمة للاكتشاف أو خدمة العملاء أو التحقق من الدفع أو التوصيل أو التنفيذ.",
      "يجب على التاجر الذي يتلقى معلومات عميل استخدامها فقط للأغراض القانونية المتعلقة بمعاملة البيع أو لغرض قانوني آخر تم إبلاغ العميل به بصورة صحيحة أو وافق عليه عندما تكون الموافقة مطلوبة.",
      "لا يجوز للتاجر بيع معلومات العميل أو استخدامها للمضايقة أو الإفصاح عنها دون أساس قانوني أو الاحتفاظ بها لمدة أطول من اللازم قانونياً أو تشغيلياً. ويتحمل كل تاجر مسؤولية مستقلة عن تعامله مع البيانات الشخصية التي يستلمها.",
    ],
  },
  {
    id: "privacy",
    title: "23. الخصوصية والبيانات الشخصية",
    paragraphs: [
      "يخضع جمع داريك للبيانات الشخصية ومعالجتها أيضاً لسياسة خصوصية داريك وقانون حماية البيانات المعمول به، بما في ذلك قانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023 وتعديلاته أو ما يحل محله.",
      "يقر المستخدم بأن بيانات الموقع والحساب والطلبات والجهاز والمتجر والدعم والأمان والبيانات المرتبطة بها قد تتم معالجتها عند الحاجة لتقديم المنصة أو منع الاحتيال أو الامتثال للقانون أو تنفيذ طلب المستخدم أو تحقيق أغراض قانونية أخرى موضحة في سياسة الخصوصية.",
      "عندما يمنح القانون صاحب البيانات حقوقاً معينة، يمكن ممارسة تلك الحقوق عبر القنوات الموضحة في سياسة الخصوصية أو صفحة الدعم.",
    ],
  },
  {
    id: "third-parties",
    title: "24. تقنيات وخدمات الأطراف الأخرى",
    paragraphs: [
      "تعتمد داريك أو قد تتكامل مع بنية وخدمات أطراف أخرى مثل الاستضافة السحابية وقواعد البيانات والخرائط وتحديد المواقع والرسائل والتحليلات والنطاقات ومتاجر التطبيقات والذكاء الاصطناعي وشبكات الدفع والاتصالات وغيرها من مزودي التقنية.",
      "قد تشمل الأمثلة خدمات Google وWhatsApp/Meta وSupabase وVercel وxAI وApple ومسجلي النطاقات وغيرهم. وقد تكون لهذه الجهات شروط وسياسات خصوصية خاصة بها.",
      "لا تتحمل داريك مسؤولية انقطاع أو خطأ خرائط أو رسالة محجوبة أو مشكلة DNS أو فشل اتصالات أو تقييد حساب من طرف ثالث أو حدث نشأ في نظام طرف ثالث، إلا بالقدر الذي لا يسمح القانون باستبعاده أو عندما يكون الحدث ناتجاً مباشرة عن فعل من داريك يرتب مسؤولية قانونية لا يمكن استبعادها.",
    ],
  },
  {
    id: "prohibited-use",
    title: "25. السلوك المحظور",
    paragraphs: [
      "لا يجوز إساءة استخدام داريك أو التدخل في المنصة أو استخدامها بطريقة تنشئ مخاطر قانونية أو تتعلق بالسلامة أو الاحتيال أو الأمان أو السمعة أو التشغيل.",
    ],
    bullets: [
      "يمنع إدراج منتجات مسروقة أو مقلدة أو معتدية على الحقوق أو غير آمنة أو مسحوبة أو منتهية أو غير قانونية أو موصوفة بشكل خادع أو منظمة بصورة غير قانونية.",
      "يمنع تزوير إثباتات الدفع أو بيانات الهوية أو التقييمات أو معلومات المتجر أو المخزون أو التوصيل أو سجلات المعاملات.",
      "يمنع انتحال صفة شخص أو نشاط آخر أو الادعاء الكاذب بوجود علاقة مع داريك.",
      "يمنع إدخال برمجيات ضارة أو اختبار الأمان دون تصريح أو تجاوز ضوابط الوصول أو الكشط المفرط أو الهندسة العكسية للأنظمة المقيدة أو تعطيل توفر المنصة.",
      "يمنع التلاعب بالترتيب أو نتائج البحث أو العروض أو الأرصدة أو حسابات التوصيل أو حدود الحساب أو رسوم المنصة بوسائل احتيالية أو آلية.",
      "يمنع استخدام معلومات العملاء للبريد المزعج أو المضايقة أو التسويق غير المرتبط أو البيع أو التنميط أو الإفصاح دون أساس قانوني.",
      "يمنع استخدام داريك لتسهيل الاحتيال أو غسل الأموال أو التحايل على العقوبات أو التمويل غير القانوني أو أي نشاط محظور قانوناً.",
    ],
  },
  {
    id: "accounts",
    title: "26. الحسابات ووصول الموظفين والأمان",
    paragraphs: [
      "يتحمل أصحاب الحسابات مسؤولية حماية كلمات المرور ورموز PIN والأجهزة والجلسات وبيانات الموظفين ووسائل التحقق الأخرى.",
      "يتحمل التاجر مسؤولية الأشخاص الذين يسمح لهم بالوصول إلى حسابه وعن إزالة صلاحياتهم فور انتهاء التفويض.",
      "يجوز لداريك اعتبار الأفعال المنفذة باستخدام بيانات اعتماد صحيحة أفعالاً مصرحاً بها ما لم تتلق إشعاراً كافياً عن اختراق الحساب أو يفرض القانون نتيجة مختلفة.",
      "يجب الإبلاغ فوراً لدعم داريك عن الوصول غير المصرح به أو سرقة بيانات الدخول أو السيطرة على الحساب أو أي حادث أمني آخر.",
    ],
  },
  {
    id: "monitoring",
    title: "27. الإشراف والتحقيق وسلامة المنصة",
    paragraphs: [
      "يجوز لداريك، دون أن تكون ملزمة بذلك، مراجعة الإدراجات والتحقيق بالشكاوى وتحليل نشاط المنصة وطلب المستندات وحفظ الأدلة وتقييد الظهور ورفض المحتوى وإيقاف وظائف أو التعاون مع الجهات المختصة.",
      "يجوز استخدام أدوات آلية أو بشرية للكشف عن الاحتيال والمنتجات غير الآمنة والإساءة والحسابات المكررة وإثباتات الدفع المشبوهة والتهديدات الأمنية ومخالفات هذه الشروط.",
      "مراجعة داريك لتاجر أو منتج أو معاملة معينة لا تنشئ التزاماً عليها بمراقبة جميع التجار أو المنتجات أو المعاملات.",
    ],
  },
  {
    id: "suspension",
    title: "28. التعليق والإزالة والإنهاء",
    paragraphs: [
      "يجوز لداريك فوراً تقييد أو إخفاء أو تعليق أو تعطيل أو إنهاء حساب أو متجر أو منتج أو ميزة طلب أو خدمة رقمية أو وصول آخر عندما تعتقد بصورة معقولة أن ذلك ضروري للأمان أو منع الاحتيال أو سلامة المستخدمين أو الامتثال القانوني أو حماية الملكية الفكرية أو حماية المستهلك أو عدم دفع رسوم داريك أو منع الإساءة أو تطبيق هذه الشروط.",
      "عندما يكون ذلك عملياً ومناسباً، قد تقدم داريك إشعاراً أو فرصة لتصحيح المشكلة. ويجوز لها التصرف دون إشعار مسبق عندما قد يؤدي التأخير إلى مخاطر قانونية أو مالية أو تتعلق بالسلامة أو الاحتيال أو الأمان أو السمعة.",
      "لا ينهي إغلاق الحساب التزامات الدفع المستحقة أو التعويض أو الاحتفاظ القانوني أو سجلات المعاملات أو الأحكام التي ينبغي بطبيعتها أن تستمر بعد الإنهاء.",
    ],
  },
  {
    id: "availability",
    title: "29. توفر المنصة والصيانة والتغييرات",
    paragraphs: [
      "تعمل المنصة باستخدام تقنيات متطورة ومتغيرة. ويجوز لداريك إضافة أو إزالة أو إعادة تصميم أو استبدال أو تعليق أو تقييد أو إيقاف ميزات أو واجهات أو تكاملات أو واجهات API أو فئات أو طرق بحث أو أدوات توصيل أو خطط أسعار أو وظائف أخرى.",
      "تسعى داريك إلى تقديم خدمة موثوقة لكنها لا تعد بتشغيل متواصل أو خال من الأخطاء أو آمن بصورة مطلقة أو متوفر دائماً. وقد تؤدي الصيانة أو الحوادث السيبرانية أو أعطال الإنترنت أو الأطراف الأخرى أو الضغط أو القوة القاهرة أو عيوب البرامج إلى توقف أو تأخير البيانات.",
      "يتحمل المستخدم مسؤولية الاحتفاظ بسجلات تجارية مستقلة ومعقولة، ولا ينبغي الاعتماد على داريك باعتبارها النسخة الوحيدة للمعلومات المهمة قانونياً أو تشغيلياً.",
    ],
  },
  {
    id: "warranties",
    title: "30. إخلاء الضمانات",
    paragraphs: [
      "إلى أقصى حد يسمح به القانون، تقدم المنصة وخدمات داريك «كما هي» و«حسب التوفر»، وتخلي داريك مسؤوليتها عن الضمانات أو الشروط الضمنية بالقدر الذي يجوز قانوناً استبعادها.",
      "لا تضمن داريك أي تاجر أو منتج أو معاملة أو إدراج أو سعر أو مخزون أو وعد توصيل أو سائق أو ضمان أو جودة منتج أو سلامته أو أصالته أو قانونيته أو ملاءمته لغرض أو قابليته للتسويق أو نتيجة بحث أو ترتيب أو ترجمة أو خريطة أو مخرج ذكاء اصطناعي أو خدمة طرف ثالث أو نتيجة تجارية.",
      "لا يوجد في هذا القسم ما يستبعد ضماناً أو مسؤولية قانونية يحظر القانون صراحة على داريك استبعادها.",
    ],
  },
  {
    id: "liability",
    title: "31. حدود مسؤولية داريك",
    paragraphs: [
      "إلى أقصى حد يسمح به القانون، تكون داريك مسؤولة فقط عن أفعالها أو امتناعاتها التي ترتب عليها مسؤولية قانونية، ولا تكون مسؤولة عن أفعال أو امتناعات التجار أو العملاء أو السائقين أو شركات النقل أو المصنعين أو الموردين أو شبكات الدفع أو مزودي الاتصالات أو الأطراف المستقلة الأخرى.",
      "إلى أقصى حد يسمح به القانون، لا تتحمل داريك الخسائر غير المباشرة أو العرضية أو الخاصة أو النموذجية أو العقابية أو التبعية، أو الأرباح أو الإيرادات أو الفرص أو السمعة التجارية المفقودة، أو توقف الأعمال، أو الوفورات المتوقعة المفقودة، أو الخسارة الناتجة عن منتج تاجر أو عدم التوصيل أو التأخير أو العيب أو رفض الاسترداد أو مشكلة الضمان أو سوء السلوك أو الإدراج غير الدقيق أو الفعل غير القانوني للتاجر.",
      "إلى أقصى حد يسمح به القانون، لا تتجاوز المسؤولية الإجمالية لداريك تجاه المطالب عن المنصة أو خدمات داريك أو هذه الشروط أو معاملة البيع القيمة الأعلى من: (أ) 100 دينار أردني؛ أو (ب) الرسوم التي دفعها المطالب مباشرة إلى داريك مقابل خدمات داريك خلال الاثني عشر شهراً السابقة مباشرة للحدث الذي نشأت عنه المطالبة.",
      "للتوضيح، المبلغ الذي دفعه العميل إلى التاجر مقابل منتج التاجر ليس رسماً مدفوعاً إلى داريك ولا يدخل في احتساب حد مسؤولية داريك.",
      "لا يوجد في هذه الشروط ما يستبعد أو يحد المسؤولية عن الاحتيال أو سوء السلوك العمدي أو الإهمال الجسيم عندما لا يجوز قانوناً استبعاده أو الوفاة أو الإصابة الشخصية عندما يحظر القانون الاستبعاد أو أي مسؤولية أخرى لا يسمح القانون بتقييدها.",
    ],
  },
  {
    id: "release",
    title: "32. نزاعات التاجر والعميل وإبراء داريك",
    paragraphs: [
      "يتوقع من العميل والتاجر حل النزاعات المتعلقة بمعاملة البيع مباشرة بينهما، بما في ذلك حالة المنتج ووصفه وسعره وتوصيله وتلفه ونقصه وضمانه وإرجاعه واسترداده وأصالته وجودته أو الخدمة.",
      "يجوز لداريك اختيارياً تقديم الدعم أو الأدلة أو أدوات التواصل أو إجراءات حساب أو مساعدة أخرى. ولا تجعل هذه المساعدة داريك طرفاً في معاملة البيع ولا تنشئ التزاماً عليها بالوساطة أو التحكيم أو ضمان الدفع أو فرض الاسترداد أو تعويض أي طرف.",
      "إلى أقصى حد يسمح به القانون، يبرئ العميل والتاجر داريك من المطالبات والأضرار الناشئة فقط عن أفعال أو امتناعات أو منتجات أو وعود أو التزامات معاملة البيع الخاصة بالطرف الآخر أو طرف ثالث مستقل، باستثناء ما يستند إلى مسؤولية قانونية خاصة بداريك لا يجوز استبعادها.",
    ],
  },
  {
    id: "indemnity-retailer",
    title: "33. تعويض التاجر لداريك",
    paragraphs: [
      "إلى أقصى حد يسمح به القانون، يوافق كل تاجر على الدفاع عن داريك وشركاتها المرتبطة وملاكها ومديريها ومسؤوليها وموظفيها ومقاوليها ومزودي خدماتها ووكلائها وتعويضهم وإبراء ذمتهم من مطالبات الأطراف الأخرى والإجراءات والتحقيقات والالتزامات والأحكام والعقوبات والغرامات والخسائر والأضرار والتكاليف وأتعاب المحاماة المعقولة الناشئة عن نشاط التاجر أو منتجاته أو محتواه أو موظفيه أو سائقيه أو تنفيذه أو مخالفته لهذه الشروط.",
    ],
    bullets: [
      "عيوب المنتجات أو الإصابة أو الضرر بالممتلكات أو مشكلات السلامة أو الاستدعاءات أو انتهاء الصلاحية أو التلوث أو الوسم الخاطئ أو التحذيرات الناقصة.",
      "المنتجات المقلدة أو المسروقة أو المعتدية على الحقوق أو غير المصرح بها أو المستوردة أو المباعة بصورة غير قانونية.",
      "الإعلانات الكاذبة أو الأسعار غير الدقيقة أو الأوصاف المضللة أو أخطاء المخزون أو الشروط غير المعلنة أو العروض غير القانونية.",
      "عدم التوصيل أو التأخير أو حوادث التوصيل أو سوء سلوك السائق أو الفقد أو السرقة أو التلف أو المنتجات الخاطئة أو فشل الاستلام.",
      "الاسترداد والإرجاع والضمان والإصلاح والاستبدال والفواتير والضرائب وشكاوى المستهلك أو الالتزامات العقدية الواقعة على التاجر.",
      "مخالفة قوانين الترخيص أو الضرائب أو الجمارك أو العمل أو حماية البيانات أو الملكية الفكرية أو حماية المستهلك أو الصحة أو السلامة أو المنتجات أو الإعلان أو غيرها.",
      "إساءة استخدام التاجر لمعلومات العميل أو أي فعل أو امتناع من مالكي التاجر أو موظفيه أو سائقيه أو ناقليه أو مقاوليـه أو وكلائه.",
    ],
    note:
      "يهدف هذا التعويض إلى تحميل التاجر المخاطر التي تسبب بها التاجر، ويطبق فقط بالقدر الذي يسمح به القانون.",
  },
  {
    id: "indemnity-user",
    title: "34. تعويض المستخدم عن سوء الاستخدام غير القانوني",
    paragraphs: [
      "إلى أقصى حد يسمح به القانون، يوافق المستخدم الذي يسبب خسارة لداريك بسبب الاحتيال أو سوء السلوك المتعمد أو الاستخدام غير القانوني أو التعدي على الحقوق أو إثبات دفع مزور أو هجوم أمني أو كشط غير مصرح به أو انتحال صفة أو مخالفة جوهرية لهذه الشروط على تعويض داريك عن مطالبات الأطراف الأخرى والالتزامات وتكاليف الإنفاذ المعقولة الناتجة عن ذلك وبقدر ما تسبب به المستخدم.",
    ],
  },
  {
    id: "force-majeure",
    title: "35. الأحداث الخارجة عن السيطرة المعقولة",
    paragraphs: [
      "لا تتحمل داريك مسؤولية التأخير أو الانقطاع أو الفشل الناتج عن أحداث خارجة عن سيطرتها المعقولة، مثل أعطال الإنترنت أو الاتصالات أو الكهرباء أو الهجمات السيبرانية أو الكوارث الطبيعية أو الطقس الشديد أو الحرب أو الاضطرابات أو الإجراءات الحكومية أو الإضرابات أو الأوبئة أو فشل بنية طرف ثالث أو DNS أو شبكات الدفع أو إجراءات متاجر التطبيقات أو غيرها من أحداث القوة القاهرة، إلا عندما يفرض القانون خلاف ذلك.",
    ],
  },
  {
    id: "electronic",
    title: "36. الاتصالات والسجلات والإشعارات الإلكترونية",
    paragraphs: [
      "يوافق المستخدم على استلام الاتصالات والإشعارات المتعلقة بالمنصة إلكترونياً عبر المنصة أو واجهات الحساب أو البريد الإلكتروني أو الرسائل النصية أو WhatsApp أو الإشعارات الفورية أو معلومات التواصل الأخرى المقدمة لداريك، مع مراعاة قوانين الاتصالات والتسويق.",
      "يجوز الاحتفاظ بالسجلات الإلكترونية وسجلات الحسابات والطلبات وإثباتات الدفع والموافقات والطوابع الزمنية والأجهزة والرسائل وغيرها من سجلات المنصة واستخدامها كدليل على نشاط المنصة بالقدر الذي يسمح به القانون.",
      "تهدف هذه الشروط إلى العمل بصورة متسقة مع قوانين المعاملات الإلكترونية المعمول بها، بما في ذلك قانون المعاملات الإلكترونية الأردني رقم 15 لسنة 2015 وتعديلاته أو ما يحل محله.",
    ],
  },
  {
    id: "consumer-law",
    title: "37. حقوق المستهلك الآمرة",
    paragraphs: [
      "قد تمنح قوانين حماية المستهلك الأردنية وغيرها من القوانين حقوقاً آمرة للعملاء تتعلق بالمعلومات الصحيحة وسلامة المنتجات وإثبات الشراء والضمان والعيوب والإعلانات المضللة والالتزامات التعاقدية والمعالجات والشكاوى.",
      "يبقى التاجر مسؤولاً عن الالتزام بواجبات البائع أو المورد التي تنطبق على معاملات البيع الخاصة به، بما في ذلك قانون حماية المستهلك الأردني رقم 7 لسنة 2017 والأنظمة أو التعليمات الصادرة بمقتضاه وتعديلاته أو ما يحل محله.",
      "لا يهدف أي حكم من هذه الشروط إلى التنازل عن حق مستهلك آمر لا يجوز التنازل عنه. وإذا كان قيد معين غير قابل للتنفيذ بحق عميل أو مطالبة محددة، تبقى باقي الشروط سارية.",
    ],
  },
  {
    id: "law-enforcement",
    title: "38. الإجراءات القانونية والتعاون مع السلطات",
    paragraphs: [
      "يجوز لداريك حفظ أو الإفصاح عن المعلومات عندما يكون ذلك ضرورياً بصورة معقولة للامتثال لطلب قانوني صحيح أو أمر محكمة أو متطلب تنظيمي أو طلب جهة إنفاذ قانون أو حالة سلامة طارئة أو تحقيق احتيال أو شكوى ملكية فكرية أو التزام قانوني آخر.",
      "يجوز لداريك أيضاً اتخاذ إجراءات حماية عندما تكون ضرورية بصورة معقولة لحماية المستخدمين أو الجمهور أو داريك أو الأطراف الأخرى، مع مراعاة قوانين حماية البيانات وغيرها.",
    ],
  },
  {
    id: "changes",
    title: "39. تعديل هذه الشروط",
    paragraphs: [
      "يجوز لداريك تحديث هذه الشروط لتعكس تغييرات القانون أو وظائف المنصة أو نماذج الأعمال أو ممارسات الأمان أو خدمات الأطراف الأخرى أو توزيع المخاطر.",
      "تنشر الشروط المحدثة على المنصة مع تاريخ تحديث أو نفاذ جديد. وعندما يفرض القانون إشعاراً أو موافقة إضافية لتغيير جوهري، ستقوم داريك بذلك.",
      "يعد استمرار الاستخدام بعد نفاذ التحديث قبولاً له بالقدر الذي يسمح به القانون. وإذا لم توافق، فعليك التوقف عن استخدام الخدمات المتأثرة ويمكنك التواصل مع الدعم بخصوص إغلاق الحساب.",
    ],
  },
  {
    id: "governing-law",
    title: "40. القانون الواجب التطبيق والنزاعات",
    paragraphs: [
      "تخضع هذه الشروط والنزاعات المتعلقة بالمنصة لقوانين المملكة الأردنية الهاشمية، دون الإخلال بالحمايات القانونية الآمرة التي تنطبق بغض النظر عن اختيار القانون.",
      "قبل بدء إجراءات رسمية، يشجع الأطراف عندما يكون ذلك عملياً على التواصل مع دعم داريك ومحاولة الحل بحسن نية. ولا تمنع هذه الخطوة شخصاً من طلب حماية عاجلة أو التواصل مع جهة تنظيمية أو حماية المستهلك أو ممارسة حق قانوني لا يجوز تأخيره أو التنازل عنه.",
      "مع مراعاة قواعد الاختصاص الآمرة، تكون المحاكم المختصة في عمان، الأردن صاحبة الاختصاص في النزاعات التي تكون داريك طرفاً فيها.",
    ],
  },
  {
    id: "misc",
    title: "41. أحكام قانونية متنوعة",
    paragraphs: [
      "إذا اعتبر حكم من هذه الشروط باطلاً أو غير قابل للتنفيذ، فيطبق إلى أقصى حد قانوني أو يتم فصله عند الحاجة وتبقى الأحكام الأخرى نافذة.",
      "عدم قيام داريك بتطبيق حكم فوراً لا يعتبر تنازلاً عنه أو عن أي مخالفة لاحقة.",
      "لا يجوز للمستخدم تحويل حسابه أو حقوقه بموجب هذه الشروط دون موافقة داريك الكتابية. ويجوز لداريك تحويل هذه الشروط ضمن اندماج أو إعادة هيكلة أو تمويل أو بيع أعمال أو أصول أو تنظيم شركة أو نقل المنصة مع مراعاة القانون.",
      "عناوين الأقسام للتسهيل ولا تقيد المعنى. وتستمر بعد إغلاق الحساب الأحكام المتعلقة بالملكية الفكرية والدفعات وحدود المسؤولية والإبراء والتعويض والسجلات والنزاعات وأي حكم يفترض بطبيعته الاستمرار.",
      "تشكل هذه الشروط مع السياسات والشروط الخاصة بالخدمات المدمجة فيها صراحة الاتفاق المنظم للمنصة وتحل محل الشروط العامة السابقة للمنصة في الموضوع ذاته.",
    ],
  },
  {
    id: "language",
    title: "42. النسختان العربية والإنجليزية",
    paragraphs: [
      "قد توفر داريك هذه الشروط بالعربية والإنجليزية لتسهيل الوصول، ويقصد من النسختين التعبير عن الاتفاق ذاته.",
      "في حال وجود تعارض بين النسختين، تسود النسخة العربية بالقدر الذي يسمح به القانون، ما لم تفرض قاعدة قانونية آمرة خلاف ذلك.",
    ],
  },
  {
    id: "contact",
    title: "43. التواصل والإشعارات القانونية",
    paragraphs: [
      "يمكن إرسال الأسئلة والشكاوى والإشعارات القانونية وطلبات الخصوصية أو البلاغات المتعلقة بهذه الشروط من خلال صفحة دعم داريك أو قنوات الدعم المنشورة.",
      "قناة الدعم الأساسية الحالية: WhatsApp على الرقم +962 79 300 9420.",
      "عند التواصل بشأن معاملة بيع، يرجى تضمين اسم المتجر ومعلومات الطلب ووصف المشكلة والأدلة المناسبة. ولا ترسل كلمات المرور أو بيانات حساسة غير ضرورية.",
    ],
  },
];

function TermsLanguage({
  language,
  title,
  subtitle,
  updated,
  sections,
}: {
  language: "en" | "ar";
  title: string;
  subtitle: string;
  updated: string;
  sections: readonly TermsSection[];
}) {
  const isArabic = language === "ar";
  const prefix = isArabic ? "ar" : "en";

  return (
    <section
      id={prefix}
      dir={isArabic ? "rtl" : "ltr"}
      className={isArabic ? styles.arabicSection : undefined}
    >
      <header className={`${styles.hero} ${styles.termsHero333}`}>
        <div className={styles.termsHeroTop333}>
          <p className={styles.eyebrow}>{updated}</p>
          <span className={styles.termsVersion333}>VERSION 333</span>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <div className={styles.roleNotice333}>
          <strong>
            {isArabic
              ? "داريك هي المنصة. التاجر هو البائع."
              : "Darik is the platform. The Retailer is the seller."}
          </strong>
          <p>
            {isArabic
              ? "عندما يشتري العميل منتجاً مدرجاً من متجر مستقل على داريك، تكون معاملة الشراء بين العميل وذلك المتجر. توفر داريك التقنية ولا تصبح بائع المنتج لمجرد ظهور المعاملة على المنصة."
              : "When a Customer purchases a listed Product from an independent store on Darik, the purchase is between the Customer and that store. Darik provides the technology and does not become the Product seller merely because the transaction appears on the Platform."}
          </p>
        </div>
      </header>

      <div className={styles.termsLayout333}>
        <aside className={styles.termsToc333}>
          <div>
            <span>{isArabic ? "محتويات الشروط" : "TERMS CONTENTS"}</span>
            <nav aria-label={isArabic ? "فهرس الشروط" : "Terms table of contents"}>
              {sections.map((section) => (
                <a key={section.id} href={`#${prefix}-${section.id}`}>
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className={styles.termsContent333}>
          <div className={styles.legalGuard333}>
            <strong>
              {isArabic
                ? "ملاحظة حول الحقوق القانونية"
                : "Important legal-rights notice"}
            </strong>
            <p>
              {isArabic
                ? "تهدف هذه الشروط إلى توزيع المسؤولية بوضوح بين داريك والتاجر والعميل، ولا تهدف إلى إلغاء حقوق أو مسؤوليات لا يسمح القانون الأردني بالتنازل عنها."
                : "These Terms are designed to allocate responsibility clearly among Darik, the Retailer, and the Customer. They do not attempt to eliminate rights or liabilities that Jordanian law does not allow the parties to waive."}
            </p>
          </div>

          {sections.map((section) => (
            <section
              className={styles.legalSection333}
              id={`${prefix}-${section.id}`}
              key={section.id}
            >
              <h2>{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              {section.note ? (
                <div className={styles.clauseNotice333}>
                  <strong>{section.note}</strong>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DarikTermsPage() {
  return (
    <main className={`${styles.page} ${styles.termsPage333}`}>
      <article className={`${styles.shell} ${styles.termsShell333}`}>
        <div className={styles.brandRow}>
          <Link href="/" className={styles.termsBrand333}>
            <img src="/darik_logo_final_v2.png" alt="Darik" />
          </Link>
          <div className={styles.termsHeaderActions333}>
            <a href="#en">English</a>
            <a href="#ar">العربية</a>
            <span className={styles.badge}>Terms / الشروط</span>
          </div>
        </div>

        <TermsLanguage
          language="en"
          updated="LAST UPDATED AUGUST 27, 2026"
          title="Terms of Use"
          subtitle="Platform, marketplace, customer, retailer, storefront, order, delivery, digital-service, and transaction terms for Darik."
          sections={englishSections}
        />

        <div className={styles.languageDivider} id="arabic">
          <span>العربية</span>
        </div>

        <TermsLanguage
          language="ar"
          updated="آخر تحديث: 27 أغسطس 2026"
          title="شروط الاستخدام"
          subtitle="شروط المنصة والسوق والعملاء والتجار وواجهات المتاجر والطلبات والتوصيل والخدمات الرقمية والمعاملات على داريك."
          sections={arabicSections}
        />

        <div className={styles.termsLawyerNotice333}>
          <strong>Legal review / مراجعة قانونية</strong>
          <p>
            These Terms are a comprehensive platform draft designed for Darik’s
            operating model. Darik should have Jordanian commercial/e-commerce
            counsel review the final deployed version for entity details,
            enforceability, tax treatment, consumer-law requirements, and any
            regulated-product categories before relying on it as final legal
            advice.
          </p>
          <p dir="rtl">
            هذه الشروط مسودة شاملة مصممة لنموذج عمل داريك. وينبغي مراجعة النسخة
            النهائية من محامٍ أردني مختص بالقانون التجاري والتجارة الإلكترونية
            للتحقق من بيانات الكيان وقابلية التنفيذ والضرائب ومتطلبات حماية
            المستهلك وأي فئات منتجات منظمة قبل الاعتماد عليها كمشورة قانونية
            نهائية.
          </p>
        </div>

        <nav className={styles.footerLinks} aria-label="Legal links">
          <Link href="/privacy">Privacy / الخصوصية</Link>
          <Link href="/support">Support / الدعم</Link>
          <Link href="/how-it-works">How it works / كيف تعمل</Link>
          <Link href="/">GetDarik.com</Link>
        </nav>
      </article>
    </main>
  );
}
