"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Purchase = {
  id: string;
  amount: number;
  note: string | null;
  purchase_date: string;
  created_at: string;
};

const DAILY_LIMIT = 20;
const START_DATE_KEY = "darik-budget-start-date";
const SECRET_PIN = "1122";
const PASSKEY_ENABLED_KEY = "darik-budget-passkey-enabled";
const PASSKEY_CREDENTIAL_ID_KEY = "darik-budget-passkey-credential-id";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysInclusive(startDate: string, endDate: string) {
  const start = parseLocalDate(startDate).getTime();
  const end = parseLocalDate(endDate).getTime();
  const diff = Math.floor((end - start) / 86400000);
  return Math.max(diff + 1, 1);
}

function formatJod(value: number) {
  return `${value.toFixed(2)} JOD`;
}


function bufferToBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBuffer(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function randomChallenge(length = 32) {
  const challenge = new Uint8Array(length);
  window.crypto.getRandomValues(challenge);
  return challenge;
}

function isPasskeySupported() {
  return typeof window !== "undefined" && !!window.PublicKeyCredential && !!navigator.credentials;
}

export default function BudgetPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyEnabled, setPasskeyEnabled] = useState(false);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [startDate, setStartDate] = useState(todayKey());
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPasskeySupported(isPasskeySupported());
    setPasskeyEnabled(window.localStorage.getItem(PASSKEY_ENABLED_KEY) === "true");
  }, []);

  async function loadPurchases() {
    setLoading(true);

    const savedStart = window.localStorage.getItem(START_DATE_KEY);
    if (savedStart) {
      setStartDate(savedStart);
    } else {
      window.localStorage.setItem(START_DATE_KEY, todayKey());
    }

    const { data, error } = await supabase
      .from("personal_budget_purchases")
      .select("*")
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setPurchases((data ?? []) as Purchase[]);
    setLoading(false);
  }

  useEffect(() => {
    if (!unlocked) return;
    loadPurchases();
  }, [unlocked]);

  const stats = useMemo(() => {
    const today = todayKey();
    const activeDays = daysInclusive(startDate, today);
    const totalAllowed = activeDays * DAILY_LIMIT;
    const totalSpent = purchases.reduce(
      (sum, purchase) => sum + Number(purchase.amount || 0),
      0
    );
    const availableNow = totalAllowed - totalSpent;

    const spentToday = purchases
      .filter((purchase) => purchase.purchase_date === today)
      .reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);

    const tomorrowAllowed = availableNow + DAILY_LIMIT;

    return {
      today,
      activeDays,
      totalAllowed,
      totalSpent,
      availableNow,
      spentToday,
      tomorrowAllowed,
    };
  }, [startDate, purchases]);

  function unlockBudget() {
    if (pin !== SECRET_PIN) {
      alert("Wrong PIN.");
      return;
    }

    setUnlocked(true);
  }

  async function enableFaceIdUnlock() {
    if (!isPasskeySupported()) {
      alert("This browser does not support Face ID / passkeys.");
      return;
    }

    setPasskeyBusy(true);

    try {
      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge: randomChallenge(),
          rp: {
            name: "Darik Budget",
          },
          user: {
            id: randomChallenge(16),
            name: "jihad-budget",
            displayName: "Jihad Budget",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: {
            userVerification: "required",
            residentKey: "preferred",
          },
          timeout: 60000,
          attestation: "none",
        },
      })) as PublicKeyCredential | null;

      if (!credential) {
        alert("Face ID setup was cancelled.");
        setPasskeyBusy(false);
        return;
      }

      window.localStorage.setItem(
        PASSKEY_CREDENTIAL_ID_KEY,
        bufferToBase64Url(credential.rawId)
      );
      window.localStorage.setItem(PASSKEY_ENABLED_KEY, "true");
      setPasskeyEnabled(true);
      alert("Face ID unlock enabled.");
    } catch (error) {
      console.log("PASSKEY CREATE ERROR:", error);
      alert("Could not enable Face ID. Try again from Safari/Chrome on your phone.");
    } finally {
      setPasskeyBusy(false);
    }
  }

  async function unlockWithFaceId() {
    if (!isPasskeySupported()) {
      alert("This browser does not support Face ID / passkeys.");
      return;
    }

    const credentialId = window.localStorage.getItem(PASSKEY_CREDENTIAL_ID_KEY);

    if (!credentialId) {
      alert("Face ID is not enabled yet. Unlock with PIN first, then enable Face ID.");
      return;
    }

    setPasskeyBusy(true);

    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: randomChallenge(),
          allowCredentials: [
            {
              type: "public-key",
              id: base64UrlToBuffer(credentialId),
            },
          ],
          userVerification: "required",
          timeout: 60000,
        },
      });

      if (!credential) {
        alert("Face ID unlock was cancelled.");
        setPasskeyBusy(false);
        return;
      }

      setUnlocked(true);
    } catch (error) {
      console.log("PASSKEY UNLOCK ERROR:", error);
      alert("Face ID unlock failed. Use PIN instead.");
    } finally {
      setPasskeyBusy(false);
    }
  }

  function disableFaceIdUnlock() {
    const confirmed = window.confirm("Disable Face ID unlock on this device?");
    if (!confirmed) return;

    window.localStorage.removeItem(PASSKEY_ENABLED_KEY);
    window.localStorage.removeItem(PASSKEY_CREDENTIAL_ID_KEY);
    setPasskeyEnabled(false);
  }

  async function addPurchase() {
    const cleanAmount = Number(amount);

    if (!cleanAmount || cleanAmount <= 0) {
      alert("Enter how much you spent.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("personal_budget_purchases").insert({
      amount: cleanAmount,
      note: note.trim() || null,
      purchase_date: todayKey(),
    });

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setAmount("");
    setNote("");
    await loadPurchases();
    setSaving(false);
  }

  async function deletePurchase(id: string) {
    const confirmed = window.confirm("Delete this purchase?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("personal_budget_purchases")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setPurchases((current) => current.filter((purchase) => purchase.id !== id));
  }

  async function resetBudget() {
    const confirmed = window.confirm(
      "Reset everything? This deletes all budget purchases and restarts today."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("personal_budget_purchases")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      alert(error.message);
      return;
    }

    const newStart = todayKey();
    window.localStorage.setItem(START_DATE_KEY, newStart);
    setStartDate(newStart);
    setPurchases([]);
    setAmount("");
    setNote("");
  }

  if (!unlocked) {
    return (
      <main style={styles.page}>
        <section style={styles.phone}>
          <section style={styles.lockCard}>
            <p style={styles.kicker}>Private Tool</p>
            <h1 style={styles.title}>Budget Calculator</h1>
            <p style={styles.lockText}>Enter PIN to open your personal budget.</p>

            <input
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              type="password"
              inputMode="numeric"
              placeholder="PIN"
              style={styles.pinInput}
              onKeyDown={(event) => {
                if (event.key === "Enter") unlockBudget();
              }}
            />

            <button style={styles.primaryButton} onClick={unlockBudget}>
              Unlock with PIN
            </button>

            {passkeySupported && passkeyEnabled ? (
              <>
                <div style={styles.orLine}>
                  <span style={styles.orLineBar} />
                  <span style={styles.orLineText}>or</span>
                  <span style={styles.orLineBar} />
                </div>

                <button
                  style={styles.faceIdButton}
                  onClick={unlockWithFaceId}
                  disabled={passkeyBusy}
                >
                  {passkeyBusy ? "Opening..." : "Unlock with Face ID"}
                </button>
              </>
            ) : null}
          </section>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.phone}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Private Budget</p>
            <h1 style={styles.title}>Daily 10 JOD Limit</h1>
          </div>

          <div style={styles.headerButtons}>
            {passkeySupported ? (
              passkeyEnabled ? (
                <button style={styles.resetButton} onClick={disableFaceIdUnlock}>
                  Face ID On
                </button>
              ) : (
                <button
                  style={styles.resetButton}
                  onClick={enableFaceIdUnlock}
                  disabled={passkeyBusy}
                >
                  {passkeyBusy ? "..." : "Enable Face ID"}
                </button>
              )
            ) : null}

            <button style={styles.resetButton} onClick={resetBudget}>
              Reset
            </button>
          </div>
        </div>

        <section style={styles.balanceCard}>
          <p style={styles.balanceLabel}>Available right now</p>
          <h2
            style={{
              ...styles.balanceAmount,
              color: stats.availableNow >= 0 ? "#FFFFFF" : "#FEE2E2",
            }}
          >
            {formatJod(stats.availableNow)}
          </h2>

          <div style={styles.balanceGrid}>
            <div style={styles.balanceMini}>
              <p style={styles.miniLabel}>Daily limit</p>
              <p style={styles.miniValue}>{DAILY_LIMIT} JOD</p>
            </div>

            <div style={styles.balanceMini}>
              <p style={styles.miniLabel}>Spent today</p>
              <p style={styles.miniValue}>{formatJod(stats.spentToday)}</p>
            </div>
          </div>

          <p style={styles.rolloverText}>
            Tomorrow you start with{" "}
            <strong>{formatJod(stats.tomorrowAllowed)}</strong> before spending.
          </p>
        </section>

        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Add purchase</h3>

          <label style={styles.label}>Amount spent</label>
          <div style={styles.inputRow}>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              inputMode="decimal"
              placeholder="Example: 5"
              style={styles.amountInput}
            />
            <span style={styles.currencyPill}>JOD</span>
          </div>

          <label style={styles.label}>Note optional</label>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            type="text"
            placeholder="Coffee, gas, snack..."
            style={styles.textInput}
          />

          <button style={styles.primaryButton} onClick={addPurchase} disabled={saving}>
            {saving ? "Saving..." : "Save Purchase"}
          </button>
        </section>

        <section style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Days</p>
            <p style={styles.statValue}>{stats.activeDays}</p>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Allowed</p>
            <p style={styles.statValue}>{formatJod(stats.totalAllowed)}</p>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Spent</p>
            <p style={styles.statValue}>{formatJod(stats.totalSpent)}</p>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.sectionTop}>
            <h3 style={styles.cardTitle}>Recent purchases</h3>
            <p style={styles.countText}>{purchases.length}</p>
          </div>

          {loading ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyTitle}>Loading...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyTitle}>No purchases yet</p>
              <p style={styles.emptyText}>
                Spend less than 10 JOD today and the unused amount rolls into tomorrow.
              </p>
            </div>
          ) : (
            <div style={styles.purchaseList}>
              {purchases.map((purchase) => (
                <div key={purchase.id} style={styles.purchaseItem}>
                  <div style={styles.purchaseLeft}>
                    <p style={styles.purchaseAmount}>
                      {formatJod(Number(purchase.amount))}
                    </p>
                    <p style={styles.purchaseNote}>
                      {purchase.note || "No note"} • {purchase.purchase_date}
                    </p>
                  </div>

                  <button
                    style={styles.deleteButton}
                    onClick={() => deletePurchase(purchase.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h3 style={styles.cardTitle}>How it works</h3>
          <p style={styles.explainText}>
            You get <strong>10 JOD per day</strong>. Whatever you do not spend rolls forward.
            If you spend 5 JOD today, tomorrow you can spend 15 JOD. Spend 5 JOD tomorrow,
            then the next day you can spend 20 JOD.
          </p>
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(11, 99, 246, 0.18), transparent 36%), #0B1220",
    padding: "14px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    color: "#111827",
  },
  phone: {
    width: "100%",
    maxWidth: "430px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 2px 2px",
  },
  kicker: {
    margin: 0,
    color: "#93C5FD",
    fontSize: "12px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  title: {
    margin: "4px 0 0",
    color: "#FFFFFF",
    fontSize: "25px",
    fontWeight: 950,
    lineHeight: 1.05,
  },
  lockCard: {
    marginTop: "80px",
    background: "#FFFFFF",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
  },
  lockText: {
    margin: "10px 0 14px",
    color: "#6B7280",
    fontSize: "14px",
    fontWeight: 750,
  },
  pinInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    borderRadius: "16px",
    padding: "15px",
    fontSize: "18px",
    fontWeight: 900,
    outline: "none",
    textAlign: "center",
  },
  headerButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "flex-end",
  },
  resetButton: {
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  balanceCard: {
    background: "linear-gradient(135deg, #0B63F6, #0647B8)",
    borderRadius: "28px",
    padding: "20px",
    color: "#FFFFFF",
    boxShadow: "0 20px 40px rgba(11,99,246,0.30)",
  },
  balanceLabel: {
    margin: 0,
    color: "#DCEBFF",
    fontSize: "13px",
    fontWeight: 800,
  },
  balanceAmount: {
    margin: "8px 0 16px",
    fontSize: "44px",
    fontWeight: 950,
    letterSpacing: "-1.5px",
  },
  balanceGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  balanceMini: {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "18px",
    padding: "12px",
  },
  miniLabel: {
    margin: 0,
    color: "#DCEBFF",
    fontSize: "11px",
    fontWeight: 800,
  },
  miniValue: {
    margin: "5px 0 0",
    color: "#FFFFFF",
    fontSize: "17px",
    fontWeight: 950,
  },
  rolloverText: {
    margin: "14px 0 0",
    color: "#EFF6FF",
    fontSize: "13px",
    fontWeight: 750,
    lineHeight: 1.45,
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "24px",
    padding: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },
  cardTitle: {
    margin: "0 0 12px",
    color: "#111827",
    fontSize: "18px",
    fontWeight: 950,
  },
  label: {
    display: "block",
    margin: "12px 0 7px",
    color: "#374151",
    fontSize: "12px",
    fontWeight: 900,
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
    width: "100%",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    borderRadius: "16px",
    padding: "14px 14px",
    fontSize: "18px",
    fontWeight: 900,
    outline: "none",
  },
  currencyPill: {
    background: "#EFF6FF",
    color: "#0B63F6",
    borderRadius: "999px",
    padding: "12px 13px",
    fontSize: "13px",
    fontWeight: 950,
  },
  textInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    borderRadius: "16px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 750,
    outline: "none",
  },
  primaryButton: {
    width: "100%",
    marginTop: "14px",
    border: 0,
    background: "#0B63F6",
    color: "#FFFFFF",
    borderRadius: "18px",
    padding: "15px",
    fontSize: "15px",
    fontWeight: 950,
    cursor: "pointer",
  },
  faceIdButton: {
    width: "100%",
    border: "1px solid #BFDBFE",
    background: "#EFF6FF",
    color: "#0B63F6",
    borderRadius: "18px",
    padding: "15px",
    fontSize: "15px",
    fontWeight: 950,
    cursor: "pointer",
  },
  orLine: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "14px 0",
  },
  orLineBar: {
    flex: 1,
    height: "1px",
    background: "#E5E7EB",
  },
  orLineText: {
    color: "#9CA3AF",
    fontSize: "12px",
    fontWeight: 900,
    textTransform: "uppercase",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
  },
  statCard: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "18px",
    padding: "12px 9px",
    textAlign: "center",
  },
  statLabel: {
    margin: 0,
    color: "#6B7280",
    fontSize: "10px",
    fontWeight: 900,
  },
  statValue: {
    margin: "6px 0 0",
    color: "#111827",
    fontSize: "14px",
    fontWeight: 950,
  },
  sectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  countText: {
    margin: 0,
    background: "#F3F4F6",
    color: "#6B7280",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 900,
  },
  emptyBox: {
    background: "#F9FAFB",
    border: "1px dashed #D1D5DB",
    borderRadius: "18px",
    padding: "16px",
  },
  emptyTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "15px",
    fontWeight: 950,
  },
  emptyText: {
    margin: "6px 0 0",
    color: "#6B7280",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.45,
  },
  purchaseList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  purchaseItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "18px",
    padding: "12px",
  },
  purchaseLeft: {
    minWidth: 0,
  },
  purchaseAmount: {
    margin: 0,
    color: "#111827",
    fontSize: "16px",
    fontWeight: 950,
  },
  purchaseNote: {
    margin: "4px 0 0",
    color: "#6B7280",
    fontSize: "12px",
    fontWeight: 750,
    overflowWrap: "anywhere",
  },
  deleteButton: {
    border: "1px solid #FECACA",
    background: "#FEF2F2",
    color: "#DC2626",
    borderRadius: "999px",
    padding: "9px 11px",
    fontSize: "12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  explainText: {
    margin: 0,
    color: "#4B5563",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.55,
  },
};