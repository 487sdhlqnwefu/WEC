# Throwdown schema

Apply with:

```bash
npx drizzle-kit push
```

Tables are defined in `db/throwdown-schema.ts` and exported from `db/schema.ts`. MySQL is the existing WEC database. Authorization is enforced in `api/throwdown/engine.ts` because MySQL does not provide Postgres-style row-level security.
