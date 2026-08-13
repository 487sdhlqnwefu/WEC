# Stripe — USD 300 licence

- Amount: 30000 USD cents. Currency USD.
- Create Checkout from `wlat.createCheckout`. Session metadata includes `eventId` and `product=wlat_licence`.
- Success URL is **not** authoritative.
- Webhook: `POST /api/stripe/wlat-webhook` with `STRIPE_WLAT_WEBHOOK_SECRET` or `STRIPE_WEBHOOK_SECRET`.
- Events are stored by `provider_event_id` and skipped if duplicate.
- Without Stripe keys, checkout is mocked and immediately marked paid so local development works.
- Platform Admin refunds record reason and Stripe result; no hardcoded business refund policy.
