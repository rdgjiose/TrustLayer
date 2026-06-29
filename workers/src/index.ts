const jsonHeaders = {
  "content-type": "application/json; charset=utf-8"
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
