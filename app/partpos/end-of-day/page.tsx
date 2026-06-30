"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

type SaleRow = {
  id: string;
  sale_number: number | null;
  payment_method: string;
  status: string;
  sale_total: number;
  amount_paid: number;
  change_due: number;
  item_count: number;
  created_at: string;
};

type SaleItem = {
  id: string;
  sale_id: string;
  product_name_ar: string;
  department_ar: string;
  quantity: number;
  cost: number;
  line_total: number;
  created_at: string;
};

type DepartmentSummary = {
  department: string;
  receiptCount: number;
  itemCount: number;
  quantity: number;
  totalSales: number;
  totalCost: number;
  profit: number;
};

const STARTING_BANK = 50;

function money(value: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0.00";
  return numeric.toFixed(2);
}

function localDateInputValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function dayRangeFromInput(dateValue: string) {
  const [yearText, monthText, dayText] = dateValue.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    const today = new Date();
    return {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, 0),
    };
  }

  return {
    start: new Date(year, month - 1, day, 0, 0, 0, 0),
    end: new Date(year, month - 1, day + 1, 0, 0, 0, 0),
  };
}

function formatArabicDate(value: string) {
  const { start } = dayRangeFromInput(value);
  return start.toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    weekday: "long",
  });
}

function formatArabicTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ar-JO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tenderLabel(value: string) {
  if (value === "cash") return "نقداً";
  return value || "نقداً";
}

function backToPOS() {
  if (typeof window === "undefined") return;
  window.location.href = "/partpos";
}

function openSalesHistory() {
  if (typeof window === "undefined") return;
  window.open("/partpos/history", "_blank", "noopener,noreferrer");
}

export default function PartPOSEndOfDayReportPage() {
  const [dateValue, setDateValue] = useState(localDateInputValue());
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [actualCashText, setActualCashText] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
  }, []);

  const loadReport = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError("");

    try {
      const { start, end } = dayRangeFromInput(dateValue);

      const { data: saleRows, error: salesError } = await supabase
        .from("partpos_sales")
        .select(
          "id, sale_number, payment_method, status, sale_total, amount_paid, change_due, item_count, created_at",
        )
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000);

      if (salesError) throw salesError;

      const cleanSales: SaleRow[] = (saleRows ?? []).map((sale) => ({
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
      }));

      const saleIds = cleanSales.map((sale) => sale.id);
      let cleanItems: SaleItem[] = [];

      if (saleIds.length > 0) {
        const { data: itemRows, error: itemsError } = await supabase
          .from("partpos_sale_items")
          .select(
            "id, sale_id, product_name_ar, department_ar, quantity, cost, line_total, created_at",
          )
          .in("sale_id", saleIds)
          .order("created_at", { ascending: true })
          .limit(10000);

        if (itemsError) throw itemsError;

        cleanItems = (itemRows ?? []).map((item) => ({
          id: String(item.id),
          sale_id: String(item.sale_id),
          product_name_ar: String(item.product_name_ar ?? ""),
          department_ar: String(item.department_ar ?? ""),
          quantity: Number(item.quantity ?? 0),
          cost: Number(item.cost ?? 0),
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
        caught instanceof Error
          ? caught.message
          : "حدث خطأ أثناء تحميل تقرير نهاية اليوم.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dateValue, supabase]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const saleIdsByDepartment = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد";
      if (!groups[department]) groups[department] = new Set<string>();
      groups[department].add(item.sale_id);
    }

    return groups;
  }, [items]);

  const departmentSummary = useMemo<DepartmentSummary[]>(() => {
    const groups: Record<string, DepartmentSummary> = {};

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد";
      const quantity = Number(item.quantity) || 0;
      const lineTotal = Number(item.line_total) || 0;
      const costTotal = (Number(item.cost) || 0) * quantity;

      if (!groups[department]) {
        groups[department] = {
          department,
          receiptCount: 0,
          itemCount: 0,
          quantity: 0,
          totalSales: 0,
          totalCost: 0,
          profit: 0,
        };
      }

      groups[department].itemCount += 1;
      groups[department].quantity += quantity;
      groups[department].totalSales += lineTotal;
      groups[department].totalCost += costTotal;
      groups[department].profit += lineTotal - costTotal;
    }

    return Object.values(groups)
      .map((group) => ({
        ...group,
        receiptCount: saleIdsByDepartment[group.department]?.size ?? 0,
      }))
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [items, saleIdsByDepartment]);

  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.sale_total || 0), 0);
  const totalCashSales = sales
    .filter((sale) => sale.payment_method === "cash" || !sale.payment_method)
    .reduce((sum, sale) => sum + Number(sale.sale_total || 0), 0);
  const totalPaid = sales.reduce((sum, sale) => sum + Number(sale.amount_paid || 0), 0);
  const totalChange = sales.reduce((sum, sale) => sum + Number(sale.change_due || 0), 0);
  const expectedDrawerCash = STARTING_BANK + totalCashSales;
  const depositAmount = Math.max(expectedDrawerCash - STARTING_BANK, 0);
  const actualCash = Number(actualCashText || 0);
  const hasActualCash = actualCashText.trim() !== "" && Number.isFinite(actualCash);
  const shortOverAmount = hasActualCash ? actualCash - expectedDrawerCash : 0;
  const cashStatus =
    !hasActualCash || Math.abs(shortOverAmount) < 0.005
      ? "balanced"
      : shortOverAmount > 0
        ? "over"
        : "short";
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalCost = items.reduce(
    (sum, item) => sum + (Number(item.cost) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const grossProfit = totalSales - totalCost;

  return (
    <main className="reportPage" dir="rtl">
      <section className="topCard noPrint">
        <div>
          <p className="eyebrow">PartPOS</p>
          <h1>تقرير نهاية اليوم</h1>
          <p className="subtext">
            التقرير يحسب اليوم من 12:00 صباحاً إلى 11:59 مساءً.
          </p>
        </div>

        <div className="topActions">
          <button type="button" className="secondaryButton" onClick={backToPOS}>
            الرجوع للكاشير
          </button>
          <button type="button" className="secondaryButton" onClick={openSalesHistory}>
            سجل المبيعات
          </button>
          <button type="button" className="printReportButton" onClick={() => window.print()}>
            طباعة تقرير صفحة واحدة
          </button>
        </div>
      </section>

      {!supabase && (
        <div className="warning noPrint">
          أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY حتى يظهر التقرير.
        </div>
      )}

      <section className="dateCard noPrint">
        <div>
          <label htmlFor="report-date">تاريخ التقرير</label>
          <input
            id="report-date"
            type="date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="primaryButton"
          onClick={() => void loadReport()}
          disabled={!supabase || loading}
        >
          {loading ? "جاري التحميل..." : "تحديث التقرير"}
        </button>
      </section>

      <section className="cashCountCard noPrint">
        <div className="cashInputBlock">
          <label htmlFor="actual-cash">إجمالي النقد الموجود بالصندوق</label>
          <input
            id="actual-cash"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="مثال: 235.00"
            value={actualCashText}
            onChange={(event) => setActualCashText(event.target.value)}
          />
          <p>
            اكتب كامل النقد الموجود بالصندوق، شامل بنك البداية اليومي 50 د.أ.
          </p>
        </div>

        <div
          className={
            cashStatus === "over"
              ? "cashResult overResult"
              : cashStatus === "short"
                ? "cashResult shortResult"
                : "cashResult balancedResult"
          }
        >
          <span>نتيجة العد</span>
          {!hasActualCash ? (
            <strong>أدخل مبلغ النقد</strong>
          ) : cashStatus === "over" ? (
            <strong>زيادة {money(Math.abs(shortOverAmount))} د.أ</strong>
          ) : cashStatus === "short" ? (
            <strong>نقص {money(Math.abs(shortOverAmount))} د.أ</strong>
          ) : (
            <strong>الصندوق مطابق</strong>
          )}
          <small>
            المتوقع بالصندوق: {money(expectedDrawerCash)} د.أ
          </small>
        </div>
      </section>

      {error && <div className="errorBox noPrint">{error}</div>}

      <section className="reportSheet">
        <div className="printHeader">
          <div>
            <p className="eyebrow">PartPOS</p>
            <h2>تقرير نهاية اليوم</h2>
            <p>{formatArabicDate(dateValue)}</p>
          </div>
          <div className="periodBox">
            <span>فترة التقرير</span>
            <strong>12:00 صباحاً - 11:59 مساءً</strong>
            {lastUpdated && <small>آخر تحديث: {lastUpdated}</small>}
          </div>
        </div>

        <div className="summaryGrid">
          <div className="summaryBox redBox">
            <span>إجمالي المبيعات</span>
            <strong>{money(totalSales)} د.أ</strong>
          </div>
          <div className="summaryBox">
            <span>عدد الفواتير</span>
            <strong>{sales.length}</strong>
          </div>
          <div className="summaryBox">
            <span>عدد القطع المباعة</span>
            <strong>{money(totalQuantity)}</strong>
          </div>
          <div className="summaryBox">
            <span>إجمالي الربح التقريبي</span>
            <strong>{money(grossProfit)} د.أ</strong>
          </div>
        </div>

        <div className="depositGrid">
          <div className="depositBox">
            <span>البنك الافتتاحي اليومي</span>
            <strong>{money(STARTING_BANK)} د.أ</strong>
          </div>
          <div className="depositBox">
            <span>إجمالي المبيعات النقدية</span>
            <strong>{money(totalCashSales)} د.أ</strong>
          </div>
          <div className="depositBox greenBox">
            <span>المبلغ المتوقع داخل الصندوق</span>
            <strong>{money(expectedDrawerCash)} د.أ</strong>
            <small>المبيعات النقدية + بنك البداية</small>
          </div>
          <div className="depositBox redBox">
            <span>المبلغ المطلوب للإيداع</span>
            <strong>{money(depositAmount)} د.أ</strong>
            <small>بعد إبقاء 50 د.أ كبنك لليوم التالي</small>
          </div>
        </div>

        <div className="cashPrintGrid">
          <div className="depositBox">
            <span>النقد المعدود فعلياً</span>
            <strong>{hasActualCash ? money(actualCash) : "—"} د.أ</strong>
            <small>يشمل بنك البداية 50 د.أ</small>
          </div>
          <div
            className={
              cashStatus === "over"
                ? "depositBox greenBox"
                : cashStatus === "short"
                  ? "depositBox redBox"
                  : "depositBox"
            }
          >
            <span>النقص / الزيادة</span>
            {!hasActualCash ? (
              <strong>—</strong>
            ) : cashStatus === "over" ? (
              <strong>زيادة {money(Math.abs(shortOverAmount))} د.أ</strong>
            ) : cashStatus === "short" ? (
              <strong>نقص {money(Math.abs(shortOverAmount))} د.أ</strong>
            ) : (
              <strong>مطابق</strong>
            )}
            <small>مقارنة بالمبلغ المتوقع داخل الصندوق</small>
          </div>
          <div className="depositBox">
            <span>يتم إخراج هذا المبلغ للإيداع</span>
            <strong>{money(depositAmount)} د.أ</strong>
            <small>ثم يبقى 50 د.أ كبنك لبداية اليوم التالي</small>
          </div>
        </div>

        <section className="sectionBlock">
          <div className="sectionTitle">
            <h3>ملخص حسب القسم</h3>
            <p>مرتب من الأعلى مبيعاً إلى الأقل.</p>
          </div>

          {departmentSummary.length === 0 ? (
            <div className="emptyState">لا يوجد مبيعات لهذا اليوم.</div>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>القسم</th>
                    <th>عدد الفواتير</th>
                    <th>عدد الأصناف</th>
                    <th>الكمية</th>
                    <th>إجمالي المبيعات</th>
                    <th>التكلفة</th>
                    <th>الربح</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentSummary.map((department) => (
                    <tr key={department.department}>
                      <td>
                        <strong>{department.department}</strong>
                      </td>
                      <td>{department.receiptCount}</td>
                      <td>{department.itemCount}</td>
                      <td>{money(department.quantity)}</td>
                      <td>
                        <strong className="redText">
                          {money(department.totalSales)} د.أ
                        </strong>
                      </td>
                      <td>{money(department.totalCost)} د.أ</td>
                      <td>
                        <strong className={department.profit >= 0 ? "greenText" : "redText"}>
                          {money(department.profit)} د.أ
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>الإجمالي</td>
                    <td>{sales.length}</td>
                    <td>{items.length}</td>
                    <td>{money(totalQuantity)}</td>
                    <td>{money(totalSales)} د.أ</td>
                    <td>{money(totalCost)} د.أ</td>
                    <td>{money(grossProfit)} د.أ</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        <section className="sectionBlock receiptsSection">
          <div className="sectionTitle">
            <h3>الفواتير داخل التقرير</h3>
            <p>أحدث فاتورة تظهر أولاً.</p>
          </div>

          {sales.length === 0 ? (
            <div className="emptyState">لا يوجد فواتير لهذا اليوم.</div>
          ) : (
            <div className="receiptsList">
              {sales.map((sale) => (
                <div className="receiptRow" key={sale.id}>
                  <div>
                    <strong>فاتورة رقم {sale.sale_number ?? "—"}</strong>
                    <span>
                      {formatArabicTime(sale.created_at)} • {sale.item_count} أصناف •{" "}
                      {tenderLabel(sale.payment_method)}
                    </span>
                  </div>
                  <div>
                    <strong className="redText">{money(sale.sale_total)} د.أ</strong>
                    <span>مدفوع: {money(sale.amount_paid)} د.أ</span>
                    <span className="greenText">راجع: {money(sale.change_due)} د.أ</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="signOff">
          <div>
            <span>توقيع الكاشير</span>
          </div>
          <div>
            <span>توقيع المدير</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .reportPage {
          min-height: 100vh;
          background: #f4f6f8;
          color: #111827;
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .topCard,
        .dateCard,
        .cashCountCard,
        .reportSheet,
        .warning,
        .errorBox {
          max-width: 1200px;
          margin: 0 auto 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .topCard,
        .dateCard,
        .cashCountCard {
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
        h3,
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

        h3 {
          margin-bottom: 4px;
          font-size: 22px;
        }

        .subtext,
        .sectionTitle p {
          margin-bottom: 0;
          color: #4b5563;
        }

        .topActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
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

        .printReportButton {
          background: #15803d;
          color: white;
          border: 1px solid #15803d;
          box-shadow: 0 10px 24px rgba(21, 128, 61, 0.18);
        }

        .secondaryButton {
          background: white;
          color: #111827;
          border: 1px solid #111827;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 900;
        }

        input {
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

        .cashInputBlock {
          flex: 1;
        }

        .cashInputBlock input {
          width: min(320px, 100%);
          font-size: 22px;
          font-weight: 900;
        }

        .cashInputBlock p {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .cashResult {
          min-width: 280px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px;
          background: #f9fafb;
        }

        .cashResult span,
        .cashResult small {
          display: block;
          color: #6b7280;
          font-size: 13px;
        }

        .cashResult strong {
          display: block;
          margin: 6px 0;
          font-size: 28px;
          font-weight: 950;
        }

        .overResult {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .overResult strong {
          color: #15803d;
        }

        .shortResult {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .shortResult strong {
          color: #b91c1c;
        }

        .balancedResult strong {
          color: #111827;
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

        .periodBox {
          min-width: 260px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
          background: #f9fafb;
        }

        .periodBox span,
        .periodBox small,
        .summaryBox span,
        .depositBox span,
        .depositBox small,
        .receiptRow span {
          display: block;
          color: #6b7280;
          font-size: 13px;
        }

        .periodBox strong {
          display: block;
          margin: 5px 0;
          font-size: 18px;
        }

        .summaryGrid,
        .depositGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .cashPrintGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .summaryBox,
        .depositBox {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px;
          background: #ffffff;
        }

        .summaryBox strong,
        .depositBox strong {
          display: block;
          margin-top: 6px;
          font-size: 24px;
          font-weight: 950;
        }

        .redBox {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .redBox strong,
        .redText {
          color: #b91c1c;
        }

        .greenBox {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .greenBox strong,
        .greenText {
          color: #15803d;
        }

        .sectionBlock {
          margin-top: 24px;
        }

        .sectionTitle {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }

        .tableWrap {
          overflow-x: auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
        }

        table {
          width: 100%;
          min-width: 920px;
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

        .receiptsList {
          display: grid;
          gap: 10px;
        }

        .receiptRow {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
          background: #ffffff;
        }

        .receiptRow strong {
          display: block;
          font-size: 17px;
        }

        .receiptRow div:last-child {
          min-width: 180px;
          text-align: left;
        }

        .signOff {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 34px;
        }

        .signOff div {
          border-top: 1px solid #111827;
          padding-top: 10px;
          color: #6b7280;
          min-height: 46px;
        }

        @media (max-width: 900px) {
          .topCard,
          .dateCard,
          .cashCountCard,
          .printHeader,
          .sectionTitle,
          .receiptRow {
            flex-direction: column;
            align-items: stretch;
          }

          .summaryGrid,
          .depositGrid,
          .cashPrintGrid {
            grid-template-columns: 1fr;
          }

          .receiptRow div:last-child {
            text-align: right;
          }
        }

        @page {
          size: A4 portrait;
          margin: 8mm;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          html,
          body {
            width: 210mm;
            min-height: 297mm;
            background: white !important;
          }

          .reportPage {
            background: white !important;
            padding: 0;
            min-height: auto;
            font-size: 10.5px;
          }

          .noPrint,
          .receiptsSection,
          button {
            display: none !important;
          }

          .reportSheet {
            max-width: none;
            width: 100%;
            border: 0;
            border-radius: 0;
            box-shadow: none;
            margin: 0;
            padding: 0;
          }

          .printHeader {
            padding-bottom: 8px;
            border-bottom: 2px solid #111827;
          }

          .eyebrow {
            font-size: 10px;
            margin-bottom: 2px;
          }

          h2 {
            font-size: 20px;
            margin-bottom: 4px;
          }

          h3 {
            font-size: 14px;
            margin-bottom: 2px;
          }

          p {
            margin-bottom: 0;
          }

          .periodBox {
            min-width: 190px;
            padding: 8px;
            border-radius: 10px;
          }

          .periodBox span,
          .periodBox small,
          .summaryBox span,
          .depositBox span,
          .depositBox small {
            font-size: 9px;
          }

          .periodBox strong {
            font-size: 12px;
            margin: 2px 0;
          }

          .summaryGrid,
          .depositGrid {
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            margin-top: 8px;
          }

          .cashPrintGrid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-top: 6px;
          }

          .summaryBox,
          .depositBox {
            padding: 8px;
            border-radius: 10px;
          }

          .summaryBox strong,
          .depositBox strong {
            margin-top: 3px;
            font-size: 15px;
          }

          .sectionBlock {
            margin-top: 10px;
          }

          .sectionTitle {
            margin-bottom: 5px;
          }

          .sectionTitle p {
            font-size: 9px;
          }

          .tableWrap {
            border-radius: 8px;
            overflow: visible;
          }

          table {
            min-width: 0;
            width: 100%;
            font-size: 9.5px;
          }

          th,
          td {
            padding: 5px 6px;
            line-height: 1.25;
          }

          th {
            font-size: 8.5px;
          }

          tfoot td {
            font-size: 9.5px;
          }

          .emptyState {
            padding: 8px;
            border-radius: 8px;
            font-size: 10px;
          }

          .signOff {
            gap: 14px;
            margin-top: 16px;
          }

          .signOff div {
            min-height: 28px;
            padding-top: 6px;
            font-size: 9px;
          }

          .redBox {
            background: #fff1f2 !important;
          }

          .greenBox {
            background: #f0fdf4 !important;
          }
        }
      `}</style>
    </main>
  );
}