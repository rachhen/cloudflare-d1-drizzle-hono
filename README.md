```
npm install
npm run dev
```

```
npm run deploy
```

### DB

```sh
export DEMO_DATABASE_NAME=drizzle-test-migrations

# Create D1 database
npx wrangler d1 create $DEMO_DATABASE_NAME

# Generate database schemas
bun db:generate

# List migration on local dev
npx wrangler d1 migrations list $DEMO_DATABASE_NAME --local

# Apply migrations for local dev
npx wrangler d1 migrations apply $DEMO_DATABASE_NAME --local
```
