import express from "express";
import http from "http";
import bodyParer from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes";
import dotenv from "dotenv";
import setupSwagger from "./swagger";
import { startMetricsServer } from "./helpers/metrics";
import log from "./helpers/logger";

// Load environment variables from .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || "dev"}`;
dotenv.config({ path: envFile });

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParer.json());

setupSwagger(app);

const server = http.createServer(app);

startMetricsServer();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  log.info(`Server is running on http://localhost:${PORT}/`);
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error) => {
  console.error(error);
});

app.use("/", router());
