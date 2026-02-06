# Chunk 4: UI (Landing Page + Dashboard + Scan Results + Pricing)

## Goal
All user-facing pages built, styled, and functional. Landing page converts visitors, dashboard shows scan history, scan results show scores/issues/fixes.

## Tasks
1. Build landing page sections:
   - HeroSection with URL input for free scan
   - FeatureGrid with 4 feature cards
   - HowItWorks (3-step process)
   - SocialProof section with stats
   - CTASection with final conversion push
2. Build ScoreGauge component (animated circle showing 0-100 score with framer-motion)
3. Build CategoryBreakdown grid (7 category cards with individual scores)
4. Build FixPanel with expandable fix cards and CopyButton (copy to clipboard)
5. Build IssueList with severity badges and category filtering
6. Build scan history page at (dashboard)/scans/page.tsx with DataTable
7. Build scan results page at (dashboard)/scans/[id]/page.tsx with tabs (Overview/Issues/Fixes)
8. Build pricing page at /pricing with 3-tier PricingTable
9. Create remaining UI atoms: Badge, ProgressBar, Skeleton, Tabs, Tooltip, Dialog, Avatar, Logo
10. Set up TanStack React Query provider and data-fetching hooks
11. Add Suspense boundaries on all pages that use useSearchParams
12. Verify all pages render, navigation works, scoreboard passes

## Design Tokens (from Phase 3)
Apply the design system colors, fonts, and spacing from phase_3_outputs/DESIGN_SYSTEM.md

## Key Components
- ScoreGauge: Animated SVG circle, score counts up from 0
- CategoryCard: Category name, score bar, pass/fail indicators
- FixCard: Issue title, severity, expandable code block with copy button
- PricingCard: Plan name, price, features list, CTA button

## Done Means
- Landing page renders with all sections and free scan input
- Dashboard shows scan history with scores
- Scan results page shows 7 categories, issues tab, fixes tab
- Copy-to-clipboard works on fix code blocks
- Pricing page shows 3 tiers with feature comparison
- All navigation links work (no 404s)
- `npm run typecheck && npm test && npm run build` passes

## Scoreboard
```powershell
npm run typecheck && npm test && npm run build
```
