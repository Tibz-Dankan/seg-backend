import express from "express";
import { getMetrics } from "../../controllers/monitoringController";

const router = express.Router();

router.get("/metrics", getMetrics);

export { router as monitoringRoutes };
