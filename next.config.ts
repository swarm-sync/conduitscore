import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const projectRoot = fileURLToPath(new URL("./", import.meta.url));

const nextConfig: NextConfig = {
  // SEO: Enforce trailing slashes for canonical URL consistency
  trailingSlash: false,

  // B11: Ensure gzip compression is enabled for all text responses
  compress: true,

  outputFileTracingRoot: projectRoot,

  turbopack: {
    root: projectRoot,
  },

  // SEO: Enable image optimization with proper formats
  images: {
    formats: ["image/avif", "image/webp"],
    // B3/B10: Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
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
        // B10: Long-cache static assets for performance (CWV)
        // Added webp, avif, woff for comprehensive coverage
        source: "/(.*)\\.(js|css|woff|woff2|png|jpg|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
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
