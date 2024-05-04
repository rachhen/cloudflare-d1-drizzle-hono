import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { OpenAPIHono } from "@hono/zod-openapi";

import { MyEnv } from "./types/env";
import { dbMiddleware } from "./middleware/database";
import { luciaMiddleware } from "./middleware/lucia";
import auth from "./routes/auth";
import task from "./routes/task";
import docsRoute from "./routes/docs";

// const app = new Hono<MyEnv>().basePath("/api");
const app = new OpenAPIHono<MyEnv>().basePath("/api");
app.use(dbMiddleware);
app.use(luciaMiddleware);
app.use(logger());

app.route("/auth", auth);
app.route("/tasks", task);
app.route("/docs", docsRoute);

app.notFound((c) => {
  return c.json({ code: 404, message: "Not Found" }, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ code: err.status, message: err.message }, err.status);
  }

  return c.json({ code: 500, message: err.message, cause: err }, 500);
});

export default app;
