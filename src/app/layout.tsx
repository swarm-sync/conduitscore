import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/[\r\n\s]+/g, "") || "https://conduitscore.com";
const BRAND_LOGO_PATH = "/logo.svg";
const APPLE_TOUCH_ICON_PATH = "/logo.svg";
const FAVICON_32_PATH = "/logo.svg";
const FAVICON_16_PATH = "/logo.svg";
const FAVICON_ICO_PATH = "/logo.svg";
const OG_IMAGE_PATH = "/NEWNEW/og-image-1200x630.png";
const SITE_MANIFEST_PATH = "/NEWNEW/site.webmanifest";

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
    images: [`${SITE_URL}${OG_IMAGE_PATH}`],
  },

  twitter: {
    card: "summary_large_image",
    title: "ConduitScore - AI Visibility Score Scanner | Optimize for ChatGPT, Perplexity & Claude",
    description:
      "Check how AI agents see your website in 15 seconds. Get your AI visibility score with copy-paste fixes for ChatGPT, Perplexity, Claude, and Gemini optimization. Free AI SEO scanner.",
    images: [`${SITE_URL}${OG_IMAGE_PATH}`],
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
    logo: `${SITE_URL}${BRAND_LOGO_PATH}`,
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
    screenshot: `${SITE_URL}${OG_IMAGE_PATH}`,
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
        name: "Diagnose",
        price: "0",
        priceCurrency: "USD",
        description: "3 scans per month, single URL analysis",
      },
      {
        "@type": "Offer",
        name: "Fix",
        price: "29",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        description: "50 scans per month, SEO scoring, email alerts",
      },
      {
        "@type": "Offer",
        name: "Monitor",
        price: "49",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        description: "100 scans per month, full code fixes, issue descriptions",
      },
      {
        "@type": "Offer",
        name: "Alert",
        price: "79",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        description: "500 scans per month, score trends, email alerts",
      },
      {
        "@type": "Offer",
        name: "Scale",
        description: "Unlimited scans, bulk scanning, REST API access — contact us",
      },
    ],
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
        <link rel="icon" href={FAVICON_32_PATH} type="image/png" sizes="32x32" />
        <link rel="icon" href={FAVICON_16_PATH} type="image/png" sizes="16x16" />
        <link rel="shortcut icon" href={FAVICON_ICO_PATH} />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_PATH} />
        <link rel="manifest" href={SITE_MANIFEST_PATH} />
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
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)}, { send_page_view: true });
`}
            </Script>
          </>
        ) : null}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
