"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./DashboardLogoutButton.module.css";

export default function DashboardLogoutButton() {
  const [busy, setBusy] = useState(false);

  async function logout() {
    if (busy) return;
    setBusy(true);
    await supabase.auth.signOut();
    window.location.replace("/store-dashboard");
  }

  return (
    <button type="button" className={styles.button} onClick={logout} disabled={busy}>
      {busy ? "Signing out… / جارٍ تسجيل الخروج…" : "Sign out / تسجيل الخروج"}
    </button>
  );
}
