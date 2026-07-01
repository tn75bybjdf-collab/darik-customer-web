"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type PartPOSProduct = {
  id: string;
  product_key: string;
  product_name_ar: string;
  department_ar: string;
  cost: number;
  price: number;
};

type PartPOSCustomer = {
  id: string;
  customer_name: string;
  phone_number: string;
  credit_allowance: number;
  credit_pin_code?: string | null;
  credit_pin_required?: boolean;
};

type CustomerCreditInvoice = {
  id: string;
  sale_number: number | null;
  sale_total: number;
  amount_paid: number;
  created_at: string;
};

type CustomerCreditPaymentRecord = {
  id: string;
  payment_number: number | null;
  customer_name: string;
  customer_phone: string;
  amount_paid: number;
  balance_before: number;
  balance_after: number;
  created_at: string;
};

type ExpenseMode = "utility" | "vendor";
type ExpensePaidBy = "cash" | "credit";

type ExpenseForm = {
  details: string;
  company: string;
  amount: string;
  paidBy: ExpensePaidBy;
};

type CustomerForm = {
  customerName: string;
  phoneNumber: string;
  creditAllowance: string;
  customerPin: string;
  customerPinConfirm: string;
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

function cleanPhone(value: string) {
  return value.replace(/[^0-9+]/g, "").trim();
}

function cleanFourDigitPin(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function readSupabaseError(error: unknown) {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const message = record.message ? String(record.message) : "";
    const details = record.details ? String(record.details) : "";
    const hint = record.hint ? String(record.hint) : "";
    const code = record.code ? String(record.code) : "";

    const parts = [message, details, hint, code].filter(Boolean);
    if (parts.length > 0) return parts.join(" | ");

    try {
      return JSON.stringify(record);
    } catch {
      return "حدث خطأ غير معروف من Supabase.";
    }
  }

  return String(error || "حدث خطأ غير معروف.");
}

type CreditInvoiceLookupRow = {
  id?: string | number | null;
  sale_number?: string | number | null;
  sale_total?: string | number | null;
  amount_paid?: string | number | null;
  created_at?: string | null;
};

async function loadCustomerCreditBalanceForClient(
  supabaseClient: ReturnType<typeof createClient<any, "public", any>> | null,
  customerId: string,
): Promise<CustomerCreditInvoice[]> {
  if (!supabaseClient || !customerId) return [];

  const { data, error } = await supabaseClient
    .from("partpos_sales")
    .select("id, sale_number, sale_total, amount_paid, created_at")
    .eq("payment_method", "credit")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true })
    .limit(5000);

  if (error) throw error;

  const rows = (data ?? []) as CreditInvoiceLookupRow[];

  return rows
    .map((invoice) => ({
      id: String(invoice.id ?? ""),
      sale_number:
        invoice.sale_number === null || invoice.sale_number === undefined
          ? null
          : Number(invoice.sale_number),
      sale_total: Number(invoice.sale_total ?? 0),
      amount_paid: Number(invoice.amount_paid ?? 0),
      created_at: String(invoice.created_at ?? ""),
    }))
    .filter(
      (invoice) =>
        Number(invoice.sale_total || 0) - Number(invoice.amount_paid || 0) > 0.0001,
    );
}

function customerLabel(customer: PartPOSCustomer) {
  const name = customer.customer_name?.trim() || "زبون بدون اسم";
  const phone = customer.phone_number?.trim();

  return phone ? `${name} - ${phone}` : name;
}

function emptyCustomerForm(): CustomerForm {
  return {
    customerName: "",
    phoneNumber: "",
    creditAllowance: "",
    customerPin: "",
    customerPinConfirm: "",
  };
}

function emptyExpenseForm(): ExpenseForm {
  return {
    details: "",
    company: "",
    amount: "",
    paidBy: "cash",
  };
}

export default function PartPOSPage() {
  const [rows, setRows] = useState<POSRow[]>([emptyRow(), emptyRow()]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [departmentLoadError, setDepartmentLoadError] = useState("");
  const [customDepartmentRows, setCustomDepartmentRows] = useState<
    Record<string, boolean>
  >({});
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<PartPOSProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<PartPOSCustomer[]>([]);
  const [isCustomerSearching, setIsCustomerSearching] = useState(false);
  const [customerSearchError, setCustomerSearchError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<PartPOSCustomer | null>(null);
  const [isCustomerPopupOpen, setIsCustomerPopupOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState<CustomerForm>(emptyCustomerForm());
  const [customerSaveStatus, setCustomerSaveStatus] = useState<
    "idle" | "saving" | "error"
  >("idle");
  const [customerSaveError, setCustomerSaveError] = useState("");
  const [isCreditPinPopupOpen, setIsCreditPinPopupOpen] = useState(false);
  const [creditPinEntry, setCreditPinEntry] = useState("");
  const [creditPinError, setCreditPinError] = useState("");
  const [creditCashoutStatus, setCreditCashoutStatus] = useState<
    "idle" | "checking" | "saving" | "error"
  >("idle");
  const [customerCreditInvoices, setCustomerCreditInvoices] = useState<
    CustomerCreditInvoice[]
  >([]);
  const [creditBalanceLoading, setCreditBalanceLoading] = useState(false);
  const [isCreditPaymentPopupOpen, setIsCreditPaymentPopupOpen] = useState(false);
  const [creditPaymentAmount, setCreditPaymentAmount] = useState("");
  const [creditPaymentError, setCreditPaymentError] = useState("");
  const [creditPaymentStatus, setCreditPaymentStatus] = useState<
    "idle" | "saving" | "error"
  >("idle");
  const [isExpensePopupOpen, setIsExpensePopupOpen] = useState(false);
  const [expenseMode, setExpenseMode] = useState<ExpenseMode>("utility");
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(emptyExpenseForm());
  const [expenseSaveStatus, setExpenseSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [expenseSaveMessage, setExpenseSaveMessage] = useState("");
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

  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;

    async function loadSavedDepartments() {
      setDepartmentLoadError("");

      const { data, error } = await supabase
        .from("partpos_products")
        .select("department_ar")
        .not("department_ar", "is", null)
        .limit(2000);

      if (!isMounted) return;

      if (error) {
        setDepartmentLoadError(error.message);
        return;
      }

      const uniqueDepartments = new Map<string, string>();

      for (const item of data ?? []) {
        const department = String(item.department_ar ?? "").trim();
        const key = normalizeArabicText(department);

        if (!department || !key || uniqueDepartments.has(key)) continue;
        uniqueDepartments.set(key, department);
      }

      setDepartmentOptions(
        Array.from(uniqueDepartments.values()).sort((a, b) =>
          a.localeCompare(b, "ar"),
        ),
      );
    }

    void loadSavedDepartments();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  function addDepartmentOption(departmentValue: string) {
    const department = departmentValue.trim();
    if (!department) return;

    setDepartmentOptions((current) => {
      const key = normalizeArabicText(department);
      const alreadyExists = current.some(
        (existing) => normalizeArabicText(existing) === key,
      );

      if (alreadyExists) return current;

      return [...current, department].sort((a, b) => a.localeCompare(b, "ar"));
    });
  }

  function departmentExists(departmentValue: string) {
    const key = normalizeArabicText(departmentValue);
    if (!key) return false;

    return departmentOptions.some(
      (department) => normalizeArabicText(department) === key,
    );
  }

  function useCustomDepartmentForRow(lineId: string) {
    setCustomDepartmentRows((current) => ({
      ...current,
      [lineId]: true,
    }));
  }

  function useSavedDepartmentForRow(lineId: string) {
    setCustomDepartmentRows((current) => ({
      ...current,
      [lineId]: false,
    }));
  }

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
  const selectedCustomerCreditBalance = customerCreditInvoices.reduce(
    (sum, invoice) =>
      sum +
      Math.max(Number(invoice.sale_total || 0) - Number(invoice.amount_paid || 0), 0),
    0,
  );
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

    addDepartmentOption(payload.department_ar);

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

  async function loadCustomerCreditBalance(customerId: string) {
    if (!supabase || !customerId) {
      setCustomerCreditInvoices([]);
      return;
    }

    setCreditBalanceLoading(true);

    try {
      const invoices = await loadCustomerCreditBalanceForClient(supabase, customerId);
      setCustomerCreditInvoices(invoices);
    } catch {
      setCustomerCreditInvoices([]);
    } finally {
      setCreditBalanceLoading(false);
    }
  }

  async function searchCustomers(value: string) {
    setCustomerSearch(value);
    setCustomerSearchError("");
    setCustomerSaveError("");

    if (selectedCustomer && value !== customerLabel(selectedCustomer)) {
      setSelectedCustomer(null);
      setCustomerCreditInvoices([]);
    }

    const term = value.trim();

    if (!supabase || term.length < 2) {
      setCustomerSuggestions([]);
      return;
    }

    setIsCustomerSearching(true);

    const { data, error } = await supabase
      .from("partpos_customers")
      .select("id, customer_name, phone_number, credit_allowance, credit_pin_code, credit_pin_required")
      .or(`customer_name.ilike.%${term}%,phone_number.ilike.%${term}%`)
      .order("updated_at", { ascending: false })
      .limit(8);

    setIsCustomerSearching(false);

    if (error) {
      setCustomerSearchError(error.message);
      setCustomerSuggestions([]);
      return;
    }

    setCustomerSuggestions(
      (data ?? []).map((customer) => ({
        id: String(customer.id),
        customer_name: String(customer.customer_name ?? ""),
        phone_number: String(customer.phone_number ?? ""),
        credit_allowance: Number(customer.credit_allowance ?? 0),
        credit_pin_code:
          customer.credit_pin_code === null || customer.credit_pin_code === undefined
            ? null
            : String(customer.credit_pin_code),
        credit_pin_required: Boolean(customer.credit_pin_required ?? false),
      })),
    );
  }

  function selectCustomer(customer: PartPOSCustomer) {
    setSelectedCustomer(customer);
    setCustomerSearch(customerLabel(customer));
    setCustomerSuggestions([]);
    setCustomerSearchError("");
    setCustomerSaveError("");
    void loadCustomerCreditBalance(customer.id);
  }

  function clearCustomerSelection() {
    setSelectedCustomer(null);
    setCustomerSearch("");
    setCustomerSuggestions([]);
    setCustomerCreditInvoices([]);
    setCustomerSearchError("");
    setCustomerSaveError("");
  }

  function openCustomerPopup() {
    const existingText = customerSearch.trim();

    setCustomerForm({
      customerName: selectedCustomer?.customer_name || existingText,
      phoneNumber: selectedCustomer?.phone_number || "",
      creditAllowance:
        selectedCustomer && Number(selectedCustomer.credit_allowance) > 0
          ? money(Number(selectedCustomer.credit_allowance)) || ""
          : "",
      customerPin: "",
      customerPinConfirm: "",
    });
    setCustomerSaveStatus("idle");
    setCustomerSaveError("");
    setIsCustomerPopupOpen(true);
  }

  function closeCustomerPopup() {
    if (customerSaveStatus === "saving") return;
    setIsCustomerPopupOpen(false);
    setCustomerSaveError("");
  }

  async function saveNewCustomer() {
    if (!supabase) {
      setCustomerSaveStatus("error");
      setCustomerSaveError("Supabase غير مربوط. لا يمكن حفظ الزبون.");
      return;
    }

    const customerName = customerForm.customerName.trim();
    const phoneNumber = cleanPhone(customerForm.phoneNumber);
    const creditAllowance = parseMoney(customerForm.creditAllowance);
    const customerPin = cleanFourDigitPin(customerForm.customerPin);
    const customerPinConfirm = cleanFourDigitPin(customerForm.customerPinConfirm);
    const needsCreditPin = creditAllowance > 0;

    if (!customerName) {
      setCustomerSaveStatus("error");
      setCustomerSaveError("أدخل اسم الزبون أو اسم الشركة.");
      return;
    }

    if (needsCreditPin && customerPin.length !== 4) {
      setCustomerSaveStatus("error");
      setCustomerSaveError("الزبون لديه سقف ائتمان. أدخل رمز ائتمان من 4 أرقام.");
      return;
    }

    if (needsCreditPin && customerPin !== customerPinConfirm) {
      setCustomerSaveStatus("error");
      setCustomerSaveError("رمز الائتمان غير متطابق. أدخله مرتين بنفس الرقم.");
      return;
    }

    setCustomerSaveStatus("saving");
    setCustomerSaveError("");

    try {
      const payload = {
        customer_name: customerName,
        phone_number: phoneNumber || null,
        credit_allowance: creditAllowance,
        credit_pin_code: needsCreditPin ? customerPin : null,
        credit_pin_required: needsCreditPin,
        search_key: normalizeArabicText(`${customerName} ${phoneNumber}`),
        updated_at: new Date().toISOString(),
      };

      let data:
        | {
            id: string;
            customer_name: string | null;
            phone_number: string | null;
            credit_allowance: number | null;
            credit_pin_code?: string | null;
            credit_pin_required?: boolean | null;
          }
        | null = null;

      if (phoneNumber) {
        const { data: existingCustomer, error: lookupError } = await supabase
          .from("partpos_customers")
          .select("id")
          .eq("phone_number", phoneNumber)
          .maybeSingle();

        if (lookupError) throw lookupError;

        if (existingCustomer?.id) {
          const { data: updatedCustomer, error: updateError } = await supabase
            .from("partpos_customers")
            .update(payload)
            .eq("id", existingCustomer.id)
            .select("id, customer_name, phone_number, credit_allowance, credit_pin_code, credit_pin_required")
            .single();

          if (updateError) throw updateError;
          data = updatedCustomer;
        } else {
          const { data: insertedCustomer, error: insertError } = await supabase
            .from("partpos_customers")
            .insert(payload)
            .select("id, customer_name, phone_number, credit_allowance, credit_pin_code, credit_pin_required")
            .single();

          if (insertError) throw insertError;
          data = insertedCustomer;
        }
      } else {
        const { data: insertedCustomer, error: insertError } = await supabase
          .from("partpos_customers")
          .insert(payload)
          .select("id, customer_name, phone_number, credit_allowance, credit_pin_code, credit_pin_required")
          .single();

        if (insertError) throw insertError;
        data = insertedCustomer;
      }

      if (!data) {
        throw new Error("لم يرجع Supabase بيانات الزبون بعد الحفظ.");
      }

      const savedCustomer: PartPOSCustomer = {
        id: String(data.id),
        customer_name: String(data.customer_name ?? ""),
        phone_number: String(data.phone_number ?? ""),
        credit_allowance: Number(data.credit_allowance ?? 0),
        credit_pin_code:
          data.credit_pin_code === null || data.credit_pin_code === undefined
            ? null
            : String(data.credit_pin_code),
        credit_pin_required: Boolean(data.credit_pin_required ?? false),
      };

      selectCustomer(savedCustomer);
      setIsCustomerPopupOpen(false);
      setCustomerForm(emptyCustomerForm());
      setCustomerSaveStatus("idle");
    } catch (error) {
      const rawMessage = readSupabaseError(error);
      setCustomerSaveStatus("error");
      setCustomerSaveError(`خطأ Supabase: ${rawMessage}`);
    }
  }

  function buildCreditPaymentReceiptHtml(payment: CustomerCreditPaymentRecord) {
    const now = new Date(payment.created_at);
    const dateText = now.toLocaleDateString("ar-JO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeText = now.toLocaleTimeString("ar-JO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `<!doctype html>
<html dir="rtl" lang="ar">
  <head>
    <meta charset="utf-8" />
    <title>سند قبض ائتمان</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #fff; color: #111827; font-family: Arial, sans-serif; direction: rtl; }
      .receipt { width: 80mm; padding: 10px; }
      .header { text-align: center; border-bottom: 1px dashed #111827; padding-bottom: 8px; margin-bottom: 8px; }
      .header img { display: block; max-width: 64mm; max-height: 24mm; object-fit: contain; margin: 0 auto 6px; }
      h1 { margin: 0; font-size: 18px; }
      .muted { color: #6b7280; font-size: 11px; }
      .row { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; margin: 5px 0; }
      .box { border: 1px solid #111827; border-radius: 8px; padding: 8px; margin: 10px 0; }
      .amount { text-align: center; font-size: 20px; font-weight: 900; margin: 4px 0; }
      .footer { border-top: 1px dashed #111827; margin-top: 10px; padding-top: 8px; text-align: center; font-size: 11px; }
      @page { size: 80mm auto; margin: 0; }
    </style>
  </head>
  <body>
    <div class="receipt">
      <div class="header">
        <img src="/partpos/receipt-header.png" alt="" />
        <h1>سند قبض ائتمان</h1>
        <div class="muted">Credit Account Payment</div>
      </div>

      <div class="row"><strong>رقم السند</strong><span>${payment.payment_number ?? "—"}</span></div>
      <div class="row"><strong>التاريخ</strong><span>${dateText}</span></div>
      <div class="row"><strong>الوقت</strong><span>${timeText}</span></div>
      <div class="row"><strong>الزبون</strong><span>${escapeReceiptText(payment.customer_name)}</span></div>
      <div class="row"><strong>الهاتف</strong><span>${escapeReceiptText(payment.customer_phone || "—")}</span></div>

      <div class="box">
        <div class="muted">المبلغ المدفوع</div>
        <div class="amount">${money(payment.amount_paid)} د.أ</div>
      </div>

      <div class="row"><strong>الرصيد قبل الدفع</strong><span>${money(payment.balance_before)} د.أ</span></div>
      <div class="row"><strong>الرصيد بعد الدفع</strong><span>${money(payment.balance_after)} د.أ</span></div>

      <div class="footer">
        شكراً لكم<br />
        تم تسجيل الدفعة على حساب الائتمان
      </div>
    </div>
    <script>
      window.onload = () => { window.focus(); window.print(); };
    </script>
  </body>
</html>`;
  }

  function printCreditPaymentReceipt(payment: CustomerCreditPaymentRecord) {
    if (typeof window === "undefined") return false;

    const printWindow = window.open("", "_blank", "width=460,height=760");
    if (!printWindow) return false;

    printWindow.document.open();
    printWindow.document.write(buildCreditPaymentReceiptHtml(payment));
    printWindow.document.close();

    return true;
  }

  function openCreditPaymentPopup() {
    setCashoutStatus("idle");
    setCashoutMessage("");

    if (!selectedCustomer) {
      setCashoutStatus("error");
      setCashoutMessage("اختر زبون أولاً قبل تسجيل دفعة ائتمان.");
      return;
    }

    if (creditBalanceLoading) {
      setCashoutStatus("error");
      setCashoutMessage("جاري حساب رصيد الزبون. حاول بعد ثانية.");
      return;
    }

    if (selectedCustomerCreditBalance <= 0) {
      setCashoutStatus("error");
      setCashoutMessage("لا يوجد رصيد ائتمان مستحق على هذا الزبون.");
      return;
    }

    setCreditPaymentAmount(money(selectedCustomerCreditBalance));
    setCreditPaymentError("");
    setCreditPaymentStatus("idle");
    setIsCreditPaymentPopupOpen(true);
  }

  function closeCreditPaymentPopup() {
    if (creditPaymentStatus === "saving") return;
    setIsCreditPaymentPopupOpen(false);
    setCreditPaymentAmount("");
    setCreditPaymentError("");
    setCreditPaymentStatus("idle");
  }

  async function saveCreditAccountPayment(payFullBalance = false) {
    if (!supabase) {
      setCreditPaymentError("Supabase غير متصل.");
      return;
    }

    if (!selectedCustomer) {
      setCreditPaymentError("اختر زبون أولاً.");
      return;
    }

    const balanceBefore = selectedCustomerCreditBalance;
    const requestedAmount = payFullBalance
      ? balanceBefore
      : parseMoney(creditPaymentAmount);

    if (balanceBefore <= 0) {
      setCreditPaymentError("لا يوجد رصيد مستحق على هذا الزبون.");
      return;
    }

    if (requestedAmount <= 0) {
      setCreditPaymentError("أدخل مبلغ الدفع.");
      return;
    }

    if (requestedAmount > balanceBefore) {
      setCreditPaymentError("مبلغ الدفع أكبر من الرصيد المستحق.");
      return;
    }

    setCreditPaymentStatus("saving");
    setCreditPaymentError("");

    try {
      let remainingPayment = requestedAmount;

      for (const invoice of customerCreditInvoices) {
        if (remainingPayment <= 0) break;

        const invoiceBalance = Math.max(
          Number(invoice.sale_total || 0) - Number(invoice.amount_paid || 0),
          0,
        );

        if (invoiceBalance <= 0) continue;

        const appliedAmount = Math.min(invoiceBalance, remainingPayment);
        const nextAmountPaid = Number(invoice.amount_paid || 0) + appliedAmount;

        const { error: updateError } = await supabase
          .from("partpos_sales")
          .update({ amount_paid: nextAmountPaid })
          .eq("id", invoice.id);

        if (updateError) throw updateError;
        remainingPayment -= appliedAmount;
      }

      const balanceAfter = Math.max(balanceBefore - requestedAmount, 0);

      const { data: paymentRow, error: paymentError } = await supabase
        .from("partpos_credit_payments")
        .insert({
          customer_id: selectedCustomer.id,
          customer_name: selectedCustomer.customer_name,
          customer_phone: selectedCustomer.phone_number || null,
          amount_paid: requestedAmount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          payment_method: "cash",
        })
        .select(
          "id, payment_number, customer_name, customer_phone, amount_paid, balance_before, balance_after, created_at",
        )
        .single();

      if (paymentError) throw paymentError;

      const savedPayment: CustomerCreditPaymentRecord = {
        id: String(paymentRow.id),
        payment_number:
          paymentRow.payment_number === null || paymentRow.payment_number === undefined
            ? null
            : Number(paymentRow.payment_number),
        customer_name: String(paymentRow.customer_name ?? selectedCustomer.customer_name),
        customer_phone: String(paymentRow.customer_phone ?? selectedCustomer.phone_number ?? ""),
        amount_paid: Number(paymentRow.amount_paid ?? requestedAmount),
        balance_before: Number(paymentRow.balance_before ?? balanceBefore),
        balance_after: Number(paymentRow.balance_after ?? balanceAfter),
        created_at: String(paymentRow.created_at ?? new Date().toISOString()),
      };

      printCreditPaymentReceipt(savedPayment);
      await loadCustomerCreditBalance(selectedCustomer.id);

      setCashoutStatus("success");
      setCashoutMessage(
        `تم تسجيل دفعة ائتمان ${money(requestedAmount)} د.أ. الرصيد المتبقي: ${money(
          balanceAfter,
        )} د.أ`,
      );

      closeCreditPaymentPopup();
    } catch (error) {
      setCreditPaymentStatus("error");
      setCreditPaymentError(`خطأ Supabase: ${readSupabaseError(error)}`);
    }
  }

  function selectedCustomerCanUseCredit() {
    return Boolean(selectedCustomer && Number(selectedCustomer.credit_allowance) > 0);
  }

  function resetCreditPinPopup() {
    setCreditPinEntry("");
    setCreditPinError("");
    setCreditCashoutStatus("idle");
  }

  function openCreditPinPopup() {
    setCashoutStatus("idle");
    setCashoutMessage("");

    if (!selectedCustomer) {
      setCashoutStatus("error");
      setCashoutMessage("اختر زبون للفاتورة قبل البيع على الائتمان.");
      return;
    }

    if (Number(selectedCustomer.credit_allowance) <= 0) {
      setCashoutStatus("error");
      setCashoutMessage("هذا الزبون لا يملك سقف ائتمان.");
      return;
    }

    if (saleRows.length === 0) {
      setCashoutStatus("error");
      setCashoutMessage("أدخل قطعة واحدة على الأقل قبل إتمام البيع.");
      return;
    }

    if (saleTotal > Number(selectedCustomer.credit_allowance)) {
      setCashoutStatus("error");
      setCashoutMessage(
        `قيمة الفاتورة أعلى من سقف الائتمان. السقف: ${money(
          Number(selectedCustomer.credit_allowance),
        )} د.أ`,
      );
      return;
    }

    resetCreditPinPopup();
    setIsCreditPinPopupOpen(true);
  }

  function closeCreditPinPopup() {
    if (creditCashoutStatus === "saving" || creditCashoutStatus === "checking") return;
    setIsCreditPinPopupOpen(false);
    resetCreditPinPopup();
  }

  async function confirmCreditPinAndCashout() {
    if (!selectedCustomer) {
      setCreditPinError("اختر زبون قبل البيع على الائتمان.");
      return;
    }

    const expectedPin = String(selectedCustomer.credit_pin_code || "");

    if (expectedPin.length !== 4) {
      setCreditPinError("لا يوجد رمز ائتمان محفوظ لهذا الزبون. عدّل بيانات الزبون أولاً.");
      return;
    }

    if (creditPinEntry.length !== 4) {
      setCreditPinError("أدخل رمز الائتمان من 4 أرقام.");
      return;
    }

    setCreditCashoutStatus("checking");
    setCreditPinError("");

    if (creditPinEntry !== expectedPin) {
      setCreditPinEntry("");
      setCreditCashoutStatus("error");
      setCreditPinError("رمز الائتمان غير صحيح. البيع متوقف.");
      return;
    }

    setCreditCashoutStatus("saving");
    await cashOutSale(true, "credit");
    setIsCreditPinPopupOpen(false);
    resetCreditPinPopup();
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
    customer?: PartPOSCustomer | null;
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

    const customerHtml = args.customer
      ? `
    <section class="customerBox">
      <div>
        <span>الزبون</span>
        <strong>${escapeReceiptText(args.customer.customer_name)}</strong>
      </div>
      <div>
        <span>رقم الهاتف</span>
        <strong>${escapeReceiptText(args.customer.phone_number || "—")}</strong>
      </div>
      <div>
        <span>سقف الائتمان</span>
        <strong>${money(Number(args.customer.credit_allowance)) || "0.00"} د.أ</strong>
      </div>
    </section>`
      : `
    <section class="customerBox">
      <div>
        <span>الزبون</span>
        <strong>زبون نقدي</strong>
      </div>
      <div>
        <span>رقم الهاتف</span>
        <strong>—</strong>
      </div>
      <div>
        <span>سقف الائتمان</span>
        <strong>0.00 د.أ</strong>
      </div>
    </section>`;

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
    .customerBox {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 12px;
      background: #f9fafb;
    }
    .customerBox span {
      display: block;
      color: #6b7280;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .customerBox strong {
      display: block;
      color: #111827;
      font-size: 14px;
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

    ${customerHtml}

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

  function openExpensePopup() {
    setExpenseMode("utility");
    setExpenseForm(emptyExpenseForm());
    setExpenseSaveStatus("idle");
    setExpenseSaveMessage("");
    setIsExpensePopupOpen(true);
  }

  function closeExpensePopup() {
    if (expenseSaveStatus === "saving") return;
    setIsExpensePopupOpen(false);
    setExpenseSaveStatus("idle");
    setExpenseSaveMessage("");
  }

  function switchExpenseMode(nextMode: ExpenseMode) {
    setExpenseMode(nextMode);
    setExpenseSaveStatus("idle");
    setExpenseSaveMessage("");
    setExpenseForm((current) => ({
      ...current,
      details: nextMode === "utility" ? current.details : "",
      company: nextMode === "vendor" ? current.company : "",
      paidBy: current.paidBy || "cash",
    }));
  }

  async function saveExpense() {
    if (!supabase) {
      setExpenseSaveStatus("error");
      setExpenseSaveMessage("Supabase غير مربوط. لا يمكن حفظ المصروف.");
      return;
    }

    const amount = parseMoney(expenseForm.amount);
    const details = expenseForm.details.trim();
    const company = expenseForm.company.trim();

    if (amount <= 0) {
      setExpenseSaveStatus("error");
      setExpenseSaveMessage("أدخل مبلغ المصروف.");
      return;
    }

    if (expenseMode === "utility" && !details) {
      setExpenseSaveStatus("error");
      setExpenseSaveMessage("أدخل تفاصيل المصروف.");
      return;
    }

    if (expenseMode === "vendor" && !company) {
      setExpenseSaveStatus("error");
      setExpenseSaveMessage("أدخل اسم الشركة أو المورد.");
      return;
    }

    setExpenseSaveStatus("saving");
    setExpenseSaveMessage("");

    try {
      const { error } = await supabase.from("partpos_expenses").insert({
        expense_type: expenseMode,
        details: expenseMode === "utility" ? details : null,
        company_name: expenseMode === "vendor" ? company : null,
        amount,
        paid_by: expenseForm.paidBy,
      });

      if (error) throw error;

      setExpenseSaveStatus("success");
      setExpenseSaveMessage(
        expenseMode === "utility"
          ? `تم حفظ المصروف بقيمة ${money(amount)} د.أ (${expenseForm.paidBy === "cash" ? "نقداً" : "على الحساب"}).`
          : `تم حفظ دفعة المورد بقيمة ${money(amount)} د.أ (${expenseForm.paidBy === "cash" ? "نقداً" : "على الحساب"}).`,
      );
      setExpenseForm(emptyExpenseForm());
    } catch (error) {
      setExpenseSaveStatus("error");
      setExpenseSaveMessage(`خطأ Supabase: ${readSupabaseError(error)}`);
    }
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
    setCustomerSearch("");
    setCustomerSuggestions([]);
    setSelectedCustomer(null);
    setCustomerCreditInvoices([]);
    setCustomerSearchError("");
    setCustomerSaveError("");
    setCashReceived("");
    setMarginPopup(null);
    setIsCreditPinPopupOpen(false);
    resetCreditPinPopup();
  }

  function clearSale() {
    clearCurrentSaleInputs();
    setCashoutStatus("idle");
    setCashoutMessage("");
  }

  async function cashOutSale(
    printAfterSave = false,
    paymentMethod: "cash" | "credit" = "cash",
  ) {
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

    const isCreditSale = paymentMethod === "credit";
    const salePaidAmount = isCreditSale ? 0 : paidAmount;
    const saleChangeDue = isCreditSale ? 0 : changeDue;

    if (!isCreditSale && paidAmount < saleTotal) {
      setCashoutStatus("error");
      setCashoutMessage("المبلغ المدفوع أقل من الإجمالي.");
      return;
    }

    if (isCreditSale && !selectedCustomer) {
      setCashoutStatus("error");
      setCashoutMessage("اختر زبون قبل البيع على الائتمان.");
      return;
    }

    if (isCreditSale && Number(selectedCustomer?.credit_allowance ?? 0) <= 0) {
      setCashoutStatus("error");
      setCashoutMessage("هذا الزبون لا يملك سقف ائتمان.");
      return;
    }

    if (isCreditSale && saleTotal > Number(selectedCustomer?.credit_allowance ?? 0)) {
      setCashoutStatus("error");
      setCashoutMessage("قيمة الفاتورة أعلى من سقف الائتمان.");
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

      const salePayload: Record<string, unknown> = {
        payment_method: paymentMethod,
        status: "cashed_out",
        sale_total: saleTotal,
        amount_paid: salePaidAmount,
        change_due: saleChangeDue,
        item_count: saleRows.length,
      };

      if (selectedCustomer) {
        salePayload.customer_id = selectedCustomer.id;
        salePayload.customer_name = selectedCustomer.customer_name;
        salePayload.customer_phone = selectedCustomer.phone_number;
        salePayload.customer_credit_allowance = selectedCustomer.credit_allowance;
      }

      const { data: sale, error: saleError } = await supabase
        .from("partpos_sales")
        .insert(salePayload)
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
          paid: salePaidAmount,
          change: saleChangeDue,
          tender: isCreditSale ? "ائتمان" : "نقداً",
          customer: selectedCustomer,
        });

        printBlocked = !printed;
      }

      const successMessage = isCreditSale
        ? printBlocked
          ? `تم حفظ البيع على الائتمان رقم ${sale.sale_number ?? ""}، لكن المتصفح منع نافذة الطباعة. اسمح بالـ popups.`
          : `تم حفظ البيع على الائتمان رقم ${sale.sale_number ?? ""}.`
        : printBlocked
          ? `تم حفظ البيع رقم ${sale.sale_number ?? ""}، لكن المتصفح منع نافذة الطباعة. اسمح بالـ popups. الراجع: ${money(saleChangeDue) || "0.00"} د.أ`
          : `تم حفظ البيع رقم ${sale.sale_number ?? ""}. الراجع: ${money(saleChangeDue) || "0.00"} د.أ`;

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
          <button
            className="expenseTopButton"
            onClick={openExpensePopup}
            type="button"
          >
            إضافة مصروف
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

      <section className="customerCard">
        <div className="customerBarHeader">
          <div>
            <label htmlFor="customer-search">إضافة زبون للفاتورة</label>
            <p>ابحث بالاسم، اسم الشركة، أو رقم الهاتف.</p>
          </div>
          {selectedCustomer && (
            <button type="button" className="removeCustomerButton" onClick={clearCustomerSelection}>
              إزالة الزبون
            </button>
          )}
        </div>

        <div className="customerBar">
          <div className="customerSearchBox">
            <input
              id="customer-search"
              value={customerSearch}
              onChange={(event) => void searchCustomers(event.target.value)}
              placeholder="اسم الزبون / اسم الشركة / رقم الهاتف"
              autoComplete="off"
            />

            {isCustomerSearching && <div className="hint">جاري البحث عن الزبون...</div>}
            {customerSearchError && <div className="error">{customerSearchError}</div>}

            {customerSuggestions.length > 0 && (
              <div className="customerSuggestions">
                {customerSuggestions.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => selectCustomer(customer)}
                  >
                    <strong>{customer.customer_name}</strong>
                    <span>{customer.phone_number || "بدون رقم"}</span>
                    <b>{money(Number(customer.credit_allowance)) || "0.00"} د.أ</b>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" className="addCustomerButton" onClick={openCustomerPopup}>
            إضافة زبون جديد
          </button>
        </div>

        {selectedCustomer && (
          <div className="selectedCustomerBox">
            <div>
              <span>الزبون على الفاتورة</span>
              <strong>{selectedCustomer.customer_name}</strong>
            </div>
            <div>
              <span>رقم الهاتف</span>
              <strong>{selectedCustomer.phone_number || "—"}</strong>
            </div>
            <div>
              <span>سقف الائتمان</span>
              <strong>{money(Number(selectedCustomer.credit_allowance)) || "0.00"} د.أ</strong>
            </div>
            <div>
              <span>الرصيد المستحق</span>
              <strong className={selectedCustomerCreditBalance > 0 ? "remainingNumber" : "changeNumber"}>
                {creditBalanceLoading
                  ? "جاري الحساب..."
                  : `${money(selectedCustomerCreditBalance)} د.أ`}
              </strong>
            </div>
          </div>
        )}
      </section>

      <section className="tableCard">
        {departmentLoadError && (
          <div className="departmentLoadError">
            لم يتم تحميل قائمة الأقسام: {departmentLoadError}
          </div>
        )}
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
                    <td className="departmentCell">
                      {departmentOptions.length > 0 &&
                      !customDepartmentRows[row.lineId] ? (
                        <>
                          <select
                            className="departmentSelect"
                            value={departmentExists(row.department) ? row.department : ""}
                            onChange={(event) => {
                              const selectedValue = event.target.value;

                              if (selectedValue === "__new_department__") {
                                useCustomDepartmentForRow(row.lineId);
                                updateRow(index, "department", "");
                                return;
                              }

                              useSavedDepartmentForRow(row.lineId);
                              updateRow(index, "department", selectedValue);
                            }}
                          >
                            <option value="">اختر القسم</option>
                            {departmentOptions.map((department) => (
                              <option value={department} key={department}>
                                {department}
                              </option>
                            ))}
                            <option value="__new_department__">
                              + قسم جديد
                            </option>
                          </select>
                          <small className="departmentHint">
                            اختر من الأقسام المحفوظة حتى لا يتكرر نفس القسم بتهجئة مختلفة.
                          </small>
                        </>
                      ) : (
                        <div className="departmentCustomWrap">
                          <input
                            value={row.department}
                            onChange={(event) =>
                              updateRow(index, "department", event.target.value)
                            }
                            placeholder={
                              departmentOptions.length > 0
                                ? "اكتب اسم القسم الجديد"
                                : "القسم"
                            }
                          />
                          {departmentOptions.length > 0 && (
                            <button
                              type="button"
                              className="departmentBackButton"
                              onClick={() => {
                                useSavedDepartmentForRow(row.lineId);
                                updateRow(index, "department", "");
                              }}
                            >
                              اختيار من القائمة
                            </button>
                          )}
                        </div>
                      )}
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
              onClick={() => void cashOutSale(false, "cash")}
              type="button"
            >
              {cashoutStatus === "saving" ? "جاري الحفظ..." : "إتمام البيع"}
            </button>
            <button
              className="printCashoutButton"
              disabled={!canCashOut}
              onClick={() => void cashOutSale(true, "cash")}
              type="button"
            >
              إتمام البيع وطباعة الفاتورة
            </button>
            <button
              className="creditCashoutButton"
              disabled={!supabase || saleRows.length === 0 || saleTotal <= 0 || cashoutStatus === "saving"}
              onClick={openCreditPinPopup}
              type="button"
            >
              إتمام البيع على الائتمان وطباعة الفاتورة
            </button>

            <button
              className="creditPaymentButton"
              disabled={
                !supabase ||
                !selectedCustomer ||
                selectedCustomerCreditBalance <= 0 ||
                creditBalanceLoading ||
                creditPaymentStatus === "saving" ||
                cashoutStatus === "saving"
              }
              onClick={openCreditPaymentPopup}
              type="button"
            >
              {creditBalanceLoading
                ? "جاري حساب رصيد الزبون..."
                : selectedCustomerCreditBalance > 0
                  ? `دفع على حساب الائتمان • ${money(selectedCustomerCreditBalance)} د.أ`
                  : "دفع على حساب الائتمان"}
            </button>
          </div>

          {cashoutMessage && (
            <div className={`cashoutMessage ${cashoutStatus}`}>
              {cashoutMessage}
            </div>
          )}
        </div>
      </section>


      {isExpensePopupOpen && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="expensePopupCard">
            <p className="popupEyebrow">مصروفات</p>
            <h2>إضافة مصروف</h2>

            <div className="expenseTabs">
              <button
                type="button"
                className={expenseMode === "utility" ? "expenseTab activeExpenseTab" : "expenseTab"}
                onClick={() => switchExpenseMode("utility")}
              >
                خدمات / مرافق
              </button>
              <button
                type="button"
                className={expenseMode === "vendor" ? "expenseTab activeExpenseTab" : "expenseTab"}
                onClick={() => switchExpenseMode("vendor")}
              >
                دفع مورد
              </button>
            </div>

            <div className="expenseCashNote">
              نقداً = يخصم من تقرير نهاية اليوم. على الحساب = يبقى مستحق ولا يلمس الكاش.
            </div>

            {expenseMode === "utility" ? (
              <div className="expenseFormGrid">
                <div>
                  <label htmlFor="expense-details">التفاصيل</label>
                  <input
                    id="expense-details"
                    value={expenseForm.details}
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        details: event.target.value,
                      }))
                    }
                    placeholder="مثال: راتب موظف، كهرباء، ماء، إنترنت، إيجار"
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="expense-amount">المبلغ</label>
                  <input
                    id="expense-amount"
                    value={expenseForm.amount}
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    placeholder="0.00"
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="expense-paid-by">طريقة الدفع</label>
                  <select
                    id="expense-paid-by"
                    value={expenseForm.paidBy}
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        paidBy: event.target.value as ExpensePaidBy,
                      }))
                    }
                  >
                    <option value="cash">نقداً - يخصم من صندوق اليوم</option>
                    <option value="credit">على الحساب - لا يخصم من الكاش</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="expenseFormGrid">
                <div>
                  <label htmlFor="vendor-company">الشركة / المورد</label>
                  <input
                    id="vendor-company"
                    value={expenseForm.company}
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        company: event.target.value,
                      }))
                    }
                    placeholder="اسم الشركة أو المورد"
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="vendor-amount">المبلغ</label>
                  <input
                    id="vendor-amount"
                    value={expenseForm.amount}
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    placeholder="0.00"
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="vendor-paid-by">طريقة الدفع</label>
                  <select
                    id="vendor-paid-by"
                    value={expenseForm.paidBy}
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        paidBy: event.target.value as ExpensePaidBy,
                      }))
                    }
                  >
                    <option value="cash">نقداً - يخصم من صندوق اليوم</option>
                    <option value="credit">على الحساب - يبقى مستحق</option>
                  </select>
                </div>
              </div>
            )}

            {expenseSaveMessage && (
              <div className={`expenseSaveMessage ${expenseSaveStatus}`}>
                {expenseSaveMessage}
              </div>
            )}

            <div className="customerPopupActions">
              <button
                type="button"
                className="cancelCustomerButton"
                onClick={closeExpensePopup}
                disabled={expenseSaveStatus === "saving"}
              >
                إغلاق
              </button>
              <button
                type="button"
                className="saveCustomerButton"
                onClick={() => void saveExpense()}
                disabled={expenseSaveStatus === "saving"}
              >
                {expenseSaveStatus === "saving" ? "جاري الحفظ..." : "حفظ المصروف"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreditPaymentPopupOpen && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="creditPaymentPopupCard">
            <p className="popupEyebrow">دفعة ائتمان</p>
            <h2>دفع على حساب الزبون</h2>

            <div className="creditCustomerSummary">
              <div>
                <span>الزبون</span>
                <strong>{selectedCustomer?.customer_name || "—"}</strong>
              </div>
              <div>
                <span>الرصيد المستحق</span>
                <strong>{money(selectedCustomerCreditBalance)} د.أ</strong>
              </div>
              <div>
                <span>عدد الفواتير المفتوحة</span>
                <strong>{customerCreditInvoices.length}</strong>
              </div>
            </div>

            <label htmlFor="credit-payment-amount">مبلغ الدفع</label>
            <input
              id="credit-payment-amount"
              value={creditPaymentAmount}
              onChange={(event) => setCreditPaymentAmount(event.target.value)}
              placeholder="0.00"
              inputMode="decimal"
              autoComplete="off"
              autoFocus
            />

            {creditPaymentError && (
              <div className="customerPopupError">{creditPaymentError}</div>
            )}

            <div className="customerPopupActions creditPaymentActions">
              <button
                type="button"
                className="cancelCustomerButton"
                onClick={closeCreditPaymentPopup}
                disabled={creditPaymentStatus === "saving"}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="saveCustomerButton"
                onClick={() => void saveCreditAccountPayment(false)}
                disabled={creditPaymentStatus === "saving"}
              >
                {creditPaymentStatus === "saving" ? "جاري الحفظ..." : "تسجيل دفعة جزئية"}
              </button>
              <button
                type="button"
                className="saveFullCreditPaymentButton"
                onClick={() => void saveCreditAccountPayment(true)}
                disabled={creditPaymentStatus === "saving"}
              >
                دفع كامل الرصيد
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreditPinPopupOpen && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="creditPinPopupCard">
            <p className="popupEyebrow">بيع على الائتمان</p>
            <h2>تأكيد رمز الزبون</h2>

            <div className="creditCustomerSummary">
              <div>
                <span>الزبون</span>
                <strong>{selectedCustomer?.customer_name || "—"}</strong>
              </div>
              <div>
                <span>إجمالي الفاتورة</span>
                <strong>{money(saleTotal)} د.أ</strong>
              </div>
              <div>
                <span>سقف الائتمان</span>
                <strong>{money(Number(selectedCustomer?.credit_allowance ?? 0))} د.أ</strong>
              </div>
            </div>

            <label htmlFor="credit-sale-pin">رمز الائتمان</label>
            <input
              id="credit-sale-pin"
              value={creditPinEntry}
              onChange={(event) =>
                setCreditPinEntry(cleanFourDigitPin(event.target.value))
              }
              placeholder="أدخل 4 أرقام"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              autoFocus
            />

            {creditPinError && <div className="customerPopupError">{creditPinError}</div>}

            <div className="customerPopupActions">
              <button
                type="button"
                className="cancelCustomerButton"
                onClick={closeCreditPinPopup}
                disabled={
                  creditCashoutStatus === "saving" || creditCashoutStatus === "checking"
                }
              >
                إلغاء
              </button>
              <button
                type="button"
                className="saveCustomerButton"
                onClick={() => void confirmCreditPinAndCashout()}
                disabled={
                  creditCashoutStatus === "saving" || creditCashoutStatus === "checking"
                }
              >
                {creditCashoutStatus === "saving"
                  ? "جاري الحفظ..."
                  : creditCashoutStatus === "checking"
                    ? "جاري التحقق..."
                    : "تأكيد وإتمام البيع"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCustomerPopupOpen && (
        <div className="popupBackdrop" role="dialog" aria-modal="true">
          <div className="customerPopupCard">
            <p className="popupEyebrow">زبون جديد</p>
            <h2>إضافة زبون للفاتورة</h2>

            <label htmlFor="customer-name">الاسم أو اسم الشركة</label>
            <input
              id="customer-name"
              value={customerForm.customerName}
              onChange={(event) =>
                setCustomerForm((current) => ({
                  ...current,
                  customerName: event.target.value,
                }))
              }
              placeholder="مثال: شركة المدينة / محمد أحمد"
              autoComplete="off"
            />

            <label htmlFor="customer-phone">رقم الهاتف</label>
            <input
              id="customer-phone"
              value={customerForm.phoneNumber}
              onChange={(event) =>
                setCustomerForm((current) => ({
                  ...current,
                  phoneNumber: event.target.value,
                }))
              }
              placeholder="079..."
              inputMode="tel"
              autoComplete="off"
            />

            <label htmlFor="credit-allowance">سقف الائتمان</label>
            <input
              id="credit-allowance"
              value={customerForm.creditAllowance}
              onChange={(event) =>
                setCustomerForm((current) => ({
                  ...current,
                  creditAllowance: event.target.value,
                  customerPin:
                    parseMoney(event.target.value) > 0 ? current.customerPin : "",
                  customerPinConfirm:
                    parseMoney(event.target.value) > 0
                      ? current.customerPinConfirm
                      : "",
                }))
              }
              placeholder="0.00"
              inputMode="decimal"
            />

            {parseMoney(customerForm.creditAllowance) > 0 && (
              <div className="creditPinBox">
                <div className="creditPinNotice">
                  هذا الزبون لديه سقف ائتمان. لازم الزبون ينشئ رمز من 4 أرقام.
                </div>

                <label htmlFor="customer-pin">رمز الائتمان من الزبون</label>
                <input
                  id="customer-pin"
                  value={customerForm.customerPin}
                  onChange={(event) =>
                    setCustomerForm((current) => ({
                      ...current,
                      customerPin: cleanFourDigitPin(event.target.value),
                    }))
                  }
                  placeholder="4 أرقام"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                />

                <label htmlFor="customer-pin-confirm">تأكيد رمز الائتمان</label>
                <input
                  id="customer-pin-confirm"
                  value={customerForm.customerPinConfirm}
                  onChange={(event) =>
                    setCustomerForm((current) => ({
                      ...current,
                      customerPinConfirm: cleanFourDigitPin(event.target.value),
                    }))
                  }
                  placeholder="أدخل نفس الرمز مرة ثانية"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                />
              </div>
            )}

            {customerSaveError && <div className="customerPopupError">{customerSaveError}</div>}

            <div className="customerPopupActions">
              <button
                type="button"
                className="cancelCustomerButton"
                onClick={closeCustomerPopup}
                disabled={customerSaveStatus === "saving"}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="saveCustomerButton"
                onClick={() => void saveNewCustomer()}
                disabled={customerSaveStatus === "saving"}
              >
                {customerSaveStatus === "saving" ? "جاري الحفظ..." : "حفظ الزبون"}
              </button>
            </div>
          </div>
        </div>
      )}

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

        .expenseTopButton {
          border: 1px solid #b45309;
          background: #b45309;
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .expenseTopButton:hover {
          background: #92400e;
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

        input,
        select {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 16px;
          outline: none;
          background: white;
        }

        input:focus,
        select:focus {
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

        .customerCard {
          max-width: 1200px;
          margin: 0 auto 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          padding: 18px;
        }

        .customerBarHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 12px;
        }

        .customerBarHeader p {
          margin: -3px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .customerBar {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: start;
        }

        .customerSearchBox {
          position: relative;
        }

        .customerSuggestions {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .customerSuggestions button {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 14px;
          align-items: center;
          text-align: right;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
        }

        .customerSuggestions span {
          color: #6b7280;
        }

        .addCustomerButton,
        .removeCustomerButton {
          border: 0;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
        }

        .addCustomerButton {
          background: #111827;
          color: white;
        }

        .removeCustomerButton {
          background: #fee2e2;
          color: #991b1b;
        }

        .selectedCustomerBox {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 14px;
        }

        .selectedCustomerBox div {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
          background: #f9fafb;
        }

        .selectedCustomerBox span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .selectedCustomerBox strong {
          display: block;
          color: #111827;
          font-size: 16px;
        }

        .customerPopupCard,
        .creditPinPopupCard,
        .creditPaymentPopupCard,
        .expensePopupCard {
          width: min(520px, 100%);
          background: white;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
          padding: 22px;
          border: 1px solid #e5e7eb;
        }

        .customerPopupCard h2,
        .creditPinPopupCard h2,
        .creditPaymentPopupCard h2,
        .expensePopupCard h2 {
          margin: 0 0 16px;
          color: #111827;
          font-size: 24px;
          line-height: 1.25;
        }

        .customerPopupCard label,
        .creditPinPopupCard label,
        .creditPaymentPopupCard label,
        .expensePopupCard label {
          margin-top: 12px;
          font-size: 13px;
        }

        .expenseTabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }

        .expenseTab {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px 14px;
          background: #f9fafb;
          color: #374151;
          font-weight: 900;
          cursor: pointer;
        }

        .activeExpenseTab {
          background: #111827;
          color: white;
          border-color: #111827;
        }

        .expenseCashNote {
          margin: -4px 0 14px;
          border: 1px solid #fed7aa;
          border-radius: 12px;
          padding: 10px 12px;
          background: #fff7ed;
          color: #9a3412;
          font-weight: 800;
          font-size: 13px;
        }

        .expenseFormGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .expenseFormGrid input,
        .expenseFormGrid select {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 16px;
          outline: none;
          background: white;
        }

        .expenseSaveMessage {
          margin-top: 12px;
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 800;
        }

        .expenseSaveMessage.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .expenseSaveMessage.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .expenseSaveMessage.saving,
        .expenseSaveMessage.idle {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .creditCustomerSummary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .creditCustomerSummary div {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 10px;
          background: #f9fafb;
        }

        .creditCustomerSummary span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .creditCustomerSummary strong {
          display: block;
          font-size: 15px;
          color: #111827;
        }

        .creditPaymentActions {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .saveFullCreditPaymentButton {
          border: 0;
          border-radius: 12px;
          padding: 13px 16px;
          background: #b45309;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .saveFullCreditPaymentButton:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .creditPinBox {
          margin-top: 14px;
          border: 1px solid #fbbf24;
          background: #fffbeb;
          border-radius: 16px;
          padding: 14px;
        }

        .creditPinNotice {
          color: #92400e;
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .customerPopupActions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 16px;
        }

        .saveCustomerButton,
        .cancelCustomerButton {
          border: 0;
          border-radius: 14px;
          padding: 13px 16px;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .saveCustomerButton {
          background: #15803d;
          color: white;
        }

        .cancelCustomerButton {
          background: #f3f4f6;
          color: #111827;
        }

        .saveCustomerButton:disabled,
        .cancelCustomerButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .customerPopupError {
          margin-top: 12px;
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 800;
        }

        .tableCard {
          padding: 0;
          overflow: hidden;
        }

        .departmentLoadError {
          margin: 14px 14px 0;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #991b1b;
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 800;
          font-size: 13px;
        }

        .departmentCell {
          min-width: 220px;
        }

        .departmentSelect {
          font-weight: 800;
          cursor: pointer;
        }

        .departmentHint {
          display: block;
          margin-top: 6px;
          color: #6b7280;
          font-size: 11px;
          line-height: 1.35;
        }

        .departmentCustomWrap {
          display: grid;
          gap: 7px;
        }

        .departmentBackButton {
          border: 0;
          border-radius: 10px;
          padding: 8px 10px;
          background: #f3f4f6;
          color: #111827;
          font-weight: 800;
          cursor: pointer;
          font-size: 12px;
        }

        .tableWrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1160px;
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
        .printCashoutButton,
        .creditCashoutButton,
        .creditPaymentButton {
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

        .creditCashoutButton {
          background: #7c3aed;
        }

        .creditPaymentButton {
          background: #b45309;
        }

        .cashoutButton:disabled,
        .printCashoutButton:disabled,
        .creditCashoutButton:disabled,
        .creditPaymentButton:disabled {
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

          .cashoutPanel,
          .customerBar,
          .selectedCustomerBox {
            grid-template-columns: 1fr;
          }

          .customerBarHeader {
            flex-direction: column;
            align-items: stretch;
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