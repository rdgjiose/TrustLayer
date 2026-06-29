TrustLayer Blockchain Ledger

Document: docs/architecture/blockchain-ledger.md

Version: 1.0

Status: Draft

---

1. Purpose

This document defines what information is stored on-chain within TrustLayer.

The blockchain is the permanent evidence layer of the system.

Its purpose is not to store user interfaces, marketplace data, or reputation scores.

Its purpose is to preserve immutable historical evidence.

---

2. Core Philosophy

Blockchain stores evidence.

Evidence creates history.

History produces reputation.

Therefore,

Blockchain does not store reputation.

Blockchain stores the evidence from which reputation is derived.

---

3. Ledger Responsibilities

The blockchain ledger is responsible for:

* preserving reputation events
* preventing historical modification
* providing auditability
* supporting ownership
* ensuring append-only history

The ledger is NOT responsible for:

* user interface
* reputation calculation
* dispute judgement
* marketplace functionality

---

4. Ledger Architecture

Real-world Behaviour
          │
          ▼
Verified Event
          │
          ▼
Blockchain Ledger
          │
          ▼
Immutable History
          │
          ▼
Reputation Engine
          │
          ▼
Reputation Profile

The blockchain records facts.

Applications interpret facts.

---

5. On-chain Data

The blockchain should store only information that benefits from immutability.

Examples

* Event ID
* Event Type
* User IDs (hashed)
* Trade ID
* Timestamp
* Previous Event Reference
* Event Hash
* Digital Signatures
* Smart Contract Version
* Transaction ID

Large data should never be stored directly on-chain.

---

6. Off-chain Data

Large or private information remains off-chain.

Examples

* Item description
* Images
* Chat messages
* Personal information
* Phone number
* Email
* Marketplace screenshots
* Evidence files

The blockchain stores only references or hashes.

---

7. Event Chain

Each reputation event becomes part of an immutable chain.

Trade Created
↓
Seller Accepted
↓
Terms Confirmed
↓
Buyer Confirmed
↓
Seller Confirmed
↓
Trade Completed

Every event references the previous event.

Nothing is overwritten.

---

8. Append-only Principle

Historical events are never deleted.

Corrections create additional events.

Example

Trade Completed
↓
Fraud Confirmed
↓
Court Decision Recorded
↓
Reputation Recalculated

History grows.

History never disappears.

---

9. Event Integrity

Each event contains:

* Event ID
* Previous Event
* Event Hash
* Timestamp
* Digital Signature

This allows anyone to verify that history has not been modified.

---

10. Hash-based Evidence

TrustLayer stores hashes rather than files.

Example

Marketplace Screenshot
↓
SHA-256 Hash
↓
Blockchain

Actual files may be stored in:

* IPFS
* Cloudflare R2
* Other storage

Blockchain proves integrity.

Storage provides availability.

---

11. Digital Signatures

Each important event should be signed.

Possible signatures include:

Buyer

Seller

TrustLayer

Future Arbitrator

Each signature increases confidence.

---

12. Privacy

Public users should never see:

Phone numbers

Email addresses

Private messages

Identity documents

Sensitive evidence

The blockchain stores only cryptographic references.

---

13. Ledger Evolution

The blockchain is permanent.

The interpretation layer may evolve.

Example

Algorithm Version 1

↓

Algorithm Version 2

↓

Algorithm Version 3

All calculate reputation from the same historical ledger.

History remains stable.

Interpretation improves.

---

14. Why Not Store Reputation Scores?

Traditional systems store scores.

Scores become outdated.

Algorithms improve.

Scores change.

TrustLayer stores historical evidence.

Reputation scores are generated dynamically.

History remains the single source of truth.

---

15. Ledger Security

The ledger should guarantee:

Immutability

Auditability

Ownership

Integrity

Traceability

Tamper resistance

These properties create long-term trust.

---

16. Future Multi-chain Support

Future versions may support multiple blockchains.

Possible examples:

Ethereum

NEAR

Polygon

Solana

The ledger model should remain blockchain-independent.

Only the implementation changes.

---

17. Architecture Summary

TrustLayer does not use blockchain to replace trust.

TrustLayer uses blockchain to protect evidence.

Evidence forms history.

History belongs to users.

Reputation is derived from history.

Blockchain protects the foundation upon which reputation is built.