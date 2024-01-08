import express from "express";
import { protectSuperAdmin } from "../../controllers/userController";
import { uploadFiles, uploadFile } from "../../utils/upload";
import {
  postEvent,
  uploadEventImages,
  updateEvent,
  getEvent,
  getAllEvents,
  updateEventImage,
  deleteEventImage,
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
router.patch(
  "/update-event-image/:eventImageId",
  uploadFile,
  protectSuperAdmin,
  updateEventImage
);
router.delete("/delete-event-image/:eventImageId", deleteEventImage);

export { router as eventRoutes };
