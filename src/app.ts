import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import http from "http";
import { errorController } from "./controllers/errorController";
import { rateLimitController } from "./controllers/rateLimitController";
import { userRoutes } from "./routes/auth/userRoutes";
import { tokenRoutes } from "./routes/token/tokenRoutes";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.FRONTEND_URL }));
} else {
  app.use(cors());
}

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use(rateLimitController);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tokens", tokenRoutes);

app.use(errorController);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: "Endpoint not found!",
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`SEG server running on port ${PORT}`);
});

export { server };
