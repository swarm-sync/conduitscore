# REMIXFORGE — VERSIONS.md
# ConduitScore: 10% / 10x / Zero versions for top 3 concepts

---

## Concept A: The Impact-Gated Fix

**Core idea:** Free tier shows what each fix is WORTH (score delta, time estimate, competitive impact) but not the fix code itself. Paid tier unlocks the exact implementation code. Sells outcomes, not information.

---

### Concept A — 10% Version (minimal viable tweak)

**What changes:** One line of UI work on existing fix cards.

Implementation: On each fix card, above the blurred code block, add a single stat line:
"Unlock this fix to improve your Structured Data score by +34 points."

The score delta per fix is already calculable from the existing analyzer logic. Display it on the free tier fix card. Keep everything else identical. The code block below remains accessible as it is today.

This is a 2-hour UI change. No new logic. No new gating. The existing product stays the same — you add one persuasive number to each fix card.

**Expected lift:** Conversion rate on "Upgrade to Starter" CTA increases by estimated 15-25% because users now understand the per-fix value quantitatively rather than abstractly.

**What you learn:** Whether score-delta framing is more motivating than "you have 12 issues" framing. A/B testable in one sprint.

---

### Concept A — 10x Version (category-defining product change)

**What changes:** The entire product narrative shifts from "scanner" to "AI visibility investment calculator."

Implementation: After a scan, the report leads with a single headline number: "You are leaving an estimated 2,400 monthly AI-referred visitors on the table." This requires:

1. A calibration model: ConduitScore ingests anonymized data from paid users who have fixed issues and rescanned. It builds a regression: "sites that fixed structured data issues saw X% improvement in AI referral traffic on average." This becomes the basis for the projection.
2. An industry traffic database: using publicly available AI search volume estimates by industry category, ConduitScore maps a score improvement to estimated traffic uplift.
3. A dollar estimate layer: "At an average conversion rate of 2% and your industry's average order value of $X, this is worth approximately $4,800/month in revenue."

The paid tier shows:
- The specific fix that produces the highest ROI
- The implementation code for that fix
- A 30-day progress tracker that shows actual score improvements post-fix
- A projected traffic curve updated after each rescan

The free tier shows:
- The aggregate "opportunity" number ($4,800/month)
- That it breaks down into N specific fixes
- One example fix (the lowest-effort, highest-impact one) fully unlocked

**The positioning shift:** ConduitScore is no longer "an audit tool." It is "a revenue recovery tool." The price comparison changes from "vs. other audit tools ($0-$79)" to "vs. the revenue you are losing ($0)." A $29/month tool that recovers $4,800/month in revenue is not a $29 decision — it is a 165x ROI decision.

**What you learn:** Whether economic framing converts enterprise buyers (larger contract values, longer retention) rather than just SEO consultants.

---

### Concept A — Zero-Effort Version (user does almost nothing)

**What changes:** The product runs the scan AND automatically generates the implementation diff.

Implementation: After the scan, ConduitScore does not show code to copy. Instead:
- "Connect your site" button: integrates with Vercel, Webflow, or WordPress via OAuth.
- ConduitScore reads the relevant files (HTML, `<head>` tags, schema markup, robots.txt).
- It generates a precise diff: exactly where each piece of code should go, with surrounding context preserved.
- Paid tier: one-click "Apply All Fixes" button that pushes the changes directly to the user's Vercel/Webflow project.
- Free tier: shows the diff preview. User sees exactly what will change. Needs to apply manually or upgrade to auto-apply.

**The zero-effort framing:** The user scans their site, sees "7 fixes ready to apply," clicks one button, fixes are live. No copying, no pasting, no developer needed. The product is now closer to Dependabot (automated dependency patching) than to a scanner.

**What you learn:** Whether integration-based automation converts users who were blocked by implementation complexity rather than price.

---

---

## Concept B: The Email-Gate Reveal

**Core idea:** Scan runs immediately when URL is entered. After the 15-second scan, a single screen appears: "Your report is ready — enter your email to view it." Email is captured at maximum intent. No payment required. Full report visible after email entry.

---

### Concept B — 10% Version (minimal viable tweak)

**What changes:** One interstitial screen between scan completion and report display.

Implementation: After the scan API returns results (existing `/api/scan` endpoint), instead of rendering the report component immediately, render a "results ready" screen with:
- Animated "scan complete" indicator
- Three teaser stats pulled from the actual result (score, critical issue count, one random issue title — no description)
- Single email input field
- "View My Full Report" button

On submit: store email in DB (new `ScanLead` model: email + scan ID + timestamp). Display report immediately — no email verification, no redirect. The email is captured; the user gets their result with zero additional friction.

**What you learn:** Email capture rate at peak-intent moment vs. current "create account" CTA after full report is shown. Hypothesized lift: from ~5% to 40-60% email capture rate.

**Build cost:** 1 day of work. New DB model, one new component, one route modification.

---

### Concept B — 10x Version (full drip-conversion system)

**What changes:** The email capture is the entry point to a multi-week automated conversion machine.

Implementation:

**Day 0 (immediate):** Email captures and full report displays. Email contains: "Here is your ConduitScore report for [domain]. Your 3 critical issues are: [list]. Your fixes are ready when you are."

**Day 2:** "Have you started fixing your issues? Here is the single easiest fix we found for your site — plain English description, 15-minute implementation." (A real fix from their scan, described in prose, not code.)

**Day 4:** "Your competitor [domain] — we scanned them for you." (Auto-scan one detected competitor. Show their score next to the user's score. No opt-in required — you already have the user's domain.) If the competitor scores higher: "They are beating you by 27 points. Here is why."

**Day 7:** "Rescan your site — it has been a week. Have your fixes made a difference?" (Triggers a new free scan of the original domain, compares to Day 0 baseline. Shows a delta: improvement or no change. If no change: "You have not implemented your fixes yet. Here is the fastest way to fix #1: [Starter plan link].")

**Day 14:** "Your score is [current]. The top 10% of [industry] sites score 85+. Here is what separates them from you." (Sends a "benchmark gap analysis" — the 3 categories where they are furthest below the industry median. Links to Starter with a specific framing: "Fix these 3 categories in one session.")

**Day 30:** Time-limited offer. "30-day check-in: your site has been at [score] for a month. Starter plan is $29 — that is $0.96/day. One fix could move your score by 20 points. Here is the fix code for your highest-impact issue, free, no payment required — our gift for being patient." (Gives away one full fix code at day 30. The implied message: "You have been sitting on 11 others.")

**What you learn:** Whether a drip sequence converting email leads to paid converts at a higher rate than in-product prompts. Also: which email in the sequence has the highest click-to-paid conversion (tells you which message framing works).

---

### Concept B — Zero-Effort Version (user does almost nothing)

**What changes:** No email required. Scan runs on domain detection.

Implementation: ConduitScore adds a Chrome extension or a `<script>` embed for existing customers (agency plan). When an agency owner visits a client's website, the extension auto-runs a free scan in the background. Results are delivered as a browser notification: "conduitscore.com — Score: 41/100. 3 critical issues found. View report." The agency owner never typed a URL. They never opened a new tab. The scan happened because they visited the site.

For non-extension users: ConduitScore adds a "Scan from URL" browser bookmark (bookmarklet). One click on any website page triggers the scan of the current URL.

**The zero-effort principle:** The user's existing behavior (visiting client sites) becomes the trigger. No new habit required. The product becomes ambient.

**What you learn:** Whether ambient/passive scanning creates a new user behavior pattern that sticky-attaches the product to existing workflows (vs. requiring the user to proactively remember to use ConduitScore).

---

---

## Concept C: The Two-Mode Report (Executive vs. Technical)

**Core idea:** A toggle at the top of every report switches between Executive Mode (plain-English impact summaries, business framing, no code — free) and Technical Mode (exact code, implementation instructions, copy buttons — paid). Matches the real org chart of how websites get fixed: a buyer authorizes the work, a developer implements it.

---

### Concept C — 10% Version (minimal viable tweak)

**What changes:** One toggle, one CSS class, one copy change.

Implementation: Add a toggle at the top of the existing report: "View as: [Executive] [Technical]."

Executive mode (default for new/unauthenticated users):
- Hides the code block within each fix card (existing `fix-panel.tsx` component)
- Replaces code block with a plain-English sentence: "Add structured data markup to your homepage. A developer can implement this in approximately 20 minutes."
- Score and issue list remain identical

Technical mode (available to paid accounts):
- Shows existing code blocks as they are today
- Shows copy buttons as they are today

**The unlock mechanic:** Clicking "Technical" for non-paid users triggers: "Technical mode is available on Starter ($29/mo). You keep Executive mode free." This is gentler than a hard paywall — the user sees the gate as a mode upgrade, not a door slam.

**Build cost:** 4 hours. Toggle component, one conditional render on `fix-panel.tsx`, plan-check on toggle click.

**What you learn:** Whether framing the gate as a "mode" rather than a "paywall" reduces bounce on the upgrade prompt. Also: whether "executive mode" reports get shared with managers more than the current technical-default report.

---

### Concept C — 10x Version (product-market expansion)

**What changes:** The Two-Mode Report becomes a two-audience product, each with its own standalone feature set.

Implementation:

**Executive/Buyer Mode becomes a standalone "Board Report":**
- Generates a formatted one-page PDF: "AI Visibility Report — [Company Name] — [Date]"
- Opens with a single executive summary: "Your website is currently invisible to AI assistants used by [X million] people monthly. Based on your score of 41/100, you are in the bottom 35% of [industry] websites we have scanned."
- Contains: a traffic opportunity estimate, a cost-to-fix estimate (hours of developer time), a priority-ordered fix list with business impact per fix, and a benchmark comparison against industry top-10%
- Designed to be sent to a VP of Marketing or CTO as a business case for investment
- Free, no login required (drives referral and word-of-mouth)
- The PDF footer: "Generated by ConduitScore.com — AI Visibility for Modern Websites"

**Technical/Implementer Mode becomes a standalone "Developer Package":**
- Not a report — a zip file download
- Contains: all fix code snippets as individual files (schema.json, llms.txt, robots.txt, meta-tags.html), a README with implementation instructions per file, a `before.json` snapshot of the current site's detected code, and a `diff.patch` file showing exactly what changes
- The Developer Package is the Pro/Agency differentiator: "Give your developer everything they need in one zip — no context-switching, no copy-paste, no back-and-forth."

**The product insight:** You now have two entry points — a document that travels through companies (Board Report) and a technical artifact that gets implemented (Developer Package). The Board Report does top-of-funnel marketing. The Developer Package justifies the Pro/Agency tier to engineering teams.

**What you learn:** Whether the "document that travels" model (Board Report shared internally) creates a new B2B acquisition channel where the buyer is not the original scanner.

---

### Concept C — Zero-Effort Version (user does almost nothing)

**What changes:** The Two-Mode Report writes and sends itself to the right person.

Implementation: After scan, the product asks one question: "Who should receive the Executive Summary?" with a pre-filled email suggestion (detected from the site's meta tags, LinkedIn detection, or user's stated company). One-click send. ConduitScore emails the Board Report PDF to the person the user identifies, with a personalized cover message: "Hi [Name], [User] ran an AI visibility audit on [domain] and wanted to share the results with you. Key finding: your site scored 41/100 for AI visibility — here is what that means for your business."

The recipient receives a cold-email-quality pitch that was generated, formatted, and sent by a tool the sender used. No writing required from the sender. No design required. No PDF creation required.

**The distribution flywheel:** Every user of ConduitScore becomes a salesperson for ConduitScore at the moment they share the report. The recipient — who did not know ConduitScore existed — now has a professional-quality audit of their website in their inbox. When they click through to "see full results," they hit the ConduitScore landing page with the scan pre-loaded.

**What you learn:** Whether "report forwarding" to non-users creates a meaningful new-user acquisition channel. Track: emails sent via this feature vs. new accounts created within 7 days from recipients.
