# REMIXFORGE — ASSUMPTIONS.md
# ConduitScore Free/Paid Gate: Assumption Inventory + Smash

---

## The 12 Buried Assumptions

These are the beliefs currently baked into the free tier model — none of them written down, all of them load-bearing.

1. Users need to see the actual fix code to understand why they should pay for more.
2. Free means no login required — friction at the front door will kill conversion.
3. The score number (0-100) is the primary hook that makes users care about the product.
4. Users who get all the information for free will upgrade for volume (more scans, more pages).
5. Showing everything free builds trust, and trust converts to paid.
6. The person who runs the scan is the same person who implements the fixes.
7. Competing on comprehensiveness (most data free) is a sustainable market position.
8. Users evaluate the code fix quality before deciding whether to pay.
9. A shareable report URL is a nice-to-have social feature, not a primary growth channel.
10. The conversion bottleneck is price sensitivity — if we charge less, more people upgrade.
11. Free users who do not convert are not valuable to ConduitScore in any other way.
12. Code fixes are a commodity — the differentiation is only that competitors have none.

---

## Smash 1: "Users need to see fix code to understand the value"

**Flipped:** Users do NOT need to see fix code. They need to feel the cost of not having it.

**What survives in the flipped world:**

- Show projected score impact per fix ("This fix moves your score from 41 to 67") without showing the fix code. The user does not need to read JSON-LD to know they want +26 points.
- Show fix titles and plain-English descriptions. The user understands the problem — they just do not want to do the research to solve it. The paid tier removes that research friction, not information friction.
- Show a "time-to-implement" estimate per fix ("3 minutes with the code / 2-4 hours without"). The code is sold as time savings, not information.
- Competitor comparison: "Fix this one issue and you will outrank the median in your industry." The emotional leverage is competitive position, not code access.

**Concept that survives: The Impact-Gated Fix**
Free tier shows: issue title, plain-English description, severity, and projected score delta if fixed. Paid tier unlocks: the exact code, the implementation instructions, the one-click copy button. The user buys outcomes (score improvement) not information (code).

---

## Smash 2: "Free = no login required"

**Flipped:** Free requires login (but login is frictionless and genuinely valued).

**What survives in the flipped world:**

- The scan runs immediately at the URL you enter. After 10-15 seconds of scanning, a single field appears: "Your report is ready. Enter email to view." The scan already ran — you are not asking them to commit before they see value, you are asking them to claim something they have already earned.
- Login-before-results increases email capture from roughly 5-8% (typical "sign up to save your report" CTR) to potentially 60-80% (you MUST enter email to see the result you just waited 15 seconds for).
- The product emails them their report. This creates a re-engagement mechanism that currently does not exist. Users who forget they ran a scan get a follow-up email that drives them back.
- The email address enables the fix queue follow-up sequence, weekly AI visibility tips, and rescan reminders — all of which create paid conversion opportunities.

**Concept that survives: The Email-Gate Reveal**
Scan runs. "Your results are ready" screen. Single email field. Click "View My Results." Full report shows immediately — no email confirmation required. Email is captured at peak intent (right after the scan completes, right before results are shown). This is the "first moment of peak motivation" in the user journey — currently wasted.

---

## Smash 3: "The person who runs the scan implements the fixes"

**Flipped:** The person who runs the scan is a BUYER, not an implementer. They need to hand off the fixes to someone else.

**What survives in the flipped world:**

- Marketing managers run scans but cannot implement JSON-LD. They need to send the fix instructions to their developer. Free tier should make this handoff easy — "Send to Developer" button that emails the issue list with implementation context to a specified email address.
- Agency owners run scans on client sites. They need a client-ready output, not raw code. A "Client Report" export mode formats the results for non-technical audiences: "Your website is currently invisible to AI assistants like ChatGPT. Here are the 3 most impactful fixes our team will implement."
- The fix code itself is most useful to developers — but developers are not the economic buyers. The product needs two modes: a "buyer mode" that shows impact and cost justification, and an "implementer mode" that shows code. Currently it has only implementer mode.

**Concept that survives: The Two-Mode Report**
Toggle at the top of the report: "Sharing with your team?" switches from technical mode (code, severity labels, JSON-LD) to executive mode (impact summaries, priority ranking, estimated business value). Executive mode is free. Technical mode (with code) is paid. This matches the actual org chart of how websites get fixed.

---

## Smash 4: "Competing on comprehensiveness is a sustainable position"

**Flipped:** Comprehensiveness is a commodity race. The sustainable position is SPECIFICITY — telling each user something uniquely true about their site that a generic tool cannot.

**What survives in the flipped world:**

- Instead of showing a generic issue list that applies to every low-scoring site, show a ranked priority list: "For YOUR site, based on your industry, current score, and the 3 most common query types you appear in, fix #1 is worth more than fixes #2-5 combined." This requires the product to know the user's industry and query context — which means login and a small onboarding step.
- Show a "peer comparison" specific to the user's industry vertical. "Out of 847 marketing agency sites we have scanned, yours ranks in the 18th percentile. The top 10% all have X, Y, Z in common." Generic fix suggestions become specific competitive intelligence.
- Show which AI models are currently finding the user's site and which are missing it. "Claude and Perplexity cannot find you. ChatGPT has indexed one of your pages. Here is why the others cannot." This is model-specific intelligence that competitors cannot replicate without running the actual scans.

**Concept that survives: The Industry-Benchmarked Personalized Audit**
The free scan detects or asks for one piece of context (industry/business type). Results are immediately benchmarked against same-industry peers. Issue priority is weighted by what matters most for that industry's typical AI query patterns. Paid tier shows the raw data powering the benchmark. Free tier gets "personalized" results that feel specific rather than generic — dramatically higher perceived value.

---

## Smash 5: "Free users who do not convert are not valuable"

**Flipped:** Non-converting free users are a distribution asset if the product gives them a reason to share.

**What survives in the flipped world:**

- A free user who scored 78/100 is proud of that score. Give them a shareable badge: "ConduitScore 78/100 — AI-Ready." They put it on their website and LinkedIn. Every badge is an impression for ConduitScore. High scorers are brand ambassadors.
- A free user who scored 34/100 is embarrassed. But they have a colleague or boss who needs to know. Give them a "Send to Boss" one-click email that pre-writes the message: "I ran an audit of our website's AI visibility. We scored 34/100. Here is the full report." This creates internal advocacy for purchasing.
- Agency owners who use the free tier on client pitches are not failing to convert — they ARE converting, just not for themselves. Build an affiliate/referral mechanism: agencies that refer clients who upgrade get 20% commission. Non-converting agencies become a sales channel.
- Users who complete 3 free scans and do not upgrade are telling you something about price or perceived value. Auto-trigger a one-time "Extended Free Trial" email: 10 additional free scans for 7 days, plus access to one paid feature (scheduled scans). Converts fence-sitters without devaluing the paid tier.

**Concept that survives: The Non-Converter Activation Loop**
Segment free users by score: high scorers get badge/share prompts, low scorers get "Send to Boss" prompts, agency-pattern users get affiliate offer, and exhausted-free-tier users get a time-limited extended trial. Non-converters have different reasons for not converting — treat them as four separate conversion opportunities rather than one failed cohort.

---

## Summary: 5 Concepts That Survive the Flipped World

| Smashed Assumption | Surviving Concept |
|---|---|
| Users need code to feel value | Impact-Gated Fix (show score delta, not code) |
| Free = no login | Email-Gate Reveal (scan first, email before results) |
| Scanner = implementer | Two-Mode Report (executive mode free, technical mode paid) |
| Comprehensiveness wins | Industry-Benchmarked Personalized Audit |
| Non-converters are wasted | Non-Converter Activation Loop (badge / Send to Boss / affiliate) |
