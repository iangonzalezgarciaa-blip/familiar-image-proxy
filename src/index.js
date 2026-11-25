export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Use POST /v1/images/generations" },
        { status: 405, headers: cors }
      );
    }

    if (request.headers.get("Authorization") !== `Bearer ${env.PROXY_KEY}`) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401, headers: cors }
      );
    }

    try {
      const body = await request.json();
      const prompt = body.prompt;

      if (!prompt || typeof prompt !== "string") {
        return Response.json(
          { error: "Missing prompt" },
          { status: 400, headers: cors }
        );
      }

      const result = await env.AI.run(
        "@cf/black-forest-labs/flux-1-schnell",
        {
          prompt: prompt.slice(0, 2048),
          steps: 4
        }
      );

      return Response.json(
        {
          created: Math.floor(Date.now() / 1000),
          data: [{ b64_json: result.image }]
        },
        { headers: cors }
      );
    } catch (error) {
      return Response.json(
        { error: String(error) },
        { status: 500, headers: cors }
      );
    }
  }
};
