"use client";

// DARIK_CUSTOMER_APP_PRODUCT_EXPERIENCE_PARITY_178

// DARIK_CUSTOMER_PRODUCT_DETAIL_BEAUTY_079
// DARIK_CUSTOMER_PRODUCT_VIEWPORT_MEDIA_PERFECTION_080
// DARIK_CUSTOMER_PRODUCT_EXECUTIVE_SHOWCASE_081
// DARIK_CUSTOMER_PRODUCT_PORTFOLIO_FINISH_082
// DARIK_CUSTOMER_PRODUCT_FINAL_RESTRAINT_083
// DARIK_CUSTOMER_VIDEO_PLAYBACK_STATE_088

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
  backgroundColor: string;
  appearanceMode: string;
  phoneHref: string | null;
  whatsappNumber: string | null;
  showPrices: boolean;
  showOrdering: boolean;
  acceptingOrders: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  estimatedDeliveryMinutes: number | null;
  deliveryPromiseLabel?: string;
  inCart: number;
  cartCount: number;
  onClose: () => void;
  onAddToCart: () => void;
  onDecreaseCart: () => void;
  onOpenCart: () => void;
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
  const [playbackState, setPlaybackState] = useState<
    "idle" | "starting" | "playing" | "paused"
  >("idle");

  const playbackActive =
    playbackState === "starting" ||
    playbackState === "playing";

  useEffect(() => {
    if (active) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setPlaybackState(video.currentTime > 0 ? "paused" : "idle");
  }, [active]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      try {
        if (video.ended) {
          video.currentTime = 0;
        }

        // Hide the giant Play control immediately. Safari may take a fraction
        // of a second before its onPlaying event fires even though the tap is
        // valid and playback is already being prepared.
        setPlaybackState("starting");
        await video.play();

        if (!video.paused && !video.ended) {
          setPlaybackState("playing");
        }
      } catch {
        setPlaybackState(video.currentTime > 0 ? "paused" : "idle");
      }
      return;
    }

    video.pause();
    setPlaybackState("paused");
  }

  function syncPlayingState() {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) return;
    setPlaybackState("playing");
  }

  function syncPausedState() {
    const video = videoRef.current;
    if (!video) return;

    window.setTimeout(() => {
      const current = videoRef.current;
      if (!current || !current.paused || current.ended) return;
      setPlaybackState(current.currentTime > 0 ? "paused" : "idle");
    }, 60);
  }

  return (
    <div
      className={`${styles.videoFrame} ${
        playbackActive ? styles.videoFramePlaybackActive : styles.videoFramePlaybackIdle
      }`}
      data-playback={playbackState}
    >
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
        preload="auto"
        poster={poster}
        aria-label={`${name} product video`}
        onClick={togglePlayback}
        onPlay={syncPlayingState}
        onPlaying={syncPlayingState}
        onCanPlay={syncPlayingState}
        onTimeUpdate={syncPlayingState}
        onWaiting={() => {
          const video = videoRef.current;
          if (video && !video.paused && !video.ended) {
            setPlaybackState("starting");
          }
        }}
        onPause={syncPausedState}
        onEnded={() => {
          const video = videoRef.current;
          if (video) {
            video.currentTime = 0;
          }
          setPlaybackState("idle");
        }}
      />

      <span className={styles.videoStatus}>Muted</span>

      {playbackState === "idle" || playbackState === "paused" ? (
        <button
          type="button"
          className={styles.videoPlayButton}
          onClick={togglePlayback}
          aria-label={`${
            playbackState === "paused" ? "Resume" : "Play"
          } ${name} product video`}
        >
          <PlayIcon />
        </button>
      ) : null}

      {playbackState === "starting" ? (
        <span
          className={styles.videoPlaybackSpinner}
          aria-label="Loading video"
        />
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
  backgroundColor,
  appearanceMode,
  phoneHref,
  whatsappNumber,
  showPrices,
  showOrdering,
  acceptingOrders,
  deliveryEnabled,
  pickupEnabled,
  estimatedDeliveryMinutes,
  deliveryPromiseLabel,
  inCart,
  cartCount,
  onClose,
  onAddToCart,
  onDecreaseCart,
  onOpenCart,
}: ProductDetailExperienceProps) {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [shareState, setShareState] = useState("");
  // DARIK_RENDERED_STOREFRONT_THEME_INHERITANCE_181
  const [renderedStoreTheme181, setRenderedStoreTheme181] = useState<{
    primary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
    buttonText: string;
    appearance: "light" | "dark";
    fontFamily: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    const storefrontRoot = document.querySelector(
      'main[data-theme][data-appearance][data-theme-field]'
    ) as HTMLElement | null;

    if (!storefrontRoot) return;

    const rootComputed = window.getComputedStyle(storefrontRoot);

    const cssVariable181 = (name: string) =>
      rootComputed.getPropertyValue(name).trim();

    const usableColor181 = (value: string | null | undefined) => {
      const clean = String(value || "").trim().toLowerCase();
      return Boolean(
        clean &&
          clean !== "transparent" &&
          clean !== "rgba(0, 0, 0, 0)" &&
          clean !== "rgba(0,0,0,0)"
      );
    };

    const rgb181 = (value: string) => {
      const clean = value.trim();

      const rgbMatch = clean.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)/i);
      if (rgbMatch) {
        return [
          Number(rgbMatch[1]),
          Number(rgbMatch[2]),
          Number(rgbMatch[3]),
        ];
      }

      const hexMatch = clean.match(/^#([0-9a-f]{{6}})$/i);
      if (hexMatch) {
        return [
          parseInt(hexMatch[1].slice(0, 2), 16),
          parseInt(hexMatch[1].slice(2, 4), 16),
          parseInt(hexMatch[1].slice(4, 6), 16),
        ];
      }

      return null;
    };

    const luminance181 = (value: string) => {
      const rgb = rgb181(value);
      if (!rgb) return null;

      const channels = rgb.map((channel) => {
        const normalized = Math.max(0, Math.min(255, channel)) / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : Math.pow((normalized + 0.055) / 1.055, 2.4);
      });

      return (
        channels[0] * 0.2126 +
        channels[1] * 0.7152 +
        channels[2] * 0.0722
      );
    };

    const visibleElement181 = (element: Element | null) => {
      if (!(element instanceof HTMLElement)) return false;
      const rect = element.getBoundingClientRect();
      const computed = window.getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        computed.display !== "none" &&
        computed.visibility !== "hidden"
      );
    };

    const visibleNodes181 = Array.from(
      storefrontRoot.querySelectorAll<HTMLElement>(
        '[class*="price"],[class*="Price"],h1,h2,small,p'
      )
    ).filter(visibleElement181);

    const priceProbe181 =
      visibleNodes181.find((node) =>
        /\bJOD\b/i.test(String(node.textContent || ""))
      ) || null;

    const headingProbe181 =
      visibleNodes181.find((node) =>
        /^(H1|H2)$/.test(node.tagName)
      ) || null;

    const mutedProbe181 =
      visibleNodes181.find((node) =>
        node.tagName === "SMALL"
      ) || null;

    const renderedBackground181 = rootComputed.backgroundColor;
    const background181 = usableColor181(renderedBackground181)
      ? renderedBackground181
      : cssVariable181("--store-background") || backgroundColor || "#F8FAFC";

    const rootText181 = rootComputed.color;
    const headingText181 = headingProbe181
      ? window.getComputedStyle(headingProbe181).color
      : rootText181;
    const text181 = usableColor181(headingText181)
      ? headingText181
      : rootText181 || "#101828";

    const cssAccent181 =
      cssVariable181("--store-accent") || accentColor || "#2563EB";
    const observedAccent181 = priceProbe181
      ? window.getComputedStyle(priceProbe181).color
      : "";

    const observedAccentLuma181 = usableColor181(observedAccent181)
      ? luminance181(observedAccent181)
      : null;
    const textLuma181 = luminance181(text181);

    const accent181 =
      usableColor181(observedAccent181) &&
      observedAccentLuma181 !== null &&
      (textLuma181 === null ||
        Math.abs(observedAccentLuma181 - textLuma181) > 0.08)
        ? observedAccent181
        : cssAccent181;

    const muted181 =
      cssVariable181("--theme-muted") ||
      (mutedProbe181
        ? window.getComputedStyle(mutedProbe181).color
        : "") ||
      (luminance181(background181) !== null &&
      (luminance181(background181) ?? 1) < 0.45
        ? "#B9C0C8"
        : "#667085");

    const backgroundLuma181 = luminance181(background181);
    const appearance181: "light" | "dark" =
      backgroundLuma181 !== null
        ? backgroundLuma181 < 0.45
          ? "dark"
          : "light"
        : storefrontRoot.dataset.appearance === "dark"
          ? "dark"
          : "light";

    const accentLuma181 = luminance181(accent181);
    const buttonText181 =
      accentLuma181 !== null && accentLuma181 > 0.52
        ? "#0B0F12"
        : "#FFFFFF";

    setRenderedStoreTheme181({
      primary: cssVariable181("--store-primary") || primaryColor || "#111827",
      accent: accent181,
      background: background181,
      text: text181,
      muted: muted181,
      buttonText: buttonText181,
      appearance: appearance181,
      fontFamily: rootComputed.fontFamily || "",
    });
  }, [
    open,
    product?.id,
    primaryColor,
    accentColor,
    backgroundColor,
    appearanceMode,
  ]);
  // Customer-app parity: edge-back, swipe-down close, double-tap zoom, pinch zoom, and pan.
  const productEdgeGesture178 = useRef<{ x: number; y: number; time: number; pointerId: number } | null>(null);
  const productEdgeClosed178 = useRef(false);
  const productPullGesture178 = useRef<{ x: number; y: number } | null>(null);
  const productPullClosed178 = useRef(false);
  const lightboxPointers178 = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lightboxGesture178 = useRef<{ x: number; y: number; time: number; pointerId: number } | null>(null);
  const lightboxPinch178 = useRef<{ distance: number; scale: number } | null>(null);
  const lightboxPan178 = useRef<{ x: number; y: number; offsetX: number; offsetY: number; pointerId: number } | null>(null);
  const lightboxLastTap178 = useRef<{ time: number; x: number; y: number } | null>(null);
  const lightboxClosed178 = useRef(false);
  const lightboxTransformRef178 = useRef({ scale: 1, x: 0, y: 0, originX: 50, originY: 50 });
  const [lightboxTransform178, setLightboxTransform178] = useState(lightboxTransformRef178.current);
  // DARIK_PRODUCT_CART_QUANTITY_THEME_PARITY_180
  // The shared parent cart quantity is the permanent source of truth.
  // No temporary '1 added' timer: after the first add, the UI stays at - 1 +.
  function handleAddToCart119() {
    onAddToCart();
  }
  // DARIK_PRODUCT_RETURN_SCROLL_POSITION_179_V2
  useEffect(() => {
    if (!open) return;

    // Keep the exact storefront browse position underneath the full-screen
    // product page. Every close path (Back, X, edge swipe, pull-down, Escape)
    // comes through the same product unmount, so one restore point covers all.
    const returnScrollX179 = window.scrollX;
    const returnScrollY179 = window.scrollY;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;

      // iOS/mobile browsers can settle layout one frame after a fixed portal
      // disappears. Restore twice across animation frames so the final browser
      // position is the exact spot the shopper left.
      window.requestAnimationFrame(() => {
        window.scrollTo(returnScrollX179, returnScrollY179);
        window.requestAnimationFrame(() => {
          window.scrollTo(returnScrollX179, returnScrollY179);
        });
      });
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
  // DARIK_COMPARE_AT_PRICE_PUBLIC_171
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
    "--pd-primary": renderedStoreTheme181?.primary || primaryColor || "#111827",
    "--pd-accent": renderedStoreTheme181?.accent || accentColor || "#2563EB",
    "--pd-background": renderedStoreTheme181?.background || backgroundColor || "#F8FAFC",
    "--pd-text": renderedStoreTheme181?.text || "#101828",
    "--pd-muted": renderedStoreTheme181?.muted || "#667085",
    "--pd-button-text": renderedStoreTheme181?.buttonText || "#FFFFFF",
    fontFamily: renderedStoreTheme181?.fontFamily || undefined,
  } as CSSProperties;

  function setLightboxTransformValue178(next: {
    scale: number;
    x: number;
    y: number;
    originX: number;
    originY: number;
  }) {
    lightboxTransformRef178.current = next;
    setLightboxTransform178(next);
  }

  function resetLightboxTransform178() {
    lightboxPointers178.current.clear();
    lightboxGesture178.current = null;
    lightboxPinch178.current = null;
    lightboxPan178.current = null;
    lightboxLastTap178.current = null;
    lightboxClosed178.current = false;
    setLightboxTransformValue178({
      scale: 1,
      x: 0,
      y: 0,
      originX: 50,
      originY: 50,
    });
  }

  function closeLightbox178() {
    resetLightboxTransform178();
    setLightboxIndex(null);
  }

  function clamp178(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  function lightboxPoint178(event: any) {
    return {
      x: Number(event?.clientX ?? 0),
      y: Number(event?.clientY ?? 0),
    };
  }

  function lightboxDistance178() {
    const points = Array.from(lightboxPointers178.current.values());
    if (points.length < 2) return 0;
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.hypot(dx, dy);
  }

  function lightboxZoomOrigin178(event: any) {
    const target = event?.target;
    if (!(target instanceof HTMLImageElement)) {
      return { x: 50, y: 50 };
    }

    const rect = target.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return { x: 50, y: 50 };
    }

    return {
      x: clamp178(((Number(event.clientX) - rect.left) / rect.width) * 100, 0, 100),
      y: clamp178(((Number(event.clientY) - rect.top) / rect.height) * 100, 0, 100),
    };
  }

  function toggleLightboxZoom178(event: any) {
    const target = event?.target;
    if (!(target instanceof HTMLImageElement)) return;

    const current = lightboxTransformRef178.current;
    if (current.scale > 1.01) {
      setLightboxTransformValue178({
        scale: 1,
        x: 0,
        y: 0,
        originX: 50,
        originY: 50,
      });
      return;
    }

    const origin = lightboxZoomOrigin178(event);
    setLightboxTransformValue178({
      scale: 1.5,
      x: 0,
      y: 0,
      originX: origin.x,
      originY: origin.y,
    });
  }

  function handleProductEdgePointerDown178(event: any) {
    productEdgeClosed178.current = false;
    productEdgeGesture178.current = {
      x: Number(event?.clientX ?? 0),
      y: Number(event?.clientY ?? 0),
      time: Date.now(),
      pointerId: Number(event?.pointerId ?? -1),
    };

    try {
      event.currentTarget?.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is only a reliability enhancement.
    }
  }

  function handleProductEdgePointerMove178(event: any) {
    if (productEdgeClosed178.current) return;

    const start = productEdgeGesture178.current;
    if (!start || Number(event?.pointerId ?? -2) !== start.pointerId) return;

    const dx = Number(event?.clientX ?? 0) - start.x;
    const dy = Number(event?.clientY ?? 0) - start.y;
    const elapsed = Math.max(1, Date.now() - start.time);
    const velocityX = dx / elapsed;

    const movingRight = dx > 0;
    const mostlyHorizontal = dx > Math.abs(dy) * 1.24;
    const farEnough = dx > 88;
    const fastEnough = dx > 62 && velocityX > 0.42;

    if (movingRight && mostlyHorizontal && (farEnough || fastEnough)) {
      productEdgeClosed178.current = true;
      productEdgeGesture178.current = null;
      onClose();
    }
  }

  function resetProductEdgeGesture178() {
    productEdgeGesture178.current = null;
    productEdgeClosed178.current = false;
  }

  function handleProductPullTouchStart178(event: any) {
    productPullClosed178.current = false;
    const node = event?.currentTarget as HTMLElement | null;
    if (!node || node.scrollTop > 1) {
      productPullGesture178.current = null;
      return;
    }

    const touch = event?.touches?.[0] ?? event?.nativeEvent?.touches?.[0];
    if (!touch) {
      productPullGesture178.current = null;
      return;
    }

    productPullGesture178.current = {
      x: Number(touch.clientX ?? touch.pageX ?? 0),
      y: Number(touch.clientY ?? touch.pageY ?? 0),
    };
  }

  function handleProductPullTouchMove178(event: any) {
    if (productPullClosed178.current) return;

    const start = productPullGesture178.current;
    const node = event?.currentTarget as HTMLElement | null;
    const touch = event?.touches?.[0] ?? event?.nativeEvent?.touches?.[0];

    if (!start || !node || !touch || node.scrollTop > 1) return;

    const dx = Number(touch.clientX ?? touch.pageX ?? 0) - start.x;
    const dy = Number(touch.clientY ?? touch.pageY ?? 0) - start.y;

    if (dy > 128 && dy > Math.abs(dx) * 1.24) {
      productPullClosed178.current = true;
      productPullGesture178.current = null;
      onClose();
    }
  }

  function resetProductPullGesture178() {
    productPullGesture178.current = null;
    productPullClosed178.current = false;
  }

  function handleLightboxPointerDown178(event: any) {
    if (lightboxIndex === null) return;

    const pointerId = Number(event?.pointerId ?? -1);
    const point = lightboxPoint178(event);
    lightboxPointers178.current.set(pointerId, point);
    lightboxClosed178.current = false;

    try {
      event.currentTarget?.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is only a reliability enhancement.
    }

    if (lightboxPointers178.current.size >= 2) {
      const distance = lightboxDistance178();
      if (distance > 0) {
        lightboxPinch178.current = {
          distance,
          scale: lightboxTransformRef178.current.scale,
        };
      }
      lightboxGesture178.current = null;
      lightboxPan178.current = null;
      lightboxLastTap178.current = null;
      return;
    }

    lightboxGesture178.current = {
      x: point.x,
      y: point.y,
      time: Date.now(),
      pointerId,
    };

    const current = lightboxTransformRef178.current;
    if (current.scale > 1.01) {
      lightboxPan178.current = {
        x: point.x,
        y: point.y,
        offsetX: current.x,
        offsetY: current.y,
        pointerId,
      };
    } else {
      lightboxPan178.current = null;
    }
  }

  function handleLightboxPointerMove178(event: any) {
    if (lightboxIndex === null || lightboxClosed178.current) return;

    const pointerId = Number(event?.pointerId ?? -1);
    const point = lightboxPoint178(event);

    if (lightboxPointers178.current.has(pointerId)) {
      lightboxPointers178.current.set(pointerId, point);
    }

    if (lightboxPointers178.current.size >= 2 && lightboxPinch178.current) {
      const distance = lightboxDistance178();
      if (distance <= 0) return;

      const nextScale = clamp178(
        lightboxPinch178.current.scale *
          (distance / Math.max(1, lightboxPinch178.current.distance)),
        1,
        4
      );

      const current = lightboxTransformRef178.current;
      const next = {
        ...current,
        scale: nextScale,
        x: nextScale <= 1.01 ? 0 : current.x,
        y: nextScale <= 1.01 ? 0 : current.y,
      };
      setLightboxTransformValue178(next);
      return;
    }

    const current = lightboxTransformRef178.current;
    const pan = lightboxPan178.current;

    if (
      current.scale > 1.01 &&
      pan &&
      pan.pointerId === pointerId
    ) {
      const rawX = pan.offsetX + (point.x - pan.x);
      const rawY = pan.offsetY + (point.y - pan.y);
      const maxX =
        typeof window !== "undefined"
          ? Math.max(40, window.innerWidth * (current.scale - 1) * 0.48)
          : 240;
      const maxY =
        typeof window !== "undefined"
          ? Math.max(40, window.innerHeight * (current.scale - 1) * 0.48)
          : 240;

      setLightboxTransformValue178({
        ...current,
        x: clamp178(rawX, -maxX, maxX),
        y: clamp178(rawY, -maxY, maxY),
      });
      return;
    }

    const start = lightboxGesture178.current;
    if (!start || start.pointerId !== pointerId) return;

    const dx = point.x - start.x;
    const dy = point.y - start.y;
    const elapsed = Math.max(1, Date.now() - start.time);
    const velocityX = dx / elapsed;

    // Exact customer-app close behavior: clean right swipe OR intentional pull down.
    const closeRight =
      dx > 0 &&
      Math.abs(dx) > Math.abs(dy) * 1.08 &&
      (dx > 66 || (dx > 42 && velocityX > 0.3));

    const closeDown =
      dy > 70 &&
      Math.abs(dy) > Math.abs(dx) * 1.08;

    if (closeRight || closeDown) {
      lightboxClosed178.current = true;
      closeLightbox178();
    }
  }

  function handleLightboxPointerUp178(event: any) {
    const pointerId = Number(event?.pointerId ?? -1);
    const point = lightboxPoint178(event);
    const start = lightboxGesture178.current;
    const pointerType = String(event?.pointerType ?? "");

    lightboxPointers178.current.delete(pointerId);

    if (lightboxPointers178.current.size < 2) {
      lightboxPinch178.current = null;
    }

    if (lightboxPointers178.current.size === 1) {
      const remaining =
        Array.from(lightboxPointers178.current.entries())[0];
      const current = lightboxTransformRef178.current;
      if (remaining && current.scale > 1.01) {
        const [remainingId, remainingPoint] = remaining;
        lightboxPan178.current = {
          x: remainingPoint.x,
          y: remainingPoint.y,
          offsetX: current.x,
          offsetY: current.y,
          pointerId: remainingId,
        };
      }
    } else if (lightboxPointers178.current.size === 0) {
      lightboxPan178.current = null;
    }

    if (
      !lightboxClosed178.current &&
      start &&
      start.pointerId === pointerId &&
      pointerType !== "mouse" &&
      Math.abs(point.x - start.x) < 14 &&
      Math.abs(point.y - start.y) < 14 &&
      Date.now() - start.time < 360 &&
      event?.target instanceof HTMLImageElement
    ) {
      const previousTap = lightboxLastTap178.current;
      const now = Date.now();

      if (
        previousTap &&
        now - previousTap.time <= 320 &&
        Math.abs(previousTap.x - point.x) <= 76 &&
        Math.abs(previousTap.y - point.y) <= 76
      ) {
        lightboxLastTap178.current = null;
        toggleLightboxZoom178(event);
      } else {
        lightboxLastTap178.current = {
          time: now,
          x: point.x,
          y: point.y,
        };
      }
    }

    if (lightboxPointers178.current.size === 0) {
      lightboxGesture178.current = null;
      lightboxClosed178.current = false;
    }
  }

  function handleLightboxPointerCancel178(event: any) {
    const pointerId = Number(event?.pointerId ?? -1);
    lightboxPointers178.current.delete(pointerId);

    if (lightboxPointers178.current.size < 2) {
      lightboxPinch178.current = null;
    }

    if (lightboxPointers178.current.size === 0) {
      lightboxGesture178.current = null;
      lightboxPan178.current = null;
      lightboxClosed178.current = false;
    }
  }

  function handleLightboxWheel178(event: any) {
    if (!(event?.target instanceof HTMLImageElement)) return;

    event.preventDefault?.();

    const current = lightboxTransformRef178.current;
    const direction = Number(event?.deltaY ?? 0) < 0 ? 0.18 : -0.18;
    const nextScale = clamp178(current.scale + direction, 1, 4);
    const origin = lightboxZoomOrigin178(event);

    setLightboxTransformValue178({
      scale: nextScale,
      x: nextScale <= 1.01 ? 0 : current.x,
      y: nextScale <= 1.01 ? 0 : current.y,
      originX: nextScale <= 1.01 ? 50 : origin.x,
      originY: nextScale <= 1.01 ? 50 : origin.y,
    });
  }

  function scrollGallery(index: number) {
    const width = galleryRef.current?.clientWidth || 0;
    galleryRef.current?.scrollTo({ left: width * index, behavior: "smooth" });
    setGalleryIndex(index);
  }

  function openViewer(index: number) {
    galleryRef.current
      ?.querySelectorAll<HTMLVideoElement>("video")
      .forEach((video) => video.pause());
    resetLightboxTransform178();
    setLightboxIndex(index);
  }

  function scrollViewer(index: number) {
    resetLightboxTransform178();
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
    <div className={styles.overlay} style={rootStyle} data-pd-appearance={renderedStoreTheme181?.appearance || (appearanceMode === "dark" ? "dark" : "light")} role="dialog" aria-modal="true" aria-label={`${name} product details`}>
      <div className={styles.ambientOne} />
      <div className={styles.ambientTwo} />

      <section className={styles.productPage}>
        <div
          className={styles.productEdgeSwipeZone178}
          onPointerDown={handleProductEdgePointerDown178}
          onPointerMove={handleProductEdgePointerMove178}
          onPointerUp={resetProductEdgeGesture178}
          onPointerCancel={resetProductEdgeGesture178}
          aria-hidden="true"
        />
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
            <button
              type="button"
              className={`${styles.iconButton} ${styles.productCartButton180}`}
              onClick={onOpenCart}
              aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            >
              <BagIcon />
              <span className={styles.productCartLabel180}>Cart</span>
              {cartCount > 0 ? (
                <strong className={styles.productCartBadge180}>
                  {cartCount > 99 ? "99+" : cartCount}
                </strong>
              ) : null}
            </button>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close product details">
              <CloseIcon />
            </button>
          </div>
        </header>

        <div
          className={styles.productLayout}
          onTouchStart={handleProductPullTouchStart178}
          onTouchMove={handleProductPullTouchMove178}
          onTouchEnd={resetProductPullGesture178}
          onTouchCancel={resetProductPullGesture178}
        >
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
                  {hasCompareAt ? <del className={styles.darikCompareAtPrice171}>{money(compareAt)}</del> : null}
          <strong>
                    {contactPricing
                      ? "Price on request"
                      : showPrices
                        ? money(product.app_price)
                        : "Contact for price"}
                  </strong>
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
                    <span>Details / التفاصيل</span>
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
                        {deliveryPromiseLabel || estimatedDeliveryMinutes
                          ? deliveryPromiseLabel || `About ${estimatedDeliveryMinutes} min`
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
                    <strong>
                      {inCart > 0 ? `${inCart} in your bag` : "Ready when you are"}
                    </strong>
                    <small>{acceptingOrders ? "Store is accepting orders" : "Ordering is paused"}</small>
                  </div>

                  {inCart > 0 ? (
                    <div className={styles.productCartActions180}>
                      <div className={styles.productQuantitySelector180} aria-label="Product quantity in cart">
                        <button
                          type="button"
                          onClick={onDecreaseCart}
                          aria-label="Remove one from cart"
                        >
                          <span aria-hidden="true">−</span>
                        </button>
                        <strong aria-live="polite">{inCart}</strong>
                        <button
                          type="button"
                          onClick={handleAddToCart119}
                          disabled={!acceptingOrders || !available}
                          aria-label="Add one more to cart"
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        className={`${styles.primaryAction} ${styles.viewCartAction180}`}
                        onClick={onOpenCart}
                      >
                        <BagIcon />
                        <span>View cart</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.primaryAction}
                      onClick={handleAddToCart119}
                      disabled={!acceptingOrders || !available}
                    >
                      <BagIcon />
                      <span>{available ? "Add to bag" : "Out of stock"}</span>
                    </button>
                  )}
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
          onPointerDown={handleLightboxPointerDown178}
          onPointerMove={handleLightboxPointerMove178}
          onPointerUp={handleLightboxPointerUp178}
          onPointerCancel={handleLightboxPointerCancel178}
          onDoubleClick={toggleLightboxZoom178}
          onWheel={handleLightboxWheel178}
        >
          <div className={styles.lightboxTop}>
            <span>{name}</span>
            <strong>
              {slides[lightboxIndex]?.kind === "video" ? "VIDEO" : "PHOTO"} · {lightboxIndex + 1} / {slides.length}
            </strong>
            <button
              type="button"
              onClick={closeLightbox178}
              aria-label="Back from full-screen product media"
            >
              <ArrowIcon direction="left" />
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
                    style={
                      index === lightboxIndex
                        ? {
                            transform: `translate3d(${lightboxTransform178.x}px, ${lightboxTransform178.y}px, 0) scale(${lightboxTransform178.scale})`,
                            transformOrigin: `${lightboxTransform178.originX}% ${lightboxTransform178.originY}%`,
                          }
                        : undefined
                    }
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

          <div className={styles.lightboxHint178}>
            Double tap to zoom/reset • Swipe right/down to close
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
