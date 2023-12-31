import express from "express";
import { protect } from "../controllers/userController";
import {
  generateSignupToken,
  getSignupTokensByGeneratedByUserId,
  editSignupToken,
  deleteSignupToken,
  getAllSignupTokens,
} from "../controllers/tokenController";

const router = express.Router();

router.post("/generate-signup-token", protect, generateSignupToken);
router.get("/get-signup-token", protect, getSignupTokensByGeneratedByUserId);
router.get("/get-all-token", protect, getAllSignupTokens);
router.patch("/edit-signup-token", protect, editSignupToken);
router.delete("/delete-signup-token", protect, deleteSignupToken);

export { router as tokenRoutes };
