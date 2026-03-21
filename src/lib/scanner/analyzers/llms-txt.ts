import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export async function analyzeLlmsTxt(
  baseUrl: string,
  llmsTxtContent?: string | null
): Promise<CategoryScore> {
  const issues: Issue[] = [];
  const fixes: Fix[] = [];
  let score = 0;

  let text: string | null = llmsTxtContent ?? null;

  // If content wasn't pre-fetched, fetch it now
  if (text === null) {
    try {
      const res = await fetch(`${baseUrl}/llms.txt`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        text = await res.text();
      }
    } catch {
      // Fall through — text remains null
    }
  }

  if (text === null) {
    // We ended up with no content (either not passed and fetch failed, or fetch returned non-ok)
    // Distinguish between a fetch error and a missing file by checking if we tried to fetch
    if (llmsTxtContent === undefined) {
      // We attempted a fetch but got null — either error or not-ok
      // Try again to check specifically for error vs 404
      try {
        const res = await fetch(`${baseUrl}/llms.txt`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) {
          issues.push({
            id: "lt-missing",
            category: "LLMs.txt",
            severity: "warning",
            title: "No /llms.txt found",
            description: "AI agents look for /llms.txt to understand your site.",
          });
          fixes.push({
            issueId: "lt-missing",
            title: "Create llms.txt",
            description: "Add an llms.txt file at your site root",
            code: `# Your Site Name\n\n> Brief description of what your site does and who it serves.\n\n## About\nhttps://yoursite.com/about\n\n## Pricing\nhttps://yoursite.com/pricing\n\n## Documentation\nhttps://yoursite.com/docs\n\n## Methodology\nhttps://yoursite.com/methodology\n\n## Sample Report\nhttps://yoursite.com/sample-report\n\n## Contact\nhttps://yoursite.com/contact\nemail@yoursite.com`,
            language: "text",
          });
        }
      } catch {
        issues.push({
          id: "lt-error",
          category: "LLMs.txt",
          severity: "info",
          title: "Could not check /llms.txt",
          description: "Request timed out or failed.",
        });
      }
    } else {
      // llmsTxtContent was explicitly passed as null — file doesn't exist
      issues.push({
        id: "lt-missing",
        category: "LLMs.txt",
        severity: "warning",
        title: "No /llms.txt found",
        description: "AI agents look for /llms.txt to understand your site.",
      });
      fixes.push({
        issueId: "lt-missing",
        title: "Create llms.txt",
        description: "Add an llms.txt file at your site root",
        code: `# Your Site Name\n\n> Brief description of what your site does and who it serves.\n\n## About\nhttps://yoursite.com/about\n\n## Pricing\nhttps://yoursite.com/pricing\n\n## Documentation\nhttps://yoursite.com/docs\n\n## Methodology\nhttps://yoursite.com/methodology\n\n## Sample Report\nhttps://yoursite.com/sample-report\n\n## Contact\nhttps://yoursite.com/contact\nemail@yoursite.com`,
        language: "text",
      });
    }
  } else {
    // llms.txt found and has content
    score += 5;

    if (text.length > 100) score += 3;

    if (text.includes("#") && text.includes("http")) score += 2;

    // Count http URLs in the content
    const urlMatches = text.match(/https?:\/\/[^\s)>]+/gi) || [];
    const urlCount = urlMatches.length;
    if (urlCount >= 3) {
      score += 1;
    } else if (urlCount >= 1) {
      issues.push({
        id: "lt-few-urls",
        category: "LLMs.txt",
        severity: "info",
        title: "llms.txt lists few URLs",
        description: `Your llms.txt only contains ${urlCount} URL${urlCount === 1 ? "" : "s"}. AI agents benefit from seeing the full scope of your site (aim for 3+).`,
      });
    } else {
      issues.push({
        id: "lt-few-urls",
        category: "LLMs.txt",
        severity: "info",
        title: "llms.txt lists few URLs",
        description: "Your llms.txt contains no URLs. AI agents may not discover the full scope of your site.",
      });
    }

    // Check for section headers (## )
    const hasSections = /^## /m.test(text);
    if (!hasSections) {
      issues.push({
        id: "lt-no-sections",
        category: "LLMs.txt",
        severity: "info",
        title: "llms.txt has no sections",
        description: "An unstructured llms.txt is harder for AI agents to parse and prioritize. Add ## section headers.",
      });
    }
  }

  return {
    name: CATEGORIES.LLMS_TXT.name,
    score: Math.min(score, CATEGORIES.LLMS_TXT.maxScore),
    maxScore: CATEGORIES.LLMS_TXT.maxScore,
    issues,
    fixes,
  };
}
