# VISUAL QA CHECKLIST — ConduitScore
## Reviewer: Taylor
## Date: 2026-03-16

---

## HOMEPAGE REDESIGN

### Hero Section (1440×900 Desktop)
- [ ] H1: "See your AI visibility score in 30 seconds." — left column, above fold
- [ ] URL input: focused on page load, placeholder "https://yoursite.com"
- [ ] CTA button: "Scan My Site" (NOT "Get Started" or "Try It Free")
- [ ] Right column: ExampleScoreCard visible with animated score ring
- [ ] Score ring displays 74 after animation
- [ ] Score ring color: lime/green (NOT red or cyan-teal)
- [ ] Seven category bars visible below score (animated fill on scroll)
- [ ] Blurred fix teaser row visible at bottom of card

### Hero Section (375×812 Mobile)
- [ ] Single-column layout — no horizontal overflow
- [ ] URL input prominent and tappable (min 44px height)
- [ ] ExampleScoreCard either hidden or stacked below form
- [ ] CTA button full-width

### Trust Band
- [ ] 3 stat items visible
- [ ] No empty stat labels
- [ ] "30s" or "seconds" stat present

### Seven Signals Section
- [ ] "Seven signals. One score." heading visible
- [ ] All 7 signal chips visible: Crawler Access, Structured Data, Content Structure, LLMs.txt, Technical Health, Citation Signals, Content Quality
- [ ] Clicking a chip expands description (if interactive chips are implemented)

### How It Works (3 Steps)
- [ ] Section present with exactly 3 steps
- [ ] Step 1: Enter URL / Paste URL
- [ ] Step 2: Score in 30 seconds
- [ ] Step 3: Copy-paste fixes
- [ ] NO paragraph copy between steps (just icon + step title)

### Bottom CTA
- [ ] "You've read enough. See your number." heading present
- [ ] URL input functional
- [ ] Consistent with hero form behavior

### Navigation
- [ ] Logo links to /
- [ ] "Pricing" link → /pricing
- [ ] "Sign In" link → /signin
- [ ] NO About, Use Cases, Blog links
- [ ] Mobile: hamburger or simplified nav

### Absent Legacy Sections
- [ ] "Why AI Visibility Matters" — ABSENT
- [ ] Author bio — ABSENT

---

## PRICING PAGE REDESIGN

### Plan Cards (Desktop)
- [ ] 5 cards visible: Free | Starter | Pro | Growth | Agency
- [ ] Prices: $0 | $29 | $49 | $79 | $149
- [ ] Pro card has "Most Popular" badge
- [ ] Agency card has "Contact Us" CTA (not checkout button)
- [ ] Growth card: 500 scans, trend history, scheduled rescans, email alerts
- [ ] Annual billing toggle present

### Comparison Table
- [ ] Row: "Code fixes unlocked" — shows checkmarks for paid tiers
- [ ] Row: "Issue descriptions" — shows checkmarks for paid tiers
- [ ] Agency column: "Custom" or contact-based values

### Mobile Pricing (375px)
- [ ] All 5 plan cards stack vertically
- [ ] No horizontal overflow
- [ ] CTA buttons meet 44px touch target

---

## TOKEN / DESIGN SYSTEM CHECK

⚠️ IMPORTANT: In this codebase `--cyan-400` = RED (#FF2D55)

- [ ] Score ring uses `--brand-lime` or `--success-500` (NOT `--cyan-400`)
- [ ] Link color uses `--violet-400` (NOT `--cyan-400`)
- [ ] Brand red (#FF2D55) appears in accent elements only (not score rings)
- [ ] No teal/cyan colors on score rings or progress bars

---

## PASS CRITERIA

All checked items = ready to deploy.
Any unchecked item = file a bug before deploy.
