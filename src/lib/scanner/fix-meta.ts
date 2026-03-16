/**
 * Static metadata maps for issues and fixes.
 *
 * IMPACT_MAP     — keyed by issue.id, returns a plain-English consequence
 *                  statement shown to ALL tiers (diagnosis, not prescription).
 *
 * SCORE_IMPACT   — keyed by fix.issueId, returns estimated score improvement
 *                  when the fix is applied.
 *
 * EFFORT_MINUTES — keyed by fix.issueId, returns estimated implementation time.
 *
 * All maps fall back to sensible defaults for keys not explicitly listed.
 */

/** Plain-English consequence statement for each issue type. */
export const IMPACT_MAP: Record<string, string> = {
  // Crawler Access
  "ca-no-robots":
    "Without a robots.txt file, AI crawlers cannot determine which pages they are allowed to index on your site.",
  "ca-blocked-gptbot":
    "GPTBot is blocked from crawling your site — ChatGPT cannot read or cite your content.",
  "ca-blocked-claudebot":
    "ClaudeBot is blocked from crawling your site — Anthropic's Claude cannot read or cite your content.",
  "ca-blocked-perplexitybot":
    "PerplexityBot is blocked from crawling your site — Perplexity AI cannot surface your content in answers.",

  // Structured Data
  "sd-no-jsonld":
    "Without structured data markup, AI agents have no machine-readable understanding of your content and are less likely to cite it.",
  "sd-no-faq":
    "Without FAQ schema, AI systems miss your Q&A content, reducing the chance your answers appear in AI-generated responses.",

  // Content Structure
  "cs-no-h1":
    "A missing H1 tag leaves AI crawlers without a primary topic signal for your page, reducing citation likelihood.",
  "cs-multi-h1":
    "Multiple H1 tags confuse AI crawlers about the primary topic of your page.",
  "cs-no-faq":
    "Without a detectable FAQ section, AI systems miss your Q&A content and are less likely to surface your answers.",

  // LLMs.txt
  "lt-missing":
    "AI crawlers cannot efficiently access or understand your site's content because /llms.txt is absent.",
  "lt-error":
    "A timeout or error when checking /llms.txt means AI crawlers may have trouble accessing your site guidance.",

  // Technical Health
  "th-slow":
    "A slow page load reduces AI crawler success rates and may result in incomplete indexing of your content.",
  "th-very-slow":
    "A very slow page load significantly reduces AI crawler success rates and degrades user experience.",
  "th-no-viewport":
    "Missing viewport meta may cause AI systems to classify your page as non-mobile-friendly, reducing visibility.",
  "th-no-desc":
    "Without a meta description, AI systems have no concise summary to use when citing your page in responses.",

  // Citation Signals
  "cs-few-links":
    "Too few external references reduce your page's credibility signals for AI ranking systems.",
  "cs-no-links":
    "No external links to authoritative sources significantly reduces your credibility signal for AI citation.",
  "cs-no-about":
    "Without a link to an About page, AI systems cannot establish authorship or organisational credibility.",
  "cs-no-author":
    "No author attribution means AI systems cannot establish E-E-A-T signals, reducing citation likelihood.",

  // Content Quality
  "cq-short":
    "Thin content reduces the depth of information available for AI agents to extract and cite.",
  "cq-very-short":
    "Very thin content gives AI systems almost nothing to work with, making citations extremely unlikely.",
  "cq-no-date":
    "Without a publish date, AI systems cannot evaluate content freshness, which can reduce citation priority.",
};

/** Estimated score improvement (points) when the fix is applied. */
export const SCORE_IMPACT: Record<string, number> = {
  // Crawler Access
  "ca-no-robots":          5,
  "ca-blocked-gptbot":     5,
  "ca-blocked-claudebot":  5,
  "ca-blocked-perplexitybot": 5,

  // Structured Data (highest leverage)
  "sd-no-jsonld":          12,
  "sd-no-faq":             8,

  // Content Structure
  "cs-no-h1":              5,
  "cs-multi-h1":           3,
  "cs-no-faq":             2,

  // LLMs.txt
  "lt-missing":            8,
  "lt-error":              2,

  // Technical Health
  "th-slow":               3,
  "th-very-slow":          5,
  "th-no-viewport":        5,
  "th-no-desc":            4,

  // Citation Signals
  "cs-few-links":          2,
  "cs-no-links":           4,
  "cs-no-about":           3,
  "cs-no-author":          4,

  // Content Quality
  "cq-short":              2,
  "cq-very-short":         4,
  "cq-no-date":            2,
};

/** Estimated implementation time in minutes per fix. */
export const EFFORT_MINUTES: Record<string, number> = {
  // Crawler Access
  "ca-no-robots":          5,
  "ca-blocked-gptbot":     2,
  "ca-blocked-claudebot":  2,
  "ca-blocked-perplexitybot": 2,

  // Structured Data
  "sd-no-jsonld":          15,
  "sd-no-faq":             20,

  // Content Structure
  "cs-no-h1":              2,
  "cs-multi-h1":           5,

  // LLMs.txt
  "lt-missing":            5,

  // Technical Health
  "th-slow":               60,
  "th-very-slow":          120,
  "th-no-viewport":        2,
  "th-no-desc":            2,

  // Citation Signals — no code fix attached, so 0
  "cs-few-links":          30,
  "cs-no-links":           30,
  "cs-no-about":           60,
  "cs-no-author":          15,

  // Content Quality — no code fix attached
  "cq-short":              120,
  "cq-very-short":         240,
  "cq-no-date":            5,
};

/** Default score impact when issueId is not in the map. */
export const DEFAULT_SCORE_IMPACT = 3;

/** Default effort in minutes when issueId is not in the map. */
export const DEFAULT_EFFORT_MINUTES = 10;
