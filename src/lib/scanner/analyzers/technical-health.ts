import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeTechnicalHealth(html: string, loadTimeMs: number): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  // Load time: max 5 points
  if (loadTimeMs < 2000) {
    score += 5;
  } else if (loadTimeMs < 5000) {
    score += 3;
    issues.push({
      id: "th-slow",
      category: "Technical Health",
      severity: "warning",
      title: "Slow page load",
      description: `Page loaded in ${(loadTimeMs / 1000).toFixed(1)}s. Aim for under 2s.`,
    });
  } else {
    score += 1;
    issues.push({
      id: "th-very-slow",
      category: "Technical Health",
      severity: "critical",
      title: "Very slow page load",
      description: `Page loaded in ${(loadTimeMs / 1000).toFixed(1)}s.`,
    });
  }

  // Viewport: max 4 points (reduced from 5)
  const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
  if (hasViewport) {
    score += 4;
  } else {
    issues.push({
      id: "th-no-viewport",
      category: "Technical Health",
      severity: "critical",
      title: "Missing viewport meta",
      description: "Add viewport meta tag for mobile.",
    });
    fixes.push({
      issueId: "th-no-viewport",
      title: "Add viewport meta",
      description: "Add to <head>",
      code: '<meta name="viewport" content="width=device-width, initial-scale=1" />',
      language: "html",
    });
  }

  // Meta description: max 2 points (reduced from 3)
  const hasMetaDesc = /<meta[^>]*name=["']description["'][^>]*>/i.test(html);
  if (hasMetaDesc) {
    score += 2;
  } else {
    issues.push({
      id: "th-no-desc",
      category: "Technical Health",
      severity: "warning",
      title: "Missing meta description",
      description: "Add a meta description for AI agents.",
    });
    fixes.push({
      issueId: "th-no-desc",
      title: "Add meta description",
      description: "Add to <head>",
      code: '<meta name="description" content="Your page description here" />',
      language: "html",
    });
  }

  // Charset: max 2 points
  const hasCharset = /<meta[^>]*charset/i.test(html);
  if (hasCharset) {
    score += 2;
  }

  // Canonical tag: max 2 points (new)
  const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html);
  if (hasCanonical) {
    score += 2;
  } else {
    issues.push({
      id: "th-no-canonical",
      category: "Technical Health",
      severity: "warning",
      title: "No canonical tag found",
      description: "Without a canonical tag, AI crawlers may index duplicate or variant URLs, diluting your visibility.",
    });
    fixes.push({
      issueId: "th-no-canonical",
      title: "Add canonical tag",
      description: "Add a canonical link element to <head> to specify the preferred URL",
      code: '<link rel="canonical" href="https://yoursite.com/current-page" />',
      language: "html",
    });
  }

  // noindex check: -5 if present (critical)
  const hasNoindex =
    /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) ||
    /<meta[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html);
  if (hasNoindex) {
    score -= 5;
    issues.push({
      id: "th-noindex",
      category: "Technical Health",
      severity: "critical",
      title: "Page has noindex directive",
      description: "A noindex directive explicitly prevents AI crawlers from indexing this page — it will be invisible to AI search.",
    });
    fixes.push({
      issueId: "th-noindex",
      title: "Remove noindex directive",
      description: "Remove or update the robots meta tag to allow indexing",
      code: '<!-- Remove this tag or change noindex to index -->\n<meta name="robots" content="index, follow" />',
      language: "html",
    });
  }

  return {
    name: CATEGORIES.TECHNICAL_HEALTH.name,
    score: Math.min(Math.max(0, score), CATEGORIES.TECHNICAL_HEALTH.maxScore),
    maxScore: CATEGORIES.TECHNICAL_HEALTH.maxScore,
    issues,
    fixes,
  };
}
