import { jsonResponse } from "./http/json-response";
import { handleHealthRoute } from "./routes/health";
import { handleTradeRoutes } from "./routes/trades";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const response =
      handleHealthRoute(request, url) ?? handleTradeRoutes(request, url);

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
