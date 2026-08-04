"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./products.module.css";

type StoreContext = {
  retailer_id: string;
  business_name: string;
  retailer_number: string | null;
  retailer_status: string | null;
  account_restricted: boolean;
  role: string;
  member_status: string;
  storefront_id: string | null;
  storefront_slug: string | null;
  storefront_status: string | null;
  direct_storefront_enabled: boolean | null;
  is_accepting_orders: boolean | null;
};

type ContextResult = {
  ok: boolean;
  auth_user_id: string | null;
  auth_email: string | null;
  stores: StoreContext[];
};

type Category = {
  id: string;
  retailer_id: string;
  name: string;
  name_ar: string | null;
  category_status: "active" | "hidden" | "archived";
  sort_order: number | string;
};

type DirectProduct = {
  id: string;
  retailer_id: string;
  category_id: string | null;
  direct_store_category_id: string | null;
  name: string;
  retailer_submitted_name: string | null;
  official_marketplace_name: string | null;
  official_marketplace_name_ar: string | null;
  brand_name: string | null;
  quantity_in_stock: number | string;
  direct_inventory_tracking_enabled: boolean;
  product_status: string;
  marketplace_visible: boolean;
  storefront_visible: boolean;
  storefront_featured: boolean;
  storefront_sort_order: number | string;
  direct_name: string | null;
  direct_name_ar: string | null;
  direct_description: string | null;
  direct_price: number | string | null;
  direct_compare_at_price: number | string | null;
  direct_photo_url: string | null;
  direct_product_status: "draft" | "published" | "paused" | "archived";
  direct_updated_at: string | null;
  created_at: string;
};

type ProductForm = {
  name: string;
  nameAr: string;
  description: string;
  brandName: string;
  directCategoryId: string;
  price: string;
  compareAtPrice: string;
  trackInventory: boolean;
  quantity: string;
  photoUrl: string;
  status: "draft" | "published" | "paused";
  featured: boolean;
  sortOrder: string;
};

const emptyForm: ProductForm = {
  name: "",
  nameAr: "",
  description: "",
  brandName: "",
  directCategoryId: "",
  price: "",
  compareAtPrice: "",
  trackInventory: false,
  quantity: "0",
  photoUrl: "",
  status: "published",
  featured: false,
  sortOrder: "1000",
};

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} JOD`;
}

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function abbreviateCategoryName(value: string | null, maxLength = 26) {
  const clean = String(value ?? "").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

function categoryOptionLabel(category: Category) {
  const english = abbreviateCategoryName(category.name);
  const arabic = abbreviateCategoryName(category.name_ar);
  const bilingual = arabic ? `${english} / ${arabic}` : english;
  return category.category_status === "hidden"
    ? `${bilingual} (hidden)`
    : bilingual;
}

function productDisplayName(product: DirectProduct) {
  return (
    product.direct_name ||
    product.official_marketplace_name ||
    product.retailer_submitted_name ||
    product.name ||
    "Unnamed product"
  );
}

export default function DarikDirectProductsPage() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<DirectProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedStore = useMemo(
    () =>
      context?.stores.find(
        (store) => store.retailer_id === selectedRetailerId
      ) ?? null,
    [context, selectedRetailerId]
  );

  const loadContext = useCallback(async () => {
    const contextResult = await supabase.rpc("darik_direct_get_my_context");

    if (contextResult.error) {
      setError(contextResult.error.message);
      setLoading(false);
      return;
    }

    const nextContext = contextResult.data as ContextResult;
    const stores = Array.isArray(nextContext?.stores)
      ? nextContext.stores
      : [];

    setContext({ ...nextContext, stores });

    setSelectedRetailerId((current) => {
      if (current && stores.some((store) => store.retailer_id === current)) {
        return current;
      }
      return stores[0]?.retailer_id ?? "";
    });
  }, []);

  const loadCatalog = useCallback(async () => {
    if (!selectedRetailerId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const [productResult, categoryResult] = await Promise.all([
      supabase
        .from("products")
        .select(
          [
            "id",
            "retailer_id",
            "category_id",
            "direct_store_category_id",
            "name",
            "retailer_submitted_name",
            "official_marketplace_name",
            "official_marketplace_name_ar",
            "brand_name",
            "quantity_in_stock",
            "direct_inventory_tracking_enabled",
            "product_status",
            "marketplace_visible",
            "storefront_visible",
            "storefront_featured",
            "storefront_sort_order",
            "direct_name",
            "direct_name_ar",
            "direct_description",
            "direct_price",
            "direct_compare_at_price",
            "direct_photo_url",
            "direct_product_status",
            "direct_updated_at",
            "created_at",
          ].join(",")
        )
        .eq("retailer_id", selectedRetailerId)
        .order("storefront_featured", { ascending: false })
        .order("storefront_sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("retailer_store_categories")
        .select("id,retailer_id,name,name_ar,category_status,sort_order")
        .eq("retailer_id", selectedRetailerId)
        .neq("category_status", "archived")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (productResult.error) {
      setError(productResult.error.message);
      setProducts([]);
    } else {
      setProducts((productResult.data ?? []) as unknown as DirectProduct[]);
    }

    if (!categoryResult.error) {
      setCategories((categoryResult.data ?? []) as unknown as Category[]);
    }

    setLoading(false);
  }, [selectedRetailerId]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);

      if (!data.session) {
        router.replace("/store-dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);

      if (!nextSession) {
        router.replace("/store-dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (session) {
      loadContext();
    }
  }, [session, loadContext]);

  useEffect(() => {
    if (selectedRetailerId) {
      loadCatalog();
    }
  }, [selectedRetailerId, loadCatalog]);

  const filteredProducts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      if (
        statusFilter !== "all" &&
        product.direct_product_status !== statusFilter
      ) {
        return false;
      }

      if (!cleanSearch) return true;

      return [
        productDisplayName(product),
        product.direct_name_ar,
        product.brand_name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(cleanSearch));
    });
  }, [products, search, statusFilter]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const counts = useMemo(() => {
    return {
      total: products.filter(
        (product) => product.direct_product_status !== "archived"
      ).length,
      published: products.filter(
        (product) => product.direct_product_status === "published"
      ).length,
      lowStock: products.filter(
        (product) =>
          product.direct_product_status !== "archived" &&
          product.direct_inventory_tracking_enabled &&
          Number(product.quantity_in_stock ?? 0) <= 3
      ).length,
      featured: products.filter(
        (product) =>
          product.direct_product_status === "published" &&
          product.storefront_featured
      ).length,
    };
  }, [products]);

  function updateForm<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateForm() {
    setEditingProductId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  function openEditForm(product: DirectProduct) {
    setEditingProductId(product.id);
    setForm({
      name: productDisplayName(product),
      nameAr:
        product.direct_name_ar ||
        product.official_marketplace_name_ar ||
        "",
      description: product.direct_description || "",
      brandName: product.brand_name || "",
      directCategoryId: product.direct_store_category_id || "",
      price: String(product.direct_price ?? ""),
      compareAtPrice: String(product.direct_compare_at_price ?? ""),
      trackInventory: Boolean(product.direct_inventory_tracking_enabled),
      quantity: String(product.quantity_in_stock ?? 0),
      photoUrl: product.direct_photo_url || "",
      status:
        product.direct_product_status === "archived"
          ? "paused"
          : product.direct_product_status,
      featured: Boolean(product.storefront_featured),
      sortOrder: String(product.storefront_sort_order ?? 1000),
    });
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  async function uploadImage(file: File) {
    if (!selectedRetailerId) {
      throw new Error("No retailer is selected.");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Choose an image file.");
    }

    if (file.size > 8 * 1024 * 1024) {
      throw new Error("The image must be 8 MB or smaller.");
    }

    setUploading(true);

    const extension =
      safeFileName(file.name).split(".").pop() ||
      file.type.split("/").pop() ||
      "jpg";

    const objectPath = `${selectedRetailerId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const uploadResult = await supabase.storage
      .from("darik-direct-products")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    setUploading(false);

    if (uploadResult.error) {
      throw new Error(uploadResult.error.message);
    }

    const publicResult = supabase.storage
      .from("darik-direct-products")
      .getPublicUrl(uploadResult.data.path);

    return publicResult.data.publicUrl;
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    try {
      const publicUrl = await uploadImage(file);
      updateForm("photoUrl", publicUrl);
      setMessage("Product image uploaded.");
    } catch (uploadError) {
      setUploading(false);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();

    if (!selectedRetailerId) return;

    const name = form.name.trim();
    const price = Number(form.price);
    const compareAtPrice = form.compareAtPrice
      ? Number(form.compareAtPrice)
      : null;
    const quantity = form.trackInventory ? Number(form.quantity) : 0;
    const sortOrder = Number(form.sortOrder || 1000);

    if (name.length < 2) {
      setError("Enter a product name.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (
      form.trackInventory &&
      (!Number.isInteger(quantity) || quantity < 0)
    ) {
      setError("Inventory amount must be a whole number of zero or more.");
      return;
    }

    if (
      compareAtPrice != null &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice < price)
    ) {
      setError("Compare-at price must be equal to or higher than the price.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const result = editingProductId
      ? await supabase.rpc("darik_direct_update_product_v3", {
          p_product_id: editingProductId,
          p_name: name,
          p_name_ar: form.nameAr.trim() || null,
          p_description: form.description.trim() || null,
          p_brand_name: form.brandName.trim() || null,
          p_direct_store_category_id: form.directCategoryId || null,
          p_price: price,
          p_compare_at_price: compareAtPrice,
          p_track_inventory: form.trackInventory,
          p_quantity: quantity,
          p_photo_url: form.photoUrl.trim() || null,
          p_status: form.status,
          p_featured: form.featured,
          p_sort_order: Number.isFinite(sortOrder) ? sortOrder : 1000,
        })
      : await supabase.rpc("darik_direct_create_product_v3", {
          p_retailer_id: selectedRetailerId,
          p_name: name,
          p_name_ar: form.nameAr.trim() || null,
          p_description: form.description.trim() || null,
          p_brand_name: form.brandName.trim() || null,
          p_direct_store_category_id: form.directCategoryId || null,
          p_price: price,
          p_compare_at_price: compareAtPrice,
          p_track_inventory: form.trackInventory,
          p_quantity: quantity,
          p_photo_url: form.photoUrl.trim() || null,
          p_publish: form.status === "published",
          p_featured: form.featured,
          p_sort_order: Number.isFinite(sortOrder) ? sortOrder : 1000,
        });

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setFormOpen(false);
    setEditingProductId(null);
    setForm(emptyForm);
    setMessage(
      editingProductId
        ? "Product updated successfully."
        : "Product added to the Darik Direct catalog."
    );
    await loadCatalog();
  }

  async function setProductState(
    product: DirectProduct,
    nextStatus: "draft" | "published" | "paused" | "archived",
    featured = product.storefront_featured
  ) {
    setError("");
    setMessage("");

    const result = await supabase.rpc("darik_direct_set_product_state", {
      p_product_id: product.id,
      p_status: nextStatus,
      p_featured: featured,
      p_sort_order: Number(product.storefront_sort_order ?? 1000),
    });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage(
      nextStatus === "published"
        ? `${productDisplayName(product)} is live on the storefront.`
        : nextStatus === "archived"
          ? `${productDisplayName(product)} was archived.`
          : `${productDisplayName(product)} is now ${nextStatus}.`
    );

    await loadCatalog();
  }

  if (!authReady || (session && !context)) {
    return (
      <main className={styles.statePage}>
        <div className={styles.spinner} />
        <h1>Opening your product catalog…</h1>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.statePage}>
        <h1>Redirecting to store login…</h1>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.brandEyebrow}>Darik</p>
          <h1>Direct</h1>
        </div>

        <nav>
          <a href="/store-dashboard">Overview</a>
          <a href="/store-dashboard#storefront">Storefront</a>
          <a href="/store-dashboard#orders">Orders</a>
          <a className={styles.activeNav} href="/store-dashboard/products">
            Products
          </a>
          <a href="/store-dashboard/categories">Categories</a>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>{session.user.email}</span>
          <a href="/store-dashboard">Back to dashboard</a>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p>Direct catalog</p>
            <h2>{selectedStore?.business_name || "Your store"} products</h2>
          </div>

          <div className={styles.topActions}>
            {context && context.stores.length > 1 ? (
              <select
                value={selectedRetailerId}
                onChange={(event) =>
                  setSelectedRetailerId(event.target.value)
                }
              >
                {context.stores.map((store) => (
                  <option key={store.retailer_id} value={store.retailer_id}>
                    {store.business_name}
                  </option>
                ))}
              </select>
            ) : null}

            {selectedStore?.storefront_slug ? (
              <a
                className={styles.previewButton}
                href={`/store/${selectedStore.storefront_slug}`}
                target="_blank"
                rel="noreferrer"
              >
                View storefront
              </a>
            ) : null}

            <button className={styles.addButton} onClick={openCreateForm}>
              + Add product
            </button>
          </div>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        {!selectedStore ? (
          <section className={styles.emptyState}>
            <h2>No retailer membership was found.</h2>
            <p>Return to the dashboard and verify the retailer login.</p>
          </section>
        ) : (
          <>
            {!selectedStore.storefront_id ? (
              <section className={styles.setupNotice}>
                <div>
                  <strong>Create your storefront first</strong>
                  <p>
                    Products can be prepared now, but customers need a published
                    storefront link before they can see them.
                  </p>
                </div>
                <a href="/store-dashboard#storefront">Set up storefront</a>
              </section>
            ) : null}

            <section className={styles.metrics}>
              <article>
                <span>Total products</span>
                <strong>{counts.total}</strong>
                <p>Direct catalog</p>
              </article>
              <article>
                <span>Published</span>
                <strong>{counts.published}</strong>
                <p>Visible when in stock</p>
              </article>
              <article>
                <span>Low stock</span>
                <strong>{counts.lowStock}</strong>
                <p>Tracked items with three or fewer</p>
              </article>
              <article>
                <span>Featured</span>
                <strong>{counts.featured}</strong>
                <p>Shown first</p>
              </article>
            </section>

            <section className={styles.catalogPanel}>
              <div className={styles.catalogHeader}>
                <div>
                  <p>Store inventory</p>
                  <h2>Manage products</h2>
                </div>

                <div className={styles.filters}>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className={styles.loadingBlock}>
                  <div className={styles.spinner} />
                  <span>Loading products…</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className={styles.emptyCatalog}>
                  <div className={styles.emptyIcon}>+</div>
                  <h3>
                    {products.length === 0
                      ? "Add your first product"
                      : "No products match this filter"}
                  </h3>
                  <p>
                    Create direct-store products without changing the Darik
                    Marketplace approval process.
                  </p>
                  {products.length === 0 ? (
                    <button onClick={openCreateForm}>Add first product</button>
                  ) : null}
                </div>
              ) : (
                <div className={styles.productGrid}>
                  {filteredProducts.map((product) => {
                    const name = productDisplayName(product);
                    const stock = Number(product.quantity_in_stock ?? 0);
                    const price = Number(product.direct_price ?? 0);
                    const status = product.direct_product_status;

                    return (
                      <article className={styles.productCard} key={product.id}>
                        <div className={styles.productPhoto}>
                          {product.direct_photo_url ? (
                            <img src={product.direct_photo_url} alt={name} />
                          ) : (
                            <span>{name.slice(0, 1).toUpperCase()}</span>
                          )}

                          <div className={styles.photoBadges}>
                            <strong
                              className={`${styles.statusBadge} ${
                                styles[`status_${status}`]
                              }`}
                            >
                              {status}
                            </strong>

                            {product.storefront_featured ? (
                              <strong className={styles.featuredBadge}>
                                Featured
                              </strong>
                            ) : null}
                          </div>
                        </div>

                        <div className={styles.productBody}>
                          <div className={styles.productHeading}>
                            <div>
                              <p>
                                {categoryById.get(
                                  product.direct_store_category_id || ""
                                )?.name ||
                                  product.brand_name ||
                                  "Uncategorized"}
                              </p>
                              <h3>{name}</h3>
                              {product.direct_name_ar ? (
                                <span dir="rtl">{product.direct_name_ar}</span>
                              ) : null}
                            </div>
                            <strong>{money(price)}</strong>
                          </div>

                          <div className={styles.productFacts}>
                            <div>
                              <span>Inventory</span>
                              <strong
                                className={
                                  product.direct_inventory_tracking_enabled &&
                                  stock <= 3
                                    ? styles.lowStock
                                    : undefined
                                }
                              >
                                {product.direct_inventory_tracking_enabled
                                  ? stock
                                  : "Not tracked"}
                              </strong>
                            </div>
                            <div>
                              <span>Sort</span>
                              <strong>
                                {Number(product.storefront_sort_order ?? 1000)}
                              </strong>
                            </div>
                            <div>
                              <span>Marketplace</span>
                              <strong>
                                {product.marketplace_visible &&
                                product.product_status === "live"
                                  ? "Live"
                                  : "Separate"}
                              </strong>
                            </div>
                          </div>

                          <div className={styles.productActions}>
                            <button onClick={() => openEditForm(product)}>
                              Edit
                            </button>

                            {status === "published" ? (
                              <button
                                onClick={() =>
                                  setProductState(product, "paused")
                                }
                              >
                                Pause
                              </button>
                            ) : status !== "archived" ? (
                              <button
                                className={styles.publishAction}
                                onClick={() =>
                                  setProductState(product, "published")
                                }
                              >
                                Publish
                              </button>
                            ) : null}

                            {status !== "archived" ? (
                              <button
                                onClick={() =>
                                  setProductState(
                                    product,
                                    status,
                                    !product.storefront_featured
                                  )
                                }
                              >
                                {product.storefront_featured
                                  ? "Unfeature"
                                  : "Feature"}
                              </button>
                            ) : null}

                            {status !== "archived" ? (
                              <button
                                className={styles.archiveAction}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Archive ${name}? It will disappear from the direct storefront.`
                                    )
                                  ) {
                                    setProductState(product, "archived");
                                  }
                                }}
                              >
                                Archive
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      {formOpen ? (
        <div className={styles.modalOverlay}>
          <section className={styles.modal}>
            <header className={styles.modalHeader}>
              <div>
                <p>{editingProductId ? "Edit product" : "New product"}</p>
                <h2>
                  {editingProductId
                    ? "Update storefront product"
                    : "Add to your direct catalog"}
                </h2>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => {
                  if (!saving && !uploading) {
                    setFormOpen(false);
                    setEditingProductId(null);
                  }
                }}
              >
                ×
              </button>
            </header>

            <form className={styles.productForm} onSubmit={saveProduct}>
              <div className={styles.formMain}>
                <label>
                  Product name
                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="Example: Front brake pads"
                    required
                  />
                </label>

                <label>
                  Arabic product name
                  <input
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(event) =>
                      updateForm("nameAr", event.target.value)
                    }
                    placeholder="اسم المنتج بالعربي"
                  />
                </label>

                <div className={styles.twoColumns}>
                  <label>
                    Brand
                    <input
                      value={form.brandName}
                      onChange={(event) =>
                        updateForm("brandName", event.target.value)
                      }
                      placeholder="Brand name"
                    />
                  </label>

                  <label>
                    Store category
                    <select
                      value={form.directCategoryId}
                      onChange={(event) =>
                        updateForm("directCategoryId", event.target.value)
                      }
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {categoryOptionLabel(category)}
                        </option>
                      ))}
                    </select>
                    <a
                      className={styles.manageCategoriesLink}
                      href="/store-dashboard/categories"
                    >
                      Create or manage store categories
                    </a>
                  </label>
                </div>

                <label>
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    placeholder="Describe the product, fitment, size, or important details."
                    rows={4}
                  />
                </label>

                <div className={styles.threeColumns}>
                  <label>
                    Selling price
                    <div className={styles.moneyInput}>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.price}
                        onChange={(event) =>
                          updateForm("price", event.target.value)
                        }
                        required
                      />
                      <span>JOD</span>
                    </div>
                  </label>

                  <label>
                    Compare-at price
                    <div className={styles.moneyInput}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.compareAtPrice}
                        onChange={(event) =>
                          updateForm("compareAtPrice", event.target.value)
                        }
                        placeholder="Optional"
                      />
                      <span>JOD</span>
                    </div>
                  </label>

                  <div className={styles.inventoryControl}>
                    <label className={styles.inventoryToggle}>
                      <input
                        type="checkbox"
                        checked={form.trackInventory}
                        onChange={(event) =>
                          updateForm("trackInventory", event.target.checked)
                        }
                      />
                      <span>
                        <strong>Track inventory</strong>
                        {form.trackInventory
                          ? "Enter the amount currently available."
                          : "Leave unchecked for items that are always available."}
                      </span>
                    </label>

                    {form.trackInventory ? (
                      <label className={styles.inventoryAmount}>
                        Inventory amount
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={form.quantity}
                          onChange={(event) =>
                            updateForm("quantity", event.target.value)
                          }
                          required
                        />
                      </label>
                    ) : (
                      <div className={styles.inventoryNotTracked}>
                        <strong>Inventory not tracked</strong>
                        <span>This item stays available until you pause it.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.twoColumns}>
                  <label>
                    Storefront status
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target.value as ProductForm["status"]
                        )
                      }
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      {editingProductId ? (
                        <option value="paused">Paused</option>
                      ) : null}
                    </select>
                  </label>

                  <label>
                    Display order
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.sortOrder}
                      onChange={(event) =>
                        updateForm("sortOrder", event.target.value)
                      }
                    />
                  </label>
                </div>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateForm("featured", event.target.checked)
                    }
                  />
                  <span>
                    <strong>Feature this product</strong>
                    Show it before normal products on the storefront.
                  </span>
                </label>
              </div>

              <aside className={styles.imagePanel}>
                <div className={styles.imagePreview}>
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="Product preview" />
                  ) : (
                    <div>
                      <strong>Product photo</strong>
                      <span>JPG, PNG, WEBP or GIF</span>
                    </div>
                  )}
                </div>

                <label className={styles.uploadButton}>
                  {uploading ? "Uploading…" : "Upload product image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    disabled={uploading || saving}
                  />
                </label>

                <label>
                  Or paste image URL
                  <input
                    type="url"
                    value={form.photoUrl}
                    onChange={(event) =>
                      updateForm("photoUrl", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>

                <div className={styles.channelNote}>
                  <strong>Marketplace remains protected</strong>
                  <p>
                    A product created here starts as direct-store only. Darik
                    Marketplace approval and official product fields are not
                    changed.
                  </p>
                </div>
              </aside>

              <footer className={styles.formFooter}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    if (!saving && !uploading) {
                      setFormOpen(false);
                      setEditingProductId(null);
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving || uploading}
                >
                  {saving
                    ? "Saving…"
                    : editingProductId
                      ? "Save changes"
                      : "Add product"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
