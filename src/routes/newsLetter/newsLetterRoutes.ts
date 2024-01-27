import express from "express";
import {
  getAllNewsLetterSubscribers,
  subscribeToNewsLetter,
} from "../../controllers/newsLetterController";

const router = express.Router();

router.post("/subscribe", subscribeToNewsLetter);
router.get("/get", getAllNewsLetterSubscribers);

export { router as newsLetterRoutes };
