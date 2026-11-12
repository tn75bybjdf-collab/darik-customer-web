"use client";
import { useCallback, useEffect, useRef } from "react";
import { AL_SALAM_APPROVED_HTML } from "./alsalamApprovedHtml";
import "./alsalamApproved.css";

export type AlSalamLiveProduct = {
  uuid: string; name: string; ar: string; price: number;
  category: string; size: string; img: string; fallback_img?: string;
};
export type AlSalamLiveCategory = { name: string; ar: string; count: number; };
type Props = {
  products: AlSalamLiveProduct[];
  categories: AlSalamLiveCategory[];
  cartCount: number;
  onAddProduct: (uuid: string) => void;
  onOpenCart: () => void;
  onOpenAccount: () => void;
};

export default function AlSalamApprovedStore({
  products, categories, cartCount, onAddProduct, onOpenCart, onOpenAccount,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const productsRef = useRef(products);
  const categoriesRef = useRef(categories);
  const countRef = useRef(cartCount);
  const handlersRef = useRef({ onAddProduct, onOpenCart, onOpenAccount });
  productsRef.current = products;
  categoriesRef.current = categories;
  countRef.current = cartCount;
  handlersRef.current = { onAddProduct, onOpenCart, onOpenAccount };

  const syncFrame = useCallback(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    target.postMessage({
      source: "darik-alsalam-parent", type: "catalog",
      products: productsRef.current, categories: categoriesRef.current,
    }, "*");
    target.postMessage({
      source: "darik-alsalam-parent", type: "cartCount",
      count: countRef.current,
    }, "*");
  }, []);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const message = event.data;
      if (!message || message.source !== "darik-alsalam-approved") return;
      if (message.type === "ready") syncFrame();
      else if (message.type === "add") {
        if (typeof message.productId === "string" && message.productId) {
          handlersRef.current.onAddProduct(message.productId);
        }
      } else if (message.type === "cart") handlersRef.current.onOpenCart();
      else if (message.type === "account") handlersRef.current.onOpenAccount();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [syncFrame]);

  useEffect(() => { syncFrame(); }, [products, categories, cartCount, syncFrame]);

  return <div className="alsalamApprovedHost" aria-label="Al Salam Market mobile storefront">
    <iframe
      ref={frame}
      title="Al Salam Market"
      srcDoc={AL_SALAM_APPROVED_HTML}
      onLoad={syncFrame}
      scrolling="yes"
      allow="clipboard-write"
    />
  </div>;
}
