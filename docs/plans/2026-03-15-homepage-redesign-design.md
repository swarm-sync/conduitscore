# ConduitScore Homepage Redesign — Implementation Spec
**Date:** 2026-03-15
**Status:** Final — ready for developer handoff

---

## SECTION 1: STRATEGIC BRIEF

### Primary Conversion Goal
Visitor submits a URL and initiates a scan. Every element on the page either
increases the probability of that action or is removed.

### Single Message the Page Must Communicate
"In 30 seconds you will know your exact AI visibility score — a real number
your competitors haven't seen yet."

### What a Visitor Should Think / Feel / Do in the First 5 Seconds

| Moment | Target state |
|--------|-------------|
| Think | "This is a measurement tool, like Lighthouse — it gives me an actual number." |
| Feel | Curiosity tipping into mild anxiety ("what IS my score?") |
| Do | Type their URL into the input field |

**Emotional sequence the page is engineered for (in order):**
1. Curiosity — they see a real score on a real site before scanning anything
2. Urgency — they recognize the gap between that site's score and their unknown score
3. Action — they submit their URL to find out

### What the Page Is NOT Trying to Do
- Explain what AI visibility is (that lives in the scan result)
- Prove authority via credentials or team bios
- Compare ConduitScore to any competitor by name
- Collect an email before delivering value

---

## SECTION 2: PAGE STRUCTURE

Each section below is ordered top to bottom as it appears on the page.

---

### Section A: Hero

**Purpose:** Get the URL into the scanner in under 10 seconds, with a score
preview establishing what the output looks like.

**Content:**
- Headline (8 words max — see Section 3)
- Sub-headline (20 words max — see Section 3)
- URL input field — full width, large, autofocused on page load
- CTA button inline with input (see Section 3 for label)
- One line of social proof beneath the button (see Section 3)
- Right side (desktop) or below (mobile): static score preview card showing
  a real scan result for a recognizable public site (e.g., nytimes.com or
  a well-known SaaS brand). The preview card shows:
  - The domain name scanned
  - A large circular score gauge (the number is the hero — minimum 72px font)
  - Three of the seven category bars, collapsed, not expanded
  - A single "top fix" teaser line: e.g., "Missing llms.txt — add 11 points"
  - Label: "Live example — scan your site to see yours"

**Approximate word count:** 35 words (excluding the preview card label)

**Visual treatment:**
- Dark background: #0A1628 (existing brand dark)
- Input field: white fill, high contrast, 48px height minimum, 8px border radius
- CTA button: high-contrast accent color (existing brand blue #2E5C8A or a
  brighter variant — confirm with design system)
- Score circle on the preview card: animated count-up from 0 to the real number
  on page load, ONE time, no loop. This is the only animation on the entire page.
- No hero image, no background illustration, no decorative SVGs competing with
  the input
- Mobile: preview card stacks below the form, score circle animates on scroll
  into viewport

**Developer note — autofocus:**
The URL input must receive focus automatically on desktop page load
(`autoFocus` attribute). On mobile, suppress autofocus to prevent the keyboard
covering the form.

---

### Section B: Trust Bar (renamed from "Stats Bar")

**Purpose:** Establish credibility with one scan-count number and two
outcome-oriented proof points — not generic marketing claims.

**Content:**
- Three items, horizontally arranged, separated by vertical dividers:
  1. "[X] sites scanned this week" — pull from live count or a static
     number that is updated weekly; minimum 4 digits to read as significant
  2. "Average score: 41/100 — most sites have room to improve" — this is
     specific, honest, and creates urgency by normalizing low scores
  3. "Results in under 30 seconds — no signup required"
- No icons required. Plain text is sufficient and faster to load.

**Approximate word count:** 22 words

**Visual treatment:**
- Thin horizontal band, slightly lighter than hero background (#0F1E36 or
  equivalent)
- Small, muted typography — this is a whisper, not a shout
- Does not compete with the hero CTA visually

**What to remove from the current stats bar:**
All four existing generic numbers unless they can be tied to a specific,
honest, outcome-oriented claim. "Trusted by 10,000 users" without context
is weaker than "Average score: 41/100."

---

### Section C: Proof-by-Example (new section)

**Purpose:** Use one named real-world scan result as the primary persuasion
mechanism — replacing hundreds of words of educational copy about why AI
visibility matters.

**Content:**
- Section header (see Section 3)
- One featured scan result displayed as a result card (not a screenshot —
  render the actual component):
  - Domain: a recognizable brand the target audience trusts
    (recommended: a well-known SaaS company, a major media site, or — best
    of all — ConduitScore's own score, which demonstrates self-referential
    credibility per the "Score Yourself" insight from the brainstorm synthesis)
  - Overall score: large, prominent
  - 7 category breakdown: shown as labeled progress bars, collapsed
  - Top 3 issues: listed with severity labels
  - Top fix: one copy-paste snippet, partially visible, with a "scan your
    site to see all fixes" overlay prompt
- Underneath the card, one sentence framing: "This is what AI crawlers
  actually see. Yours might look different."
- CTA: "See your score" — links/scrolls back to the hero input or opens
  the input inline

**Approximate word count:** 40 words (excluding the scan result data itself)

**Visual treatment:**
- Light section background to create visual contrast after the dark hero
  (#F8FAFC or white)
- The result card is the existing scan result component — no need to build
  new UI, just embed it with static data
- The code snippet teaser uses existing syntax highlighting component
- Partial overlay on the code snippet with a "blur + CTA" treatment to
  create curiosity without frustrating

**Developer note:** The featured scan can be a static JSON fixture — it does
not need to be a live API call. Update the fixture monthly. If using
ConduitScore's own score, wire it to the live API (one call, cache 24 hours).

---

### Section D: How It Works (condensed to 3 steps)

**Purpose:** Eliminate the last remaining objection — "how long does this
take and what do I get?" — in under 30 words.

**Content:**
- Section header (see Section 3)
- Three steps, icon + one-line label only (no paragraph copy under each):
  1. "Paste your URL" — icon: cursor or link
  2. "We scan 7 AI visibility signals" — icon: radar or scanner
  3. "Get your score + copy-paste fixes" — icon: checkmark or document
- One supporting line beneath: "No signup. No credit card. Results in 30 seconds."

**Approximate word count:** 30 words

**Visual treatment:**
- Three-column card layout on desktop, vertical stack on mobile
- Minimal icons — single-color line icons, 24–32px
- Light background continuing from Section C
- No expanding text, no modals, no "learn more" links from this section

**What to cut from the current "How It Works" section:**
All paragraph copy under each step. The steps are self-explanatory. Every
word beyond the step label is a distraction from the CTA.

---

### Section E: Who Uses This (replaces "Use Cases" cards)

**Purpose:** Give each of the four target customer types one sentence that
names their specific pain, so each audience self-identifies without the page
having to speak generically to everyone.

**Content:**
- Section header (see Section 3)
- Four compact tiles in a 2x2 grid (desktop) or vertical stack (mobile):
  1. **SEO professionals and agencies**
     "Show clients the signal gap competitors are already exploiting."
  2. **SaaS marketing and growth teams**
     "Find out why ChatGPT recommends your competitor — not you."
  3. **E-commerce brands**
     "Get into AI product recommendations before your category is locked."
  4. **General website owners**
     "If ChatGPT can't find you, a growing share of your audience can't either."
- Each tile: label (bold) + one sentence. No images. No icons required.

**Approximate word count:** 60 words

**Visual treatment:**
- Light card tiles with a 1px border, 12px border radius
- Label in brand blue, sentence in dark body text
- No CTA inside the tiles — the section drives toward the section-level CTA
- Section-level CTA beneath the grid: "Find out which of these applies to
  you — scan your site"

---

### Section F: 7 Category Signal Breakdown (condensed)

**Purpose:** Satisfy the "what does it check?" objection for SEO professionals
without making general visitors read a technical specification.

**Content:**
- Section header (see Section 3)
- 7 category pills/chips in a single horizontal row (desktop) or wrapping
  grid (mobile), each labeled:
  1. Crawler Access
  2. Structured Data
  3. Content Structure
  4. LLMs.txt
  5. Technical Health
  6. Citation Signals
  7. Content Quality
- Each chip is clickable/expandable to show a one-sentence description and
  one example issue
- No descriptions visible by default — collapse all, show on click/tap
- One sentence beneath the row: "Each category returns a score, a list of
  issues, and a copy-paste fix."

**Approximate word count:** 20 words visible by default; 90 words total with
all chips expanded (no visitor will expand all)

**Visual treatment:**
- Dark section background (return to #0A1628) for visual rhythm
- Pills use brand accent color with white text
- Expansion is inline, not a modal — animates open below the pill
- This section is visually compact — it should feel like a spec sheet, not
  a feature list

**What to cut from the current "7 feature category cards" section:**
The current detailed card layout. Replace the full-paragraph descriptions
with the one-sentence-on-expand model. The result page is where detail lives.

---

### Section G: FAQ (condensed to 5 questions)

**Purpose:** Remove the final conversion blockers for the undecided visitor.

**Content:**
Five questions only. Remove all others. The five questions are selected
because they address objections that prevent a scan, not questions that
are interesting after a scan:

1. "Is this free?"
   "Yes. Scan any URL for free, no account required. Paid plans unlock
   history, monitoring, and team access."

2. "What does the score measure exactly?"
   "Seven signals that AI crawlers use to decide whether to read, trust,
   and cite your content — crawler access, structured data, content
   structure, LLMs.txt, technical health, citation signals, and content
   quality."

3. "Will this slow down my site?"
   "No. The scan reads your site's public HTML the same way a search engine
   crawler does. Nothing is modified."

4. "How is this different from a regular SEO audit?"
   "Traditional SEO tools optimize for search engine ranking algorithms.
   ConduitScore measures what AI systems — ChatGPT, Perplexity, Claude,
   Gemini — actually look for when deciding whether to reference your site."

5. "How do I fix a low score?"
   "Each scan returns copy-paste code fixes per issue. Most fixes take under
   10 minutes. The biggest score gains come from adding structured data and
   a properly formatted llms.txt file."

**Approximate word count:** 155 words

**Visual treatment:**
- Standard accordion component — one answer visible at a time
- Light background
- No icons required
- "Still have questions?" link at the bottom pointing to a /docs or /faq
  page (not expanding the list on homepage)

**What to remove from the current FAQ:**
Questions 6, 7, and 8. Any question that is answered by reading the scan
result (e.g., "what is structured data?") belongs on the blog or docs, not
the FAQ. The homepage FAQ exists only to remove objections to scanning.

---

### Section H: Second CTA

**Purpose:** Convert visitors who scrolled the full page but haven't scanned yet.

**Content:**
- Headline variant (shorter, more direct — see Section 3 for options)
- URL input field (identical to hero)
- CTA button (identical to hero)
- One new social proof element not used in the hero — either:
  Option A: A one-line quote from an SEO professional (name, company, no
  headshot required)
  Option B: "Scan #[live number] is running right now" — live or
  pseudo-live counter

**Approximate word count:** 15 words excluding social proof

**Visual treatment:**
- Dark background (return to #0A1628) for section contrast
- Centered layout, max-width 600px
- Input + button identical to hero for consistency
- No new navigation, no new sections introduced here

**What to remove from the current page:**
The author bio section. Homepage author bios belong on blog posts, not
conversion pages. Remove entirely.

---

## SECTION 3: COPY

### Headline (max 8 words — final recommendation)
"See your AI visibility score in 30 seconds."

**Rationale:** Names the output (score), specifies the timeline (30 seconds),
implies the verb (see = scan). Zero jargon. Works for SEO professionals and
general website owners simultaneously.

**Backup option A:** "Find out if ChatGPT can see your site."
**Backup option B:** "Your AI search score. Real number. Right now."

### Sub-headline (max 20 words)
"Paste your URL. Get a 0-100 score and copy-paste fixes for 7 AI visibility
signals."

**Rationale:** Names the three things a visitor gets (score, fixes, 7 signals).
Confirms the zero-friction entry (paste URL). Sets correct expectations.

### Scanner Label / CTA Button Text
- Input placeholder: "https://yoursite.com"
- Button label: "Scan My Site"

**Do not use:** "Get Started", "Try It Free", "Run Analysis", "Check Now"
These are generic. "Scan My Site" is specific to the action being taken.

### Social Proof Line (beneath the CTA button in the hero)
"No signup required. [X] sites scanned — average score: 41/100."

**Rationale:** Addresses the signup objection in the same line as establishing
social proof via volume AND normalizing low scores (which creates urgency).

### Section Headers (one per section)

| Section | Header |
|---------|--------|
| B — Trust Bar | (no header — this section is ambient, not a named section) |
| C — Proof-by-Example | "This is what AI crawlers actually see." |
| D — How It Works | "Three steps. Thirty seconds." |
| E — Who Uses This | "Built for the people who care about search." |
| F — 7 Signals | "Seven signals. One score." |
| G — FAQ | "Common questions." |
| H — Second CTA | "Your score is waiting." |

### Second CTA Headline
"You've read enough. See your number."

**Rationale:** Acknowledges the visitor has been on the page a while,
validates their research behavior, then pivots hard to action. The word
"number" reinforces the measurement-instrument positioning.

---

## SECTION 4: PAGES TO KEEP, REMOVE, RESTRUCTURE

The following applies to all pages across the conduitscore.com property.
The audit is based on the principle that every page either supports a scan
conversion or supports SEO for acquisition — nothing else earns a place.

| Page | Current Status | Recommendation | Reason |
|------|---------------|----------------|--------|
| / (Homepage) | Live, too long | Restructure per this spec | Primary conversion page |
| /scan/[id] (Results) | Live | Keep, no changes | This is the product — do not touch |
| /pricing | Exists or implied | Keep, review copy | Necessary for paid tier consideration |
| /blog | Exists or implied | Keep, expand | Primary organic acquisition channel; each post drives scans |
| /faq or /docs | May not exist | Create | Overflow from homepage FAQ; keeps homepage clean |
| /about | May not exist | Do not create or deprioritize | Author bio removed from homepage — not a priority page |
| /author bio section | Exists on homepage | Remove entirely | Author bios belong on blog posts, not conversion pages |
| "Crawlable intelligence" code block section | Homepage only | Remove | Too technical for most visitors; belongs in blog post or docs |
| "Why AI Visibility Matters" 600-word section | Homepage only | Remove from homepage; convert to blog post | "The complete guide to AI visibility" — link to it from FAQ answer 4 |
| Use Cases 3 cards | Homepage | Replace with Section E (Who Uses This) in this spec | Rewritten for specificity and brevity |
| Stats bar | Homepage | Restructure per Section B | Generic numbers replaced with honest, outcome-specific claims |

**Three sections removed entirely from homepage:**
1. Author bio — move to any relevant blog post bylines
2. "Crawlable intelligence" + code block — move to a dedicated blog post
   titled "What AI crawlers actually read on your site"
3. "Why AI Visibility Matters" 4 paragraphs + 3 definition cards — move to
   a blog post or /docs page; link to it from FAQ answer 4

**Net result:** Page goes from 10 sections to 8 sections, and from
approximately 1,400+ words to approximately 400 words visible above and
around the scanner.

---

## SECTION 5: CUSTOMER-SPECIFIC MESSAGING

For each customer type: the message that resonates most with their specific
pain, the page section that speaks directly to them, and the CTA language
that converts them.

---

### Customer Type 1: SEO Professionals and Agencies (Primary)

**Pain they arrive with:** Clients are asking about AI SEO and they need
data, not opinions. They need a tool that produces a number they can
put in a report.

**Message that resonates:**
"This is a measurement instrument — not a content recommendation engine.
It produces a score with a methodology you can explain to clients."

**Which page section speaks to them:**
- Section F (7 Signals breakdown) — they will expand every chip
- Section C (Proof-by-Example) — they want to see the output format and
  whether it produces reportable data
- The scan result page itself — this is where they decide whether to pay

**CTA language that works for this persona:**
- Button: "Scan My Site" (same as primary — generic enough, specific action)
- Post-scan upsell CTA: "Save and share this report"
- For agency-specific upgrade: "Scan a client's site" or "Run a bulk scan"

**Where to place agency-specific language:**
One line in Section E (Who Uses This) tile 1:
"Show clients the signal gap competitors are already exploiting."
This is the only place. Do not create a separate agency landing section on
the homepage — link to /agency or /pricing instead.

---

### Customer Type 2: SaaS Marketing and Growth Teams

**Pain they arrive with:** Organic traffic from traditional search is flat or
declining. A competitor appears in ChatGPT responses for their category.
They suspect this is a real problem but have no tool to measure it.

**Message that resonates:**
"ChatGPT is recommending your competitor when a prospect asks about your
category. Here is the specific technical reason — and the fix."

**Which page section speaks to them:**
- Hero sub-headline — "7 AI visibility signals" validates that it's
  comprehensive, not just a one-signal check
- Section E (Who Uses This) tile 2: "Find out why ChatGPT recommends your
  competitor — not you." — this is their exact fear stated back to them
- Section G (FAQ) question 4: "How is this different from a regular SEO
  audit?" — this resolves their "I already have SEMrush" objection

**CTA language that works for this persona:**
- Hero button: "Scan My Site" (same)
- Section E tile CTA: "See why competitors rank higher in AI search"
- Post-scan: "Monitor your score — upgrade to track changes weekly"

---

### Customer Type 3: E-commerce Brand Managers

**Pain they arrive with:** AI Overviews in Google, ChatGPT shopping
recommendations, and Perplexity product suggestions are showing competitor
products. They're not appearing in AI-driven discovery.

**Message that resonates:**
"Get into AI product recommendations before your category is locked by
the brands already optimizing for this."

**Which page section speaks to them:**
- Section E (Who Uses This) tile 3: "Get into AI product recommendations
  before your category is locked." — urgency framing works for this persona
- Section G (FAQ) question 5: "How do I fix a low score?" — they care about
  the fix, not the methodology
- The scan result page: the structured data and citation signals categories
  are most relevant for e-commerce

**CTA language that works for this persona:**
- Hero button: "Scan My Site" (same)
- Supplementary (post-scan page, not homepage): "Generate your product
  schema" — this is a high-value action for e-commerce specifically

**Note for developer:** No e-commerce-specific language needs to appear on
the homepage beyond the Section E tile. A dedicated landing page at
/for-ecommerce or a blog post targeting "AI visibility for e-commerce" is
the appropriate home for extended messaging.

---

### Customer Type 4: General Website Owners Worried About AI Search

**Pain they arrive with:** They've heard that AI is changing search. They
don't know if their site is affected. They lack technical vocabulary but
feel anxiety about being "left behind."

**Message that resonates:**
"If ChatGPT can't find you, a growing share of your audience can't either.
This tells you exactly where you stand."

**Which page section speaks to them:**
- Hero headline — "See your AI visibility score in 30 seconds" — immediate
  clarity on what they get
- Section D (How It Works) — the three-step, jargon-free explanation is
  written for this persona
- Section G (FAQ) question 1: "Is this free?" and question 3: "Will this
  slow down my site?" — these are non-technical objections this persona
  has before scanning

**CTA language that works for this persona:**
- Hero button: "Scan My Site" (same)
- Trust bar item 3: "No signup required" — this removes their biggest
  hesitation (commitment before value)
- Post-scan: "What does my score mean?" link to a plain-language explainer
  (blog post or /docs page)

**Note:** This persona does not need dedicated homepage real estate beyond
what's already allocated. The zero-friction, no-signup, jargon-free design
of the entire page already speaks to them. Do not add a separate "newcomer"
explanation section — that is the content that currently makes the page too
long.

---

## IMPLEMENTATION NOTES FOR DEVELOPER

### Page Word Count Target
Total visible words on the redesigned homepage (excluding scan result
component data and footer): 380–420 words. Current page is estimated at
1,400+ words. This is a 70% reduction in copy.

### Components to Build (new)
1. Score preview card with static fixture data (Section A, desktop right
   column)
2. Chip/pill row with inline expand behavior (Section F)
3. 2x2 customer tile grid (Section E)

### Components to Reuse (existing)
1. URL input + scan form (already built — reuse in Section A and Section H)
2. Score gauge (already built — use in Sections A and C with static data)
3. Category breakdown bars (already built — use in Section C with static data)
4. FAQ accordion (already built or simple to build)

### Animation Rule
One animation on the entire page: the score gauge in the hero preview card
counts up from 0 to the real number on initial page load (desktop) or on
scroll into viewport (mobile). Duration: 1.2 seconds, ease-out. Do not loop.
No other animations. No entrance animations on text, cards, or sections.

### Performance Targets
- Above-fold LCP: under 2.0 seconds (no hero image, no video, no deferred
  JS for the scanner form)
- CLS: 0 (reserve height for the score gauge animation so it does not cause
  layout shift)
- TTI: under 3.0 seconds on a 4G connection

### Mobile Layout Priority
The mobile layout renders in this order:
1. Headline
2. Sub-headline
3. URL input + CTA button
4. Social proof line
5. Score preview card (static, gauge animates on scroll into viewport)

Everything below this fold is secondary. The scan form must be fully usable
before any scroll on every mobile viewport from 375px width up.

### What to Remove from the Codebase (Homepage Route Only)
- Author bio component
- "Crawlable intelligence" section with code block
- "Why AI Visibility Matters" four-paragraph section with definition cards
- The right-side preview card in the current hero (replace with the new
  version specified in Section A of this spec — they are similar in concept
  but the new version is simpler and uses static fixture data)

---

*Spec produced by SoSpec — ConduitScore Homepage Redesign Session, 2026-03-15*
*Sources: HOMEPAGE_REDESIGN/FLIPS.md, HOMEPAGE_REDESIGN/HMW.md,*
*BRAINSTORM_SYNTHESIS.md, ConduitScore Specs.md*
