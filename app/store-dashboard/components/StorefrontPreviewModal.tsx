"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./StorefrontPreviewModal.module.css";

type PreviewForm = {
  displayName: string; displayNameAr: string; tagline: string; taglineAr: string;
  logoUrl: string; heroImageUrl: string; primaryColor: string; accentColor: string;
  backgroundColor: string; deliveryFee: string; minimumOrder: string;
  estimatedDeliveryMinutes: string; phone: string; whatsapp: string;
  addressText: string; addressTextAr: string; aboutText: string; aboutTextAr: string;
};

type Props = { open: boolean; retailerId: string; form: PreviewForm; onClose: () => void };
type Category = { id: string; name: string; name_ar: string | null; image_url: string | null; category_status: string };
type Product = {
  id: string; direct_name: string | null; direct_name_ar: string | null; name: string;
  direct_price: number | string | null; app_price: number | string | null;
  direct_photo_url: string | null; official_product_thumbnail_url: string | null;
  direct_product_status: string | null; storefront_visible: boolean | null;
};

function money(value: number | string | null) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

export default function StorefrontPreviewModal({ open, retailerId, form, onClose }: Props) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !retailerId) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      supabase.from("retailer_store_categories").select("id,name,name_ar,image_url,category_status").eq("retailer_id", retailerId).neq("category_status", "archived").order("sort_order"),
      supabase.from("products").select("id,direct_name,direct_name_ar,name,direct_price,app_price,direct_photo_url,official_product_thumbnail_url,direct_product_status,storefront_visible").eq("retailer_id", retailerId).neq("direct_product_status", "archived").order("storefront_sort_order").limit(20),
    ]).then(([categoryResult, productResult]) => {
      if (cancelled) return;
      setCategories((categoryResult.data ?? []) as Category[]);
      setProducts((productResult.data ?? []) as Product[]);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [open, retailerId]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  const visibleProducts = useMemo(() => products.filter((p) => p.storefront_visible !== false), [products]);
  if (!open) return null;

  const theme = {
    "--preview-primary": form.primaryColor || "#111827",
    "--preview-accent": form.accentColor || "#2563eb",
    "--preview-bg": form.backgroundColor || "#f8fafc",
  } as CSSProperties;
  const heroStyle = form.heroImageUrl ? { backgroundImage: `linear-gradient(rgba(5,15,24,.38),rgba(5,15,24,.48)), url(${JSON.stringify(form.heroImageUrl)})` } : undefined;

  return <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Private storefront preview / معاينة خاصة للمتجر" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={styles.modal}>
      <div className={styles.toolbar}><div><strong>Private storefront preview / معاينة خاصة للمتجر</strong><span>This popup is visible only inside the store dashboard / تظهر هذه النافذة داخل لوحة المتجر فقط.</span></div><div className={styles.toolbarActions}>
        <button type="button" className={`${styles.deviceButton} ${device === "desktop" ? styles.deviceActive : ""}`} onClick={() => setDevice("desktop")}>Desktop / كمبيوتر</button>
        <button type="button" className={`${styles.deviceButton} ${device === "mobile" ? styles.deviceActive : ""}`} onClick={() => setDevice("mobile")}>Mobile / هاتف</button>
        <button type="button" className={styles.closeButton} onClick={onClose}>Close preview / إغلاق المعاينة</button>
      </div></div>
      <div className={styles.stage}><div className={`${styles.viewport} ${device === "mobile" ? styles.mobile : ""}`} style={theme}>
        <div className={styles.previewOnly}>PREVIEW ONLY — YOUR STORE IS NOT LIVE / معاينة فقط — متجرك غير مفعّل</div>
        <header className={styles.header}><div className={styles.identity}><div className={styles.logo}>{form.logoUrl ? <img src={form.logoUrl} alt="Store logo preview"/> : (form.displayName || "D").slice(0,1).toUpperCase()}</div><div><strong>{form.displayName || "Your store"}</strong><span>Darik Direct store / متجر داريك دايركت</span></div></div><span className={styles.headerBadge}>Orders disabled in preview / الطلبات معطّلة في المعاينة</span></header>
        <section className={styles.hero} style={heroStyle}><div className={styles.heroContent}><h1>{form.displayName || "Your store / متجرك"}</h1><p>{form.tagline || "Add a store tagline / أضف العبارة التعريفية للمتجر"}</p></div></section>
        <section className={styles.stats}><div><span>Delivery</span><strong>{money(form.deliveryFee || "0")}</strong></div><div><span>Minimum order</span><strong>{money(form.minimumOrder || "0")}</strong></div><div><span>Estimated time</span><strong>{form.estimatedDeliveryMinutes ? `${form.estimatedDeliveryMinutes} min` : "Set timing"}</strong></div><div><span>Contact</span><strong>{form.whatsapp || form.phone || "Add phone"}</strong></div></section>
        {(form.aboutText || form.addressText) ? <section className={styles.bilingualCopy}>
          {form.aboutText ? <article><strong>About the store / عن المتجر</strong><p>{form.aboutText}</p></article> : null}
          {form.addressText ? <article><strong>Address / العنوان</strong><p>{form.addressText}</p></article> : null}
        </section> : null}
        <section className={styles.catalog}><div className={styles.catalogTop}><div><h2>Shop the catalog</h2><p>Draft categories and products appear here before activation.</p></div><strong>{visibleProducts.length} products</strong></div>
          {categories.length ? <div className={styles.categories}>{categories.slice(0,8).map((category) => <div className={styles.category} key={category.id}><div className={styles.categoryBubble}>{category.image_url ? <img src={category.image_url} alt=""/> : category.name.slice(0,1).toUpperCase()}</div><span>{category.name_ar || category.name}</span></div>)}</div> : null}
          {loading ? <div className={styles.empty}>Loading the private draft catalog…</div> : visibleProducts.length ? <div className={styles.products}>{visibleProducts.slice(0,12).map((product) => { const photo = product.direct_photo_url || product.official_product_thumbnail_url; return <article className={styles.product} key={product.id}><div className={styles.productImage}>{photo ? <img src={photo} alt=""/> : "Product image"}</div><div className={styles.productBody}><h3>{product.direct_name || product.name}</h3>{product.direct_name_ar ? <p className={styles.productArabic} dir="rtl">{product.direct_name_ar}</p> : null}<div className={styles.productFooter}><strong>{money(product.direct_price ?? product.app_price)}</strong><button type="button" disabled>Add</button></div></div></article>; })}</div> : <div className={styles.empty}>No products yet. Add products in the dashboard and reopen preview.</div>}
        </section>
      </div></div>
    </section>
  </div>;
}
