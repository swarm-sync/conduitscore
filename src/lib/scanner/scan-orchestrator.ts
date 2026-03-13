import { normalizeUrl } from "./url-normalizer";
import type { ScanResult, CategoryScore } from "./types";
import { analyzeCrawlerAccess } from "./analyzers/crawler-access";
import { analyzeStructuredData } from "./analyzers/structured-data";
import { analyzeContentStructure } from "./analyzers/content-structure";
import { analyzeLlmsTxt } from "./analyzers/llms-txt";
import { analyzeTechnicalHealth } from "./analyzers/technical-health";
import { analyzeCitationSignals } from "./analyzers/citation-signals";
import { analyzeContentQuality } from "./analyzers/content-quality";

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
