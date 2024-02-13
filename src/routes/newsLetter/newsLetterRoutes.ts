import express from "express";
import {
  getAllNewsLetterSubscribers,
  postNewsLetter,
  subscribeToNewsLetter,
} from "../../controllers/newsLetterController";
import { protectSuperAdmin } from "../../controllers/userController";

const router = express.Router();

router.post("/subscribe", subscribeToNewsLetter);
router.get("/get", getAllNewsLetterSubscribers);
router.post("/post", protectSuperAdmin, postNewsLetter);

export { router as newsLetterRoutes };
