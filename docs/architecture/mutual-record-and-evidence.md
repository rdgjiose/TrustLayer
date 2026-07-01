# TrustLayer Mutual Record and Evidence Architecture

Document: docs/architecture/mutual-record-and-evidence.md

Version: 1.0

Status: Draft

---

## 1. Purpose

This document records TrustLayer's future architectural direction for Mutual Records, Evidence Snapshots, privacy, and invitation sharing.

The current MVP remains focused on Trade Records and trading reputation. This document does not introduce product code, database migrations, storage integrations, blockchain anchoring, or legal claims.

---

## 2. Mutual Record Concept

TrustLayer began with the Trade Record because peer-to-peer trading is the first MVP domain.

The deeper architectural model may become broader:

* Trade Record
* Agreement Record
* Future record types

A Mutual Record is a shared historical record between participants. It records that people took part in a real-world interaction and created evidence through their actions.

A Trade Record is one type of Mutual Record. It records a trading lifecycle:

* record created
* participant invited
* participant accepted
* buyer confirmed
* seller confirmed
* trade recorded

A future Agreement Record may record a private agreement lifecycle without exposing agreement content publicly.

For now, TrustLayer should continue building only the Trade Record MVP. The broader Mutual Record idea should guide architecture, vocabulary, and evidence design without expanding implementation scope prematurely.

---

## 3. Invitation Sharing UX

TrustLayer should not depend only on direct links sent inside marketplace chat.

Some platforms may block, rewrite, hide, or warn against external links. Users may also communicate outside platform chat through SMS, email, printed material, or face-to-face exchange.

Future invitation sharing should support several paths:

* clean branded link
* short invite code
* QR code
* copyable message text
* manual code entry on the TrustLayer website

The user experience should make it clear that TrustLayer does not host marketplace listings, process payment, or replace the marketplace conversation. TrustLayer records the shared history that participants choose to create.

---

## 4. Marketplace Deletion Scenario

External marketplace records may not remain available.

A listing may be:

* deleted by the seller
* removed by the marketplace
* changed after the TrustLayer record is created
* hidden behind account access
* unavailable after account suspension
* unavailable because the marketplace changes its URLs or policies

TrustLayer should not assume external platform records are permanent.

At creation or confirmation time, TrustLayer should eventually capture enough evidence to preserve the context of the Mutual Record. The goal is not to scrape marketplaces broadly. The goal is to preserve user-provided or user-authorized evidence that supports the historical record.

---

## 5. Evidence Snapshot Model

Future Evidence Snapshots should use three layers:

1. D1 metadata
2. Evidence package storage
3. Blockchain hash anchors

### D1 Metadata

D1 should store lightweight operational metadata:

* record identifiers
* participant references
* evidence type
* storage provider
* storage reference
* evidence hash
* visibility level
* timestamps

D1 should support product queries. It should not become the only long-term preservation layer for original evidence files.

### Evidence Package Storage

Original evidence packages may be stored in:

* Cloudflare R2
* IPFS
* user export archives
* future decentralized storage

Evidence packages may include:

* marketplace listing snapshots
* item photos
* agreement terms
* confirmation metadata
* user-uploaded supporting files

Sensitive evidence should be private or participant-visible by default. Public reputation views should expose only the minimum information needed to understand the historical event.

### Blockchain Hash Anchors

Blockchain should store integrity references, not raw evidence:

* event hash
* evidence package hash
* timestamp
* record identifier
* optional participant signatures

Blockchain can help prove that a known evidence package has not changed since anchoring. It does not prove that the real-world claim is true.

---

## 6. Hash Limitation

A hash alone cannot reconstruct lost evidence.

If the original evidence package is gone, the hash can still show that a specific package once had a specific fingerprint, but it cannot recover the missing file, image, text, or snapshot.

Hashing answers:

* Does this available evidence match the historical fingerprint?
* Has this available evidence changed?

Hashing does not answer:

* What was in the evidence if the original is lost?
* Was the real-world claim true?
* Did a court, regulator, or marketplace validate the claim?

TrustLayer should therefore pair hash anchoring with practical evidence preservation, export, retention, and access-control strategies.

---

## 7. Privacy and Legal Principles

TrustLayer should follow data minimization.

Every future Mutual Record or Evidence Snapshot feature should ask:

* Is this data necessary?
* Can less sensitive data support the same historical event?
* Who should be allowed to see it?
* How long should it be retained?
* Can the user export or preserve their own copy?

TrustLayer should separate visibility layers:

* public reputation data
* participant-visible record data
* private evidence
* sensitive identity data

Public reputation data may include high-level historical events such as a recorded trade.

Participant-visible record data may include the shared context needed by the people involved in the record.

Private evidence may include screenshots, documents, photos, terms, or other material that should not be public.

Sensitive identity data may include phone numbers, emails, payment details, government IDs, private messages, and addresses. These should not be exposed publicly and should not be stored unless necessary.

TrustLayer does not replace lawyers, courts, marketplace moderation, consumer protection agencies, or formal notarization. It records history and evidence. Users, marketplaces, and appropriate institutions interpret that history.

---

## 8. Private Agreement Future

A future Agreement Record may allow two participants to confirm that an agreement exists without publishing the agreement content.

The public layer may show only:

* agreement record existed
* participants confirmed
* timestamp
* hash anchor or evidence reference
* high-level record category

The private layer may preserve:

* agreement text
* terms
* signatures or confirmations
* supporting evidence

This would let TrustLayer preserve hash and timestamp proof while keeping content private.

This is future direction only. It should not be implemented inside the current Trade Record MVP unless a later task explicitly scopes it.

---

## 9. Current MVP Boundary

Task 029 is documentation-only.

Do not implement now:

* full Agreement Record feature
* evidence upload
* Cloudflare R2 storage
* IPFS storage
* blockchain anchoring
* real registration gate
* legal claims or legal validation workflows
* marketplace scraping
* payment or escrow
* reputation score calculation
* evidence browsing UI
* database schema changes

Current MVP should continue focusing on:

* Trade Record creation
* invitation acceptance
* buyer and seller confirmation
* recorded trade events
* public reputation timeline projection

The Mutual Record model should guide future design, but the product should remain small and reviewable.

---

## 10. Summary

TrustLayer records history. It does not judge people.

Trade Records are the first implementation of a broader Mutual Record direction.

Evidence Snapshots should preserve context without depending on external marketplaces forever.

Hashes prove integrity only when evidence remains available.

Privacy, data minimization, and clear visibility boundaries are architectural requirements.

The current MVP should stay focused on Trade Records while leaving room for future Agreement Records and evidence preservation features.
