"use client";

import { useState } from "react";
import Link from "next/link";

const baseTradeRecord = {
  tradeId: "TR-000001",
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

const baseInvitation = {
  invitedRole: "Seller",
  invitedParticipant: "Mina R.",
  link: "/trade/tr-000001",
  createdBy: "Jasper H."
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
  state: "Pending" | "Accepted" | "Closed";
  link: string;
  createdBy: string;
};

type ConfirmationState = "Pending" | "Confirmed" | "Not Applicable";

type ConfirmationParticipant = {
  role: "Buyer" | "Seller";
  state: ConfirmationState;
  timestamp?: string;
};

type Confirmation = {
  currentState: string;
  participants: ConfirmationParticipant[];
  note: string;
  isUnavailable?: boolean;
};

type TradeLifecycleState = {
  id:
    | "awaiting-seller-acceptance"
    | "accepted"
    | "awaiting-seller-confirmation"
    | "mutually-confirmed"
    | "recorded"
    | "cancelled";
  label: string;
  status: string;
  invitation: Invitation;
  confirmation: Confirmation;
  timeline: TimelineEvent[];
  note: string;
};

const timelineEvents = {
  tradeCreated: {
    dateTime: "2026-06-21T09:10:00",
    displayTime: "2026-06-21 09:10",
    eventType: "Trade Created",
    description: "Trade Record opened from an external marketplace listing."
  },
  invitationSent: {
    dateTime: "2026-06-21T09:12:00",
    displayTime: "2026-06-21 09:12",
    eventType: "Invitation Sent",
    description: "Seller was invited to join this Trade Record."
  },
  waitingForAcceptance: {
    dateTime: "2026-06-21T09:13:00",
    displayTime: "2026-06-21 09:13",
    eventType: "Waiting for Seller Acceptance",
    description: "Confirmation is unavailable until the invited seller accepts."
  },
  sellerAccepted: {
    dateTime: "2026-06-21T10:04:00",
    displayTime: "2026-06-21 10:04",
    eventType: "Seller Accepted",
    description: "Seller accepted the invitation as a Participant Acceptance event."
  },
  exchangeNoted: {
    dateTime: "2026-06-21T15:24:00",
    displayTime: "2026-06-21 15:24",
    eventType: "Exchange Noted",
    description: "The participants noted that the exchange stage had been reached."
  },
  buyerConfirmed: {
    dateTime: "2026-06-21T15:32:00",
    displayTime: "2026-06-21 15:32",
    eventType: "Buyer Confirmed",
    description: "Buyer recorded a Confirmation Event for this Trade Record."
  },
  sellerConfirmed: {
    dateTime: "2026-06-21T15:36:00",
    displayTime: "2026-06-21 15:36",
    eventType: "Seller Confirmed",
    description: "Seller recorded a Confirmation Event for this Trade Record."
  },
  tradeRecorded: {
    dateTime: "2026-06-21T15:37:00",
    displayTime: "2026-06-21 15:37",
    eventType: "Trade Recorded",
    description: "The mutually confirmed Trade Record was recorded into Trading History."
  },
  tradeCancelled: {
    dateTime: "2026-06-21T11:20:00",
    displayTime: "2026-06-21 11:20",
    eventType: "Trade Cancelled",
    description: "Cancellation was recorded as a Historical Event without assigning fault."
  }
} satisfies Record<string, TimelineEvent>;

const tradeLifecycleStates: TradeLifecycleState[] = [
  {
    id: "awaiting-seller-acceptance",
    label: "Awaiting Seller Acceptance",
    status: "Awaiting Seller Acceptance",
    invitation: {
      ...baseInvitation,
      state: "Pending"
    },
    confirmation: {
      currentState: "Unavailable until Participant Acceptance",
      isUnavailable: true,
      participants: [],
      note: "No trade confirmation can happen until both participants have joined this Trade Record."
    },
    timeline: [
      timelineEvents.tradeCreated,
      timelineEvents.invitationSent,
      timelineEvents.waitingForAcceptance
    ],
    note: "This mock state shows the Trade Lifecycle before the invited participant has accepted."
  },
  {
    id: "accepted",
    label: "Accepted",
    status: "Accepted",
    invitation: {
      ...baseInvitation,
      state: "Accepted"
    },
    confirmation: {
      currentState: "Waiting for Exchange or Completion",
      participants: [
        { role: "Buyer", state: "Pending" },
        { role: "Seller", state: "Pending" }
      ],
      note: "Both participants have joined. Confirmation Events are still pending until the exchange is complete."
    },
    timeline: [
      timelineEvents.tradeCreated,
      timelineEvents.invitationSent,
      timelineEvents.sellerAccepted
    ],
    note: "This mock state shows Participant Acceptance before any completion confirmation."
  },
  {
    id: "awaiting-seller-confirmation",
    label: "Awaiting Seller Confirmation",
    status: "Awaiting Seller Confirmation",
    invitation: {
      ...baseInvitation,
      state: "Accepted"
    },
    confirmation: {
      currentState: "Awaiting Seller Confirmation",
      participants: [
        {
          role: "Buyer",
          state: "Confirmed",
          timestamp: "2026-06-21 15:32"
        },
        { role: "Seller", state: "Pending" }
      ],
      note: "The buyer has recorded a Confirmation Event. The Trade Record is not mutually confirmed until the seller also confirms."
    },
    timeline: [
      timelineEvents.tradeCreated,
      timelineEvents.invitationSent,
      timelineEvents.sellerAccepted,
      timelineEvents.exchangeNoted,
      timelineEvents.buyerConfirmed
    ],
    note: "This mock state shows a single Confirmation Event without treating the trade as fully recorded."
  },
  {
    id: "mutually-confirmed",
    label: "Mutually Confirmed",
    status: "Mutually Confirmed",
    invitation: {
      ...baseInvitation,
      state: "Accepted"
    },
    confirmation: {
      currentState: "Mutually Confirmed",
      participants: [
        {
          role: "Buyer",
          state: "Confirmed",
          timestamp: "2026-06-21 15:32"
        },
        {
          role: "Seller",
          state: "Confirmed",
          timestamp: "2026-06-21 15:36"
        }
      ],
      note: "Both participants have recorded Confirmation Events. The Trade Record may now become part of Trading History."
    },
    timeline: [
      timelineEvents.tradeCreated,
      timelineEvents.invitationSent,
      timelineEvents.sellerAccepted,
      timelineEvents.exchangeNoted,
      timelineEvents.buyerConfirmed,
      timelineEvents.sellerConfirmed
    ],
    note: "This mock state shows mutual confirmation before the recorded Trading History event."
  },
  {
    id: "recorded",
    label: "Recorded",
    status: "Recorded",
    invitation: {
      ...baseInvitation,
      state: "Accepted"
    },
    confirmation: {
      currentState: "Recorded into Trading History",
      participants: [
        {
          role: "Buyer",
          state: "Confirmed",
          timestamp: "2026-06-21 15:32"
        },
        {
          role: "Seller",
          state: "Confirmed",
          timestamp: "2026-06-21 15:36"
        }
      ],
      note: "Both confirmations exist, and the Trade Record has been recorded as Trading History."
    },
    timeline: [
      timelineEvents.tradeCreated,
      timelineEvents.invitationSent,
      timelineEvents.sellerAccepted,
      timelineEvents.exchangeNoted,
      timelineEvents.buyerConfirmed,
      timelineEvents.sellerConfirmed,
      timelineEvents.tradeRecorded
    ],
    note: "This mock state shows the Trade Record after the final Historical Event has been recorded."
  },
  {
    id: "cancelled",
    label: "Cancelled",
    status: "Cancelled",
    invitation: {
      ...baseInvitation,
      state: "Closed"
    },
    confirmation: {
      currentState: "Not Applicable",
      isUnavailable: true,
      participants: [
        { role: "Buyer", state: "Not Applicable" },
        { role: "Seller", state: "Not Applicable" }
      ],
      note: "This Trade Record was cancelled before completion. Cancellation is recorded as history and does not assign fault."
    },
    timeline: [
      timelineEvents.tradeCreated,
      timelineEvents.invitationSent,
      timelineEvents.tradeCancelled
    ],
    note: "This mock state shows cancellation as a Historical Event without blame or judgement language."
  }
];

function TradeStateSwitcher({
  selectedStateId,
  onSelectState
}: {
  selectedStateId: TradeLifecycleState["id"];
  onSelectState: (stateId: TradeLifecycleState["id"]) => void;
}) {
  return (
    <section className="prototype-switcher" aria-labelledby="state-switcher">
      <div>
        <p className="eyebrow">Prototype State Switcher</p>
        <h2 id="state-switcher">Mock Trade Lifecycle</h2>
        <p>
          This control exists only for MVP demonstration before real API data is
          available. The selected lifecycle state is static mock data and is not
          persisted.
        </p>
      </div>
      <div className="state-switcher-options" role="group" aria-label="Mock Trade Lifecycle states">
        {tradeLifecycleStates.map((state) => (
          <button
            aria-pressed={state.id === selectedStateId}
            className={state.id === selectedStateId ? "active" : undefined}
            key={state.id}
            onClick={() => onSelectState(state.id)}
            type="button"
          >
            {state.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function TradeSummary({ status }: { status: string }) {
  const summaryItems = [
    {
      label: "Trade ID",
      value: baseTradeRecord.tradeId
    },
    {
      label: "Trade Status",
      value: status
    },
    {
      label: "Trade Date",
      value: baseTradeRecord.tradeDate
    },
    {
      label: "Marketplace",
      value: baseTradeRecord.marketplace
    },
    {
      label: "Category",
      value: baseTradeRecord.category
    }
  ];

  return (
    <section className="trade-header" aria-labelledby="trade-heading">
      <p className="eyebrow">Trade Record</p>
      <h1 id="trade-heading">{baseTradeRecord.itemTitle}</h1>
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
        {baseTradeRecord.participants.map((participant) => (
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
            <span className={`confirmation-state ${invitation.state.toLowerCase()}`}>
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
        TrustLayer records invitation and Participant Acceptance as Historical
        Events in the Trade Lifecycle. This section is mock data for the
        prototype preview.
      </p>
    </section>
  );
}

function TradeConfirmation({ confirmation }: { confirmation: Confirmation }) {
  return (
    <section className="profile-section" aria-labelledby="trade-confirmation">
      <h2 id="trade-confirmation">Trade Confirmation</h2>
      <div
        className={`confirmation-summary ${
          confirmation.isUnavailable ? "unavailable" : ""
        }`}
      >
        <dt>Current confirmation state</dt>
        <dd>{confirmation.currentState}</dd>
      </div>
      {confirmation.participants.length > 0 ? (
        <div className="confirmation-grid">
          {confirmation.participants.map((participant) => (
            <article className="confirmation-card" key={participant.role}>
              <p>{participant.role} Confirmation</p>
              <h3>
                <span
                  className={`confirmation-state ${participant.state
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {participant.state}
                </span>
              </h3>
              {participant.timestamp ? (
                <time dateTime={participant.timestamp}>
                  {participant.timestamp}
                </time>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
      <p className="confirmation-note">
        {confirmation.note} TrustLayer records actions without judging either
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
        {baseTradeRecord.evidence.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TrustLayerNotes({ note }: { note: string }) {
  return (
    <section className="notes-section" aria-labelledby="trustlayer-notes">
      <h2 id="trustlayer-notes">TrustLayer Notes</h2>
      <p>
        {note} This page records historical events only. TrustLayer does not
        determine who is right or wrong. Users should interpret the historical
        record themselves.
      </p>
    </section>
  );
}

export default function TradeRecordPage() {
  const [selectedStateId, setSelectedStateId] =
    useState<TradeLifecycleState["id"]>("awaiting-seller-acceptance");
  const selectedState =
    tradeLifecycleStates.find((state) => state.id === selectedStateId) ??
    tradeLifecycleStates[0];

  return (
    <main className="profile-page trade-page">
      <TradeStateSwitcher
        selectedStateId={selectedState.id}
        onSelectState={setSelectedStateId}
      />
      <TradeSummary status={selectedState.status} />
      <Participants />
      <TradeInvitation invitation={selectedState.invitation} />
      <TradeConfirmation confirmation={selectedState.confirmation} />
      <TradeTimeline events={selectedState.timeline} />
      <AttachedEvidence />
      <TrustLayerNotes note={selectedState.note} />
    </main>
  );
}
