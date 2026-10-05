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
      <div className={styles.topAccent} />

      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.logoLink} aria-label="Darik home">
            <img src="/darik-approved-header-logo-390c.png" alt="Darik" className={styles.logoImage} />
          </a>

          <nav className={styles.nav}>
            <a href="/">Home</a>
            <a href="/#all-stores">All Stores</a>
            <a href="/#categories">Categories</a>
            <a href="/#about">About</a>
            <a href="/pricing" className={styles.activeNav}>For Business</a>
          </nav>

          <div className={styles.headerActions}>
            <button type="button" className={styles.locationPill}>
              <span className={styles.pinDot}>●</span>
              Amman, Jordan
              <span className={styles.chevron}>⌄</span>
            </button>
            <button type="button" className={styles.languageButton}>العربية</button>
            <a href="/store-dashboard" className={styles.dashboardButton}>Retailer dashboard</a>
            <a href="/store-signup" className={styles.startButton}>Start your store</a>
          </div>

          <div className={styles.mobileHeader}>
            <button type="button" className={styles.mobileIconButton}>☰</button>
            <img src="/darik-approved-header-logo-390c.png" alt="Darik" className={styles.mobileLogo} />
            <a href="/store-dashboard" className={styles.mobileIconButton}>↗</a>
          </div>
        </div>
      </header>

      <section className={styles.onboardingSection}>
        <div className={styles.onboardingGrid}>
          <div className={styles.storyPanel}>
            <div className={styles.storyCopy}>
              <div className={styles.eyebrow}>RETAILER ONBOARDING / تسجيل المتجر</div>

              <h1 className={styles.heroTitle}>
                <span>Build your</span>
                <span className={styles.heroAccent}>Darik storefront</span>
              </h1>

              <p className={styles.heroLead}>
                Create your Darik retailer account and start your storefront setup journey.
                Reach thousands of customers across Jordan.
              </p>

              <p className={styles.heroArabic} dir="rtl">
                أنشئ حساب التاجر الخاص بك في داريك وابدأ رحلة إعداد متجرك.
                تواصل مع العملاء في جميع أنحاء الأردن.
              </p>

              <div className={styles.progressWrap} aria-label="Retailer onboarding steps">
                <div className={styles.progressLine} />
                <div className={styles.progressStepActive}>
                  <span>1</span>
                  <b>Account</b>
                  <small>الحساب</small>
                </div>
                <div className={styles.progressStep}>
                  <span>2</span>
                  <b>Retail field</b>
                  <small>مجال المتجر</small>
                </div>
                <div className={styles.progressStep}>
                  <span>3</span>
                  <b>Plan</b>
                  <small>الخطة</small>
                </div>
                <div className={styles.progressStep}>
                  <span>4</span>
                  <b>CliQ payment</b>
                  <small>دفع كليك</small>
                </div>
                <div className={styles.progressStep}>
                  <span>5</span>
                  <b>Storefront</b>
                  <small>إنشاء المتجر</small>
                </div>
              </div>

              <div className={styles.benefitList}>
                <div className={styles.benefitRow}>
                  <div className={styles.benefitIcon}>↗</div>
                  <div>
                    <strong>Permanent store link</strong>
                    <p>Your store will have a unique Darik link you can share anywhere.</p>
                    <span dir="rtl">رابط دائم وفريد لمتجرك يمكنك مشاركته في أي مكان.</span>
                  </div>
                </div>

                <div className={styles.benefitRow}>
                  <div className={styles.benefitIcon}>◎</div>
                  <div>
                    <strong>Use the same email for multiple businesses</strong>
                    <p>Manage multiple storefronts while keeping separate Darik usernames.</p>
                    <span dir="rtl">استخدم نفس البريد الإلكتروني لأكثر من نشاط تجاري.</span>
                  </div>
                </div>

                <div className={styles.benefitRow}>
                  <div className={styles.benefitIcon}>⚡</div>
                  <div>
                    <strong>Setup takes only a few minutes</strong>
                    <p>A simple, focused onboarding process built for retailers.</p>
                    <span dir="rtl">عملية إعداد بسيطة وسريعة للتجار.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sceneColumn}>
              <div className={styles.sceneGlow} />
              <img
                src="/darik-signup-395-retailer-scene.jpg"
                alt="Darik retailer"
                className={styles.sceneImage}
              />
            </div>
          </div>

          <div className={styles.formColumn}>
            <section className={styles.card}>
          <div className={styles.cardHeading}>
            <span>ACCOUNT / الحساب</span>
            <h2>Create your retailer account</h2>
            <p>Fill in your details to get started on Darik Marketplace. / أدخل بياناتك للبدء في سوق داريك.</p>
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
                  {usernameState === "checking" ? "Checking… / جار التحقق" : null}
                  {usernameState === "available" ? "✓ Available / متاح" : null}
                  {usernameState === "taken" ? "✕ Taken / غير متاح" : null}
                  {usernameState === "invalid" ? "Check format / تحقق من الصيغة" : null}
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
              {busy ? "Creating account… / جار إنشاء الحساب…" : "Create account / إنشاء الحساب"}
            </button>
          </div>
        </section>
            <div className={styles.cardSignIn}>
              Already have an account?
              <a href="/store-dashboard">Log in / تسجيل الدخول</a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoGrid}>
          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>⌕</div>
            <div>
              <h2>Searchable storefronts</h2>
              <p>Get discovered by customers across Jordan searching for your products and services.</p>
              <strong dir="rtl">متاجر قابلة للبحث في جميع أنحاء الأردن.</strong>
            </div>
          </article>

          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>▰</div>
            <div>
              <h2>Delivery-ready setup</h2>
              <p>Be ready for delivery from day one with integrated storefront tools and settings.</p>
              <strong dir="rtl">جاهز للتوصيل من اليوم الأول.</strong>
            </div>
          </article>

          <article className={styles.infoCard}>
            <div className={styles.infoIconWarm}>▣</div>
            <div>
              <h2>Yearly plans + CliQ activation</h2>
              <p>Choose the yearly plan that fits your catalog and activate it easily with CliQ.</p>
              <strong dir="rtl">خطط سنوية وتفعيل كليك بسهولة.</strong>
            </div>
          </article>
        </div>
      </section>

      <footer className={styles.compactFooter}>
        <div className={styles.footerTop}>
          <img src="/darik-approved-header-logo-390c.png" alt="Darik" className={styles.footerLogo} />

          <div className={styles.footerStatement}>
            <strong>Supporting local businesses. A stronger Jordan.</strong>
            <span dir="rtl">دعم الأعمال المحلية. لأردن أقوى.</span>
          </div>

          <div className={styles.footerLinks}>
            <a href="/terms">Terms</a>
            <span>·</span>
            <a href="/privacy">Privacy</a>
            <span>·</span>
            <a href="/support">Contact / Support</a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 Darik Technologies. All rights reserved.</span>
          <span>Made for Jordan ♥</span>
        </div>
      </footer>

      {/* DARIK_SIGNUP_APPROVED_395C */}
    </main>
  );
}
