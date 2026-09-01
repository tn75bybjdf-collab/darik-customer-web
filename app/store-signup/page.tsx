"use client";

// DARIK_PAYMENT_FIRST_YEARLY_PLANS_CATALOG_GATE_190

/* DARIK_USERNAME_SIGNUP_FORCED_ONBOARDING_136 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./signup.module.css";

type UsernameState = "idle" | "checking" | "available" | "taken" | "invalid";

type AvailabilityResult = {
  available?: boolean;
  valid?: boolean;
  reason?: string;
};

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function usernameLooksValid(value: string) {
  return /^[a-z0-9][a-z0-9_-]{2,29}$/.test(value);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function strongPassword(value: string) {
  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export default function DarikStoreSignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameState, setUsernameState] = useState<UsernameState>("idle");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const cleanUsername = useMemo(() => normalizeUsername(username), [username]);
  const passwordsMatch = Boolean(password) && password === passwordConfirm;
  const emailsMatch = Boolean(email.trim()) && email.trim().toLowerCase() === emailConfirm.trim().toLowerCase();
  const passwordStrong = strongPassword(password);

  useEffect(() => {
    let cancelled = false;

    if (!cleanUsername) {
      setUsernameState("idle");
      return;
    }

    if (!usernameLooksValid(cleanUsername)) {
      setUsernameState("invalid");
      return;
    }

    setUsernameState("checking");

    const timer = window.setTimeout(async () => {
      const { data, error: availabilityError } = await supabase.rpc(
        "darik_direct_username_available_v1",
        { p_username: cleanUsername }
      );

      if (cancelled) return;

      if (availabilityError) {
        setUsernameState("idle");
        return;
      }

      const result = (data ?? {}) as AvailabilityResult;
      setUsernameState(result.available ? "available" : result.valid === false ? "invalid" : "taken");
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cleanUsername]);

  async function createAccount() {
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanEmailConfirm = emailConfirm.trim().toLowerCase();

    if (!usernameLooksValid(cleanUsername)) {
      setError("Choose a valid username before continuing. / اختر اسم مستخدم صالحاً قبل المتابعة.");
      return;
    }

    const { data: availabilityData, error: availabilityError } = await supabase.rpc(
      "darik_direct_username_available_v1",
      { p_username: cleanUsername }
    );

    if (availabilityError) {
      setError(`Could not check the username right now: ${availabilityError.message}`);
      return;
    }

    const availability = (availabilityData ?? {}) as AvailabilityResult;
    if (!availability.available) {
      setUsernameState(availability.valid === false ? "invalid" : "taken");
      setError("That username is not available. Choose another username. / اسم المستخدم غير متاح. اختر اسماً آخر.");
      return;
    }

    if (!validEmail(cleanEmail)) {
      setError("Enter a valid email address. / أدخل بريداً إلكترونياً صالحاً.");
      return;
    }

    if (cleanEmail !== cleanEmailConfirm) {
      setError("The email addresses do not match. / البريدان الإلكترونيان غير متطابقين.");
      return;
    }

    if (!strongPassword(password)) {
      setError("Password needs 8+ characters, uppercase, lowercase, and a special character. / كلمة المرور تحتاج ٨ أحرف على الأقل وحرفاً كبيراً وصغيراً ورمزاً خاصاً.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("The passwords do not match. / كلمتا المرور غير متطابقتين.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/retailer-accounts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          contactEmail: cleanEmail,
          password,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        if (response.status === 409) setUsernameState("taken");
        throw new Error(payload.error || "Could not create the Darik retailer account.");
      }

      const { data: identityData, error: identityError } = await supabase.rpc(
        "darik_direct_username_login_identity_v1",
        { p_username: cleanUsername }
      );

      if (identityError || typeof identityData !== "string" || !identityData) {
        throw new Error(identityError?.message || "Account created, but Darik could not resolve the new login identity.");
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: identityData,
        password,
      });

      if (signInError || !signInData.session) {
        throw new Error(signInError?.message || "Account created, but Darik could not start the new session.");
      }

      router.replace("/store-dashboard/setup-field");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the Darik retailer account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.brand}>Darik Direct</div>
            <h1>Create your retailer account</h1>
            <p>
              Your username is your Darik login. Your email can be reused for another business account.
              <span> اسم المستخدم هو تسجيل دخولك في داريك، ويمكن استخدام نفس البريد لأكثر من نشاط تجاري.</span>
            </p>
          </div>
          <a className={styles.signInLink} href="/store-dashboard">Already registered? Sign in / لديك حساب؟</a>
        </header>

        <section className={styles.card}>
          <div className={styles.cardHeading}>
            <span>ACCOUNT / الحساب</span>
            <h2>Create your Darik login</h2>
            <p>After signup, choose your retail field and yearly plan, then submit CliQ before storefront setup. / بعد التسجيل اختر مجال المتجر والخطة السنوية ثم أرسل دفعة كليك قبل إعداد الواجهة.</p>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.fullWidth}>
              <span>Username / اسم المستخدم</span>
              <div className={styles.usernameWrap}>
                <input
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={(event) => setUsername(event.target.value.toLowerCase())}
                  placeholder="example: salehauto"
                  maxLength={30}
                />
                <span className={`${styles.usernameBadge} ${styles[usernameState]}`}>
                  {usernameState === "checking" ? "Checking…" : null}
                  {usernameState === "available" ? "✓ Available" : null}
                  {usernameState === "taken" ? "✕ Taken" : null}
                  {usernameState === "invalid" ? "Check format" : null}
                </span>
              </div>
              <small>3–30 characters: letters, numbers, _ or -. / من ٣ إلى ٣٠ حرفاً أو رقماً.</small>
            </label>

            <label>
              <span>Email / البريد الإلكتروني</span>
              <input
                type="email"
                autoCapitalize="none"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="owner@example.com"
              />
            </label>

            <label>
              <span>Confirm email / تأكيد البريد الإلكتروني</span>
              <input
                type="email"
                autoCapitalize="none"
                value={emailConfirm}
                onChange={(event) => setEmailConfirm(event.target.value)}
                placeholder="owner@example.com"
              />
              {emailConfirm ? <small className={emailsMatch ? styles.good : styles.bad}>{emailsMatch ? "✓ Emails match" : "Emails do not match"}</small> : null}
            </label>

            <label>
              <span>Password / كلمة المرور</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
              {password ? <small className={passwordStrong ? styles.good : styles.bad}>{passwordStrong ? "✓ Strong enough" : "8+ chars, upper, lower, special"}</small> : null}
            </label>

            <label>
              <span>Confirm password / تأكيد كلمة المرور</span>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                autoComplete="new-password"
              />
              {passwordConfirm ? <small className={passwordsMatch ? styles.good : styles.bad}>{passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}</small> : null}
            </label>
          </div>

          <div className={styles.notice}>
            <strong>What happens next?</strong>
            <span>You will choose your Retail Field, choose a yearly plan, send CliQ, then build the storefront while Darik reviews the payment.</span>
            <span dir="rtl">بعد التسجيل ستختار مجال المتجر ثم الخطة السنوية وترسل دفعة CliQ، وبعدها تبدأ إعداد الواجهة أثناء مراجعة الدفعة.</span>
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              type="button"
              disabled={busy || usernameState !== "available"}
              onClick={createAccount}
            >
              {busy ? "Creating account… / جار إنشاء الحساب…" : "Sign up today / سجّل اليوم"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
