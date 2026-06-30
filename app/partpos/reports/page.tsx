"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

type ReportMode = "department" | "items";
type ReportRange = "today" | "this_week" | "this_month" | "last_month" | "year_to_date" | "custom";

type SaleRow = {
  id: string;
  sale_number: number | null;
  sale_total: number;
  amount_paid: number;
  change_due: number;
  created_at: string;
};

type SaleItem = {
  id: string;
  sale_id: string;
  product_name_ar: string;
  department_ar: string;
  quantity: number;
  cost: number;
  sale_price: number;
  line_total: number;
  created_at: string;
};

type DepartmentReportRow = {
  department: string;
  receiptCount: number;
  itemLines: number;
  quantity: number;
  totalCost: number;
  totalSales: number;
  profit: number;
  marginPercent: number;
};

type ItemReportRow = {
  productName: string;
  department: string;
  receiptCount: number;
  quantity: number;
  totalCost: number;
  totalSales: number;
  averageSalePrice: number;
  profit: number;
  marginPercent: number;
};

function money(value: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0.00";
  return numeric.toFixed(2);
}

function percent(value: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0.00%";
  return `${numeric.toFixed(2)}%`;
}

function localDateInputValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endDateInputValue(date: Date) {
  return localDateInputValue(date);
}

function getPresetRange(range: ReportRange) {
  const today = startOfLocalDay(new Date());

  if (range === "today") {
    return {
      startDate: localDateInputValue(today),
      endDate: localDateInputValue(today),
    };
  }

  if (range === "this_week") {
    const start = new Date(today);
    const day = start.getDay(); // Sunday = 0
    start.setDate(today.getDate() - day);

    return {
      startDate: localDateInputValue(start),
      endDate: localDateInputValue(today),
    };
  }

  if (range === "this_month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      startDate: localDateInputValue(start),
      endDate: localDateInputValue(today),
    };
  }

  if (range === "last_month") {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);

    return {
      startDate: localDateInputValue(start),
      endDate: endDateInputValue(end),
    };
  }

  if (range === "year_to_date") {
    const start = new Date(today.getFullYear(), 0, 1);

    return {
      startDate: localDateInputValue(start),
      endDate: localDateInputValue(today),
    };
  }

  return {
    startDate: localDateInputValue(today),
    endDate: localDateInputValue(today),
  };
}

function rangeLabel(range: ReportRange) {
  if (range === "today") return "اليوم";
  if (range === "this_week") return "هذا الأسبوع";
  if (range === "this_month") return "هذا الشهر";
  if (range === "last_month") return "الشهر الماضي";
  if (range === "year_to_date") return "من بداية السنة";
  return "تخصيص";
}

function dayRange(dateValue: string, endDateValue: string) {
  const parseDate = (value: string) => {
    const [yearText, monthText, dayText] = value.split("-");
    return {
      year: Number(yearText),
      month: Number(monthText),
      day: Number(dayText),
    };
  };

  const startParts = parseDate(dateValue);
  const endParts = parseDate(endDateValue || dateValue);

  const start =
    startParts.year && startParts.month && startParts.day
      ? new Date(startParts.year, startParts.month - 1, startParts.day, 0, 0, 0, 0)
      : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);

  const end =
    endParts.year && endParts.month && endParts.day
      ? new Date(endParts.year, endParts.month - 1, endParts.day + 1, 0, 0, 0, 0)
      : new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, 0, 0, 0, 0);

  return { start, end };
}

function formatArabicDate(value: string) {
  const { start } = dayRange(value, value);
  return start.toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

function formatArabicDateRange(startDate: string, endDate: string) {
  if (startDate === endDate) return formatArabicDate(startDate);
  return `${formatArabicDate(startDate)} - ${formatArabicDate(endDate)}`;
}

function backToPOS() {
  if (typeof window === "undefined") return;
  window.location.href = "/partpos";
}

function openEndOfDayReport() {
  if (typeof window === "undefined") return;
  window.open("/partpos/end-of-day", "_blank", "noopener,noreferrer");
}

export default function PartPOSReportsPage() {
  const [mode, setMode] = useState<ReportMode>("department");
  const [rangePreset, setRangePreset] = useState<ReportRange>("today");
  const [startDate, setStartDate] = useState(() => getPresetRange("today").startDate);
  const [endDate, setEndDate] = useState(() => getPresetRange("today").endDate);
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
  }, []);

  function handleRangeChange(nextRange: ReportRange) {
    setRangePreset(nextRange);

    if (nextRange !== "custom") {
      const nextDates = getPresetRange(nextRange);
      setStartDate(nextDates.startDate);
      setEndDate(nextDates.endDate);
    }
  }

  const selectedRangeText =
    rangePreset === "custom"
      ? formatArabicDateRange(startDate, endDate)
      : `${rangeLabel(rangePreset)} • ${formatArabicDateRange(startDate, endDate)}`;

  const loadReports = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError("");

    try {
      const { start, end } = dayRange(startDate, endDate);

      const { data: saleRows, error: salesError } = await supabase
        .from("partpos_sales")
        .select("id, sale_number, sale_total, amount_paid, change_due, created_at")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: false })
        .limit(10000);

      if (salesError) throw salesError;

      const cleanSales: SaleRow[] = (saleRows ?? []).map((sale) => ({
        id: String(sale.id),
        sale_number:
          sale.sale_number === null || sale.sale_number === undefined
            ? null
            : Number(sale.sale_number),
        sale_total: Number(sale.sale_total ?? 0),
        amount_paid: Number(sale.amount_paid ?? 0),
        change_due: Number(sale.change_due ?? 0),
        created_at: String(sale.created_at),
      }));

      const saleIds = cleanSales.map((sale) => sale.id);
      let cleanItems: SaleItem[] = [];

      if (saleIds.length > 0) {
        const { data: itemRows, error: itemsError } = await supabase
          .from("partpos_sale_items")
          .select(
            "id, sale_id, product_name_ar, department_ar, quantity, cost, sale_price, line_total, created_at",
          )
          .in("sale_id", saleIds)
          .order("created_at", { ascending: true })
          .limit(50000);

        if (itemsError) throw itemsError;

        cleanItems = (itemRows ?? []).map((item) => ({
          id: String(item.id),
          sale_id: String(item.sale_id),
          product_name_ar: String(item.product_name_ar ?? ""),
          department_ar: String(item.department_ar ?? ""),
          quantity: Number(item.quantity ?? 0),
          cost: Number(item.cost ?? 0),
          sale_price: Number(item.sale_price ?? 0),
          line_total: Number(item.line_total ?? 0),
          created_at: String(item.created_at),
        }));
      }

      setSales(cleanSales);
      setItems(cleanItems);
      setLastUpdated(
        new Date().toLocaleTimeString("ar-JO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "حدث خطأ أثناء تحميل التقارير.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [endDate, startDate, supabase]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const receiptSetsByDepartment = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد";
      if (!groups[department]) groups[department] = new Set<string>();
      groups[department].add(item.sale_id);
    }

    return groups;
  }, [items]);

  const receiptSetsByItem = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    for (const item of items) {
      const productName = item.product_name_ar.trim() || "قطعة بدون اسم";
      const department = item.department_ar.trim() || "غير محدد";
      const key = `${productName}__${department}`;

      if (!groups[key]) groups[key] = new Set<string>();
      groups[key].add(item.sale_id);
    }

    return groups;
  }, [items]);

  const departmentRows = useMemo<DepartmentReportRow[]>(() => {
    const groups: Record<string, DepartmentReportRow> = {};

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد";
      const quantity = Number(item.quantity) || 0;
      const totalCost = (Number(item.cost) || 0) * quantity;
      const totalSales = Number(item.line_total) || 0;

      if (!groups[department]) {
        groups[department] = {
          department,
          receiptCount: 0,
          itemLines: 0,
          quantity: 0,
          totalCost: 0,
          totalSales: 0,
          profit: 0,
          marginPercent: 0,
        };
      }

      groups[department].itemLines += 1;
      groups[department].quantity += quantity;
      groups[department].totalCost += totalCost;
      groups[department].totalSales += totalSales;
      groups[department].profit += totalSales - totalCost;
    }

    return Object.values(groups)
      .map((row) => ({
        ...row,
        receiptCount: receiptSetsByDepartment[row.department]?.size ?? 0,
        marginPercent: row.totalSales > 0 ? (row.profit / row.totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [items, receiptSetsByDepartment]);

  const itemRows = useMemo<ItemReportRow[]>(() => {
    const groups: Record<string, ItemReportRow> = {};

    for (const item of items) {
      const productName = item.product_name_ar.trim() || "قطعة بدون اسم";
      const department = item.department_ar.trim() || "غير محدد";
      const key = `${productName}__${department}`;
      const quantity = Number(item.quantity) || 0;
      const totalCost = (Number(item.cost) || 0) * quantity;
      const totalSales = Number(item.line_total) || 0;

      if (!groups[key]) {
        groups[key] = {
          productName,
          department,
          receiptCount: 0,
          quantity: 0,
          totalCost: 0,
          totalSales: 0,
          averageSalePrice: 0,
          profit: 0,
          marginPercent: 0,
        };
      }

      groups[key].quantity += quantity;
      groups[key].totalCost += totalCost;
      groups[key].totalSales += totalSales;
      groups[key].profit += totalSales - totalCost;
    }

    return Object.entries(groups)
      .map(([key, row]) => ({
        ...row,
        receiptCount: receiptSetsByItem[key]?.size ?? 0,
        averageSalePrice: row.quantity > 0 ? row.totalSales / row.quantity : 0,
        marginPercent: row.totalSales > 0 ? (row.profit / row.totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [items, receiptSetsByItem]);

  const totalCost = items.reduce(
    (sum, item) => sum + (Number(item.cost) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const totalSales = items.reduce((sum, item) => sum + (Number(item.line_total) || 0), 0);
  const totalProfit = totalSales - totalCost;
  const totalMarginPercent = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const activeRowsCount = mode === "department" ? departmentRows.length : itemRows.length;

  return (
    <main className="reportsPage" dir="rtl">
      <section className="topCard noPrint">
        <div>
          <p className="eyebrow">PartPOS</p>
          <h1>التقارير</h1>
          <p className="subtext">
            التقرير مرتب من الأعلى مبيعاً إلى الأقل، مع التكلفة والمبيعات والربح.
          </p>
        </div>

        <div className="topActions">
          <button type="button" className="secondaryButton" onClick={backToPOS}>
            الرجوع للكاشير
          </button>
          <button type="button" className="secondaryButton" onClick={openEndOfDayReport}>
            تقرير نهاية اليوم
          </button>
          <button type="button" className="printButton" onClick={() => window.print()}>
            طباعة التقرير
          </button>
        </div>
      </section>

      {!supabase && (
        <div className="warning noPrint">
          أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY حتى تظهر التقارير.
        </div>
      )}

      <section className="controlsCard noPrint">
        <div className="dateControls">
          <div>
            <label htmlFor="range-preset">فترة التقرير</label>
            <select
              id="range-preset"
              value={rangePreset}
              onChange={(event) => handleRangeChange(event.target.value as ReportRange)}
            >
              <option value="today">اليوم</option>
              <option value="this_week">هذا الأسبوع</option>
              <option value="this_month">هذا الشهر</option>
              <option value="last_month">الشهر الماضي</option>
              <option value="year_to_date">من بداية السنة</option>
              <option value="custom">تخصيص</option>
            </select>
          </div>

          {rangePreset === "custom" ? (
            <>
              <div>
                <label htmlFor="start-date">من تاريخ</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="end-date">إلى تاريخ</label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="selectedPeriodBox">
              <label>الفترة المحددة</label>
              <strong>{selectedRangeText}</strong>
            </div>
          )}

          <button
            type="button"
            className="primaryButton"
            onClick={() => void loadReports()}
            disabled={!supabase || loading}
          >
            {loading ? "جاري التحميل..." : "تحديث التقرير"}
          </button>
        </div>

        <div className="modeTabs">
          <button
            type="button"
            className={mode === "department" ? "tabButton activeTab" : "tabButton"}
            onClick={() => setMode("department")}
          >
            تقرير حسب القسم
          </button>
          <button
            type="button"
            className={mode === "items" ? "tabButton activeTab" : "tabButton"}
            onClick={() => setMode("items")}
          >
            تقرير حسب القطع
          </button>
        </div>
      </section>

      {error && <div className="errorBox noPrint">{error}</div>}

      <section className="reportSheet">
        <div className="printHeader">
          <div>
            <p className="eyebrow">PartPOS</p>
            <h2>{mode === "department" ? "تقرير حسب القسم" : "تقرير حسب القطع"}</h2>
            <p>{formatArabicDateRange(startDate, endDate)}</p>
          </div>

          <div className="reportMeta">
            <span>عدد الفواتير</span>
            <strong>{sales.length}</strong>
            <small>{lastUpdated ? `آخر تحديث: ${lastUpdated}` : ""}</small>
          </div>
        </div>

        <div className="summaryGrid">
          <div className="summaryBox">
            <span>عدد السطور</span>
            <strong>{activeRowsCount}</strong>
          </div>
          <div className="summaryBox">
            <span>إجمالي الكمية</span>
            <strong>{money(totalQuantity)}</strong>
          </div>
          <div className="summaryBox">
            <span>إجمالي التكلفة</span>
            <strong>{money(totalCost)} د.أ</strong>
          </div>
          <div className="summaryBox redBox">
            <span>إجمالي البيع</span>
            <strong>{money(totalSales)} د.أ</strong>
          </div>
          <div className="summaryBox greenBox">
            <span>إجمالي الربح</span>
            <strong>{money(totalProfit)} د.أ</strong>
          </div>
          <div className="summaryBox">
            <span>هامش الربح</span>
            <strong>{percent(totalMarginPercent)}</strong>
          </div>
        </div>

        <section className="tableSection">
          {mode === "department" ? (
            departmentRows.length === 0 ? (
              <div className="emptyState">لا يوجد مبيعات ضمن الفترة المحددة.</div>
            ) : (
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>القسم</th>
                      <th>عدد الفواتير</th>
                      <th>عدد السطور</th>
                      <th>الكمية</th>
                      <th>إجمالي التكلفة</th>
                      <th>إجمالي البيع</th>
                      <th>الربح</th>
                      <th>الهامش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentRows.map((row) => (
                      <tr key={row.department}>
                        <td>
                          <strong>{row.department}</strong>
                        </td>
                        <td>{row.receiptCount}</td>
                        <td>{row.itemLines}</td>
                        <td>{money(row.quantity)}</td>
                        <td>{money(row.totalCost)} د.أ</td>
                        <td>
                          <strong className="redText">{money(row.totalSales)} د.أ</strong>
                        </td>
                        <td>
                          <strong className={row.profit >= 0 ? "greenText" : "redText"}>
                            {money(row.profit)} د.أ
                          </strong>
                        </td>
                        <td>{percent(row.marginPercent)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>الإجمالي</td>
                      <td>{sales.length}</td>
                      <td>{items.length}</td>
                      <td>{money(totalQuantity)}</td>
                      <td>{money(totalCost)} د.أ</td>
                      <td>{money(totalSales)} د.أ</td>
                      <td>{money(totalProfit)} د.أ</td>
                      <td>{percent(totalMarginPercent)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )
          ) : itemRows.length === 0 ? (
            <div className="emptyState">لا يوجد مبيعات ضمن الفترة المحددة.</div>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>اسم القطعة</th>
                    <th>القسم</th>
                    <th>عدد الفواتير</th>
                    <th>الكمية</th>
                    <th>متوسط سعر البيع</th>
                    <th>إجمالي التكلفة</th>
                    <th>إجمالي البيع</th>
                    <th>الربح</th>
                    <th>الهامش</th>
                  </tr>
                </thead>
                <tbody>
                  {itemRows.map((row) => (
                    <tr key={`${row.productName}-${row.department}`}>
                      <td>
                        <strong>{row.productName}</strong>
                      </td>
                      <td>{row.department}</td>
                      <td>{row.receiptCount}</td>
                      <td>{money(row.quantity)}</td>
                      <td>{money(row.averageSalePrice)} د.أ</td>
                      <td>{money(row.totalCost)} د.أ</td>
                      <td>
                        <strong className="redText">{money(row.totalSales)} د.أ</strong>
                      </td>
                      <td>
                        <strong className={row.profit >= 0 ? "greenText" : "redText"}>
                          {money(row.profit)} د.أ
                        </strong>
                      </td>
                      <td>{percent(row.marginPercent)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>الإجمالي</td>
                    <td>—</td>
                    <td>{sales.length}</td>
                    <td>{money(totalQuantity)}</td>
                    <td>—</td>
                    <td>{money(totalCost)} د.أ</td>
                    <td>{money(totalSales)} د.أ</td>
                    <td>{money(totalProfit)} د.أ</td>
                    <td>{percent(totalMarginPercent)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        <div className="bottomTotals">
          <div>
            <span>إجمالي التكلفة</span>
            <strong>{money(totalCost)} د.أ</strong>
          </div>
          <div>
            <span>إجمالي البيع</span>
            <strong className="redText">{money(totalSales)} د.أ</strong>
          </div>
          <div>
            <span>إجمالي الربح / الهامش</span>
            <strong className={totalProfit >= 0 ? "greenText" : "redText"}>
              {money(totalProfit)} د.أ • {percent(totalMarginPercent)}
            </strong>
          </div>
        </div>
      </section>

      <style jsx>{`
        .reportsPage {
          min-height: 100vh;
          background: #f4f6f8;
          color: #111827;
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .topCard,
        .controlsCard,
        .reportSheet,
        .warning,
        .errorBox {
          max-width: 1280px;
          margin: 0 auto 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .topCard,
        .controlsCard {
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

        h1,
        h2,
        p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 4px;
          font-size: 34px;
          letter-spacing: -0.03em;
        }

        h2 {
          margin-bottom: 8px;
          font-size: 30px;
        }

        .subtext {
          margin-bottom: 0;
          color: #4b5563;
        }

        .topActions,
        .dateControls,
        .modeTabs {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .topActions {
          justify-content: flex-end;
        }

        .controlsCard {
          align-items: flex-end;
        }

        button {
          border: 0;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 900;
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

        .secondaryButton {
          background: white;
          color: #111827;
          border: 1px solid #111827;
        }

        .printButton {
          background: #15803d;
          color: white;
          border: 1px solid #15803d;
          box-shadow: 0 10px 24px rgba(21, 128, 61, 0.18);
        }

        .tabButton {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .activeTab {
          background: #111827;
          color: white;
          border-color: #111827;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 900;
        }

        input,
        select {
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 16px;
          outline: none;
          background: white;
        }

        select {
          min-width: 210px;
          font-weight: 900;
          cursor: pointer;
        }

        input:focus,
        select:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
        }

        .selectedPeriodBox {
          min-width: 300px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 14px;
          background: #f9fafb;
        }

        .selectedPeriodBox label {
          margin-bottom: 6px;
          color: #6b7280;
          font-size: 12px;
        }

        .selectedPeriodBox strong {
          display: block;
          font-size: 15px;
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
          font-weight: 800;
        }

        .reportSheet {
          padding: 24px;
        }

        .printHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 18px;
          border-bottom: 2px solid #111827;
        }

        .reportMeta {
          min-width: 220px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
          background: #f9fafb;
        }

        .reportMeta span,
        .reportMeta small,
        .summaryBox span,
        .bottomTotals span {
          display: block;
          color: #6b7280;
          font-size: 13px;
        }

        .reportMeta strong {
          display: block;
          margin: 4px 0;
          font-size: 24px;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .summaryBox {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px;
          background: #ffffff;
        }

        .summaryBox strong {
          display: block;
          margin-top: 6px;
          font-size: 22px;
          font-weight: 950;
        }

        .redBox {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .greenBox {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .redText,
        .redBox strong {
          color: #b91c1c;
        }

        .greenText,
        .greenBox strong {
          color: #15803d;
        }

        .tableSection {
          margin-top: 22px;
        }

        .tableWrap {
          overflow-x: auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
        }

        table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
          background: white;
        }

        th,
        td {
          border-bottom: 1px solid #e5e7eb;
          padding: 12px;
          text-align: right;
          vertical-align: top;
        }

        th {
          background: #f9fafb;
          color: #4b5563;
          font-size: 13px;
        }

        tfoot td {
          background: #111827;
          color: white;
          font-weight: 900;
          border-bottom: 0;
        }

        .emptyState {
          border: 1px dashed #d1d5db;
          border-radius: 16px;
          padding: 18px;
          color: #6b7280;
          background: #f9fafb;
          font-weight: 800;
        }

        .bottomTotals {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .bottomTotals div {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px;
          background: #f9fafb;
        }

        .bottomTotals strong {
          display: block;
          margin-top: 6px;
          font-size: 26px;
          font-weight: 950;
        }

        @media (max-width: 1100px) {
          .topCard,
          .controlsCard,
          .printHeader {
            flex-direction: column;
            align-items: stretch;
          }

          .summaryGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bottomTotals {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .reportsPage {
            padding: 14px;
          }

          .summaryGrid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 28px;
          }
        }

        @page {
          size: A4 landscape;
          margin: 8mm;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          html,
          body {
            background: white !important;
          }

          .reportsPage {
            background: white !important;
            padding: 0;
            font-size: 10px;
          }

          .noPrint,
          button {
            display: none !important;
          }

          .reportSheet {
            max-width: none;
            border: 0;
            border-radius: 0;
            box-shadow: none;
            margin: 0;
            padding: 0;
          }

          .printHeader {
            padding-bottom: 8px;
          }

          h2 {
            font-size: 18px;
            margin-bottom: 4px;
          }

          .summaryGrid {
            grid-template-columns: repeat(6, 1fr);
            gap: 5px;
            margin-top: 8px;
          }

          .summaryBox {
            padding: 7px;
            border-radius: 8px;
          }

          .summaryBox strong {
            font-size: 12px;
          }

          .tableSection {
            margin-top: 8px;
          }

          .tableWrap {
            border-radius: 8px;
            overflow: visible;
          }

          table {
            min-width: 0;
            font-size: 8px;
          }

          th,
          td {
            padding: 4px 5px;
            line-height: 1.2;
          }

          th {
            font-size: 7.5px;
          }

          .bottomTotals {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-top: 8px;
          }

          .bottomTotals div {
            padding: 8px;
            border-radius: 8px;
          }

          .bottomTotals strong {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}