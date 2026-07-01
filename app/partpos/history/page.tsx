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
  if (value === "credit") return "ائتمان";
  if (value === "cash") return "نقداً";
  return value || "نقداً";
}

function statusLabel(value: string) {
  if (String(value || "").toLowerCase() === "voided") return "ملغاة / VOID";
  if (value === "credit") return "ائتمان";
  if (value === "cashed_out") return "مكتملة";
  return value || "مكتملة";
}

function isVoidedSale(sale: Sale) {
  return String(sale.status || "").toLowerCase() === "voided";
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
  const [openSaleId, setOpenSaleId] = useState<string | null>(null);

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
            "id, sale_number, payment_method, status, sale_total, amount_paid, change_due, item_count, created_at",
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
          items: itemsBySaleId[String(sale.id)] ?? [],
        }));

        setSales((current) => (reset ? nextSales : [...current, ...nextSales]));
        offsetRef.current = nextOffset + nextSales.length;
        setHasMore(nextSales.length === PAGE_SIZE);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "حدث خطأ أثناء تحميل سجل المبيعات.";
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
              <strong>${escapeReceiptText(item.product_name_ar || "صنف")}</strong>
              <small>${escapeReceiptText(item.department_ar || "")}${
                discount > 0 ? ` • خصم ${escapeReceiptText(percent(discount))}` : ""
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
  <title>فاتورة ${escapeReceiptText(saleNumber)}</title>
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
      <h1>فاتورة مبيعات</h1>
      <p>نسخة العميل من سجل المبيعات</p>
    </div>

    ${voided ? `<div class="voidStamp">VOID / ملغاة</div>` : ""}

    <div class="meta">
      <div class="metaRow"><span>رقم الفاتورة</span><strong>${escapeReceiptText(saleNumber)}</strong></div>
      <div class="metaRow"><span>التاريخ</span><strong>${escapeReceiptText(formatArabicDateTime(sale.created_at))}</strong></div>
      <div class="metaRow"><span>طريقة الدفع</span><strong>${escapeReceiptText(tenderLabel(sale.payment_method))}</strong></div>
      <div class="metaRow"><span>الحالة</span><strong>${escapeReceiptText(statusLabel(sale.status))}</strong></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>الصنف</th>
          <th>كمية</th>
          <th>سعر</th>
          <th>مجموع</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="totals">
      <div class="totalLine"><span>عدد الأصناف</span><strong>${money(Number(sale.item_count || 0))}</strong></div>
      <div class="totalLine grandTotal"><span>الإجمالي</span><strong>${money(Number(sale.sale_total || 0))} د.أ</strong></div>
      <div class="totalLine"><span>المدفوع</span><strong>${money(Number(sale.amount_paid || 0))} د.أ</strong></div>
      <div class="totalLine"><span>الراجع</span><strong>${money(Number(sale.change_due || 0))} د.أ</strong></div>
    </div>

    <div class="footer">
      <strong>شكراً لكم</strong>
      <p>احتفظ بالفاتورة للمراجعة.</p>
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
      setActionMessage("المتصفح منع فتح نافذة الطباعة. اسمح بالـ popups ثم حاول مرة ثانية.");
      return;
    }

    receiptWindow.document.open();
    receiptWindow.document.write(buildReceiptHtml(sale));
    receiptWindow.document.close();
  }

  function openVoidConfirm(sale: Sale) {
    if (isVoidedSale(sale)) return;

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

  async function confirmVoidSale() {
    if (!supabase || !voidSale) return;

    if (voidPin !== EMPLOYEE_LOGIN_PIN) {
      setVoidError("الرمز غير صحيح. أدخل رمز الدخول لإلغاء الفاتورة.");
      setVoidPin("");
      return;
    }

    setVoidingSaleId(voidSale.id);
    setVoidError("");

    try {
      const { error: updateError } = await supabase
        .from("partpos_sales")
        .update({ status: "voided" })
        .eq("id", voidSale.id);

      if (updateError) throw updateError;

      setSales((current) =>
        current.map((sale) =>
          sale.id === voidSale.id ? { ...sale, status: "voided" } : sale,
        ),
      );
      setActionMessage(`تم إلغاء الفاتورة رقم ${voidSale.sale_number ?? "—"}.`);
      setVoidSale(null);
      setVoidPin("");
    } catch (caught) {
      setVoidError(`خطأ Supabase: ${readSupabaseError(caught)}`);
    } finally {
      setVoidingSaleId(null);
    }
  }

  return (
    <main className="historyPage" dir="rtl">
      <section className="topCard">
        <div>
          <p className="eyebrow">PartPOS</p>
          <h1>سجل المبيعات</h1>
          <p className="subtext">أحدث الفواتير تظهر أولاً. يتم تحميل 20 فاتورة كل مرة.</p>
        </div>
        <div className="topActions">
          <button type="button" className="secondaryButton" onClick={backToPOS}>
            الرجوع للكاشير
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
            {loading ? "جاري التحديث..." : "تحديث السجل"}
          </button>
        </div>
      </section>

      {!supabase && (
        <div className="warning">
          أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY حتى يظهر سجل المبيعات.
        </div>
      )}

      <section className="searchCard">
        <label htmlFor="history-search">بحث في السجل</label>
        <div className="searchRow">
          <input
            id="history-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث باسم القطعة، التاريخ 2026-06-30، أو رقم الفاتورة"
            autoComplete="off"
          />
          {search.trim() && (
            <button type="button" onClick={clearSearch}>
              مسح
            </button>
          )}
        </div>
        <p className="searchHint">
          أمثلة: فلتر زيت، 1، فاتورة 1، 30/06/2026، 2026-06-30
        </p>
      </section>

      {error && <div className="errorBox">{error}</div>}
      {actionMessage && <div className="successBox">{actionMessage}</div>}

      <section className="listCard">
        {sales.length === 0 && !loading && !error && (
          <div className="emptyState">
            {search.trim() ? "لا يوجد نتائج مطابقة للبحث." : "لا يوجد مبيعات محفوظة حتى الآن."}
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
                  <strong>فاتورة رقم {sale.sale_number ?? "—"}</strong>
                  <span>{formatArabicDateTime(sale.created_at)}</span>
                  <span>
                    {sale.item_count} أصناف • {tenderLabel(sale.payment_method)} •{" "}
                    {statusLabel(sale.status)}
                  </span>
                  {isVoidedSale(sale) && <em className="voidBadge">VOID / ملغاة</em>}
                </div>

                <div className="saleMoneyBlock">
                  <span>الإجمالي</span>
                  <strong className="totalAmount">{money(sale.sale_total)} د.أ</strong>
                  <small>مدفوع: {money(sale.amount_paid)} د.أ</small>
                  <small className="changeAmount">راجع: {money(sale.change_due)} د.أ</small>
                </div>
              </button>

              {isOpen && (
                <div className="itemsPanel">
                  <div className="receiptMeta">
                    <div>
                      <span>رقم الفاتورة</span>
                      <strong>{sale.sale_number ?? "—"}</strong>
                    </div>
                    <div>
                      <span>الوقت والتاريخ</span>
                      <strong>{formatArabicDateTime(sale.created_at)}</strong>
                    </div>
                    <div>
                      <span>طريقة الدفع</span>
                      <strong>{tenderLabel(sale.payment_method)}</strong>
                    </div>
                    <div>
                      <span>الحالة</span>
                      <strong className={isVoidedSale(sale) ? "redText" : ""}>
                        {statusLabel(sale.status)}
                      </strong>
                    </div>
                  </div>

                  <div className="receiptActions">
                    <button
                      type="button"
                      className="printReceiptButton"
                      onClick={() => printSaleReceipt(sale)}
                    >
                      طباعة الفاتورة
                    </button>
                    <button
                      type="button"
                      className="voidSaleButton"
                      onClick={() => openVoidConfirm(sale)}
                      disabled={isVoidedSale(sale) || voidingSaleId === sale.id}
                    >
                      {isVoidedSale(sale) ? "الفاتورة ملغاة" : "إلغاء / Void"}
                    </button>
                  </div>

                  <div className="itemsTableWrap">
                    <table>
                      <thead>
                        <tr>
                          <th>الصنف</th>
                          <th>القسم</th>
                          <th>الكمية</th>
                          <th>السعر</th>
                          <th>المجموع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sale.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>{item.product_name_ar}</strong>
                              {Number(item.discount_percent) > 0 && (
                                <small>خصم {percent(Number(item.discount_percent))}</small>
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        <div ref={sentinelRef} className="loadMoreArea">
          {loading && <span>جاري تحميل المبيعات...</span>}
          {!loading && hasMore && sales.length > 0 && <span>اسحب للأسفل لتحميل المزيد</span>}
          {!loading && !hasMore && sales.length > 0 && <span>تم تحميل كل النتائج.</span>}
        </div>
      </section>

      {voidSale && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="voidConfirmCard">
            <p className="eyebrow">تأكيد إلغاء الفاتورة</p>
            <h2>إلغاء فاتورة رقم {voidSale.sale_number ?? "—"}</h2>
            <p className="voidConfirmText">
              هذا سيضع علامة VOID على الفاتورة داخل سجل المبيعات. أدخل رمز الدخول للتأكيد.
            </p>

            <label htmlFor="void-pin">رمز الدخول</label>
            <input
              id="void-pin"
              value={voidPin}
              onChange={(event) =>
                setVoidPin(normalizeDigits(event.target.value).replace(/\D/g, "").slice(0, 6))
              }
              placeholder="أدخل رمز الدخول"
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
                رجوع
              </button>
              <button
                type="button"
                className="confirmVoidButton"
                onClick={() => void confirmVoidSale()}
                disabled={Boolean(voidingSaleId)}
              >
                {voidingSaleId ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
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

        .voidSaleButton:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          border-color: #e5e7eb;
        }

        .redText {
          color: #b91c1c;
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

        .voidConfirmCard {
          width: min(520px, 100%);
          background: white;
          border-radius: 22px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
        }

        .voidConfirmCard h2 {
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

        .confirmVoidButton:disabled,
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