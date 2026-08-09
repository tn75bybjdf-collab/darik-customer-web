"use client";

// DARIK_RETAIL_FIELDS_SMOKE_SHOP_050

// DARIK_CUSTOM_STORE_LINKS_035

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./signup.module.css";

type PlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting?: { main_text?: string; secondary_text?: string };
};

type LockedLocation = {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string | null;
  source: "gps" | "google_search";
};

const businessTypes = [
  ["supermarket", "Supermarket / Hypermarket — سوبرماركت / هايبرماركت"],
  ["restaurant", "Restaurant — مطعم"],
  ["bakery", "Bakery / Sweets — مخبز / حلويات"],
  ["cafe", "Café — مقهى / كوفي شوب"],
  ["smoke_shop", "Smoke shop — محل دخان وتبغ"],
  ["butcher", "Butcher — ملحمة"],
  ["produce", "Fruit and vegetable store — خضار وفواكه"],
  ["clothing", "Clothing — ملابس"],
  ["shoes", "Shoes — أحذية"],
  ["jewelry", "Jewelry — مجوهرات"],
  ["cosmetics", "Cosmetics / Beauty — مستحضرات تجميل / عناية"],
  ["perfume", "Perfume — عطور"],
  ["electronics", "Electronics — إلكترونيات"],
  ["computers", "Computers — كمبيوتر"],
  ["mobile_phones", "Mobile phones and accessories — هواتف وإكسسوارات"],
  ["furniture", "Furniture — أثاث"],
  ["home_appliances", "Home appliances — أجهزة منزلية"],
  ["home_decor", "Home décor — ديكور منزلي"],
  ["auto_parts", "Auto parts — قطع سيارات"],
  ["tires", "Tires and car accessories — إطارات وإكسسوارات سيارات"],
  ["hardware", "Hardware store — عدد وأدوات"],
  ["building_materials", "Building materials — مواد بناء"],
  ["electrical_supplies", "Electrical supplies — مواد كهربائية"],
  ["plumbing", "Plumbing supplies — مواد صحية وسباكة"],
  ["tools", "Tools and equipment — أدوات ومعدات"],
  ["pharmacy", "Pharmacy — صيدلية"],
  ["pet_supplies", "Pet supplies — مستلزمات حيوانات أليفة"],
  ["flowers", "Flowers — زهور"],
  ["gifts", "Gifts — هدايا"],
  ["toys", "Toys — ألعاب"],
  ["books_stationery", "Books and stationery — كتب وقرطاسية"],
  ["sports", "Sports equipment — معدات رياضية"],
  ["other", "Other — أخرى"],
] as const;

function autoSlugFromName(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function cleanSlug(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function strongPassword(value: string) {
  return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export default function StoreSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationNameAr, setOrganizationNameAr] = useState("");
  const [businessType, setBusinessType] = useState("supermarket");
  const [businessTypeOther, setBusinessTypeOther] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState("");
  const [slugCustomized, setSlugCustomized] = useState(false);
  const [slugState, setSlugState] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const suggestedSlug = useMemo(() => autoSlugFromName(organizationName), [organizationName]);
  const [location, setLocation] = useState<LockedLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [searchingPlaces, setSearchingPlaces] = useState(false);
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  useEffect(() => {
    if (!slugCustomized) setSlug(suggestedSlug);
  }, [suggestedSlug, slugCustomized]);

  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  async function checkSlug(nextSlug = slug) {
    const cleaned = cleanSlug(nextSlug);
    if (cleaned.length < 2) { setSlugState("idle"); return false; }
    setSlugState("checking");
    const result = await supabase.rpc("darik_direct_slug_available", { p_slug: cleaned });
    const available = !result.error && result.data === true;
    setSlugState(available ? "available" : "taken");
    return available;
  }

  useEffect(() => {
    let cancelled = false;

    if (slug.length < 2) {
      setSlugState("idle");
      return;
    }

    setSlugState("checking");
    const timer = window.setTimeout(async () => {
      const result = await supabase.rpc("darik_direct_slug_available", { p_slug: slug });
      if (cancelled) return;
      const available = !result.error && result.data === true;
      setSlugState(available ? "available" : "taken");
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [slug]);

  function validateStepOne() {
    if (organizationName.trim().length < 2) return "Enter the organization or store name.";
    if (!businessType) return "Choose the retail field.";
    if (businessType === "other" && businessTypeOther.trim().length < 2) return "Enter the store type.";
    if (contactName.trim().length < 2) return "Enter the owner or contact name.";
    if (phone.trim().length < 7) return "Enter a valid business phone number.";
    if (slug.length < 2) return "Choose a store link using English letters, numbers, or hyphens.";
    if (slugState === "taken") return "That Darik store link is already in use. Choose another link.";
    if (slugState === "checking") return "Wait a moment while Darik checks the permanent store link.";
    return "";
  }

  async function useCurrentLocation() {
    setError("");
    if (!navigator.geolocation) { setError("This browser does not support location access."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const response = await fetch(`/api/google-places/geocode?lat=${latitude}&lng=${longitude}&language=en`);
        const json = await response.json();
        const first = Array.isArray(json.results) ? json.results[0] : null;
        setLocation({
          address: first?.formatted_address || `Coordinates ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          latitude,
          longitude,
          placeId: first?.place_id || null,
          source: "gps",
        });
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not identify the current location.");
      } finally { setLocating(false); }
    }, (geoError) => {
      setError(geoError.message || "Location permission was not granted.");
      setLocating(false);
    }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  }

  async function searchPlaces() {
    const input = placeQuery.trim();
    if (input.length < 3) { setError("Type at least three letters to search Google."); return; }
    setSearchingPlaces(true); setError(""); setPredictions([]);
    try {
      const response = await fetch(`/api/google-places/autocomplete?input=${encodeURIComponent(input)}&language=en`);
      const json = await response.json();
      if (json.status !== "OK" && json.status !== "ZERO_RESULTS") throw new Error(json.error_message || "Google location search failed.");
      setPredictions(Array.isArray(json.predictions) ? json.predictions : []);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not search Google locations."); }
    finally { setSearchingPlaces(false); }
  }

  async function selectPlace(prediction: PlacePrediction) {
    setSearchingPlaces(true); setError("");
    try {
      const response = await fetch(`/api/google-places/details?place_id=${encodeURIComponent(prediction.place_id)}&language=en`);
      const json = await response.json();
      const result = json.result;
      const latitude = Number(result?.geometry?.location?.lat);
      const longitude = Number(result?.geometry?.location?.lng);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error("Google did not return exact coordinates for this place.");
      setLocation({
        address: result.formatted_address || prediction.description,
        latitude,
        longitude,
        placeId: prediction.place_id,
        source: "google_search",
      });
      setPlaceQuery(result.formatted_address || prediction.description);
      setPredictions([]);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not select this location."); }
    finally { setSearchingPlaces(false); }
  }

  async function nextFromStepOne() {
    setError("");
    const issue = validateStepOne();
    if (issue) { setError(issue); return; }
    const available = await checkSlug(slug);
    if (!available) { setError("That Darik store link is already in use. Choose another link."); return; }
    setStep(2);
  }

  function nextFromStepTwo() {
    setError("");
    if (!location) { setError("Confirm the exact physical store location before continuing."); return; }
    setStep(3);
  }

  async function createAccount() {
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { setError("Enter a valid email address."); return; }
    if (cleanEmail !== emailConfirm.trim().toLowerCase()) { setError("The email addresses do not match."); return; }
    if (!strongPassword(password)) { setError("The password must have at least 8 characters, uppercase, lowercase, and a special character."); return; }
    if (password !== passwordConfirm) { setError("The passwords do not match."); return; }
    if (!location) { setError("The locked store location is missing."); return; }

    setBusy(true);
    const result = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/store-dashboard`,
        data: {
          account_type: "darik_direct_store",
          organization_name: organizationName.trim(),
          organization_name_ar: organizationNameAr.trim(),
          business_type: businessType,
          business_type_other: businessType === "other" ? businessTypeOther.trim() : "",
          contact_name: contactName.trim(),
          phone: phone.trim(),
          store_slug: slug,
          business_address: location.address,
          business_latitude: location.latitude,
          business_longitude: location.longitude,
          business_place_id: location.placeId || "",
          business_location_source: location.source,
        },
      },
    });
    setBusy(false);

    if (result.error) {
      const normalizedError = result.error.message.toLowerCase();
      const message = normalizedError.includes("already") || normalizedError.includes("database error saving new user")
        ? "That email address is already in use, or this store account could not be created. Sign in or use another email."
        : result.error.message;
      setError(message);
      return;
    }

    if (result.data.user && Array.isArray(result.data.user.identities) && result.data.user.identities.length === 0) {
      setError("That email address is already in use. Sign in instead.");
      return;
    }

    setNeedsEmailConfirmation(!result.data.session);
    setComplete(true);
    if (result.data.session) window.setTimeout(() => router.push("/store-dashboard"), 900);
  }

  if (complete) {
    return <main className={styles.page}><div className={styles.shell}><section className={styles.card}><div className={styles.success}>
      <div className={styles.successIcon}>✓</div><h2>Your free Darik store is created</h2>
      <p>{needsEmailConfirmation ? "Check your email and confirm the account. Then sign in to build and privately preview your store." : "Opening your store dashboard. You can build and privately preview the storefront immediately."}</p>
      <a className={styles.primaryButton} href="/store-dashboard" style={{display:"inline-block", textDecoration:"none"}}>Open store dashboard</a>
    </div></section></div></main>;
  }

  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.header}><div><div className={styles.brand}>Darik Direct</div><h1>Create your store for free</h1><p>Build the catalog, preview the complete website privately, and pay by CliQ only when you are ready to go live.</p></div><a className={styles.signInLink} href="/store-dashboard">Already registered? Sign in</a></header>
    <div className={styles.progress}><span className={styles.active}/><span className={step >= 2 ? styles.active : ""}/><span className={step >= 3 ? styles.active : ""}/></div>
    <section className={styles.card}>
      {step === 1 ? <>
        <div className={styles.stepTitle}><span>Step 1 of 3</span><h2>Tell us about the store</h2><p>This creates the organization and reserves its permanent GetDarik address.</p></div>
        <div className={styles.grid}>
          <label className={styles.label}>Organization / store name<input value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} /></label>
          <label className={styles.label}>Arabic store name <span className={styles.helper}>Optional</span><input dir="rtl" value={organizationNameAr} onChange={(e) => setOrganizationNameAr(e.target.value)} /></label>
          <label className={styles.label}>Retail field / مجال النشاط<select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>{businessTypes.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {businessType === "other" ? <label className={styles.label}>Describe the business<input value={businessTypeOther} onChange={(e) => setBusinessTypeOther(e.target.value)} /></label> : null}
          <label className={styles.label}>Owner / main contact<input value={contactName} onChange={(e) => setContactName(e.target.value)} /></label>
          <label className={styles.label}>Business phone<input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" /></label>
          <label className={`${styles.label} ${styles.full}`}>Store link / رابط المتجر<div className={styles.slugWrap}><span>getdarik.com/</span><input value={slug} onChange={(e) => { setSlugCustomized(true); setSlug(cleanSlug(e.target.value)); }} inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} /></div>
            <span className={styles.helper}>Filled automatically from the store name. You can shorten or customize it before signup / يتم تعبئته تلقائياً ويمكنك تعديله أو اختصاره.</span>
            {slugCustomized && suggestedSlug && slug !== suggestedSlug ? <button type="button" className={styles.backButton} onClick={() => { setSlugCustomized(false); setSlug(suggestedSlug); }}>Use suggested link / استخدام الرابط المقترح</button> : null}
            {slugState === "checking" ? <span className={styles.helper}>Checking availability… / جاري التحقق من توفر الرابط…</span> : null}
            {slugState === "available" ? <span className={styles.available}>Available — this address will be reserved / متاح — سيتم حجز هذا الرابط.</span> : null}
            {slugState === "taken" ? <span className={styles.unavailable}>Already in use or reserved. Choose another link / الرابط مستخدم أو محجوز. اختر رابطاً آخر.</span> : null}
          </label>
        </div>
        <div className={styles.actions}><div/><div className={styles.actionsRight}><button type="button" className={styles.primaryButton} onClick={nextFromStepOne}>Continue to location</button></div></div>
      </> : null}

      {step === 2 ? <>
        <div className={styles.stepTitle}><span>Step 2 of 3</span><h2>Lock the physical store location</h2><p>This location cannot be changed from the retailer dashboard after signup.</p></div>
        <div className={styles.locationChoices}>
          <div className={styles.locationChoice}><strong>Use current location</strong><p>Stand at the store and let the browser capture the exact GPS position.</p><button type="button" className={styles.secondaryButton} onClick={useCurrentLocation} disabled={locating}>{locating ? "Locating…" : "Use my current location"}</button></div>
          <div className={styles.locationChoice}><strong>Search Google location</strong><p>Search for the business, street, building, or nearby landmark.</p><div className={styles.searchBox}><div className={styles.searchRow}><input value={placeQuery} onChange={(e) => setPlaceQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); searchPlaces(); } }} placeholder="Search in Jordan"/><button type="button" className={styles.secondaryButton} onClick={searchPlaces} disabled={searchingPlaces}>{searchingPlaces ? "Searching…" : "Search"}</button></div>
          {predictions.length ? <div className={styles.results}>{predictions.map((prediction) => <button type="button" className={styles.resultButton} key={prediction.place_id} onClick={() => selectPlace(prediction)}><strong>{prediction.structured_formatting?.main_text || prediction.description}</strong><span>{prediction.structured_formatting?.secondary_text || "Jordan"}</span></button>)}</div> : null}</div></div>
        </div>
        {location ? <div className={styles.locationLocked}><span className={styles.lockBadge}>LOCATION LOCKED</span><h3>{location.address}</h3><p>{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} · {location.source === "gps" ? "Current GPS" : "Google search"}</p><a href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer">Check pin on Google Maps</a></div> : null}
        <div className={styles.actions}><button type="button" className={styles.backButton} onClick={() => setStep(1)}>Back</button><div className={styles.actionsRight}><button type="button" className={styles.primaryButton} onClick={nextFromStepTwo}>Confirm locked location</button></div></div>
      </> : null}

      {step === 3 ? <>
        <div className={styles.stepTitle}><span>Step 3 of 3</span><h2>Create the owner login</h2><p>The email must be new. The owner can sign in immediately after confirmation.</p></div>
        <div className={styles.grid}>
          <label className={styles.label}>Email<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className={styles.label}>Enter email again<input type="email" value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} /></label>
          <label className={styles.label}>Password<input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /><span className={styles.passwordRules}><span className={passwordChecks.length ? styles.passed : ""}>8+ characters</span><span className={passwordChecks.uppercase ? styles.passed : ""}>Uppercase</span><span className={passwordChecks.lowercase ? styles.passed : ""}>Lowercase</span><span className={passwordChecks.special ? styles.passed : ""}>Special character</span></span></label>
          <label className={styles.label}>Enter password again<input type="password" autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} /></label>
          <div className={`${styles.summary} ${styles.full}`}><div><span>Store</span><strong>{organizationName}</strong></div><div><span>Store link</span><strong>getdarik.com/{slug}</strong></div><div><span>Locked location</span><strong>{location?.address}</strong></div><div><span>Starting status</span><strong>Free draft · Coming Soon publicly</strong></div></div>
        </div>
        <div className={styles.actions}><button type="button" className={styles.backButton} onClick={() => setStep(2)}>Back</button><div className={styles.actionsRight}><button type="button" className={styles.primaryButton} onClick={createAccount} disabled={busy}>{busy ? "Creating store…" : "Create free store"}</button></div></div>
      </> : null}
      {error ? <div className={styles.error} role="alert">{error}</div> : null}
    </section>
  </div></main>;
}
