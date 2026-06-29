TrustLayer Trade Page

Document: docs/ui/trade-page.md

Version: 1.0

Status: Draft

⸻

1. Purpose

The Trade Page represents a single trading activity between two users.

It is a shared workspace where both buyer and seller record the history of the trade.

The page does not determine who is right.

It records verifiable events throughout the trading lifecycle.

⸻

2. Design Philosophy

The Trade Page belongs to the trade itself.

Not to the buyer.

Not to the seller.

Both participants contribute events to the same historical record.

The trade becomes the source of future reputation events.

⸻

3. Trade Lifecycle

Trade Created
      ↓
Waiting for Acceptance
      ↓
Accepted
      ↓
Meeting Arranged
      ↓
Trade Completed
      ↓
Observation Window
      ↓
Archived

Every stage generates historical events.

⸻

4. Page Layout

The Trade Page contains six sections.

Trade Summary
        ↓
Participants
        ↓
Trade Timeline
        ↓
Trade Status
        ↓
Actions
        ↓
Observation Window

⸻

5. Trade Summary

Display:

* Trade ID
* Item title
* External marketplace
* Listing link
* Trade created time
* Current status

Example

Trade ID
TR-2026-001254
Item
iPhone 14
Marketplace
Facebook Marketplace
Status
Waiting for Buyer Confirmation

⸻

6. Participants

Display both participants.

Buyer

* Display name
* Reputation link

Seller

* Display name
* Reputation link

Users may open each other’s Reputation Profile.

Private information remains hidden.

⸻

7. Trade Timeline

The timeline records every historical event.

Example

09:10
Trade Created
↓
09:22
Seller Accepted
↓
10:05
Meeting Confirmed
↓
15:30
Buyer Confirmed Completion
↓
15:34
Seller Confirmed Completion
↓
Trade Completed

Timeline events are append-only.

Nothing is overwritten.

⸻

8. Trade Status

Possible states include:

* Created
* Pending Acceptance
* Accepted
* Meeting Scheduled
* Buyer Confirmed
* Seller Confirmed
* Completed
* Cancelled
* Expired
* Observation
* Archived

The current state should be clearly displayed.

⸻

9. Available Actions

Available actions depend on the current trade state.

Examples

Buyer may:

* Accept trade
* Confirm meeting
* Confirm completion
* Submit post-trade event

Seller may:

* Accept trade
* Confirm meeting
* Confirm completion
* Respond to issue

Only valid actions should be visible.

⸻

10. Confirmation Model

Trade completion requires confirmation from both parties.

Buyer Confirmed
+
Seller Confirmed
↓
Trade Completed

Single confirmation does not complete the trade.

⸻

11. Observation Window

After completion, the trade enters an observation period.

Purpose

Allow participants to record important post-trade events.

Possible duration

* 24 hours
* 3 days
* 7 days

MVP should use a simple configurable duration.

⸻

12. Post-trade Events

During the observation window, users may record factual events.

Examples

* Item matches description
* Item differs from description
* Missing accessory
* Evidence uploaded
* Seller responded
* Buyer withdrew issue
* Issue resolved

These are historical events.

They are not judgements.

⸻

13. Evidence

Users may attach evidence to post-trade events.

Examples

* Photo
* Video
* Receipt
* Screenshot

Evidence files remain off-chain.

Only hashes and references are stored on-chain.

⸻

14. Trade Privacy

Public users should not see:

* meeting address
* phone numbers
* private chat
* payment details

Only trade participants may access sensitive information.

⸻

15. Trade Completion

When:

Buyer confirmed

AND

Seller confirmed

The system creates:

* Trade Completed Event
* Reputation Event
* Blockchain Record

Both users’ reputation histories are updated.

⸻

16. Archived Trade

After the observation window ends, the trade becomes archived.

Archived trades remain permanently accessible as historical records.

They cannot be edited.

Only new events may reference them.

⸻

17. Mobile-first Design

The Trade Page should be optimized for mobile devices.

Typical usage:

* Open from a marketplace link
* Confirm trade after meeting
* Upload evidence if required

The interface should minimize the number of user actions.

⸻

18. Example MVP Layout

----------------------------------------
Trade
iPhone 14
Facebook Marketplace
Status
Waiting for Buyer Confirmation
----------------------------------------
Buyer
Jasper
Seller
Alice
----------------------------------------
Timeline
Trade Created
Seller Accepted
Meeting Confirmed
----------------------------------------
Actions
Confirm Completion
Submit Issue
----------------------------------------
Observation Window
6 Days Remaining
----------------------------------------

⸻

19. Design Summary

The Trade Page is not a marketplace.

It is not a chat application.

It is not a payment system.

It is a shared historical workspace where two users collaboratively record the lifecycle of a trade.

That history becomes the foundation of future reputation.