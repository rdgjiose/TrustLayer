import { jsonResponse } from "../http/json-response";
import { mockTradeRecord } from "../mock/trade-record";

export function handleTradeRoutes(request: Request, url: URL): Response | null {
  if (request.method === "GET" && url.pathname === "/api/trades/tr-000001") {
    return jsonResponse(mockTradeRecord);
  }

  return null;
}
