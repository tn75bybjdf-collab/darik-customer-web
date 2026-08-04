import type { MetadataRoute } from "next";

const siteUrl = "https://getdarik.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/dariktech",
          "/dariktech/",
          "/ar/dariktech/",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/private/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
