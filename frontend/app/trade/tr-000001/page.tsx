"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  tradeLifecycleStates,
  type Confirmation,
  type Invitation,
  type TimelineEvent,
  type TradeLifecycleState,
  type TradeLifecycleStateId
} from "../../../lib/trade-lifecycle";

type TradeRecordApiData = {
  tradeId: string;
  tradeCode: string;
  item: {
    title: string;
    summary: string;
    marketplace: string;
    source: string;
  };
  participants: {
    buyer: {
      name: string;
      trustlayerId: string;
    };
    seller: {
      name: string;
      trustlayerId: string;
    };
  };
  currentState: TradeLifecycleStateId;
  availableStates: TradeLifecycleStateId[];
  lifecycle: {
    tradeStatus: string;
    invitation: Invitation;
    confirmation: Confirmation;
    timeline: TimelineEvent[];
    note: string;
  };
};

type TradeRecordApiResponse = {
  success: boolean;
  data?: TradeRecordApiData;
};

const evidenceReferences = [
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
];

function createApiLifecycleState(
  tradeRecord: TradeRecordApiData
): TradeLifecycleState {
  return {
    id: tradeRecord.currentState,
    label:
      tradeLifecycleStates.find((state) => state.id === tradeRecord.currentState)
        ?.label ?? tradeRecord.lifecycle.tradeStatus,
    status: tradeRecord.lifecycle.tradeStatus,
    invitation: tradeRecord.lifecycle.invitation,
    confirmation: tradeRecord.lifecycle.confirmation,
    timeline: tradeRecord.lifecycle.timeline,
    note: tradeRecord.lifecycle.note
  };
}

function formatTrustLayerId(trustlayerId: string) {
  return trustlayerId.toUpperCase();
}

function TradeStateSwitcher({
  selectedStateId,
  availableStates,
  onSelectState
}: {
  selectedStateId: TradeLifecycleStateId;
  availableStates: TradeLifecycleStateId[];
  onSelectState: (stateId: TradeLifecycleStateId) => void;
}) {
  const states = tradeLifecycleStates.filter((state) =>
    availableStates.includes(state.id)
  );

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
        {states.map((state) => (
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

function TradeSummary({
  tradeRecord,
  status
}: {
  tradeRecord: TradeRecordApiData;
  status: string;
}) {
  const summaryItems = [
    {
      label: "Trade ID",
      value: tradeRecord.tradeId
    },
    {
      label: "Trade Code",
      value: tradeRecord.tradeCode.toUpperCase()
    },
    {
      label: "Trade Status",
      value: status
    },
    {
      label: "Marketplace",
      value: tradeRecord.item.marketplace
    }
  ];

  return (
    <section className="trade-header" aria-labelledby="trade-heading">
      <p className="eyebrow">Trade Record</p>
      <h1 id="trade-heading">{tradeRecord.item.title}</h1>
      <p className="confirmation-note">{tradeRecord.item.summary}</p>
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

function Participants({
  participants
}: {
  participants: TradeRecordApiData["participants"];
}) {
  const participantList = [
    {
      role: "Buyer",
      displayName: participants.buyer.name,
      trustlayerId: participants.buyer.trustlayerId,
      profileHref: `/u/${participants.buyer.trustlayerId.toLowerCase()}`
    },
    {
      role: "Seller",
      displayName: participants.seller.name,
      trustlayerId: participants.seller.trustlayerId,
      profileHref: `/u/${participants.seller.trustlayerId.toLowerCase()}`
    }
  ];

  return (
    <section className="profile-section" aria-labelledby="participants">
      <h2 id="participants">Participants</h2>
      <div className="participant-grid">
        {participantList.map((participant) => (
          <article className="participant-card" key={participant.role}>
            <p>{participant.role}</p>
            <h3>{participant.displayName}</h3>
            <span>{formatTrustLayerId(participant.trustlayerId)}</span>
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
        {evidenceReferences.map((item) => (
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
  const [tradeRecord, setTradeRecord] = useState<TradeRecordApiData | null>(
    null
  );
  const [selectedStateId, setSelectedStateId] =
    useState<TradeLifecycleStateId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTradeRecord() {
      try {
        const response = await fetch("/api/trades/tr-000001", {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load Trade Record.");
        }

        const result = (await response.json()) as TradeRecordApiResponse;

        if (!result.success || !result.data) {
          throw new Error("Unable to load Trade Record.");
        }

        setTradeRecord(result.data);
        setSelectedStateId(result.data.currentState);
        setErrorMessage(null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setErrorMessage("Unable to load Trade Record.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTradeRecord();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <main className="profile-page trade-page">
        <section className="notes-section" aria-live="polite">
          <h1>Loading Trade Record...</h1>
        </section>
      </main>
    );
  }

  if (errorMessage || !tradeRecord || !selectedStateId) {
    return (
      <main className="profile-page trade-page">
        <section className="notes-section" aria-live="polite">
          <h1>Unable to load Trade Record.</h1>
          <p>
            TrustLayer records history without judging participants. Please try
            again later.
          </p>
        </section>
      </main>
    );
  }

  const apiLifecycleState = createApiLifecycleState(tradeRecord);
  const selectedState =
    selectedStateId === tradeRecord.currentState
      ? apiLifecycleState
      : tradeLifecycleStates.find((state) => state.id === selectedStateId) ??
        apiLifecycleState;

  return (
    <main className="profile-page trade-page">
      <TradeStateSwitcher
        selectedStateId={selectedState.id}
        availableStates={tradeRecord.availableStates}
        onSelectState={setSelectedStateId}
      />
      <TradeSummary tradeRecord={tradeRecord} status={selectedState.status} />
      <Participants participants={tradeRecord.participants} />
      <TradeInvitation invitation={selectedState.invitation} />
      <TradeConfirmation confirmation={selectedState.confirmation} />
      <TradeTimeline events={selectedState.timeline} />
      <AttachedEvidence />
      <TrustLayerNotes note={selectedState.note} />
    </main>
  );
}
