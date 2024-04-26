import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";

import { MyEnv } from "./types/env";
import { dbMiddleware } from "./middleware/database";
import { luciaMiddleware } from "./middleware/lucia";
import auth from "./routes/auth";
import task from "./routes/task";

const app = new Hono<MyEnv>().basePath("/api");
app.use(dbMiddleware);
app.use(luciaMiddleware);
app.use(logger());

app.route("/", auth);
app.route("/tasks", task);

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }

  return c.json({ message: err.message, cause: err });
});

export default app;
