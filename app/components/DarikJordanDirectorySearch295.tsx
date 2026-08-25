"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../home.module.css";

type DirectoryResult295 = {
  result_type?: "store" | "product" | string;
  storefront_slug?: string | null;
  storefront_name?: string | null;
  storefront_name_ar?: string | null;
  storefront_logo_url?: string | null;
  product_id?: string | null;
  product_name?: string | null;
  product_name_ar?: string | null;
  product_image_url?: string | null;
  price_text?: string | null;
  pricing_mode?: string | null;
  availability_status?: string | null;
  category_name?: string | null;
  score?: number | null;
};

type Props295 = {
  className?: string;
};

function clean295(value: unknown) {
  return String(value ?? "").trim();
}

function storeTitle295(row: DirectoryResult295) {
  return clean295(row.storefront_name) ||
    clean295(row.storefront_name_ar) ||
    clean295(row.storefront_slug) ||
    "Darik store";
}

function productTitle295(row: DirectoryResult295) {
  return clean295(row.product_name) ||
    clean295(row.product_name_ar) ||
    "Product";
}

function productHref295(row: DirectoryResult295) {
  const slug295 = clean295(row.storefront_slug);
  const productId295 = clean295(row.product_id);

  if (!slug295) return "/";

  if (!productId295) {
    return "/" + encodeURIComponent(slug295);
  }

  return (
    "/" +
    encodeURIComponent(slug295) +
    "?product=" +
    encodeURIComponent(productId295) +
    "#catalog"
  );
}

function storeHref295(row: DirectoryResult295) {
  const slug295 = clean295(row.storefront_slug);
  return slug295 ? "/" + encodeURIComponent(slug295) : "/";
}

export default function DarikJordanDirectorySearch295({
  className = "",
}: Props295) {
  const [query295, setQuery295] = useState("");
  const [results295, setResults295] = useState<DirectoryResult295[]>([]);
  const [loading295, setLoading295] = useState(false);
  const [error295, setError295] = useState("");
  const [open295, setOpen295] = useState(false);
  const rootRef295 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown295 = (event295: PointerEvent) => {
      const target295 = event295.target;

      if (
        target295 instanceof Node &&
        rootRef295.current &&
        !rootRef295.current.contains(target295)
      ) {
        setOpen295(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown295);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown295);
    };
  }, []);

  useEffect(() => {
    const cleanQuery295 = query295.trim();

    if (cleanQuery295.length < 2) {
      setResults295([]);
      setLoading295(false);
      setError295("");
      return;
    }

    const controller295 = new AbortController();

    const timer295 = window.setTimeout(() => {
      setLoading295(true);
      setError295("");

      void fetch(
        "/api/darik-direct/jordan-directory-search?q=" +
          encodeURIComponent(cleanQuery295),
        {
          method: "GET",
          cache: "no-store",
          signal: controller295.signal,
        }
      )
        .then(async (response295) => {
          const payload295 = (await response295
            .json()
            .catch(() => ({}))) as {
            ok?: boolean;
            results?: DirectoryResult295[];
            error?: string;
          };

          if (!response295.ok || !payload295.ok) {
            throw new Error(
              payload295.error || "Could not search Darik right now."
            );
          }

          setResults295(
            Array.isArray(payload295.results)
              ? payload295.results
              : []
          );
          setOpen295(true);
        })
        .catch((error: unknown) => {
          if (controller295.signal.aborted) return;

          setResults295([]);
          setOpen295(true);
          setError295(
            error instanceof Error
              ? error.message
              : "Could not search Darik right now."
          );
        })
        .finally(() => {
          if (!controller295.signal.aborted) {
            setLoading295(false);
          }
        });
    }, 260);

    return () => {
      window.clearTimeout(timer295);
      controller295.abort();
    };
  }, [query295]);

  const directStores295 = useMemo(
    () =>
      results295
        .filter((row295) => row295.result_type === "store")
        .slice(0, 6),
    [results295]
  );

  const productGroups295 = useMemo(() => {
    const groups295 = new Map<
      string,
      {
        store: DirectoryResult295;
        products: DirectoryResult295[];
      }
    >();

    for (const row295 of results295) {
      if (row295.result_type !== "product") continue;

      const slug295 = clean295(row295.storefront_slug);
      if (!slug295) continue;

      const existing295 = groups295.get(slug295);

      if (existing295) {
        if (existing295.products.length < 4) {
          existing295.products.push(row295);
        }
      } else {
        groups295.set(slug295, {
          store: row295,
          products: [row295],
        });
      }
    }

    return Array.from(groups295.values()).slice(0, 16);
  }, [results295]);

  const matchingStoreCount295 = productGroups295.length;

  function go295(href295: string) {
    window.location.assign(href295);
  }

  function onKeyDown295(
    event295: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event295.key === "Escape") {
      setOpen295(false);
      return;
    }

    if (event295.key !== "Enter") return;

    event295.preventDefault();

    const firstProduct295 =
      productGroups295[0]?.products?.[0];

    if (firstProduct295) {
      go295(productHref295(firstProduct295));
      return;
    }

    if (directStores295[0]) {
      go295(storeHref295(directStores295[0]));
    }
  }

  const showPanel295 =
    open295 &&
    query295.trim().length >= 2;

  return (
    <div
      ref={rootRef295}
      className={styles.darikDirectorySearchWrap295}
      data-darik-jordan-directory-search="295"
    >
      <label
        className={`${className} ${styles.darikDirectorySearchInput295}`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <input
          type="search"
          value={query295}
          onChange={(event295) => {
            setQuery295(event295.target.value);
            setOpen295(true);
          }}
          onFocus={() => {
            if (query295.trim().length >= 2) {
              setOpen295(true);
            }
          }}
          onKeyDown={onKeyDown295}
          placeholder="Search for an item or store / ابحث عن منتج أو متجر"
          aria-label="Search Darik for a product or store across Jordan"
          aria-expanded={showPanel295}
          autoComplete="off"
        />

        {loading295 ? (
          <span
            className={styles.darikDirectorySpinner295}
            aria-label="Searching"
          />
        ) : null}
      </label>

      {showPanel295 ? (
        <div
          className={styles.darikDirectoryResults295}
          role="region"
          aria-label="Darik Jordan search results"
        >
          <div className={styles.darikDirectoryResultsTop295}>
            <div>
              <strong>Search across Jordan</strong>
              <span>بحث في متاجر ومنتجات داريك في الأردن</span>
            </div>

            {matchingStoreCount295 > 0 ? (
              <small>
                Found at {matchingStoreCount295}{" "}
                {matchingStoreCount295 === 1
                  ? "store"
                  : "stores"}
              </small>
            ) : null}
          </div>

          {loading295 && results295.length === 0 ? (
            <div className={styles.darikDirectoryState295}>
              Searching Darik stores across Jordan…
            </div>
          ) : null}

          {error295 ? (
            <div className={styles.darikDirectoryState295}>
              {error295}
            </div>
          ) : null}

          {!loading295 &&
          !error295 &&
          results295.length === 0 ? (
            <div className={styles.darikDirectoryState295}>
              <strong>No matches yet</strong>
              <span>
                Try another product name, Arabic spelling, or store name.
              </span>
            </div>
          ) : null}

          {directStores295.length > 0 ? (
            <section className={styles.darikDirectorySection295}>
              <div className={styles.darikDirectorySectionTitle295}>
                <strong>Stores</strong>
                <span>المتاجر</span>
              </div>

              <div className={styles.darikDirectoryStoreMatches295}>
                {directStores295.map((store295) => (
                  <button
                    type="button"
                    key={
                      "store-" +
                      clean295(store295.storefront_slug)
                    }
                    className={
                      styles.darikDirectoryStoreMatch295
                    }
                    onClick={() =>
                      go295(storeHref295(store295))
                    }
                  >
                    <span
                      className={
                        styles.darikDirectoryStoreLogo295
                      }
                    >
                      {clean295(store295.storefront_logo_url) ? (
                        <img
                          src={clean295(
                            store295.storefront_logo_url
                          )}
                          alt=""
                        />
                      ) : (
                        storeTitle295(store295)
                          .slice(0, 1)
                          .toUpperCase()
                      )}
                    </span>

                    <span>
                      <strong>{storeTitle295(store295)}</strong>
                      {clean295(store295.storefront_name_ar) ? (
                        <small dir="rtl">
                          {clean295(
                            store295.storefront_name_ar
                          )}
                        </small>
                      ) : null}
                    </span>

                    <span aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {productGroups295.length > 0 ? (
            <section className={styles.darikDirectorySection295}>
              <div className={styles.darikDirectorySectionTitle295}>
                <strong>
                  Products — available from these stores
                </strong>
                <span>
                  المنتجات — المتاجر التي تعرضها
                </span>
              </div>

              <div className={styles.darikDirectoryProductStores295}>
                {productGroups295.map((group295) => (
                  <article
                    key={
                      "products-" +
                      clean295(
                        group295.store.storefront_slug
                      )
                    }
                    className={
                      styles.darikDirectoryProductStore295
                    }
                  >
                    <button
                      type="button"
                      className={
                        styles.darikDirectoryProductStoreHead295
                      }
                      onClick={() =>
                        go295(storeHref295(group295.store))
                      }
                    >
                      <span
                        className={
                          styles.darikDirectoryStoreLogo295
                        }
                      >
                        {clean295(
                          group295.store.storefront_logo_url
                        ) ? (
                          <img
                            src={clean295(
                              group295.store
                                .storefront_logo_url
                            )}
                            alt=""
                          />
                        ) : (
                          storeTitle295(group295.store)
                            .slice(0, 1)
                            .toUpperCase()
                        )}
                      </span>

                      <span>
                        <strong>
                          {storeTitle295(group295.store)}
                        </strong>
                        <small>
                          {group295.products.length} matching{" "}
                          {group295.products.length === 1
                            ? "item"
                            : "items"}
                        </small>
                      </span>

                      <span>View store</span>
                    </button>

                    <div
                      className={
                        styles.darikDirectoryProductRows295
                      }
                    >
                      {group295.products.map((product295) => {
                        const price295 =
                          clean295(product295.price_text);
                        const callForPrice295 =
                          clean295(
                            product295.pricing_mode
                          ) !== "price";
                        const availability295 =
                          clean295(
                            product295.availability_status
                          );

                        return (
                          <button
                            type="button"
                            key={
                              clean295(product295.product_id) +
                              "-" +
                              clean295(
                                product295.storefront_slug
                              )
                            }
                            className={
                              styles.darikDirectoryProductRow295
                            }
                            onClick={() =>
                              go295(
                                productHref295(product295)
                              )
                            }
                          >
                            <span
                              className={
                                styles.darikDirectoryProductImage295
                              }
                            >
                              {clean295(
                                product295.product_image_url
                              ) ? (
                                <img
                                  src={clean295(
                                    product295.product_image_url
                                  )}
                                  alt=""
                                />
                              ) : (
                                <svg
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path d="M5 7h14v12H5zM8 7a4 4 0 0 1 8 0" />
                                </svg>
                              )}
                            </span>

                            <span
                              className={
                                styles.darikDirectoryProductCopy295
                              }
                            >
                              <strong>
                                {productTitle295(product295)}
                              </strong>

                              {clean295(
                                product295.product_name_ar
                              ) ? (
                                <small dir="rtl">
                                  {clean295(
                                    product295.product_name_ar
                                  )}
                                </small>
                              ) : clean295(
                                  product295.category_name
                                ) ? (
                                <small>
                                  {clean295(
                                    product295.category_name
                                  )}
                                </small>
                              ) : null}
                            </span>

                            <span
                              className={
                                styles.darikDirectoryProductMeta295
                              }
                            >
                              {callForPrice295 ? (
                                <strong>Call for price</strong>
                              ) : price295 ? (
                                <strong>{price295} JOD</strong>
                              ) : null}

                              {availability295 ===
                              "out_of_stock" ? (
                                <small>Out of stock</small>
                              ) : (
                                <small>View item</small>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
