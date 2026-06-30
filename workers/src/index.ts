import type {
  ApiSuccessResponse,
  TradeLifecyclePayload,
  TradeLifecycleStateId,
  TradeRecordData
} from "../../shared/types/trade-record";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8"
};

const availableTradeLifecycleStates: TradeLifecycleStateId[] = [
  "awaiting_seller_acceptance",
  "accepted",
  "awaiting_seller_confirmation",
  "mutually_confirmed",
  "recorded",
  "cancelled"
];

const mockTradeLifecycle: TradeLifecyclePayload = {
  tradeStatus: "Awaiting Seller Acceptance",
  invitation: {
    invitedRole: "Seller",
    invitedParticipant: "Mina R.",
    state: "Pending",
    link: "/trade/tr-000001",
    createdBy: "Jasper H."
  },
  confirmation: {
    currentState: "Unavailable until Participant Acceptance",
    isUnavailable: true,
    participants: [],
    note: "No trade confirmation can happen until both participants have joined this Trade Record."
  },
  timeline: [
    {
      dateTime: "2026-06-21T09:10:00",
      displayTime: "2026-06-21 09:10",
      eventType: "Trade Created",
      description: "Trade Record opened from an external marketplace listing."
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
  note: "TrustLayer records historical events. It does not judge participants."
};

const mockTradeRecord: ApiSuccessResponse<TradeRecordData> = {
  success: true,
  data: {
    tradeId: "trd_000001",
    tradeCode: "tr-000001",
    item: {
      title: "iPhone 14",
      summary: "Used iPhone 14 in good condition",
      marketplace: "Facebook Marketplace",
      source: "Facebook Marketplace"
    },
    participants: {
      buyer: {
        name: "Jasper H.",
        trustlayerId: "tl-9f32a"
      },
      seller: {
        name: "Mina R.",
        trustlayerId: "tl-4m7q2"
      }
    },
    currentState: "awaiting_seller_acceptance" satisfies TradeLifecycleStateId,
    availableStates: availableTradeLifecycleStates,
    lifecycle: mockTradeLifecycle
  }
};

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...init?.headers
    }
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return jsonResponse({ status: "ok" });
    }

    if (request.method === "GET" && url.pathname === "/api/trades/tr-000001") {
      return jsonResponse(mockTradeRecord);
    }

    return jsonResponse(
      {
        error: "not_found"
      },
      {
        status: 404
      }
    );
  }
};
