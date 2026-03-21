import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export function analyzeContentStructure(html: string): CategoryScore {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  const h1Match = html.match(/<h1[^>]*>/gi);
  const h2Match = html.match(/<h2[^>]*>/gi);
  const h3Match = html.match(/<h3[^>]*>/gi);

  // H1: max 5 points
  if (h1Match && h1Match.length === 1) {
    score += 5;
  } else if (!h1Match) {
    issues.push({
      id: "cs-no-h1",
      category: "Content Structure",
      severity: "critical",
      title: "Missing H1 tag",
      description: "Your page needs exactly one H1 heading.",
    });
    fixes.push({
      issueId: "cs-no-h1",
      title: "Add H1 tag",
      description: "Add a main heading",
      code: "<h1>Your Main Page Title</h1>",
      language: "html",
    });
  } else {
    score += 2;
    issues.push({
      id: "cs-multi-h1",
      category: "Content Structure",
      severity: "warning",
      title: "Multiple H1 tags",
      description: `Found ${h1Match.length} H1 tags. Use exactly one.`,
    });
  }

  // H2s: max 4 points (recalibrated)
  if (h2Match && h2Match.length >= 2) {
    score += 4;
  } else if (h2Match) {
    score += 2;
  }

  // H3s: max 2 points (recalibrated)
  if (h3Match && h3Match.length >= 1) {
    score += 2;
  }

  // FAQ section: max 2 points (recalibrated)
  const hasFaq = /<(section|div)[^>]*(?:faq|frequently|question)/i.test(html);
  if (hasFaq) {
    score += 2;
  } else {
    issues.push({
      id: "cs-no-faq",
      category: "Content Structure",
      severity: "info",
      title: "No FAQ section detected",
      description: "Adding an FAQ section improves AI agent understanding.",
    });
  }

  // Intro paragraph: check for <p> tag within first 1000 chars of stripped body content
  const strippedForIntro = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  const first1000 = strippedForIntro.slice(0, 1000);
  const hasIntroParagraph = /<p[^>]*>/i.test(first1000);
  if (hasIntroParagraph) {
    score += 1;
  } else {
    issues.push({
      id: "cs-no-intro",
      category: "Content Structure",
      severity: "info",
      title: "No introductory paragraph near top of page",
      description: "An introductory paragraph near the top of the page improves answer extraction quality for AI agents.",
    });
  }

  // Semantic HTML elements: max 1 point
  const hasSemanticElements =
    /<article[^>]*>/i.test(html) ||
    /<main[^>]*>/i.test(html) ||
    /<section[^>]*>/i.test(html) ||
    /<aside[^>]*>/i.test(html);
  if (hasSemanticElements) {
    score += 1;
  } else {
    issues.push({
      id: "cs-no-semantic",
      category: "Content Structure",
      severity: "info",
      title: "No semantic HTML elements found",
      description: "Lack of semantic HTML makes it harder for AI crawlers to understand your page structure.",
    });
    fixes.push({
      issueId: "cs-no-semantic",
      title: "Add semantic HTML elements",
      description: "Wrap your content in semantic elements",
      code: `<main>\n  <article>\n    <h1>Page Title</h1>\n    <section>\n      <p>Section content here...</p>\n    </section>\n  </article>\n</main>`,
      language: "html",
    });
  }

  return {
    name: CATEGORIES.CONTENT_STRUCTURE.name,
    score: Math.min(score, CATEGORIES.CONTENT_STRUCTURE.maxScore),
    maxScore: CATEGORIES.CONTENT_STRUCTURE.maxScore,
    issues,
    fixes,
  };
}
