# ConduitScore — Design Rebuild via Ralph Loop

You are rebuilding the visual design and front-end UI of ConduitScore to match the approved design system and creative direction. The functional backend (API routes, DB, auth, Stripe) is COMPLETE and must NOT be touched. You are only updating the visual layer: components, pages, CSS/Tailwind, and animations.

---

## 1. WHAT EXISTS (DO NOT BREAK)

All API routes in `src/app/api/` are complete and working.
All database schema in `prisma/` is complete.
Auth via NextAuth is complete.
Stripe integration is complete.
14 unit tests must continue passing: `npm test`.
TypeScript must compile: `npm run typecheck`.
Build must succeed: `npm run build`.

**SCOREBOARD COMMAND**: `npm run typecheck && npm test && npm run build`

---

## 2. DESIGN IDENTITY — "THE SPECTRAL AUDIT"

### Core Concept
"Visibility Beyond the Visible." The tool is a scientific instrument. It should feel dark, precise, and high-fidelity — like a thermal imaging scanner or a professional audio spectrum analyzer.

### Color Palette (EXACT HEX VALUES — USE THESE)
```css
:root {
  --bg: #080809;              /* Obsidian — page background */
  --surface: #121214;         /* Elevated surfaces, cards */
  --surface-elevated: #1a1a1d; /* Modals, dropdowns */
  --primary: #FF2D55;         /* Spectra Red — danger, low-score */
  --secondary: #6366F1;       /* Neural Purple — intelligence, links */
  --accent: #D9FF00;          /* Cyber Lime — optimized, success */
  --text-main: #FFFFFF;
  --text-muted: #88888D;
  --border: rgba(255, 255, 255, 0.08);
  --glass: rgba(20, 20, 22, 0.7);
  --glass-border: rgba(255, 45, 85, 0.2);
}
```

### Score Tier Colors
- 90-100: `#D9FF00` (Cyber Lime — Excellent)
- 70-89: `#6366F1` (Neural Purple — Good)
- 40-69: `#F59E0B` (Amber — Caution)
- 0-39: `#FF2D55` (Spectra Red — Poor)

### Typography (Google Fonts — already imported or add to layout.tsx)
- **Display/Headings**: `Syne` — weights 700, 800 (tight negative letter-spacing: -2% to -3%)
- **Body**: `Inter` — weights 400, 500, 600
- **Technical/Code/Scores**: `JetBrains Mono` — weights 400, 700

### Type Scale
- H1: 72px (mobile: 40px) — Syne 800, tracking -2%
- H2: 48px (mobile: 32px) — Syne 700, tracking -1%
- H3: 30px — Syne 700
- Body: 16-18px — Inter 400
- Mono data: 14px — JetBrains Mono 700
- Score display: 96px — JetBrains Mono 700

---

## 3. SIGNATURE DESIGN ELEMENTS

### Background
- Fixed blueprint grid: subtle 40px grid lines at 4% opacity white
- Scanning laser: a 2px vertical or horizontal line that sweeps across the background continuously
- No plain white/light backgrounds anywhere on the site

```css
.bg-grid {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}
```

### Score Gauge (Central Hero Component)
SVG circular gauge:
- 240px diameter (mobile: 180px)
- 12px stroke track in `rgba(255,255,255,0.1)`
- 12px progress stroke in score-tier color, rounded linecap
- Center: score number in JetBrains Mono 700 96px + "/ 100" in muted
- Label: "AI VISIBILITY SCORE" below in JetBrains Mono caption
- Animation: stroke draws from 0% to score% over 1.8s with elastic easing
- Count-up animation on the number (0 → target over 1.8s)

```js
// Score count-up
function animateScore(element, targetScore) {
  let current = 0;
  const duration = 1800;
  const increment = targetScore / (duration / 16);
  const timer = setInterval(() => {
    current = Math.min(current + increment, targetScore);
    element.textContent = Math.round(current);
    if (current >= targetScore) clearInterval(timer);
  }, 16);
}
```

### Glassmorphism Cards
```css
.glass-card {
  background: var(--glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}
```

### Signal Bars (below score gauge)
- 7 vertical bars, 8px wide, max 48px height, 4px gap
- Each bar: tier color if passing, `rgba(255,255,255,0.1)` if failing
- Animate: fill bottom-to-top sequentially, 0.15s stagger after score reveals

---

## 4. PAGE-BY-PAGE SPECS

### A. Landing Page (`src/app/page.tsx` + `src/app/(landing)/`)

**Hero Section** (70/30 asymmetric split):
- Left 70%:
  - Large H1: "IS YOUR WEBSITE\nINVISIBLE TO AI?" in Syne 800, 72px, white
  - Subhead in Inter 400 18px muted: "ConduitScore scans your site and shows what ChatGPT, Perplexity, and Claude can see — then gives you the code to fix it."
  - URL input (64px height, JetBrains Mono, dark surface bg) + "SCAN FREE" button inline (Spectra Red bg, white Syne 700 text)
  - Trust row: "No signup required · Results in 30 seconds · 2,400+ sites scanned"
- Right 30%:
  - The Score Gauge demo showing "34" (low score) pulsing into life
  - Signal bars below pulsing in sequence

**Section 2 — "What We Scan"** (6 feature cards in 3×2 grid):
Cards must be glassmorphism style. Each card:
- Icon: 40px, Cyber Lime or Neural Purple
- Title: Syne 700, 20px, white
- Body: Inter 400, 14px, muted
Features: Crawler Access, Structured Data, Content Structure, LLMs.txt, Technical Health, Citation Signals

**Section 3 — "How It Works"** (3-step vertical timeline):
Alternating left/right asymmetric layout (step 1 left 70%, step 2 right 70%, step 3 left 70%)
Step numbers: 64px circles, Neural Purple bg, JetBrains Mono 700
Steps: "Enter Your URL" / "Get Your Score" / "Copy-Paste Fixes"

**Section 4 — Pricing** (3 cards, staggered heights):
- Free: surface bg, muted border
- Starter $29/mo: Neural Purple border accent
- Pro $79/mo: Spectra Red bg, elevated 24px, "MOST POPULAR" badge
- Agency $149/mo: Cyber Lime border accent
Features per tier from WINNER_SPEC.md

**Section 5 — Final CTA**:
Background: deep gradient from `#080809` to `#0d0b1a`
Centered H2: "READY TO SEE YOUR SCORE?" + URL input + button

**Footer**: 4-column, dark bg, muted text, Neural Purple hover on links

---

### B. Dashboard Landing (`src/app/(dashboard)/dashboard/page.tsx`)

Show user's scans as a list/grid of glassmorphism cards:
- Each card: score gauge (120px), domain name, score number, date, "View Report" button
- Top stat row: Total Scans, Average Score, Scans This Month (JetBrains Mono for numbers)
- "New Scan" CTA button (Spectra Red, top-right)
- Empty state: nice centered graphic with "No scans yet. Start with your first URL."

---

### C. Scan Detail Page (`src/app/(dashboard)/scans/[id]/page.tsx`)

3-tab layout (Overview / Issues / Fixes):
- **Overview tab**: Large score gauge (200px) + 7 category breakdown bars, each with score/max, color-coded, percentage fill animations
- **Issues tab**: Grouped by severity. Critical (red), Warning (amber), Info (purple). Each issue expandable with description.
- **Fixes tab**: Code snippet cards with syntax highlighting (dark theme). "Copy Code" button with clipboard confirmation (lime flash)
- PDF report download button (top right, ghost style)

---

### D. Pricing Page (`src/app/pricing/page.tsx`)

Standalone pricing page matching the landing page pricing section but with more detail.

---

## 5. ANIMATION SPECS

```css
/* Radar pulse (on score gauge backdrop) */
@keyframes radar-pulse {
  0% { transform: scale(1); opacity: 0.15; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Score bar fill */
@keyframes bar-fill {
  from { height: 0; }
  to { height: var(--target-height); }
}

/* Scan line sweep */
@keyframes scan-sweep {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}
.scan-line {
  position: fixed;
  left: 0; top: 0; width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent);
  animation: scan-sweep 8s linear infinite;
  pointer-events: none; z-index: 1;
}

/* Section entrance */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

All animations must respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
```

---

## 6. NAVIGATION

Sticky top nav (80px desktop, 64px mobile):
- Background: `rgba(8,8,9,0.8)` with `backdrop-filter: blur(12px)`
- Logo: "AGENT" in Syne 800 white + "OPTIMIZE" in Spectra Red
- Links: Inter 600, muted color, hover to white
- CTA: "Start Free Scan" — Spectra Red bg, Syne 700, 8px radius
- Mobile: hamburger → full-screen drawer, Neural Purple bg

---

## 7. RALPH LOOP INSTRUCTIONS

Reset the Ralph loop for this design rebuild:

**Chunk 1 — Design Foundation**
- Set up CSS custom properties in `src/app/globals.css` (full color palette, animations, bg-grid, scan-line, glassmorphism utilities)
- Update `src/app/layout.tsx` to add Google Fonts (Syne, Inter, JetBrains Mono), background, scan-line, bg-grid
- Build shared components: `ScoreGauge`, `GlassCard`, `SignalBars`, `NavBar`, `Footer`
- Scoreboard: `npm run typecheck && npm test && npm run build`
- Promise on success: `<promise>TASK_COMPLETE</promise>`

**Chunk 2 — Landing Page**
- Rebuild `src/app/page.tsx` to match Section 1-5 spec above
- Hero with URL input that links to /scan?url=... (no functional scan on landing, just navigation)
- All sections with animations
- Scoreboard required
- Promise: `<promise>TASK_COMPLETE</promise>`

**Chunk 3 — Dashboard + Scan Pages**
- Rebuild dashboard page with stats + scan cards
- Rebuild scan detail page with 3 tabs
- All components use glassmorphism and dark theme
- Scoreboard required
- Promise: `<promise>TASK_COMPLETE</promise>`

**Chunk 4 — Polish + Accessibility**
- Pricing page rebuild
- Nav drawer on mobile
- `prefers-reduced-motion` on all animations
- ARIA labels on all icon-only buttons
- Final scoreboard must be 100%: `npm run typecheck && npm test && npm run build`
- Promise: `<promise>TASK_COMPLETE</promise>`

---

## 8. PROCESS

For each chunk:
1. Read this prompt file again for context
2. Implement all tasks in the chunk
3. Run scoreboard: `npm run typecheck && npm test && npm run build`
4. Fix ALL errors before proceeding
5. Update `.ralph/progress.md` with what was done
6. Output: `<promise>TASK_COMPLETE</promise>`

**CRITICAL RULES**:
- NEVER modify files in `src/app/api/` — backend is complete
- NEVER modify `prisma/schema.prisma`
- NEVER modify `src/lib/auth.ts` or `src/lib/stripe.ts`
- All new components must be TypeScript with proper types
- Use Tailwind CSS where possible (it is already installed)
- CSS custom properties defined in globals.css for all brand tokens
- No N+1 queries, no console.log left in production code
- Test count must stay at 14 passing minimum
