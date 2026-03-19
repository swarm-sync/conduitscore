# MATRIX.md — Morphological Matrix
# ConduitScore: Free vs. Paid Information Gate

---

## Matrix Structure: 5 Dimensions x 5 Options Each

Each cell is one discrete, implementable option. Options are ordered from least to most generous toward the free user.

---

## Dimension A: Score Information Shown Free
*What numeric/grade data does an anonymous or free user see?*

| Code | Option | Description |
|------|--------|-------------|
| A1 | Overall score only | Single 0-100 number. No category breakdown. |
| A2 | Score + category names | Score plus the 7 category labels with no values. |
| A3 | Score + category scores | Full 7-category breakdown with individual scores. |
| A4 | Score + categories + top 3 issue count | A3 plus a count of how many issues exist in each category. |
| A5 | All score data | A4 plus severity distribution (X critical, Y warning, Z info). |

**Constraint note:** A3 and above require zero additional infrastructure. A1-A2 require UI work to hide data already computed. The cost is implementation effort, not data access.

---

## Dimension B: Issue Detail Level Shown Free
*How much does a free user learn about each specific issue?*

| Code | Option | Description |
|------|--------|-------------|
| B1 | Count only | "You have 14 issues." No names, no categories. |
| B2 | Issue names only | Full list of issue titles. No descriptions, no severity labels. |
| B3 | Names + severity labels | B2 plus Critical/Warning/Info tag on each issue. |
| B4 | Names + severity + one-line description | B3 plus a single explanatory sentence per issue. |
| B5 | Full issue descriptions | Complete title, severity, and multi-paragraph description for all issues. |

**Constraint note:** B5 is the current state. B3 is the recommended anchor — severity without description leaves the user informed but not equipped.

---

## Dimension C: Fix Information Shown Free
*What implementation content does a free user receive?*

| Code | Option | Description |
|------|--------|-------------|
| C1 | None | Issues identified; fixes exist but are entirely invisible. |
| C2 | Fix titles only | Each issue links to a fix with a title. No description, no code. |
| C3 | Fix titles + blurred code blocks | Title visible, code block rendered but blurred/obscured, character count shown. |
| C4 | Fix titles + descriptions + one complete code block (sample fix) | C2 plus full descriptions for all fixes, but code only for one sample fix (lowest-severity, highest-volume category). |
| C5 | All fixes with full code | Current state. Complete copy-pasteable code for every fix. |

**Constraint note:** C4 is the recommended anchor. The "sample fix" concept is critical — it proves the format and quality of the product without enabling self-service. C3 is the fallback if conversion data shows C4 under-converts.

---

## Dimension D: Gate Mechanism
*How is the paywall structurally implemented?*

| Code | Option | Description |
|------|--------|-------------|
| D1 | Login wall | Must create account to see any fix content. Anonymous users blocked entirely. |
| D2 | Scan count limit | 3 free scans per month per account. Fourth scan requires upgrade. |
| D3 | Information depth limit | Free users see diagnostic layer; fix layer requires login. No scan count involved. |
| D4 | Page depth limit | First N issues shown free; remaining issues and all fixes require upgrade. |
| D5 | Combination: scan limit + information depth | 3 scans/month free AND fix content depth-gated. Both limits apply simultaneously. |

**Constraint note:** D5 is the recommended anchor. It creates two independent upgrade motivators. D1 alone is the highest-friction option and will suppress top-of-funnel dramatically. D3 alone is cleaner UX but removes the urgency created by scan count scarcity.

---

## Dimension E: Upgrade Prompt Style
*How is the upgrade call-to-action presented at the gate?*

| Code | Option | Description |
|------|--------|-------------|
| E1 | Hard block | Modal overlay, no content visible behind it. Must decide to upgrade or close. |
| E2 | Soft blur | Content visible but blurred. Upgrade prompt overlaid on the blurred content. |
| E3 | Count-down prompt | "14 fixes ready. 1 applied. 13 remaining — unlock all." Assumes the user is mid-progress. |
| E4 | Social proof prompt | "487 users upgraded this week to fix issues like yours." Prompt includes recent activity. |
| E5 | Before/after preview | Shows a side-by-side: current scan score vs. projected score if all fixes applied. Upgrade unlocks the path to the right side. |

**Constraint note:** E5 requires score projection logic (moderately complex). E3 is the highest-intent framing and requires no additional data. E2 + E3 combined is the recommended pattern — blur provides visual confirmation that content exists; count-down provides the motivational frame.

---

## Matrix Summary (Reference)

```
          A (Score)          B (Issue Detail)       C (Fix Info)           D (Gate)               E (Prompt)
Option 1: Overall only       Count only             None                   Login wall             Hard block
Option 2: + category names   Names only             Fix titles only        Scan count limit       Soft blur
Option 3: + category scores  + severity             + blurred code         Info depth limit       Count-down
Option 4: + issue counts     + one-line desc        + one full fix sample  Page depth limit       Social proof
Option 5: Full severity dist Full descriptions      All code (current)     Combo limit+depth      Before/after preview
```

