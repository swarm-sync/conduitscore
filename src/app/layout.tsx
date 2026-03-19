import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

export const dynamic = "force-dynamic";

/* ──────────────────────────────────────────────────────────────────────
   B1: Self-host Google Fonts via next/font/google
   Eliminates render-blocking external CSS (~116 KiB), the
   fonts.googleapis.com -> fonts.gstatic.com chain, and adds automatic
   font-display: swap. Expected mobile savings: ~1,660 ms.
   ─────────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-syne",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://conduitscore.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#080809" },
    { media: "(prefers-color-scheme: dark)", color: "#080809" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "ConduitScore - AI Visibility Score Scanner | Optimize for ChatGPT, Perplexity & Claude",
    template: "%s | ConduitScore",
  },
  description:
    "Check how AI agents see your website in 15 seconds. Get your AI visibility score with copy-paste fixes for ChatGPT, Perplexity, Claude, and Gemini optimization. Free AI SEO scanner.",
  keywords: [
    "AI SEO",
    "AI visibility score",
    "agent optimization",
    "GEO optimization",
    "generative engine optimization",
    "AI search optimization",
    "ChatGPT SEO",
    "Perplexity optimization",
    "Claude optimization",
    "LLM optimization",
    "AI crawler access",
    "structured data for AI",
    "llms.txt",
    "answer engine optimization",
    "AEO",
    "AI website scanner",
    "AI readiness score",
  ],

  applicationName: "ConduitScore",
  authors: [{ name: "ConduitScore", url: SITE_URL }],
  creator: "ConduitScore",
  publisher: "ConduitScore",
  generator: "Next.js",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "ConduitScore",
    title: "ConduitScore - AI Visibility Score Scanner | Optimize for ChatGPT, Perplexity & Claude",
    description:
      "Check how AI agents see your website in 15 seconds. Get your AI visibility score with copy-paste fixes for ChatGPT, Perplexity, Claude, and Gemini optimization. Free AI SEO scanner.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 1200,
        alt: "ConduitScore - AI Visibility Score Scanner",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ConduitScore - AI Visibility Score Scanner | Optimize for ChatGPT, Perplexity & Claude",
    description:
      "Check how AI agents see your website in 15 seconds. Get your AI visibility score with copy-paste fixes for ChatGPT, Perplexity, Claude, and Gemini optimization. Free AI SEO scanner.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@conduitscore",
    site: "@conduitscore",
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "Technology",

  other: {
    "msapplication-TileColor": "#FF2D55",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ConduitScore",
    url: SITE_URL,
    logo: `${SITE_URL}/conduitscore_mark.svg`,
    description:
      "ConduitScore is the leading AI visibility scanner that checks how ChatGPT, Perplexity, Claude, and other AI agents see your website. Get your AI readiness score in 15 seconds with actionable fixes.",
    foundingDate: "2026",
    sameAs: [
      "https://twitter.com/conduitscore",
      "https://linkedin.com/company/conduitscore",
      "https://github.com/conduitscore",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@conduitscore.com",
      contactType: "customer support",
      availableLanguage: "English",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function SoftwareApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ConduitScore",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "SEO Tool",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "AI visibility scanner that analyzes how ChatGPT, Perplexity, Claude, and Gemini see your website across 7 categories: crawler access, structured data, content structure, LLMs.txt, technical health, citation signals, and content quality.",
    screenshot: `${SITE_URL}/og-image.png`,
    featureList: [
      "AI Visibility Score (0-100)",
      "7-Category Analysis",
      "Crawler Access Detection",
      "Structured Data Analysis",
      "LLMs.txt Validation",
      "Content Structure Audit",
      "Citation Signal Detection",
      "Copy-Paste Code Fixes",
      "ChatGPT Optimization",
      "Perplexity Optimization",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "3 scans per month, single URL analysis",
      },
      {
        "@type": "Offer",
        name: "Starter",
        price: "29",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        description: "50 scans per month, SEO scoring, email alerts",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "199",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        description: "500 scans per month, site-wide crawling, competitor tracking",
      },
      {
        "@type": "Offer",
        name: "Agency",
        price: "499",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        description: "Unlimited scans, white-label, REST API access",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ConduitScore",
    url: SITE_URL,
    description:
      "Check how AI agents see your website. Get your AI visibility score in 15 seconds.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/scan-result?url={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable} ${syne.variable}`}>
      <head>
        <link rel="icon" href="/favicon-mark.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body
        className="antialiased"
        style={{
          background: "var(--surface-base)",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-body)",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
