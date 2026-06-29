TrustLayer MVP Engineering Overview

Document: docs/architecture/mvp-engineering-overview.md
Version: 1.0
Status: Draft

---

1. Purpose

This document defines the engineering scope of TrustLayer MVP 0.1.

The goal is to transform the project philosophy and architecture into a buildable software system.

MVP 0.1 focuses only on Trading Reputation.

---

2. MVP Mission

MVP 0.1 should prove one core idea:

A user can build portable trading reputation through verifiable trade events that are not owned by any marketplace.

---

3. MVP Scope

MVP 0.1 includes:

* User registration
* Reputation profile
* Trade link creation
* Trade page
* Buyer and seller confirmation
* Reputation event recording
* Public reputation viewing

MVP 0.1 does not include:

* Payment
* Escrow
* AI judgement
* Complex dispute arbitration
* Marketplace listing system
* Native mobile app

---

4. Recommended Technical Stack

Frontend:

* React / Next.js
* Mobile-first PWA
* Hosted on Cloudflare Pages

Backend:

* Cloudflare Workers
* REST API

Database:

* Cloudflare D1

Blockchain:

* Testnet smart contract
* Stores event hashes and reputation event references

Storage:

* MVP: minimal metadata only
* Future: Cloudflare R2 / IPFS for evidence files

---

5. Core MVP Pages

Home Page

Purpose:

Entry point for users.

Actions:

* Check reputation
* Create trade link
* View my profile

---

Reputation Profile Page

Purpose:

Show public trading reputation.

Displays:

* TrustLayer ID
* Account age
* Completed trades
* Confirmation rate
* Dispute count
* Verification status
* Recent activity
* Timeline

---

Create Trade Page

Purpose:

Create a trade from an external marketplace link.

Inputs:

* marketplace URL
* item title
* seller or buyer role
* optional description

Output:

* TrustLayer trade link

---

Trade Page

Purpose:

Shared trade workspace.

Displays:

* trade summary
* participants
* current status
* event timeline
* available actions

Actions:

* accept trade
* confirm completion
* submit post-trade event

---

6. Core Backend Modules

Identity Module

Handles:

* user creation
* login
* TrustLayer ID
* linked email or phone
* wallet reference

---

Trade Module

Handles:

* trade creation
* trade acceptance
* trade status
* trade timeline

---

Reputation Event Module

Handles:

* event creation
* event validation
* event hashing
* event persistence

---

Reputation Profile Module

Handles:

* statistics calculation
* public profile response
* recent activity
* confidence indicators

---

7. MVP Data Objects

Core objects:

* User
* Identity
* Trade
* ReputationEvent
* EvidenceReference
* MarketplaceReference

---

8. MVP Data Flow

User creates trade
        ↓
Trade stored in database
        ↓
Other party accepts
        ↓
Both parties confirm
        ↓
Reputation event generated
        ↓
Event hash recorded
        ↓
Reputation profile recalculated
        ↓
Public profile updated

---

9. Blockchain Role in MVP

In MVP 0.1, blockchain should be used minimally.

It should store:

* event hash
* event type
* user references
* trade reference
* timestamp

It should not store:

* images
* private messages
* phone numbers
* email addresses
* full item descriptions

---

10. Development Order

Recommended build order:

1. Project setup
2. Frontend skeleton
3. D1 database schema
4. User identity module
5. Reputation profile page
6. Create trade page
7. Trade page
8. Reputation event logic
9. Smart contract prototype
10. API integration
11. Deployment to Cloudflare Pages

---

11. Codex Working Rule

Before implementation, Codex must read:

* PROJECT_BIBLE.md
* README.md
* ROADMAP.md
* docs/architecture/system-overview.md
* docs/architecture/mvp-engineering-overview.md

Codex must not implement features outside MVP scope unless explicitly instructed.

---

12. Success Criteria

MVP 0.1 is successful when:

* A user can create a TrustLayer identity.
* A user can create a trade link.
* Another user can join the trade.
* Both parties can confirm completion.
* A reputation event is recorded.
* A public reputation profile updates.
* The system does not require users to understand blockchain.

---

13. Engineering Summary

MVP 0.1 should be small, clear, and testable.

It should prove the TrustLayer philosophy through one simple workflow:

Create identity.

Create trade.

Confirm trade.

Record event.

Show reputation.

No more.