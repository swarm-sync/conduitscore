# TASKS — HOMEPAGE MVP MESSAGING FIX

## Goal

Make the homepage easier to understand and easier to trust without a redesign.

Do not invent a new story.
Do not broaden the audience.
Do not teach the full product model above the fold.

The homepage should do one job:
**help a first-time visitor understand what ConduitScore is, why it matters, and why they should run a scan now.**

---

## Core Rule

Free users do **not** get all 7 fixes on the homepage example.

The example card must show:
- one visible fix
- the remaining fixes blurred
- a clear CTA to unlock or see the rest

Do not rewrite the page in a way that implies all 7 fixes are fully revealed for free.

---

## Exact Changes

### 1. Hero — Replace the current subheadline

In [page.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx), replace the current hero copy with:

- H1:
  `Get your website's AI visibility score.`

- Subheadline:
  `Paste your URL to see how visible your site is to AI tools, what's hurting you, and what to fix first.`

- Social proof line:
  `No signup required. Most sites we scan score lower than they should.`

Do not mention:
- `7 AI visibility signals`
- `can find and cite your content`
- a long list of AI model names

Keep the promise simple.

### 2. Hero CTA — Change the button text

In [scan-form.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/components/scan/scan-form.tsx), change the hero button label from:

- `Scan My Site`

to:

- `Scan My Site Free`

Do not use:
- `Get Started`
- `Try It Free`
- `Run Analysis`

### 3. Hero support row — remove logo-soup feel

Keep the low-friction message.

Remove or de-emphasize the AI chip row:
- `ChatGPT`
- `Claude`
- `Gemini`
- `Perplexity`
- `Copilot`

If kept, move it lower and style it as secondary support, not as a core hero message.

It should not compete with the headline or CTA.

### 4. Keep only one example score card near the top

The hero already shows the product visually.

Do **not** repeat the same full example score card again in a separate section with nearly identical meaning.

Action:
- keep the example score card in the hero
- remove the duplicate “This is what AI crawlers actually see” score-card repetition
- replace that section with a lighter proof section or remove it entirely

### 5. Rewrite the proof section headline

If you keep a proof section under the hero, change the headline from:

- `This is what AI crawlers actually see.`

to:

- `What your scan looks like`

That is clearer and less technical.

### 6. Fix the example card messaging

In [example-score-card.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/components/home/example-score-card.tsx):

- keep one visible fix snippet
- keep the blurred additional fixes
- keep the upgrade/reveal CTA overlay

Change the overlay CTA text from:

- `Upgrade to unlock all fixes`

to:

- `Unlock the rest of the fixes`

Change the caption below the card from:

- `Live example — scan your site to see yours`

to:

- `Example scan — run yours to see the full report`

This is clearer and matches the free-user gating model.

### 7. Reframe the trust band

In [page.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx), keep the trust band but rewrite the copy:

- stat 1:
  `[weekly scan count] sites scanned this week`

- stat 2:
  `Average score: 41/100 — most sites are missing basic AI-readability signals`

- stat 3:
  `Results in under 30 seconds. No signup required.`

Do not use vague filler like:
- `significant room to improve`

Say what the low score actually means.

### 8. Keep “How It Works” short

Keep the 3-step section.

Use exactly these three steps:

1. `Paste your URL`
2. `We scan your site for AI visibility issues`
3. `Get your score and your first fixes`

Do not mention `7 signals` in this section.

This section exists to reduce friction, not explain the product internals.

### 9. Replace the audience section headline

In [who-uses-section.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/components/home/who-uses-section.tsx), change:

- `Built for the people who care about search.`

to:

- `Who this is for`

That removes filler and gets to the point faster.

### 10. Narrow the audience tiles

Keep the section, but tighten it.

Use only these three audience tiles:

- `SEO teams and agencies`
  `Show clients what is stopping AI tools from reading and recommending their content.`

- `SaaS marketing teams`
  `Find the technical and content issues that make your site harder for AI tools to surface.`

- `E-commerce brands`
  `Make product and category pages easier for AI systems to understand and recommend.`

Remove:

- `Website owners`

It is too broad and weakens positioning.

### 11. Move the technical taxonomy lower

In [signals-section.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/components/home/signals-section.tsx):

- keep the section
- move it below the audience section
- change the section heading from:
  `Seven signals. One score.`
- to:
  `What ConduitScore checks`

Change the support line from:

- `Each category returns a score, a list of issues, and a copy-paste fix.`

to:

- `Your report shows the issues hurting AI visibility and the fixes to tackle first.`

This section should feel like proof of depth, not the main sales pitch.

### 12. Rewrite the SEO-audit FAQ answer

In [page.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx), change:

- `Traditional tools optimize for ranking algorithms. ConduitScore measures what ChatGPT, Perplexity, Claude, and Gemini actually look for.`

to:

- `SEO tools tell you how you rank. ConduitScore shows whether AI systems can read, understand, and surface your site.`

Shorter. Clearer. Less buzzword-heavy.

### 13. Rewrite the bottom CTA

In [page.tsx](/C:/Users/Administrator/Desktop/ConduitScore/phase_5_output/src/app/page.tsx), change the bottom CTA headline from:

- `You've read enough. See your number.`

to:

- `Run your free AI visibility scan`

Use the same CTA button:

- `Scan My Site Free`

Keep the supporting line short:

- `No signup required. Results in under 30 seconds.`

### 14. Final section order

The homepage order should be:

1. Hero
2. Trust band
3. How it works
4. Who this is for
5. What ConduitScore checks
6. FAQ
7. Bottom CTA

Do not insert any additional educational or conceptual section above `How it works`.

---

## Summary of What To Remove

Remove these ideas from the top of the page:

- `7 AI visibility signals`
- long AI model lists
- duplicated score-card proof
- `Built for the people who care about search`
- over-technical “AI crawlers actually see” framing
- broad “website owners” targeting

---

## Acceptance Criteria

- A first-time visitor can understand the product in one screen.
- The hero says what the product is and what the visitor gets.
- The hero does not dump internal product taxonomy.
- The page does not show the same proof block twice.
- The page preserves free-user gating:
  - one visible fix
  - remaining fixes blurred
  - clear CTA to unlock the rest
- The page feels tighter, sharper, and more MVP-credible.
