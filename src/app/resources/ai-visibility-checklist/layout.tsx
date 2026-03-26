import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.conduitscore.com";

export const metadata: Metadata = {
  title: "Free AI Visibility Checklist - ConduitScore",
  description:
    "Audit all 14 AI visibility signals ChatGPT, Claude, and Perplexity use to find your site. Free downloadable checklist with code fixes and examples. Download instantly.",
  keywords: [
    "AI visibility checklist",
    "AI SEO checklist",
    "ChatGPT optimization checklist",
    "AI crawler access",
    "llms.txt guide",
    "structured data AI",
    "GEO checklist",
    "generative engine optimization",
    "AI search optimization guide",
  ],
  alternates: {
    canonical: `${SITE_URL}/resources/ai-visibility-checklist`,
  },
  openGraph: {
    title: "Free AI Visibility Checklist — 14 Signals, Copy-Paste Code Fixes",
    description:
      "Audit all 14 AI visibility signals ChatGPT, Claude, and Perplexity use to find your site. Free downloadable checklist with code examples and before/after comparisons.",
    url: `${SITE_URL}/resources/ai-visibility-checklist`,
    type: "website",
    siteName: "ConduitScore",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Visibility Checklist — 14 Signals, Copy-Paste Code Fixes",
    description:
      "Audit all 14 AI visibility signals ChatGPT, Claude, and Perplexity use to find your site. Free download, instant access.",
    creator: "@conduitscore",
  },
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
