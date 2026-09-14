"use client";

/* DARIK_STANDALONE_CUSTOMER_CREATE_ACCOUNT_383 */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./createAccount.module.css";

type SignupStep383 = "details" | "email_code" | "phone_code" | "success" | "already";

type DarikCustomerProfile383 = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
};

function normalizeDarikCustomerPhone383(rawPhone: string) {
  const digits = String(rawPhone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("962")) return "+" + digits;
  if (digits.startsWith("0") && digits.length >= 9) {
    return "+962" + digits.slice(1);
  }
  if (digits.length === 9 && digits.startsWith("7")) {
    return "+962" + digits;
  }
  if (String(rawPhone ?? "").trim().startsWith("+")) {
    return String(rawPhone ?? "").trim();
  }
  return "+" + digits;
}

function validateStrongDarikCustomerPassword383(password: string) {
  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export default function CreateDarikCustomerAccount383() {
  const [step, setStep] = useState<SignupStep383>("details");
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");
  const [nonCustomerSession, setNonCustomerSession] = useState(false);
  const [existingProfile, setExistingProfile] = useState<DarikCustomerProfile383 | null>(null);
  const [pendingPhoneSession, setPendingPhoneSession] = useState<Session | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneConfirm, setPhoneConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  useEffect(() => {
    document.title = "Create Darik Account | GetDarik.com";

    let active = true;

    void (async () => {
      try {
        const current = await supabase.auth.getSession();
        const user = current.data.session?.user;

        if (!active || !user?.id) return;

        const profileResult = await supabase
          .from("customers")
          .select("id,auth_user_id,email,full_name,phone")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (!active) return;

        if (!profileResult.error && profileResult.data?.id) {
          const profile = profileResult.data as DarikCustomerProfile383;
          setExistingProfile(profile);
          setStep("already");
          return;
        }

        setNonCustomerSession(true);
      } finally {
        if (active) setCheckingSession(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  async function readCustomerProfile383(user: User) {
    const result = await supabase
      .from("customers")
      .select("id,auth_user_id,email,full_name,phone")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (result.error) throw result.error;
    return (result.data as DarikCustomerProfile383 | null) ?? null;
  }

  async function ensureCustomerProfile383(
    user: User,
    fallbackName: string,
    fallbackPhone: string
  ) {
    const existing = await readCustomerProfile383(user);
    if (existing?.id) return existing;

    const normalizedPhone = normalizeDarikCustomerPhone383(
      fallbackPhone || String(user.user_metadata?.phone ?? "")
    );
    const fullName = String(
      fallbackName || user.user_metadata?.full_name || user.email || ""
    ).trim();

    if (!normalizedPhone) {
      throw new Error("Darik could not finish the customer phone profile.");
    }

    const rpcResult = await supabase.rpc("customer_ensure_profile_v1", {
      p_email: String(user.email ?? "").trim().toLowerCase(),
      p_full_name: fullName,
      p_phone: normalizedPhone,
    });

    if (rpcResult.error || !rpcResult.data) {
      throw rpcResult.error ?? new Error("Could not finish the Darik customer profile.");
    }

    const rpcRow = Array.isArray(rpcResult.data)
      ? rpcResult.data[0]
      : rpcResult.data;
    const profile = ((rpcRow as any)?.profile ?? rpcRow) as DarikCustomerProfile383;

    if (!profile?.id) {
      throw new Error("Darik customer profile was not returned.");
    }

    return profile;
  }

  function validatedDetails383() {
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const fullName = `${cleanFirstName} ${cleanLastName}`.replace(/\s+/g, " ").trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanEmailConfirm = emailConfirm.trim().toLowerCase();
    const cleanPhone = normalizeDarikCustomerPhone383(phone);
    const cleanPhoneConfirm = normalizeDarikCustomerPhone383(phoneConfirm);

    if (!cleanFirstName || !cleanLastName) {
      setMessage("Enter your first and last name. / أدخل الاسم الأول واسم العائلة.");
      return null;
    }

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setMessage("Enter a valid email address. / أدخل بريداً إلكترونياً صحيحاً.");
      return null;
    }

    if (cleanEmail !== cleanEmailConfirm) {
      setMessage("Email addresses do not match. / البريدان الإلكترونيان غير متطابقين.");
      return null;
    }

    if (cleanPhone.length < 8) {
      setMessage("Enter a valid phone number. / أدخل رقم هاتف صحيحاً.");
      return null;
    }

    if (cleanPhone !== cleanPhoneConfirm) {
      setMessage("Phone numbers do not match. / رقما الهاتف غير متطابقين.");
      return null;
    }

    if (!validateStrongDarikCustomerPassword383(password)) {
      setMessage(
        "Password must be at least 8 characters and include a capital letter, number, and special character. / يجب أن تكون كلمة المرور 8 خانات على الأقل وتحتوي على حرف كبير ورقم ورمز خاص."
      );
      return null;
    }

    if (password !== passwordConfirm) {
      setMessage("Passwords do not match. / كلمتا المرور غير متطابقتين.");
      return null;
    }

    return {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      name: fullName,
      email: cleanEmail,
      phone: cleanPhone,
    };
  }

  async function clearNonCustomerAuth383() {
    const current = await supabase.auth.getSession();
    const currentUser = current.data.session?.user;
    if (!currentUser?.id) return;

    const customer = await readCustomerProfile383(currentUser);
    if (customer?.id) {
      setExistingProfile(customer);
      setStep("already");
      throw new Error("This browser is already signed in to a Darik customer account.");
    }

    const signedOut = await supabase.auth.signOut();
    if (signedOut.error) throw signedOut.error;
    setNonCustomerSession(false);
  }

  async function startSignup383(event?: FormEvent) {
    event?.preventDefault();
    const details = validatedDetails383();
    if (!details) return;

    setBusy(true);
    setMessage("");

    try {
      await clearNonCustomerAuth383();

      const availability = await supabase.rpc("customer_can_signup_v37", {
        p_email: details.email,
        p_phone: details.phone,
      });

      if (availability.error) throw availability.error;

      const availabilityRow = Array.isArray(availability.data)
        ? availability.data[0]
        : availability.data;

      if ((availabilityRow as any)?.allowed === false) {
        throw new Error(
          String(
            (availabilityRow as any)?.reason ||
              "This email or phone number is already registered."
          )
        );
      }

      const signup = await supabase.auth.signUp({
        email: details.email,
        password,
        options: {
          data: {
            full_name: details.name,
            first_name: details.firstName,
            last_name: details.lastName,
            phone: details.phone,
          },
        },
      });

      if (signup.error || !signup.data.user) {
        throw signup.error ?? new Error("Could not create the Darik account.");
      }

      if (signup.data.session?.user) {
        setPendingPhoneSession(signup.data.session);

        const phoneResult = await supabase.auth.updateUser({ phone: details.phone });
        if (phoneResult.error) throw phoneResult.error;

        setStep("phone_code");
        setMessage(
          "Email is ready. Enter the SMS code sent to your phone. / البريد جاهز. أدخل رمز SMS المرسل إلى هاتفك."
        );
        return;
      }

      setStep("email_code");
      setMessage(
        "We sent a confirmation code to your email. / أرسلنا رمز تأكيد إلى بريدك الإلكتروني."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Darik signup failed.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmEmail383(event?: FormEvent) {
    event?.preventDefault();
    const details = validatedDetails383();
    if (!details) return;

    const token = emailCode.trim();
    if (token.length < 4) {
      setMessage("Enter the email confirmation code. / أدخل رمز تأكيد البريد الإلكتروني.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      let verifyResult = await supabase.auth.verifyOtp({
        email: details.email,
        token,
        type: "signup",
      });

      if (verifyResult.error || !verifyResult.data.session?.user) {
        verifyResult = await supabase.auth.verifyOtp({
          email: details.email,
          token,
          type: "email" as any,
        });
      }

      if (verifyResult.error || !verifyResult.data.session?.user) {
        throw verifyResult.error ?? new Error("Could not confirm this email code.");
      }

      const session = verifyResult.data.session;
      setPendingPhoneSession(session);

      const phoneResult = await supabase.auth.updateUser({ phone: details.phone });
      if (phoneResult.error) throw phoneResult.error;

      setStep("phone_code");
      setMessage(
        "Email confirmed. Enter the SMS code sent to your phone. / تم تأكيد البريد. أدخل رمز SMS المرسل إلى هاتفك."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Email confirmation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmPhone383(event?: FormEvent) {
    event?.preventDefault();
    const details = validatedDetails383();
    if (!details) return;

    const token = phoneCode.trim();
    if (token.length < 4) {
      setMessage("Enter the SMS code sent to your phone. / أدخل رمز SMS المرسل إلى هاتفك.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const verifyResult = await supabase.auth.verifyOtp({
        phone: details.phone,
        token,
        type: "phone_change" as any,
      });

      if (verifyResult.error) throw verifyResult.error;

      const activeSession = verifyResult.data.session ?? pendingPhoneSession;
      const activeUser = verifyResult.data.user ?? activeSession?.user;

      if (!activeUser) {
        throw new Error(
          "Phone was confirmed, but Darik could not finish the account session. Sign in with your email and password."
        );
      }

      const profile = await ensureCustomerProfile383(
        activeUser,
        details.name,
        details.phone
      );

      setExistingProfile(profile);
      setPendingPhoneSession(null);
      setEmailCode("");
      setPhoneCode("");
      setPassword("");
      setPasswordConfirm("");
      setStep("success");
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Phone confirmation failed.");
    } finally {
      setBusy(false);
    }
  }

  const accountName = existingProfile?.full_name?.trim() || existingProfile?.email || "Darik customer";

  return (
    <main className={styles.page383}>
      <header className={styles.header383}>
        <a href="/" className={styles.brand383} aria-label="GetDarik.com home">
          <img src="/darik_logo_final_v2.png" alt="Darik" />
          <span>
            <strong>GetDarik.com</strong>
            <small>Customer Account / حساب العميل</small>
          </span>
        </a>
        <a href="/" className={styles.back383}>← Back to shopping / العودة للتسوق</a>
      </header>

      <section className={styles.shell383}>
        <aside className={styles.intro383}>
          <span className={styles.eyebrow383}>ONE DARIK ACCOUNT</span>
          <h1>Create your Darik account</h1>
          <h2 dir="rtl">أنشئ حسابك على داريك</h2>
          <p>
            Use one customer account across GetDarik.com and every Darik-powered store.
          </p>
          <p dir="rtl">
            استخدم حساب عميل واحد على GetDarik.com وجميع المتاجر التي تعمل عبر داريك.
          </p>

          <div className={styles.benefits383}>
            <div><b>01</b><span><strong>Faster checkout</strong><small>Keep your customer identity ready.</small></span></div>
            <div><b>02</b><span><strong>Order history</strong><small>See orders connected to your Darik account.</small></span></div>
            <div><b>03</b><span><strong>One login</strong><small>The same account works across Darik storefronts.</small></span></div>
          </div>
        </aside>

        <div className={styles.card383}>
          {checkingSession ? (
            <div className={styles.centerState383}>
              <span className={styles.spinner383} />
              <strong>Checking your Darik session…</strong>
              <small>جاري التحقق من حسابك…</small>
            </div>
          ) : step === "already" ? (
            <div className={styles.centerState383}>
              <div className={styles.successIcon383}>✓</div>
              <span className={styles.cardEyebrow383}>ACCOUNT READY</span>
              <h3>You’re already signed in</h3>
              <p dir="rtl">أنت مسجل الدخول بالفعل</p>
              <strong className={styles.accountName383}>{accountName}</strong>
              <a href="/" className={styles.primaryLink383}>Continue shopping / متابعة التسوق</a>
            </div>
          ) : step === "success" ? (
            <div className={styles.centerState383}>
              <div className={styles.successIcon383}>✓</div>
              <span className={styles.cardEyebrow383}>ACCOUNT CREATED</span>
              <h3>Your Darik account is ready</h3>
              <p>You are signed in and can use this account across Darik storefronts.</p>
              <p dir="rtl">تم إنشاء حسابك وتسجيل دخولك، ويمكنك استخدامه في جميع متاجر داريك.</p>
              <a href="/" className={styles.primaryLink383}>Start shopping / ابدأ التسوق</a>
            </div>
          ) : (
            <>
              <div className={styles.cardHeading383}>
                <span className={styles.cardEyebrow383}>
                  {step === "details" ? "CREATE ACCOUNT" : step === "email_code" ? "VERIFY EMAIL" : "VERIFY PHONE"}
                </span>
                <h3>
                  {step === "details"
                    ? "Your details / بياناتك"
                    : step === "email_code"
                      ? "Confirm your email / تأكيد البريد"
                      : "Confirm your phone / تأكيد الهاتف"}
                </h3>
                <p>
                  {step === "details"
                    ? "We’ll verify your email and mobile number before finishing your account."
                    : step === "email_code"
                      ? `Enter the confirmation code sent to ${email.trim().toLowerCase()}.`
                      : `Enter the SMS code sent to ${normalizeDarikCustomerPhone383(phone)}.`}
                </p>
              </div>

              {nonCustomerSession && step === "details" ? (
                <div className={styles.sessionNotice383}>
                  A non-customer Darik session is active in this browser. It will be signed out when you create the customer account.
                </div>
              ) : null}

              {step === "details" ? (
                <form className={styles.form383} onSubmit={startSignup383}>
                  <div className={styles.grid383}>
                    <label><span>First name / الاسم الأول</span><input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" /></label>
                    <label><span>Last name / اسم العائلة</span><input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" /></label>
                    <label><span>Email / البريد الإلكتروني</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
                    <label><span>Confirm email / تأكيد البريد</span><input type="email" value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} autoComplete="email" /></label>
                    <label><span>Phone / رقم الهاتف</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="07XXXXXXXX or +962…" /></label>
                    <label><span>Confirm phone / تأكيد الهاتف</span><input type="tel" value={phoneConfirm} onChange={(e) => setPhoneConfirm(e.target.value)} autoComplete="tel" /></label>
                    <label><span>Password / كلمة المرور</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></label>
                    <label><span>Confirm password / تأكيد كلمة المرور</span><input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} autoComplete="new-password" /></label>
                  </div>

                  <div className={styles.passwordRule383}>
                    8+ characters • capital letter • number • special character
                    <small dir="rtl">8 خانات أو أكثر • حرف كبير • رقم • رمز خاص</small>
                  </div>

                  {message ? <div className={styles.message383}>{message}</div> : null}

                  <button type="submit" className={styles.submit383} disabled={busy}>
                    {busy ? "Creating account… / جاري الإنشاء…" : "Create Account / إنشاء حساب"}
                  </button>
                </form>
              ) : null}

              {step === "email_code" ? (
                <form className={styles.form383} onSubmit={confirmEmail383}>
                  <label className={styles.codeField383}>
                    <span>Email confirmation code / رمز تأكيد البريد</span>
                    <input inputMode="numeric" autoComplete="one-time-code" value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 8))} autoFocus />
                  </label>
                  {message ? <div className={styles.message383}>{message}</div> : null}
                  <button type="submit" className={styles.submit383} disabled={busy}>
                    {busy ? "Confirming… / جاري التأكيد…" : "Confirm Email / تأكيد البريد"}
                  </button>
                  <button type="button" className={styles.secondary383} disabled={busy} onClick={() => { setMessage(""); setStep("details"); }}>
                    Change details / تعديل البيانات
                  </button>
                </form>
              ) : null}

              {step === "phone_code" ? (
                <form className={styles.form383} onSubmit={confirmPhone383}>
                  <label className={styles.codeField383}>
                    <span>SMS confirmation code / رمز تأكيد SMS</span>
                    <input inputMode="numeric" autoComplete="one-time-code" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 8))} autoFocus />
                  </label>
                  {message ? <div className={styles.message383}>{message}</div> : null}
                  <button type="submit" className={styles.submit383} disabled={busy}>
                    {busy ? "Finishing account… / جاري الإنهاء…" : "Finish Account / إكمال الحساب"}
                  </button>
                </form>
              ) : null}

              <div className={styles.signInFooter383}>
                <strong>Already have a Darik account? / لديك حساب داريك؟</strong>
                <a href="/">Return to GetDarik.com and choose Sign In / ارجع واختر تسجيل الدخول</a>
              </div>
            </>
          )}
        </div>
      </section>

      <footer className={styles.footer383}>
        <span>By creating an account, you agree to Darik’s <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</span>
        <span dir="rtl">بإنشاء الحساب، فإنك توافق على شروط داريك وسياسة الخصوصية.</span>
      </footer>
    </main>
  );
}
