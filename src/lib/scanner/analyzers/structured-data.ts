import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeStructuredData(html: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;
  const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const matches = html.match(ldJsonRegex);

  if (!matches || matches.length === 0) {
    issues.push({ id: "sd-no-jsonld", category: "Structured Data", severity: "critical", title: "No JSON-LD found", description: "Your page has no structured data markup. AI agents rely on this for understanding." });
    fixes.push({ issueId: "sd-no-jsonld", title: "Add JSON-LD", description: "Add basic Organization schema", code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Company",\n  "url": "https://yoursite.com"\n}\n</script>`, language: "html" });
  } else {
    score += 10;
    let hasFaq = false;
    for (const match of matches) {
      if (match.includes("FAQPage")) hasFaq = true;
    }
    if (hasFaq) {
      score += 10;
    } else {
      score += 5;
      issues.push({ id: "sd-no-faq", category: "Structured Data", severity: "warning", title: "No FAQ schema", description: "Add FAQPage schema for better AI visibility." });
      fixes.push({ issueId: "sd-no-faq", title: "Add FAQ Schema", description: "Add FAQPage JSON-LD", code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "Your question",\n    "acceptedAnswer": { "@type": "Answer", "text": "Your answer" }\n  }]\n}\n</script>`, language: "html" });
    }
  }

  return { name: CATEGORIES.STRUCTURED_DATA.name, score: Math.min(score, CATEGORIES.STRUCTURED_DATA.maxScore), maxScore: CATEGORIES.STRUCTURED_DATA.maxScore, issues, fixes };
}
