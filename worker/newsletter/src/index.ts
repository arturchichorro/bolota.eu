interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  MAILERLITE_API_KEY: string;
  MAILERLITE_GROUP_ID: string;
  ALLOWED_ORIGINS: string;
  SUBSCRIBE_RATE_LIMITER: RateLimiter;
}

const successMessage = "Check your inbox to confirm your subscription.";

function reply(request: Request, status: number, message: string, origin?: string) {
  const headers = new Headers({ "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  if (status === 429) headers.set("Retry-After", "60");
  if (request.headers.get("accept")?.includes("application/json")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
    return new Response(JSON.stringify({ message }), { status, headers });
  }
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter</title></head><body><p>${escape(message)}</p>${origin ? `<a href="${escape(origin)}">Return to the website</a>` : ""}</body></html>`, { status, headers });
}

async function limitedBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 2048) {
      await reader.cancel();
      throw new Error("Body too large");
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(buffer);
}

export async function handleSubscribe(request: Request, env: Env, send: typeof fetch = fetch): Promise<Response> {
  if (new URL(request.url).pathname !== "/api/subscribe") return reply(request, 404, "Not found.");
  if (request.method !== "POST") {
    const response = reply(request, 405, "Use the newsletter form to subscribe.");
    response.headers.set("Allow", "POST");
    return response;
  }
  const origin = request.headers.get("origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(value => value.trim());
  if (!origin || !allowed.includes(origin)) return reply(request, 403, "This request is not allowed.");

  if (!env.MAILERLITE_API_KEY || !env.MAILERLITE_GROUP_ID || !env.SUBSCRIBE_RATE_LIMITER) {
    return reply(request, 503, "Newsletter signup is temporarily unavailable.", origin);
  }
  try {
    const ip = request.headers.get("cf-connecting-ip") || "local";
    const rate = await env.SUBSCRIBE_RATE_LIMITER.limit({ key: `newsletter:${ip}` });
    if (!rate.success) return reply(request, 429, "Too many attempts. Please try again in a minute.", origin);
  } catch {
    return reply(request, 503, "Newsletter signup is temporarily unavailable.", origin);
  }

  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
    return reply(request, 415, "Unsupported form submission.", origin);
  }
  let form: URLSearchParams;
  try { form = new URLSearchParams(await limitedBody(request)); }
  catch { return reply(request, 413, "The submission is too large.", origin); }

  // A honeypot complements rate limiting; neither replaces double opt-in.
  if (form.get("website")) return reply(request, 202, successMessage, origin);
  const emails = form.getAll("email");
  const email = emails[0]?.trim() || "";
  if (emails.length !== 1 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
    return reply(request, 400, "Enter a valid email address.", origin);
  }

  try {
    const response = await send("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${env.MAILERLITE_API_KEY}` },
      body: JSON.stringify({ email, groups: [env.MAILERLITE_GROUP_ID] }),
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) return reply(request, 200, successMessage, origin);
    if (response.status === 429) return reply(request, 429, "Please try again in a minute.", origin);
    if (response.status === 422) return reply(request, 400, "That email could not be subscribed. Please check it and try again.", origin);
    // Never expose provider responses, subscriber data, or credentials to the browser/logs.
    return reply(request, 502, "Newsletter signup is temporarily unavailable. Please try again later.", origin);
  } catch {
    return reply(request, 502, "Could not complete the signup. Please try again later.", origin);
  }
}

export default {
  fetch(request: Request, env: Env) {
    return handleSubscribe(request, env);
  },
};
