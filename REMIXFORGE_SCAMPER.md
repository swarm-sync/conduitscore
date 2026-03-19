# REMIXFORGE — SCAMPER.md
# ConduitScore Free/Paid Gate Strategy

**Base Thing:** ConduitScore's current free tier — gives away score (0-100), all 7 category scores, every issue with severity + full description, every fix with copy-pasteable code. No login required. 3 scans/month.

**Hard Constraints:**
- Code fixes are the unique differentiator vs. every competitor
- Target: marketing managers at SMBs, SEO consultants, agency owners, startup founders
- Pricing ladder exists: Free / $29 / $79 / $199/mo
- Product has to prove value before asking for money
- Conversion path must work for non-technical buyers who cannot evaluate code quality

---

## S — SUBSTITUTE

*What could we substitute inside the free tier without breaking the proof-of-value?*

**S1. Substitute code fixes with plain-English fix instructions.**
Free tier shows: "Add a JSON-LD Organization schema block to your homepage `<head>` section." Paid tier shows the exact, copy-pasteable JSON-LD. The user understands what to do but still needs the product to do it efficiently. The gap is time and accuracy, not comprehension. This is the HubSpot Grader model — tell them the problem in English, sell the exact answer.

**S2. Substitute the per-issue fix with a fix-bundle concept.**
Instead of unlocking fixes one at a time, the free tier shows a "Fix Pack" concept: "Your 4 critical issues are packaged into a single implementation bundle — available on Starter." The user sees the promise of atomized, pre-packaged work rather than raw snippets. This shifts the value frame from "code" to "deliverable."

**S3. Substitute the anonymized free scan with an identity-anchored free scan.**
Right now a scan requires no login. Substitute with: first scan still free and loginless, but the result is ephemeral (session-only, no shareable link). Login = persistent report + shareable URL. The code fix gate stays but the identity gate creates a second pull toward account creation that currently does not exist.

---

## C — COMBINE

*What two things, combined, create a mechanic that neither does alone?*

**C1. Combine the score reveal with a live benchmark comparison.**
Free scan shows your score (e.g., 41/100). Immediately paired with: "The median score for [your industry] is 58. You are in the bottom 32% of sites we have scanned." The benchmark makes the score emotionally meaningful in a way it currently is not. Benchmarks are a paid data asset that make the free number feel more urgent. The fix code stays behind a gate — but the benchmark makes the user *feel* the urgency before they see a single fix.

**C2. Combine the free report with a sharable competitive scan.**
Free tier unlocks: scan your site AND scan one competitor URL. Both scores appear side by side. You see where you lose. Fixes are gated. This introduces loss aversion (competitor is beating you) as the conversion driver. Used heavily in SEMrush's free tier.

**C3. Combine account creation with a "fix commitment" mechanic.**
When the user first sees a critical fix (description only, no code), they click "Get Fix Code." Instead of a paywall, they get a micro-gate: "Save this fix to your Fix Queue (free) or get all 12 fixes now (Starter)." Creating a Fix Queue requires only an email. The queue anchors the user to a persistent task — they have started a job they have not finished.

---

## A — ADAPT

*What model from another industry survives translation to this context?*

**A1. Adapt the doctor/patient diagnostic model.**
Medical diagnostics tell you "you have high cholesterol" for free (it is in your interest to know). They sell you the prescription, the treatment plan, the monitoring service. ConduitScore free tier = the bloodwork results (score + issue list + severity). Paid = the treatment plan (exact fix code + implementation order + estimated impact per fix). The paid tier is not more information — it is the *actionable prescription*. This also reframes the brand from "scanner" to "doctor for your website's AI health."

**A2. Adapt the freemium game "energy" model.**
Mobile games give full access to the game but gate it behind daily energy limits. You get 3 free scans today, but you can "earn" more by referring a colleague, sharing your score badge, or connecting to Google Search Console. This converts non-paying users into distribution agents before they hit the paywall. The mechanic is psychologically proven and costs ConduitScore nothing per referral.

**A3. Adapt the professional services "discovery call" model.**
Consulting firms give the free diagnosis (a short audit deck) and charge for the engagement. ConduitScore could adapt this by making the free scan output a "one-page audit brief" — designed to be shared with a CTO or manager, not implemented by the person who ran it. The brief says: "You need 4 fixes. Get the implementation guide for your team." The buyer and the implementer are different people. The free tier does sales work, the paid tier does implementation work.

---

## M — MODIFY / MAGNIFY

*What happens if we turn one element up to 11 or down to near-zero?*

**M1. Magnify the score drama.**
Instead of "Your score is 41/100," show an animated dial that sweeps up to 41 and stops with a hard red color. Add: "41 means you are effectively invisible to ChatGPT and Claude right now." Show a simulated ChatGPT response to a query about the user's industry that does not include their site. Make the emotional impact of a low score visceral. The code fix gate becomes easier to justify once the user has felt the cost of inaction.

**M2. Magnify the fix preview — show a "before/after simulation."**
Free tier shows the issue and a blurred fix code block, but above it shows: "After this fix, your Structured Data score improves from 12 → 74. Your overall score improves from 41 → 67." The exact numbers are simulated projections. The user sees what they are leaving on the table — not just that a fix exists, but the quantified value of that specific fix. This is more persuasive than seeing the code itself.

**M3. Modify the gating layer from binary (free/paid) to progressive.**
Currently: all code is free, nothing is gated. Proposed modification: first 2 critical fixes are fully free (code and all). Fixes 3 through N require Starter. This "first hit free" model lets the user experience the full value of one or two fixes — they implement them, see an improvement in their score on rescan, and are now proven customers. Conversion after a taste of success is dramatically higher than conversion from a preview.

---

## P — PUT TO OTHER USES

*What else could the free scan output be used for beyond the person who ran it?*

**P1. Use the free report as a B2B sales tool for agencies.**
An SEO agency runs a free scan of a prospect's site before a sales call. The report becomes a leave-behind: "Here is your AI visibility score — 34/100. Our agency can fix this in 2 weeks." ConduitScore free tier is doing the agency's lead generation. Paid tier is where the agency actually delivers. Build the free tier to export a "client-ready PDF audit" — branded, shareable, designed to be sent to a prospect. Agencies will run free scans on every prospect in their pipeline if the output looks professional.

**P2. Use the score as a website badge / embed widget.**
Site owners who score above 70 can embed a "ConduitScore Verified: 82/100 AI-Visible" badge on their site. This is a viral distribution mechanism — every badge is an ad. The badge links back to ConduitScore with the referral pre-loaded. Competitors' clients see the badge and want one. No additional cost per badge issued.

**P3. Use the free scan as a SaaS integration trigger.**
Connect ConduitScore to Webflow, WordPress, Shopify via plugin. When a site owner installs the plugin, a free scan runs automatically on installation. The plugin dashboard shows the score. Fix code is shown inline in the CMS context (e.g., "Add this to your Webflow site settings > Custom Code"). Integration context makes the code fixes more accessible to non-developers — they know exactly where to paste. Paid plan unlocks scheduled rescans via the plugin.

---

## E — ELIMINATE

*What is the minimum we could show in the free tier that still proves the product?*

**E1. Eliminate all category scores, show only overall score + issue count.**
Free: "Your site scored 41/100. We found 3 critical issues, 8 warnings, and 5 informational items." Nothing else. No categories, no issue descriptions, no fixes. This is a pure teaser — proves the scanner found real problems, gives the user a number to be anxious about, and leaves them completely in the dark about what to do. Conversion pressure is entirely from anxiety. Risk: users bounce because there is no proof the issues are real.

**E2. Eliminate the free code fixes entirely — show only scores + issue titles.**
Free: overall score, all 7 category scores, issue titles ("Missing JSON-LD Schema," "No llms.txt detected") but no descriptions, no severity rankings, no fix code. The user can Google the issue titles and potentially fix them without paying. But most will not — the cognitive load of researching 12 separate issues is high. The paid tier removes that friction entirely. This is the SEMrush model (limited data free, full data paid).

**E3. Eliminate the login-free experience entirely for the report — show only the score.**
The scanner runs and shows a score on the public page. That is all. The email capture unlocks the full issue list. Payment unlocks the fixes. Three distinct gates instead of one binary free/paid divide. This staggers the conversion funnel: Score (everyone) → Issue List (email) → Fix Code (paid). Current model collapses all three into one.

---

## R — REVERSE / REARRANGE

*What if the order of operations was flipped?*

**R1. Reverse the reveal: show fixes first, score second.**
Landing page shows a library of common AI visibility fixes (blurred/locked): "Add structured data for FAQ pages," "Configure robots.txt for AI crawlers," "Implement llms.txt." User thinks: "I wonder if my site has these problems." They enter their URL. The scan runs. Results page unlocks the fixes that are relevant to THEIR site specifically — some fixes stay locked (paid), but the ones their site needs are highlighted. The value proposition is "find out which of these fixes you need" rather than "find out your score."

**R2. Rearrange: put signup before results (but make it frictionless).**
After scan runs (takes 10-15 seconds), instead of showing results immediately, show: "Your results are ready. Enter your email to view them." One field, one click. Email confirmed in session — results shown immediately, no email verification required. The email capture converts a 0% identified user into a marketable lead. Current model gets the email only when they choose to sign up (much later, much lower conversion rate). Pair this with: "We will email you your report so you can revisit it."

**R3. Reverse the competitive position: charge for the diagnosis, give away the fixes.**
Counterintuitive: make the SCAN cost money (a small one-time fee or required login), and make the FIX CODE free once you have paid for the scan. This inverts the current model. Rationale: the value is in the diagnostic intelligence (knowing what is wrong), not in the generic fix templates. A user who pays $1-5 for a scan is already qualified. The fix code, once they have paid, feels like a bonus rather than something being withheld. This is the model used by some B2B audit tools.

---

## TOP 5 REMIX GEMS

**Gem 1: The Prescription Gate**
Free = diagnosis (score + issue list + severity + plain-English descriptions). Paid = prescription (exact fix code + implementation order + projected score impact per fix). Adapts the medical model. Differentiates on "actionability" not "information." Every competitor gives nothing — ConduitScore free gives more than anyone else even at the diagnosis level.

**Gem 2: The Fix Queue + Email Micro-Gate**
Free scan results appear immediately. User clicks any fix code button → micro-gate: "Add to Fix Queue (free, requires email) or unlock all 12 now (Starter)." Fix Queue requires only email, no payment. Email list becomes the primary conversion asset. Follow-up email sequence shows them their queue, reminds them of items not implemented, offers Starter to clear the queue faster.

**Gem 3: The Before/After Impact Score**
Show fix code description (no code), plus: "This fix alone moves your overall score from 41 → 67." The projected score impact per fix is more persuasive than the code itself. Users buy outcomes, not code. Paid tier shows the code; the free tier shows what the code is worth.

**Gem 4: The First-Two-Free Taper**
First 2 critical fixes are fully free (complete code). Fixes 3-N are gated. User implements the free fixes, rescans, sees improvement, is now a proven user who has experienced success. Conversion at this stage is far higher than conversion from preview alone.

**Gem 5: The Agency Leave-Behind**
Free scan output is engineered to be printed/shared: exports a client-ready PDF with your agency's logo space, the client's score, issue summary, and a "fix estimate." Agencies use ConduitScore as a free prospecting tool. Every agency that adopts it runs the free scan on dozens of prospects per month. Paid converts when the agency wins the client and needs to deliver.
