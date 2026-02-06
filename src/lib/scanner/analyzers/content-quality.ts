import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeContentQuality(html: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ").trim();
  const wordCount = textContent.split(/\s+/).length;

  if (wordCount >= 1000) score += 4;
  else if (wordCount >= 300) { score += 2; issues.push({ id: "cq-short", category: "Content Quality", severity: "info", title: "Content could be longer", description: `Only ${wordCount} words. Aim for 1000+.` }); }
  else { issues.push({ id: "cq-very-short", category: "Content Quality", severity: "warning", title: "Very thin content", description: `Only ${wordCount} words found.` }); }

  const hasDate = /<time[^>]*>/i.test(html) || /\b(published|updated|date)\b/i.test(html);
  if (hasDate) score += 3;
  else issues.push({ id: "cq-no-date", category: "Content Quality", severity: "info", title: "No publish date found", description: "Add dates to signal content freshness." });

  const paragraphs = html.match(/<p[^>]*>/gi) || [];
  if (paragraphs.length >= 5) score += 3;
  else if (paragraphs.length >= 2) score += 1;

  return { name: CATEGORIES.CONTENT_QUALITY.name, score: Math.min(score, CATEGORIES.CONTENT_QUALITY.maxScore), maxScore: CATEGORIES.CONTENT_QUALITY.maxScore, issues, fixes };
}
