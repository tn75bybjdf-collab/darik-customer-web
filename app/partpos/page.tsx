"use client";

import { createClient } from "@supabase/supabase-js";
import { useMemo, useState } from "react";

type PartPOSProduct = {
  id: string;
  product_key: string;
  product_name_ar: string;
  department_ar: string;
  cost: number;
  price: number;
};

type POSRow = {
  lineId: string;
  productName: string;
  department: string;
  cost: string;
  basePrice: string;
  price: string; // Editable sale price for this customer only.
  quantity: string;
  total: string;
  savedProductId?: string;
  saveStatus?: "idle" | "saving" | "saved" | "error";
  errorMessage?: string;
};

type MarginPopup = {
  productName: string;
  marginPercent: string;
  currentPrice: string;
  originalPrice: string;
  discountPercent: string;
};

const MARGIN = 0.3;
const DEFAULT_PIN = "079300";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyRow(): POSRow {
  return {
    lineId: makeId(),
    productName: "",
    department: "",
    cost: "",
    basePrice: "",
    price: "",
    quantity: "1",
    total: "",
    saveStatus: "idle",
  };
}

function normalizeArabicText(value: string) {
  return value
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function parseMoney(value: string) {
  const cleaned = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function priceFromThirtyPercentMargin(cost: number) {
  if (!cost || cost <= 0) return 0;
  return cost / (1 - MARGIN); // margin, not markup. Example: 10 / 0.70 = 14.2857
}

function money(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "";
  return (Math.ceil(value * 100) / 100).toFixed(2);
}

function rowHasInput(row: POSRow) {
  return Boolean(
    row.productName.trim() ||
    row.department.trim() ||
    row.cost.trim() ||
    row.price.trim() ||
    (row.quantity.trim() && row.quantity.trim() !== "1"),
  );
}

function rowQuantity(row: POSRow) {
  const quantityText = row.quantity.trim();
  if (!quantityText) return 1;

  const quantity = parseMoney(quantityText);
  return quantity > 0 ? quantity : 0;
}

function rowLineTotal(row: POSRow) {
  const price = parseMoney(row.price);
  const quantity = rowQuantity(row);

  if (price <= 0 || quantity <= 0) return 0;
  return price * quantity;
}

function rowLineTotalText(row: POSRow) {
  const total = rowLineTotal(row);
  return total > 0 ? money(total) || "0.00" : "";
}

function rowBasePrice(row: POSRow) {
  const savedBase = parseMoney(row.basePrice);
  if (savedBase > 0) return savedBase;

  const cost = parseMoney(row.cost);
  return priceFromThirtyPercentMargin(cost);
}

function rowIsSaveReady(row: POSRow) {
  return Boolean(
    row.productName.trim() &&
    row.department.trim() &&
    parseMoney(row.cost) > 0 &&
    rowBasePrice(row) > 0,
  );
}

function rowIsCashoutReady(row: POSRow) {
  return Boolean(
    row.productName.trim() &&
    row.department.trim() &&
    parseMoney(row.cost) > 0 &&
    parseMoney(row.price) > 0 &&
    rowQuantity(row) > 0,
  );
}

function discountPercentNumber(row: POSRow) {
  const base = rowBasePrice(row);
  const current = parseMoney(row.price);

  if (base <= 0 || current <= 0 || current >= base) return 0;

  return ((base - current) / base) * 100;
}

function discountPercent(row: POSRow) {
  const percent = discountPercentNumber(row);
  return percent > 0 ? `${percent.toFixed(1)}%` : "";
}

function marginPercentNumber(row: POSRow) {
  const cost = parseMoney(row.cost);
  const currentPrice = parseMoney(row.price);

  if (currentPrice <= 0) return 0;

  return ((currentPrice - cost) / currentPrice) * 100;
}

function percentText(value: number) {
  if (!Number.isFinite(value)) return "0.0%";
  return `${value.toFixed(1)}%`;
}

export default function PartPOSPage() {
  const [rows, setRows] = useState<POSRow[]>([emptyRow(), emptyRow()]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<PartPOSProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [cashoutStatus, setCashoutStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [cashoutMessage, setCashoutMessage] = useState("");
  const [marginPopup, setMarginPopup] = useState<MarginPopup | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinEntry, setPinEntry] = useState("");
  const [pinError, setPinError] = useState("");
  const [lockNotice, setLockNotice] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
  }, []);

  function handlePinChange(value: string) {
    const cleanValue = value.replace(/\D/g, "").slice(0, DEFAULT_PIN.length);

    setPinEntry(cleanValue);
    setPinError("");

    if (cleanValue.length !== DEFAULT_PIN.length) return;

    if (cleanValue === DEFAULT_PIN) {
      setIsUnlocked(true);
      setPinEntry("");
      setPinError("");
      setLockNotice("");
      setCashoutStatus("idle");
      setCashoutMessage("");
      return;
    }

    setPinEntry("");
    setPinError("الرمز غير صحيح، حاول مرة أخرى.");
  }

  function addPinDigit(digit: string) {
    if (pinEntry.length >= DEFAULT_PIN.length) return;
    handlePinChange(`${pinEntry}${digit}`);
  }

  function deletePinDigit() {
    setPinEntry((current) => current.slice(0, -1));
    setPinError("");
  }

  function lockPOSAfterSale() {
    setIsUnlocked(false);
    setPinEntry("");
    setPinError("");
    setLockNotice("تم إتمام البيع. أدخل الرمز لفتح فاتورة جديدة.");
  }

  const saleRows = rows.filter(rowIsCashoutReady);
  const saleTotal = saleRows.reduce((sum, row) => sum + rowLineTotal(row), 0);
  const paidAmount = parseMoney(cashReceived);
  const changeDue = Math.max(paidAmount - saleTotal, 0);
  const remainingDue = Math.max(saleTotal - paidAmount, 0);
  const canCashOut = Boolean(
    supabase &&
    saleTotal > 0 &&
    paidAmount >= saleTotal &&
    cashoutStatus !== "saving" &&
    cashoutStatus !== "success",
  );

  async function saveProductAndReturnId(row: POSRow) {
    if (!supabase || !rowIsSaveReady(row)) return row.savedProductId ?? null;

    const productKey = normalizeArabicText(row.productName);
    const savedPrice = rowBasePrice(row);

    const payload = {
      product_key: productKey,
      product_name_ar: row.productName.trim(),
      department_ar: row.department.trim(),
      cost: parseMoney(row.cost),
      price: savedPrice,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("partpos_products")
      .upsert(payload, { onConflict: "product_key" })
      .select("id")
      .single();

    if (error) throw error;

    return data?.id ?? row.savedProductId ?? null;
  }

  function updateRow(index: number, field: keyof POSRow, value: string) {
    setCashoutStatus("idle");
    setCashoutMessage("");

    setRows((current) => {
      const next = current.map((row, rowIndex) => {
        if (rowIndex !== index) return row;

        const updated: POSRow = {
          ...row,
          [field]: value,
          saveStatus:
            field === "price" || field === "quantity" ? row.saveStatus : "idle",
          errorMessage: "",
        };

        if (field === "cost") {
          const cost = parseMoney(value);
          const calculatedPrice =
            cost > 0 ? money(priceFromThirtyPercentMargin(cost)) : "";

          // Store the original calculated price separately, then copy it into
          // the editable sale price. Later edits to sale price will not overwrite
          // this saved base price.
          updated.basePrice = calculatedPrice;
          updated.price = calculatedPrice;
        }

        updated.total = rowLineTotalText(updated);

        return updated;
      });

      if (index === next.length - 1 && rowHasInput(next[index])) {
        next.push(emptyRow());
      }

      return next.length < 2 ? [emptyRow(), emptyRow()] : next;
    });
  }

  function showManualPricePopup(index: number) {
    const row = rows[index];
    if (!row) return;

    const originalPrice = rowBasePrice(row);
    const currentPrice = parseMoney(row.price);

    // Only show the popup when the cashier manually changed the row price away
    // from the saved calculated price. Cost auto-calculation will not trigger this.
    if (originalPrice <= 0 || currentPrice <= 0) return;
    if (Math.abs(currentPrice - originalPrice) < 0.005) return;

    setMarginPopup({
      productName: row.productName.trim() || "منتج بدون اسم",
      marginPercent: percentText(marginPercentNumber(row)),
      currentPrice: money(currentPrice) || "0.00",
      originalPrice: money(originalPrice) || "0.00",
      discountPercent: discountPercent(row) || "0.0%",
    });
  }

  async function searchProducts(value: string) {
    setSearch(value);
    setSearchError("");

    const term = value.trim();
    if (!supabase || term.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    const { data, error } = await supabase
      .from("partpos_products")
      .select("id, product_key, product_name_ar, department_ar, cost, price")
      .or(`product_name_ar.ilike.%${term}%,department_ar.ilike.%${term}%`)
      .order("updated_at", { ascending: false })
      .limit(10);

    setIsSearching(false);

    if (error) {
      setSearchError(error.message);
      setSuggestions([]);
      return;
    }

    setSuggestions(data ?? []);
  }

  function addSavedProduct(product: PartPOSProduct) {
    setCashoutStatus("idle");
    setCashoutMessage("");

    const savedPrice = money(Number(product.price));

    setRows((current) => {
      const firstBlankIndex = current.findIndex((row) => !rowHasInput(row));
      const targetIndex =
        firstBlankIndex >= 0 ? firstBlankIndex : current.length;
      const next = [...current];

      next[targetIndex] = {
        lineId: makeId(),
        productName: product.product_name_ar,
        department: product.department_ar,
        cost: money(Number(product.cost)),
        basePrice: savedPrice,
        price: savedPrice,
        quantity: "1",
        total: savedPrice,
        savedProductId: product.id,
        saveStatus: "saved",
      };

      if (targetIndex === next.length - 1) {
        next.push(emptyRow());
      }

      while (next.length < 2) next.push(emptyRow());
      return next;
    });

    setSearch("");
    setSuggestions([]);
  }

  function escapeReceiptText(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildReceiptHtml(args: {
    saleNumber?: number | string | null;
    createdAt?: string | null;
    rows: POSRow[];
    total: number;
    paid: number;
    change: number;
    tender: string;
  }) {
    const receiptDate = args.createdAt ? new Date(args.createdAt) : new Date();
    const dateText = receiptDate.toLocaleDateString("ar-JO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const timeText = receiptDate.toLocaleTimeString("ar-JO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemRows = args.rows
      .map((row, index) => {
        const quantity = rowQuantity(row);
        const salePrice = parseMoney(row.price);
        const lineTotal = rowLineTotal(row);
        const discount = discountPercent(row);
        const productName = escapeReceiptText(row.productName.trim());
        const department = escapeReceiptText(row.department.trim());

        return `
          <tr>
            <td class="itemName">
              <strong>${index + 1}. ${productName}</strong>
              <span>${department}${discount ? ` • خصم ${discount}` : ""}</span>
            </td>
            <td>${quantity}</td>
            <td>${money(salePrice) || "0.00"}</td>
            <td class="amount">${money(lineTotal) || "0.00"}</td>
          </tr>
        `;
      })
      .join("");

    return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>فاتورة PartPOS ${args.saleNumber ?? ""}</title>
  <style>
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f3f4f6;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .receiptPage {
      width: 100%;
      min-height: calc(297mm - 36mm);
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .logoHeader {
      text-align: center;
      border-bottom: 2px solid #111827;
      padding-bottom: 16px;
      margin-bottom: 2px;
    }
    .receiptLogo {
      display: block;
      width: 100%;
      max-width: 520px;
      max-height: 150px;
      object-fit: contain;
      margin: 0 auto;
    }
    .topBar {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;
    }
    .brand h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: -0.04em;
    }
    .brand p, .meta p, .footer p {
      margin: 4px 0;
      color: #4b5563;
      font-size: 13px;
    }
    .meta {
      text-align: left;
      min-width: 210px;
    }
    .meta strong {
      display: block;
      font-size: 20px;
      margin-bottom: 8px;
    }
    .badge {
      display: inline-block;
      background: #111827;
      color: white;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 800;
      margin-top: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    th {
      background: #f9fafb;
      border-bottom: 1px solid #d1d5db;
      color: #374151;
      font-size: 12px;
      text-align: right;
      padding: 10px 8px;
    }
    td {
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 8px;
      font-size: 13px;
      vertical-align: top;
    }
    .itemName strong {
      display: block;
      font-size: 14px;
      color: #111827;
    }
    .itemName span {
      display: block;
      margin-top: 3px;
      color: #6b7280;
      font-size: 12px;
    }
    .amount { text-align: left; font-weight: 800; }
    .summary {
      margin-right: auto;
      width: 320px;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
    }
    .summaryRow {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .summaryRow:last-child { border-bottom: 0; }
    .summaryRow.total {
      background: #111827;
      color: white;
      font-size: 18px;
      font-weight: 900;
    }
    .summaryRow.change strong { color: #15803d; }
    .summaryRow.paid strong { color: #111827; }
    .footer {
      margin-top: auto;
      border-top: 1px solid #e5e7eb;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-end;
    }
    .thankYou {
      font-size: 18px;
      font-weight: 900;
      color: #111827;
    }
    @media print {
      body { background: white; }
      .receiptPage { border: 0; border-radius: 0; padding: 0; min-height: auto; }
    }
  </style>
</head>
<body>
  <main class="receiptPage">
    <header class="logoHeader">
      <img
        class="receiptLogo"
        src="/partpos/receipt-header.png"
        alt="المعدنية المثالية لقطع غيار السيارات"
      />
    </header>

    <section class="topBar">
      <div class="brand">
        <h1>فاتورة بيع</h1>
        <p>فاتورة بيع قطع سيارات</p>
        <span class="badge">فاتورة للزبون</span>
      </div>
      <div class="meta">
        <strong>رقم الفاتورة: ${escapeReceiptText(String(args.saleNumber ?? "قيد الحفظ"))}</strong>
        <p>التاريخ: ${escapeReceiptText(dateText)}</p>
        <p>الوقت: ${escapeReceiptText(timeText)}</p>
        <p>طريقة الدفع: ${escapeReceiptText(args.tender)}</p>
      </div>
    </section>

    <section>
      <table>
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر د.أ</th>
            <th style="text-align:left;">المجموع</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </section>

    <section class="summary">
      <div class="summaryRow total"><span>الإجمالي</span><strong>${money(args.total) || "0.00"} د.أ</strong></div>
      <div class="summaryRow paid"><span>المبلغ المدفوع</span><strong>${money(args.paid) || "0.00"} د.أ</strong></div>
      <div class="summaryRow"><span>طريقة الدفع</span><strong>${escapeReceiptText(args.tender)}</strong></div>
      <div class="summaryRow change"><span>الراجع للزبون</span><strong>${money(args.change) || "0.00"} د.أ</strong></div>
    </section>

    <section class="footer">
      <div>
        <div class="thankYou">شكراً لتعاملكم معنا</div>
        <p>يرجى الاحتفاظ بهذه الفاتورة لسجلاتك.</p>
      </div>
      <p>مشغل بواسطة Darik Technologies</p>
    </section>
  </main>
  <script>
    window.onload = function () {
      window.focus();
      setTimeout(function () {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>`;
  }

  function printReceipt(
    printWindow: Window | null,
    args: Parameters<typeof buildReceiptHtml>[0],
  ) {
    const html = buildReceiptHtml(args);

    if (!printWindow) {
      const fallbackWindow = window.open("", "_blank", "width=460,height=760");
      if (!fallbackWindow) return false;
      printWindow = fallbackWindow;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    return true;
  }

  function openSalesHistory() {
    if (typeof window === "undefined") return;
    window.open("/partpos/history", "_blank", "noopener,noreferrer");
  }

  function openEndOfDayReport() {
    if (typeof window === "undefined") return;
    window.open("/partpos/end-of-day", "_blank", "noopener,noreferrer");
  }

  function openReports() {
    if (typeof window === "undefined") return;
    window.open("/partpos/reports", "_blank", "noopener,noreferrer");
  }

  function clearCurrentSaleInputs() {
    setRows([emptyRow(), emptyRow()]);
    setSearch("");
    setSuggestions([]);
    setCashReceived("");
    setMarginPopup(null);
  }

  function clearSale() {
    clearCurrentSaleInputs();
    setCashoutStatus("idle");
    setCashoutMessage("");
  }

  async function cashOutSale(printAfterSave = false) {
    if (!supabase) {
      setCashoutStatus("error");
      setCashoutMessage("Supabase غير مربوط. لا يمكن حفظ البيع.");
      return;
    }

    if (saleRows.length === 0 || saleTotal <= 0) {
      setCashoutStatus("error");
      setCashoutMessage("أضف منتج واحد على الأقل قبل إتمام البيع.");
      return;
    }

    if (paidAmount < saleTotal) {
      setCashoutStatus("error");
      setCashoutMessage("المبلغ المدفوع أقل من الإجمالي.");
      return;
    }

    const printWindow =
      printAfterSave && typeof window !== "undefined"
        ? window.open("", "_blank", "width=460,height=760")
        : null;

    setCashoutStatus("saving");
    setCashoutMessage("جاري حفظ البيع...");

    try {
      const productIds: Record<string, string | null> = {};

      for (const row of saleRows) {
        productIds[row.lineId] = await saveProductAndReturnId(row);
      }

      const { data: sale, error: saleError } = await supabase
        .from("partpos_sales")
        .insert({
          payment_method: "cash",
          status: "cashed_out",
          sale_total: saleTotal,
          amount_paid: paidAmount,
          change_due: changeDue,
          item_count: saleRows.length,
        })
        .select("id, sale_number, created_at")
        .single();

      if (saleError) throw saleError;
      if (!sale?.id) throw new Error("Sale was not saved correctly.");

      const saleItems = saleRows.map((row) => {
        const quantity = rowQuantity(row);

        return {
          sale_id: sale.id,
          product_id: productIds[row.lineId],
          product_name_ar: row.productName.trim(),
          department_ar: row.department.trim(),
          quantity,
          cost: parseMoney(row.cost),
          base_price: rowBasePrice(row),
          sale_price: parseMoney(row.price),
          discount_percent: discountPercentNumber(row),
          line_total: rowLineTotal(row),
        };
      });

      const { error: itemsError } = await supabase
        .from("partpos_sale_items")
        .insert(saleItems);

      if (itemsError) throw itemsError;

      let printBlocked = false;

      if (printAfterSave) {
        const printed = printReceipt(printWindow, {
          saleNumber: sale.sale_number,
          createdAt: sale.created_at,
          rows: saleRows,
          total: saleTotal,
          paid: paidAmount,
          change: changeDue,
          tender: "نقداً",
        });

        printBlocked = !printed;
      }

      const successMessage = printBlocked
        ? `تم حفظ البيع رقم ${sale.sale_number ?? ""}، لكن المتصفح منع نافذة الطباعة. اسمح بالـ popups. الراجع: ${money(changeDue) || "0.00"} د.أ`
        : `تم حفظ البيع رقم ${sale.sale_number ?? ""}. الراجع: ${money(changeDue) || "0.00"} د.أ`;

      clearCurrentSaleInputs();
      setCashoutStatus("success");
      setCashoutMessage(successMessage);
      lockPOSAfterSale();
    } catch (error) {
      if (printWindow) {
        printWindow.close();
      }

      const message =
        error instanceof Error ? error.message : "Could not cash out sale";
      setCashoutStatus("error");
      setCashoutMessage(message);
    }
  }

  if (!isUnlocked) {
    const pinDigits = Array.from({ length: DEFAULT_PIN.length }, (_, index) =>
      pinEntry[index] ? "●" : "",
    );

    return (
      <main className="pinPage" dir="rtl">
        <section className="pinCard">
          <p className="pinEyebrow">PartPOS</p>
          <h1>شاشة الدخول</h1>
          <p className="pinSubtext">أدخل الرمز. سيتم الدخول تلقائياً بعد آخر رقم.</p>

          {lockNotice && <div className="lockNotice">{lockNotice}</div>}

          <label htmlFor="pin-input">رمز الدخول</label>
          <input
            id="pin-input"
            value={pinEntry}
            onChange={(event) => handlePinChange(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            maxLength={DEFAULT_PIN.length}
            className="hiddenPinInput"
          />

          <div className="pinDots" aria-hidden="true">
            {pinDigits.map((digit, index) => (
              <span key={index} className={digit ? "filledDot" : ""}>
                {digit}
              </span>
            ))}
          </div>

          {pinError && <div className="pinError">{pinError}</div>}

          <div className="pinKeypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => addPinDigit(digit)}
              >
                {digit}
              </button>
            ))}
            <button type="button" className="blankPinKey" tabIndex={-1}>

            </button>
            <button type="button" onClick={() => addPinDigit("0")}>
              0
            </button>
            <button type="button" className="deletePinKey" onClick={deletePinDigit}>
              حذف
            </button>
          </div>
        </section>

        <style jsx>{`
          .pinPage {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f4f6f8;
            color: #111827;
            padding: 24px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .pinCard {
            width: min(430px, 100%);
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
            padding: 28px;
            text-align: center;
          }

          .pinEyebrow {
            margin: 0 0 8px;
            color: #6b7280;
            font-size: 13px;
            font-weight: 900;
          }

          .pinCard h1 {
            margin: 0;
            font-size: 34px;
            letter-spacing: -0.03em;
          }

          .pinSubtext {
            margin: 8px 0 18px;
            color: #4b5563;
          }

          .lockNotice {
            margin: 0 0 18px;
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
            border-radius: 14px;
            padding: 12px;
            font-weight: 900;
          }

          .pinCard label {
            display: block;
            margin-bottom: 10px;
            font-weight: 900;
            text-align: right;
          }

          .hiddenPinInput {
            position: absolute;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
          }

          .pinDots {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            margin-bottom: 14px;
          }

          .pinDots span {
            height: 52px;
            border: 1px solid #d1d5db;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9fafb;
            font-size: 24px;
            font-weight: 950;
          }

          .pinDots .filledDot {
            background: #111827;
            color: white;
            border-color: #111827;
          }

          .pinError {
            margin: 0 0 14px;
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
            border-radius: 14px;
            padding: 12px;
            font-weight: 900;
          }

          .pinKeypad {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .pinKeypad button {
            border: 1px solid #d1d5db;
            background: white;
            color: #111827;
            border-radius: 16px;
            padding: 18px 12px;
            font-size: 22px;
            font-weight: 950;
            cursor: pointer;
          }

          .pinKeypad button:hover {
            background: #f9fafb;
          }

          .deletePinKey {
            font-size: 16px !important;
            color: #b91c1c !important;
          }

          .blankPinKey {
            visibility: hidden;
          }

          @media (max-width: 480px) {
            .pinPage {
              padding: 14px;
            }

            .pinCard {
              padding: 22px;
            }

            .pinCard h1 {
              font-size: 30px;
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="partpos" dir="rtl">
      <section className="headerCard">
        <div>
          <p className="eyebrow">Darik Technologies</p>
          <h1>PartPOS</h1>
          <p className="subtext">نظام بيع بسيط لقطع السيارات</p>
        </div>
        <div className="headerActions">
          <button
            className="historyTopButton"
            onClick={openReports}
            type="button"
          >
            التقارير
          </button>
          <button
            className="historyTopButton"
            onClick={openEndOfDayReport}
            type="button"
          >
            تقرير نهاية اليوم
          </button>
          <button
            className="historyTopButton"
            onClick={openSalesHistory}
            type="button"
          >
            سجل المبيعات
          </button>
          <button className="clearButton" onClick={clearSale} type="button">
            فاتورة جديدة
          </button>
        </div>
      </section>

      {!supabase && (
        <div className="warning">
          أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY حتى يعمل
          الحفظ والبحث.
        </div>
      )}

      <section className="searchCard">
        <label htmlFor="partpos-search">بحث عن منتج محفوظ</label>
        <input
          id="partpos-search"
          value={search}
          onChange={(event) => void searchProducts(event.target.value)}
          placeholder="مثال: فلتر زيت تويوتا"
          autoComplete="off"
        />

        {isSearching && <div className="hint">جاري البحث...</div>}
        {searchError && <div className="error">{searchError}</div>}

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addSavedProduct(product)}
              >
                <strong>{product.product_name_ar}</strong>
                <span>{product.department_ar}</span>
                <b>{money(Number(product.price))} د.أ</b>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="tableCard">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>اسم المنتج</th>
                <th>القسم</th>
                <th>التكلفة</th>
                <th>السعر</th>
                <th>الكمية</th>
                <th>المجموع</th>
                <th>الحفظ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                return (
                  <tr key={row.lineId}>
                    <td>
                      <input
                        value={row.productName}
                        onChange={(event) =>
                          updateRow(index, "productName", event.target.value)
                        }
                        placeholder="اسم المنتج بالعربي"
                      />
                    </td>
                    <td>
                      <input
                        value={row.department}
                        onChange={(event) =>
                          updateRow(index, "department", event.target.value)
                        }
                        placeholder="القسم"
                      />
                    </td>
                    <td>
                      <input
                        value={row.cost}
                        onChange={(event) =>
                          updateRow(index, "cost", event.target.value)
                        }
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </td>
                    <td>
                      <input
                        value={row.price}
                        onChange={(event) =>
                          updateRow(index, "price", event.target.value)
                        }
                        onBlur={() => showManualPricePopup(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") event.currentTarget.blur();
                        }}
                        placeholder="تلقائي ويمكن تعديله"
                        inputMode="decimal"
                      />
                      {row.basePrice &&
                        parseMoney(row.price) !== rowBasePrice(row) && (
                          <small className="basePriceNote">
                            السعر الأصلي: {row.basePrice} د.أ
                          </small>
                        )}
                    </td>
                    <td>
                      <input
                        value={row.quantity}
                        onChange={(event) =>
                          updateRow(index, "quantity", event.target.value)
                        }
                        inputMode="decimal"
                      />
                    </td>
                    <td>
                      <input
                        className="totalInput"
                        value={rowLineTotalText(row)}
                        readOnly
                        placeholder="0.00"
                      />
                    </td>
                    <td className="statusCell">
                      {row.savedProductId && row.saveStatus === "saved" && (
                        <span className="saved">محفوظ سابقاً</span>
                      )}
                      {!row.savedProductId && rowIsSaveReady(row) && (
                        <span className="pendingSave">سيحفظ عند البيع</span>
                      )}
                      {row.saveStatus === "error" && (
                        <span className="error">خطأ</span>
                      )}
                      {row.errorMessage && <small>{row.errorMessage}</small>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="totals">
          <span>الإجمالي</span>
          <strong className="totalNumber">
            {money(saleTotal) || "0.00"} د.أ
          </strong>
        </div>

        <div className="cashoutPanel">
          <div className="cashInputGroup">
            <label htmlFor="cash-received">المبلغ المدفوع نقداً</label>
            <input
              id="cash-received"
              value={cashReceived}
              onChange={(event) => {
                setCashReceived(event.target.value);
                setCashoutStatus("idle");
                setCashoutMessage("");
              }}
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>

          <div className="changeGrid">
            <div>
              <span>الإجمالي المطلوب</span>
              <strong className="totalNumber">
                {money(saleTotal) || "0.00"} د.أ
              </strong>
            </div>
            <div>
              <span>المدفوع</span>
              <strong>{money(paidAmount) || "0.00"} د.أ</strong>
            </div>
            <div>
              <span>
                {remainingDue > 0 ? "باقي على الزبون" : "الراجع للزبون"}
              </span>
              <strong
                className={
                  remainingDue > 0 ? "remainingNumber" : "changeNumber"
                }
              >
                {money(remainingDue > 0 ? remainingDue : changeDue) || "0.00"}{" "}
                د.أ
              </strong>
            </div>
          </div>

          <div className="buttonStack">
            <button
              className="cashoutButton"
              disabled={!canCashOut}
              onClick={() => void cashOutSale(false)}
              type="button"
            >
              {cashoutStatus === "saving" ? "جاري الحفظ..." : "إتمام البيع"}
            </button>
            <button
              className="printCashoutButton"
              disabled={!canCashOut}
              onClick={() => void cashOutSale(true)}
              type="button"
            >
              إتمام البيع وطباعة الفاتورة
            </button>
          </div>

          {cashoutMessage && (
            <div className={`cashoutMessage ${cashoutStatus}`}>
              {cashoutMessage}
            </div>
          )}
        </div>
      </section>


      {marginPopup && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="marginPopupCard">
            <p className="popupEyebrow">تعديل السعر</p>
            <h2>تم تغيير الهامش إلى {marginPopup.marginPercent}</h2>
            <div className="popupInfo">
              <span>المنتج</span>
              <strong>{marginPopup.productName}</strong>
            </div>
            <div className="popupInfo">
              <span>السعر الحالي</span>
              <strong>{marginPopup.currentPrice} د.أ</strong>
            </div>
            <div className="popupInfo">
              <span>السعر الأصلي</span>
              <strong>{marginPopup.originalPrice} د.أ</strong>
            </div>
            {marginPopup.discountPercent !== "0.0%" && (
              <div className="popupInfo discountPopupInfo">
                <span>الخصم عن السعر الأصلي</span>
                <strong>{marginPopup.discountPercent}</strong>
              </div>
            )}
            <button type="button" onClick={() => setMarginPopup(null)}>
              إغلاق
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .partpos {
          min-height: 100vh;
          background: #f4f6f8;
          color: #111827;
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .headerCard,
        .searchCard,
        .tableCard,
        .warning {
          max-width: 1200px;
          margin: 0 auto 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .headerCard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px;
          gap: 16px;
        }

        .eyebrow {
          margin: 0 0 6px;
          color: #6b7280;
          font-size: 13px;
        }

        h1 {
          margin: 0;
          font-size: 34px;
          letter-spacing: -0.03em;
        }

        .subtext {
          margin: 6px 0 0;
          color: #4b5563;
        }


        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .historyTopButton {
          border: 1px solid #111827;
          background: white;
          color: #111827;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .historyTopButton:hover {
          background: #f9fafb;
        }

        .clearButton {
          border: 0;
          background: #111827;
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .warning {
          padding: 14px 18px;
          background: #fff7ed;
          border-color: #fed7aa;
          color: #9a3412;
        }

        .searchCard {
          padding: 18px;
          position: relative;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
        }

        input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 16px;
          outline: none;
          background: white;
        }

        input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
        }

        input[readonly] {
          background: #f9fafb;
          color: #374151;
        }

        .totalInput {
          color: #b91c1c !important;
          font-weight: 800;
        }

        .hint {
          margin-top: 8px;
          color: #6b7280;
          font-size: 14px;
        }

        .error {
          color: #b91c1c;
        }

        .suggestions {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .suggestions button {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 16px;
          align-items: center;
          text-align: right;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
        }

        .suggestions span {
          color: #6b7280;
        }

        .tableCard {
          padding: 0;
          overflow: hidden;
        }

        .tableWrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1080px;
        }

        th,
        td {
          border-bottom: 1px solid #e5e7eb;
          padding: 12px;
          vertical-align: top;
        }

        th {
          background: #f9fafb;
          text-align: right;
          font-size: 13px;
          color: #4b5563;
        }

        .basePriceNote {
          display: block;
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
        }

        .discountNote {
          display: block;
          margin-top: 6px;
          color: #15803d;
          font-size: 12px;
          font-weight: 800;
        }

        .statusCell {
          min-width: 110px;
          font-size: 13px;
          color: #6b7280;
        }

        .statusCell small {
          display: block;
          margin-top: 4px;
          max-width: 160px;
          overflow-wrap: anywhere;
        }

        .saved {
          color: #15803d;
          font-weight: 700;
        }

        .pendingSave {
          color: #92400e;
          font-weight: 700;
        }

        .totals {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 16px;
          padding: 18px;
          font-size: 20px;
          background: #111827;
          color: white;
        }

        .totals strong {
          font-size: 26px;
        }

        .totalNumber {
          color: #b91c1c;
          font-weight: 900;
        }

        .changeNumber {
          color: #15803d;
          font-weight: 900;
        }

        .remainingNumber {
          color: #b91c1c;
          font-weight: 900;
        }

        .cashoutPanel {
          display: grid;
          grid-template-columns: minmax(180px, 260px) 1fr auto;
          gap: 14px;
          align-items: end;
          padding: 18px;
          background: #ffffff;
        }

        .cashInputGroup label {
          font-size: 13px;
        }

        .changeGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(130px, 1fr));
          gap: 10px;
        }

        .changeGrid div {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 10px 12px;
          background: #f9fafb;
        }

        .changeGrid span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .changeGrid strong {
          font-size: 18px;
        }

        .buttonStack {
          display: grid;
          gap: 8px;
          min-width: 210px;
        }

        .cashoutButton,
        .printCashoutButton {
          border: 0;
          color: white;
          padding: 13px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .cashoutButton {
          background: #15803d;
        }

        .printCashoutButton {
          background: #111827;
        }

        .cashoutButton:disabled,
        .printCashoutButton:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .cashoutMessage {
          grid-column: 1 / -1;
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 700;
        }

        .cashoutMessage.success {
          background: #dcfce7;
          color: #166534;
        }

        .cashoutMessage.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .cashoutMessage.saving,
        .cashoutMessage.idle {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .popupBackdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(17, 24, 39, 0.45);
          padding: 18px;
        }

        .marginPopupCard {
          width: min(420px, 100%);
          background: white;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
          padding: 22px;
          border: 1px solid #e5e7eb;
        }

        .popupEyebrow {
          margin: 0 0 8px;
          color: #6b7280;
          font-size: 13px;
          font-weight: 800;
        }

        .marginPopupCard h2 {
          margin: 0 0 16px;
          color: #111827;
          font-size: 24px;
          line-height: 1.25;
        }

        .popupInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-top: 1px solid #e5e7eb;
          padding: 11px 0;
          color: #4b5563;
        }

        .popupInfo strong {
          color: #111827;
          text-align: left;
        }

        .discountPopupInfo strong {
          color: #15803d;
        }

        .marginPopupCard button {
          width: 100%;
          margin-top: 14px;
          border: 0;
          background: #111827;
          color: white;
          border-radius: 14px;
          padding: 13px 16px;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .historyCard {
          padding: 18px;
        }

        .historyHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }

        .historyHeader h2 {
          margin: 0;
          font-size: 24px;
        }

        .historyHeader p {
          margin: 6px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .historyHeader button {
          border: 0;
          background: #111827;
          color: white;
          padding: 11px 15px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .historyHeader button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .historyError,
        .emptyHistory {
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 700;
        }

        .historyError {
          background: #fee2e2;
          color: #991b1b;
        }

        .emptyHistory {
          background: #f9fafb;
          color: #6b7280;
          border: 1px dashed #d1d5db;
        }

        .historyList {
          display: grid;
          gap: 10px;
        }

        .historySale {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
        }

        .historySaleTop {
          width: 100%;
          border: 0;
          background: #f9fafb;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          text-align: right;
          cursor: pointer;
        }

        .historySaleTop strong {
          display: block;
          font-size: 17px;
          color: #111827;
        }

        .historySaleTop span {
          display: block;
          margin-top: 4px;
          color: #6b7280;
          font-size: 13px;
        }

        .historyAmounts {
          text-align: left;
          min-width: 160px;
        }

        .historyAmounts strong {
          color: #b91c1c;
          font-size: 18px;
        }

        .historyAmounts .historyChange {
          color: #15803d;
          font-weight: 800;
        }

        .historyItems {
          overflow-x: auto;
          padding: 0 14px 14px;
        }

        .historyItems table {
          min-width: 720px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .historyItems td small {
          display: block;
          margin-top: 3px;
          color: #15803d;
          font-size: 12px;
          font-weight: 800;
        }

        .historyLineTotal {
          color: #b91c1c;
        }


        @media (max-width: 700px) {
          .partpos {
            padding: 12px;
          }

          .headerCard {
            align-items: stretch;
            flex-direction: column;
          }

          .cashoutPanel {
            grid-template-columns: 1fr;
          }

          .historyHeader,
          .historySaleTop {
            align-items: stretch;
            flex-direction: column;
          }

          .historyAmounts {
            text-align: right;
          }

          .changeGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}