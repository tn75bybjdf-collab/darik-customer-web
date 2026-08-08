"use client";

// DARIK_MOBILE_DASHBOARD_LOGOUT_035

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./DashboardLogoutButton.module.css";

export default function DashboardLogoutButton() {
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function logout() {
    if (busy) return;
    setBusy(true);
    await supabase.auth.signOut();
    window.location.replace("/store-dashboard");
  }

  const label = busy
    ? "Signing out… / جارٍ تسجيل الخروج…"
    : "Sign out / تسجيل الخروج";

  return (
    <>
      <button type="button" className={styles.button} onClick={logout} disabled={busy}>
        {label}
      </button>
      {mounted
        ? createPortal(
            <button
              type="button"
              className={styles.mobileButton}
              onClick={logout}
              disabled={busy}
              aria-label="Sign out / تسجيل الخروج"
            >
              {busy ? "Signing out…" : "Sign out / خروج"}
            </button>,
            document.body
          )
        : null}
    </>
  );
}
