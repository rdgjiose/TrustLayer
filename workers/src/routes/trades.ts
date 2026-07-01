import { jsonResponse } from "../http/json-response";
import {
  acceptTradeInvitation,
  confirmTrade,
  createTradeRecord,
  getTradeRecordByCode,
  updateTradeSummary,
  type CreateTradeInput,
  type UpdateTradeSummaryInput
} from "../repositories/trades";
import type { WorkerEnv } from "../env";

type CreateTradeRequestBody = {
  creatorTrustlayerId?: unknown;
  invitedTrustlayerId?: unknown;
  creatorRole?: unknown;
  marketplace?: unknown;
  listingUrl?: unknown;
  itemTitle?: unknown;
  itemSummary?: unknown;
};

type AcceptTradeInvitationRequestBody = {
  participantTrustlayerId?: unknown;
};

type ConfirmTradeRequestBody = {
  participantTrustlayerId?: unknown;
};

type UpdateTradeSummaryRequestBody = {
  listingPrice?: unknown;
  finalAgreedPrice?: unknown;
  currency?: unknown;
  tradeDate?: unknown;
  meetingLocationNote?: unknown;
  paymentMethod?: unknown;
  includedNotes?: unknown;
};

export async function handleTradeRoutes(
  request: Request,
  url: URL,
  env: WorkerEnv
): Promise<Response | null> {
  if (url.pathname === "/api/trades") {
    if (request.method === "POST") {
      return handleCreateTrade(request, env);
    }

    return methodNotAllowedResponse();
  }

  const acceptMatch = url.pathname.match(/^\/api\/trades\/([^/]+)\/accept$/);

  if (acceptMatch) {
    if (request.method === "POST") {
      return handleAcceptTradeInvitation(
        request,
        env,
        acceptMatch[1] ?? ""
      );
    }

    return methodNotAllowedResponse();
  }

  const confirmMatch = url.pathname.match(/^\/api\/trades\/([^/]+)\/confirm$/);

  if (confirmMatch) {
    if (request.method === "POST") {
      return handleConfirmTrade(request, env, confirmMatch[1] ?? "");
    }

    return methodNotAllowedResponse();
  }

  const summaryMatch = url.pathname.match(/^\/api\/trades\/([^/]+)\/summary$/);

  if (summaryMatch) {
    if (request.method === "PATCH") {
      return handleUpdateTradeSummary(request, env, summaryMatch[1] ?? "");
    }

    return methodNotAllowedResponse();
  }

  if (request.method !== "GET") {
    return null;
  }

  const match = url.pathname.match(/^\/api\/trades\/([^/]+)$/);

  if (!match) {
    return null;
  }

  try {
    const tradeRecord = await getTradeRecordByCode(env.DB, match[1] ?? "");

    if (!tradeRecord) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Trade Record not found."
          }
        },
        {
          status: 404
        }
      );
    }

    return jsonResponse({
      success: true,
      data: tradeRecord
    });
  } catch (error) {
    console.error("Unable to load Trade Record.", error);

    return jsonResponse(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to load Trade Record."
        }
      },
      {
        status: 500
      }
    );
  }
}

async function handleUpdateTradeSummary(
  request: Request,
  env: WorkerEnv,
  tradeCode: string
): Promise<Response> {
  const body = await parseUpdateTradeSummaryBody(request);

  if (!body) {
    return validationErrorResponse("Invalid JSON request body.");
  }

  const input = validateUpdateTradeSummaryBody(body);

  if (!input) {
    return validationErrorResponse("Invalid Final Trade Summary fields.");
  }

  try {
    const result = await updateTradeSummary(env.DB, tradeCode, input);

    if (result.status === "updated") {
      return jsonResponse({
        success: true,
        data: result.data
      });
    }

    return jsonResponse(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Trade Record not found."
        }
      },
      {
        status: 404
      }
    );
  } catch (error) {
    console.error("Unable to update Final Trade Summary.", error);

    return jsonResponse(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to update Final Trade Summary."
        }
      },
      {
        status: 500
      }
    );
  }
}

async function handleConfirmTrade(
  request: Request,
  env: WorkerEnv,
  tradeCode: string
): Promise<Response> {
  const body = await parseConfirmTradeBody(request);

  if (!body) {
    return validationErrorResponse("Invalid JSON request body.");
  }

  const participantTrustlayerId = readRequiredString(
    body.participantTrustlayerId
  );

  if (!participantTrustlayerId) {
    return validationErrorResponse("Missing participantTrustlayerId.");
  }

  try {
    const result = await confirmTrade(env.DB, tradeCode, participantTrustlayerId);

    if (result.status === "confirmed") {
      return jsonResponse({
        success: true,
        data: result.data
      });
    }

    if (
      result.status === "participant_not_found" ||
      result.status === "trade_not_found"
    ) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Trade Record or participant not found."
          }
        },
        {
          status: 404
        }
      );
    }

    if (result.status === "forbidden") {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Participant is not part of this Trade Record."
          }
        },
        {
          status: 403
        }
      );
    }

    return jsonResponse(
      {
        success: false,
        error: {
          code: "CONFLICT",
          message:
            result.status === "duplicate_confirmation"
              ? "Participant has already confirmed this Trade Record."
              : "Trade Record is not ready for confirmation."
        }
      },
      {
        status: 409
      }
    );
  } catch (error) {
    console.error("Unable to confirm Trade Record.", error);

    return jsonResponse(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to confirm Trade Record."
        }
      },
      {
        status: 500
      }
    );
  }
}

async function handleAcceptTradeInvitation(
  request: Request,
  env: WorkerEnv,
  tradeCode: string
): Promise<Response> {
  const body = await parseAcceptTradeInvitationBody(request);

  if (!body) {
    return validationErrorResponse("Invalid JSON request body.");
  }

  const participantTrustlayerId = readRequiredString(
    body.participantTrustlayerId
  );

  if (!participantTrustlayerId) {
    return validationErrorResponse("Missing participantTrustlayerId.");
  }

  try {
    const result = await acceptTradeInvitation(
      env.DB,
      tradeCode,
      participantTrustlayerId
    );

    if (result.status === "accepted") {
      return jsonResponse({
        success: true,
        data: result.data
      });
    }

    if (
      result.status === "participant_not_found" ||
      result.status === "trade_not_found"
    ) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Trade Record or participant not found."
          }
        },
        {
          status: 404
        }
      );
    }

    if (result.status === "forbidden") {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Participant is not part of this Trade Record."
          }
        },
        {
          status: 403
        }
      );
    }

    return jsonResponse(
      {
        success: false,
        error: {
          code: "CONFLICT",
          message: "Trade Record is not awaiting participant acceptance."
        }
      },
      {
        status: 409
      }
    );
  } catch (error) {
    console.error("Unable to accept Trade Record invitation.", error);

    return jsonResponse(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to accept Trade Record invitation."
        }
      },
      {
        status: 500
      }
    );
  }
}

async function handleCreateTrade(
  request: Request,
  env: WorkerEnv
): Promise<Response> {
  const body = await parseCreateTradeBody(request);

  if (!body) {
    return validationErrorResponse("Invalid JSON request body.");
  }

  const input = validateCreateTradeBody(body);

  if (!input) {
    return validationErrorResponse("Missing required field.");
  }

  try {
    const result = await createTradeRecord(env.DB, input);

    if (!result) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "Creator or invited participant not found."
          }
        },
        {
          status: 404
        }
      );
    }

    return jsonResponse({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Unable to create Trade Record.", error);

    return jsonResponse(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to create Trade Record."
        }
      },
      {
        status: 500
      }
    );
  }
}

async function parseUpdateTradeSummaryBody(
  request: Request
): Promise<UpdateTradeSummaryRequestBody | null> {
  try {
    const body = (await request.json()) as unknown;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }

    return body as UpdateTradeSummaryRequestBody;
  } catch {
    return null;
  }
}

async function parseConfirmTradeBody(
  request: Request
): Promise<ConfirmTradeRequestBody | null> {
  try {
    const body = (await request.json()) as unknown;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }

    return body as ConfirmTradeRequestBody;
  } catch {
    return null;
  }
}

async function parseAcceptTradeInvitationBody(
  request: Request
): Promise<AcceptTradeInvitationRequestBody | null> {
  try {
    const body = (await request.json()) as unknown;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }

    return body as AcceptTradeInvitationRequestBody;
  } catch {
    return null;
  }
}

async function parseCreateTradeBody(
  request: Request
): Promise<CreateTradeRequestBody | null> {
  try {
    const body = (await request.json()) as unknown;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }

    return body as CreateTradeRequestBody;
  } catch {
    return null;
  }
}

function validateCreateTradeBody(
  body: CreateTradeRequestBody
): CreateTradeInput | null {
  const creatorTrustlayerId = readRequiredString(body.creatorTrustlayerId);
  const invitedTrustlayerId = readRequiredString(body.invitedTrustlayerId);
  const creatorRole = readRequiredString(body.creatorRole);
  const itemTitle = readRequiredString(body.itemTitle);

  if (
    !creatorTrustlayerId ||
    !invitedTrustlayerId ||
    !itemTitle ||
    (creatorRole !== "buyer" && creatorRole !== "seller")
  ) {
    return null;
  }

  return {
    creatorTrustlayerId,
    invitedTrustlayerId,
    creatorRole,
    marketplace: readOptionalString(body.marketplace),
    listingUrl: readOptionalString(body.listingUrl),
    itemTitle,
    itemSummary: readOptionalString(body.itemSummary)
  };
}

function validateUpdateTradeSummaryBody(
  body: UpdateTradeSummaryRequestBody
): UpdateTradeSummaryInput | null {
  const input: UpdateTradeSummaryInput = {};
  const listingPrice = readPatchString(body, "listingPrice");
  const finalAgreedPrice = readPatchString(body, "finalAgreedPrice");
  const currency = readPatchString(body, "currency");
  const tradeDate = readPatchString(body, "tradeDate");
  const meetingLocationNote = readPatchString(body, "meetingLocationNote");
  const paymentMethod = readPatchString(body, "paymentMethod");
  const includedNotes = readPatchString(body, "includedNotes");

  if (
    listingPrice === null ||
    finalAgreedPrice === null ||
    currency === null ||
    tradeDate === null ||
    meetingLocationNote === null ||
    paymentMethod === null ||
    includedNotes === null
  ) {
    return null;
  }

  if (listingPrice) {
    input.listingPrice = listingPrice;
  }

  if (finalAgreedPrice) {
    input.finalAgreedPrice = finalAgreedPrice;
  }

  if (currency) {
    input.currency = currency.toUpperCase();
  }

  if (tradeDate) {
    input.tradeDate = tradeDate;
  }

  if (meetingLocationNote) {
    input.meetingLocationNote = meetingLocationNote;
  }

  if (paymentMethod) {
    input.paymentMethod = paymentMethod;
  }

  if (includedNotes) {
    input.includedNotes = includedNotes;
  }

  return Object.keys(input).length > 0 ? input : null;
}

function readRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function readOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function readPatchString(
  body: UpdateTradeSummaryRequestBody,
  fieldName: keyof UpdateTradeSummaryRequestBody
): string | null | undefined {
  if (!Object.prototype.hasOwnProperty.call(body, fieldName)) {
    return undefined;
  }

  const value = body[fieldName];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 && trimmedValue.length <= 240
    ? trimmedValue
    : null;
}

function validationErrorResponse(message: string): Response {
  return jsonResponse(
    {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message
      }
    },
    {
      status: 400
    }
  );
}

function methodNotAllowedResponse(): Response {
  return jsonResponse(
    {
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Method not allowed."
      }
    },
    {
      status: 405
    }
  );
}
