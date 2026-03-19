# ANALOGY_TRANSFERS.md
# DarkMirror — ConduitScore: Cross-Industry Mechanic Transfers

---

## The Problem to Solve
ConduitScore gives away the complete diagnostic AND the complete prescription (copy-pasteable code fixes) for free. Competitors give neither for free. The differentiator is the code fix — but it is currently fully accessible without payment. What does the optimal information gate look like?

---

## Industry 1: The Hospital Emergency Room Triage System

### How It Works
When a patient arrives at an ER, a triage nurse performs a rapid assessment: vital signs, chief complaint, pain scale, preliminary diagnosis. This assessment is free — it costs the patient nothing, requires no insurance verification, and happens immediately. The triage result is shared with the patient openly: "Your chest pain is likely cardiac in origin. This is a priority 1."

What is not free: the treatment. The cardiologist, the ECG, the medication, the interventional procedure — all of that is behind a financial gate. Critically, the triage nurse does not say "you might have a heart problem — pay $50 to find out what kind." She says exactly what the problem appears to be and then connects the patient to paid treatment.

### The Mechanic
Full diagnostic transparency at intake. Full ambiguity about treatment until the patient is inside the system.

### Transfer to ConduitScore
- **Free:** Complete scan results. Every issue identified. Every severity rating. Every plain-language description of what is broken and what it means for AI visibility. The score. The category breakdown.
- **Paid:** The treatment plan. The exact intervention. The copy-pasteable code fix. The "procedure" that resolves the identified condition.
- **Why it works:** The ER model creates maximum urgency at minimum friction. A patient who hears "this appears to be a heart attack" does not walk out the door because they have to wait for the cardiologist. They stay. They engage. The diagnosis compels the treatment. ConduitScore's diagnosis (GPTBot is blocked, structured data is absent) should be specific enough that any competent reader feels urgency — and the treatment (here is the exact JSON-LD) is the paid service.

### Strongest Feature Translation
"Diagnostic Full Transparency" — show every issue, its severity, and a plain-English explanation of the consequence. Underneath each issue, where the code fix would appear: a locked card that says "Fix available — see exact implementation." No blur, no tease — just a locked panel with a clear CTA.

---

## Industry 2: The Law Firm Consultation Model

### How It Works
Personal injury and family law firms offer free consultations. The consultation is substantive — the attorney reviews the facts, identifies the legal issues, assesses the merits of the case, tells the prospective client whether they have a claim, what type of claim, and roughly what the timeline and outcome range looks like. This is real, expert, valuable information.

What the client does not get for free: the work. The attorney does not draft the complaint, file the paperwork, subpoena the records, or argue in court during a free consultation. The attorney also will not tell the client exactly how to do those things themselves — because the value of legal representation is not just knowing what to file, it is having someone who will do it correctly under deadline and adversarial pressure.

The free consultation ends with a natural decision point: "Do you want to proceed? Here is the retainer."

### The Mechanic
Expert diagnosis + stakes explanation + natural decision gate. The consultation is designed to surface the complexity of the implementation so that "doing it yourself" feels riskier than hiring the firm.

### Transfer to ConduitScore
- **Free:** The full audit result. Not just what is wrong but what the consequence is ("because GPTBot is blocked, your site cannot be indexed by ChatGPT — meaning you are invisible to 200 million ChatGPT users"). Stakes language that communicates the business cost of each issue.
- **Paid:** The implementation. The exact code. But also — and this is the transfer insight — the consultation model suggests an additional paid layer: "guided implementation" or "we'll do it for you" upsells. The code fix is Starter. The implementation review or managed fix is Pro/Agency.
- **Why it works:** The legal consultation model shows that the complexity surfaced during the free consultation is itself the conversion argument. The more specific ConduitScore is about the consequence of each issue (not just "you have a structured data problem" but "without this JSON-LD block, Perplexity's citation engine cannot attribute your content to your domain"), the more the free scan makes the fix feel too risky to DIY.

### Strongest Feature Translation
"Stakes Language per Issue" — each issue in the free scan includes a one-line business impact statement: "Without this fix, your content cannot be cited by ChatGPT, Claude, or Perplexity." This is free. It is the consultation. It creates the urgency that makes the code fix (the paid retainer) feel necessary.

---

## Industry 3: The Physical Therapy Initial Assessment

### How It Works
A physical therapist begins every new patient relationship with an assessment session. The assessment is thorough: range of motion tests, strength evaluations, functional movement screens, postural analysis. At the end of the assessment, the PT presents a full breakdown: "You have reduced external rotation in your right shoulder, compensatory movement patterns in your thoracic spine, and anterior pelvic tilt. Here is what is causing your pain and what needs to be addressed."

The patient gets the diagnosis free (or at copay rates). What the patient does not get: the specific exercise program, the manual therapy techniques, the progression schedule, the home exercise handout. Those are the deliverables of the treatment relationship.

There is also a second mechanic: the PT often shows the patient one exercise during the assessment — just enough to demonstrate that they know what they are doing, and just enough to make the patient feel immediate relief or improvement. The taste of treatment during the diagnosis session is a powerful conversion tool.

### The Mechanic
Full diagnosis + one free taste of treatment + full program behind the gate.

### Transfer to ConduitScore
- **Free:** Full diagnosis. Plus: one working code fix, served completely and correctly. Specifically, the single highest-impact fix (or the lowest-complexity fix) is given free in full — demonstrating that ConduitScore's code is correct, implementable, and immediately valuable.
- **Paid:** All remaining fixes. The full "treatment program."
- **Why it works:** The PT model introduces something neither the ER model nor the legal model has: the free taste of the prescription. Giving away one perfect code fix is more powerful than giving away zero. It proves the product. It demonstrates the quality of the fix. It creates the experience of "this worked — I want the rest." The user who pastes one correct JSON-LD block and watches their implementation test pass is now a motivated buyer.
- **Critical design detail:** The free fix should be the one that is most visible in its effect, or most satisfying to implement — not the easiest or the least important. Choose the fix that most dramatically demonstrates competence.

### Strongest Feature Translation
"One Free Fix" — the free scan shows full diagnosis for all issues but provides one complete, working code fix. The specific fix surfaced is the one that produces the most visible outcome (e.g., LLMs.txt file addition, which is entirely self-contained and testable immediately). Every other fix shows a locked panel. The unlocked fix has a label: "Try it — this is what all fixes look like."

---

## 10 Mechanics Transfers Summary

| # | Source Industry | Mechanic | Transfer to ConduitScore |
|---|----------------|----------|--------------------------|
| 1 | Emergency Room | Full transparent diagnosis, gated treatment | Show all issues + descriptions free. Gate all code fixes. |
| 2 | Law Firm | Stakes language during free consultation | Add business-impact statement to every issue: "This means ChatGPT cannot cite you." |
| 3 | Physical Therapy | One free taste of treatment during assessment | Give away one complete, working code fix to demonstrate product quality. |
| 4 | Physical Therapy | Progression schedule as ongoing service | Paid "re-scan cadence" and improvement tracking over time. |
| 5 | Law Firm | Complexity surfaces during consultation, making DIY feel risky | Show all 14 issues openly — volume and complexity make DIY feel overwhelming, upgrade feels like relief. |
| 6 | Emergency Room | Priority triage creates urgency without withholding information | Critical severity issues surface first, with explicit urgency framing: "This is blocking AI crawlers right now." |
| 7 | Physical Therapy | Home exercise handout as low-cost retention tool | A free "quick wins" checklist (manual, no code) as an email capture deliverable — turns free users into email list members. |
| 8 | Law Firm | Retainer as the natural endpoint of the consultation | Upgrade CTA positioned as "start fixing now" — not "unlock the report" — framing the payment as beginning the work. |
| 9 | Emergency Room | Specialist referral for complex cases | Agency tier positioned as "we audit your site with an expert" — a human-review tier above the automated tool. |
| 10 | Physical Therapy | Reassessment session as a recurring touchpoint | Scheduled re-scans as a paid feature that tracks score improvement over time, creating a reason to maintain subscription. |

---

## Top 3 Translated Features

### Feature A: "Diagnosis Full / Prescription Locked"
Drawn from: Emergency Room + Law Firm

Every issue in the free scan shows: severity badge, issue title, full plain-language description, and a business impact line ("Without this, GPTBot cannot crawl your site"). The code fix panel is present but locked. The lock is not a blur or a blur overlay — it is a clearly styled card that says: "Exact implementation available — 1 snippet, copy-paste ready. Unlock with Starter." The visual design of the locked card should look like the unlocked card with a single gate layer — so the user can see the shape of what they are missing.

### Feature B: "One Free Fix — The Demo Snippet"
Drawn from: Physical Therapy

The highest-impact or most self-contained fix in the scan is delivered completely free. No login required. Works immediately. Labeled clearly as "Free fix — try it now." All other fixes are locked. This single free snippet serves three functions: proof of product quality, taste of the upgrade, and trust builder. The specific snippet surfaced should be selected by the scan logic based on what will be most immediately demonstrable (LLMs.txt creation, a single meta tag, a robots.txt amendment).

### Feature C: "Business Stakes per Issue"
Drawn from: Law Firm consultation model

Each issue receives a one-sentence business impact statement written in plain English for a non-developer marketing manager. Not "robots.txt disallows Bingbot" — instead: "Microsoft's AI assistant Copilot cannot access any of your content because of this setting." These statements are free. They make the free scan emotionally urgent in a way that pure technical descriptions cannot. They are also what make the scan result shareable — a marketing manager can forward a report with these statements to their CEO and have the problem understood immediately.
