import type {
  RecentActivityItem,
  ReputationProfileData,
  ReputationTimelineEvent,
  VerificationSignals
} from "../../../shared/types/reputation-profile";

type ReputationConfidence = "Low" | "Medium" | "High";

type ProfileRow = {
  user_id: string;
  trustlayer_id: string;
  display_name: string;
  created_at: string;
  completed_trades: number | null;
  total_trades: number | null;
  disputed_trades: number | null;
  confirmation_rate: number | null;
  reputation_confidence: string | null;
};

type IdentitySignalRow = {
  identity_type: string;
  verified_at: string | null;
};

type ReputationEventRow = {
  event_type: string;
  event_payload_json: string | null;
  created_at: string;
};

type EventPayload = {
  summary?: string;
};

const eventTimelineLabels: Record<string, string> = {
  issue_resolved: "Dispute Resolved",
  trade_cancelled: "Trade Cancelled",
  trade_completed: "Trade Completed"
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
          users.created_at,
          reputation_stats.completed_trades,
          reputation_stats.total_trades,
          reputation_stats.disputed_trades,
          reputation_stats.confirmation_rate,
          reputation_stats.reputation_confidence
        FROM users
        LEFT JOIN reputation_stats
          ON reputation_stats.user_id = users.id
        WHERE users.trustlayer_id = ?
        LIMIT 1
      `
    )
    .bind(trustlayerId)
    .first<ProfileRow>();

  if (!profile) {
    return null;
  }

  const [identitySignals, events] = await Promise.all([
    getIdentitySignals(db, profile.user_id),
    getProfileEvents(db, profile.user_id)
  ]);

  return {
    trustlayerId: profile.trustlayer_id,
    displayName: profile.display_name,
    memberSince: formatDate(profile.created_at),
    reputationDomain: "trading",
    publicProfileUrl: `/u/${profile.trustlayer_id}`,
    stats: {
      completedTrades: profile.completed_trades ?? 0,
      totalTrades: profile.total_trades ?? 0,
      confirmationRate: profile.confirmation_rate ?? 0,
      disputeCount: profile.disputed_trades ?? 0,
      reputationConfidence: mapReputationConfidence(
        profile.reputation_confidence
      )
    },
    verification: mapVerificationSignals(identitySignals),
    recentActivity: events.map(mapRecentActivity),
    eventTimeline: events.map(mapTimelineEvent),
    note: "TrustLayer presents historical reputation events. It does not make trust decisions for users."
  };
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
          event_payload_json,
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

function mapTimelineEvent(event: ReputationEventRow): ReputationTimelineEvent {
  const payload = parseEventPayload(event.event_payload_json);

  return {
    date: formatDate(event.created_at),
    eventType: eventTimelineLabels[event.event_type] ?? titleCase(event.event_type),
    summary: payload.summary ?? "Reputation history event recorded by TrustLayer."
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

function mapReputationConfidence(
  value: string | null
): ReputationConfidence {
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
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
