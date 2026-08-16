"use client";

/* DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136 */

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";

type OnboardingState = {
  managed_account?: boolean;
  field_selected?: boolean;
  setup_completed?: boolean;
  getting_started_status?: string;
};

function destinationFor(pathname: string, state: OnboardingState) {
  if (!state.managed_account) return null;

  if (!state.field_selected) {
    return pathname === "/store-dashboard/setup-field" ? null : "/store-dashboard/setup-field";
  }

  if (!state.setup_completed) {
    return pathname === "/store-dashboard/storefront" ? null : "/store-dashboard/storefront";
  }

  if (state.getting_started_status === "pending") {
    return pathname === "/store-dashboard/getting-started" ? null : "/store-dashboard/getting-started";
  }

  if (pathname === "/store-dashboard/setup-field" || pathname === "/store-dashboard/getting-started") {
    return "/store-dashboard";
  }

  return null;
}

export default function StoreDashboardOnboardingGate136({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [blocked, setBlocked] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let runNumber = 0;

    async function checkGate() {
      const thisRun = ++runNumber;
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled || thisRun !== runNumber) return;

      if (!sessionData.session) {
        if (pathname !== "/store-dashboard") {
          setBlocked(true);
          router.replace("/store-dashboard");
          return;
        }
        setBlocked(false);
        return;
      }

      setBlocked(true);
      const { data, error } = await supabase.rpc("darik_direct_get_my_onboarding_v1");
      if (cancelled || thisRun !== runNumber) return;

      if (error) {
        // Fail closed for authenticated retailer pages. The root dashboard can still
        // render its own session/error handling only when no session exists.
        console.error("Darik onboarding gate failed:", error.message);
        setBlocked(true);
        return;
      }

      const state = (data ?? {}) as OnboardingState;
      const destination = destinationFor(pathname, state);
      if (destination) {
        router.replace(destination);
        return;
      }

      setBlocked(false);
    }

    void checkGate();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => { if (!cancelled) void checkGate(); }, 0);
    });

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (blocked) {
    return (
      <main style={{ minHeight:"100vh", display:"grid", placeItems:"center", alignContent:"center", gap:12, background:"#f7f7f3", color:"#111", padding:20 }}>
        <div style={{ width:34, height:34, border:"3px solid #deded7", borderTopColor:"#111", borderRadius:"50%", animation:"darik136spin .8s linear infinite" }} />
        <strong>Checking store setup… / جار التحقق من إعداد المتجر…</strong>
        <style>{`@keyframes darik136spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    );
  }

  return children;
}
