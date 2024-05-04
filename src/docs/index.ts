import { OpenAPIHono } from "@hono/zod-openapi";

import { currentUserRoute, loginRoute, registerRoute } from "./auth";

const docs = new OpenAPIHono();

function createResponse() {
  return {
    user: {
      id: "123123",
      email: "user@exmaple.com",
      createdAt: 0,
      emailVerified: false,
      fullName: "User",
    },
    token: "asUcSEDgfZC9IvR21W1N0hl8HkPtyyGT",
  };
}

docs.openapi(registerRoute, async (c) => {
  return c.json(createResponse(), 201);
});

docs.openapi(loginRoute, (c) => {
  return c.json(createResponse(), 200);
});

docs.openapi(currentUserRoute, (c) => {
  return c.json(createResponse().user, 200);
});

export default docs;
