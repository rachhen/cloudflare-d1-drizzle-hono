import { Context } from "hono";
import { and, eq } from "drizzle-orm";

import { CreateTaskInput, UpdateTaskInput } from "../schema/task";
import { tasks } from "../db/schema";
import { HTTPException } from "hono/http-exception";

export const getTasks = async (c: Context) => {
  const result = await c.var.db.query.tasks.findMany({
    where: eq(tasks.userId, c.var.user.id),
  });

  return result;
};

export const getTask = async (c: Context, id: number) => {
  const [result] = await c.var.db.query.tasks.findMany({
    where: and(eq(tasks.userId, c.var.user.id), eq(tasks.id, id)),
  });

  if (!result) {
    throw new HTTPException(404, { message: "Task not found" });
  }

  return result;
};

export const createTask = async (c: Context, input: CreateTaskInput) => {
  const [result] = await c.var.db
    .insert(tasks)
    .values({
      ...input,
      userId: c.var.user.id,
    })
    .returning();

  return result;
};

export const updateTask = async (
  c: Context,
  id: number,
  input: UpdateTaskInput
) => {
  const [result] = await c.var.db
    .update(tasks)
    .set(input)
    .where(and(eq(tasks.id, id), eq(tasks.userId, c.var.user.id)))
    .returning();

  if (!result) {
    throw new HTTPException(400, { message: "Task not found!" });
  }

  return result;
};

export const deleteTask = async (c: Context, id: number) => {
  const [result] = await c.var.db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, c.var.user.id)))
    .returning();

  if (!result) {
    throw new HTTPException(404, { message: "Task not found!" });
  }

  return result;
};
