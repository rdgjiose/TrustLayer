import { jsonResponse } from "../http/json-response";
import { mockReputationProfile } from "../mock/profile";

export function handleProfileRoutes(
  request: Request,
  url: URL
): Response | null {
  if (request.method === "GET" && url.pathname === "/api/users/tl-9f32a/profile") {
    return jsonResponse(mockReputationProfile);
  }

  return null;
}
