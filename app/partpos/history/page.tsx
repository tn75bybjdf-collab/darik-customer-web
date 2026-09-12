"use client";

import { createClient } from "@supabase/supabase-js";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SaleItem = {
  id: string;
  sale_id: string;
  product_name_ar: string;
  department_ar: string;
  quantity: number;
  cost: number;
  base_price: number;
  sale_price: number;
  discount_percent: number;
  line_total: number;
  created_at: string;
};

type Sale = {
  id: string;
  sale_number: number | null;
  payment_method: string;
  status: string;
  sale_total: number;
  amount_paid: number;
  change_due: number;
  item_count: number;
  created_at: string;
  voided_at: string | null;
  void_reversed_at: string | null;
  pre_void_status: string | null;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_credit_allowance: number;
  items: SaleItem[];
};

const PAGE_SIZE = 20;
const EMPLOYEE_LOGIN_PIN = "079300";

function money(value: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0.00";
  return numeric.toFixed(2);
}

function percent(value: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "";
  return `${numeric.toFixed(1)}%`;
}

function tenderLabel(value: string) {
  if (value === "credit") return "ائتمان / Credit";
  if (value === "cash") return "نقداً / Cash";
  return value || "نقداً / Cash";
}

function statusLabel(value: string) {
  const normalized = String(value || "").toLowerCase();

  if (normalized === "voided") return "ملغاة / VOID";
  if (normalized === "return" || normalized === "returned") return "مرتجع / Return";
  if (value === "credit") return "ائتمان / Credit";
  if (value === "cashed_out") return "مكتملة / Completed";
  return value || "مكتملة / Completed";
}

function isVoidedSale(sale: Sale) {
  return String(sale.status || "").toLowerCase() === "voided";
}

function isReturnSale(sale: Sale) {
  const status = String(sale.status || "").toLowerCase();
  return status === "return" || status === "returned" || Number(sale.sale_total || 0) < 0;
}

const PARTPOS_TIME_ZONE = "Asia/Amman";

function jordanDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PARTPOS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";

  return year && month && day ? `${year}-${month}-${day}` : "";
}

function isSaleFromTodayInJordan(sale: Sale) {
  const saleDay = jordanDateKey(sale.created_at);
  const today = jordanDateKey(new Date());
  return Boolean(saleDay && today && saleDay === today);
}

function normalizeQuantityInput(value: string) {
  const normalized = normalizeDigits(value).replace(/[^\d.]/g, "");
  const parts = normalized.split(".");
  if (parts.length <= 1) return normalized;
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

function parsePositiveQuantity(value: string) {
  const parsed = Number(normalizeQuantityInput(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function escapeReceiptText(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readSupabaseError(error: unknown) {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const parts = [
      record.message ? String(record.message) : "",
      record.details ? String(record.details) : "",
      record.hint ? String(record.hint) : "",
      record.code ? String(record.code) : "",
    ].filter(Boolean);

    if (parts.length > 0) return parts.join(" | ");
  }

  return String(error || "Unknown error");
}

function formatArabicDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const dateText = date.toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const timeText = date.toLocaleTimeString("ar-JO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateText} - ${timeText}`;
}

function normalizeDigits(value: string) {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const persian = "۰۱۲۳۴۵۶۷۸۹";

  return value.replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndex = arabic.indexOf(digit);
    if (arabicIndex >= 0) return String(arabicIndex);

    const persianIndex = persian.indexOf(digit);
    if (persianIndex >= 0) return String(persianIndex);

    return digit;
  });
}

function safeLikeTerm(value: string) {
  return normalizeDigits(value)
    .trim()
    .replace(/[%,()]/g, " ")
    .replace(/\s+/g, " ");
}

function receiptNumberFromSearch(value: string) {
  const normalized = normalizeDigits(value)
    .replace(/#/g, "")
    .replace(/فاتورة/g, "")
    .replace(/رقم/g, "")
    .replace(/\s+/g, "")
    .trim();

  if (!/^\d+$/.test(normalized)) return null;

  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function dateRangeFromSearch(value: string) {
  const normalized = normalizeDigits(value).trim();
  const currentYear = new Date().getFullYear();

  const isoMatch = normalized.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    return makeDateRange(
      Number(isoMatch[1]),
      Number(isoMatch[2]),
      Number(isoMatch[3]),
    );
  }

  const fullLocalMatch = normalized.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (fullLocalMatch) {
    return makeDateRange(
      Number(fullLocalMatch[3]),
      Number(fullLocalMatch[2]),
      Number(fullLocalMatch[1]),
    );
  }

  const shortLocalMatch = normalized.match(/^(\d{1,2})[-/.](\d{1,2})$/);
  if (shortLocalMatch) {
    return makeDateRange(
      currentYear,
      Number(shortLocalMatch[2]),
      Number(shortLocalMatch[1]),
    );
  }

  return null;
}

function makeDateRange(year: number, month: number, day: number) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (
    start.getFullYear() !== year ||
    start.getMonth() !== month - 1 ||
    start.getDate() !== day
  ) {
    return null;
  }

  const end = new Date(year, month - 1, day + 1, 0, 0, 0, 0);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export default function PartPOSSalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [voidSale, setVoidSale] = useState<Sale | null>(null);
  const [voidPin, setVoidPin] = useState("");
  const [voidError, setVoidError] = useState("");
  const [voidingSaleId, setVoidingSaleId] = useState<string | null>(null);
  const [reverseVoidSale, setReverseVoidSale] = useState<Sale | null>(null);
  const [reverseVoidPin, setReverseVoidPin] = useState("");
  const [reverseVoidError, setReverseVoidError] = useState("");
  const [reversingVoidSaleId, setReversingVoidSaleId] = useState<string | null>(null);
  const [openSaleId, setOpenSaleId] = useState<string | null>(null);

  const [returnedQuantitiesByItemId, setReturnedQuantitiesByItemId] = useState<
    Record<string, number>
  >({});
  const [returnSale, setReturnSale] = useState<Sale | null>(null);
  const [returnQuantities, setReturnQuantities] = useState<Record<string, string>>({});
  const [returnPin, setReturnPin] = useState("");
  const [returnError, setReturnError] = useState("");
  const [returningSaleId, setReturningSaleId] = useState<string | null>(null);

  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const searchRef = useRef("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
  }, []);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const findMatchingSaleIds = useCallback(
    async (rawSearch: string) => {
      if (!supabase) return null;

      const term = safeLikeTerm(rawSearch);
      if (!term) return null;

      const ids = new Set<string>();

      const { data: itemMatches, error: itemError } = await supabase
        .from("partpos_sale_items")
        .select("sale_id")
        .or(`product_name_ar.ilike.%${term}%,department_ar.ilike.%${term}%`)
        .limit(1000);

      if (itemError) throw itemError;
      (itemMatches ?? []).forEach((item) => ids.add(String(item.sale_id)));

      const receiptNumber = receiptNumberFromSearch(rawSearch);
      if (receiptNumber) {
        const { data: receiptMatches, error: receiptError } = await supabase
          .from("partpos_sales")
          .select("id")
          .eq("sale_number", receiptNumber)
          .limit(20);

        if (receiptError) throw receiptError;
        (receiptMatches ?? []).forEach((sale) => ids.add(String(sale.id)));
      }

      const dateRange = dateRangeFromSearch(rawSearch);
      if (dateRange) {
        const { data: dateMatches, error: dateError } = await supabase
          .from("partpos_sales")
          .select("id")
          .gte("created_at", dateRange.start)
          .lt("created_at", dateRange.end)
          .order("created_at", { ascending: false })
          .limit(1000);

        if (dateError) throw dateError;
        (dateMatches ?? []).forEach((sale) => ids.add(String(sale.id)));
      }

      return Array.from(ids);
    },
    [supabase],
  );

  const loadHistory = useCallback(
    async (reset = false) => {
      if (!supabase || loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError("");

      try {
        const activeSearch = searchRef.current.trim();
        const nextOffset = reset ? 0 : offsetRef.current;
        const matchingIds = activeSearch
          ? await findMatchingSaleIds(activeSearch)
          : null;

        if (activeSearch && matchingIds && matchingIds.length === 0) {
          if (reset) setSales([]);
          offsetRef.current = 0;
          setHasMore(false);
          setLoading(false);
          loadingRef.current = false;
          return;
        }

        let salesQuery = supabase
          .from("partpos_sales")
          .select(
            "id, sale_number, payment_method, status, sale_total, amount_paid, change_due, item_count, created_at, voided_at, void_reversed_at, pre_void_status, customer_id, customer_name, customer_phone, customer_credit_allowance",
          )
          .order("created_at", { ascending: false });

        if (matchingIds && matchingIds.length > 0) {
          salesQuery = salesQuery.in("id", matchingIds);
        }

        const { data: saleRows, error: salesError } = await salesQuery.range(
          nextOffset,
          nextOffset + PAGE_SIZE - 1,
        );

        if (salesError) throw salesError;

        const saleIds = (saleRows ?? []).map((sale) => String(sale.id));
        let items: SaleItem[] = [];

        if (saleIds.length > 0) {
          const { data: itemRows, error: itemsError } = await supabase
            .from("partpos_sale_items")
            .select(
              "id, sale_id, product_name_ar, department_ar, quantity, cost, base_price, sale_price, discount_percent, line_total, created_at",
            )
            .in("sale_id", saleIds)
            .order("created_at", { ascending: true });

          if (itemsError) throw itemsError;
          items = (itemRows ?? []) as SaleItem[];
        }

        const itemsBySaleId = items.reduce<Record<string, SaleItem[]>>(
          (groups, item) => {
            if (!groups[item.sale_id]) groups[item.sale_id] = [];
            groups[item.sale_id].push(item);
            return groups;
          },
          {},
        );

        const loadedItemIds = items.map((item) => String(item.id)).filter(Boolean);
        const nextReturnedQuantities: Record<string, number> = {};

        if (loadedItemIds.length > 0) {
          const { data: returnRows, error: returnsError } = await supabase
            .from("partpos_item_returns")
            .select("original_sale_item_id, quantity_returned")
            .in("original_sale_item_id", loadedItemIds)
            .limit(50000);

          if (!returnsError) {
            for (const row of returnRows ?? []) {
              const itemId = String((row as any).original_sale_item_id ?? "");
              if (!itemId) continue;

              nextReturnedQuantities[itemId] =
                (nextReturnedQuantities[itemId] ?? 0) +
                Number((row as any).quantity_returned ?? 0);
            }
          }
        }

        const nextSales: Sale[] = (saleRows ?? []).map((sale) => ({
          id: String(sale.id),
          sale_number:
            sale.sale_number === null || sale.sale_number === undefined
              ? null
              : Number(sale.sale_number),
          payment_method: String(sale.payment_method ?? "cash"),
          status: String(sale.status ?? "cashed_out"),
          sale_total: Number(sale.sale_total ?? 0),
          amount_paid: Number(sale.amount_paid ?? 0),
          change_due: Number(sale.change_due ?? 0),
          item_count: Number(sale.item_count ?? 0),
          created_at: String(sale.created_at),
          voided_at:
            sale.voided_at === null || sale.voided_at === undefined
              ? null
              : String(sale.voided_at),
          void_reversed_at:
            sale.void_reversed_at === null || sale.void_reversed_at === undefined
              ? null
              : String(sale.void_reversed_at),
          pre_void_status:
            sale.pre_void_status === null || sale.pre_void_status === undefined
              ? null
              : String(sale.pre_void_status),
          customer_id:
            sale.customer_id === null || sale.customer_id === undefined
              ? null
              : String(sale.customer_id),
          customer_name: String(sale.customer_name ?? ""),
          customer_phone: String(sale.customer_phone ?? ""),
          customer_credit_allowance: Number(sale.customer_credit_allowance ?? 0),
          items: itemsBySaleId[String(sale.id)] ?? [],
        }));

        setReturnedQuantitiesByItemId((current) =>
          reset ? nextReturnedQuantities : { ...current, ...nextReturnedQuantities },
        );

        setSales((current) => (reset ? nextSales : [...current, ...nextSales]));
        offsetRef.current = nextOffset + nextSales.length;
        setHasMore(nextSales.length === PAGE_SIZE);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "حدث خطأ أثناء تحميل سجل المبيعات. / Error loading sales history.";
        setError(message);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [findMatchingSaleIds, supabase],
  );

  useEffect(() => {
    if (!supabase) return;

    const timer = window.setTimeout(() => {
      offsetRef.current = 0;
      setOpenSaleId(null);
      setHasMore(true);
      void loadHistory(true);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [loadHistory, search, supabase]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadHistory(false);
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadHistory, sales.length]);

  function clearSearch() {
    setSearch("");
  }

  function backToPOS() {
    if (typeof window === "undefined") return;
    window.location.href = "/partpos";
  }

  function buildReceiptHtml(sale: Sale) {
    const saleNumber = sale.sale_number ?? "—";
    const voided = isVoidedSale(sale);

    const itemsHtml = sale.items
      .map((item) => {
        const discount = Number(item.discount_percent || 0);

        return `
          <tr>
            <td>
              <strong>${escapeReceiptText(item.product_name_ar || "صنف / Item")}</strong>
              <small>${escapeReceiptText(item.department_ar || "")}${
                discount > 0 ? ` • خصم / Discount ${escapeReceiptText(percent(discount))}` : ""
              }</small>
            </td>
            <td>${money(Number(item.quantity || 0))}</td>
            <td>${money(Number(item.sale_price || 0))}</td>
            <td>${money(Number(item.line_total || 0))}</td>
          </tr>
        `;
      })
      .join("");

    return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>فاتورة / Receipt ${escapeReceiptText(saleNumber)}</title>
  <style>
    @page { size: 80mm auto; margin: 4mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; background: white; color: #111; font-family: Arial, Helvetica, sans-serif; direction: rtl; }
    .receipt { width: 72mm; margin: 0 auto; padding: 2mm 0; }
    .header { text-align: center; border-bottom: 1px dashed #111; padding-bottom: 8px; margin-bottom: 8px; }
    .header img { max-width: 58mm; max-height: 22mm; object-fit: contain; display: block; margin: 0 auto 6px; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 900; }
    .header p { margin: 3px 0 0; font-size: 11px; }
    .voidStamp { border: 2px solid #b91c1c; color: #b91c1c; font-weight: 900; text-align: center; padding: 6px; margin: 8px 0; font-size: 18px; letter-spacing: 1px; }
    .meta { display: grid; gap: 4px; margin-bottom: 8px; font-size: 12px; }
    .metaRow { display: flex; justify-content: space-between; gap: 8px; border-bottom: 1px dotted #ddd; padding-bottom: 3px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 8px; }
    th { border-bottom: 1px solid #111; padding: 4px 2px; text-align: right; font-size: 10px; }
    td { border-bottom: 1px dotted #ddd; padding: 5px 2px; vertical-align: top; }
    td strong { display: block; font-size: 11px; }
    td small { display: block; color: #555; font-size: 9px; margin-top: 2px; }
    .totals { border-top: 1px dashed #111; margin-top: 8px; padding-top: 8px; display: grid; gap: 4px; font-size: 12px; }
    .totalLine { display: flex; justify-content: space-between; gap: 8px; }
    .grandTotal { font-size: 16px; font-weight: 900; border-top: 1px solid #111; padding-top: 6px; margin-top: 4px; }
    .footer { text-align: center; border-top: 1px dashed #111; margin-top: 10px; padding-top: 8px; font-size: 11px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <img src="/partpos/receipt-header.png" alt="PartPOS" onerror="this.style.display='none'" />
      <h1>فاتورة مبيعات / Sales Receipt</h1>
      <p>نسخة العميل من سجل المبيعات / Customer copy from sales history</p>
    </div>

    ${voided ? `<div class="voidStamp">ملغاة / VOID</div>` : ""}

    <div class="meta">
      <div class="metaRow"><span>رقم الفاتورة / Receipt No.</span><strong>${escapeReceiptText(saleNumber)}</strong></div>
      <div class="metaRow"><span>التاريخ / Date</span><strong>${escapeReceiptText(formatArabicDateTime(sale.created_at))}</strong></div>
      <div class="metaRow"><span>طريقة الدفع / Payment Method</span><strong>${escapeReceiptText(tenderLabel(sale.payment_method))}</strong></div>
      <div class="metaRow"><span>الحالة / Status</span><strong>${escapeReceiptText(statusLabel(sale.status))}</strong></div>
      ${
        voided
          ? `<div class="metaRow"><span>وقت الإلغاء / Voided</span><strong>${
              sale.voided_at
                ? escapeReceiptText(formatArabicDateTime(sale.voided_at))
                : "غير مسجل للفاتورة القديمة / Not recorded for legacy void"
            }</strong></div>`
          : ""
      }
    </div>

    <table>
      <thead>
        <tr>
          <th>الصنف / Item</th>
          <th>كمية / Qty</th>
          <th>سعر / Price</th>
          <th>مجموع / Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="totals">
      <div class="totalLine"><span>عدد الأصناف / Item Count</span><strong>${money(Number(sale.item_count || 0))}</strong></div>
      <div class="totalLine grandTotal"><span>الإجمالي / Total</span><strong>${money(Number(sale.sale_total || 0))} د.أ</strong></div>
      <div class="totalLine"><span>المدفوع / Paid</span><strong>${money(Number(sale.amount_paid || 0))} د.أ</strong></div>
      <div class="totalLine"><span>الراجع / Change</span><strong>${money(Number(sale.change_due || 0))} د.أ</strong></div>
    </div>

    <div class="footer">
      <strong>شكراً لكم / Thank you</strong>
      <p>احتفظ بالفاتورة للمراجعة. / Keep this receipt for reference.</p>
    </div>
  </div>
  <script>
    window.addEventListener("load", () => {
      window.focus();
      setTimeout(() => window.print(), 250);
    });
  </script>
</body>
</html>`;
  }

  function printSaleReceipt(sale: Sale) {
    if (typeof window === "undefined") return;

    const receiptWindow = window.open("", "_blank", "width=420,height=720");
    if (!receiptWindow) {
      setActionMessage("المتصفح منع فتح نافذة الطباعة. اسمح بالـ popups ثم حاول مرة ثانية. / The browser blocked the print window. Allow popups and try again.");
      return;
    }

    receiptWindow.document.open();
    receiptWindow.document.write(buildReceiptHtml(sale));
    receiptWindow.document.close();
  }

  function saleHasRecordedReturns(sale: Sale) {
    return sale.items.some((item) => returnedQuantityForItem(item) > 0.0001);
  }

  function canVoidSale(sale: Sale) {
    return (
      !isVoidedSale(sale) &&
      !isReturnSale(sale) &&
      isSaleFromTodayInJordan(sale) &&
      !saleHasRecordedReturns(sale)
    );
  }

  function voidButtonLabel(sale: Sale) {
    if (isReturnSale(sale)) return "فاتورة مرتجع / Return Receipt";
    if (!isSaleFromTodayInJordan(sale)) return "مرتجع فقط بعد يوم البيع / Returns Only After Sale Day";
    if (saleHasRecordedReturns(sale)) return "يوجد مرتجع مسجل / Return Already Recorded";
    return "إلغاء / Void";
  }

  function openVoidConfirm(sale: Sale) {
    if (isVoidedSale(sale)) return;

    if (!isSaleFromTodayInJordan(sale)) {
      setActionMessage(
        "لا يمكن إلغاء الفاتورة بعد انتهاء يوم البيع. استخدم المرتجع بدلاً من ذلك. / A receipt cannot be voided after its sale day. Use Return instead.",
      );
      return;
    }

    if (isReturnSale(sale)) {
      setActionMessage("لا يمكن إلغاء فاتورة مرتجع. / Return receipts cannot be voided.");
      return;
    }

    if (saleHasRecordedReturns(sale)) {
      setActionMessage(
        "لا يمكن إلغاء فاتورة تم تسجيل مرتجع عليها. استخدم المرتجع لباقي الأصناف. / A receipt with recorded returns cannot be voided. Return any remaining items instead.",
      );
      return;
    }

    setVoidSale(sale);
    setVoidPin("");
    setVoidError("");
    setActionMessage("");
  }

  function closeVoidConfirm() {
    if (voidingSaleId) return;

    setVoidSale(null);
    setVoidPin("");
    setVoidError("");
  }

  function openReverseVoidConfirm(sale: Sale) {
    if (!isVoidedSale(sale)) return;

    setReverseVoidSale(sale);
    setReverseVoidPin("");
    setReverseVoidError("");
    setActionMessage("");
  }

  function closeReverseVoidConfirm() {
    if (reversingVoidSaleId) return;

    setReverseVoidSale(null);
    setReverseVoidPin("");
    setReverseVoidError("");
  }

  function returnedQuantityForItem(item: SaleItem) {
    return Number(returnedQuantitiesByItemId[item.id] ?? 0);
  }

  function availableReturnQuantity(item: SaleItem) {
    const soldQuantity = Number(item.quantity || 0);
    if (soldQuantity <= 0) return 0;

    return Math.max(soldQuantity - returnedQuantityForItem(item), 0);
  }

  function returnableItemsForSale(sale: Sale) {
    if (isVoidedSale(sale) || isReturnSale(sale)) return [];
    return sale.items.filter((item) => availableReturnQuantity(item) > 0.0001);
  }

  function openReturnPopup(sale: Sale) {
    if (isVoidedSale(sale) || isReturnSale(sale)) return;

    setReturnSale(sale);
    setReturnQuantities({});
    setReturnPin("");
    setReturnError("");
    setActionMessage("");
  }

  function closeReturnPopup() {
    if (returningSaleId) return;

    setReturnSale(null);
    setReturnQuantities({});
    setReturnPin("");
    setReturnError("");
  }

  function updateReturnQuantity(itemId: string, value: string) {
    setReturnQuantities((current) => ({
      ...current,
      [itemId]: normalizeQuantityInput(value),
    }));
  }

  function selectedReturnLines() {
    if (!returnSale) return [];

    return returnSale.items
      .map((item) => {
        const quantity = parsePositiveQuantity(returnQuantities[item.id] ?? "");
        const available = availableReturnQuantity(item);
        const safeQuantity = Math.min(quantity, available);

        return {
          item,
          quantity,
          safeQuantity,
          available,
          lineTotal: safeQuantity * Number(item.sale_price || 0),
        };
      })
      .filter((line) => line.safeQuantity > 0.0001);
  }

  const returnPreviewTotal = useMemo(
    () =>
      selectedReturnLines().reduce(
        (sum, line) => sum + line.safeQuantity * Number(line.item.sale_price || 0),
        0,
      ),
    [returnQuantities, returnSale, returnedQuantitiesByItemId],
  );

  async function confirmReturnItems() {
    if (!supabase || !returnSale) return;

    if (returnPin !== EMPLOYEE_LOGIN_PIN) {
      setReturnError("الرمز غير صحيح. أدخل رمز الدخول لتأكيد المرتجع. / Incorrect PIN. Enter the login PIN to confirm the return.");
      setReturnPin("");
      return;
    }

    const selectedLines = selectedReturnLines();

    if (selectedLines.length === 0) {
      setReturnError("اختر صنف واحد على الأقل وأدخل كمية المرتجع. / Select at least one item and enter a return quantity.");
      return;
    }

    const invalidLine = selectedLines.find(
      (line) =>
        line.quantity <= 0 ||
        line.quantity > line.available + 0.0001 ||
        line.safeQuantity !== line.quantity,
    );

    if (invalidLine) {
      setReturnError(`كمية المرتجع أكبر من المتاح للصنف: ${invalidLine.item.product_name_ar} / Return quantity exceeds the available quantity.`);
      return;
    }

    setReturningSaleId(returnSale.id);
    setReturnError("");

    try {
      const returnLines = selectedLines.map((line) => ({
        sale_item_id: line.item.id,
        quantity: line.quantity,
      }));

      const { data, error: rpcError } = await supabase.rpc("partpos_create_item_return", {
        p_original_sale_id: returnSale.id,
        p_return_lines: returnLines,
      });

      if (rpcError) throw rpcError;

      const returnData = (data ?? {}) as Record<string, unknown>;
      const returnSaleNumber =
        returnData.return_sale_number === null || returnData.return_sale_number === undefined
          ? "—"
          : String(returnData.return_sale_number);
      const returnTotal = Number(returnData.return_total ?? returnPreviewTotal);

      setReturnedQuantitiesByItemId((current) => {
        const next = { ...current };

        for (const line of selectedLines) {
          next[line.item.id] = Number(next[line.item.id] ?? 0) + line.quantity;
        }

        return next;
      });

      setActionMessage(
        `تم تسجيل مرتجع رقم ${returnSaleNumber} بقيمة ${money(
          returnTotal,
        )} د.أ. سيظهر على مبيعات اليوم كرقم سالب حسب القسم.`,
      );

      setReturnSale(null);
      setReturnQuantities({});
      setReturnPin("");

      offsetRef.current = 0;
      setHasMore(true);
      void loadHistory(true);
    } catch (caught) {
      setReturnError(
        `خطأ Supabase: ${readSupabaseError(
          caught,
        )}. تأكد أنك شغّلت SQL الخاص بالمرتجعات أولاً.`,
      );
    } finally {
      setReturningSaleId(null);
    }
  }

  async function confirmVoidSale() {
    if (!supabase || !voidSale) return;

    if (voidPin !== EMPLOYEE_LOGIN_PIN) {
      setVoidError("الرمز غير صحيح. أدخل رمز الدخول لإلغاء الفاتورة. / Incorrect PIN. Enter the login PIN to void the receipt.");
      setVoidPin("");
      return;
    }

    if (!canVoidSale(voidSale)) {
      setVoidError(
        "لا يمكن إلغاء هذه الفاتورة. الإلغاء مسموح فقط في نفس يوم البيع وقبل تسجيل أي مرتجع. / This receipt cannot be voided. Voids are allowed only on the sale day and before any return is recorded.",
      );
      return;
    }

    setVoidingSaleId(voidSale.id);
    setVoidError("");

    try {
      const { data, error: voidRpcError } = await supabase.rpc("partpos_void_sale", {
        p_sale_id: voidSale.id,
      });

      if (voidRpcError) throw voidRpcError;

      const result = (data ?? {}) as Record<string, unknown>;
      const voidedAt =
        result.voided_at === null || result.voided_at === undefined
          ? new Date().toISOString()
          : String(result.voided_at);

      setSales((current) =>
        current.map((sale) =>
          sale.id === voidSale.id
            ? {
                ...sale,
                status: "voided",
                pre_void_status: sale.status || "cashed_out",
                voided_at: voidedAt,
                void_reversed_at: null,
              }
            : sale,
        ),
      );
      setActionMessage(
        `تم إلغاء الفاتورة رقم ${voidSale.sale_number ?? "—"}. / Receipt voided.`,
      );
      setVoidSale(null);
      setVoidPin("");
    } catch (caught) {
      setVoidError(`خطأ Supabase / Supabase error: ${readSupabaseError(caught)}`);
    } finally {
      setVoidingSaleId(null);
    }
  }

  async function confirmReverseVoid() {
    if (!supabase || !reverseVoidSale) return;

    if (reverseVoidPin !== EMPLOYEE_LOGIN_PIN) {
      setReverseVoidError(
        "الرمز غير صحيح. أدخل رمز الدخول لعكس الإلغاء. / Incorrect PIN. Enter the login PIN to reverse the void.",
      );
      setReverseVoidPin("");
      return;
    }

    setReversingVoidSaleId(reverseVoidSale.id);
    setReverseVoidError("");

    try {
      const { data, error: reverseRpcError } = await supabase.rpc("partpos_reverse_void", {
        p_sale_id: reverseVoidSale.id,
      });

      if (reverseRpcError) throw reverseRpcError;

      const result = (data ?? {}) as Record<string, unknown>;
      const restoredStatus = String(
        result.restored_status ?? reverseVoidSale.pre_void_status ?? "cashed_out",
      );
      const reversedAt =
        result.void_reversed_at === null || result.void_reversed_at === undefined
          ? new Date().toISOString()
          : String(result.void_reversed_at);

      setSales((current) =>
        current.map((sale) =>
          sale.id === reverseVoidSale.id
            ? {
                ...sale,
                status: restoredStatus,
                void_reversed_at: reversedAt,
              }
            : sale,
        ),
      );

      setActionMessage(
        `تم عكس إلغاء الفاتورة رقم ${reverseVoidSale.sale_number ?? "—"} وإعادتها للمبيعات. / Void reversed and receipt restored to sales.`,
      );
      setReverseVoidSale(null);
      setReverseVoidPin("");
    } catch (caught) {
      setReverseVoidError(`خطأ Supabase / Supabase error: ${readSupabaseError(caught)}`);
    } finally {
      setReversingVoidSaleId(null);
    }
  }

  return (
    <main className="historyPage" dir="rtl">
      <section className="topCard">
        <div>
          <p className="eyebrow">PartPOS</p>
          <h1>سجل المبيعات / Sales History</h1>
          <p className="subtext">أحدث الفواتير تظهر أولاً. يتم تحميل 20 فاتورة كل مرة. / Newest receipts first. 20 receipts load at a time.</p>
        </div>
        <div className="topActions">
          <button type="button" className="secondaryButton" onClick={backToPOS}>
            الرجوع للكاشير / Back to Cashier
          </button>
          <button
            type="button"
            className="primaryButton"
            onClick={() => {
              offsetRef.current = 0;
              setHasMore(true);
              void loadHistory(true);
            }}
            disabled={!supabase || loading}
          >
            {loading ? "جاري التحديث... / Updating..." : "تحديث السجل / Refresh History"}
          </button>
        </div>
      </section>

      {!supabase && (
        <div className="warning">
          أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY حتى يظهر سجل المبيعات. / Add the Supabase URL and anon key to show sales history.
        </div>
      )}

      <section className="searchCard">
        <label htmlFor="history-search">بحث في السجل / Search History</label>
        <div className="searchRow">
          <input
            id="history-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالقطعة، التاريخ أو رقم الفاتورة / Search item, date, or receipt number"
            autoComplete="off"
          />
          {search.trim() && (
            <button type="button" onClick={clearSearch}>
              مسح / Clear
            </button>
          )}
        </div>
        <p className="searchHint">
          أمثلة: فلتر زيت، 1، فاتورة 1، 30/06/2026، 2026-06-30 / Examples: oil filter, 1, receipt 1, 30/06/2026
        </p>
      </section>

      {error && <div className="errorBox">{error}</div>}
      {actionMessage && <div className="successBox">{actionMessage}</div>}

      <section className="listCard">
        {sales.length === 0 && !loading && !error && (
          <div className="emptyState">
            {search.trim() ? "لا يوجد نتائج مطابقة للبحث. / No matching search results." : "لا يوجد مبيعات محفوظة حتى الآن. / No saved sales yet."}
          </div>
        )}

        {sales.map((sale) => {
          const isOpen = openSaleId === sale.id;

          return (
            <article
              className={isVoidedSale(sale) ? "saleCard voidedSaleCard" : "saleCard"}
              key={sale.id}
            >
              <button
                type="button"
                className="saleTop"
                onClick={() => setOpenSaleId(isOpen ? null : sale.id)}
              >
                <div className="saleTitleBlock">
                  <strong>فاتورة رقم / Receipt No. {sale.sale_number ?? "—"}</strong>
                  <span>{formatArabicDateTime(sale.created_at)}</span>
                  <span>
                    {sale.item_count} أصناف / items • {tenderLabel(sale.payment_method)} •{" "}
                    {statusLabel(sale.status)}
                  </span>
                  {isVoidedSale(sale) && <em className="voidBadge">ملغاة / VOID</em>}
                  {isVoidedSale(sale) && (
                    <span className="voidAuditLine">
                      وقت الإلغاء / Voided:{" "}
                      {sale.voided_at
                        ? formatArabicDateTime(sale.voided_at)
                        : "غير مسجل للفاتورة القديمة / Not recorded for legacy void"}
                    </span>
                  )}
                  {!isVoidedSale(sale) && sale.void_reversed_at && (
                    <span className="reverseAuditLine">
                      تم عكس الإلغاء / Void reversed: {formatArabicDateTime(sale.void_reversed_at)}
                    </span>
                  )}
                </div>

                <div className="saleMoneyBlock">
                  <span>الإجمالي / Total</span>
                  <strong className="totalAmount">{money(sale.sale_total)} د.أ</strong>
                  <small>مدفوع / Paid: {money(sale.amount_paid)} د.أ</small>
                  <small className="changeAmount">راجع / Change: {money(sale.change_due)} د.أ</small>
                </div>
              </button>

              {isOpen && (
                <div className="itemsPanel">
                  <div className="receiptMeta">
                    <div>
                      <span>رقم الفاتورة / Receipt No.</span>
                      <strong>{sale.sale_number ?? "—"}</strong>
                    </div>
                    <div>
                      <span>الوقت والتاريخ / Date & Time</span>
                      <strong>{formatArabicDateTime(sale.created_at)}</strong>
                    </div>
                    <div>
                      <span>طريقة الدفع / Payment Method</span>
                      <strong>{tenderLabel(sale.payment_method)}</strong>
                    </div>
                    <div>
                      <span>الحالة / Status</span>
                      <strong className={isVoidedSale(sale) ? "redText" : ""}>
                        {statusLabel(sale.status)}
                      </strong>
                    </div>
                    {isVoidedSale(sale) && (
                      <div>
                        <span>وقت الإلغاء / Voided</span>
                        <strong className="redText">
                          {sale.voided_at
                            ? formatArabicDateTime(sale.voided_at)
                            : "غير مسجل للفاتورة القديمة / Not recorded for legacy void"}
                        </strong>
                      </div>
                    )}
                    {!isVoidedSale(sale) && sale.void_reversed_at && (
                      <div>
                        <span>عكس الإلغاء / Void Reversed</span>
                        <strong>{formatArabicDateTime(sale.void_reversed_at)}</strong>
                      </div>
                    )}
                  </div>

                  <div className="receiptActions">
                    <button
                      type="button"
                      className="printReceiptButton"
                      onClick={() => printSaleReceipt(sale)}
                    >
                      طباعة الفاتورة / Print Receipt
                    </button>
                    <button
                      type="button"
                      className="returnSaleButton"
                      onClick={() => openReturnPopup(sale)}
                      disabled={
                        isVoidedSale(sale) ||
                        isReturnSale(sale) ||
                        Boolean(returningSaleId) ||
                        returnableItemsForSale(sale).length === 0
                      }
                    >
                      {isReturnSale(sale)
                        ? "هذه فاتورة مرتجع / Return Receipt"
                        : returnableItemsForSale(sale).length === 0
                          ? "لا يوجد أصناف قابلة للمرتجع / No Returnable Items"
                          : "مرتجع أصناف / Return Items"}
                    </button>
                    {isVoidedSale(sale) ? (
                      <button
                        type="button"
                        className="reverseVoidButton"
                        onClick={() => openReverseVoidConfirm(sale)}
                        disabled={reversingVoidSaleId === sale.id}
                      >
                        {reversingVoidSaleId === sale.id
                          ? "جاري عكس الإلغاء... / Reversing Void..."
                          : "عكس الإلغاء / Reverse Void"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="voidSaleButton"
                        onClick={() => openVoidConfirm(sale)}
                        disabled={!canVoidSale(sale) || voidingSaleId === sale.id}
                      >
                        {voidingSaleId === sale.id ? "جاري الإلغاء... / Voiding..." : voidButtonLabel(sale)}
                      </button>
                    )}
                  </div>

                  <div className="itemsTableWrap">
                    <table>
                      <thead>
                        <tr>
                          <th>الصنف / Item</th>
                          <th>القسم / Department</th>
                          <th>الكمية / Qty</th>
                          <th>السعر / Price</th>
                          <th>المجموع / Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sale.items.map((item) => {
                          const alreadyReturned = returnedQuantityForItem(item);
                          const availableToReturn = availableReturnQuantity(item);

                          return (
                            <tr key={item.id}>
                              <td>
                                <strong>{item.product_name_ar}</strong>
                                {Number(item.discount_percent) > 0 && (
                                  <small>خصم / Discount {percent(Number(item.discount_percent))}</small>
                                )}
                                {alreadyReturned > 0 && (
                                  <small className="returnInfo">
                                    مرتجع سابقاً / Previously returned: {money(alreadyReturned)} • المتاح / Available:{" "}
                                    {money(availableToReturn)}
                                  </small>
                                )}
                              </td>
                              <td>{item.department_ar}</td>
                              <td>{Number(item.quantity)}</td>
                              <td>{money(Number(item.sale_price))} د.أ</td>
                              <td>
                                <strong className="lineTotal">
                                  {money(Number(item.line_total))} د.أ
                                </strong>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        <div ref={sentinelRef} className="loadMoreArea">
          {loading && <span>جاري تحميل المبيعات... / Loading sales...</span>}
          {!loading && hasMore && sales.length > 0 && <span>اسحب للأسفل لتحميل المزيد / Scroll down to load more</span>}
          {!loading && !hasMore && sales.length > 0 && <span>تم تحميل كل النتائج. / All results loaded.</span>}
        </div>
      </section>

      {voidSale && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="voidConfirmCard">
            <p className="eyebrow">تأكيد إلغاء الفاتورة / Confirm Void</p>
            <h2>إلغاء فاتورة رقم / Void Receipt No. {voidSale.sale_number ?? "—"}</h2>
            <p className="voidConfirmText">
              الإلغاء مسموح فقط في نفس يوم البيع. بعد انتهاء يوم البيع يجب استخدام المرتجع. أدخل رمز الدخول للتأكيد. / A void is allowed only on the sale day. After the sale day, use Return instead. Enter the login PIN to confirm.
            </p>

            <label htmlFor="void-pin">رمز الدخول / Login PIN</label>
            <input
              id="void-pin"
              value={voidPin}
              onChange={(event) =>
                setVoidPin(normalizeDigits(event.target.value).replace(/\D/g, "").slice(0, 6))
              }
              placeholder="أدخل رمز الدخول / Enter login PIN"
              inputMode="numeric"
              type="password"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void confirmVoidSale();
                }
              }}
            />

            {voidError && <div className="voidError">{voidError}</div>}

            <div className="voidPopupActions">
              <button
                type="button"
                className="cancelVoidButton"
                onClick={closeVoidConfirm}
                disabled={Boolean(voidingSaleId)}
              >
                رجوع / Back
              </button>
              <button
                type="button"
                className="confirmVoidButton"
                onClick={() => void confirmVoidSale()}
                disabled={Boolean(voidingSaleId)}
              >
                {voidingSaleId ? "جاري الإلغاء... / Voiding..." : "تأكيد الإلغاء / Confirm Void"}
              </button>
            </div>
          </div>
        </div>
      )}

      {reverseVoidSale && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="voidConfirmCard">
            <p className="eyebrow">عكس الإلغاء / Reverse Void</p>
            <h2>
              عكس إلغاء فاتورة رقم / Reverse Void for Receipt No.{" "}
              {reverseVoidSale.sale_number ?? "—"}
            </h2>
            <p className="voidConfirmText">
              سيعود هذا البيع إلى التقارير والمبيعات، وإذا كانت الفاتورة آجل فسيعود رصيدها إلى حساب العميل. استخدم هذا فقط لتصحيح إلغاء تم بالخطأ. / This restores the sale to reports and sales. If it was a credit sale, its balance returns to the customer account. Use this only to correct an accidental void.
            </p>
            <div className="reverseAuditBox">
              <span>وقت الإلغاء / Voided</span>
              <strong>
                {reverseVoidSale.voided_at
                  ? formatArabicDateTime(reverseVoidSale.voided_at)
                  : "غير مسجل للفاتورة القديمة / Not recorded for legacy void"}
              </strong>
            </div>

            <label htmlFor="reverse-void-pin">رمز الدخول / Login PIN</label>
            <input
              id="reverse-void-pin"
              value={reverseVoidPin}
              onChange={(event) =>
                setReverseVoidPin(
                  normalizeDigits(event.target.value).replace(/\D/g, "").slice(0, 6),
                )
              }
              placeholder="أدخل رمز الدخول / Enter login PIN"
              inputMode="numeric"
              type="password"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void confirmReverseVoid();
                }
              }}
            />

            {reverseVoidError && <div className="voidError">{reverseVoidError}</div>}

            <div className="voidPopupActions">
              <button
                type="button"
                className="cancelVoidButton"
                onClick={closeReverseVoidConfirm}
                disabled={Boolean(reversingVoidSaleId)}
              >
                رجوع / Back
              </button>
              <button
                type="button"
                className="reverseVoidConfirmButton"
                onClick={() => void confirmReverseVoid()}
                disabled={Boolean(reversingVoidSaleId)}
              >
                {reversingVoidSaleId
                  ? "جاري عكس الإلغاء... / Reversing Void..."
                  : "تأكيد عكس الإلغاء / Confirm Reverse Void"}
              </button>
            </div>
          </div>
        </div>
      )}

      {returnSale && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="returnConfirmCard">
            <p className="eyebrow">مرتجع أصناف / Return Items</p>
            <h2>مرتجع من فاتورة رقم / Return from Receipt No. {returnSale.sale_number ?? "—"}</h2>
            <p className="voidConfirmText">
              اختر الأصناف والكمية المراد إرجاعها. سيتم إنشاء فاتورة مرتجع بتاريخ اليوم، وتظهر قيمة المرتجع بالسالب في التقارير مع بقاء القيم موجبة في قاعدة البيانات. / Select items and quantities to return. A return receipt is created today; reports display it as negative while database values remain positive.
            </p>

            <div className="returnOriginalMeta">
              <div>
                <span>الفاتورة الأصلية / Original Receipt</span>
                <strong>{returnSale.sale_number ?? "—"}</strong>
              </div>
              <div>
                <span>تاريخ البيع الأصلي / Original Sale Date</span>
                <strong>{formatArabicDateTime(returnSale.created_at)}</strong>
              </div>
              <div>
                <span>طريقة الدفع الأصلية / Original Payment Method</span>
                <strong>{tenderLabel(returnSale.payment_method)}</strong>
              </div>
              <div>
                <span>قيمة المرتجع المختار / Selected Return Value</span>
                <strong className="redText">-{money(returnPreviewTotal)} د.أ</strong>
              </div>
            </div>

            <div className="returnItemsBox">
              {returnableItemsForSale(returnSale).length === 0 ? (
                <div className="emptyReturnState">كل أصناف هذه الفاتورة تم إرجاعها سابقاً. / All items on this receipt were already returned.</div>
              ) : (
                returnSale.items.map((item) => {
                  const available = availableReturnQuantity(item);
                  if (available <= 0.0001) return null;

                  const enteredQuantity = returnQuantities[item.id] ?? "";
                  const lineReturnTotal =
                    parsePositiveQuantity(enteredQuantity) * Number(item.sale_price || 0);

                  return (
                    <div className="returnItemRow" key={item.id}>
                      <div className="returnItemInfo">
                        <strong>{item.product_name_ar}</strong>
                        <span>{item.department_ar}</span>
                        <small>
                          مباع / Sold: {money(Number(item.quantity || 0))} • مرتجع سابقاً / Returned:{" "}
                          {money(returnedQuantityForItem(item))} • المتاح / Available: {money(available)}
                        </small>
                        <small>
                          سعر الوحدة / Unit price: {money(Number(item.sale_price || 0))} د.أ • قيمة هذا المرتجع / Return value:{" "}
                          -{money(lineReturnTotal)} د.أ
                        </small>
                      </div>

                      <div className="returnQuantityBox">
                        <label htmlFor={`return-${item.id}`}>كمية المرتجع / Return Qty</label>
                        <input
                          id={`return-${item.id}`}
                          value={enteredQuantity}
                          onChange={(event) => updateReturnQuantity(item.id, event.target.value)}
                          placeholder="0"
                          inputMode="decimal"
                        />
                        <button
                          type="button"
                          className="returnAllButton"
                          onClick={() => updateReturnQuantity(item.id, String(available))}
                        >
                          إرجاع المتاح / Return Available
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <label htmlFor="return-pin">رمز الدخول للتأكيد / Login PIN to Confirm</label>
            <input
              id="return-pin"
              value={returnPin}
              onChange={(event) =>
                setReturnPin(normalizeDigits(event.target.value).replace(/\D/g, "").slice(0, 6))
              }
              placeholder="أدخل رمز الدخول / Enter login PIN"
              inputMode="numeric"
              type="password"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void confirmReturnItems();
                }
              }}
            />

            {returnError && <div className="voidError">{returnError}</div>}

            <div className="voidPopupActions">
              <button
                type="button"
                className="cancelVoidButton"
                onClick={closeReturnPopup}
                disabled={Boolean(returningSaleId)}
              >
                رجوع / Back
              </button>
              <button
                type="button"
                className="confirmReturnButton"
                onClick={() => void confirmReturnItems()}
                disabled={Boolean(returningSaleId) || returnPreviewTotal <= 0}
              >
                {returningSaleId ? "جاري تسجيل المرتجع... / Saving return..." : "تأكيد المرتجع / Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .historyPage {
          min-height: 100vh;
          background: #f4f6f8;
          color: #111827;
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .topCard,
        .searchCard,
        .listCard,
        .warning,
        .errorBox,
        .successBox {
          max-width: 1200px;
          margin: 0 auto 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .topCard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 22px;
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

        .topActions,
        .searchRow {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          border: 0;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .primaryButton {
          background: #111827;
          color: white;
        }

        .secondaryButton,
        .searchRow button {
          background: white;
          color: #111827;
          border: 1px solid #111827;
        }

        .warning {
          padding: 14px 18px;
          background: #fff7ed;
          border-color: #fed7aa;
          color: #9a3412;
        }

        .errorBox {
          padding: 14px 18px;
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
          font-weight: 700;
        }

        .successBox {
          padding: 14px 18px;
          background: #dcfce7;
          border-color: #bbf7d0;
          color: #166534;
          font-weight: 800;
        }

        .searchCard {
          padding: 18px;
          position: sticky;
          top: 12px;
          z-index: 5;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 800;
        }

        .searchRow input {
          flex: 1;
          min-width: 260px;
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

        .searchHint {
          margin: 10px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .listCard {
          padding: 18px;
        }

        .emptyState {
          padding: 24px;
          text-align: center;
          color: #6b7280;
          border: 1px dashed #d1d5db;
          border-radius: 16px;
        }

        .saleCard {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          background: white;
          margin-bottom: 12px;
        }

        .voidedSaleCard {
          border-color: #fecaca;
          background: #fff7f7;
        }

        .voidedSaleCard .saleTop {
          background: #fef2f2;
        }

        .voidBadge {
          display: inline-flex;
          width: fit-content;
          margin-top: 4px;
          border: 1px solid #fecaca;
          border-radius: 999px;
          padding: 4px 8px;
          background: white;
          color: #b91c1c;
          font-style: normal;
          font-size: 12px;
          font-weight: 900;
        }

        .saleTop {
          width: 100%;
          border: 0;
          border-radius: 0;
          background: white;
          color: #111827;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          text-align: right;
        }

        .saleTop:hover {
          background: #f9fafb;
        }

        .saleTitleBlock,
        .saleMoneyBlock {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .saleTitleBlock strong {
          font-size: 18px;
        }

        .saleTitleBlock span,
        .saleMoneyBlock span,
        .saleMoneyBlock small {
          color: #6b7280;
          font-size: 13px;
        }

        .saleMoneyBlock {
          align-items: flex-end;
          min-width: 170px;
        }

        .totalAmount {
          color: #dc2626;
          font-size: 22px;
        }

        .changeAmount {
          color: #15803d !important;
          font-weight: 800;
        }

        .itemsPanel {
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          background: #f9fafb;
        }

        .receiptMeta {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .receiptActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .printReceiptButton {
          background: #111827;
          color: white;
        }

        .voidSaleButton {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .reverseVoidButton {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .returnSaleButton {
          background: #fff7ed;
          color: #9a3412;
          border: 1px solid #fed7aa;
        }

        .voidSaleButton:disabled,
        .reverseVoidButton:disabled,
        .returnSaleButton:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          border-color: #e5e7eb;
        }

        .redText {
          color: #b91c1c;
        }

        .voidAuditLine {
          color: #991b1b !important;
          font-weight: 800;
        }

        .reverseAuditLine {
          color: #166534 !important;
          font-weight: 800;
        }

        .receiptMeta div {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
        }

        .receiptMeta span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .receiptMeta strong {
          font-size: 15px;
        }

        .itemsTableWrap {
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          background: white;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }

        th {
          background: #f3f4f6;
          color: #374151;
          font-size: 12px;
          text-align: right;
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        td {
          padding: 12px 10px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        tr:last-child td {
          border-bottom: 0;
        }

        td strong {
          display: block;
        }

        td small {
          display: block;
          margin-top: 4px;
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
        }

        .lineTotal {
          color: #dc2626;
        }

        .loadMoreArea {
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-weight: 700;
        }

        .popupBackdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.58);
        }

        .voidConfirmCard,
        .returnConfirmCard {
          width: min(520px, 100%);
          background: white;
          border-radius: 22px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
        }

        .returnConfirmCard {
          width: min(900px, 100%);
          max-height: 92vh;
          overflow: auto;
        }

        .voidConfirmCard h2,
        .returnConfirmCard h2 {
          margin: 0 0 10px;
          font-size: 26px;
        }

        .voidConfirmText {
          color: #4b5563;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .voidError {
          margin-top: 10px;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 10px 12px;
          background: #fef2f2;
          color: #991b1b;
          font-weight: 800;
        }

        .voidPopupActions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 16px;
        }

        .cancelVoidButton {
          background: #f3f4f6;
          color: #111827;
        }

        .confirmVoidButton {
          background: #b91c1c;
          color: white;
        }

        .reverseVoidConfirmButton {
          background: #166534;
          color: white;
        }

        .reverseAuditBox {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin: 0 0 16px;
          padding: 12px 14px;
          border-radius: 14px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
        }

        .reverseAuditBox span {
          color: #6b7280;
          font-size: 13px;
          font-weight: 700;
        }

        .reverseAuditBox strong {
          text-align: left;
          font-size: 13px;
        }

        .confirmReturnButton {
          background: #c2410c;
          color: white;
        }

        .returnInfo {
          color: #9a3412 !important;
        }

        .returnOriginalMeta {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .returnOriginalMeta div {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
        }

        .returnOriginalMeta span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .returnItemsBox {
          display: grid;
          gap: 10px;
          margin: 14px 0;
        }

        .returnItemRow {
          display: grid;
          grid-template-columns: 1fr 190px;
          gap: 12px;
          align-items: stretch;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 12px;
          background: #fff;
        }

        .returnItemInfo {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .returnItemInfo span,
        .returnItemInfo small {
          color: #6b7280;
          font-size: 12px;
          font-weight: 800;
        }

        .returnQuantityBox {
          display: grid;
          gap: 8px;
        }

        .returnQuantityBox label {
          margin: 0;
          font-size: 12px;
        }

        .returnAllButton {
          background: #fff7ed;
          color: #9a3412;
          border: 1px solid #fed7aa;
          padding: 10px;
        }

        .emptyReturnState {
          border: 1px dashed #fed7aa;
          border-radius: 14px;
          padding: 18px;
          color: #9a3412;
          background: #fff7ed;
          font-weight: 800;
          text-align: center;
        }

        .confirmVoidButton:disabled,
        .confirmReturnButton:disabled,
        .cancelVoidButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .historyPage {
            padding: 14px;
          }

          .topCard,
          .saleTop,
          .receiptMeta,
          .returnOriginalMeta,
          .returnItemRow,
          .voidPopupActions {
            grid-template-columns: 1fr;
          }

          .topCard,
          .saleTop {
            align-items: stretch;
            flex-direction: column;
          }

          .saleMoneyBlock {
            align-items: flex-start;
          }

          .searchCard {
            position: static;
          }
        }
      `}</style>
    </main>
  );
}
