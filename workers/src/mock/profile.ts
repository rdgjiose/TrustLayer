import type { ApiSuccessResponse } from "../../../shared/types/trade-record";
import type { ReputationProfileData } from "../../../shared/types/reputation-profile";

export const mockReputationProfile: ApiSuccessResponse<ReputationProfileData> = {
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
