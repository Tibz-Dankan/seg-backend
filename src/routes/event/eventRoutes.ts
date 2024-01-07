import express from "express";
import { protectSuperAdmin } from "../../controllers/userController";
import { uploadFiles } from "../../utils/upload";
import {
  postEvent,
  uploadEventImages,
  updateEvent,
} from "../../controllers/eventsController";

const router = express.Router();

router.post(
  "/post-event",
  uploadFiles,
  protectSuperAdmin,
  postEvent,
  uploadEventImages
);
router.patch("/update-event/:eventId", protectSuperAdmin, updateEvent);

export { router as eventRoutes };
