import assert from "node:assert/strict";
import { test } from "node:test";
import { handleSubscribe } from "../worker/newsletter/src/index.ts";

function setup() {
  const calls = [];
  const env = {
    MAILERLITE_API_KEY: "test-secret",
    MAILERLITE_GROUP_ID: "12345",
    ALLOWED_ORIGINS: "https://achichorro.com",
    SUBSCRIBE_RATE_LIMITER: { async limit({ key }) { calls.push({ rateKey: key }); return { success: true }; } },
  };
  const send = async (url, init) => { calls.push({ url, init }); return new Response("{}", { status: 201 }); };
  return { env, send, calls };
}
function request(fields = { email: "reader@example.com" }, overrides = {}) {
  return new Request("https://achichorro.com/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json", "Origin": "https://achichorro.com", "CF-Connecting-IP": "192.0.2.1", ...overrides.headers },
    body: new URLSearchParams(fields),
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== "headers")),
  });
}

test("valid subscriptions use the current API, correct group, and a secret Bearer token", async () => {
  const { env, send, calls } = setup();
  const response = await handleSubscribe(request({ email: " reader+blog@example.com " }), env, send);
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /confirm/);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(calls[0].rateKey, "newsletter:192.0.2.1");
  assert.equal(calls[1].url, "https://connect.mailerlite.com/api/subscribers");
  assert.equal(calls[1].init.headers.Authorization, "Bearer test-secret");
  assert.deepEqual(JSON.parse(calls[1].init.body), { email: "reader+blog@example.com", groups: ["12345"] });
  assert(!("status" in JSON.parse(calls[1].init.body)), "do not force existing subscribers back to active");
});

test("invalid, missing, oversized and duplicate emails never reach MailerLite", async () => {
  for (const fields of [{}, { email: "not-an-email" }, { email: "a@b" }, { email: "a b@example.com" }, { email: `${"a".repeat(250)}@example.com` }, [["email", "a@example.com"], ["email", "b@example.com"]]]) {
    const { env, send, calls } = setup();
    assert.equal((await handleSubscribe(request(fields), env, send)).status, 400);
    assert.equal(calls.filter(call => call.url).length, 0);
  }
});

test("foreign, absent and null origins are rejected", async () => {
  for (const origin of ["https://evil.example", "", "null"]) {
    const { env, send, calls } = setup();
    assert.equal((await handleSubscribe(request(undefined, { headers: { Origin: origin } }), env, send)).status, 403);
    assert.equal(calls.length, 0);
  }
});

test("wrong routes and methods are rejected", async () => {
  const { env, send, calls } = setup();
  assert.equal((await handleSubscribe(new Request("https://achichorro.com/api/subscribe/other"), env, send)).status, 404);
  const response = await handleSubscribe(new Request("https://achichorro.com/api/subscribe"), env, send);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
  assert.equal(calls.length, 0);
});

test("missing credentials, group or rate limiter fail closed", async () => {
  for (const key of ["MAILERLITE_API_KEY", "MAILERLITE_GROUP_ID", "SUBSCRIBE_RATE_LIMITER"]) {
    const { env, send, calls } = setup();
    delete env[key];
    assert.equal((await handleSubscribe(request(), env, send)).status, 503);
    assert.equal(calls.length, 0);
  }
});

test("rate-limited requests do not reach the provider", async () => {
  const { env, send, calls } = setup();
  env.SUBSCRIBE_RATE_LIMITER.limit = async () => ({ success: false });
  const response = await handleSubscribe(request(), env, send);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.equal(calls.length, 0);
});

test("rate-limiter failures fail closed", async () => {
  const { env, send, calls } = setup();
  env.SUBSCRIBE_RATE_LIMITER.limit = async () => { throw new Error("Unavailable"); };
  assert.equal((await handleSubscribe(request(), env, send)).status, 503);
  assert.equal(calls.length, 0);
});

test("honeypot submissions return generic success without creating a subscriber", async () => {
  const { env, send, calls } = setup();
  const response = await handleSubscribe(request({ email: "bot@example.com", website: "spam" }), env, send);
  assert.equal(response.status, 202);
  assert.equal(calls.filter(call => call.url).length, 0);
});

test("request bodies are bounded even without Content-Length", async () => {
  const { env, send, calls } = setup();
  const response = await handleSubscribe(request({ email: "reader@example.com", extra: "x".repeat(3000) }), env, send);
  assert.equal(response.status, 413);
  assert.equal(calls.filter(call => call.url).length, 0);
});

test("unsupported content types are rejected", async () => {
  const { env, send } = setup();
  assert.equal((await handleSubscribe(request(undefined, { headers: { "Content-Type": "application/json" } }), env, send)).status, 415);
});

test("provider errors are mapped without exposing private responses", async () => {
  for (const [upstream, expected] of [[422, 400], [429, 429], [401, 502], [500, 502]]) {
    const { env } = setup();
    const response = await handleSubscribe(request(), env, async () => new Response("private details test-secret", { status: upstream }));
    assert.equal(response.status, expected);
    assert(!/private details|test-secret/.test(await response.text()));
  }
});

test("network failures return a safe error", async () => {
  const { env } = setup();
  const response = await handleSubscribe(request(), env, async () => { throw new Error("secret diagnostic"); });
  assert.equal(response.status, 502);
  assert(!/secret diagnostic/.test(await response.text()));
});

test("JavaScript-free submissions get a safe HTML response and return link", async () => {
  const { env, send } = setup();
  const response = await handleSubscribe(request(undefined, { headers: { Accept: "text/html" } }), env, send);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(response.headers.get("content-security-policy"), /default-src 'none'/);
  const html = await response.text();
  assert.match(html, /href="https:\/\/achichorro.com"/);
  assert(!html.includes("reader@example.com"));
});
