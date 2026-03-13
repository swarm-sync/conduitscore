import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { normalizeUrl } from "./url-normalizer";
import type { ScanResult } from "./types";

const execFileAsync = promisify(execFile);

interface WorkerCategoryScore {
  name: string;
  score: number;
  max_score: number;
  issues: Array<{
    id: string;
    category: string;
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
  }>;
  fixes: Array<{
    issue_id: string;
    title: string;
    description: string;
    code: string;
    language: string;
  }>;
}

interface WorkerScanResult {
  url: string;
  overall_score: number;
  categories: WorkerCategoryScore[];
  issues: Array<{
    id: string;
    category: string;
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
  }>;
  fixes: Array<{
    issue_id: string;
    title: string;
    description: string;
    code: string;
    language: string;
  }>;
  scanned_at: string;
  metadata: Record<string, unknown>;
  proof?: Record<string, unknown> | null;
  error?: string;
}

function mapWorkerResult(result: WorkerScanResult): ScanResult {
  return {
    url: result.url,
    overallScore: result.overall_score,
    categories: result.categories.map((category) => ({
      name: category.name,
      score: category.score,
      maxScore: category.max_score,
      issues: category.issues,
      fixes: category.fixes.map((fix) => ({
        issueId: fix.issue_id,
        title: fix.title,
        description: fix.description,
        code: fix.code,
        language: fix.language,
      })),
    })),
    issues: result.issues,
    fixes: result.fixes.map((fix) => ({
      issueId: fix.issue_id,
      title: fix.title,
      description: fix.description,
      code: fix.code,
      language: fix.language,
    })),
    scannedAt: result.scanned_at,
    metadata: result.metadata ?? {},
    proof: result.proof ?? null,
  };
}

export async function runScan(rawUrl: string, scanId: string): Promise<ScanResult> {
  const url = normalizeUrl(rawUrl);
  const workerScript = path.join(process.cwd(), "scan-worker", "scripts", "run_scan.py");
  const conduitRoot = process.env.CONDUIT_ROOT ?? "C:\\Users\\Administrator\\Desktop\\Conduit";
  const conduitDataDir = process.env.CONDUIT_DATA_DIR ?? path.join(process.cwd(), "scan-worker", ".conduit-runtime");
  const pythonBin = process.env.PYTHON_BIN ?? "python";
  const workerMode =
    process.env.SCAN_WORKER_MODE ??
    (process.env.NODE_ENV === "test" ? "mock" : "conduit");

  let stdout = "";
  let stderr = "";

  try {
    const result = await execFileAsync(
      pythonBin,
      [workerScript, "--url", url, "--scan-id", scanId],
      {
        cwd: process.cwd(),
        timeout: 120000,
        maxBuffer: 10 * 1024 * 1024,
        env: {
          ...process.env,
          WORKER_MODE: workerMode,
          CONDUIT_ROOT: conduitRoot,
          CONDUIT_DATA_DIR: conduitDataDir,
        },
      },
    );
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error) {
    const processError = error as Error & { stdout?: string; stderr?: string };
    stdout = processError.stdout ?? "";
    stderr = processError.stderr ?? processError.message;
  }

  const rawOutput = stdout.trim() || stderr.trim();
  if (!rawOutput) {
    throw new Error("Scan worker returned no output.");
  }

  const parsed = JSON.parse(rawOutput) as WorkerScanResult;
  if (parsed.error) {
    throw new Error(parsed.error);
  }

  return mapWorkerResult(parsed);
}
