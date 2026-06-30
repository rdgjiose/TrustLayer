import type {
  ApiErrorResponse,
  ApiSuccessResponse
} from "./trade-record";

export type ReputationStats = {
  completedTrades: number;
  totalTrades: number;
  confirmationRate: number;
  disputeCount: number;
  reputationConfidence: "Low" | "Medium" | "High";
};

export type VerificationSignals = {
  emailVerified: boolean;
  phoneVerified: boolean;
  marketplaceLinked: boolean;
};

export type RecentActivityItem = {
  label: string;
  date: string;
};

export type ReputationTimelineEvent = {
  date: string;
  eventType: string;
  summary: string;
};

export type PublicProfileIdentity = {
  trustlayerId: string;
  displayName: string;
  memberSince: string;
  reputationDomain: "trading";
  publicProfileUrl: string;
};

export type ReputationProfileData = PublicProfileIdentity & {
  stats: ReputationStats;
  verification: VerificationSignals;
  recentActivity: RecentActivityItem[];
  eventTimeline: ReputationTimelineEvent[];
  note: string;
};

export type ReputationProfileResponse =
  | ApiSuccessResponse<ReputationProfileData>
  | ApiErrorResponse;
