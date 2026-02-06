import type { ScanResult } from "./types";
import { analyzeCrawlerAccess } from "./analyzers/crawler-access";
import { analyzeStructuredData } from "./analyzers/structured-data";
import { analyzeContentStructure } from "./analyzers/content-structure";
import { analyzeLlmsTxt } from "./analyzers/llms-txt";
import { analyzeTechnicalHealth } from "./analyzers/technical-health";
import { analyzeCitationSignals } from "./analyzers/citation-signals";
import { analyzeContentQuality } from "./analyzers/content-quality";
import { normalizeUrl } from "./url-normalizer";

export async function runScan(rawUrl: string): Promise<ScanResult> {
  const url = normalizeUrl(rawUrl);
  const startTime = Date.now();

  const [pageRes, robotsRes] = await Promise.allSettled([
    fetch(url, { signal: AbortSignal.timeout(15000), headers: { "User-Agent": "AgentOptimize/1.0" } }),
    fetch(`${new URL(url).origin}/robots.txt`, { signal: AbortSignal.timeout(5000) }),
  ]);

  const html = pageRes.status === "fulfilled" ? await pageRes.value.text() : "";
  const robotsTxt = robotsRes.status === "fulfilled" && robotsRes.value.ok ? await robotsRes.value.text() : null;
  const loadTimeMs = Date.now() - startTime;

  const categories = await Promise.all([
    analyzeCrawlerAccess(url, robotsTxt),
    Promise.resolve(analyzeStructuredData(html)),
    Promise.resolve(analyzeContentStructure(html)),
    analyzeLlmsTxt(new URL(url).origin),
    Promise.resolve(analyzeTechnicalHealth(html, loadTimeMs)),
    Promise.resolve(analyzeCitationSignals(html, url)),
    Promise.resolve(analyzeContentQuality(html)),
  ]);

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
    metadata: { loadTimeMs, htmlLength: html.length },
  };
}
