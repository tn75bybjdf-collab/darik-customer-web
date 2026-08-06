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
import { getBusinessCategoryPreset } from "./categoryPresets";

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
  direct_photo_url: string | null;
  official_product_thumbnail_url: string | null;
  official_product_photo_url: string | null;
  retailer_raw_photo_url: string | null;
  created_at: string;
};

type CategoryPresetContext = {
  retailer_id: string;
  business_name: string;
  business_type: string | null;
  business_type_other: string | null;
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

function productImageUrl(product: CategoryProduct) {
  return (
    product.direct_photo_url ||
    product.official_product_thumbnail_url ||
    product.official_product_photo_url ||
    product.retailer_raw_photo_url ||
    null
  );
}

export default function DarikDirectCategoriesPage() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [context, setContext] = useState<ContextResult | null>(null);
  const [selectedRetailerId, setSelectedRetailerId] = useState("");
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [presetContext, setPresetContext] = useState<CategoryPresetContext | null>(null);
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
      setPresetContext(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const ensureResult = await supabase.rpc(
      "darik_direct_ensure_default_categories",
      { p_retailer_id: selectedRetailerId }
    );

    if (ensureResult.error) {
      setError(
        `Could not prepare the default departments. / طھط¹ط°ط± طھط¬ظ‡ظٹط² ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹط©. ${ensureResult.error.message}`
      );
    }

    const [categoryResult, productResult, presetContextResult] = await Promise.all([
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
        .select(
          [
            "id",
            "direct_store_category_id",
            "direct_product_status",
            "direct_photo_url",
            "official_product_thumbnail_url",
            "official_product_photo_url",
            "retailer_raw_photo_url",
            "created_at",
          ].join(",")
        )
        .eq("retailer_id", selectedRetailerId)
        .order("created_at", { ascending: true }),
      supabase.rpc("darik_direct_get_category_preset_context", {
        p_retailer_id: selectedRetailerId,
      }),
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

    if (presetContextResult.error) {
      setError((current) =>
        current
          ? `${current} | ${presetContextResult.error?.message}`
          : presetContextResult.error?.message ??
            "Could not load the store's retail field."
      );
      setPresetContext(null);
    } else {
      setPresetContext(
        presetContextResult.data as unknown as CategoryPresetContext
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

  const automaticImageByCategory = useMemo(() => {
    const images = new Map<string, string>();
    const orderedProducts = [...products].sort((left, right) => {
      const dateDifference =
        new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
      return dateDifference || left.id.localeCompare(right.id);
    });

    for (const product of orderedProducts) {
      const categoryId = product.direct_store_category_id;
      const imageUrl = productImageUrl(product);

      if (
        categoryId &&
        imageUrl &&
        product.direct_product_status !== "archived" &&
        !images.has(categoryId)
      ) {
        images.set(categoryId, imageUrl);
      }
    }

    return images;
  }, [products]);

  const editingAutomaticImageUrl = editingCategoryId
    ? automaticImageByCategory.get(editingCategoryId) ?? null
    : null;

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

  const businessPreset = useMemo(
    () =>
      getBusinessCategoryPreset(
        presetContext?.business_type,
        presetContext?.business_type_other
      ),
    [presetContext]
  );

  const preparedPresetCount = useMemo(
    () => businessPreset.categories.length,
    [businessPreset]
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
      setMessage("Category image uploaded / طھظ… ط±ظپط¹ طµظˆط±ط© ط§ظ„ظ‚ط³ظ….");
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
        <h1>Opening store categoriesâ€¦ / ط¬ط§ط±ظچ ظپطھط­ ط§ظ„ط£ظ‚ط³ط§ظ…â€¦</h1>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.statePage}>
        <h1>Redirecting to store loginâ€¦ / ط¬ط§ط±ظچ ط§ظ„طھط­ظˆظٹظ„ ظ„طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„â€¦</h1>
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
          <a href="/store-dashboard">Overview / ظ†ط¸ط±ط© ط¹ط§ظ…ط©</a>
          <a href="/store-dashboard/storefront">Storefront / ظˆط§ط¬ظ‡ط© ط§ظ„ظ…طھط¬ط±</a>
          <a href="/store-dashboard/orders">Orders / ط§ظ„ط·ظ„ط¨ط§طھ</a>
          <a href="/store-dashboard/products">Products / ط§ظ„ظ…ظ†طھط¬ط§طھ</a>
          <a
            className={styles.activeNav}
            href="/store-dashboard/categories"
          >
            Categories / ط§ظ„ط£ظ‚ط³ط§ظ…
          </a>
          <a href="/store-dashboard/activation">Go live / طھظپط¹ظٹظ„ ط§ظ„ظ…طھط¬ط±</a>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>{session.user.email}</span>
          <a href="/store-dashboard">Back to dashboard / ط§ظ„ط¹ظˆط¯ط© ظ„ظ„ظˆط­ط©</a>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p>Store departments / ط£ظ‚ط³ط§ظ… ط§ظ„ظ…طھط¬ط±</p>
            <h2>{selectedStore?.business_name || "Your store"} â€” Categories / ط§ظ„ط£ظ‚ط³ط§ظ…</h2>
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
              Assign products / ط±ط¨ط· ط§ظ„ظ…ظ†طھط¬ط§طھ
            </a>

            {selectedStore?.storefront_slug ? (
              <a
                className={styles.secondaryButton}
                href={`/${selectedStore.storefront_slug}`}
                target="_blank"
                rel="noreferrer"
              >
                View storefront / ط¹ط±ط¶ ط§ظ„ظ…طھط¬ط±
              </a>
            ) : null}

            <button className={styles.addButton} onClick={openCreateForm}>
              + Add custom category / ط¥ط¶ط§ظپط© ظ‚ط³ظ… ظ…ط®طµطµ
            </button>
          </div>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {message ? <p className={styles.successBanner}>{message}</p> : null}

        {!selectedStore ? (
          <section className={styles.emptyState}>
            <h2>No retailer membership was found. / ظ„ظ… ظٹطھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط¹ط¶ظˆظٹط© ظ…طھط¬ط±.</h2>
            <p>Return to the dashboard and verify the retailer login. / ط§ط±ط¬ط¹ ظ„ظ„ظˆط­ط© ظˆطھط­ظ‚ظ‚ ظ…ظ† ط­ط³ط§ط¨ ط§ظ„ظ…طھط¬ط±.</p>
          </section>
        ) : (
          <>
            <section className={styles.explainer}>
              <div>
                <strong>
                  Store departments / ط£ظ‚ط³ط§ظ… ط§ظ„ظ…طھط¬ط±
                </strong>
                <p>
                  Your retail-field departments are created automatically and
                  are ready in Add Product. Create a custom department only when
                  your store needs something extra.
                </p>
              </div>
              <span dir="rtl">
                ظٹطھظ… ط¥ظ†ط´ط§ط، ط£ظ‚ط³ط§ظ… ظ†ط´ط§ط·ظƒ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ظˆطھطµط¨ط­ ط¬ط§ظ‡ط²ط© ط¯ط§ط®ظ„ ط¥ط¶ط§ظپط© ظ…ظ†طھط¬.
                ط£ظ†ط´ط¦ ظ‚ط³ظ…ط§ظ‹ ظ…ط®طµطµط§ظ‹ ظپظ‚ط· ط¹ظ†ط¯ظ…ط§ ظٹط­طھط§ط¬ ظ…طھط¬ط±ظƒ ط¥ظ„ظ‰ ظ‚ط³ظ… ط¥ط¶ط§ظپظٹ.
              </span>
            </section>

            <section className={styles.presetPanel}>
              <div className={styles.presetHeader}>
                <div>
                  <p className={styles.presetEyebrow}>
                    Automatically prepared / ط¬ط§ظ‡ط²ط© طھظ„ظ‚ط§ط¦ظٹط§ظ‹
                  </p>
                  <h2>
                    {businessPreset.label}
                    <span dir="rtl">{businessPreset.labelAr}</span>
                  </h2>
                  <p className={styles.presetIntro}>
                    Darik has already created all {preparedPresetCount} standard
                    bilingual departments for this retail field. They are ready
                    immediately inside Add Productâ€”there is nothing to select or
                    approve first.
                    <span dir="rtl">
                      ط£ظ†ط´ط£ ط¯ط§ط±ظٹظƒ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ط¬ظ…ظٹط¹ ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ظ‚ظٹط§ط³ظٹط© ظˆط¹ط¯ط¯ظ‡ط§{" "}
                      {preparedPresetCount} ظ„ظ‡ط°ط§ ط§ظ„ظ†ط´ط§ط· ط¨ط§ظ„ط¹ط±ط¨ظٹ ظˆط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹ.
                      ط§ظ„ط£ظ‚ط³ط§ظ… ط¬ط§ظ‡ط²ط© ظ…ط¨ط§ط´ط±ط© ط¯ط§ط®ظ„ ط¥ط¶ط§ظپط© ظ…ظ†طھط¬طŒ ظˆظ„ط§ طھط­طھط§ط¬ ط¥ظ„ظ‰ طھط­ط¯ظٹط¯ظ‡ط§
                      ط£ظˆ ط§ط¹طھظ…ط§ط¯ظ‡ط§ ط£ظˆظ„ط§ظ‹.
                    </span>
                  </p>
                </div>

                <div className={styles.presetActions}>
                  <button
                    type="button"
                    className={styles.selectAllButton}
                    onClick={() => router.push("/store-dashboard/products")}
                  >
                    Add a product / ط¥ط¶ط§ظپط© ظ…ظ†طھط¬
                  </button>
                  <button
                    type="button"
                    className={styles.customCategoryButton}
                    onClick={openCreateForm}
                  >
                    + Custom category / ظ‚ط³ظ… ظ…ط®طµطµ
                  </button>
                </div>
              </div>

              <footer className={styles.presetFooter}>
                <span>
                  {preparedPresetCount} ready / {preparedPresetCount} ط¬ط§ظ‡ط²
                </span>
                <p>
                  Default categories stay hidden from the customer storefront
                  until at least one visible product is assigned to them. You
                  can still rename, hide, archive, reorder, or add custom
                  categories at any time.
                  <span dir="rtl">
                    طھط¨ظ‚ظ‰ ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹط© ظ…ط®ظپظٹط© ط¹ظ† ظˆط§ط¬ظ‡ط© ط§ظ„ط¹ظ…ظ„ط§ط، ط­طھظ‰ ظٹطھظ… ط±ط¨ط·
                    ظ…ظ†طھط¬ ط¸ط§ظ‡ط± ظˆط§ط­ط¯ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„ ط¨ظ‡ط§. ظˆظٹظ…ظƒظ†ظƒ طھط¹ط¯ظٹظ„ظ‡ط§ ط£ظˆ ط¥ط®ظپط§ط،ظ‡ط§ ط£ظˆ
                    ط£ط±ط´ظپطھظ‡ط§ ط£ظˆ طھط±طھظٹط¨ظ‡ط§ ط£ظˆ ط¥ط¶ط§ظپط© ط£ظ‚ط³ط§ظ… ظ…ط®طµطµط© ظپظٹ ط£ظٹ ظˆظ‚طھ.
                  </span>
                </p>
              </footer>
            </section>

            <section className={styles.metrics}>
              <article>
                <span>Current categories / ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط­ط§ظ„ظٹط©</span>
                <strong>{counts.current}</strong>
                <p>Active and hidden / ط¸ط§ظ‡ط±ط© ظˆظ…ط®ظپظٹط©</p>
              </article>
              <article>
                <span>Visible / ط¸ط§ظ‡ط±</span>
                <strong>{counts.active}</strong>
                <p>Shown to customers / طھط¸ظ‡ط± ظ„ظ„ط¹ظ…ظ„ط§ط،</p>
              </article>
              <article>
                <span>Hidden / ظ…ط®ظپظٹ</span>
                <strong>{counts.hidden}</strong>
                <p>Products hidden with them / ظ…ظ†طھط¬ط§طھظ‡ط§ ظ…ط®ظپظٹط©</p>
              </article>
              <article>
                <span>Uncategorized products / ظ…ظ†طھط¬ط§طھ ط¨ظ„ط§ ظ‚ط³ظ…</span>
                <strong>{counts.uncategorized}</strong>
                <p>Still shown under All products / طھط¸ظ‡ط± طھط­طھ ظƒظ„ ط§ظ„ظ…ظ†طھط¬ط§طھ</p>
              </article>
            </section>

            <section className={styles.catalogPanel}>
              <div className={styles.catalogHeader}>
                <div>
                  <p>Category manager / ط¥ط¯ط§ط±ط© ط§ظ„ط£ظ‚ط³ط§ظ…</p>
                  <h2>Organize your storefront / ط±طھظ‘ط¨ ظˆط§ط¬ظ‡ط© ظ…طھط¬ط±ظƒ</h2>
                </div>

                <div className={styles.filters}>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search categories / ط§ط¨ط­ط« ظپظٹ ط§ظ„ط£ظ‚ط³ط§ظ…"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="current">Current categories / ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط­ط§ظ„ظٹط©</option>
                    <option value="active">Visible / ط¸ط§ظ‡ط±</option>
                    <option value="hidden">Hidden / ظ…ط®ظپظٹ</option>
                    <option value="archived">Archived / ظ…ط¤ط±ط´ظپط©</option>
                    <option value="all">All statuses / ظƒظ„ ط§ظ„ط­ط§ظ„ط§طھ</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className={styles.loadingBlock}>
                  <div className={styles.spinner} />
                  <span>Loading categoriesâ€¦ / ط¬ط§ط±ظچ طھط­ظ…ظٹظ„ ط§ظ„ط£ظ‚ط³ط§ظ…â€¦</span>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className={styles.emptyCatalog}>
                  <div className={styles.emptyIcon}>+</div>
                  <h3>
                    {categories.length === 0
                      ? "Default departments are being prepared automatically"
                      : "No categories match this filter / ظ„ط§ طھظˆط¬ط¯ ط£ظ‚ط³ط§ظ… ظ…ط·ط§ط¨ظ‚ط©"}
                  </h3>
                  <p>
                    Refresh once if setup just completed, or create a custom
                    department when your store needs an additional option.
                  </p>
                  {categories.length === 0 ? (
                    <button onClick={openCreateForm}>Add custom category / ط¥ط¶ط§ظپط© ظ‚ط³ظ… ظ…ط®طµطµ</button>
                  ) : null}
                </div>
              ) : (
                <div className={styles.categoryGrid}>
                  {filteredCategories.map((category) => {
                    const productCount =
                      productCountByCategory.get(category.id) ?? 0;
                    const automaticImageUrl =
                      automaticImageByCategory.get(category.id) ?? null;
                    const effectiveImageUrl =
                      category.image_url || automaticImageUrl;
                    const imageSource = category.image_url
                      ? "manual"
                      : automaticImageUrl
                        ? "automatic"
                        : "none";

                    return (
                      <article className={styles.categoryCard} key={category.id}>
                        <div className={styles.categoryImage}>
                          {effectiveImageUrl ? (
                            <img src={effectiveImageUrl} alt={category.name} />
                          ) : (
                            <span>{category.name.slice(0, 1).toUpperCase()}</span>
                          )}

                          {imageSource !== "none" ? (
                            <span
                              className={`${styles.imageSourceBadge} ${
                                imageSource === "manual"
                                  ? styles.manualImageBadge
                                  : styles.automaticImageBadge
                              }`}
                            >
                              {imageSource === "manual"
                                ? "Custom / ظ…ط®طµطµط©"
                                : "First product / ط£ظˆظ„ ظ…ظ†طھط¬"}
                            </span>
                          ) : null}

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
                              <span>Products / ط§ظ„ظ…ظ†طھط¬ط§طھ</span>
                              <strong>{productCount}</strong>
                            </div>
                            <div>
                              <span>Display order / طھط±طھظٹط¨ ط§ظ„ط¹ط±ط¶</span>
                              <strong>{Number(category.sort_order ?? 1000)}</strong>
                            </div>
                          </div>

                          <div className={styles.categoryActions}>
                            <button onClick={() => openEditForm(category)}>
                              Edit / طھط¹ط¯ظٹظ„
                            </button>

                            {category.category_status === "active" ? (
                              <button
                                onClick={() =>
                                  setCategoryStatus(category, "hidden")
                                }
                              >
                                Hide / ط¥ط®ظپط§ط،
                              </button>
                            ) : category.category_status === "hidden" ? (
                              <button
                                className={styles.activateAction}
                                onClick={() =>
                                  setCategoryStatus(category, "active")
                                }
                              >
                                Show / ط¥ط¸ظ‡ط§ط±
                              </button>
                            ) : (
                              <button
                                className={styles.activateAction}
                                onClick={() =>
                                  setCategoryStatus(category, "active")
                                }
                              >
                                Restore / ط§ط³طھط¹ط§ط¯ط©
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
                                Archive / ط£ط±ط´ظپط©
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
                <p>{editingCategoryId ? "Edit category / طھط¹ط¯ظٹظ„ ط§ظ„ظ‚ط³ظ…" : "New custom category / ظ‚ط³ظ… ظ…ط®طµطµ ط¬ط¯ظٹط¯"}</p>
                <h2>
                  {editingCategoryId
                    ? "Update store category / طھط¹ط¯ظٹظ„ ظ‚ط³ظ… ط§ظ„ظ…طھط¬ط±"
                    : "Create a custom category / ط¥ظ†ط´ط§ط، ظ‚ط³ظ… ظ…ط®طµطµ"}
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
                أ—
              </button>
            </header>

            <form className={styles.categoryForm} onSubmit={saveCategory}>
              <div className={styles.formMain}>
                <label>
                  Category name (English) / ط§ط³ظ… ط§ظ„ظ‚ط³ظ… ط¨ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©
                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="Brake Parts"
                    required
                  />
                </label>

                <label>
                  Category name (Arabic) / ط§ط³ظ… ط§ظ„ظ‚ط³ظ… ط¨ط§ظ„ط¹ط±ط¨ظٹط©
                  <input
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(event) =>
                      updateForm("nameAr", event.target.value)
                    }
                    placeholder="ط§ط³ظ… ط§ظ„طھطµظ†ظٹظپ ط¨ط§ظ„ط¹ط±ط¨ظٹ"
                  />
                </label>

                <label>
                  Description / ط§ظ„ظˆطµظپ
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    rows={4}
                    placeholder="Optional / ط§ط®طھظٹط§ط±ظٹ"
                  />
                </label>

                <div className={styles.twoColumns}>
                  <label>
                    Visibility / ط§ظ„ط¸ظ‡ظˆط±
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target.value as CategoryForm["status"]
                        )
                      }
                    >
                      <option value="active">Visible / ط¸ط§ظ‡ط±</option>
                      <option value="hidden">Hidden / ظ…ط®ظپظٹ</option>
                    </select>
                  </label>

                  <label>
                    Display order / طھط±طھظٹط¨ ط§ظ„ط¹ط±ط¶
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
                  <strong>Hiding a category hides its assigned products / ط¥ط®ظپط§ط، ط§ظ„ظ‚ط³ظ… ظٹط®ظپظٹ ظ…ظ†طھط¬ط§طھظ‡</strong>
                  <p>
                    Products are not deleted. Show the category again or move
                    them to another category. / ظ„ط§ ظٹطھظ… ط­ط°ظپ ط§ظ„ظ…ظ†طھط¬ط§طھطŒ ظˆظٹظ…ظƒظ†ظƒ ط¥ط¸ظ‡ط§ط±
                    ط§ظ„ظ‚ط³ظ… ظ…ط¬ط¯ط¯ط§ظ‹ ط£ظˆ ظ†ظ‚ظ„ظ‡ط§ ط¥ظ„ظ‰ ظ‚ط³ظ… ط¢ط®ط±.
                  </p>
                </div>
              </div>

              <aside className={styles.imagePanel}>
                <div className={styles.imagePreview}>
                  {form.imageUrl || editingAutomaticImageUrl ? (
                    <img
                      src={form.imageUrl || editingAutomaticImageUrl || ""}
                      alt="Category preview"
                    />
                  ) : (
                    <div>
                      <strong>Category image / طµظˆط±ط© ط§ظ„ظ‚ط³ظ…</strong>
                      <span>Added automatically with the first product / طھط¶ط§ظپ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ظ…ط¹ ط£ظˆظ„ ظ…ظ†طھط¬</span>
                    </div>
                  )}
                </div>

                <label className={styles.uploadButton}>
                  {uploading ? "Uploadingâ€¦ / ط¬ط§ط±ظچ ط§ظ„ط±ظپط¹â€¦" : "Upload category image / ط±ظپط¹ طµظˆط±ط© ط§ظ„ظ‚ط³ظ…"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    disabled={uploading || saving}
                  />
                </label>

                <label>
                  Or paste image URL / ط£ظˆ ط§ظ„طµظ‚ ط±ط§ط¨ط· ط§ظ„طµظˆط±ط©
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(event) =>
                      updateForm("imageUrl", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>

                {form.imageUrl ? (
                  <button
                    type="button"
                    className={styles.resetImageButton}
                    onClick={() => updateForm("imageUrl", "")}
                    disabled={uploading || saving}
                  >
                    Use automatic product image / ط§ط³طھط®ط¯ط§ظ… طµظˆط±ط© ط§ظ„ظ…ظ†طھط¬ ط§ظ„طھظ„ظ‚ط§ط¦ظٹط©
                  </button>
                ) : null}

                <div className={styles.autoImageNote}>
                  <strong>Automatic category image / طµظˆط±ط© طھظ„ظ‚ط§ط¦ظٹط© ظ„ظ„ظ‚ط³ظ…</strong>
                  <p>
                    If you do not upload a custom image, Darik uses the first
                    available product photo in this category. Uploading an image
                    here overrides it. / ط¥ط°ط§ ظ„ظ… طھط±ظپط¹ طµظˆط±ط© ظ…ط®طµطµط©طŒ ظٹط³طھط®ط¯ظ… ط¯ط§ط±ظٹظƒ
                    طµظˆط±ط© ط£ظˆظ„ ظ…ظ†طھط¬ ظ…طھط§ط­ ظپظٹ ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ…طŒ ظˆط±ظپط¹ طµظˆط±ط© ظ‡ظ†ط§ ظٹط³طھط¨ط¯ظ„ظ‡ط§.
                  </p>
                </div>

                <div className={styles.channelNote}>
                  <strong>Independent from Darik Marketplace / ظ…ط³طھظ‚ظ„ ط¹ظ† ط³ظˆظ‚ ط¯ط§ط±ظٹظƒ</strong>
                  <p>
                    This category exists only inside this storeâ€™s Darik Direct
                    storefront. / ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ط®ط§طµ ط¨ظˆط§ط¬ظ‡ط© ظ‡ط°ط§ ط§ظ„ظ…طھط¬ط± ظپظ‚ط·.
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
                  Cancel / ط¥ظ„ط؛ط§ط،
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving || uploading}
                >
                  {saving
                    ? "Savingâ€¦"
                    : editingCategoryId
                      ? "Save category / ط­ظپط¸ ط§ظ„ظ‚ط³ظ…"
                      : "Create category / ط¥ظ†ط´ط§ط، ط§ظ„ظ‚ط³ظ…"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
