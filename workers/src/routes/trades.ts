import { jsonResponse } from "../http/json-response";
import { getTradeRecordByCode } from "../repositories/trades";
import type { WorkerEnv } from "../env";

export async function handleTradeRoutes(
  request: Request,
  url: URL,
  env: WorkerEnv
): Promise<Response | null> {
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
