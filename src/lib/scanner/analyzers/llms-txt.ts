import type { CategoryScore, Issue, Fix } from "../types";
import { CATEGORIES } from "../types";

export async function analyzeLlmsTxt(
  baseUrl: string,
  llmsTxtContent?: string | null,
  html?: string | null
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

  // --- /llms-full.txt check ---
  let llmsFullFound = false;
  try {
    const fullRes = await fetch(`${baseUrl}/llms-full.txt`, { signal: AbortSignal.timeout(5000) });
    if (fullRes.ok) {
      const fullText = await fullRes.text();
      if (fullText && fullText.trim().length > 0) {
        llmsFullFound = true;
      }
    }
  } catch {
    // Fall through — llmsFullFound remains false
  }

  if (llmsFullFound) {
    score += 2;
    issues.push({
      id: "lt-full-found",
      category: "LLMs.txt",
      severity: "info",
      title: "llms-full.txt found",
      description: "Your site has a comprehensive /llms-full.txt file. AI agents can discover detailed site instructions.",
    });
  } else {
    issues.push({
      id: "lt-no-full",
      category: "LLMs.txt",
      severity: "info",
      title: "No /llms-full.txt found",
      description: "Consider adding /llms-full.txt with detailed AI agent instructions beyond the summary in llms.txt.",
    });
    fixes.push({
      issueId: "lt-no-full",
      title: "Create llms-full.txt",
      description: "Add a detailed companion file to llms.txt with full documentation",
      code: `# Your Site Name — Full AI Agent Instructions\n\n> Complete documentation for AI agents and LLM-based tools.\n\n## Overview\nProvide a comprehensive description of your site, its purpose, and the audience it serves.\n\n## Products & Services\nhttps://yoursite.com/products\n- Full list of offerings with descriptions\n\n## Documentation\nhttps://yoursite.com/docs\nhttps://yoursite.com/docs/getting-started\nhttps://yoursite.com/docs/api-reference\nhttps://yoursite.com/docs/guides\n\n## Pricing\nhttps://yoursite.com/pricing\n- Free tier: ...\n- Pro tier: ...\n\n## About\nhttps://yoursite.com/about\nhttps://yoursite.com/team\nhttps://yoursite.com/blog\n\n## Support\nhttps://yoursite.com/support\nhttps://yoursite.com/faq\nemail@yoursite.com\n\n## Legal\nhttps://yoursite.com/terms\nhttps://yoursite.com/privacy`,
      language: "text",
    });
  }

  // --- HTML meta tag detection (only if html is provided and non-null) ---
  if (html != null) {
    // Check for <link rel="llms-full"
    const hasLlmsFullMeta = /<link[^>]+rel=["']llms-full["']/i.test(html) ||
      /<link[^>]+rel=llms-full/i.test(html);

    if (hasLlmsFullMeta) {
      score += 1;
      issues.push({
        id: "lt-meta-llms-full",
        category: "LLMs.txt",
        severity: "info",
        title: '<link rel="llms-full"> tag found',
        description: 'Your HTML head includes a machine-readable link to llms-full.txt — excellent for AI agent discovery.',
      });
    } else if (text !== null) {
      // Only suggest the meta tag if llms.txt itself exists
      issues.push({
        id: "lt-no-meta-llms-full",
        category: "LLMs.txt",
        severity: "info",
        title: 'Missing <link rel="llms-full"> meta tag',
        description: 'Add <link rel="llms-full" href="/llms-full.txt"> to your HTML head for AI agent discovery.',
      });
      fixes.push({
        issueId: "lt-no-meta-llms-full",
        title: 'Add <link rel="llms-full"> to HTML head',
        description: 'Declare the llms-full.txt location in your HTML head for AI agent discovery',
        code: `<link rel="llms-full" href="/llms-full.txt">`,
        language: "html",
      });
    }

    // Check for <link rel="agent-manifest"
    const hasAgentManifestMeta = /<link[^>]+rel=["']agent-manifest["']/i.test(html) ||
      /<link[^>]+rel=agent-manifest/i.test(html);

    if (hasAgentManifestMeta) {
      score += 1;
      issues.push({
        id: "lt-meta-agent-manifest",
        category: "LLMs.txt",
        severity: "info",
        title: '<link rel="agent-manifest"> tag found',
        description: 'Your HTML head declares an agent manifest — autonomous AI agents can discover your API capabilities.',
      });
    } else {
      issues.push({
        id: "lt-no-meta-agent-manifest",
        category: "LLMs.txt",
        severity: "info",
        title: 'Missing <link rel="agent-manifest"> meta tag',
        description: 'Add <link rel="agent-manifest" href="/.well-known/agent-card.json"> to your HTML head to declare agent capabilities.',
      });
      fixes.push({
        issueId: "lt-no-meta-agent-manifest",
        title: 'Add <link rel="agent-manifest"> to HTML head',
        description: 'Declare your agent card location in HTML head so autonomous AI agents can discover your API capabilities',
        code: `<link rel="agent-manifest" href="/.well-known/agent-card.json">`,
        language: "html",
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
