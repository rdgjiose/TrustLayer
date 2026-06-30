type ReputationProfileStats = {
  completedTrades: number;
  totalTrades: number;
  confirmationRate: number;
  disputeCount: number;
  reputationConfidence: "Low" | "Medium" | "High";
};

type VerificationSignals = {
  emailVerified: boolean;
  phoneVerified: boolean;
  marketplaceLinked: boolean;
};

type RecentActivityItem = {
  label: string;
  date: string;
};

type ReputationTimelineEvent = {
  date: string;
  eventType: string;
  summary: string;
};

type ReputationProfileData = {
  trustlayerId: string;
  displayName: string;
  memberSince: string;
  reputationDomain: "trading";
  publicProfileUrl: string;
  stats: ReputationProfileStats;
  verification: VerificationSignals;
  recentActivity: RecentActivityItem[];
  eventTimeline: ReputationTimelineEvent[];
  note: string;
};

type ReputationProfileResponse = {
  success: true;
  data: ReputationProfileData;
};

export const mockReputationProfile: ReputationProfileResponse = {
  success: true,
  data: {
    trustlayerId: "tl-9f32a",
    displayName: "Jasper H.",
    memberSince: "2026-06-28",
    reputationDomain: "trading",
    publicProfileUrl: "/u/tl-9f32a",
    stats: {
      completedTrades: 126,
      totalTrades: 132,
      confirmationRate: 0.98,
      disputeCount: 2,
      reputationConfidence: "High"
    },
    verification: {
      emailVerified: true,
      phoneVerified: true,
      marketplaceLinked: true
    },
    recentActivity: [
      {
        label: "Trade completed",
        date: "2026-06-20"
      },
      {
        label: "Trade cancelled",
        date: "2026-06-18"
      },
      {
        label: "Dispute resolved",
        date: "2026-06-12"
      }
    ],
    eventTimeline: [
      {
        date: "2026-06-20",
        eventType: "Trade Completed",
        summary: "Trade completed with mutual confirmation."
      },
      {
        date: "2026-06-18",
        eventType: "Trade Cancelled",
        summary: "Trade cancelled before mutual confirmation."
      },
      {
        date: "2026-06-12",
        eventType: "Dispute Resolved",
        summary: "Issue record closed with both parties updated."
      }
    ],
    note: "TrustLayer presents historical reputation events. It does not make trust decisions for users."
  }
};
