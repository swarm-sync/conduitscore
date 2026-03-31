# I built a tool that scores websites for AI visibility — sharing early results

**The problem I was solving:**

I kept noticing that sites ranking well in Google were completely invisible in ChatGPT and Perplexity results. Decided to figure out why and build a tool to measure it.

**What I built:**

[ConduitScore](https://conduitscore.com) — an AI Visibility Score for websites. Paste any URL, get a 0–100 score across 7 signal categories: crawler access, llms.txt, structured data, citation signals, content structure, content quality, technical health.

Each issue comes with a specific code fix, a score impact estimate, and an effort rating.

**Stack:** Next.js 16, TypeScript, Prisma + Neon PostgreSQL, NextAuth, Stripe, Vercel.

**Early data from ~500 scans:**

- Median score: 42/100
- Most common failure: no llms.txt file (85% of sites)
- Easiest quick win: adding AI bot permissions to robots.txt (15 min, +5-8 points)
- Most impactful fix: JSON-LD structured data (+10-15 points)

**Business model:**

Freemium. Free tier is 3 scans/month with 1 detailed fix. Paid tiers ($29–$79/mo) unlock all fixes, scheduled monitoring, and multi-site projects. Agency tier ($149, Contact Us) includes API access.

**Where I am:**

Just launched. Currently at low double-digit paying customers. Still figuring out the best acquisition channel — agencies seem most promising (they can bill the audit to clients).

**What I'd love feedback on:**

1. Is the "AI visibility" problem one you feel acutely, or does it still seem like a future concern?
2. The fix gating (free users see 1 fix) — does that feel fair or frustrating?
3. Any features that would make this immediately useful for your workflow?

Happy to give free Pro access for feedback from IH community members — reply here or email ben@conduitscore.com.
