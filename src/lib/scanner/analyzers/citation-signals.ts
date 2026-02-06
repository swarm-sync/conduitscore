import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeCitationSignals(html: string, url: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  const externalLinks = (html.match(/<a[^>]*href=["']https?:\/\//gi) || []).filter(
    (link) => !link.includes(new URL(url).hostname)
  );
  if (externalLinks.length >= 3) score += 5;
  else if (externalLinks.length >= 1) { score += 3; issues.push({ id: "cs-few-links", category: "Citation Signals", severity: "info", title: "Few external references", description: "Add more external links to authoritative sources." }); }
  else { issues.push({ id: "cs-no-links", category: "Citation Signals", severity: "warning", title: "No external links", description: "External links to authoritative sources boost credibility." }); }

  const hasAbout = /href=["'][^"']*about/i.test(html);
  const hasContact = /href=["'][^"']*contact/i.test(html);
  if (hasAbout) score += 3;
  else issues.push({ id: "cs-no-about", category: "Citation Signals", severity: "info", title: "No about page link", description: "Link to an about page for authority." });
  if (hasContact) score += 3;

  const hasAuthor = /<meta[^>]*name=["']author["']/i.test(html) || /class=["'][^"']*author/i.test(html);
  if (hasAuthor) score += 4;
  else issues.push({ id: "cs-no-author", category: "Citation Signals", severity: "info", title: "No author attribution", description: "Add author information for credibility." });

  return { name: CATEGORIES.CITATION_SIGNALS.name, score: Math.min(score, CATEGORIES.CITATION_SIGNALS.maxScore), maxScore: CATEGORIES.CITATION_SIGNALS.maxScore, issues, fixes };
}
