import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO: Enforce trailing slashes for canonical URL consistency
  trailingSlash: false,

  // SEO: Enable image optimization with proper formats
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "conduitscore.com",
      },
    ],
  },

  // SEO: Security and performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Long-cache static assets for performance (CWV)
        source: "/(.*)\\.(js|css|woff2|png|jpg|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Proper caching for llms.txt
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // SEO: Redirect www to non-www for canonical consistency
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.conduitscore.com" }],
        destination: "https://conduitscore.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
