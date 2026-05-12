import { describe, it, expect } from "vitest";
import { unreachableScanResult } from "@/lib/scanner/scan-orchestrator";

describe("unreachableScanResult", () => {
  it("returns score 0 with a clear issue instead of throwing", () => {
    const r = unreachableScanResult("https://example.com", "scan_test", "Could not reach https://example.com: timeout");
    expect(r.overallScore).toBe(0);
    expect(r.metadata.scanFetchFailed).toBe(true);
    expect(r.issues.some((i) => i.id === "scan-fetch-failed")).toBe(true);
    expect(r.issues[0]?.impact).toBeTruthy();
  });
});
