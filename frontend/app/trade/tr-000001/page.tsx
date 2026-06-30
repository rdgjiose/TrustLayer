"use client";

import { useState } from "react";
import Link from "next/link";
import {
  defaultTradeLifecycleStateId,
  tradeLifecycleStates,
  type Confirmation,
  type Invitation,
  type TimelineEvent,
  type TradeLifecycleStateId
} from "../../../lib/trade-lifecycle";

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

function TradeStateSwitcher({
  selectedStateId,
  onSelectState
}: {
  selectedStateId: TradeLifecycleStateId;
  onSelectState: (stateId: TradeLifecycleStateId) => void;
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
    useState<TradeLifecycleStateId>(defaultTradeLifecycleStateId);
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
