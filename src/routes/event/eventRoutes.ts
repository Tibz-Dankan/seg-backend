import express from "express";
import { protectSuperAdmin } from "../../controllers/userController";
import { uploadFiles } from "../../utils/upload";
import {
  postEvent,
  uploadEventImages,
  updateEvent,
  getEvent,
  getAllEvents,
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
router.get("/get-event/:eventId", getEvent);
router.get("/get-all-events", getAllEvents);

export { router as eventRoutes };
