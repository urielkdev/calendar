import { Express } from "express";
import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "./package.json";

const port = process.env.SERVER_PORT;

// Swagger definition
const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Calendar API",
    version,
    description: "API documentation for Calendar API",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for the swagger-jsdoc
const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/app/entities/*.ts", "./src/routes/*.ts"],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.info(`Docks available at http://localhost:${port}/docs`);
};

export default swaggerDocs;
