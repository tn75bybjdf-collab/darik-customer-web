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
