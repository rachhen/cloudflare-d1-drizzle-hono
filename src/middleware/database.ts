import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";

import * as schema from "../db/schema";
import { MyEnv } from "../types/env";

declare module "hono" {
  interface ContextVariableMap {
    db: DrizzleD1Database<typeof schema>;
  }
}

const dbMiddleware = createMiddleware<MyEnv>(async (c, next) => {
  c.set("db", drizzle(c.env.DB, { schema }));

  await next();
});

export { dbMiddleware };
