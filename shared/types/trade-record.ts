export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type TradeLifecycleStateId =
  | "awaiting_seller_acceptance"
  | "accepted"
  | "awaiting_seller_confirmation"
  | "awaiting_buyer_confirmation"
  | "mutually_confirmed"
  | "recorded"
  | "cancelled";

export type TradeItem = {
  title: string;
  summary: string;
  marketplace: string;
  source: string;
};

export type TradeParticipant = {
  name: string;
  trustlayerId: string;
};

export type TradeParticipants = {
  buyer: TradeParticipant;
  seller: TradeParticipant;
};

export type TradeTimelineEvent = {
  dateTime: string;
  displayTime: string;
  eventType: string;
  description: string;
};

export type TradeInvitationPayload = {
  invitedRole: string;
  invitedParticipant: string;
  state: "Pending" | "Accepted" | "Closed";
  link: string;
  createdBy: string;
};

export type TradeConfirmationPayload = {
  currentState: string;
  participants: {
    role: "Buyer" | "Seller";
    state: "Pending" | "Confirmed" | "Not Applicable";
    timestamp?: string;
  }[];
  note: string;
  isUnavailable?: boolean;
};

export type TradeLifecyclePayload = {
  tradeStatus: string;
  invitation: TradeInvitationPayload;
  confirmation: TradeConfirmationPayload;
  timeline: TradeTimelineEvent[];
  note: string;
};

export type TradeRecordData = {
  tradeId: string;
  tradeCode: string;
  item: TradeItem;
  participants: TradeParticipants;
  currentState: TradeLifecycleStateId;
  availableStates: TradeLifecycleStateId[];
  lifecycle: TradeLifecyclePayload;
};

export type TradeRecordResponse =
  | ApiSuccessResponse<TradeRecordData>
  | ApiErrorResponse;
