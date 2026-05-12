# AgentOptimize Product Roadmap

**Last Updated:** 2026-02-07
**Status:** Phase 7 Complete → Phase 5+ Specifications Consolidated
**Current Version:** v1.0 (Live on Vercel)

---

## Current Status (Phase 7 - LIVE ✅)

### What's Live Today
- ✅ **URL Scanning:** 7-category AI visibility analyzer
  - Crawler Access (robots.txt, user-agents)
  - Structured Data (JSON-LD, FAQ detection)
  - Content Structure (headings, semantic HTML)
  - LLMs.txt (machine-readable site summary)
  - Technical Health (meta tags, load times)
  - Citation Signals (external links)
  - Content Quality (word count, freshness)

- ✅ **User Authentication:** Google OAuth via NextAuth.js
- ✅ **Results Display:** Score 0-100 + category breakdown + issues + fixes
- ✅ **Subscription Tiers:** Free (3 scans/mo), Starter (50), Pro (500), Agency (unlimited)
- ✅ **Live URL:** https://website-phi-ten-25.vercel.app
- ✅ **Testing:** 14/14 unit tests passing

### What Needs Configuration
- ⚠️ Stripe API keys (for checkout)
- ⚠️ Email service (for transactional emails)
- ⚠️ Database credentials (in Vercel env vars)

---

## Phase 5+ Enhancement Roadmap (8-12 Weeks)

### Phase 5A: Enhanced Scoring System (Weeks 1-2)
**Goal:** Upgrade from 7 to 10 scoring factors with advanced analysis

**Deliverables:**
- Add 3 new scoring factors:
  - Pricing Data Detection (e-commerce, SaaS pricing pages)
  - API Presence (REST/GraphQL endpoints, documentation)
  - URL Semantics (descriptive URLs vs slugs, hierarchy depth)

- Implement JavaScript rendering:
  - Add Puppeteer integration for dynamic content
  - Auto-detect when site needs JS rendering
  - Support both static (Cheerio) + dynamic (Puppeteer) analysis

- Enhance scoring algorithm:
  - Per-factor findings (not just binary)
  - Per-factor recommendations (specific actions)
  - Impact scoring (high/medium/low severity)
  - Prioritized fixes (ranked by impact)

**Reference:** `roadmap_specs/API_ROUTES.md` (lines 124-143)
**Reference:** `roadmap_specs/DATABASE_SCHEMA.md` (scan_factors table)

**Estimated Effort:** 80 hours

---

### Phase 5B: Site-Wide Crawling (Week 3)
**Goal:** Scan entire domains, not just single URLs

**Features (Pro+ tier):**
- POST `/api/scan/site-wide`
  - Auto-discover pages via sitemap.xml
  - Crawl internal links (breadth-first)
  - Respect robots.txt rules
  - Configurable max pages (50 Pro, 200 Agency)

- Results:
  - Aggregate score (all pages)
  - Per-page breakdown
  - Find lowest-scoring pages
  - Compare pages side-by-side

**UI Updates:**
- Site overview page showing all scanned pages
- Progress indicator during crawl
- SiteWideProgress component

**Reference:** `roadmap_specs/API_ROUTES.md` (POST /api/scan/site-wide section)

**Estimated Effort:** 40 hours

---

### Phase 5C: Competitor Tracking (Week 4)
**Goal:** Monitor competitor AI visibility scores

**Features by Tier:**
- Starter: Track up to 3 competitors
- Pro: Track up to 10 competitors
- Agency: Unlimited competitors

**Capabilities:**
- Add competitor domain to watch list
- Auto-scan competitors weekly
- Compare your scores vs competitors
- Identify competitive gaps
- Receive alerts on score changes

**UI Components:**
- CompetitorTable (list of tracked competitors)
- CompetitorComparisonChart (your score vs theirs)
- CompetitorRow (add/remove/view competitor)

**Database:**
- Competitors table (domain, tier limits)
- ScheduledScans for auto-rescans

**Reference:** `roadmap_specs/API_ROUTES.md` (competitor endpoints)
**Reference:** `roadmap_specs/COMPONENT_TREE.md` (competitor components)

**Estimated Effort:** 50 hours

---

### Phase 5D: PDF Reports + Scheduling (Weeks 5-6)
**Goal:** Export results and automate recurring scans

**Feature 1: PDF Reports**
- Generate professional PDF export
- Include: Score, factors, issues, fixes, recommendations
- Optional: Competitor comparison page
- Download or email

**Feature 2: Scheduled Scanning**
- Create recurring scan schedule
- Frequency: Weekly, bi-weekly, monthly
- Automatic execution via cron job
- Store scan history for trend analysis

**UI:**
- PDFReportButton (on scan results)
- ScheduledScan creation form
- ScanHistoryChart (trend visualization over time)

**Database:**
- ScanReport table (PDF URLs, generation status)
- ScheduledScan table (frequency, last run, next run)

**Reference:** `roadmap_specs/API_ROUTES.md` (POST /api/scan/{id}/report)

**Estimated Effort:** 60 hours

---

### Phase 5E: REST API + White-Label (Weeks 7-8)
**Goal:** Enable programmatic access and agency white-label

**Feature 1: Full REST API (Agency+ tier)**
- POST `/api/scan` - Scan via API
- GET `/api/scans` - List scans
- POST `/api/scan/site-wide` - Site crawl via API
- POST `/api/competitors` - Manage competitors
- Rate limiting per API key
- Webhook notifications on scan completion

**Feature 2: API Key Management**
- Create/revoke API keys
- Track API key usage
- Per-key rate limits
- Per-key scopes (read, write, etc)

**Feature 3: White-Label (Agency+ tier)**
- Remove AgentOptimize branding
- Custom company logo
- Custom color scheme
- Custom domain support
- Remove footer "Powered by AgentOptimize"

**Reference:** `roadmap_specs/API_ROUTES.md` (full API specification)
**Reference:** `roadmap_specs/AUTHENTICATION_SPEC.md` (API key auth)

**Estimated Effort:** 70 hours

---

### Phase 5F: Generators + Advanced Tools (Weeks 9-10)
**Goal:** Auto-generate assets to help users improve scores

**Feature 1: LLMs.txt Generator (Pro+)**
- Auto-generate `.well-known/llms.txt`
- Include company info, products, contact
- Optimized for AI agent discovery
- Copy-paste ready
- Download as file

**Feature 2: Schema Generator (Pro+)**
- Auto-detect missing schema opportunities
- Generate JSON-LD for:
  - Organization schema
  - Product/service schema
  - FAQ schema
  - LocalBusiness schema
- Copy-paste into HTML
- Validate syntax

**Reference:** `roadmap_specs/COMPONENT_TREE.md` (LlmsTxtGenerator, SchemaGenerator)

**Estimated Effort:** 40 hours

---

### Phase 5G: Polish + Launch (Week 11-12)
**Goal:** Final quality assurance and production readiness

**Tasks:**
- End-to-end testing (all new features)
- Performance optimization
- Security audit (API keys, rate limiting)
- Documentation updates
- Database migrations (add new tables)
- Stripe integration testing (if not done)
- Email integration testing
- Deployment verification

**Estimated Effort:** 50 hours

---

## Marketing Timeline (Concurrent with Development)

**Week 1-2 (During Phase 5A):**
- Launch blog with Phase 2 content
- Target keywords: "AI visibility score", "agent readability", "ChatGPT SEO"
- Start 3-5 pieces/week from 118-piece calendar

**Week 3-4 (During Phase 5B):**
- SEO optimization for competitor analysis keywords
- Featured snippets targeting (via content brief templates)
- Link-building campaign (10 strategies ready)

**Week 5-8 (During Phase 5C-E):**
- Organic growth via content distribution
- PR outreach with enterprise features
- Product hunt launch preparation

**Week 9-12 (During Phase 5F-G):**
- Launch v2.0 with all new features
- Press release (enterprise features)
- Case studies (from early users)
- Social media blitz

**Reference:** `marketing_strategy/CONTENT_CALENDAR.md` (118 pieces)
**Reference:** `marketing_strategy/ORGANIC_GROWTH_STRATEGY.md` (10 strategies)

---

## Technical Debt & Dependencies

### Immediate (Before Phase 5 Starts)
- [ ] Configure Stripe API keys in Vercel
- [ ] Set up email service (SendGrid, Resend, or similar)
- [ ] Test database connection in production
- [ ] Document environment variables

### Phase 5 Requirements
- [ ] Puppeteer installation + testing
- [ ] Sitemap parser library
- [ ] PDF generation library (pdfkit or similar)
- [ ] Scheduler (node-cron or Bull queue)
- [ ] Webhook implementation

### Database Migrations
- [ ] Add ScanFactor table (10 factors per scan)
- [ ] Add Competitor table (tracking)
- [ ] Add ScheduledScan table (scheduler)
- [ ] Add ScanReport table (PDF links)
- [ ] Add ApiKey table (if not present)
- [ ] Update User model (denormalized fields)

---

## Success Metrics

**By End of Phase 5G:**
- ✅ 10 scoring factors (vs 7)
- ✅ Site-wide scanning working
- ✅ 50+ competitor profiles tracked
- ✅ 100+ PDF reports generated
- ✅ 1000+ API calls via REST API
- ✅ 50+ scheduled scans active
- ✅ $5K+/month MRR (estimate)

**Traffic Target:**
- 1000+ organic visits/month (from 118-piece content plan)
- 100+ free trial signups/month
- 10+ paid subscriptions/month (Starter+)

---

## Risk Mitigation

### Phase 5A (Scoring)
**Risk:** Puppeteer adds latency
**Mitigation:** Cache dynamic renders, offer async option

### Phase 5B (Site-Wide)
**Risk:** Crawl takes too long for large sites
**Mitigation:** Queue system, max 200 pages limit, progress tracking

### Phase 5C (Competitors)
**Risk:** Users track competitors of competitors (data explosion)
**Mitigation:** Tier-based limits, cleanup job for unused competitors

### Phase 5E (API)
**Risk:** API abuse by single user
**Mitigation:** Rate limiting + quotas, usage alerts, abuse monitoring

### Phase 5G (Launch)
**Risk:** New features break existing functionality
**Mitigation:** Comprehensive testing, canary deployment, rollback plan

---

## Dependencies & Resources

### External Services
- Puppeteer (browser automation)
- Stripe (payments)
- Email service (transactional emails)
- PDF generator (report exports)
- Scheduler (recurring scans)

### Team Requirements
- Backend engineer (API + database)
- Frontend engineer (UI components)
- DevOps (deployment + monitoring)
- Product manager (feature prioritization)
- Marketing (content + launch)

### Estimated Total Cost
- Development: 430 hours ÷ 4 weeks = 10.75 dev weeks = 2 full-time devs for 5-6 weeks
- Hosting: ~$500-1000/month (Vercel + Neon + services)
- Tooling: ~$100-200/month (monitoring, logging, etc)

---

## Go-To-Market Strategy

**Phase 5 Completion → Launch v2.0 (Week 12)**

1. **Day 1:** Deploy to production
2. **Day 2-3:** Internal testing + bug fixes
3. **Day 4:** Email existing free users (upgrade to new features)
4. **Day 5-7:** Product Hunt launch + press outreach
5. **Week 2:** Start content calendar (new 118 pieces)
6. **Week 3+:** Organic growth acceleration

**Expected Outcome:**
- 50-100 new trial signups
- 5-10 new paid subscriptions
- $5-10K/month additional MRR

---

## Consolidated References

All specifications and marketing strategy sourced from completed Pipeline phases:

**Marketing Strategy:** `marketing_strategy/`
- KEYWORD_RESEARCH.md - SEO keywords + market sizing
- SERP_ANALYSIS.md - Competitive landscape
- CONTENT_CALENDAR.md - 118-piece 12-month plan
- CONTENT_BRIEF_TEMPLATES.json - 5 template briefs
- MARKETING_FUNNEL.md - Full-funnel strategy
- COMPETITOR_POSITIONING.md - Positioning vs 5 competitors
- ORGANIC_GROWTH_STRATEGY.md - 10 link-building strategies
- VERIFICATION_PLAN.json - KPI tracking

**Technical Specifications:** `roadmap_specs/`
- API_ROUTES.md - Full REST API design
- DATABASE_SCHEMA.md - Complete schema with rationale
- AUTHENTICATION_SPEC.md - Auth strategy (OAuth + API keys)
- COMPONENT_TREE.md - 42 UI components needed
- BUILD_PLAN.md - Phase-by-phase build plan
- TECH_STACK.md - Technology decisions

---

## Review & Approval Checklist

- [ ] CEO/Product: Phase 5 timeline approved
- [ ] Tech Lead: Architecture reviewed
- [ ] Marketing: Content calendar approved
- [ ] Finance: Budget allocated ($50-100K for dev + marketing)
- [ ] Engineering: Dev team assigned

---

**Next Step:** Schedule kickoff meeting for Phase 5A planning

**Questions?** Review the specs in `roadmap_specs/` or marketing in `marketing_strategy/`

