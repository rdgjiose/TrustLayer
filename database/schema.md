TrustLayer Database Schema

Document: database/schema.md
Version: 1.0
Status: Draft

---

1. Purpose

This document defines the initial database schema for TrustLayer MVP 0.1.

The database supports application speed, user experience, and API queries.

It is not the final source of historical truth.

Immutable reputation evidence should eventually be anchored to blockchain records.

---

2. Database Role

The database stores operational data for the application.

It supports:

* user login
* profile display
* trade creation
* trade status
* event timeline
* reputation statistics
* API responses

The database may cache calculated reputation.

The blockchain preserves immutable event references.

---

3. Database Technology

MVP 0.1 target:

Cloudflare D1

Underlying model:

SQLite-compatible relational database

---

4. Core Tables

MVP 0.1 contains the following tables:

users
identities
marketplace_references
trades
reputation_events
evidence_references
reputation_stats

---

5. Table: users

Stores the main TrustLayer user profile.

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    trustlayer_id TEXT NOT NULL UNIQUE,
    public_profile_slug TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

Notes:

* id is internal.
* trustlayer_id is the public user identifier.
* public_profile_slug is used in public profile URLs.

---

6. Table: identities

Stores login and verification references.

CREATE TABLE identities (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    identity_type TEXT NOT NULL,
    identity_value_hash TEXT NOT NULL,
    verified_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

Examples of identity_type:

email
phone
wallet
google
apple

Private identity values should be hashed or encrypted.

Do not store raw phone numbers or emails unless strictly required.

---

7. Table: marketplace_references

Stores external marketplace references.

CREATE TABLE marketplace_references (
    id TEXT PRIMARY KEY,
    marketplace_name TEXT NOT NULL,
    external_url TEXT,
    external_id TEXT,
    snapshot_hash TEXT,
    created_at TEXT NOT NULL
);

Examples:

facebook_marketplace
trademe
xhs
wechat
manual

---

8. Table: trades

Stores one peer-to-peer trade.

CREATE TABLE trades (
    id TEXT PRIMARY KEY,
    trade_code TEXT NOT NULL UNIQUE,
    buyer_user_id TEXT,
    seller_user_id TEXT,
    marketplace_reference_id TEXT,
    item_title TEXT,
    item_summary TEXT,
    terms_hash TEXT,
    status TEXT NOT NULL,
    listing_price TEXT,
    final_agreed_price TEXT,
    currency TEXT,
    trade_date TEXT,
    meeting_location_note TEXT,
    payment_method TEXT,
    included_notes TEXT,
    final_summary_status TEXT,
    final_summary_updated_at TEXT,
    observation_window_ends_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (buyer_user_id) REFERENCES users(id),
    FOREIGN KEY (seller_user_id) REFERENCES users(id),
    FOREIGN KEY (marketplace_reference_id) REFERENCES marketplace_references(id)
);

Possible trade statuses:

created
pending_acceptance
accepted
meeting_scheduled
buyer_confirmed
seller_confirmed
completed
observation
archived
cancelled
expired
disputed

Final Trade Summary fields:

* listing_price stores the price observed from the marketplace listing. It is reference evidence only and may differ from the final agreed price.
* final_agreed_price stores the price both participants may confirm in a future Final Trade Summary flow.
* currency stores the currency code, such as NZD.
* trade_date stores the expected or completed trade date or timestamp.
* meeting_location_note stores a broad location note only, such as a shopping mall, suburb, city, or public meeting place.
* payment_method stores optional text such as cash, bank transfer, or unknown. TrustLayer does not process payment.
* included_notes stores optional summary notes such as accessories or agreed conditions.
* final_summary_status stores the future summary workflow state, such as draft, proposed, or confirmed.
* final_summary_updated_at stores the timestamp of the latest Final Trade Summary update.

All Final Trade Summary fields are nullable so existing MVP trades remain valid.

Privacy notes:

* meeting_location_note should not store exact home addresses.
* payment_method should not store account numbers, card details, or private payment credentials.
* included_notes should not store private contact details or unnecessary personal information.
* These fields prepare future summary confirmation only. They do not create escrow, payment processing, legal contract generation, or automated judgement.

---

9. Table: reputation_events

Stores reputation events generated from behaviour.

CREATE TABLE reputation_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    trade_id TEXT,
    actor_user_id TEXT,
    target_user_id TEXT,
    event_payload_json TEXT,
    event_hash TEXT NOT NULL,
    blockchain_tx_id TEXT,
    previous_event_id TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (trade_id) REFERENCES trades(id),
    FOREIGN KEY (actor_user_id) REFERENCES users(id),
    FOREIGN KEY (target_user_id) REFERENCES users(id),
    FOREIGN KEY (previous_event_id) REFERENCES reputation_events(id)
);

Examples of event_type:

profile_created
trade_created
seller_accepted
buyer_confirmed_completion
seller_confirmed_completion
trade_completed
issue_submitted
evidence_uploaded
issue_resolved
false_complaint_detected

---

10. Table: evidence_references

Stores references to evidence files or hashes.

CREATE TABLE evidence_references (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    storage_provider TEXT NOT NULL,
    storage_reference TEXT,
    evidence_hash TEXT NOT NULL,
    visibility TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES reputation_events(id)
);

Examples of evidence_type:

marketplace_snapshot
item_photo
screenshot
receipt
document
video
manual_note

Examples of storage_provider:

d1_metadata
cloudflare_r2
ipfs
external_url

Possible visibility:

public
participants_only
private
restricted

---

11. Table: reputation_stats

Stores cached reputation statistics.

CREATE TABLE reputation_stats (
    user_id TEXT PRIMARY KEY,
    completed_trades INTEGER NOT NULL DEFAULT 0,
    total_trades INTEGER NOT NULL DEFAULT 0,
    cancelled_trades INTEGER NOT NULL DEFAULT 0,
    disputed_trades INTEGER NOT NULL DEFAULT 0,
    no_show_events INTEGER NOT NULL DEFAULT 0,
    confirmation_rate REAL NOT NULL DEFAULT 0,
    dispute_rate REAL NOT NULL DEFAULT 0,
    reputation_confidence TEXT NOT NULL DEFAULT 'low',
    last_calculated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

Notes:

* This table is derived from events.
* It can be rebuilt.
* It is not the source of truth.

---

12. Indexes

Suggested indexes:

CREATE INDEX idx_identities_user_id ON identities(user_id);
CREATE INDEX idx_trades_buyer_user_id ON trades(buyer_user_id);
CREATE INDEX idx_trades_seller_user_id ON trades(seller_user_id);
CREATE INDEX idx_trades_trade_code ON trades(trade_code);
CREATE INDEX idx_reputation_events_trade_id ON reputation_events(trade_id);
CREATE INDEX idx_reputation_events_actor_user_id ON reputation_events(actor_user_id);
CREATE INDEX idx_reputation_events_target_user_id ON reputation_events(target_user_id);
CREATE INDEX idx_evidence_references_event_id ON evidence_references(event_id);

---

13. Data Integrity Rules

Important rules:

* A trade cannot be completed unless both buyer and seller confirm.
* Reputation stats must be derived from reputation events.
* Evidence files should be referenced by hash.
* Raw private identity values should not be publicly exposed.
* Historical events should be append-only.

---

14. MVP Simplifications

MVP 0.1 may simplify:

* email-only login
* manual marketplace link
* no file upload
* no IPFS
* no complex dispute system
* basic reputation stats only

The schema is designed to allow future expansion.

---

15. Design Summary

The database supports the application.

The blockchain protects historical evidence.

The reputation engine calculates readable reputation.

The database may cache reputation, but it does not own reputation.

TrustLayer’s source of truth is historical behaviour preserved through events.
