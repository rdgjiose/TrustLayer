import { jsonResponse } from "./http/json-response";
import { handleHealthRoute } from "./routes/health";
import { handleProfileRoutes } from "./routes/profiles";
import { handleTradeRoutes } from "./routes/trades";
import type { WorkerEnv } from "./env";

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    const response =
      handleHealthRoute(request, url) ??
      (await handleTradeRoutes(request, url, env)) ??
      handleProfileRoutes(request, url);

    if (response) {
      return response;
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
