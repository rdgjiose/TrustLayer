TrustLayer Anti-Reputation Farming

Document: docs/architecture/anti-reputation-farming.md
Version: 1.0
Status: Draft

⸻

1. Purpose

This document defines how TrustLayer should detect and reduce reputation farming.

Reputation farming means creating artificial or low-quality events to inflate reputation.

If this problem is not controlled, users may lose trust in the entire system.

⸻

2. Core Principle

Raw event count does not equal real reputation.

A user with 100 suspicious trades should not automatically appear more trustworthy than a user with 20 diverse and verifiable trades.

TrustLayer must evaluate the quality of historical evidence, not only the quantity of events.

⸻

3. What Is Reputation Farming?

Reputation farming may include:

* fake trades between related accounts
* repeated trades between the same users
* many low-value transactions
* circular trading groups
* artificially created confirmations
* repeated identical item listings
* abnormal reputation growth
* coordinated false complaints

⸻

4. Design Philosophy

TrustLayer should not directly label a user as bad without strong evidence.

Instead, it should show evidence quality indicators.

For example:

Reputation Confidence: Low
Reason:
High repetition between related accounts.
Low diversity of counterparties.
Unusually fast reputation growth.

The system records patterns.

Users interpret trust.

⸻

5. Detection Signals

Possible suspicious signals include:

* repeated trades with the same account
* many trades in a short period
* many trades among a small user group
* very low-value repeated trades
* repeated identical product descriptions
* sudden reputation growth from new accounts
* high confirmation speed
* low marketplace diversity
* high dispute rate after rapid growth

⸻

6. Counterparty Diversity

A strong reputation should come from diverse counterparties.

Example:

Better:
50 trades with 45 different people
Weaker:
50 trades with 3 different people

Counterparty diversity should influence reputation confidence.

⸻

7. Time-based Analysis

Reputation built over time is stronger than reputation created suddenly.

Example suspicious pattern:

Account created 2 days ago
Completed 40 trades
Most trades with new accounts
No marketplace history

This should reduce confidence.

⸻

8. Marketplace Context

Marketplace context helps evaluate event quality.

Useful context may include:

* marketplace name
* listing age
* item category
* seller account age
* external listing URL
* listing snapshot

If external context is missing, reputation confidence may be lower.

⸻

9. Commercial Seller Detection

Some users may sell frequently as informal commercial sellers.

This is not automatically bad.

TrustLayer should show factual indicators.

Example:

Frequent Seller Pattern Detected
High volume of similar items.
Likely commercial seller.

This is a context label, not a punishment.

⸻

10. False Complaint Abuse

Malicious users may attempt to damage another user’s reputation.

Therefore:

* complaint submitted is only an event
* complaint confirmed is stronger
* false complaint detected is also a negative event
* repeated unsupported complaints reduce confidence

A complaint should not strongly affect reputation unless supported by evidence or resolution.

⸻

11. Reputation Confidence

Reputation Confidence should reflect evidence quality.

Possible levels:

Low
Medium
High

Confidence may be affected by:

* account age
* identity verification
* event diversity
* dispute rate
* evidence quality
* suspicious patterns
* marketplace diversity

Confidence is not a moral score.

⸻

12. MVP Approach

MVP 0.1 should not implement complex farming detection.

MVP should record enough metadata for future detection:

* user IDs
* trade IDs
* timestamps
* marketplace URL
* counterparty IDs
* item category
* event type
* confirmation times

Complex detection can be added later.

⸻

13. Future Detection Methods

Future versions may use:

* graph analysis
* anomaly detection
* reputation confidence algorithms
* marketplace diversity scoring
* identity strength scoring
* repeated pattern detection

These methods should remain explainable.

⸻

14. Ethical Constraint

Anti-farming logic must not become hidden social judgement.

The system should explain why confidence is reduced.

Avoid vague labels such as:

Bad user
Untrustworthy
Fraudster

Use factual explanations instead.

⸻

15. Design Summary

Reputation quality matters more than reputation quantity.

TrustLayer should protect users from fake reputation without becoming a judge.

The system records behaviour.

The system detects patterns.

Users make trust decisions.