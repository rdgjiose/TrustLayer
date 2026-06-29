TrustLayer Smart Contract Design

Document: contracts/smart-contract-design.md
Version: 1.0
Status: Draft

---

1. Purpose

This document defines the initial smart contract design for TrustLayer MVP 0.1.

The smart contract is not responsible for storing full reputation profiles.

Its purpose is to preserve tamper-resistant references to reputation events and evidence.

---

2. Core Principle

Blockchain stores evidence, not reputation.

The smart contract should store:

* event references
* event hashes
* timestamps
* user references
* trade references
* signatures or submitter information

The smart contract should not store:

* private identity data
* images
* chat messages
* full item descriptions
* phone numbers
* emails
* subjective reputation scores

---

3. Contract Responsibilities

The smart contract is responsible for:

* recording immutable reputation events
* linking events to users
* linking events to trades
* preserving event hashes
* providing public verification
* preventing event modification

The smart contract is not responsible for:

* calculating final reputation
* deciding disputes
* judging truth
* processing payments
* acting as escrow
* hosting marketplace listings

---

4. Main Contract Concept

MVP contract name:

TrustLayerReputationLedger

Purpose:

Maintain an append-only ledger of reputation events.

---

5. Core Data Model

Each on-chain reputation event should contain:

eventId
eventType
tradeId
actorUserRef
targetUserRef
eventHash
evidenceHash
previousEventId
timestamp
submitter

Notes:

* eventHash represents the full event payload stored off-chain.
* evidenceHash represents related evidence.
* actorUserRef and targetUserRef should not expose private identity.
* previousEventId supports history chaining.

---

6. Event Types

Initial MVP event types:

PROFILE_CREATED
TRADE_CREATED
TRADE_ACCEPTED
BUYER_CONFIRMED_COMPLETION
SELLER_CONFIRMED_COMPLETION
TRADE_COMPLETED
ISSUE_SUBMITTED
EVIDENCE_UPLOADED
ISSUE_RESOLVED

Future event types may be added through versioning.

---

7. Append-only Rule

Events cannot be edited.

Events cannot be deleted.

If correction is needed, create a new event.

Example:

TRADE_COMPLETED
        ↓
ISSUE_SUBMITTED
        ↓
ISSUE_RESOLVED

History grows by adding events.

---

8. Suggested Contract Interface

recordEvent

Records a new reputation event.

recordEvent(
    eventType,
    tradeId,
    actorUserRef,
    targetUserRef,
    eventHash,
    evidenceHash,
    previousEventId
)

Returns:

eventId

---

getEvent

Returns one event by ID.

getEvent(eventId)

---

getUserEvents

Returns event IDs related to a user.

getUserEvents(userRef)

---

getTradeEvents

Returns event IDs related to a trade.

getTradeEvents(tradeId)

---

9. Privacy Design

The contract must avoid storing personal data.

Do not store:

* raw name
* phone number
* email
* address
* marketplace username
* private messages

Use hashed or pseudonymous references.

---

10. Off-chain Relationship

The full event payload is stored off-chain.

Example off-chain payload:

{
  "eventType": "TRADE_COMPLETED",
  "tradeId": "TR-8K2P4",
  "buyerConfirmed": true,
  "sellerConfirmed": true,
  "marketplace": "facebook_marketplace",
  "createdAt": "2026-06-28T10:00:00Z"
}

Hash of this payload is stored on-chain.

If payload changes, the hash no longer matches.

---

11. Blockchain-neutral Design

The design should remain blockchain-independent.

Possible implementations:

* Solidity / EVM
* NEAR Rust
* Polygon
* Future chains

The concept matters more than the chain.

---

12. MVP Simplification

MVP 0.1 may implement the smart contract as a prototype only.

The application can first use D1 as the operational database.

The smart contract anchors selected event hashes.

This avoids overcomplicating the first build.

---

13. Security Considerations

The contract should prevent:

* overwriting events
* deleting events
* unauthorized event submission
* duplicate event IDs
* leaking private data

Future versions should add:

* role-based submitters
* marketplace submitter verification
* signature validation
* replay protection

---

14. Reputation Calculation

The contract does not calculate reputation.

Reputation is calculated by the Reputation Engine from historical events.

This allows algorithms to evolve without changing historical records.

---

15. Design Summary

The smart contract is the immutable event anchor.

It protects evidence integrity.

It preserves history.

It does not judge users.

It does not calculate trust.

It supports the TrustLayer mission:

Reputation belongs to people, not platforms.