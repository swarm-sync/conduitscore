import { normalizeUrl } from "./url-normalizer";
import type { ScanResult, CategoryScore } from "./types";
import { IMPACT_MAP } from "./fix-meta";
import { analyzeCrawlerAccess } from "./analyzers/crawler-access";
import { analyzeStructuredData } from "./analyzers/structured-data";
import { analyzeContentStructure } from "./analyzers/content-structure";
import { analyzeLlmsTxt } from "./analyzers/llms-txt";
import { analyzeTechnicalHealth } from "./analyzers/technical-health";
import { analyzeCitationSignals } from "./analyzers/citation-signals";
import { analyzeContentQuality } from "./analyzers/content-quality";

/**
 * Resolves an impact string for a given issue id.
 * Falls back to a prefix lookup for dynamic ids (e.g. "ca-blocked-gptbot").
 */
function resolveImpact(issueId: string): string {
  if (IMPACT_MAP[issueId]) return IMPACT_MAP[issueId];
  // Dynamic "ca-blocked-*" ids share the same impact description.
  if (issueId.startsWith("ca-blocked-")) {
    const bot = issueId.replace("ca-blocked-", "");
    return `${bot} is blocked by your robots.txt — this AI crawler cannot index or cite any content from your site.`;
  }
  return "";
}

/**
 * Injects impact statements into every issue produced by the analyzers.
 * This must run after all analyzers complete so the full issue list is available.
 */
function attachImpacts(categories: CategoryScore[]): void {
  for (const category of categories) {
    for (const issue of category.issues) {
      if (!issue.impact) {
        issue.impact = resolveImpact(issue.id);
      }
    }
  }
}

interface FetchedPageData {
  html: string;
  robotsTxt: string | null;
  llmsTxt: string | null;
  statusCode: number;
  headers: Record<string, string>;
  loadTimeMs: number;
  finalUrl: string;
}

async function fetchPageData(url: string): Promise<FetchedPageData> {
  const start = Date.now();

  const [pageRes, robotsRes, llmsRes] = await Promise.allSettled([
    fetch(url, {
      headers: { "User-Agent": "ConduitScore/1.0 (+https://conduitscore.com/bot)" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    }),
    fetch(new URL("/robots.txt", url).href, {
      headers: { "User-Agent": "ConduitScore/1.0" },
      signal: AbortSignal.timeout(8000),
    }),
    fetch(new URL("/llms.txt", url).href, {
      headers: { "User-Agent": "ConduitScore/1.0" },
      signal: AbortSignal.timeout(8000),
    }),
  ]);

  const loadTimeMs = Date.now() - start;

  if (pageRes.status === "rejected") {
    throw new Error(`Could not reach ${url}: ${pageRes.reason}`);
  }

  const pageResponse = pageRes.value;
  const html = await pageResponse.text();

  const headers: Record<string, string> = {};
  pageResponse.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let robotsTxt: string | null = null;
  if (robotsRes.status === "fulfilled" && robotsRes.value.ok) {
    robotsTxt = await robotsRes.value.text();
  }

  let llmsTxt: string | null = null;
  if (llmsRes.status === "fulfilled" && llmsRes.value.ok) {
    llmsTxt = await llmsRes.value.text();
  }

  return {
    html,
    robotsTxt,
    llmsTxt,
    statusCode: pageResponse.status,
    headers,
    loadTimeMs,
    finalUrl: pageResponse.url || url,
  };
}

export async function runScan(rawUrl: string, scanId: string): Promise<ScanResult> {
  const url = normalizeUrl(rawUrl);

  const pageData = await fetchPageData(url);

  const [
    crawlerAccess,
    structuredData,
    contentStructure,
    llmsTxt,
    technicalHealth,
    citationSignals,
    contentQuality,
  ] = await Promise.all([
    analyzeCrawlerAccess(url, pageData.robotsTxt),
    Promise.resolve(analyzeStructuredData(pageData.html)),
    Promise.resolve(analyzeContentStructure(pageData.html)),
    analyzeLlmsTxt(url),
    Promise.resolve(analyzeTechnicalHealth(pageData.html, pageData.loadTimeMs)),
    Promise.resolve(analyzeCitationSignals(pageData.html, url)),
    Promise.resolve(analyzeContentQuality(pageData.html)),
  ]);

  const categories: CategoryScore[] = [
    crawlerAccess,
    structuredData,
    contentStructure,
    llmsTxt,
    technicalHealth,
    citationSignals,
    contentQuality,
  ];

  // Inject plain-English impact statements into every issue — visible to all tiers.
  attachImpacts(categories);

  const overallScore = categories.reduce((sum, c) => sum + c.score, 0);
  const allIssues = categories.flatMap((c) => c.issues);
  const allFixes = categories.flatMap((c) => c.fixes);

  return {
    url,
    overallScore,
    categories,
    issues: allIssues,
    fixes: allFixes,
    scannedAt: new Date().toISOString(),
    metadata: {
      scanId,
      statusCode: pageData.statusCode,
      loadTimeMs: pageData.loadTimeMs,
      finalUrl: pageData.finalUrl,
      hasRobotsTxt: pageData.robotsTxt !== null,
      hasLlmsTxt: pageData.llmsTxt !== null,
    },
    proof: null,
  };
}
