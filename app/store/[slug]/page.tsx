"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./storefront.module.css";

type Storefront = {
  id: string;
  retailer_id: string;
  slug: string;
  display_name: string;
  display_name_ar: string | null;
  tagline: string | null;
  tagline_ar: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  business_phone: string | null;
  whatsapp_number: string | null;
  public_email: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  address_text: string | null;
  about_text: string | null;
  about_text_ar: string | null;
  custom_links: Array<{ label: string; url: string }> | null;
  custom_information: Array<{ label: string; value: string }> | null;
  operating_hours: Record<string, string> | null;
  primary_color: string;
  accent_color: string;
  background_color: string;
  is_accepting_orders: boolean;
  minimum_order: number | string;
  delivery_fee: number | string;
  estimated_delivery_minutes: number | null;
  cash_on_delivery_enabled: boolean;
  cliq_enabled: boolean;
  card_enabled: boolean;
  pickup_enabled: boolean;
  business_name: string;
};

type Product = {
  storefront_id: string;
  storefront_slug: string;
  id: string;
  retailer_id: string;
  category_id: string | null;
  direct_store_category_id: string | null;
  direct_store_category_name: string | null;
  direct_store_category_name_ar: string | null;
  direct_store_category_slug: string | null;
  subcategory_name: string | null;
  name: string;
  official_marketplace_name: string | null;
  official_marketplace_name_ar: string | null;
  brand_name: string | null;
  description: string | null;
  app_price: number | string | null;
  quantity_in_stock: number | string | null;
  official_product_photo_url: string | null;
  official_product_thumbnail_url: string | null;
  official_product_photo_url_2: string | null;
  storefront_featured: boolean;
  storefront_sort_order: number | string;
};

type Category = {
  id: string;
  retailer_id: string;
  storefront_id: string;
  storefront_slug: string;
  name: string;
  name_ar: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | string;
  product_count: number | string;
};

type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photoUrl: string | null;
};

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

function normalizeExternalUrl(value: string | null | undefined) {
  const clean = String(value ?? "").trim();
  if (!clean) return null;

  try {
    const candidate = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function phoneHref(value: string | null | undefined) {
  const clean = String(value ?? "").trim();
  if (!clean) return null;
  const normalized = clean.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

function whatsappHref(value: string | null | undefined) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

function emailHref(value: string | null | undefined) {
  const clean = String(value ?? "").trim();
  return clean && clean.includes("@") ? `mailto:${clean}` : null;
}

export default function DarikDirectStorefrontPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = normalizeParam(params?.slug);

  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const storageKey = `darik-direct-cart:${slug}`;

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setCart(JSON.parse(saved) as CartLine[]);
    } catch {
      setCart([]);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    const storageKey = `darik-direct-cart:${slug}`;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // Cart persistence is optional.
    }
  }, [cart, slug]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function loadStorefront() {
      setLoading(true);
      setLoadError("");

      const storefrontResult = await supabase
        .from("public_retailer_storefronts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;

      if (storefrontResult.error || !storefrontResult.data) {
        setStorefront(null);
        setProducts([]);
        setLoadError(
          storefrontResult.error?.message ||
            "This Darik Direct storefront is not published."
        );
        setLoading(false);
        return;
      }

      const currentStorefront = storefrontResult.data as Storefront;
      setStorefront(currentStorefront);

      const [productResult, categoryResult] = await Promise.all([
        supabase
          .from("public_storefront_products")
          .select("*")
          .eq("storefront_slug", slug)
          .order("storefront_featured", { ascending: false })
          .order("storefront_sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("public_storefront_categories")
          .select("*")
          .eq("storefront_slug", slug)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
      ]);

      if (cancelled) return;

      if (productResult.error) {
        setLoadError(productResult.error.message);
      } else {
        setProducts((productResult.data ?? []) as unknown as Product[]);
      }

      if (!categoryResult.error) {
        setCategories((categoryResult.data ?? []) as unknown as Category[]);
      }

      setLoading(false);
    }

    loadStorefront();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const visibleCategories = useMemo(
    () =>
      categories.filter(
        (category) => Number(category.product_count ?? 0) > 0
      ),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      if (
        selectedCategoryId !== "all" &&
        product.direct_store_category_id !== selectedCategoryId
      ) {
        return false;
      }

      if (!cleanSearch) return true;

      return [
        product.name,
        product.official_marketplace_name,
        product.official_marketplace_name_ar,
        product.brand_name,
        product.subcategory_name,
        product.description,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(cleanSearch));
    });
  }, [products, search, selectedCategoryId]);

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, line) => total + line.price * line.quantity, 0),
    [cart]
  );

  const deliveryFee = Number(storefront?.delivery_fee ?? 0);
  const orderTotal = cartSubtotal + deliveryFee;
  const minimumOrder = Number(storefront?.minimum_order ?? 0);
  const minimumReached = cartSubtotal >= minimumOrder;

  function addToCart(product: Product) {
    const price = Number(product.app_price ?? 0);
    if (!Number.isFinite(price) || price <= 0) return;

    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id);

      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name:
            product.official_marketplace_name ||
            product.name ||
            "Darik product",
          price,
          quantity: 1,
          photoUrl:
            product.official_product_thumbnail_url ||
            product.official_product_photo_url,
        },
      ];
    });

    setCartOpen(true);
  }

  function changeQuantity(productId: string, change: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + change }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  if (loading) {
    return (
      <main className={styles.statePage}>
        <div className={styles.spinner} />
        <h1>Loading Darik Direct storefront…</h1>
      </main>
    );
  }

  if (!storefront) {
    return (
      <main className={styles.statePage}>
        <div className={styles.stateCard}>
          <span className={styles.stateBadge}>Darik Direct</span>
          <h1>Storefront unavailable</h1>
          <p>{loadError || "This storefront could not be found."}</p>
          <a href="/">Return to Darik</a>
        </div>
      </main>
    );
  }

  const themeStyle = {
    "--store-primary": storefront.primary_color || "#111827",
    "--store-accent": storefront.accent_color || "#2563EB",
    "--store-background": storefront.background_color || "#F8FAFC",
  } as CSSProperties;

  const heroStyle = storefront.hero_image_url
    ? ({
        backgroundImage: `linear-gradient(120deg, color-mix(in srgb, var(--store-primary) 88%, rgba(0, 0, 0, 0.38)), color-mix(in srgb, var(--store-accent) 64%, rgba(0, 0, 0, 0.4))), url(${JSON.stringify(
          storefront.hero_image_url
        )})`,
      } as CSSProperties)
    : undefined;

  const contactLinks = [
    {
      label: "Call",
      detail: storefront.business_phone,
      href: phoneHref(storefront.business_phone),
    },
    {
      label: "WhatsApp",
      detail: storefront.whatsapp_number,
      href: whatsappHref(storefront.whatsapp_number),
    },
    {
      label: "Email",
      detail: storefront.public_email,
      href: emailHref(storefront.public_email),
    },
    {
      label: "Website",
      detail: "Visit website",
      href: normalizeExternalUrl(storefront.website_url),
    },
    {
      label: "Facebook",
      detail: "Facebook",
      href: normalizeExternalUrl(storefront.facebook_url),
    },
    {
      label: "Instagram",
      detail: "Instagram",
      href: normalizeExternalUrl(storefront.instagram_url),
    },
    ...(Array.isArray(storefront.custom_links)
      ? storefront.custom_links.map((link) => ({
          label: String(link.label ?? "").trim(),
          detail: String(link.label ?? "").trim(),
          href: normalizeExternalUrl(link.url),
        }))
      : []),
  ].filter(
    (link): link is { label: string; detail: string; href: string } =>
      Boolean(link.label && link.detail && link.href)
  );

  const customInformation = Array.isArray(storefront.custom_information)
    ? storefront.custom_information.filter(
        (item) =>
          String(item?.label ?? "").trim() &&
          String(item?.value ?? "").trim()
      )
    : [];

  const operatingHours = storefront.operating_hours ?? {};
  const visibleHours = [
    ["sunday", "Sunday"],
    ["monday", "Monday"],
    ["tuesday", "Tuesday"],
    ["wednesday", "Wednesday"],
    ["thursday", "Thursday"],
    ["friday", "Friday"],
    ["saturday", "Saturday"],
  ].filter(([day]) => String(operatingHours[day] ?? "").trim());

  const hasStoreProfile =
    Boolean(storefront.about_text || storefront.about_text_ar) ||
    Boolean(storefront.address_text) ||
    customInformation.length > 0 ||
    visibleHours.length > 0;

  return (
    <main className={styles.page} style={themeStyle}>
      <header className={styles.header}>
        <a className={styles.darikMark} href="/">
          Darik Direct
        </a>

        <button className={styles.cartButton} onClick={() => setCartOpen(true)}>
          Cart
          <span>{cartCount}</span>
        </button>
      </header>

      <section
        className={`${styles.hero} ${
          storefront.hero_image_url ? styles.heroWithImage : ""
        }`}
        style={heroStyle}
      >
        <div className={styles.brandBlock}>
          <div className={styles.logoWrap}>
            {storefront.logo_url ? (
              <img
                src={storefront.logo_url}
                alt={`${storefront.display_name} logo`}
              />
            ) : (
              <span>{storefront.display_name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>

          <div>
            <p className={styles.eyebrow}>Powered by Darik</p>
            <h1>{storefront.display_name}</h1>
            {storefront.display_name_ar ? (
              <p className={styles.arabicName} dir="rtl">
                {storefront.display_name_ar}
              </p>
            ) : null}

            <p className={styles.tagline}>
              {storefront.tagline || "Local products delivered to your door."}
            </p>

            {storefront.tagline_ar ? (
              <p className={styles.arabicTagline} dir="rtl">
                {storefront.tagline_ar}
              </p>
            ) : null}

            {contactLinks.length > 0 ? (
              <div className={styles.heroContactLinks}>
                {contactLinks.slice(0, 6).map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noreferrer"
                        : undefined
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.deliveryFacts}>
          <div>
            <strong>
              {storefront.is_accepting_orders ? "Open for orders" : "Not accepting orders"}
            </strong>
            <span>Store status</span>
          </div>
          <div>
            <strong>{money(storefront.delivery_fee)}</strong>
            <span>Delivery</span>
          </div>
          <div>
            <strong>
              {storefront.estimated_delivery_minutes
                ? `${storefront.estimated_delivery_minutes} min`
                : "Store estimate"}
            </strong>
            <span>Estimated time</span>
          </div>
        </div>
      </section>

      {hasStoreProfile || contactLinks.length > 0 ? (
        <section className={styles.storeProfile}>
          {(storefront.about_text ||
            storefront.about_text_ar ||
            storefront.address_text) ? (
            <article className={styles.aboutCard}>
              <p className={styles.profileEyebrow}>About the store</p>
              <h2>{storefront.display_name}</h2>

              {storefront.about_text ? (
                <p className={styles.aboutText}>{storefront.about_text}</p>
              ) : null}

              {storefront.about_text_ar ? (
                <p className={styles.aboutTextArabic} dir="rtl">
                  {storefront.about_text_ar}
                </p>
              ) : null}

              {storefront.address_text ? (
                <div className={styles.addressLine}>
                  <strong>Address</strong>
                  <span>{storefront.address_text}</span>
                </div>
              ) : null}
            </article>
          ) : null}

          {(customInformation.length > 0 || visibleHours.length > 0) ? (
            <div className={styles.profileSide}>
              {customInformation.length > 0 ? (
                <div className={styles.informationGrid}>
                  {customInformation.map((item, index) => (
                    <article key={`${item.label}-${index}`}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </article>
                  ))}
                </div>
              ) : null}

              {visibleHours.length > 0 ? (
                <article className={styles.hoursCard}>
                  <div>
                    <p className={styles.profileEyebrow}>Business hours</p>
                    <h3>Opening times</h3>
                  </div>
                  <dl>
                    {visibleHours.map(([day, label]) => (
                      <div key={day}>
                        <dt>{label}</dt>
                        <dd>{operatingHours[day]}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ) : null}
            </div>
          ) : null}

          {contactLinks.length > 0 ? (
            <div className={styles.contactDirectory}>
              {contactLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}-directory`}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noreferrer"
                      : undefined
                  }
                >
                  <span>{link.label}</span>
                  <strong>{link.detail}</strong>
                </a>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className={styles.catalogToolbar}>
        <label className={styles.searchBox}>
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${storefront.display_name}`}
          />
        </label>

        <div className={styles.categoryRow}>
          <button
            className={selectedCategoryId === "all" ? styles.activeChip : styles.chip}
            onClick={() => setSelectedCategoryId("all")}
          >
            All products
          </button>

          {visibleCategories.map((category) => (
            <button
              key={category.id}
              className={
                selectedCategoryId === category.id
                  ? styles.activeChip
                  : styles.chip
              }
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.image_url ? (
                <img src={category.image_url} alt="" />
              ) : null}
              <span>{category.name}</span>
              <small>{Number(category.product_count ?? 0)}</small>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionTitle}>
          <div>
            <p>Online catalog</p>
            <h2>{filteredProducts.length} available products</h2>
          </div>
          <span>{storefront.business_name}</span>
        </div>

        {loadError ? <p className={styles.notice}>{loadError}</p> : null}

        {filteredProducts.length === 0 ? (
          <div className={styles.emptyCatalog}>
            <h3>No products found</h3>
            <p>Try another category or search term.</p>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => {
              const photo =
                product.official_product_thumbnail_url ||
                product.official_product_photo_url ||
                product.official_product_photo_url_2;

              return (
                <article className={styles.productCard} key={product.id}>
                  <div className={styles.productImage}>
                    {photo ? (
                      <img
                        src={photo}
                        alt={
                          product.official_marketplace_name ||
                          product.name ||
                          "Product"
                        }
                      />
                    ) : (
                      <span>No image</span>
                    )}

                    {product.storefront_featured ? (
                      <strong className={styles.featuredTag}>Featured</strong>
                    ) : null}
                  </div>

                  <div className={styles.productBody}>
                    <p className={styles.productMeta}>
                      {product.direct_store_category_name ||
                        product.brand_name ||
                        "Available now"}
                    </p>
                    <h3>
                      {product.official_marketplace_name || product.name}
                    </h3>
                    <div className={styles.productFooter}>
                      <strong>{money(product.app_price)}</strong>
                      <button
                        disabled={!storefront.is_accepting_orders}
                        onClick={() => addToCart(product)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className={styles.storeFooter}>
        <div>
          <strong>{storefront.display_name}</strong>
          <span>Darik Direct storefront</span>
        </div>

        <div className={styles.footerLinks}>
          {contactLinks.slice(0, 8).map((link) => (
            <a
              key={`${link.label}-${link.href}-footer`}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a href="/">Powered by Darik</a>
      </footer>

      {cartOpen ? (
        <div className={styles.cartOverlay} onClick={() => setCartOpen(false)}>
          <aside
            className={styles.cartDrawer}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.cartHeader}>
              <div>
                <p>Darik Direct order</p>
                <h2>Your cart</h2>
              </div>
              <button onClick={() => setCartOpen(false)}>Close</button>
            </div>

            <div className={styles.cartLines}>
              {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                  <h3>Your cart is empty</h3>
                  <p>Add products from {storefront.display_name}.</p>
                </div>
              ) : (
                cart.map((line) => (
                  <div className={styles.cartLine} key={line.productId}>
                    <div className={styles.cartThumb}>
                      {line.photoUrl ? (
                        <img src={line.photoUrl} alt={line.name} />
                      ) : (
                        <span>{line.name.slice(0, 1)}</span>
                      )}
                    </div>
                    <div className={styles.cartLineInfo}>
                      <h3>{line.name}</h3>
                      <p>{money(line.price)}</p>
                    </div>
                    <div className={styles.quantity}>
                      <button onClick={() => changeQuantity(line.productId, -1)}>
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button onClick={() => changeQuantity(line.productId, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles.cartSummary}>
              <div>
                <span>Subtotal</span>
                <strong>{money(cartSubtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{money(deliveryFee)}</strong>
              </div>
              <div className={styles.cartTotal}>
                <span>Total</span>
                <strong>{money(orderTotal)}</strong>
              </div>

              {!minimumReached ? (
                <p className={styles.minimumWarning}>
                  Add {money(minimumOrder - cartSubtotal)} to reach the minimum
                  order.
                </p>
              ) : null}

              <button
                className={styles.checkoutButton}
                disabled={
                  cart.length === 0 ||
                  !minimumReached ||
                  !storefront.is_accepting_orders
                }
                title="Checkout is the next Darik Direct build phase."
              >
                Checkout setup is next
              </button>

              <p className={styles.checkoutNote}>
                The storefront catalog and store-specific cart are active. Direct
                checkout will be connected to the existing Darik order flow next.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
