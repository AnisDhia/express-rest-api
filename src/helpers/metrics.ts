import express from "express";
import client from "prom-client";
import log from "./logger";

const app = express();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});

export function startMetricsServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();
  httpRequestDurationMicroseconds.observe(
    { method: "GET", route: "/users", code: 200 },
    0.1
  );

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);

    return res.send(await client.register.metrics());
  });

  app.listen(8081, () => {
    log.info(`Metrics server listening to http://localhost:8081/metrics`);
  });
}
