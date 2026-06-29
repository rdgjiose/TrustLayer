TrustLayer Evidence Storage Architecture

Document: docs/architecture/evidence-storage.md

Version: 1.0

Status: Draft

---

1. Purpose

This document defines how TrustLayer stores and preserves evidence.

Evidence is the foundation of historical trust.

Without evidence, reputation becomes difficult to verify.

TrustLayer therefore separates evidence preservation from reputation calculation.

---

2. Core Philosophy

TrustLayer stores evidence.

Evidence creates history.

History produces reputation.

Reputation supports trust decisions.

The blockchain protects evidence integrity rather than storing every piece of evidence.

---

3. Design Goals

The evidence storage system should:

* Preserve important historical evidence
* Minimize blockchain storage cost
* Protect user privacy
* Support future verification
* Allow long-term traceability
* Remain independent of external marketplaces

---

4. Evidence Layers

TrustLayer stores evidence using three layers.

Layer 1
Blockchain Ledger
↓
Layer 2
Evidence Storage
↓
Layer 3
User Archive

Each layer has a different responsibility.

---

5. Layer 1 — Blockchain

Purpose

Guarantee integrity.

Store only immutable references.

Examples:

* Evidence Hash
* Event Hash
* Timestamp
* Trade ID
* User Signatures
* Transaction ID

The blockchain never stores large files.

---

6. Layer 2 — Evidence Storage

Purpose

Store evidence files.

Possible storage:

* Cloudflare R2
* IPFS
* Future decentralized storage

Examples:

* Item photos
* Marketplace screenshots
* Description snapshots
* Uploaded evidence
* Receipts
* Documents

Large files remain off-chain.

Hashes link them to blockchain records.

---

7. Layer 3 — User Archive

Purpose

Allow users to own copies of their own history.

Future features:

* Download evidence package
* Export trade history
* Personal backup
* Import backup

TrustLayer encourages users to preserve their own evidence.

---

8. Evidence Types

Possible evidence includes:

Marketplace Snapshot

A snapshot of the original listing.

Includes:

* title
* description
* price
* images
* marketplace URL

---

Trade Agreement

The agreed trading terms.

Examples:

* agreed price
* meeting location
* meeting time
* delivery method

Only hashes may be stored on-chain.

---

Confirmation Evidence

Evidence generated during trading.

Examples:

* buyer confirmation
* seller confirmation
* payment confirmation
* pickup confirmation

---

Post-trade Evidence

Evidence submitted after completion.

Examples:

* photos
* screenshots
* videos
* documents

---

9. Marketplace Independence

External marketplaces may remove:

* listings
* photos
* user accounts
* messages

TrustLayer should remain capable of proving that a trade existed.

Therefore:

Evidence should not rely entirely on external platforms.

---

10. Snapshot Strategy

When a trade is created, TrustLayer may create a lightweight snapshot.

Possible snapshot fields:

* item title
* description
* price
* marketplace name
* listing URL
* image hashes
* snapshot timestamp

This preserves important context even if the original listing disappears.

---

11. Hash Strategy

Every important file generates a cryptographic hash.

Example:

Marketplace Screenshot
↓
SHA-256
↓
Blockchain

If the file changes later,

its hash no longer matches.

This proves whether evidence has been modified.

---

12. Retention Policy

Different evidence may have different retention periods.

Example:

Normal trade evidence

12 months

↓

Disputed trade evidence

Long-term

↓

Blockchain hash

Permanent

Future versions may allow users to purchase permanent evidence storage.

---

13. Privacy

Evidence may contain sensitive information.

TrustLayer should never expose:

* private chat
* phone number
* address
* payment details
* government identity

Evidence visibility should always respect user permissions.

---

14. Ownership

Users own their evidence.

TrustLayer preserves references.

Blockchain protects integrity.

Evidence should remain portable.

Users should be able to export their own evidence.

---

15. Storage Cost

Storage should remain economically sustainable.

General principles:

Store only what provides long-term value.

Avoid duplicate files.

Compress large media where appropriate.

Use hashes whenever possible.

The blockchain should remain lightweight.

---

16. Future Evolution

Future versions may support:

* IPFS pinning
* decentralized storage providers
* encrypted evidence
* user-controlled encryption keys
* selective disclosure
* zero-knowledge proofs

The architecture should remain compatible with future technologies.

---

17. Architecture Summary

Evidence is more important than ratings.

Blockchain stores integrity.

Storage preserves files.

Users own history.

History creates reputation.

TrustLayer protects the evidence that allows reputation to remain meaningful, even after external platforms delete their own records.