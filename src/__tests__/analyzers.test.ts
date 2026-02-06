import { describe, it, expect } from "vitest";
import { analyzeStructuredData } from "@/lib/scanner/analyzers/structured-data";
import { analyzeContentStructure } from "@/lib/scanner/analyzers/content-structure";
import { analyzeContentQuality } from "@/lib/scanner/analyzers/content-quality";
import { normalizeUrl, isValidUrl } from "@/lib/scanner/url-normalizer";

describe("URL Normalizer", () => {
  it("adds https to bare domains", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });
  it("strips trailing slash", () => {
    expect(normalizeUrl("https://example.com/")).toBe("https://example.com");
  });
  it("validates URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("not a url !!!")).toBe(false);
  });
});

describe("Structured Data Analyzer", () => {
  it("detects missing JSON-LD", () => {
    const result = analyzeStructuredData("<html><body>No schema</body></html>");
    expect(result.score).toBe(0);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0].id).toBe("sd-no-jsonld");
  });
  it("scores JSON-LD presence", () => {
    const html = '<html><head><script type="application/ld+json">{"@type":"Organization"}</script></head></html>';
    const result = analyzeStructuredData(html);
    expect(result.score).toBeGreaterThan(0);
  });
  it("scores FAQ schema higher", () => {
    const html = '<html><head><script type="application/ld+json">{"@type":"FAQPage"}</script></head></html>';
    const result = analyzeStructuredData(html);
    expect(result.score).toBe(20);
  });
});

describe("Content Structure Analyzer", () => {
  it("detects missing H1", () => {
    const result = analyzeContentStructure("<html><body><p>No headings</p></body></html>");
    expect(result.issues.some((i) => i.id === "cs-no-h1")).toBe(true);
  });
  it("scores proper heading hierarchy", () => {
    const html = "<html><body><h1>Title</h1><h2>Sub</h2><h2>Sub2</h2><h3>SubSub</h3></body></html>";
    const result = analyzeContentStructure(html);
    expect(result.score).toBeGreaterThanOrEqual(10);
  });
});

describe("Content Quality Analyzer", () => {
  it("flags thin content", () => {
    const result = analyzeContentQuality("<html><body><p>Short.</p></body></html>");
    expect(result.issues.some((i) => i.id === "cq-very-short")).toBe(true);
  });
  it("scores long content higher", () => {
    const longText = "word ".repeat(1200);
    const result = analyzeContentQuality(`<html><body><p>${longText}</p></body></html>`);
    expect(result.score).toBeGreaterThanOrEqual(4);
  });
});
