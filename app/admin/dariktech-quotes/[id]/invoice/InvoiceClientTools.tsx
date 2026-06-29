"use client";

import { useEffect } from "react";

type SavedInvoiceLine = {
  item?: string;
  description?: string;
  qty?: string;
  price?: string;
};

type SavedInvoice = {
  fields?: Record<string, string>;
  lines?: SavedInvoiceLine[];
};

function rawNumber(value: unknown) {
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function money(value: number) {
  return value.toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function setInputValue(field: Element | null, value: string) {
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    field.value = value;
  }
}

function getInputValue(field: Element | null) {
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    return field.value || "";
  }

  return "";
}

function createLineRow(line?: SavedInvoiceLine) {
  const row = document.createElement("div");
  row.className = "line-row";
  row.setAttribute("data-line-row", "");

  row.innerHTML =
    '<input class="editable-input" data-line-field="item" aria-label="Line item name" />' +
    '<textarea class="editable-textarea" data-line-field="description" rows="3" aria-label="Line item description"></textarea>' +
    '<input class="editable-input number-input" data-line-field="qty" inputmode="decimal" aria-label="Quantity" />' +
    '<input class="editable-input number-input" data-line-field="price" inputmode="decimal" placeholder="0" aria-label="Unit price" />' +
    '<output data-line-total>0.00</output>' +
    '<button class="remove-row screen-only" data-remove-row type="button">Remove</button>';

  setInputValue(row.querySelector('[data-line-field="item"]'), line?.item || "");
  setInputValue(
    row.querySelector('[data-line-field="description"]'),
    line?.description || "",
  );
  setInputValue(row.querySelector('[data-line-field="qty"]'), line?.qty || "1");
  setInputValue(
    row.querySelector('[data-line-field="price"]'),
    line?.price || "",
  );

  return row;
}

export default function InvoiceClientTools({ invoiceId }: { invoiceId: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-invoice-id]");

    if (!root) return;

    const storageKey = `dariktech_invoice_edits_${invoiceId}`;

    function getCurrency() {
      const input = root?.querySelector('[data-save-key="currency"]');
      const value = getInputValue(input).trim();

      return value;
    }

    function formatMoney(value: number) {
      const currency = getCurrency();

      return currency ? `${currency} ${money(value)}` : money(value);
    }

    function calculateTotals() {
      if (!root) return;

      let subtotal = 0;

      root.querySelectorAll("[data-line-row]").forEach((row) => {
        const qty = rawNumber(getInputValue(row.querySelector('[data-line-field="qty"]')));
        const price = rawNumber(
          getInputValue(row.querySelector('[data-line-field="price"]')),
        );
        const total = qty * price;
        subtotal += total;

        const output = row.querySelector("[data-line-total]");
        if (output) output.textContent = formatMoney(total);
      });

      const discount = rawNumber(
        getInputValue(root.querySelector('[data-total-input="discount"]')),
      );
      const tax = rawNumber(
        getInputValue(root.querySelector('[data-total-input="tax"]')),
      );
      const deposit = rawNumber(
        getInputValue(root.querySelector('[data-total-input="deposit"]')),
      );

      const grandTotal = Math.max(0, subtotal - discount + tax);
      const balance = Math.max(0, grandTotal - deposit);

      const subtotalEl = root.querySelector("[data-subtotal]");
      const discountEl = root.querySelector("[data-discount-display]");
      const taxEl = root.querySelector("[data-tax-display]");
      const grandTotalEl = root.querySelector("[data-grand-total]");
      const balanceEl = root.querySelector("[data-balance]");

      if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
      if (discountEl) discountEl.textContent = formatMoney(discount);
      if (taxEl) taxEl.textContent = formatMoney(tax);
      if (grandTotalEl) grandTotalEl.textContent = formatMoney(grandTotal);
      if (balanceEl) balanceEl.textContent = formatMoney(balance);
    }

    function serialize(): SavedInvoice {
      if (!root) return { fields: {}, lines: [] };

      const fields: Record<string, string> = {};

      root.querySelectorAll("[data-save-key]").forEach((field) => {
        const key = field.getAttribute("data-save-key");
        if (!key) return;
        fields[key] = getInputValue(field);
      });

      const lines = Array.from(root.querySelectorAll("[data-line-row]")).map(
        (row) => ({
          item: getInputValue(row.querySelector('[data-line-field="item"]')),
          description: getInputValue(
            row.querySelector('[data-line-field="description"]'),
          ),
          qty: getInputValue(row.querySelector('[data-line-field="qty"]')),
          price: getInputValue(row.querySelector('[data-line-field="price"]')),
        }),
      );

      return { fields, lines };
    }

    function save() {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(serialize()));
      } catch {
        // Browser storage can fail in private mode. Totals still work.
      }
    }

    function load() {
      try {
        const saved = JSON.parse(
          window.localStorage.getItem(storageKey) || "null",
        ) as SavedInvoice | null;

        if (!saved || !root) return;

        Object.entries(saved.fields || {}).forEach(([key, value]) => {
          setInputValue(root.querySelector(`[data-save-key="${key}"]`), value);
        });

        if (Array.isArray(saved.lines) && saved.lines.length) {
          const container = root.querySelector("[data-line-items]");

          if (container) {
            container.innerHTML = "";
            saved.lines.forEach((line) => {
              container.appendChild(createLineRow(line));
            });
          }
        }
      } catch {
        // Ignore broken saved data and keep defaults.
      }
    }

    function handleInput() {
      calculateTotals();
      save();
    }

    function handleClick(event: Event) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      if (target.matches("[data-remove-row]")) {
        const rows = root.querySelectorAll("[data-line-row]");

        if (rows.length > 1) {
          target.closest("[data-line-row]")?.remove();
          calculateTotals();
          save();
        }
      }
    }

    function handleAddRow() {
      const container = root.querySelector("[data-line-items]");

      if (!container) return;

      container.appendChild(
        createLineRow({
          item: "New line item",
          description: "Describe the work included.",
          qty: "1",
          price: "",
        }),
      );

      calculateTotals();
      save();
    }

    function handleReset() {
      if (!window.confirm("Reset saved invoice edits for this quote?")) return;

      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Ignore.
      }

      window.location.reload();
    }

    function handlePrint() {
      calculateTotals();
      save();

      requestAnimationFrame(() => {
        window.print();
      });
    }

    const addButton = document.querySelector("[data-add-row]");
    const resetButton = document.querySelector("[data-reset-invoice]");
    const printButton = document.querySelector("[data-print-button]");

    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleInput);
    root.addEventListener("click", handleClick);
    addButton?.addEventListener("click", handleAddRow);
    resetButton?.addEventListener("click", handleReset);
    printButton?.addEventListener("click", handlePrint);

    load();
    calculateTotals();

    return () => {
      root.removeEventListener("input", handleInput);
      root.removeEventListener("change", handleInput);
      root.removeEventListener("click", handleClick);
      addButton?.removeEventListener("click", handleAddRow);
      resetButton?.removeEventListener("click", handleReset);
      printButton?.removeEventListener("click", handlePrint);
    };
  }, [invoiceId]);

  return null;
}