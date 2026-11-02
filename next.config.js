/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "alsalammarka.com" }],
        destination: "https://www.getdarik.com/alsalam",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.alsalammarka.com" }],
        destination: "https://www.getdarik.com/alsalam",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
