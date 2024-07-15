// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "dev"}`;
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 8080;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "A simple Express API application documented with Swagger",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/router/*.ts"], // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
