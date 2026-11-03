// DARIK_WHOLESALE_FRONTEND_V001
import type { Metadata } from "next";
import WholesaleExperience from "./WholesaleExperience";

export const metadata: Metadata = {
  title: "Darik Wholesale | Buy Together. Buy Direct.",
  description:
    "Pool wholesale orders with businesses across Jordan to unlock factory-direct pricing from trusted suppliers.",
};

export default function WholesalePage() {
  return <WholesaleExperience />;
}
