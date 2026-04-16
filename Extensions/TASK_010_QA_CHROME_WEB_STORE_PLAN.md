# ConduitScore Chrome Extension — QA & Chrome Web Store Submission Plan

**Task:** task-012
**Prepared for:** QA Lead & Frontend Lead
**Date:** 2026-03-24
**Status:** Ready for execution — no clarifying questions required
**Success Owner:** QA Lead (with Frontend Lead support on signing off staging builds)

---

## Table of Contents

1. [Overview & Timeline](#1-overview--timeline)
2. [QA Test Plan](#2-qa-test-plan)
3. [Chrome Web Store Submission Package](#3-chrome-web-store-submission-package)
4. [Pre-Submission Checklist](#4-pre-submission-checklist)
5. [Submission Process Walkthrough](#5-submission-process-walkthrough)
6. [Review Response Protocol](#6-review-response-protocol)
7. [Rejection Recovery & Resubmission](#7-rejection-recovery--resubmission)
8. [Sign-Off Tracking](#8-sign-off-tracking)

---

## 1. Overview & Timeline

### 1.1 Execution Timeline (from Sprint Plan)

```
Week 2 (Fri 4/4)
└─ By EOD Friday: Testing + sign-off on staging builds

Week 3 (Mon 4/7 - Thu 4/10)
├─ Monday 4/7:   SUBMIT to Chrome Web Store
├─ Mon-Wed:      Typical review window (24-48 hours)
└─ Thursday 4/10: If approved, listing goes live

Week 4 onwards
└─ Post-launch monitoring & issue response
```

### 1.2 Approval Gates

| Gate | Owner | Deliverable | Date |
|------|-------|-------------|------|
| **Gate 1** | Frontend Lead | Staging build ready for QA testing | Fri 4/4 EOD |
| **Gate 2** | QA Lead | All QA tests passing (100%) | Fri 4/4 EOD |
| **Gate 3** | QA Lead | Pre-submission checklist complete | Mon 4/7 morning |
| **Gate 4** | QA Lead | Extension submitted to CWS | Mon 4/7 afternoon |
| **Gate 5** | QA Lead | Review feedback documented | Wed 4/9 or later |
| **Gate 6** | QA Lead | Response submitted (if needed) | Within 5 days of rejection |

---

## 2. QA Test Plan

### 2.1 Functional Tests

**Test Suite: Core Extension Operations**

| Test ID | Test Case | Steps | Expected Result | Pass/Fail |
|---------|-----------|-------|-----------------|-----------|
| **F-001** | Popup opens on extension icon click | 1. Install extension in Chrome<br>2. Click ConduitScore icon in toolbar | Popup opens with domain input field visible, no console errors | [ ] |
| **F-002** | Domain input accepts valid domain | 1. Open popup<br>2. Enter "example.com" in domain field<br>3. Click "Check Score" | Field accepts input, no error message displayed | [ ] |
| **F-003** | Scan button submits scan request | 1. Open popup<br>2. Enter valid domain "google.com"<br>3. Click "Check Score" button | Request sent to service worker, loading state appears | [ ] |
| **F-004** | Results display shows all components | 1. Complete scan for known domain<br>2. Wait for results | Score, grade badge (A/B/C/D/F), and 5 category scores visible | [ ] |
| **F-005** | Grade badge displays correct grade | 1. Scan domain with score 85-100<br>2. Observe grade badge | Badge shows "A", color matches design system (green) | [ ] |
| **F-006** | Category scores display correctly | 1. Complete scan<br>2. Observe category breakdown | All 5 categories (SSL/Security/Performance/Accessibility/Redirects) with color indicators visible | [ ] |
| **F-007** | Cache hit returns instant results | 1. Scan domain "example.com"<br>2. Wait for result<br>3. Scan "example.com" again within 1 hour | Second scan returns result within 100ms, shows cached indicator if present | [ ] |
| **F-008** | Context menu "Check ConduitScore for this page" works | 1. Right-click on any webpage<br>2. Select "Check ConduitScore for this page" | Scan initiates, badge updates on extension icon | [ ] |
| **F-009** | Context menu "Check ConduitScore for this link" works | 1. Right-click on any hyperlink<br>2. Select "Check ConduitScore for this link" | Scan initiates for link's domain, badge updates | [ ] |
| **F-010** | Badge shows score after scan | 1. Complete domain scan<br>2. Observe extension icon | Badge text displays (e.g., "85", "A") with background color matching score grade | [ ] |

### 2.2 Edge Case Tests

**Test Suite: Error Handling & Boundary Conditions**

| Test ID | Test Case | Steps | Expected Result | Pass/Fail |
|---------|-----------|-------|-----------------|-----------|
| **E-001** | Invalid domain format rejected | 1. Enter "not a domain!!!" in popup<br>2. Click "Check Score" | Error message displayed: "The domain format is not valid..." (from spec) | [ ] |
| **E-002** | Empty domain input handled | 1. Leave domain field empty<br>2. Click "Check Score" | Error message shown, no API call made | [ ] |
| **E-003** | Whitespace-only domain rejected | 1. Enter "   " (spaces only)<br>2. Click "Check Score" | Error message shown | [ ] |
| **E-004** | URL with protocol rejected | 1. Enter "https://example.com" in domain field<br>2. Click "Check Score" | Either strips protocol automatically OR shows error (behavior per spec section 9) | [ ] |
| **E-005** | Domain not found (404 error) | 1. Mock API 404 response or use test domain known to return 404<br>2. Trigger scan | Error message: "Domain not found" or similar, popup shows error state | [ ] |
| **E-006** | Rate limit error (429) | 1. Make 6+ rapid scans of different domains<br>2. Observe response on 6th request | Error message: "Rate limit reached. Please try again in a few minutes." (from spec section 9) | [ ] |
| **E-007** | Network timeout error | 1. Disable internet OR mock timeout<br>2. Attempt scan<br>3. Wait 10 seconds | Error message: "Network error. Please check your connection and try again." | [ ] |
| **E-008** | API server error (5xx) | 1. Mock 500 response from API<br>2. Trigger scan | Error message: "Server error. Try again later." | [ ] |
| **E-009** | Malformed API response (invalid JSON) | 1. Mock API returning garbage JSON<br>2. Trigger scan | Graceful error: "Unable to process response from server." | [ ] |
| **E-010** | Cache expiration (>1 hour TTL) | 1. Scan domain and get result<br>2. Wait 61+ minutes (or mock time)<br>3. Scan same domain again | New API call made, cache invalidated, fresh result returned | [ ] |
| **E-011** | Missing required API fields in response | 1. Mock API response missing score/grade<br>2. Trigger scan | Error state shown, user notified of unexpected response format | [ ] |
| **E-012** | Very long domain name (>253 chars) | 1. Enter extremely long domain string<br>2. Click "Check Score" | Rejected with error message (domains max 253 chars per RFC) | [ ] |
| **E-013** | Special characters in domain | 1. Enter "exam@ple.com" or "exam#ple.com"<br>2. Click "Check Score" | Rejected with invalid domain format error | [ ] |
| **E-014** | Case insensitivity | 1. Scan "Example.COM"<br>2. Scan "example.com"<br>3. Observe cache | Both queries use same cache key (lowercased), second query returns cached result | [ ] |
| **E-015** | Service worker crash recovery | 1. Trigger error in service worker (simulate)<br>2. Attempt another scan | Service worker restarted by Chrome, next scan works normally | [ ] |

### 2.3 UI/Responsive Tests

**Test Suite: Visual & Responsive Design**

| Test ID | Test Case | Steps | Expected Result | Pass/Fail |
|---------|-----------|-------|-----------------|-----------|
| **U-001** | Popup displays at correct size on desktop | 1. Click extension on desktop Chrome<br>2. Measure popup dimensions | Popup 80px wide × 400px tall, fits within design bounds | [ ] |
| **U-002** | Popup is responsive on mobile Chrome | 1. Open extension on Chrome Mobile (via DevTools or actual device)<br>2. Interact with popup | Layout adapts to mobile screen size, no horizontal scrolling, touch targets ≥48px | [ ] |
| **U-003** | Dark mode colors render correctly | 1. Enable dark mode in Chrome DevTools (or system)<br>2. Open extension popup | Colors invert/adapt for dark mode, text remains readable (≥4.5:1 contrast) | [ ] |
| **U-004** | Light mode colors render correctly | 1. Disable dark mode<br>2. Open extension popup | Colors display per design system, text readable (≥4.5:1 contrast) | [ ] |
| **U-005** | Loading spinner animation plays smoothly | 1. Trigger scan (watch network speed to see loading state)<br>2. Observe animation | Spinner rotates smoothly at 60fps, no jank, clear visual feedback | [ ] |
| **U-006** | Error state UI displays correctly | 1. Trigger error (e.g., invalid domain)<br>2. Observe error state | Error icon, error message, and retry button all visible, properly styled | [ ] |
| **U-007** | Results view scrolls smoothly on small screens | 1. Open popup on small viewport<br>2. Scroll category list | Smooth scrolling, no lag, category items remain readable | [ ] |
| **U-008** | Icons render at all sizes | 1. Inspect toolbar icon (16px, 32px)<br>2. Inspect permission icon (48px)<br>3. Inspect extension page icon (128px) | All icons sharp and clear, no pixelation, correct aspect ratio | [ ] |
| **U-009** | Font sizes readable on all screens | 1. Test on desktop (1920x1080), tablet (768px), mobile (375px)<br>2. Check font sizes | Minimum font size 12px, headings 16px+, labels clear | [ ] |
| **U-010** | Button hover/focus states visible | 1. Hover over "Check Score" button<br>2. Tab to button and focus | Hover: background color changes, cursor: pointer<br>Focus: visible outline (3px+), high contrast | [ ] |

### 2.4 Accessibility Tests

**Test Suite: WCAG 2.1 AA Compliance**

| Test ID | Test Case | Steps | Expected Result | Pass/Fail |
|---------|-----------|-------|-----------------|-----------|
| **A-001** | Keyboard navigation: Tab through all controls | 1. Open popup<br>2. Press Tab repeatedly<br>3. Observe focus order | Focus moves: domain input → Check Score button → result items → back to input (logical, no trapping) | [ ] |
| **A-002** | Keyboard navigation: Enter submits form | 1. Open popup<br>2. Enter domain<br>3. Press Enter key | Form submits, same as clicking "Check Score" button | [ ] |
| **A-003** | Keyboard navigation: Escape closes popup | 1. Open popup<br>2. Press Escape | Popup closes OR focus management clear (per MV3 behavior) | [ ] |
| **A-004** | Screen reader announces domain input label | 1. Open popup with screen reader (NVDA/JAWS/VoiceOver)<br>2. Focus domain input | Screen reader announces: "Domain input" or "Enter domain name" (aria-label present) | [ ] |
| **A-005** | Screen reader announces "Check Score" button | 1. Tab to button with screen reader active | Screen reader announces: "Check Score button" with appropriate role | [ ] |
| **A-006** | Screen reader announces loading state | 1. Trigger scan and wait for loading state<br>2. Screen reader should announce aria-busy=true message | Screen reader announces: "Loading" or "Scanning domain, please wait" | [ ] |
| **A-007** | Screen reader announces error message | 1. Trigger error (invalid domain)<br>2. Screen reader active | Screen reader announces entire error message (aria-live="polite") | [ ] |
| **A-008** | Screen reader announces score results | 1. Complete successful scan<br>2. Screen reader active, navigate results | Screen reader announces: "Domain score: 85, Grade: A, SSL: 95, ..." (aria-label on results) | [ ] |
| **A-009** | Color not sole indicator (grade badge) | 1. Check grade badge (A/B/C/D/F)<br>2. Verify letter is displayed, not just color | Letter displayed alongside color (not relying on color alone to convey meaning) | [ ] |
| **A-010** | Color contrast: Text on background ≥4.5:1 | 1. Use accessibility checker (axe DevTools, WAVE)<br>2. Run color contrast analysis | All text-to-background pairs have contrast ratio ≥4.5:1 (AA) or ≥7:1 (AAA) | [ ] |
| **A-011** | ARIA labels present on interactive elements | 1. Inspect popup HTML with DevTools<br>2. Check aria-label, aria-labelledby, or label elements | All buttons, inputs, result items have descriptive ARIA labels | [ ] |
| **A-012** | Focus indicator visible on all interactive elements | 1. Tab through popup<br>2. Observe focus outline on each element | Outline ≥3px thick, high contrast (≥3:1 with background) | [ ] |
| **A-013** | No keyboard traps (user can escape any control) | 1. Tab through entire popup multiple times<br>2. Use keyboard only, no mouse | Can navigate out of every control without getting stuck (no infinite loop) | [ ] |
| **A-014** | Text resize to 200% readable | 1. Set browser zoom to 200%<br>2. Open popup<br>3. Try to use all features | Layout doesn't break, text remains readable, no horizontal scrolling required | [ ] |
| **A-015** | Language attribute set (lang="en") | 1. Inspect popup.html<br>2. Check html lang attribute | lang="en" or appropriate language code present on root element | [ ] |

### 2.5 Test Execution Instructions

**Setup:**
1. **Build staging extension:**
   ```bash
   npm run build
   ```
   This generates `dist/` folder with all compiled files.

2. **Install in Chrome (developer mode):**
   - Open Chrome
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle upper right)
   - Click "Load unpacked"
   - Select the `dist/` folder
   - Extension appears in toolbar

3. **Open DevTools for debugging:**
   - Right-click extension icon → "Inspect popup" (for popup debugging)
   - Right-click extension icon → "Manage extensions" → click "Service worker" link (for background script)
   - Chrome console shows messages/errors

**Test Execution:**
- Execute tests in order: Functional (F-001 to F-010) → Edge Cases (E-001 to E-015) → UI (U-001 to U-010) → Accessibility (A-001 to A-015)
- Mark Pass/Fail for each test
- If any test fails, log issue: capture screenshot, console errors, reproduction steps
- Critical failures (F-001, F-003, A-001, A-009): must fix before proceeding to web store
- Non-critical issues (minor UI polish, edge case errors): may proceed with note in submission

**Test Data:**
- **Valid test domains:** google.com, example.com, github.com (known to have scores)
- **Test invalid domain:** "not-a-real-domain-12345.zzz" or similar
- **Test rate limit:** Make 6+ rapid consecutive scans
- **Test cache:** Scan same domain twice within 1 hour

**Expected Results Summary:**
- ✅ **100% of Functional tests (F-001 to F-010) PASS** — extension must work end-to-end
- ✅ **90%+ of Edge Case tests (E-001 to E-015) PASS** — graceful error handling
- ✅ **95%+ of UI tests (U-001 to U-010) PASS** — visual consistency
- ✅ **100% of Accessibility tests (A-001 to A-015) PASS** — WCAG AA compliance required for CWS approval

---

## 3. Chrome Web Store Submission Package

### 3.1 What Must Be in `dist/` Folder

**Required files for submission:**

```
dist/
├── manifest.json                    ✅ MUST INCLUDE (extension declaration)
├── popup.html                       ✅ MUST INCLUDE (popup shell)
├── popup.js                         ✅ MUST INCLUDE (bundled React popup)
├── service-worker.js                ✅ MUST INCLUDE (background script, bundled)
├── content-script.js                ✅ MUST INCLUDE (content script, bundled)
│
└── icons/
    ├── icon-16.png                  ✅ MUST INCLUDE (toolbar icon)
    ├── icon-32.png                  ✅ MUST INCLUDE (high-DPI toolbar)
    ├── icon-48.png                  ✅ MUST INCLUDE (permission dialog)
    └── icon-128.png                 ✅ MUST INCLUDE (Chrome Web Store listing)
```

**All files must be production-built (minified, tree-shaken).**

### 3.2 What Must NOT Be in Submission Package

**Do NOT include any of the following:**

| File Type | Reason | Action |
|-----------|--------|--------|
| `**/*.ts` (source TypeScript) | Source code exposure, increases package size | Remove from dist/ before zipping |
| `**/*.tsx` (React source) | Source code exposure | Remove from dist/ before zipping |
| `**/*.map` (source maps) | Exposes source code, security risk | Delete all .js.map files |
| `node_modules/` | Unnecessary, huge filesize | Never include |
| `.env`, `.env.local` | API keys, credentials exposure | Delete before packaging |
| `.git/`, `.gitignore` | Version control files | Not needed in dist/ |
| `README.md`, `docs/` | Documentation (optional) | Can include if desired, but not required |
| `package.json`, `package-lock.json` | Dev dependencies | Only needed in source repo, not dist/ |
| `webpack.config.js`, `vite.config.ts` | Build config | Not needed in dist/ |
| `src/` directory | Source code | Never include; only dist/ files submitted |

**Verification before zipping:**
```bash
# Run this to verify no forbidden files in dist/
find dist/ -name "*.ts" -o -name "*.tsx" -o -name "*.map" -o -name "node_modules" -o -name ".env*"
# Should output NOTHING — if it does, remove those files
```

### 3.3 Create Submission Package (ZIP File)

**Steps:**

1. **Ensure clean build:**
   ```bash
   rm -rf dist/
   npm run build
   ```

2. **Verify dist/ contents:**
   ```bash
   # Windows (PowerShell):
   Get-ChildItem -Path "dist/" -Recurse | Format-Table Name, PSPath

   # Linux/Mac:
   find dist/ -type f | sort
   ```

   Expected output (no .ts, .tsx, .map, .env files):
   ```
   dist/manifest.json
   dist/popup.html
   dist/popup.js
   dist/service-worker.js
   dist/content-script.js
   dist/icons/icon-16.png
   dist/icons/icon-32.png
   dist/icons/icon-48.png
   dist/icons/icon-128.png
   ```

3. **Create ZIP file:**
   ```bash
   # Windows (PowerShell):
   Compress-Archive -Path "dist/*" -DestinationPath "conduitscore-extension-v1.0.0.zip" -Force

   # Linux/Mac:
   cd dist && zip -r ../conduitscore-extension-v1.0.0.zip . && cd ..
   ```

4. **Verify ZIP contents:**
   ```bash
   # Windows (PowerShell):
   Expand-Archive "conduitscore-extension-v1.0.0.zip" -DestinationPath "test-extract" -Force
   Get-ChildItem -Path "test-extract" -Recurse | Format-Table Name

   # Linux/Mac:
   unzip -l conduitscore-extension-v1.0.0.zip | head -20
   ```

5. **Check ZIP file size:**
   - Target: <1 MB (Chrome Web Store rejects >1 MB extensions)
   - Expected: 200-500 KB (bundled React + icons)
   - If >1 MB: check for node_modules or unminified code

6. **Final checklist before submitting:**
   - [ ] ZIP file created: `conduitscore-extension-v1.0.0.zip`
   - [ ] ZIP is <1 MB
   - [ ] Verified no .ts, .tsx, .map, .env, node_modules files inside
   - [ ] All required files present (manifest, popup, service-worker, content-script, icons)
   - [ ] Icons all present (16, 32, 48, 128)

---

## 4. Pre-Submission Checklist

**Complete this checklist before uploading to Chrome Web Store on Monday 4/7.**

### 4.1 Metadata & Content

| Item | Requirement | Status | Evidence |
|------|-------------|--------|----------|
| **Extension Name** | "ConduitScore" (exact) | [ ] | manifest.json "name" field |
| **Short Name** | "ConduitScore" (≤12 chars) | [ ] | manifest.json "short_name" field |
| **Version** | "1.0.0" (semantic versioning) | [ ] | manifest.json "version" field |
| **Description (short)** | ≤132 characters (required for CWS) | [ ] | See 4.2 below for exact text |
| **Detailed Description** | ≤4,400 characters (max CWS allows) | [ ] | See 4.2 below for exact text |
| **Developer/Publisher Name** | Company name or legal entity | [ ] | To be filled in CWS form |
| **Website Link** | https://conduitscore.com | [ ] | manifest.json "homepage_url" field |

### 4.2 Description Copy

**Short Description (132 chars max — for CWS listing):**
```
Instantly check any domain's trust score — SSL, security, redirects, performance, and accessibility in one click.
```
Character count: 112 characters ✅ (under 132 limit)

**Detailed Description (4,400 chars max — for CWS store page):**
```
ConduitScore gives you instant insight into any domain's trustworthiness and technical quality.

With one click, get a comprehensive security and performance audit:

✓ SSL/TLS Certificate Validation — Verify HTTPS security
✓ Security Headers — Check for HSTS, X-Frame-Options, CSP
✓ Redirect Chain Analysis — Detect suspicious redirects
✓ Web Performance Metrics — Page load optimization
✓ Accessibility Score — WCAG compliance check

How it works:
1. Click the ConduitScore icon or right-click any link
2. Enter a domain (or we'll auto-fill the current page)
3. Get an instant A-F grade plus detailed category breakdown
4. Results are cached for 1 hour — instant lookups on repeat visits

Perfect for:
- Security researchers auditing websites
- Marketing teams vetting partner domains
- Developers checking third-party services
- Anyone who needs to trust a domain before visiting

No tracking, no analytics — just pure domain intelligence.

Privacy: We only read the domain you're checking. We don't read page content, store browsing history, or track usage.
```
Character count: ~950 characters ✅ (well under 4,400 limit)

### 4.3 Permission Justifications

**Each permission must have a clear justification for CWS reviewers. Copy these exactly into the submission form:**

| Permission | Justification (for CWS) |
|---|---|
| `activeTab` | Read the domain of the currently active tab when the user clicks the extension icon or triggers a context menu action. We never read page content — only the tab's hostname. |
| `storage` | Cache domain scan results locally (with 1-hour TTL) to avoid redundant API calls and provide instant repeat lookups on the same domain. |
| `contextMenus` | Add "Check ConduitScore for this page" and "Check ConduitScore for this link" right-click options for convenient domain checking. |
| `scripting` | Inject a minimal content script to extract the hostname from the active tab on demand. The script does not read, modify, or transmit any page content. |
| `host_permissions` | Required to call fetch() from the service worker to the ConduitScore public API (https://conduitscore.com). Scoped to conduitscore.com only. |

### 4.4 Visual Assets

**Icons:**
- [ ] icon-16.png — 16×16 pixels, PNG format, transparent background (if applicable)
- [ ] icon-32.png — 32×32 pixels, PNG format
- [ ] icon-48.png — 48×48 pixels, PNG format
- [ ] icon-128.png — 128×128 pixels, PNG format (used in Chrome Web Store listing)

**All icons must:**
- ✅ Match ConduitScore brand (color, logo)
- ✅ Be crisp at each size (no pixelation)
- ✅ Use consistent design language

**Verification command:**
```bash
# Check icon dimensions
file dist/icons/icon-*.png
# Output should show: 16x16, 32x32, 48x48, 128x128
```

### 4.5 Screenshots (CWS Listing)

**Required: At least 1 screenshot. Recommended: 2-4 screenshots.**

**Specifications:**
- Size: 1280×800 or 1280×720 pixels (widescreen format recommended)
- Format: PNG or JPEG
- Max 5 screenshots per CWS

**Suggested screenshot sequence:**

1. **Screenshot 1: Popup with Domain Input**
   - Show empty popup with domain input field focused
   - Text: "Enter any domain to check its security score"
   - Dimensions: 1280×720

2. **Screenshot 2: Results Display**
   - Show completed scan with grade badge (A), score (85), and category breakdown
   - Highlight the color-coded categories (green=good, red=bad)
   - Dimensions: 1280×720

3. **Screenshot 3: Right-Click Context Menu**
   - Show browser with right-click menu open
   - Highlight "Check ConduitScore for this page" option
   - Dimensions: 1280×720

4. **Screenshot 4: Mobile View (Optional)**
   - Show extension popup on mobile Chrome
   - Demonstrate responsive design
   - Dimensions: 540×960 (portrait)

**Creating screenshots:**
- Open Chrome DevTools
- Right-click popup → "Inspect"
- In DevTools, click device toolbar icon to set viewport to 1280×720
- Go full-screen or capture just the extension area
- Use built-in screenshot tool or external tool (Greenshot, Snagit, etc.)
- Save as PNG in `screenshots/` folder

### 4.6 Privacy Policy

**Required for submission:** Link to privacy policy

**Placeholder (customize for your company):**
```
https://conduitscore.com/privacy-policy
```

**Minimum policy requirements (CWS mandate):**
- Explain what data is collected (should be minimal: just domain name)
- Explain how data is used
- Explain data retention (e.g., cached 1 hour, no long-term storage)
- Explain user rights (e.g., no tracking, no analytics)
- Include contact info for privacy inquiries

**Template:**
```
ConduitScore Privacy Policy

Data Collected: The domain name you enter or the domain of the page you're viewing.

How We Use It: We send the domain to our API to generate a security and performance score. The result is cached locally in your browser for 1 hour.

Data Retention: Results are cached locally for 1 hour only. No domain names, IP addresses, or usage data are stored on our servers long-term.

No Tracking: We do not collect analytics, user IDs, or browsing history.

Contact: privacy@conduitscore.com
```

### 4.7 Additional CWS Requirements

- [ ] **Verified Developer Account:** CWS developer account created (if not already done)
- [ ] **Payment Method on File:** Credit/debit card (one-time $5 developer fee to publish)
- [ ] **Accepted CWS Program Policies:** Extension complies with CWS policies (no malware, no deceptive practices, etc.)
- [ ] **Category Selection:** Select "Productivity" or "Developer Tools" (category for extension)
- [ ] **Language:** Set to English
- [ ] **Availability:** Check if extension should be available in specific countries/regions (typically worldwide)

---

## 5. Submission Process Walkthrough

**Complete on Monday 4/7. Estimated time: 20-30 minutes.**

### 5.1 Pre-Submission (5 minutes)

1. **Confirm all tests passed:**
   - QA Lead reviews test results from Friday 4/4
   - If any critical tests failed, return to development (do NOT submit)
   - Mark approval in sign-off section (Section 8)

2. **Verify submission package:**
   ```bash
   ls -lh conduitscore-extension-v1.0.0.zip
   # Should show ~200-500 KB
   ```

3. **Prepare documentation:**
   - Have description copy (Section 4.2) ready to copy-paste
   - Have permission justifications (Section 4.3) ready
   - Have screenshots saved in a folder
   - Have privacy policy URL ready

### 5.2 Step 1: Create/Access Chrome Web Store Developer Account

**If account already exists, skip to Step 2.**

1. Navigate to: https://chrome.google.com/webstore/devconsole

2. Sign in with company Google account (or create one)

3. Complete registration:
   - Accept CWS Developer Agreement
   - Verify email address
   - Set up developer profile
   - Add payment method (one-time $5 fee)

4. Once registered, you'll see "Developer Console" dashboard

### 5.3 Step 2: Create New Extension Item

1. In **Chrome Web Store Developer Console**, click **"Create new item"** button (blue, upper right)

2. System prompts: "Upload your app"
   - Click **"Choose file"** button
   - Select: `conduitscore-extension-v1.0.0.zip`
   - Click **"Open"** (or equivalent)

3. System processes ZIP file (~30 seconds)
   - If successful, you see: "Your app has been saved as a draft"
   - If error (e.g., missing manifest.json), fix and re-upload

4. You're now on the **"Edit item" page** with tabs:
   - Store listing (currently active)
   - Detailed information
   - Graphic assets
   - Stores
   - Availability
   - Tracking

### 5.4 Step 3: Fill "Store Listing" Tab

**Section: Store Listing**

1. **Name:** Pre-filled with manifest.json value. Verify: "ConduitScore"

2. **Short description:**
   - Paste from Section 4.2 (112 character version)
   - CWS shows character count (must be ≤132)
   - ✅ Confirm under limit

3. **Detailed description:**
   - Paste from Section 4.2 (detailed version)
   - CWS shows character count (must be ≤4,400)
   - ✅ Confirm under limit

4. **Developer:**
   - Company/legal name (e.g., "ConduitScore Labs")

5. **Support website:**
   - Enter: `https://conduitscore.com`

6. **Privacy policy URL:**
   - Enter: `https://conduitscore.com/privacy-policy`
   - ✅ Verify URL is live and accessible (CWS will check)

7. **Support email:**
   - Enter company support email

8. **Click "Save" button**

### 5.5 Step 4: Fill "Detailed Information" Tab

1. Click **"Detailed information"** tab

2. **Language:**
   - Select: English

3. **Category:**
   - Select: "Productivity" (or "Developer Tools" — both acceptable)

4. **Maturity rating:**
   - Select: "Everyone" (no adult content)

5. **Permissions justification:**
   - CWS shows list of all permissions from manifest.json
   - For each permission, enter justification from Section 4.3
   - Example:
     ```
     activeTab: Read the domain of the currently active tab...
     storage: Cache domain scan results locally...
     ```

6. **Manage permissions groups:**
   - Add detailed explanations if prompted
   - Copy from Section 4.3 word-for-word

7. **Click "Save"**

### 5.6 Step 5: Upload Graphic Assets

1. Click **"Graphic assets"** tab

2. **Extension icon (128×128):**
   - Click "Choose file"
   - Upload: `icon-128.png` from your dist/ folder
   - CWS should auto-resize other sizes if needed
   - ✅ Verify icon appears in preview

3. **Screenshots (1280×800 or 1280×720):**
   - Click "Add screenshot" button
   - Upload screenshot 1 (domain input)
   - Click "Add screenshot" again
   - Upload screenshot 2 (results display)
   - *Optional:* Upload screenshot 3 and 4
   - ✅ Maximum 5 screenshots

4. **Preview (optional):**
   - Scroll down to see how listing will appear in Chrome Web Store
   - Verify icon, description, screenshots all visible and correct

5. **Click "Save"**

### 5.7 Step 6: Review & Submit

1. Click **"Stores"** tab (or review all tabs one final time)

2. **Availability:**
   - Select regions/countries where extension should be available
   - Default: "Available in all countries" ✅

3. **Final review:**
   - Go back to each tab and verify:
     - ✅ Store Listing: All fields filled, descriptions accurate
     - ✅ Detailed Information: Category, permissions, maturity rating set
     - ✅ Graphic Assets: Icon and screenshots uploaded
   - Verify no red errors or warnings (may have warnings — minor ones are OK)

4. **Submit for Review:**
   - Look for blue **"Submit for review"** button (should be visible on one of the tabs, usually Stores or top of page)
   - Click **"Submit for review"**

5. **Confirmation page:**
   - System shows: "Submission successful" or "Extension submitted for review"
   - You'll receive email confirmation
   - Status changes to: "Pending review"
   - Save the **extension ID** (looks like: `abcdefghijklmnopqrstuvwxyz123456`) — you'll need this for communication with reviewers

### 5.8 Post-Submission

**You will receive an email from Google Chrome Web Store with:**
- Extension ID
- Submission confirmation
- Link to track review status

**Status pages to monitor:**
- **Chrome Web Store Developer Console:** Shows "Pending review" status
- **Email notifications:** Google will email if more info is needed or if approved/rejected

---

## 6. Review Response Protocol

### 6.1 Expected Review Timeline

| Phase | Timeline | What Happens |
|-------|----------|---|
| **Submission** | Monday 4/7 afternoon | Extension uploaded, appears as "Pending review" |
| **Automated checks** | 30 min - 2 hours | Google's automated security & policy scanners run |
| **Human review** | 6-48 hours | Actual person reviews extension code, permissions, assets |
| **Decision** | Typically 24-48 hours after submission | Approved, rejected, or "needs more info" |
| **If rejected** | Day 2-3 (Wed 4/9 or later) | QA lead receives rejection email with reason |
| **Resubmission** | Within 5 days | Can resubmit fixes and re-apply |

### 6.2 Approval Notification

**If APPROVED**, Google emails:
```
Subject: Your extension "ConduitScore" has been approved

Your extension has been approved and is now available in the Chrome Web Store.
Extension ID: abcdefghijklmnopqrstuvwxyz123456
View your listing: https://chrome.google.com/webstore/detail/conduitscore/abcdefghijklmnopqrstuvwxyz123456
```

**Next steps if approved:**
1. Extension automatically appears on Chrome Web Store (may take 30 min - 2 hours)
2. Users can discover and install via Web Store search
3. QA Lead posts announcement to team Slack/email
4. Mark sign-off section (Section 8) as "APPROVED"

### 6.3 Rejection Scenarios & Common Reasons (MV3 Extensions)

**Most common rejection reasons for MV3 extensions:**

| Reason | What It Means | Recovery |
|--------|---|---|
| **Overly broad permissions** | manifest.json requests `<all_urls>` instead of specific domains | Reduce `host_permissions` to just `conduitscore.com` (already correct in spec) |
| **Unclear permission justifications** | You didn't explain WHY each permission is needed | Reference Section 4.3 exactly — be specific, not vague |
| **Missing privacy policy** | URL provided doesn't work or doesn't explain data handling | Ensure URL is live, contains data collection & retention info |
| **Icon/assets missing or incorrect size** | 128×128 icon not 128×128, or missing | Verify all icons: icon-16.png, icon-32.png, icon-48.png, icon-128.png at exact sizes |
| **Misleading description** | Description claims things the extension doesn't do | Ensure description only covers: score, grades, categories, caching — nothing exaggerated |
| **Detected malware or suspicious code** | Automated scanner flagged something in bundled code | Rare for legitimate React bundles; check for malware in dependencies via `npm audit` |
| **Violates CWS policy** | Extension does something against Google's rules | Common: phone-home abuse, tracking, deceptive practices (shouldn't apply here) |
| **CSP violation** | Content Security Policy too permissive or missing | Verify manifest.json has: `"content_security_policy": {"extension_pages": "script-src 'self'; object-src 'self'"}` |

### 6.4 How to Respond to Rejection Email

**When rejection email arrives:**

1. **Read the email carefully.** Google provides specific reason(s) for rejection.

2. **Identify the issue(s):**
   - Missing privacy policy? → Write one, upload to live server
   - Icon size wrong? → Re-create icon at correct size
   - Permission justification unclear? → Use Section 4.3 wording
   - Code issue? → Check for dependencies, run `npm audit`, rebuild

3. **Fix the issue:**
   - If packaging: fix dist/, rebuild, create new ZIP
   - If metadata: log back into CWS console, edit Store Listing tab
   - If policy: publish privacy policy, test URL works

4. **Re-submit:**
   - If code changed: upload new ZIP file in CWS console (click "Edit item" → replace ZIP)
   - If only metadata: save changes in Store Listing/Detailed Tabs, re-submit
   - Click **"Submit for review"** again

5. **Log your response:**
   - Document in Section 8 what the issue was and how you fixed it
   - Email QA team lead to confirm re-submission sent

### 6.5 Rejection Recovery Checklist

**Use this if rejected. Complete within 5 days to meet deadline.**

| Action | Responsible | Done |
|--------|-------------|------|
| Read rejection email and identify specific reason(s) | QA Lead | [ ] |
| Map reason to recovery action (see table below) | QA Lead | [ ] |
| Fix the issue | Frontend Lead (code) / QA Lead (metadata) | [ ] |
| Rebuild & test (if code changed) | Frontend Lead | [ ] |
| Log into CWS console and update item | QA Lead | [ ] |
| Re-submit for review | QA Lead | [ ] |
| Document re-submission in Section 8 | QA Lead | [ ] |
| Monitor email for approval/next rejection | QA Lead | [ ] |

**Rejection recovery decision tree:**

```
Rejection received
  │
  ├─ "Permissions not justified"
  │   └─→ Open CWS console → Edit item → Detailed Information tab
  │       → For each permission, paste exact justification from Section 4.3
  │       → Save and re-submit
  │
  ├─ "Privacy policy missing/broken"
  │   └─→ Publish privacy policy at https://conduitscore.com/privacy-policy
  │       → Test link is accessible & describes data handling
  │       → Log into CWS console → Edit item → Store Listing tab
  │       → Update privacy policy URL if different
  │       → Save and re-submit
  │
  ├─ "Icon size incorrect"
  │   └─→ Re-create icons at exact sizes: 16×16, 32×32, 48×48, 128×128
  │       → Log into CWS console → Edit item → Graphic assets tab
  │       → Replace icon files
  │       → Save and re-submit
  │
  ├─ "Description misleading"
  │   └─→ Open CWS console → Edit item → Store Listing tab
  │       → Revise description to only claim what extension actually does
  │       → Use Section 4.2 text (already vetted)
  │       → Save and re-submit
  │
  ├─ "Code flagged as malware/suspicious"
  │   └─→ Run: npm audit (check for known vulnerabilities in dependencies)
  │       → Rebuild extension: npm run build
  │       → Create new ZIP, upload to CWS
  │       → Save and re-submit
  │
  └─ "Policy violation" (tracking, deception, etc.)
      └─→ Verify extension only does: score lookup, caching, badge update
          → Remove any analytics/tracking code if present
          → Rebuild and re-submit
          → If persists, escalate to team lead
```

---

## 7. Rejection Recovery & Resubmission

### 7.1 Timeline Constraints

| Deadline | Outcome |
|----------|---------|
| **Submit:** Monday 4/7 | ✅ On schedule |
| **Approved by:** Wednesday 4/9 EOD | ✅ Live by Thursday 4/10 ✅ |
| **First rejection:** Wednesday 4/9 | 5-day window to fix and resubmit |
| **Resubmit by:** Monday 4/14 | ✅ Stays within reasonable timeline |
| **Approved by:** Wednesday 4/16 | ℹ️ Later, but still acceptable |
| **If second rejection:** Wednesday 4/16 | ⚠️ Getting tight — escalate |

**Rule of thumb:** First rejection is normal; resubmit same day if possible, within 24 hours maximum.

### 7.2 Resubmission Process

**Step-by-step (mirrors Section 5 but with edits):**

1. **Fix the identified issue** (see Section 6.5 decision tree)

2. **If code changed:**
   - Rebuild: `npm run build`
   - Create new ZIP: `zip -r conduitscore-extension-v1.0.1.zip dist/*` (bump version)
   - Verify ZIP contains fixes, no source files

3. **Log into CWS console**
   - https://chrome.google.com/webstore/devconsole
   - Find your "ConduitScore" item
   - Click **"Edit item"**

4. **If code changed:**
   - Find **"Package"** section (may be under "Graphic assets" or main page)
   - Click **"Upload new package"** or **"Replace file"**
   - Select new ZIP file
   - Wait for processing (~30 seconds)

5. **If only metadata changed:**
   - Edit **Store Listing** or **Detailed Information** tabs
   - Make corrections (e.g., better permission justifications)
   - Click **"Save"**

6. **Final review:**
   - Verify all changes appear correct
   - Check for any new warnings/errors

7. **Re-submit:**
   - Click **"Submit for review"** button
   - Confirmation: "Submitted for review"

8. **Monitor:**
   - Expect email within 24-48 hours
   - Log status in Section 8

### 7.3 Second Rejection (Escalation)

If the extension is rejected a **second time** after resubmission:

1. **Do not assume the fix was correct.** Re-read the rejection reason carefully.

2. **Escalate to team lead** with:
   - Original rejection reason (first)
   - Your fix
   - New rejection reason (second)
   - Evidence of what you changed
   - Request for guidance

3. **Possible outcomes:**
   - Policy issue → may need to pivot extension features
   - Compliance issue → legal/privacy review needed
   - Technical issue → engineering escalation

4. **If multiple rejections occur, consider:**
   - Withdrawing and resubmitting with different description/assets
   - Publishing as unlisted (share link directly) temporarily
   - Escalating to CWS support via appeal

---

## 8. Sign-Off Tracking

**QA Lead: Complete this section as you progress through testing and submission.**

### 8.1 Test Sign-Off (Friday 4/4)

**QA Lead responsible.** Ensure all tests executed and passed.

- [ ] **Functional tests (F-001 to F-010):** ___/10 PASSED
  - Comments: ________________

- [ ] **Edge case tests (E-001 to E-015):** ___/15 PASSED
  - Comments: ________________

- [ ] **UI tests (U-001 to U-010):** ___/10 PASSED
  - Comments: ________________

- [ ] **Accessibility tests (A-001 to A-015):** ___/15 PASSED
  - Comments: ________________

**Overall Test Result:**
- [ ] ✅ **ALL TESTS PASSED** → Proceed to submission preparation
- [ ] ⚠️ **Some tests failed** → Return to dev, identify critical vs non-critical issues
- [ ] ❌ **Critical tests failed (F-001, F-003, A-001, A-009)** → DO NOT SUBMIT

**QA Lead Sign-Off:**
```
Tested by: ___________________
Date: ___________________
Result: ✅ APPROVED for submission OR ❌ FAILED (needs fixes)
Signature: ___________________
```

### 8.2 Pre-Submission Verification (Monday 4/7 morning)

**QA Lead responsible.** Confirm all assets ready before uploading to CWS.

- [ ] manifest.json validated (correct permissions, no errors)
- [ ] dist/ folder clean (no .ts, .tsx, .map, .env, node_modules)
- [ ] conduitscore-extension-v1.0.0.zip created and verified (<1 MB)
- [ ] Description copy (short & detailed) ready
- [ ] Permission justifications copied and ready
- [ ] Privacy policy URL verified (link works)
- [ ] Screenshots captured (1280×720, at least 2)
- [ ] All icons present (icon-16.png, icon-32.png, icon-48.png, icon-128.png)
- [ ] CWS developer account accessible (logged in, payment on file)

**QA Lead Sign-Off:**
```
Verified by: ___________________
Date: ___________________
Time: ___________________
All checklist items: ✅ COMPLETED
Ready to submit: ✅ YES / ❌ NO
Signature: ___________________
```

### 8.3 Submission Confirmation (Monday 4/7 afternoon)

**QA Lead responsible.** Log submission details for tracking.

- [ ] Extension uploaded to CWS
- [ ] Store Listing tab completed
- [ ] Detailed Information tab completed
- [ ] Graphic Assets tab completed
- [ ] Submitted for review (button clicked)

**Submission Details:**
```
Extension Name: ConduitScore
Extension ID: _____________________________________
Submission Date: Monday, April 7, 2026
Submission Time: ___________________
Submitted by: _____________________________________
Status: ✅ SUBMITTED / ❌ UPLOAD FAILED
Email confirmation received: ✅ YES / ⏳ PENDING

If upload failed, reason: _____________________________________
Next action: _____________________________________
```

### 8.4 Review Monitoring (Mon 4/7 - Thu 4/10)

**QA Lead responsible.** Monitor for approval/rejection emails.

- [ ] Monday 4/7: Automated checks running
- [ ] Tuesday 4/8: Human review in progress
- [ ] Wednesday 4/9: Decision expected
  - [ ] ✅ **APPROVED** (see 8.5)
  - [ ] ❌ **REJECTED** (see 8.6)
  - [ ] ⏳ Still under review (see 8.7)
- [ ] Thursday 4/10: Final decision deadline

**Status Notes:**
```
Last checked: _____________________________________
Current status: Pending / Approved / Rejected
Notes: _____________________________________
```

### 8.5 Approval Sign-Off (If Approved)

**QA Lead responsible.** Log approval details.

- [ ] Approval email received
- [ ] Extension appears in Chrome Web Store (verify link)
- [ ] Users can install and use extension
- [ ] Team notified of launch

**Approval Details:**
```
Approval Email Date: _____________________________________
Extension ID: _____________________________________
Chrome Web Store Link: https://chrome.google.com/webstore/detail/conduitscore/[ID]
Live Date: _____________________________________
Notification sent to: _____________________________________
Status: ✅ LIVE / ⏳ PROPAGATING

Public announcement: ✅ Posted to Slack / ❌ Pending
```

### 8.6 Rejection Response (If Rejected)

**QA Lead responsible.** Log rejection details and recovery plan.

- [ ] Rejection email received
- [ ] Reason identified and documented
- [ ] Recovery action planned (see Section 6.5)

**Rejection Details:**
```
Rejection Email Date: _____________________________________
Rejection Reason: _____________________________________

Root Cause: _____________________________________
Recovery Action: _____________________________________
Responsible Person: _____________________________________
ETA for Fix: _____________________________________
Resubmission Planned Date: _____________________________________
```

**Recovery Checklist:**
- [ ] Issue fixed in code or metadata
- [ ] New ZIP created (if code changed) or metadata updated
- [ ] Verified fix is correct before re-upload
- [ ] Re-submitted to CWS
- [ ] Status: ✅ RESUBMITTED / ❌ PENDING FIX

### 8.7 Still Under Review (If Not Decided by Wed 4/9)

**QA Lead responsible.** Confirm review is still in progress.

```
Last Status Check Date: _____________________________________
CWS Console Status: Pending Review
Notes: Google's review SLA is 24-48 hours. If 48+ hours and no decision,
       check for missed review emails. If still pending after 3 days,
       escalate to Google CWS support.

Support Contact: _____________________________________
Escalation Date (if needed): _____________________________________
```

### 8.8 Final Go/No-Go Decision (By Thursday 4/10)

**Engineering Lead + QA Lead + Product Owner decision.**

- [ ] ✅ **GO:** Extension approved and live (or on schedule to be live)
  - Users can install from Chrome Web Store
  - Marketing launch can proceed
  - Social media/press release ready to distribute

- [ ] ⚠️ **YELLOW:** Extension approved but delayed
  - Timeline: Will be live by ___________________
  - Risk: Low / Medium / High
  - Contingency: _____________________________________

- [ ] ❌ **NO-GO:** Extension rejected or multiple issues
  - Reason: _____________________________________
  - Decision: Rework and resubmit / Pause / Cancel
  - Next steps: _____________________________________

**Final Sign-Off:**
```
Go/No-Go Decided by:
- _____________________ (Engineering Lead)
- _____________________ (QA Lead)
- _____________________ (Product Owner)

Date: _____________________________________
Time: _____________________________________
Decision: ✅ GO / ⚠️ YELLOW / ❌ NO-GO
Signature: _____________________________________
```

---

## Summary

This plan provides:

1. ✅ **QA Test Plan** — 40 functional, edge case, UI, and accessibility tests
2. ✅ **Submission Package Guide** — Exact files to include/exclude, how to create ZIP
3. ✅ **Pre-Submission Checklist** — Metadata, descriptions, assets, justifications
4. ✅ **Submission Walkthrough** — Step-by-step instructions for CWS console (6 steps)
5. ✅ **Review Response Protocol** — Timeline, approval/rejection scenarios, common reasons
6. ✅ **Rejection Recovery** — Decision tree for fixes, resubmission process
7. ✅ **Sign-Off Tracking** — Progress tracking from testing through approval

**QA Lead:** Execute this plan without clarification. If questions arise, refer to the Chrome Extension Spec (task-009) or escalate to Frontend Lead.

**Success Criteria:** Extension submitted by Monday 4/7, approved by Thursday 4/10, live in Chrome Web Store.

---

**END OF PLAN**

**Document prepared for:** QA Lead (Primary) + Frontend Lead (Support)
**Date prepared:** 2026-03-24
**Status:** Ready for execution
**Confidence:** 9.5/10 (based on MV3 standards and CWS requirements)
