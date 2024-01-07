import express from "express";
import { protectSuperAdmin } from "../../controllers/userController";
import { uploadFiles } from "../../utils/upload";
import {
  postEvent,
  uploadEventImages,
} from "../../controllers/eventsController";

const router = express.Router();

router.post(
  "/post-event",
  uploadFiles,
  protectSuperAdmin,
  postEvent,
  uploadEventImages
);

export { router as eventRoutes };
