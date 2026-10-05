import type { ReactNode } from "react";
import { notFound } from "next/navigation";

// DARIK_FRONTEND_386_PARTPOS_TEMPORARILY_DISABLED
// Intentional temporary kill switch for the entire public /partpos route tree.
// Remove this layout when PartPOS is ready to become publicly accessible again.
export default function PartPosTemporarilyDisabledLayout({
  children: _children,
}: {
  children: ReactNode;
}) {
  notFound();
}