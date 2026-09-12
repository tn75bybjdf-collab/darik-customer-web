"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

const EXPENSE_VOID_PIN = "079300";

type ReportMode =
  | "department"
  | "items"
  | "credit"
  | "expenses"
  | "vendorCredit"
  | "dailyCount"
  | "profitLoss";

type ReportRange =
  | "today"
  | "yesterday"
  | "this_week"
  | "this_month"
  | "last_month"
  | "year_to_date"
  | "custom";

type ReportLanguage = "ar" | "en";

type SaleRow = {
  id: string;
  sale_number: number | null;
  sale_total: number;
  amount_paid: number;
  change_due: number;
  payment_method: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_credit_allowance: number;
  status: string;
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

type ExpenseRow = {
  id: string;
  expense_number: number | null;
  expense_type: "utility" | "vendor";
  details: string;
  company_name: string;
  amount: number;
  paid_by: "cash" | "credit";
  status: string;
  voided_at: string | null;
  created_at: string;
};

type ExpensePaymentRow = {
  id: string;
  payment_number: number | null;
  expense_id: string;
  expense_number: number | null;
  expense_type: "utility" | "vendor";
  company_name: string;
  details: string;
  amount: number;
  paid_by: "cash" | "account";
  status: string;
  voided_at: string | null;
  created_at: string;
};

type DailyCountRow = {
  id: string;
  report_date: string;
  expected_cash: number;
  actual_cash: number;
  difference: number;
  status: "short" | "over" | "matched";
  starting_bank: number;
  cash_sales: number;
  credit_sales: number;
  credit_account_payments: number;
  cash_expenses: number;
  deposit_amount: number;
  sales_total: number;
  updated_at: string;
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
  voidReceiptCount: number;
  voidItemLines: number;
  voidQuantity: number;
  voidTotalSales: number;
};

type DepartmentItemDetailRow = {
  productName: string;
  receiptCount: number;
  quantity: number;
  totalCost: number;
  totalSales: number;
  profit: number;
  marginPercent: number;
};

type DepartmentVoidDetailRow = {
  id: string;
  saleNumber: number | null;
  productName: string;
  quantity: number;
  salePrice: number;
  lineTotal: number;
  paymentMethod: string;
  createdAt: string;
};

type DepartmentDetails = {
  active: DepartmentItemDetailRow[];
  voided: DepartmentVoidDetailRow[];
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

type CreditCustomerRow = {
  customerKey: string;
  customerName: string;
  customerPhone: string;
  creditAllowance: number;
  invoiceCount: number;
  amountOwed: number;
  outstandingSince: string;
  oldestSaleNumber: number | null;
  newestSaleNumber: number | null;
};

type VendorCreditRow = {
  companyKey: string;
  companyName: string;
  entryCount: number;
  amountOwed: number;
  outstandingSince: string;
  oldestExpenseNumber: number | null;
  newestExpenseNumber: number | null;
};

type CreditExpenseBalanceRow = {
  expense: ExpenseRow;
  paidAmount: number;
  remainingAmount: number;
  activePaymentCount: number;
  paymentEverCount: number;
  payments: ExpensePaymentRow[];
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

function getPresetRange(range: ReportRange) {
  const today = startOfLocalDay(new Date());

  if (range === "today") {
    return {
      startDate: localDateInputValue(today),
      endDate: localDateInputValue(today),
    };
  }

  if (range === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return {
      startDate: localDateInputValue(yesterday),
      endDate: localDateInputValue(yesterday),
    };
  }

  if (range === "this_week") {
    const start = new Date(today);
    const day = start.getDay();
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
      endDate: localDateInputValue(end),
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
  if (range === "today") return "اليوم / Today";
  if (range === "yesterday") return "أمس / Yesterday";
  if (range === "this_week") return "هذا الأسبوع / This Week";
  if (range === "this_month") return "هذا الشهر / This Month";
  if (range === "last_month") return "الشهر الماضي / Last Month";
  if (range === "year_to_date") return "من بداية السنة / Year to Date";
  return "تخصيص / Custom";
}

function englishRangeLabel(range: ReportRange) {
  if (range === "today") return "Today";
  if (range === "yesterday") return "Yesterday";
  if (range === "this_week") return "This week";
  if (range === "this_month") return "This month";
  if (range === "last_month") return "Last month";
  if (range === "year_to_date") return "Year to date";
  return "Custom";
}

function rangeLabelByLanguage(range: ReportRange, language: ReportLanguage) {
  return rangeLabel(range);
}

function dayRange(startDateValue: string, endDateValue: string) {
  const parseDate = (value: string) => {
    const [yearText, monthText, dayText] = value.split("-");
    return {
      year: Number(yearText),
      month: Number(monthText),
      day: Number(dayText),
    };
  };

  const startParts = parseDate(startDateValue);
  const endParts = parseDate(endDateValue || startDateValue);
  const today = new Date();

  const start =
    startParts.year && startParts.month && startParts.day
      ? new Date(startParts.year, startParts.month - 1, startParts.day, 0, 0, 0, 0)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);

  const end =
    endParts.year && endParts.month && endParts.day
      ? new Date(endParts.year, endParts.month - 1, endParts.day + 1, 0, 0, 0, 0)
      : new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, 0, 0, 0, 0);

  return { start, end };
}

function formatArabicDate(value: string) {
  if (!value) return "—";
  const [yearText, monthText, dayText] = value.slice(0, 10).split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) return "—";

  return new Date(year, month - 1, day).toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

function formatArabicDateRange(startDate: string, endDate: string) {
  if (startDate === endDate) return formatArabicDate(startDate);
  return `${formatArabicDate(startDate)} - ${formatArabicDate(endDate)}`;
}

function formatEnglishDate(value: string) {
  if (!value) return "—";
  const [yearText, monthText, dayText] = value.slice(0, 10).split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) return "—";

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatDateRangeByLanguage(
  startDate: string,
  endDate: string,
  language: ReportLanguage,
) {
  const arabic = formatArabicDateRange(startDate, endDate);
  const english = startDate === endDate
    ? formatEnglishDate(startDate)
    : `${formatEnglishDate(startDate)} - ${formatEnglishDate(endDate)}`;
  return `${arabic} / ${english}`;
}

function formatArabicDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysOutstanding(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;

  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function reportTitle(mode: ReportMode) {
  if (mode === "department") return "تقرير حسب القسم / Sales by Department";
  if (mode === "items") return "تقرير حسب القطع / Sales by Item";
  if (mode === "credit") return "المبالغ المستحقة على الزبائن / Customer Credit";
  if (mode === "expenses") return "المصروفات / Expenses";
  if (mode === "vendorCredit") return "ائتمان الموردين / Vendor Credit";
  if (mode === "dailyCount") return "عد الصندوق اليومي / Daily Cash Count";
  return "الربح والخسارة / Profit & Loss";
}

function englishReportTitle(mode: ReportMode) {
  if (mode === "department") return "Sales by Department";
  if (mode === "items") return "Sales by Item";
  if (mode === "credit") return "Customer Credit";
  if (mode === "expenses") return "Expenses";
  if (mode === "vendorCredit") return "Vendor Credit";
  if (mode === "dailyCount") return "Daily Cash Count";
  return "Profit & Loss";
}

function reportTitleByLanguage(mode: ReportMode, language: ReportLanguage) {
  return reportTitle(mode);
}

function isAllTimeMode(mode: ReportMode) {
  return mode === "credit" || mode === "vendorCredit";
}

function isReturnStatus(value: string) {
  const normalized = String(value || "").toLowerCase().trim();
  return normalized === "return" || normalized === "returned";
}

function dailyCountStatusLabel(status: DailyCountRow["status"]) {
  if (status === "short") return "نقص / Short";
  if (status === "over") return "زيادة / Over";
  return "مطابق / Matched";
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

function backToPOS() {
  if (typeof window === "undefined") return;
  window.location.href = "/partpos";
}

function openEndOfDayReport() {
  if (typeof window === "undefined") return;
  window.open("/partpos/end-of-day", "_blank", "noopener,noreferrer");
}

function logoutReportsOnly() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("partpos_access_mode");
  window.location.href = "/partpos";
}

function StatBox({
  label,
  value,
  tone = "plain",
  small,
}: {
  label: string;
  value: string | number;
  tone?: "plain" | "red" | "green" | "orange" | "purple";
  small?: string;
}) {
  return (
    <div className={`statBox ${tone}Box`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {small && <small>{small}</small>}
    </div>
  );
}

function DetailCell({
  label,
  value,
  tone = "plain",
}: {
  label: string;
  value: string | number;
  tone?: "plain" | "red" | "green" | "orange" | "purple";
}) {
  return (
    <div className="detailCell">
      <span>{label}</span>
      <strong className={tone === "plain" ? "" : `${tone}Text`}>{value}</strong>
    </div>
  );
}

function cleanExpensePayment(payment: any): ExpensePaymentRow {
  return {
    id: String(payment.id ?? ""),
    payment_number:
      payment.payment_number === null || payment.payment_number === undefined
        ? null
        : Number(payment.payment_number),
    expense_id: String(payment.expense_id ?? ""),
    expense_number:
      payment.expense_number === null || payment.expense_number === undefined
        ? null
        : Number(payment.expense_number),
    expense_type: payment.expense_type === "utility" ? "utility" : "vendor",
    company_name: String(payment.company_name ?? ""),
    details: String(payment.details ?? ""),
    amount: Number(payment.amount ?? 0),
    paid_by: payment.paid_by === "account" ? "account" : "cash",
    status: String(payment.status ?? ""),
    voided_at:
      payment.voided_at === null || payment.voided_at === undefined
        ? null
        : String(payment.voided_at),
    created_at: String(payment.created_at ?? ""),
  };
}

export default function PartPOSReportsPage() {
  const [mode, setMode] = useState<ReportMode>("department");
  const [isReportsOnlyAccess, setIsReportsOnlyAccess] = useState(false);
  const reportsOnlyLanguage: ReportLanguage = "ar";
  const [rangePreset, setRangePreset] = useState<ReportRange>("today");
  const [startDate, setStartDate] = useState(() => getPresetRange("today").startDate);
  const [endDate, setEndDate] = useState(() => getPresetRange("today").endDate);
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [voidedSales, setVoidedSales] = useState<SaleRow[]>([]);
  const [voidedItems, setVoidedItems] = useState<SaleItem[]>([]);
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string, boolean>>({});
  const [creditSales, setCreditSales] = useState<SaleRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [voidedExpenses, setVoidedExpenses] = useState<ExpenseRow[]>([]);
  const [vendorCreditExpenses, setVendorCreditExpenses] = useState<ExpenseRow[]>([]);
  const [expensePayments, setExpensePayments] = useState<ExpensePaymentRow[]>([]);
  const [voidedExpensePayments, setVoidedExpensePayments] = useState<ExpensePaymentRow[]>([]);
  const [allExpensePayments, setAllExpensePayments] = useState<ExpensePaymentRow[]>([]);
  const [dailyCounts, setDailyCounts] = useState<DailyCountRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [voidExpense, setVoidExpense] = useState<ExpenseRow | null>(null);
  const [voidExpensePin, setVoidExpensePin] = useState("");
  const [voidExpenseError, setVoidExpenseError] = useState("");
  const [voidingExpenseId, setVoidingExpenseId] = useState<string | null>(null);
  const [payExpense, setPayExpense] = useState<ExpenseRow | null>(null);
  const [payExpenseAmount, setPayExpenseAmount] = useState("");
  const [payExpensePaidBy, setPayExpensePaidBy] = useState<"cash" | "account">("cash");
  const [payExpensePin, setPayExpensePin] = useState("");
  const [payExpenseError, setPayExpenseError] = useState("");
  const [payingExpenseId, setPayingExpenseId] = useState<string | null>(null);
  const [voidExpensePayment, setVoidExpensePayment] = useState<ExpensePaymentRow | null>(null);
  const [voidExpensePaymentPin, setVoidExpensePaymentPin] = useState("");
  const [voidExpensePaymentError, setVoidExpensePaymentError] = useState("");
  const [voidingExpensePaymentId, setVoidingExpensePaymentId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;
    return createClient<any>(url, anonKey);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const accessParam = params.get("access");
    const savedAccessMode = window.localStorage.getItem("partpos_access_mode");

    setIsReportsOnlyAccess(
      accessParam === "reports_only" || savedAccessMode === "reports_only",
    );

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

  const reportsOnlyIsEnglish = false;
  const reportsOnlySelectedRangeText =
    rangePreset === "custom"
      ? formatDateRangeByLanguage(startDate, endDate, reportsOnlyLanguage)
      : `${rangeLabelByLanguage(rangePreset, reportsOnlyLanguage)} • ${formatDateRangeByLanguage(
          startDate,
          endDate,
          reportsOnlyLanguage,
        )}`;

  const loadReports = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError("");
    setActionMessage("");

    try {
      const { start, end } = dayRange(startDate, endDate);

      const { data: saleRowsRaw, error: salesError } = await supabase
        .from("partpos_sales")
        .select(
          "id, sale_number, sale_total, amount_paid, change_due, payment_method, customer_id, customer_name, customer_phone, customer_credit_allowance, status, created_at",
        )
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .or("status.is.null,status.neq.voided")
        .order("created_at", { ascending: false })
        .limit(10000);

      if (salesError) throw salesError;

      const cleanSales: SaleRow[] = ((saleRowsRaw ?? []) as any[]).map((sale) => ({
        id: String(sale.id ?? ""),
        sale_number:
          sale.sale_number === null || sale.sale_number === undefined
            ? null
            : Number(sale.sale_number),
        sale_total: isReturnStatus(String(sale.status ?? ""))
          ? -Math.abs(Number(sale.sale_total ?? 0))
          : Number(sale.sale_total ?? 0),
        amount_paid: Number(sale.amount_paid ?? 0),
        change_due: Number(sale.change_due ?? 0),
        payment_method: String(sale.payment_method ?? "cash"),
        customer_id:
          sale.customer_id === null || sale.customer_id === undefined
            ? null
            : String(sale.customer_id),
        customer_name: String(sale.customer_name ?? ""),
        customer_phone: String(sale.customer_phone ?? ""),
        customer_credit_allowance: Number(sale.customer_credit_allowance ?? 0),
        status: String(sale.status ?? ""),
        created_at: String(sale.created_at ?? ""),
      }));

      const returnSaleIds = new Set(
        cleanSales.filter((sale) => isReturnStatus(sale.status)).map((sale) => sale.id),
      );

      const saleIds = cleanSales.map((sale) => sale.id).filter(Boolean);
      let cleanItems: SaleItem[] = [];

      if (saleIds.length > 0) {
        const { data: itemRowsRaw, error: itemsError } = await supabase
          .from("partpos_sale_items")
          .select(
            "id, sale_id, product_name_ar, department_ar, quantity, cost, sale_price, line_total, created_at",
          )
          .in("sale_id", saleIds)
          .order("created_at", { ascending: true })
          .limit(50000);

        if (itemsError) throw itemsError;

        cleanItems = ((itemRowsRaw ?? []) as any[]).map((item) => {
          const saleId = String(item.sale_id ?? "");
          const isReturnItem = returnSaleIds.has(saleId);
          const rawQuantity = Number(item.quantity ?? 0);
          const rawLineTotal = Number(item.line_total ?? 0);

          return {
            id: String(item.id ?? ""),
            sale_id: saleId,
            product_name_ar: String(item.product_name_ar ?? ""),
            department_ar: String(item.department_ar ?? ""),
            quantity: isReturnItem ? -Math.abs(rawQuantity) : rawQuantity,
            cost: Number(item.cost ?? 0),
            sale_price: Number(item.sale_price ?? 0),
            line_total: isReturnItem ? -Math.abs(rawLineTotal) : rawLineTotal,
            created_at: String(item.created_at ?? ""),
          };
        });
      }

      const { data: voidedSaleRowsRaw, error: voidedSalesError } = await supabase
        .from("partpos_sales")
        .select(
          "id, sale_number, sale_total, amount_paid, change_due, payment_method, customer_id, customer_name, customer_phone, customer_credit_allowance, status, created_at",
        )
        .eq("status", "voided")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: false })
        .limit(10000);

      if (voidedSalesError) throw voidedSalesError;

      const cleanVoidedSales: SaleRow[] = ((voidedSaleRowsRaw ?? []) as any[]).map((sale) => ({
        id: String(sale.id ?? ""),
        sale_number:
          sale.sale_number === null || sale.sale_number === undefined
            ? null
            : Number(sale.sale_number),
        sale_total: Number(sale.sale_total ?? 0),
        amount_paid: Number(sale.amount_paid ?? 0),
        change_due: Number(sale.change_due ?? 0),
        payment_method: String(sale.payment_method ?? "cash"),
        customer_id:
          sale.customer_id === null || sale.customer_id === undefined
            ? null
            : String(sale.customer_id),
        customer_name: String(sale.customer_name ?? ""),
        customer_phone: String(sale.customer_phone ?? ""),
        customer_credit_allowance: Number(sale.customer_credit_allowance ?? 0),
        status: String(sale.status ?? "voided"),
        created_at: String(sale.created_at ?? ""),
      }));

      const voidedSaleIds = cleanVoidedSales.map((sale) => sale.id).filter(Boolean);
      let cleanVoidedItems: SaleItem[] = [];

      if (voidedSaleIds.length > 0) {
        const { data: voidedItemRowsRaw, error: voidedItemsError } = await supabase
          .from("partpos_sale_items")
          .select(
            "id, sale_id, product_name_ar, department_ar, quantity, cost, sale_price, line_total, created_at",
          )
          .in("sale_id", voidedSaleIds)
          .order("created_at", { ascending: true })
          .limit(50000);

        if (voidedItemsError) throw voidedItemsError;

        cleanVoidedItems = ((voidedItemRowsRaw ?? []) as any[]).map((item) => ({
          id: String(item.id ?? ""),
          sale_id: String(item.sale_id ?? ""),
          product_name_ar: String(item.product_name_ar ?? ""),
          department_ar: String(item.department_ar ?? ""),
          quantity: Number(item.quantity ?? 0),
          cost: Number(item.cost ?? 0),
          sale_price: Number(item.sale_price ?? 0),
          line_total: Number(item.line_total ?? 0),
          created_at: String(item.created_at ?? ""),
        }));
      }

      const { data: creditRowsRaw, error: creditError } = await supabase
        .from("partpos_sales")
        .select(
          "id, sale_number, sale_total, amount_paid, change_due, payment_method, customer_id, customer_name, customer_phone, customer_credit_allowance, status, created_at",
        )
        .eq("payment_method", "credit")
        .or("status.is.null,status.neq.voided")
        .not("status", "eq", "return")
        .not("status", "eq", "returned")
        .order("created_at", { ascending: true })
        .limit(50000);

      if (creditError) throw creditError;

      const cleanCreditSales: SaleRow[] = ((creditRowsRaw ?? []) as any[]).map((sale) => ({
        id: String(sale.id ?? ""),
        sale_number:
          sale.sale_number === null || sale.sale_number === undefined
            ? null
            : Number(sale.sale_number),
        sale_total: Number(sale.sale_total ?? 0),
        amount_paid: Number(sale.amount_paid ?? 0),
        change_due: Number(sale.change_due ?? 0),
        payment_method: "credit",
        customer_id:
          sale.customer_id === null || sale.customer_id === undefined
            ? null
            : String(sale.customer_id),
        customer_name: String(sale.customer_name ?? ""),
        customer_phone: String(sale.customer_phone ?? ""),
        customer_credit_allowance: Number(sale.customer_credit_allowance ?? 0),
        status: String(sale.status ?? ""),
        created_at: String(sale.created_at ?? ""),
      }));

      const { data: expenseRowsRaw, error: expenseError } = await supabase
        .from("partpos_expenses")
        .select("id, expense_number, expense_type, details, company_name, amount, paid_by, status, voided_at, created_at")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .or("status.is.null,status.neq.voided")
        .order("created_at", { ascending: false })
        .limit(50000);

      if (expenseError) throw expenseError;

      const cleanExpenses: ExpenseRow[] = ((expenseRowsRaw ?? []) as any[]).map((expense) => ({
        id: String(expense.id ?? ""),
        expense_number:
          expense.expense_number === null || expense.expense_number === undefined
            ? null
            : Number(expense.expense_number),
        expense_type: expense.expense_type === "vendor" ? "vendor" : "utility",
        details: String(expense.details ?? ""),
        company_name: String(expense.company_name ?? ""),
        amount: Number(expense.amount ?? 0),
        paid_by: expense.paid_by === "credit" ? "credit" : "cash",
        status: String(expense.status ?? ""),
        voided_at:
          expense.voided_at === null || expense.voided_at === undefined
            ? null
            : String(expense.voided_at),
        created_at: String(expense.created_at ?? ""),
      }));

      const { data: voidedExpenseRowsRaw, error: voidedExpenseError } = await supabase
        .from("partpos_expenses")
        .select("id, expense_number, expense_type, details, company_name, amount, paid_by, status, voided_at, created_at")
        .eq("status", "voided")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("voided_at", { ascending: false })
        .limit(50000);

      if (voidedExpenseError) throw voidedExpenseError;

      const cleanVoidedExpenses: ExpenseRow[] = ((voidedExpenseRowsRaw ?? []) as any[]).map((expense) => ({
        id: String(expense.id ?? ""),
        expense_number:
          expense.expense_number === null || expense.expense_number === undefined
            ? null
            : Number(expense.expense_number),
        expense_type: expense.expense_type === "vendor" ? "vendor" : "utility",
        details: String(expense.details ?? ""),
        company_name: String(expense.company_name ?? ""),
        amount: Number(expense.amount ?? 0),
        paid_by: expense.paid_by === "credit" ? "credit" : "cash",
        status: String(expense.status ?? "voided"),
        voided_at:
          expense.voided_at === null || expense.voided_at === undefined
            ? null
            : String(expense.voided_at),
        created_at: String(expense.created_at ?? ""),
      }));

      const paymentSelect =
        "id, payment_number, expense_id, expense_number, expense_type, company_name, details, amount, paid_by, status, voided_at, created_at";

      const { data: paymentRowsRaw, error: paymentError } = await supabase
        .from("partpos_expense_payments")
        .select(paymentSelect)
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .or("status.is.null,status.neq.voided")
        .order("created_at", { ascending: false })
        .limit(50000);

      if (paymentError) throw paymentError;

      const cleanExpensePayments: ExpensePaymentRow[] = ((paymentRowsRaw ?? []) as any[]).map(
        cleanExpensePayment,
      );

      const { data: voidedPaymentRowsRaw, error: voidedPaymentError } = await supabase
        .from("partpos_expense_payments")
        .select(paymentSelect)
        .eq("status", "voided")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("voided_at", { ascending: false })
        .limit(50000);

      if (voidedPaymentError) throw voidedPaymentError;

      const cleanVoidedExpensePayments: ExpensePaymentRow[] = (
        (voidedPaymentRowsRaw ?? []) as any[]
      ).map(cleanExpensePayment);

      const { data: allPaymentRowsRaw, error: allPaymentError } = await supabase
        .from("partpos_expense_payments")
        .select(paymentSelect)
        .order("created_at", { ascending: false })
        .limit(50000);

      if (allPaymentError) throw allPaymentError;

      const cleanAllExpensePayments: ExpensePaymentRow[] = ((allPaymentRowsRaw ?? []) as any[])
        .map(cleanExpensePayment)
        .filter((payment) => payment.expense_id);

      const { data: vendorCreditRowsRaw, error: vendorCreditError } = await supabase
        .from("partpos_expenses")
        .select("id, expense_number, expense_type, details, company_name, amount, paid_by, status, voided_at, created_at")
        .eq("expense_type", "vendor")
        .eq("paid_by", "credit")
        .or("status.is.null,status.neq.voided")
        .order("created_at", { ascending: true })
        .limit(50000);

      if (vendorCreditError) throw vendorCreditError;

      const cleanVendorCreditExpenses: ExpenseRow[] = ((vendorCreditRowsRaw ?? []) as any[]).map(
        (expense) => ({
          id: String(expense.id ?? ""),
          expense_number:
            expense.expense_number === null || expense.expense_number === undefined
              ? null
              : Number(expense.expense_number),
          expense_type: "vendor",
          details: String(expense.details ?? ""),
          company_name: String(expense.company_name ?? ""),
          amount: Number(expense.amount ?? 0),
          paid_by: "credit",
          status: String(expense.status ?? ""),
          voided_at:
            expense.voided_at === null || expense.voided_at === undefined
              ? null
              : String(expense.voided_at),
          created_at: String(expense.created_at ?? ""),
        }),
      );

      const { data: dailyRowsRaw, error: dailyError } = await supabase
        .from("partpos_daily_counts")
        .select(
          "id, report_date, expected_cash, actual_cash, difference, status, starting_bank, cash_sales, credit_sales, credit_account_payments, cash_expenses, deposit_amount, sales_total, updated_at",
        )
        .gte("report_date", startDate)
        .lte("report_date", endDate)
        .order("report_date", { ascending: false })
        .limit(10000);

      if (dailyError) throw dailyError;

      const cleanDailyCounts: DailyCountRow[] = ((dailyRowsRaw ?? []) as any[]).map((row) => ({
        id: String(row.id ?? ""),
        report_date: String(row.report_date ?? ""),
        expected_cash: Number(row.expected_cash ?? 0),
        actual_cash: Number(row.actual_cash ?? 0),
        difference: Number(row.difference ?? 0),
        status:
          row.status === "short" || row.status === "over" || row.status === "matched"
            ? row.status
            : "matched",
        starting_bank: Number(row.starting_bank ?? 0),
        cash_sales: Number(row.cash_sales ?? 0),
        credit_sales: Number(row.credit_sales ?? 0),
        credit_account_payments: Number(row.credit_account_payments ?? 0),
        cash_expenses: Number(row.cash_expenses ?? 0),
        deposit_amount: Number(row.deposit_amount ?? 0),
        sales_total: Number(row.sales_total ?? 0),
        updated_at: String(row.updated_at ?? ""),
      }));

      setSales(cleanSales);
      setItems(cleanItems);
      setVoidedSales(cleanVoidedSales);
      setVoidedItems(cleanVoidedItems);
      setCreditSales(cleanCreditSales);
      setExpenses(cleanExpenses);
      setVoidedExpenses(cleanVoidedExpenses);
      setVendorCreditExpenses(cleanVendorCreditExpenses);
      setExpensePayments(cleanExpensePayments);
      setVoidedExpensePayments(cleanVoidedExpensePayments);
      setAllExpensePayments(cleanAllExpensePayments);
      setDailyCounts(cleanDailyCounts);
      setLastUpdated(
        new Date().toLocaleTimeString("ar-JO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (caught) {
      setError(readSupabaseError(caught));
    } finally {
      setLoading(false);
    }
  }, [endDate, startDate, supabase]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const voidedSaleById = useMemo(() => {
    const map = new Map<string, SaleRow>();

    for (const sale of voidedSales) {
      map.set(sale.id, sale);
    }

    return map;
  }, [voidedSales]);

  const receiptSetsByDepartment = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
      if (!groups[department]) groups[department] = new Set<string>();
      groups[department].add(item.sale_id);
    }

    return groups;
  }, [items]);

  const voidReceiptSetsByDepartment = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    for (const item of voidedItems) {
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
      if (!groups[department]) groups[department] = new Set<string>();
      groups[department].add(item.sale_id);
    }

    return groups;
  }, [voidedItems]);

  const receiptSetsByItem = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    for (const item of items) {
      const productName = item.product_name_ar.trim() || "قطعة بدون اسم / Unnamed Item";
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
      const key = `${productName}__${department}`;

      if (!groups[key]) groups[key] = new Set<string>();
      groups[key].add(item.sale_id);
    }

    return groups;
  }, [items]);

  const departmentRows = useMemo<DepartmentReportRow[]>(() => {
    const groups: Record<string, DepartmentReportRow> = {};

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
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
          voidReceiptCount: 0,
          voidItemLines: 0,
          voidQuantity: 0,
          voidTotalSales: 0,
        };
      }

      groups[department].itemLines += 1;
      groups[department].quantity += quantity;
      groups[department].totalCost += totalCost;
      groups[department].totalSales += totalSales;
      groups[department].profit += totalSales - totalCost;
    }

    for (const item of voidedItems) {
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
      const quantity = Number(item.quantity) || 0;
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
          voidReceiptCount: 0,
          voidItemLines: 0,
          voidQuantity: 0,
          voidTotalSales: 0,
        };
      }

      groups[department].voidItemLines += 1;
      groups[department].voidQuantity += quantity;
      groups[department].voidTotalSales += totalSales;
    }

    return Object.values(groups)
      .map((row) => ({
        ...row,
        receiptCount: receiptSetsByDepartment[row.department]?.size ?? 0,
        voidReceiptCount: voidReceiptSetsByDepartment[row.department]?.size ?? 0,
        marginPercent: row.totalSales > 0 ? (row.profit / row.totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [items, receiptSetsByDepartment, voidReceiptSetsByDepartment, voidedItems]);

  const departmentDetailsByDepartment = useMemo<Record<string, DepartmentDetails>>(() => {
    const details: Record<string, DepartmentDetails> = {};
    const activeGroups: Record<
      string,
      DepartmentItemDetailRow & { department: string; receiptIds: Set<string> }
    > = {};

    function ensureDepartment(department: string) {
      if (!details[department]) {
        details[department] = { active: [], voided: [] };
      }
      return details[department];
    }

    for (const item of items) {
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
      const productName = item.product_name_ar.trim() || "قطعة بدون اسم / Unnamed Item";
      const key = `${department}__${productName}`;
      const quantity = Number(item.quantity) || 0;
      const totalCost = (Number(item.cost) || 0) * quantity;
      const totalSales = Number(item.line_total) || 0;

      ensureDepartment(department);

      if (!activeGroups[key]) {
        activeGroups[key] = {
          productName,
          department,
          receiptCount: 0,
          quantity: 0,
          totalCost: 0,
          totalSales: 0,
          profit: 0,
          marginPercent: 0,
          receiptIds: new Set<string>(),
        };
      }

      activeGroups[key].receiptIds.add(item.sale_id);
      activeGroups[key].quantity += quantity;
      activeGroups[key].totalCost += totalCost;
      activeGroups[key].totalSales += totalSales;
      activeGroups[key].profit += totalSales - totalCost;
    }

    for (const group of Object.values(activeGroups)) {
      const row: DepartmentItemDetailRow = {
        productName: group.productName,
        receiptCount: group.receiptIds.size,
        quantity: group.quantity,
        totalCost: group.totalCost,
        totalSales: group.totalSales,
        profit: group.profit,
        marginPercent: group.totalSales > 0 ? (group.profit / group.totalSales) * 100 : 0,
      };

      ensureDepartment(group.department).active.push(row);
    }

    for (const item of voidedItems) {
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
      const sale = voidedSaleById.get(item.sale_id);

      ensureDepartment(department).voided.push({
        id: item.id,
        saleNumber: sale?.sale_number ?? null,
        productName: item.product_name_ar.trim() || "قطعة بدون اسم / Unnamed Item",
        quantity: Number(item.quantity) || 0,
        salePrice: Number(item.sale_price) || 0,
        lineTotal: Number(item.line_total) || 0,
        paymentMethod: sale?.payment_method || "cash",
        createdAt: sale?.created_at || item.created_at,
      });
    }

    for (const detail of Object.values(details)) {
      detail.active.sort((a, b) => b.totalSales - a.totalSales);
      detail.voided.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return details;
  }, [items, voidedItems, voidedSaleById]);

  const itemRows = useMemo<ItemReportRow[]>(() => {
    const groups: Record<string, ItemReportRow> = {};

    for (const item of items) {
      const productName = item.product_name_ar.trim() || "قطعة بدون اسم / Unnamed Item";
      const department = item.department_ar.trim() || "غير محدد / Unspecified";
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

  const creditCustomerRows = useMemo<CreditCustomerRow[]>(() => {
    const groups: Record<string, CreditCustomerRow> = {};

    for (const sale of creditSales) {
      const amountOwed = Number(sale.sale_total || 0) - Number(sale.amount_paid || 0);
      if (amountOwed <= 0) continue;

      const customerName = sale.customer_name.trim() || "زبون غير محدد / Unspecified Customer";
      const customerPhone = sale.customer_phone.trim();
      const customerKey =
        sale.customer_id || `${customerName}__${customerPhone || "no-phone"}`.toLowerCase();

      if (!groups[customerKey]) {
        groups[customerKey] = {
          customerKey,
          customerName,
          customerPhone,
          creditAllowance: Number(sale.customer_credit_allowance || 0),
          invoiceCount: 0,
          amountOwed: 0,
          outstandingSince: sale.created_at,
          oldestSaleNumber: sale.sale_number,
          newestSaleNumber: sale.sale_number,
        };
      }

      const group = groups[customerKey];
      group.invoiceCount += 1;
      group.amountOwed += amountOwed;
      group.creditAllowance = Math.max(
        Number(group.creditAllowance || 0),
        Number(sale.customer_credit_allowance || 0),
      );

      if (new Date(sale.created_at).getTime() < new Date(group.outstandingSince).getTime()) {
        group.outstandingSince = sale.created_at;
        group.oldestSaleNumber = sale.sale_number;
      }

      if (
        group.newestSaleNumber === null ||
        (sale.sale_number !== null && sale.sale_number > group.newestSaleNumber)
      ) {
        group.newestSaleNumber = sale.sale_number;
      }
    }

    return Object.values(groups).sort(
      (a, b) =>
        new Date(a.outstandingSince).getTime() - new Date(b.outstandingSince).getTime(),
    );
  }, [creditSales]);

  const activeExpensePaymentsAll = useMemo(() => {
    return allExpensePayments.filter((payment) => payment.status !== "voided");
  }, [allExpensePayments]);

  const paymentHistoryByExpenseId = useMemo(() => {
    const groups: Record<string, ExpensePaymentRow[]> = {};

    for (const payment of allExpensePayments) {
      if (!payment.expense_id) continue;
      if (!groups[payment.expense_id]) groups[payment.expense_id] = [];
      groups[payment.expense_id].push(payment);
    }

    for (const key of Object.keys(groups)) {
      groups[key].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return groups;
  }, [allExpensePayments]);

  const paidAmountByExpenseId = useMemo(() => {
    const totals: Record<string, number> = {};

    for (const payment of activeExpensePaymentsAll) {
      if (!payment.expense_id) continue;
      totals[payment.expense_id] =
        Number(totals[payment.expense_id] || 0) + Number(payment.amount || 0);
    }

    return totals;
  }, [activeExpensePaymentsAll]);

  const vendorCreditExpenseBalanceRows = useMemo<CreditExpenseBalanceRow[]>(() => {
    return vendorCreditExpenses
      .map((expense) => {
        const payments = paymentHistoryByExpenseId[expense.id] ?? [];
        const activePayments = payments.filter((payment) => payment.status !== "voided");
        const paidAmount = activePayments.reduce(
          (sum, payment) => sum + Number(payment.amount || 0),
          0,
        );
        const remainingAmount = Math.max(Number(expense.amount || 0) - paidAmount, 0);

        return {
          expense,
          paidAmount,
          remainingAmount,
          activePaymentCount: activePayments.length,
          paymentEverCount: payments.length,
          payments,
        };
      })
      .filter((row) => row.remainingAmount > 0.0001)
      .sort(
        (a, b) =>
          new Date(a.expense.created_at).getTime() - new Date(b.expense.created_at).getTime(),
      );
  }, [vendorCreditExpenses, paymentHistoryByExpenseId]);

  const vendorCreditRows = useMemo<VendorCreditRow[]>(() => {
    const groups: Record<string, VendorCreditRow> = {};

    for (const balance of vendorCreditExpenseBalanceRows) {
      const expense = balance.expense;
      const companyName = expense.company_name.trim() || "مورد غير محدد / Unspecified Supplier";
      const companyKey = companyName.toLowerCase();

      if (!groups[companyKey]) {
        groups[companyKey] = {
          companyKey,
          companyName,
          entryCount: 0,
          amountOwed: 0,
          outstandingSince: expense.created_at,
          oldestExpenseNumber: expense.expense_number,
          newestExpenseNumber: expense.expense_number,
        };
      }

      const group = groups[companyKey];
      group.entryCount += 1;
      group.amountOwed += balance.remainingAmount;

      if (new Date(expense.created_at).getTime() < new Date(group.outstandingSince).getTime()) {
        group.outstandingSince = expense.created_at;
        group.oldestExpenseNumber = expense.expense_number;
      }

      if (
        group.newestExpenseNumber === null ||
        (expense.expense_number !== null && expense.expense_number > group.newestExpenseNumber)
      ) {
        group.newestExpenseNumber = expense.expense_number;
      }
    }

    return Object.values(groups).sort(
      (a, b) =>
        new Date(a.outstandingSince).getTime() - new Date(b.outstandingSince).getTime(),
    );
  }, [vendorCreditExpenseBalanceRows]);

  const totalCost = items.reduce(
    (sum, item) => sum + (Number(item.cost) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const totalSales = items.reduce((sum, item) => sum + (Number(item.line_total) || 0), 0);
  const totalProfit = totalSales - totalCost;
  const totalMarginPercent = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const totalCreditOwed = creditCustomerRows.reduce(
    (sum, row) => sum + Number(row.amountOwed || 0),
    0,
  );
  const totalCreditInvoices = creditCustomerRows.reduce(
    (sum, row) => sum + Number(row.invoiceCount || 0),
    0,
  );

  const cashExpensesForPeriod = expenses
    .filter((row) => row.paid_by === "cash")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const creditExpensePaymentsForPeriod = expensePayments.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0,
  );
  const totalExpenses = cashExpensesForPeriod + creditExpensePaymentsForPeriod;
  const totalVoidedExpenses = voidedExpenses.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0,
  );
  const totalVoidedExpensePayments = voidedExpensePayments.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0,
  );
  const profitLossSales = sales.reduce(
    (sum, sale) => sum + Number(sale.sale_total || 0),
    0,
  );
  const profitLossExpenses = totalExpenses;
  const profitLossNet = profitLossSales - profitLossExpenses;
  const profitLossLabel = profitLossNet >= 0 ? "ربح / Profit" : "خسارة / Loss";

  const utilityExpenses = expenses
    .filter((row) => row.expense_type === "utility" && row.paid_by === "cash")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const vendorCashExpenses = expenses
    .filter((row) => row.expense_type === "vendor" && row.paid_by === "cash")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const vendorCreditExpensesForPeriod = expenses
    .filter((row) => row.expense_type === "vendor" && row.paid_by === "credit")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);

  const totalVendorCreditOwed = vendorCreditRows.reduce(
    (sum, row) => sum + Number(row.amountOwed || 0),
    0,
  );
  const totalVendorCreditEntries = vendorCreditRows.reduce(
    (sum, row) => sum + Number(row.entryCount || 0),
    0,
  );

  const totalDailyShort = dailyCounts
    .filter((row) => row.status === "short")
    .reduce((sum, row) => sum + Math.abs(Number(row.difference || 0)), 0);
  const totalDailyOver = dailyCounts
    .filter((row) => row.status === "over")
    .reduce((sum, row) => sum + Math.abs(Number(row.difference || 0)), 0);
  const shortDayCount = dailyCounts.filter((row) => row.status === "short").length;
  const overDayCount = dailyCounts.filter((row) => row.status === "over").length;
  const matchedDayCount = dailyCounts.filter((row) => row.status === "matched").length;
  const totalDailyCashExpenses = dailyCounts.reduce(
    (sum, row) => sum + Number(row.cash_expenses || 0),
    0,
  );

  const totalVoidedReceiptCount = useMemo(() => {
    return new Set(voidedItems.map((item) => item.sale_id)).size;
  }, [voidedItems]);

  const totalVoidedDepartmentSales = voidedItems.reduce(
    (sum, item) => sum + Number(item.line_total || 0),
    0,
  );

  function toggleDepartment(department: string) {
    setExpandedDepartments((current) => ({
      ...current,
      [department]: !current[department],
    }));
  }

  function creditExpenseBalance(expense: ExpenseRow) {
    const paidAmount = Number(paidAmountByExpenseId[expense.id] || 0);
    return {
      paidAmount,
      remainingAmount: Math.max(Number(expense.amount || 0) - paidAmount, 0),
      paymentEverCount: paymentHistoryByExpenseId[expense.id]?.length ?? 0,
    };
  }

  function openPayExpensePopup(expense: ExpenseRow) {
    const balance = creditExpenseBalance(expense);
    if (expense.paid_by !== "credit" || balance.remainingAmount <= 0) return;

    setPayExpense(expense);
    setPayExpenseAmount(money(balance.remainingAmount));
    setPayExpensePaidBy("cash");
    setPayExpensePin("");
    setPayExpenseError("");
    setActionMessage("");
  }

  function closePayExpensePopup() {
    if (payingExpenseId) return;

    setPayExpense(null);
    setPayExpenseAmount("");
    setPayExpensePin("");
    setPayExpenseError("");
  }

  async function confirmPayExpense() {
    if (!supabase || !payExpense) return;

    const amount = Number(payExpenseAmount);
    const balance = creditExpenseBalance(payExpense);

    if (!Number.isFinite(amount) || amount <= 0) {
      setPayExpenseError("أدخل مبلغ دفع صحيح. / Enter a valid payment amount.");
      return;
    }

    if (amount > balance.remainingAmount + 0.0001) {
      setPayExpenseError(`المبلغ أكبر من المتبقي / Amount exceeds remaining balance: ${money(balance.remainingAmount)} د.أ`);
      return;
    }

    if (payExpensePin !== EXPENSE_VOID_PIN) {
      setPayExpenseError("الرمز غير صحيح. أدخل رمز الدخول لتسجيل الدفعة. / Incorrect PIN. Enter the login PIN to record the payment.");
      setPayExpensePin("");
      return;
    }

    setPayingExpenseId(payExpense.id);
    setPayExpenseError("");

    try {
      const { error: insertError } = await supabase.from("partpos_expense_payments").insert({
        expense_id: payExpense.id,
        expense_number: payExpense.expense_number,
        expense_type: payExpense.expense_type,
        company_name: payExpense.company_name || "مورد غير محدد / Unspecified Supplier",
        details: payExpense.details || "دفعة على ائتمان مورد / Supplier Credit Payment",
        amount,
        paid_by: payExpensePaidBy,
        status: "active",
      });

      if (insertError) throw insertError;

      setActionMessage(
        `تم تسجيل دفعة / Payment recorded: ${money(amount)} د.أ على قيد / on entry ${payExpense.expense_number ?? "—"}.`,
      );
      setPayExpense(null);
      setPayExpenseAmount("");
      setPayExpensePin("");
      await loadReports();
    } catch (caught) {
      setPayExpenseError(`خطأ Supabase / Supabase error: ${readSupabaseError(caught)}`);
    } finally {
      setPayingExpenseId(null);
    }
  }

  function openVoidExpensePaymentConfirm(payment: ExpensePaymentRow) {
    if (isReportsOnlyAccess) return;

    setVoidExpensePayment(payment);
    setVoidExpensePaymentPin("");
    setVoidExpensePaymentError("");
    setActionMessage("");
  }

  function closeVoidExpensePaymentConfirm() {
    if (voidingExpensePaymentId) return;

    setVoidExpensePayment(null);
    setVoidExpensePaymentPin("");
    setVoidExpensePaymentError("");
  }

  async function confirmVoidExpensePayment() {
    if (!supabase || !voidExpensePayment) return;

    if (voidExpensePaymentPin !== EXPENSE_VOID_PIN) {
      setVoidExpensePaymentError("الرمز غير صحيح. أدخل رمز الدخول لإلغاء الدفعة. / Incorrect PIN. Enter the login PIN to void the payment.");
      setVoidExpensePaymentPin("");
      return;
    }

    setVoidingExpensePaymentId(voidExpensePayment.id);
    setVoidExpensePaymentError("");

    try {
      const { error: updateError } = await supabase
        .from("partpos_expense_payments")
        .update({
          status: "voided",
          voided_at: new Date().toISOString(),
        })
        .eq("id", voidExpensePayment.id);

      if (updateError) throw updateError;

      setActionMessage(`تم إلغاء دفعة رقم / Payment voided No. ${voidExpensePayment.payment_number ?? "—"}.`);
      setVoidExpensePayment(null);
      setVoidExpensePaymentPin("");
      await loadReports();
    } catch (caught) {
      setVoidExpensePaymentError(`خطأ Supabase / Supabase error: ${readSupabaseError(caught)}`);
    } finally {
      setVoidingExpensePaymentId(null);
    }
  }

  function openVoidExpenseConfirm(expense: ExpenseRow) {
    if (isReportsOnlyAccess) return;

    const balance = creditExpenseBalance(expense);
    if (expense.paid_by === "credit" && balance.paymentEverCount > 0) {
      setActionMessage(
        "لا يمكن إلغاء هذا المصروف لأنه يوجد دفعات عليه. قم بإلغاء الدفعات أولاً، وبعد وجود سجل دفعات سابق سيبقى القيد محفوظاً للمراجعة. / This expense has payments. Void them first; the entry remains for audit history.",
      );
      return;
    }

    setVoidExpense(expense);
    setVoidExpensePin("");
    setVoidExpenseError("");
    setActionMessage("");
  }

  function closeVoidExpenseConfirm() {
    if (voidingExpenseId) return;

    setVoidExpense(null);
    setVoidExpensePin("");
    setVoidExpenseError("");
  }

  async function confirmVoidExpense() {
    if (!supabase || !voidExpense) return;

    if (voidExpensePin !== EXPENSE_VOID_PIN) {
      setVoidExpenseError("الرمز غير صحيح. أدخل رمز الدخول لإلغاء المصروف. / Incorrect PIN. Enter the login PIN to void the expense.");
      setVoidExpensePin("");
      return;
    }

    setVoidingExpenseId(voidExpense.id);
    setVoidExpenseError("");

    try {
      const { error: updateError } = await supabase
        .from("partpos_expenses")
        .update({
          status: "voided",
          voided_at: new Date().toISOString(),
        })
        .eq("id", voidExpense.id);

      if (updateError) throw updateError;

      setActionMessage(`تم إلغاء المصروف رقم / Expense voided No. ${voidExpense.expense_number ?? "—"}.`);
      setVoidExpense(null);
      setVoidExpensePin("");
      await loadReports();
    } catch (caught) {
      setVoidExpenseError(`خطأ Supabase / Supabase error: ${readSupabaseError(caught)}`);
    } finally {
      setVoidingExpenseId(null);
    }
  }

  const activeRowsCount =
    mode === "department"
      ? departmentRows.length
      : mode === "items"
        ? itemRows.length
        : mode === "credit"
          ? creditCustomerRows.length
          : mode === "expenses"
            ? expenses.length + expensePayments.length
            : mode === "vendorCredit"
              ? vendorCreditExpenseBalanceRows.length
              : mode === "dailyCount"
                ? dailyCounts.length
                : 1;

  const reportsOnlyReportButtons: {
    value: ReportMode;
    label: string;
    helper: string;
  }[] = [
    {
      value: "department",
      label: reportsOnlyIsEnglish ? "Sales by Department" : "المبيعات حسب القسم / Sales by Department",
      helper: reportsOnlyIsEnglish ? "Default" : "الافتراضي / Default",
    },
    {
      value: "items",
      label: reportsOnlyIsEnglish ? "Sales by Item" : "المبيعات حسب القطع / Sales by Item",
      helper: reportsOnlyIsEnglish ? "Best sellers" : "أفضل القطع / Best Sellers",
    },
    {
      value: "profitLoss",
      label: reportsOnlyIsEnglish ? "Profit & Loss" : "الربح والخسارة / Profit & Loss",
      helper: reportsOnlyIsEnglish ? "Sales - expenses" : "مبيعات - مصروفات / Sales - Expenses",
    },
    {
      value: "expenses",
      label: reportsOnlyIsEnglish ? "Expenses" : "المصروفات / Expenses",
      helper: reportsOnlyIsEnglish ? "Cash + account" : "نقداً وعلى الحساب / Cash + Account",
    },
    {
      value: "dailyCount",
      label: reportsOnlyIsEnglish ? "Daily Cash Count" : "عد الصندوق / Daily Cash Count",
      helper: reportsOnlyIsEnglish ? "Short / over" : "نقص / زيادة / Short / Over",
    },
    {
      value: "credit",
      label: reportsOnlyIsEnglish ? "Customer Credit" : "ديون الزبائن / Customer Credit",
      helper: reportsOnlyIsEnglish ? "All time" : "كل الفترات / All Time",
    },
    {
      value: "vendorCredit",
      label: reportsOnlyIsEnglish ? "Vendor Credit" : "ديون الموردين / Vendor Credit",
      helper: reportsOnlyIsEnglish ? "All time" : "كل الفترات / All Time",
    },
  ];

  const reportsOnlyRangeButtons: {
    value: ReportRange;
    label: string;
    helper: string;
  }[] = [
    {
      value: "today",
      label: reportsOnlyIsEnglish ? "Today" : "اليوم / Today",
      helper: reportsOnlyIsEnglish ? "Today only" : "تقرير اليوم / Today Only",
    },
    {
      value: "yesterday",
      label: reportsOnlyIsEnglish ? "Yesterday" : "أمس / Yesterday",
      helper: reportsOnlyIsEnglish ? "Yesterday only" : "تقرير أمس / Yesterday Only",
    },
    {
      value: "this_week",
      label: reportsOnlyIsEnglish ? "Week" : "الأسبوع / Week",
      helper: reportsOnlyIsEnglish ? "Current week" : "الأسبوع الحالي / Current Week",
    },
    {
      value: "this_month",
      label: reportsOnlyIsEnglish ? "Month" : "الشهر / Month",
      helper: reportsOnlyIsEnglish ? "Current month" : "الشهر الحالي / Current Month",
    },
    {
      value: "last_month",
      label: reportsOnlyIsEnglish ? "Last Month" : "الشهر الماضي / Last Month",
      helper: reportsOnlyIsEnglish ? "Previous period" : "الفترة السابقة / Previous Period",
    },
    {
      value: "year_to_date",
      label: reportsOnlyIsEnglish ? "Year" : "السنة / Year",
      helper: reportsOnlyIsEnglish ? "Year to date" : "من بداية السنة / Year to Date",
    },
    {
      value: "custom",
      label: reportsOnlyIsEnglish ? "Custom" : "تخصيص / Custom",
      helper: reportsOnlyIsEnglish ? "Choose dates" : "اختر التاريخ / Choose Dates",
    },
  ];

  return (
    <main
      className={isReportsOnlyAccess ? "reportsPage reportsOnlyMode" : "reportsPage"}
      dir="rtl"
      suppressHydrationWarning
    >
      <section className="topCard noPrint">
        <div>
          <p className="eyebrow">PartPOS</p>
          <h1>
            {isReportsOnlyAccess
              ? "لوحة التقارير / Reports Dashboard"
              : "التقارير / Reports"}
          </h1>
          <p className="subtext">
            {isReportsOnlyAccess
              ? reportsOnlyIsEnglish
                ? "Reports-only access. Choose report type and dates easily from mobile. VOID receipts are not counted."
                : "عرض تقارير فقط. اختر التقرير والفترة بسهولة من الموبايل. الفواتير الملغاة VOID لا تُحسب. / Reports-only access. Choose report type and dates easily from mobile. VOID receipts are not counted."
              : "الفواتير الملغاة VOID لا تدخل في المبيعات أو الأرباح أو نهاية اليوم. / VOID receipts are excluded from sales, profit, and end-of-day totals."}
          </p>
          {isReportsOnlyAccess && (
            <div className="reportsOnlyBadge">
              {reportsOnlyIsEnglish
                ? "Reports only — no cashier or sale access"
                : "دخول تقارير فقط — لا يوجد صلاحية للكاشير أو البيع / Reports only — no cashier or sale access"}
            </div>
          )}
        </div>

        <div className="topActions">
          {!isReportsOnlyAccess && (
            <>
              <button type="button" className="secondaryButton" onClick={backToPOS}>
                الرجوع للكاشير / Back to Cashier
              </button>
              <button type="button" className="secondaryButton" onClick={openEndOfDayReport}>
                تقرير نهاية اليوم / End of Day Report
              </button>
            </>
          )}
          <button type="button" className="printButton" onClick={() => window.print()}>
            {"طباعة التقرير / Print Report"}
          </button>
          {isReportsOnlyAccess && (
            <button type="button" className="secondaryButton" onClick={logoutReportsOnly}>
              {"خروج / Logout"}
            </button>
          )}
        </div>
      </section>

      {!supabase && (
        <div className="warning noPrint">
          أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY حتى تظهر التقارير. / Add the Supabase URL and anon key to display reports.
        </div>
      )}

      <section className="controlsCard noPrint">
        {isReportsOnlyAccess && (
          <div className="reportsOnlyPicker">
            <div className="reportsOnlyHero">
              <div>
                <p className="eyebrow">
                  {"عرض التقارير فقط / Reports-only View"}
                </p>
                <h2>{reportTitleByLanguage(mode, reportsOnlyLanguage)}</h2>
                <p>
                  {isAllTimeMode(mode)
                    ? reportsOnlyIsEnglish
                      ? "This report shows all-time balances."
                      : "هذا التقرير يعرض كل الفترات. / This report shows all-time balances."
                    : reportsOnlySelectedRangeText}
                </p>
              </div>
              <div className="reportsOnlyHeroStat">
                <span>{"السجلات / Records"}</span>
                <strong>{activeRowsCount}</strong>
              </div>
            </div>

            <div className="reportsOnlyMiniStats">
              <div>
                <span>{"التقرير / Report"}</span>
                <strong>{reportTitleByLanguage(mode, reportsOnlyLanguage)}</strong>
              </div>
              <div>
                <span>{"الفترة / Period"}</span>
                <strong>
                  {isAllTimeMode(mode)
                    ? reportsOnlyIsEnglish
                      ? "All time"
                      : "كل الفترات / All Time"
                    : rangeLabelByLanguage(rangePreset, reportsOnlyLanguage)}
                </strong>
              </div>
              <div>
                <span>{"آخر تحديث / Last Update"}</span>
                <strong>{lastUpdated || "—"}</strong>
              </div>
            </div>

            <div className="pickerGroup">
              <div className="pickerTitleRow">
                <strong>{"نوع التقرير / Report Type"}</strong>
                <span>
                  {reportsOnlyIsEnglish
                    ? "Sales by Department is the default"
                    : "المبيعات حسب القسم هي الافتراضية / Sales by Department is the default"}
                </span>
              </div>
              <div className="mobileReportGrid">
                {reportsOnlyReportButtons.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={
                      mode === option.value
                        ? "mobileReportButton activeMobileReport"
                        : "mobileReportButton"
                    }
                    onClick={() => setMode(option.value)}
                  >
                    <span>{option.label}</span>
                    <small>{option.helper}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="pickerGroup">
              <div className="pickerTitleRow">
                <strong>{"الفترة / Period"}</strong>
                <span>
                  {isAllTimeMode(mode)
                    ? reportsOnlyIsEnglish
                      ? "All-time report"
                      : "كل الفترات لهذا التقرير / All-time Report"
                    : reportsOnlyIsEnglish
                      ? "Quick select"
                      : "اختر بسرعة / Quick Select"}
                </span>
              </div>

              {isAllTimeMode(mode) ? (
                <div className="allTimeMobileNotice">
                  {reportsOnlyIsEnglish
                    ? "This report is not tied to one day. It shows all outstanding balances."
                    : "هذا التقرير غير مرتبط بيوم معين ويعرض كل المبالغ المستحقة. / This report is not tied to one day. It shows all outstanding balances."}
                </div>
              ) : (
                <div className="mobileRangeGrid">
                  {reportsOnlyRangeButtons.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={
                        rangePreset === option.value
                          ? "mobileRangeButton activeMobileRange"
                          : "mobileRangeButton"
                      }
                      onClick={() => handleRangeChange(option.value)}
                    >
                      <span>{option.label}</span>
                      <small>{option.helper}</small>
                    </button>
                  ))}
                </div>
              )}

              {rangePreset === "custom" && !isAllTimeMode(mode) && (
                <div className="reportsOnlyCustomDates">
                  <div>
                    <label htmlFor="mobile-start-date">
                      {"من تاريخ / Start Date"}
                    </label>
                    <input
                      id="mobile-start-date"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile-end-date">
                      {"إلى تاريخ / End Date"}
                    </label>
                    <input
                      id="mobile-end-date"
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="reportsOnlyRefreshButton"
              onClick={() => void loadReports()}
              disabled={!supabase || loading}
            >
              {loading
                ? reportsOnlyIsEnglish
                  ? "Updating report..."
                  : "جاري تحديث التقرير... / Updating Report..."
                : reportsOnlyIsEnglish
                  ? "Update Report"
                  : "تحديث التقرير / Update Report"}
            </button>
          </div>
        )}

        <div className="dateControls">
          <div>
            <label htmlFor="range-preset">فترة التقرير / Report Period</label>
            <select
              id="range-preset"
              value={rangePreset}
              onChange={(event) => handleRangeChange(event.target.value as ReportRange)}
              disabled={isAllTimeMode(mode)}
            >
              <option value="today">اليوم / Today</option>
              <option value="yesterday">أمس / Yesterday</option>
              <option value="this_week">هذا الأسبوع / This Week</option>
              <option value="this_month">هذا الشهر / This Month</option>
              <option value="last_month">الشهر الماضي / Last Month</option>
              <option value="year_to_date">من بداية السنة / Year to Date</option>
              <option value="custom">تخصيص / Custom</option>
            </select>
          </div>

          {rangePreset === "custom" && !isAllTimeMode(mode) ? (
            <>
              <div>
                <label htmlFor="start-date">من تاريخ / Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="end-date">إلى تاريخ / End Date</label>
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
              <label>الفترة المحددة / Selected Period</label>
              <strong>{isAllTimeMode(mode) ? "كل الفترات / All Time" : selectedRangeText}</strong>
            </div>
          )}

          <button
            type="button"
            className="primaryButton"
            onClick={() => void loadReports()}
            disabled={!supabase || loading}
          >
            {loading ? "جاري التحميل... / Loading..." : "تحديث التقرير / Update Report"}
          </button>
        </div>

        <div className="modeTabs">
          <button
            type="button"
            className={
              mode === "profitLoss"
                ? "tabButton activeTab profitLossTab"
                : "tabButton profitLossTab"
            }
            onClick={() => setMode("profitLoss")}
          >
            الربح والخسارة
          </button>
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
          <button
            type="button"
            className={mode === "credit" ? "tabButton activeTab creditTab" : "tabButton creditTab"}
            onClick={() => setMode("credit")}
          >
            المبالغ المستحقة على الزبائن
          </button>
          <button
            type="button"
            className={
              mode === "expenses" ? "tabButton activeTab expenseTab" : "tabButton expenseTab"
            }
            onClick={() => setMode("expenses")}
          >
            المصروفات
          </button>
          <button
            type="button"
            className={
              mode === "vendorCredit"
                ? "tabButton activeTab vendorCreditTab"
                : "tabButton vendorCreditTab"
            }
            onClick={() => setMode("vendorCredit")}
          >
            ائتمان الموردين
          </button>
          <button
            type="button"
            className={
              mode === "dailyCount"
                ? "tabButton activeTab dailyCountTab"
                : "tabButton dailyCountTab"
            }
            onClick={() => setMode("dailyCount")}
          >
            عد الصندوق اليومي
          </button>
        </div>
      </section>

      {error && <div className="errorBox noPrint">{error}</div>}
      {actionMessage && <div className="successBox noPrint">{actionMessage}</div>}

      <section className="reportSheet">
        <div className="printHeader">
          <div>
            <p className="eyebrow">PartPOS</p>
            <h2>
              {isReportsOnlyAccess
                ? reportTitleByLanguage(mode, reportsOnlyLanguage)
                : reportTitle(mode)}
            </h2>
            <p>
              {isAllTimeMode(mode)
                ? isReportsOnlyAccess && reportsOnlyIsEnglish
                  ? "All time"
                  : "كل الفترات / All Time"
                : isReportsOnlyAccess
                  ? formatDateRangeByLanguage(startDate, endDate, reportsOnlyLanguage)
                  : formatArabicDateRange(startDate, endDate)}
            </p>
          </div>

          <div className="reportMeta">
            <span>
              {mode === "credit"
                ? "عدد الزبائن / Customers"
                : mode === "vendorCredit"
                  ? "عدد الموردين / Suppliers"
                  : mode === "expenses"
                    ? "عدد المصروفات / Expenses"
                    : mode === "dailyCount"
                      ? "عدد الأيام / Days"
                      : mode === "profitLoss"
                        ? "نتيجة الفترة / Period Result"
                        : "عدد الفواتير / Receipts"}
            </span>
            <strong>{mode === "department" || mode === "items" ? sales.length : activeRowsCount}</strong>
            <small>{lastUpdated ? `آخر تحديث / Last updated: ${lastUpdated}` : ""}</small>
          </div>
        </div>

        {mode === "department" || mode === "items" ? (
          <div className="summaryGrid">
            <StatBox label="عدد السطور / Lines" value={activeRowsCount} />
            <StatBox label="إجمالي الكمية / Total Quantity" value={money(totalQuantity)} />
            <StatBox label="إجمالي التكلفة / Total Cost" value={`${money(totalCost)} د.أ`} />
            <StatBox label="إجمالي البيع / Total Sales" value={`${money(totalSales)} د.أ`} tone="red" />
            <StatBox label="إجمالي الربح / Total Profit" value={`${money(totalProfit)} د.أ`} tone="green" />
            <StatBox label="هامش الربح / Profit Margin" value={percent(totalMarginPercent)} />
            {mode === "department" ? (
              <StatBox
                label="VOID"
                value={totalVoidedReceiptCount}
                tone="orange"
                small={`${money(totalVoidedDepartmentSales)} د.أ غير محسوبة`}
              />
            ) : null}
          </div>
        ) : null}

        {mode === "credit" ? (
          <div className="summaryGrid three">
            <StatBox label="عدد الزبائن الذين عليهم مبالغ / Customers Owing" value={creditCustomerRows.length} />
            <StatBox label="عدد فواتير الائتمان المفتوحة / Open Credit Invoices" value={totalCreditInvoices} />
            <StatBox label="إجمالي المبالغ المستحقة / Total Outstanding" value={`${money(totalCreditOwed)} د.أ`} tone="red" />
          </div>
        ) : null}

        {mode === "expenses" ? (
          <div className="summaryGrid four">
            <StatBox
              label="إجمالي المصروفات المحتسبة / Counted Expenses"
              value={`${money(totalExpenses)} د.أ`}
              tone="red"
              small="نقداً + دفعات ائتمان الموردين / Cash + Supplier Credit Payments"
            />
            <StatBox label="خدمات / مرافق نقداً / Cash Utilities" value={`${money(utilityExpenses)} د.أ`} />
            <StatBox label="موردين نقداً / Cash Supplier Expenses" value={`${money(vendorCashExpenses)} د.أ`} />
            <StatBox
              label="دفعات ائتمان الموردين / Supplier Credit Payments"
              value={`${money(creditExpensePaymentsForPeriod)} د.أ`}
              tone="red"
            />
            <StatBox
              label="مشتريات ائتمان جديدة / New Credit Purchases"
              value={`${money(vendorCreditExpensesForPeriod)} د.أ`}
              tone="orange"
              small="لا تُحسب حتى يتم الدفع / Not counted until paid"
            />
            <StatBox
              label="VOID"
              value={`${money(totalVoidedExpenses + totalVoidedExpensePayments)} د.أ`}
              tone="orange"
              small="مصروفات ودفعات غير محسوبة / Excluded Expenses & Payments"
            />
          </div>
        ) : null}

        {mode === "vendorCredit" ? (
          <div className="summaryGrid three">
            <StatBox label="عدد الموردين الذين لهم رصيد / Suppliers Owed" value={vendorCreditRows.length} />
            <StatBox label="عدد قيود ائتمان مفتوحة / Open Credit Entries" value={totalVendorCreditEntries} />
            <StatBox label="إجمالي المستحق للموردين / Total Owed to Suppliers" value={`${money(totalVendorCreditOwed)} د.أ`} tone="orange" />
          </div>
        ) : null}

        {mode === "dailyCount" ? (
          <div className="summaryGrid">
            <StatBox label="عدد الأيام المحفوظة / Saved Days" value={dailyCounts.length} />
            <StatBox label="أيام فيها نقص / Short Days" value={shortDayCount} tone="red" />
            <StatBox label="أيام فيها زيادة / Over Days" value={overDayCount} tone="orange" />
            <StatBox label="أيام مطابقة / Matched Days" value={matchedDayCount} tone="green" />
            <StatBox label="إجمالي النقص / Total Short" value={`${money(totalDailyShort)} د.أ`} tone="red" />
            <StatBox label="إجمالي الزيادة / Total Over" value={`${money(totalDailyOver)} د.أ`} tone="orange" />
            <StatBox label="إجمالي مصروفات نقدية / Total Cash Expenses" value={`${money(totalDailyCashExpenses)} د.أ`} tone="red" />
          </div>
        ) : null}

        {mode === "profitLoss" ? (
          <div className="summaryGrid three">
            <StatBox
              label="إجمالي المبيعات / Total Sales"
              value={`${money(profitLossSales)} د.أ`}
              tone="green"
              small="حسب الفترة المختارة / Selected Period"
            />
            <StatBox
              label="إجمالي المصروفات / Total Expenses"
              value={`${money(profitLossExpenses)} د.أ`}
              tone="red"
              small="نقداً + دفعات ائتمان الموردين / Cash + Supplier Credit Payments"
            />
            <StatBox
              label={profitLossLabel}
              value={`${money(Math.abs(profitLossNet))} د.أ`}
              tone={profitLossNet >= 0 ? "green" : "red"}
              small="المبيعات - المصروفات / Sales - Expenses"
            />
          </div>
        ) : null}

        <section className="recordsSection">
          {mode === "department" ? (
            departmentRows.length === 0 ? (
              <div className="emptyState">لا يوجد مبيعات ضمن الفترة المحددة. / No sales in the selected period.</div>
            ) : (
              <div className="recordList">
                {departmentRows.map((row) => {
                  const expanded = Boolean(expandedDepartments[row.department]);
                  const details = departmentDetailsByDepartment[row.department] ?? {
                    active: [],
                    voided: [],
                  };

                  return (
                    <article
                      className={
                        expanded
                          ? "recordCard departmentRecord expandedDepartmentRecord"
                          : "recordCard departmentRecord"
                      }
                      key={row.department}
                    >
                      <button
                        type="button"
                        className="departmentToggleButton"
                        onClick={() => toggleDepartment(row.department)}
                      >
                        <div className="recordMain">
                          <p>القسم / Department</p>
                          <h3>{row.department}</h3>
                          <span className="expandHint">
                            {expanded
                              ? reportsOnlyIsEnglish
                                ? "Hide details"
                                : "إخفاء التفاصيل / Hide Details"
                              : reportsOnlyIsEnglish
                                ? "Tap to view items and VOID receipts"
                                : "اضغط لعرض القطع والفواتير الملغاة / Tap to show items and VOID receipts"}
                          </span>
                        </div>

                        <div className="detailGrid">
                          <DetailCell label="عدد الفواتير / Receipts" value={row.receiptCount} />
                          <DetailCell label="عدد السطور / Lines" value={row.itemLines} />
                          <DetailCell label="الكمية / Quantity" value={money(row.quantity)} />
                          <DetailCell label="إجمالي التكلفة / Total Cost" value={`${money(row.totalCost)} د.أ`} />
                          <DetailCell label="إجمالي البيع / Total Sales" value={`${money(row.totalSales)} د.أ`} tone="red" />
                          <DetailCell label="الربح / Profit" value={`${money(row.profit)} د.أ`} tone={row.profit >= 0 ? "green" : "red"} />
                          <DetailCell label="الهامش / Margin" value={percent(row.marginPercent)} />
                          <DetailCell
                            label="VOID داخل القسم / VOID in Department"
                            value={row.voidReceiptCount}
                            tone={row.voidReceiptCount > 0 ? "orange" : undefined}
                          />
                        </div>
                      </button>

                      {expanded ? (
                        <div className="departmentExpandPanel">
                          <div className="departmentDetailSection">
                            <div className="departmentDetailHeader">
                              <h4>{reportsOnlyIsEnglish ? "Items sold in this department" : "القطع المباعة في هذا القسم / Items Sold in this Department"}</h4>
                              <span>{reportsOnlyIsEnglish ? `${details.active.length} items` : `${details.active.length} قطع / items`}</span>
                            </div>

                            {details.active.length === 0 ? (
                              <div className="emptyState smallEmptyState">
                                {reportsOnlyIsEnglish
                                  ? "No active sold items in this department."
                                  : "لا يوجد قطع مباعة غير ملغاة في هذا القسم. / No active sold items in this department."}
                              </div>
                            ) : (
                              <div className="departmentItemList">
                                {details.active.map((item) => (
                                  <div className="departmentItemRow" key={item.productName}>
                                    <div>
                                      <strong>{item.productName}</strong>
                                      <span>
                                        {item.receiptCount} فواتير / receipts • كمية / Qty {money(item.quantity)}
                                      </span>
                                    </div>
                                    <div className="departmentItemNumbers">
                                      <strong>{money(item.totalSales)} د.أ</strong>
                                      <span>
                                        ربح / Profit {money(item.profit)} د.أ • هامش / Margin {percent(item.marginPercent)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="departmentDetailSection voidDetailSection">
                            <div className="departmentDetailHeader">
                              <h4>{reportsOnlyIsEnglish ? "VOID receipts in this department" : "الفواتير الملغاة في هذا القسم / VOID Receipts in this Department"}</h4>
                              <span>{reportsOnlyIsEnglish ? `${details.voided.length} void lines` : `${details.voided.length} سطور ملغاة / void lines`}</span>
                            </div>

                            {details.voided.length === 0 ? (
                              <div className="emptyState smallEmptyState">
                                {reportsOnlyIsEnglish
                                  ? "No VOID receipts in this department for the selected period."
                                  : "لا يوجد VOID داخل هذا القسم ضمن الفترة المختارة. / No VOID receipts in this department for the selected period."}
                              </div>
                            ) : (
                              <div className="departmentItemList">
                                {details.voided.map((voidItem) => (
                                  <div className="departmentItemRow voidItemRow" key={voidItem.id}>
                                    <div>
                                      <strong>{voidItem.productName}</strong>
                                      <span>
                                        فاتورة {voidItem.saleNumber ?? "—"} •{" "}
                                        {formatArabicDateTime(voidItem.createdAt)} •{" "}
                                        {voidItem.paymentMethod === "credit" ? "ائتمان / Credit" : "نقداً / Cash"}
                                      </span>
                                    </div>
                                    <div className="departmentItemNumbers">
                                      <strong>{money(voidItem.lineTotal)} د.أ</strong>
                                      <span>
                                        كمية {money(voidItem.quantity)} • سعر {money(voidItem.salePrice)} د.أ
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )
          ) : null}

          {mode === "items" ? (
            itemRows.length === 0 ? (
              <div className="emptyState">لا يوجد مبيعات ضمن الفترة المحددة. / No sales in the selected period.</div>
            ) : (
              <div className="recordList">
                {itemRows.map((row) => (
                  <article className="recordCard" key={`${row.productName}-${row.department}`}>
                    <div className="recordMain">
                      <p>{row.department}</p>
                      <h3>{row.productName}</h3>
                    </div>
                    <div className="detailGrid">
                      <DetailCell label="عدد الفواتير / Receipts" value={row.receiptCount} />
                      <DetailCell label="الكمية / Quantity" value={money(row.quantity)} />
                      <DetailCell label="متوسط سعر البيع / Average Sale Price" value={`${money(row.averageSalePrice)} د.أ`} />
                      <DetailCell label="إجمالي التكلفة / Total Cost" value={`${money(row.totalCost)} د.أ`} />
                      <DetailCell label="إجمالي البيع / Total Sales" value={`${money(row.totalSales)} د.أ`} tone="red" />
                      <DetailCell label="الربح / Profit" value={`${money(row.profit)} د.أ`} tone={row.profit >= 0 ? "green" : "red"} />
                      <DetailCell label="الهامش / Margin" value={percent(row.marginPercent)} />
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : null}

          {mode === "credit" ? (
            creditCustomerRows.length === 0 ? (
              <div className="emptyState">لا يوجد زبائن عليهم مبالغ ائتمان حالياً. / No customers currently owe credit balances.</div>
            ) : (
              <div className="recordList">
                {creditCustomerRows.map((row) => (
                  <article className="recordCard" key={row.customerKey}>
                    <div className="recordMain">
                      <p>{row.customerPhone || "بدون رقم / No Number"}</p>
                      <h3>{row.customerName}</h3>
                    </div>
                    <div className="detailGrid">
                      <DetailCell label="عدد الفواتير / Receipts" value={row.invoiceCount} />
                      <DetailCell label="المبلغ المستحق / Amount Owed" value={`${money(row.amountOwed)} د.أ`} tone="red" />
                      <DetailCell label="سقف الائتمان / Credit Limit" value={`${money(row.creditAllowance)} د.أ`} />
                      <DetailCell label="مستحق منذ / Outstanding Since" value={formatArabicDateTime(row.outstandingSince)} />
                      <DetailCell label="مدة الاستحقاق / Days Outstanding" value={`${daysOutstanding(row.outstandingSince)} يوم / days`} />
                      <DetailCell label="أول فاتورة / Oldest Receipt" value={row.oldestSaleNumber ? `فاتورة / Receipt ${row.oldestSaleNumber}` : "—"} />
                      <DetailCell label="آخر فاتورة / Newest Receipt" value={row.newestSaleNumber ? `فاتورة / Receipt ${row.newestSaleNumber}` : "—"} />
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : null}

          {mode === "expenses" ? (
            expenses.length === 0 && voidedExpenses.length === 0 ? (
              <div className="emptyState">لا يوجد مصروفات ضمن الفترة المحددة. / No expenses in the selected period.</div>
            ) : (
              <div className="recordList">
                {expenses.map((row) => (
                  <article className="recordCard" key={row.id}>
                    <div className="recordMain">
                      <p>{row.expense_number ? `قيد / Entry ${row.expense_number}` : "قيد بدون رقم / Entry Without Number"}</p>
                      <h3>
                        {row.expense_type === "vendor"
                          ? row.company_name || "مورد غير محدد / Unspecified Supplier"
                          : row.details || "مصروف بدون تفاصيل / Expense Without Details"}
                      </h3>
                    </div>
                    <div className="detailGrid">
                      <DetailCell label="النوع / Type" value={row.expense_type === "vendor" ? "دفع مورد / Supplier Payment" : "خدمات / مرافق / Utilities"} />
                      <DetailCell label="طريقة الدفع / Payment Method" value={row.paid_by === "credit" ? "على الائتمان / Credit" : "نقداً / Cash"} />
                      <DetailCell label="المبلغ / Amount" value={`${money(row.amount)} د.أ`} tone={row.paid_by === "credit" ? "orange" : "red"} />
                      <DetailCell
                        label="المحتسب على الربح / Counted in Profit"
                        value={row.paid_by === "credit" ? "0.00 د.أ حتى الدفع / 0.00 JOD until paid" : `${money(row.amount)} د.أ`}
                        tone={row.paid_by === "credit" ? "orange" : "red"}
                      />
                      <DetailCell label="التاريخ / Date" value={formatArabicDateTime(row.created_at)} />
                    </div>
                    {!isReportsOnlyAccess && (
                      <div className="expenseActions noPrint">
                        <button
                          type="button"
                          className="voidExpenseButton"
                          onClick={() => openVoidExpenseConfirm(row)}
                          disabled={voidingExpenseId === row.id}
                        >
                          {voidingExpenseId === row.id ? "جاري الإلغاء... / Voiding..." : "إلغاء المصروف / VOID Expense"}
                        </button>
                      </div>
                    )}
                  </article>
                ))}

                {expensePayments.length > 0 && (
                  <div className="expensePaymentsBlock">
                    <div className="expensePaymentsHeader">
                      <strong>دفعات على مصروفات ائتمان الموردين / Supplier Credit Expense Payments</strong>
                      <span>{expensePayments.length} دفعات • {money(creditExpensePaymentsForPeriod)} د.أ محسوبة</span>
                    </div>
                    {expensePayments.map((payment) => (
                      <article className="recordCard expensePaymentCard" key={payment.id}>
                        <div className="recordMain">
                          <p>{payment.payment_number ? `دفعة / Payment ${payment.payment_number}` : "دفعة بدون رقم / Payment Without Number"}</p>
                          <h3>{payment.company_name || payment.details || "مورد غير محدد / Unspecified Supplier"}</h3>
                        </div>
                        <div className="detailGrid">
                          <DetailCell label="على قيد / Applied to Entry" value={payment.expense_number ? `قيد / Entry ${payment.expense_number}` : "—"} />
                          <DetailCell label="طريقة الدفع / Payment Method" value={payment.paid_by === "cash" ? "نقداً / Cash" : "من الحساب / البنك / Account / Bank"} />
                          <DetailCell label="المبلغ المحتسب / Counted Amount" value={`${money(payment.amount)} د.أ`} tone="red" />
                          <DetailCell label="التاريخ / Date" value={formatArabicDateTime(payment.created_at)} />
                        </div>
                        {!isReportsOnlyAccess && (
                          <div className="expenseActions noPrint">
                            <button
                              type="button"
                              className="voidExpenseButton"
                              onClick={() => openVoidExpensePaymentConfirm(payment)}
                              disabled={voidingExpensePaymentId === payment.id}
                            >
                              {voidingExpensePaymentId === payment.id ? "جاري الإلغاء... / Voiding..." : "إلغاء الدفعة / VOID Payment"}
                            </button>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                {voidedExpensePayments.length > 0 && (
                  <div className="voidedExpensesBlock">
                    <div className="voidedExpensesHeader">
                      <strong>دفعات مصروفات ملغاة / VOID Expense Payments</strong>
                      <span>{voidedExpensePayments.length} دفعات • {money(totalVoidedExpensePayments)} د.أ غير محسوبة</span>
                    </div>
                    {voidedExpensePayments.map((payment) => (
                      <article className="recordCard voidedExpenseCard" key={payment.id}>
                        <div className="recordMain">
                          <p>{payment.payment_number ? `دفعة / Payment ${payment.payment_number}` : "دفعة بدون رقم / Payment Without Number"}</p>
                          <h3>{payment.company_name || payment.details || "مورد غير محدد / Unspecified Supplier"}</h3>
                          <span className="voidBadge">VOID / ملغاة</span>
                        </div>
                        <div className="detailGrid">
                          <DetailCell label="على قيد / Applied to Entry" value={payment.expense_number ? `قيد / Entry ${payment.expense_number}` : "—"} />
                          <DetailCell label="طريقة الدفع / Payment Method" value={payment.paid_by === "cash" ? "نقداً / Cash" : "من الحساب / البنك / Account / Bank"} />
                          <DetailCell label="المبلغ الملغى / Voided Amount" value={`${money(payment.amount)} د.أ`} tone="orange" />
                          <DetailCell label="تاريخ الدفع / Payment Date" value={formatArabicDateTime(payment.created_at)} />
                          <DetailCell label="تاريخ الإلغاء / Void Date" value={payment.voided_at ? formatArabicDateTime(payment.voided_at) : "—"} />
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {voidedExpenses.length > 0 && (
                  <div className="voidedExpensesBlock">
                    <div className="voidedExpensesHeader">
                      <strong>مصروفات ملغاة / VOID Expenses</strong>
                      <span>{voidedExpenses.length} قيود • {money(totalVoidedExpenses)} د.أ غير محسوبة</span>
                    </div>
                    {voidedExpenses.map((row) => (
                      <article className="recordCard voidedExpenseCard" key={row.id}>
                        <div className="recordMain">
                          <p>{row.expense_number ? `قيد / Entry ${row.expense_number}` : "قيد بدون رقم / Entry Without Number"}</p>
                          <h3>
                            {row.expense_type === "vendor"
                              ? row.company_name || "مورد غير محدد / Unspecified Supplier"
                              : row.details || "مصروف بدون تفاصيل / Expense Without Details"}
                          </h3>
                          <span className="voidBadge">VOID / ملغى</span>
                        </div>
                        <div className="detailGrid">
                          <DetailCell label="النوع / Type" value={row.expense_type === "vendor" ? "دفع مورد / Supplier Payment" : "خدمات / مرافق / Utilities"} />
                          <DetailCell label="طريقة الدفع / Payment Method" value={row.paid_by === "credit" ? "على الائتمان / Credit" : "نقداً / Cash"} />
                          <DetailCell label="المبلغ الملغى / Voided Amount" value={`${money(row.amount)} د.أ`} tone="orange" />
                          <DetailCell label="تاريخ الإدخال / Entry Date" value={formatArabicDateTime(row.created_at)} />
                          <DetailCell label="تاريخ الإلغاء / Void Date" value={row.voided_at ? formatArabicDateTime(row.voided_at) : "—"} />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : null}

          {mode === "vendorCredit" ? (
            vendorCreditExpenseBalanceRows.length === 0 ? (
              <div className="emptyState">لا يوجد مبالغ ائتمان مستحقة للموردين حالياً. / No supplier credit balances currently outstanding.</div>
            ) : (
              <div className="recordList">
                {vendorCreditExpenseBalanceRows.map((row) => {
                  const expense = row.expense;

                  return (
                    <article className="recordCard vendorCreditExpenseCard" key={expense.id}>
                      <div className="recordMain">
                        <p>{expense.expense_number ? `قيد / Entry ${expense.expense_number}` : "قيد ائتمان / Credit Entry"}</p>
                        <h3>{expense.company_name || "مورد غير محدد / Unspecified Supplier"}</h3>
                        {row.paymentEverCount > 0 ? (
                          <span className="paymentHistoryBadge">يوجد دفعات — لا يمكن إلغاء القيد / Payments exist — cannot void entry</span>
                        ) : (
                          <span className="payableBadge">لم يتم الدفع بعد / Not Paid Yet</span>
                        )}
                      </div>
                      <div className="detailGrid">
                        <DetailCell label="قيمة الشراء على الائتمان / Credit Purchase Amount" value={`${money(expense.amount)} د.أ`} tone="orange" />
                        <DetailCell label="المدفوع / Paid" value={`${money(row.paidAmount)} د.أ`} tone={row.paidAmount > 0 ? "green" : "plain"} />
                        <DetailCell label="المتبقي / Remaining" value={`${money(row.remainingAmount)} د.أ`} tone="red" />
                        <DetailCell label="عدد الدفعات / Payment Count" value={row.activePaymentCount} />
                        <DetailCell label="تاريخ القيد / Entry Date" value={formatArabicDateTime(expense.created_at)} />
                        <DetailCell label="الوصف / Description" value={expense.details || "—"} />
                      </div>

                      <div className="expenseActions noPrint vendorCreditActions">
                        <button
                          type="button"
                          className="payExpenseButton"
                          onClick={() => openPayExpensePopup(expense)}
                          disabled={payingExpenseId === expense.id || row.remainingAmount <= 0}
                        >
                          {payingExpenseId === expense.id ? "جاري الدفع... / Paying..." : "دفع على القيد / PAY Entry"}
                        </button>

                        {!isReportsOnlyAccess ? (
                          <button
                            type="button"
                            className="voidExpenseButton"
                            onClick={() => openVoidExpenseConfirm(expense)}
                            disabled={voidingExpenseId === expense.id || row.paymentEverCount > 0}
                            title={
                              row.paymentEverCount > 0
                                ? "لا يمكن الإلغاء لأن هناك دفعات سابقة على هذا القيد / Cannot void because this entry has previous payments"
                                : "إلغاء القيد / Void Entry"
                            }
                          >
                            {voidingExpenseId === expense.id ? "جاري الإلغاء... / Voiding..." : "إلغاء القيد / VOID Entry"}
                          </button>
                        ) : null}
                      </div>

                      {row.payments.length > 0 && (
                        <div className="paymentHistoryList">
                          <div className="paymentHistoryTitle">سجل الدفعات / Payment History</div>
                          {row.payments.map((payment) => (
                            <div
                              className={
                                payment.status === "voided"
                                  ? "paymentHistoryRow voidedPaymentHistoryRow"
                                  : "paymentHistoryRow"
                              }
                              key={payment.id}
                            >
                              <div>
                                <strong>
                                  {payment.payment_number ? `دفعة / Payment ${payment.payment_number}` : "دفعة / Payment"}
                                  {payment.status === "voided" ? " • VOID" : ""}
                                </strong>
                                <span>
                                  {formatArabicDateTime(payment.created_at)} • {payment.paid_by === "cash" ? "نقداً / Cash" : "من الحساب / البنك / Account / Bank"}
                                </span>
                              </div>
                              <div className="paymentHistoryAmount">
                                <strong>{money(payment.amount)} د.أ</strong>
                                {!isReportsOnlyAccess && payment.status !== "voided" && (
                                  <button
                                    type="button"
                                    className="smallVoidButton noPrint"
                                    onClick={() => openVoidExpensePaymentConfirm(payment)}
                                  >
                                    VOID
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )
          ) : null}

          {mode === "dailyCount" ? (
            dailyCounts.length === 0 ? (
              <div className="emptyState">لا يوجد عد صندوق محفوظ ضمن الفترة المحددة. / No saved cash counts in the selected period.</div>
            ) : (
              <div className="recordList">
                {dailyCounts.map((row) => (
                  <article className="recordCard" key={row.id || row.report_date}>
                    <div className="recordMain">
                      <p>{formatArabicDate(row.report_date)}</p>
                      <h3
                        className={
                          row.status === "matched"
                            ? "greenText"
                            : row.status === "short"
                              ? "redText"
                              : "orangeText"
                        }
                      >
                        {dailyCountStatusLabel(row.status)}
                      </h3>
                    </div>
                    <div className="detailGrid">
                      <DetailCell label="المتوقع / Expected" value={`${money(row.expected_cash)} د.أ`} />
                      <DetailCell label="الموجود فعلياً / Actual" value={`${money(row.actual_cash)} د.أ`} />
                      <DetailCell
                        label="الفرق / Difference"
                        value={`${money(Math.abs(row.difference))} د.أ`}
                        tone={
                          row.status === "matched"
                            ? "green"
                            : row.status === "short"
                              ? "red"
                              : "orange"
                        }
                      />
                      <DetailCell label="مبيعات نقدية / Cash Sales" value={`${money(row.cash_sales)} د.أ`} />
                      <DetailCell label="مبيعات ائتمان / Credit Sales" value={`${money(row.credit_sales)} د.أ`} />
                      <DetailCell label="تحصيل ائتمان / Credit Collections" value={`${money(row.credit_account_payments)} د.أ`} />
                      <DetailCell label="مصروفات نقدية / Cash Expenses" value={`${money(row.cash_expenses)} د.أ`} tone="red" />
                      <DetailCell label="الإيداع / Deposit" value={`${money(row.deposit_amount)} د.أ`} />
                      <DetailCell label="آخر تحديث / Last Update" value={formatArabicDateTime(row.updated_at)} />
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : null}

          {mode === "profitLoss" ? (
            <div className="recordList">
              <article className="recordCard profitLossCard">
                <div className="recordMain">
                  <p>{formatArabicDateRange(startDate, endDate)}</p>
                  <h3 className={profitLossNet >= 0 ? "greenText" : "redText"}>
                    {profitLossLabel}: {money(Math.abs(profitLossNet))} د.أ
                  </h3>
                </div>
                <div className="detailGrid">
                  <DetailCell
                    label="إجمالي المبيعات / Total Sales"
                    value={`${money(profitLossSales)} د.أ`}
                    tone="green"
                  />
                  <DetailCell
                    label="إجمالي المصروفات / Total Expenses"
                    value={`${money(profitLossExpenses)} د.أ`}
                    tone="red"
                  />
                  <DetailCell
                    label="المعادلة / Formula"
                    value="المبيعات - المصروفات / Sales - Expenses"
                  />
                  <DetailCell
                    label="النتيجة / Result"
                    value={`${money(profitLossSales)} - ${money(profitLossExpenses)} = ${money(profitLossNet)} د.أ`}
                    tone={profitLossNet >= 0 ? "green" : "red"}
                  />
                  <DetailCell label="عدد الفواتير / Receipts" value={sales.length} />
                  <DetailCell label="عدد المصروفات / Expenses" value={expenses.length} />
                </div>
              </article>
            </div>
          ) : null}
        </section>

        <div className="bottomTotals">
          {mode === "department" || mode === "items" ? (
            <>
              <div>
                <span>إجمالي التكلفة / Total Cost</span>
                <strong>{money(totalCost)} د.أ</strong>
              </div>
              <div>
                <span>إجمالي البيع / Total Sales</span>
                <strong className="redText">{money(totalSales)} د.أ</strong>
              </div>
              <div>
                <span>إجمالي الربح / الهامش / Total Profit / Margin</span>
                <strong className={totalProfit >= 0 ? "greenText" : "redText"}>
                  {money(totalProfit)} د.أ • {percent(totalMarginPercent)}
                </strong>
              </div>
            </>
          ) : null}

          {mode === "credit" ? (
            <>
              <div>
                <span>إجمالي الزبائن عليهم مبالغ / Customers Owing</span>
                <strong>{creditCustomerRows.length}</strong>
              </div>
              <div>
                <span>إجمالي فواتير الائتمان المفتوحة / Open Credit Invoices</span>
                <strong>{totalCreditInvoices}</strong>
              </div>
              <div>
                <span>إجمالي المبالغ المستحقة / Total Outstanding</span>
                <strong className="redText">{money(totalCreditOwed)} د.أ</strong>
              </div>
            </>
          ) : null}

          {mode === "expenses" ? (
            <>
              <div>
                <span>إجمالي المصروفات / Total Expenses</span>
                <strong className="redText">{money(totalExpenses)} د.أ</strong>
              </div>
              <div>
                <span>مصروفات نقدية / Cash Expenses</span>
                <strong>{money(utilityExpenses + vendorCashExpenses)} د.أ</strong>
              </div>
              <div>
                <span>مصروفات على الائتمان / Credit Expenses</span>
                <strong className="orangeText">{money(vendorCreditExpensesForPeriod)} د.أ</strong>
              </div>
            </>
          ) : null}

          {mode === "vendorCredit" ? (
            <>
              <div>
                <span>إجمالي الموردين لهم رصيد / Suppliers Owed</span>
                <strong>{vendorCreditRows.length}</strong>
              </div>
              <div>
                <span>إجمالي قيود ائتمان الموردين / Supplier Credit Entries</span>
                <strong>{totalVendorCreditEntries}</strong>
              </div>
              <div>
                <span>إجمالي المستحق للموردين / Total Owed to Suppliers</span>
                <strong className="orangeText">{money(totalVendorCreditOwed)} د.أ</strong>
              </div>
            </>
          ) : null}

          {mode === "dailyCount" ? (
            <>
              <div>
                <span>عدد الأيام المحفوظة / Saved Days</span>
                <strong>{dailyCounts.length}</strong>
              </div>
              <div>
                <span>إجمالي النقص / Total Short</span>
                <strong className="redText">{money(totalDailyShort)} د.أ</strong>
              </div>
              <div>
                <span>إجمالي الزيادة / Total Over</span>
                <strong className="orangeText">{money(totalDailyOver)} د.أ</strong>
              </div>
            </>
          ) : null}

          {mode === "profitLoss" ? (
            <>
              <div>
                <span>إجمالي المبيعات / Total Sales</span>
                <strong className="greenText">{money(profitLossSales)} د.أ</strong>
              </div>
              <div>
                <span>إجمالي المصروفات / Total Expenses</span>
                <strong className="redText">{money(profitLossExpenses)} د.أ</strong>
              </div>
              <div>
                <span>{profitLossLabel}</span>
                <strong className={profitLossNet >= 0 ? "greenText" : "redText"}>
                  {money(Math.abs(profitLossNet))} د.أ
                </strong>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {payExpense && (
        <div className="popupBackdrop noPrint" role="dialog" aria-modal="true">
          <div className="voidConfirmCard">
            <p className="eyebrow">دفع مورد / Supplier Payment</p>
            <h2>{payExpense.company_name || "مورد غير محدد / Unspecified Supplier"}</h2>
            <p className="selectedSupplierLine">
              قيد رقم {payExpense.expense_number ?? "—"} • المتبقي{" "}
              {money(creditExpenseBalance(payExpense).remainingAmount)} د.أ
            </p>
            <p className="voidConfirmText">
              هذه الدفعة ستُحسب كمصروف في تاريخ الدفع. إذا كانت نقداً، ستخصم من صندوق نهاية اليوم.
            </p>

            <label htmlFor="pay-expense-amount">مبلغ الدفعة / Payment Amount</label>
            <input
              id="pay-expense-amount"
              value={payExpenseAmount}
              onChange={(event) => setPayExpenseAmount(event.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              inputMode="decimal"
              autoFocus
            />

            <label htmlFor="pay-expense-method">طريقة الدفع / Payment Method</label>
            <select
              id="pay-expense-method"
              value={payExpensePaidBy}
              onChange={(event) =>
                setPayExpensePaidBy(event.target.value === "account" ? "account" : "cash")
              }
            >
              <option value="cash">نقداً من الصندوق / Cash from Drawer</option>
              <option value="account">من الحساب / البنك / Account / Bank</option>
            </select>

            <label htmlFor="pay-expense-pin">رمز الدخول / Login PIN</label>
            <input
              id="pay-expense-pin"
              value={payExpensePin}
              onChange={(event) =>
                setPayExpensePin(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="أدخل رمز الدخول / Enter Login PIN"
              inputMode="numeric"
              type="password"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void confirmPayExpense();
                }
              }}
            />

            {payExpenseError && <div className="voidError">{payExpenseError}</div>}

            <div className="voidPopupActions">
              <button
                type="button"
                className="cancelVoidButton"
                onClick={closePayExpensePopup}
                disabled={Boolean(payingExpenseId)}
              >
                رجوع
              </button>
              <button
                type="button"
                className="confirmPayButton"
                onClick={() => void confirmPayExpense()}
                disabled={Boolean(payingExpenseId)}
              >
                {payingExpenseId ? "جاري الحفظ... / Saving..." : "تسجيل الدفعة / Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {voidExpensePayment && (
        <div className="popupBackdrop noPrint" role="dialog" aria-modal="true">
          <div className="voidConfirmCard">
            <p className="eyebrow">تأكيد إلغاء دفعة / Confirm Payment Void</p>
            <h2>إلغاء دفعة رقم / Void Payment No. {voidExpensePayment.payment_number ?? "—"}</h2>
            <p className="voidConfirmText">
              الدفعة ستبقى ظاهرة كـ VOID للمراجعة، لكنها لن تُحسب كمصروف ولن تخصم من صندوق اليوم.
            </p>

            <label htmlFor="void-expense-payment-pin">رمز الدخول / Login PIN</label>
            <input
              id="void-expense-payment-pin"
              value={voidExpensePaymentPin}
              onChange={(event) =>
                setVoidExpensePaymentPin(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="أدخل رمز الدخول / Enter Login PIN"
              inputMode="numeric"
              type="password"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void confirmVoidExpensePayment();
                }
              }}
            />

            {voidExpensePaymentError && <div className="voidError">{voidExpensePaymentError}</div>}

            <div className="voidPopupActions">
              <button
                type="button"
                className="cancelVoidButton"
                onClick={closeVoidExpensePaymentConfirm}
                disabled={Boolean(voidingExpensePaymentId)}
              >
                رجوع
              </button>
              <button
                type="button"
                className="confirmVoidButton"
                onClick={() => void confirmVoidExpensePayment()}
                disabled={Boolean(voidingExpensePaymentId)}
              >
                {voidingExpensePaymentId ? "جاري الإلغاء... / Voiding..." : "تأكيد إلغاء الدفعة / Confirm Payment Void"}
              </button>
            </div>
          </div>
        </div>
      )}

      {voidExpense && (
        <div className="popupBackdrop noPrint" role="dialog" aria-modal="true">
          <div className="voidConfirmCard">
            <p className="eyebrow">تأكيد إلغاء المصروف / Confirm Expense Void</p>
            <h2>إلغاء مصروف رقم / Void Expense No. {voidExpense.expense_number ?? "—"}</h2>
            <p className="voidConfirmText">
              المصروف سيبقى ظاهر كـ VOID للمراجعة، لكنه لن يدخل في المصروفات أو الربح والخسارة أو نهاية اليوم.
            </p>

            <label htmlFor="void-expense-pin">رمز الدخول / Login PIN</label>
            <input
              id="void-expense-pin"
              value={voidExpensePin}
              onChange={(event) =>
                setVoidExpensePin(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="أدخل رمز الدخول / Enter Login PIN"
              inputMode="numeric"
              type="password"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void confirmVoidExpense();
                }
              }}
            />

            {voidExpenseError && <div className="voidError">{voidExpenseError}</div>}

            <div className="voidPopupActions">
              <button
                type="button"
                className="cancelVoidButton"
                onClick={closeVoidExpenseConfirm}
                disabled={Boolean(voidingExpenseId)}
              >
                رجوع
              </button>
              <button
                type="button"
                className="confirmVoidButton"
                onClick={() => void confirmVoidExpense()}
                disabled={Boolean(voidingExpenseId)}
              >
                {voidingExpenseId ? "جاري الإلغاء... / Voiding..." : "تأكيد الإلغاء / Confirm Void"}
              </button>
            </div>
          </div>
        </div>
      )}

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
        .errorBox,
        .successBox {
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

        .subtext {
          margin-bottom: 0;
          color: #4b5563;
        }

        .reportsOnlyBadge {
          width: fit-content;
          margin-top: 12px;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          padding: 8px 12px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 900;
          font-size: 13px;
        }

        .reportsOnlyMode {
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 30%),
            #eef2f7;
        }

        .reportsOnlyMode .controlsCard {
          display: block;
          padding: 18px;
          border-radius: 26px;
        }

        .reportsOnlyMode .dateControls,
        .reportsOnlyMode .modeTabs {
          display: none;
        }

        .reportsOnlyPicker {
          display: grid;
          gap: 18px;
          width: 100%;
        }

        .reportsLanguageSwitch {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 10px;
          background: #f9fafb;
        }

        .reportsLanguageSwitch span {
          padding-inline-start: 6px;
          color: #374151;
          font-weight: 900;
          font-size: 13px;
        }

        .reportsLanguageSwitch div {
          display: inline-flex;
          gap: 6px;
          padding: 4px;
          border-radius: 14px;
          background: #e5e7eb;
        }

        .languageButton {
          border: 0;
          border-radius: 11px;
          padding: 10px 14px;
          background: transparent;
          color: #374151;
          font-weight: 900;
          cursor: pointer;
        }

        .activeLanguageButton {
          background: white;
          color: #111827;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
        }

        .reportsOnlyHero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 18px;
          border-radius: 24px;
          background: linear-gradient(135deg, #111827, #1d4ed8);
          color: white;
          box-shadow: 0 18px 45px rgba(37, 99, 235, 0.18);
        }

        .reportsOnlyHero h2 {
          margin: 0 0 6px;
          font-size: 30px;
          line-height: 1.15;
        }

        .reportsOnlyHero p {
          margin: 0;
          color: rgba(255, 255, 255, 0.82);
          line-height: 1.5;
        }

        .reportsOnlyHero .eyebrow {
          color: rgba(255, 255, 255, 0.68);
        }

        .reportsOnlyHeroStat {
          min-width: 96px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 18px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .reportsOnlyHeroStat span,
        .reportsOnlyMiniStats span,
        .mobileReportButton small,
        .mobileRangeButton small,
        .pickerTitleRow span {
          display: block;
          font-size: 12px;
        }

        .reportsOnlyHeroStat span {
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 6px;
          font-weight: 800;
        }

        .reportsOnlyHeroStat strong {
          font-size: 26px;
        }

        .reportsOnlyMiniStats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .reportsOnlyMiniStats div {
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          background: #f9fafb;
        }

        .reportsOnlyMiniStats span {
          margin-bottom: 6px;
          color: #6b7280;
          font-weight: 800;
        }

        .reportsOnlyMiniStats strong {
          display: block;
          color: #111827;
          font-size: 15px;
          line-height: 1.4;
        }

        .pickerGroup {
          display: grid;
          gap: 10px;
        }

        .pickerTitleRow {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }

        .pickerTitleRow strong {
          font-size: 18px;
        }

        .pickerTitleRow span {
          color: #6b7280;
          font-weight: 800;
        }

        .mobileReportGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .mobileReportButton {
          min-height: 88px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          background: white;
          color: #111827;
          text-align: right;
          white-space: normal;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);
        }

        .mobileReportButton span {
          font-weight: 900;
          font-size: 15px;
          line-height: 1.35;
        }

        .mobileReportButton small {
          color: #6b7280;
          font-weight: 800;
          line-height: 1.35;
        }

        .activeMobileReport {
          background: #eff6ff;
          border-color: #2563eb;
          color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .activeMobileReport small {
          color: #1d4ed8;
        }

        .mobileRangeGrid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 8px;
        }

        .mobileRangeButton {
          min-height: 74px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 10px;
          background: white;
          color: #111827;
          text-align: center;
          white-space: normal;
        }

        .mobileRangeButton span {
          font-weight: 900;
          font-size: 14px;
        }

        .mobileRangeButton small {
          color: #6b7280;
          font-weight: 800;
          line-height: 1.25;
        }

        .activeMobileRange {
          background: #dcfce7;
          border-color: #16a34a;
          color: #166534;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
        }

        .activeMobileRange small {
          color: #166534;
        }

        .allTimeMobileNotice {
          border: 1px solid #fed7aa;
          border-radius: 18px;
          padding: 14px;
          background: #fff7ed;
          color: #9a3412;
          font-weight: 900;
        }

        .reportsOnlyCustomDates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .reportsOnlyCustomDates label {
          display: block;
          margin-bottom: 7px;
          color: #374151;
          font-weight: 900;
          font-size: 13px;
        }

        .reportsOnlyCustomDates input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 14px;
          padding: 14px;
          font-size: 16px;
          background: white;
        }

        .reportsOnlyRefreshButton {
          min-height: 54px;
          border: 0;
          border-radius: 18px;
          background: #111827;
          color: white;
          font-size: 17px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(17, 24, 39, 0.18);
        }

        .reportsOnlyRefreshButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
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

        .creditTab.activeTab {
          background: #7c3aed;
          border-color: #7c3aed;
        }

        .expenseTab.activeTab {
          background: #b91c1c;
          border-color: #b91c1c;
        }

        .vendorCreditTab.activeTab {
          background: #b45309;
          border-color: #b45309;
        }

        .dailyCountTab.activeTab {
          background: #0f766e;
          border-color: #0f766e;
        }

        .profitLossTab {
          background: #dcfce7;
          color: #14532d;
          border-color: #86efac;
        }

        .profitLossTab.activeTab {
          background: #15803d;
          border-color: #15803d;
          color: white;
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

        .successBox {
          padding: 14px 18px;
          background: #dcfce7;
          border-color: #bbf7d0;
          color: #166534;
          font-weight: 900;
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
        .statBox span,
        .bottomTotals span,
        .detailCell span {
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

        .summaryGrid.three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .summaryGrid.four {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .statBox {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px;
          background: #ffffff;
        }

        .statBox strong {
          display: block;
          margin-top: 6px;
          font-size: 22px;
          font-weight: 950;
        }

        .statBox small {
          display: block;
          color: #6b7280;
          margin-top: 4px;
        }

        .redBox {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .greenBox {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .orangeBox {
          background: #fff7ed;
          border-color: #fed7aa;
        }

        .purpleBox {
          background: #f5f3ff;
          border-color: #ddd6fe;
        }

        .redText,
        .redBox strong {
          color: #b91c1c;
        }

        .greenText,
        .greenBox strong {
          color: #15803d;
        }

        .orangeText,
        .orangeBox strong {
          color: #b45309;
        }

        .purpleText,
        .purpleBox strong {
          color: #7c3aed;
        }

        .recordsSection {
          margin-top: 22px;
        }

        .recordList {
          display: grid;
          gap: 12px;
        }

        .recordCard {
          display: grid;
          grid-template-columns: minmax(220px, 1.1fr) minmax(0, 3fr);
          gap: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          background: #ffffff;
        }

        .departmentRecord {
          display: block;
          padding: 0;
          overflow: hidden;
        }

        .departmentToggleButton {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(220px, 1.1fr) minmax(0, 3fr);
          gap: 16px;
          border: 0;
          padding: 16px;
          background: transparent;
          color: inherit;
          text-align: right;
          cursor: pointer;
        }

        .departmentToggleButton:hover {
          background: #f8fafc;
        }

        .expandedDepartmentRecord {
          border-color: #bfdbfe;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .expandHint {
          display: inline-flex;
          margin-top: 10px;
          border-radius: 999px;
          padding: 6px 10px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 900;
          font-size: 12px;
        }

        .departmentExpandPanel {
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          background: #f8fafc;
          display: grid;
          gap: 14px;
        }

        .departmentDetailSection {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: white;
          overflow: hidden;
        }

        .voidDetailSection {
          border-color: #fed7aa;
          background: #fffaf3;
        }

        .departmentDetailHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .departmentDetailHeader h4 {
          margin: 0;
          font-size: 16px;
        }

        .departmentDetailHeader span {
          color: #6b7280;
          font-size: 13px;
          font-weight: 900;
        }

        .departmentItemList {
          display: grid;
        }

        .departmentItemRow {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(180px, 0.8fr);
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .departmentItemRow:last-child {
          border-bottom: 0;
        }

        .departmentItemRow strong {
          display: block;
          margin-bottom: 4px;
          color: #111827;
        }

        .departmentItemRow span {
          color: #6b7280;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.45;
        }

        .departmentItemNumbers {
          text-align: left;
        }

        .departmentItemNumbers strong {
          font-size: 16px;
        }

        .voidItemRow {
          background: #fff7ed;
        }

        .voidItemRow strong {
          color: #9a3412;
        }

        .smallEmptyState {
          margin: 14px;
          padding: 12px;
          font-size: 13px;
        }

        .profitLossCard {
          border-color: #bbf7d0;
          background: #fbfffd;
        }

        .recordMain {
          border-left: 1px solid #e5e7eb;
          padding-left: 14px;
        }

        .recordMain p {
          margin-bottom: 6px;
          color: #6b7280;
          font-size: 13px;
        }

        .recordMain h3 {
          margin-bottom: 0;
          font-size: 20px;
          line-height: 1.35;
        }

        .detailGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .detailCell {
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 14px;
          padding: 10px 12px;
        }

        .detailCell strong {
          display: block;
          margin-top: 4px;
          font-size: 15px;
          line-height: 1.35;
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

          .summaryGrid,
          .summaryGrid.three,
          .summaryGrid.four {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recordCard,
          .departmentToggleButton {
            grid-template-columns: 1fr;
          }

          .departmentItemRow {
            grid-template-columns: 1fr;
          }

          .departmentItemNumbers {
            text-align: right;
          }

          .recordMain {
            border-left: 0;
            border-bottom: 1px solid #e5e7eb;
            padding-left: 0;
            padding-bottom: 12px;
          }

          .detailGrid {
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

          .summaryGrid,
          .summaryGrid.three,
          .summaryGrid.four,
          .detailGrid {
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

        @media (max-width: 900px) {
          .mobileReportGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .mobileRangeGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 540px) {
          .reportsOnlyMode {
            padding: 10px;
          }

          .reportsOnlyMode .topCard {
            border-radius: 22px;
            padding: 18px;
          }

          .reportsOnlyMode .controlsCard {
            padding: 12px;
            border-radius: 22px;
          }

          .reportsOnlyHero {
            flex-direction: column;
            border-radius: 20px;
            padding: 16px;
          }

          .reportsOnlyHero h2 {
            font-size: 25px;
          }

          .reportsOnlyHeroStat {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: right;
          }

          .reportsOnlyMiniStats {
            grid-template-columns: 1fr;
          }

          .pickerTitleRow {
            align-items: flex-start;
            flex-direction: column;
          }

          .mobileReportGrid {
            grid-template-columns: 1fr;
          }

          .mobileReportButton {
            min-height: 74px;
            border-radius: 16px;
          }

          .mobileRangeGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .mobileRangeButton {
            min-height: 68px;
          }

          .reportsOnlyCustomDates {
            grid-template-columns: 1fr;
          }

          .reportsLanguageSwitch {
            align-items: stretch;
            flex-direction: column;
          }

          .reportsLanguageSwitch div {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .topActions {
            width: 100%;
          }

          .topActions button {
            flex: 1;
          }
        }

        .expenseActions {
          border-top: 1px solid #f3f4f6;
          padding: 12px 16px 16px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .vendorCreditActions {
          justify-content: flex-start;
        }

        .payExpenseButton,
        .confirmPayButton {
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 10px 12px;
          background: #dcfce7;
          color: #166534;
          font-weight: 900;
          cursor: pointer;
        }

        .payExpenseButton:disabled,
        .confirmPayButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .voidExpenseButton {
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 10px 12px;
          background: #fee2e2;
          color: #991b1b;
          font-weight: 900;
          cursor: pointer;
        }

        .voidExpenseButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .expensePaymentsBlock {
          display: grid;
          gap: 12px;
          border: 1px solid #bbf7d0;
          border-radius: 18px;
          padding: 14px;
          background: #f0fdf4;
        }

        .expensePaymentsHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #166534;
          font-weight: 900;
        }

        .expensePaymentsHeader span {
          color: #15803d;
          font-size: 13px;
        }

        .expensePaymentCard {
          border-color: #bbf7d0;
          background: #ffffff;
        }

        .vendorCreditExpenseCard {
          border-color: #fed7aa;
        }

        .paymentHistoryBadge,
        .payableBadge {
          display: inline-flex;
          width: fit-content;
          margin-top: 8px;
          border-radius: 999px;
          padding: 6px 9px;
          font-size: 12px;
          font-weight: 900;
        }

        .paymentHistoryBadge {
          background: #fff7ed;
          color: #9a3412;
        }

        .payableBadge {
          background: #f0fdf4;
          color: #166534;
        }

        .paymentHistoryList {
          border-top: 1px solid #f3f4f6;
          padding: 12px 16px 16px;
          display: grid;
          gap: 8px;
        }

        .paymentHistoryTitle {
          color: #374151;
          font-size: 13px;
          font-weight: 900;
        }

        .paymentHistoryRow {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 10px;
          background: #f9fafb;
        }

        .paymentHistoryRow strong,
        .paymentHistoryRow span {
          display: block;
        }

        .paymentHistoryRow span {
          margin-top: 3px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 800;
        }

        .paymentHistoryAmount {
          display: grid;
          justify-items: end;
          gap: 5px;
          white-space: nowrap;
        }

        .voidedPaymentHistoryRow {
          background: #fff7ed;
          color: #9a3412;
        }

        .smallVoidButton {
          border: 1px solid #fecaca;
          border-radius: 9px;
          padding: 5px 8px;
          background: #fee2e2;
          color: #991b1b;
          font-weight: 900;
          cursor: pointer;
        }

        .voidedExpensesBlock {
          display: grid;
          gap: 12px;
          border: 1px solid #fed7aa;
          border-radius: 18px;
          padding: 14px;
          background: #fff7ed;
        }

        .voidedExpensesHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #9a3412;
          font-weight: 900;
        }

        .voidedExpensesHeader span {
          color: #b45309;
          font-size: 13px;
        }

        .voidedExpenseCard {
          border-color: #fed7aa;
          background: #fffbeb;
        }

        .voidBadge {
          display: inline-flex;
          width: fit-content;
          margin-top: 8px;
          border: 1px solid #fed7aa;
          border-radius: 999px;
          padding: 5px 9px;
          background: white;
          color: #9a3412;
          font-size: 12px;
          font-weight: 900;
        }

        .popupBackdrop {
          position: fixed;
          inset: 0;
          z-index: 90;
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

        .voidConfirmCard label {
          display: block;
          margin-bottom: 7px;
          color: #374151;
          font-weight: 900;
        }

        .voidConfirmCard input,
        .voidConfirmCard select {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 14px;
          padding: 14px;
          font-size: 18px;
          outline: none;
        }

        .voidConfirmText {
          color: #4b5563;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .selectedSupplierLine {
          margin: -4px 0 14px;
          border-radius: 12px;
          padding: 10px 12px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 900;
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

          .summaryGrid,
          .summaryGrid.three,
          .summaryGrid.four {
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            margin-top: 8px;
          }

          .statBox {
            padding: 7px;
            border-radius: 8px;
          }

          .statBox strong {
            font-size: 12px;
          }

          .recordsSection {
            margin-top: 8px;
          }

          .recordList {
            gap: 5px;
          }

          .recordCard {
            grid-template-columns: 1fr 3fr;
            gap: 6px;
            padding: 7px;
            border-radius: 8px;
            break-inside: avoid;
          }

          .recordMain h3 {
            font-size: 11px;
          }

          .recordMain p,
          .detailCell span {
            font-size: 7px;
          }

          .detailGrid {
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
          }

          .detailCell {
            padding: 4px;
            border-radius: 6px;
          }

          .detailCell strong {
            font-size: 8px;
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
