import { jsonResponse } from "../http/json-response";

export function handleHealthRoute(request: Request, url: URL): Response | null {
  if (request.method === "GET" && url.pathname === "/api/health") {
    return jsonResponse({ status: "ok" });
  }

  return null;
}
