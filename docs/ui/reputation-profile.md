TrustLayer Reputation Profile

Document: docs/ui/reputation-profile.md
Version: 1.0
Status: Draft

---

1. Purpose

This document defines the Reputation Profile page.

The Reputation Profile is the main public-facing page of TrustLayer.

Its purpose is to help one person decide whether they are willing to trade with another person.

It does not guarantee trust.

It does not judge the person.

It presents verified reputation history in a clear and useful way.

---

2. Core Design Question

The Reputation Profile should answer one question:

What does a stranger need to know before deciding whether to trade with another stranger?

The page should support decision-making, not replace human judgement.

---

3. Design Philosophy

The profile should display history-based signals.

It should not display a single universal social credit score.

TrustLayer should avoid saying:

This person is good.

Instead, TrustLayer should show:

This person has completed 126 trades.
This person has 98% mutual confirmation rate.
This person has 2 unresolved disputes.
This person has used TrustLayer for 18 months.

Users interpret the information.

TrustLayer records and presents history.

---

4. Page Structure

The Reputation Profile contains six sections.

Profile Header
        ↓
Trust Summary
        ↓
Trading Statistics
        ↓
Verification Signals
        ↓
Recent Activity
        ↓
Event Timeline

---

5. Profile Header

The top section should show:

* Display name
* TrustLayer ID
* Account age
* Public avatar or initials
* Public profile link
* Reputation domain

Example:

Jasper H.
Trading Reputation
TrustLayer ID: TL-9F32A
Member since: 2026
Profile: trustlayer.nz/u/tl-9f32a

The profile should avoid exposing private identity information.

Do not show:

* phone number
* email
* real address
* government ID
* private wallet key

---

6. Trust Summary

The Trust Summary gives a quick overview.

Suggested fields:

* Completed trades
* Mutual confirmation rate
* Dispute rate
* Account age
* Reputation confidence

Example:

Completed Trades: 126
Mutual Confirmation Rate: 98%
Disputes: 2
Account Age: 18 months
Reputation Confidence: High

Reputation Confidence is not a moral score.

It indicates how much historical evidence supports the profile.

---

7. Trading Statistics

Trading Statistics show measurable behaviour.

Suggested metrics:

* Total trades
* Completed trades
* Cancelled trades
* Expired trades
* Buyer confirmations
* Seller confirmations
* No-show events
* Disputes submitted
* Disputes resolved
* False complaints
* Average response time
* Recent activity count

These metrics should be calculated from reputation events.

They should not be manually editable.

---

8. Verification Signals

Verification Signals provide context about identity strength.

Examples:

* Phone verified
* Email verified
* Marketplace account linked
* External account age
* Wallet created
* DID connected
* Government identity verified (future)

Verification does not equal reputation.

It only increases confidence that the profile belongs to a persistent identity.

---

9. Recent Activity

Recent Activity should show high-level recent behaviour.

Example:

Last 30 days:
8 trades completed
0 disputes
1 cancelled trade
0 no-show events

This helps users distinguish long-term reputation from current behaviour.

---

10. Event Timeline

The Event Timeline shows selected historical events.

Example:

2026-06-20
Trade Completed
Buyer and seller both confirmed completion.
2026-06-18
Trade Cancelled
Cancelled before confirmation.
2026-06-12
Dispute Submitted
Evidence uploaded. Seller responded.

The timeline should not expose private details unless explicitly authorized.

---

11. Reputation Confidence

Reputation Confidence should be based on evidence depth.

Possible factors:

* number of completed trades
* diversity of counterparties
* account age
* verification strength
* dispute history
* activity consistency
* suspicious pattern detection

Example levels:

Low
Medium
High

Confidence should not be presented as a credit score.

It is only a signal about evidence quality.

---

12. Suspicious Activity Indicators

If reputation farming or unusual behaviour is detected, the profile may show warnings.

Examples:

High number of repeated trades with the same user.
Unusually fast reputation growth.
Many low-value repeated trades.
Frequent disputes after completion.

Warnings should be factual and explainable.

Avoid vague labels such as:

Bad user
Fraudster
Untrusted

---

13. Public vs Private View

The same profile may have two views.

Public View

Visible to everyone:

* summary statistics
* verification badges
* reputation confidence
* selected event history

Owner View

Visible only to the profile owner:

* full event history
* private notes
* evidence management
* linked accounts
* identity settings
* privacy settings

---

14. Marketplace Embed View

Future marketplaces may show a compact version.

Example:

TrustLayer Trading Reputation
126 completed trades
98% mutual confirmation
High confidence
View full profile

This allows marketplaces to reference reputation without owning it.

---

15. Mobile-first Design

The profile must work well on mobile.

Most users will open TrustLayer links from:

* Facebook Marketplace
* TradeMe
* XHS
* WeChat
* messaging apps

The first screen should answer quickly:

Is this person worth continuing with?

---

16. What Not to Show

The Reputation Profile should not show:

* a universal credit score
* private contact details
* sensitive evidence
* private messages
* exact home address
* raw wallet secrets
* unsupported accusations

TrustLayer must protect privacy while showing useful reputation history.

---

17. MVP Profile Fields

MVP 0.1 should include only:

* display name
* TrustLayer ID
* account age
* completed trades
* confirmation rate
* dispute count
* verification status
* recent activity
* public event timeline

Do not implement complex scoring in MVP 0.1.

---

18. Example MVP Layout

------------------------------------------------
Jasper H.
Trading Reputation
TrustLayer ID: TL-9F32A
Member since: 2026
------------------------------------------------
Completed Trades
12
Mutual Confirmation
100%
Disputes
0
Verification
Phone verified
Email verified
Confidence
Medium
------------------------------------------------
Recent Activity
Last 30 days:
3 completed trades
0 disputes
------------------------------------------------
Timeline
2026-06-20
Trade Completed
2026-06-14
Trade Completed
2026-06-10
Profile Created
------------------------------------------------

---

19. Design Summary

The Reputation Profile is not a judgement page.

It is an evidence-based decision support page.

It should help users make better trust decisions while keeping reputation ownership with the person who earned it.

TrustLayer presents history.

Users decide trust.