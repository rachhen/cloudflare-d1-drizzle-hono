import { createRoute } from "@hono/zod-openapi";

import {
  AuthResponseSchema,
  RegisterSchema,
  LoginSchema,
  UserSchema,
} from "../schema/auth";
import { ErrorSchema } from "../schema/error";

export const registerRoute = createRoute({
  method: "post",
  path: "/api/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: AuthResponseSchema,
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

export const loginRoute = createRoute({
  method: "post",
  path: "/api/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthResponseSchema,
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

export const currentUserRoute = createRoute({
  method: "get",
  path: "/api/me",
  tags: ["Auth"],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserSchema,
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
