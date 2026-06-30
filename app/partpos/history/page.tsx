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
  if (value === "cash") return "نقداً";
  return value || "نقداً";
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

      <section className="listCard">
        {sales.length === 0 && !loading && !error && (
          <div className="emptyState">
            {search.trim() ? "لا يوجد نتائج مطابقة للبحث." : "لا يوجد مبيعات محفوظة حتى الآن."}
          </div>
        )}

        {sales.map((sale) => {
          const isOpen = openSaleId === sale.id;

          return (
            <article className="saleCard" key={sale.id}>
              <button
                type="button"
                className="saleTop"
                onClick={() => setOpenSaleId(isOpen ? null : sale.id)}
              >
                <div className="saleTitleBlock">
                  <strong>فاتورة رقم {sale.sale_number ?? "—"}</strong>
                  <span>{formatArabicDateTime(sale.created_at)}</span>
                  <span>
                    {sale.item_count} أصناف • {tenderLabel(sale.payment_method)}
                  </span>
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
        .errorBox {
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
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

        @media (max-width: 760px) {
          .historyPage {
            padding: 14px;
          }

          .topCard,
          .saleTop,
          .receiptMeta {
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