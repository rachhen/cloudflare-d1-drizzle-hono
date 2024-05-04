import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, z } from "@hono/zod-openapi";

import docs from "../docs";
import taskDocs from "../docs/task";

const docsRoute = new OpenAPIHono();

docsRoute.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

docsRoute.route("/", docs);
docsRoute.route("/", taskDocs);

docsRoute.doc("/specs", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});
docsRoute.get(
  "/",
  swaggerUI({ url: "/api/docs/specs", persistAuthorization: true })
);

export default docsRoute;
