# TASK LIST — Homepage Redesign
## Source: HOMEPAGE_REDESIGN_SYNTHESIS.md
## Goal: Scanner is the page. ~400 words. 8 sections. Delete everything that educates before it converts.

---

## 0. Quick Wins — Ship First (under 2 hours)

- [ ] **`src/components/scan/scan-form.tsx`** — Add `autoFocus` attribute to the URL `<input>` element (desktop: visitor arrives and can type immediately)
- [ ] **`src/app/page.tsx`** — Delete the entire "Why AI Visibility Matters" section (~600+ words). Remove the section component import if it becomes orphaned.

---

## 1. Navigation Simplification — `src/components/layout/header.tsx`

- [ ] Strip nav down to: **Logo | Pricing | Sign In** (or Dashboard when signed in) — remove all other nav links
- [ ] Confirm no other nav items (About, Use Cases, Blog, etc.) are linked from the header

---

## 2. Hero Section Rewrite — `src/app/page.tsx`

- [ ] Change layout to **2-column above the fold**: left 55% / right 45% (desktop), single column (mobile)
- [ ] **Left column — replace all existing hero copy with:**
  - H1: `"See your AI visibility score in 30 seconds."`
  - Sub-headline: `"Paste your URL. Get a 0-100 score and copy-paste fixes for 7 AI visibility signals."`
  - URL input field (existing `scan-form.tsx`) — autofocused on desktop
  - CTA button: **"Scan My Site"** (replace any existing "Get Started" / "Run Analysis" / "Try It Free" label)
  - Social proof micro-line below input: `"No signup required. [X] sites scanned — average score: 41/100."` (pull live scan count from DB or use static placeholder until dynamic count is wired)
  - AI chip row below social proof: **ChatGPT | Claude | Gemini | Perplexity | Copilot** (pill badges, existing design system)
- [ ] **Right column — build static Example Score Card component** `src/components/home/example-score-card.tsx`:
  - Domain label: `"example.com"`
  - Large score circle: shows `74` with count-up animation (0 → 74, 1.2s ease-out, plays once on load, NO loop)
  - 7 category bars with static scores matching wireframe: Crawler Access 82 | Structured Data 61 | LLMs.txt 40 | Content Structure 90 | Technical Health 78 | Citation Signals 55 | Content Quality 71
  - "3 issues found" line below bars
  - One blurred fix teaser: pill/code block with `filter: blur(4px)` overlay + text: `"Scan your site to see all fixes"`
  - Caption below card: `"Live example — scan yours"`
- [ ] Remove all hero copy that is NOT the above (delete any paragraphs, secondary sub-headlines, feature bullets in the hero)
- [ ] Remove existing right-column content (animated background, abstract visuals, etc.) — replace with Example Score Card

---

## 3. Trust Band — Replace Existing Stats Bar

- [ ] **`src/app/page.tsx`** — Remove current stats bar (7 / 30s / Proof / Live)
- [ ] Build inline **Trust Band** (3 items, horizontal, no section header):
  1. `"[X] sites scanned this week"`
  2. `"Average score: 41/100 — most sites have significant room to improve"`
  3. `"Results in under 30 seconds. No signup required."`
- [ ] Wire item 1 to a real count if feasible (`/api/stats` endpoint returning weekly scan count), else static `"4,000+"` placeholder

---

## 4. Proof by Example Section — Replace "Why AI Visibility Matters"

- [ ] **`src/app/page.tsx`** — The 600-word "Why AI Visibility Matters" section is already deleted in Task 0. In its place, add a **Proof by Example** section:
  - Section header: `"This is what AI crawlers actually see."`
  - Embed the static Example Score Card (same component from hero right column, or a larger/full-width variant)
  - 7 category bars, top 3 issues, one fix snippet (partially blurred with CTA overlay)
  - Caption: `"Yours might look different. Find out in 30 seconds."`
  - CTA link: `"See your score"` — scrolls back up to hero input (smooth scroll anchor `#scan`)
- [ ] ~40 words of prose total in this section

---

## 5. How It Works — Radically Shorten

- [ ] **`src/app/page.tsx`** (or `src/components/home/home-page-cards.tsx`) — Replace existing verbose "How It Works" cards with stripped 3-step version:
  - Section header: `"Three steps. Thirty seconds."`
  - Step 1: Icon + **"Paste your URL"** — NO paragraph copy
  - Step 2: Icon + **"We scan 7 AI visibility signals"** — NO paragraph copy
  - Step 3: Icon + **"Get your score + copy-paste fixes"** — NO paragraph copy
  - Supporting line beneath steps: `"No signup. No credit card. Results in 30 seconds."`
- [ ] Delete all paragraph text currently under each step card
- [ ] ~30 words total in section

---

## 6. Who Uses This — Replace Use Cases Cards

- [ ] **`src/app/page.tsx`** — Remove existing Use Cases section (3 cards with "Learn More" links)
- [ ] Build new **"Who Uses This"** section — 4 tiles, 2×2 grid:
  - Section header: `"Built for the people who care about search."`
  - Tile 1: **SEO professionals and agencies** — `"Show clients the signal gap competitors are already exploiting."`
  - Tile 2: **SaaS marketing and growth teams** — `"Find out why ChatGPT recommends your competitor — not you."`
  - Tile 3: **E-commerce brands** — `"Get into AI product recommendations before your category is locked."`
  - Tile 4: **Website owners** — `"If ChatGPT can't find you, a growing share of your audience can't either."`
  - Section CTA below grid: `"Find out which of these applies to you — scan your site"` (anchor link to hero)
- [ ] ~60 words total in section
- [ ] Remove "Learn More" links (no internal navigation away from the conversion page)

---

## 7. Seven Signals Section — Replace Category Cards

- [ ] **`src/app/page.tsx`** — Remove existing 7 category cards (if they exist as a separate section)
- [ ] Build **expandable chips row** for 7 signals:
  - Section header: `"Seven signals. One score."`
  - 7 pill chips in a horizontal (wrapping) row: Crawler Access | Structured Data | LLMs.txt | Content Structure | Technical Health | Citation Signals | Content Quality
  - Each chip: click to expand inline — shows one sentence description + one example issue
  - Line beneath chips: `"Each category returns a score, a list of issues, and a copy-paste fix."`
- [ ] ~20 words visible by default, ~90 total with all chips expanded

---

## 8. FAQ — Reduce to 5 Questions

- [ ] **`src/app/page.tsx`** — Remove FAQ questions 6, 7, 8 (and any others not in the approved list below)
- [ ] Keep ONLY these 5:
  1. `"Is this free?"` → `"Yes. 3 scans/month, no account required."`
  2. `"What does the score measure?"` → `"7 signals AI crawlers use to decide whether to cite your content."`
  3. `"Will this slow down my site?"` → `"No. Reads public HTML exactly as a search engine would."`
  4. `"How is this different from a regular SEO audit?"` → `"Traditional tools optimize for ranking algorithms. ConduitScore measures what ChatGPT, Perplexity, Claude, and Gemini actually look for."`
  5. `"How do I fix a low score?"` → `"Each scan returns copy-paste code fixes. Biggest gains: structured data and llms.txt."`
- [ ] ~155 words total in FAQ section
- [ ] Create `/docs` or `/faq` page stub — move removed FAQ questions there (Questions 6-8 currently on homepage)

---

## 9. Bottom CTA Section — Simplify

- [ ] **`src/app/page.tsx`** — Replace existing bottom CTA section with:
  - Section header: `"You've read enough. See your number."`
  - URL input field (identical to hero — same `scan-form.tsx` component, same autofocus on mobile)
  - **"Scan My Site"** button
  - One user quote OR live scan counter beneath button (single line)
- [ ] ~15 words of copy in section (not counting the quote/counter)

---

## 10. Copy — Global Find & Replace

- [ ] Replace ALL instances of **"Get Started"** button label → **"Scan My Site"** (on homepage only; pricing page CTA stays "Get Started")
- [ ] Replace ALL instances of **"Try It Free"** → **"Scan My Site"**
- [ ] Replace ALL instances of **"Run Analysis"** → **"Scan My Site"**
- [ ] Remove phrase **"The Spectral Site Audit"** from homepage (opaque to new visitors)
- [ ] Remove standalone stat label **"Proof"** from homepage
- [ ] Confirm H1 reads exactly: `"See your AI visibility score in 30 seconds."`

---

## 11. Author Bio — Delete

- [ ] **`src/app/page.tsx`** — Remove author bio section entirely
- [ ] Remove any author bio component import that becomes orphaned

---

## 12. "Crawlable Intelligence" Code Block — Delete from Homepage

- [ ] **`src/app/page.tsx`** — Remove the "Crawlable intelligence" section and its code block example
- [ ] This content is suitable for a blog post — do NOT delete the concept, just remove it from homepage

---

## 13. Pages Outside Homepage

- [ ] **`/about`** — Deprioritize: remove any prominent homepage link to it; page itself can stay
- [ ] **`/use-cases/*`** — Keep pages for SEO value; remove prominent homepage links to them
- [ ] **`/docs`** or **`/faq`** — Create stub page (can be minimal) to absorb removed FAQ questions
- [ ] **`/blog`** — Keep; confirm footer links to it as primary organic acquisition channel
- [ ] **`/pricing`** — Confirm detailed feature comparison matrix lives here (already does per current build)

---

## 14. Deploy

- [ ] Run full test suite — must be 100% passing
- [ ] Run `npm run build` — confirm zero TypeScript/ESLint errors
- [ ] Visual QA on desktop (1440px): hero 2-column layout correct, score card visible, all sections in order
- [ ] Visual QA on mobile (375px): hero stacks to single column, scan form is prominent and autofocused
- [ ] Confirm autofocus on URL input fires on desktop page load
- [ ] Confirm score card count-up animation plays once and stops
- [ ] Confirm "Scan My Site" CTA submits scan correctly
- [ ] Confirm all deleted sections are gone (no traces of 600-word Why section, author bio, old stats bar)
- [ ] Confirm FAQ shows exactly 5 questions
- [ ] Alex agent audit → `CATO_ALEX_AUDIT.md` — Status: APPROVED
- [ ] Kraken agent verification → `CATO_KRAKEN_VERDICT.md` — Status: GO
- [ ] Deploy via `python deploy_to_vercel.py`
- [ ] Verify live at `https://conduitscore.com` — full page QA on production
