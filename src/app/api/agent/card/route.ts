import { NextResponse } from "next/server";

export async function GET() {
  const agentCard = {
    schema_version: "1.0",
    name: "ConduitScore",
    description:
      "AI visibility scanner that scores any website 0–100 for discoverability by ChatGPT, Perplexity, Claude, and other AI agents.",
    logo: "https://conduitscore.com/logo.svg",
    homepage: "https://conduitscore.com",
    contact_email: "benstone@conduitscore.com",
    documentation_url: "https://conduitscore.com/docs",
    api_base_url: "https://conduitscore.com/api",
    capabilities: {
      scan: {
        description:
          "Scan a website and analyze its AI visibility across 7 categories",
        endpoint: "/api/scan",
        method: "POST",
        authentication_required: false,
        parameters: {
          url: {
            type: "string",
            description: "Website URL to scan (https required)",
            required: true,
          },
        },
        response_format: "json",
        rate_limit: {
          free: "1 per minute, 3 per month",
          paid: "Per-tier limits",
        },
      },
      history: {
        description: "Retrieve scan history for authenticated user",
        endpoint: "/api/scans",
        method: "GET",
        authentication_required: true,
        parameters: {
          limit: {
            type: "integer",
            description: "Number of scans to return (default 10, max 100)",
            required: false,
          },
        },
        response_format: "json",
      },
      get_scan: {
        description: "Retrieve a specific scan result",
        endpoint: "/api/scans/{id}",
        method: "GET",
        authentication_required: false,
        response_format: "json",
      },
      public_report: {
        description:
          "Get publicly shareable scan report (works without authentication)",
        endpoint: "/api/scans/{id}/report",
        method: "GET",
        authentication_required: false,
        response_format: "html",
      },
    },
    authentication_methods: [
      {
        type: "api_key",
        description: "Bearer token for API-based access (Scale tier)",
        header: "Authorization: Bearer sk_live_...",
        required_tier: "Scale",
      },
      {
        type: "session",
        description: "User session via Google OAuth or magic link",
        required_tier: "Any paid tier",
      },
      {
        type: "none",
        description: "No authentication required for free tier (3 scans/month)",
        required_tier: "Free",
      },
    ],
    pricing: [
      {
        tier: "Diagnose",
        price_usd: 0,
        scans_per_month: 3,
        features: [
          "AI visibility score",
          "Issue titles",
          "1 sample code fix",
        ],
      },
      {
        tier: "Fix",
        price_usd: 29,
        scans_per_month: 50,
        features: [
          "All fixes unlocked",
          "Full issue descriptions",
          "Dashboard history",
        ],
      },
      {
        tier: "Monitor",
        price_usd: 49,
        scans_per_month: 100,
        features: [
          "Multi-site monitoring",
          "Scheduled weekly scans",
          "Score trend chart",
        ],
      },
      {
        tier: "Alert",
        price_usd: 79,
        scans_per_month: 500,
        features: [
          "Email alerts on score drop",
          "Everything in Monitor",
        ],
      },
      {
        tier: "Scale",
        price_usd: 149,
        scans_per_month: "Unlimited",
        features: [
          "REST API access",
          "Bulk CSV upload",
          "API keys",
          "Multi-client workflow",
        ],
      },
    ],
    analysis_categories: [
      {
        name: "Crawler Access",
        description:
          "Whether AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can access your site",
        signals: [
          "GPTBot detection",
          "ClaudeBot access",
          "PerplexityBot access",
          "OAI-SearchBot detection",
          "Explicit Allow rules",
          "Sitemap.xml fetch",
        ],
      },
      {
        name: "Structured Data",
        description:
          "JSON-LD schema markup that tells AI systems who you are and what you do",
        signals: [
          "Organization schema",
          "WebSite schema",
          "BreadcrumbList detection",
        ],
      },
      {
        name: "LLMs.txt",
        description:
          "Emerging standard that explicitly guides AI agents about your site",
        signals: [
          "llms.txt presence & structure",
          "llms-full.txt companion file",
          'link rel="llms-full" meta tag',
          'link rel="agent-manifest" meta tag',
        ],
      },
      {
        name: "Content Structure",
        description:
          "HTML structure and semantic markup that makes content easily extractable",
        signals: [
          "Intro paragraph",
          "Semantic HTML elements",
        ],
      },
      {
        name: "Technical Health",
        description:
          "Page load speed, canonical tags, and other technical signals",
        signals: [
          "Canonical tags",
          "Noindex penalties",
          "HTTPS enforcement",
        ],
      },
      {
        name: "Citation Signals",
        description:
          "Author info, trust signals, and entity identification",
        signals: [
          "Contact page presence",
          "Entity signals",
          "Trust signals",
        ],
      },
      {
        name: "Content Quality",
        description:
          "Title/description quality, readability, and depth",
        signals: [
          "Title tag quality",
          "Meta description length",
        ],
      },
    ],
    status_page: "https://conduitscore.com/status",
    change_log: "https://conduitscore.com/changelog",
    terms_of_service: "https://conduitscore.com/terms",
    privacy_policy: "https://conduitscore.com/privacy",
  };

  return NextResponse.json(agentCard, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export const runtime = "nodejs";
