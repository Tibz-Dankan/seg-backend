import { rateLimit } from "express-rate-limit";

let requestLimit: number;

if (process.env.NODE_ENV === "test") {
  requestLimit = 40;
} else {
  requestLimit = 15;
}

export const rateLimitController = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: requestLimit,
  message: "Too many requests",
  legacyHeaders: true,
});
