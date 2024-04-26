import { Hono } from "hono";

import { MyEnv } from "../types/env";
import { requiredAuth } from "../middleware/auth";

const task = new Hono<MyEnv>();

task.get("/", requiredAuth, async (c) => {
  return c.json({ tasks: [], user: c.var.user });
});

export default task;
