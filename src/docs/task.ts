import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

import {
  CreateTaskSchema,
  ParamTaskSchema,
  TaskSchema,
  UpdateTaskSchema,
} from "../schema/task";
import { ErrorSchema } from "../schema/error";

const taskDocs = new OpenAPIHono();

function createTask() {
  return {
    id: 1,
    title: "title",
    description: "desc",
    completionAt: null,
    userId: "1",
  };
}

export const createTaskRoute = createRoute({
  method: "post",
  path: "/api/tasks",
  tags: ["Task"],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTaskSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
      description: "",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Return bad request",
    },
  },
});

taskDocs.openapi(createTaskRoute, (c) => {
  return c.json(createTask(), 201);
});

export const listTasksRoute = createRoute({
  method: "get",
  path: "/api/tasks",
  tags: ["Task"],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(TaskSchema),
        },
      },
      description: "",
    },
  },
});

taskDocs.openapi(listTasksRoute, (c) => {
  return c.json([createTask()], 200);
});

export const taskRoute = createRoute({
  method: "get",
  path: "/api/tasks/{id}",
  tags: ["Task"],
  security: [{ Bearer: [] }],
  request: {
    params: ParamTaskSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
      description: "",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Task not found",
    },
  },
});

taskDocs.openapi(taskRoute, (c) => {
  return c.json(createTask(), 200);
});

export const updateTasksRoute = createRoute({
  method: "put",
  path: "/api/tasks/{id}",
  tags: ["Task"],
  security: [{ Bearer: [] }],
  request: {
    params: ParamTaskSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateTaskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
      description: "",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Return bad request",
    },
  },
});

taskDocs.openapi(updateTasksRoute, (c) => {
  return c.json(createTask(), 200);
});

export const deleteTasksRoute = createRoute({
  method: "delete",
  path: "/api/tasks/{id}",
  tags: ["Task"],
  security: [{ Bearer: [] }],
  request: {
    params: ParamTaskSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
      description: "",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Task not found",
    },
  },
});

taskDocs.openapi(deleteTasksRoute, (c) => {
  return c.json(createTask(), 200);
});

export default taskDocs;
