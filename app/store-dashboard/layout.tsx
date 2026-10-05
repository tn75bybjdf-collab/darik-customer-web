"use client";

/* DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136 */
/* DARIK_ONBOARDING_GATE_STABILITY_139 */
/* DARIK_PAYMENT_ROUTE_AND_PENDING_SETUP_ACCESS_208 */

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";

type OnboardingState = {
  managed_account?: boolean;
  field_selected?: boolean;
  setup_completed?: boolean;
  getting_started_status?: string;
};

function destinationFor139(pathname: string, state: OnboardingState) {
  if (!state.managed_account) return null;

  if (!state.field_selected) {
    return pathname === "/store-dashboard/setup-field"
      ? null
      : "/store-dashboard/setup-field";
  }

  // FRONTEND 208:
  // Plan & Payment must remain reachable as soon as the retail field has been
  // selected. The previous gate redirected /activation straight back to
  // /storefront whenever setup_completed=false, creating the visible loop.
  //
  // This route also stays reachable after Finish Store Setup so a retailer can
  // check a pending/rejected payment or submit a replacement receipt.
  if (pathname === "/store-dashboard/activation") {
    return null;
  }

  if (!state.setup_completed) {
    // Storefront is the only setup route besides Plan & Payment.
    // FRONTEND 206 separately verifies that an activation/payment request
    // exists before the storefront setup wizard is allowed to continue.
    return pathname === "/store-dashboard/storefront"
      ? null
      : "/store-dashboard/storefront";
  }

  if (state.getting_started_status === "pending") {
    // Finishing setup must not make the pending-payment storefront inaccessible.
    // Keep both storefront editing and Plan & Payment reachable while the normal
    // Getting Started step remains the default destination for other routes.
    if (
      pathname === "/store-dashboard/storefront" ||
      pathname === "/store-dashboard/getting-started"
    ) {
      return null;
    }

    return "/store-dashboard/getting-started";
  }

  if (
    pathname === "/store-dashboard/setup-field" ||
    pathname === "/store-dashboard/getting-started"
  ) {
    return "/store-dashboard";
  }

  return null;
}

export default function StoreDashboardOnboardingGate136({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // DARIK_RETAILER_DASHBOARD_ALWAYS_VISIBLE_WHATSAPP_319B
  useEffect(() => {
    const buttonId319B =
      "darik-retailer-dashboard-whatsapp-319b";

    const existing319B =
      document.getElementById(
        buttonId319B
      );

    if (existing319B) {
      return;
    }

    const supportNumber319B =
      "962793009420";

    const supportMessage319B =
      "Hello Darik Support / مرحباً دعم داريك";

    const link319B =
      document.createElement(
        "a"
      );

    link319B.id =
      buttonId319B;

    link319B.href =
      "https://wa.me/" +
      supportNumber319B +
      "?text=" +
      encodeURIComponent(
        supportMessage319B
      );

    link319B.target =
      "_blank";

    link319B.rel =
      "noopener noreferrer";

    link319B.setAttribute(
      "aria-label",
      "WhatsApp Darik Support / واتساب دعم داريك"
    );

    link319B.title =
      "WhatsApp Darik Support / واتساب دعم داريك";

    link319B.style.position =
      "fixed";

    link319B.style.right =
      "16px";

    link319B.style.bottom =
      "max(18px, env(safe-area-inset-bottom))";

    link319B.style.zIndex =
      "2147483000";

    link319B.style.display =
      "inline-flex";

    link319B.style.alignItems =
      "center";

    link319B.style.justifyContent =
      "center";

    link319B.style.gap =
      "8px";

    link319B.style.minHeight =
      "44px";

    link319B.style.padding =
      "0 14px";

    link319B.style.borderRadius =
      "999px";

    link319B.style.background =
      "#25D366";

    link319B.style.color =
      "#ffffff";

    link319B.style.textDecoration =
      "none";

    link319B.style.fontFamily =
      "Arial, sans-serif";

    link319B.style.fontSize =
      "14px";

    link319B.style.fontWeight =
      "800";

    link319B.style.lineHeight =
      "1";

    link319B.style.boxShadow =
      "0 8px 24px rgba(0, 0, 0, 0.24)";

    link319B.style.border =
      "1px solid rgba(255,255,255,0.28)";

    link319B.style.cursor =
      "pointer";

    link319B.style.setProperty(
      "-webkit-tap-highlight-color",
      "transparent"
    );

    link319B.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style="display:block;flex:0 0 auto"><path fill="currentColor" d="M16.01 3C8.83 3 3 8.72 3 15.77c0 2.25.6 4.45 1.73 6.38L3 29l7.05-1.82a13.12 13.12 0 0 0 5.95 1.44h.01C23.19 28.62 29 22.9 29 15.85 29 8.79 23.19 3 16.01 3Zm0 23.46h-.01a10.9 10.9 0 0 1-5.55-1.5l-.4-.24-4.18 1.08 1.12-4.02-.26-.41a10.5 10.5 0 0 1-1.66-5.6c0-5.86 4.91-10.63 10.95-10.63 6.03 0 10.94 4.78 10.94 10.71 0 5.86-4.91 10.61-10.95 10.61Zm6-7.95c-.33-.16-1.96-.95-2.26-1.06-.3-.11-.52-.16-.74.16-.22.32-.85 1.06-1.04 1.27-.19.21-.38.24-.71.08-.33-.16-1.39-.5-2.65-1.6-.98-.85-1.64-1.91-1.83-2.23-.19-.32-.02-.5.14-.66.15-.14.33-.37.49-.56.16-.19.22-.32.33-.53.11-.21.05-.4-.03-.56-.08-.16-.74-1.75-1.01-2.4-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.4-.3.32-1.15 1.11-1.15 2.7 0 1.59 1.18 3.13 1.34 3.34.16.21 2.31 3.47 5.6 4.87.78.33 1.39.53 1.87.68.78.24 1.49.21 2.05.13.63-.09 1.96-.79 2.23-1.56.27-.77.27-1.43.19-1.56-.08-.13-.3-.21-.63-.37Z"/></svg>' +
      '<span>WhatsApp</span>';

    const pressDown319B =
      () => {
        link319B.style.transform =
          "scale(0.97)";
      };

    const pressUp319B =
      () => {
        link319B.style.transform =
          "scale(1)";
      };

    link319B.addEventListener(
      "pointerdown",
      pressDown319B
    );

    link319B.addEventListener(
      "pointerup",
      pressUp319B
    );

    link319B.addEventListener(
      "pointercancel",
      pressUp319B
    );

    link319B.addEventListener(
      "pointerleave",
      pressUp319B
    );

    document.body.appendChild(
      link319B
    );

    return () => {
      link319B.removeEventListener(
        "pointerdown",
        pressDown319B
      );

      link319B.removeEventListener(
        "pointerup",
        pressUp319B
      );

      link319B.removeEventListener(
        "pointercancel",
        pressUp319B
      );

      link319B.removeEventListener(
        "pointerleave",
        pressUp319B
      );

      link319B.remove();
    };
  }, []);
  const router = useRouter();

  const [blocked, setBlocked] = useState(true);
  const [gateError, setGateError] = useState("");

  const activeCheckRef = useRef(0);
  const knownAuthUserIdRef = useRef<string | null | undefined>(undefined);

  const checkGate139 = useCallback(
    async (showBlockingState: boolean) => {
      const checkNumber = ++activeCheckRef.current;

      if (showBlockingState) {
        setBlocked(true);
      }
      setGateError("");

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (checkNumber !== activeCheckRef.current) return;

      if (sessionError) {
        setGateError(
          "Could not verify your Darik session. Refresh this page and try again."
        );
        setBlocked(false);
        return;
      }

      const session = sessionData.session;
      knownAuthUserIdRef.current = session?.user.id ?? null;

      if (!session) {
        if (pathname !== "/store-dashboard") {
          setBlocked(true);
          router.replace("/store-dashboard");
          return;
        }

        setBlocked(false);
        return;
      }

      const { data, error } = await supabase.rpc(
        "darik_direct_get_my_onboarding_v1"
      );

      if (checkNumber !== activeCheckRef.current) return;

      if (error) {
        console.error("Darik onboarding gate failed:", error.message);
        setGateError(
          "Darik could not verify store setup. Refresh this page and try again."
        );
        setBlocked(false);
        return;
      }

      const state = (data ?? {}) as OnboardingState;
      const destination = destinationFor139(pathname, state);

      if (destination && destination !== pathname) {
        setBlocked(true);
        router.replace(destination);
        return;
      }

      setBlocked(false);
    },
    [pathname, router]
  );

  /* Route changes are the normal reason to re-check setup state.
     This runs once per dashboard route transition. */
  useEffect(() => {
    void checkGate139(true);
  }, [checkGate139]);

  /* IMPORTANT:
     Do NOT re-run the onboarding RPC for every Supabase auth event.

     Supabase may emit INITIAL_SESSION, TOKEN_REFRESHED, USER_UPDATED, and
     even SIGNED_IN again for the same already-authenticated user.

     We only care when the actual authenticated USER ID changes.
     This prevents the entire dashboard from repeatedly returning to the
     "Checking store setup" loading screen while the storefront preview is open.
  */
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED" ||
          event === "PASSWORD_RECOVERY"
        ) {
          return;
        }

        const nextUserId = session?.user.id ?? null;
        const previousUserId = knownAuthUserIdRef.current;

        if (event === "SIGNED_IN") {
          if (previousUserId === nextUserId) {
            return;
          }

          knownAuthUserIdRef.current = nextUserId;
          window.setTimeout(() => {
            void checkGate139(true);
          }, 0);
          return;
        }

        if (event === "SIGNED_OUT") {
          if (previousUserId === null) {
            return;
          }

          knownAuthUserIdRef.current = null;
          window.setTimeout(() => {
            void checkGate139(true);
          }, 0);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkGate139]);

  if (gateError) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f7f7f3",
          color: "#111",
          padding: 20,
        }}
      >
        <section
          style={{
            width: "min(520px, 100%)",
            border: "1px solid #deded7",
            borderRadius: 22,
            background: "#fff",
            padding: 24,
            boxShadow: "0 20px 60px rgba(17,17,17,.08)",
          }}
        >
          <strong style={{ display: "block", fontSize: 18 }}>
            Store setup check failed / تعذر التحقق من إعداد المتجر
          </strong>
          <p style={{ color: "#666", lineHeight: 1.6 }}>{gateError}</p>
          <button
            type="button"
            onClick={() => void checkGate139(true)}
            style={{
              minHeight: 46,
              border: 0,
              borderRadius: 12,
              background: "#111",
              color: "#ffd23f",
              padding: "0 18px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Try again / حاول مرة أخرى
          </button>
        </section>
      </main>
    );
  }

  if (blocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          alignContent: "center",
          gap: 12,
          background: "#f7f7f3",
          color: "#111",
          padding: 20,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            border: "3px solid #deded7",
            borderTopColor: "#111",
            borderRadius: "50%",
            animation: "darik139spin .8s linear infinite",
          }}
        />
        <strong>
          Checking store setup… / جار التحقق من إعداد المتجر…
        </strong>
        <style>
          {`@keyframes darik139spin{to{transform:rotate(360deg)}}`}
        </style>
      </main>
    );
  }

  return children;
}
