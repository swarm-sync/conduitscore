import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeContentStructure(html: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;
  const h1Match = html.match(/<h1[^>]*>/gi);
  const h2Match = html.match(/<h2[^>]*>/gi);
  const h3Match = html.match(/<h3[^>]*>/gi);

  if (h1Match && h1Match.length === 1) {
    score += 5;
  } else if (!h1Match) {
    issues.push({ id: "cs-no-h1", category: "Content Structure", severity: "critical", title: "Missing H1 tag", description: "Your page needs exactly one H1 heading." });
    fixes.push({ issueId: "cs-no-h1", title: "Add H1 tag", description: "Add a main heading", code: "<h1>Your Main Page Title</h1>", language: "html" });
  } else {
    score += 2;
    issues.push({ id: "cs-multi-h1", category: "Content Structure", severity: "warning", title: "Multiple H1 tags", description: `Found ${h1Match.length} H1 tags. Use exactly one.` });
  }

  if (h2Match && h2Match.length >= 2) score += 5;
  else if (h2Match) score += 3;

  if (h3Match && h3Match.length >= 1) score += 3;

  const hasFaq = /<(section|div)[^>]*(?:faq|frequently|question)/i.test(html);
  if (hasFaq) {
    score += 2;
  } else {
    issues.push({ id: "cs-no-faq", category: "Content Structure", severity: "info", title: "No FAQ section detected", description: "Adding an FAQ section improves AI agent understanding." });
  }

  return { name: CATEGORIES.CONTENT_STRUCTURE.name, score: Math.min(score, CATEGORIES.CONTENT_STRUCTURE.maxScore), maxScore: CATEGORIES.CONTENT_STRUCTURE.maxScore, issues, fixes };
}
