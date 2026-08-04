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
import styles from "./categories.module.css";

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

type StoreCategory = {
  id: string;
  retailer_id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | string;
  category_status: "active" | "hidden" | "archived";
  created_at: string;
  updated_at: string;
};

type CategoryProduct = {
  id: string;
  direct_store_category_id: string | null;
  direct_product_status: string;
};

type CategoryForm = {
  name: string;
  nameAr: string;
  description: string;
  imageUrl: string;
  status: "active" | "hidden";
  sortOrder: string;
};

const emptyForm: CategoryForm = {
  name: "",
  nameAr: "",
  description: "",
  imageUrl: "",
  status: "active",
  sortOrder: "1000",
};

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function DarikDirectCategoriesPage() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("current");
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
    const result = await supabase.rpc("darik_direct_get_my_context");

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    const nextContext = result.data as unknown as ContextResult;
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

  const loadCategories = useCallback(async () => {
    if (!selectedRetailerId) {
      setCategories([]);
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const [categoryResult, productResult] = await Promise.all([
      supabase
        .from("retailer_store_categories")
        .select(
          [
            "id",
            "retailer_id",
            "name",
            "name_ar",
            "slug",
            "description",
            "image_url",
            "sort_order",
            "category_status",
            "created_at",
            "updated_at",
          ].join(",")
        )
        .eq("retailer_id", selectedRetailerId)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("products")
        .select("id,direct_store_category_id,direct_product_status")
        .eq("retailer_id", selectedRetailerId),
    ]);

    if (categoryResult.error) {
      setError(categoryResult.error.message);
      setCategories([]);
    } else {
      setCategories(
        (categoryResult.data ?? []) as unknown as StoreCategory[]
      );
    }

    if (productResult.error) {
      setError((current) =>
        current
          ? `${current} | ${productResult.error?.message}`
          : productResult.error?.message ?? "Could not load products."
      );
      setProducts([]);
    } else {
      setProducts(
        (productResult.data ?? []) as unknown as CategoryProduct[]
      );
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
      loadCategories();
    }
  }, [selectedRetailerId, loadCategories]);

  const productCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();

    for (const product of products) {
      if (
        product.direct_store_category_id &&
        product.direct_product_status !== "archived"
      ) {
        counts.set(
          product.direct_store_category_id,
          (counts.get(product.direct_store_category_id) ?? 0) + 1
        );
      }
    }

    return counts;
  }, [products]);

  const uncategorizedCount = useMemo(
    () =>
      products.filter(
        (product) =>
          !product.direct_store_category_id &&
          product.direct_product_status !== "archived"
      ).length,
    [products]
  );

  const filteredCategories = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return categories.filter((category) => {
      if (
        statusFilter === "current" &&
        category.category_status === "archived"
      ) {
        return false;
      }

      if (
        statusFilter !== "all" &&
        statusFilter !== "current" &&
        category.category_status !== statusFilter
      ) {
        return false;
      }

      if (!cleanSearch) return true;

      return [
        category.name,
        category.name_ar,
        category.description,
        category.slug,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(cleanSearch));
    });
  }, [categories, search, statusFilter]);

  const counts = useMemo(
    () => ({
      current: categories.filter(
        (category) => category.category_status !== "archived"
      ).length,
      active: categories.filter(
        (category) => category.category_status === "active"
      ).length,
      hidden: categories.filter(
        (category) => category.category_status === "hidden"
      ).length,
      uncategorized: uncategorizedCount,
    }),
    [categories, uncategorizedCount]
  );

  function updateForm<K extends keyof CategoryForm>(
    key: K,
    value: CategoryForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateForm() {
    setEditingCategoryId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  function openEditForm(category: StoreCategory) {
    setEditingCategoryId(category.id);
    setForm({
      name: category.name,
      nameAr: category.name_ar || "",
      description: category.description || "",
      imageUrl: category.image_url || "",
      status:
        category.category_status === "archived"
          ? "hidden"
          : category.category_status,
      sortOrder: String(category.sort_order ?? 1000),
    });
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  async function uploadCategoryImage(file: File) {
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

    const objectPath =
      `${selectedRetailerId}/categories/` +
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const uploadResult = await supabase.storage
      .from("darik-direct-storefront-assets")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    setUploading(false);

    if (uploadResult.error) {
      throw new Error(uploadResult.error.message);
    }

    return supabase.storage
      .from("darik-direct-storefront-assets")
      .getPublicUrl(uploadResult.data.path).data.publicUrl;
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setMessage("");

    try {
      const url = await uploadCategoryImage(file);
      updateForm("imageUrl", url);
      setMessage("Category image uploaded.");
    } catch (uploadError) {
      setUploading(false);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload the category image."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function saveCategory(event: FormEvent) {
    event.preventDefault();

    if (!selectedRetailerId) return;

    const name = form.name.trim();
    const sortOrder = Number(form.sortOrder || 1000);

    if (!name) {
      setError("Enter a category name.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const result = editingCategoryId
      ? await supabase.rpc("darik_direct_update_store_category", {
          p_category_id: editingCategoryId,
          p_name: name,
          p_name_ar: form.nameAr.trim() || null,
          p_description: form.description.trim() || null,
          p_image_url: form.imageUrl.trim() || null,
          p_status: form.status,
          p_sort_order: Number.isFinite(sortOrder) ? sortOrder : 1000,
        })
      : await supabase.rpc("darik_direct_create_store_category", {
          p_retailer_id: selectedRetailerId,
          p_name: name,
          p_name_ar: form.nameAr.trim() || null,
          p_description: form.description.trim() || null,
          p_image_url: form.imageUrl.trim() || null,
          p_status: form.status,
          p_sort_order: Number.isFinite(sortOrder) ? sortOrder : 1000,
        });

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setFormOpen(false);
    setEditingCategoryId(null);
    setForm(emptyForm);
    setMessage(
      editingCategoryId
        ? "Store category updated."
        : "Store category created."
    );
    await loadCategories();
  }

  async function setCategoryStatus(
    category: StoreCategory,
    nextStatus: "active" | "hidden" | "archived"
  ) {
    setError("");
    setMessage("");

    const result = await supabase.rpc(
      "darik_direct_set_store_category_status",
      {
        p_category_id: category.id,
        p_status: nextStatus,
      }
    );

    if (result.error) {
      setError(result.error.message);
      return;
    }

    const affected = productCountByCategory.get(category.id) ?? 0;

    setMessage(
      nextStatus === "active"
        ? `${category.name} is visible on the storefront.`
        : nextStatus === "hidden"
          ? `${category.name} and its ${affected} assigned product${
              affected === 1 ? "" : "s"
            } are hidden from the storefront.`
          : `${category.name} was archived. Assigned products are hidden until they are moved to another category.`
    );

    await loadCategories();
  }

  if (!authReady || (session && !context)) {
    return (
      <main className={styles.statePage}>
        <div className={styles.spinner} />
        <h1>Opening store categories…</h1>
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
          <a href="/store-dashboard/storefront">Storefront</a>
          <a href="/store-dashboard/orders">Orders</a>
          <a href="/store-dashboard/products">Products</a>
          <a
            className={styles.activeNav}
            href="/store-dashboard/categories"
          >
            Categories
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>{session.user.email}</span>
          <a href="/store-dashboard">Back to dashboard</a>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p>Independent store navigation</p>
            <h2>{selectedStore?.business_name || "Your store"} categories</h2>
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

            <a
              className={styles.secondaryButton}
              href="/store-dashboard/products"
            >
              Assign products
            </a>

            {selectedStore?.storefront_slug ? (
              <a
                className={styles.secondaryButton}
                href={`/store/${selectedStore.storefront_slug}`}
                target="_blank"
                rel="noreferrer"
              >
                View storefront
              </a>
            ) : null}

            <button className={styles.addButton} onClick={openCreateForm}>
              + Add category
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
            <section className={styles.explainer}>
              <div>
                <strong>These belong only to this store</strong>
                <p>
                  They can be anything your business needs. They do not edit
                  Darik Marketplace categories or marketplace approval data.
                </p>
              </div>
              <span>
                Restaurant, grocery, electronics, fashion, auto parts—every
                store builds its own structure.
              </span>
            </section>

            <section className={styles.metrics}>
              <article>
                <span>Current categories</span>
                <strong>{counts.current}</strong>
                <p>Active and hidden</p>
              </article>
              <article>
                <span>Visible</span>
                <strong>{counts.active}</strong>
                <p>Shown to customers</p>
              </article>
              <article>
                <span>Hidden</span>
                <strong>{counts.hidden}</strong>
                <p>Products hidden with them</p>
              </article>
              <article>
                <span>Uncategorized products</span>
                <strong>{counts.uncategorized}</strong>
                <p>Still shown under All products</p>
              </article>
            </section>

            <section className={styles.catalogPanel}>
              <div className={styles.catalogHeader}>
                <div>
                  <p>Store category manager</p>
                  <h2>Build your storefront navigation</h2>
                </div>

                <div className={styles.filters}>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search categories"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="current">Current categories</option>
                    <option value="active">Visible</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                    <option value="all">All statuses</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className={styles.loadingBlock}>
                  <div className={styles.spinner} />
                  <span>Loading categories…</span>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className={styles.emptyCatalog}>
                  <div className={styles.emptyIcon}>+</div>
                  <h3>
                    {categories.length === 0
                      ? "Create your first store category"
                      : "No categories match this filter"}
                  </h3>
                  <p>
                    Examples: Burgers, Drinks, Laptops, Brake Parts, Skincare,
                    Fresh Produce, or anything else your store sells.
                  </p>
                  {categories.length === 0 ? (
                    <button onClick={openCreateForm}>Add first category</button>
                  ) : null}
                </div>
              ) : (
                <div className={styles.categoryGrid}>
                  {filteredCategories.map((category) => {
                    const productCount =
                      productCountByCategory.get(category.id) ?? 0;

                    return (
                      <article className={styles.categoryCard} key={category.id}>
                        <div className={styles.categoryImage}>
                          {category.image_url ? (
                            <img src={category.image_url} alt={category.name} />
                          ) : (
                            <span>{category.name.slice(0, 1).toUpperCase()}</span>
                          )}

                          <strong
                            className={`${styles.statusBadge} ${
                              styles[`status_${category.category_status}`]
                            }`}
                          >
                            {category.category_status}
                          </strong>
                        </div>

                        <div className={styles.categoryBody}>
                          <p>/{category.slug}</p>
                          <h3>{category.name}</h3>
                          {category.name_ar ? (
                            <span dir="rtl">{category.name_ar}</span>
                          ) : null}
                          {category.description ? (
                            <small>{category.description}</small>
                          ) : null}

                          <div className={styles.categoryFacts}>
                            <div>
                              <span>Products</span>
                              <strong>{productCount}</strong>
                            </div>
                            <div>
                              <span>Display order</span>
                              <strong>{Number(category.sort_order ?? 1000)}</strong>
                            </div>
                          </div>

                          <div className={styles.categoryActions}>
                            <button onClick={() => openEditForm(category)}>
                              Edit
                            </button>

                            {category.category_status === "active" ? (
                              <button
                                onClick={() =>
                                  setCategoryStatus(category, "hidden")
                                }
                              >
                                Hide
                              </button>
                            ) : category.category_status === "hidden" ? (
                              <button
                                className={styles.activateAction}
                                onClick={() =>
                                  setCategoryStatus(category, "active")
                                }
                              >
                                Show
                              </button>
                            ) : (
                              <button
                                className={styles.activateAction}
                                onClick={() =>
                                  setCategoryStatus(category, "active")
                                }
                              >
                                Restore
                              </button>
                            )}

                            {category.category_status !== "archived" ? (
                              <button
                                className={styles.archiveAction}
                                onClick={() => {
                                  const warning =
                                    productCount > 0
                                      ? `Archive ${category.name}? Its ${productCount} assigned product${
                                          productCount === 1 ? "" : "s"
                                        } will be hidden until reassigned.`
                                      : `Archive ${category.name}?`;

                                  if (window.confirm(warning)) {
                                    setCategoryStatus(category, "archived");
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
                <p>{editingCategoryId ? "Edit category" : "New category"}</p>
                <h2>
                  {editingCategoryId
                    ? "Update store category"
                    : "Create a store-owned category"}
                </h2>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => {
                  if (!saving && !uploading) {
                    setFormOpen(false);
                    setEditingCategoryId(null);
                  }
                }}
              >
                ×
              </button>
            </header>

            <form className={styles.categoryForm} onSubmit={saveCategory}>
              <div className={styles.formMain}>
                <label>
                  Category name
                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="Example: Brake Parts"
                    required
                  />
                </label>

                <label>
                  Arabic category name
                  <input
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(event) =>
                      updateForm("nameAr", event.target.value)
                    }
                    placeholder="اسم التصنيف بالعربي"
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    rows={4}
                    placeholder="Optional description shown with this category."
                  />
                </label>

                <div className={styles.twoColumns}>
                  <label>
                    Visibility
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target.value as CategoryForm["status"]
                        )
                      }
                    >
                      <option value="active">Visible</option>
                      <option value="hidden">Hidden</option>
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

                <div className={styles.visibilityNote}>
                  <strong>Hiding a category hides its assigned products</strong>
                  <p>
                    Products are not deleted. Show the category again or move
                    those products to another category.
                  </p>
                </div>
              </div>

              <aside className={styles.imagePanel}>
                <div className={styles.imagePreview}>
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="Category preview" />
                  ) : (
                    <div>
                      <strong>Category image</strong>
                      <span>Optional</span>
                    </div>
                  )}
                </div>

                <label className={styles.uploadButton}>
                  {uploading ? "Uploading…" : "Upload category image"}
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
                    value={form.imageUrl}
                    onChange={(event) =>
                      updateForm("imageUrl", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>

                <div className={styles.channelNote}>
                  <strong>Independent from Darik Marketplace</strong>
                  <p>
                    This category exists only inside this retailer’s Darik
                    Direct storefront.
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
                      setEditingCategoryId(null);
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
                    : editingCategoryId
                      ? "Save category"
                      : "Create category"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
