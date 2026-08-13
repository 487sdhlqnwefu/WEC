import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { eventsRouter } from "./events-router";
import { registrationsRouter } from "./registrations-router";
import { sponsorsRouter } from "./sponsors-router";
import { contactsRouter } from "./contacts-router";
import { productsRouter } from "./products-router";
import { ordersRouter } from "./orders-router";
import { newsRouter } from "./news-router";
import { donationsRouter } from "./donations-router";
import { organiserRouter } from "./organisers-router";
import { adminRouter } from "./admin-router";
import { stripeRouter } from "./stripe-router";

import { throwdownRouter } from "./throwdown/router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  events: eventsRouter,
  registrations: registrationsRouter,
  sponsors: sponsorsRouter,
  contacts: contactsRouter,
  products: productsRouter,
  orders: ordersRouter,
  news: newsRouter,
  donations: donationsRouter,
  organiser: organiserRouter,
  admin: adminRouter,
  stripe: stripeRouter,
  throwdown: throwdownRouter,
});

export type AppRouter = typeof appRouter;
