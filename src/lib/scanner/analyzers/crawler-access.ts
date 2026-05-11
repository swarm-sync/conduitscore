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
    // RFC-compliant line-by-line robots.txt parser.
    //
    // The robots-exclusion standard defines "records" separated by blank lines.
    // Within a record, User-agent lines appear first, then Disallow/Allow lines.
    // A new User-agent line following directives starts a new record.
    // We must never let a regex cross blank-line boundaries.
    //
    // Data structure per bot:
    //   disallowedPaths: Set<string>  — paths hit by Disallow rules in this record
    //   allowedPaths:    Set<string>  — paths hit by Allow   rules in this record
    //
    // A bot is "blocked from root" when its merged rule set has Disallow: /
    // and no Allow: / (or Allow: ) that overrides it.

    interface BotRules {
      disallowed: Set<string>;
      allowed: Set<string>;
    }

    function parseRobotsTxt(content: string): Map<string, BotRules> {
      const result = new Map<string, BotRules>();

      const getOrCreate = (agent: string): BotRules => {
        const key = agent.toLowerCase();
        if (!result.has(key)) {
          result.set(key, { disallowed: new Set(), allowed: new Set() });
        }
        return result.get(key)!;
      };

      const lines = content.split(/\r?\n/);
      let currentAgents: string[] = [];
      // Track whether the current record has already seen at least one directive.
      // Per spec, a User-agent line after a directive line begins a new record.
      let seenDirective = false;

      for (const raw of lines) {
        // Strip inline comments and trim whitespace
        const line = raw.replace(/#.*$/, "").trim();

        if (line === "") {
          // Blank line ends the current record
          currentAgents = [];
          seenDirective = false;
          continue;
        }

        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) continue; // malformed line; skip

        const field = line.slice(0, colonIdx).trim().toLowerCase();
        const value = line.slice(colonIdx + 1).trim();

        if (field === "user-agent") {
          if (seenDirective) {
            // Directive already seen in this record — new record starts
            currentAgents = [];
            seenDirective = false;
          }
          currentAgents.push(value.toLowerCase());
        } else if (field === "disallow") {
          seenDirective = true;
          for (const agent of currentAgents) {
            getOrCreate(agent).disallowed.add(value);
          }
        } else if (field === "allow") {
          seenDirective = true;
          for (const agent of currentAgents) {
            getOrCreate(agent).allowed.add(value);
          }
        }
        // Other fields (Crawl-delay, Sitemap, etc.) are intentionally ignored here
      }

      return result;
    }

    // Returns true if the given bot is blocked from the root path ("/").
    // A bot is blocked if:
    //   1. Its specific record has Disallow: / and no Allow: / (or Allow: "")
    //   2. OR the wildcard "*" record blocks root and the specific bot has no rules at all.
    function isBotBlockedFromRoot(
      rules: Map<string, BotRules>,
      botName: string
    ): boolean {
      const key = botName.toLowerCase();
      const botRules = rules.get(key);
      const wildcardRules = rules.get("*");

      const isBlockedInRecord = (r: BotRules): boolean =>
        r.disallowed.has("/") && !r.allowed.has("/") && !r.allowed.has("");

      if (botRules) {
        // Specific record exists — honour it exclusively (specific beats wildcard)
        return isBlockedInRecord(botRules);
      }

      // No specific record — fall back to wildcard
      if (wildcardRules) {
        return isBlockedInRecord(wildcardRules);
      }

      return false;
    }

    // Returns true if the given bot has an explicit Allow: / rule in its record
    // (or via wildcard if no specific record exists).
    function hasExplicitAllowForBot(
      rules: Map<string, BotRules>,
      botName: string
    ): boolean {
      const key = botName.toLowerCase();
      const botRules = rules.get(key);

      if (botRules) {
        return botRules.allowed.has("/") || botRules.allowed.has("");
      }

      const wildcardRules = rules.get("*");
      if (wildcardRules) {
        return wildcardRules.allowed.has("/") || wildcardRules.allowed.has("");
      }

      return false;
    }

    const parsedRules = parseRobotsTxt(robotsTxt);

    // Check existing bots (GPTBot, ClaudeBot, PerplexityBot)
    for (const bot of bots) {
      if (isBotBlockedFromRoot(parsedRules, bot)) {
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
    if (isBotBlockedFromRoot(parsedRules, "OAI-SearchBot")) {
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

    // --- Explicit Allow bonus section ---
    // Check which of the 4 named AI bots have an explicit Allow: / rule
    const explicitAllowBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"];
    const hasExplicitAllow = (bot: string): boolean =>
      hasExplicitAllowForBot(parsedRules, bot);
    const explicitAllowCount = explicitAllowBots.filter(hasExplicitAllow).length;

    if (explicitAllowCount === 4) {
      issues.push({
        id: "ca-explicit-allow-all",
        category: "Crawler Access",
        severity: "info",
        title: "All major AI crawlers explicitly allowed",
        description:
          "Your robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, and OAI-SearchBot — excellent AI crawler access.",
      });
    } else if (explicitAllowCount >= 2) {
      issues.push({
        id: "ca-explicit-allow-partial",
        category: "Crawler Access",
        severity: "info",
        title: `${explicitAllowCount} of 4 AI crawlers explicitly allowed`,
        description:
          "Your robots.txt explicitly allows some AI crawlers. Consider adding explicit Allow rules for all major AI bots.",
      });
    } else if (explicitAllowCount === 0 && score === CATEGORIES.CRAWLER_ACCESS.maxScore) {
      issues.push({
        id: "ca-no-explicit-allow",
        category: "Crawler Access",
        severity: "info",
        title: "No explicit AI crawler Allow rules",
        description:
          "Your robots.txt doesn't explicitly allow AI crawlers. Adding explicit Allow rules signals AI-friendliness and helps crawlers understand your intent.",
      });
      fixes.push({
        issueId: "ca-no-explicit-allow",
        title: "Add explicit AI crawler Allow rules",
        description: "Add explicit Allow rules for all major AI bots in robots.txt",
        code: "User-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /",
        language: "text",
      });
    }
    // --- End explicit Allow bonus section ---

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
