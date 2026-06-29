const reputationProfile = {
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
};

type LabelValue = {
  label: string;
  value: string;
};

type ReputationEvent = {
  date: string;
  eventType: string;
  description: string;
};

function ProfileHeader() {
  return (
    <section className="profile-header" aria-labelledby="profile-heading">
      <div className="avatar" aria-hidden="true">
        {reputationProfile.avatarInitials}
      </div>
      <div>
        <p className="eyebrow">Reputation Profile</p>
        <h1 id="profile-heading">{reputationProfile.displayName}</h1>
        <p className="profile-domain">{reputationProfile.reputationDomain}</p>
        <dl className="profile-details">
          <div>
            <dt>TrustLayer ID</dt>
            <dd>{reputationProfile.trustlayerId}</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{reputationProfile.memberSince}</dd>
          </div>
          <div>
            <dt>Profile</dt>
            <dd>{reputationProfile.profileLink}</dd>
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

function VerificationSignals() {
  return (
    <section
      className="profile-section"
      aria-labelledby="verification-signals"
    >
      <h2 id="verification-signals">Verification Signals</h2>
      <ul className="signal-list">
        {reputationProfile.verification.map((signal) => (
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

export default function ReputationProfilePage() {
  return (
    <main className="profile-page">
      <ProfileHeader />
      <MetricGrid
        headingId="trust-summary"
        heading="Trust Summary"
        items={reputationProfile.summary}
      />
      <MetricGrid
        headingId="trading-history"
        heading="Trading History"
        items={reputationProfile.statistics}
      />
      <VerificationSignals />
      <MetricGrid
        headingId="recent-activity"
        heading="Recent Activity"
        items={reputationProfile.recentActivity}
      />
      <EventTimeline events={reputationProfile.timeline} />
    </main>
  );
}
