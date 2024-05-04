import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { MyEnv } from "../types/env";
import { requiredAuth } from "../middleware/auth";
import {
  CreateTaskSchema,
  ParamTaskSchema,
  UpdateTaskSchema,
} from "../schema/task";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../services/task";

const task = new Hono<MyEnv>();

task.get("/", requiredAuth, async (c) => {
  const tasks = await getTasks(c);

  return c.json(tasks);
});

task.get("/:id", requiredAuth, async (c) => {
  const id = +c.req.param("id");
  const tasks = await getTask(c, id);

  return c.json(tasks);
});

task.post(
  "/",
  requiredAuth,
  zValidator("json", CreateTaskSchema),
  async (c) => {
    const input = c.req.valid("json");
    const result = await createTask(c, input);

    return c.json(result);
  }
);

task.put(
  "/:id",
  requiredAuth,
  zValidator("param", ParamTaskSchema),
  zValidator("json", UpdateTaskSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const result = await updateTask(c, +id, input);

    return c.json(result);
  }
);

task.delete("/:id", requiredAuth, async (c) => {
  const id = +c.req.param("id");
  const result = await deleteTask(c, id);

  return c.json(result);
});

export default task;
