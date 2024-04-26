import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { User } from "lucia";

import { MyEnv } from "../types/env";

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}

export const requiredAuth = createMiddleware<MyEnv>(async (c, next) => {
  const lucia = c.get("lucia");
  const authorizationHeader = c.req.header("Authorization");
  const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

  if (!sessionId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("user", user);

  await next();
});
