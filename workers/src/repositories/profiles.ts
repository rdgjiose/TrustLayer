import type {
  RecentActivityItem,
  ReputationProfileData,
  ReputationStats,
  ReputationTimelineEvent,
  VerificationSignals
} from "../../../shared/types/reputation-profile";

type ReputationConfidence = "Low" | "Medium" | "High";

type ProfileRow = {
  user_id: string;
  trustlayer_id: string;
  display_name: string;
  created_at: string;
};

type IdentitySignalRow = {
  identity_type: string;
  verified_at: string | null;
};

type ReputationEventRow = {
  event_type: string;
  created_at: string;
};

type RecordedTradeEventRow = {
  created_at: string;
};

type CountRow = {
  count: number;
};

const recentActivityLabels: Record<string, string> = {
  issue_resolved: "Dispute resolved",
  trade_cancelled: "Trade cancelled",
  trade_completed: "Trade completed"
};

export async function getReputationProfileByTrustLayerId(
  db: D1Database,
  trustlayerId: string
): Promise<ReputationProfileData | null> {
  const profile = await db
    .prepare(
      `
        SELECT
          users.id AS user_id,
          users.trustlayer_id,
          users.display_name,
          users.created_at
        FROM users
        WHERE users.trustlayer_id = ?
        LIMIT 1
      `
    )
    .bind(trustlayerId)
    .first<ProfileRow>();

  if (!profile) {
    return null;
  }

  const [identitySignals, recentActivityEvents, recordedTradeEvents] =
    await Promise.all([
      getIdentitySignals(db, profile.user_id),
      getProfileEvents(db, profile.user_id),
      getRecordedTradeEvents(db, profile.user_id)
    ]);

  const stats = await getReputationStats(db, profile.user_id);

  return {
    trustlayerId: profile.trustlayer_id,
    displayName: profile.display_name,
    memberSince: formatDate(profile.created_at),
    reputationDomain: "trading",
    publicProfileUrl: `/u/${profile.trustlayer_id}`,
    stats,
    verification: mapVerificationSignals(identitySignals),
    recentActivity: recentActivityEvents.map(mapRecentActivity),
    eventTimeline: recordedTradeEvents.map(mapRecordedTradeTimelineEvent),
    note: "TrustLayer presents historical reputation events. It does not make trust decisions for users."
  };
}

async function getReputationStats(
  db: D1Database,
  userId: string
): Promise<ReputationStats> {
  const [completedTrades, totalTrades, disputeCount] = await Promise.all([
    countCompletedTrades(db, userId),
    countTotalTrades(db, userId),
    countDisputeEvents(db, userId)
  ]);
  const confirmationRate =
    totalTrades === 0 ? 0 : Number((completedTrades / totalTrades).toFixed(2));

  return {
    completedTrades,
    totalTrades,
    confirmationRate,
    disputeCount,
    reputationConfidence: calculateReputationConfidence(completedTrades)
  };
}

async function countCompletedTrades(
  db: D1Database,
  userId: string
): Promise<number> {
  return countRows(
    db
      .prepare(
        `
          SELECT COUNT(*) AS count
          FROM trades
          WHERE status = ?
            AND (
              buyer_user_id = ?
              OR seller_user_id = ?
            )
        `
      )
      .bind("recorded", userId, userId)
  );
}

async function countTotalTrades(
  db: D1Database,
  userId: string
): Promise<number> {
  return countRows(
    db
      .prepare(
        `
          SELECT COUNT(*) AS count
          FROM trades
          WHERE buyer_user_id = ?
            OR seller_user_id = ?
        `
      )
      .bind(userId, userId)
  );
}

async function countDisputeEvents(
  db: D1Database,
  userId: string
): Promise<number> {
  return countRows(
    db
      .prepare(
        `
          SELECT COUNT(DISTINCT reputation_events.id) AS count
          FROM reputation_events
          LEFT JOIN trades
            ON trades.id = reputation_events.trade_id
          WHERE reputation_events.event_type = ?
            AND (
              reputation_events.actor_user_id = ?
              OR reputation_events.target_user_id = ?
              OR trades.buyer_user_id = ?
              OR trades.seller_user_id = ?
            )
        `
      )
      .bind("dispute_resolved", userId, userId, userId, userId)
  );
}

async function countRows(statement: D1PreparedStatement): Promise<number> {
  const row = await statement.first<CountRow>();

  return row?.count ?? 0;
}

async function getIdentitySignals(
  db: D1Database,
  userId: string
): Promise<IdentitySignalRow[]> {
  const result = await db
    .prepare(
      `
        SELECT
          identity_type,
          verified_at
        FROM identities
        WHERE user_id = ?
      `
    )
    .bind(userId)
    .all<IdentitySignalRow>();

  return result.results ?? [];
}

async function getProfileEvents(
  db: D1Database,
  userId: string
): Promise<ReputationEventRow[]> {
  const result = await db
    .prepare(
      `
        SELECT
          event_type,
          created_at
        FROM reputation_events
        WHERE target_user_id = ?
          AND trade_id IS NULL
        ORDER BY created_at DESC
        LIMIT 5
      `
    )
    .bind(userId)
    .all<ReputationEventRow>();

  return result.results ?? [];
}

async function getRecordedTradeEvents(
  db: D1Database,
  userId: string
): Promise<RecordedTradeEventRow[]> {
  const result = await db
    .prepare(
      `
        SELECT
          reputation_events.created_at
        FROM reputation_events
        INNER JOIN trades
          ON trades.id = reputation_events.trade_id
        WHERE reputation_events.event_type = ?
          AND (
            trades.buyer_user_id = ?
            OR trades.seller_user_id = ?
          )
        ORDER BY reputation_events.created_at DESC
        LIMIT 10
      `
    )
    .bind("trade_recorded", userId, userId)
    .all<RecordedTradeEventRow>();

  return result.results ?? [];
}

function mapVerificationSignals(
  identities: IdentitySignalRow[]
): VerificationSignals {
  return {
    emailVerified: hasVerifiedIdentity(identities, "email"),
    phoneVerified: hasVerifiedIdentity(identities, "phone"),
    marketplaceLinked: hasVerifiedIdentity(identities, "marketplace")
  };
}

function hasVerifiedIdentity(
  identities: IdentitySignalRow[],
  identityType: string
): boolean {
  return identities.some(
    (identity) =>
      identity.identity_type === identityType && identity.verified_at !== null
  );
}

function mapRecentActivity(event: ReputationEventRow): RecentActivityItem {
  return {
    label: recentActivityLabels[event.event_type] ?? titleCase(event.event_type),
    date: formatDate(event.created_at)
  };
}

function mapRecordedTradeTimelineEvent(
  event: RecordedTradeEventRow
): ReputationTimelineEvent {
  return {
    date: formatDate(event.created_at),
    eventType: "Trade Recorded",
    summary: "Trade completed with mutual confirmation."
  };
}

function calculateReputationConfidence(
  completedTrades: number
): ReputationConfidence {
  if (completedTrades >= 50) {
    return "High";
  }

  if (completedTrades >= 10) {
    return "Medium";
  }

  return "Low";
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function titleCase(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}
