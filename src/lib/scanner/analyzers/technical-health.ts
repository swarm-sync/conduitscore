import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeTechnicalHealth(html: string, loadTimeMs: number): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  if (loadTimeMs < 2000) score += 5;
  else if (loadTimeMs < 5000) { score += 3; issues.push({ id: "th-slow", category: "Technical Health", severity: "warning", title: "Slow page load", description: `Page loaded in ${(loadTimeMs / 1000).toFixed(1)}s. Aim for under 2s.` }); }
  else { score += 1; issues.push({ id: "th-very-slow", category: "Technical Health", severity: "critical", title: "Very slow page load", description: `Page loaded in ${(loadTimeMs / 1000).toFixed(1)}s.` }); }

  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
  if (hasViewport) score += 5;
  else {
    issues.push({ id: "th-no-viewport", category: "Technical Health", severity: "critical", title: "Missing viewport meta", description: "Add viewport meta tag for mobile." });
    fixes.push({ issueId: "th-no-viewport", title: "Add viewport meta", description: "Add to <head>", code: '<meta name="viewport" content="width=device-width, initial-scale=1" />', language: "html" });
  }

  const hasMetaDesc = /<meta[^>]*name=["']description["'][^>]*>/i.test(html);
  if (hasMetaDesc) score += 3;
  else {
    issues.push({ id: "th-no-desc", category: "Technical Health", severity: "warning", title: "Missing meta description", description: "Add a meta description for AI agents." });
    fixes.push({ issueId: "th-no-desc", title: "Add meta description", description: "Add to <head>", code: '<meta name="description" content="Your page description here" />', language: "html" });
  }

  const hasCharset = /<meta[^>]*charset/i.test(html);
  if (hasCharset) score += 2;

  return { name: CATEGORIES.TECHNICAL_HEALTH.name, score: Math.min(score, CATEGORIES.TECHNICAL_HEALTH.maxScore), maxScore: CATEGORIES.TECHNICAL_HEALTH.maxScore, issues, fixes };
}
