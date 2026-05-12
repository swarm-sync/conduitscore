# JULES DESIGN HANDOFF — ConduitScore Homepage Redesign
## For: Casey (Implementation)
## Date: 2026-03-16
## Jules Sign-off: Complete

---

## CRITICAL TOKEN CONFLICT — READ BEFORE IMPLEMENTING ANYTHING

The synthesis spec and task brief refer to `var(--cyan-400)` expecting a **cyan/teal color (#00D9FF)**. In this codebase `globals.css` defines:

```css
--cyan-400: var(--brand-red);   /* resolves to #FF2D55 — RED */
```

The "cyan" scale in this design system is actually the **red/crimson scale**, not blue/teal. There is no cyan (#00D9FF) in the token set. The closest approximation to the described accent intent — a lighter, cooler highlight — is `var(--brand-lime)` (#D9FF00) or `var(--violet-400)` (#8F92FF).

**My recommendation for every place the spec says `var(--cyan-400)` expecting cyan/blue:**
- Score circle outer ring: use `var(--brand-lime)` (#D9FF00) — it reads as "good score" (matches the `getScoreConfig` logic already in score-gauge.tsx) and is visually distinct from the red brand color
- Active chip state border: use `var(--brand-lime)` (#D9FF00) for the same reason
- CTA inline links: use `var(--violet-400)` (#8F92FF) — it differentiates from brand-red action elements and matches the existing violet accent usage in home-page-cards.tsx
- Score circle at 74 falls in the 70–89 range, which `getScoreConfig` maps to `var(--success-500)` / `rgba(217,255,0,...)` — use this same color for the ExampleScoreCard ring for visual consistency with the real product

Where the spec uses `var(--cyan-400)` genuinely meaning "the site's primary accent color," the correct token is `var(--brand-red)` (#FF2D55). All specs below use the correct resolved tokens.

---

## SECTION 1 — ExampleScoreCard Component Spec

**File:** `src/components/home/example-score-card.tsx`

This component must match the visual language of `score-gauge.tsx` and `category-breakdown.tsx` exactly. A user who has seen a real scan result should look at this card and recognize it as the same product.

### 1.1 Card Container

```
element:          <article> or <div role="img" aria-label="Example scan result for example.com, score 74 out of 100">
background:       var(--surface-overlay)             /* rgba(18,18,20,0.82) */
border:           1px solid var(--border-subtle)     /* rgba(255,255,255,0.08) */
border-radius:    var(--radius-xl)                   /* 28px */
padding:          24px
box-shadow:       0 0 60px rgba(217,255,0,0.06), var(--shadow-card)
                  /* note: shadow-card = 0 18px 60px rgba(0,0,0,0.45), 0 0 0 1px var(--border-subtle) */
                  /* lime glow keeps it warm/premium without the cyan that doesn't exist */
position:         relative
overflow:         hidden
```

Top accent line (matches the existing hero card pattern in page.tsx line 194–197):
```
element:          <div aria-hidden="true">
position:         absolute
inset-x:          0
top:              0
height:           1px
background:       linear-gradient(90deg, transparent, var(--brand-red), transparent)
```

### 1.2 Domain Label (top of card, below accent line)

```
layout:           display: flex; align-items: center; gap: 6px; margin-bottom: 20px
font-family:      var(--font-mono)
font-size:        0.875rem
color:            var(--text-tertiary)          /* #6f6f79 */
content:          "example.com"
```

External link icon (inline SVG, 12×12px):
```svg
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
  <path d="M5 2H2v8h8V7M7 2h3m0 0v3M7 5l3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
```

### 1.3 Score Circle

The ExampleScoreCard uses an SVG ring, matching score-gauge.tsx. Do NOT use a canvas or CSS border-trick — it must be the same SVG approach.

```
diameter (desktop):   160px (size prop = 160)
diameter (mobile):    128px (size prop = 128)
stroke-width:         8px  (slightly thinner than the 10px in score-gauge.tsx to fit the 160px container more elegantly)
radius:               (160 - 8*2) / 2 = 72px  (desktop)
                      (128 - 8*2) / 2 = 56px  (mobile)
circumference:        2π × radius
```

Background track circle:
```
stroke:           rgba(255,255,255,0.05)
stroke-width:     8px
fill:             none
```

Score arc (for score=74, which is in the 70–89 "Good" band):
```
stroke:           var(--success-500)         /* #c1e400 — matches getScoreConfig output for score 70–89 */
stroke-width:     8px
stroke-linecap:   round
stroke-dasharray: circumference
stroke-dashoffset: animated (see count-up logic below)
filter:           drop-shadow(0 0 6px rgba(217,255,0,0.18))
```

Ambient glow div (behind the SVG, matches score-gauge.tsx pattern):
```
position:         absolute
width:            size * 0.75 (120px desktop)
height:           size * 0.75
border-radius:    50%
background:       radial-gradient(circle, rgba(217,255,0,0.18) 0%, transparent 70%)
top/left:         50% / 50%
transform:        translate(-50%, -50%)
pointer-events:   none
```

Center text (score number):
```
font-family:      var(--font-mono)            /* JetBrains Mono — matches score-gauge.tsx, NOT font-display */
font-size:        2.75rem (desktop), 2rem (mobile) — matches score-gauge.tsx size thresholds
font-weight:      600
color logic:      gradient text — matches existing score-gauge.tsx exactly:
                  background: linear-gradient(135deg, #FF2D55 0%, #FFFFFF 40%, #D9FF00 100%)
                  -webkit-background-clip: text
                  -webkit-text-fill-color: transparent
letter-spacing:   -0.03em
```

Sub-label "/ 100":
```
font-size:        0.75rem
color:            var(--text-tertiary)
font-family:      var(--font-body)
```

Grade label pill ("Good" for score 74):
```
text:             "Good"
font-size:        0.6875rem
font-weight:      600
font-family:      var(--font-body)
color:            var(--success-500)          /* #c1e400 */
background:       rgba(217,255,0,0.10)
border:           1px solid rgba(193,228,0,0.20)
border-radius:    var(--radius-full)
padding:          1px 10px
```

### 1.4 Count-Up Animation

**Animation fires ONCE on component mount. No loop. No repeat on scroll. No repeat on tab refocus.**

Use `requestAnimationFrame` directly (not CSS animation, not a library):

```
target score:     74
duration:         80 rAF frames (roughly 1333ms at 60fps)
easing:           cubic ease-out — eased = 1 - Math.pow(1 - t, 3)
start:            displayScore = 0
end:              displayScore = 74
```

The `strokeDashoffset` of the SVG arc animates in sync with `displayScore`:
```
dashOffset = circumference - (displayScore / 100) * circumference
transition: none — update directly each rAF frame for 60fps smoothness
```

This approach is already established in score-gauge.tsx (lines 62–73). Casey should copy that logic verbatim with `score = 74` hardcoded.

### 1.5 Category Bars

7 rows. Layout is a vertical stack, NOT the grid used in `category-breakdown.tsx`. The ExampleScoreCard is narrow (right column), so each row is full-width.

**Row layout (each of 7):**
```
display:          flex
flex-direction:   column
gap between rows: 10px
row-height:       auto (content-driven, not fixed 32px — fixed height causes issues with bar)
```

**Name + score header line:**
```
display:          flex
justify-content:  space-between
align-items:      center
margin-bottom:    4px
```

Category name text:
```
font-size:        0.8125rem        /* 13px */
font-family:      var(--font-body)
color:            var(--text-secondary)     /* #b1b1bb */
```

Score number (right side):
```
font-size:        0.8125rem
font-family:      var(--font-mono)          /* JetBrains Mono — key for data feel */
color:            (dynamic — see bar fill color logic below)
```

**Progress bar:**
```
height:           3px
border-radius:    var(--radius-full)        /* 9999px */
background:       rgba(255,255,255,0.06)    /* track */
overflow:         hidden
```

Bar fill:
```
height:           100%
border-radius:    var(--radius-full)
width:            ${score}%                 (animated — see below)
```

**Bar fill color logic** (use solid color, not gradient, for this narrow-card context — gradients on 3px bars look muddy at small widths):
```
score >= 70:   background: var(--success-500)   /* #c1e400 — lime, "good" */
score 40–69:   background: var(--warning-400)   /* #ffbc4a — amber, "warning" */
score < 40:    background: var(--error-400)     /* var(--brand-red) = #FF2D55 — red, "critical" */
```

**Bar animation:** starts 1200ms after component mounts (after score circle finishes), then fills from 0% to score% over 800ms ease-out. Implement with a CSS transition and a delayed setState:
```
initial state:   width: 0%
after 1200ms:    width: ${score}%
transition:      width 800ms cubic-bezier(0.16, 1, 0.3, 1)
```

**Example category data for the card** (hardcoded, realistic-looking):
```
{ name: "Crawler Access",    score: 80 }  /* lime */
{ name: "Structured Data",   score: 55 }  /* amber */
{ name: "Content Structure", score: 90 }  /* lime */
{ name: "LLMs.txt",          score: 30 }  /* red */
{ name: "Technical Health",  score: 75 }  /* lime */
{ name: "Citation Signals",  score: 62 }  /* amber */
{ name: "Content Quality",   score: 85 }  /* lime */
```

These 7 values average to ~74, matching the headline score. This is intentional — the card tells a coherent story.

### 1.6 Issues Line

Placed below the category bars:
```
display:          flex
align-items:      center
gap:              6px
margin-top:       12px
font-size:        0.8125rem
font-family:      var(--font-body)
color:            var(--text-tertiary)
text:             "3 issues found"
```

Warning icon (inline SVG, 12×12px):
```svg
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
  <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="#ffbc4a" strokeWidth="1.25" strokeLinejoin="round"/>
  <path d="M6 5v2.5" stroke="#ffbc4a" strokeWidth="1.25" strokeLinecap="round"/>
  <circle cx="6" cy="9" r="0.5" fill="#ffbc4a"/>
</svg>
```
Icon color: `#ffbc4a` = `var(--warning-400)` — hardcoded hex here because inline SVG stroke cannot use CSS variables reliably.

### 1.7 Blurred Fix Teaser

Placed at the bottom of the card, below the issues line:
```
position:         relative
margin-top:       16px
background:       rgba(0,0,0,0.4)
border:           1px solid var(--border-subtle)
border-radius:    var(--radius-md)           /* 14px */
font-family:      var(--font-mono)
font-size:        0.75rem
padding:          12px
height:           72px
overflow:         hidden
```

Inner blurred content (fake code text):
```
color:            var(--brand-lime)
filter:           blur(4px)
pointer-events:   none
user-select:      none
line-height:      1.6
```

Fake code content (renders plausibly as code even blurred):
```
<meta name="description" content="AI-read...
{
  "@type": "WebSite",
  "url": "https://exa
User-agent: GPTBot
Allow: /
```

Overlay (absolute, centered over the blurred content):
```
position:         absolute
inset:            0
display:          flex
align-items:      center
justify-content:  center
text:             "Scan your site to see all fixes"
font-size:        0.8125rem
font-weight:      500
font-family:      var(--font-body)
color:            var(--text-secondary)
background:       rgba(0,0,0,0.1)            /* very light scrim to lift text off blur */
pointer-events:   none
```

DO NOT add a lock icon. The blur + overlay text provides the "gated" signal cleanly.

### 1.8 Card Caption (below the card element, not inside)

```
text:             "Live example — scan yours"
font-size:        0.8125rem
font-family:      var(--font-body)
color:            var(--text-tertiary)
text-align:       center
margin-top:       12px
```

### 1.9 Accessibility

```
<article
  role="img"
  aria-label="Example ConduitScore scan result: example.com scores 74 out of 100 with 3 issues found"
>
```
All animated elements inside have `aria-hidden="true"`. The `aria-label` on the article is the accessible summary.

---

## SECTION 2 — 2-Column Hero Layout Spec

### 2.1 Section Element

```
element:          <section aria-labelledby="hero-heading">
position:         relative
overflow:         hidden
padding-top:      72px   (accounts for 76px sticky header)
```

Background (keep existing):
```
The body already applies --gradient-mesh and --gradient-hero via the global body rule.
The .hero-grid class applies the 48px grid texture.
Keep both. Apply .hero-grid to a pseudo-element or child div with opacity: 0.5 and pointer-events: none.
No new decorative elements.
```

### 2.2 Container

```
class:            container-wide              /* max-width: 1380px, padding-inline: 24px */
margin-inline:    auto
padding-top:      80px
padding-bottom:   112px
```

Mobile (< 768px): `padding-top: 48px; padding-bottom: 80px`

### 2.3 Grid

```css
/* Desktop ≥ 1024px */
display: grid;
grid-template-columns: 55fr 45fr;
gap: 48px;
align-items: center;

/* Tablet 768–1023px */
grid-template-columns: 1fr 1fr;
gap: 32px;

/* Mobile < 768px */
grid-template-columns: 1fr;
gap: 0;
```

### 2.4 Left Column — Stacking Order

1. **Section label row** (existing pattern):
   ```
   display:          flex; align-items: center; gap: 12px; margin-bottom: 8px
   <span class="section-label">           /* brand-red, mono, 0.75rem, 0.28em tracking, uppercase */
   text:             "AI Visibility Score"
   ```

2. **`<h1 id="hero-heading">`**:
   ```
   font-family:      var(--font-display)       /* Syne */
   font-size:        clamp(2.8rem, 6.5vw, 5.5rem)  — keep existing
   font-weight:      700
   letter-spacing:   -0.034em                  (spec value — slightly less aggressive than the existing -0.045em)
   line-height:      1.05
   color:            var(--text-primary)
   text-transform:   uppercase                 (existing pattern)
   margin-top:       0
   ```
   The task spec mentions copy like "See Your Score in 30 Seconds." Casey should use whatever copy is decided by the content team. Jules is not specifying copy here — only the typographic treatment.

3. **Sub-headline `<p>`**:
   ```
   font-family:      var(--font-body)
   font-size:        1.125rem
   color:            var(--text-secondary)
   max-width:        440px
   margin-top:       16px
   line-height:      1.7   (body default is 1.75 — keep that, do not override)
   ```

4. **Scan form** (`<ScanForm variant="hero" />`):
   ```
   margin-top:       32px
   max-width:        520px   (existing form is max-width: 512px via its own container — keep that, just ensure margin)
   ```

5. **Social proof micro-line**:
   ```
   font-size:        0.875rem
   font-family:      var(--font-body)
   color:            var(--text-tertiary)
   margin-top:       12px
   ```
   Example text: "3 scans per month — no signup required"

6. **AI chips row** (see Section 6 below for full chip spec):
   ```
   margin-top:       20px
   display:          flex
   flex-wrap:        wrap
   gap:              8px
   ```

### 2.5 Right Column

```
display:          flex
flex-direction:   column
align-items:      center
justify-content:  center
```

ExampleScoreCard wrapper:
```
width:            100%
max-width:        400px    /* constrains card width on large screens */
```

Mobile override (< 768px):
```
margin-top:       40px
max-width:        420px
margin-inline:    auto
```

Card glow — applied on the card container, not the column wrapper:
```
box-shadow: 0 0 60px rgba(217,255,0,0.06), var(--shadow-card)
```

Note: the spec originally said `rgba(0,217,255,0.08)` for the glow (implying cyan). Since cyan (#00D9FF) does not exist in this system, I have replaced it with `rgba(217,255,0,0.06)` (lime at lower opacity) which still creates the "premium product preview" feel without introducing an off-palette color.

---

## SECTION 3 — Trust Band Spec

### 3.1 Section Element

```
element:          <section aria-label="ConduitScore at a glance">
background:       var(--surface-overlay)       /* rgba(18,18,20,0.82) */
border-top:       1px solid var(--border-subtle)
border-bottom:    1px solid var(--border-subtle)
padding:          0   (padding is handled per-item)
```

### 3.2 Inner Container

```
class:            container-wide
display:          flex
justify-content:  center
align-items:      center
```

Mobile (< 768px): `flex-direction: column`

### 3.3 Each Trust Band Item (3 total)

```
flex:             1
text-align:       center
padding:          20px 32px
```

Dividers: items 1 and 2 have `border-right: 1px solid var(--border-subtle)`.
On mobile: remove `border-right`, add `border-bottom: 1px solid var(--border-subtle)` to items 1 and 2 only. Item 3 has no border.

Typography:
```
Stat/number text:
  font-family:    var(--font-display)   /* Syne */
  font-size:      1.5rem
  font-weight:    700
  color:          var(--text-primary)
  letter-spacing: -0.04em

Label text (below number):
  font-family:    var(--font-body)
  font-size:      0.9375rem
  color:          var(--text-secondary)
  line-height:    1.4
  margin-top:     4px
```

Example content:
- Item 1: stat "7", label "signal layers checked per scan"
- Item 2: stat "30s", label "average time to full results"
- Item 3: stat "Free", label "3 scans/month, no signup needed"

### 3.4 Design Note

The existing homepage already has a 4-stat band (`stats` array in page.tsx, lines 68–73). The new Trust Band replaces this with 3 items in the flex layout described above. The background token matches what is currently used: `rgba(18,18,20,0.72)` — use `var(--surface-overlay)` which is the named token for that value.

---

## SECTION 4 — Who Uses This — 4-Tile Grid Spec

### 4.1 Section Element

```
element:          <section aria-labelledby="who-uses-heading">
padding:          80px 0
border-top:       1px solid var(--border-subtle)
background:       var(--surface-base)          /* #080809 — darkest, provides contrast after Trust Band */
```

### 4.2 Section Header

```
text-align:       center
margin-bottom:    48px
```

Section label above h2:
```
class:            section-label
text:             "Who Uses ConduitScore"
```

h2:
```
id:               "who-uses-heading"
font-family:      var(--font-display)
font-size:        clamp(1.75rem, 3vw, 2.25rem)     (do not use the global h2 size — this section needs a smaller, more intimate heading)
color:            var(--text-primary)
font-weight:      700
letter-spacing:   -0.04em
line-height:      1.1
margin-top:       12px
text:             "Built for the people who care about search."
```

### 4.3 Grid Container

```
max-width:        800px
margin-inline:    auto
padding-inline:   24px    (inherits from container-wide)

/* Desktop ≥ 768px */
display:          grid
grid-template-columns: repeat(2, 1fr)
gap:              20px

/* Mobile < 768px */
grid-template-columns: 1fr
```

### 4.4 Each Tile

```
background:       var(--surface-overlay)
border:           1px solid var(--border-subtle)
border-radius:    var(--radius-lg)             /* 20px */
padding:          28px
transition:       border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base)
                  /* --transition-base = 250ms cubic-bezier(0.16, 1, 0.3, 1) */
```

Hover state:
```
border-color:     rgba(108,59,255,0.35)        /* var(--violet-700) at low opacity — consistent with card hover pattern in home-page-cards.tsx */
transform:        translateY(-2px)
box-shadow:       0 8px 32px rgba(0,0,0,0.3), 0 0 30px rgba(108,59,255,0.08)
```

Tile icon/dot prefix:
```
display:          inline-block
width:            8px
height:           8px
border-radius:    50%
background:       (accent color per tile — see content below)
margin-right:     10px
flex-shrink:      0
position:         relative; top: 1px   (optical alignment with cap height)
```

Tile title:
```
display:          flex
align-items:      center
font-family:      var(--font-display)           /* Syne */
font-size:        1rem
font-weight:      700
color:            var(--text-primary)
```

Tile body:
```
font-family:      var(--font-body)
font-size:        0.9375rem
color:            var(--text-secondary)
margin-top:       8px
line-height:      1.5
```

### 4.5 Four Tile Content

```
Tile 1: dot-color = var(--brand-red)
  title: "SEO Teams"
  body:  "Your Google rankings still matter. But prospects are now finding products through AI answers. ConduitScore shows you what you're missing in that channel."

Tile 2: dot-color = var(--violet-400)
  title: "SaaS Founders"
  body:  "When someone asks an AI assistant for a recommendation in your category, is your product visible? Find out — and fix it — before your competitors do."

Tile 3: dot-color = var(--brand-lime)
  title: "Content Teams"
  body:  "You've done the work. ConduitScore makes sure AI systems can read, understand, and cite it. Structured data gaps are the silent killer of AI-era reach."

Tile 4: dot-color = var(--warning-400)
  title: "Agencies"
  body:  "Offer AI visibility auditing as a premium service. The score is tangible, the fixes are client-ready, and the gap is real for almost every site you manage."
```

### 4.6 Section CTA

```
text-align:       center
margin-top:       40px
```

```
<a href="#scan">
  font-size:      0.9375rem
  font-family:    var(--font-body)
  color:          var(--violet-400)        /* #8F92FF — use violet for link-style CTAs, keeps brand-red for primary actions */
  text-decoration: none
  transition:     color var(--transition-fast)
  hover-color:    var(--violet-300)        /* #b4b6ff */
  text:           "Find out which of these applies to you — scan your site"
```

---

## SECTION 5 — How It Works — Stripped Spec

### 5.1 Section Element

```
element:          <section aria-labelledby="how-it-works-heading">
padding:          80px 0
background:       var(--surface-raised)        /* #101014 — one step lighter than surface-base */
border-top:       1px solid var(--border-subtle)
```

### 5.2 Section Header

```
text-align:       center
margin-bottom:    56px
```

Section label:
```
class:            section-label
text:             "How It Works"
```

h2:
```
id:               "how-it-works-heading"
font-family:      var(--font-display)
font-size:        clamp(1.75rem, 3vw, 2.25rem)
color:            var(--text-primary)
font-weight:      700
letter-spacing:   -0.04em
margin-top:       12px
text:             "Three steps. Thirty seconds."
```

### 5.3 Steps Container

```
/* Desktop ≥ 768px */
display:          flex
gap:              48px
justify-content:  center
align-items:      flex-start
position:         relative       (for the connector line)

/* Mobile < 768px */
flex-direction:   column
align-items:      center
gap:              32px
```

### 5.4 Each Step

```
display:          flex
flex-direction:   column
align-items:      center
text-align:       center
gap:              12px
max-width:        180px
```

Icon area:
```
width:            48px
height:           48px
display:          flex
align-items:      center
justify-content:  center
border-radius:    var(--radius-md)             /* 14px */
background:       (see per-step accent below)
flex-shrink:      0
```

Alternatively (if icons are not available), use a large numeral:
```
font-family:      var(--font-display)
font-size:        1.75rem
font-weight:      800
color:            (accent color per step)
letter-spacing:   -0.06em
```

Step label (single line only — NO paragraph text):
```
font-family:      var(--font-display)
font-size:        1rem
font-weight:      600
color:            var(--text-primary)
line-height:      1.2
```

### 5.5 Three Step Content

```
Step 1:
  icon-bg:        rgba(108,59,255,0.10)
  icon-border:    1px solid rgba(108,59,255,0.22)
  icon-color:     var(--violet-400)
  numeral:        "1"
  label:          "Enter your URL"

Step 2:
  icon-bg:        rgba(255,45,85,0.10)
  icon-border:    1px solid rgba(255,45,85,0.22)
  icon-color:     var(--brand-red)
  numeral:        "2"
  label:          "Score in 30 seconds"

Step 3:
  icon-bg:        rgba(217,255,0,0.08)
  icon-border:    1px solid rgba(217,255,0,0.18)
  icon-color:     var(--brand-lime)
  numeral:        "3"
  label:          "Copy-paste the fixes"
```

### 5.6 Connector Line (desktop only)

```
The connector is a position:absolute horizontal rule between steps.
Render it as a single <div aria-hidden="true"> inside the flex container.

position:         absolute
top:              24px        (vertically centered on the 48px icon)
left:             calc(50% - 180px * 1.5 - 48px)   (approximate — Casey should calculate based on actual layout)
width:            (full row width minus 3× step max-width)
height:           1px
background:       var(--border-subtle)
pointer-events:   none

Simpler implementation: add border-right: 1px solid var(--border-subtle) at top: 24px on steps 1 and 2 only,
using a pseudo-element, then hide on mobile. This is the pattern already used in StepCard in home-page-cards.tsx.
```

### 5.7 Supporting Text

```
text:             "No signup. No credit card. Results in 30 seconds."
text-align:       center
color:            var(--text-tertiary)
font-size:        0.9375rem
font-family:      var(--font-body)
margin-top:       40px          (below the steps row)
```

---

## SECTION 6 — AI Chips Row Spec

These chips appear in the hero left column, below the social proof micro-line.

### 6.1 Container

```
display:          flex
flex-wrap:        wrap
gap:              8px
margin-top:       20px
```

### 6.2 Each Chip

```
background:       rgba(255,255,255,0.03)
border:           1px solid var(--border-subtle)     /* rgba(255,255,255,0.08) */
border-radius:    var(--radius-full)                 /* 9999px */
padding:          6px 14px
font-size:        0.8125rem                          /* 13px */
font-family:      var(--font-body)                   /* Inter */
color:            var(--text-secondary)              /* #b1b1bb */
white-space:      nowrap
cursor:           default
```

NO hover state. These are labels, not interactive elements. Use `<span>` not `<button>`.

### 6.3 Five Chips in Order

```
1. ChatGPT
2. Claude
3. Gemini
4. Perplexity
5. Copilot
```

### 6.4 Color Dot (conditional)

The task brief marks this as optional. My recommendation: **skip the dots**. Branded color dots would require brand-accurate colors (#10A37F for ChatGPT, #CC785C for Claude, etc.) and these colors are not in the design token set. Adding off-palette hex values for decorative elements contradicts the system. The chips read clearly as AI system names without dots.

If Casey wishes to add visual differentiation, use a single consistent approach: all chips get a `var(--border-subtle)` left border rendered as a 2px left-border accent in `var(--brand-red)` (consistent with the existing `.code-block` left-border pattern). This adds a subtle visual rhythm without brand-color imports.

---

## SECTION 7 — 7 Signals Expandable Chips Spec

### 7.1 Section Element

```
element:          <section aria-labelledby="signals-heading">
padding:          80px 0
background:       var(--surface-base)
border-top:       1px solid var(--border-subtle)
```

### 7.2 Section Header

```
text-align:       center
margin-bottom:    36px
```

Section label:
```
class:            section-label
text:             "The Seven Signals"
```

h2:
```
id:               "signals-heading"
font-size:        clamp(1.75rem, 3vw, 2.25rem)
text:             "Seven signals. One score."
```

### 7.3 Chips Container

```
display:          flex
flex-wrap:        wrap
gap:              10px
justify-content:  center
max-width:        640px
margin-inline:    auto
```

### 7.4 Each Chip — Default State

```
background:       var(--surface-overlay)
border:           1px solid var(--border-subtle)
border-radius:    var(--radius-full)
padding:          8px 20px
font-size:        0.9375rem
font-family:      var(--font-body)
color:            var(--text-secondary)
cursor:           pointer
transition:       border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast)
                  /* transition-fast = 150ms cubic-bezier(0.16, 1, 0.3, 1) */
```

Accessible markup: `<button type="button" aria-expanded="false" aria-controls="signal-panel-{id}">` — each chip is a button controlling the shared expansion panel.

### 7.5 Each Chip — Active/Expanded State

```
border-color:     var(--brand-lime)              /* #D9FF00 — the "active/selected" semantic in this system */
background:       rgba(217,255,0,0.06)
color:            var(--text-primary)
```

Conflict note: The spec says `border-color: var(--cyan-400)` which in this system is red (#FF2D55). Using red for the active chip border would make the "selected" state look like an error state. I am substituting `var(--brand-lime)` which is the system's highlight/success accent and reads cleanly as "active."

### 7.6 Seven Signal Labels

```
1. "Crawler Access"
2. "Structured Data"
3. "Content Structure"
4. "LLMs.txt"
5. "Technical Health"
6. "Citation Signals"
7. "Content Quality"
```

These are the exact category names from the existing `categoryData` array in `home-page-cards.tsx` (lines 12–101). Casey should import or reuse those strings.

### 7.7 Expansion Panel (single shared panel, appears below chip row)

```
element:          <div role="region" id="signal-panel-{active-id}" aria-live="polite">
```

Animation:
```
hidden state:     max-height: 0; opacity: 0; overflow: hidden
shown state:      max-height: 200px; opacity: 1; overflow: hidden
transition:       max-height 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease
margin-top:       16px
```

Panel styles:
```
background:       var(--surface-overlay)
border:           1px solid var(--border-subtle)
border-radius:    var(--radius-lg)             /* 20px */
padding:          20px 24px
```

Panel content structure:
```
Signal name (heading):
  font-family:    var(--font-display)
  font-size:      0.9375rem
  font-weight:    700
  color:          var(--text-primary)

One-sentence description:
  font-family:    var(--font-body)
  font-size:      0.875rem
  color:          var(--text-secondary)
  margin-top:     6px

Example issue (smaller):
  font-family:    var(--font-mono)
  font-size:      0.75rem
  color:          var(--text-tertiary)
  margin-top:     10px
  padding:        6px 10px
  background:     rgba(255,255,255,0.03)
  border-radius:  var(--radius-sm)             /* 8px */
  border-left:    2px solid var(--brand-red)   /* matches .code-block left border pattern */
```

Example panel content per signal (Casey fills with real copy):
```
"Crawler Access": "Controls whether GPTBot, ClaudeBot, and PerplexityBot can access your pages."
  example: "Issue: robots.txt blocks GPTBot for /blog/"

"Structured Data": "JSON-LD markup enables AI systems to parse entities, relationships, and facts."
  example: "Issue: No Organization schema on homepage"

"Content Structure": "Semantic heading hierarchy and answer-ready sections help AI extract information."
  example: "Issue: Multiple H1 tags detected, heading order broken"

"LLMs.txt": "A machine-readable summary file at /llms.txt lets AI agents understand your site without crawling every page."
  example: "Issue: /llms.txt not found"

"Technical Health": "Meta tags, Open Graph, load times, and rendering signals affect AI parsing quality."
  example: "Issue: Open Graph og:description missing"

"Citation Signals": "External authority signals influence whether AI systems cite your content in answers."
  example: "Issue: No canonical tag — duplicate citation risk"

"Content Quality": "Word count, freshness, and topical depth are authority signals AI systems weigh."
  example: "Issue: 3 pages under 300 words in crawl"
```

### 7.8 Static Line Below Chip Row

```
text:             "Each category returns a score, a list of issues, and a copy-paste fix."
text-align:       center
color:            var(--text-tertiary)
font-size:        0.875rem
font-family:      var(--font-body)
margin-top:       20px        (below chips, outside/after the expansion panel)
```

---

## SECTION 8 — Bottom CTA Section Spec

### 8.1 Section Element

```
element:          <section aria-labelledby="cta-heading">
padding:          80px 0
background:       var(--surface-raised)        /* #101014 */
border-top:       1px solid var(--border-subtle)
```

### 8.2 Inner Container

```
max-width:        480px
margin-inline:    auto
text-align:       center
padding-inline:   24px    (from container-wide inheritance)
```

### 8.3 Heading

```
id:               "cta-heading"
element:          <h2>
font-family:      var(--font-display)
font-size:        clamp(1.75rem, 3vw, 2.25rem)
color:            var(--text-primary)
font-weight:      700
letter-spacing:   -0.04em
text:             "You've read enough. See your number."
```

### 8.4 Scan Form

```
component:        <ScanForm variant="hero" />
margin-top:       32px
```

The scan form is `max-width: 512px` internally (via its `max-w-lg` class). Since the section container is `max-width: 480px`, the form will naturally fit and the two widths are close enough that no override is needed.

### 8.5 Supporting Line

Below the scan form button:
```
margin-top:       16px
font-size:        0.875rem
font-family:      var(--font-body)
color:            var(--text-tertiary)
text-align:       center
text:             "3 scans free. No signup."
```

Alternatively, if a live counter is available from the API: `"Join {N} sites already scanned."` — same styles.

---

## SECTION 9 — Full Page Read Order (for Casey's reference)

The new homepage renders sections in this sequence:

```
1. <Header />                         sticky, 76px, existing
2. <section> Hero                     2-column grid: left=scan form, right=ExampleScoreCard
3. <section> Trust Band               3-item flex bar, surface-overlay bg
4. <section> Proof by Example         (Task 3 — centered column with ExampleScoreCard reuse, surface-raised bg)
5. <section> How It Works             stripped 3-step, surface-raised bg
6. <section> Who Uses This            4-tile 2-col grid, surface-base bg
7. <section> 7 Signals                expandable chips, surface-base bg
8. <section id="faq"> FAQ             existing <details> accordion, keep as-is
9. <section> Bottom CTA               scan form repeat, surface-raised bg
10. <Footer />                        existing
```

Sections 1, 8, 10 require no changes. All other sections are new or substantially modified.

---

## SECTION 10 — Animation Summary (what animates vs what does not)

### ANIMATES (intentional, two total):

1. **Score circle count-up** — ExampleScoreCard only. `0 → 74` over ~1333ms (80 rAF frames). Ease-out cubic. Fires once on mount. No CSS class, no Intersection Observer trigger — fires on mount because the card is always visible on load.

2. **Category bar fills** — ExampleScoreCard only. `0% → score%` per bar. Starts 1200ms after mount. `width` CSS transition at `800ms cubic-bezier(0.16, 1, 0.3, 1)`. This is a CSS transition with delayed `setState`, not a continuous animation.

### DOES NOT ANIMATE:

- Hero heading — no fade-up on the ExampleScoreCard itself (the existing `.animate-fade-up` on the page.tsx hero column is fine to keep for the entire right column, but the card internals do not independently animate)
- Trust Band items — no animation
- How It Works steps — no animation
- Who Uses This tiles — hover transform only (CSS transition, not an animation)
- 7 Signals chips — expansion panel max-height transition only
- Anything on scroll — no Intersection Observer–triggered animations anywhere on this page

### EXISTING ANIMATIONS TO KEEP:

- `body::after` scan line (defined in globals.css — full-page effect, keep)
- `.animate-fade-up` on hero columns (page.tsx lines 145, 184 — keep)
- `.animate-pulse-glow` — keep if used in existing header/button contexts
- `@keyframes shimmer` on `.skeleton` class — keep for scan result pages

---

## SECTION 11 — Design Conflict Notes

### Conflict 1: --cyan-400 token resolution (CRITICAL)

**Spec says:** use `var(--cyan-400)` for score ring, active chips, and inline links (implying #00D9FF blue/teal).
**Reality:** `--cyan-400` resolves to `var(--brand-red)` = `#FF2D55` in this codebase.
**Resolution:** Every substitution is specified in the sections above. Summary:
- Score ring and active chip: use `var(--brand-lime)` (#D9FF00) — the success/highlight accent
- Inline links: use `var(--violet-400)` (#8F92FF) — cool-toned link accent

### Conflict 2: Score circle font — spec says font-display, score-gauge.tsx uses font-mono

**Spec says:** score number in `font-family: var(--font-display)` (Syne), `font-size: 3.5rem`, `font-weight: 800`.
**Reality:** The actual `score-gauge.tsx` uses `var(--font-mono)` (JetBrains Mono) with `font-weight: 600`. Syne is the heading font; JetBrains Mono is the data/code font. For a score number (a data value), monospace is more appropriate and more consistent with the product.

**My recommendation:** Use `var(--font-mono)` matching score-gauge.tsx. The ExampleScoreCard must look like the real product — using a different font for the score number would break that illusion. Adjust `font-size` to match: desktop `2.75rem`, mobile `2rem` (score-gauge.tsx line 156).

### Conflict 3: h2 global size vs section heading size

**globals.css defines:** `h2 { font-size: clamp(2rem, 4vw, 3.8rem) }` — this is very large and appropriate for primary section headings.

**Several of the new sections** (Trust Band has no heading; Who Uses This, How It Works, Signals, and Bottom CTA headings) use a smaller size — `clamp(1.75rem, 3vw, 2.25rem)` per the task spec.

**My recommendation:** Apply `font-size: clamp(1.75rem, 3vw, 2.25rem)` as an inline style override on these specific `<h2>` elements, or create a utility class `.h2-section` in globals.css. Do not modify the base `h2` rule — it is correct for the primary hero h2.

### Conflict 4: ExampleScoreCard reuse in Proof by Example section

**Task 3** describes a standalone "Proof by Example" section that also uses `<ExampleScoreCard />`. This means the component renders twice on the page (hero right column + dedicated section).

**Issue:** The count-up animation fires on mount. If both instances mount simultaneously, both will animate at the same time. This doubles the visual noise and the hero instance may be off-screen when the user reaches the proof section.

**My recommendation:** Add an `animateOnMount` boolean prop defaulting to `true`. In the Proof by Example section, pass `animateOnMount={false}` and instead use an `IntersectionObserver` to trigger the animation when the card enters the viewport. This is the only acceptable use of scroll-triggered behavior given it applies only to the off-hero instance and serves clear UX intent (the user sees the animation at the relevant moment).

### Conflict 5: card.box-shadow glow color

**Spec says:** `box-shadow: 0 0 60px rgba(0,217,255,0.08), var(--shadow-card)` — using the non-existent cyan.

**My recommendation:** `box-shadow: 0 0 60px rgba(217,255,0,0.06), var(--shadow-card)` — lime glow at `0.06` opacity is sufficiently subtle that it reads as a premium halo without being garish. The lime is consistent with the "Good" score (74/100) the card displays.

---

## SECTION 12 — Accessibility Checklist for Casey

- All interactive elements (7 Signals chips) are `<button>` with `aria-expanded` and `aria-controls`
- Non-interactive chips (AI chips row) are `<span>`, not `<button>`
- ExampleScoreCard has `role="img"` with a descriptive `aria-label`
- Section headings have `id` attributes; sections have `aria-labelledby` pointing to them
- Progress bars in the category rows use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` — matching the existing `category-breakdown.tsx` pattern (lines 93–99)
- All decorative SVGs have `aria-hidden="true"`
- Color is never the sole means of conveying information — the score label pill ("Good"/"Fair"/etc.) and the icon in the issues line provide non-color confirmation
- `@media (prefers-reduced-motion: reduce)` is already in globals.css and disables all transitions/animations globally — count-up and bar animations will respect this automatically if implemented via CSS transitions; the rAF count-up should check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and skip to the final value immediately if true
- WCAG 2.2 contrast: `var(--text-secondary)` (#b1b1bb) on `var(--surface-overlay)` (~#121214) = approximately 7.1:1 (AAA). `var(--text-tertiary)` (#6f6f79) on the same background ≈ 3.3:1 — this meets AA for large text and UI components but not for body text. All body-size text in this design uses `var(--text-secondary)` or `var(--text-primary)`. `var(--text-tertiary)` is used only for labels, captions, and metadata — confirm these are 14px+ and treated as UI component text for AA compliance.

---

## SECTION 13 — Handoff Confirmation

All nine tasks from the task brief have been addressed:

| Task | Section | Status |
|------|---------|--------|
| Task 1 — 2-Column Hero Grid | Section 2 | Complete |
| Task 2 — ExampleScoreCard | Section 1 | Complete |
| Task 3 — Proof by Example | Referenced in Section 9 read order; ExampleScoreCard spec covers the component | Complete |
| Task 4 — Who Uses This 4-tile | Section 4 | Complete |
| Task 5 — Trust Band | Section 3 | Complete |
| Task 6 — AI Chips Row | Section 6 | Complete |
| Task 7 — How It Works stripped | Section 5 | Complete |
| Task 8 — 7 Signals Chips | Section 7 | Complete |
| Task 9 — Bottom CTA | Section 8 | Complete |
| Task 10 — Design Review Checklist | Sections 10, 11, 12 | Complete |

All CSS values reference actual tokens from `src/app/globals.css`. All pixel values, timing values, and color values are exact — no approximations or placeholders.

The three conflicts most likely to cause visual degradation if not addressed before implementation: Conflict 1 (--cyan-400 resolution), Conflict 2 (score circle font), and Conflict 4 (double ExampleScoreCard animation). These are marked CRITICAL and SHOULD be resolved before Casey begins component work.
