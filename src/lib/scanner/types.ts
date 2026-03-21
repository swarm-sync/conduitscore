export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  issues: Issue[];
  fixes: Fix[];
}

export interface Issue {
  id: string;
  category: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  /** Plain-English consequence statement — present for all tiers in API responses. */
  impact?: string;
}

export interface Fix {
  issueId: string;
  title: string;
  description: string;
  code: string;
  language: string;
  /** Estimated score improvement when this fix is applied (all tiers in API responses). */
  scoreImpact?: number;
  /** Estimated implementation time in minutes (all tiers in API responses). */
  effortMinutes?: number;
  /** true when code/description have been stripped for free-tier users. */
  locked?: boolean;
  /** Character count of the original code string — present only on locked fixes. */
  charCount?: number;
  /** Present on the one sample fix shown to free-tier users. */
  sampleLabel?: string;
}

export interface ScanResult {
  id?: string;
  status?: string;
  url: string;
  overallScore: number;
  categories: CategoryScore[];
  issues: Issue[];
  fixes: Fix[];
  scannedAt: string;
  metadata: Record<string, unknown>;
  proof?: Record<string, unknown> | null;
  supplemental?: {
    aiBotPolicy?: Record<string, "allowed" | "blocked" | "unknown">;
    answerExtractionReadiness?: { score: number; signals: string[] };
    publicReportabilityGap?: { hasMethodology: boolean; hasExamples: boolean; hasAbout: boolean };
  };
}

export const CATEGORIES = {
  CRAWLER_ACCESS: { name: "Crawler Access", maxScore: 15 },
  STRUCTURED_DATA: { name: "Structured Data", maxScore: 20 },
  CONTENT_STRUCTURE: { name: "Content Structure", maxScore: 15 },
  LLMS_TXT: { name: "LLMs.txt", maxScore: 10 },
  TECHNICAL_HEALTH: { name: "Technical Health", maxScore: 15 },
  CITATION_SIGNALS: { name: "Citation Signals", maxScore: 15 },
  CONTENT_QUALITY: { name: "Content Quality", maxScore: 10 },
} as const;
