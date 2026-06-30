import Link from "next/link";

const tradeRecord = {
  tradeId: "TR-000001",
  status: "Awaiting Seller Acceptance",
  tradeDate: "2026-06-21",
  marketplace: "Facebook Marketplace",
  category: "Mobile Phone",
  itemTitle: "iPhone 14",
  createdBy: {
    role: "Buyer",
    displayName: "Jasper H.",
    trustlayerId: "TL-9F32A"
  },
  participants: [
    {
      role: "Buyer",
      displayName: "Jasper H.",
      trustlayerId: "TL-9F32A",
      profileHref: "/u/tl-9f32a"
    },
    {
      role: "Seller",
      displayName: "Mina R.",
      trustlayerId: "TL-4M7Q2",
      profileHref: "/u/tl-4m7q2"
    }
  ],
  invitation: {
    invitedRole: "Seller",
    invitedParticipant: "Mina R.",
    state: "Pending" as const,
    link: "/trade/tr-000001",
    createdBy: "Jasper H."
  },
  timeline: [
    {
      dateTime: "2026-06-21T09:10:00",
      displayTime: "2026-06-21 09:10",
      eventType: "Trade Created",
      description: "Trade record opened from an external marketplace listing."
    },
    {
      dateTime: "2026-06-21T09:12:00",
      displayTime: "2026-06-21 09:12",
      eventType: "Invitation Sent",
      description: "Seller was invited to join this Trade Record."
    },
    {
      dateTime: "2026-06-21T09:13:00",
      displayTime: "2026-06-21 09:13",
      eventType: "Waiting for Seller Acceptance",
      description: "Confirmation is unavailable until the invited seller accepts."
    }
  ],
  evidence: [
    {
      label: "Marketplace Listing",
      value: "External listing reference available"
    },
    {
      label: "Listing Screenshot",
      value: "Snapshot reference available"
    },
    {
      label: "Trade Description",
      value: "Description snapshot available"
    },
    {
      label: "Timestamp",
      value: "2026-06-21T15:36:00Z"
    },
    {
      label: "Hash ID",
      value: "evh_8f3a91c0"
    }
  ]
};

type TimelineEvent = {
  dateTime: string;
  displayTime: string;
  eventType: string;
  description: string;
};

type Invitation = {
  invitedRole: string;
  invitedParticipant: string;
  state: "Pending" | "Accepted";
  link: string;
  createdBy: string;
};

function TradeSummary() {
  const summaryItems = [
    {
      label: "Trade ID",
      value: tradeRecord.tradeId
    },
    {
      label: "Trade Status",
      value: tradeRecord.status
    },
    {
      label: "Trade Date",
      value: tradeRecord.tradeDate
    },
    {
      label: "Marketplace",
      value: tradeRecord.marketplace
    },
    {
      label: "Category",
      value: tradeRecord.category
    }
  ];

  return (
    <section className="trade-header" aria-labelledby="trade-heading">
      <p className="eyebrow">Trade Record</p>
      <h1 id="trade-heading">{tradeRecord.itemTitle}</h1>
      <dl className="trade-summary-grid">
        {summaryItems.map((item) => (
          <div className="metric-card" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Participants() {
  return (
    <section className="profile-section" aria-labelledby="participants">
      <h2 id="participants">Participants</h2>
      <div className="participant-grid">
        {tradeRecord.participants.map((participant) => (
          <article className="participant-card" key={participant.role}>
            <p>{participant.role}</p>
            <h3>{participant.displayName}</h3>
            <span>{participant.trustlayerId}</span>
            <Link href={participant.profileHref}>Open Reputation Profile</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function TradeInvitation({
  invitation
}: {
  invitation: Invitation;
}) {
  return (
    <section className="profile-section" aria-labelledby="trade-invitation">
      <h2 id="trade-invitation">Trade Invitation</h2>
      <dl className="invitation-grid">
        <div>
          <dt>Created by</dt>
          <dd>{invitation.createdBy}</dd>
        </div>
        <div>
          <dt>Invited Role</dt>
          <dd>{invitation.invitedRole}</dd>
        </div>
        <div>
          <dt>Invitation State</dt>
          <dd>
            <span className="confirmation-state pending">
              {invitation.state}
            </span>
          </dd>
        </div>
        <div>
          <dt>Invitation Link</dt>
          <dd>{invitation.link}</dd>
        </div>
      </dl>
      <p className="confirmation-note">
        This Trade Record has been created, but the invited participant has not
        accepted yet. TrustLayer records invitation and Participant Acceptance as
        Historical Events in the Trade Lifecycle.
      </p>
    </section>
  );
}

function TradeConfirmationUnavailable() {
  return (
    <section className="profile-section" aria-labelledby="trade-confirmation">
      <h2 id="trade-confirmation">Trade Confirmation</h2>
      <div className="confirmation-summary unavailable">
        <dt>Current confirmation state</dt>
        <dd>Unavailable until Participant Acceptance</dd>
      </div>
      <p className="confirmation-note">
        No trade confirmation can happen until both participants have joined
        this Trade Record. TrustLayer records actions without judging either
        participant.
      </p>
    </section>
  );
}

function TradeTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <section className="profile-section" aria-labelledby="trade-timeline">
      <h2 id="trade-timeline">Timeline</h2>
      <ol className="timeline trade-timeline">
        {events.map((event) => (
          <li key={`${event.dateTime}-${event.eventType}`}>
            <time dateTime={event.dateTime}>{event.displayTime}</time>
            <h3>{event.eventType}</h3>
            <p>{event.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AttachedEvidence() {
  return (
    <section className="profile-section" aria-labelledby="attached-evidence">
      <h2 id="attached-evidence">Attached Evidence</h2>
      <dl className="evidence-list">
        {tradeRecord.evidence.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TrustLayerNotes() {
  return (
    <section className="notes-section" aria-labelledby="trustlayer-notes">
      <h2 id="trustlayer-notes">TrustLayer Notes</h2>
      <p>
        This page records historical events only. TrustLayer does not determine
        who is right or wrong. Users should interpret the historical record
        themselves.
      </p>
    </section>
  );
}

export default function TradeRecordPage() {
  return (
    <main className="profile-page trade-page">
      <TradeSummary />
      <Participants />
      <TradeInvitation invitation={tradeRecord.invitation} />
      <TradeConfirmationUnavailable />
      <TradeTimeline events={tradeRecord.timeline} />
      <AttachedEvidence />
      <TrustLayerNotes />
    </main>
  );
}
