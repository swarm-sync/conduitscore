# ConduitScore Product Checklist (Revised)

## Section 1 — What ConduitScore.com needs to add

- [ ] Create and publish a real `/llms.txt` at the root domain.
- [ ] Include links in `/llms.txt` to:
  - [ ] homepage
  - [ ] pricing
  - [ ] docs
  - [ ] about
  - [ ] methodology
  - [ ] sample report pages
  - [ ] strongest evergreen blog/docs pages
- [ ] Use ConduitScore itself as a model implementation of the fixes it recommends.

- [ ] Create a public `/methodology` page.
- [ ] Structure the methodology page into exactly **2 sections**:

### A. Core Score Methodology
- [ ] State that the **0–100 ConduitScore is based on 7 core categories only**.
- [ ] Keep the public score at these 7 categories:
  - [ ] Crawler Access
  - [ ] Structured Data
  - [ ] LLMs.txt
  - [ ] Content Structure
  - [ ] Technical Health
  - [ ] Citation Signals
  - [ ] Content Quality
- [ ] Explain what each of the 7 categories measures.
- [ ] Explain how each category is weighted.
- [ ] Explain what score ranges mean.
- [ ] Explain how the final score is calculated.
- [ ] Add this clarification to the methodology page:

> ConduitScore’s 0–100 score is based on 7 core categories that most directly affect AI visibility. Reports may also include additional diagnostic checks and advanced recommendations that do not currently change the core score.

### B. Additional Diagnostic Modules
- [ ] Add a second methodology section called **Additional Diagnostic Modules**.
- [ ] Explain that these checks may appear in reports but do **not** currently change the main 0–100 score unless explicitly promoted into the core model later.
- [ ] List these additional modules:
  - [ ] Sitemap presence and health
  - [ ] Canonical and indexing hygiene
  - [ ] Entity clarity
  - [ ] AI bot policy
  - [ ] Answer extraction readiness
  - [ ] Citation readiness enhancements
  - [ ] Public sample/reportability gap
  - [ ] Agent operability / VOIX-style signals

- [ ] Do **not** expand the public score from 7 categories to 10+ categories.
- [ ] Keep the score model simple and public-facing.
- [ ] Fold important new findings into the existing 7 core categories where appropriate.

- [ ] Update the meaning of the existing 7 categories internally so they can absorb additional checks without changing the public score structure.

### Update category definitions internally as follows
- [ ] Expand **Crawler Access** to include:
  - [ ] robots.txt accessibility
  - [ ] sitemap discoverability
  - [ ] crawlable HTML availability
  - [ ] blocked key resources/pages
  - [ ] major AI/search bot access constraints
- [ ] Expand **Structured Data** to include:
  - [ ] Organization schema
  - [ ] WebSite schema
  - [ ] FAQPage where relevant
  - [ ] BreadcrumbList where relevant
  - [ ] article/blog schema where relevant
- [ ] Keep **LLMs.txt** as its own category.
- [ ] Expand **Content Structure** to include:
  - [ ] heading hierarchy
  - [ ] semantic layout
  - [ ] answer-friendly formatting
  - [ ] summary clarity near the top of pages
- [ ] Expand **Technical Health** to include:
  - [ ] canonical tags
  - [ ] noindex conflicts
  - [ ] indexing hygiene
  - [ ] sitemap validity
  - [ ] render/crawl issues
- [ ] Expand **Citation Signals** to include:
  - [ ] entity clarity
  - [ ] about/contact/trust signals
  - [ ] authorship
  - [ ] source/ownership clarity
- [ ] Expand **Content Quality** to include:
  - [ ] clarity
  - [ ] extractability
  - [ ] usefulness for answer generation
  - [ ] uniqueness of summaries/explanations

- [ ] Add full `Organization` structured data on the homepage and/or About page.
- [ ] Add full `WebSite` structured data on the homepage.
- [ ] Ensure the schema includes at minimum:
  - [ ] `name`
  - [ ] `url`
  - [ ] `logo`
  - [ ] `description`
  - [ ] `sameAs`
  - [ ] `contactPoint` if available

- [ ] Audit `robots.txt` and make bot policy explicit.
- [ ] Allow `OAI-SearchBot` unless there is a deliberate reason not to.
- [ ] Decide intentionally whether to allow `GPTBot` separately.
- [ ] Ensure important public pages are not accidentally blocked.

- [ ] Create and maintain a clean `sitemap.xml`.
- [ ] Include:
  - [ ] homepage
  - [ ] pricing
  - [ ] docs
  - [ ] blog
  - [ ] about
  - [ ] contact
  - [ ] methodology
  - [ ] sample report pages
- [ ] Add the sitemap reference in `robots.txt`.
- [ ] Keep canonical URLs aligned with sitemap URLs.

- [ ] Create a public sample report page for a low-score site.
- [ ] Create a public sample report page for a mid-score site.
- [ ] Create a public sample report page for a high-score site.
- [ ] Create a public page explaining what each issue means.
- [ ] Give major issue types their own stable crawlable URLs where appropriate.

- [ ] Create a public page titled **What ConduitScore checks**.
- [ ] Break out each of the 7 core categories into its own subsection.
- [ ] Include examples and recommended fixes for each category.

- [ ] Expand entity clarity across the site with dedicated crawlable pages or sections that answer:
  - [ ] What is ConduitScore?
  - [ ] Who is it for?
  - [ ] How is it different from SEO tools?
  - [ ] How should customers interpret the score?
  - [ ] What exactly does a customer receive after a scan?

- [ ] Add author name and last-updated date to docs and blog pages.
- [ ] Add canonical tags to docs and blog pages.
- [ ] Add FAQ schema where relevant.
- [ ] Add breadcrumb markup where relevant.
- [ ] Keep important product pages HTML-first and crawlable.
- [ ] Keep logo, docs, and sample assets on public URLs not blocked by robots rules.
- [ ] Add an **About the score** link directly beneath or near the score visualization in the product UI.

---

## Section 2 — What ConduitScore should output in the website analysis

## Core scoring model rules
- [ ] Keep the public score at **7 core categories**.
- [ ] Do **not** add new public top-level score categories at this stage.
- [ ] Route new diagnostics into either:
  - [ ] the existing 7 scored categories, or
  - [ ] supplemental report modules that do not change the main score

## Core score category expansions
- [ ] Expand **Crawler Access** scoring to include:
  - [ ] robots.txt accessibility
  - [ ] blocked important pages/resources
  - [ ] sitemap discoverability
  - [ ] crawlable HTML presence
  - [ ] major AI/search bot access barriers
- [ ] Expand **Structured Data** scoring to include:
  - [ ] Organization schema
  - [ ] WebSite schema
  - [ ] BreadcrumbList where relevant
  - [ ] FAQPage where relevant
  - [ ] article/blog schema where relevant
- [ ] Keep **LLMs.txt** as a dedicated scored category.
- [ ] Expand **Content Structure** scoring to include:
  - [ ] heading quality
  - [ ] semantic structure
  - [ ] concise summaries
  - [ ] answer extraction friendliness
- [ ] Expand **Technical Health** scoring to include:
  - [ ] canonical tags
  - [ ] conflicting canonicals
  - [ ] noindex conflicts
  - [ ] sitemap validity
  - [ ] indexing hygiene
  - [ ] crawl/render issues
- [ ] Expand **Citation Signals** scoring to include:
  - [ ] entity clarity
  - [ ] about/contact/trust pages
  - [ ] ownership/authorship signals
  - [ ] source clarity
- [ ] Expand **Content Quality** scoring to include:
  - [ ] clarity
  - [ ] usefulness
  - [ ] extractability
  - [ ] uniqueness of page-level explanations

## New report outputs that should affect existing categories
- [ ] Add sitemap checks to report output.
- [ ] Score/report:
  - [ ] sitemap presence
  - [ ] sitemap validity / parseability
  - [ ] sitemap coverage of important canonical pages
  - [ ] sitemap declared in robots.txt
- [ ] Map sitemap findings into **Crawler Access** and **Technical Health**.
- [ ] Include fix guidance for each sitemap issue.

- [ ] Add canonical/indexing hygiene checks to report output.
- [ ] Detect/report:
  - [ ] missing canonical tags
  - [ ] conflicting canonicals
  - [ ] noindex on important pages
  - [ ] blocked important pages in robots.txt
  - [ ] missing meta descriptions on key pages
- [ ] Map these findings into **Technical Health**.

- [ ] Add entity clarity checks to report output.
- [ ] Detect/report:
  - [ ] organization identity clarity
  - [ ] about page presence
  - [ ] contact page presence
  - [ ] clear product/service description
  - [ ] authorship/ownership signals
  - [ ] methodology/trust pages where relevant
- [ ] Map these findings into **Citation Signals** and **Structured Data** where applicable.

- [ ] Expand Structured Data output to explicitly check/report:
  - [ ] Organization
  - [ ] WebSite
  - [ ] BreadcrumbList where relevant
  - [ ] FAQPage where relevant
  - [ ] article/blog schema where relevant

- [ ] Expand LLMs.txt output to check/report:
  - [ ] existence of `/llms.txt`
  - [ ] readability of the file
  - [ ] whether key URLs are listed
  - [ ] whether the file reflects the site’s main public resources
- [ ] Output a starter `llms.txt` snippet when missing.

- [ ] Expand Crawler Access output to check/report:
  - [ ] robots.txt accessibility
  - [ ] blocked key resources/assets
  - [ ] whether important pages return crawlable HTML
  - [ ] whether JS-heavy pages hide core content from simple crawlers

- [ ] Add content-level answer extraction findings to report output.
- [ ] Detect/report:
  - [ ] weak headings
  - [ ] missing concise summaries
  - [ ] weak semantic structure
  - [ ] thin explanatory text
- [ ] Map these findings into **Content Structure** and **Content Quality**.

- [ ] Add citation-readiness findings to report output.
- [ ] Detect/report:
  - [ ] missing author/date on knowledge pages
  - [ ] weak source attribution
  - [ ] weak trust/contact/about signals
  - [ ] weak page titles/meta descriptions
  - [ ] poor unique summaries
- [ ] Map these findings into **Citation Signals** and **Content Quality**.

## Supplemental report modules that do NOT change the core 0–100 score yet
- [ ] Add a supplemental module: **AI Bot Policy**
- [ ] Report separately on:
  - [ ] `OAI-SearchBot`
  - [ ] `GPTBot`
  - [ ] major detectable crawler directives
- [ ] Keep this visible in the report.
- [ ] Do **not** make this a separate scored category yet.

- [ ] Add a supplemental module: **Answer Extraction Readiness**
- [ ] Surface how easy it is for AI systems to extract a reliable answer from the page/site.
- [ ] Do **not** make this a separate scored category yet.
- [ ] Feed the underlying findings into Content Structure and Content Quality where applicable.

- [ ] Add a supplemental module: **Public Sample / Reportability Gap**
- [ ] Flag sites that lack public methodology pages, examples, explainers, or crawlable pages that make the business easy to summarize.
- [ ] Do **not** make this a separate scored category yet.

- [ ] Add a supplemental module: **Agent Operability / VOIX-style Signals**
- [ ] Detect whether a site exposes machine-readable assistant actions/context using VOIX-like markup or equivalent patterns.
- [ ] Label this as **Advanced** or **Interactive App Readiness**.
- [ ] Do **not** include this in the main 0–100 score.
- [ ] Do **not** present this as a core AI visibility requirement.
- [ ] Revisit later only if adoption becomes materially broader.

## Report presentation improvements
- [ ] Add a report block titled **Highest-Leverage Fixes First**
- [ ] Sort findings by expected impact on AI visibility.
- [ ] Do not just list everything found in arbitrary order.
- [ ] Keep copy-paste fix snippets for each issue.

- [ ] Add a report block titled **What this score means**
- [ ] For every report, explain:
  - [ ] what the score range means
  - [ ] what is working
  - [ ] what is hurting
  - [ ] what to fix first
  - [ ] what likely improves fastest

- [ ] Add a report block titled **Bot Access Snapshot**
- [ ] Summarize in one place:
  - [ ] robots status
  - [ ] sitemap status
  - [ ] `llms.txt` status
  - [ ] OpenAI bot policy
  - [ ] key structured-data presence

- [ ] Add a report block titled **Entity / Trust Snapshot**
- [ ] Summarize in one place:
  - [ ] organization schema
  - [ ] about page
  - [ ] contact page
  - [ ] author/date signals
  - [ ] legal/trust pages
  - [ ] clear company description

## Final product rules
- [ ] Keep the public score model simple.
- [ ] Keep the 7-category score intact.
- [ ] Grow the intelligence of each category without bloating the top-line score.
- [ ] Use supplemental modules for advanced diagnostics that are useful but not yet core to the 0–100 score.
- [ ] Update the methodology page whenever a new check either:
  - [ ] changes a core category definition, or
  - [ ] is added as a supplemental diagnostic module