import type { MetadataRoute } from "next";

const siteUrl = "https://getdarik.com";

const pages = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/dariktech",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/dariktech/portfolio",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/dariktech/services/mobile-web-admin",
    changeFrequency: "monthly",
    priority: 0.82,
  },
  {
    path: "/dariktech/mobile-app-development-jordan",
    changeFrequency: "weekly",
    priority: 0.94,
  },
  {
    path: "/dariktech/website-development-jordan",
    changeFrequency: "weekly",
    priority: 0.94,
  },
  {
    path: "/dariktech/admin-dashboard-development-jordan",
    changeFrequency: "weekly",
    priority: 0.94,
  },
  {
    path: "/dariktech/work/darik-marketplace",
    changeFrequency: "monthly",
    priority: 0.76,
  },
  {
    path: "/dariktech/work/partbid",
    changeFrequency: "monthly",
    priority: 0.76,
  },
  {
    path: "/dariktech/work/tawleh-manager",
    changeFrequency: "monthly",
    priority: 0.78,
  },
  {
    path: "/dariktech/app-developer-jordan",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/dariktech/app-developer-dubai",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/ar/dariktech/app-developer-jordan",
    changeFrequency: "weekly",
    priority: 0.92,
  },
  {
    path: "/ar/dariktech/app-developer-dubai",
    changeFrequency: "weekly",
    priority: 0.92,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
