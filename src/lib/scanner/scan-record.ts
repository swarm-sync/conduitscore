import type { Scan } from "@prisma/client";
import type { ScanResult } from "./types";

type StoredScanRecord = Pick<
  Scan,
  "id" | "status" | "url" | "overallScore" | "categoryScores" | "issues" | "fixes" | "metadata" | "completedAt" | "createdAt"
>;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function scanRecordToResult(scan: StoredScanRecord): ScanResult {
  return {
    id: scan.id,
    status: scan.status,
    url: scan.url,
    overallScore: scan.overallScore ?? 0,
    categories: asArray<ScanResult["categories"][number]>(scan.categoryScores),
    issues: asArray<ScanResult["issues"][number]>(scan.issues),
    fixes: asArray<ScanResult["fixes"][number]>(scan.fixes),
    metadata: asObject(scan.metadata),
    scannedAt: (scan.completedAt ?? scan.createdAt).toISOString(),
    proof: asObject(asObject(scan.metadata).proof),
  };
}
