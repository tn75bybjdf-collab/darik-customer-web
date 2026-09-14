// DARIK_LEGACY_STOREFRONT_REDIRECT_027
import { redirect } from "next/navigation";

export default async function LegacyStorefrontRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${encodeURIComponent(slug)}`);
}
