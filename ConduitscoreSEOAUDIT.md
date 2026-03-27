# ConduitScore Shadow SEO Implementation Plan

Plan date: 2026-03-26
Repo target: [phase_5_output](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output)
Input audit: [conduitscore-shadow-seo-audit-2026-03-26.md](C:/Users/Administrator/Documents/Playground/conduitscore-shadow-seo-audit-2026-03-26.md)

## Goal

Turn the Shadow SEO audit into an implementation sequence that improves:

- index hygiene
- machine-citability
- entity graph clarity
- internal linking
- trust fragments
- commercial retrieval strength

without breaking the current product and conversion flow.

## Priority Order

1. Index control and metadata cleanup
2. Machine-citability blocks on core pages
3. Internal linking and entity graph reinforcement
4. Trust fragment and proof injection
5. New content cluster expansion
6. Performance and template cleanup

## Phase 1: Index Control and Metadata Cleanup

### Objective

Stop low-value pages from leaking into the index and tighten metadata around the most important commercial and editorial assets.

### Files to touch

- [src/app/sitemap.ts](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/sitemap.ts)
- [src/app/(auth)/signin/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/(auth)/signin/page.tsx)
- [src/app/layout.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/layout.tsx)
- [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx)
- [src/app/blog/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/page.tsx)
- [src/app/blog/[slug]/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/[slug]/page.tsx)
- [src/app/about/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/about/page.tsx)
- [src/app/contact/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/contact/page.tsx)
- [src/app/methodology/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/methodology/page.tsx)
- [src/app/what-conduit-checks/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/what-conduit-checks/page.tsx)
- [src/app/use-cases/saas/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/saas/page.tsx)
- [src/app/use-cases/ecommerce/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/ecommerce/page.tsx)
- [src/app/use-cases/agencies/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/agencies/page.tsx)
- [src/app/sample-reports/low-score/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/sample-reports/low-score/page.tsx)
- [src/app/sample-reports/high-score/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/sample-reports/high-score/page.tsx)
- [src/app/status/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/status/page.tsx)

### Tasks

- [ ] Remove `/signin` from [src/app/sitemap.ts](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/sitemap.ts).
- [ ] Add `robots: { index: false, follow: true }` metadata to [src/app/(auth)/signin/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/(auth)/signin/page.tsx).
- [ ] Override `/signin` canonical to itself if it remains crawlable, otherwise noindex it cleanly and stop treating it like a search page.
- [ ] Shorten the homepage description in [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx) to a tighter `120-160` character range.
- [ ] Shorten long metadata on blog index, methodology, use-case pages, and sample-report pages.
- [ ] Decide whether [src/app/status/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/status/page.tsx) should be noindexed because it has utility value but little search value.

### Acceptance criteria

- [ ] `/signin` is absent from the sitemap.
- [ ] `/signin` no longer canonicals to the homepage.
- [ ] No important public page has a title longer than about `65` characters.
- [ ] No important public page has a description materially over `160` characters unless there is a strong reason.

## Phase 2: Machine-Citability Blocks

### Objective

Make core pages easier for AI systems to extract, cite, and summarize.

### Files to touch

- [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx)
- [src/app/methodology/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/methodology/page.tsx)
- [src/app/what-conduit-checks/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/what-conduit-checks/page.tsx)
- [src/app/docs/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/docs/page.tsx)
- [src/app/blog/[slug]/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/[slug]/page.tsx)
- blog content source files or post data source used by [src/app/blog/[slug]/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/[slug]/page.tsx)
- public `llms.txt` generation/source target referenced by [src/app/layout.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/layout.tsx)

### Tasks

- [ ] Add a concise “What is AI visibility?” definition block near the top of the homepage.
- [ ] Add a “What the score means” summary block near the top of methodology.
- [ ] Add a compact “Signal / Why AI cares / What to fix” table to `what-conduit-checks`.
- [ ] Add answer-ready definition blocks to `what-is-ai-seo`, `llms-txt-guide`, `structured-data-for-ai`, and `how-to-optimize-for-chatgpt`.
- [ ] Add one “data nugget” box to each major pillar page with a source or a clearly labeled first-party benchmark.
- [ ] Upgrade `llms.txt` from a URL list to a machine guide with:
  - [ ] site purpose
  - [ ] audience
  - [ ] preferred source-of-truth pages
  - [ ] category definitions
  - [ ] key URLs with one-sentence descriptions

### Acceptance criteria

- [ ] Every pillar page gives the answer in the first screenful of text.
- [ ] Every pillar page has at least one block that could be quoted or paraphrased cleanly by an AI answer engine.
- [ ] `llms.txt` communicates hierarchy and authority, not just inventory.

## Phase 3: Internal Linking and Knowledge Graph Reinforcement

### Objective

Build an explicit entity graph so the site stops relying mostly on nav/footer links.

### Files to touch

- [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx)
- [src/app/methodology/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/methodology/page.tsx)
- [src/app/what-conduit-checks/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/what-conduit-checks/page.tsx)
- [src/app/use-cases/saas/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/saas/page.tsx)
- [src/app/use-cases/ecommerce/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/ecommerce/page.tsx)
- [src/app/use-cases/agencies/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/agencies/page.tsx)
- [src/app/blog/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/page.tsx)
- [src/app/blog/[slug]/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/[slug]/page.tsx)
- [src/app/api-access/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/api-access/page.tsx)
- [src/app/resources/ai-visibility-checklist/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/resources/ai-visibility-checklist/page.tsx)

### Tasks

- [ ] Add homepage body links to `methodology`, `what-conduit-checks`, `blog/what-is-ai-seo`, and one sample report.
- [ ] Add methodology links to the technical guides for structured data, AI crawlers, and `llms.txt`.
- [ ] Add a “Related concepts” section to `what-conduit-checks`.
- [ ] Add use-case page links to relevant technical guides and sample reports.
- [ ] Add blog post links back to use-case pages and pricing when the intent matches.
- [ ] Add an entity bridge from `api-access` to Scale workflow, agencies, and technical documentation.
- [ ] Add “next step” modules to article pages so the graph is contextual, not accidental.

### Acceptance criteria

- [ ] `use-cases/saas`, `use-cases/ecommerce`, and `use-cases/agencies` each gain multiple body-level inbound links.
- [ ] `what-conduit-checks` is no longer only a lightly linked support page.
- [ ] Each pillar page links to both a definition page and a commercial/conversion page.

## Phase 4: Trust Fragments and Information Gain

### Objective

Make pages feel observed and source-worthy instead of polished-but-generic.

### Files to touch

- blog content source used by [src/app/blog/[slug]/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/[slug]/page.tsx)
- [src/app/about/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/about/page.tsx)
- [src/app/use-cases/saas/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/saas/page.tsx)
- [src/app/use-cases/ecommerce/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/ecommerce/page.tsx)
- [src/app/use-cases/agencies/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/agencies/page.tsx)
- [src/app/methodology/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/methodology/page.tsx)
- [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx)

### Tasks

- [ ] Add visible author/byline information to blog templates.
- [ ] Add source citations to any third-party stats used on use-case and marketing pages.
- [ ] Replace unsupported numbers with first-party scan observations if sourced stats are not available.
- [ ] Add “what we see most often” benchmark fragments to homepage and methodology.
- [ ] Add one practical example or case pattern to each technical guide.
- [ ] Add one contrarian or experience-based insight to each pillar page.

### Specific unsupported claims to review first

- [ ] [src/app/use-cases/saas/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/saas/page.tsx): average SaaS score and top-performing score claims
- [ ] [src/app/use-cases/ecommerce/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/ecommerce/page.tsx): `400%+`, `73%`, and `20-30 pts` claims
- [ ] [src/app/use-cases/agencies/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/use-cases/agencies/page.tsx): `300% year-over-year` claim
- [ ] [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx): Cloudflare stat in the “5 reasons” section

### Acceptance criteria

- [ ] Every big claim either cites a source or is labeled as a first-party observation.
- [ ] Blog pages show clear authorship and expertise signals.
- [ ] Use-case pages contain at least one proof fragment each.

## Phase 5: New Content Cluster Expansion

### Objective

Expand the topical graph into adjacent entities that prove authority beyond the core product pitch.

### New pages to create

- [ ] `/blog/google-ai-overviews-optimization`
- [ ] `/blog/gemini-seo-guide`
- [ ] `/blog/bing-copilot-seo`
- [ ] `/blog/llms-txt-vs-robots-txt`
- [ ] `/blog/schema-vs-crawlability-for-ai`
- [ ] `/blog/answer-engine-optimization-for-saas`
- [ ] `/blog/ai-product-discovery-for-ecommerce`

### Existing hubs these should support

- [ ] [src/app/blog/[slug]/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/[slug]/page.tsx) content map
- [ ] [src/app/blog/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/page.tsx)
- [ ] [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx)
- [ ] [src/app/methodology/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/methodology/page.tsx)

### Acceptance criteria

- [ ] Core missing neighboring entities are represented in public content.
- [ ] The site can credibly answer “AI visibility” questions across multiple answer engines, not just ChatGPT.

## Phase 6: Performance and Template Cleanup

### Objective

Improve mobile performance and reduce noise in the semantic HTML layer.

### Files to audit

- [src/app/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx)
- [src/components/layout/header.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/components/layout/header.tsx)
- [src/components/layout/footer.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/components/layout/footer.tsx)
- [src/components/scan/scan-form.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/components/scan/scan-form.tsx)
- any shared blog/article template used by [src/app/blog/[slug]/page.tsx](C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/blog/[slug]/page.tsx)

### Tasks

- [ ] Audit homepage hero for mobile LCP contributors.
- [ ] Reduce non-essential JS and decorative wrappers on editorial templates.
- [ ] Prefer semantic containers over extra `div` nesting where practical.
- [ ] Confirm key meaning is present in raw HTML without interaction.
- [ ] Re-run Lighthouse on homepage, pricing, and one blog article after the content work lands.

### Acceptance criteria

- [ ] Homepage mobile LCP improves from about `3.8s` toward `<2.5s`.
- [ ] Editorial templates remain easily extractable in raw HTML.

## Recommended Execution Sequence

### Sprint 1

- [ ] Phase 1 complete
- [ ] homepage definition block
- [ ] methodology summary block
- [ ] `llms.txt` upgrade

### Sprint 2

- [ ] Phase 3 complete
- [ ] trust fragment fixes on use-case pages
- [ ] blog byline support

### Sprint 3

- [ ] Phase 4 complete
- [ ] first two new content cluster pages published
- [ ] performance clean-up pass

## Suggested Deliverables

- [ ] PR 1: Index hygiene + metadata cleanup
- [ ] PR 2: Homepage/methodology/what-conduit-checks citability upgrade
- [ ] PR 3: Internal linking and graph reinforcement
- [ ] PR 4: Trust fragments and proof injections
- [ ] PR 5: New content cluster pages
- [ ] PR 6: Performance/template cleanup

## Definition of Done

- [ ] No low-value auth page is present in sitemap or publicly indexed by mistake.
- [ ] Core commercial and educational pages have trimmed metadata.
- [ ] Pillar pages contain explicit definition and data blocks for AI citation.
- [ ] Key underlinked pages receive body-level internal links.
- [ ] Use-case pages and blogs include authorship, sources, or first-party proof.
- [ ] At least three adjacent entity pages are published.
- [ ] Mobile performance stays solid while content richness improves.