import { notFound } from "next/navigation";

const reputationProfiles = {
  "tl-9f32a": {
    displayName: "Jasper H.",
    trustlayerId: "TL-9F32A",
    memberSince: "2026",
    profileLink: "trustlayer.nz/u/tl-9f32a",
    reputationDomain: "Trading Reputation",
    avatarInitials: "JH",
    summary: [
      {
        label: "Completed Trades",
        value: "126"
      },
      {
        label: "Mutual Confirmation Rate",
        value: "98%"
      },
      {
        label: "Dispute Count",
        value: "2"
      },
      {
        label: "Reputation Confidence",
        value: "High"
      }
    ],
    statistics: [
      {
        label: "Total Trades",
        value: "132"
      },
      {
        label: "Cancelled Trades",
        value: "4"
      },
      {
        label: "Expired Trades",
        value: "2"
      },
      {
        label: "No-show Events",
        value: "0"
      }
    ],
    verification: [
      "Email verified",
      "Phone verified",
      "Marketplace account linked"
    ],
    recentActivity: [
      {
        label: "Trades completed",
        value: "8"
      },
      {
        label: "Disputes",
        value: "0"
      },
      {
        label: "Cancelled trades",
        value: "1"
      }
    ],
    timeline: [
      {
        date: "2026-06-20",
        eventType: "Trade Completed",
        description: "Buyer and seller both confirmed completion."
      },
      {
        date: "2026-06-18",
        eventType: "Trade Cancelled",
        description: "Cancelled before mutual confirmation."
      },
      {
        date: "2026-06-12",
        eventType: "Dispute Resolved",
        description: "Issue record closed with both parties updated."
      }
    ]
  },
  "tl-4m7q2": {
    displayName: "Mina R.",
    trustlayerId: "TL-4M7Q2",
    memberSince: "2026",
    profileLink: "trustlayer.nz/u/tl-4m7q2",
    reputationDomain: "Trading Reputation",
    avatarInitials: "MR",
    summary: [
      {
        label: "Completed Trades",
        value: "41"
      },
      {
        label: "Mutual Confirmation Rate",
        value: "95%"
      },
      {
        label: "Dispute Count",
        value: "1"
      },
      {
        label: "Reputation Confidence",
        value: "Medium"
      }
    ],
    statistics: [
      {
        label: "Total Trades",
        value: "43"
      },
      {
        label: "Cancelled Trades",
        value: "1"
      },
      {
        label: "Expired Trades",
        value: "1"
      },
      {
        label: "No-show Events",
        value: "0"
      }
    ],
    verification: ["Email verified", "Marketplace account linked"],
    recentActivity: [
      {
        label: "Trades completed",
        value: "3"
      },
      {
        label: "Disputes",
        value: "0"
      },
      {
        label: "Cancelled trades",
        value: "0"
      }
    ],
    timeline: [
      {
        date: "2026-06-21",
        eventType: "Trade Completed",
        description: "Buyer and seller both confirmed completion."
      },
      {
        date: "2026-06-14",
        eventType: "Seller Confirmed",
        description: "Seller confirmation was recorded for a completed trade."
      },
      {
        date: "2026-06-08",
        eventType: "Trade Created",
        description: "A new trade record was opened from an external listing."
      }
    ]
  }
};

type TrustLayerId = keyof typeof reputationProfiles;

type LabelValue = {
  label: string;
  value: string;
};

type ReputationEvent = {
  date: string;
  eventType: string;
  description: string;
};

type ReputationProfile = (typeof reputationProfiles)[TrustLayerId];

export function generateStaticParams() {
  return Object.keys(reputationProfiles).map((trustlayerId) => ({
    trustlayerId
  }));
}

function ProfileHeader({ profile }: { profile: ReputationProfile }) {
  return (
    <section className="profile-header" aria-labelledby="profile-heading">
      <div className="avatar" aria-hidden="true">
        {profile.avatarInitials}
      </div>
      <div>
        <p className="eyebrow">Reputation Profile</p>
        <h1 id="profile-heading">{profile.displayName}</h1>
        <p className="profile-domain">{profile.reputationDomain}</p>
        <dl className="profile-details">
          <div>
            <dt>TrustLayer ID</dt>
            <dd>{profile.trustlayerId}</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{profile.memberSince}</dd>
          </div>
          <div>
            <dt>Profile</dt>
            <dd>{profile.profileLink}</dd>
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

function EventTimeline({ events }: { events: ReputationEvent[] }) {
  return (
    <section className="profile-section" aria-labelledby="reputation-events">
      <h2 id="reputation-events">Reputation Events</h2>
      <ol className="timeline">
        {events.map((event) => (
          <li key={`${event.date}-${event.eventType}`}>
            <time dateTime={event.date}>{event.date}</time>
            <h3>{event.eventType}</h3>
            <p>{event.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function ReputationProfilePage({
  params
}: {
  params: Promise<{ trustlayerId: string }>;
}) {
  const { trustlayerId } = await params;
  const profile = reputationProfiles[trustlayerId as TrustLayerId];

  if (!profile) {
    notFound();
  }

  return (
    <main className="profile-page">
      <ProfileHeader profile={profile} />
      <MetricGrid
        headingId="trust-summary"
        heading="Trust Summary"
        items={profile.summary}
      />
      <MetricGrid
        headingId="trading-history"
        heading="Trading History"
        items={profile.statistics}
      />
      <VerificationSignals signals={profile.verification} />
      <MetricGrid
        headingId="recent-activity"
        heading="Recent Activity"
        items={profile.recentActivity}
      />
      <EventTimeline events={profile.timeline} />
    </main>
  );
}
