import { Context } from "hono";

export const getTasks = async (c: Context) => {
  const result = await c.get("db").query.tasks.findMany();

  return result;
};
