# ConduitScore Chrome Extension — Submission Packet

**Version:** 1.0.0
**Prepared:** 2026-04-16
**Status:** READY FOR MANUAL UPLOAD
**Upload this:** `conduitscore-extension-v1.0.0.zip` (64 KB)
**Path:** `C:\Users\Administrator\Desktop\ConduitScore\Extensions\conduitscore-extension\conduitscore-extension-v1.0.0.zip`

---

## 1. Before You Start (10 min)

### 1a. Ship the privacy page first
The privacy page was updated this session to add Chrome-extension-specific sections (data collected, retention, user rights). CWS reviewers will fetch `https://conduitscore.com/privacy` and verify it actually describes how the extension handles data. You must deploy the updated page **before** submitting.

- [ ] Run `git status` — if `src/app/privacy/page.tsx` shows as modified, commit and push:
  ```bash
  cd /c/Users/Administrator/Desktop/ConduitScore
  git add src/app/privacy/page.tsx
  git commit -m "privacy: add Chrome extension scope, data handling, retention"
  git push origin main
  ```
- [ ] Wait ~60–90 seconds for Vercel to finish auto-deploying
- [ ] Open `https://conduitscore.com/privacy` in an **incognito tab** (bypasses cache) and confirm the section **"2.0 Chrome Extension — Data Collected"** is visible
- [ ] If the section is missing, the deploy hasn't finished — wait another minute and reload

### 1b. CWS account + packet prep
- [ ] Open https://chrome.google.com/webstore/devconsole — log in with the Google account that owns (or will own) the listing
- [ ] If first time: pay the one-time $5 developer registration fee
- [ ] Have this file open in a second window — you will copy-paste from it

---

## 2. Upload the ZIP

1. In the CWS dashboard, click **"Create new item"** (top-right).
2. Choose file → select `conduitscore-extension-v1.0.0.zip` (path above).
3. Wait ~30 seconds for "Your app has been saved as a draft".

---

## 3. Store Listing Tab

### Name
```
ConduitScore
```

### Short description (paste exactly — 111 characters)
```
Check any domain's trust score instantly — SSL, headers, performance, and accessibility in one click.
```

### Detailed description (paste exactly)
```
ConduitScore gives you an instant trust score for any domain, right from your browser.

WHAT IT CHECKS
• SSL Certificate — Is the domain running a valid, non-expired certificate?
• Redirect Chain — Does the domain redirect cleanly without excess hops?
• Security Headers — Are modern HTTP security headers in place?
• Performance — What is the server response time?
• Accessibility — Does the page meet baseline accessibility standards?

HOW TO USE
1. Click the ConduitScore icon to check your current tab's domain
2. Or right-click any link and choose "Check ConduitScore for this link"
3. Results appear instantly with a 0–100 score, an A–F grade, and category breakdowns

FEATURES
• Instant badge: The extension icon badge shows the score at a glance
• Cached results: Repeat lookups are served from local cache for speed
• Open in ConduitScore: One click to view full scan details on conduitscore.com
• No account required for public scans

PRIVACY
ConduitScore does not read page content, track your browsing history, or collect personal data. The only data sent to conduitscore.com is the domain you explicitly choose to scan. See our privacy policy at https://conduitscore.com/privacy.
```

### Developer name
```
ConduitScore
```
(Or your legal company name — match what's on your CWS developer account.)

### Support email
```
support@conduitscore.com
```
(Or `benstone@conduitscore.com` if that's what the domain is set up for.)

### Website
```
https://conduitscore.com
```

### Privacy policy URL
```
https://conduitscore.com/privacy
```

Click **Save**.

---

## 4. Detailed Information Tab

### Language
`English`

### Category
`Productivity`

### Maturity rating
`Everyone`

### Single-purpose description (paste exactly)
```
ConduitScore checks the trust score of any domain as explicitly requested by the user via the popup or context menu. The extension makes one type of external request: a GET request to the ConduitScore public API with the domain the user provided. It does not read page content, modify the DOM, or access any data beyond the tab URL. The single purpose is: show a domain trust score on demand.
```

### Permission justifications
Paste each one into the matching permission field:

**`activeTab`**
```
Read the domain of the currently active tab when the user clicks the extension icon or triggers a context menu action. We never read page content — only the tab's hostname.
```

**`storage`**
```
Cache domain scan results locally (TTL = 1 hour) to avoid redundant API calls and provide instant repeat lookups for the same domain.
```

**`contextMenus`**
```
Add "Check ConduitScore for this page" and "Check ConduitScore for this link" right-click options so users can check a domain without opening the popup.
```

**`scripting`**
```
Inject a minimal content script to extract the hostname from the active tab on demand. The script does not read, modify, or transmit any page content.
```

**`host_permissions` (https://conduitscore.com/*)**
```
Required to call fetch() from the service worker to the ConduitScore public API. Scoped to conduitscore.com only.
```

Click **Save**.

---

## 5. Graphic Assets Tab

### Store icon (128×128)
Upload: `store-assets\store-icon.png`
- Full path: `C:\Users\Administrator\Desktop\ConduitScore\Extensions\conduitscore-extension\store-assets\store-icon.png`
- 128×128 PNG, transparent, no rounded corners (CWS applies its own radius)

### Screenshots (1280×720 each — minimum 1, upload all 3)

1. `store-assets\screenshots\screenshot-1-empty-popup.png`
   - Caption: *"Check any domain's trust score in one click"*
2. `store-assets\screenshots\screenshot-2-results.png`
   - Caption: *"Get instant SSL, security, performance, and accessibility scores"*
3. `store-assets\screenshots\screenshot-3-context-menu.png`
   - Caption: *"Check any link with right-click"*

Full paths (for the file picker):
```
C:\Users\Administrator\Desktop\ConduitScore\Extensions\conduitscore-extension\store-assets\screenshots\screenshot-1-empty-popup.png
C:\Users\Administrator\Desktop\ConduitScore\Extensions\conduitscore-extension\store-assets\screenshots\screenshot-2-results.png
C:\Users\Administrator\Desktop\ConduitScore\Extensions\conduitscore-extension\store-assets\screenshots\screenshot-3-context-menu.png
```

Click **Save**.

---

## 6. Availability / Stores Tab

### Distribution
`Public`

### Countries
`Available in all countries` (default)

---

## 7. Final Submit

1. Scroll back through each tab and confirm no red warnings.
2. Click **"Submit for review"**.
3. Save the extension ID from the confirmation page — looks like `abcdefghijklmnopqrstuvwxyz123456`.
4. Record it below:

```
Extension ID: _______________________________________
Submission timestamp: _______________________________________
```

---

## 8. After Submission

- **Expected review time:** 24-48 hours
- **Watch for email from:** Chrome Web Store <noreply@google.com>
- **Monitor:** https://chrome.google.com/webstore/devconsole → your item → Status column

### If approved
Public listing URL will be:
`https://chrome.google.com/webstore/detail/conduitscore/[extension-id]`

### If rejected
Read the reason carefully, then consult the **Rejection Recovery decision tree** in `TASK_010_QA_CHROME_WEB_STORE_PLAN.md` §6.5. Most rejections are metadata issues, not code issues — you can usually fix in the dashboard without rebuilding the ZIP. Resubmit within 24 hours.

---

## 9. Manual QA Still Required (Do Before Or Immediately After Submission)

Per `QA_REPORT.md`, 10 tests need a human:

- [ ] Load `dist/` as unpacked extension, click the icon — popup opens (F-001)
- [ ] Right-click a web page → "Check ConduitScore for this page" appears (F-008)
- [ ] Right-click a hyperlink → "Check ConduitScore for this link" appears (F-009)
- [ ] Run NVDA or VoiceOver through the popup — input label announced, button announced, error announced, results announced (A-004..A-008)
- [ ] Open two tabs, scan one, switch back — badge persists (tab-scoped badge restoration)

Takes ~30-45 min. Not blocking for submission but highly recommended before public launch.

---

## 10. Build Artifacts (For Your Records)

| File | Path | Size |
|------|------|------|
| Submission ZIP | `conduitscore-extension-v1.0.0.zip` | 64 KB |
| Manifest | `dist/manifest.json` | 1.4 KB |
| Service worker | `dist/service-worker.js` | 4.6 KB |
| Popup bundle | `dist/popup.js` | 166 KB |
| Content script | `dist/content-script.js` | 140 B |
| QA report | `QA_REPORT.md` | 40 tests PASS, 0 blockers |
| Pre-submission checklist | `PRE_SUBMISSION_CHECKLIST.md` | All ✅ |
| Privacy policy | Live at `https://conduitscore.com/privacy` | |

---

## 11. Recent Changes

**Applied after QA review (2026-04-16):**
- Removed `https://staging.conduitscore.com/*` and `https://*.conduitscore.com/*` from `host_permissions` — now scoped to production only to avoid CWS "overly broad permissions" flag
- Rebuilt + re-zipped

---

**You are ready to submit.** Open https://chrome.google.com/webstore/devconsole and follow sections 2 through 7 above in order. Total time: ~20 minutes.
