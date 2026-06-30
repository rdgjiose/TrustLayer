PRAGMA foreign_keys = ON;

INSERT INTO users (
  id,
  display_name,
  trustlayer_id,
  public_profile_slug,
  created_at,
  updated_at
)
VALUES
  (
    'usr_jasper_h',
    'Jasper H.',
    'tl-9f32a',
    'tl-9f32a',
    '2026-06-28T00:00:00Z',
    '2026-06-28T00:00:00Z'
  ),
  (
    'usr_mina_r',
    'Mina R.',
    'tl-4m7q2',
    'tl-4m7q2',
    '2026-06-21T09:12:00Z',
    '2026-06-21T09:12:00Z'
  )
ON CONFLICT(id) DO UPDATE SET
  display_name = excluded.display_name,
  trustlayer_id = excluded.trustlayer_id,
  public_profile_slug = excluded.public_profile_slug,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO identities (
  id,
  user_id,
  identity_type,
  identity_value_hash,
  verified_at,
  created_at,
  updated_at
)
VALUES
  (
    'id_jasper_email',
    'usr_jasper_h',
    'email',
    'hash_mock_jasper_email',
    '2026-06-28T00:00:00Z',
    '2026-06-28T00:00:00Z',
    '2026-06-28T00:00:00Z'
  ),
  (
    'id_jasper_phone',
    'usr_jasper_h',
    'phone',
    'hash_mock_jasper_phone',
    '2026-06-28T00:00:00Z',
    '2026-06-28T00:00:00Z',
    '2026-06-28T00:00:00Z'
  ),
  (
    'id_jasper_marketplace',
    'usr_jasper_h',
    'marketplace',
    'hash_mock_jasper_marketplace',
    '2026-06-28T00:00:00Z',
    '2026-06-28T00:00:00Z',
    '2026-06-28T00:00:00Z'
  ),
  (
    'id_mina_marketplace',
    'usr_mina_r',
    'marketplace',
    'hash_mock_mina_marketplace',
    NULL,
    '2026-06-21T09:12:00Z',
    '2026-06-21T09:12:00Z'
  )
ON CONFLICT(id) DO UPDATE SET
  user_id = excluded.user_id,
  identity_type = excluded.identity_type,
  identity_value_hash = excluded.identity_value_hash,
  verified_at = excluded.verified_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO marketplace_references (
  id,
  marketplace_name,
  external_url,
  external_id,
  snapshot_hash,
  created_at
)
VALUES (
  'mkt_facebook_tr_000001',
  'Facebook Marketplace',
  'https://facebook.example/marketplace/item/tr-000001',
  'mock-tr-000001',
  'hash_mock_marketplace_snapshot_tr_000001',
  '2026-06-21T09:10:00Z'
)
ON CONFLICT(id) DO UPDATE SET
  marketplace_name = excluded.marketplace_name,
  external_url = excluded.external_url,
  external_id = excluded.external_id,
  snapshot_hash = excluded.snapshot_hash,
  created_at = excluded.created_at;

INSERT INTO trades (
  id,
  trade_code,
  buyer_user_id,
  seller_user_id,
  marketplace_reference_id,
  item_title,
  item_summary,
  terms_hash,
  status,
  observation_window_ends_at,
  created_at,
  updated_at
)
VALUES (
  'trd_000001',
  'tr-000001',
  'usr_jasper_h',
  'usr_mina_r',
  'mkt_facebook_tr_000001',
  'iPhone 14',
  'Used iPhone 14 in good condition',
  'hash_mock_terms_tr_000001',
  'awaiting_seller_acceptance',
  NULL,
  '2026-06-21T09:10:00Z',
  '2026-06-21T09:13:00Z'
)
ON CONFLICT(id) DO UPDATE SET
  trade_code = excluded.trade_code,
  buyer_user_id = excluded.buyer_user_id,
  seller_user_id = excluded.seller_user_id,
  marketplace_reference_id = excluded.marketplace_reference_id,
  item_title = excluded.item_title,
  item_summary = excluded.item_summary,
  terms_hash = excluded.terms_hash,
  status = excluded.status,
  observation_window_ends_at = excluded.observation_window_ends_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

INSERT INTO reputation_events (
  id,
  event_type,
  trade_id,
  actor_user_id,
  target_user_id,
  event_payload_json,
  event_hash,
  blockchain_tx_id,
  previous_event_id,
  created_at
)
VALUES
  (
    'evt_tr_000001_created',
    'trade_created',
    'trd_000001',
    'usr_jasper_h',
    'usr_jasper_h',
    '{"description":"Trade Record opened from an external marketplace listing."}',
    'hash_evt_tr_000001_created',
    NULL,
    NULL,
    '2026-06-21T09:10:00Z'
  ),
  (
    'evt_tr_000001_invitation_sent',
    'invitation_sent',
    'trd_000001',
    'usr_jasper_h',
    'usr_mina_r',
    '{"description":"Seller was invited to join this Trade Record."}',
    'hash_evt_tr_000001_invitation_sent',
    NULL,
    'evt_tr_000001_created',
    '2026-06-21T09:12:00Z'
  ),
  (
    'evt_tr_000001_waiting_seller',
    'waiting_for_seller_acceptance',
    'trd_000001',
    'usr_jasper_h',
    'usr_mina_r',
    '{"description":"Confirmation is unavailable until the invited seller accepts."}',
    'hash_evt_tr_000001_waiting_seller',
    NULL,
    'evt_tr_000001_invitation_sent',
    '2026-06-21T09:13:00Z'
  ),
  (
    'evt_jasper_trade_completed',
    'trade_completed',
    NULL,
    NULL,
    'usr_jasper_h',
    '{"summary":"Trade completed with mutual confirmation."}',
    'hash_evt_jasper_trade_completed',
    NULL,
    NULL,
    '2026-06-20T00:00:00Z'
  ),
  (
    'evt_jasper_trade_cancelled',
    'trade_cancelled',
    NULL,
    NULL,
    'usr_jasper_h',
    '{"summary":"Trade cancelled before mutual confirmation."}',
    'hash_evt_jasper_trade_cancelled',
    NULL,
    'evt_jasper_trade_completed',
    '2026-06-18T00:00:00Z'
  ),
  (
    'evt_jasper_dispute_resolved',
    'issue_resolved',
    NULL,
    NULL,
    'usr_jasper_h',
    '{"summary":"Issue record closed with both parties updated."}',
    'hash_evt_jasper_dispute_resolved',
    NULL,
    'evt_jasper_trade_cancelled',
    '2026-06-12T00:00:00Z'
  )
ON CONFLICT(id) DO UPDATE SET
  event_type = excluded.event_type,
  trade_id = excluded.trade_id,
  actor_user_id = excluded.actor_user_id,
  target_user_id = excluded.target_user_id,
  event_payload_json = excluded.event_payload_json,
  event_hash = excluded.event_hash,
  blockchain_tx_id = excluded.blockchain_tx_id,
  previous_event_id = excluded.previous_event_id,
  created_at = excluded.created_at;

INSERT INTO evidence_references (
  id,
  event_id,
  evidence_type,
  storage_provider,
  storage_reference,
  evidence_hash,
  visibility,
  created_at
)
VALUES (
  'evref_tr_000001_marketplace_snapshot',
  'evt_tr_000001_created',
  'marketplace_snapshot',
  'external_url',
  'https://facebook.example/marketplace/item/tr-000001',
  'hash_mock_marketplace_snapshot_tr_000001',
  'participants_only',
  '2026-06-21T09:10:00Z'
)
ON CONFLICT(id) DO UPDATE SET
  event_id = excluded.event_id,
  evidence_type = excluded.evidence_type,
  storage_provider = excluded.storage_provider,
  storage_reference = excluded.storage_reference,
  evidence_hash = excluded.evidence_hash,
  visibility = excluded.visibility,
  created_at = excluded.created_at;

INSERT INTO reputation_stats (
  user_id,
  completed_trades,
  total_trades,
  cancelled_trades,
  disputed_trades,
  no_show_events,
  confirmation_rate,
  dispute_rate,
  reputation_confidence,
  last_calculated_at
)
VALUES (
  'usr_jasper_h',
  126,
  132,
  1,
  2,
  0,
  0.98,
  0.02,
  'High',
  '2026-06-28T00:00:00Z'
)
ON CONFLICT(user_id) DO UPDATE SET
  completed_trades = excluded.completed_trades,
  total_trades = excluded.total_trades,
  cancelled_trades = excluded.cancelled_trades,
  disputed_trades = excluded.disputed_trades,
  no_show_events = excluded.no_show_events,
  confirmation_rate = excluded.confirmation_rate,
  dispute_rate = excluded.dispute_rate,
  reputation_confidence = excluded.reputation_confidence,
  last_calculated_at = excluded.last_calculated_at;
