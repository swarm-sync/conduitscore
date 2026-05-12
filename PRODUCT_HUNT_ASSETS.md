# ConduitScore & SwarmSync AI — Product Hunt Visual Assets

## 1. THUMBNAIL LOGOS

### ConduitScore Logo
**Requirements:**
- Square format (1000x1000px at production)
- Primary color: Deep Blue #0052CC or Purple #6B21A8
- Secondary: Accent green/yellow (#10B981 or #FBBF24)
- **Design concept**: Circular gauge/speedometer shape with upward arrow or checkmark
- **Symbolism**: Score, measurement, progress
- **Scalability**: Legible at 64x64px (PH favicon), 512x512px (gallery)
- **Style**: Geometric, modern, minimal
- **Text**: None (icon-only)

**Sketch concept:**
```
┌─────────────────────────────────────────┐
│                                         │
│          ╭──────────────╮               │
│         ╱              ╲              │
│        │    🔵 ✓        │              │
│        │  0-100 gauge   │              │
│         ╲              ╱              │
│          ╰──────────────╯              │
│                                         │
└─────────────────────────────────────────┘
```

**Color specs:**
- Primary: #0052CC (deep blue) — trust, visibility, tech
- Accent: #10B981 (emerald green) — success, improvement
- Background: White or transparent
- **Variants needed:**
  - Color on white
  - Color on dark (navy/charcoal)
  - Monochrome (black/white)
  - Monochrome (white/dark)

---

### SwarmSync AI Logo
**Requirements:**
- Square format (1000x1000px at production)
- Primary color: Teal #0D9488 or Deep Teal #0F766E
- Secondary: Bright accent (cyan #06B6D4 or purple #A855F7)
- **Design concept**: Interconnected nodes/network, synchronized movement
- **Symbolism**: Agents working together, coordination, orchestration
- **Scalability**: Legible at 64x64px (PH favicon)
- **Style**: Geometric, modern, dynamic (suggest motion without animation)
- **Text**: None (icon-only)

**Sketch concept:**
```
┌─────────────────────────────────────────┐
│                                         │
│       ●────────●────────●              │
│       │ ╲    ╱ │ ╲    ╱ │              │
│       │  ╲  ╱  │  ╲  ╱  │              │
│       ●────────●────────●              │
│       │ ╱  ╲  │ ╱  ╲  │              │
│       │╱    ╲ │╱    ╲ │              │
│       ●────────●────────●              │
│                                         │
└─────────────────────────────────────────┘
```

**Color specs:**
- Primary: #0D9488 (teal) — coordination, balance, distributed systems
- Accent: #06B6D4 (cyan) — connectivity, collaboration
- Background: White or transparent
- **Variants needed:**
  - Color on white
  - Color on dark
  - Monochrome (black/white)
  - Monochrome (white/dark)

---

## 2. GALLERY IMAGES (5+ per product)

### ConduitScore Gallery Images

#### Image 1: Hero Dashboard
**Title:** "ConduitScore Dashboard — Scan Results"
**Dimensions:** 1400x900px (16:9)
**Description:**
A clean, modern web interface showing:
- Top: Large "AI Visibility Score" card with **78/100** displayed prominently
- Color-coded gauge: Red (0-33), Yellow (34-66), Green (67-100) — needle pointing to 78
- Below: 7 category cards in a 2-row grid:
  - Content Quality: 85/100 ✓
  - Structure: 72/100 ⚠️
  - Metadata: 68/100 ⚠️
  - Accessibility: 91/100 ✓
  - Freshness: 65/100 ⚠️
  - Links: 74/100 ✓
  - Technical: 55/100 ✗
- CTA button: "View Issues & Fixes"
- Palette: White background, deep blue (#0052CC) accents, emerald green (#10B981) for passing scores, amber/red for warnings

**Design style:**
- Minimalist, data-focused
- Heavy use of whitespace
- Rounded corners (8px)
- Sans-serif typography (Inter or similar)
- Subtle shadows for depth

---

#### Image 2: Issue Breakdown
**Title:** "Issues & Actionable Fixes"
**Dimensions:** 1400x900px (16:9)
**Description:**
A detailed issue card showing:
- **Issue title (large, bold):** "Missing structured data for product schema"
- **Impact badge (red):** "-5 points"
- **Category:** "Metadata"
- **Description:** "Your product pages lack JSON-LD structured data. AI agents can't understand your product attributes."
- **Code fix section:**
  ```
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Your Product",
    "description": "...",
    "offers": {
      "@type": "Offer",
      "price": "99.99"
    }
  }
  </script>
  ```
  (Shown with syntax highlighting)
- **Effort badge:** "5 minutes"
- **Impact score:** "+5 to your AI Visibility Score"

**Design style:**
- Card-based layout
- Code block with dark background (#1F2937) and syntax highlighting
- Green success state for "fix applied"
- Easy copy-to-clipboard button

---

#### Image 3: Methodology / What We Check
**Title:** "How ConduitScore Analyzes Your Site"
**Dimensions:** 1400x900px (16:9)
**Description:**
An infographic showing the 7 analysis categories with icons:
```
┌─────────────────────────────────────────────────────────────────┐
│                  ConduitScore Analysis Framework                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📝 Content Quality    🏗️  Structure      🏷️  Metadata          │
│  "Is your content     "Is your site     "Do you have        │
│   novel & cited?"      organized?"       schema markup?"      │
│                                                                 │
│  ♿ Accessibility      🔄 Freshness      🔗 Links             │
│  "Can AI agents       "How recent is    "Do other sites     │
│   parse your pages?"   your content?"    link to you?"       │
│                                                                 │
│  ⚙️ Technical Setup                                             │
│  "robots.txt, sitemap.xml, llms.txt, security headers"        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design style:**
- 7 colorful icon cards (each category gets a different color)
- Icons are large, simple, memorable
- Hover states show more detail (or animated on desktop)
- Typography: Large category title + short description
- No code, very visual

---

#### Image 4: "Highest-Leverage Fixes First" Prioritization
**Title:** "Smart Prioritization — Fix What Matters Most"
**Dimensions:** 1400x900px (16:9)
**Description:**
A ranked list showing issues sorted by "Impact per effort":
```
┌─────────────────────────────────────────────────────────────────┐
│  Issue                              Impact  Effort  Priority    │
├─────────────────────────────────────────────────────────────────┤
│  1. Add robots.txt rules             +8pts   5min   🔥 CRITICAL│
│  2. Fix JSON-LD schema               +7pts   10min  🔥 CRITICAL│
│  3. Update blog freshness            +6pts   15min  ⚡ HIGH    │
│  4. Add OpenGraph tags               +4pts   3min   ⚡ HIGH    │
│  5. Improve page accessibility       +5pts   30min  ⚡ HIGH    │
│  6. Add llms.txt                     +3pts   5min   📌 MEDIUM  │
│  7. Optimize image alt text          +2pts   20min  📌 MEDIUM  │
│  8. Add XML sitemap                  +4pts   10min  📌 MEDIUM  │
└─────────────────────────────────────────────────────────────────┘
```

**Design style:**
- Clean table/list design
- Color-coded priority badges (red/orange/yellow/blue)
- Progress bars for "Impact per effort" ratio
- "Start here" button on #1 item
- Shows that users don't need to fix everything — just the high-impact items

---

#### Image 5: Pricing Tiers
**Title:** "ConduitScore Pricing — Choose Your Plan"
**Dimensions:** 1400x900px (16:9)
**Description:**
4 pricing cards side-by-side:
```
┌──────────┬───────────┬──────────┬──────────────┐
│  FREE    │ STARTER   │ PRO      │ GROWTH       │
│ $0/mo    │ $29/mo    │ $49/mo   │ $79/mo       │
├──────────┼───────────┼──────────┼──────────────┤
│ 3 scans  │ Unlimited │ Unlimited│ Unlimited    │
│ 1 blur   │ All fixes │ All fixes│ All fixes    │
│ No API   │ API       │ API      │ API          │
│ -        │ Schedule  │ Schedule │ Dashboard    │
│ -        │ -         │ Reports  │ Multi-domain │
│ -        │ -         │ -        │ Priority sup.│
└──────────┴───────────┴──────────┴──────────────┘
```

**Design style:**
- Card-based layout
- Highlighted "best value" tier (Pro or Starter depending on target)
- Clear feature comparison
- CTA buttons with strong color contrast
- Mobile-responsive (cards stack on small screens)

---

### SwarmSync AI Gallery Images

#### Image 1: Architecture Diagram
**Title:** "SwarmSync Architecture — Multi-Agent Orchestration"
**Dimensions:** 1400x900px (16:9)
**Description:**
A system architecture showing:
```
┌─────────────────────────────────────────────────────────────┐
│                   SwarmSync Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌────────────────┐     ┌────────────────┐               │
│   │  Task Queue    │────▶│  Agent Pool    │               │
│   │  (Async)       │     │  (100+ agents) │               │
│   └────────────────┘     └────────────────┘               │
│          △                       │                         │
│          │                       ▼                         │
│   ┌────────────────┐     ┌────────────────┐               │
│   │  State Manager │◀────│  Agent Workers │               │
│   │  (Versioned)   │     │  (LLM calls)   │               │
│   └────────────────┘     └────────────────┘               │
│          │                       △                         │
│          ▼                       │                         │
│   ┌────────────────────────────────────────┐              │
│   │  Conflict Resolution (Debate/Vote)     │              │
│   │  + Audit Logging + Rollback Support    │              │
│   └────────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Design style:**
- Clean block diagram
- Teal (#0D9488) primary color
- Cyan (#06B6D4) for data flow arrows
- Each component shows its purpose
- No code, very architectural

---

#### Image 2: Conflict Resolution Protocol
**Title:** "Intelligent Conflict Resolution — Debate, Vote, Escalate"
**Dimensions:** 1400x900px (16:9)
**Description:**
Shows 3 conflict resolution strategies side-by-side:

**Debate Protocol:**
```
Agent A (propose):  "Buy AAPL"
Agent B (counter):  "Too risky, wait for dip"
Agent C (counter):  "Support B, sell high"
SwarmSync Result:   "Vote: 2-1 for wait" + confidence: 73%
```

**Voting Protocol:**
```
Agent 1: "BUY" ✓
Agent 2: "BUY" ✓
Agent 3: "HOLD" ✗
Agent 4: "BUY" ✓
Agent 5: "HOLD" ✗
Outcome: "BUY" (3 votes) — Confidence: 60%
```

**Escalation Protocol:**
```
Agents can't agree (60% vs 40% split)
→ Flag for human review
→ Human decision logged
→ Future agents learn from precedent
```

**Design style:**
- 3-column layout, easy comparison
- Color-coded results (green for consensus, amber for escalation)
- Icons for each agent type (teal circles with agent initials)
- Shows transparency in decision-making

---

#### Image 3: Production Deployment
**Title:** "Deploy at Scale — 100+ Agents in Production"
**Dimensions:** 1400x900px (16:9)
**Description:**
Shows scalability:
```
┌─────────────────────────────────────────────────────────┐
│  SwarmSync Deployment Options                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Docker Compose       Kubernetes        AWS Lambda     │
│  (Local Dev)         (Production)       (Serverless)   │
│                                                         │
│  5-20 agents         50-500 agents      Auto-scaling   │
│  Single machine      Multi-node         Pay-per-exec   │
│  Dev/testing         High availability  Global CDN     │
│                                                         │
│  $ docker-compose up | kubectl apply   | Already ready │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Design style:**
- 3-column comparison
- Progressive complexity (left to right)
- Terminal/code hints for developers
- Checkmarks for supported features
- Teal accent color

---

#### Image 4: Use Case: Autonomous Trading System
**Title:** "Real-World Use Case — Autonomous Trading Swarm"
**Dimensions:** 1400x900px (16:9)
**Description:**
Shows agents working together:
```
┌────────────────────────────────────────────────────┐
│  Market Research Agent                             │
│  Input:   AAPL, MSFT, TSLA                        │
│  Output:  "AAPL sentiment +23%, stable trend"     │
│           "MSFT earnings beat, momentum strong"   │
│           "TSLA execution risk, wait"             │
├────────────────────────────────────────────────────┤
│  Technical Analysis Agent                          │
│  Input:   Historical price data                   │
│  Output:  "AAPL: Breakout imminent (RSI 68)"      │
│           "MSFT: Consolidation, then rally"       │
│           "TSLA: Downtrend not confirmed"         │
├────────────────────────────────────────────────────┤
│  Risk Management Agent                             │
│  Input:   Portfolio current state                 │
│  Output:  "Position sizing: $5K max per symbol"   │
│           "Stop loss: 3% below entry"             │
├────────────────────────────────────────────────────┤
│  Decision Agent (Debate Result)                    │
│  Recommendation:                                   │
│  ✓ BUY MSFT ($5K, stop @ $400)                    │
│  ⚠️ HOLD AAPL (wait for confirmation)             │
│  ✗ SKIP TSLA (risk/reward unfavorable)            │
│                                                    │
│  Audit Trail:  [Full decision log + agent inputs] │
└────────────────────────────────────────────────────┘
```

**Design style:**
- Stacked agent outputs showing flow
- Shows practical value
- Real examples (stock tickers, numbers)
- Audit trail visible for compliance

---

#### Image 5: Enterprise Audit Trail
**Title:** "Complete Audit Logging — Every Decision Tracked"
**Dimensions:** 1400x900px (16:9)
**Description:**
Timeline view showing:
```
2026-03-27 14:23:15Z | Agent: ResearchBot    | Action: Analyzed AAPL
2026-03-27 14:23:18Z | Agent: AnalysisBot    | Action: Reviewed technicals
2026-03-27 14:23:22Z | Agent: RiskBot        | Action: Sized position
2026-03-27 14:23:25Z | Agent: DecisionBot    | Action: Proposed BUY
2026-03-27 14:23:28Z | Agent: ComplianceBot  | Action: Approved BUY
2026-03-27 14:23:31Z | System: Decision Made | Result: BUY 100 shares
2026-03-27 14:23:33Z | System: Trade Logged  | ID: order_xyz_789
2026-03-27 14:24:12Z | System: ROLLBACK triggered (user request)
2026-03-27 14:24:14Z | System: State restored to 14:23:15Z
```

**Design style:**
- Log/timeline format (familiar to engineers)
- Color-coded: blue (action), green (approved), red (rollback)
- Shows complete transparency
- Includes rollback example
- Monospace font for code/logs aesthetic

---

## 3. DESIGN SPECIFICATIONS FOR DESIGNER

### Color Palettes

**ConduitScore:**
- Primary: #0052CC (Deep Blue)
- Secondary: #10B981 (Emerald)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Background: #FFFFFF or #F9FAFB
- Text: #111827 (Dark Gray)

**SwarmSync AI:**
- Primary: #0D9488 (Deep Teal)
- Secondary: #06B6D4 (Cyan)
- Accent: #A855F7 (Purple)
- Background: #FFFFFF or #F8FAFC
- Text: #0F766E (Dark Teal)

### Typography

**ConduitScore:**
- Display: Inter Bold (logo, headlines)
- Body: Inter Regular (descriptions)
- Code: JetBrains Mono (code examples)

**SwarmSync AI:**
- Display: Inter Bold (logo, headlines)
- Body: Inter Regular (descriptions)
- Code: Fira Code (code examples)

### Imagery Style

- **Clean, minimalist**: No shadows, flat design
- **Data-focused**: Charts, metrics, dashboards
- **High contrast**: Readable at small sizes
- **Icons**: 24-32px size, stroke-based (not filled)
- **No stock photos**: Custom illustrations preferred
- **Tech aesthetic**: Geometric shapes, grid alignment

---

## 4. IMPLEMENTATION CHECKLIST

- [ ] Create 2 SVG logos (64px, 256px, 512px, 1000px variants)
- [ ] Generate 5 gallery images for ConduitScore (1400x900px PNG)
- [ ] Generate 5 gallery images for SwarmSync (1400x900px PNG)
- [ ] Export color palette swatches
- [ ] Create brand guidelines PDF (1-2 pages)
- [ ] Upload to ProductHunt by Day -2 (before launch)
- [ ] Test responsive display on mobile PH
- [ ] Get 1-2 design reviews before launch
- [ ] Save high-res versions for future marketing materials

---

## 5. DESIGN TOOL RECOMMENDATIONS

**For quick generation:**
- **Canva Pro**: Fast template-based designs ($120/year)
- **Figma**: Professional designs with collaboration (free for 3 projects)
- **Adobe Express**: Quick graphics, logo maker (free tier available)

**For production quality:**
- **Hire designer on Fiverr/Upwork**: $200-500 per product
- **Design agency**: $1,000-3,000 for full brand kit
- **Use your skills**: If you have design experience, Figma is fastest

**For AI generation (Gemini/GPT):**
- **DALL-E 3** (via ChatGPT): Text → image, good for mockups
- **Midjourney**: High-quality, great for gallery images
- **Stable Diffusion XL**: Fast, good for iteration

---

## 6. QUICK TURNAROUND PLAN (48-72 hours)

If you need assets ASAP:

**Hour 0-2:** Define specs (use this document)
**Hour 2-4:** Create logos using Figma templates or Canva
**Hour 4-6:** Generate gallery mockups using Midjourney or DALL-E
**Hour 6-8:** Polish/refine in Figma or Canva
**Hour 8-10:** Export, test on ProductHunt preview
**Hour 10-12:** Final tweaks
**Hour 12+:** Upload to ProductHunt

**Total cost:** $0 (if you do it) to $500 (if you hire)
**Quality**: Product Hunt ready
**Time:** 2-3 days

---

## 7. BACKUP: ASCII/MINIMAL APPROACH

If you're pressed for time, you can launch with:
- Simple text logo (product name in clean font)
- White background
- One hero screenshot (actual scanner/dashboard)
- 2-3 mockups showing key features
- Upgrade visuals after launch (users care about product, not beautiful mockups)

This is **not recommended** but it works in emergencies. Focus on product over polish if you're out of time.

