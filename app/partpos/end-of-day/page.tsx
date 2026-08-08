"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type CreditPaymentRow = {
  id: string;
  payment_number: number | null;
  customer_name: string;
  customer_phone: string;
  amount_paid: number;
  balance_before: number;
  balance_after: number;
  created_at: string;
};

type CashExpenseRow = {
  id: string;
  expense_number: number | null;
  expense_type: "utility" | "vendor";
  details: string;
  company_name: string;
  amount: number;
  paid_by: "cash" | "credit";
  created_at: string;
  source_kind?: "expense" | "credit_expense_payment";
};

type CashCountStatus = "short" | "over" | "matched";

type SubmittedCashCount = {
  report_date: string;
  expected_cash: number;
  actual_cash: number;
  difference: number;
  status: CashCountStatus;
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

function normalizedPaymentMethod(value: string) {
  return String(value || "cash").toLowerCase().trim();
}

function isReturnStatus(value: string) {
  const normalized = String(value || "").toLowerCase().trim();
  return normalized === "return" || normalized === "returned";
}

function isReturnCreditPaymentMethod(value: string) {
  return normalizedPaymentMethod(value) === "return_credit";
}

function isReturnCashPaymentMethod(value: string) {
  const normalized = normalizedPaymentMethod(value);
  return normalized === "return_cash" || normalized === "return";
}

function isCreditPaymentMethod(value: string) {
  const normalized = normalizedPaymentMethod(value);
  return normalized === "credit" || normalized === "return_credit";
}

function isCashPaymentMethod(value: string) {
  return !isCreditPaymentMethod(value);
}

function tenderLabel(value: string) {
  if (isReturnCreditPaymentMethod(value)) return "مرتجع ائتمان / Credit Return";
  if (isReturnCashPaymentMethod(value)) return "مرتجع نقدي / Cash Return";
  if (isCreditPaymentMethod(value)) return "ائتمان / Credit";
  if (isCashPaymentMethod(value)) return "نقداً / Cash";
  return value || "نقداً / Cash";
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

    try {
      return JSON.stringify(record);
    } catch {
      return "Unknown Supabase error";
    }
  }

  return String(error || "Unknown error");
}

function cashCountStatusLabel(status: CashCountStatus) {
  if (status === "short") return "نقص / Short";
  if (status === "over") return "زيادة / Over";
  return "الصندوق مطابق / Matched";
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
  const [creditPayments, setCreditPayments] = useState<CreditPaymentRow[]>([]);
  const [cashExpenses, setCashExpenses] = useState<CashExpenseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const actualCashInputRef = useRef<HTMLInputElement | null>(null);
  const [actualCashSnapshot, setActualCashSnapshot] = useState("");
  const [cashCountSubmitStatus, setCashCountSubmitStatus] = useState<
    "idle" | "saving" | "error"
  >("idle");
  const [cashCountSubmitError, setCashCountSubmitError] = useState("");
  const [submittedCashCount, setSubmittedCashCount] =
    useState<SubmittedCashCount | null>(null);
  const [isCashCountResultOpen, setIsCashCountResultOpen] = useState(false);

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
        .or("status.is.null,status.neq.voided")
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
        sale_total: isReturnStatus(String(sale.status ?? ""))
          ? -Math.abs(Number(sale.sale_total ?? 0))
          : Number(sale.sale_total ?? 0),
        amount_paid: Number(sale.amount_paid ?? 0),
        change_due: Number(sale.change_due ?? 0),
        item_count: Number(sale.item_count ?? 0),
        created_at: String(sale.created_at),
      }));

      const returnSaleIds = new Set(
        cleanSales.filter((sale) => isReturnStatus(sale.status)).map((sale) => sale.id),
      );

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

        cleanItems = (itemRows ?? []).map((item) => {
          const saleId = String(item.sale_id);
          const isReturnItem = returnSaleIds.has(saleId);
          const rawQuantity = Number(item.quantity ?? 0);
          const rawLineTotal = Number(item.line_total ?? 0);

          return {
            id: String(item.id),
            sale_id: saleId,
            product_name_ar: String(item.product_name_ar ?? ""),
            department_ar: String(item.department_ar ?? ""),
            quantity: isReturnItem ? -Math.abs(rawQuantity) : rawQuantity,
            cost: Number(item.cost ?? 0),
            line_total: isReturnItem ? -Math.abs(rawLineTotal) : rawLineTotal,
            created_at: String(item.created_at),
          };
        });
      }

      const { data: creditPaymentRows, error: creditPaymentsError } = await supabase
        .from("partpos_credit_payments")
        .select(
          "id, payment_number, customer_name, customer_phone, amount_paid, balance_before, balance_after, created_at",
        )
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000);

      if (creditPaymentsError) throw creditPaymentsError;

      const cleanCreditPayments: CreditPaymentRow[] = (creditPaymentRows ?? []).map(
        (payment) => ({
          id: String(payment.id),
          payment_number:
            payment.payment_number === null || payment.payment_number === undefined
              ? null
              : Number(payment.payment_number),
          customer_name: String(payment.customer_name ?? ""),
          customer_phone: String(payment.customer_phone ?? ""),
          amount_paid: Number(payment.amount_paid ?? 0),
          balance_before: Number(payment.balance_before ?? 0),
          balance_after: Number(payment.balance_after ?? 0),
          created_at: String(payment.created_at),
        }),
      );

      const { data: cashExpenseRows, error: cashExpensesError } = await supabase
        .from("partpos_expenses")
        .select("id, expense_number, expense_type, details, company_name, amount, paid_by, created_at")
        .eq("paid_by", "cash")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .or("status.is.null,status.neq.voided")
        .order("created_at", { ascending: false })
        .limit(5000);

      if (cashExpensesError) throw cashExpensesError;

      const cleanCashExpenses: CashExpenseRow[] = (cashExpenseRows ?? []).map((expense) => ({
        id: String(expense.id),
        expense_number:
          expense.expense_number === null || expense.expense_number === undefined
            ? null
            : Number(expense.expense_number),
        expense_type: expense.expense_type === "vendor" ? "vendor" : "utility",
        details: String(expense.details ?? ""),
        company_name: String(expense.company_name ?? ""),
        amount: Number(expense.amount ?? 0),
        paid_by: "cash",
        created_at: String(expense.created_at),
        source_kind: "expense",
      }));

      const { data: cashExpensePaymentRows, error: cashExpensePaymentsError } = await supabase
        .from("partpos_expense_payments")
        .select("id, payment_number, expense_number, expense_type, company_name, details, amount, paid_by, status, created_at")
        .eq("paid_by", "cash")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .or("status.is.null,status.neq.voided")
        .order("created_at", { ascending: false })
        .limit(5000);

      if (cashExpensePaymentsError) throw cashExpensePaymentsError;

      const cleanCashExpensePayments: CashExpenseRow[] = (cashExpensePaymentRows ?? []).map(
        (payment) => ({
          id: `credit-payment-${String(payment.id)}`,
          expense_number:
            payment.expense_number === null || payment.expense_number === undefined
              ? null
              : Number(payment.expense_number),
          expense_type: payment.expense_type === "utility" ? "utility" : "vendor",
          details: String(payment.details ?? "دفعة على ائتمان مورد / Supplier Credit Payment"),
          company_name: String(payment.company_name ?? ""),
          amount: Number(payment.amount ?? 0),
          paid_by: "cash",
          created_at: String(payment.created_at),
          source_kind: "credit_expense_payment",
        }),
      );

      const allCashExpenses = [...cleanCashExpenses, ...cleanCashExpensePayments].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setSales(cleanSales);
      setItems(cleanItems);
      setCreditPayments(cleanCreditPayments);
      setCashExpenses(allCashExpenses);
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
          : "حدث خطأ أثناء تحميل تقرير نهاية اليوم. / Error loading end-of-day report.";
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
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
      if (!groups[department]) groups[department] = new Set<string>();
      groups[department].add(item.sale_id);
    }

    return groups;
  }, [items]);

  const departmentSummary = useMemo<DepartmentSummary[]>(() => {
    const groups: Record<string, DepartmentSummary> = {};

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
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

  const cashSales = sales.filter((sale) => isCashPaymentMethod(sale.payment_method));
  const creditSales = sales.filter((sale) => isCreditPaymentMethod(sale.payment_method));

  const totalCashSales = cashSales.reduce(
    (sum, sale) => sum + Number(sale.sale_total || 0),
    0,
  );
  const totalCreditSales = creditSales.reduce(
    (sum, sale) => sum + Number(sale.sale_total || 0),
    0,
  );

  const totalCreditAccountPayments = creditPayments.reduce(
    (sum, payment) => sum + Number(payment.amount_paid || 0),
    0,
  );

  const totalCashExpenses = cashExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const realCashCollectedToday = totalCashSales + totalCreditAccountPayments;
  const netCashAfterExpenses = realCashCollectedToday - totalCashExpenses;
  const totalPaid = cashSales.reduce((sum, sale) => sum + Number(sale.amount_paid || 0), 0);
  const totalChange = cashSales.reduce((sum, sale) => sum + Number(sale.change_due || 0), 0);
  const expectedDrawerCash = Math.max(netCashAfterExpenses, 0);
  const depositAmount = Math.max(netCashAfterExpenses, 0);
  const actualCash = Number(actualCashSnapshot || 0);
  const hasActualCash = actualCashSnapshot.trim() !== "" && Number.isFinite(actualCash);

  async function submitActualCashCount() {
    if (!supabase) {
      setCashCountSubmitStatus("error");
      setCashCountSubmitError("Supabase غير مربوط. لا يمكن حفظ العد. / Supabase is not connected. Cash count cannot be saved.");
      return;
    }

    const rawValue = actualCashInputRef.current?.value ?? "";
    const parsedActualCash = Number(rawValue || 0);

    if (rawValue.trim() === "" || !Number.isFinite(parsedActualCash) || parsedActualCash < 0) {
      setCashCountSubmitStatus("error");
      setCashCountSubmitError("أدخل المبلغ الموجود بالصندوق بشكل صحيح. / Enter the actual cash in the drawer correctly.");
      return;
    }

    const difference = parsedActualCash - expectedDrawerCash;
    const status: CashCountStatus =
      Math.abs(difference) < 0.005 ? "matched" : difference < 0 ? "short" : "over";

    const result: SubmittedCashCount = {
      report_date: dateValue,
      expected_cash: expectedDrawerCash,
      actual_cash: parsedActualCash,
      difference,
      status,
    };

    setCashCountSubmitStatus("saving");
    setCashCountSubmitError("");
    setActualCashSnapshot(rawValue);

    try {
      const { error } = await supabase.from("partpos_daily_counts").upsert(
        {
          report_date: dateValue,
          expected_cash: expectedDrawerCash,
          actual_cash: parsedActualCash,
          difference,
          status,
          starting_bank: STARTING_BANK,
          cash_sales: totalCashSales,
          credit_sales: totalCreditSales,
          credit_account_payments: totalCreditAccountPayments,
          cash_expenses: totalCashExpenses,
          deposit_amount: depositAmount,
          sales_total: totalSales,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "report_date" },
      );

      if (error) throw error;

      setSubmittedCashCount(result);
      setIsCashCountResultOpen(true);
      setCashCountSubmitStatus("idle");
    } catch (error) {
      setCashCountSubmitStatus("error");
      setCashCountSubmitError(`خطأ Supabase / Supabase error: ${readSupabaseError(error)}`);
    }
  }

  function clearActualCashCount() {
    if (actualCashInputRef.current) actualCashInputRef.current.value = "";
    setActualCashSnapshot("");
    setSubmittedCashCount(null);
    setIsCashCountResultOpen(false);
    setCashCountSubmitStatus("idle");
    setCashCountSubmitError("");
  }
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
          <h1>تقرير نهاية اليوم / End of Day Report</h1>
          <p className="subtext">
            التقرير يحسب اليوم من 12:00 صباحاً إلى 11:59 مساءً. الفواتير الملغاة VOID لا تدخل في أي حساب. مبيعات الائتمان لا تدخل الصندوق، والمصروفات النقدية غير الملغاة تخصم من كاش اليوم.
          </p>
        </div>

        <div className="topActions">
          <button type="button" className="secondaryButton" onClick={backToPOS}>
            الرجوع للكاشير / Back to Cashier
          </button>
          <button type="button" className="secondaryButton" onClick={openSalesHistory}>
            سجل المبيعات / Sales History
          </button>
          <button type="button" className="printReportButton" onClick={() => window.print()}>
            طباعة تقرير صفحة واحدة
          </button>
        </div>
      </section>

      {!supabase && (
        <div className="warning noPrint">
          أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY حتى يظهر التقرير. / Add the Supabase URL and anon key to display the report.
        </div>
      )}

      <section className="dateCard noPrint">
        <div>
          <label htmlFor="report-date">تاريخ التقرير / Report Date</label>
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
          {loading ? "جاري التحميل... / Loading..." : "تحديث التقرير / Refresh Report"}
        </button>
      </section>

      <section className="cashCountCard noPrint">
        <div className="cashInputBlock">
          <label htmlFor="actual-cash">إجمالي النقد الموجود بالصندوق / Actual Cash in Drawer</label>
          <input
            id="actual-cash"
            ref={actualCashInputRef}
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="مثال / Example: 235.00"
            defaultValue=""
          />
          <div className="cashCountActions">
            <button
              type="button"
              className="applyCashCountButton"
              onClick={() => void submitActualCashCount()}
              disabled={cashCountSubmitStatus === "saving"}
            >
              {cashCountSubmitStatus === "saving" ? "جاري الحفظ... / Saving..." : "تثبيت العد / Submit Count"}
            </button>
            <button
              type="button"
              className="clearCashCountButton"
              onClick={clearActualCashCount}
            >
              مسح
            </button>
          </div>
          <p>
            اكتب النقد المتوقع من عمليات اليوم بعد المصروفات النقدية. لا تشمل مبيعات الائتمان غير المحصلة.
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
          <span>نتيجة العد / Count Result</span>
          {!hasActualCash ? (
            <strong>أدخل مبلغ النقد / Enter cash amount</strong>
          ) : cashStatus === "over" ? (
            <strong>زيادة / Over {money(Math.abs(shortOverAmount))} د.أ</strong>
          ) : cashStatus === "short" ? (
            <strong>نقص / Short {money(Math.abs(shortOverAmount))} د.أ</strong>
          ) : (
            <strong>الصندوق مطابق / Matched</strong>
          )}
          {cashCountSubmitError && (
            <div className="cashCountSubmitError">{cashCountSubmitError}</div>
          )}
          <small>
            المتوقع بعد المصروفات: {money(expectedDrawerCash)} د.أ — نقد فعلي فقط
          </small>
        </div>
      </section>

      {error && <div className="errorBox noPrint">{error}</div>}

      <section className="reportSheet">
        <div className="printHeader">
          <div>
            <p className="eyebrow">PartPOS</p>
            <h2>تقرير نهاية اليوم / End of Day Report</h2>
            <p>{formatArabicDate(dateValue)}</p>
          </div>
          <div className="periodBox">
            <span>فترة التقرير / Report Period</span>
            <strong>12:00 صباحاً - 11:59 مساءً / 12:00 AM - 11:59 PM</strong>
            {lastUpdated && <small>آخر تحديث / Last updated: {lastUpdated}</small>}
          </div>
        </div>

        <div className="summaryGrid">
          <div className="summaryBox redBox">
            <span>إجمالي المبيعات / Total Sales</span>
            <strong>{money(totalSales)} د.أ</strong>
            <small>نقد + ائتمان / Cash + Credit</small>
          </div>
          <div className="summaryBox greenBox">
            <span>مبيعات نقدية دخلت الصندوق / Cash Sales into Drawer</span>
            <strong>{money(totalCashSales)} د.أ</strong>
          </div>
          <div className="summaryBox orangeBox">
            <span>مبيعات ائتمان لم تدخل الصندوق / Credit Sales not in Drawer</span>
            <strong>{money(totalCreditSales)} د.أ</strong>
          </div>
          <div className="summaryBox greenBox">
            <span>تحصيل حسابات ائتمان / Credit Account Collections</span>
            <strong>{money(totalCreditAccountPayments)} د.أ</strong>
          </div>
          <div className="summaryBox redBox">
            <span>مصروفات نقدية خرجت من الصندوق / Cash Expenses out of Drawer</span>
            <strong>{money(totalCashExpenses)} د.أ</strong>
          </div>
          <div className="summaryBox">
            <span>عدد الفواتير / Receipt Count</span>
            <strong>{sales.length}</strong>
          </div>
          <div className="summaryBox">
            <span>إجمالي الربح التقريبي / Estimated Gross Profit</span>
            <strong>{money(grossProfit)} د.أ</strong>
          </div>
        </div>

        <div className="depositGrid">
          <div className="depositBox">
            <span>البنك الافتتاحي اليومي / Daily Starting Bank</span>
            <strong>{money(STARTING_BANK)} د.أ</strong>
            <small>معلومة فقط، لا يدخل في حساب كاش اليوم / Information only; not included in today's cash calculation</small>
          </div>
          <div className="depositBox greenBox">
            <span>مبيعات نقدية / Cash Sales</span>
            <strong>{money(totalCashSales)} د.أ</strong>
            <small>دخلت الصندوق اليوم / Entered the drawer today</small>
          </div>
          <div className="depositBox greenBox">
            <span>تحصيل من حسابات ائتمان / Credit Account Collections</span>
            <strong>{money(totalCreditAccountPayments)} د.أ</strong>
            <small>دفعات حقيقية دخلت الصندوق / Actual payments received into the drawer</small>
          </div>
          <div className="depositBox redBox">
            <span>مصروفات نقدية / Cash Expenses</span>
            <strong>- {money(totalCashExpenses)} د.أ</strong>
            <small>دفعات خرجت من الصندوق اليوم / Payments that left the drawer today</small>
          </div>
          <div className="depositBox orangeBox">
            <span>مبيعات ائتمان / Credit Sales</span>
            <strong>{money(totalCreditSales)} د.أ</strong>
            <small>بيع تم اليوم لكن الكاش غير موجود بالصندوق / Sale occurred today but cash is not in the drawer</small>
          </div>
          <div className="depositBox greenBox">
            <span>النقد المتوقع بعد المصروفات / Expected Cash After Expenses</span>
            <strong>{money(expectedDrawerCash)} د.أ</strong>
            <small>مبيعات نقدية + تحصيل ائتمان - مصروفات نقدية / Cash sales + credit collections - cash expenses</small>
          </div>
          <div className="depositBox redBox">
            <span>المبلغ المتوقع للإيداع / Expected Deposit</span>
            <strong>{money(depositAmount)} د.أ</strong>
            <small>مثال: 300 مبيعات نقدية - 300 مصروف نقدي = 0 د.أ / Example: 300 cash sales - 300 cash expenses = 0 JOD</small>
          </div>
        </div>

        <div className="cashPrintGrid">
          <div className="depositBox">
            <span>النقد المعدود فعلياً / Actual Cash Counted</span>
            <strong>{hasActualCash ? money(actualCash) : "—"} د.أ</strong>
            <small>نقد اليوم بعد خصم المصروفات النقدية / Today's cash after cash expenses</small>
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
            <span>النقص / الزيادة / Short / Over</span>
            {!hasActualCash ? (
              <strong>—</strong>
            ) : cashStatus === "over" ? (
              <strong>زيادة / Over {money(Math.abs(shortOverAmount))} د.أ</strong>
            ) : cashStatus === "short" ? (
              <strong>نقص / Short {money(Math.abs(shortOverAmount))} د.أ</strong>
            ) : (
              <strong>مطابق / Matched</strong>
            )}
            <small>مقارنة بالنقد المتوقع بعد خصم المصروفات / Compared with expected cash after expenses</small>
          </div>
          <div className="depositBox">
            <span>يتم إخراج هذا المبلغ للإيداع / Amount Removed for Deposit</span>
            <strong>{money(depositAmount)} د.أ</strong>
            <small>ثم يبقى 50 د.أ كبنك لبداية اليوم التالي. مبيعات الائتمان غير المحصلة لا تودع. / Then 50 JOD remains as the next day's starting bank. Uncollected credit sales are not deposited.</small>
          </div>
        </div>

        <section className="sectionBlock">
          <div className="sectionTitle">
            <h3>ملخص حسب القسم / Summary by Department</h3>
            <p>مرتب من الأعلى مبيعاً إلى الأقل. يشمل النقد والائتمان لأن البيع حصل. / Sorted highest to lowest sales. Includes cash and credit because the sale occurred.</p>
          </div>

          {departmentSummary.length === 0 ? (
            <div className="emptyState">لا يوجد مبيعات لهذا اليوم. / No sales for this day.</div>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>القسم / Department</th>
                    <th>عدد الفواتير / Receipts</th>
                    <th>عدد الأصناف / Item Lines</th>
                    <th>الكمية / Qty</th>
                    <th>إجمالي المبيعات / Total Sales</th>
                    <th>التكلفة / Cost</th>
                    <th>الربح / Profit</th>
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
                    <td>الإجمالي / Total</td>
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

        <section className="sectionBlock cashExpensesSection">
          <div className="sectionTitle">
            <h3>المصروفات النقدية من الصندوق / Cash Expenses from Drawer</h3>
            <p>هذه المبالغ خرجت نقداً اليوم وتخصم من الكاش المتوقع، وتشمل دفعات ائتمان الموردين النقدية. / These amounts left the drawer today and reduce expected cash, including cash payments on supplier credit.</p>
          </div>

          {cashExpenses.length === 0 ? (
            <div className="emptyState">لا يوجد مصروفات أو دفعات ائتمان نقدية لهذا اليوم. / No cash expenses or supplier-credit cash payments for this day.</div>
          ) : (
            <div className="receiptsList">
              {cashExpenses.map((expense) => (
                <div className="receiptRow" key={expense.id}>
                  <div>
                    <strong>{expense.expense_number ? `قيد / Entry ${expense.expense_number}` : "مصروف نقدي / Cash Expense"}</strong>
                    <span>
                      {formatArabicTime(expense.created_at)} •{" "}
                      {expense.source_kind === "credit_expense_payment"
                        ? `دفعة ائتمان مورد • ${expense.company_name || expense.details || "مورد غير محدد / Unspecified supplier / Unspecified"}`
                        : expense.expense_type === "vendor"
                          ? expense.company_name || "مورد غير محدد / Unspecified supplier / Unspecified"
                          : expense.details || "مصروف بدون تفاصيل / Expense without details"}
                    </span>
                  </div>
                  <div>
                    <strong className="redText">- {money(expense.amount)} د.أ</strong>
                    <span>خصم من الصندوق / Deducted from Drawer</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="sectionBlock creditPaymentsSection">
          <div className="sectionTitle">
            <h3>تحصيل حسابات ائتمان الزبائن / Customer Credit Collections</h3>
            <p>هذه دفعات نقدية دخلت الصندوق اليوم، وليست مبيعات جديدة. / These are cash payments received today, not new sales.</p>
          </div>

          {creditPayments.length === 0 ? (
            <div className="emptyState">لا يوجد دفعات ائتمان محصلة لهذا اليوم. / No customer credit payments collected today.</div>
          ) : (
            <div className="receiptsList">
              {creditPayments.map((payment) => (
                <div className="receiptRow" key={payment.id}>
                  <div>
                    <strong>سند قبض رقم / Receipt No. {payment.payment_number ?? "—"}</strong>
                    <span>
                      {formatArabicTime(payment.created_at)} • {payment.customer_name || "زبون غير محدد / Unspecified customer / Unspecified"}
                    </span>
                    {payment.customer_phone && <span>{payment.customer_phone}</span>}
                  </div>
                  <div>
                    <strong className="greenText">{money(payment.amount_paid)} د.أ</strong>
                    <span>الرصيد قبل / Balance before: {money(payment.balance_before)} د.أ</span>
                    <span>الرصيد بعد / Balance after: {money(payment.balance_after)} د.أ</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="sectionBlock receiptsSection">
          <div className="sectionTitle">
            <h3>الفواتير داخل التقرير / Receipts in Report</h3>
            <p>أحدث فاتورة تظهر أولاً. / Newest receipt appears first.</p>
          </div>

          {sales.length === 0 ? (
            <div className="emptyState">لا يوجد فواتير لهذا اليوم. / No receipts for this day.</div>
          ) : (
            <div className="receiptsList">
              {sales.map((sale) => (
                <div className="receiptRow" key={sale.id}>
                  <div>
                    <strong>فاتورة رقم / Receipt No. {sale.sale_number ?? "—"}</strong>
                    <span>
                      {formatArabicTime(sale.created_at)} • {sale.item_count} أصناف •{" "}
                      {tenderLabel(sale.payment_method)}
                    </span>
                    {isCreditPaymentMethod(sale.payment_method) && (
                      <span className="orangeText">ائتمان — لم يدخل الصندوق / Credit — not in drawer</span>
                    )}
                  </div>
                  <div>
                    <strong className="redText">{money(sale.sale_total)} د.أ</strong>
                    {isCreditPaymentMethod(sale.payment_method) ? (
                      <span className="orangeText">دخل الصندوق / Drawer received: 0.00 د.أ</span>
                    ) : (
                      <>
                        <span>مدفوع / Paid: {money(sale.amount_paid)} د.أ</span>
                        <span className="greenText">راجع / Change: {money(sale.change_due)} د.أ</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="signOff">
          <div>
            <span>توقيع الكاشير / Cashier Signature</span>
          </div>
          <div>
            <span>توقيع المدير / Manager Signature</span>
          </div>
        </div>
      </section>

      {isCashCountResultOpen && submittedCashCount && (
        <div className="popupBackdrop noPrint" role="dialog" aria-modal="true">
          <div className="cashCountResultCard">
            <p className="eyebrow">نتيجة عد الصندوق / Cash Count Result</p>
            <h2>{cashCountStatusLabel(submittedCashCount.status)}</h2>

            <div className="cashCountResultGrid">
              <div>
                <span>المتوقع بالصندوق / Expected in Drawer</span>
                <strong>{money(submittedCashCount.expected_cash)} د.أ</strong>
              </div>
              <div>
                <span>الموجود فعلياً / Actual in Drawer</span>
                <strong>{money(submittedCashCount.actual_cash)} د.أ</strong>
              </div>
              <div>
                <span>الفرق / Difference</span>
                <strong
                  className={
                    submittedCashCount.status === "matched"
                      ? "greenText"
                      : submittedCashCount.status === "short"
                        ? "redText"
                        : "orangeText"
                  }
                >
                  {money(Math.abs(submittedCashCount.difference))} د.أ
                </strong>
              </div>
            </div>

            <div
              className={
                submittedCashCount.status === "matched"
                  ? "cashCountResultMessage matched"
                  : submittedCashCount.status === "short"
                    ? "cashCountResultMessage short"
                    : "cashCountResultMessage over"
              }
            >
              {submittedCashCount.status === "matched"
                ? "الصندوق مطابق. لا يوجد نقص أو زيادة. / Drawer matches. No shortage or overage."
                : submittedCashCount.status === "short"
                  ? `الصندوق ناقص ${money(Math.abs(submittedCashCount.difference))} د.أ. / Drawer is short.`
                  : `الصندوق زائد ${money(Math.abs(submittedCashCount.difference))} د.أ. / Drawer is over.`}
            </div>

            <button
              type="button"
              className="closeResultButton"
              onClick={() => setIsCashCountResultOpen(false)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

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
          outline: none;
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
        }

        .popupBackdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.55);
        }

        .cashCountResultCard {
          width: min(520px, 100%);
          background: white;
          border-radius: 22px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
        }

        .cashCountResultCard h2 {
          margin: 0 0 16px;
          font-size: 34px;
          color: #111827;
        }

        .cashCountResultGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin: 14px 0;
        }

        .cashCountResultGrid div {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
          background: #f9fafb;
        }

        .cashCountResultGrid span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .cashCountResultGrid strong {
          display: block;
          font-size: 18px;
          font-weight: 950;
        }

        .cashCountResultMessage {
          border-radius: 14px;
          padding: 14px;
          font-weight: 900;
          margin: 14px 0;
        }

        .cashCountResultMessage.matched {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .cashCountResultMessage.short {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .cashCountResultMessage.over {
          background: #fff7ed;
          color: #b45309;
          border: 1px solid #fed7aa;
        }

        .closeResultButton {
          width: 100%;
          border: 0;
          border-radius: 12px;
          padding: 13px 16px;
          background: #111827;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .cashCountSubmitError {
          margin-top: 10px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 10px 12px;
          border-radius: 12px;
          font-weight: 800;
        }

        .cashCountActions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .applyCashCountButton,
        .clearCashCountButton {
          border: 0;
          border-radius: 10px;
          padding: 10px 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .applyCashCountButton {
          background: #111827;
          color: white;
        }

        .applyCashCountButton:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .clearCashCountButton {
          background: #e5e7eb;
          color: #111827;
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
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

        .orangeBox {
          background: #fff7ed;
          border-color: #fed7aa;
        }

        .orangeBox strong,
        .orangeText {
          color: #b45309;
        }

        .summaryBox small {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-top: 4px;
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
          .cashExpensesSection,
          .creditPaymentsSection,
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
            grid-template-columns: repeat(3, 1fr);
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
