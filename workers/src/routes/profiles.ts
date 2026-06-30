import { jsonResponse } from "../http/json-response";
import { getReputationProfileByTrustLayerId } from "../repositories/profiles";
import type { WorkerEnv } from "../env";

export async function handleProfileRoutes(
  request: Request,
  url: URL,
  env: WorkerEnv
): Promise<Response | null> {
  if (request.method !== "GET") {
    return null;
  }

  const match = url.pathname.match(/^\/api\/users\/([^/]+)\/profile$/);

  if (!match) {
    return null;
  }

  try {
    const profile = await getReputationProfileByTrustLayerId(
      env.DB,
      match[1] ?? ""
    );

    if (!profile) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Reputation Profile not found."
          }
        },
        {
          status: 404
        }
      );
    }

    return jsonResponse({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Unable to load Reputation Profile.", error);

    return jsonResponse(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to load Reputation Profile."
        }
      },
      {
        status: 500
      }
    );
  }
}
