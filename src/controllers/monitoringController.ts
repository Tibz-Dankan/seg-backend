import promClient from "prom-client";
import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const register = new promClient.Registry();

register.setDefaultLabels({
  app: "seg-backend",
});

promClient.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // buckets for response time from 0.1ms to 500ms
});

register.registerMetric(httpRequestDurationMicroseconds);

export const startRequestMonitoringTimer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.startTimeInMs = Date.now();
  next();
};

export const endRequestMonitoringTimer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const responseTimeInMs = Date.now() - res.locals.startTimeInMs;
  const statusCode = res.statusCode.toString();

  httpRequestDurationMicroseconds
    .labels(req.method, req.route.path, statusCode)
    .observe(responseTimeInMs);

  next();
};

export const getMetrics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Content-Type", register.contentType);
    res.end(register.metrics());
  }
);
