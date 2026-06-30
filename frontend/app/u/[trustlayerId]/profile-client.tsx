"use client";

import { useEffect, useState } from "react";

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

type ReputationProfileResponse =
  | {
      success: true;
      data: ReputationProfileData;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

type LabelValue = {
  label: string;
  value: string;
};

function formatTrustLayerId(trustlayerId: string) {
  return trustlayerId.toUpperCase();
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDomain(domain: ReputationProfileData["reputationDomain"]) {
  return domain === "trading" ? "Trading Reputation" : domain;
}

function getAvatarInitials(displayName: string) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTrustSummary(profile: ReputationProfileData): LabelValue[] {
  return [
    {
      label: "Completed Trades",
      value: profile.stats.completedTrades.toString()
    },
    {
      label: "Mutual Confirmation Rate",
      value: formatPercent(profile.stats.confirmationRate)
    },
    {
      label: "Dispute Count",
      value: profile.stats.disputeCount.toString()
    },
    {
      label: "Reputation Confidence",
      value: profile.stats.reputationConfidence
    }
  ];
}

function getTradingHistory(profile: ReputationProfileData): LabelValue[] {
  return [
    {
      label: "Total Trades",
      value: profile.stats.totalTrades.toString()
    },
    {
      label: "Completed Trades",
      value: profile.stats.completedTrades.toString()
    },
    {
      label: "Mutual Confirmation Rate",
      value: formatPercent(profile.stats.confirmationRate)
    },
    {
      label: "Disputes",
      value: profile.stats.disputeCount.toString()
    }
  ];
}

function getVerificationSignals(verification: VerificationSignals) {
  const signals = [
    {
      isVisible: verification.emailVerified,
      label: "Email verified"
    },
    {
      isVisible: verification.phoneVerified,
      label: "Phone verified"
    },
    {
      isVisible: verification.marketplaceLinked,
      label: "Marketplace account linked"
    }
  ];

  return signals.filter((signal) => signal.isVisible).map((signal) => signal.label);
}

function getRecentActivity(items: RecentActivityItem[]): LabelValue[] {
  return items.map((item) => ({
    label: item.label,
    value: item.date
  }));
}

function ProfileHeader({ profile }: { profile: ReputationProfileData }) {
  return (
    <section className="profile-header" aria-labelledby="profile-heading">
      <div className="avatar" aria-hidden="true">
        {getAvatarInitials(profile.displayName)}
      </div>
      <div>
        <p className="eyebrow">Reputation Profile</p>
        <h1 id="profile-heading">{profile.displayName}</h1>
        <p className="profile-domain">{formatDomain(profile.reputationDomain)}</p>
        <dl className="profile-details">
          <div>
            <dt>TrustLayer ID</dt>
            <dd>{formatTrustLayerId(profile.trustlayerId)}</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{profile.memberSince}</dd>
          </div>
          <div>
            <dt>Profile</dt>
            <dd>{profile.publicProfileUrl}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function MetricGrid({
  headingId,
  heading,
  items
}: {
  headingId: string;
  heading: string;
  items: LabelValue[];
}) {
  return (
    <section className="profile-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{heading}</h2>
      <div className="metric-grid">
        {items.map((item) => (
          <div className="metric-card" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </div>
    </section>
  );
}

function VerificationSignals({ signals }: { signals: string[] }) {
  return (
    <section
      className="profile-section"
      aria-labelledby="verification-signals"
    >
      <h2 id="verification-signals">Verification Signals</h2>
      <ul className="signal-list">
        {signals.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>
    </section>
  );
}

function EventTimeline({ events }: { events: ReputationTimelineEvent[] }) {
  return (
    <section className="profile-section" aria-labelledby="reputation-events">
      <h2 id="reputation-events">Reputation Events</h2>
      <ol className="timeline">
        {events.map((event) => (
          <li key={`${event.date}-${event.eventType}`}>
            <time dateTime={event.date}>{event.date}</time>
            <h3>{event.eventType}</h3>
            <p>{event.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TrustLayerNote({ note }: { note: string }) {
  return (
    <section className="notes-section" aria-labelledby="profile-note">
      <h2 id="profile-note">TrustLayer Notes</h2>
      <p>{note}</p>
    </section>
  );
}

export function ReputationProfileClient({
  trustlayerId
}: {
  trustlayerId: string;
}) {
  const [profile, setProfile] = useState<ReputationProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const response = await fetch(`/api/users/${trustlayerId}/profile`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load Reputation Profile.");
        }

        const result = (await response.json()) as ReputationProfileResponse;

        if (!result.success) {
          throw new Error("Unable to load Reputation Profile.");
        }

        setProfile(result.data);
        setErrorMessage(null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setErrorMessage("Unable to load Reputation Profile.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => controller.abort();
  }, [trustlayerId]);

  if (isLoading) {
    return (
      <main className="profile-page">
        <section className="notes-section" aria-live="polite">
          <h1>Loading Reputation Profile...</h1>
        </section>
      </main>
    );
  }

  if (errorMessage || !profile) {
    return (
      <main className="profile-page">
        <section className="notes-section" aria-live="polite">
          <h1>Unable to load Reputation Profile.</h1>
          <p>
            TrustLayer presents historical reputation events and does not make
            trust decisions for users.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <ProfileHeader profile={profile} />
      <MetricGrid
        headingId="trust-summary"
        heading="Trust Summary"
        items={getTrustSummary(profile)}
      />
      <MetricGrid
        headingId="trading-history"
        heading="Trading History"
        items={getTradingHistory(profile)}
      />
      <VerificationSignals signals={getVerificationSignals(profile.verification)} />
      <MetricGrid
        headingId="recent-activity"
        heading="Recent Activity"
        items={getRecentActivity(profile.recentActivity)}
      />
      <EventTimeline events={profile.eventTimeline} />
      <TrustLayerNote note={profile.note} />
    </main>
  );
}
