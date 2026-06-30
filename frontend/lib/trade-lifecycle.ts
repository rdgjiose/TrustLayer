export type TimelineEvent = {
  dateTime: string;
  displayTime: string;
  eventType: string;
  description: string;
};

export type Invitation = {
  invitedRole: string;
  invitedParticipant: string;
  state: "Pending" | "Accepted" | "Closed";
  link: string;
  createdBy: string;
};

export type ConfirmationState = "Pending" | "Confirmed" | "Not Applicable";

export type ConfirmationParticipant = {
  role: "Buyer" | "Seller";
  state: ConfirmationState;
  timestamp?: string;
};

export type Confirmation = {
  currentState: string;
  participants: ConfirmationParticipant[];
  note: string;
  isUnavailable?: boolean;
};

export type TradeLifecycleStateId =
  | "awaiting_seller_acceptance"
  | "accepted"
  | "awaiting_seller_confirmation"
  | "mutually_confirmed"
  | "recorded"
  | "cancelled";

export type TradeLifecycleState = {
  id: TradeLifecycleStateId;
  label: string;
  status: string;
  invitation: Invitation;
  confirmation: Confirmation;
  timeline: TimelineEvent[];
  note: string;
};

const baseInvitation = {
  invitedRole: "Seller",
  invitedParticipant: "Mina R.",
  link: "/trade/tr-000001",
  createdBy: "Jasper H."
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

export const defaultTradeLifecycleStateId: TradeLifecycleStateId =
  "awaiting_seller_acceptance";

export const tradeLifecycleStates: TradeLifecycleState[] = [
  {
    id: "awaiting_seller_acceptance",
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
    id: "awaiting_seller_confirmation",
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
    id: "mutually_confirmed",
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
