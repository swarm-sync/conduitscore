# Ethics, CAN-SPAM, and unsubscribe

## What you must do

1. **Identify the sender** — `sender_name` and `sender_email` must be real (e.g. Ben + a mailbox you control).
2. **Physical address** — CAN-SPAM requires a valid postal address in commercial email; add it to your footer template or Gmail signature policy.
3. **Honest subject lines** — no deceptive subjects.
4. **Unsubscribe** — every bulk email should include a working **unsubscribe** path. This pipeline generates an `unsubscribe_token` per row and sets a **List-Unsubscribe** header pointing at `UNSUBSCRIBE_BASE_URL` (you host a simple page or script that records the token and stops future sends).
5. **Consent and sourcing** — emails obtained only where legally and ethically allowed; published contact addresses vs purchased lists have different rules by jurisdiction.

## What this software does not do

- It does not guarantee deliverability or inbox placement.
- It does not bypass Gmail or Google Workspace abuse limits.
- It is not legal advice — consult counsel for cold outreach in your regions.

## Unsubscribe handling (technical)

- Tokens are stored in SQLite (`unsubscribe_tokens` table).
- The send module builds `List-Unsubscribe: <UNSUBSCRIBE_BASE_URL>?token=...`.
- Before send, optional check: skip if token marked unsubscribed in DB (if you wire a small webhook to flip that flag).
