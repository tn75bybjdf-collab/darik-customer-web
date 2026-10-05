"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "../home.module.css";

type StoreResult296 = {
  storefront_slug?: string | null;
  storefront_name?: string | null;
  storefront_name_ar?: string | null;
  storefront_logo_url?: string | null;
  matched_product_count?: number | string | null;
  sample_product_id?: string | null;
  sample_product_name?: string | null;
  sample_product_name_ar?: string | null;
  sample_product_image_url?: string | null;
};

type Props296 = {
  className?: string;
};

function clean296(value: unknown) {
  return String(value ?? "").trim();
}

function storeName296(row: StoreResult296) {
  return (
    clean296(row.storefront_name) ||
    clean296(row.storefront_name_ar) ||
    clean296(row.storefront_slug) ||
    "Darik store"
  );
}

function storeHref296(row: StoreResult296) {
  const slug296 = clean296(row.storefront_slug);
  return slug296 ? "/" + encodeURIComponent(slug296) : "/";
}

function sampleProductHref296(row: StoreResult296) {
  const slug296 = clean296(row.storefront_slug);
  const productId296 = clean296(row.sample_product_id);

  if (!slug296) return "/";

  if (!productId296) {
    return "/" + encodeURIComponent(slug296);
  }

  return (
    "/" +
    encodeURIComponent(slug296) +
    "?product=" +
    encodeURIComponent(productId296) +
    "#catalog"
  );
}

export default function DarikJordanDirectorySearch295({
  className = "",
}: Props296) {
  const [draft296, setDraft296] = useState("");
  const [submitted296, setSubmitted296] = useState("");
  const [results296, setResults296] = useState<StoreResult296[]>([]);
  const [loading296, setLoading296] = useState(false);
  const [error296, setError296] = useState("");
  const resultsRef296 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      document.body.classList.remove(
        "darik-directory-search-active-296"
      );
    };
  }, []);

  async function submitSearch296(event296: FormEvent) {
    event296.preventDefault();

    const query296 = draft296.trim();

    if (query296.length < 2) {
      setError296("Type at least 2 characters.");
      return;
    }

    setSubmitted296(query296);
    setLoading296(true);
    setError296("");
    setResults296([]);

    try {
      const response296 = await fetch(
        "/api/darik-direct/jordan-store-item-search?q=" +
          encodeURIComponent(query296),
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const payload296 = (await response296
        .json()
        .catch(() => ({}))) as {
        ok?: boolean;
        results?: StoreResult296[];
        error?: string;
      };

      if (!response296.ok || !payload296.ok) {
        throw new Error(
          payload296.error || "Could not search Darik right now."
        );
      }

      const nextResults296 = Array.isArray(payload296.results)
        ? payload296.results
        : [];

      setResults296(nextResults296);

      document.body.classList.add(
        "darik-directory-search-active-296"
      );

      window.setTimeout(() => {
        resultsRef296.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 40);
    } catch (error296) {
      setResults296([]);
      setError296(
        error296 instanceof Error
          ? error296.message
          : "Could not search Darik right now."
      );

      document.body.classList.add(
        "darik-directory-search-active-296"
      );
    } finally {
      setLoading296(false);
    }
  }

  function clearSearch296() {
    setDraft296("");
    setSubmitted296("");
    setResults296([]);
    setError296("");
    setLoading296(false);

    document.body.classList.remove(
      "darik-directory-search-active-296"
    );
  }

  return (
    <div
      className={styles.darikDirectorySearch296}
      data-darik-store-item-search="296"
    >
      <form
        className={styles.darikDirectoryForm296}
        onSubmit={submitSearch296}
      >
        <label
          className={`${className} ${styles.darikDirectoryInputShell296}`}
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
            value={draft296}
            onChange={(event296) =>
              setDraft296(event296.target.value)
            }
            placeholder="What are you looking for? / شو بتدور عليه؟"
            aria-label="Search Darik stores by item"
            autoComplete="off"
          />
        </label>

        <button
          type="submit"
          className={styles.darikDirectorySubmit296}
          disabled={loading296}
        >
          {loading296 ? "Searching…" : "Search / بحث"}
        </button>

        {submitted296 ? (
          <button
            type="button"
            className={styles.darikDirectoryClear296}
            onClick={clearSearch296}
          >
            Clear
          </button>
        ) : null}
      </form>

      {submitted296 ? (
        <div
          ref={resultsRef296}
          className={styles.darikDirectoryStoreResults296}
        >
          <div className={styles.darikDirectoryHeading296}>
            <div>
              <span>Jordan-wide Darik search</span>
              <h2>
                Stores carrying “{submitted296}”
              </h2>
              <p>
                Only stores with a matching published item are shown.
              </p>
            </div>

            {!loading296 && !error296 ? (
              <strong>
                {results296.length}{" "}
                {results296.length === 1 ? "store" : "stores"}
              </strong>
            ) : null}
          </div>

          {loading296 ? (
            <div className={styles.darikDirectoryState296}>
              Searching Darik stores across Jordan…
            </div>
          ) : error296 ? (
            <div className={styles.darikDirectoryState296}>
              <strong>Search failed</strong>
              <span>{error296}</span>
            </div>
          ) : results296.length === 0 ? (
            <div className={styles.darikDirectoryState296}>
              <strong>No Darik stores found</strong>
              <span>
                Try a different product name or Arabic/English spelling.
              </span>
            </div>
          ) : (
            <div className={styles.darikDirectoryStoreGrid296}>
              {results296.map((store296) => {
                const matchedCount296 = Math.max(
                  1,
                  Number(store296.matched_product_count || 1)
                );

                return (
                  <article
                    key={clean296(store296.storefront_slug)}
                    className={styles.darikDirectoryStoreCard296}
                  >
                    <button
                      type="button"
                      className={styles.darikDirectoryStoreMain296}
                      onClick={() =>
                        window.location.assign(
                          storeHref296(store296)
                        )
                      }
                    >
                      <span
                        className={styles.darikDirectoryLogo296}
                      >
                        {clean296(
                          store296.storefront_logo_url
                        ) ? (
                          <img
                            src={clean296(
                              store296.storefront_logo_url
                            )}
                            alt=""
                          />
                        ) : (
                          storeName296(store296)
                            .slice(0, 1)
                            .toUpperCase()
                        )}
                      </span>

                      <span className={styles.darikDirectoryStoreCopy296}>
                        <strong>{storeName296(store296)}</strong>

                        {clean296(store296.storefront_name_ar) ? (
                          <small dir="rtl">
                            {clean296(
                              store296.storefront_name_ar
                            )}
                          </small>
                        ) : null}

                        <span>
                          {matchedCount296} matching{" "}
                          {matchedCount296 === 1 ? "item" : "items"}
                        </span>
                      </span>

                      <span className={styles.darikDirectoryViewStore296}>
                        View store
                      </span>
                    </button>

                    {clean296(store296.sample_product_name) ||
                    clean296(store296.sample_product_name_ar) ? (
                      <button
                        type="button"
                        className={styles.darikDirectorySampleProduct296}
                        onClick={() =>
                          window.location.assign(
                            sampleProductHref296(store296)
                          )
                        }
                      >
                        <span
                          className={styles.darikDirectorySampleImage296}
                        >
                          {clean296(
                            store296.sample_product_image_url
                          ) ? (
                            <img
                              src={clean296(
                                store296.sample_product_image_url
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

                        <span>
                          <small>Matching item</small>
                          <strong>
                            {clean296(store296.sample_product_name) ||
                              clean296(
                                store296.sample_product_name_ar
                              )}
                          </strong>
                        </span>

                        <span>View item ›</span>
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
