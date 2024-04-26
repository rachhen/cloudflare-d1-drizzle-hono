import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { createMiddleware } from "hono/factory";
import { Lucia } from "lucia";

import { MyEnv } from "../types/env";
import { sessions, users } from "../db/schema";

declare module "hono" {
  interface ContextVariableMap {
    lucia: Lucia;
  }
}

declare module "lucia" {
  interface Register {
    // Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface User extends DatabaseUserAttributes {}
}

interface DatabaseUserAttributes {
  email: string;
  fullName: string | null;
  emailVerified: boolean;
}

const luciaMiddleware = createMiddleware<MyEnv>(async (c, next) => {
  const db = c.get("db");
  const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
  const lucia = new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        // attributes has the type of DatabaseUserAttributes
        email: attributes.email,
        fullName: attributes.fullName,
        emailVerified: attributes.emailVerified,
      };
    },
  });

  c.set("lucia", lucia);

  await next();
});

export { luciaMiddleware };
