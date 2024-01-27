import express from "express";
import { subscribeToNewsLetter } from "../../controllers/newsLetterController";

const router = express.Router();

router.post("/subscribe", subscribeToNewsLetter);

export { router as newsLetterRoutes };
