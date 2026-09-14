"use client";

// DARIK_FURNITURE_OPTIONAL_ITEM_VIDEO_068

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import styles from "./storefront.module.css";

type Props = {
  enabled: boolean;
  productId: string;
  productName: string;
};

export default function FurnitureItemVideo({
  enabled,
  productId,
  productName,
}: Props) {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadVideo() {
      if (!enabled || !productId) {
        if (!cancelled) setVideoUrl("");
        return;
      }

      const result = await supabase
        .from("public_storefront_product_videos")
        .select("direct_item_video_url")
        .eq("product_id", productId)
        .maybeSingle();

      if (cancelled) return;

      if (result.error) {
        setVideoUrl("");
        return;
      }

      setVideoUrl(
        String(result.data?.direct_item_video_url || "").trim()
      );
    }

    void loadVideo();

    return () => {
      cancelled = true;
    };
  }, [enabled, productId]);

  if (!enabled || !videoUrl) return null;

  return (
    <video
      className={styles.furnitureItemVideo}
      src={videoUrl}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      controls={false}
      disablePictureInPicture
      aria-label={`Short video of ${productName}`}
    />
  );
}
