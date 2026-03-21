import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeContentQuality(html: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = textContent.split(/\s+/).length;

  // Word count: max 4 points (recalibrated)
  if (wordCount >= 1000) {
    score += 4;
  } else if (wordCount >= 300) {
    score += 2;
    issues.push({
      id: "cq-short",
      category: "Content Quality",
      severity: "info",
      title: "Content could be longer",
      description: `Only ${wordCount} words. Aim for 1000+.`,
    });
  } else {
    issues.push({
      id: "cq-very-short",
      category: "Content Quality",
      severity: "warning",
      title: "Very thin content",
      description: `Only ${wordCount} words found.`,
    });
  }

  // Date signals: max 2 points (recalibrated)
  const hasDate = /<time[^>]*>/i.test(html) || /\b(published|updated|date)\b/i.test(html);
  if (hasDate) {
    score += 2;
  } else {
    issues.push({
      id: "cq-no-date",
      category: "Content Quality",
      severity: "info",
      title: "No publish date found",
      description: "Add dates to signal content freshness.",
    });
  }

  // Paragraph count: max 2 points (recalibrated)
  const paragraphs = html.match(/<p[^>]*>/gi) || [];
  if (paragraphs.length >= 5) {
    score += 2;
  } else if (paragraphs.length >= 2) {
    score += 1;
  }

  // Title tag: max 1 point (new)
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
  if (titleText.length > 10) {
    score += 1;
  } else {
    issues.push({
      id: "cq-no-title",
      category: "Content Quality",
      severity: "warning",
      title: "No title tag found",
      description: "A missing or very short title tag means AI systems have no primary label to use when citing your page.",
    });
    fixes.push({
      issueId: "cq-no-title",
      title: "Add a descriptive title tag",
      description: "Add a <title> tag inside <head> with a meaningful page title",
      code: "<title>Your Page Title — Your Brand Name</title>",
      language: "html",
    });
  }

  // Meta description length: max 1 point (new)
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*?)["'][^>]*name=["']description["']/i);
  const metaDescText = metaDescMatch ? metaDescMatch[1].trim() : "";
  if (metaDescText.length >= 50) {
    score += 1;
  } else if (metaDescText.length > 0) {
    issues.push({
      id: "cq-short-desc",
      category: "Content Quality",
      severity: "info",
      title: "Meta description is too short for AI summaries",
      description: `Your meta description is only ${metaDescText.length} characters. Aim for 50+ characters so AI systems have a substantive summary to cite.`,
    });
  }
  // If no meta description at all, th-no-desc already covers it — no duplicate issue here

  return {
    name: CATEGORIES.CONTENT_QUALITY.name,
    score: Math.min(score, CATEGORIES.CONTENT_QUALITY.maxScore),
    maxScore: CATEGORIES.CONTENT_QUALITY.maxScore,
    issues,
    fixes,
  };
}
