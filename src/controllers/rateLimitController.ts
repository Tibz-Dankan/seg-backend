import { rateLimit } from "express-rate-limit";

export const rateLimitController = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: 12,
  message: "Too many requests",
  legacyHeaders: true,
});
