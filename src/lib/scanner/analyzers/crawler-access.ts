import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export async function analyzeCrawlerAccess(url: string, robotsTxt: string | null): Promise<CategoryScore> {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = CATEGORIES.CRAWLER_ACCESS.maxScore;
  const bots = ["GPTBot", "ClaudeBot", "PerplexityBot"];

  if (!robotsTxt) {
    score -= 5;
    issues.push({ id: "ca-no-robots", category: "Crawler Access", severity: "warning", title: "No robots.txt found", description: "Your site has no robots.txt file. AI agents may not know if they are allowed to crawl." });
    fixes.push({ issueId: "ca-no-robots", title: "Add robots.txt", description: "Create a robots.txt file allowing AI bots", code: "User-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /", language: "text" });
  } else {
    for (const bot of bots) {
      const disallowPattern = new RegExp(`User-agent:\s*${bot}[\s\S]*?Disallow:\s*/`, "i");
      const allowPattern = new RegExp(`User-agent:\s*${bot}[\s\S]*?Allow:\s*/`, "i");
      if (disallowPattern.test(robotsTxt) && !allowPattern.test(robotsTxt)) {
        score -= 5;
        issues.push({ id: `ca-blocked-${bot.toLowerCase()}`, category: "Crawler Access", severity: "critical", title: `${bot} is blocked`, description: `Your robots.txt blocks ${bot} from crawling your site.` });
        fixes.push({ issueId: `ca-blocked-${bot.toLowerCase()}`, title: `Allow ${bot}`, description: `Update robots.txt to allow ${bot}`, code: `User-agent: ${bot}\nAllow: /`, language: "text" });
      }
    }
  }

  return { name: CATEGORIES.CRAWLER_ACCESS.name, score: Math.max(0, score), maxScore: CATEGORIES.CRAWLER_ACCESS.maxScore, issues, fixes };
}
