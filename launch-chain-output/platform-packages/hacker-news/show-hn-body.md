# Show HN Post Body

I noticed a pattern: sites with solid Google rankings were getting zero citations in ChatGPT and Perplexity responses. After digging into why, I found the causes are mostly structural and fixable — but no existing tool was checking for them specifically.

ConduitScore scans any URL and returns a 0–100 score across seven signal categories:

- **Crawler access** — whether AI bots (GPTBot, ClaudeBot, PerplexityBot) are actually permitted by robots.txt and can find the sitemap
- **llms.txt** — presence and correct format of the AI-native crawl instruction file (similar to robots.txt but for LLMs)
- **Structured data** — JSON-LD and schema.org markup that helps AI parse entity relationships
- **Citation signals** — author bylines, publication dates, E-E-A-T signals that models use to evaluate source credibility
- **Content structure** — heading hierarchy, direct answer patterns, semantic HTML
- **Content quality** — reading level, information density, AI-parseable prose vs. marketing copy
- **Technical health** — HTTPS, load time, mobile rendering

Each issue returns a specific code fix with an estimated score impact. The scanner fetches robots.txt, sitemap.xml, llms.txt, and the page HTML — no JS rendering yet, which is a known limitation.

Tech: Next.js 16 + Prisma + Neon PostgreSQL + Vercel. The scoring weights are based on observed citation patterns across a sample of ~500 pages, though I'd welcome input on methodology.

Live at https://conduitscore.com — free tier is 3 scans/month.

Happy to answer questions about the scoring methodology or what signals actually matter for AI citation.
