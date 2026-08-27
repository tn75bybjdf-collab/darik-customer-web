"use client";

/* DARIK_PROMISE_BUYER_PROTECTION_PAGE_334 */

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./darik-promise.module.css";

type Language = "en" | "ar";
type IconName =
  | "arrow"
  | "check"
  | "balance"
  | "shield"
  | "search"
  | "store"
  | "support"
  | "wallet"
  | "warning";

const LANGUAGE_KEY = "darik_marketplace_language_v1";

const copy = {
  en: {
    language: "العربية",
    heroEyebrow: "BUYER PROTECTION · FAIR TO BOTH SIDES",
    heroTitle: "The Darik Promise",
    heroAccent: "Shop local with confidence.",
    heroBody:
      "If something goes wrong with an eligible Darik order, you are not left alone. Darik will hear both sides, review the evidence, and work toward a fair resolution.",
    fileClaim: "Report a problem",
    readTerms: "Read full Promise terms",
    proofOne: "Both sides are heard",
    proofTwo: "Evidence-based decisions",
    proofThree: "Retailer accountability",
    principleEyebrow: "THE PRINCIPLE",
    principleTitle: "We do not automatically side with the customer or the store.",
    principleBody:
      "A claim starts an investigation — not a punishment. Darik reviews the Customer’s evidence, gives the Retailer a fair opportunity to respond, and decides the Promise claim based on the available facts.",
    customerWins: "If the Customer is right",
    customerWinsBody:
      "The Retailer gets the first opportunity to make it right. If the Retailer refuses and the claim qualifies, Darik may step in using Darik’s own funds.",
    retailerWins: "If the Retailer is right",
    retailerWinsBody:
      "The claim is denied. The Retailer is not punished simply because a Customer opened a claim.",
    processEyebrow: "HOW IT WORKS",
    processTitle: "A fair process from complaint to resolution.",
    process: [
      {
        number: "01",
        icon: "support" as IconName,
        title: "Tell us what happened",
        body:
          "Open a claim through Darik Support and provide the Order details plus any relevant photos, messages, payment proof, or delivery evidence.",
      },
      {
        number: "02",
        icon: "balance" as IconName,
        title: "We hear both sides",
        body:
          "Darik reviews the Customer’s information and gives the Retailer a fair opportunity to respond and submit its own evidence.",
      },
      {
        number: "03",
        icon: "search" as IconName,
        title: "We investigate",
        body:
          "We may review listing details, platform records, payment proof, order history, communications, delivery records, photos, video, and other relevant evidence.",
      },
      {
        number: "04",
        icon: "shield" as IconName,
        title: "We make a Promise decision",
        body:
          "If the evidence supports the Retailer, the case ends with no punishment. If the evidence supports the Customer, we work to get the proper remedy.",
      },
    ],
    coverageEyebrow: "WHAT MAY BE COVERED",
    coverageTitle: "Protection for real order problems.",
    coverageBody:
      "The Darik Promise is designed for verifiable problems with genuine orders placed through Darik.",
    covered: [
      "You paid but the eligible Order was not delivered.",
      "You received a materially wrong Product.",
      "Paid items were materially missing from the Order.",
      "The Product had significant damage present at delivery.",
      "The Product was materially inconsistent with the Retailer’s listing.",
      "There is credible evidence of counterfeit or unauthorized merchandise.",
      "The Retailer refuses a refund or remedy it is legally or contractually required to provide.",
    ],
    notCoveredTitle: "What normally is not covered",
    notCovered: [
      "Simple change of mind when no return right exists.",
      "Damage caused after delivery by misuse or unauthorized modification.",
      "Transactions completed entirely outside Darik with no verifiable Darik Order.",
      "Indirect losses such as lost income, travel costs, time, or lost opportunity.",
      "Duplicate recovery where you already received a refund, chargeback, replacement, or other compensation.",
      "Claims that are false, manipulated, fraudulent, or cannot reasonably be verified.",
    ],
    makeWholeEyebrow: "WHAT “MAKE WHOLE” MEANS",
    makeWholeTitle: "We protect the verified purchase loss — not unrelated damages.",
    makeWholeBody:
      "If Darik decides to step in after an uncooperative Retailer fails to provide a required remedy, Darik may reimburse the verified amount actually paid for the affected Product or affected part of the Order, plus the Retailer-charged delivery fee attributable to that Order, minus anything already recovered.",
    amountLabel: "Example",
    amountPaid: "Customer paid",
    amountRefund: "Darik Promise payment",
    amountBalance: "Retailer reimbursement balance",
    exampleAmount: "75 JOD",
    accountabilityEyebrow: "RETAILER ACCOUNTABILITY",
    accountabilityTitle: "Cooperate and resolve it. Refuse and Darik can step in.",
    accountabilityBody:
      "The Promise is designed to reward responsible stores and remove bad actors — not punish legitimate Retailers over one disagreement.",
    accountability: [
      {
        label: "Retailer wins",
        title: "No action against the store",
        body:
          "If the evidence supports the Retailer, Darik denies the claim and takes no adverse action solely because the claim was filed.",
      },
      {
        label: "Customer wins · Retailer cooperates",
        title: "Fix the problem and move forward",
        body:
          "If the Retailer gives the required refund, replacement, correction, or other remedy, the case can close without suspension solely because it lost that claim.",
      },
      {
        label: "Customer wins · Retailer refuses",
        title: "Darik may protect the Customer",
        body:
          "If Darik pays the Customer from Darik’s own funds, the Retailer owes Darik exactly what Darik paid on its behalf and may be suspended until that reimbursement balance is paid.",
      },
      {
        label: "Fraud / repeat abuse",
        title: "Permanent removal is possible",
        body:
          "Counterfeit goods, safety violations, falsified evidence, fraud, repeated substantiated claims, or serious refusal to cooperate can lead to a permanent ban even after reimbursement.",
      },
    ],
    reimbursementEyebrow: "NOT A PUNITIVE FEE",
    reimbursementTitle: "Reimbursement required before reactivation.",
    reimbursementBody:
      "If Darik pays 75 JOD to make a Customer whole because a Retailer refused a responsibility Darik determined belonged to that Retailer, the Retailer’s Darik Promise Reimbursement Balance is 75 JOD. It is reimbursement of Darik’s actual loss — not an arbitrary penalty.",
    reactivationNote:
      "Paying the balance does not guarantee reactivation. Serious or repeated misconduct can still result in permanent removal.",
    fairnessEyebrow: "PROTECTION AGAINST FALSE CLAIMS",
    fairnessTitle: "Retailers are protected too.",
    fairnessBody:
      "Customers must cooperate honestly. Knowingly false, manipulated, duplicate, or fraudulent claims can be denied, recovered, and may lead to Customer account restrictions or removal.",
    legalEyebrow: "WHAT THE PROMISE IS — AND ISN’T",
    legalTitle: "Extra marketplace protection. Not insurance.",
    legalBody:
      "The Darik Promise is a customer-service and dispute-resolution program. It does not make Darik the seller of Retailer Products and it is not insurance, escrow, a bank account, a payment service, or a guarantee of every transaction.",
    legalRights:
      "A Darik Promise decision determines only Promise benefits and Platform action. It does not stop a Customer or Retailer from using courts, regulators, consumer-protection authorities, or other rights available under Jordanian law.",
    faqEyebrow: "COMMON QUESTIONS",
    faqTitle: "Straight answers.",
    faq: [
      {
        q: "Is Darik the seller because it offers buyer protection?",
        a: "No. The Retailer remains the seller of its Products. Darik provides the marketplace technology and an additional customer-protection process.",
      },
      {
        q: "Does every complaint get refunded?",
        a: "No. Every qualifying complaint is reviewed based on evidence. A Retailer that is supported by the evidence is not punished.",
      },
      {
        q: "How quickly must the Retailer respond?",
        a: "The normal response period is 3 business days after Darik requests a response, although urgent safety, fraud, or technical cases may require a different timeline.",
      },
      {
        q: "How much can Darik reimburse?",
        a: "For a voluntary Promise payment, Darik generally caps the amount at the verified purchase amount for the affected item(s) or affected portion of the Order plus the applicable Retailer-charged delivery fee, minus amounts already recovered.",
      },
      {
        q: "What happens if a Retailer refuses to reimburse Darik?",
        a: "The Retailer may remain suspended. Darik may also permanently remove stores for serious or repeated misconduct.",
      },
      {
        q: "Can I still go to court or Consumer Protection?",
        a: "Yes. The Darik Promise does not replace mandatory legal rights or prevent either party from using lawful external remedies.",
      },
    ],
    finalEyebrow: "NEED HELP WITH AN ORDER?",
    finalTitle: "Tell us what happened.",
    finalBody:
      "Have your Order information and evidence ready. Darik Support can start the Promise review process.",
    finalPrimary: "Contact Darik Support",
    finalSecondary: "Read Terms of Use",
    footer: "The Darik Promise is subject to eligibility, investigation, evidence, the Terms of Use, and applicable law.",
  },
  ar: {
    language: "English",
    heroEyebrow: "حماية المشتري · وعدالة للطرفين",
    heroTitle: "وعد داريك",
    heroAccent: "تسوق محلي بثقة.",
    heroBody:
      "إذا صار خطأ في طلب مؤهل على داريك، ما بنتركك لحالك. داريك تسمع من الطرفين، تراجع الأدلة، وتعمل للوصول إلى حل عادل.",
    fileClaim: "بلّغ عن مشكلة",
    readTerms: "اقرأ شروط الوعد كاملة",
    proofOne: "نسمع من الطرفين",
    proofTwo: "القرار مبني على الأدلة",
    proofThree: "مساءلة التاجر",
    principleEyebrow: "المبدأ",
    principleTitle: "ما بنفترض تلقائياً إن الزبون صح أو المتجر غلط.",
    principleBody:
      "فتح المطالبة يعني بدء تحقيق، مش عقوبة. داريك تراجع أدلة العميل وتعطي التاجر فرصة عادلة للرد ثم تقرر بناءً على الوقائع المتوفرة.",
    customerWins: "إذا كان العميل معه حق",
    customerWinsBody:
      "نعطي التاجر أول فرصة لتصحيح المشكلة. إذا رفض التاجر وكانت المطالبة مؤهلة، يجوز لداريك التدخل من أموالها الخاصة.",
    retailerWins: "إذا كان التاجر معه حق",
    retailerWinsBody:
      "ترفض المطالبة ولا يعاقب التاجر فقط لأن العميل فتح شكوى.",
    processEyebrow: "كيف يعمل",
    processTitle: "إجراء عادل من الشكوى حتى الحل.",
    process: [
      {
        number: "01",
        icon: "support" as IconName,
        title: "احكيلنا شو صار",
        body:
          "افتح مطالبة من خلال دعم داريك وأرسل معلومات الطلب وأي صور أو رسائل أو إثبات دفع أو توصيل لها علاقة بالمشكلة.",
      },
      {
        number: "02",
        icon: "balance" as IconName,
        title: "نسمع من الطرفين",
        body:
          "داريك تراجع معلومات العميل وتعطي التاجر فرصة عادلة للرد وتقديم الأدلة الخاصة فيه.",
      },
      {
        number: "03",
        icon: "search" as IconName,
        title: "نحقق",
        body:
          "قد نراجع وصف المنتج وسجلات المنصة وإثبات الدفع وتاريخ الطلب والرسائل وسجلات التوصيل والصور والفيديو وأي دليل مناسب.",
      },
      {
        number: "04",
        icon: "shield" as IconName,
        title: "نتخذ قرار وعد داريك",
        body:
          "إذا الأدلة مع التاجر تنتهي القضية بدون عقوبة. وإذا الأدلة مع العميل نعمل للحصول على المعالجة الصحيحة.",
      },
    ],
    coverageEyebrow: "شو ممكن يشمله الوعد",
    coverageTitle: "حماية لمشاكل الطلب الحقيقية.",
    coverageBody:
      "وعد داريك مصمم للمشاكل التي يمكن التحقق منها في الطلبات الحقيقية التي تمت عبر داريك.",
    covered: [
      "دفعت ولم يتم توصيل الطلب المؤهل.",
      "استلمت منتجاً مختلفاً بصورة جوهرية.",
      "كان هناك نقص جوهري في منتجات دفعت ثمنها.",
      "كان المنتج متضرراً بشكل واضح عند التسليم.",
      "كان المنتج مختلفاً بصورة جوهرية عن وصف التاجر.",
      "توجد أدلة موثوقة على منتج مقلد أو غير مصرح به.",
      "رفض التاجر استرداداً أو معالجة ملزم بها قانوناً أو تعاقدياً.",
    ],
    notCoveredTitle: "ما لا يشمله الوعد عادة",
    notCovered: [
      "تغيير الرأي فقط عندما لا يوجد حق إرجاع.",
      "ضرر حدث بعد التسليم بسبب سوء الاستخدام أو تعديل غير مصرح به.",
      "معاملة تمت بالكامل خارج داريك ولا يوجد لها طلب يمكن التحقق منه.",
      "خسائر غير مباشرة مثل الدخل الضائع أو تكاليف التنقل أو الوقت أو الفرص.",
      "تعويض مكرر بعد حصولك على استرداد أو اعتراض دفع أو بديل أو تعويض آخر.",
      "مطالبات كاذبة أو معدلة أو احتيالية أو لا يمكن التحقق منها بصورة معقولة.",
    ],
    makeWholeEyebrow: "شو يعني نعوضك",
    makeWholeTitle: "نحمي خسارة الشراء المثبتة، مش أضرار ما إلها علاقة.",
    makeWholeBody:
      "إذا قررت داريك التدخل بعد رفض التاجر تقديم المعالجة المطلوبة، يجوز لداريك تعويض المبلغ المثبت المدفوع فعلياً للمنتج المتأثر أو الجزء المتأثر من الطلب، مع رسوم توصيل التاجر المرتبطة بالطلب، بعد خصم أي مبلغ تم استرداده.",
    amountLabel: "مثال",
    amountPaid: "العميل دفع",
    amountRefund: "دفعة وعد داريك",
    amountBalance: "رصيد تعويض التاجر",
    exampleAmount: "75 دينار",
    accountabilityEyebrow: "مساءلة التاجر",
    accountabilityTitle: "تعاون وحل المشكلة. ارفض وداريك ممكن تتدخل.",
    accountabilityBody:
      "الوعد مصمم لمكافأة المتاجر المسؤولة وإزالة المسيئين، مش لمعاقبة تاجر محترم بسبب خلاف واحد.",
    accountability: [
      {
        label: "التاجر يفوز بالمطالبة",
        title: "لا إجراء ضد المتجر",
        body:
          "إذا الأدلة تدعم التاجر، ترفض داريك المطالبة ولا تتخذ إجراء سلبياً فقط بسبب تقديم الشكوى.",
      },
      {
        label: "العميل يفوز · التاجر يتعاون",
        title: "صلح المشكلة وكمل",
        body:
          "إذا قدم التاجر الاسترداد أو الاستبدال أو التصحيح المطلوب، يمكن إغلاق القضية بدون تعليق لمجرد خسارته المطالبة.",
      },
      {
        label: "العميل يفوز · التاجر يرفض",
        title: "داريك ممكن تحمي العميل",
        body:
          "إذا دفعت داريك للعميل من أموالها، يصبح على التاجر بالضبط المبلغ الذي دفعته داريك نيابة عنه، ويمكن تعليقه حتى يتم السداد.",
      },
      {
        label: "احتيال أو تكرار الإساءة",
        title: "الحظر الدائم ممكن",
        body:
          "البضائع المقلدة ومشاكل السلامة وتزوير الأدلة والاحتيال وتكرار الشكاوى المثبتة أو رفض التعاون الخطير ممكن يؤدي لحظر دائم حتى بعد السداد.",
      },
    ],
    reimbursementEyebrow: "مش غرامة",
    reimbursementTitle: "السداد مطلوب قبل إعادة التفعيل.",
    reimbursementBody:
      "إذا دفعت داريك 75 دينار لتعويض عميل لأن التاجر رفض مسؤولية قررت داريك أنها تقع عليه، يصبح رصيد تعويض وعد داريك على التاجر 75 دينار. هذا استرداد لخسارة داريك الفعلية، مش غرامة عشوائية.",
    reactivationNote:
      "دفع الرصيد لا يضمن إعادة التفعيل. المخالفات الخطيرة أو المتكررة ممكن تؤدي لحظر دائم.",
    fairnessEyebrow: "حماية من المطالبات الكاذبة",
    fairnessTitle: "التاجر محمي كمان.",
    fairnessBody:
      "العميل لازم يتعاون بصدق. المطالبة الكاذبة أو المعدلة أو المكررة أو الاحتيالية ممكن تنرفض ويتم استرداد أي مبلغ غير مستحق وتقييد أو إنهاء حساب العميل.",
    legalEyebrow: "شو هو الوعد وشو مش هو",
    legalTitle: "حماية إضافية من المنصة. مش تأمين.",
    legalBody:
      "وعد داريك برنامج لخدمة العملاء وتسوية النزاعات. ما بخلي داريك بائع منتجات التجار، ومش تأمين أو حساب ضمان أو بنك أو خدمة دفع أو ضمان لكل معاملة.",
    legalRights:
      "قرار وعد داريك يحدد فقط الاستفادة من البرنامج وإجراءات المنصة. وما بمنع العميل أو التاجر من المحاكم أو الجهات التنظيمية أو حماية المستهلك أو أي حقوق قانونية أخرى.",
    faqEyebrow: "أسئلة شائعة",
    faqTitle: "إجابات واضحة.",
    faq: [
      {
        q: "هل داريك بتصير البائع لأنها بتقدم حماية للمشتري؟",
        a: "لا. التاجر يبقى بائع منتجاته. داريك توفر تقنية السوق وعملية إضافية لحماية العملاء.",
      },
      {
        q: "هل كل شكوى عليها استرداد؟",
        a: "لا. كل مطالبة مؤهلة تراجع حسب الأدلة. إذا الأدلة مع التاجر ما بنعاقبه.",
      },
      {
        q: "كم عند التاجر وقت للرد؟",
        a: "المدة العادية 3 أيام عمل بعد طلب داريك للرد، وقد تختلف في حالات السلامة أو الاحتيال أو الحالات التقنية العاجلة.",
      },
      {
        q: "كم ممكن تدفع داريك؟",
        a: "عادة يكون الحد الاختياري هو المبلغ المثبت للمنتج المتأثر أو الجزء المتأثر من الطلب مع رسوم التوصيل الخاصة بالطلب، بعد خصم أي مبالغ تم استردادها.",
      },
      {
        q: "شو بصير إذا التاجر رفض يسدد داريك؟",
        a: "ممكن يظل التاجر معلقاً. وداريك ممكن تحظر المتاجر نهائياً في المخالفات الخطيرة أو المتكررة.",
      },
      {
        q: "بقدر أروح للمحكمة أو حماية المستهلك؟",
        a: "نعم. وعد داريك ما بلغي الحقوق القانونية الآمرة ولا يمنع أي طرف من استخدام الوسائل القانونية المتاحة.",
      },
    ],
    finalEyebrow: "عندك مشكلة بطلب؟",
    finalTitle: "احكيلنا شو صار.",
    finalBody:
      "جهز معلومات الطلب والأدلة. دعم داريك يقدر يبدأ مراجعة وعد داريك.",
    finalPrimary: "تواصل مع دعم داريك",
    finalSecondary: "اقرأ شروط الاستخدام",
    footer: "وعد داريك يخضع للأهلية والتحقيق والأدلة وشروط الاستخدام والقانون المعمول به.",
  },
} as const;

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }
  if (name === "balance") {
    return (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M5 6h14" />
        <path d="m6 6-3 6h6L6 6Z" />
        <path d="m18 6-3 6h6l-3-6Z" />
        <path d="M8 21h8" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3 5 6v5c0 4.7 2.8 8.3 7 10 4.2-1.7 7-5.3 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 4.5 4.5" />
      </svg>
    );
  }
  if (name === "store") {
    return (
      <svg {...common}>
        <path d="M4 10v10h16V10" />
        <path d="M3 10 5 4h14l2 6" />
        <path d="M8 20v-6h8v6" />
      </svg>
    );
  }
  if (name === "wallet") {
    return (
      <svg {...common}>
        <path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6h2Z" />
        <path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z" />
      </svg>
    );
  }
  if (name === "warning") {
    return (
      <svg {...common}>
        <path d="M12 4 3 20h18L12 4Z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 9.5a3.5 3.5 0 1 1 5.6 2.8c-1.1.8-2.1 1.4-2.1 2.7" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export default function DarikPromisePage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    if (stored === "ar" || stored === "en") {
      setLanguage(stored);
      return;
    }
    if (navigator.language.toLowerCase().startsWith("ar")) {
      setLanguage("ar");
    }
  }, []);

  function toggleLanguage() {
    const next: Language = language === "en" ? "ar" : "en";
    setLanguage(next);
    window.localStorage.setItem(LANGUAGE_KEY, next);
  }

  const t = copy[language];

  return (
    <main className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div className={styles.shell}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.brand}>
              <img src="/darik_logo_final_v2.png" alt="Darik" />
            </Link>
            <nav>
              <Link href="/">{language === "ar" ? "المتاجر" : "Stores"}</Link>
              <Link href="/how-it-works">
                {language === "ar" ? "كيف تعمل" : "How it works"}
              </Link>
              <Link href="/pricing">
                {language === "ar" ? "الأسعار" : "Pricing"}
              </Link>
              <Link className={styles.active} href="/darik-promise">
                {language === "ar" ? "وعد داريك" : "Darik Promise"}
              </Link>
            </nav>
            <button type="button" onClick={toggleLanguage}>
              {t.language}
            </button>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <span />
                {t.heroEyebrow}
              </div>
              <h1>
                <span>{t.heroTitle}</span>
                <strong>{t.heroAccent}</strong>
              </h1>
              <p>{t.heroBody}</p>
              <div className={styles.heroActions}>
                <Link className={styles.primary} href="/support">
                  {t.fileClaim}
                  <Icon name="arrow" size={18} />
                </Link>
                <Link className={styles.secondary} href="/terms#en-darik-promise">
                  {t.readTerms}
                </Link>
              </div>
              <div className={styles.heroProof}>
                {[t.proofOne, t.proofTwo, t.proofThree].map((item) => (
                  <span key={item}>
                    <i><Icon name="check" size={12} /></i>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.promiseSeal}>
              <div className={styles.sealOuter}>
                <div className={styles.sealInner}>
                  <Icon name="shield" size={48} />
                  <span>DARIK</span>
                  <strong>PROMISE</strong>
                  <small>BUYER PROTECTION</small>
                </div>
              </div>
              <div className={styles.sealCard}>
                <span>01</span>
                <p>{language === "ar" ? "العدالة قبل العقوبة" : "Fairness before punishment"}</p>
              </div>
              <div className={styles.sealCard}>
                <span>02</span>
                <p>{language === "ar" ? "الأدلة قبل القرار" : "Evidence before decisions"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div className={styles.eyebrow}><span />{t.principleEyebrow}</div>
            <h2>{t.principleTitle}</h2>
            <p>{t.principleBody}</p>
          </div>
          <div className={styles.twoCards}>
            <article className={styles.outcomeGood}>
              <span><Icon name="shield" size={22} /></span>
              <h3>{t.customerWins}</h3>
              <p>{t.customerWinsBody}</p>
            </article>
            <article className={styles.outcomeNeutral}>
              <span><Icon name="store" size={22} /></span>
              <h3>{t.retailerWins}</h3>
              <p>{t.retailerWinsBody}</p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div className={styles.eyebrow}><span />{t.processEyebrow}</div>
            <h2>{t.processTitle}</h2>
          </div>
          <div className={styles.processGrid}>
            {t.process.map((step) => (
              <article key={step.number}>
                <div className={styles.stepTop}>
                  <span>{step.number}</span>
                  <i><Icon name={step.icon} size={22} /></i>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.coverageGrid}>
            <div>
              <div className={styles.eyebrow}><span />{t.coverageEyebrow}</div>
              <h2>{t.coverageTitle}</h2>
              <p>{t.coverageBody}</p>
              <div className={styles.checkList}>
                {t.covered.map((item) => (
                  <div key={item}>
                    <span><Icon name="check" size={13} /></span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.exclusionCard}>
              <span className={styles.warningIcon}><Icon name="warning" size={23} /></span>
              <h3>{t.notCoveredTitle}</h3>
              <div>
                {t.notCovered.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.shell}>
          <div className={styles.makeWholeGrid}>
            <div>
              <div className={styles.eyebrowLight}><span />{t.makeWholeEyebrow}</div>
              <h2>{t.makeWholeTitle}</h2>
              <p>{t.makeWholeBody}</p>
            </div>
            <div className={styles.moneyCard}>
              <small>{t.amountLabel}</small>
              {[
                [t.amountPaid, t.exampleAmount],
                [t.amountRefund, t.exampleAmount],
                [t.amountBalance, t.exampleAmount],
              ].map(([label, value], index) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  {index === 1 ? <i><Icon name="shield" size={14} /></i> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div className={styles.eyebrow}><span />{t.accountabilityEyebrow}</div>
            <h2>{t.accountabilityTitle}</h2>
            <p>{t.accountabilityBody}</p>
          </div>
          <div className={styles.accountabilityGrid}>
            {t.accountability.map((item, index) => (
              <article key={item.label}>
                <span>0{index + 1}</span>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.shell}>
          <div className={styles.reimbursementCard}>
            <span className={styles.walletIcon}><Icon name="wallet" size={26} /></span>
            <div>
              <div className={styles.eyebrow}><span />{t.reimbursementEyebrow}</div>
              <h2>{t.reimbursementTitle}</h2>
              <p>{t.reimbursementBody}</p>
              <small>{t.reactivationNote}</small>
            </div>
          </div>

          <div className={styles.fairnessCard}>
            <div>
              <div className={styles.eyebrow}><span />{t.fairnessEyebrow}</div>
              <h2>{t.fairnessTitle}</h2>
              <p>{t.fairnessBody}</p>
            </div>
            <Icon name="balance" size={54} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.legalCard}>
            <span><Icon name="shield" size={31} /></span>
            <div>
              <div className={styles.eyebrow}><span />{t.legalEyebrow}</div>
              <h2>{t.legalTitle}</h2>
              <p>{t.legalBody}</p>
              <p>{t.legalRights}</p>
              <Link href="/terms#en-darik-promise">
                {t.readTerms}
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`}>
        <div className={styles.shell}>
          <div className={styles.faqLayout}>
            <div>
              <div className={styles.eyebrow}><span />{t.faqEyebrow}</div>
              <h2>{t.faqTitle}</h2>
            </div>
            <div className={styles.faqList}>
              {t.faq.map((item, index) => (
                <details key={item.q} open={index === 0}>
                  <summary><span>{item.q}</span><i>+</i></summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.shell}>
          <div className={styles.finalCta}>
            <div>
              <div className={styles.eyebrowLight}><span />{t.finalEyebrow}</div>
              <h2>{t.finalTitle}</h2>
              <p>{t.finalBody}</p>
            </div>
            <div>
              <Link href="/support">
                {t.finalPrimary}
                <Icon name="arrow" size={17} />
              </Link>
              <Link href="/terms#en-darik-promise">{t.finalSecondary}</Link>
            </div>
          </div>
          <p className={styles.footerNote}>{t.footer}</p>
        </div>
      </section>
    </main>
  );
}
