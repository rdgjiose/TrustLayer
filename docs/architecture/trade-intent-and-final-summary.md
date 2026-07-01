# TrustLayer Trade Intent and Final Summary Architecture

Document: docs/architecture/trade-intent-and-final-summary.md

Version: 1.0

Status: Draft

---

## 1. Purpose

This document defines the real-world Trade Intent lifecycle and the future Final Trade Summary model for TrustLayer.

The current MVP already supports a simple flow:

* create Trade Record
* accept invitation
* buyer confirms
* seller confirms
* trade recorded

This is acceptable for the current MVP. Future product work should recognize that real marketplace trading usually begins with casual conversation and only later reaches a meaningful point worth recording.

TrustLayer should record history. It should not judge users, determine truth, guarantee product quality, process payment, or replace contracts, courts, lawyers, marketplaces, or formal notarization.

---

## 2. Trade Intent Trigger

TrustLayer should not normally start recording from the first casual chat message.

Examples of casual chat include:

* "Is this available?"
* "Can you do cheaper?"
* "Where are you located?"
* "Can I see it?"

These messages are often exploratory. They do not always represent a meaningful trade commitment.

TrustLayer should normally start when both sides reach meaningful intent.

Examples of meaningful intent include:

* buyer and seller agree to meet
* buyer and seller agree to inspect the item
* buyer and seller agree to continue toward a possible transaction
* one side wants a lightweight record before meeting

This stage may be called Trade Intent or Trade Record Invitation.

Trade Intent does not mean the trade is complete. It means the participants have reached a point where recording the shared trading context is useful.

---

## 3. Two Entry Scenarios

TrustLayer should support more than one real-world entry path.

### Scenario A: Seller Includes TrustLayer Link in Listing

A seller may include TrustLayer in the external marketplace listing.

The listing may communicate:

* I support TrustLayer
* you can create or accept a TrustLayer Trade Record
* this seller is willing to trade transparently

This can help buyers inspect the seller's reputation before deciding whether to continue. It can also signal that the seller is comfortable creating a shared history for the transaction.

The marketplace listing remains external. TrustLayer does not host the listing and does not control whether the marketplace keeps the listing available.

### Scenario B: Participant Shares TrustLayer During Chat

If the seller does not include TrustLayer in the listing, either participant may propose it during the conversation.

Examples:

* buyer creates a Trade Record after agreeing to meet
* seller creates a Trade Record after agreeing to meet
* invited participant accepts after registration or login in a future version

TrustLayer should not depend on the marketplace listing permanently containing a TrustLayer link. Marketplace descriptions can be edited, removed, hidden, or blocked by platform policy.

Future invitation sharing may use links, short codes, QR codes, copyable message text, or manual code entry.

---

## 4. Meeting and Outcome Paths

After Trade Intent is created, several outcomes are possible.

### Outcome 1: Trade Proceeds

Participants meet, inspect the item, agree to proceed, and complete the trade.

The record may then continue to a Final Trade Summary and mutual confirmation.

This is the path currently simplified by the MVP as mutual confirmation and Trade Recorded.

### Outcome 2: No Deal / Mutual Close

Participants may meet, inspect the item, and decide not to proceed.

Examples:

* the item is not suitable
* final terms are not agreed
* the buyer changes their mind after inspection
* both sides agree not to continue

This should be closable without negative implication. A no-deal or mutual-close outcome is not the same as blame.

Suggested future state names:

* mutual_closed
* no_deal

The event should record that the Trade Intent was closed, not that either participant did something wrong.

### Outcome 3: Cancelled Before Meeting

One or both participants may change their mind before meeting.

The record can be cancelled or closed. This should not automatically damage reputation.

Cancellation before meeting may be useful history, especially if repeated, but a single cancellation is not proof of bad behaviour.

### Outcome 4: No-show

One participant may claim the other did not show up.

TrustLayer should record the claim as history, not as automatic judgement.

A no-show claim may require future supporting context, response, evidence, or dispute flow. TrustLayer should avoid treating a single unverified claim as truth.

Possible future events:

* buyer_no_show_claimed
* seller_no_show_claimed
* no_show_response_submitted
* no_show_resolved

---

## 5. Price Model

Real-world trading prices may change during the lifecycle.

TrustLayer should distinguish listing price, negotiated price, and final agreed price.

### Listing Price

Listing Price is the price observed from the external marketplace listing.

It is evidence or reference context only. It may be stale, edited, deleted, or different from the eventual transaction.

### Negotiated Price

Negotiated Price is discussed during chat.

It may change several times before the meeting or during inspection. It is usually not required for the current MVP.

TrustLayer should avoid storing private chat content unless a future evidence feature has clear user consent, visibility rules, and data minimization.

### Final Agreed Price

Final Agreed Price is the price both participants confirm at completion.

This is the most important price for the Trade Record because it reflects what both sides say actually happened.

Future versions may allow the final agreed price to be manually entered or edited before mutual confirmation.

---

## 6. Final Trade Summary

Future confirmation should confirm a Final Trade Summary, not only a generic "trade completed" action.

A Final Trade Summary may include:

* item title
* final agreed price
* currency
* trade date
* meeting location or broad area
* optional payment method
* optional included accessories or notes
* buyer
* seller
* trade code

Both participants should confirm the same summary.

If the summary changes, the other participant should review it again before the record can be finalized.

The Final Trade Summary is not a guarantee that the item is perfect. It is a participant-confirmed summary of what both sides agreed happened.

---

## 7. Confirmation Principle

Participants are not confirming that:

* the item is good
* the item is perfect
* the item has no defect
* the other participant is trustworthy forever
* TrustLayer has verified the entire real-world truth

Participants are confirming that the Final Trade Summary reflects what both sides agreed happened.

TrustLayer records participant confirmations. It does not judge product quality, guarantee truth, or decide who is right in future disagreements.

Users, marketplaces, and appropriate institutions interpret the history.

---

## 8. Relationship to Reputation

Trade history supports reputation.

Reputation is calculated from historical behaviour. It is not the source of truth.

Future reputation calculations may distinguish between:

* completed trades
* mutually closed records
* cancelled records
* no-show claims
* resolved disputes
* unresolved claims

Those interpretations may evolve. The underlying history should remain append-only.

---

## 9. Current MVP Boundary

This document is forward-looking.

Do not implement now:

* full Final Trade Summary
* final price field
* currency field
* meeting location field
* payment method field
* close or no-deal workflow
* no-show event model
* evidence capture timing changes
* trade summary confirmation UI
* payment escrow
* legal contract generation
* formal notarization claims
* automated judgement
* dispute decision logic
* database schema changes
* Worker route changes
* frontend UI changes

The current MVP confirmation flow remains acceptable for now.

Future tasks may gradually evolve the Trade Record from simple completion confirmation toward Final Trade Summary confirmation.

---

## 10. Future Task Guidance

This document should guide future tasks such as:

* final trade summary schema
* final price field
* currency field
* close or no-deal workflow
* no-show event model
* evidence capture timing
* trade summary confirmation UI
* participant review after summary edits

Each future task should remain small, reviewable, and aligned with TrustLayer's core philosophy:

TrustLayer records history.

Users interpret history.

---

## 11. Summary

TrustLayer should begin recording when participants reach meaningful Trade Intent, not at the first casual chat message.

Trade Intent can begin from a seller listing link or from either participant sharing TrustLayer during chat.

After Trade Intent, the outcome may be completed, mutually closed, cancelled before meeting, or disputed through a no-show claim.

Future confirmation should confirm a Final Trade Summary.

TrustLayer records confirmations and historical events. It does not determine truth, judge product quality, or provide legal judgement.
