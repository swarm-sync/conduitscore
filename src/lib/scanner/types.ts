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
}

export interface Fix {
  issueId: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

export interface ScanResult {
  url: string;
  overallScore: number;
  categories: CategoryScore[];
  issues: Issue[];
  fixes: Fix[];
  scannedAt: string;
  metadata: Record<string, unknown>;
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
