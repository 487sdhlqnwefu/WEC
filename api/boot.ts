import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

app.get("/api/wlat/health", (c) =>
  c.json({ ok: true, product: "World Latte Art Throwdown", ts: Date.now() }),
);

app.post("/api/wlat/photos/:photoId/complete", async (c) => {
  const { getEngine } = await import("./wlat/instance");
  const { putObject } = await import("./wlat/storage");
  const { createContext } = await import("./context");
  const ctx = await createContext({ req: c.req.raw, resHeaders: c.res.headers, info: undefined as never });
  if (!ctx.wlatMember && !ctx.user) return c.json({ error: "Authentication required" }, 401);
  const bytes = new Uint8Array(await c.req.arrayBuffer());
  const engine = getEngine();
  const photoId = c.req.param("photoId");
  try {
    const actor = {
      member: ctx.wlatMember!,
      isPlatformAdmin: ctx.user?.role === "admin",
      requestId: "upload",
    };
    const photo = engine.completePhotoUpload(actor, photoId, bytes);
    if (photo.originalStoragePath) await putObject(photo.originalStoragePath, bytes);
    return c.json({ ok: true, photoId: photo.id, status: photo.submissionStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return c.json({ error: message }, 400);
  }
});

app.post("/api/stripe/wlat-webhook", async (c) => {
  const { getEngine } = await import("./wlat/instance");
  const { stripe } = await import("./lib/stripe");
  const raw = await c.req.text();
  const signature = c.req.header("stripe-signature");
  const secret = process.env.STRIPE_WLAT_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
  let eventType = "checkout.session.completed";
  let providerEventId = `wh_${Date.now()}`;
  let sessionId: string | undefined;
  let sessionStatus = "complete";
  let paymentIntentId: string | undefined;
  let eventId: string | undefined;
  if (stripe && secret && signature) {
    try {
      const event = stripe.webhooks.constructEvent(raw, signature, secret);
      providerEventId = event.id;
      eventType = event.type;
      const obj = event.data.object as {
        id?: string;
        payment_status?: string;
        payment_intent?: string;
        metadata?: { eventId?: string };
      };
      sessionId = obj.id;
      sessionStatus = obj.payment_status === "paid" ? "complete" : obj.payment_status || "open";
      paymentIntentId = obj.payment_intent;
      eventId = obj.metadata?.eventId;
    } catch {
      return c.json({ error: "Invalid signature" }, 400);
    }
  } else {
    try {
      const parsed = JSON.parse(raw) as { id?: string; type?: string; data?: { object?: { id?: string; metadata?: { eventId?: string } } } };
      providerEventId = parsed.id || providerEventId;
      eventType = parsed.type || eventType;
      sessionId = parsed.data?.object?.id;
      eventId = parsed.data?.object?.metadata?.eventId;
    } catch {
      return c.json({ error: "Invalid payload" }, 400);
    }
  }
  const result = getEngine().applyPaymentWebhook({
    providerEventId,
    eventType,
    payloadHash: raw.slice(0, 64),
    checkoutSessionId: sessionId,
    paymentIntentId,
    sessionStatus,
    eventId,
  });
  return c.json(result);
});

app.get("/api/wlat/stream", async (c) => {
  const slug = c.req.query("slug");
  if (!slug) return c.json({ error: "slug required" }, 400);
  const { getEngine } = await import("./wlat/instance");
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try {
          const payload = getEngine().publicEventDto(slug);
          const safe = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(safe)}\n\n`));
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "unavailable" })}\n\n`));
        }
      };
      send();
      const interval = setInterval(send, 1000);
      c.req.raw.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});

void import("./wlat/seed").then(({ seedWlatDemos }) => {
  seedWlatDemos().catch((err) => console.warn("[wlat] seed skipped", err));
});
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
