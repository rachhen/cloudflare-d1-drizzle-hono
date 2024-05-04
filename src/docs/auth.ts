import { createRoute, z } from "@hono/zod-openapi";

import {
  AuthResponseSchema,
  RegisterSchema,
  LoginSchema,
  UserSchema,
  VerificationCodeSchema,
  ResetPasswordSchema,
  NewPasswordSchema,
} from "../schema/auth";
import { ErrorSchema } from "../schema/error";

export const registerRoute = createRoute({
  method: "post",
  path: "/api/auth/register",
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
  path: "/api/auth/login",
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

export const emailVerificationRoute = createRoute({
  method: "post",
  path: "/api/auth/email-verification",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerificationCodeSchema,
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

export const requestResetPasswordRoute = createRoute({
  method: "post",
  path: "/api/auth/reset-password",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ResetPasswordSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
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

export const newResetPasswordRoute = createRoute({
  method: "post",
  path: "/api/auth/reset-password/{token}",
  tags: ["Auth"],
  request: {
    params: z.object({
      token: z.string().openapi({ param: { name: "token", in: "path" } }),
    }),
    body: {
      content: {
        "application/json": {
          schema: NewPasswordSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
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
  path: "/api/auth/me",
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
