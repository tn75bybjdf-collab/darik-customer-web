"use client";

// DARIK_SHARED_PERSISTENT_CUSTOMER_ACCOUNT_HUB_175_V2
// DARIK_CUSTOMER_ORDER_RECEIPT_REORDER_176
// DARIK_CUSTOMER_ORDER_RECEIPT_REORDER_176_V2

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./darikCustomerAccountHub175.module.css";

type DarikAccountScope175 = "all" | "store";

type DarikCustomerProfile175 = {
  id: string;
  auth_user_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type DarikCustomerOrder175 = {
  id: string;
  order_number?: string | number | null;
  order_status?: string | null;
  total?: number | string | null;
  created_at?: string | null;
  storefront_retailer_id?: string | null;
  storefront_name_snapshot?: string | null;
  storefront_slug_snapshot?: string | null;
};

type DarikCustomerOrderItem176 = {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name?: string | null;
  quantity?: number | string | null;
  unit_price?: number | string | null;
  line_total?: number | string | null;
  image_url?: string | null;
  retailer_id?: string | null;
  store_slug?: string | null;
  store_name?: string | null;
  product_available?: boolean | null;
  product_href?: string | null;
};

type DarikCustomerOrderDetail176 = {
  id: string;
  order_number?: string | number | null;
  order_status?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  fulfillment_method?: string | null;
  subtotal?: number | string | null;
  delivery_fee?: number | string | null;
  total?: number | string | null;
  created_at?: string | null;
  sales_channel?: string | null;
  storefront_retailer_id?: string | null;
  storefront_slug?: string | null;
  storefront_name?: string | null;
};

type DarikAccountView175 =
  | "menu"
  | "orders"
  | "order"
  | "details"
  | "password";

type DarikCustomerAccountHub175Props = {
  scope: DarikAccountScope175;
  retailerId?: string | null;
};

function strongPassword175(value: string) {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

function orderStatusLabel175(status: string | null | undefined) {
  return String(status || "order")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function money176(value: number | string | null | undefined) {
  const numberValue = Number(value ?? 0);
  if (!Number.isFinite(numberValue)) return "0.00";
  return numberValue.toFixed(2);
}

function cleanLabel176(value: string | null | undefined) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DarikCustomerAccountHub175({
  scope,
  retailerId = null,
}: DarikCustomerAccountHub175Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DarikCustomerProfile175 | null>(null);
  const [ready, setReady] = useState(false);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<DarikAccountView175>("menu");
  const [orders, setOrders] = useState<DarikCustomerOrder175[]>([]);
  const [ordersBusy, setOrdersBusy] = useState(false);

  const [selectedOrder176, setSelectedOrder176] =
    useState<DarikCustomerOrderDetail176 | null>(null);
  const [selectedOrderItems176, setSelectedOrderItems176] =
    useState<DarikCustomerOrderItem176[]>([]);
  const [orderDetailBusy176, setOrderDetailBusy176] = useState(false);

  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  async function readCustomerProfile175(nextSession: Session | null) {
    setSession(nextSession);

    if (!nextSession?.user?.id) {
      setProfile(null);
      setReady(true);
      return;
    }

    const result = await supabase
      .from("customers")
      .select("id,auth_user_id,full_name,email,phone")
      .eq("auth_user_id", nextSession.user.id)
      .maybeSingle();

    if (result.error || !result.data) {
      setProfile(null);
      setReady(true);
      return;
    }

    setProfile(result.data as DarikCustomerProfile175);
    setReady(true);
  }

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const current = await supabase.auth.getSession();
      if (cancelled) return;
      await readCustomerProfile175(current.data.session);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return;
      void readCustomerProfile175(nextSession);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const firstName = useMemo(() => {
    const raw =
      profile?.full_name?.trim() ||
      String(session?.user?.user_metadata?.full_name || "").trim() ||
      String(profile?.email || session?.user?.email || "").trim();

    if (!raw) return "Customer";

    const beforeAt = raw.includes("@") ? raw.split("@")[0] : raw;
    return beforeAt.split(/\s+/)[0] || "Customer";
  }, [profile, session]);

  async function loadOrders175() {
    if (!profile?.id) return;

    if (scope === "store" && !retailerId) {
      setOrders([]);
      setView("orders");
      setMessage("This store could not be identified yet.");
      return;
    }

    setOrdersBusy(true);
    setMessage("");

    try {
      let query = supabase
        .from("orders")
        .select(
          "id,order_number,order_status,total,created_at,storefront_retailer_id,storefront_name_snapshot,storefront_slug_snapshot"
        )
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (scope === "store" && retailerId) {
        query = query.eq("storefront_retailer_id", retailerId);
      }

      const result = await query;

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      setOrders((result.data ?? []) as DarikCustomerOrder175[]);
      setView("orders");
    } finally {
      setOrdersBusy(false);
    }
  }

  async function loadOrderDetail176(order: DarikCustomerOrder175) {
    setOrderDetailBusy176(true);
    setMessage("");
    setSelectedOrder176(null);
    setSelectedOrderItems176([]);
    setView("order");

    try {
      const result = await supabase.rpc("darik_customer_order_detail_v176", {
        p_order_id: order.id,
      });

      if (result.error) {
        setMessage(
          `${result.error.message} Run the DARIK 176 order-detail SQL if it has not been installed yet.`
        );
        return;
      }

      const payload = Array.isArray(result.data) ? result.data[0] : result.data;

      if (!payload?.success) {
        setMessage(payload?.message || "Could not open this Darik order.");
        return;
      }

      const detail = (payload.order ?? {}) as DarikCustomerOrderDetail176;
      const items = Array.isArray(payload.items)
        ? (payload.items as DarikCustomerOrderItem176[])
        : [];

      // Store history must remain store-scoped even at detail level.
      if (
        scope === "store" &&
        retailerId &&
        detail.storefront_retailer_id &&
        detail.storefront_retailer_id !== retailerId
      ) {
        setMessage("This order does not belong to this store.");
        setSelectedOrder176(null);
        setSelectedOrderItems176([]);
        return;
      }

      setSelectedOrder176(detail);
      setSelectedOrderItems176(items);
    } finally {
      setOrderDetailBusy176(false);
    }
  }

  async function signOut175() {
    setMessage("");

    const result = await supabase.auth.signOut();

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setOpen(false);
    setView("menu");
    setOrders([]);
    setSelectedOrder176(null);
    setSelectedOrderItems176([]);
    setNewPassword("");
    setConfirmPassword("");
    setProfile(null);
    setSession(null);
  }

  async function changePassword175() {
    setMessage("");

    if (!profile?.id || !session?.user?.id) {
      setMessage("Sign in before changing your password.");
      return;
    }

    if (!strongPassword175(newPassword)) {
      setMessage(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setPasswordBusy(true);

    try {
      const result = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully.");
    } finally {
      setPasswordBusy(false);
    }
  }

  function openMenu175() {
    setMessage("");
    setView("menu");
    setOpen((current) => !current);
  }

  if (!ready || !profile) {
    return null;
  }

  const ordersTitle =
    scope === "store" ? "Orders from this store" : "All Darik orders";

  const ordersSubtitle =
    scope === "store"
      ? "Only orders placed with this retailer are shown here."
      : "Your order history across Darik Marketplace and Darik Direct.";

  return (
    <div
      className={styles.darikAccountHub175}
      data-darik-customer-account-hub175={scope}
    >
      <div className={styles.darikHello175}>
        <span>Hello</span>
        <strong>{firstName}</strong>
      </div>

      <button
        type="button"
        className={styles.darikAccountIcon175}
        aria-label="Darik customer account"
        aria-expanded={open}
        onClick={openMenu175}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          className={styles.darikAccountPopover175}
          role="dialog"
          aria-label="Darik customer account"
        >
          <div className={styles.darikAccountHeader175}>
            <div>
              <small>DARIK ACCOUNT</small>
              <strong>Hello {firstName}</strong>
            </div>
            <button
              type="button"
              aria-label="Close account"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          {view === "menu" ? (
            <div className={styles.darikAccountMenu175}>
              <button
                type="button"
                disabled={ordersBusy}
                onClick={() => void loadOrders175()}
              >
                <span>↺</span>
                <div>
                  <strong>
                    {scope === "store"
                      ? "Past orders from this store"
                      : "Past orders"}
                  </strong>
                  <small>
                    {scope === "store"
                      ? "This retailer only"
                      : "All of your Darik orders"}
                  </small>
                </div>
              </button>

              <button type="button" onClick={() => setView("details")}>
                <span>◎</span>
                <div>
                  <strong>Account details</strong>
                  <small>Name, email and phone</small>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNewPassword("");
                  setConfirmPassword("");
                  setMessage("");
                  setView("password");
                }}
              >
                <span>⌁</span>
                <div>
                  <strong>Change password</strong>
                  <small>Update your Darik password</small>
                </div>
              </button>

              <button
                type="button"
                className={styles.darikSignOut175}
                onClick={() => void signOut175()}
              >
                <span>↗</span>
                <div>
                  <strong>Sign out</strong>
                  <small>Sign out on this browser/device</small>
                </div>
              </button>
            </div>
          ) : null}

          {view === "orders" ? (
            <div className={styles.darikAccountView175}>
              <button
                type="button"
                className={styles.darikBack175}
                onClick={() => {
                  setMessage("");
                  setView("menu");
                }}
              >
                ← Account
              </button>

              <div className={styles.darikViewHeading175}>
                <h4>{ordersTitle}</h4>
                <p>{ordersSubtitle}</p>
              </div>

              {ordersBusy ? (
                <p className={styles.darikMuted175}>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className={styles.darikMuted175}>
                  {scope === "store"
                    ? "No past orders from this store yet."
                    : "No past Darik orders yet."}
                </p>
              ) : (
                <div className={styles.darikOrderList175}>
                  {orders.map((order) => (
                    <button
                      type="button"
                      key={order.id}
                      className={styles.darikOrderSummary176}
                      onClick={() => void loadOrderDetail176(order)}
                    >
                      <div>
                        <span>
                          #{String(order.order_number ?? order.id.slice(0, 8))}
                        </span>
                        <strong>{orderStatusLabel175(order.order_status)}</strong>
                      </div>

                      {scope === "all" && order.storefront_name_snapshot ? (
                        <small className={styles.darikStoreName175}>
                          {order.storefront_name_snapshot}
                        </small>
                      ) : null}

                      <small>
                        {money176(order.total)} JOD
                        {order.created_at
                          ? ` · ${new Date(order.created_at).toLocaleDateString()}`
                          : ""}
                      </small>

                      <b className={styles.darikOpenOrder176}>
                        View order →
                      </b>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {view === "order" ? (
            <div className={styles.darikAccountView175}>
              <button
                type="button"
                className={styles.darikBack175}
                onClick={() => {
                  setMessage("");
                  setSelectedOrder176(null);
                  setSelectedOrderItems176([]);
                  setView("orders");
                }}
              >
                ← Past orders
              </button>

              {orderDetailBusy176 ? (
                <p className={styles.darikMuted175}>Opening order...</p>
              ) : selectedOrder176 ? (
                <>
                  <div className={styles.darikReceiptHeader176}>
                    <div>
                      <small>ORDER</small>
                      <h4>
                        #
                        {String(
                          selectedOrder176.order_number ??
                            selectedOrder176.id.slice(0, 8)
                        )}
                      </h4>
                    </div>
                    <strong>
                      {orderStatusLabel175(selectedOrder176.order_status)}
                    </strong>
                  </div>

                  <div className={styles.darikReceiptMeta176}>
                    {selectedOrder176.storefront_name ? (
                      <span>{selectedOrder176.storefront_name}</span>
                    ) : null}
                    {selectedOrder176.created_at ? (
                      <span>
                        {new Date(
                          selectedOrder176.created_at
                        ).toLocaleString()}
                      </span>
                    ) : null}
                    {selectedOrder176.payment_method ? (
                      <span>
                        {cleanLabel176(selectedOrder176.payment_method)}
                      </span>
                    ) : null}
                    {selectedOrder176.fulfillment_method ? (
                      <span>
                        {cleanLabel176(selectedOrder176.fulfillment_method)}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles.darikReceiptItems176}>
                    {selectedOrderItems176.length === 0 ? (
                      <p className={styles.darikMuted175}>
                        No item rows were found for this order.
                      </p>
                    ) : (
                      selectedOrderItems176.map((item) => {
                        const itemContent = (
                          <>
                            <div className={styles.darikReceiptImage176}>
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.product_name || "Ordered product"}
                                />
                              ) : (
                                <span>□</span>
                              )}
                            </div>

                            <div className={styles.darikReceiptItemInfo176}>
                              <strong>
                                {item.product_name || "Ordered item"}
                              </strong>
                              <span>
                                Qty {Number(item.quantity ?? 0)} · Price paid{" "}
                                {money176(item.unit_price)} JOD each
                              </span>
                              {scope === "all" && item.store_name ? (
                                <em className={styles.darikReceiptStore176}>
                                  {item.store_name}
                                </em>
                              ) : null}
                              {item.product_href ? (
                                <small>
                                  {item.product_available === false
                                    ? "View retailer / product"
                                    : "View product / reorder"}{" "}
                                  →
                                </small>
                              ) : (
                                <small className={styles.darikReceiptUnavailable176}>
                                  Product link unavailable
                                </small>
                              )}
                            </div>

                            <div className={styles.darikReceiptLineTotal176}>
                              <small>Line total</small>
                              <strong>
                                {money176(item.line_total)} JOD
                              </strong>
                            </div>
                          </>
                        );

                        return item.product_href ? (
                          <a
                            key={item.id}
                            href={item.product_href}
                            className={styles.darikReceiptItem176}
                            onClick={() => setOpen(false)}
                          >
                            {itemContent}
                          </a>
                        ) : (
                          <div
                            key={item.id}
                            className={styles.darikReceiptItem176}
                          >
                            {itemContent}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className={styles.darikReceiptTotals176}>
                    <div>
                      <span>Subtotal</span>
                      <strong>
                        {money176(selectedOrder176.subtotal)} JOD
                      </strong>
                    </div>
                    <div>
                      <span>Delivery</span>
                      <strong>
                        {money176(selectedOrder176.delivery_fee)} JOD
                      </strong>
                    </div>
                    <div className={styles.darikReceiptGrandTotal176}>
                      <span>Order total</span>
                      <strong>
                        {money176(selectedOrder176.total)} JOD
                      </strong>
                    </div>
                  </div>

                  <p className={styles.darikReceiptPriceNote176}>
                    Prices above are the prices recorded when this order was
                    placed. Current store prices may be different.
                  </p>
                </>
              ) : null}
            </div>
          ) : null}

          {view === "details" ? (
            <div className={styles.darikAccountView175}>
              <button
                type="button"
                className={styles.darikBack175}
                onClick={() => {
                  setMessage("");
                  setView("menu");
                }}
              >
                ← Account
              </button>

              <div className={styles.darikViewHeading175}>
                <h4>Account details</h4>
                <p>Your Darik customer information.</p>
              </div>

              <div className={styles.darikDetails175}>
                <label>
                  <span>Name</span>
                  <strong>{profile.full_name || "—"}</strong>
                </label>
                <label>
                  <span>Email</span>
                  <strong>{profile.email || session?.user?.email || "—"}</strong>
                </label>
                <label>
                  <span>Phone</span>
                  <strong>{profile.phone || "—"}</strong>
                </label>
              </div>
            </div>
          ) : null}

          {view === "password" ? (
            <div className={styles.darikAccountView175}>
              <button
                type="button"
                className={styles.darikBack175}
                onClick={() => {
                  setMessage("");
                  setView("menu");
                }}
              >
                ← Account
              </button>

              <div className={styles.darikViewHeading175}>
                <h4>Change password</h4>
                <p>Use your new password everywhere you sign in to Darik.</p>
              </div>

              <label className={styles.darikPasswordField175}>
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </label>

              <label className={styles.darikPasswordField175}>
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </label>

              <button
                type="button"
                className={styles.darikPasswordSave175}
                disabled={passwordBusy}
                onClick={() => void changePassword175()}
              >
                {passwordBusy ? "Changing..." : "Change password"}
              </button>
            </div>
          ) : null}

          {message ? (
            <p className={styles.darikMessage175} role="status">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
