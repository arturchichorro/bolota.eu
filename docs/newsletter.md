# Newsletter setup

The footer is prerendered HTML. `public/newsletter.js` is a small, dependency-free, deferred submit handler on every page; it does **not** load React on static pages. It sends a same-origin form POST to `/api/subscribe` and displays feedback without navigating. Without JavaScript, the form still submits and receives a simple confirmation/error page.

`worker/newsletter/src/index.ts` handles subscriptions through the **current** MailerLite API. The static website and VPS do not need a backend process. Cloudflare routes only `/api/subscribe` to this Worker; everything else continues to the existing website origin.

## 1. Prepare MailerLite

In the current dashboard (`dashboard.mailerlite.com`):

1. Find or create the subscriber group used for blog updates. Reuse the existing newsletter group if it already has your subscribers and automations. Copy its numeric **group ID**, not its name.
2. Under **Integrations → MailerLite API**, create an API token for this website. Keep it private: do not paste it into chat, Git, the browser script, or a `VITE_*` variable.
3. Under **Account settings → Subscribe settings**, enable **double opt-in for API and integrations**. Check its confirmation email and destination. API-created subscriptions must require email confirmation, not just subscriptions through MailerLite-hosted forms.

The Worker does not force `status: active`. MailerLite should manage confirmation and existing subscriber state, including unsubscribed addresses. Verify this with test addresses before launch. If API double opt-in is unavailable on the account, stop rather than publish a form that activates arbitrary addresses.

## 2. Check Cloudflare routing

- `achichorro.com` must be in the Cloudflare account used for deployment.
- Its website DNS record must be **Proxied** (orange cloud). A Worker route does not run on a DNS-only record.
- The website must already work correctly through the proxy, including origin TLS. Do not change the home-hub/Caddy configuration just to deploy this Worker.
- The route is exactly `achichorro.com/api/subscribe`. It replaces any existing handler at that path, so coordinate this with publishing the new site if that endpoint is already in use.
- The config allows submissions only from `https://achichorro.com`. Redirect `www` to the canonical domain, or explicitly add its origin and a corresponding route if you serve the site there too.

## 3. Configure and deploy

From the repository root:

```bash
pnpm exec wrangler login
```

In `worker/newsletter/wrangler.jsonc`, replace the top-level empty `MAILERLITE_GROUP_ID` with your group ID. The ID is not a credential. The development environment has a separate value, which you can leave empty unless testing locally.

```bash
pnpm newsletter:deploy
pnpm exec wrangler secret put MAILERLITE_API_KEY --config worker/newsletter/wrangler.jsonc --env ''
```

Paste the token only into Wrangler's secret prompt. The initial deployment fails closed with a friendly unavailable response until the token is set. Wrangler stores the token as a Worker secret; deploying the site never exposes it.

If Wrangler asks you to choose an account, choose the account owning the `achichorro.com` zone. If necessary, add that account's ID to `wrangler.jsonc`.

The Worker includes an IP-based rate-limit binding (5 attempts per minute) and a honeypot. The numeric rate-limit namespace IDs must be unique among unrelated limiters in your account. Change them if already allocated elsewhere. These are basic abuse protections, not a guarantee against distributed bots. Add Turnstile later if abuse warrants its extra frontend/setup work.

## 4. Publish and verify

Publish the site's new `dist/` as usual. The newsletter script is included in the static build automatically. The Worker deployment and site deployment are independent.

Test using an email address you control:

- Submission stays on the article and shows confirmation feedback.
- A confirmation email arrives.
- The address is **unconfirmed** before clicking the confirmation link and belongs to the intended group.
- Confirming activates the subscription as intended.
- Existing active and unsubscribed test addresses are handled correctly; an unsubscribed address must not silently become active.
- Invalid emails show an error; network errors allow retrying.
- With browser JavaScript disabled, submitting still gets a readable Worker response.

Do not use random addresses for testing. Rate limiting may temporarily block repeated tests from the same IP; wait a minute between batches.

## Local development (optional)

Fill the development group ID in `wrangler.jsonc`. Create `worker/newsletter/.dev.vars.development` containing:

```dotenv
MAILERLITE_API_KEY="your-token"
```

That file and Wrangler's local state are Git-ignored. Use a test group/token where possible; successful local submissions contact the real MailerLite API.

Run in separate terminals:

```bash
pnpm newsletter:dev
pnpm dev
```

Vite proxies `/api/subscribe` to the local Worker at port 8787. The local allowed origins cover localhost/127.0.0.1 at ports 5173 and 4173. If Vite chooses a different port, explicitly add that origin to the development config. Production allows only the canonical HTTPS origin.

For production-preview testing, use `pnpm build && pnpm preview` alongside `pnpm newsletter:dev`.

## Checks and maintenance

```bash
pnpm check
pnpm test:newsletter
pnpm build
pnpm exec wrangler deploy --config worker/newsletter/wrangler.jsonc --env '' --dry-run
```

Unit tests mock MailerLite and never create subscribers. A dry run bundles the Worker without publishing it. Rotate the token using the same `wrangler secret put` command; never commit it.

Subscriber addresses and provider responses are not logged by this Worker. Keep the signup purpose limited to blog updates and honor MailerLite's unsubscribe flow. Origin checks prevent ordinary cross-site form submissions, but are not authentication or sufficient bot protection by themselves.
