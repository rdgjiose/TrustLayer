PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  trustlayer_id TEXT NOT NULL UNIQUE,
  public_profile_slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

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

CREATE TABLE marketplace_references (
  id TEXT PRIMARY KEY,
  marketplace_name TEXT NOT NULL,
  external_url TEXT,
  external_id TEXT,
  snapshot_hash TEXT,
  created_at TEXT NOT NULL
);

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
  observation_window_ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (buyer_user_id) REFERENCES users(id),
  FOREIGN KEY (seller_user_id) REFERENCES users(id),
  FOREIGN KEY (marketplace_reference_id) REFERENCES marketplace_references(id)
);

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

CREATE INDEX idx_users_trustlayer_id ON users(trustlayer_id);
CREATE INDEX idx_users_public_profile_slug ON users(public_profile_slug);

CREATE INDEX idx_identities_user_id ON identities(user_id);
CREATE INDEX idx_identities_identity_type ON identities(identity_type);

CREATE INDEX idx_marketplace_references_marketplace_name
  ON marketplace_references(marketplace_name);
CREATE INDEX idx_marketplace_references_external_id
  ON marketplace_references(external_id);

CREATE INDEX idx_trades_buyer_user_id ON trades(buyer_user_id);
CREATE INDEX idx_trades_seller_user_id ON trades(seller_user_id);
CREATE INDEX idx_trades_marketplace_reference_id
  ON trades(marketplace_reference_id);
CREATE INDEX idx_trades_trade_code ON trades(trade_code);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_created_at ON trades(created_at);

CREATE INDEX idx_reputation_events_trade_id ON reputation_events(trade_id);
CREATE INDEX idx_reputation_events_actor_user_id
  ON reputation_events(actor_user_id);
CREATE INDEX idx_reputation_events_target_user_id
  ON reputation_events(target_user_id);
CREATE INDEX idx_reputation_events_event_type ON reputation_events(event_type);
CREATE INDEX idx_reputation_events_created_at ON reputation_events(created_at);

CREATE INDEX idx_evidence_references_event_id
  ON evidence_references(event_id);
CREATE INDEX idx_evidence_references_evidence_hash
  ON evidence_references(evidence_hash);
