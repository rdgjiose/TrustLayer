TrustLayer Domain Model Overview

Document: docs/domain/domain-model-overview.md
Version: 1.0
Status: Draft

---

1. Purpose

This document defines the core domain objects of TrustLayer.

The domain model connects product design, database design, API design, and smart contract design.

Before writing code, TrustLayer must clearly define what objects exist and how they relate to each other.

---

2. Core Domain Objects

TrustLayer has six core domain objects:

User
Identity
Trade
Reputation Event
Evidence
Marketplace

These objects form the foundation of the system.

---

3. High-level Relationship

User
  ↓
Identity
  ↓
Trade
  ↓
Reputation Event
  ↓
Evidence
  ↓
Reputation History

Marketplaces may create or reference trades, but they do not own reputation.

---

4. User

A User is the person who owns reputation.

A User may act as:

* buyer
* seller
* reviewer
* evidence submitter
* reputation owner

A User owns their reputation history.

---

5. Identity

Identity represents the persistent digital identity of a User.

Identity may include:

* phone verification
* email verification
* wallet address
* TrustLayer ID
* future DID

Identity supports reputation accumulation.

Identity is not reputation itself.

---

6. Trade

A Trade represents one peer-to-peer trading activity.

A Trade may include:

* buyer
* seller
* external marketplace link
* item reference
* trade status
* confirmation state
* observation window

A Trade is temporary.

Its events become permanent history.

---

7. Reputation Event

A Reputation Event is an immutable record of behaviour.

Examples:

* Trade Created
* Seller Accepted
* Buyer Confirmed
* Seller Confirmed
* Trade Completed
* Issue Submitted
* Evidence Uploaded

Reputation Events are append-only.

They are the foundation of reputation history.

---

8. Evidence

Evidence supports an event.

Evidence may include:

* photo hash
* screenshot hash
* document hash
* message hash
* external reference

Evidence files should remain off-chain.

Hashes or references may be stored on-chain.

---

9. Marketplace

A Marketplace is an external platform where a trade may originate.

Examples:

* Facebook Marketplace
* TradeMe
* XHS
* WeChat group

Marketplaces may:

* provide product listings
* provide communication channels
* reference TrustLayer reputation
* contribute reputation events in future

Marketplaces do not own user reputation.

---

10. Object Relationship Example

Alice lists an item on Facebook Marketplace.
Bob opens Alice's TrustLayer profile.
Bob creates a Trade.
Alice accepts the Trade.
Both confirm completion.
TrustLayer records Reputation Events.
Alice and Bob both gain trading history.

---

11. Design Summary

TrustLayer is built around historical behaviour.

Users own reputation.

Trades generate events.

Events create history.

Evidence supports events.

Marketplaces reference reputation.

The domain model must always preserve this structure.