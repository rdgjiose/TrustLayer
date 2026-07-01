import { jsonResponse } from "../http/json-response";
import {
  createTradeRecord,
  getTradeRecordByCode,
  type CreateTradeInput
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
