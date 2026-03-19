# TOP_CONCEPTS.md
# DarkMirror — ConduitScore: Top 5 Strategic Concepts with MVP + Test Plans

---

## Concept 1: Diagnosis Full / Prescription Locked

**One-liner:** Free users get the complete audit — every issue, every severity, every plain-English explanation. Code fixes are the only thing locked.

**The mechanic (transfer):** Emergency Room triage model. The ER nurse tells you exactly what is wrong. The cardiologist charges for the intervention. ConduitScore tells you exactly what is broken. The code fix costs money.

**What is free:**
- Score (0-100)
- All 7 category scores
- Every identified issue, with title and severity badge
- Full plain-language description of each issue
- Business impact statement per issue ("GPTBot cannot crawl your site because of this setting")
- Shareable permanent report URL

**What is locked (Starter+):**
- Every code fix (copy-pasteable JSON-LD blocks, HTML tags, meta tags, robots.txt amendments)
- The "Copy" button on each fix
- Fix implementation time and score impact estimates

**Why this creates upgrade motivation:**
The user who reads "Your site is blocking GPTBot via robots.txt, making you invisible to ChatGPT's search" and cannot see the robots.txt fix is experiencing precise, targetable frustration — not vague dissatisfaction. They know exactly what they need. They just need the specific text. That specificity is what separates a motivated buyer from a disengaged one.

**MVP in 1 week:**
1. Remove code fix content from free scan API response (return null or locked flag for fix fields)
2. Render a locked fix card component in the UI for free users (styled, with CTA)
3. Upgrade the issue description copy to include the business impact statement for each of the 7 issue types
4. Set up Stripe Starter checkout triggered from the locked fix CTA

**First validation test:**
A/B test: current free experience (full fixes) vs. new locked experience on new user cohort for 2 weeks.
Measure: free-to-paid conversion rate. Secondary metric: time-on-page (should increase in locked variant as users read more carefully). Hypothesis: locked variant shows 2x+ conversion rate with no meaningful drop in scan completion rate.

---

## Concept 2: One Free Fix — The Demo Snippet

**One-liner:** Every free scan includes exactly one complete, working code fix — the highest-impact, most implementable one — delivered as a product demonstration.

**The mechanic (transfer):** Physical therapy initial assessment. The PT shows you one exercise during the free assessment. It works. Now you want the full program. ConduitScore gives you one perfect snippet. It works. Now you want the other 14.

**Which fix is the demo fix:**
The scan logic identifies the single best "demo fix" using these selection criteria (in priority order):
1. LLMs.txt file creation — it is entirely self-contained, has no dependencies, is immediately testable, and is uniquely ConduitScore's domain expertise
2. If LLMs.txt is not an issue, the highest-severity single-file fix (robots.txt amendment, single meta tag)
3. Never use a multi-file or complex JSON-LD block as the demo fix — it must be implementable in 2 minutes

**Presentation of the demo fix:**
- Labeled: "Free fix — try this now. This is exactly what all fixes look like."
- Styled identically to paid fixes (same code block, same copy button, same syntax highlighting)
- The label makes the product demonstration explicit — the user is not confused about why this one is free

**Why this converts better than zero free fixes:**
A user who has implemented one fix and seen it work is not the same as a user who has only read about fixes. The implementation experience proves competence. It also creates partial completion: the user has fixed 1 of 15 issues. The psychology of partial completion (Zeigarnik effect) creates persistent motivation to finish what was started. The remaining 14 locked fixes feel like an unfinished task, not a sales pitch.

**MVP in 1 week:**
1. Add demo fix selection logic to scan scoring engine: identify the best demo fix based on criteria above
2. Flag that fix as free=true in the API response
3. Render it with the "Free demo fix" label in the UI
4. All other fixes render as locked cards

**First validation test:**
Compare two locked-fix variants: one with zero free fixes vs. one with one free demo fix.
Measure: upgrade rate within 7 days of scan. Hypothesis: the one-free-fix variant shows higher upgrade rate because users have experienced the product value directly. Secondary measure: track whether users actually implement the demo fix (via rescanning) and whether implementors have higher conversion rates than non-implementors.

---

## Concept 3: The Gap Statement — Score Projection as Upgrade CTA

**One-liner:** Above the locked fixes section, a single dynamic statement: "Fixing the 9 locked issues below would raise your score from 43 to an estimated 74."

**The mechanic (transfer):** Physical therapy treatment plan. The PT tells you: "With a 6-week program, you should regain 80% of your range of motion." You are not buying sessions — you are buying the outcome. ConduitScore users are not buying code fixes — they are buying a 31-point score increase.

**How the projection is calculated:**
Each issue in the system has an assigned point value (already implicit in the scoring rubric — the 7 categories have defined max scores). The gap statement sums the locked issues' point values and projects the score delta. This is an estimate, not a guarantee — it assumes correct implementation. The statement should say "estimated" to be accurate.

**Where it appears:**
- Immediately above the first locked fix card, in a visually distinct treatment (not a generic CTA banner — a calculated, personalized statement that reads like data, not marketing)
- The specific numbers (current score, projected score, number of issues) are computed from the actual scan result

**Why "score projection" converts better than "upgrade to unlock":**
"Upgrade to unlock" is access framing. "Go from 43 to 74" is outcome framing. Access framing asks the user to pay for permission. Outcome framing asks the user to pay for a specific, quantified result. The user is a marketing manager who needs to justify the $29 spend — either to themselves or to their boss. "I paid $29 to go from an AI visibility score of 43 to 74, which means our content can now be cited by ChatGPT" is a justifiable purchase. "I paid $29 to unlock code snippets" is not.

**MVP in 1 week:**
1. Calculate the projected score for each scan based on sum of locked issue point values
2. Render the gap statement component with dynamic numbers (current score, projected score, locked issue count)
3. Add a "How is this calculated?" tooltip that explains the scoring system — this builds trust in the projection
4. The gap statement CTA button says "Start fixing — unlock all [N] code fixes" (not "upgrade" or "go pro")

**First validation test:**
A/B test the CTA area: standard "Upgrade to Starter" button vs. gap statement + "Start fixing" button.
Measure: click-through rate on the CTA and conversion to paid. Hypothesis: the gap statement variant shows 40%+ higher CTA click-through because it is presenting a quantified outcome, not an abstract feature access offer.

---

## Concept 4: Developer Handoff Brief (Non-Developer Conversion Path)

**One-liner:** For non-technical users, the paid unlock is not a code fix — it is a formatted brief they can send to their developer to get everything implemented.

**The mechanic (transfer):** Law firm retainer model. The client does not draft the legal documents — the attorney does. The client's job is to decide to proceed; the attorney's job is to produce the correct deliverable. For a marketing manager who does not write code, the correct paid deliverable is not code — it is a document their developer can execute without further explanation.

**What the Developer Handoff Brief contains:**
- The full scan result, formatted for developer consumption (not for marketing manager reading)
- Each issue explained in 1 sentence of developer-appropriate language
- The exact code fix for each issue (the same fixes accessible in the standard paid tier)
- Implementation sequence (ordered by impact)
- Estimated developer time per fix
- A checklist the developer can check off as items are implemented
- A "verification step" per fix: how to confirm the fix worked (e.g., "rescan at conduitscore.com to verify this issue is resolved")

**Who this serves:**
SMB marketing managers, startup founders, content teams — anyone who manages a website but does not have direct code access. These users currently get no value from a code fix they cannot implement. The handoff brief converts ConduitScore from a "developer tool" into a "marketing team tool."

**Tier placement:**
- Generate the brief: Starter ($29) — available immediately after upgrade
- White-label the brief with agency branding: Agency ($199) — enables agencies to bill this as a deliverable to clients

**MVP in 1 week:**
1. Build a PDF/HTML export of the scan result formatted as a developer brief
2. Add "Export Developer Brief" button to paid scan reports
3. No white-labeling in MVP — just clean, ConduitScore-branded export
4. Test with 5 non-developer beta users who completed free scans — send them the brief manually and collect feedback on whether they found it valuable enough to pay for

**First validation test:**
Recruit 10 free users who identify as non-developers (via a simple post-scan survey: "Do you have access to your site's code?"). Offer them the Developer Handoff Brief feature as a standalone Starter upgrade. Measure: conversion rate among non-developer users vs. general free user population. Hypothesis: non-developer users convert at equal or higher rates than developer users when given the handoff brief framing — because the barrier to implementation is removed.

---

## Concept 5: Progress Tracking as Retention Mechanic (Email Gate + Re-Scan)

**One-liner:** A free email capture delivers a "7-day check-in" re-scan notification, turning one-shot free users into a re-engagement loop and demonstrating score improvement as the core paid retention hook.

**The mechanic (transfer):** Physical therapy reassessment session. The PT schedules a reassessment at week 6 to measure progress and justify continued treatment. ConduitScore's reassessment is the re-scan — measuring whether fixes were implemented and whether the score improved.

**How it works:**
- After a free scan, a non-intrusive email prompt: "Save your report and get a 7-day check-in reminder" (email capture)
- 7 days later, automated email: "Your ConduitScore check-in is ready — has your AI visibility improved?" with a one-click rescan link
- The rescan is free (within the 3 scans/month limit)
- If the score improved: "Your score went from 43 to 51 — here is what you fixed and what is still open"
- If the score did not change: "Your score is still 43 — here are the 9 fixes waiting for you"

**Why this converts:**
The user who implemented the one free demo fix (Concept 2) and rescanned sees their score move. That movement is the most powerful demonstration of the product's value. They now have a before-and-after data point. The locked fixes have a new frame: "These are the fixes that would move your score from 51 to 74." The re-scan also surfaces new issues if the site has changed, creating fresh urgency.

**The retention mechanic for paid users:**
Paid users get automated weekly or monthly re-scans with score trend graphs. The score graph over time is the paid retention hook — it makes ConduitScore a monitoring tool, not a one-shot audit. Users who see their score improving stay subscribed to maintain it. Users who see their score dropping react with urgency.

**MVP in 1 week:**
1. Add post-scan email capture modal (shown after 30 seconds on the results page, not immediately)
2. Set up automated 7-day re-scan reminder email via SendGrid/Resend
3. Build a minimal score comparison view: "Last scan: 43 — Current scan: 51 — Change: +8"
4. No score graph in MVP — just the two-point comparison with a delta

**First validation test:**
Measure email capture rate on the post-scan modal (benchmark: 20-30% for a non-intrusive modal).
Measure 7-day re-scan rate among users who provided email vs. those who did not.
Measure upgrade rate within 30 days for email-captured users vs. non-captured users.
Hypothesis: email-captured users who receive the re-scan reminder upgrade at 3x the rate of non-captured users because the re-scan creates a second, personalized conversion touchpoint.

---

## Summary: The 3 Sharpest Insights

### Insight 1: The gate belongs at the code fix, not the diagnosis.
The current free tier gives away the diagnosis AND the prescription. The correct division is: diagnosis entirely free (score, categories, every issue, every description, every business impact statement), prescription entirely paid (every code fix). This is the ER model, the law firm model, and the physical therapy model — all three arrive at the same gate placement independently. The diagnosis creates urgency. The prescription captures revenue. Never flip these.

### Insight 2: One free fix converts better than zero free fixes.
Giving away one complete, working code fix as an explicit product demonstration is more powerful than giving away none. The user who implements the free fix and sees it work has experienced the product — they are no longer deciding whether to trust ConduitScore, they are deciding whether to buy more of something they have already validated. The demo fix should be selected algorithmically for maximum immediate demonstrability (LLMs.txt is the best candidate), labeled explicitly as a demonstration, and styled identically to paid fixes so the user knows exactly what they are getting more of.

### Insight 3: The upgrade CTA should be a score projection, not an access offer.
"Unlock code fixes" is access framing. "Go from 43 to 74" is outcome framing. The user does not want access to code — they want their AI visibility to improve. The gap statement (current score + projected score + number of locked fixes) converts this from a paywall into a purchase with a quantified return. For a marketing manager justifying a $29 expense, "I bought a 31-point AI visibility score increase" is a complete business justification. "I unlocked code snippets" is not. The gap statement is a one-line reframe that changes the entire psychology of the upgrade decision.

---

## Exact Implementation Specification: What is Free, What is Locked

### Free (no login, no email, no friction)
- Score: 0-100, displayed prominently
- All 7 category scores with names and point values
- Every identified issue: title, severity badge, full plain-language description
- Business impact statement per issue (1 sentence, non-technical, AI-consequence focused)
- Issue count by severity (X critical, Y warnings, Z info)
- One complete code fix (the "demo fix" — best candidate is LLMs.txt creation)
- Permanent shareable report URL
- Re-scan CTA (within monthly limit)

### Locked (Starter $29+)
- All remaining code fixes (copy-pasteable blocks for every issue except the one demo fix)
- The "Copy" button on locked fixes
- Prioritized fix sequence (ordered by score impact)
- Score projection ("implementing these fixes would raise your score to approximately X")
- Developer Handoff Brief export (PDF)
- Fix effort estimates per issue (time to implement, score impact)

### Paid Structural Features (unlocked by plan tier, not by the free/paid divide above)
- Multi-page scans: Starter (5 pages), Pro (50 pages), Agency (unlimited)
- Score history and trend graph: Starter+
- Scheduled re-scans and monitoring alerts: Pro+
- Competitor analysis: Agency
- White-label report export with agency branding: Agency
- API access to raw scan JSON: Pro+
