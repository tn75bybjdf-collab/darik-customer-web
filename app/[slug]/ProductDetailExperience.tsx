"use client";

// DARIK_CUSTOMER_PRODUCT_DETAIL_BEAUTY_079
// DARIK_CUSTOMER_PRODUCT_VIEWPORT_MEDIA_PERFECTION_080
// DARIK_CUSTOMER_PRODUCT_EXECUTIVE_SHOWCASE_081
// DARIK_CUSTOMER_PRODUCT_PORTFOLIO_FINISH_082

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./productDetailExperience.module.css";

type SizeOption = { label?: string | null };
type ShoeSize = { eu?: string | null; us?: string | null };

export type ProductDetailProduct = {
  id: string;
  name: string;
  official_marketplace_name: string | null;
  official_marketplace_name_ar: string | null;
  brand_name: string | null;
  description: string | null;
  app_price: number | string | null;
  direct_compare_at_price?: number | string | null;
  quantity_in_stock: number | string | null;
  direct_inventory_tracking_enabled: boolean;
  direct_availability_status: "available" | "out_of_stock" | null;
  direct_pricing_mode: "price" | "call" | "whatsapp" | "call_whatsapp" | null;
  direct_vehicle_year_from: number | string | null;
  direct_vehicle_year_to: number | string | null;
  direct_vehicle_make: string | null;
  direct_vehicle_model: string | null;
  official_product_photo_url: string | null;
  official_product_thumbnail_url: string | null;
  official_product_photo_url_2: string | null;
  direct_store_category_name: string | null;
  direct_store_category_name_ar: string | null;
  storefront_featured: boolean;
  direct_sold_by_weight?: boolean | null;
  direct_weight_unit?: string | null;
  direct_weight_step?: number | string | null;
  direct_size_options?: SizeOption[] | null;
  direct_shoe_sizes?: ShoeSize[] | null;
};

type ProductDetailExperienceProps = {
  open: boolean;
  product: ProductDetailProduct | null;
  storeName: string;
  storeSlug: string;
  primaryColor: string;
  accentColor: string;
  phoneHref: string | null;
  whatsappNumber: string | null;
  showPrices: boolean;
  showOrdering: boolean;
  acceptingOrders: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  estimatedDeliveryMinutes: number | null;
  inCart: number;
  onClose: () => void;
  onAddToCart: () => void;
};

type MediaSlide =
  | { kind: "photo"; url: string; label: string }
  | { kind: "video"; url: string; label: string };

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function whatsappDigits(value: string | null | undefined) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) digits = `962${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) digits = `962${digits}`;
  return digits;
}

function productName(product: ProductDetailProduct) {
  return product.official_marketplace_name || product.name || "Product";
}

function productFitment(product: ProductDetailProduct) {
  const yearFrom = clean(product.direct_vehicle_year_from);
  const yearTo = clean(product.direct_vehicle_year_to);
  const make = clean(product.direct_vehicle_make);
  const model = clean(product.direct_vehicle_model);
  const year = yearFrom && yearTo && yearFrom !== yearTo ? `${yearFrom}–${yearTo}` : yearFrom || yearTo;
  return [year, make, model].filter(Boolean).join(" ");
}

function uniqueStrings(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  return values
    .map((value) => clean(value))
    .filter((value) => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function CloseIcon() {
  return (
    <Icon>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return direction === "right" ? (
    <Icon>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  ) : (
    <Icon>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Icon>
  );
}

function ExpandIcon() {
  return (
    <Icon>
      <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
      <path d="M3 8l6-5M21 8l-6-5M21 16l-6 5M3 16l6 5" />
    </Icon>
  );
}

function BagIcon() {
  return (
    <Icon>
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </Icon>
  );
}

function PhoneIcon() {
  return (
    <Icon>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </Icon>
  );
}

function WhatsappIcon() {
  return (
    <Icon>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.2-4.6A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M8.5 8.2c.2-.5.4-.5.7-.5h.6c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.7.8c-.2.2-.1.4 0 .6.5.9 1.2 1.7 2.1 2.2.3.2.5.2.7 0l.9-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.6 0 .3-.2 1.5-.9 2.1-.7.6-1.7.8-2.3.7-.6-.1-2.8-.9-4.8-2.8-1.7-1.6-2.8-3.5-3.1-4.2-.3-.7 0-1.5.2-2.1.2-.4.4-.7.5-1Z" />
    </Icon>
  );
}

function ShareIcon() {
  return (
    <Icon>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4" />
    </Icon>
  );
}


function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="currentColor"
    >
      <path d="M8.3 5.4c0-1.1 1.2-1.7 2.1-1.1l8.1 6.5c.8.6.8 1.8 0 2.4l-8.1 6.5c-.9.7-2.1.1-2.1-1.1V5.4Z" />
    </svg>
  );
}

function ProductVideo({
  url,
  poster,
  name,
  active,
  onExpand,
}: {
  url: string;
  poster?: string;
  name: string;
  active: boolean;
  onExpand: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (active) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setPlaying(false);
  }, [active]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }

  return (
    <div className={styles.videoFrame}>
      {poster ? (
        <img
          className={styles.videoBackdrop}
          src={poster}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : null}

      <video
        ref={videoRef}
        src={url}
        muted
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={`${name} product video`}
        onClick={togglePlayback}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <span className={styles.videoStatus}>Muted</span>

      {!playing ? (
        <button
          type="button"
          className={styles.videoPlayButton}
          onClick={togglePlayback}
          aria-label={`Play ${name} product video`}
        >
          <PlayIcon />
        </button>
      ) : null}

      <button
        type="button"
        className={styles.videoExpandButton}
        onClick={(event) => {
          event.stopPropagation();
          onExpand();
        }}
        aria-label="Open product video full screen"
      >
        <ExpandIcon />
        <span>Full screen</span>
      </button>
    </div>
  );
}

export default function ProductDetailExperience({
  open,
  product,
  storeName,
  storeSlug,
  primaryColor,
  accentColor,
  phoneHref,
  whatsappNumber,
  showPrices,
  showOrdering,
  acceptingOrders,
  deliveryEnabled,
  pickupEnabled,
  estimatedDeliveryMinutes,
  inCart,
  onClose,
  onAddToCart,
}: ProductDetailExperienceProps) {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [shareState, setShareState] = useState("");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, onClose, open]);

  useEffect(() => {
    setGalleryIndex(0);
    setLightboxIndex(null);
    setVideoUrl("");
    setShareState("");
    galleryRef.current?.scrollTo({ left: 0 });

    if (!open || !product?.id) return;

    let cancelled = false;

    void (async () => {
      const { data, error } = await supabase
        .from("public_storefront_product_videos")
        .select("*")
        .eq("product_id", product.id)
        .maybeSingle();

      if (cancelled || error) return;

      const candidate = clean(
        (data as { direct_item_video_url?: string | null } | null)
          ?.direct_item_video_url
      );

      if (candidate) setVideoUrl(candidate);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, product?.id]);

  const photos = useMemo(() => {
    if (!product) return [];
    const primary = clean(product.official_product_photo_url) || clean(product.official_product_thumbnail_url);
    return uniqueStrings([primary, product.official_product_photo_url_2]);
  }, [product]);

  const slides = useMemo<MediaSlide[]>(() => {
    const media: MediaSlide[] = photos.map((url, index) => ({
      kind: "photo",
      url,
      label: `Photo ${index + 1}`,
    }));
    if (videoUrl) {
      media.push({ kind: "video", url: videoUrl, label: "Video" });
    }
    return media;
  }, [photos, videoUrl]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    requestAnimationFrame(() => {
      const width = lightboxRef.current?.clientWidth || 0;
      lightboxRef.current?.scrollTo({ left: width * lightboxIndex });
    });
  }, [lightboxIndex]);

  if (!open || !product) return null;

  const name = productName(product);
  const arabicName = clean(product.official_marketplace_name_ar);
  const category = clean(product.direct_store_category_name) || clean(product.brand_name) || "Store selection";
  const categoryAr = clean(product.direct_store_category_name_ar);
  const fitment = productFitment(product);
  const stock = Number(product.quantity_in_stock ?? 0);
  const pricingMode = product.direct_pricing_mode || "price";
  const contactPricing = pricingMode !== "price";
  const available =
    product.direct_availability_status !== "out_of_stock" &&
    (!product.direct_inventory_tracking_enabled || stock > 0);
  const compareAt = Number(product.direct_compare_at_price ?? 0);
  const price = Number(product.app_price ?? 0);
  const hasCompareAt =
    !contactPricing &&
    showPrices &&
    Number.isFinite(compareAt) &&
    Number.isFinite(price) &&
    compareAt > price &&
    price > 0;
  const sizeOptions = Array.isArray(product.direct_size_options)
    ? product.direct_size_options
        .map((item) => clean(item?.label))
        .filter(Boolean)
        .slice(0, 10)
    : [];
  const shoeSizes = Array.isArray(product.direct_shoe_sizes)
    ? product.direct_shoe_sizes
        .map((size) => [clean(size?.eu) && `EU ${clean(size?.eu)}`, clean(size?.us) && `US ${clean(size?.us)}`].filter(Boolean).join(" / "))
        .filter(Boolean)
        .slice(0, 10)
    : [];
  const optionLabels = uniqueStrings([...sizeOptions, ...shoeSizes]);
  const whatsapp = whatsappDigits(whatsappNumber);
  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${storeSlug}?product=${encodeURIComponent(product.id)}`
      : `https://getdarik.com/${storeSlug}?product=${encodeURIComponent(product.id)}`;
  const contactMessage = [
    `Hello ${storeName}, I am interested in ${name}.`,
    `مرحبا، مهتم بهذا المنتج: ${name}`,
    fitment ? `Fitment: ${fitment}` : "",
    productUrl,
  ]
    .filter(Boolean)
    .join("\n");
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(contactMessage)}`
    : null;
  const canCall =
    (pricingMode === "call" || pricingMode === "call_whatsapp") &&
    Boolean(phoneHref);
  const canWhatsapp =
    (pricingMode === "whatsapp" || pricingMode === "call_whatsapp") &&
    Boolean(whatsappHref);

  const rootStyle = {
    "--pd-primary": primaryColor || "#111827",
    "--pd-accent": accentColor || "#2563EB",
  } as CSSProperties;

  function scrollGallery(index: number) {
    const width = galleryRef.current?.clientWidth || 0;
    galleryRef.current?.scrollTo({ left: width * index, behavior: "smooth" });
    setGalleryIndex(index);
  }

  function openViewer(index: number) {
    galleryRef.current
      ?.querySelectorAll<HTMLVideoElement>("video")
      .forEach((video) => video.pause());
    setLightboxIndex(index);
  }

  function scrollViewer(index: number) {
    const width = lightboxRef.current?.clientWidth || 0;
    lightboxRef.current?.scrollTo({ left: width * index, behavior: "smooth" });
    setLightboxIndex(index);
  }

  function handleGalleryScroll() {
    const node = galleryRef.current;
    if (!node || node.clientWidth <= 0) return;
    const next = Math.round(node.scrollLeft / node.clientWidth);
    if (next !== galleryIndex) setGalleryIndex(next);
  }

  function handleLightboxScroll() {
    const node = lightboxRef.current;
    if (!node || node.clientWidth <= 0) return;
    const next = Math.round(node.scrollLeft / node.clientWidth);
    if (next !== lightboxIndex) setLightboxIndex(next);
  }

  async function shareProduct() {
    setShareState("");
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: `${name} — ${storeName}`, url: productUrl });
        return;
      }
      await navigator.clipboard.writeText(productUrl);
      setShareState("Link copied");
      window.setTimeout(() => setShareState(""), 1800);
    } catch {
      // User cancellation or unavailable clipboard should not disturb the page.
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.overlay} style={rootStyle} role="dialog" aria-modal="true" aria-label={`${name} product details`}>
      <div className={styles.ambientOne} />
      <div className={styles.ambientTwo} />

      <section className={styles.productPage}>
        <header className={styles.topBar}>
          <button type="button" className={styles.backButton} onClick={onClose}>
            <ArrowIcon direction="left" />
            <span>Back to {storeName}</span>
          </button>

          <div className={styles.topBarActions}>
            <button type="button" className={styles.iconButton} onClick={shareProduct} aria-label="Share product">
              <ShareIcon />
              <span>{shareState || "Share"}</span>
            </button>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close product details">
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className={styles.productLayout}>
          <div className={styles.mediaColumn}>
            <div className={styles.mediaStage}>
              {slides.length > 0 ? (
                <div
                  className={styles.gallery}
                  ref={galleryRef}
                  onScroll={handleGalleryScroll}
                >
                  {slides.map((slide, index) => (
                    <div className={styles.slide} key={`${slide.kind}-${slide.url}`}>
                      {slide.kind === "photo" ? (
                        <button
                          type="button"
                          className={styles.photoButton}
                          onClick={() => openViewer(index)}
                          aria-label={`Enlarge ${slide.label}`}
                        >
                          <img src={slide.url} alt={`${name} — ${slide.label}`} draggable={false} />
                          <span className={styles.expandHint}>
                            <ExpandIcon />
                            Tap to enlarge
                          </span>
                        </button>
                      ) : (
                        <ProductVideo
                          url={slide.url}
                          poster={photos[0] || undefined}
                          name={name}
                          active={galleryIndex === index}
                          onExpand={() => openViewer(index)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noMedia}>
                  <span>{storeName.slice(0, 1).toUpperCase()}</span>
                  <strong>Beautiful things deserve a closer look.</strong>
                  <small>Product media coming soon.</small>
                </div>
              )}

              {slides.length > 1 ? (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                    onClick={() => scrollGallery(Math.max(0, galleryIndex - 1))}
                    disabled={galleryIndex === 0}
                    aria-label="Previous media"
                  >
                    <ArrowIcon direction="left" />
                  </button>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                    onClick={() => scrollGallery(Math.min(slides.length - 1, galleryIndex + 1))}
                    disabled={galleryIndex >= slides.length - 1}
                    aria-label="Next media"
                  >
                    <ArrowIcon direction="right" />
                  </button>
                </>
              ) : null}

              <div className={styles.mediaCounter}>
                {slides.length > 0 ? `${galleryIndex + 1} / ${slides.length}` : "0 / 0"}
              </div>
            </div>

            {slides.length > 1 ? (
              <div className={styles.mediaNav} aria-label="Product media thumbnails">
                {slides.map((slide, index) => (
                  <button
                    type="button"
                    key={`nav-${slide.kind}-${slide.url}`}
                    className={`${styles.mediaThumb} ${index === galleryIndex ? styles.mediaThumbActive : ""}`}
                    onClick={() => scrollGallery(index)}
                    aria-label={`Show ${slide.label}`}
                  >
                    {slide.kind === "photo" ? (
                      <img src={slide.url} alt="" />
                    ) : (
                      <span className={styles.videoThumb}>
                        <span>▶</span>
                        Video
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.detailColumn}>
            <div className={styles.detailScroll}>
              <div className={styles.eyebrowRow}>
                <span className={styles.categoryPill}>{category}</span>
                {categoryAr ? <span className={styles.categoryArabic} dir="rtl">{categoryAr}</span> : null}
                {product.storefront_featured ? <span className={styles.featuredPill}>Featured</span> : null}
              </div>

              <div className={styles.titleBlock}>
                <h1>{name}</h1>
                {arabicName ? <h2 dir="rtl">{arabicName}</h2> : null}
              </div>

              <div className={styles.priceAvailabilityRow}>
                <div className={styles.priceBlock}>
                  <small>{contactPricing ? "Pricing" : "Price"}</small>
                  <strong>
                    {contactPricing
                      ? "Price on request"
                      : showPrices
                        ? money(product.app_price)
                        : "Contact for price"}
                  </strong>
                  {hasCompareAt ? <del>{money(compareAt)}</del> : null}
                </div>

                <span className={`${styles.availabilityBadge} ${available ? styles.available : styles.unavailable}`}>
                  <i />
                  {available ? "متوفر / Available" : "غير متوفر / Out of stock"}
                </span>
              </div>

              {fitment ? (
                <section className={styles.fitmentCard}>
                  <div className={styles.fitmentIcon}>✓</div>
                  <div>
                    <small>Vehicle fitment / توافق السيارة</small>
                    <strong>{fitment}</strong>
                    <p>Matched by the store for this product.</p>
                  </div>
                </section>
              ) : null}

              {optionLabels.length > 0 ? (
                <section className={styles.optionsSection}>
                  <div className={styles.sectionLabel}>
                    <span>Available options</span>
                    <small>الخيارات المتاحة</small>
                  </div>
                  <div className={styles.optionChips}>
                    {optionLabels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </section>
              ) : null}

              {product.direct_sold_by_weight ? (
                <section className={styles.weightCard}>
                  <span>Sold by weight</span>
                  <strong>
                    {clean(product.direct_weight_step) || "Flexible amount"}
                    {clean(product.direct_weight_unit) ? ` ${clean(product.direct_weight_unit)}` : ""}
                  </strong>
                </section>
              ) : null}

              {product.description ? (
                <section className={styles.descriptionSection}>
                  <div className={styles.sectionLabel}>
                    <span>Product details</span>
                    <small>تفاصيل المنتج</small>
                  </div>
                  <p>{product.description}</p>
                </section>
              ) : null}

              <div className={styles.fulfillmentStrip}>
                {deliveryEnabled ? (
                  <div>
                    <span className={styles.fulfillmentIcon}>↗</span>
                    <p>
                      <strong>Delivery</strong>
                      <small>
                        {estimatedDeliveryMinutes
                          ? `About ${estimatedDeliveryMinutes} min`
                          : "Available from this store"}
                      </small>
                    </p>
                  </div>
                ) : null}
                {pickupEnabled ? (
                  <div>
                    <span className={styles.fulfillmentIcon}>⌂</span>
                    <p>
                      <strong>Local pickup</strong>
                      <small>Collect directly from the store</small>
                    </p>
                  </div>
                ) : null}
                <div>
                  <span className={styles.fulfillmentIcon}>◆</span>
                  <p>
                    <strong>{storeName}</strong>
                    <small>Sold directly by the retailer</small>
                  </p>
                </div>
              </div>
            </div>

            <footer className={styles.actionDock}>
              {contactPricing ? (
                <div className={styles.contactActions}>
                  {canCall && phoneHref ? (
                    <a className={styles.secondaryAction} href={phoneHref}>
                      <PhoneIcon />
                      <span>Call / اتصال</span>
                    </a>
                  ) : null}
                  {canWhatsapp && whatsappHref ? (
                    <a className={styles.primaryAction} href={whatsappHref} target="_blank" rel="noreferrer">
                      <WhatsappIcon />
                      <span>WhatsApp / واتساب</span>
                    </a>
                  ) : null}
                  {!canCall && !canWhatsapp ? (
                    <span className={styles.actionNote}>Contact {storeName} for current pricing.</span>
                  ) : null}
                </div>
              ) : showOrdering ? (
                <div className={styles.purchaseRow}>
                  <div className={styles.purchaseMeta}>
                    {inCart > 0 ? <strong>{inCart} in your bag</strong> : <strong>Ready when you are</strong>}
                    <small>{acceptingOrders ? "Store is accepting orders" : "Ordering is paused"}</small>
                  </div>
                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={onAddToCart}
                    disabled={!acceptingOrders || !available}
                  >
                    <BagIcon />
                    <span>{available ? "Add to bag" : "Out of stock"}</span>
                  </button>
                </div>
              ) : (
                <div className={styles.purchaseRow}>
                  <span className={styles.actionNote}>Browse the product, then contact the store when you are ready.</span>
                  {whatsappHref ? (
                    <a className={styles.primaryAction} href={whatsappHref} target="_blank" rel="noreferrer">
                      <WhatsappIcon />
                      <span>Ask store</span>
                    </a>
                  ) : null}
                </div>
              )}
            </footer>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && slides.length > 0 ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} full-screen product media`}
        >
          <div className={styles.lightboxTop}>
            <span>{name}</span>
            <strong>
              {slides[lightboxIndex]?.kind === "video" ? "VIDEO" : "PHOTO"} · {lightboxIndex + 1} / {slides.length}
            </strong>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close full-screen product media"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className={styles.lightboxGallery}
            ref={lightboxRef}
            onScroll={handleLightboxScroll}
          >
            {slides.map((slide, index) => (
              <div
                className={`${styles.lightboxSlide} ${slide.kind === "video" ? styles.lightboxVideoSlide : ""}`}
                key={`lightbox-${slide.kind}-${slide.url}`}
              >
                {slide.kind === "photo" ? (
                  <img
                    src={slide.url}
                    alt={`${name} — enlarged photo ${index + 1}`}
                    draggable={false}
                  />
                ) : (
                  <video
                    src={slide.url}
                    controls
                    playsInline
                    preload="metadata"
                    poster={photos[0] || undefined}
                    aria-label={`${name} full-screen product video`}
                  />
                )}
              </div>
            ))}
          </div>

          {slides.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
                onClick={() => scrollViewer(Math.max(0, lightboxIndex - 1))}
                disabled={lightboxIndex === 0}
                aria-label="Previous full-screen media"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
                onClick={() => scrollViewer(Math.min(slides.length - 1, lightboxIndex + 1))}
                disabled={lightboxIndex >= slides.length - 1}
                aria-label="Next full-screen media"
              >
                <ArrowIcon direction="right" />
              </button>

              <div className={styles.lightboxDots}>
                {slides.map((slide, index) => (
                  <button
                    type="button"
                    key={`lightbox-dot-${slide.kind}-${slide.url}`}
                    className={index === lightboxIndex ? styles.lightboxDotActive : ""}
                    onClick={() => scrollViewer(index)}
                    aria-label={`Show full-screen ${slide.label}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>,
    document.body
  );
}
