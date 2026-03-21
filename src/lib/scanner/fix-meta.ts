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

  // Crawler Access (new)
  "ca-no-sitemap-ref":
    "Without a Sitemap directive in robots.txt, AI crawlers may not discover all pages on your site.",
  "ca-no-sitemap":
    "A missing sitemap.xml means AI crawlers cannot efficiently discover and index all your pages.",
  "ca-blocked-oai-searchbot":
    "OAI-SearchBot is blocked — OpenAI's search crawler cannot index your content for AI-powered search.",

  // Structured Data (new)
  "sd-no-org":
    "Without Organization schema, AI systems cannot identify your business entity, reducing citation trustworthiness.",
  "sd-no-website":
    "Without WebSite schema, AI agents lack machine-readable site-level context about your domain.",
  "sd-no-breadcrumb":
    "Missing BreadcrumbList schema reduces navigational context available to AI systems parsing your content.",

  // LLMs.txt (new)
  "lt-few-urls":
    "Your llms.txt lists very few URLs — AI agents may not discover the full scope of your site.",
  "lt-no-sections":
    "An unstructured llms.txt is harder for AI agents to parse and prioritize.",

  // Technical Health (new)
  "th-no-canonical":
    "Without a canonical tag, AI crawlers may index duplicate or variant URLs, diluting your visibility.",
  "th-noindex":
    "A noindex directive explicitly prevents AI crawlers from indexing this page — it will be invisible to AI search.",

  // Citation Signals (new)
  "cs-no-contact":
    "Without a contact page link, AI systems cannot establish trust and reachability signals for your organization.",
  "cs-no-org-entity":
    "Weak organization identity signals make it harder for AI systems to accurately describe or recommend your business.",
  "cs-no-trust-pages":
    "Missing legal/trust pages reduce your credibility signals for AI citation systems.",

  // Content Structure (new)
  "cs-no-intro":
    "No introductory paragraph near the top of the page reduces answer extraction quality for AI agents.",
  "cs-no-semantic":
    "Lack of semantic HTML makes it harder for AI crawlers to understand your page structure.",

  // Content Quality (new)
  "cq-no-title":
    "A missing title tag means AI systems have no primary label to use when citing your page.",
  "cq-short-desc":
    "A short meta description gives AI systems an insufficient summary to use in citations.",
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

  // Crawler Access (new)
  "ca-no-sitemap-ref":     2,
  "ca-no-sitemap":         3,
  "ca-blocked-oai-searchbot": 5,

  // Structured Data (new)
  "sd-no-org":             4,
  "sd-no-website":         3,
  "sd-no-breadcrumb":      2,

  // LLMs.txt (new)
  "lt-few-urls":           2,
  "lt-no-sections":        1,

  // Technical Health (new)
  "th-no-canonical":       3,
  "th-noindex":            8,

  // Citation Signals (new)
  "cs-no-contact":         2,
  "cs-no-org-entity":      2,
  "cs-no-trust-pages":     2,

  // Content Structure (new)
  "cs-no-intro":           1,
  "cs-no-semantic":        1,

  // Content Quality (new)
  "cq-no-title":           4,
  "cq-short-desc":         2,
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
  "cs-no-faq":             30,

  // LLMs.txt
  "lt-missing":            5,
  "lt-error":              0,

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

  // Crawler Access (new)
  "ca-no-sitemap-ref":     2,
  "ca-no-sitemap":         10,
  "ca-blocked-oai-searchbot": 2,

  // Structured Data (new)
  "sd-no-org":             15,
  "sd-no-website":         10,
  "sd-no-breadcrumb":      10,

  // LLMs.txt (new)
  "lt-few-urls":           10,
  "lt-no-sections":        5,

  // Technical Health (new)
  "th-no-canonical":       2,
  "th-noindex":            5,

  // Citation Signals (new)
  "cs-no-contact":         60,
  "cs-no-org-entity":      30,
  "cs-no-trust-pages":     60,

  // Content Structure (new)
  "cs-no-intro":           15,
  "cs-no-semantic":        30,

  // Content Quality (new)
  "cq-no-title":           2,
  "cq-short-desc":         5,
};

/** Default score impact when issueId is not in the map. */
export const DEFAULT_SCORE_IMPACT = 3;

/** Default effort in minutes when issueId is not in the map. */
export const DEFAULT_EFFORT_MINUTES = 10;
