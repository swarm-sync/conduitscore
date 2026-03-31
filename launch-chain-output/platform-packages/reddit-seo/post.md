# I analyzed 500 websites for AI agent visibility — here's what's actually blocking ChatGPT from citing them

Cross-posting my findings from a project I've been working on. Not trying to promote anything — just sharing data that might be useful.

**Background:** I got curious why some well-ranked sites never get cited in ChatGPT or Perplexity answers. Spent the last few months building a tool to systematically measure it. Scanned around 500 production websites.

**What I found:**

The median AI visibility score is pretty low — most well-maintained sites score around 42/100 on the signals I measure.

The most common specific issues:

**1. robots.txt blocking AI crawlers (affects ~40% of sites)**

Most robots.txt files were written before GPTBot, ClaudeBot, and PerplexityBot existed. They're either inadvertently blocking them or not explicitly permitting them. If you want to be cited, you need:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

Check yours: `https://yourdomain.com/robots.txt`

**2. No llms.txt file (85% of sites)**

Similar to robots.txt but designed for LLMs — gives AI agents a structured summary of your site. Spec is at llmstxt.org. Takes about 30 minutes to add. Almost nobody has this yet.

**3. Missing author and publication metadata (60% of sites)**

AI models weight sources by authority signals. A page with "Posted by Admin" scores worse than "By [Name], [Title] at [Company] | March 15, 2024." The model is trying to evaluate source credibility the same way a researcher would.

**4. Lack of JSON-LD structured data (70% of sites)**

Schema.org markup gives AI agents a machine-readable entity graph. `Article`, `Organization`, `WebPage` schemas are the most impactful. Without them, content is unstructured text to the crawler.

**The good news:** most of these are one-sprint fixes. Moving from 42→65 is realistic in a week of focused work.

Happy to answer questions about any specific issue or what the scoring methodology looks like. If you want to check your own site, I built a free scanner at conduitscore.com (mentioning it once since that's how I generated the data — but the findings above stand on their own).

What are you all seeing in terms of AI search traffic? Are any of you actively tracking Perplexity/ChatGPT referrals in GA4?
