import { createMiddleware } from "hono/factory";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

import { MyEnv } from "../types/env";

type Unit = "ms" | "s" | "m" | "h" | "d";
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

let ratelimit: Ratelimit;
export const rateLimiter = (limit = 3, window: Duration = "15 m") => {
  return createMiddleware<MyEnv>(async (c, next) => {
    if (!ratelimit) {
      ratelimit = new Ratelimit({
        redis: Redis.fromEnv({
          UPSTASH_REDIS_REST_URL: c.env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: c.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(limit, window),
        analytics: true,
        prefix: "@upstash/ratelimit",
      });
    }

    const userIp = c.req.raw.headers.get("CF-Connecting-IP");
    const identifier = userIp ? `${c.req.path}-${userIp}` : c.req.path;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return c.json({ message: "Unable to process at this time" }, 429);
    }

    await next();
  });
};
