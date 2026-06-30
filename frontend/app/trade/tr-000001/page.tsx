import Link from "next/link";

const tradeRecord = {
  tradeId: "TR-000001",
  status: "Awaiting Seller Confirmation",
  tradeDate: "2026-06-21",
  marketplace: "Facebook Marketplace",
  category: "Mobile Phone",
  itemTitle: "iPhone 14",
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
  confirmations: [
    {
      role: "Buyer",
      displayName: "Jasper H.",
      state: "Confirmed" as const,
      confirmedAt: "2026-06-21 15:32",
      confirmedAtDateTime: "2026-06-21T15:32:00"
    },
    {
      role: "Seller",
      displayName: "Mina R.",
      state: "Pending" as const,
      confirmedAt: null,
      confirmedAtDateTime: null
    }
  ],
  timeline: [
    {
      dateTime: "2026-06-21T09:10:00",
      displayTime: "2026-06-21 09:10",
      eventType: "Trade Created",
      description: "Trade record opened from an external marketplace listing."
    },
    {
      dateTime: "2026-06-21T09:22:00",
      displayTime: "2026-06-21 09:22",
      eventType: "Buyer Accepted",
      description: "Buyer agreed to use TrustLayer for this trade record."
    },
    {
      dateTime: "2026-06-21T10:05:00",
      displayTime: "2026-06-21 10:05",
      eventType: "Meeting Scheduled",
      description: "Participants recorded a meeting window without public address details."
    },
    {
      dateTime: "2026-06-21T15:30:00",
      displayTime: "2026-06-21 15:30",
      eventType: "Exchange Noted",
      description: "A participant recorded that the exchange was ready for confirmation."
    },
    {
      dateTime: "2026-06-21T15:32:00",
      displayTime: "2026-06-21 15:32",
      eventType: "Buyer Confirmed",
      description: "Buyer confirmation was recorded as a historical event."
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

type ConfirmationState = "Pending" | "Confirmed" | "Declined";

type Confirmation = {
  role: string;
  displayName: string;
  state: ConfirmationState;
  confirmedAt: string | null;
  confirmedAtDateTime: string | null;
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

function TradeConfirmation({
  confirmations
}: {
  confirmations: Confirmation[];
}) {
  const hasMutualConfirmation = confirmations.every(
    (confirmation) => confirmation.state === "Confirmed"
  );
  const currentState = hasMutualConfirmation
    ? "Mutual confirmation recorded"
    : "Waiting for mutual confirmation";

  return (
    <section className="profile-section" aria-labelledby="trade-confirmation">
      <h2 id="trade-confirmation">Trade Confirmation</h2>
      <div className="confirmation-summary">
        <dt>Current confirmation state</dt>
        <dd>{currentState}</dd>
      </div>
      <div className="confirmation-grid">
        {confirmations.map((confirmation) => (
          <article className="confirmation-card" key={confirmation.role}>
            <p>{confirmation.role}</p>
            <h3>{confirmation.displayName}</h3>
            <span className={`confirmation-state ${confirmation.state.toLowerCase()}`}>
              {confirmation.state}
            </span>
            {confirmation.confirmedAt ? (
              <time dateTime={confirmation.confirmedAtDateTime ?? undefined}>
                {confirmation.confirmedAt}
              </time>
            ) : (
              <span className="confirmation-time">No confirmation recorded</span>
            )}
          </article>
        ))}
      </div>
      <p className="confirmation-note">
        TrustLayer records participant confirmations as historical events. A
        completed Trade Record requires both participants to confirm. TrustLayer
        records confirmations without judging whether the real-world trade
        occurred exactly as described.
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
      <TradeConfirmation confirmations={tradeRecord.confirmations} />
      <TradeTimeline events={tradeRecord.timeline} />
      <AttachedEvidence />
      <TrustLayerNotes />
    </main>
  );
}
