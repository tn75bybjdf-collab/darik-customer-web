"use client";

// DARIK_FRONTEND_355_ACCOUNT_MENU_EVERYWHERE
// Inline launcher only. The shared DarikCustomerAccountHub339 remains the single
// source of truth for sign-in, order history, account details and sign-out.

import type { CSSProperties } from "react";

type DarikCustomerAccountMenuLauncher354Props = {
  title?: string;
};

const buttonStyle354: CSSProperties = {
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: 12,
  border: "1px solid rgba(15, 23, 42, 0.16)",
  background: "rgba(255,255,255,0.96)",
  color: "#0f172a",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
  flex: "0 0 auto",
};

const lineStyle354: CSSProperties = {
  display: "block",
  width: 19,
  height: 2,
  borderRadius: 999,
  background: "currentColor",
};

export default function DarikCustomerAccountMenuLauncher354({
  title = "Customer account / ط­ط³ط§ط¨ ط§ظ„ط¹ظ…ظٹظ„",
}: DarikCustomerAccountMenuLauncher354Props) {
  function openAccount354() {
    window.dispatchEvent(
      new CustomEvent("darik-customer-account-open-354", {
        detail: { source: "header-menu" },
      })
    );
  }

  return (
    <button
      type="button"
      data-darik-account-menu-launcher-354="true"
      aria-label={title}
      title={title}
      onClick={openAccount354}
      style={buttonStyle354}
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span style={lineStyle354} />
        <span style={lineStyle354} />
        <span style={lineStyle354} />
      </span>
    </button>
  );
}