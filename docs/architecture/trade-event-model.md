TrustLayer Trade Event Model

Document: docs/architecture/trade-event-model.md

Version: 1.0

Status: Draft

⸻

1. Purpose

This document defines how peer-to-peer trading activity is represented inside TrustLayer.

The Trade Event Model is the first concrete application of the Reputation Model.

It explains how a real-world trade becomes a verifiable reputation event.

⸻

2. Core Philosophy

TrustLayer does not guarantee that a trade will succeed.

TrustLayer does not judge the subjective quality of second-hand goods.

TrustLayer records verifiable trade behaviour.

The goal is not to eliminate all disagreement.

The goal is to create portable, tamper-resistant trading history.

⸻

3. Trade vs Reputation Event

A Trade is a business process.

A Reputation Event is an immutable historical record.

Example:

Trade:
Buyer and seller agree to meet for a second-hand phone.
Reputation Events:
- Trade Created
- Seller Confirmed
- Buyer Confirmed
- Trade Completed

The trade may change state.

The reputation events are append-only.

⸻

4. Trade Lifecycle

Trade Created
      ↓
Seller Invited
      ↓
Seller Accepted
      ↓
Terms Confirmed
      ↓
Meet / Delivery
      ↓
Buyer Confirmed
      ↓
Seller Confirmed
      ↓
Trade Completed

Alternative outcomes:

Trade Cancelled
Trade Expired
Buyer No-show
Seller No-show
Dispute Submitted

⸻

5. Trade States

Created

A buyer or seller creates a TrustLayer trade link from an external marketplace URL.

Pending Acceptance

The other party has not yet accepted the trade.

Accepted

Both parties agree to use TrustLayer for this trade.

Terms Confirmed

Basic trade terms are locked.

Completed

Both buyer and seller confirm completion.

Cancelled

One or both parties cancel before completion.

Expired

The trade is inactive for too long.

Disputed

One party submits a dispute event.

⸻

6. Minimum Trade Data

A trade should include:

* Trade ID
* External marketplace URL
* Item title
* Item description snapshot hash
* Buyer ID
* Seller ID
* Created timestamp
* Trade status
* Terms hash
* Confirmation status
* Related reputation events

MVP may store only a simplified version.

⸻

7. External Marketplace Link

TrustLayer does not host marketplace listings.

Instead, each trade may reference an external listing.

Examples:

* Facebook Marketplace URL
* TradeMe URL
* XHS post URL
* WeChat group reference
* Manual item description

The marketplace link helps connect TrustLayer reputation events to real trading context.

⸻

8. Terms Snapshot

Before confirmation, both parties should agree to basic terms.

Examples:

* Item
* Price
* Pickup or delivery
* Approximate location
* Meeting time
* Condition description
* Cancellation condition

TrustLayer should store a hash of the agreed terms.

The original terms may be stored off-chain.

⸻

9. Confirmation Model

A trade is completed only when both parties confirm.

Buyer Confirmation
+
Seller Confirmation
=
Completed Trade Event

Single-party confirmation is recorded but does not complete the trade.

This reduces false completion claims.

⸻

10. Dispute Model

TrustLayer is not a judge.

A dispute is recorded as a historical event.

Possible dispute events:

* Dispute Submitted
* Evidence Added
* Dispute Withdrawn
* Dispute Resolved
* False Complaint Detected

Only resolved or verified outcomes should affect reputation strongly.

⸻

11. No-show Model

No-show is one of the most important trading behaviours.

Possible no-show events:

* Buyer No-show Claimed
* Seller No-show Claimed
* No-show Confirmed
* No-show Disputed

No-show claims should not automatically damage reputation.

They require supporting context or repeated behavioural patterns.

⸻

12. Second-hand Item Subjectivity

Second-hand goods often involve subjective expectations.

TrustLayer should avoid judging vague claims such as:

* It looks worse than expected.
* I do not like the colour.
* It feels old.
* I changed my mind.

TrustLayer may record objective mismatches such as:

* Wrong model
* Missing accessory
* Incorrect price
* Item not present
* Fake listing

The system records evidence and history.

Users interpret trust.

⸻

13. Reputation Impact

Different events may influence reputation differently.

Strong positive signals:

* Both parties confirmed completion.
* Multiple successful trades over time.
* Low dispute rate.

Weak or neutral signals:

* Created trade.
* Cancelled trade with mutual agreement.
* Expired trade.

Negative signals:

* Confirmed no-show.
* Confirmed false complaint.
* Repeated cancellation.
* Confirmed fraud.

The weighting algorithm belongs to the Reputation Engine.

The Trade Event Model only defines events.

⸻

14. Anti-farming Considerations

Reputation farming may occur when users create fake trades to inflate reputation.

Possible suspicious patterns:

* Many trades between the same two users
* High-frequency trades in short time
* Many low-value trades
* Repeated identical item descriptions
* Closed trading circles
* Sudden reputation growth

The system should record enough metadata to allow future detection.

⸻

15. Privacy Considerations

Public trade reputation should not reveal unnecessary personal details.

Public information may include:

* Completed trade count
* Completion rate
* Dispute count
* Account age
* Reputation confidence

Private information should include:

* Phone number
* Email
* Exact address
* Private messages
* Sensitive evidence
* Full item details if not authorized

⸻

16. MVP Trade Flow

MVP 0.1 trade flow:

User creates trade link
        ↓
Other party opens link
        ↓
Both users identify themselves
        ↓
Trade becomes accepted
        ↓
Both confirm completion
        ↓
Completed Trade Event is recorded
        ↓
Reputation profile updates

MVP does not include payment, escrow, arbitration, or automated marketplace import.

⸻

17. Example Event Sequence

Event 1:
Trade Created
Event 2:
Seller Accepted
Event 3:
Terms Confirmed
Event 4:
Buyer Confirmed Completion
Event 5:
Seller Confirmed Completion
Event 6:
Trade Completed

This sequence becomes part of both users’ trading history.

⸻

18. Design Summary

A trade is temporary.

A reputation event is permanent.

TrustLayer does not own the marketplace.

TrustLayer does not own the trade.

TrustLayer preserves the history generated by the trade.

That history belongs to the users who created it.