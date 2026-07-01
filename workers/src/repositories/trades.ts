import type {
  TradeLifecyclePayload,
  TradeLifecycleStateId,
  TradeRecordData,
  TradeTimelineEvent
} from "../../../shared/types/trade-record";

const availableTradeLifecycleStates: TradeLifecycleStateId[] = [
  "awaiting_seller_acceptance",
  "accepted",
  "awaiting_seller_confirmation",
  "mutually_confirmed",
  "recorded",
  "cancelled"
];

type TradeRecordRow = {
  trade_id: string;
  trade_code: string;
  item_title: string | null;
  item_summary: string | null;
  trade_status: string;
  marketplace_name: string | null;
  buyer_name: string | null;
  buyer_trustlayer_id: string | null;
  seller_name: string | null;
  seller_trustlayer_id: string | null;
};

type TradeEventRow = {
  event_type: string;
  event_payload_json: string | null;
  created_at: string;
};

type TradeUserRow = {
  id: string;
  display_name: string;
  trustlayer_id: string;
};

type EventPayload = {
  description?: string;
  summary?: string;
};

export type CreateTradeInput = {
  creatorTrustlayerId: string;
  invitedTrustlayerId: string;
  creatorRole: "buyer" | "seller";
  marketplace: string | null;
  listingUrl: string | null;
  itemTitle: string;
  itemSummary: string | null;
};

export type CreateTradeResult = {
  tradeCode: string;
  publicUrl: string;
  state: string;
  message: string;
};

const eventTypeLabels: Record<string, string> = {
  invitation_sent: "Invitation Sent",
  trade_created: "Trade Created",
  waiting_for_seller_acceptance: "Waiting for Seller Acceptance"
};

const tradeStatusLabels: Record<string, string> = {
  awaiting_seller_acceptance: "Awaiting Seller Acceptance"
};

export async function getTradeRecordByCode(
  db: D1Database,
  tradeCode: string
): Promise<TradeRecordData | null> {
  const trade = await db
    .prepare(
      `
        SELECT
          trades.id AS trade_id,
          trades.trade_code,
          trades.item_title,
          trades.item_summary,
          trades.status AS trade_status,
          marketplace_references.marketplace_name,
          buyer.display_name AS buyer_name,
          buyer.trustlayer_id AS buyer_trustlayer_id,
          seller.display_name AS seller_name,
          seller.trustlayer_id AS seller_trustlayer_id
        FROM trades
        LEFT JOIN users AS buyer ON buyer.id = trades.buyer_user_id
        LEFT JOIN users AS seller ON seller.id = trades.seller_user_id
        LEFT JOIN marketplace_references
          ON marketplace_references.id = trades.marketplace_reference_id
        WHERE trades.trade_code = ?
        LIMIT 1
      `
    )
    .bind(tradeCode)
    .first<TradeRecordRow>();

  if (!trade) {
    return null;
  }

  const eventsResult = await db
    .prepare(
      `
        SELECT
          event_type,
          event_payload_json,
          created_at
        FROM reputation_events
        WHERE trade_id = ?
        ORDER BY created_at ASC
      `
    )
    .bind(trade.trade_id)
    .all<TradeEventRow>();

  const timeline = (eventsResult.results ?? []).map(mapTimelineEvent);
  const lifecycle = mapLifecycle(trade, timeline);

  return {
    tradeId: trade.trade_id,
    tradeCode: trade.trade_code,
    item: {
      title: trade.item_title ?? "Untitled Trade Record",
      summary: trade.item_summary ?? "No item summary recorded.",
      marketplace: trade.marketplace_name ?? "External Marketplace",
      source: trade.marketplace_name ?? "External Marketplace"
    },
    participants: {
      buyer: {
        name: trade.buyer_name ?? "Unknown buyer",
        trustlayerId: trade.buyer_trustlayer_id ?? "unknown"
      },
      seller: {
        name: trade.seller_name ?? "Unknown seller",
        trustlayerId: trade.seller_trustlayer_id ?? "unknown"
      }
    },
    currentState: mapTradeStatus(trade.trade_status),
    availableStates: availableTradeLifecycleStates,
    lifecycle
  };
}

export async function createTradeRecord(
  db: D1Database,
  input: CreateTradeInput
): Promise<CreateTradeResult | null> {
  const [creator, invited] = await Promise.all([
    getUserByTrustLayerId(db, input.creatorTrustlayerId),
    getUserByTrustLayerId(db, input.invitedTrustlayerId)
  ]);

  if (!creator || !invited) {
    return null;
  }

  const now = new Date().toISOString();
  const tradeCode = await generateTradeCode(db);
  const tradeId = `trd_${tradeCode.replace("tr-", "")}`;
  const marketplaceReferenceId = input.listingUrl
    ? `mkt_${tradeCode.replace("tr-", "")}`
    : null;
  const tradeCreatedEventId = `evt_${tradeCode.replace("tr-", "")}_created`;
  const invitationEventId = `evt_${tradeCode.replace("tr-", "")}_invitation_sent`;
  const creatorIsBuyer = input.creatorRole === "buyer";
  const buyer = creatorIsBuyer ? creator : invited;
  const seller = creatorIsBuyer ? invited : creator;
  const invitedRole = creatorIsBuyer ? "Seller" : "Buyer";
  const state = creatorIsBuyer
    ? "awaiting_seller_acceptance"
    : "awaiting_buyer_acceptance";

  const marketplaceName = input.marketplace ?? "Manual";
  const writeStatements: D1PreparedStatement[] = [];

  if (marketplaceReferenceId) {
    writeStatements.push(
      db
        .prepare(
          `
            INSERT INTO marketplace_references (
              id,
              marketplace_name,
              external_url,
              external_id,
              snapshot_hash,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `
        )
        .bind(
          marketplaceReferenceId,
          marketplaceName,
          input.listingUrl,
          null,
          `hash_${marketplaceReferenceId}`,
          now
        )
    );
  }

  writeStatements.push(
    db
      .prepare(
        `
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .bind(
        tradeId,
        tradeCode,
        buyer.id,
        seller.id,
        marketplaceReferenceId,
        input.itemTitle,
        input.itemSummary,
        `hash_terms_${tradeCode}`,
        state,
        null,
        now,
        now
      ),
    db
      .prepare(
        `
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .bind(
        tradeCreatedEventId,
        "trade_created",
        tradeId,
        creator.id,
        creator.id,
        JSON.stringify({
          description:
            "Trade Record opened from an external marketplace listing."
        }),
        `hash_${tradeCreatedEventId}`,
        null,
        null,
        now
      ),
    db
      .prepare(
        `
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .bind(
        invitationEventId,
        "invitation_sent",
        tradeId,
        creator.id,
        invited.id,
        JSON.stringify({
          description: `${invitedRole} was invited to join this Trade Record.`
        }),
        `hash_${invitationEventId}`,
        null,
        tradeCreatedEventId,
        now
      )
  );

  await db.batch(writeStatements);

  return {
    tradeCode,
    publicUrl: `/trade/${tradeCode}`,
    state,
    message: "Trade Record created."
  };
}

async function getUserByTrustLayerId(
  db: D1Database,
  trustlayerId: string
): Promise<TradeUserRow | null> {
  return db
    .prepare(
      `
        SELECT
          id,
          display_name,
          trustlayer_id
        FROM users
        WHERE trustlayer_id = ?
        LIMIT 1
      `
    )
    .bind(trustlayerId)
    .first<TradeUserRow>();
}

async function generateTradeCode(db: D1Database): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const tradeCode = `tr-${randomNumericId()}`;
    const existingTrade = await db
      .prepare("SELECT id FROM trades WHERE trade_code = ? LIMIT 1")
      .bind(tradeCode)
      .first<{ id: string }>();

    if (!existingTrade) {
      return tradeCode;
    }
  }

  throw new Error("Unable to generate unique trade code.");
}

function mapLifecycle(
  trade: TradeRecordRow,
  timeline: TradeTimelineEvent[]
): TradeLifecyclePayload {
  return {
    tradeStatus: tradeStatusLabels[trade.trade_status] ?? trade.trade_status,
    invitation: {
      invitedRole: "Seller",
      invitedParticipant: trade.seller_name ?? "Unknown seller",
      state: "Pending",
      link: `/trade/${trade.trade_code}`,
      createdBy: trade.buyer_name ?? "Unknown creator"
    },
    confirmation: {
      currentState: "Unavailable until Participant Acceptance",
      isUnavailable: true,
      participants: [],
      note: "No trade confirmation can happen until both participants have joined this Trade Record."
    },
    timeline,
    note: "TrustLayer records historical events. It does not judge participants."
  };
}

function mapTradeStatus(status: string): TradeLifecycleStateId {
  if (availableTradeLifecycleStates.includes(status as TradeLifecycleStateId)) {
    return status as TradeLifecycleStateId;
  }

  return "awaiting_seller_acceptance";
}

function mapTimelineEvent(event: TradeEventRow): TradeTimelineEvent {
  const payload = parseEventPayload(event.event_payload_json);

  return {
    dateTime: trimUtcSuffix(event.created_at),
    displayTime: formatDisplayTime(event.created_at),
    eventType: eventTypeLabels[event.event_type] ?? titleCase(event.event_type),
    description:
      payload.description ??
      payload.summary ??
      "Trade history event recorded by TrustLayer."
  };
}

function parseEventPayload(value: string | null): EventPayload {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as EventPayload;
  } catch {
    return {};
  }
}

function trimUtcSuffix(value: string): string {
  return value.endsWith("Z") ? value.slice(0, -1) : value;
}

function formatDisplayTime(value: string): string {
  return trimUtcSuffix(value).replace("T", " ").slice(0, 16);
}

function randomNumericId(): string {
  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);

  return String((randomValue[0] ?? 0) % 1_000_000).padStart(6, "0");
}

function titleCase(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}
