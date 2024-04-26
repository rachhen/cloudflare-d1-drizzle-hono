```sh
bun install
bun run dev
```

```sh
bun run deploy
```

### DB

```sh
export DEMO_DATABASE_NAME=cloudflare-d1-drizzle-hono

# Create D1 database
bunx wrangler d1 create $DEMO_DATABASE_NAME

# Generate database schemas
bun db:generate

# List migration on local dev
bunx wrangler d1 migrations list $DEMO_DATABASE_NAME --local

# Apply migrations for local dev
bunx wrangler d1 migrations apply $DEMO_DATABASE_NAME --local
```
