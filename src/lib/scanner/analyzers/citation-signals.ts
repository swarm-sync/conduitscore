import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeCitationSignals(html: string, url: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  // External links: max 5 points
  const externalLinks = (html.match(/<a[^>]*href=["']https?:\/\//gi) || []).filter(
    (link) => !link.includes(new URL(url).hostname)
  );
  if (externalLinks.length >= 3) {
    score += 5;
  } else if (externalLinks.length >= 1) {
    score += 3;
    issues.push({
      id: "cs-few-links",
      category: "Citation Signals",
      severity: "info",
      title: "Few external references",
      description: "Add more external links to authoritative sources.",
    });
  } else {
    issues.push({
      id: "cs-no-links",
      category: "Citation Signals",
      severity: "warning",
      title: "No external links",
      description: "External links to authoritative sources boost credibility.",
    });
  }

  // About page: max 2 points (recalibrated)
  const hasAbout = /href=["'][^"']*about/i.test(html);
  if (hasAbout) {
    score += 2;
  } else {
    issues.push({
      id: "cs-no-about",
      category: "Citation Signals",
      severity: "info",
      title: "No about page link",
      description: "Link to an about page for authority.",
    });
  }

  // Contact page: max 2 points (now scored, with issue when missing)
  const hasContact = /href=["'][^"']*contact/i.test(html);
  if (hasContact) {
    score += 2;
  } else {
    issues.push({
      id: "cs-no-contact",
      category: "Citation Signals",
      severity: "info",
      title: "No contact page link found",
      description: "Without a contact page link, AI systems cannot establish trust and reachability signals for your organization.",
    });
    fixes.push({
      issueId: "cs-no-contact",
      title: "Add contact link in footer",
      description: "Add a visible link to your contact page in the site footer so AI systems can confirm your organisation is reachable",
      code: '<a href="/contact">Contact us</a>',
      language: "html",
    });
  }

  // Organization entity signals: max 2 points
  const hasOrgEntity =
    /\b(founded|est\.|since\s+\d{4})\b/i.test(html) ||
    /"@type"\s*:\s*"Organization"/i.test(html) ||
    /"@type"\s*:\s*'Organization'/i.test(html);
  if (hasOrgEntity) {
    score += 2;
  } else {
    issues.push({
      id: "cs-no-org-entity",
      category: "Citation Signals",
      severity: "info",
      title: "No clear organization identity signals found",
      description: "Weak organization identity signals make it harder for AI systems to accurately describe or recommend your business. Add founding info or Organization schema.",
    });
  }

  // Author attribution: max 2 points (recalibrated)
  const hasAuthor =
    /<meta[^>]*name=["']author["']/i.test(html) || /class=["'][^"']*author/i.test(html);
  if (hasAuthor) {
    score += 2;
  } else {
    issues.push({
      id: "cs-no-author",
      category: "Citation Signals",
      severity: "info",
      title: "No author attribution",
      description: "Add author information for credibility.",
    });
    fixes.push({
      issueId: "cs-no-author",
      title: "Add author meta tag",
      description: "Add an author meta tag inside <head> to establish E-E-A-T signals for AI systems",
      code: '<meta name="author" content="Author Name" />',
      language: "html",
    });
  }

  // Trust pages (/privacy, /terms, /legal): max 2 points
  const hasTrustPages = /href=["'][^"']*(?:privacy|terms|legal)/i.test(html);
  if (hasTrustPages) {
    score += 2;
  } else {
    issues.push({
      id: "cs-no-trust-pages",
      category: "Citation Signals",
      severity: "info",
      title: "No legal/trust page links found",
      description: "Missing legal/trust pages reduce your credibility signals for AI citation systems.",
    });
    fixes.push({
      issueId: "cs-no-trust-pages",
      title: "Add trust page links in footer",
      description: "Link to your Privacy Policy and Terms of Service in the site footer to establish legal credibility signals for AI systems",
      code: '<a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>',
      language: "html",
    });
  }

  return {
    name: CATEGORIES.CITATION_SIGNALS.name,
    score: Math.min(score, CATEGORIES.CITATION_SIGNALS.maxScore),
    maxScore: CATEGORIES.CITATION_SIGNALS.maxScore,
    issues,
    fixes,
  };
}
