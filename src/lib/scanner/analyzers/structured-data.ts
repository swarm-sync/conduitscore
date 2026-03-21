import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeStructuredData(html: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const matches = html.match(ldJsonRegex);

  if (!matches || matches.length === 0) {
    issues.push({
      id: "sd-no-jsonld",
      category: "Structured Data",
      severity: "critical",
      title: "No JSON-LD found",
      description: "Your page has no structured data markup. AI agents rely on this for understanding.",
    });
    fixes.push({
      issueId: "sd-no-jsonld",
      title: "Add JSON-LD",
      description: "Add basic Organization schema",
      code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Company",\n  "url": "https://yoursite.com"\n}\n</script>`,
      language: "html",
    });
    // No further scoring since there's no JSON-LD at all
    return {
      name: CATEGORIES.STRUCTURED_DATA.name,
      score: 0,
      maxScore: CATEGORIES.STRUCTURED_DATA.maxScore,
      issues,
      fixes,
    };
  }

  // JSON-LD present: base +5
  score += 5;

  // Combine all JSON-LD text for checks
  const allJsonLd = matches.join(" ");

  // Organization schema: +4
  const hasOrg = allJsonLd.includes('"Organization"') || allJsonLd.includes("'Organization'");
  if (hasOrg) {
    score += 4;
  } else {
    issues.push({
      id: "sd-no-org",
      category: "Structured Data",
      severity: "warning",
      title: "No Organization schema found",
      description: "Adding an Organization schema helps AI systems identify your business entity.",
    });
    fixes.push({
      issueId: "sd-no-org",
      title: "Add Organization Schema",
      description: "Add Organization JSON-LD with key business identity fields",
      code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Company Name",\n  "url": "https://yoursite.com",\n  "logo": "https://yoursite.com/logo.png",\n  "description": "A brief description of what your organization does.",\n  "sameAs": [\n    "https://twitter.com/yourhandle",\n    "https://linkedin.com/company/yourcompany"\n  ]\n}\n</script>`,
      language: "html",
    });
  }

  // WebSite schema: +3
  const hasWebSite = allJsonLd.includes('"WebSite"') || allJsonLd.includes("'WebSite'");
  if (hasWebSite) {
    score += 3;
  } else {
    issues.push({
      id: "sd-no-website",
      category: "Structured Data",
      severity: "info",
      title: "No WebSite schema found",
      description: "A WebSite schema provides AI agents with machine-readable site-level context.",
    });
    fixes.push({
      issueId: "sd-no-website",
      title: "Add WebSite Schema",
      description: "Add WebSite JSON-LD with SearchAction for sitelinks search box",
      code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "Your Site Name",\n  "url": "https://yoursite.com",\n  "potentialAction": {\n    "@type": "SearchAction",\n    "target": {\n      "@type": "EntryPoint",\n      "urlTemplate": "https://yoursite.com/search?q={search_term_string}"\n    },\n    "query-input": "required name=search_term_string"\n  }\n}\n</script>`,
      language: "html",
    });
  }

  // BreadcrumbList schema: +2
  const hasBreadcrumb =
    allJsonLd.includes('"BreadcrumbList"') || allJsonLd.includes("'BreadcrumbList'");
  if (hasBreadcrumb) {
    score += 2;
  } else {
    issues.push({
      id: "sd-no-breadcrumb",
      category: "Structured Data",
      severity: "info",
      title: "No BreadcrumbList schema found",
      description: "BreadcrumbList schema provides navigational context to AI systems parsing your content.",
    });
    fixes.push({
      issueId: "sd-no-breadcrumb",
      title: "Add BreadcrumbList Schema",
      description: "Add BreadcrumbList JSON-LD to show page hierarchy",
      code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n    {\n      "@type": "ListItem",\n      "position": 1,\n      "name": "Home",\n      "item": "https://yoursite.com"\n    },\n    {\n      "@type": "ListItem",\n      "position": 2,\n      "name": "Current Page",\n      "item": "https://yoursite.com/current-page"\n    }\n  ]\n}\n</script>`,
      language: "html",
    });
  }

  // FAQPage schema: +6
  const hasFaq = allJsonLd.includes("FAQPage");
  if (hasFaq) {
    score += 6;
  } else {
    issues.push({
      id: "sd-no-faq",
      category: "Structured Data",
      severity: "warning",
      title: "No FAQ schema",
      description: "Add FAQPage schema for better AI visibility.",
    });
    fixes.push({
      issueId: "sd-no-faq",
      title: "Add FAQ Schema",
      description: "Add FAQPage JSON-LD",
      code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "Your question",\n    "acceptedAnswer": { "@type": "Answer", "text": "Your answer" }\n  }]\n}\n</script>`,
      language: "html",
    });
  }

  return {
    name: CATEGORIES.STRUCTURED_DATA.name,
    score: Math.min(score, CATEGORIES.STRUCTURED_DATA.maxScore),
    maxScore: CATEGORIES.STRUCTURED_DATA.maxScore,
    issues,
    fixes,
  };
}
