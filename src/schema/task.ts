import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tasks } from "../db/schema";

export const TaskSchema = createSelectSchema(tasks);
export const CreateTaskSchema = createInsertSchema(tasks)
  .omit({
    id: true,
    userId: true,
  })
  .extend({ completionAt: z.coerce.date() });

export const UpdateTaskSchema = CreateTaskSchema.partial();
export const ParamTaskSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
  }),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
