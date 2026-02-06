import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export async function analyzeLlmsTxt(baseUrl: string): Promise<CategoryScore> {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  try {
    const res = await fetch(`${baseUrl}/llms.txt`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const text = await res.text();
      score += 5;
      if (text.length > 100) score += 3;
      if (text.includes("#") && text.includes("http")) score += 2;
    } else {
      issues.push({ id: "lt-missing", category: "LLMs.txt", severity: "warning", title: "No /llms.txt found", description: "AI agents look for /llms.txt to understand your site." });
      fixes.push({ issueId: "lt-missing", title: "Create llms.txt", description: "Add an llms.txt file at your root", code: "# Your Site Name\n\n## About\nBrief description of your site.\n\n## Key Pages\n- https://yoursite.com/about\n- https://yoursite.com/docs\n\n## Contact\nemail@yoursite.com", language: "text" });
    }
  } catch {
    issues.push({ id: "lt-error", category: "LLMs.txt", severity: "info", title: "Could not check /llms.txt", description: "Request timed out or failed." });
  }

  return { name: CATEGORIES.LLMS_TXT.name, score: Math.min(score, CATEGORIES.LLMS_TXT.maxScore), maxScore: CATEGORIES.LLMS_TXT.maxScore, issues, fixes };
}
