# HMW.md — How Might We Questions
# ConduitScore: Free vs. Paid Information Gate Strategy

---

## Scope

Domain: AI visibility scanner with code-fix differentiator
Constraint: Competitors show zero code; ConduitScore currently shows all code free
Core tension: Code fixes are the unique value AND the reason no one pays

---

## 8 HMW Questions (Narrow / Medium / Wide)

### Narrow Scope (tactical gate mechanics)

**HMW-1 (Narrow)**
How might we show enough of a code fix to prove it exists and is correct, without giving away enough characters to actually use it?

**HMW-2 (Narrow)**
How might we display issue counts and severity totals as a credibility signal, while reserving the issue titles themselves as the first paid unlock?

**HMW-3 (Narrow)**
How might we let users see one complete fix from the lowest-priority issue category, so they can experience the product's depth before hitting any wall?

### Medium Scope (motivation and framing)

**HMW-4 (Medium)**
How might we show enough to prove value without enabling full self-service? (The "taste without the meal" problem.)

**HMW-5 (Medium)**
How might we make the locked content feel like a natural next step, not a punishment, so the gate reads as "here is what's next for you" instead of "pay or leave"?

**HMW-6 (Medium)**
How might we use the score itself as a motivational instrument, so users who score low feel urgency to unlock fixes rather than discouragement to leave?

### Wide Scope (product and business model reframing)

**HMW-7 (Wide)**
How might we design the free tier so that sharing a report to a client or colleague is itself a distribution channel that naturally converts the recipient into a paying user?

**HMW-8 (Wide)**
How might we reframe "locked fixes" as a personalized service the user hasn't yet received, rather than content they've been denied — shifting the psychological frame from restriction to anticipation?

---

## Selected HMW Questions That Define the Matrix

Three questions were selected to anchor the morphological matrix because they span the full decision space (what to show, how to frame the gap, and how to convert):

**Primary: HMW-4**
"How might we show enough to prove value without enabling full self-service?"
- This defines the upper boundary of the free tier (proof without completion)
- Matrix Dimension C (Fix information free) and Dimension A (Score information) are both direct answers to this question

**Secondary: HMW-5**
"How might we make the locked content feel like a natural next step, not a punishment?"
- This defines Dimension E (Upgrade prompt style) entirely
- The answer determines whether users bounce or convert

**Supporting: HMW-3**
"How might we let users see one complete fix from the lowest-priority issue category, so they can experience the product's depth before hitting any wall?"
- This creates the "full fix sample" option in Dimension C
- It is the most debated option: full code for one fix vs. blurred code for all fixes

---

## Concrete Answers to the 2 Best HMW Questions

---

### Answer to HMW-4: "Show enough to prove value without enabling full self-service"

**The Proof-Without-Completion Principle**

The fix is the product. The problem is that a complete fix has zero residual value once used — it is a consumable, not a subscription signal. The solution is to separate proof of fix quality from delivery of fix utility.

**Concrete implementation:**

Step 1 — Show the score and all category breakdowns freely. This proves diagnostic depth and differentiates immediately from competitors who give no category detail. The user now has a 7-dimension picture of their site. This has zero self-service value because knowing a score does not fix anything.

Step 2 — Show issue names and severity for all issues. This proves ConduitScore found real, specific problems. The user can read "Missing JSON-LD Organization schema" and understand this is a real issue. Still not actionable without the fix.

Step 3 — For fixes: show the fix title and a description of what the fix does, but deliver only one complete code block — the lowest-severity item in the highest-volume category. This is the "sample fix." It is complete, functional, copyable. It demonstrates exactly what every other fix looks like. It proves the format, the quality, and the specificity.

Step 4 — All remaining fixes show a blurred/obscured code block with a character count visible ("47 lines of JSON-LD"). The user can see the fix exists, its approximate size, and the title. They cannot use it.

**Why this works:** The user has now experienced the full product loop for one issue — diagnosis, education, and implementation. They know precisely what they are buying for the remaining N issues. The conversion ask is not "trust me there is more" — it is "you already used one, here are the other 14."

---

### Answer to HMW-5: "Make locked content feel like a natural next step, not a punishment"

**The Progression Frame vs. The Deprivation Frame**

Deprivation frame (current risk): User sees all fixes freely, gets everything, leaves. Or: User hits a hard paywall after seeing nothing. Both feel like tricks.

Progression frame (target): The gate is positioned as "you have completed the diagnosis phase; implementation requires unlocking." This reframes the product as having natural stages that a professional would expect to move through.

**Concrete implementation:**

Mechanic 1 — Stage labeling. The scan report is divided into three labeled sections visible on the page simultaneously: "DIAGNOSIS" (free, fully visible), "IMPLEMENTATION GUIDE" (partially visible, blur applied), "MONITORING SETUP" (locked, with a lock icon). The user sees all three sections exist before they scroll. The gate is not a wall at the bottom of the page — it is a visible structure at the top.

Mechanic 2 — The count-down prompt, not the count-up paywall. Instead of "Upgrade to see fixes," the prompt reads: "14 fixes ready for your site. You've already applied 1. Unlock the remaining 13." The framing assumes the user is in progress, not blocked. It counts what is remaining from a fixed total, which is more motivating than counting what is hidden.

Mechanic 3 — The specific next fix preview. Immediately below the sample fix, the next locked fix shows its title in full, a one-sentence description, and the first line of code followed by blur. "Your next fix: Add FAQ schema to your pricing page. Begin with: <script type='application/ld+json'>..." This makes the next step feel immediately concrete and close.

Mechanic 4 — No login wall on initial scan. The gate is hit at the implementation layer, not the access layer. A user who runs a scan without logging in sees the full diagnostic and the sample fix. The upgrade prompt appears inline when they attempt to copy a locked fix. This places the gate at the moment of highest motivation (the user just found a problem and wants to fix it now) rather than at the lowest motivation point (before they know what the product does).

