import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export async function analyzeCrawlerAccess(
  url: string,
  robotsTxt: string | null,
  sitemapXml?: string | null
): Promise<CategoryScore> {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = CATEGORIES.CRAWLER_ACCESS.maxScore;
  const bots = ["GPTBot", "ClaudeBot", "PerplexityBot"];

  if (!robotsTxt) {
    score -= 5;
    issues.push({
      id: "ca-no-robots",
      category: "Crawler Access",
      severity: "warning",
      title: "No robots.txt found",
      description: "Your site has no robots.txt file. AI agents may not know if they are allowed to crawl.",
    });
    fixes.push({
      issueId: "ca-no-robots",
      title: "Add robots.txt",
      description: "Create a robots.txt file allowing AI bots",
      code: "User-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nSitemap: https://yoursite.com/sitemap.xml",
      language: "text",
    });
  } else {
    // Check existing bots (GPTBot, ClaudeBot, PerplexityBot)
    for (const bot of bots) {
      const disallowPattern = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Disallow:\\s*/`, "i");
      const allowPattern = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Allow:\\s*/`, "i");
      if (disallowPattern.test(robotsTxt) && !allowPattern.test(robotsTxt)) {
        score -= 5;
        issues.push({
          id: `ca-blocked-${bot.toLowerCase()}`,
          category: "Crawler Access",
          severity: "critical",
          title: `${bot} is blocked`,
          description: `Your robots.txt blocks ${bot} from crawling your site.`,
        });
        fixes.push({
          issueId: `ca-blocked-${bot.toLowerCase()}`,
          title: `Allow ${bot}`,
          description: `Update robots.txt to allow ${bot}`,
          code: `User-agent: ${bot}\nAllow: /`,
          language: "text",
        });
      }
    }

    // Check OAI-SearchBot
    const oaiDisallow = /User-agent:\s*OAI-SearchBot[\s\S]*?Disallow:\s*\//i.test(robotsTxt);
    const oaiAllow = /User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i.test(robotsTxt);
    if (oaiDisallow && !oaiAllow) {
      score -= 5;
      issues.push({
        id: "ca-blocked-oai-searchbot",
        category: "Crawler Access",
        severity: "critical",
        title: "OAI-SearchBot is blocked",
        description: "Your robots.txt blocks OAI-SearchBot from crawling your site.",
      });
      fixes.push({
        issueId: "ca-blocked-oai-searchbot",
        title: "Allow OAI-SearchBot",
        description: "Update robots.txt to allow OAI-SearchBot",
        code: "User-agent: OAI-SearchBot\nAllow: /",
        language: "text",
      });
    }

    // Check Sitemap directive in robots.txt
    const hasSitemapDirective = /Sitemap:/i.test(robotsTxt);
    if (!hasSitemapDirective) {
      // Only fire ca-no-sitemap if sitemap.xml also doesn't exist; otherwise fire ca-no-sitemap-ref
      if (sitemapXml === null || sitemapXml === undefined) {
        // No sitemap.xml at all
        score -= 2;
        issues.push({
          id: "ca-no-sitemap",
          category: "Crawler Access",
          severity: "warning",
          title: "No sitemap.xml found",
          description: "No sitemap.xml was discovered and robots.txt has no Sitemap directive. AI crawlers cannot efficiently discover all your pages.",
        });
        fixes.push({
          issueId: "ca-no-sitemap",
          title: "Create sitemap.xml",
          description: "Add a sitemap.xml file at your site root and reference it from robots.txt",
          code: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://yoursite.com/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`,
          language: "xml",
        });
      } else {
        // sitemap.xml exists but robots.txt doesn't reference it
        score -= 2;
        issues.push({
          id: "ca-no-sitemap-ref",
          category: "Crawler Access",
          severity: "warning",
          title: "robots.txt has no Sitemap directive",
          description: "Your robots.txt does not include a Sitemap directive, so AI crawlers may not discover your sitemap.",
        });
        fixes.push({
          issueId: "ca-no-sitemap-ref",
          title: "Add Sitemap directive to robots.txt",
          description: "Add the Sitemap directive pointing to your sitemap.xml",
          code: "Sitemap: https://yoursite.com/sitemap.xml",
          language: "text",
        });
      }
    }
  }

  return {
    name: CATEGORIES.CRAWLER_ACCESS.name,
    score: Math.min(Math.max(0, score), CATEGORIES.CRAWLER_ACCESS.maxScore),
    maxScore: CATEGORIES.CRAWLER_ACCESS.maxScore,
    issues,
    fixes,
  };
}
