import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { MyEnv } from "../types/env";
import {
  loginSchema,
  registerSchema,
  sendResetPasswordSchema,
  verificationCodeSchema,
} from "../schema/auth";
import {
  emailVerification,
  login,
  register,
  resetPassword,
  sendResetPassword,
} from "../services/auth";
import { requiredAuth } from "../middleware/auth";
import { rateLimiter } from "../middleware/rate-limiter";

const auth = new Hono<MyEnv>();

auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const lucia = c.get("lucia");
  const input = c.req.valid("json");
  const user = await register(c, input);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return c.json({ user, token: sessionCookie.value }, 201);
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const lucia = c.get("lucia");
  const input = c.req.valid("json");
  const user = await login(c, input);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return c.json({ user, token: sessionCookie.value }, 200);
});

auth.post(
  "/email-verification",
  zValidator("json", verificationCodeSchema),
  requiredAuth,
  async (c) => {
    const lucia = c.var.lucia;
    const input = c.req.valid("json");

    await emailVerification(c, input);
    const session = await lucia.createSession(c.var.user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return c.json({ user: c.var.user, token: sessionCookie.value });
  }
);

auth.post(
  "/reset-password",
  zValidator("json", sendResetPasswordSchema),
  rateLimiter(),
  async (c) => {
    const input = c.req.valid("json");

    await sendResetPassword(c, input);
    return c.json({ message: "Email sent" }, 200);
  }
);

auth.post(
  "/reset-password/:token",
  zValidator("json", z.object({ newPassword: z.string().min(6) })),
  rateLimiter(),
  async (c) => {
    const input = c.req.valid("json");
    const verificationToken = c.req.param("token");

    const token = await resetPassword(c, verificationToken, input.newPassword);
    const session = await c.var.lucia.createSession(token.userId, {});
    c.var.lucia.createSessionCookie(session.id);

    return c.json({ message: "Reset successfully" }, 200, {
      "Referrer-Policy": "no-referrer",
    });
  }
);

export default auth;